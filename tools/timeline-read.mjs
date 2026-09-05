/** Prints the readable text of one year card from the built page, for a human read. */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(ROOT, "out/timeline/index.html"), "utf8");
const age = process.argv[2] ?? "18";
const open = html.indexOf(`data-tl-year="${age}"`);
if (open === -1) { console.log("no such year"); process.exit(1); }
const start = html.lastIndexOf("<section", open);
const end = html.indexOf(`data-tl-year="${Number(age) + 1}"`);
const slice = html.slice(start, end === -1 ? start + 20000 : html.lastIndexOf("<section", end));
const text = slice
  .replace(/<summary/g, "\n<summary").replace(/<h4/g, "\n<h4").replace(/<h3/g, "\n<h3")
  .replace(/<li/g, "\n<li").replace(/<p /g, "\n<p ").replace(/<p>/g, "\n<p>")
  .replace(/<details/g, "\n<details")
  .replace(/<[^>]+>/g, " ")
  .replace(/&#x27;/g, "'").replace(/&amp;/g, "&").replace(/&quot;/g, '"')
  .replace(/&ldquo;|&rdquo;/g, '"').replace(/&mdash;/g, "—").replace(/&ndash;/g, "–")
  .replace(/[ \t]+/g, " ")
  .split("\n").map((l) => l.trim()).filter(Boolean).join("\n");
console.log(text);
