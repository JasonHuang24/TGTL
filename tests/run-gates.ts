/**
 * Automated gate runner (blueprint §11.4). Static gates 1–4 and the static
 * portion of gate 9 run here against `out/`, plus the gate-3 source lint against
 * component sources. Gates 5, 6, and the runtime portion of 9 (browser) and
 * gates 7, 8 (keyboard / 320px) are covered per §11.4's manual-evidence
 * allowance and recorded in the build report.
 *
 * Run: npm run build && npm run gates
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, sep } from "node:path";
import {
  ROOT,
  OUT_DIR,
  loadPages,
  textOf,
  extractHrefs,
  extractIds,
  normalizeRoute,
  containsPhrase,
  reportGate,
  type GateResult,
  type Page,
} from "./util.ts";
import { ROUTES, SETDOWN_ROUTES, DOORS } from "../content/routes.ts";
// 5.0 §3.1 — the milestone routes are GENERATED from the registry by the content
// compiler and appended to the inventory here, so gate 1 validates a link to
// /timeline/<id> against a list derived from the content rather than a hand-kept one.
import { TIMELINE_MILESTONE_ROUTES } from "../content/timeline/generated/routes.ts";
import { SETDOWN_FORBIDDEN_TERMS, TERMS } from "../content/terminology.ts";

if (!existsSync(OUT_DIR)) {
  console.error("out/ not found. Run `npm run build` first.");
  process.exit(2);
}

const pages = loadPages();
const pageByRoute = new Map<string, Page>(pages.map((p) => [p.route, p]));
const validRoutes = new Set([...ROUTES.map((r) => r.path), ...TIMELINE_MILESTONE_ROUTES]);
const results: GateResult[] = [];

/* ---- Gate 1: link integrity + no orphan routes ---- */
{
  const details: string[] = [];
  let ok = true;

  // Every declared route must have an exported page.
  for (const r of ROUTES) {
    if (!pageByRoute.has(r.path)) {
      ok = false;
      details.push(`MISSING export for declared route ${r.path}`);
    }
  }

  // Every internal href resolves; every anchor exists.
  for (const p of pages) {
    const hrefs = extractHrefs(p.html);
    for (const href of hrefs) {
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        continue; // sanctioned external / contact links (§5.3)
      }
      if (href.startsWith("#")) {
        const id = href.slice(1);
        if (id && !extractIds(p.html).has(id)) {
          ok = false;
          details.push(`${p.route}: missing in-page anchor #${id}`);
        }
        continue;
      }
      if (!href.startsWith("/")) continue; // relative asset or odd link; skip
      // Build assets and static files are not navigation links.
      if (href.startsWith("/_next/") || /\.(css|js|mjs|json|svg|png|jpg|jpeg|gif|webp|ico|woff2?|txt|xml)(\?|$)/i.test(href))
        continue;
      const route = normalizeRoute(href);
      const target = pageByRoute.get(route);
      if (!validRoutes.has(route) || !target) {
        ok = false;
        details.push(`${p.route}: broken internal link -> ${href}`);
        continue;
      }
      const hash = href.includes("#") ? href.split("#")[1] : "";
      if (hash && !extractIds(target.html).has(hash)) {
        ok = false;
        details.push(`${p.route}: link ${href} targets missing anchor #${hash}`);
      }
    }
  }

  // Orphan check: every route reachable from "/" via internal links.
  const reachable = new Set<string>(["/"]);
  const queue = ["/"];
  while (queue.length) {
    const cur = queue.shift() as string;
    const page = pageByRoute.get(cur);
    if (!page) continue;
    for (const href of extractHrefs(page.html)) {
      if (!href.startsWith("/")) continue;
      const route = normalizeRoute(href);
      if (validRoutes.has(route) && !reachable.has(route)) {
        reachable.add(route);
        queue.push(route);
      }
    }
  }
  for (const r of ROUTES) {
    // Sanctioned redirect stubs are excluded from the reachability walk (§6.1):
    // external bookmarks land on them; nothing internal links to them.
    if (r.stub) continue;
    if (!reachable.has(r.path)) {
      ok = false;
      details.push(`ORPHAN: ${r.path} is not reachable from the entrance by any link path`);
    }
  }

  if (ok) details.push(`All ${pages.length} pages: internal links, anchors, and reachability OK.`);
  results.push({ id: 1, name: "Link integrity + no orphan routes", pass: ok, details });
}

