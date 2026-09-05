/**
 * THE SIMULATION CONTRACT v2 (blueprint 4.0 §7) — types only, no logic.
 *
 * One engine, three modes (§3.1). Everything the sandbox does is expressed here:
 * the state vector (§7.1), the record schemas (§7.2), the budget economy (§7.5),
 * the season resolution order (§7.6), the consequence queue (§3.5), the beat
 * schedule channel (§5.1), attribution (§3.10), forks and named saves (§3.8).
 *
 * Two containment rules are enforced by the TYPES, not only by lint:
 *
 *   1. A loss-tier beat is NOT an Event and NOT a queue entry. `EventTrigger`
 *      has no beat arm and `QueueEntry` has no beat arm, so a beat cannot be
 *      reached through either — it lives on `BeatPlacement`, its own channel.
 *   2. Nothing in this file carries a difficulty composite. `ConstraintProfile`
 *      is a per-axis record with no total, and its internal hardness numbers sit
 *      on a field that renders nowhere (S-8 asserts this).
 */

import type { GaugeKey, OutcomeBandName, Spread, Reversibility } from "@/content/bands";

/* =========================================================================
   Versioning (§2.4)
   ========================================================================= */

export const SIM_SCHEMA_VERSION = 2 as const;
export const ENGINE_VERSION = "4.0.0";
export const CONTENT_VERSION = "launch-window-2025.1";

/* =========================================================================
   Evidence labels (§6, spec §9.3 — all six)
   ========================================================================= */

export const EVIDENCE_LABELS = [
  "calibrated",
  "evidence-informed",
  "illustrative",
  "speculative",
  "contested",
  "insufficient-evidence",
] as const;
export type EvidenceLabel = (typeof EVIDENCE_LABELS)[number];

/**
 * `calibrated` is RESERVED: defined so the vocabulary is complete, and unused
 * until the deferred research-calibration pass exists to earn it. Authoring that
 * claims it is a gate failure (S-3), not a judgement call.
 */
export const RESERVED_EVIDENCE_LABELS: EvidenceLabel[] = ["calibrated"];

export const EVIDENCE_MEANING: Record<EvidenceLabel, string> = {
  calibrated: "supported by data for this population and period (reserved: nothing claims it yet)",
  "evidence-informed": "the direction is supported; the exact game value is an abstraction",
  illustrative: "here to teach a tradeoff, not to estimate anything real",
  speculative: "a plausible mechanic, not a finding",
  contested: "credible readings of the evidence disagree",
  "insufficient-evidence": "not enough to quantify — so it is not quantified",
};

/* =========================================================================
   The nine card-face families (§7.2) — the single enumerated value set for
   Action.family and Event.family, and the unit every "families" count uses.
   ========================================================================= */

export const CARD_FAMILIES = [
  "home",
  "school",
  "threshold",
  "work",
  "money",
  "people",
  "health",
  "civic",
  "inner",
] as const;
export type CardFamily = (typeof CARD_FAMILIES)[number];

export const FAMILY_LABEL: Record<CardFamily, string> = {
  home: "home",
  school: "learning",
  threshold: "thresholds",
  work: "work",
  money: "money",
  people: "people",
  health: "body & capacity",
  civic: "institutions",
  inner: "inner life",
};

/* =========================================================================
   Capabilities (§7.1, spec §6.1) — slow qualitative bands, surfaced only when
   relevant. Never a score, never a moral reading, never a diagnosis.
   ========================================================================= */

export const CAPABILITY_KEYS = [
  "vitality",
  "learning",
  "execution",
  "regulation",
  "socialNavigation",
  "adaptability",
] as const;
export type CapabilityKey = (typeof CAPABILITY_KEYS)[number];

export const CAPABILITY_LABEL: Record<CapabilityKey, string> = {
  vitality: "vitality",
  learning: "learning",
  execution: "follow-through",
  regulation: "steadiness",
  socialNavigation: "reading people",
  adaptability: "adaptability",
};

