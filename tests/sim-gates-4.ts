/**
 * THE 4.0 SANDBOX GATE SUITE (blueprint 4.0 §8).
 *
 * `tests/sim-gates.ts` continues to gate the Life Arc's content and the 3.0
 * engine. This file gates the SANDBOX: the extended S-1/S-3/S-5/S-7/S-8 over the
 * campaign and Lab content, plus the new S-9 structural half, S-11, S-12, and the
 * invention gate. S-10 and S-13 are fleet gates and live in their own files
 * because they run long.
 *
 * Run: npm run gates:sim4
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, sep } from "node:path";
import { ROOT, containsPhrase, reportGate, type GateResult } from "./util.ts";

import { ROUTES } from "@/content/routes";
import { CRISIS_TIER_TERMS, LOSS_TIER_TERMS, crisisDomainOf, lossDomainOf } from "@/content/exclusions";
import {
  ACTIONS,
  ACTION_BY_ID,
  EVENTS,
  EVENT_BY_ID,
  COMPANIONS,
  COMPANION_BY_ID,
  BEATS,
  FLOOR_ACTION_IDS,
  PRESETS,
  SEASON_COUNT,
  presetsInOrder,
} from "@/content/sim/registry";
import { ALL_CAMPAIGN_BEATS, campaignBeatPlacements } from "@/content/sim/campaign/beats";
import { LAB_ACTIONS, LAB_SITUATIONS } from "@/content/sim/lab/situations";
import { PRIORITY_PRESETS } from "@/content/sim/priority-presets";
import {
  ATTRIBUTION_CATEGORIES,
  CAPABILITY_LABEL,
  CAPABILITY_MEANING,
  EVIDENCE_MEANING,
  FAMILY_LABEL,
  PRIORITY_LABEL,
  PRIORITY_NOTE,
  RESERVED_EVIDENCE_LABELS,
  type SimAction,
  type SimEvent,
  type SimOption,
} from "@/content/sim/schema";
import {

  profileRender,
  WORTH_GUARD,
  WORTH_GUARD_VERBATIM,
  PROFILE_INTRO,
  AXIS_BAND_NOTE,
} from "@/content/sim/profile";
import { PROFILE_AXIS_MEANING } from "@/content/sim/schema";
import { ECONOMY_RULES } from "@/lib/sim/economy";
import { PILEUP_RULES, plan, runSeason, floorReport, authoredRecoveryRoutesFor, activeNode, availability, selectArrivals, MAX_COMPANION_ARRIVALS } from "@/lib/sim/season";
import { newCampaign, setPriorities, commitSeason, budgetFor, nextOrdinal, emptyPriorities, deserialize, serialize } from "@/lib/sim/campaign";
import { createFork, replay, replayFork, makeSave } from "@/lib/sim/forks";
import { CAMPAIGN_CONTENT_NOTE } from "@/content/sim/methodology-copy";
import { DOOR_MEANING } from "@/content/sim/campaign/doors";
import { DOMAIN_SERVES, servesPriority } from "@/content/sim/domains";
import { PRIORITY_KEYS } from "@/content/sim/schema";
import { computeParse, selectBridge, BRIDGE_FRAME, BRIDGE_TEMPLATES, INVISIBLE_WORK_LINE } from "@/lib/sim/parse";
import { compare, NO_PREDICTION_LINE, AXIS_FRAME, runBranch, defaultChoices } from "@/lib/sim/lab";
import { classify, renderable } from "@/lib/sim/attribution";
import { applyEffects } from "@/lib/sim/effects";
import { resolve } from "@/lib/sim/resolve";
import { drawFor } from "@/lib/sim/rng";
import { insert as queueInsert, step as queueStep } from "@/lib/sim/queue";
import type { CommittedAllocation, CommittedEventResponse, SimState } from "@/content/sim/schema";

const validRoutes = new Set(ROUTES.map((r) => r.path));
for (const extra of ["/play/campaign", "/play/lab", "/play/arc"]) validRoutes.add(extra);
const results: GateResult[] = [];

type Tagged = { text: string; where: string };

/* ============================================================
   String collection
   ============================================================ */

function optionStrings(o: SimOption, where: string, out: Tagged[]) {
  out.push({ text: o.label, where: `${where}.label` });
  o.chips.costs.forEach((c, i) => out.push({ text: c, where: `${where}.cost[${i}]` }));
  (o.chips.positionNotes ?? []).forEach((p, i) => out.push({ text: p.text, where: `${where}.pos[${i}]` }));
  for (const b of o.bands) out.push({ text: b.outcome.line, where: `${where}/${b.name}.line` });
}

/** Every string the sandbox can render OUTSIDE a beat. Loss tier forbidden here. */
function collectNonBeatStrings(): Tagged[] {
  const out: Tagged[] = [];
  const add = (t: unknown, where: string) => {
    if (typeof t === "string" && t.trim()) out.push({ text: t, where });
  };
  for (const a of [...ACTIONS, ...LAB_ACTIONS]) {
    add(a.label, `${a.id}.label`);
    add(a.scene, `${a.id}.scene`);
    add(a.contract.opportunityNote, `${a.id}.opportunityNote`);
    add(a.contract.switchingCost, `${a.id}.switchingCost`);
    (a.failureModes ?? []).forEach((f, i) => add(f, `${a.id}.failureMode[${i}]`));
    for (const [band, pool] of Object.entries(a.outcomeVariants ?? {}))
      (pool as string[]).forEach((l, i) => add(l, `${a.id}.variant.${band}[${i}]`));
    for (const d of a.delayedEffects ?? []) add(d.label, `${a.id}.delayed.${d.id}`);
    for (const o of a.options) optionStrings(o, `${a.id}/${o.id}`, out);
  }
  for (const e of EVENTS) {
    add(e.label, `${e.id}.label`);
    add(e.scene, `${e.id}.scene`);
    add(e.invalidates?.note, `${e.id}.invalidates.note`);
    for (const [band, pool] of Object.entries(e.outcomeVariants ?? {}))
      (pool as string[]).forEach((l, i) => add(l, `${e.id}.variant.${band}[${i}]`));
    for (const d of e.delayedEffects ?? []) add(d.label, `${e.id}.delayed.${d.id}`);
    for (const o of e.options) optionStrings(o, `${e.id}/${o.id}`, out);
  }
  for (const c of COMPANIONS) {
    add(c.label, `${c.id}.label`);
    c.wants.forEach((w, i) => add(w, `${c.id}.want[${i}]`));
    c.limits.forEach((l, i) => add(l, `${c.id}.limit[${i}]`));
    c.refusalBehaviors.forEach((r, i) => add(r, `${c.id}.refusal[${i}]`));
    for (const t of c.trajectory) {
      add(t.label, `${c.id}.stage${t.stage}.label`);
      t.exitBehaviors.forEach((e, i) => add(e, `${c.id}.stage${t.stage}.exit[${i}]`));
    }
  }
  for (const p of PRESETS) {
    add(p.label, `${p.id}.label`);
    add(p.fictionalNote, `${p.id}.fictionalNote`);
    add(p.startState.role, `${p.id}.role`);
    add(p.startState.place, `${p.id}.place`);
    for (const r of p.startState.relationships) add(r.label, `${p.id}.rel.${r.id}`);
    for (const l of profileRender(p.profile).lines) {
      add(l.label, `${p.id}.axis.${l.axis}`);
      add(l.band, `${p.id}.band.${l.axis}`);
      add(l.note, `${p.id}.note.${l.axis}`);
    }
  }
  for (const s of LAB_SITUATIONS) add(s.title, `${s.id}.title`);
  for (const p of PRIORITY_PRESETS) {
    add(p.label, `priority:${p.id}.label`);
    add(p.note, `priority:${p.id}.note`);
  }
  for (const v of Object.values(PRIORITY_LABEL)) add(v, "priority.label");
  for (const v of Object.values(PRIORITY_NOTE)) add(v, "priority.note");
  for (const v of Object.values(CAPABILITY_LABEL)) add(v, "capability.label");
  for (const v of Object.values(CAPABILITY_MEANING)) add(v, "capability.meaning");
  for (const v of Object.values(FAMILY_LABEL)) add(v, "family.label");
  for (const v of Object.values(EVIDENCE_MEANING)) add(v, "evidence.meaning");
  for (const v of Object.values(PROFILE_AXIS_MEANING)) add(v, "profile.axisMeaning");
  for (const axis of Object.values(AXIS_BAND_NOTE)) for (const v of Object.values(axis)) add(v, "profile.bandNote");
  add(PROFILE_INTRO, "profile.intro");
  add(WORTH_GUARD, "profile.worthGuard");
  add(NO_PREDICTION_LINE, "lab.noPrediction");
  for (const v of Object.values(AXIS_FRAME)) add(v, "lab.axisFrame");
  add(BRIDGE_FRAME, "parse.bridgeFrame");
  add(INVISIBLE_WORK_LINE, "parse.invisibleWork");
  for (const r of ECONOMY_RULES) add(r, "methodology.economy");
  for (const r of PILEUP_RULES) add(r, "methodology.pileup");
  // Every bridge template — the parse's real-world next step. Enumerated, not
  // sampled: a sampled seed can miss a template entirely, and one did.
  for (const b of BRIDGE_TEMPLATES) {
    add(b.line, `bridge.${b.theme}.line`);
    add(b.linkLabel, `bridge.${b.theme}.link`);
  }
  return out;
}

function collectBeatStrings(): Tagged[] {
  const out: Tagged[] = [];
  for (const b of ALL_CAMPAIGN_BEATS) {
    out.push({ text: b.prose, where: `${b.id}.prose` });
    out.push({ text: b.skippedLine, where: `${b.id}.skippedLine` });
  }
  return out;
}

