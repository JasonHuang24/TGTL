/** Records whose window spans most of a life — usually a survey's age universe
 *  encoded as a window, which puts the record in almost every year card. */
import { MILESTONES } from "../content/timeline/generated/index.ts";
import { LANE_LABEL } from "../content/timeline/schema.ts";
const rows = [];
for (const m of MILESTONES) {
  const t = m.timing; if (!t) continue;
  const lo = t.window?.from ?? (typeof t.typical === "object" ? t.typical.from : t.typical) ?? t.exact;
  const hi = t.window?.to ?? (typeof t.typical === "object" ? t.typical.to : t.typical) ?? t.exact;
  if (lo === undefined || hi === undefined) continue;
  const span = hi - lo;
  if (span >= 30) rows.push({ id: m.id, lane: m.lane, span, lo, hi, label: m.label });
}
rows.sort((a, b) => b.span - a.span);
console.log(`${rows.length} record(s) span 30 years or more:\n`);
for (const r of rows) {
  console.log(`  ${String(r.span).padStart(3)}y  ${r.lo}-${r.hi}  ${LANE_LABEL[r.lane].padEnd(20)} ${r.id}`);
  console.log(`        ${r.label.slice(0, 100)}`);
}
