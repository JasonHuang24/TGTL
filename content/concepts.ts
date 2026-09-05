/**
 * N-111 (6.0 §3.5, §7.1, C-31) — THE CONCEPT INDEX.
 *
 * The site's search finds pages. This finds the same mechanism wearing several
 * different names: compounding in money and in a body, load in a household and in
 * an organisation, a floor under a decision and under a career. That recognition
 * is the whole thing the model is supposed to buy a reader, and until now nothing
 * on the site did it — four good guides that read as four good guides.
 *
 * THE SINGLE-HOME RULE IS THE CONSTRAINT (G-06, N-321). This file owns no
 * explanation. Every cell is one line and a link to the route that actually owns
 * the mechanism, and C-31 asserts, over the exported HTML, that the route named
 * in a cell really does talk about that concept. A cell pointing somewhere the
 * mechanism is not explained is a dangling promise, and the gate goes red on it.
 *
 * WHY THESE TEN, AND NOT THE OBVIOUS ELEVENTH. Exchange rates were the natural
 * tenth and are not here: in this trunk they live wholly inside the money guide,
 * so the row would have had exactly one cell and would have taught nothing about
 * reading across systems, which is the only reason this page exists. The ten that
 * are here each turn up in at least two places under at least two names.
 */

/** A route path from `content/routes.ts`. Kept as a string so nothing imports circularly. */
export type RoutePath = string;

export type Concept = {
  id: string;
  name: string;
  /**
   * Other words the site genuinely uses for the same idea. C-31 accepts any of
   * them as evidence that a route carries the mechanism — because a page that
   * says "buffer" twenty times and "slack" twice still owns slack.
   */
  aliases?: string[];
  /** One line per system where the mechanism exists, and nowhere it does not. */
  cells: { system: RoutePath; gloss: string }[];
};

/**
 * The columns of the rendered table, in order. A concept renders a cell under a
 * column when it has one for that route, and an em dash when it does not — the
 * gaps are informative, and filling them in would be the first thing to make this
 * page dishonest.
 */
export const CONCEPT_COLUMNS: { system: RoutePath; label: string }[] = [
  { system: "/topics/money", label: "Money" },
  { system: "/topics/health", label: "Health" },
  { system: "/topics/relationships", label: "People" },
  { system: "/topics/work", label: "Work" },
  { system: "/map/credential-decision", label: "A decision" },
  { system: "/walkthrough", label: "In a played life" },
];

export const CONCEPTS: Concept[] = [
  {
    id: "compounding",
    name: "Compounding",
    aliases: ["compound", "compounds"],
    cells: [
      {
        system: "/topics/money",
        gloss: "Interest, in both directions — and the negative direction is the faster one.",
      },
      {
        system: "/topics/health",
        gloss: "Deferred maintenance, which is the fastest-compounding negative there is.",
      },
      {
        system: "/topics/work",
        gloss: "A skill that connects to skills you already have is worth more than its face value.",
      },
      {
        system: "/walkthrough",
        gloss: "Why the early stretch is weighted: the flat start is where nearly everyone quits.",
      },
    ],
  },
  {
    id: "slack",
    name: "Slack",
    aliases: ["buffer", "margin"],
    cells: [
      {
        system: "/topics/money",
        gloss: "The buffer that stops one bad thing becoming three. Its home page.",
      },
      {
        system: "/topics/health",
        gloss: "Capacity held back rather than spent, which is what makes a bad week recoverable.",
      },
      {
        system: "/topics/work",
        gloss: "What flattens the asymmetry: they can end it in an afternoon and you cannot.",
      },
    ],
  },
  {
    id: "load",
    name: "Load",
    aliases: ["overload"],
    cells: [
      {
        system: "/topics/health",
        gloss: "Load plus recovery is adaptation; load without recovery is damage. No third option.",
      },
      {
        system: "/topics/relationships",
        gloss: "Care distributed by proximity rather than by agreement, and tallied by only one side.",
      },
    ],
  },
  {
    id: "recovery",
    name: "Recovery",
    cells: [
      {
        system: "/topics/health",
        gloss: "The half of the training loop that is skipped, and the half that does the building.",
      },
      {
        system: "/map/credential-decision",
        gloss: "What a bad outcome costs depends entirely on whether there is a route back from it.",
      },
      {
        system: "/walkthrough",
        gloss: "A free move in every turn of a run, not a skipped one.",
      },
    ],
  },
  {
    id: "trust",
    name: "Trust",
    // The work guide calls this credibility throughout and never says "trust",
    // which is the alias field doing its job rather than a hole in the row.
    aliases: ["credibility"],
    cells: [
      {
        system: "/topics/relationships",
        gloss: "Built slowly from kept promises, spent fast, and rebuilt on worse terms. Its home page.",
      },
      {
        system: "/topics/work",
        gloss: "Credibility — the belief your estimates are true — which buys attention and is not portable.",
      },
      {
        system: "/topics/money",
        gloss: "The thing institutions and currencies run on, which is why their failures are so total.",
      },
    ],
  },
  {
    id: "reputation",
    name: "Reputation",
    aliases: ["standing"],
    cells: [
      {
        system: "/topics/work",
        gloss: "Not something you hold: copies held by other people, each one stale by a different amount.",
      },
      {
        system: "/topics/relationships",
        gloss: "Written mostly by third parties, which is why who talks about you matters more than who knows you.",
      },
    ],
  },
  {
    id: "the-floor",
    name: "The floor",
    aliases: ["floor", "floors"],
    cells: [
      {
        system: "/map/credential-decision",
        gloss: "Whether there is something beneath failure — the fact that decides which advice applies.",
      },
      {
        system: "/topics/money",
        gloss: "In arithmetic: how long you last if the income stops, computed rather than dreaded.",
      },
      {
        system: "/walkthrough",
        gloss: "A floor turns a ruin tail into a bounded experiment, which is most of position math.",
      },
    ],
  },
  {
    id: "position",
    name: "Position",
    cells: [
      {
        system: "/map/credential-decision",
        gloss: "The same move costs differently from a different start. Its home page.",
      },
      {
        system: "/topics/money",
        gloss: "Why the same shock is an inconvenience for one household and a cascade for another.",
      },
      // The people guide has a real position note — "where this does not apply"
      // — and never uses the word, so there is no cell here. The gap is the rule
      // working: a cell would be a promise the page does not keep.
      {
        system: "/topics/work",
        gloss: "How much of an outcome was the labour market rather than the person inside it.",
      },
    ],
  },
  {
    id: "reversibility",
    name: "Reversibility",
    aliases: ["reversible", "irreversible"],
    cells: [
      {
        system: "/map/credential-decision",
        gloss: "It runs opposite to how it feels: the safe path is the locked one.",
      },
      {
        system: "/topics/work",
        gloss: "Stopping a course of learning is reversible; the years spent on it are not.",
      },
    ],
  },
  {
    id: "unwritten-rules",
    name: "Unwritten rules",
    aliases: ["local rules", "unwritten"],
    cells: [
      {
        system: "/topics/work",
        gloss: "The org chart is the map the place publishes, not the map it uses.",
      },
      {
        system: "/topics/relationships",
        gloss: "The same object at personal scale: what reading a room is actually reading.",
      },
    ],
  },
];
