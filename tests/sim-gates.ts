/**
 * The simulator gate suite (blueprint 3.0 §9): S-1 through S-8. Runs headlessly
 * over the content fixtures and the pure engine — no browser, no build needed for
 * the static/logic gates. S-4 (help reachability in a live browser) runs in
 * tests/browser-gates.mjs; a structural precondition of it is checked here.
 *
 * Run: npm run gates:sim   (tsx resolves the @/ aliases and .ts extensions)
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, sep } from "node:path";
import { ROOT, containsPhrase, reportGate, type GateResult } from "./util.ts";

import { ROUTES } from "@/content/routes";
import {
  GAUGE_LABEL,
  GAUGE_MEANING,
  SPREAD_MEANING,
  OUTCOME_BAND_LABEL,
} from "@/content/bands";
import {
  CRISIS_TIER_TERMS,
  LOSS_TIER_TERMS,
  crisisDomainOf,
  lossDomainOf,
} from "@/content/exclusions";
import {
  OBJECTIVE_LABEL,
  OBJECTIVE_NOTE,
  LEANING_LABEL,
  LEANING_NOTE,
} from "@/content/play/schema";
import { ALL_CARDS, cardsForAct } from "@/content/play/cards";
import { ALL_BEATS, BEATS } from "@/content/play/beats";
import { ACTS, END_OF_LIFE } from "@/content/play/acts";
import { HAND_AXES, ERA } from "@/content/play/hand-axes";
import { CONDITIONS, SKILLS } from "@/content/play/registry";
import { WORTH_GUARD, WORTH_GUARD_VERBATIM, profileRender } from "@/content/sim/profile";
import { drawHand } from "@/lib/engine/hand";
import { ALL_ACHIEVEMENT_LINES, ALL_AIM_LINES } from "@/content/play/parse-copy";
import { ALL_MECHANICS } from "@/content/play/mechanics";
import { ALL_READING_STRINGS } from "@/content/board";
import {
  ILLUSTRATIVE_NOTE,
  CONTENT_NOTE,
  PROLOGUE_LINES,
  BRIEFING_TITLE,
  BRIEFING_INTRO,
  BRIEFING_POINTS,
  WEIGHTS_INTRO,
  LEANING_INTRO,
  HAND_INTRO,
  REDRAW_LINE_1,
  REDRAW_LINE_EXTENDED,
  PARSE_TITLE,
  PARSE_INTRO,
  REPLAY_NOTE,
  NEW_HAND_DISANALOGY,
} from "@/content/play/framing";
import type { DecisionCard, ScriptedBeat } from "@/content/play/schema";

import {
  initRun,
  setWinWeights,
  setLeaning,
  acceptHand,
  currentSlot,
  selectCard,
  commitDecision,
  commitWatched,
  commitBeat,
  advance,
  drawFor,
  serializeRun,
  deserializeRun,
  computeParse,
} from "@/lib/engine/run";
import { resolve } from "@/lib/engine/resolve";
import { hashToUnit, weightedIndex } from "@/lib/engine/rng";

const validRoutes = new Set(ROUTES.map((r) => r.path));
const results: GateResult[] = [];

type Tagged = { text: string; where: string };

/** Every sim-rendered string OUTSIDE of scripted beats (loss-tier forbidden here). */
function collectNonBeatStrings(): Tagged[] {
  const out: Tagged[] = [];
  const add = (text: unknown, where: string) => {
    if (typeof text === "string" && text.trim()) out.push({ text, where });
  };
  for (const c of ALL_CARDS) {
    add(c.setup, `${c.id}.setup`);
    for (const o of c.options) {
      add(o.label, `${c.id}/${o.id}.label`);
      o.chips.costs.forEach((cost, i) => add(cost, `${c.id}/${o.id}.cost[${i}]`));
      (o.chips.positionNotes ?? []).forEach((p, i) => add(p.text, `${c.id}/${o.id}.pos[${i}]`));
      o.bands.forEach((b) => add(b.outcome.line, `${c.id}/${o.id}/${b.name}.line`));
    }
  }
  add(ERA.label, "era.label");
  add(ERA.reveal, "era.reveal");
  for (const axis of HAND_AXES) {
    add(axis.title, `axis:${axis.id}.title`);
    add(axis.caption, `axis:${axis.id}.caption`);
    for (const v of axis.values) {
      add(v.label, `hand:${axis.id}/${v.id}.label`);
      add(v.reveal, `hand:${axis.id}/${v.id}.reveal`);
    }
  }
  for (const cond of Object.values(CONDITIONS)) {
    add(cond.label, `cond:${cond.id}.label`);
    add(cond.note, `cond:${cond.id}.note`);
  }
  for (const sk of Object.values(SKILLS)) add(sk.label, `skill:${sk.id}.label`);
  for (const k of Object.keys(OBJECTIVE_LABEL)) {
    add(OBJECTIVE_LABEL[k as keyof typeof OBJECTIVE_LABEL], `obj:${k}.label`);
    add(OBJECTIVE_NOTE[k as keyof typeof OBJECTIVE_NOTE], `obj:${k}.note`);
  }
  for (const k of Object.keys(LEANING_LABEL)) {
    add(LEANING_LABEL[k as keyof typeof LEANING_LABEL], `lean:${k}.label`);
    add(LEANING_NOTE[k as keyof typeof LEANING_NOTE], `lean:${k}.note`);
  }
  for (const v of Object.values(GAUGE_LABEL)) add(v, "gauge.label");
  for (const v of Object.values(GAUGE_MEANING)) add(v, "gauge.meaning");
  for (const v of Object.values(SPREAD_MEANING)) add(v, "spread.meaning");
  for (const v of Object.values(OUTCOME_BAND_LABEL)) add(v, "band.label");
  // The arc's rendered constraint profile, sampled across drawn hands (§2.3.1).
  for (let i = 0; i < 12; i++)
    for (const l of profileRender(drawHand(`lint-${i}`).hand.profile).lines) {
      add(l.label, "profile.axis");
      add(l.band, "profile.band");
      add(l.note, "profile.note");
    }
  add(WORTH_GUARD, "worth-guard");
  ALL_ACHIEVEMENT_LINES.forEach((l, i) => add(l, `achievement[${i}]`));
  ALL_AIM_LINES.forEach((l, i) => add(l, `aim-read[${i}]`));
  for (const m of ALL_MECHANICS) {
    add(m.standardTitle, `mech:${m.id}.standardTitle`);
    add(m.gameTitle, `mech:${m.id}.gameTitle`);
    add(m.paragraph, `mech:${m.id}.paragraph`);
    add(m.deepHomeLabel, `mech:${m.id}.deepHomeLabel`);
  }
  // Dual-authored framing (prologue, briefing, parse frame) + creation copy.
  add(ILLUSTRATIVE_NOTE, "framing.illustrative");
  add(CONTENT_NOTE, "framing.content-note");
  for (const d of PROLOGUE_LINES) { add(d.standard, "prologue.std"); add(d.game, "prologue.game"); }
  for (const d of [BRIEFING_TITLE, BRIEFING_INTRO, WEIGHTS_INTRO, LEANING_INTRO, HAND_INTRO, PARSE_TITLE, PARSE_INTRO]) {
    add(d.standard, "framing.std"); add(d.game, "framing.game");
  }
  for (const p of BRIEFING_POINTS) { add(p.label, `brief:${p.key}.label`); add(p.body.standard, `brief:${p.key}.std`); add(p.body.game, `brief:${p.key}.game`); }
  add(REDRAW_LINE_1, "framing.redraw1");
  add(REDRAW_LINE_EXTENDED, "framing.redraw2");
  add(REPLAY_NOTE, "framing.replay-note");
  add(NEW_HAND_DISANALOGY, "framing.new-hand-disanalogy");
  for (const a of ACTS) {
    add(a.title, `act:${a.id}.title`);
    add(a.ageBand, `act:${a.id}.ageBand`);
    add(a.intro, `act:${a.id}.intro`);
  }
  add(END_OF_LIFE.title, "eol.title");
  add(END_OF_LIFE.intro, "eol.intro");
  return out;
}

