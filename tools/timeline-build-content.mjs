/**
 * Timeline content compiler (5.0 blueprint §7.5).
 *
 * Authored JSON batches in `content/timeline/batches/` — each written by a
 * schema-constrained fetch-capable agent, re-verified by an adversarial agent
 * that re-fetched every source, repaired, and read in the rolling human review —
 * become typed TypeScript under `content/timeline/generated/`.
 *
 * It is a COMPILER, not a filter. It validates hard and refuses to emit when a
 * record breaks the schema, and every rejection NAMES THE RECORD. The 4.0 lesson
 * stands: a bad record fails the build; it is never silently dropped.
 *
 * The rule it exists to enforce above all others (§4.1):
 *   A NUMBER THAT WAS NOT READ ON A PAGE FETCHED DURING THIS BUILD IS INVENTED.
 * So: numeric timing without a resolving source is a hard error, prose fields may
 * not contain digits at all, and an excerpt must be <= 25 words and non-empty.
 *
 * Usage: node --experimental-strip-types tools/timeline-build-content.mjs
 *        (the flag is needed because this file imports the .ts lint lists, so the
 *         lint and the content cannot drift)
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { NORMATIVE_PATTERNS, normalizeForLint } from "../content/timeline/normative-lint.ts";
import { CRISIS_TIER, LOSS_TIER } from "../content/exclusions.ts";
import { SENSITIVITY_REQUIRED_ROUTES } from "../content/timeline/schema.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BATCH_DIR = join(ROOT, "content/timeline/batches");
const OUT_DIR = join(ROOT, "content/timeline/generated");

/** The build window. A source not retrieved inside it was not fetched by this build. */
const BUILD_WINDOW_START = "2026-09-03";
const BUILD_WINDOW_END = "2026-09-30";

const KINDS = [
  "biological-window",
  "legal-threshold",
  "institutional-sequence",
  "statistical-norm",
  "cultural-expectation",
];
const LANES = [
  "body-health",
  "learning",
  "work-income",
  "money-wealth",
  "home-independence",
  "people-family",
  "civic-legal",
  "inner-life",
];
const SENSITIVITIES = ["child-development", "puberty", "fertility", "health-decline", "dying"];
const SOURCE_KINDS = [
  "official-statistics",
  "statute-or-agency-rule",
  "peer-reviewed",
  "reputable-secondary",
];
const MEASURES = ["median", "mean", "typical-range", "most-by", "legal-rule", "share-at-age", "modal"];
const STATUSES = ["illustrative", "editorial", "researched"];
/** `calibrated` is deliberately ABSENT: it is reserved, and claiming it is an error. */
const EVIDENCE = [
  "evidence-informed",
  "contested",
  "insufficient-evidence",
  "illustrative",
  "speculative",
];

/** The live route inventory is content/routes.ts (route-inventory.json is the legacy
 *  2.0 list — see DECISIONS.md section 4A, F-2). Read paths from the source of truth. */
const ROUTES = new Set(
  [...readFileSync(join(ROOT, "content/routes.ts"), "utf8").matchAll(/path:\s*"([^"]+)"/g)].map(
    (m) => m[1],
  ),
);

const CRISIS_TERMS = Object.entries(CRISIS_TIER).flatMap(([domain, terms]) =>
  terms.map((t) => ({ domain, term: t })),
);
const LOSS_TERMS = Object.entries(LOSS_TIER).flatMap(([domain, terms]) =>
  terms.map((t) => ({ domain, term: t })),
);

const errors = [];
const notes = [];
const fail = (id, msg) => errors.push(`${id}: ${msg}`);

/* ------------------------------------------------------------------ helpers */

const words = (s) => s.trim().split(/\s+/).filter(Boolean);

/** Digits are forbidden in every prose field: numbers live in typed timing and excerpts only. */
function assertNoDigits(id, field, value) {
  if (typeof value !== "string") return;
  const m = value.match(/\d/);
  if (m) {
    fail(
      id,
      `prose field "${field}" contains a digit ("${value.slice(Math.max(0, m.index - 20), m.index + 20)}"). ` +
        `Numbers live only in typed timing fields and Source.excerpt (§4.5, AUTHORING.md). Spell small numbers out.`,
    );
  }
}

