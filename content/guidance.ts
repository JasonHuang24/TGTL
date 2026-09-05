/**
 * Guidance walkthrough fixtures (blueprint §6.5). Plan A/B/C are meaningfully
 * different AUTHORED alternatives (Pareto trade-offs), never a hidden universal
 * score. Every output is illustrative pending research (G-10); NO bare
 * percentages — qualitative bands only. The no-recommendation state is a
 * complete output that names what would change the answer.
 */

export type Availability = "available" | "conditional" | "unlockable" | "unknown";

export type Plan = {
  id: string;
  kind: "Plan A" | "Plan B" | "Plan C" | "Experiment" | "Unlock path";
  title: string;
  favors: string;
  availability: Availability;
  summary: string;
  rankReason: string;
  reorder: string;
  benefits: string[];
  costs: string[];
  variance: string;
  reversibility: string;
  pivotTriggers: string[];
  exitConditions: string[];
  recovery: string;
};

export const PLANS: Plan[] = [
  {
    id: "plan-a",
    kind: "Plan A",
    title: "A bounded pilot",
    favors: "learning and optionality",
    availability: "available",
    summary:
      "Run a small, time-boxed version of the direction you're drawn to, alongside what currently pays, with a fixed end date and a decision you'll make at it.",
    rankReason:
      "It ranks highest when you weight learning and optionality and you have at least a little slack, because it buys information about the biggest uncertainty at the lowest irreversible cost.",
    reorder:
      "A verified gate that requires a credential first, or the loss of your current income floor, would move this below the steadier options.",
    benefits: ["Resolves the largest unknown cheaply", "Keeps the current floor intact", "Forecloses almost nothing"],
    costs: [
      "Time and attention, split across two things",
      "The invisible cost of performing certainty you don't yet have",
      "Some relationship credit, if others carry more while you pilot",
    ],
    variance: "Low downside, capped upside — it is a way to learn, not yet a way to arrive.",
    reversibility: "High. Designed to be walked back at the end date with little lost but the time.",
    pivotTriggers: ["The pilot clearly works — scale it", "It clearly doesn't — you've bought a real answer, cheaply"],
    exitConditions: ["The fixed end date arrives", "The floor it sits on is threatened"],
    recovery: "If it fails, you return to the current base with better information and no new debt.",
  },
  {
    id: "plan-b",
    kind: "Plan B",
    title: "Expand from where you stand",
    favors: "stability and transfer",
    availability: "conditional",
    summary:
      "Grow the new direction inside your current situation — a stretch project, an internal move, a role that bridges — so your standing and income carry over rather than resetting.",
    rankReason:
      "It ranks highest when you weight stability and cannot afford a reset, because it moves without spending the standing you've built.",
    reorder:
      "It depends on a real opening existing where you are; if none does, it drops, and the pilot or a hold moves up.",
    benefits: ["Standing and income transfer", "Lower variance than a clean break", "Builds evidence for a bigger move later"],
    costs: ["Slower", "Bounded by what your current setting will allow", "Can quietly become a reason never to leave"],
    variance: "Modest in both directions. The steady path, with the steady path's ceiling.",
    reversibility: "Moderate. Easy to pause; the sunk time gradually converts into identity.",
    pivotTriggers: ["The internal opening closes", "The stretch reveals the direction isn't yours after all"],
    exitConditions: ["No genuine opening materialises within the horizon you set"],
    recovery: "You keep the standing you started with; little is lost but the wait.",
  },
  {
    id: "plan-c",
    kind: "Plan C",
    title: "Hold, and protect recovery capacity",
    favors: "sustainability and reversibility",
    availability: "available",
    summary:
      "Deliberately don't move yet. Stabilise the floor, restore the buffer, and keep every option open until you have the capacity to run one well.",
    rankReason:
      "It ranks highest when your health or energy is limited, or your slack is near zero, because every other move needs capacity you don't currently have, and a move made without it tends to get undone.",
    reorder:
      "As capacity and buffer return, this falls back below the active options — holding is a phase, not a destination.",
    benefits: ["Rebuilds the buffer every other move depends on", "Prevents a forced move at your worst prices", "Costs nothing irreversible"],
    costs: ["The felt cost of not acting while others seem to", "A real risk of holding past the point where it's protective"],
    variance: "Lowest of all — it is the option that refuses to draw from the distribution yet.",
    reversibility: "Total. Nothing is committed.",
    pivotTriggers: ["The buffer is restored", "A time-limited opening appears that's worth spending capacity on"],
    exitConditions: ["Holding has become avoidance rather than recovery — a check worth putting in the calendar"],
    recovery: "Not applicable — this is itself the recovery move for a depleted position.",
  },
  {
    id: "experiment",
    kind: "Experiment",
    title: "A three-conversation reality check",
    favors: "resolving the biggest uncertainty",
    availability: "available",
    summary:
      "Before committing to any of the above, have three honest conversations with people actually doing the thing you're considering — the smallest reversible step that resolves the largest unknown.",
    rankReason: "It's almost always worth doing first, because it's the cheapest way to find out whether your picture of the destination is accurate.",
    reorder: "Nothing reorders this; it sits before the others rather than competing with them.",
    benefits: ["Tiny cost", "Replaces imagined detail with real detail", "Often changes which plan you want"],
    costs: ["A few awkward asks", "The risk of learning the thing isn't what you hoped"],
    variance: "None to speak of.",
    reversibility: "Complete.",
    pivotTriggers: ["What you learn contradicts your assumptions"],
    exitConditions: ["You've had the conversations"],
    recovery: "Not needed.",
  },
  {
    id: "unlock",
    kind: "Unlock path",
    title: "Verify one gate before investing",
    favors: "not paying for a prerequisite that isn't real",
    availability: "unlockable",
    summary:
      "A stronger option may be currently locked behind a specific requirement you're assuming. Verify whether the gate is real before you invest in clearing it — an assumed prerequisite that turns out to be optional can reorder everything.",
    rankReason: "It does not compete with the plans; it can reorder all of them, by turning a wall you assumed into a door you can name.",
    reorder: "Finding the gate is real keeps the current ranking; finding it isn't may promote a locked option to the top.",
    benefits: ["Prevents an assumed prerequisite from silently becoming a command", "Cheap to check", "Can unlock a better option than any listed"],
    costs: ["The effort of finding who actually holds the answer"],
    variance: "Asymmetric in your favour — small cost, potentially large reordering.",
    reversibility: "Complete.",
    pivotTriggers: ["The gate turns out to be softer than assumed"],
    exitConditions: ["You have a definite answer on the requirement"],
    recovery: "Not needed.",
  },
];

