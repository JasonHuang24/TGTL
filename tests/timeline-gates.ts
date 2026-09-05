/**
 * The T suite — the timeline's automated gates (5.0 blueprint §8).
 *
 * Run: npm run gates:timeline   (needs `npm run build` first for the rendered halves)
 *
 * Every gate here has a content half, a rendered half, or both. A gate whose
 * subject does not exist yet reports N/A and becomes substantive at the phase
 * that introduces it (the 4.0 pattern, §9).
 *
 * A GATE IS NOT A CHECK UNTIL IT HAS BEEN SHOWN TO FAIL. T-1, T-3, T-4, T-6, T-7
 * and T-8 each have a plant-and-restore probe in tests/falsify-walls.sh, and each
 * is required to go red ON THE PLANT and to name the record the plant went into.
 */
import { existsSync, readFileSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ROOT, OUT_DIR, loadPages, textOf, extractHrefs, reportGate, type GateResult, type Page } from "./util.ts";
import { ROUTES } from "../content/routes.ts";
import {
  NORMATIVE_PATTERNS,
  normalizeForLint,
  LINT_ALLOWLIST_ATTR,
  LINT_ALLOWLIST_ID,
} from "../content/timeline/normative-lint.ts";
import { CRISIS_TIER, LOSS_TIER } from "../content/exclusions.ts";
import {
  KIND_STANDING_LINE,
  SENSITIVITY_REQUIRED_ROUTES,
  MAX_AGE,
  type Milestone,
  type Source,
  type SourceId,
} from "../content/timeline/schema.ts";
import { STAGES_TL } from "../content/timeline/stages.ts";
import {
  ATTR_YEAR,
  ATTR_TERMINAL,
  ATTR_EMPTY,
  ATTR_YEAR_MILESTONES,
  ATTR_AGE_CLAIM,
  ATTR_SOURCE,
  ATTR_YEAR_HEADER,
  ATTR_STAGE_BAND,
  ATTR_STAMP,
  CLASS_EVIDENCE,
  ATTR_KIND,
  ATTR_HEARD,
  ATTR_SENSITIVE,
  ATTR_CARE_NOTE,
  FORBIDDEN_SENSITIVE_CHROME,
  ATTR_RESEARCH_REQUIRED,
  STORAGE_KEY,
} from "../content/timeline/dom.ts";

const results: GateResult[] = [];
const NA: string[] = [];

/* ---------------------------------------------------------------- content */

const GEN = join(ROOT, "content/timeline/generated");
let MILESTONES: Milestone[] = [];
let SOURCES: Record<SourceId, Source> = {};
let contentPresent = false;
if (existsSync(join(GEN, "milestones.ts")) && existsSync(join(GEN, "sources.ts"))) {
  const mod = await import("../content/timeline/generated/index.ts");
  MILESTONES = mod.MILESTONES as Milestone[];
  SOURCES = mod.SOURCES as Record<SourceId, Source>;
  contentPresent = MILESTONES.length > 0;
}

/* --------------------------------------------------------------- rendered */

/**
 * T-16 — is the export we are about to grade actually current?
 *
 * A gate suite that reads a build artifact without checking the artifact is fresh
 * can certify a build that does not exist. An adversarial review caught exactly
 * that here: `components/timeline/YearCard.tsx` was newer than
 * `out/timeline/index.html`, so the rendered halves of six gates were validating an
 * export that no longer matched the components producing it — and would have gone
 * on reporting green indefinitely.
 */
function stalenessProblems(): string[] {
  const problems: string[] = [];
  const target = join(OUT_DIR, "timeline/index.html");
  if (!existsSync(target)) return problems;
  const builtAt = statSync(target).mtimeMs;
  const watched = [
    "app/timeline",
    "app/timeline.css",
    "components/timeline",
    "content/timeline/generated",
  ];
  const walk = (d: string, acc: string[] = []): string[] => {
    if (!existsSync(d)) return acc;
    if (!statSync(d).isDirectory()) {
      acc.push(d);
      return acc;
    }
    for (const e of readdirSync(d)) walk(join(d, e), acc);
    return acc;
  };
  for (const w of watched) {
    const base = join(ROOT, w);
    for (const f of walk(base)) {
      // a second of slack: the build itself writes while these are being read
      if (statSync(f).mtimeMs > builtAt + 1000) {
        problems.push(`${f.slice(ROOT.length + 1).split("\\").join("/")} is newer than out/timeline/index.html — the export is stale, so every rendered assertion below is grading an old build. Run the build again.`);
      }
    }
  }
  return problems.slice(0, 8);
}

const havePages = existsSync(OUT_DIR);
const pages: Page[] = havePages ? loadPages() : [];
const timelinePages = pages.filter((p) => p.route === "/timeline" || p.route.startsWith("/timeline/"));
const timelineIndex = pages.find((p) => p.route === "/timeline");
const renderedPresent = timelinePages.length > 0;

const validRoutes = new Set(ROUTES.map((r) => r.path));

/* ----------------------------------------------------------- tiny helpers */

/** All attribute values for `attr` in html, with the element's outer slice. */
function elementsWith(html: string, attr: string): { value: string; el: string }[] {
  const out: { value: string; el: string }[] = [];
  const re = new RegExp(`<([a-z0-9-]+)([^>]*\\s${attr}="([^"]*)"[^>]*)>`, "gi");
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) out.push({ value: m[3], el: m[0] });
  return out;
}

/** The inner HTML of every element carrying `attr`, matched by tag nesting depth. */
function segmentsWith(html: string, attr: string): { value: string; inner: string }[] {
  const out: { value: string; inner: string }[] = [];
  const open = new RegExp(`<([a-z0-9-]+)([^>]*?\\s${attr}="([^"]*)"[^>]*?)(/?)>`, "gi");
  let m: RegExpExecArray | null;
  while ((m = open.exec(html))) {
    const tag = m[1];
    const selfClosing = m[4] === "/";
    const start = m.index + m[0].length;
    if (selfClosing) {
      out.push({ value: m[3], inner: "" });
      continue;
    }
    // Walk forward counting same-tag opens/closes.
    const walker = new RegExp(`<(/?)${tag}\\b[^>]*?(/?)>`, "gi");
    walker.lastIndex = start;
    let depth = 1;
    let end = html.length;
    let w: RegExpExecArray | null;
    while ((w = walker.exec(html))) {
      if (w[2] === "/") continue; // self-closing, no depth change
      if (w[1] === "/") {
        depth--;
        if (depth === 0) {
          end = w.index;
          break;
        }
      } else depth++;
    }
    out.push({ value: m[3], inner: html.slice(start, end) });
  }
  return out;
}

/** Remove every element (and its content) carrying `attr`, so the remainder can be linted. */
function stripSegmentsWith(html: string, attr: string): string {
  let out = html;
  for (const seg of segmentsWith(out, attr)) {
    if (seg.inner) out = out.split(seg.inner).join(" ");
  }
  // also drop the opening tags themselves
  return out.replace(new RegExp(`<[a-z0-9-]+[^>]*\\s${attr}="[^"]*"[^>]*>`, "gi"), " ");
}

function stripClass(html: string, cls: string): string {
  let out = html;
  const re = new RegExp(`<([a-z0-9-]+)([^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*)>`, "gi");
  let guard = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(out)) && guard++ < 5000) {
    const tag = m[1];
    const start = m.index;
    const afterOpen = m.index + m[0].length;
    const walker = new RegExp(`<(/?)${tag}\\b[^>]*?(/?)>`, "gi");
    walker.lastIndex = afterOpen;
    let depth = 1;
    let end = out.length;
    let w: RegExpExecArray | null;
    while ((w = walker.exec(out))) {
      if (w[2] === "/") continue;
      if (w[1] === "/") {
        depth--;
        if (depth === 0) {
          end = w.index + w[0].length;
          break;
        }
      } else depth++;
    }
    out = out.slice(0, start) + " " + out.slice(end);
    re.lastIndex = 0;
  }
  return out;
}

