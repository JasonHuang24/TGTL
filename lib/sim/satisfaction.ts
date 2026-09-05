/**
 * THE INTERNAL SATISFACTION MEASURE (blueprint 4.0 §8's S-10, §6).
 *
 * A per-priority reading of an end state, used by the balance fleet to ask "did
 * this policy serve THIS priority?" — and used by nothing else, ever.
 *
 * THIS IS NEVER RENDERED IN PLAY. It exists so S-10 can answer a question that
 * needs a number ("does any one policy dominate every priority?") without that
 * number leaking into the game, where it would be exactly the universal score the
 * whole project refuses. Three things keep it honest:
 *
 *   1. It lives here, outside `content/`, and no component imports it. S-5's
 *      no-score lint and the S-10 gate both assert that.
 *   2. It is DOCUMENTED on /methodology — what it measures, that it is only used
 *      to probe balance, and that the game never shows it. Published, not hidden.
 *   3. It is not a "life score". It is ten separate readings that are never
 *      combined; there is deliberately no function here that sums them.
 *
 * The measure is illustrative by construction: it is a balance instrument, not a
 * claim about what a good life is.
 */

import { GAUGE_KEYS, type GaugeKey } from "@/content/bands";
import { ACTION_BY_ID } from "@/content/sim/registry";
import { DOOR_MEANING } from "@/content/sim/campaign/doors";
import { servesPriority } from "@/content/sim/domains";
import { PRIORITY_KEYS, type CapabilityKey, type PriorityKey, type SimState } from "@/content/sim/schema";

/**
 * What each priority reads IN THE STATE VECTOR. Published on /methodology.
 *
 * The seasons-spent term is not here: which cards serve which priority is
 * `DOMAIN_SERVES` in content/sim/domains.ts, authored per tag. This record used
 * to carry a `domains` word list of its own that was substring-matched, which
 * silently scored zero for 36 of the pool's 77 tags; leaving the list here after
 * the fix would publish a rule the code no longer follows.
 */
export const SATISFACTION_SOURCES: Record<
  PriorityKey,
  { gauges: GaugeKey[]; capabilities: CapabilityKey[]; wantsLowDebt?: boolean }
> = {
  safety: { gauges: ["money", "timeStructure"], capabilities: [], wantsLowDebt: true },
  health: { gauges: ["healthEnergy"], capabilities: ["vitality", "regulation"], wantsLowDebt: true },
  closeness: { gauges: ["connection"], capabilities: ["socialNavigation"] },
  autonomy: { gauges: ["timeStructure"], capabilities: ["adaptability"] },
  mastery: { gauges: [], capabilities: ["learning", "execution"] },
  wealth: { gauges: ["money"], capabilities: [] },
  service: { gauges: ["connection"], capabilities: ["socialNavigation"] },
  creativity: { gauges: [], capabilities: ["learning"] },
  recognition: { gauges: [], capabilities: ["socialNavigation", "execution"] },
  meaning: { gauges: [], capabilities: ["regulation"] },
};

/**
 * The reading for ONE priority. Deliberately per-priority: there is no sum, no
 * average, and no "overall" anywhere in this module.
 */
export function satisfactionFor(state: SimState, key: PriorityKey): number {
  const src = SATISFACTION_SOURCES[key];
  let value = 0;
  for (const g of src.gauges) value += state.gauges[g];
  for (const c of src.capabilities) value += state.capabilities[c];
  // Seasons actually spent on the priority's domains — what the run DID, not
  // only where it ended up.
  let spent = 0;
  for (const season of state.committed)
    for (const a of season.allocations) {
      const action = ACTION_BY_ID[a.actionId];
      // Same substring bug as the parse's, and here it fed the S-10 balance
      // fleets: seasons spent on a priority went uncounted whenever the card's
      // tag was one of the 36 the word list could not see, so the measure
      // under-read exactly the priorities whose tags were orphans.
      if (action && servesPriority(action.domains, key)) spent++;
    }
  value += Math.min(8, spent) * 0.5;
  // Skills and open doors count toward mastery-ish and optionality-ish readings.
  if (key === "mastery" || key === "creativity") value += Math.min(6, state.skills.length) * 0.5;
  // Only doors that actually OPENED count toward optionality. Counting every run
  // flag meant `benefits-denied` and `burned-reference` raised a character's
  // modelled autonomy — which fed the S-10 balance fleets, so a policy could look
  // more autonomous for having gone worse.
  if (key === "autonomy") {
    const opened = state.flags.filter((f) => {
      const m = DOOR_MEANING[f];
      return m && !("skip" in m) && m.state === "opened";
    }).length;
    value += Math.min(6, opened) * 0.4;
  }
  if (src.wantsLowDebt) value -= Math.min(6, state.maintenanceDebt) * 0.5;
  if (key === "closeness" || key === "service")
    value += Object.values(state.companions).filter((c) => !c.exited).length * 0.8;
  return Math.round(value * 100) / 100;
}

