# The Guidebook to Life — 6.0 Blueprint: The Consolidation

**File:** `blueprint_TGTL_6.0.md` — in the repository this time, not the workspace root, because the build handoff requires it committed on `consolidation/6.0` and the repository is the one writable folder. No copy is placed beside its predecessors at the workspace root unless the owner asks.
**Version:** 6.0.0 (build authority for the consolidation track). *Not adversarially audited by workflow:* the owner's standing call for this seat is no `ultracode`; the review this document gets is the architect's own batch reviews (§9) and the pre-merge self-review against §10, with findings against this blueprint recorded in `DECISIONS.md` §8, never resolved silently.
**Date:** 2026-09-04
**Authored by:** Claude Fable 5.1 (architect and reviewer for TGTL 6.0; the Phase A architect wrote the register this blueprint builds from).
**Revises:** the live TGTL 5.0 preview (`main`, commit `cdfcfce` and the two record commits after it). The 5.0, 4.0, 3.0 and 2.0 blueprints remain governing authority for everything not explicitly changed; every supersession is named in §2.3.
**Scope authority:** `records/consolidation-register.md` §8 — the 130 rows the owner accepted on 2026-09-04. This blueprint adds no row and drops none.

---

## 0. Authority, versioning, and boundaries

### 0.1 Precedence

1. Direct instructions from the project owner. The standing ones for this track: *the calls stand on every row; build the 6.0 scope of 130 rows; merge when green; the archive stays in the workspace root; run without ultracode.*
2. `TGTL_6.0_CONSOLIDATION_HANDOFF_PROMPT.md` (§0.3 walls, §3 format, §4 build rules, §5 verify and merge, §6 never-do, §8 delegation) and `TGTL_6.0_BUILD_HANDOFF_PROMPT.md` (what Phase A settled; the fix-first batch; the group list). Where this blueprint and those two differ, they win and the difference is recorded as a finding against this blueprint.
3. This blueprint.
4. `records/consolidation-register.md` §8 — the scope — and the rows it names, each read in full (nugget, landing, doctrine check, cost, call). A row's *lands in* field is the default architecture; this blueprint's §3 says where it departs from a row and why.
5. The trunk's `DECISIONS.md` §0–7 and `KNOWN_LIMITATIONS.md` §0–6, then `blueprint_TGTL_5.0.md`, `blueprint_TGTL_4.0.md`, `blueprint_TGTL_3.0.md`, `blueprint_TGTL_ChatGPTSol5-6_2.0.md` — inherited authority for everything unchanged.
6. `MASTER_PROJECT_BRIEF.md` — rationale, never build authority. Its §14A and every "Inferred" section still carry the owner's *provisional* stamp; N-435 records the acceptance labels the register supplies, and nothing else in the brief is promoted by this build.
7. The archive — the nine prototype folders in the workspace root and the four Sol-lane specs — as **read-only input**. A prototype is a prose and mechanism donor. It is never a numeric source, never a file to copy from, and never written to.

Conflicts resolve toward the 2.0 §1.2 priority order (help > protect > orient > actionable move > explain on demand > machinery last). Safety-relevant conflicts stop and ask; nothing else does.

### 0.2 Folder boundary — absolute

