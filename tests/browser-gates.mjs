/**
 * Browser gates for TGTL 4.0 — the inherited browser half (console cleanliness,
 * state preservation + reset, 320px responsive, runtime local-only, keyboard) plus
 * gate S-4, REBOUND per blueprint 4.0 §3.11 to the extended control vocabulary:
 *
 *   S-4 now requires a keyboard-only walk of ONE FULL SEASON
 *   (briefing → allocate → resolve → explain), ONE FORK, and ONE LAB COMPARISON,
 *   with Help-now reachable from every state of every mode.
 *
 * The Phase 4 screenshots are captured here too, across both themes and both
 * viewports, covering the campaign, the Lab, the play door and the Life Arc.
 *
 * Prereq: build, then serve — `npm run build && npm run serve:out`.
 * Run:    node tests/browser-gates.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { mkdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.argv[2] || "http://localhost:4321";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SHOTS = join(ROOT, "screenshots");
/** A finished 24-season run, so the closing screen can be captured and audited. */
const FINISHED_CAMPAIGN = JSON.parse(readFileSync(join(ROOT, "tests/fixtures/finished-campaign.json"), "utf8"));
mkdirSync(SHOTS, { recursive: true });

/** The 31 reader routes (stubs /orientation and /roadmap excluded from the walk). */
const ROUTES = [
  "/", "/play", "/play/arc", "/play/campaign", "/play/lab",
  "/walkthrough", "/map", "/map/launch", "/map/credential-decision",
  "/triage", "/situations", "/situations/job-loss", "/situations/grief", "/situations/a-death",
  "/situations/depression", "/situations/being-hurt", "/guidance", "/guidance/daily-plan",
  "/character", "/character/board", "/character/logs", "/topics", "/topics/money", "/topics/health",
  "/topics/relationships", "/topics/work", "/history", "/methodology", "/threshold",
  "/threshold/supporting-someone",
  // 5.0 §8 — the timeline joins the route walk (console, 320px, local-only, keyboard).
  "/timeline",
];

const results = [];
const record = (id, name, pass, details) => results.push({ id, name, pass, details });
const browser = await chromium.launch();

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Click the first control in a container whose text starts with `text`. */
async function click(page, text, scope = "") {
  const el = page.locator(`${scope} button, ${scope} a`).filter({ hasText: text }).first();
  if (await el.count()) {
    await el.click();
    await sleep(120);
    return true;
  }
  return false;
}

async function clearPlayState(page) {
  await page.evaluate(() => {
    try {
      for (const k of Object.keys(localStorage)) if (k.startsWith("tgtl:play") || k.startsWith("tgtl:sim2")) localStorage.removeItem(k);
    } catch {}
  });
}

/* ============================================================
   Drivers
   ============================================================ */

/** Drive the LIFE ARC (/play/arc) to a target state. */
async function arcTo(page, target) {
  await page.goto(BASE + "/play/arc", { waitUntil: "domcontentloaded" });
  await sleep(240);
  await clearPlayState(page);
  await page.reload({ waitUntil: "domcontentloaded" });
  await sleep(320);
  const gate = page.locator(".sim-play-gate");
  if (await gate.count()) await click(page, "Start a new life", ".sim-play-gate");
  if (target === "intro") return page;
  await click(page, "Read the briefing");
  if (target === "briefing") return page;
  await click(page, "Create your character");
  if (target === "creation") return page;
  await click(page, "Next: your leaning");
  await click(page, "Next: the draw");
  await click(page, "Turn them all");
  await click(page, "Begin the run with this hand");
  if (target === "acts") return page;
  for (let i = 0; i < 220; i++) {
    if (target === "consequence" && (await page.locator(".sim-consequence").count())) return page;
    if (target === "counterfactual" && (await page.locator(".sim-counterfactual").count())) return page;
    if (target === "beat" && (await page.locator(".sim-scripted-beat").count())) return page;
    if (target === "parse" && (await page.locator(".sim-parse").count())) return page;
    const rb = page.locator("button.sim-resolve-btn");
    const opt = page.locator(".sim-option").first();
    const beat = page.locator(".sim-scripted-beat");
    if (await rb.count()) await rb.click();
    else if (target !== "beat" && (await beat.count())) await page.locator(".sim-scripted-beat .sim-primary-btn").first().click();
    else if (await opt.count()) await opt.click();
    else {
      const prim = page.locator(".sim-play-app .sim-primary-btn:not([disabled])").first();
      if (await prim.count()) await prim.click();
      else break;
    }
    await sleep(45);
  }
  return page;
}