const CRISIS_TERMS = Object.entries(CRISIS_TIER).flatMap(([d, ts]) => ts.map((t) => ({ d, t })));
const LOSS_TERMS = Object.entries(LOSS_TIER).flatMap(([d, ts]) => ts.map((t) => ({ d, t })));
const wordRe = (t: string) => new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");

/**
 * Text OUTSIDE any element the caller allows, using a real tag stack.
 *
 * The regex version of this that came first was wrong in a way worth recording:
 * it removed an allowed element's opening tag and inner text but left the
 * closing tag behind, so every later strip mis-counted depth and evidence
 * drawers leaked their statute citations into the "stray numeral" check. A
 * scanner that actually tracks nesting is the only honest way to ask "is this
 * text inside a drawer?".
 */
const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
  "param", "source", "track", "wbr", "path", "circle", "rect", "line", "polygon",
  "polyline", "ellipse", "use", "stop",
]);

function textOutside(html: string, isAllowed: (tag: string, attrs: string) => boolean): string {
  const out: string[] = [];
  let i = 0;
  let skipDepth = 0; // >0 while inside an allowed element
  const stack: string[] = [];
  while (i < html.length) {
    const lt = html.indexOf("<", i);
    if (lt === -1) {
      if (skipDepth === 0) out.push(html.slice(i));
      break;
    }
    if (skipDepth === 0 && lt > i) out.push(html.slice(i, lt));

    if (html.startsWith("<!--", lt)) {
      const end = html.indexOf("-->", lt);
      i = end === -1 ? html.length : end + 3;
      continue;
    }
    const gt = html.indexOf(">", lt);
    if (gt === -1) break;
    const raw = html.slice(lt + 1, gt);
    i = gt + 1;

    if (raw.startsWith("!")) continue; // doctype
    const closing = raw.startsWith("/");
    const body = closing ? raw.slice(1) : raw;
    const m = body.match(/^([a-zA-Z][a-zA-Z0-9-]*)([\s\S]*)$/);
    if (!m) continue;
    const tag = m[1].toLowerCase();
    const attrs = m[2] ?? "";
    const selfClosing = attrs.trimEnd().endsWith("/");

    if (tag === "script" || tag === "style") {
      if (!closing && !selfClosing) {
        const close = html.toLowerCase().indexOf(`</${tag}`, i);
        i = close === -1 ? html.length : html.indexOf(">", close) + 1;
      }
      continue;
    }

    if (closing) {
      // pop to the matching open
      for (let k = stack.length - 1; k >= 0; k--) {
        if (stack[k] === tag) {
          const popped = stack.length - k;
          for (let n = 0; n < popped; n++) stack.pop();
          break;
        }
      }
      if (skipDepth > 0 && stack.length < skipDepth) skipDepth = 0;
      continue;
    }

    if (VOID_TAGS.has(tag) || selfClosing) {
      // a void/self-closing element carries no text; its attrs are not text
      continue;
    }

    stack.push(tag);
    if (skipDepth === 0 && isAllowed(tag, attrs)) skipDepth = stack.length;
  }
  return out
    .join(" ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&#x27;|&rsquo;|&lsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** The containers in which a numeral is legitimate on a timeline surface (T-1). */
/**
 * The `.tl-page` subtree — the timeline's OWN rendered region.
 *
 * T-1 governs what the timeline renders. The shared site chrome and footer appear
 * on every page in the build and carry the build's version string; they are not
 * timeline surfaces and are not this gate's business.
 */
function timelineRegion(html: string): string {
  const open = html.search(/<div[^>]*class="[^"]*\btl-page\b[^"]*"[^>]*>/);
  if (open === -1) return html;
  const startTagEnd = html.indexOf(">", open) + 1;
  let depth = 1;
  const walker = /<(\/?)div\b[^>]*?(\/?)>/g;
  walker.lastIndex = startTagEnd;
  let m: RegExpExecArray | null;
  while ((m = walker.exec(html))) {
    if (m[2] === "/") continue;
    if (m[1] === "/") {
      depth--;
      if (depth === 0) return html.slice(startTagEnd, m.index);
    } else depth++;
  }
  return html.slice(startTagEnd);
}

const NUMERAL_OK = (tag: string, attrs: string) =>
  attrs.includes(ATTR_YEAR_HEADER) ||
  attrs.includes(ATTR_STAGE_BAND) ||
  attrs.includes(ATTR_AGE_CLAIM) ||
  attrs.includes(ATTR_STAMP) ||
  /class="[^"]*\btl-evidence\b/.test(attrs) ||
  /class="[^"]*\btl-stamp\b/.test(attrs) ||
  /class="[^"]*\btl-not-sourced\b/.test(attrs) ||
  // The standing crisis note (§5.6) carries a hotline number, and its wording is
  // LITERAL inherited law ("In the US, call or text 988"). A hotline is not an age
  // claim and must never be suppressed to satisfy a numeral rule about ages.
  /class="[^"]*\bcrisis-note\b/.test(attrs);

/** Every prose string on a record, with a field path, EXCEPT `heard` (§3.4b). */
function proseFields(m: Milestone): { path: string; text: string }[] {
  const out: { path: string; text: string }[] = [];
  const push = (p: string, v: unknown) => {
    if (typeof v === "string" && v.trim()) out.push({ path: p, text: v });
  };
  push("label", m.label);
  push("population", (m as any).population);
  push("careNote", (m as any).careNote);
  push("researchNote", (m as any).researchNote);
  push("windowInWords", (m as any).windowInWords);
  push("measures", (m as any).measures);
  ((m as any).whatChanges ?? []).forEach((w: string, i: number) => push(`whatChanges[${i}]`, w));
  const a: any = (m as any).analysis;
  if (a) {
    for (const [name, b] of Object.entries<any>(a)) {
      if (!b) continue;
      push(`analysis.${name}.tends`, b.tends);
      (b.costs ?? []).forEach((c: string, i: number) => push(`analysis.${name}.costs[${i}]`, c));
      (b.routes ?? []).forEach((r: string, i: number) => push(`analysis.${name}.routes[${i}]`, r));
    }
  }
  const t: any = (m as any).timing;
  if (t?.variesByState?.note) push("timing.variesByState.note", t.variesByState.note);
  return out;
}

