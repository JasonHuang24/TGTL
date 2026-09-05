import type { Metadata } from "next";
import Link from "next/link";
import {
  ReadingPage,
  PageHeader,
  Lede,
  Callout,
  MentorNote,
  PathwayStep,
  EvidenceDrawer,
  NextSteps,
  NextStep,
  TryInPlay,
} from "@/components/primitives";
import { ROUTE_BY_PATH } from "@/content/routes";

export const metadata: Metadata = {
  title: "Burning out",
  description:
    "A four-step sequence: confirm what this is, stop the bleeding, find the root cause, and make the structural change — because rest alone returns you to the conditions that produced it.",
};

/**
 * N-025 (6.0 §3.1, §3.3) — BURNOUT AS A FOUR-STEP SEQUENCE.
 *
 * Burnout is one of the commonest reasons an adult goes looking for a page like
 * this, and the trunk had no page: the word appeared only as a pressure label on
 * the board and a line in the roadmap fixture. The four steps are a real
 * sequence rather than a list of tips — each one is only answerable once the one
 * before it is, and the last is the one everybody skips.
 *
 * THE CONSTRUCT, AND ITS SOURCE (T-1, §4). The three-part description —
 * exhaustion, mental distance, reduced efficacy — is attributed here because a
 * page was fetched for it during this build: the World Health Organization's
 * ICD-11 announcement, quoted at twenty-five words or fewer and recorded in
 * `records/research-pipeline.md` under "Consolidation batch 4". Without that
 * fetch the same three words would have shipped as the site's own description
 * with nobody's name on them. C-29 asserts the rule over every situation page:
 * no construct attribution without a `researched` evidence record on the page.
 *
 * NO DIGIT APPEARS HERE. The recovery curve is long, the onset is slow, and
 * neither is given a number, because no number was read on a fetched page.
 */
