/**
 * THE SEASON — the sandbox atom (blueprint 4.0 §3.4) and its canonical
 * resolution order (§7.6, LITERAL).
 *
 *   consequences due
 *     → scheduled events
 *       → committed actions, in allocation order
 *         → companion / chance events
 *           → season-end bookkeeping
 *
 * Two rules make this a sandbox rather than rails with an allocation screen:
 *
 *   THE FLOOR SET (§3.4, LITERAL). Rest/maintain, wait, and seek-help are
 *   available and affordable in EVERY campaign state — zero cost, so they stay
 *   playable at zero pips — and every season offers at least three affordable
 *   allocations spanning at least two families. Not a design intention: an
 *   assertion, checked here at build time by `floorReport` and over whole fleets
 *   by S-10, including deliberately drained states.
 *
 *   THE INVALIDATION RULE (§7.6). If an earlier-resolving event removes a
 *   committed action's premise — a layoff before the overtime shift — the action
 *   converts or refunds by an authored rule on the event, and the player is told
 *   plainly. There is no silent fizzle anywhere in this engine.
 *
 * Event SELECTION is a pure function of (seeds, committed prefix, state), decided
 * once at the top of the season, so the plan is stable across replays and the
 * explain drawer can always name what arrived and why.
 *
 * RNG is consumed ONLY in the commit handlers here, through the pure derived
 * draws of lib/sim/rng — never in render, resume, or an explain detour.
 */

import { type GaugeKey } from "@/content/bands";
import { drawFor, selectionDraw, weightedIndex } from "@/lib/sim/rng";
import { applyEffects, applyAll, isDeeplyDepleted, isHighLoad } from "@/lib/sim/effects";
import { resolve, outcomeLine, type Resolution } from "@/lib/sim/resolve";
import { classify, renderable } from "@/lib/sim/attribution";
import { insert as queueInsert, step as queueStep, type QueueStep } from "@/lib/sim/queue";
import {
  deriveBudget,
  emptyBudget,
  costOf,
  addBudget,
  subtractBudget,
  isAffordable,
  restRecoverySteps,
  budgetTotal,
  canAffordStanding,
  lapsingStanding,
} from "@/lib/sim/economy";
import {
  ACTIONS,
  ACTION_BY_ID,
  EVENTS,
  EVENT_BY_ID,
  COMPANIONS,
  COMPANION_BY_ID,
  BEATS,
  FLOOR_ACTION_IDS,
  SEASON_COUNT,
  beatPlacements,
} from "@/content/sim/registry";
import type {
  ActionCost,
  Budget,
  CardFamily,
  CommittedAllocation,
  CommittedEventResponse,
  CommittedSeason,
  CompanionState,
  Effects,
  QueueEntry,
  RecoveryTie,
  ResolvedItem,
  SeasonResult,
  SimAction,
  SimEvent,
  SimOption,
  SimState,
} from "@/content/sim/schema";

/* =========================================================================
   Pile-up physics (§5.2, mechanism 1) — published on /methodology
   ========================================================================= */

/** No season may deliver more than this many negative arrivals at once. */
export const MAX_NEGATIVE_ARRIVALS = 2;

/** How many non-scheduled events a season may draw at all. */
export const MAX_CHANCE_ARRIVALS = 2;

/**
 * How many companion events a season may deliver. One.
 *
 * Not a safety cap — a ceremony cap, and it is here because playtesting the first
 * season produced three companion arrivals at once (every arc firing its opening
 * node in the same season). Six arcs times twenty-four seasons is more knocking
 * on the door than a life has, and it drowns the player's own allocations in
 * other people's business. Which arc gets the season is a deterministic pure
 * function of the seeds, so a replay delivers the same person.
 */
export const MAX_COMPANION_ARRIVALS = 1;

export const PILEUP_RULES: string[] = [
  "A season delivers at most two negative arrivals, whatever else is pending. Life stacks; this model refuses to stack it without limit.",
  "At deep depletion — any gauge at depleted, or two or more at thin — the season stops drawing new negative chance events. The pressure already on you is the pressure you are playing against.",
  "This is state-derived and deterministic: the same state always produces the same mix. It is disclosed physics, not hidden mercy, and it reads the character's state, never yours.",
  "Scheduled events and consequences you have already set in motion still arrive. What is suppressed is fresh bad luck, not the results of what happened.",
  "At most one of the people in your life brings you something in any given season. Which one is decided in two steps, in this order: first, anyone whose relationship has reached a point of drifting, refusing or leaving goes ahead of everyone else — because those are responses, and a response that waits its turn is not a response. Then, among people on equal footing, the one you have gone longest without hears from you first. What remains genuinely level is settled by a draw derived from the state, so the same state always delivers the same person — and no one sits permanently second (the next rule says how).",
  "Among people on genuinely equal footing the slot rotates on a derived draw rather than a fixed order, so no one is permanently second in the queue. That first step means the companion channel leans toward the harder arrivals: a relationship going quiet outranks a relationship going well. It is disclosed here because it is a real thumb on what you hear about, and because the alternative — a drift you caused sitting silently in a queue behind a pleasant Saturday — would be worse.",
  "The deep-depletion suppression covers fresh chance and systemic events. It does NOT cover the people in your life: someone stepping back still steps back when you are at your lowest, because that is when it tends to happen and pretending otherwise would be the hidden mercy this section exists to refuse.",
];

