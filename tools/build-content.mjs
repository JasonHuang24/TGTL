/**
 * Content batch compiler (blueprint 4.0 §9.5).
 *
 * Turns the authored JSON batches — each one written by a schema-constrained
 * author, checked by an adversarial safety verifier, repaired, and read in the
 * rolling human review — into typed TypeScript modules under
 * `content/sim/campaign/{actions,events}/`.
 *
 * It is a COMPILER, not a filter: it validates hard and refuses to emit a batch
 * that breaks the schema, so a malformed record cannot reach the pool by being
 * quietly dropped. Anything it rejects comes back as an error naming the record.
 *
 * Usage: node tools/build-content.mjs <batch-dir>
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = process.argv[2];
if (!SRC) {
  console.error("usage: node tools/build-content.mjs <batch-dir>");
  process.exit(1);
}

const FAMILIES = ["home", "school", "threshold", "work", "money", "people", "health", "civic", "inner"];
const GAUGES = ["money", "healthEnergy", "connection", "timeStructure"];
const CAPS = ["vitality", "learning", "execution", "regulation", "socialNavigation", "adaptability"];
const CURRENCIES = ["timeStructure", "energy", "money"];
const VARIANCE = ["narrow", "moderate", "wide", "very wide"];
const REVERSIBILITY = ["reversible", "costly to undo", "locks in"];
const BANDS = ["strong", "solid", "mixed", "poor", "failure"];
const EVIDENCE = ["evidence-informed", "illustrative", "speculative", "contested", "insufficient-evidence"];
// The live 3.0/4.0 route inventory is content/routes.ts (route-inventory.json is
// the legacy 2.0 list). Read the paths straight out of the source of truth, plus
// the routes 4.0 adds, so a readRef can only point at a page that exists.
const ROUTES = new Set([
  ...[...readFileSync(join(ROOT, "content/routes.ts"), "utf8").matchAll(/path:\s*"([^"]+)"/g)].map((m) => m[1]),
  "/play/campaign",
  "/play/lab",
  "/play/arc",
]);

const errors = [];
const warn = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

/* ---- validation + normalisation ---- */

function normEffects(e, where) {
  if (!e || typeof e !== "object") return {};
  const out = {};
  if (e.gauge) {
    out.gauge = {};
    for (const [k, v] of Object.entries(e.gauge)) {
      if (!GAUGES.includes(k)) fail(where, `unknown gauge "${k}"`);
      else out.gauge[k] = clampInt(v, -3, 3);
    }
  }
  if (e.capability) {
    out.capability = {};
    for (const [k, v] of Object.entries(e.capability)) {
      if (!CAPS.includes(k)) fail(where, `unknown capability "${k}"`);
      else out.capability[k] = clampInt(v, -4, 4);
    }
  }
  for (const key of ["skills", "conditionsSet", "conditionsClear", "flagsSet", "flagsClear"])
    if (Array.isArray(e[key]) && e[key].length) out[key] = e[key].map(String);
  if (Array.isArray(e.relationships) && e.relationships.length)
    out.relationships = e.relationships.map((r) => ({
      id: String(r.id),
      ...(r.label ? { label: String(r.label) } : {}),
      quality: clampInt(r.quality ?? 0, -3, 3),
    }));
  if (Array.isArray(e.companions) && e.companions.length)
    out.companions = e.companions.map((c) => ({
      arcId: String(c.arcId),
      ...(c.stageDelta !== undefined ? { stageDelta: clampInt(c.stageDelta, -3, 3) } : {}),
      ...(c.neglect !== undefined ? { neglect: clampInt(c.neglect, -3, 3) } : {}),
      ...(c.repair !== undefined ? { repair: clampInt(c.repair, -3, 3) } : {}),
      ...(c.exit ? { exit: true } : {}),
    }));
  if (Array.isArray(e.queue) && e.queue.length)
    out.queue = e.queue.map((q) => ({
      refId: String(q.refId),
      label: String(q.label),
      effects: normEffects(q.effects, where + ".queue"),
      due: q.dueSeasons !== undefined ? { seasons: clampInt(q.dueSeasons, 1, 12) } : q.due,
    }));
  if (typeof e.maintenanceDebt === "number") out.maintenanceDebt = clampInt(e.maintenanceDebt, -4, 4);
  return out;
}

