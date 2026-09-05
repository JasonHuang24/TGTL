/**
 * THE CAMPAIGN LIFECYCLE (blueprint 4.0 §3.3, §3.4, §3.8).
 *
 * Pure transition functions over `SimState`. No React, no I/O. Everything a run
 * does — hand, priorities, briefing, allocation, resolution, advance, parse — is
 * a function of (origin, seeds, committed ledger), so a replay reproduces a run
 * exactly and a fork can be replayed from its parent's prefix without ever
 * touching the parent (gate S-7).
 */

import { GAUGE_KEYS, type GaugeKey } from "@/content/bands";
import { drawFor, freshSeed, hashToUnit, weightedIndex } from "@/lib/sim/rng";
import { deriveBudget, emptyBudget, costOf, subtractBudget, isAffordable } from "@/lib/sim/economy";
import { runSeason, instanceOrdinal, beatForSeason, floorReport, plan, type SeasonRunResult } from "@/lib/sim/season";
import { makeProfile } from "@/content/sim/profile";
import {
  ACTION_BY_ID,
  CAMPAIGN_ID,
  PRESET_BY_ID,
  SEASON_COUNT,
  seasonLabel,
} from "@/content/sim/registry";
import { COMPANION_ARCS } from "@/content/sim/campaign/companions";
import {
  CAPABILITY_KEYS,
  CONTENT_VERSION,
  ENGINE_VERSION,
  PRIORITY_KEYS,
  PROFILE_AXES,
  SIM_SCHEMA_VERSION,
  type Budget,
  type CapabilityKey,
  type CommittedAllocation,
  type CommittedEventResponse,
  type CommittedSeason,
  type CompanionState,
  type PrioritySet,
  type ProfileAxis,
  type SimState,
} from "@/content/sim/schema";

/* =========================================================================
   Starting a run
   ========================================================================= */

export function emptyPriorities(): PrioritySet {
  const p = {} as PrioritySet;
  for (const k of PRIORITY_KEYS) p[k] = 0;
  return p;
}

/**
 * Birth RNG for the campaign (§3.3). The hand is DRAWN, hierarchically: the money
 * axis is drawn first and tilts the others, because starting conditions are
 * correlated in life and pretending they are independent would be the lie.
 */
export function drawBirthProfile(handSeed: string): {
  hardness: Record<ProfileAxis, number>;
  flags: string[];
  gauges: Partial<Record<GaugeKey, number>>;
  role: string;
  place: string;
} {
  const draw = (axis: string, salt = 0) => hashToUnit(handSeed, `birth:${axis}`, salt);
  const band = (u: number, tilt: number) =>
    weightedIndex(u, [Math.max(0.05, 1.1 - tilt * 0.5), 1.2, Math.max(0.15, 0.9 + tilt * 0.4), Math.max(0.05, 0.4 + tilt * 0.5)]);

  const money = band(draw("money"), 0);
  const tilt = (money - 1.5) / 1.5;
  const backing = band(draw("backing"), tilt);
  const body = band(draw("body"), tilt * 0.6);
  const place = band(draw("place"), tilt * 0.8);

  const flags: string[] = [];
  if (money >= 2) flags.push("start:no-backstop");
  else flags.push("start:family-backstop");
  if (backing >= 2) flags.push("start:no-backstop");
  if (body >= 2) flags.push("start:reduced-capacity");
  if (place >= 2) flags.push("start:place-bound");
  else flags.push("start:stable-housing");

  const gauges: Partial<Record<GaugeKey, number>> = {
    money: clamp04(3 - money),
    healthEnergy: clamp04(3 - Math.round(body * 0.8)),
    connection: clamp04(3 - Math.round(backing * 0.8)),
    timeStructure: clamp04(3 - Math.round((place + money) / 2)),
  };

  const ROLES = ["school-leaver", "part-time worker", "someone between things", "first-year student", "carer, and everything else around it"];
  const PLACES = ["the town you grew up in", "a city two hours from where you started", "a suburb with one bus route", "a college town", "a room in a shared flat"];
  return {
    hardness: { money, backing, body, place },
    flags: [...new Set(flags)],
    gauges,
    role: ROLES[Math.floor(draw("role", 3) * ROLES.length)],
    place: PLACES[Math.floor(draw("place", 4) * PLACES.length)],
  };
}

function clamp04(n: number): number {
  return Math.max(0, Math.min(4, Math.round(n)));
}

