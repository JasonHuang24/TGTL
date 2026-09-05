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

export type LevelOption = { value: string; label: string; binds?: boolean };
export type Chip = { id: string; label: string; pointer?: string; binds?: boolean };

export type ConstraintStep =
  | {
      id: string;
      question: string;
      hint?: string;
      kind: "level";
      levels: LevelOption[];
      /** Where "something else / not listed" routes. */
      notListed?: { label: string; route: string };
    }
  | {
      id: string;
      question: string;
      hint?: string;
      kind: "chips";
      chips: Chip[];
      notListed?: { label: string; route: string };
    };

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
    ],
    notListed: { label: "I want to read about building slack", route: "/topics/money" },
  },
  {
    id: "wall",
    question: "The thing that feels stuck — have you actually tested it?",
    hint: "Before pushing harder, find out whether it's a wall or a door you haven't found.",
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
    kind: "level",
    levels: [
      { value: "yes", label: "yes — clearly" },
      { value: "unsure", label: "not sure anymore", binds: true },
      { value: "no", label: "no, but I'm still chasing it", binds: true },
    ],
    notListed: { label: "Help me weigh what I'm aiming at", route: "/guidance" },
  },
  {
    id: "conflict",
    question: "Are two things you're pursuing pulling against each other?",
    hint: "No plan resolves a genuine conflict of aims; you have to choose what the plan is for.",
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
    body: "If it's a genuine, tested wall, more force is the wrong tool; the move is a different route, or accepting what won't move and grieving it honestly. If you haven't actually checked, the cheapest next step is to find out whether it's a wall or a door you simply haven't found.",
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
    body: "Two things you want are pulling against each other, and no schedule or budget dissolves that. This isn't a planning problem; it's a choosing problem. Name what the plan is for, and let the other aim cost what it costs — with eyes open.",
    pointer: "/guidance",
    pointerLabel: "Sort the conflicting aims",
  },
  resources: {
    rowId: "resources",
    heading: "Resources are genuinely the lever now.",
    body: "Your state holds, there's some buffer, the walls are tested, you still want the goal, and nothing's in deep conflict. That's exactly the situation where a concrete plan pays off — this is the time to optimize, not before.",
    pointer: "/guidance/daily-plan",
    pointerLabel: "Turn it into a real day",
  },
};

/** Every reading string, for the S-5 no-score lint. */
export const ALL_READING_STRINGS: string[] = Object.values(READINGS).flatMap((r) => [r.heading, r.body, r.pointerLabel]);

export type BoardSelections = {
  /** level value per level-step id. */
  levels: Record<string, string>;
  /** selected chip ids per chip-step id. */
  chips: Record<string, string[]>;
};

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
      if (opt?.binds) return READINGS[step.id];
    } else {
      const chosen = sel.chips[step.id] ?? [];
      const binds = step.chips.some((c) => c.binds && chosen.includes(c.id));
      if (binds && step.id !== "resources") return READINGS[step.id];
    }
  }
  return READINGS.resources; // nothing earlier binds — resources are the lever
}
