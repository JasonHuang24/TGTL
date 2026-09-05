import type { Metadata } from "next";
import { InstrumentPage, PageHeader, EvidenceDrawer, ModelBreak } from "@/components/primitives";
import { CharacterSheet } from "@/components/CharacterSheet";

export const metadata: Metadata = {
  title: "Your situation at a glance",
  description:
    "An illustrative picture of capacity, resources, conditions, and commitments — with no overall score, because human worth is not a stat.",
};

export default function CharacterPage() {
  return (
    <InstrumentPage>
      <PageHeader
        eyebrow="Character · an illustrative preset"
        title="Your situation at a glance"
        intro="A functional picture of capacity, resources, conditions, and commitments — shown here as a worked example, not filled in from anything you entered. Its whole design is to keep separate the things people usually blur together, and to make one thing structurally impossible: an overall score for a person."
        status="illustrative"
      />
      <CharacterSheet />

      {/* N-410 (6.0 §3.11) — the owner's own wording of the no-worth-score wall is
          MORE permissive than the site's silence has been: it forbids the score
          and it authorises the examination. This is the content the wall permits,
          and it belongs on the page whose whole design refuses a total. Nothing
          here asks the reader anything, records anything, or classifies them. */}
      <h2 id="conditional-worth">The conditions you have attached to your own worth</h2>
      <p>
        There is no total on this page, and there never will be. That is a wall, and it is worth
        being exact about what it does and does not forbid: what may never be produced is a score
        for a human being. What may be examined &mdash; usefully, and by you &mdash; is the set of
        conditions you have quietly attached to your own worth.
      </p>
      <p>
        Most people are running at least one. Worth conditional on approval, on how you look, on
        money, on being productive, on achieving, on being clever or strong, on being in a
        relationship or being a parent, on being morally clean, on standing in a faith, on being
        useful to others, on needing nobody. Any of them can generate real motivation for years. All
        of them charge the same way: shame when the condition slips, brittleness while it holds,
        perfectionism to keep it holding, comparison with everyone else who has it, and a genuine
        crisis on the day it is lost &mdash; not because the person is worth less, but because the
        measure they were using has stopped returning a value.
      </p>
      <p>
        The two questions worth sitting with are <strong>whose conditions these are</strong> &mdash;
        many are inherited from a family or a culture and were never chosen &mdash; and{" "}
        <strong>whether you would apply them to anyone else</strong>. Almost nobody would. Your
        moral standing and your dignity are not attributes, achievements, wealth, appearance or
        productivity, and they are not the kind of thing that has a reading. Examining the criteria
        is allowed and often overdue. Scoring the person is not on the table here, in words, in
        numbers, in a total or in a colour.
      </p>

      {/* N-281 — the break this page leans on: it can lay out what capacity you
          have and cannot say what any of it was for. */}
      <ModelBreak n={7}>
        A panel like this makes capacity and load legible, and it has nothing to say about whether a
        life is going well.
      </ModelBreak>

      <EvidenceDrawer
        record={{
          status: "illustrative",
          scope: "A demonstration preset, not an assessment of anyone.",
          lastReviewed: "2026-08-26",
          whatWouldChange:
            "Nothing here is measured. The bands are qualitative on purpose; a real version would still refuse a total, because the usefulness of any of these depends on your goals, environment, and stage, and none of them ranks a person.",
          whereThisFrameFails:
            "A 'sheet' invites the eye to look for a total even when there isn't one; the format fights the very comparison it could accidentally invite.",
        }}
      />
    </InstrumentPage>
  );
}
