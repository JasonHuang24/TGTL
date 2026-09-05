import type { Metadata } from "next";
import Link from "next/link";
import { ReadingPage, PageHeader } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Situations",
  description:
    "Pages for specific hard events. They end with what to do next and what not to decide yet — never a lecture.",
};

const SITUATIONS = [
  {
    href: "/situations/job-loss",
    title: "I lost my job",
    line: "The first days, the clocks that actually matter, the search as a system, and the routes back — with the reminder that a layoff selects by budget line, not by worth.",
  },
  {
    href: "/situations/burnout",
    title: "I am burning out",
    line: "Four steps in order: confirm what this is, stop the bleeding, find the root cause, and change the thing that keeps converting your rest back into exhaustion.",
  },
  {
    href: "/situations/breakup",
    title: "A relationship has ended",
    line: "Home, money, people, routine and the answer to who you are, all stopping on the same day — with the first week, the first fortnight, and what not to decide yet.",
  },
  {
    href: "/situations/a-death",
    title: "Someone has died",
    line: "The logistics of the first days, held apart from the grief, so almost nothing has to be decided today.",
  },
  {
    href: "/situations/grief",
    title: "I am grieving",
    line: "What grief is actually like, what is not true about it, and what people report helped — with no schedule you could be behind on.",
  },
  {
    href: "/situations/depression",
    title: "I am flat, exhausted, or hopeless",
    line: "Why the condition misreports you to yourself, and why the move is outside your own instruments — people, and professionals.",
  },
  {
    href: "/situations/being-hurt",
    title: "Someone is hurting or controlling me",
    line: "Information, not instructions. Nothing here is conditional on what you decide, and nothing pushes you toward a move that can raise the danger.",
  },
  {
    href: "/situations/getting-through-today",
    title: "I have nothing left today",
    line: "Six ordinary things, and permission to stop reading. It is the shortest page here and it is finished when you have read it.",
  },
];

export default function SituationsIndexPage() {
  return (
    <ReadingPage>
      <PageHeader
        eyebrow="Situations"
        title="Something specific happened"
        intro="Each of these begins with the event, not a category or a diagnosis. Pick the closest — you can move between them."
      />
      <p>
        These pages don&rsquo;t end in a lecture. They end with what to do next and, just as
        important, what <em>not</em> to decide yet. When the ground is still moving, knowing which
        decisions can wait is often worth more than any single answer.
      </p>

      <ul className="situation-cards">
        {SITUATIONS.map((s) => (
          <li key={s.href}>
            <Link href={s.href} className="situation-card">
              <span className="situation-card-title">{s.title}</span>
              <span className="situation-card-line">{s.line}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="situation-index-note">
        If none of these is quite it, <Link href="/triage">start from what happened</Link> and let two
        questions point you, or <Link href="/character/board">lay the whole situation out</Link> first.
        If you need a person rather than a page, <Link href="/threshold">here are numbers</Link>.
      </p>

      {/* N-036 (6.0 §3.3) — a shape rather than a subject. Four situations with
          nothing in common as topics have the same structure and therefore the
          same available moves; that is what a page organised by structure can do
          and a page organised by topic cannot. Not a route of its own (§3.1). */}
      <h2 id="waiting-on-a-slow-decider">Waiting on a slow decider</h2>
      <p>
        An application in its ninth month. A result that takes three weeks. A hiring process that said
        &ldquo;we&rsquo;ll be in touch shortly&rdquo; a month and a half ago. Someone who has said they
        need time to decide whether to stay. As subjects these have nothing to do with each other. As
        situations they are identical: something large about your life is being decided by somebody who
        is not you, on a timetable you do not control, with no reliable information about progress —
        and the whole interval is unspendable, because you cannot commit to anything that either answer
        would undo.
      </p>
      <p>
        The first useful thing to know is that this costs something. Waiting is not free time; it is
        time with a background process running, which is why people come out of these stretches
        exhausted having apparently done nothing. Observers call it procrastination and so, often, does
        the person doing it. It is neither. Four moves work across the whole family:
      </p>
      <ul>
        <li>
          <strong>Find the real timescale, from someone who knows.</strong> Not the published one.
          Institutions and people both routinely quote a default rather than an estimate, and a real
          answer converts an indefinite wait into a bounded one, which is an enormous psychological
          difference for no cost at all. This is the highest-value move here and almost nobody makes it.
        </li>
        <li>
          <strong>Establish what is genuinely unaffected by either answer, and do that.</strong> There is
          nearly always more of it than it feels like. The freeze usually spreads far beyond what the
          decision actually touches.
        </li>
        <li>
          <strong>Prepare the worse answer once, specifically, in writing — then stop.</strong> Not
          rumination: one concrete pass at what you would actually do. It converts an unbounded dread
          into a named set of steps. Doing it once helps; doing it nightly is the failure mode, and the
          difference between the two is whether anything is written down at the end.
        </li>
        <li>
          <strong>Set a review trigger.</strong> A date on which you chase, escalate, or act as though
          the answer were no. Without one the wait extends indefinitely by default, and the default is
          somebody else&rsquo;s convenience rather than yours.
        </li>
      </ul>
      <p>
        And four things that reliably do not work, which is worth knowing because they are what the time
        goes into: chasing more often than the real timescale warrants; re-reading what you submitted;
        re-deciding every evening what you will do in each case; and narrating the whole thing to
        everybody, which converts a private wait into a public one you then also have to manage.
      </p>

      {/* N-041 (6.0 §3.3, C-30) — a named page class where the no-recommendation
          state is the CORRECT output rather than a fallback. The section carries
          no recommendation verb, and the gate proves it by planting one. */}
      <section id="not-solvable" data-conflict-class>
        <h2 id="not-solvable-only-navigable">Not solvable, only navigable</h2>
        <p>
          Most practical writing treats every difficulty as an optimisation problem whose solution has
          not been found yet. Some difficulties are not that. Where two things you genuinely want are
          incompatible, or two obligations both bind, there is no arrangement that satisfies both — and
          presenting one as though there were is how people conclude they are failing at something
          everyone else has worked out.
        </p>
        <p>
          Naming the category is the substantive content. It says: the thing you are looking for does not
          exist, you are not missing it, and what remains is choosing which loss to take deliberately
          rather than letting it be chosen by whichever demand is loudest. Two tests are worth running
          first, because both possible errors are expensive in different directions.{" "}
          <em>Is one side a proxy?</em> — often what looks like a want is standing in for something else,
          and the things underneath turn out not to conflict at all. <em>Is the scarcity a total or a
          simultaneity?</em> — two commitments needing more hours than exist is a hard conflict; two
          commitments that both need Tuesday frequently has moves that a hard conflict does not.
        </p>
        <p>
          If it survives both tests, the honest output is a way through rather than an answer.{" "}
          <Link href="/character/board#conflict">The conflict step of the board</Link> is where a real
          case gets written out in its own words, and{" "}
          <Link href="/guidance">the guidance flow</Link> is willing to finish by saying that no ranking
          is available yet and naming what would change that. On this class of situation, that ending is
          not the instrument failing. It is the instrument being accurate.
        </p>
      </section>
    </ReadingPage>
  );
}
