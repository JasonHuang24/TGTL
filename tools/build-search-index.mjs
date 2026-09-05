/**
 * N-012 (6.0 §3.2, C-27) — BUILD THE SEARCH INDEX.
 *
 * Run: node --experimental-strip-types tools/build-search-index.mjs
 * Wired into `npm run build` as `prebuild`, so the index cannot be stale when a
 * page ships, and available on its own as `npm run content:search`.
 *
 * WHY THIS EXISTS. `components/Search.tsx` built its haystack out of the route
 * inventory — title, summary, and hand-written keywords — which meant two things
 * were invisible to the site's own search box. First, every page heading: a
 * reader typing a word that appears in an <h2> but not in a summary was told the
 * guidance did not exist. Second, the timeline's generated milestone pages, which
 * are not in ROUTES at all, so the largest sourced content area on the site could
 * not be found from the one control built for finding things.
 *
 * WHAT IT INDEXES.
 *   1. Every searchable ROUTES record — path, title, summary, keywords.
 *   2. Every <h2> and <h3> written into a reader page's source under
 *      app/**\/page.tsx, with the route it belongs to.
 *   3. Every generated milestone route, with its label from the milestone pool.
 *
 * ANCHORS, AND WHY NOT EVERY HEADING HAS ONE. A heading that carries an explicit
 * `id` in its source is indexed with `path#id`, and C-27 asserts every one of
 * those resolves to an id in the exported HTML. A heading with no id is indexed
 * for its words and lands the reader at the top of the page. The alternative —
 * an id on every heading on the site — cannot be reached: five of these pages are
 * frozen at source pending clinical review and 6.0 adds not one byte to them. So
 * the index is honest about which of its entries can jump and which cannot,
 * rather than generating anchors that would not resolve.
 *
 * NO NETWORK, EVER — at build time or at query time (gate 9). This is a file.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, statSync } from "node:fs";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { ROUTES } from "../content/routes.ts";
import { MILESTONES } from "../content/timeline/generated/milestones.ts";
import { TIMELINE_MILESTONE_ROUTES } from "../content/timeline/generated/routes.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const APP = join(ROOT, "app");
const OUT_DIR = join(ROOT, "content", "generated");
const OUT_FILE = join(OUT_DIR, "search-index.json");

/* ---- 1. the reader pages, and the route each one is ---- */

function pageFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      // Dynamic segments are generated pages; the timeline's milestone routes
      // enter the index from the record pool below, with their real labels.
      if (entry.startsWith("[")) continue;
      pageFiles(full, acc);
    } else if (entry === "page.tsx") {
      acc.push(full);
    }
  }
  return acc;
}

function routeOf(file) {
  const rel = relative(APP, dirname(file)).split(sep).join("/");
  return rel === "" ? "/" : `/${rel}`;
}

const ENTITIES = {
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&rdquo;": "”",
  "&ldquo;": "“",
  "&mdash;": "—",
  "&ndash;": "–",
  "&amp;": "&",
  "&rarr;": "→",
  "&nbsp;": " ",
};

/** Heading source -> plain reader text. Tags out, JSX expressions out, entities in. */
function headingText(inner) {
  let t = inner
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/\{[^{}]*\}/g, " ")
    .replace(/<[^>]+>/g, " ");
  for (const [ent, ch] of Object.entries(ENTITIES)) t = t.split(ent).join(ch);
  return t.replace(/\s+/g, " ").trim();
}

const HEADING_RE = /<(h2|h3)\b([^>]*)>([\s\S]*?)<\/\1>/g;

const entries = [];

for (const r of ROUTES) {
  if (!r.searchable) continue;
  entries.push({
    kind: "route",
    path: r.path,
    title: r.title,
    summary: r.summary,
    keywords: r.keywords ?? [],
  });
}

const routePaths = new Set(ROUTES.map((r) => r.path));
let headingCount = 0;
let anchoredCount = 0;

for (const file of pageFiles(APP)) {
  const route = routeOf(file);
  if (!routePaths.has(route)) continue; // not a listed reader route
  const record = ROUTES.find((r) => r.path === route);
  if (!record?.searchable) continue;
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(HEADING_RE)) {
    const attrs = m[2] ?? "";
    const text = headingText(m[3] ?? "");
    if (!text) continue; // a heading rendered entirely from data
    const id = /\bid="([^"]+)"/.exec(attrs)?.[1];
    headingCount++;
    if (id) anchoredCount++;
    entries.push({
      kind: "heading",
      path: route,
      anchor: id ? `${route}#${id}` : null,
      title: text,
      onPage: record.title,
      level: m[1],
    });
  }
}

/* ---- 3. the generated milestone pages ---- */

const labelById = new Map(MILESTONES.map((ms) => [ms.id, ms.label]));
for (const path of TIMELINE_MILESTONE_ROUTES) {
  const id = path.replace("/timeline/", "");
  entries.push({
    kind: "milestone",
    path,
    title: labelById.get(id) ?? id,
    onPage: "The Timeline",
    milestoneId: id,
  });
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(
  OUT_FILE,
  `${JSON.stringify(
    {
      note: "GENERATED by tools/build-search-index.mjs (N-012). Do not edit by hand; run `npm run content:search`.",
      entries,
    },
    null,
    2,
  )}\n`,
  "utf8",
);

const routeCount = entries.filter((e) => e.kind === "route").length;
const msCount = entries.filter((e) => e.kind === "milestone").length;
console.log(
  `search index: ${entries.length} entries — ${routeCount} routes, ${headingCount} headings ` +
    `(${anchoredCount} with a resolvable anchor), ${msCount} milestone pages -> content/generated/search-index.json`,
);
