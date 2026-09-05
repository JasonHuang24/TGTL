/**
 * Run persistence (blueprint 3.0 §3.8, G-11). Local-only, try/catch everywhere,
 * quota-safe. The active run's key is written BEFORE any archive write, so a quota
 * exhaustion can never silently eat the live run. Nothing ever leaves the device;
 * nothing about a run appears in a URL.
 */

import {
  STORAGE_KEYS,
  readString,
  removeKey,
  writeVerified,
  quarantineValue,
  quarantineKeyFor,
  type SaveStatus,
} from "@/lib/storage";
import { serializeRun, deserializeRun } from "@/lib/engine/run";
import { CURRENT_RUN_VERSION, type RunState } from "@/content/play/schema";
import type { ParseSummary } from "@/lib/engine/run";

export const ARCHIVE_CAP = 20;
export const ARC_SAVE_CAP = 8;
export const ARC_SAVE_CAP_NOTE = `This device keeps up to ${ARC_SAVE_CAP} named lives. When you pass that, the oldest is dropped to make room — and you can erase all of it, completely, at any time.`;

export type ParseRecord = {
  handSeed: string;
  drawSeed: string;
  committed: RunState["committed"];
  summary: ParseSummary;
  /** A stable label the reader can read back — not a score. */
  savedAtLabel: string;
};

/** N-226 — the write is read back, and says which of the seven states happened. */
export function saveRun(state: RunState): SaveStatus {
  return writeVerified(STORAGE_KEYS.playRun, serializeRun(state));
}

export function loadRun(): RunState | null {
  const raw = readString(STORAGE_KEYS.playRun);
  return raw ? deserializeRun(raw) : null;
}

export function clearRun(): void {
  removeKey(STORAGE_KEYS.playRun);
  removeKey(quarantineKeyFor(STORAGE_KEYS.playRun));
}

export function hasActiveRun(): boolean {
  return loadRun() !== null;
}

export function loadArchive(): ParseRecord[] {
  const raw = readString(STORAGE_KEYS.playArchive);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ParseRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // N-226: keep the unreadable original under its quarantine key rather than
    // letting the next archive write silently overwrite it.
    quarantineValue(STORAGE_KEYS.playArchive, raw);
    return [];
  }
}

/**
 * Append a parse to the archive, capped at the most recent ARCHIVE_CAP (§3.8).
 * The active run is preserved first by the caller; this only touches the archive
 * key, and drops the oldest silently if quota still bites.
 */
export function archiveParse(record: ParseRecord): ParseRecord[] {
  const existing = loadArchive();
  const next = [record, ...existing].slice(0, ARCHIVE_CAP);
  if (writeVerified(STORAGE_KEYS.playArchive, JSON.stringify(next)) !== "saved") {
    // Full or refused: retain only the newest few rather than losing the write
    // entirely. Still verified — a shorter list that did not land is not saved.
    writeVerified(STORAGE_KEYS.playArchive, JSON.stringify(next.slice(0, 5)));
  }
  return next;
}

export function clearArchive(): void {
  removeKey(STORAGE_KEYS.playArchive);
  removeKey(quarantineKeyFor(STORAGE_KEYS.playArchive));
}


/* =========================================================================
   NAMED SAVES (blueprint 4.0 §2.3.7, §3.2 — the fifth sanctioned Life Arc delta)
   =========================================================================
   The arc had one active run and no way to keep a life you wanted to come back
   to: starting a new one overwrote it. This is the campaign's named-save model,
   in the smallest form the arc needs — a named list, resumable and deletable,
   capped out loud, with the same migration honesty the campaign uses. A save from
   an older engine is DECLARED unresumable rather than silently resumed or
   silently dropped.
   ========================================================================= */

export type ArcSave = {
  ref: string;
  label: string;
  savedAtLabel: string;
  runVersion: number;
  raw: string;
};

export type ArcLoadResult = { status: SaveStatus } & (
  | { ok: true; state: RunState }
  | { ok: false; reason: "unreadable" | "stale-version"; detail: string }
);

/** Stable per (seed, phase) so re-saving the same point replaces rather than piles up. */
function arcRef(state: RunState): string {
  let h = 0;
  const key = `${state.handSeed}:${state.drawSeed}:${state.act}:${state.phase}`;
  for (let i = 0; i < key.length; i++) h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
  return `arc-${(h >>> 0).toString(36)}`;
}

export function listArcSaves(): ArcSave[] {
  const raw = readString(STORAGE_KEYS.playSaves);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ArcSave[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // N-226: an unreadable list is kept aside under its own name, so the next
    // save does not overwrite the only copy of what was there.
    quarantineValue(STORAGE_KEYS.playSaves, raw);
    return [];
  }
}

/** N-226 — the return carries the status the verified write actually produced. */
export function saveArcRun(state: RunState, label: string, savedAtLabel: string): ArcSave & { status: SaveStatus } {
  const save: ArcSave = { ref: arcRef(state), label, savedAtLabel, runVersion: state.version, raw: serializeRun(state) };
  const next = [save, ...listArcSaves().filter((s) => s.ref !== save.ref)].slice(0, ARC_SAVE_CAP);
  let status = writeVerified(STORAGE_KEYS.playSaves, JSON.stringify(next));
  if (status !== "saved") {
    // Out of room: keep the newest few rather than losing the write entirely —
    // and report what the second attempt actually did, never "saved" on faith.
    status = writeVerified(STORAGE_KEYS.playSaves, JSON.stringify(next.slice(0, 2)));
  }
  return { ...save, status };
}

export function loadArcSave(ref: string): ArcLoadResult {
  const save = listArcSaves().find((s) => s.ref === ref);
  if (!save)
    return { ok: false, reason: "unreadable", detail: "That saved life is no longer on this device.", status: "blocked" };
  if (save.runVersion !== CURRENT_RUN_VERSION)
    return {
      ok: false,
      reason: "stale-version",
      detail:
        "This life was saved by an earlier version of the simulation. The rules it was played under have changed, so resuming it would not be the same run you left — it cannot be continued. Nothing has been deleted; you can remove it here whenever you like.",
      status: "unresumable",
    };
  const state = deserializeRun(save.raw);
  if (!state) {
    quarantineValue(STORAGE_KEYS.playSaves, save.raw);
    return {
      ok: false,
      reason: "unreadable",
      detail:
        "That saved life could not be read. It has been kept aside under its own name rather than overwritten, and nothing has been deleted.",
      status: "malformed-quarantined",
    };
  }
  return { ok: true, state, status: "saved" };
}

export function deleteArcSave(ref: string): ArcSave[] {
  const next = listArcSaves().filter((s) => s.ref !== ref);
  writeVerified(STORAGE_KEYS.playSaves, JSON.stringify(next));
  return next;
}

export function clearArcSaves(): void {
  removeKey(STORAGE_KEYS.playSaves);
  removeKey(quarantineKeyFor(STORAGE_KEYS.playSaves));
}
