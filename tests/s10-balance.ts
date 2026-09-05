/**
 * GATE S-10 · BALANCE — PROBING, NOT PROVING (blueprint 4.0 §8).
 *
 * Balance is not a thing you can prove about a sandbox. What you can do is drive
 * scripted policy fleets through it and assert operationally-defined properties
 * that would be false if the sandbox were secretly rails. That is what this is,
 * and the honesty of the name matters: it probes.
 *
 * The operational definitions are the blueprint's, verbatim in effect:
 *   ENDING SIGNATURE          end-state domain bands + held commitments + open-door flags
 *   MEANINGFULLY DIFFERENT    signatures differing in at least three components
 *   VIABLE                    completed, with no gauge pinned at depleted for the final four seasons
 *   SATISFACTION              the internal per-priority measure (lib/sim/satisfaction),
 *                             documented on /methodology, never rendered in play
 *
 * The assertions:
 *   1. No policy dominates all priorities.
 *   2. At least three meaningfully different VIABLE endings per preset.
 *   3. Rest-heavy policies are never strictly dominated.
 *   4. Completable from every hand.
 *   5. PER-SEASON TELEMETRY — at least three affordable allocations spanning at
 *      least two families in EVERY season of EVERY run, drained sweeps included.
 *      This is the rails test, mechanized (§10).
 *
 * Run: npm run gates:balance
 */
import { reportGate, type GateResult } from "./util.ts";
import { standardFleet, driveFleetRun, POLICIES, SEASON_COUNT, type FleetRun } from "./fleet.ts";
import { meaningfullyDifferent, isViable } from "@/lib/sim/satisfaction";
import { PRESETS } from "@/content/sim/registry";
import { DEBT_THRESHOLDS, MAX_DEBT_PIP_DRAG, debtPenalty } from "@/lib/sim/economy";
import { FLEET_POLICY_COUNT, FLEET_POLICY_COUNT_WORD } from "@/content/sim/methodology-copy";
import { newCampaign } from "@/lib/sim/campaign";
import { floorReport } from "@/lib/sim/season";
import { PRIORITY_KEYS, type PriorityKey } from "@/content/sim/schema";

const SEEDS = ["f1", "f2", "f3"];
const results: GateResult[] = [];
/* ------------------------------------------------------------------
   S-10g · what /methodology publishes about the fleet is true of the fleet
   ------------------------------------------------------------------
   The page said "Fourteen scripted policies" while fifteen ran, and stated the
   debt drag as one pip per threshold crossed while the code caps it at two. Both
   were published rules that were false against the code, which is worse than an
   unpublished one. These bind the prose to the constants. */
{
  const problems: string[] = [];
  if (FLEET_POLICY_COUNT !== POLICIES.length)
    problems.push(`/methodology publishes ${FLEET_POLICY_COUNT} scripted policies; the fleet drives ${POLICIES.length}`);
  const wordFor: Record<number, string> = { 13: "Thirteen", 14: "Fourteen", 15: "Fifteen", 16: "Sixteen", 17: "Seventeen" };
  if (FLEET_POLICY_COUNT_WORD !== wordFor[FLEET_POLICY_COUNT])
    problems.push(`the published policy count word "${FLEET_POLICY_COUNT_WORD}" does not spell ${FLEET_POLICY_COUNT}`);
  // The drag caps out; crossing the third threshold adds no further pip.
  if (debtPenalty(DEBT_THRESHOLDS[DEBT_THRESHOLDS.length - 1]) !== MAX_DEBT_PIP_DRAG)
    problems.push("the debt drag past the last threshold does not equal the published cap");
  if (debtPenalty(DEBT_THRESHOLDS[DEBT_THRESHOLDS.length - 1] + 20) !== MAX_DEBT_PIP_DRAG)
    problems.push("the debt drag is not actually capped");
  results.push({
    id: 226,
    name: "S-10g · /methodology's fleet and debt claims are true of the code",
    pass: problems.length === 0,
    details: problems.length
      ? problems
      : [
          `${POLICIES.length} policies, published as "${FLEET_POLICY_COUNT_WORD}"; the debt drag caps at ${MAX_DEBT_PIP_DRAG} pips and stays there past ${DEBT_THRESHOLDS[DEBT_THRESHOLDS.length - 1]}, which is what the page now says.`,
        ],
  });
}