/** Drive the CAMPAIGN (/play/campaign) to a target state. */
async function campaignTo(page, target) {
  await page.goto(BASE + "/play/campaign", { waitUntil: "domcontentloaded" });
  await sleep(260);
  await clearPlayState(page);
  await page.reload({ waitUntil: "domcontentloaded" });
  await sleep(340);
  const gate = page.locator(".sim-gate");
  if (await gate.count()) await click(page, "Start a different one", ".sim-gate");
  if (target === "prologue") return page;
  await click(page, "Take a starting position");
  if (target === "hand") return page;
  await click(page, "Start here", ".sim-preset-grid");
  if (target === "priorities") return page;
  await click(page, "Floor first", ".sim-priority-presets");
  await click(page, "Begin the first season");
  await sleep(200);
  if (target === "briefing") return page;
  await click(page, "Allocate the season");
  if (target === "allocate") return page;
  // Commit one thing, then resolve, answering any events that arrive.
  await click(page, "How you would do it", ".sim-action-grid");
  await click(page, "Commit this", ".sim-option-list");
  await click(page, "Resolve the season");
  for (let i = 0; i < 8; i++) {
    if (await page.locator(".sim-result-list").count()) break;
    if (await page.locator(".sim-beat-inner").count()) {
      if (target === "beat") return page;
      await click(page, "Go on", ".sim-beat-inner");
      continue;
    }
    if (!(await click(page, "Do this", ".sim-option-list"))) break;
  }
  if (target === "consequences") return page;
  if (target === "explain") {
    await click(page, "Why this happened", ".sim-result-list");
    return page;
  }
  return page;
}

/**
 * Drive the campaign to its CLOSING SCREEN by seeding a finished run.
 *
 * The parse is the last thing a player reads after twenty-four seasons, and it
 * carries the Doors panel, the attribution split, the priority readings and the
 * bridge. Reaching it through the UI means driving every season by hand, so
 * nothing was capturing it: it was the one play surface the art checkpoint could
 * not see and S-9 never audited. The fixture is produced by the real engine
 * through the real commit path (tools/make-parse-fixture.ts); the browser loads
 * and renders it exactly as it would any resumed run.
 */
async function campaignParseTo(page) {
  await page.goto(BASE + "/play/campaign", { waitUntil: "domcontentloaded" });
  await sleep(220);
  await clearPlayState(page);
  await page.evaluate((f) => {
    try {
      localStorage.setItem(f.key, f.value);
    } catch {}
  }, FINISHED_CAMPAIGN);
  await page.reload({ waitUntil: "domcontentloaded" });
  await sleep(420);
  // A finished run reopens straight on its look-back; no gate, no clicks.
  await sleep(200);
  if (!(await page.locator(".sim-parse").count()))
    throw new Error("campaignParseTo: a seeded finished run did not reopen on its look-back");
  return page;
}

/** Drive the LAB (/play/lab) to a rendered comparison. */
const LAB_AXIS_LABEL = {
  "choice-vary": "the decision",
  "draw-vary": "the luck",
  "position-vary": "the starting position",
};

/**
 * Opens the Lab. With no options it opens whatever comes first, which is a
 * two-axis situation; pass {title, axis} to reach a specific one — the
 * position-vary axis only exists on the three-axis situations, so nothing was
 * screenshotting it.
 */
async function labTo(page, opts = {}) {
  await page.goto(BASE + "/play/lab", { waitUntil: "domcontentloaded" });
  await sleep(320);
  if (opts.title) {
    const card = page.locator(".sim-lab-grid li").filter({ hasText: opts.title }).first();
    await card.getByRole("button", { name: "Open this one" }).click();
  } else {
    await click(page, "Open this one", ".sim-lab-grid");
  }
  await sleep(200);
  if (opts.axis) {
    await page.locator(".sim-lab-axes button", { hasText: LAB_AXIS_LABEL[opts.axis] }).first().click();
    await sleep(200);
  }
  return page;
}

