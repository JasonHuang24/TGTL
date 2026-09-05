import type { Metadata } from "next";
import Link from "next/link";
import { ReadingPage, PageHeader, Callout, ModelBreak } from "@/components/primitives";
import { ResetButton } from "@/components/ResetButton";
import { EngineMethodology } from "@/components/reference/EngineMethodology";
import { SandboxMethodology } from "@/components/reference/SandboxMethodology";
import { TimelineMethodology } from "@/components/reference/TimelineMethodology";
import {
  INTERNAL_MODEL,
  DISANALOGIES,
  WHATS_COMING,
  CORRECTIONS,
  RETRACTIONS,
} from "@/content/methodology";
import { ROUTE_BY_PATH } from "@/content/routes";

export const metadata: Metadata = {
  title: "How this site works",
  description:
    "The instrument and how to judge it, the two editions and set-down, how evidence works, the corrections register, the known breaks, and what's coming.",
};

/** N-281 — the register's two axes, in reader words. */
const SEVERITY_LABEL: Record<string, string> = {
  structural: "Structural — the frame itself",
  material: "Material — how it is written and shown",
  edge: "Edge — a boundary not reached yet",
};

const STATUS_WORD: Record<string, string> = {
  open: "Open: no fix",
  mitigated: "Mitigated: built against, not solved",
  accepted: "Accepted: the cost of the position",
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

      {/* N-304 — the sentence that justifies the whole disclosure architecture,
          said at the top because it is the rule the rest of this page follows. */}
      <p className="methodology-standard">
        The working standard for everything below: this site should show its confidence without
        making you pay an <strong>evidence tax</strong> to read it. The reasoning, the status of a
        claim and the sources sit one click away in a drawer rather than in the middle of the
        sentence &mdash; there when you want to audit us, out of the way when you came here to find
        something out.
      </p>

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

      {/* N-392 (§3.11) — a reading skill, taught once and used everywhere. The
          brief's version is about kettles; the distinction is the same for
          careers, credentials, cities and schools, which is why it lives here
          rather than on one comparison page. */}
      <h2 id="nine-ways-best">Nine reasons something can be the popular choice</h2>
      <p>
        Whenever this site compares options, it refuses to name an overall winner, and the reason is
        worth having as a habit of your own. &ldquo;Best&rdquo; is not one thing, and the most
        common choice is not necessarily the strongest one. Before treating popularity as evidence
        of quality, check whether it is instead:
      </p>
      <ul className="nine-ways">
        <li>
          <strong>Availability</strong> &mdash; it is what was in front of most people, and the
          alternatives were somewhere else.
        </li>
        <li>
          <strong>Marketing</strong> &mdash; more was spent telling people about it than about
          anything better.
        </li>
        <li>
          <strong>Habit</strong> &mdash; it is what people already used, and switching required a
          reason.
        </li>
        <li>
          <strong>Bundling</strong> &mdash; it arrived attached to something else that was chosen
          for other reasons.
        </li>
        <li>
          <strong>Network effects</strong> &mdash; its value comes from other people using it, which
          is real but is not quality.
        </li>
        <li>
          <strong>Switching costs</strong> &mdash; leaving is expensive, so staying looks like
          preference.
        </li>
        <li>
          <strong>Placement</strong> &mdash; it was at eye level, at the top of the list, first in
          the results.
        </li>
        <li>
          <strong>A low price at the start</strong> &mdash; cheap to begin and dearer to keep, which
          is a different offer from cheap.
        </li>
        <li>
          <strong>Quality</strong> &mdash; which is on the list, and is one of nine.
        </li>
      </ul>
      <p>
        The same nine explain a crowded degree, a standard career path, a city everyone is moving to
        and a piece of advice everybody repeats. None of them makes the popular option wrong. What
        they do is stop &ldquo;most people do this&rdquo; from finishing the argument.
      </p>

      <TimelineMethodology />

      {/* N-281, N-282, N-283 (§3.11, C-45) — the disanalogy register. Numbered and
          anchored because pages cite entries by number; framed, per N-283, as what
          it actually is rather than as a modest closing caveat. */}
      <h2 id="known-breaks">Known breaks in this model</h2>
      <p>
        This section undermines the rest of the site, on purpose. That is not modesty and it is not
        a disclaimer: an instrument whose failure modes are not written down is dangerous in
        proportion to how useful it is, because the more it helps the more readily you stop checking
        it.
      </p>
      <p>
        There is a real trade-off here, and we are not going to resolve it for you. The confidence
        that makes an instrument worth using and the humility that makes it honest pull against each
        other: a page hedged into fog helps nobody, and a page that sounds certain about a life is
        lying. This site chooses to be direct on the page and to keep the whole list of its own
        failures in one place, numbered, where any page that strains can point at it. What that
        costs is the thing you are reading now &mdash; a section that tells you the frame you have
        just been handed is wrong in every specific way we have so far been able to name. We think
        that is the cheaper of the two prices.
      </p>
      <p className="known-breaks-key">
        Each entry says where the failure lives &mdash; <strong>structural</strong> (the frame
        itself is wrong here, and better writing will not fix it), <strong>material</strong> (the
        content and presentation decide how badly it bites), or <strong>edge</strong> (it bites at a
        boundary this site has not reached yet) &mdash; and what was done about it:{" "}
        <strong>open</strong>, <strong>mitigated</strong>, or <strong>accepted</strong>. Pages that
        lean on a break link it by number rather than improvising an apology of their own, and each
        entry lists the pages that lean on it.
      </p>
      <div className="known-breaks">
        {DISANALOGIES.map((b) => (
          <section key={b.id} id={`break-${b.n}`} className="known-break" data-break={b.n}>
            <h3 id={b.id}>
              <span className="known-break-n" aria-hidden="true">
                {b.n}
              </span>
              {b.title}
            </h3>
            <p className="known-break-meta">
              <span className="known-break-severity" data-severity={b.severity}>
                {SEVERITY_LABEL[b.severity]}
              </span>{" "}
              ·{" "}
              <span className="known-break-status" data-status-break={b.status}>
                {STATUS_WORD[b.status]}
              </span>
            </p>
            <p>{b.detail}</p>
            {b.candidateFix && (
              <p className="known-break-fix">
                <strong>What would reduce it:</strong> {b.candidateFix}
              </p>
            )}
            <p className="known-break-inherited">
              <span className="known-break-inherited-label">Inherited by:</span>{" "}
              {b.inheritedBy.map((p, i) => (
                <span key={p}>
                  {i > 0 ? " · " : ""}
                  <Link href={p}>{ROUTE_BY_PATH[p]?.title ?? p}</Link>
                </span>
              ))}
            </p>
          </section>
        ))}
      </div>

      {/* N-344 (§3.11) — two geographic rules written before geography grows. A
          rule adopted after the first continent is a rule argued against a page
          somebody has already written. */}
      <h2 id="geography">Two rules for a map that has not grown yet</h2>
      <p>
        This site currently describes one country in one era, and it will not always. Two rules are
        adopted now, while there is nothing to defend. <strong>Continents are containers, not
        cultures.</strong> A region is a box that holds enormous internal variety, and an expansion
        that gives a continent one Default Human has stopped describing anywhere real; the same rule
        that keeps &ldquo;default&rdquo; from meaning &ldquo;normal&rdquo; has to survive the jump
        to geography, or it was never a rule.{" "}
        <strong>Era boundaries are local, never universal.</strong> A period break is a claim about
        a particular place: industrialisation, majority, retirement and adulthood itself begin and
        end at different moments in different societies, and a single global timeline of ages is a
        projection error wearing a date. Moving between regions is a life path that many people
        take, not an edge case &mdash; whatever gets built has to carry the person who left as well
        as the person who stayed. These are a paragraph today and a build check the day a second
        region or a second era arrives, not before.
      </p>

      {/* N-301 (§3.11, C-49) — the class, said out loud. The component and the
          route flag are the mechanism; this is the reason. */}
      <h2 id="planned-obsolescence">Some pages here are supposed to expire</h2>
      <p>
        A few pages are about things that move: what a labour market currently rewards, which
        strategies are crowded, what the evidence behind a ranking currently is. Those pages carry a
        review date at the top, declared in the route inventory rather than remembered by whoever
        writes them next. The date is not an apology and it does not mean the page is unreliable
        now. It means the page is the kind of thing that goes out of date by design, and that a
        version of it still claiming to be current in several years would be malfunctioning rather
        than enduring. Most pages here are not like that, and the absence of a stamp is itself a
        claim we are making.
      </p>

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

      {/* N-290 (§3.11, C-46) — published EMPTY, with its format fixed, because a
          retraction mechanism written after the first error is a decision made
          under pressure by people who would rather not be making it. */}
      <h2 id="retractions">Retractions and downgrades</h2>
      <p>
        A retraction is the serious end of the register above: not a detail corrected, but something
        this site said that it now believes it should not have said. The format is fixed here,
        before there is anything in it, and it will not be negotiated with the first entry:{" "}
        <strong>what was said, kept and struck through rather than deleted</strong>, what replaced it
        (or the fact that nothing did), the page it was on, the date, and the reason. The original
        text stays visible, because a retraction that removes the sentence also removes the evidence
        that we were ever wrong in that particular way.
      </p>
      <p>
        A retraction mechanism invented after the first error is not a mechanism. It is a decision
        made under pressure by people who would rather not be making it, at the exact moment they
        have the strongest possible reason to make it small. Publishing the format now is the only
        version of it that is worth anything.
      </p>
      {RETRACTIONS.length === 0 ? (
        <p className="retractions-empty" data-retractions-empty>
          <strong>Nothing has been retracted.</strong> This section renders whether or not there is
          anything in it, and it was written while it was empty. If it is still empty in a year,
          that is either a good sign or a bad one, and the register above is where you would look to
          tell which.
        </p>
      ) : (
        <ul className="retractions-register">
          {RETRACTIONS.map((r) => (
            <li key={r.id} className="retraction-entry" data-retraction={r.id}>
              <div className="correction-head">
                <span className="correction-kind" data-kind="retraction">
                  Retraction
                </span>
                <span className="correction-date">{r.date}</span>
              </div>
              <p className="retraction-original">
                <span className="retraction-label">What this page said:</span>{" "}
                <del data-retraction-original>{r.original}</del>
              </p>
              <p className="retraction-replacement">
                <span className="retraction-label">What it says now:</span>{" "}
                {r.replacement || "Nothing. The claim was withdrawn and not replaced."}
              </p>
              <p className="retraction-reason">{r.reason}</p>
              <p className="retraction-page">
                <Link href={r.page}>{ROUTE_BY_PATH[r.page]?.title ?? r.page}</Link>
              </p>
            </li>
          ))}
        </ul>
      )}

      {/* N-282 — the register's tenth entry is about this register. Cited here
          rather than restated, which is the whole point of the mechanism. */}
      <ModelBreak n={10}>
        Everything in the two registers above was written by the same people who wrote the pages
        they are about.
      </ModelBreak>

      {/* N-296 (§3.11, C-48) — the scope boundary, published so a reader can hold
          the site to it. */}
      <h2 id="admission-test">What is allowed on this site</h2>
      <p>
        There is one test a page has to pass to exist here:{" "}
        <strong>
          it is admitted only if it changes a decision or an orientation for you as the player of
          your own life
        </strong>
        . Not if the subject is important. Not if the material is interesting, or true, or missing
        from the internet. If a page cannot say what you would do differently, or see differently,
        for having read it, then whatever else it is, it is not this.
      </p>
      <p>
        The test is here rather than in a style guide because it is the one sentence that stops
        &ldquo;explaining life&rdquo; from becoming an encyclopedia, and because publishing it lets
        you hold us to our own scope. Every route in the inventory records the answer in one line,
        and the build refuses a page that leaves it blank. If you find a page here that does not
        change anything for you, that is a reportable fault and not your failure to appreciate it.
      </p>

      <h2>What&rsquo;s coming</h2>
      <p>
        This is the only place on the site where unbuilt scope is named — everywhere else, a page either
        exists at useful depth or is not shown. The &ldquo;planned&rdquo; cards you meet on the
        index pages are generated from this list, so there is still exactly one place to keep true.
      </p>
      <p>
        {/* N-437 — the order is the owner's, from the project brief's research
            priority list. Paraphrased; the sequence and the reasons are his. */}
        The order is not ours. It follows the project&rsquo;s own research priority list, which
        starts with adolescence &mdash; the join between a childhood nobody chose and the first
        decisions anyone makes for themselves &mdash; and works outward from there. Each entry says
        why it sits where it does.
      </p>
      <ul className="whats-coming">
        {WHATS_COMING.map((w) => (
          <li key={w.id} data-coming={w.id}>
            {w.text}
          </li>
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
