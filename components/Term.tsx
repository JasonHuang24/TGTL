"use client";

import { usePathname } from "next/navigation";
import { useGuide } from "@/lib/guide-context";
import { TERMS, type TermKey } from "@/content/terminology";
import { normalizePath } from "@/content/routes";

/**
 * Renders a semantic term in the reader's current edition (§4.1, §9.3).
 *
 *  - Server render / JS-off / set-down routes: the Standard label (always plain).
 *  - Game edition on a framed route: the game label.
 *  - `define`: when the game label is shown, append its plain-language gloss in
 *    the same breath (§7.3, "define at first use"). Author sets `define` only on
 *    the FIRST occurrence of a key on a page.
 *
 * No game-guide string literal is ever hardcoded in a component — every label
 * flows from the terminology map, which the parity/source lint (gate 3) checks.
 */
export function Term({
  k,
  define = false,
  caps = false,
}: {
  k: TermKey;
  define?: boolean;
  caps?: boolean;
}) {
  const pathname = usePathname();
  const { edition, effectiveFrame } = useGuide();
  const route = normalizePath(pathname ?? "/");
  const frame = effectiveFrame(route);
  const record = TERMS[k];

  const showGame = edition === "game" && frame !== "down" && Boolean(record.game);
  const label = showGame ? (record.game as string) : record.standard;
  const shown = caps ? label.toUpperCase() : label;

  if (showGame && define && record.define) {
    return (
      <span className="term term--defined">
        {shown}
        <span className="term-define"> — {record.define}</span>
      </span>
    );
  }
  return <span className="term">{shown}</span>;
}

/**
 * A caps section heading that "defines at first use" (§7.3, blueprint 3.0 F1):
 * renders the term in caps, and — only in Game Guide on a framed route, where the
 * game vocabulary actually appears — adds the plain-language gloss as a small line
 * *under* the heading (a caps heading cannot carry the inline em-dash gloss legibly).
 * The author places this on the FIRST occurrence of a key on a page.
 */
export function TermHeading({
  k,
  as: Tag = "h3",
  className,
  suffix,
}: {
  k: TermKey;
  as?: "h2" | "h3" | "h4";
  className?: string;
  /** Optional plain text appended after the term inside the heading (never game vocab). */
  suffix?: string;
}) {
  const pathname = usePathname();
  const { edition, effectiveFrame } = useGuide();
  const route = normalizePath(pathname ?? "/");
  const frame = effectiveFrame(route);
  const record = TERMS[k];
  const showGloss = edition === "game" && frame !== "down" && Boolean(record.game) && Boolean(record.define);
  return (
    <>
      <Tag className={className}>
        <Term k={k} caps />
        {suffix ? <span className="heading-suffix"> {suffix}</span> : null}
      </Tag>
      {showGloss && <p className="term-gloss">{record.define}</p>}
    </>
  );
}

/** Convenience hook: the current normalized route. */
export function useRoute(): string {
  const pathname = usePathname();
  return normalizePath(pathname ?? "/");
}
