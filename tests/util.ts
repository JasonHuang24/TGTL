/**
 * Shared helpers for the automated gates (blueprint §11.4). Runs on the static
 * export in `out/` with plain Node — no browser needed for gates 1–4.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(here, "..");
export const OUT_DIR = join(ROOT, "out");

export type Page = {
  /** Normalized route, e.g. "/" or "/situations/grief". */
  route: string;
  file: string;
  html: string;
};

export function listHtmlFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...listHtmlFiles(full));
    else if (entry.endsWith(".html")) out.push(full);
  }
  return out;
}

/** Map an exported HTML file to its route. out/index.html -> "/"; out/a/b/index.html -> "/a/b". */
export function fileToRoute(file: string): string {
  const rel = relative(OUT_DIR, file).split(sep).join("/");
  if (rel === "index.html") return "/";
  if (rel === "404.html") return "/404";
  const noIndex = rel.replace(/\/index\.html$/, "").replace(/\.html$/, "");
  return "/" + noIndex;
}

export function loadPages(): Page[] {
  return listHtmlFiles(OUT_DIR)
    .map((file) => ({ route: fileToRoute(file), file, html: readFileSync(file, "utf8") }))
    .filter((p) => p.route !== "/404");
}

/** Strip tags/entities to visible text (lowercased kept separate by caller). */
export function textOf(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractHrefs(html: string): string[] {
  const hrefs: string[] = [];
  const re = /href="([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) hrefs.push(m[1]);
  return hrefs;
}

export function extractIds(html: string): Set<string> {
  const ids = new Set<string>();
  const re = /\sid="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) ids.add(m[1]);
  // <a name="..."> also counts as an anchor target.
  const re2 = /<a[^>]+name="([^"]+)"/g;
  while ((m = re2.exec(html))) ids.add(m[1]);
  return ids;
}

export function normalizeRoute(path: string): string {
  const noHashQuery = path.split("#")[0].split("?")[0];
  if (noHashQuery.length > 1 && noHashQuery.endsWith("/")) return noHashQuery.slice(0, -1);
  return noHashQuery || "/";
}

/** Whole-word / phrase occurrence test, case-insensitive. */
export function containsPhrase(haystackLower: string, phrase: string): boolean {
  const p = phrase.toLowerCase().trim();
  if (!p) return false;
  // Word-ish boundaries so "a map" doesn't match inside "the map" wrongly, and
  // "stat" doesn't match "statement".
  const escaped = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i");
  return re.test(haystackLower);
}

export type GateResult = {
  id: number;
  name: string;
  pass: boolean;
  details: string[];
};

export function reportGate(r: GateResult): void {
  const tag = r.pass ? "PASS" : "FAIL";
  console.log(`\n[${tag}] Gate ${r.id}: ${r.name}`);
  for (const d of r.details) console.log("   " + d);
}
