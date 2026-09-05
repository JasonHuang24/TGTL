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
  /**
   * N-403 (6.0 §3.4, §7.1) — THE REFERENCE POPULATION THE BAND IS READ AGAINST.
   *
   * The timeline has required a stated population per record since 5.0; the
   * character sheet has never had one, and a band without one is exactly the
   * false precision this sheet exists to avoid. "Strong" against whom? Physical
   * strength rated against same-age peers answers a completely different
   * question from raw strength across all adults, and the two readings of the
   * same word support opposite conclusions about the same person.
   *
   * IN WORDS, NEVER A NUMBER — a population is a description of who is being
   * compared, and the moment it became a figure it would be a percentile.
   */
  population: string;
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
    population:
      "Read against adults of roughly your own age and health history — not against athletes, and not against your own best year.",
    confidence: "Contextual and not a measure of worth; it moves with sleep and load, not moral effort.",
  },
  {
    id: "learning",
    standard: "Learning and reasoning",
    game: "Learning",
    covers: "reasoning, comprehension, memory, curiosity, picking things up, updating your mind",
    band: "Strong with structure",
    population:
      "Read against adults with comparable schooling and comparable access to time and quiet, which is most of what separates people here.",
    confidence: "Depends heavily on conditions — a supportive setting reads very differently from a hostile one.",
  },
  {
    id: "execution",
    standard: "Focus and follow-through",
    game: "Execution",
    covers: "attention, planning, starting, sequencing, prioritising, finishing",
    band: "Context-sensitive",
    population:
      "Read against yourself in different states — rested versus depleted — before it is read against anyone else at all.",
    confidence: "Highly state-dependent; the same person executes very differently rested versus depleted.",
  },
  {
    id: "regulation",
    standard: "Self-management",
    game: "Regulation",
    covers: "managing emotion, impulse, and stress, and returning to baseline",
    band: "Unknown",
    population:
      "No population, because nothing was entered. Unknown is a value, and it does not resolve to average.",
    confidence: "Genuinely not entered here — and 'unknown' is a valid value, not a low one.",
  },
  {
    id: "social",
    standard: "Social understanding and communication",
    game: "Social navigation",
    covers: "reading a room, communicating, empathy, boundaries, cooperation, repair",
    band: "Developing",
    population:
      "Read against adults in the same setting and the same role; the same person reads very differently across two rooms.",
    confidence: "Skill-like and trainable; the ceiling is far higher than most people assume of themselves.",
  },
  {
    id: "adaptability",
    standard: "Adaptation and recovery",
    game: "Adaptability",
    covers: "flexibility, resilience, recovering from setbacks, tolerating uncertainty, rebuilding under new rules",
    band: "Demonstrated",
    population:
      "Read against your own earlier responses to change, which is the only comparison the evidence for this one supports.",
    confidence: "Shown by having changed strategy before without pretending the change had no cost.",
  },
];

/**
 * N-399 (6.0 §3.4, §7.1) — THE FIVE LAYERS, AS THE SHEET'S STRUCTURE.
 *
 * `NOT_A_STAT` below has always made four of these distinctions in prose, and
 * prose is easy to read past. Making them the sheet's HEADED STRUCTURE is what
 * actually prevents privilege, training and health being blended into one vague
 * impression of a person — which is the failure mode every character sheet in
 * the world has, and the one this sheet exists to refuse.
 *
 * The load-bearing case: a mobility impairment is a CONDITION, a wheelchair is a
 * RESOURCE, and accessible infrastructure is a condition of the environment.
 * Three different objects with three different remedies, routinely collapsed
 * into one judgement about a person's capability.
 *
 * AND A NEED STATE IS NEVER AN ATTRIBUTE. Being hungry, unslept, frightened or
 * unwell is a state of a person right now; it is not a fact about who they are,
 * it changes on a timescale of hours, and filing it as an attribute is how a bad
 * fortnight becomes a permanent description.
 */
export type SheetLayer = {
  id: string;
  label: string;
  what: string;
  examples: string;
  /** The specific error this layer's separation prevents. */
  confusedWith: string;
};

export const SHEET_LAYERS: SheetLayer[] = [
  {
    id: "attributes",
    label: "Attributes",
    what: "Broad areas of functioning — how you tend to work, across situations and over time.",
    examples: "the six areas below: health and energy, learning, follow-through, self-management, social navigation, adaptation.",
    confusedWith:
      "Being read as fixed potential. These move with conditions, training, and state; a band is a description of a stretch, not a ceiling.",
  },
  {
    id: "skills",
    label: "Skills",
    what: "Specific learned capabilities, each with a domain attached. They are acquired, they decay, and they transfer unevenly.",
    examples: "client communication; reading a contract; a trade; a language; knowing how a benefits office works.",
    confusedWith:
      "Attributes. A person without a skill is not a person with a low attribute — they are a person who has not been taught, which is a different problem with a different fix.",
  },
  {
    id: "conditions",
    label: "Conditions",
    what: "Facts about your body, mind, or environment that set what is possible and at what cost. Some are yours, some are the world's.",
    examples: "a chronic illness; a mobility impairment; caring responsibilities; the law where you live; whether the buildings you need have ramps.",
    confusedWith:
      "Attributes, constantly. A mobility impairment is a condition; a wheelchair is a resource; accessible infrastructure is a condition of the environment. Collapsing the three produces a judgement about a person where there should be three separate questions.",
  },
  {
    id: "resources",
    label: "Resources",
    what: "Things you hold rather than things you are. They can be gained, spent, taken, and inherited.",
    examples: "money; tools; equipment; credentials; time; standing; people who would actually help.",
    confusedWith:
      "Merit. Resources are the layer most often read as evidence about a person, and they are the layer most often inherited.",
  },
  {
    id: "outcomes",
    label: "Outcomes",
    what: "What has actually happened. Downstream of every layer above and of a great deal of luck.",
    examples: "the job you got; the house you did or did not buy; how a relationship went; whether the treatment worked.",
    confusedWith:
      "All four of the above, read backwards. An outcome is the worst available evidence about the attributes of the person it happened to, because so much of what produced it was never theirs.",
  },
];

