/**
 * Re-exports and one note for the /methodology sandbox disclosure. Kept in
 * content/ so the page renders from the same fixtures the engine runs on and
 * cannot drift from it (blueprint 4.0 §6).
 */
export { ATTRIBUTION_LABEL, ATTRIBUTION_CATEGORIES, BUDGET_LABEL } from "@/content/sim/schema";

export const SEASON_COUNT_NOTE =
  "Two seasons to a year, ages eighteen to thirty, in the United States in 2025 — a fixed board, so that what varies between two runs is the position you were dealt and what you did with it.";


/**
 * How many scripted policies the balance fleet drives. /methodology states this
 * number in prose; S-10 asserts it equals `POLICIES.length` so the page cannot
 * drift from the harness the way it did (it said fourteen while fifteen ran).
 * The page must not import from tests/, which is why the number lives here.
 */
export const FLEET_POLICY_COUNT = 15;
export const FLEET_POLICY_COUNT_WORD = "Fifteen";


/**
 * THE CAMPAIGN'S CONTENT NOTE.
 *
 * The campaign had no advisory on any surface a player who can play it ever sees:
 * the only copy lived in the no-JS floor, which `:root[data-play-hydrated="1"]`
 * hides the moment CampaignApp mounts. And the text it did carry named only
 * "loss", while 4.0 tripled the beat channel — it now also carries a flat stretch
 * (`/situations/depression`) and someone close becoming seriously ill. §5.1's four
 * loss-tier categories, three of which this campaign can reach.
 *
 * Named here rather than in the component so the no-JS floor and the played
 * surface say the same thing, and so a gate can check they do.
 */
/* =========================================================================
   N-195 — THE LAB'S SEED CURATION, DISCLOSED.
   =========================================================================
   /methodology publishes the budget table, the resolution order, the pile-up
   physics, the attribution rule and how the balance was probed — and then said
   nothing about the one place a thumb was deliberately put on the scale: which
   fixed draw-seed each Decision Lab situation ships with. The build's own record
   (DECISIONS.md, "INVENTION: automated Lab seed curation") says it should be here.

   The strings live in content/ rather than in the page component so the gate that
   asserts the disclosure and the page that renders it read the same source, and so
   the tool's path cannot drift out of the sentence that names it.
   ========================================================================= */

/** The tool, named so a reader can go and read it. */
export const LAB_CURATION_TOOL = "tools/curate-lab-seeds.ts";

/** The two criteria it searches on, each stated as what it looks for and why. */
export const LAB_CURATION_CRITERIA: { name: string; detail: string }[] = [
  {
    name: "seeds that separate",
    detail:
      "the original criterion: an alternate draw-seed whose branch lands in different outcome bands from the primary seed's. Without it a reader meeting the luck axis for the first time can see two identical columns and conclude the axis does nothing.",
  },
  {
    name: "one seed that lands the same",
    detail:
      "added in this version: an alternate draw-seed whose branch lands in the same bands AND the same ending. Curating only for separation taught one half of the lesson — luck moved it — and never the other, which is that some moves have a range so narrow the draw has nothing to move. One shipped pair is now curated this way, and the rest still separate.",
  },
];

export const LAB_CURATION_DISCLOSURE =
  "A Lab comparison replays byte-identically, which means its seeds are fixed, which means somebody chose them. They were chosen by a search, not by hand, and the search is in the repository:";

export const LAB_CURATION_LIMIT =
  "What this changes is which fixed seed a situation ships with. It does not touch the physics, the odds, or the resolution: any other seed is still a legitimate run of the same model, and the branch you are shown is not a better one, only a curated one.";

/* =========================================================================
   N-234 — THE SEEDED-RANDOMNESS CONTRACT, said to the player.
   =========================================================================
   The mechanism has been complete and gate-proven since 4.0: derived draws, a
   seed and both versions inspectable on a save, and a rendered split that always
   says when an outcome was partly the draw. What was never said was what the
   mechanism is FOR, which is the sentence below. It renders twice and only twice:
   here, and beside the seed in the saves panel, which is where the seed is
   actually inspectable.
   ========================================================================= */

export const RANDOMNESS_LINE = "Randomness represents uncertainty, not fate.";

export const RANDOMNESS_CONTRACT: string[] = [
  "Reproducible — the same seeds and the same decisions always produce the same run, so a branch can be compared with the run it came from rather than with a fresh roll.",
  "Forkable — a branch can hold the seeds fixed and change one decision, or hold the decisions and change the draw, which is the only way to see which of the two moved the result.",
  "Inspectable — a saved run shows its own seeds and the simulation and content versions it was played under, beside it, on this device.",
  "Declared — when a draw moved an outcome, the explanation says so and names it as the draw, rather than folding it into what the character did.",
];

export const CAMPAIGN_CONTENT_NOTE =
  "The campaign holds the shape of a decade, and some of that is heavy: a loss, a flat stretch, someone close becoming seriously ill. Those arrive on their own schedule, never as something you chose or failed to prevent, and each one can be skipped in a single click. The help pages are in the header the whole time, including right now.";
