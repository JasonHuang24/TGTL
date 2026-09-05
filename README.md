# The Guidebook to Life — 5.0 (The Timeline)

A guidebook you can read and a life you can play, on one engine — and now a
**timeline**: every year from birth to one hundred, with the milestones and
expectations common at that age, each figure traced to a page fetched and quoted
while this build was made.

The character is played. **The reader never is.** The timeline never takes your age,
or a child's age, and tells you anything about yourself.

This build evolves the shipped 4.0 build (`../tgtl-claude-4.0/`, kept read-only)
per `blueprint_TGTL_5.0.md`. The 4.0 playable layer is untouched and isolated: no
timeline content reaches a play surface, and the full 4.0 gate roster is green.

## Preview status

**This is a labelled preview, not a launch.** It is published so it can be read and
criticised. The blueprints make certain human reviews release blockers, and not all
of them have happened; until they have, the foot of every page says *preview*, the
pages carry `noindex`, and `/methodology#preview-status` lists what is open. As of
2026-09-04 that is: pediatric review of the timeline's child-development and puberty
records; clinical review of its fertility, later-health and dying records and the
life-expectancy note; clinical and specialist review of the five sensitive pages and
the scripted loss beats; the owner's read of the cultural-expectation records and the
not-yet-sourced list; the stage-rail art checkpoint; and an independent acceptance
review of the 4.0 play layer. The full list, with what each gate is and why, is
`KNOWN_LIMITATIONS.md` §0.1 and §1. **Closed on 2026-09-04:** hotline verification
(`content/hotlines.ts`, every number checked against its official source).

Hosted as a GitHub Pages project site under the owner's domain:
**https://jasonhchronicles.com/TGTL/** (repository `TGTL`; deployed by
`.github/workflows/pages.yml`). The audit that cleared it is *The Preview Audit*;
the publish pass is `DECISIONS.md` §7.

## Environment

The machine's system Node is 16 (too old). **Any Node >= 18.18 reproduces this
build** — that is the durable statement; put it on `PATH` and everything below works.

This build was made with **Node v22.20.0**, provisioned into the session scratchpad at:

```
C:\Users\sourd\AppData\Local\Temp\claude\F--Programming-The-Guidebook-to-Life\0b89b0b3-2ff9-4858-b316-c3490a384f95\scratchpad\node-v22.20.0-win-x64
```

That path is session-scoped and will not survive. The portable Node v22.23.2 named in
the 4.0 README still exists but its bundled npm is incomplete (`npm install` dies with
`Cannot find module 'node-gyp/bin/node-gyp.js'`), which is why a clean one was fetched.
Recorded in `DECISIONS.md`.

## Run it

```bash
npm install && npm run dev
```

Then open the printed local URL. That is the single documented command to launch
the site.

### Build the static site

Fully static export — no backend, no database, no page-initiated external request:

```bash
npm run build
```

The site is written to `out/`. Serve it anywhere static, or locally:

```bash
npm run serve:out
```

The export is root-mounted by default, which is what the whole gate roster was
written against. The published site lives under a path, so the Pages workflow builds
with `TGTL_BASE_PATH=/TGTL`; `next.config.ts` turns that into Next's `basePath` and
`assetPrefix`, and the one place that cannot use `next/link` (the redirect stubs'
meta refresh) reads the same value. To reproduce that build locally:

```bash
TGTL_BASE_PATH=/TGTL npm run build
```

(In Git Bash on Windows, MSYS rewrites `/TGTL` into a Windows path; prefix the
command with `MSYS_NO_PATHCONV=1 MSYS2_ENV_CONV_EXCL=TGTL_BASE_PATH`.) The gate
scripts assume the root mount; run them against a root build.

## What's here

### The Playthrough — three modes, one engine

- **`/play`** — the play door. One screen, three ways in.
- **`/play/arc`** — *A Whole Life.* The whole shape of a life, fast: Birth-RNG
  creation, eight acts, an end-of-life look back. The recommended first play, and
  the 3.0 experience with its five sanctioned 4.0 deltas.
- **`/play/campaign`** — ***Launch Window — United States · 2025.*** Ages eighteen
  to thirty in twenty-four six-month seasons. Each season: read where things
  stand, say what you are aiming at, spend a limited budget of time, energy and
  money across an open menu, then watch your choices resolve alongside whatever
  arrived on its own. Consequences land seasons later and you can see them coming.
  Saveable, forkable, resumable.
- **`/play/lab`** — *The Decision Lab.* One decision, played both ways, on three
  axes: **the decision**, **the luck**, and **the starting position** — the agency
  lesson, G-09 and G-08 respectively. Unlimited rewind; nothing is scored.

### The Timeline — every year, birth to one hundred

- **`/timeline`** — a **stage rail** of eight bubbles, each with an authored in-repo
  SVG figure, its stage name and its age band, clickable to move the cursor; and under
  it the whole spine as a drawn, scrubbable instrument: stage bands, legal thresholds
  as crisp ticks, windows as spans with a denser typical zone and softer tails, eight
  lanes, a keyboard cursor, and a lens. Below the tablet breakpoint the instrument
  stops sticking and a compact strip takes over — the age select, the density chips and
  the view chips — so nothing sticky is ever taller than the screen. Underneath it, **every
  year from zero to one hundred is rendered server-side as real HTML** with milestone
  detail in native `<details>` drawers — so with JavaScript off the page is complete,
  not explanatory.
