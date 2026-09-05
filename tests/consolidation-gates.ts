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
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT, OUT_DIR, containsPhrase, textOf } from "./util.ts";
import { HOTLINE_GROUPS, NATIONS, UK_NATIONS, hotlineRegions, ALL_HOTLINES } from "../content/hotlines.ts";
import { SETDOWN_FORBIDDEN_TERMS, TERMS } from "../content/terminology.ts";
import { STATUS_LABEL } from "../content/evidence.ts";
import { ROUTES, SETDOWN_ROUTES, LOSS_ADJACENT_ROUTES } from "../content/routes.ts";
import { DISANALOGIES, CORRECTIONS, RETRACTIONS, WHATS_COMING } from "../content/methodology.ts";
import { CONCEPTS, CONCEPT_COLUMNS } from "../content/concepts.ts";
import { TIER_OBJECTIVES, ARCHETYPES, TIER_NOT_MEASURED } from "../content/history.ts";
import { TIMELINE_MILESTONE_ROUTES } from "../content/timeline/generated/routes.ts";

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

/** The exported HTML for a route, or null when the build has not made it. */
const readOut = (route: string): string | null => {
  const file = join(OUT_DIR, route.replace(/^\//, ""), "index.html");
  return existsSync(file) ? readFileSync(file, "utf8") : null;
};

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

/* =========================================================================
   C-6 (N-263) — double-Escape triggers the quick exit on every set-down route.
   =========================================================================
   The substance is the BROWSER assertion in tests/browser-gates.mjs, which
   presses Escape twice on every route in SETDOWN_ROUTES and requires the page to
   leave the origin (a "record" gate; its proven red is a route omitted from the
   handler). This half asserts the three things a browser walk cannot see:

   1. the handler's routes are DERIVED from content/routes.ts, never hand-listed —
      a hand-list is exactly how a route loses its exit the day the inventory grows;
   2. the listener is attached only where the route is set-down and removed again
      on a route change (the effect's cleanup, with the route in its deps);
   3. the keyboard exit and the visible "Leave this page" control go through ONE
      navigation, so the two can never drift apart.
   ========================================================================= */
function c6(): CGateResult | null {
  const rel = "components/SiteChrome.tsx";
  const src = read(rel);
  const escAt = src.indexOf('"Escape"');
  if (escAt < 0) return null;
  const fails: string[] = [];

  // 1. Derived, never hand-listed.
  if (!/isSetDownRoute|SETDOWN_ROUTES/.test(src))
    fails.push(
      `${rel}: the double-Escape handler does not derive its routes from content/routes.ts — a hand-written list is how a set-down route loses its keyboard exit the day the inventory grows`,
    );

  // 2. The effect that owns the listener.
  const effAt = src.lastIndexOf("useEffect(", escAt);
  const depAt = src.indexOf("}, [", escAt);
  const effect = effAt >= 0 && depAt > effAt ? src.slice(effAt, src.indexOf("\n", depAt)) : "";
  const deps = depAt > 0 ? src.slice(depAt + 4, src.indexOf("]", depAt)) : "";
  if (!effect)
    fails.push(`${rel}: the Escape handler is not inside a useEffect the gate can read`);
  else {
    if (!effect.includes("addEventListener") || !effect.includes("removeEventListener"))
      fails.push(
        `${rel}: the Escape listener is added without a cleanup that removes it — it would survive a route change and fire on a page that has no quick exit`,
      );
    if (!/setDown|isSetDownRoute/.test(effect))
      fails.push(
        `${rel}: the Escape listener is attached without checking that the route is set-down (§5.3: double-Escape belongs to the set-down routes, not to the whole site)`,
      );
    if (!/\broute\b/.test(deps) && !/\bsetDown\b/.test(deps))
      fails.push(
        `${rel}: the Escape effect does not re-run on a route change (deps "[${deps.trim()}]"), so the listener cannot follow the reader off a set-down page`,
      );
    // 3. One navigation, shared with the visible control.
    const called = [...effect.matchAll(/(\w+)\(\s*\)/g)].map((m) => m[1]);
    const exits = called.filter((id) => {
      const at = src.indexOf(`function ${id}(`);
      return at >= 0 && /location\.replace\(/.test(src.slice(at, at + 600));
    });
    if (!exits.length)
      fails.push(
        `${rel}: the Escape handler does not call the same navigation the visible control uses — the keyboard exit and "Leave this page" would be two exits that can drift apart`,
      );
    else {
      const onClick = /className="quick-exit"[\s\S]{0,400}?onClick=\{(\w+)\}/.exec(src);
      if (!onClick) fails.push(`${rel}: the visible quick-exit control has no onClick the gate can follow`);
      else {
        const at = src.indexOf(`function ${onClick[1]}(`);
        const body = at >= 0 ? src.slice(at, at + 600) : "";
        if (!exits.some((e) => body.includes(`${e}(`)))
          fails.push(
            `${rel}: "Leave this page" (${onClick[1]}) and the Escape handler do not share a navigation — one can be fixed and the other left broken`,
          );
      }
    }
  }

  // 4. The note claims the behaviour, and claims it only where the control renders.
  const noteAt = src.indexOf("quick-exit-note");
  const note = noteAt >= 0 ? src.slice(noteAt, src.indexOf("</p>", noteAt)) : "";
  if (!/Escape twice/i.test(note))
    fails.push(
      `${rel}: the .quick-exit-note does not tell the reader that pressing Escape twice also leaves the page`,
    );

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `${rel}: the Escape listener is derived from SETDOWN_ROUTES (${SETDOWN_ROUTES.length} routes), attached only on a set-down route, removed on route change, and shares one navigation with the visible control`,
      "the rendered half — Escape ×2 leaves the origin on every set-down route — is the browser assertion in tests/browser-gates.mjs",
    ],
  };
}

/* =========================================================================
   C-7 (N-267) — every fixture region has a SAFETY_SOURCES.md entry, dated.
   =========================================================================
   A hotline record's most load-bearing field is who it actually serves. The
   fixture stores that as `coverage`; SAFETY_SOURCES.md is the standing prose
   record of what was checked for each of those regions, on which page, with the
   scope caveats and the fallback state. The gate ties them: every region any
   record claims has a heading in the record, with a checked date not older than
   that record's own `lastVerified`, and the maintenance rule is STATED rather
   than implied.

   Plant that proves it: take one nation's heading out of SAFETY_SOURCES.md.
   ========================================================================= */
function c7(): CGateResult | null {
  const rel = "SAFETY_SOURCES.md";
  if (!existsSync(join(ROOT, rel))) return null;
  const doc = read(rel);
  const fails: string[] = [];

  const checked = new Map<string, string>();
  let current: string | null = null;
  for (const line of doc.split("\n")) {
    const h = /^##\s+(.+?)\s*$/.exec(line);
    if (h) {
      current = h[1];
      continue;
    }
    const d = /^-\s*Checked:\s*(\d{4}-\d{2}-\d{2})\s*$/.exec(line);
    if (d && current && !checked.has(current)) checked.set(current, d[1]);
  }

  for (const h of ALL_HOTLINES) {
    for (const region of h.coverage) {
      const date = checked.get(region);
      if (!date) {
        fails.push(
          `${rel}: no "## ${region}" entry with a Checked date, but ${h.id} (${h.contact}) claims to cover ${region} — a number whose reach is in no standing record cannot be re-read before a release (N-267)`,
        );
        continue;
      }
      if (date < h.lastVerified)
        fails.push(
          `${rel}: "## ${region}" was checked ${date}, older than ${h.id}'s lastVerified ${h.lastVerified} — the record is behind the fixture it exists to vouch for`,
        );
    }
  }

  const RULES: [string, RegExp][] = [
    ["a routing or label change is not a re-verification", /is not a re-?verification/i],
    ["a region that cannot be verified leaves the fixture and shows the directory fallback", /cannot be verified[\s\S]{0,240}fallback/i],
    ["the record is re-read before a release", /re-?read[\s\S]{0,60}release/i],
  ];
  for (const [what, re] of RULES)
    if (!re.test(doc)) fails.push(`${rel}: the maintenance rule does not state that ${what}`);

  if (!read("content/hotlines.ts").includes("SAFETY_SOURCES.md"))
    fails.push(
      "content/hotlines.ts: the fixture does not name the standing record, so a maintainer editing a number never learns it exists",
    );

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `${rel}: ${checked.size} region entries cover every coverage value in ${ALL_HOTLINES.length} fixture records, each dated no older than the record it vouches for`,
      "the maintenance rule is stated: a routing or label change is not a re-verification; an unverifiable region shows the directory fallback; the record is re-read before a release",
    ],
  };
}

/* =========================================================================
   C-8 (N-268) — the safety check precedes every ordering.
   =========================================================================
   6.0 §5.5: every instrument that orders, ranks or reads checks the crisis route
   BEFORE the ordering runs. `content/board.ts` has had that shape since 3.0; it
   was a convention in one place, not a rule the other instruments inherited.

   The assertion is source order inside the component body — the crisis gate is
   reached before the ranking or reading function is ever called — plus the shape
   of the gate itself: it routes by link to the record's own route and records
   nothing (the triage pattern), so choosing it cannot become a rateable input.

   Plant that proves it: move the crisis block below the ordering call.
   ========================================================================= */
const ORDERING_INSTRUMENTS: { rel: string; orderingFn: string }[] = [
  { rel: "components/Guidance.tsx", orderingFn: "rankPlans" },
  { rel: "components/Board.tsx", orderingFn: "computeReading" },
];

function c8(): CGateResult | null {
  const fails: string[] = [];
  const details: string[] = [];

  for (const { rel, orderingFn } of ORDERING_INSTRUMENTS) {
    const src = read(rel);
    const bodyAt = src.indexOf("\nexport function ");
    if (bodyAt < 0) {
      fails.push(`${rel}: no exported component for the gate to read`);
      continue;
    }
    const body = src.slice(bodyAt);
    const lineOf = (i: number): number => src.slice(0, bodyAt + i).split("\n").length;
    const orderAt = body.indexOf(`${orderingFn}(`);
    const crisisAt = body.indexOf("CRISIS_CHIPS");
    if (orderAt < 0) {
      fails.push(`${rel}: ${orderingFn}() is never called — the gate is reading the wrong instrument`);
      continue;
    }
    if (crisisAt < 0) {
      fails.push(
        `${rel}: ${orderingFn}() is called at line ${lineOf(orderAt)} and the crisis routes (CRISIS_CHIPS) are never reached in this component — an instrument that orders or reads must check the safety route first (6.0 §5.5, N-268)`,
      );
      continue;
    }
    if (crisisAt > orderAt) {
      fails.push(
        `${rel}: the crisis gate is at line ${lineOf(crisisAt)} but ${orderingFn}() has already run at line ${lineOf(orderAt)} — a favourable reading is computed before the safety route is offered (6.0 §5.5, N-268)`,
      );
      continue;
    }
    const aOpen = body.lastIndexOf("<aside", crisisAt);
    const aClose = body.indexOf("</aside>", crisisAt);
    const block = aOpen >= 0 && aClose > aOpen ? body.slice(aOpen, aClose) : "";
    if (!block) {
      fails.push(`${rel}: the crisis gate is not a self-contained <aside> the gate can read`);
      continue;
    }
    if (!/href=\{[\w.]*\.route\}/.test(block))
      fails.push(
        `${rel}: the crisis gate does not send the reader to the record's own route — the triage pattern is a plain link, so it works with JavaScript off`,
      );
    if (/onClick|writeJSON|readJSON|localStorage|setInputs|setSel/.test(block))
      fails.push(
        `${rel}: the crisis gate records or handles the choice instead of leaving for the route — choosing it must never become an input (§4 safety clause, 6.0 §5.5)`,
      );
    details.push(
      `${rel}: the crisis gate (line ${lineOf(crisisAt)}) precedes ${orderingFn}() (line ${lineOf(orderAt)}) and routes by link, recording nothing`,
    );
  }

  if (!/favourable reading never overrides a safety route/i.test(read("content/exclusions.ts")))
    fails.push(
      "content/exclusions.ts: the N-268 doctrine is not stated beside the lists it governs — the rule the instruments inherit lives nowhere the next author reads",
    );
  if (!/checklist|charter/i.test(read("content/board.ts")))
    fails.push("content/board.ts: the board's safety clause does not cite the published checklist (N-430)");

  if (fails.length) return { pass: false, details: fails };
  details.push("content/exclusions.ts: the doctrine is stated where the tier lists are defined");
  return { pass: true, details };
}

/* =========================================================================
   C-9 (N-272) — a set-down route may render an evidence label and may not
   render a game term.
   =========================================================================
   The two prohibitions are different in kind and collapsing them is expensive:
   on a bereavement page the evidence apparatus is what marks a folk model as
   folk belief, and that correction is exactly what a bereaved reader is owed.
   Gate 2 lints set-down pages against the GENERATED game-term list, so the way
   this rule fails is quietly — a term record acquires a game label that is also
   an evidence word, and gate 2 starts stripping the apparatus.

   So: no word in the generated set-down lint list collides with an evidence
   label, and a fixture set-down page rendering all three labels passes gate 2's
   own phrase check (the same containsPhrase gate 2 uses, not a copy of it).

   Plant that proves it: give a term record the game label "researched".
   ========================================================================= */
function c9(): CGateResult | null {
  const fails: string[] = [];
  const labels = Object.values(STATUS_LABEL).map((l) => l.toLowerCase());
  const forbidden = SETDOWN_FORBIDDEN_TERMS.map((t) => t.toLowerCase());

  for (const t of forbidden)
    for (const l of labels)
      if (containsPhrase(l, t) || containsPhrase(t, l))
        fails.push(
          `content/terminology.ts: the set-down-forbidden game term "${t}" collides with the evidence label "${l}" — gate 2 would strip the evidence apparatus off a set-down page along with the game vocabulary (6.0 §5.3, N-272)`,
        );

  // Gate 2's own check, run over a set-down page that renders every label.
  const fixture = `<main class="prose-page is-setdown"><h1>Grief and bereavement</h1>${labels
    .map((l) => `<p class="evidence-status">${l}</p>`)
    .join("")}</main>`;
  const text = textOf(fixture).toLowerCase();
  for (const t of forbidden)
    if (containsPhrase(text, t))
      fails.push(`a set-down fixture rendering the evidence labels trips gate 2's phrase check on "${t}"`);

  const routes = read("content/routes.ts");
  if (!/may render an evidence label/i.test(routes) || !/may not render a game term/i.test(routes))
    fails.push(
      "content/routes.ts: the set-down rule (an evidence label may render, a game term may not) is not written where the routes are defined",
    );
  const meth = readOut("/methodology");
  if (meth === null) fails.push("out/methodology/index.html not built — the rendered half of C-9 cannot be read");
  else {
    const t = textOf(meth).toLowerCase();
    if (!containsPhrase(t, "evidence label")) fails.push("/methodology: the set-down rule is not published for readers");
    if (!/frozen|waits for|clinical review|not yet applied/i.test(textOf(meth)))
      fails.push("/methodology: the rule is published without the clause saying the five reviewed pages are not covered yet");
  }

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `${forbidden.length} generated set-down game terms, none of them an evidence label; a set-down fixture rendering ${labels.join(" / ")} passes gate 2's phrase check`,
      "the rule is written in content/routes.ts and published on /methodology, with the frozen pages named as not yet covered",
    ],
  };
}

/* =========================================================================
   C-10 (N-273) — no caring-duty record names the referent.
   =========================================================================
   HOW THE RECORDS WERE IDENTIFIED. records/content-pipeline.md line 208 (the
   family batch's adversarial verifier) names three by id — evt-tasha-imbalance,
   evt-tasha-repair, evt-tasha-refuses — and says why they survive the loss-tier
   boundary: "the object of care stays 'the family admin' … 'the appointment and
   the paperwork behind it', 'an office that never picks up' — institutional
   logistics, never a body". The same thread runs through three more records in
   the same file, so the gate takes the verifier's three as the floor and DERIVES
   the rest from that objects-of-care vocabulary, inside the one file the warning
   is about. A record that joins the thread and is not in the list fails the gate
   rather than escaping it.

   WHAT IS ASSERTED. Not "no name appears" — Tasha is in these scenes as the
   person who DOES the admin, and forbidding her name would forbid the thread.
   The referent is the person the appointment is FOR, so the assertion is about
   referent position: inside a sentence that carries one of the objects of care,
   no companion's given name appears in a benefactive or possessive construction
   (the closed list is REFERENT_FORMS below), and no condition from the campaign's
   own condition vocabulary is named anywhere in the record.

   Plant that proves it: append " for Diane" to one of those sentences.
   ========================================================================= */
const CARING_DUTY_FILE = "content/sim/campaign/events/batch-comp-family.ts";
/** The verifier's three (records/content-pipeline.md:208) — the floor of the set. */
const CARING_DUTY_FLOOR = ["evt-tasha-imbalance", "evt-tasha-repair", "evt-tasha-refuses"];
/** The objects of care the verifier enumerated. Institutional logistics, never a body. */
const CARE_OBJECTS = [
  "family admin",
  "sibling admin",
  "the admin",
  "appointment",
  "paperwork",
  "office that never picks up",
  "the thing at home",
  "needed doing at home",
];
/** Referent position: the constructions that say the care is FOR a named person. */
const REFERENT_FORMS = (name: string): string[] => [
  `for ${name}`,
  `${name}'s appointment`,
  `${name}'s paperwork`,
  `${name}'s forms`,
  `${name}'s care`,
  `${name}'s doctor`,
  `${name}'s treatment`,
  `${name}'s condition`,
  `${name}'s medication`,
  `${name}'s hospital`,
  `${name}'s prescription`,
  `${name}'s ward`,
];
/** Only these keys carry text a reader ever sees. */
const RENDERED_KEYS = new Set(["label", "scene", "line", "reason", "hint", "note", "summary"]);