console.log(`S-10: driving ${POLICIES.length} policies over ${PRESETS.length} presets + drawn hands x ${SEEDS.length} seeds...`);
const fleet = standardFleet(SEEDS);
console.log(`S-10: ${fleet.length} runs; now the drained sweep...`);
const drained = standardFleet(["d1"], { drain: true });
console.log(`S-10: ${drained.length} drained runs; now the high-debt sweep...`);
// High debt with MID-BAND gauges: the state the drained sweep masks, because
// draining the gauges trips the depletion floor in the same breath and hides the
// debt drag's own route to a squeezed budget.
const debtOnly = standardFleet(["b1"], { debtOnly: true });
console.log(`S-10: ${debtOnly.length} high-debt runs. Asserting.`);

const all = [...fleet, ...drained, ...debtOnly];

/* ============================================================
   1 · The rails test, mechanized — per-season floor telemetry
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  let seasons = 0;
  let minAffordable = Infinity;
  let minFamilies = Infinity;
  const breaches: string[] = [];

  for (const run of all) {
    for (const t of run.telemetry) {
      seasons++;
      minAffordable = Math.min(minAffordable, t.affordable);
      minFamilies = Math.min(minFamilies, t.families);
      if (!t.floorOk || t.affordable < 3 || t.families < 2 || !t.sandboxOpen)
        breaches.push(`${run.policy}/${run.origin}/${run.seed} season ${t.seasonIndex + 1}: ${t.floorDetail}`);
    }
  }
  if (breaches.length) {
    ok = false;
    details.push(`${breaches.length} season(s) failed the §3.4 floor:`);
    for (const b of breaches.slice(0, 8)) details.push("  " + b);
  } else {
    const minNonFloor = Math.min(...all.flatMap((r) => r.telemetry.map((t) => t.nonFloorCount)));
    const minAuthored = Math.min(...all.flatMap((r) => r.telemetry.map((t) => t.nonFloorExcludingSmall)));
    details.push(
      `${seasons} seasons across ${all.length} runs — ${drained.length} from a deliberately drained state (every gauge at depleted, backlog at its ceiling, high-load conditions on) ` +
        `and ${debtOnly.length} from the high-debt sweep (backlog at its ceiling, gauges mid-band, so the debt drag is tested WITHOUT the depletion floor masking it). ` +
        `Every single season offered at least three affordable allocations spanning at least two families, with the floor set present and free — ` +
        `and in every season at least two of those were beyond the free floor set, across at least two families, so no reachable state is the floor alone.`,
    );
    details.push(`Worst season anywhere in the fleet: ${minAffordable} affordable across ${minFamilies} families, ${minNonFloor} beyond the floor set.`);
    // Reported, not asserted, and reported deliberately: this is the number the
    // adversarial review of the reserved pip made visible. Below a certain
    // budget the one-pip "small moves" are what keep the sandbox open and the
    // rest of the pool is priced out. It is a real property of the design.
    const belowTier = all.flatMap((r) => r.telemetry).filter((t) => t.nonFloorExcludingSmall === 0).length;
    details.push(
      `Of those ${seasons} seasons, ${belowTier} (${((belowTier / seasons) * 100).toFixed(1)}%) were poor enough that the nine one-pip "small moves" were the ONLY affordable actions beyond the free floor set — ` +
        `the rest of the pool, whose cheapest tier is two pips, was priced out. Worst authored-pool count anywhere: ${minAuthored}. ` +
        `Reported rather than asserted, because it is the honest shape of the bottom of this economy rather than a defect: when a season has one pip, small moves are what a season has.`,
    );
  }
  results.push({ id: 220, name: "S-10a · The rails test, mechanized (per-season floor telemetry)", pass: ok, details });
}

/* ============================================================
   1b · THE PREDICATE CAN FAIL — the fixture that makes 1 mean something
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  // A gate that cannot come back red is not measuring anything. The first
  // version of this assertion could not: the small-move tier made it true by
  // construction. So the suite now proves, positively, that floorReport goes
  // false at a genuinely closed budget and true at the bare reserve.
  const probe = newCampaign({ origin: { kind: "preset", presetId: PRESETS[0].id }, handSeed: "fix", drawSeed: "fix-d" });
  const closed = floorReport(probe, { timeStructure: 0, energy: 0, money: 0 });
  if (closed.pass) {
    ok = false;
    details.push("floorReport passed at a completely closed budget — the assertion is unfalsifiable");
  }
  const bare = floorReport(probe, { timeStructure: 1, energy: 1, money: 0 });
  if (!bare.sandboxOpenOnAuthoredPool) {
    ok = false;
    details.push(
      `at the bare reserve (one time, one energy, no money) only ${bare.nonFloorExcludingSmall} authored non-floor action(s) were affordable — the sandbox is not open at the bottom without the small-move tier`,
    );
  }
  if (ok)
    details.push(
      `floorReport returns FALSE at a closed budget (${closed.affordableCount} affordable, ${closed.nonFloorExcludingSmall} authored non-floor) and TRUE at the bare reserve ` +
        `(${bare.affordableCount} affordable, ${bare.nonFloorExcludingSmall} authored non-floor across ${bare.nonFloorFamiliesExcludingSmall.length} families). ` +
        `The predicate the fleet asserts is one that can come back red.`,
    );
  results.push({ id: 2201, name: "S-10a′ · The floor predicate is falsifiable", pass: ok, details });
}

/* ============================================================
   2 · Completable from every hand
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  const stalled = fleet.filter((r) => r.seasonsCompleted < SEASON_COUNT);
  if (stalled.length) {
    ok = false;
    details.push(`${stalled.length} run(s) did not complete the window:`);
    for (const r of stalled.slice(0, 8)) details.push(`  ${r.policy}/${r.origin}/${r.seed} stopped at season ${r.seasonsCompleted}`);
  } else {
    details.push(`All ${fleet.length} runs completed all ${SEASON_COUNT} seasons — every policy from every preset and every sampled drawn hand.`);
  }
  results.push({ id: 221, name: "S-10b · Completable from every hand under every policy", pass: ok, details });
}

/* ============================================================
   3 · No policy dominates all priorities
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  // Mean satisfaction per (policy, priority) across the fleet.
  const table = new Map<string, Record<PriorityKey, number>>();
  for (const policy of POLICIES) {
    const runs = fleet.filter((r) => r.policy === policy.id);
    if (!runs.length) continue;
    const row = {} as Record<PriorityKey, number>;
    for (const k of PRIORITY_KEYS) row[k] = runs.reduce((a, r) => a + r.satisfaction[k], 0) / runs.length;
    table.set(policy.id, row);
  }
  const ids = [...table.keys()];
  const dominators: string[] = [];
  for (const a of ids) {
    const beatsEveryone = ids
      .filter((b) => b !== a)
      .every((b) => PRIORITY_KEYS.every((k) => (table.get(a)![k] ?? 0) >= (table.get(b)![k] ?? 0)));
    if (beatsEveryone) dominators.push(a);
  }
  if (dominators.length) {
    ok = false;
    details.push(`DOMINANT POLICY: ${dominators.join(", ")} is at least as good as every other policy on every one of the ten priorities.`);
    details.push("A sandbox with a dominant way to play has a right answer, and this one is not supposed to.");
  } else {
    details.push(`No policy is at least as good as every other on all ten priorities. Each of the ${ids.length} policies is beaten somewhere.`);
    // Show the shape: which policy leads each priority.
    const leaders = PRIORITY_KEYS.map((k) => {
      const best = ids.reduce((a, b) => ((table.get(b)![k] ?? 0) > (table.get(a)![k] ?? 0) ? b : a));
      return `${k}: ${best}`;
    });
    details.push(`Leaders per priority — ${leaders.join(" · ")}`);
  }
  results.push({ id: 222, name: "S-10c · No policy dominates all priorities", pass: ok, details });

  /* --- 4 · rest-heavy is never strictly dominated --- */
  {
    const d: string[] = [];
    let restOk = true;
    const rest = table.get("rest-heavy");
    if (!rest) {
      restOk = false;
      d.push("the rest-heavy policy produced no runs");
    } else {
      const dominatedBy = ids
        .filter((b) => b !== "rest-heavy")
        .filter((b) => PRIORITY_KEYS.every((k) => (table.get(b)![k] ?? 0) >= rest[k]) && PRIORITY_KEYS.some((k) => (table.get(b)![k] ?? 0) > rest[k]));
      if (dominatedBy.length) {
        restOk = false;
        d.push(`rest-heavy is strictly dominated by: ${dominatedBy.join(", ")}`);
        d.push("Rest must be a real strategy, not a slower version of playing properly (§3.4).");
      } else {
        const wins = PRIORITY_KEYS.filter((k) => ids.every((b) => b === "rest-heavy" || rest[k] >= (table.get(b)![k] ?? 0)));
        d.push(
          `Rest-heavy is not strictly dominated by any policy${wins.length ? `; it leads on ${wins.join(", ")}` : ""}. ` +
            `Holding the floor is a way of playing, not a way of losing slowly.`,
        );
      }
    }
    results.push({ id: 223, name: "S-10d · Rest-heavy is never strictly dominated", pass: restOk, details: d });
  }
}

