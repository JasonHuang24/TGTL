/**
 * The fleet harness (blueprint 4.0 §8, shared by S-10 and S-13).
 *
 * A FLEET is a set of scripted policies driven over presets, drawn hands and
 * seeds, recording per-season telemetry. Everything here is deterministic: the
 * policies are pure functions of (state, index), so a fleet result is reproducible
 * and a failure is a fixture rather than an anecdote.
 *
 * The policies are deliberately CRUDE. They are not meant to play well; they are
 * meant to walk the reachable state space in different directions so the gates can
 * ask whether any of those directions is a dominant strategy or a dead end.
 */

import { GAUGE_KEYS, type GaugeKey } from "@/content/bands";
import { newCampaign, setPriorities, commitSeason, budgetFor, remainingBudget, nextOrdinal, emptyPriorities } from "@/lib/sim/campaign";
import { menu, affordableMenu, floorReport, selectArrivals, type MenuEntry } from "@/lib/sim/season";
import { SATISFACTION_SOURCES, satisfactionProfile, endingSignature } from "@/lib/sim/satisfaction";
import { PRESETS, SEASON_COUNT, ACTION_BY_ID } from "@/content/sim/registry";
import { servesPriority } from "@/content/sim/domains";
import { PRIORITY_KEYS, type CommittedAllocation, type CommittedEventResponse, type PriorityKey, type SimState } from "@/content/sim/schema";

export type Policy = {
  id: string;
  label: string;
  /** The priority this policy is greedy for, when it has one. */
  priority?: PriorityKey;
  pick: (candidates: MenuEntry[], state: SimState, slot: number) => MenuEntry | undefined;
  /** How many things it tries to commit per season. */
  width: number;
};

/** Greedy-per-priority: prefer actions whose domains serve the named priority. */
function greedyFor(priority: PriorityKey): Policy {
  return {
    id: `greedy-${priority}`,
    label: `greedy for ${priority}`,
    priority,
    width: 3,
    pick: (candidates, state, slot) => {
      // Uses the authored DOMAIN_SERVES map, like the parse and the measure.
      // The old substring match against a hardcoded word list could not see 36 of
      // the pool's 77 domain tags, so several greedy policies were quietly
      // playing the whole menu rather than their own priority — including
      // greedy-mastery and greedy-creativity, whose own tags were orphans.
      const serving = candidates.filter((m) => servesPriority(m.action.domains ?? [], priority));
      const pool = serving.length ? serving : candidates;
      return pool[(state.seasonIndex * 5 + slot * 3) % pool.length];
    },
  };
}

export const POLICIES: Policy[] = [
  ...PRIORITY_KEYS.map(greedyFor),
  {
    id: "rest-heavy",
    label: "rest-heavy — floor first, always",
    width: 2,
    pick: (candidates, state, slot) => {
      const floor = candidates.filter((m) => m.action.floor);
      if (slot === 0 && floor.length) return floor[state.seasonIndex % floor.length];
      return candidates[(state.seasonIndex + slot) % candidates.length];
    },
  },
  {
    id: "spend-everything",
    label: "spend everything, every season",
    width: 4,
    pick: (candidates, state, slot) => {
      const costly = [...candidates].sort(
        (a, b) => costTotal(b) - costTotal(a) || (a.action.id < b.action.id ? -1 : 1),
      );
      return costly[slot % costly.length];
    },
  },
  {
    id: "never-rest",
    label: "never rest — advance only",
    width: 3,
    pick: (candidates, state, slot) => {
      const nonFloor = candidates.filter((m) => !m.action.floor);
      const pool = nonFloor.length ? nonFloor : candidates;
      return pool[(state.seasonIndex * 7 + slot) % pool.length];
    },
  },
  {
    id: "wait-only",
    label: "wait only — the minimum a season allows",
    width: 1,
    pick: (candidates) => candidates.find((m) => m.action.id === "act-wait") ?? candidates[0],
  },
  {
    // THE REST-EXPLOIT PROBE. The adversarial review pointed out that S-10d was
    // reporting "rest-heavy is never strictly dominated" without any policy that
    // actually exercised rest's spare-capacity conversion — so the green result
    // was evidence about nothing. This policy takes rest and then deliberately
    // UNDER-ALLOCATES to bank the conversion, which is the shape that would make
    // deliberate under-spending the best move in the game if the cap were wrong.
    id: "rest-and-bank",
    label: "rest, then deliberately under-allocate to bank the conversion",
    width: 2,
    pick: (candidates, state, slot) => {
      if (slot === 0) return candidates.find((m) => m.action.id === "act-rest-maintain") ?? candidates[0];
      // Take only free things, so the energy budget stays unspent.
      const free = candidates.filter((m) => m.cost.energy === 0);
      return free.length ? free[(state.seasonIndex + slot) % free.length] : undefined;
    },
  },
];

function costTotal(m: MenuEntry): number {
  return m.cost.timeStructure + m.cost.energy + m.cost.money;
}

export type SeasonTelemetry = {
  seasonIndex: number;
  affordable: number;
  families: number;
  floorOk: boolean;
  floorDetail: string;
  sandboxOpen: boolean;
  sandboxOpenOnAuthoredPool: boolean;
  nonFloorCount: number;
  nonFloorExcludingSmall: number;
  negativeArrivals: number;
  suppressed: number;
  gauges: Record<GaugeKey, number>;
  maintenanceDebt: number;
  committed: number;
};

