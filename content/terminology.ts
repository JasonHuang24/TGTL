/**
 * The terminology map — the single source of truth for edition vocabulary
 * (blueprint §9.3, G-01). One record per semantic key.
 *
 *  - `standard`   : the Standard-edition label (always present).
 *  - `game`       : the Game Guide label. If omitted, the Standard label renders
 *                   in BOTH editions (§4.1: "not every term needs a game translation").
 *  - `define`     : the plain-language gloss shown the first time the game term is
 *                   used on a page (§4.1, §7.3: "define at first use").
 *  - `allowedAtSetDown` : if false (the default), the `game` label is added to the
 *                   generated set-down vocabulary lint list (gate 2, §11.4). Set-down
 *                   pages must never render it. A term with no distinct `game` label
 *                   is inherently safe.
 *
 * The lint list (tests/gates) is GENERATED from this map, so the map and the
 * enforcement cannot drift apart.
 */

export type TermKey =
  | "roadmap"
  | "stage"
  | "launch"
  | "character"
  | "lifeStat"
  | "resource"
  | "modifier"
  | "support"
  | "pressure"
  | "goal"
  | "sideGoal"
  | "guidance"
  | "plan"
  | "party"
  | "move"
  | "slack"
  | "variance"
  | "recovery"
  | "history"
  | "meta"
  | "board"
  | "pressureReading"
  | "decisionLog"
  | "maintenanceLedger"
  | "topics"
  | "planTier"
  | "season"
  | "campaign"
  | "allocation"
  | "budget"
  | "fork"
  | "branch"
  | "preset"
  | "queue"
  | "briefing"
  | "companion"
  | "lab"
  | "milestone"
  | "constraintProfile"
  | "priority"
  | "standingCommitment"
  | "namedSave"
  | "playDoor"
  | "arc"
  /* 5.0 §3.9 — the timeline's vocabulary. Entering the map means gate 2's
     GENERATED set-down lint covers these automatically, so a game label can never
     reach a set-down page or a sensitive segment without the gate noticing. */
  | "timeline"
  | "timelineYear"
  | "timelineWindow"
  | "legalThreshold"
  | "timelineLane"
  | "biologicalWindow"
  | "institutionalSequence"
  | "statisticalNorm"
  | "culturalExpectation"
  | "whatGetsSaid"
  | "affectsLater";

export type TermRecord = {
  key: TermKey;
  standard: string;
  game?: string;
  define?: string;
  allowedAtSetDown?: boolean;
};

