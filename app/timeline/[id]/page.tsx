/**
 * /timeline/<milestone-id> — a milestone page (5.0 blueprint §3.1).
 *
 * Exists for every record flagged `major` AND FOR NO OTHER (T-10 asserts both
 * directions). The timing analysis at full depth: the branches of early, in the
 * window, late, interrupted, alternative and never — descriptive, mechanism-framed,
 * with a route beside every named cost (§5.7, T-4) and never a recommendation.
 *
 * Sensitive-flagged pages render quiet in both editions (§5.3): plain vocabulary,
 * no game chrome, the care note, and the real page named before anything else.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReadingPage, PageHeader } from "@/components/primitives";
import { MILESTONES, SOURCES } from "@/content/timeline/generated";
import {
  KIND_LABEL,
  KIND_STANDING_LINE,
  LANE_LABEL,
  MEASURE_LABEL,
  EVIDENCE_LABEL_TEXT,
  SCREENING_LINE,
  VARIATION_LINE,
  ROUTE_GRADE_WORD,
  ROUTE_GRADE_MEANING,
  SOURCE_TIMING_LABEL,
  SOURCE_TIMING_MEANING,
  routeText,
  routeGrade,
  type Milestone,
  type Branch,
  type BranchRoute,
} from "@/content/timeline/schema";
import { windowText } from "@/content/timeline/select";
import {
  ATTR_AGE_CLAIM,
  ATTR_SOURCE,
  ATTR_KIND,
  ATTR_STANDING_LINE,
  ATTR_SENSITIVE,
  ATTR_CARE_NOTE,
  ATTR_READ_REF,
  ATTR_STAMP,
  CLASS_EVIDENCE,
  yearAnchor,
} from "@/content/timeline/dom";

const majors = () => MILESTONES.filter((m) => (m as { major?: boolean }).major === true);

export function generateStaticParams() {
  return majors().map((m) => ({ id: m.id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const m = MILESTONES.find((x) => x.id === id);
  if (!m) return { title: "The Timeline" };
  return {
    title: `${m.label} — The Timeline`,
    description: `What is commonly true about the timing of ${m.label.toLowerCase()}, in a stated population, with its sources.`,
  };
}

/**
 * The brief §14A recovery-route questions, as the branch headings they answer.
 *
 * THE DEFAULT SET IS WRONG FOR SOME RECORDS, AND WRONGLY IN A WAY THAT MATTERS.
 *
 * A reader-persona pass — a sixty-eight-year-old whose spouse died four months ago —
 * read the widowhood page and found it asking, in headings, whether she was "late"
 * at her husband dying, whether she "tried and it stopped", and whether she "did not
 * want this", before telling her that "not doing this is a path, not a failure".
 * The branch PROSE on that record was written carefully and in the right register;
 * the template it sat in was not, and the template wins.
 *
 * So the headings vary by what the record is. A thing that happens TO a person is
 * not early or late, and a record with no sourced window has no window to be inside.
 */
type Heading = { title: string; question: string };

const BRANCH_HEADING: Record<string, Heading> = {
  early: { title: "Earlier than the common window", question: "What if I am early?" },
  window: { title: "Inside the common window", question: "What if I am on the common path?" },
  late: { title: "Later than the common window", question: "What if I am late?" },
  interrupted: { title: "Started and interrupted", question: "What if I tried and it stopped?" },
  alternative: { title: "By another route", question: "What is the nearest viable alternative?" },
  never: { title: "Not at all", question: "What if I do not want this, or cannot?" },
};

/** For something that happens TO a person rather than something they navigate. */
const BRANCH_HEADING_ARRIVES: Record<string, Heading> = {
  early: { title: "When it comes earlier in a life", question: "" },
  window: { title: "When it comes in later life", question: "" },
  late: { title: "When it comes at the oldest ages", question: "" },
  interrupted: { title: "When it comes in the middle of other things", question: "" },
  alternative: { title: "Where the practical routes are", question: "" },
  never: { title: "Other shapes this takes", question: "" },
};

/** For a record with no sourced window: do not organise it around one. */
const BRANCH_HEADING_NO_WINDOW: Record<string, Heading> = {
  early: { title: "When it comes earlier", question: "" },
  window: { title: "Whenever it comes", question: "" },
  late: { title: "When it comes later", question: "" },
  interrupted: { title: "When it interrupts something else", question: "" },
  alternative: { title: "Other routes", question: "What is the nearest viable alternative?" },
  never: { title: "Not at all", question: "What if I do not want this, or cannot?" },
};

const BRANCH_ORDER = ["early", "window", "late", "interrupted", "alternative", "never"] as const;