/* =========================================================================
   Occurrence ordinals (§2.1) — derived, never stored
   ========================================================================= */

/** How many times `actionId` has already been committed before this season. */
export function instanceOrdinal(committed: CommittedSeason[], actionId: string): number {
  let n = 0;
  for (const season of committed) for (const a of season.allocations) if (a.actionId === actionId) n++;
  return n;
}

/* =========================================================================
   Availability and the affordable menu (§3.4)
   ========================================================================= */

export type MenuEntry = {
  action: SimAction;
  affordable: boolean;
  available: boolean;
  /** Plain reason, shown honestly when an action is out of reach. */
  reason?: string;
  cost: Budget;
  instanceOrdinal: number;
};

function inSeasonBands(bands: [number, number][], seasonIndex: number): boolean {
  const n = seasonIndex + 1;
  return bands.some(([lo, hi]) => n >= lo && n <= hi);
}

/** Is this action's premise met by the state? Honest gating, never hidden. */
export function availability(action: SimAction, state: SimState): { available: boolean; reason?: string } {
  if (action.floor) return { available: true };
  if (!inSeasonBands(action.seasonBands, state.seasonIndex))
    return { available: false, reason: "not something this stretch of the window offers" };
  for (const f of action.requiresFlags ?? [])
    if (!state.flags.includes(f)) return { available: false, reason: `needs ${plain(f)}` };
  for (const f of action.excludesFlags ?? [])
    if (state.flags.includes(f)) return { available: false, reason: `not while ${plain(f)}` };
  const p = action.contract.prerequisites;
  if (p) {
    for (const s of p.skills ?? [])
      if (!state.skills.includes(s)) return { available: false, reason: `needs ${plain(s)}` };
    for (const f of p.flags ?? [])
      if (!state.flags.includes(f)) return { available: false, reason: `needs ${plain(f)}` };
    for (const f of p.notFlags ?? [])
      if (state.flags.includes(f)) return { available: false, reason: `not while ${plain(f)}` };
    for (const [k, v] of Object.entries(p.minGauge ?? {}))
      if (state.gauges[k as GaugeKey] < (v as number))
        return { available: false, reason: `needs more ${plain(k)} than you have` };
    for (const [k, v] of Object.entries(p.minCapability ?? {}))
      if ((state.capabilities as Record<string, number>)[k] < (v as number))
        return { available: false, reason: `needs more ${plain(k)} than you have` };
  }
  // A non-repeatable action is spent once taken.
  if (!action.repeatable && instanceOrdinal(state.committed, action.id) > 0)
    return { available: false, reason: "already done — this one does not come round again" };
  // A standing commitment is a promise about future seasons, so the model checks
  // you can keep it BEFORE you make it rather than refunding you afterwards.
  if (action.standing && !canAffordStanding(state, action.standing.upkeep))
    return {
      available: false,
      reason: "this would take every hour the season has, every season — there would be nothing left to do it with",
    };
  return { available: true };
}

/**
 * The season's action menu. Every action the campaign knows about, tagged with
 * whether it is available and whether it is affordable from `remaining`.
 */
export function menu(state: SimState, remaining: Budget): MenuEntry[] {
  return ACTIONS.map((action) => {
    const a = availability(action, state);
    const cost = costOf(action.contract.costs);
    return {
      action,
      available: a.available,
      affordable: a.available && isAffordable(remaining, action.contract.costs),
      reason: a.reason,
      cost,
      instanceOrdinal: instanceOrdinal(state.committed, action.id),
    };
  });
}

/** Everything the player can actually take right now. */
export function affordableMenu(state: SimState, remaining: Budget): MenuEntry[] {
  return menu(state, remaining).filter((m) => m.affordable);
}

/**
 * THE FLOOR ASSERTION (§3.4, LITERAL). Returns the evidence, so callers — the UI,
 * S-10's per-season telemetry, S-13's worst-case fleets — all check the same thing.
 */
export type FloorReport = {
  pass: boolean;
  affordableCount: number;
  families: CardFamily[];
  floorPresent: string[];
  floorMissing: string[];
  /**
   * Affordable options that are NOT the free floor set, and the families they
   * span. The §3.4 floor ("three affordable across two families") is satisfied
   * by the three free floor actions on their own — so a state where the floor
   * set is the ONLY thing left would pass the letter of the floor gate while
   * being exactly the silent rails §11 forbids. These two fields are what let
   * S-10 and S-13 tell those states apart.
   */
  nonFloorCount: number;
  nonFloorFamilies: CardFamily[];
  /**
   * The same counts with the SMALL-MOVE TIER excluded.
   *
   * These exist because the adversarial review of the reserved pip pointed out
   * that the tier — nine one-pip, prerequisite-free, whole-window actions, one
   * per family — could make `sandboxOpen` true by construction. It was right that
   * a gate which cannot fail is not a gate, and S-10a′ now proves this predicate
   * CAN fail (it goes false at a closed budget). It was wrong that the small
   * moves should be excluded from the standard: they are authored content with
   * real options, bands and effects, not scaffolding.
   *
   * So the fleets assert on `sandboxOpen` — the real standard — and REPORT these
   * fields, because the fact the reviewer surfaced is worth knowing and worth
   * publishing: below a certain budget the small moves are what keep the sandbox
   * open, and the rest of the pool is priced out. That is a true and load-bearing
   * property of the design, and hiding it would be the actual dishonesty.
   */
  nonFloorExcludingSmall: number;
  nonFloorFamiliesExcludingSmall: CardFamily[];
  /** True only when there is somewhere to go beyond stopping, waiting or asking. */
  sandboxOpen: boolean;
  /** The falsifiable form: open on the authored pool, ignoring the small moves. */
  sandboxOpenOnAuthoredPool: boolean;
  detail: string;
};

