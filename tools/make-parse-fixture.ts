/**
 * Writes a FINISHED 24-season campaign to tests/fixtures/finished-campaign.json,
 * so the browser gates can screenshot and audit the campaign's closing screen.
 *
 * The parse is the last thing a player reads after twelve years, and it carries
 * the Doors panel, the attribution split, the priority readings and the bridge —
 * and nothing was capturing it, because reaching it through the UI means driving
 * every season by hand. It was the one play surface the art checkpoint could not
 * see and S-9 never audited. Seeding the run is the honest shortcut: the state is
 * produced by the real engine through the real commit path, and the browser then
 * loads and renders it exactly as it would any resumed run.
 *
 * Run: npx tsx tools/make-parse-fixture.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { newCampaign, setPriorities, commitSeason, emptyPriorities, budgetFor, serialize, SEASON_COUNT } from "@/lib/sim/campaign";
import { menu } from "@/lib/sim/season";
import { PRESETS } from "@/content/sim/registry";
import { SIM_KEYS } from "@/lib/sim/persist";
import type { CommittedEventResponse } from "@/content/sim/schema";

// Care-Constrained Builder, so the run also carries a hand-placed beat, and a
// mixed set of priorities so the closing readings are not all the same shape.
let s = newCampaign({
  origin: { kind: "preset", presetId: PRESETS[3].id },
  handSeed: "showcase",
  drawSeed: "showcase-d",
});
s = setPriorities(s, { ...emptyPriorities(), closeness: 3, safety: 2, mastery: 2, meaning: 1 });

let guard = 0;
while (s.seasonIndex < SEASON_COUNT && guard++ < SEASON_COUNT + 5) {
  const remaining = budgetFor(s);
  const allocations = menu(s, remaining)
    .filter((m) => m.available && m.affordable)
    // Rotate the pick so the run is not one action twenty-four times.
    .slice(s.seasonIndex % 3, (s.seasonIndex % 3) + 3)
    .map((m) => ({ actionId: m.action.id, optionId: m.action.options[0].id, instanceOrdinal: 0 }));
  let responses: CommittedEventResponse[] = [];
  let out = commitSeason(s, allocations, responses, undefined);
  let inner = 0;
  while (!out.done && inner++ < 12) {
    responses = [...responses, { eventId: out.pendingEvent.id, optionId: out.pendingEvent.options[0].id }];
    out = commitSeason(s, allocations, responses, undefined);
  }
  if (!out.done) break;
  s = out.state;
}

mkdirSync("tests/fixtures", { recursive: true });
writeFileSync(
  "tests/fixtures/finished-campaign.json",
  JSON.stringify({ key: SIM_KEYS.active, value: serialize(s), seasonsCompleted: s.committed.length }, null, 2),
  "utf8",
);
console.log(`tests/fixtures/finished-campaign.json — ${s.committed.length} seasons committed, seasonIndex ${s.seasonIndex}`);