- **`/timeline/<milestone-id>`** — a page for each major milestone: the timing
  analysis at full depth (earlier, in the window, later, interrupted, by another
  route, not at all), with a route beside every named cost.

What makes it different from every other "life milestones" page:

- **Nothing is invented.** A number that was not read on a page fetched during this
  build does not appear. Every figure carries a verbatim excerpt of at most
  twenty-five words containing it, its population, what the source measured, and the
  date we fetched it. Where we could not source something, the record says **"not yet
  sourced"** and shows no digit at all.
- **Five kinds of expectation, kept apart.** A rule with an age in it, a window in a
  body, a schedule an institution keeps, a pattern in a population, and something
  people say — each labelled, each with its own standing line. The two kinds that
  would make it prescriptive (strategic recommendations, personal targets) are
  excluded *by the type system* and cannot be written here.
- **The reader is never assessed.** No control takes anyone's age to produce anything.
  The age selector moves the view and nothing else.
- **No rates on the surface.** Percentages live in evidence drawers beside the
  sentence they came from; the surface carries ages, windows, and a word from a
  published band table.
- **The quiet parts are quiet.** Child development, puberty, fertility, health in
  later life and dying render in plain language in both editions, with a care note and
  the real page. No death marker on the spine, no per-year mortality figure. Crisis
  material appears nowhere on the timeline.
- **Recovery beside every cost**, and "never" rendered as a path rather than a failure.

### The reading layer

30 reader routes + 2 sanctioned redirect stubs, each at full depth. The entrance,
the walkthrough, the map, the topics, the situation pages, the threshold, the
guidance flow, the methodology page. The complete list is `content/routes.ts`.

### The doctrine, in the parts you can check

- **The floor set is unconditional.** Rest and maintain, wait, and ask for help are
  free and available in every season of every campaign, and every season offers at
  least three affordable things across at least two kinds. Asserted across 12,600
  simulated seasons including deliberately drained ones — not promised.
- **Crisis content is never playable.** Loss lives only on its own typed beat
  channel: never an event, never a queue entry, never previewed, placed
  deterministically, always skippable, always naming its real page.
- **People can refuse and leave.** The player influences communication,
  reliability, repair, boundaries and exposure — never attraction, consent,
  forgiveness, loyalty or commitment.
- **No numbers in play.** No probability, percentage or statistic anywhere the
  player can see. Qualitative bands, and six honest evidence labels.
- **No difficulty grade.** A start is described per axis — what it makes expensive
  — with no composite, no total and no ordering, and the verbatim worth-guard
  beside it.
- **The whole machine is published** on `/methodology`: the budget table, the
  order things resolve in, how pressure is capped, how attribution is computed,
  how the balance was probed, and the one internal number the game never shows you.
- **Everything is local-only.** No account, no analytics, no server, nothing in a
  URL, and a visible erase control.

## Project shape

```
app/                        routes + four stylesheets
  globals.css               the reading surface
  sim.css                   the sim namespace: standing law + the Life Arc
  sim-instruments.css       the six canonical instruments
  sim-surfaces.css          the door, the scene, the season loop, the Lab, the parse
  play/                     the play door, /arc, /campaign, /lab
components/
  sim/                      the 4.0 play surfaces + instruments + scene
  play/                     the Life Arc's surfaces
  reference/                the shared reference-layer visualisations
content/
  sim/                      the simulation contract v2, the profile, the priorities
    campaign/               the pool: actions, events, companions, presets, beats
    lab/                    the Lab's standalone situations
    AUTHORING.md            the binding content rules every batch was written to
  play/                     the Life Arc's content
  timeline/                 the timeline content model, lints and authored batches
    schema.ts               types, with the containment that makes invention hard
    normative-lint.ts       the §5.1 wall - SAFETY-RELEVANT, never edited to fit content
    dom.ts                  the one DOM contract the renderers and the gates share
    stages.ts               nine stage intros; the bands are navigation conventions
    AUTHORING.md            the binding rules every batch was written to
    batches/                the authored JSON, one file per research batch
    generated/              compiled output - do not edit by hand
lib/sim/                    the v2 engine — season, economy, effects, resolve,
                            attribution, queue, parse, lab, forks, persistence
tests/                      the gate suite
tools/                      the content compiler, the Lab seed curator, the
                            acceptance-evidence generator
records/                    the build record: gate proofs, pipeline, invention checks
screenshots/                every play surface, both themes, both viewports
DECISIONS.md                every underdetermined call, dated, with the inventions
KNOWN_LIMITATIONS.md        the honest deferred list and the owner's launch gates
```

## Tests / acceptance gates