export const CAPABILITY_MEANING: Record<CapabilityKey, string> = {
  vitality: "the usable energy a week actually contains",
  learning: "how readily new material goes in and stays",
  execution: "whether a plan survives contact with a Tuesday",
  regulation: "what it costs to stay level when something lands",
  socialNavigation: "reading a room, and repairing it afterwards",
  adaptability: "how fast a strategy changes when the facts do",
};

/* =========================================================================
   The priority set (§3.6, spec §7) — ten, qualitatively weighted, zero valid,
   no total, revisable as adaptation. There is nowhere for one to "go".
   ========================================================================= */

export const PRIORITY_KEYS = [
  "safety",
  "health",
  "closeness",
  "autonomy",
  "mastery",
  "wealth",
  "service",
  "creativity",
  "recognition",
  "meaning",
] as const;
export type PriorityKey = (typeof PRIORITY_KEYS)[number];

export const PRIORITY_LABEL: Record<PriorityKey, string> = {
  safety: "safety & stability",
  health: "health & energy",
  closeness: "close relationships & family",
  autonomy: "autonomy & flexibility",
  mastery: "mastery & achievement",
  wealth: "wealth & material comfort",
  service: "service & contribution",
  creativity: "creativity & expression",
  recognition: "recognition",
  meaning: "meaning & peace",
};

export const PRIORITY_NOTE: Record<PriorityKey, string> = {
  safety: "a floor that holds when something goes wrong",
  health: "a body and a mind you can still spend from next year",
  closeness: "people who know you and would come if you called",
  autonomy: "your hours and your choices being genuinely yours",
  mastery: "becoming properly good at a difficult thing",
  wealth: "room, comfort, and the freedom money buys",
  service: "leaving people and places better than you found them",
  creativity: "making things that did not exist before",
  recognition: "being seen and credited for what you do",
  meaning: "a life that makes sense from the inside, and is quiet enough to hear",
};

/** Qualitative weight, zero valid (§3.6). Never summed, never totalled. */
export type PrioritySet = Record<PriorityKey, number>;
export const PRIORITY_WEIGHT_MAX = 3;

/* =========================================================================
   The constraint profile (§2.3.1) — REPLACES the 3.0 difficulty tier.
   Per-axis only. No composite, no summary line, no roll-up, no hardness order.
   ========================================================================= */

/** The four axes, in FIXED presentation order — never sorted by hardness. */
export const PROFILE_AXES = ["money", "backing", "body", "place"] as const;
export type ProfileAxis = (typeof PROFILE_AXES)[number];

export const PROFILE_AXIS_LABEL: Record<ProfileAxis, string> = {
  money: "money",
  backing: "backing",
  body: "body",
  place: "place",
};

/** What each axis MEANS, framed as environmental cost — never a bodily grade. */
export const PROFILE_AXIS_MEANING: Record<ProfileAxis, string> = {
  money: "what it costs this start to get money into a month",
  backing: "what it costs this start to have someone in your corner",
  body: "what it costs this start to keep your capacity available to spend",
  place: "what it costs this start to be where the openings are",
};

/**
 * The enumerated cost vocabulary. Environmental cost language ONLY: it says what
 * a thing costs from here, never what the character is worth or how hard their
 * life scores. There is deliberately no ordering exposed to any surface.
 */
export const PROFILE_COST_BANDS = ["comes cheap", "costs the usual", "costs extra", "costs a great deal"] as const;
export type ProfileCostBand = (typeof PROFILE_COST_BANDS)[number];

export type ConstraintProfile = {
  /** Per-axis cost band. There is no composite field, and never will be. */
  axes: Record<ProfileAxis, ProfileCostBand>;
  /**
   * Internal hardness per axis (0..3), kept ONLY for content conditioning —
   * seasonBands, pool weighting, fleet sampling. It appears in NO rendered
   * string on ANY surface; S-8 asserts that by grepping the render layer.
   */
  internalHardness: Record<ProfileAxis, number>;
};