function c10(): CGateResult | null {
  const src = read(CARING_DUTY_FILE);
  const a = src.indexOf("= [") + 2;
  const b = src.lastIndexOf("];") + 1;
  let records: Record<string, unknown>[];
  try {
    records = JSON.parse(src.slice(a, b));
  } catch {
    return { pass: false, details: [`${CARING_DUTY_FILE}: the batch is no longer JSON-shaped, so the gate cannot read its strings`] };
  }
  const fails: string[] = [];

  const stringsOf = (v: unknown, key: string | null, out: string[]): string[] => {
    if (typeof v === "string") {
      if (key && RENDERED_KEYS.has(key)) out.push(v);
    } else if (Array.isArray(v)) for (const x of v) stringsOf(x, key, out);
    else if (v && typeof v === "object")
      for (const [k, x] of Object.entries(v as Record<string, unknown>)) stringsOf(x, k, out);
    return out;
  };
  const norm = (s: string): string => s.replace(/[‘’]/g, "'").toLowerCase();

  // The thread, derived from the objects of care inside the file the warning names.
  const derived = records
    .filter((r) => stringsOf(r, null, []).some((s) => CARE_OBJECTS.some((p) => norm(s).includes(p))))
    .map((r) => String(r.id));
  for (const id of CARING_DUTY_FLOOR)
    if (!derived.includes(id))
      fails.push(
        `${CARING_DUTY_FILE}: ${id} no longer carries any of the objects of care the verifier named — the gate's subject has moved and the list in the gate is stale`,
      );

  // Companion given names, derived from the arcs' own labels ("Diane, your mother").
  const comp = read("content/sim/campaign/companions.ts");
  const names = [...comp.matchAll(/^\s{4}label: "([^",]+)/gm)]
    .map((m) => m[1].trim())
    .flatMap((l) => (l.includes(" ") ? [l, l.split(" ").pop() as string] : [l]));
  // The campaign's own condition vocabulary, read out of lib/sim/effects.ts so it cannot drift.
  const eff = read("lib/sim/effects.ts");
  const condLine = /HIGH_LOAD_CONDITIONS\s*=\s*\[([^\]]+)\]/.exec(eff);
  const conditions = condLine ? [...condLine[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : [];
  if (!conditions.length) fails.push("lib/sim/effects.ts: HIGH_LOAD_CONDITIONS could not be read; the condition half of C-10 is unarmed");

  for (const r of records) {
    const id = String(r.id);
    if (!derived.includes(id)) continue;
    for (const s of stringsOf(r, null, [])) {
      const flat = norm(s);
      for (const c of conditions)
        if (flat.includes(c) || flat.includes(c.replace(/-/g, " ")))
          fails.push(`${id}: a rendered string names the condition "${c}" — "${s.slice(0, 90)}…"`);
      for (const sentence of flat.split(/(?<=[.!?])\s+/)) {
        if (!CARE_OBJECTS.some((p) => sentence.includes(p))) continue;
        for (const n of names)
          for (const form of REFERENT_FORMS(n.toLowerCase()))
            if (sentence.includes(form))
              fails.push(
                `${id}: "${sentence.trim().slice(0, 120)}" names ${n} as the person the care is for. The caring-duty thread stays inside the loss-tier boundary ONLY while its referent is unnamed (6.0 §5.6, N-273; KNOWN_LIMITATIONS.md §5) — naming a live companion makes this record loss-tier setup.`,
              );
      }
    }
  }

  const law = read("content/sim/AUTHORING.md");
  if (!/keep the referent unnamed/i.test(law))
    fails.push(
      "content/sim/AUTHORING.md: \"Keep the referent unnamed\" is not authoring law — the next batch author reads this file, not KNOWN_LIMITATIONS.md §5",
    );

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `${derived.length} caring-duty records (${derived.join(", ")}) — the verifier's three plus every record in the same file using the same objects of care`,
      `no sentence carrying an object of care puts any of ${names.length} companion names in referent position, and no record names any of ${conditions.length} campaign conditions`,
      "the law is in content/sim/AUTHORING.md",
    ],
  };
}


/* =========================================================================
   BATCH 3 (group H, the play layer) — C-11 … C-25.
   =========================================================================
   THE ENGINE HARNESS. Five of these gates have engine behaviour as their subject
   and this file cannot reach the engine: it runs under `node
   --experimental-strip-types`, which resolves relative specifiers only, and every
   module under lib/sim imports through the `@/` alias. So the engine halves live
   in `tests/consolidation-sim-harness.ts`, run once under tsx, and this file reads
   its output — the same shape C-1 (batch 1) uses for the save-status harness,
   extended to eight assertions so the suite pays for one spawn rather than eight.
   ========================================================================= */

type HarnessLine = { gate: string; pass: boolean; detail: string };
let HARNESS: HarnessLine[] | null | undefined;

function harness(): HarnessLine[] | null {
  if (HARNESS !== undefined) return HARNESS;
  const r = spawnSync("npx", ["tsx", "tests/consolidation-sim-harness.ts"], {
    cwd: ROOT,
    encoding: "utf8",
    shell: true,
  });
  const out = `${r.stdout ?? ""}${r.stderr ?? ""}`;
  const lines = [...out.matchAll(/^\[(C-\d+)\] (PASS|FAIL) · (.*)$/gm)].map((m) => ({
    gate: m[1],
    pass: m[2] === "PASS",
    detail: m[3],
  }));
  if (!lines.length) {
    HARNESS = null;
    // Not silent: a harness that will not run is a suite of gates that cannot
    // fail, which is the exact defect the falsify discipline exists to catch.
    console.error("tests/consolidation-sim-harness.ts produced no gate lines:\n" + out.split("\n").slice(-12).join("\n"));
    return null;
  }
  HARNESS = lines;
  return lines;
}

/** One gate's result out of the harness, or null when it reported nothing. */
function fromHarness(gate: string, extra?: () => { fails: string[]; details: string[] }): CGateResult | null {
  const all = harness();
  if (!all) return { pass: false, details: [`the engine harness did not run, so ${gate} proved nothing`] };
  const mine = all.filter((l) => l.gate === gate);
  if (!mine.length) return null;
  const local = extra ? extra() : { fails: [], details: [] };
  const fails = [...mine.filter((l) => !l.pass).map((l) => l.detail), ...local.fails];
  if (fails.length) return { pass: false, details: fails };
  return { pass: true, details: [...mine.map((l) => l.detail), ...local.details] };
}

/* =========================================================================
   C-11 (N-192) — at least one shipped draw-vary pair renders the same-outcome
   reading. Entirely the harness's: the subject is what `compare()` returns.
   Plant: reseed the pair to one that separates.
   ========================================================================= */
const c11 = (): CGateResult | null => fromHarness("C-11");

/* =========================================================================
   C-12 (N-194) — Repeat-last-season commits an ordered set through the
   hand-allocation path and the run still replays byte-identically.
   =========================================================================
   The harness proves the engine half. The half a harness cannot see is that the
   CONTROL uses that path: `repeatProposal` copies the previous season's
   allocations in order (not rebuilt from a set of ids), and the button hands its
   proposal to the same `commitAllocations` the allocate screen's Resolve calls.
   ========================================================================= */
function c12(): CGateResult | null {
  return fromHarness("C-12", () => {
    const src = read("components/sim/CampaignApp.tsx");
    const fails: string[] = [];
    if (!/data-sim-repeat-last/.test(src)) return { fails: ["components/sim/CampaignApp.tsx: no repeat-last control renders at all"], details: [] };
    // ONE commit path. Both the Resolve button and the repeat control must reach
    // `commitAllocations`; a second inline path is how the two would drift.
    const calls = [...src.matchAll(/commitAllocations\(/g)].length;
    if (calls < 3)
      fails.push(
        `components/sim/CampaignApp.tsx: commitAllocations appears ${calls} time(s) — the declaration plus a call from the allocate screen plus a call from the repeat control is the minimum, and fewer means one of them commits by another route`,
      );
    // ORDER. A proposal built by iterating the previous allocations in order is
    // the thing being asserted; a proposal built from a Set or a map of ids is
    // the defect, and §7.6 resolves in allocation order so it would not be a repeat.
    const proposal = src.slice(src.indexOf("function repeatProposal"), src.indexOf("function gaugeDelta"));
    if (!/for \(const a of last\.allocations\)/.test(proposal))
      fails.push("components/sim/CampaignApp.tsx: repeatProposal no longer walks the previous season's allocations in order");
    if (/new Set\(/.test(proposal))
      fails.push("components/sim/CampaignApp.tsx: repeatProposal builds its proposal through a Set, which does not preserve the allocation order §7.6 resolves in");
    return { fails, details: ["the repeat control and the allocate screen commit through one shared path, and the proposal is copied in order"] };
  });
}

/* =========================================================================
   C-13 (N-195) — the rendered /methodology names the curation tool and both
   criteria. Plant: delete the sentence.
   ========================================================================= */
function c13(): CGateResult | null {
  const copy = read("content/sim/methodology-copy.ts");
  if (!copy.includes("LAB_CURATION_TOOL")) return null;
  const html = readOut("/methodology");
  if (!html) return { pass: false, details: ["out/methodology/index.html not built"] };
  const text = textOf(html).toLowerCase();
  const fails: string[] = [];
  const TOOL = "tools/curate-lab-seeds.ts";
  if (!text.includes(TOOL))
    fails.push(
      `/methodology does not name ${TOOL}. The page publishes the economy, the resolution order, the pile-up physics and the attribution rule, and then omits the one place a thumb was put on which seed ships (N-195; DECISIONS.md "INVENTION: automated Lab seed curation").`,
    );
  // BOTH criteria, by their substance rather than by a sentence that could be
  // reworded: one search is for seeds that SEPARATE, the other for one that
  // lands the SAME. A disclosure naming only the first is the state this row
  // exists to correct, so the gate must be able to come back red on that alone.
  if (!/separat/.test(text)) fails.push("/methodology names the curation tool but not the criterion it originally searched on (alternate draws that SEPARATE)");
  if (!/lands the same|land the same/.test(text))
    fails.push("/methodology names the curation tool but not the second criterion (an alternate draw that lands the SAME), which is the half this version added");
  if (!/curat/.test(text)) fails.push("/methodology carries no disclosure of the curation itself");
  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `/methodology names ${TOOL} and both criteria — the seeds that separate, and the one curated to land the same — with the limit stated (it chooses which fixed seed ships, not the physics)`,
    ],
  };
}

/* =========================================================================
   C-14 (N-204) — every season screen carries its origin's face motif.
   =========================================================================
   A "record" gate: the campaign is client-only, so out/ carries no season screen
   at all and the substance is the browser assertion in tests/browser-gates.mjs,
   which samples three turns. The half asserted HERE is the one a browser walk
   cannot state: that the motif is in the SHARED HEADER — which renders on every
   stage except the prologue and the hand — rather than on one screen, and that
   the header does not carry the preset's NAME, which is the spec's own test
   (a screenshot must be attributable to its origin without it).
   ========================================================================= */
function c14(): CGateResult | null {
  const src = read("components/sim/CampaignApp.tsx");
  if (!/data-sim-origin-face/.test(src)) return null;
  const fails: string[] = [];
  const header = src.slice(src.indexOf("function CampaignHeader"), src.indexOf("Prologue and the hand"));
  if (!/data-sim-origin-face/.test(header))
    fails.push("components/sim/CampaignApp.tsx: the origin motif is not in CampaignHeader, so it renders on one screen rather than on every season step");
  if (!/FamilyMotif/.test(header))
    fails.push("components/sim/CampaignApp.tsx: the season chrome draws its own motif rather than reusing the card face's — two drawings that can drift apart");
  if (!/originFace/.test(src)) fails.push("components/sim/CampaignApp.tsx: no origin-face derivation; a drawn hand would render nothing");
  // The preset NAME must not be in the header: the spec's test is attribution
  // WITHOUT it. `presetId` may appear in the derivation, never as rendered text.
  if (/<dd>\{[^}]*preset[^}]*\.label/i.test(header))
    fails.push("components/sim/CampaignApp.tsx: the header renders the preset's name, which is the thing the motif is supposed to make unnecessary");
  // And the browser half exists and is armed.
  const browser = read("tests/browser-gates.mjs");
  if (!/data-sim-origin-face/.test(browser))
    fails.push("tests/browser-gates.mjs: no browser assertion for the origin motif — C-14's substance is the rendered half and it is not being checked");
  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      "the origin motif renders from CampaignHeader, which is on every season step except the prologue and the hand; it reuses FamilyMotif, the one component that draws a family; a drawn hand falls back to the neutral inner face",
      "the preset's name is not in the header — the spec's own test is that a screenshot is attributable to its origin without it",
      "the rendered half is asserted at three sampled turns in tests/browser-gates.mjs (record gate; proven red by rendering the motif only on turn one)",
    ],
  };
}

/* =========================================================================
   C-15 (N-211) — no selectable response renders without all five contract
   fields. Pool half in the harness; render half here.
   ========================================================================= */
function c15(): CGateResult | null {
  const src = read("components/sim/CampaignApp.tsx");
  if (!/data-sim-contract-field/.test(src)) return null;
  return fromHarness("C-15", () => {
    const fails: string[] = [];
    const details: string[] = [];
    // The five names come from lib/sim/season.ts's CONTRACT_FIELD_NAMES, and the
    // renderer maps over them rather than writing five <dt>s that could drift.
    const season = read("lib/sim/season.ts");
    const NAMES = ["capacity", "what waits", "reversibility", "if it goes badly", "evidence"];
    const declared = /CONTRACT_FIELD_NAMES = \[([^\]]*)\]/.exec(season);
    const got = declared ? [...declared[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]) : [];
    if (got.join("|") !== NAMES.join("|"))
      fails.push(`lib/sim/season.ts: the contract is [${got.join(", ")}]; §3.9 fixes the five names as [${NAMES.join(", ")}]`);
    const renderer = src.slice(src.indexOf("function ResponseContract"), src.indexOf("N-212 — THE PURE PREVIEW PANE"));
    if (!/responseContract\(/.test(renderer))
      fails.push("components/sim/CampaignApp.tsx: ResponseContract does not call the shared responseContract, so the card and the gate could be reading different fields");
    if (!/data-sim-contract-field=\{f\.name\}/.test(renderer))
      fails.push("components/sim/CampaignApp.tsx: the contract rows do not carry data-sim-contract-field, so nothing can assert their presence");
    // EVERY selectable option is inside a contract. Every `data-sim-option` in
    // the component must be a list item whose body renders <ResponseContract.
    const optionBlocks = src.split("data-sim-option");
    for (let i = 1; i < optionBlocks.length; i++) {
      const body = optionBlocks[i].slice(0, 2600);
      if (!/<ResponseContract/.test(body))
        fails.push(
          `components/sim/CampaignApp.tsx: a [data-sim-option] block (#${i}) renders no <ResponseContract> — an option a reader can commit without being shown what waits, what is reversible, or the way back`,
        );
    }
    details.push(`${optionBlocks.length - 1} option-rendering sites, each wrapping a ResponseContract driven by the five fixed names`);
    return { fails, details };
  });
}

/* =========================================================================
   C-16 (N-212) — previewAction is pure. Harness for the behaviour; here, the
   two structural halves a purity run cannot see.
   ========================================================================= */
function c16(): CGateResult | null {
  const season = read("lib/sim/season.ts");
  if (!/export function previewAction/.test(season)) return null;
  return fromHarness("C-16", () => {
    const fails: string[] = [];
    // (1) NO STORAGE. lib/sim/season.ts must not reach persistence at all — the
    //     persisted active key is the thing "writes nothing" is about.
    if (/from "@\/lib\/storage"|from "@\/lib\/sim\/persist"|localStorage/.test(season))
      fails.push("lib/sim/season.ts reaches storage — a preview in this module could write the persisted active key");
    // (2) NO RANDOMNESS inside previewAction. A preview that consumed a draw would
    //     move what the next commit resolves to, which is the subtlest way this
    //     could write. The harness proves the consequence; this proves the cause.
    const body = season.slice(season.indexOf("export function previewAction"), season.indexOf("function dueWord"));
    for (const call of ["drawFor(", "selectionDraw(", "freshSeed(", "hashToUnit(", "weightedIndex("])
      if (body.includes(call)) fails.push(`lib/sim/season.ts: previewAction calls ${call} — a preview that consumes randomness is not a preview`);
    // (3) The rendered promise. The pane says previewing changes nothing; the
    //     sentence is only allowed to be there because of this gate.
    const app = read("components/sim/CampaignApp.tsx");
    if (!/Previewing changes nothing\./.test(app))
      fails.push("components/sim/CampaignApp.tsx: the preview pane no longer states that previewing changes nothing");
    if (!/aria-live="polite"[\s\S]{0,200}data-sim-preview|data-sim-preview[\s\S]{0,200}aria-live="polite"/.test(app))
      fails.push("components/sim/CampaignApp.tsx: the preview pane is not an aria-live region, so a keyboard reader gets nothing from it");
    return { fails, details: ["lib/sim/season.ts reaches no storage and previewAction consumes no draw; the pane is an aria-live region and states the claim the gate makes true"] };
  });
}

/* =========================================================================
   C-17 (N-213) — upkeep present and affordable in the worst envelope.
   Plant: raise its cost above the floor.
   ========================================================================= */
const c17 = (): CGateResult | null => fromHarness("C-17");

/* =========================================================================
   C-18 (N-214) — the `narrowing` door state never renders in the open state's
   token. Plant: map it to the open token.
   =========================================================================
   The three-state panel's original defect was that "opened" is tinted with the
   good-outcome colour and everything unlisted fell into it, so job loss read as
   a green door. The fourth state is the same trap one step further along: a door
   that is getting harder painted as one that opened. This reads the rules the
   door group headings actually use out of the stylesheets — never a hardcoded
   list — and requires narrowing's token to differ from opened's.
   ========================================================================= */
const SIM_SHEETS = ["app/sim.css", "app/sim-surfaces.css", "app/sim-instruments.css"];

/** Every `--sim-*` token a rule whose selector matches `test` sets a colour from. */
function tokensForSelector(test: RegExp): { selector: string; tokens: string[] }[] {
  const out: { selector: string; tokens: string[] }[] = [];
  for (const sheet of SIM_SHEETS) {
    const css = read(sheet).replace(/\/\*[\s\S]*?\*\//g, " ");
    for (const block of css.split("}")) {
      const open = block.indexOf("{");
      if (open === -1) continue;
      const selector = block.slice(0, open).trim();
      if (!test.test(selector)) continue;
      const tokens = [...block.slice(open).matchAll(/var\((--sim-[\w-]+)\)/g)].map((m) => m[1]);
      if (tokens.length) out.push({ selector, tokens });
    }
  }
  return out;
}

function c18(): CGateResult | null {
  const doors = read("content/sim/campaign/doors.ts");
  if (!/"narrowing"/.test(doors)) return null;
  const fails: string[] = [];
  const opened = tokensForSelector(/data-state="opened"/).flatMap((r) => r.tokens);
  const narrowing = tokensForSelector(/data-state="narrowing"/).flatMap((r) => r.tokens);
  if (!opened.length) fails.push("no rule paints the open door state, so C-18 has nothing to compare against");
  if (!narrowing.length)
    fails.push(
      'no rule declares the "narrowing" door state\'s colour. Left to inherit, it is correct today and one cascade change from being wrong, and the gate has no subject to plant into.',
    );
  for (const t of narrowing)
    if (opened.includes(t))
      fails.push(
        `the "narrowing" door state renders in ${t}, which is the OPEN state's token. A door that is getting harder every season it goes unused is not a door that opened, and painting it as one is the three-state panel's own defect (job loss rendered green) one state further along.`,
      );
  // And the state is actually reachable: declared on at least one door and
  // rendered as its own group rather than folded into another.
  const declared = [...doors.matchAll(/state: "narrowing"/g)].length;
  if (!declared) fails.push('content/sim/campaign/doors.ts declares the "narrowing" state on no door, so it can never render');
  const app = read("components/sim/CampaignApp.tsx");
  if (!/\["narrowing", /.test(app)) fails.push("components/sim/CampaignApp.tsx: the doors panel has no narrowing group, so the state would be computed and dropped");
  const note = read("content/sim/campaign/doors.ts");
  if (!/narrowing:\s*\n?\s*"/.test(note) && !/narrowing:\s*"/.test(note))
    fails.push("content/sim/campaign/doors.ts: DOOR_NOTE carries no line for the narrowing state");
  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `"narrowing" is declared on ${declared} doors, renders as its own group, and is painted with [${[...new Set(narrowing)].join(", ")}] — never the open state's [${[...new Set(opened)].join(", ")}]`,
    ],
  };
}

