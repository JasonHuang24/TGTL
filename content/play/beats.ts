/**
 * Scripted beats (blueprint 3.0 §7.2, §11.3). The ONLY place loss-tier content
 * may appear — and only quiet, reduced-frame, always skippable, always naming its
 * real-world page (the sim's crisis channel, required). No chips, no cost/reward
 * language, no skill/draw framing. A death is not a turning point to be optimized.
 *
 * Gate S-1 verifies: no crisis-tier terms anywhere here; every record carries
 * skippable:true, reducedFrame:true, and a realPageLink that resolves.
 */

import type { ScriptedBeat } from "@/content/play/schema";

export const BEATS: Record<string, ScriptedBeat> = {
  "beat-loss": {
    id: "beat-loss",
    act: 7,
    type: "scripted",
    skippable: true,
    reducedFrame: true,
    realPageLink: "/situations/grief",
    prose:
      "Someone who was part of your run reaches the end of theirs. There is nothing here to decide and nothing to optimize — only that it happened, and that it was real. The run goes quiet for a while, the way it does.",
    skippedLine: "A loss passed through this stretch of the run.",
    // No mechanical effects: loss is not mechanized. It is felt, not scored.
  },
  "beat-own-end": {
    id: "beat-own-end",
    act: 9,
    type: "scripted",
    skippable: true,
    reducedFrame: true,
    realPageLink: "/situations/grief",
    prose:
      "The run is ending — yours, this time. Not as a failure and not as a reckoning, just the shape every run has. What you built stays where you left it. The sim does not claim to know what follows, and does not pretend to.",
    skippedLine: "The run reached its close.",
  },
};

export const ALL_BEATS: ScriptedBeat[] = Object.values(BEATS);
