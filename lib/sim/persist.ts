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

import { readString, writeString, removeKey } from "@/lib/storage";
import { serialize, deserialize, type LoadResult } from "@/lib/sim/campaign";
import { makeSave } from "@/lib/sim/forks";
import type { ForkRecord, NamedSave, SimState } from "@/content/sim/schema";

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

type SaveIndex = { ref: string; label: string; savedAtLabel: string; engineVersion: string; contentVersion: string }[];

function readJSON<T>(key: string, fallback: T): T {
  const raw = readString(key);
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as T;
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): boolean {
  try {
    writeString(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function listSaves(): SaveIndex {
  return readJSON<SaveIndex>(SIM_KEYS.saves + ":index", []);
}

export function saveRun(state: SimState, label: string, savedAtLabel: string): NamedSave {
  const save = makeSave(state, label, savedAtLabel);
  // The run itself is written FIRST, so a quota failure on the index can never
  // eat the run (the 3.0 discipline, carried forward).
  writeJSON(`${SIM_KEYS.saves}:${save.ref}`, save);
  const index = listSaves().filter((s) => s.ref !== save.ref);
  const next = [
    { ref: save.ref, label, savedAtLabel, engineVersion: save.engineVersion, contentVersion: save.contentVersion },
    ...index,
  ];
  const kept = next.slice(0, SAVE_CAP);
  for (const dropped of next.slice(SAVE_CAP)) removeKey(`${SIM_KEYS.saves}:${dropped.ref}`);
  writeJSON(SIM_KEYS.saves + ":index", kept);
  return save;
}

export function loadSave(ref: string): LoadResult {
  const raw = readString(`${SIM_KEYS.saves}:${ref}`);
  if (!raw) return { ok: false, reason: "unreadable", detail: "That saved run is no longer on this device." };
  try {
    const save = JSON.parse(raw) as NamedSave;
    return deserialize(JSON.stringify(save.state));
  } catch {
    return { ok: false, reason: "unreadable", detail: "That saved run could not be read." };
  }
}

export function deleteSave(ref: string): void {
  removeKey(`${SIM_KEYS.saves}:${ref}`);
  writeJSON(SIM_KEYS.saves + ":index", listSaves().filter((s) => s.ref !== ref));
}

/* =========================================================================
   The active run
   ========================================================================= */

export function writeActive(state: SimState): void {
  try {
    writeString(SIM_KEYS.active, serialize(state));
  } catch {
    /* quota: the named saves are the durable copy */
  }
}

export function readActive(): LoadResult | null {
  const raw = readString(SIM_KEYS.active);
  return raw ? deserialize(raw) : null;
}

export function clearActive(): void {
  removeKey(SIM_KEYS.active);
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
  for (const s of listSaves()) removeKey(`${SIM_KEYS.saves}:${s.ref}`);
  removeKey(SIM_KEYS.saves + ":index");
  removeKey(SIM_KEYS.active);
  removeKey(SIM_KEYS.forks);
  removeKey(SIM_KEYS.parses);
}