/* ============================================================
   Gate 5 + runtime-9: console errors and off-origin requests
   ============================================================ */
{
  const consoleErrors = [];
  const offOrigin = [];
  const urlLeaks = [];
  for (const edition of ["standard", "game"]) {
    const ctx = await browser.newContext();
    await ctx.addInitScript((ed) => {
      try {
        localStorage.setItem("tgtl:edition", ed);
      } catch {}
    }, edition);
    const page = await ctx.newPage();
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrors.push(`[${edition}] ${page.url()} :: ${m.text()}`);
    });
    page.on("pageerror", (e) => consoleErrors.push(`[${edition}] ${page.url()} :: ${e.message}`));
    page.on("request", (req) => {
      try {
        const u = new URL(req.url());
        if (u.origin !== BASE && u.protocol !== "data:" && u.protocol !== "blob:")
          offOrigin.push(`[${edition}] ${page.url()} -> ${req.url()}`);
      } catch {}
    });
    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      if (route === "/map") await page.locator(".stage-node").nth(2).click().catch(() => {});
      if (route === "/guidance") await page.locator(".weight-buttons button").nth(2).click().catch(() => {});
      if (route === "/character/board") await page.locator('input[name="board-condition"]').nth(2).click().catch(() => {});
      if (route === "/play") {
        await sleep(200);
        await page.locator(".sim-door .sim-primary-btn").first().click().catch(() => {});
      }
      if (route === "/play/arc") {
        await sleep(200);
        await page.locator(".sim-play-app .sim-primary-btn").first().click().catch(() => {});
      }
      if (route === "/play/campaign") {
        await sleep(220);
        await page.locator(".sim-campaign .sim-primary-btn").first().click().catch(() => {});
      }
      if (route === "/play/lab") {
        await sleep(220);
        await page.locator(".sim-lab .sim-primary-btn").first().click().catch(() => {});
      }
      const url = page.url();
      if (/tgtl%3A|tgtl:|board=|guidance=|log=|play=|sim2/.test(url)) urlLeaks.push(url);
    }
    await ctx.close();
  }
  record(
    5,
    `Console cleanliness (${ROUTES.length} routes × both editions)`,
    consoleErrors.length === 0,
    consoleErrors.length ? consoleErrors.slice(0, 10) : [`Zero console errors across ${ROUTES.length * 2} page loads, including all three play modes.`],
  );
  const localOk = offOrigin.length === 0 && urlLeaks.length === 0;
  record(9, "Local-only at runtime (no off-origin loads; no state in URL)", localOk,
    localOk ? ["No off-origin requests on load or interaction; no stored value in any URL, in any mode."] : [...offOrigin.slice(0, 6), ...urlLeaks.slice(0, 6)]);
}

/* ============================================================
   Gate 6: state preservation + reset
   ============================================================ */
{
  const details = [];
  let ok = true;
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(BASE + "/map", { waitUntil: "networkidle" });
  await page.locator(".stage-node").nth(2).click();
  const before = await page.locator(".stage-node.is-selected").count();
  await page.locator('.preference-bar button:has-text("Game Guide")').click();
  await sleep(160);
  const after = await page.locator(".stage-node.is-selected").count();
  if (after !== 1 || before !== 1) {
    ok = false;
    details.push("map: stage selection lost on edition switch");
  } else details.push("map: stage selection stayed across edition switch");

  await page.goto(BASE + "/guidance", { waitUntil: "networkidle" });
  await page.locator(".weight-buttons").first().locator("button").nth(3).click();
  await page.goto(BASE + "/topics", { waitUntil: "networkidle" });
  await page.goto(BASE + "/guidance", { waitUntil: "networkidle" });
  const pressed = await page.locator(".weight-buttons").first().locator('button[aria-pressed="true"]').innerText();
  if (pressed.trim() !== "3") {
    ok = false;
    details.push(`guidance: input not preserved (saw "${pressed.trim()}")`);
  } else details.push("guidance: objective weight survived navigation");

  // A campaign in progress survives navigation away and back.
  await campaignTo(page, "briefing");
  await page.goto(BASE + "/topics", { waitUntil: "networkidle" });
  await page.goto(BASE + "/play/campaign", { waitUntil: "networkidle" });
  await sleep(320);
  const resumeOffered = await page.locator(".sim-gate").count();
  if (!resumeOffered) {
    ok = false;
    details.push("campaign: a run in progress was not offered back after navigating away");
  } else details.push("campaign: a run in progress is offered back, never silently resumed or lost");

  await page.goto(BASE + "/methodology", { waitUntil: "networkidle" });
  await page.locator('button:has-text("Reset everything this site remembers")').first().click();
  await sleep(160);
  const leftover = await page.evaluate(() =>
    Object.keys(localStorage).filter((k) => /board|logs|guidance|roadmap|credential|daily|play/.test(k)),
  );
  if (leftover.length > 0) {
    ok = false;
    details.push(`reset: leftover ${leftover.join(", ")}`);
  } else details.push("reset: board/logs/guidance/play state cleared");
  await ctx.close();
  record(6, "State preservation + reset", ok, details);
}

