import type { Metadata } from "next";
import { InstrumentPage, PageHeader, EvidenceDrawer, ModelBreak } from "@/components/primitives";
import { Guidance } from "@/components/Guidance";

export const metadata: Metadata = {
  title: "Choosing a path",
  description:
    "An optional walkthrough for laying out a decision: what you're aiming at, what you're holding, hard limits, then meaningfully different plans with their costs, pivots, and recovery routes.",
};

export default function GuidancePage() {
  return (
    <InstrumentPage>
      <PageHeader
        eyebrow="Guidance · optional, and skippable"
        title="Lay a decision out"
        intro="This walks a decision through four steps: what you're aiming at, what you're actually holding, your hard limits, and then a set of meaningfully different plans — with their real costs, the triggers to pivot, and the route back from each. Every step teaches something true even if you stop halfway, and the honest output is sometimes 'no recommendation yet.'"
        status="illustrative"
      />
      <Guidance />
      {/* N-281 — the break this instrument leans on hardest: it can lay out what a
          decision costs and has no access to what it is like. */}
      <ModelBreak n={3}>
        This flow is good at costs, constraints and what is open, and it does not know what any of
        it feels like. If the hard part of your decision is the part that has no cost line, this
        page is not the thing that will help you with it.
      </ModelBreak>
      <EvidenceDrawer
        record={{
          status: "illustrative",
          scope: "A demonstration flow with authored plans, not personalised advice.",
          lastReviewed: "2026-08-26",
          whatWouldChange:
            "The plans are illustrative fixtures, ranked by transparent rules you can see re-resolve as you change inputs. No probability or percentage is attached to any outcome; the ranges are qualitative on purpose. A real version would still refuse a number it could not defend.",
          whereThisFrameFails:
            "Rendering a life decision as a ranked list of options can make it feel more legible, and more solved, than it is — the map is not the territory, and the hardest part of a real choice is often the part the flow cannot hold.",
        }}
      />
    </InstrumentPage>
  );
}