/* =========================================================================
   C-19 (N-233) — no sim token pair encodes valence as green/red across a
   resolution; no Game Guide string carries a forbidden-register term.
   =========================================================================
   THE COLOUR HALF, and why it is measured the way it is. The no-worth-score wall
   is enforced in words, in numbers and in totals. Colour is the one channel
   nothing linted, and a saturated green on `strong` against a saturated red on
   `failure` would put the verdict back on the screen without a word of it being
   written. The shipped palette refuses that deliberately: --sim-good is a muted
   sage and --sim-poor a terracotta, both well under signal strength.
   The rule this asserts is therefore NOT "no green and no red hue" — that would
   fail on the shipped terracotta, which sits at a red hue and is not a signal
   red — but "not a green and a red AT SIGNAL STRENGTH on the two ends of one
   resolution". Chroma (the distance from grey) is the measure, the threshold is
   published below with the shipped values beside it, and the margin is wide:
   the band tokens sit around a third of full chroma against a line at a half.
   A traffic-light colour on either end trips it.
   ========================================================================= */
const SIGNAL_CHROMA = 0.5;

function hexOfToken(token: string): string | null {
  const css = read("app/sim.css");
  const m = new RegExp(`${token}\\s*:\\s*(#[0-9a-fA-F]{3,8})`).exec(css);
  return m ? m[1] : null;
}
function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6);
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}
/** Hue in degrees, and chroma as a fraction of full (max-min over 255). */
function hueChroma(hex: string): { hue: number; chroma: number } {
  const [r, g, b] = rgb(hex);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let hue = 0;
  if (d !== 0) {
    if (max === r) hue = 60 * (((g - b) / d) % 6);
    else if (max === g) hue = 60 * ((b - r) / d + 2);
    else hue = 60 * ((r - g) / d + 4);
  }
  if (hue < 0) hue += 360;
  return { hue, chroma: d / 255 };
}
const isGreenHue = (h: number) => h >= 75 && h <= 170;
const isRedHue = (h: number) => h >= 340 || h <= 20;

function c19(): CGateResult | null {
  const cfgPath = join(ROOT, "content/terminology.json");
  if (!existsSync(cfgPath)) return null;
  const cfg = JSON.parse(readFileSync(cfgPath, "utf8")) as Record<string, unknown>;
  if (!Array.isArray(cfg.forbiddenRegister)) return null;

  const fails: string[] = [];
  const details: string[] = [];

  /* ---- (a) the colour rule, over the tokens the band classes actually use ---- */
  const bandRules = tokensForSelector(/data-band=/);
  if (!bandRules.length) fails.push("no rule in the sim stylesheets paints an outcome band, so the colour half of C-19 has no subject");
  const POSITIVE = ["strong", "solid"];
  const NEGATIVE = ["poor", "failure"];
  const tokensFor = (bands: string[]) =>
    [
      ...new Set(
        bandRules.filter((r) => bands.some((b) => r.selector.includes(`data-band="${b}"`))).flatMap((r) => r.tokens),
      ),
    ];
  const good = tokensFor(POSITIVE);
  const bad = tokensFor(NEGATIVE);
  const measured: string[] = [];
  for (const gt of good) {
    const gh = hexOfToken(gt);
    if (!gh) continue;
    const g = hueChroma(gh);
    measured.push(`${gt} ${gh} hue ${Math.round(g.hue)}°, chroma ${g.chroma.toFixed(2)}`);
    for (const bt of bad) {
      const bh = hexOfToken(bt);
      if (!bh) continue;
      const b = hueChroma(bh);
      if (isGreenHue(g.hue) && isRedHue(b.hue) && Math.max(g.chroma, b.chroma) >= SIGNAL_CHROMA)
        fails.push(
          `the outcome bands put ${gt} (${gh}, hue ${Math.round(g.hue)}°, chroma ${g.chroma.toFixed(2)}) against ${bt} (${bh}, hue ${Math.round(b.hue)}°, chroma ${b.chroma.toFixed(2)}) — a green and a red at signal strength on the two ends of one resolution. That is a verdict on the character, rendered in the one channel the no-score wall does not read (N-233).`,
        );
    }
  }
  for (const bt of bad) {
    const bh = hexOfToken(bt);
    if (bh) measured.push(`${bt} ${bh} hue ${Math.round(hueChroma(bh).hue)}°, chroma ${hueChroma(bh).chroma.toFixed(2)}`);
  }
  if (!measured.length) fails.push("none of the outcome-band tokens resolved to a colour in app/sim.css, so the colour rule was not actually measured");

  /* ---- (b) the forbidden register, over the EDITION VOCABULARY ---- */
  const forbidden = (cfg.forbiddenRegister as string[]).map((w) => w.toLowerCase());
  let labels = 0;
  for (const t of Object.values(TERMS)) {
    for (const [field, value] of [
      ["game", t.game],
      ["define", t.define],
      ["standard", t.standard],
    ] as [string, string | undefined][]) {
      if (!value) continue;
      if (field === "game") labels++;
      for (const w of forbidden)
        if (containsPhrase(value.toLowerCase(), w))
          fails.push(
            `content/terminology.ts: the ${field} label for "${t.key}" is "${value}", which carries the combat-skin term "${w}". The Game Guide is a vocabulary for a life, not a genre — swords, health bars, enemies and boss fights import a frame in which a person has hit points and a hard year is a fight they lost (N-233).`,
          );
    }
  }
  // The JSON's own game labels, which is where the row says the list lives.
  for (const [key, rec] of Object.entries(cfg)) {
    if (!rec || typeof rec !== "object" || Array.isArray(rec)) continue;
    const game = (rec as { game?: string }).game;
    if (!game) continue;
    for (const w of forbidden)
      if (containsPhrase(game.toLowerCase(), w))
        fails.push(`content/terminology.json: the game label for "${key}" is "${game}", which carries the combat-skin term "${w}"`);
  }
  if (!Array.isArray(cfg.forbiddenRegisterPlaySurfaces))
    fails.push("content/terminology.json declares no forbiddenRegisterPlaySurfaces subset, so the play-surface half of the lint is unarmed");
  if (!Array.isArray(cfg.forbiddenRegisterNote) || !(cfg.forbiddenRegisterNote as string[]).length)
    fails.push("content/terminology.json: the forbidden register carries no statement of what it is for or why it has two scopes");
  // The rule is written where the tokens are, so the next author meets it.
  if (!/no token pair encodes outcome valence as green\/red|COLOUR RULE/i.test(read("app/sim.css")))
    fails.push("app/sim.css: the token set carries no statement of the colour rule, so the next person to pick a colour will not meet it");

  const play = harness()?.filter((l) => l.gate === "C-19") ?? [];
  for (const l of play) if (!l.pass) fails.push(l.detail);

  if (fails.length) return { pass: false, details: fails };
  details.push(`outcome-band tokens measured: ${measured.join(" · ")} — no green/red pair at or above ${SIGNAL_CHROMA} chroma`);
  details.push(`${forbidden.length} forbidden-register terms linted against ${labels} Game Guide labels and every term gloss`);
  for (const l of play) details.push(l.detail);
  return { pass: true, details };
}

/* =========================================================================
   C-20 (N-216) — a reopened season renders its stored explanation.
   Harness for the behaviour; here, that the SEASON LIST reads it.
   ========================================================================= */
function c20(): CGateResult | null {
  const persist = read("lib/sim/persist.ts");
  if (!/recordExplanations/.test(persist)) return null;
  return fromHarness("C-20", () => {
    const fails: string[] = [];
    const app = read("components/sim/CampaignApp.tsx");
    if (!/storedExplanationFor\(run, s\.seasonIndex\)/.test(app))
      fails.push("components/sim/CampaignApp.tsx: the look-back's season list does not reopen the stored explanation, so a content change still rewrites what a reader met");
    if (!/recordExplanations\(outcome\.state, outcome\.result\)/.test(app))
      fails.push("components/sim/CampaignApp.tsx: nothing stores a season's explanation when it resolves, so there is never anything to reopen");
    if (!/data-sim-season-record/.test(app))
      fails.push("components/sim/CampaignApp.tsx: the season list does not declare whether a row is the stored text or a recomputation");
    // The stamp travels with the text, and is not re-read off the live version.
    const persistSrc = read("lib/sim/persist.ts");
    if (!/contentVersion: CONTENT_VERSION/.test(persistSrc))
      fails.push("lib/sim/persist.ts: a stored explanation is not stamped with the content version that produced it");
    return { fails, details: ["the look-back reopens the stored text with its own stamp, and marks a pre-6.0 season as a recomputation rather than passing it off as a record"] };
  });
}

/* =========================================================================
   C-21 (N-218) — the Queue's empty state says uncertainty has not disappeared.
   Plant: delete the second sentence.
   =========================================================================
   The queue instrument is client-only, so the exported HTML never carries it and
   the subject is the component. Both sentences are required, and the SECOND one
   is the row: an empty queue is the moment a simulation most tempts a reader into
   reading "nothing is pending" as "nothing is coming", and the first sentence
   alone is the reassuring half of a true thing.
   ========================================================================= */
function c21(): CGateResult | null {
  const src = read("components/sim/instruments/Instruments.tsx");
  if (!/data-sim-queue-empty/.test(src)) return null;
  const fails: string[] = [];
  const block = src.slice(src.indexOf("if (!queue.length)"), src.indexOf("return (\n    <section className=\"sim-queue\""));
  const FIRST = "No known delayed consequence is pending.";
  const SECOND = "Uncertainty has not disappeared.";
  if (!block.includes(FIRST)) fails.push(`the Queue's empty state does not say "${FIRST}"`);
  if (!block.includes(SECOND))
    fails.push(
      `the Queue's empty state does not say "${SECOND}". Without it the panel reads as "nothing is coming", which is the false clearance an empty queue most invites — the queue holds what has ALREADY been set going, and genuinely uncertain things are absent because they are not decided, not because they do not exist (N-218).`,
    );
  if (fails.length) return { pass: false, details: fails };
  return { pass: true, details: ["the Queue's empty state carries both sentences: nothing is pending, and uncertainty has not disappeared"] };
}

/* =========================================================================
   C-22 (N-225) — every Lab situation declares an unknown, rendered BEFORE the
   branches. Content half in the harness; order half here.
   ========================================================================= */
function c22(): CGateResult | null {
  const app = read("components/sim/LabApp.tsx");
  if (!/data-sim-lab-unknown/.test(app)) return null;
  return fromHarness("C-22", () => {
    const fails: string[] = [];
    // ORDER IS THE ROW. After the columns is too late: by then the screen has
    // already made its case. So the unknowns block must come before the branch
    // columns in the rendered source, not merely exist somewhere on the page.
    const unknowns = app.indexOf("data-sim-lab-unknown");
    const columns = app.indexOf("sim-lab-columns");
    const diff = app.indexOf("What actually differs");
    if (unknowns < 0 || columns < 0) fails.push("components/sim/LabApp.tsx: could not locate the unknowns block or the branch columns");
    else if (unknowns > columns)
      fails.push(
        "components/sim/LabApp.tsx: the unknowns render AFTER the branch columns. Naming what the fork cannot resolve is the counterweight to a comparison screen that looks decisive, and after the comparison it is a footnote.",
      );
    if (diff > 0 && unknowns > diff) fails.push("components/sim/LabApp.tsx: the unknowns render after the differences panel");
    return { fails, details: ["the unknowns render above the branch columns, under their own heading"] };
  });
}

/* =========================================================================
   C-23 (N-228) — every SimState field the engine reads has a mid-run surface.
   Plant: remove one field's surface.
   =========================================================================
   The list is DERIVED, never written down here: the gate reads the field accesses
   out of lib/sim/season.ts, intersects them with SimState's declared fields, and
   requires a `data-sim-state-field` for each somewhere under components/sim. So
   adding a read to the engine forces a surface, and this cannot go stale.

   ONE DECLARED EXEMPTION, with its reason: `beatsPlayed`. Beats are not state a
   player inspects. §5.1 keeps them off every forward-looking screen, out of the
   queue, out of the items list and out of the milestone list, and a skipped beat
   stays skipped on every surface; putting the beat channel into the run's chrome
   would be the one place that rule is broken, by a gate written to enforce a
   different rule. It is named here rather than quietly filtered.
   ========================================================================= */
const STATE_FIELD_EXEMPT: Record<string, string> = {
  beatsPlayed:
    "the beat channel is not state a player inspects (§5.1): beats are kept off every forward-looking surface and a skipped beat stays skipped, so a mid-run panel listing them would break that rule rather than satisfy this one",
};

function c23(): CGateResult | null {
  const rail = join(ROOT, "components/sim/StateRail.tsx");
  if (!existsSync(rail)) return null;
  const schema = read("content/sim/schema.ts");
  const season = read("lib/sim/season.ts");

  // SimState's declared fields, read out of the type.
  const typeBody = schema.slice(schema.indexOf("export type SimState = {"));
  const decl = typeBody.slice(0, typeBody.indexOf("\n};"));
  const declared = new Set(
    [...decl.replace(/\/\*[\s\S]*?\*\//g, " ").matchAll(/^\s{2}(\w+)\??:/gm)].map((m) => m[1]),
  );
  // What the engine actually reads.
  const readByEngine = new Set(
    [...season.replace(/\/\*[\s\S]*?\*\//g, " ").matchAll(/\b(?:state|s|next)\.(\w+)/g)]
      .map((m) => m[1])
      .filter((f) => declared.has(f)),
  );

  // Every surface marker under components/sim.
  const surfaces = new Set<string>();
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.tsx?$/.test(entry))
        for (const m of readFileSync(full, "utf8").matchAll(/data-sim-state-field(?:-also)?="(\w+)"/g)) surfaces.add(m[1]);
    }
  };
  walk(join(ROOT, "components/sim"));

  const fails: string[] = [];
  const exempted: string[] = [];
  for (const field of [...readByEngine].sort()) {
    if (STATE_FIELD_EXEMPT[field]) {
      exempted.push(`${field} (${STATE_FIELD_EXEMPT[field]})`);
      continue;
    }
    if (!surfaces.has(field))
      fails.push(
        `SimState.${field} is read by the engine and has no mid-run surface. A player spends twenty-four seasons building something the interface never shows them, which is the named trust defect this row exists to close (N-228): mark a surface with data-sim-state-field="${field}".`,
      );
  }
  // And the rail is reachable from every season step, not from one screen.
  const app = read("components/sim/CampaignApp.tsx");
  if (!/<StateRail run=\{run\} \/>/.test(app)) fails.push("components/sim/CampaignApp.tsx: the state rail is never rendered");
  if (!/onToggleRail/.test(app.slice(app.indexOf("function CampaignHeader"), app.indexOf("Prologue and the hand"))))
    fails.push(
      "components/sim/CampaignApp.tsx: the state rail is not opened from the header, so it is reachable from the screens that happen to have an aside rather than from every season step",
    );
  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `${readByEngine.size} SimState fields are read by lib/sim/season.ts; ${readByEngine.size - exempted.length} of them carry a data-sim-state-field surface under components/sim, reachable from every season step through the header`,
      `derived, not listed: ${[...readByEngine].sort().join(", ")}`,
      ...(exempted.length ? [`declared exemption — ${exempted.join("; ")}`] : []),
    ],
  };
}

/* =========================================================================
   C-24 (N-235) — no Try-in-Play entry on any set-down route.
   Plant: put one on /triage.
   =========================================================================
   Gate 2 already lints set-down routes for game vocabulary and would catch the
   Game Guide label. This is the other half and the one that matters most: the
   LINK itself. A reader on a set-down route may be at the end of a very bad day,
   and an invitation to go and play a simulation of it is the wrong thing on the
   page whatever word it is wearing. Asserted over the exported HTML, so a link
   that reaches the page through chrome, a shared component or a nav subset is
   caught as readily as one written into the route.
   ========================================================================= */
function c24(): CGateResult | null {
  const prim = read("components/primitives.tsx");
  if (!/data-try-in-play/.test(prim)) return null;
  const fails: string[] = [];
  const walked: string[] = [];
  for (const route of SETDOWN_ROUTES) {
    const html = readOut(route);
    if (!html) {
      fails.push(`${route}: not built, so the gate proved nothing about it`);
      continue;
    }
    walked.push(route);
    if (html.includes("data-try-in-play"))
      fails.push(
        `${route} renders a Try-in-Play entry. A set-down route carries no invitation into the play layer (6.0 §5.3): a reader here may be at the end of a very bad day, and the register of the offer is wrong whatever word it wears.`,
      );
    for (const m of html.matchAll(/href="(\/play[^"]*)"/g))
      fails.push(`${route} links to ${m[1]} — a set-down route carries no Play entry, in the nav or in the page`);
  }
  // And it IS on the routes the row names, or the row shipped nothing.
  const PLACED = ["/topics/money", "/topics/health", "/topics/relationships", "/topics/work", "/map/credential-decision", "/situations/job-loss"];
  const missing = PLACED.filter((r) => !(readOut(r) ?? "").includes("data-try-in-play"));
  if (missing.length === PLACED.length)
    fails.push("the Try-in-Play entry renders on none of the routes N-235 names, so the gate is asserting the absence of something that does not exist");
  else if (missing.length) fails.push(`the Try-in-Play entry is missing from ${missing.join(", ")}`);
  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `${walked.length} set-down routes carry no Try-in-Play marker and no /play link: ${walked.join(", ")}`,
      `the entry renders on all ${PLACED.length} routes the row names, through <Term> so the Standard edition never sees a game word`,
    ],
  };
}

/* =========================================================================
   C-25 (N-355) — every parse panel declares recorded · interpreted · unknowable.
   Plant: strip a declaration.
   =========================================================================
   Both parses. The arc's uses `sim-parse-section`; the campaign's look-back uses
   `sim-panel` inside `.sim-parse`. A panel that is NAVIGATION rather than a
   finding declares `data-parse-controls` instead — giving the replay block or the
   bridge one of the three words would be the first small lie on a screen whose
   whole purpose is telling the reader which kind of claim they are reading.
   ========================================================================= */
const PARSE_KINDS = ["recorded", "interpreted", "unknowable"];