/* ============================================================
   Gate 8: no horizontal body scroll at 320px
   ============================================================ */
{
  const overflow = [];
  const ctx = await browser.newContext({ viewport: { width: 320, height: 800 } });
  const page = await ctx.newPage();
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    if (route.startsWith("/play")) await sleep(260);
    const bad = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (bad) {
      const w = await page.evaluate(() => document.documentElement.scrollWidth);
      overflow.push(`${route}: scrollWidth ${w} > 320`);
    }
  }
  // And deeper into the campaign, where the instruments actually render.
  await campaignTo(page, "allocate");
  const badPlay = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (badPlay) overflow.push("/play/campaign (allocate): horizontal overflow at 320px");
  await ctx.close();
  record(8, `Responsive: no horizontal body scroll at 320px (${ROUTES.length} routes + the allocate screen)`, overflow.length === 0,
    overflow.length ? overflow : [`All ${ROUTES.length} routes clean at 320px, including the allocate screen with every instrument rendered.`]);
}

/* ============================================================
   Gate 7: keyboard reaches Help-now everywhere
   ============================================================ */
{
  const details = [];
  let ok = true;
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  for (const route of ["/", "/map", "/situations/grief", "/triage", "/play", "/play/arc", "/play/campaign", "/play/lab"]) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    const helpNow = page.locator("a.help-now");
    if ((await helpNow.count()) < 1) {
      ok = false;
      details.push(`${route}: no Help-now link`);
      continue;
    }
    await helpNow.first().focus();
    const focused = await page.evaluate(() => document.activeElement?.classList.contains("help-now"));
    if (!focused) {
      ok = false;
      details.push(`${route}: Help-now not keyboard-focusable`);
    }
  }
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.locator('a[href="/threshold/"]').first().focus();
  await page.keyboard.press("Enter");
  await page.waitForURL("**/threshold/**", { timeout: 5000 }).catch(() => {});
  if (!page.url().includes("/threshold")) {
    ok = false;
    details.push("keyboard: could not reach Threshold from the entrance");
  } else details.push("keyboard: Help-now focusable on all eight sampled routes including all three play modes; reached Threshold by keyboard");
  await ctx.close();
  record(7, "Keyboard: Help-now reachable everywhere", ok, details);
}

