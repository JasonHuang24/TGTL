/**
 * THE C-SUITE'S ENGINE HARNESS (blueprint 6.0 §8, batch 3).
 *
 * Five of batch 3's C-gates have engine behaviour as their subject rather than a
 * source file, a stylesheet or an exported page: C-11 (a curated Lab seed pair
 * lands the same), C-12 (a repeated allocation commits as an ordered set and
 * replays byte-identically), C-16 (`previewAction` writes nothing), C-17 (the
 * upkeep option is present and affordable in the worst envelope of every preset)
 * and C-20 (a reopened season renders its stored explanation, not a recomputation).
 *
 * They live here rather than inside `tests/consolidation-gates.ts` for one
 * mechanical reason: that file is run by `node --experimental-strip-types`, which
 * resolves relative specifiers only, and every engine module in this repository
 * imports through the `@/` alias. `tests/save-status-harness.ts` (C-1, batch 1)
 * set the precedent — a `tsx` harness spawned by the gate, whose output the gate
 * reads. This file extends that precedent to five gates at once so the C suite
 * pays for one spawn rather than five.
 *
 * OUTPUT CONTRACT. One line per assertion:
 *
 *     [C-11] PASS · <what was checked, with its evidence>
 *     [C-11] FAIL · <what is wrong, naming the record/preset/field>
 *
 * `tests/consolidation-gates.ts` parses those lines and reports each C-gate in the
 * usual `[PASS|FAIL] Gate C-N:` format, so `tests/falsify-walls.sh`'s `c_probe`
 * can plant a violation and require the named gate to go red on the witness.
 *
 * Run directly: npx tsx tests/consolidation-sim-harness.ts
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { compare, LAB_SITUATIONS } from "@/lib/sim/lab";
import { LAB_ACTIONS } from "@/content/sim/lab/situations";
import { COMPANIONS } from "@/content/sim/registry";
import { TERMS } from "@/content/terminology";
import { newCampaign, commitSeason, setPriorities, withPhase, serialize, budgetFor, emptyPriorities } from "@/lib/sim/campaign";
import { replay } from "@/lib/sim/forks";
import { menu, previewAction, responseContract, CONTRACT_FIELD_NAMES } from "@/lib/sim/season";
import { deriveBudget } from "@/lib/sim/economy";
import { UPKEEP_ACTION_ID } from "@/content/sim/campaign/actions-small";
import { PRESETS, SEASON_COUNT, ACTION_BY_ID, ACTIONS, EVENTS } from "@/content/sim/registry";
import { explanationOf, recordExplanations, storedExplanationFor } from "@/lib/sim/persist";
import { CONTENT_VERSION, type CommittedAllocation, type SimState } from "@/content/sim/schema";

/**
 * Commit a season, answering any multi-option event that pauses it with its first
 * option — the same loop the S-gate fleets use. Without it a harness that commits
 * one season is at the mercy of whether a season happens to pause on an arrival.
 */
function commitAll(state: SimState, allocs: CommittedAllocation[]) {
  let responses: { eventId: string; optionId: string }[] = [];
  for (let guard = 0; guard < 10; guard++) {
    const out = commitSeason(state, allocs, responses, undefined);
    if (out.done) return out;
    responses = [...responses, { eventId: out.pendingEvent.id, optionId: out.pendingEvent.options[0].id }];
  }
  return { done: false as const, pendingEvent: null as never, answeredSoFar: responses };
}

const lines: string[] = [];
let failed = 0;
const pass = (gate: string, detail: string) => lines.push(`[${gate}] PASS · ${detail}`);
const fail = (gate: string, detail: string) => {
  failed++;
  lines.push(`[${gate}] FAIL · ${detail}`);
};

