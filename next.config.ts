import type { NextConfig } from "next";

/**
 * TGTL ships as a fully static site (blueprint 2.0 §11.1): no backend, no
 * database, no page-initiated external requests. `output: "export"` renders
 * every route to static HTML at build time, which also satisfies the
 * JS-disabled reading floor (§8) — prose is present in the HTML before hydration.
 *
 * Publish pass (2026-09-04): the preview is hosted as a GitHub Pages PROJECT site,
 * served under a path (https://jasonhchronicles.com/TGTL/). Next needs to know that
 * path so every route link, asset URL and chunk request carries it. The path comes
 * from TGTL_BASE_PATH so the local gate roster keeps running against a root mount
 * (unset → "" → identical to the build every gate was written against) while the
 * Pages workflow sets TGTL_BASE_PATH=/TGTL. Components that cannot use next/link
 * (the redirect stubs' meta refresh, the three plain anchors) read the same value
 * through NEXT_PUBLIC_BASE_PATH, which is derived here so there is one source.
 */
const basePath = (process.env.TGTL_BASE_PATH || "").replace(/\/$/, "");
process.env.NEXT_PUBLIC_BASE_PATH = basePath;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath, assetPrefix: `${basePath}/` } : {}),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // No redirects/headers/rewrites: none are compatible with static export, and
  // the site needs none.
};

export default nextConfig;