/* ============================================================
   S-4 (REBOUND, §3.11): a keyboard-only season, a fork, a Lab comparison
   ============================================================ */
{
  const details = [];
  let ok = true;
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  /** Press Enter on the first control whose text starts with `text`, by keyboard. */
  const keyActivate = async (text, scope = "") => {
    const el = page.locator(`${scope} button, ${scope} a`).filter({ hasText: text }).first();
    if (!(await el.count())) return false;
    await el.focus();
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    if (!focused || !["BUTTON", "A"].includes(focused)) return false;
    await page.keyboard.press("Enter");
    await sleep(180);
    return true;
  };

  /* --- Help-now in every state of every mode --- */
  const states = [
    ["arc/creation", () => arcTo(page, "creation")],
    ["arc/parse", () => arcTo(page, "parse")],
    ["campaign/hand", () => campaignTo(page, "hand")],
    ["campaign/briefing", () => campaignTo(page, "briefing")],
    ["campaign/allocate", () => campaignTo(page, "allocate")],
    ["campaign/consequences", () => campaignTo(page, "consequences")],
    ["lab/comparison", () => labTo(page)],
  ];
  for (const [name, go] of states) {
    await go();
    if ((await page.locator("a.help-now").count()) < 1) {
      ok = false;
      details.push(`${name}: Help-now absent`);
    }
  }
  if (ok) details.push(`Help-now present in all ${states.length} sampled states across all three modes.`);

  /* --- ONE FULL SEASON, keyboard only --- */
  await campaignTo(page, "prologue");
  const steps = [
    ["Take a starting position", ""],
    ["Start here", ".sim-preset-grid"],
    ["Floor first", ".sim-priority-presets"],
    ["Begin the first season", ""],
    ["Allocate the season", ""],
    ["How you would do it", ".sim-action-grid"],
    ["Commit this", ".sim-option-list"],
    ["Resolve the season", ""],
  ];
  for (const [text, scope] of steps) {
    if (!(await keyActivate(text, scope))) {
      ok = false;
      details.push(`S-4 keyboard season: could not activate "${text}" by keyboard`);
      break;
    }
  }
  // Answer any in-season events by keyboard.
  for (let i = 0; i < 8; i++) {
    if (await page.locator(".sim-result-list").count()) break;
    if (await page.locator(".sim-beat-inner").count()) {
      await keyActivate("Go on", ".sim-beat-inner");
      continue;
    }
    if (!(await keyActivate("Do this", ".sim-option-list"))) break;
  }
  const resolved = await page.locator(".sim-result-list > li").count();
  if (!resolved) {
    ok = false;
    details.push("S-4 keyboard season: the season did not resolve");
  }
  // ...and the explain drawer, by keyboard, closing by Escape.
  if (!(await keyActivate("Why this happened", ".sim-result-list"))) {
    ok = false;
    details.push("S-4 keyboard season: could not open the explain drawer by keyboard");
  } else {
    const drawerOpen = await page.locator(".sim-drawer-card").count();
    if (!drawerOpen) {
      ok = false;
      details.push("S-4 keyboard season: the explain drawer did not open");
    } else {
      await page.keyboard.press("Escape");
      await sleep(160);
      if (await page.locator(".sim-drawer-card").count()) {
        ok = false;
        details.push("S-4: the explain drawer did not close on Escape");
      }
    }
  }
  if (resolved) details.push(`S-4: one full season completed keyboard-only — briefing → allocate → resolve (${resolved} outcomes) → explain, closed by Escape.`);

  /* --- ONE FORK, keyboard only --- */
  await keyActivate("On to the next season", "");
  await sleep(200);
  if (!(await keyActivate("Branch from here", ""))) {
    ok = false;
    details.push("S-4: could not fork by keyboard");
  } else {
    const notice = await page.locator(".sim-notice").innerText().catch(() => "");
    if (!/branch/i.test(notice)) {
      ok = false;
      details.push("S-4: forking produced no confirmation that the parent run is untouched");
    } else details.push("S-4: forked by keyboard; the surface states plainly that the run branched from is untouched.");
  }

  /* --- ONE LAB COMPARISON, keyboard only --- */
  await page.goto(BASE + "/play/lab", { waitUntil: "domcontentloaded" });
  await sleep(320);
  if (!(await keyActivate("Open this one", ".sim-lab-grid"))) {
    ok = false;
    details.push("S-4: could not open a Lab situation by keyboard");
  } else {
    const cols = await page.locator(".sim-lab-column").count();
    const noPrediction = await page.locator(".sim-no-prediction").count();
    if (cols !== 2) {
      ok = false;
      details.push(`S-4: Lab comparison rendered ${cols} branches`);
    }
    if (!noPrediction) {
      ok = false;
      details.push("S-4: the no-prediction line did not render on the comparison");
    }
    // Switch the axis by keyboard, and CHECK THAT IT SWITCHED.
    //
    // This block used to focus the chip, press Enter, sleep, and read nothing —
    // then the success line below claimed "axis switched" on the strength of
    // `cols` and `noPrediction`, both captured BEFORE the press. Switching the
    // axis is one of the three things S-4 exists to prove, and it was the one
    // thing in the gate that no assertion touched.
    const axes = page.locator(".sim-lab-axes .sim-filter-btn");
    let axisSwitched = false;
    if ((await axes.count()) > 1) {
      const labelBefore = await page.locator(".sim-header-intent dd").first().innerText();
      const pressedBefore = await axes.nth(1).getAttribute("aria-pressed");
      await axes.nth(1).focus();
      await page.keyboard.press("Enter");
      await sleep(240);
      const labelAfter = await page.locator(".sim-header-intent dd").first().innerText();
      const pressedAfter = await axes.nth(1).getAttribute("aria-pressed");
      const colsAfter = await page.locator(".sim-lab-column").count();
      const noPredictionAfter = await page.locator(".sim-no-prediction").count();
      axisSwitched = labelAfter !== labelBefore && pressedAfter === "true";
      if (!axisSwitched) {
        ok = false;
        details.push(
          `S-4: pressing Enter on the second axis chip did not switch the axis — the header read ${JSON.stringify(labelBefore)} before and ${JSON.stringify(labelAfter)} after, aria-pressed went ${pressedBefore} -> ${pressedAfter}`,
        );
      }
      if (colsAfter !== 2 || !noPredictionAfter) {
        ok = false;
        details.push(`S-4: after the keyboard axis switch the comparison rendered ${colsAfter} branches and ${noPredictionAfter} no-prediction line(s)`);
      }
    } else {
      ok = false;
      details.push("S-4: the Lab situation offered fewer than two axes, so the keyboard axis switch could not be exercised");
    }
    if (cols === 2 && noPrediction && axisSwitched)
      details.push("S-4: one Lab comparison completed keyboard-only, both branches rendered, the axis switched by Enter and the comparison re-rendered, no-prediction line present.");
  }
  await ctx.close();
  record(4, "S-4 · Keyboard: a full season, a fork, a Lab comparison; Help-now in every state", ok, details);
}