export function newCampaign(config: {
  handSeed?: string;
  drawSeed?: string;
  origin: SimState["origin"];
}): SimState {
  const handSeed = config.handSeed ?? freshSeed();
  const drawSeed = config.drawSeed ?? freshSeed();

  const gauges = {} as Record<GaugeKey, number>;
  for (const k of GAUGE_KEYS) gauges[k] = 2;
  const capabilities = {} as Record<CapabilityKey, number>;
  for (const k of CAPABILITY_KEYS) capabilities[k] = 2;

  const base: SimState = {
    schemaVersion: SIM_SCHEMA_VERSION,
    engineVersion: ENGINE_VERSION,
    contentVersion: CONTENT_VERSION,
    mode: "campaign",
    campaignId: CAMPAIGN_ID,
    handSeed,
    drawSeed,
    origin: config.origin,
    profile: makeProfile({ money: 1, backing: 1, body: 1, place: 1 }),
    role: "school-leaver",
    place: "where you started",
    gauges,
    capabilities,
    skills: [],
    relationships: [],
    companions: {},
    conditions: [],
    flags: [],
    maintenanceDebt: 0,
    priorities: emptyPriorities(),
    queue: [],
    standing: [],
    seasonIndex: 0,
    phase: "prologue",
    committed: [],
    beatsPlayed: [],
    fork: null,
    notedIllustrative: false,
  };

  if (config.origin.kind === "preset") {
    const preset = PRESET_BY_ID[config.origin.presetId];
    if (!preset) return base;
    const s = preset.startState;
    return {
      ...base,
      profile: preset.profile,
      role: s.role,
      place: s.place,
      gauges: { ...base.gauges, ...s.gauges },
      capabilities: { ...base.capabilities, ...s.capabilities },
      skills: [...s.skills],
      flags: [...s.flags],
      conditions: [...s.conditions],
      relationships: s.relationships.map((r) => ({ ...r })),
      companions: companionStates(s.companions),
    };
  }

  const drawn = drawBirthProfile(handSeed);
  // A drawn hand still starts with people in it — which ones is part of the draw.
  const arcIds = COMPANION_ARCS.map((a) => a.id);
  const pickA = arcIds[Math.floor(hashToUnit(handSeed, "birth:arc-a") * arcIds.length)];
  const rest = arcIds.filter((a) => a !== pickA);
  const pickB = rest[Math.floor(hashToUnit(handSeed, "birth:arc-b") * rest.length)];
  const chosen = [pickA, pickB];
  return {
    ...base,
    profile: makeProfile(drawn.hardness),
    role: drawn.role,
    place: drawn.place,
    gauges: { ...base.gauges, ...drawn.gauges },
    flags: drawn.flags,
    relationships: chosen.map((id) => ({
      id,
      label: COMPANION_ARCS.find((a) => a.id === id)?.label ?? id,
      quality: 1,
    })),
    companions: companionStates(chosen),
  };
}

function companionStates(ids: string[]): Record<string, CompanionState> {
  const out: Record<string, CompanionState> = {};
  for (const id of ids) out[id] = { arcId: id, stage: 0, neglect: 0, repair: 0, exited: false, sinceContact: 0 };
  return out;
}

/* =========================================================================
   Phase transitions
   ========================================================================= */

export function withPhase(state: SimState, phase: SimState["phase"]): SimState {
  return { ...state, phase };
}

/** Set priorities. Recorded as an adaptation on the ledger, never as a failure. */
export function setPriorities(state: SimState, priorities: PrioritySet): SimState {
  const clean = {} as PrioritySet;
  for (const k of PRIORITY_KEYS) clean[k] = Math.max(0, Math.min(3, Math.round(priorities[k] ?? 0)));
  return { ...state, priorities: clean };
}

/**
 * Revise priorities at a season boundary — recorded on the committed ledger of
 * the season being entered, so a replay reproduces it and the parse can show
 * revisions AS ADAPTATION (§3.9), which is what they are.
 */
export function revisePriorities(state: SimState, priorities: PrioritySet): SimState {
  const next = setPriorities(state, priorities);
  return { ...next, phase: "briefing" };
}

/* =========================================================================
   The season, from the caller's side
   ========================================================================= */

export function budgetFor(state: SimState): Budget {
  return deriveBudget(state);
}

export function remainingBudget(state: SimState, allocations: CommittedAllocation[]): Budget {
  let remaining = deriveBudget(state);
  for (const a of allocations) remaining = subtractBudget(remaining, costOf(ACTION_BY_ID[a.actionId]?.contract.costs ?? {}));
  return remaining;
}

export function canAfford(state: SimState, allocations: CommittedAllocation[], actionId: string): boolean {
  const action = ACTION_BY_ID[actionId];
  if (!action) return false;
  return isAffordable(remainingBudget(state, allocations), action.contract.costs);
}