/* ---- Gate 2: set-down vocabulary lint ---- */
{
  const details: string[] = [];
  let ok = true;
  // Game-component class-name tokens (tier/stat/reward chrome). Checked ONLY
  // inside class attributes, never in prose — so ordinary words like
  // "difficulty" in a sentence are not false-positives.
  const componentClassTokens = [
    "tier-row",
    "tier-board",
    "stat-bar",
    "stat-block",
    "reward",
    "boss",
    "difficulty",
    "streak",
    "leaderboard",
    "score-bar",
  ];
  for (const route of SETDOWN_ROUTES) {
    const page = pageByRoute.get(route);
    if (!page) {
      ok = false;
      details.push(`set-down route ${route} not exported`);
      continue;
    }
    const text = textOf(page.html).toLowerCase();
    for (const term of SETDOWN_FORBIDDEN_TERMS) {
      if (containsPhrase(text, term)) {
        ok = false;
        details.push(`${route}: contains forbidden game term "${term}"`);
      }
    }
    const classValues = (page.html.match(/class="([^"]*)"/g) || []).join(" ").toLowerCase();
    for (const ind of componentClassTokens) {
      if (classValues.includes(ind)) {
        ok = false;
        details.push(`${route}: renders a game-component class "${ind}"`);
      }
    }
  }
  if (ok)
    details.push(
      `${SETDOWN_ROUTES.length} set-down routes clean of ${SETDOWN_FORBIDDEN_TERMS.length} game terms and stat/tier/reward components.`,
    );
  results.push({ id: 2, name: "Set-down vocabulary lint", pass: ok, details });
}

/* ---- Gate 3: terminology parity + no hardcoded edition vocab in components ---- */
{
  const details: string[] = [];
  let ok = true;

  // (a) parity: every key has a Standard label; every distinct game label differs.
  for (const rec of Object.values(TERMS)) {
    if (!rec.standard || !rec.standard.trim()) {
      ok = false;
      details.push(`terminology key "${rec.key}" missing Standard label`);
    }
    if (rec.game && rec.game.trim() === rec.standard.trim()) {
      ok = false;
      details.push(`terminology key "${rec.key}" has identical game/standard label (drop game)`);
    }
  }

  // (b) source lint: game labels may appear only in terminology.ts.
  const gameLabels = Object.values(TERMS)
    .map((t) => t.game)
    .filter((g): g is string => Boolean(g));
  const srcFiles: string[] = [];
  for (const dir of ["components", "app"]) {
    const base = join(ROOT, dir);
    if (existsSync(base)) collectSources(base, srcFiles);
  }
  for (const file of srcFiles) {
    const src = readFileSync(file, "utf8");
    for (const label of gameLabels) {
      // JSX text form (reader-facing) is always a violation. The quoted-literal
      // form is only flagged for multi-word labels, which are unambiguously
      // vocabulary — single common words (branch, modifier) can legitimately be
      // prop/class/type string values and would false-positive.
      const jsxText = src.includes(`>${label}<`);
      const multiword = label.includes(" ");
      const quoted = multiword && (src.includes(`"${label}"`) || src.includes(`'${label}'`));
      if (jsxText || quoted) {
        ok = false;
        details.push(`${file.replace(ROOT + sep, "")}: hardcodes game label "${label}" (use <Term>)`);
      }
    }
  }
  if (ok)
    details.push(
      `${Object.keys(TERMS).length} terms parity-clean; no game vocabulary hardcoded in ${srcFiles.length} component/app sources.`,
    );
  results.push({ id: 3, name: "Terminology parity + component source lint", pass: ok, details });
}

/* ---- Gate 4: encoding (no mojibake / U+FFFD) ---- */
{
  const details: string[] = [];
  let ok = true;
  const bad = ["�", "Ã¢", "â€", "Ã©", "Ã¨", "Â ", "â€™", "â€œ", "â€"];
  for (const p of pages) {
    for (const seq of bad) {
      if (p.html.includes(seq)) {
        ok = false;
        details.push(`${p.route}: mojibake/replacement sequence ${JSON.stringify(seq)}`);
      }
    }
  }
  if (ok) details.push(`${pages.length} pages: UTF-8 clean, no mojibake or U+FFFD.`);
  results.push({ id: 4, name: "Encoding hygiene", pass: ok, details });
}

