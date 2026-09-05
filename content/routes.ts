/**
 * Route inventory — the single source of truth (blueprint 3.0 §6.1).
 *
 * Drives: primary nav (§6.1), the six doors (§6.1), the set-down header subset,
 * per-route presentation intensity, the client-side search index, and the
 * automated gates. 36 reader routes + 1 sanctioned redirect stub (/roadmap).
 * Nothing ships that is not listed here.
 *
 * 6.0 §2.3.1 repeals 3.0 §6.1's designation of /orientation as a redirect stub:
 * it is a real reading route again, "The Human Package" (N-001). /roadmap stays
 * a stub. (The count in this comment also read 27 while the list held 31; the
 * arithmetic is corrected here rather than carried forward.)
 *
 * THE SET-DOWN RULE (N-272, 6.0 §5.3), written where the routes are defined
 * because this is where `intensity: "down"` is decided:
 *
 *   A set-down route MAY render an evidence label — Illustrative, Our judgement,
 *   Researched — and MAY NOT render a game term.
 *
 * The two prohibitions are different in kind, and collapsing them is expensive in
 * exactly the wrong place. Game vocabulary is put away on these routes because
 * taking a bereavement apart produces the appearance of understanding at a cost
 * to someone already being handled a great deal. The evidence apparatus is the
 * opposite: it is what marks a folk model as folk belief on the page where a
 * reader is most likely to have been handed one as fact. Withholding it would
 * protect the register at the reader's expense.
 *
 * Gate 2 lints these routes against the GENERATED game-term list in
 * `content/terminology.ts`; C-9 asserts that no word in that generated list is
 * also an evidence label, so the lint can never start stripping the apparatus.
 *
 * Applying the rule to the five sensitive pages waits for their clinical and
 * specialist review: those pages are byte-identical at source and 6.0 adds no
 * label to them. The rule is written now so the review has something to review.
 */

import type { TermKey } from "./terminology.ts";

export type Intensity = "full" | "light" | "down";

/**
 * A path in this inventory. It is an alias for `string` and not a union of the
 * literal paths on purpose: the gates resolve every one of these against ROUTES
 * at build time and report the offending value by name (C-45, C-47), which is a
 * better error than a compiler complaining about an unassignable literal in a
 * content file. The name exists so a field that means "a route" says so.
 */
export type RoutePath = string;

export type RouteRecord = {
  path: string;
  title: string;
  /** Short label used in the persistent header nav (only for primary sections). */
  navLabel?: string;
  intensity: Intensity;
  summary: string;
  keywords?: string[];
  /** Excluded from the search index when false (the entrance, stubs). */
  searchable: boolean;
  /** A sanctioned redirect stub (§6.1): excluded from nav, doors, search, gate-5 walk. */
  stub?: boolean;
  /**
   * N-296 (6.0 §3.11, §7.1, C-48) — THE PLAYER-RELEVANCE ADMISSION TEST.
   *
   * The decision or orientation this page changes for the reader as the player of
   * their own life, in one sentence. REQUIRED, on every route including the stub:
   * it is the site's scope boundary, and a boundary that only new pages have to
   * clear is not a boundary, it is a habit. Batch 6 retrofitted the inherited
   * routes; C-48 asserts a non-empty sentence on every non-stub route, and the
   * type carries the rest.
   *
   * The test is published on /methodology#admission-test so a reader can hold the
   * site to it. A page that cannot fill this in does not belong here — which is
   * the one sentence that stops "explaining life" becoming an encyclopedia.
   */
  changes: string;
  /**
   * N-301 (6.0 §3.11, §7.1, C-49) — PERISHABLE CONTENT, declared as a property of
   * the route rather than remembered by whoever writes it next.
   *
   * Some pages are supposed to expire. A page about the current shape of a labour
   * market or about the evidence behind a ranking is not wrong when it goes stale;
   * it is finished, and a page that claims permanence about a moving target is
   * malfunctioning. Flagging it here makes the header render a review date, and
   * C-49 asserts the stamp on every flagged route.
   */
  perishable?: { reviewBy: string };
  /**
   * N-302 (6.0 §3.11, §7.1, C-50) — the `WHATS_COMING` id this route's card points
   * at, where a reader meeting the card is also meeting a hole. It is an id and
   * never a sentence, so 2.0 §6.9's single-source rule survives intact: the list
   * in `content/methodology.ts` is still the only place unbuilt scope is NAMED,
   * and every badge is derived from it. C-50 resolves both directions.
   */
  planned?: string;
  /**
   * N-322 (6.0 §3.12, §7.1) — which parts of the model this page touches, shown
   * as a tag row at the head of situation and topic pages, rendered through
   * <Term> so the row obeys edition parity like every other label.
   *
   * A SET-DOWN ROUTE NEVER CARRIES ONE (6.0 §5.3). The tag row is orientation
   * chrome, and a page a depleted reader lands on carries no chrome that asks to
   * be read before the page is. C-34 walks the set-down routes for it.
   */
  systems?: TermKey[];
  /**
   * N-329 (6.0 §3.12) — a declared comic register, permitted on bureaucracy-
   * shaped content only and excluded from every set-down and loss-adjacent route.
   * NO ROUTE IS FLAGGED IN THIS VERSION: the rule and its gate (C-35) ship first,
   * so the first bureaucracy guide inherits a wall rather than negotiating one.
   */
  register?: "comic";
};

