/**
 * Route inventory — the single source of truth (blueprint 3.0 §6.1).
 *
 * Drives: primary nav (§6.1), the six doors (§6.1), the set-down header subset,
 * per-route presentation intensity, the client-side search index, and the
 * automated gates. 27 reader routes + 2 sanctioned redirect stubs
 * (/orientation, /roadmap). Nothing ships that is not listed here.
 */

export type Intensity = "full" | "light" | "down";

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
};

export const ROUTES: RouteRecord[] = [
  {
    path: "/",
    title: "The Guidebook to Life",
    intensity: "light",
    summary: "The ethereal entrance: choose a manual, then begin a life — or find the page you need.",
    searchable: false,
  },
  {
    path: "/play",
    title: "The Playthrough",
    navLabel: "Play",
    intensity: "full",
    summary:
      "Three ways to play a life: the whole shape of one fast, twelve years as a sandbox campaign, or a single decision forked and compared.",
    keywords: ["play", "playthrough", "simulator", "game", "life sim", "run", "begin a life", "modes"],
    searchable: true,
  },
  {
    path: "/play/arc",
    title: "A Whole Life",
    intensity: "full",
    summary:
      "The whole shape of a life, fast: character creation through Birth RNG, eight acts of branching decisions with visible outcomes, and an honest look back at the run.",
    keywords: ["whole life", "arc", "acts", "character creation", "birth rng", "overture"],
    searchable: true,
  },
  {
    path: "/play/campaign",
    title: "Launch Window — United States, 2025",
    intensity: "full",
    summary:
      "Twelve years in twenty-four six-month seasons: a real season budget, an open action menu, other people with their own decisions, and consequences that land seasons later.",
    keywords: ["campaign", "launch window", "seasons", "sandbox", "budget", "allocate", "twelve years"],
    searchable: true,
  },
  {
    path: "/play/lab",
    title: "The Decision Lab",
    intensity: "full",
    summary:
      "Fork one decision, play both branches, and see what actually separated them: the decision, the draw, or the position you started from.",
    keywords: ["decision lab", "fork", "compare", "branch", "counterfactual", "what if"],
    searchable: true,
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
  },
  {
    path: "/map/launch",
    title: "The launch years",
    intensity: "full",
    summary:
      "The stretch from roughly eighteen to twenty-nine: agency rising, resources gated, what compounds from here and what does not — and why a later launch is still a launch.",
    keywords: ["launch", "twenties", "graduate", "young adult", "starting out"],
    searchable: true,
  },
  {
    path: "/map/credential-decision",
    title: "The credential decision",
    intensity: "full",
    summary:
      "College, trade, or work-first as a real decision structure: what each costs, when it pays, which choices lock, and the floor question only you can answer.",
    keywords: ["college", "university", "trade", "apprenticeship", "degree", "credential", "floor", "reversibility", "position"],
    searchable: true,
  },
  {
    path: "/triage",
    title: "Something happened",
    intensity: "down",
    summary: "One page, two questions at most, then the page you actually need. Nothing is recorded.",
    keywords: ["something happened", "help", "crisis", "urgent", "now", "what do i do"],
    searchable: true,
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
  },
  {
    path: "/situations/job-loss",
    title: "Losing a job",
    intensity: "light",
    summary:
      "A decision sequence: the first days, stabilization, the search as a system, and recovery routes — with the clocks that actually matter found in week one.",
    keywords: ["job loss", "laid off", "layoff", "unemployed", "fired", "redundancy", "severance", "career"],
    searchable: true,
  },
  {
    path: "/situations/grief",
    title: "Grief and bereavement",
    intensity: "down",
    summary: "What grief is like, what is not true about it, what people report helped, and what a page cannot do.",
    keywords: ["grief", "grieving", "bereaved", "loss", "mourning", "someone died"],
    searchable: true,
  },
  {
    path: "/situations/a-death",
    title: "When someone has died",
    intensity: "down",
    summary: "The logistics of the first days, held apart from the grief, so almost nothing has to be decided today.",
    keywords: ["death", "died", "funeral", "estate", "certificate", "bereavement", "first days"],
    searchable: true,
  },
  {
    path: "/situations/depression",
    title: "Depression",
    intensity: "down",
    summary:
      "Orientation, not treatment: depression corrupts your readouts of yourself, which is exactly why outside readings — people and professionals — are the move.",
    keywords: ["depression", "depressed", "low mood", "anhedonia", "mental health"],
    searchable: true,
  },
  {
    path: "/situations/being-hurt",
    title: "When someone is hurting or controlling you",
    intensity: "down",
    summary:
      "Information, not instructions. Nothing here is conditional on what you decide, and nothing pushes you toward a move that can raise the danger.",
    keywords: ["abuse", "coercive control", "domestic", "partner", "controlling", "hurt", "frightened", "safety"],
    searchable: true,
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
  },
  {
    path: "/guidance/daily-plan",
    title: "A worked daily plan",
    intensity: "light",
    summary:
      "One plan turned into a real Tuesday — with a minimum viable day for when capacity is the constraint, and the anti-shame rules stated plainly.",
    keywords: ["daily plan", "day", "routine", "minimum viable day", "lanes", "schedule"],
    searchable: true,
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
  },
  {
    path: "/character/board",
    title: "Guided pressure reading",
    intensity: "full",
    summary:
      "Read which pressure is actually binding by walking the constraint check through curated options — condition, slack, wall-or-door, still-want-it, conflict, then resources.",
    keywords: ["board", "my board", "pressure reading", "binding constraint", "situation"],
    searchable: true,
  },
  {
    path: "/character/logs",
    title: "Decision record and upkeep list",
    intensity: "full",
    summary:
      "Record what you knew before an outcome arrives, and keep sight of the recurring upkeep you are not doing — no counts, no streaks, kept on this device.",
    keywords: ["decision log", "maintenance ledger", "upkeep", "record", "journal", "logs"],
    searchable: true,
  },
  {
    path: "/topics",
    title: "Topics",
    navLabel: "Topics",
    intensity: "light",
    summary: "Look something up: money, health, relationships, work — plus search across the guide.",
    keywords: ["topics", "index", "look up", "search"],
    searchable: true,
  },
  {
    path: "/topics/money",
    title: "Money and slack",
    intensity: "light",
    summary:
      "Compounding in both directions, exchange rates and their asymmetry, and slack as the buffer that stops a shock becoming a cascade.",
    keywords: ["money", "slack", "compounding", "debt", "savings", "emergency fund", "inequality", "exchange rates"],
    searchable: true,
  },
  {
    path: "/topics/health",
    title: "Health maintenance",
    intensity: "light",
    summary:
      "Health as the capacity that gates everything else, the maintenance-versus-recovery asymmetry, sleep debt, and when to stop reading a website and see a clinician.",
    keywords: ["health", "maintenance", "sleep", "energy", "recovery", "fitness", "clinician", "body"],
    searchable: true,
  },
  {
    path: "/topics/relationships",
    title: "The people around you",
    intensity: "light",
    summary:
      "Trust built slowly and spent fast, repair that turns on changed behaviour, asking for help as a skill, and the load of care.",
    keywords: ["relationships", "party", "trust", "repair", "asking for help", "caregiving", "friends", "family"],
    searchable: true,
  },
  {
    path: "/topics/work",
    title: "Education and career",
    intensity: "light",
    summary:
      "Credentials as access tokens, the unwritten local rules of a workplace, why popular strategies degrade by being popular, and what a mid-life change of direction actually costs.",
    keywords: ["work", "career", "education", "credentials", "job", "meta", "respec", "workplace", "readout"],
    searchable: true,
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
  },
  {
    path: "/threshold",
    title: "If you need help now",
    intensity: "down",
    summary: "Phone numbers, and nothing else. No framework, no analysis, nothing to read first.",
    keywords: ["threshold", "help now", "crisis", "hotline", "emergency", "suicide", "988", "samaritans"],
    searchable: true,
  },
  {
    path: "/threshold/supporting-someone",
    title: "If you are trying to help someone",
    intensity: "down",
    summary:
      "For a supporter: ask directly, keep help unconditional, you are not the risk assessor, and where the cases differ.",
    keywords: ["supporting someone", "help someone", "worried about", "carer", "supporter"],
    searchable: true,
  },

  /* ---- Sanctioned redirect stubs (§6.1): excluded from nav, doors, search, gate-5 walk ---- */
  {
    path: "/orientation",
    title: "Moved to the walkthrough",
    intensity: "light",
    summary: "Orientation moved into the walkthrough and the in-run briefing.",
    searchable: false,
    stub: true,
  },
  {
    path: "/roadmap",
    title: "Moved to the world map",
    intensity: "full",
    summary: "The roadmap is now the world map.",
    searchable: false,
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