function lintNormativeField(id, field, value) {
  if (typeof value !== "string") return;
  const norm = normalizeForLint(value);
  for (const p of NORMATIVE_PATTERNS) {
    const m = norm.match(p.pattern);
    if (m) {
      fail(
        id,
        `normative language in "${field}": matched §5.1 entry "${p.entry}" on "${m[0]}". ${p.why} ` +
          `(The list is safety-relevant and may not be edited to make content pass.)`,
      );
    }
  }
}

function lintTiers(id, field, value, sensitivity) {
  if (typeof value !== "string") return;
  const norm = normalizeForLint(value);
  for (const { domain, term } of CRISIS_TERMS) {
    if (new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(norm)) {
      fail(
        id,
        `CRISIS-TIER term "${term}" (${domain}) in "${field}". §5.6: crisis-tier content appears nowhere on the timeline, with no exceptions.`,
      );
    }
  }
  // §5.4: loss-tier language passes ONLY inside records flagged dying or health-decline.
  const lossAllowed = sensitivity === "dying" || sensitivity === "health-decline";
  if (lossAllowed) return;
  for (const { domain, term } of LOSS_TERMS) {
    if (new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(norm)) {
      fail(
        id,
        `LOSS-TIER term "${term}" (${domain}) in "${field}" on a record whose sensitivity is ` +
          `${sensitivity ? `"${sensitivity}"` : "unset"}. §5.4: loss-tier language passes only inside ` +
          `records flagged "dying" or "health-decline".`,
      );
    }
  }
}

/** Every prose field gets all three lints. `heard` skips the normative one only (§3.4b). */
function proseField(id, field, value, sensitivity, { exemptNormative = false } = {}) {
  assertNoDigits(id, field, value);
  if (!exemptNormative) lintNormativeField(id, field, value);
  lintTiers(id, field, value, sensitivity);
}

function checkRoute(id, field, path) {
  if (!ROUTES.has(path)) {
    fail(id, `${field} "${path}" is not a route in content/routes.ts (§7.5: an unknown readRef fails the build).`);
  }
}

/* ------------------------------------------------------------------ sources */

function validateSource(s) {
  const id = s.id ?? "<source with no id>";
  if (!/^src-[a-z0-9-]+$/.test(id)) fail(id, `source id must match /^src-[a-z0-9-]+$/`);
  rejectUnknownKeys(id, s, SOURCE_KEYS, "source");
  for (const f of ["title", "publisher", "url", "measures", "retrievedOn", "excerpt"]) {
    if (typeof s[f] !== "string" || !s[f].trim()) fail(id, `source field "${f}" is required and non-empty`);
  }
  if (!SOURCE_KINDS.includes(s.kind)) fail(id, `source kind "${s.kind}" is not one of ${SOURCE_KINDS.join(" | ")}`);
  if (typeof s.url === "string" && !/^https?:\/\//.test(s.url)) fail(id, `source url must be an http(s) URL`);
  for (const f of ["publicationYear", "dataYear"]) {
    if (!Number.isInteger(s[f])) fail(id, `source field "${f}" must be an integer year (they are distinct — §4.3)`);
  }
  if (typeof s.excerpt === "string") {
    const n = words(s.excerpt).length;
    if (n === 0) fail(id, `excerpt is empty — §4.1 requires a verbatim excerpt CONTAINING the figure`);
    if (n > 25) fail(id, `excerpt is ${n} words; the limit is 25 (§4.1)`);
  }
  if (typeof s.retrievedOn === "string") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s.retrievedOn)) {
      fail(id, `retrievedOn "${s.retrievedOn}" must be an ISO date`);
    } else if (s.retrievedOn < BUILD_WINDOW_START || s.retrievedOn > BUILD_WINDOW_END) {
      fail(
        id,
        `retrievedOn "${s.retrievedOn}" is outside this build's window ` +
          `(${BUILD_WINDOW_START}..${BUILD_WINDOW_END}). §4.1: a number not read on a page fetched ` +
          `DURING THIS BUILD is an invented number.`,
      );
    }
  }
}

/* --------------------------------------------------------------- milestones */

