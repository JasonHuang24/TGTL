import type { Metadata } from "next";
import Link from "next/link";
import { ReadingPage, PageHeader, Callout } from "@/components/primitives";
import { ResetButton } from "@/components/ResetButton";
import { EngineMethodology } from "@/components/reference/EngineMethodology";
import { SandboxMethodology } from "@/components/reference/SandboxMethodology";
import { TimelineMethodology } from "@/components/reference/TimelineMethodology";
import {
  INTERNAL_MODEL,
  KNOWN_BREAKS,
  WHATS_COMING,
  CORRECTIONS,
} from "@/content/methodology";

export const metadata: Metadata = {
  title: "How this site works",
  description:
    "The instrument and how to judge it, the two editions and set-down, how evidence works, the corrections register, the known breaks, and what's coming.",
};

const KIND_LABEL: Record<string, string> = {
  correction: "Correction",
  retraction: "Retraction",
  "recommendation-change": "Recommendation change",
  decision: "Build decision",
  "engine-change": "Engine change",
  "source-change": "Source change",
};

/**
 * Methodology (§6.9, ~1,200 words). Reader-facing and interesting, not
 * defensive. Carries the corrections register (live format, G-12) and the
 * known-breaks list. Anchors: #intensity, #corrections, #known-breaks (linked
 * from set-down notices, the footer, and evidence drawers).
 */