/** N-399 — a state, and the reason it has no home among the five above. */
export const NEED_STATE_LINE =
  "And one thing that is not any of the five: a need state. Being hungry, unslept, frightened, in pain, or freshly bereaved is a state you are in right now — it changes on a timescale of hours or weeks, it is the most reliable thing there is for making every attribute above read low, and it is never an attribute. Filing a state as a trait is how a bad fortnight turns into a permanent description of somebody.";

/**
 * The distinctions the sheet exists to make (the core content rule).
 *
 * N-405 (6.0 §3.4) — the four composites are DECOMPOSED rather than only
 * refused. Refusing "Charisma is not a stat" tells the reader what the sheet
 * will not do; saying what it decomposes into tells them what to look at
 * instead, which is more useful and considerably harder to argue with.
 */
export const NOT_A_STAT: { thing: string; what: string }[] = [
  { thing: "Wealth, credentials, tools, networks", what: "resources — capacities you hold, not attributes you are" },
  { thing: "Legal freedom and practical opportunity", what: "conditions of your environment, not traits" },
  {
    thing: "Charisma",
    what: "three separable things wearing one word: social skills that are trainable, standing that other people grant you and can withdraw, and context — the same person is magnetic in one room and invisible in the next. Treating it as an attribute hides the fact that two thirds of it is not in the person at all.",
  },
  {
    thing: "Wisdom",
    what: "experience plus calibration. Experience alone produces confident people who have been wrong the same way for thirty years; calibration is knowing how often you are right and by how much, which is learnable and is the half that actually does the work.",
  },
  {
    thing: "Luck",
    what: "the distribution of events you are exposed to — not a personal attribute, not a quantity you have more or less of, and not something a person can be good or bad at. What varies between people is exposure and buffer, which are conditions and resources.",
  },
  {
    thing: "Appearance",
    what: "a modifier on what things cost you, never a measure of worth. It changes prices — how readily you are believed, hired, served, or left alone — and those effects are real and worth naming honestly. What it is not is a fact about the person's value, and this sheet will not carry a rating of it.",
  },
  { thing: "Happiness", what: "an outcome you experience, not an attribute you score" },
  { thing: "Human worth", what: "not a stat, not a total, and nowhere on this sheet or this site" },
];

/** N-405 — the closing rule the four decompositions share. */
export const MORE_IS_NOT_BETTER =
  "And more is not always better in any of these. An extreme in one direction is a trade rather than an upgrade: relentless drive costs recovery, unusual sensitivity to other people costs the ability to disappoint them, exceptional focus costs everything happening outside it. A sheet that rewarded higher everywhere would be describing a person who does not exist, and quietly telling everyone else they were failing at being them.";

/**
 * N-408 (6.0 §3.4) — WHOSE SCORECARD IS THIS, on the character side.
 *
 * The taxonomy is authored once on `/guidance` and imported here rather than
 * copied: the same seven, in the same words, so a reader meeting it twice meets
 * the same thing. It is READ, never selected — as a control it would be an
 * assessment of the reader, which is the one thing this sheet forbids.
 */
export { SCORECARD_KINDS, SCORECARD_LEAD, SCORECARD_CLOSE } from "./guidance.ts";

/**
 * N-127 (6.0 §3.5, deferred from batch 4) — ATTENTION, on the character side.
 *
 * The daily plan says this about a day; here it belongs to the sheet, because
 * the sheet is where a reader is looking for something to measure about
 * themselves and attention is the one that cannot be held still long enough.
 */
export const ATTENTION_NOTE = {
  title: "The one that cannot be stored",
  body:
    "Nothing on this sheet is attention, and that is deliberate. Money can be saved and time can at least be scheduled; attention exists only in the moment it is spent, so it cannot be banked for the evening and the only decision ever available is where the next piece of it goes. It is also the resource every band above is quietly measured through — a depleted person reads low on all six, and reads low on all six because they are depleted.",
  external:
    "The honest check is external, and it is deliberately not here. You notice where your attention went only once it comes back, so introspection reports the day you meant to have. A time diary kept for a week — on paper, or in whatever you already use — is the instrument that answers it. This site is not the place to keep one and will never ask you to: an instrument that measures how you spend yourself belongs somewhere you control.",
};

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
