/**
 * The C suite — the consolidation's automated gates (blueprint 6.0 §8).
 *
 * Run: npm run gates:consolidation   (needs `npm run build` first for rendered halves)
 *
 * One entry per C-gate, registered here from batch 0 and reporting N/A until the
 * batch that gives it a subject lands (the 4.0/5.0 pattern). A GATE IS NOT A CHECK
 * UNTIL IT HAS BEEN SHOWN TO FAIL: every gate marked "probe" below gets a
 * plant-and-restore case in tests/falsify-walls.sh; every gate marked "record" has
 * its proven-red run pasted into DECISIONS.md section 8 under the batch that built it.
 *
 * Output format is `[PASS|FAIL|N/A] Gate C-N: name` so a probe can name a gate
 * without colliding with the static or T-suite numbering.
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT, OUT_DIR } from "./util.ts";
import { HOTLINE_GROUPS, NATIONS, UK_NATIONS, hotlineRegions } from "../content/hotlines.ts";

export type CGateResult = { pass: boolean; details: string[] };

export type CGate = {
  id: number;
  row: string;
  name: string;
  proof: "probe" | "record";
  /** Returns null while the subject does not exist yet (reported N/A). */
  run: () => CGateResult | null;
};

const NA = (): CGateResult | null => null;

const read = (rel: string): string => readFileSync(join(ROOT, rel), "utf8");

/* =========================================================================
   C-1 (N-226) — a write whose readback differs, throws, or is refused never
   reports `saved`, and the UI renders the returned status.
   =========================================================================
   The substance is a unit harness, because the failure is a storage layer that
   cannot fail and no rendered artifact shows that: tests/save-status-harness.ts
   drives the real persistence functions against a stubbed localStorage that
   throws, refuses, and lies. It was run against the PRE-N-226 code first and
   went red on every case (the old `saveRun` returned no status at all).

   The two structural halves here are the ones a harness cannot see: that no new
   storage key was added (§7.1), and that the save UI renders the RETURNED status
   rather than a fixed sentence.
   ========================================================================= */
