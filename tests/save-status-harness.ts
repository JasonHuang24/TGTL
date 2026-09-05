/**
 * C-1 (N-226) — the save-status harness.
 *
 * Run: npx tsx tests/save-status-harness.ts
 * Spawned by `npm run gates:consolidation` as gate C-1.
 *
 * The failure this exists to catch: `lib/storage.ts`'s `writeString` swallows
 * every throw, so a storage layer that is full, blocked, or lying could not
 * report a failure, and the campaign's save button set the notice "Saved to this
 * device." unconditionally. A save that cannot fail is a promise, not a fact.
 *
 * Every case below drives the REAL persistence functions against a stubbed
 * `window.localStorage` and asserts on what they RETURN — not on what the
 * storage happens to contain, which is the thing under test.
 *
 * Proven red against the pre-N-226 code: every case failed there, because
 * `saveRun` returned no status at all. The verbatim output is in the batch
 * report and in DECISIONS.md section 8.
 */
import { newCampaign } from "@/lib/sim/campaign";
import { saveRun, loadSave, SIM_KEYS } from "@/lib/sim/persist";
import { initRun } from "@/lib/engine/run";
import { saveRun as saveArcActive, saveArcRun, listArcSaves, loadArcSave } from "@/lib/engine/persist";
import { STORAGE_KEYS } from "@/lib/storage";

type Mode = "ok" | "throw-quota" | "throw-plain" | "mutate" | "refuse";

let mode: Mode = "ok";
const store = new Map<string, string>();

class FakeQuotaError extends Error {
  name = "QuotaExceededError";
  code = 22;
}

const fakeLocalStorage = {
  getItem(key: string): string | null {
    return store.has(key) ? (store.get(key) as string) : null;
  },
  setItem(key: string, value: string): void {
    if (mode === "throw-quota") throw new FakeQuotaError("The quota has been exceeded.");
    if (mode === "throw-plain") throw new Error("Access to storage is denied.");
    if (mode === "refuse") return; // accepts the call, stores nothing — the silent liar
    if (mode === "mutate") {
      store.set(key, value.slice(0, Math.max(0, value.length - 3)));
      return;
    }
    store.set(key, value);
  },
  removeItem(key: string): void {
    store.delete(key);
  },
};

// lib/storage.ts reads `window.localStorage` at CALL time, so installing the stub
// after the imports is enough and no module needs to be re-loaded.
(globalThis as unknown as { window: unknown }).window = { localStorage: fakeLocalStorage };

let failed = 0;
const details: string[] = [];
function check(name: string, ok: boolean, saw: string): void {
  if (ok) {
    console.log(`  ok    ${name}`);
  } else {
    failed++;
    const line = `${name} — saw: ${saw}`;
    details.push(line);
    console.log(`  FAIL  ${line}`);
  }
}

function reset(next: Mode): void {
  store.clear();
  mode = next;
}

/** The seven states (blueprint 6.0 section 7.1). The words are latitude; the states are not. */
const SEVEN = ["saved", "memory-only", "blocked", "full", "malformed-quarantined", "migrated", "unresumable"];
/** Not "saved" is not enough: a value carrying NO status also is not "saved". */
const reports = (s: string): boolean => SEVEN.includes(s);

function statusOf(v: unknown): string {
  if (v && typeof v === "object" && "status" in (v as Record<string, unknown>))
    return String((v as Record<string, unknown>).status);
  if (typeof v === "string") return v;
  return `no status on the returned value (${typeof v === "object" ? "object" : typeof v})`;
}

const state = newCampaign({ origin: { kind: "preset", presetId: "preset-supported-explorer" }, handSeed: "c1", drawSeed: "c1-d" });
const arc = initRun({ handSeed: "c1", drawSeed: "c1-d" });

console.log("C-1 · the campaign save path (lib/sim/persist.ts)");

// 1. QUOTA. A full device must say so, and must never say saved.
reset("throw-quota");
{
  const r = saveRun(state, "A run", "half of a year");
  const s = statusOf(r);
  check("a quota failure never reports saved", reports(s) && s !== "saved", s);
  check("a quota failure reports the full status", s === "full", s);
}

// 2. BLOCKED. A refusal that throws is not the same as a device that is full.
reset("throw-plain");
{
  const r = saveRun(state, "A run", "half of a year");
  const s = statusOf(r);
  check("a blocked write never reports saved", reports(s) && s !== "saved", s);
  check("a blocked write reports the blocked status", s === "blocked", s);
}