export function floorReport(state: SimState, remaining: Budget): FloorReport {
  const afford = affordableMenu(state, remaining);
  const families = [...new Set(afford.map((m) => m.action.family))];
  const nonFloor = afford.filter((m) => !m.action.floor);
  const nonFloorFamilies = [...new Set(nonFloor.map((m) => m.action.family))];
  const authored = nonFloor.filter((m) => !m.action.id.startsWith("act-small-"));
  const authoredFamilies = [...new Set(authored.map((m) => m.action.family))];
  const present = FLOOR_ACTION_IDS.filter((id) => afford.some((m) => m.action.id === id));
  const missing = FLOOR_ACTION_IDS.filter((id) => !present.includes(id));
  const sandboxOpen = nonFloor.length >= 2 && nonFloorFamilies.length >= 2;
  const sandboxOpenOnAuthoredPool = authored.length >= 2 && authoredFamilies.length >= 2;
  const pass = missing.length === 0 && afford.length >= 3 && families.length >= 2 && sandboxOpen;
  return {
    pass,
    affordableCount: afford.length,
    families,
    floorPresent: present,
    floorMissing: missing,
    nonFloorCount: nonFloor.length,
    nonFloorFamilies,
    nonFloorExcludingSmall: authored.length,
    nonFloorFamiliesExcludingSmall: authoredFamilies,
    sandboxOpen,
    sandboxOpenOnAuthoredPool,
    detail: `${afford.length} affordable across ${families.length} families (${nonFloor.length} beyond the floor set; ${authored.length} of those from the authored pool rather than the small-move tier, across ${authoredFamilies.length} families); floor set ${
      missing.length ? "MISSING " + missing.join(", ") : "complete"
    }`,
  };
}

/* =========================================================================
   Arrival selection — pure in (seeds, committed prefix, state)
   ========================================================================= */

export type Arrivals = {
  scheduled: SimEvent[];
  companion: SimEvent[];
  chance: SimEvent[];
  /** Negative arrivals suppressed by the §5.2 physics, for /methodology honesty. */
  suppressed: number;
};

function eventEligible(e: SimEvent, state: SimState): boolean {
  if (!inSeasonBands(e.seasonBands, state.seasonIndex)) return false;
  for (const f of e.requiresFlags ?? []) if (!state.flags.includes(f)) return false;
  for (const f of e.excludesFlags ?? []) if (state.flags.includes(f)) return false;
  // An event never repeats within a run.
  return !state.committed.some((s) => s.eventResponses.some((r) => r.eventId === e.id));
}

export function selectArrivals(state: SimState): Arrivals {
  const eligible = EVENTS.filter((e) => eventEligible(e, state));
  const depleted = isDeeplyDepleted(state.gauges);
  let negativeBudget = MAX_NEGATIVE_ARRIVALS;
  let suppressed = 0;

  const take = (e: SimEvent): boolean => {
    if (!e.negative) return true;
    if (negativeBudget <= 0) {
      suppressed++;
      return false;
    }
    negativeBudget--;
    return true;
  };

  /* 1. scheduled — fixed by campaign structure, never suppressed but still capped */
  const scheduled = eligible.filter(
    (e) => e.trigger.kind === "scheduled" && e.trigger.seasonIndex === state.seasonIndex,
  );
  for (const e of scheduled) if (e.negative) negativeBudget = Math.max(0, negativeBudget - 1);

  /* 2. companion — selected BY the relationship (§3.7), not scripted regardless.
        Every live arc offers what its currently-entered node has; the season
        delivers at most MAX_COMPANION_ARRIVALS of them, and which one is a pure
        function of the seeds. Arcs the player has been neglecting get priority,
        because the point of a neglect-response node is that it responds. */
  const offers: { arcId: string; event: SimEvent; priority: number }[] = [];
  for (const arc of COMPANIONS) {
    const cs = state.companions[arc.id];
    if (!cs || cs.exited) continue;
    const node = activeNode(arc.id, state);
    if (!node) continue;
    const pool = node.eventRefs.map((id) => EVENT_BY_ID[id]).filter((e): e is SimEvent => Boolean(e) && eventEligible(e, state));
    if (!pool.length) continue;
    const u = selectionDraw(state.drawSeed, state.seasonIndex, `companion:${arc.id}`);
    const chosen = pool[weightedIndex(u, pool.map((e) => Math.max(0.0001, e.weight ?? 1)))];
    if (!chosen) continue;
    const urgent = node.kind === "neglect-response" || node.kind === "leave" || node.kind === "refuse";
    offers.push({ arcId: arc.id, event: chosen, priority: (urgent ? 100 : 0) + cs.sinceContact });
  }
  // Among offers of EQUAL priority the slot rotates on a derived draw rather than
  // on arc id. Sorting by id looked harmless and was not: with one slot a season
  // and two live arcs, the alphabetically-earlier arc won every contested season
  // forever, and S-3's delivery check caught the other one holding a refuse node
  // for fifteen consecutive seasons without ever being heard from. A companion
  // who cannot get a word in is inventory by a slower route (§3.7).
  offers.sort((a, b) => b.priority - a.priority || (a.arcId < b.arcId ? -1 : 1));
  const companion: SimEvent[] = [];
  if (offers.length) {
    const top = offers.filter((o) => o.priority === offers[0].priority);
    const pick = top[Math.floor(selectionDraw(state.drawSeed, state.seasonIndex, "companion-slot") * top.length)] ?? top[0];
    const ordered = [pick, ...offers.filter((o) => o !== pick)];
    for (const offer of ordered) {
      if (companion.length >= MAX_COMPANION_ARRIVALS) break;
      // Companion arrivals gate on the same negative cap. A relationship's demand
      // is real, but the model will not compose a despair screen out of them.
      if (take(offer.event)) companion.push(offer.event);
    }
  }

  /* 3. chance and systemic — suppressed entirely at deep depletion if negative */
  const chance: SimEvent[] = [];
  const pool = eligible.filter(
    (e) => (e.trigger.kind === "chance" || e.trigger.kind === "systemic") && !scheduled.includes(e),
  );
  for (let slot = 0; slot < MAX_CHANCE_ARRIVALS; slot++) {
    const remaining = pool.filter((e) => !chance.includes(e));
    if (!remaining.length) break;
    const u = selectionDraw(state.drawSeed, state.seasonIndex, `chance:${slot}`);
    // A season does not always deliver an event; the empty slot is a real outcome.
    if (u < 0.35) continue;
    const picked = remaining[weightedIndex(selectionDraw(state.drawSeed, state.seasonIndex, `chance:${slot}`, 1), remaining.map((e) => Math.max(0.0001, e.weight ?? 1)))];
    if (!picked) continue;
    if (picked.negative && depleted) {
      suppressed++;
      continue;
    }
    if (take(picked)) chance.push(picked);
  }

  return { scheduled, companion, chance, suppressed };
}

