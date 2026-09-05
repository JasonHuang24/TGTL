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
/**
 * A run PAUSED ON A QUIET SEASON (tools/make-quiet-season-fixture.ts), so N-194's
 * compressed flow can be reached. The control renders only where the briefing's
 * own `quiet` flag is true and there is a previous allocation to offer back;
 * whether a hand-driven walk arrives at one depends on the seeds, so the state is
 * built by the engine and loaded like any resumed run.
 */
const QUIET_SEASON = JSON.parse(readFileSync(join(ROOT, "tests/fixtures/quiet-season.json"), "utf8"));
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
  // N-227: the reset control ARMS on the first press and erases on the second.
  // Gate 6 pressed once and asserted the keys were gone, so it would have gone
  // red on the arm-then-confirm the row adds; the extension is here, and the
  // assertion that ONE press does NOT erase is gate 127's.
  await page.locator(".reset-button").first().click();
  await sleep(160);
  await page.locator(".reset-button").first().click();
  await sleep(200);
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

/* ============================================================
   C-6 (N-263): double-Escape leaves EVERY set-down route.
   ============================================================
   The reader who most needs the quick exit may not be able to reach or aim at a
   button. Two Escape presses inside the window run the same navigation the
   visible "Leave this page" control runs — and on four of the seven set-down
   routes there IS no visible control, so this is the only exit there.

   The route list is read out of content/routes.ts (every record with
   intensity: "down"), NOT out of the rendered pages and NOT from the handler, so
   a plant that quietly drops a route from the handler cannot also drop it from
   the test.

   The exit is a real navigation to a third-party site, so it is intercepted at
   the network layer and aborted: the assertion is that the page tried to leave
   for the exit target, and nothing off-origin is actually fetched.

   Proven red by narrowing the handler's guard to skip one route — the run with
   the plant is in DECISIONS.md §8 under batch 2.
   ============================================================ */
{
  const details = [];
  const problems = [];
  const routesSrc = readFileSync(join(ROOT, "content/routes.ts"), "utf8");
  const SETDOWN = routesSrc
    .split('path: "')
    .slice(1)
    .map((c) => [c.slice(0, c.indexOf('"')), /intensity:\s*"(\w+)"/.exec(c)])
    .filter(([, m]) => m && m[1] === "down")
    .map(([p]) => p);
  if (!SETDOWN.length) problems.push("content/routes.ts: no set-down route found; the gate has no subject");

  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  let leftFor = null;
  // Fulfilled locally rather than aborted: the navigation still happens (which is
  // the thing being asserted) but nothing is fetched off-origin, and the page does
  // not land on an error document that races the next goto.
  await page.route("**/*", (r) => {
    const u = r.request().url();
    if (u.startsWith(BASE) || u.startsWith("data:") || u.startsWith("blob:")) return r.continue();
    leftFor = u;
    return r.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>intercepted</title>" });
  });
  const doubleEscape = async (route) => {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
        await sleep(160);
        leftFor = null;
        await page.keyboard.press("Escape");
        await page.keyboard.press("Escape");
        await sleep(360);
        return leftFor;
      } catch {
        await sleep(240);
      }
    }
    problems.push(`${route}: could not be walked — the gate proved nothing about this route`);
    return null;
  };
  for (const route of SETDOWN) {
    if (!(await doubleEscape(route)))
      problems.push(`${route}: two Escape presses did not leave the page — this route has no keyboard quick exit`);
  }
  // And the gesture must NOT fire on a route that is not set-down: a page-initiated
  // jump off-site is sanctioned only where the reader may need to hide the screen.
  const stray = await doubleEscape("/topics");
  if (stray) problems.push(`/topics: double-Escape left the page from a route that is not set-down (${stray})`);
  await ctx.close();
  if (!problems.length)
    details.push(
      `double-Escape leaves all ${SETDOWN.length} set-down routes (${SETDOWN.join(", ")}) and does not fire on /topics`,
    );
  record(106, "C-6 (N-263): double-Escape exits every set-down route", problems.length === 0, problems.length ? problems : details);
}