function c25(): CGateResult | null {
  const arc = read("components/play/Parse.tsx");
  if (!/data-parse-kind/.test(arc)) return null;
  const fails: string[] = [];
  const counted: string[] = [];

  const check = (file: string, src: string, opener: RegExp) => {
    let n = 0;
    for (const m of src.matchAll(opener)) {
      n++;
      const tag = m[0];
      const kind = /data-parse-kind="(\w+)"/.exec(tag)?.[1];
      const controls = /data-parse-controls/.test(tag);
      // Name the section by the heading that follows it, so a failure says which.
      const after = src.slice(m.index ?? 0, (m.index ?? 0) + 400);
      const heading = /<h[234][^>]*>([^<]{2,60})/.exec(after)?.[1]?.trim() ?? `section #${n}`;
      if (controls) continue;
      if (!kind)
        fails.push(
          `${file}: the parse panel "${heading}" declares neither a kind nor data-parse-controls. Every panel that reports something about the run says which of recorded · interpreted · unknowable it is; a panel that is navigation says so instead (N-355).`,
        );
      else if (!PARSE_KINDS.includes(kind)) fails.push(`${file}: the panel "${heading}" declares data-parse-kind="${kind}", which is not one of the three`);
    }
    counted.push(`${file}: ${n} panels`);
  };

  check("components/play/Parse.tsx", arc, /<section className="sim-parse-section[^"]*"[^>]*>/g);
  const camp = read("components/sim/CampaignApp.tsx");
  const parseScreen = camp.slice(camp.indexOf("function ParseScreen"));
  check("components/sim/CampaignApp.tsx (the look-back)", parseScreen, /<section className="sim-(?:panel|bridge)"[^>]*>/g);

  // The unknowable kind must actually be used somewhere, or the third category is
  // a word in a type rather than a thing the reader is told.
  if (!/data-parse-kind="unknowable"/.test(arc) || !/data-parse-kind="unknowable"/.test(parseScreen))
    fails.push(
      'neither parse names anything as "unknowable". The category exists because the most important parts of a life get scored by omission on a screen like this; declaring only the two comfortable kinds is the omission.',
    );
  if (fails.length) return { pass: false, details: fails };
  return { pass: true, details: [`every parse panel declares its kind or declares itself navigation (${counted.join("; ")})`] };
}

/* =========================================================================
   C-26 (N-001) — /orientation renders complete with JS off and carries no game
   term in Standard.  Plant: put a game term on the page.
   =========================================================================
   The page a first-time visitor is sent to by the entrance's one non-committal
   link, and the reading edition of an argument that until now lived only inside
   a run. Two things have to be true of it and neither is self-evident from
   looking at the page in a browser.

   THE JS-OFF HALF. The exported HTML is what a reader with JavaScript off, a
   slow connection, or a hostile network gets. So the assertion is made over
   out/orientation/index.html: every heading the source writes is there, the
   reading path's nine stops are there, and the page's own module carries no
   "use client" and imports nothing that does. A page that renders its argument
   from a client component would look identical in a browser and be empty here.

   THE VOCABULARY HALF. Not a wall — /orientation is not a set-down route and is
   allowed game vocabulary in the Game edition. It is a decision about THIS page:
   it is the one that decides whether a reader trusts the site at all, and the
   frame is a thing to be offered rather than assumed. So the page uses no <Term>
   at all, and the exported Standard-edition HTML contains none of the generated
   game-term list.
   ========================================================================= */
function c26(): CGateResult | null {
  const src = read("app/orientation/page.tsx");
  if (src.includes("RedirectStub")) return null; // still the stub; nothing to assert
  const fails: string[] = [];
  const html = readOut("/orientation");
  if (!html) return { pass: false, details: ["/orientation is not in out/ — the gate proved nothing"] };

  // 1. Server-rendered: the page module and everything it pulls in for the
  //    argument itself must be server-safe.
  if (/^\s*["']use client["']/m.test(src))
    fails.push('app/orientation/page.tsx declares "use client" — the reading floor is the exported HTML, not the hydrated page');

  // 2. Every heading in the source is in the exported HTML.
  const text = textOf(html);
  const headings = [...src.matchAll(/<h2 id="[^"]+">([^<]+)<\/h2>/g)].map((m) => m[1].trim());
  if (headings.length < 7)
    fails.push(`app/orientation/page.tsx writes ${headings.length} headed sections; N-001 asks for seven plus the reading path`);
  for (const h of headings) {
    const plain = h.replace(/&mdash;/g, "—").replace(/&rsquo;/g, "’");
    if (!text.includes(plain)) fails.push(`/orientation: the heading "${plain}" is in the source and not in the exported HTML`);
  }

  // 3. The reading path (N-008) survives the export, with its stops and its
  //    never-skip line. A list generated on the client would not. (The export
  //    uses trailingSlash, so /x#y ships as /x/#y.)
  const stops = [...src.matchAll(/href:\s*"([^"]+)"/g)].map((m) => m[1]);
  const linked = (href: string): boolean => {
    const [path, hash] = href.split("#");
    const withSlash = path.endsWith("/") ? path : `${path}/`;
    const forms = hash ? [`${path}#${hash}`, `${withSlash}#${hash}`] : [path, withSlash];
    return forms.some((f) => html.includes(`href="${f}"`));
  };
  for (const href of stops)
    if (!linked(href)) fails.push(`/orientation: the reading path names ${href} and the exported page does not link it`);
  if (stops.length !== 9)
    fails.push(`/orientation: the reading path has ${stops.length} stops; N-008 asks for nine`);
  if (!containsPhrase(text.toLowerCase(), "triage"))
    fails.push("/orientation: the skip list does not name triage, which is the one thing N-008 says may never be skipped");

  /* 4. NO GAME VOCABULARY IN THE STANDARD-EDITION RENDER — asserted through the
        channel game vocabulary actually uses, not through a phrase list.

        A phrase check against the generated set-down list is the obvious
        implementation and it is the wrong one here, for the reason batch 3
        recorded against C-19: the generated list now contains ordinary English
        words — "resources", "the map", "priority", "branch" — because those are
        Game Guide labels for things the Standard edition calls something else.
        Gate 2 can apply the list to set-down routes because those pages are
        written around it. Applying it to nine hundred words of free prose
        produces false positives on sentences like "gated by resources you did
        not pick", which is not game vocabulary by any reading.

        So the assertion is mechanical instead: every game label on this site
        renders through <Term>, so a page that never calls <Term> and exports no
        element carrying the term class can emit no game label in any edition.
        That is stronger than the phrase list, not weaker: it holds for labels
        added after this gate was written. */
  if (/<Term\b/.test(src) || /from "@\/components\/Term"/.test(src))
    fails.push(
      "app/orientation/page.tsx calls <Term>. This page is the one that decides whether a reader trusts the site at all; the frame is offered here and never assumed, so it uses no edition vocabulary at all (N-001).",
    );
  if (/class="term(\s|"|-)/.test(html))
    fails.push('/orientation exports an element with the term class, so a game label can render on it in the Game edition');

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `/orientation: ${headings.length} headed sections and all ${stops.length} reading-path stops present in the exported HTML, with no client component in the page`,
      "the page calls <Term> nowhere and exports no term element, so no game label can render on it in either edition",
    ],
  };
}

/* =========================================================================
   C-27 (N-012) — every searchable route and every generated milestone route is
   in the search index, and every indexed anchor resolves in out/.
   Plant: drop a milestone route from the generated index.
   =========================================================================
   The row's complaint was that the site's largest sourced content area — the
   twenty-four milestone pages — was invisible to the site's own search box, and
   that a reader typing a word that appears in an <h2> was told the guidance did
   not exist. An index is only worth having if it is complete and if its links
   land, so both halves are asserted, over the generated file and over out/.

   The anchor half is the one that rots: a heading gets its id renamed and the
   index keeps pointing at the old one, which fails silently in a browser. Every
   `path#slug` in the index is resolved against an id in the exported page.
   ========================================================================= */
function c27(): CGateResult | null {
  const file = join(ROOT, "content/generated/search-index.json");
  if (!existsSync(file)) return null;
  const index = JSON.parse(readFileSync(file, "utf8")) as {
    entries: { kind: string; path: string; anchor?: string | null; title: string }[];
  };
  const fails: string[] = [];
  const byKind = (k: string) => index.entries.filter((e) => e.kind === k);

  // 1. Every searchable route.
  const indexed = new Set(byKind("route").map((e) => e.path));
  const searchable = ROUTES.filter((r) => r.searchable).map((r) => r.path);
  for (const p of searchable)
    if (!indexed.has(p)) fails.push(`search index: the searchable route ${p} is not in it — it cannot be found from the site's own search box`);

  // 2. Every generated milestone route.
  const msIndexed = new Set(byKind("milestone").map((e) => e.path));
  for (const p of TIMELINE_MILESTONE_ROUTES)
    if (!msIndexed.has(p))
      fails.push(
        `search index: the milestone route ${p} is missing. The timeline's generated pages are the largest sourced area on the site and are not in ROUTES, so nothing else would notice (N-012).`,
      );

  // 3. Headings actually reached — otherwise the index is the old one wearing a
  //    new file name.
  const headings = byKind("heading");
  if (headings.length < 40)
    fails.push(`search index: only ${headings.length} page headings indexed; the row exists because headings were not reachable at all`);

  // 4. Every anchor resolves in the exported HTML.
  let checked = 0;
  for (const e of index.entries) {
    if (!e.anchor) continue;
    const [path, slug] = e.anchor.split("#");
    const html = readOut(path);
    if (!html) {
      fails.push(`search index: ${e.anchor} points at ${path}, which is not in out/`);
      continue;
    }
    checked++;
    if (!new RegExp(`id="${slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(html))
      fails.push(`search index: the anchor ${e.anchor} does not resolve — no element with that id in the exported page`);
  }

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `search index: ${indexed.size} searchable routes, ${msIndexed.size} milestone pages, ${headings.length} page headings`,
      `all ${checked} indexed anchors resolve to an id in the exported HTML`,
    ],
  };
}

/* =========================================================================
   C-28 (N-023) — the set-down "getting through today" route contains no
   analytical framing word and no instrument link above its first heading.
   Plant: put a /guidance link above the first heading.
   =========================================================================
   This page's whole content is that reading the rest of the site is not a use of
   what a depleted reader has left. A page that says that and then offers six
   more things to open has not said it. Two assertions, both scoped to the
   ARTICLE rather than the whole document, because the chrome's nav and footer
   are not the page and are governed by their own rules.

   THE CLOSED WORD LIST IS PUBLISHED HERE, in the gate, as blueprint §11 requires
   of the lists this batch chooses. These are not bad words. They are the
   vocabulary of a page addressed to somebody with capacity to spend on thinking
   about their situation, and this is the one page written for the evening when
   there is none.
   ========================================================================= */
const REGISTER_ZERO_FORBIDDEN = [
  "constraint",
  "binding",
  "position",
  "instrument",
  "framework",
  "analysis",
  "optimise",
  "optimize",
  "strategy",
  "rank",
  "trade-off",
  "tradeoff",
];

/** Instruments: pages that ask a depleted reader to do something structured. */
const INSTRUMENT_PREFIXES = ["/character", "/guidance", "/play", "/timeline", "/map", "/topics"];

function c28(): CGateResult | null {
  const route = "/situations/getting-through-today";
  const html = readOut(route);
  if (!html) return null;
  const fails: string[] = [];

  // Scope to the page's own article; the chrome is not the page.
  const start = html.indexOf('<article class="prose-page');
  const end = html.indexOf("</article>", start);
  if (start < 0 || end < 0) return { pass: false, details: [`${route}: no reading article found in the export`] };
  const article = html.slice(start, end);
  const text = textOf(article).toLowerCase();

  for (const w of REGISTER_ZERO_FORBIDDEN)
    if (containsPhrase(text, w))
      fails.push(
        `${route} uses the word "${w}". This page is written for a reader with no capacity to spend on thinking about their situation, and analytical vocabulary is the register of the pages that are not for them tonight (N-023).`,
      );

  // Nothing above the first heading may send them to an instrument.
  const firstH2 = article.indexOf("<h2");
  const above = firstH2 < 0 ? article : article.slice(0, firstH2);
  for (const m of above.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (INSTRUMENT_PREFIXES.some((p) => href === p || href.startsWith(`${p}/`)))
      fails.push(
        `${route} links ${href} above its first heading. A page whose content is "stop reading" does not open with somewhere else to go (N-023).`,
      );
  }

  // And the page really is the short one it claims to be.
  const words = textOf(article).trim().split(/\s+/).length;
  if (words > 320) fails.push(`${route} runs to ${words} words; register zero is under two hundred and fifty plus its heading chrome`);

  // The apparatus that belongs on every other reading page belongs nowhere here.
  if (article.includes("evidence-drawer")) fails.push(`${route} renders an evidence drawer`);
  if (article.includes("next-steps")) fails.push(`${route} renders an onward-routing block`);

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `${route}: ${words} words, none of the ${REGISTER_ZERO_FORBIDDEN.length} analytical words, no instrument link above the first heading`,
      "no evidence drawer and no onward-routing block — the page is finished when it has been read",
    ],
  };
}

/* =========================================================================
   C-29 (N-025) — no situation page names a research construct's author or
   authority without an evidence record that says a source was read.
   Plant: add "Maslach" to the breakup page.
   =========================================================================
   A name is the strongest claim a page can make short of a number: it says
   somebody measured this. The archive is full of attributed constructs carried
   without a citation, and lifting one into the trunk would import the authority
   without the source. So the rule is mechanical: over every situation page's
   SOURCE, a name from the closed list below may appear only if the same page
   renders an EvidenceDrawer whose status is "researched" — which the evidence
   apparatus only permits where a source record exists.

   The list is the constructs a page like this is most likely to reach for. It
   is deliberately short and deliberately extensible: a name that is not on it is
   not thereby allowed, it is simply not yet caught, and the register row is the
   place to add one.
   ========================================================================= */
const CONSTRUCT_ATTRIBUTIONS = [
  "Maslach",
  "MBI",
  "ICD-11",
  "ICD-10",
  "DSM-5",
  "DSM-IV",
  "WHO",
  "World Health Organization",
  "World Health Organisation",
  "Kübler-Ross",
  "Kubler-Ross",
];

function c29(): CGateResult | null {
  const dir = join(ROOT, "app/situations");
  if (!existsSync(dir)) return null;
  const fails: string[] = [];
  const checked: string[] = [];

  const pages: string[] = [];
  for (const entry of readdirSync(dir)) {
    const page = join(dir, entry, "page.tsx");
    if (statSync(join(dir, entry)).isDirectory() && existsSync(page)) pages.push(`app/situations/${entry}/page.tsx`);
  }

  for (const rel of pages) {
    const src = read(rel);
    const researched = /status:\s*"researched"/.test(src);
    for (const name of CONSTRUCT_ATTRIBUTIONS) {
      if (!new RegExp(`(^|[^A-Za-z0-9-])${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^A-Za-z0-9-]|$)`).test(src)) continue;
      if (researched) {
        checked.push(`${rel}: attributes "${name}" and carries a researched evidence record`);
      } else {
        fails.push(
          `${rel} names "${name}" without an EvidenceDrawer whose status is "researched". A name is a claim that somebody measured this; carrying it without a fetched source imports the authority and leaves the source behind (N-025, T-1).`,
        );
      }
    }
  }

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `${pages.length} situation pages checked against ${CONSTRUCT_ATTRIBUTIONS.length} construct attributions`,
      checked.length ? checked.join("; ") : "no situation page attributes a research construct at all",
    ],
  };
}

/* =========================================================================
   C-30 (N-041) — the conflict-case section never terminates in a
   recommendation.  Plant: add "you should" to it.
   =========================================================================
   The section names a class of situation where the no-recommendation state is
   the CORRECT output rather than a fallback, and the failure mode is entirely
   predictable: a later edit, wanting to be helpful, adds a sentence telling the
   reader what to do — and the page then quietly asserts that the thing it just
   said does not exist does exist after all.

   THE CLOSED LIST IS PUBLISHED HERE. It is a list of ways of ending a paragraph
   with an answer, not a list of words that are bad. The section is found by its
   own marker in the export, so the gate reads exactly the block the row governs.
   ========================================================================= */
const RECOMMENDATION_PHRASES = [
  "you should",
  "you ought to",
  "the answer is",
  "the right choice",
  "the right answer",
  "the best option",
  "the best choice",
  "we recommend",
  "what you must do",
];

function c30(): CGateResult | null {
  const html = readOut("/situations");
  if (!html || !html.includes("data-conflict-class")) return null;
  const start = html.indexOf("<section", html.indexOf("data-conflict-class") - 400);
  const end = html.indexOf("</section>", start);
  if (start < 0 || end < 0) return { pass: false, details: ["/situations: the conflict-case section is marked but not delimited"] };
  const text = textOf(html.slice(start, end)).toLowerCase();
  const fails: string[] = [];

  for (const phrase of RECOMMENDATION_PHRASES)
    if (text.includes(phrase))
      fails.push(
        `/situations, the "not solvable, only navigable" section, contains "${phrase}". On this class of situation the honest output is a way through and not an answer; a recommendation here contradicts the only claim the section makes (N-041).`,
      );

  // And the section really does route to the two places the row names.
  const block = html.slice(start, end);
  for (const href of ["/character/board", "/guidance"])
    if (!block.includes(`href="${href}`))
      fails.push(`/situations: the conflict section does not link ${href}, so the no-recommendation state has nowhere to be seen`);

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `/situations: the conflict-case section carries none of the ${RECOMMENDATION_PHRASES.length} recommendation phrases`,
      "and routes to the board's conflict step and to guidance's no-recommendation state",
    ],
  };
}

/* =========================================================================
   C-31 (N-111) — every concept cell links a route that actually owns the
   mechanism.  Plant: point a cell at a route that never mentions it.
   =========================================================================
   The concept index owns no explanation: every cell is one line and a door into
   the guide that does. That makes it the single most rot-prone file on the site,
   because a cell can go on pointing at a page long after the page has stopped
   saying anything about the idea, and nothing in a browser would show it.

   The assertion runs over the exported TEXT of the route a cell names — not the
   HTML, so a class name containing the word does not count as an explanation —
   and accepts the concept's own listed aliases, because a page that says
   "buffer" twenty times and "slack" twice still owns slack. This is the
   single-home rule (G-06) with a check on it.
   ========================================================================= */
function c31(): CGateResult | null {
  const file = join(ROOT, "content/concepts.ts");
  if (!existsSync(file)) return null;
  const fails: string[] = [];
  let cells = 0;

  for (const concept of CONCEPTS) {
    if (concept.cells.length === 0) fails.push(`content/concepts.ts: "${concept.name}" has no cells, so it is a row that teaches nothing`);
    for (const cell of concept.cells) {
      cells++;
      const html = readOut(cell.system);
      if (!html) {
        fails.push(`content/concepts.ts: "${concept.name}" points at ${cell.system}, which is not an exported route`);
        continue;
      }
      const text = textOf(html).toLowerCase();
      const names = [concept.name, ...(concept.aliases ?? [])];
      if (!names.some((n) => containsPhrase(text, n)))
        fails.push(
          `content/concepts.ts: "${concept.name}" claims ${cell.system} owns the mechanism, and that page never says "${names.join('" or "')}". A cell is a promise that the explanation is over there (N-111, G-06).`,
        );
    }
  }

  // Every column must be a real route, or the table has a header nothing can fill.
  for (const col of CONCEPT_COLUMNS)
    if (!ROUTES.some((r) => r.path === col.system)) fails.push(`content/concepts.ts: the column "${col.label}" names ${col.system}, which is not a route`);

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `${CONCEPTS.length} concepts, ${cells} cells: every cell's route names the concept or one of its listed aliases in its exported text`,
      `${CONCEPT_COLUMNS.length} table columns, all of them listed routes`,
    ],
  };
}

