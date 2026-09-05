/**
 * The guided pressure reading (blueprint 3.0 §4) — the constrained rebuild of the
 * 2.0 board. Every input is ENUMERATED (chips + level selects); nothing is free
 * text the site interprets. The flow walks the binding-constraint check in order —
 * condition → slack → wall-or-door → still-want-it → conflict → only-then-resources
 * — and names WHICH row binds, never HOW BAD the reader has it. No severity is ever
 * aggregated into any composite, meter, score, or tier.
 *
 * Board safety clause (release blocker): crisis-domain selections short-circuit the
 * flow straight to the real page using the triage pattern — never rated, weighed,
 * or folded into a reading.
 *
 * N-268 (6.0 §5.5) generalises that clause: a favourable reading never overrides a
 * safety route, and every instrument that orders, ranks or reads checks the crisis
 * route before the ordering runs. The doctrine is stated in `content/exclusions.ts`;
 * C-8 asserts the order in the source of this board and of `/guidance`.
 *
 * N-430 (6.0 §3.10): the wider charter this clause belongs to — the owner's own
 * list of what an instrument of this kind must never do — is published as the
 * checklist "What these instruments must never do" on `/methodology`. The clause
 * above is the board's share of it; the checklist is where the whole thing is
 * readable, and it is what a new instrument is written against.
 */

import type { ContentStatus } from "./evidence.ts";

export type CrisisChip = { id: string; label: string; route: string };

/**
 * The crisis gate, shown first. Selecting any of these immediately short-circuits
 * to the real page — it is never a rateable input (§4 safety clause).
 */
export const CRISIS_CHIPS: CrisisChip[] = [
  {
    id: "being-hurt",
    label: "Someone is hurting me, or I'm afraid of someone",
    route: "/situations/being-hurt",
  },
  {
    id: "self-harm",
    label: "I'm thinking about ending my life or seriously hurting myself",
    route: "/threshold",
  },
  {
    id: "danger",
    label: "I'm in immediate danger right now",
    route: "/threshold",
  },
];

export type LevelOption = {
  value: string;
  label: string;
  binds?: boolean;
  /**
   * N-073 (6.0 §3.4) — BORDERLINE IS NOT UNKNOWN.
   *
   * "It depends on the context" is the most common true answer to a question
   * about a person, and most instruments have nowhere to put it: the reader is
   * forced to round to one side, and the reading is then built on the rounding.
   * A borderline answer is a real answer — it is simply NOT BINDING, which is a
   * different thing from an absent one, and the reading says so out loud rather
   * than quietly treating it as a "no".
   */
  borderline?: boolean;
};
export type Chip = { id: string; label: string; pointer?: string; binds?: boolean };

/**
 * N-064, N-066, N-075, N-411 (6.0 §3.4) — A PROCEDURE ATTACHED TO A STEP.
 *
 * The board has always asked good questions and never said how to answer one.
 * "Have you actually tested it?" is only useful to a reader who knows what
 * testing looks like; "are two things pulling against each other?" is only
 * useful to a reader who can tell the soluble kind from the chosen kind.
 *
 * This is help text inside the step's existing shape — NEVER A NEW INPUT.
 * Nothing here is answered, stored, counted or read back; it renders as a
 * pointer beside the question the reader is already looking at. `status` is
 * carried where the underlying claim is the site's own judgement rather than a
 * finding, and renders through the ordinary `StatusLabel`.
 */
export type StepHelp = {
  title: string;
  /** Ordered — the reader is told to stop at the first clear answer. */
  points: string[];
  /** The rule for using the list, or the caveat that must travel with it. */
  note?: string;
  /** A second paragraph where the point needs one; still no input. */
  warning?: string;
  /** `editorial` where the donor graded the claim as inference. */
  status?: ContentStatus;
};

export type ConstraintStep =
  | {
      id: string;
      question: string;
      hint?: string;
      help?: StepHelp;
      kind: "level";
      levels: LevelOption[];
      /** Where "something else / not listed" routes. */
      notListed?: { label: string; route: string };
    }
  | {
      id: string;
      question: string;
      hint?: string;
      help?: StepHelp;
      kind: "chips";
      chips: Chip[];
      notListed?: { label: string; route: string };
    };

/** The option every level step carries, in one place so it reads identically everywhere. */
export const BORDERLINE_OPTION: LevelOption = {
  value: "borderline",
  label: "Borderline — depends on the context",
  borderline: true,
};

/** What the reading says when a row came back borderline (N-073). */
export const BORDERLINE_READING_NOTE =
  "You marked at least one row borderline. That is an answer, and it is not a binding one: the reading below is written as though the row is still open, so treat it as provisional and worth re-reading on a different day.";