/* ============================================================
   5 · Three meaningfully different viable endings per preset
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  for (const preset of PRESETS) {
    const runs = fleet.filter((r) => r.origin === preset.id);
    const viable = runs.filter((r) => isViable(r.gaugeTrail, r.seasonsCompleted, SEASON_COUNT));
    // Greedily collect a mutually-different set.
    const distinct: FleetRun[] = [];
    for (const r of viable) if (distinct.every((d) => meaningfullyDifferent(d.signature, r.signature))) distinct.push(r);
    if (distinct.length < 3) {
      ok = false;
      details.push(
        `${preset.label}: only ${distinct.length} meaningfully different viable ending(s) from ${viable.length} viable runs of ${runs.length}.`,
      );
    } else {
      details.push(
        `${preset.label}: ${distinct.length} meaningfully different viable endings (of ${viable.length} viable runs) — e.g. ${distinct
          .slice(0, 3)
          .map((d) => d.policy)
          .join(", ")}.`,
      );
    }
  }
  results.push({ id: 224, name: "S-10e · At least three meaningfully different viable endings per preset", pass: ok, details });
}

/* ============================================================
   6 · The pile-up physics is doing what it says (reported, not asserted)
   ============================================================ */
{
  const details: string[] = [];
  let worst = 0;
  let suppressed = 0;
  for (const run of all)
    for (const t of run.telemetry) {
      worst = Math.max(worst, t.negativeArrivals);
      suppressed += t.suppressed;
    }
  const ok = worst <= 2;
  details.push(
    ok
      ? `The most negative arrivals any season in the fleet delivered: ${worst} (the published cap is two). ${suppressed} further negative arrivals were suppressed by the depletion floor across the fleet.`
      : `A season delivered ${worst} negative arrivals, above the published cap of two.`,
  );
  results.push({ id: 225, name: "S-10f · Pile-up cap holds across the fleet", pass: ok, details });
}

/* ============================================================
   Report
   ============================================================ */
for (const r of results.sort((a, b) => a.id - b.id)) reportGate(r);
const failed = results.filter((r) => !r.pass);
console.log("\n" + "=".repeat(60));
if (failed.length === 0) {
  console.log(`ALL ${results.length} BALANCE ASSERTIONS PASS (S-10, ${all.length} fleet runs)`);
  process.exit(0);
} else {
  console.log(`${failed.length} BALANCE ASSERTION(S) FAILED (S-10)`);
  process.exit(1);
}
