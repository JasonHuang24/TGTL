/**
 * Phase 4 screenshots for the timeline (5.0 blueprint §9).
 *
 * §9 asks for: /timeline at the whole-life, stage and year zooms; a sensitive
 * segment; a milestone page; the lens on — each in both themes, at desktop and
 * 320px. That is what this captures, into screenshots/, named so the art
 * checkpoint can be walked without hunting.
 *
 * Prereq: npm run build && npm run serve:out
 * Run:    node tests/timeline-screenshots.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.argv[2] || "http://localhost:4321";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SHOTS = join(ROOT, "screenshots");
mkdirSync(SHOTS, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 320, height: 720 },
];
const THEMES = ["light", "dark"];

const browser = await chromium.launch();
let n = 0;

/** Find the first milestone id that has its own page, so the shot is real. */
async function firstMilestonePage(page) {
  await page.goto(BASE + "/timeline", { waitUntil: "domcontentloaded" });
  await sleep(400);
  const href = await page.evaluate(() => {
    const a = document.querySelector('a[href^="/timeline/"]');
    return a ? a.getAttribute("href") : null;
  });
  return href;
}

const probe = await browser.newPage();
const milestoneHref = await firstMilestonePage(probe);
await probe.close();

const SCENES = [
  {
    // The page as a reader first meets it.
    name: "timeline-first-contact",
    async go(page) {
      await page.goto(BASE + "/timeline", { waitUntil: "domcontentloaded" });
      await sleep(500);
    },
  },
  {
    // The instrument itself, at the whole-life zoom. This is the art checkpoint's
    // main subject, and it sits below the fold — capturing the page top instead
    // photographs the header and calls it the instrument.
    name: "timeline-whole-life",
    async go(page) {
      await page.goto(BASE + "/timeline", { waitUntil: "domcontentloaded" });
      await sleep(500);
      await page.evaluate(() => {
        const el = document.querySelector(".tl-instrument");
        if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 8);
      });
      await sleep(320);
    },
  },
  {
    name: "timeline-zoom-stage",
    async go(page) {
      await page.goto(BASE + "/timeline", { waitUntil: "domcontentloaded" });
      await sleep(400);
      await page.locator("button.tl-chip", { hasText: "One stage" }).first().click().catch(() => {});
      await page.evaluate(() => {
        const el = document.querySelector(".tl-instrument");
        if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 8);
      });
      await sleep(320);
    },
  },
  {
    name: "timeline-zoom-year",
    async go(page) {
      await page.goto(BASE + "/timeline", { waitUntil: "domcontentloaded" });
      await sleep(400);
      await page.locator("button.tl-chip", { hasText: "Around this year" }).first().click().catch(() => {});
      await page.evaluate(() => {
        const el = document.querySelector(".tl-instrument");
        if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 8);
      });
      await sleep(320);
    },
  },
  {
    name: "timeline-lens-on",
    async go(page) {
      await page.goto(BASE + "/timeline", { waitUntil: "domcontentloaded" });
      await sleep(400);
      await page.locator("button.tl-chip", { hasText: "Female" }).first().click().catch(() => {});
      await page.evaluate(() => {
        const el = document.querySelector(".tl-instrument");
        if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 8);
      });
      await sleep(320);
    },
  },
  {
    name: "timeline-year-card",
    async go(page) {
      await page.goto(BASE + "/timeline#age-18", { waitUntil: "domcontentloaded" });
      await sleep(500);
      await page.evaluate(() => {
        const el = document.getElementById("age-18");
        el?.scrollIntoView();
        el?.querySelectorAll("details.tl-ms").forEach((d, i) => {
          if (i < 3) d.setAttribute("open", "");
        });
      });
      await sleep(300);
    },
  },
  {
    name: "timeline-sensitive-segment",
    async go(page) {
      await page.goto(BASE + "/timeline", { waitUntil: "domcontentloaded" });
      await sleep(400);
      await page.evaluate(() => {
        // The sensitivity flag lives on the WRAPPER, not the <details> — it moved
        // there so the care note renders inside the flagged region at rest.
        const block = document.querySelector("[data-tl-sensitive]");
        if (block) {
          block.querySelectorAll("details.tl-ms").forEach((d) => d.setAttribute("open", ""));
          block.scrollIntoView({ block: "center" });
        }
      });
      await sleep(320);
    },
  },
  {
    name: "timeline-terminal-card",
    async go(page) {
      await page.goto(BASE + "/timeline#beyond", { waitUntil: "domcontentloaded" });
      await sleep(500);
      await page.evaluate(() => document.getElementById("beyond")?.scrollIntoView({ block: "center" }));
      await sleep(250);
    },
  },
  {
    name: "timeline-not-sourced",
    async go(page) {
      await page.goto(BASE + "/timeline", { waitUntil: "domcontentloaded" });
      await sleep(400);
      await page.evaluate(() =>
        document.querySelector(".tl-not-sourced-block")?.scrollIntoView({ block: "center" }),
      );
      await sleep(250);
    },
  },
];

if (milestoneHref) {
  SCENES.push({
    name: "timeline-milestone-page",
    async go(page) {
      await page.goto(BASE + milestoneHref, { waitUntil: "domcontentloaded" });
      await sleep(450);
    },
  });
}

for (const scene of SCENES) {
  for (const theme of THEMES) {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      await page.addInitScript((t) => {
        try {
          localStorage.setItem("tgtl:theme", t);
        } catch {}
      }, theme);
      await scene.go(page);
      await page.evaluate((t) => {
        document.documentElement.dataset.theme = t;
      }, theme);
      await sleep(260);
      const file = join(SHOTS, `${scene.name}-${theme}-${vp.name}.png`);
      await page.screenshot({ path: file, fullPage: false });
      n++;
      await page.close();
    }
  }
}

await browser.close();
console.log(`captured ${n} timeline screenshots into screenshots/ (${SCENES.length} scenes x ${THEMES.length} themes x ${VIEWPORTS.length} viewports)`);
if (!milestoneHref) {
  console.log("note: no milestone page existed at capture time, so the milestone-page scene was skipped.");
}