/** Next occurrence ordinal for an action, counting this season's allocations too. */
export function nextOrdinal(state: SimState, allocations: CommittedAllocation[], actionId: string): number {
  return instanceOrdinal(state.committed, actionId) + allocations.filter((a) => a.actionId === actionId).length;
}

/**
 * Commit the season. Allocations commit as an ORDERED SET at Resolve (§7.5); up to
 * that moment the caller may revise them freely, and nothing here has happened.
 */
export function commitSeason(
  state: SimState,
  allocations: CommittedAllocation[],
  eventResponses: CommittedEventResponse[],
  beatResponse?: { beatId: string; skipped: boolean },
  priorityRevision?: PrioritySet,
): SeasonRunResult {
  const run = runSeason(state, allocations, eventResponses);
  if (!run.done) return run;

  const entry: CommittedSeason = {
    seasonIndex: state.seasonIndex,
    allocations,
    eventResponses,
    beatResponse,
    // §3.9 renders priority revisions AS ADAPTATION, which means the ledger has
    // to carry them: hardcoding undefined here meant a revision never survived a
    // replay, a fork, or the look-back that is supposed to name it.
    priorityRevision,
  };

  let next: SimState = {
    ...run.state,
    committed: [...state.committed, entry],
    // Only record a beat response that matches the beat THIS state's own schedule
    // places here. Beat placement is a pure function of origin and hand flags, so
    // a position-vary fork replays the parent's committed prefix under a different
    // origin — and trusting the caller meant a branch whose new position never
    // carried `start:interrupted-path` still recorded `beat-low-season`, and its
    // parse then reported a flat stretch that was never scheduled or played.
    beatsPlayed:
      beatResponse && beatForSeason(state)?.beat.id === beatResponse.beatId
        ? [...state.beatsPlayed, { ...beatResponse, seasonIndex: state.seasonIndex }]
        : state.beatsPlayed,
  };

  // Standing commitments started this season enter the register.
  for (const a of allocations) {
    const action = ACTION_BY_ID[a.actionId];
    if (action?.standing)
      next = {
        ...next,
        standing: [
          ...next.standing,
          {
            actionId: a.actionId,
            instanceOrdinal: a.instanceOrdinal,
            optionId: a.optionId,
            startedSeason: state.seasonIndex,
            seasonsRemaining: action.standing.seasons,
            upkeep: action.standing.upkeep,
            label: action.label,
          },
        ],
      };
  }

  const advanced = advanceSeason(next);
  return { done: true, state: advanced, result: run.result };
}

export function advanceSeason(state: SimState): SimState {
  const nextIndex = state.seasonIndex + 1;
  if (nextIndex >= SEASON_COUNT) return { ...state, seasonIndex: SEASON_COUNT, phase: "parse" };
  return { ...state, seasonIndex: nextIndex, phase: "briefing" };
}

/* =========================================================================
   The briefing (§3.4 step 1)
   ========================================================================= */

export type Briefing = {
  seasonIndex: number;
  age: number;
  half: string;
  year: number;
  role: string;
  place: string;
  budget: Budget;
  /** Pending consequences, rendered honestly with in-world timing. */
  queue: SimState["queue"];
  standing: SimState["standing"];
  /** Pressures the state itself is applying — never a diagnosis, just the facts. */
  pressures: string[];
  /** Needs going unmet. Named without shame (§5.3). */
  needs: string[];
  floor: ReturnType<typeof floorReport>;
  /** True when nothing new arrived and the compressed flow is offered (§3.4b). */
  quiet: boolean;
};

export function briefing(state: SimState): Briefing {
  const label = seasonLabel(state.seasonIndex);
  const budget = deriveBudget(state);
  const pressures: string[] = [];
  const needs: string[] = [];

  for (const c of state.conditions) pressures.push(conditionPhrase(c));
  if (state.maintenanceDebt >= 3) needs.push("the small maintenance you keep deferring is now costing you time every season");
  if (state.maintenanceDebt >= 6) needs.push("the deferred maintenance is costing you energy as well as time");
  for (const k of GAUGE_KEYS)
    if (state.gauges[k] <= 1) needs.push(`${gaugePhrase(k)} is thin`);
  for (const [id, cs] of Object.entries(state.companions))
    if (!cs.exited && cs.sinceContact >= 3)
      needs.push(`you have not been in touch with ${COMPANION_ARCS.find((a) => a.id === id)?.label ?? id} for a while`);

  const { arrivals } = plan(state, []);
  const quiet =
    arrivals.scheduled.length === 0 &&
    arrivals.companion.length === 0 &&
    arrivals.chance.length === 0 &&
    state.queue.filter((q) => q.placedSeason < state.seasonIndex).length === 0;

  return {
    seasonIndex: state.seasonIndex,
    age: label.age,
    half: label.half,
    year: label.year,
    role: state.role,
    place: state.place,
    budget,
    queue: state.queue,
    standing: state.standing,
    pressures,
    needs,
    floor: floorReport(state, budget),
    quiet,
  };
}

