/**
 * Gate S-9 · UI integrity (blueprint 4.0 §8, §2.2, §4.2).
 *
 * The permanent enforcement of the defect class the owner hit on the 3.0 creation
 * screen — clipped button labels and a near-invisible heading. Every play screen,
 * in both themes, at 320 / 768 / 1280, must satisfy:
 *
 *   1. NO CLIPPED TEXT   no element's text overflows its own box, unless the box
 *                        is explicitly marked `data-scroll-region` — and every
 *                        marked region is audited as genuinely user-scrollable,
 *                        including by keyboard.
 *   2. CONTRAST AA       every text/background token pair meets WCAG AA
 *                        (4.5:1 normal, 3:1 large). Computable precisely because
 *                        of the §4.2 scrim rule: play text always sits on a solid
 *                        token background.
 *   3. TAP TARGETS       every interactive control is at least 44 x 44 CSS px.
 *                        (Inline links inside running prose are exempt — they are
 *                        text, not controls.)
 *
 * This gate is written to FAIL against the shipped 3.0 build. Point it at a served
 * 3.0 export to see the owner's screenshot reproduced as gate output:
 *
 *   node tests/s9-ui.mjs http://localhost:4322     # 3.0 export  -> FAIL
 *   node tests/s9-ui.mjs http://localhost:4321     # 4.0 export  -> PASS
 *
 * Usage: node tests/s9-ui.mjs [baseUrl] [--surfaces=a,b]
 */
import { chromium } from "playwright";
import { readFileSync } from "node:fs";

const BASE = (process.argv[2] || "").startsWith("http") ? process.argv[2] : "http://localhost:4321";
/** A finished 24-season run, so the closing screen can be audited in one load. */
const FINISHED_CAMPAIGN = JSON.parse(
  readFileSync(new URL("./fixtures/finished-campaign.json", import.meta.url), "utf8"),
);
const only = (process.argv.find((a) => a.startsWith("--surfaces=")) || "").split("=")[1];
const ONLY = only ? new Set(only.split(",")) : null;

const VIEWPORTS = [
  { name: "320", width: 320, height: 720 },
  { name: "768", width: 768, height: 1024 },
  { name: "1280", width: 1280, height: 900 },
];
const THEMES = ["light", "dark"];

/** Root of a play surface — 4.0's namespaced root, or 3.0's, so this gate can be
 *  pointed at the parent build to demonstrate the defect it was written for. */
const PLAY_ROOT = ".sim-play-app, .play-app, .sim-campaign, .sim-lab, .sim-door";
/**
 * 5.0 §8 — S-9's browser half also audits the timeline, which is NOT a play surface
 * and has no play root. Auditing it against the play selector reported eighteen
 * "surface did not render" violations that were the harness's assumption, not the
 * page's defect. The timeline's root is `.tl-page`; the audit itself (clipping,
 * contrast, tap targets) is surface-agnostic and applies unchanged.
 */
const TIMELINE_ROOT = ".tl-page";
/**
 * 6.0 §6 — the same argument one family further out. The four reading routes this
 * version adds and the concept table are reading surfaces, whose root is the
 * article wrapper ; they carry no play root and no timeline root.
 * The audit — clipping, contrast, tap targets, horizontal overflow — is
 * surface-agnostic and applies to them unchanged, and it matters most on the
 * set-down one, where the reader has the least to spend on a page that fights them.
 */
const READING_ROOT = ".prose-page";
const rootFor = (name) =>
  name.startsWith("timeline-") ? TIMELINE_ROOT : name.startsWith("reading-") ? READING_ROOT : PLAY_ROOT;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ============================ the in-page audit ============================ */

/**
 * Runs inside the page. Returns { clips, contrast, targets, scrollRegions }.
 * Kept as one function so it is serialised once per surface/theme/viewport.
 */