export default function MethodologyPage() {
  return (
    <ReadingPage>
      <PageHeader
        eyebrow="How this works"
        title="This site is an instrument"
        intro="It describes life using the vocabulary of a game. That is not a claim that life is a game. It is a way of seeing — and, like any instrument, it is fairly judged by what it lets you notice and do, not by how closely it resembles its subject."
      />

      <p>
        A map projection distorts the globe; you choose the projection for the journey you are making and
        you keep track of the distortion. This is the same. The game frame makes some things visible that
        plain life-language hides: it separates a decision from its outcome, so you can have played well
        and still lost; it makes costs legible, especially the invisible ones — slack, attention, the
        credit in a relationship; and it lets you talk about yourself as a system without it curdling into
        self-blame. The price is real: an instrument you look through for long enough stops being
        something you look through and becomes the way things look. That is not a risk to be managed away.
        It is the cost of the position, and naming it is part of using it honestly.
      </p>

      <h2 id="intensity">Two editions, and when the frame is set down</h2>
      <p>
        The same facts are written in two vocabularies. <strong>Standard</strong> uses plain reflective
        language; <strong>Game Guide</strong> uses strategy-guide language. They are two ways of speaking
        over one underlying model — switching between them never changes a claim or a conclusion, and you
        keep your place. Not every idea gets a game translation, and any game term is defined in plain
        words the first time a page uses it.
      </p>
      <p>
        Some pages put the frame away entirely. Grief, a death, depression, abuse, and the help-now page
        render with no game metaphor, no ratings, no ornament, in either edition — because some situations
        are not made clearer by being taken apart, and applying the apparatus there would only produce the
        appearance of understanding at a cost to someone already being handled a great deal. You can also
        turn the framing down everywhere yourself, with the control at the top of the page; it reduces the
        vocabulary and the chrome, never the content.
      </p>

      <h2>The model underneath, in one screen</h2>
      <p>
        You never have to meet this to use the site — every page speaks plainly first. But for the curious,
        the content is typed against a small model, which is what lets both editions render from one source
        and keeps future growth coherent. Readers meet these as ordinary questions.
      </p>
      <dl className="model-list">
        {INTERNAL_MODEL.map((m) => (
          <div key={m.type}>
            <dt>{m.type}</dt>
            <dd>{m.plain}</dd>
          </div>
        ))}
      </dl>

      <EngineMethodology />

      <SandboxMethodology />

      <h2>How evidence works here</h2>
      <p>Every claim that carries weight is marked with one of three statuses:</p>
      <ul>
        <li>
          <strong>Illustrative</strong> — a worked example or demonstration fixture, labelled where it
          appears. It shows the shape of a thing; it is not a measured finding, and any numbers in it are
          examples, not data.
        </li>
        <li>
          <strong>Our judgement</strong> — the site&rsquo;s reasoned synthesis, shown with its reasoning
          rather than a citation. Most of the explanatory writing here is this.
        </li>
        <li>
          <strong>Researched</strong> — rests on at least one recorded source. Almost nothing in this
          preview claims this status except the hotline numbers, each of which was checked against its official source on 2026-09-04, and the timeline’s milestone records, each of which carries the page it was read from.
        </li>
      </ul>
      <p>
        Evidence-bearing pages carry a drawer with the status, what would change the claim, and — where the
        page leans on the model — one honest sentence about where the frame fails. Dated claims carry an
        &ldquo;as of&rdquo; stamp, because a claim about a moving target without a date is a claim pretending
        not to have an expiry. &ldquo;No recommendation&rdquo; and &ldquo;not enough evidence&rdquo; are
        treated as successful outputs, always paired with what would reduce the uncertainty. No statistic,
        probability, dose, or hotline number is invented; where a research finding is real but its size
        varies, the finding is used without a number.
      </p>

      <TimelineMethodology />

      <h2 id="known-breaks">Known breaks in this model</h2>
      <p>
        An instrument whose failures accumulate silently is one that rots. So the places where this
        site&rsquo;s own frame strains are written down, in public, and grown as more are found.
      </p>
      <div className="known-breaks">
        {KNOWN_BREAKS.map((b) => (
          <section key={b.id} id={b.id} className="known-break">
            <h3>{b.title}</h3>
            <p>{b.detail}</p>
          </section>
        ))}
      </div>

      <h2>No scores, and why</h2>
      <p>
        There is no point total, level, streak, completion percentage, or comparison to other readers
        anywhere on this site, and there never will be. The reasons, in descending order of how much they
        matter:
      </p>
      <ol className="no-scores">
        <li>
          A score needs a metric, and there is no defensible metric for a life. Any number here would encode
          a judgement about how to live and present it as a measurement — and the easiest way to make a value
          judgement invisible is to put a number on it.
        </li>
        <li>
          Scores invite comparison, and comparison across unequal positions is cruel: a life-score would
          rate a life with no slack below one with it, a carer below someone with no dependents, a
          chronically ill person below a well one. That is inequality restated as a scoreboard.
        </li>
        <li>
          Reward mechanics degrade the very things this site cares about. A streak counter on grief work
          would be grotesque; a completion bar on a practice converts the practice into a task.
        </li>
        <li>
          Progression implies a curve, but most of most lives is the competent repetition of maintenance,
          which a progression system would register as a flatline — telling most people, most of the time,
          that they were failing.
        </li>
        <li>
          Engagement mechanics serve the site, not the reader. The success condition here is that you find
          what you needed and leave.
        </li>
      </ol>
      <p>
        What replaces scores is legibility. Games are not enjoyable because of points; they are enjoyable
        because they are comprehensible and you have agency inside them. This site keeps the
        comprehensibility and leaves the points.
      </p>

      <h2>What this is not</h2>
      <p>
        This is not therapy, diagnosis, or legal, financial, or medical advice. It describes systems and
        your position within them; it does not prescribe, and it is not a substitute for a professional who
        knows your particulars. Where a page touches something a clinician, lawyer, or specialist service
        should handle, it says so and points you there.
      </p>

      <h2 id="preview-status">Preview status</h2>
      <p>
        This is a labelled preview, published so it can be read and criticised. It is not a launch. The
        blueprints this site is built from make certain human reviews release blockers, and not all of
        them have happened. Until they have, the foot of every page says <em>preview</em> and the pages
        ask search engines not to index them.
      </p>
      <p>Still open, as of 2026-09-04:</p>
      <ul className="whats-coming">
        <li>
          A pediatric or developmental reading of the timeline&rsquo;s child-development and puberty
          records.
        </li>
        <li>
          A clinical reading of the timeline&rsquo;s fertility, later-health and dying records, and of the
          life-expectancy note in the later-life stage.
        </li>
        <li>
          Clinical and specialist review of the five sensitive pages &mdash; depression, a death, grief,
          being hurt, and supporting someone &mdash; and of the scripted loss beats in the Playthrough.
        </li>
        <li>
          The owner&rsquo;s editorial read of the timeline&rsquo;s &ldquo;what gets said&rdquo; records and
          of the list of records still marked <em>not yet sourced</em>.
        </li>
        <li>The art checkpoint on the timeline&rsquo;s stage rail.</li>
        <li>An independent acceptance review of the play layer as it shipped in 4.0.</li>
      </ul>
      <p>
        Closed on 2026-09-04: hotline verification. Every number on the help-now page was checked against
        its official source, and the five source addresses that had gone stale were replaced. The entry is
        in the register below.
      </p>

      <h2 id="corrections">Corrections and changes</h2>
      <p>
        The register below is live from the first day, in the format it will keep — covering corrections,
        retractions and downgrades, and changes of recommendation. Its first entries are this build&rsquo;s
        own decisions, recorded so they can be audited.
      </p>
      <ul className="corrections-register">
        {CORRECTIONS.map((c) => (
          <li key={c.id} className="correction-entry">
            <div className="correction-head">
              <span className="correction-kind" data-kind={c.kind}>
                {KIND_LABEL[c.kind]}
              </span>
              <span className="correction-date">{c.date}</span>
            </div>
            <p className="correction-summary">{c.summary}</p>
            <p className="correction-detail">{c.detail}</p>
          </li>
        ))}
      </ul>

      <h2>What&rsquo;s coming</h2>
      <p>
        This is the only place on the site where unbuilt scope is named — everywhere else, a page either
        exists at useful depth or is not shown.
      </p>
      <ul className="whats-coming">
        {WHATS_COMING.map((w, i) => (
          <li key={i}>{w}</li>
        ))}
      </ul>

      <Callout tone="quiet" title="What this site remembers about you">
        <p>
          Only what you tell it, and only in this browser: your edition and framing choices, and anything you
          type into the board, the logs, or the guidance flow. None of it is sent anywhere, put in the
          address bar, or scored. You can erase all of it at once.
        </p>
        <ResetButton />
      </Callout>

      <p className="methodology-foot">
        <Link href="/walkthrough">Start from the walkthrough</Link>, or{" "}
        <Link href="/">go back to the two books</Link>.
      </p>
    </ReadingPage>
  );
}
