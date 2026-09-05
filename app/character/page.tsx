import type { Metadata } from "next";
import { InstrumentPage, PageHeader, EvidenceDrawer } from "@/components/primitives";
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
