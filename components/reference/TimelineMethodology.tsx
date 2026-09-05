/**
 * The timeline's `/methodology` disclosures (5.0 blueprint §6.3) — a SERVER component.
 *
 * "Rendered from the same fixtures the timeline runs on": every count, the band
 * table, the kinds and the lane crosswalk are read from the live content and the
 * live schema, so this page cannot drift from what the timeline actually does. If
 * someone adds a kind, it appears here. If the research-required list grows, the
 * number here grows with it.
 */
import Link from "next/link";
import { MILESTONES, SOURCES } from "@/content/timeline/generated";
import {
  KIND_LABEL,
  KIND_STANDING_LINE,
  LANE_LABEL,
  LANES,
  BAND_TABLE,
  SOURCE_KIND_LABEL,
  EVIDENCE_LABEL_TEXT,
  EVIDENCE_LABEL_MEANING,
  type MilestoneKind,
  type EvidenceLabel,
} from "@/content/timeline/schema";

/** §7.2 — a crosswalk, deliberately not a shared enum. */
const LANE_CROSSWALK: Record<string, { map: string; sim: string }> = {
  "body-health": { map: "Health", sim: "health" },
  learning: { map: "Learning", sim: "school" },
  "work-income": { map: "Work", sim: "work" },
  "money-wealth": { map: "Money", sim: "money" },
  "home-independence": { map: "— (the map has no home track)", sim: "home" },
  "people-family": { map: "Relationships & family", sim: "people" },
  "civic-legal": { map: "— (the map has no civic track)", sim: "civic" },
  "inner-life": { map: "Meaning", sim: "inner" },
};

const pct = (n: number) => `${Math.round(n * 100)}%`;