function clampInt(v, lo, hi) {
  const n = Math.round(Number(v) || 0);
  return Math.max(lo, Math.min(hi, n));
}

function normOption(o, where) {
  // Authors write either the flat brief shape (costs/variance/reversibility and
  // band.line/band.effects at the top level) or the final nested shape (chips{}
  // and outcome{}). Both express exactly the same content, so the compiler reads
  // either rather than rejecting a good batch over a shape preference.
  const chips = o.chips ?? {};
  o = {
    ...o,
    costs: o.costs ?? chips.costs,
    variance: o.variance ?? chips.variance,
    reversibility: o.reversibility ?? chips.reversibility,
    positionNotes: o.positionNotes ?? chips.positionNotes,
    bands: (Array.isArray(o.bands) ? o.bands : []).map((b) =>
      b && b.outcome ? { ...b, line: b.line ?? b.outcome.line, effects: b.effects ?? b.outcome.effects } : b,
    ),
  };
  if (!o.id || !o.label) fail(where, "option needs id and label");
  if (!VARIANCE.includes(o.variance)) fail(where, `bad variance "${o.variance}"`);
  if (!REVERSIBILITY.includes(o.reversibility)) fail(where, `bad reversibility "${o.reversibility}"`);
  const bands = Array.isArray(o.bands) ? o.bands : [];
  if (bands.length < 2 || bands.length > 3) fail(where, `options declare 2-3 bands; saw ${bands.length}`);
  if (bands.filter((b) => b.failure).length > 1) fail(where, "at most one failure band");
  const flags = Array.isArray(o.flags) ? o.flags.filter((f) => ["recovery", "endurance", "floor"].includes(f)) : [];
  if (flags.includes("endurance") && !o.supportLink) fail(where, "endurance option must name a supportLink");
  if (o.supportLink && !ROUTES.has(o.supportLink)) fail(where, `supportLink "${o.supportLink}" does not resolve`);

  const sens = o.sensitivity && typeof o.sensitivity === "object" ? o.sensitivity : undefined;
  if (sens) {
    if (sens.gauge && !GAUGES.includes(sens.gauge)) fail(where, `sensitivity gauge "${sens.gauge}"`);
    if (sens.capability && !CAPS.includes(sens.capability)) fail(where, `sensitivity capability "${sens.capability}"`);
  }

  return {
    id: String(o.id),
    label: String(o.label),
    chips: {
      costs: (Array.isArray(o.costs) ? o.costs : []).map(String),
      variance: o.variance,
      reversibility: o.reversibility,
      ...(Array.isArray(o.positionNotes) && o.positionNotes.length
        ? { positionNotes: o.positionNotes.map((p) => ({ when: String(p.when), text: String(p.text) })) }
        : {}),
    },
    ...(flags.length ? { flags } : {}),
    ...(o.supportLink ? { supportLink: String(o.supportLink) } : {}),
    ...(sens ? { sensitivity: sens } : {}),
    bands: bands.map((b, i) => {
      if (!BANDS.includes(b.name)) fail(`${where}/band[${i}]`, `bad band name "${b.name}"`);
      if (!(Number(b.weight) > 0)) fail(`${where}/band[${i}]`, "weight must be > 0");
      if (!b.line || !String(b.line).trim()) fail(`${where}/band[${i}]`, "missing line");
      return {
        name: b.name,
        weight: Number(b.weight),
        ...(b.failure ? { failure: true } : {}),
        outcome: { line: String(b.line), effects: normEffects(b.effects, `${where}/band[${i}]`) },
      };
    }),
  };
}

function normSeasonBands(sb, where) {
  const bands = Array.isArray(sb) ? sb : [[1, 24]];
  for (const [lo, hi] of bands)
    if (!(lo >= 1 && hi <= 24 && lo <= hi)) fail(where, `seasonBands [${lo},${hi}] outside 1-24`);
  return bands.map(([lo, hi]) => [clampInt(lo, 1, 24), clampInt(hi, 1, 24)]);
}

