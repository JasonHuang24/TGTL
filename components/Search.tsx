"use client";

import Link from "next/link";
import { useMemo, useState, useId } from "react";
import { ROUTES } from "@/content/routes";

/**
 * Client-side search over the titles, summaries, and keywords of all searchable
 * reader routes (§6.7). The index is the route inventory itself (a build-time
 * data module, no external service). Simple substring/prefix matching. The
 * entrance is excluded (searchable: false). Without JS, the topics page still
 * lists everything below, so browsing does not depend on this.
 */
const INDEX = ROUTES.filter((r) => r.searchable).map((r) => ({
  path: r.path,
  title: r.title,
  summary: r.summary,
  haystack: [r.title, r.summary, ...(r.keywords ?? [])].join(" ").toLowerCase(),
}));

export function Search() {
  const [q, setQ] = useState("");
  const inputId = useId();
  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (query.length < 2) return [];
    const terms = query.split(/\s+/);
    return INDEX.filter((r) => terms.every((t) => r.haystack.includes(t))).slice(0, 12);
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
                <li key={r.path}>
                  <Link href={r.path}>
                    <span className="search-title">{r.title}</span>
                    <span className="search-summary">{r.summary}</span>
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
