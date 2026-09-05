/**
 * Local-only personal state (blueprint §G-11, §8, §11.4 gate 9).
 *
 * Every reader input lives in localStorage and NOWHERE else — never a URL,
 * never a network request. Every access is wrapped in try/catch so a page
 * renders correctly with no stored value (private windows, cleared storage,
 * storage disabled). Nothing here ever runs on the server.
 */

export const STORAGE_KEYS = {
  edition: "tgtl:edition",
  reduceFraming: "tgtl:reduce-framing",
  theme: "tgtl:theme",
  entranceSeen: "tgtl:entrance-seen",
  guidance: "tgtl:guidance",
  board: "tgtl:board",
  logs: "tgtl:logs",
  dailyPlan: "tgtl:daily-plan",
  roadmap: "tgtl:roadmap",
  credentialPosition: "tgtl:credential-position",
  playRun: "tgtl:play:run",
  playArchive: "tgtl:play:archive",
  playSaves: "tgtl:play:saves",
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * N-226 — the quarantine suffix. An unparseable stored value is COPIED to
 * `<key>.quarantine` and left where it is, rather than overwritten by a fresh
 * write, so nothing a reader had is destroyed by the act of failing to read it.
 * This is a suffix on an existing key's name, NOT a new storage key: 6.0 §7.1
 * says `STORAGE_KEYS` is unchanged and the erase control still clears everything
 * because the suffix keys are DERIVED below.
 */
export const QUARANTINE_SUFFIX = ".quarantine";

export function quarantineKeyFor(key: string): string {
  return key + QUARANTINE_SUFFIX;
}

/** All keys this site may write — used by the "erase everything" control (§8). */
export const ALL_STORAGE_KEYS: string[] = [
  ...Object.values(STORAGE_KEYS),
  ...Object.values(STORAGE_KEYS).map(quarantineKeyFor),
];

/* =========================================================================
   N-226 — HONEST SAVE STATUS (blueprint 6.0 §3.9, §7.1; C-1)
   =========================================================================
   `writeString` below swallows every throw, which is correct for a theme
   preference and wrong for a save: a storage layer that is full, blocked, or
   quietly dropping writes could not report a failure, and the save UI said
   "Saved to this device." either way. `writeVerified` writes and then READS BACK
   what it wrote, and returns which of the seven states actually happened.

   The seven states are LITERAL (§7.1); the words are latitude (§11).
   ========================================================================= */

export type SaveStatus =
  /** Written, and the readback matched what was written. */
  | "saved"
  /** No storage on this device or in this context — the value exists only while the page is open. */
  | "memory-only"
  /** Storage refused the write, or accepted it and did not keep it. */
  | "blocked"
  /** Storage is out of room. */
  | "full"
  /** What was stored could not be read; the original is kept under its quarantine key. */
  | "malformed-quarantined"
  /** Read in an older shape and rewritten in the current one. */
  | "migrated"
  /** Readable, and cannot be continued — the rules it was played under have changed. */
  | "unresumable";

/** What a reader is told. Never "saved" unless the readback said so (C-1). */
export const SAVE_STATUS_WORDS: Record<SaveStatus, string> = {
  saved: "Saved to this device.",
  "memory-only":
    "Not saved. This device is not letting the page store anything, so this run is only here while the page is open.",
  blocked:
    "Not saved. This device refused to keep it — a private window or blocked site data will do that. The run is still here while the page is open.",
  full: "Not saved. There is no room left in this device's storage for the page. Erasing something below makes room.",
  "malformed-quarantined":
    "That save could not be read. It has been kept aside under its own name rather than overwritten, and nothing has been deleted.",
  migrated: "Read from an older format and written back in the current one. Nothing was lost.",
  unresumable:
    "That one cannot be continued: it was saved under rules that have since changed. Nothing has been deleted.",
};

/** Ordered worst-first, so a two-step write reports the worse of its two halves. */
const STATUS_SEVERITY: SaveStatus[] = [
  "blocked",
  "full",
  "malformed-quarantined",
  "unresumable",
  "memory-only",
  "migrated",
  "saved",
];

/** The worse of two outcomes — a run written but not indexed is not "saved". */
export function worseStatus(a: SaveStatus, b: SaveStatus): SaveStatus {
  return STATUS_SEVERITY.indexOf(a) <= STATUS_SEVERITY.indexOf(b) ? a : b;
}

function isQuotaError(e: unknown): boolean {
  if (!e || typeof e !== "object") return false;
  const err = e as { name?: string; code?: number };
  if (typeof err.name === "string" && /quota|QUOTA_EXCEEDED/i.test(err.name)) return true;
  return err.code === 22 || err.code === 1014;
}

/**
 * Write, then read back what was written. A throw, a refusal, or a mismatch is a
 * failure and says which. Nothing here ever reports "saved" on an unverified write.
 */
export function writeVerified(key: string, value: string): SaveStatus {
  if (typeof window === "undefined") return "memory-only";
  let store: Storage;
  try {
    store = window.localStorage;
  } catch {
    return "blocked";
  }
  if (!store) return "memory-only";
  try {
    store.setItem(key, value);
  } catch (e) {
    return isQuotaError(e) ? "full" : "blocked";
  }
  try {
    return store.getItem(key) === value ? "saved" : "blocked";
  } catch {
    return "blocked";
  }
}

/**
 * Keep an unreadable original instead of losing it. The bytes are copied to
 * `<key>.quarantine` and the original is LEFT IN PLACE — this function never
 * writes to `key`. Returns the status the caller reports to the reader.
 */
export function quarantineValue(key: string, raw: string): SaveStatus {
  writeVerified(quarantineKeyFor(key), raw);
  return "malformed-quarantined";
}

export function readString(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeString(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — the page must still work; drop silently */
  }
}

export function removeKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function readJSON<T>(key: string, fallback: T): T {
  const raw = readString(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    writeString(key, JSON.stringify(value));
  } catch {
    /* value not serializable — ignore */
  }
}

export function eraseAll(): void {
  for (const key of ALL_STORAGE_KEYS) removeKey(key);
}