/* =========================================================================
   Effects (§7.2, extended from 3.0's object)
   ========================================================================= */

export type RelationshipDelta = {
  id: string;
  label?: string;
  /** Quality step: +1 deepens, -1 strains. */
  quality: number;
};

export type CompanionStateDelta = {
  arcId: string;
  /** Advance/retreat the arc's stage pointer. */
  stageDelta?: number;
  /** Record neglect or repair, which entry conditions read. */
  neglect?: number;
  repair?: number;
  /** The person leaves. People in this game can refuse and leave (§3.7). */
  exit?: boolean;
};

export type Effects = {
  gauge?: Partial<Record<GaugeKey, number>>;
  capability?: Partial<Record<CapabilityKey, number>>;
  skills?: string[];
  relationships?: RelationshipDelta[];
  companions?: CompanionStateDelta[];
  conditionsSet?: string[];
  conditionsClear?: string[];
  flagsSet?: string[];
  flagsClear?: string[];
  /** Delayed effects entering the consequence queue (§3.5). */
  queue?: QueueInsertion[];
  /** Maintenance debt step (§5.3): ordinary physics, never melodrama. */
  maintenanceDebt?: number;
};

/* =========================================================================
   Attribution (§3.10) — categories + the computability rule.
   Every band-width modifier and every effect source declares its category, so
   the rendered split is COMPUTED from tagged components, never narrated.
   ========================================================================= */

export const ATTRIBUTION_CATEGORIES = [
  "choice",
  "startingConditions",
  "accumulatedState",
  "otherPeople",
  "systems",
  "draw",
] as const;
export type AttributionCategory = (typeof ATTRIBUTION_CATEGORIES)[number];

export const ATTRIBUTION_LABEL: Record<AttributionCategory, string> = {
  choice: "your choice",
  startingConditions: "your starting conditions",
  accumulatedState: "your accumulated state",
  otherPeople: "other people's decisions",
  systems: "systems and institutions",
  draw: "the draw",
};

/** One tagged, signed contribution to a resolution. Only nonzero ones render. */
export type AttributionComponent = {
  category: AttributionCategory;
  /** Signed magnitude. Sign is direction, not merit. */
  weight: number;
  /** Plain phrase naming the specific source, e.g. "the credential you hold". */
  note: string;
};

/* =========================================================================
   The resolution atom (§3.1) — option → band draw → typed effects
   ========================================================================= */

export type Band = {
  name: OutcomeBandName;
  weight: number;
  failure?: boolean;
  outcome: {
    /** ≤ 40-word consequence line, edition-neutral. */
    line: string;
    effects: Effects;
  };
};

export type OptionFlag = "recovery" | "endurance" | "floor";

/**
 * Which state a band-width modifier reads, and — LITERAL per §3.10 — which
 * attribution category that modifier belongs to. The classification rule is
 * fixed in lib/sim/attribution.ts; this is where content declares its inputs.
 */
export type Sensitivity = {
  /** A high value of this gauge widens the better bands. → accumulatedState */
  gauge?: GaugeKey;
  /** A high value of this capability widens the better bands. → accumulatedState */
  capability?: CapabilityKey;
  /** Holding this skill widens the better bands. → accumulatedState */
  skill?: string;
  /** Hand-derived / preset constraint flags that narrow them. → startingConditions */
  constraintFlags?: string[];
  /** Companion-derived flags that narrow or widen them. → otherPeople */
  companionFlags?: string[];
  /** Systemic flags (institution, market, policy). → systems */
  systemicFlags?: string[];
  /** Reshape strength 0..1 (default 0.5). */
  strength?: number;
};

export type PositionNote = { when: string; text: string };

export type SimOption = {
  id: string;
  label: string;
  chips: {
    costs: string[];
    variance: Spread;
    reversibility: Reversibility;
    positionNotes?: PositionNote[];
  };
  flags?: OptionFlag[];
  /** Required when flags include "endurance": the real support route it names. */
  supportLink?: string;
  sensitivity?: Sensitivity;
  bands: Band[];
};

