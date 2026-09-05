/**
 * Minimal static server for the exported site (out/). Used for browser-based
 * gate checks and manual walkthroughs. No dependencies; serves trailingSlash
 * routes as folder/index.html. Usage: node tests/serve-out.mjs [port]
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.env.SERVE_ROOT
  ? process.env.SERVE_ROOT
  : join(dirname(fileURLToPath(import.meta.url)), "..", "out");
const PORT = Number(process.argv[2] || 4321);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function resolveFile(pathname) {
  const clean = decodeURIComponent(pathname.split("?")[0]);
  let p = join(ROOT, clean);
  try {
    const s = await stat(p);
    if (s.isDirectory()) p = join(p, "index.html");
  } catch {
    if (!extname(p)) {
      // trailingSlash export: /route -> /route/index.html
      p = join(ROOT, clean, "index.html");
    }
  }
  return p;
}

createServer(async (req, res) => {
  try {
    const file = await resolveFile(req.url || "/");
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    try {
      const body = await readFile(join(ROOT, "404.html"));
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  }
}).listen(PORT, () => {
  console.log(`Serving out/ at http://localhost:${PORT}`);
});
