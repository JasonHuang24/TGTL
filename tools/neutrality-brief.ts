/**
 * Dumps every EXISTING variant pool with the options that band is reachable from.
 *
 * Variant neutrality is semantic, so no gate can assert it: a line is wrong when
 * it narrates a method the player may not have used, and only a reader can tell.
 * This is the material a reader needs — the band, every option that can land it,
 * every option's own line, and the shared pool that renders after all of them.
 */
import { ACTION_BY_ID, EVENT_BY_ID } from "@/content/sim/registry";

const only = process.argv[2]; // optional file-ish filter by id prefix
const all = [...Object.values(ACTION_BY_ID), ...Object.values(EVENT_BY_ID)] as any[];
let pools = 0, lines = 0;
for (const r of all) {
  const v = r.outcomeVariants ?? {};
  if (!Object.keys(v).length) continue;
  if (only && !r.id.startsWith(only)) continue;
  console.log(`\n================ ${r.id} — ${r.label}`);
  if (r.scene) console.log(`SCENE: ${r.scene}`);
  for (const [band, pool] of Object.entries(v) as [string, string[]][]) {
    const opts = r.options.filter((o: any) => o.bands.some((b: any) => b.name === band));
    if (!opts.length) { console.log(`\n  !! BAND ${band}: NO OPTION CAN REACH IT — the pool is dead`); continue; }
    pools++;
    console.log(`\n  BAND ${band} — renders after ${opts.length} option(s):`);
    for (const o of opts) {
      const b = o.bands.find((x: any) => x.name === band);
      console.log(`     [${o.label}] own line: ${b.outcome.line}`);
    }
    console.log(`  SHARED POOL (renders after EVERY option above):`);
    pool.forEach((l, i) => { lines++; console.log(`     v${i}: ${l}`); });
  }
}
console.error(`\n${pools} pools, ${lines} shared lines`);