/** The companion trajectory node whose entry conditions the state currently meets. */
export function activeNode(arcId: string, state: SimState) {
  const arc = COMPANION_BY_ID[arcId];
  const cs = state.companions[arcId];
  if (!arc || !cs || cs.exited) return null;
  const mark = state.relationships.find((r) => r.id === arcId);
  const quality = mark?.quality ?? 0;
  const candidates = arc.trajectory.filter((n) => {
    const c = n.entryConditions;
    if (c.minQuality !== undefined && quality < c.minQuality) return false;
    if (c.maxQuality !== undefined && quality > c.maxQuality) return false;
    if (c.minNeglect !== undefined && cs.neglect < c.minNeglect) return false;
    if (c.maxNeglect !== undefined && cs.neglect > c.maxNeglect) return false;
    if (c.minRepair !== undefined && cs.repair < c.minRepair) return false;
    if (c.minSeason !== undefined && state.seasonIndex < c.minSeason) return false;
    for (const f of c.requiresFlags ?? []) if (!state.flags.includes(f)) return false;
    for (const f of c.notFlags ?? []) if (state.flags.includes(f)) return false;
    return true;
  });
  if (!candidates.length) return null;
  // The furthest-along node whose conditions hold — the arc advances by state.
  return candidates.reduce((a, b) => (b.stage > a.stage ? b : a));
}

/* =========================================================================
   The season run — a pure step machine (§7.5 commit semantics)
   ========================================================================= */

export type PlanItem =
  | { kind: "consequence"; entry: QueueEntry }
  | { kind: "expiry"; entry: QueueEntry }
  | { kind: "event"; event: SimEvent; slot: "scheduled" | "companion" | "chance" }
  | { kind: "action"; allocation: CommittedAllocation };

/**
 * Build the season's ordered plan. LITERAL §7.6 order. Pure in (state,
 * allocations), so the same inputs always produce the same plan on replay.
 */
export function plan(state: SimState, allocations: CommittedAllocation[]): { items: PlanItem[]; queue: QueueStep; arrivals: Arrivals } {
  const queue = queueStep(state.queue, state.seasonIndex, state);
  const arrivals = selectArrivals(state);
  const items: PlanItem[] = [
    ...queue.resolving.map((entry) => ({ kind: "consequence" as const, entry })),
    ...queue.expiring.map((entry) => ({ kind: "expiry" as const, entry })),
    ...arrivals.scheduled.map((event) => ({ kind: "event" as const, event, slot: "scheduled" as const })),
    ...allocations.map((allocation) => ({ kind: "action" as const, allocation })),
    ...arrivals.companion.map((event) => ({ kind: "event" as const, event, slot: "companion" as const })),
    ...arrivals.chance.map((event) => ({ kind: "event" as const, event, slot: "chance" as const })),
  ];
  return { items, queue, arrivals };
}

export type SeasonRunResult =
  | { done: false; pendingEvent: SimEvent; answeredSoFar: CommittedEventResponse[] }
  | { done: true; state: SimState; result: SeasonResult };

/**
 * Resolve a whole season. Returns `{done:false, pendingEvent}` when a multi-option
 * event needs the player's choice at its §7.6 position; the caller appends the
 * response and calls again. On replay every response is already known, so it runs
 * straight through — and byte-identically (S-7).
 */