/* ================================================================= T-1 ==== */
{
  const details: string[] = [];
  let ok = true;
  if (!contentPresent) {
    NA.push("T-1 (no compiled timeline content yet)");
  } else {
    let numeric = 0;
    for (const m of MILESTONES) {
      const hasTiming = Boolean((m as any).timing);
      if (hasTiming) {
        numeric++;
        const srcs: string[] = (m as any).sources ?? [];
        if (srcs.length === 0) {
          ok = false;
          details.push(`${m.id}: numeric timing with NO source (§4.1 cardinal rule)`);
        }
        for (const sid of srcs) {
          const s = SOURCES[sid];
          if (!s) {
            ok = false;
            details.push(`${m.id}: source "${sid}" does not resolve`);
            continue;
          }
          if (!s.excerpt || !s.excerpt.trim()) {
            ok = false;
            details.push(`${m.id}: source "${sid}" has an empty excerpt`);
          }
          if (!s.retrievedOn || !s.retrievedOn.trim()) {
            ok = false;
            details.push(`${m.id}: source "${sid}" has no retrievedOn`);
          }
        }
      } else if ((m as any).researchRequired !== true) {
        // no timing and not research-required is only OK for a pure cultural expectation
        if (m.kind !== "cultural-expectation") {
          ok = false;
          details.push(`${m.id}: no timing, no sources, and researchRequired is not true`);
        }
      }
      if ((m as any).evidence === "calibrated") {
        ok = false;
        details.push(`${m.id}: claims evidence "calibrated", which is RESERVED (§6.1)`);
      }
    }
    details.unshift(`${MILESTONES.length} records; ${numeric} carry numeric timing, each traced to a Source with an excerpt and a retrieval date.`);

    // rendered half
    if (renderedPresent) {
      for (const p of timelinePages) {
        for (const { value, el } of elementsWith(p.html, ATTR_AGE_CLAIM)) {
          const srcAttr = el.match(new RegExp(`${ATTR_SOURCE}="([^"]*)"`));
          const ids = (srcAttr?.[1] ?? "").split(/\s+/).filter(Boolean);
          const m = MILESTONES.find((x) => x.id === value);
          if (!m) {
            ok = false;
            details.push(`${p.route}: ${ATTR_AGE_CLAIM}="${value}" names no known milestone`);
            continue;
          }
          if ((m as any).researchRequired === true) continue;
          // §8 T-1, LITERAL: "every element carrying data-age-claim on any timeline
          // surface carries a data-source that resolves".
          //
          // This was briefly relaxed to "the record has sources somewhere", so the
          // compact lines could drop the attribute and save page weight. An
          // adversarial review named that correctly as a gate rebalanced to fit
          // content — the move the doctrine forbids everywhere else. It is restored
          // per element, and the per-record check further down is KEPT as an
          // addition rather than a replacement, so the suite is now strictly
          // stronger than before either change.
          if (ids.length === 0) {
            ok = false;
            details.push(`${p.route}: ${ATTR_AGE_CLAIM}="${value}" carries no ${ATTR_SOURCE} (§8 T-1 is per element)`);
          }
          for (const sid of ids) {
            if (!SOURCES[sid]) {
              ok = false;
              details.push(`${p.route}: ${ATTR_AGE_CLAIM}="${value}" cites unresolvable source "${sid}"`);
            }
          }
        }
        // Every numeral on a timeline surface sits in a year header, a
        // navigation-convention stage band, a sourced age claim, a source stamp,
        // an evidence drawer, or the calm not-yet-sourced label. Nowhere else.
        const txt = textOutside(timelineRegion(p.html), NUMERAL_OK);
        const stray = txt.match(/\d[\d,.]*/g) ?? [];
        // Years (four digits, 19xx/20xx) are allowed prose per §4.5.
        const bad = stray.filter((n) => !/^(19|20)\d{2}$/.test(n.replace(/[.,]/g, "")));
        if (bad.length) {
          if (process.env.TL_DEBUG) {
            for (const n of bad.slice(0, 10)) {
              const at = txt.indexOf(n);
              console.log("DEBUG stray:", JSON.stringify(n), "->", JSON.stringify(txt.slice(Math.max(0, at - 110), at + 40)));
            }
          }
          ok = false;
          details.push(
            `${p.route}: ${bad.length} numeral(s) outside a year header, stage band, age-claim, stamp or evidence drawer: ${bad.slice(0, 8).join(", ")}`,
          );
        }
      }
      // Every sourced record must render its FULL source list at least once across
      // the timeline, so "traceable through the record" is a real route rather than
      // a promise. This is what makes the lighter pointer markup honest.
      {
        const rendered = new Set<string>();
        for (const p of timelinePages) {
          for (const { el } of elementsWith(p.html, ATTR_SOURCE)) {
            const claim = el.match(new RegExp(`${ATTR_AGE_CLAIM}="([^"]*)"`));
            if (claim) rendered.add(claim[1]);
          }
        }
        const missing = MILESTONES.filter(
          (m) => ((m as { sources?: string[] }).sources?.length ?? 0) > 0 && !rendered.has(m.id),
        );
        if (missing.length) {
          ok = false;
          details.push(
            `${missing.length} sourced record(s) never render their source list anywhere on the timeline: ${missing.slice(0, 6).map((m) => m.id).join(", ")}`,
          );
        }
      }
      details.push(`rendered: every age numeral on ${timelinePages.length} timeline page(s) sits in a year header, a navigation-convention stage band, an age claim, a source stamp, or an evidence drawer; and every sourced record renders its full source list at least once.`);
    }
  }
  if (contentPresent) results.push({ id: 1, name: "T-1 · Source traceability (a number without a fetched source is an invented number)", pass: ok, details });
}

/* ================================================================= T-2 ==== */
{
  const details: string[] = [];
  let ok = true;
  if (!contentPresent) NA.push("T-2 (no compiled timeline content yet)");
  else {
    const KINDS = Object.keys(KIND_STANDING_LINE);
    for (const m of MILESTONES) {
      if (!KINDS.includes(m.kind)) {
        ok = false;
        details.push(`${m.id}: kind "${m.kind}" is not one of the five`);
      }
      if ((m as any).heard && m.kind !== "cultural-expectation") {
        ok = false;
        details.push(`${m.id}: carries "heard" but is kind "${m.kind}" (§3.4b)`);
      }
      if (m.kind === "cultural-expectation" && !((m as any).heard ?? []).length) {
        ok = false;
        details.push(`${m.id}: cultural-expectation with no quoted speech`);
      }
    }
    // The excluded two cannot be expressed: assert the type has no such arm.
    const schemaSrc = readFileSync(join(ROOT, "content/timeline/schema.ts"), "utf8");
    const kindBlock = schemaSrc.slice(schemaSrc.indexOf("export type MilestoneKind"), schemaSrc.indexOf("KIND_STANDING_LINE"));
    for (const forbidden of ["strategic-recommendation", "personal-target"]) {
      if (new RegExp(`\\|\\s*"${forbidden}"`).test(kindBlock)) {
        ok = false;
        details.push(`MilestoneKind has a "${forbidden}" arm — the two excluded kinds must be inexpressible (§3.4)`);
      }
    }
    if (renderedPresent) {
      const kindsSeen = new Set<string>();
      for (const p of timelinePages) for (const { value } of elementsWith(p.html, ATTR_KIND)) kindsSeen.add(value);
      for (const k of kindsSeen) {
        const line = (KIND_STANDING_LINE as Record<string, string>)[k];
        if (!line) {
          ok = false;
          details.push(`rendered kind "${k}" is not one of the five`);
          continue;
        }
        const anywhere = timelinePages.some((p) => textOf(p.html).includes(line));
        if (!anywhere) {
          ok = false;
          details.push(`kind "${k}" renders without its standing line ("${line.slice(0, 40)}…")`);
        }
      }
      details.push(`rendered kinds: ${[...kindsSeen].sort().join(", ") || "none"} — each with its standing line.`);
    }
    const counts: Record<string, number> = {};
    for (const m of MILESTONES) counts[m.kind] = (counts[m.kind] ?? 0) + 1;
    details.unshift(`five kinds only; the two excluded kinds are inexpressible in the type. ${Object.entries(counts).map(([k, n]) => `${k}:${n}`).join("  ")}`);
    results.push({ id: 2, name: "T-2 · Kind discipline (five kinds; strategy and personal targets excluded by type)", pass: ok, details });
  }
}