function c1(): CGateResult | null {
  const storage = read("lib/storage.ts");
  if (!storage.includes("writeVerified")) return null;
  const details: string[] = [];
  const fails: string[] = [];

  // 1. Seven states, and exactly seven. The WORDS are latitude (§11); the number
  //    of distinct states is not, so the count is asserted as well as the members.
  const SEVEN = ["saved", "memory-only", "blocked", "full", "malformed-quarantined", "migrated", "unresumable"];
  const typeBody = storage.slice(storage.indexOf("export type SaveStatus"), storage.indexOf("SAVE_STATUS_WORDS"));
  const members = [...typeBody.matchAll(/\|\s*"([a-z-]+)"/g)].map((m) => m[1]);
  for (const w of SEVEN)
    if (!members.includes(w))
      fails.push(`lib/storage.ts: SaveStatus does not carry the state "${w}" (it carries [${members.join(", ")}])`);
  if (members.length !== 7)
    fails.push(`lib/storage.ts: SaveStatus has ${members.length} states, not seven: [${members.join(", ")}]`);

  // 2. NO NEW STORAGE KEY (§7.1). The quarantine is a derived suffix.
  const keyBlock = storage.slice(storage.indexOf("export const STORAGE_KEYS"), storage.indexOf("} as const;"));
  const keyCount = [...keyBlock.matchAll(/^\s+\w+:\s*"tgtl:/gm)].length;
  if (keyCount !== 13)
    fails.push(`lib/storage.ts: STORAGE_KEYS has ${keyCount} entries; 6.0 §7.1 says it is unchanged at thirteen`);
  if (!/ALL_STORAGE_KEYS[\s\S]{0,220}quarantineKeyFor/.test(storage))
    fails.push("lib/storage.ts: ALL_STORAGE_KEYS does not derive the quarantine keys — the erase control would leave them behind");

  // 3. THE UI RENDERS THE RETURNED STATUS. The bug this row fixes is a notice
  //    that said "Saved to this device." whatever the write did.
  for (const rel of ["components/sim/CampaignApp.tsx", "components/play/Playthrough.tsx"]) {
    const src = read(rel);
    if (!src.includes("SAVE_STATUS_WORDS"))
      fails.push(`${rel}: the save UI does not render the status the write returned`);
    if (/setNotice\("Saved to this device\."\)|setArcNotice\(`Saved as "\$\{save\.label\}"\.`\)(?!\s*:)/.test(src))
      fails.push(`${rel}: still announces a save unconditionally, without reading the returned status`);
  }

  // 4. THE HARNESS. The substance of the gate.
  const r = spawnSync("npx", ["tsx", "tests/save-status-harness.ts"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: true,
  });
  const out = `${r.stdout ?? ""}${r.stderr ?? ""}`.trim();
  if (r.status !== 0) {
    fails.push("tests/save-status-harness.ts FAILED:");
    for (const line of out.split("\n").filter((l) => l.includes("FAIL"))) fails.push(`  ${line.trim()}`);
  } else {
    details.push(`tests/save-status-harness.ts: ${out.split("\n").filter((l) => l.includes("  ok ")).length} save-status cases pass`);
  }
  if (fails.length) return { pass: false, details: fails };
  details.push("lib/storage.ts: the seven states, no new storage key, quarantine keys derived for the erase control");
  details.push("the save UI in the campaign and the arc renders the status the write returned, in words");
  return { pass: true, details };
}

/* =========================================================================
   C-2 (N-190) — no rendered failure-mode line appears without its record's
   tied recovery route in the same drawer.
   =========================================================================
   The explain drawer is client-only, so the exported HTML in out/ never carries
   it and cannot answer this; what decides it is the component's structure. The
   assertion: every `data-sim-failure-mode` element sits inside a block that also
   renders `data-sim-recovery-route`, and that block's guard names the very list
   the recovery routes are mapped from — so the two cannot be rendered apart.

   Plant that proves it: remove the recovery render, keep the failure line.
   ========================================================================= */
function c2(): CGateResult | null {
  const rel = "components/sim/CampaignApp.tsx";
  const src = read(rel);
  if (!src.includes("data-sim-failure-mode")) return null;
  const fails: string[] = [];
  const lineOf = (i: number): number => src.slice(0, i).split("\n").length;

  for (const m of src.matchAll(/data-sim-failure-mode/g)) {
    const at = m.index ?? 0;
    const open = src.lastIndexOf("<section", at);
    const close = src.indexOf("</section>", at);
    if (open < 0 || close < 0) {
      fails.push(`${rel}:${lineOf(at)} — a failure-mode line renders outside any section, so nothing binds it to a recovery route`);
      continue;
    }
    const block = src.slice(open, close);
    if (!block.includes("data-sim-recovery-route")) {
      fails.push(
        `${rel}:${lineOf(at)} — a failure mode renders with NO tied recovery route in the same drawer block. §3.4's tie is beside the failure, never instead of it.`,
      );
      continue;
    }
    // The guard above the block must name the list the routes come from, so a
    // failure mode cannot render when that list is empty. The identifier is read
    // out of the block itself rather than hardcoded, so renaming it does not
    // quietly disarm the check.
    const before = block.slice(0, block.indexOf("data-sim-recovery-route"));
    const maps = [...before.matchAll(/\{(\w+)(?:\.\w+\([^)]*\))*\.map\(/g)];
    const routeList = maps.length ? maps[maps.length - 1][1] : null;
    const guard = src.slice(Math.max(0, open - 400), open);
    if (!routeList)
      fails.push(
        `${rel}:${lineOf(at)} — the recovery routes in this block are not rendered from a list the gate can name, so it cannot check the guard`,
      );
    else if (!guard.includes(routeList))
      fails.push(
        `${rel}:${lineOf(at)} — the block renders a recovery route from \`${routeList}\`, but the guard above it does not require \`${routeList}\` to have anything in it: a failure mode would render alone the moment the tie came back empty`,
      );
  }
  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `${rel}: every failure-mode element renders inside a block that also renders its tied recovery route, guarded on both`,
    ],
  };
}

/* =========================================================================
   C-3 (N-191) — every option whose action carries `switchingCost` renders it.
   =========================================================================
   The rendered half is a browser assertion in tests/browser-gates.mjs, walked on
   the campaign's allocate screen (proven red by renaming the attribute). This
   half asserts the only thing that makes the rendered half complete: the card
   renders the field UNCONDITIONALLY on its presence, so there is no action
   carrying one that the card can skip.
   ========================================================================= */
function c3(): CGateResult | null {
  const rel = "components/sim/CampaignApp.tsx";
  const src = read(rel);
  if (!src.includes("data-sim-switching-cost")) return null;
  const card = src.slice(src.indexOf("function ActionCard("), src.indexOf("function EventScreen("));
  const fails: string[] = [];
  if (!card.includes("data-sim-switching-cost"))
    fails.push(`${rel}: the switching cost does not render on the action card`);
  if (!/\{a\.contract\.switchingCost \?[\s\S]{0,400}\{a\.contract\.switchingCost\}[\s\S]{0,120}: null\}/.test(card))
    fails.push(
      `${rel}: the action card does not render \`contract.switchingCost\` on presence alone — an action carrying one could render without it`,
    );
  if (!card.includes("opportunityNote"))
    fails.push(`${rel}: the switching cost is not on the card that carries the opportunity note (§3.9's landing)`);
  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [`${rel}: the action card renders contract.switchingCost beside opportunityNote whenever the action carries one`],
  };
}

