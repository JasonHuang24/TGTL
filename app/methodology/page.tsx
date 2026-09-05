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

      {/* N-434 — the clearest one-line statement of what this site is for, said
          with the disavowal that was written in the same breath. The promise
          without the disavowal would be the thing this whole page exists to
          refuse. */}
      <Callout tone="warm" title="What this is trying to be">
        <p>
          The mentor you never had. What that means, exactly: we will show you what other people
          learned, what the evidence suggests where there is any, what the trade-offs are, and where
          the advice may fail.
        </p>
        <p>
          What it explicitly does <em>not</em> mean: that we know the correct way to live. Nobody here
          has that, the question is not the kind that has one answer, and a site that behaved as though
          it did would be doing something other than what it says on this page.
        </p>
      </Callout>

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
      {/* N-272 (§3.10, §5.3): the set-down rule, published. */}
      <p>
        Setting the frame down is not the same as setting the evidence down. A page with the frame
        down may still carry an evidence label &mdash; Illustrative, Our judgement, Researched
        &mdash; and may not carry a game term. The two prohibitions are different in kind. Game
        vocabulary goes away because taking a bereavement apart produces the appearance of
        understanding at a cost to someone already being handled a great deal. The evidence label
        stays because a page about grief is exactly where a reader is most likely to have been
        handed a folk model as a fact, and marking it as folk belief is the one correction that most
        protects them; withholding it would protect the register at the reader&rsquo;s expense.
        Applying the rule to the five pages under clinical and specialist review waits for that
        review &mdash; those pages are unchanged, and nothing was labelled on them here.
      </p>
      {/* N-329 (C-35) — the register policy, published where a reader can see it.
          Stating the rule in public is what makes the humour safe rather than
          risky; a site that is funny without a stated boundary is one bad page
          away from being funny in the wrong room. */}
      <h3 id="comic-register">Where this site is allowed to be funny</h3>
      <p>
        Some things really are absurd, and writing about them with a straight face is its own kind of
        dishonesty. Renewing a passport, contesting a parking notice, and the average telephone menu are
        not tragedies, and a page that pretends otherwise is not being respectful — it is being
        inaccurate.
      </p>
      <p>
        So a comic register is <strong>permitted on bureaucracy-shaped pages</strong>: guides to
        processes, forms and queues, where the comedy is aimed at the process and never at the person
        stuck in it. And it is <strong>banned on every set-down route and every loss-adjacent one</strong>{" "}
        — a bereavement, a death, low mood, being hurt, the help-now page, the page for a day with
        nothing left in it, and{" "}
        <Link href="/situations/breakup">the page about a relationship ending</Link>, which is not set
        down but is read by someone who has just lost something. The rule is declared per page in the
        route inventory, not left to whoever is writing; the build checks that nothing declared comic is
        set down or loss-adjacent, and refuses if it is.
      </p>
      <p>
        No page in this version is flagged comic. The rule and its check ship first, so that the first
        bureaucracy guide inherits a boundary rather than negotiating one.
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
        {/* N-253 (§5.4): the presentation walls, adopted before the thing they govern
            exists. No scene layer is built in this version and none is planned here. */}
        <section id="graphical-layer" className="known-break">
          <h3>Rules adopted for a picture that does not exist yet</h3>
          <p>
            Nothing on this site is drawn. If a scene layer is ever built, these rules were adopted
            before it, so the first picture inherits them instead of arguing with them: a safety
            transition replaces the scene with calm, plain help and never animates damage or
            failure; health is shown through capacity, symptoms, support, access and accommodation,
            never through grotesque visuals; discrimination and systemic exclusion are never drawn
            as penalties attached to a person, because they are properties of a ruleset; parenthood
            and childlessness are never scored; appearance never determines worth; and colour never
            encodes a verdict. Writing them down now is the point &mdash; a rule adopted after the
            first picture is a rule argued against a picture someone has already made.
          </p>
        </section>
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

      {/* N-430 (§3.10): the owner's own safety charters, published as checklists so the
          walls can be read and held against the instruments rather than lived in a brief.
          Each item is one line. No numbers. */}
      <h2 id="never-do">What these instruments must never do</h2>
      <p>
        The rules below were written before the instruments they govern, and they are published so
        you can hold the site to them. They are not aspirations. Each one names a specific way an
        instrument of this kind goes wrong, and several of them describe things this site avoids by
        construction rather than by care &mdash; there is no account, no rating of you, and nothing
        to compare against anyone else. The list is the reason for the construction.
      </p>

      <h3>Anything that describes a difficulty or a position</h3>
      <ul>
        <li>Never label a reader, publicly or otherwise, without their asking for it.</li>
        <li>Never diagnose a physical or mental condition.</li>
        <li>Never score appearance, or rank it, or comment on it as a measure of anything.</li>
        <li>Never treat disability as a tragedy by default.</li>
        <li>Never encourage fatalism: a hard position is a description, not a settled ending.</li>
        <li>Never invite a competition about who has suffered more.</li>
        <li>Never turn trauma into entertainment.</li>
        <li>Never let a hard position be used to excuse harm done to somebody else.</li>
        <li>
          Never treat someone&rsquo;s pain as invalid because the conditions around it look
          favourable from outside.
        </li>
      </ul>

      <h3>Anything that describes a person&rsquo;s capacities</h3>
      <ul>
        <li>A described capacity is never a measure of human worth.</li>
        <li>A low reading is never a moral failure, and a high one is never proof of merit.</li>
        <li>No reading fixes what someone can become.</li>
        <li>Unknown stays unknown; it is never filled in to make a panel look finished.</li>
        <li>Nothing here diagnoses, and no profile is a diagnosis.</li>
        <li>
          Nothing is framed so that it invites a conclusion about which people ought to exist.
        </li>
        <li>Appearance and intelligence get the most careful handling of all, or none at all.</li>
        <li>Nothing about a reader is ever ranked against other readers, by default or on request.</li>
        <li>No child is boxed into a permanent identity by an early measurement.</li>
        <li>The environment and the support around a person stay visible beside anything said about them.</li>
        <li>No single attribute ever decides a recommended life.</li>
      </ul>

      <h3>Anything that reads a whole life back to you</h3>
      <ul>
        <li>Never reduce a life to what happens to be measurable.</li>
        <li>Never treat prestige as the achievement that counts.</li>
        <li>Never score a circumstance as a moral success or a moral failure.</li>
        <li>Never leave out unpaid care and ordinary love.</li>
        <li>Never turn a tragedy into entertainment.</li>
        <li>Never encourage obsessive comparison.</li>
        <li>Never claim more about cause than the evidence carries.</li>
        <li>Never present a constructed biography as history.</li>
        <li>Never manufacture regret out of a simplistic counterfactual.</li>
        <li>Never assume everyone is playing for the same thing.</li>
        <li>Never imply that a short life cannot be a meaningful one.</li>
      </ul>

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
          type into the board, the logs, or the guidance flow. All of it sits under keys the reset control
          clears. None of it is sent anywhere, put in the address bar, or scored. You can erase all of it at
          once.
        </p>
        {/* N-266 (§3.10): what is stored, and what the application cannot see. The
            second sentence is what makes the first one believable. */}
        <p>
          Visits to the help-now and safety pages are not recorded by this site. Your browser, device,
          network, or employer may still keep their own records &mdash; that is outside what this site can
          see or change, and it is the half most privacy notes leave out.
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
