/**
 * Character sheet — illustrative preset (blueprint §6.6). Six headline life-stats
 * recalibrated for navigating a life rather than winning a fight (master brief).
 * Each stat carries a qualitative band and a confidence caveat — NEVER a number,
 * NEVER a total. Human worth is not a stat and there is no overall score.
 */

export type LifeStat = {
  id: string;
  standard: string;
  game: string;
  /** What the composite actually covers. */
  covers: string;
  /** A qualitative band — no numbers. */
  band: string;
  /** The honest caveat that replaces a hard value. */
  confidence: string;
};

export const LIFE_STATS: LifeStat[] = [
  {
    id: "vitality",
    standard: "Health and energy",
    game: "Vitality",
    covers: "physical health, usable energy, sleep, stamina, recovery, the pain you carry",
    band: "Variable",
    confidence: "Contextual and not a measure of worth; it moves with sleep and load, not moral effort.",
  },
  {
    id: "learning",
    standard: "Learning and reasoning",
    game: "Learning",
    covers: "reasoning, comprehension, memory, curiosity, picking things up, updating your mind",
    band: "Strong with structure",
    confidence: "Depends heavily on conditions — a supportive setting reads very differently from a hostile one.",
  },
  {
    id: "execution",
    standard: "Focus and follow-through",
    game: "Execution",
    covers: "attention, planning, starting, sequencing, prioritising, finishing",
    band: "Context-sensitive",
    confidence: "Highly state-dependent; the same person executes very differently rested versus depleted.",
  },
  {
    id: "regulation",
    standard: "Self-management",
    game: "Regulation",
    covers: "managing emotion, impulse, and stress, and returning to baseline",
    band: "Unknown",
    confidence: "Genuinely not entered here — and 'unknown' is a valid value, not a low one.",
  },
  {
    id: "social",
    standard: "Social understanding and communication",
    game: "Social navigation",
    covers: "reading a room, communicating, empathy, boundaries, cooperation, repair",
    band: "Developing",
    confidence: "Skill-like and trainable; the ceiling is far higher than most people assume of themselves.",
  },
  {
    id: "adaptability",
    standard: "Adaptation and recovery",
    game: "Adaptability",
    covers: "flexibility, resilience, recovering from setbacks, tolerating uncertainty, rebuilding under new rules",
    band: "Demonstrated",
    confidence: "Shown by having changed strategy before without pretending the change had no cost.",
  },
];

/** The distinctions the sheet exists to make (the core content rule). */
export const NOT_A_STAT: { thing: string; what: string }[] = [
  { thing: "Wealth, credentials, tools, networks", what: "resources — capacities you hold, not attributes you are" },
  { thing: "Legal freedom and practical opportunity", what: "conditions of your environment, not traits" },
  { thing: "Attractiveness and reputation", what: "context-dependent perception modifiers, never measures of worth" },
  { thing: "Luck", what: "the distribution of random events — not a stat you have more or less of" },
  { thing: "Happiness", what: "an outcome you experience, not an attribute you score" },
  { thing: "Human worth", what: "not a stat, not a total, and nowhere on this sheet or this site" },
];

/** The illustrative preset's supporting rows. */
export const PRESET = {
  label: "Adaptive launch preset",
  resources: ["A stable room share", "Learning time: moderate", "Cash buffer: limited", "Two trusted contacts"],
  buffs: ["Curiosity", "A flexible schedule"],
  debuffs: ["A thin financial margin", "A new-city network with few doors in it yet"],
  mainQuest: "Build a sustainable base without closing creative options.",
  sideQuests: ["A community garden plot", "Portfolio experiments on the weekends"],
  constraints: ["Variable work hours", "Transit dependence"],
  skills: ["Client communication", "Basic technical craft", "Self-directed learning"],
  support: ["Sibling check-ins", "A peer skill-swap"],
  weights: ["Stability", "Autonomy", "Meaning"],
};