/* =========================================================================
   C-4 (N-260) — no rendered region label is broader than the coverage inside
   it, and every UK nation and Ireland has its own verified abuse line.
   =========================================================================
   The trunk shipped England's domestic-abuse line labelled "United Kingdom".
   `regions` is derived from `coverage` now, so the first half is a check that
   the derivation cannot re-widen a label: no nation may be NAMED in a record's
   rendered label that is not in that record's coverage, and "United Kingdom"
   may be printed only when all four of its nations are covered.

   The second half is the row itself: within the abuse group, each of the four
   UK nations and Ireland is covered by exactly one line, and that line covers
   that nation alone — so no reader is sent to a service another nation runs.

   Plant that proves it: put Scotland into the England line's coverage.
   ========================================================================= */
function c4(): CGateResult | null {
  const fails: string[] = [];
  const details: string[] = [];
  const uk = UK_NATIONS as readonly string[];

  for (const group of HOTLINE_GROUPS) {
    for (const h of group.hotlines) {
      if (!h.coverage?.length) {
        fails.push(`${h.id}: no coverage — a number with no recorded reach cannot be labelled at all`);
        continue;
      }
      const label = hotlineRegions(h);
      // Longest name first, consuming each match, so the "Ireland" inside
      // "Northern Ireland" is not counted as a claim about the Republic.
      let residue = label;
      for (const n of [...NATIONS].sort((a, b) => b.length - a.length)) {
        const re = new RegExp(`(^|[^A-Za-z])${n}([^A-Za-z]|$)`);
        if (!re.test(residue)) continue;
        residue = residue.split(n).join(" ");
        if (!h.coverage.includes(n))
          fails.push(`${h.id}: the rendered label "${label}" names ${n}, which is not in its coverage`);
      }
      if (/United Kingdom/.test(label) && !uk.every((n) => (h.coverage as string[]).includes(n)))
        fails.push(
          `${h.id}: the rendered label "${label}" says United Kingdom while covering only [${h.coverage.join(", ")}] — this is the England-only defect N-260 exists to fix`,
        );
    }
  }

  const abuse = HOTLINE_GROUPS.find((g) => g.id === "hurting-controlling");
  if (!abuse) fails.push("no abuse group in the fixture");
  else {
    for (const nation of [...uk, "Ireland"]) {
      const lines = abuse.hotlines.filter((h) => (h.coverage as string[]).includes(nation));
      if (!lines.length) {
        fails.push(`the abuse group has no line covering ${nation}`);
        continue;
      }
      if (lines.length > 1)
        fails.push(
          `${nation} appears in ${lines.length} abuse lines (${lines.map((l) => l.id).join(", ")}) — a reader cannot be told which of two services is theirs`,
        );
      for (const l of lines)
        if (l.coverage.length !== 1)
          fails.push(
            `${l.id}: covers [${l.coverage.join(", ")}] — a UK-nation or Ireland abuse line covers that nation alone, because each nation runs its own service`,
          );
    }
  }
  if (fails.length) return { pass: false, details: fails };
  details.push(
    `every rendered region label is derived from coverage and names no nation absent from it (${HOTLINE_GROUPS.reduce((n, g) => n + g.hotlines.length, 0)} records)`,
  );
  details.push(
    `abuse group: ${[...uk, "Ireland"].map((n) => `${n} → ${abuse!.hotlines.find((h) => (h.coverage as string[]).includes(n))!.id}`).join(" · ")}`,
  );
  return { pass: true, details };
}

/* =========================================================================
   C-5 (N-160) — the map's sex lens changes nothing, or every difference cites
   a source.
   =========================================================================
   The three lens settings must render BYTE-IDENTICAL stage content. The lens is
   a client control, so the rendered export in out/ only ever carries the
   "shared" view and cannot answer the question; the thing that decides it is
   whether the component branches on the lens value at all. So the assertion is
   over the source, structurally: inside the JSX, `sexLens` may be read ONLY by
   the control that sets it and by the note that explains it, and any other
   branch on it must carry a `data-source` that resolves to a URL recorded in
   records/research-pipeline.md.

   Plant that proves it: introduce an unsourced difference under one lens.
   ========================================================================= */
