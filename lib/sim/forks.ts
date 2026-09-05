/**
 * FORKS AND NAMED SAVES (blueprint 4.0 §3.8, §2.4, gate S-7).
 *
 * A fork is an EXPLICIT branch at a campaign decision — never a silent rewind. It
 * records `{ parentRef, forkPoint, seeds, its own committed suffix, label }` and
 * is replayed by taking the parent's committed PREFIX and running the fork's own
 * suffix on top. The parent's stored state is never read for mutation and never
 * written; S-7 proves it by byte-comparing the parent's serialised save before and
 * after the fork is created, played forward, and compared.
 *
 * FORK ISOLATION, precisely: `replayFork` rebuilds from `newCampaign(parent.origin,
 * parent.seeds)` and re-derives everything. It never receives a parent SimState
 * object, so there is no shared reference for a fork to corrupt. Draw-vary forks
 * take a fresh draw-seed; everything else is inherited exactly.
 */

import { freshSeed } from "@/lib/sim/rng";
import { newCampaign, commitSeason, setPriorities, withPhase } from "@/lib/sim/campaign";
import type { CommittedSeason, ForkRecord, NamedSave, SimState } from "@/content/sim/schema";

/** A stable, opaque, local-only reference for a save or a fork. */
export function makeRef(prefix: string, seed: string): string {
  return `${prefix}-${seed.slice(0, 8)}`;
}

/**
 * Rebuild a run from its origin, seeds, and committed ledger. This is THE replay:
 * every derived value in the state vector comes back out of it, which is what makes
 * determinism checkable and forks safe.
 */
export function replay(
  origin: SimState["origin"],
  seeds: { handSeed: string; drawSeed: string },
  committed: CommittedSeason[],
  priorities?: SimState["priorities"],
): SimState {
  let s = newCampaign({ origin, handSeed: seeds.handSeed, drawSeed: seeds.drawSeed });
  if (priorities) s = setPriorities(s, priorities);
  s = withPhase(s, "briefing");
  for (const season of committed) {
    if (season.priorityRevision) s = setPriorities(s, season.priorityRevision);
    const run = commitSeason(s, season.allocations, season.eventResponses, season.beatResponse);
    // A replay always has every event response already recorded, so a pending
    // event here means the ledger and the content have gone out of step. That is
    // never silent: the run is flagged, so a fork that could not reproduce its
    // parent's prefix is declared rather than quietly handed back short (§2.4,
    // §3.8 — never a silent loss, never a silent rewind).
    if (!run.done) return { ...s, replayTruncatedAt: season.seasonIndex };
    s = run.state;
  }
  return s;
}

/**
 * Create a fork of `parent` at `forkPoint` (an index into the parent's committed
 * list). The parent object is treated as READ-ONLY: nothing here writes to it, and
 * the returned fork carries only plain data copied out of it.
 *
 * `axis` selects the comparison the fork is for (§3.8's three Lab axes), and is
 * the only thing that changes what the fork inherits:
 *   choice-vary   — same hand, same seeds; only the decisions after the point differ
 *   draw-vary     — same hand, same decisions; a fresh draw-seed
 *   position-vary — a different starting position, same decisions
 */
export function createFork(
  parent: SimState,
  parentRef: string,
  forkPoint: number,
  label: string,
  axis: "choice-vary" | "draw-vary" | "position-vary" = "choice-vary",
  positionOrigin?: SimState["origin"],
): { record: ForkRecord; state: SimState } {
  const prefix = parent.committed.slice(0, forkPoint).map(cloneSeason);
  const seeds = {
    handSeed: parent.handSeed,
    drawSeed: axis === "draw-vary" ? freshSeed() : parent.drawSeed,
  };
  const origin = axis === "position-vary" && positionOrigin ? positionOrigin : cloneOrigin(parent.origin);

  const state = replay(origin, seeds, prefix, { ...parent.priorities });
  // A branch's ref is an IDENTITY, not a derived value, so it is fresh. Deriving
  // it from drawSeed + forkPoint meant two branches taken from the same season had
  // the same ref and writeFork's dedupe silently replaced the first with the
  // second — the player branched twice and got one branch. Adding parentRef and
  // axis was not enough either: two branches of the same kind from the same saved
  // point still collided, which is exactly the case a player hits when they want
  // to try a third thing from one decision.
  //
  // This does NOT touch determinism. Replay reads `seeds`, `forkPoint` and
  // `suffix`; the ref is never an input to it. S-7 asserts both halves.
  const ref = makeRef("fork", freshSeed());
  return {
    record: { ref, parentRef, forkPoint, seeds, label, suffix: [] },
    state: { ...state, fork: { ref, parentRef, forkPoint, label } },
  };
}

/** Deep-copy a committed season so a fork can never alias the parent's ledger. */
function cloneSeason(s: CommittedSeason): CommittedSeason {
  return {
    seasonIndex: s.seasonIndex,
    allocations: s.allocations.map((a) => ({ ...a })),
    eventResponses: s.eventResponses.map((e) => ({ ...e })),
    priorityRevision: s.priorityRevision ? { ...s.priorityRevision } : undefined,
    beatResponse: s.beatResponse ? { ...s.beatResponse } : undefined,
    forkPoint: s.forkPoint,
  };
}

function cloneOrigin(o: SimState["origin"]): SimState["origin"] {
  return o.kind === "preset" ? { kind: "preset", presetId: o.presetId } : { kind: "birth-rng" };
}

/**
 * Replay a fork record from its parent's ledger. Takes the parent's committed list
 * BY VALUE — never the parent state object — so there is nothing to corrupt.
 */
export function replayFork(
  record: ForkRecord,
  parentOrigin: SimState["origin"],
  parentCommitted: CommittedSeason[],
  priorities?: SimState["priorities"],
): SimState {
  const ledger = [...parentCommitted.slice(0, record.forkPoint).map(cloneSeason), ...record.suffix.map(cloneSeason)];
  const s = replay(cloneOrigin(parentOrigin), record.seeds, ledger, priorities);
  return { ...s, fork: { ref: record.ref, parentRef: record.parentRef, forkPoint: record.forkPoint, label: record.label } };
}

/* =========================================================================
   Named saves (§3.8)
   ========================================================================= */

export function makeSave(state: SimState, label: string, savedAtLabel: string): NamedSave {
  return {
    ref: makeRef("save", state.drawSeed + String(state.seasonIndex)),
    label,
    savedAtLabel,
    schemaVersion: state.schemaVersion,
    engineVersion: state.engineVersion,
    contentVersion: state.contentVersion,
    state,
  };
}

/**
 * What save inspection shows (§2.3.8): the seed, the engine version, and the
 * content version, so a reader can always see what a run was made of.
 */
export function inspect(save: NamedSave): { field: string; value: string }[] {
  return [
    { field: "hand seed", value: save.state.handSeed },
    { field: "draw seed", value: save.state.drawSeed },
    { field: "simulation version", value: save.engineVersion },
    { field: "content version", value: save.contentVersion },
    { field: "started from", value: save.state.origin.kind === "preset" ? save.state.origin.presetId : "a drawn hand" },
    { field: "branch", value: save.state.fork ? `a fork of ${save.state.fork.parentRef}` : "a root run" },
  ];
}