/* =========================================================================
   C-32 (N-320) — every "Where this connects" card carries a relation from the
   closed list and a non-empty why.  Plant: blank one.
   =========================================================================
   The point of the row is that a reader should know what a link will do for them
   before spending the click. The type system already refuses a NextStep with no
   relation; what it cannot refuse is a why-line that is present and empty, or a
   relation invented on the spot as a string. So the check runs over the exported
   HTML — where a card that renders wrong is visible — and over the closed list
   the primitive publishes.
   ========================================================================= */
function c32(): CGateResult | null {
  const prim = read("components/primitives.tsx");
  if (!prim.includes("data-next-step-relation")) return null;
  const fails: string[] = [];
  // The closed list is READ FROM THE PRIMITIVE, never copied here: a gate that
  // keeps its own copy of the vocabulary stops testing the vocabulary.
  const listBlock = prim.slice(prim.indexOf("export const NEXT_STEP_RELATIONS"), prim.indexOf("] as const;"));
  const allowed = new Set([...listBlock.matchAll(/"([a-z-]+)"/g)].map((m) => m[1]));
  if (allowed.size !== 7)
    fails.push(`components/primitives.tsx publishes ${allowed.size} link relations; the link grammar is a closed list of seven`);
  let cards = 0;
  const routesWithCards: string[] = [];

  for (const r of ROUTES) {
    const html = readOut(r.path);
    if (!html || !html.includes("next-steps")) continue;
    routesWithCards.push(r.path);
    const nav = html.slice(html.indexOf('<nav class="next-steps"'));
    const block = nav.slice(0, nav.indexOf("</nav>"));
    for (const m of block.matchAll(/<li class="next-step">([\s\S]*?)<\/li>/g)) {
      cards++;
      const card = m[1];
      const rel = /data-next-step-relation="([^"]*)"/.exec(card)?.[1];
      const why = /data-next-step-why[^>]*>([^<]*)</.exec(card)?.[1]?.trim();
      const label = textOf(card).trim().slice(0, 60);
      if (!rel) fails.push(`${r.path}: a "Where this connects" card ("${label}") carries no relation`);
      else if (!allowed.has(rel))
        fails.push(`${r.path}: the card "${label}" declares the relation "${rel}", which is not one of the seven the link grammar allows`);
      if (!why)
        fails.push(
          `${r.path}: the card "${label}" carries no why-line. A typed link with nothing said about it is the decoration this row replaced (N-320).`,
        );
    }
  }
  if (cards === 0) fails.push("no typed cross-link cards render anywhere, so the gate is asserting nothing");
  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `${cards} typed cross-links across ${routesWithCards.length} routes: every one carries a relation from the closed list of seven and a non-empty why`,
      `the closed list, as the primitive publishes it: ${[...allowed].join(" · ")}`,
    ],
  };
}

/* =========================================================================
   C-33 (N-321) — the single-home invariant renders on every topic route.
   Plant: remove it from one.
   =========================================================================
   The rule was true before this row and was stated once, on the index, as a
   description of how the site was built. Said on every guide as something a
   reader can report a breach of, it becomes the only kind of maintenance that
   scales — and a promise that nothing here is padding. Asserted over the
   exported HTML of every /topics route, with the reporting route resolving,
   because an invariant whose report button goes nowhere is decoration.
   ========================================================================= */
function c33(): CGateResult | null {
  const file = join(ROOT, "components/SingleHomeNote.tsx");
  if (!existsSync(file)) return null;
  const fails: string[] = [];
  const topicRoutes = ROUTES.filter((r) => r.path === "/topics" || r.path.startsWith("/topics/")).map((r) => r.path);
  for (const route of topicRoutes) {
    const html = readOut(route);
    if (!html) {
      fails.push(`${route}: not exported, so the gate proved nothing about it`);
      continue;
    }
    // Matched on the attribute boundary, not as a substring: a renamed
    // attribute is exactly how this note would disappear from a page.
    if (!/data-single-home[=\s>]/.test(html))
      fails.push(
        `${route} does not render the single-home invariant. The rule is only checkable by readers if it is stated where they are (N-321).`,
      );
    else if (!/data-single-home[=\s>][\s\S]{0,600}?href="\/methodology\/?#corrections/.test(html))
      fails.push(`${route}: the invariant renders without a route to report a breach on, which makes it a description again`);
  }
  if (topicRoutes.length < 5) fails.push(`only ${topicRoutes.length} topic routes found; the gate expects the four guides, the index and the concept table`);
  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [`the invariant and its corrections route render on all ${topicRoutes.length} topic routes: ${topicRoutes.join(", ")}`],
  };
}

/* =========================================================================
   C-34 (N-326) — the game-vocabulary marker never appears in Standard-edition
   output, and never on a set-down route.  Plant: emit it in Standard.
   =========================================================================
   The marker makes the frame legible AS a frame, which is the "model, not
   metaphor" commitment made visible, and it is what lets a reader see where the
   frame is in order to put it down. That only works while it is confined to the
   edition that asked for it.

   Two halves. The EXPORTED HTML is Standard-edition output — every page in out/
   — so the class must appear in none of it. And the SOURCE decision must be
   gated on the same expression that decides whether a game label renders at all,
   so the class cannot escape into Standard or onto a set-down route through some
   other path. The second half is what a plant in the first half proves.

   The set-down clause of §5.3 rides along here: no set-down route carries a
   system tag row either, since both are orientation chrome on a page whose
   reader is not being asked to orient.
   ========================================================================= */
function c34(): CGateResult | null {
  const src = read("components/Term.tsx");
  if (!src.includes("term--marked")) return null;
  const fails: string[] = [];

  // 1. The source gate: the marker is decided by showGame and nothing else.
  if (!/const showMarker = showGame && /.test(src))
    fails.push(
      "components/Term.tsx: the marker is not gated on showGame. showGame is the single expression that already excludes the Standard edition, a set-down frame, and a term with no game label; deciding the marker any other way opens all three (N-326).",
    );

  // 2. The exported HTML is Standard-edition output. The class appears nowhere.
  for (const r of ROUTES) {
    const html = readOut(r.path);
    if (!html) continue;
    if (html.includes("term--marked"))
      fails.push(`${r.path} renders term--marked in the Standard-edition export. The marker belongs to the edition that asked for the frame (N-326).`);
  }

  // 3. §5.3's neighbours: a set-down route carries no system tag row either.
  for (const route of SETDOWN_ROUTES) {
    const rec = ROUTES.find((r) => r.path === route);
    if (rec?.systems?.length)
      fails.push(`content/routes.ts: ${route} is set down and declares system tags. A tag row is orientation chrome and this reader is not being asked to orient (6.0 §5.3).`);
    const html = readOut(route);
    if (html?.includes("data-system-tags"))
      fails.push(`${route} renders a system tag row`);
  }

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      "components/Term.tsx: the marker is gated on the same expression that gates the game label itself",
      `no page in out/ carries term--marked, and none of the ${SETDOWN_ROUTES.length} set-down routes carries a system tag row`,
    ],
  };
}

/* =========================================================================
   C-35 (N-329) — no route flagged with a comic register is set down or
   loss-adjacent.  Plant: flag /situations/breakup.
   =========================================================================
   How a site gets to be funny without being funny in the wrong room. The rule is
   declared per route rather than left to whoever is writing, and it is published
   on /methodology where a reader can see it — which is what makes the humour
   safe rather than risky.

   NO ROUTE IS FLAGGED IN THIS VERSION. That is not a reason to skip the gate: it
   is the reason to write it now, so the first bureaucracy guide inherits a wall
   instead of negotiating one. The gate therefore also asserts that the rule is
   actually published, because an unstated boundary is the thing this row exists
   to replace.
   ========================================================================= */
function c35(): CGateResult | null {
  const routesSrc = read("content/routes.ts");
  if (!routesSrc.includes("LOSS_ADJACENT_ROUTES")) return null;
  const fails: string[] = [];

  for (const r of ROUTES) {
    if (r.register !== "comic") continue;
    if (r.intensity === "down")
      fails.push(
        `content/routes.ts: ${r.path} is flagged comic and is a set-down route. The comic register is permitted on bureaucracy-shaped pages and banned two doors down (N-329).`,
      );
    if (LOSS_ADJACENT_ROUTES.includes(r.path))
      fails.push(
        `content/routes.ts: ${r.path} is flagged comic and is loss-adjacent. It is read by somebody who has just lost something, whatever its intensity says (N-329).`,
      );
  }

  // The loss-adjacent list is not empty and names the two routes the row does.
  for (const path of ["/situations/breakup", "/situations/job-loss"])
    if (!LOSS_ADJACENT_ROUTES.includes(path)) fails.push(`content/routes.ts: LOSS_ADJACENT_ROUTES does not contain ${path}`);
  for (const path of LOSS_ADJACENT_ROUTES)
    if (!ROUTES.some((r) => r.path === path)) fails.push(`content/routes.ts: LOSS_ADJACENT_ROUTES names ${path}, which is not a route`);

  // The rule is published where a reader can see it.
  const method = readOut("/methodology");
  if (!method) fails.push("/methodology is not exported, so the register policy is not published anywhere");
  else {
    const text = textOf(method).toLowerCase();
    if (!text.includes("comic register"))
      fails.push("/methodology does not state the comic-register policy. A boundary that is not published is the thing this row replaces (N-329).");
    if (!method.includes('href="/situations/breakup'))
      fails.push("/methodology states the policy without naming the loss-adjacent route the row names");
  }

  const flagged = ROUTES.filter((r) => r.register === "comic").map((r) => r.path);
  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      flagged.length ? `routes flagged comic: ${flagged.join(", ")} — none set down, none loss-adjacent` : "no route is flagged comic in this version; the rule and its check ship first",
      `loss-adjacent routes: ${LOSS_ADJACENT_ROUTES.join(", ")}`,
      "/methodology publishes the policy and names the loss-adjacent route",
    ],
  };
}

/* =========================================================================
   BATCH 5 — the C suite's board, logs, guidance, position, history gates.
   =========================================================================
   A note on the exported HTML these gates read. Next inlines an RSC flight
   payload in a <script> after the markup, and for a SERVER component that
   payload repeats the page's own attributes — so a naive count of a data
   attribute in out/*.html is doubled on a server page and single on a client
   one. Every gate below that counts or orders elements reads `markup()`, which
   strips the script blocks first. A gate that silently counted twice would be a
   gate whose arithmetic nobody could reproduce.
   ========================================================================= */

/** The rendered markup with the RSC flight payload and every other script removed. */
const markup = (html: string): string => html.replace(/<script[\s\S]*?<\/script>/gi, "");

/* =========================================================================
   C-36 (N-072) — every classifying surface renders a rejection control, and a
   rejected reading renders unweighted.
   Plant: drop the control from one surface → red naming the surface.
   =========================================================================
   THE THREE SURFACES. A classifying surface is one that tells the reader what
   kind of thing their situation is: the board's reading, guidance's ranked
   plans, and the character sheet's layer explanations. Each gets a rejection
   the RENDERING honours, because a button that records a disagreement and then
   changes nothing is worse than no button — it collects the objection and files
   it where the reader cannot see it working.

   WHAT THIS GATE CAN AND CANNOT SEE. All three are client components whose
   rejected state exists only after a click, so the exported HTML never carries
   it and cannot answer the second half. Rendering React inside the C suite is
   not available either: the suite runs under --experimental-strip-types with
   relative specifiers, and there is no JSX transform in it. So the gate asserts
   the structure that makes the honouring possible and the stylesheet that
   performs it — the control exists, the state drives a class, and the class
   strikes the text through. The limitation is named here rather than hidden,
   the way batch 1 named C-2's.

   The storage half is asserted too, and it is not decoration: §7.1 forbids a
   new key, so the flags live INSIDE the existing `board` and `guidance` values.
   A rejection that quietly acquired its own key would be this row's most likely
   failure and would look like nothing at all in the diff.
   ========================================================================= */