function c5(): CGateResult | null {
  const rel = "components/Roadmap.tsx";
  const src = read(rel);
  const returnAt = src.indexOf("\n  return (");
  if (returnAt < 0) return { pass: false, details: [`${rel}: could not find the component's JSX; the gate cannot read it`] };
  const lines = src.slice(returnAt + 1).split("\n");
  const pipeline = read("records/research-pipeline.md");

  // The lens CONTROL: the group that sets the value. Its own reads are sanctioned.
  const ctlOpen = lines.findIndex((l) => l.includes('className="roadmap-lens"'));
  let ctlClose = -1;
  if (ctlOpen >= 0) {
    const rest = lines.slice(ctlOpen).findIndex((l, i) => i > 0 && l.trim() === "</div>");
    ctlClose = rest < 0 ? -1 : ctlOpen + rest;
  }
  // The NOTE: the sentence that says the lens changes nothing. Its guard is the
  // line or two immediately above it.
  const noteLines = lines.flatMap((l, i) => (l.includes("roadmap-lens-note") ? [i] : []));

  const sanctioned = (i: number): boolean => {
    if (ctlOpen >= 0 && ctlClose >= 0 && i >= ctlOpen && i <= ctlClose) return true;
    return noteLines.some((n) => i >= n - 2 && i <= n);
  };

  const details: string[] = [];
  const offenders: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].includes("sexLens")) continue;
    if (sanctioned(i)) continue;
    // A difference is allowed only if it cites a source, and the source resolves.
    const window = lines.slice(Math.max(0, i - 8), i + 9).join("\n");
    const cited = [...window.matchAll(/data-source="([^"]+)"/g)].map((m) => m[1]);
    if (!cited.length) {
      offenders.push(
        `${rel}:${i + 1} — the stage content branches on the sex lens with no data-source: ${lines[i].trim()}`,
      );
      continue;
    }
    for (const c of cited)
      if (!pipeline.includes(c))
        offenders.push(`${rel}:${i + 1} — data-source "${c}" resolves to no retrieval in records/research-pipeline.md`);
  }
  if (offenders.length) return { pass: false, details: offenders };
  if (!noteLines.length)
    return {
      pass: false,
      details: [`${rel}: no .roadmap-lens-note — a control that changes nothing must say so where it is used.`],
    };
  details.push(
    `${rel}: the sex lens is read only by its own control and by the note that explains it — the stage content below it is identical under shared, female and male.`,
  );
  return { pass: true, details };
}

