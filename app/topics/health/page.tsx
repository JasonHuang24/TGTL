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

export const metadata: Metadata = {
  title: "Health maintenance",
  description:
    "Health as the capacity that gates everything else, the maintenance-versus-recovery asymmetry, sleep debt, and when to see a clinician.",
};

/**
 * Topic — Health maintenance (§6.7, ~1,000 words). Donors: Opus 4.6 health +
 * energy, Claude-family body rules, Fable 5 health lens. No diagnosis, no doses,
 * no supplement claims (G-10). No invented ratios or lifestyle numbers as fact.
 * The structural guard is kept.
 */
export default function HealthPage() {
  return (
    <ReadingPage>
      <PageHeader
        eyebrow="Topic · health"
        title="Health maintenance"
        intro="Health is the capacity that quietly gates every other resource. When it is high you do not notice it. When it drops, it overrides everything — and no amount of money, time, skill, or good company compensates for a body that has stopped cooperating. This page is about the accounting, not the medicine: it explains, it does not treat."
      />

      <h2>Why prevention feels worthless</h2>
      <p>
        Maintaining health is cheap; recovering it is expensive, often by a wide margin. The trouble is
        that the payoff from maintenance is a non-event — nothing bad happens — while its cost is
        visible and immediate. Recovery is the reverse: dramatic payoff, enormous cost. So people
        reliably under-invest in the cheap version and over-pay for the expensive one. This is simply
        compounding running in its negative direction, and deferred maintenance is the fastest-
        compounding negative there is.
      </p>
      <p>
        It also helps to hold two different things apart. Health is a current state — how you function
        today — and a trajectory — the direction over years. They can diverge: a young body can feel
        fine while spending down a buffer. And under the single word are several systems that move on
        different clocks and do not substitute for one another. The single-number picture is a
        convenience; the accounting underneath — what drains, what restores, what the ceiling does — is
        what is worth carrying.
      </p>

      <Callout tone="neutral" title="A level under a ceiling">
        <p>
          Think of health as a level that regenerates, sitting under a ceiling that slowly does not. A
          bad month is a level event and mostly reverses. A bad decade is a ceiling event and largely
          does not. Behaviour moves the level day to day; accumulated pattern, and age, move the ceiling.
          Nothing buys a ceiling back, which is the real argument for not spending it carelessly while
          it is high.
        </p>
      </Callout>

      <h2>Energy is the daily readout</h2>
      <p>
        Energy is renewable, unlike time, but it cannot be stored, unlike money — and it is the factor
        that makes each hour productive or wasted. It comes in a few pools that regenerate at different
        rates: the physical, restored mostly by rest; the cognitive, which depletes faster and
        regenerates slower, so that decisions late in a depleted day are reliably worse; and the
        emotional, the least visible and often the most expensive, which can be drained flat by a task
        that was physically trivial.
      </p>
      <p>
        The distinction that matters is acute versus chronic. A hard day or week is acute depletion, and
        the system is built to recover from it with rest. Spending more than the daily budget day after
        day is chronic depletion, and it compounds — worse sleep shrinks the next day&rsquo;s budget,
        which enlarges the deficit. The cruel part is that chronic depletion degrades the very instrument
        that would tell you about it: you feel fine because feeling terrible has become the baseline.
      </p>

      <h2>Two engines worth naming</h2>
      <p>
        <strong>Sleep debt</strong> has three unkind properties: it accrues but does not bank ahead, it
        is repayable only over several nights and not on demand, and it does not convert — no amount of
        money buys back a night. Worse, the internal gauge fails: the felt sense of sleepiness levels off
        while measured impairment keeps climbing, so &ldquo;I&rsquo;m fine&rdquo; is not evidence. The
        honest substitutes are external — what you actually produced, what someone else observes, how
        many nights it has been.
      </p>
      <p>
        <strong>The training response</strong> is a single loop that governs muscle, bone, heart, and —
        with consolidation standing in for physical recovery — skill: load plus recovery equals
        adaptation; load without recovery equals damage. There is no third option in which load alone
        produces growth. A person under a load they cannot recover from is not being strengthened, and
        the version of &ldquo;what doesn&rsquo;t kill you&rdquo; that says otherwise is one of the more
        casually cruel ideas in circulation. The same logic runs the stress response: an emergency system
        that works beautifully for short, resolvable emergencies and badly as a default state, because
        its costs are all deferrals — of maintenance, repair, recovery — that are free over minutes and
        expensive over years.
      </p>

      <h2>When to stop reading a website</h2>
      <p>
        Many of the states that matter most — blood pressure, early metabolic trouble, several cancers —
        are silent until late, which means the correct move is an external measurement rather than a felt
        one. Persistent inability to sleep despite the chance to, a change in sleep, appetite, or
        cognition that lasts weeks, or anything that frightens you, belongs with a clinician, not a page.
        This site does not diagnose, does not recommend doses or supplements, and is not a substitute for
        one.
      </p>

      <MentorNote provenance="editorial-synthesis">
        <p>
          Most sleep deficit and chronic stress are produced by circumstances — work schedules, care,
          money, unsafe housing — far more than by choices, and telling such a person to &ldquo;just
          relax&rdquo; is advice addressed to the wrong variable. And a great many health outcomes —
          genetic conditions, autoimmune disease, cancer — were never in anyone&rsquo;s control at all.
          A capacity model is useful for planning; it is not a licence to read a health outcome as a
          verdict on the person.
        </p>
      </MentorNote>

      <NextSteps>
        <NextStep href="/topics/money">Money and slack — the same compounding, on a different resource.</NextStep>
        <NextStep href="/situations/depression">If the drop is in mood rather than the body.</NextStep>
        <NextStep href="/character/logs">The upkeep you are currently not doing — worth knowing, even undone.</NextStep>
      </NextSteps>

      {/* N-235. A link at the end of the page, never above the fold and never
          a nudge. Never on a set-down route (C-24). */}
      <TryInPlay href="/play/campaign">the campaign prices capacity the way this page describes it, and lets you spend it.</TryInPlay>

      <EvidenceDrawer
        record={{
          status: "editorial",
          scope: "General mechanisms; not medical advice, diagnosis, or treatment.",
          lastReviewed: "2026-08-26",
          whatWouldChange:
            "Nothing here is a dose, a supplement claim, or a diagnosis. Specific thresholds (how many hours, how much load) vary by person and are deliberately left unquantified; a clinician has your numbers and this page does not.",
          whereThisFrameFails:
            "A 'capacity that gates everything' model risks implying that health is manageable by effort, which is untrue for many conditions and unfair to the people living with them.",
        }}
      />
    </ReadingPage>
  );
}