/**
 * The six steps, in binding-priority order. The reading names the FIRST step that
 * comes back "binding" — the classic error is working a later row while an earlier
 * one is the real constraint (money moves when the problem is exhaustion).
 */
export const CONSTRAINT_STEPS: ConstraintStep[] = [
  {
    id: "condition",
    question: "What shape are you actually in?",
    hint: "You are an unreliable witness about yourself; answer anyway. State comes before everything.",
    kind: "level",
    levels: [
      { value: "steady", label: "steady — not on fire" },
      { value: "stretched", label: "stretched — running low", binds: true },
      { value: "depleted", label: "depleted — nothing left in the tank", binds: true },
      BORDERLINE_OPTION,
    ],
    notListed: { label: "Something about my health I want to read about", route: "/topics/health" },
  },
  {
    id: "slack",
    question: "If a real shock hit this week, is there any margin?",
    hint: "Slack is the buffer — money, time, attention — that stops a shock becoming a cascade.",
    kind: "level",
    levels: [
      { value: "some", label: "yes — some buffer to absorb it" },
      { value: "thin", label: "barely — one bad week from trouble", binds: true },
      { value: "none", label: "no buffer at all", binds: true },
      BORDERLINE_OPTION,
    ],
    notListed: { label: "I want to read about building slack", route: "/topics/money" },
  },
  {
    id: "wall",
    question: "The thing that feels stuck — have you actually tested it?",
    hint: "Before pushing harder, find out whether it's a wall or a door you haven't found.",
    /*
     * N-064 — the board has asked this question since 3.0 and has never said
     * how to check. Four questions in order, and the instruction to stop at the
     * first clear answer, because the point of an ordered check is that most of
     * it does not have to be run.
     */
    help: {
      title: "How to check, in order — stop at the first clear answer",
      points: [
        "Has anyone starting roughly where you are got through this? If somebody has, it is a door with a price on it, and the useful question becomes what the price was.",
        "Is the block a rule or a habit? A rule has an author you can name and usually a written form you can read; a habit has neither, and is enforced only by everyone assuming it.",
        "What would it cost to test it once? If the honest answer is one email, one phone call, or one awkward question, the argument is already over — run the test instead of continuing it.",
        "Who benefits from your believing it is a wall? Sometimes nobody, which is also an answer; sometimes the person who told you it was one.",
      ],
      note: "Stop as soon as one of these gives you a clear answer. A check you run to the bottom every time is a check you will stop running.",
      warning:
        "The two ways to get this wrong cost different things. Calling a wall a door buys years of effort, self-blame and exhaustion. Calling a door a wall buys a smaller life, unclaimed entitlements and exits never attempted. Neither error is the safe one; they are simply expensive in different currencies, and knowing which way you personally lean is most of the correction.",
    },
    kind: "chips",
    chips: [
      { id: "tested-wall", label: "It's a genuine wall — I've checked", binds: true },
      { id: "not-checked", label: "I haven't actually checked yet", binds: true, pointer: "/guidance" },
      { id: "someone-elses", label: "It's someone else's choice to make, not mine" },
      { id: "nothing-stuck", label: "Nothing really feels stuck" },
    ],
    notListed: { label: "Help me lay out a stuck decision", route: "/guidance" },
  },
  {
    id: "want",
    question: "The goal you're working toward — do you still want it?",
    hint: "People chronically optimize the route to a destination they've quietly stopped wanting.",
    /*
     * N-075 — the whole of goal selection, compressed into one question a
     * depleted reader can actually run. It is asked, never answered here:
     * nothing on this page records or evaluates what you decide.
     *
     * N-411 — and the caveat that has to travel with "look at where your time
     * goes", because without it that advice is a way of blaming someone for
     * their constraints.
     */
    help: {
      title: "Two questions worth asking yourself here — neither is recorded",
      points: [
        "If you weren't already doing this, would you start it today? The goals kept alive by momentum and the goals kept alive by wanting them look identical from the inside, and this is the cheapest way to tell them apart.",
        "Where does your time actually go? Behaviour is evidence about what you value, and it is evidence rather than a verdict.",
      ],
      note: "Behaviour does not read values cleanly. Obligation, illness, addiction, money, care for someone else and simple lack of opportunity all override preference, and a person with no slack has almost no room in which a preference could show. Read the gap as information about your constraints at least as much as about your wants.",
      status: "editorial",
    },
    kind: "level",
    levels: [
      { value: "yes", label: "yes — clearly" },
      { value: "unsure", label: "not sure anymore", binds: true },
      { value: "no", label: "no, but I'm still chasing it", binds: true },
      BORDERLINE_OPTION,
    ],
    notListed: { label: "Help me weigh what I'm aiming at", route: "/guidance" },
  },
  {
    id: "conflict",
    question: "Are two things you're pursuing pulling against each other?",
    hint: "No plan resolves a genuine conflict of aims; you have to choose what the plan is for.",
    /*
     * N-066 — one of these is soluble and one is chosen, and treating the
     * second as the first is how a decade goes. Labelled editorial: the donor
     * graded the underlying claim as the authors' own inference, and that
     * grading carries over rather than being quietly upgraded here.
     */
    help: {
      title: "Two kinds of conflict, and only one of them is soluble",
      points: [
        "A scheduling conflict is a collision in the calendar. Both aims survive it, and the fix is sequencing, delegation, money, or a smaller version of one of them for a while.",
        "A horizon conflict is a collision in what the years are for. The two aims serve futures that cannot both be arrived at, and no calendar, budget or productivity system dissolves that — it is chosen, not solved.",
      ],
      note: "The diagnostic is short. Write both roles out. For each one, name in a single sentence the horizon it serves, with a timescale attached to it. Then ask whether both sentences could be true of the same life.",
      warning:
        "Most horizon conflicts arrive disguised as scheduling complaints, because a scheduling complaint is the socially acceptable form. If a year of better scheduling has not touched it, that is the tell.",
      status: "editorial",
    },
    kind: "chips",
    chips: [
      { id: "career-care", label: "A career arc vs. caring for someone", binds: true },
      { id: "health-income", label: "My own health vs. income", binds: true },
      { id: "autonomy-security", label: "Freedom vs. security", binds: true },
      { id: "here-there", label: "Being in two places at once", binds: true },
      { id: "no-conflict", label: "No real conflict right now" },
    ],
    notListed: { label: "Help me sort conflicting aims", route: "/guidance" },
  },
  {
    id: "resources",
    question: "What do you actually have to work with?",
    hint: "Only worth optimizing once the rows above are clear — this is where a concrete plan pays off.",
    kind: "chips",
    chips: [
      { id: "time", label: "time" },
      { id: "money", label: "some money" },
      { id: "people", label: "people who'd help" },
      { id: "energy", label: "energy" },
      { id: "skills", label: "skills that transfer" },
      { id: "standing", label: "standing / reputation" },
    ],
    notListed: { label: "Turn this into a real day", route: "/guidance/daily-plan" },
  },
];

