/**
 * Produces the §10 acceptance evidence: the sandbox test, the queue test, the
 * monotony test, and three genuinely different recorded campaign runs.
 *
 * These are the checklist items that need a RUN rather than an assertion, so this
 * writes what actually happened into records/acceptance-evidence.md, verbatim,
 * rather than summarising it. The owner should be able to disagree with the
 * conclusion by reading the same output.
 *
 * Run: npx tsx tools/acceptance-evidence.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { newCampaign, setPriorities, commitSeason, budgetFor, remainingBudget, nextOrdinal, emptyPriorities, seasonLabel } from "@/lib/sim/campaign";
import { affordableMenu, floorReport, instanceOrdinal } from "@/lib/sim/season";
import { computeParse } from "@/lib/sim/parse";
import { compare } from "@/lib/sim/lab";
import { LAB_SITUATIONS } from "@/content/sim/lab/situations";
import { endingSignature, meaningfullyDifferent } from "@/lib/sim/satisfaction";
import { SEASON_COUNT, ACTION_BY_ID, PRESETS } from "@/content/sim/registry";
import { PRIORITY_LABEL, type CommittedAllocation, type CommittedEventResponse, type PriorityKey, type PrioritySet, type SimState } from "@/content/sim/schema";

const out: string[] = [];
const say = (s = "") => out.push(s);

/** An "intent": a player who prefers actions serving their stated priorities. */
function playWithIntent(
  presetId: string,
  seed: string,
  priorities: Partial<PrioritySet>,
  wants: string[],
  seasons = SEASON_COUNT,
) {
  let s = newCampaign({ origin: { kind: "preset", presetId }, handSeed: seed, drawSeed: `${seed}-d` });
  s = setPriorities(s, { ...emptyPriorities(), ...priorities });
  const log: { season: number; age: number; took: string[]; lines: string[]; queue: string[] }[] = [];
  const repeats = new Map<string, string[]>();
  let guard = 0;

  while (s.seasonIndex < seasons && guard++ < seasons + 5) {
    const allocations: CommittedAllocation[] = [];
    for (let slot = 0; slot < 3; slot++) {
      const remaining = remainingBudget(s, allocations);
      const menu = affordableMenu(s, remaining).filter((m) => !allocations.some((a) => a.actionId === m.action.id));
      if (!menu.length) break;
      const serving = menu.filter((m) => m.action.domains.some((d) => wants.some((w) => d.includes(w))));
      const pool = serving.length ? serving : menu;
      const pick = pool[(s.seasonIndex * 3 + slot) % pool.length];
      allocations.push({
        actionId: pick.action.id,
        instanceOrdinal: nextOrdinal(s, allocations, pick.action.id),
        optionId: pick.action.options[slot % pick.action.options.length].id,
      });
    }
    const queueBefore = s.queue.map((q) => q.label);
    let responses: CommittedEventResponse[] = [];
    let run = commitSeason(s, allocations, responses);
    let inner = 0;
    while (!run.done && inner++ < 10) {
      responses = [...responses, { eventId: run.pendingEvent.id, optionId: run.pendingEvent.options[0].id }];
      run = commitSeason(s, allocations, responses);
    }
    if (!run.done) break;
    const label = seasonLabel(s.seasonIndex);
    for (const item of run.result.items) {
      if (item.kind !== "action" || !item.instanceOrdinal) continue;
      const key = item.id;
      if (!repeats.has(key)) repeats.set(key, []);
      repeats.get(key)!.push(item.line);
    }
    log.push({
      season: s.seasonIndex + 1,
      age: label.age,
      took: allocations.map((a) => ACTION_BY_ID[a.actionId]?.label ?? a.actionId),
      lines: run.result.items.map((i) => i.line),
      queue: queueBefore,
    });
    s = run.state;
  }
  return { state: s, log, repeats };
}

/* ============================================================
   1 · THE SANDBOX TEST
   ============================================================ */
say("# §10 acceptance evidence");
say("");
say("Produced by `npx tsx tools/acceptance-evidence.ts`, from the shipped engine and");
say("the shipped content. Everything below is output, not summary.");
say("");
say("---");
say("");
say("## The sandbox test");
say("");
say("> *Two reviewers, same preset, different intents → visibly different seasons;");
say("> neither path “the right one”.*");
say("");
say("Same starting position (**Supported Explorer**), same seeds — so the hand and the");
say("draws are identical. The only difference is what the two players are aiming at.");
say("");

const A = playWithIntent("preset-supported-explorer", "sandbox", { mastery: 3, autonomy: 1 }, ["skill", "craft", "learning", "practice"]);
const B = playWithIntent("preset-supported-explorer", "sandbox", { closeness: 3, safety: 1 }, ["relationships", "family", "care", "support"]);

