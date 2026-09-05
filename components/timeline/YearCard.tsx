/**
 * The year card (5.0 blueprint §3.5) — a SERVER component.
 *
 * Every year 0..100 renders here as real HTML, with milestone detail in native
 * <details> drawers, so the JS-disabled floor is the whole page (§3.2). The
 * client instrument enhances this document; it never owns content the HTML lacks.
 *
 * THE CARD IS COMPOSED ENTIRELY FROM RECORDS. There is no per-year prose field
 * anywhere in the content model, and the only sentences that are not record
 * fields are the enumerated templates below. That is what makes it impossible
 * for a year to carry an invented event (T-7).
 *
 * Sensitive records are pulled OUT of sections 2–4 and rendered in section 6
 * with the set-down register — Standard vocabulary in both editions, no game
 * chrome, a care note, and the real page. Those segments never call <Term>, so
 * no game label can reach them in any edition (§5.3, T-6).
 */
import Link from "next/link";
import {
  KIND_STANDING_LINE,
  KIND_LABEL,
  LANE_LABEL,
  MEASURE_LABEL,
  EVIDENCE_LABEL_TEXT,
  SCREENING_LINE,
  VARIATION_LINE,
  EARLY_INTERVENTION_LINE,
  EARLY_INTERVENTION_URL,
  EARLY_INTERVENTION_QUOTE,
  EARLY_INTERVENTION_PUBLISHER,
  SOURCE_TIMING_LABEL,
  SOURCE_TIMING_MEANING,
  emptyStateFor,
  type Milestone,
  type Source,
  type SourceId,
  type Stage,
} from "@/content/timeline/schema";
import { windowText, LANE_GLYPH, LANE_VAR } from "@/content/timeline/select";
import type { YearComposition } from "@/content/timeline/select";
import {
  ATTR_YEAR,
  ATTR_EMPTY,
  ATTR_YEAR_MILESTONES,
  ATTR_AGE_CLAIM,
  ATTR_SOURCE,
  ATTR_YEAR_HEADER,
  ATTR_STAMP,
  CLASS_EVIDENCE,
  ATTR_KIND,
  ATTR_STANDING_LINE,
  ATTR_HEARD,
  ATTR_SENSITIVE,
  ATTR_CARE_NOTE,
  ATTR_READ_REF,
  ATTR_RESEARCH_REQUIRED,
  ATTR_LANE,
  RESEARCH_REQUIRED_LABEL,
  yearAnchor,
} from "@/content/timeline/dom";

type Props = {
  comp: YearComposition;
  stage: Stage | undefined;
  /** Rendered at the stage's first year (§3.5 item 1). */
  stageIntro: boolean;
  sources: Record<SourceId, Source>;
  /** Milestone ids that have their own page. */
  majorIds: Set<string>;
  /** Every record by id, for consequence-chain link text. */
  allById?: Map<string, Milestone>;
  /**
   * The ONE year that owns each record's anchor.
   *
   * A state-varying rule is a "rule changes here" in every year of its range, so
   * naively setting id={m.id} in each of them emitted the same id four times and
   * made `#ms-age-of-majority` ambiguous. Each record gets its anchor once, in the
   * first year it appears in.
   */
  anchorYear?: Map<string, number>;
  /**
   * §5.4 — records that render in this stage's intro rather than on the spine.
   * Life expectancy is the reason this exists: it is a real sourced figure and it
   * is not a mark on anyone's timeline.
   */
  stageNotes?: Milestone[];
};

const isSensitive = (m: Milestone) => Boolean((m as { sensitivity?: string }).sensitivity);
const isChildDevelopment = (m: Milestone) =>
  (m as { sensitivity?: string }).sensitivity === "child-development";

/**
 * The two protective paragraphs every child-development record carries (§5.3).
 *
 * They are identical wherever they appear, because they are about the MATERIAL and
 * not about any one record: a population range is not a screening threshold, and
 * there is a publicly funded programme a family can call themselves. Rendered once
 * per record they stacked — age zero printed both of them twice inside a single
 * section — and a paragraph a reader has already read twice on the same screen
 * stops being read at all, which is the opposite of what a protective line is for.
 */