export function runSeason(
  state: SimState,
  allocations: CommittedAllocation[],
  eventResponses: CommittedEventResponse[],
): SeasonRunResult {
  const { items, queue, arrivals } = plan(state, allocations);
  let s: SimState = { ...state, queue: queue.remaining };
  const out: ResolvedItem[] = [];
  const handFlags = handFlagsOf(state);
  const companionFlags: string[] = [];
  const systemicFlags: string[] = [];
  /** Actions whose premise an earlier-resolving event removed (§7.6). */
  const invalidated = new Map<string, { note: string; resolution: "refund" | "convert"; convertTo?: string }>();
  let refunded: Budget = emptyBudget();

  for (const item of items) {
    if (item.kind === "consequence") {
      s = applyEffects(s, item.entry.effects, item.entry.sourceRef);
      out.push({
        kind: "consequence",
        id: item.entry.id,
        // The card's title and its sentence used to be the same string, so a
        // landed consequence printed one line twice — and four landed in a season
        // printed it eight times between them. The title now names WHAT it is
        // (the card it came from); the line stays the authored sentence.
        label: sourceLabel(item.entry.sourceRef),
        family: familyOfSource(item.entry),
        line: item.entry.label,
        attribution: renderable([
          {
            category: "accumulatedState",
            weight: 1,
            note: `set in motion in season ${item.entry.placedSeason + 1} by ${sourceLabel(item.entry.sourceRef)}`,
          },
        ]),
      });
      continue;
    }
    if (item.kind === "expiry") {
      out.push({
        kind: "consequence",
        id: item.entry.id,
        // Same fix as the landed arm: the title names the card it came from, so
        // the entry's own sentence is not printed twice on one row.
        label: sourceLabel(item.entry.sourceRef),
        family: familyOfSource(item.entry),
        line: `${item.entry.label} — the window for this closed without it landing.`,
        attribution: renderable([
          {
            category: "accumulatedState",
            weight: 1,
            note: `set in motion in season ${item.entry.placedSeason + 1} by ${sourceLabel(item.entry.sourceRef)}, and it ran out of time`,
          },
        ]),
      });
      continue;
    }
    if (item.kind === "event") {
      const ev = item.event;
      let optionId: string | undefined;
      if (ev.options.length === 1) {
        optionId = ev.options[0].id;
      } else {
        const answered = eventResponses.find((r) => r.eventId === ev.id);
        if (!answered) return { done: false, pendingEvent: ev, answeredSoFar: eventResponses };
        optionId = answered.optionId;
      }
      const option = ev.options.find((o) => o.id === optionId) ?? ev.options[0];
      const ord = 0; // events never repeat within a run
      const draw = drawFor(s.drawSeed, { seasonIndex: s.seasonIndex, instanceOrdinal: ord, id: ev.id });
      const res = resolve(option, s, draw, {
        highLoad: isHighLoad(s.conditions, s.maintenanceDebt),
        companionFlags,
        systemicFlags,
      });
      const variantDraw = drawFor(s.drawSeed, { seasonIndex: s.seasonIndex, instanceOrdinal: ord, id: ev.id }, 7);
      const line = outcomeLine(res.band, ev.outcomeVariants?.[res.band.name], variantDraw, ord);
      const source = { kind: "event" as const, id: ev.id, seasonIndex: s.seasonIndex };
      s = applyEffects(s, res.band.outcome.effects, source);
      s = applyDelayed(s, ev.delayedEffects, res, source);
      if (item.slot === "companion") companionFlags.push(...(res.band.outcome.effects.flagsSet ?? []));
      if (ev.trigger.kind === "systemic") systemicFlags.push(...(res.band.outcome.effects.flagsSet ?? []));
      // §7.6 invalidation: record it now; the action's own step reads it.
      if (ev.invalidates)
        for (const id of ev.invalidates.actionIds)
          invalidated.set(id, {
            note: ev.invalidates.note,
            resolution: ev.invalidates.resolution,
            convertTo: ev.invalidates.convertTo,
          });
      out.push(
        resolvedFrom("event", ev.id, ev.label, ev.family, option, res, line, ev.readRef, ev.evidenceLabel, {
          state: s,
          handFlags,
          companionFlags,
          systemicFlags,
        }),
      );
      continue;
    }

    /* ---- a committed action ---- */
    const alloc = item.allocation;
    const action = ACTION_BY_ID[alloc.actionId];
    if (!action) continue;
    const inv = invalidated.get(action.id);
    if (inv) {
      if (inv.resolution === "refund") {
        refunded = addBudget(refunded, costOf(action.contract.costs));
        out.push({
          kind: "action",
          id: action.id,
          instanceOrdinal: alloc.instanceOrdinal,
          label: action.label,
          family: action.family,
          line: `${inv.note} What you had set aside for this comes back to you.`,
          attribution: renderable([{ category: "systems", weight: -1, note: inv.note }]),
          invalidatedNote: inv.note,
          readRef: action.readRef,
        });
        continue;
      }
      // convert: the premise changed, so the action becomes the authored successor.
      const successor = inv.convertTo ? ACTION_BY_ID[inv.convertTo] : undefined;
      if (successor) {
        out.push({
          kind: "action",
          id: action.id,
          instanceOrdinal: alloc.instanceOrdinal,
          label: action.label,
          family: action.family,
          line: `${inv.note} It becomes ${lowerFirst(successor.label)} instead.`,
          attribution: renderable([{ category: "systems", weight: -1, note: inv.note }]),
          invalidatedNote: inv.note,
          readRef: action.readRef,
        });
      }
    }
    const target = inv?.resolution === "convert" && inv.convertTo ? ACTION_BY_ID[inv.convertTo] ?? action : action;
    const option = target.options.find((o) => o.id === alloc.optionId) ?? target.options[0];
    const coords = { seasonIndex: s.seasonIndex, instanceOrdinal: alloc.instanceOrdinal, id: target.id };
    const draw = drawFor(s.drawSeed, coords);
    const res = resolve(option, s, draw, { highLoad: isHighLoad(s.conditions, s.maintenanceDebt), companionFlags, systemicFlags });
    const line = outcomeLine(res.band, target.outcomeVariants?.[res.band.name], drawFor(s.drawSeed, coords, 7), alloc.instanceOrdinal);
    const source = { kind: "action" as const, id: target.id, seasonIndex: s.seasonIndex };
    s = applyEffects(s, res.band.outcome.effects, source);
    s = applyDelayed(s, target.delayedEffects, res, source);
    out.push(
      resolvedFrom("action", target.id, target.label, target.family, option, res, line, target.readRef, target.contract.evidenceLabel, {
        state: s,
        handFlags,
        companionFlags,
        systemicFlags,
        instanceOrdinal: alloc.instanceOrdinal,
      }),
    );
  }

  /* ---- season-end bookkeeping (§7.6, step 5) ---- */
  const budget = deriveBudget(state);
  const spentBase = allocations.reduce(
    (acc, a) => addBudget(acc, costOf(ACTION_BY_ID[a.actionId]?.contract.costs ?? {})),
    emptyBudget(),
  );
  const spent = subtractBudget(spentBase, refunded);
  const unspent = subtractBudget(budget, spent);

  // Rest converts spare capacity into recovery — that is what rest IS (§7.5).
  // Rest converts SPARE CAPACITY into recovery — and capacity means the energy
  // you did not spend, not the money you did not spend. Summing all three
  // currencies let unspent money buy bodily recovery, which is not a thing, and
  // it made deliberate under-allocation the highest-return use of a pip.
  const rested = allocations.some((a) => ACTION_BY_ID[a.actionId]?.id === "act-rest-maintain");
  if (rested) {
    const steps = restRecoverySteps(unspent);
    if (steps > 0) {
      s = applyEffects(s, { gauge: { healthEnergy: steps } });
      out.push({
        kind: "action",
        id: "act-rest-maintain",
        label: "Rest and maintain",
        family: "health",
        line: seasonLine(REST_CONVERSION_LINES, s.seasonIndex)[steps === 1 ? 0 : 1],
        attribution: renderable([
          { category: "choice", weight: 1, note: "you left energy unspent this season" },
          { category: "accumulatedState", weight: 0.5, note: "the capacity the season started with" },
        ]),
      });
    }
  }

  for (const gone of lapsingStanding(s)) {
    out.push({
      kind: "consequence",
      id: gone.actionId,
      label: gone.label,
      family: ACTION_BY_ID[gone.actionId]?.family ?? "inner",
      line: `${gone.label} ${seasonLine(LAPSE_LINES, s.seasonIndex)}`,
      attribution: renderable([
        { category: "accumulatedState", weight: -1, note: "where the run had got to by the time the upkeep came round" },
      ]),
    });
  }

  s = bookkeeping(s, allocations);

  return {
    done: true,
    state: s,
    result: {
      seasonIndex: state.seasonIndex,
      items: out,
      recoveryTies: out.filter((i) => i.failure).map((i) => recoveryTieFor(i, s)),
      queueAfter: s.queue,
      budgetSpent: spent,
      budgetUnspent: unspent,
    },
  };
}

