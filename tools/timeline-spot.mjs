/** Prints how selected records actually render, for eyeballing. */
import { MILESTONES } from "../content/timeline/generated/index.ts";
import { windowText } from "../content/timeline/select.ts";
const want = process.argv.slice(2);
const rows = want.length ? MILESTONES.filter((m) => want.includes(m.id)) : MILESTONES;
for (const m of rows) {
  console.log(`${m.id.padEnd(46)} ${(m.measure ?? "-").padEnd(14)} "${windowText(m)}"`);
}
