/**
 * Timeline content model — types only (5.0 blueprint §7.1).
 *
 * TYPE-LEVEL CONTAINMENT is the point of this file, not documentation:
 *
 *  1. `MilestoneKind` has no `strategic-recommendation` and no `personal-target`
 *     arm. The timeline is descriptive; those two kinds of "should" (brief §6)
 *     cannot be *expressed* here, so they cannot be authored by accident.
 *     (5.0 §3.4, T-2.)
 *
 *  2. A milestone that carries numeric timing MUST carry at least one source.
 *     This is enforced by the `Milestone` union below: the sourced arm requires
 *     a non-empty `sources` tuple, and the unsourced arm forbids `timing`
 *     outright and demands `researchRequired: true`. There is no third shape.
 *     The compiler (tools/timeline-build-content.mjs) re-checks it at authoring
 *     time and refuses the batch naming the offending id — because JSON batches
 *     are not type-checked, only the compiled output is. (5.0 §4.1, §7.5, T-1.)
 *
 *  3. `EvidenceLabel` here deliberately re-declares the 4.0 six so `calibrated`
 *     can be named and then refused by the compiler and T-1. Nothing on the
 *     timeline is calibrated; the label exists so the refusal is explicit.
 *
 * Numbers live ONLY in the typed timing fields and in `Source.excerpt`.
 * No prose field in this model may contain a digit (content/timeline/AUTHORING.md).
 */

import type { ContentStatus } from "../evidence.ts";

/* ------------------------------------------------------------------ ids */

export type MilestoneId = string; // "ms-…"
export type SourceId = string; // "src-…"
export type StageId = string; // shared with content/roadmap.ts
/** An internal route path; validated against content/route-inventory.json by the compiler and T-10. */
export type RoutePath = string;

/** A non-empty list. Makes "numbers but no sources" unrepresentable in TS. */
export type NonEmpty<T> = [T, ...T[]];

/* ---------------------------------------------------------------- kinds */

/**
 * The five kinds of expectation the timeline can express (§3.4).
 *
 * The brief (§6) names seven. `strategic-recommendation` and `personal-target`
 * are EXCLUDED BY TYPE: strategy lives on /guidance, personal targets are the
 * reader's own. A timing analysis may describe mechanisms and associations of
 * early/late/never; it may never recommend a time.
 */
export type MilestoneKind =
  | "biological-window"
  | "legal-threshold"
  | "institutional-sequence"
  | "statistical-norm"
  | "cultural-expectation";

/** The standing line rendered with every record of that kind (§3.4, LITERAL). */
export const KIND_STANDING_LINE: Record<MilestoneKind, string> = {
  "biological-window":
    "a range bodies commonly move through — wide, and wider than most people think",
  "legal-threshold":
    "a rule, not a norm: this is the one kind of age that is actually a line",
  "institutional-sequence":
    "a schedule an institution keeps — and institutions have side doors",
  "statistical-norm": "common in the stated population; common is not required",
  "cultural-expectation":
    "an expectation is a thing said to you, not a fact about you",
};

/** Reader-facing name of each kind. Edition-neutral; the Game Guide layer maps these. */
export const KIND_LABEL: Record<MilestoneKind, string> = {
  "biological-window": "A window in a body",
  "legal-threshold": "A rule with an age in it",
  "institutional-sequence": "An institution's schedule",
  "statistical-norm": "A common pattern",
  "cultural-expectation": "Something people say",
};

/* ---------------------------------------------------------------- lanes */

export type Lane =
  | "body-health"
  | "learning"
  | "work-income"
  | "money-wealth"
  | "home-independence"
  | "people-family"
  | "civic-legal"
  | "inner-life";

export const LANES: Lane[] = [
  "body-health",
  "learning",
  "work-income",
  "money-wealth",
  "home-independence",
  "people-family",
  "civic-legal",
  "inner-life",
];

export const LANE_LABEL: Record<Lane, string> = {
  "body-health": "Body & health",
  learning: "Learning",
  "work-income": "Work & income",
  "money-wealth": "Money & wealth",
  "home-independence": "Home & independence",
  "people-family": "People & family",
  "civic-legal": "Civic & legal",
  "inner-life": "Inner life & meaning",
};

/* --------------------------------------------------------------- timing */

/** An inclusive age range in whole or half years. */
export type AgeRange = { from: number; to: number };

/**
 * When a thing commonly happens.
 *
 * `exact`    — a legal threshold with one age (federal rules).
 * `variesByState` — a legal threshold that differs by state: rendered as a range
 *                   with the note, never as a single age.
 * `window`   — the outer extent, including the tails.
 * `typical`  — the denser zone inside the window (drawn denser on the spine).
 *
 * At least one of these must be present on a sourced record.
 */
