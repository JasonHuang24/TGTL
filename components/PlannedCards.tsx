import { comingForArea, COMING_BY_ID, type ComingArea } from "@/content/methodology";

/**
 * N-302 (6.0 §3.11, §7.1, C-50) — "NOT BUILT YET", WHERE THE READER MEETS IT.
 *
 * The trunk named unbuilt scope in exactly one place, by design: a single list on
 * /methodology, which a reader has to already care about the site to go and find.
 * The cost of that design is that the hole is invisible at the moment it is
 * actually felt — on an index that quietly covers four things when a reader came
 * looking for a fifth. Confident emptiness reads as "there is nothing here",
 * which is a claim, and a false one.
 *
 * THE SINGLE-SOURCE RULE SURVIVES INTACT (2.0 §6.9, extended by 6.0 §2.3.2). These
 * cards are GENERATED from `WHATS_COMING`; nothing here names a piece of unbuilt
 * scope that the list does not name first, and no card carries text of its own. A
 * route may also point at an entry by id (`RouteRecord.planned`), which renders as
 * a line under that route's card and is passed here as `claimed` so the same entry
 * never appears twice on one page. C-50 resolves every id in both directions.
 *
 * NO PROMISE IS MADE. Each card says planned and not built, in the same words the
 * list uses, with no date attached to any of them.
 */
export function PlannedCards({ area, claimed = [] }: { area: ComingArea; claimed?: string[] }) {
  const entries = comingForArea(area).filter((w) => !claimed.includes(w.id));
  if (entries.length === 0) return null;
  return (
    <section className="planned-section" aria-labelledby={`planned-${area}`}>
      <h2 id={`planned-${area}`}>Planned, and not built yet</h2>
      <p className="planned-lead">
        Named here so the gap is visible where you would feel it, rather than only on the
        methodology page. Each of these is honestly missing: nothing below exists in any form, and
        none of it has a date.
      </p>
      <ul className="planned-cards">
        {entries.map((w) => (
          <li key={w.id} className="planned-card" data-planned={w.id}>
            <span className="planned-badge">Planned</span>
            <span className="planned-card-line">{w.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * The same thing at the scale of one card: a route that exists, with a named
 * deepening that does not. Rendered from `RouteRecord.planned`, resolved against
 * the one list.
 */
export function PlannedNote({ id }: { id: string }) {
  const entry = COMING_BY_ID[id];
  if (!entry) return null;
  return (
    <p className="planned-note" data-planned={entry.id}>
      <span className="planned-badge">Planned</span> {entry.text}
    </p>
  );
}
