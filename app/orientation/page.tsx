import type { Metadata } from "next";
import Link from "next/link";
import { ReadingPage, PageHeader, EvidenceDrawer } from "@/components/primitives";

export const metadata: Metadata = {
  title: "The Human Package",
  description:
    "What every life begins inside: arriving dependent, a hand dealt before you sat down, other people everywhere, rules that change with the place and the year, a finite length, and no definition of winning supplied.",
};

/**
 * N-001 (6.0 §2.3.1, §3.2) — THE HUMAN PACKAGE, restored as a reading route.
 *
 * 3.0 designated /orientation a sanctioned redirect stub and moved this material
 * into the in-run briefing, where it survives as eight one-sentence pairs in
 * `content/play/framing.ts`. That put the site's opening argument behind the one
 * door a reader in a bad week will not open. This page is the reading edition of
 * the same argument: seven headed sections, warm second person, edition-neutral.
 *
 * IT IS A SERVER COMPONENT WITH NOTHING CLIENT-ONLY IN IT (C-26). Every word,
 * every heading and every link is in the exported HTML, so the page is complete
 * with JavaScript off — which is the floor the whole reading layer stands on and
 * is worth most on the page a first-time visitor lands on.
 *
 * It carries no game vocabulary in either edition. Not because the frame is
 * embarrassing, but because this is the page that decides whether a reader trusts
 * the site at all, and the frame is a thing to be offered rather than assumed.
 * Donors, adapted and not copied: `BRIEFING_POINTS` (eight points into seven
 * sections), the Claude 2.0 orientation page, and Sol's six-card synopsis.
 */

/** N-008 — the ordered reading path. Nine stops, each with the reason it is there. */
const READING_PATH: { href: string; label: string; why: string }[] = [
  {
    href: "/walkthrough#basics",
    label: "The walkthrough, basics only",
    why: "It teaches the handful of words the rest of the site uses, in about five minutes. Skipping it makes every later page slightly more expensive.",
  },
  {
    href: "/map",
    label: "The world map",
    why: "Find yourself by the question you are actually holding, not by your age. It is also the page that shows several parts of a life running at once, at different speeds.",
  },
  {
    href: "/topics/money",
    label: "One guide — start with money and slack",
    why: "Whichever guide is nearest to your week is the right one, but this is the one most other pages lean on: slack is what stops a single bad thing becoming three.",
  },
  {
    href: "/situations/job-loss",
    label: "One situation page, read cold",
    why: "Read the longest one before it is yours. Knowing the shape of these pages in advance is most of what makes them usable on the day you need one.",
  },
  {
    href: "/map/credential-decision",
    label: "The credential decision",
    why: "A real decision taken apart in public, with a control that re-resolves the costs from your own position. It is the clearest demonstration of what this site thinks advice is.",
  },
  {
    href: "/character/board",
    label: "Lay out your own situation",
    why: "The first thing here that is about you rather than about life in general. It works out which pressure is actually binding, which is usually not the loudest one.",
  },
  {
    href: "/guidance",
    label: "Choosing a path",
    why: "Turns the binding row into meaningfully different options with their real costs — and is willing to end by telling you there is no recommendation yet.",
  },
  {
    href: "/character/logs",
    label: "The decision record",
    why: "Write down what you knew and expected before the outcome lands. Hindsight will otherwise supply an account in which you should have seen it coming.",
  },
  {
    href: "/methodology",
    label: "How this works",
    why: "Read last, on purpose: it is the page that tells you how to judge everything above it, including the list of places this way of seeing breaks.",
  },
];