/* ============================================================
   Phase 4 screenshots — both themes, both viewports
   ============================================================ */
{
  const shots = [];
  // Drop focus before every capture. campaignTo() drives the surfaces by keyboard,
  // which leaves the skip link — the first focusable element — focused and therefore
  // VISIBLE, and a fullPage capture renders a position:fixed element wherever the
  // page happened to be scrolled. That put a floating "Skip to the page" box over a
  // card in several of the art-checkpoint images. The skip link itself is correct.
  const shoot = async (page, name) => {
    await page.evaluate(() => (document.activeElement instanceof HTMLElement ? document.activeElement.blur() : undefined));
    await page.screenshot({ path: join(SHOTS, `${name}.png`), fullPage: true });
    shots.push(name);
  };
  const staticShots = [
    ["entrance", "/"], ["walkthrough", "/walkthrough"], ["map", "/map"], ["board", "/character/board"],
    ["triage", "/triage"], ["grief", "/situations/grief"], ["threshold", "/threshold"],
    ["methodology", "/methodology"], ["guidance", "/guidance"], ["play-door", "/play"],
  ];
  for (const theme of ["light", "dark"]) {
    for (const [width, tag] of [[1280, "desktop"], [320, "mobile"]]) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme });
      const page = await ctx.newPage();
      await ctx.addInitScript((t) => {
        try {
          localStorage.setItem("tgtl:theme", t);
        } catch {}
      }, theme);
      const suffix = `${tag}-${theme}`;
      for (const [name, route] of staticShots) {
        await page.goto(BASE + route, { waitUntil: "networkidle" });
        await sleep(route.startsWith("/play") ? 320 : 60);
        await shoot(page, `${name}-${suffix}`);
      }
      // The campaign, at every surface the art checkpoint reviews.
      for (const [name, target] of [
        ["campaign-prologue", "prologue"],
        ["campaign-hand", "hand"],
        ["campaign-priorities", "priorities"],
        ["campaign-briefing", "briefing"],
        ["campaign-allocate", "allocate"],
        ["campaign-consequences", "consequences"],
      ]) {
        await campaignTo(page, target);
        await shoot(page, `${name}-${suffix}`);
      }
      // The explain drawer.
      await campaignTo(page, "explain");
      await shoot(page, `campaign-explain-${suffix}`);
      // The closing screen, from a seeded finished run.
      await campaignParseTo(page);
      await shoot(page, `campaign-parse-${suffix}`);
      // The Lab — both a two-axis situation and the position axis, which only the
      // three-axis situations expose and which no earlier screenshot showed.
      await labTo(page);
      await shoot(page, `lab-compare-${suffix}`);
      await labTo(page, { title: "Whether to move for it", axis: "position-vary" });
      await shoot(page, `lab-position-${suffix}`);
      // The Life Arc.
      await arcTo(page, "creation");
      await shoot(page, `arc-creation-${suffix}`);
      await arcTo(page, "parse");
      await shoot(page, `arc-parse-${suffix}`);
      await ctx.close();
    }
  }
  // THE SCREENSHOTS EXIST, AND THEY ARE IMAGES.
  //
  // This gate used to be `record(0, "Screenshots captured", true, ...)` — the
  // literal `true`. It reported success unconditionally: had every capture thrown,
  // had the directory been unwritable, had it produced eighty-four empty files, it
  // would still have printed "Screenshots captured" and a count. The art checkpoint
  // is one of the owner's named launch gates and this was its only evidence.
  {
    const missing = [];
    const tiny = [];
    for (const name of shots) {
      const file = join(SHOTS, `${name}.png`);
      if (!existsSync(file)) {
        missing.push(name);
        continue;
      }
      const { size } = statSync(file);
      // A real full-page capture of these surfaces is tens of kilobytes at least;
      // anything under 4KB is a blank or a failed write, not a screenshot.
      if (size < 4096) tiny.push(`${name} (${size} bytes)`);
    }
    // Every surface the art checkpoint reviews must be present in both themes and
    // both viewports — not merely "some files were written".
    const REQUIRED = [
      "campaign-prologue", "campaign-hand", "campaign-priorities", "campaign-briefing",
      "campaign-allocate", "campaign-consequences", "campaign-explain", "campaign-parse",
      "lab-compare", "lab-position", "arc-creation", "arc-parse", "play-door",
    ];
    const absent = [];
    for (const surface of REQUIRED)
      for (const theme of ["light", "dark"])
        for (const tag of ["desktop", "mobile"])
          if (!existsSync(join(SHOTS, `${surface}-${tag}-${theme}.png`))) absent.push(`${surface}-${tag}-${theme}`);

    const problems = [];
    if (missing.length) problems.push(`${missing.length} capture(s) reported but not on disk: ${missing.slice(0, 5).join(", ")}`);
    if (tiny.length) problems.push(`${tiny.length} capture(s) under 4KB, i.e. blank: ${tiny.slice(0, 5).join(", ")}`);
    if (absent.length) problems.push(`${absent.length} required art-checkpoint surface(s) missing: ${absent.slice(0, 8).join(", ")}`);

    record(
      0,
      "Screenshots captured (present, non-empty, and covering every art-checkpoint surface)",
      problems.length === 0,
      problems.length
        ? problems
        : [
            `${shots.length} screenshots in screenshots/ — all present on disk, none under 4KB, and all ${REQUIRED.length} art-checkpoint surfaces covered in both themes at both viewports.`,
          ],
    );
  }
}

