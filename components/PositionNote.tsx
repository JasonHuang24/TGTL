"use client";

import Link from "next/link";
import { useGuide, type Floor } from "@/lib/guide-context";

/**
 * N-150 (6.0 §3.6, C-42) — A POSITION NOTE, RE-RESOLVED FROM THE ONE SETTING.
 *
 * The site's single best mechanic is that the same move costs differently from a
 * different starting position. Until this version it was demonstrated on exactly
 * one page and written as flat prose everywhere else — "if you have a floor,
 * this is a bounded experiment; if you do not, it is a ruin tail" — which asks
 * the reader to do the resolution themselves, in the state they are in.
 *
 * This renders the one paragraph that is true for them, and says where the
 * setting lives so the sentence never looks like the site knowing something
 * about them that it was not told.
 *
 * WHAT IT MAY NOT DO, and C-42 asserts all of it:
 *   - it produces no rank, band, score or comparison. It SELECTS an authored
 *     paragraph. There is no arithmetic anywhere in this file, deliberately;
 *   - the value never enters a URL, and nothing here writes one;
 *   - it never reaches the play layer;
 *   - a reader who has set nothing gets the `unsure` note, which is written to
 *     be a real answer rather than a prompt to go and fill something in.
 */
export type PositionNotes = Record<Floor, string>;

export const POSITION_SET_ONCE_LINE =
  "Set once, on the credential page; changes every position note on the site.";

export function PositionNote({
  notes,
  label = "For your position",
}: {
  /** One note per floor answer, including `unsure`. Written in the page's voice. */
  notes: PositionNotes;
  label?: string;
}) {
  const { position } = useGuide();
  return (
    <aside className="position-note" data-position-note={position.floor} aria-live="polite">
      <p className="position-note-body">
        <span className="position-note-label">{label}:</span> {notes[position.floor]}
      </p>
      <p className="position-note-provenance">
        {POSITION_SET_ONCE_LINE}{" "}
        <Link href="/map/credential-decision#position">Change it there</Link>.
      </p>
    </aside>
  );
}