export const ROUTES: RouteRecord[] = [
  {
    path: "/",
    title: "The Guidebook to Life",
    intensity: "light",
    summary: "The ethereal entrance: choose a manual, then begin a life — or find the page you need.",
    searchable: false,
    changes:
      "Which of the two manuals you read this site in, and whether you start from a run, from something that happened, or from a page you came looking for.",
  },
  {
    path: "/play",
    title: "The Playthrough",
    navLabel: "Play",
    intensity: "full",
    /*
     * N-091 (6.0 §3.4, C-40) — the door names the real-world planner and says
     * it is not one of these. The daily plan is the closest thing on the site
     * to a fourth mode and is deliberately not one: it is not randomised, it
     * generates no outcome, and it looks nothing like these three. Saying so on
     * the door is the cheap half of the separation; C-40 enforces the other.
     */
    summary:
      "Three ways to play a life: the whole shape of one fast, twelve years as a sandbox campaign, or a single decision forked and compared. The worked daily plan is not one of them — it is the real-world planner, and it is deliberately not a mode.",
    keywords: ["play", "playthrough", "simulator", "game", "life sim", "run", "begin a life", "modes"],
    searchable: true,
    changes:
      "Which of the three ways of playing is worth starting, and that the worked daily plan is not one of them.",
  },
  {
    path: "/play/arc",
    title: "A Whole Life",
    intensity: "full",
    summary:
      "The whole shape of a life, fast: character creation through Birth RNG, eight acts of branching decisions with visible outcomes, and an honest look back at the run.",
    keywords: ["whole life", "arc", "acts", "character creation", "birth rng", "overture"],
    searchable: true,
    changes:
      "Whether seeing the shape of a whole life quickly is worth doing before you decide how much of the rest of this site you need.",
  },
  {
    path: "/play/campaign",
    title: "Launch Window — United States, 2025",
    intensity: "full",
    summary:
      "Twelve years in twenty-four six-month seasons: a real season budget, an open action menu, other people with their own decisions, and consequences that land seasons later.",
    keywords: ["campaign", "launch window", "seasons", "sandbox", "budget", "allocate", "twelve years"],
    searchable: true,
    changes:
      "How you would actually spend a season when everything is short at once, and what that shows you about how you spend a real one.",
  },
  {
    path: "/play/lab",
    title: "The Decision Lab",
    intensity: "full",
    summary:
      "Fork one decision, play both branches, and see what actually separated them: the decision, the draw, or the position you started from.",
    keywords: ["decision lab", "fork", "compare", "branch", "counterfactual", "what if"],
    searchable: true,
    changes:
      "Whether what separated two outcomes was the decision, the draw, or the position you started from — which changes what you are entitled to conclude about your own past choices.",
  },
  {
    // 6.0 §2.3.1 / §3.1 (N-001) — the stub is repealed. The reader who will never
    // play is the reader who most needs the Human Package, and until now it lived
    // only as eight briefing bullets inside a run they were never going to start.
    path: "/orientation",
    title: "The Human Package",
    intensity: "light",
    summary:
      "What every life begins inside: arriving dependent, a hand dealt before you sat down, other people everywhere, rules that change with the place and the year, a finite run, and no win condition supplied.",
    keywords: [
      "orientation", "what is this", "human package", "starting conditions", "dependence",
      "unequal", "win condition", "about", "how to read this", "reading path", "where to start",
    ],
    searchable: true,
    changes:
      "Whether you read the rest of this site as instructions for living, or as a description of the conditions every life is already inside.",
  },
  {
    path: "/walkthrough",
    title: "Learn the game",
    navLabel: "Walkthrough",
    intensity: "light",
    summary:
      "The staged manual: the basics of a run and the five controls, the mechanics indexed with their pictures, and the advanced metagame.",
    keywords: ["walkthrough", "learn", "how to play", "basics", "controls", "mechanics", "manual", "guide"],
    searchable: true,
    changes:
      "Whether the game vocabulary is worth learning at all, and which of the controls you actually need before playing or reading further.",
  },
  {
    path: "/map",
    title: "The world map",
    navLabel: "Map",
    intensity: "full",
    summary:
      "The whole-life view across parallel domains — learning, health, work, relationships, money, meaning — with common windows, never deadlines.",
    keywords: ["map", "world map", "roadmap", "life map", "stages", "age", "timeline", "domains", "windows"],
    searchable: true,
    changes:
      "Where in the whole-life view your current question sits, and which other domains it is quietly attached to.",
  },
  {
    // 5.0 §3.1 — the timeline route family. Placed directly after /map so the
    // primary nav (derived from this order) shows Timeline after Map (§2.3.3).
    // Deliberately NOT in SETDOWN_NAV_PATHS: the timeline is a full-intensity
    // instrument and a grief page does not invite it.
    path: "/timeline",
    title: "The Timeline",
    navLabel: "Timeline",
    intensity: "full",
    summary:
      "Every year from birth to one hundred, with the milestones and expectations common at that age — each one sourced, and each one labelled with what kind of expectation it actually is.",
    keywords: [
      "timeline", "year by year", "age", "ages", "milestones", "expectations", "windows",
      "when do people", "what age", "legal age", "life stages", "birth to death", "lifespan",
    ],
    searchable: true,
    changes:
      "Whether the thing you feel late for is a deadline or a wide window, and what kind of expectation it actually is.",
  },
  {
    path: "/map/launch",
    title: "The launch years",
    intensity: "full",
    summary:
      "The stretch from roughly eighteen to twenty-nine: agency rising, resources gated, what compounds from here and what does not — and why a later launch is still a launch.",
    keywords: ["launch", "twenties", "graduate", "young adult", "starting out"],
    searchable: true,
    changes:
      "What compounds from the early adult years and what does not — and whether starting later is a different game or the same one.",
  },
  {
    path: "/map/credential-decision",
    title: "The credential decision",
    intensity: "full",
    summary:
      "College, trade, or work-first as a real decision structure: what each costs, when it pays, which choices lock, and the floor question only you can answer.",
    keywords: ["college", "university", "trade", "apprenticeship", "degree", "credential", "floor", "reversibility", "position"],
    searchable: true,
    changes:
      "Which of college, a trade, or work-first fits the position you are actually in, and which parts of that choice lock behind you.",
  },
  {
    path: "/triage",
    title: "Something happened",
    intensity: "down",
    summary: "One page, two questions at most, then the page you actually need. Nothing is recorded.",
    keywords: ["something happened", "help", "crisis", "urgent", "now", "what do i do"],
    searchable: true,
    changes:
      "Which page you need right now, chosen from what happened rather than from a category you have to identify with.",
  },
  {
    path: "/situations",
    title: "Situations",
    navLabel: "Situations",
    intensity: "light",
    summary:
      "Pages for specific hard events. They end with what to do next and what not to decide yet — never a lecture.",
    keywords: ["situations", "events", "index", "what happened"],
    searchable: true,
    changes:
      "Which specific page fits what happened — and whether what you are in is one of the shapes that has no solution and only a route through.",
  },
  {
    path: "/situations/job-loss",
    title: "Losing a job",
    intensity: "light",
    summary:
      "A decision sequence: the first days, stabilization, the search as a system, and recovery routes — with the clocks that actually matter found in week one.",
    keywords: ["job loss", "laid off", "layoff", "unemployed", "fired", "redundancy", "severance", "career"],
    searchable: true,
    changes:
      "What to do in the first days after a job ends, which clocks are already running, and what not to decide yet.",
    systems: ["money", "party", "work"],
  },
  {
    // 6.0 §3.1 (N-025). Light intensity: burnout is exhausting, not a bereavement,
    // and the reader here can still use a four-step sequence.
    path: "/situations/burnout",
    title: "Burning out",
    intensity: "light",
    summary:
      "A four-step sequence: confirm what this is, stop the bleeding, find the root cause, and make the structural change — because rest alone returns you to the conditions that produced it.",
    keywords: [
      "burnout", "burning out", "burnt out", "burned out", "exhausted at work", "cynical",
      "nothing left", "chronic exhaustion", "overwork", "can't recover",
    ],
    searchable: true,
    changes:
      "Whether the next move is more rest, or a change to the conditions that keep converting the rest back into exhaustion.",
    systems: ["health", "work", "time"],
  },
  {
    // 6.0 §3.1 (N-026). Loss-adjacent, and listed in LOSS_ADJACENT below: light
    // intensity, tone graded at the bar the set-down pages set.
    path: "/situations/breakup",
    title: "When a relationship ends",
    intensity: "light",
    summary:
      "Several parts of a life stop working on the same day — home, money, people, routine, the answer to who you are — which is why it hurts out of proportion to what anyone watching can see.",
    keywords: [
      "breakup", "break up", "broke up", "separation", "divorce", "relationship ended",
      "partner left", "split up", "ex", "single again",
    ],
    searchable: true,
    changes:
      "What you rebuild first in the fortnight after a partnership ends, and which questions you are allowed to leave for later.",
    systems: ["party", "money", "time"],
  },
  {
    // 6.0 §3.1 (N-023). Intensity "down", so it joins SETDOWN_ROUTES by derivation
    // and inherits the quiet nav, gate 2's vocabulary lint, N-263's double-Escape
    // and N-235's no-play-entry rule without any of them being hand-listed.
    path: "/situations/getting-through-today",
    title: "Getting through today",
    intensity: "down",
    summary: "Six ordinary things, and permission to stop reading. Nothing else here is for you tonight.",
    keywords: [
      "getting through today", "no capacity", "can't cope", "nothing left", "too tired to think",
      "just today", "overwhelmed", "stop",
    ],
    searchable: true,
    changes:
      "Whether you keep reading tonight, or stop and do six ordinary things instead.",
  },
  {
    path: "/situations/grief",
    title: "Grief and bereavement",
    intensity: "down",
    summary: "What grief is like, what is not true about it, what people report helped, and what a page cannot do.",
    keywords: ["grief", "grieving", "bereaved", "loss", "mourning", "someone died"],
    searchable: true,
    changes:
      "What to expect of your own grief, and which of the things you have been told about it are not true.",
  },
  {
    path: "/situations/a-death",
    title: "When someone has died",
    intensity: "down",
    summary: "The logistics of the first days, held apart from the grief, so almost nothing has to be decided today.",
    keywords: ["death", "died", "funeral", "estate", "certificate", "bereavement", "first days"],
    searchable: true,
    changes:
      "What actually has to be done in the first days, and how much of it can wait until you can think.",
  },
  {
    path: "/situations/depression",
    title: "Depression",
    intensity: "down",
    summary:
      "Orientation, not treatment: depression corrupts your readouts of yourself, which is exactly why outside readings — people and professionals — are the move.",
    keywords: ["depression", "depressed", "low mood", "anhedonia", "mental health"],
    searchable: true,
    changes:
      "Whether to trust your own readouts about yourself right now, and why the move is a reading from outside you.",
  },
  {
    path: "/situations/being-hurt",
    title: "When someone is hurting or controlling you",
    intensity: "down",
    summary:
      "Information, not instructions. Nothing here is conditional on what you decide, and nothing pushes you toward a move that can raise the danger.",
    keywords: ["abuse", "coercive control", "domestic", "partner", "controlling", "hurt", "frightened", "safety"],
    searchable: true,
    changes:
      "What is true about your situation, held apart from any decision — nothing here is conditional on what you choose to do.",
  },
  {
    path: "/guidance",
    title: "Choosing a path",
    navLabel: "Guidance",
    intensity: "full",
    summary:
      "An optional walkthrough for laying out a decision: what you are aiming at, what you are holding, hard limits, then meaningfully different plans with their costs, pivots, and recovery routes.",
    keywords: ["guidance", "decision", "choose", "plan a", "plan b", "options", "walkthrough"],
    searchable: true,
    changes:
      "How to lay a decision out so the options are meaningfully different, and whether you have enough to decide anything yet.",
  },
  {
    path: "/guidance/daily-plan",
    title: "A worked daily plan",
    intensity: "light",
    summary:
      "One plan turned into a real Tuesday — with a minimum viable day for when capacity is the constraint, and the anti-shame rules stated plainly.",
    keywords: ["daily plan", "day", "routine", "minimum viable day", "lanes", "schedule"],
    searchable: true,
    changes:
      "What a plan looks like on a real day, and what that day becomes when capacity is the binding constraint.",
  },
  {
    path: "/character",
    title: "The state panel, explained",
    navLabel: "Character",
    intensity: "full",
    summary:
      "An illustrative picture of capacity, resources, conditions, and commitments — the same live panel the Playthrough uses — with no overall score, because human worth is not a stat.",
    keywords: ["character sheet", "state panel", "stats", "life stats", "attributes", "self", "capacity"],
    searchable: true,
    changes:
      "Which parts of your situation you have been blurring together — and that no total of them is a reading of you.",
  },
  {
    path: "/character/board",
    title: "Guided pressure reading",
    intensity: "full",
    summary:
      "Read which pressure is actually binding by walking the constraint check through curated options — condition, slack, wall-or-door, still-want-it, conflict, then resources.",
    keywords: ["board", "my board", "pressure reading", "binding constraint", "situation"],
    searchable: true,
    changes:
      "Which pressure is actually binding, which is what decides whether any of the obvious moves would help at all.",
  },
  {
    path: "/character/logs",
    title: "Decision record and upkeep list",
    intensity: "full",
    summary:
      "Record what you knew before an outcome arrives, and keep sight of the recurring upkeep you are not doing — no counts, no streaks, kept on this device.",
    keywords: ["decision log", "maintenance ledger", "upkeep", "record", "journal", "logs"],
    searchable: true,
    changes:
      "What you knew before an outcome arrived, and which recurring upkeep you are quietly not doing.",
  },
  {
    path: "/topics",
    title: "Topics",
    navLabel: "Topics",
    intensity: "light",
    summary: "Look something up: money, health, relationships, work — plus search across the guide.",
    keywords: ["topics", "index", "look up", "search"],
    searchable: true,
    changes:
      "Which of the four guides owns the mechanism behind your question, so you read one page instead of four.",
  },
  {
    path: "/topics/money",
    title: "Money and slack",
    intensity: "light",
    summary:
      "Compounding in both directions, exchange rates and their asymmetry, and slack as the buffer that stops a shock becoming a cascade.",
    keywords: ["money", "slack", "compounding", "debt", "savings", "emergency fund", "inequality", "exchange rates"],
    searchable: true,
    changes:
      "Whether what you are in is a slack problem rather than an income problem, and what a buffer actually buys you.",
    // N-302 — the reader meets this guide's hole on the card, not in a list they
    // would have to go looking for. The id resolves into WHATS_COMING (C-50).
    planned: "wc-money",
    systems: ["money", "time"],
  },
  {
    path: "/topics/health",
    title: "Health maintenance",
    intensity: "light",
    summary:
      "Health as the capacity that gates everything else, the maintenance-versus-recovery asymmetry, sleep debt, and when to stop reading a website and see a clinician.",
    keywords: ["health", "maintenance", "sleep", "energy", "recovery", "fitness", "clinician", "body"],
    searchable: true,
    changes:
      "Whether what you have been treating as a motivation problem is a capacity problem, and when to stop reading a website and see a clinician.",
    planned: "wc-health",
    systems: ["health", "time"],
  },
  {
    path: "/topics/relationships",
    title: "The people around you",
    intensity: "light",
    summary:
      "Trust built slowly and spent fast, repair that turns on changed behaviour, asking for help as a skill, and the load of care.",
    keywords: ["relationships", "party", "trust", "repair", "asking for help", "caregiving", "friends", "family"],
    searchable: true,
    changes:
      "What you are actually spending when you ask for help, repair a rift, or carry someone — and what rebuilds it.",
    planned: "wc-relationships",
    systems: ["party", "time"],
  },
  {
    path: "/topics/work",
    title: "Education and career",
    intensity: "light",
    summary:
      "Credentials as access tokens, the unwritten local rules of a workplace, why popular strategies degrade by being popular, and what a mid-life change of direction actually costs.",
    keywords: ["work", "career", "education", "credentials", "job", "meta", "respec", "workplace", "readout"],
    searchable: true,
    changes:
      "Whether the problem in front of you is about capability, about unwritten local rules, or about a strategy that has been crowded out by everyone else running it.",
    // N-301 — the meta section on this page is dated on purpose and its examples
    // are the first thing here that will stop being true. The stamp inside the
    // page said so already; the route now declares it, so the header carries a
    // review date and the property is inheritable rather than remembered.
    perishable: { reviewBy: "2027-02" },
    systems: ["work", "money", "party"],
  },
  {
    // 6.0 §3.1 (N-111) — the concept index. Not a fifth guide: it owns no
    // mechanism. It is the cross-reference that makes the four guides read as one
    // system, and every cell points at the guide that does own the mechanism.
    path: "/topics/concepts",
    title: "One idea, several systems",
    intensity: "light",
    summary:
      "Ten ideas that turn up in more than one place, with what each one means in each — compounding in money and in trust, slack in a budget and in a week, a floor under a decision and under a body.",
    keywords: [
      "concepts", "concept index", "one idea", "cross-reference", "compounding", "slack",
      "exchange rates", "load", "trust", "reversibility", "position", "recovery", "the floor",
      "the meta", "same mechanism",
    ],
    searchable: true,
    changes:
      "Which of the four guides you open, once you can see that the thing you are asking about is the same mechanism under a different name.",
  },
  {
    path: "/history",
    title: "History and change",
    navLabel: "History",
    intensity: "full",
    summary:
      "One era done properly: industrialization as a major patch, with a before-and-after tier board that ranks what a ruleset did to a position — never the worth of the people in it.",
    keywords: ["history", "industrialization", "patch notes", "tier list", "eras", "change"],
    searchable: true,
    changes:
      "Whether what changed a position was the people in it or the ruleset around them — which is the question you were probably arguing about.",
    // N-301 — the tier board's placements rest on an evidence state, declared per
    // objective in the ruleset header. An evidence state is exactly the kind of
    // thing that expires, so the header's stamp says when it is due to be read
    // again rather than restating the state the header already carries.
    perishable: { reviewBy: "2027-03" },
  },
  {
    path: "/methodology",
    title: "How this works",
    navLabel: "Methodology",
    intensity: "full",
    summary:
      "The instrument and how to judge it, the two editions and the set-down system, how evidence works here, the engine's weight tables, the corrections register, the known breaks, and what is coming.",
    keywords: ["methodology", "evidence", "corrections", "known breaks", "no scores", "model", "how this works", "engine", "weights", "coming"],
    searchable: true,
    changes:
      "How much weight to give anything on this site, and where its frame is known to fail.",
  },
  {
    path: "/threshold",
    title: "If you need help now",
    intensity: "down",
    summary: "Phone numbers, and nothing else. No framework, no analysis, nothing to read first.",
    keywords: ["threshold", "help now", "crisis", "hotline", "emergency", "suicide", "988", "samaritans"],
    searchable: true,
    changes:
      "Nothing, deliberately. It is phone numbers, and the only orientation on it is which number.",
  },
  {
    path: "/threshold/supporting-someone",
    title: "If you are trying to help someone",
    intensity: "down",
    summary:
      "For a supporter: ask directly, keep help unconditional, you are not the risk assessor, and where the cases differ.",
    keywords: ["supporting someone", "help someone", "worried about", "carer", "supporter"],
    searchable: true,
    changes:
      "What is yours to do for someone you are worried about, and what is not yours to carry.",
  },

  /* ---- Sanctioned redirect stubs (§6.1): excluded from nav, doors, search, gate-5 walk ---- */
  {
    path: "/roadmap",
    title: "Moved to the world map",
    intensity: "full",
    summary: "The roadmap is now the world map.",
    searchable: false,
    changes:
      "Nothing; it forwards to the world map, which is where this content moved.",
    stub: true,
  },
];

