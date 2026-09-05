"use client";

import Link from "next/link";
import { useGuide } from "@/lib/guide-context";

/**
 * The single explanatory sentence shown on a hard set-down page when the reader
 * is in the Game Guide edition (§4.2). After this one line, the apparatus is
 * gone entirely. Renders nothing in Standard edition — the calm treatment needs
 * no explanation there.
 *
 * N-265 (§3.10): it also says the reader's own setting survived. A control you
 * chose that visibly stops working reads as a control that was taken away, and
 * that is the wrong thing for this page to be saying to this reader.
 */
export function SetDownNotice() {
  const { edition, hydrated } = useGuide();
  if (!hydrated || edition !== "game") return null;
  return (
    <p className="setdown-notice" role="note">
      This page puts the guidebook&rsquo;s frame away; some things shouldn&rsquo;t be gamified. It uses
      plain language, and your reading preference has not been changed.{" "}
      <Link href="/methodology#intensity">Why some pages set the frame down.</Link>
    </p>
  );
}