/* =========================================================================
   The budget economy (§7.5) — flow, distinct from the gauge stocks
   ========================================================================= */

export const BUDGET_CURRENCIES = ["timeStructure", "energy", "money"] as const;
export type BudgetCurrency = (typeof BUDGET_CURRENCIES)[number];

export const BUDGET_LABEL: Record<BudgetCurrency, string> = {
  timeStructure: "time",
  energy: "energy",
  money: "money",
};

export const BUDGET_MEANING: Record<BudgetCurrency, string> = {
  timeStructure: "the hours this season is actually free to direct",
  energy: "what your capacity will let you spend before something gives",
  money: "what you can put into the season without breaking the floor",
};

/** Integer pips per currency, re-derived fresh each season (§7.5). */
export type Budget = Record<BudgetCurrency, number>;

/** Costs are small integers, 1–3 pips per currency. Absent = zero. */
export type ActionCost = Partial<Record<BudgetCurrency, number>>;

/* =========================================================================
   Action + Event (§7.2)
   ========================================================================= */

/**
 * Inclusive ranges of the 24 seasons in which a record may appear. Availability
 * windows and nothing else — never a probability, never a schedule.
 */
export type SeasonBands = [number, number][];

/** Per-band pools of alternative outcome lines (§3.4b, the monotony guard). */
export type OutcomeVariants = Partial<Record<OutcomeBandName, string[]>>;

export type ActionContract = {
  costs: ActionCost;
  prerequisites?: {
    skills?: string[];
    flags?: string[];
    notFlags?: string[];
    minGauge?: Partial<Record<GaugeKey, number>>;
    minCapability?: Partial<Record<CapabilityKey, number>>;
  };
  reversibility: Reversibility;
  /** What it costs to walk this back later (spec §12 / §2.3.8). */
  switchingCost?: string;
  variance: Spread;
  opportunityNote?: string;
  evidenceLabel: EvidenceLabel;
};

export type DelayedEffect = {
  id: string;
  label: string;
  effects: Effects;
  due: { seasons: number } | { condition: string; withinSeasons: number };
  /** Which band(s) of this action trigger it. */
  onBands?: OutcomeBandName[];
};

export type SimAction = {
  id: string;
  family: CardFamily;
  domains: string[];
  label: string;
  /** Second-person situation text, ≤ 60 words, edition-neutral. */
  scene?: string;
  contract: ActionContract;
  options: SimOption[];
  outcomeVariants?: OutcomeVariants;
  delayedEffects?: DelayedEffect[];
  failureModes?: string[];
  /**
   * Recovery ties (§3.4 step 5). Action ids whose recovery- or endurance-flagged
   * options are honest ways on from THIS record's failure. A referenced action
   * must carry such an option, or the tie is dead — the compiler fails on that.
   */
  recoveryRefs?: string[];
  /**
   * The explicit, reasoned opt-out. Set ONLY where a "way on from here" would be
   * wrong — most importantly after another person's refusal, which is not a
   * setback with a route out of it and must not be rendered as one (§3.7). The
   * reason is required and is linted; silence is not an option, a stated one is.
   */
  noRecoveryTie?: { reason: string };
  /** The explain-drawer link into the reference layer. S-3 validates it resolves. */
  readRef: string;
  seasonBands: SeasonBands;
  repeatable?: boolean;
  requiresFlags?: string[];
  excludesFlags?: string[];
  /** A standing multi-season allocation (§3.4): commit is first-class. */
  standing?: { seasons: number; upkeep: ActionCost };
  /** Marks the unconditional floor set (§3.4, LITERAL). */
  floor?: boolean;
  weight?: number;
};

/**
 * The event trigger union. There is deliberately NO beat arm: a loss-tier beat
 * cannot be an Event (§5.1). S-1 asserts that no beat id is reachable here.
 */
