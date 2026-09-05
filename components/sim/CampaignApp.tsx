"use client";

/**
 * *LAUNCH WINDOW — UNITED STATES · 2025* (blueprint 4.0 §3.3, §3.4, §4.1).
 *
 * The season loop, on screen: briefing → intent → allocate under the real pip
 * budget → resolve in the §7.6 canonical order → consequences with the visible
 * queue → explain → adapt. Everything mechanical lives in lib/sim; this file is
 * the surface, and it holds no rules of its own.
 *
 * Two things this component is careful about, because both are release blockers:
 *
 *   THE FLOOR (§3.4). The allocate screen renders `floorReport` for the current
 *   season directly. If the floor ever failed, it would be visible here rather
 *   than silent — and S-10 asserts across fleets that it does not.
 *
 *   THE BEAT CHANNEL (§5.1). A beat is fetched by `beatForSeason` and rendered by
 *   its own component, in its own reduced frame, with its skip control and its
 *   real page. It never enters the briefing queue, the timeline's forward half,
 *   the milestone list, or the resolved-items list — there is no code path here
 *   that could put it in any of them.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useGuide } from "@/lib/guide-context";
import { Term } from "@/components/Term";
import { useSimHydrated } from "@/lib/sim/use-hydrated";
import {
  newCampaign,
  setPriorities,
  briefing as computeBriefing,
  commitSeason,
  budgetFor,
  remainingBudget,
  nextOrdinal,
  emptyPriorities,
  seasonLabel,
  beatForSeason,
} from "@/lib/sim/campaign";
import {
  menu,
  affordableMenu,
  floorReport,
  previewAction,
  responseContract,
  type MenuEntry,
  type Preview,
} from "@/lib/sim/season";
import { strip } from "@/lib/sim/resolve";
import { deriveSlack } from "@/lib/sim/resolve";
import { isHighLoad } from "@/lib/sim/effects";
import { computeParse, BRIDGE_FRAME } from "@/lib/sim/parse";
import { createFork, replayFork } from "@/lib/sim/forks";
import { CAMPAIGN_CONTENT_NOTE } from "@/content/sim/methodology-copy";
import {
  readActive,
  writeActive,
  clearActive,
  saveRun,
  listSaves,
  loadSave,
  deleteSave,
  listForks,
  writeFork,
  syncForkSuffix,
  deleteFork,
  eraseAll,
  recordExplanations,
  storedExplanationFor,
  contentDrift,
  CAP_NOTE,
  CONTENT_DRIFT_NOTICE,
} from "@/lib/sim/persist";
import { SAVE_STATUS_WORDS } from "@/lib/storage";
import { GAUGE_BAND_ORDER } from "@/content/bands";
import { RANDOMNESS_LINE } from "@/content/sim/methodology-copy";
import { presetsInOrder, SEASON_COUNT, CAMPAIGN_LABEL, ACTION_BY_ID, PRESET_BY_ID } from "@/content/sim/registry";
import { profileRender } from "@/content/sim/profile";
import {
  ATTRIBUTION_LABEL,
  BUDGET_LABEL,
  CARD_FAMILIES,
  EVIDENCE_MEANING,
  FAMILY_LABEL,
  PRIORITY_KEYS,
  PRIORITY_LABEL,
  PRIORITY_NOTE,
  type CardFamily,
  type CommittedAllocation,
  type CommittedEventResponse,
  type PrioritySet,
  type RecoveryTie,
  type ResolvedItem,
  type SeasonResult,
  type SimAction,
  type SimEvent,
  type SimOption,
  type SimState,
} from "@/content/sim/schema";
import { CardFace, FamilyMotif, FAMILY_WORD } from "@/components/sim/instruments/CardFace";
import { StateRail } from "@/components/sim/StateRail";
import { ArmedButton, SIBLING_BRANCH_LINE } from "@/components/ResetButton";
import { BudgetInstrument, Gauges, Queue, Strip, Timeline, type TimelineMark } from "@/components/sim/instruments/Instruments";
import { SceneBackdrop, ScenePlate, DealtHand, type DealtCard } from "@/components/sim/scene/Scene";
import { PRIORITY_PRESETS } from "@/content/sim/priority-presets";

type Screen = "loading" | "resume-gate" | "run";
type Stage =
  | { t: "prologue" }
  | { t: "hand" }
  | { t: "deal" }
  | { t: "priorities" }
  | { t: "briefing" }
  | { t: "allocate" }
  | { t: "beat" }
  | { t: "event"; event: SimEvent }
  | { t: "consequences"; result: SeasonResult }
  | { t: "parse" };

export function CampaignApp() {
  useSimHydrated();
  const { edition } = useGuide();
  const [screen, setScreen] = useState<Screen>("loading");
  const [run, setRun] = useState<SimState | null>(null);
  const [stage, setStage] = useState<Stage>({ t: "prologue" });
  const [pendingResume, setPendingResume] = useState<SimState | null>(null);
  const [allocations, setAllocations] = useState<CommittedAllocation[]>([]);
  // A priority revision made in this season's briefing, held until the season is
  // committed. `onRevise` used to write live state only, so the ledger never
  // carried a revision: it did not survive a replay or a fork, and the parse's
  // "what you started aiming at, and what you were aiming at by the end" panel —
  // which §3.9 asks for and three surfaces promise — was permanently empty.
  const [pendingRevision, setPendingRevision] = useState<PrioritySet | null>(null);
  const [eventResponses, setEventResponses] = useState<CommittedEventResponse[]>([]);
  // N-190: the drawer needs the failure's TIED RECOVERY ROUTE as well as the item,
  // because the failure-mode reading may never render without it (C-2).
  const [explain, setExplain] = useState<{ item: ResolvedItem; tie?: RecoveryTie } | null>(null);
  const [beatSkipped, setBeatSkipped] = useState(false);
  const [saves, setSaves] = useState(() => [] as ReturnType<typeof listSaves>);
  const [notice, setNotice] = useState<string | null>(null);
  // N-228: the state rail is opened from the header, which renders on every
  // season step, so "reachable mid-run" is true of every step rather than of the
  // two screens that happen to have an aside.
  const [railOpen, setRailOpen] = useState(false);
  // N-194: the gauge bands the last resolved season STARTED from, so a delta-only
  // briefing can say what moved without replaying the run to find out. Session
  // state, never storage (§7.1: no new key); a resumed run simply has no delta to
  // report and the briefing says so rather than inventing one.
  const [previousGauges, setPreviousGauges] = useState<SimState["gauges"] | null>(null);
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSaves(listSaves());
    const existing = readActive();
    if (existing && existing.ok && existing.state.phase !== "parse") {
      setPendingResume(existing.state);
      setScreen("resume-gate");
      return;
    }
    // A FINISHED run used to be skipped here and the reader dropped on the
    // prologue — twenty-four seasons played, and no route back to the look-back
    // at the end of them. The run is still on the device; it just had nothing
    // that would show it. Go straight to its closing screen.
    if (existing && existing.ok && existing.state.phase === "parse") {
      setRun(existing.state);
      setStage({ t: "parse" });
      setScreen("run");
      return;
    }
    if (existing && !existing.ok) {
      setNotice(existing.detail);
    }
    setScreen("run");
  }, []);

  const commit = useCallback((next: SimState) => {
    setRun(next);
    writeActive(next);
    // If this run IS a branch, keep its ForkRecord's suffix in step. Nothing wrote
    // that suffix, so every branch stayed permanently empty: the saves panel
    // listed it and replaying it would have rewound to the fork point.
    if (next.fork?.ref) syncForkSuffix(next.fork.ref, next.committed.slice(next.fork.forkPoint));
    return next;
  }, []);

  /* ------------------------------------------------------------------ */

  if (screen === "loading") return null;

  if (screen === "resume-gate" && pendingResume) {
    const label = seasonLabel(pendingResume.seasonIndex);
    return (
      <div className="sim-campaign sim-surface">
        <div className="sim-gate">
          <p className="sim-scene-eyebrow">{CAMPAIGN_LABEL}</p>
          <h1>There is a campaign in progress</h1>
          <p>
            You left it in season {word(pendingResume.seasonIndex + 1)}, at age {label.age}. It has been waiting;
            it will keep waiting.
          </p>
          <div className="sim-gate-buttons">
            <button
              type="button"
              className="sim-primary-btn"
              onClick={() => {
                setRun(pendingResume);
                setStage({ t: "briefing" });
                setScreen("run");
              }}
            >
              Pick it back up
            </button>
            <button
              type="button"
              className="sim-ghost-btn"
              onClick={() => {
                clearActive();
                setPendingResume(null);
                setRun(null);
                setStage({ t: "prologue" });
                setScreen("run");
              }}
            >
              Start a different one
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */

  const startPreset = (presetId: string) => {
    const fresh = newCampaign({ origin: { kind: "preset", presetId } });
    commit(fresh);
    setStage({ t: "priorities" });
  };
  const startDrawn = () => {
    const fresh = newCampaign({ origin: { kind: "birth-rng" } });
    commit(fresh);
    setStage({ t: "deal" });
  };

  return (
    <div className="sim-campaign sim-surface" data-edition={edition}>
      <div ref={liveRef} className="sim-sr" role="status" aria-live="polite" />

      {run && stage.t !== "prologue" && stage.t !== "hand" ? (
        <CampaignHeader
          run={run}
          railOpen={railOpen}
          onToggleRail={() => setRailOpen((v) => !v)}
          onExit={() => {
            // N-226: the pause notice used to promise the device had kept it,
            // whatever the write actually did. It reports the status now.
            const status = run ? writeActive(run) : "memory-only";
            setNotice(
              status === "saved"
                ? "Paused. This campaign is on this device and it will wait indefinitely."
                : `Paused, but not kept. ${SAVE_STATUS_WORDS[status]}`,
            );
          }}
          onSave={() => {
            if (!run) return;
            const label = seasonLabel(run.seasonIndex);
            const result = saveRun(run, `${CAMPAIGN_LABEL} — age ${label.age}`, `${label.half} of ${label.year}`);
            setSaves(listSaves());
            // N-226 / C-1: the status the write RETURNED, in words. A status that
            // is not `saved` is never rendered as saved.
            setNotice(SAVE_STATUS_WORDS[result.status]);
          }}
        />
      ) : null}

      {run && railOpen && stage.t !== "prologue" && stage.t !== "hand" ? <StateRail run={run} /> : null}

      {/* N-223. A run resumed across a content change is a mixed record, and the
          honest thing is to say so where the reader is deciding what to do next.
          KNOWN LIMIT, recorded in the batch report and in lib/sim/persist.ts:
          `deserialize` declares a save from a different content version
          unresumable (4.0 §2.4, unchanged here), so this predicate is currently
          true of no state a player can reach. The notice is built and guarded
          rather than left out, because relaxing that migration wall is the
          owner's call and not a batch's. */}
      {run && contentDrift(run).length ? (
        <p className="sim-notice" role="note" data-sim-content-drift>
          {CONTENT_DRIFT_NOTICE}
        </p>
      ) : null}

      {notice ? (
        <p className="sim-notice" role="status">
          {notice}{" "}
          <button type="button" className="sim-notice-dismiss" onClick={() => setNotice(null)}>
            Dismiss
          </button>
        </p>
      ) : null}

      {/* There is deliberately no "you have an old run, erase it?" notice here.
          It used to key on the existence of `tgtl:play:run` — which is the LIVE
          storage key of 4.0's own Life Arc, written the moment anyone opens
          /play/arc. So visiting the arc once made the campaign announce that the
          reader had an unresumable run from an earlier version, and offer a
          button that deleted it. Every sentence of that was false, and the button
          was destructive. Whether a run at that key predates 4.0 is not knowable
          from the payload (its `version` is 1 in both), and it is not this
          screen's question either: /play/arc loads that key itself and declares
          its own state. The global erase control in the footer still clears
          everything, which is the honest device-wide answer §2.4 asks for. */}
      {stage.t === "prologue" && <Prologue onBegin={() => setStage({ t: "hand" })} />}

      {stage.t === "hand" && (
        <>
          <HandChoice onPreset={startPreset} onDrawn={startDrawn} onBack={() => setStage({ t: "prologue" })} />
          <div className="sim-saves-wrap">
            <SavesPanel
              saves={saves}
              forks={listForks()}
              onLoad={(ref) => {
                const loaded = loadSave(ref);
                if (!loaded.ok) {
                  setNotice(loaded.detail);
                  return;
                }
                commit(loaded.state);
                setStage({ t: "briefing" });
              }}
              onLoadFork={(ref) => {
                const record = listForks().find((f) => f.ref === ref);
                if (!record) {
                  setNotice("That branch is no longer on this device.");
                  return;
                }
                // A branch is replayed from the save it was taken from — never from
                // a parent state object, which is what keeps forks isolated (§2.1).
                const parent = loadSave(record.parentRef);
                if (!parent.ok) {
                  setNotice(
                    "That branch came from a saved run this device no longer has, so it cannot be rebuilt. The branch is still listed; you can delete it here.",
                  );
                  return;
                }
                commit(replayFork(record, parent.state.origin, parent.state.committed, parent.state.priorities));
                setStage({ t: "briefing" });
              }}
              onDeleteFork={(ref) => {
                deleteFork(ref);
                setNotice("Branch deleted from this device.");
              }}
              onDelete={(ref) => {
                deleteSave(ref);
                setSaves(listSaves());
              }}
              onErase={() => {
                eraseAll();
                setSaves(listSaves());
                setNotice("Erased. Nothing from this simulation is left on this device.");
              }}
            />
          </div>
        </>
      )}

      {stage.t === "deal" && run && (
        <DealScreen run={run} onAccept={() => setStage({ t: "priorities" })} onRedraw={startDrawn} />
      )}

      {stage.t === "priorities" && run && (
        <PriorityStep
          initial={run.priorities}
          onDone={(p) => {
            commit({ ...setPriorities(run, p), phase: "briefing" });
            setStage({ t: "briefing" });
          }}
        />
      )}

      {stage.t === "briefing" && run && (
        <BriefingScreen
          run={run}
          previousGauges={previousGauges}
          onRepeatLast={(proposal) => commitAllocations(run, proposal)}
          onAllocate={() => {
            setAllocations([]);
            setEventResponses([]);
            setStage({ t: "allocate" });
          }}
          onRevise={(p) => {
            setPendingRevision(p);
            commit(setPriorities(run, p));
          }}
          onFork={() => {
            // The notice used to promise the parent was "in your saves" while
            // nothing had been saved, and parentRef was the literal string
            // "active", which resolves to nothing. Save the parent first and use
            // its real ref, so the sentence is true and the branch can be replayed
            // from the ledger it actually came from.
            const label = seasonLabel(run.seasonIndex);
            const parentSave = saveRun(run, `${CAMPAIGN_LABEL} — age ${label.age}, before branching`, `${label.half} of ${label.year}`);
            const { record, state } = createFork(run, parentSave.ref, run.committed.length, `branched at age ${label.age}`);
            writeFork(record);
            setSaves(listSaves());

            commit(state);
            // N-226 / C-1: "was saved first" is a claim about a write. It is only
            // made when the write read back.
            setNotice(
              parentSave.status === "saved"
                ? `Branched. The run you were in was saved first, as "${parentSave.label}", and it is untouched — this is a new line from the same point.`
                : `Branched, and the run you were in was NOT kept. ${SAVE_STATUS_WORDS[parentSave.status]} This branch is a new line from the same point, and it is here only while the page is open.`,
            );
          }}
        />
      )}

      {stage.t === "allocate" && run && (
        <AllocateScreen
          run={run}
          allocations={allocations}
          onAdd={(a) => setAllocations((prev) => [...prev, a])}
          onRemove={(i) => setAllocations((prev) => prev.filter((_, k) => k !== i))}
          onBack={() => setStage({ t: "briefing" })}
          onResolve={() => commitAllocations(run, allocations)}
        />
      )}

      {stage.t === "beat" && run && (
        <BeatScreen
          run={run}
          onDone={(skipped) => {
            setBeatSkipped(skipped);
            const beat = beatForSeason(run);
            resolveNow(run, allocations, eventResponses, beat ? { beatId: beat.beat.id, skipped } : undefined);
          }}
        />
      )}

      {stage.t === "event" && run && (
        <EventScreen
          run={run}
          event={stage.event}
          onChoose={(optionId) => {
            const next = [...eventResponses, { eventId: stage.event.id, optionId }];
            setEventResponses(next);
            const beat = beatForSeason(run);
            resolveNow(run, allocations, next, beat ? { beatId: beat.beat.id, skipped: beatSkipped } : undefined);
          }}
        />
      )}

      {stage.t === "consequences" && run && (
        <ConsequencesScreen
          run={run}
          result={stage.result}
          onExplain={(item, tie) => setExplain({ item, tie })}
          onContinue={() => {
            if (run.phase === "parse" || run.seasonIndex >= SEASON_COUNT) setStage({ t: "parse" });
            else setStage({ t: "briefing" });
          }}
        />
      )}

      {stage.t === "parse" && run && <ParseScreen run={run} />}

      {explain ? <ExplainDrawer item={explain.item} tie={explain.tie} onClose={() => setExplain(null)} /> : null}
    </div>
  );

  /**
   * COMMIT AN ALLOCATION (N-194). The one path a season is committed through, so
   * "Repeat last season" and a hand-built allocation are not two paths that could
   * drift: both land here, both go through the beat check in the same place, and
   * both reach `commitSeason` with an ORDERED list. C-12 asserts the repeat enters
   * the ledger as the same ordered set and that the run still replays byte-identically.
   */
  function commitAllocations(state: SimState, allocs: CommittedAllocation[]) {
    setAllocations(allocs);
    setEventResponses([]);
    const beat = beatForSeason(state);
    if (beat) {
      setBeatSkipped(false);
      setStage({ t: "beat" });
      return;
    }
    resolveNow(state, allocs, [], undefined);
  }

  /** Run the season, pausing at any multi-option event at its §7.6 position. */
  function resolveNow(
    state: SimState,
    allocs: CommittedAllocation[],
    responses: CommittedEventResponse[],
    beatResponse: { beatId: string; skipped: boolean } | undefined,
  ) {
    const outcome = commitSeason(state, allocs, responses, beatResponse, pendingRevision ?? undefined);
    if (!outcome.done) {
      setStage({ t: "event", event: outcome.pendingEvent });
      return;
    }
    // N-216. Store the explanation the player is about to read, with the content
    // version that produced it, BEFORE it is committed to the device — so what
    // reopens later is the sentence they actually met and not whatever the pool
    // would produce for the same coordinates after an edit.
    commit(recordExplanations(outcome.state, outcome.result));
    // The revision belongs to the season just committed; the next one starts clean.
    setPendingRevision(null);
    // N-194: where the gauges stood before this season, for the next briefing's delta.
    setPreviousGauges(state.gauges);
    setStage({ t: "consequences", result: outcome.result });
    if (liveRef.current)
      liveRef.current.textContent = `Season resolved. ${outcome.result.items.length} things happened.`;
  }
}

/* =========================================================================
   Header (§4.1: age · season · place · role · intent · save state)
   ========================================================================= */

/**
 * N-204 — the origin's motif in the season chrome, on every turn.
 *
 * Five unequal starting positions, each declaring a distinct `face`, and the face
 * was used at exactly one place: the selection card. After `startPreset` the
 * origin never appeared again, not even its label, so five different lives
 * converged into one screen by season two — which teaches nothing about position,
 * the campaign's central doctrine. This is the SAME drawing the selection card
 * uses (`FamilyMotif`, out of the one component that draws a family), and the
 * spec's own test is that a screenshot is attributable to its origin WITHOUT the
 * preset name, so the name is deliberately not in the header.
 *
 * A drawn hand has no preset and therefore no declared face. It renders `inner` —
 * the small lamp in a wide dark field, which is the register the prologue and the
 * arc's void open in, and the only motif in the set that asserts nothing about
 * where a life started.
 */
function originFace(run: SimState): CardFamily {
  return run.origin.kind === "preset" ? (PRESET_BY_ID[run.origin.presetId]?.face ?? "inner") : "inner";
}

function CampaignHeader({
  run,
  onExit,
  onSave,
  railOpen,
  onToggleRail,
}: {
  run: SimState;
  onExit: () => void;
  onSave: () => void;
  railOpen: boolean;
  onToggleRail: () => void;
}) {
  const label = seasonLabel(run.seasonIndex);
  const intent = PRIORITY_KEYS.filter((k) => run.priorities[k] >= 2).map((k) => PRIORITY_LABEL[k]);
  const face = originFace(run);
  return (
    <header className="sim-header">
      <div className="sim-header-origin sim-card-frame" data-sim-origin-face={face} data-sim-state-field="origin">
        <FamilyMotif family={face} />
        {/* The instrument's text equivalent (§4.1): the motif names the family it
            draws, never the preset. */}
        <span className="sim-sr">the {FAMILY_WORD[face]} face this life started from</span>
      </div>
      <dl className="sim-header-facts">
        <div className="sim-header-fact">
          <dt>age</dt>
          <dd>{label.age}</dd>
        </div>
        <div className="sim-header-fact" data-sim-state-field="seasonIndex">
          <dt>
            <Term k="season" />
          </dt>
          <dd>
            {/* A finished run has seasonIndex === SEASON_COUNT, so "seasonIndex + 1"
                asked for the twenty-fifth of twenty-four and the word list handed
                back its fallback: the header on every closing screen read "many of
                twenty-four". */}
            {run.seasonIndex >= SEASON_COUNT
              ? `all ${word(SEASON_COUNT)}, played`
              : `${word(run.seasonIndex + 1)} of ${word(SEASON_COUNT)}`}
          </dd>
        </div>
        <div className="sim-header-fact">
          <dt>role</dt>
          <dd>{run.role}</dd>
        </div>
        <div className="sim-header-fact">
          <dt>place</dt>
          <dd>{run.place}</dd>
        </div>
        <div className="sim-header-fact sim-header-intent">
          <dt>aiming at</dt>
          <dd>{intent.length ? intent.join(" · ") : "nothing in particular yet"}</dd>
        </div>
      </dl>
      <div className="sim-header-controls">
        {/* N-228. In the header rather than on an aside, because the rail has to
            be reachable from EVERY season step and only two of them have a rail. */}
        <button type="button" className="sim-ghost-btn" aria-expanded={railOpen} onClick={onToggleRail}>
          {railOpen ? "Hide what this run is carrying" : "What this run is carrying"}
        </button>
        <button type="button" className="sim-ghost-btn" onClick={onSave}>
          Save
        </button>
        <Link href="/play" className="sim-ghost-btn" onClick={onExit}>
          Pause &amp; exit
        </Link>
      </div>
    </header>
  );
}

/* =========================================================================
   Prologue and the hand
   ========================================================================= */

function Prologue({ onBegin }: { onBegin: () => void }) {
  return (
    <section className="sim-scene">
      <SceneBackdrop stage="void" />
      <ScenePlate eyebrow={CAMPAIGN_LABEL} title="Twelve years, in twenty-four seasons">
        <p>
          Ages eighteen to thirty, in six-month turns. You direct a life under a real budget, and life happens to
          you at the same time. Nothing here predicts anything about yours: it is a model of a set of tradeoffs,
          built to be played more than once.
        </p>
        <p className="sim-illustrative-note">
          Every rule this campaign runs on is published on <Link href="/methodology">the methodology page</Link> —
          the budget table, the order things resolve in, how pressure is capped, and how the balance was probed.
        </p>
        {/* The only content advisory used to live in the no-JS floor, which is
            hidden the moment this component hydrates — so nobody who could play
            the campaign ever saw one. It also named only "loss" while the beat
            channel had grown to three of §5.1's four categories. */}
        <p className="sim-content-note" role="note">
          {CAMPAIGN_CONTENT_NOTE}
        </p>
        <button type="button" className="sim-primary-btn" onClick={onBegin}>
          Take a starting position
        </button>
      </ScenePlate>
    </section>
  );
}

function HandChoice({
  onPreset,
  onDrawn,
  onBack,
}: {
  onPreset: (id: string) => void;
  onDrawn: () => void;
  onBack: () => void;
}) {
  const [inspecting, setInspecting] = useState<string | null>(null);
  const ordered = presetsInOrder();
  return (
    <section className="sim-scene">
      <SceneBackdrop stage="books" />
      <ScenePlate eyebrow="Where you start" title="Two ways in" wide>
        <p>
          A starting position is dealt, not designed. Either take one of the five written positions below — all
          fictional, none of them the normal one — or let the deal decide.
        </p>
        <ul className="sim-preset-grid">
          {ordered.map((p) => {
            const render = profileRender(p.profile);
            const open = inspecting === p.id;
            return (
              <li key={p.id}>
                <CardFace family={p.face} eyebrow={p.startState.role} title={p.label} as="div">
                  <p className="sim-preset-fiction">{p.fictionalNote}</p>
                  <button
                    type="button"
                    className="sim-ghost-btn"
                    aria-expanded={open}
                    onClick={() => setInspecting(open ? null : p.id)}
                  >
                    {open ? "Hide what it costs" : "What this start makes expensive"}
                  </button>
                  {open ? (
                    <div className="sim-profile">
                      <p className="sim-profile-intro">{render.intro}</p>
                      <ul className="sim-profile-lines">
                        {render.lines.map((l) => (
                          <li key={l.axis} className="sim-profile-line">
                            <span className="sim-profile-axis">{l.label}</span>
                            <span className="sim-profile-band">{l.band}</span>
                            <span className="sim-profile-note">{l.note}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="sim-worth-guard">{render.worthGuard}</p>
                    </div>
                  ) : null}
                  <button type="button" className="sim-primary-btn" onClick={() => onPreset(p.id)}>
                    Start here
                  </button>
                </CardFace>
              </li>
            );
          })}
        </ul>
        <div className="sim-scene-nav">
          <button type="button" className="sim-ghost-btn" onClick={onBack}>
            Back
          </button>
          <button type="button" className="sim-primary-btn" onClick={onDrawn}>
            Deal me one instead
          </button>
        </div>
      </ScenePlate>
    </section>
  );
}

/**
 * The dealt hand (§4.1: "the hand as actual dealt cards"). Birth RNG deals the
 * start one card at a time; the constraint profile is the last thing turned, and
 * the verbatim worth-guard renders adjacent to it (gate S-8).
 */
function DealScreen({ run, onAccept, onRedraw }: { run: SimState; onAccept: () => void; onRedraw: () => void }) {
  const [revealed, setRevealed] = useState(1);
  const render = profileRender(run.profile);
  const cards: DealtCard[] = [
    {
      id: "board",
      axis: "the board",
      value: CAMPAIGN_LABEL,
      note: "The place and the decade you are playing in. Not chosen, and the same for every hand.",
    },
    { id: "role", axis: "what you are, to start", value: run.role, note: "A description, not a ceiling." },
    { id: "place", axis: "where you are", value: run.place, note: "Where the openings are, relative to you." },
    ...render.lines.map((l) => ({
      id: l.axis,
      axis: l.label + " — what it costs here",
      value: l.band,
      note: l.note,
    })),
  ];
  const allUp = revealed >= cards.length;
  return (
    <section className="sim-scene">
      <SceneBackdrop stage="hand" />
      <ScenePlate eyebrow="The deal" title="The hand you did not choose" wide>
        <p>
          Nobody picks their starting position. These cards are dealt, they are correlated the way real starting
          conditions are correlated, and they are not a judgement on the person holding them.
        </p>
        <DealtHand cards={cards} revealed={revealed} onTurn={() => setRevealed((n) => Math.min(cards.length, n + 3))} />
        {allUp ? (
          <>
            <p className="sim-profile-intro">{render.intro}</p>
            <p className="sim-worth-guard">{render.worthGuard}</p>
            <div className="sim-scene-nav">
              <button type="button" className="sim-primary-btn" onClick={onAccept}>
                Play this hand
              </button>
              <button type="button" className="sim-ghost-btn" onClick={onRedraw}>
                Deal another
              </button>
            </div>
            <p className="sim-hint">You can redraw here as often as you like. The character cannot.</p>
          </>
        ) : null}
      </ScenePlate>
    </section>
  );
}

/** Named saves and branches (§3.8) — inspectable, deletable, capped out loud. */
function SavesPanel({
  saves,
  forks,
  onLoad,
  onDelete,
  onLoadFork,
  onDeleteFork,
  onErase,
}: {
  saves: ReturnType<typeof listSaves>;
  forks: ReturnType<typeof listForks>;
  onLoad: (ref: string) => void;
  onDelete: (ref: string) => void;
  onLoadFork: (ref: string) => void;
  onDeleteFork: (ref: string) => void;
  onErase: () => void;
}) {
  return (
    <section className="sim-panel">
      <h4 className="sim-instrument-title">Saved runs and branches</h4>
      {saves.length ? (
        <ul className="sim-save-list">
          {saves.map((s) => (
            <li key={s.ref}>
              <span className="sim-save-label">{s.label}</span>
              <span className="sim-save-meta">
                {s.savedAtLabel} · simulation {s.engineVersion} · content {s.contentVersion}
              </span>
              {/* N-234. The seed, where a reader can actually see it — the save
                  inspector has returned it since 4.0 and nothing rendered it, so
                  "inspectable" was true of the payload and not of the reader. */}
              {s.drawSeed ? (
                <span className="sim-save-meta" data-sim-save-seed>
                  draw seed {s.drawSeed}
                  {s.handSeed ? ` · hand seed ${s.handSeed}` : ""}
                </span>
              ) : null}
              <span className="sim-save-actions">
                <button type="button" className="sim-ghost-btn" onClick={() => onLoad(s.ref)}>
                  Resume
                </button>
                <ArmedButton
                  label="Delete"
                  armedLabel="Press again to delete"
                  consequence="This removes this saved run from this device. Any branches taken from it stay where they are."
                  onConfirm={() => onDelete(s.ref)}
                  className="sim-ghost-btn"
                  wrapperClassName="sim-armed"
                  noticeClassName="sim-panel-note"
                />
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="sim-panel-empty">Nothing saved on this device yet. The blank state is private, not incomplete.</p>
      )}
      <p className="sim-panel-note" data-sim-randomness-line>
        {RANDOMNESS_LINE} A seed is what makes a run reproducible and forkable, so two branches can be
        compared rather than re-rolled. <Link href="/methodology#seeded-randomness">How that works</Link>.
      </p>
      {forks.length ? (
        <>
          <h5 className="sim-instrument-subtitle">Branches</h5>
          <ul className="sim-save-list">
            {forks.map((f) => (
              <li key={f.ref}>
                <span className="sim-save-label">{f.label}</span>
                <span className="sim-save-meta">a branch of another line — the run it came from is untouched</span>
                <span className="sim-save-actions">
                  {/* This list used to be labels and nothing else: no control, and
                      a parentRef of "active" that resolved to nothing. A branch now
                      names the save it came from and can be replayed from it. */}
                  <button type="button" className="sim-ghost-btn" onClick={() => onLoadFork(f.ref)}>
                    Resume
                  </button>
                  {/* N-227. The sibling-branch line belongs here specifically: a
                      branch looks like a copy of a run, and a reader deleting one
                      needs to know the line it came from is a separate record. */}
                  <ArmedButton
                    label="Delete"
                    armedLabel="Press again to delete"
                    consequence={`This removes this branch from this device. ${SIBLING_BRANCH_LINE}`}
                    onConfirm={() => onDeleteFork(f.ref)}
                    className="sim-ghost-btn"
                    wrapperClassName="sim-armed"
                    noticeClassName="sim-panel-note"
                  />
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <p className="sim-panel-note">{CAP_NOTE}</p>
      <ArmedButton
        label="Erase everything this simulation has stored"
        consequence="This removes every saved run, every branch and the run in progress from this device. What you have read elsewhere on the site, and the reading preferences, are separate and stay."
        onConfirm={onErase}
        className="sim-ghost-btn"
        wrapperClassName="sim-armed"
        noticeClassName="sim-panel-note"
      />
    </section>
  );
}

/* =========================================================================
   Priorities — staged onboarding (§3.6)
   ========================================================================= */

function PriorityStep({ initial, onDone }: { initial: PrioritySet; onDone: (p: PrioritySet) => void }) {
  const [mode, setMode] = useState<"preset" | "full">("preset");
  const [weights, setWeights] = useState<PrioritySet>(initial);
  const any = PRIORITY_KEYS.some((k) => weights[k] > 0);
  return (
    <section className="sim-scene">
      <SceneBackdrop stage="earth" />
      <ScenePlate eyebrow="What you are aiming at" title="What would make these years good ones?" wide>
        <p>
          There is no universal win condition here. The same ending reads as a success under one set of
          priorities and a disappointment under another, and you can change your mind later — that is recorded
          as adaptation, not as a failure.
        </p>
        {mode === "preset" ? (
          <>
            <ul className="sim-priority-presets">
              {PRIORITY_PRESETS.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className="sim-priority-preset"
                    aria-pressed={PRIORITY_KEYS.every((k) => weights[k] === p.weights[k])}
                    onClick={() => setWeights({ ...p.weights })}
                  >
                    <span className="sim-priority-preset-name">{p.label}</span>
                    <span className="sim-priority-preset-note">{p.note}</span>
                  </button>
                </li>
              ))}
            </ul>
            <button type="button" className="sim-ghost-btn" onClick={() => setMode("full")}>
              Set all ten myself
            </button>
          </>
        ) : (
          <PriorityInstrument weights={weights} onChange={setWeights} />
        )}
        <div className="sim-scene-nav">
          <button type="button" className="sim-primary-btn" disabled={!any} onClick={() => onDone(weights)}>
            Begin the first season
          </button>
          {!any ? <span className="sim-hint">Give weight to at least one.</span> : null}
        </div>
      </ScenePlate>
    </section>
  );
}

/** The priority instrument — a designed object, with enumerated inputs under it. */
export function PriorityInstrument({
  weights,
  onChange,
}: {
  weights: PrioritySet;
  onChange: (p: PrioritySet) => void;
}) {
  return (
    <div className="sim-priorities">
      <ul className="sim-priority-list">
        {PRIORITY_KEYS.map((k) => (
          <li key={k} className="sim-priority-row" data-weight={weights[k]}>
            <span className="sim-priority-name">
              <strong>{PRIORITY_LABEL[k]}</strong>
              <span className="sim-priority-note">{PRIORITY_NOTE[k]}</span>
            </span>
            <span className="sim-priority-bar" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <span key={n} className="sim-priority-mark" data-on={weights[k] >= n ? "1" : "0"} />
              ))}
            </span>
            <span className="sim-priority-buttons" role="group" aria-label={PRIORITY_LABEL[k]}>
              {WEIGHT_WORDS.map((w, n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={weights[k] === n}
                  className="sim-priority-btn"
                  onClick={() => onChange({ ...weights, [k]: n } as PrioritySet)}
                >
                  {w}
                </button>
              ))}
            </span>
          </li>
        ))}
      </ul>
      <p className="sim-priority-total">
        There is no total. These do not add up to anything, and there is nowhere for one of them to go.
      </p>
    </div>
  );
}

const WEIGHT_WORDS = ["not this", "some", "a lot", "most"];

/* =========================================================================
   Briefing
   ========================================================================= */

/**
 * N-194 — THE REPEAT-LAST-SEASON PROPOSAL.
 *
 * The previous season's committed allocation, offered back AS AN ORDERED SET. The
 * order is load-bearing: §7.6 resolves committed actions in allocation order, so a
 * "repeat" that rebuilt the set from ids would be a different season wearing the
 * same name. Only the occurrence ordinals are recomputed, because they are a pure
 * function of the ledger and this is a new occurrence of each action.
 *
 * An entry whose action is no longer available or affordable this season is
 * DROPPED and named, never silently substituted — the compressed flow may not
 * quietly commit something the player did not choose.
 */
function repeatProposal(run: SimState): { proposal: CommittedAllocation[]; dropped: string[] } | null {
  const last = run.committed[run.committed.length - 1];
  if (!last || !last.allocations.length) return null;
  const remaining = budgetFor(run);
  const entries = menu(run, remaining);
  const proposal: CommittedAllocation[] = [];
  const dropped: string[] = [];
  const seen = new Map<string, number>();
  for (const a of last.allocations) {
    const entry = entries.find((m) => m.action.id === a.actionId);
    const already = seen.get(a.actionId) ?? 0;
    if (!entry?.available || !entry.action.options.some((o) => o.id === a.optionId)) {
      dropped.push(ACTION_BY_ID[a.actionId]?.label ?? a.actionId);
      continue;
    }
    seen.set(a.actionId, already + 1);
    proposal.push({ actionId: a.actionId, instanceOrdinal: nextOrdinal(run, proposal, a.actionId), optionId: a.optionId });
  }
  if (!proposal.length) return null;
  // Affordability of the WHOLE set, checked once against the season's budget.
  const spent = spentOf(proposal);
  const budget = budgetFor(run);
  if (spent.timeStructure > budget.timeStructure || spent.energy > budget.energy || spent.money > budget.money) return null;
  return { proposal, dropped };
}

/** Gauge movement since the last resolved season, in words. Never a number. */
function gaugeDelta(now: SimState["gauges"], before: SimState["gauges"] | null): string[] {
  if (!before) return [];
  // Reviewer amendment (batch 3): the band words come from the published order, not a copy.
  const WORDS = GAUGE_BAND_ORDER;
  const NAMES: Record<string, string> = { money: "money", healthEnergy: "energy", connection: "connection", timeStructure: "time" };
  const out: string[] = [];
  for (const k of Object.keys(NAMES) as (keyof SimState["gauges"])[]) {
    if (now[k] === before[k]) continue;
    out.push(`${NAMES[k as string]} is ${WORDS[now[k]]}, and was ${WORDS[before[k]]}`);
  }
  return out;
}

function BriefingScreen({
  run,
  previousGauges,
  onAllocate,
  onRevise,
  onFork,
  onRepeatLast,
}: {
  run: SimState;
  previousGauges: SimState["gauges"] | null;
  onAllocate: () => void;
  onRevise: (p: PrioritySet) => void;
  onFork: () => void;
  onRepeatLast: (proposal: CommittedAllocation[]) => void;
}) {
  const b = computeBriefing(run);
  const [adapting, setAdapting] = useState(false);
  // N-194. The compressed flow is offered only where its own signal says the
  // season is quiet AND there is a previous allocation that is still takeable.
  // Twenty-four full briefings is the single biggest threat to "smooth and fun",
  // and the flag that says which of them is worth reading has been computed since
  // 4.0 and rendered as a title change.
  const repeat = b.quiet ? repeatProposal(run) : null;
  const [showFull, setShowFull] = useState(false);
  const compressed = Boolean(repeat) && !showFull;
  const moved = gaugeDelta(run.gauges, previousGauges);
  const marks: TimelineMark[] = run.committed.map((c) => ({
    seasonIndex: c.seasonIndex,
    kind: c.forkPoint ? "branch" : "played",
    label: `${word(c.allocations.length)} things committed`,
  }));
  for (const q of run.queue) marks.push({ seasonIndex: dueOf(q, run.seasonIndex), kind: "pending", label: q.label });

  return (
    <section className="sim-season">
      <div className="sim-season-main">
        <p className="sim-scene-eyebrow">
          Season {word(run.seasonIndex + 1)} · age {b.age}, {b.half} of {b.year}
        </p>
        <h1 className="sim-season-title">{b.quiet ? "A quiet season" : "Where things stand"}</h1>

        {compressed && repeat ? (
          <section className="sim-panel sim-briefing-delta" aria-label="What changed since last season">
            <h4 className="sim-instrument-title">What changed</h4>
            <ul className="sim-plain-list">
              <li>Nothing new arrived, and nothing you set going earlier is due this season.</li>
              {moved.length ? (
                moved.map((m, i) => <li key={`g${i}`}>{m}</li>)
              ) : previousGauges ? (
                <li>Nothing moved in what you have to spend from.</li>
              ) : (
                <li>This run was picked back up, so what moved since the last season is not recorded here.</li>
              )}
              {b.pressures.map((p, i) => (
                <li key={`p${i}`}>{p}</li>
              ))}
              {b.needs.map((n, i) => (
                <li key={`n${i}`}>{n}</li>
              ))}
            </ul>
            <p className="sim-panel-note">
              This is the difference, not the whole standing. The full briefing is one press away and nothing
              is hidden behind this.
            </p>
            <div className="sim-season-nav">
              <button
                type="button"
                className="sim-primary-btn"
                data-sim-repeat-last
                onClick={() => onRepeatLast(repeat.proposal)}
              >
                Repeat last season
              </button>
              <button type="button" className="sim-ghost-btn" onClick={onAllocate}>
                Allocate the season instead
              </button>
              <button type="button" className="sim-ghost-btn" onClick={() => setShowFull(true)}>
                Show the full briefing
              </button>
            </div>
            <p className="sim-panel-note">
              Repeating commits the same things, in the same order, through the same path as a season you
              build by hand:{" "}
              {repeat.proposal.map((a) => ACTION_BY_ID[a.actionId]?.label ?? a.actionId).join(", ")}.
              {repeat.dropped.length
                ? ` ${repeat.dropped.join(", ")} ${repeat.dropped.length === 1 ? "is" : "are"} not available this season and would be left out rather than swapped for something you did not pick.`
                : ""}
            </p>
          </section>
        ) : null}

        <div className="sim-briefing-grid" hidden={compressed}>
          <section className="sim-panel" aria-label="Pressures and needs">
            <h4 className="sim-instrument-title">What is pressing</h4>
            {b.pressures.length || b.needs.length ? (
              <ul className="sim-pressure-list">
                {b.pressures.map((p, i) => (
                  <li key={`p${i}`} data-kind="pressure">
                    {p}
                  </li>
                ))}
                {b.needs.map((n, i) => (
                  <li key={`n${i}`} data-kind="need">
                    {n}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="sim-panel-empty">Nothing is pressing on you this season. That is a real thing to have.</p>
            )}
          </section>

          <div data-sim-state-field="queue">
            <Queue queue={run.queue} seasonIndex={run.seasonIndex} />
          </div>

          <BudgetInstrument budget={b.budget} />
        </div>

        <div hidden={compressed} data-sim-state-field="committed">
          <Timeline
            seasonCount={SEASON_COUNT}
            seasonIndex={run.seasonIndex}
            marks={marks}
            milestones={milestonesFor(run)}
          />
        </div>

        <div className="sim-season-nav" hidden={compressed}>
          <button type="button" className="sim-primary-btn" onClick={onAllocate}>
            Allocate the season
          </button>
          <button type="button" className="sim-ghost-btn" onClick={() => setAdapting((v) => !v)}>
            Revise what you are aiming at
          </button>
          <button type="button" className="sim-ghost-btn" onClick={onFork}>
            Branch from here
          </button>
        </div>

        {adapting ? (
          <div className="sim-panel">
            <h4 className="sim-instrument-title">Adapt</h4>
            <p className="sim-panel-note">
              Changing what you are aiming at is adaptation — new information arriving and the plan moving to meet
              it. The parse records it as exactly that.
            </p>
            <PriorityInstrument weights={run.priorities} onChange={onRevise} />
          </div>
        ) : null}
      </div>

      {/* C-23. The rail's instruments are the mid-run surface for the state
          fields they render; the attribute is on the wrapper so the gate can find
          them without the instruments needing to know about the gate. */}
      <aside className="sim-rail" aria-label="Where you stand">
        <div data-sim-state-field="gauges">
          <Gauges gauges={run.gauges} slack={deriveSlack(run.gauges, isHighLoad(run.conditions))} relevantOnly={relevantGauges(run)} />
        </div>
        {run.standing.length ? (
          <section className="sim-panel" data-sim-state-field="standing">
            <h4 className="sim-instrument-title">Standing commitments</h4>
            <ul className="sim-standing-list">
              {run.standing.map((s, i) => (
                <li key={i}>
                  {s.label} — {word(s.seasonsRemaining)} more {s.seasonsRemaining === 1 ? "season" : "seasons"}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <CompanionRail run={run} />
      </aside>
    </section>
  );
}

function CompanionRail({ run }: { run: SimState }) {
  const people = Object.values(run.companions);
  if (!people.length) return null;
  return (
    <section className="sim-panel">
      <h4 className="sim-instrument-title">People</h4>
      <ul className="sim-people-list">
        {people.map((c) => {
          const mark = run.relationships.find((r) => r.id === c.arcId);
          return (
            <li key={c.arcId} data-exited={c.exited ? "1" : undefined}>
              <span className="sim-person-name">{mark?.label ?? c.arcId}</span>
              <span className="sim-person-state">
                {c.exited
                  ? "no longer in this"
                  : c.sinceContact >= 3
                    ? "it has been a while"
                    : (mark?.quality ?? 0) >= 2
                      ? "close"
                      : (mark?.quality ?? 0) <= -1
                        ? "strained"
                        : "there"}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* =========================================================================
   Allocate — the heart
   ========================================================================= */

function AllocateScreen({
  run,
  allocations,
  onAdd,
  onRemove,
  onBack,
  onResolve,
}: {
  run: SimState;
  allocations: CommittedAllocation[];
  onAdd: (a: CommittedAllocation) => void;
  onRemove: (i: number) => void;
  onBack: () => void;
  onResolve: () => void;
}) {
  const [family, setFamily] = useState<CardFamily | "all">("all");
  const [opening, setOpening] = useState<string | null>(null);
  const remaining = remainingBudget(run, allocations);
  const budget = budgetFor(run);
  const entries = menu(run, remaining);
  const report = floorReport(run, remaining);
  const shown = entries.filter((m) => (family === "all" ? true : m.action.family === family)).filter((m) => m.available);
  const families = [...new Set(entries.filter((m) => m.available).map((m) => m.action.family))];

  return (
    <section className="sim-season">
      <div className="sim-season-main">
        <p className="sim-scene-eyebrow">Season {word(run.seasonIndex + 1)} · allocate</p>
        <h1 className="sim-season-title">What goes into this season?</h1>
        <p className="sim-season-lede">
          Every yes spends something and closes or delays something else. Two to four things is a full season.
        </p>

        <div className="sim-allocate-bar">
          <BudgetInstrument budget={budget} spent={spentOf(allocations)} compact title="What is left" />
          <ul className="sim-chosen">
            {allocations.map((a, i) => {
              const action = ACTION_BY_ID[a.actionId];
              return (
                <li key={i}>
                  <span>{action?.label ?? a.actionId}</span>
                  <button type="button" className="sim-chosen-remove" onClick={() => onRemove(i)}>
                    Take it back
                  </button>
                </li>
              );
            })}
            {!allocations.length ? <li className="sim-chosen-empty">Nothing committed yet.</li> : null}
          </ul>
        </div>

        <div className="sim-family-filter" role="group" aria-label="Filter by kind">
          <button type="button" aria-pressed={family === "all"} onClick={() => setFamily("all")} className="sim-filter-btn">
            everything
          </button>
          {CARD_FAMILIES.filter((f) => families.includes(f)).map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={family === f}
              onClick={() => setFamily(f)}
              className="sim-filter-btn"
            >
              {FAMILY_LABEL[f]}
            </button>
          ))}
        </div>

        <ul className="sim-action-grid">
          {shown.map((m) => (
            <ActionCard
              key={m.action.id}
              entry={m}
              run={run}
              open={opening === m.action.id}
              chosen={allocations.some((a) => a.actionId === m.action.id)}
              onToggleOpen={() => setOpening(opening === m.action.id ? null : m.action.id)}
              onChoose={(optionId) => {
                onAdd({
                  actionId: m.action.id,
                  instanceOrdinal: nextOrdinal(run, allocations, m.action.id),
                  optionId,
                });
                setOpening(null);
              }}
            />
          ))}
        </ul>

        <p className="sim-floor-note">
          {report.affordableCount >= 3
            ? `${capitalise(word(report.affordableCount))} things are affordable right now, across ${word(report.families.length)} kinds. Resting, waiting and asking for help are always among them, and always free.`
            : "Resting, waiting and asking for help are available and free, as they are in every season of this campaign."}
        </p>

        <div className="sim-season-nav">
          <button type="button" className="sim-ghost-btn" onClick={onBack}>
            Back to the briefing
          </button>
          <button type="button" className="sim-primary-btn" onClick={onResolve} disabled={!allocations.length}>
            Resolve the season
          </button>
          {!allocations.length ? <span className="sim-hint">Commit at least one thing — waiting counts.</span> : null}
        </div>
      </div>

      <aside className="sim-rail" aria-label="Where you stand">
        <Gauges gauges={run.gauges} slack={deriveSlack(run.gauges, isHighLoad(run.conditions))} />
        <Queue queue={run.queue} seasonIndex={run.seasonIndex} />
      </aside>
    </section>
  );
}

function ActionCard({
  entry,
  run,
  open,
  chosen,
  onToggleOpen,
  onChoose,
}: {
  entry: MenuEntry;
  run: SimState;
  open: boolean;
  chosen: boolean;
  onToggleOpen: () => void;
  onChoose: (optionId: string) => void;
}) {
  const a = entry.action;
  const [preview, setPreview] = useState<string | null>(null);
  const onPreview = (id: string | null) => setPreview(id);
  return (
    <li>
      <CardFace family={a.family} title={a.label} selected={chosen} eyebrow={costWords(entry)} as="div">
        {a.scene ? <p className="sim-card-scene">{a.scene}</p> : null}
        {a.contract.opportunityNote ? <p className="sim-card-cost">{a.contract.opportunityNote}</p> : null}
        {/* N-191 (C-3). Forty-three authored sentences about what changing your
            mind costs, linted for voice since 4.0 and displayed by nothing.
            Beside the opportunity note, because they are the same kind of fact:
            what this move costs that is not in its price. */}
        {a.contract.switchingCost ? (
          <p className="sim-card-switching" data-sim-switching-cost>
            <span className="sim-card-switching-eyebrow">If you change your mind</span>
            {a.contract.switchingCost}
          </p>
        ) : null}
        {!entry.affordable ? (
          <p className="sim-card-blocked">
            Not affordable this season{entry.reason ? ` — ${entry.reason}` : ""}.
          </p>
        ) : null}
        <button
          type="button"
          className="sim-ghost-btn"
          aria-expanded={open}
          onClick={onToggleOpen}
          disabled={!entry.affordable || chosen}
        >
          {chosen ? "Committed" : open ? "Close" : "How you would do it"}
        </button>
        {open ? (
          <>
            <ul className="sim-option-list">
              {a.options.map((o) => {
                const { segments, shift } = strip(o, run, { highLoad: isHighLoad(run.conditions) });
                return (
                  <li
                    key={o.id}
                    className="sim-option"
                    data-sim-option={o.id}
                    onMouseEnter={() => onPreview(o.id)}
                    onMouseLeave={() => onPreview(null)}
                    onFocus={() => onPreview(o.id)}
                    onBlur={() => onPreview(null)}
                  >
                    <h4 className="sim-option-label">{o.label}</h4>
                    <ul className="sim-chip-row">
                      {o.chips.costs.map((c, i) => (
                        <li key={i} className="sim-chip" data-kind="cost">
                          {c}
                        </li>
                      ))}
                      <li className="sim-chip" data-kind="variance">
                        {o.chips.variance}
                      </li>
                      <li className="sim-chip" data-kind="rev">
                        {o.chips.reversibility}
                      </li>
                      {(o.flags ?? []).includes("recovery") ? (
                        <li className="sim-chip" data-kind="recovery">
                          a way back
                        </li>
                      ) : null}
                      {(o.chips.positionNotes ?? [])
                        .filter((p) => run.flags.includes(p.when))
                        .map((p, i) => (
                          <li key={`pn${i}`} className="sim-chip" data-kind="position">
                            {p.text}
                          </li>
                        ))}
                    </ul>
                    <ResponseContract record={a} option={o} run={run} />
                    <Strip segments={segments} shift={shift} caption="The range this move sets, from where you stand." />
                    {o.supportLink ? (
                      <p className="sim-option-support">
                        <Link href={o.supportLink}>If this is the one, here is the route it names.</Link>
                      </p>
                    ) : null}
                    <button type="button" className="sim-primary-btn" onClick={() => onChoose(o.id)}>
                      Commit this
                    </button>
                  </li>
                );
              })}
            </ul>
            <PreviewPane run={run} optionId={preview} />
          </>
        ) : null}
      </CardFace>
    </li>
  );
}

/* =========================================================================
   N-211 — THE FIVE-FIELD RESPONSE CONTRACT, compact on the card.
   =========================================================================
   Five names, fixed (§11 LITERAL); the layout is the executor's. Compact here,
   because the card is where a decision is made and a wall of prose is not a
   decision aid — the explain drawer already carries the long form of the
   attribution and the failure modes, and the option's own strip carries the
   range. Nothing below is authored content: every value is read off a record
   that already carried it (lib/sim/season.ts's `responseContract`).
   ========================================================================= */
function ResponseContract({ record, option, run }: { record: SimAction | SimEvent; option: SimOption; run: SimState }) {
  return (
    <dl className="sim-contract">
      {responseContract(record, option, run).map((f) => (
        <div key={f.name} className="sim-contract-row" data-sim-contract-field={f.name}>
          <dt className="sim-contract-name">{f.name}</dt>
          <dd className="sim-contract-value">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* =========================================================================
   N-212 — THE PURE PREVIEW PANE.
   =========================================================================
   One live region per open card, updated on focus or hover of an option. It says
   what the option would touch and whether it sets anything going — and then says,
   in the same breath, that reading it changed nothing. That sentence is a claim
   about the code, so C-16 is what makes it true: `previewAction` is byte-identical
   state in, byte-identical state out, it reaches no storage, and it consumes no
   draw. The pane is `aria-live="polite"` and stays mounted while the card is open,
   so a screen reader hears the change rather than a region appearing.
   ========================================================================= */
function PreviewPane({ run, optionId }: { run: SimState; optionId: string | null }) {
  const preview: Preview | null = optionId ? previewAction(run, optionId) : null;
  return (
    <div className="sim-preview" aria-live="polite" data-sim-preview>
      {preview ? (
        <>
          <p className="sim-preview-line">
            <span className="sim-preview-label">what this would touch</span>{" "}
            {preview.domains.length ? preview.domains.join(" · ") : "nothing the ten priorities name"}
          </p>
          <p className="sim-preview-line">
            <span className="sim-preview-label">what would be waiting</span>{" "}
            {preview.queues ? preview.waits.join(" · ") : "nothing set going for a later season"}
          </p>
          <p className="sim-preview-note">Previewing changes nothing.</p>
        </>
      ) : (
        <p className="sim-preview-note">
          Move to an option, or tab onto one, to read what it would touch before committing it. Previewing
          changes nothing.
        </p>
      )}
    </div>
  );
}

/* =========================================================================
   Events, beats, consequences
   ========================================================================= */

function EventScreen({ run, event, onChoose }: { run: SimState; event: SimEvent; onChoose: (id: string) => void }) {
  return (
    <section className="sim-season sim-season-single">
      <div className="sim-season-main">
        <p className="sim-scene-eyebrow">This arrived · season {word(run.seasonIndex + 1)}</p>
        <CardFace family={event.family} title={event.label} as="div">
          <p className="sim-card-scene">{event.scene}</p>
          <ul className="sim-option-list">
            {event.options.map((o) => {
              const { segments, shift } = strip(o, run, { highLoad: isHighLoad(run.conditions) });
              return (
                <li key={o.id} className="sim-option" data-sim-option={o.id}>
                  <h4 className="sim-option-label">{o.label}</h4>
                  <ul className="sim-chip-row">
                    {o.chips.costs.map((c, i) => (
                      <li key={i} className="sim-chip" data-kind="cost">
                        {c}
                      </li>
                    ))}
                    <li className="sim-chip" data-kind="variance">
                      {o.chips.variance}
                    </li>
                    <li className="sim-chip" data-kind="rev">
                      {o.chips.reversibility}
                    </li>
                  </ul>
                  {/* N-211. The contract is on EVERY response, not only the ones
                      taken under a budget: an arrival is the moment a reader most
                      needs to know what the way back is before answering. */}
                  <ResponseContract record={event} option={o} run={run} />
                  <Strip segments={segments} shift={shift} caption="The range this response sets." />
                  {o.supportLink ? (
                    <p className="sim-option-support">
                      <Link href={o.supportLink}>The route this names.</Link>
                    </p>
                  ) : null}
                  <button type="button" className="sim-primary-btn" onClick={() => onChoose(o.id)}>
                    Do this
                  </button>
                </li>
              );
            })}
          </ul>
        </CardFace>
      </div>
    </section>
  );
}

/**
 * The beat, in its own reduced frame (§5.1). No chips, no strip, no cost/reward,
 * no draw framing, no card face — a beat is not a decision and does not look like
 * one. The skip control is always present and always first.
 */
function BeatScreen({ run, onDone }: { run: SimState; onDone: (skipped: boolean) => void }) {
  const beat = beatForSeason(run);
  if (!beat) {
    onDone(false);
    return null;
  }
  return (
    <section className="sim-beat" aria-label="A quiet part of the run">
      <div className="sim-beat-inner">
        <p className="sim-beat-frame-note">
          This part of the run is not a decision, and there is nothing here to work out. You can pass it by.
        </p>
        <div className="sim-beat-actions">
          <button type="button" className="sim-ghost-btn" onClick={() => onDone(true)}>
            Skip this
          </button>
        </div>
        <p className="sim-beat-prose">{beat.beat.prose}</p>
        <p className="sim-beat-real">
          <Link href={beat.beat.realPageLink}>If this is real for you right now, the page for it is here.</Link>
        </p>
        <button type="button" className="sim-primary-btn" onClick={() => onDone(false)}>
          Go on
        </button>
      </div>
    </section>
  );
}

function ConsequencesScreen({
  run,
  result,
  onExplain,
  onContinue,
}: {
  run: SimState;
  result: SeasonResult;
  onExplain: (i: ResolvedItem, tie?: RecoveryTie) => void;
  onContinue: () => void;
}) {
  return (
    <section className="sim-season">
      <div className="sim-season-main">
        <p className="sim-scene-eyebrow">Season {word(result.seasonIndex + 1)} · what happened</p>
        <h1 className="sim-season-title">The season, as it went</h1>
        <ol className="sim-result-list">
          {result.items.map((item, i) => (
            <li key={i}>
              <CardFace
                family={item.family}
                band={item.band}
                eyebrow={KIND_WORD[item.kind]}
                title={item.optionLabel ? `${item.label} — ${item.optionLabel}` : item.label}
                as="div"
              >
                <p className="sim-result-line">{item.line}</p>
                {item.invalidatedNote ? <p className="sim-result-invalid">{item.invalidatedNote}</p> : null}
                <button
                  type="button"
                  className="sim-ghost-btn"
                  onClick={() => onExplain(item, result.recoveryTies.find((t) => t.failedId === item.id))}
                >
                  Why this happened
                </button>
              </CardFace>
            </li>
          ))}
        </ol>

        {result.recoveryTies.length ? <RecoveryTies ties={result.recoveryTies} /> : null}

        <Queue queue={result.queueAfter} seasonIndex={run.seasonIndex} />

        <div className="sim-season-nav">
          <button type="button" className="sim-primary-btn" onClick={onContinue}>
            {run.seasonIndex >= SEASON_COUNT ? "The look back" : "On to the next season"}
          </button>
        </div>
      </div>
    </section>
  );
}

const KIND_WORD: Record<ResolvedItem["kind"], string> = {
  action: "you did this",
  event: "this arrived",
  consequence: "this had been set in motion",
  companion: "someone else",
  chance: "this arrived",
};

/** §3.4 step 5 — the recovery tie, rendered as its own consequence step. */
const DOOR_GROUPS = [
  ["opened", "What opened"],
  ["closed", "What closed"],
  // N-214. Between shut and still-there: the doors that are getting harder. Its
  // heading says the motion, not a verdict, and its token is the neutral one
  // (C-18) — painting it with the open colour is the plant that proves the gate.
  ["narrowing", "What is getting harder"],
  ["still recoverable", "Still there"],
] as const;

function RecoveryTies({ ties }: { ties: RecoveryTie[] }) {
  return (
    <section className="sim-recovery">
      <h4 className="sim-instrument-title">Ways on from here</h4>
      {ties.map((tie) => (
        <div key={tie.failedId} className="sim-recovery-block">
          <p className="sim-recovery-from">
            After <strong>{tie.failedLabel}</strong>:
          </p>
          {tie.routes.some((r) => r.tied) ? (
            <ul className="sim-recovery-list">
              {tie.routes
                .filter((r) => r.tied)
                .slice(0, 3)
                .map((r, i) => (
                  <li key={i}>
                    <span className="sim-recovery-label">
                      {r.actionLabel} · {r.optionLabel}
                    </span>
                    <span className="sim-recovery-why">{r.why}</span>
                    {r.supportLink ? <Link href={r.supportLink}>the route it names</Link> : null}
                  </li>
                ))}
            </ul>
          ) : null}
          {/* The floor route is labelled as what it is. Presenting it under
              "tied to that" would be a claim the model does not support. */}
          {tie.routes
            .filter((r) => !r.tied)
            .slice(0, 1)
            .map((r, i) => (
              <p key={i} className="sim-recovery-floor">
                And, as after anything: <strong>{r.actionLabel.toLowerCase()}</strong> —{" "}
                {r.optionLabel.toLowerCase()}.{" "}
                {r.supportLink ? <Link href={r.supportLink}>the route it names</Link> : null}
              </p>
            ))}
        </div>
      ))}
    </section>
  );
}

/* =========================================================================
   The explain drawer (§3.10, §7.2 readRef)
   ========================================================================= */

function ExplainDrawer({
  item,
  tie,
  onClose,
}: {
  item: ResolvedItem;
  tie?: RecoveryTie;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // N-190. Only a failure has a failure mode to read, and only an ACTION carries
  // the authored lines (an event has no `failureModes` field in the schema).
  const failureModes = item.failure ? (ACTION_BY_ID[item.id]?.failureModes ?? []) : [];
  const tiedRoutes = (tie?.routes ?? []).filter((r) => r.tied);

  return (
    <div className="sim-drawer" role="dialog" aria-modal="true" aria-label="Why this happened">
      <div className="sim-drawer-card" data-scroll-region="y" tabIndex={0} ref={ref}>
        <p className="sim-scene-eyebrow">Why this happened</p>
        <h2 className="sim-drawer-title">{item.label}</h2>
        <p className="sim-drawer-line">{item.line}</p>

        <h4 className="sim-instrument-title">What contributed</h4>
        {item.attribution.length ? (
          <ul className="sim-attribution">
            {item.attribution.map((c, i) => (
              <li key={i} data-category={c.category} data-dir={c.weight >= 0 ? "up" : "down"}>
                <span className="sim-attribution-cat">{ATTRIBUTION_LABEL[c.category]}</span>
                <span className="sim-attribution-note">{c.note}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="sim-panel-empty">Nothing in particular pushed this one either way.</p>
        )}
        <p className="sim-drawer-note">
          These are the factors that actually went into the resolution — computed from what the model used, not
          written afterwards. A factor that is not listed did not contribute.
        </p>

        {/* N-190 (C-2). The authored failure modes are the DIAGNOSTIC reading of
            what went wrong — the difference between "that did not work" and "that
            did not work because the thing you needed was a prerequisite you did
            not have". They render beside the attribution split, and beside the
            tied recovery route, NEVER instead of it: the guard below requires a
            tied route to exist, and both live in one section so C-2 can see that
            they cannot be separated. The recovery-tie rule itself (schema
            `recoveryRefs` / `noRecoveryTie`, S-3) is unchanged. */}
        {failureModes.length > 0 && tiedRoutes.length > 0 ? (
          <section className="sim-drawer-failure">
            <h4 className="sim-instrument-title">What this kind of failure usually is</h4>
            <ul className="sim-failure-modes">
              {failureModes.map((f, i) => (
                <li key={i} data-sim-failure-mode>
                  {f}
                </li>
              ))}
            </ul>
            <h4 className="sim-instrument-title">Ways on from here</h4>
            <ul className="sim-recovery-list">
              {tiedRoutes.slice(0, 3).map((r, i) => (
                <li key={i} data-sim-recovery-route>
                  <span className="sim-recovery-label">
                    {r.actionLabel} · {r.optionLabel}
                  </span>
                  <span className="sim-recovery-why">{r.why}</span>
                  {r.supportLink ? <Link href={r.supportLink}>the route it names</Link> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {item.evidenceLabel ? (
          <p className="sim-evidence">
            <span className="sim-evidence-label">{item.evidenceLabel}</span>
            <span className="sim-evidence-meaning">{EVIDENCE_MEANING[item.evidenceLabel]}</span>
          </p>
        ) : null}

        <div className="sim-drawer-actions">
          {item.readRef ? <Link href={item.readRef} className="sim-ghost-btn">Read about this</Link> : null}
          <Link href="/methodology" className="sim-ghost-btn">
            How the engine works
          </Link>
          <button type="button" className="sim-primary-btn" onClick={onClose}>
            Back to the season
          </button>
        </div>
      </div>
      <button type="button" className="sim-drawer-scrim" aria-label="Close" onClick={onClose} />
    </div>
  );
}

/* =========================================================================
   Parse
   ========================================================================= */

/* =========================================================================
   N-355 (C-25) — the look-back declares which of the three each panel is.
   =========================================================================
   Same three words and the same reasons as the Life Arc's parse
   (components/play/Parse.tsx): recorded is what the run's own record holds,
   interpreted is a reading built on it, unknowable is what no record of a life
   holds. A panel that is navigation rather than a finding — the bridge, the way
   out — declares `data-parse-controls` instead of borrowing one of the three.
   ========================================================================= */
type ParseKind = "recorded" | "interpreted" | "unknowable";
const PARSE_KIND_NOTE: Record<ParseKind, string> = {
  recorded: "what the run itself holds",
  interpreted: "a reading built on that record",
  unknowable: "what no record of a life holds",
};
function KindLabel({ kind }: { kind: ParseKind }) {
  return (
    <p className="sim-parse-kind" data-kind={kind}>
      <span className="sim-parse-kind-word">{kind}</span>
      <span className="sim-parse-kind-note">{PARSE_KIND_NOTE[kind]}</span>
    </p>
  );
}

function ParseScreen({ run }: { run: SimState }) {
  const parse = useMemo(() => computeParse(run), [run]);
  const render = profileRender(parse.profile);
  return (
    <section className="sim-parse">
      <p className="sim-scene-eyebrow">Age thirty</p>
      <h1 className="sim-parse-title">Twelve years, looked at</h1>
      <p className="sim-parse-lede">
        Not a score and not a verdict. What these years cost, what they bought, and what is still open.
      </p>

      <section className="sim-panel" data-parse-kind="recorded">
        <h4 className="sim-instrument-title">Where you started</h4>
        <KindLabel kind="recorded" />
        <ul className="sim-profile-lines">
          {render.lines.map((l) => (
            <li key={l.axis} className="sim-profile-line">
              <span className="sim-profile-axis">{l.label}</span>
              <span className="sim-profile-band">{l.band}</span>
            </li>
          ))}
        </ul>
        <p className="sim-worth-guard">{render.worthGuard}</p>
      </section>

      {/* N-216 (C-20). THE LIVING RECORD. Every other fact on this screen is
          re-derived from the ledger, which is what makes the model checkable — and
          also what would let a content edit quietly replace the sentence a reader
          met at twenty-two with one they never saw. Each season here reopens the
          explanation STORED when it resolved, with the content version that
          produced it beside it; the recomputation is used only for a season that
          predates the record (a run saved before this version), and says so. */}
      <section className="sim-panel" data-parse-kind="recorded">
        <h4 className="sim-instrument-title">The years, in order</h4>
        <KindLabel kind="recorded" />
        <ol className="sim-parse-seasons" data-scroll-region="y" tabIndex={0}>
          {parse.seasons.map((s) => {
            const stored = storedExplanationFor(run, s.seasonIndex);
            const lines = stored ? stored.explanation.split("\n") : [s.headline];
            return (
              <li key={s.seasonIndex} data-band={s.band} data-sim-season-record={stored ? "stored" : "recomputed"}>
                <span className="sim-parse-age">
                  {s.age}, {s.half}
                </span>
                <span className="sim-parse-headline">{lines[0]}</span>
                {lines.length > 1 ? (
                  <span className="sim-parse-rest">{lines.slice(1).join(" ")}</span>
                ) : null}
                <span className="sim-save-meta">
                  {stored
                    ? `read at the time, kept as it was · content ${stored.contentVersion}`
                    : "rebuilt from the ledger — this season was played before explanations were kept"}
                </span>
              </li>
            );
          })}
        </ol>
        <p className="sim-panel-note">
          These are the sentences this run actually showed you, preserved rather than recalculated. A later
          change to the content does not reach back into them.
        </p>
      </section>

      {parse.maintained.length ? (
        <section className="sim-panel" data-parse-kind="recorded">
          <h4 className="sim-instrument-title">What you kept up</h4>
          <KindLabel kind="recorded" />
          <ul className="sim-plain-list">
            {parse.maintained.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="sim-panel" data-parse-kind="interpreted">
        <h4 className="sim-instrument-title">What these years contained</h4>
        <KindLabel kind="interpreted" />
        <ul className="sim-plain-list">
          {parse.achievements.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </section>

      {parse.costs.length ? (
        <section className="sim-panel" data-parse-kind="interpreted">
          <h4 className="sim-instrument-title">What they cost</h4>
          <KindLabel kind="interpreted" />
          <ul className="sim-plain-list">
            {parse.costs.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="sim-panel" data-parse-kind="recorded">
        <h4 className="sim-instrument-title">Where it came from</h4>
        <KindLabel kind="recorded" />
        {/* N-222. The moment a per-season split is AGGREGATED across a run it
            starts reading as a verdict — "other people: most of it" becomes a
            finding about who is to blame for a life. The computation is honest
            (S-12 asserts every rendered category is a nonzero tagged component);
            what it is not is a moral ledger, and one sentence above it is what
            stops the reader supplying that reading themselves. */}
        <p className="sim-panel-note" data-sim-attribution-disclaimer>
          Counts show how often a source appeared in explanations, not how much blame or credit it deserves.
        </p>
        <ul className="sim-attribution">
          {parse.attribution.map((a, i) => (
            <li key={i} data-category={a.category}>
              <span className="sim-attribution-cat">{ATTRIBUTION_LABEL[a.category]}</span>
              <span className="sim-attribution-note">{a.share}</span>
            </li>
          ))}
        </ul>
      </section>

      {parse.priorities.length ? (
        <section className="sim-panel" data-parse-kind="interpreted">
          <h4 className="sim-instrument-title">Read against what you said mattered</h4>
          <KindLabel kind="interpreted" />
          <ul className="sim-plain-list">
            {parse.priorities.map((p) => (
              <li key={p.key}>
                <strong>{p.label}</strong> — {p.reading}
              </li>
            ))}
          </ul>
          {parse.revisions.map((r, i) => (
            <p key={i} className="sim-panel-note">
              {r.note}
            </p>
          ))}
        </section>
      ) : null}

      {parse.beatNotes.length ? (
        <section className="sim-panel" data-parse-kind="recorded">
          <KindLabel kind="recorded" />
          <ul className="sim-plain-list sim-beat-notes">
            {parse.beatNotes.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="sim-panel" data-parse-kind="interpreted">
        <h4 className="sim-instrument-title">Doors</h4>
        <KindLabel kind="interpreted" />
        {/* Grouped by state. A flat top-ten list could contain nothing but
            openings and silently drop every closing, which is exactly what the
            old one did — §3.9 asks for all three states and the build showed
            one. The note is said once per group instead of repeated per row. */}
        {DOOR_GROUPS.map(([state, heading]) => {
          const group = parse.doors.filter((d) => d.state === state);
          if (!group.length) return null;
          return (
            <div className="sim-door-group" key={state}>
              <p className="sim-door-group-head" data-state={state}>
                {heading}
              </p>
              <p className="sim-door-note">{group[0].note}</p>
              <ul className="sim-door-list">
                {group.map((d, i) => (
                  <li key={i} data-state={state}>
                    <span className="sim-door-label">{d.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <section className="sim-panel" data-parse-kind="interpreted">
        <h4 className="sim-instrument-title">The other lines</h4>
        <KindLabel kind="interpreted" />
        <ul className="sim-plain-list">
          {parse.counterfactuals.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </section>

      {/* N-355. The third kind, named once. */}
      <section className="sim-panel" data-parse-kind="unknowable">
        <h4 className="sim-instrument-title">What this cannot know</h4>
        <KindLabel kind="unknowable" />
        <p className="sim-panel-note">
          What it felt like to live these years. Nothing above is a stand-in for it — not the bands, not the
          doors, not the reading against what you said mattered. It is named here so that it is not simply
          missing from the account.
        </p>
      </section>

      <section className="sim-bridge" data-parse-controls>
        <p className="sim-bridge-frame">{BRIDGE_FRAME}</p>
        <p className="sim-bridge-line">{parse.bridge.line}</p>
        <Link href={parse.bridge.href} className="sim-primary-btn">
          {parse.bridge.linkLabel}
        </Link>
      </section>

      <div className="sim-season-nav">
        <Link href="/play" className="sim-ghost-btn">
          Back to the play door
        </Link>
        <Link href="/play/lab" className="sim-ghost-btn">
          Take one decision into the Lab
        </Link>
      </div>
    </section>
  );
}

/* =========================================================================
   helpers
   ========================================================================= */

const WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
  "nineteen", "twenty", "twenty-one", "twenty-two", "twenty-three", "twenty-four",
];
function word(n: number): string {
  return WORDS[n] ?? "many";
}
function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function costWords(entry: MenuEntry): string {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(entry.cost)) {
    if (v > 0) parts.push(`${word(v)} ${BUDGET_LABEL[k as keyof typeof BUDGET_LABEL]}`);
  }
  return parts.length ? parts.join(" · ") : "free";
}
function spentOf(allocations: CommittedAllocation[]) {
  const out = { timeStructure: 0, energy: 0, money: 0 };
  for (const a of allocations) {
    const c = ACTION_BY_ID[a.actionId]?.contract.costs ?? {};
    out.timeStructure += c.timeStructure ?? 0;
    out.energy += c.energy ?? 0;
    out.money += c.money ?? 0;
  }
  return out;
}
function dueOf(q: SimState["queue"][number], seasonIndex: number): number {
  return "seasons" in q.due ? q.placedSeason + q.due.seasons : Math.min(23, seasonIndex + 1);
}
function relevantGauges(run: SimState) {
  const keys: ("money" | "healthEnergy" | "connection" | "timeStructure")[] = [];
  for (const k of ["money", "healthEnergy", "connection", "timeStructure"] as const)
    if (run.gauges[k] <= 1 || run.gauges[k] >= 3) keys.push(k);
  return keys.length >= 2 ? keys : undefined;
}

/**
 * Reachable milestones (§4.1): doors open from the CURRENT state, rendered
 * qualitatively. Never probabilistic, never a preview of anything uncertain, and
 * never sourced from the beat channel.
 */
function milestonesFor(run: SimState): string[] {
  const out: string[] = [];
  const left = SEASON_COUNT - run.seasonIndex;
  const available = affordableMenu(run, budgetFor(run));
  const families = [...new Set(available.map((m) => m.action.family))];
  if (left > 12) out.push("Most of the window is still ahead of you; almost nothing here is decided.");
  else if (left > 4) out.push(`${capitalise(word(left))} seasons left in the window.`);
  else out.push("The window is nearly through. What is here now is roughly what you will arrive with.");
  if (families.includes("school")) out.push("Learning routes are open from here.");
  if (families.includes("work")) out.push("Work routes are open from here.");
  if (families.includes("home")) out.push("Moving, or settling where you are, is open from here.");
  if (run.gauges.connection >= 2) out.push("There are people here you could go further with.");
  return out;
}

