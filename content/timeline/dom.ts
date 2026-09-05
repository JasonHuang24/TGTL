/**
 * The timeline's DOM contract — the single place the renderers and the T-gates
 * agree on markers.
 *
 * The 4.0 lesson that produced this file: a lint and the content it guards drift
 * apart the moment they are written twice. Every attribute the gates look for is
 * named here and imported by BOTH the component that emits it and the gate that
 * asserts it, so a rename cannot silently turn a gate green.
 */

/* ---- year and stage structure (T-7) ---- */

/** On each year section. Value: the age as a decimal string. */
export const ATTR_YEAR = "data-tl-year";
/** On the terminal "one hundred and beyond" card. */
export const ATTR_TERMINAL = "data-tl-terminal";
/** On a year section that rendered the honest empty state (§3.5 item 7). */
export const ATTR_EMPTY = "data-tl-empty";
/** On each year section: space-separated milestone ids composed into it (T-7). */
export const ATTR_YEAR_MILESTONES = "data-tl-milestones";
/** The anchor id for a year: #age-7 */
export const yearAnchor = (age: number) => `age-${age}`;

/* ---- claims and sources (T-1, T-11) ---- */

/**
 * On any element that renders an age or window derived from content.
 * Value: the milestone id the age came from.
 * EVERY numeral on a timeline surface must be inside one of: a year header, a
 * stage band, or an element carrying this. T-1 asserts exactly that.
 */
export const ATTR_AGE_CLAIM = "data-age-claim";
/** On the same element: space-separated Source ids that must resolve. */
export const ATTR_SOURCE = "data-source";
/** On a year header numeral (exempt from T-1's source requirement — it is the axis). */
export const ATTR_YEAR_HEADER = "data-tl-year-header";
/**
 * On a stage band's age numerals. Exempt from T-1 BY TYPE and by nothing else:
 * a stage band is a navigation convention that claims nothing (§3.3).
 */
export const ATTR_STAGE_BAND = "data-tl-stage-band";
/** On the three-part source stamp (§4.7). */
export const ATTR_STAMP = "data-tl-stamp";

/* ---- evidence drawers (T-8) ---- */

/**
 * The ONLY place a rate, percentage or proportion may render (§4.5).
 * Outside an element with this class, a timeline surface carries no rate at all.
 */
export const CLASS_EVIDENCE = "tl-evidence";
/** On an absolute base rendered beside a relative figure (§4.5). */
export const ATTR_ABSOLUTE_BASE = "data-tl-absolute-base";

/* ---- kinds (T-2) ---- */

/** On the element rendering a record's kind. Value: the MilestoneKind. */
export const ATTR_KIND = "data-tl-kind";
/** On the standing line rendered with that kind. */
export const ATTR_STANDING_LINE = "data-tl-standing-line";
/** On a cultural-expectation's quoted speech (§3.4b). */
export const ATTR_HEARD = "data-tl-heard";

/* ---- sensitive segments (T-6) ---- */

/** On a sensitive record's year-card segment and its milestone page. Value: the Sensitivity. */
export const ATTR_SENSITIVE = "data-tl-sensitive";
/** On the care note (§5.3). */
export const ATTR_CARE_NOTE = "data-tl-care-note";
/** On the real-page route beside a sensitive record. */
export const ATTR_READ_REF = "data-tl-read-ref";
/**
 * Chrome classes that must NEVER appear inside a sensitive segment (§5.3).
 * Reward/unlock treatment is withdrawn entirely on sensitive material.
 */
export const FORBIDDEN_SENSITIVE_CHROME = [
  "tl-unlock",
  "tl-reward",
  "tl-gate-chrome",
  "tl-achievement",
  "tl-trophy",
  "tl-badge",
];

/* ---- research-required (§4.6) ---- */

/** On a record rendering the calm "not yet sourced" state. Carries NO digit. */
export const ATTR_RESEARCH_REQUIRED = "data-tl-research-required";
export const RESEARCH_REQUIRED_LABEL = "not yet sourced";

/* ---- the instrument (T-14) ---- */

export const ATTR_CURSOR = "data-tl-cursor";
export const ATTR_LANE = "data-tl-lane";
export const ATTR_LENS = "data-tl-lens";
/** The single client storage key (T-5). Nothing else may be written. */
export const STORAGE_KEY = "tgtl:timeline";

/* ---- the one allowlisted block (T-3) ---- */

/** Re-exported from normative-lint so there is exactly one definition. */
export { LINT_ALLOWLIST_ATTR, LINT_ALLOWLIST_ID } from "./normative-lint.ts";