export default function OrientationPage() {
  return (
    <ReadingPage>
      <PageHeader
        eyebrow="Orientation · about five minutes"
        title="The Human Package"
        intro="Before any advice is worth anything, it helps to say plainly what every life is already inside. None of this is a fault in the design. It is the design."
      />

      {/* N-002 — the anti-app declaration, first, in the reader's second person.
          The trunk already promises this in the entrance footnote and the chrome
          footer, both in small grey type below the fold. Said first, it is the
          sentence that earns everything after it. */}
      <p>
        A guidebook, not an app. Nothing here signs you up, nothing keeps a record of your visit, and
        nothing you do on this site is measured or scored. It is written for one person at a time —
        you — and it is built so that you find the thing you came for and leave.
      </p>

      <h2 id="you-arrive-needing-everything">You arrive needing everything</h2>
      <p>
        Nobody begins self-made. Somebody fed you before you could ask for food, named the world before
        you could question the names, and carried whole years you have no memory of. What you can do
        rises out of that slowly, gated by resources you did not pick and could not have earned. The
        standard equipment is a body that has to be maintained, a mind that gets better at things by
        doing them, and hands that can make, tend and connect — and it arrives switched on and unable to
        look after itself. Needing other people is not a stage you graduate out of. It is the material
        you are made of.
      </p>

      <h2 id="the-hand-was-dealt">The hand was dealt before you sat down</h2>
      <p>
        Health, money in the household, safety, legal status, where on the map you woke up, the body you
        woke up in, the decade on the calendar. None of it chosen; all of it deciding which moves are
        cheap, which are costly, and which are not on the table at all. That explains an enormous amount
        about a life and says nothing whatever about the worth of the person living it.
      </p>
      <p>
        It is also why the same advice can be sound or reckless depending only on who receives it.{" "}
        <strong>
          &ldquo;Just take the risk&rdquo; is good counsel for someone with a floor beneath failure, and
          dangerous counsel for someone without one.
        </strong>{" "}
        Nothing on this site can tell you which of those you are. That is the one thing you already know
        and the page does not, and most confident advice is confident because it skipped asking.
      </p>

      <h2 id="nobody-here-is-scenery">Nobody here is scenery</h2>
      <p>
        Other people are the largest fact in the whole business, and not one of them is background.
        Everyone you meet is living a full life of their own in which you are, at best, a supporting
        part, and whose situation you can never entirely see. They are where love, repair, information
        and access come from, and also burden, conflict and harm — often the same people, at different
        times. Almost nothing you want is reachable without them. That is inconvenient, and it is not
        going to change.
      </p>

      <h2 id="the-rules-are-local">The rules change with the place and the year</h2>
      <p>
        A move that is ordinary in one household, country, economy, body or decade is simply unavailable
        in another. What you are entitled to, what things cost, what is expected of you, what happens if
        you fail — all of it local, all of it dated. The worked material here uses a United States,
        present-day baseline, because anything built has to be built from somewhere; that is a starting
        point rather than a claim about everybody. Where the ground is known to shift, the pages try to
        say so. Where they do not say so, assume it shifts anyway.
      </p>

      <h2 id="it-is-finite">It is finite, and the length is not disclosed</h2>
      <p>
        Every life ends, and nobody is told when. That is load-bearing rather than morbid. It is why a
        year spent one way is not also available to be spent another way, and why the cost of a choice is
        real even when nothing visibly goes wrong. There is no reload and no second attempt at the same
        stretch. What you build stays where you leave it, and this guidebook does not claim to know
        whether anything follows.
      </p>

      <h2 id="no-definition-of-winning">Nothing shipped with a definition of winning</h2>
      <p>
        You are not handed one, so you supply one. Stability, love, health, craft, freedom, service,
        pleasure, faith, curiosity, leaving something behind — these matter in different amounts in
        different lives, and common is not the same as good, any more than uncommon is the same as
        failed.
      </p>
      {/* N-003 — the stake, which the trunk's creation copy states as a mechanic
          and never as a reason. The clause is the point of the instruction. */}
      <p>
        What is worth saying out loud is what happens when you skip the question.{" "}
        <strong>
          The most reliable source of misery is not losing; it is spending years playing somebody
          else&rsquo;s game without noticing that you never chose it.
        </strong>{" "}
        So the first move — before any plan, before any instrument on this site — is making sure the
        question you are answering is yours.
      </p>

      <h2 id="you-can-change">You can change — and not without limit</h2>
      <p>
        People learn, recover, compensate, retrain and revise, and very little about a starting position
        is fixed for a whole life. Some losses are permanent. Some constraints will not move for one
        person pushing and move only for many people pushing together. An honest map shows the reach of
        your agency <em>and</em> its edge, because either half on its own does damage: told only that you
        can change anything, you read a structural wall as a personal failing; told only that the hand
        decides, &ldquo;I was dealt badly&rdquo; hardens into an account that limits you further than the
        hand ever did. Both mistakes are ordinary. This page would rather you made neither.
      </p>

      {/* N-008 — an ordered path with a reason attached to each stop, and a stated
          skip list, which is what stops it reading as homework. */}
      <h2 id="a-way-to-read-this">A way to read this, in order</h2>
      <p>
        If nothing has happened and you have half an hour, this is the order that makes everything else
        here cheapest to read. It is a suggestion, not a syllabus; nothing is locked, and you can start
        anywhere.
      </p>
      <ol className="reading-path">
        {READING_PATH.map((s) => (
          <li key={s.href}>
            <Link href={s.href}>{s.label}</Link>
            <span className="reading-path-why">{s.why}</span>
          </li>
        ))}
      </ol>
      <p>
        <strong>What you may skip.</strong> All of the playable half, permanently, if you do not want it
        — the reading layer is complete without it. The timeline, until an age is genuinely the question
        you are holding. The methodology page, until something here has irritated you enough to want to
        check it. Any guide whose subject is not your subject.
      </p>
      <p>
        <strong>What you may never skip is knowing where <Link href="/triage">the triage page</Link> is.</strong>{" "}
        Not necessarily for you. For the evening when the person holding the phone is someone you love,
        and neither of you can think of where to start.
      </p>

      <EvidenceDrawer
        record={{
          status: "editorial",
          scope: "A statement of what this site is and what it assumes — not a measured profile of anybody.",
          lastReviewed: "2026-09-05",
          whatWouldChange:
            "Nothing here is a finding. Each section is a framing of the project's scope, and any specific developmental, demographic or outcome claim would need its own source before being stated as fact; none is stated here, and there is no figure on this page.",
          whereThisFrameFails:
            "The package is described for one person at a time, which has little to say about lives lived primarily as part of a group, and it treats a present-day United States vantage point as the default when much of it is neither universal nor timeless.",
        }}
      />
    </ReadingPage>
  );
}
