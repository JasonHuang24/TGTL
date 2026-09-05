# The falsifiability audit

*Run 2026-08-27, after a stray eleven-hour process led to the discovery that an
S-11 assertion had been reporting green while containing a literal `0x08` byte —
the fourth assertion in this build found to be structurally incapable of failing.*

**The question asked of every assertion in every suite was not "is it green?" but
"could this come back red if the thing it guards were broken?"**

Ten agents, one per suite, hunted candidates. Every candidate went to a second
agent required to PROVE it inert by feeding the predicate input that should make
it fail — or to refute the claim. 57 agents, 0 errors.

**31 confirmed. 16 refuted.** The refutations matter as much: several assertions
that looked dead have real paths to red, and the provers found them.

---

## Confirmed findings


### `tests/sim-gates-4.ts:237` — **FIXED**  (certain, sandbox-1)

This is the runtime half of beat-channel isolation and it reads the wrong field. `QueueEntry` (content/sim/schema.ts:499-512) has NO field for the thing that was queued: `sourceRef` is typed `{ kind: "action" | "event"; id: string; seasonIndex: number }` and holds the id of the record that CAUSED the insertion. The queued ref (`insertion.refId`) is only folded into the composite `entry.id` string by `insert()` (lib/sim/queue.ts:31) and is never stored on its own. A beat reaching the queue would manifest as a refId — exactly what the authored-side checks at lines 220 and 228 look at (`q.refId`) — and this line never inspects it. Verified at runtime: queue entries come back as `id=action:act-body-creative-practice:s2:de-body-practice-compounds sourceRef=action:act-body-creative-practice`; every sourceRef.id observed was an action id. It is doubly dead: both `insert()` call sites (lib/sim/effects.ts:137, lib/sim/season.ts:759) take a `QueueEntry["sourceRef"]`-typed source, and lines 216/223 already forbid any beat id from existing as an Action or Event record, so `sourceRef.id` can never be in `beatIds` even if the runtime property were violated. Same shape as known defect #4: the check searches for something that cannot appear even when the bug is present.

<details><summary>the corrected assertion the prover established</summary>

corrected assertion (parses the queued ref out of entry.id):
  clean      -> 0 failures  (must be 0)
  poisoned A -> 1 failures: run: queue holds beat 'beat-loss' (entry action:act-body-habit-that-holds:s23:beat-loss)
  poisoned B -> 1 failures: run: queue holds beat 'beat-loss' (entry action:act-body-habit-that-holds:s24:beat-loss)

  parse sanity — queued refs on the clean queue: de-body-habit-compounds
```

A beat is provably sitting on the queue by both real insertion paths and the gate stays green.

## Refutation attempt (failed)

`…\scratchpad\probe-refute.ts` — the only way `sourceRef.id` could be a beat id is for a beat id to exist as a drawable Action or Event record, so I planted one: cloned the one action that empirically queues anything, re-id'd it `beat-loss`, pushed it into `ACTIONS`/`ACTION_BY_ID`, and biased the allocation policy to pick it every season.

```
queue after the planted-beat-action run: 0 entries
line 237 failures: 0

Same gate, static half — line 216 (beat as Event) failures: 0
Same gate, static half — line 223 (beat as Action) failures: 1
=> line 237 can only fire in a world where line 223 already fired: and it did NOT even here
```

Doubly dead, as claimed: line 237's only theoretical route to red is a world where line 223 — nine lines earlier in the same function — is already red, and even in that deliberately sabotaged world it stayed green.

## Bonus finding: the loop is nearly empty anyway

`…\scratchpad\probe-coverage.ts`:
```
(a) shipped assertion vs a hand-built sourceRef.id=beat-loss entry -> 1 failure (so the line WORKS; it is starved, not broken)
(b) queue entries the gate's 6 runs actually inspect at line 237: 1
    wider sweep (40 runs x 24 seasons): 23 entries, 20/40 runs ended with a non-empty queue
```
Across all six 24-season runs the loop body executes **once**. `state.queue` holds only *pending* entries; everything that resolved or expired during the run is gone by the time the gate looks. So even a field-correct check inspects roughly one entry per gate run.

## Corrected assertion

Fix the field **and** the sampling. `drivePolicy` already accepts an `onSeason?: (s: SimState) => void` callback (tests/sim-gates-4.ts:1798), so per-season inspection costs nothing:

```ts
// (e) A beat never reaches a queue at runtime, over real drives.
// entry.id is `${kind}:${sourceId}:s${season}:${refId}` (lib/sim/queue.ts:31) and the
// queued ref is stored NOWHERE else — sourceRef holds the CAUSING record, not the
// queued thing, so it can never be a beat id. Parse the ref back out.
const queuedRefOf = (q: QueueEntry)

</details>

### `tests/sim-gates-4.ts:443` — open  (certain, sandbox-1)

The comment declares this a self-test that the recovery predicate can fail at all — it is the anti-regression guard for known defect #1 (the floor route folded into the set being asserted non-empty). It contains no assertion: the value is computed and discarded by `void`. If `authoredRecoveryRoutesFor` were changed back to always return a non-empty set, this line would not go red, `!routes.length` at line 467 would never be true, and the thirty-untied-records failure would recur silently — exactly what the canary was written to prevent. Probed the value: `authoredRecoveryRoutesFor("act-wait")` returns one route (the self-route `act-wait/opt-wait-put-down`), so even the obvious intended assertion (`if (!canary.length) fail(...)`) would have been the wrong direction; as written it asserts nothing in either direction.

<details><summary>the corrected assertion the prover established</summary>

corrected assertion.** Two-sided, content-independent, at `tests/sim-gates-4.ts:441` (needs `recoveryRoutesFor` added to the `@/lib/sim/season` import at :57):

```ts
// A self-test first: the predicate must be capable of failing at all — the
// floor route folded into this set is what made the check below unfalsifiable.
const NO_SUCH = "__canary-no-such-record__";
const canary = authoredRecoveryRoutesFor(NO_SUCH);
if (canary.length)
  fail(
    `authoredRecoveryRoutesFor returned ${canary.length} route(s) for '${NO_SUCH}', which is not a record: an unconditional route is folded in, so '!routes.length' below can never be true. Got: ${canary.map((r) => `${r.actionId}/${r.optionId}`).join(", ")}`,
  );
// Provenance: every route must be attributable to THIS record — its own id, or
// one it names in recoveryRefs. Catches an unconditional member added only for
// records that exist, which the id probe above would sail past.
for (const rec of [...ACTIONS, ...EVENTS]) {
  const allowed = new Set<string>([rec.id, ...(rec.recoveryRefs ?? [])]);
  for (const r of authoredRecoveryRoutesFor(rec.id))
    if (!allowed.has(r.actionId)) {
      fail(`${rec.id}: authoredRecoveryRoutesFor returned '${r.actionId}/${r.optionId}', which this record neither is nor names in recoveryRefs — an unconditional route has leaked into the authored set`);
      break;
    }
}
// And the split must not collapse the other way: the PLAYER-facing list still
// has to carry the floor route, labelled untied, after any failure.
if (!recoveryRoutesFor(NO_SUCH).some((r) => !r.tied))
  fail(`recoveryRoutesFor no longer offers an untied floor route — the authored/floor split has collapsed and the player is shown nothing after a failure`);
```

**Probe 4 — proof the correction is falsifiable.** `.../scratchpad/p4.ts` runs those three assertions against the shipped function and against four mutations:

```
SHIPPED (correct)                            GREEN 0 finding(s)
REGRESSED fold floor, tied                   RED   153 finding(s)
     authoredRecoveryRoutesFor returned 2 route(s) for '__canary-no-such-record__', which is not a record: it folds in an unconditional route, so !routes.length below can never be true. Got: act-…
REGRESSED fold floor, existing records only  RED   152 finding(s)
     act-rest-maintain: authoredRecoveryRoutesFor returned 'act-seek-help/opt-help-person', which this record neither is nor names in recoveryRefs — an unconditional route has leaked into the au…
BROKEN always one route                      RED   153 finding(s)
     authoredRecoveryRoutesFor returned 1 route(

</details>

### `tests/sim-gates-4.ts:472` — open  (certain, sandbox-1)

`tied` is a hardcoded literal on every route this function can produce. `authoredRecoveryRoutesFor` (lib/sim/season.ts:714-726) calls `pushRoutes` at exactly two sites, both with the argument `true`, and `pushRoutes` (lib/sim/season.ts:681-698) writes that parameter straight into `routes.push({ ..., tied })`. There is no path by which `authoredRecoveryRoutesFor` returns a route with `tied === false` — the only `tied: false` push in the codebase lives in `recoveryRoutesFor` (lib/sim/season.ts:734), which this gate deliberately does not call. So the assertion tests a constant and cannot go red for the leak it names.

<details><summary>the corrected assertion the prover established</summary>

corrected assertion, code as shipped   : 0 reds  (must be 0)
  shipped assertion, split leaked        : 0 reds
  corrected assertion, split leaked      : 206 reds
```

**Reading.** Across all 389 routes the gate feeds it, `r.tied` takes one value, and it is the literal from two lines up the stack; the check has zero discriminating power over content. Reinstate the leak it names — the floor route folded into the authored set, written the way its two neighbours inside that function are written — and all 104 failure-capable records stay green while a record with no authored tie at all is handed `act-seek-help` and passes. The assertion goes red only for the one variant that leaks *and* copies the `false` label from `recoveryRoutesFor`; it is a label-consistency check on a literal, not a check that the split holds. Because the false-label variant exists, this is weaker than a pure tautology like `count >= 0`, but under the code as it stands it cannot fail, and for the leak that reproduces the original harm (thirty untied records green) it stays green. The stronger PASS line at sim-gates-4.ts:798 — "every failure-capable record carries a tied recovery route" — is carried entirely by the `!routes.length` check above it; line 472 contributes nothing to it.

**Corrected assertion.** Re-derive authored-ness from the *record's own content* instead of reading back the flag the function under test wrote:

```ts
const authoredTargets = new Set<string>([...(rec.recoveryRefs ?? []), ...(ACTION_BY_ID[rec.id] ? [rec.id] : [])]);
for (const r of routes) {
  if (!actionIds.has(r.actionId)) fail(`${rec.id}: recovery route points at unknown action '${r.actionId}'`);
  if (!authoredTargets.has(r.actionId))
    fail(`${rec.id}: authoredRecoveryRoutesFor returned '${r.actionId}', which is neither this record nor one of its recoveryRefs — the split has leaked`);
  if (!r.tied) fail(`${rec.id}: an authored route came back flagged untied`);   // keep as the cheap label check it actually is
}
```

**Proof the correction is falsifiable** (Parts 2–3 above, same probe): it is green on the shipped corpus (0 reds over 104 records, so it is a drop-in), and it goes red on every form of the leak — 206 reds across the corpus for the `tied: true` fold-in the shipped check misses, red on the `tied: false` fold-in, and red on a fold-in of a *different* unconditional action (`act-wait`), which the shipped check misses too.

