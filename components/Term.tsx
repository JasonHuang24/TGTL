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
  marked,
}: {
  k: TermKey;
  define?: boolean;
  caps?: boolean;
  /**
   * N-326 — override the marker decision. Left unset, a use is marked when it is
   * not the defining use, which is what the authoring rule already means. Set
   * false where the surrounding treatment already carries the emphasis (a caps
   * heading, below).
   */
  marked?: boolean;
}) {
  const pathname = usePathname();
  const { edition, effectiveFrame } = useGuide();
  const route = normalizePath(pathname ?? "/");
  const frame = effectiveFrame(route);
  const record = TERMS[k];

  const showGame = edition === "game" && frame !== "down" && Boolean(record.game);
  const label = showGame ? (record.game as string) : record.standard;
  const shown = caps ? label.toUpperCase() : label;

  /**
   * N-326 (C-34) — THE GAME-VOCABULARY MARKER.
   *
   * After the defining use, a game term renders in small caps, so the frame is
   * legible AS a frame rather than as the site's ordinary voice. That is the
   * "model, not metaphor" commitment made visible — and it is what makes the
   * frame easier to put down, because you can see where it is.
   *
   * Three places it must never appear, all of them decided by `showGame` above
   * and by nothing else: the Standard edition, a route whose frame is down, and
   * a term that has no game label at all. C-34 asserts the first two over the
   * exported HTML and over this file's source, and is proven red by a plant that
   * lets the class escape into Standard.
   *
   * Which uses count as "after the first": the author sets `define` on a page's
   * first occurrence of a key — the rule the trunk has run on since 2.0 — so the
   * defining use is the unmarked one and every later use is marked. A page that
   * uses a term exactly once without defining it would be marked on that single
   * use; that is a mis-marking rather than a breach of the wall, and the honest
   * fix is the authoring rule the gate-3 parity lint already encourages.
   */
  const showMarker = showGame && (marked ?? !define);

  if (showGame && define && record.define) {
    return (
      <span className="term term--defined">
        {shown}
        <span className="term-define"> — {record.define}</span>
      </span>
    );
  }
  return <span className={showMarker ? "term term--marked" : "term"}>{shown}</span>;
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
        {/* N-326: a caps heading already carries the emphasis; the marker would
            be a second treatment on the same words. */}
        <Term k={k} caps marked={false} />
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
