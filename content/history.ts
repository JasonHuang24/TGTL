/**
 * History fixture (blueprint §6.8) — one era done properly. Industrialization as
 * a major patch note plus a before/after tier board. All content is
 * illustrative-historical pending research (G-10): no invented statistics. The
 * fixed disclaimer is rendered prominently by the component.
 *
 * Tier board doctrine (master brief §4A): frank but auditable — do not omit a
 * material advantage or disadvantage, do not confuse advantage with virtue, show
 * where a position's strength depended on extraction elsewhere, and expose the
 * weighting so a reader could produce a different board for a different objective.
 */

export const PATCH = {
  version: "Industrialization",
  subtitle: "A major systems update — rolled out unevenly, by region and by decade",
  headline:
    "Production moved from workshop and field to factory and mill. Ownership of the new means of production became the dominant source of compounding power, and a wage-labour market opened at scale — with new hazards attached.",
  added: [
    "Wage labour at scale, and the mobility (and precarity) that came with it",
    "Industrial capital as a build whose returns compounded faster than land alone",
    "The city as the arena where most of this now played out",
  ],
  removed: [
    "Much of the artisan and guild economy, as factory scaling undercut protected skilled crafts",
    "The assumption that a scarce hand-skill was a durable position",
  ],
  buffs: [
    "Owners of capital: a major, direct, compounding advantage — the era's largest gains concentrated here",
    "Merchants positioned to become industrialists: a newly viable, high-ceiling position",
  ],
  nerfs: [
    "Skilled artisans: a direct loss as their scarce skill was displaced — unevenly, and with a lag that made it hard to see coming",
    "Manual workers: wage access, yes, but with crowding, injury, pollution, and weak bargaining power attached",
  ],
  rollout:
    "None of this arrived everywhere at once. The same headline change landed decades apart in different places, and its local severity varied enormously — a global change with very different local timings.",
  transitionGeneration:
    "The people caught in the transition inherited the costs of both worlds and the protections of neither: raised for a workshop economy that was disappearing, entering a factory economy not yet governed. Being caught in the transition is a position, not a failing.",
} as const;

export const TIER_OBJECTIVE = "Overall era power — how much room to act and to be safe a position afforded under each ruleset.";

export const TIER_FACTORS = [
  { label: "Material resources", weight: "high" },
  { label: "Autonomy", weight: "high" },
  { label: "Physical safety", weight: "medium" },
  { label: "Legal standing and its enforcement", weight: "medium" },
  { label: "Work burden and leisure", weight: "medium" },
];

export type Tier = "S" | "A" | "B" | "C" | "D" | "F";
export const TIERS: Tier[] = ["S", "A", "B", "C", "D", "F"];

export type Archetype = {
  id: string;
  name: string;
  before: { tier: Tier; ruling: string };
  after: { tier: Tier; ruling: string };
  /** Where the position's strength depended on extracting from a lower-tier one. */
  dependency?: string;
};

export const ARCHETYPES: Archetype[] = [
  {
    id: "landowning",
    name: "Landowning gentry",
    before: { tier: "A", ruling: "Land was the durable source of power, income, and standing." },
    after: { tier: "S", ruling: "Land converted into industrial capital and compounded; the buff was direct and large." },
    dependency: "Rents and, in many places, the labour of tenants and the enslaved.",
  },
  {
    id: "industrialist",
    name: "Merchant becoming industrialist",
    before: { tier: "B", ruling: "Comfortable, but bounded by the scale of pre-factory trade." },
    after: { tier: "S", ruling: "A newly viable position: those able to own the machines captured the era's largest gains." },
    dependency: "The wage labour and raw materials the new factories consumed.",
  },
  {
    id: "artisan",
    name: "Skilled artisan / craftsman",
    before: { tier: "B", ruling: "A scarce, guild-protected hand-skill was a solid, defensible position." },
    after: { tier: "D", ruling: "The scarce skill was displaced by factory scaling — a direct setback, uneven and lagged." },
  },
  {
    id: "laborer",
    name: "Rural labourer → factory worker",
    before: { tier: "D", ruling: "Subsistence, tied to land and season, with little mobility." },
    after: { tier: "C", ruling: "Gained wage access and mobility, and also crowding, injury, pollution, and weak bargaining power — a genuinely mixed patch." },
  },
  {
    id: "extracted",
    name: "Enslaved or colonised labour",
    before: { tier: "F", ruling: "The ruleset afforded almost no room to act and little protection." },
    after: { tier: "F", ruling: "The era's gains for others depended in part on this position; the ruleset offered it no buff." },
    dependency: "This is the position others' gains were extracted from.",
  },
];

export const TIER_DISCLAIMER = "Tiers rank what a ruleset did to a position — never the worth of the people in it.";

