/**
 * Strip base-line copies out of action-level outcomeVariants pools.
 *
 * outcomeVariants is keyed by BAND NAME and shared by every option of the action,
 * so its lines must be option-NEUTRAL. Some batches were authored with the pool as
 * "every line this band can produce", which put each option's own specific line
 * into a pool the other options also rotate through — so choosing "send a message"
 * could narrate "you turn up and carry boxes". This removes those copies. It is
 * idempotent and reports what it took out.
 */
import fs from "node:fs";
import path from "node:path";

const files = process.argv.slice(2);
let removed = 0, touched = 0;

for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const open = src.indexOf("= [");
  const close = src.lastIndexOf("];");
  if (open < 0 || close < 0) { console.error(`SKIP ${file}: no array literal`); continue; }
  const head = src.slice(0, open + 3); // "= [" is three characters
  const tail = src.slice(close + 1);
  let records;
  try { records = JSON.parse(src.slice(open + 2, close + 1)); }
  catch (e) { console.error(`SKIP ${file}: ${e.message}`); continue; }

  let fileRemoved = 0;
  for (const r of records) {
    if (!r.outcomeVariants) continue;
    for (const [band, pool] of Object.entries(r.outcomeVariants)) {
      const baseLines = new Set(
        (r.options ?? []).flatMap((o) => o.bands ?? []).filter((b) => b.name === band).map((b) => b.outcome.line),
      );
      const seen = new Set();
      const kept = pool.filter((l) => {
        if (baseLines.has(l) || seen.has(l)) return false;
        seen.add(l);
        return true;
      });
      if (kept.length !== pool.length) {
        fileRemoved += pool.length - kept.length;
        r.outcomeVariants[band] = kept;
      }
      if (!kept.length) delete r.outcomeVariants[band];
    }
    if (!Object.keys(r.outcomeVariants).length) delete r.outcomeVariants;
  }

  if (fileRemoved) {
    fs.writeFileSync(file, head + JSON.stringify(records, null, 2).slice(1) + tail, "utf8");
    console.log(`${path.basename(file)}: removed ${fileRemoved}`);
    removed += fileRemoved; touched++;
  }
}
console.log(`\n${removed} base-line copies removed from ${touched} file(s)`);
