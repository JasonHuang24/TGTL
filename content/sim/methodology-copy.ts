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
export const CAMPAIGN_CONTENT_NOTE =
  "The campaign holds the shape of a decade, and some of that is heavy: a loss, a flat stretch, someone close becoming seriously ill. Those arrive on their own schedule, never as something you chose or failed to prevent, and each one can be skipped in a single click. The help pages are in the header the whole time, including right now.";
