"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useGuide } from "@/lib/guide-context";
import { Term } from "@/components/Term";
import {
  STAGES,
  DOMAINS,
  BRANCHES,
  CONTEXT_BREADCRUMB,
  stageIndex,
} from "@/content/roadmap";
import { STORAGE_KEYS, readJSON, writeJSON } from "@/lib/storage";
import { STAGES_TL } from "@/content/timeline/stages";

type SexLens = "shared" | "female" | "male";
type Saved = { stageId?: string; sexLens?: SexLens };

/**
 * The whole-life roadmap (§6.3). An age spine of eight overlapping stages across
 * parallel domain tracks, a selected-stage card, a structural male/female lens
 * (no invented sex-specific claims), and a context breadcrumb. Launch and the
 * credential branch open deep pages. The initial (server-rendered) view already
 * shows a real stage card and the deep-dive links, so the JS-off floor holds.
 */
/**
 * Where each stage begins on the timeline (5.0 §3.10). Derived from the timeline's
 * own stage list, so the map and the timeline cannot disagree about where a stage
 * starts. The bands are navigation conventions and claim nothing (§3.3).
 */
const TIMELINE_BAND_START: Record<string, number> = Object.fromEntries(
  STAGES_TL.map((st) => [st.id, st.ageBand[0]]),
);

export function Roadmap() {
  const { edition } = useGuide();
  const [stageId, setStageId] = useState<string>("stage-launch");
  const [sexLens, setSexLens] = useState<SexLens>("shared");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = readJSON<Saved>(STORAGE_KEYS.roadmap, {});
    if (saved.stageId && STAGES.some((s) => s.id === saved.stageId)) setStageId(saved.stageId);
    if (saved.sexLens) setSexLens(saved.sexLens);
    setHydrated(true);
    const onReset = () => {
      setStageId("stage-launch");
      setSexLens("shared");
    };
    window.addEventListener("tgtl:reset", onReset);
    return () => window.removeEventListener("tgtl:reset", onReset);
  }, []);

  useEffect(() => {
    if (hydrated) writeJSON(STORAGE_KEYS.roadmap, { stageId, sexLens });
  }, [stageId, sexLens, hydrated]);

  const stage = STAGES.find((s) => s.id === stageId) ?? STAGES[0];
  const selected = stageIndex(stageId);

  return (
    <div className="roadmap">
      <div className="roadmap-context">
        <span className="roadmap-breadcrumb">{CONTEXT_BREADCRUMB}</span>
        <div className="roadmap-lens" role="group" aria-label="Roadmap lens">
          <span className="roadmap-lens-label">Roadmap</span>
          {(["shared", "female", "male"] as SexLens[]).map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={sexLens === l}
              onClick={() => setSexLens(l)}
              className="lens-button"
            >
              {l === "shared" ? "Shared" : l === "female" ? "Female" : "Male"}
            </button>
          ))}
        </div>
      </div>
      {/* N-160 (C-5). The old note said "this lens changes no claims", which left
          the reader to decide whether the guide had checked and found nothing. It
          had not checked. Say which it is. */}
      {sexLens !== "shared" && (
        <p className="roadmap-lens-note">
          No sex-linked difference has been researched for the windows on this map. That is an absence of
          research and not a finding that there is none, so this control changes nothing below it — and it
          will keep changing nothing until a sourced difference exists.
        </p>
      )}

      <ol className="stage-spine" aria-label="Life stages">
        {STAGES.map((s, i) => {
          const isBranchHere = BRANCHES.some((b) => b.nearStage === s.id);
          return (
            <li key={s.id} className="stage-spine-item">
              <button
                type="button"
                className={`stage-node${i === selected ? " is-selected" : ""}`}
                aria-current={i === selected ? "step" : undefined}
                onClick={() => setStageId(s.id)}
              >
                <span className="stage-node-index" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="stage-node-label">{edition === "game" ? s.gameLabel : s.label}</span>
                <span className="stage-node-short">{s.short}</span>
              </button>
              {isBranchHere &&
                BRANCHES.filter((b) => b.nearStage === s.id).map((b) => (
                  <Link key={b.id} href={b.href} className="branch-node">
                    <span className="branch-node-mark" aria-hidden="true">
                      ⌥
                    </span>
                    {b.label}
                    <small>{b.short}</small>
                  </Link>
                ))}
            </li>
          );
        })}
      </ol>

      <div className="roadmap-body">
        <section className="stage-card panel" aria-live="polite">
          <p className="eyebrow">
            Selected <Term k="stage" define /> · {stage.short}
          </p>
          <h2>{edition === "game" ? stage.gameLabel : stage.label}</h2>
          {stage.deepLink ? (
            <>
              <p>
                This stage is developed as its own page: agency rising but resource-gated, what compounds
                from here and what does not, how it differs by position, and the routes back if a first
                launch does not go to plan.
              </p>
              <Link className="stage-deep-link" href={stage.deepLink.href}>
                {stage.deepLink.label} →
              </Link>
            </>
          ) : (
            stage.card.map((para, i) => <p key={i}>{para}</p>)
          )}
          {/* 5.0 §3.10 — the map is the stage overview; the timeline is the year
              layer. One quiet sentence each way, and a link into this stage's first
              year. The map's cards are unchanged: still no ages on them. */}
          <p className="stage-year-link">
            This map shows the stages. The timeline goes through them one year at a time.{" "}
            <Link href={`/timeline#age-${TIMELINE_BAND_START[stage.id] ?? 0}`}>
              Year by year &rarr;
            </Link>
          </p>
        </section>

        <section className="domain-tracks panel" aria-label="Parallel domains">
          <p className="eyebrow">Parallel tracks</p>
          <p className="domain-tracks-note">
            A life is not a single ladder. These run at once and at different rates — one can climb while
            another stalls. The bars are illustrative shape, not a schedule.
          </p>
          <ul>
            {DOMAINS.map((d, i) => (
              <li key={d.id} className="domain-track">
                <span className="domain-track-label">{edition === "game" ? d.gameLabel : d.label}</span>
                <span className="domain-track-bar" aria-hidden="true">
                  <span
                    className="domain-track-fill"
                    style={{
                      left: `${Math.max(0, selected * 10 - 8 + i * 2)}%`,
                      width: `${28 + ((i * 7) % 34)}%`,
                    }}
                  />
                </span>
                <span className="domain-track-desc">{d.note}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
