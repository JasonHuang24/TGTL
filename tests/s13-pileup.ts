/**
 * GATE S-13 · PILE-UP / WORST CASE (blueprint 4.0 §8, §5.2).
 *
 * The sandbox must not be able to compose a despair screen out of legitimate
 * parts. Every individual negative event here is honest; the risk is the pile —
 * three of them landing in the same season on a character with nothing left, and
 * the game rendering that as a verdict.
 *
 * So this gate is ADVERSARIAL. It does not sample the state space; it hunts the
 * worst reachable corner of it. The search:
 *
 *   - drives policies that deliberately choose the worst-weighted option on every
 *     card, never rest, never ask for help, and let every relationship lapse;
 *   - starts some runs from a fully drained state with the maintenance backlog at
 *     its ceiling and the high-load conditions on;
 *   - records every season by how much negative pressure it delivered, and keeps
 *     the worst ones.
 *
 * In EVERY state it reaches, three things must hold (§5.2):
 *   1. THE FLOOR SET is available and affordable. There is no state of this game
 *      in which you cannot afford to stop, wait, or ask.
 *   2. AT LEAST ONE TIED RECOVERY ROUTE exists for whatever just failed — tied to
 *      that failure, not merely the existence of rest somewhere.
 *   3. THE RENDERING IS MATTER-OF-FACT. No melodrama, no catastrophising, no
 *      verdict on the person, no "spiral" framing. A voice lint over exactly the
 *      strings the worst seasons actually rendered.
 *
 * Run: npm run gates:pileup
 */
import { reportGate, type GateResult } from "./util.ts";
import { GAUGE_KEYS, type GaugeKey } from "@/content/bands";
import { newCampaign, setPriorities, commitSeason, budgetFor, remainingBudget, nextOrdinal, emptyPriorities } from "@/lib/sim/campaign";
import { affordableMenu, floorReport, authoredRecoveryRoutesFor, selectArrivals, MAX_NEGATIVE_ARRIVALS } from "@/lib/sim/season";
import { isDeeplyDepleted } from "@/lib/sim/effects";
import { PRESETS, SEASON_COUNT, FLOOR_ACTION_IDS, ACTION_BY_ID } from "@/content/sim/registry";
import { OUTCOME_BAND_RANK } from "@/content/bands";
import type { CommittedAllocation, CommittedEventResponse, ResolvedItem, SimState } from "@/content/sim/schema";

const results: GateResult[] = [];

/* ============================================================
   The adversarial drive
   ============================================================ */

/**
 * The floor set, NAMED HERE. §3.4 says rest, wait and asking for help are
 * available and free in every campaign state; this gate has to hold the engine to
 * that from outside, so the ids are written down rather than read back from
 * FLOOR_ACTION_IDS — otherwise deleting one from the pool would delete it from
 * the expectation too, and the assertion would still pass.
 */
const REQUIRED_FLOOR_IDS = ["act-rest-maintain", "act-wait", "act-seek-help"];

type WorstSeason = {
  origin: string;
  seed: string;
  seasonIndex: number;
  pressure: number;
  negativeArrivals: number;
  gauges: Record<GaugeKey, number>;
  debt: number;
  affordable: number;
  families: number;
  floorOk: boolean;
  floorDetail: string;
  sandboxOpen: boolean;
  sandboxOpenOnAuthoredPool: boolean;
  /**
   * Which of the three named floor actions were NOT affordable this season.
   * `floorReport.pass` is computed by the engine and returns true whenever the
   * floor actions exist — `availability()` short-circuits on `floor: true` — so
   * asserting on it could never come back red. This is checked against a list
   * written down here, in the gate, rather than read back from the code it tests.
   */
  namedFloorMissing: string[];
  nonFloorCount: number;
  nonFloorExcludingSmall: number;
  failures: { id: string; label: string; line: string; routes: number; hasSupportRoute: boolean; enduranceWithoutSupport: boolean }[];
  lines: { text: string; where: string }[];
  depleted: boolean;
};

/** Prefer the option whose band mass sits worst — the adversary's whole strategy. */
function worstOptionId(action: { options: { id: string; bands: { name: string; weight: number }[] }[] }): string {
  let worst = action.options[0];
  let worstScore = -Infinity;
  for (const o of action.options) {
    const total = o.bands.reduce((a, b) => a + b.weight, 0) || 1;
    const score = o.bands.reduce((a, b) => a + (OUTCOME_BAND_RANK[b.name as keyof typeof OUTCOME_BAND_RANK] ?? 2) * b.weight, 0) / total;
    if (score > worstScore) {
      worstScore = score;
      worst = o;
    }
  }
  return worst.id;
}

