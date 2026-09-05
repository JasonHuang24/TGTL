/**
 * The eight acts (blueprint 3.0 §3.4) — the 2.0 roadmap's stages, with play
 * density following the agency curve. Each act is a static slot plan; decision
 * slots are filled at play time by deterministic selection from the act's card
 * pool (lib/engine/run.ts), beat slots fire the named scripted beat.
 *
 * Agency ramps: acts 1–2 are WATCHED (decisions made *for* the character, shown as
 * such); acts 3–4 are the first real buttons; act 5 (launch) is the meaty act;
 * acts 6–8 carry compounding, caregiving, the aims audit, and letting go.
 * End of life is its own quiet phase after act 8.
 */

export type Slot =
  | { kind: "watched" } // an auto-resolved formative draw, narrated as made-for-you
  | { kind: "decision" } // a real player choice (card selected from the act pool)
  | { kind: "card"; cardId: string } // a fixed, always-played decision card (e.g. the slack shock)
  | { kind: "beat"; beatId: string }; // a scripted (loss-tier) beat

export type ActDef = {
  /** 1-based act number (display); the engine uses the 0-based index. */
  n: number;
  id: string;
  title: string;
  ageBand: string;
  /** True for the watched early acts — the interface makes "made for you" explicit. */
  watched?: boolean;
  /** Short second-person intro shown when the act opens. Edition-neutral. */
  intro: string;
  /** Which mechanic this act first introduces (walkthrough-style, one at a time). */
  introducesMechanic?: string;
  /** Offer the aims-audit (win-weight re-edit) when this act opens (§3.4). */
  aimsAudit?: boolean;
  slots: Slot[];
};

export const ACTS: ActDef[] = [
  {
    n: 1,
    id: "birth-dependency",
    title: "Birth & dependency",
    ageBand: "the first years",
    watched: true,
    intro:
      "You arrive already dependent, already somewhere. Nothing here is yours to decide yet — the point is to feel that it isn't.",
    slots: [{ kind: "watched" }],
  },
  {
    n: 2,
    id: "early-childhood",
    title: "Early childhood",
    ageBand: "the small years",
    watched: true,
    intro:
      "The people around you are making the consequential calls. You watch a couple of them land — they were never on offer to you.",
    slots: [{ kind: "watched" }],
  },
  {
    n: 3,
    id: "tutorial-years",
    title: "The tutorial years",
    ageBand: "school age",
    intro: "The first buttons appear. Small stakes — but the loop is the loop, and it starts here.",
    introducesMechanic: "readout",
    slots: [{ kind: "decision" }, { kind: "decision" }],
  },
  {
    n: 4,
    id: "adolescence",
    title: "Adolescence",
    ageBand: "the teenage years",
    intro: "More is yours now, and more is at stake. This is where you find out what an experiment costs.",
    introducesMechanic: "variance",
    slots: [{ kind: "decision" }, { kind: "decision" }],
  },
  {
    n: 5,
    id: "launch",
    title: "Launch",
    ageBand: "roughly eighteen to twenty-nine",
    intro:
      "The meaty stretch: agency high, resources gated, and the first choices that quietly lock. Some of what looks free is borrowed.",
    introducesMechanic: "position",
    slots: [{ kind: "decision" }, { kind: "decision" }, { kind: "decision" }, { kind: "decision" }],
  },
  {
    n: 6,
    id: "build",
    title: "Build & establish",
    ageBand: "the thirties",
    intro: "Early choices start bending the curves — in both directions. You can see the compounding now.",
    introducesMechanic: "compounding",
    slots: [{ kind: "card", cardId: "card-build-shock" }, { kind: "decision" }, { kind: "decision" }],
  },
  {
    n: 7,
    id: "midgame-caregiving",
    title: "Midgame & caregiving",
    ageBand: "the middle stretch",
    intro:
      "The load changes shape. Other people's days run through yours now, and you are asked whether you still hold the goal you chose.",
    introducesMechanic: "slack",
    aimsAudit: true,
    slots: [{ kind: "decision" }, { kind: "decision" }, { kind: "beat", beatId: "beat-loss" }, { kind: "decision" }],
  },
  {
    n: 8,
    id: "late",
    title: "Later life",
    ageBand: "the last long stretch",
    intro: "What compounded has compounded. The moves now are about transmission, and about letting go.",
    introducesMechanic: "recovery",
    slots: [{ kind: "decision" }, { kind: "decision" }],
  },
];

/**
 * End of life — a separate quiet phase (§3.7). Played reduced-frame: aging, care,
 * unfinished matters. Few choices, none of them "optimizable", then the run ends.
 */
export const END_OF_LIFE = {
  id: "end-of-life",
  title: "The end of the run",
  intro:
    "The run is closing. What is here is not a puzzle to solve — just some last, unhurried things, and then quiet.",
  slots: [{ kind: "decision" }, { kind: "beat", beatId: "beat-own-end" }] as Slot[],
};

export const ACT_COUNT = ACTS.length;

export function actByIndex(i: number): ActDef | undefined {
  return ACTS[i];
}
