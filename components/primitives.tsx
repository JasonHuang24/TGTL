import Link from "next/link";
import { Term } from "@/components/Term";
import type { TermKey } from "@/content/terminology";
import {
  STATUS_LABEL,
  STATUS_MEANING,
  type ContentStatus,
  type EvidenceRecord,
  type Provenance,
  PROVENANCE_LABEL,
} from "@/content/evidence";

/**
 * Server-safe presentational primitives shared across pages. No hooks, no state —
 * these render to static HTML (the JS-off reading floor, §8).
 */

export function PageHeader({
  eyebrow,
  title,
  intro,
  status,
  systems,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  status?: ContentStatus;
  /**
   * N-322 (6.0 §3.12) — the system tag row. Passed from the page's own
   * `ROUTE_BY_PATH[...].systems` so the inventory stays the single source, and
   * rendered through <Term> so a tag obeys edition parity like any other label.
   * A SET-DOWN ROUTE NEVER PASSES ONE (§5.3); C-34 walks the set-down HTML for it.
   */
  systems?: TermKey[];
}) {
  return (
    <header className="page-header">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
      {systems && systems.length > 0 && (
        <p className="system-tags" data-system-tags>
          <span className="system-tags-label">What this touches:</span>
          {systems.map((k) => (
            <span key={k} className="system-tag" data-system-tag={k}>
              <Term k={k} />
            </span>
          ))}
        </p>
      )}
      {intro && <p className="page-intro">{intro}</p>}
      {status && <StatusLabel status={status} />}
    </header>
  );
}

export function StatusLabel({
  status,
  note,
}: {
  status: ContentStatus;
  note?: string;
}) {
  return (
    <span className="status-label" data-status={status} title={STATUS_MEANING[status]}>
      <span className="status-dot" aria-hidden="true" />
      {STATUS_LABEL[status]}
      {note ? `: ${note}` : ""}
    </span>
  );
}

export function StalenessStamp({ date, prefix = "As of" }: { date: string; prefix?: string }) {
  return (
    <span className="staleness-stamp">
      {prefix} {date}
    </span>
  );
}

export function Lede({ children }: { children: React.ReactNode }) {
  return <p className="lede">{children}</p>;
}

export function Callout({
  children,
  tone = "neutral",
  title,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "warm" | "caution" | "quiet";
  title?: string;
}) {
  return (
    <aside className="callout" data-tone={tone}>
      {title && <p className="callout-title">{title}</p>}
      {children}
    </aside>
  );
}

/** A labelled panel used on instrument surfaces (roadmap, character, history). */
export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`panel ${className}`.trim()}>{children}</section>;
}

/**
 * The evidence drawer (§9.4). Progressive disclosure: closed by default, opens
 * to status, scope, last-reviewed, "what would change this", and — on
 * model-bearing pages — "where this frame fails".
 */