/**
 * N-062 (6.0 §3.4) — THE MOVES THE CAMPAIGN GUARANTEES, SAID ON THE READING SIDE.
 *
 * The play layer guarantees rest, wait and ask in every half-year and tests that
 * guarantee across several hundred simulated runs. The reading layer has never
 * said it once. A person on this board at two in the morning is not going to
 * play a campaign, and is exactly the person who needs telling that waiting is a
 * move and asking is a strategy rather than a defeat.
 *
 * It is appended to the readings that point at moves, and rendered on the
 * guidance plan list and at the foot of the board's own prose.
 */
export const MOVES_LINE =
  "Asking, waiting, and accepting are moves too — they are on the list of things you can do here, not what is left when the list runs out.";

/** The authored reading for each binding row — names the constraint + a concrete pointer. */
export type ReadingResult = { rowId: string; heading: string; body: string; pointer: string; pointerLabel: string };

export const READINGS: Record<string, ReadingResult> = {
  condition: {
    rowId: "condition",
    heading: "Your state is the binding constraint.",
    body: "This is the one people work last and should work first. When the tank is empty, effort and money and planning all underperform. Rest and repair are not a reward for fixing everything else — they're the thing that makes fixing anything else possible.",
    pointer: "/topics/health",
    pointerLabel: "Health as the capacity that gates everything",
  },
  slack: {
    rowId: "slack",
    heading: "Your buffer is the binding constraint.",
    body: "With no margin, every other move is one bad week from being undone. Before any bigger optimization, build a little slack — even a small, boring, automatic buffer changes what a shock can do to you.",
    pointer: "/topics/money",
    pointerLabel: "Slack, in the money guide",
  },
  wall: {
    rowId: "wall",
    heading: "You're pushing on a wall — or one you haven't tested.",
    body: `If it's a genuine, tested wall, more force is the wrong tool; the move is a different route, or accepting what won't move and grieving it honestly. If you haven't actually checked, the cheapest next step is to find out whether it's a wall or a door you simply haven't found. ${MOVES_LINE}`,
    pointer: "/guidance",
    pointerLabel: "Lay the decision out",
  },
  want: {
    rowId: "want",
    heading: "The goal itself is the binding constraint.",
    body: "You're routing hard toward something you're no longer sure you hold. Optimizing the path to a place you don't want to arrive is the most common quiet waste there is. Check the destination before you plan the route.",
    pointer: "/guidance",
    pointerLabel: "Weigh what you're actually aiming at",
  },
  conflict: {
    rowId: "conflict",
    heading: "A conflict of aims is the binding constraint.",
    body: `Two things you want are pulling against each other, and no schedule or budget dissolves that. This isn't a planning problem; it's a choosing problem. Name what the plan is for, and let the other aim cost what it costs — with eyes open. ${MOVES_LINE}`,
    pointer: "/guidance",
    pointerLabel: "Sort the conflicting aims",
  },
  resources: {
    rowId: "resources",
    heading: "Resources are genuinely the lever now.",
    body: `Your state holds, there's some buffer, the walls are tested, you still want the goal, and nothing's in deep conflict. That's exactly the situation where a concrete plan pays off — this is the time to optimize, not before. ${MOVES_LINE}`,
    pointer: "/guidance/daily-plan",
    pointerLabel: "Turn it into a real day",
  },
};

