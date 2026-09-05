/**
 * The C suite — the consolidation's automated gates (blueprint 6.0 §8).
 *
 * Run: npm run gates:consolidation   (needs `npm run build` first for rendered halves)
 *
 * One entry per C-gate, registered here from batch 0 and reporting N/A until the
 * batch that gives it a subject lands (the 4.0/5.0 pattern). A GATE IS NOT A CHECK
 * UNTIL IT HAS BEEN SHOWN TO FAIL: every gate marked "probe" below gets a
 * plant-and-restore case in tests/falsify-walls.sh; every gate marked "record" has
 * its proven-red run pasted into DECISIONS.md section 8 under the batch that built it.
 *
 * Output format is `[PASS|FAIL|N/A] Gate C-N: name` so a probe can name a gate
 * without colliding with the static or T-suite numbering.
 */
import { existsSync } from "node:fs";
import { OUT_DIR } from "./util.ts";

export type CGateResult = { pass: boolean; details: string[] };

export type CGate = {
  id: number;
  row: string;
  name: string;
  proof: "probe" | "record";
  /** Returns null while the subject does not exist yet (reported N/A). */
  run: () => CGateResult | null;
};

const NA = (): CGateResult | null => null;

export const GATES: CGate[] = [
  { id: 1, row: "N-226", name: "A failed or unverified write never reports saved", proof: "record", run: NA },
  { id: 2, row: "N-190", name: "A rendered failure mode carries its tied recovery route", proof: "probe", run: NA },
  { id: 3, row: "N-191", name: "Every switchingCost renders on its option card", proof: "record", run: NA },
  { id: 4, row: "N-260", name: "No region label broader than verified coverage", proof: "probe", run: NA },
  { id: 5, row: "N-160", name: "The map lens settings render identical content or cite a source", proof: "probe", run: NA },
  { id: 6, row: "N-263", name: "Double-Escape exits every set-down route", proof: "record", run: NA },
  { id: 7, row: "N-267", name: "Every fixture region has a SAFETY_SOURCES entry, dated", proof: "probe", run: NA },
  { id: 8, row: "N-268", name: "The safety check precedes every ordering", proof: "probe", run: NA },
  { id: 9, row: "N-272", name: "Set-down lint carries no evidence-label word", proof: "probe", run: NA },
  { id: 10, row: "N-273", name: "No caring-duty record names a companion or condition", proof: "probe", run: NA },
  { id: 11, row: "N-192", name: "One draw-vary pair renders the same-outcome reading", proof: "probe", run: NA },
  { id: 12, row: "N-194", name: "Repeat-last-season commits an ordered set and replays byte-identical", proof: "record", run: NA },
  { id: 13, row: "N-195", name: "Methodology names the Lab seed curation tool and criterion", proof: "probe", run: NA },
  { id: 14, row: "N-204", name: "Every season screen carries its origin motif", proof: "record", run: NA },
  { id: 15, row: "N-211", name: "No option renders without the five contract fields", proof: "probe", run: NA },
  { id: 16, row: "N-212", name: "previewAction is pure", proof: "probe", run: NA },
  { id: 17, row: "N-213", name: "Upkeep is present and affordable in the worst envelope", proof: "probe", run: NA },
  { id: 18, row: "N-214", name: "The narrowing door state never uses the open token", proof: "probe", run: NA },
  { id: 19, row: "N-233", name: "No valence colour pair; no forbidden-register term in Game Guide", proof: "probe", run: NA },
  { id: 20, row: "N-216", name: "A reopened season renders its stored explanation", proof: "record", run: NA },
  { id: 21, row: "N-218", name: "The empty queue states that uncertainty remains", proof: "probe", run: NA },
  { id: 22, row: "N-225", name: "Every Lab situation declares an unknown before the branches", proof: "probe", run: NA },
  { id: 23, row: "N-228", name: "Every SimState field the engine reads has a mid-run surface", proof: "probe", run: NA },
  { id: 24, row: "N-235", name: "No Try-in-Play link on a set-down route", proof: "probe", run: NA },
  { id: 25, row: "N-355", name: "Every parse panel declares recorded / interpreted / unknowable", proof: "probe", run: NA },
  { id: 26, row: "N-001", name: "/orientation renders JS-off with no game term in Standard", proof: "probe", run: NA },
  { id: 27, row: "N-012", name: "Every route and milestone page is in the search index; anchors resolve", proof: "probe", run: NA },
  { id: 28, row: "N-023", name: "Getting-through-today: no analytical framing, no instrument link above the fold", proof: "probe", run: NA },
  { id: 29, row: "N-025", name: "No research construct attributed without an evidence record", proof: "probe", run: NA },
  { id: 30, row: "N-041", name: "The conflict section carries no recommendation verb", proof: "probe", run: NA },
  { id: 31, row: "N-111", name: "Every concept cell links the route that owns the mechanism", proof: "probe", run: NA },
  { id: 32, row: "N-320", name: "Every NextStep carries a relation from the closed list and a why", proof: "probe", run: NA },
  { id: 33, row: "N-321", name: "The single-home invariant renders on every topic route", proof: "probe", run: NA },
  { id: 34, row: "N-326", name: "The term marker never renders in Standard or on set-down routes", proof: "probe", run: NA },
  { id: 35, row: "N-329", name: "No comic-register route is set-down or loss-adjacent", proof: "probe", run: NA },
  { id: 36, row: "N-072", name: "Every classifying surface offers a rejection honoured in rendering", proof: "probe", run: NA },
  { id: 37, row: "N-074", name: "The export path issues no network request", proof: "record", run: NA },
  { id: 38, row: "N-077", name: "Every planned task declares a stop condition", proof: "probe", run: NA },
  { id: 39, row: "N-080", name: "No ranked output without objective, constraints and horizon above it", proof: "probe", run: NA },
  { id: 40, row: "N-091", name: "No sim token or class on the daily plan", proof: "probe", run: NA },
  { id: 41, row: "N-093", name: "Every comparison closes with the no-winner panel", proof: "probe", run: NA },
  { id: 42, row: "N-150", name: "Position produces no rank, band or comparison and never enters a URL", proof: "probe", run: NA },
  { id: 43, row: "N-170", name: "Every placement belongs to a named objective; changing it changes the board", proof: "probe", run: NA },
  { id: 44, row: "N-171", name: "No placement renders without the ruleset header", proof: "probe", run: NA },
  { id: 45, row: "N-281", name: "Disanalogy entries and their inheriting routes resolve both ways", proof: "probe", run: NA },
  { id: 46, row: "N-290", name: "The retractions register renders when empty", proof: "probe", run: NA },
  { id: 47, row: "N-291", name: "A page changed by a logged correction renders a revision note", proof: "probe", run: NA },
  { id: 48, row: "N-296", name: "Every new route records what it changes", proof: "probe", run: NA },
  { id: 49, row: "N-301", name: "Every perishable route renders a stamp and review date", proof: "probe", run: NA },
  { id: 50, row: "N-302", name: "Planned badges and WHATS_COMING ids match both ways", proof: "probe", run: NA },
  { id: 51, row: "N-306", name: "A pre-existing saved library survives a suite run byte-identical", proof: "record", run: NA },
];

if (!existsSync(OUT_DIR)) {
  console.error("out/ not found. Run `npm run build` first.");
  process.exit(2);
}

let failed = 0;
let na = 0;
for (const g of GATES) {
  const r = g.run();
  const tag = r === null ? "N/A " : r.pass ? "PASS" : "FAIL";
  console.log(`[${tag}] Gate C-${g.id}: ${g.name} (${g.row})`);
  if (r) for (const d of r.details) console.log(`       ${d}`);
  if (r === null) na++;
  else if (!r.pass) failed++;
}
console.log("\n" + "=".repeat(60));
if (failed === 0) {
  console.log(`C SUITE: ${GATES.length - na} substantive gate(s) pass, ${na} N/A`);
  process.exit(0);
} else {
  console.log(`${failed} C GATE(S) FAILED`);
  process.exit(1);
}