export function EvidenceDrawer({
  record,
  title = "Evidence and limits",
}: {
  record: EvidenceRecord;
  title?: string;
}) {
  return (
    <details className="evidence-drawer">
      <summary>
        {title}
        <StatusLabel status={record.status} />
      </summary>
      <div className="evidence-body">
        <p className="evidence-meaning">{STATUS_MEANING[record.status]}</p>
        <dl>
          {record.scope && (
            <div>
              <dt>Scope</dt>
              <dd>{record.scope}</dd>
            </div>
          )}
          <div>
            <dt>Last reviewed</dt>
            <dd>{record.lastReviewed}</dd>
          </div>
          <div>
            <dt>What would change this</dt>
            <dd>{record.whatWouldChange}</dd>
          </div>
          {record.whereThisFrameFails && (
            <div>
              <dt>Where this frame fails</dt>
              <dd>
                {record.whereThisFrameFails}{" "}
                <Link href="/methodology#known-breaks">See the known breaks in this model.</Link>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </details>
  );
}

/** A small honest provenance tag for a mentor note (§9.4). */
export function MentorNote({
  children,
  provenance,
}: {
  children: React.ReactNode;
  provenance: Provenance;
}) {
  return (
    <aside className="mentor-note">
      <p className="mentor-note-label">Often learned late</p>
      <div className="mentor-note-body">{children}</div>
      <p className="mentor-note-provenance">{PROVENANCE_LABEL[provenance]}</p>
    </aside>
  );
}

/**
 * Quiet routing at the end of a page (§5.5): what connects, plus, on sensitive
 * pages, the Threshold. Never a lecture.
 */
export function NextSteps({
  title = "Where this connects",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <nav className="next-steps" aria-label={title}>
      <h2>{title}</h2>
      <ul>{children}</ul>
    </nav>
  );
}

/**
 * N-320 (C-32) — THE LINK GRAMMAR.
 *
 * The closed list of relations a cross-page link may declare. It is closed on
 * purpose: an open vocabulary would let every link be "related to", which is what
 * the row exists to stop. A reader should know what a link will do for them
 * before spending the click — and a closed list also makes wrong-shelf content
 * visible at build time, because a link that fits none of these usually means the
 * material is filed in the wrong place.
 *
 *   requires  — you need what is over there before this makes sense
 *   unlocks   — this opens something that was not available before
 *   costs     — going there tells you what this will take
 *   protects  — that page is what keeps this one's downside bounded
 *   explains  — the mechanism under what you just read lives there
 *   precedes  — that is the step before this one, in time
 *   see-also  — genuinely adjacent, and honest about being no more than that
 */
export const NEXT_STEP_RELATIONS = [
  "requires",
  "unlocks",
  "costs",
  "protects",
  "explains",
  "precedes",
  "see-also",
] as const;

export type NextStepRelation = (typeof NEXT_STEP_RELATIONS)[number];

const RELATION_LABEL: Record<NextStepRelation, string> = {
  requires: "Requires",
  unlocks: "Unlocks",
  costs: "Costs",
  protects: "Protects",
  explains: "Explains",
  precedes: "Comes first",
  "see-also": "See also",
};

export function NextStep({
  href,
  relation,
  why,
  children,
}: {
  href: string;
  /** One of the seven; the type is the enforcement, C-32 is the proof. */
  relation: NextStepRelation;
  /** Why this link is worth the click, in one line. Never empty. */
  why: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  const body = (
    <>
      <span className="next-step-relation" data-next-step-relation={relation}>
        {RELATION_LABEL[relation]}
      </span>
      {external ? (
        <a href={href} rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <Link href={href}>{children}</Link>
      )}
      <span className="next-step-why" data-next-step-why>
        {why}
      </span>
    </>
  );
  return <li className="next-step">{body}</li>;
}

/**
 * N-045 (6.0 §3.3) — ONE STEP OF A DECISION SEQUENCE, WITH ITS PRIMARY SYSTEM.
 *
 * A reader partway through a bad week cannot hold the whole map at once. What
 * they can hold is "this step is a money question; the next one is a people
 * question" — which is the difference between a pathway that can be followed one
 * move at a time and a list of good advice that has to be absorbed whole.
 *
 * The system label goes through <Term>, so the Standard edition never meets a
 * game word here and gate 2's generated lint covers the label automatically.
 * SET-DOWN ROUTES RENDER NO STEP CHROME AT ALL — they do not use this primitive,
 * and a numbered sequence is exactly the wrong shape for a page whose content is
 * "nothing here is for you right now".
 */
export function PathwayStep({
  n,
  title,
  primary,
  id: explicitId,
  children,
}: {
  n: number;
  title: string;
  primary: TermKey;
  /** A short, stable anchor where something links to this step (triage does). */
  id?: string;
  children: React.ReactNode;
}) {
  const id =
    explicitId ??
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  return (
    <section className="pathway-step" data-pathway-step={n}>
      <h2 id={id}>
        <span className="pathway-step-num" aria-hidden="true">
          {n}
        </span>
        {title}
      </h2>
      <p className="pathway-step-primary">
        <span className="pathway-step-primary-label">Primary system:</span> <Term k={primary} />
      </p>
      {children}
    </section>
  );
}

/**
 * N-235 (C-24) — THE READING-TO-PLAY ENTRY.
 *
 * The trunk's play layer is reachable from the entrance and from itself. Nothing
 * goes the other way: a reader who has just read the credential decision, or the
 * money guide, has nowhere to go and try it, and the two halves of the site stay
 * two sites. This is the cheapest thing that joins them.
 *
 * WHAT IT IS NOT. It is a link, not a nudge — no button, no primary treatment, no
 * "ready to play?", and never above the fold: it belongs at the end of a reading
 * route, where somebody has finished reading. The label comes through `<Term>`, so
 * the Standard edition says "Try this as a decision" and never a game word, and
 * gate 2's generated set-down lint covers it automatically.
 *
 * WHERE IT MAY NEVER GO. Any set-down route, and above all the five sensitive
 * pages. A grief page does not invite play; that is the same rule that keeps Play
 * out of the set-down nav. C-24 asserts it over the exported HTML, and the marker
 * below is what it looks for.
 */
export function TryInPlay({ href, children }: { href: string; children?: React.ReactNode }) {
  return (
    <p className="try-in-play" data-try-in-play>
      <Link href={href}>
        <Term k="tryInPlay" />
      </Link>
      {children ? <span className="try-in-play-note"> — {children}</span> : null}
    </p>
  );
}

/**
 * N-093 (6.0 §3.4, C-41) — THE PANEL THAT CLOSES A COMPARISON.
 *
 * A comparison that simply stops reads as unfinished, and an unfinished
 * comparison invites the reader to supply the missing verdict themselves —
 * usually the one they arrived with. The refusal has to BE the closing element,
 * not an absence where one would go.
 *
 * So it names what each side actually emphasises, which is the only honest thing
 * left to say once you have refused to rank them: not "it depends", which tells
 * the reader nothing, but the specific axis each option is strong on and the
 * specific price it charges for that.
 *
 * NO SIDE IS MARKED. There is no ordering here, no first position, no highlight,
 * and `sides` renders in the order the page passes them, which is the order the
 * page already used above. C-41 asserts it renders LAST on every comparison
 * surface, because a refusal placed in the middle is a caption, not a close.
 */
export function NoWinner({
  sides,
  title = "No overall winner",
  note,
}: {
  sides: { name: string; emphasises: string }[];
  title?: string;
  /** One page-specific sentence, where the comparison needs one. */
  note?: string;
}) {
  return (
    <aside className="no-winner" data-no-winner aria-label={title}>
      <h3 className="no-winner-title">{title}</h3>
      <p className="no-winner-lead">
        These are not versions of one thing at different qualities, so there is no best of them to
        report. What differs is what each one emphasises, and what it charges for the emphasis.
      </p>
      <dl className="no-winner-sides">
        {sides.map((s) => (
          <div key={s.name} data-no-winner-side>
            <dt>{s.name}</dt>
            <dd>{s.emphasises}</dd>
          </div>
        ))}
      </dl>
      {note && <p className="no-winner-note">{note}</p>}
    </aside>
  );
}

/** The standing crisis note used at the foot of triage states and top of depression (§5.4). */
export function CrisisNote() {
  return (
    <p className="crisis-note">
      If you might be in danger or thinking about ending your life, you do not need to read anything
      first. <Link href="/threshold">Here are phone numbers</Link>. In the US, call or text 988.
    </p>
  );
}

/** A reading-surface article wrapper with a comfortable measure. */
export function ReadingPage({
  children,
  setDown = false,
}: {
  children: React.ReactNode;
  setDown?: boolean;
}) {
  return <article className={`prose-page${setDown ? " is-setdown" : ""}`}>{children}</article>;
}

/** A wide instrument-surface wrapper. */
export function InstrumentPage({ children }: { children: React.ReactNode }) {
  return <div className="instrument-page">{children}</div>;
}