export const TERMS: Record<TermKey, TermRecord> = {
  roadmap: {
    key: "roadmap",
    standard: "Life roadmap",
    game: "The map",
    define: "the whole-life view, laid out so you can find where you are",
  },
  stage: {
    key: "stage",
    standard: "life stage",
    game: "chapter",
    define: "a stretch of life with its own conditions and common questions",
  },
  launch: {
    key: "launch",
    standard: "the launch years",
    game: "the launch",
    define: "the stretch, roughly your late teens to late twenties, when you first run your own life",
  },
  branch: {
    key: "branch",
    standard: "decision branch",
    game: "branch",
    define: "a fork where the routes genuinely diverge",
  },
  character: {
    key: "character",
    standard: "your situation at a glance",
    game: "character sheet",
    define: "a plain picture of what you have, what shape you are in, and what is being asked of you",
  },
  lifeStat: {
    key: "lifeStat",
    standard: "area of functioning",
    game: "life stat",
    define: "a capacity that rises and falls with your condition — not a measure of worth",
  },
  resource: {
    key: "resource",
    standard: "resource",
    // same in both editions
  },
  modifier: {
    key: "modifier",
    standard: "current condition",
    game: "modifier",
    define: "something raising or lowering your capacity right now",
  },
  support: {
    key: "support",
    standard: "support",
    game: "buff",
    define: "something currently working in your favour",
  },
  pressure: {
    key: "pressure",
    standard: "pressure",
    game: "debuff",
    define: "something currently weighing against you",
  },
  goal: {
    key: "goal",
    standard: "the goal that matters most",
    game: "main quest",
    define: "the thing this stretch of life is mostly about, as you define it",
  },
  sideGoal: {
    key: "sideGoal",
    standard: "smaller project",
    game: "side quest",
    define: "a real but secondary aim",
  },
  guidance: {
    key: "guidance",
    standard: "choosing a path",
    game: "the strategy guide",
    define: "the walkthrough for laying out a decision and its live options",
  },
  plan: {
    key: "plan",
    standard: "daily plan",
    game: "daily route",
    define: "one day, arranged so the important moves survive contact with it",
  },
  party: {
    key: "party",
    standard: "the people around you",
    game: "your party",
    define: "the people running this stretch of life with you",
  },
  move: {
    key: "move",
    standard: "what you can actually do",
    game: "your moves",
    define: "the actions genuinely open to you from where you stand",
  },
  slack: {
    key: "slack",
    standard: "slack",
    define: "the margin that absorbs a shock before it cascades",
    // "slack" is the guidebook's own plain term; identical in both editions.
    allowedAtSetDown: true,
  },
  variance: {
    key: "variance",
    standard: "variance",
    define: "the spread of outcomes a decision can draw from, good and bad",
    allowedAtSetDown: true,
  },
  recovery: {
    key: "recovery",
    standard: "recovery route",
    allowedAtSetDown: true,
  },
  history: {
    key: "history",
    standard: "history and change",
    game: "patches and metas",
    define: "how the rules of life have been rewritten over time",
  },
  meta: {
    key: "meta",
    standard: "the prevailing strategy",
    game: "the meta",
    define: "the move most people are currently making, and what that crowding does to it",
  },
  board: {
    key: "board",
    standard: "my situation, laid out",
    game: "my board",
    define: "your own position written out in plain rows",
  },
  pressureReading: {
    key: "pressureReading",
    standard: "which pressure is binding",
    game: "pressure reading",
    define: "finding the one constraint actually holding everything else still",
  },
  decisionLog: {
    key: "decisionLog",
    standard: "decision record",
    game: "decision log",
    define: "what you knew and expected, written down before the outcome arrives",
  },
  maintenanceLedger: {
    key: "maintenanceLedger",
    standard: "upkeep list",
    game: "maintenance ledger",
    define: "the recurring upkeep you are currently not doing",
  },
  topics: {
    key: "topics",
    standard: "topics",
  },
  planTier: {
    key: "planTier",
    standard: "option",
    game: "plan tier",
    define: "one of the ranked paths this decision offers",
  },
  /* ---------------------------------------------------------------
     THE 4.0 SANDBOX VOCABULARY (blueprint 4.0 §2.1).
     Every new sim-facing display term enters the map with both-edition
     renderings, so gate 2's GENERATED set-down lint covers the new
     vocabulary automatically and the map and the enforcement cannot drift.
     --------------------------------------------------------------- */
  season: {
    key: "season",
    standard: "half-year",
    game: "season",
    define: "one six-month turn of the campaign — the unit you allocate",
  },
  campaign: {
    key: "campaign",
    standard: "the long run",
    game: "campaign",
    define: "twelve years played through, saveable and resumable across sittings",
  },
  allocation: {
    key: "allocation",
    standard: "what you put the half-year into",
    game: "allocation",
    define: "the set of things you commit a season to, spent from a limited budget",
  },
  budget: {
    key: "budget",
    standard: "what the half-year can take",
    game: "the season budget",
    define: "the time, energy and money this stretch actually has to spend",
  },
  fork: {
    key: "fork",
    standard: "a second line from here",
    game: "fork",
    define: "an explicit branch from a decision, leaving the run it came from untouched",
  },
  preset: {
    key: "preset",
    standard: "a written starting position",
    game: "preset hand",
    define: "one of the five fictional starting positions, none of them the normal one",
  },
  queue: {
    key: "queue",
    standard: "what is already set in motion",
    game: "the consequence queue",
    define: "delayed effects already caused, with the season they land in named",
  },
  briefing: {
    key: "briefing",
    standard: "where things stand",
    game: "briefing",
    define: "the opening read of a season: pressures, needs, and what is pending",
  },
  companion: {
    key: "companion",
    standard: "someone in your life",
    game: "companion",
    define: "an authored person with their own wants, limits, and the ability to leave",
  },
  lab: {
    key: "lab",
    standard: "the comparison tool",
    game: "the Decision Lab",
    define: "playing both sides of one decision to see what actually separated them",
  },
  milestone: {
    key: "milestone",
    standard: "still reachable from here",
    game: "reachable milestones",
    define: "doors open from where you are standing — not predictions, and not a list of tasks",
  },
  constraintProfile: {
    key: "constraintProfile",
    standard: "what this start makes expensive",
    game: "constraint profile",
    define: "per-axis cost of the position you were dealt, with no total and no grade",
  },
  priority: {
    key: "priority",
    standard: "what you are aiming at",
    game: "priority",
    define: "one of the ten things you can say matters, weighted however you like",
  },
  standingCommitment: {
    key: "standingCommitment",
    standard: "something you are keeping up",
    game: "standing commitment",
    define: "an allocation that runs across several seasons and takes its upkeep off the top",
  },
  namedSave: {
    key: "namedSave",
    standard: "a saved run",
    game: "named save",
    define: "a run kept on this device, with its seed and version inspectable",
  },
  playDoor: {
    key: "playDoor",
    standard: "ways to play",
    game: "the play door",
    define: "the one screen that offers the three modes",
  },
  arc: {
    key: "arc",
    standard: "a whole life, fast",
    game: "the life arc",
    define: "the short mode: the whole shape of a life in eight acts",
  },

  /* ---- 5.0 §3.9: the timeline ----------------------------------------
     THE TIMELINE IS EDITION-NEUTRAL BY DESIGN (blueprint §12 default; review F4).

     These entries entered the map so that gate 2's generated set-down lint would
     cover the timeline's vocabulary automatically. Six of them also carried a Game
     Guide label — "the run so far", "turn", "unlock window", "gate", "track",
     "leads to" — and no timeline component ever called <Term>, so switching
     editions changed nothing on the page while the content claimed it might.

     The owner's call in the fix pass was the blueprint's own default: the timeline
     stays the same in both editions. A page whose whole argument is that five
     different kinds of expectation are not the same kind of thing is a poor place
     to rename a legal threshold a "gate" — the game vocabulary would flatten
     exactly the distinction the page exists to draw, and it would sit one line away
     from material about puberty, fertility and dying, where §5.3 forbids it
     outright. So the labels are removed rather than left dead, and the decision is
     recorded in DECISIONS.md instead of being implied by an empty map entry.

     The Standard labels stay, and they stay in the map, because that is what keeps
     the generated set-down lint covering the timeline's own words. */
  timeline: {
    key: "timeline",
    standard: "the timeline",
    define: "every year from birth to a hundred, with what commonly runs through it",
  },
  timelineYear: {
    key: "timelineYear",
    standard: "year",
    define: "one year of a life, with everything the records place in it",
  },
  timelineWindow: {
    key: "timelineWindow",
    standard: "window",
    define: "the stretch of years a thing commonly happens across — a range, not a date",
  },
  legalThreshold: {
    key: "legalThreshold",
    standard: "legal threshold",
    define: "an age written into a rule, which is the one kind of age that is actually a line",
  },
  timelineLane: {
    key: "timelineLane",
    standard: "lane",
    define: "one of the eight strands the timeline follows in parallel",
  },
  biologicalWindow: {
    key: "biologicalWindow",
    standard: "a window in a body",
    define: "a range bodies commonly move through, wider than most people think",
  },
  institutionalSequence: {
    key: "institutionalSequence",
    standard: "an institution's schedule",
    define: "a schedule an institution keeps, which usually has side doors",
  },
  statisticalNorm: {
    key: "statisticalNorm",
    standard: "a common pattern",
    define: "something measured in a stated population; common is not required",
  },
  culturalExpectation: {
    key: "culturalExpectation",
    standard: "something people say",
    define: "a thing said to you, recorded as speech rather than as a fact",
  },
  whatGetsSaid: {
    key: "whatGetsSaid",
    standard: "what gets said",
    define: "the sentences people actually hear at an age, quoted rather than endorsed",
  },
  affectsLater: {
    key: "affectsLater",
    standard: "affects later",
    define: "another record whose timing this one bears on",
  },
};

/** Every distinct game-vocabulary label that must never appear on a set-down page. */
export const SETDOWN_FORBIDDEN_TERMS: string[] = Object.values(TERMS)
  .filter((t) => t.game && !t.allowedAtSetDown)
  .map((t) => t.game as string);

/** Resolve a term for a given edition + effective frame. */
export function resolveTerm(
  key: TermKey,
  edition: "standard" | "game",
  effectiveFrame: "full" | "light" | "down",
): string {
  const record = TERMS[key];
  if (effectiveFrame === "down") return record.standard;
  if (edition === "game" && record.game) return record.game;
  return record.standard;
}