export type EventTrigger =
  | { kind: "scheduled"; seasonIndex: number }
  | { kind: "consequence"; sourceRef: string }
  | { kind: "companion"; arcRef: string }
  | { kind: "systemic" }
  | { kind: "chance" };

export type SimEvent = {
  id: string;
  family: CardFamily;
  domains: string[];
  label: string;
  scene: string;
  trigger: EventTrigger;
  seasonBands: SeasonBands;
  /** Single-option events auto-resolve; 2+ options present a choice in-season. */
  options: SimOption[];
  outcomeVariants?: OutcomeVariants;
  delayedEffects?: DelayedEffect[];
  readRef: string;
  evidenceLabel: EvidenceLabel;
  /** Recovery ties, exactly as on an Action (§3.4 step 5). */
  recoveryRefs?: string[];
  /** The explicit, reasoned opt-out — see Action.noRecoveryTie. */
  noRecoveryTie?: { reason: string };
  requiresFlags?: string[];
  excludesFlags?: string[];
  /** True when this event's arrival is a negative pressure (pile-up cap, §5.2). */
  negative?: boolean;
  /**
   * §7.6 invalidation rule: if this event removes a committed action's premise,
   * the action converts or refunds by THIS authored rule, shown plainly.
   */
  invalidates?: { actionIds: string[]; resolution: "refund" | "convert"; convertTo?: string; note: string };
  weight?: number;
};

/* =========================================================================
   The consequence queue (§3.5) — ordinary consequences ONLY.
   There is no beat arm here either: beats are never queue entries (§5.1).
   ========================================================================= */

export type QueueInsertion = {
  /** Stable id within the run; the engine namespaces it per occurrence. */
  refId: string;
  label: string;
  effects: Effects;
  due: { seasons: number } | { condition: string; withinSeasons: number };
};

export type QueueEntry = {
  id: string;
  /** What put it here — an action or event record id + its season. */
  sourceRef: { kind: "action" | "event"; id: string; seasonIndex: number };
  label: string;
  effects: Effects;
  due: { seasons: number } | { condition: string; withinSeasons: number };
  /** The season it was placed, so "seasons" is absolute at render time. */
  placedSeason: number;
  /** Always true: the queue never hides what it holds (§3.5). */
  revealed: true;
  /** Bookkeeping so S-11 can prove every entry resolved / re-queued / expired. */
  history: { seasonIndex: number; what: "placed" | "requeued" | "resolved" | "expired"; cause?: string }[];
};

/* =========================================================================
   The beat schedule channel (§5.1, LITERAL) — loss tier lives ONLY here.
   Not an Event. Not a queue entry. Never rendered on a preview surface.
   ========================================================================= */

export type BeatPlacement = {
  /** The typed channel marker. The engine refuses to place a beat elsewhere. */
  channel: "beat-schedule";
  beatId: string;
  /** Deterministic placement: fixed by campaign structure or by the hand. */
  seasonIndex: number;
  placedBy: "campaign-structure" | "hand";
};

export type BeatRecord = {
  id: string;
  type: "scripted";
  skippable: true;
  reducedFrame: true;
  /** The real-world page this beat names — required, the sim's crisis channel. */
  realPageLink: string;
  prose: string;
  /** A skipped beat renders downstream as at most this one neutral line. */
  skippedLine: string;
  effects?: Effects;
};

/* =========================================================================
   Companion arcs (§3.7) — other people have agency
   ========================================================================= */

export type TrajectoryNode = {
  stage: number;
  label: string;
  /** Selected BY the relationship, not scripted regardless of it (§3.7). */
  entryConditions: {
    minQuality?: number;
    maxQuality?: number;
    minNeglect?: number;
    maxNeglect?: number;
    minRepair?: number;
    requiresFlags?: string[];
    notFlags?: string[];
    minSeason?: number;
  };
  eventRefs: string[];
  exitBehaviors: string[];
  kind: "neglect-response" | "repair-response" | "refuse" | "leave" | "deepen" | "steady";
};

