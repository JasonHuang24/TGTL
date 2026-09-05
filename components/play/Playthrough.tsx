"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGuide } from "@/lib/guide-context";
import {
  GAUGE_KEYS,
  GAUGE_LABEL,
  GAUGE_BAND_ORDER,
  SPREAD_MEANING,
  OUTCOME_BAND_LABEL,
  type GaugeKey,
} from "@/content/bands";
import type {
  RunState,
  DecisionCard,
  Option,
  ScriptedBeat,
  WinWeights,
  LeaningKey,
} from "@/content/play/schema";
import {
  initRun,
  withPhase,
  setWinWeights,
  setLeaning,
  acceptHand,
  currentSlot,
  selectCard,
  commitDecision,
  commitWatched,
  commitBeat,
  computeParse,
  type ParseSummary,
} from "@/lib/engine/run";
import { strip, type Resolution } from "@/lib/engine/resolve";
import { drawHand } from "@/lib/engine/hand";
import { freshSeed } from "@/lib/engine/rng";
import {
  saveRun,
  loadRun,
  clearRun,
  archiveParse,
  saveArcRun,
  listArcSaves,
  loadArcSave,
  deleteArcSave,
  ARC_SAVE_CAP_NOTE,
} from "@/lib/engine/persist";
import { SAVE_STATUS_WORDS } from "@/lib/storage";
import { ACTS, END_OF_LIFE } from "@/content/play/acts";
import { CARD_BY_ID } from "@/content/play/cards";
import { BEATS } from "@/content/play/beats";
import {
  ILLUSTRATIVE_NOTE,
  CONTENT_NOTE,
  BRIEFING_TITLE,
  BRIEFING_INTRO,
  BRIEFING_POINTS,
} from "@/content/play/framing";
import { OBJECTIVE_KEYS, OBJECTIVE_LABEL } from "@/content/play/schema";
import { Creation } from "@/components/play/Creation";
import { Parse } from "@/components/play/Parse";
import { StatePanel } from "@/components/play/StatePanel";
import { DistributionStrip, CounterfactualStrip } from "@/components/play/DistributionStrip";
import { MechanicWhy } from "@/components/play/MechanicWhy";

type Screen = "loading" | "resume-gate" | "run";

type Stage =
  | { t: "act-intro" }
  | { t: "slot" }
  | { t: "watched-intro"; card: DecisionCard }
  | { t: "consequence"; card: DecisionCard; option: Option; resolution: Resolution; before: Record<GaugeKey, number>; watched?: boolean; fromAct: number; fromPhase: string }
  | { t: "act-summary"; act: number };