export type Timing = {
  exact?: number;
  /**
   * A span of years remaining FROM `exact`, not an age.
   *
   * §5.4 requires life expectancy "at birth and at 65". The official brief prints
   * the at-65 figure as remaining years, and the first pass correctly refused to
   * turn it into an age, because 65 + 19.5 is arithmetic the source does not print.
   * Refusing left the reader a worse problem: a sixty-eight-year-old saw only the
   * at-birth figure, 78.4, and did that arithmetic about themselves. So the figure
   * renders as what it is — a remaining span, stated at the age it is measured at.
   */
  remainingYears?: number;
  variesByState?: { from: number; to: number; note: string };
  window?: AgeRange;
  typical?: AgeRange | number;
};

/** What the source actually measured. Assigned from the source, never guessed. */
export type Measure =
  | "median"
  | "mean"
  | "typical-range"
  | "most-by"
  | "legal-rule"
  | "share-at-age"
  | "modal";

export const MEASURE_LABEL: Record<Measure, string> = {
  median: "median",
  mean: "mean",
  "typical-range": "typical range",
  "most-by": "most people by",
  "legal-rule": "a rule as written",
  "share-at-age": "share of people at that age",
  modal: "most common single value",
};

/* ------------------------------------------------------------ sensitive */

export type Sensitivity =
  | "child-development"
  | "puberty"
  | "fertility"
  | "health-decline"
  | "dying";

/** Where each sensitivity must route (§5.3). The compiler and T-6 check against this. */
export const SENSITIVITY_REQUIRED_ROUTES: Record<Sensitivity, RoutePath[]> = {
  "child-development": ["/topics/health"],
  puberty: ["/topics/health"],
  fertility: ["/topics/health"],
  "health-decline": ["/topics/health"],
  // LITERAL (§5.3): the dying segment names both, and names them first.
  dying: ["/situations/a-death", "/situations/grief"],
};

/** The screening line that must render on every child-development record (§5.3, LITERAL). */
export const SCREENING_LINE =
  "A population range is not a screening threshold. If you are worried about a child, the route is a pediatrician, not a website.";

/**
 * The concrete door, named beside the abstract one.
 *
 * A reader-persona pass — a parent of a two-year-old who is not talking yet — found
 * that the build had quoted the checklist half of "Learn the Signs. Act Early." and
 * dropped the act-early half: the words "early intervention" appeared nowhere, and
 * the only route offered was a page with nothing about children on it. "A
 * pediatrician" is true and it is not the whole answer.
 *
 * The claim below is a routing fact rather than a figure, so it carries its source
 * as a link and a quotation rather than through the Source system, which exists for
 * numbers. The quotation was fetched during this build like everything else.
 */
export const EARLY_INTERVENTION_LINE =
  "There is also a publicly funded early intervention programme in every state and territory that will evaluate a young child, and a family can ask for that evaluation themselves.";
export const EARLY_INTERVENTION_URL =
  "https://www.cdc.gov/act-early/early-intervention/index.html";
export const EARLY_INTERVENTION_QUOTE =
  "Programs are available in every state and territory. These publicly funded programs provide services for free or at reduced cost for any child who is eligible.";
export const EARLY_INTERVENTION_PUBLISHER = "Centers for Disease Control and Prevention";

/** brief §6A, carried onto every child-development record (§5.3). */
export const VARIATION_LINE =
  "Children develop at different rates, and some children develop differently. Variation is not deviation.";

/* -------------------------------------------------------------- sources */

export type SourceKind =
  | "official-statistics"
  | "statute-or-agency-rule"
  | "peer-reviewed"
  | "reputable-secondary";

export const SOURCE_KIND_LABEL: Record<SourceKind, string> = {
  "official-statistics": "Official statistics",
  "statute-or-agency-rule": "Statute or agency rule",
  "peer-reviewed": "Peer-reviewed",
  "reputable-secondary": "Reputable secondary",
};

/**
 * A source read during this build. §4.1: a number that was not read on a page
 * fetched during this build is an invented number.
 *
 * `excerpt` is verbatim from the page, at most 25 words, and CONTAINS the figure
 * the record claims. The compiler counts the words; T-11 re-checks; a separate
 * verifier agent re-fetched the URL and confirmed the excerpt appears (§4.4).
 */
export type Source = {
  id: SourceId;
  title: string;
  publisher: string;
  url: string;
  kind: SourceKind;
  publicationYear: number;
  /** The year the DATA describes — distinct from publicationYear (§4.3). */
  dataYear: number;
  /** What the source measured: sex at birth, self-reported gender, registration, self-report… */
  measures: string;
  /** ISO date this build fetched it. */
  retrievedOn: string;
  /** Verbatim, <= 25 words, contains the figure. */
  excerpt: string;
  notes?: string;
};

/* ------------------------------------------------------------- analysis */