export type CompanionArc = {
  id: string;
  label: string;
  /** Who they are, in their own terms. */
  wants: string[];
  limits: string[];
  trajectory: TrajectoryNode[];
  refusalBehaviors: string[];
  readRef: string;
  evidenceLabel: EvidenceLabel;
};

export type CompanionState = {
  arcId: string;
  stage: number;
  neglect: number;
  repair: number;
  exited: boolean;
  /** Seasons since the player last acted toward this person. */
  sinceContact: number;
};

/* =========================================================================
   Preset hands (§3.3) — labeled-fictional, fixed presentation order.
   Hands come ONLY from Birth RNG or these. No self-insertion, ever (§11).
   ========================================================================= */

export type PresetHand = {
  id: string;
  label: string;
  /** Rendered adjacent to the label on every surface that shows the hand. */
  fictionalNote: string;
  profile: ConstraintProfile;
  startState: {
    gauges: Partial<Record<GaugeKey, number>>;
    capabilities: Partial<Record<CapabilityKey, number>>;
    skills: string[];
    flags: string[];
    conditions: string[];
    relationships: { id: string; label: string; quality: number }[];
    companions: string[];
    role: string;
    place: string;
  };
  /**
   * The card face this preset renders behind. Presentation only — it says what
   * shape of start this is, and it is deliberately NOT hardness-ordered or
   * hardness-derived. Without it all five presets rendered the same motif and the
   * choice screen read as one card five times.
   */
  face: CardFamily;
  /** FIXED, hardness-independent (§2.3.1). The array index is the order. */
  presentationOrder: number;
};

/* =========================================================================
   The Decision Lab (§3.8)
   ========================================================================= */

export const LAB_AXES = ["choice-vary", "draw-vary", "position-vary"] as const;
export type LabAxis = (typeof LAB_AXES)[number];

export const LAB_AXIS_LABEL: Record<LabAxis, string> = {
  "choice-vary": "same start, same luck — only the decision differs",
  "draw-vary": "same choices, different luck",
  "position-vary": "same play, different start",
};

export const LAB_AXIS_LESSON: Record<LabAxis, string> = {
  "choice-vary": "what the decision itself was worth",
  "draw-vary": "the move sets the range; the draw lands inside it",
  "position-vary": "the same move costs different amounts from different places",
};

export type LabSituation = {
  id: string;
  title: string;
  /** Reference-layer pages this situation is drawn from. */
  sourceRefs: string[];
  /** The decision span: the action/event ids played, in order. */
  window: string[];
  axes: LabAxis[];
  /**
   * Which step of the window the choice-vary axis changes — the decision this
   * situation is actually about. Every other step is held identical, so what
   * separates the two branches at the end is ONE decision, which is what the
   * screen has always said it was. Defaults to the first step.
   */
  decisionStep?: number;
  /**
   * The card face this situation renders behind, so the four do not read as one
   * card four times. Presentation only, like PresetHand.face.
   */
  face: CardFamily;
  /**
   * N-225 (6.0 §7.1) — WHAT THIS FORK CANNOT SETTLE, declared before the branches.
   *
   * A Lab situation states a scene, a contract, a switching cost and its axes, and
   * then shows two columns that look decisive. What it never said is what neither
   * column can answer: the facts outside the model that would actually decide it.
   * Naming them first is the honest counterweight to a comparison screen.
   *
   * At least one, never zero — an empty list would read as "there is nothing this
   * cannot settle", which is the claim the field exists to prevent. C-22 asserts it.
   */
  unknowns: [string, ...string[]];
  /** Fixed seeds so a Lab comparison is byte-identical on every replay. */
  seeds: { handSeed: string; drawSeed: string; altDrawSeed: string };
  /** The two constraint positions the position-vary axis compares. */
  positions: [string, string];
  startPresetId: string;
  noPredictionNote: true;
  evidenceLabel: EvidenceLabel;
};