export type FleetRun = {
  policy: string;
  priority?: PriorityKey;
  origin: string;
  seed: string;
  seasonsCompleted: number;
  telemetry: SeasonTelemetry[];
  gaugeTrail: Record<GaugeKey, number>[];
  end: SimState;
  signature: string[];
  satisfaction: Record<PriorityKey, number>;
};

export type DrivenOptions = {
  /** Start the run from a deliberately drained state (the S-10 drained sweep). */
  drain?: boolean;
  /**
   * Start with the maintenance backlog at its ceiling but the GAUGES MID-BAND.
   * The drained sweep masks this state, because draining the gauges also trips
   * the depletion floor in the same breath — so the debt drag's own route to a
   * squeezed budget was never tested. It is now.
   */
  debtOnly?: boolean;
  /** Stop after this many seasons. */
  seasons?: number;
};

export function driveFleetRun(policy: Policy, origin: string, seed: string, opts: DrivenOptions = {}): FleetRun {
  let s =
    origin === "birth-rng"
      ? newCampaign({ origin: { kind: "birth-rng" }, handSeed: seed, drawSeed: `${seed}-d` })
      : newCampaign({ origin: { kind: "preset", presetId: origin }, handSeed: seed, drawSeed: `${seed}-d` });

  // The priorities the policy is nominally playing for.
  const priorities = { ...emptyPriorities() };
  if (policy.priority) priorities[policy.priority] = 3;
  else priorities.safety = 2;
  s = setPriorities(s, priorities);

  if (opts.debtOnly) {
    const gauges = {} as Record<GaugeKey, number>;
    for (const g of GAUGE_KEYS) gauges[g] = 2;
    s = { ...s, gauges, maintenanceDebt: 9 };
  }
  if (opts.drain) {
    // A DELIBERATELY DRAINED STATE (§8's S-10 drained sweep): everything at the
    // bottom, a full maintenance backlog, and the high-load conditions on. This
    // is the state the floor promise is actually about.
    const gauges = {} as Record<GaugeKey, number>;
    for (const g of GAUGE_KEYS) gauges[g] = 0;
    s = { ...s, gauges, maintenanceDebt: 9, conditions: [...new Set([...s.conditions, "reduced-capacity", "second-job"])] };
  }

  const telemetry: SeasonTelemetry[] = [];
  const gaugeTrail: Record<GaugeKey, number>[] = [];
  const limit = opts.seasons ?? SEASON_COUNT;
  let guard = 0;

  while (s.seasonIndex < limit && guard++ < limit + 5) {
    const budget = budgetFor(s);
    const report = floorReport(s, budget);
    const arrivals = selectArrivals(s);
    const negatives = [...arrivals.scheduled, ...arrivals.companion, ...arrivals.chance].filter((e) => e.negative).length;

    const allocations: CommittedAllocation[] = [];
    for (let slot = 0; slot < policy.width; slot++) {
      const remaining = remainingBudget(s, allocations);
      const candidates = affordableMenu(s, remaining).filter((m) => !allocations.some((a) => a.actionId === m.action.id));
      if (!candidates.length) break;
      const pick = policy.pick(candidates, s, slot);
      if (!pick) break;
      allocations.push({
        actionId: pick.action.id,
        instanceOrdinal: nextOrdinal(s, allocations, pick.action.id),
        optionId: pick.action.options[(s.seasonIndex + slot) % pick.action.options.length].id,
      });
    }

    telemetry.push({
      seasonIndex: s.seasonIndex,
      affordable: report.affordableCount,
      families: report.families.length,
      floorOk: report.pass,
      floorDetail: report.detail,
      sandboxOpen: report.sandboxOpen,
      sandboxOpenOnAuthoredPool: report.sandboxOpenOnAuthoredPool,
      nonFloorCount: report.nonFloorCount,
      nonFloorExcludingSmall: report.nonFloorExcludingSmall,
      negativeArrivals: negatives,
      suppressed: arrivals.suppressed,
      gauges: { ...s.gauges },
      maintenanceDebt: s.maintenanceDebt,
      committed: allocations.length,
    });
    gaugeTrail.push({ ...s.gauges });

    let responses: CommittedEventResponse[] = [];
    let out = commitSeason(s, allocations, responses);
    let inner = 0;
    while (!out.done && inner++ < 10) {
      const ev = out.pendingEvent;
      responses = [...responses, { eventId: ev.id, optionId: ev.options[(s.seasonIndex + inner) % ev.options.length].id }];
      out = commitSeason(s, allocations, responses);
    }
    if (!out.done) break;
    s = out.state;
  }

  return {
    policy: policy.id,
    priority: policy.priority,
    origin,
    seed,
    seasonsCompleted: s.seasonIndex,
    telemetry,
    gaugeTrail,
    end: s,
    signature: endingSignature(s),
    satisfaction: satisfactionProfile(s),
  };
}

/** The standard fleet: every policy × every preset + sampled drawn hands × seeds. */
export function standardFleet(seeds: string[], opts: DrivenOptions = {}): FleetRun[] {
  const runs: FleetRun[] = [];
  const origins = [...PRESETS.map((p) => p.id), "birth-rng", "birth-rng"];
  for (const policy of POLICIES)
    for (let i = 0; i < origins.length; i++)
      for (const seed of seeds) runs.push(driveFleetRun(policy, origins[i], `${seed}-${i}`, opts));
  return runs;
}

export { SEASON_COUNT, ACTION_BY_ID, menu };
