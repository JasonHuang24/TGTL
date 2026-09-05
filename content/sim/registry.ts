/**
 * The campaign content registry (blueprint 4.0 §7.3). One import surface for the
 * engine, so `lib/sim/*` never reaches into a content file directly and a content
 * batch can be added by touching exactly one line.
 *
 * Content arrives in BATCHES through the §9.5 pipeline: each batch is authored
 * against the schema, passes an adversarial safety verification (two-tier +
 * §5.1 capacity boundary + spec-§12 avoid-list + no-dominant-option + evidence
 * labels + voice), and is read in the rolling human review before it is listed
 * here. A batch that is not listed here is not in the game.
 */

import { FLOOR_ACTIONS, FLOOR_ACTION_IDS } from "@/content/sim/campaign/actions-floor";
import { SMALL_ACTIONS } from "@/content/sim/campaign/actions-small";
import { ACTION_BATCHES } from "@/content/sim/campaign/actions/index";
import { EVENT_BATCHES } from "@/content/sim/campaign/events/index";
import { COMPANION_ARCS } from "@/content/sim/campaign/companions";
import { CAMPAIGN_BEATS, campaignBeatPlacements } from "@/content/sim/campaign/beats";
import { PRESETS, PRESET_BY_ID, presetsInOrder } from "@/content/sim/campaign/presets";
import type {
  BeatPlacement,
  BeatRecord,
  CompanionArc,
  PresetHand,
  SimAction,
  SimEvent,
  SimState,
} from "@/content/sim/schema";

/** *Launch Window — United States · 2025*: ages 18–30, 24 six-month seasons. */
export const CAMPAIGN_ID = "launch-window-us-2025";
export const CAMPAIGN_LABEL = "Launch Window — United States · 2025";
export const SEASON_COUNT = 24;
export const START_AGE = 18;

/** The late window (§3.4b, §7.3 quota): seasons 13–24 get their own content. */
export const LATE_WINDOW_START = 13;

export const ACTIONS: SimAction[] = [...FLOOR_ACTIONS, ...SMALL_ACTIONS, ...ACTION_BATCHES];
export const ACTION_BY_ID: Record<string, SimAction> = Object.fromEntries(ACTIONS.map((a) => [a.id, a]));

export const EVENTS: SimEvent[] = EVENT_BATCHES;
export const EVENT_BY_ID: Record<string, SimEvent> = Object.fromEntries(EVENTS.map((e) => [e.id, e]));

export const COMPANIONS: CompanionArc[] = COMPANION_ARCS;
export const COMPANION_BY_ID: Record<string, CompanionArc> = Object.fromEntries(COMPANIONS.map((c) => [c.id, c]));

export const BEATS: Record<string, BeatRecord> = CAMPAIGN_BEATS;

export { FLOOR_ACTION_IDS, PRESETS, PRESET_BY_ID, presetsInOrder };
export type { PresetHand };

/**
 * Beat placements for a run. Read ONLY by `beatForSeason` at the moment a season
 * plays — never by the briefing, the timeline, or the milestone list (§5.1).
 */
export function beatPlacements(state: Pick<SimState, "origin" | "flags">): BeatPlacement[] {
  return campaignBeatPlacements(state);
}

/** In-world date for a season index: two seasons a year from the start age. */
export function seasonLabel(seasonIndex: number): { age: number; half: "first half" | "second half"; year: number } {
  const age = START_AGE + Math.floor(seasonIndex / 2);
  const half = seasonIndex % 2 === 0 ? "first half" : "second half";
  return { age, half, year: 2025 + Math.floor(seasonIndex / 2) };
}