/* ============================================================
   C-14 (N-204): every season screen carries its origin's face motif.
   ============================================================
   Each preset declares a distinct `face` and it was used at exactly one place —
   the selection card. After `startPreset` the origin never appeared again, not
   even its label, so five unequal starting positions converged into one screen by
   season two, and the campaign's central doctrine (position is not something the
   character did) had nothing on screen to carry it.

   THE SPEC'S OWN TEST is that a screenshot is attributable to its origin WITHOUT
   the preset name in the header, so this asserts both halves: the motif is there
   at every sampled turn and carries the right face, and the preset's name is not.

   Sampled at three DIFFERENT turns, plus the allocate screen and the look-back,
   because "renders on turn one" is exactly the defect. Proven red by rendering it
   only on turn one — the run with that plant is in DECISIONS.md §8 under batch 3.
   ============================================================ */
{
  const details = [];
  const problems = [];
  // The face the first preset declares, read out of the content rather than
  // written here, so a content change cannot leave the gate asserting a stale one.
  const presetsSrc = readFileSync(join(ROOT, "content/sim/campaign/presets.ts"), "utf8");
  const expectedFace = /face:\s*"(\w+)"/.exec(presetsSrc)?.[1] ?? null;
  const presetLabel = /label:\s*"([^"]+)"/.exec(presetsSrc)?.[1] ?? null;
  if (!expectedFace) problems.push("content/sim/campaign/presets.ts: could not read the first preset's face, so the gate has nothing to compare against");

  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await campaignTo(page, "briefing");

  const seen = [];
  for (let turn = 1; turn <= 3; turn++) {
    const motif = page.locator("[data-sim-origin-face]").first();
    if (!(await motif.count())) {
      problems.push(`season ${turn}: the season chrome carries no origin motif — after the selection card the origin disappears and every start looks the same`);
      break;
    }
    const face = await motif.getAttribute("data-sim-origin-face");
    const svg = await motif.locator("svg").count();
    const season = (await page.locator(".sim-header-facts").innerText().catch(() => "")).replace(/\s+/g, " ");
    seen.push(`turn ${turn}: face "${face}", ${svg} motif drawn`);
    if (face !== expectedFace) problems.push(`season ${turn}: the chrome renders the "${face}" face where this origin declares "${expectedFace}"`);
    if (!svg) problems.push(`season ${turn}: the origin element is present but draws nothing`);
    if (presetLabel && season.includes(presetLabel))
      problems.push(`season ${turn}: the header prints the preset name "${presetLabel}" — the motif exists so that it does not have to`);
    if (turn === 3) break;
    // Advance a season: allocate one thing, resolve, answer whatever arrives.
    await click(page, "Allocate the season");
    const onAllocate = await page.locator("[data-sim-origin-face]").count();
    if (turn === 1 && !onAllocate) problems.push("the allocate screen carries no origin motif");
    await click(page, "How you would do it", ".sim-action-grid");
    await click(page, "Commit this", ".sim-option-list");
    await click(page, "Resolve the season");
    for (let i = 0; i < 8; i++) {
      if (await page.locator(".sim-result-list").count()) break;
      if (await page.locator(".sim-beat-inner").count()) {
        await click(page, "Go on", ".sim-beat-inner");
        continue;
      }
      if (!(await click(page, "Do this", ".sim-option-list"))) break;
    }
    if (!(await click(page, "On to the next season"))) {
      problems.push(`could not advance past season ${turn}, so fewer than three turns were sampled`);
      break;
    }
    await sleep(200);
  }
  if (seen.length < 3) problems.push(`only ${seen.length} turn(s) sampled; the assertion is about turns AFTER the first`);

  // And the look-back at the end of the run, which is a season screen too.
  await campaignParseTo(page);
  if (!(await page.locator("[data-sim-origin-face]").count())) problems.push("the look-back carries no origin motif");
  await ctx.close();
  if (!problems.length) details.push(`${seen.join(" · ")}; the allocate screen and the look-back carry it too, and the preset's name is nowhere in the header`);
  record(114, "C-14 (N-204): every season screen carries its origin motif", problems.length === 0, problems.length ? problems : details);
}