function timingHasNumbers(t) {
  if (!t || typeof t !== "object") return false;
  return (
    typeof t.exact === "number" ||
    (t.variesByState && typeof t.variesByState === "object") ||
    (t.window && typeof t.window === "object") ||
    t.typical !== undefined
  );
}

function validateBranch(id, name, b, sensitivity, sourceIds) {
  if (!b || typeof b !== "object") return;
  proseField(id, `analysis.${name}.tends`, b.tends, sensitivity);
  if (typeof b.tends !== "string" || !b.tends.trim()) {
    fail(id, `analysis.${name} must carry a non-empty "tends" (the mechanism, descriptive)`);
  }
  const costs = Array.isArray(b.costs) ? b.costs : [];
  const routes = Array.isArray(b.routes) ? b.routes : [];
  costs.forEach((c, i) => proseField(id, `analysis.${name}.costs[${i}]`, c, sensitivity));
  routes.forEach((r, i) => proseField(id, `analysis.${name}.routes[${i}]`, r, sensitivity));
  if (costs.length > 0 && routes.length === 0) {
    fail(
      id,
      `analysis.${name} names ${costs.length} cost(s) and no route. §5.7 (T-4): recovery sits beside ` +
        `every cost — a branch that names a cost renders at least one recovery, alternative or re-entry route in the same view.`,
    );
  }
  if (b.evidence !== undefined && !EVIDENCE.includes(b.evidence)) {
    fail(id, `analysis.${name}.evidence "${b.evidence}" invalid${b.evidence === "calibrated" ? ` — "calibrated" is RESERVED (§6.1) and nothing on the timeline may claim it` : ""}`);
  }
  for (const sid of b.sources ?? []) {
    if (!sourceIds.has(sid)) fail(id, `analysis.${name}.sources references unknown source "${sid}"`);
  }
}

const MILESTONE_KEYS = new Set([
  "id", "label", "lane", "kind", "optional", "timing", "measure", "population", "measures",
  "bySex", "sensitivity", "careNote", "readRef", "alsoRead", "sources", "status", "evidence",
  "researchRequired", "researchNote", "windowInWords", "whatChanges", "heard", "affectsLater",
  "notes", "major", "analysis", "lastReviewed", "renderAs", "stageId",
]);
const SOURCE_KEYS = new Set([
  "id", "title", "publisher", "url", "kind", "publicationYear", "dataYear", "measures",
  "retrievedOn", "excerpt", "notes",
]);

/**
 * An unknown field is a hard error, not a shrug.
 *
 * A batch once carried a `notes` field the type did not have. The compiler emitted it
 * happily and `tsc` caught it at BUILD time instead — which is the wrong place, because
 * by then the failure is a type error about an object literal rather than a message
 * naming the record. If a field is worth authoring it belongs in the schema; if it is
 * not in the schema it is a typo, and a silently-carried typo is how a `sources` becomes
 * a `source` and a record loses its provenance without anyone noticing.
 */
function rejectUnknownKeys(id, obj, allowed, what) {
  for (const k of Object.keys(obj)) {
    if (k === "__file") continue;
    if (!allowed.has(k)) {
      fail(id, `unknown ${what} field "${k}". If it belongs, add it to content/timeline/schema.ts first — an unknown field is a typo until the type says otherwise.`);
    }
  }
}

