import type { Metadata } from "next";
import {
  ReadingPage,
  PageHeader,
  Callout,
  MentorNote,
  EvidenceDrawer,
  NextSteps,
  NextStep,
  TryInPlay,
} from "@/components/primitives";
import { Term } from "@/components/Term";
import { MechanicAnchor } from "@/components/reference/MechanicAnchor";

export const metadata: Metadata = {
  title: "Money and slack",
  description:
    "Compounding in both directions, exchange rates and their asymmetry, and slack as the buffer that stops a shock becoming a cascade.",
};

/**
 * Topic — Money and slack (§6.7, ~1,000 words). Donors: Fable 5 compounding,
 * Opus 5 resources-slack, Claude-family exchange-rates. Position sensitivity
 * inline. No invented statistics; the fairness guard is kept.
 */
export default function MoneyPage() {
  return (
    <ReadingPage>
      <PageHeader
        eyebrow="Topic · money"
        title="Money and slack"
        intro="Two ideas do most of the work here, and neither is about being clever with money. One is a curve. The other is a buffer. Between them they explain a surprising amount of why two people making the same choices end up in different places."
      />

      <MechanicAnchor ids={["slack", "compounding"]} />

      <h2>One curve, two directions</h2>
      <p>
        Compounding is what happens when a process feeds its own gains back into its base: it grows by
        multiplication rather than addition, so it stays nearly flat for a long time and then bends
        upward. Money does this. So do skill, trust, and fitness. The part people forget is that the
        curve takes the sign of whatever you point it at. Debt, a neglected tooth, an unspoken
        resentment, deferred maintenance of any kind — they run the same math in reverse, and often
        faster, because the interest rate on the bad version is frequently higher than on the good one.
      </p>
      <p>
        Two consequences follow. First, no one can feel an exponential; our intuition draws these curves
        nearly straight and underestimates them, and the error grows the further out you look. So any
        decision that compounds — a debt, a savings rate, a training habit — is worth checking with an
        actual number rather than a gut sense. Second, for most people most of the time the available
        lever is not cleverness but <em>starting</em>: time in the position beats being clever about the
        position, because duration is the exponent and it dominates over any long horizon.
      </p>
      <p>
        And it is worth knowing where the curve stops. Sleep does not compound — you cannot bank it in
        advance. Physical capacity saturates. Relationships compound only while they are maintained and
        otherwise quietly decay. Every real compounding process eventually meets a ceiling. So the
        counsel is not &ldquo;be patient about everything&rdquo;; it is: be patient about the things that
        compound in your favour, and urgent about the few running against you.
      </p>

      <h2>Slack: the buffer that stops a cascade</h2>
      <p>
        <Term k="slack" define /> is the uncommitted remainder of a resource — the amount by which you
        could absorb an unexpected demand without something else breaking. It is not a single thing; it
        is at least four separate buffers — money, time, attention, and physical capacity — and having
        one does not protect the others. A person with savings and no sleep is unbuffered in the way
        that matters.
      </p>
      <p>
        Slack behaves like a threshold, not a smooth quantity. When you have a comfortable margin, a
        little more is a mild convenience. Near zero, everything changes: each shock now has to be paid
        for by cancelling a commitment, and cancelling a commitment creates a second shock. What was one
        problem becomes a cascade. This is not a psychological failing or bad planning; it is arithmetic
        about a buffer that is not there. It is also why an emergency fund is best understood as
        interruption insurance — breaking a compounding process costs you the whole tail of the curve,
        where the value lives, so a buffer protects every other curve you are running.
      </p>
      <p>
        Two things make slack easy to lose. It depletes invisibly — nothing announces the moment you go
        from two hours of margin to none. And it is the resource competent people spend first, because
        it looks like waste; eliminating it feels efficient, the reward is immediate, and the cost is
        deferred and later reads as bad luck.
      </p>

      <h2>Exchange rates, and why they belong to your position</h2>
      <p>
        Resources convert into one another, but never at equal rates. Money buys time reliably, by
        purchasing other people&rsquo;s hours — a cleaner, a direct flight, a faster process. Time buys
        money back badly and with a floor: below a certain rate your hours cannot be sold at all. The
        asymmetry is the point.
      </p>
      <p>
        The rates are properties of your position, not of the money itself. The same emergency costs a
        different multiple depending on whether it is paid from savings, a credit card, or a payday
        lender — the last being the case where a person literally pays more for the identical thing. Two
        people can make the same decision with the same discipline and get different results because
        their conversion tables differ, and neither of them chose the table. That is the mechanism of a
        large share of inequality, stated as accounting rather than as grievance — and, compounded over
        decades, it is why the distance between two starting positions tends to widen.
      </p>

      <MentorNote provenance="cultural-wisdom">
        <p>
          Some things do not convert from any currency at any price. Sleep cannot be bought back after
          the night is gone. Attention cannot be borrowed against. And time with a specific person at a
          specific stage — a child at seven, a parent before the decline — is the conversion that fails
          most completely, and the one the regret shows up around most reliably.
        </p>
      </MentorNote>

      <h2>If you have no slack right now</h2>
      <p>
        Then &ldquo;protect your buffer&rdquo; is not advice; it is a restatement of the problem. The
        absence of slack is usually structural — wages, rents, care, illness, and the way small
        penalties compound at the bottom — not a failure of foresight, and this frame must never be used
        to conclude otherwise. The rate is upstream of the choice. What is sometimes available even
        without a buffer: finding the single commitment that, if removed, returns the most margin (often
        not the largest one, but the one with the most unpredictable demands), and the moves that do not
        require a buffer at all — asking, negotiating, and claiming entitlements you are allowed to
        claim.
      </p>

      <Callout tone="quiet">
        <p>
          The mirror image is also true: it is a comfort mostly available to the well-off to say that
          money &ldquo;can&rsquo;t buy&rdquo; what it demonstrably buys. Both errors — blaming people for
          arithmetic, and pretending the arithmetic isn&rsquo;t there — are worth avoiding.
        </p>
      </Callout>

      <NextSteps>
        <NextStep href="/topics/health">Health maintenance — where the same compounding runs on a body.</NextStep>
        <NextStep href="/situations/job-loss">Losing a job — the runway arithmetic in a real shock.</NextStep>
        <NextStep href="/character/board">Lay out where your slack actually is right now.</NextStep>
      </NextSteps>

      {/* N-235. A link at the end of the page, never above the fold and never
          a nudge. Never on a set-down route (C-24). */}
      <TryInPlay href="/play/campaign">the campaign puts a real budget behind the same tradeoff, season by season.</TryInPlay>

      <EvidenceDrawer
        record={{
          status: "editorial",
          scope: "General mechanisms, not personal financial advice.",
          lastReviewed: "2026-08-26",
          whatWouldChange:
            "These are accounting-level descriptions, not researched magnitudes. Specific interest rates, doubling times, or the size of any effect would each require their own source; none is asserted here.",
          whereThisFrameFails:
            "Describing inequality as an exchange-rate table can make a structural, collective problem sound like an individual optimisation puzzle, which it is not.",
        }}
      />
    </ReadingPage>
  );
}