/**
 * N-170 (6.0 §3.8, C-43) — THE OBJECTIVE IS SWITCHABLE, AND THE BOARD MOVES.
 *
 * The trunk's own `TIER_LIMITS` named this as the missing thing: "would let you
 * re-weight the factors to produce a different board for a different objective."
 * Watching the same five positions reorder under "autonomy" versus "era power"
 * is the single best demonstration on this site that a tier is a fact about a
 * ruleset and not about people — better than any paragraph saying so, because
 * the reader does it themselves and sees the letters move.
 *
 * NO NUMBER IS INVOLVED. The weights are qualitative words in a closed set, the
 * placements are authored per objective, and nothing is summed. A weight here
 * says how much a factor mattered to THIS question, not how much anything is
 * worth.
 *
 * THE THIRD OBJECTIVE IS SECURITY rather than mobility. Mobility is very close
 * to autonomy under this era's ruleset — for four of the five positions the
 * placements would have been the same board twice, which teaches nothing.
 * Security cuts across both: it is the objective under which the artisan's
 * guild-protected position was strongest and under which the industrialist's
 * newly-viable one was not, so it genuinely reorders rather than re-ranking.
 */
export type FactorWeight = "very high" | "high" | "moderate" | "low";

export type TierObjective = {
  id: string;
  label: string;
  /** What is being ranked. LITERAL: a position, never a person or a group. */
  unit: string;
  /** Plain-language statement of the question the board answers. */
  question: string;
  factors: { name: string; weight: FactorWeight }[];
  /** What this objective does NOT measure — a closed, published list. */
  notMeasured: string[];
  evidence: EvidenceLabel;
  /** Every archetype, every time. A tier may be null — see N-172. */
  placements: Record<string, { before: Tier | null; after: Tier | null; ruling: string }>;
};

/** The evidence labels the tier board may claim (the 4.0 six, minus the reserved one). */
export type EvidenceLabel =
  | "evidence-informed"
  | "contested"
  | "insufficient-evidence"
  | "illustrative"
  | "speculative";

export const EVIDENCE_LABEL_WORD: Record<EvidenceLabel, string> = {
  "evidence-informed": "Evidence-informed",
  contested: "Contested",
  "insufficient-evidence": "Insufficient evidence",
  illustrative: "Illustrative",
  speculative: "Speculative",
};

/**
 * N-171 (6.0 §3.8, C-44) — the not-measured list, LITERAL and shared.
 *
 * It is the same on every objective because it is a statement about what a tier
 * board is, not about what any particular question happens to leave out. It
 * renders ABOVE the letters: the reader has to know what is not being ranked
 * before they see a rank, because after they have seen one it is too late.
 */
export const TIER_NOT_MEASURED = [
  "Human worth",
  "Happiness",
  "Moral value",
  "The value of a family",
  "Skill",
  "Contribution",
  "Individual destiny",
];

export const TIER_UNIT = "An economic position under a ruleset — not a demographic group, and not a person.";

