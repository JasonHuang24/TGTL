"use client";
/**
 * The instrument (5.0 blueprint §3.6) — the drawn, scrubbable spine.
 *
 * THIS COMPONENT OWNS NO CONTENT. Every year and every milestone is already in
 * the server-rendered document (§3.2); this draws the spine over it, moves a
 * cursor, filters lanes and switches the lens. With JavaScript off, the page is
 * complete without it — that is the floor, and this is the instrument.
 *
 * The graphical floor (§3.6, never cuttable): the spine is drawn, spans and
 * ticks are drawn, lanes are drawn, the cursor scrubs. A list of years with
 * headings is the JS-off floor, not the instrument.
 *
 * Nothing here computes anything about the reader (T-5). The selected age
 * reaches exactly four places — scroll, focus, aria-current, and the one stored
 * view key — and no sentence anywhere is templated from it.
 *
 * THE STICKY RULE (blueprint errata 13.4, review F1). While any part of this is
 * sticky it is never taller than the viewport. The first build kept the whole
 * instrument sticky at every width; below the breakpoint the spine becomes a
 * vertical rail 2,772px tall at 375x812, and a sticky box that size does not
 * enhance the page, it covers it — every year card sat behind it at every scroll
 * position. So below the breakpoint the instrument itself does NOT stick: it
 * splits, and the part that sticks is a compact strip carrying the cursor in the
 * form a phone can use (the age select) plus the density and view chips. The rail
 * stays where it is legible — in the flow, in a bounded, marked scroll region.
 * T-14 asserts both halves of this against `elementFromPoint`, not against the CSS.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LANES,
  LANE_LABEL,
  MAX_AGE,
  NAVIGATION_CONVENTION_LINE,
  type Lane,
} from "@/content/timeline/schema";
import { StageFigure } from "./StageFigures";
import { LANE_GLYPH, LANE_VAR, spellCount, type Span } from "@/content/timeline/select";
import {
  STORAGE_KEY,
  ATTR_CURSOR,
  ATTR_LENS,
  ATTR_AGE_CLAIM,
  ATTR_SOURCE,
  ATTR_YEAR_HEADER,
  ATTR_STAGE_BAND,
  yearAnchor,
} from "@/content/timeline/dom";

type Zoom = "life" | "stage" | "year";
type Lens = "shared" | "female" | "male";

type Band = {
  id: string;
  label: string;
  shortLabel: string;
  from: number;
  to: number;
};

type Props = {
  spans: Span[];
  bands: Band[];
  /** The TRUE number of records carrying a sourced sex-lens divergence (T-9). */
  divergingCount: number;
  /** Ids of records that carry a bySex divergence, so the lens can mark them. */
  divergingIds: string[];
};

type View = { age: number; lens: Lens; lanes: Lane[]; zoom: Zoom };

const DEFAULT_VIEW: View = { age: 0, lens: "shared", lanes: [...LANES], zoom: "life" };

function readView(): View {
  if (typeof window === "undefined") return DEFAULT_VIEW;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_VIEW;
    const p = JSON.parse(raw) as Partial<View>;
    const age = typeof p.age === "number" && p.age >= 0 && p.age <= MAX_AGE ? Math.floor(p.age) : 0;
    const lens: Lens = p.lens === "female" || p.lens === "male" ? p.lens : "shared";
    const zoom: Zoom = p.zoom === "stage" || p.zoom === "year" ? p.zoom : "life";
    const lanes = Array.isArray(p.lanes) ? (p.lanes.filter((l) => (LANES as string[]).includes(l)) as Lane[]) : [...LANES];
    return { age, lens, lanes: lanes.length ? lanes : [...LANES], zoom };
  } catch {
    return DEFAULT_VIEW;
  }
}

/**
 * An advance width, in viewBox units, for one character of the 9px band label.
 *
 * Deliberately generous: the cost of over-estimating is a label the instrument
 * declines to draw, and the cost of under-estimating is two labels on top of each
 * other, which is the defect this replaces (review F3a). Measured against every
 * label and short label the stages actually carry, this over-estimates all of
 * them — and T-14 measures the DRAWN bounding boxes at 1280px and goes red on any
 * intersection, so a future stage name that breaks the estimate is caught by a
 * measurement rather than trusted to it.
 */
