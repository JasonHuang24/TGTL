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
 * Run: npx tsx tools/curate-lab-seeds.ts
 */
import { LAB_SITUATIONS } from "@/content/sim/lab/situations";
import { runBranch, defaultChoices, choicesVaryingOneStep } from "@/lib/sim/lab";
import type { LabAxis } from "@/content/sim/schema";

function bandsOf(situationId: string, drawSeed: string, which: 0 | 1, presetId?: string): string {
  const sit = LAB_SITUATIONS.find((s) => s.id === situationId)!;
  const b = runBranch(sit, {
    id: "x",
    label: "x",
    axis: "choice-vary",
    choices: choicesVaryingOneStep(sit, which),
    drawSeed,
    presetId,
  });
  return b.steps.map((s) => s.band).join("|");
}

for (const sit of LAB_SITUATIONS) {
  console.log(`\n=== ${sit.id} ===`);
  // draw-vary: find an alt seed whose bands differ from the primary seed's.
  if (sit.axes.includes("draw-vary")) {
    const base = bandsOf(sit.id, sit.seeds.drawSeed, 0);
    let found: string | null = null;
    for (let i = 0; i < 400 && !found; i++) {
      const cand = `${sit.id}-alt-${i}`;
      if (bandsOf(sit.id, cand, 0) !== base) found = cand;
    }
    console.log(`  draw-vary  base=${base}  altDrawSeed: ${found ?? "NONE FOUND"} -> ${found ? bandsOf(sit.id, found, 0) : ""}`);
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