/**
 * N-036 (6.0 §3.3) — A NAMED PLAN SHAPE, not a plan.
 *
 * "Waiting on somebody else's decision" is not one of the ranked options: it is
 * not chosen, it competes with nothing, and ranking it against a bounded pilot
 * would be a category error. It is a SHAPE the situation has, and the shape
 * carries its own short list of moves. It renders as a note under the plans, and
 * the full version — including the four things that reliably do not work — is a
 * section on /situations, which is the single home for it (G-06).
 */
export const WAITING_SHAPE = {
  id: "waiting",
  title: "If you are waiting on someone else's decision",
  body:
    "None of the options above quite fits a stretch where the thing that decides it is being decided by somebody who is not you. That is a shape rather than a choice, and it has its own moves: find the real timescale from someone who knows, do the work neither answer would undo, prepare the worse answer once in writing and then stop, and set a date on which you chase or act as though the answer were no.",
  note:
    "Waiting is not free time; it is time with a background process running, which is why these stretches are exhausting despite looking idle.",
  href: "/situations#waiting-on-a-slow-decider",
  linkLabel: "The whole shape, including the four things that reliably do not work",
} as const;

export const OBJECTIVES = [
  { id: "stability", label: "Stability", note: "a floor you can count on" },
  { id: "autonomy", label: "Autonomy", note: "control over your own time and direction" },
  { id: "craft", label: "Craft", note: "getting genuinely good at something" },
  { id: "service", label: "Service", note: "the work meaning something beyond you" },
];

export const VETOES = [
  { id: "no-debt", label: "No new high debt" },
  { id: "no-relocation", label: "No relocation" },
  { id: "no-long-credential", label: "No long credential before testing fit" },
];

/** The complete no-recommendation state (§6.5). Names what would change the answer. */
export const NO_RECOMMENDATION = {
  title: "No recommendation yet — and that is a complete answer",
  body: "Withholding a ranking is the finished output when the variables that would decide it are still unknown. Inventing a ranking here would be less honest, not more helpful.",
  whatWouldChange: [
    "At least one objective weighted above zero, so there is something to optimise for.",
    "Your health and energy, even roughly — because a limited capacity changes which plan is even runnable.",
    "Whether you have any slack at all, because most active moves need some to execute.",
  ],
  reflective: [
    "If you could only protect one thing this year, which would it be?",
    "Which of the options are you avoiding because of how they'd feel, rather than what they'd cost?",
    "What is the smallest thing you could do this week that would tell you the most?",
  ],
};