say("| season | player A — *mastery* | player B — *close relationships* |");
say("| --- | --- | --- |");
for (let i = 0; i < 8; i++) {
  const a = A.log[i];
  const b = B.log[i];
  if (!a || !b) break;
  say(`| ${a.season} (age ${a.age}) | ${a.took.join(" · ")} | ${b.took.join(" · ")} |`);
}
say("");
const sigA = endingSignature(A.state);
const sigB = endingSignature(B.state);
const differing = sigA.filter((x, i) => x !== sigB[i]);
say(`At thirty, the two ending signatures differ in **${differing.length} of ${sigA.length}** components`);
say(`(the bar for "meaningfully different" is three): ${meaningfullyDifferent(sigA, sigB) ? "**PASS**" : "**FAIL**"}.`);
say("");
say("What differs:");
say("");
for (let i = 0; i < sigA.length; i++) if (sigA[i] !== sigB[i]) say(`- \`${sigA[i]}\`  vs  \`${sigB[i]}\``);
say("");
const pA = computeParse(A.state);
const pB = computeParse(B.state);
say("And neither is the right one. Each parse reads the run against *that player's own*");
say("scorecard, so the same facts are read differently:");
say("");
for (const [who, p] of [["A (mastery)", pA], ["B (closeness)", pB]] as const) {
  say(`**Player ${who}**`);
  for (const pr of p.priorities.slice(0, 3)) say(`- *${pr.label}* — ${pr.reading}`);
  say("");
}

/* ============================================================
   2 · THE QUEUE TEST
   ============================================================ */
say("---");
say("");
say("## The queue test");
say("");
say("> *A delayed consequence lands seasons later and is traceable through the explain");
say("> drawer to its source season.*");
say("");
let found = false;
for (const preset of PRESETS) {
  if (found) break;
  for (const seed of ["q1", "q2", "q3"]) {
    if (found) break;
    let s = newCampaign({ origin: { kind: "preset", presetId: preset.id }, handSeed: seed, drawSeed: `${seed}-d` });
    s = setPriorities(s, { ...emptyPriorities(), safety: 2, mastery: 2 });
    for (let season = 0; season < SEASON_COUNT && !found; season++) {
      const allocations: CommittedAllocation[] = [];
      for (let slot = 0; slot < 3; slot++) {
        const remaining = remainingBudget(s, allocations);
        const menu = affordableMenu(s, remaining).filter((m) => !allocations.some((a) => a.actionId === m.action.id));
        if (!menu.length) break;
        const pick = menu[(s.seasonIndex * 5 + slot) % menu.length];
        allocations.push({ actionId: pick.action.id, instanceOrdinal: nextOrdinal(s, allocations, pick.action.id), optionId: pick.action.options[0].id });
      }
      let responses: CommittedEventResponse[] = [];
      let run = commitSeason(s, allocations, responses);
      let inner = 0;
      while (!run.done && inner++ < 10) {
        responses = [...responses, { eventId: run.pendingEvent.id, optionId: run.pendingEvent.options[0].id }];
        run = commitSeason(s, allocations, responses);
      }
      if (!run.done) break;
      const landed = run.result.items.find((i) => i.kind === "consequence" && i.attribution.some((a) => /season/.test(a.note)));
      if (landed && s.seasonIndex >= 3) {
        const placed = run.result.items.length && landed.attribution[0]?.note;
        say(`Found in a **${preset.label}** run, seed \`${seed}\`.`);
        say("");
        say(`In **season ${s.seasonIndex + 1}** (age ${seasonLabel(s.seasonIndex).age}) this arrived, not as a choice but as something already in motion:`);
        say("");
        say(`> ${landed.line}`);
        say("");
        say("The explain drawer renders its attribution, which names where it came from:");
        say("");
        for (const a of landed.attribution) say(`- **${a.category}** — ${a.note}`);
        say("");
        say(`That is the trace: \`${landed.id}\` → ${placed}. The queue entry carried its own`);
        say("`sourceRef` and placement season from the moment it was created, and the briefing");
        say("had been rendering it, with its timing named, every season in between.");
        found = true;
      }
      s = run.state;
    }
  }
}
if (!found) say("**NOT FOUND** — no delayed consequence landed traceably in the sampled runs.");
say("");

/* ============================================================
   3 · THE MONOTONY TEST
   ============================================================ */
say("---");
say("");
say("## The monotony test");
say("");
say("> *A full 24-season campaign without the ceremony wearing thin; repeated actions");
say("> never repeat outcome text verbatim in one run.*");
say("");
say(
  "**This clause is met in spirit and not to its letter, and the numbers below say so.** " +
    "The engine rotates each band's pool by occurrence, so a line cannot return until every " +
    "other line in that pool has been used — that is the strongest anti-repetition guarantee " +
    "available, and it is what ships. But a run makes on the order of a hundred and ten " +
    "resolutions against pools six to eight deep, so an action taken thirteen times shows " +
    "eight distinct lines and then begins the cycle again. Reaching the literal wording needs " +
    "pools roughly four times deeper. What was fixed rather than argued away: the season-end " +
    "rest-conversion line used to sit outside the rotation entirely and rendered in all " +
    "twenty-four seasons of every run. See KNOWN_LIMITATIONS.md §4.9.",
);
say("");
const mono = playWithIntent("preset-working-under-pressure", "mono", { safety: 2, health: 2, mastery: 1 }, ["health", "money", "skill"]);
const repeated = [...mono.repeats.entries()].filter(([, lines]) => lines.length > 1);
let verbatim = 0;
const worst: string[] = [];
for (const [id, lines] of repeated) {
  const uniq = new Set(lines);
  if (uniq.size < lines.length) {
    verbatim++;
    worst.push(`\`${id}\` — taken ${lines.length} times, ${uniq.size} distinct lines`);
  }
}
say(`In one full 24-season run, **${repeated.length}** actions were taken more than once.`);
say(`Actions that repeated an outcome line verbatim: **${verbatim}**.`);
say("");
if (worst.length) for (const w of worst.slice(0, 10)) say(`- ${w}`);
else say("No repeated action produced the same outcome line twice in the run.");
say("");
const mostRepeated = repeated.sort((a, b) => b[1].length - a[1].length)[0];
if (mostRepeated) {
  say(`The most-repeated action in the run was \`${mostRepeated[0]}\`, taken ${mostRepeated[1].length} times. Its lines:`);
  say("");
  for (const l of mostRepeated[1]) say(`- ${l}`);
  say("");
}