/* ============================================================
   C-12 / S-4 extension (N-194): the compressed season flow is a real control,
   reachable and operable by keyboard, and it commits.
   ============================================================
   S-4 requires the campaign's control vocabulary to be keyboard-complete. The
   repeat control joins it: it is a real <button>, it can be focused and activated
   by Enter, and doing so COMMITS the season rather than opening a confirmation
   somewhere else. The delta briefing that goes with it must also be a delta —
   the full briefing is offered, not imposed, and nothing is hidden behind it.
   ============================================================ */
{
  const details = [];
  const problems = [];
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(BASE + "/play/campaign", { waitUntil: "domcontentloaded" });
  await sleep(220);
  await clearPlayState(page);
  await page.evaluate((f) => {
    try {
      localStorage.setItem(f.key, f.value);
    } catch {}
  }, QUIET_SEASON);
  await page.reload({ waitUntil: "domcontentloaded" });
  await sleep(400);
  if (await page.locator(".sim-gate").count()) await click(page, "Pick it back up", ".sim-gate");
  await sleep(300);

  const control = page.locator("[data-sim-repeat-last]").first();
  if (!(await control.count())) {
    problems.push(
      "a quiet season with a previous allocation offers no [data-sim-repeat-last] control — §3.4b's compressed flow is the answer to twenty-four full briefings and it is not on the screen",
    );
  } else {
    const tag = await control.evaluate((el) => el.tagName);
    if (tag !== "BUTTON") problems.push(`the repeat control is a <${tag.toLowerCase()}>, so it is not in the keyboard order as a control`);
    if (!(await page.locator(".sim-briefing-delta").count())) problems.push("the compressed briefing renders no delta panel");
    const fullShown = await page.locator(".sim-briefing-grid:not([hidden])").count();
    if (fullShown) problems.push("the compressed briefing still renders the full briefing grid, so nothing was compressed");
    if (!(await page.locator(".sim-briefing-delta button", { hasText: "Show the full briefing" }).count()))
      problems.push("the compressed briefing offers no way back to the full one — the delta must be an offer, not a removal");

    const before = await page.locator(".sim-header-facts").innerText();
    await control.focus();
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    if (focused !== "BUTTON") problems.push("the repeat control could not take keyboard focus");
    await page.keyboard.press("Enter");
    await sleep(400);
    // The season must actually have gone somewhere: either straight to its
    // consequences, or to an arrival or a beat on the way, exactly as a
    // hand-built allocation would.
    for (let i = 0; i < 8; i++) {
      if (await page.locator(".sim-result-list").count()) break;
      if (await page.locator(".sim-beat-inner").count()) {
        await click(page, "Go on", ".sim-beat-inner");
        continue;
      }
      if (!(await click(page, "Do this", ".sim-option-list"))) break;
    }
    const resolved = await page.locator(".sim-result-list > li").count();
    if (!resolved) problems.push("activating the repeat control by keyboard did not resolve the season");
    const after = await page.locator(".sim-header-facts").innerText();
    if (before === after && resolved) problems.push("the season resolved but the header did not advance");
    if (resolved) details.push(`the repeat control took focus, activated on Enter, and committed a season of ${resolved} outcome(s) through the same path as a hand allocation`);
  }
  await ctx.close();
  record(112, "C-12 / S-4 (N-194): the repeat-last-season control is keyboard-reachable and commits", problems.length === 0, problems.length ? problems : details);
}

