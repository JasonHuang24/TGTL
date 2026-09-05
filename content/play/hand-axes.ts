/**
 * The Birth RNG hand — the axes and their conditioned value sets (blueprint 3.0
 * §3.3, brief §"Randomized does not mean independent"). These weight tables are
 * illustrative and are PUBLISHED READABLY on /methodology (§8) — nothing hidden.
 *
 * Hierarchy: era (fixed US-2025 for v1) → household & class → family stability →
 * health & body → local environment. The draws are conditional, not independent
 * dice: the household draw tilts every later draw toward its own hardness (the
 * `tilt` rule below), which is how "randomized does not mean independent" is felt.
 *
 * Every value is edition-neutral, plain, and carries NO loss-tier or crisis-tier
 * content. A hand can be hard, but a hard hand is a set of constraints — never a
 * verdict on the person who holds it (§3.3 risk-list test, gate S-8).
 */

import type { GaugeKey } from "@/content/bands";

export type HandValue = {
  id: string;
  /** Plain label shown on the revealed card. */
  label: string;
  /** The reveal line — the designed beat when the card flips (§3.3). */
  reveal: string;
  /** Starting-gauge contributions (added to the steady baseline, then clamped). */
  gauge?: Partial<Record<GaugeKey, number>>;
  /** Constraint flags this value sets on the hand. */
  flags?: string[];
  /** Active conditions this value starts with. */
  conditions?: string[];
  /** Hardness contribution 0..3 — sums across axes into the difficulty tier. */
  hardness: number;
  /** Base draw weight before the household tilt. */
  weight: number;
};

export type HandAxis = {
  id: "household" | "family" | "health" | "environment";
  /** Plain axis title shown above the card. */
  title: string;
  /** One-line framing of what this axis is. */
  caption: string;
  values: HandValue[];
};

/** Era is fixed for v1 (owner-confirmed first roadmap). Not drawn. */
export const ERA = {
  id: "us-2025",
  label: "United States · 2025",
  reveal: "The run opens here: one country, this decade, these rules. You did not pick the board.",
};

/** The gauge every hand starts from before contributions (index 2 = steady). */
export const BASELINE_GAUGE = 2;

export const HAND_AXES: HandAxis[] = [
  {
    id: "household",
    title: "The household you land in",
    caption: "class and resources — the draw that tilts all the others",
    values: [
      {
        id: "resourced",
        label: "resourced",
        reveal: "A full pantry, a quiet place to work, and — quietly decisive — a fall would be caught.",
        gauge: { money: 2, timeStructure: 1 },
        flags: ["floor"],
        hardness: 0,
        weight: 1,
      },
      {
        id: "getting-by",
        label: "getting by",
        reveal: "The bills got paid most months, so long as nothing went wrong all at once.",
        gauge: { money: 0 },
        hardness: 1,
        weight: 1,
      },
      {
        id: "precarious",
        label: "precarious",
        reveal: "The math only worked when nothing broke. Things broke.",
        gauge: { money: -1, timeStructure: -1 },
        flags: ["no-floor", "thin-margin"],
        hardness: 2,
        weight: 1,
      },
      {
        id: "unstable",
        label: "unstable",
        reveal: "The address changed often; the ground under it never quite settled.",
        gauge: { money: -2, timeStructure: -1, connection: -1 },
        flags: ["no-floor", "thin-margin", "moved-often"],
        hardness: 3,
        weight: 0.8,
      },
    ],
  },
  {
    id: "family",
    title: "The people who raised you",
    caption: "stability and connections at the start",
    values: [
      {
        id: "close-knit",
        label: "close-knit",
        reveal: "There were adults who noticed, and stayed.",
        gauge: { connection: 2 },
        flags: ["strong-ties"],
        hardness: 0,
        weight: 1,
      },
      {
        id: "present-strained",
        label: "present but strained",
        reveal: "Love was there; so was strain. Both got handed down.",
        gauge: { connection: 0 },
        hardness: 1,
        weight: 1.1,
      },
      {
        id: "thin-support",
        label: "thin support",
        reveal: "You learned early to handle things alone. It made you capable, and tired.",
        gauge: { connection: -1 },
        flags: ["thin-ties"],
        hardness: 2,
        weight: 1,
      },
      {
        id: "scattered",
        label: "scattered",
        reveal: "The people were there and not there; you kept your own counsel young.",
        gauge: { connection: -1, timeStructure: -1 },
        flags: ["thin-ties"],
        hardness: 3,
        weight: 0.7,
      },
    ],
  },
  {
    id: "health",
    title: "The body you were handed",
    caption: "the capacity the whole run is spent from",
    values: [
      {
        id: "robust",
        label: "robust",
        reveal: "So far, the body has been a quiet ally.",
        gauge: { healthEnergy: 2 },
        flags: ["good-health"],
        hardness: 0,
        weight: 1,
      },
      {
        id: "ordinary",
        label: "ordinary",
        reveal: "Nothing remarkable — it works, until it asks you to notice it.",
        gauge: { healthEnergy: 0 },
        hardness: 1,
        weight: 1.2,
      },
      {
        id: "a-condition",
        label: "a condition to manage",
        reveal: "There is a thing to keep an eye on, every day, quietly — manageable, and always there.",
        gauge: { healthEnergy: -1 },
        flags: ["manages-a-condition"],
        hardness: 2,
        weight: 0.9,
      },
      {
        id: "fragile-start",
        label: "a fragile start",
        reveal: "The early years asked more of the body than they gave back.",
        gauge: { healthEnergy: -2 },
        hardness: 3,
        weight: 0.6,
      },
    ],
  },
  {
    id: "environment",
    title: "The place around you",
    caption: "how many doors are within reach",
    values: [
      {
        id: "opportunity-rich",
        label: "opportunity-rich",
        reveal: "The place was full of doors — for anyone who could reach the handles.",
        gauge: { timeStructure: 1, connection: 1 },
        flags: ["thick-market"],
        hardness: 0,
        weight: 1,
      },
      {
        id: "ordinary-town",
        label: "an ordinary town",
        reveal: "A place like most places: some doors, some walls, a long way between them.",
        hardness: 1,
        weight: 1.2,
      },
      {
        id: "thin-options",
        label: "thin on options",
        reveal: "Getting anywhere took longer here; the map had fewer roads out.",
        gauge: { timeStructure: -1 },
        flags: ["thin-market"],
        hardness: 2,
        weight: 1,
      },
      {
        id: "isolating",
        label: "isolating",
        reveal: "Far from things, and it kept you far from things.",
        gauge: { timeStructure: -1, connection: -1 },
        flags: ["thin-market", "far-from-things"],
        hardness: 3,
        weight: 0.7,
      },
    ],
  },
];

/**
 * The household tilt (the conditional-draw rule, published on /methodology): a
 * later axis's value weight is multiplied by (1 + householdHardness * lean * 0.5),
 * where lean = (value.hardness - 1.5) / 1.5 ∈ [-1, 1]. A hard household bends the
 * later draws toward hard values; a resourced one bends them toward easy values.
 */
export const TILT_STRENGTH = 0.5;