function normDelayed(list, where) {
  if (!Array.isArray(list) || !list.length) return undefined;
  return list.map((d, i) => ({
    id: String(d.id ?? `de-${i}`),
    label: String(d.label ?? ""),
    effects: normEffects(d.effects, `${where}/delayed[${i}]`),
    due:
      d.dueSeasons !== undefined
        ? { seasons: clampInt(d.dueSeasons, 1, 12) }
        : d.condition
          ? { condition: String(d.condition), withinSeasons: clampInt(d.withinSeasons ?? 6, 1, 12) }
          : { seasons: 2 },
    ...(Array.isArray(d.onBands) && d.onBands.length ? { onBands: d.onBands.filter((b) => BANDS.includes(b)) } : {}),
  }));
}

function normAction(a) {
  // Same two-shape tolerance as options: an author may nest the contract.
  const c = a.contract ?? {};
  a = {
    ...a,
    costs: a.costs ?? c.costs,
    prerequisites: a.prerequisites ?? c.prerequisites,
    reversibility: a.reversibility ?? c.reversibility,
    switchingCost: a.switchingCost ?? c.switchingCost,
    variance: a.variance ?? c.variance,
    opportunityNote: a.opportunityNote ?? c.opportunityNote,
    evidenceLabel: a.evidenceLabel ?? c.evidenceLabel,
  };
  const where = a.id ?? "(no id)";
  if (!FAMILIES.includes(a.family)) fail(where, `bad family "${a.family}"`);
  if (!EVIDENCE.includes(a.evidenceLabel)) fail(where, `bad evidenceLabel "${a.evidenceLabel}"`);
  if (!ROUTES.has(a.readRef)) fail(where, `readRef "${a.readRef}" does not resolve`);
  const options = Array.isArray(a.options) ? a.options : [];
  if (options.length < 2 || options.length > 4) fail(where, `2-4 options required; saw ${options.length}`);
  const costs = {};
  for (const [k, v] of Object.entries(a.costs ?? {})) {
    if (!CURRENCIES.includes(k)) fail(where, `unknown currency "${k}"`);
    else if (Number(v) > 0) costs[k] = clampInt(v, 1, 3);
  }
  if (a.repeatable && (!a.outcomeVariants || !Object.keys(a.outcomeVariants).length))
    fail(where, "repeatable actions must declare outcomeVariants");

  return {
    id: String(a.id),
    family: a.family,
    domains: (Array.isArray(a.domains) ? a.domains : []).map(String),
    label: String(a.label),
    ...(a.scene ? { scene: String(a.scene) } : {}),
    contract: {
      costs,
      ...(a.prerequisites ? { prerequisites: a.prerequisites } : {}),
      reversibility: REVERSIBILITY.includes(a.reversibility) ? a.reversibility : "reversible",
      ...(a.switchingCost ? { switchingCost: String(a.switchingCost) } : {}),
      variance: VARIANCE.includes(a.variance) ? a.variance : "moderate",
      ...(a.opportunityNote ? { opportunityNote: String(a.opportunityNote) } : {}),
      evidenceLabel: a.evidenceLabel,
    },
    options: options.map((o, i) => normOption(o, `${where}/${o.id ?? i}`)),
    ...(a.outcomeVariants ? { outcomeVariants: a.outcomeVariants } : {}),
    ...(normDelayed(a.delayedEffects, where) ? { delayedEffects: normDelayed(a.delayedEffects, where) } : {}),
    ...(Array.isArray(a.failureModes) && a.failureModes.length ? { failureModes: a.failureModes.map(String) } : {}),
    ...(Array.isArray(a.recoveryRefs) && a.recoveryRefs.length ? { recoveryRefs: a.recoveryRefs.map(String) } : {}),
    ...(a.noRecoveryTie && a.noRecoveryTie.reason ? { noRecoveryTie: { reason: String(a.noRecoveryTie.reason) } } : {}),
    readRef: String(a.readRef),
    seasonBands: normSeasonBands(a.seasonBands, where),
    ...(a.repeatable ? { repeatable: true } : {}),
    ...(Array.isArray(a.requiresFlags) && a.requiresFlags.length ? { requiresFlags: a.requiresFlags.map(String) } : {}),
    ...(Array.isArray(a.excludesFlags) && a.excludesFlags.length ? { excludesFlags: a.excludesFlags.map(String) } : {}),
    ...(a.standing ? { standing: { seasons: clampInt(a.standing.seasons, 1, 8), upkeep: a.standing.upkeep ?? {} } } : {}),
    ...(a.weight ? { weight: Number(a.weight) } : {}),
  };
}