export default function BurnoutPage() {
  return (
    <ReadingPage>
      <PageHeader
        eyebrow="Situation · a decision sequence"
        title="Burning out"
        intro="Burnout is not tiredness. Tiredness resolves with rest, and this does not: the holiday works, and then evaporates within days of going back, which is the most useful test there is. What that tells you is that the problem is not in how much you have rested. It is in what you are resting from."
        systems={ROUTE_BY_PATH["/situations/burnout"]?.systems}
      />

      <Lede>
        Four steps, in order, because each one only becomes answerable once the one before it is. The
        fourth is the one almost everybody skips, and it is the one that ends it.
      </Lede>

      <PathwayStep n={1} title="Confirm what this is" primary="health">
        <p>
          The World Health Organization describes burn-out — in its classification of diseases, and
          explicitly as an occupational phenomenon rather than a medical condition — as a syndrome
          resulting from chronic workplace stress that has not been successfully managed, showing in
          three ways: energy depletion or exhaustion, increased mental distance from the work or
          cynicism about it, and reduced professional efficacy. Sustained caring for someone produces
          the same shape as reliably as paid work does, which the occupational framing does not cover
          and which is worth saying here.
        </p>
        <p>
          The practical use of the three is that they separate two different situations. If only the
          exhaustion is there, you may simply be overworked, and rest may genuinely be enough — that is
          good news and worth establishing before anything larger is decided. If the distance and the
          sense of getting worse at something you used to be good at have arrived too, rest is
          necessary and is not sufficient, and a fortnight off from an unchanged situation will restore
          very little.
        </p>
        <p>
          The awkward part is that the thing doing the assessing is the thing that is affected. Burnout
          does not arrive announcing itself as a condition; it arrives as a discovery about you — that
          you have become lazy, that you were never as capable as people thought, that everyone else
          manages this. So use the behavioural test rather than the introspective one.{" "}
          <em>Does rest turn back into capacity?</em> is checkable. <em>Am I just lazy?</em> is not, and
          the instrument answering it is the broken one.
        </p>
      </PathwayStep>

      <PathwayStep n={2} title="Stop the bleeding" primary="time">
        <p>
          Before anything is fixed, the current state has to become survivable. This is not treatment;
          it is buying the room in which a decision can be made at all.
        </p>
        <ul>
          <li>
            <strong>Drop what can be dropped, out loud.</strong> Optional commitments, aspirational
            projects, the social obligations you are attending as a performance of being fine. Your
            capacity really is reduced. The aim for the next few weeks is sustainability, not output,
            and pretending otherwise is what turns a bad stretch into a longer one.
          </li>
          <li>
            <strong>Protect sleep above everything that is not an emergency.</strong> Burnout degrades
            sleep and poor sleep deepens burnout; that loop has to be broken from the side you can
            actually reach.
          </li>
          <li>
            <strong>Tell one person, in detail.</strong> Not to have it solved — to stop being the only
            one who knows. Isolation is part of the mechanism here, and the condition reliably tells you
            that saying it out loud would be a weakness.
          </li>
          <li>
            <strong>Postpone the large decisions for a few weeks</strong> if they will keep. Resigning
            in the state that makes resigning feel urgent is a large trade at your worst prices. If
            something genuinely cannot wait, get somebody else&rsquo;s read on it before you act.
          </li>
        </ul>
        <p>
          <strong>The route back from this step:</strong> nothing here is permanent. Everything dropped
          in this fortnight can be picked up again, and most of it will not have been missed by anyone
          but you.
        </p>
      </PathwayStep>

      <PathwayStep n={3} title="Find the root cause" primary="work">
        <p>
          Burnout is a symptom, and the useful question is what of. Four causes account for most of it,
          and they call for different moves, which is the whole reason to tell them apart:
        </p>
        <ul>
          <li>
            <strong>Chronic overload</strong> — more being asked than the budget can carry, for too
            long. The fix is arithmetic: fewer demands, more resource, or both.
          </li>
          <li>
            <strong>Low control</strong> — responsibility without the authority to act on it, held
            accountable for outcomes you cannot move. This is the commonest organisational cause, and it
            is the one that no amount of personal management touches.
          </li>
          <li>
            <strong>Misalignment</strong> — the work does not connect to anything you value, so your
            best hours go somewhere you would not have sent them. Working harder at it makes it worse
            rather than better.
          </li>
          <li>
            <strong>No real recovery</strong> — not overloaded, but never actually off. Time away that
            is spent braced for the next thing is not recovery, and the difference is visible in whether
            you come back with anything.
          </li>
        </ul>
        <p>
          Invisible effort is a quiet accelerant under all four. Work nobody can see is still spent, and
          being exhausted by something that does not show up anywhere is a specific and corrosive
          version of this — <Link href="/topics/work#unwritten-local-rules">the workplace guide</Link>{" "}
          has the mechanism.
        </p>
      </PathwayStep>

      <PathwayStep n={4} title="Make the structural change" primary="money">
        <p>
          This is the hard step, because the change is nearly always the one you have been avoiding:
          renegotiating the load, having the conversation, setting a limit you have been afraid to set,
          handing something back, changing direction, or leaving. It is also the only step that ends
          this, because burnout does not respond to optimisation inside the arrangement that produced
          it.
        </p>
        <p>
          <strong>What it costs, plainly.</strong> Leaving before there is somewhere to go spends
          runway. A hard limit at work spends standing. Handing something back disappoints somebody who
          was relying on you. These are real, and the honest comparison is not against a costless
          alternative: it is against continuing, which ends in the same change made later on worse terms
          — through illness, or a relationship, or a collapse in the work itself. The question is not
          whether the change happens. It is whether you choose the timing.
        </p>
        <p>
          <strong>The routes back.</strong> The runway is the thing to protect first — see{" "}
          <Link href="/topics/money">money and slack</Link> for what a buffer buys you here, which is
          mostly the ability to leave at a time of your choosing. Where the load cannot be changed at
          all, because it is a child, or a parent, or the job that carries the insurance, the honest
          content of this page is the naming rather than the exit; what is left is protecting recovery
          inside the load, and refusing to also carry the belief that this is a failure of character.
        </p>

        {/* N-280 — the callout the row names. Cited to the known break rather than
            asserted, because the reason self-care cannot fix an environment is
            exactly the reason this frame carries a warning label. */}
        <Callout tone="caution" title="What self-care can and cannot do">
          <p>
            If the environment is what is producing this, then no amount of meditation, exercise or
            journalling fixes the environment. Those practices help you survive inside it, and they are
            worth doing for that. Surviving inside it is not recovery, and the two get confused because
            the first is available to you alone and the second usually is not.
          </p>
          <p>
            That confusion is a named limit of the way this whole site sees things — it takes one person
            as its subject, and will quietly refile a shared, structural problem as a private one if you
            let it.{" "}
            <Link href="/methodology#known-breaks">
              The frame has no collective subject, and that is on the record.
            </Link>{" "}
            Where the cause is workload set above your pay grade, a staffing level, or a sector that
            runs on people&rsquo;s willingness to absorb it, the move that would actually work is
            collective, and this page can describe that and cannot do it.
          </p>
        </Callout>
      </PathwayStep>

      <MentorNote provenance="experiential-pattern">
        <p>
          The recovery is slower than anybody expects, and the usual mistake is going back at the first
          sign of improvement, into an unchanged situation, and landing straight back here. The clock
          does not start when you rest. It starts when the load actually changes.
        </p>
      </MentorNote>

      <h2 id="when-this-is-not-what-it-is">When this is not what it is</h2>
      <p>
        This and low mood overlap enough that they are not reliably told apart from the inside. If
        reduced load and real rest produce nothing over months, or if the flatness is there on the days
        away as much as the days at work, that is a reason to involve a doctor rather than to try
        harder. <Link href="/situations/depression">There is a page for that</Link>, and it is a
        different page on purpose.
      </p>

      <NextSteps>
        <NextStep
          href="/topics/health"
          relation="explains"
          why="Why rest stops converting into capacity, and what acute depletion and chronic depletion do differently."
        >
          Health maintenance — the mechanism under step one.
        </NextStep>
        <NextStep
          href="/topics/work"
          relation="explains"
          why="Low control, invisible work and the rules a workplace actually runs on — where step three's causes come from."
        >
          Education and career — the conditions that generate this.
        </NextStep>
        <NextStep
          href="/topics/money"
          relation="requires"
          why="Step four usually needs a runway before it can be taken at a time of your choosing."
        >
          Money and slack — what the structural change will need.
        </NextStep>
        <NextStep
          href="/character/board"
          relation="unlocks"
          why="Works out which of the four causes is actually binding, which is rarely the loudest one."
        >
          Lay out which pressure is actually holding this in place.
        </NextStep>
        <NextStep
          href="/situations/getting-through-today"
          relation="protects"
          why="If there is nothing left tonight, none of the four steps is today's problem."
        >
          If today is the whole horizon.
        </NextStep>
      </NextSteps>

      {/* N-235. A link at the end of the page, never above the fold and never
          a nudge. Never on a set-down route (C-24). */}
      <TryInPlay href="/play/campaign">
        the campaign prices upkeep and recovery against a budget that does not stretch, which is the
        arithmetic step two is arguing with.
      </TryInPlay>

      <EvidenceDrawer
        record={{
          status: "researched",
          scope:
            "The three-part description is the World Health Organization's, quoted from its ICD-11 announcement (fetched 2026-09-05; recorded in records/research-pipeline.md). Everything else on this page is the site's own synthesis.",
          lastReviewed: "2026-09-05",
          whatWouldChange:
            "The construct is a description of a syndrome, not a diagnosis, and the WHO's own page says burn-out is classified as an occupational phenomenon rather than a medical condition — so nothing here identifies anything about you. The four root causes are a working carve, not a measured taxonomy, and no rate, duration or proportion is stated anywhere on this page because none was read on a fetched source. A study of which cause predominates, or of how long recovery takes, would change how step three is ordered.",
          whereThisFrameFails:
            "Treating this as a sequence one person walks assumes the load is theirs to change. For a great many people it is not — the caring duty, the single job that carries the insurance, the sector that runs on absorbed overwork — and for them the fourth step is a description of something out of reach rather than a move.",
        }}
      />
    </ReadingPage>
  );
}
