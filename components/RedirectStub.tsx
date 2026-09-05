import Link from "next/link";

/**
 * A sanctioned redirect stub (blueprint 3.0 §6.1). Static export has no server
 * redirects, so a retired route ships a minimal meta-refresh + link page so
 * external bookmarks land somewhere real. Stubs are excluded from nav, doors,
 * search, and the gate-5 walk. The <meta> is hoisted to <head> by React 19.
 */
export function RedirectStub({ to, toLabel }: { to: string; toLabel: string }) {
  // The static export uses trailingSlash: true, so the refresh target must too.
  // A <meta> refresh is not routed through next/link, so it must carry the
  // deployment's base path itself (publish pass, 2026-09-04): "" locally, "/TGTL"
  // on the GitHub Pages project site. Same value next.config.ts hands to Next.
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const url = `${base}${to.endsWith("/") ? to : `${to}/`}`;
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${url}`} />
      <article className="prose-page">
        <p className="eyebrow">This page moved</p>
        <h1>It has a new home</h1>
        <p className="lede">
          You&rsquo;ll be taken to <Link href={to}>{toLabel}</Link> automatically. If nothing happens,
          follow that link.
        </p>
      </article>
    </>
  );
}