function collectBeatStrings(): Tagged[] {
  const out: Tagged[] = [];
  for (const b of ALL_BEATS) {
    out.push({ text: b.prose, where: `${b.id}.prose` });
    out.push({ text: b.skippedLine, where: `${b.id}.skippedLine` });
  }
  return out;
}

/* ============================ S-1 — Content-boundary lint ============================ */
{
  const details: string[] = [];
  let ok = true;
  const nonBeat = collectNonBeatStrings();
  const beat = collectBeatStrings();

  // (a) crisis-tier terms: forbidden EVERYWHERE (beats included).
  for (const { text, where } of [...nonBeat, ...beat]) {
    const lower = text.toLowerCase();
    for (const term of CRISIS_TIER_TERMS) {
      if (containsPhrase(lower, term)) {
        ok = false;
        details.push(`CRISIS-TIER "${term}" (${crisisDomainOf(term)}) in ${where}`);
      }
    }
  }
  // (b) loss-tier terms: forbidden in non-beat sim content.
  for (const { text, where } of nonBeat) {
    const lower = text.toLowerCase();
    for (const term of LOSS_TIER_TERMS) {
      if (containsPhrase(lower, term)) {
        ok = false;
        details.push(`LOSS-TIER "${term}" (${lossDomainOf(term)}) leaked into non-beat content: ${where}`);
      }
    }
  }
  // (c) beat records structurally correct.
  for (const b of ALL_BEATS as ScriptedBeat[]) {
    if (b.type !== "scripted") { ok = false; details.push(`${b.id}: type must be 'scripted'`); }
    if (b.skippable !== true) { ok = false; details.push(`${b.id}: skippable must be true`); }
    if (b.reducedFrame !== true) { ok = false; details.push(`${b.id}: reducedFrame must be true`); }
    if (!b.realPageLink || !validRoutes.has(b.realPageLink)) {
      ok = false;
      details.push(`${b.id}: realPageLink '${b.realPageLink}' does not resolve to a route`);
    }
    if (!b.prose?.trim()) { ok = false; details.push(`${b.id}: empty prose`); }
    if (!b.skippedLine?.trim()) { ok = false; details.push(`${b.id}: missing neutral skipped line`); }
  }
  if (ok)
    details.push(
      `${nonBeat.length} non-beat strings clean of crisis+loss tiers; ${ALL_BEATS.length} beats well-typed with resolving realPageLinks.`,
    );
  results.push({ id: 101, name: "S-1 · Content-boundary lint (two-tier)", pass: ok, details });
}