function c36(): CGateResult | null {
  const board = read("components/Board.tsx");
  if (!board.includes("data-reject")) return null;
  const fails: string[] = [];
  const details: string[] = [];

  const SURFACES: { rel: string; what: string; rejectedClass: string }[] = [
    { rel: "components/Board.tsx", what: "the board's reading", rejectedClass: "board-reading-result" },
    { rel: "components/Guidance.tsx", what: "guidance's ranked plans", rejectedClass: "plan-card" },
    { rel: "components/CharacterSheet.tsx", what: "the character sheet's panel explanations", rejectedClass: "sheet-layer" },
  ];

  const css = read("app/globals.css");

  for (const s of SURFACES) {
    const src = read(s.rel);
    if (!/data-reject[=\s}]/.test(src)) {
      fails.push(
        `${s.rel}: ${s.what} renders NO [data-reject] control. A classifying surface with no way for the ` +
          `reader to say it is wrong about them is a surface whose authority is a verdict (N-072).`,
      );
      continue;
    }
    // The rendering must HONOUR it: the flag has to reach a class on the card.
    // The class must be applied CONDITIONALLY on the flag. All three surfaces do
    // it the same way — a template literal with a ternary — and asserting the
    // shape rather than a variable name is what stops a rename passing this.
    const honours = /\?\s*" is-rejected"/.test(src);
    if (!honours)
      fails.push(
        `${s.rel}: a rejection control renders but nothing in the component turns the flag into an ` +
          `"is-rejected" class — the disagreement is collected and not honoured (N-072).`,
      );
    // And the stylesheet must actually strike it, not merely tint it.
    const rule = new RegExp(`\\.${s.rejectedClass}\\.is-rejected[^{]*\\{[^}]*line-through`, "s");
    if (!rule.test(css))
      fails.push(
        `app/globals.css: .${s.rejectedClass}.is-rejected does not strike its text through. Colour alone ` +
          `is not a rendering of a rejection (N-072, and the UI standing law).`,
      );
    // A set-level refusal, so "none of these fit" is a complete answer.
    if (!/data-reject-none|data-none-fit-state/.test(src))
      fails.push(`${s.rel}: no set-level "none of these fit" state — the set can be rejected item by item and never as a set (N-072).`);
  }

  // §7.1 — NO NEW STORAGE KEY. The flags live inside the existing values.
  const storage = read("lib/storage.ts");
  const keyBlock = storage.slice(storage.indexOf("export const STORAGE_KEYS"), storage.indexOf("} as const;"));
  const keyCount = [...keyBlock.matchAll(/^\s+\w+:\s*"tgtl:/gm)].length;
  if (keyCount !== 13)
    fails.push(`lib/storage.ts: STORAGE_KEYS has ${keyCount} entries; N-072's flags live inside the existing board and guidance values (§7.1)`);
  if (!/rejected\?:\s*string\[\]/.test(read("content/board.ts")))
    fails.push("content/board.ts: BoardSelections carries no `rejected` list, so the board's flag is not inside the existing board value");
  if (!/rejected\?:\s*string\[\]/.test(read("components/Guidance.tsx")))
    fails.push("components/Guidance.tsx: Inputs carries no `rejected` list, so guidance's flag is not inside the existing guidance value");

  if (fails.length) return { pass: false, details: fails };
  details.push(`all three classifying surfaces render a [data-reject] control and a set-level refusal: ${SURFACES.map((s) => s.rel).join(", ")}`);
  details.push("each turns the flag into an is-rejected class, and globals.css strikes each of the three through rather than tinting it");
  details.push("no new storage key: the flags live inside the existing board and guidance values (thirteen keys, unchanged)");
  details.push(
    "LIMITATION, named: the struck state is asserted structurally (control + class + stylesheet rule). The " +
      "three components are client-only, so out/ never carries the rejected state, and the C suite has no JSX " +
      "transform to render one. The browser walk covers the live behaviour.",
  );
  return { pass: true, details };
}

/* =========================================================================
   C-37 (N-074) — the export path issues no network request.
   Proven red as a browser record: a fetch planted in the handler → red.
   =========================================================================
   2.0's KNOWN_LIMITATIONS named this cost and did nothing about it, because
   doing something looked like breaking local-only. It does not — but the reason
   it does not is a property of the implementation, not of the idea, and that is
   exactly the kind of property that decays. So the source half is asserted
   here (nothing in the export path can reach the network, and the print block
   exists), and the runtime half is a browser record that watches the wire while
   the control is actually pressed.
   ========================================================================= */
function c37(): CGateResult | null {
  const logs = read("components/Logs.tsx");
  if (!logs.includes("data-copy-out")) return null;
  const fails: string[] = [];

  // 1. Nothing in the component may reach the network or a URL, at all.
  const FORBIDDEN: { re: RegExp; why: string }[] = [
    { re: /\bfetch\s*\(/, why: "a fetch()" },
    { re: /XMLHttpRequest/, why: "an XMLHttpRequest" },
    { re: /navigator\.sendBeacon/, why: "a sendBeacon" },
    { re: /new\s+WebSocket/, why: "a WebSocket" },
    { re: /<form[^>]*action=/, why: "a form with an action" },
    { re: /location\.(href|hash|search)\s*=/, why: "a write to the URL" },
    { re: /history\.(pushState|replaceState)/, why: "a history entry" },
  ];
  for (const f of FORBIDDEN)
    if (f.re.test(logs))
      fails.push(`components/Logs.tsx: the records component contains ${f.why}. The export path keeps every byte on the device (N-074, gate 9).`);

  // 2. The two ways out, and the fallback that needs no permission.
  if (!/navigator\.clipboard\.writeText/.test(logs))
    fails.push("components/Logs.tsx: no clipboard write — the copy-out control does not copy anything");
  if (!/readOnly/.test(logs) || !/data-copy-text/.test(logs))
    fails.push("components/Logs.tsx: no read-only textarea fallback for a browser that refuses the clipboard (N-074)");
  if (/<textarea(?![^>]*readOnly)[^>]*data-copy-text/.test(logs))
    fails.push("components/Logs.tsx: the fallback textarea is not read-only — it would be an input the site could interpret (S-6)");
  if (!/window\.print\(\)/.test(logs))
    fails.push("components/Logs.tsx: no print control, so the reader with no clipboard permission has one way out and not two");

  // 3. The print block itself.
  const css = read("app/globals.css");
  if (!/@media print\s*\{/.test(css))
    fails.push("app/globals.css: no @media print block — the print path renders the site's chrome onto paper (N-074)");
  else {
    const printBlock = css.slice(css.indexOf("@media print"));
    for (const hidden of [".site-header", ".site-footer", ".log-form", ".board-reject", ".reset-button"])
      if (!printBlock.includes(hidden))
        fails.push(`app/globals.css: the print block does not remove ${hidden}; a printed record should carry no controls`);
  }

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      "components/Logs.tsx: no fetch, XHR, beacon, socket, form action, URL write or history entry anywhere in the component",
      "two ways out, both local: the Clipboard API, and a read-only textarea for a browser that refuses it",
      "app/globals.css carries an @media print block that removes the chrome and every control",
      "the runtime half is browser gate 137: the control is pressed with the wire watched, and the URL is compared before and after",
    ],
  };
}

/* =========================================================================
   C-38 (N-077) — every planned task declares a stop condition.
   Plant: blank a lane's stop cell → red naming the lane.
   =========================================================================
   A task with no declared end has no state in which it is finished, which makes
   every state a state of not having done enough. That is how a plan becomes a
   stick, and it is a property of the plan rather than of the reader's
   character — which is why it is worth a gate rather than a paragraph.

   Both halves: every lane row in the exported daily plan, and every upkeep item
   the logs component renders. The upkeep half is structural (client-only) and
   is asserted where it can actually fail — the render must emit the cell
   unconditionally, because an item saved before this field existed would
   otherwise render nothing at all and the absence would be invisible.
   ========================================================================= */
function c38(): CGateResult | null {
  const html = readOut("/guidance/daily-plan");
  if (!html || !html.includes("data-lane-stop")) return null;
  const fails: string[] = [];
  const body = markup(html);

  const rows = [...body.matchAll(/class="lane-row"/g)].length;
  const stops = [...body.matchAll(/data-lane-stop/g)].length;
  const minimums = [...body.matchAll(/data-lane-minimum/g)].length;
  const alternatives = [...body.matchAll(/data-lane-alternative/g)].length;
  if (rows === 0) fails.push("/guidance/daily-plan: no lane rows found at all — the gate proved nothing");
  if (stops !== rows) fails.push(`/guidance/daily-plan: ${rows} planned lane(s) and ${stops} stop condition(s). Every planned task declares where it ends (N-077).`);
  if (minimums !== rows) fails.push(`/guidance/daily-plan: ${rows} planned lane(s) and ${minimums} minimum(s). A lane with no minimum cannot survive a bad day intact (N-077).`);
  if (alternatives !== rows) fails.push(`/guidance/daily-plan: ${rows} planned lane(s) and ${alternatives} alternative(s) (N-077).`);

  // Every stop cell must SAY something. A blank cell is the failure this exists for.
  // The cell's own words, with its label removed. The cell is the last in its
  // row, so the first </div> after it closes the row and bounds the window —
  // reading to the first </span> would only ever find the label.
  [...body.matchAll(/data-lane-stop/g)].forEach((m, i) => {
    // From INSIDE the element, not from the attribute: starting at the attribute
    // leaves `="true">` in the window, and `="true">` survives a tag strip
    // (there is no `<` in front of it), so an emptied cell measured twenty-one
    // characters long and the gate reported a green it had not earned. Found by
    // its own plant, which is what the plant is for.
    const from = body.indexOf(">", m.index ?? 0) + 1;
    const to = body.indexOf("</div>", from);
    const seg = body.slice(from, to === -1 ? from + 600 : to);
    const label = seg.match(/class="lane-cell-label"[^>]*>([^<]*)</);
    let text = seg.replace(/<[^>]*>/g, " ");
    if (label) text = text.replace(label[1], " ");
    text = text.replace(/\s+/g, " ").trim();
    if (text.length < 8)
      fails.push(`/guidance/daily-plan: lane ${i + 1} renders a stop cell with nothing in it ("${text}"). An empty stop condition is a lane with no end (N-077).`);
  });

  // The upkeep half: enumerated, always rendered, stored inside the existing value.
  const logs = read("components/Logs.tsx");
  if (!/STOP_OPTIONS\s*=\s*\[/.test(logs))
    fails.push("components/Logs.tsx: the upkeep item has no enumerated stop-condition list (S-6: nothing free-text the site interprets)");
  if (!/data-stop-condition/.test(logs))
    fails.push("components/Logs.tsx: the upkeep item does not render a stop condition");
  // Rendered UNCONDITIONALLY: a `{l.stop && ...}` guard would hide the absence.
  if (/\{l\.stop\s*&&\s*\(/.test(logs))
    fails.push(
      "components/Logs.tsx: the stop condition renders only when set. An item saved before the field existed " +
        "would then render nothing, and a missing stop would be invisible — which is the exact failure this gate is for.",
    );
  if (!/<select[\s\S]{0,220}STOP_OPTIONS/.test(logs))
    fails.push("components/Logs.tsx: the stop condition is not an enumerated <select>");

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `/guidance/daily-plan: all ${rows} lanes render a minimum, an alternative and a non-empty stop condition`,
      `components/Logs.tsx: the upkeep item's stop condition is an enumerated select over ${[...logs.matchAll(/^\s{2}"[^"]+",$/gm)].length ? "a closed list" : "a closed list"}, rendered unconditionally so an absent one is visible`,
    ],
  };
}

/* =========================================================================
   C-39 (N-080) — no ranked output renders without its objective set, its active
   constraints and its horizon printed above it.
   Plant: render the plans above the disclosure → red.
   =========================================================================
   A ranked list with a hidden rule behind it reads as an opinion the site holds
   about the reader's life. The same list with its rule printed above it reads
   as what it is — arithmetic over inputs the reader chose, which changed
   because THEY changed something.

   The assertion is over SOURCE ORDER, not over the export, and deliberately:
   the result step is client-only and renders only after the reader walks to it,
   so out/guidance/index.html carries no `.plan-rank` at all and could never
   fail. Source order is where this actually breaks — the same shape as C-8's
   ordering assertion, and for the same reason. "Above" means above in the JSX
   that produces the DOM, which is what a reader meets.
   ========================================================================= */
function c39(): CGateResult | null {
  const src = read("components/Guidance.tsx");
  if (!src.includes("data-guidance-disclosure")) return null;
  const fails: string[] = [];

  const disclosureAt = src.indexOf("data-guidance-disclosure");
  const rankAt = src.indexOf('className="plan-rank"');
  const firstCardAt = src.indexOf("<PlanCard");
  if (rankAt === -1 && firstCardAt === -1) return null;
  if (disclosureAt === -1)
    fails.push("components/Guidance.tsx: no [data-guidance-disclosure] panel — a ranking renders with its ruleset nowhere (N-080)");
  else {
    if (firstCardAt !== -1 && disclosureAt > firstCardAt)
      fails.push(
        `components/Guidance.tsx: the first <PlanCard> is declared at character ${firstCardAt} and the disclosure at ` +
          `${disclosureAt} — the ranking renders ABOVE the rule that produced it (N-080).`,
      );
    // The three things it has to name, each by its own marker so a rewrite that
    // drops one is caught rather than being absorbed into the paragraph.
    for (const [attr, what] of [
      ["data-disclosure-objectives", "the objective set"],
      ["data-disclosure-constraints", "the active constraints and vetoes"],
      ["data-disclosure-horizon", "the horizon and the ruleset"],
    ] as [string, string][]) {
      if (!src.includes(attr))
        fails.push(`components/Guidance.tsx: the disclosure does not name ${what} (${attr} absent). All three, above any ranking (N-080).`);
    }
    // It must update LIVE — a hardcoded summary is worse than none, because it
    // would go on saying the same thing while the ranking moved underneath it.
    const panel = src.slice(disclosureAt, firstCardAt === -1 ? src.length : firstCardAt);
    if (!/inputs\.(weights|vetoes|health|slack)/.test(panel))
      fails.push("components/Guidance.tsx: the disclosure does not read the live inputs, so it would keep saying the same thing while the ranking moved (N-080)");
    if (!/RANKING_RULESET/.test(panel))
      fails.push("components/Guidance.tsx: the disclosure does not render the published ruleset, so the ordering's rule is still unstated (N-080)");
  }

  // The crisis gate stays FIRST — batch 2's C-8 asserts it, and this row adds a
  // panel above the ranking, which is exactly where that ordering could slip.
  const crisisAt = src.indexOf("const crisisGate");
  const rankFnAt = src.indexOf("const ranked");
  if (crisisAt === -1 || rankFnAt === -1 || crisisAt > rankFnAt)
    fails.push("components/Guidance.tsx: the crisis gate is no longer declared above the ranking (C-8; §5.5) — N-080's panel must not have moved it");

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      "components/Guidance.tsx: the disclosure panel is declared above the first plan card and names the objectives, the constraints and vetoes, and the horizon and ruleset",
      "it reads the live inputs and renders the published RANKING_RULESET, so it moves when the ranking moves",
      "the crisis gate is still declared above the ranking (C-8 unaffected by this row's panel)",
    ],
  };
}

/* =========================================================================
   C-40 (N-091) — no sim token or sim component class appears on the daily plan.
   Plant: add a sim-panel class → red.
   =========================================================================
   The safety-relevant half of this row is the visual distinction. The closer
   the real-world planner and the fiction get — and WHATS_COMING already names
   deeper integration as wanted — the more explicitly they have to look
   different, because the moment a real Tuesday borrows the simulation's
   presentation, the simulation starts reading as a claim about the reader's
   life. Free now, expensive later.
   ========================================================================= */
function c40(): CGateResult | null {
  const html = readOut("/guidance/daily-plan");
  if (!html) return null;
  if (!html.includes("data-plan-separation")) return null;
  const fails: string[] = [];
  const body = markup(html);

  // Sim component classes and sim design tokens, both.
  const classHits = [...body.matchAll(/class="([^"]*\bsim-[a-z0-9-]+[^"]*)"/g)].map((m) => m[1]);
  for (const c of classHits.slice(0, 6))
    fails.push(`/guidance/daily-plan: renders the sim class "${c}". The real day may borrow nothing from the fiction's presentation (N-091).`);
  const tokenHits = [...body.matchAll(/var\(--sim-[a-z0-9-]+\)/g)].map((m) => m[0]);
  for (const t of [...new Set(tokenHits)].slice(0, 6))
    fails.push(`/guidance/daily-plan: renders the sim design token ${t} (N-091)`);
  if (/data-sim-[a-z-]+/.test(body))
    fails.push(`/guidance/daily-plan: renders a data-sim-* attribute — a play-surface marker on the real planner (N-091)`);

  // And the separation has to be STATED, not merely true.
  const sep = body.match(/data-plan-separation[^>]*>([\s\S]*?)<\/p>/);
  const text = sep ? sep[1].replace(/<[^>]*>/g, "").trim() : "";
  if (text.length < 80)
    fails.push("/guidance/daily-plan: the separation sentence is missing or too short to say anything (N-091)");
  else if (!/not a fiction|not randomised|not randomized|no draw/i.test(text))
    fails.push(`/guidance/daily-plan: the separation sentence does not say that this is a real day rather than a fiction: "${text.slice(0, 120)}…"`);

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      "/guidance/daily-plan: no sim- class, no --sim-* token, no data-sim-* attribute in the exported markup",
      "the separation is stated on the page, not merely true of it",
    ],
  };
}

/* =========================================================================
   C-41 (N-093) — every comparison surface closes with the no-winner panel.
   Plant: remove it from one → red naming the surface.
   =========================================================================
   A comparison that simply stops reads as unfinished, and an unfinished
   comparison invites the reader to supply the missing verdict themselves —
   usually the one they arrived with. So the refusal has to BE the closing
   element rather than an absence where one would go, and "last" is asserted
   literally: nothing belonging to the comparison may render after it.

   The surfaces are listed here rather than derived, because "is this page a
   comparison?" is a judgement and a derived list would quietly shrink.
   ========================================================================= */
function c41(): CGateResult | null {
  const cred = readOut("/map/credential-decision");
  if (!cred || !cred.includes("data-no-winner")) return null;
  const fails: string[] = [];

  /** route → the marker for an item of the comparison it closes. */
  const SURFACES: { route: string; itemMarker: RegExp; what: string }[] = [
    { route: "/map/credential-decision", itemMarker: /class="credential-path panel"/g, what: "the three credential paths" },
    { route: "/history", itemMarker: /data-tier-placement/g, what: "the tier board's placements" },
  ];

  for (const s of SURFACES) {
    const html = readOut(s.route);
    if (!html) {
      fails.push(`${s.route}: not exported, so the gate proved nothing about it`);
      continue;
    }
    const body = markup(html);
    // Matched on the attribute BOUNDARY. `data-no-winner-side` contains
    // `data-no-winner` as a substring, so a plain indexOf would find a side
    // after the panel itself had been renamed away and report a green this gate
    // had not earned — the same class of false green batch 4 recorded against
    // C-33's first plant.
    const panelAt = body.search(/data-no-winner[=\s>]/);
    if (panelAt === -1) {
      fails.push(
        `${s.route} compares ${s.what} and does not close with the no-winner panel. A comparison that stops ` +
          `without an explicit refusal invites the reader to supply the verdict (N-093).`,
      );
      continue;
    }
    const items = [...body.matchAll(s.itemMarker)];
    if (items.length === 0) {
      fails.push(`${s.route}: no comparison items found by ${s.itemMarker} — the gate proved nothing`);
      continue;
    }
    const lastItemAt = items[items.length - 1].index ?? 0;
    if (panelAt < lastItemAt)
      fails.push(
        `${s.route}: the no-winner panel renders at ${panelAt}, before the last of ${s.what} at ${lastItemAt}. ` +
          `A refusal placed in the middle of a comparison is a caption, not a close (N-093).`,
      );
    // It has to name what each side emphasises — that is the whole content of
    // an honest refusal, and an empty panel would satisfy a naive check.
    const sides = [...body.slice(panelAt).matchAll(/data-no-winner-side/g)].length;
    if (sides < 2)
      fails.push(`${s.route}: the no-winner panel names ${sides} side(s). It exists to say what EACH side emphasises (N-093).`);
    // And it must not sneak a verdict back in.
    const panelText = body.slice(panelAt, panelAt + 2600).replace(/<[^>]*>/g, " ");
    for (const verdict of ["the best option", "the winner", "the strongest overall", "overall best"])
      if (panelText.toLowerCase().includes(verdict))
        fails.push(`${s.route}: the no-winner panel contains "${verdict}" — the refusal has a verdict in it (N-093)`);
  }

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `both comparison surfaces close on the refusal: ${SURFACES.map((s) => s.route).join(", ")}`,
      "the panel renders after the last item on each, names at least two sides with what each emphasises, and carries no verdict",
    ],
  };
}

/* =========================================================================
   C-42 (N-150) — position produces no rank, band or comparison, and never
   appears in a URL.
   Plant: give a third component the context's position → red naming the file.
   =========================================================================
   This row promotes an existing key to shared state, which is a small change
   with a large blast radius: the reader's position is now readable from every
   client component on the site. The whole safety of it is that only two things
   read it — the control that SETS it, and the note that SELECTS an authored
   paragraph from it. Neither computes anything.

   So the gate is a closed consumer list, and it is deliberately blunt: any
   third reader fails it, even a well-behaved one. A well-behaved third reader
   is how this becomes a scoring input, one honest commit at a time.

   The URL half is asserted at runtime by gate 9's walk, which sets a position
   and then reads every URL it lands on; the static half here is that nothing in
   the tree writes it to one.
   ========================================================================= */
function c42(): CGateResult | null {
  const ctx = read("lib/guide-context.tsx");
  if (!ctx.includes("DEFAULT_POSITION")) return null;
  const fails: string[] = [];

  /** The only two consumers, plus the file that defines the state. */
  const ALLOWED = new Set([
    "lib/guide-context.tsx",
    "components/CredentialFilter.tsx", // PositionControl + the credential comparison
    "components/PositionNote.tsx",
  ]);

  const roots = ["components", "app", "lib", "content"];
  const files: string[] = [];
  const walk = (dir: string) => {
    const abs = join(ROOT, dir);
    if (!existsSync(abs)) return;
    for (const entry of readdirSync(abs)) {
      const rel = `${dir}/${entry}`;
      const full = join(ROOT, rel);
      if (statSync(full).isDirectory()) walk(rel);
      else if (/\.tsx?$/.test(entry)) files.push(rel);
    }
  };
  roots.forEach(walk);

  const consumers: string[] = [];
  for (const rel of files) {
    const src = read(rel);
    const readsKey = /STORAGE_KEYS\.credentialPosition/.test(src);
    // `position` taken off the context, under either name.
    // A destructure from the context, in either order and under either local
    // name, or a direct property read. Written as one shape rather than as a
    // list of the three spellings the tree happens to use today.
    const readsCtx =
      /const\s*\{[^}]*\bposition\b[^}]*\}\s*=\s*useGuide\(\)/.test(src) || /useGuide\(\)\.position\b/.test(src);
    if (!readsKey && !readsCtx) continue;
    consumers.push(rel);
    if (!ALLOWED.has(rel.replace(/\\/g, "/")))
      fails.push(
        `${rel} reads the reader's position. The only permitted consumers are the control that sets it and the ` +
          `note that selects an authored paragraph from it (N-150, C-42) — a third reader is how a filter becomes a score.`,
      );
  }
  if (consumers.length === 0) fails.push("no file reads the position at all — the gate proved nothing");

  // It must never reach the play layer, under any name.
  for (const rel of files.filter((f) => /^(components\/(sim|play)|lib\/(sim|engine)|content\/sim)\//.test(f))) {
    const src = read(rel);
    // Matched on the IMPORT, not on the bare name: content/sim/schema.ts declares
    // its own unrelated `PositionNote` type for a play-surface note, and failing
    // this gate on a coincidence is how a gate gets weakened to make it green.
    if (
      /credentialPosition/.test(src) ||
      /from "@\/components\/PositionNote"/.test(src) ||
      /const\s*\{[^}]*\bposition\b[^}]*\}\s*=\s*useGuide\(\)/.test(src)
    )
      fails.push(`${rel}: the play layer reads the reader's position. Position is a reading-layer filter and never a character (§1, N-150).`);
  }

  // Nothing anywhere may put it in a URL.
  for (const rel of ["components/PositionNote.tsx", "components/CredentialFilter.tsx", "lib/guide-context.tsx"]) {
    const src = read(rel);
    for (const [re, what] of [
      [/location\.(hash|search|href)\s*=/, "a write to the URL"],
      [/URLSearchParams/, "a query-string builder"],
      [/history\.(pushState|replaceState)/, "a history entry"],
    ] as [RegExp, string][])
      if (re.test(src)) fails.push(`${rel}: contains ${what}. Position never enters a URL (gate 9, C-42).`);
  }

  // And it must not be turned into a rank, band, score or count anywhere.
  // Comments stripped first: this file's own header explains that it produces no
  // rank, band or score, and a gate that read its own doctrine as a violation
  // would be unfixable except by deleting the explanation.
  const stripComments = (src: string) => src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");
  const note = stripComments(read("components/PositionNote.tsx"));
  for (const [re, what] of [
    [/\bscore\b/i, "a score"],
    [/\brank(ed|ing)?\b/i, "a rank"],
    [/\bpercentile\b/i, "a percentile"],
    [/[+\-*/]\s*position\.|position\.\w+\s*[+\-*/]/, "arithmetic on the position"],
  ] as [RegExp, string][])
    if (re.test(note)) fails.push(`components/PositionNote.tsx: contains ${what}. The note SELECTS an authored paragraph; it computes nothing (N-150).`);

  // The key itself is the existing one — §7.1 adds none.
  const storage = read("lib/storage.ts");
  const keyBlock = storage.slice(storage.indexOf("export const STORAGE_KEYS"), storage.indexOf("} as const;"));
  if ([...keyBlock.matchAll(/^\s+\w+:\s*"tgtl:/gm)].length !== 13)
    fails.push("lib/storage.ts: STORAGE_KEYS is no longer thirteen entries — N-150 promotes the EXISTING credentialPosition key and adds none (§7.1)");

  // Every page that renders a note must render all three answers' worth of
  // authorship, so a reader who set nothing is not shown a blank.
  const noteUsers = files.filter((f) => /<PositionNote\b/.test(read(f)));
  for (const rel of noteUsers) {
    // The three notes may be inline at the call site or a named constant
    // elsewhere in the file, which is where a shared one naturally lives. What
    // matters is that all three answers are authored in that page's own voice.
    const src = read(rel);
    for (const key of ["yes", "no", "unsure"])
      if (!new RegExp(`\\b${key}:\\s*["\`']`).test(src))
        fails.push(`${rel}: a PositionNote is rendered without a "${key}" note — the reader who has set nothing meets a blank (N-150)`);
  }
  if (noteUsers.length < 5)
    fails.push(`only ${noteUsers.length} page(s) render a position note; the row names five (/map/launch, /topics/work, /topics/money, /situations/job-loss, /guidance)`);

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `the position has exactly ${consumers.length} readers, all permitted: ${consumers.join(", ")}`,
      `${noteUsers.length} pages render a PositionNote, each supplying all three authored answers`,
      "no rank, band, score, percentile or arithmetic in the note; no URL write, query string or history entry in any of the three files",
      "the play layer references it nowhere; STORAGE_KEYS is unchanged at thirteen",
      "the runtime half is gate 9's walk: a position is set, the site is navigated, and no URL carries it",
    ],
  };
}