function normEvent(e) {
  const where = e.id ?? "(no id)";
  if (!FAMILIES.includes(e.family)) fail(where, `bad family "${e.family}"`);
  if (!EVIDENCE.includes(e.evidenceLabel)) fail(where, `bad evidenceLabel "${e.evidenceLabel}"`);
  if (!ROUTES.has(e.readRef)) fail(where, `readRef "${e.readRef}" does not resolve`);
  const t = e.trigger ?? { kind: "chance" };
  if (!["scheduled", "consequence", "companion", "systemic", "chance"].includes(t.kind))
    fail(where, `bad trigger kind "${t.kind}"`);
  const trigger =
    t.kind === "scheduled"
      ? { kind: "scheduled", seasonIndex: clampInt(t.seasonIndex ?? 0, 0, 23) }
      : t.kind === "consequence"
        ? { kind: "consequence", sourceRef: String(t.sourceRef ?? "") }
        : t.kind === "companion"
          ? { kind: "companion", arcRef: String(t.arcRef ?? "") }
          : { kind: t.kind };
  const options = Array.isArray(e.options) ? e.options : [];
  if (options.length < 1 || options.length > 4) fail(where, `1-4 options required; saw ${options.length}`);

  return {
    id: String(e.id),
    family: e.family,
    domains: (Array.isArray(e.domains) ? e.domains : []).map(String),
    label: String(e.label),
    scene: String(e.scene ?? ""),
    trigger,
    seasonBands: normSeasonBands(e.seasonBands, where),
    options: options.map((o, i) => normOption(o, `${where}/${o.id ?? i}`)),
    ...(e.outcomeVariants ? { outcomeVariants: e.outcomeVariants } : {}),
    ...(normDelayed(e.delayedEffects, where) ? { delayedEffects: normDelayed(e.delayedEffects, where) } : {}),
    readRef: String(e.readRef),
    evidenceLabel: e.evidenceLabel,
    ...(Array.isArray(e.recoveryRefs) && e.recoveryRefs.length ? { recoveryRefs: e.recoveryRefs.map(String) } : {}),
    ...(e.noRecoveryTie && e.noRecoveryTie.reason ? { noRecoveryTie: { reason: String(e.noRecoveryTie.reason) } } : {}),
    ...(Array.isArray(e.requiresFlags) && e.requiresFlags.length ? { requiresFlags: e.requiresFlags.map(String) } : {}),
    ...(Array.isArray(e.excludesFlags) && e.excludesFlags.length ? { excludesFlags: e.excludesFlags.map(String) } : {}),
    ...(e.negative ? { negative: true } : {}),
    ...(e.invalidates
      ? {
          invalidates: {
            actionIds: (e.invalidates.actionIds ?? []).map(String),
            resolution: e.invalidates.resolution === "convert" ? "convert" : "refund",
            ...(e.invalidates.convertTo ? { convertTo: String(e.invalidates.convertTo) } : {}),
            note: String(e.invalidates.note ?? ""),
          },
        }
      : {}),
    ...(e.weight ? { weight: Number(e.weight) } : {}),
  };
}

/* ---- emit ---- */

const files = readdirSync(SRC).filter((f) => f.endsWith(".json"));
const actionBatches = [];
const eventBatches = [];
const seenIds = new Set();

for (const file of files.sort()) {
  const isAction = file.startsWith("actions-");
  const isEvent = file.startsWith("events-");
  if (!isAction && !isEvent) continue;
  const key = file.replace(/^(actions|events)-/, "").replace(/\.json$/, "");
  let raw;
  try {
    raw = JSON.parse(readFileSync(join(SRC, file), "utf8"));
  } catch (err) {
    fail(file, `not valid JSON — ${err.message}`);
    continue;
  }
  const list = Array.isArray(raw) ? raw : raw.actions || raw.events || [];
  const records = list.map((r) => (isAction ? normAction(r) : normEvent(r)));
  for (const r of records) {
    if (seenIds.has(r.id)) fail(r.id, "duplicate id across batches");
    seenIds.add(r.id);
  }
  (isAction ? actionBatches : eventBatches).push({ key, records, file });
}