/**
 * One branch of a timing analysis (§7.1, §5.7).
 *
 * `tends` describes mechanisms and associations. It never recommends a time.
 * If `costs` is present, `routes` MUST be non-empty — enforced by the union
 * below, by the compiler, and by T-4. Recovery sits beside every cost.
 */
export type Branch =
  | {
      tends: string;
      costs: NonEmpty<string>;
      routes: NonEmpty<string>;
      evidence: EvidenceLabel;
      sources?: SourceId[];
    }
  | {
      tends: string;
      costs?: undefined;
      routes?: string[];
      evidence: EvidenceLabel;
      sources?: SourceId[];
    };

/** The brief §6 branches. `never` is a path, not a failure (§5.7). */
export type TimingAnalysis = {
  early?: Branch;
  window?: Branch;
  late?: Branch;
  interrupted?: Branch;
  alternative?: Branch;
  never?: Branch;
};

/* ------------------------------------------------------------- evidence */

/**
 * The 4.0 six, carried (§6.1). `calibrated` stays RESERVED: nothing on the
 * timeline is a value tuned to data. The compiler refuses it and T-1 asserts it.
 */
export type EvidenceLabel =
  | "calibrated"
  | "evidence-informed"
  | "contested"
  | "insufficient-evidence"
  | "illustrative"
  | "speculative";

export const EVIDENCE_LABEL_TEXT: Record<EvidenceLabel, string> = {
  calibrated: "Calibrated",
  "evidence-informed": "Evidence-informed",
  contested: "Contested",
  "insufficient-evidence": "Insufficient evidence",
  illustrative: "Illustrative",
  speculative: "Speculative",
};

export const EVIDENCE_LABEL_MEANING: Record<EvidenceLabel, string> = {
  calibrated:
    "Reserved. A value tuned against data. Nothing on this timeline claims it.",
  "evidence-informed":
    "A descriptive claim resting on at least one source we fetched and quoted.",
  contested: "Sources disagree. Both are shown.",
  "insufficient-evidence":
    "We looked and did not find something adequate, or the thing is not quantifiable.",
  illustrative: "A worked example, shown to make a shape visible.",
  speculative:
    "Our reasoning about a mechanism, offered as reasoning and not as a finding.",
};

/* ------------------------------------------------------------ milestone */

type MilestoneBase = {
  id: MilestoneId;
  /** Edition-neutral, authored once. No digits. */
  label: string;
  lane: Lane;
  kind: MilestoneKind;
  /** Whether not doing this at all is an ordinary path (§5.7 requires a `never` branch). */
  optional: boolean;
  /** The population the claim is about, in the source's own terms. */
  population?: string;
  measure?: Measure;
  /** What the source measured — required whenever `bySex` is present (T-9). */
  measures?: string;
  bySex?: { female: Timing; male: Timing; measures: string; sources: NonEmpty<SourceId> };
  sensitivity?: Sensitivity;
  /** One calm sentence: what this is not, and where the real route is. Required if sensitive. */
  careNote?: string;
  /** The real page. Required on every record; must resolve in the route inventory. */
  readRef: RoutePath;
  /** Extra routes (e.g. the dying segment's second page). */
  alsoRead?: RoutePath[];
  status: ContentStatus;
  evidence: EvidenceLabel;
  /** Editorial, at most three lines, at most 40 words each, NO DIGITS. */
  whatChanges?: string[];
  /**
   * Quoted social speech. The ONLY field exempt from the T-3 normative lint,
   * because it is quotation (§3.4b). Present only on `cultural-expectation`.
   */
  heard?: string[];
  affectsLater?: MilestoneId[];
  /**
   * §5.4, and this field exists for one rule only.
   *
   * "Life expectancy renders ONCE, in the later-life stage intro ... No per-year
   * mortality, no hazard, no death tick on the spine, no 'average age at death'
   * anywhere as a milestone."
   *
   * A population average lifespan is a real, sourced, useful figure — and drawn on
   * the spine it becomes exactly the thing that sentence forbids: a mark on the
   * timeline that says here is where it ends. So a record carrying this renders in
   * the named stage's intro, with its evidence, and is excluded from the spine and
   * from every year card. It is not hidden; it is placed where it does not read as
   * a marker on a life.
   */
  renderAs?: "stage-intro-note";
  /** Required when `renderAs` is set: which stage intro carries it. */
  stageId?: StageId;
  /**
   * A note from the authoring/verification pass to a later reader — a caveat about
   * the source, a scope limit, something the next person should know. Never rendered
   * to a reader; linted like every other prose field so it cannot smuggle a number
   * or a "should" into the record.
   */
  notes?: string;
  /** Gets its own page at /timeline/<id> (§3.1). */
  major?: boolean;
  analysis?: TimingAnalysis;
  lastReviewed: string;
};

