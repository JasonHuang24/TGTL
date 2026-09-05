/**
 * N-306 (6.0 §3.11, C-51) — THE SUITES DO NOT DELETE A READER'S SAVED RUNS.
 *
 * Both browser suites open by clearing every `tgtl:play*` and `tgtl:sim2*` key so
 * they can drive a run from a known state. Against an ephemeral Playwright
 * context that is harmless. Against a real browser profile it is destructive the
 * first time anybody does it, and 4.0 added a named-save library that a reader can
 * actually have things in.
 *
 * So the clear becomes a THREE-STEP operation: record what is there, remove what
 * the walk needs gone, and put back everything that was recorded when the walk is
 * finished — including when it is finished by an exception, which is the path a
 * failing suite takes and therefore the path that matters most.
 *
 * WHAT IS PRESERVED is every `tgtl:` key, not only the ones being removed: a walk
 * that writes a value over the reader's own is the same loss by a different route.
 * The snapshot is taken once per page, before anything is touched, and the restore
 * writes the recorded value back over whatever the walk left behind.
 *
 * The store is keyed by the Playwright page, because storage is per context and a
 * value recorded in one context must never be written into another.
 */

const SNAPSHOTS = new WeakMap();

/** Every `tgtl:` key and value on the page, in sorted key order. */
export async function readLibrary(page) {
  const entries = await page.evaluate(() => {
    try {
      return Object.keys(localStorage)
        .filter((k) => k.startsWith("tgtl:"))
        .sort()
        .map((k) => [k, localStorage.getItem(k)]);
    } catch {
      return [];
    }
  });
  return entries;
}

/**
 * Record the page's library once, then remove the keys the walk needs gone.
 * `prefixes` is the list the caller used to remove with; nothing outside it is
 * removed, and everything is recorded.
 */
export async function preserveThenClear(page, prefixes) {
  if (!SNAPSHOTS.has(page)) SNAPSHOTS.set(page, await readLibrary(page));
  await page.evaluate((pre) => {
    try {
      for (const k of Object.keys(localStorage))
        if (pre.some((p) => k.startsWith(p))) localStorage.removeItem(k);
    } catch {}
  }, prefixes);
}

/** Whether this page ever had its library recorded (i.e. was ever cleared). */
export function wasPreserved(page) {
  return SNAPSHOTS.has(page);
}

/**
 * Put every recorded key/value back, overwriting whatever the walk wrote, and
 * remove the `tgtl:` keys the walk created that the reader never had. Safe to
 * call on a page that was never cleared: it does nothing.
 */
export async function restorePreserved(page) {
  const snap = SNAPSHOTS.get(page);
  if (!snap) return false;
  try {
    await page.evaluate((entries) => {
      try {
        const keep = new Set(entries.map(([k]) => k));
        for (const k of Object.keys(localStorage))
          if (k.startsWith("tgtl:") && !keep.has(k)) localStorage.removeItem(k);
        for (const [k, v] of entries) localStorage.setItem(k, v);
      } catch {}
    }, snap);
  } catch {
    // A closed page cannot be restored; the caller restores before closing, and
    // the harness in browser-gates.mjs proves that path stays wired.
    return false;
  }
  return true;
}

/** Run `fn`, restoring the page's library afterwards even if `fn` throws. */
export async function withPreservedLibrary(page, fn) {
  try {
    return await fn();
  } finally {
    await restorePreserved(page);
  }
}