/* =========================================================================
   C-43 (N-170) — every placement belongs to a named objective, and changing the
   objective changes the board.
   Plant: a placement with no objective → red naming the archetype.
   =========================================================================
   The trunk's own TIER_LIMITS named this as the missing thing. Watching the
   same five positions reorder under "autonomy" versus "era power" is the single
   best demonstration on this site that a tier is a fact about a ruleset and not
   about people — better than any paragraph saying so, because the reader does
   it themselves and sees the letters move.

   Which means the second half of the assertion is the load-bearing one. A
   switch that produced the same board under every setting would be a control
   that teaches the opposite of the lesson: that the ranking is the ranking, and
   the stated objective is decoration.
   ========================================================================= */
function c43(): CGateResult | null {
  const src = read("content/history.ts");
  if (!src.includes("TIER_OBJECTIVES")) return null;
  const fails: string[] = [];

  if (TIER_OBJECTIVES.length < 3)
    fails.push(`content/history.ts: ${TIER_OBJECTIVES.length} objective(s); §3.8 asks for the trunk's era power plus autonomy plus at least one more`);

  const archetypeIds = ARCHETYPES.map((a) => a.id);
  const WEIGHTS = ["very high", "high", "moderate", "low"];

  for (const o of TIER_OBJECTIVES) {
    // Every placement belongs to exactly one objective, both directions.
    for (const id of archetypeIds)
      if (!o.placements[id])
        fails.push(`content/history.ts: objective "${o.id}" has no placement for archetype "${id}" — a position on the board with no ruling under a named objective (N-170)`);
    for (const id of Object.keys(o.placements))
      if (!archetypeIds.includes(id))
        fails.push(`content/history.ts: objective "${o.id}" places "${id}", which is not an archetype on the board (N-170)`);
    // Qualitative weights only. A number here would be a score.
    for (const f of o.factors) {
      if (!WEIGHTS.includes(f.weight))
        fails.push(`content/history.ts: objective "${o.id}" weights "${f.name}" as "${f.weight}", which is not one of ${WEIGHTS.join(" | ")}`);
      if (/\d/.test(String(f.weight)) || /\d/.test(f.name))
        fails.push(`content/history.ts: objective "${o.id}" carries a digit in a factor ("${f.name}: ${f.weight}") — the weights are qualitative (§3.8)`);
    }
    // Every ruling says something, and no ruling carries a digit.
    for (const [id, p] of Object.entries(o.placements)) {
      if (!p.ruling || p.ruling.trim().length < 20)
        fails.push(`content/history.ts: objective "${o.id}", archetype "${id}" has no ruling worth reading`);
      if (/\d/.test(p.ruling))
        fails.push(`content/history.ts: objective "${o.id}", archetype "${id}" has a digit in its ruling — no number on this board (§4.1)`);
    }
    if (!o.notMeasured.length) fails.push(`content/history.ts: objective "${o.id}" declares nothing as not-measured (N-171)`);
    if (!o.unit || !/position/i.test(o.unit))
      fails.push(`content/history.ts: objective "${o.id}" does not declare its unit as a position — the line that stops a tier list ranking people (N-171)`);
  }

  // THE LOAD-BEARING HALF: two objectives must produce two different boards.
  const boardOf = (o: (typeof TIER_OBJECTIVES)[number], side: "before" | "after") =>
    ARCHETYPES.map((a) => `${a.id}:${o.placements[a.id]?.[side] ?? "-"}`).join("|");
  const distinct = new Set(TIER_OBJECTIVES.map((o) => boardOf(o, "after")));
  if (distinct.size < TIER_OBJECTIVES.length)
    fails.push(
      `content/history.ts: ${TIER_OBJECTIVES.length} objectives produce only ${distinct.size} distinct board(s) under the "after" ruleset. ` +
        `A switch that changes nothing teaches that the stated objective is decoration (N-170).`,
    );

  // And the control must exist and be the thing that drives the render.
  const comp = read("components/History.tsx");
  if (!/<select[\s\S]{0,400}TIER_OBJECTIVES/.test(comp))
    fails.push("components/History.tsx: no <select> over the objectives — the board is disclosed and still fixed (N-170)");
  if (!/objective\.placements/.test(comp))
    fails.push("components/History.tsx: the board does not render from the chosen objective's placements (N-170)");
  if (!/data-ruleset-factors/.test(comp))
    fails.push("components/History.tsx: no per-objective factor-weight inspector (N-170)");

  // N-172 — at least one objective refuses the top tier, and says so with the
  // right label. An empty top tier claiming to be evidence-informed would be the
  // same overclaim as a filled one, wearing the opposite costume.
  const emptyS = TIER_OBJECTIVES.filter((o) => !ARCHETYPES.some((a) => o.placements[a.id]?.after === "S" || o.placements[a.id]?.before === "S"));
  if (emptyS.length === 0)
    fails.push("content/history.ts: no objective leaves the S tier empty. N-172: the empty top tier is the most persuasive refusal on the site.");
  for (const o of emptyS)
    if (o.evidence !== "insufficient-evidence")
      fails.push(
        `content/history.ts: objective "${o.id}" leaves the top tier empty and is labelled "${o.evidence}". ` +
          `An empty tier carries "insufficient-evidence" — a refusal has to say why it is refusing (N-172).`,
      );
  if (emptyS.length > 0) {
    /*
     * The RENDERED half of N-172 cannot be read off the export: the board is a
     * client component whose objective defaults to era power, whose top tier is
     * filled, so the exported HTML correctly carries no empty-tier card. What is
     * asserted here is the structure that produces one, and browser gate 143
     * switches the objective for real and looks at the card.
     *
     * The condition is asserted as TOP-TIER-ONLY on purpose. A first pass
     * rendered the explicit empty state for every unoccupied letter, and
     * `EMPTY_TIER_NOTE` is a claim about the top of a board — an ordinary gap in
     * the middle is not a refusal of anything, and dressing it as one spends the
     * credibility the real refusal needs.
     */
    const comp = read("components/History.tsx");
    if (!/data-empty-tier/.test(comp))
      fails.push("components/History.tsx: nothing renders an empty tier as an empty tier — a refusal has to be visible (N-172)");
    if (!/topTierEmpty/.test(comp) || !/TIERS\[0\]/.test(comp))
      fails.push("components/History.tsx: the empty-tier card is not conditioned on the TOP tier being empty (N-172)");
    if (/emptyTiers\.map/.test(comp))
      fails.push(
        "components/History.tsx: the empty-tier card renders for every unoccupied letter. An explicit empty state on an " +
          "ordinary mid-board gap spends the credibility the real refusal needs (N-172).",
      );
    if (!/data-empty-tier-evidence/.test(comp))
      fails.push("components/History.tsx: the empty tier renders without the objective's evidence label beside it (N-172)");
    const body = markup(readOut("/history") ?? "");
    const defaultFillsTop = ARCHETYPES.some((a) => TIER_OBJECTIVES[0].placements[a.id]?.after === "S");
    if (defaultFillsTop && body.includes("data-empty-tier"))
      fails.push(
        `/history: the default objective "${TIER_OBJECTIVES[0].id}" has somebody in its top tier and the exported board still ` +
          `renders an empty-tier card (N-172)`,
      );
  }

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `${TIER_OBJECTIVES.length} objectives (${TIER_OBJECTIVES.map((o) => o.id).join(", ")}), each placing all ${archetypeIds.length} archetypes and placing nothing else`,
      `they produce ${distinct.size} distinct boards under the "after" ruleset — changing the objective changes the letters`,
      "every factor weight is one of the four qualitative words; no digit in any weight, factor name or ruling",
      `${emptyS.length} objective(s) leave the S tier empty on purpose and are labelled insufficient-evidence (N-172): ${emptyS.map((o) => o.id).join(", ")}`,
      "the empty-tier card is conditioned on the TOP tier alone, carries the objective's evidence label, and does not render on the exported default board (whose top tier is filled); browser gate 143 switches the objective and reads the card",
    ],
  };
}

/* =========================================================================
   C-44 (N-171) — no placement renders without the ruleset header above it.
   Plant: render the board above the header → red.
   =========================================================================
   The trunk carried its caveat BELOW the board, which is the wrong side of it:
   by the time a reader reaches the caveat they have read five letters and
   decided what they mean. Declared first, the reader knows what is being ranked
   before they see a rank — and "an economic position, not a demographic group
   or a person" is the single line that stops a tier list from becoming a
   ranking of people.
   ========================================================================= */
function c44(): CGateResult | null {
  const html = readOut("/history");
  if (!html || !html.includes("data-tier-ruleset")) return null;
  const body = markup(html);
  const fails: string[] = [];

  const headerAt = body.indexOf("data-tier-ruleset");
  const firstPlacementAt = body.indexOf("data-tier-placement");
  const firstBadgeAt = body.search(/class="tier-badge/);
  if (firstPlacementAt === -1) fails.push("/history: no placement rendered at all — the gate proved nothing");
  if (headerAt === -1) fails.push("/history: the board renders no ruleset header (N-171)");
  else {
    for (const [at, what] of [
      [firstPlacementAt, "the first placement"],
      [firstBadgeAt, "the first tier letter"],
    ] as [number, string][]) {
      if (at !== -1 && at < headerAt)
        fails.push(
          `/history: ${what} renders at ${at}, above the ruleset header at ${headerAt}. The reader meets a letter ` +
            `before learning what is being ranked, which is the arrangement this row exists to reverse (N-171).`,
        );
    }
    // The five declarations, each by its own marker.
    for (const [attr, what] of [
      ["data-ruleset-objective", "the objective"],
      ["data-ruleset-unit", "the unit"],
      ["data-ruleset-factors", "the priority factors"],
      ["data-ruleset-not-measured", "the not-measured list"],
      ["data-ruleset-evidence", "the evidence state"],
    ] as [string, string][])
      if (!body.includes(attr)) fails.push(`/history: the ruleset header does not declare ${what} (${attr} absent) — N-171 names all five`);

    // The not-measured list is LITERAL: these seven, in the header, above the letters.
    const headerBlock = body.slice(headerAt, firstPlacementAt === -1 ? body.length : firstPlacementAt).toLowerCase();
    for (const item of TIER_NOT_MEASURED)
      if (!headerBlock.includes(item.toLowerCase()))
        fails.push(`/history: the not-measured list above the board omits "${item}" (N-171)`);
    if (!/position/.test(headerBlock) || !/not a demographic group|not a demographic|never a person|not a person/.test(headerBlock))
      fails.push('/history: the unit does not say that what is ranked is a position and not a demographic group or a person (N-171)');
  }

  // TIER_DISCLAIMER and TIER_LIMITS both survive.
  if (!body.includes("tier-disclaimer")) fails.push("/history: the standing disclaimer no longer renders (§2.1 — it stays)");
  if (!body.includes("tier-limits")) fails.push("/history: TIER_LIMITS no longer renders (§2.1 — it stays)");
  // Its apology for the missing switch is now false, and must have gone.
  const limits = read("content/history.ts");
  const limitsText = limits.slice(limits.indexOf("export const TIER_LIMITS"));
  if (/would let you re-weight the factors/.test(limitsText))
    fails.push("content/history.ts: TIER_LIMITS still apologises for the absence of the objective switch, which now exists (N-170/N-171)");

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `/history: the ruleset header renders at ${headerAt}, above the first placement at ${firstPlacementAt} and the first tier letter at ${firstBadgeAt}`,
      "it declares the objective, the unit, the priority factors, all seven not-measured items, and the evidence state",
      "the standing disclaimer and TIER_LIMITS both still render; TIER_LIMITS no longer apologises for a switch that exists",
    ],
  };
}

/* =========================================================================
   C-45 (N-281) — every route that cites a disanalogy links a numbered entry,
   and every entry lists at least one inheriting route that exists AND cites it.
   =========================================================================
   The register's whole value is that it is INHERITED rather than restated, and
   an inheritance breaks silently in two different directions. A page can cite an
   entry that has been renumbered or removed, which leaves a reader following a
   link into nothing. And an entry can claim a page that has quietly stopped
   citing it, which leaves the register describing a site that no longer exists.

   Both halves are asserted over the EXPORTED HTML, because a `ModelBreak` that a
   page imports and never renders would satisfy a source check.
   ========================================================================= */
function c45(): CGateResult | null {
  const methodology = readOut("/methodology");
  if (!methodology || !methodology.includes("data-break=")) return null;
  const fails: string[] = [];
  const details: string[] = [];

  // 1. The register itself: unique numbers, unique ids, and nothing claiming
  //    nobody. An entry with no inheriting route is humility that no page ever
  //    meets, which is the state this row exists to end.
  const seenN = new Set<number>();
  const seenId = new Set<string>();
  for (const d of DISANALOGIES) {
    if (seenN.has(d.n)) fails.push(`content/methodology.ts: two disanalogy entries carry the number ${d.n}`);
    if (seenId.has(d.id)) fails.push(`content/methodology.ts: two disanalogy entries carry the id "${d.id}"`);
    seenN.add(d.n);
    seenId.add(d.id);
    if (!d.inheritedBy || d.inheritedBy.length === 0)
      fails.push(`content/methodology.ts: disanalogy ${d.n} ("${d.title}") lists no inheriting route — an unread break is not a published one (N-281)`);
    if (!methodology.includes(`id="break-${d.n}"`))
      fails.push(`/methodology: no anchor id="break-${d.n}" for entry ${d.n} ("${d.title}") — pages link that anchor`);
  }

  // 2. FORWARD: every route an entry claims exists, and renders the citation.
  for (const d of DISANALOGIES) {
    for (const route of d.inheritedBy) {
      const rec = ROUTES.find((r) => r.path === route);
      if (!rec) {
        fails.push(
          `content/methodology.ts: disanalogy ${d.n} ("${d.title}") is inherited by "${route}", which is not a route in the inventory`,
        );
        continue;
      }
      const html = readOut(route);
      if (html === null) {
        fails.push(`disanalogy ${d.n}: ${route} is in the inventory but was not exported, so the citation could not be checked`);
        continue;
      }
      if (!html.includes(`data-model-break="${d.n}"`))
        fails.push(
          `${route}: disanalogy ${d.n} ("${d.title}") claims this page inherits it, and the page carries no ModelBreak for it (N-281)`,
        );
    }
  }

  // 3. REVERSE: every citation in the whole export resolves, and is claimed back.
  let citations = 0;
  for (const rec of ROUTES) {
    const html = readOut(rec.path);
    if (html === null) continue;
    for (const m of html.matchAll(/data-model-break="(\d+)"/g)) {
      citations++;
      const n = Number(m[1]);
      const entry = DISANALOGIES.find((d) => d.n === n);
      if (!entry) {
        fails.push(`${rec.path}: cites disanalogy ${n}, which does not exist in the register`);
        continue;
      }
      if (!entry.inheritedBy.includes(rec.path))
        fails.push(
          `${rec.path}: cites disanalogy ${n} ("${entry.title}") and the entry does not list this route in inheritedBy — the register would describe a site that no longer exists`,
        );
    }
  }

  if (fails.length) return { pass: false, details: fails };
  details.push(
    `${DISANALOGIES.length} numbered disanalogies, each anchored on /methodology and each inherited by at least one route`,
  );
  details.push(`${citations} ModelBreak citations across the export, every one resolving to an entry that claims it back`);
  details.push(
    DISANALOGIES.map((d) => `${d.n} ${d.id} [${d.severity}/${d.status}] → ${d.inheritedBy.join(", ")}`).join(" · "),
  );
  return { pass: true, details };
}

/* =========================================================================
   C-46 (N-290) — the retractions section renders with zero entries.
   =========================================================================
   The failure this catches is not a missing section. It is a section that hides
   itself while it is empty and comes into existence with its first entry, which
   is precisely the mechanism-invented-under-pressure the row refuses. So it is
   asserted twice: the exported page carries the section and its empty state
   while `RETRACTIONS` is empty, and the SOURCE does not gate the heading on
   there being anything to show.
   ========================================================================= */
function c46(): CGateResult | null {
  const html = readOut("/methodology");
  if (!html || !html.includes('id="retractions"')) return null;
  const fails: string[] = [];
  const src = read("app/methodology/page.tsx");

  if (!html.includes('id="retractions"'))
    fails.push('/methodology: no id="retractions" — the register a page links to has to be there before the first entry');

  const text = textOf(html).toLowerCase();
  // The standing sentence is the row's substance, not decoration.
  if (!text.includes("invented after the first error"))
    fails.push('/methodology: the retractions section no longer says that a mechanism invented after the first error is not a mechanism (N-290)');
  // The format is published while it is empty: what was said, kept and struck.
  if (!text.includes("struck through"))
    fails.push("/methodology: the retractions section does not say the original text is kept and struck through, which is the format it commits to (N-290)");

  if (RETRACTIONS.length === 0) {
    // The RENDERED attribute, with its value. Next.js also emits every prop into
    // its own flight payload as `data-retractions-empty\":true`, so a bare
    // substring check passes on a page whose element was removed — which is the
    // failure this gate exists to catch, and the first plant found it.
    if (!html.includes('data-retractions-empty="true"'))
      fails.push(
        "/methodology: RETRACTIONS is empty and the section renders no empty state — a register that appears with its first entry is not a published mechanism (N-290)",
      );
  } else if (!html.includes('data-retraction="')) {
    fails.push(`/methodology: ${RETRACTIONS.length} retraction(s) recorded and none rendered`);
  }

  // The source half: the heading is unconditional. A conditional heading passes
  // the rendered check on the day somebody adds an entry and fails a reader on
  // every day before that.
  const headingLine = src.split("\n").find((l) => l.includes('id="retractions"')) ?? "";
  if (/RETRACTIONS\.length\s*>\s*0\s*&&/.test(headingLine))
    fails.push(
      "app/methodology/page.tsx: the retractions heading is rendered conditionally on there being entries — the section is required to render empty (N-290)",
    );
  if (!/RETRACTIONS\.length === 0 \?/.test(src))
    fails.push("app/methodology/page.tsx: no explicit empty state for the retractions register");

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `/methodology renders the retractions register with ${RETRACTIONS.length} entries, its format published, and an explicit empty state`,
      "the heading is unconditional in source: the section cannot come into existence with its first entry",
    ],
  };
}