/* =========================================================================
   C-11 (N-192) — at least one shipped draw-vary pair lands the SAME, and the
   same-outcome reading in lib/sim/lab.ts therefore renders.
   =========================================================================
   The reading is the subject, not the seed: `reading()` decides "same" on the
   bands AND the ending, so the assertion asks the engine for the comparison the
   Lab will actually render and looks for that sentence in it. A seed reverted to
   a separating one makes this gate red and names the situation.
   ========================================================================= */
{
  const SAME_READING = "the same result anyway";
  const found: string[] = [];
  const separating: string[] = [];
  for (const sit of LAB_SITUATIONS) {
    if (!sit.axes.includes("draw-vary")) continue;
    const c = compare(sit.id, "draw-vary");
    if (!c) {
      fail("C-11", `${sit.id}: the draw-vary comparison did not build, so the axis renders nothing at all`);
      continue;
    }
    if (c.reading.includes(SAME_READING) && c.differences.length === 0) found.push(sit.id);
    else separating.push(sit.id);
  }
  if (!found.length)
    fail(
      "C-11",
      `no shipped draw-vary pair lands the same: ${separating.join(", ")} all separate, so lib/sim/lab.ts's third draw-vary reading ("Identical choices, different luck, and the same result anyway…") exists in the code and renders nowhere, and the Lab can only teach half of G-09`,
    );
  else
    pass(
      "C-11",
      `${found.join(", ")} renders the same-outcome draw-vary reading with nothing separating the branches; ${separating.length} other pair(s) still separate, so both halves of G-09 are reachable`,
    );
}

/* =========================================================================
   C-16 (N-212) — `previewAction` is pure.
   =========================================================================
   Three halves, because there are three ways this could write: the state object
   itself, the persisted active key, and the draw cursor. The first is asserted by
   byte-comparing `JSON.stringify(state)` around the call; the second by asserting
   the module reaches no storage at all; the third by taking the same preview twice
   and then committing, and requiring the committed season to be byte-identical to
   the one committed with no preview taken.
   ========================================================================= */
{
  const base = withPhase(
    setPriorities(newCampaign({ origin: { kind: "preset", presetId: PRESETS[0].id }, handSeed: "c16-hand", drawSeed: "c16-draw" }), {
      ...emptyPriorities(),
      safety: 2,
    }),
    "briefing",
  );
  const options = menu(base, budgetFor(base))
    .filter((m) => m.affordable)
    .flatMap((m) => m.action.options.map((o) => o.id));
  if (!options.length) fail("C-16", "no affordable option in the first season, so purity could not be exercised at all");
  else {
    const before = JSON.stringify(base);
    for (const id of options) previewAction(base, id);
    const after = JSON.stringify(base);
    if (before !== after) fail("C-16", `previewAction mutated the state it was handed across ${options.length} option previews`);

    // The draw cursor: a preview that consumed a draw would change what the very
    // next commit resolves to. Commit the same allocation twice — once after a
    // sweep of previews, once cold — and require identical ledgers and states.
    const alloc: CommittedAllocation[] = [{ actionId: "act-rest-maintain", instanceOrdinal: 0, optionId: "opt-rest-hold" }];
    const cold = commitAll(base, alloc);
    for (const id of options) previewAction(base, id);
    const warm = commitAll(base, alloc);
    if (!cold.done || !warm.done) fail("C-16", "the control commit did not complete, so the draw-cursor half proved nothing");
    else if (serialize(cold.state) !== serialize(warm.state))
      fail("C-16", "a season committed after a sweep of previews is not byte-identical to the same season committed cold — preview advanced the draw cursor");
    else if (before === after)
      pass(
        "C-16",
        `${options.length} option previews left JSON.stringify(state) byte-identical, and a season committed after them is byte-identical to the same season committed cold`,
      );
  }
}

