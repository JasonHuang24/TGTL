import type { Metadata } from "next";
import { InstrumentPage, PageHeader, EvidenceDrawer, NextSteps, NextStep, ModelBreak } from "@/components/primitives";
import { History } from "@/components/History";
import { PlannedCards } from "@/components/PlannedCards";
import { ROUTE_BY_PATH } from "@/content/routes";

export const metadata: Metadata = {
  title: "History and change",
  description:
    "One era done properly: industrialization as a major patch, with a before-and-after tier board that ranks what a ruleset did to a position — never the worth of the people in it.",
};

export default function HistoryPage() {
  return (
    <InstrumentPage>
      <PageHeader
        eyebrow="History · one era, done properly"
        title="The rules have been rewritten before"
        intro="Much of what feels like fixed reality is a ruleset that was patched into place and could be patched again. Here is one era read as a major change: what it added and removed, who it advantaged and set back, and a ranking of positions before and after — with the ranking's own weighting left in the open."
        status="illustrative"
        /* N-301 (C-49) — the board's placements rest on an evidence state that the
           ruleset header declares per objective. An evidence state expires; the
           stamp says when it is due to be read again rather than restating what
           the header already carries. */
        perishable={ROUTE_BY_PATH["/history"]?.perishable}
        perishablePrefix="The evidence behind this board is due for review by"
      />
      <History />

      {/* N-302 (§3.11, C-50) — the hole met in place. Generated from WHATS_COMING,
          which stays the only place unbuilt scope is named (2.0 §6.9, 6.0 §2.3.2). */}
      <PlannedCards area="history" />
      {/* N-281 — the instrument whose failure mode is the most direct: a ranking
          of positions read as a ranking of the people who held them. */}
      <ModelBreak n={9}>
        A board of letters is one careless reading away from being a ranking of people rather than
        of the rulesets they lived under.
      </ModelBreak>

      <NextSteps>
        <NextStep href="/topics/work" relation="see-also" why="The same idea at the scale of one career: inherited advice that is versioned rather than foolish.">Dated advice as versioned documentation — the same idea, applied to careers.</NextStep>
        <NextStep href="/topics/money" relation="explains" why="The compounding mechanism behind the era&rsquo;s largest gains, explained where it lives.">Why ownership compounds — the mechanism behind the era's largest gains.</NextStep>
        <NextStep href="/methodology#known-breaks" relation="explains" why="What this frame cannot see, listed rather than hidden — including its lack of a collective subject.">Where this frame strains — including its lack of a collective subject.</NextStep>
      </NextSteps>
      <EvidenceDrawer
        record={{
          status: "illustrative",
          scope: "Industrialization, treated broadly and without dates or figures — a demonstration of the method, not a researched history.",
          lastReviewed: "2026-08-26",
          whatWouldChange:
            "No statistic or date is asserted. A researched version would carry sources, confidence labels, and a plausible tier range per placement, and would branch each archetype by region, sex, age, health, and family rather than collapsing them.",
          whereThisFrameFails:
            "Ranking positions can read as ranking people, which the disclaimer exists to refuse — and a tier badge on a position of extraction risks aestheticising it if the reader forgets what is being measured.",
        }}
      />
    </InstrumentPage>
  );
}