export function TimelineMethodology() {
  const kinds = Object.keys(KIND_LABEL) as MilestoneKind[];
  const sourced = MILESTONES.filter((m) => m.researchRequired !== true);
  const researchRequired = MILESTONES.filter((m) => m.researchRequired === true);
  const sensitive = MILESTONES.filter((m) => (m as { sensitivity?: string }).sensitivity);
  const cultural = MILESTONES.filter((m) => m.kind === "cultural-expectation");
  const diverging = MILESTONES.filter((m) => (m as { bySex?: unknown }).bySex);
  const sourceCount = Object.keys(SOURCES).length;

  const byKind: Record<string, number> = {};
  for (const m of MILESTONES) byKind[m.kind] = (byKind[m.kind] ?? 0) + 1;

  const bySourceKind: Record<string, number> = {};
  for (const s of Object.values(SOURCES)) bySourceKind[s.kind] = (bySourceKind[s.kind] ?? 0) + 1;

  const usedLabels = new Set<EvidenceLabel>(MILESTONES.map((m) => m.evidence));

  return (
    <>
      <h2 id="timeline">How the timeline was sourced</h2>
      <p>
        The timeline carries {MILESTONES.length} records across {LANES.length} lanes, resting on{" "}
        {sourceCount} sources. It works on one rule, and the rule is stricter than it sounds:{" "}
        <strong>
          a number that was not read on a page fetched while this build was being made is an invented
          number
        </strong>
        . Nothing here was typed from memory, from a prior version of this project, or from another
        site&rsquo;s summary.
      </p>
      <p>
        Every figure traces to a source record holding the page&rsquo;s address, the date we fetched it,
        and a <strong>verbatim excerpt of at most twenty-five words containing the figure</strong>. You
        can open that excerpt on any record, in the evidence drawer, and read the sentence we read.
      </p>

      <h3>The order we trusted sources in</h3>
      <ol>
        <li>
          <strong>Official statistical agencies and rule-setters</strong> — the Census Bureau, the
          National Center for Health Statistics, the Bureau of Labor Statistics, the National Center for
          Education Statistics, the Social Security Administration, and the statutes and regulations
          themselves.
        </li>
        <li>
          <strong>Professional bodies and peer-reviewed sources</strong> for windows in bodies — cited
          for the range and the population it was measured in, never for advice.
        </li>
        <li>
          <strong>Reputable secondary sources, disclosed as such</strong>, with the primary named where
          the secondary cites one.
        </li>
        <li>
          <strong>Never as a sole source:</strong> encyclopedias, blogs, listicles, milestone
          content-farms, machine-generated summaries, or anything this project itself has written.
        </li>
      </ol>
      <p>
        What we ended up with:{" "}
        {Object.entries(bySourceKind)
          .sort((a, b) => b[1] - a[1])
          .map(([k, n], i) => (
            <span key={k}>
              {i > 0 ? " · " : ""}
              {n} {SOURCE_KIND_LABEL[k as keyof typeof SOURCE_KIND_LABEL] ?? k}
            </span>
          ))}
        .
      </p>

      <h3>How it was checked</h3>
      <p>
        Records were written in batches by one process and then handed to a <em>separate</em> one whose
        only instruction was to find violations, and which was given the written records but never the
        reasoning behind them. It re-fetched every source address and checked that the excerpt is
        actually on the page, that it is verbatim rather than a paraphrase, that every figure in the
        record appears inside that excerpt, and that the claim does not say more than the source does.
      </p>
      <p>
        It found things. Across the first eight batches it raised seventeen blocking defects — among them
        an age that appeared in no excerpt at all, a sentence about a vote in 1787 quoted as though it
        stated present law, a rule that varies by circumstance flattened into one age, and a survey&rsquo;s
        age brackets mistaken for the ages at which people did the thing. Each one was repaired, or the
        record was demoted to &ldquo;not yet sourced&rdquo;, before it reached the page. The whole record of
        that process ships with the build.
      </p>

      <h2 id="timeline-kinds">Five kinds of expectation, and two we refuse to carry</h2>
      <p>
        &ldquo;You&rsquo;re expected to have done this by now&rdquo; hides at least five different claims
        with wildly different standing. The timeline separates them and labels every record with which
        one it is:
      </p>
      <dl className="tl-method-kinds">
        {kinds.map((k) => (
          <div key={k}>
            <dt>
              {KIND_LABEL[k]} <span className="tl-method-count">({byKind[k] ?? 0})</span>
            </dt>
            <dd>{KIND_STANDING_LINE[k]}</dd>
          </div>
        ))}
      </dl>
      <p>
        Two more kinds exist in the world and are <strong>excluded from this timeline by its own
        type system</strong>, which means they cannot be written here even by accident:{" "}
        <strong>strategic recommendations</strong> (what would be a smart move) and{" "}
        <strong>personal targets</strong> (what you have decided you want). Strategy lives on{" "}
        <Link href="/guidance">the guidance pages</Link>, where it is labelled as advice. Personal
        targets are yours and the site has no business holding an opinion about them. A record here may
        describe what tends to follow from doing something earlier or later; it may never tell you when
        to do it.
      </p>

      <h2 id="timeline-numbers">Why you almost never see a percentage</h2>
      <p>
        Ages and windows render as ages. <strong>Rates do not render on the timeline at all</strong> —
        not on the spine, not in a year card. A proportion appears only inside an evidence drawer, next
        to the sentence it came from, as an absolute figure. Where the surface needs to say how common
        something is, it uses a word from a published table rather than a number:
      </p>
      <div className="tl-method-scroll" data-scroll-region>
      <table className="tl-method-bands">
        <thead>
          <tr>
            <th>Word</th>
            <th>Means a share of at least</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>most</td><td>{pct(BAND_TABLE.most)}</td></tr>
          <tr><td>about half</td><td>{pct(BAND_TABLE.aboutHalf)}</td></tr>
          <tr><td>many</td><td>{pct(BAND_TABLE.many)}</td></tr>
          <tr><td>some</td><td>{pct(BAND_TABLE.some)}</td></tr>
          <tr><td>few</td><td>below that</td></tr>
        </tbody>
      </table>
      </div>
      <p>
        Those thresholds are our choice, not a standard. They are published here so you can disagree
        with them, and a relative figure never appears without its absolute base beside it.
      </p>

      <h2 id="timeline-no-average-person">There is no average person on the timeline</h2>
      <p>
        Every window on this page stands on its own population and its own source. They do{" "}
        <strong>not</strong> compose into one life. Nobody is the person who does all of these things at
        all of these ages, and the median age of one thing tells you nothing about the median age of the
        next thing for the same people. If you find yourself reading down a year and assembling a
        person out of it, that person does not exist.
      </p>
      <p>
        Nor is any of it a prediction. These are descriptions of populations in the past, and the last
        few decades have moved several of them a long way. Which brings us to the caution that matters
        most:
      </p>

      <h2 id="timeline-cohort">Age, period, and cohort — the caution</h2>
      <p>
        When something looks like it changes with age, three different explanations are competing, and a
        table of ages cannot separate them. It may be <strong>age</strong>: the thing really does change
        as people get older. It may be <strong>period</strong>: something changed for everyone at once,
        in the year the data was collected. Or it may be <strong>cohort</strong>: the people who are
        seventy now were born into a different world from the people who are thirty now, and have been
        different their whole lives.
      </p>
      <p>
        A figure like the median age at first marriage carries all three at once. It has risen for
        decades — that is a cohort story more than an age one. Reading it as &ldquo;what people do&rdquo;
        rather than &ldquo;what people born around then did&rdquo; is the commonest way to misread this
        whole page. The generational layer that would show this properly — the same age across different
        cohorts, side by side — is not built yet; for now, <Link href="/history">the history page</Link>{" "}
        is where the moving frame is discussed.
      </p>

      <h2 id="timeline-sex-lens">The sex lens, and what it refuses to do</h2>
      <p>
        {diverging.length === 0 ? (
          <>
            No record on the timeline currently shows a difference by sex, because a record may only do
            so when its source states what it actually measured, and none of the sources behind the
            current records does.
          </>
        ) : (
          <>
            {diverging.length} of the {MILESTONES.length} records show a difference by sex. A record may
            only do so when its source states what it actually measured, and the note beside the lens
            reports that true count rather than a rounder one.
          </>
        )}
      </p>
      <p>
        This matters more than it looks. Sources differ in whether they recorded sex at birth, asked
        people their gender, or quietly mixed the two, and a timeline that flattens that difference is
        making a claim its data cannot support. Where a source does not say, the record carries no
        divergence at all — even where one plausibly exists. That is deliberate under-claiming. The
        labels the lens uses are binary because the underlying data is; binary data does not describe
        every person&rsquo;s identity or experience, and the lens is not an account of who anyone is.
      </p>

      <h2 id="timeline-sensitive">The quiet parts</h2>
      <p>
        {sensitive.length} record{sensitive.length === 1 ? "" : "s"} on the timeline concern child
        development, puberty, fertility, health in later life, or dying. They are handled differently on
        purpose, and the difference is enforced by the build rather than left to good intentions:
      </p>
      <ul>
        <li>
          They render in plain language <strong>in both editions</strong>. The game vocabulary is
          withdrawn entirely — no unlocks, no gates, no rewards, no chrome of any kind.
        </li>
        <li>
          Each one carries a short note saying what the material is not, and a link to the page actually
          written for it. Records about dying name{" "}
          <Link href="/situations/a-death">the page on a death</Link> and{" "}
          <Link href="/situations/grief">the page on grief</Link> first, before anything else.
        </li>
        <li>
          Records about child development carry the line{" "}
          <em>
            a population range is not a screening threshold; if you are worried about a child, the route
            is a pediatrician, not a website
          </em>
          , and the reminder that variation is not deviation.
        </li>
        <li>
          Nothing about a body is ever framed as a penalty, a deadline, or a failure. A window that
          narrows is stated as the fact it is, with routes beside it.
        </li>
        <li>
          <strong>There is no death marker on the spine</strong>, no per-year figure for how likely
          dying is, and no &ldquo;average age at death&rdquo; anywhere. Life expectancy appears once,
          with its scope stated, in the later-life material.
        </li>
        <li>
          Crisis material — abuse, self-harm, violence — appears nowhere on the timeline at all. It
          belongs on <Link href="/threshold">the pages written for it</Link>, which the timeline names
          once, quietly, and does not elaborate on.
        </li>
      </ul>
      <p>
        These records are also on the list of things a qualified professional has to read before this
        site is public. That review has not happened yet, and the build says so rather than implying
        otherwise.
      </p>

      <h2 id="timeline-not-sourced">What we could not source</h2>
      <p>
        {researchRequired.length === 0 ? (
          <>
            Every record on the timeline that shows an age carries a source we fetched and quoted.
          </>
        ) : (
          <>
            <strong>{researchRequired.length}</strong> record
            {researchRequired.length === 1 ? " is" : "s are"} marked{" "}
            <em>not yet sourced</em>. We know the shape of the claim and we do not have a number we can
            quote for it, so the record shows the shape in words and <strong>no digit at all</strong>.
            Each one is listed in the build&rsquo;s known-limitations record together with the exact
            query that would resolve it.
          </>
        )}{" "}
        {sourced.length} record{sourced.length === 1 ? "" : "s"} carr
        {sourced.length === 1 ? "ies" : "y"} a source.
      </p>
      <p>
        Showing the gaps is the point. A timeline that quietly filled them with plausible numbers would
        look better and be worth less.
      </p>

      <h3>The evidence labels in use</h3>
      <dl className="tl-method-kinds">
        {(Object.keys(EVIDENCE_LABEL_TEXT) as EvidenceLabel[])
          .filter((l) => usedLabels.has(l) || l === "calibrated")
          .map((l) => (
            <div key={l}>
              <dt>{EVIDENCE_LABEL_TEXT[l]}</dt>
              <dd>{EVIDENCE_LABEL_MEANING[l]}</dd>
            </div>
          ))}
      </dl>

      <h2 id="timeline-lanes">The eight lanes, and how they line up with the rest of the site</h2>
      <p>
        The timeline&rsquo;s lanes are not the same set as the map&rsquo;s domains or the
        simulation&rsquo;s card families, and they are deliberately not a shared list — each was chosen
        for what its own surface has to do. This is the crosswalk:
      </p>
      <div className="tl-method-scroll" data-scroll-region>
      <table className="tl-method-bands">
        <thead>
          <tr>
            <th>Timeline lane</th>
            <th>On the map</th>
            <th>In the simulation</th>
          </tr>
        </thead>
        <tbody>
          {LANES.map((l) => (
            <tr key={l}>
              <td>{LANE_LABEL[l]}</td>
              <td>{LANE_CROSSWALK[l]?.map ?? "—"}</td>
              <td>{LANE_CROSSWALK[l]?.sim ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p>
        Coverage across them is uneven, and the unevenness is a fact about what gets measured rather
        than about what matters. Rules with ages written into them are easy to quote exactly; inner life
        is barely measured as an age at all. The well-sourced parts of this page are not the important
        parts of a life.
      </p>
      {cultural.length > 0 ? (
        <p>
          {cultural.length} record{cultural.length === 1 ? "" : "s"} on the timeline are things people
          say rather than things that are true. They render as quotation, set apart, under the line{" "}
          <em>an expectation is a thing said to you, not a fact about you</em>. They are our judgement
          about what gets said, they are labelled as such, and they carry no ages of their own.
        </p>
      ) : null}
    </>
  );
}