/* ================================================================= T-3 ==== */
{
  const details: string[] = [];
  let ok = true;
  let fields = 0;
  const detailsAtStart = details.length;
  if (contentPresent) {
    for (const m of MILESTONES) {
      for (const { path, text } of proseFields(m)) {
        fields++;
        const norm = normalizeForLint(text);
        for (const p of NORMATIVE_PATTERNS) {
          const hit = norm.match(p.pattern);
          if (hit) {
            ok = false;
            details.push(`${m.id}.${path}: §5.1 entry "${p.entry}" matched "${hit[0]}"`);
          }
        }
      }
    }
    const recordHits = details.length - detailsAtStart;
    details.push(
      `content: ${fields} prose fields across ${MILESTONES.length} records checked against the §5.1 list ` +
        `(\`heard\` exempt by design — it is quotation): ${recordHits === 0 ? "clean" : `${recordHits} VIOLATION(S) above`}.`,
    );
  } else NA.push("T-3 content half — milestones (no compiled timeline content yet)");

  // Stage intros are timeline content and are linted like everything else (§5.1).
  {
    let stageFields = 0;
    const stageDetailsAtStart = details.length;
    for (const s of STAGES_TL) {
      for (const [i, para] of [s.short, ...s.intro].entries()) {
        stageFields++;
        const norm = normalizeForLint(para);
        for (const p of NORMATIVE_PATTERNS) {
          const hit = norm.match(p.pattern);
          if (hit) {
            ok = false;
            details.push(`stage ${s.id} prose[${i}]: §5.1 entry "${p.entry}" matched "${hit[0]}"`);
          }
        }
        if (/\d/.test(para)) {
          ok = false;
          details.push(`stage ${s.id} prose[${i}]: contains a digit — a stage carries no number but its band (§3.3)`);
        }
      }
    }
    const stageHits = details.length - stageDetailsAtStart;
    details.push(
      `content: ${stageFields} stage prose fields across ${STAGES_TL.length} stages checked against the §5.1 list and for digits: ` +
        `${stageHits === 0 ? "clean" : `${stageHits} VIOLATION(S) above`}.`,
    );
  }

  if (renderedPresent) {
    let allowlisted = 0;
    for (const p of timelinePages) {
      const marks = elementsWith(p.html, LINT_ALLOWLIST_ATTR);
      allowlisted += marks.length;
      for (const mk of marks) {
        if (mk.value !== LINT_ALLOWLIST_ID) {
          ok = false;
          details.push(`${p.route}: allowlist attribute carries "${mk.value}", not "${LINT_ALLOWLIST_ID}"`);
        }
      }
      // §3.4b: `heard` is the ONE field exempt from this lint, because it is
      // quotation — the whole point of a cultural-expectation record is to show the
      // reader the sentence they already have in their head, set apart, under the
      // line "an expectation is a thing said to you, not a fact about you". The
      // exemption has to hold on the RENDERED surface too, or the site could hold a
      // quote in content and not be allowed to print it.
      const rest = stripSegmentsWith(stripSegmentsWith(p.html, LINT_ALLOWLIST_ATTR), ATTR_HEARD);
      const txt = normalizeForLint(textOf(rest));
      for (const pat of NORMATIVE_PATTERNS) {
        const hit = txt.match(pat.pattern);
        if (hit) {
          ok = false;
          details.push(`${p.route}: rendered surface has §5.1 "${pat.entry}" — matched "${hit[0]}" outside the allowlisted block`);
        }
      }
    }
    if (allowlisted !== 1) {
      ok = false;
      details.push(`the allowlist must have EXACTLY ONE entry across the timeline; found ${allowlisted} (T-3)`);
    }
    details.push(`rendered: ${timelinePages.length} timeline page(s) clean of the §5.1 list outside the one allowlisted "${LINT_ALLOWLIST_ID}" block.`);
  } else NA.push("T-3 rendered half (no built timeline pages yet)");

  // Always substantive: the stage prose exists from Phase 0 onward.
  results.push({ id: 3, name: "T-3 · Normative-language lint (the site's voice never says a reader should have)", pass: ok, details });
}

/* ================================================================= T-4 ==== */
{
  const details: string[] = [];
  let ok = true;
  if (!contentPresent) NA.push("T-4 (no compiled timeline content yet)");
  else {
    /*
     * N-379 — T-4 IS EXTENDED, NOT RELAXED.
     *
     * A route entry may now be a bare sentence or `{ route, grade }`. The
     * PREDICATE is untouched: a branch that names a cost still has to render at
     * least one route in the same view, and a route still has to be a non-empty
     * sentence. What changed is the ACCESSOR — the gate reads through the grade
     * to the sentence instead of demanding a string. A grade never satisfies the
     * rule on its own; `{ grade: "closed" }` with no sentence fails exactly as a
     * missing route always has, and so does `{ route: "" }`.
     */
    const GRADES = ["easy", "costly", "partial", "closed"];
    const routeSentence = (r: any): string | null => {
      if (typeof r === "string") return r;
      if (r && typeof r === "object" && typeof r.route === "string") return r.route;
      return null;
    };
    let branches = 0;
    let withCosts = 0;
    let nevers = 0;
    let graded = 0;
    for (const m of MILESTONES) {
      const a: any = (m as any).analysis;
      if (!a) continue;
      for (const [name, b] of Object.entries<any>(a)) {
        if (!b) continue;
        branches++;
        const costs: string[] = b.costs ?? [];
        const routes: any[] = b.routes ?? [];
        if (costs.length) {
          withCosts++;
          if (routes.length === 0) {
            ok = false;
            details.push(`${m.id}.analysis.${name}: names ${costs.length} cost(s) and no route (§5.7)`);
          }
        }
        for (const r of routes) {
          const text = routeSentence(r);
          if (text === null) {
            ok = false;
            details.push(
              `${m.id}.analysis.${name}: a route entry is neither a sentence nor { route, grade } — a grade describes a route and never replaces one (N-379)`,
            );
            continue;
          }
          if (!text.trim()) {
            ok = false;
            details.push(`${m.id}.analysis.${name}: empty route`);
          }
          if (typeof r === "object" && r !== null) {
            graded++;
            if (!GRADES.includes(r.grade)) {
              ok = false;
              details.push(
                `${m.id}.analysis.${name}: route grade "${r.grade}" is not one of ${GRADES.join(" | ")} (N-379)`,
              );
            }
          }
        }
      }
      if ((m as any).optional === true && a) {
        if (!a.never) {
          ok = false;
          details.push(`${m.id}: optional with an analysis and no "never" branch (§5.7 — never is a path, not a failure)`);
        } else nevers++;
      }
    }
    details.push(
      `${branches} branches; ${withCosts} name a cost and every one of them renders a route in the same view; ` +
        `${nevers} optional records carry a "never" branch; ${graded} route(s) carry a grade, ` +
        `each of which still carries its own sentence (N-379 extends the accessor, never the predicate).`,
    );
    results.push({ id: 4, name: "T-4 · Recovery adjacency & never-is-not-failure", pass: ok, details });
  }
}

