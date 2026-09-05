/**
 * Writes a campaign PAUSED ON A QUIET SEASON to tests/fixtures/quiet-season.json,
 * so the browser gates can reach N-194's "Repeat last season" control.
 *
 * The control renders only where `briefing().quiet` is true AND a previous
 * allocation exists — that is the whole point of it, and it means a browser walk
 * cannot be relied on to arrive at one: whether season two is quiet depends on
 * the seeds, the hand and what was committed. Driving seasons by hand until one
 * happens to be quiet is exactly the sampling that leaves a gate silently
 * unarmed, so the state is produced here, by the real engine through the real
 * commit path, and the browser loads and renders it as it would any resumed run —
 * the same honest shortcut tools/make-parse-fixture.ts takes for the look-back.
 *
 * Run: npx tsx tools/make-quiet-season-fixture.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import {
  newCampaign,
  setPriorities,
  commitSeason,
  emptyPriorities,
  budgetFor,
  serialize,
  briefing,
  SEASON_COUNT,
} from "@/lib/sim/campaign";
import { menu } from "@/lib/sim/season";
import { PRESETS } from "@/content/sim/registry";
import { SIM_KEYS } from "@/lib/sim/persist";
import type { CommittedEventResponse, SimState } from "@/content/sim/schema";

function drive(presetId: string, handSeed: string, drawSeed: string): SimState | null {
  let s = newCampaign({ origin: { kind: "preset", presetId }, handSeed, drawSeed });
  s = setPriorities(s, { ...emptyPriorities(), safety: 2, health: 2 });
  for (let guard = 0; s.seasonIndex < SEASON_COUNT && guard < SEASON_COUNT; guard++) {
    // A quiet season with something to repeat: at least one committed season
    // behind it, and nothing arriving or pending in this one.
    if (s.committed.length > 0 && briefing(s).quiet) return s;
    const remaining = budgetFor(s);
    const allocations = menu(s, remaining)
      .filter((m) => m.available && m.affordable && !m.action.floor)
      .slice(0, 2)
      .map((m) => ({ actionId: m.action.id, optionId: m.action.options[0].id, instanceOrdinal: 0 }));
    if (!allocations.length) return null;
    let responses: CommittedEventResponse[] = [];
    let out = commitSeason(s, allocations, responses, undefined);
    for (let inner = 0; !out.done && inner < 12; inner++) {
      responses = [...responses, { eventId: out.pendingEvent.id, optionId: out.pendingEvent.options[0].id }];
      out = commitSeason(s, allocations, responses, undefined);
    }
    if (!out.done) return null;
    s = out.state;
  }
  return null;
}

let found: SimState | null = null;
let searched = 0;
outer: for (const preset of PRESETS) {
  for (let i = 0; i < 40; i++) {
    searched++;
    const s = drive(preset.id, `quiet-${preset.id}`, `quiet-draw-${i}`);
    if (s) {
      found = s;
      break outer;
    }
  }
}

if (!found) {
  console.error("no quiet season reachable in the searched space — the compressed flow may be offered nowhere, which is itself a finding");
  process.exit(1);
}

mkdirSync("tests/fixtures", { recursive: true });
writeFileSync(
  "tests/fixtures/quiet-season.json",
  JSON.stringify(
    {
      key: SIM_KEYS.active,
      value: serialize(found),
      seasonsCommitted: found.committed.length,
      seasonIndex: found.seasonIndex,
      repeats: found.committed[found.committed.length - 1].allocations.map((a) => a.actionId),
    },
    null,
    2,
  ),
  "utf8",
);
console.log(
  `tests/fixtures/quiet-season.json — ${found.committed.length} seasons committed, paused at seasonIndex ${found.seasonIndex} (quiet), after ${searched} drives`,
);
