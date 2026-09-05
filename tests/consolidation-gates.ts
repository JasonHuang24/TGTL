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
import { ROOT, OUT_DIR, containsPhrase, textOf } from "./util.ts";
import { HOTLINE_GROUPS, NATIONS, UK_NATIONS, hotlineRegions, ALL_HOTLINES } from "../content/hotlines.ts";
import { SETDOWN_FORBIDDEN_TERMS } from "../content/terminology.ts";
import { STATUS_LABEL } from "../content/evidence.ts";
import { SETDOWN_ROUTES } from "../content/routes.ts";

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