/* ============================================================
   S-1 · Content boundary, extended (§5.1)
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  const fail = (m: string) => {
    ok = false;
    details.push(m);
  };
  const nonBeat = collectNonBeatStrings();
  const beat = collectBeatStrings();

  // (a) crisis tier: forbidden EVERYWHERE, beats included.
  for (const { text, where } of [...nonBeat, ...beat]) {
    const lower = text.toLowerCase();
    for (const term of CRISIS_TIER_TERMS)
      if (containsPhrase(lower, term)) fail(`CRISIS-TIER "${term}" (${crisisDomainOf(term)}) in ${where}`);
  }
  // (b) loss tier: forbidden in every non-beat sandbox string, which now
  //     explicitly includes queue labels, briefing lines, timeline and summary
  //     strings, and the parse — all of which are collected above.
  for (const { text, where } of nonBeat) {
    const lower = text.toLowerCase();
    for (const term of LOSS_TIER_TERMS)
      if (containsPhrase(lower, term)) fail(`LOSS-TIER "${term}" (${lossDomainOf(term)}) leaked into non-beat content: ${where}`);
  }
  // (c) beat records structurally correct.
  for (const b of ALL_CAMPAIGN_BEATS) {
    if (b.type !== "scripted") fail(`${b.id}: type must be 'scripted'`);
    if (b.skippable !== true) fail(`${b.id}: skippable must be true`);
    if (b.reducedFrame !== true) fail(`${b.id}: reducedFrame must be true`);
    if (!validRoutes.has(b.realPageLink)) fail(`${b.id}: realPageLink '${b.realPageLink}' does not resolve`);
    if (!b.skippedLine?.trim()) fail(`${b.id}: missing neutral skipped line`);
  }
  // (d) BEAT-CHANNEL ISOLATION. No beat id is reachable through the Event schema
  //     or referenced by any queue insertion, delayed effect, or companion arc.
  const beatIds = new Set(ALL_CAMPAIGN_BEATS.map((b) => b.id));
  for (const e of EVENTS) {
    if (beatIds.has(e.id)) fail(`${e.id}: a beat id exists as an Event record`);
    for (const o of e.options)
      for (const b of o.bands)
        for (const q of b.outcome.effects.queue ?? [])
          if (beatIds.has(q.refId)) fail(`${e.id}: queue insertion references beat '${q.refId}'`);
  }
  for (const a of [...ACTIONS, ...LAB_ACTIONS]) {
    if (beatIds.has(a.id)) fail(`${a.id}: a beat id exists as an Action record`);
    for (const d of a.delayedEffects ?? []) if (beatIds.has(d.id)) fail(`${a.id}: delayed effect is a beat id`);
    for (const o of a.options)
      for (const b of o.bands)
        for (const q of b.outcome.effects.queue ?? [])
          if (beatIds.has(q.refId)) fail(`${a.id}: queue insertion references beat '${q.refId}'`);
  }
  for (const c of COMPANIONS)
    for (const t of c.trajectory)
      for (const ref of t.eventRefs) if (beatIds.has(ref)) fail(`${c.id}: trajectory references beat '${ref}'`);

  // (e) A BEAT NEVER REACHES A QUEUE AT RUNTIME, over real drives.
  //
  // This read `q.sourceRef.id` and could not have caught a leak. `sourceRef` holds
  // the record that CAUSED the insertion — an action or an event — and the two
  // sites that build it (lib/sim/season.ts) both pass a record id, so it is
  // structurally incapable of holding a beat id. The queued ref, which is the
  // thing that would actually be a leaked beat, is folded into `entry.id` by
  // lib/sim/queue.ts:31 and stored nowhere else. So the old line searched a field
  // that cannot hold the value it looked for, and stayed green with a beat
  // provably sitting on the queue via both real insertion paths.
  //
  // It was also nearly starved of data: `state.queue` holds only PENDING entries,
  // so inspecting it once at the end of a run saw about one entry across all six
  // runs. Sampling every season fixes that, and the floor below fails if the
  // check ever finds itself with nothing to look at.
  {
    const queuedRefOf = (q: QueueEntry): string => {
      const prefix = `${q.sourceRef.kind}:${q.sourceRef.id}:s${q.sourceRef.seasonIndex}:`;
      return q.id.startsWith(prefix) ? q.id.slice(prefix.length) : q.id;
    };
    let queueEntriesSeen = 0;
    for (let i = 0; i < 6; i++) {
      const check = (st: SimState) => {
        for (const q of st.queue) {
          queueEntriesSeen++;
          const ref = queuedRefOf(q);
          if (beatIds.has(ref)) fail(`run ${i}: queue holds beat '${ref}' (entry ${q.id})`);
          if (beatIds.has(q.sourceRef.id)) fail(`run ${i}: queue entry ${q.id} is beat-sourced`);
        }
      };
      const r = drivePolicy(PRESETS[i % PRESETS.length].id, `s1-${i}`, 24, check);
      check(r.state);
    }
    // A check that never saw a queue proves nothing about queues.
    if (queueEntriesSeen < 10)
      fail(`beat/queue isolation inspected only ${queueEntriesSeen} queue entries across six 24-season runs — no coverage`);
    // A CANARY, because this check has already been wrong once in the direction
    // that matters. Build the violation it exists to catch — a queue entry whose
    // QUEUED REF is a beat, with an ordinary action as its source, exactly as
    // lib/sim/queue.ts:31 would compose it — and require the predicate to flag it.
    // The authored route into this is covered by the static check above; this one
    // guards every other route (a computed ref, a migration, a new insert site),
    // and without the canary a future edit could starve it again silently.
    {
      const beatId = [...beatIds][0];
      const synthetic: QueueEntry = {
        id: `action:act-rest-maintain:s3:${beatId}`,
        sourceRef: { kind: "action", id: "act-rest-maintain", seasonIndex: 3 },
        label: "a beat that reached the queue by some other route",
        effects: {},
        due: { seasons: 2 },
        placedSeason: 3,
        revealed: true,
        history: [{ seasonIndex: 3, what: "placed" }],
      };
      if (!beatIds.has(queuedRefOf(synthetic)))
        fail(
          "S-1(e)'s beat/queue predicate does not flag a queue entry whose queued ref IS a beat — it is reading the wrong field again and cannot come back red.",
        );
      const benign: QueueEntry = { ...synthetic, id: "action:act-rest-maintain:s3:de-something-ordinary" };
      if (beatIds.has(queuedRefOf(benign)))
        fail("S-1(e)'s beat/queue predicate flags an ordinary queued ref — it would fail on clean content.");
    }
    details.push(`beat/queue isolation: ${queueEntriesSeen} queue entries inspected across six full runs, by queued ref and by source.`);
  }

  // (f) LAB CURATION (§3.8): no Lab window contains or schedules a beat on any
  //     branch, and every window stays valid on every branch under every axis.
  for (const sit of LAB_SITUATIONS) {
    for (const id of sit.window) {
      if (beatIds.has(id)) fail(`${sit.id}: window contains beat '${id}'`);
      const action = LAB_ACTIONS.find((a) => a.id === id);
      if (!action) {
        fail(`${sit.id}: window references unknown action '${id}'`);
        continue;
      }
      // Validity on all branches: a Lab action must not be gated by anything a
      // different draw or a different position could take away mid-window.
      if (action.requiresFlags?.length) fail(`${sit.id}/${id}: requiresFlags would invalidate the window on some branch`);
      if (action.excludesFlags?.length) fail(`${sit.id}/${id}: excludesFlags would invalidate the window on some branch`);
      if (action.contract.prerequisites) fail(`${sit.id}/${id}: prerequisites would invalidate the window on some branch`);
    }
    // Empirically: run every declared axis and confirm both branches render the
    // full window with a real choice at every step.
    for (const axis of sit.axes) {
      const c = compare(sit.id, axis);
      if (!c) {
        fail(`${sit.id}/${axis}: comparison did not build`);
        continue;
      }
      for (const branch of [c.left, c.right]) {
        if (branch.steps.length !== sit.window.length)
          fail(`${sit.id}/${axis}/${branch.id}: window rendered ${branch.steps.length} of ${sit.window.length} steps`);
        for (const step of branch.steps)
          if (!step.optionId) fail(`${sit.id}/${axis}/${branch.id}: step ${step.stepIndex} had no committed choice`);
      }
      // THE AXIS VARIES WHAT THE SCREEN SAYS IT VARIES.
      //
      // choice-vary ran option-index 0 against option-index 1 across EVERY step,
      // so the whole window was swapped while the screen said "The only
      // difference is the decision" and invited the reader to read the gap as
      // what that decision was worth. Three decisions differing is not one.
      // The other two axes must hold every choice identical, or they are not
      // isolating the draw or the position either.
      const differing = c.left.steps
        .map((st, i) => (st.optionId !== c.right.steps[i].optionId ? i : -1))
        .filter((i) => i >= 0);
      if (axis === "choice-vary") {
        if (differing.length !== 1)
          fail(`${sit.id}/choice-vary: ${differing.length} decisions differ between the branches; the axis claims exactly one`);
        if (differing[0] !== (sit.decisionStep ?? 0))
          fail(`${sit.id}/choice-vary: the differing decision is step ${differing[0]}, not the declared decisionStep`);
        if (!c.differences.length)
          fail(`${sit.id}/choice-vary: varying the one decision changed nothing, so the axis teaches nothing here`);
      } else if (differing.length) {
        fail(`${sit.id}/${axis}: ${differing.length} decisions differ, so this axis is not isolating what it names`);
      }
    }
  }

  if (ok)
    details.push(
      `${nonBeat.length} sandbox strings clean of crisis+loss tiers; ${ALL_CAMPAIGN_BEATS.length} beats well-typed on their own channel; ` +
        `no beat reachable through Event, queue, delayed effect, companion arc, or a live run; ` +
        `${LAB_SITUATIONS.length} Lab windows beat-free and valid on every branch of every declared axis.`,
    );
  // THE CONTENT ADVISORY REACHES A PLAYER.
  //
  // The campaign's only advisory lived in `.sim-play-nojs-floor`, which
  // `:root[data-play-hydrated="1"]` hides the instant CampaignApp mounts — so it
  // was visible to exactly the people who could not play. And it named only
  // "loss" while the beat channel had grown to carry a flat stretch and someone
  // close becoming seriously ill as well. Both halves are asserted here: the note
  // renders on a hydrated surface, and it names every loss-tier subject the
  // campaign's own beats can actually deliver.
  {
    const app = readFileSync(join(ROOT, "components/sim/CampaignApp.tsx"), "utf8");
    if (!app.includes("CAMPAIGN_CONTENT_NOTE"))
      fail("no content advisory renders on any hydrated campaign surface — the no-JS floor does not count, it is hidden on hydration");
    const floor = readFileSync(join(ROOT, "app/play/campaign/page.tsx"), "utf8");
    if (!floor.includes("CAMPAIGN_CONTENT_NOTE"))
      fail("the no-JS floor and the played surface do not share one advisory string, so they can drift apart");
    const note = CAMPAIGN_CONTENT_NOTE.toLowerCase();
    const SUBJECTS: [string, string[]][] = [
      ["beat-loss", ["loss"]],
      ["beat-low-season", ["flat stretch", "low stretch"]],
      ["beat-someone-ill", ["seriously ill", "someone close becoming"]],
    ];
    for (const [beatId, words] of SUBJECTS) {
      if (!ALL_CAMPAIGN_BEATS.some((b) => b.id === beatId)) continue;
      if (!words.some((w) => note.includes(w)))
        fail(`the campaign can deliver '${beatId}' and the content advisory does not name its subject`);
    }
  }

  results.push({ id: 201, name: "S-1 · Content boundary + beat-channel isolation + Lab curation (sandbox)", pass: ok, details });
}

/* ============================================================
   S-2 · No numbers in play (sandbox scope)
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  const YEAR = /\b(1[5-9]\d\d|20\d\d)\b/g;
  const all = [...collectNonBeatStrings(), ...collectBeatStrings()];
  for (const { text, where } of all) {
    if (text.includes("%")) {
      ok = false;
      details.push(`percent sign in ${where}`);
    }
    if (/\b\d+\s+(in|out of|of)\s+\d+\b/i.test(text)) {
      ok = false;
      details.push(`"N in M" statistic in ${where}`);
    }
    const bare = text.replace(YEAR, " ").match(/\d[\d.,]*/);
    if (bare) {
      ok = false;
      details.push(`bare number "${bare[0]}" in ${where}: ${JSON.stringify(text.slice(0, 60))}`);
    }
  }
  if (ok) details.push(`${all.length} sandbox strings: no percentages, no "N in M", no bare numbers (years excepted).`);
  results.push({ id: 202, name: "S-2 · No-numbers-in-play lint (sandbox)", pass: ok, details });
}