function BranchBlock({
  name,
  b,
  quiet,
  headings,
  suppressNeverLine,
}: {
  name: string;
  b: Branch;
  quiet: boolean;
  headings: Record<string, Heading>;
  suppressNeverLine: boolean;
}) {
  const head = headings[name] ?? { title: name, question: "" };
  const costs = (b as { costs?: string[] }).costs ?? [];
  const routes = (b as { routes?: BranchRoute[] }).routes ?? [];
  return (
    <section className="tl-branch">
      <h3>{head.title}</h3>
      {head.question ? <p className="tl-branch-q">{head.question}</p> : null}
      <p>{b.tends}</p>
      {costs.length || routes.length ? (
        <div className="tl-cost-and-route">
          {costs.length ? (
            <div className="tl-costs">
              <h4>What tends to be harder</h4>
              <ul>
                {costs.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {routes.length ? (
            <div className="tl-routes">
              {/* §5.7 (T-4): recovery sits beside every cost, in the same view. */}
              <h4>{quiet ? "Where the routes are" : "Routes from here"}</h4>
              <ul>
                {/* N-379 — the grade renders as the WORD beside the route, so a
                    route that is technically true and practically expensive
                    says so rather than reading as an open door. */}
                {routes.map((r, i) => {
                  const grade = routeGrade(r);
                  return (
                    <li key={i}>
                      {grade && (
                        <span
                          className="tl-route-grade"
                          data-tl-route-grade={grade}
                          title={ROUTE_GRADE_MEANING[grade]}
                        >
                          {ROUTE_GRADE_WORD[grade]}
                        </span>
                      )}
                      {routeText(r)}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
      {/* "Not doing this is a path, not a failure" is true of a degree and cruel
          about a bereavement. It renders only where a person chooses. */}
      {name === "never" && !suppressNeverLine ? (
        <p className="tl-never-line">
          Not doing this is a path, not a failure. Nothing on this timeline is a list of things a life
          has to contain.
        </p>
      ) : null}
      <p className="tl-stamp">Evidence: {EVIDENCE_LABEL_TEXT[b.evidence]}</p>
    </section>
  );
}

export default async function MilestonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = MILESTONES.find((x) => x.id === id) as Milestone | undefined;
  if (!m || (m as { major?: boolean }).major !== true) notFound();

  const sens = (m as { sensitivity?: string }).sensitivity;
  const quiet = Boolean(sens);
  const careNote = (m as { careNote?: string }).careNote;
  const readRef = (m as { readRef?: string }).readRef;
  const alsoRead: string[] = (m as { alsoRead?: string[] }).alsoRead ?? [];
  const analysis = (m as { analysis?: Record<string, Branch> }).analysis ?? {};
  const srcIds: string[] = (m as { sources?: string[] }).sources ?? [];
  const affects: string[] = (m as { affectsLater?: string[] }).affectsLater ?? [];
  const whatChanges: string[] = (m as { whatChanges?: string[] }).whatChanges ?? [];
  const rr = (m as { researchRequired?: boolean }).researchRequired === true;
  // A death is not something a reader was early or late at.
  const arrives = sens === "dying";
  const headings = arrives
    ? BRANCH_HEADING_ARRIVES
    : rr || !(m as { timing?: unknown }).timing
      ? BRANCH_HEADING_NO_WINDOW
      : BRANCH_HEADING;

  const anchorAge = (() => {
    const t = (m as { timing?: { exact?: number; window?: { from: number }; typical?: { from: number } | number; variesByState?: { from: number } } }).timing;
    if (!t) return undefined;
    if (t.exact !== undefined) return Math.floor(t.exact);
    // Year anchors are whole years. A median of 28.4 must link to #age-28, not to
    // an anchor that does not exist.
    if (t.variesByState) return Math.floor(t.variesByState.from);
    if (typeof t.typical === "number") return Math.floor(t.typical);
    if (t.typical && typeof t.typical === "object") return Math.floor(t.typical.from);
    if (t.window) return Math.floor(t.window.from);
    return undefined;
  })();

  return (
    <ReadingPage setDown={quiet}>
      <div className="tl-page">
        <p className="tl-crumb">
          <Link href="/timeline">The Timeline</Link>
          {anchorAge !== undefined ? (
            <>
              {" · "}
              <Link href={`/timeline#${yearAnchor(anchorAge)}`}>Back to this year on the spine</Link>
            </>
          ) : null}
        </p>

        <PageHeader
          eyebrow={LANE_LABEL[m.lane]}
          title={m.label}
          intro={rr ? undefined : `${KIND_LABEL[m.kind]} — ${KIND_STANDING_LINE[m.kind]}`}
          status={m.status}
        />

        {/* §5.3 — on a sensitive page the real route comes first, before the analysis.
            The flag sits on the WRAPPER so the care note is inside the flagged region;
            T-6 checks that a sensitive segment CONTAINS its care note. */}
        {quiet && readRef ? (
          <div {...{ [ATTR_SENSITIVE]: sens as string }}>
          <p className="tl-care-note" {...{ [ATTR_CARE_NOTE]: "1" }}>
            {careNote}{" "}
            <Link href={readRef} {...{ [ATTR_READ_REF]: readRef }}>
              The page written for this
            </Link>
            {alsoRead.map((r) => (
              <span key={r}>
                {" · "}
                <Link href={r} {...{ [ATTR_READ_REF]: r }}>
                  {r === "/situations/grief" ? "Grief and loss" : r === "/situations/a-death" ? "When someone dies" : r}
                </Link>
              </span>
            ))}
          </p>
          </div>
        ) : null}

        {sens === "child-development" ? (
          <>
            <p className="tl-care-note">{SCREENING_LINE}</p>
            <p className="tl-care-note">{VARIATION_LINE}</p>
          </>
        ) : null}

        <section className="tl-when-panel">
          <h2>When this commonly happens</h2>
          {rr ? (
            <p>
              {(m as { windowInWords?: string }).windowInWords} We have not found a source we can quote
              for it, so no age is shown here.
            </p>
          ) : (
            <p className="tl-when-big" {...{ [ATTR_AGE_CLAIM]: m.id, [ATTR_SOURCE]: srcIds.join(" ") }}>
              {windowText(m)}
            </p>
          )}
          <p className="tl-standing" {...{ [ATTR_KIND]: m.kind, [ATTR_STANDING_LINE]: "1" }}>
            {KIND_STANDING_LINE[m.kind]}
          </p>
          <dl className="tl-meta">
            {(m as { population?: string }).population ? (
              <>
                <dt>Population</dt>
                <dd>{(m as { population?: string }).population}</dd>
              </>
            ) : null}
            {(m as { measure?: keyof typeof MEASURE_LABEL }).measure ? (
              <>
                <dt>Measure</dt>
                <dd>{MEASURE_LABEL[(m as { measure: keyof typeof MEASURE_LABEL }).measure]}</dd>
              </>
            ) : null}
            <dt>Lane</dt>
            <dd>{LANE_LABEL[m.lane]}</dd>
          </dl>
          {whatChanges.length ? (
            <>
              <h3>What actually changes</h3>
              <ul>
                {whatChanges.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </>
          ) : null}
        </section>

        {Object.keys(analysis).length ? (
          <section>
            <h2>Timing</h2>
            <p>
              {arrives
                ? "What follows is practical, and it describes what tends to go with this in a population. None of it is a recommendation, none of it is about any particular person's life, and none of it is a judgement about anything anyone did or did not do."
                : "What follows describes what tends to go with each timing in a population. None of it is a recommendation, and none of it is about any particular person's life."}
            </p>
            <div className="tl-branches">
              {BRANCH_ORDER.filter((k) => analysis[k]).map((k) => (
                <BranchBlock
                  key={k}
                  name={k}
                  b={analysis[k] as Branch}
                  quiet={quiet}
                  headings={headings}
                  suppressNeverLine={arrives}
                />
              ))}
            </div>
          </section>
        ) : null}

        {srcIds.length ? (
          <section>
            <h2>Where these figures come from</h2>
            <details className={CLASS_EVIDENCE} open>
              <summary>Sources, with the sentence we read</summary>
              <div>
                {srcIds.map((sid) => {
                  const s = SOURCES[sid];
                  if (!s) return null;
                  return (
                    <div key={sid}>
                      <p className="tl-excerpt">&ldquo;{s.excerpt}&rdquo;</p>
                      <p>
                        <a href={s.url} rel="noreferrer noopener nofollow">
                          {s.title}
                        </a>{" "}
                        — {s.publisher}.{" "}
                        <span className="tl-stamp" {...{ [ATTR_STAMP]: s.id }}>
                          data {s.dataYear} · published {s.publicationYear} · checked {s.retrievedOn}
                          {/* N-386 — a source looking back says so beside its own stamp. */}
                          {s.timing === "retrospective" && (
                            <>
                              {" · "}
                              <span
                                className="tl-source-timing"
                                data-tl-source-timing="retrospective"
                                title={SOURCE_TIMING_MEANING.retrospective}
                              >
                                {SOURCE_TIMING_LABEL.retrospective}
                              </span>
                            </>
                          )}
                        </span>
                      </p>
                      <p className="tl-stamp">What it measured: {s.measures}</p>
                      {s.timing === "retrospective" && (
                        <p className="tl-stamp">{SOURCE_TIMING_MEANING.retrospective}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </details>
          </section>
        ) : null}

        <section>
          <h2>Where this frame fails</h2>
          <p>
            A window flattens variation by body, by family, by place and by luck. Two people at the same
            age inside the same window can be in situations that have almost nothing in common, and the
            window says nothing about which of them anything was available to. It also describes people
            who have already lived this stretch — it is a record, not a forecast.
          </p>
        </section>

        {affects.length ? (
          <section>
            <h2>What this touches later</h2>
            <ul>
              {affects.map((a) => {
                const other = MILESTONES.find((x) => x.id === a);
                if (!other) return null;
                const isMajor = (other as { major?: boolean }).major === true;
                // Dead text here cost the widowhood page its single most useful link.
                return (
                  <li key={a}>
                    {isMajor ? (
                      <Link href={`/timeline/${a}`}>{other.label}</Link>
                    ) : (
                      <Link href={`/timeline#${a}`}>{other.label}</Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <p className="tl-crumb">
          <Link href="/timeline">Back to the timeline</Link> ·{" "}
          <Link href="/methodology#timeline">How this was sourced</Link>
        </p>
      </div>
    </ReadingPage>
  );
}
