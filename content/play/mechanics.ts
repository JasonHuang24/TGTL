/**
 * The seven mechanic cards (blueprint 3.0 §5, the single source of truth). Each is
 * a one-screen door to its deep home (G-06: the topic page stays the single home).
 * A decision card's `mechanicLink` and the "why this happened" control both target
 * these; the walkthrough's "Playing well" tier indexes them.
 *
 * "The experiment" (adolescence's identity-with-a-floor lesson) is taught in-beat
 * and links the position card — not a separate card. Seven cards, within budget.
 */

export type MechanicCard = {
  id: string;
  /** The canonical visualization to render (§5). */
  viz: "strip" | "buffer" | "curves" | "twohands" | "reroute" | "marks" | "rulers";
  standardTitle: string;
  gameTitle: string;
  /** One paragraph — prose confirms what the eye already got (show-don't-tell budget). */
  paragraph: string;
  /** The deep home page (G-06). */
  deepHome: string;
  deepHomeLabel: string;
};

export const MECHANICS: Record<string, MechanicCard> = {
  variance: {
    id: "variance",
    viz: "strip",
    standardTitle: "Skill sets the range; luck draws from it",
    gameTitle: "Variance",
    paragraph:
      "A sound move doesn't buy a good outcome — it buys a better spread of outcomes. You place the range; the draw lands somewhere inside it. A good decision can still land badly, and a bad one can still land well, which is exactly why you can't read the decision back from the result.",
    deepHome: "/situations/job-loss",
    deepHomeLabel: "See it in a real job loss",
  },
  slack: {
    id: "slack",
    viz: "buffer",
    standardTitle: "Slack is what stops a shock becoming a cascade",
    gameTitle: "Slack (the buffer)",
    paragraph:
      "The same shock lands twice: on a buffer, it's an inconvenience; on none, it's a scramble that knocks over everything downstream. Slack is the margin — money, time, attention — that absorbs the hit. Its payoff is a thing that doesn't happen, which is why it's the resource people can least perceive the value of.",
    deepHome: "/topics/money",
    deepHomeLabel: "Slack, in the money guide",
  },
  compounding: {
    id: "compounding",
    viz: "curves",
    standardTitle: "Small early choices bend a curve for years",
    gameTitle: "Compounding",
    paragraph:
      "A small, boring, repeated choice barely registers up close and quietly bends a whole curve across the acts — upward when you tend it, downward when you don't. Debt and neglect run the same math in reverse. The lever feels tiny because you're standing at the near end of it.",
    deepHome: "/topics/money",
    deepHomeLabel: "Compounding, in the money guide",
  },
  position: {
    id: "position",
    viz: "twohands",
    standardTitle: "The same move costs differently from a different start",
    gameTitle: "Position",
    paragraph:
      "Take the identical option and deal it two different hands. With a floor beneath failure, it's a bounded experiment; without one, the same move carries a ruin tail. The chips re-resolve. Most of what looks like a difference in choices is a difference in the positions the choices were made from.",
    deepHome: "/map/credential-decision",
    deepHomeLabel: "The position filter, on the credential fork",
  },
  recovery: {
    id: "recovery",
    viz: "reroute",
    standardTitle: "There's a route back beside almost every failure",
    gameTitle: "Recovery routes",
    paragraph:
      "A path greys out, and a different one draws itself in. A failure closes a specific door, not the map. Where there genuinely is no good move, the route that remains is how to endure it and who can hold you — and naming that honestly is a recovery too, not a false promise that everything is fixable.",
    deepHome: "/situations/job-loss",
    deepHomeLabel: "Recovery routes, after a job loss",
  },
  party: {
    id: "party",
    viz: "marks",
    standardTitle: "The people around you carry load and give it back",
    gameTitle: "The party",
    paragraph:
      "Bonds are marks with a quality, built slowly and spent fast. Load flows toward you and away; help asked for early is cheap and help asked for late is dear. No one you meet is a background character — each is running a full run of their own in which you are a minor part of theirs.",
    deepHome: "/topics/relationships",
    deepHomeLabel: "The party, in the relationships guide",
  },
  readout: {
    id: "readout",
    viz: "rulers",
    standardTitle: "A mark measures one narrow thing, not you",
    gameTitle: "The readout",
    paragraph:
      "Two rulers laid against the same child: one measures what was learned, the other sorts the room. They're easy to confuse because they use the same numbers. Knowing what a readout does and doesn't actually see is worth more than the readout — and it keeps a bad mark from becoming a story about you.",
    deepHome: "/topics/work",
    deepHomeLabel: "Signals and sorting, in the work guide",
  },
};

export const ALL_MECHANICS: MechanicCard[] = Object.values(MECHANICS);