/* =========================================================================
   THE RECOVERY-TIE RULE (§3.4 step 5, LITERAL — replaces 3.0's pool filter)
   ========================================================================= */

/**
 * Given a failure-band resolution, the recovery routes TIED TO THAT FAILURE.
 *
 * The 3.0 mechanism filtered the next card pool to recovery-bearing cards. That
 * does not generalise to an open loop where the player picks from a menu, so 4.0
 * ties the recovery to the specific failure instead: the record's own authored
 * `recoveryRefs` first, then any recovery/endurance option on the record itself,
 * and — always, unconditionally — the floor set's seek-help, which names a real
 * support route. S-3 verifies the tie exists and resolves, not merely that rest
 * exists somewhere in the game.
 */
function pushRoutes(routes: RecoveryTie["routes"], action: SimAction, why: string, tied: boolean, state?: SimState) {
  for (const o of action.options) {
    if (!(o.flags ?? []).some((f) => f === "recovery" || f === "endurance")) continue;
    if (routes.some((r: RecoveryTie["routes"][number]) => r.actionId === action.id && r.optionId === o.id)) continue;
    // Never offer a route the player cannot actually take from here — a spent
    // non-repeatable action presented as "the way on" is worse than nothing.
    if (state && !availability(action, state).available) continue;
    routes.push({
      actionId: action.id,
      actionLabel: action.label,
      optionId: o.id,
      optionLabel: o.label,
      ...(o.supportLink ? { supportLink: o.supportLink } : {}),
      why,
      tied,
    });
  }
}