/* =========================================================================
   C-17 (N-213) — the standing upkeep option is present and affordable in the
   WORST capacity envelope of every preset, in every season.
   =========================================================================
   The worst envelope is the one S-10's drained sweep drives to and S-13 hunts:
   every gauge at `depleted`, the maintenance backlog past its ceiling, and — the
   part that matters here — money at zero pips, because the debt drag reserves the
   last pip of time and of energy and deliberately does NOT reserve money. An
   upkeep option priced in money would be unaffordable exactly where it is most
   needed, so the gate walks all twenty-four seasons of all five presets in that
   envelope and requires the option to be on the menu and affordable in each.
   ========================================================================= */
{
  const problems: string[] = [];
  let checked = 0;
  const action = ACTION_BY_ID[UPKEEP_ACTION_ID];
  if (!action) problems.push(`${UPKEEP_ACTION_ID} is not in the compiled pool at all`);
  for (const preset of PRESETS) {
    for (let seasonIndex = 0; seasonIndex < SEASON_COUNT; seasonIndex++) {
      const fresh = newCampaign({ origin: { kind: "preset", presetId: preset.id }, handSeed: `c17-${preset.id}`, drawSeed: `c17-${preset.id}` });
      const worst: SimState = {
        ...fresh,
        seasonIndex,
        gauges: { money: 0, healthEnergy: 0, connection: 0, timeStructure: 0 },
        maintenanceDebt: 12,
        conditions: [...new Set([...fresh.conditions, "reduced-capacity", "second-job"])],
      };
      const budget = deriveBudget(worst);
      const entries = menu(worst, budget);
      const entry = entries.find((m) => m.action.id === UPKEEP_ACTION_ID);
      checked++;
      if (!entry) {
        problems.push(`${preset.id} season ${seasonIndex + 1}: ${UPKEEP_ACTION_ID} is not on the menu`);
        continue;
      }
      if (!entry.available) problems.push(`${preset.id} season ${seasonIndex + 1}: ${UPKEEP_ACTION_ID} is unavailable (${entry.reason ?? "no reason given"})`);
      if (!entry.affordable)
        problems.push(
          `${preset.id} season ${seasonIndex + 1}: ${UPKEEP_ACTION_ID} is on the menu and NOT AFFORDABLE in the worst envelope (budget time ${budget.timeStructure}, energy ${budget.energy}, money ${budget.money}) — upkeep that is only affordable when the season is going well is the leftovers, which is the thing this row exists to stop`,
        );
    }
  }
  if (problems.length) for (const p of problems.slice(0, 6)) fail("C-17", p);
  else
    pass(
      "C-17",
      `${UPKEEP_ACTION_ID} is present, available and affordable in all ${checked} preset-seasons of the worst envelope (every gauge depleted, backlog past its ceiling, money at zero pips)`,
    );
}

/* =========================================================================
   C-12 (N-194) — a repeated allocation commits as the SAME ORDERED SET through
   the hand-allocation path, and the run replays byte-identically with it.
   =========================================================================
   The control proposes the previous season's allocation and commits it through
   `commitSeason`, the same call a hand allocation makes. The two things that could
   go wrong are that the proposal loses the order (a set rebuilt from ids rather
   than copied in order) and that the ledger it writes cannot be replayed. Both are
   asserted here; the plant that proves it is a shuffle before the commit.
   ========================================================================= */
{
  const start = withPhase(newCampaign({ origin: { kind: "preset", presetId: PRESETS[0].id }, handSeed: "c12-hand", drawSeed: "c12-draw" }), "briefing");
  const first: CommittedAllocation[] = [
    { actionId: "act-rest-maintain", instanceOrdinal: 0, optionId: "opt-rest-hold" },
    { actionId: UPKEEP_ACTION_ID, instanceOrdinal: 0, optionId: ACTION_BY_ID[UPKEEP_ACTION_ID]?.options[0]?.id ?? "" },
  ].filter((a) => a.optionId);
  const one = commitAll(start, first);
  if (!one.done) fail("C-12", "the first season did not commit, so the repeat could not be exercised");
  else {
    const previous = one.state.committed[one.state.committed.length - 1].allocations;
    // What the control proposes: the previous season's allocation, in order, with
    // each occurrence ordinal recomputed for the season it is being taken in.
    const proposed = repeatProposal(one.state, previous);
    const two = commitAll(one.state, proposed);
    if (!two.done) fail("C-12", "the repeated allocation did not commit through the hand-allocation path");
    else {
      const ledgerOrder = two.state.committed[two.state.committed.length - 1].allocations.map((a) => a.actionId);
      const wanted = previous.map((a) => a.actionId);
      if (JSON.stringify(ledgerOrder) !== JSON.stringify(wanted))
        fail(
          "C-12",
          `the repeated season entered the ledger as [${ledgerOrder.join(", ")}] where the season it repeats is [${wanted.join(", ")}] — a repeat that reorders is not a repeat, and the §7.6 resolution order runs in allocation order`,
        );
      else {
        const again = replay(two.state.origin, { handSeed: two.state.handSeed, drawSeed: two.state.drawSeed }, two.state.committed, two.state.priorities);
        if (serialize(again) !== serialize(two.state))
          fail("C-12", "a run carrying a repeated season does not replay byte-identically from its own ledger");
        else
          pass(
            "C-12",
            `a repeated allocation committed through commitSeason enters the ledger as the same ordered set ([${wanted.join(", ")}]) and the run replays byte-identically from it`,
          );
      }
    }
  }
}