/* ============================================================
   The erase-control gate, extended (N-227): arm, then confirm.
   ============================================================
   A single press that erases everything is a mis-tap away from a loss the site
   cannot undo, and the reader was never told what survives. Both halves are
   asserted: ONE press must NOT erase, and the armed state must say what is about
   to go, what is not, and that this cannot be undone by the Guidebook.
   ============================================================ */
{
  const details = [];
  const problems = [];
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  // (a) The site-wide reset on /methodology.
  await page.goto(BASE + "/guidance", { waitUntil: "networkidle" });
  await page.locator(".weight-buttons").first().locator("button").nth(3).click();
  await page.goto(BASE + "/methodology", { waitUntil: "networkidle" });
  // By class, not by text: the label CHANGES when the control arms, which is the
  // thing being asserted, so a text-matched locator stops matching the element it
  // is about half way through the assertion.
  const reset = page.locator(".reset-button").first();
  await reset.click();
  await sleep(160);
  const stillThere = await page.evaluate(() => Object.keys(localStorage).filter((k) => /guidance/.test(k)).length);
  if (!stillThere) problems.push("/methodology: ONE press of the reset control erased. Arm-then-confirm exists because that press is a mis-tap away from a loss the site cannot undo (N-227).");
  const armedText = (await page.locator("[data-sim-armed-consequence]").innerText().catch(() => "")) || "";
  if (!armedText.includes("cannot be undone by the Guidebook"))
    problems.push('/methodology: the armed state does not say "This cannot be undone by the Guidebook." — the precise, non-overclaiming phrasing the row names');
  if (armedText.length < 60) problems.push("/methodology: the armed state does not say what is about to go and what survives");
  const label = await reset.innerText();
  if (!/press again/i.test(label)) problems.push(`/methodology: the armed control still reads "${label.trim()}" rather than telling the reader a second press is what erases`);
  await reset.click();
  await sleep(200);
  const cleared = await page.evaluate(() => Object.keys(localStorage).filter((k) => /guidance|board|logs|daily/.test(k)).length);
  if (cleared) problems.push(`/methodology: the second press did not erase (${cleared} keys left)`);
  else details.push("/methodology: one press arms and says what goes, what survives, and that this cannot be undone by the Guidebook; the second press erases");

  // (b) The campaign's branch delete, which carries the sibling-branch line.
  await campaignTo(page, "briefing");
  await click(page, "Branch from here");
  await sleep(200);
  await page.goto(BASE + "/play/campaign", { waitUntil: "domcontentloaded" });
  await sleep(300);
  if (await page.locator(".sim-gate").count()) await click(page, "Start a different one", ".sim-gate");
  await click(page, "Take a starting position");
  await sleep(200);
  // The FORKS list specifically. The parent save is labelled "…, before
  // branching", so a text match on "branch" finds the save and asserts the wrong
  // control's wording — which is what it did on the first run of this gate.
  const branchDelete = page
    .locator(".sim-save-list li", { hasText: "a branch of another line" })
    .locator("button", { hasText: "Delete" })
    .first();
  if (!(await branchDelete.count())) {
    details.push("no branch was listed on this walk, so the sibling-branch wording was checked in source only");
    const src = readFileSync(join(ROOT, "components/sim/CampaignApp.tsx"), "utf8");
    if (!src.includes("SIBLING_BRANCH_LINE")) problems.push("components/sim/CampaignApp.tsx: the branch delete does not carry the sibling-branch line");
  } else {
    await branchDelete.click();
    await sleep(160);
    const t = (await page.locator("[data-sim-armed-consequence]").first().innerText().catch(() => "")) || "";
    if (!t.includes("parent or sibling branches remain separate"))
      problems.push("the branch delete's armed state does not say that the parent or sibling branches remain separate");
    if (!t.includes("cannot be undone by the Guidebook")) problems.push("the branch delete's armed state does not carry the cannot-be-undone line");
    if (!problems.length) details.push("the branch delete arms and states that the parent or sibling branches remain separate");
  }
  await ctx.close();
  record(127, "C / N-227: erasing arms first, and the armed state says what survives", problems.length === 0, problems.length ? problems : details);
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
