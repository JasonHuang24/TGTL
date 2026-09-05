/**
 * Coverage report for the timeline (5.0 §7.3, T-7).
 * Reports the empty years, the longest empty run before ninety, and the per-lane
 * counts — the three numbers §7.3 sets targets for.
 * Usage: node --experimental-strip-types tools/timeline-coverage.mjs
 */
import { MILESTONES } from "../content/timeline/generated/index.ts";
import { MAX_AGE, LANE_LABEL, LANES } from "../content/timeline/schema.ts";
import { coversAge } from "../content/timeline/select.ts";

let run = 0, longest = 0, at = -1;
const empties = [];
for (let a = 0; a <= MAX_AGE; a++) {
  const n = MILESTONES.filter((m) => coversAge(m, a)).length;
  if (n === 0) {
    empties.push(a);
    run++;
    if (a < 90 && run > longest) { longest = run; at = a - run + 1; }
  } else run = 0;
}
console.log(`years with no covering record: ${empties.length}`);
console.log(`longest empty run before ninety: ${longest}${at >= 0 ? ` (starting at ${at})` : ""}  — §7.3 allows at most three`);
console.log(`empty years: ${empties.join(", ") || "none"}`);
const byLane = Object.fromEntries(LANES.map((l) => [l, 0]));
for (const m of MILESTONES) byLane[m.lane] = (byLane[m.lane] ?? 0) + 1;
console.log("\nper lane (§7.3 floor is eight each):");
for (const l of LANES) {
  const n = byLane[l];
  console.log(`  ${n >= 8 ? "ok " : "LOW"} ${String(n).padStart(3)}  ${LANE_LABEL[l]}`);
}
