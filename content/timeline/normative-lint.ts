/**
 * The normative-language lint list (5.0 blueprint §5.1) — a SAFETY WALL.
 *
 * The site's own voice never says a reader should have done anything by any age.
 * This list is applied to every timeline content field except `heard` (§3.4b,
 * which is quotation and therefore exempt by design) and to every rendered
 * timeline surface except the single allowlisted "how to read this" block.
 *
 * ── CHANGING THIS LIST IS SAFETY-RELEVANT ──────────────────────────────────
 * §5.1 and §11: "Changing the list is safety-relevant: stop and ask, never
 * rebalance the lint to fit content." If content trips this lint, the content is
 * wrong. Nothing in this file may be loosened to make a record pass.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * The blueprint's list is fifteen entries "and their obvious variants". Each
 * entry below is one blueprint entry; every variant is annotated with the entry
 * it varies. No concept beyond the fifteen has been added.
 *
 * The 4.0 falsifiability lesson is applied: a fixed-phrase lint missed
 * "your **life** score" by one intervening word. Multi-word patterns here allow
 * intervening words where a reader would still hear the same sentence.
 */

export type NormativePattern = {
  /** The blueprint entry this enforces, verbatim from §5.1. */
  entry: string;
  /** Why this shape is forbidden — rendered in the gate's failure message. */
  why: string;
  /** Case-insensitive. Tested against normalized text (see normalizeForLint). */
  pattern: RegExp;
};

/**
 * Normalize before matching: collapse whitespace, fold typographic apostrophes
 * and dashes, lowercase. Without this, "you’re" and "you're" lint differently
 * and a line break hides a two-word phrase.
 */
export function normalizeForLint(text: string): string {
  return text
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[–—−]/g, "-")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/** Up to `n` intervening words, as a regex fragment. */
const gap = (n: number) => `(?:\\s+\\S+){0,${n}}\\s+`;

export const NORMATIVE_PATTERNS: NormativePattern[] = [
  {
    entry: "should have",
    why: "The site's voice never tells a reader what they should have done.",
    // variants: "should've", "should already have", "should have had"
    pattern: new RegExp(`\\bshould(?:'ve|\\s+have|\\s+already\\s+have)\\b`, "i"),
  },
  {
    entry: "should have (bare 'you should')",
    why: "A second-person 'should' is a recommendation, and the timeline is descriptive (§3.4).",
    // variant of "should have": the same instruction with the auxiliary dropped
    pattern: /\byou\s+should\b/i,
  },
  {
    entry: "by now",
    why: "'By now' asserts a deadline the reader has passed.",
    pattern: /\bby\s+now\b/i,
  },
  {
    entry: "behind",
    why: "§5.8: being off the common path is not being behind. The word is forbidden in the site's voice.",
    pattern: /\bbehind\b/i,
  },
  {
    entry: "on track",
    why: "'On track' implies a track. There is no schedule (§5.8).",
    // variants: "off track", "on-track"
    pattern: /\b(?:on|off)[\s-]track\b/i,
  },
  {
    entry: "falling behind",
    why: "Named separately in §5.1 so the failure message says which shape appeared.",
    pattern: new RegExp(`\\bfall(?:ing|s|en)?${gap(2)}behind\\b`, "i"),
  },
  {
    entry: "catch up with your peers",
    why: "Comparison to peers is exactly the pressure the timeline must not create.",
    // variants: "catch up to your peers", "catch up with everyone else"
    pattern: new RegExp(
      `\\bcatch(?:ing|es)?\\s+up${gap(3)}(?:peers|everyone\\s+else|the\\s+others)\\b`,
      "i",
    ),
  },
  {
    entry: "supposed to",
    why: "Only permitted inside `heard` (§3.4b), where it is quoted speech, never the site's claim.",
    pattern: /\bsupposed\s+to\b/i,
  },
  {
    entry: "expected to have",
    why: "'Expected' means common in a stated population, never required (§1, G-13).",
    // variants: "expected to be", "expected to already"
    pattern: new RegExp(`\\bexpected\\s+to\\s+(?:have|be|already)\\b`, "i"),
  },
  {
    entry: "normal people",
    why: "Sets a norm of persons rather than describing a population.",
    // variants: "normal person", "normal adults"
    pattern: /\bnormal\s+(?:people|person|adults?|children|kids)\b/i,
  },
  {
    entry: "late bloomer",
    why: "Frames a person as late against a schedule.",
    pattern: /\blate\s+bloomers?\b/i,
  },
  {
    entry: "ahead of schedule",
    why: "There is no schedule to be ahead of (§5.8).",
    pattern: new RegExp(`\\bahead${gap(2)}schedule\\b`, "i"),
  },
  {
    entry: "behind schedule",
    why: "There is no schedule to be behind (§5.8).",
    pattern: new RegExp(`\\bbehind${gap(2)}schedule\\b`, "i"),
  },
  {
    entry: "milestone score",
    why: "The reader is never scored (§5.2). The 4.0 lesson: allow intervening words.",
    // variants: "milestone completion score", "life score", "your score"
    pattern: new RegExp(`\\b(?:milestone|life|your)${gap(2)}score\\b`, "i"),
  },
  {
    entry: "keeping up",
    why: "Keeping up with what? There is no pace to keep.",
    // variants: "keep up with", "kept up"
    pattern: /\bkeep(?:ing|s)?\s+up\b|\bkept\s+up\b/i,
  },
  {
    entry: "your age group",
    why: "Addresses the reader as a member of a compared cohort (§5.2).",
    // variants: "at your age", "people your age", "for your age", "someone your age"
    pattern:
      /\byour\s+age\s+group\b|\b(?:at|for|by)\s+your\s+age\b|\b(?:people|someone|others|anyone)\s+your\s+age\b/i,
  },
];

/** A single hit. */
export type NormativeHit = { entry: string; why: string; match: string };

/** Every pattern that fires on `text`. */
export function lintNormative(text: string): NormativeHit[] {
  const norm = normalizeForLint(text);
  const hits: NormativeHit[] = [];
  for (const p of NORMATIVE_PATTERNS) {
    const m = norm.match(p.pattern);
    if (m) hits.push({ entry: p.entry, why: p.why, match: m[0] });
  }
  return hits;
}

/**
 * THE ALLOWLIST — exactly one entry (T-3 asserts the count is one).
 *
 * JUSTIFICATION (required by T-3, and the reason there can only be one):
 * the "how to read this" block at the top of /timeline is the single place that
 * must be able to say the words it forbids, because its whole job is to name the
 * pressure and refuse it. It carries §5.8's off-common line — "Being off the
 * common path is not being behind; there is no schedule." — which contains
 * "behind" precisely in order to negate it, and it explains the five kinds by
 * quoting the sentences readers arrive already carrying.
 *
 * It is identified in the DOM by this attribute and nothing else. Any other
 * timeline element carrying it is a T-3 failure, so the allowlist cannot spread.
 */
export const LINT_ALLOWLIST_ATTR = "data-tl-lint-allowlist";

/** The one allowlisted block's id value. Exactly one element may carry it. */
export const LINT_ALLOWLIST_ID = "how-to-read-this";

/**
 * Content fields exempt from the lint. `heard` is the ONLY one (§3.4b): it is
 * quoted social speech, set apart in a quotation treatment, under the standing
 * line "an expectation is a thing said to you, not a fact about you". Every other
 * field of the same record is linted.
 */
export const EXEMPT_CONTENT_FIELDS = ["heard"] as const;