export const TIER_OBJECTIVES: TierObjective[] = [
  {
    id: "era-power",
    label: "Era power",
    unit: TIER_UNIT,
    question: "How much room to act, and to be safe, did this position afford under each ruleset?",
    factors: [
      { name: "Material resources", weight: "very high" },
      { name: "Autonomy", weight: "high" },
      { name: "Physical safety", weight: "moderate" },
      { name: "Legal standing and its enforcement", weight: "moderate" },
      { name: "Work burden and leisure", weight: "moderate" },
    ],
    notMeasured: TIER_NOT_MEASURED,
    evidence: "illustrative",
    // The trunk's existing board, unchanged: same tiers, same rulings.
    placements: {
      landowning: {
        before: "A",
        after: "S",
        ruling: "Land converted into industrial capital and compounded; the buff was direct and large.",
      },
      industrialist: {
        before: "B",
        after: "S",
        ruling: "A newly viable position: those able to own the machines captured the era's largest gains.",
      },
      artisan: {
        before: "B",
        after: "D",
        ruling: "The scarce skill was displaced by factory scaling — a direct setback, uneven and lagged.",
      },
      laborer: {
        before: "D",
        after: "C",
        ruling: "Gained wage access and mobility, and also crowding, injury, pollution, and weak bargaining power — a genuinely mixed patch.",
      },
      extracted: {
        before: "F",
        after: "F",
        ruling: "The era's gains for others depended in part on this position; the ruleset offered it no buff.",
      },
    },
  },
  {
    id: "autonomy",
    label: "Autonomy",
    unit: TIER_UNIT,
    question: "How much of a life could a person in this position actually direct — where they lived, what they worked at, and when they stopped?",
    factors: [
      { name: "Control over your own hours and pace", weight: "very high" },
      { name: "Freedom to leave an arrangement", weight: "very high" },
      { name: "Freedom of movement", weight: "high" },
      { name: "Dependence on another party's permission", weight: "high" },
      { name: "Material resources", weight: "moderate" },
      { name: "Legal standing and its enforcement", weight: "moderate" },
    ],
    notMeasured: TIER_NOT_MEASURED,
    evidence: "insufficient-evidence",
    /*
     * N-172 — THE EMPTY TOP TIER, ON PURPOSE.
     *
     * No placement here reaches S, and that is a finding rather than an
     * oversight. Every position on this board depended on somebody: the
     * landowner on tenants and on a legal order, the industrialist on capital
     * markets and on labour, and the rest more obviously. Nobody here directed
     * a life without permission from something. A board that put its most
     * comfortable position in S would be reporting comfort as autonomy, and the
     * evidence available for this era does not justify the placement.
     *
     * The refusal is the most persuasive thing on this page: a tier list with a
     * visibly empty top row teaches more about what an instrument owes you than
     * a methodology section ever will.
     */
    placements: {
      landowning: {
        before: "A",
        after: "A",
        ruling:
          "Very high control over their own time, and nonetheless bound: to the estate, to the family arrangement, to a marriage market, and to a social order that could withdraw standing. Not S — comfort is not the same thing as being able to direct a life.",
      },
      industrialist: {
        before: "B",
        after: "B",
        ruling:
          "Gained enormous room to act commercially and spent it on an enterprise that then owned their hours; the new position came with creditors, markets and machinery that did not wait. Autonomy in kind, not in quantity.",
      },
      artisan: {
        before: "A",
        after: "C",
        ruling:
          "Under the old ruleset this was one of the freer positions available: a scarce skill, a workshop, a pace set by the worker and a guild enforcing it. The factory took the pace first and the skill afterwards. This is the position autonomy ranks highest and era power does not.",
      },
      laborer: {
        before: "D",
        after: "C",
        ruling:
          "Gained the formal freedom to leave one employer for another, which is real and was new, and lost the seasonal rhythm to the whistle. Better than tied labour, and the whole of it was still somebody else's clock.",
      },
      extracted: {
        before: "F",
        after: "F",
        ruling: "Coercion directly defeats this objective. Worth is not being ranked here; freedom of action is, and this position was afforded almost none.",
      },
    },
  },
  {
    id: "security",
    label: "Security",
    unit: TIER_UNIT,
    question: "How well protected was this position against a bad year — illness, injury, a downturn, or one decision going the wrong way?",
    factors: [
      { name: "A floor beneath a serious failure", weight: "very high" },
      { name: "Physical safety at work", weight: "high" },
      { name: "Predictability of income", weight: "high" },
      { name: "Legal protection actually enforced", weight: "moderate" },
      { name: "Material resources", weight: "moderate" },
      { name: "Autonomy", weight: "low" },
    ],
    notMeasured: TIER_NOT_MEASURED,
    evidence: "illustrative",
    placements: {
      landowning: {
        before: "S",
        after: "S",
        ruling:
          "Land does not go out of fashion in a decade, and a bad year is survived out of stores and rents. This is the position security ranks highest, and it ranks it highest before the patch as well as after — which is the point of asking a different question.",
      },
      industrialist: {
        before: "B",
        after: "C",
        ruling:
          "The era's largest gains came with the era's largest exposure: capital concentrated in one enterprise, in one sector, financed by credit, in a market that had panics. Under era power this position is at the top; under security it is not, and both readings are true.",
      },
      artisan: {
        before: "B",
        after: "D",
        ruling:
          "The guild was, among other things, an insurance arrangement — restricted entry, mutual support, a floor under a bad year. Losing the protected skill lost the floor with it, and the two losses arrived at different times, which made the second one hard to see coming.",
      },
      laborer: {
        before: "D",
        after: "D",
        ruling:
          "Traded one insecurity for another: the harvest failing for the mill closing, and the seasons for injury, crowding and air. A wage is more predictable than a crop and it stops the week you cannot work.",
      },
      extracted: {
        before: "F",
        after: "F",
        ruling: "No floor of any kind, and no legal standing from which to claim one. The ruleset afforded this position no protection to lose.",
      },
    },
  },
];

/** N-172 — what an empty tier says, rather than saying nothing. */
export const EMPTY_TIER_LINE = "No responsible placement";
export const EMPTY_TIER_NOTE =
  "Nothing on this board reaches the top tier under this objective, and that is the result rather than a gap in it. When the evidence cannot justify a strong placement, an explicit empty state is the responsible output; filling it would be inflating certainty to complete a shape.";

/**
 * N-176 (6.0 §3.8) — official rules, practical effects, rollout and lag, as
 * three PARALLEL panels rather than three sequential sections.
 *
 * Putting the written rule beside its enforcement, rather than before it, is
 * what stops a law reading as a description of what happened. In sequence, the
 * rule is read first and the enforcement is read as a footnote to it; side by
 * side, they are two objects, and the gap between them is visible as a gap.
 *
 * Nothing new is written here: the panels re-arrange `PATCH`'s existing content
 * under three headings and one framing sentence.
 */
export const RULES_GRID_NOTE =
  "A rule and its enforcement are different objects, so they are shown side by side rather than in sequence. What was written, what actually happened to people, and how long the distance between the two lasted are three separate questions, and the distance is usually where the interesting part is.";

export const TIER_LIMITS =
  "This board is illustrative and deliberately coarse. A real one would branch every archetype by sex, region, age, health, and family — a single 'labourer' is many different positions — and would carry a confidence label and a list of missing variables per placement. What it no longer lacks is the switch: the objective above is yours to change, and the same five positions reorder under a different question, because a tier is a fact about a ruleset and not about people. The headline tiers can be blunt; the weighting and the evidence must not be hidden.";