/**
 * Every reading string, for the S-5 no-score lint. The step help blocks
 * (N-064, N-066, N-075, N-411) are included: they are authored board prose and
 * there is no reason for the no-score wall to stop at the reading.
 */
export const ALL_READING_STRINGS: string[] = [
  ...Object.values(READINGS).flatMap((r) => [r.heading, r.body, r.pointerLabel]),
  ...CONSTRAINT_STEPS.flatMap((s) =>
    s.help ? [s.help.title, ...s.help.points, s.help.note ?? "", s.help.warning ?? ""] : [],
  ).filter(Boolean),
  BORDERLINE_READING_NOTE,
];

export type BoardSelections = {
  /** level value per level-step id. */
  levels: Record<string, string>;
  /** selected chip ids per chip-step id. */
  chips: Record<string, string[]>;
  /**
   * N-072 (6.0 §3.4, C-36) — READER DISAGREEMENT AS A FIRST-CLASS STATE.
   *
   * The row ids of readings the reader has said do not fit them. This lives
   * INSIDE the existing `tgtl:board` value — §7.1 forbids a new storage key —
   * and it is the only thing on this site that records a judgement about a
   * reading. It records nothing about the reader: it changes presentation, not
   * the underlying fixture, and a rejected reading renders struck and
   * unweighted rather than disappearing, so the reader can see what they turned
   * down and take it back.
   *
   * Giving somebody a button that says the site is wrong about them is the
   * cheapest guard there is against the site's authority hardening into a
   * verdict.
   */
  rejected?: string[];
};

/** Which level rows came back borderline (N-073). Order follows the step order. */
export function borderlineRows(sel: BoardSelections): string[] {
  const out: string[] = [];
  for (const step of CONSTRAINT_STEPS) {
    if (step.kind !== "level") continue;
    const chosen = sel.levels[step.id];
    if (step.levels.find((l) => l.value === chosen)?.borderline) out.push(step.id);
  }
  return out;
}

/** True when the reader has said this reading does not fit them (N-072). */
export function isRejected(sel: BoardSelections, rowId: string): boolean {
  return (sel.rejected ?? []).includes(rowId);
}

/**
 * Name which row binds — the FIRST step, in priority order, that comes back
 * binding (§4). Never a score or a composite: this returns exactly one row, or
 * null when there isn't yet enough to read. Deterministic over enumerated inputs.
 */
export function computeReading(sel: BoardSelections): ReadingResult | null {
  const answeredCondition = Boolean(sel.levels.condition);
  const answeredSlack = Boolean(sel.levels.slack);
  if (!answeredCondition && !answeredSlack) return null; // not enough to say anything honest

  for (const step of CONSTRAINT_STEPS) {
    if (step.kind === "level") {
      const chosen = sel.levels[step.id];
      const opt = step.levels.find((l) => l.value === chosen);
      // N-073: a borderline answer never binds. It is not rounded down to "no";
      // the row simply stays open and the reading says so.
      if (opt?.borderline) continue;
      if (opt?.binds) return READINGS[step.id];
    } else {
      const chosen = sel.chips[step.id] ?? [];
      const binds = step.chips.some((c) => c.binds && chosen.includes(c.id));
      if (binds && step.id !== "resources") return READINGS[step.id];
    }
  }
  return READINGS.resources; // nothing earlier binds — resources are the lever
}