function validateMilestone(m, sourceIds) {
  const id = m.id ?? "<milestone with no id>";
  if (!/^ms-[a-z0-9-]+$/.test(id)) fail(id, `milestone id must match /^ms-[a-z0-9-]+$/`);
  rejectUnknownKeys(id, m, MILESTONE_KEYS, "milestone");

  if (!KINDS.includes(m.kind)) {
    fail(
      id,
      `kind "${m.kind}" is not one of the five (§3.4). ` +
        `"strategic-recommendation" and "personal-target" are EXCLUDED BY TYPE — strategy lives on /guidance, personal targets are the reader's own.`,
    );
  }
  if (!LANES.includes(m.lane)) fail(id, `lane "${m.lane}" is not one of the eight (§7.2)`);
  if (typeof m.optional !== "boolean") fail(id, `"optional" is required (boolean) — it drives the §5.7 never-branch rule`);
  if (!STATUSES.includes(m.status)) fail(id, `status "${m.status}" is not one of ${STATUSES.join(" | ")}`);
  if (m.evidence === "calibrated") {
    fail(id, `claims evidence "calibrated". It is RESERVED (§6.1): nothing on this timeline is a value tuned to data.`);
  } else if (!EVIDENCE.includes(m.evidence)) {
    fail(id, `evidence "${m.evidence}" is not a valid label`);
  }
  if (typeof m.lastReviewed !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(m.lastReviewed)) {
    fail(id, `lastReviewed must be an ISO date`);
  }

  const sens = m.sensitivity;
  if (sens !== undefined && !SENSITIVITIES.includes(sens)) {
    fail(id, `sensitivity "${sens}" is not one of ${SENSITIVITIES.join(" | ")}`);
  }

  /* prose */
  if (typeof m.label !== "string" || !m.label.trim()) fail(id, `label is required`);
  proseField(id, "label", m.label, sens);
  for (const [i, w] of (m.whatChanges ?? []).entries()) {
    proseField(id, `whatChanges[${i}]`, w, sens);
    if (words(w).length > 40) fail(id, `whatChanges[${i}] is ${words(w).length} words; the limit is 40 (§7.4)`);
  }
  if ((m.whatChanges ?? []).length > 3) fail(id, `whatChanges has ${m.whatChanges.length} lines; the limit is 3 (§7.1)`);
  if (m.population !== undefined) proseField(id, "population", m.population, sens);
  if (m.careNote !== undefined) proseField(id, "careNote", m.careNote, sens);
  if (m.notes !== undefined) proseField(id, "notes", m.notes, sens);

  /* §3.4b — `heard` is cultural-expectation only, and is the ONE field exempt from T-3 */
  if (m.heard !== undefined) {
    if (m.kind !== "cultural-expectation") {
      fail(id, `carries "heard" but its kind is "${m.kind}". §3.4b: heard exists only on cultural-expectation records (T-2).`);
    }
    for (const [i, h] of m.heard.entries()) {
      // exempt from the normative lint BY DESIGN — it is quotation — but still
      // digit-free (§3.4b: cultural expectations carry no ages of their own) and
      // still inside the tier walls.
      proseField(id, `heard[${i}]`, h, sens, { exemptNormative: true });
    }
  } else if (m.kind === "cultural-expectation") {
    fail(id, `is a cultural-expectation record with no "heard". §3.4b: these render as quoted speech.`);
  }

  /* §4.1 — the cardinal rule, as a shape check */
  const hasNumbers = timingHasNumbers(m.timing);
  const srcs = Array.isArray(m.sources) ? m.sources : [];
  if (m.researchRequired === true) {
    if (m.timing !== undefined) {
      fail(id, `is researchRequired but carries "timing". §4.6: an unsourced record renders NO DIGIT — remove timing and state the window in words.`);
    }
    if (typeof m.researchNote !== "string" || !m.researchNote.trim()) {
      fail(id, `is researchRequired and must carry "researchNote" — the query that would resolve it (§4.3, KNOWN_LIMITATIONS).`);
    }
    if (typeof m.windowInWords !== "string" || !m.windowInWords.trim()) {
      fail(id, `is researchRequired and must carry "windowInWords" — the shape of the claim, no digits (§4.6).`);
    } else {
      proseField(id, "windowInWords", m.windowInWords, sens);
    }
    if (m.evidence !== "insufficient-evidence") {
      notes.push(`${id}: researchRequired records normally carry evidence "insufficient-evidence" (§6.1); this one carries "${m.evidence}".`);
    }
  } else {
    if (hasNumbers && srcs.length === 0) {
      fail(
        id,
        `HAS NUMERIC TIMING AND NO SOURCE. This is the cardinal rule (§4.1): a number that was not ` +
          `read on a page fetched during this build is an invented number. Either attach a Source with ` +
          `a verbatim excerpt containing the figure, or set researchRequired:true and drop the digits.`,
      );
    }
    if (!hasNumbers && srcs.length === 0 && m.kind !== "cultural-expectation") {
      fail(id, `has neither timing nor sources nor researchRequired:true. Every record must be one of the three shapes.`);
    }
    if (hasNumbers && (!m.measure || !MEASURES.includes(m.measure))) {
      fail(id, `has numeric timing but measure "${m.measure}" is missing or invalid. §4.3 requires the measure the source used (${MEASURES.join(" | ")}).`);
    }
    if (hasNumbers && (typeof m.population !== "string" || !m.population.trim())) {
      fail(id, `has numeric timing but no "population". §4.3: the population and its exclusions are part of the claim.`);
    }
  }
  for (const sid of srcs) {
    if (!sourceIds.has(sid)) fail(id, `references unknown source "${sid}"`);
  }

  /* timing shape */
  if (m.timing) {
    const t = m.timing;
    const ages = [];
    if (t.exact !== undefined) ages.push(t.exact);
    if (t.remainingYears !== undefined) {
      if (typeof t.remainingYears !== "number" || t.remainingYears <= 0 || t.remainingYears > 120) {
        fail(id, `timing.remainingYears must be a positive span of years`);
      }
      if (t.exact === undefined) {
        fail(id, `timing.remainingYears needs timing.exact — a remaining span is measured AT an age (§5.4)`);
      }
    }
    if (t.window) ages.push(t.window.from, t.window.to);
    if (t.variesByState) {
      ages.push(t.variesByState.from, t.variesByState.to);
      if (typeof t.variesByState.note !== "string" || !t.variesByState.note.trim()) {
        fail(id, `timing.variesByState must carry a "note" naming the variation (§3.4).`);
      }
    }
    if (typeof t.typical === "number") ages.push(t.typical);
    else if (t.typical) ages.push(t.typical.from, t.typical.to);
    for (const a of ages) {
      if (typeof a !== "number" || !Number.isFinite(a) || a < 0 || a > 120) {
        fail(id, `timing contains an age out of range: ${a}`);
      }
    }
    if (t.window && t.typical && typeof t.typical === "object") {
      if (t.typical.from < t.window.from || t.typical.to > t.window.to) {
        fail(id, `timing.typical [${t.typical.from}, ${t.typical.to}] is not inside timing.window [${t.window.from}, ${t.window.to}] — the typical zone is the denser part of the window.`);
      }
    }
    if (t.window && t.window.from > t.window.to) fail(id, `timing.window is inverted`);
    if (!ages.length) fail(id, `"timing" is present but carries no age`);
  }

  /* §3.8 / T-9 — the sex lens is honest by construction */
  if (m.bySex) {
    if (typeof m.bySex.measures !== "string" || !m.bySex.measures.trim()) {
      fail(id, `has "bySex" with no "measures". §3.8 (T-9): a divergence may render only when a source STATES what it measured (sex at birth, self-reported gender, or a mix).`);
    }
    if (!Array.isArray(m.bySex.sources) || m.bySex.sources.length === 0) {
      fail(id, `has "bySex" with no sources. §3.8: no record may carry bySex without such a source.`);
    }
    for (const sid of m.bySex.sources ?? []) {
      if (!sourceIds.has(sid)) fail(id, `bySex references unknown source "${sid}"`);
    }
  }

  /* §5.3 / T-6 — the sensitive segments */
  if (sens) {
    if (typeof m.careNote !== "string" || !m.careNote.trim()) {
      fail(id, `is sensitivity:"${sens}" and carries no careNote. §5.3: one calm sentence saying what this material is not and where the real route is.`);
    }
    const required = SENSITIVITY_REQUIRED_ROUTES[sens] ?? [];
    const have = new Set([m.readRef, ...(m.alsoRead ?? [])]);
    for (const r of required) {
      if (!have.has(r)) {
        fail(
          id,
          `is sensitivity:"${sens}" and does not route to "${r}". §5.3 requires it` +
            (sens === "dying" ? ` — the dying segment names /situations/a-death AND /situations/grief, both, and names them first.` : `.`),
        );
      }
    }
  }

  /* §5.4 — a stage-intro note (life expectancy) must name its stage */
  if (m.renderAs !== undefined) {
    if (m.renderAs !== "stage-intro-note") {
      fail(id, `renderAs "${m.renderAs}" is not valid; the only value is "stage-intro-note" (§5.4).`);
    }
    if (typeof m.stageId !== "string" || !m.stageId.trim()) {
      fail(id, `renderAs "stage-intro-note" requires "stageId" naming the stage whose intro carries it (§5.4).`);
    }
  } else if (m.stageId !== undefined) {
    fail(id, `carries "stageId" without "renderAs"; stageId only means something for a stage-intro note.`);
  }

  /* routes */
  if (typeof m.readRef !== "string" || !m.readRef.trim()) fail(id, `readRef is required on every record`);
  else checkRoute(id, "readRef", m.readRef);
  for (const r of m.alsoRead ?? []) checkRoute(id, "alsoRead", r);

  /* analysis */
  if (m.analysis) {
    for (const [name, b] of Object.entries(m.analysis)) validateBranch(id, name, b, sens, sourceIds);
    if (m.optional === true && !m.analysis.never) {
      fail(
        id,
        `is optional:true with an analysis and no "never" branch. §5.7 (T-4): for every optional record ` +
          `with an analysis, the never branch exists — never is a path, not a failure.`,
      );
    }
  }
  if (m.major === true && !m.analysis) {
    fail(id, `is major:true (it gets its own page at /timeline/${id}) but carries no analysis. §3.1: a milestone page is the timing analysis at full depth.`);
  }
}