```bash
npm run gates          # the static gates (doors, links, set-down lint, terminology, encoding, local-only, source hygiene)
npm run gates:sim      # S-1..S-8 over the Life Arc
npm run gates:sim4     # the sandbox suite: S-1,2,3,3b,5,6,7,8,9-structural,11,12 + the invention gate
npm run gates:all      # all three of the above

npm run gates:balance  # S-10 — the balance fleets (525 runs, 12,600 seasons)
npm run gates:pileup   # S-13 — the adversarial worst-case fleets (864 seasons)

npm run gates:timeline # the T suite (blueprint 5.0 §8):
                       #  T-1  source traceability — a number without a fetched source
                       #  T-2  kind discipline; the two excluded kinds are inexpressible
                       #  T-3  normative-language lint (content + rendered)
                       #  T-4  recovery adjacency; never-is-not-failure
                       #  T-5  no reader computation
                       #  T-6  sensitive quiet: care note, real page, no game chrome
                       #  T-7  year coverage, checked against an independent implementation
                       #  T-8  no rates on any surface
                       #  T-9  sex-lens honesty
                       #  T-10 reference integrity
                       #  T-11 source freshness and stamps
                       #  T-12 layer isolation — the play layer is untouched
                       #  T-13 the research-pipeline record
                       #  T-15 UI integrity, structural half, the tl- namespace
                       #  T-16 the export is current (a stale out/ cannot certify a build)
                       # T-14 (the browser walk) runs inside tests/browser-gates.mjs

npm run gates:falsify  # proves the doctrine-wall lints can actually FAIL — now nine
                       # probes: the three inherited, plus T-1, T-3, T-4, T-6, T-7, T-8
```

The browser gates and S-9's browser half need the built site served:

```bash
npm run build
npm run serve:out                      # in one terminal
node tests/browser-gates.mjs           # in another — console, state, 320px, keyboard, S-4,
                                       #   screenshots, and T-14 (the timeline walk)
node tests/timeline-screenshots.mjs    # the timeline art checkpoint: nine scenes x
                                       #   two themes x desktop and 320px
node tests/s9-ui.mjs                   # S-9: clip / contrast / tap-target, 17 surfaces x 2 themes x 3 viewports
```

`records/s9-failing-then-green.txt` holds S-9 run against the shipped 3.0 build
(207 violations, including the owner's two defects) and against this one (clean).

### A gate is not a check until it has been shown to fail

This build shipped four assertions that reported green while being structurally
incapable of failing — one of them a regex containing a literal `0x08` byte, which
reads as `\b` on the page and matches nothing at all. Observing that a gate is
green proves nothing about whether it works. Two guards came out of that:

- **`Gate 10 — Source hygiene`** (in `npm run gates`) fails on any backspace, form
  feed, bell, vertical tab, NUL or escape in any source file. It was itself
  verified by planting one and watching the gate go red.
- **`npm run gates:falsify`** plants a real violation in real content for each of
  the three doctrine-wall lints — loss tier, no-numbers, no-score — requires the
  named gate to fail *and to name the record the plant went into*, then restores
  the file and verifies byte-identity by sha256. It found that the no-score lint
  was fixed-phrase and missed "your **life** score" by one intervening word.

## Regenerating the content and the evidence

The campaign pool is compiled from authored JSON batches, so a malformed record
fails the build with its id named rather than being silently dropped:

```bash
node tools/build-content.mjs <batch-dir>   # compile authored JSON batches into the pool
npm run content:timeline                   # compile content/timeline/batches/*.json
npm run known-limits:timeline              # regenerate the research-required list
node tools/variant-hygiene.mjs <files>     # strip base-line copies out of variant pools
node tools/localize-us.mjs [--apply]       # the US-English pass over campaign + Lab prose
node tools/gen-doors.mjs <dir>             # rebuild the door registry from authored chunks
npx tsx tools/acceptance-evidence.ts       # regenerates records/acceptance-evidence.md
npx tsx tools/make-parse-fixture.ts        # a finished run, so the closing screen can be captured
npx tsx tools/curate-lab-seeds.ts          # reports Lab seeds under which each axis separates
npx tsx tools/variant-gap.ts               # how many variant lines each band still needs
npx tsx tools/neutrality-brief.ts          # every variant pool beside the options it renders after
```

## Stack note

**Next.js 15 (app router) + React 19 + TypeScript, static export**, with
hand-authored CSS and system font stacks. This substitutes for the pre-provisioned
`vinext`/Cloudflare-Workers scaffold, which could not run in the build environment
and targeted a Workers backend at odds with the pure-static requirement. The
substitution is recorded in `DECISIONS.md`.

## Before public launch

Owner gates remain, and the site ships as a labelled preview behind them (see
*Preview status* above). They are listed in full, with what each one is and why, in
**`KNOWN_LIMITATIONS.md` §0.1** (the 5.0 gates: pediatric and clinical review of the
sensitive timeline records, the owner's editorial reads, the stage-rail art
checkpoint) and **§1** (carried: the professional reviews of the five sensitive
pages, **the two scripted beats added in 4.0**, the parse bridge's selection rule
and templates, the art-direction sign-off). Hotline verification, carried since 2.0,
was closed on 2026-09-04.