/* ============================ S-2 — No-numbers-in-play lint ============================ */
{
  const details: string[] = [];
  let ok = true;
  const YEAR = /\b(1[5-9]\d\d|20\d\d)\b/g;
  const all = [...collectNonBeatStrings(), ...collectBeatStrings()];
  for (const { text, where } of all) {
    if (text.includes("%")) {
      ok = false;
      details.push(`percent sign in ${where}: ${JSON.stringify(text.slice(0, 40))}`);
    }
    if (/\b\d+\s+(in|out of|of)\s+\d+\b/i.test(text)) {
      ok = false;
      details.push(`"N in M" statistic in ${where}`);
    }
    const stripped = text.replace(YEAR, " ");
    const bare = stripped.match(/\d[\d.,]*/);
    if (bare) {
      ok = false;
      details.push(`bare number "${bare[0]}" in ${where} (spell it out; qualitative bands only)`);
    }
  }
  if (ok) details.push(`${all.length} sim strings: no percentages, no "N in M", no bare numbers (years excepted).`);
  results.push({ id: 102, name: "S-2 · No-numbers-in-play lint", pass: ok, details });
}

/* ============================ S-3 — Graph integrity ============================ */
{
  const details: string[] = [];
  let ok = true;
  const fail = (m: string) => { ok = false; details.push(m); };

  // The set of KNOWN constraint-flag ids a positionNote's `when` may reference
  // (matchWhen keys on flag ids): every hand-axis flag, every `flagsSet` across
  // cards and beats, plus the floor/no-floor literals. Guards against display
  // phrases being authored where a flag id is required (F2).
  const knownFlags = new Set<string>(["floor", "no-floor"]);
  for (const axis of HAND_AXES) for (const v of axis.values) for (const f of v.flags ?? []) knownFlags.add(f);
  for (const c of ALL_CARDS)
    for (const o of c.options)
      for (const b of o.bands)
        for (const f of b.outcome.effects.flagsSet ?? []) knownFlags.add(f);
  for (const b of ALL_BEATS) for (const f of b.effects?.flagsSet ?? []) knownFlags.add(f);

  // A single-band option is permitted ONLY on a watched act (§3.4) or the
  // end-of-life pool (act 9); everywhere else the §3.5 contract requires 2–3.
  const singleBandAllowed = (act: number) => Boolean(ACTS.find((a) => a.n === act)?.watched) || act === 9;

  for (const c of ALL_CARDS) {
    if (c.options.length < 2 || c.options.length > 4) fail(`${c.id}: must have 2–4 options`);
    const minBands = singleBandAllowed(c.act) ? 1 : 2;
    for (const o of c.options) {
      if (o.bands.length < minBands || o.bands.length > 3)
        fail(`${c.id}/${o.id}: options declare ${minBands === 1 ? "1–3" : "2–3"} bands (§3.5); saw ${o.bands.length}`);
      if (o.bands.filter((b) => b.failure).length > 1) fail(`${c.id}/${o.id}: at most one failure band`);
      for (const b of o.bands) {
        if (!b.outcome?.line?.trim()) fail(`${c.id}/${o.id}/${b.name}: missing outcome line`);
        if (!b.outcome?.effects || typeof b.outcome.effects !== "object")
          fail(`${c.id}/${o.id}/${b.name}: missing effects object`);
        if (!(b.weight > 0)) fail(`${c.id}/${o.id}/${b.name}: weight must be > 0`);
      }
      for (const p of o.chips.positionNotes ?? []) {
        if (!knownFlags.has(p.when))
          fail(`${c.id}/${o.id}: positionNote when '${p.when}' is not a known flag id (it would never render)`);
      }
      if ((o.flags ?? []).includes("endurance") && !o.supportLink)
        fail(`${c.id}/${o.id}: endurance option must name a supportLink`);
      if (o.supportLink && !validRoutes.has(o.supportLink))
        fail(`${c.id}/${o.id}: supportLink '${o.supportLink}' does not resolve`);
    }
  }

  // Per-act pool sizing + recovery availability.
  const actDefs = [...ACTS.map((a) => ({ n: a.n, slots: a.slots })), { n: 9, slots: END_OF_LIFE.slots }];
  for (const { n, slots } of actDefs) {
    // A fixed-card slot is a decision too (it can land failure and steer the next slot).
    const decisions = slots.filter((s) => s.kind === "decision" || s.kind === "card").length;
    const watched = slots.filter((s) => s.kind === "watched").length;
    const pool = cardsForAct(n);
    if (pool.length < decisions + watched)
      fail(`act ${n}: pool of ${pool.length} cards < ${decisions + watched} card-consuming slots`);
    const failureCapable = pool.some((c) => c.options.some((o) => o.bands.some((b) => b.failure)));
    if (failureCapable && decisions > 0) {
      const recoveryCards = pool.filter(isRecoveryCard).length;
      if (recoveryCards < decisions)
        fail(`act ${n}: ${recoveryCards} recovery-bearing cards < ${decisions} decision slots (S-3 successor guarantee)`);
    }
    for (const s of slots) {
      if (s.kind === "beat" && !BEATS[s.beatId]) fail(`act ${n}: beat slot references missing beat '${s.beatId}'`);
    }
  }

  if (ok) details.push(`${ALL_CARDS.length} cards well-formed; every act pool sized with a recovery route for each decision slot.`);
  results.push({ id: 103, name: "S-3 · Graph integrity (bands, recovery, no dead ends)", pass: ok, details });
}

