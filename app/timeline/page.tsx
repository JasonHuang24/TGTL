/**
 * /timeline — the whole spine, every year, server-rendered (5.0 blueprint §3.2).
 *
 * This page is a SERVER COMPONENT and it renders every year from birth to one
 * hundred plus the terminal card as real HTML, with milestone detail in native
 * <details> drawers. With JavaScript disabled the page is COMPLETE, not
 * explanatory: deep links are anchors, and a screen reader gets the same
 * document a search engine does. The client instrument enhances this; it never
 * owns content the HTML lacks.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { InstrumentPage, PageHeader, CrisisNote } from "@/components/primitives";
import TimelineInstrument from "@/components/timeline/TimelineInstrument";
import YearCard, { MilestoneLine } from "@/components/timeline/YearCard";
import { MILESTONES, SOURCES } from "@/content/timeline/generated";
import { STAGES_TL, stageForAge, TERMINAL_STAGE } from "@/content/timeline/stages";
import {
  KIND_LABEL,
  KIND_STANDING_LINE,
  NAVIGATION_CONVENTION_LINE,
  OFF_COMMON_LINE,
  REFERENCE_FRAME_LINE,
  MAX_AGE,
  type MilestoneKind,
} from "@/content/timeline/schema";
import { composeAllYears, toSpans, isStageIntroNote } from "@/content/timeline/select";
import {
  LINT_ALLOWLIST_ATTR,
  LINT_ALLOWLIST_ID,
  ATTR_TERMINAL,
  ATTR_STAGE_BAND,
  ATTR_SENSITIVE,
  ATTR_CARE_NOTE,
  ATTR_READ_REF,
} from "@/content/timeline/dom";

export const metadata: Metadata = {
  title: "The Timeline — The Guidebook to Life",
  description:
    "Every year from birth to one hundred, with what commonly runs through it: rules with ages in them, windows bodies move through, schedules institutions keep, patterns in a population, and the things people say.",
};

const LAST_REVIEWED = "2026-09-03";

export default function TimelinePage() {
  const years = composeAllYears(MILESTONES);
  // §5.4 — records that belong in a stage intro rather than on the spine.
  const stageNotes = new Map<string, typeof MILESTONES>();
  for (const m of MILESTONES.filter(isStageIntroNote)) {
    const sid = (m as { stageId?: string }).stageId ?? "";
    stageNotes.set(sid, [...(stageNotes.get(sid) ?? []), m]);
  }
  const spans = toSpans(MILESTONES);
  const majorIds = new Set(MILESTONES.filter((m) => (m as { major?: boolean }).major).map((m) => m.id));
  const allById = new Map(MILESTONES.map((m) => [m.id, m]));
  // Each record's anchor lives in exactly ONE year — the first it appears in — so
  // a state-varying rule spanning several years does not emit the same id repeatedly.
  const anchorYear = new Map<string, number>();
  for (const comp of years) {
    for (const m of [...comp.rules, ...comp.begins, ...comp.heard, ...comp.sensitive]) {
      if (!anchorYear.has(m.id)) anchorYear.set(m.id, comp.age);
    }
  }
  const divergingIds = MILESTONES.filter((m) => (m as { bySex?: unknown }).bySex).map((m) => m.id);

  const bands = STAGES_TL.filter((s) => s.id !== TERMINAL_STAGE.id).map((s) => ({
    id: s.id,
    label: s.label,
    shortLabel: s.shortLabel,
    from: s.ageBand[0],
    to: s.ageBand[1],
  }));

  const firstYearOfStage = new Map<number, string>();
  for (const s of STAGES_TL) {
    if (s.id === TERMINAL_STAGE.id) continue;
    firstYearOfStage.set(s.ageBand[0], s.id);
  }

  const kinds = Object.keys(KIND_LABEL) as MilestoneKind[];
  const researchRequired = MILESTONES.filter((m) => (m as { researchRequired?: boolean }).researchRequired === true);

  return (
    <InstrumentPage>
      <div className="tl-page">
        <PageHeader
          eyebrow="Year by year"
          title="The Timeline"
          intro="Every year from birth to one hundred, and what commonly runs through it. Ages here come from sources we fetched and quoted; where we could not find one, the record says so instead of guessing."
          status="researched"
        />

        <p className="tl-frame-line">{REFERENCE_FRAME_LINE}</p>

        {/*
          THE ONE ALLOWLISTED BLOCK (§5.1, T-3). This is the single place on the
          timeline permitted to print the words the normative lint forbids,
          because its entire job is to name the pressure a timeline creates and
          refuse it. T-3 asserts the allowlist has exactly one entry.
        */}
        <section
          className="tl-how-to-read"
          {...{ [LINT_ALLOWLIST_ATTR]: LINT_ALLOWLIST_ID }}
          aria-labelledby="how-to-read-h"
        >
          <h2 id="how-to-read-h">How to read this</h2>
          <p className="tl-off-common">{OFF_COMMON_LINE}</p>
          <p>
            Five different kinds of thing get called an “expectation”, and they are not the same
            kind of thing at all. Each record below says which one it is, because a rule written
            into law and something your relatives say at a wedding deserve very different amounts
            of your attention.
          </p>
          <dl className="tl-kind-key">
            {kinds.map((k) => (
              <div key={k}>
                <dt>{KIND_LABEL[k]}</dt>
                <dd>{KIND_STANDING_LINE[k]}</dd>
              </div>
            ))}
          </dl>
          <p>
            The coloured bands across the spine are stage names — {NAVIGATION_CONVENTION_LINE}. They
            claim nothing, which is why they are the only ages on this page with no source attached.
          </p>
          <p>
            Proportions and rates never appear on the spine or in a year card. They live inside the
            evidence drawer on each record, beside the source we read them on. What the surface
            carries is the age or the window.
          </p>
        </section>

        <TimelineInstrument
          spans={spans}
          bands={bands}
          divergingCount={divergingIds.length}
          divergingIds={divergingIds}
        />

        <p className="tl-stage-band-note" {...{ [ATTR_STAGE_BAND]: "key" }}>
          {bands.map((b, i) => (
            <span key={b.id}>
              {i > 0 ? " · " : ""}
              {b.label} {b.from}–{b.to}
            </span>
          ))}
        </p>

        <div className="tl-years">
          {years.map((comp) => {
            const stage = stageForAge(comp.age);
            const isFirst = firstYearOfStage.get(comp.age) === stage?.id;
            return (
              <div key={comp.age}>
                {isFirst && stage?.rendersCrisisNote ? <CrisisNote /> : null}
                <YearCard
                  comp={comp}
                  stage={stage}
                  stageIntro={isFirst}
                  sources={SOURCES}
                  majorIds={majorIds}
                  allById={allById}
                  anchorYear={anchorYear}
                  stageNotes={isFirst && stage ? (stageNotes.get(stage.id) ?? []) : []}
                />
              </div>
            );
          })}
        </div>

        {/*
          §4.6 — the research-required records. They have no year because we have no
          figure, so they cannot sit in a year card; they render here, together,
          with the shape of the claim in words and NO DIGIT. Showing them is the
          point: a timeline that quietly filled these gaps would look better and be
          worth less.
        */}
        {researchRequired.length > 0 ? (
          <section className="tl-not-sourced-block" aria-labelledby="tl-rr-h">
            <h2 id="tl-rr-h">Things we could not put a year on</h2>
            <p>
              We know the shape of each of these and we could not find a source we can quote for the
              number, so no number is shown. Each one is listed in the build&rsquo;s known-limitations
              record with the query that would resolve it.
            </p>
            <ul className="tl-list">
              {researchRequired.map((m) => (
                // These appear in no year card, so this is where their anchor lives.
                <li key={m.id} id={m.id}>
                  <MilestoneLine m={m} sources={SOURCES} majorIds={majorIds} allById={allById} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* The terminal card (§3.3, §5.4). Set-down register, both pages named first. */}
        <section
          className="tl-terminal"
          id="beyond"
          {...{ [ATTR_TERMINAL]: "1", [ATTR_SENSITIVE]: "dying" }}
          aria-labelledby="terminal-h"
        >
          <h2 id="terminal-h">{TERMINAL_STAGE.label}</h2>
          <p className="tl-care-note" {...{ [ATTR_CARE_NOTE]: "1" }}>
            If you are here because someone has died, or because someone is dying now, these are the
            pages written for that, and they are better than this card:{" "}
            <Link href="/situations/a-death" {...{ [ATTR_READ_REF]: "/situations/a-death" }}>
              When someone dies
            </Link>{" "}
            and{" "}
            <Link href="/situations/grief" {...{ [ATTR_READ_REF]: "/situations/grief" }}>
              Grief and loss
            </Link>
            .
          </p>
          {TERMINAL_STAGE.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="tl-stamp">
            There is no marker on the spine for the end of a life, and no year on this timeline
            carries a figure for how likely it is. That is a deliberate absence.
          </p>
        </section>

        <section aria-labelledby="tl-honesty-h" className="tl-how-to-read-plain">
          <h2 id="tl-honesty-h">What this page does not know</h2>
          <p>
            {researchRequired.length === 0
              ? "Every record on this page that shows an age has a source we fetched and quoted."
              : `Some records here show no age at all, because we looked for a source we could quote and did not find one. They are labelled “not yet sourced” and they are listed, with the query that would resolve each one, in the build's known-limitations record.`}
          </p>
          <p>
            There is no average person on this page. Each window stands on its own population and
            its own source, and they do not compose into one life.{" "}
            <Link href="/methodology#timeline">How this timeline was sourced</Link> ·{" "}
            <Link href="/map">The stage overview</Link>
          </p>
          <p className="tl-stamp">Last reviewed {LAST_REVIEWED}</p>
        </section>
      </div>
    </InstrumentPage>
  );
}
