import Link from "next/link";
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
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  status?: ContentStatus;
}) {
  return (
    <header className="page-header">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1>{title}</h1>
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

export function NextStep({ href, children }: { href: string; children: React.ReactNode }) {
  const external = href.startsWith("http");
  if (external) {
    return (
      <li>
        <a href={href} rel="noopener noreferrer">
          {children}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={href}>{children}</Link>
    </li>
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
