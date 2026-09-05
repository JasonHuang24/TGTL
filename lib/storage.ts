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

/** All keys this site may write — used by the "erase everything" control (§8). */
export const ALL_STORAGE_KEYS: string[] = Object.values(STORAGE_KEYS);

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