**Caveat on the correction.** Nine `act-small-*` records legitimately name a floor action in their own `recoveryRefs` (`act-small-one-message`, `act-small-check-the-numbers`

</details>

### `tests/sim-gates-4.ts:1078 (block 1064–1080)` — open  (certain, sandbox-2)

Structurally incapable of going red, twice over. (1) The block contains no fail() at all — its only possible effect is a details.push note, so nothing in it can flip `ok`. (2) Even that note is unreachable: the loop passes an empty eventResponses array and never answers a pending event, so the FIRST commitSeason returns {done:false, pendingEvent:'evt-diane-check-in'} and `break` fires at i=0. I ran the block verbatim: iters=1, brokeAt=0, bands=[] — so `bands.length >= 4` is 0>=4, false, forever. The intended fixture never runs: when I supply the event responses the same loop yields six bands (["mixed","solid","solid","solid","solid","solid"], 2 distinct), i.e. the code that would produce evidence is exactly the code that is skipped. The comment heading claims "An actual replayed run: the same action taken twice lands independently" — no such property is tested anywhere in this block; a single commitSeason call is made and its result is discarded.

<details><summary>the corrected assertion the prover established</summary>

corrected assertion

Drop-in replacement for lines 1064–1080 (full working version at `…\scratchpad\probe-fix.ts`):

```ts
// (c) An actual replayed run: the same action taken twice lands independently.
{
  const rest = "act-rest-maintain";
  const origin = { kind: "preset", presetId: PRESETS[0].id } as const;
  const seeds = { handSeed: "rep", drawSeed: "rep-draw" };
  const priorities = { ...emptyPriorities(), safety: 2 };
  const OCC = 6;
  let s = setPriorities(newCampaign({ origin, ...seeds }), priorities);
  const seen: { coords: DrawCoords; band: string; line: string }[] = [];
  for (let i = 0; i < OCC; i++) {
    const ord = nextOrdinal(s, [], rest);
    const coords = { seasonIndex: s.seasonIndex, instanceOrdinal: ord, id: rest };
    const allocs = [{ actionId: rest, instanceOrdinal: ord, optionId: "opt-rest-hold" }];
    let responses: CommittedEventResponse[] = [];
    let out = commitSeason(s, allocs, responses);
    let guard = 0;
    while (!out.done && guard++ < 8) {
      responses = [...responses, { eventId: out.pendingEvent.id, optionId: out.pendingEvent.options[0].id }];
      out = commitSeason(s, allocs, responses);
    }
    if (!out.done) { fail(`replay fixture: season ${i + 1} never resolved (still pending ${out.pendingEvent.id})`); break; }
    const item = out.result.items.find((x) => x.kind === "action" && x.id === rest && x.band);
    if (!item) { fail(`replay fixture: ${rest} did not resolve in season ${i + 1}`); break; }
    seen.push({ coords, band: item.band!, line: item.line });
    s = out.state;
  }
  // 1. the fixture RAN (this is what was silently false)
  if (seen.length !== OCC) fail(`replay fixture produced ${seen.length}/${OCC} occurrences of ${rest} — the code carrying this check's evidence did not run`);
  else {
    // 2. six distinct coordinate sets ⇒ six distinct draws
    const draws = new Set(seen.map((o) => drawFor(seeds.drawSeed, o.coords)));
    if (draws.size < OCC) fail(`${OCC} occurrences consumed only ${draws.size} distinct draws — coords ${JSON.stringify(seen.map((o) => [o.coords.seasonIndex, o.coords.instanceOrdinal]))}`);
    // 3. independence is observable end-to-end, not one frozen payload
    const payloads = new Set(seen.map((o) => `${o.band}|${o.line}`));
    if (payloads.size < 2) fail(`all ${OCC} occurrences of ${rest} resolved to the identical outcome (${seen[0].band})`);
    // 4. and the run replays exactly from its own ledger
    const rep = replay(origin, seeds, s.committed, priorities);
    if (rep.replayTruncatedAt !== undefined) fail(`replaying the ledger truncated at season ${rep

</details>

### `tests/sim-gates-4.ts:981` — open  (possible, sandbox-2)

`String.includes` is case-sensitive, and this is fed React component source, where the token would appear title-cased in exactly the places that matter: a heading `<h2>Leaderboard</h2>`, a component or import name `Leaderboard`/`HighScorePanel`, a label "High Score". I verified: "<h2>Leaderboard</h2>".includes("leaderboard") === false and "<h2>High Score</h2>".includes("high score") === false. The gate's own sibling check on content strings (line 901) runs the same tokens through containsPhrase(lower, w), i.e. case-insensitively, so the inconsistency looks like an oversight rather than a decision. A lowercase occurrence (a prose sentence, a css class) would still fire, so this is a partial blind spot, not an absolute one — but the rendered score UI this line exists to catch would slip through.

<details><summary>the corrected assertion the prover established</summary>

Corrected assertion

```ts
// Normalise identifier and case boundaries before matching: `Leaderboard`,
// `HighScorePanel`, `highScore`, `sim-leaderboard` and `high_score` all reduce
// to the token this line forbids. Matched with containsPhrase, the same helper
// the sibling string lint at line 901 uses.
const norm = src.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").toLowerCase();
for (const w of ["leaderboard", "percentile", "high score"])
  if (containsPhrase(norm, w)) fail(`${base}: score token "${w}"`);
```

`containsPhrase` is already imported in this file. The `[_-]+` pass is what makes `high_score` and `sim-leader…` reduce; the camel split is what makes `HighScorePanel` reduce.

## Proof the correction is falsifiable

`fix.cjs` lifts both `containsPhrase` (from `tests/util.ts`) and the shipped line (from `tests/sim-gates-4.ts:981`) out of the real files, then runs both predicates over the planted component and five defect shapes, plus a false-positive sweep of the real corpus:

```
containsPhrase lifted from tests/util.ts; sanity: true false
SHIPPED line 981 on planted score UI -> GREEN  []
CORRECTED        on planted score UI -> RED   ["…: score token \"leaderboard\"","…: score token \"percentile\"","…: score token \"high score\""]

falsifiability of the correction:
  title-case heading   <h2>Leaderboard</h2>    shipped=green  corrected=RED  ["x: score token \"leaderboard\""]
  title-case label     <span>High Score</span> shipped=green  corrected=RED  ["x: score token \"high score\""]
  title-case term      <dt>Percentile</dt>     shipped=green  corrected=RED  ["x: score token \"percentile\""]
  camelCase identifier const highScore = ...   shipped=green  corrected=RED  ["x: score token \"high score\""]
  kebab class          sim-leaderboard         shipped=RED   corrected=RED  ["x: score token \"leaderboard\""]
  CONTROL: clean file                          shipped=green  corrected=green []

false positives, play surfaces (the gate's own scope): 10 files scanned -> 0 red
false positives, ALL components + app (wider): 67 files scanned -> 0 red
```

The correction goes red on all five defect shapes, stays green on a clean file containing the ordinary-English decoy "she keeps score, quietly", and produces zero false positives across the 10 play-surface files it governs and the 67 files of the wider `components` + `app` tree — so adopting it does not turn gate 205 red on the current build.

Assumption worth naming: I kept the token list unchanged (minimal fix to the casing defect). `leader-board` written with a hyphen is caught by t

</details>

### `tests/sim-gates-4.ts:945` — open  (possible, sandbox-2)

The `continue` is meant to skip the declaration (`selectBridge(campaignId: string)`), but it exempts ANY argument text that merely begins with the characters "campaignId". I probed it: `selectBridge(campaignIdFor(state))` yields args "campaignIdFor(state" (the `[^)]*` stops at the first paren) → startsWith("campaignId") → skipped, no fail; same for `selectBridge(campaignIdOf(run.drawSeed))`. That is precisely the §3.9 violation the loop exists to forbid — an id derived from run state — and it passes green. Secondary: the loop only reads lib/sim/parse.ts, so a call site anywhere else is never checked at all (today the sole call is parse.ts:304 `selectBridge(CAMPAIGN_ID)`). The unqualified-argument case (`selectBridge(state.seed)`) does still fail, so the line is not wholly inert.

<details><summary>the corrected assertion the prover established</summary>

Corrected assertion

Two independent repairs: identify the declaration by the `function` keyword rather than by what its parameter text starts with, and read the argument list with balanced-paren scanning across every source file.

```ts
// Every call site — anywhere in the app, not just parse.ts — passes the campaign
// id constant and nothing else. The declaration is identified by the `function`
// keyword, never by what its parameter text happens to begin with.
const CALL = /(^|[^\w$.])(function\s+)?selectBridge\s*\(/g;
for (const file of [
  ...collectSources(join(ROOT, "lib")),
  ...collectSources(join(ROOT, "components")),
  ...collectSources(join(ROOT, "app")),
]) {
  const base = file.replace(ROOT + sep, "").split(sep).join("/");
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(CALL)) {
    if (m[2]) continue; // `export function selectBridge(` — the declaration
    let depth = 1, i = m.index! + m[0].length;
    const start = i;
    while (i < src.length && depth > 0) {
      const c = src[i];
      if (c === "(") depth++;
      else if (c === ")") depth--;
      if (depth > 0) i++;
    }
    const args = src.slice(start, i).replace(/\s+/g, " ").trim();
    if (args !== "CAMPAIGN_ID")
      fail(`${base}: selectBridge called with "${args}" — it may take ONLY the campaign id constant (§3.9)`);
  }
}
```

## Proof the correction is falsifiable

`C:\Users\sourd\AppData\Local\Temp\claude\F--Programming-The-Guidebook-to-Life\e9743b03-c08a-407b-b768-205c36439d39\scratchpad\fix.cjs` runs old and new predicates side by side over the real `lib/` + `components/` + `app/` trees, with the same mutations plus a call injected into a *different* file:

```
case                                                OLD    NEW
A baseline, real tree                               GREEN  GREEN
B parse.ts: selectBridge(state.seed)                RED    RED
      new-> lib/sim/parse.ts: selectBridge called with "state.seed" …
C parse.ts: selectBridge(campaignIdFor(state))      GREEN  RED
      new-> lib/sim/parse.ts: selectBridge called with "campaignIdFor(state)" …
D parse.ts: selectBridge(campaignIdOf(s.drawSeed))  GREEN  RED
      new-> lib/sim/parse.ts: selectBridge called with "campaignIdOf(s.drawSeed)" …
E parse.ts: selectBridge(campaignId + s.seed)       GREEN  RED
      new-> lib/sim/parse.ts: selectBridge called with "campaignId + s.seed" …
F parse.ts: selectBridge(campaignIdFromParse(parse)) GREEN RED
      new-> lib/sim/parse.ts: selectBridge called with "campaignIdFromParse(parse)" …
G CampaignApp.tsx: selectBridge(state.seed)         GREE

</details>

### `F:/Programming/The Guidebook to Life/tgtl-claude-4.0/tests/sim-gates-4.ts:1574` — open  (certain, sandbox-3)

S-11' is the anti-regression fixture added specifically to prove the live attribution check is falsifiable, and it does not run the live check. It RE-IMPLEMENTS the predicate and drops both of the live loop's guards: the `if (rec)` guard (line 1482) and the `if (!note.startsWith("set in motion in season")) continue;` filter (line 1485). It also hand-builds both probe notes rather than sourcing one from the engine, so both guards are unexercised in either direction. Result: the two ways the live check can silently go vacuous — the source record not resolving in the registry, or the note's prefix drifting away from the literal 'set in motion in season' — are exactly the two things S-11' cannot detect, and it would keep printing 'so its green is earned' while the loop it vouches for ran zero assertions. Note also that `probe.sourceId` is populated and never read, and `deslugged` inside the expression is the outer sample's, not the probe's.

<details><summary>the corrected assertion the prover established</summary>

corrected assertion

Three changes, all in `tests/sim-gates-4.ts` §S-11: **one** predicate declared once and called by both the loop and the fixture; a non-vacuity counter; and the bad note derived from an engine-produced note rather than hand-built.

```ts
const ATTRIBUTION_PREFIX = "set in motion in season";
const deslug = (id: string) => id.replace(/^(act|evt|start)-/, "").replace(/-/g, " ");
type Verdict = "skip" | "ok" | "not-the-label" | "de-slugged";
const attributionVerdict = (note: string, label: string, sourceId: string): Verdict => {
  if (!note.startsWith(ATTRIBUTION_PREFIX)) return "skip";
  if (!note.includes(label)) return "not-the-label";
  const d = deslug(sourceId);
  if (d !== label.toLowerCase() && note.includes(d)) return "de-slugged";
  return "ok";
};
let attributionsChecked = 0;
let liveNote: { note: string; label: string; sourceId: string } | undefined;
```
live loop (replacing 1482–1493):
```ts
if (rec)
  for (const a of entry?.attribution ?? []) {
    const note = a.note ?? "";
    const verdict = attributionVerdict(note, rec.label, q!.sourceRef.id);
    if (verdict === "skip") continue;
    attributionsChecked++;
    if (!liveNote && deslug(q!.sourceRef.id) !== rec.label.toLowerCase())
      liveNote = { note, label: rec.label, sourceId: q!.sourceRef.id };
    if (verdict === "not-the-label") fail(`consequence '${id}' does not attribute to its source card's authored label ("${rec.label}"): "${note}"`);
    if (verdict === "de-slugged")    fail(`consequence '${id}' attributes to the de-slugged id "${deslug(q!.sourceRef.id)}" rather than "${rec.label}"`);
  }
```
S-11′ (replacing 1556–1584):
```ts
if (attributionsChecked === 0)
  fail("S-11 evaluated the attribution predicate zero times — the live loop is vacuous, so its green means nothing");
if (!liveNote) {
  fail("S-11 never captured an engine-built attribution note whose de-slugged id differs from its label — nothing to falsify against");
} else {
  const broken = liveNote.note.replace(liveNote.label, deslug(liveNote.sourceId));
  const onBroken = attributionVerdict(broken, liveNote.label, liveNote.sourceId);
  if (onBroken !== "de-slugged" && onBroken !== "not-the-label")
    fail(`the attribution predicate returned "${onBroken}" on an engine note rendered the old broken way ("${broken}") — it cannot come back red and is therefore not a check`);
  const onGood = attributionVerdict(liveNote.note, liveNote.label, liveNote.sourceId);
  if (onGood !== "ok")
    fail(`the attribution predicate returned "${onGood}" on the engine's own correct note ("${liveNote.note}") — it rejec

</details>

### `tests/sim-gates.ts:591` — open  (certain, arc)

deserializeRun (lib/engine/run.ts:238) returns `RunState | null`, and returns null on ANY of: a JSON parse throw, `parsed.version !== 1`, or a missing `gauges` field. The harness swallows that null and keeps the un-rehydrated state. The consequence: if the round-trip ever breaks, `pauseEach` becomes a no-op, `plain` and `detoured` then differ only by `whyDetour`, the comparison at line 445 still matches, and S-7 reports PASS while claiming at line 462 that 'pause/resume ... never perturbed a draw'. Nothing anywhere in the suite asserts that `rehydrated` was non-null. I demonstrated it: I replicated drivePolicyRun with `deserializeRun` swapped for `() => null` and ran the exact S-7(b) comparator. Real deserialize: 17 pauses attempted, 17 applied, mech(plain) === mech(detoured) → green. Null deserialize: 17 pauses attempted, 0 applied, mech(plain) === mech(detoured) → still green. The failure mode is not hypothetical: I round-tripped a live run's payload with `version` bumped to 2 and deserializeRun returned null, so a routine save-format version bump silently deletes the pause/resume half of the determinism gate while every line stays green.

<details><summary>the corrected assertion the prover established</summary>

Corrected assertion

Count both outcomes in the driver instead of discarding one, and assert on both:

```ts
// in drivePolicyRun
let pausesApplied = 0, pausesRejected = 0;
...
if (opts.pauseEach) {
  const rehydrated = deserializeRun(serializeRun(s));
  if (rehydrated) { pausesApplied++; s = rehydrated; } else { pausesRejected++; }
}
...
return { state: s, pausesApplied, pausesRejected };

// in S-7(b), before the mech() comparison
if (detoured.pausesRejected > 0) { ok = false; details.push(`${detoured.pausesRejected} pause/resume round-trips were REJECTED by deserializeRun (it refused its own serializeRun output)`); }
if (detoured.pausesApplied === 0) { ok = false; details.push("pauseEach applied ZERO round-trips; the pause/resume half of S-7(b) never ran"); }
```

The second check is the one that survives future refactors: it goes red not only when deserialize rejects, but whenever the pause branch stops being reached at all — which is the general form of the bug.

## Proof the correction is falsifiable

`.../scratchpad/probe-fix.ts`, same injection harness, corrected predicate:

```
CORRECTED S-7(b):
real deserializeRun                applied= 17 rejected=  0  -> PASS (green)
() => null  (round-trip broken)    applied=  0 rejected= 17  -> FAIL (red)
      17 pause/resume round-trips were REJECTED by deserializeRun (it refused its own serializeRun output)
      pauseEach applied ZERO round-trips; the pause/resume half of S-7(b) never ran
version bumped to 2 on save        applied=  0 rejected= 17  -> FAIL (red)
corrupting deserialize             applied= 17 rejected=  0  -> FAIL (red)
      pause/resume and why-detours perturbed the run
```

Green on the good input, red on both broken-round-trip inputs, and the pre-existing perturbation detection is preserved rather than replaced. Live baseline for reference: `npx tsx tests/sim-gates.ts` currently reports `[PASS] Gate 107` with the line quoted above.

Assumption worth flagging: I left `pausesRejected > 0` as a hard failure rather than a tolerance. If the engine ever legitimately serializes a state that `deserializeRun` should reject mid-run, that check would need rethinking — but such a state would itself be a bug, so I treated zero as the only correct value.

Files: `F:/Programming/The Guidebook to Life/tgtl-claude-4.0/tests/sim-gates.ts` (lines 591, 440-446, 460-463), `F:/Programming/The Guidebook to Life/tgtl-claude-4.0/lib/engine/run.ts` (line 238). No repo files were modified.

</details>

### `tests/sim-gates.ts:462` — open  (certain, arc)

The non-perturbation test is the single comparison at line 445, mech(plain) vs mech(detoured). `plain` is drivePolicyRun(..., { skipAlternate: true, aimsAudit: true }) and `detoured` is drivePolicyRun(..., { skipAlternate: true, pauseEach: true, whyDetour: true, aimsAudit: true }). skipAlternate and aimsAudit are IDENTICAL on both sides — only pauseEach and whyDetour vary. So beat-skipping and the act-boundary weight edit are never varied against anything, and the claim that they 'never perturbed a draw' rests on no comparison at all. The inline comment at line 442 is honest about this ('pause/resume + why-detours must NOT change the mechanical run'); only the reported PASS line overreaches. And the claim is not merely untested — it is false under the gate's own comparator: I ran the same drive with aimsAudit true vs false and mech() differed (the weight edit appends a `weights` entry to `committed`, which mech() serialises), as did serializeRun. If the gate actually varied the weight edit the way its PASS line implies, line 445 would go red. Also confirmed the audit branch does fire (ACTS[6].aimsAudit is true, s.act is 0-based, auditFired === 1 per drive), so the branch itself is live — it is the comparison that is blind.

<details><summary>the corrected assertion the prover established</summary>

Corrected assertion

Replace block (b) at lines 441–448. `drivePolicyRun` gains one line — it records `draws: Map<cardId, number>` at each commit. Three changes:

1. **Vary one interleave at a time** against a fixed reference `{skipAlternate:true, aimsAudit:true}`: `{aimsAudit}` varies skips, `{skipAlternate}` varies the weight edit, `{all four}` varies the detours.
2. **Compare the draw itself**, not just the end state: for every card in both drives, `refDraw === altDraw`. Plus `overlap >= 5` per pair so the loop cannot pass vacuously.
3. **Guard that each lever is real**: if no scripted beat carries `effects`, fail — the gate may not claim a no-op left the run alone. The weight edit is allowed exactly its own `{kind:"weights"}` ledger entry (`committed.filter(e => e.kind !== "weights")` must match); the detours are allowed nothing.

Full source: `.../scratchpad/s7claim-30844/tests/corrected2.ts`

## Proof the correction is falsifiable

Four scenarios, corrected assertion vs gate-as-written:

| scenario | gate as written | corrected |
|---|---|---|
| control, real content | PASS | **FAIL** — `the beat-skip interleave is INERT: 0 of 2 scripted beats carry effects` |
| control + `beat-loss` given `effects` | PASS | PASS (285 card-draw comparisons) |
| Defect A + effects | PASS | **FAIL** — `the weight edit MOVED the draw for card-midgame-caregiving-plateau: 0.423564 -> 0.654598` |
| Defect B + effects | PASS | **FAIL** — `beat-skips MOVED the draw for card-midgame-tend: 0.276716 -> 0.693802` |

It goes red on the current build, which is correct: the PASS line's skip claim is unsupportable until a beat carries effects, or the wording drops to what the honest inline comment at line 442 already says — *"pause/resume + why-detours must NOT change the mechanical run."*

</details>

### `tests/sim-gates.ts:372` — open  (likely, arc)

The scan runs over 12 real files (Board.tsx, play/Creation, DistributionStrip, MechanicWhy, Parse, Playthrough, StatePanel, sim/PlayDoor, app/play/{arc,campaign,lab,page}), so the loop is live — but both needles are lowercase and `String.includes` is case-sensitive. Any realistic reader-facing leak in JSX is capitalised at the point where it follows a '>': I fed the predicate `<h2 className="x">Leaderboard</h2><p>Percentile rank: top decile</p>` and it returned false for both words; the same predicate on `<span>leaderboard</span>` returns true, so the only shape it can catch is an all-lowercase text node — the one form a heading or label will never take. The check therefore has false-positive capability (a comment reading '// no leaderboard here' matches ` leaderboard `) but essentially no true-positive capability for the violation it names. Compounding it, the PASS line at 378 reports 'Parse/board content and templates: no totals, grades, ranks, meters, or reader comparisons', yet the template scan searches only 'leaderboard' and 'percentile', and SCORE_WORDS (line 347) is [score, grade, leaderboard, percentile, streak, high score] — the words 'total', 'rank' and 'meter' are never searched anywhere in this gate except as a ParseSummary FIELD name in run.ts. All three of those words already occur in the scanned files (Parse.tsx has grade/total/rank, StatePanel.tsx has score/total/meter, Board.tsx has score/meter) — benignly, in disclaimers such as StatePanel.tsx:132 `<p>No total. No score. There is nowhere on this panel for one to go.</p>` — which is exactly the proof that the gate does not look at them in templates at all.

<details><summary>the corrected assertion the prover established</summary>

Corrected assertion

Two tiers plus a scan-set guard plus a canary, at `tests/sim-gates.ts:366-378`:

```ts
const stripComments = (s: string) =>
  s.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:"'`])\/\/[^\n]*/g, "$1 ");

function renderedText(src: string): string {
  const s = stripComments(src);
  const out: string[] = [];
  for (const m of s.matchAll(/>([^<>{}]+)</g)) out.push(m[1]);                    // JSX text nodes
  for (const m of s.matchAll(/\b(?:title|aria-label|alt|placeholder|label)\s*=\s*"([^"]*)"/g)) out.push(m[1]);
  for (const m of s.matchAll(/<\/?([A-Z][\w.]*)/g)) out.push(m[1]);               // component element names
  return out.join("\n");
}

// T1: words with no benign use in this codebase — any occurrence, any case.
const BANNED = ["leaderboard", "percentile", "high score", "streak"];
// T2: instrument SHAPES, so the deliberate "No total. No score." disclaimers stay green.
const INSTRUMENT = [
  /\b(?:your|the)\s+(?:overall\s+)?(?:total|score|grade|rank|rating|percentile)\b/i,
  /\b(?:total|score|grade|rank|rating|percentile)\s*:\s*\S/i,
  /\btop\s+\d+\s*%/i,
  /\b\d+(?:st|nd|rd|th)\s+(?:place|percentile)\b/i,
  /<meter\b/i,
];

let scanned = 0;
for (const file of collectSources(join(ROOT, "components")).concat(collectSources(join(ROOT, "app/play")))) {
  const base = file.replace(ROOT + sep, "").split(sep).join("/");
  if (!/parse|play|board/i.test(base)) continue;
  scanned++;
  const src = readFileSync(file, "utf8");
  const lowerAll = stripComments(src).toLowerCase();
  for (const w of BANNED)
    if (containsPhrase(lowerAll, w)) { ok = false; details.push(`${base}: banned score token "${w}"`); }
  const rt = renderedText(src);
  for (const re of INSTRUMENT) {
    const m = rt.match(re);
    if (m) { ok = false; details.push(`${base}: instrument shape ${re} -> ${JSON.stringify(m[0])}`); }
  }
}
// the scan set cannot quietly go empty
if (scanned < 12) { ok = false; details.push(`scan set collapsed: ${scanned} files reached the predicate`); }
```

Reuse `containsPhrase` from `tests/util.ts:91` — the case-insensitive whole-word helper the *content* half of S-5 already uses. And narrow line 378 to what is actually checked: `"12 play/board templates: no leaderboard, percentile, streak or high-score token, and no total/rank/grade/meter instrument in rendered text."`

## Proving the correction is falsifiable

Ship the canary inside the gate — the general cure for this defect class. It asserts, every run, that the predicate flags known-bad and stays quiet on known-good, so a future edit that re-breaks the casing turns the gate

</details>

### `tests/sim-gates.ts:340` — open  (likely, arc)

S-3b makes exactly two assertions per seed: `r.state.phase !== "parse"` (line 329) and `!parse.turningPoints.length` (line 337). Neither observes which acts were visited. advance() (lib/engine/run.ts:212-223) crosses act and phase boundaries itself, so a regression that jumped from act 3 straight to endOfLife would still land phase === 'parse' and still leave turningPoints non-empty (the current run produces 19 turning points — 17 decision slots plus 2 watched — so losing acts 4-8 would leave roughly 3, comfortably non-zero) and all 120 seeds would report green under a message claiming they 'drove ... all acts'. The remedy that would make the line true — asserting turningPoints covers acts 1..9, or that slackByAct has one entry per act — is not present. Noting the non-emptiness assertion itself is NOT vacuous: I checked that selectCard() returning null for every decision slot would drive the run to parse via the `if (!card) { s = advance(s); continue; }` path with zero turningPoints, so line 337 does real work against card-selection breakage. It is only the act-coverage half of the reported claim that nothing tests.

<details><summary>the corrected assertion the prover established</summary>

corrected assertion

Drop into the S-3b block; needs no new imports (`ALL_CARDS` and `ACTS` are already imported at `tests/sim-gates.ts:34-35`):

```ts
// hoisted above the loop
const ACT_OF_CARD = new Map(ALL_CARDS.map((c) => [c.id, c.act]));
const EXPECTED_ACTS = [...ACTS.map((a) => a.n), 9]; // 9 = END_OF_LIFE_ACT

// inside the else-branch, beside the existing turningPoints check
const played = new Set(parse.turningPoints.map((tp) => ACT_OF_CARD.get(tp.cardId)));
const missing = EXPECTED_ACTS.filter((n) => !played.has(n));
if (missing.length) {
  ok = false;
  details.push(`seed ${i}: reached parse without playing act(s) ${missing.join(", ")} (acts played: ${[...played].sort((a, b) => a - b).join(",")})`);
  if (details.length > 6) break;
}
```

## Proof the correction is falsifiable

Same three engines, same 120 seeds, run against `...\probe\s3b-fixed.ts`:

```
----- baseline -----
S-3b(FIXED) VERDICT: PASS (green)
  detail: 120/120 hands drove creation → all acts → end of life → parse; no dead ends.
----- mutant -----
S-3b(FIXED) VERDICT: FAIL (red)
  detail: seed 0: reached parse without playing act(s) 4, 5, 6, 7, 8 (acts played: 1,2,3,9)
  detail: seed 1: reached parse without playing act(s) 4, 5, 6, 7, 8 (acts played: 1,2,3,9)
  ...
----- mutant2 -----
S-3b(FIXED) VERDICT: FAIL (red)
  detail: seed 0: reached parse without playing act(s) 1, 2, 3, 4, 5, 6, 7, 8 (acts played: 9)
  ...
```

Green on the true build for every one of the 120 seeds (so it is not a false positive — act coverage is per-seed complete today, not just complete in the union), red on both regressions, and the failure line names the missing acts.

Assumption worth flagging: the fix keys act coverage off `CARD_BY_ID[tp.cardId].act`, i.e. it proves each act's *card pool* was consumed. An act whose slots were all `beat` slots would carry no turning point and would trip this assertion falsely — none exists in current content (baseline is green), but if a beat-only act is ever added, the expected set must be built from acts that actually own card-consuming slots rather than from `ACTS` wholesale.

</details>

### `tests/run-gates.ts:244` — open  (certain, static)

These two patterns hunt for CSS constructs but are fed only HTML. `pages` is `loadPages()`, which is `listHtmlFiles(OUT_DIR)` — .html files only; the built stylesheets in out/_next/static/css/*.css are never opened by any gate. This build is `output: "export"` with no `experimental.inlineCss`, so the project's 64KB app/globals.css is emitted exclusively as an external .css file. I verified out/: the only <style> blocks in the 34 exported HTML files are Next's built-in 404 page CSS and four one-line `:root .sim-*{display:none}` no-JS rules; no project CSS is inlined anywhere. So a remote @font-face or a Google-Fonts @import — the exact violation the gate's own PASS line claims to have ruled out ("fonts/system-stack only") — lands in a file the gate does not read. END-TO-END PROBE: I copied out/ to scratch, prepended `@import url(https://fonts.googleapis.com/css2?family=Inter&display=swap);` and `@font-face{...src:url(https://fonts.gstatic.com/s/inter/v13/x.woff2)...}` to both built stylesheets, and ran gate 9's exact pattern loop over the resulting export. Verdict: PASS (green), zero details, with the site provably pulling fonts from Google. Second, independent defect on line 245: even if the CSS were fed in, `@import\s+["']https?:` requires a quote immediately after the whitespace, so it misses `@import url("https://...")` and `@import url(https://...)` — the two canonical forms — and only fires on the rare bare-string `@import "https://..."`. Positive-control probe: of 7 realistic violation strings, `@import url("https://fonts.googleapis.com/css2")` and `@font-face{src:url("https://...")}` are matched by NO pattern in the array at all. Patterns 1-4 (script/link/img/iframe) are live and do go red — I confirmed those — so gate 9 is a partial gate whose stated property it cannot enforce.

<details><summary>the corrected assertion the prover established</summary>

Corrected assertion

Three changes in `tests/run-gates.ts` lines 234–261, all verified:

1. **Widen the corpus.** Keep `loadPages()` for HTML (it already drops `/404`), add a CSS corpus and scan `[...pages, ...sheets]`.
2. **Fix line 244** to be quote-agnostic: `/url\(\s*["']?\s*https?:\/\//gi`. Line 245 stays as-is — with 244 fixed it still earns its place for bare-string `@import "https://…"`.
3. **Assert both corpora are non-empty**, so a future refactor that stops finding the stylesheets fails loudly instead of re-creating this exact hole.

Verified green on pristine, red on poisoned (`probe-fix3.mjs`):

```
=== PRISTINE out/
[PASS] Gate 9 (corrected)
   32 pages + 2 stylesheets: no page-initiated external resource loads (fonts/system-stack only).

=== POISONED out/
[FAIL] Gate 9 (corrected)
   _next/static/css/42cda9d71d4c92f0.css: page-initiated external resource load: url(https://
   _next/static/css/42cda9d71d4c92f0.css: page-initiated external resource load: @import url(https://
   _next/static/css/fe083401a52c8259.css: page-initiated external resource load: url(https://
   _next/static/css/fe083401a52c8259.css: page-initiated external resource load: @import url(https://
```

## Proving the correction is falsifiable without a build

Add a detector self-test that runs before the corpus scan: a `MUST_MATCH` fixture of 11 real external loads that every pattern set must catch, and a `MUST_NOT_MATCH` fixture of 5 local assets (including `<rect fill="url(#simEarthGlow)"/>`, a real SVG paint reference in `out/index.html` and `out/play/lab/index.html` — the fix must not false-positive on it). Regressing line 244 to the shipped form turns the self-test red on its own (`probe-selftest2.mjs`):

```
CORRECTED pattern 5: detector self-test GREEN

SHIPPED (broken) pattern 5: detector self-test RED
   DETECTOR SELF-TEST: no pattern matches known violation "@import url(\"https://fonts.googleapis.com/css2?family=Inter\");"
   DETECTOR SELF-TEST: no pattern matches known violation "@import url('https://fonts.googleapis.com/css2?family=Inter');"
   DETECTOR SELF-TEST: no pattern matches known violation "@font-face{src:url(\"https://fonts.gstatic.com/x.woff2\")}"
   DETECTOR SELF-TEST: no pattern matches known violation "body{background:url('https://cdn.example.com/bg.png')}"
```

That is the general defence against this shape: a gate whose detector is itself asserted against known-bad input cannot silently decay into a hollow green.

**Assumption flagged:** I scoped the corrected corpus to `.html` + `.css`. JS chunks in `out/_next/static/chunks/*.js` can also init

</details>

### `tests/run-gates.ts:201` — open  (likely, static)

The only shape this detects is a game label that is the ENTIRE, unwrapped, unpunctuated text of one element (`<h2>The map</h2>`), plus multi-word labels appearing as a quoted string literal. The codebase's own <Term> usage shows the violation this guards against takes a different shape: components render terminology mid-sentence, e.g. components/CharacterSheet.tsx:119 `which <Term k="pressure" /> is binding today`. MUTATION PROBE against real repo source: I replaced `<Term k="pressure" />` with the literal `pressure reading` and `<Term k="support" />` with `your party` in the real CharacterSheet.tsx — the lint stayed GREEN. Replacing `<Term k="stage" define />` in Roadmap.tsx with the literal `chapter` — GREEN. Replacing `<Term k="season" />` in sim/CampaignApp.tsx:441 (already alone on its own line, so Prettier's newline+indent breaks the `>label<` adjacency) with the literal `season` — GREEN. Only `<h2>The map</h2>` goes RED. Punctuation also defeats it: `<h2>The map.</h2>` is GREEN. And for the 12 single-word labels (chapter, branch, modifier, buff, debuff, season, campaign, allocation, fork, briefing, companion, priority) the quoted-literal branch is switched off by `multiword`, leaving the exact-whole-text-node form as the sole detector. Net: for the dominant real violation — a game label hardcoded into prose where <Term> should be — this check cannot come back red, while line 212 reports "no game vocabulary hardcoded in 67 component/app sources." Not literally incapable of failing (the standalone-text-node case does fire, verified), which is why this is 'likely' not 'certain'.

<details><summary>the corrected assertion the prover established</summary>

Corrected assertion

`gate3lint-probe-e9743b03/corrected2.ts`. Replace the adjacency test with a word-boundary match against **extracted reader-facing JSX text**:

1. Offset-preserving mask: blank comments and string literals, keep only spans between a `>` and the next `<` with no angle bracket inside, blank `{...}` expression containers within those spans. (Note: masking `{...}` globally over the whole file is wrong — a function-body brace pair swallows the JSX text; that bug cost 4 detections in my first draft.)
2. Match each game label case-insensitively with `(?<![\w-])LABEL(?:s|es)?(?![\w-])` — the plural tail matters, `<Term k="lifeStat" caps />s` regresses to `life stats`.
3. Shadow: skip a game-label hit that lies wholly inside a longer **standard**-label match, so the standard `the launch years` does not trip the game label `the launch`.
4. Waiver keyed `file|label -> count`, not a membership set. A set lets a new hit hide in an already-waived file — that alone cost 2 detections.

## Proving the correction is falsifiable

Both directions are demonstrated, not argued:

```
$ npx tsx corrected2.ts baseline
CORRECTED RULE, raw scan of the current repo: 97 hits
  multi-word (unambiguous game vocabulary) hits: 9
  single-word: briefing=2 branch=11 season=46 campaign=13 priority=2 allocation=5 fork=8 companion=1

$ npx tsx corrected2.ts waived
CORRECTED RULE + waiver, unmutated repo: GREEN (0 over-waiver)
  waiver entries: 36

$ npx tsx corrected2.ts falsify
FALSIFIABILITY (waiver active) — inline the literal at each real <Term> site:
  sites: 12   RED: 12   GREEN(missed): 0
```

Green is reachable (waived, unmutated) and red is reachable (12/12 injected regressions, plus 11/11 on the mutation set versus the shipped check's 1/11). The falsify sweep should be committed as the gate's own self-test — it is generated from the `<Term>` call sites, so it cannot go stale as the codebase changes.

Assumptions that shaped this: the 9 multi-word baseline hits are near-certainly real defects; the ~88 single-word hits (`season`, `campaign`, `branch`, `fork`, `allocation`) are a content question, not a gate question — either those sim components genuinely leak game vocabulary into Standard edition, or `content/terminology.ts` assigns standard labels (`half-year`, `the long run`, `decision branch`) that the sim never actually uses. That is an owner decision, which is why the correction ships with a dated, shrinking waiver rather than 97 immediate failures. Separately, `collectSources` walks only `components/` and `app/`; the reader-facing prose data in `F:\Programm

</details>

### `tests/s10-balance.ts:144` — open  (certain, balance)

This is gate 2201, "S-10a' · The floor predicate is falsifiable" — the one thing standing between gate 220 (finding above) and the defect class, and it certifies falsifiability over a domain the engine cannot reach. `closed` is `floorReport(probe, { timeStructure: 0, energy: 0, money: 0 })`. A zero budget is not a reachable input: `deriveBudget` floors time and energy at 1 (verified over 11,625 states, min 1/1). And at a zero budget the result is fixed by content, not by the predicate's logic: the only zero-total-cost actions in the entire 91-action pool are the three floor actions themselves (probe: `zero-cost NON-floor actions: 0`), so `nonFloor` is necessarily empty, so `sandboxOpen` is necessarily false, so `pass` is necessarily false. The gate's live output prints exactly that: "floorReport returns FALSE at a closed budget (3 affordable, 0 authored non-floor)" — the 3 are precisely the free floor set. The PASS message then states a strictly stronger property than anything checked: "The predicate the fleet asserts is one that can come back red." The predicate the fleet asserts is `report.pass` at `budgetFor(state)`, and per the finding above it cannot come back red at any budget `budgetFor` can return. My budget sweep pins the failing region to exactly {time == 0 AND energy == 0}, which is disjoint from the reachable region {time >= 1, energy >= 1}. So this gate demonstrates falsifiability on inputs the fleet never sees and reports it as falsifiability of what the fleet asserts. (The second half of the same gate, `bare.sandboxOpenOnAuthoredPool` at (1,1,0), is a genuine check and can go red — it is only this first half and the summary text that overclaim.)

<details><summary>the corrected assertion the prover established</summary>

corrected assertion

Require the falsifying witness to be an input the engine can actually produce.

```ts
// Falsifiability on an input the fleet never sees proves nothing about the fleet.
// The witness must sit at or above the minimum budget deriveBudget can return.
const MIN = minDerivableBudget();          // exhaustive over gauge bands x backlog x standing
const failing = budgetLattice(0, 6).filter((b) => !floorReport(probe, b).pass);
const reachable = failing.filter((b) => b.timeStructure >= MIN.timeStructure
                                     && b.energy        >= MIN.energy
                                     && b.money         >= MIN.money);
if (reachable.length === 0) {
  ok = false;
  details.push(
    `floorReport goes FALSE only at budgets no season can hold: ${failing.length} failing point(s), ` +
    `e.g. ${fmt(failing[0])}, all below the minimum budget deriveBudget can return, ${fmt(MIN)}. ` +
    `The predicate is a constant TRUE over every input the fleet can feed it, so gate 220 cannot come back red.`,
  );
}
```

Plus the direct form as the assertion of record: sweep the reachable state space and require at least one `s` with `floorReport(s, budgetFor(s)).pass === false`.

**Proof the correction is falsifiable — it lands on both colours** (`...\scratchpad\pE.ts`):

```
minimum budget deriveBudget can return anywhere: (t=1, e=1, m=0)

--- corrected gate against the SHIPPED engine (min reachable budget (t=1, e=1, m=0)) ---
  pass=false
   floorReport goes FALSE only at budgets no season can hold: 7 failing point(s), e.g. (t=0, e=0, m=0)
   (t=0, e=0, m=1) (t=0, e=0, m=2), all of them below the minimum budget deriveBudget can return,
   (t=1, e=1, m=0). The predicate is a constant TRUE over every input the fleet can feed it, so gate 220
   cannot come back red.

--- same corrected gate against a HYPOTHETICAL engine whose reserve is dropped (min budget (0,0,0)) ---
  pass=true
   floorReport goes FALSE at 7 reachable budget(s), e.g. (t=0, e=0, m=0) — the predicate the fleet asserts
   is one that can come back red.
```

Red on the shipped build, green the moment the witness becomes reachable. Note what red means: the correction does not repair gate 220, it exposes it. There is no reachable red for `sandboxOpen` today, so gate 2201 cannot be made to pass honestly without changing the standard — and `sandboxOpenOnAuthoredPool`, the falsifiable form, cannot simply be promoted to the assertion, because gate 220's own output reports seasons where `nonFloorExcludingSmall === 0`, i.e. it goes false on reachable input.

## 5. Assumptions

-

</details>

### `tests/s13-pileup.ts:199` — **FIXED**  (certain, pileup)

Every one of the four disjuncts is false by construction in every state this gate can reach, so `breaches` is the empty array unconditionally and gate 230 cannot come back red. (a) The three FLOOR actions carry `floor: true`, which makes `availability()` return `{available:true}` on its first line (lib/sim/season.ts:146) with no further checks, and their `contract.costs` is `{}` (content/sim/campaign/actions-floor.ts:32,131,245), so `isAffordable` is true at any non-negative budget. They sit in three distinct families (health / inner / threshold). `FLOOR_ACTION_IDS` is `FLOOR_ACTIONS.map(a => a.id)` — the missing-set is computed from the same array whose every member is unconditionally in the affordable menu, so `floorMissing` is definitionally empty. That alone pins `affordable >= 3` and `families >= 2`. (b) `floorOk` is `report.pass` = `missing.length===0 && afford>=3 && families>=2 && sandboxOpen`, so it collapses to `sandboxOpen`, i.e. the fourth disjunct. `sandboxOpen` = 2+ non-floor affordable across 2+ families. The nine SMALL actions have no prerequisites, no requiresFlags/excludesFlags, `seasonBands [[1,24]]` covering every season the driver visits, `repeatable: true`, and each costs exactly 1 pip of timeStructure or energy — never money (content/sim/campaign/actions-small.ts). I proved exhaustively (21,952 combinations of gauge values -2..4 x maintenanceDebt 0..15 x five standing-commitment sets) that `deriveBudget` returns `timeStructure >= 1` and `energy >= 1` in every case: PIP_TABLE floors at 1 in every band, DEBT_DRAG_FLOOR stops the debt drag taking the last pip, and `payableStanding` only pays upkeep that leaves >= 1 of each. S-13 always calls `floorReport(s, budgetFor(s))` with the FULL season budget — never a partially-spent one — so all nine small moves are affordable in every state, giving 9 non-floor actions across all 9 families. Measured: over the real 864-season fleet the worst season has 17 affordable across 9 families, with 9 small-tier actions affordable and the floor set complete in all 864. Direct mutation: I recomputed this gate's own predicate over all 864 states with the ENTIRE authored action pool deleted from the menu (leaving only the 3 free floor actions and the 9 unconditional small moves) — S-13a detects 0 breaches, reporting 12 affordable across 9 families and 9 non-floor. The state the gate exists to catch — 'the honest moves have all been priced out' — is precisely the state it reports green on, and its PASS text then says 'so no reachable state is the floor alone'. The repaired predicate already exists and is carried into the WorstSeason record (`sandboxOpenOnAuthoredPool`, `nonFloorExcludingSmall`, lines 168-170) but is never asserted on; `minNF` (line 207) is only printed. In one anomalous early run of this file I observed minNF = 0 across the whole fleet — every authored non-small action unaffordable in the worst season — and gate 230 still printed PASS with the 'no reachable state is the floor alone' line. lib/sim/season.ts:225-241 defends asserting on `sandboxOpen` on the grounds that 'S-10a′ now proves this predicate CAN fail (it goes false at a closed budget)'. That is true only where the budget is partially spent. S-13 never evaluates it that way, so inside S-13 the predicate is a constant.

<details><summary>the corrected assertion the prover established</summary>

corrected assertion

Two independent repairs at `tests/s13-pileup.ts:199`. The fields for the first already exist and are carried into `WorstSeason` but never asserted on (lines 168–170); the second needs a literal expectation:

```ts
// written down HERE, not read back from the file under test
const REQUIRED_FLOOR_IDS = ["act-rest-maintain", "act-wait", "act-seek-help"];
// ...per season, from the same affordableMenu floorReport used:
namedFloorMissing: REQUIRED_FLOOR_IDS.filter((id) => !afford.some((m) => m.action.id === id)),

const breaches = allSeasons.filter(
  (s) => s.namedFloorMissing.length > 0 || s.affordable < 3 || s.families < 2 || !s.sandboxOpenOnAuthoredPool,
);
```
`sandboxOpenOnAuthoredPool` is `authored.length >= 2 && authoredFamilies.length >= 2` over the pool with the small tier excluded (`lib/sim/season.ts:255`). Keep `nonFloorCount`/`sandboxOpen` in the PASS *text* if the design position that small moves are real content is to be preserved — but the thing **asserted** has to be the one that can go false.

### Proof the correction is falsifiable

Probe E is a faithful extraction of `driveAdversarial` evaluating shipped and corrected predicates on the same 864 seasons under three content worlds:

```
world=real          seasons=864
  SHIPPED   breaches: 0    -> gate 230 GREEN
  CORRECTED breaches: 0    -> gate 230 GREEN
  worst authored-pool count beyond the small tier: 5 across 4 families
world=no-authored   seasons=864
  SHIPPED   breaches: 0    -> gate 230 GREEN
  CORRECTED breaches: 864  -> gate 230 RED
    e.g. preset-supported-explorer/w1 s1: namedFloorMissing=[] authoredOpen=false nfExSmall=0 across 0 families
world=no-ask        seasons=864
  SHIPPED   breaches: 0    -> gate 230 GREEN
  CORRECTED breaches: 864  -> gate 230 RED
    e.g. preset-supported-explorer/w1 s1: namedFloorMissing=[act-seek-help] authoredOpen=true nfExSmall=19 across 7 families
```

Green on the real repo (no false alarm), red on both injected defects, and the real-pool margin is 5 authored actions across 4 families against a 2/2 threshold — comfortable, not knife-edge. Both `world=no-authored` and `world=no-ask` are one-line content edits, so each repair should ship with that mutation recorded as its falsifiability evidence.

## Assumptions and corrections to the claim

- The claim's argument (a)/(b) is sound but incomplete: probe B shows the authored pool alone also keeps the predicate green, so removing the small tier does **not** restore falsifiability. Excluding the small tier from the count is necessary but the fix must be the `sandboxOpenOnAuthored

</details>

### `tests/s13-pileup.ts:310` — open  (likely, pileup)

The cap half of this gate is real — I verified by mutation that it can go red: reimplementing `selectArrivals` with `take()`'s negativeBudget removed raises the fleet maximum to 3 negative arrivals per season, which would trip line 310. So the assertion is falsifiable and I am not claiming it is dead. What it cannot do is what its name and PASS text claim. Gate 233 is titled 'Pile-up cap AND DEPLETION FLOOR bind under adversarial search', and no assertion in this block touches the depletion floor. `deep` and `deepWithNeg` (lines 314-315) are computed and printed, never asserted. I re-ran the fleet with the deep-depletion suppression removed as well as the cap: the maximum stays 3, identical to cap-removal alone — deleting the depletion floor outright changes nothing this gate measures, so it would still report PASS on that half. Worse, the narrative asserts in prose the opposite of the number it prints. `deepWithNeg` is 0 in every run, yet the sentence reads '...0 of those still drew the maximum, which is the honest part — the depletion floor suppresses fresh negative CHANCE events, not the consequences of what you did', a construction that only makes sense for a non-zero count. A reader of the green output is told the model was measured refusing to soften the pile-up at depletion; the measurement actually says no depleted season ever reached the ceiling, and nothing was asserted either way. Secondary, for the cap half: the adversarial search contributes nothing to it. Companion and chance negatives are hard-gated by the `take()` counter, so those channels cannot exceed the cap for any state whatsoever; the only unguarded channel is scheduled events (lib/sim/season.ts:321 decrements the budget but never drops the event), which is a fixed list of 7 events, 4 negative, at four distinct season indices (4, 6, 15, 18) — max 1 negative per index. Whether this line goes red is decided by a static content list, identically on season 1 of seed 1 as across all 864 seasons.

<details><summary>the corrected assertion the prover established</summary>

corrected assertion

Replace the block at `tests/s13-pileup.ts:305-322`. It needs one extra field recorded in `driveAdversarial` (negative *chance* arrivals specifically, plus the state snapshot):

```ts
const negChance = arrivals.chance.filter((e) => e.negative).length;   // ~line 99
// …in seasons.push({ … }):  negChance, snapshot: s,
```

```ts
// A: the cap (unchanged — already falsifiable)
let maxNeg = 0;
for (const x of allSeasons) maxNeg = Math.max(maxNeg, x.negativeArrivals);
if (maxNeg > MAX_NEGATIVE_ARRIVALS) { ok = false; details.push(`a season delivered ${maxNeg} negative arrivals; cap is ${MAX_NEGATIVE_ARRIVALS}`); }

// B: the depletion floor, now actually asserted
const deep = allSeasons.filter((x) => x.depleted);
if (!deep.length) { ok = false; details.push("LIVENESS: no adversarially-reached season was deeply depleted — the clause was never exercised"); }
const leaks = deep.filter((x) => x.negChance > 0);
if (leaks.length) { ok = false; details.push(`${leaks.length} deeply-depleted season(s) still drew a fresh negative CHANCE event; §5.2 forbids that:`); /* …samples… */ }

// C: anti-vacuity — the floor was LOAD-BEARING, not honored on data that had nothing to suppress.
// Differential twin: same state, gauges lifted above the threshold, must somewhere draw a negative
// chance event the depleted original did not.
let bindings = 0;
for (const x of deep) {
  const lifted = {} as Record<GaugeKey, number>;
  for (const g of GAUGE_KEYS) lifted[g] = 3;
  const twin = { ...x.snapshot, gauges: lifted };
  if (isDeeplyDepleted(twin.gauges)) continue;
  if (selectArrivals(twin).chance.filter((e) => e.negative).length > x.negChance) bindings++;
}
if (bindings === 0) { ok = false; details.push(`VACUITY: across ${deep.length} deeply-depleted seasons the floor never changed the draw — this clause proves nothing`); }
```

Half C is the part that matters for this defect class: without it, half B is satisfiable by a world with no negative chance events at all, which is exactly shape 2.

## Proof the correction is falsifiable

Clean tree:
```
[PASS] Gate 233: S-13d(fixed) · Pile-up cap and depletion floor bind
   cap held in all 864 seasons (ceiling 2, worst observed 2). 783 seasons were deeply depleted; ALL of
   them drew zero fresh negative CHANCE events. The floor was load-bearing in 615 of them — the same
   state with gauges lifted above the threshold draws a negative chance event that the depleted state
   does not. e.g. preset-supported-explorer/w1 s6: depleted drew 0 negative chance, undepleted twin drew 2
```

Same probe, mutation A applied (de

</details>

### `tests/s13-pileup.ts:227` — open  (possible, pileup)

Both of these clauses are live today and I verified they are genuinely falsifiable — this is a latent-vacuity finding, not a dead-assertion one. Measured: 292 failure-band resolutions across 45 distinct records, of which 112 draw their routes ONLY from `recoveryRefs` (all 79 event failures do, since `authoredRecoveryRoutesFor` only calls `pushRoutes` on the record itself when the id resolves in ACTION_BY_ID), so dropping a record's recoveryRefs would produce `routes === 0` and a red; `authoredRecoveryRoutesFor` on an unresolvable id returns [] as required. The endurance clause is exercised 525 times. All ten voice regexes are pure ASCII (0 control characters in the file), have no broken escapes, no /g statefulness, and every one fires on realistic positives. The defect is that nothing in the suite asserts its own corpus is non-empty. `allSeasons`, `s.failures`, `worst` and `s.lines` are all iteration sources that can go empty without any line going red — `driveAdversarial` silently `break`s out of the season loop on `if (!out.done) break` (line 122) and on `if (!candidates.length) break` (line 105), and there is no assertion that `allSeasons.length`, `failures`, or `checked` exceeded any floor. On an empty corpus all four gates report PASS, and S-13b prints 'Every one surfaced at least one AUTHORED recovery route tied to that specific failure' over the empty set while S-13c prints 'no catastrophising, no collapse narrative, no verdict on the person'. This is not hypothetical. My first execution of this exact unmodified file printed '0 failure-band resolutions across the adversarial fleet' with gate 231 green and that message intact (also: 120 strings linted, worst pressure 6, minNF 0). Five subsequent runs are deterministic at 292 failures / 186 strings / pressure 14, and there is no Math.random or Date.now anywhere in lib/sim or content/sim, so the first run almost certainly caught the repo mid-write from a concurrent process rather than reflecting a bug in the driver. The point stands regardless: I watched this gate report a confident green over an empty failure set, and one `if (!failures) fail(...)` / `if (allSeasons.length < N) fail(...)` would have made that impossible.

<details><summary>the corrected assertion the prover established</summary>

corrected assertion

Give every gate's iteration source a floor, asserted before the loop:

```ts
const failureIds = new Set(allSeasons.flatMap(s => s.failures.map(f => f.id)));
if (allSeasons.length < 288) { ok = false; details.push(`corpus floor: the adversarial driver produced only ${allSeasons.length} seasons (expected >= 288; it bailed)`); }
if (failures < 100)          { ok = false; details.push(`failure-band floor: only ${failures} failure-band resolutions exercised (expected >= 100)`); }
if (failureIds.size < 30)    { ok = false; details.push(`failure-record floor: only ${failureIds.size} distinct records reached a failure band (expected >= 30)`); }
```

Same shape for S-13a (`allSeasons.length`), S-13c (`checked >= 150`, `worst.length >= 60`), S-13d (`allSeasons.length`). Floors are set at roughly a third of observed (292 / 45 / 864) so authoring churn doesn't false-red them.

Do **not** rely on `ties === failures` as the fix on its own: both sides derive from `i.failure`, so under this regression both are 0 and the comparison is the "two things built from the same source" anti-pattern. It is worth adding as a second clause (it catches a break in `recoveryTieFor` alone), but the floors are the load-bearing part.

Proof the correction is falsifiable — same probe, three inputs:

```
=== CORRECTED ASSERTION ===
  on CONTROL  : PASS | failures 292 | distinct ids 45
  on BROKEN   : FAIL | failure-band floor: only 0 failure-band resolutions exercised (expected >= 100) ;;
                       failure-record floor: only 0 distinct records reached a failure band (expected >= 30)
  on EMPTY [] : FAIL | corpus floor: only 0 adversarial seasons reached (expected >= 288; the driver bailed) ;;
                       failure-band floor: only 0 ... ;; failure-record floor: only 0 ...
```

Green on the shipped content, red on the one-token content regression that today passes, red on an empty corpus.

Probe files (all outside the repo; nothing in the repo was edited):
`C:/Users/sourd/AppData/Local/Temp/claude/F--Programming-The-Guidebook-to-Life/e9743b03-c08a-407b-b768-205c36439d39/scratchpad/probe/p1.ts`, `p2.ts`, `p3.ts`

Control-character scan of `F:/Programming/The Guidebook to Life/tgtl-claude-4.0/tests/s13-pileup.ts`: 0 control characters, 28 non-ASCII (all §/em-dash in comments and strings, none inside a regex). All ten voice regexes are clean.

</details>

### `tests/s9-ui.mjs:530` — open  (certain, ui)

This is the only guard that a named surface actually reached its screen, and it cannot go red for five of the seventeen surfaces because the route they drive is a floor route that always renders a matching root. `freshPlay()` (line 292) still navigates to `BASE + "/play"`, but `/play` is no longer the whole-life arc — app/play/page.tsx says so in its own comment: "`/play` is now a one-screen mode select; the whole-life arc that used to live here moved to `/play/arc`". The step helper `click(page, text)` (line 281-289) returns `false` silently when no control matches, so `click(page, "Read the briefing")`, `"Create your character"`, `"Next: your leaning"`, `"Turn them all"` all miss and the surface never advances. `rootFound` still passes because `.sim-door` is a member of PLAY_ROOT (line 48) — the door is unconditionally available on that route, exactly the shape where a floor member is folded into the set being asserted non-empty. Verified by driving the gate's own exported SURFACES array against the served export and fingerprinting the resulting screen: play-intro, briefing, creation-weights, creation-leaning and creation-hand ALL end at /play with root=`sim-door sim-surface`, h1="Three ways to play a life", 4 controls, 1314 chars of text — byte-identical to the play-door surface. (arc-decision and arc-parse accidentally recover, because their generic `.sim-primary-btn` loops click "Play a whole life" and walk into /play/arc.) `node tests/s9-ui.mjs http://localhost:4517 --surfaces=play-intro,briefing,creation-weights,creation-leaning,creation-hand,arc-decision,arc-parse` prints "[PASS] ... 7 play surfaces x 2 themes x 3 viewports = 42 audits". The creation screens are precisely the ones the file header names as the origin of the whole gate — "the defect class the owner hit on the 3.0 creation screen — clipped button labels and a near-invisible heading" — and they are never loaded. README.md:145 advertises "17 surfaces".

<details><summary>the corrected assertion the prover established</summary>

corrected assertions, and proof each can come back red

Two independent corrections. `click()` returning `false` silently (lines 281–289) is the mechanism; `rootFound` matching a floor member is why nothing notices.

**(A) A step that matches no control is a surface that never advanced — throw instead of returning `false`.** The gate's per-surface `try/catch` already converts that into a `driver error` failure.

```js
async function click(page, text) {
  const el = page.locator(`${PLAY_ROOT}`).locator("button, a", { hasText: text }).first();
  if (await el.count()) { await el.click(); await page.waitForTimeout(90); return true; }
  throw new Error(`step "${text}" matched no control in ${PLAY_ROOT} at ${page.url()}`);
}
```

**(B) `freshPlay()` must navigate to `/play/arc`, not `/play`.**

**(C) Surface identity — the one that catches this shape without depending on step labels.** No two named surfaces may render the same screen; fingerprint = matched play-root class + hash of normalised body text. This is required because `play-intro` has *no* click steps, so (A) is blind to it.

```js
if (seen.has(fp))
  failures.push(`SURFACE IDENTITY: "${s.name}" renders the same screen as "${seen.get(fp)}" `
              + `(fingerprint ${fp}) — it never reached its own screen`);
else seen.set(fp, s.name);
```

Falsifiability, proven in both directions:

```
### (A) alone, current build, healthy export 4517 — RED
[FAIL] Gate 109: S-9 · UI integrity
   briefing · light · 320px: driver error — step "Read the briefing" matched no control in
     .sim-play-app, .play-app, .sim-campaign, .sim-lab, .sim-door at http://localhost:4517/play
   creation-weights · light · 320px: driver error — step "Read the briefing" matched no control ...
   (30 such, briefing/creation-weights/creation-leaning/creation-hand x 2 themes x 3 viewports)

### (A)+(B) route repaired, healthy export 4517 — GREEN
[PASS] Gate 109: 5 play surfaces x 2 themes x 3 viewports = 30 audits ...

### (A)+(B) against the arc-deleted export 4518 — RED again
[FAIL] Gate 109:
   play-intro · light · 320px: no play root matched .sim-play-app, ... (surface did not render)

### (C) surface identity, current SURFACES module (freshPlay -> /play) — RED
[FAIL] surface identity
   SURFACE IDENTITY: "briefing" renders the same screen as "play-intro" (fingerprint sim-door sim-surface::6adc0e45) — it never reached its own screen
   SURFACE IDENTITY: "creation-weights" ... same as "play-intro" (sim-door sim-surface::6adc0e45)
   SURFACE IDENTITY: "creation-leaning" ... same as "play-intro" (sim-door sim-surface::6adc0e45)

</details>

### `tests/s9-ui.mjs:203` — **FIXED**  (certain, ui)

The TEXT SPILL check — the gate's headline purpose, described at line 181-183 as "the owner's clipped-button defect: the UA default `overflow: visible` means the box never 'clips', the label just escapes it" — only runs on elements that own a direct text-node child. `ownText` (line 117-120) returns false for any control whose label is wrapped in a child element, and the build wraps labels routinely: `.sim-priority-preset` (CampaignApp.tsx:733, six of them on campaign-priorities), `.sim-leaning-option` (Creation.tsx:119), `.sim-option` (Playthrough.tsx:689), and the replay buttons in Parse.tsx:187/191/195 all put every character of their label inside `<span>`s. Because those buttons compute `overflow: visible` naturally, the sibling `unmarked-clipping` check at line 191-193 requires `clipsX`/`clipsY` and cannot fire either — so nothing at all guards them. Proven on the live campaign-priorities surface WITHOUT touching overflow: crushing `.sim-priority-preset` to a 70x44 box leaves its label's range box at 805x52 — 735px of text sprawling outside the button, scrollWidth 805 vs clientWidth 68 — and the audit returns `clips=0 targets=0`. A control that DOES carry a bare text node, crushed identically, is caught (`text-spill ... spill=105x0`). This is the shape-4 pattern: the check tests for a property the failing markup does not have.

<details><summary>the corrected assertion the prover established</summary>

corrected assertion

`selectNodeContents()` already does the right measurement; only the entry guard is wrong. Replace `if (ownText(el)) {` at :203 with:

```js
// A control owns its label however that label is marked up. selectNodeContents()
// already measures the WHOLE label, wrapper spans included — gating entry on a
// bare text node exempted every button whose label is wrapped.
const isControl =
  tag === "button" ||
  tag === "select" ||
  (tag === "a" && el.hasAttribute("href")) ||
  el.getAttribute("role") === "button";
if (ownText(el) || (isControl && (el.textContent || "").trim())) {
```

(`tag` is already in scope from :156. `isControl` deliberately mirrors the `interactive` predicate the tap-target check uses at :256-261.)

## Proof the correction is falsifiable

Same three servers, corrected copy at `.../scratchpad/tests/s9-ui.mjs`:

| gate | build | result |
|---|---|---|
| shipped | `.sim-priority-preset{height:2rem}` | **PASS** — "no clipped text" |
| corrected | same defect | **FAIL** — `36 S-9 violations across 6 audits` |
| shipped | `.sim-option{height:2.5rem}` | **PASS** — "no clipped text" |
| corrected | same defect | **FAIL** — `15 S-9 violations across 6 audits` |
| corrected | **clean `out/`, all surfaces** | **PASS** — `17 surfaces x 2 themes x 3 viewports = 102 audits`, exit 0 |

Sample red line from the corrected gate:

```
campaign-priorities · dark · 1280px: CLIPPED TEXT (text-spill)
  div.sim-scene-plate > ul.sim-priority-presets > li > button.sim-priority-preset
  box=245x44 spill=0x116px — "Floor firstGet something under you that holds, t"
```

Red on two independent defects in two different components, green on the unmodified build across all 102 audits — the correction discriminates, it does not merely fire.

Assumption worth flagging: the `isControl` widening is deliberately narrow (controls only, not every element with descendant text). Widening it to all elements would also catch spilling non-interactive cards, but would report the same spill redundantly on every ancestor; the narrow form is what keeps the clean build at zero false positives across 102 audits.

</details>

### `tests/s9-ui.mjs:188` — **FIXED**  (certain, ui)

`inScrollRegion` (line 112-115) walks every ancestor, so this guard skips BOTH clip checks for the entire subtree of any `data-scroll-region`, not just for the marked box itself. The header at line 8-11 promises the narrower thing: "no element's text overflows its own box, unless the box is explicitly marked `data-scroll-region`". Measured on the live surfaces: campaign-parse exempts 48 text-bearing elements (the whole 24-row "The years, in order" list, CampaignApp.tsx:1437) and campaign-explain exempts 14 (the entire attribution drawer body, CampaignApp.tsx:1362) — and campaign-parse is the surface the file itself calls "the longest surface in the build and the last thing a player reads after twelve years". Proven: crushing all 24 season `<li>` inside `.sim-parse-seasons` to 40x8 with `overflow:hidden` (scrollWidth 156 vs clientWidth 37, scrollHeight 22 vs clientHeight 8 — flagrant unmarked clipping) leaves the audit at `clips=0`. Compounding this, the region check that is supposed to earn the exemption (line 128-130) only tests that the CSS *declares* `overflow: auto|scroll`, while the PASS line at 568 reports those regions as "genuinely scrollable" — and `stats.scrollRegions` at 546 is incremented once per audit, so on a full run it reports region-audits (6x the region count), not regions.

<details><summary>the corrected assertion the prover established</summary>

corrected assertion

Self-only **and** per-axis. Replace lines 112-115 and the two clip predicates:

```js
const inScrollRegion = (el) => (el.dataset && el.dataset.scrollRegion !== undefined ? el : null);
const regionAxis = (el) => {
  const r = inScrollRegion(el);
  if (!r) return null;
  const v = r.dataset.scrollRegion;
  return v === "y" ? "y" : v === "x" ? "x" : "both";
};
// line 188 — no guard; every element is examined
{
  const _ax = regionAxis(el);
  const _exX = _ax === "x" || _ax === "both";
  const _exY = _ax === "y" || _ax === "both";
  ...
  if (((overX > 1 && clipsX && !_exX) || (overY > 1 && clipsY && !_exY)) && el.clientWidth > 0) { ... }
  ...
  if (tr.width > 0 && ((spillX > 1.5 && !_exX) || (spillY > tolY && !_exY))) { ... }
}
```

Proof that the correction is falsifiable and adoptable — three predicates over one DOM (`probe-s9-axis.mjs`):

```
0 clean shipped surface (all must be 0)        CURRENT=0 SELFONLY=0 AXIS=0
1 unmarked <li> clipped inside region          CURRENT=0 SELFONLY=24 AXIS=24
   marked <ol> clipped on undeclared axis: { declaredAxis: 'y', scrollW: 1059, clientW: 60, overflowX: 'hidden' }
2 MARKED box clipped on undeclared axis        CURRENT=0 SELFONLY=0 AXIS=1
3 clean again (all must be 0)                  CURRENT=0 SELFONLY=0 AXIS=0
```

And the corrected predicate wired into a full copy of the gate (`s9-axis.mjs`, run against the same served build) produces no false positives:

```
[PASS] Gate 109: S-9 · UI integrity (clip / contrast / tap-target)
   17 play surfaces x 2 themes x 3 viewports = 102 audits: no clipped text, ...
```

So: red on both injected defects, green on the shipped build. Same result for the self-only-only variant (`s9-fixed.mjs`, also 102 audits PASS).

## Secondary — the PASS line overstates two things

`stats.scrollRegions` (line 546) is incremented once per region **per audit**. `campaign-parse` contains exactly one `[data-scroll-region]`, and the gate's own single-surface run says:

```
$ node tests/s9-ui.mjs http://localhost:4331 --surfaces=campaign-parse
   1 play surfaces x 2 themes x 3 viewports = 6 audits: ... 6 marked scroll regions genuinely scrollable...
```

1 region reported as 6. The full run reports 18 for the build's 3 regions (`CampaignApp.tsx:1362`, `CampaignApp.tsx:1437`, `Instruments.tsx:283`). Fix: `stats.scrollRegions = Math.max(stats.scrollRegions, res.scrollRegions.length)` per surface, or count distinct `where` strings. Separately, "genuinely scrollable" describes a stronger property than `okOverflow` checks — probe 4 row 1 is a region reported "genuinely scrollable"

</details>

### `tests/s9-ui.mjs:264` — **FIXED**  (certain, ui)

The stated intent (line 263) is "Inline links inside running prose are text, not controls", but `el.closest("p, li, figcaption")` matches ANY ancestor `<li>`, including card and nav lists. On the play door — the screen every player enters through — all three primary calls to action are `a.sim-primary-btn` inside `li` (`ul.sim-door-grid > li > div.sim-card > div.sim-card-body > a.sim-primary-btn`: "Play a whole life", "Start a campaign", "Open the Lab"). They are link-styled buttons, not prose, and the 44x44 rule can never report them. Proven: shrinking those three to 294x30 — 14px under the minimum, with the label still fitting so no clip check fires either — yields `clips=0 contrast=0 targets=0`. The control confirms the check is otherwise live: shrinking every `<button>` on campaign-allocate to 30px tall produces 44 TAP TARGET failures, and `<button>`s inside `<li>` are still caught because the exemption is gated on `tag === "a"`. The PASS line at 567 claims "every control >= 44x44".

<details><summary>the corrected assertion the prover established</summary>

corrected assertion

Ancestry is the wrong axis. The first repair I tried — `cs.display === "inline"` — is *not* sufficient: it produced a false positive on `div.sim-recovery-block > ul.sim-recovery-list > li > a "the route it names"` (870x23), a genuine prose link blockified by its flex parent. Decide by what the anchor itself paints:

```js
        // Inline links inside running prose are text, not controls. Decided by what
        // the anchor itself PAINTS, not by its ancestors: a link that draws a control
        // (background, border, or button padding) is a control wherever it sits —
        // including inside a card <li> — and a bare text link stays prose even when a
        // flex parent has blockified it.
        const aBg = parseColor(cs.backgroundColor);
        const aBorder = Math.max(
          parseFloat(cs.borderTopWidth) || 0,
          parseFloat(cs.borderRightWidth) || 0,
          parseFloat(cs.borderBottomWidth) || 0,
          parseFloat(cs.borderLeftWidth) || 0,
        );
        const aPadY = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
        const aPadX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
        const paintsAsControl = (aBg && aBg.a > 0.01) || aBorder > 0.5 || aPadY > 2 || aPadX > 2;
        const inProse = tag === "a" && !paintsAsControl;
```

This catches both link-styled classes: `.sim-primary-btn` by its accent background, `.sim-ghost-btn` (transparent) by its `1px` `--sim-line` border; both also by padding. `parseColor` is already in scope.

## Proof the correction is falsifiable (both directions)

Corrected copy at `C:\Users\sourd\AppData\Local\Temp\claude\F--Programming-The-Guidebook-to-Life\e9743b03-c08a-407b-b768-205c36439d39\scratchpad\s9-ui-CORRECTED2.mjs` (only the predicate, the playwright/fixture paths, and the PASS wording differ).

```
### A) CORRECTED2 vs MUTATED build (defect present) — RED
   play-door · light · 320px: TAP TARGET 214x30 < 44x44 li > div.sim-card > div.sim-card-body > a.sim-primary-btn — "Play a whole life"
   … (all three CTAs, both themes, all three viewports) …
   18 S-9 violations across 6 audits.

### B) CORRECTED2 vs CLEAN build — GREEN
[PASS] … 6 play surfaces x 2 themes x 3 viewports = 36 audits: … every control
   (inline prose links aside) >= 44x44, 12 marked scroll regions …

### C) CORRECTED2 vs CLEAN build, remaining 11 surfaces (incl. arc-parse) — GREEN
[PASS] … 11 play surfaces x 2 themes x 3 viewports = 66 audits …
```

102 audits across all 17 surfaces stay green on the correct build; the same predicate tu

</details>

### `tests/s9-ui.mjs:105` — open  (possible, ui)

`over()` (line 80-85) hard-codes the composite alpha to 1 instead of `a1 + a2*(1-a1)`, so as soon as `bgOf` composites two translucent layers the result is declared opaque and the early return at line 105 discards every layer beneath. The effective background is then the undiluted upper colour rather than the real one, and the contrast assertion at 242 is computed against a background that is not on screen. This can turn a flagrant AA violation into a comfortable pass. Proven synthetically with the extracted AUDIT: `#555555` text on `rgba(255,255,255,0.15)` over `rgba(255,255,255,0.15)` over a `#111` page has a true background of rgb(83,83,83) and a true ratio of about 1.0:1 — the gate computes the background as pure white, ratio 7:1, and reports nothing. The identical effective background expressed as one layer IS caught ("1.02/4.5 rgb(85,85,85) on rgb(84,84,84)"). Marked possible rather than certain because I could not find a live instantiation: I measured 0 text elements sitting on two or more translucent layers across campaign-allocate, campaign-consequences, campaign-explain, campaign-parse, lab-compare, arc-parse, play-door and the campaign prologue in both themes. The build has translucent backgrounds (`color-mix(... , transparent)` at sim.css:944-952/1079, `rgba(255,255,255,0.04)` at globals.css:2384) but does not currently stack two of them behind text. The assertion is structurally unable to go red for that input class the moment one appears.

<details><summary>the corrected assertion the prover established</summary>

Corrected assertion

Replace the compositor with real source-over; line 105 then stops being a short-circuit and becomes a correct optimisation (it only fires when a genuinely opaque layer has been reached):

```js
const over = (fg, bg) => {
  const a = fg.a + bg.a * (1 - fg.a);
  if (a <= 0) return { r: 0, g: 0, b: 0, a: 0 };
  const mix = (f, b) => (f * fg.a + b * bg.a * (1 - fg.a)) / a;
  return { r: mix(fg.r, bg.r), g: mix(fg.g, bg.g), b: mix(fg.b, bg.b), a };
};
```

Line 236 (`fg.a < 1 ? over(fg, bg) : fg`) is unaffected — `bgOf` still always returns `a === 1`, so the text composite is unchanged.

## Proof the correction is falsifiable

Same probe, same verbatim AUDIT with only that one function patched (`audit-fixed.js`, `probe-fixed.mjs` in the same scratch dir):

```
--- A1  #555 text, 2x rgba(255,255,255,.15) over a #111 page
  TRUE on-screen bg: rgb(82, 82, 82)   TRUE ratio: 1.05:1
  GATE out.contrast: [{"ratio":1.03,"need":4.5,"color":"rgb(85, 85, 85)","bg":"rgb(83, 83, 83)"}]

┌─────────┬───────────┬───────────┬──────────────┐
│ (index) │ pageBg    │ trueRatio │ gateReported │
├─────────┼───────────┼───────────┼──────────────┤
│ 0       │ '#000000' │ 1.27      │ true         │   gate bg rgb(71,71,71)   vs screenshot rgb(70,70,70)
│ 1       │ '#111111' │ 1.05      │ true         │   gate bg rgb(83,83,83)   vs screenshot rgb(82,82,82)
│ 2       │ '#333333' │ 1.4       │ true         │   gate bg rgb(108,108,108) vs screenshot rgb(107,107,107)
│ 3       │ '#ff0000' │ 2.21      │ true         │   gate bg rgb(255,71,71)  vs screenshot rgb(255,70,70)
│ 4       │ '#008000' │ 2.34      │ true         │   gate bg rgb(71,163,71)  vs screenshot rgb(70,163,70)
│ 5       │ '#ffffff' │ 7.46      │ false        │   correctly still green
└─────────┴───────────┴───────────┴──────────────┘
```

Two-sided: it goes red on all five genuinely-failing backgrounds and stays green on the one that genuinely passes, and its computed background now tracks the decoded screenshot pixel to within 1/255 in every case. That is the falsifiability demonstration — the current version's answer is constant across that same sweep.

## Reachability, stated honestly

I corroborated the claim's "no live instantiation": on the exported build (`out/`, served on 4399), sweeping the `/play` mount in both themes, 46 text elements had **zero** ancestors with even one translucent background layer, let alone two. Statically, the only translucent background declarations in the build are `app/globals.css:2384, 2391, 2399, 2406` and `app/sim.css:944-952, 1079` (the `color-mix(..., transparent)`

</details>

### `tests/browser-gates.mjs:315` — open  (certain, browser)

The filter pattern cannot match the key namespace that actually holds campaign and Lab state. lib/sim/persist.ts SIM_KEYS are `tgtl:sim2:saves`, `tgtl:sim2:active`, `tgtl:sim2:forks`, `tgtl:sim2:parses`. None of the seven alternatives (`board`, `logs`, `guidance`, `roadmap`, `credential`, `daily`, `play`) is a substring of any of them. Every alternative that CAN match names a key in lib/storage.ts ALL_STORAGE_KEYS, which is exactly the list `eraseAll()` iterates — so the regex only ever inspects keys the reset provably removes, and is blind to the only keys it does not. This is the same shape as defect 3/4: the pattern is fed data in which it can never occur, and the gate's own helper `clearPlayState` (line 59) proves the author knew about the `tgtl:sim2` prefix. PROVEN LIVE: driving campaignTo(page,"briefing") writes `tgtl:sim2:active`; clicking "Reset everything this site remembers" leaves it in place (lib/guide-context.tsx:116 calls storage.eraseAll, not persist.eraseAll, and CampaignApp is not mounted on /methodology so the `tgtl:reset` event reaches no listener for it); the gate's filter returns [] and prints "reset: board/logs/guidance/play state cleared", while /play/campaign immediately re-offers "There is a campaign in progress". The assertion is green on top of a live, un-erased campaign.

<details><summary>the corrected assertion the prover established</summary>

corrected assertion

The property the control promises is device-wide, so the check should be namespace-wide rather than an enumeration that has to be kept in sync with two separate key registries:

```js
const leftover = await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith("tgtl:")));
if (leftover.length > 0) {
  ok = false;
  details.push(`reset: leftover ${leftover.join(", ")}`);
} else details.push("reset: every key this site writes is gone — reader state, campaign, saves, forks, parses");
```

## Proof the correction is falsifiable in both directions

`...\scratchpad\probe-fix.mjs` seeds a briefing-stage campaign plus a named save, a fork, a parse archive and a guidance weight, clicks the real reset button, evaluates both predicates, then applies the repair in-page (removing exactly what `lib/sim/persist.ts eraseAll()` removes) and re-evaluates:

```
1. AS SHIPPED  -> leftover: [] => GREEN
2. CORRECTED   -> leftover: ["tgtl:sim2:active","tgtl:sim2:forks","tgtl:sim2:parses",
                             "tgtl:sim2:saves:index","tgtl:sim2:saves:r-1"] => RED
3. CORRECTED, repair applied -> leftover: [] => GREEN
4. /play/campaign after repair: clean — no run offered
```

Line 2 shows it goes red on the defect the shipped assertion calls green; line 3 shows it is not a constant-red — it returns to green precisely when the state is actually gone; line 4 confirms the observable behaviour tracks the assertion. Retaining the current filter's red path for `tgtl:board`/`tgtl:guidance` etc. is preserved, since those keys also start with `tgtl:`.

**Product fix that makes line 2 green:** have `reset()` in `lib/guide-context.tsx` call `persist.eraseAll()` alongside `storage.eraseAll()` (or have `storage.eraseAll()` sweep every `tgtl:`-prefixed key), so the erase control is device-wide as its label and its confirmation text both claim.

**Assumption stated:** probes ran against the existing `F:\Programming\The Guidebook to Life\tgtl-claude-4.0\out\` build served on port 4399; I did not rebuild, and I did not edit the repo — the "repair" in probe 3 is simulated in the page, not committed.

</details>

### `tests/browser-gates.mjs:510` — **FIXED**  (certain, browser)

The keyboard axis switch — one of the three things gate S-4 exists to prove — has NO assertion after it. Nothing is read from the page after the Enter press; `cols` and `noPrediction` were both captured BEFORE the switch (lines 499-500), so no value observed after the interaction can influence `ok`. The success line nevertheless states "axis switched". Additionally the `> 1` guard means that if the first Lab card ever carried a single axis (situation.axes is content-driven, LabApp.tsx:107-117), the block would skip entirely and the same "axis switched" line would still print. PROVEN LIVE: re-ran this block verbatim after replacing the axis buttons with clones so React's handler is detached — the header's "comparing" value stayed on "same start, same luck — only the decision differs" instead of moving to "same choices, different luck", and the block returned ok=true with the identical "...axis switched..." detail.

<details><summary>the corrected assertion the prover established</summary>

Corrected assertion** (replaces lines 511-520). Verified falsifiable, not merely written to look stricter:

```js
    // Switch the axis by keyboard too — and read the surface back.
    const comparingLabel = () => page.locator(".sim-header-intent dd").innerText().catch(() => "");
    const pressedAxes = () => page.locator('.sim-lab-axes .sim-filter-btn[aria-pressed="true"]').allInnerTexts();
    const axes = page.locator(".sim-lab-axes .sim-filter-btn");
    const axisCount = await axes.count();
    let axisSwitched = false;
    if (axisCount < 2) {
      ok = false;
      details.push(`S-4: the opened Lab situation exposes ${axisCount} axis — the keyboard axis switch could not be exercised at all`);
    } else {
      const target = (await axes.nth(1).innerText()).trim();
      const beforeLabel = await comparingLabel();
      const beforePressed = await pressedAxes();
      await axes.nth(1).focus();
      await page.keyboard.press("Enter");
      await sleep(200);
      const afterLabel = await comparingLabel();
      const afterPressed = await pressedAxes();
      const colsAfter = await page.locator(".sim-lab-column").count();
      if (afterLabel === beforeLabel || afterPressed.join("|") === beforePressed.join("|")) {
        ok = false;
        details.push(`S-4: Enter on the axis "${target}" did not switch the axis — comparing stayed "${afterLabel}", pressed stayed ${JSON.stringify(afterPressed)}`);
      } else if (afterPressed.length !== 1 || afterPressed[0].trim() !== target) {
        ok = false;
        details.push(`S-4: after the keyboard axis switch the pressed axis is ${JSON.stringify(afterPressed)}, expected exactly ["${target}"]`);
      } else if (colsAfter !== 2) {
        ok = false;
        details.push(`S-4: after the axis switch the comparison rendered ${colsAfter} branches`);
      } else axisSwitched = true;
    }
    if (cols === 2 && noPrediction && axisSwitched)
      details.push("S-4: one Lab comparison completed keyboard-only, both branches rendered, axis switched, no-prediction line present.");
```

Two changes carry the weight: the post-Enter reads (`comparingLabel`, `pressedAxes`, `colsAfter`) are taken *after* the interaction and compared against pre-interaction snapshots, and the success line is gated on `axisSwitched`, so the sentence can no longer outrun the check. The `axisCount < 2` case now fails loudly instead of skipping — content-driven `situation.axes` (`content/sim/lab/situations.ts:794,807,820,833`) all have ≥2 today, but a one-axis situation must not silently retire the check.

**Proof the correction is

</details>

### `tests/browser-gates.mjs:285` — open  (certain, browser)

`.stage-node.is-selected` count is 1 by construction whenever the roadmap renders. components/Roadmap.tsx:37 initialises `useState<string>("stage-launch")`, line 128 computes `selected = stageIndex(stageId)`, and line 85 applies `is-selected` to exactly the node at that index. There is no unselected state, so the count is 1 before any click and 1 after any reset to the default. The gate never records WHICH stage was selected, so a regression that dropped the reader's choice back to the default on an edition switch is indistinguishable from one that preserved it. PROVEN LIVE: fresh /map with zero interaction -> count 1, label "The launch years"; after clicking nth(2) -> count 1, label "The tutorial years"; after firing the component's own `tgtl:reset` so the selection is genuinely lost -> count 1, label back to "The launch years", and the gate predicate `after !== 1` evaluates GREEN. Real gate run: before=1, after=1.

<details><summary>the corrected assertion the prover established</summary>

Corrected assertion

Capture the identity of the selection, not its cardinality, and require the click to have actually moved it off the default:

```js
await page.goto(BASE + "/map", { waitUntil: "networkidle" });
const selIdx = () => page.$$eval(".stage-node", (ns) => ns.findIndex((n) => n.classList.contains("is-selected")));
const defaultIdx = await selIdx();                       // 4 = stage-launch
await page.locator(".stage-node").nth(2).click();
const before = await selIdx();
await page.locator('.preference-bar button:has-text("Game Guide")').click();
await sleep(160);
const after = await selIdx();
if (before !== 2 || before === defaultIdx || after !== before) {
  ok = false;
  details.push(`map: stage selection lost on edition switch (default=${defaultIdx}, before=${before}, after=${after})`);
} else details.push(`map: stage ${before} stayed selected across edition switch (default is ${defaultIdx})`);
```

Three independent ways to go red: the click never took (`before !== 2`), the fixture picked a stage that happens to be the default so the test proves nothing (`before === defaultIdx`), and the real regression (`after !== before`).

**Falsifiability proof:** block E of probe 1 runs this predicate against the same three worlds — healthy (E1) → GREEN, `tgtl:reset` injected at the switch (E2) → RED, persisted choice wiped and remounted (E3) → RED. Same page, same steps; only the corrected predicate distinguishes them.

Note the same shape sits at line 236: `.stage-node.nth(2).click().catch(() => {})` in the console/URL-leak walk swallows a failed click entirely, so that route's interaction step is also unfalsifiable — out of scope for this claim but the identical construction.

</details>

### `tests/browser-gates.mjs:418` — open  (certain, browser)

`a.help-now` is site-layout chrome, not a play-surface element. components/SiteChrome.tsx:39 sets `showHelpNow = !isThreshold` and line 107 renders `<Link className="help-now" href="/threshold">` inside `header.site-header`, above `main`. Its presence is a pure function of the ROUTE, and the seven sampled states span only three routes (/play/arc, /play/campaign, /play/lab), none of which is a threshold route. Driving to creation vs parse vs allocate vs consequences cannot change the answer, so the per-state property the detail line claims ("Help-now present in all 7 sampled states") is guaranteed by construction the moment the route loads, and the three routes are already covered at their initial state by gate 7 (line 359). Compounding it, the `go()` drivers return unconditionally whether or not the target state was reached (arcTo's loop `break`s out and falls through to `return page`; `click()` returns false silently), so nothing anywhere in this loop can go red for a state that was never entered. PROVEN LIVE: bare loads of all four play routes give count 1 (all from `header.site-header`); deleting `.sim-campaign, .sim-surface, main` outright from /play/campaign still gives count 1 -> GREEN with the entire mode gone.

<details><summary>the corrected assertion the prover established</summary>

corrected assertion

`C:\Users\sourd\AppData\Local\Temp\claude\F--Programming-The-Guidebook-to-Life\e9743b03-c08a-407b-b768-205c36439d39\scratchpad\helpnow-fix-probe.mjs`. Each sampled state carries the marker that proves the driver arrived, and Help-now must be present, rendered, hit-testable at its own centre, and able to carry the reader from that state to the numbers by keyboard:

```js
const STATES = [
  ["arc/creation",          ".sim-creation",      (p) => arcTo(p, "creation")],
  ["arc/parse",             ".sim-parse",         (p) => arcTo(p, "parse")],
  ["campaign/hand",         ".sim-preset-grid",   (p) => campaignTo(p, "hand")],
  ["campaign/briefing",     ".sim-briefing-grid", (p) => campaignTo(p, "briefing")],
  ["campaign/allocate",     ".sim-action-grid",   (p) => campaignTo(p, "allocate")],
  ["campaign/consequences", ".sim-result-list",   (p) => campaignTo(p, "consequences")],
  ["lab/comparison",        ".sim-lab-column",    (p) => labTo(p)],
];
for (const [name, marker, go] of STATES) {
  await go(page);
  if (!(await page.locator(marker).count())) { ok = false; details.push(`${name}: never entered (${marker} absent) — nothing was sampled here`); continue; }
  const link = page.locator("a.help-now").first();
  if (!(await link.count()))     { ok = false; details.push(`${name}: Help-now absent`); continue; }
  if (!(await link.isVisible())) { ok = false; details.push(`${name}: Help-now present but not rendered`); continue; }
  const onTop = await page.evaluate(() => {           // nothing painted over it
    const a = document.querySelector("a.help-now"); a.scrollIntoView({ block: "center" });
    const r = a.getBoundingClientRect(); if (!r.width || !r.height) return false;
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return !!hit && (hit === a || a.contains(hit) || hit.contains(a));
  });
  if (!onTop) { ok = false; details.push(`${name}: Help-now is covered — the click lands on something else`); continue; }
  await link.focus();
  if (!(await page.evaluate(() => document.activeElement?.classList.contains("help-now"))))
    { ok = false; details.push(`${name}: Help-now did not take keyboard focus`); continue; }
  await page.keyboard.press("Enter");
  await page.waitForURL("**/threshold/**", { timeout: 4000 }).catch(() => {});
  const numbers = await page.locator('.threshold a[href^="tel:"]').count().catch(() => 0);
  if (!page.url().includes("/threshold") || numbers < 1)
    { ok = false; details.push(`${name}: Help-now did not reach the numbers (url ${page.url()}, ${numbers} tel: links)`)

</details>

### `tests/browser-gates.mjs:505` — open  (certain, browser)

components/sim/LabApp.tsx:215 renders `<p className="sim-no-prediction">{comparison.noPrediction}</p>` unconditionally inside the `comparison ? (...) : null` branch — there is no guard on the content. The paragraph therefore exists whenever the comparison renders at all, regardless of whether `comparison.noPrediction` is a real sentence, an empty string, or undefined. A `.count()` check cannot see missing or empty content, so the named property ("the no-prediction line did not render") is unreachable; the check collapses into a duplicate of the `cols !== 2` check on the same line — both only ask "did the comparison render". PROVEN LIVE: emptied the paragraph's text on a rendered comparison and the count stayed 1, so the gate stays green with the no-prediction line effectively gone while the success detail still says "no-prediction line present".

<details><summary>the corrected assertion the prover established</summary>

corrected assertion**, at `tests/browser-gates.mjs:500/505/516`. The gate already imports `readFileSync` and has `ROOT`, so the expected text comes from its single source of truth rather than a duplicated literal:

```js
// near FINISHED_CAMPAIGN, top of file
const NO_PREDICTION_LINE = readFileSync(join(ROOT, "lib/sim/lab.ts"), "utf8")
  .match(/export const NO_PREDICTION_LINE\s*=\s*\n\s*"([^"]+)"/)[1]
  .replace(/\s+/g, " ").trim();

// replacing line 500
const noPredictionText = (
  await page.locator(".sim-no-prediction").first().innerText().catch(() => "")
).replace(/\s+/g, " ").trim();

// replacing 505
if (noPredictionText !== NO_PREDICTION_LINE) {
  ok = false;
  details.push(`S-4: the no-prediction line did not render on the comparison (saw ${JSON.stringify(noPredictionText.slice(0, 60))})`);
}

// replacing the success condition at 516
if (cols === 2 && noPredictionText === NO_PREDICTION_LINE)
  details.push("S-4: one Lab comparison completed keyboard-only, both branches rendered, axis switched, no-prediction line present.");
```

**Proof the correction is falsifiable** is the CORRECTED column above, run as real code against real builds: green on A, RED on B (element present, text gone), RED on C (element gone), RED on D (text present but wrong). Three distinct injected defects, three reds, no false red on the good build. The `.match(...)[1]` throws if the source constant's shape changes, which fails the gate loudly rather than degrading it back into a tautology — that is deliberate.

Two assumptions worth naming. (1) `innerText()` returns `""` for a CSS-hidden element, so the corrected form also goes red if the line is styled invisible; I treat that as correct for a line the blueprint requires readers to see, not as a false positive. (2) Defects were injected into the built bundle rather than the TypeScript source, since I was told not to edit the repo; each injection is the exact DOM outcome of the corresponding source bug (field rename, element deletion, copy replacement), verified by the printed `outerHTML`.

Scratch files: `C:\Users\sourd\AppData\Local\Temp\claude\F--Programming-The-Guidebook-to-Life\e9743b03-c08a-407b-b768-205c36439d39\scratchpad\probe\` (`probe.mjs`, `probe2.mjs`, four served copies). Probe servers stopped; repo untouched.

</details>

### `tests/browser-gates.mjs:501` — open  (certain, browser)

components/sim/LabApp.tsx:129 renders the columns from `[comparison.left, comparison.right].map(...)` — a fixed two-element array literal. `cols` can therefore only ever be 0 (comparison null) or 2; the values the failure message is written to report ("rendered 1/3/N branches") are unreachable. The check does not verify that the Lab produced two branches — the JSX guarantees two slots whether or not the engine produced two distinct branches — it only verifies that the comparison section rendered, which is the same thing the adjacent `noPrediction` check already asserts. PROVEN LIVE: cols=2 on a rendered comparison, and structurally cannot be anything but 0 or 2.

<details><summary>the corrected assertion the prover established</summary>

corrected assertion

Each axis names one input it varies and the inputs it holds; assert both from what the columns render. Proven form (`.sim-card-eyebrow` = committed option, `.sim-lab-branch-sub` = starting position, present only on position-vary):

```js
const cols = page.locator(".sim-lab-column");
const n = await cols.count();
if (n !== 2) { ok = false; details.push(`S-4: Lab comparison rendered ${n} branches`); }
else {
  const lesson = await page.locator(".sim-lab-lesson").innerText();
  const opts = async (i) => (await cols.nth(i).locator(".sim-card-eyebrow").allInnerTexts()).join(" | ");
  const subs = async (i) => (await cols.nth(i).locator(".sim-lab-branch-sub").allInnerTexts()).join(" | ");
  const steps = [await cols.nth(0).locator(".sim-card").count(), await cols.nth(1).locator(".sim-card").count()];
  const [oL, oR] = [await opts(0), await opts(1)];
  if (!steps[0] || !steps[1]) { ok = false; details.push(`S-4: a Lab branch rendered no decisions (${steps[0]} vs ${steps[1]})`); }
  if (/the decision itself was worth/.test(lesson)) {
    if (oL === oR) { ok = false; details.push("S-4: choice-vary rendered the same committed choices in both branches — the decision was not varied"); }
  } else if (/different amounts from different places/.test(lesson)) {
    if ((await subs(0)) === (await subs(1))) { ok = false; details.push("S-4: position-vary rendered the same starting position in both branches"); }
    if (oL !== oR) { ok = false; details.push("S-4: position-vary also changed the choices — the axis is not isolated"); }
  } else if (/the draw lands inside it/.test(lesson)) {
    if (oL !== oR) { ok = false; details.push("S-4: draw-vary rendered different choices in the two branches — the axis is not isolated"); }
  } else { ok = false; details.push(`S-4: the comparison named no recognisable axis lesson (${JSON.stringify(lesson)})`); }
}
```

Proof it is falsifiable in both directions (same harness, `probe3.tsx`):

```
=== CORRECTION v3, falsifiability ===
  GREEN  CONTROL   healthy choice-vary
  GREEN  CONTROL   healthy draw-vary
  GREEN  CONTROL   healthy position-vary
  RED    SABOTAGE 1  one branch, rendered twice
             S-4: choice-vary rendered the SAME committed choices in both branches — the decision was not varied
  RED    SABOTAGE 2  choice-vary stops varying the choice
             S-4: choice-vary rendered the SAME committed choices in both branches — the decision was not varied
  RED    SABOTAGE 3  zero steps
             S-4: a Lab branch rendered no decisions (0 vs 0)
  RED    SABOTAGE 4  draw-vary leaks a choice change

</details>

### `tools/build-content.mjs:293` — open  (certain, compiler)

All 35 fail() sites in this file are reachable only through this iteration source, and the source is empty for every directory in the repo. There is no actions-*.json or events-*.json anywhere in the tree (`find . -name 'actions-*.json' -o -name 'events-*.json'` returns nothing), and the project's own generated headers say why: content/sim/campaign/actions/batch-money.ts:8 reads "Originally compiled from a JSON batch by tools/build-content.mjs; that JSON was not retained, so THIS FILE is the authored artifact now and is edited directly." The compiler validates a JSON input format that no longer exists; the artifact that actually ships is the emitted TypeScript, which this file never reads. It is also in no gate chain — package.json's gates, gates:sim, gates:sim4, gates:all and gates:falsify never invoke it; only the standalone `npm run content` does. I ran `node tools/build-content.mjs content/sim/campaign` and it exited 0 with `compiled 0 actions across 0 batches, 0 events across 0 batches`. This is the file-scale instance of "for (const x of []) fail(...)": every assertion below is individually well-formed and individually falsifiable (I probed all 35 and all 35 go red on a violating input), and not one of them can ever see a record.

<details><summary>the corrected assertion the prover established</summary>

corrected assertion

Move the rules onto the artifact that ships. Written as `tests/s3b-pool-schema.ts` (sandbox path `C:/Users/sourd/AppData/Local/Temp/claude/F--Programming-The-Guidebook-to-Life/e9743b03-c08a-407b-b768-205c36439d39/scratchpad/full/tests/s3b-pool-schema.ts`), importing `ACTIONS, EVENTS` from `@/content/sim/registry` — the same source `sim-gates-4.ts` uses — and asserting the non-redundant subset:

```ts
const seen = new Map<string, number>();
for (const r of [...ACTIONS, ...EVENTS]) seen.set(r.id, (seen.get(r.id) ?? 0) + 1);
for (const [id, n] of seen) if (n > 1) fail(id, `duplicate id — defined ${n} times in the shipped pool`);

for (const [lo, hi] of r.seasonBands ?? [])
  if (!(lo >= 1 && hi <= 24 && lo <= hi)) fail(where, `seasonBands [${lo},${hi}] outside 1-24`);

for (const [k, v] of Object.entries(o.gauge ?? {}))          // clampInt(-3,3) became a no-op
  if (Math.abs(Number(v)) > 3) fail(where, `gauge ${k}=${v} is outside the authored range -3..3`);

if (e.invalidates && e.trigger.kind !== "scheduled")          // §7.6
  fail(e.id, `declares an invalidation but resolves in the '${e.trigger.kind}' slot, which is AFTER committed actions (§7.6)`);
```

Note the effect-magnitude one is a genuinely *new* assertion, not a relocation: in the compiler those bounds were `clampInt` normalisation, never a `fail()`. Once the pool is hand-edited TypeScript, nothing clamps, so the bound has to become an assertion or it does not exist.

## Proof the correction is falsifiable

Same plant/restore harness as `tests/falsify-walls.sh`, requiring the gate to go red **and name the record**:

```
ok   A · seasonBands outside 1-24 (build-content.mjs:162) — S-3b went RED and named it:
        act-money-first-cushion: seasonBands [0,99] outside 1-24
ok   B · gauge effect outside the +-3 clamp (build-content.mjs:57) — S-3b went RED and named it:
        act-money-first-cushion/opt-money-cushion-out-of-reach/solid: gauge money=99 is outside the authored range -3..3
ok   C · invalidation off the scheduled slot (build-content.mjs:341-345) — S-3b went RED and named it:
        evt-hours-cut-short-notice: declares an invalidation but resolves in the 'chance' slot, which is AFTER committed actions (§7.6)
ok   D · duplicate id across batches (build-content.mjs:313) — S-3b went RED and named it:
        act-money-first-cushion: duplicate id — defined 2 times in the shipped pool
ok   E · bad family (build-content.mjs:196) — S-3b went RED and named it:
        act-money-first-cushion: bad family "wizardry"

restored; re-running S-3b on the pristine pool:
[PASS] S-

</details>

### `tools/build-content.mjs:467` — open  (certain, compiler)

The compiler's only terminal report is an unconditional count print followed by exit 0. There is no assertion anywhere that files.length > 0, that any batch was matched, or that nA/nE are non-zero — the run's success signal is structurally incapable of distinguishing "validated 145 records clean" from "found no input at all". This is the count>=0 tautology in its purest form, and it is not cosmetic: the index.ts writes at :433 and :449 are unconditional and execute on the zero-batch path too. When I ran the compiler against content/sim/campaign it printed the green success line, exited 0, and overwrote content/sim/campaign/actions/index.ts and events/index.ts with empty ACTION_BATCHES/EVENT_BATCHES arrays — silently emptying the entire shipped pool while reporting success. (I restored both files and verified the reconstruction against the pre-existing .next bundle: 79 batch actions and 66 events, exact match, 8 action batches and 6 event batches matching the batch-*.ts files on disk.)

<details><summary>the corrected assertion the prover established</summary>

corrected assertion

Four additions, all routed through the existing `errors[]`/`exit 1` path so they land before the `writeFileSync` calls at `:433`/`:449`:

```js
// at :293 — a file the loader skips is a record silently missing from the pool
const entries = readdirSync(SRC);
const files = entries.filter((f) => f.endsWith(".json"));
for (const f of entries) {
  if (/\.json$/i.test(f) && !f.endsWith(".json"))
    fail(f, "extension is not lowercase .json — the loader filter is case-sensitive and would skip this file in silence");
  else if (f.endsWith(".json") && !f.startsWith("actions-") && !f.startsWith("events-"))
    fail(f, "JSON file in the batch dir carries no actions-/events- prefix — it would be skipped in silence");
}
if (!files.length) fail(SRC, "batch dir holds no .json files at all — nothing to compile");

// in the per-file loop, right after `records` is built
if (!records.length)
  fail(file, `parsed to ZERO records — expected a top-level array or a { "${isAction ? "actions" : "events"}": [...] } wrapper; top level was ${Array.isArray(raw) ? "an empty array" : `an object with keys [${Object.keys(raw).join(", ")}]`}`);

// before the `if (errors.length)` block at :397 — the compile must not be a regression
const priorBatches = (p, marker) => {
  try { return readFileSync(join(ROOT, p), "utf8").split(marker).length - 1; } catch { return 0; }
};
const priorA = priorBatches("content/sim/campaign/actions/index.ts", `from "@/content/sim/campaign/actions/batch-`);
const priorE = priorBatches("content/sim/campaign/events/index.ts",  `from "@/content/sim/campaign/events/batch-`);
const allowShrink = process.argv.includes("--allow-shrink");
if (!actionBatches.length) fail(SRC, "compiled no action batches — refusing to emit an empty pool");
if (!eventBatches.length)  fail(SRC, "compiled no event batches — refusing to emit an empty pool");
if (!allowShrink && actionBatches.length < priorA)
  fail(SRC, `would shrink the shipped action pool from ${priorA} batches to ${actionBatches.length} — refusing to overwrite actions/index.ts (pass --allow-shrink if that is intended)`);
if (!allowShrink && eventBatches.length < priorE)
  fail(SRC, `would shrink the shipped event pool from ${priorE} batches to ${eventBatches.length} — refusing to overwrite events/index.ts (pass --allow-shrink if that is intended)`);
```

and `:467` stops being a bare count — it reports the comparison, so the green line carries the evidence that made it green:

```js
console.log(`compiled ${nA} actions across ${actionBatches.length} batches (index.ts previously listed ${priorA}), ${n

</details>

### `tools/build-content.mjs:359` — open  (likely, compiler)

The dead-tie assertion is satisfied by construction for every recoveryRef naming a floor action: the map value is hardcoded true rather than derived from the floor source. Probed all three — recoveryRefs:["act-rest-maintain"], ["act-wait"], ["act-seek-help"] each come back GREEN unconditionally, while an equivalent batch action with no recovery option correctly goes RED. The tell is six lines below: the small-actions branch at :361-367 computes the identical fact by reading content/sim/campaign/actions-small.ts and regexing each action's block, so the derived form was clearly available and was used for the neighbouring set. Strip the recovery flag off act-wait's options in actions-floor.ts and this gate stays green for every ref that names it. Currently latent — 0 of the 222 recoveryRefs in the shipped pool point at a floor action — which is precisely why nothing has surfaced it, and precisely the condition under which the earlier floor-fold defect survived.

<details><summary>the corrected assertion the prover established</summary>

corrected assertion

Replace `tools/build-content.mjs:359` with the derived form already used for the neighbouring set six lines below:

```js
  // The floor set lives outside the batches too. DERIVE the fact from
  // content/sim/campaign/actions-floor.ts, exactly as the small moves are derived
  // below: hardcoding `true` here makes the dead-tie assertion unfalsifiable for
  // every ref that names a floor action.
  {
    const floorSrc = readFileSync(join(ROOT, "content/sim/campaign/actions-floor.ts"), "utf8");
    const seenFloor = new Set();
    for (const m of floorSrc.matchAll(/id: "(act-[\w-]+)"/g)) {
      const next = floorSrc.indexOf('id: "act-', m.index + 1);
      const block = floorSrc.slice(m.index, next === -1 ? floorSrc.length : next);
      seenFloor.add(m[1]);
      hasRecoveryOption.set(m[1], /flags: \[[^\]]*"(?:recovery|endurance)"/.test(block));
    }
    for (const id of ["act-rest-maintain", "act-wait", "act-seek-help"])
      if (!seenFloor.has(id))
        fail("actions-floor.ts", `floor action '${id}' is not visible to the dead-tie check — the floor source moved or was renamed`);
  }
```

Two notes on the shape. The `seenFloor` guard is load-bearing: without it, a rename or reformat of the floor source would silently empty the map and turn the gate back into something that reports on nothing. And the flag pattern is `\[[^\]]*"(?:recovery|endurance)"` rather than the existing `/flags: \["recovery"|flags: \["recovery", "endurance"\]/` at `:367`, which only matches `recovery` in first position — `flags: ["endurance", …]` or `["floor", "recovery"]` reads as false under it. That direction produces a false red, not a false green, so it is not this defect class, but the fix should not import it. `actions-floor.ts` is CRLF, so the pattern must not anchor on `^`/`$`.

## Proof the correction is falsifiable

Same probe root, same batch, only the compiler and the floor content varying:

```
=== B  PATCHED | floor source stripped of ALL recovery/endurance flags ===
3 CONTENT ERROR(S) — nothing emitted:
  act-probe-cites-floor: recoveryRef 'act-rest-maintain' points at an action with no recovery- or endurance-flagged option — a dead tie
  act-probe-cites-floor: recoveryRef 'act-wait' points at an action with no recovery- or endurance-flagged option — a dead tie
  act-probe-cites-floor: recoveryRef 'act-seek-help' points at an action with no recovery- or endurance-flagged option — a dead tie
EXIT=1

=== C  PATCHED | REAL, correct floor source ===
compiled 1 actions across 1 batches, 0 events across 0 batches
EXIT=0

=== D  PATCHED | REAL fl

</details>

---

## Refuted

Each of these was claimed inert and shown to have a real path to red.

- `tests/sim-gates-4.ts:289` — `differing` is built by comparing `c.left.steps[i].optionId` against `c.right.steps[i].optionId`. For the two axes that reach this branch (draw-vary, position-vary), `compare()` (l…
- `tests/sim-gates-4.ts:471` — `r.actionId` is set inside `pushRoutes` as `action.id`, and `pushRoutes` is only ever invoked with an object fetched from `ACTION_BY_ID[...]` (lib/sim/season.ts:720, 723). `ACTION_…
- `tests/sim-gates-4.ts:285` — Both sides come from the same absent field. `choicesVaryingOneStep` (lib/sim/lab.ts:200) computes `const step = situation.decisionStep ?? 0` — the identical expression — and varies…
- `tests/sim-gates-4.ts:918` — The pattern requires the aggregation to be method-chained DIRECTLY onto the call — `listSaves().reduce(`. The one component it scans never writes it that way: components/sim/Campai…
- `F:/Programming/The Guidebook to Life/tgtl-claude-4.0/tests/sim-gates-4.ts:1513` — `out.result.queueAfter` and `out.state.queue` are the SAME ARRAY OBJECT, not two arrays that happen to agree. lib/sim/season.ts:660 returns `{ done: true, state: s, result: { ...,…
- `F:/Programming/The Guidebook to Life/tgtl-claude-4.0/tests/sim-gates-4.ts:1486` — This is the replacement for shipped defects 3 and 4, and it has inherited their shape from the other side. The note is built in lib/sim/season.ts:478 as `set in motion in season N…
- `F:/Programming/The Guidebook to Life/tgtl-claude-4.0/tests/sim-gates-4.ts:1644` — classify (lib/sim/attribution.ts:59) opens with an UNCONDITIONAL `out.push({ category: "choice", weight: 1, note: ... })`, and renderable only filters |weight| <= 1e-9, so weight 1…
- `F:/Programming/The Guidebook to Life/tgtl-claude-4.0/tests/sim-gates-4.ts:1622` — `item.attribution` is always the output of `renderable(...)` (lib/sim/season.ts:786), and renderable is `components.filter((c) => Math.abs(c.weight) > 1e-9)` — the exact complement…
- `F:/Programming/The Guidebook to Life/tgtl-claude-4.0/tests/sim-gates-4.ts:1625` — Every item that survives the `if (!item.optionId || item.marker === undefined) continue;` filter was built by resolvedFrom (lib/sim/season.ts:786), whose attribution is `renderable…
- `tests/sim-gates.ts:304` — isRecoveryCard() counts a card if any option carries flags 'recovery' or 'endurance'. content/play/cards/index.ts states the authoring rule in its header ('every act with a recover…
- `tests/sim-gates.ts:509` — content/sim/profile.ts documents this as the gate for 'HARDNESS NEVER RENDERS ... S-8 greps the render layer to prove they reach no rendered string.' It does not do that. profileRe…
- `tests/s10-balance.ts:100` — This is gate 220, "the rails test, mechanized", and it is true by construction for every state the engine can produce — the same shape as the already-found defect #2, which the sui…
- `tests/s10-balance.ts:56` — `debtPenalty(d)` counts how many of DEBT_THRESHOLDS = [3, 6, 9] are <= d, then returns `Math.min(MAX_DEBT_PIP_DRAG, n)`. The largest threshold is 9, so n(9) and n(29) are both 3 —…
- `tools/build-content.mjs:385` — The field this line inspects is stripped by the normaliser before the check ever sees it. normAction:229 and normEvent:273 both emit `...(a.noRecoveryTie && a.noRecoveryTie.reason…
- `tools/build-content.mjs:374` — When a record's recoveryRefs include its own id, hasRecoveryOption.get(ref) is the same expression as ownTie evaluated on the same record — :356 builds the map entry with `a.option…
- `tools/build-content.mjs:379` — This is the same shape as defect #1 relocated from code into data. The condition treats any non-empty recoveryRefs list as a satisfied tie, and the floor actions act-rest-maintain…