/** A milestone whose timing was read on a fetched page. */
export type SourcedMilestone = MilestoneBase & {
  timing: Timing;
  sources: NonEmpty<SourceId>;
  researchRequired?: false;
  researchNote?: undefined;
};

/**
 * A milestone whose shape we know and whose number we do not have.
 * It renders "not yet sourced", the claim in words, and NO DIGIT (§4.6).
 * `timing` is forbidden here — that is the containment.
 */
export type UnsourcedMilestone = MilestoneBase & {
  timing?: undefined;
  sources?: undefined;
  researchRequired: true;
  /** The query that would resolve it. Goes into KNOWN_LIMITATIONS.md verbatim. */
  researchNote: string;
  /** The claim's shape, in words, no digits: "somewhere in the early school years". */
  windowInWords: string;
};

export type Milestone = SourcedMilestone | UnsourcedMilestone;

export function isSourced(m: Milestone): m is SourcedMilestone {
  return m.researchRequired !== true;
}

/* ---------------------------------------------------------------- stage */

/**
 * A stage band is a NAVIGATION CONVENTION (§3.3). It claims nothing, so it is
 * the only age on the page that needs no external source — and T-1 exempts it
 * by this literal type and by nothing else.
 */
export type Stage = {
  id: StageId;
  label: string;
  /**
   * NO `gameLabel`. The timeline is edition-neutral by design (review F4): every
   * stage here carried a Game Guide label that no component ever read, and dead
   * content that implies a feature is worse than no content. `content/roadmap.ts`
   * keeps its own game labels, because the map really does render them.
   */
  /**
   * A form of `label` short enough to draw inside a narrow band on the spine.
   * Review F3: the whole-life view drew every label at full length, so "The
   * tutorial years" and "Adolescence" overlapped and the two shortest bands were
   * suppressed entirely. The instrument now draws the longest form that FITS.
   */
  shortLabel: string;
  ageBand: [number, number];
  kind: "navigation-convention";
  /** 120–220 words, editorial. No ages inside the prose beyond the band. */
  intro: string[];
  short: string;
  /**
   * Only the terminal card carries this. It is the timeline's dying segment, so
   * the loss-tier lint passes inside its prose exactly as it does inside a record
   * flagged `dying` (§5.4) — and nowhere else among the stages.
   */
  sensitivity?: Extract<Sensitivity, "dying">;
  /**
   * The adolescence stage renders the standing crisis note once (§5.6). The note
   * is a component, never prose: crisis-tier vocabulary appears in no content field.
   */
  rendersCrisisNote?: true;
  /** Routes this stage names first, before anything else (the dying card). */
  readRefs?: RoutePath[];
};

export const NAVIGATION_CONVENTION_LINE =
  "a convention for finding your way, not a measurement";

/* ----------------------------------------------------------- band table */

/**
 * The published qualitative band table (§4.5). A rate NEVER renders on a
 * surface; the surface carries the band, the drawer carries the figure.
 * Thresholds are executor latitude, published on /methodology (T-8).
 */
export type BandName = "most" | "about half" | "many" | "some" | "few";

export type BandTable = {
  /** Lower bound (inclusive) of the share, as a proportion, for each band. */
  most: number;
  aboutHalf: number;
  many: number;
  some: number;
  few: number;
};

export const BAND_TABLE: BandTable = {
  most: 0.66,
  aboutHalf: 0.45,
  many: 0.2,
  some: 0.05,
  few: 0,
};

/** Map a sourced proportion to its published band. The figure stays in the drawer. */
export function bandFor(share: number): BandName {
  if (share >= BAND_TABLE.most) return "most";
  if (share >= BAND_TABLE.aboutHalf) return "about half";
  if (share >= BAND_TABLE.many) return "many";
  if (share >= BAND_TABLE.some) return "some";
  return "few";
}

/* ------------------------------------------------------- the whole pool */

export type TimelineContent = {
  stages: Stage[];
  milestones: Milestone[];
  sources: Record<SourceId, Source>;
  /** ISO date. Rendered at the top of /timeline. */
  lastReviewed: string;
};

/** The one line that runs at the top of the page, both editions (§5.8, LITERAL). */
export const OFF_COMMON_LINE =
  "These are common windows in a stated population. Common is not required. Being off the common path is not being behind; there is no schedule.";

/** The reference frame line (§4.7, LITERAL). */
export const REFERENCE_FRAME_LINE =
  "United States · reference 2025 · each figure shows its own data year";

/** The honest empty state (§3.5 item 7, an enumerated template — not prose). */
export function emptyStateFor(age: number): string {
  return `Nothing discrete commonly happens at ${age}. The windows above are still open.`;
}

/** The terminal card's id — not a stage a person is "in" (§3.3). */
export const TERMINAL_STAGE_ID = "dying-and-closure";

/** The age ceiling (§12 decision 3, default). */
export const MAX_AGE = 100;