/** The repeat-last-season proposal, in one place so the gate and the UI agree. */
function repeatProposal(state: SimState, previous: CommittedAllocation[]): CommittedAllocation[] {
  const seen = new Map<string, number>();
  const out: CommittedAllocation[] = [];
  for (const a of previous) {
    const n = seen.get(a.actionId) ?? 0;
    seen.set(a.actionId, n + 1);
    out.push({ actionId: a.actionId, instanceOrdinal: nextOrdinalFor(state, a.actionId) + n, optionId: a.optionId });
  }
  return out;
}
function nextOrdinalFor(state: SimState, actionId: string): number {
  let n = 0;
  for (const season of state.committed) for (const a of season.allocations) if (a.actionId === actionId) n++;
  return n;
}

/* =========================================================================
   C-20 (N-216) — after a contentVersion bump, a reopened season renders the
   STORED explanation, not a recomputation.
   =========================================================================
   The trunk re-derived every rendered fact from origin + seeds + ledger, which
   means a content change silently rewrites what a player read. The harness plays a
   season, stores its explanation with the version that produced it, then bumps the
   version the reader is on and asks the season list what it shows. If the answer
   moves with the live content, the record is not a record.
   ========================================================================= */
{
  const start = withPhase(newCampaign({ origin: { kind: "preset", presetId: PRESETS[0].id }, handSeed: "c20-hand", drawSeed: "c20-draw" }), "briefing");
  const alloc: CommittedAllocation[] = [{ actionId: "act-rest-maintain", instanceOrdinal: 0, optionId: "opt-rest-hold" }];
  const run = commitAll(start, alloc);
  if (!run.done) fail("C-20", "the season did not commit, so the stored explanation could not be exercised");
  else {
    const stored = recordExplanations(run.state, run.result);
    const written = storedExplanationFor(stored, run.result.seasonIndex);
    if (!written) fail("C-20", "the resolved season stored no explanation at all");
    else if (written.contentVersion !== CONTENT_VERSION)
      fail("C-20", `the stored explanation is stamped "${written.contentVersion}" and the content that produced it is "${CONTENT_VERSION}"`);
    else {
      // The bump: the reader is now on a different content version. What the
      // season list shows must not move.
      const bumped: SimState = { ...stored, contentVersion: "launch-window-2025.2-harness" };
      const reopened = storedExplanationFor(bumped, run.result.seasonIndex);
      const recomputed = explanationOf(run.result);
      if (!reopened || reopened.explanation !== written.explanation)
        fail("C-20", "a season reopened after a content-version bump does not render the text that was stored with it");
      else if (reopened.contentVersion !== written.contentVersion)
        fail("C-20", `the reopened season's version stamp moved with the live content ("${reopened.contentVersion}"), so the stamp records nothing`);
      else
        pass(
          "C-20",
          `a resolved season stores its rendered explanation (${written.explanation.length} chars) stamped "${written.contentVersion}"; after a content bump the reopened season renders that stored text and that stamp, unchanged, while the live recomputation is ${
            recomputed === written.explanation ? "currently identical (the drift has not happened yet — the record is what makes it survivable when it does)" : "already different"
          }`,
        );
    }
  }
}

