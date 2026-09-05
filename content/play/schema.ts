/**
 * The simulator's data model — typed and small (blueprint 3.0 §11.1–11.3).
 * Pure types + a few constants; no logic, no React. The engine (lib/engine/*)
 * and the content fixtures (content/play/*) both build on these.
 */

import type {
  GaugeKey,
  OutcomeBandName,
  Spread,
  Reversibility,
} from "@/content/bands";
import {
  PRIORITY_KEYS,
  PRIORITY_LABEL,
  PRIORITY_NOTE,
  type ConstraintProfile,
  type PriorityKey,
  type PrioritySet,
} from "@/content/sim/schema";

/* ---- Objectives and leaning (character creation, §3.3) ---- */

/**
 * WHAT WINNING MEANS — the priority set (blueprint 4.0 §2.3.5, a sanctioned Arc
 * delta). 3.0's four play objectives (stability, autonomy, craft, service) are
 * SUPERSEDED by the §3.6 ten-priority set, so that there is ONE "what winning
 * means" instrument product-wide rather than two that disagree. The arc's
 * creation and parse adopt it; `/guidance`, the real-life tool, keeps its own
 * four objectives, which are a different thing and are unchanged.
 *
 * The old names survive as aliases so the arc's engine and templates keep
 * reading the way they did; what they point at is the ten-priority vocabulary.
 */
export const OBJECTIVE_KEYS = PRIORITY_KEYS;
export type ObjectiveKey = PriorityKey;
export const OBJECTIVE_LABEL: Record<ObjectiveKey, string> = PRIORITY_LABEL;
export const OBJECTIVE_NOTE: Record<ObjectiveKey, string> = PRIORITY_NOTE;

export type WinWeights = PrioritySet;

/** A temperament emphasis — flavors framing, never gates an option (G-10). */
export const LEANING_KEYS = ["curious", "careful", "social", "maker"] as const;
export type LeaningKey = (typeof LEANING_KEYS)[number];

export const LEANING_LABEL: Record<LeaningKey, string> = {
  curious: "curious",
  careful: "careful",
  social: "social",
  maker: "maker",
};

export const LEANING_NOTE: Record<LeaningKey, string> = {
  curious: "drawn to the new door before the safe one",
  careful: "measures twice, protects the floor first",
  social: "thinks through people, moves with a group",
  maker: "happiest with hands on a real thing",
};

/* ---- Effects (§11.2, the physics) ---- */

/**
 * The one way the world changes. Every outcome variant and beat carries this.
 * Band-step deltas per gauge (integer steps on the five-band scale, clamped),
 * skill grants, relationship-mark changes, condition set/clear, constraint-flag
 * changes. Consequences, the compounding curves, and the parse are ALL computed
 * from the run's effect history — nothing narrative-only pretends to be mechanical.
 */
export type Effects = {
  gauge?: Partial<Record<GaugeKey, number>>;
  skills?: string[];
  relationships?: RelationshipDelta[];
  conditionsSet?: string[];
  conditionsClear?: string[];
  flagsSet?: string[];
  flagsClear?: string[];
};

export type RelationshipDelta = {
  id: string;
  /** Optional display label — set when the mark is first introduced. */
  label?: string;
  /** Quality step: +1 deepens, -1 strains. */
  quality: number;
};

/* ---- The resolution contract (§3.5) ---- */

/**
 * One declared outcome band on an option. The draw maps deterministically to
 * exactly one of an option's bands; the band selects this authored variant.
 * `weight` is the BASE width; hand and state modify widths at resolve time —
 * never adding or removing bands.
 */
export type Band = {
  name: OutcomeBandName;
  /** Base width on the distribution strip (relative; normalized at resolve). */
  weight: number;
  /** At most one band per option may set this — the failure band (§3.5). */
  failure?: boolean;
  outcome: {
    /** ≤ 40-word consequence line (§3.5). Edition-neutral (§11.4 edition rule). */
    line: string;
    effects: Effects;
  };
};

export type PositionNote = {
  /** Which hand condition this note speaks to (a constraint-flag id, or "floor"/"no-floor"). */
  when: string;
  text: string;
};

export type OptionFlag = "recovery" | "endurance";

/**
 * One enumerated option on a decision card. Honest chips; a declared band set.
 * Endurance options (an honest "no good move" route) MUST name a support route
 * in `supportLink` — gate S-3 verifies this.
 */
export type Option = {
  id: string;
  /** Edition-neutral action label (§11.4). */
  label: string;
  chips: {
    /** Costs, including the invisible ones (slack, attention, relationship credit). */
    costs: string[];
    variance: Spread;
    reversibility: Reversibility;
    /** Position chips shown only when the named hand condition holds (§3.5). */
    positionNotes?: PositionNote[];
  };
  flags?: OptionFlag[];
  /** Required when flags includes "endurance": the real support route it names. */
  supportLink?: string;
  /**
   * What visibly moves this option's odds (§3.5: skill and position move band
   * WIDTHS, never add or remove bands). Optional; when absent, only the
   * character's global footing (slack) reshapes the strip.
   */
  sensitivity?: {
    /** A high value of this gauge shifts weight toward the better bands. */
    gauge?: GaugeKey;
    /** Holding this skill shifts weight toward the better bands. */
    skill?: string;
    /** Each of these hand flags, if present, shifts weight toward the worse bands. */
    penaltyFlags?: string[];
    /** Reshape strength 0..1 (default 0.5). */
    strength?: number;
  };
  bands: Band[];
};