function ChildProtective() {
  return (
    <>
      <p className="tl-care-note tl-care-note--act">{SCREENING_LINE}</p>
      <p className="tl-care-note tl-care-note--act">
        {EARLY_INTERVENTION_LINE}{" "}
        <a href={EARLY_INTERVENTION_URL} rel="noreferrer noopener nofollow">
          How that programme describes itself
        </a>
        <span className="tl-stamp"> — {EARLY_INTERVENTION_PUBLISHER}: “{EARLY_INTERVENTION_QUOTE}”</span>
      </p>
    </>
  );
}
const isResearchRequired = (m: Milestone) => (m as { researchRequired?: boolean }).researchRequired === true;

/* ------------------------------------------------------------ the drawer */

function SourceStamp({ s }: { s: Source }) {
  return (
    <span className="tl-stamp" {...{ [ATTR_STAMP]: s.id }}>
      data {s.dataYear} · published {s.publicationYear} · checked {s.retrievedOn}
      {/* N-386 — a source that is looking back says so beside its stamp, in one
          word, so a reader can discount it without opening anything. */}
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
  );
}

function Evidence({ m, sources }: { m: Milestone; sources: Record<SourceId, Source> }) {
  const ids: SourceId[] = (m as { sources?: SourceId[] }).sources ?? [];
  const recs = ids.map((id) => sources[id]).filter(Boolean);
  return (
    <details className={CLASS_EVIDENCE}>
      <summary>Evidence and limits</summary>
      <div>
        <dl className="tl-meta">
          <dt>Label</dt>
          <dd>{EVIDENCE_LABEL_TEXT[m.evidence]}</dd>
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
          <dt>What would change this</dt>
          <dd>A newer release from the same source, or a source that measured a different population.</dd>
        </dl>
        {recs.map((s) => (
          <div key={s.id}>
            <p className="tl-excerpt">“{s.excerpt}”</p>
            <p>
              <a href={s.url} rel="noreferrer noopener nofollow">
                {s.title}
              </a>{" "}
              — {s.publisher}. <SourceStamp s={s} />
            </p>
            <p className="tl-stamp">What it measured: {s.measures}</p>
          </div>
        ))}
      </div>
    </details>
  );
}

function When({ m }: { m: Milestone }) {
  if (isResearchRequired(m)) {
    return (
      <span className="tl-not-sourced" {...{ [ATTR_RESEARCH_REQUIRED]: "1" }}>
        {RESEARCH_REQUIRED_LABEL}
      </span>
    );
  }
  const ids: SourceId[] = (m as { sources?: SourceId[] }).sources ?? [];
  return (
    <span
      className="tl-ms-when"
      {...{ [ATTR_AGE_CLAIM]: m.id, [ATTR_SOURCE]: ids.join(" ") }}
    >
      {windowText(m)}
    </span>
  );
}

/**
 * Section 4's line (§3.5 item 4), which the blueprint specifies as COMPACT:
 * "every window covering N (compact: label · lane · kind · the window)".
 *
 * This exists because rendering the full drawer in every year a window covers
 * produced 833 drawers and a 7.6 MB page — eight times §3.2's 1 MB budget. The
 * continuity of the timeline is what section 4 is for; the record's full entry,
 * with its evidence and its sources, lives once at its anchor year and this links
 * to it. Nothing is lost from the JS-off floor: the full body is still in the
 * document, once, as real HTML.
 */
function RunningLine({ m, anchored }: { m: Milestone; anchored: boolean }) {
  const sens = (m as { sensitivity?: string }).sensitivity;
  const ids: SourceId[] = (m as { sources?: SourceId[] }).sources ?? [];
  return (
    <div
      className={sens ? "tl-running tl-running--quiet" : "tl-running"}
      {...{ [ATTR_LANE]: m.lane }}
    >
      <span className="tl-lane-tag">
        <span aria-hidden="true" className={`tl-g--${m.lane}`}>
          {LANE_GLYPH[m.lane]}
        </span>
        {anchored ? <a href={`#${m.id}`}>{m.label}</a> : <span>{m.label}</span>}
      </span>
      <span className="tl-running-kind">{KIND_LABEL[m.kind]}</span>
      {isResearchRequired(m) ? (
        <span className="tl-not-sourced" {...{ [ATTR_RESEARCH_REQUIRED]: "1" }}>
          {RESEARCH_REQUIRED_LABEL}
        </span>
      ) : (
        // EVERY element carrying an age claim carries its sources. This was briefly
        // dropped from the compact lines to save page weight, and an adversarial
        // review was right to call that what it was: a §8 LITERAL assertion relaxed
        // to fit the content, which is the move §5.1 and §11 forbid. The bytes are
        // the cheaper thing to give up.
        <span className="tl-ms-when" {...{ [ATTR_AGE_CLAIM]: m.id, [ATTR_SOURCE]: ids.join(" ") }}>
          {windowText(m)}
        </span>
      )}
    </div>
  );
}

