/**
 * The renderer's selection and formatting logic.
 *
 * NOTE FOR ANYONE MAINTAINING T-7: the gate deliberately does NOT import
 * `coversAge` from this file. It recomputes coverage from the records with its
 * own implementation and compares. If the gate imported this function it would
 * only be proving that a function equals itself.
 */
import {
  MAX_AGE,
  type Milestone,
  type Timing,
  type Lane,
  type MilestoneKind,
  type AgeRange,
} from "./schema.ts";

/**
 * Does this record's timing run through the YEAR `age`?
 *
 * A year is the half-open interval [age, age+1). A window overlaps it when it
 * starts before the year ends and ends at or after the year starts. Written as an
 * interval test rather than `from <= age <= to` because fractional ages are real:
 * a milestone at two months is `{from: 0.17, to: 0.17}`, and `0 >= 0.17` is false,
 * so the naive test dropped every infant milestone out of year zero entirely.
 */
const overlapsYear = (from: number, to: number, age: number) => from < age + 1 && to >= age;

export function coversAge(m: Milestone, age: number): boolean {
  const t = (m as { timing?: Timing }).timing;
  if (!t) return false;
  if (t.exact !== undefined && Math.floor(t.exact) === age) return true;
  if (t.variesByState && overlapsYear(t.variesByState.from, t.variesByState.to, age)) return true;
  if (t.window && overlapsYear(t.window.from, t.window.to, age)) return true;
  if (typeof t.typical === "number" && Math.floor(t.typical) === age) return true;
  if (t.typical && typeof t.typical === "object" && overlapsYear(t.typical.from, t.typical.to, age)) {
    return true;
  }
  return false;
}

/** A rule whose age IS this year (§3.5 section 2). */
export function ruleChangesAt(m: Milestone, age: number): boolean {
  if (m.kind !== "legal-threshold") return false;
  const t = (m as { timing?: Timing }).timing;
  if (!t) return false;
  if (t.exact !== undefined && Math.floor(t.exact) === age) return true;
  if (t.variesByState && overlapsYear(t.variesByState.from, t.variesByState.to, age)) return true;
  return false;
}

/** A window whose typical zone OPENS at this year (§3.5 section 3). */
export function beginsAt(m: Milestone, age: number): boolean {
  if (m.kind === "legal-threshold") return false;
  const t = (m as { timing?: Timing }).timing;
  if (!t) return false;
  if (typeof t.typical === "number") return Math.floor(t.typical) === age;
  if (t.typical && typeof t.typical === "object") return Math.floor(t.typical.from) === age;
  if (t.window) return Math.floor(t.window.from) === age;
  return false;
}

/** Everything still running through this year (§3.5 section 4). */
export function runningAt(m: Milestone, age: number): boolean {
  return coversAge(m, age) && !ruleChangesAt(m, age) && !beginsAt(m, age);
}

export type YearComposition = {
  age: number;
  rules: Milestone[];
  begins: Milestone[];
  running: Milestone[];
  heard: Milestone[];
  sensitive: Milestone[];
  /** True when sections 2, 3 and 5 are all empty (§3.5 item 7). */
  empty: boolean;
  /** Every record composed into this year, for the T-7 attribute. */
  all: Milestone[];
};

/** Compose one year from records. NO per-year prose exists, so no year can carry
 *  an invented event (§3.5, T-7). */
export function composeYear(milestones: Milestone[], age: number): YearComposition {
  // §5.4: a stage-intro note never appears on a year card. Life expectancy is a
  // figure about a population, not an event in a year.
  const covering = milestones.filter((m) => coversAge(m, age) && !isStageIntroNote(m));
  const rules = covering.filter((m) => ruleChangesAt(m, age));
  const begins = covering.filter((m) => beginsAt(m, age));
  const running = covering.filter((m) => runningAt(m, age));
  const heard = covering.filter((m) => m.kind === "cultural-expectation" && (m as { heard?: string[] }).heard?.length);
  const sensitive = covering.filter((m) => (m as { sensitivity?: string }).sensitivity);
  const empty = rules.length === 0 && begins.length === 0 && heard.length === 0;
  return { age, rules, begins, running, heard, sensitive, empty, all: covering };
}

export function composeAllYears(milestones: Milestone[]): YearComposition[] {
  const out: YearComposition[] = [];
  for (let age = 0; age <= MAX_AGE; age++) out.push(composeYear(milestones, age));
  return out;
}

/* ------------------------------------------------------- window formatting */

const EN_DASH = "–";

/**
 * An age, rendered the way a person says it.
 *
 * Below two years, in months — because "0.17" is not an age anybody has ever used
 * about a baby, and a developmental record that renders as a decimal reads like a
 * measurement of the child rather than a description of a population.
 * Half-years render as a half, because the statute that ends the additional
 * distribution tax really does say fifty-nine and a half.
 */