/* ---- cross-batch reference integrity. An id that does not resolve is a rule the
        player would meet as a silent fizzle, which §7.6 forbids outright, so an
        unresolvable invalidation fails the compile rather than shipping. ---- */
{
  const actionIds = new Set(actionBatches.flatMap((b) => b.records.map((r) => r.id)));
  // The floor set lives outside the batches but is part of the pool.
  for (const id of ["act-rest-maintain", "act-wait", "act-seek-help"]) actionIds.add(id);
  // The small moves (content/sim/campaign/actions-small.ts) live outside the
  // batches too, and are legitimate recovery targets.
  for (const m of readFileSync(join(ROOT, "content/sim/campaign/actions-small.ts"), "utf8").matchAll(/id: "(act-small-[\w-]+)"/g))
    actionIds.add(m[1]);
  for (const { records } of eventBatches)
    for (const e of records) {
      if (!e.invalidates) continue;
      for (const id of e.invalidates.actionIds)
        if (!actionIds.has(id)) fail(e.id, `invalidates an action that does not exist: '${id}'`);
      if (e.invalidates.convertTo && !actionIds.has(e.invalidates.convertTo))
        fail(e.id, `converts to an action that does not exist: '${e.invalidates.convertTo}'`);
      // §7.6 resolves scheduled events BEFORE committed actions and everything
      // else after, so only a scheduled event can remove an action's premise.
      // An invalidation authored on a later slot is a rule that can never fire —
      // and /methodology publishes the rule as behaviour the engine performs.
      if (e.trigger.kind !== "scheduled")
        fail(
          e.id,
          `declares an invalidation but resolves in the '${e.trigger.kind}' slot, which is AFTER committed actions (§7.6). Only a scheduled event can invalidate an action's premise.`,
        );
    }
  // A recovery tie that points nowhere, or at an action carrying no recovery- or
  // endurance-flagged option, is worse than no tie: it promises a route out of a
  // failure and hands back nothing. The earlier compiler dropped these silently,
  // which is how 104 authored ties went missing without anyone noticing. Both
  // shapes are now errors.
  const hasRecoveryOption = new Map();
  for (const { records } of actionBatches)
    for (const a of records)
      hasRecoveryOption.set(
        a.id,
        a.options.some((o) => (o.flags ?? []).some((f) => f === "recovery" || f === "endurance")),
      );
  for (const id of ["act-rest-maintain", "act-wait", "act-seek-help"]) hasRecoveryOption.set(id, true);
  {
    const smallSrc = readFileSync(join(ROOT, "content/sim/campaign/actions-small.ts"), "utf8");
    for (const m of smallSrc.matchAll(/id: "(act-small-[\w-]+)"/g)) {
      const start = m.index;
      const next = smallSrc.indexOf('id: "act-small-', start + 10);
      const block = smallSrc.slice(start, next === -1 ? smallSrc.length : next);
      hasRecoveryOption.set(m[1], /flags: \["recovery"|flags: \["recovery", "endurance"\]/.test(block));
    }
  }
  for (const group of [actionBatches, eventBatches])
    for (const { records } of group)
      for (const r of records) {
        for (const ref of r.recoveryRefs ?? []) {
          if (!actionIds.has(ref)) fail(r.id, `recoveryRef '${ref}' does not resolve to an action`);
          else if (!hasRecoveryOption.get(ref))
            fail(r.id, `recoveryRef '${ref}' points at an action with no recovery- or endurance-flagged option — a dead tie`);
        }
        const canFail = r.options.some((o) => o.bands.some((b) => b.failure));
        const ownTie = r.options.some((o) => (o.flags ?? []).some((f) => f === "recovery" || f === "endurance"));
        if (canFail && !ownTie && !(r.recoveryRefs ?? []).length && !r.noRecoveryTie)
          fail(
            r.id,
            "can land a failure band with no recovery tie: give it a recovery/endurance option, or name recoveryRefs (§3.4 step 5). noRecoveryTie is NOT a third remedy — it is only for records that mark no failure band at all.",
          );
        if (r.noRecoveryTie && !String(r.noRecoveryTie.reason || "").trim())
          fail(r.id, "noRecoveryTie must carry a stated reason");
        // The opt-out is a declaration, not an exemption: it asserts nothing here
        // is a failure to be recovered from, which is only true if no band is
        // marked one. S-3 enforces the same rule against the shipped pool.
        if (r.noRecoveryTie && canFail)
          fail(
            r.id,
            "declares noRecoveryTie AND marks a failure band — the opt-out cannot buy an exemption from the tie rule (§3.4 step 5). Drop the failure flag, or author a tie.",
          );
      }
}

if (errors.length) {
  console.error(`\n${errors.length} CONTENT ERROR(S) — nothing emitted:\n`);
  for (const e of errors) console.error("  " + e);
  process.exit(1);
}

const banner = (kind, key, file, n) => `/**
 * ${kind} batch "${key}" — GENERATED by tools/build-content.mjs from ${file}.
 *
 * Authored against content/sim/AUTHORING.md by a schema-constrained author, then
 * checked by an adversarial safety verifier (two-tier boundary, capacity-event
 * boundary, never-command five, no-numbers, no-dominant-option, evidence labels,
 * voice) and repaired against its findings, then read in the rolling human review.
 * ${n} records. Edit the batch source and re-run the compiler; do not hand-edit.
 */`;

for (const { key, records, file } of actionBatches) {
  const out = `${banner("Action", key, file, records.length)}
import type { SimAction } from "@/content/sim/schema";

export const ACTIONS_${key.toUpperCase().replace(/[^A-Z0-9]/g, "_")}: SimAction[] = ${JSON.stringify(records, null, 2)};
`;
  mkdirSync(join(ROOT, "content/sim/campaign/actions"), { recursive: true });
  writeFileSync(join(ROOT, `content/sim/campaign/actions/batch-${key}.ts`), out);
}

for (const { key, records, file } of eventBatches) {
  const out = `${banner("Event", key, file, records.length)}
import type { SimEvent } from "@/content/sim/schema";

export const EVENTS_${key.toUpperCase().replace(/[^A-Z0-9]/g, "_")}: SimEvent[] = ${JSON.stringify(records, null, 2)};
`;
  mkdirSync(join(ROOT, "content/sim/campaign/events"), { recursive: true });
  writeFileSync(join(ROOT, `content/sim/campaign/events/batch-${key}.ts`), out);
}

const varName = (k) => k.toUpperCase().replace(/[^A-Z0-9]/g, "_");

writeFileSync(
  join(ROOT, "content/sim/campaign/actions/index.ts"),
  `/**
 * The action pool, assembled from the authored batches (blueprint 4.0 §7.3, §9.5).
 * GENERATED by tools/build-content.mjs. A batch not listed here is not in the game.
 */
import type { SimAction } from "@/content/sim/schema";
${actionBatches.map((b) => `import { ACTIONS_${varName(b.key)} } from "@/content/sim/campaign/actions/batch-${b.key}";`).join("\n")}

export const ACTION_BATCHES: SimAction[] = [
${actionBatches.map((b) => `  ...ACTIONS_${varName(b.key)},`).join("\n")}
];
`,
);

writeFileSync(
  join(ROOT, "content/sim/campaign/events/index.ts"),
  `/**
 * The event pool, assembled from the authored batches (blueprint 4.0 §7.3, §9.5).
 * GENERATED by tools/build-content.mjs. A batch not listed here is not in the game.
 */
import type { SimEvent } from "@/content/sim/schema";
${eventBatches.map((b) => `import { EVENTS_${varName(b.key)} } from "@/content/sim/campaign/events/batch-${b.key}";`).join("\n")}

export const EVENT_BATCHES: SimEvent[] = [
${eventBatches.map((b) => `  ...EVENTS_${varName(b.key)},`).join("\n")}
];
`,
);

const nA = actionBatches.reduce((a, b) => a + b.records.length, 0);
const nE = eventBatches.reduce((a, b) => a + b.records.length, 0);
console.log(`compiled ${nA} actions across ${actionBatches.length} batches, ${nE} events across ${eventBatches.length} batches`);
if (warn.length) for (const w of warn) console.log("  note: " + w);
