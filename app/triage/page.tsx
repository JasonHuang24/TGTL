import type { Metadata } from "next";
import Link from "next/link";
import { CrisisNote } from "@/components/primitives";
import { SetDownNotice } from "@/components/SetDownNotice";

export const metadata: Metadata = {
  title: "Something happened",
  description: "One page, two questions at most, then the page you actually need. Nothing is recorded.",
};

type Branch = {
  id: string;
  label: string;
  options: { href: string; label: string }[];
};

/**
 * The second-tier destinations. Every one is a complete page (G-05). The
 * "someone is hurting or frightening me" option is first-tier and routes
 * DIRECTLY to the abuse page (§5.4) — it is not nested here.
 */
const BRANCHES: Branch[] = [
  {
    id: "not-chosen",
    label: "Something happened that I did not choose",
    options: [
      { href: "/situations/job-loss", label: "I lost my job" },
      { href: "/situations/a-death", label: "Someone has died" },
      { href: "/situations/grief", label: "I am grieving a loss" },
    ],
  },
  {
    id: "demanded",
    label: "Something is being demanded of me",
    options: [
      { href: "/situations", label: "Show me the situations, so I can find the nearest one" },
      { href: "/character/board", label: "Help me lay the whole thing out first" },
    ],
  },
  {
    id: "wrong-anyway",
    label: "Nothing happened — something is wrong anyway",
    options: [
      { href: "/situations/depression", label: "I am flat, exhausted, or hopeless" },
      { href: "/situations/grief", label: "A loss I am still carrying" },
      { href: "/character/board", label: "I cannot name it — help me lay it out" },
    ],
  },
  {
    id: "dont-know",
    label: "I don't know",
    options: [
      { href: "/situations", label: "Show me the list of situations" },
      { href: "/character/board", label: "Help me lay out where I am" },
      { href: "/guidance", label: "I have a decision to make" },
    ],
  },
];

/**
 * Triage (blueprint §5.4). Set-down. Blends Claude-family's branching flow and
 * Fable 5's promise: two questions at most, then a complete page. Built with
 * native <details> so it works fully without JavaScript (§8) — no client state.
 */
export default function TriagePage() {
  return (
    <article className="prose-page is-setdown triage">
      <SetDownNotice />
      <h1>Something happened</h1>
      <p className="threshold-lede">
        You don&rsquo;t need a website right now. You need one page. Two questions at most, then
        you&rsquo;re there. Nothing here is recorded.
      </p>

      <p className="triage-prompt">Choose the closest.</p>

      <div className="triage-branches">
        <Link className="triage-direct" href="/situations/being-hurt">
          Someone is hurting or frightening me
          <span aria-hidden="true"> →</span>
        </Link>

        {BRANCHES.map((branch) => (
          <details key={branch.id} className="triage-branch">
            <summary>{branch.label}</summary>
            <ul>
              {branch.options.map((o) => (
                <li key={o.href}>
                  <Link href={o.href}>{o.label}</Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      <CrisisNote />
    </article>
  );
}
