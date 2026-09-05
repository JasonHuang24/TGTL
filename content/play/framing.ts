/**
 * Dual-authored framing (blueprint 3.0 §11.4) — permitted in exactly three places:
 * the prologue, the briefing, and the parse's frame text. Everywhere else, sim
 * prose is authored once, edition-neutral, with only `<Term>` vocabulary differing.
 *
 * Standard holds the frame lightly ("an exercise: one life, laid out"); Game Guide
 * uses package/strategy language. Same facts, different voice (G-01).
 */

export type Dual = { standard: string; game: string };

/* ---- Notes shown once at run start (§8 illustrative note; §7.4 content note) ---- */

export const ILLUSTRATIVE_NOTE =
  "This is a model, not a prediction — a way to feel how the mechanics move. The numbers under it are authored, not measured.";

export const CONTENT_NOTE =
  "This run contains the shape of a whole life, including loss. Any beat can be skipped, and the help pages are always in the header — including right now.";

/* ---- Prologue (the ethereal realm; also used on the entrance) ---- */

export const PROLOGUE_LINES: Dual[] = [
  {
    standard: "Before the run, there is a quiet nowhere — no cosmology asserted, just a place to stand and look at the whole thing before it starts.",
    game: "A loading screen before the world loads: the void, some starlight, and Earth turning below, waiting for a player who does not exist yet.",
  },
  {
    standard: "Down there is one life, not yet begun. You are about to be dealt into it — most of it unchosen, some of it yours.",
    game: "That blue marble is the map. In a moment you'll spawn into a single run of it, most of your starting stats already rolled.",
  },
];

/* ---- Briefing — the Human Package (§3.2) ---- */

export const BRIEFING_TITLE: Dual = {
  standard: "What every human life begins inside",
  game: "The Human Package — pre-game overview",
};

export const BRIEFING_INTRO: Dual = {
  standard:
    "A plain overview of the thing you're about to play, held as an exercise: one life, laid out from before its start. Not an advertisement, not a warning — both the wonder and the cost are here.",
  game:
    "The package overview before you start a run. It ships with real upside and real cost, and — read the last line — no win condition. Both are the point.",
};

export type BriefingPoint = { key: string; label: string; body: Dual };

export const BRIEFING_POINTS: BriefingPoint[] = [
  {
    key: "world",
    label: "The world",
    body: {
      standard: "One planet, one species, this era's rules — which differ sharply by where and when you land.",
      game: "A single shared server. The ruleset is patched constantly and forked by region; your spawn point decides which fork you get.",
    },
  },
  {
    key: "length",
    label: "The run",
    body: {
      standard: "A finite length nobody tells you in advance. It ends. That fact is load-bearing, not morbid.",
      game: "Run length is hidden and non-negotiable. There is no continue and no save-scum — which is exactly what gives the moves their weight.",
    },
  },
  {
    key: "agency",
    label: "Starting agency",
    body: {
      standard: "You begin fully dependent. Agency rises slowly, gated by resources you did not choose.",
      game: "You spawn at near-zero control. Agency unlocks with age, hard-gated by a starting inventory you didn't roll for.",
    },
  },
  {
    key: "needs",
    label: "Core needs and abilities",
    body: {
      standard: "A body to maintain, a mind that learns, and the capacity to make, tend, and connect.",
      game: "Base kit: a body with upkeep, a mind that levels through use, and skills in making, tending, and connecting.",
    },
  },
  {
    key: "others",
    label: "Other people",
    body: {
      standard: "The largest fact of the game. No human run is truly solo, and no one you meet is a background character.",
      game: "The biggest mechanic on the board. No human playthrough is truly solo — and every other player is running a full campaign of their own.",
    },
  },
  {
    key: "difficulty",
    label: "Unequal difficulty",
    body: {
      standard: "The starting conditions are unequal and unchosen. The gap is real, and it is not a measure of the people inside it.",
      game: "Difficulty is set by your spawn, not by you, and the spread is wide. A hard start is a hard start — never a verdict on the player.",
    },
  },
  {
    key: "win",
    label: "The win condition",
    body: {
      standard: "There isn't one supplied. You get to — and have to — decide what winning means. That's the first real choice.",
      game: "None included. The package ships without a victory screen, so you define the objective yourself. Character creation starts there for a reason.",
    },
  },
  {
    key: "end",
    label: "The end state",
    body: {
      standard: "The run closes, and the guidebook doesn't claim to know what follows. What you built stays where you left it.",
      game: "The run terminates. What comes after is out of scope and the sim won't pretend otherwise. Your build persists in the world you leave.",
    },
  },
];