export function formatAge(n: number, opts: { halves?: boolean } = {}): string {
  if (n < 2) {
    const months = Math.round(n * 12);
    return months === 1 ? "1 month" : `${months} months`;
  }
  // A RULE is written the way the rule is written. The statute really does say
  // "fifty-nine and a half", and a licensing table really does say "14, 9 months" —
  // so a rule's fractional age renders in the units the rule uses, never as a
  // decimal, because "14.75" is an age no document states.
  //
  // A STATISTIC keeps its decimal: a mean age at first birth of 27.5 rendered "27½"
  // dresses a measurement up as a fraction.
  if (!Number.isInteger(n) && opts.halves) {
    const whole = Math.floor(n);
    if (Math.abs(n - whole - 0.5) < 0.01) return `${whole}½`;
    const months = Math.round((n - whole) * 12);
    if (Math.abs((n - whole) * 12 - months) < 0.06 && months > 0) {
      return `${whole} years ${months} months`;
    }
  }
  return String(n);
}

/**
 * The window, rendered as ages. Ages and windows render as ages (§4.5) — this is
 * the one place digits legitimately reach a timeline surface, and every element
 * that uses it carries `data-age-claim` + `data-source`.
 *
 * A `most-by` record renders THE SOURCE'S OWN SENTENCE SHAPE — "most children by
 * fifteen months" — and never a bare number. The public-health checklists this
 * measure comes from are explicit that they describe what most children do by an
 * age; a bare figure beside a developmental milestone reads as a deadline for one
 * child, which is exactly what §5.3 and the brief's §6A forbid.
 */
export function windowText(m: Milestone): string {
  const t = (m as { timing?: Timing }).timing;
  if (!t) return "";
  const measure = (m as { measure?: string }).measure;

  // A rule as written may use the vulgar fraction, because the statute does.
  const halves = measure === "legal-rule";
  if (t.variesByState) {
    const lo = formatAge(t.variesByState.from, { halves });
    const hi = formatAge(t.variesByState.to, { halves });
    // Some rules land on the same age in every state and vary in something else —
    // the cut-off DATE, typically. "varies by state, 5–5" is not a range, it is a
    // rendering bug; the variation is real and lives in the record's note.
    if (lo === hi) return `${lo}, varying by state`;
    // A compound bound ("14 years 9 months") needs a word, not a dash, or the
    // range reads as one run-on number.
    const sep = /\s/.test(lo) || /\s/.test(hi) ? " to " : EN_DASH;
    return `varies by state, ${lo}${sep}${hi}`;
  }
  if (t.remainingYears !== undefined && t.exact !== undefined) {
    return `at ${formatAge(t.exact)}, a further ${t.remainingYears} years on average`;
  }
  if (t.exact !== undefined) return formatAge(t.exact, { halves });

  // §3.4 (LITERAL): a legal threshold renders "an exact age, or a range where it
  // varies by state". windowText did not branch on kind, so a rule encoded with a
  // window instead of `exact` came out as "commonly around 18" — the vocabulary of
  // a statistical norm, on the one kind of age that is actually a line.
  if (m.kind === "legal-threshold") {
    if (t.typical && typeof t.typical === "object" && t.typical.from === t.typical.to) {
      return formatAge(t.typical.from, { halves });
    }
    if (typeof t.typical === "number") return formatAge(t.typical, { halves });
    if (t.window && t.window.from === t.window.to) return formatAge(t.window.from, { halves });
    if (t.window) {
      return `${formatAge(t.window.from, { halves })}${EN_DASH}${formatAge(t.window.to, { halves })}`;
    }
  }

  const point = (r?: AgeRange | number) => {
    if (r === undefined) return undefined;
    if (typeof r === "number") return r;
    return r.from === r.to ? r.from : undefined;
  };

  // "most children by N" — the checklist framing, said the way the checklist says it.
  if (measure === "most-by") {
    const at = point(t.typical) ?? point(t.window);
    if (at !== undefined) return `most by ${formatAge(at)}`;
    const to = (t.typical && typeof t.typical === "object" ? t.typical.to : undefined) ?? t.window?.to;
    if (to !== undefined) return `most by ${formatAge(to)}`;
  }

  if (t.typical && typeof t.typical === "object") {
    if (t.typical.from === t.typical.to) {
      const one = formatAge(t.typical.from);
      return measure === "median" ? `median ${one}` : `commonly around ${one}`;
    }
    const typical = `${formatAge(t.typical.from)}${EN_DASH}${formatAge(t.typical.to)}`;
    if (t.window && (t.window.from !== t.typical.from || t.window.to !== t.typical.to)) {
      return `commonly ${typical} (seen ${formatAge(t.window.from)}${EN_DASH}${formatAge(t.window.to)})`;
    }
    return `commonly ${typical}`;
  }
  if (typeof t.typical === "number") return `commonly around ${formatAge(t.typical)}`;
  if (t.window) {
    if (t.window.from === t.window.to) return `around ${formatAge(t.window.from)}`;
    return `${formatAge(t.window.from)}${EN_DASH}${formatAge(t.window.to)}`;
  }
  return "";
}

