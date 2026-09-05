/**
 * Lab seed curation (blueprint 4.0 §3.8).
 *
 * A Lab situation's seeds are FIXED so a comparison replays byte-identically.
 * WHICH fixed seeds is a curation decision, and the blueprint makes it for us: the
 * three axes have to teach their three lessons, so a draw-vary pair whose branches
 * happen to land identically teaches nothing on first encounter.
 *
 * This curates the WINDOW, not the engine. It only chooses which fixed seed a
 * situation ships with; the physics is untouched, the result is deterministic, and
 * the honest "both branches landed the same" reading still exists for the runs
 * where that is true.
 *
 * TWO CRITERIA, not one (N-192, 6.0 §3.9).
 *
 *   SEPARATES — the alternate draw lands the pair in different bands. This is what
 *   the tool searched for originally, and every shipped pair was curated on it, so
 *   the Lab could only ever teach the first half of the draw-vary lesson: "luck
 *   moved it".
 *
 *   LANDS THE SAME — the alternate draw lands the pair in the SAME bands AND the
 *   same ending. `lib/sim/lab.ts`'s third draw-vary reading ("Identical choices,
 *   different luck, and the same result anyway…") has existed in the code since
 *   4.0 and could never render, because no shipped pair satisfied it. It is the
 *   more consoling and more often true half of G-09: the move's range was narrow,
 *   so the draw had nothing to move.
 *
 * "The same" here means what `reading()` in lib/sim/lab.ts means by it — the same
 * band at every step AND a byte-identical `ending` (gauges, skills, run flags) —
 * so a seed this tool nominates is one that makes that exact reading render, not a
 * seed that merely looks similar.
 *
 * Run: npx tsx tools/curate-lab-seeds.ts
 */
import { LAB_SITUATIONS } from "@/content/sim/lab/situations";
import { runBranch, defaultChoices, choicesVaryingOneStep } from "@/lib/sim/lab";
import type { LabAxis } from "@/content/sim/schema";

/** How many candidate seeds each criterion walks before giving up. */
const SEARCH_DEPTH = 400;

function branchOf(situationId: string, drawSeed: string, which: 0 | 1, presetId?: string) {
  const sit = LAB_SITUATIONS.find((s) => s.id === situationId)!;
  return runBranch(sit, {
    id: "x",
    label: "x",
    axis: "choice-vary",
    choices: choicesVaryingOneStep(sit, which),
    drawSeed,
    presetId,
  });
}

function bandsOf(situationId: string, drawSeed: string, which: 0 | 1, presetId?: string): string {
  return branchOf(situationId, drawSeed, which, presetId)
    .steps.map((s) => s.band)
    .join("|");
}

/**
 * The full signature `reading()` decides "same" on: the bands AND the ending. A
 * bands-only comparison is not enough — two draws can land the same bands and
 * still leave the character in different places, and lib/sim/lab.ts would then
 * render the "arrive in the same place" middle reading rather than the same-result
 * one this criterion is searching for.
 */
function signatureOf(situationId: string, drawSeed: string, which: 0 | 1, presetId?: string): string {
  const b = branchOf(situationId, drawSeed, which, presetId);
  return `${b.steps.map((s) => s.band).join("|")}##${JSON.stringify(b.ending)}`;
}

for (const sit of LAB_SITUATIONS) {
  console.log(`\n=== ${sit.id} ===`);
  // draw-vary, criterion 1: an alt seed whose bands differ from the primary's.
  if (sit.axes.includes("draw-vary")) {
    const base = bandsOf(sit.id, sit.seeds.drawSeed, 0);
    let found: string | null = null;
    for (let i = 0; i < SEARCH_DEPTH && !found; i++) {
      const cand = `${sit.id}-alt-${i}`;
      if (bandsOf(sit.id, cand, 0) !== base) found = cand;
    }
    console.log(`  draw-vary  base=${base}  altDrawSeed: ${found ?? "NONE FOUND"} -> ${found ? bandsOf(sit.id, found, 0) : ""}`);

    // draw-vary, criterion 2 (N-192): an alt seed that lands the SAME — the same
    // band at every step and the same ending — so the same-outcome reading in
    // lib/sim/lab.ts renders somewhere in the shipped set.
    const baseSig = signatureOf(sit.id, sit.seeds.drawSeed, 0);
    let same: string | null = null;
    let sameChecked = 0;
    for (let i = 0; i < SEARCH_DEPTH && !same; i++) {
      const cand = `${sit.id}-same-${i}`;
      if (cand === sit.seeds.drawSeed) continue;
      sameChecked++;
      if (signatureOf(sit.id, cand, 0) === baseSig) same = cand;
    }
    console.log(
      `  draw-vary  same-landing altDrawSeed: ${same ?? `NONE FOUND in ${sameChecked} candidates`}` +
        (same ? `  (bands and ending identical to the primary seed's)` : ""),
    );
  }
  // choice-vary: find a primary seed where the two option sets diverge.
  if (sit.axes.includes("choice-vary")) {
    const a = bandsOf(sit.id, sit.seeds.drawSeed, 0);
    const b = bandsOf(sit.id, sit.seeds.drawSeed, 1);
    if (a !== b) console.log(`  choice-vary already separates: ${a} vs ${b}`);
    else {
      let found: string | null = null;
      for (let i = 0; i < 400 && !found; i++) {
        const cand = `${sit.id}-draw-${i}`;
        if (bandsOf(sit.id, cand, 0) !== bandsOf(sit.id, cand, 1)) found = cand;
      }
      console.log(`  choice-vary needs drawSeed: ${found ?? "NONE FOUND"} -> ${found ? bandsOf(sit.id, found, 0) + " vs " + bandsOf(sit.id, found, 1) : ""}`);
    }
  }
  if (sit.axes.includes("position-vary")) {
    const a = bandsOf(sit.id, sit.seeds.drawSeed, 0, sit.positions[0]);
    const b = bandsOf(sit.id, sit.seeds.drawSeed, 0, sit.positions[1]);
    console.log(`  position-vary: ${a} vs ${b}${a === b ? "  (SAME — check)" : ""}`);
  }
}
