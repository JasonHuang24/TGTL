/**
 * LOCAL-ONLY PERSISTENCE for the v2 sim (blueprint 4.0 §3.8, §2.4, §7.1; G-11).
 *
 * Everything lives in `localStorage` and nowhere else. Nothing about a run ever
 * appears in a URL, leaves the device, or is sent anywhere — there is no account,
 * no analytics, and no network call in this file or reachable from it.
 *
 * MIGRATION HONESTY (§2.4), the rule this file exists to keep:
 *   - v2 keys are namespaced (`tgtl:sim2:*`), so 3.0's keys are untouched.
 *   - A legacy 3.0 PARSE ARCHIVE renders read-only from its stored summary.
 *   - A legacy 3.0 ACTIVE RUN is declared unresumable in plain language, with the
 *     erase control beside it. Never a silent loss; never a blank resume.
 *   - A v2 save from an older engine or content version gets the same treatment.
 *   - Caps are stated beside the erase control, not enforced invisibly.
 */

import {
  readString,
  removeKey,
  writeVerified,
  quarantineValue,
  quarantineKeyFor,
  worseStatus,
  type SaveStatus,
} from "@/lib/storage";
import { serialize, deserialize, type LoadResult } from "@/lib/sim/campaign";
import { makeSave } from "@/lib/sim/forks";
import { CONTENT_VERSION } from "@/content/sim/schema";
import type { ForkRecord, NamedSave, SeasonRecord, SeasonResult, SimState } from "@/content/sim/schema";

/**
 * 6.0 §7.1 names `SeasonRecord` as this module's schema delta (N-216). The type
 * itself is declared in `content/sim/schema.ts` because `SimState` carries the
 * records and schema.ts cannot import from here without a cycle; it is re-exported
 * under this module's name so the delta is where the blueprint says it is.
 */
export type { SeasonRecord };

/** v2 keys — namespaced so nothing collides with the 3.0 arc's storage (§2.4). */
export const SIM_KEYS = {
  saves: "tgtl:sim2:saves",
  active: "tgtl:sim2:active",
  forks: "tgtl:sim2:forks",
  parses: "tgtl:sim2:parses",
} as const;

/** 3.0's keys, read ONLY to declare legacy state honestly. Never written. */
export const LEGACY_KEYS = {
  run: "tgtl:play:run",
  archive: "tgtl:play:archive",
} as const;

/** Stated beside the erase control, never enforced silently. */
export const SAVE_CAP = 12;
export const FORK_CAP = 24;
export const CAP_NOTE = `This device keeps up to ${SAVE_CAP} named runs and ${FORK_CAP} branches. When you pass that, the oldest is dropped to make room — and you can erase all of it here, completely, at any time.`;

/* =========================================================================
   Named saves
   ========================================================================= */

/**
 * The index the saves panel lists from. `handSeed` and `drawSeed` joined it for
 * N-234: the seeded-randomness contract promises the seed is INSPECTABLE, and
 * `inspect()` in lib/sim/forks.ts — which returns exactly that — has been exported
 * since 4.0 and called by nothing, so the promise was kept only inside the
 * payload. Both are optional so an index written before 6.0 still lists.
 */
type SaveIndex = {
  ref: string;
  label: string;
  savedAtLabel: string;
  engineVersion: string;
  contentVersion: string;
  handSeed?: string;
  drawSeed?: string;
}[];

/**
 * N-226 — a `LoadResult` that also says which of the seven states happened.
 * `LoadResult` itself lives in `lib/sim/campaign.ts`, which this version does not
 * touch (6.0 §2.1), so the status rides on an intersection declared here.
 */
export type LoadReport = LoadResult & { status: SaveStatus };

/**
 * Read JSON, and QUARANTINE an unparseable original rather than returning the
 * fallback over the top of it (N-226). The original bytes stay where they are;
 * a copy goes to `<key>.quarantine`, which `ALL_STORAGE_KEYS` derives and the
 * erase control clears.
 */
function readJSON<T>(key: string, fallback: T): T {
  const raw = readString(key);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    quarantineValue(key, raw);
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): SaveStatus {
  let text: string;
  try {
    text = JSON.stringify(value);
  } catch {
    return "blocked";
  }
  return writeVerified(key, text);
}

export function listSaves(): SaveIndex {
  return readJSON<SaveIndex>(SIM_KEYS.saves + ":index", []);
}

/**
 * N-226 — the return carries the STATUS the write actually produced. A run that
 * was written but could not be indexed is not "saved" either: the reader would
 * not find it again, so the worse of the two halves is what is reported.
 */