/* =========================================================================
   C-15 (N-211) — no selectable response renders without all five contract
   fields, and none of them comes back empty.
   =========================================================================
   The rendered half is asserted in tests/consolidation-gates.ts against the
   component (the campaign is client-only, so out/ carries no options). This is
   the half a component scan cannot do: every option of every action and event in
   the shipped pool, put through the same `responseContract` the card calls, with
   the five names required in order and every value required to be a real
   sentence. An option whose recovery tie went missing, or whose evidence label
   was dropped, fails here by id rather than at some reader's card.
   ========================================================================= */
{
  const problems: string[] = [];
  let checked = 0;
  for (const record of [...ACTIONS, ...EVENTS]) {
    for (const option of record.options) {
      const fields = responseContract(record, option);
      checked++;
      const names = fields.map((f) => f.name);
      if (names.join("|") !== CONTRACT_FIELD_NAMES.join("|")) {
        problems.push(`${record.id}/${option.id}: renders [${names.join(", ")}] where the contract is [${CONTRACT_FIELD_NAMES.join(", ")}]`);
        continue;
      }
      for (const f of fields)
        if (!f.value || f.value.trim().length < 3)
          problems.push(`${record.id}/${option.id}: the "${f.name}" field is empty — a contract field that renders blank is the field missing, with a label over it`);
    }
  }
  if (problems.length) for (const p of problems.slice(0, 6)) fail("C-15", p);
  else pass("C-15", `${checked} selectable responses across the whole pool carry all five contract fields, none of them blank`);
}

/* =========================================================================
   C-22 (N-225), data half — every Lab situation declares at least one unknown.
   =========================================================================
   The rendering half (that they appear BEFORE the branches) is asserted against
   the component in tests/consolidation-gates.ts; this is the half that needs the
   content. Emptying one situation's list names that situation.
   ========================================================================= */
{
  const empty = LAB_SITUATIONS.filter((s) => !(s.unknowns ?? []).filter((u) => u.trim()).length).map((s) => s.id);
  for (const id of empty)
    fail(
      "C-22",
      `${id} declares no unknown. An empty list reads as "there is nothing this fork cannot settle", which is the claim the field exists to prevent on a screen that already looks decisive.`,
    );
  // A BLANK ENTRY is a missing unknown wearing a comma. The list renders one <li>
  // per entry, so an empty string is a bullet with nothing in it — which is worse
  // than an absence, because the heading above it says something was named.
  const blanks: string[] = [];
  for (const sit of LAB_SITUATIONS)
    (sit.unknowns ?? []).forEach((u, i) => {
      if (u.trim().length < 12) blanks.push(`${sit.id} declares an empty unknown at position ${i + 1} — a bullet with nothing in it under a heading that says something was named`);
    });
  for (const b of blanks) fail("C-22", b);
  if (!empty.length && !blanks.length)
    pass(
      "C-22",
      `all ${LAB_SITUATIONS.length} Lab situations declare unknowns (${LAB_SITUATIONS.map((s) => `${s.id}: ${s.unknowns.length}`).join(", ")})`,
    );
}