function isRecoveryCard(card: DecisionCard): boolean {
  if (card.recoveryCard) return true;
  return card.options.some((o) => (o.flags ?? []).some((f) => f === "recovery" || f === "endurance"));
}

/* ============================ S-3b / reachability — drive full runs to the parse ============================ */
{
  const details: string[] = [];
  let ok = true;
  let reached = 0;
  const SAMPLE = 120;
  for (let i = 0; i < SAMPLE; i++) {
    const r = drivePolicyRun(`hand-${i}`, `draw-${i}`, {});
    if (r.state.phase !== "parse") {
      ok = false;
      details.push(`seed ${i}: run stalled in phase ${r.state.phase} at act ${r.state.act}`);
      if (details.length > 6) break;
    } else {
      reached++;
      // Every hand reaches a computable parse.
      const parse = computeParse(r.state);
      if (!parse.turningPoints.length) { ok = false; details.push(`seed ${i}: empty parse`); }
    }
  }
  if (ok) details.push(`${reached}/${SAMPLE} hands drove creation → all acts → end of life → parse; no dead ends.`);
  results.push({ id: 104, name: "S-3b · Full-run reachability (parse reachable from every hand)", pass: ok, details });
}

/* ============================ S-5 — No-score lint (reader-facing) ============================ */
{
  const details: string[] = [];
  let ok = true;
  const SCORE_WORDS = ["score", "grade", "leaderboard", "percentile", "streak", "high score"];
  // The board's rendered responses are linted alongside the parse (§4, S-5).
  const boardStrings = ALL_READING_STRINGS.map((t, i) => ({ text: t, where: `board-reading[${i}]` }));
  for (const { text, where } of [...collectNonBeatStrings(), ...collectBeatStrings(), ...boardStrings]) {
    const lower = text.toLowerCase();
    for (const w of SCORE_WORDS) {
      if (containsPhrase(lower, w)) {
        ok = false;
        details.push(`reader-facing score word "${w}" in ${where}`);
      }
    }
  }
  // Structural: the ParseSummary carries no total/score field (checked by grep of its type).
  const runSrc = readFileSync(join(ROOT, "lib/engine/run.ts"), "utf8");
  if (/type ParseSummary[\s\S]*?\btotal\b\s*:/.test(runSrc) || /ParseSummary[\s\S]*?\bscore\b\s*:/.test(runSrc)) {
    ok = false;
    details.push("ParseSummary declares a total/score field");
  }
  // Components: any Parse/Play/Board component must carry no score token in JSX text.
  for (const file of collectSources(join(ROOT, "components")).concat(collectSources(join(ROOT, "app/play")))) {
    const base = file.replace(ROOT + sep, "");
    if (!/parse|play|board/i.test(base)) continue;
    const src = readFileSync(file, "utf8");
    for (const w of ["leaderboard", "percentile"]) {
      if (src.includes(`>${w}`) || src.includes(` ${w} `)) {
        ok = false;
        details.push(`${base}: score token "${w}"`);
      }
    }
  }
  if (ok) details.push("Parse/board content and templates: no totals, grades, ranks, meters, or reader comparisons.");
  results.push({ id: 105, name: "S-5 · No-score lint (reader-facing instruments)", pass: ok, details });
}