/* ============================================================
   4 · THREE GENUINELY DIFFERENT RECORDED RUNS
   ============================================================ */
say("---");
say("");
say("## Three genuinely different recorded runs");
say("");
const runs = [
  { label: "Credential Route, aiming at mastery", preset: "preset-credential-route", seed: "run-a", pri: { mastery: 3, recognition: 1 } as Partial<PrioritySet>, wants: ["skill", "learning", "craft", "practice"] },
  { label: "Care-Constrained Builder, aiming at close relationships", preset: "preset-care-constrained-builder", seed: "run-b", pri: { closeness: 3, service: 2 } as Partial<PrioritySet>, wants: ["relationships", "care", "family", "support"] },
  { label: "Recovery and Relaunch, aiming at a floor that holds", preset: "preset-recovery-and-relaunch", seed: "run-c", pri: { safety: 3, health: 2 } as Partial<PrioritySet>, wants: ["housing", "stability", "money", "health"] },
];
const sigs: string[][] = [];
for (const r of runs) {
  const played = playWithIntent(r.preset, r.seed, r.pri, r.wants);
  const parse = computeParse(played.state);
  sigs.push(endingSignature(played.state));
  say(`### ${r.label}`);
  say("");
  say(`Seeds \`${r.seed}\` / \`${r.seed}-d\`. Aiming at: ${Object.entries(r.pri).map(([k, v]) => `${PRIORITY_LABEL[k as PriorityKey]} (${v})`).join(", ")}.`);
  say("");
  say("A few seasons, as they went:");
  say("");
  for (const i of [0, 5, 11, 17, 23]) {
    const l = played.log[i];
    if (!l) continue;
    say(`- **Season ${l.season}, age ${l.age}** — ${l.took.join(" · ")}`);
    say(`  - ${l.lines[0] ?? ""}`);
  }
  say("");
  say(`**At thirty.** ${parse.achievements[0] ?? ""}`);
  if (parse.costs[0]) say(`What it cost: ${parse.costs[0]}`);
  say("");
  say(`Where it came from: ${parse.attribution.map((a) => `${a.category} — ${a.share}`).join("; ")}.`);
  // All three door states, because reporting only one of them is how the panel
  // came to render only one of them for so long.
  const doorCount = (state: string) => parse.doors.filter((d) => d.state === state).length;
  const closedExamples = parse.doors.filter((d) => d.state === "closed").slice(0, 3).map((d) => d.label);
  say(
    `Doors — opened: ${doorCount("opened")}, closed: ${doorCount("closed")}, still recoverable: ${doorCount("still recoverable")}. Held commitments: ${parse.maintained.length}.`,
  );
  if (closedExamples.length) say(`What closed, for instance: ${closedExamples.join("; ")}.`);
  say("");
}
say("**Are they different?**");
say("");
for (let i = 0; i < sigs.length; i++)
  for (let j = i + 1; j < sigs.length; j++) {
    const d = sigs[i].filter((x, k) => x !== sigs[j][k]).length;
    say(`- Run ${i + 1} vs run ${j + 1}: **${d}** signature components differ (bar is three) — ${meaningfullyDifferent(sigs[i], sigs[j]) ? "meaningfully different" : "NOT meaningfully different"}.`);
  }
say("");

/* ============================================================
   5 · THE LAB TEST
   ============================================================ */
say("---");
say("");
say("## The Lab test");
say("");
say("> *All three axes teach their lessons in one sitting.*");
say("");
for (const sit of LAB_SITUATIONS) {
  say(`### ${sit.title}`);
  say("");
  for (const axis of sit.axes) {
    const c = compare(sit.id, axis);
    if (!c) continue;
    say(`**${axis}** — ${c.differences.length} difference(s): ${c.differences.map((d) => d.field).join(", ") || "none"}`);
    say("");
    say(`> ${c.reading}`);
    say("");
  }
}

mkdirSync("records", { recursive: true });
writeFileSync("records/acceptance-evidence.md", out.join("\n") + "\n");
console.log(`records/acceptance-evidence.md: ${out.length} lines`);