/* =========================================================================
   C-19 (N-233), the register half over PLAY-SURFACE STRINGS.
   =========================================================================
   Two lists, two scopes, both in content/terminology.json and both explained
   there. `forbiddenRegister` governs the EDITION VOCABULARY and is checked in
   tests/consolidation-gates.ts, which can read the terminology map without the
   content pool. This is the subset that is unambiguously the combat skin,
   checked against every string the play surfaces render — where "damage",
   "kill" and "grind" are ordinary English the shipped pool already uses and 6.0
   may not rewrite.
   ========================================================================= */
{
  const cfg = JSON.parse(readFileSync(join(process.cwd(), "content/terminology.json"), "utf8")) as {
    forbiddenRegisterPlaySurfaces: string[];
  };
  const words = cfg.forbiddenRegisterPlaySurfaces ?? [];
  const strings: { t: string; w: string }[] = [];
  const add = (t: unknown, w: string) => {
    if (typeof t === "string" && t.trim()) strings.push({ t, w });
  };
  for (const a of [...ACTIONS, ...LAB_ACTIONS]) {
    add(a.label, a.id);
    add(a.scene, `${a.id}.scene`);
    add(a.contract.opportunityNote, `${a.id}.opportunityNote`);
    add(a.contract.switchingCost, `${a.id}.switchingCost`);
    (a.failureModes ?? []).forEach((f, i) => add(f, `${a.id}.failureMode[${i}]`));
    for (const [band, pool] of Object.entries(a.outcomeVariants ?? {}))
      (pool as string[]).forEach((l, i) => add(l, `${a.id}.variant.${band}[${i}]`));
    for (const o of a.options) {
      add(o.label, `${a.id}/${o.id}`);
      o.chips.costs.forEach((c, i) => add(c, `${a.id}/${o.id}.cost[${i}]`));
      for (const b of o.bands) add(b.outcome.line, `${a.id}/${o.id}/${b.name}`);
    }
  }
  for (const e of EVENTS) {
    add(e.label, e.id);
    add(e.scene, `${e.id}.scene`);
    for (const [band, pool] of Object.entries(e.outcomeVariants ?? {}))
      (pool as string[]).forEach((l, i) => add(l, `${e.id}.variant.${band}[${i}]`));
    for (const o of e.options) {
      add(o.label, `${e.id}/${o.id}`);
      o.chips.costs.forEach((c, i) => add(c, `${e.id}/${o.id}.cost[${i}]`));
      for (const b of o.bands) add(b.outcome.line, `${e.id}/${o.id}/${b.name}`);
    }
  }
  for (const c of COMPANIONS) {
    add(c.label, c.id);
    c.wants.forEach((w, i) => add(w, `${c.id}.want[${i}]`));
    c.limits.forEach((l, i) => add(l, `${c.id}.limit[${i}]`));
    c.refusalBehaviors.forEach((r, i) => add(r, `${c.id}.refusal[${i}]`));
  }
  for (const p of PRESETS) {
    add(p.label, p.id);
    add(p.fictionalNote, `${p.id}.fictionalNote`);
  }
  for (const sit of LAB_SITUATIONS) {
    add(sit.title, sit.id);
    (sit.unknowns ?? []).forEach((u, i) => add(u, `${sit.id}.unknown[${i}]`));
  }
  for (const t of Object.values(TERMS)) {
    add(t.standard, `term:${t.key}.standard`);
    add(t.game, `term:${t.key}.game`);
    add(t.define, `term:${t.key}.define`);
  }
  // Word-ish boundaries, the same shape tests/util.ts uses, so "mana" does not
  // match inside "management" and "raid" does not match inside "afraid".
  const boundary = (haystackLower: string, word: string): boolean => {
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, (c) => `\\${c}`);
    return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, "i").test(haystackLower);
  };
  const hits: string[] = [];
  for (const w of words)
    for (const st of strings)
      if (boundary(st.t.toLowerCase(), w)) hits.push(`${st.w}: the combat-skin term "${w}" — "${st.t.slice(0, 80)}"`);
  if (!words.length) fail("C-19", "content/terminology.json declares no forbiddenRegisterPlaySurfaces list, so the play-surface half of the register lint is unarmed");
  else if (hits.length) for (const h of hits.slice(0, 6)) fail("C-19", h);
  else pass("C-19", `${strings.length} play-surface strings clean of all ${words.length} unambiguous combat-skin terms`);
}

/* ---------------------------------------------------------------------- */

for (const l of lines) console.log(l);
console.log(`\nharness: ${lines.length - failed} pass, ${failed} fail`);
process.exit(0);