const BAND_CHAR_W = 4.9;
const BAND_LABEL_PAD = 8;

const LANE_H = 13;
const BAND_H = 15;
const AXIS_H = 16;
const PAD = 6;

export default function TimelineInstrument({ spans, bands, divergingCount, divergingIds }: Props) {
  const [view, setView] = useState<View>(DEFAULT_VIEW);
  const [hydrated, setHydrated] = useState(false);
  const [vertical, setVertical] = useState(false);
  const cursorRef = useRef<SVGGElement | null>(null);
  const diverging = useMemo(() => new Set(divergingIds), [divergingIds]);
  // How many diverging records are actually DRAWN — a record excluded from the spine
  // (a stage-intro note, say) cannot be marked by the lens however it is flagged.
  const drawnDivergences = useMemo(
    () => spans.filter((sp) => diverging.has(sp.id)).length,
    [spans, diverging],
  );

  /* restore the stored view; never read on the server, so the static HTML is
     identical for everyone (§3.7) */
  useEffect(() => {
    setView(readView());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(view));
    } catch {
      /* storage can be unavailable; the instrument still works */
    }
  }, [view, hydrated]);

  /* orientation: below 768px the spine becomes a vertical rail (§3.6). The
     server always renders horizontal, so there is no hydration mismatch. */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 47.99rem)");
    const sync = () => setVertical(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* the selected age reaches scroll, focus and aria-current — and nothing else */
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

  useEffect(() => {
    if (!hydrated) return;
    for (const el of Array.from(document.querySelectorAll("[data-tl-year]"))) {
      el.removeAttribute("aria-current");
    }
    const target = document.getElementById(yearAnchor(view.age));
    if (target) target.setAttribute("aria-current", "true");
  }, [view.age, hydrated]);

  const goTo = useCallback(
    (age: number, scroll: boolean) => {
      const next = Math.max(0, Math.min(MAX_AGE, age));
      setView((v) => ({ ...v, age: next }));
      if (scroll) {
        const target = document.getElementById(yearAnchor(next));
        target?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    },
    [reduceMotion],
  );

  /* lane filtering drives the server-rendered cards through one attribute on the
     root, so the client never re-renders content it does not own */
  useEffect(() => {
    if (!hydrated) return;
    const off = LANES.filter((l) => !view.lanes.includes(l));
    const root = document.querySelector(".tl-page");
    if (root) root.setAttribute("data-tl-lanes-off", off.join(" "));
  }, [view.lanes, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.querySelector(".tl-page");
    if (root) root.setAttribute(ATTR_LENS, view.lens);
  }, [view.lens, hydrated]);

  /* ---- geometry ---- */

  const stageOf = (age: number) => bands.find((b) => age >= b.from && age <= b.to);

  const domain: [number, number] = useMemo(() => {
    if (view.zoom === "life") return [0, MAX_AGE];
    if (view.zoom === "stage") {
      const b = stageOf(view.age);
      return b ? [b.from, b.to] : [0, MAX_AGE];
    }
    return [Math.max(0, view.age - 5), Math.min(MAX_AGE, view.age + 5)];
    // zooming never changes content, only density (§3.6)
  }, [view.zoom, view.age, bands]);

  const visibleLanes = LANES.filter((l) => view.lanes.includes(l));
  const laneIndex = new Map(visibleLanes.map((l, i) => [l, i]));

  const AXIS_LEN = 1000;
  const lanesLen = visibleLanes.length * LANE_H;
  const crossLen = BAND_H + lanesLen + AXIS_H;

  const pos = (age: number) => {
    const [lo, hi] = domain;
    const span = Math.max(1, hi - lo);
    return PAD + ((age - lo) / span) * AXIS_LEN;
  };
  const inDomain = (a: number) => a >= domain[0] && a <= domain[1];

  const W = vertical ? crossLen + PAD * 2 : AXIS_LEN + PAD * 2;
  const H = vertical ? AXIS_LEN + PAD * 2 : crossLen + PAD * 2;

  /** main axis coordinate -> x/y depending on orientation */
  const xy = (mainPos: number, cross: number): { x: number; y: number } =>
    vertical ? { x: cross, y: mainPos } : { x: mainPos, y: cross };

  const onKey = (e: React.KeyboardEvent) => {
    const b = stageOf(view.age);
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = view.age + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = view.age - 1;
    else if (e.key === "PageDown") next = b ? Math.min(MAX_AGE, b.to + 1) : view.age + 10;
    else if (e.key === "PageUp") next = b ? Math.max(0, b.from - 1) : view.age - 10;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = MAX_AGE;
    if (next === null) return;
    e.preventDefault();
    goTo(next, true);
  };

  const toggleLane = (l: Lane) =>
    setView((v) => ({
      ...v,
      // never lose the reader's place: filtering hides lanes, it does not move the cursor
      lanes: v.lanes.includes(l) ? v.lanes.filter((x) => x !== l) : [...v.lanes, l],
    }));

  const cursorPos = pos(Math.max(domain[0], Math.min(domain[1], view.age)));
  const bandCross = PAD;
  const laneCross = (i: number) => PAD + BAND_H + i * LANE_H + LANE_H / 2;

  /* The lane filter. Stays with the rail it filters, at every width. */
  const laneControls = (
    <div className="tl-controls-lanes">
      <p className="tl-lens-note" id="tl-lane-label">
        Lanes — showing {spellCount(visibleLanes.length)} of {spellCount(LANES.length)}
      </p>
      <ul className="tl-chiprow" aria-labelledby="tl-lane-label">
        {LANES.map((l) => (
          <li key={l}>
            <button
              type="button"
              className="tl-chip"
              aria-pressed={view.lanes.includes(l)}
              onClick={() => toggleLane(l)}
            >
              <span className="tl-chip-glyph" style={{ background: LANE_VAR[l] }} aria-hidden="true" />
              <span aria-hidden="true">{LANE_GLYPH[l]}</span>
              {LANE_LABEL[l]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  /* The cursor in the form a keyboard and a phone can use, the density chips and
     the view chips. On a narrow screen THIS is the strip that sticks; on a wide
     one it sits in the instrument's second column exactly as before. */
  const viewControls = (
    <div className="tl-controls-view">
      <div className="tl-scrub">
        <label htmlFor="tl-age-select">Year</label>
        <select
          id="tl-age-select"
          value={view.age}
          onChange={(e) => goTo(Number(e.target.value), true)}
          /* This control IS the year axis, in the form assistive tech and a
             keyboard can use (§3.7). Its option labels are year headers in
             exactly the sense T-1 means, so it is marked as one. It selects
             a VIEW POSITION and reaches nothing but scroll, focus,
             aria-current and the stored view key. */
          {...{ [ATTR_CURSOR]: "select", [ATTR_YEAR_HEADER]: "select" }}
        >
          {Array.from({ length: MAX_AGE + 1 }, (_, a) => (
            <option key={a} value={a}>
              Age {a}
            </option>
          ))}
        </select>
      </div>

      <p className="tl-lens-note" id="tl-zoom-label">
        Density
      </p>
      <ul className="tl-chiprow" aria-labelledby="tl-zoom-label">
        {(["life", "stage", "year"] as Zoom[]).map((z) => (
          <li key={z}>
            <button
              type="button"
              className="tl-chip"
              aria-pressed={view.zoom === z}
              onClick={() => setView((v) => ({ ...v, zoom: z }))}
            >
              {z === "life" ? "Whole life" : z === "stage" ? "One stage" : "Around this year"}
            </button>
          </li>
        ))}
      </ul>

      <p className="tl-lens-note" id="tl-lens-label">
        View
      </p>
      <ul className="tl-chiprow" aria-labelledby="tl-lens-label">
        {(["shared", "female", "male"] as Lens[]).map((l) => (
          <li key={l}>
            <button
              type="button"
              className="tl-chip"
              aria-pressed={view.lens === l}
              onClick={() => setView((v) => ({ ...v, lens: l }))}
            >
              {l === "shared" ? "Shared" : l === "female" ? "Female" : "Male"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      {/* THE COMPACT STRIP (review F1). Rendered only at the width where the rail
          goes vertical, so the server's HTML — and therefore the JS-off floor —
          is byte-identical to what it was, and there is never a second
          #tl-age-select in the document. */}
      {vertical ? (
        <div
          className="tl-strip tl-surface"
          role="group"
          aria-label="The timeline controls"
          data-scroll-region="y"
        >
          {viewControls}
        </div>
      ) : null}
      <div
        className="tl-instrument tl-surface"
        role="group"
        aria-label="The timeline instrument"
        /* Bounded and scrollable exactly where it is sticky. Below the breakpoint
           it is neither, and marking a box that does not scroll would make S-9's
           scroll-region audit vacuous. */
        {...(vertical ? {} : { "data-scroll-region": "y" })}
      >
        {/* THE STAGE RAIL (review F3b).

            Eight stages in order, each an authored figure, its name and its band,
            and each a control that moves the cursor to the band's first year. It
            is the label layer for the spine below it and the first thing on the
            page that looks like a life rather than a chart.

            It CLAIMS NOTHING, and neither does the art: a stage band is a
            navigation convention (§3.3), which is exactly why it is the only age
            on this page with no source attached, and the note under the rail says
            so in the same words the how-to-read block uses. */}
        <div className="tl-stage-rail-wrap">
          <ol className="tl-stage-rail" aria-label="The eight stages, in order">
            {bands.map((b) => {
              const here = view.age >= b.from && view.age <= b.to;
              return (
                <li key={b.id}>
                  <button
                    type="button"
                    className="tl-bubble"
                    aria-current={here ? "true" : undefined}
                    onClick={() => goTo(b.from, true)}
                  >
                    <span className="tl-bubble-art">
                      <StageFigure stageId={b.id} />
                    </span>
                    <span className="tl-bubble-label">{b.label}</span>
                    <span className="tl-bubble-band" {...{ [ATTR_STAGE_BAND]: b.id }}>
                      {b.from}&ndash;{b.to}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="tl-rail-note">
            Stage names are {NAVIGATION_CONVENTION_LINE}. Choosing one moves the cursor to the first
            year of its band; it does not filter anything away.
          </p>
        </div>

        {/* The rail lives in a bounded, marked scroll region at narrow widths: a
            vertical rail needs vertical room to be legible, so the fix for "it is
            too tall" is to bound where it scrolls rather than to shrink it into a
            smear. */}
        <div className="tl-rail" {...(vertical ? { "data-scroll-region": "y" } : {})}>
      <svg
        className="tl-spine"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`The lifespan from birth to ${MAX_AGE}, drawn as lanes of windows with legal thresholds marked. The same information is in the year sections below.`}
      >
        {/* stage bands.

            A band prints the LONGEST form that fits inside its own drawn extent —
            the full name, then the short name, and if neither fits, the stage's
            number, which always does. Because a drawn label can never be wider
            than the band it belongs to, and the bands do not overlap, two labels
            cannot collide: that is a property of the geometry rather than of the
            particular strings, so it survives renaming a stage. Every band also
            carries its full name as a <title>, and the rail above prints all eight
            in full at rest, so the two narrow bands at the start of a life are
            identifiable even where the spine has no room to say so. */}
        {bands.map((b, i) => {
          const a = pos(Math.max(b.from, domain[0]));
          const z = pos(Math.min(b.to, domain[1]));
          if (b.to < domain[0] || b.from > domain[1]) return null;
          const len = Math.max(0, z - a);
          const r = vertical
            ? { x: bandCross, y: a, width: BAND_H, height: len }
            : { x: a, y: bandCross, width: len, height: BAND_H };
          const room = len - BAND_LABEL_PAD;
          const fits = (t: string) => t.length * BAND_CHAR_W <= room;
          // NO FALLBACK TO A NUMBER. A bare "4" drawn over the band that runs from
          // twelve to seventeen is a digit on a page about ages, and the one thing
          // it must not be read as is an age. Where no name fits, the band is
          // identified by the rail directly above it, by its own <title>, by the
          // band key under the instrument, and by lighting up while the cursor is
          // inside it — none of which can be mistaken for a claim about a year.
          const drawn = vertical ? null : fits(b.label) ? b.label : fits(b.shortLabel) ? b.shortLabel : null;
          const here = view.age >= b.from && view.age <= b.to;
          return (
            <g key={b.id}>
              <rect
                className={
                  (i % 2 ? "tl-band tl-band--alt" : "tl-band") + (here ? " tl-band--here" : "")
                }
                {...r}
              />
              {drawn ? (
                <text
                  className="tl-band-label"
                  x={a + 4}
                  y={bandCross + BAND_H - 4}
                  {...{ [ATTR_STAGE_BAND]: b.id }}
                >
                  {drawn}
                </text>
              ) : null}
              {/* The band's ages live here too, so the marker T-1 exempts by type
                  has to be on the title as well as on the drawn label — a stage
                  band is a navigation convention wherever it prints its ages. */}
              <title {...{ [ATTR_STAGE_BAND]: b.id }}>{`${b.label}, ${b.from} to ${b.to} — a stage band, ${NAVIGATION_CONVENTION_LINE}`}</title>
            </g>
          );
        })}

        {/* lanes: one row each, drawn as a rule so an empty lane still reads */}
        {visibleLanes.map((l, i) => {
          const c = laneCross(i);
          const p1 = xy(PAD, c);
          const p2 = xy(PAD + AXIS_LEN, c);
          return (
            <line
              key={l}
              className="tl-spine-axis"
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              opacity={0.35}
            />
          );
        })}

        {/* spans and ticks */}
        {spans.map((s) => {
          const i = laneIndex.get(s.lane);
          if (i === undefined) return null;
          const c = laneCross(i);
          const marked = view.lens !== "shared" && diverging.has(s.id);

          if (s.tick !== undefined) {
            if (!inDomain(s.tick)) return null;
            const p = pos(s.tick);
            const a = xy(p, c - 4.5);
            const b = xy(p, c + 4.5);
            return (
              <g key={s.id} {...{ [ATTR_AGE_CLAIM]: s.id, [ATTR_SOURCE]: s.sources.join(" ") }}>
                <line
                  className="tl-tick"
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={s.sensitive ? "var(--tl-muted)" : undefined}
                />
                <title>{`${s.label} — ${s.when}`}</title>
              </g>
            );
          }

          if (s.from === undefined || s.to === undefined) return null;
          if (s.to < domain[0] || s.from > domain[1]) return null;
          const a = pos(Math.max(s.from, domain[0]));
          const z = pos(Math.min(s.to, domain[1]));
          const len = Math.max(1.5, z - a);
          const thickness = marked ? 7 : 5;
          const outer = vertical
            ? { x: c - thickness / 2, y: a, width: thickness, height: len }
            : { x: a, y: c - thickness / 2, width: len, height: thickness };

          const tf = s.typicalFrom ?? s.from;
          const tt = s.typicalTo ?? s.to;
          const ta = pos(Math.max(tf, domain[0]));
          const tz = pos(Math.min(tt, domain[1]));
          const tlen = Math.max(1.5, tz - ta);
          const inner = vertical
            ? { x: c - thickness / 2, y: ta, width: thickness, height: tlen }
            : { x: ta, y: c - thickness / 2, width: tlen, height: thickness };

          const fill = s.sensitive ? "var(--tl-muted)" : LANE_VAR[s.lane];
          return (
            <g key={s.id} {...{ [ATTR_AGE_CLAIM]: s.id, [ATTR_SOURCE]: s.sources.join(" ") }}>
              {/* the tails: softer */}
              <rect className="tl-span-tail" {...outer} fill={fill} rx={2} />
              {/* the typical zone: denser. A range, drawn rather than said. */}
              <rect className="tl-span-typical" {...inner} fill={fill} rx={2} />
              <title>{`${s.label} — ${s.when}`}</title>
            </g>
          );
        })}

        {/* per-year hit areas for pointer use (not tab stops: the cursor is the control) */}
        {Array.from({ length: MAX_AGE + 1 }, (_, age) => age)
          .filter(inDomain)
          .map((age) => {
            const p = pos(age);
            const step = AXIS_LEN / Math.max(1, domain[1] - domain[0]);
            const r = vertical
              ? { x: PAD, y: p - step / 2, width: crossLen, height: step }
              : { x: p - step / 2, y: PAD, width: step, height: crossLen };
            return (
              <rect
                key={age}
                className="tl-year-hit"
                {...r}
                onClick={() => goTo(age, true)}
                aria-hidden="true"
              />
            );
          })}

        {/* the axis */}
        {(() => {
          const c = PAD + BAND_H + lanesLen + AXIS_H / 2;
          const p1 = xy(PAD, c);
          const p2 = xy(PAD + AXIS_LEN, c);
          const ticks: number[] = [];
          const stepEvery = domain[1] - domain[0] > 40 ? 10 : domain[1] - domain[0] > 12 ? 5 : 1;
          for (let a = Math.ceil(domain[0] / stepEvery) * stepEvery; a <= domain[1]; a += stepEvery) ticks.push(a);
          return (
            <g {...{ [ATTR_YEAR_HEADER]: "axis" }}>
              <line className="tl-spine-axis" x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />
              {ticks.map((a) => {
                const p = pos(a);
                const t = xy(p, c + (vertical ? 0 : 9));
                return (
                  <text
                    key={a}
                    className="tl-band-label"
                    x={vertical ? c + 12 : t.x}
                    y={vertical ? p + 3 : t.y}
                    textAnchor={vertical ? "start" : "middle"}
                  >
                    {a}
                  </text>
                );
              })}
            </g>
          );
        })()}

        {/* the cursor — a real focusable control */}
        <g
          ref={cursorRef}
          className="tl-cursor-group"
          tabIndex={0}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={MAX_AGE}
          aria-valuenow={view.age}
          aria-valuetext={`Age ${view.age}`}
          aria-label="Move through the years"
          onKeyDown={onKey}
        >
          {(() => {
            const a = xy(cursorPos, PAD);
            const b = xy(cursorPos, PAD + crossLen);
            return (
              <>
                <line className="tl-cursor" x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
                <circle className="tl-cursor-head" cx={a.x} cy={a.y} r={3.5} />
              </>
            );
          })()}
        </g>
      </svg>
        </div>

      <div className="tl-controls">
          {laneControls}
          {/* On a narrow screen these have moved into the sticky strip above, so
              there is exactly one of each control in the document at any width. */}
          {vertical ? null : viewControls}
        </div>
      </div>

      {/* The lens note sits UNDER the instrument rather than inside it. It is prose
          about a control, not a control, and inside the panel it was the part that
          fell off the bottom of a bounded sticky box — a sentence explaining that a
          switch does nothing is a poor sentence to have to scroll for. On paper it
          uses the reading sheet's ink rather than the atlas panel's. */}
      <p className="tl-view-note">
        {drawnDivergences === 0
          ? divergingCount === 0
            ? "No record on this timeline carries a difference by sex that a source stated it measured, so the View control above is the same either way. It is here because the data is what is missing, not the question."
            : `${spellCount(divergingCount)} record${divergingCount === 1 ? "" : "s"} in the content ${divergingCount === 1 ? "carries" : "carry"} a sourced difference by sex, and ${divergingCount === 1 ? "it does" : "they do"} not render on the spine, so the View control above is currently the same either way. A divergence renders only where a source stated what it measured.`
          : `${spellCount(drawnDivergences)} record${drawnDivergences === 1 ? "" : "s"} on the spine ${drawnDivergences === 1 ? "diverges" : "diverge"} by sex, and only where a source stated what it measured. Everything else is shared.`}
      </p>
    </>
  );
}