/* =========================================================================
   Saves, forks, and the committed ledger (§3.8, §7.5 commit semantics)
   ========================================================================= */

/** One committed allocation: the action, its occurrence ordinal, and the option. */
export type CommittedAllocation = {
  actionId: string;
  /** The occurrence discriminator (§2.1) — repeated actions draw freshly. */
  instanceOrdinal: number;
  optionId: string;
};

export type CommittedEventResponse = { eventId: string; optionId: string };

/**
 * N-216 — THE LIVING RECORD: one resolved season's rendered explanation, kept
 * with the content version that produced it.
 *
 * 6.0 §7.1 names this type in `lib/sim/persist.ts`, and persist.ts re-exports it
 * under that name. The declaration sits here because `SimState` carries the
 * records and `content/sim/schema.ts` cannot import from `lib/sim/persist.ts` —
 * persist.ts imports this file, and the other direction is a cycle.
 *
 * WHY IT EXISTS. Everything the trunk shows about a past season is re-derived from
 * origin + seeds + ledger by `replay()`. That is what makes determinism checkable,
 * and it is also what makes a content change silently rewrite the past: edit an
 * outcome line and the sentence a player actually read at twenty-two is quietly
 * replaced by a sentence they never saw. The ledger stays the source of truth for
 * the MODEL; this is the source of truth for what was READ.
 */
export type SeasonRecord = {
  seasonIndex: number;
  /** The season's explanation as it was rendered, lead line first. */
  explanation: string;
  /** The content version that produced that text. Never re-stamped. */
  contentVersion: string;
};

/** The replay ledger entry for ONE season (§7.5 commit semantics). */
export type CommittedSeason = {
  seasonIndex: number;
  allocations: CommittedAllocation[];
  /** In §7.6 resolution order. */
  eventResponses: CommittedEventResponse[];
  priorityRevision?: PrioritySet;
  /** Beat decisions are recorded but consume no RNG and are not events. */
  beatResponse?: { beatId: string; skipped: boolean };
  forkPoint?: boolean;
};

export type StandingCommitment = {
  actionId: string;
  instanceOrdinal: number;
  optionId: string;
  startedSeason: number;
  seasonsRemaining: number;
  upkeep: ActionCost;
  label: string;
};

export type RelationshipMark = { id: string; label: string; quality: number };

export type SeasonPhase =
  | "prologue"
  | "hand"
  | "priorities"
  | "briefing"
  | "allocate"
  | "resolve"
  | "consequences"
  | "summary"
  | "parse";

/* =========================================================================
   The state vector v2 (§7.1)
   ========================================================================= */

export type SimState = {
  schemaVersion: typeof SIM_SCHEMA_VERSION;
  engineVersion: string;
  contentVersion: string;
  mode: "campaign" | "lab";
  campaignId: string;

  /** Seeds — hand and draw separated, as in 3.0 (§3.8). */
  handSeed: string;
  drawSeed: string;

  /** Where the hand came from. There is no third arm (§11 FORBIDDEN). */
  origin: { kind: "preset"; presetId: string } | { kind: "birth-rng" };
  profile: ConstraintProfile;
  role: string;
  place: string;

  /* stocks */
  gauges: Record<GaugeKey, number>;
  capabilities: Record<CapabilityKey, number>;
  skills: string[];
  relationships: RelationshipMark[];
  companions: Record<string, CompanionState>;
  conditions: string[];
  flags: string[];
  maintenanceDebt: number;

  /* what winning means (§3.6) */
  priorities: PrioritySet;

  /* the queue (§3.5) */
  queue: QueueEntry[];

  /* standing multi-season allocations (§3.4) */
  standing: StandingCommitment[];

  /* the pointer */
  seasonIndex: number;
  phase: SeasonPhase;

  /* the replay ledger (§3.8) */
  committed: CommittedSeason[];

  /** Beats already played, for downstream reduced-frame rendering (§5.1). */
  beatsPlayed: { beatId: string; skipped: boolean; seasonIndex: number }[];

  /**
   * N-216 — the rendered explanation of each resolved season, stamped with the
   * content version that produced it. OPTIONAL, and appended rather than folded
   * into `committed`, for two reasons: a save written before 6.0 stays loadable
   * (the migration rule is unchanged), and `replay()` — which rebuilds everything
   * else from the ledger — deliberately does not reproduce these, because a
   * recomputation is exactly what they exist to not be.
   */
  seasonRecords?: SeasonRecord[];

  /** Fork provenance; null for a root run (§3.8). */
  /**
   * The branch this run is, if it is one. `ref` names the ForkRecord so a commit
   * can keep that record's suffix in step — without it the record stayed empty
   * and a branch could be listed but never replayed to where it actually was.
   */
  fork: { ref?: string; parentRef: string; forkPoint: number; label: string } | null;

  /** Whether the "this is a model" note has been shown this run. */
  notedIllustrative: boolean;

  /**
   * Set when a replay could not reproduce the ledger to the end (§2.4). Present
   * so the failure is DECLARED — a fork or a parse that came up short says so,
   * in plain language, rather than handing back a truncated run as a whole one.
   */
  replayTruncatedAt?: number;
};