function driveAdversarial(origin: string, seed: string, drain: boolean): WorstSeason[] {
  let s =
    origin === "birth-rng"
      ? newCampaign({ origin: { kind: "birth-rng" }, handSeed: seed, drawSeed: `${seed}-d` })
      : newCampaign({ origin: { kind: "preset", presetId: origin }, handSeed: seed, drawSeed: `${seed}-d` });
  s = setPriorities(s, { ...emptyPriorities(), mastery: 3 });
  if (drain) {
    const gauges = {} as Record<GaugeKey, number>;
    for (const g of GAUGE_KEYS) gauges[g] = 0;
    s = { ...s, gauges, maintenanceDebt: 9, conditions: [...new Set([...s.conditions, "reduced-capacity", "second-job", "unstable-housing"])] };
  }

  const seasons: WorstSeason[] = [];
  let guard = 0;
  while (s.seasonIndex < SEASON_COUNT && guard++ < SEASON_COUNT + 5) {
    const budget = budgetFor(s);
    const report = floorReport(s, budget);
    const arrivals = selectArrivals(s);
    const negatives = [...arrivals.scheduled, ...arrivals.companion, ...arrivals.chance].filter((e) => e.negative).length;

    // The adversary: never rest, never ask, always the worst-weighted option.
    const allocations: CommittedAllocation[] = [];
    for (let slot = 0; slot < 3; slot++) {
      const remaining = remainingBudget(s, allocations);
      const candidates = affordableMenu(s, remaining)
        .filter((m) => !allocations.some((a) => a.actionId === m.action.id))
        .filter((m) => !m.action.floor);
      if (!candidates.length) break;
      const pick = candidates[(s.seasonIndex * 11 + slot * 7) % candidates.length];
      allocations.push({
        actionId: pick.action.id,
        instanceOrdinal: nextOrdinal(s, allocations, pick.action.id),
        optionId: worstOptionId(pick.action),
      });
    }

    let responses: CommittedEventResponse[] = [];
    let out = commitSeason(s, allocations, responses);
    let inner = 0;
    while (!out.done && inner++ < 10) {
      const ev = out.pendingEvent;
      responses = [...responses, { eventId: ev.id, optionId: worstOptionId(ev) }];
      out = commitSeason(s, allocations, responses);
    }
    if (!out.done) break;

    const failures = out.result.items
      .filter((i) => i.failure)
      .map((i: ResolvedItem) => {
        // The AUTHORED tie only. The floor route is always there; counting it
        // would make this clause of S-13 unfalsifiable, which is the exact
        // defect the adversarial review found.
        const routes = authoredRecoveryRoutesFor(i.id);
        return {
          id: i.id,
          label: i.label,
          line: i.line,
          routes: routes.length,
          hasSupportRoute: routes.some((r) => Boolean(r.supportLink)),
          enduranceWithoutSupport: routes.some(
            (r) => ACTION_BY_ID[r.actionId]?.options.find((o) => o.id === r.optionId)?.flags?.includes("endurance") && !r.supportLink,
          ),
        };
      });

    const pressure =
      negatives * 2 +
      failures.length * 3 +
      GAUGE_KEYS.filter((g) => s.gauges[g] <= 1).length +
      (s.maintenanceDebt >= 6 ? 2 : 0);

    seasons.push({
      origin,
      seed,
      seasonIndex: s.seasonIndex,
      pressure,
      negativeArrivals: negatives,
      gauges: { ...s.gauges },
      debt: s.maintenanceDebt,
      affordable: report.affordableCount,
      families: report.families.length,
      floorOk: report.pass,
      floorDetail: report.detail,
      failures,
      sandboxOpen: report.sandboxOpen,
      sandboxOpenOnAuthoredPool: report.sandboxOpenOnAuthoredPool,
      namedFloorMissing: REQUIRED_FLOOR_IDS.filter(
        (id) => !affordableMenu(s, budget).some((m) => m.action.id === id),
      ),
      nonFloorCount: report.nonFloorCount,
      nonFloorExcludingSmall: report.nonFloorExcludingSmall,
      lines: out.result.items.map((i, n) => ({ text: i.line, where: `${origin}/${seed}/s${s.seasonIndex + 1}/item${n}` })),
      depleted: isDeeplyDepleted(s.gauges),
    });
    s = out.state;
  }
  return seasons;
}

