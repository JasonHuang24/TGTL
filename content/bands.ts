/**
 * The band vocabulary — the site-wide, single set of qualitative labels the
 * simulator uses in place of any number (blueprint 3.0 §8, §11.2). Lives beside
 * the terminology map so gate S-2 (no numbers in play) and the engine cannot
 * drift apart.
 *
 * Two vocabularies:
 *   1. GAUGE bands — the five-band scale every resource gauge holds (§11.2).
 *   2. LIKELIHOOD bands — the qualitative words the distribution strip and option
 *      chips use for spread/odds, because no numeric probability is ever displayed
 *      in play (§8, gate S-2).
 *
 * All labels are plain English that reads the same in both editions, so they need
 * no edition split; the sim-facing *names* that DO vary by edition (run, hand,
 * draw, act, and the mechanic names) live in the terminology map (§6.1).
 */

/* ---- The five-band gauge scale (§11.2) ---- */

export const GAUGE_BAND_ORDER = [
  "depleted",
  "thin",
  "steady",
  "comfortable",
  "abundant",
] as const;

export type GaugeBand = (typeof GAUGE_BAND_ORDER)[number];

/** A gauge value is an index 0..4 into GAUGE_BAND_ORDER. */
export const GAUGE_MIN = 0;
export const GAUGE_MAX = GAUGE_BAND_ORDER.length - 1;

export function clampGauge(n: number): number {
  return Math.max(GAUGE_MIN, Math.min(GAUGE_MAX, Math.round(n)));
}

export function gaugeBand(index: number): GaugeBand {
  return GAUGE_BAND_ORDER[clampGauge(index)];
}

/** The four resource gauges of the state vector (§11.1). */
export const GAUGE_KEYS = ["money", "healthEnergy", "connection", "timeStructure"] as const;
export type GaugeKey = (typeof GAUGE_KEYS)[number];

/**
 * Plain display name for each gauge. Edition-neutral: these read naturally in
 * both Standard and Game Guide, so they carry no game translation.
 */
export const GAUGE_LABEL: Record<GaugeKey, string> = {
  money: "money",
  healthEnergy: "health & energy",
  connection: "connection",
  timeStructure: "time & structure",
};

/** One-line plain meaning of each gauge, shown on the state panel and /character. */
export const GAUGE_MEANING: Record<GaugeKey, string> = {
  money: "what you can spend before something has to give",
  healthEnergy: "the capacity the rest of the run is spent from",
  connection: "the people who would actually show up",
  timeStructure: "how much of your time is yours to direct",
};

/* ---- The likelihood/spread vocabulary (§8) ---- */

/**
 * The qualitative words the distribution strip and variance chips use. NEVER a
 * number, a percentage, or an "N in M". Ordered from most contained to widest.
 */
export const SPREAD_ORDER = ["narrow", "moderate", "wide", "very wide"] as const;
export type Spread = (typeof SPREAD_ORDER)[number];

export const SPREAD_MEANING: Record<Spread, string> = {
  narrow: "the outcomes cluster; skill decides most of it",
  moderate: "a real range, but no ruinous tail",
  wide: "the draw matters as much as the move",
  "very wide": "the same move can land anywhere; the tail is long",
};

/**
 * Reversibility words used on option chips.
 */
export const REVERSIBILITY_ORDER = ["reversible", "costly to undo", "locks in"] as const;
export type Reversibility = (typeof REVERSIBILITY_ORDER)[number];

/* ---- Outcome band vocabulary (§3.5, the resolution contract) ---- */

/**
 * The named outcome bands an option's draw can land in. An option declares a
 * subset of these (2–3), at most one marked `failure`. The draw maps
 * deterministically to exactly one (lib/engine/resolve.ts).
 */
export const OUTCOME_BAND_ORDER = ["strong", "solid", "mixed", "poor", "failure"] as const;
export type OutcomeBandName = (typeof OUTCOME_BAND_ORDER)[number];

/** Plain word shown when an outcome lands, edition-neutral. */
export const OUTCOME_BAND_LABEL: Record<OutcomeBandName, string> = {
  strong: "it went well",
  solid: "it held",
  mixed: "mixed",
  poor: "it went poorly",
  failure: "it fell through",
};

/** Severity rank (0 = best) — orders the bands left→right on the distribution strip. */
export const OUTCOME_BAND_RANK: Record<OutcomeBandName, number> = {
  strong: 0,
  solid: 1,
  mixed: 2,
  poor: 3,
  failure: 4,
};

/**
 * Whether an option's declared band is the failure band that steers the next card
 * to a recovery-bearing pool (§3.5). This is a per-option MARKING carried on the
 * band declaration (`failure: true`), never inferred from the band's name.
 */
export type BandName = OutcomeBandName;