/* ---- Creation copy (§3.3) ---- */

export const WEIGHTS_INTRO: Dual = {
  standard:
    "The package includes no definition of winning, so you supply one — and the commonest way a life goes wrong is not losing, but playing somebody else's game without noticing. Weight what actually matters to you — zero is a real answer, meaning 'not part of this'. You can revise it later; people do.",
  game:
    "No victory condition ships with the run, so you set the objective — the usual failure is not losing, it is running somebody else's objective without noticing. Put weight where it matters; zero means 'not scored in this build'. Editable at act boundaries — respecs are allowed.",
};

export const LEANING_INTRO: Dual = {
  standard:
    "One temperament emphasis, for flavour only. It colours how choices are framed to you; it never gates an option or drives a recommendation.",
  game:
    "Pick one leaning. It's cosmetic-plus: it tints how options are described, but it never locks content or auto-suggests a move.",
};

export const HAND_INTRO: Dual = {
  standard:
    "Now the part you don't choose. The Birth RNG deals your starting conditions, one card at a time — the household, the people, the body, the place. Watch them land.",
  game:
    "Character creation, the honest half: the Birth RNG rolls your starting hand — household, family, body, environment — dealt one card at a time. These are the stats you didn't pick.",
};

/** The redraw button copy (§3.3, first line verbatim; extended after the first redraw). */
export const REDRAW_LINE_1 =
  "You can draw again here. Nobody gets this button on the other side of birth.";
export const REDRAW_LINE_EXTENDED =
  "You can draw again here. Nobody gets this button on the other side of birth. Most hands are never offered it at all.";

/* ---- Parse frame (§3.7) ---- */

export const PARSE_TITLE: Dual = {
  standard: "The run, read back",
  game: "Post-mortem — the whole run, parsed",
};

export const PARSE_INTRO: Dual = {
  standard:
    "A complete look back at the life you just moved through — not a verdict, not a total, not a comparison. Just what happened, what compounded, and where skill and luck each did their part.",
  game:
    "A full run analysis, not a scorecard. No total, no letter, no ranking against anyone. What was drawn, what was decided, what compounded — laid out so you can read your own run.",
};

/** Replay button copy (§3.7). */
/* ---- The closing frame (N-341): the book shuts, and the run returns ---- */

/**
 * N-341 (6.0 §3.9) — THE ARC CLOSES WHERE IT OPENED.
 *
 * The run currently ends in an analysis panel, which leaves the reader standing
 * in a report. The master brief's ending puts them back in the quiet nowhere the
 * prologue opened in — the same void, the same starlight, the same shelf of books
 * — with one of them now read. The symmetry is the whole of it: the return says
 * the run is over without the project having to declare what literally happens
 * after a life, which is not a thing this site knows or will pretend to.
 *
 * Vocabulary is deliberately the prologue's own, so the two ends of the arc are
 * recognisably one place. Dual-authored, which this file's header sanctions for
 * exactly three surfaces, of which the parse's frame text is one.
 */
export const PARSE_CLOSING: Dual = {
  standard:
    "The book shuts. You are back in the quiet nowhere it opened in — the same place to stand, the same shelf, one life read all the way through. Nothing is claimed about what comes after it; that was never what this was for.",
  game:
    "The run ends and the book closes. You are back on the loading screen you came in on: the void, some starlight, Earth still turning below. What happens after a run is not something this game has, or claims to know.",
};

export const PARSE_CLOSING_HOME = "Back to the entrance";
export const PARSE_CLOSING_PLAY = "Back to the play door";

export const REPLAY_NOTE = "Replays are the one thing this room has that life doesn't.";
export const NEW_HAND_DISANALOGY =
  "A new hand is the one move the real thing never offers: the same you, dealt a different start.";