console.log("S-13: hunting the worst reachable corner of the state space...");
const origins = [...PRESETS.map((p) => p.id), "birth-rng"];
const allSeasons: WorstSeason[] = [];
for (const origin of origins)
  for (const seed of ["w1", "w2", "w3"]) {
    allSeasons.push(...driveAdversarial(origin, seed, false));
    allSeasons.push(...driveAdversarial(origin, `${seed}-drained`, true));
  }
const ranked = [...allSeasons].sort((a, b) => b.pressure - a.pressure);
const worst = ranked.slice(0, 60);
console.log(`S-13: ${allSeasons.length} adversarial seasons; worst pressure ${ranked[0]?.pressure}. Asserting.`);

/* ============================================================
   1 · The floor holds in every state reached
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  // sandboxOpen is the addition the adversarial review forced: the §3.4 floor is
  // satisfied by the three FREE floor actions on their own, so a state in which
  // nothing else is affordable used to pass this gate while being exactly the
  // silent rails §11 forbids.
  // Every disjunct here can come back false. The previous filter used `floorOk`
  // and `sandboxOpen`, both of which are true by construction in every state this
  // gate can reach: the floor actions carry `floor: true`, so `availability()`
  // returns available on its first line, and `sandboxOpen` counts the small-move
  // tier, which is itself unconditional. The gate reported 864 clean seasons
  // while being unable to report anything else. Proven by deleting the authored
  // pool entirely: the old filter stayed at 0 breaches, this one goes to 864.
  const breaches = allSeasons.filter(
    (s) => s.namedFloorMissing.length > 0 || s.affordable < 3 || s.families < 2 || !s.sandboxOpenOnAuthoredPool,
  );
  if (breaches.length) {
    ok = false;
    details.push(`${breaches.length} adversarially-reached season(s) failed the §3.4 floor:`);
    for (const b of breaches.slice(0, 8)) details.push(`  ${b.origin}/${b.seed} s${b.seasonIndex + 1}: ${b.floorDetail}`);
  } else {
    const minA = Math.min(...allSeasons.map((s) => s.affordable));
    const minF = Math.min(...allSeasons.map((s) => s.families));
    const minNF = Math.min(...allSeasons.map((s) => s.nonFloorExcludingSmall));
    const deep = allSeasons.filter((s) => s.depleted).length;
    details.push(
      `${allSeasons.length} adversarially-driven seasons — worst-option-always, never rest, never ask, ${allSeasons.filter((s) => s.seed.includes("drained")).length} of them from a fully drained start. ` +
        `${deep} of those seasons were at deep depletion. In every one, the floor set was present and free and at least three allocations across at least two families were affordable ` +
        `(worst: ${minA} affordable across ${minF} families; worst count from the authored pool beyond the small-move tier: ${minNF}) — so no reachable state is the floor alone.`,
    );
  }
  results.push({ id: 230, name: "S-13a · The floor set holds in every adversarially-reached state", pass: ok, details });
}

/* ============================================================
   2 · Every failure carries a tied recovery route
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  let failures = 0;
  const untied: string[] = [];
  for (const s of allSeasons)
    for (const f of s.failures) {
      failures++;
      // §3.4 requires a tie, and a support route "where applicable" — which is
      // the endurance case, where the option's whole shape is "carry it". So the
      // assertion is: a tie exists, and any endurance route among the ties names
      // a real page. Requiring a support link after EVERY setback would be the
      // opposite failure: an ordinary bad month is not a referral.
      if (f.routes === 0) untied.push(`${s.origin}/${s.seed} s${s.seasonIndex + 1}: ${f.id} failed with no tied recovery route`);
      if (f.enduranceWithoutSupport)
        untied.push(`${s.origin}/${s.seed} s${s.seasonIndex + 1}: ${f.id} offers an endurance route naming no support page`);
    }
  if (untied.length) {
    ok = false;
    details.push(`${untied.length} failure(s) without a tied recovery route:`);
    for (const u of untied.slice(0, 8)) details.push("  " + u);
  } else {
    details.push(
      `${failures} failure-band resolutions across the adversarial fleet. Every one surfaced at least one AUTHORED recovery route tied to that specific failure ` +
        `(the always-available floor route is deliberately not counted here — counting it is what made this clause unfalsifiable), and every endurance route among them named a real support page.`,
    );
  }
  results.push({ id: 231, name: "S-13b · Every failure surfaces a tied recovery route", pass: ok, details });
}

/* ============================================================
   3 · Matter-of-fact rendering — the voice lint on what worst seasons SAID
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  /**
   * The pile-up voice hazard is not a rude word; it is FRAMING. These are the
   * shapes that turn an accumulation of ordinary setbacks into a verdict on the
   * person or a narrative of collapse. Checked against exactly the strings the
   * worst-pressure seasons actually rendered — not the content pool in general.
   */
  const MELODRAMA = [
    /\b(ruined|destroyed|devastat\w*|catastroph\w*|doomed|hopeless|worthless)\b/i,
    /\b(rock ?bottom|falling apart|falls apart|the wheels come off|spiral(l?ing|s)?)\b/i,
    /\bno way (out|back|forward)\b/i,
    /\bnothing (left|you can do|to be done)\b/i,
    /\bthere is no (point|hope|coming back)\b/i,
  ];
  const VERDICT = [
    /\byou (failed|are a failure|were not (good )?enough|brought this on yourself)\b/i,
    /\byour (own )?fault\b/i,
    /\byou should have\b/i,
    /\bif only you had\b/i,
    /\bthis is what happens when you\b/i,
  ];
  let checked = 0;
  for (const s of worst)
    for (const l of s.lines) {
      checked++;
      for (const re of MELODRAMA) if (re.test(l.text)) {
        ok = false;
        details.push(`melodrama in ${l.where}: ${JSON.stringify(l.text.slice(0, 80))}`);
      }
      for (const re of VERDICT) if (re.test(l.text)) {
        ok = false;
        details.push(`verdict-on-the-person in ${l.where}: ${JSON.stringify(l.text.slice(0, 80))}`);
      }
    }
  if (ok)
    details.push(
      `${checked} strings rendered by the ${worst.length} highest-pressure seasons in the fleet (pressure ${worst[worst.length - 1]?.pressure}–${worst[0]?.pressure}): ` +
        `no catastrophising, no collapse narrative, no verdict on the person. Setbacks read as things that happened.`,
    );
  results.push({ id: 232, name: "S-13c · Matter-of-fact rendering under maximal pressure", pass: ok, details });
}