/* ============================================================
   C-3 (N-191): every option whose action carries a switching cost renders it
   on the card, in the existing campaign walk.
   ============================================================
   Forty-three authored sentences about what changing your mind costs have been
   linted for voice since 4.0 and displayed by nothing. This asserts they reach a
   reader: on the allocate screen, at least one card renders
   [data-sim-switching-cost] with real text, and NO card renders an empty one.

   Proven red by renaming the attribute in components/sim/CampaignApp.tsx — the
   run with the plant is in DECISIONS.md §8 under batch 1.
   ============================================================ */
{
  const details = [];
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await campaignTo(page, "allocate");
  const found = await page.evaluate(() =>
    [...document.querySelectorAll(".sim-action-grid [data-sim-switching-cost]")].map((el) =>
      (el.textContent || "").trim(),
    ),
  );
  const cards = await page.locator(".sim-action-grid > li").count();
  const problems = [];
  if (!found.length)
    problems.push(
      `allocate screen: ${cards} action cards rendered and NOT ONE [data-sim-switching-cost] among them — the switching cost is authored, linted, and reaching no reader`,
    );
  const blank = found.filter((t) => t.length < 12);
  if (blank.length) problems.push(`${blank.length} switching-cost element(s) rendered with no sentence in them`);
  if (!problems.length)
    details.push(
      `allocate screen: ${found.length} of ${cards} action cards render their switching cost; e.g. "${found[0].slice(0, 90)}…"`,
    );
  await ctx.close();
  record(3, "C-3 (N-191): the action card renders its switching cost", problems.length === 0, problems.length ? problems : details);
}

/* ---- T-14: the timeline's browser walk (5.0 §8) ---- */
{
  const { runTimelineBrowserGateSafe } = await import("./timeline-browser-gate.mjs");
  await runTimelineBrowserGateSafe({ browser, BASE, ROOT, record });
}

await browser.close();

let failed = 0;
for (const r of results.sort((a, b) => a.id - b.id)) {
  const tag = r.pass ? "PASS" : "FAIL";
  if (!r.pass) failed++;
  console.log(`\n[${tag}] Gate ${r.id}: ${r.name}`);
  for (const d of r.details) console.log("   " + d);
}
console.log("\n" + "=".repeat(60));
console.log(failed === 0 ? "ALL BROWSER GATES PASS" : `${failed} BROWSER GATE(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