/* ============================ S-6 — Input-doctrine lint ============================ */
{
  const details: string[] = [];
  let ok = true;
  // Reader-owned-content fields on an explicit allowlist with a justification.
  const ALLOWLIST: Record<string, string> = {
    // The legacy 2.0 board is GONE — rebuilt in Phase 3 as an all-enumerated guided
    // pressure reading (§4), so components/Board.tsx no longer appears here.
    "components/Logs.tsx":
      "Reader-owned content (decision-record titles + journal bodies). Stored, NEVER interpreted or keyed on (§4 exception).",
    "components/Search.tsx":
      "Navigation search over the route index — does not feed engine/board/guidance logic; substring match only (§6.7).",
  };
  const offenders: string[] = [];
  const files = collectSources(join(ROOT, "components")).concat(collectSources(join(ROOT, "app")));
  for (const file of files) {
    const base = file.replace(ROOT + sep, "").split(sep).join("/");
    const src = readFileSync(file, "utf8");
    const hasTextarea = /<textarea[\s>]/i.test(src);
    // free-text input: <input ... type="text|search|email|..."> or an <input> with no type (defaults to text).
    const inputMatches = src.match(/<input\b[^>]*>/gi) ?? [];
    const hasFreeText = inputMatches.some((tag) => {
      const type = (tag.match(/type="([^"]*)"/i) ?? [])[1];
      if (!type) return true; // default text
      return ["text", "search", "email", "url", "tel", "password", "number"].includes(type.toLowerCase());
    });
    if (hasTextarea || hasFreeText) offenders.push(base);
  }
  for (const base of offenders) {
    if (!ALLOWLIST[base]) {
      ok = false;
      details.push(`free-text field in ${base} is NOT on the allowlist (enumerate it, or justify + allowlist)`);
    }
  }
  if (ok)
    details.push(
      `Free-text fields present only in allowlisted files (${offenders.join(", ")}); everything the engine responds to is enumerated.`,
    );
  results.push({ id: 106, name: "S-6 · Input-doctrine lint (no interpreted free text)", pass: ok, details });
}

