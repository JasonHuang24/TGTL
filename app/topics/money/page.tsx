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
import { SingleHomeNote } from "@/components/SingleHomeNote";
import { PositionNote } from "@/components/PositionNote";
import { ROUTE_BY_PATH } from "@/content/routes";

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
        systems={ROUTE_BY_PATH["/topics/money"]?.systems}
      />

      <MechanicAnchor ids={["slack", "compounding"]} />

      <h2 id="compounding">One curve, two directions</h2>
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

      <h2 id="slack">Slack: the buffer that stops a cascade</h2>
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

      <h2 id="exchange-rates">Exchange rates, and why they belong to your position</h2>
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

      {/* N-095 — opportunity cost belongs in the exchange-rates section because
          it IS an exchange rate: what the option you did not take was worth. The
          half that matters here is the shut-off valve on the back end. */}
      <h3 id="opportunity-cost">Opportunity cost is a decision tool, not a regret tool</h3>
      <p>
        The most important exchange rate in any of this is the one with no receipt: what you gave up by
        choosing what you chose. Every commitment is also a decision not to make the other ones, and that
        forgone version is a real cost that no budget shows. It is worth thinking about hard, once, and
        hardest in front of a door that only opens one way — which is precisely where people think about
        it least, because the decision already feels made.
      </p>
      <p>
        And then it is worth stopping. Once the information window has closed — once the alternative is
        no longer available to you — comparing your life to the version you did not take is not analysis,
        because the comparison has nothing on its other side. The imagined alternative contains no bad
        Tuesdays, no illness and no bad luck, so it wins every time, and it would have won against any
        life you actually lived. Running that comparison at three in the morning is rumination wearing
        the clothes of rigour. The useful test is whether the thinking could still change something: if
        it could, it is a decision, and if it cannot, it is not analysis and putting it down costs
        nothing.
      </p>

      <MentorNote provenance="cultural-wisdom">
        <p>
          Some things do not convert from any currency at any price. Sleep cannot be bought back after
          the night is gone. Attention cannot be borrowed against. And time with a specific person at a
          specific stage — a child at seven, a parent before the decline — is the conversion that fails
          most completely, and the one the regret shows up around most reliably.
        </p>
      </MentorNote>

      {/* N-150 (C-42) — the position note. Exchange rates are the mechanism this
          row exists for: the same emergency costs a different multiple from a
          different position, and this is the page that says so. */}
      <PositionNote
        notes={{
          yes: "With a floor beneath a serious failure, your conversion table is the favourable one, and the effect is easy to miss from inside it: a shock gets paid out of savings or family rather than out of a credit card or a payday lender, so the same emergency costs you a fraction of what it costs someone without that. That advantage is real, it is not a reward, and knowing it is there is what stops it being read as evidence of better discipline.",
          no: "Without a floor beneath a serious failure, you are paying the worse rate on every conversion — the same emergency, bought at credit-card or payday prices, and the same shortage of time bought back at a rate your hours cannot meet. That is arithmetic done to you, not by you. The moves that do not need a buffer are the ones worth reading first: asking, negotiating, and claiming what you are entitled to claim.",
          unsure: "Whether there is a floor beneath a serious failure decides which exchange rates you are actually paying, more than any decision described on this page does. It is worth settling before applying any of this to yourself, because the same table is a modest inconvenience from one position and a compounding penalty from another.",
        }}
      />

      <h2 id="no-slack">If you have no slack right now</h2>
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
        <NextStep href="/topics/health" relation="see-also" why="Where the same compounding runs on a body, with a ceiling that does not come back.">Health maintenance — where the same compounding runs on a body.</NextStep>
        <NextStep href="/situations/job-loss" relation="see-also" why="The runway arithmetic in a real shock, running on somebody else&rsquo;s clock.">Losing a job — the runway arithmetic in a real shock.</NextStep>
        <NextStep href="/character/board" relation="unlocks" why="Turns &ldquo;do I have any slack&rdquo; from a feeling into a row you can read.">Lay out where your slack actually is right now.</NextStep>
      </NextSteps>

      {/* N-235. A link at the end of the page, never above the fold and never
          a nudge. Never on a set-down route (C-24). */}
      <TryInPlay href="/play/campaign">the campaign puts a real budget behind the same tradeoff, season by season.</TryInPlay>

      <SingleHomeNote />

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