/**
 * THE AUTHORED TIE (tiers 1–2) — what the GATES check.
 *
 * §3.4 step 5 says the tie must be to THAT failure, and "S-3 verifies the tie,
 * not merely that rest exists". So the gate must be able to come back empty, and
 * this is the function that can: the record's own authored `recoveryRefs`, and
 * any recovery/endurance option on the record itself. Nothing unconditional.
 *
 * The earlier version folded the always-available floor route in here, which made
 * the assertion unfalsifiable — every failure trivially "had a route" and thirty
 * genuinely untied records passed green. That was the invention defeating the
 * requirement it was written to satisfy.
 */
export function authoredRecoveryRoutesFor(recordId: string, state?: SimState): RecoveryTie["routes"] {
  const routes: RecoveryTie["routes"] = [];
  const record = ACTION_BY_ID[recordId] ?? EVENT_BY_ID[recordId];
  const authored = (record && "recoveryRefs" in record ? record.recoveryRefs : undefined) ?? [];
  for (const id of authored) {
    const a = ACTION_BY_ID[id];
    if (a) pushRoutes(routes, a, "a route out of this specific setback", true, state);
  }
  if (record && ACTION_BY_ID[recordId])
    pushRoutes(routes, ACTION_BY_ID[recordId], "the same ground, approached another way", true, state);
  return routes;
}

/**
 * What the PLAYER sees: the authored ties, and then — separately labelled — the
 * floor route, which is here after anything and is not counted as the tie.
 */
export function recoveryRoutesFor(recordId: string, state?: SimState): RecoveryTie["routes"] {
  const routes = authoredRecoveryRoutesFor(recordId, state);
  const help = ACTION_BY_ID["act-seek-help"];
  if (help) pushRoutes(routes, help, "not tied to this in particular — it is here after anything", false, state);
  return routes;
}

function recoveryTieFor(item: ResolvedItem, state: SimState): RecoveryTie {
  return {
    failedId: item.id,
    failedLabel: item.label,
    failureLine: item.line,
    routes: recoveryRoutesFor(item.id, state),
  };
}

/* ---- helpers ---- */

function applyDelayed(
  s: SimState,
  delayed: SimAction["delayedEffects"] | undefined,
  res: Resolution,
  source: QueueEntry["sourceRef"],
): SimState {
  if (!delayed?.length) return s;
  let next = s;
  for (const d of delayed) {
    if (d.onBands && !d.onBands.includes(res.band.name)) continue;
    next = { ...next, queue: queueInsert(next.queue, { refId: d.id, label: d.label, effects: d.effects, due: d.due }, source) };
  }
  return next;
}

function resolvedFrom(
  kind: ResolvedItem["kind"],
  id: string,
  label: string,
  family: CardFamily,
  option: SimOption,
  res: Resolution,
  line: string,
  readRef: string,
  evidenceLabel: ResolvedItem["evidenceLabel"],
  ctx: {
    state: SimState;
    handFlags: string[];
    companionFlags: string[];
    systemicFlags: string[];
    instanceOrdinal?: number;
  },
): ResolvedItem {
  return {
    kind,
    id,
    instanceOrdinal: ctx.instanceOrdinal,
    label,
    family,
    optionId: option.id,
    optionLabel: option.label,
    band: res.band.name,
    failure: Boolean(res.band.failure),
    line,
    attribution: renderable(
      classify(option, ctx.state, {
        marker: res.marker,
        handFlags: ctx.handFlags,
        companionFlags: ctx.companionFlags,
        systemicFlags: ctx.systemicFlags,
      }),
    ),
    marker: res.marker,
    shift: res.shift,
    readRef,
    evidenceLabel,
  };
}

/**
 * Season-end bookkeeping: standing commitments tick, companions age one season of
 * silence, maintenance debt accrues where a need went unmet, the season pointer
 * advances. Deterministic; no RNG.
 */
function bookkeeping(state: SimState, allocations: CommittedAllocation[]): SimState {
  // Only the option the player actually CHOSE counts as contact. Scanning every
  // option of the action credited the player with reaching out to people they
  // had not reached out to — which then fed the arrival-priority ordering.
  const touched = new Set<string>();
  for (const a of allocations) {
    const chosen = ACTION_BY_ID[a.actionId]?.options.find((o) => o.id === a.optionId);
    if (!chosen) continue;
    for (const band of chosen.bands) {
      for (const d of band.outcome.effects.companions ?? []) touched.add(d.arcId);
      for (const d of band.outcome.effects.relationships ?? []) touched.add(d.id);
    }
  }
  const companions: Record<string, CompanionState> = {};
  for (const [id, cs] of Object.entries(state.companions)) {
    if (cs.exited) {
      companions[id] = cs;
      continue;
    }
    const since = touched.has(id) ? 0 : cs.sinceContact + 1;
    companions[id] = {
      ...cs,
      sinceContact: since,
      // Neglect is time-in-silence, not a judgement. It accrues slowly and it is
      // repairable; the arcs' repair-response nodes read exactly this number.
      neglect: since >= 3 ? cs.neglect + 1 : cs.neglect,
    };
  }

  // Maintenance debt: a season with no maintenance-family action taken accrues
  // one step. One missed season never reaches a threshold (§5.3).
  const maintained = allocations.some((a) => {
    const act = ACTION_BY_ID[a.actionId];
    return act?.family === "health" || act?.floor;
  });
  const maintenanceDebt = maintained ? Math.max(0, state.maintenanceDebt - 1) : state.maintenanceDebt + 1;

  // A commitment the season could not pay for has lapsed (see economy.ts). It
  // ends here rather than silently continuing unpaid.
  const lapsed = new Set(lapsingStanding(state).map((s) => s.actionId + ":" + s.instanceOrdinal));
  const standing = state.standing
    .filter((s) => !lapsed.has(s.actionId + ":" + s.instanceOrdinal))
    .map((s) => ({ ...s, seasonsRemaining: s.seasonsRemaining - 1 }))
    .filter((s) => s.seasonsRemaining > 0);

  return { ...state, companions, maintenanceDebt, standing };
}