export const ROUTE_BY_PATH: Record<string, RouteRecord> = Object.fromEntries(
  ROUTES.map((r) => [r.path, r]),
);

/** The redirect stubs (§6.1). */
export const STUB_ROUTES: string[] = ROUTES.filter((r) => r.stub).map((r) => r.path);
export function isStubRoute(path: string): boolean {
  return STUB_ROUTES.includes(normalizePath(path));
}

/** Hard-assigned set-down routes (§4.2). */
export const SETDOWN_ROUTES: string[] = ROUTES.filter((r) => r.intensity === "down").map((r) => r.path);

export function isSetDownRoute(path: string): boolean {
  return SETDOWN_ROUTES.includes(normalizePath(path));
}

/**
 * N-329 (6.0 §3.12) — LOSS-ADJACENT ROUTES.
 *
 * Routes that are not set down, and where a comic register is still banned. The
 * set-down list is derived from intensity; this one cannot be, because what makes
 * a page loss-adjacent is its subject rather than its presentation. A breakup and
 * a job loss are both written at full strength, with steps and tags and a
 * decision sequence — and both are read by someone who has just lost something,
 * which is the whole of the reason.
 *
 * The rule this list serves is published on /methodology, where a reader can see
 * it: a comic register is permitted on bureaucracy-shaped pages and banned two
 * doors down. C-35 asserts that nothing carrying `register: "comic"` is on this
 * list or set down. No route is flagged comic in this version.
 */