export function MilestoneLine({
  m,
  sources,
  majorIds,
  allById,
  quiet = false,
  sharedChildProtective = false,
}: {
  m: Milestone;
  sources: Record<SourceId, Source>;
  majorIds: Set<string>;
  /** Every record by id, so a consequence link can use the other record's own label. */
  allById?: Map<string, Milestone>;
  quiet?: boolean;
  /**
   * §5.3, review F5. The screening line and the early-intervention paragraph are
   * IDENTICAL on every child-development record, so a year holding several of them
   * printed the same two paragraphs several times over — at age zero, twice inside
   * one section. They are properties of the material, not of the record, so the
   * year card now renders them ONCE for its whole quiet section and sets this.
   * The per-record care note is not shared and never moves: it says what THIS
   * record is not, and T-6 requires one inside every sensitive segment.
   */
  sharedChildProtective?: boolean;
}) {
  const sens = (m as { sensitivity?: string }).sensitivity;
  const careNote = (m as { careNote?: string }).careNote;
  const readRef = (m as { readRef?: string }).readRef;
  const alsoRead: string[] = (m as { alsoRead?: string[] }).alsoRead ?? [];
  const whatChanges: string[] = (m as { whatChanges?: string[] }).whatChanges ?? [];
  const heard: string[] = (m as { heard?: string[] }).heard ?? [];
  const affects: string[] = (m as { affectsLater?: string[] }).affectsLater ?? [];

  const body = (
    <details
      className="tl-ms"
      {...{ [ATTR_LANE]: m.lane }}
      {...(sens ? {} : {})}
    >
      <summary>
        <span className="tl-ms-label">
          <span className="tl-lane-tag">
            <span aria-hidden="true" style={{ color: LANE_VAR[m.lane] }}>
              {LANE_GLYPH[m.lane]}
            </span>
            <span className="tl-ms-name">{m.label}</span>
          </span>
        </span>
        <When m={m} />
      </summary>
      <div className="tl-ms-body">
        <p className="tl-standing" {...{ [ATTR_KIND]: m.kind, [ATTR_STANDING_LINE]: "1" }}>
          {KIND_LABEL[m.kind]} — {KIND_STANDING_LINE[m.kind]}
        </p>

        {isResearchRequired(m) ? (
          <p>
            {(m as { windowInWords?: string }).windowInWords} We have not yet found a source we can
            quote for this, so no age is shown.
          </p>
        ) : null}

        {/* The reassuring context lives INSIDE the drawer; the care note and, on a
            child-development record, the line that says what to DO are outside it
            and visible at rest. See the wrapper below. */}
        {sens === "child-development" ? <p className="tl-care-note">{VARIATION_LINE}</p> : null}

        {whatChanges.length ? (
          <ul className="tl-list">
            {whatChanges.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        ) : null}

        {heard.length ? (
          <div className="tl-heard" {...{ [ATTR_HEARD]: m.id }}>
            {heard.map((h, i) => (
              <p className="tl-heard-line" key={i}>
                “{h}”
              </p>
            ))}
            <p className="tl-heard-standing">{KIND_STANDING_LINE["cultural-expectation"]}</p>
          </div>
        ) : null}

        <dl className="tl-meta">
          <dt>Lane</dt>
          <dd>{LANE_LABEL[m.lane]}</dd>
        </dl>

        {!isResearchRequired(m) ? <Evidence m={m} sources={sources} /> : null}

        <p className="tl-real-page">
          {readRef ? (
            <Link href={readRef} {...{ [ATTR_READ_REF]: readRef }}>
              {/* Do not promise a page that is not about this. /topics/health is an
                  adult self-management page; calling it "the page written for this"
                  on a child-development record was a claim the build did not keep. */}
              {sens === "child-development"
                ? "More about health on this site"
                : sens
                  ? "The page written for this"
                  : "Read more about this"}
            </Link>
          ) : null}
          {alsoRead.map((r) => (
            <span key={r}>
              {" · "}
              <Link href={r} {...{ [ATTR_READ_REF]: r }}>
                {r === "/situations/grief" ? "Grief and loss" : r === "/situations/a-death" ? "When someone dies" : r}
              </Link>
            </span>
          ))}
          {majorIds.has(m.id) ? (
            <>
              {" · "}
              <Link href={`/timeline/${m.id}`}>The whole picture on this</Link>
            </>
          ) : null}
        </p>

        {/* The consequence chain (§3.6). Link text is the OTHER RECORD'S OWN LABEL —
            deriving it by stripping the id prefix produced things like "the parental
            home", which is not what that record is called. */}
        {affects.length ? (
          <p className="tl-stamp">
            Affects later:{" "}
            {affects.map((a, i) => {
              const other = allById?.get(a);
              return (
                <span key={a}>
                  {i > 0 ? " · " : ""}
                  <a href={`#${a}`}>{other ? other.label : a}</a>
                </span>
              );
            })}
          </p>
        ) : null}
      </div>
    </details>
  );

  if (!sens) return body;

  /*
   * §5.3, and the reason this wrapper exists.
   *
   * The first build put the care note, the screening line and the variation line
   * INSIDE the <details>. The blueprint's guarantee that "every sensitive record
   * carries a care note" was then satisfied in the DOM and not in the reading: the
   * entire visible content of Age 2 was the row "Putting two words together — most
   * by 2", and every protective sentence was one click away behind a summary with
   * no disclosure affordance. A reader-persona pass — a parent of a two-year-old
   * who is not talking yet — reported concluding "my child is behind" from a card
   * that had not yet had a chance to say anything else.
   *
   * So: the care note is on the page at rest, and on a child-development record the
   * sentence that says what to DO is on the page at rest with it. The reassurance
   * moved inside. The order is now: the fact, then what it is not, then where to go.
   */
  return (
    <div className="tl-sensitive-block" {...{ [ATTR_SENSITIVE]: sens }}>
      {body}
      {careNote ? (
        <p className="tl-care-note" {...{ [ATTR_CARE_NOTE]: "1" }}>
          {careNote}
        </p>
      ) : null}
      {sens === "child-development" && !sharedChildProtective ? <ChildProtective /> : null}
    </div>
  );
}

/* -------------------------------------------------------------- the card */

/**
 * A sensitive record repeating in a year it covers.
 *
 * §5.3 puts a care note and the real page on EVERY sensitive record, and a compact
 * line that drops them is not acceptable — a reader-persona pass found fertility
 * material rendering bare in most of the years it covers. But repeating the FULL
 * entry, evidence drawer and every source excerpt included, took the document from
 * 767KB to 1,559KB and past §3.2's budget.
 *
 * So the split is by what the material is FOR. The protective part — the care note,
 * the action line, the route to the real page — repeats every time, because that is
 * the part a frightened reader needs wherever they land. The bibliographic part —
 * the excerpts, the stamps, the source list — lives once, at the record's anchor,
 * and this links to it. Nothing protective is behind a click; nothing is duplicated
 * two hundred times that a reader only ever needs once.
 */
function SensitiveRepeat({
  m,
  anchored,
  sharedChildProtective = false,
}: {
  m: Milestone;
  anchored: boolean;
  /** See MilestoneLine: rendered once for the section rather than once per record. */
  sharedChildProtective?: boolean;
}) {
  const sens = (m as { sensitivity?: string }).sensitivity as string;
  const careNote = (m as { careNote?: string }).careNote;
  const readRef = (m as { readRef?: string }).readRef;
  const alsoRead: string[] = (m as { alsoRead?: string[] }).alsoRead ?? [];
  const ids: SourceId[] = (m as { sources?: SourceId[] }).sources ?? [];
  return (
    <div className="tl-sensitive-block" {...{ [ATTR_SENSITIVE]: sens, [ATTR_LANE]: m.lane }}>
      <p className="tl-running">
        <span className="tl-lane-tag">
          <span aria-hidden="true" className={`tl-g--${m.lane}`}>
            {LANE_GLYPH[m.lane]}
          </span>
          {anchored ? <a href={`#${m.id}`}>{m.label}</a> : <span>{m.label}</span>}
        </span>
        <span className="tl-running-kind">{KIND_LABEL[m.kind]}</span>
        {isResearchRequired(m) ? (
          <span className="tl-not-sourced" {...{ [ATTR_RESEARCH_REQUIRED]: "1" }}>
            {RESEARCH_REQUIRED_LABEL}
          </span>
        ) : (
          <span className="tl-ms-when" {...{ [ATTR_AGE_CLAIM]: m.id, [ATTR_SOURCE]: ids.join(" ") }}>
            {windowText(m)}
          </span>
        )}
      </p>
      {careNote ? (
        <p className="tl-care-note" {...{ [ATTR_CARE_NOTE]: "1" }}>
          {careNote}
        </p>
      ) : null}
      {sens === "child-development" && !sharedChildProtective ? (
        <p className="tl-care-note tl-care-note--act">{SCREENING_LINE}</p>
      ) : null}
      <p className="tl-real-page">
        {readRef ? (
          <Link href={readRef} {...{ [ATTR_READ_REF]: readRef }}>
            {sens === "child-development" ? "More about health on this site" : "The page written for this"}
          </Link>
        ) : null}
        {alsoRead.map((r) => (
          <span key={r}>
            {" · "}
            <Link href={r} {...{ [ATTR_READ_REF]: r }}>
              {r === "/situations/grief" ? "Grief and loss" : r === "/situations/a-death" ? "When someone dies" : r}
            </Link>
          </span>
        ))}
        {anchored ? (
          <>
            {" · "}
            <a href={`#${m.id}`}>The full record and its sources</a>
          </>
        ) : null}
      </p>
    </div>
  );
}

export default function YearCard({ comp, stage, stageIntro, sources, majorIds, allById, anchorYear, stageNotes = [] }: Props) {
  const { age } = comp;
  const isAnchor = (m: Milestone) => anchorYear?.get(m.id) === age;
  const anchorId = (m: Milestone) => (isAnchor(m) ? m.id : undefined);
  const plain = (list: Milestone[]) => list.filter((m) => !isSensitive(m));
  const rules = plain(comp.rules);
  const begins = plain(comp.begins);
  const running = plain(comp.running);
  const heard = plain(comp.heard);
  const sensitive = comp.sensitive;
  // §5.3, review F5: shared once per section when this year has any of that material.
  const childProtective = sensitive.some(isChildDevelopment);

  // §3.5 item 7: the empty state fires when sections 2, 3 and 5 are empty.
  const empty = rules.length === 0 && begins.length === 0 && heard.length === 0 && sensitive.length === 0;

  return (
    <section
      className="tl-year"
      id={yearAnchor(age)}
      {...{
        [ATTR_YEAR]: String(age),
        [ATTR_YEAR_MILESTONES]: comp.all.map((m) => m.id).join(" "),
        ...(empty ? { [ATTR_EMPTY]: "1" } : {}),
      }}
      aria-labelledby={`h-${yearAnchor(age)}`}
    >
      <header className="tl-year-head">
        <h3 className="tl-year-n" id={`h-${yearAnchor(age)}`} {...{ [ATTR_YEAR_HEADER]: String(age) }}>
          Age {age}
        </h3>
        <p className="tl-year-stage">
          {stage ? `${stage.label} — ${stage.short}` : ""}
        </p>
      </header>

      {stageIntro && stage ? (
        <div className="tl-stage-intro">
          {stage.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {/* §5.4 — life expectancy renders ONCE, here, with its scope stated.
              It is not on the spine and it is not in any year card. */}
          {stageNotes.map((n) => (
            <div className="tl-stage-note" key={n.id} {...(n.sensitivity ? { [ATTR_SENSITIVE]: n.sensitivity } : {})}>
              <h4>{n.label}</h4>
              <p
                className="tl-stage-note-figure"
                {...{ [ATTR_AGE_CLAIM]: n.id, [ATTR_SOURCE]: ((n as { sources?: string[] }).sources ?? []).join(" ") }}
              >
                {windowText(n)}
              </p>
              {(n as { population?: string }).population ? (
                <p className="tl-stage-note-scope">{(n as { population?: string }).population}</p>
              ) : null}
              {(n as { careNote?: string }).careNote ? (
                <p className="tl-care-note" {...{ [ATTR_CARE_NOTE]: "1" }}>
                  {(n as { careNote?: string }).careNote}
                </p>
              ) : null}
              {((n as { whatChanges?: string[] }).whatChanges ?? []).map((w, i) => (
                <p key={i}>{w}</p>
              ))}
              <Evidence m={n} sources={sources} />
            </div>
          ))}
        </div>
      ) : null}

      {/*
        A record's FULL entry — drawer, evidence, sources — renders once, in the year
        that owns its anchor. In every other year it covers, the compact line points
        back to it. Rendering the full body in every covered year produced 833 drawers
        and a 7.6 MB page against §3.2's 1 MB budget; the continuity is what these
        sections are for, and the body is still in the document exactly once.
      */}
      {rules.length ? (
        <>
          <h4 className="tl-section-title">A rule changes at this age</h4>
          <ul className="tl-list">
            {rules.map((m) => (
              <li key={m.id} id={anchorId(m)}>
                {isAnchor(m) ? (
                  <MilestoneLine m={m} sources={sources} majorIds={majorIds} allById={allById} />
                ) : isSensitive(m) ? (
                  <SensitiveRepeat m={m} anchored />
                ) : (
                  <RunningLine m={m} anchored />
                )}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {begins.length ? (
        <>
          <h4 className="tl-section-title">Commonly begins around now</h4>
          <ul className="tl-list">
            {begins.map((m) => (
              <li key={m.id} id={anchorId(m)}>
                {isAnchor(m) ? (
                  <MilestoneLine m={m} sources={sources} majorIds={majorIds} allById={allById} />
                ) : isSensitive(m) ? (
                  <SensitiveRepeat m={m} anchored />
                ) : (
                  <RunningLine m={m} anchored />
                )}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {running.length ? (
        <>
          <h4 className="tl-section-title">Running through this year</h4>
          <ul className="tl-list tl-running-list">
            {running.map((m) => (
              <li key={m.id}>
                {isSensitive(m) ? (
                  <SensitiveRepeat m={m} anchored={anchorYear?.has(m.id) ?? false} />
                ) : (
                  <RunningLine m={m} anchored={anchorYear?.has(m.id) ?? false} />
                )}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {heard.length ? (
        <>
          <h4 className="tl-section-title">What gets said</h4>
          <ul className="tl-list">
            {heard.map((m) => (
              <li key={m.id} id={anchorId(m)}>
                {isAnchor(m) ? (
                  <MilestoneLine m={m} sources={sources} majorIds={majorIds} allById={allById} />
                ) : isSensitive(m) ? (
                  <SensitiveRepeat m={m} anchored />
                ) : (
                  <RunningLine m={m} anchored />
                )}
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {sensitive.length ? (
        <>
          <h4 className="tl-section-title">At this age, quietly</h4>
          <ul className="tl-list">
            {sensitive.map((m) => (
              <li key={m.id} id={anchorId(m)}>
                {isAnchor(m) ? (
                  <MilestoneLine
                    m={m}
                    sources={sources}
                    majorIds={majorIds}
                    allById={allById}
                    quiet
                    sharedChildProtective={childProtective}
                  />
                ) : isSensitive(m) ? (
                  <SensitiveRepeat m={m} anchored sharedChildProtective={childProtective} />
                ) : (
                  <RunningLine m={m} anchored />
                )}
              </li>
            ))}
          </ul>
          {/* Once for the section, after the records it applies to, in the order the
              per-record version used: the fact, then what it is not, then where to
              go. Every record above still carries its own care note. */}
          {childProtective ? (
            <div className="tl-care-shared">
              {/* NOT marked data-tl-sensitive: this is a section-level note, not a
                  record segment, and T-6's rule that every sensitive segment carries
                  its own care note must keep meaning what it says. */}
              <ChildProtective />
            </div>
          ) : null}
        </>
      ) : null}

      {/* The honest empty state names its own year, so the numeral in it is a
          year reference exactly like the header's — marked as one, not exempted. */}
      {empty ? (
        <p className="tl-empty" {...{ [ATTR_YEAR_HEADER]: String(age) }}>
          {emptyStateFor(age)}
        </p>
      ) : null}
    </section>
  );
}
