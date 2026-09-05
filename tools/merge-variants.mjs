/**
 * Merges authored outcome-variant batches into the action pool.
 *
 * Input: one JSON file per batch, shaped {"act-id": {"band": ["line", ...]}}.
 * Output: the lines appended to each action's action-level `outcomeVariants`,
 * in the batch file that owns the action.
 *
 * It refuses rather than degrades. Every one of these would otherwise land as a
 * silent content defect that the gates find later, or worse, do not:
 *   - an unknown action id or band name (a typo silently dropping a whole pool)
 *   - a line already present in the pool, or equal to any option's own band line
 *     (the leak this whole pass exists to fix — see DECISIONS 2026-08-27)
 *   - a digit in a line (no-numbers doctrine)
 *   - a duplicate inside the incoming batch itself
 *
 * Run: node tools/merge-variants.mjs <dir-with-batch-jsons> [--apply]
 */
import fs from "node:fs";
import path from "node:path";

const DIR = process.argv[2];
const APPLY = process.argv.includes("--apply");
if (!DIR) {
  console.error("usage: node tools/merge-variants.mjs <dir> [--apply]");
  process.exit(2);
}

const SOURCES = [
  ...fs.readdirSync("content/sim/campaign/actions").filter((f) => f.startsWith("batch-")).map((f) => `content/sim/campaign/actions/${f}`),
];

/** file -> {src, head, tail, records} for the JSON-shaped batch files. */
const loaded = [];
for (const file of SOURCES) {
  const src = fs.readFileSync(file, "utf8");
  const open = src.indexOf("= [");
  const close = src.lastIndexOf("];");
  if (open < 0 || close < 0) continue;
  let records;
  try {
    records = JSON.parse(src.slice(open + 2, close + 1));
  } catch {
    continue;
  }
  loaded.push({ file, head: src.slice(0, open + 3), tail: src.slice(close + 1), records });
}

const owner = new Map();
for (const l of loaded) for (const r of l.records) owner.set(r.id, { l, r });

const errors = [];
const plan = [];
const seenIncoming = new Set();

for (const bf of fs.readdirSync(DIR).filter((f) => f.endsWith(".json"))) {
  const batch = JSON.parse(fs.readFileSync(path.join(DIR, bf), "utf8"));
  for (const [actionId, byBand] of Object.entries(batch)) {
    const found = owner.get(actionId);
    if (!found) {
      errors.push(`${bf}: unknown action id "${actionId}"`);
      continue;
    }
    const { r } = found;
    const validBands = new Set(r.options.flatMap((o) => o.bands.map((b) => b.name)));
    for (const [band, lines] of Object.entries(byBand)) {
      if (!validBands.has(band)) {
        errors.push(`${bf}: ${actionId} has no band "${band}" (has ${[...validBands].join(", ")})`);
        continue;
      }
      const baseLines = new Set(r.options.flatMap((o) => o.bands).filter((b) => b.name === band).map((b) => b.outcome.line));
      const existing = new Set(r.outcomeVariants?.[band] ?? []);
      for (const line of lines) {
        const key = `${actionId}|${band}|${line}`;
        if (seenIncoming.has(key)) {
          errors.push(`${bf}: ${actionId}/${band} repeats a line inside the batch: "${line.slice(0, 60)}…"`);
          continue;
        }
        seenIncoming.add(key);
        if (baseLines.has(line)) errors.push(`${bf}: ${actionId}/${band} duplicates an option's own band line: "${line.slice(0, 60)}…"`);
        else if (existing.has(line)) errors.push(`${bf}: ${actionId}/${band} duplicates an existing variant: "${line.slice(0, 60)}…"`);
        else if (/\d/.test(line)) errors.push(`${bf}: ${actionId}/${band} contains a digit: "${line.slice(0, 60)}…"`);
        else plan.push({ actionId, band, line, from: bf });
      }
    }
  }
}

console.log(`${plan.length} line(s) accepted, ${errors.length} rejected`);
for (const e of errors) console.log(`  REJECT  ${e}`);
if (errors.length) {
  console.log("\nNothing written. Fix the rejected lines and re-run.");
  process.exit(1);
}

for (const { actionId, band, line } of plan) {
  const { r } = owner.get(actionId);
  r.outcomeVariants ??= {};
  r.outcomeVariants[band] ??= [];
  r.outcomeVariants[band].push(line);
}

const byFile = {};
for (const { actionId, from } of plan) byFile[owner.get(actionId).l.file] = (byFile[owner.get(actionId).l.file] ?? 0) + 1;
for (const [f, n] of Object.entries(byFile)) console.log(`  ${path.basename(f)}: +${n}`);

if (APPLY) {
  const touched = new Set(plan.map((p) => owner.get(p.actionId).l));
  for (const l of touched) fs.writeFileSync(l.file, l.head + JSON.stringify(l.records, null, 2).slice(1) + l.tail, "utf8");
  console.log(`\nWROTE ${touched.size} file(s)`);
} else {
  console.log("\nDRY RUN — pass --apply to write");
}
