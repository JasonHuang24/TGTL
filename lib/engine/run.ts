/**
 * The run engine (blueprint 3.0 §3, §3.8). Pure transition functions over the
 * RunState — no React, no I/O. RNG is consumed ONLY in the commit handlers, via
 * the pure hashToUnit; render, resume, and "why" detours never perturb a draw
 * (gate S-7). Selection, resolution, effects, and the parse are all deterministic
 * given (handSeed, drawSeed, committed list).
 */

import { GAUGE_KEYS, type GaugeKey, type OutcomeBandName } from "@/content/bands";
import { makeProfile } from "@/content/sim/profile";
import type { ConstraintProfile } from "@/content/sim/schema";
import { OBJECTIVE_KEYS, type WinWeights, type LeaningKey } from "@/content/play/schema";
import type {
  RunState,
  RunPhase,
  DecisionCard,
  Option,
  ScriptedBeat,
} from "@/content/play/schema";
import { hashToUnit, weightedIndex } from "@/lib/engine/rng";
import { applyEffects, deriveSlack } from "@/lib/engine/effects";
import { resolve, type Resolution } from "@/lib/engine/resolve";
import { drawHand } from "@/lib/engine/hand";
import { ACTS, ACT_COUNT, END_OF_LIFE, type Slot } from "@/content/play/acts";
import { CARD_BY_ID, cardsForAct } from "@/content/play/cards";
import { BEATS } from "@/content/play/beats";
import { ACHIEVEMENT_RULES, INVISIBLE_WORK_ACHIEVEMENT } from "@/content/play/parse-copy";

/** End-of-life uses this sentinel act number for its card pool. */
export const END_OF_LIFE_ACT = 9;

export const DEFAULT_WEIGHTS: WinWeights = (() => {
  const w = {} as WinWeights;
  for (const k of OBJECTIVE_KEYS) w[k] = 0;
  // A quiet, honest default: a floor and the people around you. Revisable, and
  // the creation screen is where the player actually sets it.
  w.safety = 1;
  w.closeness = 1;
  return w;
})();

export function initRun(config: { handSeed: string; drawSeed: string }): RunState {
  const gauges = {} as Record<GaugeKey, number>;
  for (const k of GAUGE_KEYS) gauges[k] = 2;
  return {
    version: 1,
    phase: "prologue",
    handSeed: config.handSeed,
    drawSeed: config.drawSeed,
    hand: null,
    winWeights: { ...DEFAULT_WEIGHTS },
    leaning: null,
    gauges,
    skills: [],
    relationships: [],
    conditions: [],
    flags: [],
    act: 0,
    cardIndex: 0,
    lastOutcomeFailure: false,
    committed: [],
    notedIllustrative: false,
  };
}

export function withPhase(state: RunState, phase: RunPhase): RunState {
  return { ...state, phase };
}

/** Set win-weights (creation and each aims audit); recorded in the ledger (§3.8). */
export function setWinWeights(state: RunState, weights: WinWeights): RunState {
  const clean = {} as WinWeights;
  for (const k of OBJECTIVE_KEYS) clean[k] = Math.max(0, Math.round(weights[k] ?? 0));
  return { ...state, winWeights: clean, committed: [...state.committed, { kind: "weights", weights: clean }] };
}

export function setLeaning(state: RunState, leaning: LeaningKey): RunState {
  return { ...state, leaning };
}

/**
 * Accept the current hand-seed's hand: draw it, initialize the state vector from
 * it, and enter the acts. A redraw is the caller replacing handSeed and calling
 * this again; the accepted hand-seed is the one that persists and replays (§3.3).
 */
export function acceptHand(state: RunState): RunState {
  const drawn = drawHand(state.handSeed);
  return {
    ...state,
    hand: drawn.hand,
    gauges: drawn.startGauges,
    conditions: [...drawn.startConditions],
    flags: [...drawn.hand.flags],
    act: 0,
    cardIndex: 0,
    lastOutcomeFailure: false,
    phase: "acts",
  };
}

/* ---- Slot plan ---- */

export function slotsFor(state: RunState): Slot[] {
  if (state.phase === "endOfLife") return END_OF_LIFE.slots;
  const act = ACTS[state.act];
  return act ? act.slots : [];
}

export function currentSlot(state: RunState): Slot | null {
  const slots = slotsFor(state);
  return state.cardIndex < slots.length ? slots[state.cardIndex] : null;
}

/** The card-pool act number for the current phase. */
export function poolActNumber(state: RunState): number {
  if (state.phase === "endOfLife") return END_OF_LIFE_ACT;
  return ACTS[state.act]?.n ?? 0;
}

/** Card ids already committed this run (so a card is never repeated). */
function usedCardIds(state: RunState): Set<string> {
  const s = new Set<string>();
  for (const e of state.committed) if (e.kind === "decision") s.add(e.cardId);
  return s;
}