export function Playthrough() {
  const { edition } = useGuide();
  const router = useRouter();

  const [screen, setScreen] = useState<Screen>("loading");
  const [run, setRun] = useState<RunState | null>(null);
  const [pendingResume, setPendingResume] = useState<RunState | null>(null);
  const [stage, setStage] = useState<Stage>({ t: "act-intro" });
  const [why, setWhy] = useState<string | null>(null);
  // Redraw uses a fresh hand-seed; kept in run.handSeed. Count is for the wink copy.
  const [redrawCount, setRedrawCount] = useState(0);

  // Mark the doc so the no-JS floor hides once we've hydrated.
  useEffect(() => {
    document.documentElement.setAttribute("data-play-hydrated", "1");
    return () => document.documentElement.removeAttribute("data-play-hydrated");
  }, []);

  // On mount: resume an active run, or start fresh.
  useEffect(() => {
    setArcSaves(listArcSaves());
    const existing = loadRun();
    if (existing && existing.phase !== "parse") {
      setPendingResume(existing);
      setScreen("resume-gate");
    } else {
      startNew();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [arcSaves, setArcSaves] = useState<ReturnType<typeof listArcSaves>>([]);
  const [arcNotice, setArcNotice] = useState<string | null>(null);

  const commit = (next: RunState) => {
    setRun(next);
    saveRun(next);
    return next;
  };

  function startNew() {
    const fresh = initRun({ handSeed: freshSeed(), drawSeed: freshSeed() });
    setRedrawCount(0);
    commit(fresh);
    setScreen("run");
  }

  function resume() {
    if (!pendingResume) return startNew();
    setRun(pendingResume);
    setStage(pendingResume.phase === "acts" || pendingResume.phase === "endOfLife" ? { t: "slot" } : { t: "act-intro" });
    setScreen("run");
  }

  // The current act's display metadata (an act, or the end-of-life phase).
  const actMeta = useMemo(() => {
    if (!run) return null;
    if (run.phase === "endOfLife") {
      return { title: END_OF_LIFE.title, intro: END_OF_LIFE.intro, aimsAudit: false, n: 9 };
    }
    const a = ACTS[run.act];
    return a ? { title: a.title, intro: a.intro, aimsAudit: Boolean(a.aimsAudit), n: a.n } : null;
  }, [run]);

  if (screen === "loading") return null; // the static floor shows until we hydrate

  if (screen === "resume-gate" && pendingResume) {
    return (
      <div className="sim-play-app sim-surface">
        <div className="sim-play-gate">
          <h1>You have a life in progress</h1>
          <p>You can pick it back up exactly where you left it, or start a new one from before birth.</p>
          <div className="sim-play-gate-buttons">
            <button type="button" className="sim-primary-btn" onClick={resume}>
              Resume your run
            </button>
            <button
              type="button"
              className="sim-ghost-btn"
              onClick={() => {
                // Keep the life you are leaving, rather than overwriting it.
                // Starting a new run used to destroy the one in progress with no
                // way to get it back — §2.3.7's named saves are the fifth
                // sanctioned §3.2 delta and were the one that did not land.
                const a = ACTS[pendingResume.act];
                const kept = saveArcRun(pendingResume, a ? `A life, at ${a.title}` : "A life, before it started", "kept when you started another");
                setArcSaves(listArcSaves());
                // N-226 / C-1: this button promises to keep the life you are
                // leaving before it clears the run. If the write did not read
                // back, say so — and do NOT clear the run on top of it.
                if (kept.status !== "saved") {
                  setArcNotice(`The life you were in was not kept. ${SAVE_STATUS_WORDS[kept.status]} It is still here; nothing has been cleared.`);
                  return;
                }
                setArcNotice(null);
                clearRun();
                startNew();
              }}
            >
              Keep this one and start another
            </button>
          </div>
          <ArcSaves
            saves={arcSaves}
            notice={arcNotice}
            onLoad={(ref) => {
              const loaded = loadArcSave(ref);
              if (!loaded.ok) {
                setArcNotice(loaded.detail);
                return;
              }
              setArcNotice(null);
              commit(loaded.state);
              setStage(
                loaded.state.phase === "acts" || loaded.state.phase === "endOfLife" ? { t: "slot" } : { t: "act-intro" },
              );
              setScreen("run");
            }}
            onDelete={(ref) => {
              setArcSaves(deleteArcSave(ref));
              setArcNotice("Removed from this device.");
            }}
          />
        </div>
      </div>
    );
  }

  if (!run) return null;

  return (
    <div className="sim-play-app sim-surface" data-edition={edition}>
      <PlayBar
        onExit={() => router.push("/")}
        onSave={() => {
          const a = ACTS[run.act];
          const save = saveArcRun(run, a ? `A life, at ${a.title}` : "A life, before it started", "saved from the bar");
          setArcSaves(listArcSaves());
          // N-226 / C-1: the status the write RETURNED, in words. A status that
          // is not `saved` is never rendered as saved.
          setArcNotice(save.status === "saved" ? `Saved as "${save.label}".` : SAVE_STATUS_WORDS[save.status]);
        }}
      />
      {arcNotice ? (
        <p className="sim-notice" role="status">
          {arcNotice}
        </p>
      ) : null}

      {run.phase === "prologue" && (
        <PlayIntro onBegin={() => commit(withPhase(run, "briefing"))} />
      )}

      {run.phase === "briefing" && (
        <Briefing edition={edition} onContinue={() => commit(withPhase(run, "creation"))} />
      )}

      {run.phase === "creation" && (
        <Creation
          edition={edition}
          drawn={drawHand(run.handSeed)}
          redrawCount={redrawCount}
          onRedraw={() => {
            setRedrawCount((c) => c + 1);
            commit({ ...run, handSeed: freshSeed() });
          }}
          onAccept={(weights: WinWeights, leaning: LeaningKey) => {
            const withW = setWinWeights(run, weights);
            const withL = setLeaning(withW, leaning);
            commit(acceptHand(withL));
            setStage({ t: "act-intro" });
          }}
        />
      )}

      {(run.phase === "acts" || run.phase === "endOfLife") && actMeta && (
        <div className="sim-act-stage">
          <StatePanel run={run} edition={edition} />
          <div className="sim-act-main">
            <StageBody
              run={run}
              stage={stage}
              actMeta={actMeta}
              edition={edition}
              onSetStage={setStage}
              onCommit={commit}
              onWhy={setWhy}
            />
          </div>
        </div>
      )}

      {run.phase === "parse" && <ParseScreen run={run} edition={edition} onSameHand={startSameHand} onNewHand={startNewHand} />}

      {why && <MechanicWhy mechanicId={why} edition={edition} onClose={() => setWhy(null)} />}
    </div>
  );

  /* ---- replay ---- */
  function startSameHand() {
    if (!run) return;
    archiveCurrent(run);
    // Same accepted hand-seed, fresh draw-seed (skill moves the distribution).
    const next = acceptHand(
      setLeaning(
        setWinWeights(
          initRun({ handSeed: run.handSeed, drawSeed: freshSeed() }),
          run.winWeights,
        ),
        run.leaning ?? "curious",
      ),
    );
    setRedrawCount(0);
    commit(next);
    setStage({ t: "act-intro" });
  }
  function startNewHand() {
    if (!run) return;
    archiveCurrent(run);
    // Fresh hand-seed AND draw-seed (position moves everything else). Straight to
    // creation — the briefing is already behind them.
    const next = initRun({ handSeed: freshSeed(), drawSeed: freshSeed() });
    const withW = setWinWeights(next, run.winWeights);
    setRedrawCount(0);
    commit(withPhase(setLeaning(withW, run.leaning ?? "curious"), "creation"));
  }
}

function archiveCurrent(run: RunState) {
  const summary = computeParse(run);
  archiveParse({
    handSeed: run.handSeed,
    drawSeed: run.drawSeed,
    committed: run.committed,
    summary,
    savedAtLabel: "a completed run",
  });
}

/* ============================ Persistent play chrome ============================ */

function PlayBar({ onExit, onSave }: { onExit: () => void; onSave?: () => void }) {
  return (
    <div className="sim-play-bar">
      <span className="sim-play-bar-label">The Playthrough</span>
      {onSave ? (
        <button type="button" className="sim-play-exit" onClick={onSave}>
          Save this life
        </button>
      ) : null}
      <button type="button" className="sim-play-exit" onClick={onExit}>
        Pause &amp; exit
      </button>
    </div>
  );
}

/* ============================ Named saves (§2.3.7, §3.2 delta five) ============================ */

function ArcSaves({
  saves,
  notice,
  onLoad,
  onDelete,
}: {
  saves: ReturnType<typeof listArcSaves>;
  notice: string | null;
  onLoad: (ref: string) => void;
  onDelete: (ref: string) => void;
}) {
  return (
    <section className="sim-panel">
      <h4 className="sim-instrument-title">Lives you kept</h4>
      {notice ? (
        <p className="sim-notice" role="status">
          {notice}
        </p>
      ) : null}
      {saves.length ? (
        <ul className="sim-save-list">
          {saves.map((s) => (
            <li key={s.ref}>
              <span className="sim-save-label">{s.label}</span>
              <span className="sim-save-meta">{s.savedAtLabel}</span>
              <span className="sim-save-actions">
                <button type="button" className="sim-ghost-btn" onClick={() => onLoad(s.ref)}>
                  Resume
                </button>
                <button type="button" className="sim-ghost-btn" onClick={() => onDelete(s.ref)}>
                  Delete
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="sim-panel-empty">Nothing kept on this device yet.</p>
      )}
      <p className="sim-panel-note">{ARC_SAVE_CAP_NOTE}</p>
    </section>
  );
}

/* ============================ Intro (illustrative + content note) ============================ */

function PlayIntro({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="sim-play-intro">
      <p className="sim-illustrative-note">{ILLUSTRATIVE_NOTE}</p>
      <h1>Before the run</h1>
      <p className="sim-content-note" role="note">
        {CONTENT_NOTE}
      </p>
      <button type="button" className="sim-primary-btn" onClick={onBegin}>
        Read the briefing
      </button>
    </section>
  );
}

/* ============================ Briefing ============================ */

function Briefing({ edition, onContinue }: { edition: "standard" | "game"; onContinue: () => void }) {
  const game = edition === "game";
  return (
    <section className="sim-briefing">
      <header className="sim-briefing-head">
        <h1>{game ? BRIEFING_TITLE.game : BRIEFING_TITLE.standard}</h1>
        <p className="sim-briefing-intro">{game ? BRIEFING_INTRO.game : BRIEFING_INTRO.standard}</p>
      </header>
      <ul className="sim-briefing-points">
        {BRIEFING_POINTS.map((p) => (
          <li key={p.key} className="sim-briefing-point">
            <span className="sim-briefing-point-label">{p.label}</span>
            <span className="sim-briefing-point-body">{game ? p.body.game : p.body.standard}</span>
          </li>
        ))}
      </ul>
      <div className="sim-creation-nav">
        <button type="button" className="sim-primary-btn" onClick={onContinue}>
          Create your character
        </button>
      </div>
    </section>
  );
}

/* ============================ The act stage body (the decision loop) ============================ */

type ActMeta = { title: string; intro: string; aimsAudit: boolean; n: number };

function StageBody({
  run,
  stage,
  actMeta,
  edition,
  onSetStage,
  onCommit,
  onWhy,
}: {
  run: RunState;
  stage: Stage;
  actMeta: ActMeta;
  edition: "standard" | "game";
  onSetStage: (s: Stage) => void;
  onCommit: (r: RunState) => RunState;
  onWhy: (id: string) => void;
}) {
  // After a commit, decide whether to show an act summary, jump to the next slot, or finish.
  const afterAdvance = (next: RunState, fromAct: number, fromPhase: string) => {
    if (next.phase !== "acts" && next.phase !== "endOfLife") return; // -> parse, handled at top level
    if (next.act !== fromAct || next.phase !== fromPhase) {
      onSetStage({ t: "act-summary", act: fromAct });
    } else {
      onSetStage({ t: "slot" });
    }
  };

  if (stage.t === "act-intro") {
    return (
      <ActIntro
        run={run}
        actMeta={actMeta}
        edition={edition}
        onContinue={(maybeWeights) => {
          let r = run;
          if (maybeWeights) r = onCommit(setWinWeights(run, maybeWeights));
          onSetStage({ t: "slot" });
          void r;
        }}
      />
    );
  }

  if (stage.t === "act-summary") {
    return <ActSummary run={run} act={stage.act} onContinue={() => onSetStage({ t: "act-intro" })} />;
  }

  if (stage.t === "watched-intro") {
    const card = stage.card;
    return (
      <WatchedIntro
        card={card}
        onContinue={() => {
          const fromAct = run.act;
          const fromPhase = run.phase;
          const before = run.gauges;
          const r = commitWatched(run);
          if (!r) return;
          onCommit(r.state);
          onSetStage({
            t: "consequence",
            card: r.card,
            option: r.option,
            resolution: r.resolution,
            before,
            watched: true,
            fromAct,
            fromPhase,
          });
        }}
      />
    );
  }

  if (stage.t === "consequence") {
    return (
      <Consequence
        stage={stage}
        after={run.gauges}
        onWhy={onWhy}
        onContinue={() => afterAdvance(run, stage.fromAct, stage.fromPhase)}
      />
    );
  }

  // stage.t === "slot": figure out what the current slot is and render it.
  const slot = currentSlot(run);
  if (!slot) {
    // Shouldn't happen, but never dead-end: nudge forward.
    return (
      <div className="sim-act-empty">
        <button type="button" className="sim-primary-btn" onClick={() => onSetStage({ t: "act-intro" })}>
          Continue
        </button>
      </div>
    );
  }
  if (slot.kind === "beat") {
    const beat = BEATS[slot.beatId];
    if (beat) {
      const commitB = (skipped: boolean) => {
        const fromAct = run.act;
        const fromPhase = run.phase;
        const { state } = commitBeat(run, skipped);
        onCommit(state);
        afterAdvance(state, fromAct, fromPhase);
      };
      return <BeatView beat={beat} onSkip={() => commitB(true)} onContinue={() => commitB(false)} />;
    }
  }
  if (slot.kind === "watched") {
    const card = selectCard(run);
    if (card) return <WatchedIntro card={card} onContinue={() => onSetStage({ t: "watched-intro", card })} />;
  }
  // decision
  const card = selectCard(run);
  if (!card) {
    return (
      <div className="sim-act-empty">
        <p>Nothing more here.</p>
      </div>
    );
  }
  return (
    <DecisionCardView
      run={run}
      card={card}
      edition={edition}
      onResolve={(optionId) => {
        const fromAct = run.act;
        const fromPhase = run.phase;
        const before = run.gauges;
        const option = card.options.find((o) => o.id === optionId) ?? card.options[0];
        const { state, resolution } = commitDecision(run, card, optionId);
        onCommit(state);
        onSetStage({ t: "consequence", card, option, resolution, before, fromAct, fromPhase });
      }}
    />
  );
}

/* ---- Act intro (+ aims audit) ---- */

function ActIntro({
  run,
  actMeta,
  edition,
  onContinue,
}: {
  run: RunState;
  actMeta: ActMeta;
  edition: "standard" | "game";
  onContinue: (weights?: WinWeights) => void;
}) {
  const [weights, setWeights] = useState<WinWeights>(run.winWeights);
  const [revising, setRevising] = useState(false);
  const watched = run.phase === "acts" && ACTS[run.act]?.watched;

  return (
    <section className="sim-act-intro">
      <p className="sim-eyebrow">
        {run.phase === "endOfLife" ? (edition === "game" ? "Final phase" : "The end of the run") : `Act ${actMeta.n}`}
        {watched && <span className="sim-watched-tag"> · watched — decided for you</span>}
      </p>
      <h1>{actMeta.title}</h1>
      <p className="sim-act-intro-text">{actMeta.intro}</p>

      {actMeta.aimsAudit && (
        <div className="sim-aims-audit">
          <p className="sim-aims-audit-q">
            {edition === "game"
              ? "Aims audit: do you still hold the objective you set?"
              : "A moment to check: do you still hold the goal you chose?"}
          </p>
          {!revising ? (
            <div className="sim-creation-nav">
              <button type="button" className="sim-ghost-btn" onClick={() => setRevising(true)}>
                Revise what I'm aiming at
              </button>
              <button type="button" className="sim-primary-btn" onClick={() => onContinue()}>
                It still holds — continue
              </button>
            </div>
          ) : (
            <div className="sim-aims-audit-edit">
              <div className="sim-weight-rows">
                {OBJECTIVE_KEYS.map((k) => (
                  <div key={k} className="sim-weight-row">
                    <label>
                      <strong>{OBJECTIVE_LABEL[k]}</strong>
                    </label>
                    <div className="sim-weight-buttons" role="group" aria-label={OBJECTIVE_LABEL[k]}>
                      {[0, 1, 2, 3].map((w) => (
                        <button
                          key={w}
                          type="button"
                          aria-pressed={weights[k] === w}
                          onClick={() => setWeights((prev) => ({ ...prev, [k]: w } as WinWeights))}
                        >
                          {w === 0 ? "none" : w === 1 ? "some" : w === 2 ? "a lot" : "most"}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="sim-primary-btn" onClick={() => onContinue(weights)}>
                Save the revision and continue
              </button>
            </div>
          )}
        </div>
      )}

      {!actMeta.aimsAudit && (
        <div className="sim-creation-nav">
          <button type="button" className="sim-primary-btn" onClick={() => onContinue()}>
            {watched ? "Watch it unfold" : "Begin the act"}
          </button>
        </div>
      )}
    </section>
  );
}

/* ---- Watched moment ---- */

function WatchedIntro({ card, onContinue }: { card: DecisionCard; onContinue: () => void }) {
  return (
    <section className="sim-watched-moment sim-card-family" data-family={card.family}>
      <p className="sim-watched-note">This was decided for you. You had no button here — that is the point of these years.</p>
      <p className="sim-card-setup">{card.setup}</p>
      <button type="button" className="sim-primary-btn" onClick={onContinue}>
        See what they chose
      </button>
    </section>
  );
}

/* ---- Decision card ---- */

function matchWhen(when: string, flags: string[]): boolean {
  if (when === "floor") return flags.includes("floor");
  if (when === "no-floor") return flags.includes("no-floor");
  return flags.includes(when);
}

function DecisionCardView({
  run,
  card,
  edition,
  onResolve,
}: {
  run: RunState;
  card: DecisionCard;
  edition: "standard" | "game";
  onResolve: (optionId: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const chosen = card.options.find((o) => o.id === selected) ?? null;
  const previewSegments = chosen ? strip(chosen, run) : null;

  return (
    <section className="sim-decision-card sim-card-family" data-family={card.family}>
      <p className="sim-card-setup">{card.setup}</p>
      <ul className="sim-option-list">
        {card.options.map((o) => {
          const notes = (o.chips.positionNotes ?? []).filter((p) => matchWhen(p.when, run.flags));
          const isSel = selected === o.id;
          return (
            <li key={o.id}>
              <button
                type="button"
                className="sim-option"
                aria-pressed={isSel}
                data-selected={isSel ? "1" : "0"}
                onClick={() => setSelected(o.id)}
              >
                <span className="sim-option-label">{o.label}</span>
                <span className="sim-option-chips">
                  {o.chips.costs.map((c, i) => (
                    <span key={i} className="sim-chip sim-chip-cost">
                      {c}
                    </span>
                  ))}
                  <span className="sim-chip sim-chip-variance" title={SPREAD_MEANING[o.chips.variance]}>
                    spread: {o.chips.variance}
                  </span>
                  <span className="sim-chip sim-chip-rev">{o.chips.reversibility}</span>
                  {(o.flags ?? []).includes("recovery") && <span className="sim-chip sim-chip-recovery">a way back</span>}
                  {(o.flags ?? []).includes("endurance") && <span className="sim-chip sim-chip-endurance">endurance</span>}
                </span>
                {notes.length > 0 && (
                  <span className="sim-option-position">
                    {notes.map((p, i) => (
                      <span key={i} className="sim-chip sim-chip-position">
                        {p.text}
                      </span>
                    ))}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {chosen && previewSegments && (
        <div className="sim-resolve-block">
          <p className="sim-resolve-hint">
            {edition === "game"
              ? "This is the range your move sets. Resolve to see where the draw lands."
              : "This is the spread your choice would draw from. Resolve to see how it lands."}
          </p>
          <DistributionStrip segments={previewSegments.segments} marker={0.5} revealed={false} shift={previewSegments.shift} showLegend={false} />
          <button type="button" className="sim-primary-btn sim-resolve-btn" onClick={() => onResolve(chosen.id)}>
            Resolve
          </button>
        </div>
      )}
    </section>
  );
}

/* ---- Consequence ---- */

function Consequence({
  stage,
  after,
  onWhy,
  onContinue,
}: {
  stage: Extract<Stage, { t: "consequence" }>;
  after: Record<GaugeKey, number>;
  onWhy: (id: string) => void;
  onContinue: () => void;
}) {
  const { card, resolution, before } = stage;
  const deltas = GAUGE_KEYS.map((k) => ({ k, from: before[k], to: after[k] })).filter((d) => d.from !== d.to);
  return (
    <section className="sim-consequence sim-card-family" data-family={card.family}>
      {stage.watched && <p className="sim-watched-note">This landed the way it landed. No button would have changed it.</p>}
      <DistributionStrip
        segments={resolution.segments}
        marker={resolution.marker}
        revealed
        shift={resolution.shift}
        landedName={resolution.band.name}
      />
      <p className="sim-outcome-line">{resolution.band.outcome.line}</p>
      {card.shock && <CounterfactualStrip option={stage.option} marker={resolution.marker} />}
      {deltas.length > 0 && (
        <ul className="sim-consequence-deltas" aria-label="What changed">
          {deltas.map((d) => (
            <li key={d.k} data-dir={d.to > d.from ? "up" : "down"}>
              {GAUGE_LABEL[d.k]} {d.to > d.from ? "↑" : "↓"} {GAUGE_BAND_ORDER[d.to]}
            </li>
          ))}
        </ul>
      )}
      <div className="sim-consequence-actions">
        {card.mechanicLink && (
          <button type="button" className="sim-why-link" onClick={() => onWhy(card.mechanicLink as string)}>
            Why this happened
          </button>
        )}
        <button type="button" className="sim-primary-btn" onClick={onContinue}>
          Continue
        </button>
      </div>
    </section>
  );
}

/* ---- Scripted beat ---- */

function BeatView({
  beat,
  onSkip,
  onContinue,
}: {
  beat: ScriptedBeat;
  onSkip: () => void;
  onContinue: () => void;
}) {
  return (
    <section className="sim-scripted-beat" aria-label="A quiet moment">
      <p className="sim-beat-frame-note">A scripted, quieter beat. You can skip it.</p>
      <p className="sim-beat-prose">{beat.prose}</p>
      <p className="sim-beat-real">
        For the real thing, there is a page: <Link href={beat.realPageLink}>{beat.realPageLink.replace("/situations/", "")}</Link>.
      </p>
      <div className="sim-beat-actions">
        <button type="button" className="sim-ghost-btn" onClick={onSkip}>
          Skip this beat
        </button>
        <button type="button" className="sim-primary-btn" onClick={onContinue}>
          Stay with it
        </button>
      </div>
    </section>
  );
}

/* ---- Act summary ---- */

function ActSummary({ run, act, onContinue }: { run: RunState; act: number; onContinue: () => void }) {
  const actDef = ACTS[act];
  const displayN = actDef?.n ?? 9;
  // What was drawn versus decided this act (§3.4) — the skill/draw split, per act.
  const parse = computeParse(run);
  const tps = parse.turningPoints.filter((tp) => CARD_BY_ID[tp.cardId]?.act === displayN);
  const watched = actDef?.watched;
  return (
    <section className="sim-act-summary">
      <p className="sim-eyebrow">Act {displayN} · what happened</p>
      <h1>{actDef?.title ?? "The act"}</h1>
      <ul className="sim-act-summary-list">
        {tps.map((tp, i) => (
          <li key={i} data-band={tp.band}>
            <span className="sim-summary-decided">
              {watched ? "Made for you:" : "You chose to"} {tp.optionLabel}
            </span>
            <span className="sim-summary-drawn">
              — it came up <strong>{OUTCOME_BAND_LABEL[tp.band]}</strong>
              {tp.failure ? ", a bad draw" : tp.recovery ? ", a route back" : ""}.
            </span>
          </li>
        ))}
        {tps.length === 0 && <li>The consequential calls were made for you.</li>}
      </ul>
      <p className="sim-act-summary-note">
        The move set the range; the draw landed it. You can play well and still draw badly — the run
        will show you the same decision landing differently.
      </p>
      <div className="sim-creation-nav">
        <button type="button" className="sim-primary-btn" onClick={onContinue}>
          Continue
        </button>
      </div>
    </section>
  );
}

/* ---- Parse screen wrapper ---- */

function ParseScreen({
  run,
  edition,
  onSameHand,
  onNewHand,
}: {
  run: RunState;
  edition: "standard" | "game";
  onSameHand: () => void;
  onNewHand: () => void;
}) {
  const summary: ParseSummary = useMemo(() => computeParse(run), [run]);
  return <Parse summary={summary} edition={edition} onSameHand={onSameHand} onNewHand={onNewHand} />;
}