/** The compact form used in the "running through this year" list. */
export function compactWindow(m: Milestone): string {
  if ((m as { researchRequired?: boolean }).researchRequired) return "";
  return windowText(m);
}

/* ------------------------------------------------------------ lane display */

export const LANE_GLYPH: Record<Lane, string> = {
  "body-health": "●", // ●
  learning: "■", // ■
  "work-income": "▲", // ▲
  "money-wealth": "◆", // ◆
  "home-independence": "⌂", // ⌂
  "people-family": "○", // ○
  "civic-legal": "▬", // ▬
  "inner-life": "◇", // ◇
};

export const LANE_VAR: Record<Lane, string> = {
  "body-health": "var(--tl-lane-body)",
  learning: "var(--tl-lane-learning)",
  "work-income": "var(--tl-lane-work)",
  "money-wealth": "var(--tl-lane-money)",
  "home-independence": "var(--tl-lane-home)",
  "people-family": "var(--tl-lane-people)",
  "civic-legal": "var(--tl-lane-civic)",
  "inner-life": "var(--tl-lane-inner)",
};

/* ---------------------------------------------------- spine span geometry */

export type Span = {
  id: string;
  lane: Lane;
  kind: MilestoneKind;
  label: string;
  /** A legal tick: one age. */
  tick?: number;
  /** The outer extent. */
  from?: number;
  to?: number;
  /** The denser zone inside it. */
  typicalFrom?: number;
  typicalTo?: number;
  sensitive: boolean;
  /** Every drawn age claim carries its sources, exactly like a text one (T-1). */
  sources: string[];
  /**
   * How the record reads in words. The spine's tooltip used to render raw bounds —
   * "Putting two words together — 2 to 2" — on a record whose own standing line says
   * "a range bodies commonly move through, wide, and wider than most people think".
   * The graphic was arguing with the text. It now says what the text says.
   */
  when: string;
};

/** The compact geometry the client instrument draws. Content stays server-side. */
/** §5.4 — renders in a stage intro, never on the spine or in a year card. */
export function isStageIntroNote(m: Milestone): boolean {
  return (m as { renderAs?: string }).renderAs === "stage-intro-note";
}

export function toSpans(milestones: Milestone[]): Span[] {
  const out: Span[] = [];
  for (const m of milestones) {
    // §5.4: no death marker on the spine, and no "average age at death" as a milestone.
    if (isStageIntroNote(m)) continue;
    // §3.6: "Nothing on the spine is a point except a legal tick and the year cursor."
    // A cultural expectation is a thing PEOPLE SAY, not a thing that happens at an
    // age; drawing one as a crisp tick lends it the visual vocabulary reserved for a
    // rule, which is the exact confusion §3.4 exists to prevent. They render in the
    // year cards, set apart as quotation, and nowhere on the instrument.
    if (m.kind === "cultural-expectation") continue;
    const t = (m as { timing?: Timing }).timing;
    if (!t) continue;
    const sensitive = Boolean((m as { sensitivity?: string }).sensitivity);
    const base = {
      id: m.id,
      lane: m.lane,
      kind: m.kind,
      label: m.label,
      sensitive,
      sources: (m as { sources?: string[] }).sources ?? [],
      when: windowText(m),
    };
    if (t.exact !== undefined) {
      out.push({ ...base, tick: t.exact });
      continue;
    }
    if (t.variesByState) {
      out.push({ ...base, from: t.variesByState.from, to: t.variesByState.to });
      continue;
    }
    const from = t.window?.from ?? (typeof t.typical === "object" ? t.typical.from : t.typical);
    const to = t.window?.to ?? (typeof t.typical === "object" ? t.typical.to : t.typical);
    if (from === undefined || to === undefined) continue;
    const tf = typeof t.typical === "object" ? t.typical.from : typeof t.typical === "number" ? t.typical : undefined;
    const tt = typeof t.typical === "object" ? t.typical.to : typeof t.typical === "number" ? t.typical : undefined;
    out.push({ ...base, from, to, typicalFrom: tf, typicalTo: tt });
  }
  return out;
}

/* --------------------------------------------------------- small counts */

const SMALL = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen", "twenty",
];

/**
 * §4.5: "Small counts in prose are spelled out." The instrument's counts (lanes
 * shown, records diverging) are prose, not ages, so they must not render as
 * digits — T-1 allows a numeral on a timeline surface only inside a year header,
 * a navigation-convention stage band, or a sourced age claim, and a count is
 * none of those.
 */
export function spellCount(n: number): string {
  if (n >= 0 && n < SMALL.length) return SMALL[n];
  return String(n); // above twenty this would be a real number; no such count exists here
}
