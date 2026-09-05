/** Reports exactly how many option-neutral variant lines each band still needs. */
import { ACTION_BY_ID } from "@/content/sim/registry";
type Row = { id: string; label: string; file: string; need: number; bands: Record<string, { have: number; want: number }> };
const rows: Row[] = [];
for (const a of Object.values(ACTION_BY_ID) as any[]) {
  if (!a.repeatable) continue;
  const unconditional =
    !a.requiresFlags?.length && !a.contract.prerequisites && a.seasonBands.some(([lo, hi]: number[]) => hi - lo >= 12);
  const want = (unconditional ? 6 : 2) - 1; // each option contributes its own base line
  const bandsUsed = [...new Set(a.options.flatMap((o: any) => o.bands.map((b: any) => b.name)))] as string[];
  const bands: Row["bands"] = {};
  let need = 0;
  for (const band of bandsUsed) {
    const have = a.outcomeVariants?.[band]?.length ?? 0;
    if (have < want) { bands[band] = { have, want }; need += want - have; }
  }
  if (need) rows.push({ id: a.id, label: a.label, file: "", need, bands });
}
rows.sort((x, y) => y.need - x.need);
let total = 0;
for (const r of rows) {
  total += r.need;
  console.log(`${r.id}  (+${r.need})  ${Object.entries(r.bands).map(([b, v]) => `${b} ${v.have}->${v.want}`).join("  ")}`);
}
console.log(`\n${rows.length} actions, ${total} new option-neutral lines needed`);
