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
    </ReadingPage>
  );
}