/** The ten readings, as a record. Never summed — S-10 compares them per key. */
export function satisfactionProfile(state: SimState): Record<PriorityKey, number> {
  const out = {} as Record<PriorityKey, number>;
  for (const k of PRIORITY_KEYS) out[k] = satisfactionFor(state, k);
  return out;
}

/* =========================================================================
   The ending signature (§8's S-10 operational definition)
   ========================================================================= */

/**
 * A run's ENDING SIGNATURE: end-state domain bands + held commitments + open-door
 * flags. Two runs are "meaningfully different" when their signatures differ in at
 * least three components.
 */
export function endingSignature(state: SimState): string[] {
  const BANDS = ["depleted", "thin", "steady", "comfortable", "abundant"];
  const parts: string[] = [];
  for (const g of GAUGE_KEYS) parts.push(`${g}:${BANDS[Math.max(0, Math.min(4, state.gauges[g]))]}`);
  parts.push(`debt:${state.maintenanceDebt >= 6 ? "high" : state.maintenanceDebt >= 3 ? "some" : "low"}`);
  parts.push(`skills:${state.skills.length >= 5 ? "many" : state.skills.length >= 2 ? "some" : "few"}`);
  parts.push(`people:${Object.values(state.companions).filter((c) => !c.exited).length}`);
  // Held commitments: actions taken three or more times across the run.
  const counts = new Map<string, number>();
  for (const s of state.committed) for (const a of s.allocations) counts.set(a.actionId, (counts.get(a.actionId) ?? 0) + 1);
  const held = [...counts.entries()].filter(([, n]) => n >= 3).map(([id]) => id).sort();
  parts.push(`held:${held.slice(0, 4).join("+") || "none"}`);
  // Run-acquired flags. This is an IDENTITY component — a fingerprint of how the
  // run ended, used only to ask whether two endings differ — so it deliberately
  // includes adverse flags alongside good ones. It used to be labelled "doors",
  // which read as a claim that all of them opened; they do not, and the parse now
  // says which is which. See content/sim/campaign/doors.ts.
  parts.push(`flags:${state.flags.filter((f) => !f.startsWith("start:")).sort().slice(0, 6).join("+") || "none"}`);
  return parts;
}

export function meaningfullyDifferent(a: string[], b: string[]): boolean {
  let diff = 0;
  for (let i = 0; i < Math.max(a.length, b.length); i++) if (a[i] !== b[i]) diff++;
  return diff >= 3;
}

/**
 * VIABLE: completed the window with no gauge pinned at depleted for the final
 * four seasons. `trail` is the per-season gauge history the fleet recorded.
 */
export function isViable(trail: Record<GaugeKey, number>[], seasonsCompleted: number, seasonCount: number): boolean {
  if (seasonsCompleted < seasonCount) return false;
  const tail = trail.slice(-4);
  if (tail.length < 4) return false;
  for (const g of GAUGE_KEYS) if (tail.every((t) => t[g] <= 0)) return false;
  return true;
}

/** What /methodology publishes about this measure — its own words, in one place. */
export const SATISFACTION_DISCLOSURE = [
  "The balance work needs a number, and the game must never show one. So there is exactly one internal measure, it lives outside the content, and it is published here rather than hidden.",
  "For each of the ten priorities it reads the parts of the end state that priority is about — the relevant gauges and capabilities, the seasons actually spent on that priority's domains, the skills and open doors, the maintenance backlog, and the people still in the life.",
  "There are ten readings and they are never added together. There is deliberately no function anywhere in this build that combines them, because that would be the universal life score this project refuses to build.",
  "It is used for one question only: does any single way of playing serve every priority at once? If one ever did, the game would have a right answer, and it is supposed not to.",
  "It is illustrative by construction — a balance instrument, not a claim about what a good life is — and no play surface can reach it.",
];