/** The constraint flags that came from the hand — the starting-conditions set. */
export function handFlagsOf(state: SimState): string[] {
  // Flags present before any season was committed are, by definition, the start.
  return state.origin.kind === "preset" || state.origin.kind === "birth-rng" ? state.flags.filter((f) => f.startsWith("start:")) : [];
}

function familyOfSource(entry: QueueEntry): CardFamily {
  const rec = entry.sourceRef.kind === "action" ? ACTION_BY_ID[entry.sourceRef.id] : EVENT_BY_ID[entry.sourceRef.id];
  return rec?.family ?? "inner";
}

/**
 * The authored label of the record that set a consequence in motion.
 *
 * The attribution note used to run the raw id through `plain()`, so the explain
 * drawer said "set in motion in season four by money debt order" where the card
 * the player actually took is called "Choose the repayment order". A de-slugged
 * internal id is not a name.
 */
/**
 * ENGINE-EMITTED SEASON-END LINES, in pools.
 *
 * These do not come from a content record, so `outcomeLine`'s rotation never
 * touched them and they were single strings. Driving six full campaigns, the
 * rest-conversion line rendered in all twenty-four seasons of every one — the
 * single most-repeated sentence in the build, and the §10 monotony test's real
 * finding. Rotated the same way content pools are: by occurrence (here, the
 * season index), so a replay is identical and a run does not reread.
 */
const REST_CONVERSION_LINES: [string, string][] = [
  ["The energy you did not spend goes back into you — a band of recovery.", "The energy you did not spend goes back into you — two bands of recovery."],
  ["You left something in the tank and the week takes it back.", "You left a good deal in the tank, and the weeks take it back."],
  ["Nothing was asked of the hours you kept, so the hours kept you.", "Nothing was asked of the hours you kept, and there were enough of them to tell."],
  ["What you did not spend turns up as sleep, and the sleep holds.", "What you did not spend turns up as sleep, and a fortnight of it holds."],
  ["The season had slack in it. You are steadier at the end than the start.", "The season had real slack in it, and you end it noticeably steadier."],
  ["An unspent evening, then another. By March you notice you are not bracing.", "Unspent evenings, week on week. By March you are not bracing at all."],
  ["You underbooked yourself on purpose and it paid the way it does — quietly.", "You underbooked yourself on purpose and it paid twice over, quietly."],
  ["No heroics. Some hours you did not fill, and a body that noticed.", "No heroics. A lot of hours you did not fill, and a body that noticed."],
];

const LAPSE_LINES = [
  "lapses. You took it on from a position you no longer have, and this season could not pay for it.",
  "lapses. It was affordable when you agreed to it and it is not affordable now.",
  "lapses. Nothing dramatic happened; the season simply could not carry it.",
  "lapses. What you signed up to needed a month that no longer exists.",
];

/** Rotate a pool by season, so a replay is identical and a run does not reread. */
function seasonLine<T>(pool: T[], seasonIndex: number): T {
  return pool[seasonIndex % pool.length];
}

function sourceLabel(ref: QueueEntry["sourceRef"]): string {
  const rec = ref.kind === "action" ? ACTION_BY_ID[ref.id] : EVENT_BY_ID[ref.id];
  return rec?.label ?? plain(ref.id);
}

function plain(s: string): string {
  return s.replace(/^(start:|act-|evt-)/, "").replace(/[-_]/g, " ");
}
function lowerFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

/* =========================================================================
   The beat schedule channel (§5.1) — read here, never mixed into arrivals
   ========================================================================= */

/**
 * The beat, if any, scheduled for this season. Deliberately a SEPARATE call from
 * `selectArrivals`, returning a `BeatRecord` and not a `SimEvent`, so a beat can
 * never enter the items list, the queue, or any preview surface.
 */
export function beatForSeason(state: SimState) {
  const placement = beatPlacements(state).find((p) => p.seasonIndex === state.seasonIndex);
  if (!placement) return null;
  // A BEAT PLAYS ONCE PER RUN. Without this check, a season that pauses on a
  // multi-option event stays un-committed, and every re-entry re-offers a beat
  // the player had already played — or, worse, already chosen to SKIP. §5.1
  // says a skipped beat stays skipped on every surface; presenting it again in
  // full frame is the sharpest possible violation of that, so the guard is
  // here, in the only function that can return a beat.
  if (state.beatsPlayed.some((b) => b.beatId === placement.beatId)) return null;
  const beat = BEATS[placement.beatId];
  return beat ? { placement, beat } : null;
}

export { SEASON_COUNT };