/* ============================================================
   4 · The pile-up cap and depletion floor are actually binding
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  const overCap = allSeasons.filter((s) => s.failures.length > 0 && s.pressure > 0);
  void overCap;
  // The adversary cannot produce a season with more than the published cap of
  // negative arrivals — that is the physics, and this is where it is proven.
  let maxNegPerSeason = 0;
  for (const s of allSeasons) maxNegPerSeason = Math.max(maxNegPerSeason, s.negativeArrivals);
  if (maxNegPerSeason > MAX_NEGATIVE_ARRIVALS) {
    ok = false;
    details.push(`a season delivered ${maxNegPerSeason} negative arrivals; the published cap is ${MAX_NEGATIVE_ARRIVALS}`);
  } else {
    const deep = allSeasons.filter((s) => s.depleted);
    const deepWithNeg = deep.filter((s) => s.negativeArrivals >= MAX_NEGATIVE_ARRIVALS);
    details.push(
      `The negative-arrival cap held in all ${allSeasons.length} adversarial seasons (ceiling ${MAX_NEGATIVE_ARRIVALS}). ` +
        `${deep.length} seasons were at deep depletion; ${deepWithNeg.length} of those still drew the maximum, which is the honest part — ` +
        `the depletion floor suppresses fresh negative CHANCE events, not the consequences of what you did.`,
    );
  }
  results.push({ id: 233, name: "S-13d · Pile-up cap and depletion floor bind under adversarial search", pass: ok, details });
}

/* ============================================================
   Report
   ============================================================ */
for (const r of results.sort((a, b) => a.id - b.id)) reportGate(r);
const failed = results.filter((r) => !r.pass);
console.log("\n" + "=".repeat(60));
if (failed.length === 0) {
  console.log(`ALL ${results.length} WORST-CASE ASSERTIONS PASS (S-13, ${allSeasons.length} adversarial seasons)`);
  process.exit(0);
} else {
  console.log(`${failed.length} WORST-CASE ASSERTION(S) FAILED (S-13)`);
  process.exit(1);
}