/* ------------------------------------------------------------------- drive */

if (!existsSync(BATCH_DIR)) {
  console.error(`batch dir not found: ${BATCH_DIR}`);
  process.exit(2);
}

const files = readdirSync(BATCH_DIR).filter((f) => f.endsWith(".json")).sort();
const batches = [];
const allSources = new Map();
const allMilestones = new Map();
const allPatches = new Map();

for (const f of files) {
  let batch;
  try {
    batch = JSON.parse(readFileSync(join(BATCH_DIR, f), "utf8"));
  } catch (e) {
    errors.push(`${f}: not valid JSON — ${e.message}`);
    continue;
  }
  if (!batch.key) errors.push(`${f}: batch needs a "key"`);
  batches.push({ file: f, key: batch.key, batch });
  for (const s of batch.sources ?? []) {
    if (allSources.has(s.id)) errors.push(`${s.id}: duplicate source id (also in ${allSources.get(s.id).__file})`);
    else allSources.set(s.id, { ...s, __file: f });
  }
  for (const m of batch.milestones ?? []) {
    if (allMilestones.has(m.id)) errors.push(`${m.id}: duplicate milestone id (also in ${allMilestones.get(m.id).__file})`);
    else allMilestones.set(m.id, { ...m, __file: f });
  }
  // Phase-3 analysis patches. They live in their own batch files so the research
  // batches stay immutable and the two passes can be audited separately.
  for (const [mid, patch] of Object.entries(batch.analyses ?? {})) {
    if (allPatches.has(mid)) errors.push(`${mid}: duplicate analysis patch (also in ${allPatches.get(mid).__file})`);
    else allPatches.set(mid, { ...patch, __file: f });
  }
}