export const GATES: CGate[] = [
  { id: 1, row: "N-226", name: "A failed or unverified write never reports saved", proof: "record", run: c1 },
  { id: 2, row: "N-190", name: "A rendered failure mode carries its tied recovery route", proof: "probe", run: c2 },
  { id: 3, row: "N-191", name: "Every switchingCost renders on its option card", proof: "record", run: c3 },
  { id: 4, row: "N-260", name: "No region label broader than verified coverage", proof: "probe", run: c4 },
  { id: 5, row: "N-160", name: "The map lens settings render identical content or cite a source", proof: "probe", run: c5 },
  { id: 6, row: "N-263", name: "Double-Escape exits every set-down route", proof: "record", run: NA },
  { id: 7, row: "N-267", name: "Every fixture region has a SAFETY_SOURCES entry, dated", proof: "probe", run: NA },
  { id: 8, row: "N-268", name: "The safety check precedes every ordering", proof: "probe", run: NA },
  { id: 9, row: "N-272", name: "Set-down lint carries no evidence-label word", proof: "probe", run: NA },
  { id: 10, row: "N-273", name: "No caring-duty record names a companion or condition", proof: "probe", run: NA },
  { id: 11, row: "N-192", name: "One draw-vary pair renders the same-outcome reading", proof: "probe", run: NA },
  { id: 12, row: "N-194", name: "Repeat-last-season commits an ordered set and replays byte-identical", proof: "record", run: NA },
  { id: 13, row: "N-195", name: "Methodology names the Lab seed curation tool and criterion", proof: "probe", run: NA },
  { id: 14, row: "N-204", name: "Every season screen carries its origin motif", proof: "record", run: NA },
  { id: 15, row: "N-211", name: "No option renders without the five contract fields", proof: "probe", run: NA },
  { id: 16, row: "N-212", name: "previewAction is pure", proof: "probe", run: NA },
  { id: 17, row: "N-213", name: "Upkeep is present and affordable in the worst envelope", proof: "probe", run: NA },
  { id: 18, row: "N-214", name: "The narrowing door state never uses the open token", proof: "probe", run: NA },
  { id: 19, row: "N-233", name: "No valence colour pair; no forbidden-register term in Game Guide", proof: "probe", run: NA },
  { id: 20, row: "N-216", name: "A reopened season renders its stored explanation", proof: "record", run: NA },
  { id: 21, row: "N-218", name: "The empty queue states that uncertainty remains", proof: "probe", run: NA },
  { id: 22, row: "N-225", name: "Every Lab situation declares an unknown before the branches", proof: "probe", run: NA },
  { id: 23, row: "N-228", name: "Every SimState field the engine reads has a mid-run surface", proof: "probe", run: NA },
  { id: 24, row: "N-235", name: "No Try-in-Play link on a set-down route", proof: "probe", run: NA },
  { id: 25, row: "N-355", name: "Every parse panel declares recorded / interpreted / unknowable", proof: "probe", run: NA },
  { id: 26, row: "N-001", name: "/orientation renders JS-off with no game term in Standard", proof: "probe", run: NA },
  { id: 27, row: "N-012", name: "Every route and milestone page is in the search index; anchors resolve", proof: "probe", run: NA },
  { id: 28, row: "N-023", name: "Getting-through-today: no analytical framing, no instrument link above the fold", proof: "probe", run: NA },
  { id: 29, row: "N-025", name: "No research construct attributed without an evidence record", proof: "probe", run: NA },
  { id: 30, row: "N-041", name: "The conflict section carries no recommendation verb", proof: "probe", run: NA },
  { id: 31, row: "N-111", name: "Every concept cell links the route that owns the mechanism", proof: "probe", run: NA },
  { id: 32, row: "N-320", name: "Every NextStep carries a relation from the closed list and a why", proof: "probe", run: NA },
  { id: 33, row: "N-321", name: "The single-home invariant renders on every topic route", proof: "probe", run: NA },
  { id: 34, row: "N-326", name: "The term marker never renders in Standard or on set-down routes", proof: "probe", run: NA },
  { id: 35, row: "N-329", name: "No comic-register route is set-down or loss-adjacent", proof: "probe", run: NA },
  { id: 36, row: "N-072", name: "Every classifying surface offers a rejection honoured in rendering", proof: "probe", run: NA },
  { id: 37, row: "N-074", name: "The export path issues no network request", proof: "record", run: NA },
  { id: 38, row: "N-077", name: "Every planned task declares a stop condition", proof: "probe", run: NA },
  { id: 39, row: "N-080", name: "No ranked output without objective, constraints and horizon above it", proof: "probe", run: NA },
  { id: 40, row: "N-091", name: "No sim token or class on the daily plan", proof: "probe", run: NA },
  { id: 41, row: "N-093", name: "Every comparison closes with the no-winner panel", proof: "probe", run: NA },
  { id: 42, row: "N-150", name: "Position produces no rank, band or comparison and never enters a URL", proof: "probe", run: NA },
  { id: 43, row: "N-170", name: "Every placement belongs to a named objective; changing it changes the board", proof: "probe", run: NA },
  { id: 44, row: "N-171", name: "No placement renders without the ruleset header", proof: "probe", run: NA },
  { id: 45, row: "N-281", name: "Disanalogy entries and their inheriting routes resolve both ways", proof: "probe", run: NA },
  { id: 46, row: "N-290", name: "The retractions register renders when empty", proof: "probe", run: NA },
  { id: 47, row: "N-291", name: "A page changed by a logged correction renders a revision note", proof: "probe", run: NA },
  { id: 48, row: "N-296", name: "Every new route records what it changes", proof: "probe", run: NA },
  { id: 49, row: "N-301", name: "Every perishable route renders a stamp and review date", proof: "probe", run: NA },
  { id: 50, row: "N-302", name: "Planned badges and WHATS_COMING ids match both ways", proof: "probe", run: NA },
  { id: 51, row: "N-306", name: "A pre-existing saved library survives a suite run byte-identical", proof: "record", run: NA },
];

if (!existsSync(OUT_DIR)) {
  console.error("out/ not found. Run `npm run build` first.");
  process.exit(2);
}

let failed = 0;
let na = 0;
for (const g of GATES) {
  const r = g.run();
  const tag = r === null ? "N/A " : r.pass ? "PASS" : "FAIL";
  console.log(`[${tag}] Gate C-${g.id}: ${g.name} (${g.row})`);
  if (r) for (const d of r.details) console.log(`       ${d}`);
  if (r === null) na++;
  else if (!r.pass) failed++;
}
console.log("\n" + "=".repeat(60));
if (failed === 0) {
  console.log(`C SUITE: ${GATES.length - na} substantive gate(s) pass, ${na} N/A`);
  process.exit(0);
} else {
  console.log(`${failed} C GATE(S) FAILED`);
  process.exit(1);
}