/**
 * Deterministic selection of the card for the current decision/watched slot.
 * After a failure-band outcome, the pool is filtered to recovery-bearing cards
 * (§3.5). Pure: same (drawSeed, act, slot, used-set, flags) ⇒ same card.
 */
export function selectCard(state: RunState): DecisionCard | null {
  const slot = currentSlot(state);
  if (!slot || slot.kind === "beat") return null;
  // A fixed-card slot always plays its named card (e.g. the slack shock, §3.5).
  if (slot.kind === "card") return CARD_BY_ID[slot.cardId] ?? null;
  const used = usedCardIds(state);
  const actNum = poolActNumber(state);
  let pool = cardsForAct(actNum).filter(
    (c) =>
      !used.has(c.id) &&
      (c.requiresFlags ?? []).every((f) => state.flags.includes(f)) &&
      !(c.excludesFlags ?? []).some((f) => state.flags.includes(f)),
  );
  if (pool.length === 0) return null;

  if (state.lastOutcomeFailure) {
    const recovery = pool.filter((c) => isRecoveryCard(c));
    if (recovery.length > 0) pool = recovery; // else: honest no-recovery, keep pool (rare; S-3 guards)
  }

  const weights = pool.map((c) => Math.max(0.0001, c.weight ?? 1));
  const unit = hashToUnit(state.drawSeed, `select:a${poolActNumber(state)}:s${state.cardIndex}`);
  return pool[weightedIndex(unit, weights)];
}

export function isRecoveryCard(card: DecisionCard): boolean {
  if (card.recoveryCard) return true;
  return card.options.some((o) => (o.flags ?? []).some((f) => f === "recovery" || f === "endurance"));
}

/* ---- Commit handlers (the ONLY place RNG is consumed) ---- */

export type DecisionResult = {
  state: RunState;
  card: DecisionCard;
  option: Option;
  resolution: Resolution;
};

/** The pure draw for a card — the single source of its luck (§3.8). */
export function drawFor(state: RunState, cardId: string): number {
  return hashToUnit(state.drawSeed, cardId);
}

export function commitDecision(state: RunState, card: DecisionCard, optionId: string): DecisionResult {
  const option = card.options.find((o) => o.id === optionId) ?? card.options[0];
  const draw = drawFor(state, card.id);
  const resolution = resolve(option, state, draw);
  const applied = applyEffects(state, resolution.band.outcome.effects);
  const committed = [...state.committed, { kind: "decision" as const, cardId: card.id, optionId: option.id }];
  const advanced = advance({
    ...applied,
    committed,
    lastOutcomeFailure: Boolean(resolution.band.failure),
  });
  return { state: advanced, card, option, resolution };
}

/** Auto-resolve a watched-act formative draw, narrated as made-for-you (§3.4). */
export function commitWatched(state: RunState): DecisionResult | null {
  const card = selectCard(state);
  if (!card) {
    return null;
  }
  const unit = hashToUnit(state.drawSeed, `watched-opt:${card.id}`);
  const option = card.options[Math.min(card.options.length - 1, Math.floor(unit * card.options.length))];
  return commitDecision(state, card, option.id);
}

export function commitBeat(state: RunState, skipped: boolean): { state: RunState; beat: ScriptedBeat | null } {
  const slot = currentSlot(state);
  if (!slot || slot.kind !== "beat") return { state, beat: null };
  const beat = BEATS[slot.beatId] ?? null;
  let applied = state;
  if (beat && !skipped && beat.effects) applied = applyEffects(state, beat.effects);
  const committed = [...state.committed, { kind: "beat" as const, beatId: slot.beatId, skipped }];
  return { state: advance({ ...applied, committed }), beat };
}

/** Advance the slot pointer, crossing act and phase boundaries as needed. */
export function advance(state: RunState): RunState {
  const slots = slotsFor(state);
  const nextIndex = state.cardIndex + 1;
  if (nextIndex < slots.length) return { ...state, cardIndex: nextIndex };

  if (state.phase === "endOfLife") return { ...state, phase: "parse", cardIndex: 0 };

  const nextAct = state.act + 1;
  if (nextAct >= ACT_COUNT) {
    return { ...state, act: ACT_COUNT, cardIndex: 0, phase: "endOfLife", lastOutcomeFailure: false };
  }
  return { ...state, act: nextAct, cardIndex: 0, lastOutcomeFailure: false };
}

/* ---- Derived views ---- */

export function slack(state: RunState): number {
  return deriveSlack(state.gauges, state.conditions);
}

/* ---- Serialization (§3.8, quota-safe writing handled by the storage layer) ---- */

export function serializeRun(state: RunState): string {
  return JSON.stringify(state);
}