export function saveRun(state: SimState, label: string, savedAtLabel: string): NamedSave & { status: SaveStatus } {
  const save = makeSave(state, label, savedAtLabel);
  // The run itself is written FIRST, so a quota failure on the index can never
  // eat the run (the 3.0 discipline, carried forward).
  const runStatus = writeJSON(`${SIM_KEYS.saves}:${save.ref}`, save);
  const index = listSaves().filter((s) => s.ref !== save.ref);
  const next = [
    {
      ref: save.ref,
      label,
      savedAtLabel,
      engineVersion: save.engineVersion,
      contentVersion: save.contentVersion,
      handSeed: save.state.handSeed,
      drawSeed: save.state.drawSeed,
    },
    ...index,
  ];
  const kept = next.slice(0, SAVE_CAP);
  for (const dropped of next.slice(SAVE_CAP)) removeKey(`${SIM_KEYS.saves}:${dropped.ref}`);
  const indexStatus = writeJSON(SIM_KEYS.saves + ":index", kept);
  return { ...save, status: worseStatus(runStatus, indexStatus) };
}

export function loadSave(ref: string): LoadReport {
  const key = `${SIM_KEYS.saves}:${ref}`;
  const raw = readString(key);
  if (!raw)
    return { ok: false, reason: "unreadable", detail: "That saved run is no longer on this device.", status: "blocked" };
  let save: NamedSave;
  try {
    save = JSON.parse(raw) as NamedSave;
  } catch {
    // The original is kept aside under its own name, not overwritten (N-226).
    quarantineValue(key, raw);
    return {
      ok: false,
      reason: "unreadable",
      detail:
        "That saved run could not be read. It has been kept aside under its own name rather than overwritten, and nothing has been deleted.",
      status: "malformed-quarantined",
    };
  }
  const result = deserialize(JSON.stringify(save.state));
  if (result.ok) return { ...result, status: "saved" };
  return { ...result, status: result.reason === "unreadable" ? "blocked" : "unresumable" };
}

export function deleteSave(ref: string): void {
  removeKey(`${SIM_KEYS.saves}:${ref}`);
  removeKey(quarantineKeyFor(`${SIM_KEYS.saves}:${ref}`));
  writeJSON(SIM_KEYS.saves + ":index", listSaves().filter((s) => s.ref !== ref));
}

/* =========================================================================
   THE LIVING RECORD (N-216, N-223) — the explanation a player actually read,
   kept beside the ledger rather than re-derived from it.
   =========================================================================
   `replay()` rebuilds every derived value from origin + seeds + committed ledger.
   That is what makes the model checkable, and it is also why a content edit
   rewrites the past: the sentence a reader met at twenty-two is replaced by
   whatever the current pool would produce for the same coordinates. The three
   functions below are the whole of the fix — write the text at resolve time,
   stamp it with the version that produced it, and read it back rather than
   recomputing it.

   NOTHING HERE IS A NEW STORAGE KEY (§7.1). The records ride inside the existing
   save payload, on the state, under `seasonRecords`.
   ========================================================================= */

/**
 * The season's explanation as the consequences screen rendered it: the lead line
 * first (the same lead the look-back's season list picks — the first action, or
 * the first item if the season had none), then every other line in resolution
 * order. Pure, and the ONLY place the text is composed, so what is stored and what
 * would be recomputed cannot drift apart by construction.
 */
export function explanationOf(result: SeasonResult): string {
  const lead = result.items.find((i) => i.kind === "action") ?? result.items[0];
  const out: string[] = [];
  if (lead?.line) out.push(lead.line);
  for (const item of result.items) if (item !== lead && item.line) out.push(item.line);
  return out.join("\n");
}

/**
 * Store this season's explanation on the run, stamped with the content version
 * that produced it. Called once, where the season is committed. Re-resolving the
 * same season index replaces its record rather than appending a second one.
 */
export function recordExplanations(state: SimState, result: SeasonResult): SimState {
  const explanation = explanationOf(result);
  if (!explanation) return state;
  const kept = (state.seasonRecords ?? []).filter((r) => r.seasonIndex !== result.seasonIndex);
  return {
    ...state,
    seasonRecords: [...kept, { seasonIndex: result.seasonIndex, explanation, contentVersion: CONTENT_VERSION }].sort(
      (a, b) => a.seasonIndex - b.seasonIndex,
    ),
  };
}

/** What the season list reopens: the stored text, or null when there is none. */
export function storedExplanationFor(state: SimState, seasonIndex: number): SeasonRecord | null {
  return (state.seasonRecords ?? []).find((r) => r.seasonIndex === seasonIndex) ?? null;
}

/**
 * N-223 — the content-version drift on a resumed run: the stamps carried by the
 * stored explanations that are not the version the reader is now on.
 *
 * A KNOWN LIMIT, recorded rather than papered over. `deserialize` in
 * `lib/sim/campaign.ts` declares a save from a different content version
 * UNRESUMABLE (4.0 §2.4, unchanged by 6.0), so through the shipped load paths a
 * run can never come back carrying a stamp that differs from the live one, and
 * this predicate is true of no state a player can currently reach. The notice is
 * built and guarded on it anyway, because the alternative — relaxing the migration
 * wall so that a mixed record becomes resumable — is a change to a safety rule and
 * belongs to the owner, not to a batch. See the batch report's gap list.
 */
export function contentDrift(state: SimState): string[] {
  const stamps = new Set((state.seasonRecords ?? []).map((r) => r.contentVersion));
  stamps.delete(CONTENT_VERSION);
  return [...stamps];
}

