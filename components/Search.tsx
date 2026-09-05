"use client";

import Link from "next/link";
import { useMemo, useState, useId } from "react";
import INDEX_FILE from "@/content/generated/search-index.json";

/**
 * Client-side search (§6.7, N-012). The index is a BUILD ARTEFACT —
 * `content/generated/search-index.json`, produced by `tools/build-search-index.mjs`
 * before every build — not a live query and not an external service. Nothing
 * leaves the browser, and nothing is fetched at query time (gate 9).
 *
 * What changed in 6.0: this component used to build its haystack from the route
 * inventory alone, so a reader typing a word that appears in an <h2> but not in a
 * page summary was told the guidance did not exist, and the twenty-four generated
 * milestone pages — the largest sourced area on the site — could not be found at
 * all. The index now carries three kinds of entry: whole routes, the headings
 * written into each reader page, and every milestone page. A heading whose source
 * carries an id links straight to it; one that does not lands the reader at the
 * top of its page, which the result says.
 *
 * Without JavaScript, the topics page still lists every route below this control,
 * so browsing never depends on it.
 */

type Entry = {
  kind: "route" | "heading" | "milestone";
  path: string;
  title: string;
  summary?: string;
  keywords?: string[];
  anchor?: string | null;
  onPage?: string;
  level?: string;
};

const KIND_LABEL: Record<Entry["kind"], string> = {
  route: "Page",
  heading: "Section",
  milestone: "Timeline",
};

/** Routes rank above the sections inside them; milestone pages come last. */
const KIND_RANK: Record<Entry["kind"], number> = { route: 0, heading: 1, milestone: 2 };

const INDEX = (INDEX_FILE.entries as Entry[]).map((e) => ({
  ...e,
  href: e.anchor ?? e.path,
  haystack: [e.title, e.summary ?? "", e.onPage ?? "", ...(e.keywords ?? [])]
    .join(" ")
    .toLowerCase(),
}));

export function Search() {
  const [q, setQ] = useState("");
  const inputId = useId();
  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const terms = query.split(/\s+/);
    return INDEX.filter((r) => terms.every((t) => r.haystack.includes(t)))
      .sort((a, b) => KIND_RANK[a.kind] - KIND_RANK[b.kind])
      .slice(0, 12);
  }, [query]);

  return (
    <div className="search">
      <label htmlFor={inputId} className="search-label">
        Search the guide
      </label>
      <input
        id={inputId}
        type="search"
        className="search-input"
        placeholder="money, sleep, being laid off, grief…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoComplete="off"
      />
      {query.length >= 2 && (
        <div className="search-results" role="region" aria-live="polite">
          {results.length === 0 ? (
            <p className="search-empty">
              Nothing matched &ldquo;{q}&rdquo;. Try a plainer word, or browse the sections below.
            </p>
          ) : (
            <ul>
              {results.map((r) => (
                <li key={`${r.kind}:${r.href}:${r.title}`}>
                  <Link href={r.href}>
                    <span className="search-title">
                      <span className="search-kind">{KIND_LABEL[r.kind]}</span>
                      {r.title}
                    </span>
                    <span className="search-summary">
                      {r.kind === "route"
                        ? r.summary
                        : r.anchor
                          ? `On ${r.onPage} — goes straight to this section.`
                          : `On ${r.onPage}.`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
