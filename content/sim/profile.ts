/**
 * THE CONSTRAINT PROFILE (blueprint 4.0 §2.3.1) — what supersedes 3.0's single
 * difficulty tier, and gate S-8's new subject.
 *
 * The 3.0 creation screen ended on one word: Easy, Medium, Hard, Extreme. That is
 * exactly what the Sol spec §6.5 forbids — collapsing wealth, health, place and
 * support into a cruel single grade. 4.0 ends the hand reveal on a PER-AXIS
 * statement of what this start makes expensive, and nothing else.
 *
 * The rules here are LITERAL and gate-enforced:
 *
 *   - PER-AXIS ONLY. There is no composite, no summary line, no roll-up, and no
 *     "a hard start" flavour prose. The type has no field one could put it in.
 *   - ENVIRONMENTAL COST LANGUAGE. Every band says what a thing COSTS FROM HERE.
 *     No axis is ever a bodily grade or a verdict on the person.
 *   - FIXED ORDER. Axes render in a fixed order that never depends on hardness,
 *     and presets present in their authored order, never sorted by difficulty.
 *   - HARDNESS NEVER RENDERS. Internal hardness numbers exist for content
 *     conditioning and fleet sampling. S-8 greps the render layer to prove they
 *     reach no rendered string.
 *   - THE WORTH-GUARD IS ADJACENT. Wherever the profile renders, the verbatim
 *     guard renders beside it. Carried unchanged from 3.0 §3.3.
 */

import {
  PROFILE_AXES,
  PROFILE_COST_BANDS,
  type ConstraintProfile,
  type ProfileAxis,
  type ProfileCostBand,
} from "@/content/sim/schema";

/**
 * The worth-guard. The clause in `WORTH_GUARD_VERBATIM` is VERBATIM from the
 * blueprint and must render adjacent to every profile rendering (gate S-8).
 * Edition-neutral; carried from 3.0 unchanged.
 */
export const WORTH_GUARD =
  "These are presets for support, friction, risk, and constraint — not rankings of human worth, virtue, potential, or the meaningfulness of a life.";

export const WORTH_GUARD_VERBATIM =
  "not rankings of human worth, virtue, potential, or the meaningfulness of a life";

/**
 * The one sentence that frames the profile itself. It says what the profile IS
 * and — as importantly — refuses to say what it adds up to, because it does not
 * add up to anything.
 */
export const PROFILE_INTRO =
  "Here is what this start makes expensive. Read it axis by axis: there is no total, because these do not add up to a number, and a start that costs a great deal on one axis may cost nothing on another.";

/** Cost bands by internal hardness 0..3 — the ONLY place hardness becomes words. */
const BAND_BY_HARDNESS: ProfileCostBand[] = [
  PROFILE_COST_BANDS[0], // comes cheap
  PROFILE_COST_BANDS[1], // costs the usual
  PROFILE_COST_BANDS[2], // costs extra
  PROFILE_COST_BANDS[3], // costs a great deal
];

export function bandForHardness(h: number): ProfileCostBand {
  return BAND_BY_HARDNESS[Math.max(0, Math.min(3, Math.round(h)))];
}

/** Build a profile from per-axis internal hardness. No composite is computed. */
export function makeProfile(hardness: Record<ProfileAxis, number>): ConstraintProfile {
  const axes = {} as Record<ProfileAxis, ProfileCostBand>;
  const internalHardness = {} as Record<ProfileAxis, number>;
  for (const a of PROFILE_AXES) {
    const h = Math.max(0, Math.min(3, Math.round(hardness[a] ?? 1)));
    axes[a] = bandForHardness(h);
    internalHardness[a] = h;
  }
  return { axes, internalHardness };
}

/**
 * The rendered lines, in FIXED axis order. This is the whole rendering contract:
 * a caller gets an array of {axis, meaning, band} and can render nothing else,
 * because nothing else exists. There is no `summary()` and there will not be one.
 */
export type ProfileLine = { axis: ProfileAxis; label: string; meaning: string; band: ProfileCostBand };

export function profileLines(profile: ConstraintProfile): ProfileLine[] {
  return PROFILE_AXES.map((axis) => ({
    axis,
    label: AXIS_LABEL[axis],
    meaning: AXIS_MEANING[axis],
    band: profile.axes[axis],
  }));
}

const AXIS_LABEL: Record<ProfileAxis, string> = {
  money: "money",
  backing: "backing",
  body: "body",
  place: "place",
};

const AXIS_MEANING: Record<ProfileAxis, string> = {
  money: "what it costs this start to get money into a month",
  backing: "what it costs this start to have someone in your corner",
  body: "what it costs this start to keep your capacity available to spend",
  place: "what it costs this start to be where the openings are",
};

/**
 * The per-axis notes that make a cost band concrete without ranking it. Twelve
 * short lines, one per axis per band, all in environmental-cost voice.
 */
export const AXIS_BAND_NOTE: Record<ProfileAxis, Record<ProfileCostBand, string>> = {
  money: {
    "comes cheap": "there is room in the month, and a shock does not become a crisis",
    "costs the usual": "the month closes, but not with much left over",
    "costs extra": "every month is a small piece of engineering",
    "costs a great deal": "money has to be solved before anything else can be attempted",
  },
  backing: {
    "comes cheap": "there are people who would answer, and they have something to give",
    "costs the usual": "there are people, and asking costs something",
    "costs extra": "help exists but has to be found and built rather than called on",
    "costs a great deal": "there is no one standing behind this by default; anyone there is someone you brought",
  },
  body: {
    "comes cheap": "your capacity is mostly available when you reach for it",
    "costs the usual": "capacity is finite and noticed, the way it is for most people",
    "costs extra": "keeping capacity available is itself part of the week's work",
    "costs a great deal": "capacity has to be budgeted for first, and what is left is what you get",
  },
  place: {
    "comes cheap": "the openings are within reach of where you already are",
    "costs the usual": "getting to things takes time you could have spent otherwise",
    "costs extra": "distance is a tax on everything you try",
    "costs a great deal": "the openings are somewhere else, and getting there is its own project",
  },
};

/**
 * Everything a surface may render about a profile, as data. There is no other
 * accessor. If a future surface wants a composite, it will have to add one here
 * and answer to S-8 — which is the point.
 */
export function profileRender(profile: ConstraintProfile) {
  return {
    intro: PROFILE_INTRO,
    lines: profileLines(profile).map((l) => ({ ...l, note: AXIS_BAND_NOTE[l.axis][l.band] })),
    worthGuard: WORTH_GUARD,
  };
}