// 3. READBACK MISMATCH. The write is accepted and the bytes differ.
reset("mutate");
{
  const r = saveRun(state, "A run", "half of a year");
  const s = statusOf(r);
  check("a readback mismatch never reports saved", reports(s) && s !== "saved", s);
}

// 4. SILENT REFUSAL. setItem accepts and stores nothing — the case a try/catch
//    cannot see at all, and the reason readback exists.
reset("refuse");
{
  const r = saveRun(state, "A run", "half of a year");
  const s = statusOf(r);
  check("a silently dropped write never reports saved", reports(s) && s !== "saved", s);
}

// 5. THE HAPPY PATH still says saved, or the gate is asserting nothing.
reset("ok");
{
  const r = saveRun(state, "A run", "half of a year");
  const s = statusOf(r);
  check("a write that reads back identical reports saved", s === "saved", s);
}

// 6. MALFORMED ORIGINAL. An unparseable save is quarantined under a suffix on
//    the same key and REPORTED — never overwritten, never silently dropped.
reset("ok");
{
  const saved = saveRun(state, "A run", "half of a year") as unknown as { ref: string };
  const key = `${SIM_KEYS.saves}:${saved.ref}`;
  const original = "{ this is not json";
  store.set(key, original);
  const loaded = loadSave(saved.ref) as unknown as { ok: boolean; status?: string };
  check(
    "a malformed save is reported as quarantined",
    loaded.ok === false && loaded.status === "malformed-quarantined",
    `ok=${String(loaded.ok)} status=${String(loaded.status)}`,
  );
  check(
    "the malformed original is kept under the quarantine suffix",
    store.get(`${key}.quarantine`) === original,
    String(store.get(`${key}.quarantine`)),
  );
  check("the malformed original is not overwritten in place", store.get(key) === original, String(store.get(key)));
}

console.log("C-1 · the arc save path (lib/engine/persist.ts)");

// 7. The arc's active-run write reports its own status.
reset("throw-quota");
{
  const s = statusOf(saveArcActive(arc));
  check("the arc's active write never reports saved when the device is full", reports(s) && s !== "saved", s);
}
reset("throw-plain");
{
  const s = statusOf(saveArcActive(arc));
  check("the arc's active write reports blocked when storage refuses", s === "blocked", s);
}
reset("ok");
{
  const s = statusOf(saveArcActive(arc));
  check("the arc's active write reports saved when it reads back", s === "saved", s);
}

// 8. The arc's named saves.
reset("throw-quota");
{
  const s = statusOf(saveArcRun(arc, "A life", "from the bar"));
  check("a named arc save never reports saved when the device is full", reports(s) && s !== "saved", s);
}
reset("ok");
{
  const s = statusOf(saveArcRun(arc, "A life", "from the bar"));
  check("a named arc save reports saved when it reads back", s === "saved", s);
}

// 9. A malformed arc save list is quarantined rather than silently emptied.
reset("ok");
{
  saveArcRun(arc, "A life", "from the bar");
  const original = "[ not json at all";
  store.set(STORAGE_KEYS.playSaves, original);
  const list = listArcSaves();
  check("a malformed arc save list reads as empty rather than throwing", Array.isArray(list), typeof list);
  check(
    "the malformed arc save list is kept under the quarantine suffix",
    store.get(`${STORAGE_KEYS.playSaves}.quarantine`) === original,
    String(store.get(`${STORAGE_KEYS.playSaves}.quarantine`)),
  );
}

// 10. A save from an older run version is UNRESUMABLE, said in that word.
reset("ok");
{
  const save = saveArcRun(arc, "A life", "from the bar") as unknown as { ref: string };
  const raw = store.get(STORAGE_KEYS.playSaves) as string;
  store.set(STORAGE_KEYS.playSaves, raw.replace(/"runVersion":\s*\d+/, '"runVersion":0'));
  const r = loadArcSave(save.ref) as unknown as { ok: boolean; status?: string };
  check(
    "a save from an older version reports unresumable",
    r.ok === false && r.status === "unresumable",
    `ok=${String(r.ok)} status=${String(r.status)}`,
  );
}

console.log("");
if (failed === 0) {
  console.log("C-1 HARNESS: all save-status cases pass");
  process.exit(0);
} else {
  console.log(`C-1 HARNESS: ${failed} case(s) FAILED`);
  for (const d of details) console.log(`   ${d}`);
  process.exit(1);
}