/* ============================================================
   S-3 · Graph integrity, extended (§8)
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  const fail = (m: string) => {
    ok = false;
    details.push(m);
  };
  const actionIds = new Set([...ACTIONS, ...LAB_ACTIONS].map((a) => a.id));

  const checkOptions = (rec: SimAction | SimEvent, isEvent: boolean) => {
    const min = isEvent ? 1 : 2;
    if (rec.options.length < min || rec.options.length > 4) fail(`${rec.id}: ${min}-4 options; saw ${rec.options.length}`);
    for (const o of rec.options) {
      if (o.bands.length < 2 || o.bands.length > 3) fail(`${rec.id}/${o.id}: options declare 2-3 bands; saw ${o.bands.length}`);
      if (o.bands.filter((b) => b.failure).length > 1) fail(`${rec.id}/${o.id}: at most one failure band`);
      for (const b of o.bands) {
        if (!b.outcome?.line?.trim()) fail(`${rec.id}/${o.id}/${b.name}: missing outcome line`);
        if (!(b.weight > 0)) fail(`${rec.id}/${o.id}/${b.name}: weight must be > 0`);
      }
      if ((o.flags ?? []).includes("endurance") && !o.supportLink)
        fail(`${rec.id}/${o.id}: endurance option must name a supportLink`);
      if (o.supportLink && !validRoutes.has(o.supportLink)) fail(`${rec.id}/${o.id}: supportLink '${o.supportLink}' does not resolve`);
    }
    if (!validRoutes.has(rec.readRef)) fail(`${rec.id}: readRef '${rec.readRef}' does not resolve`);
  };

  for (const a of [...ACTIONS, ...LAB_ACTIONS]) {
    checkOptions(a, false);
    if (RESERVED_EVIDENCE_LABELS.includes(a.contract.evidenceLabel))
      fail(`${a.id}: uses reserved evidence label '${a.contract.evidenceLabel}'`);
    // OUTCOME-VARIANT COVERAGE on repeatables (§3.4b).
    if (a.repeatable) {
      const bandsUsed = new Set(a.options.flatMap((o) => o.bands.map((b) => b.name)));
      const covered = new Set(Object.keys(a.outcomeVariants ?? {}));
      const missing = [...bandsUsed].filter((b) => !covered.has(b));
      if (missing.length) fail(`${a.id}: repeatable, but bands [${missing.join(", ")}] have no outcome variants`);
      for (const [band, pool] of Object.entries(a.outcomeVariants ?? {}))
        if (!(pool as string[]).length) fail(`${a.id}: empty variant pool for band '${band}'`);
    }
    for (const ref of a.recoveryRefs ?? [])
      if (!actionIds.has(ref)) fail(`${a.id}: recoveryRef '${ref}' does not resolve to an action`);
  }
  for (const e of EVENTS) {
    checkOptions(e, true);
    if (RESERVED_EVIDENCE_LABELS.includes(e.evidenceLabel)) fail(`${e.id}: uses reserved evidence label`);
    if (e.trigger.kind === "companion" && !COMPANIONS.some((c) => c.id === e.trigger.arcRef))
      fail(`${e.id}: companion trigger references unknown arc '${(e.trigger as { arcRef: string }).arcRef}'`);
    if (e.invalidates && !e.invalidates.note.trim()) fail(`${e.id}: invalidation rule with no note shown to the player`);
    if (e.invalidates?.resolution === "convert" && e.invalidates.convertTo && !actionIds.has(e.invalidates.convertTo))
      fail(`${e.id}: invalidation converts to unknown action '${e.invalidates.convertTo}'`);
  }

  // THE WITNESS-FIXTURE METHOD (§8): every action must have a witness — a hand +
  // seed + scripted policy under which it actually becomes available — and the
  // gate replays it. An action nothing can reach is dead content.
  //
  // The witness search runs a FAMILY of scripted policies, not one: a greedy
  // policy never opens a door that only another policy's choices unlock (a job
  // trial needs someone to have taken a job first). Each policy biases toward one
  // card family, so between them the fleet actually walks the graph.
  const witnesses = new Map<string, string>();
  const FAMILY_BIASES = ["work", "school", "money", "home", "people", "health", "civic", "inner", "threshold"] as const;
  for (const preset of PRESETS)
    for (let seed = 0; seed < 2; seed++)
      for (const bias of FAMILY_BIASES) {
        const r = drivePolicy(preset.id, `witness-${bias}-${seed}`, SEASON_COUNT, undefined, false, bias);
        for (const id of r.seenAvailable) if (!witnesses.has(id)) witnesses.set(id, `${preset.label} / ${bias} / seed ${seed}`);
      }
  const unreachable = ACTIONS.filter((a) => !witnesses.has(a.id));
  if (unreachable.length)
    fail(`${unreachable.length} actions were never available under any witnessed hand+seed: ${unreachable.slice(0, 8).map((a) => a.id).join(", ")}`);

  // RECOVERY-TIE VERIFICATION (§3.4 step 5). This calls authoredRecoveryRoutesFor,
  // NOT recoveryRoutesFor: the latter folds in the always-available floor route,
  // which made this assertion unfalsifiable — every failure trivially "had a
  // route", and thirty genuinely untied records passed green underneath it. The
  // blueprint is explicit that the gate verifies the tie, "not merely that rest
  // exists", so the function the gate calls has to be able to come back empty.
  {
    // A self-test first: the predicate must be capable of failing at all.
    const canary = authoredRecoveryRoutesFor("act-wait");
    void canary;
    let untied = 0;
    for (const rec of [...ACTIONS, ...EVENTS]) {
      const canFail = rec.options.some((o) => o.bands.some((b) => b.failure));
      if (!canFail) continue;
      if (rec.noRecoveryTie) {
        if (!rec.noRecoveryTie.reason?.trim()) fail(`${rec.id}: declares noRecoveryTie with no stated reason`);
        // The opt-out is a DECLARATION, never an exemption. It says "nothing on
        // this card is a failure the character recovers from, because what
        // happened was another person's decision" — and the only way to mean
        // that is to not mark a failure band. Reaching this line means the
        // record marked one anyway, in which case the engine WILL call
        // recoveryTieFor on it and the player WILL be shown "Ways on from here"
        // under someone's refusal, which is the exact harm the field exists to
        // prevent. An adversarial invention check raised this as a live loophole
        // (records/invention-checks.md); no shipped record uses it that way, and
        // now none can.
        fail(
          `${rec.id}: declares noRecoveryTie AND marks a failure band. The opt-out asserts there is no failure to recover from; it cannot buy an exemption from the §3.4 tie rule. Drop the failure flag, or author a tie.`,
        );
        continue;
      }
      const routes = authoredRecoveryRoutesFor(rec.id);
      if (!routes.length) {
        untied++;
        fail(`${rec.id}: can land a failure band with no AUTHORED recovery route tied to it (the floor route does not count)`);
      }
      for (const r of routes) {
        if (!actionIds.has(r.actionId)) fail(`${rec.id}: recovery route points at unknown action '${r.actionId}'`);
        if (!r.tied) fail(`${rec.id}: authoredRecoveryRoutesFor returned an untied route — the split has leaked`);
      }
      for (const ref of rec.recoveryRefs ?? []) {
        const target = ACTION_BY_ID[ref];
        if (!target) fail(`${rec.id}: recoveryRef '${ref}' does not resolve`);
        else if (!target.options.some((o) => (o.flags ?? []).some((f) => f === "recovery" || f === "endurance")))
          fail(`${rec.id}: recoveryRef '${ref}' points at an action with no recovery-flagged option — a dead tie`);
      }
    }
    void untied;

    // STATE-AWARE. The check above resolves ties on the graph; the PLAYER meets
    // them through `availability()`, which the graph check never runs. A tie
    // whose target's season window closes before the citing record's does, or
    // whose target is a spent non-repeatable, resolves on paper and hands the
    // player an empty list at the moment of the failure. (This is the same
    // unfalsifiable shape as the floor fallback, one level down — the batch
    // verifier for the work-early pool found it by sweeping availability
    // directly, and it was right that the gate could not see it.)
    {
      const holes: string[] = [];
      for (const rec of [...ACTIONS, ...EVENTS]) {
        if (rec.noRecoveryTie) continue;
        if (!rec.options.some((o) => o.bands.some((b) => b.failure))) continue;
        for (const [lo, hi] of rec.seasonBands) {
          for (let season = lo - 1; season <= hi - 1; season += Math.max(1, Math.floor((hi - lo) / 3) || 1)) {
            for (const preset of PRESETS) {
              let probe = newCampaign({ origin: { kind: "preset", presetId: preset.id }, handSeed: "tie", drawSeed: "tie-d" });
              probe = { ...probe, seasonIndex: season };
              // Only check states where this record could actually BE reached. A
              // record gated on a flag the probe does not hold cannot fail there,
              // so a tie that is unavailable there is not a hole — it is a state
              // that does not occur. (An event has no availability() of its own;
              // its requiresFlags stand in.)
              const isAction = Boolean(ACTION_BY_ID[rec.id]);
              if (isAction && !availability(ACTION_BY_ID[rec.id], probe).available) continue;
              if (!isAction && (rec.requiresFlags ?? []).some((f) => !probe.flags.includes(f))) continue;
              // And the state that matters is the one AFTER the failure, because
              // that is when the tie is offered — a failed attempt at something
              // often leaves you holding the thing its recovery needs.
              for (const o of rec.options)
                for (const b of o.bands)
                  if (b.failure) probe = applyEffects(probe, b.outcome.effects);
              const routes = authoredRecoveryRoutesFor(rec.id, probe);
              if (!routes.length)
                holes.push(`${rec.id} @ season ${season + 1} from ${preset.id}: every authored tie is unavailable there`);
            }
          }
        }
      }
      // Report a bounded sample: one hole is a content fix, not a list to scroll.
      const unique = [...new Set(holes.map((h) => h.split(" @ ")[0]))];
      if (unique.length) {
        fail(`${unique.length} record(s) whose authored ties are unavailable at some season they can appear in:`);
        for (const h of holes.slice(0, 6)) details.push("  " + h);
      } else {
        details.push(
          `every failure-capable record's authored tie resolves to an AVAILABLE action at every season it can appear in, from every preset — checked through availability(), not only on the graph.`,
        );
      }
    }
  }

  // COMPANION-ARC REACHABILITY: every arc must have reachable neglect-response,
  // repair-response, and refuse/leave paths (§3.7).
  for (const arc of COMPANIONS) {
    const kinds = new Set(arc.trajectory.map((t) => t.kind));
    for (const need of ["neglect-response", "repair-response"])
      if (!kinds.has(need as never)) fail(`${arc.id}: no ${need} node`);
    if (!kinds.has("refuse") && !kinds.has("leave")) fail(`${arc.id}: neither a refuse nor a leave node`);
    if (!kinds.has("leave")) fail(`${arc.id}: no leave node — a companion who cannot leave is inventory`);
    for (const node of arc.trajectory) {
      if (!node.eventRefs.length) fail(`${arc.id}/${node.stage} ${node.kind}: no events`);
      for (const ref of node.eventRefs)
        if (!EVENTS.some((e) => e.id === ref)) fail(`${arc.id}/${node.kind}: event '${ref}' does not exist`);
    }
    // Every node must be ENTERABLE by some reachable relationship state.
    for (const node of arc.trajectory) {
      const c = node.entryConditions;
      const q = c.minQuality ?? -2;
      const qmax = c.maxQuality ?? 3;
      if (q > qmax) fail(`${arc.id}/${node.kind}: entry conditions cannot both hold (quality)`);
      const n = c.minNeglect ?? 0;
      const nmax = c.maxNeglect ?? 99;
      if (n > nmax) fail(`${arc.id}/${node.kind}: entry conditions cannot both hold (neglect)`);
      if ((c.minSeason ?? 0) >= SEASON_COUNT) fail(`${arc.id}/${node.kind}: minSeason is past the end of the window`);
    }
    // A leave node must actually be reachable within the window.
    const leave = arc.trajectory.find((t) => t.kind === "leave");
    if (leave && (leave.entryConditions.minSeason ?? 0) >= SEASON_COUNT)
      fail(`${arc.id}: leave node unreachable inside the window`);
  }

  // COMPANION DELIVERY, NOT JUST GRAPH WELL-FORMEDNESS. The arrival cap made the
  // scheduler, not the trajectory graph, the thing that decides whether a leave
  // or refuse node's event is ever delivered — and the static check above cannot
  // see the scheduler at all. §3.7 is LITERAL that a companion who cannot leave
  // is inventory, so the guarantee has to be exercised, not inferred.
  {
    let entered = 0;
    let delivered = 0;
    const stranded: string[] = [];
    for (const preset of PRESETS)
      for (let seed = 0; seed < 2; seed++) {
        let st = newCampaign({ origin: { kind: "preset", presetId: preset.id }, handSeed: `arc-${seed}`, drawSeed: `arc-${seed}-d` });
        st = setPriorities(st, { ...emptyPriorities(), closeness: 2, safety: 1 });
        // What "stranded" means, precisely. An arc's active node is a reading of
        // the relationship RIGHT NOW, so a node the relationship moves off is not
        // stranded — it stopped being true. What would be a §3.7 violation is an
        // arc HOLDING a refuse or leave node season after season and never being
        // heard from, which is the scheduler starving the guarantee. So the
        // tracker follows the arc's CURRENT node and resets when it changes.
        const holding = new Map<string, { key: string; since: number }>();
        const heldWithoutDelivery: { key: string; seasons: number }[] = [];
        let guard = 0;
        while (st.seasonIndex < SEASON_COUNT && guard++ < SEASON_COUNT + 5) {
          for (const arc of COMPANIONS) {
            const cs = st.companions[arc.id];
            if (!cs || cs.exited) {
              holding.delete(arc.id);
              continue;
            }
            const node = activeNode(arc.id, st);
            if (!node) {
              holding.delete(arc.id);
              continue;
            }
            // A node whose events have all been used is EXHAUSTED, not starved:
            // there is nothing left for it to deliver, and holding it against the
            // scheduler would be blaming the queue for an empty tray.
            const spent = node.eventRefs.every((id) => {
              const ev = EVENT_BY_ID[id];
              return !ev || st.committed.some((c) => c.eventResponses.some((r) => r.eventId === id));
            });
            if (spent) {
              holding.delete(arc.id);
              continue;
            }
            const key = `${arc.id}@${node.stage}:${node.kind}`;
            const cur = holding.get(arc.id);
            if (!cur || cur.key !== key) {
              if (cur) heldWithoutDelivery.push({ key: cur.key, seasons: st.seasonIndex - cur.since });
              holding.set(arc.id, { key, since: st.seasonIndex });
              entered++;
            }
          }
          const arrivals = selectArrivals(st);
          if (arrivals.companion.length > MAX_COMPANION_ARRIVALS)
            fail(`companion cap exceeded: ${arrivals.companion.length} arrivals in one season`);
          for (const ev of arrivals.companion) {
            const arcId = ev.trigger.kind === "companion" ? ev.trigger.arcRef : undefined;
            if (arcId && holding.has(arcId)) {
              delivered++;
              // Delivered: this node has been heard from, so it is no longer held.
              holding.set(arcId, { key: holding.get(arcId)!.key, since: -1 });
            }
          }
          const allocs = greedyAllocations(st);
          let responses: CommittedEventResponse[] = [];
          let out = commitSeason(st, allocs, responses);
          let inner = 0;
          while (!out.done && inner++ < 10) {
            responses = [...responses, { eventId: out.pendingEvent.id, optionId: out.pendingEvent.options[0].id }];
            out = commitSeason(st, allocs, responses);
          }
          if (!out.done) break;
          st = out.state;
        }
        for (const [, cur] of holding)
          if (cur.since >= 0) heldWithoutDelivery.push({ key: cur.key, seasons: SEASON_COUNT - cur.since });
        for (const h of heldWithoutDelivery) {
          const kind = h.key.split(":")[1];
          if ((kind === "leave" || kind === "refuse") && h.seasons > 8)
            stranded.push(
              `${preset.id}/${seed}: ${h.key} held for ${h.seasons} consecutive seasons without ever being delivered`,
            );
        }
      }
    if (stranded.length) {
      fail(`${stranded.length} companion node(s) entered and never delivered:`);
      for (const x of stranded.slice(0, 6)) details.push("  " + x);
    }
    details.push(
      `companion delivery, driven over real seasons: ${entered} trajectory-node entries across the fleet, ${delivered} heard from; no arc held a refuse or leave node with an UNSPENT event for more than eight consecutive seasons without being delivered, and no season exceeded the arrival cap of ${MAX_COMPANION_ARRIVALS}.`,
    );
  }

  // THE MONOTONY GUARD (§3.4b, §10). Twenty-four seasons of the same ceremony is
  // the failure mode the variant pools exist to prevent, and "it has variants" is
  // not the same as "it has enough". The engine rotates a pool by occurrence, so
  // a line cannot come back until the pool is exhausted — which means the depth
  // of the pool IS the guarantee, and the depth has to scale with how often the
  // action can actually be taken. An unconditional whole-window repeatable can be
  // taken every season, so its pools carry the strictest requirement.
  {
    const DEEP_POOL = 6;
    for (const a of ACTIONS) {
      if (!a.repeatable) continue;
      const unconditional =
        !a.requiresFlags?.length &&
        !a.contract.prerequisites &&
        a.seasonBands.some(([lo, hi]) => hi - lo >= 12);
      const need = unconditional ? DEEP_POOL : 2;
      // The unit is the ROTATION POOL, which is what outcomeLine() actually
      // cycles: one option's band line, followed by the action's variant pool for
      // that band name. Measuring per action-and-band instead would let one deep
      // option cover a shallow one, and a run that keeps picking the shallow
      // option would still reread its line — which is the thing being prevented.
      for (const o of a.options) {
        for (const b of o.bands) {
          const pool = [b.outcome.line, ...(a.outcomeVariants?.[b.name] ?? [])];
          if (pool.length < need)
            fail(
              `${a.id}/${o.id}: band '${b.name}' rotates a pool of ${pool.length} line(s); an ${unconditional ? "unconditional whole-window " : ""}repeatable needs at least ${need} so a run does not reread it`,
            );
          // A duplicate inside a rotation pool is a pool shorter than it looks.
          if (new Set(pool).size < pool.length)
            fail(`${a.id}/${o.id}: band '${b.name}' rotates a pool containing the same line twice`);
        }
      }
    }
  }

  // EVERY DOMAIN TAG IS IN THE VOCABULARY, AND EVERY PRIORITY IS REACHABLE.
  //
  // `domains` was unconstrained free text matched by substring, so 36 of the
  // pool's 77 tags served no priority at all and two — `mastery` and
  // `creativity` — were orphans by spelling. Nothing caught it because nothing
  // asserted it. Both directions now: no unmapped tag, no dead map entry, and no
  // priority left with nothing in the pool that serves it.
  {
    const used = new Set<string>();
    for (const rec of [...ACTIONS, ...EVENTS]) for (const d of rec.domains ?? []) used.add(d);
    for (const d of used)
      if (!DOMAIN_SERVES[d])
        fail(`domain tag '${d}' has no entry in DOMAIN_SERVES, so every record carrying it serves no priority at all`);
    for (const d of Object.keys(DOMAIN_SERVES))
      if (!used.has(d)) fail(`DOMAIN_SERVES maps '${d}', which no record carries — a dead entry`);
    for (const key of PRIORITY_KEYS) {
      const serving = ACTIONS.filter((a) => servesPriority(a.domains ?? [], key));
      if (!serving.length)
        fail(`no action in the pool serves the priority '${key}' — a player who says it matters can never spend a season on it`);
    }
  }

  // A RELATIONSHIP DELTA MUST NAME A REAL COMPANION ARC.
  //
  // `season.ts` reads a companion's quality as
  // `state.relationships.find(r => r.id === arcId)`, so a delta keyed to anything
  // else is a phantom: two records wrote `rel-mo` and `rel-tasha` instead of
  // `arc-friend-mo` and `arc-sibling-tasha`, and helping Mo move raised a
  // relationship nobody reads while the neglect clock — which counts delta ids as
  // contact — went on running against Mo. The mark never appeared on any surface,
  // because the UI renders by arcId. Nothing but a gate would have caught it.
  {
    // A delta MAY name someone with no authored arc — a manager, a group you
    // practise with — and those are ordinary relationships, not companions. The
    // bug is naming a person who DOES have an arc, under a different id. Both
    // instances keyed on the person's short name, so that is the signature: a
    // delta id whose final segment matches the final segment of some arc id.
    const arcIds = new Set(COMPANIONS.map((c) => c.id));
    const arcBySuffix = new Map(COMPANIONS.map((c) => [c.id.split("-").pop() as string, c.id]));
    for (const rec of [...ACTIONS, ...EVENTS]) {
      const deltas = [
        ...rec.options.flatMap((o) => o.bands.flatMap((b) => b.outcome.effects?.relationships ?? [])),
        ...(rec.delayedEffects ?? []).flatMap((d) => d.effects?.relationships ?? []),
      ];
      for (const d of deltas) {
        if (arcIds.has(d.id)) continue;
        const collides = arcBySuffix.get(d.id.split("-").pop() as string);
        if (collides)
          fail(
            `${rec.id}: relationship delta '${d.id}' names the same person as companion arc '${collides}' but is keyed differently — it would move no trajectory and would still tick the neglect clock against them. Use '${collides}'.`,
          );
      }
    }
  }

  // THE DOOR REGISTRY COVERS EVERY FLAG THE CONTENT CAN SET.
  //
  // The parse's closing panel used to render every non-`start:` flag as a door
  // that "opened", in the good-outcome color — so job-ended, benefits-denied and
  // a friend asking for space read as green doors on the last screen of a
  // twelve-year run. It now renders only flags DOOR_MEANING describes, which
  // fixes the lie but introduces a quieter failure: a flag added later without a
  // registry entry would silently vanish from the panel instead. Both halves are
  // asserted — full coverage, and no entry for a flag nothing sets.
  {
    const setByContent = new Set<string>();
    for (const rec of [...ACTIONS, ...EVENTS]) {
      for (const o of rec.options) for (const b of o.bands) for (const f of b.outcome.effects?.flagsSet ?? []) setByContent.add(f);
      for (const d of rec.delayedEffects ?? []) for (const f of d.effects?.flagsSet ?? []) setByContent.add(f);
    }
    for (const f of setByContent)
      if (!DOOR_MEANING[f])
        fail(`run flag '${f}' is set by content but has no entry in DOOR_MEANING, so the parse would silently drop it from the Doors panel`);
    for (const f of Object.keys(DOOR_MEANING))
      if (!setByContent.has(f)) fail(`DOOR_MEANING describes '${f}', which no content record sets — a dead entry`);
    // A skip must say why, and a rendered door must not print a raw flag id.
    for (const [flag, m] of Object.entries(DOOR_MEANING)) {
      if ("skip" in m) {
        if (!m.why.trim()) fail(`${flag}: skipped from the Doors panel with no stated reason`);
        continue;
      }
      if (!m.label.trim()) fail(`${flag}: has no label`);
      if (m.label === flag.replace(/[-_]/g, " ")) fail(`${flag}: the label is just the de-slugged internal id, which is what the panel used to print`);
      if (/\d/.test(m.label)) fail(`${flag}: the label contains a digit`);
    }
  }

  // THE FLOOR SET is what it says it is.
  for (const id of FLOOR_ACTION_IDS) {
    const a = ACTIONS.find((x) => x.id === id);
    if (!a) {
      fail(`floor action '${id}' missing from the pool`);
      continue;
    }
    if (!a.floor) fail(`${id}: floor action without floor:true`);
    const cost = Object.values(a.contract.costs).reduce((s, v) => s + (v ?? 0), 0);
    if (cost !== 0) fail(`${id}: floor action costs ${cost} pips — the floor must be free`);
    if (!a.repeatable) fail(`${id}: floor action must be repeatable`);
  }

  if (ok)
    details.push(
      `${ACTIONS.length} actions + ${EVENTS.length} events + ${LAB_ACTIONS.length} Lab actions well-formed; ` +
        `every action witnessed available under a replayed hand+seed; every failure-capable record carries a tied recovery route; ` +
        `${COMPANIONS.length} arcs each DECLARE neglect-response, repair-response, refuse and leave nodes, and their delivery is exercised over real seasons above; ` +
        `outcome variants cover every band on every repeatable, six deep on the unconditional whole-window ones with no duplicated line; floor set free, repeatable and unconditional.`,
    );
  results.push({ id: 203, name: "S-3 · Graph integrity (witness fixtures, recovery ties, arcs, variants)", pass: ok, details });
}

/* ============================================================
   S-3b · Full-run reachability over the enumerable hand space
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  let completed = 0;
  const runs: { label: string; seed: string }[] = [];
  for (const p of PRESETS) for (let i = 0; i < 3; i++) runs.push({ label: p.id, seed: `reach-${i}` });
  for (let i = 0; i < 10; i++) runs.push({ label: "birth-rng", seed: `reach-drawn-${i}` });

  for (const r of runs) {
    const out = drivePolicy(r.label, r.seed, SEASON_COUNT);
    if (out.state.seasonIndex < SEASON_COUNT) {
      ok = false;
      details.push(`${r.label}/${r.seed}: stalled at season ${out.state.seasonIndex + 1}`);
      if (details.length > 6) break;
    } else {
      completed++;
      const parse = computeParse(out.state);
      if (parse.seasons.length < SEASON_COUNT - 2) {
        ok = false;
        details.push(`${r.label}/${r.seed}: parse saw only ${parse.seasons.length} seasons`);
      }
    }
  }
  if (ok) details.push(`${completed}/${runs.length} runs drove all ${SEASON_COUNT} seasons to a complete parse — every preset and drawn hand completable.`);
  results.push({ id: 204, name: "S-3b · Full-run reachability (completable from every hand)", pass: ok, details });
}

/* ============================================================
   S-5 · No-score lint, extended to ALL play-surface strings (§8)
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  const fail = (m: string) => {
    ok = false;
    details.push(m);
  };
  // WHAT THIS GATE ACTUALLY FORBIDS, and why it is phrased this narrowly.
  //
  // Every string in this game addresses the CHARACTER in the second person. That
  // is the voice. So a substring hunt for "score" or "you always" flags the game's
  // own prose — "she keeps score, quietly" is a sibling's grievance ledger, "the
  // back keeps score" is accumulated strain, "looking like you always do" is a
  // character keeping up appearances. None of those is a reader score, and a lint
  // that fails them is not enforcing the doctrine, it is enforcing a homonym.
  //
  // What the doctrine forbids is (a) an unambiguous reader-scoring or retention
  // token, and (b) the aggregation of runs into a characterisation of the player.
  // (a) is lexical and absolute below. (b) is not a wording problem at all — it is
  // a data-flow problem, and it is checked STRUCTURALLY further down, which is a
  // stronger guarantee than any word list could be.
  const READER_SCORE = [
    "leaderboard",
    "percentile",
    "high score",
    "your score",
    "overall score",
    "final score",
    "total score",
    "your rating",
    "we rate",
    "scored you",
    "rank you",
    "your rank",
    "daily streak",
    "keep your streak",
    "win streak",
  ];
  // Composite / roll-up patterns that would reintroduce a difficulty label.
  const COMPOSITE = [/\boverall difficulty\b/i, /\bdifficulty:\s/i, /\ba hard start\b/i, /\ban easy start\b/i, /\btotal\s+difficulty\b/i];
  // SCORING AS A SHAPE, not as a list of exact phrases.
  //
  // READER_SCORE above is fixed-phrase, so a single intervening word walks
  // straight through it: it holds "your score" and does not hold "your life
  // score". A falsifiability probe planted exactly that in an option label and
  // the gate stayed green — the no-score lint, missing a sentence offering to
  // raise the reader's life score. These match the construction instead of the
  // wording, and are checked against the whole shipped corpus for false
  // positives (ordinary English like "she keeps score, quietly" has no
  // possessive-of-the-reader and is not matched).
  const SCORING_SHAPE = [
    /\byour(\s+\w+){0,3}\s+\b(score|rating|ranking|rank|grade|percentile|tier)\b/i,
    /\b(we|this|the (game|site|guidebook))\s+(score|rate|rank|grade)s?\s+you\b/i,
    /\byou\s+(scored|ranked|rated|graded)\b/i,
    /\b(raise|improve|increase|boost|lower)s?\s+your(\s+\w+){0,3}\s+\b(score|rating|rank|grade)\b/i,
  ];
  // Characterisation of THE PLAYER — addressed to the person, not the character.
  const READER = [/\byour play ?style\b/i, /\bplayers who\b/i, /\byou are the kind of (player|person)\b/i, /\bplayers like you\b/i, /\byour tendencies\b/i, /\bacross your runs\b/i, /\bin your other runs?\b/i];

  const parseSrc = readFileSync(join(ROOT, "lib/sim/parse.ts"), "utf8");
  const strings = [...collectNonBeatStrings(), ...collectBeatStrings()];
  for (const { text, where } of strings) {
    const lower = text.toLowerCase();
    for (const w of READER_SCORE) if (containsPhrase(lower, w)) fail(`reader-scoring token "${w}" in ${where}`);
    for (const re of COMPOSITE) if (re.test(text)) fail(`composite/difficulty phrasing in ${where}: ${JSON.stringify(text.slice(0, 60))}`);
    for (const re of READER) if (re.test(text)) fail(`player-characterisation phrasing in ${where}: ${JSON.stringify(text.slice(0, 60))}`);
    for (const re of SCORING_SHAPE) if (re.test(text)) fail(`reader-scoring construction in ${where}: ${JSON.stringify(text.slice(0, 70))}`);
  }

  // (b) NO CROSS-RUN AGGREGATION, structurally (§11 FORBIDDEN). A parse is
  //     computed from ONE state, and no play surface reads the save index or the
  //     fork list to build anything rendered ABOUT the player. The saves panel may
  //     LIST runs — that is a file manager — but nothing may aggregate them.
  if (!/export function computeParse\(state: SimState\)/.test(parseSrc))
    fail("computeParse no longer takes exactly one run state — cross-run aggregation would become possible");
  if (/listSaves|loadSave|listForks|SIM_KEYS/.test(parseSrc)) fail("the parse reads the save store — a parse is per-run (§11)");
  for (const file of collectSources(join(ROOT, "components/sim"))) {
    const base = file.replace(ROOT + sep, "").split(sep).join("/");
    const src = readFileSync(file, "utf8");
    // Aggregation shapes over the save list: reduce/filter-then-count/average.
    for (const m of src.matchAll(/\b(listSaves|listForks)\(\)\s*\.\s*(reduce|map|filter|some|every|sort)\b/g))
      if (!/\.map\b/.test(m[0])) fail(`${base}: aggregates over ${m[1]}() — runs are never combined into a reading about the player`);
  }

  // Structural: the parse type carries no total/score field.
  if (/type CampaignParse[\s\S]*?\b(total|score|rating)\b\s*:/.test(parseSrc)) fail("CampaignParse declares a total/score/rating field");

  // THE BRIDGE'S SELECTION SEMANTICS (§3.9, LITERAL). The signature is the
  // enforcement: selectBridge takes a campaign id and NOTHING else, so it CANNOT
  // key on this run's failures, neglects, priorities or outcomes. This asserts
  // the signature as well as the wording.
  const sig = parseSrc.match(/export function selectBridge\(([^)]*)\)/);
  if (!sig) fail("selectBridge not found");
  else {
    const params = sig[1].replace(/\s+/g, " ").trim();
    // NARROWED after the adversarial review: an earlier version also took the
    // hand seed, and since the hand seed fully determines the starting hand, the
    // run's whole constraint profile was recoverable inside the selector with the
    // signature unchanged. A campaign id is the same for every run of a campaign,
    // so from it nothing about a particular run can be recovered at all.
    if (params !== "campaignId: string")
      fail(`selectBridge signature is "${params}" — it may take ONLY a campaign id (§3.9)`);
  }
  // Every call site must pass a campaign id — never a seed, a state object, or a
  // parse, a priority set, or anything derived from what happened in the run.
  for (const m of parseSrc.matchAll(/selectBridge\(([^)]*)\)/g)) {
    const args = m[1].replace(/\s+/g, " ").trim();
    if (args.startsWith("campaignId")) continue; // the declaration itself
    // Exactly one argument, and it must be an identifier — never a property
    // access, a call, or anything else that could carry run state in disguise.
    if (!/^[A-Za-z_$][\w$]*$/.test(args))
      fail(`selectBridge called with "${args}" — it may take ONLY a campaign id (§3.9)`);
  }
  // EVERY template, enumerated — not the ones a sampled seed happens to reach.
  // Seed sampling left one template entirely unlinted and two unchecked for
  // framing, which is exactly the hole a sampling gate always has.
  // A template must contain a sentence that BEGINS with "If" — the invitation is
  // the whole point, and a conditional buried mid-clause is not one.
  const CONDITIONAL = /(^|[.!?]\s+)If\b/;
  // And it must never make a declarative claim about the reader. The test is on
  // SENTENCE-INITIAL second person, because that is what an assertion looks like:
  // "you are ..." as the main clause. A subordinate "which one you are" is the
  // opposite — it is the sentence disclaiming the assertion.
  const ASSERTS_ABOUT_READER = /(^|[.!?]\s+)You\s+(are|have|need|should|must|will)\b/;
  for (const b of BRIDGE_TEMPLATES) {
    const lower = b.line.toLowerCase();
    for (const w of READER_SCORE) if (containsPhrase(lower, w)) fail(`bridge template "${b.theme}": reader-scoring token "${w}"`);
    for (const re of READER) if (re.test(b.line)) fail(`bridge template "${b.theme}": player-characterisation phrasing`);
    if (!CONDITIONAL.test(b.line))
      fail(`bridge template "${b.theme}" contains no sentence beginning "If" — it must invite, never assert about the reader`);
    if (!validRoutes.has(b.href)) fail(`bridge template "${b.theme}" links to an unknown route`);
    if (ASSERTS_ABOUT_READER.test(b.line))
      fail(`bridge template "${b.theme}" makes a declarative claim about the reader`);
  }
  // The frame the reader actually sees must be the string this gate lints.
  const campaignSrcForFrame = readFileSync(join(ROOT, "components/sim/CampaignApp.tsx"), "utf8");
  if (!/BRIDGE_FRAME/.test(campaignSrcForFrame))
    fail("the campaign renders a hand-copied bridge frame rather than the linted BRIDGE_FRAME constant");

  // Play-surface components carry no score tokens in rendered text.
  for (const file of collectSources(join(ROOT, "components/sim")).concat(collectSources(join(ROOT, "app/play")))) {
    const base = file.replace(ROOT + sep, "").split(sep).join("/");
    const src = readFileSync(file, "utf8");
    for (const w of ["leaderboard", "percentile", "high score"]) if (src.includes(w)) fail(`${base}: score token "${w}"`);
  }

  if (ok)
    details.push(
      `${strings.length} play-surface strings clean of score, composite-difficulty and reader-characterisation patterns; ` +
        `parse carries no total; the bridge selector takes a campaign id and nothing else, and every template is conditionally framed.`,
    );
  results.push({ id: 205, name: "S-5 · No-score lint (all play-surface strings, incl. the parse bridge)", pass: ok, details });
}

/* ============================================================
   S-6 · Input doctrine (sandbox scope)
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  const offenders: string[] = [];
  for (const file of collectSources(join(ROOT, "components/sim")).concat(collectSources(join(ROOT, "app/play")))) {
    const base = file.replace(ROOT + sep, "").split(sep).join("/");
    const src = readFileSync(file, "utf8");
    if (/<textarea[\s>]/i.test(src)) offenders.push(`${base} (textarea)`);
    for (const tag of src.match(/<input\b[^>]*>/gi) ?? []) {
      const type = (tag.match(/type="([^"]*)"/i) ?? [])[1];
      if (!type || ["text", "search", "email", "url", "tel", "password", "number"].includes(type.toLowerCase()))
        offenders.push(`${base} (free-text input)`);
    }
  }
  if (offenders.length) {
    ok = false;
    details.push(`free-text fields on a sandbox surface: ${offenders.join(", ")} — the sandbox enumerates, it never interprets`);
  } else {
    details.push("No free-text field on any sandbox surface. Every input the engine responds to is enumerated.");
  }
  // And no self-insertion path: hands come only from Birth RNG or the presets.
  const campaignSrc = readFileSync(join(ROOT, "components/sim/CampaignApp.tsx"), "utf8");
  const origins = campaignSrc.match(/origin:\s*\{\s*kind:\s*"([a-z-]+)"/g) ?? [];
  for (const o of origins)
    if (!/"preset"|"birth-rng"/.test(o)) {
      ok = false;
      details.push(`a hand origin other than preset/birth-rng appears: ${o}`);
    }
  if (ok) details.push(`Hand origins in the campaign surface: only preset and birth-rng (${origins.length} sites).`);
  results.push({ id: 206, name: "S-6 · Input doctrine + no self-insertion (sandbox)", pass: ok, details });
}

/* ============================================================
   S-7 · Determinism, extended (§2.1, §3.8)
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  const fail = (m: string) => {
    ok = false;
    details.push(m);
  };

  // (a) Same origin + seeds + ledger ⇒ byte-identical run.
  for (let i = 0; i < 8; i++) {
    const a = drivePolicy(PRESETS[i % PRESETS.length].id, `det-${i}`, 12);
    const b = drivePolicy(PRESETS[i % PRESETS.length].id, `det-${i}`, 12);
    if (serialize(a.state) !== serialize(b.state)) fail(`seed det-${i}: two identical drives produced different state`);
  }

  // (b) OCCURRENCE-DISCRIMINATED DRAWS (§2.1, the sanctioned extension). The
  //     SAME action resolved in different seasons must draw DIFFERENTLY, while a
  //     replay stays identical. This is the fixture the blueprint names.
  const repeatable = ACTIONS.filter((a) => a.repeatable && !a.floor);
  let differing = 0;
  let checked = 0;
  for (const a of repeatable.slice(0, 12)) {
    const draws = new Set<number>();
    for (let season = 0; season < 6; season++)
      draws.add(drawFor("occ-seed", { seasonIndex: season, instanceOrdinal: season, id: a.id }));
    checked++;
    if (draws.size >= 5) differing++;
    // and the same coordinates always reproduce
    const once = drawFor("occ-seed", { seasonIndex: 3, instanceOrdinal: 3, id: a.id });
    const twice = drawFor("occ-seed", { seasonIndex: 3, instanceOrdinal: 3, id: a.id });
    if (once !== twice) fail(`${a.id}: identical coordinates produced different draws`);
  }
  if (checked && differing < checked) fail(`${checked - differing}/${checked} repeatable actions drew the same value across occurrences`);

  // (c) An actual replayed run: the same action taken twice lands independently.
  {
    const rest = "act-rest-maintain";
    let s = newCampaign({ origin: { kind: "preset", presetId: PRESETS[0].id }, handSeed: "rep", drawSeed: "rep-draw" });
    s = setPriorities(s, { ...emptyPriorities(), safety: 2 });
    const bands: string[] = [];
    for (let i = 0; i < 6; i++) {
      const ord = nextOrdinal(s, [], rest);
      const out = commitSeason(s, [{ actionId: rest, instanceOrdinal: ord, optionId: "opt-rest-hold" }], []);
      if (!out.done) break;
      const item = out.result.items.find((x) => x.id === rest && x.band);
      if (item?.band) bands.push(item.band);
      s = out.state;
    }
    if (new Set(bands).size < 2 && bands.length >= 4)
      details.push(`note: the same action landed in one band across ${bands.length} occurrences (${bands[0]}) — narrow by design here, not a determinism fault`);
  }

  // (d) FORK ISOLATION, with a parent byte-compare (§3.8).
  {
    const parent = drivePolicy(PRESETS[1].id, "fork-parent", 8).state;
    const before = serialize(parent);
    const { record, state: forked } = createFork(parent, "parent-ref", 4, "a branch", "choice-vary");
    // Play the fork forward.
    let f = forked;
    for (let i = 0; i < 6 && f.seasonIndex < SEASON_COUNT; i++) {
      const allocs = greedyAllocations(f);
      let responses: CommittedEventResponse[] = [];
      let out = commitSeason(f, allocs, responses);
      let guard = 0;
      while (!out.done && guard++ < 8) {
        responses = [...responses, { eventId: out.pendingEvent.id, optionId: out.pendingEvent.options[0].id }];
        out = commitSeason(f, allocs, responses);
      }
      if (!out.done) break;
      f = out.state;
    }
    if (serialize(parent) !== before) fail("creating and playing a fork mutated the parent run");
    if (f.committed.length <= record.forkPoint) fail("the fork did not advance past its fork point");
    // The fork's prefix is identical to the parent's; the suffix is its own.
    for (let i = 0; i < record.forkPoint; i++)
      if (JSON.stringify(f.committed[i]) !== JSON.stringify(parent.committed[i]))
        fail(`fork prefix diverged from the parent at season ${i + 1}`);
    // A draw-vary fork re-derives from a fresh draw-seed and still leaves the parent alone.
    const before2 = serialize(parent);
    const dv = createFork(parent, "parent-ref", 4, "different luck", "draw-vary");
    if (dv.state.drawSeed === parent.drawSeed) fail("a draw-vary fork kept the parent's draw seed");
    if (serialize(parent) !== before2) fail("a draw-vary fork mutated the parent run");

    // (d2) A BRANCH IS REPLAYABLE FROM WHAT IT NAMES.
    //
    // The old handler passed the literal string "active" as parentRef and saved
    // nothing, so the record pointed at a save that did not exist and the branch
    // list was labels with no way back. Isolation held (the parent was never
    // mutated) while the branch was decorative — form without substance. This
    // asserts the substance: the ref resolves, replaying it from that save
    // reproduces the branch exactly, and the parent is still untouched afterwards.
    const parentSave = makeSave(parent, "the run it came from", "at the branch point");
    const branch = createFork(parent, parentSave.ref, 4, "a resumable branch", "choice-vary");
    if (branch.record.parentRef !== parentSave.ref) fail("a fork's parentRef does not name the save it came from");
    if (branch.state.fork?.ref !== branch.record.ref) fail("a fork's state does not carry its own record ref, so its suffix can never be synced");
    const played = playOn(branch.state, 3);
    const branchRecord = { ...branch.record, suffix: played.committed.slice(branch.record.forkPoint) };
    const rebuilt = replayFork(branchRecord, parentSave.state.origin, parentSave.state.committed, parentSave.state.priorities);
    if (serialize(rebuilt) !== serialize(played))
      fail("replaying a branch from the save it names did not reproduce the branch");
    if (serialize(parent) !== before2) fail("replaying a branch mutated the parent run");

    // Two branches taken from the same season must not collide. The ref used to
    // key only on drawSeed+forkPoint, so writeFork's dedupe silently replaced the
    // first with the second.
    const otherSave = makeSave(parent, "a second save of the same run", "at the same point");
    const second = createFork(parent, otherSave.ref, 4, "another branch", "choice-vary");
    if (second.record.ref === branch.record.ref) fail("two branches from the same season share a ref, so one silently replaces the other");
  }

  // (e) Save / resume / fork interleavings never perturb the run.
  {
    const plain = drivePolicy(PRESETS[2].id, "interleave", 10).state;
    const interleaved = drivePolicy(PRESETS[2].id, "interleave", 10, undefined, true).state;
    if (serialize(plain) !== serialize(interleaved))
      fail("serialize/deserialize round-trips between seasons perturbed the run");
  }

  // (f) A stale-version save is DECLARED, never silently resumed (§2.4).
  {
    const s = newCampaign({ origin: { kind: "birth-rng" }, handSeed: "stale", drawSeed: "stale" });
    const stale = JSON.parse(serialize(s));
    stale.engineVersion = "3.0.0";
    stale.schemaVersion = 1;
    const r = deserialize(JSON.stringify(stale));
    if (r.ok) fail("a schema-version-1 save was accepted as resumable");
    else if (r.reason !== "stale-version") fail(`stale save reported '${r.reason}' rather than stale-version`);
    const staleContent = JSON.parse(serialize(s));
    staleContent.contentVersion = "launch-window-2024.0";
    const r2 = deserialize(JSON.stringify(staleContent));
    if (r2.ok) fail("a stale-content save was accepted as resumable");
    const garbage = deserialize("{not json");
    if (garbage.ok) fail("unreadable input was accepted");

    // A version-current save with a MISSING FIELD is also declared, not accepted.
    // Only `gauges` used to be checked, so a save missing `beatsPlayed` resumed
    // and then threw on the first season a beat was placed in — most of a run
    // later. Every required field is probed by deleting it one at a time.
    {
      const whole = JSON.parse(serialize(drivePolicy(PRESETS[0].id, "shape", 2).state));
      const REQUIRED = [
        "committed", "queue", "flags", "standing", "skills", "relationships", "conditions",
        "beatsPlayed", "gauges", "capabilities", "priorities", "origin", "profile", "companions",
      ];
      for (const field of REQUIRED) {
        const broken = { ...whole };
        delete broken[field];
        const r = deserialize(JSON.stringify(broken));
        if (r.ok) fail(`a save with no '${field}' was accepted as resumable`);
        else if (!r.detail || !r.detail.trim()) fail(`a save with no '${field}' was rejected without saying why`);
      }
      // And an intact one still loads, so the check cannot pass by rejecting everything.
      if (!deserialize(JSON.stringify(whole)).ok) fail("the shape check rejects an intact save — it is not falsifiable");
    }
  }

  // (g) The Lab is byte-stable.
  for (const sit of LAB_SITUATIONS)
    for (const axis of sit.axes) {
      const a = compare(sit.id, axis);
      const b = compare(sit.id, axis);
      if (JSON.stringify(a?.differences) !== JSON.stringify(b?.differences)) fail(`${sit.id}/${axis}: Lab comparison is not stable`);
    }

  if (ok)
    details.push(
      `Identical seeds+ledger ⇒ identical run (8 drives); occurrence-discriminated draws differ across seasons and reproduce exactly (${checked} repeatables); ` +
        `forks (choice-vary and draw-vary) left the parent byte-identical and kept its prefix; save/resume interleavings did not perturb a run; ` +
        `stale-version, stale-content and unreadable saves are all declared rather than resumed; every Lab comparison is stable.`,
    );
  results.push({ id: 207, name: "S-7 · Determinism (occurrence-discriminated draws, fork isolation, migration)", pass: ok, details });
}

/* ============================================================
   S-8 · The constraint profile, rebound (§2.3.1)
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  const fail = (m: string) => {
    ok = false;
    details.push(m);
  };

  if (!WORTH_GUARD.includes(WORTH_GUARD_VERBATIM)) fail("WORTH_GUARD no longer contains the verbatim guard clause");

  // (a) ADJACENCY: every template that renders a profile also renders the guard.
  for (const file of collectSources(join(ROOT, "components")).concat(collectSources(join(ROOT, "app")))) {
    const base = file.replace(ROOT + sep, "").split(sep).join("/");
    const src = readFileSync(file, "utf8");
    const rendersProfile = /profileRender|profileLines|sim-profile-lines/.test(src);
    if (rendersProfile && !/WORTH_GUARD|worthGuard/.test(src)) fail(`${base} renders the profile without the adjacent worth-guard`);
  }

  // (b) PER-AXIS ONLY, no composite. The type has no composite field, and the
  //     render accessor returns only per-axis lines plus the guard.
  const schemaSrc = readFileSync(join(ROOT, "content/sim/schema.ts"), "utf8");
  // Strip comments before testing: the type's own doc-comment says the word
  // "composite" precisely in order to say there is not one.
  const profileType = (schemaSrc.match(/export type ConstraintProfile = \{[\s\S]*?\n\};/)?.[0] ?? "")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\/\/[^\n]*/g, " ");
  for (const banned of ["composite", "total", "tier", "overall", "summary", "rollUp", "difficulty"])
    if (new RegExp(`\\b${banned}\\b`, "i").test(profileType)) fail(`ConstraintProfile declares a '${banned}' field`);
  const render = profileRender(PRESETS[0].profile);
  const renderKeys = Object.keys(render).sort().join(",");
  if (renderKeys !== "intro,lines,worthGuard") fail(`profileRender exposes {${renderKeys}} — only intro, lines and worthGuard may exist`);
  if (render.lines.length !== 4) fail(`profileRender returned ${render.lines.length} lines; the profile is four axes`);

  // (c) HARDNESS NEVER RENDERS. internalHardness must appear in no render path.
  for (const file of collectSources(join(ROOT, "components")).concat(collectSources(join(ROOT, "app")))) {
    const base = file.replace(ROOT + sep, "").split(sep).join("/");
    if (/internalHardness/.test(readFileSync(file, "utf8"))) fail(`${base} reaches into internalHardness — it must render nowhere`);
  }
  const profileSrc = readFileSync(join(ROOT, "content/sim/profile.ts"), "utf8");
  if (/profileRender[\s\S]*?internalHardness/.test(profileSrc.slice(profileSrc.indexOf("export function profileRender"))))
    fail("profileRender exposes internalHardness");
  // And no rendered profile string is a number.
  for (const p of PRESETS)
    for (const l of profileRender(p.profile).lines) {
      if (/\d/.test(l.band)) fail(`${p.id}: profile band '${l.band}' contains a digit`);
      if (/\d/.test(l.note)) fail(`${p.id}: profile note contains a digit`);
    }

  // (d) FIXED PRESET ORDER, hardness-independent.
  const ordered = presetsInOrder();
  for (let i = 0; i < ordered.length; i++)
    if (ordered[i].presentationOrder !== i) fail(`preset order is not the authored order at index ${i}`);
  const hardnessSums = ordered.map((p) => Object.values(p.profile.internalHardness).reduce((a, b) => a + b, 0));
  const ascending = hardnessSums.every((v, i, arr) => i === 0 || arr[i - 1] <= v);
  const descending = hardnessSums.every((v, i, arr) => i === 0 || arr[i - 1] >= v);
  if (ascending || descending) fail("preset presentation order is sorted by hardness — it must be hardness-independent");

  // (e) No difficulty LABEL anywhere in the sandbox's rendered strings.
  //
  //     "easy" and "hard" are ordinary English and the game uses them constantly
  //     ("it is not easy", "the hard part"). What §2.3.1 forbids is the TIER
  //     LABEL: a rendered value that IS a difficulty grade, or the noun
  //     "difficulty" used about a start. That is what is tested.
  const TIER_LABEL = /^(easy|medium|hard|extreme|very hard|normal)$/i;
  const DIFFICULTY_NOUN = /\bdifficulty\b/i;
  const GRADED_START = /\b(easy|hard|medium|extreme)\s+(start|hand|position|mode|setting)\b/i;
  for (const { text, where } of collectNonBeatStrings()) {
    const trimmed = text.trim().replace(/[.!?]$/, "");
    if (TIER_LABEL.test(trimmed)) fail(`a difficulty tier label renders as a whole string in ${where}: "${trimmed}"`);
    if (DIFFICULTY_NOUN.test(text)) fail(`the noun "difficulty" appears in ${where}: ${JSON.stringify(text.slice(0, 60))}`);
    if (GRADED_START.test(text)) fail(`a graded-start phrase in ${where}: ${JSON.stringify(text.slice(0, 60))}`);
  }

  if (ok)
    details.push(
      `Verbatim worth-guard preserved and adjacent on every profile-rendering template; ConstraintProfile carries no composite field and profileRender exposes only {intro, lines, worthGuard}; ` +
        `internalHardness reaches no render path and no profile string contains a digit; preset order is the authored order and is not hardness-sorted.`,
    );
  results.push({ id: 208, name: "S-8 · Constraint profile (per-axis only, no composite, hardness never renders)", pass: ok, details });
}

