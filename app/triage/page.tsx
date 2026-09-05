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
    // N-021 (6.0 §3.3) — routed by the STRUCTURE of the demand rather than its
    // subject, because structure is what transfers: paperwork, one high-stakes
    // occasion, somebody else to look after, and a decision that cannot be
    // undone have almost nothing in common as topics and completely different
    // moves. This branch used to offer an index and the board — a menu, which
    // the doctrine forbids for help-now and which read thin here besides.
    // Every option lands on a complete page (G-05); still two questions at most.
    id: "demanded",
    label: "Something is being demanded of me",
    options: [
      { href: "/situations/job-loss#clocks", label: "Paperwork I do not understand, with a deadline on it" },
      { href: "/character/board", label: "One high-stakes thing I have to get through" },
      { href: "/topics/relationships#load", label: "Someone else needs looking after" },
      { href: "/guidance", label: "A decision I cannot take back" },
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

      {/* N-089 — one calm line under the two questions, in the register of a
          set-down route: no analysis, no apparatus, no game word. */}
      <p className="triage-cheapest-question" data-cheapest-question>
        And if none of this is urgent and you are only stuck: choose the cheapest question whose answer
        could change what you do. Ask it before promising anything more.
      </p>

      {/* N-023 — the quiet line, under the questions rather than above them, for
          the reader who does not have the capacity to answer either. */}
      <p className="triage-nothing-left">
        If you have nothing left tonight, <Link href="/situations/getting-through-today">start here
        instead</Link>. It is six things and then it stops.
      </p>

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