- Build in **`The Guidebook To Life Website\`** only (git; `origin` = JasonHuang24/TGTL; branch **`consolidation/6.0`**, which already carries the register and triage commits on top of `main`). Never push to `main` outside the Phase D merge; never force-push; never rewrite published history.
- The archive folders (`gol-opus4-6`, `gol-opus5`, `gol-fable5`, `gol-claudefamily`, `gol-chatgptsol5-6`, `tgtl-chatgptsol5-6-2.0`, `tgtl-claude-2.0`, `tgtl-claude-3.0`, `tgtl-claude-4.0`) and every document at the workspace root are read-only. `records/boundary-proof.md` is regenerated at Phase D; because the archive sits *outside* the repository the proof covers the repository and the root documents only, and says so.
- Environment: system Node is 16. A portable **Node v22.20.0** exists at `C:\Users\sourd\AppData\Local\Temp\claude\F--Programming-The-Guidebook-to-Life\0b89b0b3-2ff9-4858-b316-c3490a384f95\scratchpad\node-v22.20.0-win-x64` (checked 2026-09-04). Any Node ≥ 18.18 reproduces the build; that remains the durable statement. Python 3.10 is at `C:\Python310\python.exe`; the falsify script calls `python3`, so the Opus briefs put both on `PATH`.

### 0.3 The executor, and how this blueprint manages the risk

The executor is **Claude Opus, in batches, briefed and reviewed by Fable 5.1**; Fable alone commits and pushes. The known failure mode of a build agent handed 130 small rows is not invention at scale — it is **porting**: lifting a prototype's component, page, or subsystem into the trunk as a foreign body because that is faster than finding where the idea belongs. The walls for that:

- **Every row lands in an existing module or a new file inside an existing directory**, named in §3 per row. A batch that needs a new directory, a new storage key outside `lib/storage.ts`'s `STORAGE_KEYS`, a new stylesheet, or a new top-level component family stops and reports; that is a §0.3 invention with an adversarial check, or it is wrong.
- **Content travels through the pipelines** (`tools/build-content.mjs` for campaign content; `npm run content:timeline` for timeline records) and never by hand-editing generated files.
- **The invention rule carries forward unchanged** (4.0 §0.3): any mechanism beyond this blueprint's letter gets an `INVENTION:` entry in `DECISIONS.md` §8 with its adversarial check, in the N-436 shape (§3.11), before it ships.
- **The implementation-readiness rule** (N-307) is a standing instruction in every brief: where a row's landing or meaning is under-specified, the agent writes a *gap report* naming what it would have had to invent, and builds the rest. It does not invent product meaning to fill the hole.
- **A gate is not a gate until it has been shown to fail.** Every new assertion in §8 names its plant; the agent writes the assertion, plants the violation, watches it go red, then builds.
- **Fable never delegates** this §0, §5, §11's FORBIDDEN list, any change to a lint or exclusion list, the batch review, the commit, the push, or the final report.

### 0.4 The owner's commission (restated as requirements)

> "Consolidate all the best features from each website into the published one. The best ideas, the nuggets you draw from it, etc. This includes the work from ChatGPT and the other Claude models."

1. **Into the published one.** The trunk is the site. Every nugget extends its architecture: `content/routes.ts` as the single route inventory, `<Term>` for edition vocabulary, content in `content/`, gates extended never bypassed.
2. **The best, not the most.** 130 rows, most a sentence, a field or a small component; the medium and large ones are the shortlist of register §6. The parked areas are a roadmap, not this version.
3. **From every lineage.** Claude 2.0 → 4.0's own deferrals, the four `gol-*` candidates, Sol's two lanes and four specs, and the master brief's provisional half all have rows in scope.
4. **The owner's standard governs the craft:** user-friendly, smooth, fun — not feature-rich. Realism over simplification. Sensitive-page tone graded hardest. Auditable process.

---

## 1. What version 6.0 is NOT

Everything 2.0 §1.3, 3.0 §0.4, 4.0 §1 and 5.0 §1 forbid still holds. Specifically for this track:

- **Not the parked areas.** The social manual (N-141), the Atlas of arenas (N-154), the story campaign "The Years Between" (N-220), the Living Scene (N-250), the ethics and meaning wing (N-393), the topic set (civic, housing, place, identity, sexuality, meaning — N-415, N-421, N-422, N-424, N-425), archetype resemblance (N-086). Each is a version of its own; each is named in `WHATS_COMING`, ordered per N-437, and nothing inside any of them is harvested piecemeal "because it was cheap".
- **Not the 6.1 evidence pass.** N-284, N-285, N-286, N-287, N-288, N-292, N-293, N-294, N-295, N-297, N-298, N-300, N-303, N-305, N-429, N-252, N-255 are accepted and deferred. They are never marked done, never partially built, and `KNOWN_LIMITATIONS.md` §0 names them as the next pass.
- **Not the stop-and-ask rows.** N-324 (frame-strength tags), N-376 (peer-advantage population rule), N-381 (screening-threshold record kind) would each *add* a lint rule. The owner has not said the word. They are parked, named in §12, and not built.
- **Not a new mode, scene, or story.** No fourth play mode, no graphical scene layer, no authored campaign. Group I ships two *rules* (N-253's presentation walls, N-256's rejection tests), not a scene.
- **Not self-insertion.** 4.0 §12.4 stands: hands come only from Birth RNG or the five labelled-fictional presets; S-6 asserts there is no third route. N-150's position control is a reading-layer filter over cost notes, never a character.
- **Not a sensitive-page edit.** The five pages stay byte-identical at source. N-263 and N-265 are chrome changes that *render* on set-down routes and are reviewed as if they touched them; their diffs are in `components/`, never in `app/situations/*` or `app/threshold/supporting-someone`.
- **Not a gate closed, a label removed, or a lint relaxed.** The footer stamp becomes "TGTL 6.0 preview" and every human gate in `KNOWN_LIMITATIONS.md` §0.1 and §1 is restated unchanged. The exclusion lists and the normative lint are not touched. Where a row *tightens* a wall (N-273, N-233, N-268) it is an addition and is proven red on a plant.
- **Not a number from a prototype.** The four re-sourcing rows (N-025, N-119, N-160, N-260) each fetch or soften; every other row carries no digit.
- **Not a wider scope.** Nothing outside register §8 is built. A good idea found mid-build goes into `DECISIONS.md` §8 as a candidate for the register, not into the tree.

---

## 2. What survives, what is added, what is superseded

### 2.1 Preserved LITERAL (do not reopen)

- **The playable layer's engine and content pool as 4.0 shipped them**, except where a group H row names a file: `lib/sim/persist.ts` (N-226, N-216, N-223), `lib/sim/season.ts` (N-212's pure preview, added not changed), `content/sim/campaign/actions-small.ts` (N-213), `content/sim/campaign/doors.ts` (N-214), `content/sim/lab/situations.ts` (N-192, N-193, N-225), `components/sim/*` and `components/play/Parse.tsx` for rendering. `gates:balance` and `gates:pileup` re-run after any change to the engine or the pool.
- **The timeline, entire**, except the schema additions F names (N-379's route grade, N-386's source-timing field) and the records those force through `npm run content:timeline`. T-12 isolation holds: nothing under `lib/sim`, `components/sim`, `components/play` imports timeline content.
- **The safety spine:** the five sensitive pages byte-identical; triage's two-question maximum; Help-now on every route without a menu; quick exit; the set-down system and quiet nav subset; the hotline fixture's verification discipline (N-260 rewrites records *through* it, with `sourceUrl` and `lastVerified` re-stamped).
- **The 5.0 gate roster,** run unchanged and green on the branch before batch one, and green at handback with §8's extensions in place.
- **Editions, intensity, the terminology map** — extended (N-327, N-358, N-322's tags, N-326's marker), never bypassed.
- **The UI standing law** (4.0 §2.2/§4.2) and S-9 over every new or changed surface.
- **The decision record's form**: `DECISIONS.md` gains §8 "Consolidation" *above* the 5.0 record; nothing below it is edited.

### 2.2 Added

Four reader routes (§3.1); a set-down route (N-023); the concept index (N-111); the position context (N-150); the play-layer disclosures and instruments of group H; the tier board's switchable objective (N-170); the records apparatus of group K (`SAFETY_SOURCES.md`, the disanalogy register, the retractions register, the owner-decisions register, the readiness rule); the C-gate suite (§8); `DECISIONS.md` §8 and `KNOWN_LIMITATIONS.md` §0 "6.0".

### 2.3 Superseded — named

1. **3.0 §6.1's designation of `/orientation` as a sanctioned redirect stub** is repealed: `/orientation` becomes a real reading route, "The Human Package" (N-001). `/roadmap` stays a stub. The route inventory's header comment ("27 reader routes + 2 sanctioned redirect stubs") is corrected to the new count.
2. **2.0 §6.9's rule that `WHATS_COMING` is "the ONLY place unbuilt scope is named"** is *extended*, not repealed: it stays the single source, and N-302's inline "planned" markers are *generated from it* (§3.11), so the sentence remains true.
3. **The 4.0 `DoorMeaning` union** (`"opened" | "closed" | "still recoverable"`) gains `"narrowing"` (N-214). The doors gate's colour rule is extended so the fourth state is never painted as good.
4. **2.0 §9.4's `CorrectionKind`** is unchanged, but retractions gain their own permanent register beside `CORRECTIONS` (N-290); a retraction is still also a corrections row.
5. **The 5.0 evidence-label set** is unchanged for content; N-299 adds a *separate* `BehaviourLabel` for engine and ordering behaviour (`design-hypothesis`), so the six content labels never have to describe a ranking.
6. **The 4.0 `INVENTION:` entry shape** gains three fields (N-436): hidden definitions, ethical and interpretive risks, open questions. The adversarial check stays.
7. **The footer stamp** becomes "TGTL 6.0 preview — The Consolidation · what is still unreviewed"; `package.json` becomes `tgtl-6.0`, `6.0.0`.
8. **`KNOWN_LIMITATIONS.md` §1.4** is corrected: `beat-someone-ill` names `/topics/relationships`, as `content/sim/campaign/beats.ts:58` has always said. The code is the honest record; the prose was wrong.

---

## 3. Architecture, by group

Each row's register fields are the specification; this section says where it lands and what shape it takes in the trunk. "Text" means authored prose in an existing content module or page, under the voice rules of 2.0 §7 and, on play surfaces, `content/sim/AUTHORING.md`.

### 3.1 Routes (the complete delta — nothing else ships)

| Route | Page | Intensity | Row | Notes |
|---|---|---|---|---|
| `/orientation` | **The Human Package** — the seven facts every life begins inside, as a reading page | light | N-001 (+ N-002, N-003, N-004, N-008) | stub → real route; reachable from `/` ("What is this?", N-005) and `/walkthrough`; searchable |
| `/situations/burnout` | **Burnout** — a four-step decision sequence | light | N-025 (+ N-045, N-280) | Maslach construct renders only with a fetched source record, else without attribution |
| `/situations/breakup` | **A breakup** — several systems fail on the same day | light | N-026 (+ N-045) | loss-adjacent; tone graded on the sensitive bar; links `/topics/relationships`, `/guidance/daily-plan` |
| `/situations/getting-through-today` | **Getting through today** — six items and permission to stop reading | **down** | N-023 | register zero; linked from `/triage` and `/threshold`; no analytical framing and no instrument link above the fold |
| `/topics/concepts` | **One idea, four systems** — the concept index | light | N-111 | rendered from `content/concepts.ts` |

Rules: no other new route. Every new route enters `ROUTES` with `changes:` (N-296 — the decision or orientation it changes), is walked by gate 1 and gate 5, and is in the search index (N-012). `/situations/getting-through-today` joins `SETDOWN_ROUTES` by its intensity, so it inherits the quiet nav, gate 2's vocabulary lint, N-263's double-Escape and N-235's no-play-entry rule automatically. `/situations/waiting-on-a-decision` is **not** a route: N-036 lands as a section on `/situations` and a plan shape on `/guidance`.

### 3.2 Group A — Entrance, orientation and navigation

- **N-001** `app/orientation/page.tsx` replaces the stub. Seven headed sections in warm second person, edition-neutral, donors: `content/play/framing.ts`'s `BRIEFING_POINTS` (adapt, never paste), the Claude 2.0 orientation page and the Sol synopsis (prose donors). The "adaptability has an edge" point is the seventh. Renders complete with JS off (C-26).
- **N-002** The anti-app declaration is the page's first paragraph, and one sentence above the doors in `components/EntranceHome.tsx` (the existing `.doors-privacy` line moves up and gains "a guidebook, not an app"; the footer keeps its own line).
- **N-003** One clause in the orientation page's win-condition section and in `content/play/framing.ts` `WEIGHTS_INTRO`.
- **N-004** The "just take the risk" sentence on the orientation page and at the head of `/map/credential-decision`.
- **N-005** A `What is this?` link under the book pair on the entrance, into `/orientation`; the doors registry is unchanged (gate 0 asserts six doors; this is not a door).
- **N-008** An ordered reading path of nine stops with a reason each and a stated skip list, at the foot of `/orientation`; the one thing never skippable is knowing where `/triage` is.
- **N-009** "A map with weather" on `/map`'s header (the trunk already has "not a single ladder"; the sentence completes it).
- **N-012** `components/Search.tsx` reads a build-time index `content/generated/search-index.json` produced by a new `tools/build-search-index.mjs` from `ROUTES` (title, summary, keywords), the `<h2>`/`<h3>` headings of every reader page in `app/**`, and every generated milestone route from `content/timeline/generated/routes.ts`. Anchors are `path#slug`. No network at query time (gate 9). C-27.

### 3.3 Group B — Situations and triage

- **N-021** `app/triage/page.tsx`: the "something is being demanded of me" branch offers four structural chips — paperwork I do not understand · one high-stakes thing to get through · someone else needs looking after · a decision I cannot take back — each landing on a complete page (`/situations/job-loss`, `/character/board`, `/topics/relationships`, `/guidance`). Still two questions at most.
- **N-023** The set-down route above. Six unglamorous items (the Opus 5 donor's list, adapted), then the sentence that nothing here is for the reader right now and the page is finished. Help-now stays in the chrome. C-28.
- **N-025** Four steps as `PathwayStep`s (N-045): confirm what this is · stop the bleeding · find the root cause · make the structural change. Step four carries N-280's callout. The exhaustion / cynicism / reduced-efficacy construct: **web fetch is the precondition** — fetch the primary or a reputable-secondary page, quote ≤ 25 words, record it in `records/research-pipeline.md` as consolidation batch 4, and attach an `EvidenceRecord` with `status: "researched"`; if no page is fetched, the three words render as the site's own description with `status: "editorial"` and no name attached. C-29.
- **N-026** Four sections: what fails at once · the first fortnight (rebuild daily quests before the existential questions, linking `/guidance/daily-plan`) · common mistakes · recovery routes beside every named cost. Loss-tier vocabulary is not used; the page is light intensity, not down, and the review reads it at the sensitive bar.
- **N-036** "Waiting on a slow decider" as a section on `app/situations/page.tsx` (find the real timescale · do the branch-independent work · prepare the worse branch once in writing, then stop · set a review trigger; and the four things that reliably do not work) and as a named plan shape in `content/guidance.ts`.
- **N-041** A section on `/situations` titled "Not solvable, only navigable", naming the class (two wants that are incompatible; two obligations that both bind), linking the board's conflict step and `/guidance`'s no-recommendation state. C-30: the section carries no recommendation verb.
- **N-045** `PathwayStep` in `components/primitives.tsx`: heading, body, and a `primary` system label rendered through `<Term>`; applied to `/situations/job-loss` (retrofit) and the two new pathways. Set-down routes render no step chrome (they do not use the primitive).
- **N-046** A three-horizon ladder on `/situations/job-loss` — the first day · the first days · the first two weeks — ending in a rhythm-restoration step. No digits, no jurisdictional claim.
- **N-047** A worked Board example on `/situations/job-loss`, filled in for this situation as a `<dl>`, linking `/character/board`.

### 3.4 Group C — Board, logs and guidance

- **N-062** "Asking, waiting, and accepting are moves too" in `content/board.ts` (`READINGS`), the `/guidance` plan list, and `/character/board`'s closing prose.
- **N-064** The wall-or-door procedure in `content/board.ts` at the `wall` step: four ordered questions with stop-at-first-clear-answer, and the two-sided warning.
- **N-066** The conflict step distinguishes scheduling conflict from horizon conflict with the two-sentence diagnostic; labelled `editorial` (the donor graded it as the authors' own inference).
- **N-072** A `this does not fit` control per reading card and `none of these fit` for the set, on `/character/board`, `/guidance` and `/character`; stored under the existing `board` / `guidance` keys as a local rejection flag; a rejected reading renders struck and unweighted. C-36.
- **N-073** A `borderline / depends on context` value on every enumerated preference select on the board and in guidance, distinct from `unknown`.
- **N-074** `components/Logs.tsx`: a copy-to-clipboard of the decision record and upkeep list as plain text, and a print stylesheet block. Nothing leaves the device. C-37.
- **N-075** The quest-alignment question beside the upkeep list in `Logs.tsx` and on the board's still-want-it step; nothing stored.
- **N-077** Per-task `minimum`, `alternative`, `stop` on the daily plan (`app/guidance/daily-plan`) and the upkeep list. C-38.
- **N-078** "The blank state is private, not incomplete." on every empty local-state surface: `/character/logs`, `/guidance/daily-plan`, `/play`'s saves panel.
- **N-080** `components/Guidance.tsx`: the disclosure panel echoes the objective set, the active constraints and vetoes, and the horizon above any ranked output. C-39.
- **N-084** "A pivot is a planned response, not proof of a failed person" on the guidance pivot strip and in `Logs.tsx`.
- **N-088** The no-recommendation state hands over three moves and lists which of the four inputs are still missing.
- **N-089** "Choose the cheapest question whose answer could change your decision" on `/guidance` and `/triage`.
- **N-091** `/guidance/daily-plan` gains a stated separation line and is named on the `/play` door as the real-world planner that is not a mode of the fiction. C-40.
- **N-093** A `NoWinner` closing panel in `components/primitives.tsx`, applied to `/map/credential-decision` and the `/history` tier board. C-41.
- **N-094** The reversibility rule stated in `content/guidance.ts` above the per-plan `reversibility` field, on `/guidance` and `/map/credential-decision`.
- **N-095** Opportunity cost as a decision tool on `/guidance` and in `/topics/money`'s exchange-rates section.
- **N-371** Maintenance debt named beside the upkeep list with its caveat in the same breath.
- **N-399** `content/character.ts` and `components/CharacterSheet.tsx`: the sheet's structure becomes five headed layers — attributes · skills · conditions · resources · outcomes — and a need state is never an attribute. `NOT_A_STAT` stays.
- **N-403** `LifeStat` gains `population: string`; every band renders it. The no-composite gate is unchanged.
- **N-405** `NOT_A_STAT` decomposes Charisma, Wisdom, Luck and Appearance instead of only refusing them, and says more is not always better.
- **N-408** "Whose scorecard is this" — the seven-way taxonomy on `/character` and `/guidance`, as text, never as a control.
- **N-411** Behaviour versus stated values with the constraint caveat, on the board and the daily plan.

### 3.5 Group D — Topics and the mechanism spine

- **N-111** `content/concepts.ts`: ten concepts × the four topic guides (+ the map and the play layer where the mechanism exists), each cell a one-line gloss and a link to the route that owns the mechanism. Rendered as a table on `/topics/concepts`. C-31 extends the single-home rule.
- **N-116, N-136, N-137, N-139, N-140** sections on `/topics/work` and `/topics/relationships` (reputation as a cache; reading a room; the school's rules; the unwritten-rules payload; the marked lens switch — the last also on `/topics/health`).
- **N-119** Reciprocity on `/topics/relationships`, extending the untallied-ledger section. "Across every culture yet measured" is **softened** to the site's own voice ("wherever it has been looked for") and labelled `editorial`; it is not sourced in this version.
- **N-124** The three learning-curve shapes on `/topics/work`, linked from `/map/credential-decision` and `/guidance`.
- **N-127** Attention as unstorable on `/guidance/daily-plan` and `/character`; the time diary named as external instrumentation the site never asks you to log here.
- **N-128** On `/topics/health`: a drained body experiences a drained world; the eleven-o'clock rule; the honest hand-off when the grey does not lift, which *routes* to `/situations/depression` and diagnoses nothing.
- **N-130** The ask-craft on `/topics/relationships`, `/situations/job-loss` and `/guidance`.
- **N-131** The love carve as a framing section on `/topics/relationships`.

### 3.6 Group E — Map and position

- **N-150** `lib/guide-context.tsx` exposes `position` (floor · backing · obligations, each enumerated) read from and written to the existing `STORAGE_KEYS.credentialPosition`; `components/CredentialFilter.tsx` becomes the shared `PositionControl`; `/map/launch`, `/topics/work`, `/topics/money`, `/situations/job-loss` and `/guidance` gain `PositionNote` blocks that re-resolve from it. Position never enters a URL, never produces a rank, band or comparison between readers (C-42), and never reaches the play layer.
- **N-160** `components/Roadmap.tsx`'s lens note says plainly that no sex-linked difference has been researched for the map's windows: this is an absence, not a finding. C-5 asserts the three settings render byte-identical stage content until a sourced difference exists.

### 3.7 Group F — Timeline

- **N-379** `content/timeline/schema.ts`: `Branch.routes` entries may carry a grade — `easy | costly | partial | closed` — and T-4 is extended to accept a graded route where it required a bare one. Existing records are unchanged; the grade is opt-in and rendered as the word beside the route.
- **N-386** `Source` gains `timing?: "contemporaneous" | "retrospective"`, required on any source cited by a `cultural-expectation` record; T-9's `measures` discipline extends to it, and `content/timeline/AUTHORING.md` states the rule. Any record change goes through `npm run content:timeline` with the 5.0 verifier discipline and a batch in `records/research-pipeline.md`.

### 3.8 Group G — History

- **N-170, N-171, N-172, N-176** in `content/history.ts` and `components/History.tsx`: the tier board gains a *ruleset header* rendered above the letters (objective · unit · priority factors · not measured · evidence state); its objective is a `<select>` over an enumerated set (the trunk's current "era power" objective plus autonomy and at least one more), each with its own placement set and a qualitative factor-weight inspector ("very high / high / low", never a number); the S tier of at least one objective is empty and badged `insufficient-evidence`; the patch note renders official rules · practical effects · rollout and lag as three parallel panels. The board closes with the `NoWinner` panel (N-093). C-43, C-44.

### 3.9 Group H — The play layer, existing modes

- **N-190** `components/sim/CampaignApp.tsx`'s explain drawer renders an action's `failureModes` line beside the attribution split *and beside the tied recovery route*, never instead of it. C-2.
- **N-191** The action card renders `contract.switchingCost` beside `opportunityNote`. C-3.
- **N-192** `lab-the-repair` gains a draw-vary seed pair curated to land the same; `tools/curate-lab-seeds.ts` gains the second criterion; the same-outcome reading in `lib/sim/lab.ts` renders. C-11.
- **N-193** One Lab situation sets `decisionStep` to a later step; S-1's one-step-differs assertion covers it.
- **N-194** A `Repeat last season` control on the briefing step when `quiet` is true: the previous allocation is proposed as an ordered set the player commits with one action; the briefing shows only the delta. It commits through the same path as a hand allocation (S-7 replay byte-identical); S-4's keyboard walk includes it. C-12.
- **N-195** `content/sim/methodology-copy.ts` discloses the seed curation, naming `tools/curate-lab-seeds.ts` and the criterion. C-13.
- **N-204** Each preset's `face` motif renders in the season chrome on every turn. C-14.
- **N-211** Every option renders the five-field contract — capacity · what waits · reversibility · if it goes badly · evidence — before commitment. "If it goes badly" is the tied recovery route, so no new content is invented: the schema already carries it for endurance options, and the compiler requires it for every option from this version (a batch with an option lacking one fails the build by id). C-15.
- **N-212** `lib/sim/season.ts` gains a pure `previewAction(state, optionId)` returning the domains touched, whether a consequence is queued, and what waits; `CampaignApp` renders it on focus/hover in an `aria-live="polite"` pane. C-16 proves it writes nothing.
- **N-213** `content/sim/campaign/actions-small.ts` gains a standing `upkeep` option present in every season and affordable in the worst capacity envelope of every preset. `gates:balance` and `gates:pileup` re-run. C-17.
- **N-214** `DoorMeaning` gains `"narrowing"`; the parse's Doors panel renders it in a neutral token, never the "open" colour.
- **N-216** `lib/sim/persist.ts` stores each resolved season's rendered explanation with `contentVersion`; the season list reopens the stored text, never a recomputation. C-20.
- **N-218** The Queue instrument's empty state: "No known delayed consequence is pending. Uncertainty has not disappeared." C-21.
- **N-222** `components/play/Parse.tsx` attribution counts carry the not-a-blame-ledger line (S-12 extended).
- **N-223** A resumed run whose `contentVersion` differs renders the drift notice.
- **N-224** `components/sim/LabApp.tsx` narrates when a comparison stops being controlled.
- **N-225** Every Lab situation declares `unknowns`, rendered before the branches. C-22.
- **N-226** `lib/storage.ts` gains a `writeVerified(key, value): SaveStatus` that reads back what it wrote; `lib/sim/persist.ts` and `lib/engine/persist.ts` report one of seven statuses (saved · memory-only · blocked · full · malformed-quarantined · migrated · unresumable) and quarantine an unparseable original under the same key with a `.quarantine` suffix rather than overwriting it. The save UI renders the status. C-1, proven red on a throwing `setItem` first.
- **N-227** `components/ResetButton.tsx` and the saves panel: arm-then-confirm, with "cannot be undone by the Guidebook" and the sibling-branch line.
- **N-228** A `StateRail` in `components/sim/` renders skills, capabilities, conditions and maintenance load mid-run from `SimState`, in words and bands, no numbers. C-23.
- **N-233** `content/terminology.json` gains the Game Guide forbidden-register list (no combat skin: no swords, health bars, enemies, damage, boss fights); `app/sim.css`'s token set carries the rule that no token pair encodes valence as green/red across a resolution. C-19.
- **N-234** "Randomness represents uncertainty, not fate" once, where the seed is inspectable.
- **N-235** A `TryInPlay` link (through `<Term>`) on `/topics/*`, `/map/credential-decision` and `/situations/job-loss`, pointing at the relevant mode. Never on a set-down route. C-24.
- **N-341** The parse's closing frame returns to the ethereal library, asserting nothing about what follows.
- **N-355** Every parse panel declares recorded · interpreted · unknowable. C-25.
- **N-366** Four words per act on `/play/arc` and the early map stages: happens to · decided for · decided with · decided by.

### 3.10 Group J — Safety and threshold

- **N-260** Precondition: fetch the helpline's official page and the pages for Scotland, Wales, Northern Ireland and Ireland; quote ≤ 25 words each; record every retrieval in `records/research-pipeline.md` (consolidation batch 2). Then `content/hotlines.ts`: `Hotline` gains `coverage: Nation[]` (enumerated), `regions` is *derived* from it, and the abuse group carries one verified line per nation plus Ireland's own service, each with `sourceUrl` and `lastVerified` re-stamped. C-4: a label broader than its coverage fails, proven red by planting a UK-labelled England-only number. `content/safety-resources.json` (unreferenced) is either brought into line or deleted with its reason recorded.
- **N-262** `app/threshold/page.tsx#privacy`: the incognito caveat, device and network and account logs, bills.
- **N-263** `components/SiteChrome.tsx`: double-Escape within 900 ms triggers the existing quick exit on every route in `SETDOWN_ROUTES`. C-6 in the browser gate.
- **N-265** `components/SetDownNotice.tsx`: "Your reading preference has not been changed."
- **N-266** The footer names what is stored and what the application cannot see; `/methodology` repeats it.
- **N-267** `SAFETY_SOURCES.md` at the repository root, one entry per fixture region with the page checked, the scope caveats and the maintenance rule ("a routing change is not a re-verification; an unverifiable region shows the directory fallback"). C-7.
- **N-268** The board's crisis short-circuit generalised: `content/exclusions.ts` gains the sentence as doctrine, `components/Guidance.tsx` checks the safety route before any ordering runs. C-8.
- **N-272** The rule written in `content/routes.ts`'s header and on `/methodology`: a set-down route may render an evidence label and may not render a game term. Applying it to the frozen pages waits for their review. C-9.
- **N-273** `content/sim/AUTHORING.md` §"Loss tier" gains "Keep the referent unnamed" as law. C-10.
- **N-430** The owner's privacy and psychological-risk list, the attribute-ethics rules and the ten risks of a life parse, published as checklists on `/methodology` and in `KNOWN_LIMITATIONS.md`, recorded in `DECISIONS.md` as the walls' origin.
- **N-253** (group I) The presentation walls for any future graphical layer, written into §5.4 below, `content/exclusions.ts` as commentary, and `KNOWN_LIMITATIONS.md`. No scene is built; the gate is the text's presence and the rejection tests of §10.
- **N-256** (group I) The rejection tests are §10's second list.

### 3.11 Group K — Methodology, evidence and records

- **N-280, N-281, N-282, N-283** `content/methodology.ts` `KNOWN_BREAKS` becomes the **disanalogy register**: numbered, anchored, each entry with severity, status, candidate fix and `inheritedBy: RoutePath[]`; two new entries (the emotional gap, the coherence illusion) plus the others N-282 names; a `ModelBreak` callout in `components/primitives.tsx` that cites an entry by number on the page where the model breaks (`/topics/work` and burnout for the structural-change move; `/situations/job-loss` for the floor). `/methodology` frames the section as a page that undermines the site on purpose. C-45.
- **N-290** `RETRACTIONS` beside `CORRECTIONS`, published empty with its format (original text kept visible, struck). C-46.
- **N-291** `RevisionNote` primitive; any page changed by a logged correction renders one. C-47.
- **N-296** `RouteRecord.changes` and the admission test on `/methodology`. C-48.
- **N-299** `content/evidence.ts` gains `BehaviourLabel = "design-hypothesis"`; the engine-weights section and `/guidance`'s ranking carry it. The six content labels are untouched.
- **N-301** `RouteRecord.perishable?: { reviewBy: string }`; `StalenessStamp` renders on every route flagged. C-49.
- **N-302** `RouteRecord.planned?: string` on index cards, generated from `WHATS_COMING` entries by id; the index pages render "planned" badges in place. C-50.
- **N-304** The methodology header line.
- **N-306** `tests/browser-gates.mjs` and `tests/s9-ui.mjs` snapshot every `tgtl:*` key before running and restore it after. C-51.
- **N-307, N-309, N-310, N-311** Record forms in `DECISIONS.md` §8: the readiness rule (and every brief carries it); an "owner overrode the blueprint here" form; a "structural findings — noted, not acted on" section; the seven-defect correction table as a form, filled with what this build actually hit.
- **N-308** `KNOWN_LIMITATIONS.md` gains a numbered **owner decisions still required** register: the human gates of §0.1 and §1, the 5.0 §12 decisions still open, the 4.0 §12 items 1, 5, 6 and 10, the three 3.0 §14 items the register found recorded nowhere (enumerated from `blueprint_TGTL_3.0.md` §14 verbatim during batch 6), the stop-and-ask rows, the parked areas, and this document's §12.
- **N-344** Two geographic rules on `/methodology` (continents are containers; era boundaries are local); a gate when a second region or era arrives, not now.
- **N-392** The nine ways "best" can differ, on `/methodology` and beside the `NoWinner` panel.
- **N-410** The owner's wording of the no-worth-score wall, verbatim in `DECISIONS.md` §8; `/character` gains the paragraph the wording permits (conditional self-worth may be examined).
- **N-435** The register's owner labels recorded back into the brief's decision log — as a note in `records/consolidation/OWNER-LABELS.md`, since the brief itself is read-only.
- **N-436** The `INVENTION:` shape (§2.3.6).
- **N-437** `WHATS_COMING` ordered by the brief's eight research priorities, adolescence first, with a reason each; the parked areas and the 6.1 pass named in it.
- **N-438** The multiplayer coverage audit as a `KNOWN_LIMITATIONS.md` entry.

### 3.12 Group L — Presentation and voice

- **N-320** `NextStep` gains `relation` from a closed list — `requires · unlocks · costs · protects · explains · precedes · see-also` — and a one-line why; every "Where this connects" card carries both. C-32.
- **N-321** The single-home invariant on `/topics` and every topic route's footer, as a reportable bug. C-33.
- **N-322** `RouteRecord.systems?: TermKey[]`; `PageHeader` renders them as tags through `<Term>` on situation and topic pages; no tag row on set-down routes.
- **N-326** `<Term>` renders a `.term--marked` small-caps treatment on uses after the first, in Game Guide only. C-34.
- **N-327** `branch` and `planTier` restored as edition terms (`branch` = "decision branch" / "branch"); `app/walkthrough/page.tsx:132` routes through `<Term>`.
- **N-329** `RouteRecord.register?: "comic"`, permitted on bureaucracy-shaped content only; excluded from every set-down and loss-adjacent route (`/situations/breakup` included). C-35. No route is flagged comic in this version; the rule and its gate ship so the first bureaucracy guide inherits them.
- **N-358** Five terms in the map and one paragraph on `/walkthrough`: passion, project, quest, questline, purpose; "side" as priority, not value.
- **N-434** "The mentor you never had", with its disavowal, on `/methodology` and in the README.

---

## 4. Evidence honesty — T-1 governs every digit

**The cardinal rule (5.0 §4.1) is unchanged and applies to the whole build.** A number that was not read on a page fetched during this build is an invented number. The archive is a prose donor; a figure in a prototype is a claim to re-source. Concretely for 6.0:

- **Four rows carry re-sourcing flags.** N-025 (the Maslach construct — fetch or render unattributed), N-119 (soften, not source), N-160 (state the absence; no number), N-260 (fetch the official pages before any label changes). Every fetch is recorded in `records/research-pipeline.md` under a "Consolidation" heading, one batch per build batch that touches a figure or an attribution, with URL, retrieval date, ≤ 25-word excerpt and the verifier's verdict.
- **Every other row carries no digit.** S-2 (no numbers in play), T-8 (no rates on timeline surfaces) and gate 4/10 hygiene run unchanged. A row whose donor text contains a figure ships the sentence without it.
- **Labels are claims.** Every new evidence-bearing block carries an `EvidenceRecord` with `status` and `whatWouldChange`; `researched` only where a source record exists; engine behaviour carries `design-hypothesis` (N-299), never a content label.
- **Hotline changes are the highest-stakes edits in this version** and go through the fixture with `sourceUrl` and `lastVerified` re-stamped per record; `HOTLINE_LAST_VERIFIED` moves only when every record has been re-checked, otherwise the per-record date carries the truth.

---

## 5. Safety integration — the walls (release blockers, all)

### 5.1 The consolidation handoff §0.3, verbatim

> - The **preview label** (footer stamp → `/methodology#preview-status`, `noindex`) stays until the owner closes the human gates in `KNOWN_LIMITATIONS.md` §0.1 and §1. Consolidation never removes it and never marks a gate closed.
> - The **five sensitive pages** — `app/situations/depression`, `a-death`, `grief`, `being-hurt`, `app/threshold/supporting-someone` — stay **byte-identical** at source. Anything harvested for them goes into the register as *parked for clinical review*, not into the page.
> - **Crisis-tier content is never playable** and never on the timeline; loss-tier only on the typed beat channel. The exclusion lists and the normative lint (`content/exclusions.ts`, `content/timeline/normative-lint.ts`, S-1's lists) are never rebalanced to fit content: stop and ask.
> - **No number without a fetched source** (5.0 §4.1, T-1). A figure harvested from a prototype is a *claim to re-source*, never a source. Web fetch, quote ≤ 25 words, record the retrieval, or render no digit.
> - **No reader gamification, no worth score, no reader assessment**; recovery beside every cost; honest uncertainty over confident emptiness; Help-now on every route without a menu; no external resource loads; nothing in URLs.
> - **Edition parity** through `<Term>`; set-down routes carry no game vocabulary (gate 2) and no Play or Timeline nav entry.
> - **The invention rule**: any mechanism beyond the blueprint's letter is an `INVENTION:` entry in `DECISIONS.md` with its adversarial check.
> - **A gate is not a gate until it has been shown to fail**: every new assertion gets a plant-and-restore probe in `tests/falsify-walls.sh` or its own proven-red record.

### 5.2 Byte-identity of the five pages, asserted after every batch

The batch review computes sha256 of the five sensitive page sources against `main` and records the five hashes in `DECISIONS.md` §8's batch log. Any difference fails the batch. N-263 and N-265 are the two rows that *render* on those routes; their diffs live in `components/SiteChrome.tsx` and `components/SetDownNotice.tsx` and the review walks each of the five pages in both editions after them.

### 5.3 The set-down rule, extended by this version (N-272, N-235, N-263)

A set-down route may render an evidence label and may not render a game term; it carries no `TryInPlay` entry, no system-tag row, no comic register, no `.term--marked` marker; it does carry double-Escape. `/situations/getting-through-today` joins the set by intensity and inherits every clause.

### 5.4 Presentation walls for any future graphical layer (N-253)

Written now so the first scene inherits them: a safety transition replaces the scene with calm plain help and never animates damage or failure; health renders through capacity, symptoms, support, access and accommodation, never grotesque visuals; discrimination and systemic exclusion are never rendered as character debuffs; parenthood and childlessness are never scored; appearance never determines worth; colour never encodes a verdict (N-233). The exclusion lists are untouched by this text.

### 5.5 A favourable reading never overrides a safety route (N-268)

Every instrument that orders, ranks or reads — the board, guidance, the tier board, any comparison — checks the crisis route before the ordering runs, the way `content/board.ts`'s crisis gate already does. C-8 asserts the order in source.

### 5.6 The referent stays unnamed (N-273)

Authoring law in `content/sim/AUTHORING.md`; C-10 plants a companion's name into a caring-duty record and requires red.

### 5.7 Stop-and-ask, restated

The three parked rows would each add a lint rule; they are not built. N-273 *tightens* a wall by assertion and is not a stop-and-ask; the doctrine text says so. Any batch that finds it needs to change an exclusion list or the normative lint stops and reports.

### 5.8 Human review — the launch gates, unchanged

Every gate in `KNOWN_LIMITATIONS.md` §0.1 and §1 is restated in §0 "6.0" with the words "unchanged by 6.0". The two new situation pages and the set-down route join the clinical/specialist review list (N-026 as loss-adjacent; N-023 as a page a depleted reader lands on). 6.0 adds ideas and closes no review.

---

## 6. Editions, vocabulary and presentation

- New display terms enter `content/terminology.ts` with both renderings and `allowedAtSetDown` flags: `branch`, `planTier` (restored), `passion`, `project`, `quest`, `questline`, `purpose`, the system-tag labels N-322 needs, `tryInPlay`. Gate 2's generated lint covers each automatically.
- The Game Guide forbidden-register list (N-233) lives in `content/terminology.json` and gate 3 lints components against it.
- `<Term>`'s marker (N-326) is a class the Standard edition and every set-down route never emit (C-34).
- New reading surfaces obey the UI standing law and are audited by S-9's browser half at three viewports × two themes: `/orientation`, the three situation routes, `/topics/concepts`, the tier board with its header, the campaign's `StateRail` and preview pane, the saves panel with statuses.

---

## 7. Data model and content budget

### 7.1 Schema deltas (types only; each named here is the complete list)

```
content/routes.ts       RouteRecord + changes: string (N-296, required on new routes; optional on existing)
                                    + systems?: TermKey[] (N-322)
                                    + perishable?: { reviewBy: string } (N-301)
                                    + planned?: string (N-302; the WHATS_COMING id it points at)
                                    + register?: "comic" (N-329)
content/hotlines.ts     Hotline + coverage: Nation[] (N-260; `regions` derived)
lib/storage.ts          SaveStatus (seven values) ; writeVerified(key, value): SaveStatus (N-226)
lib/sim/persist.ts      SeasonRecord + explanation: string, contentVersion: string (N-216)
lib/sim/season.ts       previewAction(state, optionId): Preview  (pure; N-212)
content/sim/schema.ts   ActionContract.ifItGoesBadly required (N-211; compiler-enforced by id)
content/sim/campaign/doors.ts  DoorMeaning + "narrowing" (N-214)
content/sim/lab/situations.ts  LabSituation + unknowns: NonEmpty<string> (N-225)
content/timeline/schema.ts     Branch.routes entries: string | { route: string; grade: RouteGrade } (N-379)
                               Source + timing?: "contemporaneous" | "retrospective" (N-386)
content/character.ts    LifeStat + population: string (N-403); the five-layer grouping (N-399)
content/evidence.ts     BehaviourLabel = "design-hypothesis" (N-299)
content/methodology.ts  KNOWN_BREAKS → DisanalogyEntry { n, id, title, detail, severity, status, candidateFix, inheritedBy } (N-281)
                        RETRACTIONS: RetractionEntry[] (N-290)
content/concepts.ts     NEW: Concept { id, name, cells: { system: RoutePath; gloss: string }[] } (N-111)
content/generated/search-index.json  NEW, build output (N-012)
```

No new storage key. `STORAGE_KEYS` is unchanged; N-072's rejection flags live inside the `board` and `guidance` values, N-226's quarantine is a suffix on an existing key's name and is listed in `ALL_STORAGE_KEYS` by derivation so the erase control still clears everything.

### 7.2 Content budget

- **Reading prose:** four new pages (orientation ~900 words; burnout and breakup ~700 each; getting-through-today under 250, six items); the concept index (ten rows); roughly forty section-level additions across the four topic guides, the board, guidance, the daily plan, the map, history and methodology, most under 120 words. American English; second person where the reader is addressed; no digits.
- **Play content:** one upkeep option; one Lab seed pair; one `decisionStep` change; `unknowns` on four Lab situations; `ifItGoesBadly` on every option that lacks one (the recovery tie already exists; where it is absent the compiler names the option and the batch author writes the route, never a reassurance).
- **Records:** `SAFETY_SOURCES.md`; `DECISIONS.md` §8; `KNOWN_LIMITATIONS.md` §0; `records/research-pipeline.md` consolidation batches; `records/consolidation/OWNER-LABELS.md`; the regenerated boundary proof.
- **Sources:** as many as the four re-sourcing rows need and no more — expect five to eight (the helpline pages, the burnout construct).

### 7.3 Authoring rules

`content/sim/AUTHORING.md` (for anything under `content/sim`) and `content/timeline/AUTHORING.md` (for any timeline record) are binding and gain the lines this version adds (N-273; N-386). Reading-layer prose follows 2.0 §7 and the register row's own wording as the donor: adapt the idea, never paste the prototype's paragraph. A quote from a prototype may appear only as a quote, attributed, and never carries a figure.

---

## 8. Automated gates — the roster, extended one-to-one

**Carried, unchanged and green before batch one and at handback:** the static gates 0–4, 9, 10; S-1..S-8 over the arc; the sandbox suite S-1, 2, 3, 3b, 5, 6, 7, 8, 9-structural, 11, 12 + the invention gate; S-10 balance and S-13 pile-up (re-run after any engine or pool change — batch 3 at minimum); S-9 both halves; T-1..T-16; the browser gates and T-14; `gates:falsify` (nine probes). Stated extensions to existing gates: gate 0 (the entrance link is not a door); gate 1 (four new routes, the search index's anchors); gate 2 (new terms; the set-down clauses of §5.3); gate 3 (the forbidden-register list; restored terms); gate 5 (new routes walked); gate 9 (N-074's export path; N-150's position never in a URL); S-1 (N-193); S-4 (N-194's control in the keyboard walk); S-7 (N-194 replays byte-identical); S-12 (N-222); T-4 (N-379 grades); T-9 (N-386 timing); the doors gate (four states); the migration-honesty gate (N-223, N-226); the erase-control gate (N-227).

**New — the C suite (`npm run gates:consolidation`, in `tests/consolidation-gates.ts`, plus browser assertions in `tests/browser-gates.mjs`).** Each entry: assertion · the plant that proves it red. "Probe" means a plant-and-restore case added to `tests/falsify-walls.sh` in the existing `probe`/`tl_probe` discipline (witness named, sha256 restore); "record" means a proven-red run recorded in `DECISIONS.md` §8 where a shell plant is impractical (a unit harness or a browser assertion).

| # | Row | Assertion | Proven red by |
|---|---|---|---|
| C-1 | N-226 | A write whose readback differs, throws, or is refused never reports `saved`; the UI renders the returned status | record: a unit harness with a throwing `setItem` must return `blocked`; asserted against the *old* `writeString` first (it returns nothing) |
| C-2 | N-190 | No rendered failure-mode line appears without its record's tied recovery route in the same drawer | probe: remove the recovery tie render, keep the failure line → red |
| C-3 | N-191 | Every option whose action carries `switchingCost` renders it on the card | browser record: plant a renamed data attribute → red |
| C-4 | N-260 | No rendered `regions` label is broader than the union of its `coverage`; every abuse-group nation in `coverage` has its own verified line | probe: plant a UK-labelled England-only record → red, named by id |
| C-5 | N-160 | The map's three lens settings render byte-identical stage content, or every difference carries a `data-source` that resolves | probe: plant an unsourced difference → red |
| C-6 | N-263 | Double-Escape triggers the quick exit on every `SETDOWN_ROUTES` entry | browser record: plant a route omission from the handler's list → red |
| C-7 | N-267 | Every fixture region has a `SAFETY_SOURCES.md` entry whose date ≥ the record's `lastVerified` | probe: plant a region absent from the record → red |
| C-8 | N-268 | In every ordering instrument the safety check precedes the ordering call in source order and in the call graph | probe: move the check below the ordering → red |
| C-9 | N-272 | Gate 2's generated list contains no evidence-label word; a set-down fixture rendering `Researched` passes | probe: plant an evidence label into the term map's game column → red |
| C-10 | N-273 | No caring-duty record string names a companion id or a condition id | probe: plant `Diane` → red, record named |
| C-11 | N-192 | At least one shipped draw-vary pair renders the same-outcome reading | probe: reseed the pair to separate → red |
| C-12 | N-194 | `Repeat last season` commits an ordered set through the hand-allocation path and replays byte-identical | record: S-7 extended; plant a shuffled order → red |
| C-13 | N-195 | The methodology copy names `tools/curate-lab-seeds.ts` and its criterion | probe: delete the sentence → red |
| C-14 | N-204 | A season screen at every turn carries its origin's `face` motif | browser record: hide the motif after turn one → red |
| C-15 | N-211 | No selectable option renders without all five contract fields; the compiler refuses an option without `ifItGoesBadly` | probe: strip one option's field in a batch → compiler red by id |
| C-16 | N-212 | `previewAction` is pure: `JSON.stringify(state)` before equals after, and the persisted key is untouched | probe: plant a mutation in preview → red |
| C-17 | N-213 | The upkeep option is present and affordable in every season of every preset in the worst envelope (S-10 telemetry) | probe: raise its cost above the floor → red |
| C-18 | N-214 | The `narrowing` door state never renders in the open-state token | probe: map it to the open token → red |
| C-19 | N-233 | No sim token pair encodes valence as green/red across a resolution; no Game Guide string contains a forbidden-register term | probe: plant `health bar` in a game label → red |
| C-20 | N-216 | After a `contentVersion` bump, a reopened season renders the stored explanation, not a recomputation | record: bump, reopen, assert the old string |
| C-21 | N-218 | The Queue's empty state contains the uncertainty line | probe: delete it → red |
| C-22 | N-225 | Every Lab situation has ≥ 1 unknown, rendered before the branches | probe: empty one → red |
| C-23 | N-228 | Every `SimState` field the engine reads has a mid-run surface (`data-sim-state-field`) | probe: remove one field's surface → red |
| C-24 | N-235 | No `TryInPlay` link on any set-down route | probe: plant one → red (gate 2 ext) |
| C-25 | N-355 | Every parse panel declares recorded · interpreted · unknowable | probe: strip a declaration → red |
| C-26 | N-001 | `/orientation` renders complete with JS off and carries no game term in Standard | probe: plant a game term → red |
| C-27 | N-012 | Every searchable route and every generated milestone route is in the index; every indexed anchor resolves in `out/` | probe: drop a milestone route from the index → red |
| C-28 | N-023 | The set-down route contains no analytical framing word (a closed list) and no instrument link above its first heading | probe: plant an instrument link → red |
| C-29 | N-025 | No situation page names a research construct's author without an `EvidenceRecord` | probe: plant an attribution → red |
| C-30 | N-041 | The conflict section carries no recommendation verb (a closed list) | probe: plant "you should" → red |
| C-31 | N-111 | Every concept cell links a route that owns the mechanism (single-home) | probe: point a cell at a route that does not name the mechanism → red |
| C-32 | N-320 | Every `NextStep` carries a `relation` from the closed list and a why-line | probe: blank one → red |
| C-33 | N-321 | The invariant sentence renders on every topic route | probe: remove it from one → red |
| C-34 | N-326 | `.term--marked` never appears in Standard-edition output or on any set-down route | probe: emit it in Standard → red |
| C-35 | N-329 | No route flagged `comic` is set-down or loss-adjacent | probe: flag `/situations/breakup` → red |
| C-36 | N-072 | Every classifying surface renders a rejection control, and a rejected reading renders unweighted | probe: drop the control from one surface → red |
| C-37 | N-074 | The export path issues no network request (gate 9 browser half) | browser record: plant a fetch → red |
| C-38 | N-077 | Every planned task declares a stop condition | probe: blank one → red |
| C-39 | N-080 | No ranked output renders without objective, constraints and horizon above it | probe: remove the header → red |
| C-40 | N-091 | No `sim-` token or class appears on `/guidance/daily-plan` | probe: plant one → red |
| C-41 | N-093 | Every comparison surface closes with the `NoWinner` panel | probe: remove it from one → red |
| C-42 | N-150 | Position produces no rank, band or comparison; the key never appears in a URL | probe: plant a URL write → red (gate 9) |
| C-43 | N-170 | Every placement belongs to a named objective; changing the objective changes the board | probe: placement with no objective → red |
| C-44 | N-171 | No placement renders without the ruleset header above it | probe: render the board without the header → red |
| C-45 | N-281 | Every route that cites a disanalogy links a numbered entry; every entry lists ≥ 1 inheriting route that exists | probe: dangling entry → red |
| C-46 | N-290 | The retractions section renders with zero entries | probe: hide it when empty → red |
| C-47 | N-291 | Any page changed by a logged correction renders a `RevisionNote` naming it | probe: log a correction for a page without one → red |
| C-48 | N-296 | Every new route carries `changes` | probe: blank it → red |
| C-49 | N-301 | Every `perishable` route renders a stamp and a review date | probe: flag a route and remove the stamp → red |
| C-50 | N-302 | Every `planned` badge names an existing `WHATS_COMING` id and vice versa | probe: orphan badge → red |
| C-51 | N-306 | A pre-existing `tgtl:*` library survives a full suite run byte-identical | record: seed keys, run, compare |

**The falsify script is extended** with every "probe" row above, in the existing witness-and-sha256 discipline; the "record" rows have their proven-red output pasted into `DECISIONS.md` §8 under the batch that built them. A C-gate without a proven red is not a gate.

**The invention gate** and **the boundary check** carry forward. **Byte-identity of the five sensitive pages** (§5.2) is asserted in the batch review, by hash, every batch.

---

## 9. Build phases (batches), with exits

Every batch: one Opus brief carrying the register rows verbatim, the §3 subsection that binds them, the §0.3 walls verbatim, the folder boundary, the files it may touch, the gates it must extend and prove red first, the readiness rule, and "report what you could not do". Fable reviews the diff, re-runs the roster, walks the surface in a browser, records the review in `DECISIONS.md` §8 (what was sent back and why), asserts the five hashes, and only then commits. A batch that fails review goes back with findings; the reviewer does not fix it.

**Roster after every batch:** `npm run build` · `npm run typecheck` · `npm run gates:all` (which gains `gates:consolidation`) · `bash tests/falsify-walls.sh`; `gates:balance` and `gates:pileup` when the engine or pool changed; with `out/` served, `node tests/browser-gates.mjs`, `node tests/s9-ui.mjs`, `node tests/timeline-screenshots.mjs`; then `MSYS_NO_PATHCONV=1 MSYS2_ENV_CONV_EXCL=TGTL_BASE_PATH TGTL_BASE_PATH=/TGTL npm run build` with the link audit for root-relative escapes.

- **Batch 0 — Contract.** The branch's roster green on a clean rebuild before any edit; `tests/consolidation-gates.ts` registered with every C-gate as `N/A` until its subject exists; `DECISIONS.md` §8 opened; `KNOWN_LIMITATIONS.md` §0 "6.0" opened with the parked areas, the 6.1 pass and the human gates restated. Fable does this alone. *Exit:* the roster green; the two records opened.
- **Batch 1 — Fix first** (build handoff §1): §2.3.8's record fix; N-226 (C-1 red-then-green); N-190, N-191 (C-2, C-3); N-260 (fetch first; C-4); N-160 (C-5). *Exit:* the five gates red on their plants then green; the hotline fixture re-stamped; `records/research-pipeline.md` "Consolidation batch 1".
- **Batch 2 — Safety, group J (+ I's text):** N-262, N-263, N-265, N-266, N-267, N-268, N-272, N-273, N-430, N-253, N-256. C-6..C-10. *Exit:* the five pages walked in both editions after the chrome changes, hashes unchanged; `SAFETY_SOURCES.md` in place.
- **Batch 3 — Play, group H:** the remaining twenty-three H rows; C-11..C-25; `gates:balance` and `gates:pileup` re-run. *Exit:* a full campaign played keyboard-only through a repeated season, a preview, a quarantined save and a mid-run state rail; the arc closes in the library.
- **Batch 4 — Reading, groups A + B + D + L:** four new routes; the entrance link; the search index; the topic sections; the vocabulary; C-26..C-35. *Exit:* every new route at 320px in both themes and editions; the search box finds a milestone page and a heading; S-9 clean on the new surfaces.
- **Batch 5 — Board, guidance, position, timeline, history — groups C + E + F + G:** C-36..C-44; the timeline schema additions through `npm run content:timeline`. *Exit:* the board, guidance and logs walked with a rejection, a borderline value, a copy-out and a stop condition; the tier board reorders under a second objective with an empty S tier; position set once and re-resolved on five pages.
- **Batch 6 — Records, group K, and the boundary proof:** C-45..C-51; the disanalogy register; the owner-decisions register; `WHATS_COMING` ordered; the README; the stamp; the boundary proof regenerated. *Exit:* the full roster green; every C-gate proven red; the one-to-one table in the report.

Batches 2–6 run **sequentially** by default. Two may run concurrently only when their file sets are disjoint and each runs in its own git worktree; the merge is Fable's and is reviewed as a batch of its own. The capacity cut, if any is needed, is the owner's to name (§0.1 item 1): nothing in register §8 is cut silently.

---

## 10. Acceptance

The inherited hard gates (5.0 §10 and its parents) + the §8 roster with every C-gate proven red + the brief §6 emotional and ethical requirements. Plus:

- [ ] **The landing test.** For every one of the 130 rows the report names the file and line it landed in, or the gap report that explains why it landed differently, or the `DECISIONS.md` entry that records what was sent back. No row is "done" by assertion.
- [ ] **The foreign-body test.** No new top-level directory, stylesheet, storage key or component family; every new file sits in an existing directory and is imported by an existing module. Reviewer reads the tree diff.
- [ ] **The persona walks** — the three from 5.0 §10 (a thirty-four-year-old without a degree, unpartnered, renting; a parent of a two-year-old not yet talking; a sixty-eight-year-old recently widowed) plus one this version needs: **someone with nothing left tonight**, who must reach `/situations/getting-through-today` from Help-now in one click and be told to stop reading. In a real browser, both editions, both themes, 320px.
- [ ] **The save-honesty test.** A private window and a full-quota window both report a status that is not `saved`, and the UI says so.
- [ ] **The helpline test.** A reader in Belfast, Glasgow, Cardiff and Dublin each sees a line labelled for their nation, and each label's source page has been fetched in this build.
- [ ] **The first-contact test.** A first-timer finds "What is this?" and the Human Package without opening a door.
- [ ] **The smooth test.** Twenty-four seasons with a quiet stretch take fewer than twenty-four full briefings; the reviewer counts.
- [ ] **Sensitive-page trust regresses nowhere:** five hashes equal to `main`'s; the two chrome rows walked on every set-down route.
- [ ] The report enumerates the human gates (unchanged), the parked areas, the 6.1 rows, the one-to-one gate table, the batch-review log, the boundary proof, and the live verification.

**Rejection tests (N-256) — conditions under which this work is *not* done, stated before it starts:**

1. A row is marked landed because its sentence exists somewhere in the tree rather than on the surface the register names.
2. A C-gate reports green without a recorded red.
3. A helpline label changed without a fetched page in `records/research-pipeline.md`.
4. A prototype paragraph appears in the trunk verbatim, or a prototype's figure appears anywhere.
5. A "planned" badge, a disanalogy entry, or a `WHATS_COMING` item exists without its counterpart.
6. The five-field contract renders on some options and not others.
7. The preview pane "works" but C-16 was never planted.
8. A set-down route acquired any of: a play entry, a tag row, a marker class, a comic flag, or lost double-Escape.
9. Existing screenshots are reused as proof of a changed surface.
10. `gates:balance` or `gates:pileup` were not re-run after batch 3.
11. Any 6.1 row, parked area, or stop-and-ask row was built, even partly, even well.

**Pre-registered review rubric (the architect's self-review scores against exactly this):** sensitive-page and set-down trust (weight 3) · honesty of every number and attribution — fetched, recorded, or absent (weight 3; a single invented figure fails the build regardless of score) · **landed in the trunk's architecture, not as a foreign subsystem** (weight 2) · descriptive-never-normative and no-worth-score, in words and in colour (weight 2) · presentation craft — smooth and fun; the season loop, the preview, the state rail (weight 2) · first-contact clarity — the entrance, orientation, search (1) · navigation and integration — typed links, concept index, position, try-in-play (1) · readability of the new pages at 320px (1) · technical smoothness and accessibility (1.5). Method: every gate re-run independently; enforcement code read for C-1, C-4, C-6, C-10, C-15, C-16, C-24, C-34; sources re-fetched; the four persona walks in a real browser; the boundary proof reproduced; the five hashes.

---

## 11. Executor latitude — the contract

**LITERAL:** §0 authority, boundaries and the executor rules · §1 · §2.1 preservation and §2.3's supersessions · §3.1's routes (no other route) and every row's named landing module · §4 · all of §5 · §6's rule that new vocabulary enters the map · §7.1's schema deltas as the complete list · the §8 roster with every C-gate's plant · §9's batch order, review rule and exits · §10 including the rejection tests.

**LATITUDE (craft is wanted):** the prose of every section a row adds, within voice rules and the donor's idea; the layout and typography of the four new pages, the concept table, the ruleset header, the state rail, the preview pane and the saves panel; the closed word lists C-28 and C-30 lint on (published in the gate file with a comment); the exact seven save-status words; the qualitative weight words on the tier inspector; which nine stops the reading path names; the order of the disanalogy register; iconography; microcopy; test implementation (assertions LITERAL, scripting yours); the choice, batch by batch, of which existing sections a topic addition extends.

**FORBIDDEN — the walls (each blocked by a gate, the compiler, the hash check, or the invention gate):** a number from memory, a prototype, or any non-fetched source · a helpline label broader than its verified coverage · a prototype file, component or paragraph ported into the tree · a new storage key, directory, stylesheet or component family · editing any of the five sensitive pages · a game term, play entry, tag row, marker or comic flag on a set-down route · a worth score in words, numbers, totals or colour · a control that assesses the reader or a child · self-insertion · crisis-tier content anywhere playable; loss-tier outside the beat channel · changing an exclusion list or the normative lint · building a parked area, a 6.1 row or a stop-and-ask row · removing or softening the preview label; marking a human gate closed · a C-gate without a proven red · silently resolving a conflict with this document · pushing to `main` outside the Phase D merge; force-pushing.

---

## 12. Owner decisions still open (build with reversible defaults; do not resolve silently)

1. **The parked areas** — the social manual (N-141), the Atlas (N-154), "The Years Between" (N-220), the Living Scene (N-250), the ethics and meaning wing (N-393), the topic set (N-415, N-421, N-422, N-424, N-425), archetype resemblance (N-086). Default: named in `WHATS_COMING` in N-437's order; each is a version.
2. **The three stop-and-ask rows** — N-324, N-376, N-381. Default: parked; each would add a lint rule and needs the owner's word.
3. **The 6.1 evidence pass** — the seventeen deferred rows. Default: the next version; named in `KNOWN_LIMITATIONS.md` §0.
4. **The 4.0 §12 items surfaced by N-308** — public naming (item 1), companion-arc census and tone (5), preset names and hands (6), hosting target (10) — and the three 3.0 §14 items the register found unrecorded. Default: enumerated in the owner-decisions register; nothing changes.
5. **The 5.0 §12 and `KNOWN_LIMITATIONS.md` 0.1.6 items** — the export size, the inert timeline sex lens (the map's lens is N-160; the timeline's is the owner's research batch N-380), the unused band table, the first-person branch questions, the five major-and-unsourced records. Default: untouched.
6. **The register's screenshots** (72 files, 17 MB under `records/consolidation/`). Default: stay committed.
7. **HTTPS enforcement on the Pages site.** Default: as Pages created it; one API call when the owner says.
8. **A literal ninety-row cut**, if the owner wants one. Default: the 130 rows; any cut is the owner's to name.
9. **The independent review of the 4.0 play layer**, still pending, and the recommendation this build will repeat: an independent review of the 6.0 build.
10. **The version stamp** — "TGTL 6.0 preview — The Consolidation". Default: yes; 130 rows is a version's worth.

---

*End of blueprint. `DECISIONS.md` §8 "Consolidation" in the repository continues this document — the batch log, every review sent back, every `INVENTION:` in the N-436 shape, every finding against this blueprint — so 6.1 can audit 6.0 the way 6.0 audits its parents.*