/* =========================================================================
   Named saves and forks (§3.8)
   ========================================================================= */

export type NamedSave = {
  ref: string;
  label: string;
  savedAtLabel: string;
  schemaVersion: number;
  engineVersion: string;
  contentVersion: string;
  state: SimState;
};

export type ForkRecord = {
  ref: string;
  parentRef: string;
  /** Index into the parent's committed list where the branch begins. */
  forkPoint: number;
  seeds: { handSeed: string; drawSeed: string };
  label: string;
  /** The fork's own committed suffix — the parent's list is never touched. */
  suffix: CommittedSeason[];
};

/* =========================================================================
   Resolution output (what a season hands the UI)
   ========================================================================= */

export type ResolvedItem = {
  kind: "consequence" | "event" | "action" | "companion" | "chance";
  /** Record id, plus the occurrence ordinal for repeated actions. */
  id: string;
  instanceOrdinal?: number;
  label: string;
  family: CardFamily;
  optionId?: string;
  optionLabel?: string;
  band?: OutcomeBandName;
  failure?: boolean;
  line: string;
  /** The computed split (§3.10) — only nonzero components. */
  attribution: AttributionComponent[];
  /** Strip geometry for the honest choice-vs-draw layer. */
  marker?: number;
  shift?: number;
  readRef?: string;
  evidenceLabel?: EvidenceLabel;
  /** Set when §7.6's invalidation rule fired — shown plainly, never silent. */
  invalidatedNote?: string;
};

/**
 * A recovery tie (§3.4 step 5, LITERAL). Every failure-band resolution surfaces at
 * least one recovery- or endurance-flagged option TIED TO THAT FAILURE — not
 * merely the existence of rest somewhere in the menu. S-3 verifies the tie.
 */
export type RecoveryTie = {
  /** The record whose failure band landed. */
  failedId: string;
  failedLabel: string;
  /** What the failure actually was, so the tie reads as a response to it. */
  failureLine: string;
  routes: {
    actionId: string;
    actionLabel: string;
    optionId: string;
    optionLabel: string;
    /** Named where applicable — required on any endurance-flagged route. */
    supportLink?: string;
    why: string;
    /** True when this route is authored as a tie to THIS failure (§3.4 step 5).
     *  False for the floor route, which is here after anything and is never
     *  counted as the tie by any gate. */
    tied: boolean;
  }[];
};

export type SeasonResult = {
  seasonIndex: number;
  items: ResolvedItem[];
  /** One entry per failure-band resolution this season (§3.4 step 5). */
  recoveryTies: RecoveryTie[];
  queueAfter: QueueEntry[];
  /** Beats that arrived this season — separate field, never mixed into items. */
  beat?: { beatId: string; skipped: boolean };
  budgetSpent: Budget;
  budgetUnspent: Budget;
};