/* ============================ S-7 — Determinism ============================ */
{
  const details: string[] = [];
  let ok = true;

  // (a) Same seeds + same interleaving (skips, pause/resume, why-detour, weight edit) ⇒ identical run.
  const opts = { skipAlternate: true, pauseEach: true, whyDetour: true, aimsAudit: true };
  const a = drivePolicyRun("det-hand", "det-draw", opts);
  const b = drivePolicyRun("det-hand", "det-draw", opts);
  if (serializeRun(a.state) !== serializeRun(b.state)) {
    ok = false;
    details.push("two identical drives produced different serialized state");
  }
  if (JSON.stringify(computeParse(a.state)) !== JSON.stringify(computeParse(b.state))) {
    ok = false;
    details.push("two identical drives produced different parses");
  }

  // (b) Non-perturbation: pause/resume + why-detours must NOT change the mechanical run.
  const plain = drivePolicyRun("det-hand", "det-draw", { skipAlternate: true, aimsAudit: true });
  const detoured = drivePolicyRun("det-hand", "det-draw", opts);
  const mech = (s: ReturnType<typeof drivePolicyRun>["state"]) =>
    JSON.stringify({ gauges: s.gauges, committed: s.committed, act: s.act, flags: s.flags, skills: s.skills });
  if (mech(plain.state) !== mech(detoured.state)) {
    ok = false;
    details.push("pause/resume and why-detours perturbed the run (a sequential-RNG engine would fail here)");
  }

  // (c) Determinism holds across many seeds.
  let mismatches = 0;
  for (let i = 0; i < 60; i++) {
    const x = drivePolicyRun(`h${i}`, `d${i}`, opts);
    const y = drivePolicyRun(`h${i}`, `d${i}`, opts);
    if (serializeRun(x.state) !== serializeRun(y.state)) mismatches++;
  }
  if (mismatches > 0) { ok = false; details.push(`${mismatches}/60 seeds were non-deterministic`); }

  if (ok)
    details.push(
      "Identical seeds+choices ⇒ identical run (60 seeds); skips, pause/resume, why-detours, and a weight edit never perturbed a draw.",
    );
  results.push({ id: 107, name: "S-7 · Determinism (derived-seed, replay-stable)", pass: ok, details });
}

