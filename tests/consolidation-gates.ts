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
import { CONCEPTS, CONCEPT_COLUMNS } from "../content/concepts.ts";
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
