import type { Metadata } from "next";
import Link from "next/link";
import { ReadingPage, PageHeader } from "@/components/primitives";
import { Search } from "@/components/Search";
import { ROUTES } from "@/content/routes";

export const metadata: Metadata = {
  title: "Topics",
  description: "Look something up: money, health, relationships, work — plus search across the guide.",
};

const TOPIC_CARDS = [
  { href: "/topics/money", title: "Money and slack" },
  { href: "/topics/health", title: "Health maintenance" },
  { href: "/topics/relationships", title: "The people around you" },
  { href: "/topics/work", title: "Education and career" },
];

const summaryFor = (path: string) => ROUTES.find((r) => r.path === path)?.summary ?? "";

export default function TopicsIndexPage() {
  return (
    <ReadingPage>
      <PageHeader
        eyebrow="Topics"
        title="Look something up"
        intro="Four guides own the core mechanisms; everything else on the site links to them rather than re-explaining. Or search across every page."
      />

      <Search />

      <h2>The four guides</h2>
      <ul className="topic-cards">
        {TOPIC_CARDS.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="topic-card">
              <span className="topic-card-title">{t.title}</span>
              <span className="topic-card-line">{summaryFor(t.href)}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="topics-timeline-link">
        Looking for what happens at a particular age?{" "}
        <Link href="/timeline">The timeline</Link> goes year by year from birth to one hundred.
      </p>

      <h2>Everything on the site</h2>
      <p className="topic-browse-note">
        In case search is not what you want — every page, grouped roughly by what it is for.
      </p>
      <ul className="topic-browse">
        {ROUTES.filter((r) => r.searchable).map((r) => (
          <li key={r.path}>
            <Link href={r.path}>{r.title}</Link>
          </li>
        ))}
      </ul>
    </ReadingPage>
  );
}