/* ---- Gate 9 (static portion): no page-initiated external resource loads ---- */
{
  const details: string[] = [];
  let ok = true;
  // Resource-loading attributes that would hit the network at page load.
  const patterns: RegExp[] = [
    /<script[^>]+src="https?:\/\//gi,
    /<link[^>]+href="https?:\/\//gi,
    /<img[^>]+src="https?:\/\//gi,
    /<iframe[^>]+src="https?:\/\//gi,
    /url\(https?:\/\//gi,
    /@import\s+["']https?:\/\//gi,
  ];
  for (const p of pages) {
    for (const re of patterns) {
      const m = p.html.match(re);
      if (m) {
        ok = false;
        details.push(`${p.route}: page-initiated external resource load: ${m[0]}`);
      }
    }
  }
  if (ok)
    details.push(
      `${pages.length} pages: no page-initiated external resource loads (fonts/system-stack only).`,
    );
  results.push({ id: 9, name: "Local-only: no external resource loads (static check)", pass: ok, details });
}

/* ---- Gate 10: no stray control characters in source ---- */
{
  const details: string[] = [];
  let ok = true;

  // WHY THIS GATE EXISTS.
  //
  // A shell-quoting slip baked a LITERAL BACKSPACE (0x08) into two regexes in
  // tests/sim-gates-4.ts and four in tools/localize-us.mjs. The source reads
  // `/\bact .../` and looks perfectly correct; the file actually contains
  // 0x08 where the backslash-b should be, so the pattern matched nothing and the
  // assertion built on it reported green while being incapable of failing. It
  // shipped that way, and was found by accident eleven hours later.
  //
  // This is the cheapest possible guard against the most invisible failure mode
  // in the build: a check that cannot fail, in a file whose whole job is to fail
  // when something is wrong. Nothing in this project legitimately embeds a
  // backspace, form feed, bell, vertical tab, NUL or escape in source.
  const FORBIDDEN: Record<number, string> = {
    0: "NUL (0x00)",
    7: "BEL (0x07)",
    8: "BACKSPACE (0x08)",
    11: "VERTICAL TAB (0x0B)",
    12: "FORM FEED (0x0C)",
    27: "ESCAPE (0x1B)",
  };
  const SKIP_DIRS = new Set(["node_modules", ".next", "out", ".git", "screenshots", "_scaffold_reference"]);
  const EXTS = /\.(ts|tsx|mjs|cjs|js|jsx|css|md|json)$/;

  let scanned = 0;
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(join(dir, entry.name));
        continue;
      }
      if (!EXTS.test(entry.name)) continue;
      const file = join(dir, entry.name);
      const src = readFileSync(file, "utf8");
      scanned++;
      for (let i = 0; i < src.length; i++) {
        const code = src.charCodeAt(i);
        const name = FORBIDDEN[code];
        if (!name) continue;
        ok = false;
        const line = src.slice(0, i).split("\n").length;
        const text = src.split("\n")[line - 1]?.trim().slice(0, 100) ?? "";
        details.push(
          `${file.replace(ROOT + sep, "")}:${line} contains ${name} — the source reads correctly and the file does not. On a regex this makes the pattern match nothing, and any assertion built on it can never come back red. Line: ${JSON.stringify(text)}`,
        );
      }
    }
  };
  walk(ROOT);

  if (ok) details.push(`${scanned} source files: no backspace, form feed, bell, vertical tab, NUL or escape anywhere.`);
  results.push({ id: 10, name: "Source hygiene: no stray control characters", pass: ok, details });
}

/* ---- Cross-check: doors point at real routes ---- */
{
  const details: string[] = [];
  let ok = true;
  for (const d of DOORS) {
    if (!validRoutes.has(d.href)) {
      ok = false;
      details.push(`door "${d.label}" -> ${d.href} is not a valid route`);
    }
  }
  if (ok) details.push(`${DOORS.length} homepage doors point at valid routes.`);
  results.push({ id: 0, name: "Doors integrity", pass: ok, details });
}

for (const r of results.sort((a, b) => a.id - b.id)) reportGate(r);

const failed = results.filter((r) => !r.pass);
console.log("\n" + "=".repeat(60));
if (failed.length === 0) {
  console.log(`ALL ${results.length} STATIC GATES PASS`);
  process.exit(0);
} else {
  console.log(`${failed.length} GATE(S) FAILED: ${failed.map((f) => f.id).join(", ")}`);
  process.exit(1);
}

function collectSources(dir: string, acc: string[]): void {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collectSources(full, acc);
    else if (/\.(tsx|ts)$/.test(entry) && !entry.endsWith(".d.ts")) acc.push(full);
  }
}