const sourceIds = new Set(allSources.keys());

// Apply analysis patches onto their records. A patch that names an unknown record,
// or that would overwrite an analysis the record already carries, is a hard error —
// a silently-dropped patch is a milestone page that quietly loses its routes.
for (const [mid, patch] of allPatches.entries()) {
  const target = allMilestones.get(mid);
  if (!target) {
    errors.push(`${mid}: analysis patch in ${patch.__file} names no known milestone`);
    continue;
  }
  if (target.analysis && patch.analysis) {
    errors.push(`${mid}: already has an analysis; the patch in ${patch.__file} would overwrite it`);
    continue;
  }
  if (patch.analysis) target.analysis = patch.analysis;
  if (patch.major !== undefined) target.major = patch.major;
  if (patch.affectsLater) {
    target.affectsLater = [...new Set([...(target.affectsLater ?? []), ...patch.affectsLater])];
  }
}

for (const s of allSources.values()) validateSource(s);
for (const m of allMilestones.values()) validateMilestone(m, sourceIds);

/* cross-record: affectsLater must resolve (T-10) */
for (const m of allMilestones.values()) {
  for (const other of m.affectsLater ?? []) {
    if (!allMilestones.has(other)) fail(m.id, `affectsLater references unknown milestone "${other}" (T-10)`);
    if (other === m.id) fail(m.id, `affectsLater references itself`);
  }
}