const AUDIT = function (rootSelector) {
  const roots = [...document.querySelectorAll(rootSelector)].filter(
    (r) => r.offsetParent !== null || getComputedStyle(r).position === "fixed",
  );
  const out = { clips: [], contrast: [], targets: [], scrollRegions: [], rootFound: roots.length > 0 };
  if (!roots.length) return out;

  const path = (el) => {
    const bits = [];
    for (let e = el; e && e !== document.body && bits.length < 4; e = e.parentElement) {
      const cls = (e.className && typeof e.className === "string" ? e.className : "").trim().split(/\s+/)[0];
      bits.unshift(e.tagName.toLowerCase() + (cls ? "." + cls : ""));
    }
    return bits.join(" > ");
  };
  const label = (el) => (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 48);

  const parseColor = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(",").map((x) => parseFloat(x));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  const lum = (c) => {
    const f = (v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => {
    const l1 = lum(a),
      l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  /** Effective background: composite every ancestor layer down to the page. */
  const bgOf = (el) => {
    let acc = null;
    for (let e = el; e; e = e.parentElement) {
      const cs = getComputedStyle(e);
      const c = parseColor(cs.backgroundColor);
      if (c && c.a > 0) acc = acc ? over(acc, c) : c;
      if (acc && acc.a >= 0.999) return acc;
      if (e === document.documentElement) break;
    }
    const white = { r: 255, g: 255, b: 255, a: 1 };
    return acc ? over(acc, white) : white;
  };

  // SELF-ONLY. This walked every ancestor, so marking one container
  // `data-scroll-region` exempted its entire subtree from both clip checks —
  // a clipped button three levels down inside a marked region was invisible to
  // the gate. The exemption belongs to the marked box itself.
  const inScrollRegion = (el) => (el.dataset && el.dataset.scrollRegion !== undefined ? el : null);
  /** Which axis a marked region actually declares; anything else stays checked. */
  const regionAxis = (el) => {
    const r = inScrollRegion(el);
    if (!r) return null;
    const v = r.dataset.scrollRegion;
    return v === "y" ? "y" : v === "x" ? "x" : "both";
  };
  /** Does this element hold its own rendered text (not just descendants')? */
  const ownText = (el) => {
    for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) return true;
    return false;
  };

  const seen = new Set();
  for (const root of roots) {
    /* ---- scroll regions: audited, not merely exempted ---- */
    for (const region of root.querySelectorAll("[data-scroll-region]")) {
      const cs = getComputedStyle(region);
      const axis = region.dataset.scrollRegion === "y" ? "y" : region.dataset.scrollRegion === "x" ? "x" : "both";
      const scrollableX = /auto|scroll/.test(cs.overflowX);
      const scrollableY = /auto|scroll/.test(cs.overflowY);
      const okOverflow = axis === "y" ? scrollableY : axis === "x" ? scrollableX : scrollableX || scrollableY;
      // Keyboard reachability: a scroll container must be focusable (tabindex) or
      // contain a focusable child, else a keyboard user cannot reach the overflow.
      const focusable = region.matches("[tabindex]") ||
        region.querySelector("a[href],button,input,select,textarea,[tabindex]") !== null;
      out.scrollRegions.push({
        where: path(region),
        axis,
        okOverflow,
        focusable,
        pass: okOverflow && focusable,
      });
    }

    for (const el of root.querySelectorAll("*")) {
      if (seen.has(el)) continue;
      seen.add(el);
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue;
      const tag = el.tagName.toLowerCase();
      if (tag === "svg" || el.closest("svg")) continue;
      // VISUALLY HIDDEN content is not rendered text — it is the assistive-tech
      // equivalent every canonical instrument carries under §4.1. Its 1x1 clipped
      // box is the idiom, not a defect, and it has no visual presentation at all,
      // so neither the clip check nor the contrast check has anything to say
      // about it. Detected by the idiom itself rather than by class name.
      const visuallyHidden = (e) => {
        const s2 = getComputedStyle(e);
        const r2 = e.getBoundingClientRect();
        return (
          s2.position === "absolute" &&
          r2.width <= 1.5 &&
          r2.height <= 1.5 &&
          (s2.clipPath !== "none" || (s2.clip && s2.clip !== "auto") || s2.overflow === "hidden")
        );
      };
      let hidden = false;
      for (let e = el; e && e !== document.body; e = e.parentElement)
        if (visuallyHidden(e)) {
          hidden = true;
          break;
        }
      if (hidden) continue;

      /* ---- 1. clipped text ----
         Two distinct failures, both from §4.2:
           (a) UNMARKED CLIPPING — a box that actually clips or scrolls its
               content without carrying `data-scroll-region`. Any content the
               reader cannot get to is a defect unless the region is declared.
           (b) TEXT SPILL — text rendered outside its own padding box. This is
               the owner's clipped-button defect: the UA default `overflow:
               visible` means the box never "clips", the label just escapes it.
         Vertical tolerance is font-relative: an ascender poking a couple of
         pixels past a tight line-height is typography, not overflow, so the
         vertical threshold is a share of the line box (an extra wrapped line
         always exceeds it; a serif ascender never does). */
      // Every element is examined. A marked scroll region is exempt only on the
      // axis it actually declares — a box marked `data-scroll-region="y"` that
      // clips horizontally is still a defect, and used to be waved through.
      {
        const _ax = regionAxis(el);
        const _exX = _ax === "x" || _ax === "both";
        const _exY = _ax === "y" || _ax === "both";
        const overX = el.scrollWidth - el.clientWidth;
        const overY = el.scrollHeight - el.clientHeight;
        const clipsX = /hidden|clip|auto|scroll/.test(cs.overflowX);
        const clipsY = /hidden|clip|auto|scroll/.test(cs.overflowY);
        if (((overX > 1 && clipsX && !_exX) || (overY > 1 && clipsY && !_exY)) && el.clientWidth > 0) {
          out.clips.push({
            kind: "unmarked-clipping",
            where: path(el),
            text: label(el),
            overX,
            overY,
            box: Math.round(rect.width) + "x" + Math.round(rect.height),
          });
        }
        // A control owns its label however that label is marked up.
        // selectNodeContents() already measures the WHOLE label, wrapper spans
        // included — gating entry on a bare text node exempted every button whose
        // label sits in a <span>, which is most of them. This is the gate's
        // headline purpose and the owner's original §2.2 defect.
        const isControlEl =
          tag === "button" ||
          tag === "select" ||
          (tag === "a" && el.hasAttribute("href")) ||
          el.getAttribute("role") === "button";
        if (ownText(el) || (isControlEl && (el.textContent || "").trim())) {
          const r = document.createRange();
          r.selectNodeContents(el);
          const tr = r.getBoundingClientRect();
          const bL = parseFloat(cs.borderLeftWidth) || 0;
          const bR = parseFloat(cs.borderRightWidth) || 0;
          const bT = parseFloat(cs.borderTopWidth) || 0;
          const bB = parseFloat(cs.borderBottomWidth) || 0;
          const roomL = rect.left + bL + (parseFloat(cs.paddingLeft) || 0);
          const roomR = rect.right - bR - (parseFloat(cs.paddingRight) || 0);
          const roomT = rect.top + bT + (parseFloat(cs.paddingTop) || 0);
          const roomB = rect.bottom - bB - (parseFloat(cs.paddingBottom) || 0);
          const spillX = Math.max(roomL - tr.left, tr.right - roomR);
          const lineH = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2 || 16;
          const spillY = Math.max(roomT - tr.top, tr.bottom - roomB);
          const tolY = Math.max(4, lineH * 0.35);
          if (tr.width > 0 && ((spillX > 1.5 && !_exX) || (spillY > tolY && !_exY))) {
            out.clips.push({
              kind: "text-spill",
              where: path(el),
              text: label(el),
              spill: `${Math.round(Math.max(0, spillX))}x${Math.round(Math.max(0, spillY))}`,
              box: Math.round(rect.width) + "x" + Math.round(rect.height),
            });
          }
        }
      }

      /* ---- 2. contrast ---- */
      if (ownText(el) && label(el)) {
        const fg = parseColor(cs.color);
        if (fg) {
          const bg = bgOf(el);
          const composited = fg.a < 1 ? over(fg, bg) : fg;
          const size = parseFloat(cs.fontSize);
          const weight = parseInt(cs.fontWeight, 10) || 400;
          const large = size >= 24 || (size >= 18.66 && weight >= 700);
          const need = large ? 3 : 4.5;
          const r = ratio(composited, bg);
          if (r < need - 0.01) {
            out.contrast.push({
              where: path(el),
              text: label(el),
              ratio: Math.round(r * 100) / 100,
              need,
              color: cs.color,
              bg: `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
            });
          }
        }
      }

      /* ---- 3. tap targets ---- */
      const interactive =
        tag === "button" ||
        tag === "select" ||
        (tag === "input" && !["hidden"].includes(el.type)) ||
        (tag === "a" && el.hasAttribute("href")) ||
        el.getAttribute("role") === "button";
      if (interactive) {
        // Inline links inside running prose are text, not controls. Decided by
        // what the anchor itself PAINTS, not by its ancestors: `closest("p, li,
        // figcaption")` matched ANY ancestor <li>, so every call to action on the
        // play door — all three are `a.sim-primary-btn` inside `ul > li` — was
        // exempted from the 44x44 rule entirely. A link that draws a control is a
        // control wherever it sits; a bare text link stays prose even when a flex
        // parent has blockified it.
        const aBg = parseColor(cs.backgroundColor);
        const aBorder = Math.max(
          parseFloat(cs.borderTopWidth) || 0,
          parseFloat(cs.borderRightWidth) || 0,
          parseFloat(cs.borderBottomWidth) || 0,
          parseFloat(cs.borderLeftWidth) || 0,
        );
        const aPadY = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
        const aPadX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
        const paintsAsControl = (aBg && aBg.a > 0.01) || aBorder > 0.5 || aPadY > 2 || aPadX > 2;
        const inProse = tag === "a" && !paintsAsControl;
        if (!inProse && (rect.width < 44 || rect.height < 44)) {
          out.targets.push({
            where: path(el),
            text: label(el),
            size: Math.round(rect.width) + "x" + Math.round(rect.height),
          });
        }
      }
    }
  }
  return out;
};

/* ============================ the surfaces ============================ */

/** Click the first control in the play root whose text matches. */
async function click(page, text) {
  const el = page.locator(`${PLAY_ROOT}`).locator("button, a", { hasText: text }).first();
  if (await el.count()) {
    await el.click();
    await page.waitForTimeout(90);
    return true;
  }
  return false;
}

async function freshPlay(page) {
  await page.goto(BASE + "/play", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(260);
  // The orchestrator writes a prologue run at mount, so a plain clear races it.
  // Clear, reload, and then step through the resume gate if one still appears.
  await page.evaluate(() => {
    try {
      for (const k of Object.keys(localStorage)) if (k.startsWith("tgtl:play")) localStorage.removeItem(k);
    } catch {}
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(320);
  const gate = page.locator(".sim-play-gate, .play-gate");
  if (await gate.count()) {
    await gate.locator("button", { hasText: "Start a new life" }).first().click();
    await page.waitForTimeout(160);
  }
}

/**
 * The play screens S-9 walks. Phases 1–3 append to this list; the roster in the
 * report is this array's `name` column.
 */
export const SURFACES = [
  { name: "play-intro", async setup(page) { await freshPlay(page); } },
  {
    name: "briefing",
    async setup(page) {
      await freshPlay(page);
      await click(page, "Read the briefing");
    },
  },
  {
    name: "creation-weights",
    async setup(page) {
      await freshPlay(page);
      await click(page, "Read the briefing");
      await click(page, "Create your character");
    },
  },
  {
    name: "creation-leaning",
    async setup(page) {
      await freshPlay(page);
      await click(page, "Read the briefing");
      await click(page, "Create your character");
      await click(page, "Next: your leaning");
    },
  },
  {
    name: "creation-hand",
    async setup(page) {
      await freshPlay(page);
      await click(page, "Read the briefing");
      await click(page, "Create your character");
      await click(page, "Next: your leaning");
      await click(page, "Next: the draw");
      await click(page, "Turn them all");
    },
  },
  {
    name: "arc-decision",
    async setup(page) {
      await freshPlay(page);
      await click(page, "Read the briefing");
      await click(page, "Create your character");
      await click(page, "Next: your leaning");
      await click(page, "Next: the draw");
      await click(page, "Turn them all");
      await click(page, "Begin the run with this hand");
      // Walk forward to the first playable decision. Never touch the play bar —
      // its "Pause & exit" would leave the run.
      for (let i = 0; i < 60; i++) {
        if (await page.locator(".sim-decision-card, .decision-card").count()) break;
        const prim = page
          .locator(`${PLAY_ROOT}`)
          .locator(".sim-primary-btn:not([disabled]), .primary-btn:not([disabled])")
          .first();
        if (await prim.count()) await prim.click();
        else break;
        await page.waitForTimeout(70);
      }
    },
  },
];


/* ---- the 4.0 surfaces: the door, the campaign, the Lab (§8's named list) ---- */

async function freshAt(page, route, clearSim = true) {
  await page.goto(BASE + route, { waitUntil: "domcontentloaded" });
  await sleep(280);
  if (clearSim)
    await page.evaluate(() => {
      try {
        for (const k of Object.keys(localStorage)) if (k.startsWith("tgtl:sim2") || k.startsWith("tgtl:play")) localStorage.removeItem(k);
      } catch {}
    });
  await page.reload({ waitUntil: "domcontentloaded" });
  await sleep(340);
}

async function campaignTo(page, target) {
  await freshAt(page, "/play/campaign");
  const gate = page.locator(".sim-gate");
  if (await gate.count()) await click(page, "Start a different one");
  if (target === "prologue") return;
  await click(page, "Take a starting position");
  if (target === "hand") return;
  await page.locator(".sim-preset-grid").locator("button", { hasText: "Start here" }).first().click();
  await sleep(200);
  if (target === "priorities") return;
  await page.locator(".sim-priority-presets").locator("button").first().click();
  await sleep(120);
  await click(page, "Begin the first season");
  await sleep(240);
  if (target === "briefing") return;
  await click(page, "Allocate the season");
  await sleep(200);
  if (target === "allocate") return;
  await page.locator(".sim-action-grid").locator("button", { hasText: "How you would do it" }).first().click();
  await sleep(180);
  await page.locator(".sim-option-list").locator("button", { hasText: "Commit this" }).first().click();
  await sleep(180);
  await click(page, "Resolve the season");
  for (let i = 0; i < 8; i++) {
    if (await page.locator(".sim-result-list").count()) break;
    if (await page.locator(".sim-beat-inner").count()) {
      if (target === "beat") return;
      await page.locator(".sim-beat-inner").locator("button", { hasText: "Go on" }).first().click();
      await sleep(200);
      continue;
    }
    const doit = page.locator(".sim-option-list").locator("button", { hasText: "Do this" }).first();
    if (!(await doit.count())) break;
    await doit.click();
    await sleep(220);
  }
  if (target === "consequences") return;
  if (target === "explain") {
    await page.locator(".sim-result-list").locator("button", { hasText: "Why this happened" }).first().click();
    await sleep(220);
  }
}

SURFACES.push(
  // 5.0 §8 — S-9's browser half audits /timeline and one milestone page at three
  // viewports x both themes. The timeline is an instrument sitting inside the
  // reading surface, so it gets the same clip / contrast / tap-target audit the
  // play surfaces get.
  {
    name: "timeline-whole-life",
    async setup(page) {
      await freshAt(page, "/timeline");
      await sleep(420);
    },
  },
  {
    name: "timeline-year-open",
    async setup(page) {
      await freshAt(page, "/timeline");
      await sleep(320);
      // open the first milestone drawer so the drawer's contents are audited too
      const d = page.locator("details.tl-ms").first();
      if (await d.count()) {
        await d.evaluate((el) => el.setAttribute("open", ""));
        await sleep(200);
      }
    },
  },
  {
    name: "timeline-sensitive-segment",
    async setup(page) {
      await freshAt(page, "/timeline");
      await sleep(320);
      const d = page.locator("[data-tl-sensitive]").first();
      if (await d.count()) {
        await d.evaluate((el) => {
          el.querySelectorAll?.("details.tl-ms").forEach((x) => x.setAttribute("open", ""));
          el.scrollIntoView();
        });
        await sleep(220);
      }
    },
  },
  // 6.0 §6 — the reading surfaces this version adds, audited at three viewports
  // x both themes like every other surface. The set-down one is here for the
  // same reason the sensitive timeline segment is: a page a depleted reader
  // lands on is the last place a clipped line or a small tap target is
  // acceptable.
  { name: "reading-orientation", async setup(page) { await freshAt(page, "/orientation"); } },
  { name: "reading-burnout", async setup(page) { await freshAt(page, "/situations/burnout"); } },
  { name: "reading-breakup", async setup(page) { await freshAt(page, "/situations/breakup"); } },
  {
    name: "reading-getting-through-today",
    async setup(page) { await freshAt(page, "/situations/getting-through-today"); },
  },
  { name: "reading-concepts", async setup(page) { await freshAt(page, "/topics/concepts"); } },
  { name: "play-door", async setup(page) { await freshAt(page, "/play"); } },
  { name: "campaign-prologue", async setup(page) { await campaignTo(page, "prologue"); } },
  { name: "campaign-hand", async setup(page) { await campaignTo(page, "hand"); } },
  { name: "campaign-priorities", async setup(page) { await campaignTo(page, "priorities"); } },
  { name: "campaign-briefing", async setup(page) { await campaignTo(page, "briefing"); } },
  { name: "campaign-allocate", async setup(page) { await campaignTo(page, "allocate"); } },
  { name: "campaign-consequences", async setup(page) { await campaignTo(page, "consequences"); } },
  { name: "campaign-explain", async setup(page) { await campaignTo(page, "explain"); } },
  {
    // The campaign's CLOSING SCREEN — the longest surface in the build and the
    // last thing a player reads after twelve years. It was never audited, because
    // reaching it through the UI means driving twenty-four seasons; a seeded
    // finished run gets there in one load. It carries the Doors panel, the
    // attribution split, the priority readings and the bridge.
    name: "campaign-parse",
    async setup(page) {
      await freshAt(page, "/play/campaign");
      await page.evaluate((f) => {
        try {
          localStorage.setItem(f.key, f.value);
        } catch {}
      }, FINISHED_CAMPAIGN);
      await page.reload({ waitUntil: "domcontentloaded" });
      await sleep(420);
    },
  },
  {
    name: "lab-compare",
    async setup(page) {
      await freshAt(page, "/play/lab", false);
      await page.locator(".sim-lab-grid").locator("button", { hasText: "Open this one" }).first().click();
      await sleep(280);
    },
  },
  {
    name: "arc-parse",
    async setup(page) {
      await freshPlay(page);
      await click(page, "Read the briefing");
      await click(page, "Create your character");
      await click(page, "Next: your leaning");
      await click(page, "Next: the draw");
      await click(page, "Turn them all");
      await click(page, "Begin the run with this hand");
      for (let i = 0; i < 240; i++) {
        if (await page.locator(".sim-parse").count()) break;
        const rb = page.locator("button.sim-resolve-btn");
        const opt = page.locator(".sim-option").first();
        const beat = page.locator(".sim-scripted-beat");
        if (await rb.count()) await rb.click();
        else if (await beat.count()) await page.locator(".sim-scripted-beat .sim-primary-btn").first().click();
        else if (await opt.count()) await opt.click();
        else {
          const prim = page.locator(`${PLAY_ROOT}`).locator(".sim-primary-btn:not([disabled])").first();
          if (await prim.count()) await prim.click();
          else break;
        }
        await sleep(35);
      }
    },
  },
);

/* ============================ the run ============================ */

async function main() {
  const browser = await chromium.launch();
  const failures = [];
  const stats = { surfaces: 0, checks: 0, elements: 0, scrollRegions: 0 };
  const surfaces = SURFACES.filter((s) => !ONLY || ONLY.has(s.name));

  for (const surface of surfaces) {
    for (const theme of THEMES) {
      for (const vp of VIEWPORTS) {
        const ctx = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          colorScheme: theme,
          reducedMotion: "reduce",
        });
        const page = await ctx.newPage();
        try {
          await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
          await page.evaluate((t) => {
            try {
              localStorage.setItem("tgtl:theme", t);
            } catch {}
          }, theme);
          await surface.setup(page);
          await page.waitForTimeout(140);
          const res = await page.evaluate(AUDIT, rootFor(surface.name));
          stats.checks++;
          const at = `${surface.name} · ${theme} · ${vp.name}px`;
          if (!res.rootFound) {
            failures.push(`${at}: no root matched ${rootFor(surface.name)} (surface did not render)`);
          }
          for (const c of res.clips)
            failures.push(
              `${at}: CLIPPED TEXT (${c.kind}) ${c.where} box=${c.box} ${
                c.kind === "text-spill" ? `spill=${c.spill}px` : `overflow=${c.overX}x${c.overY}px`
              } — "${c.text}"`,
            );
          stats.elements += res.scanned || 0;
          for (const c of res.contrast)
            failures.push(
              `${at}: CONTRAST ${c.ratio}:1 < ${c.need}:1 ${c.where} color=${c.color} on ${c.bg} — "${c.text}"`,
            );
          for (const t of res.targets)
            failures.push(`${at}: TAP TARGET ${t.size} < 44x44 ${t.where} — "${t.text}"`);
          for (const r of res.scrollRegions) {
            stats.scrollRegions++;
            if (!r.pass)
              failures.push(
                `${at}: SCROLL REGION ${r.where} axis=${r.axis} scrollable=${r.okOverflow} keyboard-reachable=${r.focusable}`,
              );
          }
        } catch (err) {
          failures.push(`${surface.name} · ${theme} · ${vp.name}px: driver error — ${err.message}`);
        }
        await ctx.close();
      }
    }
    stats.surfaces++;
  }
  await browser.close();

  const pass = failures.length === 0;
  console.log(`\n[${pass ? "PASS" : "FAIL"}] Gate 109: S-9 · UI integrity (clip / contrast / tap-target)`);
  if (pass) {
    console.log(
      `   ${stats.surfaces} play surfaces x ${THEMES.length} themes x ${VIEWPORTS.length} viewports = ${stats.checks} audits: ` +
        `no clipped text, every text/background pair at WCAG AA, every control >= 44x44, ` +
        `${stats.scrollRegions} marked scroll regions genuinely scrollable and keyboard-reachable.`,
    );
  } else {
    const shown = failures.slice(0, 40);
    for (const f of shown) console.log("   " + f);
    if (failures.length > shown.length) console.log(`   ... and ${failures.length - shown.length} more`);
    console.log(`   ${failures.length} S-9 violations across ${stats.checks} audits.`);
  }
  process.exit(pass ? 0 : 1);
}

main();