/** Card families drive the art frame + icon set (§5). */
export const CARD_FAMILIES = [
  "home",
  "school",
  "threshold",
  "work",
  "money",
  "people",
  "health",
  "civic",
  "inner",
] as const;
export type CardFamily = (typeof CARD_FAMILIES)[number];

/**
 * A decision card — the atom of play (§3.5, §11.3). Stable, type-prefixed id.
 */
export type DecisionCard = {
  id: string;
  act: number;
  family: CardFamily;
  /** Concrete, second-person, ≤ 60 words (§3.5). Edition-neutral. */
  setup: string;
  /** 2–4 enumerated options (§3.5). */
  options: Option[];
  /** The mechanic card this teaches — a "why this happened" target (§5). */
  mechanicLink?: string;
  /** Constraint flags this card requires to appear (drawn from the hand). */
  requiresFlags?: string[];
  /** Constraint flags that suppress this card. */
  excludesFlags?: string[];
  /** Pool-selection weight within its act. */
  weight?: number;
  /** True if this card belongs to the recovery-bearing pool (has a recovery/endurance option). Computed by a helper, but may be authored for clarity. */
  recoveryCard?: boolean;
  /**
   * The designated slack shock (§3.5): at this card's resolve, the consequence
   * renders the counterfactual strip — the same draw landing at a different buffer
   * level, side by side — so the slack lesson is deterministic regardless of the
   * player's actual buffer.
   */
  shock?: boolean;
};

/* ---- Scripted beats (§7.2, §11.3) ---- */

/**
 * A scripted beat — the ONLY place loss-tier content may appear. Always
 * skippable, always reduced-frame, always carries the real-world page it names.
 */
export type ScriptedBeat = {
  id: string;
  act: number;
  type: "scripted";
  skippable: true;
  reducedFrame: true;
  /** The real-world page this beat names — required, the sim's crisis channel (§7.2). */
  realPageLink: string;
  /** Short reduced-frame prose. No chips, no cost/reward language. */
  prose: string;
  /** A skipped beat renders downstream as at most this one neutral factual line (§3.7). */
  skippedLine: string;
  /** If unskipped, effects may apply — but the beat is never a "turning point". */
  effects?: Effects;
};

/* ---- The committed-choice list (§3.8, gate S-7) ---- */

/**
 * The run's committed decision list — the replay ledger. Draws derive purely from
 * (drawSeed, cardId); win-weight edits at act boundaries are recorded here too so
 * S-7's determinism replay covers them. Skips and beat resolutions are recorded
 * for faithful downstream rendering, but never consume RNG.
 */
export type CommittedEntry =
  | { kind: "decision"; cardId: string; optionId: string }
  | { kind: "weights"; weights: WinWeights }
  | { kind: "beat"; beatId: string; skipped: boolean };

/* ---- The state vector (§11.1) ---- */

export type RelationshipMark = {
  id: string;
  label: string;
  /** Quality band, clamped small; display is qualitative. */
  quality: number;
};

/** The Birth RNG hand — drawn, not chosen (§3.3). */
export type Hand = {
  era: string;
  household: string;
  family: string;
  health: string;
  environment: string;
  /** Constraint flags this hand sets. */
  flags: string[];
  /**
   * THE CONSTRAINT PROFILE (§2.3.1), which replaces 3.0's single difficulty tier.
   * Per-axis only — what this start makes expensive — with no composite anywhere.
   * The tier field is gone, not deprecated: there is nothing left to render it.
   */
  profile: ConstraintProfile;
};

export type RunPhase =
  | "prologue"
  | "briefing"
  | "creation"
  | "acts"
  | "endOfLife"
  | "parse"
  | "return";

/**
 * The run-state schema version. A named save records it, and a save from an
 * older one is DECLARED unresumable rather than silently resumed (§2.4).
 */
export const CURRENT_RUN_VERSION = 1;

export type RunState = {
  version: typeof CURRENT_RUN_VERSION;
  phase: RunPhase;
  /** Seeds — hand and draw separated (§3.8). */
  handSeed: string;
  drawSeed: string;
  /** The accepted hand (persisted; redraws replace it before acceptance). */
  hand: Hand | null;
  /** Chosen at creation, editable at act boundaries. */
  winWeights: WinWeights;
  leaning: LeaningKey | null;
  /** The four gauges (0..4). */
  gauges: Record<GaugeKey, number>;
  skills: string[];
  relationships: RelationshipMark[];
  conditions: string[];
  flags: string[];
  /** 0-based act pointer; equals ACT_COUNT while in the end-of-life phase. */
  act: number;
  /** Index of the current slot within the current act's (or end-of-life's) plan. */
  cardIndex: number;
  /**
   * Whether the last resolved decision landed in a failure band. Derived state
   * (reproduced on rebuild), reset at each act boundary — steers the next card to
   * the recovery-bearing pool (§3.5). NOT part of the replay ledger.
   */
  lastOutcomeFailure: boolean;
  /** The replay ledger (§3.8). */
  committed: CommittedEntry[];
  /** Whether the illustrative "this is a model" note has been shown this run. */
  notedIllustrative: boolean;
};
