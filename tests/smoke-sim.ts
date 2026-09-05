/**
 * Engine smoke drive — not a gate, a development probe. Runs a campaign end to
 * end under a simple policy and prints what the season loop actually produced,
 * so the physics can be eyeballed before the gates formalise it.
 *
 * Run: npx tsx tests/smoke-sim.ts
 */
import { newCampaign, setPriorities, briefing, commitSeason, budgetFor, nextOrdinal, remainingBudget } from "@/lib/sim/campaign";
import { affordableMenu, floorReport, beatForSeason } from "@/lib/sim/season";
import { computeParse } from "@/lib/sim/parse";
import { compare } from "@/lib/sim/lab";
import { ACTIONS, EVENTS, SEASON_COUNT } from "@/content/sim/registry";
import { LAB_SITUATIONS } from "@/content/sim/lab/situations";
import { PRESETS } from "@/content/sim/campaign/presets";
import { emptyPriorities } from "@/lib/sim/campaign";
import type { CommittedAllocation, SimState } from "@/content/sim/schema";

console.log(`pool: ${ACTIONS.length} actions, ${EVENTS.length} events, ${PRESETS.length} presets, ${LAB_SITUATIONS.length} lab situations`);

function drive(presetId: string, seed: string) {
  let s: SimState = newCampaign({ origin: { kind: "preset", presetId }, handSeed: seed, drawSeed: seed + "-draw" });
  s = setPriorities(s, { ...emptyPriorities(), safety: 2, mastery: 2, closeness: 1 });
  s = { ...s, phase: "briefing" };

  let minAffordable = Infinity;
  let minFamilies = Infinity;
  let floorFails = 0;
  let seasons = 0;
  let beats = 0;

  while (s.seasonIndex < SEASON_COUNT) {
    const budget = budgetFor(s);
    const report = floorReport(s, budget);
    minAffordable = Math.min(minAffordable, report.affordableCount);
    minFamilies = Math.min(minFamilies, report.families.length);
    if (!report.pass) {
      floorFails++;
      if (floorFails <= 3) console.log(`  FLOOR FAIL s${s.seasonIndex + 1}: ${report.detail}`);
    }
    const beat = beatForSeason(s);
    if (beat) beats++;

    // Greedy policy: take affordable actions until the budget will not stretch.
    const allocations: CommittedAllocation[] = [];
    for (let i = 0; i < 4; i++) {
      const menu = affordableMenu(s, remainingBudget(s, allocations)).filter(
        (m) => !allocations.some((a) => a.actionId === m.action.id),
      );
      if (!menu.length) break;
      const pick = menu[(s.seasonIndex + i) % menu.length];
      allocations.push({
        actionId: pick.action.id,
        instanceOrdinal: nextOrdinal(s, allocations, pick.action.id),
        optionId: pick.action.options[(s.seasonIndex + i) % pick.action.options.length].id,
      });
    }

    let responses: { eventId: string; optionId: string }[] = [];
    let run = commitSeason(s, allocations, responses, beat ? { beatId: beat.beat.id, skipped: false } : undefined);
    let guard = 0;
    while (!run.done && guard++ < 8) {
      responses = [...responses, { eventId: run.pendingEvent.id, optionId: run.pendingEvent.options[0].id }];
      run = commitSeason(s, allocations, responses, beat ? { beatId: beat.beat.id, skipped: false } : undefined);
    }
    if (!run.done) {
      console.log("  STALLED on a pending event");
      break;
    }
    if (seasons < 2) {
      const b = briefing(s);
      console.log(
        `  s${s.seasonIndex + 1} (age ${b.age}, ${b.half}) budget T${budget.timeStructure}/E${budget.energy}/M${budget.money} — ${report.detail}`,
      );
      for (const item of run.result.items.slice(0, 4))
        console.log(`     [${item.kind}] ${item.band ?? "-"} · ${item.line.slice(0, 96)}`);
    }
    s = run.state;
    seasons++;
    if (seasons > 40) break;
  }

  const parse = computeParse(s);
  return { s, seasons, beats, minAffordable, minFamilies, floorFails, parse };
}

for (const preset of PRESETS.slice(0, 5)) {
  console.log(`\n=== ${preset.label} ===`);
  const r = drive(preset.id, `smoke-${preset.id}`);
  console.log(
    `  seasons=${r.seasons} beats=${r.beats} minAffordable=${r.minAffordable} minFamilies=${r.minFamilies} floorFails=${r.floorFails}`,
  );
  console.log(`  end gauges: ${JSON.stringify(r.s.gauges)} debt=${r.s.maintenanceDebt} queue=${r.s.queue.length}`);
  console.log(`  parse: ${r.parse.seasons.length} season notes, ${r.parse.achievements.length} achievements, ${r.parse.costs.length} costs`);
  console.log(`  attribution: ${r.parse.attribution.map((a) => `${a.category}=${a.share}`).join(", ")}`);
  console.log(`  bridge theme: ${r.parse.bridge.theme}`);
}

console.log("\n=== Lab ===");
for (const sit of LAB_SITUATIONS) {
  for (const axis of sit.axes) {
    const c = compare(sit.id, axis);
    if (!c) {
      console.log(`  ${sit.id}/${axis}: NO COMPARISON`);
      continue;
    }
    console.log(`  ${sit.id} · ${axis}: ${c.differences.length} differences — ${c.differences.map((d) => d.field).join(", ") || "(none)"}`);
  }
}