/* =========================================================================
   C-47 (N-291) — a page changed by a logged correction renders a revision note.
   =========================================================================
   A silent fix converts a reader's correction into the editors' foresight. The
   register knowing about a change is not the same as the page saying so, and the
   gap between the two is where a site's history quietly improves. Asserted in
   both directions so that neither the note nor the record can drift alone.
   ========================================================================= */
function c47(): CGateResult | null {
  const withPages = CORRECTIONS.filter((c) => c.pages && c.pages.length > 0);
  if (withPages.length === 0) return null;
  const fails: string[] = [];
  const details: string[] = [];

  for (const c of withPages) {
    for (const route of c.pages ?? []) {
      const rec = ROUTES.find((r) => r.path === route);
      if (!rec) {
        fails.push(`content/methodology.ts: correction ${c.id} names "${route}", which is not a route in the inventory`);
        continue;
      }
      const html = readOut(route);
      if (html === null) {
        fails.push(`correction ${c.id}: ${route} was not exported, so the revision note could not be checked`);
        continue;
      }
      if (!html.includes(`data-revision-note="${c.id}"`))
        fails.push(
          `${route}: correction ${c.id} says this page changed and the page renders no revision note naming it — a silent fix (N-291)`,
        );
      // The note carries the register's own words, not a paraphrase that can drift.
      const text = textOf(html);
      if (html.includes(`data-revision-note="${c.id}"`) && !text.includes(c.summary))
        fails.push(`${route}: the revision note does not carry correction ${c.id}'s summary as the register states it`);
      if (html.includes(`data-revision-note="${c.id}"`) && !text.includes(c.date))
        fails.push(`${route}: the revision note for ${c.id} carries no date`);
    }
  }

  // REVERSE: a note on a page the register does not name is a claim with no record.
  for (const rec of ROUTES) {
    const html = readOut(rec.path);
    if (html === null) continue;
    for (const m of html.matchAll(/data-revision-note="([^"]+)"/g)) {
      const id = m[1];
      const c = CORRECTIONS.find((x) => x.id === id);
      if (!c) {
        fails.push(`${rec.path}: renders a revision note for "${id}", which is not in the corrections register`);
        continue;
      }
      if (!(c.pages ?? []).includes(rec.path))
        fails.push(`${rec.path}: renders a revision note for ${id}, and the register does not list this page as changed by it`);
    }
  }

  if (fails.length) return { pass: false, details: fails };
  details.push(
    `${withPages.length} correction(s) name a changed page; every named page renders the note with the register's date and summary`,
  );
  for (const c of withPages) details.push(`${c.id} → ${(c.pages ?? []).join(", ")}`);
  return { pass: true, details };
}

/* =========================================================================
   C-48 (N-296) — every non-stub route records what it changes.
   =========================================================================
   The admission test is only a boundary if every page has had to clear it. The
   type makes the field required; this makes it non-empty and a sentence, because
   the cheap way past a required string is an empty one, and the next cheapest is
   a copy of the summary — which answers "what is this page about" rather than
   "what does it change for the reader".
   ========================================================================= */
function c48(): CGateResult | null {
  if (!ROUTES.some((r) => r.changes)) return null;
  const fails: string[] = [];
  const real = ROUTES.filter((r) => !r.stub);

  for (const r of real) {
    const c = (r.changes ?? "").trim();
    if (!c) {
      fails.push(`content/routes.ts: ${r.path} records no answer to what it changes for the reader — the admission test is not optional (N-296)`);
      continue;
    }
    if (c.length < 30)
      fails.push(`content/routes.ts: ${r.path}'s "changes" is too short to be an answer: "${c}"`);
    if (c === r.summary)
      fails.push(`content/routes.ts: ${r.path}'s "changes" is a copy of its summary — what a page is about is not what it changes (N-296)`);
  }

  // The test itself is published, or the boundary is private and unenforceable.
  const html = readOut("/methodology");
  if (html === null) fails.push("/methodology was not exported");
  else {
    if (!html.includes('id="admission-test"'))
      fails.push('/methodology: the admission test is not published under id="admission-test" (N-296)');
    const text = textOf(html).toLowerCase();
    if (!text.includes("changes a decision or an orientation"))
      fails.push("/methodology: the admission test's sentence is not on the page in its own words (N-296)");
  }

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      `${real.length} non-stub routes each record the decision or orientation they change, in a sentence of their own`,
      "the test is published on /methodology#admission-test, so a reader can hold the site to its own scope",
    ],
  };
}

/* =========================================================================
   C-49 (N-301) — every perishable route renders a stamp and a review date.
   =========================================================================
   A declared property that does not reach the page is worse than no property at
   all: the inventory says the page is dying and the reader meets a page that
   claims permanence. Both directions again — a stamp on a route nobody flagged
   is a date with no maintenance behind it.
   ========================================================================= */
function c49(): CGateResult | null {
  const flagged = ROUTES.filter((r) => r.perishable);
  if (flagged.length === 0) return null;
  const fails: string[] = [];

  for (const r of flagged) {
    const date = r.perishable?.reviewBy ?? "";
    if (!/^\d{4}(-\d{2}){0,2}$/.test(date))
      fails.push(`content/routes.ts: ${r.path}'s review date "${date}" is not a plain ISO date`);
    const html = readOut(r.path);
    if (html === null) {
      fails.push(`${r.path}: flagged perishable and not exported`);
      continue;
    }
    if (!html.includes(`data-perishable="${date}"`))
      fails.push(`${r.path}: flagged perishable in the inventory and renders no staleness stamp (N-301)`);
    if (!textOf(html).includes(date))
      fails.push(`${r.path}: renders a perishable marker with no visible review date — the date is the whole content of the stamp (N-301)`);
  }

  for (const r of ROUTES) {
    const html = readOut(r.path);
    if (html === null) continue;
    if (html.includes("data-perishable=") && !r.perishable)
      fails.push(`${r.path}: renders a review date and is not flagged perishable in the inventory — a date nobody is maintaining`);
  }

  // The class is published, not private to the route file.
  const meth = readOut("/methodology");
  if (meth && !meth.includes('id="planned-obsolescence"'))
    fails.push("/methodology: the rule that some pages are supposed to expire is not published (N-301)");

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      flagged.map((r) => `${r.path} → review by ${r.perishable?.reviewBy}`).join(" · "),
      "each renders the stamp with its date; no unflagged route renders one; the rule is published on /methodology#planned-obsolescence",
    ],
  };
}

/* =========================================================================
   C-50 (N-302) — planned badges and WHATS_COMING resolve in both directions.
   =========================================================================
   The single-source rule (2.0 §6.9, extended by 6.0 §2.3.2) is the thing being
   protected: the inline cards are DERIVED, so an orphan badge means somebody has
   started naming unbuilt scope in a second place, and an entry that renders on no
   index means the reader still has to go looking for the hole.

   WHAT THIS GATE DOES NOT COVER, said out loud: entries whose area is "play".
   The play layer was outside batch 6's licence, so `/play` renders no planned
   cards and the entries reach a reader only through the list on /methodology. The
   gate asserts that much rather than passing over them in silence.
   ========================================================================= */
const AREA_INDEX: Record<string, string> = {
  topics: "/topics",
  situations: "/situations",
  history: "/history",
  methodology: "/methodology",
  timeline: "/timeline",
  play: "/play",
};
const AREAS_WITH_CARDS = ["topics", "situations", "history"];

function c50(): CGateResult | null {
  if (!Array.isArray(WHATS_COMING) || WHATS_COMING.length === 0) return null;
  if (typeof (WHATS_COMING as unknown as { id?: string }[])[0]?.id !== "string") return null;
  const fails: string[] = [];
  const details: string[] = [];

  const ids = new Set<string>();
  for (const w of WHATS_COMING) {
    if (ids.has(w.id)) fails.push(`content/methodology.ts: two WHATS_COMING entries carry the id "${w.id}"`);
    ids.add(w.id);
    if (!AREA_INDEX[w.area]) fails.push(`content/methodology.ts: "${w.id}" declares an area with no index: ${w.area}`);
  }

  // Everything is named in the single source, whatever else renders it.
  const meth = readOut("/methodology");
  if (meth === null) fails.push("/methodology was not exported");
  else
    for (const w of WHATS_COMING)
      if (!meth.includes(`data-coming="${w.id}"`))
        fails.push(`/methodology: "${w.id}" is not in the what's-coming list — that list is the only place unbuilt scope is named (2.0 §6.9)`);

  // FORWARD: an entry for an index this batch renders meets the reader there.
  for (const w of WHATS_COMING) {
    if (!AREAS_WITH_CARDS.includes(w.area)) continue;
    const index = AREA_INDEX[w.area];
    const html = readOut(index);
    if (html === null) {
      fails.push(`${index}: not exported, so "${w.id}" could not be checked`);
      continue;
    }
    if (!html.includes(`data-planned="${w.id}"`))
      fails.push(`${index}: WHATS_COMING entry "${w.id}" declares area "${w.area}" and renders no planned card there (N-302)`);
  }

  // REVERSE: every badge anywhere in the export resolves to an entry.
  let badges = 0;
  for (const r of ROUTES) {
    const html = readOut(r.path);
    if (html === null) continue;
    for (const m of html.matchAll(/data-planned="([^"]+)"/g)) {
      badges++;
      if (!ids.has(m[1]))
        fails.push(`${r.path}: renders a planned badge for "${m[1]}", which is not a WHATS_COMING entry — unbuilt scope named in a second place (N-302)`);
    }
  }

  // A route's own pointer resolves too.
  for (const r of ROUTES)
    if (r.planned && !ids.has(r.planned))
      fails.push(`content/routes.ts: ${r.path} points at planned entry "${r.planned}", which does not exist`);

  const playEntries = WHATS_COMING.filter((w) => w.area === "play");
  if (fails.length) return { pass: false, details: fails };
  details.push(`${WHATS_COMING.length} WHATS_COMING entries, every one named in the list on /methodology`);
  details.push(`${badges} planned badges across the export, every one resolving to an entry`);
  details.push(
    `areas rendering cards: ${AREAS_WITH_CARDS.join(", ")}; NOT COVERED: ${playEntries.length} entries in area "play" (${playEntries
      .map((w) => w.id)
      .join(", ")}) — /play was outside batch 6's licence, so those reach a reader through the list alone`,
  );
  return { pass: true, details };
}

/* =========================================================================
   C-51 (N-306) — a pre-existing tgtl: library survives a suite run byte-identical.
   =========================================================================
   The substance is a browser assertion (browser gate 151), because the claim is
   about what a suite run does to a real profile and no static read can see that.
   What is asserted HERE is the structural half a browser run cannot: that neither
   suite still holds a bare delete loop, and that both go through the shared
   preserve-and-restore path — a suite that reimplemented its own clearing would
   pass the browser gate and lose the next reader's saves.
   ========================================================================= */
function c51(): CGateResult | null {
  if (!existsSync(join(ROOT, "tests/lib-preserve.mjs"))) return null;
  const fails: string[] = [];
  const preserve = read("tests/lib-preserve.mjs");

  for (const fn of ["preserveThenClear", "restorePreserved", "readLibrary"])
    if (!preserve.includes(`export async function ${fn}`) && !preserve.includes(`export function ${fn}`))
      fails.push(`tests/lib-preserve.mjs: no ${fn} — the two suites share this or they do not share anything`);

  for (const rel of ["tests/browser-gates.mjs", "tests/s9-ui.mjs"]) {
    const src = read(rel);
    if (!src.includes('from "./lib-preserve.mjs"'))
      fails.push(`${rel}: does not use the shared preservation helpers (N-306)`);
    if (!src.includes("preserveThenClear("))
      fails.push(`${rel}: does not snapshot before clearing`);
    if (!src.includes("restorePreserved("))
      fails.push(`${rel}: never restores what it cleared`);
    // The defect itself: a loop that removes tgtl keys without recording them.
    const bare = [...src.matchAll(/localStorage\.removeItem\(k\)/g)].length;
    if (bare > 0)
      fails.push(
        `${rel}: still deletes ${bare} localStorage key(s) directly — every clear goes through preserveThenClear so a reader's library is recorded first (N-306)`,
      );
  }

  // The restore has to survive the failure path, which is the run where it matters.
  if (!/finally\s*\{[\s\S]{0,120}restorePreserved/.test(preserve))
    fails.push("tests/lib-preserve.mjs: withPreservedLibrary does not restore in a finally — a failing suite is the run that eats the library");

  if (fails.length) return { pass: false, details: fails };
  return {
    pass: true,
    details: [
      "both suites clear through tests/lib-preserve.mjs: record every tgtl: key, remove what the walk needs gone, put it all back before the context closes",
      "neither suite contains a bare removeItem loop; the restore also runs on the failure path",
      "the byte-identity claim is proven live by browser gate 151 (a seeded library, the suite's own clear-and-walk, then a full comparison)",
    ],
  };
}

export const GATES: CGate[] = [
  { id: 1, row: "N-226", name: "A failed or unverified write never reports saved", proof: "record", run: c1 },
  { id: 2, row: "N-190", name: "A rendered failure mode carries its tied recovery route", proof: "probe", run: c2 },
  { id: 3, row: "N-191", name: "Every switchingCost renders on its option card", proof: "record", run: c3 },
  { id: 4, row: "N-260", name: "No region label broader than verified coverage", proof: "probe", run: c4 },
  { id: 5, row: "N-160", name: "The map lens settings render identical content or cite a source", proof: "probe", run: c5 },
  { id: 6, row: "N-263", name: "Double-Escape exits every set-down route", proof: "record", run: c6 },
  { id: 7, row: "N-267", name: "Every fixture region has a SAFETY_SOURCES entry, dated", proof: "probe", run: c7 },
  { id: 8, row: "N-268", name: "The safety check precedes every ordering", proof: "probe", run: c8 },
  { id: 9, row: "N-272", name: "Set-down lint carries no evidence-label word", proof: "probe", run: c9 },
  { id: 10, row: "N-273", name: "No caring-duty record names a companion or condition", proof: "probe", run: c10 },
  { id: 11, row: "N-192", name: "One draw-vary pair renders the same-outcome reading", proof: "probe", run: c11 },
  { id: 12, row: "N-194", name: "Repeat-last-season commits an ordered set and replays byte-identical", proof: "record", run: c12 },
  { id: 13, row: "N-195", name: "Methodology names the Lab seed curation tool and criterion", proof: "probe", run: c13 },
  { id: 14, row: "N-204", name: "Every season screen carries its origin motif", proof: "record", run: c14 },
  { id: 15, row: "N-211", name: "No option renders without the five contract fields", proof: "probe", run: c15 },
  { id: 16, row: "N-212", name: "previewAction is pure", proof: "probe", run: c16 },
  { id: 17, row: "N-213", name: "Upkeep is present and affordable in the worst envelope", proof: "probe", run: c17 },
  { id: 18, row: "N-214", name: "The narrowing door state never uses the open token", proof: "probe", run: c18 },
  { id: 19, row: "N-233", name: "No valence colour pair; no forbidden-register term in Game Guide", proof: "probe", run: c19 },
  { id: 20, row: "N-216", name: "A reopened season renders its stored explanation", proof: "record", run: c20 },
  { id: 21, row: "N-218", name: "The empty queue states that uncertainty remains", proof: "probe", run: c21 },
  { id: 22, row: "N-225", name: "Every Lab situation declares an unknown before the branches", proof: "probe", run: c22 },
  { id: 23, row: "N-228", name: "Every SimState field the engine reads has a mid-run surface", proof: "probe", run: c23 },
  { id: 24, row: "N-235", name: "No Try-in-Play link on a set-down route", proof: "probe", run: c24 },
  { id: 25, row: "N-355", name: "Every parse panel declares recorded / interpreted / unknowable", proof: "probe", run: c25 },
  { id: 26, row: "N-001", name: "/orientation renders JS-off with no game term in Standard", proof: "probe", run: c26 },
  { id: 27, row: "N-012", name: "Every route and milestone page is in the search index; anchors resolve", proof: "probe", run: c27 },
  { id: 28, row: "N-023", name: "Getting-through-today: no analytical framing, no instrument link above the fold", proof: "probe", run: c28 },
  { id: 29, row: "N-025", name: "No research construct attributed without an evidence record", proof: "probe", run: c29 },
  { id: 30, row: "N-041", name: "The conflict section carries no recommendation verb", proof: "probe", run: c30 },
  { id: 31, row: "N-111", name: "Every concept cell links the route that owns the mechanism", proof: "probe", run: c31 },
  { id: 32, row: "N-320", name: "Every NextStep carries a relation from the closed list and a why", proof: "probe", run: c32 },
  { id: 33, row: "N-321", name: "The single-home invariant renders on every topic route", proof: "probe", run: c33 },
  { id: 34, row: "N-326", name: "The term marker never renders in Standard or on set-down routes", proof: "probe", run: c34 },
  { id: 35, row: "N-329", name: "No comic-register route is set-down or loss-adjacent", proof: "probe", run: c35 },
  { id: 36, row: "N-072", name: "Every classifying surface offers a rejection honoured in rendering", proof: "probe", run: c36 },
  { id: 37, row: "N-074", name: "The export path issues no network request", proof: "record", run: c37 },
  { id: 38, row: "N-077", name: "Every planned task declares a stop condition", proof: "probe", run: c38 },
  { id: 39, row: "N-080", name: "No ranked output without objective, constraints and horizon above it", proof: "probe", run: c39 },
  { id: 40, row: "N-091", name: "No sim token or class on the daily plan", proof: "probe", run: c40 },
  { id: 41, row: "N-093", name: "Every comparison closes with the no-winner panel", proof: "probe", run: c41 },
  { id: 42, row: "N-150", name: "Position produces no rank, band or comparison and never enters a URL", proof: "probe", run: c42 },
  { id: 43, row: "N-170", name: "Every placement belongs to a named objective; changing it changes the board", proof: "probe", run: c43 },
  { id: 44, row: "N-171", name: "No placement renders without the ruleset header", proof: "probe", run: c44 },
  { id: 45, row: "N-281", name: "Disanalogy entries and their inheriting routes resolve both ways", proof: "probe", run: c45 },
  { id: 46, row: "N-290", name: "The retractions register renders when empty", proof: "probe", run: c46 },
  { id: 47, row: "N-291", name: "A page changed by a logged correction renders a revision note", proof: "probe", run: c47 },
  { id: 48, row: "N-296", name: "Every new route records what it changes", proof: "probe", run: c48 },
  { id: 49, row: "N-301", name: "Every perishable route renders a stamp and review date", proof: "probe", run: c49 },
  { id: 50, row: "N-302", name: "Planned badges and WHATS_COMING ids match both ways", proof: "probe", run: c50 },
  { id: 51, row: "N-306", name: "A pre-existing saved library survives a suite run byte-identical", proof: "record", run: c51 },
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
