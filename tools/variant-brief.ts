/** Dumps the full authoring context for the actions still short of variant depth. */
import { ACTION_BY_ID } from "@/content/sim/registry";
const ids = process.argv.slice(2);
for (const id of ids) {
  const a: any = ACTION_BY_ID[id];
  if (!a) { console.log(`!! unknown ${id}`); continue; }
  const unconditional =
    !a.requiresFlags?.length && !a.contract.prerequisites && a.seasonBands.some(([lo, hi]: number[]) => hi - lo >= 12);
  const want = (unconditional ? 6 : 2) - 1;
  console.log(`\n================ ${a.id}`);
  console.log(`LABEL:  ${a.label}`);
  console.log(`FAMILY: ${a.family}   seasons: ${JSON.stringify(a.seasonBands)}   evidence: ${a.evidenceLabel}`);
  console.log(`SCENE:  ${a.scene ?? "(none)"}`);
  console.log(`COSTS:  ${JSON.stringify(a.contract.costs)}   variance: ${a.contract.variance}  reversibility: ${a.contract.reversibility}`);
  console.log(`OPTIONS — the pool must read true after ANY of these:`);
  for (const o of a.options) {
    console.log(`   * ${o.label}${o.endurance ? "  [endurance]" : ""}${o.recovery ? "  [recovery]" : ""}`);
    if (o.detail) console.log(`     ${o.detail}`);
    console.log(`     bands: ${o.bands.map((b: any) => b.name).join(", ")}`);
    for (const b of o.bands) console.log(`       BASE ${b.name}: ${b.outcome.line}`);
  }
  const bandsUsed = [...new Set(a.options.flatMap((o: any) => o.bands.map((b: any) => b.name)))] as string[];
  for (const band of bandsUsed) {
    const have: string[] = a.outcomeVariants?.[band] ?? [];
    const gap = want - have.length;
    if (gap <= 0) { console.log(`\n  BAND ${band}: already ${have.length}/${want} — WRITE NOTHING`); continue; }
    console.log(`\n  BAND ${band}: have ${have.length}, need ${want}  ==> WRITE ${gap} NEW LINE(S)`);
    have.forEach((l, i) => console.log(`     existing v${i}: ${l}`));
  }
}
