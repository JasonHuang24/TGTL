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

export const TIER_LIMITS =
  "This board is illustrative and deliberately coarse. A real one would branch every archetype by sex, region, age, health, and family — a single 'labourer' is many different positions — would carry a confidence label and a list of missing variables per placement, and would let you re-weight the factors to produce a different board for a different objective. The headline tiers can be blunt; the weighting and the evidence must not be hidden.";