/* ============================ S-8 — Worth-guard adjacency ============================ */
{
  const details: string[] = [];
  let ok = true;
  if (!WORTH_GUARD.includes(WORTH_GUARD_VERBATIM)) {
    ok = false;
    details.push("WORTH_GUARD no longer contains the verbatim guard clause");
  }
  // REBOUND to the constraint profile (§2.3.1). The arc no longer has a tier, so
  // this checks what replaced it: any template that renders the profile renders
  // the guard adjacently, and the tier vocabulary is GONE rather than unused.
  const files = collectSources(join(ROOT, "components")).concat(collectSources(join(ROOT, "app")));
  for (const file of files) {
    const base = file.replace(ROOT + sep, "").split(sep).join("/");
    const src = readFileSync(file, "utf8");
    if (/tierLabel\(|TIER_GAME|TIER_STANDARD|hand\.tier|summary\.tier/.test(src)) {
      ok = false;
      details.push(`${base} still renders a difficulty tier — superseded by the constraint profile (§2.3.1)`);
    }
    const rendersProfile = /profileRender|profileLines/.test(src);
    if (rendersProfile && !/WORTH_GUARD|worthGuard/.test(src)) {
      ok = false;
      details.push(`${base} renders the constraint profile without the adjacent worth-guard`);
    }
  }
  // The arc's hand carries a profile and no tier at all.
  const sampled = drawHand("s8-sample").hand as unknown as Record<string, unknown>;
  if ("tier" in sampled) {
    ok = false;
    details.push("the arc's Hand still carries a `tier` field");
  }
  if (!sampled.profile) {
    ok = false;
    details.push("the arc's Hand carries no constraint profile");
  }
  const lines = profileRender(drawHand("s8-sample").hand.profile).lines;
  if (lines.length !== 4) {
    ok = false;
    details.push(`the arc's profile rendered ${lines.length} lines; it is four axes`);
  }
  for (const l of lines)
    if (/\d/.test(l.band) || /\d/.test(l.note)) {
      ok = false;
      details.push(`the arc's profile rendered a digit on axis ${l.axis}`);
    }
  if (ok)
    details.push(
      "Verbatim worth-guard preserved and adjacent on every profile-rendering template; the difficulty tier is gone from the arc entirely (Hand carries a four-axis profile, no tier field, no digits rendered).",
    );
  results.push({ id: 108, name: "S-8 · Constraint profile + worth-guard adjacency (arc)", pass: ok, details });
}

/* ============================ Report ============================ */
for (const r of results.sort((a, b) => a.id - b.id)) reportGate(r);
const failed = results.filter((r) => !r.pass);
console.log("\n" + "=".repeat(60));
if (failed.length === 0) {
  console.log(`ALL ${results.length} SIM GATES PASS (S-1..S-8)`);
  process.exit(0);
} else {
  console.log(`${failed.length} SIM GATE(S) FAILED`);
  process.exit(1);
}

/* ============================ Helpers ============================ */

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

type DriveOpts = {
  skipAlternate?: boolean;
  pauseEach?: boolean;
  whyDetour?: boolean;
  aimsAudit?: boolean;
};

/**
 * Drive a complete run with a deterministic policy. The policy picks options via a
 * pure hash so two drives with the same seeds are identical. Optionally interleaves
 * a beat-skip alternation, a serialize/deserialize pause, a resolve() why-detour,
 * and one act-boundary weight edit — none of which may perturb the run (S-7).
 */
function drivePolicyRun(handSeed: string, drawSeed: string, opts: DriveOpts) {
  let s = initRun({ handSeed, drawSeed });
  s = setWinWeights(s, { stability: 2, autonomy: 1, craft: 1, service: 0 });
  s = setLeaning(s, "curious");
  s = acceptHand(s);

  let beatCount = 0;
  let audited = false;
  let guard = 0;
  while (s.phase !== "parse" && guard++ < 1000) {
    // Aims audit: a single act-boundary weight edit when act 7 opens (S-7 interleave).
    if (opts.aimsAudit && !audited && s.phase === "acts" && ACTS[s.act]?.aimsAudit && s.cardIndex === 0) {
      s = setWinWeights(s, { stability: 1, autonomy: 2, craft: 1, service: 1 });
      audited = true;
    }
    const slot = currentSlot(s);
    if (!slot) { s = advance(s); continue; }
    if (slot.kind === "beat") {
      const skip = opts.skipAlternate ? beatCount % 2 === 0 : false;
      beatCount++;
      s = commitBeat(s, skip).state;
      continue;
    }
    if (slot.kind === "watched") {
      const r = commitWatched(s);
      s = r ? r.state : advance(s);
      continue;
    }
    // decision
    const card = selectCard(s);
    if (!card) { s = advance(s); continue; }
    const idx = weightedIndex(hashToUnit(drawSeed, `policy:${card.id}`), card.options.map(() => 1));
    const option = card.options[idx];
    if (opts.whyDetour) { resolve(option, s, drawFor(s, card.id)); resolve(option, s, drawFor(s, card.id)); }
    if (opts.pauseEach) { const rehydrated = deserializeRun(serializeRun(s)); if (rehydrated) s = rehydrated; }
    s = commitDecision(s, card, option.id).state;
  }
  return { state: s };
}
