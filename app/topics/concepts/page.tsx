import type { Metadata } from "next";
import Link from "next/link";
import { ReadingPage, PageHeader, Lede, EvidenceDrawer } from "@/components/primitives";
import { CONCEPTS, CONCEPT_COLUMNS } from "@/content/concepts";
import { ROUTE_BY_PATH } from "@/content/routes";
import { SingleHomeNote } from "@/components/SingleHomeNote";

export const metadata: Metadata = {
  title: "One idea, several systems",
  description:
    "Ten ideas that turn up in more than one place, with what each one means in each — compounding in money and in a body, a floor under a decision and under a career.",
};

/**
 * N-111 (6.0 §3.5) — the concept index, rendered from `content/concepts.ts`.
 * It owns no explanation: every cell links the route that does (G-06, C-31).
 */
export default function ConceptsPage() {
  const titleOf = (path: string) => ROUTE_BY_PATH[path]?.title ?? path;
  return (
    <ReadingPage>
      <PageHeader
        eyebrow="Topics · a cross-reference"
        title="One idea, several systems"
        intro="Four guides own the mechanisms of this site, and a few of those mechanisms are the same mechanism twice, wearing a different name each time. This page is the list of those — a thread you can pull through the whole thing."
      />

      <Lede>
        Nothing is explained here. Every line is one sentence and a door into the guide that actually
        owns that idea, which is the rule the rest of the site runs on too.
      </Lede>

      {/* Marked as a horizontal scroll region so the page body never scrolls
            sideways (the 320px gate) and S-9 audits it on the axis it declares;
            tabIndex makes the region reachable and scrollable by keyboard. */}
      <div className="concept-table-wrap" data-scroll-region="x" tabIndex={0} role="group" aria-label="Concept table, scrolls sideways">
        <table className="concept-table">
          <caption className="visually-hidden">
            Ten ideas, and what each one means in each part of the model. A dash means the idea has no
            distinct meaning there.
          </caption>
          <thead>
            <tr>
              <th scope="col">Idea</th>
              {CONCEPT_COLUMNS.map((c) => (
                <th scope="col" key={c.system}>
                  <Link href={c.system}>{c.label}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CONCEPTS.map((concept) => (
              <tr key={concept.id}>
                <th scope="row" id={concept.id}>
                  {concept.name}
                </th>
                {CONCEPT_COLUMNS.map((col) => {
                  const cell = concept.cells.find((c) => c.system === col.system);
                  return (
                    <td key={col.system} data-concept-cell={cell ? concept.id : undefined}>
                      {cell ? (
                        <Link href={cell.system}>
                          <span className="concept-cell-gloss">{cell.gloss}</span>
                        </Link>
                      ) : (
                        <span className="concept-cell-empty" aria-label="not a distinct idea here">
                          —
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 id="how-to-use-it">What the gaps mean</h2>
      <p>
        A dash is information. It means the idea has no distinct meaning in that part of the model —
        not that nobody has got round to writing it. Filling the gaps in would be the first thing that
        made this page dishonest, and a table with no gaps in it is usually a table that has started
        inventing.
      </p>
      <p>
        The columns are the four guides plus two places a mechanism gets applied rather than owned:{" "}
        <Link href="/map/credential-decision">{titleOf("/map/credential-decision")}</Link>, where a real
        decision is taken apart, and <Link href="/walkthrough">{titleOf("/walkthrough")}</Link>, which is
        how the same idea behaves inside a played life. Ten ideas, and a couple of hundred words —
        because if this page ever needed to be long, it would have stopped being an index.
      </p>

      <SingleHomeNote />

      <EvidenceDrawer
        record={{
          status: "editorial",
          scope: "A cross-reference over this site's own explanations. It makes no claim beyond them.",
          lastReviewed: "2026-09-05",
          whatWouldChange:
            "Each cell is a one-line summary of an argument made in full somewhere else, and if a guide changes its account, the line here is wrong until it is changed too. Nothing on this page is measured and no figure appears on it.",
          whereThisFrameFails:
            "Naming two things with one word is a claim that they behave alike, and the resemblance is real but partial: compounding in a savings account is arithmetic, and compounding in a body is a metaphor for something considerably messier. The table is a way of noticing, not a proof of sameness.",
        }}
      />
    </ReadingPage>
  );
}