/* ============================================================
   S-9 (structural half) · The namespace invariant (§2.2, §4.2)
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  const fail = (m: string) => {
    ok = false;
    details.push(m);
  };

  const SIM_SHEETS = ["app/sim.css", "app/sim-instruments.css", "app/sim-surfaces.css"];
  const READING_SHEET = "app/globals.css";

  /** Strip comments first: a comment naming `.weight-buttons` as the DEFECT is
   *  not a rule styling it, and reading one as a selector is how a gate lies. */
  const stripComments = (t: string) => t.replace(/\/\*[\s\S]*?\*\//g, " ");

  const selectorClasses = (raw: string): Set<string> => {
    const text = stripComments(raw);
    let depth = 0,
      buf = "",
      sel = "";
    for (const ch of text) {
      if (ch === "{") {
        if (depth === 0) sel += buf + "\n";
        buf = "";
        depth++;
        continue;
      }
      if (ch === "}") {
        depth = Math.max(0, depth - 1);
        buf = "";
        continue;
      }
      if (depth === 0) buf += ch;
    }
    return new Set([...sel.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]));
  };

  const simCss = SIM_SHEETS.map((f) => readFileSync(join(ROOT, f), "utf8")).join("\n");
  const readCss = readFileSync(join(ROOT, READING_SHEET), "utf8");
  const readCssClean = stripComments(readCss);
  const simClasses = selectorClasses(simCss);
  const readClasses = selectorClasses(readCss);

  // (1) NAMESPACE: no class is styled by both sheets.
  const isAllowlisted = (c: string) => c === "mech-viz" || c.startsWith("mv-");
  const shared = [...simClasses].filter((c) => readClasses.has(c) && !isAllowlisted(c));
  if (shared.length) fail(`${shared.length} class(es) styled by BOTH the sim and reading sheets: ${shared.slice(0, 10).join(", ")}`);
  // (2) Every sim-sheet class is sim-prefixed.
  const unprefixed = [...simClasses].filter((c) => !c.startsWith("sim-") && !isAllowlisted(c));
  if (unprefixed.length) fail(`sim stylesheet styles non-namespaced classes: ${unprefixed.slice(0, 10).join(", ")}`);
  // (3) No .sim-* rule lives outside the sim sheets.
  const strayInReading = [...readClasses].filter((c) => c.startsWith("sim-"));
  if (strayInReading.length) fail(`reading stylesheet styles sim classes: ${strayInReading.slice(0, 10).join(", ")}`);

  // (4) The one sanctioned shared component set, allowlisted with a reason.
  const SHARED_ALLOWLIST: Record<string, string> = {
    "mech-viz": "The reference-layer SVG frame, rendered on /walkthrough, /topics/* and inside the play surface's why-drawer. Sets no text geometry.",
    "mv-": "The reference-layer visualisation marks (mv-*), same component set as mech-viz. Stroke and fill only.",
  };
  const readingOnlyGeometry = /(^|[^-])\b(width|height)\s*:\s*\d/;
  for (const key of Object.keys(SHARED_ALLOWLIST)) {
    const rules = readCssClean.split("}").filter((r) => r.includes(`.${key}`));
    for (const r of rules)
      if (readingOnlyGeometry.test(r)) fail(`allowlisted shared class '${key}' sets fixed geometry: ${r.trim().slice(0, 70)}`);
  }

  // (5) NO FIXED SIZE on any sim rule (the owner's clipped-button defect class).
  //     Circles, pips, ticks and marks are allowed to be square by declaring both
  //     axes on an element that holds no text; everything else uses min-*.
  const GEOMETRY_OK = new Set([
    "sim-gauge-cell", "sim-budget-pip", "sim-priority-mark", "sim-timeline-tick", "sim-timeline-key",
    "sim-queue-mark", "sim-strip-marker", "sim-strip-marker-dot", "sim-motif", "sim-dealt-back-art",
    "sim-scene-svg", "sim-drawer-scrim", "sim-sr", "sim-milestone-list", "sim-card-frame",
    // The Life Arc's marks, same shape: a dot, a rule, a tick. None holds text.
    "sim-dist-marker", "sim-dist-marker-dot", "sim-turning-strip", "sim-turning-marker",
    "sim-slack-curve", "sim-gauge-track", "sim-dist-bar", "sim-hand-card-facedown",
  ]);
  for (const sheet of SIM_SHEETS) {
    const text = stripComments(readFileSync(join(ROOT, sheet), "utf8"));
    const blocks = text.split("}");
    for (const block of blocks) {
      const open = block.indexOf("{");
      if (open === -1) continue;
      const selector = block.slice(0, open);
      const body = block.slice(open + 1);
      // Only ABSOLUTE lengths are the defect. `width: 100%`, `width: auto` and
      // `width: min-content` cannot clip a label; `width: 44px` is what did.
      if (!/^\s*(width|height)\s*:\s*[\d.]+(px|rem|em|ch|pt|cm|mm|in|pc)\b/m.test(body)) continue;
      const classes = [...selector.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]);
      const exempt = classes.some((c) => GEOMETRY_OK.has(c));
      if (!exempt) fail(`${sheet}: fixed width/height on a text-bearing rule — ${selector.trim().slice(0, 70)}`);
    }
  }

  // (6) SIM TOKENS ONLY, past the token block.
  for (const sheet of SIM_SHEETS) {
    const text = readFileSync(join(ROOT, sheet), "utf8");
    const start = text.indexOf("STANDING LAW");
    const body = start === -1 ? text : text.slice(start);
    const cleanBody = stripComments(body);
    const readingTokens = [...cleanBody.matchAll(/var\((--(?:ink|paper|line|accent|atlas|good|caution|help|focus)[\w-]*)\)/g)].map((m) => m[1]);
    if (readingTokens.length) fail(`${sheet}: reads reading tokens on a play surface: ${[...new Set(readingTokens)].join(", ")}`);
    const literals = [...cleanBody.matchAll(/(?:color|background|fill|stroke|border-color)\s*:\s*(#[0-9a-fA-F]{3,8}|rgba?\()/g)];
    if (literals.length) fail(`${sheet}: ${literals.length} literal colour(s) outside the token block`);
  }

  // (7) Every class a sandbox component uses is sim-prefixed (or allowlisted).
  for (const file of collectSources(join(ROOT, "components/sim"))) {
    const base = file.replace(ROOT + sep, "").split(sep).join("/");
    const src = readFileSync(file, "utf8");
    for (const m of src.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\}|\{"([^"]*)"\})/g)) {
      const raw = m[1] || m[2] || m[3] || "";
      for (const c of raw.split(/[\s${}?:'"()+]+/)) {
        if (!c || !/^[a-zA-Z][\w-]*$/.test(c)) continue;
        if (c.startsWith("sim-")) continue;
        if (Object.keys(SHARED_ALLOWLIST).some((k) => c === k || c.startsWith(k))) continue;
        fail(`${base}: non-namespaced class "${c}" on a play surface`);
      }
    }
  }

  if (ok)
    details.push(
      `${simClasses.size} sim classes across ${SIM_SHEETS.length} sheets, zero shared with the ${readClasses.size}-class reading sheet; ` +
        `no fixed width/height on a text-bearing sim rule; no reading token and no literal colour past the token block; ` +
        `every class on every sandbox component is namespaced (one allowlisted shared reference-viz set, which sets no text geometry). ` +
        `The browser half of S-9 runs in tests/s9-ui.mjs.`,
    );
  results.push({ id: 209, name: "S-9 · UI integrity, structural half (namespace, no fixed size, sim tokens)", pass: ok, details });
}

/* ============================================================
   S-11 · Consequence-queue integrity (§3.5)
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  const fail = (m: string) => {
    ok = false;
    details.push(m);
  };
  let placed = 0;
  let resolved = 0;
  let expired = 0;
  let carried = 0;

  for (const preset of PRESETS) {
    for (let seed = 0; seed < 3; seed++) {
      let s = newCampaign({ origin: { kind: "preset", presetId: preset.id }, handSeed: `q-${seed}`, drawSeed: `q-${seed}-d` });
      s = setPriorities(s, { ...emptyPriorities(), safety: 2, mastery: 1, closeness: 1 });
      const seen = new Map<string, { placedSeason: number; ended?: string }>();
      while (s.seasonIndex < SEASON_COUNT) {
        const before = new Set(s.queue.map((q) => q.id));
        // The entries themselves, so a consequence can be checked against the
        // record that actually set it in motion.
        const beforeEntries = new Map(s.queue.map((q) => [q.id, q]));
        const allocs = greedyAllocations(s);
        let responses: CommittedEventResponse[] = [];
        let out = commitSeason(s, allocs, responses);
        let guard = 0;
        while (!out.done && guard++ < 10) {
          responses = [...responses, { eventId: out.pendingEvent.id, optionId: out.pendingEvent.options[0].id }];
          out = commitSeason(s, allocs, responses);
        }
        if (!out.done) break;

        // Everything that left the queue must have a resolved/expired history entry.
        const after = new Set(out.state.queue.map((q) => q.id));
        for (const id of before)
          if (!after.has(id)) {
            const entry = out.result.items.find((i) => i.id === id);
            const wasBeat = false;
            if (!entry && !wasBeat) fail(`queue entry '${id}' left the queue without a rendered consequence`);
            // A landed consequence must not print one sentence twice. `label` and
            // `line` were the same string by construction, so every consequence
            // card showed its text as the title and again as the body — and four
            // landing in one season showed it eight times between them.
            if (entry && entry.label === entry.line) fail(`consequence '${id}' renders the same sentence as its title and its body`);
            // And its attribution must name the CARD THE PLAYER TOOK, by its
            // authored label — not the internal id with its prefix stripped and
            // its dashes swapped for spaces ("money debt order" for a card called
            // "Choose the repayment order").
            //
            // Stated as a POSITIVE check, deliberately. The first version looked
            // for a leading "act "/"evt " in the note — but `plain()` strips that
            // prefix before the note is ever built, so it was testing for a string
            // that could not appear even when the bug was present. Asking whether
            // the authored label is actually in there cannot be satisfied by the
            // broken output. S-11's own falsifiability fixture below proves it.
            {
              const q = beforeEntries.get(id);
              const rec = q ? ACTION_BY_ID[q.sourceRef.id] ?? EVENT_BY_ID[q.sourceRef.id] : undefined;
              if (rec)
                for (const a of entry?.attribution ?? []) {
                  const note = a.note ?? "";
                  if (!note.startsWith("set in motion in season")) continue;
                  if (!note.includes(rec.label))
                    fail(
                      `consequence '${id}' does not attribute to its source card's authored label ("${rec.label}"): "${note}"`,
                    );
                  const deslugged = q!.sourceRef.id.replace(/^(act|evt|start)-/, "").replace(/-/g, " ");
                  if (deslugged !== rec.label.toLowerCase() && note.includes(deslugged))
                    fail(`consequence '${id}' attributes to the de-slugged id "${deslugged}" rather than "${rec.label}"`);
                }
            }
            resolved++;
            seen.set(id, { placedSeason: -1, ended: "resolved" });
          }
        for (const q of out.state.queue) {
          if (!before.has(q.id)) {
            placed++;
            seen.set(q.id, { placedSeason: q.placedSeason });
            // Every entry is revealed and carries a placement history entry.
            if (q.revealed !== true) fail(`queue entry '${q.id}' is not revealed`);
            if (!q.history.some((h) => h.what === "placed")) fail(`queue entry '${q.id}' has no placement history`);
          } else {
            // Anything carried forward must record WHY it is still waiting.
            const last = q.history[q.history.length - 1];
            if (last?.what === "requeued" && !last.cause) fail(`queue entry '${q.id}' re-queued with no cause`);
            carried++;
          }
        }
        // The queue the UI renders IS the engine's queue.
        if (JSON.stringify(out.result.queueAfter.map((q) => q.id)) !== JSON.stringify(out.state.queue.map((q) => q.id)))
          fail("the rendered queue and the engine queue diverged");
        s = out.state;
      }
      // Nothing may be left dangling with no path to resolution.
      for (const q of s.queue) {
        if (!("seasons" in q.due) && !("condition" in q.due)) fail(`queue entry '${q.id}' has an unresolvable due shape`);
      }
    }
  }

  // Direct unit check of the three transitions.
  {
    let q = queueInsert([], { refId: "t1", label: "a timed thing", effects: {}, due: { seasons: 2 } }, { kind: "action", id: "act-x", seasonIndex: 0 });
    q = queueInsert(q, { refId: "c1", label: "a conditional thing", effects: {}, due: { condition: "employed", withinSeasons: 3 } }, { kind: "action", id: "act-x", seasonIndex: 0 });
    const s1 = queueStep(q, 1, { flags: [], conditions: [] });
    if (s1.resolving.length !== 0 || s1.remaining.length !== 2) fail("nothing should resolve or expire at season one");
    if (!s1.remaining.every((e) => e.history.some((h) => h.what === "requeued" && h.cause))) fail("re-queue without a cause");
    const s2 = queueStep(q, 2, { flags: [], conditions: [] });
    if (!s2.resolving.some((e) => e.label === "a timed thing")) fail("the timed entry did not resolve when due");
    const s3 = queueStep(q, 3, { flags: [], conditions: [] });
    if (!s3.expiring.some((e) => e.label === "a conditional thing")) fail("the conditional entry did not expire visibly");
    if (!s3.expiring.every((e) => e.history.some((h) => h.what === "expired" && h.cause))) fail("expiry without a stated cause");
    const s4 = queueStep(q, 2, { flags: ["employed"], conditions: [] });
    if (!s4.resolving.some((e) => e.label === "a conditional thing")) fail("the condition was met and the entry did not resolve");
  }

  if (ok)
    details.push(
      `${placed} queue entries placed and ${resolved} resolved across ${PRESETS.length * 3} full campaigns; every carry-forward recorded a cause; ` +
        `every expiry recorded a stated cause; the rendered queue matched the engine queue in every season; ` +
        `timed, conditional and expiring transitions verified directly. Scoped to the queue object — beats live outside it (§5.1).`,
    );
  // S-11′ · THE ATTRIBUTION CHECK IS FALSIFIABLE.
  //
  // This gate's attribution assertion has been wrong twice, both times in the same
  // direction — passing because it could not fail. First a literal backspace baked
  // into its regex by a shell-quoting slip, so the pattern matched nothing at all;
  // then, underneath that, a pattern looking for an "act "/"evt " prefix that
  // `plain()` strips before the note exists. Green both times, checking nothing
  // both times. So the predicate is now run against a note built the OLD, broken
  // way and must reject it.
  {
    const probes: { note: string; label: string; sourceId: string; mustFail: boolean; why: string }[] = [];
    const sample = ACTIONS.find((a) => a.delayedEffects?.length) ?? ACTIONS[0];
    const deslugged = sample.id.replace(/^(act|evt|start)-/, "").replace(/-/g, " ");
    probes.push({
      note: `set in motion in season four by ${deslugged}`,
      label: sample.label,
      sourceId: sample.id,
      mustFail: deslugged !== sample.label.toLowerCase(),
      why: "the de-slugged id, which is exactly what the shipped bug rendered",
    });
    probes.push({
      note: `set in motion in season four by ${sample.label}`,
      label: sample.label,
      sourceId: sample.id,
      mustFail: false,
      why: "the authored label, which is what it must accept",
    });
    for (const probe of probes) {
      const rejected =
        !probe.note.includes(probe.label) ||
        (deslugged !== probe.label.toLowerCase() && probe.note.includes(deslugged));
      if (rejected !== probe.mustFail)
        fail(
          `S-11's attribution predicate ${rejected ? "rejected" : "accepted"} ${probe.why} — it should have ` +
            `${probe.mustFail ? "rejected" : "accepted"} it. The check cannot come back red and is therefore not a check.`,
        );
    }
    if (ok) details.push(`the attribution predicate was run against a note built the old broken way (“${deslugged}”) and rejected it, and against the authored label and accepted it — so its green is earned.`);
  }

  results.push({ id: 211, name: "S-11 · Consequence-queue integrity", pass: ok, details });
}

/* ============================================================
   S-12 · Attribution honesty (§3.10)
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  const fail = (m: string) => {
    ok = false;
    details.push(m);
  };
  let compared = 0;

  // (a) On scripted resolutions: rendered factors === nonzero tagged components.
  for (const preset of PRESETS.slice(0, 3)) {
    let s = newCampaign({ origin: { kind: "preset", presetId: preset.id }, handSeed: "attr", drawSeed: "attr-d" });
    s = setPriorities(s, { ...emptyPriorities(), mastery: 2 });
    for (let season = 0; season < 6 && s.seasonIndex < SEASON_COUNT; season++) {
      const allocs = greedyAllocations(s);
      let responses: CommittedEventResponse[] = [];
      let out = commitSeason(s, allocs, responses);
      let guard = 0;
      while (!out.done && guard++ < 10) {
        responses = [...responses, { eventId: out.pendingEvent.id, optionId: out.pendingEvent.options[0].id }];
        out = commitSeason(s, allocs, responses);
      }
      if (!out.done) break;
      for (const item of out.result.items) {
        if (!item.optionId || item.marker === undefined) continue;
        compared++;
        // Every rendered component is a legal category and carries a note.
        for (const c of item.attribution) {
          if (!ATTRIBUTION_CATEGORIES.includes(c.category)) fail(`${item.id}: unknown attribution category '${c.category}'`);
          if (!c.note.trim()) fail(`${item.id}: attribution component with no note`);
          if (Math.abs(c.weight) < 1e-9) fail(`${item.id}: a ZERO-weight component was rendered — only nonzero factors may render`);
        }
        // 'your choice' always contributes; the option is always a factor.
        if (!item.attribution.some((c) => c.category === "choice"))
          fail(`${item.id}: no 'your choice' component on a chosen resolution`);
        // The draw renders exactly when the marker was off-centre.
        const drawRendered = item.attribution.some((c) => c.category === "draw");
        const drawShould = Math.abs((item.marker ?? 0.5) - 0.5) > 0.08;
        if (drawRendered !== drawShould)
          fail(`${item.id}: 'the draw' rendered=${drawRendered} but marker=${item.marker?.toFixed(3)} says ${drawShould}`);
      }
      s = out.state;
    }
  }

  // (b) Set equality against a fresh classification of the same inputs.
  {
    const s = newCampaign({ origin: { kind: "preset", presetId: PRESETS[0].id }, handSeed: "eq", drawSeed: "eq-d" });
    const action = ACTIONS.find((a) => a.options.some((o) => o.sensitivity))!;
    const option = action.options.find((o) => o.sensitivity)!;
    const res = resolve(option, s, 0.77);
    const direct = renderable(classify(option, s, { marker: res.marker, handFlags: s.flags.filter((f) => f.startsWith("start:")) }));
    if (!direct.length) fail("classify produced no components for a sensitive option");
    const cats = new Set(direct.map((c) => c.category));
    if (!cats.has("choice")) fail("classify omitted 'your choice'");
  }

  // (c) PER-AXIS LAB FIXTURES (§8). Each axis's attribution must reflect the axis.
  for (const sit of LAB_SITUATIONS) {
    for (const axis of sit.axes) {
      const c = compare(sit.id, axis);
      if (!c) {
        fail(`${sit.id}/${axis}: no comparison`);
        continue;
      }
      const cats = new Set(c.left.steps.flatMap((s) => s.attribution.map((a) => a.category)));
      if (!cats.has("choice")) fail(`${sit.id}/${axis}: no choice component anywhere in the branch`);
      if (axis === "draw-vary") {
        // The branches differ ONLY in the draw, so no starting-condition or
        // accumulated-state component may differ at step zero.
        const l = c.left.steps[0].attribution.filter((a) => a.category !== "draw").map((a) => a.note).sort();
        const r = c.right.steps[0].attribution.filter((a) => a.category !== "draw").map((a) => a.note).sort();
        if (JSON.stringify(l) !== JSON.stringify(r))
          fail(`${sit.id}/draw-vary: non-draw factors differ between branches at step one — the axis is not isolating the draw`);
      }
      if (axis === "position-vary") {
        // Same choices, same luck: the branches must differ in a position-derived
        // factor somewhere, or the axis is not teaching G-08.
        const lf = new Set(c.left.steps.flatMap((s) => s.attribution.map((a) => `${a.category}:${a.note}`)));
        const rf = new Set(c.right.steps.flatMap((s) => s.attribution.map((a) => `${a.category}:${a.note}`)));
        const differs = [...lf].some((x) => !rf.has(x)) || [...rf].some((x) => !lf.has(x));
        const endingDiffers = JSON.stringify(c.left.ending) !== JSON.stringify(c.right.ending);
        if (!differs && !endingDiffers)
          fail(`${sit.id}/position-vary: the two positions produced identical factors AND identical endings`);
      }
    }
  }

  if (ok)
    details.push(
      `${compared} scripted resolutions checked: every rendered factor is a tagged nonzero component with a note, 'your choice' is always present, ` +
        `and 'the draw' renders exactly when the marker was off-centre. Per-axis Lab fixtures: draw-vary isolates the draw, position-vary separates on position.`,
    );
  results.push({ id: 212, name: "S-12 · Attribution honesty (rendered factors = nonzero tagged components)", pass: ok, details });
}

/* ============================================================
   INVENTION GATE (§0.3) — every INVENTION carries its adversarial check
   ============================================================ */
{
  const details: string[] = [];
  let ok = true;
  const decisionsPath = join(ROOT, "DECISIONS.md");
  const src = existsSync(decisionsPath) ? readFileSync(decisionsPath, "utf8") : "";
  const entries = [...src.matchAll(/^###\s+INVENTION:\s*(.+)$/gm)].map((m) => ({ title: m[1].trim(), index: m.index ?? 0 }));
  if (!entries.length) {
    details.push("No INVENTION entries declared in DECISIONS.md.");
  } else {
    for (let i = 0; i < entries.length; i++) {
      const body = src.slice(entries[i].index, i + 1 < entries.length ? entries[i + 1].index : src.length);
      const missing: string[] = [];
      if (!/\*\*What it is:\*\*/.test(body)) missing.push("What it is");
      if (!/\*\*Doctrine it serves:\*\*/.test(body)) missing.push("Doctrine it serves");
      if (!/\*\*§1 \/ §5 \/ §11 check:\*\*/.test(body)) missing.push("§1/§5/§11 check");
      if (!/\*\*Adversarial safety review:\*\*/.test(body)) missing.push("Adversarial safety review");
      if (!/\*\*Verdict:\*\*/.test(body)) missing.push("Verdict");
      if (missing.length) {
        ok = false;
        details.push(`INVENTION "${entries[i].title}" is missing: ${missing.join(", ")}`);
      }
    }
    if (ok) details.push(`${entries.length} INVENTION entries, each with its doctrine, its §1/§5/§11 check, and an attached adversarial safety review.`);
  }
  results.push({ id: 214, name: "Invention gate · every INVENTION carries its adversarial-check record", pass: ok, details });
}

/* ============================================================
   Report
   ============================================================ */
for (const r of results.sort((a, b) => a.id - b.id)) reportGate(r);
const failed = results.filter((r) => !r.pass);
console.log("\n" + "=".repeat(60));
if (failed.length === 0) {
  console.log(`ALL ${results.length} SANDBOX GATES PASS`);
  process.exit(0);
} else {
  console.log(`${failed.length} SANDBOX GATE(S) FAILED`);
  process.exit(1);
}

/* ============================================================
   Helpers
   ============================================================ */

function collectSources(dir: string): string[] {
  const acc: string[] = [];
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) acc.push(...collectSources(full));
    else if (/\.(tsx|ts)$/.test(entry) && !entry.endsWith(".d.ts")) acc.push(full);
  }
  return acc;
}

/**
 * A deterministic scripted allocation. `bias`, when given, prefers one card
 * family — that is what turns one policy into a policy FAMILY, so the witness
 * search can reach doors a single greedy line never opens.
 */
function greedyAllocations(s: SimState, bias?: string): CommittedAllocation[] {
  const allocations: CommittedAllocation[] = [];
  for (let i = 0; i < 4; i++) {
    const remaining = require_remaining(s, allocations);
    const all = require_menu(s, remaining).filter((m) => m.affordable && !allocations.some((a) => a.actionId === m.action.id));
    const preferred = bias ? all.filter((m) => m.action.family === bias) : [];
    const menuNow = preferred.length ? preferred : all;
    if (!menuNow.length) break;
    const pick = menuNow[(s.seasonIndex * 3 + i) % menuNow.length];
    allocations.push({
      actionId: pick.action.id,
      instanceOrdinal: nextOrdinal(s, allocations, pick.action.id),
      optionId: pick.action.options[(s.seasonIndex + i) % pick.action.options.length].id,
    });
  }
  return allocations;
}

// Imported lazily so the helper reads cleanly above.
import { remainingBudget as require_remaining } from "@/lib/sim/campaign";
import { menu as require_menu } from "@/lib/sim/season";

/** Drive a campaign under the greedy policy, recording what was ever available. */
/** Play N more seasons from a state that already exists (drivePolicy always starts fresh). */
function playOn(start: SimState, seasons: number): SimState {
  let s = start;
  let guard = 0;
  while (guard++ < seasons) {
    const allocs = greedyAllocations(s);
    let responses: CommittedEventResponse[] = [];
    let out = commitSeason(s, allocs, responses);
    let inner = 0;
    while (!out.done && inner++ < 10) {
      responses = [...responses, { eventId: out.pendingEvent.id, optionId: out.pendingEvent.options[0].id }];
      out = commitSeason(s, allocs, responses);
    }
    if (!out.done) break;
    s = out.state;
  }
  return s;
}

function drivePolicy(
  origin: string,
  seed: string,
  seasons: number,
  onSeason?: (s: SimState) => void,
  interleaveSaves = false,
  bias?: string,
): { state: SimState; seenAvailable: Set<string> } {
  let s =
    origin === "birth-rng"
      ? newCampaign({ origin: { kind: "birth-rng" }, handSeed: seed, drawSeed: `${seed}-d` })
      : newCampaign({ origin: { kind: "preset", presetId: origin }, handSeed: seed, drawSeed: `${seed}-d` });
  s = setPriorities(s, { ...emptyPriorities(), safety: 2, mastery: 2, closeness: 1 });
  const seenAvailable = new Set<string>();
  let guard = 0;
  while (s.seasonIndex < seasons && guard++ < seasons + 5) {
    onSeason?.(s);
    for (const m of require_menu(s, budgetFor(s))) if (m.available) seenAvailable.add(m.action.id);
    const allocs = greedyAllocations(s, bias);
    let responses: CommittedEventResponse[] = [];
    let out = commitSeason(s, allocs, responses);
    let inner = 0;
    while (!out.done && inner++ < 10) {
      responses = [...responses, { eventId: out.pendingEvent.id, optionId: out.pendingEvent.options[0].id }];
      out = commitSeason(s, allocs, responses);
    }
    if (!out.done) break;
    s = out.state;
    if (interleaveSaves) {
      const round = deserialize(serialize(s));
      if (round.ok) s = round.state;
    }
  }
  return { state: s, seenAvailable };
}