/**
 * N-223's sentence, authored once here so the component and the gate read the
 * same string. "Not a controlled comparison" rather than "not a controlled
 * counterfactual": the reader is being told why two halves of their own record are
 * not comparable, which is the plainer word for the same fact.
 */
export const CONTENT_DRIFT_NOTICE =
  "Earlier explanations remain unchanged. New decisions use the current content; a version change is not a controlled comparison.";

/* =========================================================================
   The active run
   ========================================================================= */

export function writeActive(state: SimState): SaveStatus {
  return writeVerified(SIM_KEYS.active, serialize(state));
}

export function readActive(): LoadReport | null {
  const raw = readString(SIM_KEYS.active);
  if (!raw) return null;
  const result = deserialize(raw);
  if (result.ok) return { ...result, status: "saved" };
  return { ...result, status: result.reason === "unreadable" ? "blocked" : "unresumable" };
}

export function clearActive(): void {
  removeKey(SIM_KEYS.active);
  removeKey(quarantineKeyFor(SIM_KEYS.active));
}

/* =========================================================================
   Forks
   ========================================================================= */

export function listForks(): ForkRecord[] {
  return readJSON<ForkRecord[]>(SIM_KEYS.forks, []);
}

export function writeFork(record: ForkRecord): ForkRecord[] {
  const next = [record, ...listForks().filter((f) => f.ref !== record.ref)].slice(0, FORK_CAP);
  writeJSON(SIM_KEYS.forks, next);
  return next;
}

/**
 * Keep a branch's recorded suffix in step with the run being played on it.
 *
 * A ForkRecord's `suffix` is the seasons played AFTER the fork point — it is what
 * makes the branch replayable from its parent's ledger. Nothing wrote it, so every
 * branch stayed permanently empty: the saves panel listed it, and replaying it
 * would have rewound to the fork point and thrown away everything played since.
 * Called on every commit while the active run carries a fork tag.
 */
export function syncForkSuffix(ref: string, suffix: ForkRecord["suffix"]): void {
  const all = listForks();
  const i = all.findIndex((f) => f.ref === ref);
  if (i < 0) return;
  all[i] = { ...all[i], suffix };
  writeJSON(SIM_KEYS.forks, all);
}

export function deleteFork(ref: string): ForkRecord[] {
  const next = listForks().filter((f) => f.ref !== ref);
  writeJSON(SIM_KEYS.forks, next);
  return next;
}

/* =========================================================================
   Legacy 3.0 state — declared, never silently handled (§2.4)
   ========================================================================= */

export type LegacyState = {
  /** A 3.0 active run exists on this origin. It cannot be continued. */
  hasLegacyRun: boolean;
  /** How many 3.0 parse archives exist. These stay readable, read-only. */
  legacyArchiveCount: number;
  notice: string;
};

/**
 * NOT RENDERED ANYWHERE, and deliberately.
 *
 * `LEGACY_KEYS.run` is `tgtl:play:run` — which is ALSO the live storage key of
 * 4.0's own Life Arc. The campaign used to render the notice below whenever that
 * key existed, with an erase button wired to `eraseLegacyRun`; since Playthrough
 * writes the key on its very first mount, opening /play/arc once was enough to
 * make the campaign tell the reader they had an unresumable run from an earlier
 * version and offer to delete their live one. Which version wrote it cannot be
 * told from the payload — `RunState.version` is 1 in 3.0 and in 4.0 — and it is
 * not the campaign's question: /play/arc loads that key and declares its own
 * state. Kept for the device-wide erase path, which clears it either way.
 */
export const LEGACY_RUN_NOTICE =
  "There is a life in progress on this device from an earlier version of the simulation. The rules it was played under have changed, so continuing it would not be the same run you left — it cannot be resumed. Nothing has been deleted: the run is still here until you erase it, and the finished runs in your history stay readable.";

export function inspectLegacy(): LegacyState {
  const run = readString(LEGACY_KEYS.run);
  const archive = readJSON<unknown[]>(LEGACY_KEYS.archive, []);
  const count = Array.isArray(archive) ? archive.length : 0;
  return {
    hasLegacyRun: Boolean(run),
    legacyArchiveCount: count,
    notice: LEGACY_RUN_NOTICE,
  };
}

/** Erase the legacy active run. Explicit, reader-initiated, complete. */
export function eraseLegacyRun(): void {
  removeKey(LEGACY_KEYS.run);
}

/** Erase everything this simulation has ever written on this device. */
export function eraseAll(): void {
  // Every key this module writes, and the quarantine copy derived from each one
  // (N-226) — the erase control still clears everything, §7.1.
  const keys = [
    ...listSaves().map((s) => `${SIM_KEYS.saves}:${s.ref}`),
    SIM_KEYS.saves + ":index",
    SIM_KEYS.active,
    SIM_KEYS.forks,
    SIM_KEYS.parses,
  ];
  for (const k of keys) {
    removeKey(k);
    removeKey(quarantineKeyFor(k));
  }
}