const CONDITION_PHRASE: Record<string, string> = {
  "caring-duty": "someone is depending on you for practical care",
  "second-job": "you are working two jobs",
  "commute-heavy": "the commute is eating the edges of the week",
  "unstable-housing": "where you live is not settled",
  "reduced-capacity": "your capacity is reduced and you are working around it",
};
function conditionPhrase(c: string): string {
  return CONDITION_PHRASE[c] ?? c.replace(/[-_]/g, " ");
}
const GAUGE_PHRASE: Record<GaugeKey, string> = {
  money: "money",
  healthEnergy: "energy",
  connection: "connection",
  timeStructure: "time",
};
function gaugePhrase(k: GaugeKey): string {
  return GAUGE_PHRASE[k];
}

/* =========================================================================
   Serialisation + migration honesty (§2.4)
   ========================================================================= */

export function serialize(state: SimState): string {
  return JSON.stringify(state);
}

export type LoadResult =
  | { ok: true; state: SimState }
  | { ok: false; reason: "unreadable" | "stale-version" | "stale-content"; detail: string };

/**
 * Load with MIGRATION HONESTY (§2.4). A save from an older engine or content
 * version is never silently resumed and never silently lost: it is declared
 * unresumable, in plain language, with the erase control beside it. There is no
 * blank resume and no pretend-migration anywhere in this function.
 */
export function deserialize(raw: string): LoadResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, reason: "unreadable", detail: "This save could not be read at all." };
  }
  const s = parsed as Partial<SimState>;
  if (!s || typeof s !== "object" || !s.gauges)
    return { ok: false, reason: "unreadable", detail: "This save could not be read at all." };
  if (s.schemaVersion !== SIM_SCHEMA_VERSION)
    return {
      ok: false,
      reason: "stale-version",
      detail: `This run was saved by an earlier version of the simulation (${
        s.engineVersion ?? "unknown"
      }). The rules have changed since, so resuming it would not be the same run you left. It cannot be continued.`,
    };
  if (s.contentVersion !== CONTENT_VERSION)
    return {
      ok: false,
      reason: "stale-content",
      detail: `This run was saved against an earlier version of the campaign's content (${
        s.contentVersion ?? "unknown"
      }). Some of what it refers to no longer exists in the same form, so it cannot be continued honestly.`,
    };
  // SHAPE, not just version. The checks above only looked at `gauges`, so a
  // version-current save missing `beatsPlayed`, `committed`, `queue`, `flags`,
  // `standing`, `skills`, `relationships`, `companions`, `conditions`,
  // `priorities`, `origin` or `profile` returned ok:true and then threw the first
  // time the engine touched it — for `beatsPlayed`, not until the season a beat
  // was placed in, so a tampered or truncated save could play most of a run and
  // fall over near the end. Declaring it unresumable is the same §2.4 answer the
  // version checks give; defaulting a missing field would be the pretend-migration
  // this function exists to refuse (and defaulting `beatsPlayed` to [] would
  // silently re-present a beat the player had already skipped).
  const REQUIRED_ARRAYS = ["committed", "queue", "flags", "standing", "skills", "relationships", "conditions", "beatsPlayed"] as const;
  const REQUIRED_OBJECTS = ["gauges", "capabilities", "priorities", "origin", "profile", "companions"] as const;
  const missing: string[] = [];
  for (const k of REQUIRED_ARRAYS) if (!Array.isArray((s as Record<string, unknown>)[k])) missing.push(k);
  for (const k of REQUIRED_OBJECTS) {
    const v = (s as Record<string, unknown>)[k];
    if (!v || typeof v !== "object" || Array.isArray(v)) missing.push(k);
  }
  if (missing.length)
    return {
      ok: false,
      reason: "unreadable",
      detail: `This save is incomplete — it is missing ${missing.length === 1 ? "a part" : "parts"} of the run (${missing.join(", ")}), so it cannot be continued honestly. Nothing has been changed; you can erase it below.`,
    };
  return { ok: true, state: s as SimState };
}

export { SEASON_COUNT, seasonLabel, beatForSeason, floorReport, instanceOrdinal, emptyBudget };
