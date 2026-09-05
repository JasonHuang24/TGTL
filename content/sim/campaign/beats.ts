/**
 * THE BEAT SCHEDULE CHANNEL (blueprint 4.0 §5.1, LITERAL).
 *
 * Loss-tier content — death, serious illness, the character's end, depression —
 * exists in this campaign in exactly one place: here. The containment rules, all
 * of them enforced by the types and by gate S-1:
 *
 *   - A beat is NOT an Event. `EventTrigger` has no beat arm.
 *   - A beat is NOT a queue entry. `QueueEntry` has no beat arm.
 *   - A beat is never previewed. It does not appear on the briefing queue, the
 *     forward timeline, or the milestone list — `beatPlacements` is read only by
 *     `beatForSeason`, at the moment the season is actually played.
 *   - A beat is placed DETERMINISTICALLY, by campaign structure or by the hand.
 *     It is never a chance, systemic, or companion trigger, and never an RNG
 *     surprise. Two runs of the same hand meet the same beats in the same seasons.
 *   - In the season it arrives it plays under the full 3.0 beat contract:
 *     skippable, reduced-frame, naming its real page.
 *   - Downstream — summaries, parse, retrospective timeline, explain drawer — a
 *     skipped beat is ONE neutral line and an unskipped beat is reduced-frame. No
 *     chips, no faces, no timing chrome, no cost/reward, no draw framing, ever.
 *
 * VOICE: no chips, no cost/reward language, no skill/draw framing, no "turning
 * point". Nothing here is a decision, because none of it is.
 *
 * OWNER GATE: the two beats new in 4.0 (`beat-low-season`, `beat-someone-ill`)
 * join the professional-review list (§5.6) alongside 3.0's. They ship behind that
 * flag, recorded in KNOWN_LIMITATIONS.md and in the build report.
 */

import type { BeatPlacement, BeatRecord, SimState } from "@/content/sim/schema";

export const CAMPAIGN_BEATS: Record<string, BeatRecord> = {
  "beat-loss": {
    id: "beat-loss",
    type: "scripted",
    skippable: true,
    reducedFrame: true,
    realPageLink: "/situations/grief",
    prose:
      "Someone who was part of these years reaches the end of theirs. There is nothing here to decide and nothing to work out — only that it happened, and that it was real. Things go quiet for a while, the way they do.",
    skippedLine: "A loss passed through this stretch.",
  },
  "beat-low-season": {
    id: "beat-low-season",
    type: "scripted",
    skippable: true,
    reducedFrame: true,
    realPageLink: "/situations/depression",
    prose:
      "This is one of the flat stretches. Not a decision badly made and not a season to get through faster — a period when the ordinary weight of things is heavier than it was, and lifts slowly. It is not the whole of these years, and it is not a verdict on them.",
    skippedLine: "A flat stretch passed through these seasons.",
  },
  "beat-someone-ill": {
    id: "beat-someone-ill",
    type: "scripted",
    skippable: true,
    reducedFrame: true,
    realPageLink: "/topics/relationships",
    prose:
      "Someone close to you becomes seriously ill. There is no move here that changes it, and it is not yours to solve. What there is, is being there — which is not a strategy and does not need to be.",
    skippedLine: "Someone close was seriously ill during this stretch.",
  },
};

export const ALL_CAMPAIGN_BEATS: BeatRecord[] = Object.values(CAMPAIGN_BEATS);

/**
 * Deterministic placement. Fixed by campaign structure, or by the hand — never by
 * a draw. A run's placements are a pure function of its origin, so the same hand
 * always meets the same beats in the same seasons, and a fork inherits them
 * exactly. Nothing here is ever rendered forward.
 */
export function campaignBeatPlacements(state: Pick<SimState, "origin" | "flags">): BeatPlacement[] {
  const out: BeatPlacement[] = [];

  // Campaign structure: one loss passes through the window, late enough that the
  // run has people in it to lose.
  out.push({ channel: "beat-schedule", beatId: "beat-loss", seasonIndex: 16, placedBy: "campaign-structure" });

  // By the hand: a start that was already interrupted carries a flat stretch
  // early, because that is the shape of the position, not a consequence of play.
  if (state.flags.includes("start:interrupted-path"))
    out.push({ channel: "beat-schedule", beatId: "beat-low-season", seasonIndex: 5, placedBy: "hand" });

  // By the hand: a start built around care meets the illness it is built around.
  if (state.flags.includes("start:caring-duty"))
    out.push({ channel: "beat-schedule", beatId: "beat-someone-ill", seasonIndex: 9, placedBy: "hand" });

  return out;
}