export const LOSS_ADJACENT_ROUTES: string[] = ["/situations/breakup", "/situations/job-loss"];

export function isLossAdjacentRoute(path: string): boolean {
  return LOSS_ADJACENT_ROUTES.includes(normalizePath(path));
}

export function intensityForRoute(path: string): Intensity {
  return ROUTE_BY_PATH[normalizePath(path)]?.intensity ?? "light";
}

/** Trailing-slash tolerant lookup (static export uses trailingSlash: true). */
export function normalizePath(path: string): string {
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

/** Primary header navigation, in order (§6.1). */
export const PRIMARY_NAV = ROUTES.filter((r) => r.navLabel && !r.stub).map((r) => ({
  href: r.path,
  label: r.navLabel as string,
}));

/**
 * The quiet subset shown on set-down routes (§6.1): Situations · Topics ·
 * Methodology + Help now, with no Play entry — a grief page does not invite play.
 */
export const SETDOWN_NAV_PATHS = ["/situations", "/topics", "/methodology"];
export const SETDOWN_NAV = PRIMARY_NAV.filter((n) => SETDOWN_NAV_PATHS.includes(n.href));

/**
 * The six doors on the entrance (§6.1). "Continue" is client-enhanced — it appears
 * only when an active run exists in local storage (rendered by the entrance).
 */
export const DOORS = [
  {
    id: "begin",
    href: "/play",
    label: "Begin a life",
    blurb: "Three ways in: the whole shape of a life fast, twelve years as a sandbox, or one decision forked and compared. Your first choice is under a minute away.",
    primary: true,
  },
  {
    id: "continue",
    href: "/play",
    label: "Continue",
    blurb: "Pick your run back up exactly where you left it.",
    clientOnly: true,
  },
  {
    id: "happened",
    href: "/triage",
    label: "Something happened",
    blurb: "Start with the event. Two questions at most, then the page you need.",
  },
  {
    id: "learn",
    href: "/walkthrough",
    label: "Learn the game",
    blurb: "How a run works, the five controls, and the mechanics — before you play, or alongside it.",
  },
  {
    id: "lookup",
    href: "/topics",
    label: "Look something up",
    blurb: "Go straight to money, health, relationships, work, or search the guide.",
  },
  {
    id: "help",
    href: "/threshold",
    label: "Help me now",
    blurb: "Immediate danger, a suicidal crisis, someone hurting you, or a death.",
  },
] as const;