/* orphan sources are a pipeline smell, not an error */
const used = new Set();
for (const m of allMilestones.values()) {
  for (const s of m.sources ?? []) used.add(s);
  for (const s of m.bySex?.sources ?? []) used.add(s);
  for (const b of Object.values(m.analysis ?? {})) for (const s of b?.sources ?? []) used.add(s);
}
for (const id of sourceIds) if (!used.has(id)) notes.push(`${id}: source is not referenced by any record`);

if (errors.length) {
  console.error(`\nTIMELINE CONTENT COMPILER — REFUSED TO EMIT (${errors.length} error${errors.length === 1 ? "" : "s"})\n`);
  for (const e of errors) console.error("  ✗ " + e);
  console.error(`\nNothing was written. Fix the records above and re-run. (§7.5: a malformed record fails the build; it is never silently dropped.)\n`);
  process.exit(1);
}

/* ------------------------------------------------------------------- emit */

mkdirSync(OUT_DIR, { recursive: true });

const strip = (o) => {
  const { __file, ...rest } = o;
  return rest;
};
const sortedSources = [...allSources.values()].map(strip).sort((a, b) => a.id.localeCompare(b.id));
const sortedMilestones = [...allMilestones.values()].map(strip).sort((a, b) => a.id.localeCompare(b.id));

const header = `/**
 * GENERATED by tools/timeline-build-content.mjs — do not edit by hand.
 * Source: content/timeline/batches/*.json (${files.length} batch file${files.length === 1 ? "" : "s"}).
 * Every figure here was read on a page fetched during this build and re-verified
 * by a separate agent that re-fetched the source (§4.1, §4.4). The batch records,
 * verifier verdicts and repairs are in records/research-pipeline.md.
 */`;

writeFileSync(
  join(OUT_DIR, "sources.ts"),
  `${header}
import type { Source, SourceId } from "@/content/timeline/schema";

export const SOURCES: Record<SourceId, Source> = ${JSON.stringify(
    Object.fromEntries(sortedSources.map((s) => [s.id, s])),
    null,
    2,
  )};
`,
);

writeFileSync(
  join(OUT_DIR, "milestones.ts"),
  `${header}
import type { Milestone } from "@/content/timeline/schema";

export const MILESTONES: Milestone[] = ${JSON.stringify(sortedMilestones, null, 2)};
`,
);

// §3.1 — the generated milestone routes, appended to the inventory BY THE BUILD
// FROM THE REGISTRY. Gate 1 imports this so a link to a milestone page resolves
// against a list that is derived from the content rather than hand-maintained.
writeFileSync(
  join(OUT_DIR, "routes.ts"),
  `${header}
/** One route per \`major\` record, in id order. A page exists for these and for no other. */
export const TIMELINE_MILESTONE_ROUTES: string[] = ${JSON.stringify(
    sortedMilestones.filter((m) => m.major).map((m) => `/timeline/${m.id}`),
    null,
    2,
  )};
`,
);

writeFileSync(
  join(OUT_DIR, "index.ts"),
  `${header}
export { SOURCES } from "./sources.ts";
export { MILESTONES } from "./milestones.ts";
export { TIMELINE_MILESTONE_ROUTES } from "./routes.ts";

/** The batches that produced this pool, in compile order. */
export const BATCH_KEYS: string[] = ${JSON.stringify(batches.map((b) => b.key), null, 2)};
`,
);

const nResearchRequired = sortedMilestones.filter((m) => m.researchRequired === true).length;
const nSensitive = sortedMilestones.filter((m) => m.sensitivity).length;
const nMajor = sortedMilestones.filter((m) => m.major).length;
const nCultural = sortedMilestones.filter((m) => m.kind === "cultural-expectation").length;

console.log(
  `compiled ${sortedMilestones.length} milestones and ${sortedSources.length} sources across ${batches.length} batches\n` +
    `  research-required: ${nResearchRequired}   sensitive: ${nSensitive}   major: ${nMajor}   cultural-expectation: ${nCultural}`,
);
if (notes.length) for (const n of notes) console.log("  note: " + n);
