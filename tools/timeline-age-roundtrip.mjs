/**
 * Checks that every fractional age in the pool renders back to the unit the source
 * used. A developmental milestone recorded as 0.17 years must render as "2 months",
 * because two months is what the page says; if the rounding drifted, the surface
 * would state a figure the source does not.
 */
import { MILESTONES } from "../content/timeline/generated/index.ts";
import { formatAge } from "../content/timeline/select.ts";

const seen = new Map();
const walk = (t) => {
  if (!t) return [];
  const v = [];
  if (t.exact !== undefined) v.push(t.exact);
  if (t.variesByState) v.push(t.variesByState.from, t.variesByState.to);
  if (t.window) v.push(t.window.from, t.window.to);
  if (typeof t.typical === "number") v.push(t.typical);
  else if (t.typical) v.push(t.typical.from, t.typical.to);
  return v;
};
for (const m of MILESTONES) for (const n of walk(m.timing)) if (!Number.isInteger(n)) seen.set(n, formatAge(n));
console.log("fractional ages in the pool and how they render:");
let bad = 0;
for (const [n, s] of [...seen].sort((a, b) => a[0] - b[0])) {
  const months = n * 12;
  const exact = Math.abs(months - Math.round(months)) < 0.06;
  const note = n < 2 ? (exact ? "ok" : `DRIFT: ${months.toFixed(2)} months`) : "ok";
  if (note !== "ok") bad++;
  console.log(`  ${String(n).padStart(6)}  ->  ${s.padEnd(12)} ${note}`);
}
console.log(bad === 0 ? "\nall fractional ages round-trip to the unit their source used" : `\n${bad} DRIFTED`);
