import type { Metadata } from "next";
import Link from "next/link";
import { InstrumentPage, PageHeader, EvidenceDrawer, ModelBreak } from "@/components/primitives";
import { Roadmap } from "@/components/Roadmap";

export const metadata: Metadata = {
  title: "The world map",
  description:
    "The whole-life view across parallel domains, with common windows — never deadlines. The static reference for the same eight stages you play through.",
};

/**
 * The world map (blueprint 3.0 §3.4, §6.1) — the static reference view of the same
 * eight stages and windows the Playthrough moves through. Run state never drives
 * this page; it only offers a quiet door back into a run in progress. The Default
 * Human framing threads it: the common route is common, never "correct".
 */
export default function MapPage() {
  return (
    <InstrumentPage>
      <PageHeader
        eyebrow="The world map"
        title="A life is not a ladder"
        intro="Eight overlapping stretches, seen across the domains that run in parallel — learning, health, work, relationships, money, meaning, and the priorities you actually chose. These are common windows and what tends to shift inside them, never deadlines. The common route is common — never correct. Being off-schedule is not being behind; there is no schedule."
        status="editorial"
      />
      <p className="map-play-link">
        This is the reference. To move through it as a life,{" "}
        <Link href="/play">begin a run in the Playthrough</Link>.
      </p>
      <Roadmap />
      {/* N-281 — the break a spine of stages leans on hardest: a drawn range is
          read as a schedule by a reader who is already worried about being late. */}
      <ModelBreak n={6}>
        Every window drawn here is a wide range that many people move through, and none of them is a
        date you are being measured against.
      </ModelBreak>
      <EvidenceDrawer
        record={{
          status: "editorial",
          scope: "General orientation on a United States, 2025 reference frame. Illustrative, not a developmental schedule.",
          lastReviewed: "2026-08-26",
          whatWouldChange:
            "The stage cards carry no ages, milestones, or statistics on purpose: a single age appears only for a genuinely discrete legal threshold. Any claim tied to a specific age or rate would need its own source and is not made here.",
          whereThisFrameFails:
            "A single spine flattens enormous variation — by body, family, place, and luck — and the very act of drawing 'stages' can make an off-common path look like a failure when it is only uncommon.",
        }}
      />
    </InstrumentPage>
  );
}