/* ================================================================= T-5 ==== */
{
  const details: string[] = [];
  let ok = true;
  const { readdirSync: rd, statSync: st } = await import("node:fs");
  const srcFiles: string[] = [];
  const walk = (d: string) => {
    if (!existsSync(d)) return;
    for (const e of rd(d)) {
      const full = join(d, e);
      if (st(full).isDirectory()) walk(full);
      else if (/\.(ts|tsx)$/.test(e)) srcFiles.push(full);
    }
  };
  walk(join(ROOT, "components/timeline"));
  walk(join(ROOT, "app/timeline"));
  if (!srcFiles.length) NA.push("T-5 (no timeline components yet)");
  else {
    for (const f of srcFiles) {
      const src = readFileSync(f, "utf8");
      const rel = f.slice(ROOT.length + 1).split("\\").join("/");
      // storage: exactly one key
      const keys = [...src.matchAll(/["'`](tgtl:[a-z0-9:-]+)["'`]/gi)].map((m) => m[1]);
      for (const k of keys) {
        if (k !== STORAGE_KEY) {
          ok = false;
          details.push(`${rel}: touches storage key "${k}"; the timeline's only key is "${STORAGE_KEY}" (T-5)`);
        }
      }
      if (/<textarea/i.test(src)) {
        ok = false;
        details.push(`${rel}: contains a <textarea> — no free-text input on the timeline (S-6 extended)`);
      }
      if (/<input(?![^>]*type="(checkbox|radio|range)")/i.test(src)) {
        ok = false;
        details.push(`${rel}: contains a free <input> — controls are enumerated (T-5)`);
      }
      for (const bad of ["yourAge", "readerAge", "childAge", "birthYear", "dateOfBirth", "enterYourAge"]) {
        if (new RegExp(`\\b${bad}\\b`).test(src)) {
          ok = false;
          details.push(`${rel}: identifier "${bad}" suggests the reader is being asked for an age (§5.2)`);
        }
      }
    }
    details.push(
      `${srcFiles.length} timeline sources: one storage key ("${STORAGE_KEY}"), no free-text input, ` +
        `no control that takes a reader's or a child's age. The age selector is view position only.`,
    );
    results.push({ id: 5, name: "T-5 · No reader computation (the reader is never assessed)", pass: ok, details });
  }
}

/* ================================================================= T-6 ==== */
{
  const details: string[] = [];
  let ok = true;
  if (!contentPresent) NA.push("T-6 (no compiled timeline content yet)");
  else {
    const sensitive = MILESTONES.filter((m) => (m as any).sensitivity);
    for (const m of sensitive) {
      const s = (m as any).sensitivity as keyof typeof SENSITIVITY_REQUIRED_ROUTES;
      if (!(m as any).careNote?.trim()) {
        ok = false;
        details.push(`${m.id}: sensitivity "${s}" with no careNote (§5.3)`);
      }
      const have = new Set<string>([(m as any).readRef, ...((m as any).alsoRead ?? [])]);
      for (const r of SENSITIVITY_REQUIRED_ROUTES[s] ?? []) {
        if (!have.has(r)) {
          ok = false;
          details.push(`${m.id}: sensitivity "${s}" does not route to ${r} (§5.3)`);
        }
      }
      for (const r of have) {
        if (r && !validRoutes.has(r)) {
          ok = false;
          details.push(`${m.id}: readRef "${r}" is not a real route`);
        }
      }
    }
    // loss-tier language only inside dying / health-decline (§5.4)
    for (const m of MILESTONES) {
      const s = (m as any).sensitivity;
      const lossAllowed = s === "dying" || s === "health-decline";
      for (const { path, text } of proseFields(m)) {
        for (const { d, t } of CRISIS_TERMS) {
          if (wordRe(t).test(text)) {
            ok = false;
            details.push(`${m.id}.${path}: CRISIS-TIER "${t}" (${d}) — crisis content is nowhere on the timeline (§5.6)`);
          }
        }
        if (lossAllowed) continue;
        for (const { d, t } of LOSS_TERMS) {
          if (wordRe(t).test(text)) {
            ok = false;
            details.push(`${m.id}.${path}: LOSS-TIER "${t}" (${d}) outside a dying/health-decline record (§5.4)`);
          }
        }
      }
    }
    if (renderedPresent) {
      for (const p of timelinePages) {
        for (const seg of segmentsWith(p.html, ATTR_SENSITIVE)) {
          for (const cls of FORBIDDEN_SENSITIVE_CHROME) {
            if (new RegExp(`\\b${cls}\\b`).test(seg.inner)) {
              ok = false;
              details.push(`${p.route}: sensitive segment "${seg.value}" contains forbidden chrome class "${cls}" (§5.3)`);
            }
          }
          if (!new RegExp(ATTR_CARE_NOTE).test(seg.inner)) {
            ok = false;
            details.push(`${p.route}: sensitive segment "${seg.value}" renders no care note (§5.3)`);
          }
        }
      }
    }
    // §5.4 — no "average age at death" as a milestone, and no death marker on the
    // spine. A record placed in a stage intro must not reach a year card or a span.
    const stageIntroNotes = MILESTONES.filter((m) => (m as any).renderAs === "stage-intro-note");
    const stageIds = new Set(STAGES_TL.map((x) => x.id));
    for (const m of stageIntroNotes) {
      const sid = (m as any).stageId;
      if (!sid || !stageIds.has(sid)) {
        ok = false;
        details.push(`${m.id}: renderAs "stage-intro-note" names stage "${sid}", which is not a stage (§5.4)`);
      }
    }
    if (renderedPresent && timelineIndex) {
      for (const m of stageIntroNotes) {
        for (const sec of segmentsWith(timelineIndex.html, ATTR_YEAR_MILESTONES)) {
          if (sec.value.split(/\s+/).includes(m.id)) {
            ok = false;
            details.push(`${m.id} appears in a year card's milestone set; §5.4 places it in a stage intro and nowhere else`);
            break;
          }
        }
      }
      // The spine draws spans and ticks from the same ids; none may be a stage-intro note.
      for (const m of stageIntroNotes) {
        const drawn = new RegExp(`${ATTR_AGE_CLAIM}="${m.id}"[^>]*>\s*<(line|rect)`).test(timelineIndex.html);
        if (drawn) {
          ok = false;
          details.push(`${m.id} is drawn on the spine; §5.4 forbids a death marker or average-age-at-death mark there`);
        }
      }
      details.push(
        `${stageIntroNotes.length} record(s) render in a stage intro only — off the spine and out of every year card (§5.4: life expectancy renders once, with its scope stated).`,
      );
    }

    // Stage intros obey the same tier walls. Only the terminal card may carry
    // loss-tier language, and it may because it IS the dying segment (§5.4).
    for (const s of STAGES_TL) {
      const lossAllowed = s.sensitivity === "dying";
      for (const [i, para] of [s.short, ...s.intro].entries()) {
        for (const { d, t } of CRISIS_TERMS) {
          if (wordRe(t).test(para)) {
            ok = false;
            details.push(`stage ${s.id} prose[${i}]: CRISIS-TIER "${t}" (${d}) — crisis content is nowhere on the timeline (§5.6)`);
          }
        }
        if (lossAllowed) continue;
        for (const { d, t } of LOSS_TERMS) {
          if (wordRe(t).test(para)) {
            ok = false;
            details.push(`stage ${s.id} prose[${i}]: LOSS-TIER "${t}" (${d}) outside the dying card (§5.4)`);
          }
        }
      }
      if (s.sensitivity === "dying") {
        for (const r of ["/situations/a-death", "/situations/grief"]) {
          if (!(s.readRefs ?? []).includes(r)) {
            ok = false;
            details.push(`stage ${s.id}: the dying card must name ${r} first (§5.4)`);
          }
        }
      }
    }

    const bySens: Record<string, number> = {};
    for (const m of sensitive) bySens[(m as any).sensitivity] = (bySens[(m as any).sensitivity] ?? 0) + 1;
    details.unshift(
      `${sensitive.length} sensitive records — ${Object.entries(bySens).map(([k, n]) => `${k}:${n}`).join("  ") || "none"} — ` +
        `each with a care note and the real page; loss-tier language confined to dying/health-decline; crisis tier nowhere.`,
    );
    results.push({ id: 6, name: "T-6 · Sensitive quiet (care note, real page, no game chrome)", pass: ok, details });
  }
}

/* ================================================================= T-7 ==== */
{
  const details: string[] = [];
  let ok = true;
  if (!contentPresent || !renderedPresent || !timelineIndex) NA.push("T-7 (needs compiled content and a built /timeline)");
  else {
    /**
     * INDEPENDENT IMPLEMENTATION (§8 T-7). This deliberately does NOT import the
     * renderer's selector: it recomputes, from the records, which milestones cover
     * each age, and compares against what the page actually rendered. If both were
     * the same function, the gate would only prove the function equals itself.
     */
    const coversIndependently = (m: Milestone, age: number): boolean => {
      const t: any = (m as any).timing;
      if (!t) return false;
      // A year is [age, age+1). A window belongs to it when the two intervals
      // overlap. Two disagreements between this and the renderer have already been
      // caught here and both were real: a fractional statutory age (fifty-nine and
      // a half) landing in no year at all, and every infant milestone (two months,
      // nine months) falling out of year zero because `0 >= 0.17` is false.
      const overlaps = (from: number, to: number) => from < age + 1 && to >= age;
      if (typeof t.exact === "number" && Math.floor(t.exact) === age) return true;
      if (t.variesByState && overlaps(t.variesByState.from, t.variesByState.to)) return true;
      if (t.window && overlaps(t.window.from, t.window.to)) return true;
      if (typeof t.typical === "number" && Math.floor(t.typical) === age) return true;
      if (t.typical && typeof t.typical === "object" && overlaps(t.typical.from, t.typical.to)) return true;
      return false;
    };

    const yearSections = segmentsWith(timelineIndex.html, ATTR_YEAR);
    const seenYears = new Set(yearSections.map((s) => Number(s.value)));
    for (let age = 0; age <= MAX_AGE; age++) {
      if (!seenYears.has(age)) {
        ok = false;
        details.push(`/timeline renders no section for age ${age} (§3.2: every year, 0 through ${MAX_AGE})`);
      }
    }
    if (!new RegExp(ATTR_TERMINAL).test(timelineIndex.html)) {
      ok = false;
      details.push(`/timeline renders no terminal "and beyond" card (§3.3)`);
    }

    let mismatches = 0;
    let empty = 0;
    for (const sec of yearSections) {
      const age = Number(sec.value);
      const declared = new Set(
        (timelineIndex.html.match(new RegExp(`${ATTR_YEAR}="${age}"[^>]*${ATTR_YEAR_MILESTONES}="([^"]*)"`))?.[1] ?? "")
          .split(/\s+/)
          .filter(Boolean),
      );
      const expected = new Set(
        MILESTONES
          // §5.4 — a record placed in a stage intro (life expectancy) is deliberately
          // not on the spine and not in any year card. Encoded here independently
          // rather than imported, because that is the whole point of this gate.
          .filter((m) => (m as any).renderAs !== "stage-intro-note")
          .filter((m) => coversIndependently(m, age))
          .map((m) => m.id),
      );
      const missing = [...expected].filter((x) => !declared.has(x));
      const extra = [...declared].filter((x) => !expected.has(x));
      if (missing.length || extra.length) {
        mismatches++;
        if (mismatches <= 6) {
          ok = false;
          details.push(
            `age ${age}: rendered set != independently computed set` +
              (missing.length ? ` — missing ${missing.slice(0, 4).join(",")}` : "") +
              (extra.length ? ` — extra ${extra.slice(0, 4).join(",")}` : ""),
          );
        }
      }
      if (new RegExp(`${ATTR_YEAR}="${age}"[^>]*${ATTR_EMPTY}="1"`).test(timelineIndex.html)) empty++;
    }
    if (mismatches > 6) details.push(`…and ${mismatches - 6} more year mismatches`);

    // longest run of empty years before 90
    let longest = 0;
    let run = 0;
    let longestAt = -1;
    for (let age = 0; age < 90; age++) {
      const isEmpty = new RegExp(`${ATTR_YEAR}="${age}"[^>]*${ATTR_EMPTY}="1"`).test(timelineIndex.html);
      if (isEmpty) {
        run++;
        if (run > longest) {
          longest = run;
          longestAt = age - run + 1;
        }
      } else run = 0;
    }
    if (longest > 3) {
      ok = false;
      details.push(`a stretch of ${longest} consecutive empty years starts at age ${longestAt}; §7.3 allows at most three before ninety`);
    }
    details.unshift(
      `all ${MAX_AGE + 1} years plus the terminal card render; the rendered milestone set for every year equals an ` +
        `independently computed set; ${empty} year(s) render the honest empty state; longest empty run before ninety: ${longest}.`,
    );
    results.push({ id: 7, name: "T-7 · Year coverage & derivation (no year carries an invented event)", pass: ok, details });
  }
}

/* ================================================================= T-8 ==== */
{
  const details: string[] = [];
  let ok = true;
  if (!renderedPresent) NA.push("T-8 (no built timeline pages yet)");
  else {
    for (const p of timelinePages) {
      // Scoped to the timeline's own region for the same reason T-1 is: the shared
      // footer carries the build's version string ("TGTL 4.0"), renders on all 32
      // routes, and is not timeline content.
      const region = timelineRegion(p.html);
      const outside = stripClass(region, CLASS_EVIDENCE)
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ");
      const txt = textOf(outside);
      if (/%/.test(txt)) {
        ok = false;
        details.push(`${p.route}: a percent sign renders outside an evidence drawer (§4.5)`);
      }
      const nInM = txt.match(/\b\d+\s+(?:in|out of)\s+\d+\b/i);
      if (nInM) {
        ok = false;
        details.push(`${p.route}: "${nInM[0]}" renders outside an evidence drawer (§4.5)`);
      }
      // A DECIMAL AGE IS NOT A RATE. A median age at first marriage really is 30.8,
      // a median age at menarche really is 11.9, and §4.5's rule is about rates and
      // proportions, not about ages. So the decimal check runs over what is left
      // after the sourced age claims are removed — which is exactly the text that
      // has no business carrying a decimal at all.
      const outsideAges = stripSegmentsWith(outside, ATTR_AGE_CLAIM);
      const decimal = textOf(outsideAges).match(/\b\d+\.\d+\b/);
      if (decimal) {
        ok = false;
        details.push(`${p.route}: decimal rate "${decimal[0]}" outside an evidence drawer or a sourced age claim (§4.5)`);
      }
      const adjacency = txt.match(
        /\b\d[\d,.]*\s*(?:percent|per cent)\b|\b(?:chance|likelihood|probability|odds|risk|rate)\s+(?:of\s+)?\d/i,
      );
      if (adjacency) {
        ok = false;
        details.push(`${p.route}: a digit adjacent to a likelihood word ("${adjacency[0]}") outside an evidence drawer (§4.5)`);
      }
      // Inside drawers: §4.5 says "absolute over relative — where a rate is shown in
      // a drawer it is the absolute figure; a RELATIVE-RISK figure never renders
      // without its absolute base beside it." An absolute percentage standing alone
      // is what the rule ASKS for, so only a relative construction needs a base.
      const RELATIVE = /\b(?:times (?:more|less|as) likely|twice as|three times|half as likely|relative risk|odds ratio|compared with .{0,40}\bmore likely)\b/i;
      for (const seg of segmentsWith(p.html, "class")) {
        if (!/\btl-evidence\b/.test(seg.value)) continue;
        if (RELATIVE.test(textOf(seg.inner)) && !new RegExp("data-tl-absolute-base").test(seg.inner)) {
          ok = false;
          details.push(`${p.route}: an evidence drawer shows a rate with no absolute base beside it (§4.5, brief §9)`);
        }
      }
    }
    details.push(
      `${timelinePages.length} timeline page(s): no percentage, no "N in M", no decimal rate and no digit adjacent to a ` +
        `likelihood word outside \`.${CLASS_EVIDENCE}\`; ages and windows render as ages.`,
    );
    results.push({ id: 8, name: "T-8 · No numbers on the surface (rates live in drawers; the surface carries a band)", pass: ok, details });
  }
}

/* ================================================================= T-9 ==== */
{
  const details: string[] = [];
  let ok = true;
  if (!contentPresent) NA.push("T-9 (no compiled timeline content yet)");
  else {
    const diverging = MILESTONES.filter((m) => (m as any).bySex);
    for (const m of diverging) {
      const b: any = (m as any).bySex;
      if (!b.measures?.trim()) {
        ok = false;
        details.push(`${m.id}: bySex with no "measures" (§3.8)`);
      }
      const srcs: string[] = b.sources ?? [];
      if (!srcs.length) {
        ok = false;
        details.push(`${m.id}: bySex with no source (§3.8 — no record may carry bySex without one)`);
      }
      for (const sid of srcs) {
        const s = SOURCES[sid];
        if (!s) {
          ok = false;
          details.push(`${m.id}: bySex cites unresolvable source "${sid}"`);
        } else if (!s.measures?.trim()) {
          ok = false;
          details.push(`${m.id}: bySex source "${sid}" does not state what it measured`);
        }
      }
    }
    if (renderedPresent && timelineIndex) {
      const txt = textOf(timelineIndex.html);
      const claimed = txt.match(/(\d+)\s+records?\s+diverge/i);
      if (claimed && Number(claimed[1]) !== diverging.length) {
        ok = false;
        details.push(`the lens note says ${claimed[1]} diverging records; the content has ${diverging.length}`);
      }
    }

    /*
     * N-386 — THE SAME DISCIPLINE, EXTENDED FROM `measures` TO `timing`.
     *
     * T-9 has always said: a record may not claim a difference unless its source
     * stated what it measured. The expectation channel needs the same rule about
     * WHEN the source was speaking, for the same reason — a source that is
     * looking back at what people used to expect is evidence about the present
     * perception of a past expectation, and nostalgia is the source most likely
     * to be cited here and least likely to be true.
     *
     * EXTENDED, NEVER RELAXED: the `measures` requirement above is untouched and
     * this is added beside it. The requirement follows the CITATION rather than
     * the source, because the same page can be an ordinary statistical source
     * for one record and a claim of a different kind when cited about an
     * expectation.
     */
    const TIMINGS = ["contemporaneous", "retrospective"];
    const expectationRecords = MILESTONES.filter((m) => (m as any).kind === "cultural-expectation");
    let citedPairs = 0;
    let retrospectiveCited = 0;
    for (const m of expectationRecords) {
      const cited = new Set<string>([
        ...(((m as any).sources ?? []) as string[]),
        ...(((m as any).bySex?.sources ?? []) as string[]),
        ...Object.values<any>((m as any).analysis ?? {}).flatMap((b: any) => (b?.sources ?? []) as string[]),
      ]);
      for (const sid of cited) {
        const s: any = SOURCES[sid];
        if (!s) {
          ok = false;
          details.push(`${m.id}: cites unresolvable source "${sid}"`);
          continue;
        }
        citedPairs++;
        if (!s.timing) {
          ok = false;
          details.push(
            `${m.id}: cultural-expectation record citing source "${sid}", which does not state its timing ` +
              `(contemporaneous | retrospective) — N-386`,
          );
        } else if (!TIMINGS.includes(s.timing)) {
          ok = false;
          details.push(`${m.id}: source "${sid}" has timing "${s.timing}", which is not one of ${TIMINGS.join(" | ")}`);
        } else if (s.timing === "retrospective") {
          retrospectiveCited++;
        }
      }
    }
    if (renderedPresent && retrospectiveCited > 0 && timelineIndex) {
      // Where a retrospective source is cited, the label has to reach a reader.
      const anyRendered = /data-tl-source-timing="retrospective"/.test(timelineIndex.html);
      if (!anyRendered) {
        details.push(
          `note: ${retrospectiveCited} retrospective citation(s) exist and none renders on /timeline itself; ` +
            `the label renders on the milestone pages, which this gate does not read.`,
        );
      }
    }

    details.unshift(
      `${diverging.length} record(s) carry a sourced sex-lens divergence, each with a source that states what it measured; ` +
        `the rendered count equals the content count. ` +
        `${expectationRecords.length} cultural-expectation record(s) make ${citedPairs} source citation(s), ` +
        `every one of which states when the source was speaking (${retrospectiveCited} retrospective).`,
    );
    results.push({ id: 9, name: "T-9 · Sex-lens honesty (a divergence only where a source says what it measured)", pass: ok, details });
  }
}

/* ================================================================ T-10 ==== */
{
  const details: string[] = [];
  let ok = true;
  if (!contentPresent) NA.push("T-10 (no compiled timeline content yet)");
  else {
    const ids = new Set(MILESTONES.map((m) => m.id));
    for (const m of MILESTONES) {
      for (const other of (m as any).affectsLater ?? []) {
        if (!ids.has(other)) {
          ok = false;
          details.push(`${m.id}: affectsLater "${other}" does not resolve`);
        }
      }
      const refs = [(m as any).readRef, ...((m as any).alsoRead ?? [])].filter(Boolean);
      for (const r of refs) {
        if (!validRoutes.has(r)) {
          ok = false;
          details.push(`${m.id}: readRef "${r}" is not in the route inventory`);
        }
      }
    }
    const majors = MILESTONES.filter((m) => (m as any).major).map((m) => m.id);
    if (renderedPresent) {
      const rendered = new Set(
        timelinePages.filter((p) => p.route.startsWith("/timeline/")).map((p) => p.route.slice("/timeline/".length)),
      );
      for (const id of majors) {
        if (!rendered.has(id)) {
          ok = false;
          details.push(`major record ${id} has no page at /timeline/${id} (§3.1)`);
        }
      }
      for (const r of rendered) {
        if (!majors.includes(r)) {
          ok = false;
          details.push(`/timeline/${r} exists but its record is not major — pages exist for major records AND FOR NO OTHER (§3.1)`);
        }
      }
      // every internal link off a timeline page resolves to a real route
      for (const p of timelinePages) {
        for (const href of extractHrefs(p.html)) {
          if (!href.startsWith("/")) continue;
          // build assets and static files are not routes
          if (href.startsWith("/_next/") || /\.(css|js|png|svg|ico|webmanifest|txt|xml)$/.test(href)) continue;
          const target = href.split("#")[0].split("?")[0].replace(/\/$/, "") || "/";
          if (target.startsWith("/timeline")) continue;
          if (!validRoutes.has(target)) {
            ok = false;
            details.push(`${p.route}: links to "${href}", which is not in the route inventory`);
          }
        }
      }
    }
    details.unshift(`every affectsLater and readRef resolves; ${majors.length} major record(s), each with a page, and no page without one.`);
    results.push({ id: 10, name: "T-10 · Reference integrity", pass: ok, details });
  }
}

/* ================================================================ T-11 ==== */
{
  const details: string[] = [];
  let ok = true;
  if (!contentPresent) NA.push("T-11 (no compiled timeline content yet)");
  else {
    const ids = Object.keys(SOURCES);
    for (const id of ids) {
      const s = SOURCES[id];
      if (!Number.isInteger(s.publicationYear)) { ok = false; details.push(`${id}: no publicationYear`); }
      if (!Number.isInteger(s.dataYear)) { ok = false; details.push(`${id}: no dataYear`); }
      if (!s.retrievedOn || !/^\d{4}-\d{2}-\d{2}$/.test(s.retrievedOn)) { ok = false; details.push(`${id}: retrievedOn is not an ISO date`); }
      const n = (s.excerpt ?? "").trim().split(/\s+/).filter(Boolean).length;
      if (n === 0) { ok = false; details.push(`${id}: empty excerpt`); }
      if (n > 25) { ok = false; details.push(`${id}: excerpt is ${n} words (limit 25)`); }
    }
    if (renderedPresent) {
      const stamped = timelinePages.reduce((a, p) => a + elementsWith(p.html, ATTR_STAMP).length, 0);
      if (contentPresent && MILESTONES.some((m) => (m as any).sources?.length) && stamped === 0) {
        ok = false;
        details.push(`no source stamp renders on any timeline page (§4.7 requires data/published/checked on every sourced record)`);
      }
      details.push(`${stamped} rendered source stamp(s).`);
    }
    details.unshift(`${ids.length} sources: each with publication year, data year, an ISO retrieval date and a non-empty excerpt of at most twenty-five words.`);
    results.push({ id: 11, name: "T-11 · Source freshness & stamps", pass: ok, details });
  }
}

/* ================================================================ T-12 ==== */
{
  const details: string[] = [];
  let ok = true;
  const { readdirSync, statSync } = await import("node:fs");
  const collect = (d: string, acc: string[] = []): string[] => {
    if (!existsSync(d)) return acc;
    for (const e of readdirSync(d)) {
      const full = join(d, e);
      if (statSync(full).isDirectory()) collect(full, acc);
      else if (/\.(ts|tsx)$/.test(e)) acc.push(full);
    }
    return acc;
  };
  const playSide = [
    ...collect(join(ROOT, "lib/sim")),
    ...collect(join(ROOT, "lib/engine")),
    ...collect(join(ROOT, "components/sim")),
    ...collect(join(ROOT, "components/play")),
  ];
  for (const f of playSide) {
    const src = readFileSync(f, "utf8");
    const rel = f.slice(ROOT.length + 1).split("\\").join("/");
    if (/from\s+["'][^"']*(content\/timeline|components\/timeline)/.test(src)) {
      ok = false;
      details.push(`${rel}: imports timeline content into the play layer (§3.10 — sourced population numbers must never leak into a play surface)`);
    }
  }
  const timelineSide = [...collect(join(ROOT, "components/timeline")), ...collect(join(ROOT, "app/timeline")), ...collect(join(ROOT, "content/timeline"))];
  for (const f of timelineSide) {
    const src = readFileSync(f, "utf8");
    const rel = f.slice(ROOT.length + 1).split("\\").join("/");
    if (/from\s+["'][^"']*(lib\/sim|lib\/engine|components\/sim|components\/play)/.test(src)) {
      ok = false;
      details.push(`${rel}: timeline module imports sim/play state (§3.10)`);
    }
    if (/tgtl:(sim|campaign|arc|run|play)/.test(src)) {
      ok = false;
      details.push(`${rel}: timeline module touches a play storage key (§3.10)`);
    }
  }
  details.push(
    `${playSide.length} play-layer sources import nothing from content/timeline or components/timeline; ` +
      `${timelineSide.length} timeline sources import no sim state and touch no play storage key.`,
  );
  results.push({ id: 12, name: "T-12 · Layer isolation (the play layer is untouched)", pass: ok, details });
}

/* ================================================================ T-13 ==== */
{
  const details: string[] = [];
  let ok = true;
  const rec = join(ROOT, "records/research-pipeline.md");
  if (!contentPresent) NA.push("T-13 (no compiled timeline content yet)");
  else if (!existsSync(rec)) {
    ok = false;
    details.push(`records/research-pipeline.md does not exist; §4.4 requires a batch record with a verifier verdict for every source`);
    results.push({ id: 13, name: "T-13 · Research-pipeline record", pass: ok, details });
  } else {
    const md = readFileSync(rec, "utf8");
    const missing = Object.keys(SOURCES).filter((id) => !md.includes(id));
    if (missing.length) {
      ok = false;
      details.push(`${missing.length} source id(s) have no verifier verdict in records/research-pipeline.md: ${missing.slice(0, 6).join(", ")}`);
    }
    const nRR = MILESTONES.filter((m) => (m as any).researchRequired === true).length;
    const kl = join(ROOT, "KNOWN_LIMITATIONS.md");
    if (existsSync(kl)) {
      const klSrc = readFileSync(kl, "utf8");
      const claimed = klSrc.match(/research-required records?:\s*(\d+)/i);
      if (claimed && Number(claimed[1]) !== nRR) {
        ok = false;
        details.push(`KNOWN_LIMITATIONS.md says ${claimed[1]} research-required records; the content has ${nRR}`);
      }
      const listed = MILESTONES.filter((m) => (m as any).researchRequired === true && !klSrc.includes(m.id));
      if (listed.length) {
        ok = false;
        details.push(`${listed.length} research-required record(s) are not listed in KNOWN_LIMITATIONS.md: ${listed.slice(0, 5).map((m) => m.id).join(", ")}`);
      }
    }
    details.unshift(`${Object.keys(SOURCES).length} sources, each with a verifier verdict in records/research-pipeline.md; ${nRR} research-required records, each listed in KNOWN_LIMITATIONS.md.`);
    results.push({ id: 13, name: "T-13 · Research-pipeline record", pass: ok, details });
  }
}

/* ================================================================ T-15 ==== */
/*
 * S-9's structural half, for the timeline sheet (5.0 §8: "S-9's structural half
 * covers app/timeline.css under the `tl-` namespace").
 *
 * It lives here rather than in the sim suite because the sim's version enforces
 * rules the timeline must NOT obey: it requires a `sim-` prefix and forbids the
 * reading tokens. The timeline is a reading-layer instrument — its year cards sit
 * on paper and its spine sits on the atlas — so it legitimately uses both token
 * sets. What carries across is the SHAPE of the check: one namespace, no class
 * shared with another sheet, no fixed size on anything holding text, tokens only,
 * and real tap targets.
 */
{
  const details: string[] = [];
  let ok = true;
  const { readFileSync: rf } = await import("node:fs");
  const sheetPath = join(ROOT, "app/timeline.css");
  if (!existsSync(sheetPath)) {
    NA.push("T-15 (app/timeline.css does not exist)");
  } else {
    const css = rf(sheetPath, "utf8");
    // Strip comments first: a sheet that documents itself mentions "app/timeline.css"
    // and a naive selector scan reads that trailing ".css" as a class named `css`.
    const stripComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, " ");
    const classOf = (text: string) => {
      const out = new Set<string>();
      for (const m of stripComments(text).matchAll(/\.([a-zA-Z][\w-]*)/g)) out.add(m[1]);
      return out;
    };
    const tlClasses = classOf(css);
    const foreign = [...tlClasses].filter((c) => !c.startsWith("tl-"));
    if (foreign.length) {
      ok = false;
      details.push(`app/timeline.css styles ${foreign.length} class(es) outside the tl- namespace: ${foreign.slice(0, 10).join(", ")}`);
    }

    // no class shared with the reading sheet or the sim sheets
    const others = ["app/globals.css", "app/sim.css", "app/sim-instruments.css", "app/sim-surfaces.css"]
      .filter((f) => existsSync(join(ROOT, f)))
      .flatMap((f) => [...classOf(rf(join(ROOT, f), "utf8"))]);
    const otherSet = new Set(others);
    const shared = [...tlClasses].filter((c) => otherSet.has(c));
    if (shared.length) {
      ok = false;
      details.push(`classes shared between app/timeline.css and another sheet: ${shared.join(", ")}`);
    }

    // no fixed width/height on a rule that holds text
    const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
    for (const b of blocks) {
      const sel = b[1].trim();
      const body = b[2];
      if (/\b(width|height)\s*:\s*\d+(px|rem|em|ch)\b/.test(body) && !/tl-chip-glyph/.test(sel)) {
        ok = false;
        details.push(`fixed size on a text-bearing rule: "${sel.split(/[\n,]/).pop()?.trim() ?? sel}"`);
      }
    }

    // literal colours only inside the token block
    const tokenBlockEnd = css.indexOf("/* ── 2.");
    const past = tokenBlockEnd === -1 ? css : css.slice(tokenBlockEnd);
    const literals = [...past.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0]);
    if (literals.length) {
      ok = false;
      details.push(`literal colour(s) past the token block: ${[...new Set(literals)].slice(0, 8).join(", ")}`);
    }

    // tap targets
    if (!/--tl-tap:\s*44px/.test(css)) {
      ok = false;
      details.push("no 44px tap-target token defined in app/timeline.css");
    }
    const tapUsers = (css.match(/min-block-size:\s*var\(--tl-tap\)/g) ?? []).length;
    if (tapUsers < 3) {
      ok = false;
      details.push(`only ${tapUsers} rule(s) size a control by the tap token; the interactive controls are the chips, the select and the drawer summaries`);
    }

    details.unshift(
      `${tlClasses.size} tl- classes in app/timeline.css, none shared with the reading or sim sheets; ` +
        `no fixed size on a text-bearing rule; no literal colour past the token block; ${tapUsers} controls sized by the 44px tap token.`,
    );
    results.push({ id: 15, name: "T-15 · UI integrity, structural half (the tl- namespace)", pass: ok, details });
  }
}

/* ================================================================ T-16 ==== */
{
  if (!renderedPresent) NA.push("T-16 (no built timeline pages yet)");
  else {
    const stale = stalenessProblems();
    results.push({
      id: 16,
      name: "T-16 · The export is current (a stale out/ cannot certify a build)",
      pass: stale.length === 0,
      details: stale.length
        ? stale
        : ["out/timeline/index.html is at least as new as every timeline source that produces it."],
    });
  }
}

/* ------------------------------------------------------------------ report */

for (const r of results) reportGate(r);
if (NA.length) {
  console.log("\n[N/A] not yet substantive (the subject does not exist at this phase):");
  for (const n of NA) console.log("   " + n);
}
const failed = results.filter((r) => !r.pass);
console.log("\n" + "=".repeat(60));
if (results.length === 0) {
  console.log("NO TIMELINE GATES SUBSTANTIVE YET — build timeline content first.");
  process.exit(0);
}
if (failed.length) {
  console.log(`${failed.length} TIMELINE GATE(S) FAILED: ${failed.map((f) => "T-" + f.id).join(", ")}`);
  process.exit(1);
}
console.log(`ALL ${results.length} SUBSTANTIVE TIMELINE GATES PASS` + (NA.length ? ` (${NA.length} N/A)` : ""));