export function deserializeRun(raw: string): RunState | null {
  try {
    const parsed = JSON.parse(raw) as RunState;
    if (!parsed || parsed.version !== 1 || !parsed.gauges) return null;
    return parsed;
  } catch {
    return null;
  }
}

/* ---- The post-mortem parse (§3.7) ---- */

export type TurningPoint = {
  cardId: string;
  family: string;
  setup: string;
  optionLabel: string;
  band: OutcomeBandName;
  failure: boolean;
  recovery: boolean;
  /**
   * True when this draw landed in a WATCHED act (§3.4) — the call was made *for*
   * the character, not chosen. The parse renders these as decided-for-you context
   * with no skill/draw framing (there was no button).
   */
  watched: boolean;
  /** Signed skill+position shift, for the skill/draw split display. */
  shift: number;
  /** Marker position 0..1 — the draw. */
  marker: number;
};

export type ParseSummary = {
  hand: RunState["hand"];
  /** The per-axis constraint profile (§2.3.1) — never a tier, never a composite. */
  profile: ConstraintProfile;
  winWeights: WinWeights;
  turningPoints: TurningPoint[];
  /** Per-act slack trajectory (for the compounding curve), one entry per completed act. */
  slackByAct: number[];
  gaugesFinal: Record<GaugeKey, number>;
  skillsFinal: string[];
  conditionsFinal: string[];
  relationshipsFinal: { id: string; label: string; quality: number }[];
  achievements: string[];
  /** Scripted beats encountered, for reduced-frame skip-propagation rendering (§3.7). */
  scriptedNotes: { beatId: string; skipped: boolean }[];
};

/**
 * Compute the parse by replaying the committed ledger from a fresh accepted hand,
 * capturing each decision's resolution (the skill/draw split) and the slack
 * trajectory. Pure and reproducible; consumes RNG only via the same pure draws.
 */
export function computeParse(state: RunState): ParseSummary {
  let s = acceptHand(initRun({ handSeed: state.handSeed, drawSeed: state.drawSeed }));
  const turningPoints: TurningPoint[] = [];
  const slackByAct: number[] = [];
  const scriptedNotes: { beatId: string; skipped: boolean }[] = [];
  let lastCardAct = -1;

  for (const entry of state.committed) {
    if (entry.kind === "weights") {
      s = { ...s, winWeights: entry.weights };
      continue;
    }
    if (entry.kind === "beat") {
      const beat = BEATS[entry.beatId];
      scriptedNotes.push({ beatId: entry.beatId, skipped: entry.skipped });
      if (beat && !entry.skipped && beat.effects) s = applyEffects(s, beat.effects);
      continue;
    }
    // decision
    const card = CARD_BY_ID[entry.cardId];
    if (!card) continue;
    const option = card.options.find((o) => o.id === entry.optionId) ?? card.options[0];
    const draw = hashToUnit(s.drawSeed, card.id);
    const res = resolve(option, s, draw);
    // Snapshot the buffer at each act boundary — the compounding curve (§1, §3.7).
    if (card.act !== lastCardAct) {
      slackByAct.push(deriveSlack(s.gauges, s.conditions));
      lastCardAct = card.act;
    }
    turningPoints.push({
      cardId: card.id,
      family: card.family,
      setup: card.setup,
      optionLabel: option.label,
      band: res.band.name,
      failure: Boolean(res.band.failure),
      recovery: (option.flags ?? []).some((f) => f === "recovery" || f === "endurance"),
      // Watched acts (§3.4): the call was made *for* the character — no button existed.
      watched: Boolean(ACTS.find((a) => a.n === card.act)?.watched),
      shift: res.shift,
      marker: res.marker,
    });
    s = applyEffects(s, res.band.outcome.effects);
  }
  slackByAct.push(deriveSlack(s.gauges, s.conditions));

  return {
    hand: state.hand ?? s.hand,
    profile: (state.hand ?? s.hand)?.profile ?? makeProfile({ money: 1, backing: 1, body: 1, place: 1 }),
    winWeights: state.winWeights,
    turningPoints,
    slackByAct,
    gaugesFinal: s.gauges,
    skillsFinal: s.skills,
    conditionsFinal: s.conditions,
    relationshipsFinal: s.relationships.map((r) => ({ id: r.id, label: r.label, quality: r.quality })),
    achievements: deriveAchievements(s),
    scriptedNotes,
  };
}

/**
 * The achievement list for the life (§3.7 / brief §6B): narrative, never counted,
 * never ranked. Templates live in content/play/parse-copy.ts so the gates lint
 * them. The invisible, domestic, ordinary work is always named last.
 */
function deriveAchievements(s: RunState): string[] {
  const out = ACHIEVEMENT_RULES.filter((r) => r.when(s)).map((r) => r.line);
  out.push(INVISIBLE_WORK_ACHIEVEMENT);
  return out;
}
