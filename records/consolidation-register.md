# The Consolidation Register — TGTL 6.0, Phase A

**Written 2026-09-04 by Claude Fable 5.1, architect and reviewer for TGTL 6.0 "The Consolidation".**
Branch `consolidation/6.0`. This is the Phase A deliverable named in
`TGTL_6.0_CONSOLIDATION_HANDOFF_PROMPT.md` §2. Nothing in it has been built. Nothing in it
closes a human gate, touches a sensitive page, or removes the preview label. The owner's
triage column is blank on every row until the owner fills it.

## 0. What this is, in one paragraph

Eleven Opus sweep agents, one per input, read the nine archived prototypes, the four
specification documents written for Sol's lane, and the master project brief, each against
the same brief (the §0.3 walls verbatim, the register schema, the trunk's route inventory)
and returned 607 candidate rows with a quote or a screenshot for each. Fable 5.1 read every
row, spot-checked quotes against the sources (§4 below), folded duplicates across sweeps, and
wrote the architect's call on each of the **357 register rows** that resulted. Every one of
the 607 sweep rows is either a register row's primary or is folded into one; none was
dropped silently. The trunk is the published site at https://jasonhchronicles.com/TGTL/
(repository folder `The Guidebook To Life Website/`); a nugget is an idea the trunk does not
already have.

## 1. Inputs swept, and where each stands

| input | swept by | rows returned | what shaped the harvest |
|---|---|---|---|
| `gol-opus4-6` (38 pages) | Opus, slug `opus4-6` | 42 | The 2.0 harvest took more than expected (health, energy, job-loss pathway); what remains is the meta wing, the concept index, the per-page model-break callout, and the situations 2.0 never built (burnout, breakup, career change). 9 screenshots. |
| `gol-opus5` (113 files on disk; records say 120) | Opus, slug `opus5` | 65 | 2.0 took the safety half of this donor and none of the epistemic half: claim ledger, grades, retractions, open questions, editorial standards, cultural scope, field-report rules; nor the ethics and reflection wings, the views layer, the cascade map. 12 screenshots. |
| `gol-fable5` (67 pages) | Opus, slug `fable5` | 51 | A pure reference work: the Atlas, the Disanalogy Register with frame-strength tags, typed links, the lexicon, four unbuilt situation routes, perishable-content stamps. 12 screenshots. |
| `gol-claudefamily` (126 pages) | Opus, slug `claudefamily` | 44 | The descriptive spine the trunk lacks: a 24-mechanism manual, 14 arenas on one anatomy, conditions as a registry, standing situation layouts, the legibility block. 8 screenshots. |
| `gol-chatgptsol5-6` (Sol 1.0; served under Node 22) | Opus, slug `sol1` | 51 | Four times the trunk's per-record disclosure on guidance, evidence and history; the switchable tier objective; archetype resemblance with four separated fields; four content areas with no trunk version (social tutorial, nutrition, role atlas, futures). 12 screenshots. |
| `tgtl-chatgptsol5-6-2.0` (Sol 2.0; served from `dist/`) | Opus, slug `sol2` | 62 | The engine ideas are already the trunk's 4.0; what Sol has is the authored story campaign, the recurring cast, the response contract and pure preview, honest save status, the living record, the England-only hotline correction. 11 screenshots. |
| `tgtl-claude-2.0` | Opus, slug `claude2` | 22 | The trunk is a strict superset except four places: the orientation page, the seven-row board, two doors and a kicker, two `<Term>` keys. Plus the deferrals recorded for budget. 3 screenshots. |
| `tgtl-claude-3.0` | Opus, slug `claude3` | 19 | Descent is near-lossless (byte-identical engine and content files); the harvest is the arc's thin spots, the polish-patch items assessed against the trunk, and three owner decisions that fell off the open list. 5 screenshots. |
| `tgtl-claude-4.0` | Opus, slug `claude4` | 25 | Byte-identical to the trunk's play layer; the harvest is exactly the deferred set, plus two findings by inspection: 72 failure-mode and 42 switching-cost sentences authored and never rendered. |
| The four Sol-lane specs + handoffs | Opus, slug `specs` | 58 | One arc, not four proposals; the trunk sits at its first stage (engine built, no scene, no chronicle, no story). Two trunk defects found from the spec side: silent save failure and invisible mid-run state. |
| `MASTER_PROJECT_BRIEF.md` (14,796 lines) | Opus, slug `brief` | 168 | Roughly a third has no trunk counterpart: the lesson system, the social manual, the modifier taxonomy, the parse's achievement families, per-era history, the cross-cutting systems. Its §14A and every "Inferred" section still carry the owner's *provisional* stamp with no acceptance label applied. |

The archive was not moved to `<ARCHIVE>`; the nine folders still sit in the workspace root
and were treated as the read-only archive. Nothing in any of them was edited (the Sol lanes
were served from their committed builds; no install was needed).

## 2. The walls, restated (handoff §0.3) — every row below respects them

The preview label stays and no human gate is marked closed · the five sensitive pages
(`depression`, `a-death`, `grief`, `being-hurt`, `threshold/supporting-someone`) stay
byte-identical, and everything harvested for them is **parked for clinical review** (rows
N-397, N-024, N-028, N-039, N-042, N-201, N-275) · crisis-tier content is never playable and
never on the timeline; loss-tier only on the typed beat channel · the exclusion lists and the
normative lint are never rebalanced — three rows that would *add* a lint rule are marked
stop-and-ask and parked (N-324, N-376, N-381) · no number without a fetched source: every
prototype figure is a claim to re-source, and 23 Adopt/Adapt rows are so flagged · no reader
gamification, worth score or reader assessment (the rows that collided are Rejected: N-158,
N-087, N-241, N-242, N-349, N-356, N-357, N-431) · edition parity through `<Term>` · every
mechanism beyond the blueprint's letter becomes an `INVENTION:` entry · a gate is not a gate
until it has been shown to fail.

## 3. How to read a row, and how to triage

Each row carries the handoff's ten fields. **Architect's call** is one of Adopt (build as
described), Adapt (build, with the stated change), Park (right but not now, or behind a
gate), Reject (collides with a wall or the trunk's settled decisions). **Owner triage** is
yours: Accepted / Modified / Parked / Rejected, in the artifact's triage column, in this
file, or in chat. Two ways to make 357 rows tractable:

- **Triage by exception.** Say "the architect's calls stand except…" and name the rows you
  overrule; that is a complete triage, and I will record it row by row.
- **Triage by area first.** Groups A to L are the trunk areas a row lands in. Several groups
  contain an *area decision* — a whole content area the trunk does not have (the ethics and
  meaning wing N-393, the social manual N-141, the Atlas N-154, the story campaign N-220, the
  Living Scene N-250, the topic set N-415/N-421/N-422/N-424/N-425). Decide those first; the
  rows inside them follow.

Tally of the architect's calls: **194 Adopt · 95 Adapt · 53 Park · 15 Reject.** By cost among
Adopt and Adapt: 128 small, 139 medium, 23 large. That is not a version of work; it is a
roadmap. My recommendation for the 6.0 scope is in §6; everything accepted but not built in
6.0 becomes the ordered backlog in `WHATS_COMING` (row N-437).

## 4. Spot-check record (Fable 5.1, against the sources)

Quotes were checked verbatim with `grep -F` against the archive files, tolerating inline
markup and line breaks: `claude4` 3 of 3 (plus the two rendering findings confirmed by
grep in the trunk: 72 `failureModes` and 42 `switchingCost` lines, no component reads either)
· `opus4-6` 5 of 5 · `opus5` 7 of 7 · `fable5` 4 of 4 · `claudefamily` 4 of 4 · `sol1` 4 of 4
· `brief` 4 of 4. Trunk claims checked: the credential position persists under one storage
key read by one component (N-150); the search index is built from the route inventory only
(N-012); `writeString` swallows storage exceptions so a save cannot report failure (N-226);
the domestic-abuse helpline record is labelled "United Kingdom" (N-260); `beat-someone-ill`
routes to `/topics/relationships` while `KNOWN_LIMITATIONS.md` §1.4 says `/situations/a-death`
(records fix, §5); the sex lens marks 1 of 122 records (N-380); the Birth RNG already draws
conditionally (so BRIEF-014 is a duplicate, N-350 Reject). **One sweep claim was false:** the
brief sweep reported the social-calibration practice loop duplicated at L2489–2508; it
appears once. The note was removed. **One discrepancy is unresolved:** `gol-opus5`'s records
say 120 pages and the disk holds 113 `.html` files.

## 5. Findings about the trunk made during the harvest (not nuggets — fixes)

1. `KNOWN_LIMITATIONS.md` §1.4 says the loss-tier beat `beat-someone-ill` names
   `/situations/a-death`; `content/sim/campaign/beats.ts:58` names `/topics/relationships`.
   The code is the honest one; the record is wrong about where a loss-tier beat routes.
2. Seventy-two authored `failureModes` lines and forty-two `switchingCost` lines pass the
   string lints and reach no reader (N-190, N-191).
3. `lib/storage.ts` drops storage exceptions silently, so `saveRun` always reports success;
   a private-window player loses a campaign and is told it was kept (N-226).
4. `content/hotlines.ts` labels 0808 2000 247 "United Kingdom"; Sol's record says it serves
   England. A claim to re-source, and the highest-stakes row in the register (N-260).
5. The timeline's sex lens renders a control that can change one record (N-380; also the
   owner's open decision in `KNOWN_LIMITATIONS.md` §0.1.6).
6. Three owner decisions from the 3.0 blueprint's open list are recorded nowhere in the
   trunk's records (N-308).

## 6. The fifteen I would build first, and why — in the owner's standard

1. **N-190 + N-191 — render the failure modes and switching costs.** Realism, already written
   and verified; the campaign's decisions gain the two dimensions people most under-model.
   Small.
2. **N-226 — honest save status.** A trust defect in the trunk today; readback-verified writes
   and a status that can say "not saved". Small.
3. **N-260 — the England-only helpline correction, with the jurisdiction gate.** Safety;
   re-source, split the nations and Ireland, make label-narrower-than-coverage an assertion.
   Small content, highest stakes.
4. **N-001 + N-005 — the Human Package as a reading page, and a "What is this?" link.** The
   reader who will never play is the reader in most need; user-friendly first contact. Medium.
5. **N-150 — set your position once.** The site's best mechanic, already persisted, read by
   one page; promote the key and let every position note re-resolve. Medium.
6. **N-280 + N-281 — the per-page model-break callout and the upgraded register.** Honesty
   at the point of overreach instead of one click away; a gate keeps the two from drifting.
   Medium.
7. **N-023 — "getting through today".** Six unglamorous items and permission to stop reading;
   register zero, beside triage. Small.
8. **N-025 + N-026 — burnout and breakup as situation pages.** The two commonest hard adult
   events, both absent, both fitting the existing shape, neither crisis-tier. Medium.
9. **N-194 — the compressed season flow as a real control.** Smooth: twenty-four full
   briefings is the biggest threat to fun, and the quiet flag is already computed. Medium.
10. **N-216 — the living record.** Every resolved decision reopens its original explanation;
    the trunk's own comment names the review as unbuilt. Fun and realism together. Medium.
11. **N-211 + N-212 — "if it goes badly" on every option, and a pure preview.** Read a decision
    before making it, provably touching nothing. Medium.
12. **N-170 + N-171 + N-172 — the tier board's switchable objective, ruleset header and empty
    top tier.** The trunk's own TIER_LIMITS apologises for the first; the third is the most
    persuasive refusal on the site. Medium to large.
13. **N-111 + N-320 — the concept index and typed, explained cross-links.** Navigation the
    reader can read before clicking; four good pages become one system. Medium.
14. **N-228 — show the state the engine already keeps during a campaign.** Skills, conditions,
    capacity: computed, never shown. Highest ratio of "feels like a game" to work. Medium.
15. **N-012 — search that reaches headings and the milestone pages.** The largest sourced
    area is invisible to its own search box; a build step. Medium.

Recommended 6.0 scope, if the owner agrees: the fifteen above plus the small-cost Adopt rows
(112 of them, most a sentence or a field) and the records rows in group K; roughly ninety
rows, a version's worth. The area decisions (N-141, N-154, N-220, N-250, N-393, the topic
set) are each a version of their own and should be decided as areas, not harvested piecemeal.

## 7. Owner decisions this register surfaces (beyond the row triage)

- **The archive path.** The prototypes were not moved; say whether they stay in the workspace
  root or move, and where.
- **The merge rule** for Phase D was left as a placeholder in the paste: merge when green, or
  show the PR first.
- **Version stamp.** If the accepted set is roughly the recommended ninety rows, the footer
  becomes "TGTL 6.0 preview"; a handful of rows makes it 5.1 (handoff §3).
- **Three stop-and-ask rows** that would add (never relax) a lint: frame-strength tags
  (N-324), the peer-advantage population rule (N-376), the screening-threshold record kind
  (N-381).
- **The area decisions** named in §3, and the topic set (which new topics, if any: civic,
  housing, place, identity, sexuality, meaning).
- **The sex-lens research batch** (N-380), which is also `KNOWN_LIMITATIONS.md` §0.1.6.
- **The screenshots** under `records/consolidation/` (72 files, 17 MB) are committed as the
  register's visual evidence; say if you would rather they were gitignored like
  `screenshots/`.

---

# The register

### A. Entrance, orientation & navigation

#### N-001 · Restore The Human Package as a reading-layer page: the seven facts every life begins inside, readable without starting a run.
| field | |
|---|---|
| kind | content |
| source | tgtl-claude-2.0/app/orientation/page.tsx (blueprint §6.2, §3.1) · also: `gol-chatgptsol5-6/content/fixtures.json` (`humanPackage`) + blueprint §SCR-002 · also: tgtl-chatgptsol5-6-2.0/app/components/MapPages.tsx (lines 11–23); route `/human-package` · also: tgtl-chatgptsol5-6-2.0/app/components/MapPages.tsx (point 03) · also: tgtl-claude-2.0/app/orientation/page.tsx §"You can change — and not without limit" |
| evidence | screenshot: records/consolidation/claude2/20-orientation-human-package.png |
| lands in | a real page behind the `/orientation` stub, or a new reading section reachable from `/` and `/walkthrough` |
| doctrine check | pass |
| cost | M — gates: extends gate 1 (link integrity / orphan routes: the stub becomes a real route); new gate: "the Human Package renders with JS disabled and carries no game vocabulary in Standard" |
| why worth having | the trunk's version of this material lives only inside `content/play/framing.ts` as eight briefing bullets shown at run start. A reader who does not want to play a life — and the reader arriving at the worst moment is exactly that reader — never sees it. Seven headed sections of warm second-person prose is the reading edition of the same argument. |
| trunk dedupe | thinner in trunk (`content/play/framing.ts` `BRIEFING_POINTS` carries world / run / agency / needs / others / difficulty / win / end as one-sentence pairs, inside `/play/arc`; `/walkthrough` carries one clause of it. No prose page, no route.) |
| **architect's call** | **Adopt** — The reader who will never play is the reader in most need of the Human Package; restore /orientation as a real reading page, absorbing the Sol synopsis and the "adaptability has an edge" point. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE2-001, SOL1-002, SOL2-001, SOL2-002, CLAUDE2-004 |

#### N-002 · The anti-app declaration, stated first: no account, no record of the visit, nothing scored.
| field | |
|---|---|
| kind | voice |
| source | tgtl-claude-2.0/app/orientation/page.tsx |
| evidence | "This is a guidebook, not an app. It has no account for you, keeps no record of your visit, and scores nothing you do." |
| lands in | the Human Package page opening; or `components/EntranceHome.tsx` above the doors |
| doctrine check | pass |
| cost | S — gates: none new (it restates a promise the S-5 no-score lint already enforces) |
| why worth having | the trunk says this in the entrance footnote ("No account, no analytics, no score") and the chrome footer, both in small grey type below the fold. Said in the first paragraph, in the reader's second person, it is the sentence that earns trust before anything else is read. |
| trunk dedupe | thinner in trunk (`components/EntranceHome.tsx` `.doors-privacy`, `components/SiteChrome.tsx` footer — present as chrome microcopy, never as a stated stance) |
| **architect's call** | **Adopt** — Say "a guidebook, not an app" in the first paragraph of the orientation page and above the doors; it is a stance, not chrome microcopy. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE2-002 |

#### N-003 · The first move: make sure the question is yours.
| field | |
|---|---|
| kind | voice |
| source | tgtl-claude-2.0/app/orientation/page.tsx §"The run is finite, and no one packed a win condition" · also: `gol-opus4-6/wings/meta/playstyles.html` · also: `gol-opus4-6/wings/meta/playstyles.html` (trade-off callout) |
| evidence | "The most common source of misery is not losing; it is playing someone else's game without realising it." |
| lands in | the Human Package page; `content/play/framing.ts` `WEIGHTS_INTRO`; `/guidance` objectives step |
| doctrine check | pass |
| cost | S — gates: none |
| why worth having | the trunk's creation copy says the reader sets the objective ("No victory condition ships with the run, so you set the objective"). It never says *why it matters* — that the common failure is not losing but running someone else's objective. One clause turns a UI instruction into the point of the instrument. |
| trunk dedupe | thinner in trunk (`content/play/framing.ts` `WEIGHTS_INTRO` / `BRIEFING_POINTS.win` state the mechanic; the stake is absent) |
| **architect's call** | **Adopt** — One clause on the entrance and in the creation copy: the common failure is playing someone else's game, not losing. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE2-005, OPUS46-025, OPUS46-026 |

#### N-004 · The one-sentence proof that advice is position-dependent, given as an example rather than a principle.
| field | |
|---|---|
| kind | voice |
| source | tgtl-claude-2.0/app/orientation/page.tsx (blueprint §6.2) |
| evidence | "“just take the risk” is sound advice for someone with a floor beneath failure and dangerous advice for someone without one." |
| lands in | the Human Package page; also usable at the head of `/map/credential-decision` or `/walkthrough#advanced` ("Position math") |
| doctrine check | pass |
| cost | S — gates: none |
| why worth having | the trunk teaches position sensitivity through a mechanic (the credential fork's chips re-resolving) and through the phrase "floor beneath failure" in four places. This sentence is the version a reader gets in three seconds, and it is the one they will repeat to someone else. |
| trunk dedupe | not in trunk (grep for "just take the risk" across `app/`, `content/`, `components/`: zero hits) |
| **architect's call** | **Adopt** — The "just take the risk" sentence is position sensitivity in three seconds; put it on orientation and the credential page. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE2-003 |

#### N-005 · A quiet "What is this?" door on the entrance, into a plain-language answer.
| field | |
|---|---|
| kind | architecture |
| source | tgtl-claude-2.0/components/EntranceHome.tsx (blueprint §6.1) · also: tgtl-claude-2.0/components/EntranceHome.tsx (blueprint §6.1) |
| evidence | "<Link href=\"/orientation\">What is this?</Link>" |
| lands in | `components/EntranceHome.tsx`, under the book pair |
| doctrine check | pass |
| cost | S — gates: extends gate 0 (doors integrity) |
| why worth having | the trunk's entrance now opens on a game prologue ("A loading screen before the world loads"), two books, and six doors. A first-time visitor who does not yet know whether this is a game, a self-help site, or a joke has no small, non-committal link that answers the question. Every door is a commitment; "What is this?" is not. |
| trunk dedupe | not in trunk (`components/EntranceHome.tsx` has no equivalent; `/methodology` is reachable only from the nav bar under the word "Methodology") |
| **architect's call** | **Adopt** — A non-committal "What is this?" link under the books costs six words and answers the first-time visitor's only question. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE2-006, CLAUDE2-008 |

#### N-006 · The world map and the guidance walkthrough as entrance doors, not nav-only destinations.
| field | |
|---|---|
| kind | architecture |
| source | tgtl-claude-2.0/content/routes.ts `DOORS` (blueprint §3.1) |
| evidence | "label: \"Show me the life map\"" / "label: \"Help me choose\"" — blurb: "Lay a decision out and see the live options, costs, and recovery routes." |
| lands in | `content/routes.ts` `DOORS`, `components/EntranceHome.tsx` |
| doctrine check | pass |
| cost | S — gates: extends gate 0 (doors integrity) |
| why worth having | the trunk's six doors are Begin / Continue / Something happened / Learn the game / Look something up / Help me now. Four of six lead into the game layer or the crisis layer. A reader who arrives wanting the reference map, or wanting a decision laid out, has to find "Map" and "Guidance" in a ten-item nav bar. Two doors restore the reading layer to the front page without touching the play doors. |
| trunk dedupe | thinner in trunk (routes exist and are in `PRIMARY_NAV`; they are not entrance doors — `content/routes.ts` `DOORS`) |
| **architect's call** | **Adapt** — Two reading-layer doors (map, guidance) restore balance to a six-door entrance that is four-fifths game or crisis; cap at eight doors and keep Help-now last and distinct. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE2-007 |

#### N-007 · Every category surface carries a plain human question as its caption, not a label
| field | |
|---|---|
| kind | voice |
| source | `gol-opus4-6/index.html` (nine `wc-question` spans) + blueprint §1.3 |
| evidence | "Who am I? … What do I have? … Who's with me? … What's happening to me?" (four of the nine `wc-question` captions; also screenshot: records/consolidation/opus4-6/home-nine-wings-questions.png) |
| lands in | `content/routes.ts` (`DOORS` blurbs), `app/topics/page.tsx` topic cards, `app/character/page.tsx` panel sections, `app/map/page.tsx` domain headings |
| doctrine check | pass |
| cost | S — gates: extends the existing set-down vocabulary lint (gate 2) only in that the questions carry no game vocabulary and are edition-neutral by construction |
| why worth having | a reader who cannot name their problem in the site's nouns can almost always name it in one of these seven questions; it is the cheapest possible reduction in "where do I click" |
| trunk dedupe | thinner in trunk (`DOORS` are activity-shaped — "Begin a life", "Look something up"; `/topics` cards are noun-shaped — "Money and slack". Neither surface asks the reader's own question back at them.) |
| **architect's call** | **Adapt** — Plain human questions as captions on the topic cards and the map's domain headings; not on the doors, which are activity-shaped on purpose. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-001 |

#### N-008 · Stage on-ramps: an ordered reading path that also says what you are allowed to skip
| field | |
|---|---|
| kind | content |
| source | gol-fable5/guides/onramp-25.html (+ blueprint §2.9) · also: gol-opus5/atrium/reading-paths.html · also: gol-opus5/atrium/how-to-read.html |
| evidence | "What you're not allowed to skip, ever, is knowing where triage is — not for you, necessarily." — screenshot: records/consolidation/fable5/onramp-25-reading-path.png |
| lands in | `/map` (stage rail) or a small `/orientation` upgrade; ordered link list, ~9 stops |
| doctrine check | pass |
| cost | S — gates: extends gate 5 (route walk) |
| why worth having | nine ordered stops with a reason attached to each is the friendliest possible front door for a reader who is not in crisis and does not want to play — and the skip list is what stops it reading as homework. |
| trunk dedupe | not in trunk (`/orientation` is a redirect stub; `/map` shows stages but sequences no reading) --- |
| **architect's call** | **Adopt** — An ordered reading path with a stated skip list is the gentlest front door for the non-crisis, non-playing reader; nine stops on the orientation page. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-007, OPUS5-065, OPUS5-064 |

#### N-009 · "A life is not a ladder. It is a map with weather."
| field | |
|---|---|
| kind | voice |
| source | `gol-chatgptsol5-6/app/GuidebookPrototype.tsx` (hero) |
| evidence | "A life is not a ladder. It is a map with weather." |
| lands in | `/` entrance, `/map` header |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | the second half is what earns it — a map you can read, and weather you cannot control, in one image. |
| trunk dedupe | thinner in trunk (the trunk's map says "A life is not a single ladder" in a track note; the weather half — the part that carries the luck and the events — is missing) |
| **architect's call** | **Adopt** — "A map with weather" is the missing half of the trunk's own "not a single ladder" line; one sentence on /map. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-043 |

#### N-010 · The "no mandatory win condition" principle strip, rendered as a standing panel not a caption
| field | |
|---|---|
| kind | voice |
| source | `gol-chatgptsol5-6/app/GuidebookPrototype.tsx` (`.principle-strip`) |
| evidence | "No mandatory win condition. Stability, care, autonomy, love, craft, service, pleasure, meaning, and legacy can matter in different combinations." |
| lands in | `/orientation`, `/guidance` step 1, `content/methodology.ts` |
| doctrine check | pass |
| cost | S — gates: extends the existing no-score assertion |
| why worth having | it names nine legitimate objectives out loud, which does more work against normative pressure than a disclaimer that only says what the site will not do. |
| trunk dedupe | thinner in trunk (the trunk's objective list on `/guidance` is four — stability, autonomy, craft, service — and the "no universal objective" statement lives in prose rather than as a repeated element) --- |
| **architect's call** | **Adapt** — Name the legitimate objectives out loud on orientation and the guidance objectives step, using the trunk's ten priorities rather than Sol's nine. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-003 |

#### N-011 · Carry it too: primary-nav composition, now at ten entries
| field | |
|---|---|
| kind | architecture |
| source | blueprint_TGTL_3.0.md §14.8 |
| evidence | "Primary-nav composition (default: §6.1's nine sections; History's seat is the most contestable)" |
| lands in | `content/routes.ts` `PRIMARY_NAV` / `navLabel` + `KNOWN_LIMITATIONS.md` §3 |
| doctrine check | pass — the set-down subset (`SETDOWN_NAV_PATHS`) is untouched either way, so gate 2 is unaffected |
| cost | S |
| why worth having | the nav was already flagged as contestable at nine; 5.0 added Timeline and it is now ten, with History and Map both competing for the same reader. "User-friendly, smooth" is a nav question before it is anything else. |
| trunk dedupe | not in trunk. Current `navLabel` set: Play · Walkthrough · Map · Timeline · Situations · Guidance · Character · Topics · History · Methodology (`content/routes.ts` lines 37, 74, 84, 98, 137, 190, 209, 237, 282, 292). The open decision is unrecorded. --- |
| **architect's call** | **Park** — Nav composition at ten entries is a real owner decision; record it in KNOWN_LIMITATIONS §3 and decide in triage, do not build. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE3-019 |

#### N-012 · Search that reaches page headings and the timeline's milestone pages.
| field | |
|---|---|
| kind | architecture |
| source | blueprint_TGTL_ChatGPTSol5-6_2.0.md §6.7; tgtl-claude-2.0/KNOWN_LIMITATIONS.md |
| evidence | "a client-side search box over titles, headings, and page summaries of all 25 reader routes" (blueprint §6.7) |
| lands in | `components/Search.tsx` + a build-time index generated from `app/**` headings and `content/timeline/` |
| doctrine check | pass — build-time JSON index, no external service, no network call at query time |
| cost | M — gates: extends gate 1 (link integrity: every indexed anchor must resolve); new gate: "every reader route and every generated milestone page appears in the search index" |
| why worth having | the blueprint asked for headings; 2.0 shipped titles, summaries and hand-written keywords and recorded the gap. The trunk inherited that index unchanged (`components/Search.tsx` builds `haystack` from `[title, summary, ...keywords]`) while adding 24 generated milestone pages that are not in `ROUTES` at all. So the site's largest sourced content area is invisible to its own search, and a reader typing a word that appears in an `<h2>` but not a summary is told the guidance does not exist. The index is a build step, not a feature. |
| trunk dedupe | thinner in trunk (`components/Search.tsx` indexes 33 route records; no headings, no milestone pages) --- |
| **architect's call** | **Adopt** — Search that reaches headings and the 24 milestone pages is a build step; the site's largest sourced area is invisible to its own search box today. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE2-017 |

#### N-340 · TierZoo named as the editorial lineage, and gamification stated as an intentional theme
| field | |
|---|---|
| kind | voice |
| source | MASTER_PROJECT_BRIEF.md §6A "Intentional gamification and TierZoo inspiration" (L6323–6330) |
| evidence | "Gamification is an intentional theme of The Guidebook to Life, not merely an internal design metaphor." |
| lands in | `/walkthrough` (metagame section) or `/methodology` (instrument) |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | the site currently apologises for the game frame; the brief owns it, and naming the inspiration tells the reader what kind of explanation they are about to get. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adapt** — Name the strategy-guide lineage in one line on the walkthrough's metagame section; the frame's inspiration can be owned without gamifying the reader. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-002 |

#### N-343 · Geographic expansions as DLC, with an expansion-select experience above the two books
| field | |
|---|---|
| kind | architecture |
| source | MASTER_PROJECT_BRIEF.md §4B "Expansion-select experience" (L5808–5820) |
| evidence | "The two-book rubric choice remains above the expansions. Users first choose how the guide communicates, then choose which world region" |
| lands in | `/` (`components/EntranceHome.tsx`) and a new `/map/expansions` |
| doctrine check | pass |
| cost | L — gates: new gate: no expansion may render before its own sourced content exists (no gallery of promises) |
| why worth having | it converts "we only cover the US" from an embarrassment into a legible, honest release plan the reader can see. |
| trunk dedupe | not in trunk |
| **architect's call** | **Reject** — An expansion-select experience with one expansion is a gallery of promises; revisit when a second region has sourced content. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-005 |


### B. Situations & triage

#### N-020 · Triage as a one-click list of first-person true sentences
| field | |
|---|---|
| kind | safety |
| source | gol-fable5/guides/triage.html (+ blueprint §2.9) |
| evidence | "You don't need a website right now. You need one page. Pick the sentence that's true, and it will take you there." — screenshot: records/consolidation/fable5/triage-one-sentence.png |
| lands in | `/triage` (as the flat layer above, or instead of, the two-question `<details>` branches) |
| doctrine check | pass |
| cost | S — gates: extends the existing triage gate ("two questions max") — this is one |
| why worth having | a reader whose concentration is compromised reads a list of sentences faster than they operate a disclosure widget; each sentence also carries the destination's promise ("almost nothing has to be decided today"), so the click is informed. |
| trunk dedupe | thinner in trunk (`app/triage/page.tsx` uses four `<details>` branches with one direct link for abuse; destinations are labelled by name, not by what the page will give you) |
| **architect's call** | **Adapt** — A flat list of first-person true sentences above the two-question branches; each sentence names what the destination gives you. Keep the branches underneath. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-014 |

#### N-021 · Triage's second question routed by the *structure* of the demand, not its subject
| field | |
|---|---|
| kind | architecture |
| source | gol-claudefamily/assets/triage.js (`demand` branch), quest-board.html |
| evidence | "Classified by structure rather than by subject, because structure is what transfers" |
| lands in | `app/triage/page.tsx` (the "Something is being demanded of me" branch, currently a two-item dead end) — screenshot: records/consolidation/claudefamily/triage-two-questions.png |
| doctrine check | pass |
| cost | S — gates: extends the existing two-questions-max gate; the branch must still land on a complete page |
| why worth having | "paperwork I don't understand" / "one high-stakes thing to get through" / "someone else needs looking after" / "a decision I can't take back" are how the demand actually presents, and each has different moves |
| trunk dedupe | thinner in trunk (that branch currently routes to the situations index and the board — a menu, which the doctrine forbids for help-now and reads thin here too) |
| **architect's call** | **Adopt** — The "something is being demanded of me" branch is a two-item dead end; route it by the structure of the demand. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CF-006 |

#### N-022 · Make presentation intensity the second triage question, asked before the reader lands
| field | |
|---|---|
| kind | presentation |
| source | tgtl-chatgptsol5-6-2.0/app/components/HomePage.tsx (`triage-second` block) |
| evidence | "How much of the game frame would help right now?" … "This choice changes language and visual treatment, never the underlying guidance." |
| lands in | `app/triage/page.tsx`, `components/EntranceHome.tsx` |
| doctrine check | pass |
| cost | S — gates: extends the "two questions at most" triage gate (this is the second question, so the count must be asserted, not just promised) |
| why worth having | someone arriving after bad news gets the calm rendering chosen *for* the page they are about to open, instead of discovering the control later. |
| trunk dedupe | thinner in trunk — the trunk has three intensities as a persistent chrome control and a two-question triage, but the second question is not the frame; a reader in distress must find the toggle themselves. --- |
| **architect's call** | **Reject** — Asking a distressed reader to choose a frame intensity is a control, not care; set-down routes already force the calm rendering, which is the better answer. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-003 |

#### N-023 · A "getting through today" page for readers with no capacity — which tells them to stop reading the site
| field | |
|---|---|
| kind | safety |
| source | gol-opus5/threshold/stabilization-first.html |
| evidence | "reading about resources and constraints is not a use of what you have — it is a way of feeling like you are doing something while spending the little you have left" |
| lands in | a route beside `/triage` and `/threshold`; reachable from Help-now |
| doctrine check | pass — register zero, no game vocabulary; not playable, not on the timeline |
| cost | S — gates: extends gate 2 (no game vocabulary on set-down routes); new gate: "the page contains no analytical framing and no onward instrument link above the fold" |
| why worth having | the six items are the most concretely useful thing in the whole prototype, and the page's willingness to say *nothing here is for you right now* is exactly the owner's standard |
| trunk dedupe | thinner in trunk (`/triage` is two questions and routes onward; the five set-down pages are topic-specific; there is no page for "no capacity today, any topic") |
| **architect's call** | **Adopt** — A "getting through today" page that tells a depleted reader to stop reading is the most reader-first thing in the whole archive; register zero, beside /triage. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-019 |

#### N-024 · Harm reduction: accurate information that is not conditional on compliance
| field | |
|---|---|
| kind | safety |
| source | gol-opus5/threshold/harm-reduction.html |
| evidence | "help that requires you to first agree with the helper is not help — it is a transaction, and it reliably fails the people who most need something" |
| lands in | a new register-zero route beside `/threshold`; content overlapping `/situations/being-hurt` |
| doctrine check | touches a sensitive page → parked for clinical review (the worked cases are staying-with-an-abuser, substance use, missed appointments, telling nobody) |
| cost | M — gates: extends the set-down/no-game-vocabulary gate; new gate: "the page states the recommended thing is still the recommended thing, and makes nothing conditional on it" |
| why worth having | it is the honest answer to the boundary problem the trunk already has — "see a clinician" is not a boundary honoured for a reader with no access |
| trunk dedupe | not in trunk |
| **architect's call** | **Park** — Harm reduction as a route is right in principle and clinical-review territory in practice; parked for the being-hurt reviewer. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-018 |

#### N-025 · Burnout as a situation page, run as a four-step decision sequence
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/pathways/burnout.html` · also: gol-claudefamily/condition-burnout.html · also: tgtl-chatgptsol5-6-2.0/app/components/SituationPages.tsx (line 120) |
| evidence | "Burnout is not tiredness. Tiredness resolves with rest. Burnout is chronic energy depletion combined with emotional exhaustion" |
| lands in | new `app/situations/burnout/` + `content/routes.ts` |
| doctrine check | needs re-sourcing (numbers) — the three Maslach dimensions (exhaustion / cynicism / reduced efficacy) are attributed but unsourced here; carry them only with a fetched citation or render them without attribution |
| cost | M — gates: extends the situation-page shape (Help-now, no menu, recovery beside cost); new gate: *no situation page states a research construct without an evidence record* |
| why worth having | burnout is the single commonest reason an adult goes looking for a page like this, and the four steps — confirm the diagnosis, stop the bleeding, find the root cause, make the structural change — are a genuine sequence rather than a list of tips |
| trunk dedupe | not in trunk (burnout appears only as a pressure label in `app/character/board` and `content/roadmap.json`; there is no page) |
| **architect's call** | **Adopt** — Burnout is the commonest reason an adult opens a page like this and the trunk has no page; four-step sequence, Maslach construct only with a fetched source. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-008, CF-013, SOL2-027 |

#### N-026 · Breakup as a situation page: several systems fail on the same day
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/wings/encounters/breakup.html` · also: `gol-opus4-6/wings/encounters/breakup.html` §Common mistakes · also: gol-fable5/bestiary/breakup.html |
| evidence | "It hits multiple systems at once, which is why it hurts disproportionately to what observers might think is happening." |
| lands in | new `app/situations/breakup/`; links to `/topics/relationships`, `/guidance/daily-plan` |
| doctrine check | pass — loss-tier adjacent; if it ever reaches the playable layer it goes on the typed beat channel only, never as a card |
| cost | M — gates: extends the situation-page shape; the page must carry Help-now and a recovery route beside every cost |
| why worth having | the trunk covers a death and grief and depression and being hurt, and has nothing for the commonest catastrophic event in an adult life; the "rebuild daily quests first, before the existential questions" move maps straight onto `/guidance/daily-plan` |
| trunk dedupe | not in trunk (zero occurrences of "breakup" anywhere in `app/`, `content/`, `components/`) |
| **architect's call** | **Adopt** — Breakup is the commonest catastrophic adult event and has zero occurrences in the trunk; light intensity, tone graded on the sensitive bar. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-019, OPUS46-020, FABLE5-017 |

#### N-027 · The separation, as an event with two clocks
| field | |
|---|---|
| kind | content |
| source | gol-claudefamily/event-separation.html |
| evidence | "One household becomes two on the same total income." |
| lands in | `/situations/` (a new page), `/triage` "not chosen" branch |
| doctrine check | pass — the page routes explicitly away from itself where there is violence or control, into what the trunk holds at `/situations/being-hurt` |
| cost | M — gates: extends `content/routes.ts` and the triage branch lists |
| why worth having | the administrative clock runs fast while the grief clock does not, and most avoidable damage comes from letting one set the pace of the other — a genuinely load-bearing structural insight, not advice |
| trunk dedupe | not in trunk (no separation/divorce page anywhere) |
| **architect's call** | **Adopt** — Separation is a distinct event from a breakup: one household becomes two on one income, on two clocks; routes away from itself where there is control or violence. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CF-009 |

#### N-028 · The Diagnosis page: orientation and routing only, with three questions that earn their place
| field | |
|---|---|
| kind | content |
| source | gol-fable5/bestiary/diagnosis.html · also: gol-claudefamily/event-diagnosis.html · also: tgtl-claude-3.0/DECISIONS.md (Phase 0) |
| evidence | "after the first heavy sentence, most people stop absorbing. That is physiology, not weakness" |
| lands in | a new `/situations/diagnosis` (set-down intensity) |
| doctrine check | needs re-sourcing (numbers) for the physiology claim; the rest is descriptive and prescribes no treatment |
| cost | M — gates: extends the set-down list + gate 2 vocabulary lint |
| why worth having | "how much time do I have to make this decision?" is the question that returns days or weeks the reader did not know they had — the highest-value sentence on the page, and free. |
| trunk dedupe | not in trunk |
| **architect's call** | **Park** — A diagnosis page is set-down territory and needs the clinical reviewer before it ships; write it to the event template, hold it behind the gate. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-016, CF-010, CLAUDE3-013 |

#### N-029 · The Windfall: the do-not-decide list applied to good news, and the fixed-cost ratchet as the actual mechanism of ruin
| field | |
|---|---|
| kind | content |
| source | gol-fable5/bestiary/windfall.html, /manual/habituation.html · also: gol-claudefamily/event-windfall.html |
| evidence | "each upgrade raises the monthly floor, quietly converting a one-time corpus into a permanent income requirement" |
| lands in | a new `/situations/windfall`; the ratchet mechanic joins `/topics/money` |
| doctrine check | pass — "lottery-winner ruin" as a stated pattern is a claim to re-source if any rate is quoted; the page quotes none |
| cost | M — gates: none new |
| why worth having | it converts a moralised story ("they were stupid") into arithmetic anyone can check, and it is the only place a site can honourably say "joy destabilises decision-making almost exactly as grief does." |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — Windfall filed with the catastrophes: the do-not-decide list for good news and the fixed-cost ratchet; no rates quoted, none needed. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-018, CF-011 |

#### N-030 · Four triage destinations the trunk's router cannot reach
| field | |
|---|---|
| kind | content |
| source | gol-fable5/guides/triage.html → /bestiary/diagnosis.html, /bestiary/breakup.html, /bestiary/windfall.html, /guild/repair.html |
| evidence | "I got a serious diagnosis. · The relationship ended. · A large amount of money just arrived. · I hurt someone." |
| lands in | `/situations` (four new routes) + `/triage` branches |
| doctrine check | pass — the diagnosis page is written SET DOWN and would be graded on the sensitive-page tone bar |
| cost | L — gates: extends gate 5, the set-down assignment list, and the search index |
| why worth having | three of the four are common, unserved, and time-critical; "I hurt someone" is the one route no comparable site has and the one that most needs to exist without shame attached. |
| trunk dedupe | not in trunk (`/situations` covers job-loss, a-death, grief, depression, being-hurt only) |
| **architect's call** | **Adopt** — "I hurt someone" is the route no comparable site has; adapt guild/repair.html without shame and with the safety fork first. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-015 |

#### N-031 · Career change as a situation page: five steps, in the order you actually need to think about them
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/pathways/career-change.html` · also: `gol-opus4-6/pathways/career-change.html` §Step 1 |
| evidence | "organized not by category but by the order you actually need to think about things" |
| lands in | new `app/situations/career-change/`; leans on `/topics/work`, `/guidance`, `/map/credential-decision` |
| doctrine check | pass |
| cost | M — gates: extends the situation-page shape and G-06 (mechanisms stay owned by the topic guides; the pathway links, never re-explains) |
| why worth having | diagnose the impulse → audit skills → count resources → talk to the people affected → reframe the narrative is the sequence people get wrong, and they get it wrong by starting at step 2 |
| trunk dedupe | thinner in trunk (`/topics/work` §"Changing direction is not starting over" carries the respec argument; `/guidance` walks Plan A/B/C. Neither is a sequenced pathway for this specific situation, and the 2.0 harvest took the respec *note*, not the pathway.) |
| **architect's call** | **Adopt** — Career change as a sequenced pathway; the trunk took the respec note, not the pathway, and readers start at step two. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-010, OPUS46-011 |

#### N-032 · "Unemployed" and "In debt" as durable conditions with their own pages, separate from the events that caused them
| field | |
|---|---|
| kind | content |
| source | gol-fable5/character/unemployed.html, /in-debt.html · also: gol-claudefamily/condition-in-debt.html |
| evidence | "A debt with a date is a project; a debt without one is weather." |
| lands in | `/situations` (two routes) or `/topics/money`; links from `/situations/job-loss` |
| doctrine check | pass — no figures quoted, none needed |
| cost | M — gates: extends gate 5 and the search index |
| why worth having | two of the most common long states in a reader's life, each currently reachable in the trunk only through the event that started it; "the services employment provided for free and never itemized" (a reason to wake, a place to be, an answer to *what do you do*) is the paragraph nobody writes. |
| trunk dedupe | not in trunk (job-loss covers the event and the search; the state itself has no home) |
| **architect's call** | **Adopt** — Unemployed and in-debt as durable states with their own pages; the event page covers the first weeks, nothing covers month nine. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-028, CF-014 |

#### N-033 · Caregiving as an open-ended condition with no completion state
| field | |
|---|---|
| kind | content |
| source | gol-claudefamily/condition-caregiving.html, situation-caregiver.html, quest-caring-for-aging-parents.html · also: MASTER_PROJECT_BRIEF.md "Inferred cross-cutting system: caregiving and intergenerational transfer" (L14313–14368) [Provisional — ChatGPT 5.6 Sol contribution; Research Priority 5] |
| evidence | "the resentment reads as evidence of not loving them enough, the wish for a day off reads as selfishness" |
| lands in | `/situations/`, `/topics/relationships` |
| doctrine check | touches a sensitive page → parked in part (its stated exit is bereavement, which routes into `/situations/grief`); the fragmentation-not-hours mechanic is pass |
| cost | M — gates: extends the situations family; new gate: "the caregiving page does not decompose the diminishment" |
| why worth having | it names why treating an uncompletable load as a finishable task is the reliable route into burnout, and it says plainly that resentment and love are not in competition |
| trunk dedupe | not in trunk (caregiving exists in the sim's action cards and the timeline; there is no reader-facing page) |
| **architect's call** | **Adapt** — Caregiving as an open-ended condition; the fragmentation mechanic and resentment-is-not-unlove line ship, the bereavement exit routes to the frozen grief page without touching it. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CF-016, BRIEF-122 |

#### N-034 · Immigration status: a condition that *gates* rather than modifies
| field | |
|---|---|
| kind | content |
| source | gol-claudefamily/condition-immigration-status.html, arena-border.html |
| evidence | "a modified action is still available at a worse price and a gated one is not available" |
| lands in | `/situations/`, and as a position axis on `/map/credential-decision`'s filter |
| doctrine check | pass — no immigration advice; deliberately non-specific |
| cost | M — gates: extends the position filter's axis list; new gate: "any page whose advice assumes leaving is possible carries the derived-status note" |
| why worth having | the gate/modifier distinction is a genuine mechanic the trunk lacks, and the derived-status item — a person whose right to remain runs through a partner — is a safety correction to every "you could leave" sentence in the guide |
| trunk dedupe | not in trunk (immigration appears only as a passing phrase in `job-loss` and `being-hurt`) |
| **architect's call** | **Adopt** — Immigration status as a condition that gates rather than modifies, and the derived-status correction to every "you could leave" sentence. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CF-015 |

#### N-035 · The Late-Night Emergency: the arenas you only enter on your worst day, mapped in advance on purpose
| field | |
|---|---|
| kind | content |
| source | gol-fable5/atlas/emergency.html · also: gol-claudefamily/arena-late-night-emergency.html |
| evidence | "Almost nothing shoved across a counter at night must be signed at night; \"I'll review this tomorrow\" is a complete sentence" |
| lands in | a new route under `/situations` or `/map`; linked from `/triage` and `/threshold` |
| doctrine check | pass — the *police-station* paragraph ("you may stop producing sentences and ask for a lawyer") is jurisdictional and needs re-sourcing or generalising |
| cost | M — gates: new gate: "the emergency page carries no game vocabulary" (it is written thin by design) |
| why worth having | the only genuinely preventive page on the site — five minutes on an ordinary evening (ICE contact, medication list, someone who knows where you are) against a night nobody plans for. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — The Late-Night Emergency: five things to decide on an ordinary evening; the only genuinely preventive page in the archive; police-station paragraph re-sourced or generalised. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-010, CF-032 |

#### N-036 · The "waiting on a slow decider" move set — including the four things that reliably do not work
| field | |
|---|---|
| kind | content |
| source | gol-opus5/situations/families.html |
| evidence | "Waiting is not free time; it is time with a background process running." Moves: find the real timescale, do the branch-independent work, prepare the worse branch once in writing, set a review trigger |
| lands in | `/situations`, and `/guidance` as a plan shape |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | enormously common, almost never written about, and the "prepare the worse branch once, in writing, then stop" instruction is the kind of concrete thing the trunk's guidance layer is short of |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — Waiting on a slow decider: enormously common, never written about; "prepare the worse branch once, in writing, then stop." |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-024 |

#### N-037 · Situation families — clustering by structural shape rather than topic, with one worked in full
| field | |
|---|---|
| kind | content |
| source | gol-opus5/situations/families.html · also: gol-fable5/quests/index.html (+ blueprint §2.4) |
| evidence | an immigration application, a biopsy result, a hiring process and a partner deciding whether to stay share "a decision that determines something large about your life, made by a party that is not you" |
| lands in | `/situations` (a families index) and `content/routes.ts` |
| doctrine check | pass, with the prototype's own guard: a set-down family member is never displayed beside its structural relatives |
| cost | M — gates: new gate: "no set-down route appears in a family listing" |
| why worth having | it is the payoff of having a model at all — four unrelated situations, one short move list, and the same list of things that do not work |
| trunk dedupe | not in trunk (`/situations` is a flat list of six pages) |
| **architect's call** | **Adapt** — Situation families by structural shape as a second index on /situations; the set-down pages are never listed beside their structural relatives. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-023, FABLE5-003 |

#### N-038 · The situation that the instrument itself produces — "I have everything I planned for and I feel nothing"
| field | |
|---|---|
| kind | content |
| source | gol-opus5/situations/everything-i-planned.html + mechanics/scope-limits.html |
| evidence | "It is this site's characteristic failure mode, applied to a life"; the test — "if the thing you achieved had turned out not to produce whatever it was supposed to produce, would you still have wanted it?" |
| lands in | `/situations`, cross-linked from `/methodology` known breaks |
| doctrine check | pass, with the page's own clinical fork stated (post-achievement flatness and depression present alike) → that paragraph parked |
| cost | M — gates: extends the "navigation not destination" known break into a worked page |
| why worth having | the trunk names this as a known break in the abstract; the prototype shows what it looks like when it happens to someone, which is what makes the break believable |
| trunk dedupe | thinner in trunk (`KNOWN_BREAKS.navigation-not-destination` and `.achievement-and-meaning` state it; no page works it) --- |
| **architect's call** | **Adopt** — "I have everything I planned for and feel nothing" is the trunk's own known break worked as a page; the clinical fork paragraph parked. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-029 |

#### N-039 · "A horizon with an empty move set" — despair as a describable structure, not a deficiency
| field | |
|---|---|
| kind | content |
| source | gol-opus5/codex/horizons-empty-move-set.html |
| evidence | "Motivation is not generated by wanting. It is generated by wanting plus a visible path."; three causes with different exits — a binding constraint, a suppressing state, unnamed prerequisites |
| lands in | `/situations` or `/guidance`; referenced by the board when the moves row comes out empty |
| doctrine check | touches a sensitive page → parked where it borders depression; the page carries its own Help-now line first, which the trunk requires anyway |
| cost | M — gates: extends the Help-now-on-every-route gate |
| why worth having | it is the model earning its keep — a page that can say *the move list really is empty* without blaming the reader, which the advice genre structurally cannot |
| trunk dedupe | not in trunk |
| **architect's call** | **Park** — "A horizon with an empty move set" borders depression too closely to ship ahead of clinical review; draft it, hold it. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-028 |

#### N-040 · An anti-pattern catalogue framed as structures, not diagnoses, with the maintenance-deferral cascade worked step by step
| field | |
|---|---|
| kind | content |
| source | gol-opus5/situations/anti-patterns.html |
| evidence | "An anti-pattern is a description of a structure, not a diagnosis of a person." — and step 3: "the deferral appears to work, repeatedly, for months" |
| lands in | `/situations`, cross-linked from `/character/logs` (the upkeep list) and `/topics/money` |
| doctrine check | pass |
| cost | M — gates: new gate: "every anti-pattern names its structural cause outside the person" |
| why worth having | naming the shape is easier than knowing what to do, and the inverted reward schedule explains something readers experience as a personal failing |
| trunk dedupe | not in trunk (grep for "anti-pattern" across `app/` and `content/` returns nothing) |
| **architect's call** | **Adopt** — An anti-pattern catalogue framed as structures, with the maintenance-deferral cascade worked; links the upkeep list to a reason. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-025 |

#### N-041 · Conflict cases labelled *not solvable, only navigable* — as an ontological commitment
| field | |
|---|---|
| kind | voice |
| source | gol-opus5/situations/conflict-cases.html + ethics/hard-moral-cases.html |
| evidence | "Where two things you genuinely want are incompatible, or two obligations both bind, there is no arrangement that satisfies both" |
| lands in | `content/routes.ts` (a page kind) and `/situations` |
| doctrine check | pass |
| cost | S — gates: new gate: "a conflict-case route never terminates in a recommendation" |
| why worth having | the trunk's `/guidance` already has a no-recommendation state; this gives it a named class of situation where that state is the *correct* output rather than a fallback |
| trunk dedupe | thinner in trunk (the no-recommendation state exists as an outcome, not as a page class) |
| **architect's call** | **Adopt** — Conflict cases labelled not solvable, only navigable: a named page class where the no-recommendation state is the correct output. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-026 |

#### N-042 · Probate and notifications: the fetch quest as a kindness, with delegation as the actual advice
| field | |
|---|---|
| kind | content |
| source | gol-claudefamily/quest-probate.html |
| evidence | "Handing someone a named task is easier than answering 'let me know if you need anything'" |
| lands in | `/situations/a-death` as a sibling page (not inside it — that page is byte-frozen) |
| doctrine check | touches a sensitive page → parked (it routes from `a-death` and `grief`, both sensitive; the page itself is deliberately written so nothing has to be read as a demand, which is exactly the tone judgement that needs the human gate) |
| cost | M — gates: extends `content/routes.ts`; the five sensitive pages stay byte-identical, so this must be reachable *from* them without editing them |
| why worth having | naming an overwhelming pile as a bounded, delegable, deadline-bearing set of chores is the one thing the frame can honestly do for someone drowning in it, and clearing the house early is named as the most regretted action |
| trunk dedupe | thinner in trunk (`/situations/a-death` holds first-days logistics; the three layers, the delegation argument and the months-long estate phase are not there) --- |
| **architect's call** | **Park** — Probate as a delegable fetch quest is a kindness, and it routes from two frozen pages; parked for the a-death reviewer. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CF-040 |

#### N-043 · Standing Situation Layouts: one position laid out across all nine slots, with the empty slot as the finding
| field | |
|---|---|
| kind | content |
| source | gol-claudefamily/situation-single-parent.html, situation-retiree.html, situation-caregiver.html, situation-immigrant-year-one.html, situation-new-graduate.html, situation-new-diagnosis.html (+ blueprint §2.9, §3.3) · also: gol-claudefamily/situation-single-parent.html, situation-retiree.html |
| evidence | "the chosen-quest slot is empty — not because of a failure of ambition but because the position has no uncommitted capacity" |
| lands in | `/situations` (a second kind of situation page, beside the event pages) — screenshot: records/consolidation/claudefamily/situation-layout-single-parent.png |
| doctrine check | pass |
| cost | L — gates: extends the `/situations` route family and the set-down assignment in `content/routes.ts` |
| why worth having | it lets a reader see their own position with structure they did not have words for, and its diagnostic value is in which sections come out empty or overfull — the opposite of a checklist |
| trunk dedupe | not in trunk (`/character/board` reads *which pressure binds*, one row at a time; nothing lays a whole standing position out) |
| **architect's call** | **Adopt** — Standing Situation Layouts: one position across every slot with the empty slot as the finding; a second kind of situation page the trunk lacks entirely. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CF-004, CF-005 |

#### N-044 · The encounter card: type, difficulty, duration, key resources, prerequisites, recovery
| field | |
|---|---|
| kind | instrument |
| source | `gol-opus4-6/wings/encounters/job-loss.html`, `breakup.html`, `grief.html` (`dl.encounter-meta`) · also: gol-fable5/bestiary/index.html + all five event pages (+ blueprint §2.5, Appendix B) · also: gol-claudefamily/event-windfall.html, event-diagnosis.html, event-separation.html · also: gol-fable5/bestiary/layoff.html, /bestiary/breakup.html, /bestiary/death.html |
| evidence | screenshot: records/consolidation/opus4-6/encounter-card-job-loss.png |
| lands in | head of `app/situations/*` pages; a `SituationCard` primitive |
| doctrine check | needs re-sourcing (numbers) — the prototype prints "Duration: 1–9 months typical" and "Difficulty: High"; **duration is a digit and needs a fetched source or must not render**, and *difficulty* is a rating of the reader's situation and should be dropped entirely rather than re-sourced |
| cost | M — gates: new gate: *no situation card field renders a digit without an evidence record*; extends the no-scoring wall (difficulty field excluded by construction, not by editorial care) |
| why worth having | the two fields that matter most — **recovery** ("Full, but leaves permanent XP") and **prerequisites** ("None — involuntary encounter") — answer the two questions a frightened reader actually has, at the top, before any prose |
| trunk dedupe | thinner in trunk (situation pages open with a `PageHeader` intro and a `MechanicAnchor`; there is no at-a-glance card, and nothing states "this was involuntary" as a structured field) |
| **architect's call** | **Adapt** — A situation card at the head of every new situation page: type, resources, prerequisites, recovery. Difficulty dropped by construction; durations only with a source. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-014, FABLE5-019, CF-007, FABLE5-020 |

#### N-045 · Every step of a decision sequence names which system is primary for that step
| field | |
|---|---|
| kind | architecture |
| source | `gol-opus4-6/pathways/career-change.html`, `burnout.html`, `grief-pathway.html` (per-step "Primary wing:" line) · also: `gol-opus4-6/pathways/career-change.html` (five `<blockquote>Read: …</blockquote>`) |
| evidence | screenshot: records/consolidation/opus4-6/pathway-career-change-steps.png |
| lands in | `app/situations/job-loss/page.tsx` and any new situation page; a `PathwayStep` primitive |
| doctrine check | pass |
| cost | S — gates: extends gate 2 (the system label is a `<Term>`; set-down routes render no step chrome at all) |
| why worth having | it tells a reader mid-crisis *which instrument to pick up for this step* — a money question at step 3, a people question at step 4 — instead of asking them to hold the whole map at once |
| trunk dedupe | thinner in trunk (`app/situations/job-loss` is already a decision sequence with headed phases — the 2.0 harvest took that. It does not label the system each phase belongs to.) |
| **architect's call** | **Adopt** — Each step of a decision sequence names its primary system; a PathwayStep primitive for job-loss and every new pathway. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-012, OPUS46-013 |

#### N-046 · A three-horizon action sequence on a situation page: first 24 hours / next few days / next two weeks
| field | |
|---|---|
| kind | content |
| source | tgtl-chatgptsol5-6-2.0/app/components/SituationPages.tsx (job-loss, lines 115–117) |
| evidence | "Save lawful copies of relevant personal records, note dates and contacts, and avoid signing what you do not understand under artificial urgency." |
| lands in | `app/situations/job-loss/page.tsx` |
| doctrine check | pass |
| cost | S — gates: none new (no digits, no jurisdictional claim) |
| why worth having | someone who has just been let go can hold three horizons; the trunk's job-loss page is stronger editorially but harder to act from in the first hour. |
| trunk dedupe | thinner in trunk — the trunk has "the first days: find the clocks" and "stabilization", but not an explicit horizon ladder ending in a rhythm-restoration step. |
| **architect's call** | **Adopt** — A three-horizon ladder on job-loss (first day, first days, first two weeks) makes the strongest page on the site actionable in the first hour. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-026 |

#### N-047 · A worked Board example on the situation page itself
| field | |
|---|---|
| kind | presentation |
| source | tgtl-chatgptsol5-6-2.0/app/components/SituationPages.tsx (`board-example`) |
| evidence | `<dt>Pressure</dt><dd>"I must accept the first offer or I will never recover."</dd>` |
| lands in | `app/situations/job-loss/page.tsx` linking into `/character/board` |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | a tool shown already filled in with *this* situation is understood instantly; a tool linked to as an empty form usually is not opened. |
| trunk dedupe | not in trunk — the trunk's Board is a separate guided instrument at `/character/board`; no page shows it worked through. |
| **architect's call** | **Adopt** — A worked board example on the job-loss page; a tool shown filled in is understood, a link to an empty tool is not opened. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-028 |

#### N-048 · The cascade map — one shock traced along its couplings, with the cheap intervention points marked
| field | |
|---|---|
| kind | instrument |
| source | gol-opus5/board/cascades.html · screenshot: records/consolidation/opus5/board-cascades.png · also: gol-claudefamily/event-layoff.html, event-diagnosis.html, event-separation.html, event-windfall.html (+ blueprint §2.5) |
| evidence | "Everything is not falling apart at once. One thing fell, and it was connected to four others."; the job-loss map runs origin → 8 steps over 6+ months, jurisdiction-flagged at steps 1 and 5 |
| lands in | `/map` or `/situations/job-loss`; `content/board.ts` neighbourhood as a rendered map |
| doctrine check | needs re-sourcing (numbers) — the step timings ("1–3 months", "6 months+") are authored and must be re-sourced or rendered without digits |
| cost | L — gates: new gate: "a cascade map states it is a modal path, not a forecast, and names its jurisdiction assumptions" |
| why worth having | the highest-leverage claim in it — that the cheapest hour is spent on coverage continuation and entitlements in week one, not on the CV — is directly actionable and is the sort of thing the trunk's job-loss page gestures at without laying out |
| trunk dedupe | thinner in trunk (cascade appears as a word in `job-loss`, `topics/money`, `character/logs`; there is no ordered map, no propagation steps, and no intervention points) |
| **architect's call** | **Adapt** — The cascade map as a drawn instrument on job-loss: one shock along its couplings with the cheap intervention points; timings re-sourced or rendered without digits. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-030, CF-008 |

#### N-049 · An encounter taxonomy that includes the two kinds nobody writes about: grinding and environmental hazards
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/wings/encounters/index.html` (six types) · also: `gol-opus4-6/wings/encounters/index.html` + blueprint §3.3 ("load-bearing") |
| evidence | "Prolonged periods where nothing dramatic happens and progress is slow. Where most of life actually happens." |
| lands in | `/situations` index, `/walkthrough` mechanics, `/map` (hazards as world-generated, not player-generated) |
| doctrine check | pass — *but* the "Boss Fights" label as applied to a serious diagnosis or a death is crisis/loss tier and stays off the playable layer and the timeline |
| cost | M — gates: extends `content/exclusions.ts` review (the taxonomy names things the exclusion lists already govern; **do not** rebalance the lists to fit it) |
| why worth having | naming the grind gives the reader a category for the two undramatic years they are currently in, and naming environmental hazards puts a recession or a discrimination event in the world rather than in the person |
| trunk dedupe | thinner in trunk (`/history` covers world-level patches; `/situations` covers acute events; the *long undramatic middle* has no name anywhere on the site) |
| **architect's call** | **Adapt** — Name the grind and environmental hazards as kinds of event on the situations index and in the walkthrough; no boss-fight label near crisis content. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-016, OPUS46-015 |

#### N-050 · Status effects as a distinct kind: chronic conditions respond to management, not to action
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/wings/encounters/status-effects.html` · also: `gol-opus4-6/wings/encounters/status-effects.html` §The visibility problem |
| evidence | "Encounters respond to action — you do things, and the situation changes. Status effects respond poorly to action and well to management." |
| lands in | `/topics/health`, `/character/board` (pressures), `/walkthrough` mechanics |
| doctrine check | touches a sensitive page → parked (the article's own examples are depression, addiction and ongoing grief; `app/situations/depression` and `/grief` are byte-frozen. Land the *mechanic* on `/topics/health` and `/walkthrough`; park every depression- and grief-specific line for clinical review.) |
| cost | M — gates: extends the sensitive-page freeze check; new gate: *the status-effect mechanic page names no condition that has a frozen situation page* |
| why worth having | it is the difference between a reader trying to "beat" a chronic condition and a reader building a life that accounts for it — and the trunk's board already reads pressures without ever explaining why some of them do not respond to effort |
| trunk dedupe | not in trunk (no page distinguishes acute from chronic as *kinds requiring different strategies*) |
| **architect's call** | **Adapt** — Acute versus chronic as kinds needing different strategies lands on /topics/health and the walkthrough; every depression- and grief-specific line parked. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-017, OPUS46-018 |

#### N-365 · Ten crisis phases, ending honestly at "new build or continuing impairment"
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Crisis phases" (L14261–14275) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "Recovery does not always restore the previous build." |
| lands in | `/situations` (the shared spine), `/situations/job-loss` |
| doctrine check | touches a sensitive page → parked for the crisis-tier situations; usable on `/situations/job-loss` |
| cost | M — gates: extends `content/exclusions.ts` review — the phase spine must not be applied to crisis-tier pages |
| why worth having | `/situations/job-loss` is the trunk's only worked non-sensitive setback; a shared phase spine would let more of them exist without re-inventing tone each time. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adapt** — A shared crisis-phase spine for the non-crisis situation pages (job loss, burnout, breakup, windfall), ending honestly at "new build or continuing impairment"; never applied to crisis-tier pages. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-036 |

#### N-387 · A situations backlog drawn from the brief's crisis list, triaged by tier
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Inferred cross-cutting system: crisis, failure, loss, and recovery" (L14233–14260) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "Illness / Injury / Disability / Death of a party member / Breakup or divorce / Job loss / Business failure / Academic failure / Bankruptcy" |
| lands in | `app/situations/`, `content/routes.ts` |
| doctrine check | touches a sensitive page → parked for the loss/crisis tiers; the non-crisis members (bankruptcy, academic failure, business failure, burnout, relocation) are buildable |
| cost | L — gates: extends `content/exclusions.ts`; each new route needs its Help-now header and set-down intensity decision |
| why worth having | `/situations` currently has one worked non-sensitive page (job loss); the brief supplies a triaged backlog rather than an undifferentiated list. |
| trunk dedupe | thinner in trunk |
| **architect's call** | **Adapt** — Record the non-crisis remainder of the brief's crisis list (bankruptcy, academic failure, business failure, relocation) in WHATS_COMING; the built members are N-025 to N-036. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-067 |

#### N-388 · Relationship failure modes, warning signs, repair, and exit-and-safety paths
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Relationship walkthrough outputs" (L10796–10810) and §7A "Relationship fit and failure modes" [Provisional — ChatGPT 5.6 Sol contribution; §7A block carries "RESEARCH REQUIRED BEFORE FEATURE IMPLEMENTATION"] |
| evidence | "Warning signs / Repair strategies / Exit and safety paths" |
| lands in | `/topics/relationships`; safety material → `/situations/being-hurt` (byte-identical, so parked) |
| doctrine check | touches a sensitive page → parked (any coercion/abuse content goes to the register, not the page) |
| cost | L — gates: extends the exclusion lists; the research gate blocks any compatibility or dissolution prediction |
| why worth having | the trunk's relationships topic is descriptive; repair is the part readers can act on, and the brief already fences off the part they must not be given as a prediction. |
| trunk dedupe | thinner in trunk (`/topics/relationships`) |
| **architect's call** | **Park** — Relationship failure modes and repair are behind the owner's own research gate and the exit material is being-hurt territory; parked. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-068 |

#### N-394 · Sobriety filed as a build rather than a quest — naming the "recovery arc" as a quest-ification error with a cost
| field | |
|---|---|
| kind | safety |
| source | gol-fable5/character/sobriety.html (+ blueprint §4 case 6) |
| evidence | "Treating recovery as an arc makes relapse read as story-failure… treating it as a build makes relapse an event to be survived" |
| lands in | parked for review; if built, `/situations` or `/topics/health` with clinical review |
| doctrine check | touches a sensitive page → parked for clinical review (adjacent to the depression route and to crisis-tier material; the page also says plainly "nobody runs it alone well") |
| cost | M — gates: extends the sensitive-content review gate |
| why worth having | it is the clearest demonstration in the whole prototype that the ontology does real work — the filing decision changes what a relapse *means* to the person having one. |
| trunk dedupe | not in trunk --- |
| **architect's call** | **Park** — Sobriety as a build rather than a quest is the clearest case of the ontology doing work, and it is crisis-adjacent; clinical review before any prose. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-030 |

#### N-396 · Conditions as a registry with a fixed anatomy, and readout corruption as a required field
| field | |
|---|---|
| kind | architecture |
| source | gol-claudefamily/character-sheet.html, condition-burnout.html, condition-caregiving.html (+ blueprint §2.3) · also: gol-fable5/character/grief.html, /unemployed.html, /in-debt.html, /between-servers.html (+ blueprint §2.3, Appendix B) |
| evidence | "Where a condition corrupts the player's readouts of their own state, that is a required field and it is stated first" |
| lands in | `content/character.ts` + a `/character` sub-family; the readout field would cite the trunk's existing `readout` mechanic |
| doctrine check | touches a sensitive page → parked for the three set-down members (grieving, depression, addiction); the anatomy itself is pass |
| cost | L — gates: extends `content/exclusions.ts` assignment; new gate: "a condition page states its readout corruption before anything else" |
| why worth having | onset / what it modifies / readout / duration / exit / what it is like inside is a template that stops a condition page becoming either a diagnosis or a pep talk |
| trunk dedupe | not in trunk (the trunk has situation pages and a pressure board; no condition registry) |
| **architect's call** | **Adapt** — A condition-page template for the new durable-state pages (burnout, unemployed, in debt, caregiving, immigration status): onset, what it modifies, readout corruption first, duration, exit, what it is like inside; the grief, depression and addiction members stay parked. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CF-012, FABLE5-027 |


### C. Board, logs & guidance

#### N-060 · A "what is acting on you" step: the structures that are making the demand, named as structures.
| field | |
|---|---|
| kind | instrument |
| source | tgtl-claude-2.0/components/Board.tsx `ROWS[demanded]` (blueprint §6.6) |
| evidence | "the labour market in my sector; my employer's leave policy; family obligation scripts; the housing market here" |
| lands in | `content/board.ts` `CONSTRAINT_STEPS` — a seventh enumerated step (chips, not free text) |
| doctrine check | pass |
| cost | M — gates: extends the S-5 no-score lint (`ALL_READING_STRINGS`) and the board's crisis-gate short-circuit; new gate: "no reading names a structural row as a personal deficit" |
| why worth having | this is the row that locates the constraint **outside the reader**, and the trunk's six steps do not have it. `condition`, `slack`, `wall`, `want`, `conflict`, `resources` are all about the person; a reader whose real binding constraint is an employer's leave policy will be told their state or their buffer is the problem. Realism over simplification: half of what is binding in a real life is not inside the life. |
| trunk dedupe | not in trunk (`content/board.ts` — the row has no counterpart; `/triage` has an unrelated "Something is being demanded of me" branch label) |
| **architect's call** | **Adopt** — A structural step in the pressure reading: six steps all locate the problem inside the reader, and half of what binds a life is outside it. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE2-010 |

#### N-061 · An uncertainty step that separates what cannot be known from what has not been looked up.
| field | |
|---|---|
| kind | instrument |
| source | tgtl-claude-2.0/components/Board.tsx `ROWS[uncertain]` |
| evidence | "What you genuinely cannot know — not just what you have not looked up." |
| lands in | `content/board.ts` `CONSTRAINT_STEPS`, as an enumerated step after `wall` |
| doctrine check | pass |
| cost | M — gates: extends the S-5 no-score lint; new gate: "the uncertainty step never produces a probability, band, or severity" |
| why worth having | the trunk already holds this distinction as an *evidence type* (`content/methodology.ts`: "what you genuinely cannot know — kept separate from what you simply have not looked up") but never offers it to the reader as a move. The `wall` step gets half of it ("I haven't actually checked yet"); the other half — the thing that is genuinely unknowable, which needs holding rather than researching — has nowhere to go. It is the difference between a plan and a bet, and the reader deserves to know which one they are making. |
| trunk dedupe | thinner in trunk (`content/board.ts` `wall.chips.not-checked` covers the researchable half only) |
| **architect's call** | **Adopt** — An uncertainty step that separates what cannot be known from what has not been looked up; the trunk holds the distinction as an evidence type and never offers it as a move. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE2-011 |

#### N-062 · Asking, waiting, and accepting named as moves, on the reading side.
| field | |
|---|---|
| kind | content |
| source | tgtl-claude-2.0/components/Board.tsx `ROWS[could-do]` |
| evidence | "Real available actions, with what each costs. Asking, waiting, and accepting are moves too." |
| lands in | `content/board.ts` `READINGS` bodies; `/guidance` plan list; `/character/board` closing prose |
| doctrine check | pass |
| cost | S — gates: extends the sim's existing always-available-moves assertion (rest / wait / ask) into a reading-layer assertion |
| why worth having | the play layer already guarantees rest, wait and ask in every half-year and tests it across several hundred simulated runs. The reading layer never says it. A person on `/character/board` at 2am — who is not going to play a campaign — is exactly the person who needs to be told that waiting is a move and asking is a strategy rather than a defeat. |
| trunk dedupe | thinner in trunk (guaranteed and tested in `lib/sim`; the sentence does not exist in the reading routes — grep "accepting are moves": zero hits) |
| **architect's call** | **Adopt** — Say on the reading side what the campaign guarantees: asking, waiting and accepting are moves. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE2-012 |

#### N-063 · A "see it all at once" summary of the pressure reading, because that is the thing a life will not let you do from inside it.
| field | |
|---|---|
| kind | instrument |
| source | tgtl-claude-2.0/app/character/board/page.tsx `PageHeader.intro` |
| evidence | "the value is not in any single entry but in seeing all of them at once" |
| lands in | `components/Board.tsx` — a read-only recap panel above the reading, listing every answered step together |
| doctrine check | pass — no composite, no total, no severity aggregate; a list, not a meter |
| cost | M — gates: extends the S-5 no-score lint (the recap must be lint-clean); new gate: "the recap never renders a count, a total, or an ordering by severity" |
| why worth having | the trunk's flow is linear and each step scrolls away; the reader ends holding one named constraint and no picture. 2.0's whole rationale for a *board* — a spatial layout — was that seeing the parts simultaneously is the one operation a person inside a situation cannot perform. Restoring the overview keeps the trunk's enumerated inputs and its single-binding-row output while giving the reader back the thing the board was for. |
| trunk dedupe | not in trunk (`components/Board.tsx` renders steps sequentially and then one `ReadingResult`) |
| **architect's call** | **Adopt** — A read-only recap of every answered step; a list, never a meter, because seeing it all at once is what a life will not let you do from inside it. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE2-013 |

#### N-064 · The wall-or-door procedure: four ordered questions, and the asymmetry of the two ways to get it wrong
| field | |
|---|---|
| kind | mechanic |
| source | gol-opus5/board/pressure-reading.html + codex/constraints.html |
| evidence | "Calling a wall a door produces years of effort, self-blame and exhaustion. Calling a door a wall produces a smaller life, unclaimed entitlements and unattempted exits." |
| lands in | `content/board.ts` (the `wall` step already exists as a chip question) and `/character/board` |
| doctrine check | pass |
| cost | S — gates: extends the board's ordered flow |
| why worth having | the trunk asks whether it is a wall and offers "I've checked" as an option, without telling the reader how to check; four questions with a stop-at-first-clear-answer rule is the missing half |
| trunk dedupe | thinner in trunk (`content/board.ts` line 91–96: a chip with three options; the procedure and the two-sided warning are absent) |
| **architect's call** | **Adopt** — The wall-or-door procedure: four ordered questions and the two-sided warning; the board asks whether it is a wall and never says how to check. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-031 |

#### N-065 · The state-or-horizon fork, checked before anything else
| field | |
|---|---|
| kind | mechanic |
| source | gol-opus5/situations/dont-know-what-i-want.html · screenshot: records/consolidation/opus5/situation-signature-lenses.png |
| evidence | "The tell is usually breadth: a horizon problem is specific ... a state problem is total"; and the interventions are "close to the opposite" |
| lands in | `/triage` and `content/board.ts` (the condition step already runs first — this adds the *why* and the tell) |
| doctrine check | touches a sensitive page → parked where it names depression; the fork itself passes |
| cost | S — gates: extends the board's ordered flow |
| why worth having | the trunk's board asks about condition first and does not tell the reader what turns on the answer; the breadth tell is a cheap, honest discriminator that is not a diagnosis |
| trunk dedupe | thinner in trunk (`content/board.ts` step order encodes it; nothing explains it) |
| **architect's call** | **Adapt** — The state-or-horizon fork's breadth tell explains why the condition step runs first; the depression-naming line parked. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-027 |

#### N-066 · Role conflict split into scheduling conflict vs horizon conflict, with a mechanical diagnostic
| field | |
|---|---|
| kind | mechanic |
| source | gol-opus5/views/roles.html |
| evidence | "Write both roles out. For each, name the horizon it serves in a single sentence with a timescale attached. Then ask whether both sentences could be true of the same life." |
| lands in | `/character/board` (the conflict step exists) and `/guidance` |
| doctrine check | pass — and the prototype grades the underlying claim as the authors' own inference, which must carry over |
| cost | S — gates: extends the board's conflict step |
| why worth having | one is soluble and one is chosen, and treating the second as the first is how a decade goes; the diagnostic is two sentences and a question |
| trunk dedupe | thinner in trunk (`content/board.ts` has a conflict step; it does not distinguish the two kinds) |
| **architect's call** | **Adopt** — Role conflict split into scheduling conflict and horizon conflict, with the two-sentence diagnostic, on the board's conflict step. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-038 |

#### N-067 · The Board as a five-field free-write separation: facts / pressures / constraints / options / next reversible move
| field | |
|---|---|
| kind | instrument |
| source | tgtl-chatgptsol5-6-2.0/app/components/GuidancePage.tsx (`board-tool`) |
| evidence | "Separate what is true from what is pressing."  ·  "Write fragments, not an essay. The Board stays in this page and is not saved."  ·  screenshot: records/consolidation/sol2/guidance-board-fit.png |
| lands in | `components/Board.tsx` / `/character/board` (as a second mode beside the guided reading) |
| doctrine check | pass — page-memory only, nothing stored, nothing in URLs |
| cost | M — gates: extends the local-only gate; new gate: "Board text is never written to storage or a URL" |
| why worth having | the trunk's Board asks the reader to pick from options; this one asks them to write, and the single act of moving a sentence from Pressures to Facts is the whole instrument. |
| trunk dedupe | thinner in trunk — `content/board.ts` is a guided constraint reading with enumerated levels and chips; there is no free-write separation surface. |
| **architect's call** | **Reject** — A free-write board reverses the 3.0 decision that every input is enumerated; that is a doctrine change, not a harvest. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-029 |

#### N-068 · The hardness ladder — constraints rated with reasoning, including a *collectively soft* rating that routes somewhere
| field | |
|---|---|
| kind | instrument |
| source | gol-opus5/codex/constraints.html · screenshot: records/consolidation/opus5/codex-hardness-ladder.png |
| evidence | eight classes; the structural class rated "moderate, collectively soft"; and "a constraint that is absolute for an individual and soft for a movement is two different facts and readers need both" |
| lands in | `/map` (domains × stages already shows windows) and the board's wall step |
| doctrine check | pass — but the prototype's own OS-8 warning applies: the default filing puts disability in the biological class, and any port must lead with the structural entry |
| cost | M — gates: new gate: "no constraint is rated without stating who it is hard for, and every *collectively soft* rating links to where the collective remedy lives" |
| why worth having | it is the mechanism that keeps a guidance site from turning structural facts into personal weather, and the prototype's own changelog (§S6) shows the rating is worthless without the routing |
| trunk dedupe | not in trunk |
| **architect's call** | **Adapt** — The hardness ladder as prose on the wall step: who a constraint is hard for, and where the collective remedy lives; no ratings rendered. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-032 |

#### N-069 · Six lenses over one situation, which disagree — with two of them recommending opposite things
| field | |
|---|---|
| kind | instrument |
| source | gol-opus5/views/lenses.html · screenshot: records/consolidation/opus5/views-lenses.png |
| evidence | each lens has an explicit blind spot — Systems is "blind to agency; makes everything feel like weather", Care is "blind to exit; can make leaving unthinkable when leaving is correct" |
| lands in | `/situations/*` and `/character/board` as an optional reading switcher |
| doctrine check | pass, with the prototype's own guard carried over — the switcher is suppressed entirely on set-down routes, and where one reading is clearly right the page says so |
| cost | L — gates: new gate: "no set-down route renders a lens switcher"; new gate: "every lens states what it is blind to" |
| why worth having | it is the cheapest available lesson in what a model is, and it is the structural refusal to pick — which is the only honest answer where Allocation and Care genuinely disagree |
| trunk dedupe | not in trunk (grep for "lens" in the trunk returns CSS and timeline DOM only) --- |
| **architect's call** | **Park** — Six disagreeing lenses over one situation is a fine teaching device and a large surface; park behind the smaller board rows. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-041 |

#### N-070 · Timescales as a view, with the move-clock / horizon-clock mismatch table
| field | |
|---|---|
| kind | instrument |
| source | gol-opus5/views/timescales.html · also: gol-opus5/views/timescales.html + codex/horizons-cyclical.html |
| evidence | four named mismatches — "Slow move, urgent horizon" reads from inside as "I am doing all the right things and nothing is changing"; "Horizon shorter than the state" reads as "I will deal with this once I get through the week" |
| lands in | `/guidance/daily-plan` (which already has lanes) and `/map` |
| doctrine check | pass |
| cost | M — gates: none new |
| why worth having | "correct move, wrong clock" names the single most common way good advice fails a reader who cannot afford its time-to-effect — and the trunk's Launch Window already has the time-to-effect data to make it real |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — The move-clock versus horizon-clock mismatch table on the daily plan; "correct move, wrong clock" is how good advice fails the reader who cannot afford its time-to-effect. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-035, OPUS5-036 |

#### N-071 · Capacities as prerequisite chains, read downward to the *binding prerequisite* — no levels, no tree
| field | |
|---|---|
| kind | instrument |
| source | gol-opus5/views/capacities.html · screenshot: records/consolidation/opus5/views-capacities.png |
| evidence | "'Just ask for help' is not wrong. It is a four-link chain presented as an instruction, and it fails at whichever link the reader is actually stuck on" |
| lands in | `/guidance` (as the shape of a plan) and `/walkthrough` |
| doctrine check | pass — the page is explicitly built to keep the chains and discard the skill tree, so it does not import progression |
| cost | M — gates: extends the no-scores wall; new gate: "a chain renders no ordinal, no completion state and no ranking between chains" |
| why worth having | it converts self-improvement advice from an instruction into a diagnostic, and the honesty at the end — a chain terminating in *requires an external reading* for someone with nobody to ask leaves them worse off — is the tone the owner wants |
| trunk dedupe | not in trunk |
| **architect's call** | **Adapt** — Capacities as prerequisite chains read down to the binding link, as prose on /guidance; no tree, no levels, no reader position. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-037 |

#### N-072 · Reader disagreement as a recorded, first-class state — "this does not fit" per card and "none of these fit" for the set
| field | |
|---|---|
| kind | safety |
| source | `gol-chatgptsol5-6/app/features/phase-five/GuidanceStudio.tsx` (`.none-fit`, `profile.disagreements`) |
| evidence | "User disagreement changes presentation, not the underlying fixture." |
| lands in | `/character`, `/character/board`, `/guidance`, `/situations` |
| doctrine check | pass — it records nothing about the reader beyond a local rejection flag, which is the right direction of travel |
| cost | S — gates: extends the no-reader-assessment gate; new assertion: "every classifying surface offers a rejection that is honoured in the rendering" |
| why worth having | giving the reader a button that says the site is wrong about them is the cheapest available guard against the site's authority becoming a verdict. |
| trunk dedupe | not in trunk (the board's "something else / not listed" routes *away*; it does not record that a reading was rejected) |
| **architect's call** | **Adopt** — A "this does not fit" rejection honoured in the rendering on every classifying surface; the cheapest guard against authority becoming verdict. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-019 |

#### N-073 · A borderline value on every preference pair, distinct from unknown and from disagreement
| field | |
|---|---|
| kind | presentation |
| source | `gol-chatgptsol5-6/app/features/phase-five/GuidanceStudio.tsx` (MBTI pair selects) |
| evidence | "Borderline / context changes" (option value alongside Unknown, First preference, Second preference, "I disagree with this pair") |
| lands in | any enumerated select on `/character/board` or `/guidance` |
| doctrine check | pass |
| cost | S — gates: extends the enumerated-input gate |
| why worth having | "it depends on the context" is the most common true answer to a question about a person, and most instruments have nowhere to put it. |
| trunk dedupe | not in trunk (the trunk's level selects offer unknown but not borderline) --- |
| **architect's call** | **Adopt** — A "borderline / depends on context" value on every enumerated preference select. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-021 |

#### N-074 · A plain-text copy-out for the decision record and upkeep list, so the long-horizon tool survives the browser.
| field | |
|---|---|
| kind | instrument |
| source | tgtl-claude-2.0/KNOWN_LIMITATIONS.md §"Approximations and honest edges" |
| evidence | "The decision record is most useful years later, exactly the horizon over which browser storage tends not to survive" |
| lands in | `components/Logs.tsx` |
| doctrine check | pass — a client-side copy-to-clipboard or a print stylesheet; nothing leaves the device, nothing enters a URL |
| cost | S — gates: extends gate 9 (local-only: no external resource loads) with a new assertion that the export path performs no network call |
| why worth having | 2.0 named this as the honest cost of the privacy choice and did nothing about it, because doing something looked like breaking local-only. It does not: a "copy this out" button or a print layout keeps every byte on the device and hands the reader a copy that outlives the cache. The trunk still has neither (`components/Logs.tsx` has no export, print, or copy affordance). It is the cheapest way to make the site's most long-horizon instrument actually long-horizon. |
| trunk dedupe | not in trunk --- |
| **architect's call** | **Adopt** — Copy-out or print for the decision record and upkeep list; the most long-horizon instrument lives in the least durable storage, and nothing leaves the device. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE2-014 |

#### N-075 · The quest-alignment audit: "if I weren't already doing this, would I start it today?"
| field | |
|---|---|
| kind | instrument |
| source | `gol-opus4-6/wings/quests/quest-selection.html` |
| evidence | "for each active quest, ask if I weren't already doing this, would I start it today?" |
| lands in | `/character/logs` (beside the upkeep list), `/guidance`, `/character/board` |
| doctrine check | pass — it is a question the reader asks themselves, produces no stored value and no score |
| cost | S — gates: extends the no-reader-assessment wall (the site must not record or evaluate the answer) |
| why worth having | one sentence, no apparatus, and it separates the goals sustained by momentum from the goals sustained by alignment — which is the whole of quest selection compressed into something a depleted reader can actually run |
| trunk dedupe | not in trunk (`/character/logs` records decisions and upkeep without counts; there is no re-examination prompt) |
| **architect's call** | **Adopt** — The quest-alignment question beside the upkeep list: "if I weren't already doing this, would I start it today?" Nothing stored. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-033 |

#### N-076 · Quests that can be paused, revised, completed — or mourned
| field | |
|---|---|
| kind | mechanic |
| source | tgtl-chatgptsol5-6-2.0/app/components/atlas/AtlasJournal.tsx (`QuestJournal`); SIMULATION_CONTENT_AUTHORING.md · also: TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §17 |
| evidence | "Quests can pause, revise, complete or be mourned."  ·  panel eyebrow "COMMITMENTS, NOT A CHECKLIST OF WORTH" |
| lands in | `content/sim/schema.ts` (a commitment status enum), the campaign's standing-commitment surface |
| doctrine check | pass — statuses only, no counts, no completion percentage |
| cost | M — gates: new gate: "no commitment surface renders a count, ratio, or completion figure" |
| why worth having | "mourned" is a status no productivity tool has and every life needs — a commitment you set down on purpose is not an abandoned task. |
| trunk dedupe | thinner in trunk — the trunk has `standingCommitment` terminology and a maintenance ledger, but the status vocabulary does not include a deliberate, dignified ending. |
| **architect's call** | **Adopt** — Commitment statuses including mourned; a commitment set down on purpose is not an abandoned task. No counts. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-017, SPECS-024 |

#### N-077 · Per-task minimum, alternative, and stop condition
| field | |
|---|---|
| kind | instrument |
| source | tgtl-chatgptsol5-6-2.0/app/components/DailyPlanPage.tsx (`Minimum, alternative, and stop condition`) |
| evidence | `<dt>Minimum</dt> … <dt>Alternative</dt> … <dt>Stop or cancel</dt>` |
| lands in | `app/guidance/daily-plan`, and `/character/logs` (the upkeep list) |
| doctrine check | pass |
| cost | S — gates: new gate: "every planned task declares a stop condition" |
| why worth having | a task with a declared stop condition cannot become a stick; a task with a declared minimum survives a bad day intact. |
| trunk dedupe | not in trunk. |
| **architect's call** | **Adopt** — Per-task minimum, alternative and stop condition on the daily plan and upkeep list. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-038 |

#### N-078 · "The blank state is private, not incomplete."
| field | |
|---|---|
| kind | voice |
| source | tgtl-chatgptsol5-6-2.0/app/components/DailyPlanPage.tsx (`empty-plan`) |
| evidence | "The blank state is private, not incomplete." |
| lands in | every local-state surface with an empty state: `/character/logs`, `/guidance/daily-plan`, `/play` |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | an empty state that does not imply the reader has failed to fill it in — the anti-streak sentence. |
| trunk dedupe | not in trunk. --- |
| **architect's call** | **Adopt** — "The blank state is private, not incomplete" on every empty local-state surface; the anti-streak sentence. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-040 |

#### N-079 · The five-optimum ledger: theoretical · feasible · personally acceptable · robust · good-enough
| field | |
|---|---|
| kind | instrument |
| source | `gol-chatgptsol5-6/app/features/phase-five/GuidanceStudio.tsx` (`.optima-ledger`), `content/guidance-fixtures.json` (`recommendations[0]`) + blueprint §8.9 |
| evidence | screenshot: `records/consolidation/sol1/desktop-guidance-plan-standard.png` — "Full-time specialist immersion if constraints are ignored — shown for contrast, not endorsed." |
| lands in | `/guidance` result step, above the plan cards |
| doctrine check | pass |
| cost | M — gates: extends the no-universal-best gate — new assertion: "the theoretical optimum is always rendered as *rejected*, never as an aspiration" |
| why worth having | showing the unconstrained answer and then visibly refusing it is the most honest way to say "your constraints are not a personal failing", and it defuses the reader's suspicion that the site is hiding the real answer. |
| trunk dedupe | not in trunk (`components/Guidance.tsx` goes straight from the disclosure panel to the ranked plan cards; there is no ledger and no theoretical/feasible/acceptable/robust distinction anywhere) |
| **architect's call** | **Adopt** — The five-optimum ledger above the plan cards; showing the unconstrained answer to refuse it says your constraints are not a failing. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-009 |

#### N-080 · A disclosure header stating the objectives, the active constraints, and the ruleset-and-horizon before any ranking
| field | |
|---|---|
| kind | safety |
| source | `gol-chatgptsol5-6/app/features/phase-five/GuidanceStudio.tsx` (`.recommendation-scope`) |
| evidence | "Limited weekly time, limited upfront funds, current income obligation, and no high-debt veto are active." |
| lands in | `/guidance` (`.guidance-disclosure` panel already exists — this replaces its single eyebrow line) |
| doctrine check | pass |
| cost | S — gates: extends the existing guidance disclosure; new assertion: "no ranked output renders without its objective set, its active constraints, and its horizon printed above it" |
| why worth having | it makes the ranking auditable in one glance — the reader can see the answer changed because *they* changed an input, not because the site has an opinion. |
| trunk dedupe | thinner in trunk (the trunk renders a one-line eyebrow, "Illustrative · conditional, parallel options — not a universal best life"; the actual weights and vetoes in force are not echoed back) |
| **architect's call** | **Adopt** — A disclosure header echoing objectives, active constraints and horizon above any ranking. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-010 |

#### N-081 · Nine more fields on the plan card: relative position, outcome range, fit now, sustainability, time to payoff, tail risk, optionality, opportunity costs, patch sensitivity
| field | |
|---|---|
| kind | content |
| source | `gol-chatgptsol5-6/app/types/guidance.ts` (`RankedOption`), `content/guidance-fixtures.json` |
| evidence | "Ranks above Plan B for learning speed, but below the theoretical optimum for immersion and below Plan C for recovery protection." |
| lands in | `content/guidance.ts` `Plan` type + `components/Guidance.tsx` `PlanCard` |
| doctrine check | pass — `outcomeRange` must stay qualitative; the fixture's own value is "[RESEARCH REQUIRED] No numeric outcome estimate" |
| cost | M — gates: extends the no-bare-number gate to the new fields |
| why worth having | "relative position" is the field that does the most work — it says why *this* plan sits above *that* one, which turns a list into an argument the reader can disagree with. |
| trunk dedupe | thinner in trunk (the trunk `Plan` carries rankReason, reorder, benefits, costs, variance, reversibility, pivotTriggers, exitConditions, recovery — good, but no relative position, no opportunity cost, no tail risk, no patch sensitivity, no sustainability, no time-to-payoff) |
| **architect's call** | **Adapt** — Add relative position, opportunity cost, tail risk and patch sensitivity to the plan card; skip time-to-payoff and outcome range, which invite digits. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-011 |

#### N-082 · Each plan names its own failure modes, and selecting a plan re-renders the failure parse for that plan
| field | |
|---|---|
| kind | mechanic |
| source | `gol-chatgptsol5-6/app/features/phase-five/GuidanceStudio.tsx` (`selectedFailures`), `content/guidance-fixtures.json` (`rankedOptions[].failureModeIds`) · also: `gol-chatgptsol5-6/content/guidance-fixtures.json` (`failureModes`), `app/types/guidance.ts` + blueprint §8.7 |
| evidence | screenshot: `records/consolidation/sol1/failure-modes-fit.png` |
| lands in | `/guidance` step 5, `content/guidance.ts` |
| doctrine check | pass |
| cost | M — gates: new gate: "no plan renders without at least one named failure mechanism and at least one recovery route for it" |
| why worth having | it stops the plan cards reading as three flavours of optimism — choosing a plan immediately shows you how that specific plan tends to break, and what the early signs look like. |
| trunk dedupe | not in trunk (the trunk's plan cards carry exit conditions and a recovery sentence, but there is no failure-mode object and nothing links a plan to one) |
| **architect's call** | **Adopt** — Each plan names its failure modes and selecting one re-renders them; plans stop reading as three flavours of optimism. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-012, SOL1-013 |

#### N-083 · A fit profile that keeps seven outcome likelihoods separate and never collapses them
| field | |
|---|---|
| kind | instrument |
| source | `gol-chatgptsol5-6/content/guidance-fixtures.json` (`fitProfiles[0].outcomes`) + blueprint §8.7 · also: tgtl-chatgptsol5-6-2.0/app/components/GuidancePage.tsx (`fitRows`) |
| evidence | "competence: Not inferred from archetype resemblance" / "satisfaction: Must be observed, not predicted" |
| lands in | `/guidance` step 5, `content/methodology.ts` (as a model the site declares) |
| doctrine check | pass — every value in the fixture is a refusal or an unknown, which is the correct shape until sourced |
| cost | M — gates: new gate: "entry, learning, competence, persistence, advancement, satisfaction and sustainable wellbeing are never summed, averaged, or rendered as one verdict" |
| why worth having | it dismantles the commonest bad inference on the whole subject — that being good at something means you will get in, stay, rise, and be happy — by making those seven different questions on the page. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — "Can I do it?" as six or seven separate questions never summed; the commonest bad inference on the subject dismantled on the page. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-014, SOL2-034 |

#### N-084 · "A pivot is a planned response — not proof of a failed person"
| field | |
|---|---|
| kind | voice |
| source | `gol-chatgptsol5-6/app/features/phase-five/GuidanceStudio.tsx` (`.pivot-board`) |
| evidence | "A pivot is a planned response—not proof of a failed person." |
| lands in | `/guidance` pivot strip, `/character/logs`, `/play/campaign` respec copy |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | one sentence that converts the reader's likeliest self-accusation into a mechanic, in the owner's register. |
| trunk dedupe | not in trunk (the trunk's play layer has "A respec isn't starting over — the base stats come with you", which is the game-side cousin; the guidance side has no equivalent line) |
| **architect's call** | **Adopt** — "A pivot is a planned response, not proof of a failed person" on the pivot strip and the logs. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-015 |

#### N-085 · An optional profile intake where unknown, skipped and disputed are first-class values, with a bulk "skip unanswered context" and a "how will these inputs be used?" disclosure
| field | |
|---|---|
| kind | safety |
| source | `gol-chatgptsol5-6/app/features/phase-five/GuidanceStudio.tsx` (step 0), `app/lib/guidance-engine.ts` (`emptyGuidanceProfile`) |
| evidence | "Native archetype resemblance reads selected attributes, skills, values, obligations, and vetoes. … MBTI is explicitly excluded from recommendation logic." |
| lands in | `/guidance` steps 1–3, `/character/board` |
| doctrine check | pass — but every field must stay enumerated (the trunk's board rule) and out of the URL |
| cost | M — gates: extends the local-only-state gate; new assertion: "every intake field accepts unknown and skipped, and the engine's behaviour on 'unknown' is stated on the page" |
| why worth having | telling the reader exactly which of their answers the ranking reads — and which it deliberately ignores — is the difference between a form and an instrument. |
| trunk dedupe | thinner in trunk (the trunk's `/guidance` and `/character/board` both enumerate inputs and both support "unknown", which is good; neither prints what each input is *used for*, and neither has a bulk-skip) --- |
| **architect's call** | **Adapt** — Print what each intake input is used for and add a bulk skip; fields stay enumerated. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-016 |

#### N-086 · Three-layer archetype resemblance — tendency, party role, strategy — with resemblance, confidence, population prevalence and path viability as four separate fields
| field | |
|---|---|
| kind | instrument |
| source | `gol-chatgptsol5-6/content/guidance-fixtures.json` (`archetypeMatches`), `app/features/phase-five/GuidanceStudio.tsx` + blueprint §8.8 · also: `blueprint_ChatGPTSol5-6.md` §SCR-017, rendered in `app/features/phase-five/GuidanceStudio.tsx` (`.signal-grid`) · also: tgtl-claude-4.0/KNOWN_LIMITATIONS.md §3.4 (+ blueprint §12.9) · also: MASTER_PROJECT_BRIEF.md §10 "The categories are not structurally equivalent" (L9856–9866); §10A research gate applies · also: MASTER_PROJECT_BRIEF.md "Anti-horoscope requirements" (L5456–5472) and "MBTI-specific anti-horoscope requirements" (L5435–5455) — both under [RESEARCH REQUIRED] |
| evidence | screenshot: `records/consolidation/sol1/archetype-resemblance-layers.png` — each card carries "Unknown · not researched" as prevalence beside "Not calculated; depends on selected route and ruleset" as viability |
| lands in | new `/character/resemblance` or a step inside `/guidance`; `content/methodology.ts` `WHATS_COMING` names it |
| doctrine check | **needs re-sourcing (numbers)** — the prototype renders bare percentages (88%, 74%, 81%) computed from an authored adjustment table; the trunk's rule is qualitative bands only (`content/guidance.ts` header). Adopt the *four-field separation*, render the resemblance as a band. |
| cost | L — gates: new gate: "resemblance, confidence, prevalence and viability are four fields; no two may be rendered in the same element, and prevalence may never be relabelled resemblance" |
| why worth having | this is the trunk's own top wish-list item, built — and the layering is the part that stops it becoming an identity: a person is a tendency *and* a party role *and* a strategy, and the three disagree. |
| trunk dedupe | not in trunk (`content/methodology.ts` `WHATS_COMING`[0] is exactly this, unbuilt: "with resemblance, prevalence, confidence, and viability kept firmly separate") |
| **architect's call** | **Park** — Archetype resemblance is the trunk's own top wish and sits behind a research gate; the four-field separation and bands-not-digits are the design, the prevalence sources are the blocker. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-017, SOL1-018, CLAUDE4-003, BRIEF-111, BRIEF-150 |

#### N-087 · An optional familiar personality lens that is hideable, rejectable, borderline-supporting, and structurally excluded from the engine
| field | |
|---|---|
| kind | architecture |
| source | `gol-chatgptsol5-6/app/features/phase-five/GuidanceStudio.tsx` (`.mbti-lens`), `app/lib/guidance-engine.ts`, `tests/guidance-models.test.mjs` |
| evidence | "MBTI does not independently create archetype, career, relationship, or route results." |
| lands in | `/character` (as an optional lens) + `tests/` as an exclusion contract |
| doctrine check | **stop-and-ask** on the MBTI vocabulary itself (trademark/licensing is on the prototype's own owner-decision list); the *pattern* — an optional familiar vocabulary that the engine provably never reads — is adoptable on its own. |
| cost | M — gates: **new gate, and a genuinely falsifiable one**: a source-contract test asserting the ranking function's body does not reference the excluded input. Plant-and-restore is trivial: add a read, watch it go red. |
| why worth having | it lets the site meet readers in a vocabulary they already have without letting that vocabulary steer anything — and it can prove the claim rather than assert it. |
| trunk dedupe | not in trunk (no optional-lens concept exists; the exclusion-by-test pattern is close in spirit to `tests/falsify-walls.sh` but is not applied to any input) |
| **architect's call** | **Reject** — A personality-type lens, however inert, is a typing instrument offered to the reader; the exclusion-by-test pattern is kept as N-243. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-020 |

#### N-088 · The no-recommendation state that still hands over three moves
| field | |
|---|---|
| kind | voice |
| source | tgtl-chatgptsol5-6-2.0/app/components/GuidancePage.tsx (incomplete-input state) |
| evidence | "Name the decision in one sentence. Separate a deadline from a feeling of urgency. Choose one fact you can verify without committing." |
| lands in | `app/guidance/page.tsx` (the trunk's existing no-recommendation state) |
| doctrine check | pass |
| cost | S — gates: extends the existing no-recommendation gate |
| why worth having | the trunk already refuses to recommend without enough context; this makes the refusal useful instead of merely honest. |
| trunk dedupe | thinner in trunk — the trunk has a "No recommendation yet — and that is a complete answer" state; Sol adds three concrete moves and a visible ledger of which of the four inputs are still missing. |
| **architect's call** | **Adopt** — The no-recommendation state hands over three moves and shows which inputs are missing; refusal made useful. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-035 |

#### N-089 · "Choose the cheapest question whose answer could change your decision."
| field | |
|---|---|
| kind | voice |
| source | tgtl-chatgptsol5-6-2.0/app/components/GuidancePage.tsx (`NextMove`, "A prudent next move") |
| evidence | "Choose the cheapest question whose answer could change your decision. Ask it before adding more commitment." |
| lands in | `app/guidance/page.tsx`, `/triage` |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | one sentence that is a whole decision method, and it is the sentence the entire site is trying to teach. |
| trunk dedupe | not in trunk. |
| **architect's call** | **Adopt** — "Choose the cheapest question whose answer could change your decision" on /guidance and /triage. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-036 |

#### N-090 · An interactive private daily planner with a hard minute invariant
| field | |
|---|---|
| kind | instrument |
| source | tgtl-chatgptsol5-6-2.0/app/components/DailyPlanPage.tsx; lib/guide-engine.mjs (`buildDailyPlan`, `replanDailyPlan`) · also: tgtl-chatgptsol5-6-2.0/app/components/DailyPlanPage.tsx (`replan`) |
| evidence | "{plan.assignedMinutes} of {plan.availableMinutes} minutes assigned or protected" · "{plan.unallocatedMinutes} minutes remain outside the plan."  ·  screenshot: records/consolidation/sol2/daily-plan.png |
| lands in | `app/guidance/daily-plan/page.tsx` (currently an editorial page about the lanes) |
| doctrine check | pass — the minutes are the reader's own input, not a claim; nothing is stored off-device |
| cost | L — gates: new gate: "primary + maintenance + recovery + buffer never exceed the stated available minutes, across the full 15–480 range" (the invariant is the gate) |
| why worth having | the trunk explains the lanes and the minimum viable day; Sol builds the day, protects maintenance and recovery from inside the same budget, and leaves the unallocated remainder visible so the plan cannot quietly eat the whole evening. |
| trunk dedupe | thinner in trunk — `/guidance/daily-plan` is a static page describing lanes, the minimum viable day and the anti-shame rules. There is no tool. |
| **architect's call** | **Adapt** — An interactive daily planner with the minute invariant; the minutes are the reader's own input, nothing stored beyond the page unless the reader keeps it. The largest guidance row; build after the lanes prose is kept. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-037, SOL2-039 |

#### N-091 · Daily Play named as a mode of its own — the real-world planner, deliberately not randomised and visually distinct from the fiction.
| field | |
|---|---|
| kind | architecture |
| source | TGTL_PLAYABLE_LIFE_SIMULATION_SPEC.md §3.4, §2 |
| evidence | "This is not randomized and should remain visually distinct from fictional simulation." |
| lands in | `/guidance/daily-plan`, `/play` (the door), `content/routes.ts` |
| doctrine check | pass — the visual distinction is the safety-relevant half: nothing about a real day may borrow the sim's presentation, or the fiction starts reading as a claim about the reader |
| cost | S — gates: new gate: *no sim token or sim component class appears on `/guidance/daily-plan`.* |
| why worth having | `WHATS_COMING` already names deeper daily-plan/upkeep integration as wanted. This adds the discipline that must come with it — the closer the two get, the more explicitly they must look different. |
| trunk dedupe | thinner in trunk (`/guidance/daily-plan` exists with lanes and a minimum viable day; it is not on the play door and carries no stated separation rule) --- |
| **architect's call** | **Adopt** — The daily plan must look nothing like the sim; a gate that no sim token appears on it. Free now, expensive later. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-046 |

#### N-092 · Play → daily plan handoff, with the warning that the fiction is not evidence
| field | |
|---|---|
| kind | safety |
| source | tgtl-chatgptsol5-6-2.0/app/components/SimulationUI.tsx (`PlanHandoffLink`); DailyPlanPage.tsx |
| evidence | "Edit it until it names a real, safe, appropriately small action; the simulation is not evidence that you should do it." |
| lands in | `app/guidance/daily-plan`, the parse's real-life bridge |
| doctrine check | pass — the handed value is the parse's generic bridge line, not run-derived (matches S-5) |
| cost | M — gates: extends S-5 (the bridge is keyed to the campaign, never the run); new gate: "the handoff value arrives in the planner as an editable draft carrying the source warning" |
| why worth having | the one place a fictional run can leak into a real decision, closed with an explicit editing step instead of a link. |
| trunk dedupe | not in trunk — the trunk's parse names a generic next step but does not hand it to the daily plan, and `WHATS_COMING` lists the plan/upkeep integration as unbuilt. --- |
| **architect's call** | **Adapt** — Play to daily-plan handoff carrying the generic bridge line as an editable draft with the fiction-is-not-evidence warning. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-024 |

#### N-093 · A "no overall winner" panel closing every comparison, naming what each side actually emphasises
| field | |
|---|---|
| kind | presentation |
| source | `gol-chatgptsol5-6/app/GuidebookPrototype.tsx` (`.comparison-conclusion`) |
| evidence | "Their risks, resource demands, and objective fit differ." (closing the two-archetype comparison) |
| lands in | any comparison surface — `/map/credential-decision`, `/history` tier board, a future archetype compare |
| doctrine check | pass |
| cost | S — gates: extends the no-score gate; new assertion: "a comparison closes with what each side emphasises, never with a winner" |
| why worth having | a comparison that ends without a verdict feels unfinished unless the refusal is itself the closing element; this is the element. |
| trunk dedupe | thinner in trunk (`/map/credential-decision` is careful throughout but does not close on an explicit refusal) |
| **architect's call** | **Adopt** — A "no overall winner" panel closing every comparison, naming what each side emphasises. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-044 |

#### N-094 · Reversibility as a named framework: apply rigour to one-way doors, move fast on two-way doors
| field | |
|---|---|
| kind | mechanic |
| source | `gol-opus4-6/wings/meta/index.html` §Decision-Making + blueprint §2.1 Wing 9 · also: gol-claudefamily/rule-irreversibility.html · also: MASTER_PROJECT_BRIEF.md "Inferred design rule: optionality is a major hidden stat" (L14552–14590) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "One-way doors vs. two-way doors. Apply rigor to irreversible decisions; move fast on reversible ones." |
| lands in | `content/guidance.ts` (the `reversibility` field gets a doctrine to sit under), `/guidance`, `/map/credential-decision` |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | the trunk already computes reversibility per plan; naming the rule turns a field the reader reads into a rule the reader can apply to the next decision the site never sees |
| trunk dedupe | thinner in trunk (`content/guidance.ts` carries a `reversibility` string per plan and `/guidance` shows it. The asymmetric-rigour rule is never stated.) |
| **architect's call** | **Adopt** — Reversibility as a named rule: rigour on one-way doors, speed on two-way; the trunk computes the field and never states the rule. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-029, CF-026, BRIEF-032 |

#### N-095 · Opportunity cost is a decision tool, not a regret tool
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/wings/meta/opportunity-cost.html` |
| evidence | "think hard about opportunity costs before one-way doors. Don't think about them after." |
| lands in | `/guidance` (as a framing on the Plan A/B/C walkthrough), `/topics/money` (exchange rates section) |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | it gives the reader the shutoff valve — once the information window closed, comparing your outcome to a hypothetical is rumination, not analysis — which is a real protection for anyone re-litigating a decision at 3am |
| trunk dedupe | not in trunk (zero occurrences of "opportunity cost") |
| **architect's call** | **Adopt** — Opportunity cost as a decision tool, not a regret tool; the shutoff valve for 3am re-litigation. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-028 |

#### N-096 · Three kinds of stuck, each with a different correct response
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/wings/progression/plateaus.html` · also: `gol-opus4-6/wings/progression/plateaus.html` (trade-off callout) · also: gol-opus5/reflection/narrative-lens.html |
| evidence | "Patience is the right response to a growth plateau and the wrong response to a method plateau" |
| lands in | `/guidance` (a triage question), `/topics/work`, `/character/board` (a reading of a flat period) |
| doctrine check | pass |
| cost | M — gates: none new |
| why worth having | growth plateau (keep going), method plateau (change the method), ceiling plateau (accept or change direction) — the trunk's plateau mentions are all about *whether* progress stalls, never about *which* stall this is, and the responses are opposites |
| trunk dedupe | thinner in trunk ("plateau" appears in `/topics/work` and in sim card copy as a phenomenon; the three-way diagnosis is absent) |
| **architect's call** | **Adopt** — Three kinds of stuck with opposite correct responses; a triage question on /guidance. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-031, OPUS46-032, OPUS5-051 |

#### N-097 · Three kinds of quest failure — and the two opposite errors in reading them
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/wings/quests/quest-failure.html` |
| evidence | "if you can't explain the failure mechanism specifically enough that you'd make a different decision in the same circumstances, the lesson may be noise" |
| lands in | `/situations/job-loss` (the variance doctrine's natural extension), `/character/logs`, `/play/lab` (attribution to decision / draw / position) |
| doctrine check | pass — this is the reading-side twin of the Decision Lab's attribution split, so it must use the trunk's three-way vocabulary (decision / draw / position), not the prototype's two-way (execution / selection / variance) alone |
| cost | M — gates: extends the variance doctrine (G-09) and the Lab's attribution model; new gate: *the failure-kinds page and the Lab name the same causes* |
| why worth having | under-learning ("it was all external") and over-learning ("one failed relationship means all relationships") are the two ways a reader turns a bad outcome into a false rule, and the heuristic above is a usable test for which they are doing |
| trunk dedupe | thinner in trunk (`/play/lab` splits attribution *inside the sim*; `/situations/job-loss` states the variance doctrine for one event. Neither gives the reader a general procedure for reading a failure.) --- |
| **architect's call** | **Adapt** — Three kinds of quest failure and the two reading errors, in the trunk's decision/draw/position vocabulary; the reading-side twin of the Lab. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-035 |

#### N-347 · Quest-specific difficulty is distinct from overall starting difficulty
| field | |
|---|---|
| kind | mechanic |
| source | MASTER_PROJECT_BRIEF.md §4A "Difficulty depends on the quest" (L788–810) · also: MASTER_PROJECT_BRIEF.md §4A "Difficulty changes over time" (L811–824) |
| evidence | "The walkthrough should distinguish overall starting difficulty from quest-specific difficulty." |
| lands in | `/play/lab` (attribution), `/guidance`, `components/Board.tsx` |
| doctrine check | pass |
| cost | M — gates: none new |
| why worth having | it is the cleanest answer to "why does this feel hard when my life looks fine" — the same hand is easy for one aim and hard for another, and saying so beats any tier. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — Two sentences the trunk lacks: the same hand is easy for one aim and hard for another, and difficulty is assigned and dynamic, not an identity; on the board and the arc's act framing. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-010, BRIEF-011 |

#### N-359 · The quest card, and the quest log as a thread across the timeline
| field | |
|---|---|
| kind | instrument |
| source | MASTER_PROJECT_BRIEF.md §7A "Quest card" (L9004–9033), "Quest log across the timeline" (L9362–9378) |
| evidence | "This allows projects and passions to become visible threads across the life timeline." |
| lands in | `content/character.ts` (PRESET), `/character/logs`, `components/timeline/` |
| doctrine check | pass |
| cost | L — gates: extends the logs' no-count rule |
| why worth having | the trunk's character sheet lists a main quest and two side quests as flat strings; a card with exit conditions, opportunity cost and follow-on quests is the difference between a label and a tool. |
| trunk dedupe | thinner in trunk (`content/character.ts` PRESET.mainQuest / sideQuests) |
| **architect's call** | **Adapt** — The quest card's fields (exit conditions, opportunity cost, follow-ons) on the illustrative character sheet; the timeline thread parked. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-027 |

#### N-360 · Six structures for a passion, none presumed superior
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md §7A "Passion should not automatically become work" (L9081–9095) |
| evidence | "No one structure should be presumed superior." |
| lands in | `/guidance` (a Plan set), `/topics/work` |
| doctrine check | pass |
| cost | M — gates: extends the Plan A/B/C authored-alternatives pattern |
| why worth having | "turn your passion into your career" is the loudest piece of advice in the culture, and this is a Plan-shaped answer that neither endorses nor scolds it. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — Six structures for a passion as an authored Plan set on /guidance; the loudest advice in the culture answered without endorsing or scolding. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-029 |

#### N-367 · Exploration versus exploitation, with the conditions that favour each
| field | |
|---|---|
| kind | mechanic |
| source | MASTER_PROJECT_BRIEF.md §6A "Exploration versus exploitation" (L7701–7732) |
| evidence | "This is a strategy question, not a command to maximize productivity." |
| lands in | `/guidance` (plan ranking), `/play/lab` |
| doctrine check | pass |
| cost | M — gates: none new |
| why worth having | it names the real trade behind "should I stay or should I try something" and gives conditions rather than an answer — exactly the trunk's Plan-shaped voice. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — Exploration versus exploitation with the conditions that favour each, on /guidance. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-039 |

#### N-368 · Dominated paths, robust paths, and fragile optima
| field | |
|---|---|
| kind | mechanic |
| source | MASTER_PROJECT_BRIEF.md §6A "Dominated paths" (L7581–7596), "Robust paths and fragile optima" (L7597–7620) · also: MASTER_PROJECT_BRIEF.md §6A "Recommendation tiers" (L7615–7630), "Satisficing and good-enough routes" (L7288–7306) |
| evidence | "performs extremely well under narrow assumptions and poorly when the meta changes" (of a **fragile optimum**; L7601) |
| lands in | `content/guidance.ts` (`Plan.variance`, new `robustness`), `/guidance` |
| doctrine check | pass |
| cost | M — gates: extends the no-hidden-score rule (dominance must show its compared objectives) |
| why worth having | it lets guidance say "this plan is strong only if X holds" without inventing a probability, and the brief's guard — *do not call a person's existing life irrational* — is already written. |
| trunk dedupe | thinner in trunk (`Plan.variance` and `pivotTriggers` exist; dominance and robustness do not) |
| **architect's call** | **Adapt** — A robustness label on plans ("strong only if these hold") and dominance shown against named objectives; no probability, no "irrational". |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-040, BRIEF-043 |

#### N-369 · Read the hand you actually hold, sorted into seven changeability classes
| field | |
|---|---|
| kind | instrument |
| source | MASTER_PROJECT_BRIEF.md §6A "The cards a person holds" (L7322–7392) |
| evidence | "The system must not treat a missing answer as a negative attribute." |
| lands in | `/character/board`, `content/board.ts` |
| doctrine check | pass |
| cost | M — gates: extends the board's enumerated-input rule; no free text |
| why worth having | the board already refuses to rate anyone; sorting the same enumerated inputs into fixed / costly / trainable / temporary / environmental / unknown / *refused* turns a refusal into a reading. |
| trunk dedupe | thinner in trunk (`content/board.ts` walks the binding-constraint check but does not classify inputs by changeability, and has no explicit "refused" class) |
| **architect's call** | **Adapt** — Sort the board's enumerated inputs into changeability classes, including refused; a refusal becomes a reading. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-041 |

#### N-370 · Party-aware optimization — one person's optimum costs someone else
| field | |
|---|---|
| kind | mechanic |
| source | MASTER_PROJECT_BRIEF.md §6A "Party-aware optimization" (L7733–7761) |
| evidence | "One person's optimum may impose costs on others." |
| lands in | `/guidance`, `content/sim/campaign/companions.ts` |
| doctrine check | pass |
| cost | M — gates: none new |
| why worth having | the campaign already gives companions their own decisions; guidance still reasons as if the reader were alone. |
| trunk dedupe | thinner in trunk (companions exist in `/play/campaign`; `/guidance` has no party dimension) |
| **architect's call** | **Adopt** — A "who else pays" line on every plan card; guidance still reasons as if the reader were alone. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-042 |

#### N-371 · Maintenance debt, with the caveat that not every unmet need is neglect
| field | |
|---|---|
| kind | mechanic |
| source | MASTER_PROJECT_BRIEF.md "Inferred design rule: maintenance debt" (L14591–14613) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "not every unmet need is the result of neglect, and people may lack the resources to perform maintenance" |
| lands in | `/character/logs` (upkeep list), `/guidance/daily-plan` |
| doctrine check | pass |
| cost | S — gates: extends the logs' no-count rule |
| why worth having | the trunk has an upkeep list with no counts, which is right; naming the *debt* concept — and the caveat in the same breath — gives it meaning without giving it a score. |
| trunk dedupe | thinner in trunk (`/character/logs` upkeep list exists; the debt model and its caveat do not) |
| **architect's call** | **Adopt** — Maintenance debt named beside the upkeep list with the caveat in the same breath: not every unmet need is neglect. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-044 |

#### N-389 · The life-lesson card — fourteen fields including counterargument and patch date
| field | |
|---|---|
| kind | instrument |
| source | MASTER_PROJECT_BRIEF.md "Life-lesson card" (L1972–2010) · also: MASTER_PROJECT_BRIEF.md "Mentor-source labels" (L1955–1971) · also: MASTER_PROJECT_BRIEF.md "Just-in-time mentorship" (L2011–2033) · also: MASTER_PROJECT_BRIEF.md "What counts as a life lesson" (L1885–1902) · also: MASTER_PROJECT_BRIEF.md "Lessons as inherited equipment" (L2100–2117) · also: MASTER_PROJECT_BRIEF.md "Failure modes of mentorship" (L2136–2149) · also: MASTER_PROJECT_BRIEF.md "Starter lesson domains" (L2063–2099) · also: MASTER_PROJECT_BRIEF.md "Standard and Game Guide presentation" (L2034–2062, mentor subsection) |
| evidence | "Advice without mechanism, boundary conditions, or counterargument should remain a quotation or reflection rather than be promoted as guidance." |
| lands in | a new `content/lessons.ts`, surfaced on `/guidance`, `/topics/*`, `app/timeline/[id]` |
| doctrine check | pass |
| cost | L — gates: new gate: no lesson renders without mechanism, boundary conditions, counterargument and recovery route |
| why worth having | this is the brief's flagship instrument — the fields *are* the safety mechanism, and "why people learn it late" is the field that makes the site feel like a mentor rather than a listicle. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adapt** — The life-lesson card as a bounded first slice: the card shape with mechanism, boundary conditions, counterargument and recovery route, ten lessons authored through a pipeline and placed on existing pages by declared triggers; the full library is a version of its own. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-070, BRIEF-071, BRIEF-069, BRIEF-073, BRIEF-074, BRIEF-075, BRIEF-076, BRIEF-162 |

#### N-390 · Eight named mentor voices, declared as editorial perspectives
| field | |
|---|---|
| kind | voice |
| source | MASTER_PROJECT_BRIEF.md "Mentor voices" (L2034–2062) |
| evidence | "These are editorial perspectives, not fictional authorities who conceal the real sources." |
| lands in | `content/lessons.ts`, `/guidance` |
| doctrine check | pass |
| cost | M — gates: new gate: a voice never appears without the source class it stands for |
| why worth having | The Dissenter and The Survivor let a page hold disagreement inside itself, which is more honest than picking a winner and more useful than saying "it depends". |
| trunk dedupe | not in trunk |
| **architect's call** | **Reject** — Eight named mentor voices are fictional authorities however they are labelled; the source-class label does the honest work without the persona. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-072 |

#### N-391 · The product comparison ladder, ending in the no-purchase option
| field | |
|---|---|
| kind | instrument |
| source | MASTER_PROJECT_BRIEF.md "Comparison ladder" (L11561–11575) [research-gated by the owner] · also: MASTER_PROJECT_BRIEF.md "Personalized loadout advice" (L11605–11626) [research-gated] |
| evidence | "The no-purchase option is essential. The guide should not manufacture consumption when the existing product is adequate." |
| lands in | a new topic or `/guidance` module |
| doctrine check | needs re-sourcing (numbers) — prices and performance are claims; the owner's own research gate applies |
| cost | L — gates: new gate: no endorsement renders without commercial-relationship disclosure and a review date |
| why worth having | an eight-rung ladder that ends at "borrow, repair, or keep what you have" is a genuinely unusual shape for product advice and fits the site's refusal to sell anything. |
| trunk dedupe | not in trunk |
| **architect's call** | **Park** — The product comparison ladder is owner research-gated and commercial; the no-purchase rung is the only part worth quoting now. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-077, BRIEF-079 |

#### N-395 · "Self-measurement error" as a mandatory closing section on every stat page
| field | |
|---|---|
| kind | architecture |
| source | gol-fable5/character/attention.html, /money.html, /energy.html, /reputation.html (+ blueprint Appendix B "Stat") |
| evidence | "the instrument is exact and the interpretation is broken" (Money); "your readout is always rosier than the cache" (Reputation) |
| lands in | `components/CharacterSheet.tsx` + `content/character.ts` (a `misreadAs` field beside `confidence`) |
| doctrine check | pass |
| cost | M — gates: new gate: "every life-stat row carries a self-measurement error note" |
| why worth having | it is the site's honest alternative to a score — instead of telling you your value, it tells you exactly how your own reading of it is wrong, which is the only thing an outside instrument can truthfully offer. |
| trunk dedupe | thinner in trunk (`content/character.ts` carries a `confidence` caveat per stat — "not a measure of worth", "genuinely not entered here" — but no account of the *direction* of the misreading) |
| **architect's call** | **Adopt** — A self-measurement-error note on every life stat: instead of telling you your value it tells you how your own reading of it is wrong; a misreadAs field beside confidence. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-021 |

#### N-399 · The five-layer separation: attributes, skills, conditions, resources, outcomes
| field | |
|---|---|
| kind | architecture |
| source | MASTER_PROJECT_BRIEF.md "Distinguishing attributes from other character information" (L965–985) · also: MASTER_PROJECT_BRIEF.md "Need state versus attribute" (L4563–4575), "Need status" (L4576–4604) |
| evidence | "A mobility impairment is a condition; a wheelchair is equipment; accessible infrastructure is an environmental modifier." |
| lands in | `content/character.ts`, `components/CharacterSheet.tsx` |
| doctrine check | pass |
| cost | S — gates: extends the no-composite gate |
| why worth having | the trunk's `NOT_A_STAT` makes four of these distinctions in prose; making it the sheet's *structure* is what prevents privilege, training and health being blended into one vague impression. |
| trunk dedupe | thinner in trunk (`NOT_A_STAT` in `content/character.ts` — six prose rows, not a structural separation) |
| **architect's call** | **Adopt** — Attributes, skills, conditions, resources and outcomes as the sheet's structure, not six prose rows; and a need state is never an attribute. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-082, BRIEF-094 |

#### N-401 · The eight modifier types — temporary, persistent, trained, equipment, environmental, social, institutional, knowledge, meta
| field | |
|---|---|
| kind | mechanic |
| source | MASTER_PROJECT_BRIEF.md "Modifier types" (L1516–1681) · also: MASTER_PROJECT_BRIEF.md "Modifier direction is contextual" (L1499–1515) · also: MASTER_PROJECT_BRIEF.md "Buff and debuff anatomy" (L2798–2822), "Duration categories" (L2823–2841), "Stacking and interactions" (L2842–2868) · also: MASTER_PROJECT_BRIEF.md "Buffs can create hidden costs" (L2869–2886), "Debuffs can produce adaptations" (L2887–2902) |
| evidence | "A personal build can receive a buff or debuff without changing internally because the meta begins valuing it differently." |
| lands in | `content/character.ts` (PRESET buffs/debuffs), `lib/engine/effects.ts` |
| doctrine check | pass |
| cost | M — gates: none new |
| why worth having | the trunk's buffs and debuffs are two flat lists; typing them is what lets the site say a criminal record is *institutional* and a bad night's sleep is *temporary* — different problems with different exits. |
| trunk dedupe | thinner in trunk (`PRESET.buffs` / `PRESET.debuffs` — untyped strings) |
| **architect's call** | **Adopt** — Type the preset's buffs and debuffs (temporary, persistent, trained, equipment, environmental, social, institutional, knowledge, meta), never with a bare sign, with duration and stacking as prose and the hidden-costs guard. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-084, BRIEF-085, BRIEF-086, BRIEF-087 |

#### N-402 · A modifier log across the timeline — what started, what changed it, what it touched
| field | |
|---|---|
| kind | instrument |
| source | MASTER_PROJECT_BRIEF.md "Modifier log across the timeline" (L2903–2917) |
| evidence | "This makes the current character sheet explainable rather than presenting stat changes without cause." |
| lands in | `/character/logs`, `components/timeline/` |
| doctrine check | pass |
| cost | M — gates: extends the logs' no-count rule |
| why worth having | the trunk's decision record logs choices; a modifier log records what was done *to* the run, which is the half a reader cannot reconstruct alone. |
| trunk dedupe | thinner in trunk (`/character/logs` = decision record + upkeep list) |
| **architect's call** | **Park** — A modifier log across the timeline is a new instrument on a frozen storage doctrine; park behind the logs export. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-088 |

#### N-403 · Every rating declares its reference population
| field | |
|---|---|
| kind | safety |
| source | MASTER_PROJECT_BRIEF.md "Reference populations" (L1335–1352) |
| evidence | "Physical strength rated against same-age and same-sex peers answers a different question from raw strength across all adults." |
| lands in | `content/character.ts`, `content/timeline/schema.ts` (`population`) |
| doctrine check | pass |
| cost | S — gates: extends the existing `population` requirement from milestones to character bands |
| why worth having | the timeline already requires a stated population per record; the character sheet does not, and a band without one is exactly the false precision the sheet exists to avoid. |
| trunk dedupe | thinner in trunk (`Milestone.population` exists; `LifeStat` has no equivalent) |
| **architect's call** | **Adopt** — Every character band declares its reference population, as the timeline already requires per record. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-089 |

#### N-405 · Charisma, Wisdom, Luck and Appearance treated as composites, not attributes
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Composite game stats" (L1257–1303) · also: MASTER_PROJECT_BRIEF.md "Extreme attributes and tradeoffs" (L1436–1450) |
| evidence | "Luck is better modeled as the distribution of random events and outcomes than as a stable personal attribute." |
| lands in | `content/character.ts` (`NOT_A_STAT`), `/walkthrough` |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | the trunk already refuses Luck and Attractiveness as stats; the brief explains *what they decompose into*, which is more useful than a refusal. |
| trunk dedupe | thinner in trunk (`NOT_A_STAT` refuses them; nothing decomposes them) |
| **architect's call** | **Adopt** — Decompose Charisma, Wisdom, Luck and Appearance in NOT_A_STAT instead of only refusing them, and say that more is not always better. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-091, BRIEF-092 |

#### N-407 · Nine criteria mechanics — maximise, threshold, minimum, maintain, avoid, process, completion, balance, lexicographic
| field | |
|---|---|
| kind | mechanic |
| source | MASTER_PROJECT_BRIEF.md "Criteria mechanics" (L3782–3823), "Weighting criteria" (L3824–3857) |
| evidence | "Two people can care about the same domain but use different mechanics. One may maximize money while another only wants enough for security." |
| lands in | `content/play/schema.ts` (`WinWeights`), `/guidance`, `/character` |
| doctrine check | pass |
| cost | M — gates: none new |
| why worth having | the trunk's win weights are all maximise-shaped; threshold and avoidance criteria are how most people actually think, and a weighted average cannot express a non-negotiable minimum. |
| trunk dedupe | thinner in trunk (`WinWeights` = a weight per objective; no mechanic type) |
| **architect's call** | **Adapt** — Threshold, minimum and avoidance as criteria types on the guidance objectives step; the engine's weights untouched. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-095 |

#### N-408 · Whose scorecard is this — intrinsic, extrinsic, internalized, inherited, chosen, performed, conflicted
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Intrinsic and extrinsic criteria" (L3858–3871) |
| evidence | "The guide may help users see whether they are playing toward their own win condition or someone else's." |
| lands in | `/character`, `/guidance` |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | it is the single most useful thing the site could say to a reader who is succeeding and miserable, and it is a taxonomy rather than an assessment. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — Whose scorecard is this: intrinsic, extrinsic, internalised, inherited, chosen, performed, conflicted; a taxonomy for the reader who is succeeding and miserable. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-096 |

#### N-409 · The arrival problem — happiness deferred to the next unlock
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "The arrival problem" (L3950–3968), "Predicted happiness versus experienced happiness" (L3925–3949) |
| evidence | "The walkthrough should show adaptation and moving goalposts without implying that goals are pointless." |
| lands in | `/guidance`, `/topics`, `app/timeline/[id]` (milestone reflection) |
| doctrine check | needs re-sourcing (numbers) if any adaptation figure is quoted |
| cost | M — gates: none new |
| why worth having | the timeline is a list of unlocks; the arrival problem is the honest footnote that list needs, and the brief supplies the guard against nihilism in the same sentence. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — The arrival problem on the objectives step, with the guard against nihilism in the same sentence. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-097 |

#### N-411 · Behaviour versus stated values, with the constraint caveat attached
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Behavior versus stated values" (L4023–4038) |
| evidence | "Behavior does not always reveal true values cleanly because obligation, addiction, constraint, or lack of opportunity may override preference." |
| lands in | `/character/board`, `/guidance/daily-plan` |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | "look at where your time goes" is standard advice that shades into blame; the caveat is what makes it usable by someone with no slack. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — Behaviour versus stated values with the constraint caveat attached; usable by someone with no slack. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-099 |

#### N-426 · The role stack — most people are multiclass, and the sheet should say so
| field | |
|---|---|
| kind | instrument |
| source | MASTER_PROJECT_BRIEF.md "Role stack" (L12320–12357) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "Active roles / Dormant roles / Emerging roles / Former roles / Desired roles / Imposed roles / Conflicting roles / Unrecognized roles" |
| lands in | `components/CharacterSheet.tsx`, `content/character.ts` |
| doctrine check | pass |
| cost | M — gates: none new |
| why worth having | "roles the person refuses" and "unrecognized roles" are two rows no character sheet anywhere carries, and they are where most of a reader's actual load sits. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adapt** — The role stack on the character sheet as content: active, dormant, imposed, refused, unrecognised roles. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-125 |


### D. Topics & the mechanism spine

#### N-110 · A mechanism spine: named rules in six engines, with "no tips without a mechanism" enforced
| field | |
|---|---|
| kind | architecture |
| source | gol-claudefamily/manual.html (+ blueprint §2.1, §5.3) · also: gol-fable5/manual/index.html, /quests/emigrate.html, /manual/reward-loops.html (+ blueprint §5.3b/c) · also: gol-claudefamily/rule-survivorship.html, rule-supply-demand.html, rule-habituation.html, rule-signalling.html, rule-reciprocity.html, rule-windows.html |
| evidence | "Every prescriptive claim anywhere else on the site has to cite a mechanism in here — no tips without a mechanism" |
| lands in | `content/play/mechanics.ts` grown into a mechanism registry; `/topics/*` and `/guidance` cite into it |
| doctrine check | pass |
| cost | L — gates: new gate: "no prescriptive sentence ships without a `mechanicLink`" — a lint over `app/` prose, provable red by planting a bare tip |
| why worth having | it is the structural reason a guide cannot degrade into an advice mill, and the trunk has the anchor component (`MechanicAnchor`) but only seven things to anchor to |
| trunk dedupe | thinner in trunk (seven mechanic cards, each a one-screen door; nine of the 24 rules are partly covered, fifteen are absent) |
| **architect's call** | **Adapt** — Grow the seven mechanic cards into a mechanism registry that topic pages cite; the "no tips without a mechanism" lint follows once the spine exists. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CF-022, FABLE5-041, CF-029 |

#### N-111 · A concept index: one idea, tracked across every system, with what it means in each
| field | |
|---|---|
| kind | architecture |
| source | `gol-opus4-6/concepts/index.html` (10 concepts × 3–4 systems, table) + blueprint §2.2 |
| evidence | "Each concept is a thread you can pull through the system — the same idea viewed through different lenses." |
| lands in | new page under `/topics` (e.g. `/topics/concepts`), fed by a `content/concepts.ts` map; rendered as a table |
| doctrine check | pass |
| cost | M — gates: new gate: *every concept row's per-system gloss links to a route that actually owns that mechanism* (extends G-06, single-home) |
| why worth having | the trunk's search finds pages; this finds the *same mechanism wearing four different names* — compounding in money, in skills, in trust, in the long game — which is exactly the "aha" the game frame is supposed to buy |
| trunk dedupe | not in trunk (`/topics` has search + a flat route list; nothing maps a concept across the four guides) |
| **architect's call** | **Adopt** — A concept index: one idea tracked across the four guides with what it means in each; the only thing that makes four good pages read as one system. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-002 |

#### N-112 · A "trade-off" callout beside every recommendation, as a structural requirement
| field | |
|---|---|
| kind | architecture |
| source | `gol-opus4-6/` — 14 pages carry `.trade-off`; blueprint §5 Failure Mode 2, prevention 4 |
| evidence | "Every piece of advice on the site is accompanied by its trade-off." (blueprint-opus4-6.md §5) |
| lands in | `components/primitives.tsx` (a `TradeOff` callout), used on `/topics/*`, `/guidance`, `/map/credential-decision` |
| doctrine check | pass |
| cost | M — gates: new gate: *no reading page states a recommendation without a trade-off or a recovery route in the same section* — the natural sibling of the existing recovery-beside-every-cost wall |
| why worth having | it is the structural defence against the completionist reading, and it is the same doctrine the trunk already enforces for costs, extended one step to advice |
| trunk dedupe | thinner in trunk (`content/guidance.ts` builds Pareto trade-offs into Plan A/B/C, and `/play` carries costs. The reading pages state costs but have no standing trade-off device.) |
| **architect's call** | **Adopt** — A trade-off callout beside every recommendation on reading pages; the sibling of recovery-beside-every-cost. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-024 |

#### N-113 · Incentives as the most-cited mechanism, with three questions and an explicit non-licence
| field | |
|---|---|
| kind | mechanic |
| source | gol-claudefamily/rule-incentives.html |
| evidence | "What are they measured on? Not what their role is called" · "Treating people as their incentives" (named as what the rule does *not* license) |
| lands in | `content/play/mechanics.ts`, `/topics/work`, a future institutions page |
| doctrine check | pass |
| cost | M — gates: extends the mechanic-card set; new gate: "every mechanism page carries a 'what this does not license' field" |
| why worth having | it converts "they betrayed me" into "the reward structure predicted this" — more accurate and less corrosive — and the guard field stops the same tool becoming contempt for the person at the counter |
| trunk dedupe | not in trunk (grep for "incentive" across `app/` and `content/` returns nothing) |
| **architect's call** | **Adopt** — Incentives as a mechanism with its "what this does not license" field. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CF-023 |

#### N-114 · Reward loops as an engineered adversary, with environment design as the counter to willpower
| field | |
|---|---|
| kind | content |
| source | gol-fable5/manual/reward-loops.html · also: gol-claudefamily/rule-reward-loops.html (+ blueprint §3.6) · also: gol-fable5/manual/reward-loops.html, /guides/tutorial.html, and every page footer |
| evidence | "Against a tuned loop, native willpower is bringing a knife to a server farm." |
| lands in | `/topics/health`; the site's own no-gamification promise cites it (see FABLE5-041) |
| doctrine check | pass — the wanting/liking split and the variable-schedule claim need fetched sources before any specificity survives |
| cost | M — gates: extends the no-unsourced-number gate |
| why worth having | it is the mechanism the trunk's own no-gamification commitment implies but never explains, and it reframes a reader's failure as an engineering mismatch rather than a character verdict. |
| trunk dedupe | not in trunk --- |
| **architect's call** | **Adapt** — Reward loops as an engineered adversary, with the site citing its own refusal to run them; wanting/liking claims only with sources. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-034, CF-024, FABLE5-043 |

#### N-115 · Willpower as environment: relocate the capacity from the character to the arrangement
| field | |
|---|---|
| kind | mechanic |
| source | gol-claudefamily/rule-willpower-environment.html |
| evidence | "reducing the number of times a decision has to be made outperforms trying to win each occurrence of it" |
| lands in | `/guidance/daily-plan` (lanes and the minimum viable day), `/topics/health` |
| doctrine check | needs re-sourcing (numbers) — the page correctly marks ego depletion `[contested]` and replication-poor; any magnitude needs a fetched source |
| cost | M — gates: extends the daily-plan rules; new gate: "the page states that it addresses readers with slack in their arrangements" |
| why worth having | it makes the whole area actionable instead of moralising, and it names its own position dependence — rearranging a kitchen is available, rearranging a shift pattern often is not |
| trunk dedupe | not in trunk |
| **architect's call** | **Adapt** — Willpower as environment, with its stated position dependence; magnitudes only with sources. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CF-025 |

#### N-116 · Reputation as a cache other people hold, not a stat you own
| field | |
|---|---|
| kind | mechanic |
| source | gol-claudefamily/rule-reputation-cache.html, stat-reputation.html, player-crowds.html · also: gol-fable5/character/reputation.html |
| evidence | "Not a stat you hold. A set of copies held by other people, each stale by a different amount." |
| lands in | `/topics/relationships`, `/topics/work` (standing does not leave the building) |
| doctrine check | pass |
| cost | S — gates: extends `/topics/work`'s non-portability section |
| why worth having | one structural idea explains staleness, non-portability, invalidation asymmetry and why an audience is a different object from a network — and it makes "your reputation" checkable instead of anxious |
| trunk dedupe | thinner in trunk (`/topics/work` has the non-portability of credibility; the cache model that generates it is absent) |
| **architect's call** | **Adopt** — Reputation as a cache held on other people's hardware; one model that explains staleness, non-portability and the seniority error. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CF-027, FABLE5-022 |

#### N-117 · Ruin as a separate calculation that all risk content inherits
| field | |
|---|---|
| kind | mechanic |
| source | gol-claudefamily/rule-ruin.html, build-founder.html |
| evidence | "with a fallback, this build is a bet; without one, it is exposure to ruin dressed up as a bet" (source wraps "ruin" in an inline link) |
| lands in | `content/play/mechanics.ts` (`position`), `/map/credential-decision`, `/guidance` |
| doctrine check | pass |
| cost | M — gates: extends the position card and the credential filter; new gate: "any page discussing a gamble states the ruin case and whether it is survivable" |
| why worth having | it is the trunk's own "floor beneath failure" made into a rule with a position clause, so the same sentence stops being advice for the buffered |
| trunk dedupe | thinner in trunk ("ruin tail" is a phrase inside the `position` card and the credential filter; it is not a mechanism with an inheritance rule) |
| **architect's call** | **Adopt** — Ruin as a separate calculation all risk content inherits; the trunk's floor made a rule with a position clause. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CF-028 |

#### N-118 · Habituation, with the never-habituates list as its payload
| field | |
|---|---|
| kind | content |
| source | gol-fable5/manual/habituation.html |
| evidence | "a short list never habituates: chronic pain, loud unpredictable noise, long commutes, loneliness" |
| lands in | `/topics/health` and `/topics/money`; a mechanic candidate for `content/play/mechanics.ts` |
| doctrine check | needs re-sourcing (numbers) — "half-life measured in months" and the never-habituates list are empirical claims requiring fetched sources or removal of the specificity |
| cost | M — gates: extends the no-unsourced-number gate; extends the mechanics index gate |
| why worth having | it converts a moral story about gratitude into a physiological one, and the spending corollary ("shorten the commute before upgrading the car") is the rare piece of money advice that is not about money. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adapt** — Habituation with the never-habituates list; the list and the half-life only with fetched sources, the spending corollary free. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-033 |

#### N-119 · Reciprocity: the ledger that is not supposed to balance
| field | |
|---|---|
| kind | content |
| source | gol-fable5/manual/reciprocity.html |
| evidence | "settlement closes the account, and closing the account is how relationships end. The rule runs on flow, not on settlement." |
| lands in | `/topics/relationships` ("Load, and the untallied ledger" already gestures at this); a mechanic candidate |
| doctrine check | pass — "across every culture yet measured" is a claim to re-source or soften |
| cost | S — gates: extends the no-unsourced-claim gate |
| why worth having | it is the mechanism under both "a good ask strengthens a bond" and "exact fairness is a partnership in receivership" — one rule that pays for two of the trunk's existing assertions and satisfies "no tips without a mechanism". |
| trunk dedupe | thinner in trunk (`/topics/relationships` has an untallied-ledger section; the *why settlement ends relationships* mechanism is not there) |
| **architect's call** | **Adopt** — Reciprocity: the ledger that is not supposed to balance; one mechanism paying for two existing assertions. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-032 |

#### N-120 · Luck surface area, and the narrative/survivor bias that hides it
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/wings/world/randomness.html` |
| evidence | "luck is not distributed randomly across people. It's distributed randomly across opportunities for luck to strike" |
| lands in | `/topics/work`, `/map/launch`, `/methodology` (beside the variance doctrine) |
| doctrine check | pass — the "5% hit rate" figure in the prototype's survivor-bias passage is invented; do not carry the digit |
| cost | M — gates: extends G-09 (variance); new gate: *no illustrative percentage without a source* |
| why worth having | it is the actionable half of the variance doctrine — the trunk explains that a bad draw is not a verdict; this explains how to buy more draws — and the survivor-bias point defuses every "successful person's advice" the reader will meet |
| trunk dedupe | thinner in trunk (the variance doctrine is stated well on `/situations/job-loss` and `/methodology`; "luck surface area" and survivor bias appear nowhere) |
| **architect's call** | **Adapt** — Luck surface area and survivor bias; the actionable half of the variance doctrine. No hit-rate digit. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-036 |

#### N-121 · Loneliness is a signal, not a state — and it is self-reinforcing
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/wings/party/loneliness.html` |
| evidence | "Loneliness is not the same as being alone. Solitude is a state — you are physically by yourself. Loneliness is a signal" |
| lands in | `/topics/relationships` |
| doctrine check | needs re-sourcing (numbers) — Cacioppo's hypervigilance finding and the "comparable to smoking" comparison are both unsourced here; the smoking comparison is a quantitative claim and must be fetched or dropped |
| cost | M — gates: extends T-1; carries Help-now like every relationship page |
| why worth having | the structural framing ("this is a design failure in the social infrastructure, not a personal failure") plus "lower the bar — aim for accumulated low-stakes interactions" is a route back that does not require the reader to already have friends |
| trunk dedupe | not in trunk ("loneliness" appears once, in a sim card's density file; `/topics/relationships` covers trust, repair, care load and asking for help) |
| **architect's call** | **Adapt** — Loneliness as a signal, self-reinforcing, with the structural framing and the low-bar route back; the smoking comparison fetched or dropped. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-038 |

#### N-122 · Conflict styles and the pursue–retreat mismatch
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/wings/party/conflict.html` |
| evidence | "an escalator paired with a withdrawer creates a pursue-retreat cycle that makes both people feel unheard" |
| lands in | `/topics/relationships` (beside the existing repair section) |
| doctrine check | pass — the Gottman four horsemen are named and attributed in the prototype without a citation; they need a source record or must be carried as description without the attribution |
| cost | M — gates: extends T-1 |
| why worth having | the trunk explains repair beautifully and never explains why two people who both want repair keep failing at it; the answer is usually a style mismatch, and it is fixable once named |
| trunk dedupe | thinner in trunk (`/topics/relationships` §"Repair is its own operation" is deeper than the prototype's repair section — that half is already trunk-strength. Conflict *styles*, the productive/destructive split, and the four horsemen are absent.) |
| **architect's call** | **Adapt** — Conflict styles and the pursue-retreat mismatch beside repair; the four horsemen with a source or as description. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-039 |

#### N-123 · Seven party roles and the idea of role coverage
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/wings/party/index.html` §Party Roles + blueprint §2.1 Wing 6 |
| evidence | "Anchor, Catalyst, Mirror, Healer, Scout, Mentor, Mentee. Not fixed assignments but recurring dynamics." |
| lands in | `/topics/relationships`, `/character/board` (a reading of who is around you) |
| doctrine check | pass — roles describe *dynamics*, never people; the page must not become a way to grade the reader's friends |
| cost | M — gates: extends the no-reader-assessment wall; new gate: *the roles page assigns nobody and stores nothing* |
| why worth having | "if nobody's playing Mirror, the party has a blind spot" is a diagnosis a reader can act on — it says what is missing rather than who is failing |
| trunk dedupe | not in trunk (`/character/board` reads pressures and supports; nothing describes what different people do for you) |
| **architect's call** | **Adapt** — Party roles and role coverage as dynamics, never assignments; "if nobody is playing Mirror" is a diagnosis of a gap, not of friends. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-040 |

#### N-124 · Three learning-curve shapes, and why quitting during the slow start is the common error
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/wings/skills/learning-curves.html` |
| evidence | "The danger is quitting during the slow start, mistaking a threshold skill for one that doesn't respond to effort." |
| lands in | `/topics/work`, `/map/credential-decision`, `/guidance` |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | front-loaded, threshold, and step-function curves each set a different expectation, and setting the wrong expectation is what makes people conclude they are bad at something six weeks in |
| trunk dedupe | not in trunk (the trunk covers the training loop — load + recovery = adaptation — on `/topics/health`, which is the physical analogue; the cognitive-skill curve shapes are absent) --- |
| **architect's call** | **Adopt** — Three learning-curve shapes and why quitting in the slow start is the common error. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-041 |

#### N-125 · The passion trap: passion follows mastery more often than it precedes it
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/wings/quests/quest-selection.html` |
| evidence | "curiosity → investment → competence → engagement → passion. Not: passion → investment." |
| lands in | `/topics/work`, `/map/credential-decision` |
| doctrine check | needs re-sourcing (numbers) — "research consistently shows" is a claim with no source in the prototype; carry the reframe, drop the appeal to research unless fetched |
| cost | S — gates: extends T-1 (no assertion of a research finding without an evidence record) |
| why worth having | "what am I curious enough about to invest in before I know whether it'll pay off" is answerable by a 19-year-old; "what are you passionate about" is not, and the second question is what everyone is asked |
| trunk dedupe | not in trunk |
| **architect's call** | **Adapt** — The passion trap: curiosity before passion; carry the reframe, drop "research shows" unless fetched. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-034 |

#### N-126 · The optimisation discontents: Goodhart, the local maximum, satisficing, the hedonic treadmill
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/wings/meta/index.html` §Optimization and Its Discontents (five named stubs) |
| evidence | "When you optimize for a metric, it stops being a good metric. Optimizing for income instead of fulfillment." |
| lands in | `/methodology` (why the site refuses to score), `/topics/work` (the meta section), `/guidance` |
| doctrine check | needs re-sourcing (numbers) — Schwartz on satisficers vs maximizers is named in the prototype without a source; carry the idea without the empirical claim, or fetch and quote |
| cost | M — gates: extends the no-score wall's justification |
| why worth having | Goodhart is the precise, formal statement of why this site has no score — the trunk asserts the conclusion and the reader has to take it on trust |
| trunk dedupe | not in trunk (zero occurrences of "Goodhart", "hedonic", "satisfic", "local maximum") |
| **architect's call** | **Adapt** — Goodhart, the local maximum, satisficing and the treadmill as the formal reasons the site has no score; Schwartz only with a source. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-030 |

#### N-127 · Attention as the stat that cannot be stored, only routed — and the time diary as external instrumentation
| field | |
|---|---|
| kind | content |
| source | gol-fable5/character/attention.html · also: gol-claudefamily/stat-agency-bandwidth.html (+ blueprint §1.2) · also: MASTER_PROJECT_BRIEF.md "Inferred cross-cutting system: time, energy, and attention" (L11868–11941) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "A one-week time diary humiliates nearly everyone who runs it, which is why it works" |
| lands in | `/guidance/daily-plan` and `/character` (state panel explanation) |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | it separates *time* from *attention* — the distinction that explains why a reader with free hours still gets nothing done, and it never asks the reader to log anything on this site. |
| trunk dedupe | not in trunk (the trunk's `execution` stat covers attention as an ability, not as a spendable, unstorable budget) |
| **architect's call** | **Adopt** — Attention as the stat that cannot be stored, only routed; the time diary as external instrumentation the site never asks you to log here. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-023, CF-018, BRIEF-102 |

#### N-128 · Energy: depletion does not read as low energy, it reads as the world having got worse
| field | |
|---|---|
| kind | content |
| source | gol-fable5/character/energy.html |
| evidence | "never audit your life after eleven at night, and before believing any dark conclusion, check the stat first" |
| lands in | `/topics/health` (extending "Energy is the daily readout"), `/guidance/daily-plan` |
| doctrine check | pass — the closing hand-off to depression must route, not diagnose |
| cost | S — gates: none new |
| why worth having | one house rule that costs nothing and prevents a category of self-inflicted damage; it also does the differential honestly ("when the gray does not lift with rest, that is a different page"). |
| trunk dedupe | thinner in trunk (`/topics/health` has energy as a readout; the "drained body experiences a drained world" inversion and the eleven-o'clock rule are absent) |
| **architect's call** | **Adopt** — A drained body experiences a drained world; the eleven-o'clock rule, with the honest hand-off when the grey does not lift. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-024 |

#### N-129 · Skills as a dependency tree, with a named root node, plateaus and decay modes
| field | |
|---|---|
| kind | architecture |
| source | gol-fable5/character/emotional-regulation.html, /asking-for-help.html, /negotiation.html (+ blueprint §2.3) · also: gol-claudefamily/skill-negotiation.html, skill-reading-a-room.html, skill-emotional-regulation.html, skill-cooking.html |
| evidence | "Prerequisites: none — this is a root. Unlocks: asking for help, negotiation, repair" |
| lands in | `content/character.ts` + `/character` (a prerequisite graph, non-interactive floor first) |
| doctrine check | pass — must carry no reader assessment and no progression display about the reader |
| cost | M — gates: new gate: "the skill graph names no reader state and displays no level" |
| why worth having | it answers "where do I even start" with structure rather than a list, and each node's *plateau* section names the false summits — suppression mistaken for regulation, intellectualising, regulating only downward. |
| trunk dedupe | thinner in trunk (`/topics/relationships` has "asking for help is a skill"; there is no dependency structure, no decay account and no plateau list) |
| **architect's call** | **Adapt** — Skills as a dependency graph with a root node, plateaus and decay, as prose; no levels, no reader position. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-025, CF-019 |

#### N-130 · Asking for help: the ask-craft — a specific ask hands over a completable action
| field | |
|---|---|
| kind | content |
| source | gol-fable5/character/asking-for-help.html, /quests/job-search.html |
| evidence | "\"do you know anyone hiring for X\" hands the other player a completable action; \"keep me in mind\" hands them a guilt subscription" |
| lands in | `/topics/relationships`, `/situations/job-loss`, `/guidance` |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | the trunk already says asking is a skill and a normal move; this is the missing *how*, in one sentence a reader can act on before closing the tab. |
| trunk dedupe | thinner in trunk (asking is named as a skill and made a free move in the campaign; the specificity mechanic and the "decays fastest in players whose identity forbids the rep" account are absent) |
| **architect's call** | **Adopt** — The ask-craft: a specific ask hands over a completable action; the missing how beside the trunk's "asking is a skill". |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-026 |

#### N-131 · The Love carve: refusing to give one word one page
| field | |
|---|---|
| kind | architecture |
| source | gol-fable5/lenses/love.html (+ blueprint §4 case 2) · also: gol-claudefamily/condition-in-love.html, event-falling-in-love.html, quest-finding-a-partner.html · also: `blueprint_ChatGPTSol5-6.md` §SCR-016 |
| evidence | "the search is a quest, the falling is an event, the being-in is a condition, and the building is multiplayer" |
| lands in | `/topics/relationships` (as a framing section) + the routes it points at |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | "most bad advice about love comes from applying one kind's rules to another" is a reader-usable diagnostic, and it is the cleanest single demonstration of why the typed carve beats the topic carve. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — The love carve: search, falling, being-in and building are four objects with different rules. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-031, CF-017, SOL1-042 |

#### N-132 · Transition mechanics — six things every transition does, regardless of which one it is
| field | |
|---|---|
| kind | content |
| source | gol-opus5/passages/transition-mechanics.html |
| evidence | "The script goes before the replacement arrives"; "the practical layer finished and the identity layer is still running"; "Exits are not the reverse of entrances" |
| lands in | `/timeline` (as the connective tissue between milestones) or `/guidance` |
| doctrine check | needs re-sourcing (numbers) — the liminality material is an extension from anthropological work on formal rites, flagged as such by the prototype and must be re-sourced or graded as a framing |
| cost | M — gates: none new |
| why worth having | it explains, in one page, several experiences readers currently attribute to themselves — the improvisation tax, the identity lag, other people's slow updating |
| trunk dedupe | not in trunk (the timeline has 24 milestones; nothing says what a transition *is*) |
| **architect's call** | **Adapt** — Transition mechanics: six things every transition does; the liminality material graded as a framing. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-034 |

#### N-133 · Compound situations are not additive — the interference is *targeted*
| field | |
|---|---|
| kind | mechanic |
| source | gol-opus5/passages/compound-passages.html + mechanics/known-breaks.html OS-2 |
| evidence | "Each transition suppresses the specific resources the other needs."; "They are coping with a different and much harder thing, and there is no arrangement of it that looks like coping with one." |
| lands in | `/situations`, `/guidance`, and `content/methodology.ts` `KNOWN_BREAKS` (as an honest new break) |
| doctrine check | pass |
| cost | M — gates: new gate: "where the site describes one transition at a time, it says so" |
| why worth having | it is the common case, it is where the trunk (like the prototype) is weakest, and naming the interference stops a reader diagnosing it as personal failure |
| trunk dedupe | not in trunk (the trunk's known breaks name the collective-subject gap and the destination gap; not this) |
| **architect's call** | **Adopt** — Compound situations interfere rather than add; an honest new known break and a paragraph on /situations. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-033 |

#### N-134 · The commons — the collective register, and why individually sensible responses aggregate badly
| field | |
|---|---|
| kind | content |
| source | gol-opus5/ethics/the-commons.html · also: gol-opus5/ethics/the-commons.html · also: MASTER_PROJECT_BRIEF.md "Shared quests and raids" (L4164–4172) |
| evidence | "Each of these is a wall for a reader and a door for a movement"; the mechanism — "the individually optimal move is usually to arrange a private exception ... each removes one person from the group that would otherwise have pressed" |
| lands in | a route reachable from `/map` and `/history`; closes the trunk's `no-collective-subject` known break with content rather than only an admission |
| doctrine check | pass — the page explicitly refuses to say which causes are worth a reader's time and refuses to present collective action as free |
| cost | M — gates: extends the `no-collective-subject` known break; new gate: "the page names the cost of collective action and who it lands hardest on" |
| why worth having | the trunk already publishes this as its first known break and offers nothing against it; the four mechanical reasons a group can move what a person cannot (numbers, shared test cost, categories, pooled standing) are the counterweight |
| trunk dedupe | thinner in trunk (`KNOWN_BREAKS.no-collective-subject` states the gap; nothing addresses it) |
| **architect's call** | **Adapt** — The commons as a topic page: the four mechanical reasons a group moves what a person cannot, and what collective action costs; answers the trunk's first known break with content. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-046, OPUS5-047, BRIEF-167 |

#### N-135 · Bureaucratic patience as a trainable skill with four moves — and as an unevenly levied tax
| field | |
|---|---|
| kind | content |
| source | gol-claudefamily/skill-bureaucratic-patience.html, quest-probate.html · also: gol-fable5/atlas/border.html, /quests/renew-a-passport.html |
| evidence | "an interaction that is not recorded did not occur" · "this skill is a tax, and it is not levied evenly" |
| lands in | `/topics/` (a fifth topic) or `/guidance`; cited by `/situations/a-death` and `/situations/job-loss` |
| doctrine check | pass |
| cost | M — gates: extends the topics family; new gate: "the page states who the tax falls on before it teaches the moves" |
| why worth having | record / put it in writing / find the clock / address the right level is four moves that transfer across probate, claims, appeals and visas — concretely useful, and the honesty about who pays it keeps it from reading as bootstraps |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — Bureaucratic patience as four trainable moves and an unevenly levied tax; transfers across probate, claims, appeals and visas. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CF-020, FABLE5-011 |

#### N-136 · Reading a room: a trained skill whose pattern library is invalidated at an arena boundary
| field | |
|---|---|
| kind | mechanic |
| source | gol-claudefamily/skill-reading-a-room.html |
| evidence | "the inferences keep firing with full confidence and are now wrong" |
| lands in | `/topics/relationships`, `/topics/work` |
| doctrine check | pass |
| cost | S — gates: extends `/topics/relationships` |
| why worth having | it explains a widely-felt experience — a competent adult becomes socially clumsy after a move or a job change — that is otherwise attributed to personal decline |
| trunk dedupe | not in trunk --- |
| **architect's call** | **Adopt** — Reading a room as a pattern library invalidated at an arena boundary; explains the competent adult who turns clumsy after a move. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CF-021 |

#### N-137 · The School's rules that do not generalise
| field | |
|---|---|
| kind | content |
| source | gol-claudefamily/arena-school.html |
| evidence | "That effort is assessed. It is, here, and almost nowhere afterwards" |
| lands in | `/topics/work`, `/map/credential-decision` |
| doctrine check | pass |
| cost | S — gates: extends `/topics/work` |
| why worth having | recognising that school's rules were local is a correction most adults never explicitly make, and it is the cheapest single fix for the "I was excellent there and I am struggling here" misreading |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — School's rules that do not generalise; the cheapest fix for "I was excellent there and struggle here". |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CF-036 |

#### N-138 · The credential as three things at once — training, licence, signal — mixed in unstated proportions
| field | |
|---|---|
| kind | mechanic |
| source | gol-claudefamily/arena-credential.html |
| evidence | "A missing credential is not a weakness in an application; it is the absence of an application." |
| lands in | `/map/credential-decision`, `/topics/work` |
| doctrine check | needs re-sourcing (numbers) — the relative weight of the signal component is marked `[contested]` in the prototype |
| cost | S — gates: extends the credential fork's framing |
| why worth having | paying for a signal in a field that wanted training is the most expensive error available and is made before anyone can tell you — the trunk's credential fork prices the decision without naming what is being bought |
| trunk dedupe | thinner in trunk (`/topics/work` has credentials-as-access-tokens and inflation; the three-layer split and the binary-gate consequence are absent) |
| **architect's call** | **Adapt** — The credential as training, licence and signal in unstated proportions; the signal-weight claim only with a source. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CF-037 |

#### N-139 · The unwritten-rules section as the payload of every place guide
| field | |
|---|---|
| kind | content |
| source | gol-fable5/atlas/index.html, /atlas/workplace.html |
| evidence | "the org chart is the map the arena publishes, not the map it uses" |
| lands in | `/topics/work` (extending its "unwritten local rules" section) and every arena page from FABLE5-008 |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | natives cannot enumerate the rules they run on autopilot, so this is exactly the knowledge that never gets written down and costs the most to learn slowly. |
| trunk dedupe | thinner in trunk (`/topics/work` has one "unwritten local rules" section; the visible-vs-invisible-work bias, the load-bearing person the org chart undersells, and complaints-travel-as-information-about-the-complainer are absent) |
| **architect's call** | **Adopt** — The unwritten-rules payload: the org chart is the map the arena publishes, not the map it uses; extends /topics/work now, every arena page later. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-009 |

#### N-140 · The marked lens switch: the same institution as *place* and as *counterparty*, and the page says when it switches
| field | |
|---|---|
| kind | architecture |
| source | gol-fable5/atlas/hospital.html, /guild/institutions.html (+ blueprint §1.2 primitive 9) |
| evidence | "the hospital as place of care is this Arena; the hospital as billing adversary is a Player, with institutional incentives" |
| lands in | `/topics/health`, `/topics/work`, and any arena page |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | it names the moment a reader's relationship to a system changes without warning — the single most useful orientation move on a hospital, a landlord, or an employer. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — The marked lens switch: the same institution as place and as counterparty, and the page says when it switches. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-012 |

#### N-141 · A human social tutorial: skill tree, context lens, a poorly-calibrated / better-calibrated pair, and a five-part annotation stack
| field | |
|---|---|
| kind | content |
| source | `gol-chatgptsol5-6/app/features/phase-five/SocialTutorial.tsx`, `content/guidance-fixtures.json` (`socialScenarios`, `socialSkills`) + blueprint §SCR-020, §8.11 · also: `gol-chatgptsol5-6/app/features/phase-five/SocialTutorial.tsx` (`.social-separation`, `.safety-override`) + blueprint §8.11 · also: `gol-chatgptsol5-6/app/features/phase-five/SocialTutorial.tsx` (`.neurodiversity-note`) · also: MASTER_PROJECT_BRIEF.md "Social interaction manual" → "Common unwritten social contracts" (L2257–2311), "The interaction-context model" (L2238–2256) · also: MASTER_PROJECT_BRIEF.md "Miscalibrated and calibrated interaction contrasts" (L2312–2335) · also: MASTER_PROJECT_BRIEF.md "Dialogue breakdown format" (L2336–2352) · also: MASTER_PROJECT_BRIEF.md "Core social skill tree" (L2354–2452), "Etiquette curriculum" (L2453–2488), "Social calibration practice loop" (L2489–2508) · also: MASTER_PROJECT_BRIEF.md "Neurodiversity, disability, and masking" (L2592–2622) · also: MASTER_PROJECT_BRIEF.md "Online social interaction" (L2592–2645) · also: MASTER_PROJECT_BRIEF.md "Failure modes of the social tutorial" (L2705–2731) · also: MASTER_PROJECT_BRIEF.md "Power, hierarchy, and coercion" (L2574–2591) |
| evidence | screenshot: `records/consolidation/sol1/social-tutorial-scenario.png` — "Possible interpretations are hypotheses, not access to another person's mind." |
| lands in | `/topics/relationships` deep page, or a new `/topics/social` |
| doctrine check | pass |
| cost | L — gates: new gate: "no scenario asserts what another person is thinking; every interpretation is rendered as a hypothesis with a variation note" |
| why worth having | observable behaviour → possible interpretation → hidden expectation → likely consequence → repair is a genuinely teachable sequence, and the trunk currently has one paragraph where this has a curriculum. |
| trunk dedupe | thinner in trunk (`/topics/relationships` has "Repair is its own operation" and "Trust is slow to build and fast to spend" — good prose, one screen; there is no scenario, no annotation, no skill structure) |
| **architect's call** | **Park** — A social tutorial is a whole content area the owner brainstormed at length; park behind the master-brief row and decide the area once. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-022, SOL1-023, SOL1-024, BRIEF-128, BRIEF-129, BRIEF-130, BRIEF-131, BRIEF-132, BRIEF-133, BRIEF-155, BRIEF-156 |

#### N-142 · A nutrition guide built as a research gate: nutrient card schema, a supplement review card, and a calorie/weight-centric opt-out that defaults on
| field | |
|---|---|
| kind | content |
| source | `gol-chatgptsol5-6/app/features/phase-five/NutritionGuide.tsx`, `content/guidance-fixtures.json` (`nutrients`, `supplements`) + blueprint §SCR-021, §8.12 · also: `gol-chatgptsol5-6/app/features/phase-five/NutritionGuide.tsx` (`.food-reality-grid`) · also: MASTER_PROJECT_BRIEF.md "Nutrition, food groups, micronutrients, and supplements" (L10897–11449) — carries the owner's "[RESEARCH REQUIRED BEFORE FEATURE IMPLEMENTATION]" block |
| evidence | screenshot: `records/consolidation/sol1/nutrition-nutrient-card.png` — "Weight, appearance, health, performance, and human worth remain separate." |
| lands in | `/topics/health` deep page |
| doctrine check | **parked pending clinical review** for any nutrient or supplement *content*; the **structure** (card schema, the blocked states, the opt-out) is adoptable now and is what makes the eventual content safe. |
| cost | L — gates: new gate: "no nutrient, dose, interaction or symptom-to-diagnosis claim renders without a recorded clinical review; the blocked state is the shipping state" |
| why worth having | the opt-out defaulting to *on* — energy-balance material collapsed until asked for — is a piece of eating-disorder-aware design most health writing never attempts, and the supplement card's nine fields are a template that makes an unreviewed claim structurally impossible to render. |
| trunk dedupe | not in trunk (the trunk has no nutrition content; `/topics/health` covers prevention, energy and two engines) |
| **architect's call** | **Park** — Nutrition is clinical-review territory by definition; the card schema and the default-on calorie opt-out are the design, parked with it. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-025, SOL1-026, BRIEF-116 |

#### N-143 · A role atlas: the seven-role stack, and a role card whose pay, prestige, power, scarcity, visibility and criticality are six independent measures
| field | |
|---|---|
| kind | content |
| source | `gol-chatgptsol5-6/app/features/phase-five/RoleAtlas.tsx`, `content/guidance-fixtures.json` (`socialRoles`, `roleStack`) + blueprint §SCR-022, §8.13 · also: `gol-chatgptsol5-6/app/features/phase-five/RoleAtlas.tsx` (`.dependency-map`) · also: MASTER_PROJECT_BRIEF.md "Criticality, power, prestige, and compensation are different" (L12830–12861) [Provisional — ChatGPT 5.6 Sol contribution] · also: MASTER_PROJECT_BRIEF.md "Dependency map of society" (L12862–12876), "Role-removal stress test" (L12877–12900) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | screenshot: `records/consolidation/sol1/role-card-measures.png` — "Function may be critical even when unpaid" (`role-care-coordinator.measures.criticality`) |
| lands in | new `/topics/roles`, or a deep page under `/topics/work` |
| doctrine check | pass |
| cost | L — gates: new gate: "criticality is never inferred from pay or prestige; the six measures are separate fields and no composite is rendered" |
| why worth having | it makes care, maintenance, coordination and logistics legible as *functions the society runs on* without romanticising the overload — and "authority: often less than the responsibility carried" is the truest line in the fixture. |
| trunk dedupe | not in trunk (`/topics/relationships` has "Load, and the untallied ledger", which is the same insight at one-paragraph scale and about a household rather than a society) |
| **architect's call** | **Park** — A role atlas with six independent measures is a real content area; park with the master-brief roles row and decide once. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-027, SOL1-028, BRIEF-126, BRIEF-127 |

#### N-144 · The digital realm as a zone of the world map with its own physics
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/wings/world/digital-realm.html` · also: gol-fable5/atlas/internet.html · also: gol-claudefamily/arena-internet.html · also: MASTER_PROJECT_BRIEF.md "Inferred cross-cutting system: technology, media, and digital life" (L14087–14143) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "You compare your unedited reality with everyone else's highlight reel, and the comparison is systematically unfair." |
| lands in | new section on `/history` (a patch, alongside industrialization) or `/map`; the attention-economy half belongs in `/topics/health` |
| doctrine check | needs re-sourcing (numbers) — "the effect on well-being is measurable and consistent across studies" is an unsourced empirical claim; carry the mechanism, fetch or drop the finding |
| cost | L — gates: extends T-1; the model-breaks note here ("the map is being redrawn while you walk on it") should land as a `ModelBreak` per OPUS46-021 |
| why worth having | `/history` currently owns industrialization as *the* patch; the trunk's own wish list asks for more eras to the same standard, and this is the era the reader is standing in |
| trunk dedupe | not in trunk ("digital" appears only in `content/roadmap.json`; `/history` covers the industrialization patch and a tier board) |
| **architect's call** | **Adapt** — The digital realm as the arena the reader stands in: the attention-economy half on /topics/health, the comparison half on relationships; findings only with sources. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-037, FABLE5-013, CF-038, BRIEF-119 |

#### N-348 · Stacked difficulty: compounding chains, protective buffers, bottlenecks, threshold effects
| field | |
|---|---|
| kind | mechanic |
| source | MASTER_PROJECT_BRIEF.md §4A "Stacked difficulty and interaction effects" (L763–787) |
| evidence | "Poverty → weaker healthcare access → untreated condition → school interruption → narrower work options → continued poverty" |
| lands in | `lib/engine/effects.ts`, `/walkthrough` (mechanics with pictures) |
| doctrine check | pass |
| cost | M — gates: extends the mechanic-picture gate (each named interaction needs its diagram) |
| why worth having | it explains compounding with a chain a reader can follow in one breath, and the brief supplies the mirror-image advantage chain so it never reads as fatalism. |
| trunk dedupe | thinner in trunk (the compounding curve exists in the parse; the *named* interaction types — independent, correlated, compounding, buffering, bottleneck, threshold, contextual, unknown — do not) |
| **architect's call** | **Adapt** — Name the interaction types (compounding, buffering, bottleneck, threshold) as a mechanic card with its picture on the walkthrough; the engine is unchanged. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-012 |

#### N-363 · Life currencies, and the honest note that they are not fully fungible
| field | |
|---|---|
| kind | architecture |
| source | MASTER_PROJECT_BRIEF.md "Inferred unifying model: life currencies" (L14408–14444) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "Money can buy time but not recover all lost time." |
| lands in | `/walkthrough` (mechanics), `lib/sim/economy.ts`, `/topics/money` |
| doctrine check | pass |
| cost | M — gates: none new |
| why worth having | eighteen named currencies with explicit non-fungibility is the cleanest defence the site has against reducing everything to money or time. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adapt** — Currencies are not fungible as a walkthrough mechanic using the trunk's existing resource list, not eighteen new ones. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-033 |

#### N-393 · A normative wing kept structurally separate from the descriptive one, and allowed to overrule it
| field | |
|---|---|
| kind | architecture |
| source | gol-opus5/ethics/index.html · also: gol-opus5/ethics/plural-traditions.html + ethics/obligation.html · also: gol-opus5/ethics/hard-moral-cases.html · also: gol-fable5/debug/rulebook-disputes.html (+ blueprint §2.8, D4, §4 case 7) · also: MASTER_PROJECT_BRIEF.md "Moral decision analysis" (L14174–14191) [Provisional — ChatGPT 5.6 Sol contribution] · also: MASTER_PROJECT_BRIEF.md "Inferred cross-cutting system: worldview, morality, religion, and meaning" (L14144–14191) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "the easiest way to make a value judgement look like a finding is to put it in a reference entry"; and the asymmetry — "when the descriptive layer and the normative one conflict on a question of what is owed, the normative one wins" |
| lands in | a new wing off `/` (the entrance has six doors) + `content/routes.ts` |
| doctrine check | pass — set-down register throughout, no game vocabulary (gate 2), no Play or Timeline nav entry |
| cost | L — gates: extends gate 2; new gate: "no descriptive route asserts a normative claim without routing to the wing" |
| why worth having | the trunk is entirely descriptive, which means its values are distributed invisibly through it; a wing is how they become inspectable and rejectable |
| trunk dedupe | not in trunk (grep "ethic" across `app/` returns one hit, in `/topics/relationships`) |
| **architect's call** | **Park** — An ethics and meaning wing is a whole content area with no trunk home; right in principle (values distributed invisibly through a descriptive site), a version's worth of work, and it needs the owner's area decision. The anti-instrumentalisation rule ships separately (N-269). |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-042, OPUS5-044, OPUS5-045, FABLE5-046, BRIEF-081, BRIEF-120 |

#### N-398 · The health strategy card — absolute risk beside relative, and when professional care is right
| field | |
|---|---|
| kind | instrument |
| source | MASTER_PROJECT_BRIEF.md "Health strategy cards" (L10880–10896) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "Baseline risk / Absolute risk / Modifiable and non-modifiable factors / Time horizon / Prevention / Screening benefit and harm" |
| lands in | `/topics/health` |
| doctrine check | needs re-sourcing (numbers); touches a sensitive page → parked wherever it approaches mental health |
| cost | M — gates: extends T-1; new gate: no risk figure renders without its absolute form |
| why worth having | "screening benefit *and harm*" is the field almost no consumer health page carries, and it is the one that respects the reader's judgement. |
| trunk dedupe | not in trunk |
| **architect's call** | **Park** — A health strategy card with absolute beside relative risk is clinical-review territory; parked with the health gate. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-080 |

#### N-400 · The effective-stat stack — base, development, training, equipment, social, condition, environment
| field | |
|---|---|
| kind | instrument |
| source | MASTER_PROJECT_BRIEF.md "Effective-stat display" (L2918–2933), "Attribute ratings" (L1304–1334) |
| evidence | "high base intelligence may not produce strong academic performance under sleep deprivation, depression, unsafe housing, and weak schooling" |
| lands in | `components/CharacterSheet.tsx`, `/walkthrough` (mechanics with pictures) |
| doctrine check | pass |
| cost | M — gates: extends the no-number rule (the stack renders as bands, never digits) |
| why worth having | the trunk's stats carry a band and a caveat; the stack shows *why* the band is what it is, which is the entire argument against reading a low band as a person. |
| trunk dedupe | thinner in trunk (`LifeStat.band` + `.confidence` — the composition is asserted, not shown) |
| **architect's call** | **Adapt** — The effective-stat stack as a walkthrough picture in bands: base, development, training, equipment, social, condition, environment. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-083 |

#### N-406 · A needs system that is not a staircase, with the pyramid caveat printed
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Maslow's hierarchy and the needs system" (L4360–4562) |
| evidence | "The iconic pyramid is useful shorthand, but Maslow did not create that diagram." |
| lands in | a new `/character` panel or `/topics` page; `content/character.ts` |
| doctrine check | needs re-sourcing (numbers) — the historiographic claim about the pyramid must itself be sourced |
| cost | L — gates: none new |
| why worth having | Maslow is the single most recognisable frame the reader already carries, and the brief's version corrects it (permeable, revisitable, not morally ranked) instead of repeating it — with a Gaming translation table already written. |
| trunk dedupe | not in trunk |
| **architect's call** | **Park** — A needs system with the pyramid caveat is a large page whose historiographic claim itself needs a source; parked. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-093 |

#### N-412 · A multidimensional wellbeing profile that never becomes a reader score
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Net Pleasure is not the whole of happiness" (L3089–3137), "A multidimensional wellbeing dashboard" (L3138–3161), "Hidden stat and self-report" (L3218–3238) |
| evidence | "External observers cannot reliably infer it from: Income / Marriage / Children / Career / Appearance / Education / Social media / Awards" |
| lands in | `/topics` (a wellbeing page), `/methodology` |
| doctrine check | changes a lint → stop-and-ask — the headline "Net Pleasure" stat and any self-report intake collide with *no reader assessment*; the **profile as explanatory content** is safe, the **measured stat** is not |
| cost | M — gates: new gate: no wellbeing dimension is ever collected from or scored for the reader |
| why worth having | the nine-way distinction (pleasure, affect, satisfaction, meaning, fulfilment, psychological richness, contentment, morale, suffering burden) is genuinely clarifying content; only the instrumentation is forbidden. Fable should take the content and drop the stat. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adapt** — The nine-way wellbeing distinction as explanatory content; the Net Pleasure stat and any intake are rejected on the no-reader-assessment wall. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-100 |

#### N-413 · Fifteen time-use categories, including unstructured time
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Proposed time-use categories" (L11885–11902) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "Sleep / Personal care / Work / Education / Commuting / Domestic labor / Caregiving / Relationships / Parenting" |
| lands in | `/guidance/daily-plan`, `/topics` |
| doctrine check | needs re-sourcing (numbers) — any time-use figure must be fetched (ATUS or equivalent) |
| cost | M — gates: extends T-1 |
| why worth having | it is the vocabulary that makes domestic labour and caregiving visible as *time*, which is the whole argument of the housing and caregiving material. |
| trunk dedupe | not in trunk --- |
| **architect's call** | **Park** — Time-use categories need fetched figures to be more than a list; parked. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-103 |

#### N-414 · Money as a resource economy — stats, mechanics, stages, and four hard distinctions
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Inferred cross-cutting system: money and the resource economy" (L11742–11819) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "Debt used for investment from debt used for survival" |
| lands in | `/topics/money` |
| doctrine check | needs re-sourcing (numbers) |
| cost | M — gates: extends T-1 |
| why worth having | income≠wealth, wealth≠liquidity, high salary≠security, risk capacity≠risk tolerance are four distinctions that do more for a reader than any figure, and the trunk's money topic makes none of them structurally. |
| trunk dedupe | thinner in trunk (`/topics/money`) |
| **architect's call** | **Adopt** — Four money distinctions on /topics/money: income is not wealth, wealth is not liquidity, salary is not security, risk capacity is not risk tolerance. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-104 |

#### N-415 · Housing, home and domestic life — including who performs the invisible maintenance
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Inferred cross-cutting system: housing, home, and domestic life" (L11820–11867) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "The guide should track who performs this labor and how it affects career, relationships, health" |
| lands in | a new `/topics/housing`; `content/routes.ts` |
| doctrine check | needs re-sourcing (numbers) |
| cost | L — gates: extends the route-inventory gate |
| why worth having | housing is simultaneously shelter, cost, asset, location, school access and mobility constraint — the brief's eleven-way framing is the reason it deserves its own page rather than a paragraph in money. |
| trunk dedupe | not in trunk (no housing topic; homelessness and multigenerational households appear nowhere) |
| **architect's call** | **Park** — A housing topic is a new area; the owner decides the topic set once. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-105 |

#### N-416 · Education as four dimensions — field, altitude, institution, connections
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md §8 "Core dimensions" (L9430–9494); confirmed in §15 decision log 2026-08-09 · also: MASTER_PROJECT_BRIEF.md §8 "Outcome domains" (L9495–9536) · also: MASTER_PROJECT_BRIEF.md §8 "Statistical interpretation" (L9564–9580) |
| evidence | "Education should be represented as a multidimensional path rather than a single ladder from “less” to “more.”" |
| lands in | a new `/topics/education`; `/map/credential-decision` |
| doctrine check | needs re-sourcing (numbers) |
| cost | L — gates: extends the route-inventory gate |
| why worth having | this is confirmed owner direction from the first decision-log entry, and the trunk implements only a slice of it (one credential decision page). "Connections and social capital" as a *fourth dimension of the degree* is the part nobody else says out loud. |
| trunk dedupe | thinner in trunk (`/map/credential-decision` handles one decision; there is no education topic and no field/institution dimension) |
| **architect's call** | **Adapt** — Education as four dimensions (field, altitude, institution, connections) with its outcome domains and six selection readings, as a section of /topics/work or a page beside the credential decision; confirmed owner direction from the first decision-log entry. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-106, BRIEF-107, BRIEF-108 |

#### N-418 · Relationships and the party system — types, a profile that is never one score, and mechanics
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Inferred cross-cutting system: relationships and the party system" (L10654–10810) [Provisional — ChatGPT 5.6 Sol contribution; named Research Priority 2] · also: MASTER_PROJECT_BRIEF.md "Party composition" (L10730–10751) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "No single relationship score should replace the profile." |
| lands in | `/topics/relationships`, `content/sim/campaign/companions.ts` |
| doctrine check | pass |
| cost | L — gates: extends the no-composite gate to relationships |
| why worth having | the brief's core correction is that a relationship is not a milestone ("married at X") but a system with formation, maintenance, conflict, repair and dissolution — and the trunk's timeline currently represents relationships almost entirely as milestones. |
| trunk dedupe | thinner in trunk (`/topics/relationships`; `COMPANION_ARCS` in the campaign) |
| **architect's call** | **Adapt** — Relationships as a system with formation, maintenance, conflict, repair and dissolution as the page's spine, and party quality over party size. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-112, BRIEF-113 |

#### N-420 · Health as a continuous system, not a set of isolated debuffs
| field | |
|---|---|
| kind | architecture |
| source | MASTER_PROJECT_BRIEF.md "Inferred cross-cutting system: physical and mental health" (L10811–10879) [Provisional — ChatGPT 5.6 Sol contribution; named Research Priority 4] |
| evidence | "Health should be a continuous system rather than a collection of isolated debuffs." |
| lands in | `/topics/health`, `content/timeline/` (`body-health` lane) |
| doctrine check | touches a sensitive page → parked for the mental-health campaign; the physical-health profile and mechanics are buildable |
| cost | L — gates: extends `content/exclusions.ts` |
| why worth having | prevention, screening, relapse, rehabilitation, accommodation and functional adaptation are stages the reader will actually pass through; the trunk treats health as a stat and a topic page. |
| trunk dedupe | thinner in trunk (`/topics/health`; `body-health` lane on the timeline) |
| **architect's call** | **Adapt** — Health as stages the reader passes through (prevention, screening, relapse, rehabilitation, accommodation) on /topics/health; the mental-health campaign parked. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-115 |

#### N-421 · Sexuality, intimacy and reproduction, with restrained language required
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Inferred cross-cutting system: sexuality, intimacy, and reproduction" (L11450–11487) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "Gaming language should be restrained around consent, violence, medical risk, and trauma." |
| lands in | `/topics/relationships`, `/topics/health` |
| doctrine check | touches a sensitive page → parked (reproductive coercion and sexual violence route to `/situations/being-hurt`, which is byte-identical) |
| cost | L — gates: extends `content/exclusions.ts`; new gate: no Game Guide vocabulary in this area |
| why worth having | the brief's own restraint rule is the reason this can be covered at all; the buildable part (contraception, fertility, aging and sexuality, asexuality, celibacy) is large and entirely absent. |
| trunk dedupe | not in trunk |
| **architect's call** | **Park** — Sexuality, intimacy and reproduction is a large absent area whose edges are the being-hurt page; an owner area decision. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-117 |

#### N-422 · Civic, legal and institutional life — formal rules *and* unequal enforcement
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Inferred cross-cutting system: civic, legal, and institutional life" (L14039–14086) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "The guide should explain both formal rules and unequal enforcement." |
| lands in | a new `/topics/civic`; `civic-legal` timeline lane |
| doctrine check | needs re-sourcing (numbers) |
| cost | L — gates: extends the route-inventory gate |
| why worth having | the timeline's second-largest lane is `civic-legal` (19 records) with no topic page behind it, and "server rules / permissions / restricted zones / enforcement" is a Game Guide translation that actually earns its keep. |
| trunk dedupe | thinner in trunk (`civic-legal` lane exists; no topic page) |
| **architect's call** | **Park** — A civic and legal topic behind the timeline's second-largest lane is the strongest new-topic candidate; parked for the owner's topic-set decision. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-118 |

#### N-423 · Leisure, play, art, and the defence of unproductive value
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Inferred cross-cutting system: leisure, play, art, and unproductive value" (L14192–14232) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "The guide should protect the category of activity that is valuable because it is enjoyed, not because it optimizes another stat." |
| lands in | a new `/topics/leisure`, `/guidance/daily-plan` |
| doctrine check | pass |
| cost | M — gates: new gate: no leisure item is justified by a downstream benefit |
| why worth having | a site full of strategy needs one page that refuses strategy, and the daily plan's lanes currently have no home for idleness, daydreaming or fandom. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adapt** — A short page for leisure, play and practices that refuses strategy, protected from payoff lines; the daily plan gets a lane for it. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-121 |

#### N-424 · Place, movement and migration as a live system, not a setting chosen once
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Inferred cross-cutting system: place, movement, and migration" (L14369–14407) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "The guide should show the cost of leaving one network to access another opportunity." |
| lands in | a new `/topics/place`, `/map` |
| doctrine check | needs re-sourcing (numbers) |
| cost | L — gates: extends the route-inventory gate |
| why worth having | relocation is one of the most common large decisions a reader faces and the trunk models geography only as the campaign's fixed setting. |
| trunk dedupe | not in trunk |
| **architect's call** | **Park** — Place and migration as a topic; the fable5 emigrate quest is the donor if built; an area decision. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-123 |

#### N-425 · Identity and social position, with reputation made audience-specific
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Inferred cross-cutting system: identity and social position" (L12219–12291) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "There is no single universal reputation score." |
| lands in | a new `/topics/identity`, `/character` |
| doctrine check | pass |
| cost | M — gates: extends the no-composite gate |
| why worth having | nine-way identity states (assigned, inherited, discovered, chosen, performed, contested, concealed, changed, imposed) is a vocabulary readers lack, and audience-specific reputation kills the leaderboard instinct at the root. |
| trunk dedupe | not in trunk |
| **architect's call** | **Park** — Identity states as a topic; parked with the area decisions. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-124 |

#### N-427 · Body composition, grooming, fashion and books as worked modifier examples
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Body composition and weight" (L1682–1720), "Makeup, grooming, and presentation" (L1721–1742), "Fashion and clothing" (L1743–1764), "Books and consumed ideas" (L1765–1799) |
| evidence | "“Gained weight equals strength debuff” is therefore a possible outcome pattern, not a universal rule." |
| lands in | `/walkthrough` (mechanics with pictures), `/topics/health` |
| doctrine check | needs re-sourcing (numbers); the weight material touches body-image sensitivity → handle with the sensitive-tone grading |
| cost | M — gates: extends T-1 |
| why worth having | four worked examples of "the same modifier buffs one thing and debuffs another" — and the books entry ends with the rule that the guide may not label a book good or bad because the editors agree with it, which is a real editorial commitment. |
| trunk dedupe | not in trunk --- |
| **architect's call** | **Park** — Body composition, grooming, fashion and books as modifier examples touch body-image sensitivity and need sources; parked. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-134 |


### E. Map, atlas & position

#### N-150 · Set your position once, and let every page that has position notes re-resolve.
| field | |
|---|---|
| kind | mechanic |
| source | tgtl-claude-2.0/KNOWN_LIMITATIONS.md §"Deferred by design" · also: gol-opus5/views/positions.html (+ blueprint amendment A3) |
| evidence | "A site-wide “set your position once” control is deferred (recorded in DECISIONS.md and the corrections register)." |
| lands in | `lib/guide-context.tsx` (promote `STORAGE_KEYS.credentialPosition` to shared state); consumers: `/map/launch`, `/topics/work`, `/topics/money`, `/situations/job-loss`, `/guidance` |
| doctrine check | pass — position is enumerated (floor / backing / obligations), stored locally, never in a URL, never scored, never aggregated |
| cost | M — gates: extends gate 9 (nothing in URLs) and the S-5 no-score lint; new gate: "position selection never produces a rank, band, or comparison between readers" |
| why worth having | the machinery already exists and already persists — `components/CredentialFilter.tsx` writes `STORAGE_KEYS.credentialPosition` to `localStorage` and re-resolves its cost notes from it. Exactly one page reads it. Everywhere else, position sensitivity is written-in prose the reader has to apply to themselves. Promoting one existing key to shared state turns the site's single best mechanic — the same move costing differently from a different start — from a demo on one page into how the guide speaks everywhere. Two years of the roadmap were spent proving the mechanic; this is the step that ships it. |
| trunk dedupe | thinner in trunk (`components/CredentialFilter.tsx` only; `content/methodology.ts` still records the site-wide version as unbuilt) |
| **architect's call** | **Adopt** — Set your position once: the key already persists and one page reads it; promoting it to shared state ships the site's best mechanic everywhere. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE2-015, OPUS5-039 |

#### N-151 · Two required per-page fields: *position sensitivity* and *where this model fails*
| field | |
|---|---|
| kind | architecture |
| source | gol-opus5/atrium/how-to-read.html + commons/editorial-standards.html (+ blueprint §2.5b) |
| evidence | "A page that omits this is writing for a default person who does not exist, and the default person is how merit ideology gets into a reference work." |
| lands in | `components/primitives.tsx` (a `RequiredFields` block) + a lint over `app/**/page.tsx` |
| doctrine check | pass — three documented exemption classes must be listed, not assumed; the five byte-identical pages are exempt by definition |
| cost | L — gates: new gate: "every reader route except the named exemptions renders both fields, and neither says only that the model is a simplification" |
| why worth having | the trunk carries position notes as prose on two pages and a filter on one; making it a field is what stops the default reader creeping back in |
| trunk dedupe | thinner in trunk (`cor-position-filter` in the corrections register already records this as a knowing simplification; "where this model fails" has no per-page existence at all — grep returns nothing) --- |
| **architect's call** | **Adapt** — Position sensitivity and where-this-fails as per-page fields on reading routes, with the exemption list stated; the five frozen pages exempt by definition. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-017 |

#### N-152 · Named position profiles, including two that tell the reader which pages to skip
| field | |
|---|---|
| kind | content |
| source | gol-opus5/views/position-no-slack.html, views/position-undocumented.html, views/positions.html · also: gol-opus5/commons/index.html + views/positions.html + evidence/what-we-dont-know.html |
| evidence | "Reading GoL with no slack — what most of this site gets wrong about you, and which pages to skip"; and the site's list of positions it "describes badly", named "because naming is cheaper than pretending" |
| lands in | `/situations` or `/map`, and `/methodology` for the known-badly list |
| doctrine check | pass; the undocumented profile leads with a legal boundary, which must be preserved |
| cost | M — gates: extends OPUS5-012's boundary gate |
| why worth having | a reference work that tells a reader which of its own pages are wrong for them is doing something no competitor does, and it costs nothing but nerve |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — Named position profiles that tell the reader which pages to skip, and the list of positions the site describes badly. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-040, OPUS5-058 |

#### N-153 · The legibility section: what a system can see, what being seen costs, what being illegible costs
| field | |
|---|---|
| kind | instrument |
| source | every `arena-*.html`; sharpest in arena-border.html, arena-financial.html, arena-credential.html (+ blueprint §2.2 [O5 import]) |
| evidence | "The system is not sceptical of these things; it has no field for them." (arena-border.html) · "having no record is treated worse than having a moderate one" (arena-financial.html) |
| lands in | `components/primitives.tsx` as a repeatable block; `/map`, `/topics/work` (which already has one paragraph of it) |
| doctrine check | pass |
| cost | M — gates: new gate: "every arena page names what the system cannot see" |
| why worth having | it is the site's most under-described kind of hardship — being refused for lack of record rather than lack of money — and it explains outcomes that income alone does not, which is the honest version of position sensitivity |
| trunk dedupe | thinner in trunk (`/topics/work` has one legibility paragraph about glue work; the four-part structure and its application to housing, credit, border, school and healthcare are absent) |
| **architect's call** | **Adopt** — The legibility block: what a system can see, what being seen costs, what being illegible costs; position sensitivity that actually renders. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CF-031 |

#### N-154 · The Atlas: places as a content type, each with a fixed six-part anatomy
| field | |
|---|---|
| kind | architecture |
| source | gol-fable5/atlas/index.html + all five arena pages (+ blueprint §2.2) · also: gol-claudefamily/atlas.html + the fourteen `arena-*.html` pages; anatomy line quoted from arena-healthcare.html (+ blueprint §2.2) · also: gol-claudefamily/arena-healthcare.html, arena-legal.html · also: gol-claudefamily/arena-civic.html · also: gol-claudefamily/arena-family.html, player-siblings.html |
| evidence | "local rules (written and unwritten) → local currencies → inhabitants → hazards and traps → characteristic quests and events → entry, exit, and standing" — screenshot: records/consolidation/fable5/arena-anatomy-workplace.png |
| lands in | a new content dir `content/arenas/` + routes under `/map/…`, linked from `/topics` and `/situations` |
| doctrine check | pass |
| cost | L — gates: extends the route-inventory gate; new gate: "every arena page fills all six anatomy sections or declares the section empty" |
| why worth having | the trunk's map is age × domain — it tells you *when*, never *where*. Arena pages are the missing "you are inside a system with its own rules, and here they are" layer, and they are the wing no self-help site builds. |
| trunk dedupe | not in trunk (`/map`, `/map/launch`, `/map/credential-decision` are all time-and-position instruments; no place-based guides) |
| **architect's call** | **Adapt** — The Atlas as a content area: places with a fixed anatomy; start with three arenas the trunk already leans on (workplace, healthcare, the border) and grow only to the same standard. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-008, CF-030, CF-033, CF-034, CF-035 |

#### N-155 · A branch graph with typed edges that splits from a stage and reconnects at a named convergence node
| field | |
|---|---|
| kind | mechanic |
| source | `gol-chatgptsol5-6/app/GuidebookPrototype.tsx` (`.branch-map`), `content/fixtures.json` (`branches[].reconnect`) · also: tgtl-chatgptsol5-6-2.0/content/roadmap.json (`branches`), rendered in app/components/MapPages.tsx · also: `blueprint_ChatGPTSol5-6.md` §8.5 · also: MASTER_PROJECT_BRIEF.md §12A.4 "Branch-map grammar" (L10065–10079) · also: MASTER_PROJECT_BRIEF.md §7 "A network rather than a strict tree" (L8829–8841) |
| evidence | screenshot: `records/consolidation/sol1/branch-map-recovery.png` — "Routes may merge, reopen, or continue in parallel." |
| lands in | `/map` (extending the single `branch-credential-decision` deep-link in `content/roadmap.ts`) |
| doctrine check | pass |
| cost | L — gates: new gate: "a recovery route is a first-class node beside choice, gate and circumstance — never a footnote on one" |
| why worth having | seeing four differently-typed routes leave one stage and rejoin at a sustainable base is the single clearest picture of "a pause is not an ending" the whole prototype produces. |
| trunk dedupe | thinner in trunk (the live map carries exactly one branch, as a link; the typed-branch fixture in `content/roadmap.json` is only consumed by `_scaffold_reference/`, so it ships nowhere) |
| **architect's call** | **Adapt** — A typed branch graph on the map that splits and reconnects at a named node; the fixture exists and ships nowhere. Recovery route is a first-class node. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-005, SOL2-025, SOL1-007, BRIEF-053, BRIEF-054 |

#### N-156 · The six-panel consequence card: reward · timing advantage · tradeoff · delay consequence · risk and variance · prerequisites
| field | |
|---|---|
| kind | content |
| source | `gol-chatgptsol5-6/app/GuidebookPrototype.tsx` (`.outcome-grid`) + blueprint §SCR-007, §15 "Consequence cards" · also: MASTER_PROJECT_BRIEF.md §12A.5 "Consequence-and-reward card" (L10080–10096) |
| evidence | "Delay consequence … Some cohorts or funding paths may change; later entry can bring clarity and experience" (`content/fixtures.json`, `branch-training-choice`) |
| lands in | `/map/credential-decision`, `/situations/job-loss`, `/guidance` plan cards |
| doctrine check | pass |
| cost | M — gates: extends the recovery-beside-every-cost gate (the card's alternates and recovery rows are compulsory fields, testable) |
| why worth having | the "delay consequence" panel is the one most sites omit, and separating it from "tradeoff" is what stops a late start reading as a closed door. |
| trunk dedupe | not in trunk (no page in the trunk renders this field set; `grep` for "delay consequence" / "timing advantage" / "prerequisites" over `app/`, `components/`, `content/` returns nothing outside `_scaffold_reference`) |
| **architect's call** | **Adopt** — The six-panel consequence card with the delay-consequence panel on the credential page and the plan cards. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-006, BRIEF-158 |

#### N-157 · A route-state glyph vocabulary with a printed legend on the domain tracks
| field | |
|---|---|
| kind | presentation |
| source | `gol-chatgptsol5-6/app/GuidebookPrototype.tsx` (`.map-legend`) + blueprint §9.4 |
| evidence | screenshot: `records/consolidation/sol1/desktop-roadmap-standard.png` |
| lands in | `components/Roadmap.tsx` domain tracks, `app/globals.css` |
| doctrine check | pass |
| cost | M — gates: extends the "colour is never the only carrier" assertion — every glyph has a text label in the legend |
| why worth having | the trunk's parallel tracks are currently featureless bars; a gate mark, a reopened-route curve and a dotted uncertain stretch make the claim "a life is not one ladder" visible instead of stated. |
| trunk dedupe | thinner in trunk (`components/Roadmap.tsx` renders `.domain-track-fill` as a plain offset bar with a prose note; there are no gates, no reopenings, no uncertainty, and no legend) |
| **architect's call** | **Adapt** — A route-state glyph vocabulary with a printed legend on the domain tracks; colour never the only carrier. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-004 |

#### N-158 · A continuous age marker that drives stage selection ("you are here" on the spine)
| field | |
|---|---|
| kind | instrument |
| source | `gol-chatgptsol5-6/app/GuidebookPrototype.tsx` (`.age-spine`, `updateAge`) |
| evidence | screenshot: `records/consolidation/sol1/desktop-roadmap-standard.png` |
| lands in | `components/Roadmap.tsx` / `/map` |
| doctrine check | **stop-and-ask** — the trunk's map deliberately carries no ages on its cards ("The bands are navigation conventions and claim nothing", `content/roadmap.ts`), and `KNOWN_BREAKS.windows-read-as-schedule` names exactly this risk. Adopting it moves an age control onto a surface that currently refuses ages. |
| cost | M — gates: would need a new plant-and-restore probe that the marker never renders an age *ahead of* or *behind* a reader |
| why worth having | it lets someone find their own place on the map in one gesture instead of reading eight cards to work out which is theirs. |
| trunk dedupe | thinner in trunk (the timeline has ages and the map has stages; nothing joins them with a single continuous control) --- |
| **architect's call** | **Reject** — An age marker on the map puts an age control on the one surface built to refuse ages; the timeline already carries the age view. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-008 |

#### N-159 · A world-context selector that shows what is planned rather than pretending to global coverage
| field | |
|---|---|
| kind | architecture |
| source | `gol-chatgptsol5-6/app/GuidebookPrototype.tsx` (context bar / `.world-selector`) + blueprint §SCR-003 · also: MASTER_PROJECT_BRIEF.md §4B "Core game and expansions" (L5691–5720) |
| evidence | "Unavailable content is visibly marked as planned, not broken." (`blueprint_ChatGPTSol5-6.md`, SCR-003) |
| lands in | `components/SiteChrome.tsx` breadcrumb + `/map`, backed by a small `content/context.ts` |
| doctrine check | pass |
| cost | S — gates: new gate: "every geography/era named on the site is either available or labelled planned; no third state" |
| why worth having | the reader learns the scope is one country on purpose, not by omission, and the honest limit reads as a design choice instead of a missing feature. |
| trunk dedupe | thinner in trunk (`content/roadmap.ts` `CONTEXT_BREADCRUMB` is a fixed inert string "United States · reference 2025 · illustrative"; there is no control, no planned-state, and no statement that continents are containers rather than cultures) |
| **architect's call** | **Adapt** — Make the context breadcrumb say the scope is one country on purpose and name what is planned; a sentence, not a selector. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-001, BRIEF-004 |

#### N-160 · Either source the map's sex lens or state its null result harder.
| field | |
|---|---|
| kind | safety |
| source | tgtl-claude-2.0/KNOWN_LIMITATIONS.md §"Approximations"; components/Roadmap.tsx `SexLens` |
| evidence | "Roadmap sex lens is structural only. It changes no claims" |
| lands in | `components/Roadmap.tsx` `.roadmap-lens-note`; or `content/methodology.ts` `WHATS_COMING` |
| doctrine check | needs re-sourcing (numbers) — any real sex-linked window needs its own fetched source per T-1 |
| cost | S — gates: new gate: "the lens control produces byte-identical stage content across all three settings, or every difference cites a source" |
| why worth having | a three-way control that changes nothing is a promise the interface makes and the content does not keep. A reader will click Female, see identical text, and conclude the guide has nothing to say — or worse, that it checked and found nothing. Two honest exits: fetch the sources and make the lens real, or say plainly in the note that this is a placeholder for research not yet done. The trunk currently does the softer version of the second ("This lens changes no claims"), which does not tell the reader whether that is a finding or an absence. |
| trunk dedupe | thinner in trunk (`components/Roadmap.tsx` carries the note; the ambiguity between "no difference found" and "not yet researched" is unresolved) --- |
| **architect's call** | **Adopt** — Say plainly whether the map's sex lens is a null finding or unresearched; the honest note is the fix until a source arrives. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE2-016 |

#### N-161 · Builds: the one page type allowed to be opinionated, with failure modes and "who runs it well"
| field | |
|---|---|
| kind | architecture |
| source | gol-fable5/character/index.html, /character/fire.html, /craftsman.html, /sobriety.html (+ blueprint §2.3, §5.3c) · also: gol-claudefamily/quest-board.html, quest-difficult-conversation.html, quest-probate.html (+ blueprint §2.4) |
| evidence | "a build never claims to be the way to play, only a way, with its trade-offs stated" |
| lands in | `/guidance` (Plan A/B/C already thinks this way) + a new content dir |
| doctrine check | pass — no worth-score, no ranking between builds; prescription quarantined to this type |
| cost | L — gates: new gate: "prescriptive voice appears only on build routes and quest strategy sections" |
| why worth having | it gives the site a legitimate place to be useful and opinionated without the advice leaking into the reference layer — the structural answer to the self-help pull. |
| trunk dedupe | thinner in trunk (`/guidance` walks Plan A/B/C for one decision and has a genuine no-recommendation state; there are no lived-configuration pages, and no template that forces a sacrifices/failure-modes column) |
| **architect's call** | **Park** — Builds as the one opinionated page type is a fine idea and a large one; park with archetypes and the master brief's preset builds, decide the area once. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-029, CF-039 |

#### N-364 · The nine core gameplay loops
| field | |
|---|---|
| kind | architecture |
| source | MASTER_PROJECT_BRIEF.md "Inferred unifying model: core gameplay loops" (L14445–14488) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "A balanced or satisfying life may require several loops; no one loop should automatically dominate." |
| lands in | `/walkthrough`, `/map` (domain tracks) |
| doctrine check | pass |
| cost | M — gates: none new |
| why worth having | the trunk's seven map domains are *areas*; the nine loops are *verbs*, and the recovery, care-and-transfer and legacy loops have no home in the current domain set. |
| trunk dedupe | thinner in trunk (`content/roadmap.ts` DOMAINS — seven, area-shaped) |
| **architect's call** | **Park** — Nine gameplay loops compete with the seven map domains for the same conceptual slot; an IA change to decide, not to harvest. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-034 |

#### N-374 · Launch, build-establishment, midgame, late game — four stage modules with named systems
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md §14A stage modules (L10461–10620) [Provisional — ChatGPT 5.6 Sol contribution] · also: MASTER_PROJECT_BRIEF.md §14A "Proposed stage module: late game and retirement" (L10582–10620) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "Midlife should not be reduced to a crisis. It is also a period of competence, influence, integration, and strategic redirection." |
| lands in | `content/roadmap.ts` stage cards, `/map/launch` |
| doctrine check | pass |
| cost | L — gates: none new |
| why worth having | the trunk has `/map/launch` alone; midlife in particular is currently an empty bridge, and the brief's "respec cost increases / time remaining becomes a visible resource" is a whole page's worth of true things. |
| trunk dedupe | thinner in trunk (`/map/launch` only; stage cards for the other three carry a paragraph each) |
| **architect's call** | **Adapt** — Deepen the map's stage cards into short real pages, midlife first: respec cost rising, time remaining as a visible resource; then later life's nine transitions including forced and by necessity. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-058, BRIEF-059 |


### F. Timeline

#### N-372 · The ten recovery-route questions every strategic page must answer
| field | |
|---|---|
| kind | architecture |
| source | MASTER_PROJECT_BRIEF.md "Inferred design rule: the guide needs recovery routes" (L14614–14632) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "What if I missed the window? / What if I cannot do this? / What if I do not want this?" |
| lands in | `content/timeline/schema.ts` (`TimingAnalysis`), `/guidance`, `/map` |
| doctrine check | pass |
| cost | M — gates: extends T-4 (recovery beside every cost) into a ten-question checklist |
| why worth having | T-4 already forces a route beside a cost; this list names *which* readers are being answered, and "what if I do not want this" is the one the trunk answers least. |
| trunk dedupe | thinner in trunk (`TimingAnalysis` covers early/window/late/interrupted/alternative/never — no "cannot", "do not want", "party will not support", "nearest viable alternative") --- |
| **architect's call** | **Adapt** — Extend the timeline's branch set with "what if I cannot" and "what if I do not want this"; through the pipeline, T-4 grows a clause. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-045 |

#### N-373 · The nineteen-panel stage page template, delivered by progressive disclosure
| field | |
|---|---|
| kind | architecture |
| source | MASTER_PROJECT_BRIEF.md "Inferred page template: what every age or stage should show" (L14489–14535) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "The visible interface should use progressive disclosure rather than display all nineteen panels at once." |
| lands in | `app/timeline/[id]`, `content/roadmap.ts` stage cards |
| doctrine check | pass |
| cost | L — gates: extends the route-inventory gate; each panel needs its own empty state |
| why worth having | it is the single most reusable artifact in the brief — one contract that makes every stage page comparable, and the owner already wrote the anti-overload rule into it. |
| trunk dedupe | thinner in trunk (24 generated milestone pages carry a subset; there is no stage-page contract) |
| **architect's call** | **Park** — A nineteen-panel stage template presumes stage pages the trunk does not have; park behind the stage-card deepening (N-374). |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-046 |

#### N-375 · The milestone strategy card (eighteen fields, incl. "people for whom it is not applicable")
| field | |
|---|---|
| kind | instrument |
| source | MASTER_PROJECT_BRIEF.md §6 "Milestone strategy card" (L6210–6235) |
| evidence | "People for whom it is not applicable" |
| lands in | `content/timeline/schema.ts`, `app/timeline/[id]` |
| doctrine check | needs re-sourcing (numbers) |
| cost | M — gates: extends T-1 and T-4 |
| why worth having | the trunk's milestone records are strong on sourcing and timing but silent on prerequisites, compounding, and — most importantly — who this milestone simply does not apply to. |
| trunk dedupe | thinner in trunk (`Milestone` + `TimingAnalysis`; no prerequisites, compounding class, or not-applicable field) |
| **architect's call** | **Adapt** — Prerequisites and "people for whom it is not applicable" as milestone fields, through the pipeline. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-047 |

#### N-376 · Peer advantage must declare its comparison population and its horizon
| field | |
|---|---|
| kind | safety |
| source | MASTER_PROJECT_BRIEF.md §6 "Peer advantage" (L6114–6130) |
| evidence | "Peer advantage should not become a global human leaderboard. It is always domain-specific." |
| lands in | `content/timeline/normative-lint.ts`, `app/timeline/[id]` |
| doctrine check | changes a lint → stop-and-ask (it would *add* a lint rule, not relax one) |
| cost | S — gates: new gate: the words "ahead"/"behind" cannot render without a named comparison population |
| why worth having | it is a lint rule the trunk is already morally committed to and has not written down. |
| trunk dedupe | not in trunk |
| **architect's call** | **Park** — "Ahead" and "behind" require a named comparison population: a lint the trunk is morally committed to and has not written; adding a rule to the normative lint is stop-and-ask, so parked for the owner's word. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-048 |

#### N-377 · Classify every timing effect: compounding, persistent, temporary, fading, reversible, irreversible, unknown
| field | |
|---|---|
| kind | mechanic |
| source | MASTER_PROJECT_BRIEF.md §6 "Compounding effects" (L6131–6155) |
| evidence | "Irreversible: cannot be restored once the window closes" |
| lands in | `content/timeline/schema.ts` (`Branch`), the compiler |
| doctrine check | pass |
| cost | M — gates: extends T-4 — an `irreversible` classification demands an explicit alternative route |
| why worth having | it turns "being late costs you" into a checkable claim with a shape, and "unknown" is an allowed answer. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adapt** — Classify timing effects (compounding, persistent, fading, reversible, irreversible, unknown) on branches; irreversible demands an alternative route. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-049 |

#### N-378 · Consequence chains and unlock dependencies, drawn
| field | |
|---|---|
| kind | presentation |
| source | MASTER_PROJECT_BRIEF.md §6 "Consequence chains and unlock dependencies" (L6156–6175) |
| evidence | "Skill or credential → available opportunity → income or network → housing or family option → later-life outcome" |
| lands in | `components/timeline/`, `/walkthrough` (mechanics with pictures) |
| doctrine check | pass |
| cost | M — gates: extends the mechanic-picture gate |
| why worth having | the trunk shows milestones as points on a spine; the reason a milestone matters is almost always what it *unlocks*, and that is a picture, not a paragraph. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adapt** — Draw the consequence chain on milestone pages from the affectsLater field that already exists. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-050 |

#### N-379 · Say plainly when catch-up is expensive, partial, or impossible
| field | |
|---|---|
| kind | voice |
| source | MASTER_PROJECT_BRIEF.md §6 "Catch-up and recovery routes" (L6189–6209) |
| evidence | "The guide should state honestly when catch-up is easy, difficult, expensive, partial, or impossible." |
| lands in | `content/timeline/schema.ts` (`Branch.routes`), `/guidance` |
| doctrine check | pass |
| cost | S — gates: extends T-4 (a route may now be labelled costly or partial without violating it) |
| why worth having | T-4 currently pressures every cost to be paired with a route, which risks routes that are technically true and practically useless; grading them is more honest and no less kind. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — Grade catch-up routes as easy, costly, partial or impossible; T-4 stops pressuring routes into technically-true uselessness. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-051 |

#### N-380 · A male/female comparison *view*, not only a toggle — and thirteen things the lens changes
| field | |
|---|---|
| kind | instrument |
| source | MASTER_PROJECT_BRIEF.md §5 "Gender toggle and comparison" (L5934–5969) |
| evidence | "A comparison view may be more informative than a toggle alone because it allows users to see divergence without relying on memory." |
| lands in | `components/timeline/TimelineInstrument.tsx`, `content/timeline/schema.ts` (`bySex`) |
| doctrine check | needs re-sourcing (numbers) — each divergence needs its own source and `measures` string |
| cost | L — gates: extends T-9 (bySex requires `measures` + source) |
| why worth having | the lens exists and is honest, but exactly **one** of 122 records carries a `bySex` divergence, so the control currently marks almost nothing; the brief's thirteen-domain list (rights, unpaid labour, property, violence exposure, widowhood, mortality) is the research backlog that would make it real. |
| trunk dedupe | thinner in trunk (`grep -c '"bySex"' content/timeline/generated/milestones.ts` → 1; the lens renders but has nearly nothing to mark) |
| **architect's call** | **Adopt** — Give the sex lens something to mark: a sourced research batch across the brief's domains (rights, unpaid labour, property, widowhood, mortality), each record with its measures string; the control marks one record today. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-052 |

#### N-381 · Developmental milestones are progressions, not single events
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md §6A "Per-age developmental milestones" (L8104–8187) · also: MASTER_PROJECT_BRIEF.md §6A "Milestone windows, not rigid deadlines" (L8188–8202) |
| evidence | "“Learning language” is not one milestone. It is a progression across receptive language, expressive language, social communication, speech, vocabulary, grammar, and literacy." |
| lands in | `content/timeline/batches/p2-child-development.json` + schema (a progression record kind) |
| doctrine check | needs re-sourcing (numbers) |
| cost | L — gates: extends T-1; a progression record needs a source per step |
| why worth having | the same rule is stated for numeracy, motor development and self-care; it is the difference between a timeline that reassures a worried parent and one that alarms them. |
| trunk dedupe | thinner in trunk (child-development batches exist; the progression *shape* does not — every record is a point) |
| **architect's call** | **Park** — Developmental milestones as progressions is right and sits squarely behind the pediatric gate; parked with it. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-055, BRIEF-056 |

#### N-382 · Adolescence as its own campaign — puberty, identity, peer meta, agency and risk, path preparation
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md §14A "Proposed stage module: adolescence and the transition game" (L10364–10460) [Provisional — ChatGPT 5.6 Sol contribution; named Research Priority 1] |
| evidence | "Adolescence is the clearest missing life stage." |
| lands in | `content/timeline/stages.ts` (`stage-adolescence`), `/map` |
| doctrine check | touches a sensitive page → parked in part (self-harm and mental-health risk route to `/threshold`; consent and sexual-violence material is not playable) |
| cost | L — gates: extends `content/exclusions.ts`; crisis-tier items stay off the timeline |
| why worth having | the brief calls it the stage where meaningful control arrives before adult capacity does, which is precisely the reader most likely to be looking. |
| trunk dedupe | thinner in trunk (`stage-adolescence` exists with milestone coverage; the five-system module — peer meta, identity, agency/risk — does not) |
| **architect's call** | **Park** — Adolescence as its own module is the brief's research priority one and needs the crisis-tier items stripped first; an area decision for the owner. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-057 |

#### N-384 · The timeline control stack: Where → When → Male or female → Standard or preset → Which age
| field | |
|---|---|
| kind | presentation |
| source | MASTER_PROJECT_BRIEF.md §4A "Timeline controls" (L473–488) |
| evidence | "Where? → When? → Male or female? → Standard or preset? → Which age?" |
| lands in | `components/timeline/TimelineInstrument.tsx` |
| doctrine check | pass |
| cost | S — gates: extends the JS-off floor (every control needs its no-JS state) |
| why worth having | a five-question control stack read in order is a legible mental model; the trunk's chip rows (lanes, zoom, lens) are flat and unordered. |
| trunk dedupe | thinner in trunk (lens/lanes/zoom exist; where/when/build do not, and the stack has no stated order) |
| **architect's call** | **Adapt** — State the order of the timeline's controls in its how-to-read block; no new where or when controls. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-062 |

#### N-385 · The generational expectation-versus-reality layer, and the American Dream as a changing bundle
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md §8A (L9581–9731) · also: MASTER_PROJECT_BRIEF.md §8A "Methodological caution: age, period, and cohort" (L9687–9696) · also: MASTER_PROJECT_BRIEF.md §8A "Two complementary comparisons" (L9678–9686) |
| evidence | "The roadmap should compare the life each generation was taught to expect with the life its members were statistically able to experience." |
| lands in | a new `/timeline` lane or `/history` layer; `content/timeline/batches/` |
| doctrine check | needs re-sourcing (numbers) — every cohort figure is a claim |
| cost | L — gates: extends T-1; extends the "what gets said" cultural channel already on the timeline |
| why worth having | the timeline already carries *what gets said* about a milestone; §8A is the same idea given a time axis, and it explains the reader's actual complaint — that the script they were handed no longer matches the game. |
| trunk dedupe | thinner in trunk (`/timeline` has cultural "what gets said"; there is no cohort dimension) |
| **architect's call** | **Park** — A generational expectation-versus-reality layer is research-heavy and needs the age-period-cohort caveat shipped with it; parked as one item. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-063, BRIEF-064, BRIEF-065 |

#### N-386 · Expectation evidence must be contemporaneous, not remembered
| field | |
|---|---|
| kind | safety |
| source | MASTER_PROJECT_BRIEF.md §8A "Expectation evidence" (L9697–9702) |
| evidence | "Later reflections remain valuable but should be labeled as retrospective perceptions rather than direct evidence of earlier expectations." |
| lands in | `content/timeline/schema.ts` (source `measures`), `/methodology` |
| doctrine check | pass |
| cost | S — gates: extends T-9's `measures` requirement to expectation claims |
| why worth having | nostalgia is the primary source most likely to be cited and least likely to be true; the fix is a label the schema already knows how to carry. |
| trunk dedupe | not in trunk --- |
| **architect's call** | **Adopt** — Expectation evidence must be contemporaneous or labelled retrospective; an authoring rule for the cultural-expectation channel's sources. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-066 |

#### N-417 · Parenthood: nine distinct events that "the decision to have children" hides
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md §9 "Events that must remain distinct" (L9742–9759); confirmed in §15 decision log 2026-08-09 · also: MASTER_PROJECT_BRIEF.md §9 "Interpretation principles" (L9807–9819) |
| evidence | "Age at first birth is observable but should not be mislabeled as the age of the decision." |
| lands in | `content/timeline/` (fertility records), `/topics/relationships` |
| doctrine check | needs re-sourcing (numbers) |
| cost | M — gates: extends T-9 (`measures` must say which event a source measured) |
| why worth having | it is a schema-level correction — the trunk's fertility milestones measure births, and the brief says plainly that a birth is not a decision. Including deliberate childlessness, involuntary childlessness and continued uncertainty as *paths* is the same rule as "never is a path, not a failure". |
| trunk dedupe | thinner in trunk (`p2-fertility-menopause.json` records exist; the nine-event separation does not) |
| **architect's call** | **Adapt** — A measures correction for the fertility records: a birth is not a decision; nine distinct events named, through the pipeline, inside the clinical gate. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-109, BRIEF-110 |

#### N-419 · Friendship as a full roadmap across eleven life phases
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md "Friendship as a full roadmap" (L10752–10767) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "Childhood play / Adolescent belonging / College and workplace friendships / Parenthood-related network change" |
| lands in | `/topics/relationships`, `content/timeline/` (a friendship lane) |
| doctrine check | needs re-sourcing (numbers) |
| cost | L — gates: extends T-1 |
| why worth having | friendship contraction in midlife and loneliness in retirement are among the most common unnamed experiences in the site's territory, and the timeline has no lane for them. |
| trunk dedupe | not in trunk (`people-family` lane carries 11 of 122 records; friendship as such is absent) |
| **architect's call** | **Park** — A friendship lane across life phases needs sourced records; parked with the timeline research backlog. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-114 |


### G. History

#### N-170 · A tier board whose declared objective is switchable, with a per-objective factor-weight inspector
| field | |
|---|---|
| kind | instrument |
| source | `gol-chatgptsol5-6/app/GuidebookPrototype.tsx` (`.tier-controls`), `content/fixtures.json` (`tierList.objectives`, three full S–F placement sets) |
| evidence | "Coercion directly defeats the autonomy objective; worth is not being ranked." (`objective-autonomy`, F-tier ruling) |
| lands in | `components/History.tsx` + `content/history.ts` |
| doctrine check | pass — no number is involved; the weights are qualitative ("Autonomy: very high") |
| cost | L — gates: extends the tier-board gate; new assertion: "every placement belongs to a named objective, and changing the objective changes the board" |
| why worth having | **the trunk's own `TIER_LIMITS` names this as the missing thing** — "would let you re-weight the factors to produce a different board for a different objective". Watching the same five positions reorder under "autonomy" versus "era power" is the single best demonstration that a tier is about a ruleset and not about people. |
| trunk dedupe | thinner in trunk (`content/history.ts` has one `TIER_OBJECTIVE` and one `TIER_FACTORS` list, disclosed but fixed; `TIER_LIMITS` apologises for it in prose) |
| **architect's call** | **Adopt** — A switchable tier objective with a weight inspector; the trunk's own TIER_LIMITS apologises for its absence. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-031 |

#### N-171 · A ruleset header on the tier board: objective · unit · priority factors · not measured · evidence state
| field | |
|---|---|
| kind | instrument |
| source | tgtl-chatgptsol5-6-2.0/app/components/HistoryPages.tsx (`/history/tier-list`) · also: MASTER_PROJECT_BRIEF.md §6A "Historical archetype tier lists" (L7908–8011) · also: MASTER_PROJECT_BRIEF.md §6A "Politically sensitive ranking doctrine" (L7959–7972) |
| evidence | "NOT MEASURED · Human worth, happiness, moral value, family value, skill, contribution, or individual destiny."  ·  screenshot: records/consolidation/sol2/history-tier-list.png |
| lands in | `app/history/page.tsx` tier board, `content/history.ts` |
| doctrine check | pass |
| cost | M — gates: new gate: "the tier board renders no placement without a declared objective, unit and not-measured list above it" |
| why worth having | the trunk's board carries a long caveat paragraph *below* it. Sol declares the ruleset above the board, so the reader knows what is being ranked before they see a letter — and "UNIT: Economic position, not demographic group or person" is the line that stops a tier list from becoming a ranking of people. |
| trunk dedupe | thinner in trunk — `content/history.ts` has one prose caveat string after the board; the objective, unit and not-measured list are not structured or rendered first. |
| **architect's call** | **Adopt** — The ruleset header above the board: objective, unit, not-measured, evidence state; the reader knows what is ranked before seeing a letter. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-041, BRIEF-138, BRIEF-139 |

#### N-172 · An empty top tier, on purpose
| field | |
|---|---|
| kind | voice |
| source | tgtl-chatgptsol5-6-2.0/app/components/HistoryPages.tsx (`S · No responsible placement`, badge "Insufficient evidence") |
| evidence | "When the evidence cannot justify a strong placement, the responsible result is an explicit empty state—not inflated certainty." |
| lands in | `content/history.ts` tier board |
| doctrine check | pass |
| cost | S — gates: extends the evidence-label gate (an empty tier must carry `insufficient-evidence`, not nothing) |
| why worth having | the single most persuasive demonstration on the site that the instrument will refuse to answer — a tier list with a visibly empty S row teaches more than any methodology page. |
| trunk dedupe | not in trunk — the trunk's industrialization board fills S with two placements. --- |
| **architect's call** | **Adopt** — An empty top tier badged insufficient evidence; the most persuasive refusal on the site. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-042 |

#### N-173 · A three-phase patch scrubber: before → immediate effect → mature equilibrium
| field | |
|---|---|
| kind | mechanic |
| source | `gol-chatgptsol5-6/app/GuidebookPrototype.tsx` (`.patch-scrubber`) + blueprint §SCR-011 |
| evidence | screenshot: `records/consolidation/sol1/desktop-history-game.png` — "Mature: New institutions, occupations, and counter-metas emerge." |
| lands in | `components/History.tsx` |
| doctrine check | pass |
| cost | M — gates: extends the history gate |
| why worth having | a before/after pair hides the most important fact about a big change, which is that the immediate damage and the settled outcome are different events decades apart — and that the people caught between them get neither. |
| trunk dedupe | thinner in trunk (`content/history.ts` has `before`/`after` per archetype plus a `transitionGeneration` paragraph — the insight is there in prose, but the instrument collapses two different times into one "after") |
| **architect's call** | **Adopt** — A three-phase scrubber: before, immediate effect, mature equilibrium; the transition generation gets its own frame. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-032 |

#### N-174 · Select a reworked mechanic; the archetype rows it moved highlight
| field | |
|---|---|
| kind | mechanic |
| source | `gol-chatgptsol5-6/app/GuidebookPrototype.tsx` (`.movement-table`, `mechanicId` join) + blueprint §SCR-011 "Open the mechanic behind each movement" · also: MASTER_PROJECT_BRIEF.md §6A "Patch timeline and tier-list integration" (L8076–8090) |
| evidence | screenshot: `records/consolidation/sol1/desktop-history-game.png` |
| lands in | `components/History.tsx` |
| doctrine check | pass |
| cost | M — gates: new gate: "every tier movement names the mechanic that caused it; a movement with no mechanic does not render" |
| why worth having | it converts the tier board from a set of verdicts into a causal claim you can trace — clock discipline moved *this* row, urban concentration moved *that* one — which is exactly the auditability the owner asked for. |
| trunk dedupe | not in trunk (the trunk's `PATCH` lists mechanics added/removed and the archetypes' before/after tiers, but nothing joins a specific archetype's movement to a specific mechanic) |
| **architect's call** | **Adopt** — Select a reworked mechanic and the rows it moved highlight; the board becomes a causal claim you can trace. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-033, BRIEF-143 |

#### N-175 · Four more patch fields: indirect effects, unintended consequences, exploits and counter-metas, and scholarly disagreement
| field | |
|---|---|
| kind | content |
| source | `gol-chatgptsol5-6/content/fixtures.json` (`patch.indirect`, `patch.unintended`) + blueprint §SCR-011 · also: MASTER_PROJECT_BRIEF.md §6A "Patch-note entry template" (L8058–8075) · also: MASTER_PROJECT_BRIEF.md §6A "Buff and nerf logic" (L8038–8051) |
| evidence | "Care and household labor reorganization" (listed as an *indirect* effect of mechanized production, beside urban housing demand and collective bargaining) |
| lands in | `content/history.ts` `PATCH` |
| doctrine check | **needs re-sourcing** for any specific effect; the field set itself is free |
| cost | M — gates: extends the history sourcing gate |
| why worth having | the indirect column is where the honest history lives — the household reorganisation that no one legislated is a bigger fact than most of the direct buffs, and a patch note without it flatters the rulemakers. |
| trunk dedupe | thinner in trunk (`PATCH` has added/removed/buffs/nerfs/rollout/transitionGeneration; no indirect, no unintended, no counter-meta, no recorded scholarly disagreement) |
| **architect's call** | **Adapt** — Indirect effects, unintended consequences, counter-metas and scholarly disagreement as patch fields; each specific effect re-sourced. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-034, BRIEF-140, BRIEF-141 |

#### N-176 · Official rules · practical effects · rollout and lag, as three parallel panels
| field | |
|---|---|
| kind | presentation |
| source | `gol-chatgptsol5-6/app/GuidebookPrototype.tsx` (`.rules-grid`) + blueprint §11.4 "Separate written law from enforcement" · also: MASTER_PROJECT_BRIEF.md §6A "Buff and nerf logic" (L8052–8057) |
| evidence | "Enforcement, access, safety, and bargaining power lagged or diverged from written rules." |
| lands in | `components/History.tsx`, and reusable on `/timeline` legal-threshold records |
| doctrine check | pass |
| cost | S — gates: extends the timeline's `legal-threshold` treatment — a rule and its enforcement are different objects |
| why worth having | putting the written rule and its enforcement side by side, rather than in sequence, is what stops a law reading as a description of what happened. |
| trunk dedupe | thinner in trunk (`PATCH.rollout` covers the timing lag well; the written-versus-enforced split is doctrine in the blueprint but is not a rendered element anywhere) --- |
| **architect's call** | **Adopt** — Official rules, practical effects, rollout and lag as three parallel panels; reusable on legal-threshold timeline records. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-035, BRIEF-142 |

#### N-177 · Patch notes: inherited advice as *versioned*, not foolish — with a procedure for extracting the rule from the tactic
| field | |
|---|---|
| kind | content |
| source | gol-fable5/metagame/patch-notes.html (+ blueprint §2.7) |
| evidence | "your parents' strategy guide is not wrong so much as versioned — well-meant documentation of a game patch that no longer runs" |
| lands in | `/history` (which already holds the industrialization patch and the tier board) |
| doctrine check | pass — the four named patches are dated claims; each would need a fetched source or must be written without dates |
| cost | M — gates: extends the evidence gate (`content/evidence.ts`) |
| why worth having | it gives the reader a repair for the most common intergenerational fight — "ask what rule made this advice true on its original patch, check whether the rule still binds, re-derive the tactic" — and it is kind to both parties. |
| trunk dedupe | thinner in trunk (`/history` does one era properly as a patch note; the *reading old guides* procedure and the "discarding the rule with the tactic is how each generation pays full price to relearn" line are absent) |
| **architect's call** | **Adapt** — Patch notes as a reading procedure for inherited advice: extract the rule from the tactic; the four named patches only with dates sourced. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-035 |

#### N-178 · The Meta: crowding signals, and the refusal to license contrarianism
| field | |
|---|---|
| kind | content |
| source | gol-fable5/metagame/the-meta.html |
| evidence | "reflexive contrarianism, which is just the second-most-crowded strategy wearing a leather jacket" |
| lands in | `/topics/work` (which already names the meta) and `/history` |
| doctrine check | needs re-sourcing (numbers) — "median returns have fallen accordingly" is a claim to re-source or drop |
| cost | S — gates: extends the no-unsourced-number gate |
| why worth having | the crowding-signal ladder ("the strategy gets a name; the name gets courses sold about it; the courses get sold by people whose success came from selling courses") is a usable test, and the two named exits keep the page from ending in cynicism. |
| trunk dedupe | thinner in trunk (`/topics/work` has "the meta, and why it degrades"; the signal ladder, the anti-contrarianism guard and the exits are absent) |
| **architect's call** | **Adapt** — The crowding-signal ladder and the refusal to license contrarianism on /topics/work; the returns claim dropped. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-036 |

#### N-179 · Role lineage: one persistent function tracked as its institutional home migrates (household → guild → state → firm → platform → machine)
| field | |
|---|---|
| kind | content |
| source | `gol-chatgptsol5-6/app/features/phase-five/RoleAtlas.tsx` (`.lineage-timeline`), `content/guidance-fixtures.json` (`roleLineages`) + blueprint §8.13 |
| evidence | "Coordinate care across dependent people and systems" tracked over four eras with a per-stage "ownership" field |
| lands in | `/history` (as a second instrument beside the patch note and the tier board) |
| doctrine check | **needs re-sourcing** — every stage in the fixture is honestly stamped `[RESEARCH REQUIRED]`; the structure ships, the eras do not, until sourced |
| cost | L — gates: extends the history sourcing gate |
| why worth having | it is the cleanest available answer to "was it always like this?" — the function is constant, the institution that owns it is not, and that reframes a lot of arguments about what is natural. |
| trunk dedupe | not in trunk (the trunk's history is one era's patch note; nothing tracks a single function across eras) |
| **architect's call** | **Park** — Role lineage across eras is honest history and every stage is research-required; parked behind the more-eras wish. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-029 |

#### N-180 · Future scenarios as horizon-banded branches with ownership assumptions, supporting indicators and counter-signals
| field | |
|---|---|
| kind | content |
| source | `gol-chatgptsol5-6/app/features/phase-five/RoleAtlas.tsx` (`.future-card`), `content/guidance-fixtures.json` (`futureScenarios`) + blueprint §SCR-023 · also: MASTER_PROJECT_BRIEF.md "Speculative future role timeline" (L13280–13802) — carries the owner's "[SPECULATIVE ANALOGY] [RESEARCH REQUIRED]" |
| evidence | screenshot: `records/consolidation/sol1/desktop-role-futures-standard.png` — "Branches, never prophecies." |
| lands in | `/history` (a "what comes next" companion), or `/topics/work` |
| doctrine check | pass — the fixture is stamped `[SPECULATIVE ANALOGY]` throughout and carries no probability; the counter-signal column is what keeps it honest |
| cost | M — gates: new gate: "a future card renders no probability and no date; it renders a horizon band, its assumptions, and at least one counter-signal" |
| why worth having | pairing every supporting indicator with a counter-signal is a discipline that turns speculation into something a reader can check against the world, and "who owns the tools" is the right question to make the pivot of the card. |
| trunk dedupe | not in trunk (`WHATS_COMING` names more eras of history, past-facing; nothing forward-facing exists) --- |
| **architect's call** | **Park** — Future scenarios as horizon-banded branches with counter-signals; speculative by design and a new content kind; parked. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-030, BRIEF-145 |

#### N-181 · Servers: the engine-versus-configuration boundary as the quarantine wall against relativism
| field | |
|---|---|
| kind | architecture |
| source | gol-fable5/metagame/servers.html, /metagame/index.html |
| evidence | "The rules are the game. The servers are where you play it." — screenshot: records/consolidation/fable5/staleness-stamp-servers.png |
| lands in | `/methodology` (as a stated scope boundary) and `/history` |
| doctrine check | pass — "roughly eighteen months for the relearning" is a claim to re-source or render without a number |
| cost | M — gates: new gate: "no route asserts a culture-specific norm as a universal rule" |
| why worth having | it is how the site says "cultures differ" without sliding into "everything is relative", and it names both failure modes symmetrically — provincialism and freshman relativism — which is the honest version. |
| trunk dedupe | not in trunk (the trunk is US-2025-scoped by declaration; it has no structural place to hold cultural variation) --- |
| **architect's call** | **Adopt** — The engine-versus-configuration boundary stated on /methodology: how the site says cultures differ without saying everything is relative. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-037 |

#### N-383 · Variable-resolution historical timeline: broad at distance, granular near the present
| field | |
|---|---|
| kind | architecture |
| source | MASTER_PROJECT_BRIEF.md §4A "Historical scope and zoom" (L166–190), "Era segmentation" (L432–454) · also: MASTER_PROJECT_BRIEF.md §4A "Historical roles and social positions" (L191–261) · also: MASTER_PROJECT_BRIEF.md §4A "Trades and occupations across time" (L262–284) · also: MASTER_PROJECT_BRIEF.md §6A "Starter major-patch backlog" (L8091–8095) |
| evidence | "The timeline therefore increases in resolution toward the present." |
| lands in | `/history`, `content/history.ts` |
| doctrine check | pass |
| cost | L — gates: none new |
| why worth having | it is the structural answer to the trunk's own recorded simplification ("history covers one era properly rather than many thinly") — a way to add eras without pretending to equal depth. |
| trunk dedupe | thinner in trunk (`DECISIONS.md`/corrections record the one-era scope as deliberate) |
| **architect's call** | **Park** — More eras of history at the same standard: the trunk's own wish, with the brief's four position catalogues, trades and the patch backlog as the content spine; a research programme, parked. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-060, BRIEF-135, BRIEF-136, BRIEF-144 |

#### N-428 · The standard model defined as modal, never an average of incompatible lives
| field | |
|---|---|
| kind | architecture |
| source | MASTER_PROJECT_BRIEF.md §4A "Defining the standard model" (L294–316), "Livelihood rather than modern job title" (L317–337) |
| evidence | "The standard model should not be created by averaging incompatible lives together. It should be a modal or representative common path." |
| lands in | `/history`, `/methodology` (the Default Human's definition) |
| doctrine check | pass |
| cost | M — gates: new gate: no composite baseline renders without stating which construction it is |
| why worth having | §3's "the average person may not exist" states the problem; this states the fix, and the note that women's labour is undercounted when records recognise only formal male occupations is a sourcing rule, not just a sentiment. |
| trunk dedupe | thinner in trunk (the trunk avoids composites but never states the modal-vs-mean choice) |
| **architect's call** | **Adopt** — State on /methodology that the standard model is modal, never an average of incompatible lives, and that formal records undercount women's labour. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-137 |


### H. Play layer (existing modes)

#### N-190 · Render `failureModes` as the diagnostic reading of a failure — seventy-two authored lines read by nothing
| field | |
|---|---|
| kind | presentation |
| source | found by inspection: 72 occurrences under `content/sim/campaign/actions/`; the only non-content reference in the tree is the string lint at `tests/sim-gates-4.ts:101`; schema at `content/sim/schema.ts:418`; blueprint §5.3 and §7.2 |
| evidence | blueprint §5.3 — "failure is diagnostic (the spec §10 mismatch taxonomy is the authoring palette), never a moral verdict" |
| lands in | the explain drawer on `/play/campaign` (beside the attribution split), and the consequence step after a failure band |
| doctrine check | pass — must sit beside the existing recovery tie, never instead of it; the recovery-tie rule (§3.4) is unchanged |
| cost | S — gates: S-3's recovery-tie verification is the neighbour to extend; new gate: "a rendered failure mode never renders without its record's tied recovery route" |
| why worth having | it is the difference between "that didn't work" and "that didn't work because the thing you needed was a prerequisite you didn't have" — which is the whole reason the sim exists, already written and currently dead weight in the bundle. |
| trunk dedupe | not in trunk (as a rendered thing) — authored, linted for voice, read by no engine or component path --- |
| **architect's call** | **Adopt** — Render the seventy-two authored failure-mode lines beside the recovery tie; written, verified, and read by nothing. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-013 |

#### N-191 · Render `switchingCost` — forty-seven authored sentences about what changing your mind costs, which currently reach no reader
| field | |
|---|---|
| kind | presentation |
| source | found by inspection: `content/sim/campaign/actions/*.ts` (47 occurrences) vs `components/` (0); schema at `content/sim/schema.ts:392`; blueprint §2.3.8 ("'switching cost' joins the action contract") and §7.2 |
| evidence | "switchingCost": "Going back later means going back as the person who left." (`content/sim/campaign/actions/batch-body-meaning.ts:2054`) |
| lands in | `components/sim/CampaignApp.tsx` action card (beside `opportunityNote`, which IS rendered at line 1088) or the explain drawer |
| doctrine check | pass — these are authored strings that already pass the §9.5 batch verification and the S-3 string lint (`tests/sim-gates-4.ts:100` lints them today; nothing displays them) |
| cost | S — gates: S-2 no-numbers and S-5 no-score already cover the strings; S-9 clip/contrast covers the new card region |
| why worth having | switching cost is the single most under-modelled thing in how people actually think about work and study decisions, it is written, it is verified, and it is invisible. |
| trunk dedupe | not in trunk (as a rendered thing) — authored and linted, never displayed |
| **architect's call** | **Adopt** — Render the forty-two switching-cost sentences beside the opportunity note that already renders. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-012 |

#### N-192 · One draw-vary pair curated to land the SAME — the honest other half of G-09
| field | |
|---|---|
| kind | mechanic |
| source | tgtl-claude-4.0/KNOWN_LIMITATIONS.md §4.2 (+ DECISIONS.md "INVENTION: automated Lab seed curation"; blueprint §3.8) |
| evidence | "The fix is to ship one draw-vary pair curated to land the same; `lab-the-repair` is the natural candidate." |
| lands in | `content/sim/lab/situations.ts` (`lab-the-repair` seeds) + `tools/curate-lab-seeds.ts` (a second criterion) + `lib/sim/lab.ts` (the third reading already exists in code) |
| doctrine check | pass |
| cost | S — gates: extends S-12's draw-vary fixture; new gate: "at least one shipped draw-vary pair renders the same-outcome reading" |
| why worth having | right now every shipped pair separates, so the Lab can only teach "luck moved it" and never "the range was narrow and luck didn't matter" — which is the more consoling and more often true half. |
| trunk dedupe | thinner in trunk — the reading exists in `lib/sim/lab.ts` and, per the record, "exists in the code and never renders" |
| **architect's call** | **Adopt** — One draw-vary pair curated to land the same; the Lab's luck lesson becomes true instead of half-true. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-005 |

#### N-193 · A Lab situation whose pivot is a LATER decision in the window, not the first
| field | |
|---|---|
| kind | mechanic |
| source | tgtl-claude-4.0/KNOWN_LIMITATIONS.md §4.10 |
| evidence | "`decisionStep` defaults to the first step everywhere, because no situation has yet been authored with a later decision as its pivot" |
| lands in | `content/sim/lab/situations.ts` (set `decisionStep`); `lib/sim/lab.ts:200` already reads `situation.decisionStep ?? 0` |
| doctrine check | pass |
| cost | S — gates: extends the existing S-1 assertion that choice-vary differs in exactly one step |
| why worth having | it teaches that a decision three seasons in can still be the one that mattered — the shape of most real regrets — and the engine already supports it. |
| trunk dedupe | thinner in trunk — field is in the type and set on zero situations |
| **architect's call** | **Adopt** — One Lab situation whose pivot is a later decision; the engine already supports it. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-006 |

#### N-194 · The compressed season flow as a real control: repeat-last-allocation with a delta-only briefing
| field | |
|---|---|
| kind | mechanic |
| source | tgtl-claude-4.0/KNOWN_LIMITATIONS.md §4.6 (+ blueprint §3.4b, §10 monotony test) · also: patch spec §3 |
| evidence | "§3.4b's \"repeat-last-allocation with a delta-only briefing\" as a distinct control is not built." |
| lands in | `components/sim/CampaignApp.tsx` briefing/allocate steps; `lib/sim/campaign.ts` already computes the `quiet` flag (line 338/357) |
| doctrine check | pass |
| cost | M — gates: extends S-4 (the control joins the keyboard vocabulary), S-7 (a repeated allocation must still commit as an ordered set and replay byte-identically) |
| why worth having | twenty-four full briefings is the single biggest threat to the owner's "smooth, fun" standard, and the signal the control needs is already computed. |
| trunk dedupe | thinner in trunk — `quiet` renders as a briefing signal only; "Twenty-four seasons is still twenty-four briefings" |
| **architect's call** | **Adopt** — The compressed season flow as a real control; the quiet flag is computed and twenty-four full briefings is the biggest threat to smooth and fun. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-007, CLAUDE3-010 |

#### N-195 · Disclose the Lab's seed curation on `/methodology`
| field | |
|---|---|
| kind | safety |
| source | tgtl-claude-4.0/KNOWN_LIMITATIONS.md §4.3 (+ DECISIONS.md "INVENTION: automated Lab seed curation", records/invention-checks.md `lab-seed-curation`) |
| evidence | "It does not yet say that the Lab's alternate draw-seeds were searched for pairs that separate. It should." |
| lands in | `content/sim/methodology-copy.ts` → `/methodology` |
| doctrine check | pass |
| cost | S — gates: extends the methodology publication gate; new gate: "the curation disclosure names `tools/curate-lab-seeds.ts` and the criterion it searches on" |
| why worth having | `/methodology` publishes the economy, the resolution order, the pile-up physics and the attribution rule, and then silently omits the one place a thumb was put on which seed ships. The build's own record says it should be there. |
| trunk dedupe | not in trunk — `grep -i curat` over `content/` and `app/` finds no disclosure; the only mention is a code comment in `content/sim/lab/situations.ts` |
| **architect's call** | **Adopt** — Disclose the Lab seed curation on /methodology; the only undisclosed thumb on the scale. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-014 |

#### N-196 · Recurate the Decision Lab from four situations to the blueprint's eight-to-twelve
| field | |
|---|---|
| kind | content |
| source | tgtl-claude-4.0/KNOWN_LIMITATIONS.md §4.1 (+ blueprint §7.3, §3.8, §9 Phase 3) |
| evidence | "Four is inside the blueprint's Phase-1 range (three to five) and short of the Phase-3 recuration target." |
| lands in | `content/sim/lab/situations.ts` (currently 4 situations over 11 authored decision cards) |
| doctrine check | pass |
| cost | L — gates: S-1 Lab curation lint (no loss-tier beat on any branch; window valid on every branch under every declared axis), S-12 per-axis fixtures, S-7 fork isolation |
| why worth having | the Lab is the cheapest teaching surface on the site and a reader exhausts it in one sitting. |
| trunk dedupe | thinner in trunk — 4 situations: `lab-offer-or-course`, `lab-move-or-stay`, `lab-the-search`, `lab-the-repair` |
| **architect's call** | **Adapt** — Recurate the Lab toward eight situations, one batch at a time, each through the curation lint; not all twelve. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-004 |

#### N-197 · Deepen the cheapest non-floor tier so the bottom of the economy is not carried by nine one-pip small moves
| field | |
|---|---|
| kind | mechanic |
| source | tgtl-claude-4.0/KNOWN_LIMITATIONS.md §4.4 |
| evidence | "the *shape* of the bottom is small moves, because the rest of the pool's cheapest tier costs two pips" |
| lands in | `content/sim/campaign/actions/*` (author one-pip options across more of the nine card families) |
| doctrine check | pass |
| cost | M — gates: S-10 per-season telemetry (≥3 affordable spanning ≥2 families) and S-13's floor check both tighten rather than loosen; note the falsifiability audit's open finding on `tests/s10-balance.ts:144` bears directly on this predicate |
| why worth having | a drained season should offer a genuinely different-feeling menu, not the same nine cheap moves the last drained season offered. |
| trunk dedupe | thinner in trunk — the sandbox is open everywhere (worst non-small-move count is five) but the bottom's texture is thin |
| **architect's call** | **Adapt** — Author one-pip options across more families so a drained season feels different; S-10 tightens, never loosens. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-008 |

#### N-198 · Outcome-variant pools roughly four times deeper, so §10's literal monotony clause is met rather than approached
| field | |
|---|---|
| kind | content |
| source | tgtl-claude-4.0/KNOWN_LIMITATIONS.md §4.9 (+ records/acceptance-evidence.md; blueprint §3.4b, §10) |
| evidence | "that is not achievable at this run length without pools roughly four times deeper" |
| lands in | `content/sim/campaign/actions/*` `outcomeVariants`; `tools/variant-brief.ts` / `variant-gap.ts` / `merge-variants.mjs` already exist as the authoring path |
| doctrine check | pass — the §9.5 pipeline (schema-constrained authors + per-batch adversarial verifier) is the only sanctioned way to author at this volume |
| cost | L — gates: S-3's rotation-pool depth guard already measures per option AND band; deepening is what makes its threshold raiseable |
| why worth having | measured worst verbatim repeat is still ×4–5 over a 110-resolution run; the fun bar the owner set is replayability, and rereading a line is where replay dies. |
| trunk dedupe | thinner in trunk — rotation guarantee is the strongest available at current depth; depth is the limit |
| **architect's call** | **Park** — Four-times-deeper variant pools is a large authoring job with an existing pipeline; park behind the rendering fixes. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-009 |

#### N-199 · Let a campaign meet more of the companion pool across runs — the four arcs a single run never shows
| field | |
|---|---|
| kind | mechanic |
| source | tgtl-claude-4.0/KNOWN_LIMITATIONS.md §4.5 (+ blueprint §3.7, §12.5) |
| evidence | "a single run will not show most of what was written" |
| lands in | `lib/sim/campaign.ts` (the arc deal) and/or the parse's closing panel on `/play/campaign` |
| doctrine check | pass — but the deal must not become a completion list; anything that reads as "arcs collected" is reader gamification and is out |
| cost | M — gates: S-3 companion-arc reachability (neglect/repair/refuse/leave paths) re-runs per deal; new gate: "no surface counts arcs met, seen, or remaining" |
| why worth having | six arcs were written to the never-command five and a reader meets two; the honest fix is a different deal on a new run, not a gallery. |
| trunk dedupe | thinner in trunk — exactly two of six arcs per run, deliberately; nothing tells a returning reader there is more |
| **architect's call** | **Adapt** — Deal a different pair of companion arcs on a new run and say so once; never a gallery, never a count. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-010 |

#### N-200 · A content pass on the Life Arc's acts, beats and 47-card pool
| field | |
|---|---|
| kind | content |
| source | tgtl-claude-4.0/KNOWN_LIMITATIONS.md §4.8 (+ blueprint §3.2 — five sanctioned deltas, all landed) · also: tgtl-claude-3.0/content/play/schema.ts:148 (+ blueprint_TGTL_3.0.md §5 "the visual doctrine — pictures over paragraphs"); patch spec §1–§2 · also: tgtl-claude-3.0/KNOWN_LIMITATIONS.md ("Deferred by design"); blueprint §11.4 · also: tgtl-claude-3.0/KNOWN_LIMITATIONS.md ("Approximations and honest edges") |
| evidence | "Its acts, beats and 47-card pool are otherwise as 3.0 shipped them, including their own limitations." |
| lands in | `content/play/` (the arc pool), `/play/arc` |
| doctrine check | pass — the arc's own beats are already on the §5.6 clinical review list (KL §1.3), so any beat touched goes parked |
| cost | L — gates: the arc's existing S-3/S-5/S-8 suite; the campaign's rotation-depth guard would have to be extended to the arc pool, which it does not currently cover |
| why worth having | `/play/arc` is the recommended first play and it is running 3.0 content behind 4.0 art; it is the first thing a new reader judges the whole site by. |
| trunk dedupe | thinner in trunk — the arc's five sanctioned deltas landed; the content underneath is 3.0's |
| **architect's call** | **Adapt** — A content pass on the arc: CardFace on its cards first, then density toward budget; every beat touched goes to clinical review. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-011, CLAUDE3-001, CLAUDE3-003, CLAUDE3-015 |

#### N-201 · Scripted beats in the arc: two shipped against a budget of about ten
| field | |
|---|---|
| kind | content |
| source | blueprint_TGTL_3.0.md §11.4 · also: tgtl-claude-3.0/KNOWN_LIMITATIONS.md; blueprint §7.2 |
| evidence | "~10 scripted beats." |
| lands in | `content/play/beats.ts` |
| doctrine check | **touches the loss tier** → each new beat is parked for clinical review under the KL 1.3/1.4 pattern before it renders |
| cost | M — gates: S-1 already lints every beat for `skippable`/`reducedFrame`/resolving `realPageLink` |
| why worth having | the arc covers a whole life in eight acts and the quiet moments are where it is most unlike a game; two is thin for eighty years |
| trunk dedupe | thinner in trunk. `content/play/beats.ts` is still exactly `beat-loss` and `beat-own-end` — byte-identical to 3.0's file. |
| **architect's call** | **Park** — More scripted beats in the arc are loss-tier and go to clinical review before rendering. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE3-004, CLAUDE3-005 |

#### N-202 · The chosen "leaning" is dead weight — it is stored and read by nothing
| field | |
|---|---|
| kind | mechanic |
| source | blueprint_TGTL_3.0.md §3.3; tgtl-claude-3.0/components/play/Creation.tsx:107-121 |
| evidence | "One leaning — a temperament emphasis (e.g. curious / careful / social / maker), flavoring option framing, never gating options" |
| lands in | `components/play/Creation.tsx` (the step exists) + `content/play/cards/*` (framing strings) + `lib/engine/run.ts:77` |
| doctrine check | pass — the blueprint's own guard already covers it ("no personality-type ever drives a recommendation") |
| cost | M — new gate: "a leaning changes at least one rendered framing string, and changes no option, no band width, and no effect" |
| why worth having | creation asks the player for a second, deliberate self-description and then never mentions it again; either make it do the one thing it promised, or remove the step |
| trunk dedupe | not in trunk. `setLeaning` writes `run.leaning` (trunk `lib/engine/run.ts:77`); across the whole of `lib/` and `content/` the only other occurrence is the type declaration at `content/play/schema.ts:284`. Verified by grep in both builds — this shipped inert in 3.0 and is still inert. |
| **architect's call** | **Adopt** — Make the leaning flavour one framing string or delete the step; an inert control on the creation screen is a small visible dishonesty. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE3-002 |

#### N-203 · An in-run act/progress view built from the map component
| field | |
|---|---|
| kind | instrument |
| source | blueprint_TGTL_3.0.md §3.4 |
| evidence | "The act-select / progress view is an internal `/play` screen that reuses the map component." |
| lands in | `components/play/Playthrough.tsx` + `components/Roadmap.tsx` |
| doctrine check | pass — the blueprint's own guard holds: `/map` stays the static reference and "run state never drives the reference page" |
| cost | M — gates: extends gate 1 (no new route) and S-4 (help reachable from the new state) |
| why worth having | the arc gives the player an "Act 3" eyebrow (`Playthrough.tsx:578`) and nothing else; there is no way to see where you are in the eight, which is the one orienting fact a long run needs |
| trunk dedupe | not in trunk — searched `Playthrough.tsx` in both builds for any act rail, progress view or stage reuse; the eyebrow is all there is. --- |
| **architect's call** | **Adopt** — An in-run act progress view reusing the map component; "Act 3" as an eyebrow is all a long run gets today. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE3-006 |

#### N-204 · Carry each Launch origin's motif through all twenty-four seasons
| field | |
|---|---|
| kind | presentation |
| source | patch spec §3 · also: patch spec §3 · also: TGTL_3_0_VISUAL_POLISH_PATCH_SPEC.md §3 |
| evidence | "make each of the five origins visibly recognizable beyond turn one" |
| lands in | `components/sim/CampaignApp.tsx` season chrome; the hook already exists at `content/sim/campaign/presets.ts` (`face:` at lines 46, 68, 90, 112, 134) |
| doctrine check | pass |
| cost | S — new gate: "a season screen at any turn renders its origin's motif" (the spec's own test: screenshots attributable to their origin without the preset name in the header) |
| why worth having | five unequal starting positions that visually converge after the selection screen teach nothing about position, which is the campaign's central doctrine |
| trunk dedupe | thinner in trunk. Each preset already declares a distinct `face` — `home` / `work` / `school` / `people` / `health` — and it is used at **exactly one place**: `CampaignApp.tsx:536`, the selection card. After `startPreset` the origin never appears again, **not even its label**: `presetId` occurs twice in `CampaignApp.tsx` (191, 192) and `PRESET_BY_ID` is read once, in `lib/sim/campaign.ts:149`, to seed starting state and companions. |
| **architect's call** | **Adopt** — Carry each origin's face motif through all twenty-four seasons; five unequal starts converge into one screen by season two. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE3-009, CLAUDE3-011, SPECS-028 |

#### N-205 · A consequence-intensity vocabulary — routine / meaningful / major — authored per outcome
| field | |
|---|---|
| kind | mechanic |
| source | TGTL_3_0_VISUAL_POLISH_PATCH_SPEC.md §1 · also: TGTL_3_0_VISUAL_POLISH_PATCH_SPEC.md §1 · also: patch spec §1 · also: TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §9.5; GRAPHICAL §9.5 |
| evidence | "Routine: at least one immediately visible prop, pose, placement, or environmental change." |
| lands in | `content/sim/schema.ts` (outcome records), `components/sim/instruments/CardFace.tsx`, `CampaignApp.tsx` `ConsequencesScreen` (1237) |
| doctrine check | pass |
| cost | M — new gate: "every authored outcome declares an intensity, and the three intensities render visually distinguishable treatments" |
| why worth having | a player should know the *size* of what just happened before reading the caption — the spec's standard, and a good one |
| trunk dedupe | thinner in trunk. The trunk already differentiates a consequence by family motif, band tint (`.sim-card[data-band="strong"] .sim-card-frame`), a `KIND_WORD` eyebrow ("you did this" / "this arrived" / "this had been set in motion"), the queue and the doors panel ("What opened / What closed / Still there"). What is missing is the **authored escalation**: a one-pip routine action and a major setback render at exactly the same visual weight. |
| **architect's call** | **Adopt** — Authored consequence intensity so a one-pip routine and a major setback do not land at equal visual weight. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE3-007, SPECS-009, CLAUDE3-008, SPECS-010 |

#### N-206 · Composition variants per family, so adjacent screens are not the same drawing
| field | |
|---|---|
| kind | presentation |
| source | patch spec §2 · also: TGTL_3_0_VISUAL_POLISH_PATCH_SPEC.md §2 |
| evidence | "avoid using the same protagonist/companion/table arrangement in adjacent scenes" |
| lands in | `components/sim/instruments/CardFace.tsx` (one `Motif` per family today) |
| doctrine check | pass — **translated**: the trunk's visual language is instrument-and-atlas, not staged scenes with characters and furniture, and it should stay that way (2.0 §10: "no stock imagery, no photographs of people"). The harvestable idea is *variance within the family*, not "locations". |
| cost | M — gates: extends S-9's surface walk |
| why worth having | the spec's own test is the right one — "a random sequence of screenshots feels like a life moving through different places and years, not one stage repeatedly redressed" |
| trunk dedupe | thinner in trunk. Nine motifs, one per family, drawn once at `CardFace.tsx:52` and reused byte-identically on every card of that family for the whole run. --- |
| **architect's call** | **Adapt** — Composition variants within each family motif so adjacent screens are not the same drawing; instrument-and-atlas language stays. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE3-012, SPECS-029 |

#### N-207 · Scenario Runs as a fourth mode — a short, framed run over one decision area, rather than a whole campaign or a single fork
| field | |
|---|---|
| kind | mechanic |
| source | tgtl-claude-4.0/KNOWN_LIMITATIONS.md §3.1 (+ blueprint §12.3, §2.3.8, §10) · also: TGTL_PLAYABLE_LIFE_SIMULATION_SPEC.md §3.1, §17 Phase 2; SCENE_DRIVEN §13.2 (*The Contract Ends on Friday* — a job loss, six turns, setback and recovery) |
| evidence | "Deferred; the campaign's event arcs and the Lab cover the ground." |
| lands in | `/play` (a fourth door) + `lib/sim` over the existing one-engine contract; content under `content/sim/` |
| doctrine check | pass |
| cost | L — gates: extends S-3/S-3b (reachability over a new content shape), S-1 (Lab-style curation rule would need a scenario analogue); new gate: "no scenario run schedules a loss-tier beat" |
| why worth having | the campaign is 2–4 hours and the Lab is one decision; there is nothing between them for a reader with twenty minutes and one live question. |
| trunk dedupe | not in trunk (three modes only: `/play/arc`, `/play/campaign`, `/play/lab`) |
| **architect's call** | **Park** — Scenario Runs as a fourth mode is a new engine surface; park behind the story decision (N-220) and decide the modes together. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-001, SPECS-039 |

#### N-208 · "Attention" as a literal fourth budget currency alongside time-structure, energy and money
| field | |
|---|---|
| kind | mechanic |
| source | tgtl-claude-4.0/KNOWN_LIMITATIONS.md §3.3 (+ blueprint §12.8, §2.3.8, §7.5) |
| evidence | "Folded into energy and time-structure per §2.3.8. Reversible if the owner wants it literal." |
| lands in | `lib/sim/economy.ts` (budget derivation + pip table), `content/sim/campaign/actions/*` (a fourth cost field), `/methodology` economy table |
| doctrine check | pass — but the published pip table is authored, so any new per-band table inherits CLAUDE4-016's re-sourcing debt |
| cost | L — gates: S-10 (every affordability assertion re-runs against a four-currency budget), S-13, the §3.4 floor set must stay affordable in the new currency |
| why worth having | the owner's own spec named four; the fold is a recorded simplification, and attention is the one an over-committed reader actually feels first. |
| trunk dedupe | not in trunk (three currencies; `deriveBudget` floors time and energy at 1) |
| **architect's call** | **Reject** — Attention as a literal fourth currency re-runs every balance fleet against a four-currency budget for a distinction the reader already meets in energy; the fold was right. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-002 |

#### N-209 · The research-calibration pass — the work that would let a single rule carry the `calibrated` label
| field | |
|---|---|
| kind | instrument |
| source | tgtl-claude-4.0/KNOWN_LIMITATIONS.md §2.1 (+ blueprint §6, spec §17 Phase 4) · also: tgtl-claude-4.0/KNOWN_LIMITATIONS.md §2.2 (+ blueprint §7.5) |
| evidence | "The research-calibration pass (spec §17 Phase 4) is not done and is not pretended to be done." |
| lands in | `content/sim/*` `evidenceLabel` fields; `/methodology` evidence section; would use the trunk's own `records/research-pipeline.md` fetch discipline |
| doctrine check | needs re-sourcing (numbers) — every calibrated claim is a fetched-source claim under 5.0 §4.1 / T-1; a prototype figure is a claim to re-source, never a source |
| cost | L — gates: S-3 already fails the build if any record claims `calibrated`; that gate becomes the acceptance criterion rather than the prohibition |
| why worth having | the label is defined and deliberately unused, which is honest and also means every rule in the sandbox currently reads at the same evidential weight as every other. |
| trunk dedupe | not in trunk — 5.0 built the timeline's sourcing discipline; the sim's rules never went through it |
| **architect's call** | **Park** — The research-calibration pass is the right ambition and a research programme; parked, never pretended. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-015, CLAUDE4-016 |

#### N-210 · A second campaign — another country, another decade — under the research pass that would make it honest
| field | |
|---|---|
| kind | content |
| source | tgtl-claude-4.0/KNOWN_LIMITATIONS.md §2.3 (+ blueprint §3.3) |
| evidence | "not transferable to another country or era without the research pass that would make it honest" |
| lands in | `content/sim/` (a second campaign tree beside `campaign/`), `/play/campaign` selection |
| doctrine check | needs re-sourcing (numbers) — the whole point of the row is that the transfer is a research act, not a find-and-replace |
| cost | L — gates: the full §8 roster re-runs per campaign; S-10 balance fleets per campaign; the S-1 exclusion lists apply unchanged (do not localise a wall) |
| why worth having | *Launch Window — United States 2025* is one place and one decade, and the trunk's own history section already argues that the ruleset is the variable. |
| trunk dedupe | not in trunk — one campaign; note this is adjacent to but distinct from the trunk's `WHATS_COMING` "era-play" idea (replaying a hand under a different historical ruleset) --- |
| **architect's call** | **Park** — A second campaign needs the research pass first; parked with it. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-017 |

#### N-211 · The five-field response contract, on every response, before commitment
| field | |
|---|---|
| kind | instrument |
| source | tgtl-chatgptsol5-6-2.0/app/components/DecisionWorkspace.tsx (`action-contract` dl) |
| evidence | `<dt>Capacity</dt> … <dt>What waits</dt> … <dt>Reversibility</dt> … <dt>If it goes badly</dt> … <dt>Evidence</dt>` |
| lands in | `components/sim/CampaignApp.tsx` option rendering, `content/sim/schema.ts` action contract |
| doctrine check | pass |
| cost | M — gates: new gate: "no selectable option renders without all five contract fields populated" (plant a field-less option, assert red) |
| why worth having | "If it goes badly" on *every* option — not only endurance options — is the difference between a game that lets you gamble and a guidebook that shows you the way back before you jump. |
| trunk dedupe | thinner in trunk — trunk options carry cost chips, reversibility, `opportunityNote` and a `supportLink` on endurance options only; a named recovery route is not required of every option. |
| **architect's call** | **Adopt** — "If it goes badly" on every option, not only endurance ones; the five-field response contract with a gate that an option without it does not render. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-007 |

#### N-212 · A pure preview pane that says what a choice would touch without touching it
| field | |
|---|---|
| kind | mechanic |
| source | tgtl-chatgptsol5-6-2.0/app/components/DecisionWorkspace.tsx (`decision-preview`, `aria-live="polite"`) · also: TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §3.2, §1 |
| evidence | "Its capacity, tradeoff, recovery route, evidence status, and likely affected areas will appear here. Previewing never changes the saved life." |
| lands in | `components/sim/CampaignApp.tsx`, `lib/sim/season.ts` (a pure `previewAction`) |
| doctrine check | pass |
| cost | M — gates: new gate: "preview is byte-identical state in, byte-identical state out" (plant a mutation in preview, assert red) |
| why worth having | hover/focus tells you which domains, whether a consequence will arrive later, and what waits — and the gate proves it cannot have written anything. That is how a reader learns to read a decision before making one. |
| trunk dedupe | not in trunk — the trunk shows affordability and chips but has no focus-driven "read before committing" surface, and no gate asserting preview purity. |
| **architect's call** | **Adopt** — A pure preview pane: what a choice would touch, provably touching nothing. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-008, SPECS-002 |

#### N-213 · Upkeep as a standing option in every scene, not the leftovers
| field | |
|---|---|
| kind | mechanic |
| source | tgtl-chatgptsol5-6-2.0/content/play/story/helpers.mjs (`upkeep`, appended to every scene's `actionIds`) |
| evidence | "Food, rest, transport, paperwork, and required care travel through every chapter."  ·  "…rather than whatever is left after ambition." |
| lands in | `content/sim/campaign/actions-small.ts`, the season action menu |
| doctrine check | pass |
| cost | S — gates: extends the affordability gate; new gate: "an upkeep option is affordable in the worst capacity envelope of every preset" |
| why worth having | a maintenance option that is always on the menu and always affordable makes the cost of skipping it a visible choice rather than an oversight. |
| trunk dedupe | thinner in trunk — the trunk has a maintenance ledger and small actions, but no single always-present, always-affordable upkeep block guaranteed at every decision. |
| **architect's call** | **Adopt** — Upkeep as a standing, always-affordable option in every season menu; skipping it becomes a visible choice. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-009 |

#### N-214 · A fourth door state: "narrowing"
| field | |
|---|---|
| kind | instrument |
| source | tgtl-chatgptsol5-6-2.0/content/play/story/endings.mjs (`doors`: `openWhen` / `recoverableWhen` / `narrowingWhen`) |
| evidence | `narrowingWhen:equal("flags.rooted",true)` on the geographic-mobility door |
| lands in | `content/sim/campaign/doors.ts` (`DoorMeaning` union), the parse Doors panel |
| doctrine check | pass |
| cost | S — gates: extends the existing doors gate (three states → four; the colour rule must not paint "narrowing" as good) |
| why worth having | most doors do not slam; they get harder each year you do not use them. Three states force that into either "open" (a lie) or "closed" (a different lie). |
| trunk dedupe | thinner in trunk — `DoorMeaning` is `"opened" | "closed" | "still recoverable"`, and the trunk's own comment records that a one-state version once painted job loss green. |
| **architect's call** | **Adopt** — A fourth door state, narrowing; most doors do not slam, they get harder each year unused. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-012 |

#### N-215 · Doors as live conditions on state, not a flag→label lookup table
| field | |
|---|---|
| kind | architecture |
| source | tgtl-chatgptsol5-6-2.0/content/play/story/endings.mjs; lib/simulation-presentation.mjs (`projectAtlas`) |
| evidence | `{id:"portable",label:"Portable specialist work",openWhen:atLeast("state.skills.practicedCraft",60),recoverableWhen:atLeast("state.skills.practicedCraft",35)}` |
| lands in | `content/sim/campaign/doors.ts` + `lib/sim/parse.ts` |
| doctrine check | pass |
| cost | M — gates: extends the doors gate ("a door with no declared condition is not rendered") |
| why worth having | the trunk's door table is generated from flags and hand-verified; a declared condition means a door can *reopen* mid-run when the state changes, and can be shown during play rather than only at the end. |
| trunk dedupe | thinner in trunk — `DOOR_MEANING` is a generated static map keyed on flags, evaluated at parse time only. |
| **architect's call** | **Adapt** — Doors as declared conditions on state so they can be shown mid-run and can reopen; keep the hand-verified table as the fixture. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-013 |

#### N-216 · The living record: every resolved decision reopens its original explanation, stamped with the version that produced it
| field | |
|---|---|
| kind | instrument |
| source | tgtl-chatgptsol5-6-2.0/app/components/atlas/AtlasJournal.tsx (`LifeRiver`); SimulationUI.tsx (`OutcomePanel`) · also: TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §5.5, §10.2, §24 |
| evidence | "This explanation is preserved, not recalculated." |
| lands in | `components/sim/CampaignApp.tsx` season list, `lib/sim/persist.ts` |
| doctrine check | pass |
| cost | M — gates: new gate: "reopening a historical outcome after a content-version bump renders the recorded text, not a recomputation" (bump the version, assert the old string) |
| why worth having | the trunk replays a run from its ledger, which means a content change silently rewrites the past. Sol keeps the sentence you actually read, with the version stamp beside it. |
| trunk dedupe | not in trunk — `lib/sim/forks.ts` `replay()` re-derives everything from origin + seeds + committed ledger; there is no stored per-season narrative to reopen. |
| **architect's call** | **Adopt** — The living record: every resolved decision reopens its original explanation, version-stamped; replay-from-ledger silently rewrites the past. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-014, SPECS-020 |

#### N-217 · Fork before a *past* decision — and say plainly when the snapshot cannot support it
| field | |
|---|---|
| kind | mechanic |
| source | tgtl-chatgptsol5-6-2.0/app/components/SimulationUI.tsx (`forkBeforeOutcome`, `historical-fork`) |
| evidence | "This older explanation has no complete decision snapshot. Its text remains intact; fork from the current point instead." |
| lands in | `lib/sim/forks.ts`, `components/sim/CampaignApp.tsx` |
| doctrine check | pass |
| cost | M — gates: extends S-7 (parent immutability) to historical forks; new gate: "an incomplete snapshot renders unavailable, never a silently-approximated fork" |
| why worth having | "what if I had said no at twenty-four" is the question a life sim exists to answer — and refusing the fork honestly when the record cannot support it is worth more than a plausible reconstruction. |
| trunk dedupe | thinner in trunk — the trunk forks at a chosen `forkPoint` index and replays, and flags `replayTruncatedAt` when the ledger and content diverge; it does not distinguish "this specific past decision has no restorable pre-state". |
| **architect's call** | **Adapt** — Fork before a past decision, and refuse honestly when the snapshot cannot support it. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-015 |

#### N-218 · Threads in motion, with uncertainty stated where a delayed effect is absent
| field | |
|---|---|
| kind | instrument |
| source | tgtl-chatgptsol5-6-2.0/app/components/atlas/AtlasJournal.tsx (`river-futures`); DecisionWorkspace.tsx (`Still in motion`) |
| evidence | "No known delayed consequence is pending. Uncertainty has not disappeared." |
| lands in | `lib/sim/queue.ts` projection + the campaign's Queue instrument |
| doctrine check | pass |
| cost | S — gates: extends the queue gate; new gate: "the empty queue state never reads as 'nothing is coming'" |
| why worth having | an empty queue is the moment a simulation most tempts a reader into a false sense of clearance. One sentence fixes it. |
| trunk dedupe | thinner in trunk — the trunk has a Queue instrument with provenance, but no authored empty state carrying this correction. |
| **architect's call** | **Adopt** — The empty queue says uncertainty has not disappeared; one sentence. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-016 |

#### N-219 · Carried memories: objects a run picks up and keeps
| field | |
|---|---|
| kind | mechanic |
| source | tgtl-chatgptsol5-6-2.0/app/components/atlas/AtlasJournal.tsx (`memory-pocket`); content/play/atlas-assets.mjs (`carried-memory`) |
| evidence | "Objects and memories carried forward · {run.memories?.length}" |
| lands in | `content/sim/schema.ts` run state, the parse's closing panels |
| doctrine check | pass |
| cost | S — gates: new gate: "a memory is never a modifier" (assert memories are absent from every effect path) |
| why worth having | a keepsake with a note and a source turn is the cheapest continuity device there is, and it carries no mechanical weight to abuse. |
| trunk dedupe | not in trunk. |
| **architect's call** | **Adapt** — Carried memories as keepsakes with a note and a source turn, never a modifier; cheapest continuity device there is. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-018 |

#### N-221 · The epilogue that puts the opening hopes beside today's values
| field | |
|---|---|
| kind | instrument |
| source | tgtl-chatgptsol5-6-2.0/app/components/atlas/StoryEpilogue.tsx · also: TGTL_PLAYABLE_LIFE_SIMULATION_SPEC.md §7; GRAPHICAL §15 Epilogue · also: MASTER_PROJECT_BRIEF.md §6B "Win-condition analysis" (L8585–8601), §"Cultural, family, and meta scorecards" (L3872–3889) |
| evidence | "The definition of success changed. No earlier outcome was recalculated or erased."  ·  "protecting a relationship did not grant control over its shape." |
| lands in | `components/play/Parse.tsx` / the campaign parse ("Against what you said winning meant") |
| doctrine check | pass |
| cost | M — gates: extends the parse's no-score gate; new gate: "the opening priority is read from the run's recorded first priority, never from the current one" |
| why worth having | reading the same run under the values you started with and the values you hold now is the single most honest thing a life review can do — and it makes changing your mind legible as adaptation instead of failure. |
| trunk dedupe | thinner in trunk — the trunk's parse reads against the *current* declared priorities and offers an aims audit mid-run, but never shows the two readings side by side at the end. |
| **architect's call** | **Adopt** — Read the finished run under the priorities you started with and the ones you ended with, side by side. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-019, SPECS-043, BRIEF-024 |

#### N-222 · Attribution counts, with the disclaimer that stops them becoming a blame ledger
| field | |
|---|---|
| kind | voice |
| source | tgtl-chatgptsol5-6-2.0/app/components/SimulationUI.tsx (`parse-attribution`) |
| evidence | "Counts show how often a source appeared in explanations, not how much blame or credit it deserves." |
| lands in | `components/play/Parse.tsx`, `lib/sim/parse.ts` |
| doctrine check | pass |
| cost | S — gates: extends S-12 (attribution set equality) |
| why worth having | the trunk computes the split correctly; the moment it is aggregated a reader will read it as a verdict on their choices. One sentence pre-empts that. |
| trunk dedupe | thinner in trunk — the six categories and the computed split are present; the aggregate view and this framing line are not. |
| **architect's call** | **Adopt** — The attribution-counts disclaimer before any aggregate view renders. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-020 |

#### N-223 · The content-version drift notice
| field | |
|---|---|
| kind | voice |
| source | tgtl-chatgptsol5-6-2.0/app/components/SimulationUI.tsx (`SimulationRunner`) |
| evidence | "Earlier explanations remain unchanged. New decisions use {campaign.contentVersion}; a version change is not a controlled counterfactual." |
| lands in | `components/sim/CampaignApp.tsx`, `lib/sim/persist.ts` |
| doctrine check | pass |
| cost | S — gates: extends the migration-honesty gate |
| why worth having | a run resumed after a content update is a mixed record; saying so is the difference between honest persistence and a quiet rewrite. |
| trunk dedupe | thinner in trunk — the trunk declares an older-engine save unresumable, but a save that *is* resumable across a content bump carries no notice. |
| **architect's call** | **Adopt** — A content-version drift notice on a resumed run. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-021 |

#### N-224 · Branch comparison that refuses to be called a controlled experiment
| field | |
|---|---|
| kind | voice |
| source | tgtl-chatgptsol5-6-2.0/app/components/SimulationUI.tsx (`BranchComparison`) |
| evidence | "Different ages or versions are not controlled experiments. Each explanation retains its original version." |
| lands in | `components/sim/LabApp.tsx` comparison view |
| doctrine check | pass |
| cost | S — gates: extends the Lab's shared-ancestor gate |
| why worth having | the Lab's whole value is comparison; naming exactly when a comparison stops being valid is what keeps it teaching rather than persuading. |
| trunk dedupe | thinner in trunk — the trunk's Lab constrains the axes structurally (same situation, one varied thing), but does not narrate the failure case when a reader compares two unlike branches. |
| **architect's call** | **Adopt** — The Lab narrates when a comparison stops being controlled. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-022 |

#### N-225 · Declared unknowns in a Lab situation, beside the facts and constraints
| field | |
|---|---|
| kind | instrument |
| source | tgtl-chatgptsol5-6-2.0/content/play/decision-lab.mjs (`facts` / `constraints` / `unknowns`) |
| evidence | "Whether the credential is required by the actual target employers" |
| lands in | `content/sim/lab/situations.ts`, `components/sim/LabApp.tsx` |
| doctrine check | pass |
| cost | S — gates: new gate: "every Lab situation declares at least one unknown, rendered before the branches" |
| why worth having | naming what the fork cannot resolve before you fork is the honest counterweight to a comparison screen that looks decisive. |
| trunk dedupe | not in trunk — Lab situations declare a scene, contract, switching cost and axes, but not what is unknown. |
| **architect's call** | **Adopt** — Declared unknowns in every Lab situation, rendered before the branches. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-023 |

#### N-226 · Seven named save statuses, readback-verified writes, and quarantine of malformed originals
| field | |
|---|---|
| kind | architecture |
| source | tgtl-chatgptsol5-6-2.0/lib/simulation-storage.mjs (`SAVE_STATUSES`, `writeSaveStorage`, `inspectSaveCollection`) · also: TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §10.5, §19; handoff "Engineering requirements" |
| evidence | `if (storage.getItem(SIMULATION_STORAGE_KEY) !== text) throw new Error("Save verification failed")`  ·  "A run failed structural validation. No run has been loaded or overwritten" |
| lands in | `lib/sim/persist.ts`, `lib/engine/persist.ts`, the save UI |
| doctrine check | pass |
| cost | M — gates: extends the migration-honesty gate; new gate: "a blocked or full storage never reports Saved" (plant a throwing setItem, assert the Memory-only status) |
| why worth having | Sol's own 2.1 audit found the failure this fixes — saves that claimed success and were not there. Reading back what you wrote is four lines and the difference between a promise and a fact. |
| trunk dedupe | not in trunk — `lib/sim/persist.ts` writes JSON in a try/catch returning a boolean; there is no readback, no status vocabulary, and no quarantine path that preserves an unparseable original. |
| **architect's call** | **Adopt** — Honest save status with readback-verified writes and quarantine; the trunk's storage layer cannot fail and so always says saved. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-053, SPECS-049 |

#### N-227 · Two-step armed deletion, with the sibling-branch consequence stated
| field | |
|---|---|
| kind | presentation |
| source | tgtl-chatgptsol5-6-2.0/app/components/SimulationUI.tsx (`deleteArmed`, `SavedRunsPanel.clear`) |
| evidence | "The parent or sibling branches remain separate. This action cannot be undone by the Guidebook." |
| lands in | `components/ResetButton.tsx`, the saves panel at `/play` |
| doctrine check | pass |
| cost | S — gates: extends the erase-control gate |
| why worth having | erase-everything needs a second press and a plain statement of what survives; "cannot be undone *by the Guidebook*" is the precise, non-overclaiming phrasing. |
| trunk dedupe | thinner in trunk — the trunk states caps beside the erase control; the arm-then-confirm step and the sibling-branch line are not there. |
| **architect's call** | **Adopt** — Two-step armed deletion with the sibling-branch line; "cannot be undone by the Guidebook" is the honest phrasing. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-054 |

#### N-228 · Make the character's progression visible during play: skills, capabilities, roles, accommodations and maintenance load, not only at the end.
| field | |
|---|---|
| kind | instrument |
| source | TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §5.4, §10.4 (a named trust defect) · also: TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §5.2 |
| evidence | "simulated skills and progression are not visible on the character sheet" |
| lands in | `components/sim/CampaignApp.tsx` (state rail), a new character overlay |
| doctrine check | pass |
| cost | M — gates: new gate: *every state field the engine reads has a surface a player can reach mid-run.* |
| why worth having | the trunk's campaign genuinely has this defect. `SimState` carries `skills`, `capabilities`, `conditions` and `maintenanceDebt`; `CampaignApp.tsx` renders none of them (only the Life Arc's `components/play/StatePanel.tsx` shows skills). A player spends twenty-four seasons building things they cannot see. |
| trunk dedupe | thinner in trunk (skills render in the arc's state panel and in the campaign parse; they do not render during the campaign) |
| **architect's call** | **Adopt** — Show the state the engine already keeps during a campaign: skills, capabilities, conditions, maintenance load. Nothing new to model. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-022, SPECS-004 |

#### N-229 · Relationships as an orbit of people, each with a visible independent objective and limit — and no visualisation that implies ownership.
| field | |
|---|---|
| kind | instrument |
| source | TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §5.4 · also: tgtl-chatgptsol5-6-2.0/app/components/atlas/AtlasJournal.tsx (`RelationshipOrbit`); SimulationUI.tsx (`protectedRelationship` field) |
| evidence | "no visualization may imply ownership. Each character has a visible independent objective and may move without the player choosing it." |
| lands in | `components/sim/CampaignApp.tsx` (`CompanionRail`), `content/sim/campaign/companions` |
| doctrine check | pass |
| cost | M — gates: extends S-3's companion coverage with a rendering assertion (each companion's own objective and limit are on screen) |
| why worth having | showing the *limit* before the player tests it is the honest version of "other people have agency" — it stops the refusal from reading as a punishment for a wrong move. |
| trunk dedupe | thinner in trunk (`CompanionRail` lists companions and their state; their objectives and limits live in content and surface only when triggered) |
| **architect's call** | **Adopt** — Companions' objectives and limits on screen before the player tests them. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-023, SOL2-006 |

#### N-230 · The Life Path: branch points that visibly split, delayed consequences drawn as threads to future nodes, and doors that are open, narrowed, closed or recoverable — with nonjudgmental distinct treatments.
| field | |
|---|---|
| kind | instrument |
| source | TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §5.5, §1 |
| evidence | "closed, open, and recoverable doors have distinct nonjudgmental treatments" |
| lands in | `components/sim/instruments/Instruments.tsx` (`Timeline`, `Queue`), `lib/sim/queue.ts` |
| doctrine check | pass — the adjacent clause matters as much: future chapter titles may be visible while uncertain events stay concealed, which is the trunk's existing rule that the queue never reveals genuinely uncertain events |
| cost | M — gates: extends S-11 (every queue entry resolves, re-queues with cause, or expires visibly) with a *rendered* thread per entry |
| why worth having | the trunk computes all of it — the queue with in-world timing, fork points, "still reachable from here" — and renders it as three separate lists. One drawn path is the same information in the shape people actually reason about. |
| trunk dedupe | thinner in trunk (`Timeline` renders 24 ticks with a played/branch/pending legend and a milestone list; nothing connects a pending consequence to the season it will land in) |
| **architect's call** | **Adapt** — Draw the pending consequence as a thread to the season it lands in; the queue, the timeline and the fork list are one picture. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-021 |

#### N-231 · A failure taxonomy: name *which kind* of mismatch a setback was, from eleven authored types, and never as a verdict.
| field | |
|---|---|
| kind | mechanic |
| source | TGTL_PLAYABLE_LIFE_SIMULATION_SPEC.md §10 · also: TGTL_PLAYABLE_LIFE_SIMULATION_SPEC.md §10 · also: MASTER_PROJECT_BRIEF.md "Inferred cross-cutting system: crisis, failure, loss, and recovery" → "Failure taxonomy" (L14276–14291) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "Failure is a diagnostic outcome, not a moral verdict." |
| lands in | `content/sim/schema.ts` (a field on failure-band outcomes), the explain drawer, `lib/sim/parse.ts` |
| doctrine check | pass — the eleven are entry-gate · skill · environment or culture · sustainability · resource or timing · relationship or values · health or capacity · systemic exclusion · maintenance collapse · sunk-cost escalation · **success at the wrong objective** |
| cost | M — gates: extends S-3's recovery-tie check: *the recovery route offered is the one that fits the named mismatch* (a skill mismatch offers practice; a systemic-exclusion mismatch does not) |
| why worth having | this is the strongest unbuilt idea in the playable spec. The trunk guarantees that a failure surfaces *a* recovery option; naming the mismatch makes that recovery the right one, and "systemic exclusion" and "success at the wrong objective" as first-class named outcomes are the site's own politics stated in the engine. |
| trunk dedupe | thinner in trunk (the recovery-tie rule guarantees a tied recovery option; nothing classifies the failure) |
| **architect's call** | **Adopt** — The failure taxonomy: name which mismatch a setback was so the tied recovery is the right one; systemic exclusion and success at the wrong objective as first-class outcomes. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-041, SPECS-042, BRIEF-035 |

#### N-232 · The Action Tray shows three to five contextual actions, grouped by intent, with every other viable path one control away — never removed.
| field | |
|---|---|
| kind | presentation |
| source | TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §5.3; SCENE_DRIVEN §7.3 |
| evidence | "No viable path should disappear; progressive disclosure controls cognitive load." |
| lands in | `components/sim/CampaignApp.tsx` (the action menu and its family filter) |
| doctrine check | pass — but the floor set (rest/maintain, wait, seek-help) must be inside the three-to-five, not behind the drawer; and blueprint 4.0 §3.4's "three affordable allocations spanning two families" must still hold *on the visible tray* |
| cost | M — gates: extends S-10 (the softlock/rails telemetry) with: *the default tray never exceeds five actions* (design constraint) *and always contains the floor set* |
| why worth having | the owner's standard is "user-friendly, smooth — not feature-rich". An open menu that respects a limited season is the point; a wall of it is the anti-goal. The five spec groups (respond · maintain or recover · advance the main thread · a side thread · ask/negotiate/wait/refuse/exit) are a better grouping than the nine card families for a season screen. |
| trunk dedupe | thinner in trunk (there is a family filter over the full available list, which is disclosure by *kind*; there is no contextual lead set and no cap) |
| **architect's call** | **Adapt** — A contextual lead set of three to five actions with the floor set always inside it and everything else one control away; the family filter stays. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-005 |

#### N-233 · Two standing presentation prohibitions: no combat skin, and colour may not smuggle a score back in.
| field | |
|---|---|
| kind | voice |
| source | TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §3.4, §3.5 |
| evidence | "Visual color cannot quietly recreate good/bad judgment. Mixed consequences should look mixed." |
| lands in | `content/terminology.json` (Game Guide edition vocabulary), the sim token set, `DECISIONS.md` |
| doctrine check | pass — this is the no-worth-score wall extended into the colour layer, which the trunk's wall does not currently reach |
| cost | S — gates: extends the edition-parity gate with a Game Guide vocabulary check (no swords, health bars, enemies, damage, boss fights); new gate: *no sim token pair encodes outcome valence as green/red across a resolution.* |
| why worth having | the trunk forbids a worth score in words and in numbers. A red panel on a failure band would reintroduce it silently, in the one channel nobody lints. |
| trunk dedupe | thinner in trunk (the no-score wall governs text and totals; the Game Guide edition has no stated forbidden-register list) --- |
| **architect's call** | **Adopt** — Colour may not smuggle a score back in; a gate that no sim token pair encodes valence across a resolution, and a Game Guide forbidden-register list. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-011 |

#### N-234 · The seeded-randomness contract, stated to the player: reproducible, forkable, inspectable, and always told when an outcome was partly the draw.
| field | |
|---|---|
| kind | instrument |
| source | TGTL_PLAYABLE_LIFE_SIMULATION_SPEC.md §9.2 |
| evidence | "Randomness represents uncertainty, not fate." |
| lands in | `/methodology`, the save inspector, `lib/sim/rng.ts` |
| doctrine check | pass |
| cost | S — gates: extends S-12 (attribution) — already asserts the draw is a rendered category when nonzero |
| why worth having | the trunk implements all of it (derived seeds, inspectable seed and versions on a save, the choice-vs-draw strip). What it does not do is say the sentence — "randomness represents uncertainty, not fate" is the reader-facing framing that makes the mechanism mean something. |
| trunk dedupe | thinner in trunk (the mechanism is complete and gate-proven; the framing is scattered across the methodology page rather than stated once) --- |
| **architect's call** | **Adopt** — "Randomness represents uncertainty, not fate" stated once where the seed is inspectable. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-050 |

#### N-235 · A restrained "try this in Play" entry from reading routes — the read → play direction, which the trunk only has in reverse.
| field | |
|---|---|
| kind | architecture |
| source | TGTL_PLAYABLE_LIFE_SIMULATION_SPEC.md §2 |
| evidence | "Relevant Guidebook pages may offer a restrained \"Try this in Play\" entry." |
| lands in | `/topics/*`, `/map/credential-decision`, `/situations/job-loss`, `content/routes.ts` |
| doctrine check | pass — **absolutely not on the five sensitive routes or any set-down route** (gate 2: no game vocabulary, no Play nav entry); the entry must be a link, never a nudge, and must go through `<Term>` |
| cost | S — gates: extends gate 2's set-down route check with an explicit "no play entry" assertion on the exclusion list |
| why worth having | the trunk's play layer is reachable from the entrance and from itself. A reader who has just read the credential decision has nowhere to go and try it. This is the cheapest way to make the two halves of the site one site — which is the 6.0 mandate. |
| trunk dedupe | thinner in trunk (the parse bridges play → `/guidance`, conditionally and generically; nothing bridges reading → play) |
| **architect's call** | **Adopt** — A restrained "try this in Play" link from ordinary reading routes, never on set-down routes; the reading-to-play direction the site lacks. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-045 |

#### N-237 · A multi-scale time model: the engine must not assume one turn is one fixed span, and scheduled effects must use explicit in-world time.
| field | |
|---|---|
| kind | architecture |
| source | TGTL_PLAYABLE_LIFE_SIMULATION_SPEC.md §5 |
| evidence | "The simulation contract must not assume that one turn always equals one year." |
| lands in | `lib/sim/season.ts`, `lib/sim/queue.ts`, `content/sim/schema.ts` |
| doctrine check | pass |
| cost | M — gates: new gate: *a queue entry's `due` is expressed in in-world time and resolves correctly under two different turn scales.* |
| why worth having | it is the enabling change for SPECS-039 and for every mode after Launch Window, and it is far cheaper now than after a second mode has hard-coded six months. The spec's scale list (weeks in infancy, a semester in adolescence, a day in acute crisis, a day in Daily Play) is also a map of where the site's own material already lives. |
| trunk dedupe | thinner in trunk (the queue's `due` is `{seasons | condition}`; the campaign is 24 fixed six-month seasons and the arc is acts) |
| **architect's call** | **Park** — A multi-scale time model is the enabling change for new modes and pointless without them; parked with N-207 and N-220. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-040 |

#### N-238 · The Play hub as an illustrated mode select, with saved runs as story records.
| field | |
|---|---|
| kind | presentation |
| source | TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §13.1 |
| evidence | "Each mode appears as a large visual book, diorama, or storyboard cover" |
| lands in | `components/sim/PlayDoor.tsx` (82 lines of text links today) |
| doctrine check | pass — accessible list equivalents are stated in the source and are non-optional |
| cost | S — gates: extends the JS-off floor (the door must still be a list of links without JS) |
| why worth having | cheap, and it is the first thing a player sees. The trunk already draws nine card-family motifs; the door is one place to reuse them. |
| trunk dedupe | thinner in trunk (`/play` is a one-screen text mode select with a recommended default) |
| **architect's call** | **Adapt** — The play hub as an illustrated mode select reusing the nine family motifs; a list of links underneath without JS. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-025 |

#### N-239 · The Decision Lab as a visual comparison: one shared establishing scene, three route doors, short storyboard futures, completed branches as parallel strips.
| field | |
|---|---|
| kind | presentation |
| source | TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §13.3 |
| evidence | "Numerical indices remain available only in the detailed comparison drawer." |
| lands in | `components/sim/LabApp.tsx` (249 lines) |
| doctrine check | pass — the trunk's three axes (choice-vary, draw-vary, position-vary) are better than the spec's unnamed "three routes" and must be what the three doors are labelled with |
| cost | M — gates: extends S-7 (fork isolation) and S-12 (attribution) with a rendering assertion |
| why worth having | the Lab exists to teach that the same decision under a different draw is a different life. Two strips side by side teach that in one look; two text columns require reading both. |
| trunk dedupe | thinner in trunk (branch compare renders side by side as text; the axes are labelled, the difference is not drawn) |
| **architect's call** | **Adapt** — The Lab as two parallel strips labelled with the trunk's three axes; the difference drawn, not only read. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-026 |

#### N-240 · Creation as a played scene: the priority chosen through the object or conversation most connected to it, then the camera pulls back to reveal the inherited hand.
| field | |
|---|---|
| kind | mechanic |
| source | TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §15 |
| evidence | "The player chooses one starting priority through the object or conversation most connected to it." |
| lands in | `components/sim/scene/Scene.tsx`, `components/sim/CampaignApp.tsx` (`HandChoice`, the priority instrument) |
| doctrine check | pass |
| cost | M — gates: extends the JS-off floor (the enumerated form stays underneath, per 4.0 §4.1) |
| why worth having | blueprint 4.0 §3.6 already stages the priority instrument behind a preset because the full ten-way instrument is too much at the door. This is the better version of that same staging: you meet the priorities by touching the things they are about, and the ten-way instrument stays one tap behind for anyone who wants it. |
| trunk dedupe | thinner in trunk (creation is a scene — void, Earth, books, dealt cards — and then a preset/priority chooser; the priorities themselves are chosen from a list) |
| **architect's call** | **Park** — Creation as a played scene depends on the scene layer; parked with N-220. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-038 |

#### N-241 · Optimal, secondary and tertiary routes shown — with "optimal" defined only against the stated objective and its assumptions.
| field | |
|---|---|
| kind | presentation |
| source | TGTL_PLAYABLE_LIFE_SIMULATION_SPEC.md §10 |
| evidence | "\"Optimal\" always means optimal for the stated objective under assumptions—not universally best." |
| lands in | the season briefing / action tray, `/map` |
| doctrine check | **stop-and-ask** — a ranked route list is one bad word away from a recommendation engine, and the trunk's no-recommendation state on `/guidance` exists precisely to refuse this. It is worth having only if the label is inseparable from the objective it was computed against. |
| cost | M — gates: new gate: *no route label renders without the objective it is optimal for adjacent to it.* |
| why worth having | honestly showing a second- and third-best route under a stated objective is more useful, and more honest, than showing an unranked list and pretending they are equivalent. The risk is real and the owner should decide. |
| trunk dedupe | not in trunk --- |
| **architect's call** | **Reject** — Ranked optimal, secondary and tertiary routes are one word from the recommendation engine /guidance exists to refuse. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-044 |

#### N-242 · Story identity fields that are expressive only, and say so
| field | |
|---|---|
| kind | presentation |
| source | tgtl-chatgptsol5-6-2.0/app/components/SimulationUI.tsx (`story-identity` fieldset) |
| evidence | "Name, pronouns, and presentation are expressive only. They never change capability, access, attraction, or difficulty."  ·  screenshot: records/consolidation/sol2/play-story.png |
| lands in | `components/play/Creation.tsx` / campaign creation |
| doctrine check | pass — no self-insertion (name/pronoun/colour/aspiration only, no self-description, no trait entry) |
| cost | S — gates: new gate: "no identity field appears in any engine input, seed, or modifier" (assert the creation payload's identity keys are absent from state derivation) |
| why worth having | a fictional person you can name is easier to watch honestly than "you"; stating that the field is inert is what keeps it from becoming character-creation-as-destiny. |
| trunk dedupe | not in trunk — personal character creation is a deferred owner decision (§12.4) and forbidden until revisited. **Flag for the architect:** this row may collide with that deferral; the distinction Sol draws is that these fields are provably inert, but the call is the owner's. |
| **architect's call** | **Reject** — Name and pronoun fields, however inert, reopen the personal-character-creation deferral the owner marked forbidden until revisited; the named fictional protagonist (N-220) is the compliant form. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-010 |

#### N-341 · The arc closes where it opened — the book shuts and returns to the ethereal library
| field | |
|---|---|
| kind | presentation |
| source | MASTER_PROJECT_BRIEF.md §6B "Completing the narrative arc" (L8302–8318) and "The final page and the books" (L8706–8718) |
| evidence | "This return creates symmetry without requiring the project to declare what literally happens after death." |
| lands in | `components/play/Parse.tsx` (the parse's closing frame) + `/` entrance return |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | the run currently ends in an analysis panel; the brief's ending gives the reader somewhere to stand afterwards, without asserting any cosmology. |
| trunk dedupe | thinner in trunk (`content/play/framing.ts` opens in the ethereal realm but nothing closes the loop) |
| **architect's call** | **Adopt** — Close the arc where it opened: the book shuts and the run returns to the ethereal library, asserting nothing about what follows. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-003 |

#### N-345 · A preload stage before the character reveal — prenatal conditions the player never chose
| field | |
|---|---|
| kind | mechanic |
| source | MASTER_PROJECT_BRIEF.md §14A "Proposed stage module: preload and prenatal development" (L10281–10321) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "The current Birth RNG concept begins at birth, but important character-generation conditions arise before the character reveal." |
| lands in | `content/timeline/stages.ts` (a stage before `stage-birth`), `components/play/Creation.tsx` |
| doctrine check | needs re-sourcing (numbers) — any prenatal figure must be fetched |
| cost | M — gates: new gate: the preload panel names no parental action as a cause of an outcome |
| why worth having | it makes visible the part of the hand dealt before anyone could have acted — and the brief is explicit that it must not become parental moral scoring. |
| trunk dedupe | not in trunk (Birth RNG in `lib/engine/hand.ts` starts at birth) |
| **architect's call** | **Park** — A prenatal preload stage needs fetched sources for anything it says and borders parental moral scoring; park. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-008 |

#### N-346 · A ten-dimension difficulty profile shown *before* any overall band
| field | |
|---|---|
| kind | instrument |
| source | MASTER_PROJECT_BRIEF.md §4A "Difficulty is multidimensional" (L735–762) |
| evidence | "The guide should therefore display a difficulty profile before reducing it to an overall tier." |
| lands in | `content/play/hand-axes.ts`, `components/play/DistributionStrip.tsx`, `/play/arc` creation |
| doctrine check | pass |
| cost | M — gates: extends the no-composite gate (a profile must never sum) |
| why worth having | the trunk's four axes (household, family, health, environment) already refuse a composite; the brief's ten (material, physical health, mental/cognitive, family, social, appearance, rights/discrimination, geography/safety, institutional access, historical meta) make the refusal *informative* rather than merely coarse. |
| trunk dedupe | thinner in trunk (`content/play/hand-axes.ts` — four axes, no rights/discrimination, appearance, institutional-access or meta axis) |
| **architect's call** | **Park** — Widening the hand's four axes toward ten re-runs the Birth RNG weights and S-8/S-10; the four were a deliberate 4.0 decision; park until a content need shows. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-009 |

#### N-349 · The starting-position card, with "how the tier was assigned" printed on it
| field | |
|---|---|
| kind | instrument |
| source | MASTER_PROJECT_BRIEF.md §4A "Possible difficulty card" (L855–874) and "Ranking methodology" (L875–894) |
| evidence | "The overall band should summarize the profile, not replace it." |
| lands in | `components/play/Creation.tsx`, `/walkthrough` |
| doctrine check | pass |
| cost | M — gates: new gate: no difficulty band renders without its dimension list and its weights |
| why worth having | the brief's requirement that weights be disclosed and re-weightable by the reader's chosen aim is the honest version of a difficulty label. |
| trunk dedupe | not in trunk |
| **architect's call** | **Reject** — A difficulty card with a band and printed weights reintroduces the composite tier 4.0 deleted on purpose; the per-axis constraint profile is the shipped form. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-013 |

#### N-350 · Birth RNG is hierarchical, not a bag of independent dice
| field | |
|---|---|
| kind | mechanic |
| source | MASTER_PROJECT_BRIEF.md §4A "Randomized does not mean independent" (L544–558) |
| evidence | "The setting is rolled first, and later attributes are drawn from the possibilities and probabilities created by that setting." |
| lands in | `lib/engine/hand.ts` |
| doctrine check | pass |
| cost | M — gates: new gate: no hand may be generated whose axes are drawn independently |
| why worth having | an independent roll teaches the wrong lesson — that the cards are unrelated — when correlation between them is the whole point of the birth lottery. |
| trunk dedupe | thinner in trunk (I did not find conditional sampling in `lib/engine/hand.ts`; worth Fable confirming) |
| **architect's call** | **Reject** — Already in the trunk: the Birth RNG draws conditionally (methodology publishes "the Birth RNG's conditional structure"); confirmed against lib/engine/hand.ts in the spot-check below. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-014 |

#### N-351 · "Roll a Human Life" — a historical character roll with a staged, dependency-ordered reveal
| field | |
|---|---|
| kind | mechanic |
| source | MASTER_PROJECT_BRIEF.md §4A "Character-roll presentation" (L5542–5567) · also: MASTER_PROJECT_BRIEF.md §4A "Rarity must remain visible" (L389–396) and "Odds of a starting position" (L5523–5541) · also: MASTER_PROJECT_BRIEF.md §4A "Comparing standard and preset paths" (L415–431), "What a preset should contain" (L365–388) |
| evidence | "World and era / Region and polity / Household and parents / Body and health / Status and rights / Resources and connections" |
| lands in | a new `/play/roll` or an era mode inside `/play/arc` |
| doctrine check | needs re-sourcing (numbers) — historically weighted odds are claims |
| cost | L — gates: extends T-1 (no digit without a fetched source) to historical prevalence |
| why worth having | it is the trunk's own wish-list item ("era-play in the Playthrough") with a concrete interaction attached, and the staged reveal *teaches* the dependency structure rather than asserting it. |
| trunk dedupe | thinner in trunk (`content/methodology.ts` WHATS_COMING names era-play; nothing is built) |
| **architect's call** | **Park** — Rolling a historical human life is the trunk's own era-play wish with an interaction attached; every historical odd is a claim to source; parked with era-play. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-015, BRIEF-016, BRIEF-017 |

#### N-353 · The end-of-life *phase* is not the post-mortem parse
| field | |
|---|---|
| kind | architecture |
| source | MASTER_PROJECT_BRIEF.md §6B "End-of-life phase versus post-mortem analysis" (L8320–8328) |
| evidence | "The post-mortem parse is not a medical autopsy. It is a complete run analysis." |
| lands in | `content/timeline/stages.ts` (`dying-and-closure`), `components/play/Parse.tsx` |
| doctrine check | touches a sensitive page → parked (routes to `/situations/a-death`, `/situations/grief`) |
| cost | S — gates: none new |
| why worth having | the trunk fuses "the last stretch of living" with "looking back at the whole thing"; separating them is what lets the first be gentle and the second be analytic. |
| trunk dedupe | thinner in trunk |
| **architect's call** | **Park** — Separating the end-of-life phase from the parse routes through two frozen pages; parked for the clinical reviewer. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-019 |

#### N-354 · A seven-family achievement catalogue that counts invisible and domestic contribution
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md §6B "Achievement list" (L8352–8435) · also: MASTER_PROJECT_BRIEF.md §6B "Achievement types" (L8436–8455) |
| evidence | "Achievements should include ordinary, relational, domestic, and invisible contributions rather than recognizing only wealth, prestige, fame, credentials" |
| lands in | `content/play/parse-copy.ts`, `lib/engine/run.ts` (`achievements`) |
| doctrine check | pass |
| cost | M — gates: new gate: the achievement set contains no rank, count or total |
| why worth having | it is the anti-worth-score in positive form — the site's clearest chance to say out loud that raising someone and being depended on are achievements. |
| trunk dedupe | thinner in trunk (`ParseSummary.achievements` is a flat string list with no families and no relational/legacy coverage) |
| **architect's call** | **Adapt** — Achievement families that count relational, domestic and invisible contribution in the parse; no rank, no count, no rarity digit. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-020, BRIEF-021 |

#### N-355 · Final statistics with a visible line between recorded, interpreted, and unknowable
| field | |
|---|---|
| kind | instrument |
| source | MASTER_PROJECT_BRIEF.md §6B "Final statistics" (L8456–8480) · also: MASTER_PROJECT_BRIEF.md "Experienced life versus remembered life" (L3195–3217) |
| evidence | "The interface should visibly distinguish recorded statistics from qualitative interpretation and unknowable experience." |
| lands in | `components/play/Parse.tsx` |
| doctrine check | pass |
| cost | S — gates: new gate: every parse panel declares which of the three it is |
| why worth having | it is the parse's version of the evidence label the timeline already carries, and it protects the most important parts of a life from being scored by omission. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — Every parse panel declares whether it is recorded, interpreted or unknowable; the parse's own evidence label. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-022, BRIEF-101 |

#### N-356 · Comparison with the baseline standard model, framed to explain rather than rank
| field | |
|---|---|
| kind | instrument |
| source | MASTER_PROJECT_BRIEF.md §6B "Comparison with the baseline" (L8558–8584) |
| evidence | "The comparison should explain difference rather than declare one life categorically superior." |
| lands in | `components/play/Parse.tsx`, `/play/lab` |
| doctrine check | pass |
| cost | M — gates: extends the no-verdict rule in `lib/sim/parse.ts` |
| why worth having | readers will compare themselves anyway; giving them a comparison that is explicitly about mechanism is better than leaving them to invent one. |
| trunk dedupe | not in trunk |
| **architect's call** | **Reject** — Comparing a run to a baseline standard model invites a ranking however it is framed; the Lab compares branches of the same run, which is the honest form. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-023 |

#### N-357 · "Run so far" for living readers — a present-tense parse that settles nothing
| field | |
|---|---|
| kind | safety |
| source | MASTER_PROJECT_BRIEF.md §6B "Living users" (L8636–8650) |
| evidence | "The post-mortem frame should never imply that a living user's future is already settled." |
| lands in | `/character`, `/character/logs` |
| doctrine check | pass |
| cost | S — gates: new gate: no "run so far" surface names an unfinished item the reader did not name |
| why worth having | the brief's "unfinished business: user-selected rather than algorithmically shaming" is exactly the line between a useful review and a nagging one. |
| trunk dedupe | not in trunk |
| **architect's call** | **Reject** — A present-tense parse of the reader's own life is reader assessment; the character is played, the reader never is. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-025 |

#### N-361 · Quests compete for named finite resources — conflicts *and* synergies
| field | |
|---|---|
| kind | mechanic |
| source | MASTER_PROJECT_BRIEF.md §7A "Quest costs and conflicts" (L9056–9080) |
| evidence | "A caregiving quest limiting career progression while strengthening relationships and meaning" |
| lands in | `lib/sim/economy.ts`, `/guidance/daily-plan` |
| doctrine check | pass |
| cost | M — gates: none new |
| why worth having | the campaign already has a season budget; naming *which* currency each aim consumes turns the budget from a game constraint into an explanation. |
| trunk dedupe | thinner in trunk (`lib/sim/economy.ts` budgets seasons; the cross-quest conflict/synergy language is not surfaced) |
| **architect's call** | **Adapt** — Name the currency each aim consumes in the campaign briefing and the explain drawer; the budget becomes an explanation, the engine is unchanged. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-030 |

#### N-362 · The five sources of an outcome — spawn, build, party, meta, RNG
| field | |
|---|---|
| kind | architecture |
| source | MASTER_PROJECT_BRIEF.md "Inferred design rule: distinguish five sources of an outcome" (L14536–14551) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "It prevents the guide from treating outcomes as either entirely chosen or entirely predetermined." |
| lands in | `lib/sim/attribution.ts`, `/play/lab`, `components/play/Parse.tsx` |
| doctrine check | pass |
| cost | M — gates: new gate: every attribution surface names all five categories or says which are unknown |
| why worth having | the Decision Lab already splits three ways (decision / draw / position); the brief's two extra — *party* and *meta* — are precisely the ones a reader is most likely to mis-assign to themselves. |
| trunk dedupe | thinner in trunk (`ATTRIBUTION_CATEGORIES` in `content/sim/schema.ts` — three, not five) |
| **architect's call** | **Adapt** — Align the Lab's three-way reading with the campaign's six attribution categories so party and meta are named where a reader would otherwise blame themselves. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-031 |

#### N-366 · Agency is not constant — happens to / decided for / decided with / decided by
| field | |
|---|---|
| kind | voice |
| source | MASTER_PROJECT_BRIEF.md §6A "Agency changes over the life course" (L8250–8263) |
| evidence | "Events that happen to a person / Decisions made for a person / Decisions made with a person / Decisions made by a person" |
| lands in | `/play/arc` (act framing), `/map` (early stages), `/walkthrough` |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | it is the correct answer to the hardest objection to a life *simulator* — that the early acts present choices a child never had — and it costs four words per act. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — Happens to, decided for, decided with, decided by: four words per act on the arc and the early map stages. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-037 |

#### N-404 · The character sheet reveals itself across seven life snapshots
| field | |
|---|---|
| kind | mechanic |
| source | MASTER_PROJECT_BRIEF.md "Character-sheet reveal across life" (L4881–4894), "Starting attributes" (L986–1013) |
| evidence | "The guide should not claim to read a newborn's complete intelligence, personality, or future potential." |
| lands in | `components/play/StatePanel.tsx`, `components/CharacterSheet.tsx` |
| doctrine check | pass |
| cost | M — gates: new gate: an unrevealed stat renders as unknown, never as low |
| why worth having | fogged stats with confidence that grows is a mechanic and an epistemics lesson at once — and the trunk already ships "Unknown" as a valid band, so the doctrine is in place and the mechanic is not. |
| trunk dedupe | thinner in trunk (`content/character.ts` has band "Unknown" with "'unknown' is a valid value, not a low one"; nothing reveals over time) |
| **architect's call** | **Adapt** — The arc's progressive HUD already reveals by act; add the fog rule as a gate: an unrevealed stat renders unknown, never low. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-090 |


### I. Play layer (scenes, story & new modes)

#### N-220 · "The Years Between" — a 22-scene authored life campaign (ages 18–36) as a fourth play mode
| field | |
|---|---|
| kind | content |
| source | tgtl-chatgptsol5-6-2.0/content/play/story/{graph,act-one…act-five,endings,index}.mjs; route `/play/story` · also: TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §13; SCENE_DRIVEN §10.2 · also: TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §11–§15 · also: TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §15 · also: TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §14 · also: TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §18 · also: TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §16 · also: tgtl-chatgptsol5-6-2.0/content/play/story/graph.mjs (`kitchen-door`, `exhibition`, `archive-room` flagged optional) · also: tgtl-chatgptsol5-6-2.0/content/play/story/endings.mjs · also: tgtl-chatgptsol5-6-2.0/content/play/story/graph.mjs |
| evidence | "22 major scenes, three optional detours, five origins and authored epilogues" (README.md)  ·  screenshot: records/consolidation/sol2/play-story.png |
| lands in | a new `content/sim/story/` beside `content/sim/campaign/`, surfaced at `/play/story` |
| doctrine check | pass (all effects labelled `illustrative`; no digits rendered) |
| cost | L — gates: extends S-1 (crisis/loss lint over the new corpus), S-3 (every scene has a recovery-bearing response), S-10 (multiple credible routes per origin); new gate: "every declared scene-graph edge resolves to a declared node" |
| why worth having | the trunk's two campaigns are procedural (card pool, season allocation). This is the one continuous authored life, where a choice at nineteen returns at thirty-one by name — the thing that makes a simulation feel like a life rather than a spreadsheet. |
| trunk dedupe | not in trunk. `/play/arc` fills act slots from a deterministic card pool; `/play/campaign` is 24 fixed seasons. Neither has a scene graph, authored acts, or an epilogue. |
| **architect's call** | **Park** — The Years Between is the one authored continuous life in the archive and the largest single item; it is a version's worth of work on its own. Park for the owner's explicit decision, with Sol's 22 scenes and the spec's five acts as the donor set. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-004, SPECS-037, SPECS-032, SPECS-033, SPECS-034, SPECS-035, SPECS-036, SOL2-005, SOL2-011, SOL2-055 |

#### N-250 · The Living Scene: a data-driven, layered illustration of *where you are now*, assembled from semantic SVG/HTML rather than one flat image.
| field | |
|---|---|
| kind | presentation |
| source | TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §5.1; SCENE_DRIVEN §6.2 · also: TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §9 (§9.1 housing · §9.2 work/education · §9.3 health/capacity · §9.4 relationships · §9.5 meaning/autonomy/projects) · also: TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §8 · also: tgtl-chatgptsol5-6-2.0/SCENE_ARCHITECTURE.md, SCENE_VISUAL_BIBLE.md, lib/scene-consequence.mjs (source present, disconnected from routes) · also: TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §7.1 · also: TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §7.2 · also: TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §21 (twenty-two named fields); handoff "Scene data" · also: TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §5.1, §5.2, §5.3 · also: TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §7; SCENE_DRIVEN §5.2 · also: TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §18 · also: TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §22; handoff "Save and resume" · also: TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §13.4 · also: TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §20; SCENE_DRIVEN §11 · also: TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §10.1, §10.3 · also: tgtl-chatgptsol5-6-2.0/SCENE_VISUAL_BIBLE.md; app/components/game/art/ |
| evidence | "The central illustration shows the current situation. It is assembled from data-driven SVG and semantic HTML layers rather than one flat image." |
| lands in | `components/sim/scene/` (new `SceneStage`), `content/sim/` (new scene/location content dir) |
| doctrine check | pass |
| cost | L — gates: extends the 4.0 §4.3 graphical floor (add: a scene exists and its layers derive from state); extends S-9 (text over solid token plates, already the Scene.tsx pattern) |
| why worth having | layers named by the spec — location and time, housing condition, workplace, role, obligations and projects, other people present, patch conditions, visible exits — are exactly the state a season briefing currently spells out in prose. Drawing them is the "realism over simplification" doctrine applied to presentation. |
| trunk dedupe | thinner in trunk (`components/sim/scene/Scene.tsx` is a creation-only backdrop — void, Earth, two books, dealt cards; nothing renders the *situation*, and the scene is never seen again after the hand is chosen) |
| **architect's call** | **Park** — One Living Scene for the season screen is the vertical slice 4.0 §4.3 demands and the owner's art checkpoint has not yet been held on the instruments; park until the checkpoint is taken. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-003, SPECS-008, SPECS-007, SOL2-056, SPECS-013, SPECS-014, SPECS-015, SPECS-016, SPECS-017, SPECS-018, SPECS-019, SPECS-027, SPECS-030, SPECS-031, SOL2-057 |

#### N-251 · A dedicated game shell: compact top bar, scene stage, state-dependent bottom dock, and overlays — replacing the article page as the play container.
| field | |
|---|---|
| kind | architecture |
| source | TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §6, §20 |
| evidence | "The full editorial site navigation should not compete with the game while a scene is active." |
| lands in | `app/play/campaign/`, `app/play/lab/`, `app/play/arc/`, `components/sim/` (new `GameShell`) |
| doctrine check | **stop-and-ask** on one point — suppressing site chrome must not suppress Help-now, quick exit, or the edition control. The spec keeps Set Down / Help in the top bar; the trunk's wall is "Help-now on every route without a menu", and a play shell that hides the header must carry it explicitly. |
| cost | L — gates: extends the Help-now-reachable-from-every-state assertion in S-4 |
| why worth having | the seven dock states (Look · Dialogue · Decision · Plan · Consequence · Travel · Chapter transition) are a genuinely better model of a turn than one long page with sections, and they are what makes a keyboard path short. |
| trunk dedupe | not in trunk (play routes are ordinary site pages under the full header) |
| **architect's call** | **Reject** — A game shell that suppresses site chrome collides with Help-now on every route; the play routes stay ordinary pages under the header. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-012 |

#### N-252 · Every graphic on a play surface must be a rendering of canonical simulation state, and it is a gate, not an intention.
| field | |
|---|---|
| kind | architecture |
| source | TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §3.1 (+ handoff "Graphical standard") · also: TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §8 |
| evidence | "Never maintain a decorative graphic state that can disagree with the simulation engine." |
| lands in | `components/sim/instruments/`, `components/sim/scene/`, `tests/` (new gate script) |
| doctrine check | pass |
| cost | S — gates: new gate: *no play graphic reads from any store other than the canonical `SimState`/resolution result; a plant-and-restore probe desynchronises a drawn instrument from its state and the gate goes red.* |
| why worth having | it is the difference between a picture of a life and a life you can see; it also stops a future executor from "fixing" a visual by lying about the state behind it. |
| trunk dedupe | thinner in trunk (4.0 §4.1 names six canonical instruments drawn once and reused; nothing asserts that a graphic cannot hold state of its own, and no gate proves it) |
| **architect's call** | **Adopt** — Graphics render canonical state and a gate proves it; free now while the six instruments are all there is, and it binds any scene later. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-001, SPECS-006 |

#### N-253 · Safety presentation rules for a graphical layer: a safety transition replaces the scene with calm plain help and never animates damage or failure.
| field | |
|---|---|
| kind | safety |
| source | TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §21; SCENE_DRIVEN §19 · also: TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §27 · also: TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §25; SCENE_DRIVEN §27 |
| evidence | "Safety transitions replace the graphical scene with calm, plain help; they do not animate damage or failure." |
| lands in | `content/exclusions.ts` (as commentary, not a list change), `KNOWN_LIMITATIONS.md`, the scene renderer |
| doctrine check | pass — the exclusion lists themselves are **never rebalanced**; this only governs what happens at the boundary the lists already draw |
| cost | S — gates: extends the crisis-tier gate with a rendering assertion (*no scene layer, motion, or storyboard frame renders on a set-down transition*) |
| why worth having | the trunk's crisis-tier wall is currently enforced by content never *being* playable. The moment a scene layer exists, the wall needs a second clause about presentation, and the four companion rules the spec states are the right ones: health through capacity, symptoms, support, access and accommodation and never grotesque visuals; discrimination and systemic exclusion never rendered as character debuffs; parenthood and childlessness never scored; appearance never determining worth. |
| trunk dedupe | thinner in trunk (the exclusion lists and normative lint govern *whether* content is playable; nothing yet governs how a transition out of play must look) |
| **architect's call** | **Adopt** — Safety presentation rules for any graphical layer, written into the walls now: a safety transition never animates damage, discrimination is never a debuff, appearance never worth. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-047, SPECS-048, SPECS-058 |

#### N-254 · Three automated assertions the trunk's roster does not have: preview purity, graphical/accessible action parity, and scene-first-by-default.
| field | |
|---|---|
| kind | architecture |
| source | TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §24; SCENE_DRIVEN §25 |
| evidence | "hotspot and list modes expose identical actions" |
| lands in | `tests/`, `tests/falsify-walls.sh` |
| doctrine check | pass |
| cost | M — gates: new gates: *(a) a focused, uncommitted option leaves canonical state byte-identical; (b) the hotspot path and the list path yield the same action set and the same outcome from the same state; (c) no gameplay route renders as a long editorial page by default.* |
| why worth having | (a) is what keeps SPECS-002 honest; (b) is what keeps SPECS-018 from becoming a promise; (c) is the only mechanical version of the screenshot test. Each is plant-and-restore falsifiable, which is the trunk's standard. |
| trunk dedupe | not in trunk (S-1 through S-12 cover content, safety, forks, attribution and rails; none covers presentation integrity) |
| **architect's call** | **Adopt** — Preview purity and graphical/accessible action parity as gates; the first binds N-212 today, the second binds any scene later. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-054 |

#### N-255 · Visual bible first: settle the style, model sheets and one complete scene before authoring at scale — and record the asset provenance.
| field | |
|---|---|
| kind | architecture |
| source | TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §12, §23 Phases 1–2 · also: TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §26; POLISH_PATCH "Required qualitative review" |
| evidence | "Verify that a screenshot looks like a game before engineering the complete story." |
| lands in | `DECISIONS.md`, `records/`, `components/sim/scene/` |
| doctrine check | pass — the trunk's all-art-in-repo rule (no external assets, no photographs, no AI-photo look) is stricter than the spec's and governs; the provenance discipline still applies to anything generated as a *reference* |
| cost | S — gates: extends blueprint 4.0 §4.3 (the vertical slice ships at final art direction, which is what the owner's art checkpoint reviews) with a *named artefact* the checkpoint reads |
| why worth having | this is the same rule the trunk already believes (4.0 §4.3, and §12's owner art checkpoint) — and the same rule `KNOWN_LIMITATIONS.md` §0.1.5 records being broken on the timeline, where content scaled before the art was reviewed. Twice-learned is worth writing down. |
| trunk dedupe | thinner in trunk (the vertical-slice-at-final-art rule exists; there is no visual bible artefact and no provenance record shape) |
| **architect's call** | **Adopt** — Visual bible first, and a named artefact the art checkpoint reads; the rule the timeline broke, written down. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-057, SPECS-052 |

#### N-256 · Rejection tests — a list of conditions under which the work is *not* done, stated before the work starts.
| field | |
|---|---|
| kind | architecture |
| source | TGTL_SCENE_DRIVEN_GAME_OVERHAUL_SPEC.md §28; handoff "Mandatory rejection criteria" |
| evidence | "the executor stops after the visual bible, first scene, or first act" |
| lands in | `DECISIONS.md`, the 6.0 handoff's acceptance section |
| doctrine check | pass |
| cost | S — gates: a new record shape rather than a new script |
| why worth having | it is a genuinely different instrument from the trunk's gates. A gate says an assertion holds; a rejection test names the *plausible half-finished state* that would otherwise be shipped as done — "a scene is only a background behind panels", "consequences are explained but not depicted", "the epilogue is only a text parse", "existing screenshots are reused as proof". The trunk's falsification discipline ("a gate is not a gate until it has been shown to fail") and this list are the same instinct pointed at different failures. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — Rejection tests stated before the work starts: the plausible half-finished states that must not ship as done; goes into the 6.0 blueprint's acceptance section. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-053 |

#### N-257 · A human-playthrough protocol: named routes, required properties per route, and a recorded observation set — with automated reachability explicitly not counting.
| field | |
|---|---|
| kind | architecture |
| source | TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §23; SCENE_DRIVEN §24 · also: TGTL_GRAPHICAL_PLAY_MAJOR_UPDATE_SPEC.md §28 · also: tgtl-chatgptsol5-6-2.0/SCENE_RELEASE_REPORT.md; PLAYTHROUGH_NOTES.md; review/legacy-2.2-playthrough_notes.md |
| evidence | "Automated reachability is not sufficient." |
| lands in | `records/`, `KNOWN_LIMITATIONS.md` §1, `README.md` |
| doctrine check | pass |
| cost | M — gates: new gate: *a release claiming the play layer is playable carries a dated playthrough record naming its route, its setback, its recovery and its resume.* |
| why worth having | `KNOWN_LIMITATIONS.md` §1 already lists "an independent acceptance review of the 4.0 play layer" as an open human gate — this is the *shape* that gate should take, from a route that learned it the hard way. The required properties are the good part: at least one run must include a major setback and recovery, one must revise its definition of success, and one must be saved, closed and resumed in another sitting. The observation set to record — pacing, confusing moments, dominant actions, dead text, repetitive scenes, graphical states that failed to communicate — is a better review rubric than "is it fun". |
| trunk dedupe | thinner in trunk (the play-layer acceptance review is named as an open gate; nothing specifies what would close it) |
| **architect's call** | **Adopt** — A human-playthrough protocol as the shape of the open 4.0 review gate: named routes, a setback and recovery, a revised success, a resume across sittings, an observation set. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SPECS-051, SPECS-056, SOL2-060 |


### J. Safety & threshold

#### N-260 · The England-only correction: 0808 2000 247 does not cover the UK, and Ireland is not the UK
| field | |
|---|---|
| kind | safety |
| source | tgtl-chatgptsol5-6-2.0/SAFETY_SOURCES.md (United Kingdom / Republic of Ireland sections) · also: tgtl-chatgptsol5-6-2.0/tests/content-audit.mjs (lines 32–47) |
| evidence | "the displayed National Domestic Abuse Helpline number, 0808 2000 247, serves England" |
| lands in | `content/hotlines.ts` (`hotline-uk-dv`, currently `regions: "United Kingdom"`), `content/safety-resources.json` (currently one combined `safety-uk-ireland` region) |
| doctrine check | needs re-sourcing (numbers) — Sol's claim is a claim, not a source; GOV.UK's domestic-abuse guidance page and the HSE / Women's Aid pages must be fetched and quoted before the labels change |
| cost | M — gates: extends G-10; new gate: "no rendered region label is broader than the verified coverage of the numbers inside it", proven by planting a UK-labelled England-only number |
| why worth having | a woman in Belfast, Glasgow or Cardiff who calls an England-only line and is redirected has spent the one call she could safely make. This is the highest-stakes correctness finding in the sweep. |
| trunk dedupe | thinner in trunk — the trunk labels 0808 2000 247 `regions: "United Kingdom"` with no nation directory, and `content/safety-resources.json` combines "United Kingdom and Republic of Ireland" into one region with no Irish abuse service. (That JSON is currently unreferenced by the live trunk; `content/hotlines.ts` is the live fixture and carries the same label.) |
| **architect's call** | **Adopt** — The England-only correction: re-source 0808 2000 247's coverage, split the UK nations and Ireland, give Ireland its own routes; highest stakes, smallest content. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-047, SOL2-058 |

#### N-261 · A location selector on the help route, with a scope line under every number
| field | |
|---|---|
| kind | safety |
| source | tgtl-chatgptsol5-6-2.0/app/components/SituationPages.tsx (`/help-now`); content/safety-resources.json |
| evidence | "Numbers are not assumed to work across borders."  ·  screenshot: records/consolidation/sol2/help-now.png |
| lands in | `app/threshold/page.tsx`, `components/HotlineList.tsx`, `content/hotlines.ts` |
| doctrine check | needs re-sourcing (numbers) — every contact must be re-fetched per T-1 before it renders; the *structure* is the nugget |
| cost | M — gates: extends G-10 (no invented number); new gate: "every rendered contact carries a scope statement no broader than its verified coverage" |
| why worth having | the trunk lists every region's numbers at once with a region label; Sol asks once, shows the two numbers that apply, states their scope, and shows an explicit unverified-region state instead of a plausible-looking fallback. |
| trunk dedupe | thinner in trunk — `components/HotlineList.tsx` renders a `regions` string per hotline; there is no selector, no per-number scope statement, and no unverified-region state. |
| **architect's call** | **Adapt** — A scope line under every number and an explicit unverified-region state; no selector, the page stays a list with nothing to operate. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-046 |

#### N-262 · Monitored-device honesty: private browsing is not enough, and say what it does not hide
| field | |
|---|---|
| kind | safety |
| source | tgtl-chatgptsol5-6-2.0/app/components/SituationPages.tsx (`IF THIS DEVICE OR BROWSER MAY BE MONITORED`) |
| evidence | "Private browsing can reduce local history, but it does not hide activity from device monitoring, networks, employers, or account-level logs." |
| lands in | `app/threshold/page.tsx#privacy` |
| doctrine check | pass — no number, no service claim |
| cost | S — gates: extends the quick-exit honesty gate |
| why worth having | the trunk's privacy list opens with "Use a private or incognito window", which is the single most common false reassurance in this space. Sol's six lines add device monitoring, network/employer/account logs, and the fact that calls and texts can appear in bills. |
| trunk dedupe | thinner in trunk — `app/threshold/page.tsx#privacy` has three bullets and no incognito caveat. |
| **architect's call** | **Adopt** — Monitored-device honesty: private browsing is not enough, and say what it does not hide; the trunk's privacy list opens with the false reassurance. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-048 |

#### N-263 · Double-Escape as a keyboard quick exit on sensitive routes
| field | |
|---|---|
| kind | safety |
| source | tgtl-chatgptsol5-6-2.0/app/components/SiteShell.tsx (900 ms escape-count window) |
| evidence | "Pressing Escape twice also triggers this exit on sensitive pages." |
| lands in | `components/SiteChrome.tsx` (beside the existing "Leave this page" control) |
| doctrine check | pass — a shell behaviour; it does not edit any sensitive page source |
| cost | S — gates: new gate: "double-Escape exits from every route the set-down list marks sensitive" (plant a route omission, assert red) |
| why worth having | the reader who most needs quick exit is often the one who cannot reach or aim at a button, and whose screen is being read over their shoulder right now. |
| trunk dedupe | not in trunk — the trunk's quick exit is a click target only. |
| **architect's call** | **Adopt** — Double-Escape as a keyboard quick exit on set-down routes; the reader who most needs it may not be able to aim at a button. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-049 |

#### N-264 · A runtime safety pause in the engine, as a backstop beneath the exclusion lint
| field | |
|---|---|
| kind | safety |
| source | tgtl-chatgptsol5-6-2.0/lib/simulation-engine.mjs (`triggerSafetyTransition`, `resolveTurn` line 357) |
| evidence | "Play stops here. If this resembles real life, the next screen uses calm language and location-aware support." |
| lands in | `lib/sim/season.ts` / `lib/sim/campaign.ts` resolution path, `components/sim/CampaignApp.tsx` |
| doctrine check | pass — this **adds** a runtime stop; it does not rebalance `content/exclusions.ts` or the normative lint, and must not be presented as a reason to relax either |
| cost | M — gates: new gate: "an action carrying a safety signal aborts resolution, forces set-down, and routes to /threshold — with the run marked paused and nothing committed" |
| why worth having | the trunk's defence is a build-time lint plus a human pass. A runtime stop is defence in depth: if crisis-tier content ever reaches a resolution, play halts rather than resolving it into a state change. - honest note: in Sol the capability exists but **no shipped content sets `safetySignal`** — it is a latent backstop, not an exercised one. It would need its own proven-red probe. |
| trunk dedupe | not in trunk — `content/exclusions.ts` prevents the content existing; nothing stops the engine if it ever does. |
| **architect's call** | **Adapt** — A runtime safety pause beneath the exclusion lint as defence in depth; never a reason to relax the lint, and it needs its own proven-red probe. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-050 |

#### N-265 · The sensitive-route banner that reassures the preference was not changed
| field | |
|---|---|
| kind | voice |
| source | tgtl-chatgptsol5-6-2.0/app/components/SiteShell.tsx (`safety-override`) · also: gol-opus5/mechanics/registers.html + board/layout-recently-bereaved.html |
| evidence | "This page uses calm, plain language. Your reading preference has not been changed." |
| lands in | `components/SetDownNotice.tsx` |
| doctrine check | pass |
| cost | S — gates: extends the forced-set-down gate |
| why worth having | the trunk's set-down notice explains *why* the frame is put away but not that the reader's own setting survives — which is exactly what someone wonders when a control they chose visibly stops working. |
| trunk dedupe | thinner in trunk — `SetDownNotice` renders only in the Game edition and only explains the gamification refusal. |
| **architect's call** | **Adopt** — The set-down notice says the reader's own preference was not changed. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-051, OPUS5-021 |

#### N-266 · A per-page footer that names exactly what is stored — and what the application cannot see
| field | |
|---|---|
| kind | voice |
| source | tgtl-chatgptsol5-6-2.0/app/components/SiteShell.tsx (footer privacy disclosure) |
| evidence | "Safety-page visits are not recorded by the application. Browser, device, network, or employer records may still exist." |
| lands in | `components/SiteChrome.tsx` footer, `/methodology` |
| doctrine check | pass |
| cost | S — gates: extends the local-only gate |
| why worth having | the second sentence is the honest half most privacy notes omit; it is also the sentence that makes the first one believable. |
| trunk dedupe | thinner in trunk — the trunk footer says "No account, no analytics, no score. Anything you write stays in this browser" without the external-records caveat. --- |
| **architect's call** | **Adopt** — The footer names what is stored and what the application cannot see; the second sentence makes the first believable. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-052 |

#### N-267 · A standing safety-sources record with a maintenance rule, separate from the fixture
| field | |
|---|---|
| kind | architecture |
| source | tgtl-chatgptsol5-6-2.0/SAFETY_SOURCES.md ("Maintenance rule") |
| evidence | "If a region cannot be verified, remove the number and show the explicit unavailable or directory fallback state." |
| lands in | a `SAFETY_SOURCES.md` beside `KNOWN_LIMITATIONS.md`, referenced from `content/hotlines.ts` |
| doctrine check | pass |
| cost | S — gates: new gate: "every region in the fixture has a matching entry in the sources record, with a verification date not older than the fixture's" |
| why worth having | a prose record of what was checked, on which primary page, with the scope caveats spelled out — and a rule that a routing change is explicitly *not* a re-verification. The trunk's hotline sign-off lives in an audit that will scroll away; this is a document that gets re-read before each release. |
| trunk dedupe | thinner in trunk — `content/hotlines.ts` carries `sourceUrl` + `lastVerified` per number and a header comment about the 2026-09-04 pass; there is no standing record with a stated maintenance rule. |
| **architect's call** | **Adopt** — A standing SAFETY_SOURCES record with a maintenance rule and a gate tying every fixture region to it; the sign-off stops scrolling away in an audit. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-061 |

#### N-268 · "A favorable score must never override abuse or safety warnings"
| field | |
|---|---|
| kind | safety |
| source | `blueprint_ChatGPTSol5-6.md` §SCR-016 rules; implemented in `content/guidance-fixtures.json` (`compatibility-collaboration-pilot.safety`) |
| evidence | "Any coercion or threat overrides fit scoring." |
| lands in | `content/exclusions.ts` doctrine, `/guidance`, `/character/board` |
| doctrine check | pass — this is a *rule about instruments*, not sensitive-page content |
| cost | S — gates: new gate: "no ranking, fit reading, or plan ordering can outrank a safety route; the safety route is checked before the ordering runs" |
| why worth having | it is the ordering constraint that keeps every instrument on the site subordinate to the help-now route, stated as a rule the code can be tested against rather than a convention. |
| trunk dedupe | thinner in trunk (`content/board.ts`'s crisis gate short-circuits before any reading — the pattern exists and is excellent, in one place; it is not stated as a site-wide rule the other instruments inherit) |
| **architect's call** | **Adopt** — A favourable reading never overrides a safety route, stated as a site-wide rule the instruments inherit; the board's crisis gate generalised. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-041 |

#### N-269 · The anti-instrumentalisation rule — obligations to others may never be represented as resource costs
| field | |
|---|---|
| kind | safety |
| source | gol-opus5/ethics/anti-instrumentalization.html (+ blueprint §4 case 10, amendment A6) |
| evidence | "Obligations to others may not be represented as resource costs" — and the distinction that saves it: "The rule prohibits a representation, not a conclusion." |
| lands in | `content/sim/` action costing, `content/play/` card copy, `content/guidance.ts` — anywhere the trunk prices something |
| doctrine check | pass — and this is the strongest candidate for a *lint*, since the campaign layer prices actions in a budget |
| cost | M — gates: new gate: "no simulation action, card or guidance line represents a person or a duty as a cost line"; plant-and-restore probe in `tests/falsify-walls.sh` |
| why worth having | the trunk has a budgeted campaign with an action menu, which is precisely the machinery that will price an obligation if nothing forbids it; the prototype's worked case shows the reasoning is *individually valid at every step* and monstrous jointly |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — Obligations to others are never resource costs, enforced as a lint over the campaign's action costing; the reasoning is locally valid at every step and jointly monstrous. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-043 |

#### N-270 · Practices editorially protected from being described as moves with payoffs, and the practice/habit distinction
| field | |
|---|---|
| kind | safety |
| source | gol-opus5/reflection/practices.html + reflection/index.html |
| evidence | "Rest that is recovery-for-the-next-thing is not rest."; a habit "is dropped when the schedule tightens, because it is competing on return", a practice "was never competing" |
| lands in | a reflection route; and as a prohibition over `content/guidance.ts`, `content/sim/` and the daily plan |
| doctrine check | pass — the page states its own limit (it cannot transmit a practice) and its own class position, both of which must carry over |
| cost | M — gates: new gate: "no route assigns a cost, effect or payoff to attention, rest, ritual, awe, gratitude or mourning"; plant-and-restore probe |
| why worth having | the trunk's daily plan and campaign both price time; without this rule they will price rest, and pricing rest is the mechanism that produces the trunk's own `achievement-and-meaning` known break |
| trunk dedupe | not in trunk |
| **architect's call** | **Adapt** — Rest, attention, ritual, awe, gratitude and mourning carry no cost or payoff line; a prohibition over guidance and sim content, with the rest action's existing free floor unchanged. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-048 |

#### N-271 · Where this site stops — four named professional boundaries implemented as a required field, not a disclaimer
| field | |
|---|---|
| kind | safety |
| source | gol-opus5/evidence/professional-boundaries.html |
| evidence | "a field is enforced and discretion drifts"; and the precision argument — "'this is not medical advice' tells a reader nothing" |
| lands in | `components/primitives.tsx` as a boundary block; `content/exclusions.ts` neighbourhood |
| doctrine check | touches a sensitive page → parked for the medical/clinical wording; the legal/financial boundaries pass |
| cost | M — gates: extends `content/exclusions.ts`; new gate: "a page touching medical, legal, financial or crisis content renders a boundary block above the fold" |
| why worth having | it names *what to go and ask someone else*, which a disclaimer never does |
| trunk dedupe | thinner in trunk (set-down notices and Help-now exist; there is no per-topic boundary block and no statement of the four domains) |
| **architect's call** | **Adapt** — Professional boundaries as a per-topic block naming what to ask someone else; legal and financial wording now, medical wording parked for the clinician. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-012 |

#### N-272 · Evidence apparatus survives register zero; game vocabulary does not
| field | |
|---|---|
| kind | safety |
| source | gol-opus5/mechanics/registers.html ("Two rules the content pass forced") + SITE-MAP.md underdetermined decision 11 |
| evidence | "withholding it would protect the register at the reader's expense" — the five-stage grief model is marked as folk belief *on* a register-zero page |
| lands in | the register rule in `content/routes.ts` + `/methodology` |
| doctrine check | touches a sensitive page → parked (the grief and a-death pages are byte-identical; the *rule* can be written now, the application cannot) |
| cost | S — gates: new gate: "a set-down route may render an evidence label and may not render a game term" |
| why worth having | the two prohibitions are different in kind, and collapsing them costs a bereaved reader the one correction that most protects them |
| trunk dedupe | not in trunk --- |
| **architect's call** | **Adopt** — Write the rule that a set-down route may render an evidence label and may not render a game term; applying it to the frozen pages waits for review. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-022 |

#### N-273 · Promote "keep the referent unnamed" from a limitations footnote to authoring law
| field | |
|---|---|
| kind | safety |
| source | tgtl-claude-4.0/KNOWN_LIMITATIONS.md §5 (+ DECISIONS.md "A verifier's carried warning"; records/content-pipeline.md line 208) |
| evidence | "Keep the referent unnamed." |
| lands in | `content/sim/AUTHORING.md` — specifically §"Loss tier — never in your batch at all", which does not currently contain the word "referent" |
| doctrine check | pass — this is tightening a wall, not rebalancing one, so it is not a stop-and-ask |
| cost | S — gates: new gate (assertion): "no rendered string in `content/sim/campaign` joins the caring-duty records to a named companion or a named condition" — provable red by planting `Diane` in one of the three records |
| why worth having | the caring-duty thread sits inside the loss-tier boundary only because its object is institutional logistics and never a person; the next batch author reads `AUTHORING.md`, not `KNOWN_LIMITATIONS.md` §5, and would not know. |
| trunk dedupe | thinner in trunk — the constraint is recorded in three record files and in none of the authoring law; grep for "referent" in `content/sim/AUTHORING.md` returns nothing --- |
| **architect's call** | **Adopt** — Promote "keep the referent unnamed" into AUTHORING.md with a plantable assertion; the next batch author reads the authoring law, not a limitations footnote. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-019 |

#### N-274 · A second, independent human pass over the arc's event pool before public launch
| field | |
|---|---|
| kind | safety |
| source | tgtl-claude-3.0/KNOWN_LIMITATIONS.md ("Launch gates") |
| evidence | "A second, independent human pass before public launch is still advisable, since a lexical lint cannot catch every paraphrase." |
| lands in | `KNOWN_LIMITATIONS.md` §1 (the open-gate list) + `records/` |
| doctrine check | pass — this *adds* to a gate, never relaxes one |
| cost | M |
| why worth having | the 47-card pool's only human safety read is 3.0's executor's own, recorded in DECISIONS.md; 3.0 itself said one reviewer was not enough, and the trunk's gate list quietly stopped saying so |
| trunk dedupe | not in trunk. KL 1.3 lists only the scripted beats and the board's crisis short-circuit; the recommendation of a second pool pass did not carry forward. |
| **architect's call** | **Adopt** — Restore the recommendation of a second independent human pass over the arc's card pool to the open-gate list; 3.0 said one reviewer was not enough and the trunk stopped saying so. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE3-016 |

#### N-275 · The two new loss beats — `beat-low-season` and `beat-someone-ill` — PARKED for clinical review
| field | |
|---|---|
| kind | safety |
| source | tgtl-claude-4.0/KNOWN_LIMITATIONS.md §1.4 (+ DECISIONS.md "Two new scripted beats"; blueprint §5.1, §5.6); content at `content/sim/campaign/beats.ts` (byte-identical in trunk) · also: tgtl-claude-4.0/KNOWN_LIMITATIONS.md §1.5 (+ blueprint §3.9, §12.7); templates in `lib/sim/parse.ts` (byte-identical in trunk) |
| evidence | "both need the same clinical/specialist review as the pages above before launch" |
| lands in | nothing — this is a register entry, not a change. It names a live open gate on content the trunk already ships. |
| doctrine check | touches a sensitive page → parked (loss-tier beats naming `/situations/depression`; the illness beat now names `/topics/relationships` after Phase 4b corrected it away from `/situations/a-death`) |
| cost | S (register only) — gates: KNOWN_LIMITATIONS §1.4 stays open; S-1 already asserts the advisory renders on the prologue and the no-JS floor and names all three beat subjects |
| why worth having | consolidation must not let a carried gate quietly age into a closed one. The containment is real (deterministic placement, always skippable, reduced-frame, never previewed) and is explicitly not a substitute for a professional reading of the prose. |
| trunk dedupe | not a nugget to build — a gate to carry forward verbatim; the trunk's §1.4 is identical to 4.0's |
| **architect's call** | **Park** — The two 4.0 loss beats stay parked for clinical review; register entry only, carried verbatim. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-018, CLAUDE4-024 |

#### N-397 · [PARKED] Death/dying: presence before paperwork, three lists, and the split between human and administrative work
| field | |
|---|---|
| kind | content |
| source | tgtl-chatgptsol5-6-2.0/app/components/SituationPages.tsx (`/situations/death`) · also: tgtl-chatgptsol5-6-2.0/app/components/SituationPages.tsx (`/situations/depression`) · also: tgtl-chatgptsol5-6-2.0/app/components/SituationPages.tsx (`/situations/abuse`) · also: tgtl-chatgptsol5-6-2.0/app/components/SituationPages.tsx (`/situations/grief`) · also: MASTER_PROJECT_BRIEF.md "Depression" (L1800–1824) |
| evidence | "There are human moments and administrative moments. They do not have to be carried by the same person." |
| lands in | `app/situations/a-death` — **byte-identical wall** |
| doctrine check | touches a sensitive page → parked |
| cost | — — gates: n/a while parked |
| why worth having | the practical-closure packet and the permission to hand the admin to someone else is material the trunk's page may or may not carry; the owner's clinical review decides. |
| trunk dedupe | unknown by design — not compared, because comparing would invite editing. Recorded for the clinical-review register only. |
| **architect's call** | **Park** — A clinical-review pack for the five frozen pages: material harvested for a-death, depression, being-hurt and grief is recorded here for the reviewer and never applied to a page by this consolidation. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-030, SOL2-031, SOL2-032, SOL2-033, BRIEF-154 |

#### N-430 · The privacy and psychological-risk list for any difficulty or profile surface
| field | |
|---|---|
| kind | safety |
| source | MASTER_PROJECT_BRIEF.md §4A "Privacy and psychological risk" (L923–938) · also: MASTER_PROJECT_BRIEF.md "Attribute ethics" (L5488–5502) · also: MASTER_PROJECT_BRIEF.md §6B "Privacy and sensitivity" (L8719–8735), "Risks" (L8736–8749) |
| evidence | "Inviting competitive claims about who suffered more" |
| lands in | `KNOWN_LIMITATIONS.md`, `/methodology`, `content/board.ts` |
| doctrine check | pass |
| cost | S — gates: extends the board's safety clause into a nine-item published checklist |
| why worth having | "treating subjective pain as invalid because external conditions look favorable" and "using a difficulty tier to excuse harmful behavior" are two failure modes the trunk's local-only, no-rating design avoids by construction but never names. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — Publish the owner's own safety charters as checklists: the privacy and psychological-risk list, the attribute-ethics rules and the ten risks of a life parse; and record them in DECISIONS as the walls' origin. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-151, BRIEF-152, BRIEF-153 |


### K. Methodology, evidence & records

#### N-280 · The structural-change move: burnout does not respond to optimisation inside the current structure
| field | |
|---|---|
| kind | voice |
| source | `gol-opus4-6/pathways/burnout.html` §Step 4 · also: `gol-opus4-6/` — 14 pages carry `.model-breaks`; see `SITE-MAP.md` §"Blueprint Mechanisms" · also: tgtl-claude-2.0/app/orientation/page.tsx `EvidenceDrawer.whereThisFrameFails` |
| evidence | "no amount of meditation, exercise, or journal writing fixes the environment — those practices help you survive in it, but survival is not recovery" |
| lands in | `/topics/work`, and the burnout page if OPUS46-008 lands |
| doctrine check | pass |
| cost | S — gates: none new; it restates the trunk's own known break ("the frame has no collective subject") at the point of use |
| why worth having | it is the honest refusal of the self-care answer to a workload problem, and it protects the reader from being told their environment is their discipline |
| trunk dedupe | thinner in trunk (`KNOWN_BREAKS.no-collective-subject` says this abstractly in `/methodology`; nothing says it at the moment a reader is deciding whether to book a meditation app or quit) |
| **architect's call** | **Adopt** — folded: the burnout structural-change line is this callout at the point of use |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-009, OPUS46-021, CLAUDE2-009 |

#### N-281 · The Disanalogy Register: seven canonical entries on where life is not a game, each with its "inherited by" back-links
| field | |
|---|---|
| kind | instrument |
| source | gol-fable5/debug/disanalogy-register.html (+ blueprint §3.4) · also: gol-opus5/mechanics/known-breaks.html · screenshot: records/consolidation/opus5/mechanics-known-breaks.png · also: gol-claudefamily/disanalogy-register.html, tutorial.html (+ blueprint §3.4) · also: gol-fable5/debug/disanalogy-register.html, /debug/frame-tags.html |
| evidence | "Writers don't improvise humility page by page; they inherit it from one maintained source." (frame-tags.html) — screenshot: records/consolidation/fable5/disanalogy-register.png |
| lands in | `/methodology#known-breaks`, upgraded from a four-item list to a numbered, anchored, cited register |
| doctrine check | pass |
| cost | M — gates: extends the known-breaks section; new gate: "every route that leans on a disanalogy links its numbered entry, and every entry lists at least one inheriting route" |
| why worth having | it converts scattered humility into one maintained source that pages *cite* — which means the site's self-critique cannot rot independently of the site, and every "gotcha" becomes page one of the register. |
| trunk dedupe | thinner in trunk (`content/methodology.ts` `KNOWN_BREAKS` has four honest entries — no collective subject, navigation-not-destination, windows-read-as-schedule, achievement-and-meaning — but they are unnumbered, uncited from content, and carry no inheritance) |
| **architect's call** | **Adopt** — Upgrade KNOWN_BREAKS to a numbered register with severity, status, candidate fix and inherited-by links; pages cite an entry rather than improvising humility. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-038, OPUS5-015, CF-041, FABLE5-040 |

#### N-282 · Two model limits the trunk's register does not name: the emotional gap and the coherence illusion
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/wings/meta/where-model-breaks.html` · also: gol-claudefamily/tutorial.html, disanalogy-register.html entry 8 (+ blueprint §3.4 [O5 sleeper entry]) · also: gol-opus5/mechanics/known-breaks.html#metric · also: gol-opus5/mechanics/known-breaks.html OS-11 · also: `blueprint_ChatGPTSol5-6.md` §16 · also: tgtl-chatgptsol5-6-2.0/app/components/MethodologyPage.tsx (line 48) · also: gol-opus5/evidence/what-we-dont-know.html |
| evidence | "it is better at describing what to do than at understanding what you feel" |
| lands in | `content/methodology.ts` `KNOWN_BREAKS` (two new entries), surfaced via OPUS46-021 |
| doctrine check | pass |
| cost | S — gates: extends the `KNOWN_BREAKS` gate above |
| why worth having | the *coherence illusion* — "the map is tidy, the territory is not" — is the honest confession a site with 33 tidy routes owes its reader, and the *emotional gap* is the reason a page is not a person |
| trunk dedupe | thinner in trunk (the trunk has *no collective subject* ≈ the prototype's individualism bias, and *achievement does not produce meaning* ≈ part of its optimization bias. The agency assumption is present as the job-loss "floor" callout but not named as a break. The emotional gap and the coherence illusion are absent.) |
| **architect's call** | **Adopt** — New break entries: the emotional gap and the coherence illusion; no respawn, no pause, no designer; compound situations; the instrument's own risks (tier lists become prejudice, matching becomes horoscope, optimisation launders values); every amendment so far is self-generated. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-022, CF-042, OPUS5-016, OPUS5-056, SOL1-048, SOL2-043, OPUS5-007 |

#### N-283 · A page that undermines the site, and says so on purpose
| field | |
|---|---|
| kind | voice |
| source | `gol-opus4-6/wings/meta/where-model-breaks.html` (trade-off callout) |
| evidence | "This page undermines the rest of the site. That is intentional. A model that doesn't acknowledge its own failure modes is dangerous" |
| lands in | `app/methodology/page.tsx` (framing above `KNOWN_BREAKS`) |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | it states the trade-off between the confidence that makes an instrument useful and the humility that makes it honest, and refuses to resolve it — which is the owner's standard applied to the site's own credibility |
| trunk dedupe | thinner in trunk (`/methodology` lists the breaks calmly; it does not say out loud that doing so costs the site something) |
| **architect's call** | **Adopt** — Frame the known-breaks section as a page that undermines the site on purpose, and say what that costs. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-023 |

#### N-284 · "The limits of models" — the permanent essay that the instrument is smaller than its subject
| field | |
|---|---|
| kind | voice |
| source | gol-opus5/reflection/limits-of-models.html · also: gol-opus5/ethics/ethics-of-the-framing.html · also: MASTER_PROJECT_BRIEF.md §6A "Risks of the game metaphor" (L8264–8279) |
| evidence | "A good one gets internalised, and once internalised it stops being a lens you are looking through and becomes the way things look."; "Precision and captivity increase together." |
| lands in | `/methodology` or a reflection route, linked from the entrance |
| doctrine check | pass |
| cost | M — gates: none new |
| why worth having | the practical test it offers — "whether you can put it down" — is the only usable instruction anyone gives for holding a framework loosely, and the last line points the reader *away* from the site, which is the strongest trust signal available |
| trunk dedupe | thinner in trunk (`KNOWN_BREAKS` names four failures; there is no argument about modelling as such, and nothing about what fluency costs the most diligent reader) |
| **architect's call** | **Adopt** — "The limits of models" as a permanent essay linked from the entrance: the test is whether you can put it down. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-049, OPUS5-050, BRIEF-038 |

#### N-285 · A reading page that argues the case against scoring a life
| field | |
|---|---|
| kind | content |
| source | `gol-opus4-6/wings/meta/winning.html` (the blueprint's designated "most important page", §2.1 Wing 9) · also: gol-fable5/debug/endgame.html (+ blueprint §2.8, §4 case 10) |
| evidence | "The meta move is not to find the right answer. It is to make sure the question is yours." |
| lands in | `/methodology` or a standalone page under `/guidance`; linked from `/character` (the no-score panel) and `/play/arc` parse |
| doctrine check | pass |
| cost | M — gates: extends the no-worth-score wall — this page is the *argument* the wall rests on and should be cited by the lint's own comment |
| why worth having | the trunk enforces "no score" everywhere and nowhere explains why; the single-axis trap, the incommensurability argument ("you cannot maximize a vector"), and the case against scoring at all give the reader the reasoning instead of the rule |
| trunk dedupe | thinner in trunk (`content/play/framing.ts` `BRIEFING_POINTS.win` says the package ships with no win condition — two sentences, inside the playable layer's briefing. There is no reading-side page.) |
| **architect's call** | **Adopt** — The case against scoring a life as a reading page the no-score lint's own comment cites. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-027, FABLE5-045 |

#### N-286 · An open-questions register with citable IDs, each naming what would settle it
| field | |
|---|---|
| kind | instrument |
| source | gol-opus5/evidence/what-we-dont-know.html (Q1–Q7) · screenshot: records/consolidation/opus5/evidence-open-questions.png · also: tgtl-claude-2.0/KNOWN_LIMITATIONS.md §"Designed-now, empty-for-now evidence fields"; content/evidence.ts · also: MASTER_PROJECT_BRIEF.md §14 "Open questions" (L10152–10213) plus ~20 per-section blocks |
| evidence | "an open question with no stated resolution condition is an excuse rather than a question" |
| lands in | `content/evidence.ts` — `openQuestionIds` already exists as a designed-but-empty field; a register on `/methodology` gives the ids something to point at |
| doctrine check | pass |
| cost | M — gates: extends the existing `openQuestionIds` schema; new gate: "every id referenced by a page resolves to a register entry with a resolution condition" |
| why worth having | the trunk already designed the field and left it unpopulated; this is the reader-facing instrument that makes it worth having |
| trunk dedupe | thinner in trunk (the field exists in the type, nothing populates it, and there is no page where a reader can see the open questions as a set) |
| **architect's call** | **Adopt** — An open-questions register with citable ids and resolution conditions; the field has sat empty in the schema for three versions. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-006, CLAUDE2-018, BRIEF-168 |

#### N-287 · Separate what was found from what the project inferred from it, visibly, in the drawer.
| field | |
|---|---|
| kind | safety |
| source | tgtl-claude-2.0/content/evidence.ts (blueprint §9.4) · also: `gol-chatgptsol5-6/app/features/phase-five/ResearchDrawer.tsx` (`.research-seams`) + blueprint §11.2 |
| evidence | "`finding`/`projectInference`/`recommendation` separation exist in the schema and are populated as content warrants" |
| lands in | `components/primitives.tsx` `EvidenceDrawer` — three labelled lines instead of one prose blob |
| doctrine check | pass |
| cost | M — gates: new gate: "every record carrying a `recommendation` also carries a non-empty `finding` or is marked illustrative" |
| why worth having | the whole no-number doctrine rests on a reader being able to tell a sourced fact from the project's reading of it. Today the drawer shows status, scope and "what would change this" — all about the record — but never draws the line inside the claim itself. Three labelled lines make the instrument auditable by the reader rather than only by the executor. |
| trunk dedupe | thinner in trunk (schema present, never rendered) --- |
| **architect's call** | **Adopt** — Render finding, project inference and recommendation as three labelled lines in the drawer, plus measured, unknown and speculative as seams. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE2-019, SOL1-037 |

#### N-288 · Grade every substantive claim on a six-point strength scale, replacing the trunk's three status labels
| field | |
|---|---|
| kind | instrument |
| source | gol-opus5/evidence/grades.html (+ blueprint-opus5.md §2.11) · also: `blueprint_ChatGPTSol5-6.md` §7.4, enforced by `gol-chatgptsol5-6/tests/validate-fixtures.mjs` |
| evidence | "Established / Supported / Contested / Model / Folk / Author's inference" — and of Model: "It lets the site present a framing as a framing without smuggling it in as a discovery" |
| lands in | `content/evidence.ts` (`ContentStatus`, `STATUS_LABEL`, `STATUS_MEANING`), rendered on `/methodology` |
| doctrine check | pass — the *scale* is a mechanism, not a number; each graded claim still needs its own source |
| cost | M — gates: extends G-10/G-12 (evidence record present on evidence-bearing pages); new gate: "no page renders a grade badge without a ledger row id" |
| why worth having | the trunk's three labels cannot distinguish *our framing* from *our reasoning* from *widely believed and false*; those are three different things a reader should weigh differently |
| trunk dedupe | thinner in trunk (`content/evidence.ts` has illustrative / editorial / researched only — no way to mark a framing as a framing, and no way to publish a false-but-acted-on belief in order to argue with it) |
| **architect's call** | **Adapt** — Six strength grades replacing three status labels, so a framing can be marked as a framing; each graded claim still needs its source. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-001, SOL1-039 |

#### N-289 · A claim ledger: every substantive empirical claim as a numbered row, with inline badges that link to it by ID
| field | |
|---|---|
| kind | instrument |
| source | gol-opus5/evidence/claim-ledger.html · screenshot: records/consolidation/opus5/evidence-claim-ledger.png · also: gol-opus5/evidence/retractions.html + evidence/what-we-dont-know.html (Q2) + commons/editorial-standards.html · also: gol-claudefamily/tutorial.html §4; marks used across `rule-*`, `arena-*`, `condition-*` (+ blueprint §3.7) · also: `blueprint_ChatGPTSol5-6.md` §7.5, used in `content/fixtures.json` (`claims[].type`) |
| evidence | "converts a systemic risk into a maintenance task, because a failed replication downgrades one row rather than discrediting a framework" |
| lands in | new `content/claims.ts` + a ledger section on `/methodology`; badges via a `<Claim id="C17">` component beside `<Term>` |
| doctrine check | needs re-sourcing (numbers) — the prototype's 37 rows carry abbreviated citations and are claims, not sources |
| cost | L — gates: new gate: "every `<Claim>` id resolves to a ledger row, and every ledger row carries a fetched source or is graded as a framing/inference" |
| why worth having | it is the difference between a site that can survive being wrong about one thing and a site that gets discredited wholesale |
| trunk dedupe | not in trunk (evidence records are per-page, unnumbered, and not addressable from prose) |
| **architect's call** | **Park** — A claim ledger with citable ids is the epistemic half of the Opus 5 donor; right, large, and it needs the grades (N-288) and the re-sourcing of every row first. Park as the next evidence version. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-002, OPUS5-005, CF-043, SOL1-040 |

#### N-290 · A retractions and downgrades register, published empty with its format specified before it is needed
| field | |
|---|---|
| kind | architecture |
| source | gol-opus5/evidence/retractions.html · screenshot: records/consolidation/opus5/evidence-retraction-R1.png · also: gol-opus5/evidence/retractions.html + CHANGELOG-STRUCTURE.md §S3 · also: gol-opus5/CHANGELOG-STRUCTURE.md preamble + mechanics/changelog.html + mechanics/known-breaks.html |
| evidence | "a retraction mechanism invented after the first error is not a mechanism, it is a decision made under pressure by people who would rather not" |
| lands in | `/methodology` — a sibling register to `CORRECTIONS` in `content/methodology.ts` |
| doctrine check | pass |
| cost | S — gates: extends the corrections-register gate; new gate: "the retractions section renders even when it holds zero entries" |
| why worth having | publishing the mechanism before the first error is the only version of it that is credible |
| trunk dedupe | thinner in trunk (`CorrectionKind` includes `"retraction"`, so retractions are a *kind of row* in one mixed list — there is no separate permanent register, no struck-through original text, no per-page notice) |
| **architect's call** | **Adopt** — A retractions register published empty with its format specified; the original text stays visible. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-003, OPUS5-004, OPUS5-014 |

#### N-291 · The no-silent-fix rule, with visible revision blocks on changed pages
| field | |
|---|---|
| kind | safety |
| source | gol-opus5/commons/corrections.html + commons/editorial-standards.html |
| evidence | "A silent fix converts a reader's correction into the editors' foresight, and a site whose history shows no errors is either very lucky or editing its history." |
| lands in | a `RevisionNote` component + the corrections register |
| doctrine check | pass |
| cost | S — gates: new gate: "a page changed by a logged correction renders a revision note naming what it got wrong" |
| why worth having | it is the cheapest row in this sweep and it converts the site's most likely failure into the thing that makes it trustworthy |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — The no-silent-fix rule with a revision note on any page changed by a logged correction. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-055 |

#### N-292 · A public correction queue with five kinds, four outcomes, and classification before resolution
| field | |
|---|---|
| kind | architecture |
| source | gol-opus5/commons/corrections.html · screenshot: records/consolidation/opus5/commons-corrections.png |
| evidence | "A correction queue that is not public is a suggestion box."; and "Restating a challenge in the site's own vocabulary before deciding it is the standard way an institution neutralises a challenge." |
| lands in | `content/methodology.ts` `CORRECTIONS` (which currently holds only the build's own decisions) |
| doctrine check | pass |
| cost | M — gates: extends the corrections register gate; new gate: "an open item stays rendered while open, including one whose answer is 'we accept this is wrong and do not know how to fix it'" |
| why worth having | the trunk's register has the format and only self-authored rows; the five-kinds taxonomy and the *logged before assessed, in the submitter's terms* rule are what make it something other than a changelog |
| trunk dedupe | thinner in trunk (format is live from day one; every entry is the build's own decision, and there is no taxonomy, no open state, no outcome vocabulary) |
| **architect's call** | **Adapt** — The correction queue's five kinds and four outcomes, logged in the submitter's terms before assessment; the queue stays local until the submission path exists. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-054 |

#### N-293 · Field reports as primary sources, with published handling rules
| field | |
|---|---|
| kind | architecture |
| source | gol-opus5/commons/field-reports.html · screenshot: records/consolidation/opus5/commons-field-report.png · also: gol-opus5/commons/field-report-no-slack.html + commons/corrections.html · also: gol-opus5/commons/field-reports.html |
| evidence | "Where a field report contradicts a page in the Codex, the field report is the better source and the Codex page is the one that should change."; "Two reports from the same position that disagree are both published, disagreeing." |
| lands in | `content/evidence.ts` (`FieldReport` type already exists, unpopulated) + a route |
| doctrine check | pass — no submission path ships; the trunk's own `WHATS_COMING` already says the submission path is deliberately not built |
| cost | M — gates: new gate: "a field report carries no evidence grade and is never edited into agreement with an editorial page" |
| why worth having | the trunk designed the record shape and has nothing to put in it; the *handling rules* are the part worth having now, because they are what makes a first report safe to accept later |
| trunk dedupe | thinner in trunk (`FieldReport` type exists; one `WHATS_COMING` line; no rules, no page, no published report) |
| **architect's call** | **Adopt** — Field-report handling rules published now, submission path still not built: a report outranks the page, disagreeing reports are both published, no grade, never edited into agreement. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-052, OPUS5-053, OPUS5-059 |

#### N-294 · Cultural scope: three portability verdicts, and known-bound vs untested kept apart
| field | |
|---|---|
| kind | instrument |
| source | gol-opus5/evidence/cultural-scope.html · also: gol-opus5/commons/localization.html · also: MASTER_PROJECT_BRIEF.md §4B "Language and localization" (L5878–5894) · also: MASTER_PROJECT_BRIEF.md §4B "Data comparability" (L5862–5877) |
| evidence | "conflating them lets an untested claim borrow the modesty of an acknowledged one"; verdicts are "portable", "structure portable, specifics not", "not portable" |
| lands in | `content/evidence.ts` (`scope` field is present but free text) + a scope section on `/methodology` |
| doctrine check | pass |
| cost | M — gates: extends G-10; new gate: "no page asserts a jurisdiction-specific arrangement without a portability verdict" |
| why worth having | the trunk's Launch Window is explicitly US 2025 and its timeline is jurisdiction-shaped; a reader elsewhere currently has no marked way to know which rows to discount |
| trunk dedupe | thinner in trunk (`scope?: string` exists on `EvidenceRecord`; there is no vocabulary, no page, and no distinction between a limit we can state and one we have not looked at) |
| **architect's call** | **Adapt** — Cultural scope as three portability verdicts with known-bound kept apart from untested; a vocabulary for the scope field and a section on /methodology. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-008, OPUS5-057, BRIEF-007, BRIEF-149 |

#### N-295 · Published editorial standards: publication requirements, ordering rules, prohibitions, and four ordered review gates
| field | |
|---|---|
| kind | architecture |
| source | gol-opus5/commons/editorial-standards.html · also: gol-opus5/commons/editorial-standards.html + atrium/what-this-is.html · also: gol-opus5/commons/editorial-standards.html · also: gol-opus5/commons/ontology-proposals.html · also: blueprint-fable5.md §5.2d/e; gol-fable5/lexicon.html ("Adding a term is an amendment, not an edit") · also: MASTER_PROJECT_BRIEF.md §11 (L9959–9978) |
| evidence | "Published so that the site's judgement is auditable rather than merely asserted."; gates run "Register check → Required fields → Grade audit → Separability" |
| lands in | a new `/methodology/standards` section or a `records/EDITORIAL_STANDARDS.md` surfaced on `/methodology` |
| doctrine check | pass |
| cost | M — gates: extends the existing walls file; new gate: "a page added to `content/routes.ts` without the required fields fails the build" |
| why worth having | the trunk has walls in `DECISIONS.md` and `tests/falsify-walls.sh` but nothing a *reader* can hold it to; a published standard is a commitment, an internal one is a preference |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — Published editorial standards a reader can hold the site to: publication requirements, ordering rules, prohibitions, review gates; the trunk's walls made a commitment. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS5-009, OPUS5-010, OPUS5-011, OPUS5-013, FABLE5-047, BRIEF-148 |

#### N-296 · The player-relevance admission test, published as the site's scope boundary
| field | |
|---|---|
| kind | architecture |
| source | blueprint-fable5.md §5.3a (implemented as the wings' door policy across gol-fable5) |
| evidence | "a page is admitted only if it changes a decision or an orientation *for the reader as player of their own life*" |
| lands in | `/methodology` (beside the known breaks and what's coming) |
| doctrine check | pass |
| cost | S — gates: new gate: "every new route records which decision or orientation it changes" |
| why worth having | it is the one sentence that stops "explaining life" becoming an encyclopedia, and publishing it lets a reader hold the site to its own scope. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — The player-relevance admission test published as the scope boundary; the sentence that stops explaining life becoming an encyclopedia. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-042 |

#### N-297 · The completion test as a hard admission rule — the anti-quest-ification door policy
| field | |
|---|---|
| kind | architecture |
| source | gol-fable5/quests/index.html, /character/sobriety.html (+ blueprint §1.2 primitive 7, §4 case 6) |
| evidence | "if you cannot say what \"done\" looks like, it is not filed here — it is a condition being lived or a build being practiced" |
| lands in | `content/routes.ts` + `/methodology` (as a published admission rule), enforced over `/situations` and `/guidance` |
| doctrine check | pass |
| cost | M — gates: new gate: "no route presents an uncompletable state as a completable task" |
| why worth having | the single most common harm in life-advice writing is telling someone they are failing to finish something that has no finish; the trunk prevents it page by page, this makes it structural. |
| trunk dedupe | thinner in trunk (grief-is-not-a-quest is asserted in `app/situations/grief` prose; there is no site-wide admission test) |
| **architect's call** | **Adopt** — The completion test as an admission rule: if you cannot say what done looks like it is not filed as a task. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-004 |

#### N-298 · A ResearchReview record and drawer: review class, evidence searched, included and excluded sources, reviewer, next-review date, publication decision
| field | |
|---|---|
| kind | instrument |
| source | `gol-chatgptsol5-6/app/features/phase-five/ResearchDrawer.tsx`, `content/guidance-fixtures.json` (`researchReviews`) + blueprint §8.14 · also: tgtl-chatgptsol5-6-2.0/app/components/MethodologyPage.tsx (`Maintenance and correction model`) |
| evidence | screenshot: `records/consolidation/sol1/research-review-drawer.png` — "Prototype structure only · not publishable advice" |
| lands in | `/methodology`, and as a drawer on any engine-bearing surface |
| doctrine check | pass |
| cost | L — gates: new gate: "no predictive or prescriptive surface renders without a review record naming its reviewer, its publication decision, and its next-review date" |
| why worth having | **excluded sources** and **next review** are the two fields that make an evidence claim falsifiable by a stranger, and neither exists on the trunk today. It also gives the preview label a machine-readable home: "not publishable" becomes a field rather than a footer stamp. |
| trunk dedupe | thinner in trunk (`EvidenceRecord` has status, scope, lastReviewed, whatWouldChange; the timeline `Source` has retrievedOn and a verified excerpt — stronger on *verification*, silent on *review*) |
| **architect's call** | **Adapt** — Reviewer, excluded sources and next-review date on the evidence record; the two fields that make a claim falsifiable by a stranger. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-036, SOL2-044 |

#### N-299 · `[DESIGN HYPOTHESIS]` — a research label for a product *behaviour*, not a claim
| field | |
|---|---|
| kind | architecture |
| source | `gol-chatgptsol5-6/app/types/guidance.ts` (`ResearchLabel`) + blueprint §8.14 · also: MASTER_PROJECT_BRIEF.md §10A "Research-status and implementation gate" (L9896–9930) |
| evidence | "[DESIGN HYPOTHESIS] — product behavior awaiting validation" (`blueprint_ChatGPTSol5-6.md` §8.14) |
| lands in | `content/evidence.ts`, `/methodology` engine-weights section |
| doctrine check | pass |
| cost | S — gates: extends the evidence-label gate; new assertion: "an engine, ranking or ordering carries a label of its own, distinct from the labels on the content it orders" |
| why worth having | the trunk's six evidence labels all describe *claims*; the ordering behaviour of the Life Arc, campaign and guidance engines currently has no label of its own, and "the weights are authored" lives only in a corrections entry. |
| trunk dedupe | thinner in trunk (the six `EvidenceLabel` values cover claims well; `cor-engine-illustrative` says the right thing once, in prose, in the register) |
| **architect's call** | **Adopt** — A design-hypothesis label for engine behaviour, distinct from the labels on the content it orders. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-038, BRIEF-146 |

#### N-300 · A fixture-validation suite as a content gate: stable-ID regex, uniqueness, required-field presence, an "authoritative-looking" refusal regex, and edition parity for every term
| field | |
|---|---|
| kind | architecture |
| source | `gol-chatgptsol5-6/tests/validate-fixtures.mjs` |
| evidence | "`${claim.id} could appear authoritative`" — the assertion fires when a placeholder claim's organization, title, type and data year read as real |
| lands in | `tests/`, alongside `falsify-walls.sh` |
| doctrine check | pass |
| cost | M — gates: **new gate, plant-and-restore-friendly**: give a placeholder claim a real-looking publisher and watch the suite go red |
| why worth having | it enforces the trunk's hardest rule — "no number without a fetched source" — from the other direction, by refusing content that merely *looks* sourced. |
| trunk dedupe | thinner in trunk (the trunk's compiler and T-1/T-11 check the timeline's sources hard; there is no equivalent guard on non-timeline fixtures) |
| **architect's call** | **Adopt** — A fixture-validation gate that refuses content that merely looks sourced; T-1 enforced from the other direction, plant-and-restore friendly. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-049 |

#### N-301 · Planned obsolescence as a template property of a whole content area, not a one-off line
| field | |
|---|---|
| kind | instrument |
| source | gol-fable5/metagame/index.html, /servers.html, /patch-notes.html, /the-meta.html (+ blueprint §2.7) |
| evidence | "This is the only wing whose pages carry a staleness stamp. Meta content goes stale by design; a metagame page that claims permanence is malfunctioning." |
| lands in | `components/primitives.tsx` `StalenessStamp` (already exists) applied as a route property in `content/routes.ts` |
| doctrine check | pass |
| cost | S — gates: extends the corrections-register gate; new gate: "every route flagged perishable renders a stamp and a review date" |
| why worth having | the trunk already has the component and uses it exactly once; making it a declared property of a content area is how the site stays honest about which of its pages are dying and which are not. |
| trunk dedupe | thinner in trunk (`StalenessStamp` is used on `/topics/work` alone; there is no perishable-content class, no per-entry "as of" discipline, and no statement that some pages are *supposed* to expire) |
| **architect's call** | **Adopt** — Perishable content declared as a route property with a stamp and review date; the component exists and is used once. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-044 |

#### N-302 · Inline "not built yet" badges sitting inside the structure, next to what is built
| field | |
|---|---|
| kind | architecture |
| source | `gol-opus4-6/wings/*/index.html` (`stub-badge`, ~55 instances) and `pathways/index.html` · also: gol-fable5/lenses/index.html, /lenses/health.html, /lenses/work.html (+ blueprint §2.10) · also: gol-fable5/manual/index.html ("Incentives — planned"), /css/site.css (`.status.exemplar`) · also: gol-opus5/SITE-MAP.md underdetermined decision 3; visible on codex/*, passages/index.html, situations/index.html · also: `gol-chatgptsol5-6/app/components/GuidePrimitives.tsx` (`StatusStamp`, `ResearchBadge`) |
| evidence | screenshot: records/consolidation/opus4-6/wing-landing-stubs.png |
| lands in | `app/topics/page.tsx`, `app/situations/page.tsx`, `content/methodology.ts` (`WHATS_COMING` becomes the *generated* rollup of inline stubs rather than a hand-kept list) |
| doctrine check | pass |
| cost | M — gates: new gate: *every stub badge has a matching `WHATS_COMING` entry and vice versa* — a proven-red probe that plants an orphan stub |
| why worth having | honest uncertainty over confident emptiness, placed where the reader actually feels the hole, instead of a single distant list they have to go looking for |
| trunk dedupe | thinner in trunk (`WHATS_COMING` names unbuilt scope in exactly one place, §6.9, by design; `/orientation` and `/roadmap` are whole-page stubs. There is no in-place marker on a partially-covered index.) |
| **architect's call** | **Adapt** — Inline "planned" markers on index cards generated from WHATS_COMING, so the single-source rule holds and the reader meets the hole in context. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-005, FABLE5-006, FABLE5-050, OPUS5-062, SOL1-045 |

#### N-303 · A gate for the define-at-first-use discipline, which is currently held by authorship alone.
| field | |
|---|---|
| kind | architecture |
| source | tgtl-claude-2.0/DECISIONS.md §"Define at first use" |
| evidence | "the author sets `define` only on the first occurrence of a key on a page" |
| lands in | `tests/run-gates.ts` (a new static assertion over the export or over `app/**` source) |
| doctrine check | pass — extends an existing gate family, changes no lint list |
| cost | M — gates: new gate: "on every page, the first rendered occurrence of each `<Term>` key carries `define`, and no later occurrence does" |
| why worth having | the brief's own rule is that a gate is not a gate until it has been shown to fail, and this one has never been a gate at all — 2.0 recorded it as an authorship convention and the trunk inherited it across 33 routes, 24 generated pages and 61 `define` sites. Voice rule §7.3 ("define at first use, invisibly") is therefore the only presentation promise on the site with no mechanical backstop, on a surface that has roughly doubled since the convention was set. This is the cheapest place a plant-and-restore probe would find real drift. |
| trunk dedupe | not in trunk (`tests/run-gates.ts` has no `define` assertion; gate 3 checks parity and hardcoded vocabulary only) --- |
| **architect's call** | **Adopt** — A gate for define-at-first-use; the only presentation promise with no mechanical backstop, on a surface that has doubled. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE2-022 |

#### N-304 · "…show its confidence without making you pay an evidence tax to read it."
| field | |
|---|---|
| kind | voice |
| source | tgtl-chatgptsol5-6-2.0/app/components/MethodologyPage.tsx (page header) |
| evidence | "The Guidebook should show its confidence without making you pay an evidence tax to read it." |
| lands in | `/methodology` header |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | the sentence that justifies putting every source behind a disclosure instead of in the prose — the owner's user-friendly standard, stated as doctrine. |
| trunk dedupe | not in trunk. --- |
| **architect's call** | **Adopt** — "Show its confidence without making you pay an evidence tax" as the methodology header line. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-045 |

#### N-305 · Close the twenty-five open unfalsifiable gate assertions, each against the prover's recorded probe
| field | |
|---|---|
| kind | architecture |
| source | tgtl-claude-4.0/KNOWN_LIMITATIONS.md §4.11 + records/gate-falsifiability-audit.md (1,545 lines; 31 confirmed, 16 refuted, 6 fixed) · also: tgtl-claude-4.0/records/gate-falsifiability-audit.md, `tests/s10-balance.ts:144` entry (+ DECISIONS.md Phase 4c "The rule this build should have been following all along") |
| evidence | "The other twenty-five are open, each with the prover's probe and a corrected assertion" |
| lands in | counted from the audit's own headings — `tests/sim-gates-4.ts` (6 open), `tests/browser-gates.mjs` (5), `tests/sim-gates.ts` (4), `tools/build-content.mjs` (3), `tests/run-gates.ts` (2), `tests/s13-pileup.ts` (2), `tests/s9-ui.mjs` (2), `tests/s10-balance.ts` (1) = 25 open, 6 marked FIXED — each open one with its corrected assertion already written in the audit |
| doctrine check | pass — but note the audit predates the timeline, so 5.0's own suites (`tests/timeline-gates.ts`, `tests/timeline-browser-gate.mjs`) have never been audited this way at all |
| cost | L — gates: this IS the gate work; the brief's own wall ("a gate is not a gate until it has been shown to fail") is the acceptance criterion |
| why worth having | the handback report claimed forty-six green gates and at least one was checking nothing. Every corrected assertion is already drafted with its proof-of-red; this is transcription plus verification, not design. |
| trunk dedupe | thinner in trunk — the audit file is carried unchanged; the twenty-five are still open |
| **architect's call** | **Adopt** — Close the twenty-five open unfalsifiable assertions against the prover's probes, and audit the timeline suites the same way; this is the gate work. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-021, CLAUDE4-022 |

#### N-306 · The browser suites should record and restore a reader's saved runs rather than delete them
| field | |
|---|---|
| kind | architecture |
| source | patch spec §4 · also: tgtl-chatgptsol5-6-2.0/SCENE_ARCHITECTURE.md ("Acceptance harness"); tools/review-browser-session.mjs · also: TGTL_3_0_VISUAL_POLISH_PATCH_SPEC.md §4 |
| evidence | "records and restores any pre-existing library without overwriting it" |
| lands in | `tests/browser-gates.mjs:61`, `tests/s9-ui.mjs:347` and `:435` |
| doctrine check | pass |
| cost | S — new gate: "a pre-existing named-save library survives a full suite run byte-identical" |
| why worth having | 4.0 added named saves (capped at eight, per KL 4.8) and the suites open by deleting every `tgtl:play*` and `tgtl:sim2*` key. Harmless in a headless context, destructive the first time anyone runs a suite against a real browser profile. |
| trunk dedupe | thinner in trunk. The rest of the spec's item 4 is **already satisfied**: the suites clear before they run rather than assuming state (so they are clean-origin safe), they seed their own deterministic fixture (`tests/fixtures/finished-campaign.json`), they take a base URL as `argv[2]`, and `tools/make-parse-fixture.ts` documents its own provenance in the header — "Seeding the run is the honest shortcut: the state is produced by the real engine through the real commit path." Only the backup/restore clause and the `TGTL_BASE_URL` *env* name (as against argv) are open. |
| **architect's call** | **Adopt** — The browser suites snapshot and restore a reader's own saved runs instead of deleting them. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE3-014, SOL2-062, SPECS-055 |

#### N-307 · A definition of implementation readiness — ten things a feature must have before an agent may build it
| field | |
|---|---|
| kind | architecture |
| source | `blueprint_ChatGPTSol5-6.md` §19 |
| evidence | "If any of these are missing, the agent should produce a short gap report before implementation rather than invent product meaning." |
| lands in | `DECISIONS.md` / the handoff, as a standing rule for 6.0's own build agents |
| doctrine check | pass |
| cost | S — gates: process gate, not a content gate |
| why worth having | it names the exact failure the owner is most exposed to — an agent inventing product meaning to fill a spec hole — and gives it a cheap remedy (a gap report) instead of a rule nobody can enforce. |
| trunk dedupe | not in trunk (the trunk's `INVENTION:` rule catches inventions *after* they are written; this catches them before) |
| **architect's call** | **Adopt** — Implementation readiness as a standing rule for build agents: a gap report before inventing product meaning; goes into every 6.0 brief. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-047 |

#### N-308 · An "owner decisions still required" register, numbered and standing
| field | |
|---|---|
| kind | architecture |
| source | `blueprint_ChatGPTSol5-6.md` §17, `gol-chatgptsol5-6/KNOWN_LIMITATIONS.md` ("Owner decisions for the next pass") · also: blueprint_TGTL_3.0.md §14.2 · also: blueprint_TGTL_3.0.md §14.6 · also: blueprint_TGTL_4.0.md §12, items 1, 5, 6, 10 · also: tgtl-claude-4.0/KNOWN_LIMITATIONS.md §1.6 (+ blueprint §12.2, §4.3); evidence set is `tgtl-claude-4.0/screenshots/` (113 files, every play surface × 2 themes × 2 viewports) |
| evidence | "These decisions are intentionally not invented by this blueprint" — followed by twenty numbered items |
| lands in | `KNOWN_LIMITATIONS.md` |
| doctrine check | pass |
| cost | S — gates: none new; it makes the existing human gates countable |
| why worth having | separating "not built" from "not decided" is the difference between a backlog and a blocker list, and the owner currently has to infer which gates are waiting on him. |
| trunk dedupe | thinner in trunk (`KNOWN_LIMITATIONS.md` §0.1/§1 hold the human gates; the wider set of open owner choices is spread across `DECISIONS.md` and `WHATS_COMING`) |
| **architect's call** | **Adopt** — A numbered "owner decisions still required" register in KNOWN_LIMITATIONS; not-built and not-decided are different lists. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-050, CLAUDE3-017, CLAUDE3-018, CLAUDE4-023, CLAUDE4-025 |

#### N-309 · Recording where an owner instruction supersedes the blueprint, in the decision record
| field | |
|---|---|
| kind | architecture |
| source | `gol-chatgptsol5-6/PROTOTYPE_DECISIONS.md` |
| evidence | "The owner's direct Phase 5 instruction supersedes GOV-008's earlier 'preset archetypes before personal builder' sequencing." |
| lands in | `DECISIONS.md` |
| doctrine check | pass |
| cost | S — gates: process |
| why worth having | it keeps the blueprint honest as a document — a superseded rule stays visible with the reason it was overridden, instead of quietly disappearing. |
| trunk dedupe | thinner in trunk (`DECISIONS.md` records inventions and decisions; it does not have a standing form for "the owner overrode the blueprint here, and why") --- |
| **architect's call** | **Adopt** — A standing form in DECISIONS for "the owner overrode the blueprint here, and why". |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL1-051 |

#### N-310 · A "structural findings — noted, not acted on" section in the record: near-misses logged where a rebuild would have been wrong
| field | |
|---|---|
| kind | architecture |
| source | gol-fable5/SITE-MAP.md, "Structural findings" |
| evidence | "content pressure did not surface a wrong-or-homeless-content error, so there is no CHANGELOG-STRUCTURE.md" |
| lands in | `KNOWN_LIMITATIONS.md` (§4 "where the build is thin") or a new section in `DECISIONS.md` |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | it records the pressure the architecture took and *held*, which is the evidence a later architect actually needs — and it names the de facto backlog the content itself generated (the missing addiction condition, engine index anchors doing a page's job, the lens gap list). |
| trunk dedupe | thinner in trunk (`KNOWN_LIMITATIONS.md` records what is thin and what is deferred; it does not record structural near-misses that were examined and deliberately not acted on) --- |
| **architect's call** | **Adopt** — A "structural findings, noted not acted on" section in the record; the pressure the architecture took and held. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-051 |

#### N-311 · The seven-defect correction table — a review artifact worth keeping as a form
| field | |
|---|---|
| kind | architecture |
| source | tgtl-chatgptsol5-6-2.0/review/legacy-2.2-audit_report.md ("Seven inherited defects corrected") |
| evidence | "Failed saves claimed success | Seven explicit statuses; write/readback verification; blocked/quota failure exercised in Chrome" |
| lands in | `DECISIONS.md` / the corrections register at `/methodology#corrections` |
| doctrine check | pass |
| cost | S — gates: extends the corrections-register gate |
| why worth having | finding → implemented correction → the evidence that proves it, one row each. It is the shape the trunk's corrections register already wants, filled in with seven real failures another build actually hit — every one of which is a failure mode the trunk could hit too (maintenance band read backwards, explanations disappearing, action overload, invisible skills, false save success, malformed schema accepted, no full UI run). |
| trunk dedupe | thinner in trunk — `CORRECTIONS` exists and its first entries are the build's own decisions; this is a proven inventory of what to check for. |
| **architect's call** | **Adopt** — The seven-defect correction table as a form: finding, correction, evidence; the trunk's register wants this shape. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | SOL2-059 |

#### N-312 · A screen-reader user's pass over the six canonical instruments
| field | |
|---|---|
| kind | presentation |
| source | tgtl-claude-4.0/KNOWN_LIMITATIONS.md §4.7 (+ blueprint §4.1's instrument-accessibility rule) |
| evidence | "None of that is the same as a screen-reader user trying it." |
| lands in | `components/sim/instruments/Instruments.tsx` (strip · gauges · budget · queue · timeline · card faces) and the campaign/Lab surfaces around them |
| doctrine check | pass — a human gate, like the clinical reviews; consolidation records it, never closes it |
| cost | M — gates: S-9 (contrast, tap targets, clipping) and S-4 (keyboard) already run; what is missing is the person, and any finding they return becomes a new assertion |
| why worth having | the blueprint asked for the rule to be designed in rather than discovered at the end, and it was — the text/DOM equivalents exist. Nobody who needs them has tried them. |
| trunk dedupe | thinner in trunk — designed-in and machine-checked; unconfirmed by a user --- |
| **architect's call** | **Park** — A screen-reader user's pass is a human gate; recorded, never closed by a build. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE4-020 |

#### N-344 · Continents are containers, not cultures — and cross-expansion paths connect the maps
| field | |
|---|---|
| kind | safety |
| source | MASTER_PROJECT_BRIEF.md §4B "Continents are containers, not uniform cultures" (L5798–5807) and "Cross-expansion paths" (L5836–5855) · also: MASTER_PROJECT_BRIEF.md §4A "Era boundaries are functional, not universal" (L455–472); §4B "Historical periodization must be local" (L5856–5861) |
| evidence | "A continent expansion should never suggest that the continent has one Default Human." |
| lands in | `/map`, `/methodology` (known breaks) |
| doctrine check | pass |
| cost | S — gates: extends the normative lint's remit to geographic composites |
| why worth having | the same rule that keeps "default" from meaning "normal" has to survive the jump to geography, and migration is a life path, not an edge case. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — Two geographic rules written before geography grows: continents are containers not cultures, and era boundaries are local never universal; a methodology paragraph now, a gate when a second region or era arrives. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-006, BRIEF-061 |

#### N-392 · The nine ways "best" can mean different things
| field | |
|---|---|
| kind | voice |
| source | MASTER_PROJECT_BRIEF.md "Central distinction: common is not necessarily superior" (L11494–11509) |
| evidence | "Popularity may reflect availability, marketing, habit, bundling, network effects, switching costs, retailer placement, or low initial price rather than quality." |
| lands in | `/methodology`, any comparison surface (incl. Plan A/B/C) |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | the same nine-way distinction applies to careers, credentials and cities, not just kettles — it is a general reading skill the site can teach once. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — The nine ways "best" can differ, as a reading skill on /methodology and every comparison surface. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-078 |

#### N-410 · Self-worth criteria may be examined; a worth score may never be produced
| field | |
|---|---|
| kind | safety |
| source | MASTER_PROJECT_BRIEF.md "Self-worth criteria" (L3969–3994) |
| evidence | "The guide may analyze the person's criteria for feeling worthy, but it should not produce an objective human-worth score." |
| lands in | `/character`, `/methodology`, `DECISIONS.md` |
| doctrine check | pass |
| cost | S — gates: this is the owner's own statement of the no-worth-score wall; worth recording verbatim in `DECISIONS.md` |
| why worth having | it is the wall's original wording and it is *more* permissive than the trunk's current silence — it authorises talking about conditional self-worth, which is a real reader problem, while forbidding the score. |
| trunk dedupe | thinner in trunk (the wall is enforced; the reader-facing content it permits does not exist) |
| **architect's call** | **Adopt** — Record the owner's wording of the no-worth-score wall verbatim in DECISIONS, and let the content it permits exist: conditional self-worth may be examined, never scored. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-098 |

#### N-429 · The fifteen-item research-pass output, and the rule that a data field is not permission
| field | |
|---|---|
| kind | architecture |
| source | MASTER_PROJECT_BRIEF.md §10A research-pass list (L9931–9948) and "#### Implementation rule" (L9949–9958) |
| evidence | "A researchable concept must not silently become an algorithm because data fields exist for it." |
| lands in | `records/`, `DECISIONS.md`, `/methodology` |
| doctrine check | pass |
| cost | M — gates: extends the research-gate record with a completion contract |
| why worth having | the trunk's research gate says what is blocked; this says what unblocking *requires*, including "false-positive and false-negative consequences" and "whether individual prediction is justified" — which is the difference between a gate and a promise. |
| trunk dedupe | thinner in trunk (the gate exists; the fifteen-item exit criteria do not) |
| **architect's call** | **Adopt** — Record what unblocking a research gate requires: the fifteen-item research-pass output and the rule that a data field is not permission. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-147 |

#### N-435 · The four acceptance labels, actually applied to the inferred half
| field | |
|---|---|
| kind | architecture |
| source | MASTER_PROJECT_BRIEF.md "Proposed acceptance labels for inferred material" (L14698–14727) |
| evidence | "Until labeled otherwise, every item remains: Provisional — ChatGPT 5.6 Sol contribution" |
| lands in | `DECISIONS.md`, `records/consolidation/` |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | roughly 4,000 lines of the brief (§14A and every `## Inferred …` section) are currently unlabelled — Fable's consolidation register is the natural place for the owner to finally apply Accepted / Modified / Parked / Rejected, and this sweep's rows are the list to apply them to. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — This register is where the brief's provisional half finally receives Accepted, Modified, Parked or Rejected; record the owner's labels back into the brief's decision log. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-163 |

#### N-436 · The brainstorming capture template — seven fields per proposal
| field | |
|---|---|
| kind | architecture |
| source | MASTER_PROJECT_BRIEF.md §15 "Brainstorming practice" (L14757–14774) |
| evidence | "Keep user decisions, inferred implications, and unsettled possibilities visibly distinct." |
| lands in | `DECISIONS.md` (the INVENTION entry shape) |
| doctrine check | pass |
| cost | S — gates: extends the invention rule's entry format |
| why worth having | the trunk's `INVENTION:` entries carry an adversarial check; adding "hidden definitions", "ethical and interpretive risks" and "open questions" would make them the owner's own format rather than a build convention. |
| trunk dedupe | thinner in trunk (`DECISIONS.md` INVENTION entries) |
| **architect's call** | **Adapt** — The INVENTION entry gains hidden definitions, risks and open questions; the owner's own capture template. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-164 |

#### N-437 · The research priority order — eight priorities, adolescence first
| field | |
|---|---|
| kind | architecture |
| source | MASTER_PROJECT_BRIEF.md "Inferred research priority order" (L14633–14697) [Provisional — ChatGPT 5.6 Sol contribution] |
| evidence | "Priority 1: adolescence" |
| lands in | `content/methodology.ts` (WHATS_COMING), `records/research-pipeline.md` |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | the trunk's wish list is unordered; the brief supplies an ordering with reasons, which is what turns a wish list into a plan. |
| trunk dedupe | thinner in trunk (WHATS_COMING is unordered) |
| **architect's call** | **Adopt** — Order WHATS_COMING by the brief's research priorities, with reasons. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-165 |

#### N-438 · The multiplayer coverage audit — a self-audit naming thirteen unbuilt systems
| field | |
|---|---|
| kind | architecture |
| source | MASTER_PROJECT_BRIEF.md "Multiplayer-systems coverage audit" (L4054–4250) |
| evidence | "Paid employment depends on unpaid domestic and caregiving labor." |
| lands in | `KNOWN_LIMITATIONS.md`, `records/consolidation/` |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | the owner audited his own design against the game frame and found it single-player; publishing that finding (party formation, guilds, multiplayer economy, PvP/exploitation, shared quests, trust networks, persistent-world constraints) is a stronger known-limitations entry than anything currently in the file, and the eight-item "highest-value next" list is the roadmap. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — The multiplayer coverage audit as a KNOWN_LIMITATIONS entry: the owner audited the design and found it single-player. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-166 |


### L. Presentation & voice

#### N-320 · Typed link chips: every cross-page link is labelled with the *kind* of relationship before the reader clicks
| field | |
|---|---|
| kind | architecture |
| source | gol-fable5/quests/emigrate.html, /bestiary/layoff.html, /character/in-debt.html (+ blueprint §1.3 "The link grammar") · also: gol-claudefamily/tutorial.html; every content page's "Typed links" block · also: gol-opus5/mechanics/relations.html · also: `gol-opus4-6/wings/encounters/job-loss.html` (`cross-ref-grid`, 5 cards) — every article, guide and pathway carries one |
| evidence | "inflicts Condition: Between servers · resets Stat: Reputation · requires Skill: Asking for help" — screenshot: records/consolidation/fable5/quest-skeleton-emigrate.png |
| lands in | `components/primitives.tsx` (`NextSteps`/`NextStep`), then every reading route's "Where this connects" block |
| doctrine check | pass |
| cost | M — gates: extends the existing route-inventory gate (every target must be a listed route); new gate: "every NextStep carries a relation label drawn from a closed verb list" |
| why worth having | the reader knows what a link will do for them before spending a click — orientation, not decoration; the closed verb list also makes wrong-shelf content visible at build time. |
| trunk dedupe | thinner in trunk (`NextSteps`/`NextStep` render bare link text under "Where this connects"; no relation type, no closed vocabulary) |
| **architect's call** | **Adopt** — Typed, explained cross-links: a relation from a closed list and a why-line on every "Where this connects" card; navigation the reader can read before clicking. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-001, CF-002, OPUS5-060, OPUS46-003 |

#### N-321 · The single-home rule stated *to the reader* as a reportable bug, not only enforced in the build
| field | |
|---|---|
| kind | architecture |
| source | gol-fable5/lenses/money.html, /lenses/index.html (+ blueprint §5.2a) · also: gol-claudefamily/index.html, topic-lenses.html (+ blueprint §1.3, §5.2) · also: gol-claudefamily/index.html, tutorial.html (+ blueprint §1.2, §5.2) |
| evidence | "If you find an explanation here that exists nowhere else, that is a bug — report it to the Debug Room." |
| lands in | `/topics` intro + each `/topics/*` page footer; `/methodology` |
| doctrine check | pass |
| cost | S — gates: extends gate on duplicate-explanation review; new gate: "the invariant sentence appears on every topic route" |
| why worth having | makes the site's anti-rot rule checkable by readers, which is the only maintenance that scales; and it is a quiet promise that nothing here is padding. |
| trunk dedupe | thinner in trunk (`app/topics/page.tsx` says "Four guides own the core mechanisms; everything else … links to them rather than re-explaining" — stated once, on the index, as description rather than as an invariant with a reporting route) |
| **architect's call** | **Adopt** — The single-home rule stated to the reader as a reportable bug on every topic route. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-002, CF-003, CF-001 |

#### N-322 · System tags at the head of a page, showing which parts of the model it touches
| field | |
|---|---|
| kind | presentation |
| source | `gol-opus4-6/pathways/index.html` (`wing-tags` on every entry) and every article header · also: `gol-opus4-6/pathways/index.html` (10 entries) |
| evidence | screenshot: records/consolidation/opus4-6/pathway-index-wingtags.png |
| lands in | `app/situations/page.tsx`, `app/topics/page.tsx`, `components/primitives.tsx` `PageHeader` |
| doctrine check | pass |
| cost | S — gates: extends gate 2 (tag labels must be edition-parity through `<Term>`; set-down routes carry no tag row) |
| why worth having | it shows *before* the click that a job loss is money and people and standing at once — the trunk's own thesis on that page, made visible in one glance |
| trunk dedupe | not in trunk (`ROUTES` has `summary` and `searchable`, no cross-system tagging surfaced to the reader) |
| **architect's call** | **Adopt** — System tags at the head of situation and topic pages through <Term>; no tag row on set-down routes. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-004, OPUS46-007 |

#### N-323 · One accent colour per domain, carried consistently through nav, tags, cards and rules
| field | |
|---|---|
| kind | presentation |
| source | `gol-opus4-6/style.css` lines 18–28 (`--c-player` … `--c-meta`), applied via `--wing-accent` |
| evidence | "--c-player: #d4a843; --c-world: #2d9ea3; --c-resources: #4a9e5c; --c-skills: #4a7fd4;" |
| lands in | `app/globals.css` (`--atlas-*` token set), `/map` domain tracks, `/topics` cards, cross-ref cards |
| doctrine check | pass |
| cost | M — gates: new gate: *every domain colour meets contrast on both themes and is never the sole carrier of meaning* (a text label always accompanies it) |
| why worth having | after two pages the reader knows green means resources without being told; it is the cheapest navigational memory aid a reference site can buy, and it is Sims-grade presentation craft rather than decoration |
| trunk dedupe | thinner in trunk (one global `--atlas-accent`; `.domain-track` exists in CSS but is not colour-coded per domain) --- |
| **architect's call** | **Adapt** — One accent per domain carried through the map tracks, topic cards and tags, with a text label always beside it; contrast-checked on both themes. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-006 |

#### N-324 · Frame-strength tags: four values, one per page, visible, each with a per-page "why this tag" line
| field | |
|---|---|
| kind | instrument |
| source | gol-fable5/debug/frame-tags.html + every content page (+ blueprint §3.5) · also: every content page's `.frame-tag` block; defined in disanalogy-register.html (+ blueprint §3.5) · also: gol-opus5/mechanics/registers.html · screenshot: records/consolidation/opus5/board-register-zero.png · also: gol-opus5/mechanics/registers.html + atrium/how-to-read.html |
| evidence | "an instrument you can't set down is a dogma. The tags are the setting-down, page by page." — screenshot: records/consolidation/fable5/frame-tags-legend.png |
| lands in | `content/routes.ts` (`intensity` extended from full/light/down to a four-value frame strength) + `components/SiteChrome.tsx` |
| doctrine check | changes a lint → stop-and-ask (the trunk's set-down assignment and gate 2 lint are derived from `intensity`; re-typing it touches `content/exclusions.ts`'s neighbours and must not be rebalanced to fit content) |
| cost | L — gates: extends gate 2 and the set-down route list; new gate: "every route's tag has a why-line and the SET DOWN tag forbids the generated game-vocabulary list" |
| why worth having | the trunk's set-down is binary and invisible to the reader; four graded values with a stated reason per page tell the reader how much to trust the metaphor *on this page*, which is the whole instrument commitment made legible. |
| trunk dedupe | thinner in trunk (three intensities exist, `full`/`light`/`down`, but they are presentation levels — never shown to the reader, never explained, and carrying no per-page rationale) |
| **architect's call** | **Park** — Frame-strength tags with a per-page reason are the richest presentation idea in the archive and they re-type the field gate 2 and the exclusion list derive from. Stop-and-ask: the owner decides whether the enum widens; until then, park. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-039, CF-044, OPUS5-020, OPUS5-063 |

#### N-325 · Set-down as a visual state, not only an editorial one
| field | |
|---|---|
| kind | presentation |
| source | gol-fable5/css/site.css (`body.set-down` quiets the accent, dims the wing nav to .75 opacity, greys typed-link labels); /character/grief.html |
| evidence | screenshot: records/consolidation/fable5/setdown-quieting-grief.png |
| lands in | `app/globals.css` / `app/sim.css` `.is-setdown`, `components/SiteChrome.tsx` |
| doctrine check | touches a sensitive page → the five sensitive routes stay byte-identical at *source*; a global stylesheet change to `.is-setdown` must be treated as touching them and reviewed as such |
| cost | S — gates: extends the set-down gate with a visual assertion |
| why worth having | the page goes quiet before the reader has read a word — the fastest possible signal that the site knows where it is. |
| trunk dedupe | thinner in trunk (`is-setdown` exists and the header already drops to a quiet nav subset with no Play entry; the chrome itself does not visibly quiet) |
| **architect's call** | **Adapt** — Set-down as a visible chrome state: the accent quiets and the nav dims before a word is read; a global stylesheet change reviewed as touching the frozen pages. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-049 |

#### N-326 · A typographic marker for game vocabulary, so the frame is visible as a frame
| field | |
|---|---|
| kind | presentation |
| source | `gol-opus4-6/style.css` §"Game-vocabulary marker" (`.gv`) — used across all content pages |
| evidence | "font-variant: small-caps; font-weight: 500; letter-spacing: 0.03em; color: var(--wing-accent);" (the `.gv` rule; the rule also sets a sans `font-family`, elided here) |
| lands in | `components/Term.tsx` / `app/globals.css` (`.term` styling in Game Guide edition) |
| doctrine check | pass — must render as plain text in Standard edition and on set-down routes, where the class must not appear at all |
| cost | S — gates: extends gate 2 (set-down vocabulary lint) and gate 3 (parity) — new assertion: *the marker class never renders in Standard edition or on a set-down route*, proven red by planting one |
| why worth having | it makes the game frame legible as a frame rather than as the site's ordinary voice — which is precisely the "model, not metaphor" commitment made visible, and it makes the frame easier to put down because you can see where it is |
| trunk dedupe | thinner in trunk (`<Term>` renders `.term` and `.term--defined` with a gloss; the trunk already defines at first use — that strength is *taken*. There is no persistent visual marker on subsequent uses.) --- |
| **architect's call** | **Adopt** — A small-caps marker on game vocabulary after first use in Game Guide only, never in Standard or on set-down routes; the frame legible as a frame. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | OPUS46-042 |

#### N-327 · Restore `branch` as an edition term so Standard readers get "decision branch", not "Branch".
| field | |
|---|---|
| kind | presentation |
| source | tgtl-claude-2.0/content/terminology.ts · also: tgtl-claude-2.0/content/terminology.ts · also: `gol-chatgptsol5-6/content/terminology.json`, `content/guidance-terminology.json` · also: MASTER_PROJECT_BRIEF.md §6A "Working translation layer" (L6383–6412) + §12A.6 table (L10097–10115) |
| evidence | "branch: { key: \"branch\", standard: \"decision branch\", game: \"branch\", define: \"a fork where the routes genuinely diverge\" }" |
| lands in | `content/terminology.ts` `TERMS`; consumer `app/walkthrough/page.tsx:132` |
| doctrine check | pass — restoring a `<Term>` key strengthens edition parity rather than changing a lint list; the generated set-down forbidden list grows by one, which is the safe direction |
| cost | S — gates: extends gate 3 (terminology parity + component source lint) and gate 2 (set-down vocabulary lint, which generates from `TERMS`) |
| why worth having | 2.0 routed "branch" through `<Term>`; the trunk dropped the key while the walkthrough still prints **Branch** as a control name in both editions. Gate 3's own recorded scope note explains why the lint cannot catch it — single common words are excluded to avoid false positives on prop and class strings — so the only fix is the term map. Small, but this is exactly the drift the two-edition doctrine exists to prevent. |
| trunk dedupe | not in trunk (`content/terminology.ts` `TermKey` union no longer contains `"branch"`) |
| **architect's call** | **Adopt** — Restore branch and planTier as edition terms; the walkthrough prints "Branch" in both editions today. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | CLAUDE2-020, CLAUDE2-021, SOL1-046, BRIEF-001 |

#### N-328 · The Lexicon: a versioned controlled vocabulary with one canonical home per term, on its own reader-facing page
| field | |
|---|---|
| kind | instrument |
| source | gol-fable5/lexicon.html (+ blueprint Appendix A) · also: gol-opus5/mechanics/glossary.html |
| evidence | "Each term is defined once, anchors to one canonical page, and is used identically site-wide. Writers may not coin mechanics per-page." — screenshot: records/consolidation/fable5/lexicon-table.png |
| lands in | a new `/lexicon` route reading from `content/terminology.ts`, linked from `/methodology` and `<Term>` |
| doctrine check | pass |
| cost | M — gates: extends gate 2 (set-down vocabulary lint) — every lexicon row already carries an `allowedAtSetDown` flag in the trunk; new gate: "every game-vocabulary term resolves to exactly one canonical route" |
| why worth having | the reader gets one page that decodes every piece of game vocabulary the Game Guide edition uses, including which terms the site refuses (XP is "explicitly *not* a life score"; "Save point — does not exist"). |
| trunk dedupe | thinner in trunk (`content/terminology.ts` holds ~50 Standard/Game pairs and drives `<Term>` tooltips, but there is no assembled vocabulary page and no canonical-home column) |
| **architect's call** | **Adopt** — A reader-facing lexicon page from terminology.ts with a canonical-home column and which terms the site refuses. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-005, OPUS5-061 |

#### N-329 · A register policy stated on the page: comedy permitted in exactly one page class, banned two doors down
| field | |
|---|---|
| kind | voice |
| source | gol-fable5/quests/renew-a-passport.html, /quests/settle-an-estate.html |
| evidence | "The comic register is permitted here and banned two doors down, at Settle an estate." |
| lands in | `/methodology` (editions and tone section) + any bureaucracy guide the trunk builds |
| doctrine check | pass — never applies within the five sensitive routes or anything grief-adjacent |
| cost | S — gates: extends gate 2's neighbourhood; new gate: "the comic register is declared per route and excluded from all set-down and loss-adjacent routes" |
| why worth having | it is how a site is allowed to be *fun* — the owner's stated standard — without ever being fun in the wrong room, and stating the rule where the reader can see it is what makes the humour safe rather than risky. |
| trunk dedupe | not in trunk (the trunk's tone is uniformly warm-serious; there is no sanctioned place for lightness and no rule bounding it) |
| **architect's call** | **Adopt** — A declared comic register permitted on bureaucracy pages and banned on every set-down and loss-adjacent route; how the site gets to be fun without being fun in the wrong room. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | FABLE5-048 |

#### N-352 · Locked, rare and conditionally unlocked paths — with the actual law named in Standard
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md §4A "Locked, rare, and exceptional paths" (L397–414) |
| evidence | "In Vanilla language, the guide should explain the actual law, institution, custom, or resource barrier." |
| lands in | `/history`, `/map` (availability states) |
| doctrine check | pass |
| cost | M — gates: extends gate 2 (a Game Guide "locked" must have a Standard sentence naming the barrier) |
| why worth having | "locked" is a satisfying word that hides a real statute; the brief forbids the hiding, and that pairing is the site's best argument for the two editions. |
| trunk dedupe | thinner in trunk (`content/guidance.ts` has an `Availability` union incl. `unlockable`, but no era/legal barrier content behind it) |
| **architect's call** | **Adopt** — An edition rule with a gate: a Game Guide "locked" must have a Standard sentence naming the actual law, institution or barrier. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-018 |

#### N-358 · Passion, project, quest, questline and purpose are five different things
| field | |
|---|---|
| kind | content |
| source | MASTER_PROJECT_BRIEF.md §7A "Passion, project, and quest are different" (L8873–8884) · also: MASTER_PROJECT_BRIEF.md §7A "Side quests" (L8910–8936), "Quest promotion and demotion" (L8937–8964) |
| evidence | "A passion may never become a project. A project may be pursued without passion." |
| lands in | `content/terminology.json`, `/walkthrough`, `content/character.ts` (PRESET quests) |
| doctrine check | pass |
| cost | S — gates: extends gate 2 |
| why worth having | the trunk maps "goal → main quest" and "project → side quest" in one line each; the five-way distinction is what stops the reader concluding that an unpursued passion is a failure. |
| trunk dedupe | thinner in trunk |
| **architect's call** | **Adopt** — Passion, project, quest, questline and purpose as five distinct terms, and "side" as priority not value; term map and walkthrough. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-026, BRIEF-028 |

#### N-431 · The five-region core screen anatomy
| field | |
|---|---|
| kind | presentation |
| source | MASTER_PROJECT_BRIEF.md §12A.1 "Core screen anatomy" (L9998–10023) |
| evidence | "Clear indication of whether the page is showing a population baseline, an archetype, or the user's entered profile" |
| lands in | `components/SiteChrome.tsx`, `/map`, `app/timeline/page.tsx` |
| doctrine check | pass |
| cost | L — gates: extends the 320px floor and JS-off floors per region |
| why worth having | the "which of three things am I looking at" indicator in region 1 is a small element doing enormous honesty work, and the trunk has no equivalent. |
| trunk dedupe | thinner in trunk (the trunk's routes each solve layout locally; there is no screen contract) |
| **architect's call** | **Reject** — A five-region screen contract is a rebuild of settled layouts; the one useful element, which-of-three-things-am-I-looking-at, is moot on a site that holds no reader profile. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-157 |

#### N-432 · Edition atmosphere — parchment, brass and route lines against atlas blues
| field | |
|---|---|
| kind | presentation |
| source | MASTER_PROJECT_BRIEF.md §12A.6 (L10112–10115) |
| evidence | "The Game Guide edition may use warmer parchment, brass, amber, and map-like route lines." |
| lands in | the theme layer; `components/Term.tsx` edition state |
| doctrine check | pass |
| cost | M — gates: extends gate 2 (atmosphere may differ; conclusions may not) and the contrast/reduced-motion floors |
| why worth having | the two editions currently differ in words alone; giving them materials is the cheapest way to make the choice feel like a choice, and the brief bounds it ("both should retain high contrast, calm spacing, and a serious editorial tone"). |
| trunk dedupe | thinner in trunk (light/dark themes exist; the editions share one palette) |
| **architect's call** | **Adapt** — A bounded material difference for the Game Guide edition (accent and ornament tokens), both themes, contrast-checked; the owner's design call. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-159 |

#### N-433 · Progressive disclosure that preserves the reader's place across every switch
| field | |
|---|---|
| kind | presentation |
| source | MASTER_PROJECT_BRIEF.md §12A.7 (L10116–10127) |
| evidence | "Standard and Game Guide switching should preserve the selected age, path, and filters." |
| lands in | `components/Term.tsx`, `components/timeline/TimelineInstrument.tsx` |
| doctrine check | pass |
| cost | M — gates: new gate: an edition or lens switch never resets view state |
| why worth having | it is the interaction rule that makes the two editions one guide rather than two, and it is checkable. |
| trunk dedupe | thinner in trunk (the timeline preserves its own view; edition switching across routes is untested against this assertion) |
| **architect's call** | **Adopt** — A gate that an edition or lens switch never resets view state; the browser suite already checks map and guidance, extend it site-wide. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-160 |

#### N-434 · "The mentor you never had" — stated as a promise with its own limits
| field | |
|---|---|
| kind | voice |
| source | MASTER_PROJECT_BRIEF.md "Product identity implication" (L2118–2135); "Life lessons and the mentor system" (L1854–1861) |
| evidence | "We will show you what others learned, what the evidence suggests, what the tradeoffs are, and where the advice may fail" |
| lands in | `/`, `/methodology`, `README.md` |
| doctrine check | pass |
| cost | S — gates: none new |
| why worth having | it is the clearest one-line statement of what this site is for anywhere in the brief, and the owner wrote the disavowal ("we know the correct way to live" — explicitly *not* the promise) in the same breath. |
| trunk dedupe | not in trunk |
| **architect's call** | **Adopt** — "The mentor you never had", stated with its disavowal, on /methodology and in the README. |
| owner triage | Accepted — the architect's call stands (owner, in chat, 2026-09-04; see §8) |
| sweep ids | BRIEF-161 |

## Appendix A · Already in the trunk (per sweep, so the harvest reads as thorough, not thin)

### gol-opus4-6

- **Job loss as a decision sequence** — `app/situations/job-loss/page.tsx` is the 2.0 harvest of this prototype's pathway pattern, and is substantially deeper (the clocks, the two injuries on two clocks, the scheduled second-month low point, the floor callout).
- **The "no reserves" caveat on job loss** — the prototype's model-breaks note ("this isn't a boss fight, it's a survival encounter") is already the trunk's `Callout tone="caution"` titled "What decides which of these applies: the floor".
- **Respeccing / changing direction is not starting over** — `/topics/work` §"Changing direction is not starting over"; also `content/terminology.ts`.
- **Health: the maintenance asymmetry and the ceiling** — `/topics/health` §"Why prevention feels worthless" carries this, with the level/ceiling distinction the prototype lacks.
- **Energy: three pools, acute vs chronic depletion, the failing gauge** — `/topics/health` §"Energy is the daily readout" is a near-complete superset of `wings/resources/energy.html`.
- **Time as the master resource; exchange rates** — `/topics/money` §"Exchange rates, and why they belong to your position" adds position-sensitivity the prototype does not have.
- **Trust: slow to build, fast to spend, rebuilds on worse terms** — `/topics/relationships` §"Trust is slow to build and fast to spend".
- **Repair after rupture** — `/topics/relationships` §"Repair is its own operation" is materially deeper than `wings/party/conflict.html` §Repair (it separates repair from negotiation, names the four moves, and names the manipulation check).
- **Define a game term at first use** — `components/Term.tsx` `define` prop and `TermHeading`; the prototype's strength here is already trunk doctrine (§7.3).
- **Starting conditions as unchosen difficulty, never a verdict** — `content/play/framing.ts` `BRIEFING_POINTS.difficulty`: "A hard start is a hard start — never a verdict on the player."
- **No win condition supplied; you define it** — `BRIEFING_POINTS.win` and the creation weights.
- **Variance: skill sets the distribution, luck draws the result** — `/situations/job-loss` and `/methodology`; stronger than `wings/world/randomness.html` on the doctrine, weaker on luck surface area.
- **A dark reading theme** — the trunk has light/dark themes with a full token set; the prototype's dark game-wiki look is one fixed theme with no light mode and no reduced-motion handling.
- **No points, badges, progress bars or score** — both hold the line; the prototype states it on its homepage, the trunk enforces it with lints.
- **Sunk cost as a signal that the past is deciding** — present in `/topics/work` and `/guidance`'s reversibility fields.
- **Mobile floor** — the prototype reflows cleanly at 375px (`home-mobile-375.png`); so does the trunk, which additionally has a 320px floor and JS-off floors the prototype does not attempt.

### gol-opus5

- **The Threshold / Help-now surface**, hotlines only, reachable from every page, never interstitial — trunk `/threshold` + `components/HotlineList.tsx`.
- **Supporting-someone page** — trunk `/threshold/supporting-someone` (byte-identical, from this donor).
- **The guided pressure reading** and its ordered flow (condition → slack → wall-or-door → still-want-it → conflict → only-then-resources) — trunk `content/board.ts`, `/character/board`. Naming which row binds and never how bad it is, is already the trunk's rule.
- **Crisis short-circuit before any rating** — trunk `CRISIS_CHIPS` in `content/board.ts`.
- **Decision log** and **maintenance / upkeep ledger**, local-only, no counts, no streaks, with erase — trunk `/character/logs`, `components/Logs.tsx`, `ResetButton`. The trunk's page even carries the prototype's "a named deferral is a debt with a number on it" and "the tool does not nag" reasoning.
- **No scores, no levels, no streaks, no completion, no reader assessment** — trunk-wide wall.
- **Local-only state, no account, no analytics, erase control** — trunk-wide.
- **A corrections register with a live format from day one** — trunk `content/methodology.ts` `CORRECTIONS`.
- **A public known-breaks list** — trunk `KNOWN_BREAKS` (four entries).
- **"Navigation, not destination"** and **"no collective subject"** as named model limits — trunk `KNOWN_BREAKS`.
- **The engine's weights published in readable form** rather than hidden — trunk `/methodology`, `cor-engine-illustrative`.
- **A single wish list as the only place unbuilt scope is named** — trunk `WHATS_COMING` (the prototype scatters `not written` markers instead; see OPUS5-062).
- **Windows, never deadlines**, and being off the common path is not being behind — trunk `/map`, `/timeline`, and its own `windows-read-as-schedule` break. The prototype's Passages wing makes the same argument against life stages.
- **Set-down pages that strip the apparatus** — trunk's five sensitive pages + `SetDownNotice`; the prototype's register zero is the same idea with a published rule (OPUS5-020 is the rule, not the practice).
- **Two editions with a translation table** — trunk `<Term>` / `terminology.json`; the prototype has one voice plus four registers, which is a different axis.
- **A "my board" free-text seven-row signature** — deliberately *not* in the trunk: `content/board.ts` states every input is enumerated and nothing is free text the site interprets. The prototype's `dossier/my-board.html` is the version the trunk knowingly rejected in 3.0, so it is not a nugget.
- **Field-report record shape** — trunk `FieldReport` type in `content/evidence.ts` (unpopulated; the rules around it are the nugget, OPUS5-052).
- **`openQuestionIds` field** — trunk `content/evidence.ts` (unpopulated; the register is the nugget, OPUS5-006).

### gol-fable5

- **Three entry intentions on the entrance** (new player / something just happened / looking for a topic) — the trunk's six doors already carry "Something happened", "Look something up", "Learn the game" and "Help me now".
- **Two-clicks-maximum triage that names its own constraint** — `/triage` promises "two questions at most" and is built on JS-free `<details>`.
- **Set-down pages that put the frame away and say why** — `SetDownNotice`, the five hard-assigned set-down routes, and the quiet header subset with no Play entry.
- **A "this site explains; it does not treat" boundary** — present on the trunk's sensitive routes and in the threshold pages.
- **The do-not-decide list and the "two injuries on two clocks" split for a layoff** — `app/situations/job-loss` (deeper than the prototype's, with a floor/buffer callout the prototype lacks).
- **The first-72-hours logistics of a death, held apart from grief** — `app/situations/a-death`, including the death-certificate-copies and funeral-pricing points.
- **The instrumentation insight about depression as the single retained mechanic** — `app/situations/depression`, byte-identical and stronger.
- **Repair as its own operation, distinct from apology** — `/topics/relationships` "Repair is its own operation".
- **Variance as skill-sets-the-range / luck-draws-from-it, and the anti-verdict use of it** — the trunk's headline mechanic, with a picture.
- **Compounding in both directions, with the flat start and the dark mirror** — `/topics/money`, with the ceilings named.
- **Crowding and the meta as a degradation mechanic** — `/topics/work` and the walkthrough's advanced tier.
- **Inherited advice as documentation of a previous patch** — `/history` and the walkthrough's "era thinking".
- **No points, no badges, no streaks, no score, no reader assessment** — architectural in both, and stated on `/character` and `/methodology`.
- **A corrections register and a published known-breaks list** — `content/methodology.ts`, with dates and detail the prototype has no equivalent of.
- **A staleness stamp component** — `StalenessStamp` exists (used once).
- **A searchable index over every route** — `components/Search.tsx` + `content/routes.ts` keywords.
- **Two editions over one authored text** — `<Term>` and `content/terminology.json` do what the prototype's lexicon only documents.
- **Sequencing a manual by tier (basics / mechanics / advanced)** — `/walkthrough`, which is a better version of the prototype's tutorial for a playing reader.

### gol-claudefamily

- Two-questions-max triage with a direct first-tier route for someone being hurt, and a no-JS floor.
- Set-down treatment for grief, a death, depression and abuse — quieter type, apparatus removed, frame demoted to routing.
- The layoff as an event with two injuries on two clocks, a search treated as a system, recovery routes, and "selected by budget line, not by worth" (`/situations/job-loss`).
- Repair as a distinct operation from negotiation, with the four moves and the rebuild-rate caveat (`/topics/relationships`).
- Sibling load imbalance and the untallied family ledger, including why it surfaces at an estate.
- Asking for help as a skill whose binding constraint is *who* you ask, and the systematic over-estimate of the burden.
- The symmetric-knowledge test, stated as the test that runs the whole relationships page.
- Trust as slow-built, fast-spent collateral that rebuilds on worse terms.
- Exchange rates between stats, their non-reciprocity, and their position dependence (`/topics/money`).
- Slack as the buffer that stops a shock becoming a cascade, and its payoff being a non-event.
- Compounding in both directions, including deferred maintenance as the fastest negative.
- Skill sets the distribution / luck draws from it, and the decision/outcome separation (the `variance` card).
- Position: the same move costs differently from a different start, with a live filter on the credential fork.
- The readout: a mark measures one narrow thing, not you (the `readout` card, `/topics/work`).
- No other person is a background character (the `party` card, `/topics/relationships`).
- The workplace's unwritten rules — org chart vs influence, review-as-budget-document, surprise, "we're like a family here" — and non-portable standing (`/topics/work`, harvested from `arena-workplace` in 2.0).
- Crowding and the meta degrading by being followed; inherited advice as versioned documentation of a previous patch, with a staleness stamp.
- Sleep debt, the training response, the stress response, and health as a level under a slowly declining ceiling (`/topics/health`).
- No score, no badges, no streaks, no comparison between readers, and the reasons in `/methodology`.
- No win condition supplied, and unequal unchosen difficulty, both in the play briefing.
- Windows that are not deadlines (`/map`, `/timeline`).
- Named limits of the frame published at rank rather than hidden (`KNOWN_BREAKS`).
- A guidebook, not an app: no account, no record, success is that you leave.

### gol-chatgptsol5-6 (Sol 1.0)

- Two-book entrance with keyboard selection, remembered locally, a reduced-motion path and a direct route to methodology (SCR-001).
- One semantic model, two vocabularies, centralised terminology; switching edition preserves every other selection.
- Eight life stages, seven parallel domain tracks, a male/female roadmap lens that asserts no sex-specific claims.
- Six headline life stats (vitality, learning, execution, regulation, social navigation, adaptability) with confidence caveats, and the "wealth is a resource / happiness is an outcome / worth is not a stat" separations (`content/character.ts` `NOT_A_STAT`).
- Plan A / B / C plus experiment and unlock path as genuinely different authored alternatives with pivot triggers, exit conditions and recovery; the complete no-recommendation state that names what would change the answer.
- The engine's re-ranking behaviour on limited health and unknown slack (`rankPlans` in `components/Guidance.tsx` already does what the Sol engine does).
- Availability states (available / conditional / unlockable / unknown) — the trunk has four of Sol's five; only "blocked" is absent.
- A tier board with S–F rows, a declared objective, disclosed factors, a per-placement ruling, an extraction-dependency field, and "tiers rank what a ruleset did to a position — never the worth of the people in it".
- An industrialization patch note with added/removed mechanics, buffs, nerfs, rollout lag, and the transition generation.
- Six evidence labels with published meanings, a corrections register live from day one, an internal-model disclosure, a public known-breaks list, and a what's-coming list as the only place unbuilt scope is named.
- Classifying every timed statement by kind — the blueprint's "never use 'should by age X' without classifying it" is the trunk's five `MilestoneKind` values with standing lines.
- Reduced motion, visible focus, semantic landmarks, skip link, 320px floor, keyboard completeness, local-only state with a visible reset.
- Windows rather than deadlines; recovery beside every cost; progressive disclosure via details/drawers; no accounts, no analytics, no third-party loads.
- Post-mortem parse (SCR-012) — built in the trunk's play layer (`components/play/Parse.tsx`), which the Sol prototype deferred.
- Daily plan, help-now routing, triage, set-down intensities — no Sol equivalent.

### tgtl-chatgptsol5-6-2.0 (Sol 2.0)

- **The Launch Window campaign itself** — the same five preset hands by name (Supported Explorer, Working Under Pressure, Credential Route, Care-Constrained Builder, Recovery and Relaunch), 24 turns, seven-ish domains, budget, delayed effects, saves, forks, comparison, doors, counterfactuals, priority-specific parse. `content/sim/campaign/*`, `SEASON_COUNT = 24`.
- **The six attribution categories** — choice / starting conditions / accumulated state / other people / systems / the draw. The trunk's `lib/sim/attribution.ts` goes further: computed, never narrated, with S-12 asserting set equality between the modifiers and the rendered factors.
- **Six evidence labels**, `calibrated` reserved and unused — `content/sim/schema.ts` `EVIDENCE_LABELS`, `RESERVED_EVIDENCE_LABELS`.
- **Other people with agency** — `COMPANION_ARCS`, the never-command five (attraction, consent, forgiveness, loyalty, commitment), refuse/leave reachable from every arc, no compatibility score.
- **Presets as positions, not difficulty grades**, in fixed presentation order, each with a fictional note.
- **Priority scorecards that reinterpret the same run**, plus mid-run revision (the aims audit, `priorityRevision` on a committed season).
- **Doors, counterfactuals, maintained commitments, neglected needs** in the post-run parse; no total score, no leaderboard.
- **Deterministic seeded replay**, seeds never in URLs, reproducibility explicitly not calibration.
- **Local-only persistence with migration honesty** — namespaced keys, legacy runs declared unresumable in plain language, caps stated beside the erase control.
- **The Decision Lab** — one shared starting state, three branches, and the trunk's three vary-axes (decision / draw / position), with curation rules that keep every window valid on every branch.
- **Two editions via `<Term>`** — the trunk's `content/terminology.ts` has ~56 keys against Sol's 30.
- **Three intensities, quick exit, sensitive routes forced to set-down**, reduced motion, 320px floor, JS-off floors.
- **Two-question triage and the door grid**; the two book covers; a "Continue where you left off" entry.
- **The Human Package content** — present as `content/play/framing.ts` BRIEFING_POINTS (see SOL2-001/002 for what is missing: it is not a reading route, and lacks the adaptability point).
- **A tier board with before/after rulings and a caveat**, and industrialization patch notes — `content/history.ts`.
- **Evidence status labels and an `EvidenceRecord` with `whatWouldChange` / `whereThisFrameFails`**, a corrections register, a known-breaks list, and a single named place for unbuilt scope (`WHATS_COMING`).
- **Hotlines with `sourceUrl`, `lastVerified`, `verificationStatus`**, a findahelpline fallback, and a "we do not verify continuously, they do" statement.
- **A daily-plan lane model** (primary / maintenance / health-recovery / buffer) and the minimum viable day — as editorial content (see SOL2-037: the tool is missing, not the model).
- **A no-recommendation state** at `/guidance`.
- **Loss-tier confined to a typed beat channel**, skippable, reduced-frame, with a real page link — stronger than Sol's equivalent.
- Sol's "Play is an activity layer, not a replacement information architecture" and "the interface never owns a second outcome model" are both trunk architecture already.

### tgtl-claude-2.0

- The whole-life roadmap (now `/map`), its eight stages, seven parallel domain tracks, the
- `/roadmap/launch` and `/roadmap/credential-decision` — moved to `app/map/`, source unchanged.
- The position filter on the credential fork, including its three-axis controls and re-resolving
- The character preset sheet, six qualitative bands, no total, no score — `components/CharacterSheet.tsx`
- The decision log and maintenance ledger, no counts, no streaks, no completion — `components/Logs.tsx`
- The pressure-reading prose in full, including the six-step order, "The expensive direction of the
- The board's paper fallback for readers without JS. I initially harvested this and was wrong:
- The guidance walkthrough with Plan A/B/C, **the hold option** (`plan-c`, "Hold, and protect recovery
- The disclosed balanced objective weighting with zero as a valid weight.
- The daily plan, its six lanes, the minimum viable day, the anti-shame rules, and the one-sentence
- All four topic pages at full depth, including the staleness stamp on `/topics/work` (G-12).
- `/history` — one era done properly, the patch note with edition-swapped headings, the tier board,
- `/situations` index with the wing rule, `/situations/job-loss` including "What this touches".
- `/triage` built on native `<details>`, working without JS.
- The Threshold, the persistent Help-now, the quick exit (improved: now a real `<a href>` that works
- The two-book entrance, the edition memory, the switch-any-time line.
- All nine 2.0 gates including doors integrity and orphan-route detection; `tests/run-gates.ts` adds
- The `_scaffold_reference/` provenance folder and the committed `screenshots/` discipline.
- The `DECISIONS.md` format (`[date] AREA — decision. Why. Reversibility.`) and the corrections
- 2.0's remaining deferred items that are already named in the trunk's own `WHATS_COMING`: reader

### tgtl-claude-3.0

- **The whole eight-act arc**: prologue-intro, briefing (Human Package), creation (win-weights → leaning → hand reveal), acts 1–2 watched / 3–8 played, end of life, the post-mortem parse, seeded replay (same hand / new hand). `content/play/acts.ts` and `cards/*` are byte-identical.
- **The resolution contract and the visible skill/draw split** — `lib/engine/resolve.ts` byte-identical; the distribution strip and its legend ("The band widths are where your move set the range. The marker is the draw.") intact.
- **The slack counterfactual shock** — `CounterfactualStrip`, the same draw at two buffers, side by side.
- **The worth-guard**, verbatim, at `content/sim/profile.ts:39` — and the S-8 exact-clause check with it. The *tier* is gone on purpose, replaced by the per-axis constraint profile with no composite; `"start — not a measure of you"` still renders beside it.
- **The watched-act doctrine** — `"This landed the way it landed. No button would have changed it."`, and the parse's "Decided for you:" treatment for watched turning points (3.0's own F1 fix).
- **The redraw wink and its extension** — "Nobody gets this button on the other side of birth" / "Most hands are never offered it at all" — and the parse's disanalogy line, all still in `content/play/framing.ts`.
- **The narrative achievement list** (uncounted, unranked, including ordinary and invisible contributions) — `content/play/parse-copy.ts` `ACHIEVEMENT_RULES`, extended in 4.0 from four objectives to ten priorities.
- **The aims audit** at act boundaries ("do you still hold the goal you chose?") with its revise path.
- **The progressive HUD** (`StatePanel.instrumentsForAct`) and the panel's `"No total. No score. There is nowhere on this panel for one to go."`
- **The seven mechanic cards with their pictures**, the "Why this happened" overlay, the deep-home links, and the mechanic-card anchors on the five deep topic/situation pages — `MechanicViz` is byte-identical; only the folder moved to `components/reference/`.
- **The walkthrough's three tiers** (Basics · Playing well · Advanced) and the five controls — the trunk's version is strictly longer (the three modes and the half-year loop were added).
- **The board rebuilt as a guided pressure reading** with its crisis short-circuit — `content/board.ts` byte-identical.
- **The engine disclosure on `/methodology`** — the Birth RNG hierarchy, hand-axis weight/hardness tables, gauge bands and slack rule, outcome-band vocabulary, rendered from the live fixtures.
- **Era-play**, **archetype resemblance at creation**, **field-report submissions**, **deeper daily-plan/ledger integration** — all four of 3.0's deferrals are already named in the trunk's own `WHATS_COMING` and/or KL §3.
- **Multiple named run slots** — 3.0 deferred it; 4.0 built it (`lib/engine/persist.ts`, capped at eight, resumable and deletable, with a "keep this one and start another" resume gate).
- **Art-direction sign-off** (blueprint §14.1) — carried as KL 1.6, the Phase-2 art checkpoint.
- **Professional review of the 3.0 beats and the board short-circuit** (blueprint §14.7) — carried as KL 1.3.
- **Hotline verification** (blueprint §14 / 3.0 KL) — closed 2026-09-04, recorded in the corrections register.
- **Hosting** (blueprint §14.9) — settled; the trunk is live as a labelled preview.
- **A 3.0 defect the trunk fixed**: on 3.0's dark play surfaces the page headings render dark-maroon on dark-navy and are effectively unreadable — visible in `30-play-entry.png` ("Before the run") and `30-creation-hand.png` ("The hand you're dealt"). 4.0's §4.2 solid-ground rule and the S-9 contrast audit closed this; nothing to harvest.

### tgtl-claude-4.0

- The three-mode play door (`/play`, `/play/arc`, `/play/campaign`, `/play/lab`) and the extended control vocabulary.
- *Launch Window — United States 2025*: 24 six-month seasons, five labelled-fictional presets + Birth RNG, the season loop (briefing → intent → allocate → resolve → consequences → explain → adapt).
- The budget economy: stocks vs. flow, per-band pip table, no carryover, rest as a real action, published in full on `/methodology`.
- The §3.4 floor set (rest/wait/seek-help, always affordable) and the recovery-tie rule.
- The consequence queue, the beat-schedule channel as a separate typed channel with no Event or Queue arm in the TYPES, and the three-subject content advisory on the prologue and the no-JS floor.
- The constraint profile replacing the difficulty tier; `content/play/tiers.ts` deleted, nothing sums the axes, `profileRender`'s key set gate-asserted.
- The ten-priority set in both modes, with staged priority presets and the full instrument one tap behind.
- Companion arcs with state-conditioned trajectories and the never-command five; the arrival cap with neglect-priority ordering (disclosed).
- The attribution split, computed from tagged components, with the explain drawer.
- The Decision Lab's three axes with their curation rules; `choicesVaryingOneStep`; the step-level `differences` list.
- Forks that save the parent first, resolve, replay, and differ per branch; named saves capped at eight in both modes; migration honesty and field-by-field save validation.
- `content/sim/campaign/doors.ts` — 187 run flags with authored opened/closed/still-recoverable states, grouped in the parse.
- `content/sim/domains.ts` — the authored domain map replacing the substring guess, published on `/methodology`.
- The six canonical instruments as drawn components, reachable milestones, the sim-namespaced stylesheets, S-9, and the §2.2 defect fix.
- Gate 10 source hygiene (control-character scan, proven red by a planted backspace); the six fixed falsifiability findings; `tools/variant-hygiene.mjs`; `tools/localize-us.mjs` and American English as authoring law.
- `records/invention-checks.md`, `content-pipeline.md`, `gate-falsifiability-audit.md`, `acceptance-evidence.md`, `s9-failing-then-green.txt` — all carried.
- The exclusion lists, untouched: S-1 flagged "dies" twice and the content changed, not the lint.

### the four Sol-lane spec documents

- **The core loop** — briefing → set intent → choose actions → resolve → reveal consequences → explain → adapt (spec §4) is blueprint 4.0 §3.4 verbatim in structure, plus a compressed-season variant the spec never asked for.
- **Functioning attributes** (spec §6.1) — vitality, learning, execution, regulation, social navigation, adaptability are the six `GaugeKey`s in `content/sim/schema.ts`, each with an authored reader-facing gloss ("whether a plan survives contact with a Tuesday").
- **Skills, resources and currencies** (§6.2–6.3), including the "surface only what is relevant now, keep the complete state in an explainable detail view" rule — the state rail plus the explain drawer.
- **Needs and maintenance debt** (§6.4) — `maintenanceDebt` in `SimState`, thresholded in `lib/sim/economy.ts`, surfaced as needs strings in the briefing, with the no-melodrama rule honoured (the drag can never take the last pip of time).
- **Multidimensional starting conditions, never a cruel Easy/Hard label** (§6.5) — the constraint profile, plus the fixed, deliberately hardness-independent preset presentation order.
- **Player-defined success** (§7) — the ten-way priority set, qualitative, zero valid, revisable as adaptation, no total. The trunk's list is the spec's list with "status and public recognition" split and "meaning, peace, or net pleasure" trimmed.
- **The action budget and the action list** (§8.1) including "rest and maintenance are real actions, not skip turn" and help-seeking as a normal strategic option — 4.0 §3.4 makes the floor set unconditional and affordable at zero pips, which is stronger than the spec.
- **The action contract** (§8.2) — costs, prerequisites, immediate/delayed/conditional effects, variance, reversibility, opportunity cost, recovery paths, evidence status — is the §7.2 option contract.
- **The decision card** (§8.3) including "no fake choice in which one option dominates every objective".
- **Event types** (§9.1) — scheduled, choice-triggered, relationship-initiated, systemic patches, bounded stochastic.
- **Six-way evidence labels** (§9.3) — `calibrated`, `evidence-informed`, `illustrative`, `speculative`, `contested`, insufficient — present across `content/sim/campaign/actions/*` and named in `KNOWN_LIMITATIONS.md`.
- **The consequence queue** (§9.4) — typed, dated in in-world time, never revealing genuinely uncertain events; every entry resolves, re-queues with cause, or expires visibly (S-11).
- **Relationship simulation** (§11) — companions with wants, limits, state-conditioned trajectories, refusal and departure; the five never-commanded things; no compatibility scores; MBTI never a mechanic.
- **Career/education factors** (§12) — prerequisites, cost, time, completion risk, portability, adjacent roles, switching cost, network effects, fit — 4.0 §3.3 as authoring guidance.
- **Saving, forking and the post-run parse** (§13) — named local saves, resumable, deletable, seed/engine/content versions inspectable; explicit forks, never silent rewind; parent-preserving forks gate-proven (S-7); the parse with tradeoffs, doors, counterfactuals, one generic real-world next step, no total.
- **The attribution split** (§9.2, §13) — six categories, computable, S-12-asserted.
- **The full safety and ethics list** (§14) and the non-goals (§19) — these are the trunk's walls already, mostly stated more strictly.
- **Launch Window's scope, seven domains, five presets and nine decision families** (§16) — built.
- **Local-first privacy, nothing in URLs, complete erase** (§13) — `lib/storage.ts` and the erase control.
- From the graphical spec: **branch comparison where states share a valid ancestor** (§19) — forks with `parentRef` and side-by-side compare. **Structural save validation and schema migration** (§19) — `lib/sim/persist.ts` validates required arrays and rejects malformed saves. **"Do not hard-code the complete story into one React component"** (§19) — the trunk's content/engine split, though `CampaignApp.tsx` at 1,637 lines is testing it.
- From the scene spec: **local-first privacy, evidence labels, safety transitions, planner handoff, genuine engine tests** are all in the "preserve" column and all present.

### MASTER_PROJECT_BRIEF.md

- Two editions (Standard / Game Guide) as one guide with one set of facts — `content/terminology.json`, `components/Term.tsx`; the brief's §6A "One guide, two vocabularies" is the trunk's gate 2.
- The twin-book entrance — `components/EntranceHome.tsx` renders the book pair with "two manuals for the same package".
- The ethereal-realm prologue and the Human Package synopsis — `content/play/framing.ts` (`PROLOGUE_LINES`, `BRIEFING_TITLE`, `BRIEFING_POINTS`).
- Birth RNG as randomized character creation with a Vanilla translation ("birth circumstances") — `lib/engine/hand.ts`, `content/play/hand-axes.ts`.
- Difficulty as a starting hand that is never a worth score — the constraint profile in `lib/engine/run.ts` refuses a composite by construction.
- The eight-stage map plus dying-and-closure — `content/timeline/stages.ts`, `content/roadmap.ts`.
- US 2025 as the first reference roadmap with a disclosed data year — `content/roadmap.ts`, the timeline batches.
- Recalibrated life stats (vitality, learning, execution, regulation, social navigation, adaptability) with no worth score — `content/character.ts` `LIFE_STATS`; this is the brief's §"Recalibrated default life stats" implemented essentially verbatim.
- Luck, attractiveness, reputation, happiness and worth explicitly refused as stats — `NOT_A_STAT`.
- "Unknown" as a valid band, not a low one — `content/character.ts`.
- Plan A/B/C as meaningfully different authored alternatives with pivot triggers, exit conditions, reversibility and a no-recommendation state — `content/guidance.ts`; covers the brief's ranked alternative ladder, alternative-route card, pivot triggers and "keeping alternatives alive".
- Objectives and vetoes on guidance — `OBJECTIVES`, `VETOES`.
- The daily plan with lanes and a minimum viable day — `/guidance/daily-plan`; the brief's §"Generated daily action plan" lanes and minimum-viable-day behaviour.
- Industrialization as a patch with a tier board and a worth disclaimer — `content/history.ts`.
- Age-indexed milestones with windows never deadlines, expectation kinds, sourced records and a not-yet-sourced list — `content/timeline/`; covers the brief's §6 milestone framing.
- Timing branches (early / window / late / interrupted / alternative / never, with "never is a path") — `TimingAnalysis` in `content/timeline/schema.ts`, on 24 of 122 records.
- Recovery beside every cost — T-4 enforces the brief's recovery-route rule at the type level.
- A sex lens on the timeline with a `measures` requirement — `TimelineInstrument.tsx`, T-9 (the *control* exists; see BRIEF-052 for the content gap).
- The research-status gate blocking predictive features — the trunk's research gate; the brief's §10A is its origin.
- The post-run parse as a life review, never a report card, with attribution split — `lib/sim/parse.ts`, `components/play/Parse.tsx`, `lib/sim/attribution.ts`.
- Counterfactual comparison of one decision — `/play/lab`, `lib/sim/forks.ts`; the brief's §6 "Counterfactual comparison".
- The decision log and maintenance ledger — `/character/logs`, `DECISIONS.md`.
- The corrections register and known breaks — `content/methodology.ts`.
- Crisis short-circuit rather than rating — `content/board.ts` `CRISIS_CHIPS`; the brief's requirement that crisis material never be a rateable input.
- Local-only state with erase; nothing in URLs; no external resource loads — the trunk's presentation walls.
- Archetypes as reference points rather than boxes, and the "default is descriptive" doctrine — `/methodology`, `content/timeline/normative-lint.ts`.


## Appendix B · Rejected on sight by the sweeps (the doctrine applied at the source)

### gol-opus4-6

- **"Difficulty: High (scales with financial reserves)" as a rendered field on a situation card** — a difficulty rating of the reader's own situation is a score by another name; the field is dropped, not re-sourced (the rest of the card survives as OPUS46-014).
- **"Duration: 1–9 months typical", "Recovery: Full", "Most people can sustain 2–4 [main quests]"** — invented digits presented as facts. Each is a claim to re-source, never a source; render no digit without a fetched citation.
- **"Loneliness is as dangerous as smoking"** — a quantitative comparison stated without a source in `wings/party/loneliness.html`; carried only as a flagged re-sourcing task under OPUS46-038.
- **"The strategy may have a 5% hit rate"** (`wings/world/randomness.html`) — an illustrative percentage with no basis; the survivor-bias argument works without it.
- **Framing a serious diagnosis, a death, or a mental-health crisis as a "Boss Fight" with strategies** — blueprint §4 Cases 7 and 10 do exactly this. Crisis-tier content is never playable and never carries a strategy frame in this build; `content/exclusions.ts` and the normative lint are not rebalanced to admit it.
- **Grief pathway text into `/situations/grief`** — `pathways/grief-pathway.html` and `wings/encounters/grief.html` contain able writing (the multiple-losses account, "delay major decisions"), but `/situations/grief` is byte-frozen. Everything there is parked for clinical review, not proposed.
- **The nine-wing top-level IA** — a genuine alternative ontology, and adopting it would be a rebuild of the trunk's IA rather than a consolidation. The *questions* (OPUS46-001) and the *cross-system tagging* (OPUS46-004) are the harvestable parts.
- **A "Where am I?" self-assessment tool** (blueprint §2.2) — the prototype never built it, and it is a reader assessment. Rejected at the blueprint.

### gol-opus5

- **The `prototype: exemplar / partial` build-status badge** on every page — reader-facing review scaffolding; the prototype's own SITE-MAP (structural finding 6) says a live site would not carry it.
- **Real helpline numbers carried in a prototype without a verification fixture** — the prototype includes live numbers and flags "Verify before any real deployment"; the trunk already has a hotline verification fixture and must not inherit unverified numbers.
- **The 37 ledger claims as facts** — abbreviated citations only, by the prototype's own admission. The ledger *mechanism* is OPUS5-002; every row is a claim to re-source, and none may render a digit until fetched.
- **Cascade step timings as figures** — "1–3 months", "6 months+", "eleven phone calls across four months" are authored or anecdotal; the map ports, the digits do not (OPUS5-030).
- **Grading the false-but-believed claim about asking someone about suicide** — correct as a claim, and it lands on `/threshold/supporting-someone`, which is byte-identical. Parked, not ported.
- **The prototype's own JS-dependent chrome** — header, nav, breadcrumbs and badges injected by `assets/gol.js`, so JS-off gives content with no site chrome. The trunk has JS-off floors on every route; this is a regression, not a nugget.
- **`ethics/did-something-unforgivable` and `codex/states-danger` as ported pages** — register-zero content in the trunk's five-sensitive-page neighbourhood; the *architectural* lesson (a wing that can overrule the ontology) is OPUS5-042/043, the pages themselves are parked.
- **The Dossier "position profile" tool that would filter the whole site by default** — the prototype lists it as not built; as described it would persist a sensitive self-description. Any version must be local-only, never in a URL, and never a default (folded into OPUS5-039 with that constraint).

### gol-fable5

- **"Grade yourself on process, never on responses" rendered as any kind of tracker** — the sentence is fine as prose; any implementation that logs the reader's asks would be reader gamification. Prose only.
- **"Attach visible progress to the slow honest loops — a log, a chain, a rep count"** (reward-loops.html): explicitly endorsed by the prototype as "the one place the site endorses gamifying anything: your own practice, by you, on purpose". On the trunk this is a streak mechanic by another name and must never be built *on the site*; it may be described as something the reader does elsewhere, and only there.
- **A skill *tree* rendered with levels, unlocks, or any reader position on it** — the dependency graph is admissible; anything that places the reader on it is a reader assessment.
- **"Difficulty settings" as reader-facing self-description** — the disanalogy entry is admissible and valuable; any UI that lets a reader set or compare their own difficulty is a worth-score in costume.
- **The prototype's crisis routing verbatim** ("In the US, call or text 988. Elsewhere, search \"crisis line\" plus your country") — the trunk's `content/hotlines.ts` is verified and dated; the prototype's line is not, and the search-instruction fallback is weaker than what the trunk ships.
- **Every figure in the prototype** — 30–70% savings rates, expenses × 25, eighteen months, 90/120 days, six months of passport validity, "median returns have fallen": claims to re-source, never sources. None may be rendered as a digit without a fetched citation.
- **Sobriety-as-build and the relapse-as-event page as *playable* content** — crisis-adjacent; reference prose only, parked for clinical review, never on the timeline and never a beat.
- **The prototype's own depression page** — written to full depth explicitly without clinical review (its SITE-MAP flags this as phase-2 decision 9). The trunk's page is byte-identical and better gated; nothing from the prototype's version goes in.

### gol-claudefamily

- **Nothing was rejected as crisis-tier playable.** The prototype never proposes playing a crisis; its set-down pages remove the apparatus rather than softening it. Worth recording, because it is the one wall this donor was built to respect.
- **No worth score, no reader gamification, no assessment anywhere in 126 pages** — the prototype's Character Sheet says explicitly it does not track yours. Nothing to reject; noted so the owner can see the doctrine was applied and found nothing to catch.
- **`build-*` pages read as archetypes and must not become resemblance.** A Build page in the prototype is a configuration the *reader chooses to read about*, with a price list; it never tells a reader which one they are. Harvested that way (CF-039's neighbours), it passes. Any version that infers a reader's build from their answers is the trunk's deferred "archetype resemblance" and stays behind its research gate — rejected on sight for this sweep.
- **`quest-fertility-window`, and timed quests generally, where a page could read as a schedule.** The prototype is careful ("deliberately thin on structure because the structure would imply a control that does not exist"), but the trunk already has a named, unsolved break — a timeline of windows can still be read as a schedule — and a fertility page would land straight in it. Not harvested as a row.
- **`meta-crowding`'s "what is actually usable" timing advice** — it edges toward a tips list without a fetched source for any crowding magnitude. The mechanism is already in the trunk; the timing guidance is not worth re-sourcing.
- **The prototype's few digits presented as facts** — "five to ten years" to permanence, "seventy years" of variable-reinforcement evidence, "six months" of do-not-decide, "many months" of probate. All are authored. Every row above that touches one is marked *needs re-sourcing*; none is a fact this sweep hands forward.

### gol-chatgptsol5-6 (Sol 1.0)

- **Numeric attribute bars on the character sheet** (`content/fixtures.json` `character.attributes[].value` = 62, 76, 58 …, rendered as `/100` with a fill bar). Six invented numbers per reader, on the one surface where the trunk has explicitly refused numbers. The confidence caption underneath does not undo the bar.
- **Bare resemblance percentages** (88%, 74%, 81%) computed from an authored adjustment table. The four-field *separation* is worth having (SOL1-017); the digits are not — the trunk's rule is qualitative bands.
- **Personal context in the URL.** `window.history.replaceState` writes `?edition=…&roadmap=…&age=27&stage=…` on every state change. Age is personal context; the wall says nothing in URLs. Edition and stage would be arguable on their own; the pattern as written is not.
- **A `sexRoadmap` control that changes nothing.** The prototype ships a female/male switch that alters no claim, with a caption saying so. The trunk's three-way lens with the same honest caption is the better version; a two-way switch with no shared default reads as a claim it is not making.
- **The `db/`, `drizzle/`, `examples/d1/` and `worker/` scaffolding.** Empty Cloudflare D1 template code — `db/schema.ts` is literally "Intentionally empty by default." There is no schema idea in it to harvest, and a database is the wrong direction for a static, local-only site.
- **"21 inspectable nodes" as a status stamp on the social skill tree.** A count of the site's own content presented as a credential. Small, but it is the shape of a completeness claim.
- **`nutritionTopics` / `historicalEras` / `institutions` ribbons rendered as coverage.** Seventeen topic chips above three actual nutrient cards reads as a promise of coverage the fixture does not have; the same content belongs in a what's-coming list, not as a ribbon over the content.

### tgtl-chatgptsol5-6-2.0 (Sol 2.0)

- **Illustrated scene renderer as the primary Play surface** — Sol itself rejected it (IMPLEMENTATION_DECISIONS.md, 2026-09-01: "The scene-driven viewport is rejected"), rolling back to the content-first workspace after finding it dense on a phone and slower to explain. Harvested only as grammar (SOL2-056/057), never as a route.
- **Character art depicting age decline** — the bible forbids it ("without changing identity or depicting decline"); anything that read as a decline curve on a body would be a worth-score in pictures.
- **`calibrated` evidence label on any shipped mechanic** — Sol reserves it and ships nothing under it; the trunk does the same. Any harvested magnitude stays illustrative.
- **Sol's `content/roadmap.json` age-window figures and every simulation magnitude** — claims to re-source, never sources. No digit harvested here renders without a fetched source (T-1).
- **The 2026-08-26 safety verification date** — must not be carried across; the trunk's own 2026-09-04 check supersedes it, and Sol itself notes "a routing regression is not a new external verification".
- **Story identity fields, if read as character creation** — flagged inside SOL2-010 rather than rejected, because the owner deferred personal character creation (§12.4); the row is written so the architect can decline it cleanly.
- **The "90–150 minute" playtime target** in Sol's notes — an unvalidated duration claim; not harvested.
- **`review/*browser-profile*`** — browser junk, ignored per the brief.

### tgtl-claude-2.0

- **Restoring the board's free-text rows as free text.** The seven `<textarea>` rows are the visually
- **A hosted field-report submission form.** 2.0's deferred item, and the trunk's too. Any real
- **The 2.0 placeholder text as page content.** The placeholders are illustrative specifics about an
- No worth score, reader assessment, gamified progress, invented statistic, or external load was found
- Nothing harvested touches the five sensitive pages. `app/situations/depression`, `a-death`, `grief`,

### tgtl-claude-3.0

- **The patch spec's "characters performing activities", poses for conflict/celebration/departure, and staged furniture** (§2) as *literal* direction — the site's visual contract is instrument-and-atlas and forbids depicting people as lifestyle content. Harvested only in translated form as CLAUDE3-012 (variance within the existing motif language). Taking §2 at its word would be a different site.
- **"Complete at least one constrained and one supported Launch route through the UI"** as a *deliverable to reproduce here* — it is a QA instruction to that other build's executor, not an idea. Its testable core is folded into CLAUDE3-009's gate.
- **Any use of 3.0's difficulty tier** (Easy/Medium/Hard/Extreme, summed hardness 0–12) — 4.0 removed it deliberately because a composite over a starting position is one step from a ranking of a person. Re-importing it would rebalance the no-score wall. Not harvested; recorded here so the deletion reads as intentional.
- **3.0's `TIER_THRESHOLDS` published on `/methodology`** — same reason; the constraint profile's per-axis disclosure supersedes it honestly.
- **Every number in 3.0's card prose and weight tables** — authored, illustrative, and already labelled as such. Nothing in this build is a source; nothing was carried forward as a figure.

### tgtl-claude-4.0

- **Personal character creation / self-insertion** (KL §3.2, blueprint §12.4). Deferred *indefinitely* and FORBIDDEN until the owner explicitly revisits; S-6 asserts hands come only from Birth RNG or the five labelled-fictional presets and there is no third route. It is also the clearest collision with the no-reader-assessment wall: a hand the reader builds from their own life turns every subsequent outcome into a statement about them. Not harvested.
- **A composite or roll-up over the constraint profile's four axes** — the thing the deleted difficulty tier was. Blueprint §11 FORBIDDEN; S-8 asserts `profileRender`'s exact key set.
- **The internal satisfaction measure rendered anywhere in play** (KL §2.4). It exists so S-10 can ask whether a way of playing dominates; there is deliberately no function that sums its ten readings. Method on `/methodology` only.
- **Any cross-run aggregation or characterization of the player's choices.** Blueprint §11; S-5's guarantee is structural (asserted against `computeParse`'s signature), not lexical. A "your play style" panel is the obvious tempting nugget and it is out.
- **Fleet, balance or population data on any play surface.** 12,600 fleet seasons is a compelling number and it belongs on `/methodology`, nowhere else.
- **Loosening the S-1 exclusion lists to admit a harvested phrase.** Named here because the pressure is real and 4.0's own precedent is the answer: change the content, not the list.
- **Rebalancing the S-10 floor predicate to make a thin bottom read as open.** The falsifiability audit's open finding on `tests/s10-balance.ts:144` is exactly the shape of that temptation.

### the four Sol-lane spec documents

- **Archetype resemblance by percentage** (playable §6.6: "A player may resemble several archetypes by percentage") — as applied to a *character* it is an authoring device; as applied to a reader it is reader assessment, which is a wall. The trunk already parks it: `WHATS_COMING` names archetype comparison and creation-time resemblance as deferred behind a research gate, with resemblance, prevalence, confidence and viability kept separate. Not harvested as a row; it is already correctly parked.
- **MBTI as an "optional self-reflection lens"** (playable §6.6) — even hedged, it is a typing instrument offered to the reader. The trunk's line ("MBTI never a mechanic") is better and stays.
- **"Difficulty" language for starting positions** — the spec itself rejects the cruel Easy/Hard label but keeps the word "difficulty" in §6.5. The trunk's constraint profile with a fixed hardness-independent presentation order is the correct form; the word does not come across.
- **Any storyboard, animation, or scene treatment of a loss- or crisis-tier beat** — the graphical spec's §21 and the scene spec's §19 already forbid it, and the trunk's exclusion lists forbid the content being playable at all. Harvested only as the *presentation* rule at SPECS-047; nothing that would put a crisis beat on a scene surface is harvested.
- **"Heart meters", affection totals, compatibility scores, beauty-ranked avatars, morality meters** — named and rejected inside the specs themselves; recorded here so the doctrine is visibly applied.
- **The 2.1 defect list as defects** (graphical §10, items 1–7) — these are the Sol build's bugs, not the trunk's. Two of the seven do generalise to the trunk and are harvested as SPECS-020 (explanations do not survive) and SPECS-049 (silent storage failure); one generalises as SPECS-022 (invisible skills) and one as SPECS-005 (action overload). The rest (inverse debt band, schema-2 validation, that build's missing playthrough) do not apply.
- **Every figure in all four documents** — viewport sizes, word budgets, millisecond ranges, action counts, playtimes, scene and callback counts. None is sourced, none is about readers, none may be rendered. Marked *(design constraint)* wherever harvested.

### MASTER_PROJECT_BRIEF.md

- **Archetype resemblance percentages at character creation** (§"Character-creation archetype resemblance", "Archetype result card" — "Resemblance percentage or calibrated band") — reader assessment, and a percentage without a fetched source. The *descriptive* three-layer archetype library (tendency / party-role / strategy) could survive as content; the scoring of a reader against it cannot. Already deferred in the trunk's WHATS_COMING; keep it deferred.
- **MBTI as an optional personality lens** (L5115–5472, ~360 lines) — a typing instrument applied to the reader is reader assessment however it is hedged, and the brief's own "Licensing and implementation caution" subsection flags a trademark problem on top. The anti-horoscope requirements are worth keeping (BRIEF-150); the lens is not.
- **Net Pleasure as a headline stat computed for the reader**, and the self-report intake behind it (§"Hidden stat and self-report", §"Measurement requirements") — a wellbeing score is a worth score with a friendlier name. The nine-way wellbeing *distinction* survives as content (BRIEF-100); the stat and the intake do not.
- **"Net Pleasure yield of a build"** (L3428–3444) — ranking life strategies by expected happiness is precisely the universal scorecard §1's non-goals forbid.
- **A single numeric difficulty score** — the brief rejects it itself ("could imply more precision and moral meaning than the evidence supports"); recorded here so the doctrine is visibly applied.
- **Difficulty as a point multiplier on achievements** ("without converting adversity into a simplistic point multiplier") — the brief refuses it; so does the trunk.
- **Achievement rarity rendered as a figure** without a fetched denominator — every rarity claim in §6B is a number with no source. Keep the *types*, drop the digits until sourced.
- **"Extreme" as a public difficulty tier label** applied to a reader's own life — the brief's own Vanilla translation ("severely constrained starting conditions") is the shippable form; the Gaming tier applied to a person is a difficulty label as identity, which §"Privacy and psychological risk" forbids.
- **Any figure in the brief, used as a figure** — the brief cites no sources anywhere. Every number in every row above is a claim to re-source under T-1.
- **A global alignment meter** (§"Moral decision analysis") — the brief rejects it; noted so the nine-lens content is not mistaken for a meter.
- **Suicidality, self-harm, abuse, sexual violence and reproductive coercion as playable or timeline content** — crisis-tier, rejected on sight. They appear as list items inside the adolescence, health, sexuality and relationships modules; every one is stripped before those modules are built.


## Appendix C · What the sweeps could not do

### gol-opus4-6

- **No sourcing was attempted.** Every figure in this prototype is unsourced; I marked each as a claim to re-source rather than fetching, per the brief's division of labour. The rows carrying digits (OPUS46-008, -014, -030, -034, -036, -037, -038, -039) all need a fetch before any of them can render a number.
- **`serve-and-tunnel.ps1`, `start-preview.bat` and `preview-log.txt` were read but not run** — they are a Cloudflare tunnel harness for sharing the static site, with no bearing on content. Nothing in the prototype folder was modified.
- **I did not screenshot all 38 pages.** Nine screenshots, chosen for the devices whose value is visual (the question grid, the encounter card, the concept table, the per-step pathway, the stub badges, the callout stack, the tag rows, and a 375px check). The remaining pages are prose whose value is quoted above.
- **Ten of the prototype's own pathways and roughly fifty-five of its sub-topics are stubs** — one- or two-sentence descriptions on landing pages. Where a stub described an idea the trunk lacks and the description was substantive enough to evaluate (the seven party roles, the optimisation discontents, reversibility, quest tiers), I harvested it and said so; where it was a title only, I did not manufacture a row from it.

### gol-opus5

- **The page count does not reconcile.** `SITE-MAP.md` and `CHANGELOG-STRUCTURE.md` both say 120 HTML pages; `find` returns 113 `.html` files. I did not track down the seven-page difference. The inventory tables in SITE-MAP list every page I found, so I do not think anything is hidden, but the discrepancy is real and I am reporting it rather than explaining it away.
- **I read roughly 45 of the 113 pages in full**, chosen for the areas the assignment flagged as not-travelled plus the mechanics pages the rest depend on. The Codex is 36 pages and I read six of them at depth (`constraints`, `horizons-empty-move-set`, `systems-legibility`, `moves-avoid`, plus skims); there is likely more harvestable content in the move-family specs (`moves-ask`, `moves-negotiate`, `moves-maintain`, `moves-accept`) and the resource entries (`resources-slack`, `resources-standing`, `resources-time`), particularly the ten-field move template.
- **Live JS behaviour is unverified.** The lens switcher, the ledger grade filter, the cultural-scope filter and the three Dossier tools are described from source and screenshots; I did not click through them (`assets/gol.js` was read only for structure). Screenshots are static first-render.
- **I did not screenshot the ethics or reflection wings.** They are prose, their value is in the argument rather than the layout, and I quoted them instead; the 12-screenshot budget went to the visual instruments.
- **No quote longer than 25 words** was taken, and every quote above was checked back against the source HTML by grep except where the source wraps mid-sentence, in which case I quoted only the fragment that grep confirmed.

### gol-fable5

- **No live browsing.** Per the brief I did not touch the shared browser pane; all reading was via HTML text extraction, and all screenshots via the Playwright helper against `file://` URLs. Twelve screenshots taken, all at 1280 full-page; the prototype has no mobile-specific behaviour worth a 375 pass (single-column, one stylesheet, no JS beyond nav highlighting), so I did not shoot one.
- **No source verification of any prototype claim.** Every empirical statement in `gol-fable5` is unsourced by construction (the prototype has no evidence apparatus at all). I have marked the rows that carry figures; I did not attempt web fetches, since the brief makes re-sourcing the architect's call, not the sweep's.
- **I did not read the trunk's `lib/engine`, `lib/sim`, `content/timeline` or `content/play/cards`** beyond `mechanics.ts` and `framing.ts`. The prototype has no play or timeline layer, so nothing in it could dedupe against those; if a row above turns out to duplicate something in the sim's prose, that is the gap most likely to have hidden it.
- **Frame-tag counts are as claimed by SITE-MAP, not independently tallied.** I verified all four tag values appear on real pages (LOAD-BEARING, CONVENIENT, STRAINED, SET DOWN, plus the Canonical marker) but did not count them page by page.

### gol-claudefamily

- **No live rendering beyond eight screenshots.** The prototype is fully static and screenshots cleanly from `file://`; I stayed within the twelve-shot budget at 1280 and did not do a 375px pass, since nothing here is layout-dependent in a way that changes the harvest.
- **Twelve of the 126 pages are navigational and carry no tag**, and **17 entries are stubs** (listed at the end of `SITE-MAP.md`) — including "on-ramps by stage", "the newly disabled", "the person who just left a marriage", "mentorship", "the accident", "the eviction", "the scam", and "the promotion". I recorded the stubs' *shapes* where they matter (the separation layout is referenced by `event-separation` but does not exist) and did not invent content for them.
- **I did not fully read all 24 rule pages or all 14 arena pages end to end** — I read headings, deks and frame-tag notes for all 126, and full prose for roughly 55, choosing the ones where the trunk had no coverage. Rows CF-029 and CF-030 aggregate rather than enumerate for that reason; if the architect wants a per-rule or per-arena row, those two rows are the ones to expand.
- **`SITE-MAP.md`'s own "Structural findings" §1 — relation-vocabulary drift** ("Writing 114 pages produced **169 distinct surface labels**", markdown emphasis as in source) is a records-and-process warning I did not turn into a row, because it is advice *about* CF-002 rather than a nugget of its own. If CF-002 is built, the canonical-relation registry the prototype recommends should be built with it, not after.
- **I did not open the `2.0` folder** to verify exactly which claudefamily material reached the trunk through it; the dedupe above is against the published trunk source, which is what the brief asked for and is the stricter test.

### gol-chatgptsol5-6 (Sol 1.0)

- The prototype's dev server would not start under the system Node (v16.17.1): `vinext` needs `node:readline/promises`. It ran fine under the sweep's Node 22.20.0 invoked directly on `node_modules/vinext/dist/cli.js`. Both `npm run dev` shims resolve `node` from PATH, so anyone repeating this must bypass them.
- Screenshots are of the standard edition at 1280px only. The prototype's own `review/` folder carries game-edition and 390px captures; I kept the game-edition history capture and dropped the rest to stay inside the twelve-image cap. I did not verify the 320px floor myself — `tests/phase-five-browser-review.mjs` asserts it, and I read the assertion rather than running it.
- I did not run the prototype's own test suites (`npm run validate`, `npm test`); `npm test` runs a build, and I read the tests as source instead.
- `dist/`, `.next/`, `.vinext/` and `.wrangler/` were not read beyond confirming that `dist/client` + `dist/server` means there is no static HTML to scrape.
- `public/og.png` (2.5 MB social preview) was not opened.
- Blueprint §15's acceptance checklist and §14's phase exit criteria were read but are not represented as rows — they are checklists over ideas already listed above, and rows for them would have been duplicates.

### tgtl-chatgptsol5-6-2.0 (Sol 2.0)

- **`tools/start-review.ps1` does not work on this machine.** It prepends `~/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin` to PATH; that directory does not exist here, and `pnpm` is not on PATH either. I served the committed `dist/` production build directly with the sweep's Node 22.20 (`node node_modules/vinext/dist/cli.js start --port 8106`). Nothing in the folder was edited and no build was run.
- **No interactive play was screenshotted.** The screenshot helper takes a URL only, and the browser MCP tools are off-limits for this sweep. I captured the four Play entry screens and read `DecisionWorkspace.tsx`, `SimulationUI.tsx` and `AtlasJournal.tsx` in full instead — every claim about the decision workspace, the outcome panel, the parse and the epilogue is from source, not from a rendered turn. The mid-run and epilogue screens are therefore described, not shown.
- **`review/` contains ~60 JPG/PNG captures of the *rejected* 3.0.1 scene frontend.** Sol's own `PLAYTHROUGH_NOTES.md` says they "describe a frontend that is no longer reachable and must not be cited as current UI evidence". I read the review markdown but did not open or copy those images, and no row rests on them.
- **The five sensitive pages were not compared.** SOL2-030 through SOL2-033 are recorded from Sol's source for the clinical-review register only; I did not read the trunk's `depression`, `a-death`, `grief`, `being-hurt` or `supporting-someone` pages, so I cannot say whether the trunk already carries this material. That comparison belongs to the clinical review, not to a sweep.
- **`content/play/launch-window.mjs` (51 KB), the five act files, and `content/play/scenes/*` were sampled, not read line by line.** I loaded the launch campaign through Node to count and inspect its contracts, read `story/{graph,helpers,endings,contextual-actions,index}.mjs` in full, and read `act-one` and `act-five` structurally. A per-scene harvest of the 22 scenes' prose would be a second pass.
- **`.next/`, `.vinext/`, `.wrangler/`, `.openai/`, `node_modules/` and `tsconfig.tsbuildinfo` were not examined** (build artifacts).

### tgtl-claude-2.0

- I did not run 2.0's build or its gates — the brief forbids anything that writes into the prototype,
- I took 3 screenshots, not 12. The 2.0 pages that would fill the other nine are byte-identical to the
- I did not read the five sensitive pages for content. They diff at zero lines against the trunk, so
- I did not audit `_scaffold_reference/` (pre-2.0 scaffold source, superseded and also present in the
- `MASTER_PROJECT_BRIEF.md` §14A and the donor prototypes named in blueprint §6 (Sol 1.0, Opus 5's

### tgtl-claude-3.0

- **I did not serve or drive the trunk.** Every trunk claim above is from source reading and grep, not a rendered page — the arc/campaign findings (no `data-family` CSS, `preset.face` used once, no origin label during play, no act rail) are each verifiable by the exact file and line given, but I have not seen them on screen. If Fable wants rendered proof of CLAUDE3-001 and CLAUDE3-009 side by side, that is a ten-minute follow-up on a trunk server.
- **I could not reach 3.0's parse, counterfactual shock, or a scripted beat by driving the browser** — the arc is a 20–40 minute run and my scripted walk reached the first played decision (act 3) before I stopped it. For those surfaces I read 3.0's own `screenshots/` (`play-parse-desktop.png`, `play-counterfactual-desktop.png`, `play-resolve-desktop.png`) rather than recapturing, and confirmed by diff that the trunk renders them from the same components.
- **The patch spec could not be assessed against its own target.** As explained at the top, it describes a build that is not `tgtl-claude-3.0/` (pnpm, scene architecture, `tools/scene-browser-audit.mjs`, 25 Story nodes — none present). I assessed its four items against the trunk instead. If a second 3.0-era prototype exists somewhere that the spec *was* written for, I did not see it and someone should sweep it.
- **`.next/` and `node_modules/` in the prototype were left untouched**; I ran no build and no formatter. Nothing outside `records/consolidation/claude3/` and my scratchpad was written.

### tgtl-claude-4.0

- **No screenshots taken, deliberately.** 4.0's play layer is byte-identical to the trunk's, verified by `cmp` on six engine and content files and by an identical-diff on `KNOWN_LIMITATIONS.md` §3–§4. A screenshot of 4.0's `out/` would be a screenshot of the live site, and every visual is already captured in `tgtl-claude-4.0/screenshots/` (113 files). I did not serve `out/` and did not create `records/consolidation/claude4/` — it would have been empty. Say the word if you want the 113 existing shots indexed or a specific surface re-captured.
- **`records/content-pipeline.md` (115KB) and `records/invention-checks.md` (151KB) were read selectively**, by heading and by targeted grep for set-aside ideas, not line by line. The nine INVENTION entries and their verdicts were read in DECISIONS.md in full; only `lab-seed-curation`'s carried condition produced a row (CLAUDE4-005).
- **`records/gate-falsifiability-audit.md` (129KB) was read by heading plus two entries in full** (`s10-balance.ts:144`, `sim-gates-4.ts:237`). The twenty-five open items are harvested as one row (CLAUDE4-021) with their per-file distribution counted mechanically from the audit's headings (25 open, 6 FIXED, confirmed), not as twenty-five rows — each already has its corrected assertion written in the audit, so re-transcribing them here would duplicate a record the trunk already carries.
- **I did not verify that 5.0's timeline suites are unaudited for falsifiability** beyond noting that the audit file predates them and names no timeline test. That claim in CLAUDE4-021 is inference from the file's own scope, not a check.

### the four Sol-lane spec documents

- **No screenshots.** The assignment said none were needed; these are documents, not sites, and the four `tgtl-chatgptsol5-6-*` builds they targeted were not my input (another sweep holds them). Everything above is dedupe against the trunk's *source*, read directly.
- **I did not verify the specs against the Sol builds they were written for.** Where a spec names a defect ("maintenance debt displayed backwards", "schema-2 saves accepted without validation"), I checked whether the *trunk* has that defect and reported that; I did not check whether the Sol build did. Two of those checks found real trunk defects (SPECS-049, SPECS-022) and I quote the trunk source for both.
- **`MASTER_PROJECT_BRIEF.md` (511 KB) was out of scope** for this slug and I did not read it; if any of these spec ideas originate there in a different form, I would not know.
- **One row is deliberately unresolved:** SPECS-044 (optimal/secondary/tertiary routes) is marked stop-and-ask rather than harvested clean. It is genuinely useful and genuinely one word away from the recommendation engine `/guidance`'s no-recommendation state exists to refuse. That call is the architect's, not mine.

### MASTER_PROJECT_BRIEF.md

- **No screenshots.** The input is a single Markdown document with no servable artifact; nothing here has a visual form to capture. The `records/consolidation/brief/` folder was not created.
- **No re-sourcing.** The brief cites no sources at any point — not one URL, dataset or study — so every figure in it is a claim, and I marked rows `needs re-sourcing (numbers)` rather than fetching. Verification is the research pass's job, not this sweep's.
- **Two large blocks read structurally rather than line by line**, because they are enumerations rather than argument: the nutrition module (L10897–11449, ~550 lines) and the roles/future-roles material (L12292–14038, ~1,750 lines). I read every heading, the framing paragraphs and every card/template inside both, and sampled the enumerations. Rows BRIEF-116 and BRIEF-125 to BRIEF-127, BRIEF-145 reflect that depth; a reader wanting the full future-role taxonomy (L13039–13621, historical role evolution and the decline/persist/return lists) should go to the source.
- **Trunk dedupe on two claims is inferential, not proven.** BRIEF-014 (hierarchical Birth RNG) rests on my reading of `lib/engine/hand.ts` and `content/play/hand-axes.ts` without tracing the sampler end to end; BRIEF-160 (state preserved across an edition switch) I did not test in a browser — the sweep brief forbids the shared browser pane. Both are marked so Fable can check them cheaply.
- **One source defect found, not fixed:** the social calibration practice loop at L2489–2508 is duplicated verbatim, line-interleaved with itself — an editing artifact in `MASTER_PROJECT_BRIEF.md`. I did not touch the file (boundary), and flag it here for the owner.



## 8. Owner triage (2026-09-04) and the 6.0 scope

**Owner's decision, in chat, 2026-09-04:** "The calls stand; build the recommended ninety-row scope; merge when green." Recorded on every row below as *Accepted — the architect's call stands*. Adopt and Adapt rows are accepted as written; Park rows are accepted as parked; Reject rows are accepted as rejected.

**Correction to §6.** The recommended set as defined there (the shortlist, every small-cost Adopt row, and the records rows of group K) comes to 147 rows, not ninety. To keep 6.0 a version rather than a programme, seventeen rows that are an evidence architecture of their own (the claim grades, ledger-adjacent registers, editorial standards, research-review record, fixture-validation gate, define-at-first-use gate, the falsifiability closure, the research-pass contract) and two scene-layer rules are deferred to a **6.1 evidence pass**: N-284, N-285, N-286, N-287, N-288, N-292, N-293, N-294, N-295, N-297, N-298, N-300, N-303, N-305, N-429, N-252, N-255. **The 6.0 scope is the 130 rows below.** Most are a sentence, a field or a small component; the medium and large ones are the shortlist.


### A. Entrance, orientation & navigation

- **N-001** (Adopt, M, shortlist) — Restore The Human Package as a reading-layer page: the seven facts every life begins inside, readable without starting a run.
- **N-002** (Adopt, S) — The anti-app declaration, stated first: no account, no record of the visit, nothing scored.
- **N-003** (Adopt, S) — The first move: make sure the question is yours.
- **N-004** (Adopt, S) — The one-sentence proof that advice is position-dependent, given as an example rather than a principle.
- **N-005** (Adopt, S, shortlist) — A quiet "What is this?" door on the entrance, into a plain-language answer.
- **N-008** (Adopt, S) — Stage on-ramps: an ordered reading path that also says what you are allowed to skip
- **N-009** (Adopt, S) — "A life is not a ladder. It is a map with weather."
- **N-012** (Adopt, M, shortlist) — Search that reaches page headings and the timeline's milestone pages.

### B. Situations & triage

- **N-021** (Adopt, S) — Triage's second question routed by the *structure* of the demand, not its subject
- **N-023** (Adopt, S, shortlist) — A "getting through today" page for readers with no capacity — which tells them to stop reading the site
- **N-025** (Adopt, M, shortlist) — Burnout as a situation page, run as a four-step decision sequence
- **N-026** (Adopt, M, shortlist) — Breakup as a situation page: several systems fail on the same day
- **N-036** (Adopt, S) — The "waiting on a slow decider" move set — including the four things that reliably do not work
- **N-041** (Adopt, S) — Conflict cases labelled *not solvable, only navigable* — as an ontological commitment
- **N-045** (Adopt, S) — Every step of a decision sequence names which system is primary for that step
- **N-046** (Adopt, S) — A three-horizon action sequence on a situation page: first 24 hours / next few days / next two weeks
- **N-047** (Adopt, S) — A worked Board example on the situation page itself

### C. Board, logs & guidance

- **N-062** (Adopt, S) — Asking, waiting, and accepting named as moves, on the reading side.
- **N-064** (Adopt, S) — The wall-or-door procedure: four ordered questions, and the asymmetry of the two ways to get it wrong
- **N-066** (Adopt, S) — Role conflict split into scheduling conflict vs horizon conflict, with a mechanical diagnostic
- **N-072** (Adopt, S) — Reader disagreement as a recorded, first-class state — "this does not fit" per card and "none of these fit" for the set
- **N-073** (Adopt, S) — A borderline value on every preference pair, distinct from unknown and from disagreement
- **N-074** (Adopt, S) — A plain-text copy-out for the decision record and upkeep list, so the long-horizon tool survives the browser.
- **N-075** (Adopt, S) — The quest-alignment audit: "if I weren't already doing this, would I start it today?"
- **N-077** (Adopt, S) — Per-task minimum, alternative, and stop condition
- **N-078** (Adopt, S) — "The blank state is private, not incomplete."
- **N-080** (Adopt, S) — A disclosure header stating the objectives, the active constraints, and the ruleset-and-horizon before any ranking
- **N-084** (Adopt, S) — "A pivot is a planned response — not proof of a failed person"
- **N-088** (Adopt, S) — The no-recommendation state that still hands over three moves
- **N-089** (Adopt, S) — "Choose the cheapest question whose answer could change your decision."
- **N-091** (Adopt, S) — Daily Play named as a mode of its own — the real-world planner, deliberately not randomised and visually distinct from the fiction.
- **N-093** (Adopt, S) — A "no overall winner" panel closing every comparison, naming what each side actually emphasises
- **N-094** (Adopt, S) — Reversibility as a named framework: apply rigour to one-way doors, move fast on two-way doors
- **N-095** (Adopt, S) — Opportunity cost is a decision tool, not a regret tool
- **N-371** (Adopt, S) — Maintenance debt, with the caveat that not every unmet need is neglect
- **N-399** (Adopt, S) — The five-layer separation: attributes, skills, conditions, resources, outcomes
- **N-403** (Adopt, S) — Every rating declares its reference population
- **N-405** (Adopt, S) — Charisma, Wisdom, Luck and Appearance treated as composites, not attributes
- **N-408** (Adopt, S) — Whose scorecard is this — intrinsic, extrinsic, internalized, inherited, chosen, performed, conflicted
- **N-411** (Adopt, S) — Behaviour versus stated values, with the constraint caveat attached

### D. Topics & the mechanism spine

- **N-111** (Adopt, M, shortlist) — A concept index: one idea, tracked across every system, with what it means in each
- **N-116** (Adopt, S) — Reputation as a cache other people hold, not a stat you own
- **N-119** (Adopt, S) — Reciprocity: the ledger that is not supposed to balance
- **N-124** (Adopt, S) — Three learning-curve shapes, and why quitting during the slow start is the common error
- **N-127** (Adopt, S) — Attention as the stat that cannot be stored, only routed — and the time diary as external instrumentation
- **N-128** (Adopt, S) — Energy: depletion does not read as low energy, it reads as the world having got worse
- **N-130** (Adopt, S) — Asking for help: the ask-craft — a specific ask hands over a completable action
- **N-131** (Adopt, S) — The Love carve: refusing to give one word one page
- **N-136** (Adopt, S) — Reading a room: a trained skill whose pattern library is invalidated at an arena boundary
- **N-137** (Adopt, S) — The School's rules that do not generalise
- **N-139** (Adopt, S) — The unwritten-rules section as the payload of every place guide
- **N-140** (Adopt, S) — The marked lens switch: the same institution as *place* and as *counterparty*, and the page says when it switches

### E. Map, atlas & position

- **N-150** (Adopt, M, shortlist) — Set your position once, and let every page that has position notes re-resolve.
- **N-160** (Adopt, S) — Either source the map's sex lens or state its null result harder.

### F. Timeline

- **N-379** (Adopt, S) — Say plainly when catch-up is expensive, partial, or impossible
- **N-386** (Adopt, S) — Expectation evidence must be contemporaneous, not remembered

### G. History

- **N-170** (Adopt, L, shortlist) — A tier board whose declared objective is switchable, with a per-objective factor-weight inspector
- **N-171** (Adopt, M, shortlist) — A ruleset header on the tier board: objective · unit · priority factors · not measured · evidence state
- **N-172** (Adopt, S, shortlist) — An empty top tier, on purpose
- **N-176** (Adopt, S) — Official rules · practical effects · rollout and lag, as three parallel panels

### H. Play layer (existing modes)

- **N-190** (Adopt, S, shortlist) — Render `failureModes` as the diagnostic reading of a failure — seventy-two authored lines read by nothing
- **N-191** (Adopt, S, shortlist) — Render `switchingCost` — forty-seven authored sentences about what changing your mind costs, which currently reach no reader
- **N-192** (Adopt, S) — One draw-vary pair curated to land the SAME — the honest other half of G-09
- **N-193** (Adopt, S) — A Lab situation whose pivot is a LATER decision in the window, not the first
- **N-194** (Adopt, M, shortlist) — The compressed season flow as a real control: repeat-last-allocation with a delta-only briefing
- **N-195** (Adopt, S) — Disclose the Lab's seed curation on `/methodology`
- **N-204** (Adopt, S) — Carry each Launch origin's motif through all twenty-four seasons
- **N-211** (Adopt, M, shortlist) — The five-field response contract, on every response, before commitment
- **N-212** (Adopt, M, shortlist) — A pure preview pane that says what a choice would touch without touching it
- **N-213** (Adopt, S) — Upkeep as a standing option in every scene, not the leftovers
- **N-214** (Adopt, S) — A fourth door state: "narrowing"
- **N-216** (Adopt, M, shortlist) — The living record: every resolved decision reopens its original explanation, stamped with the version that produced it
- **N-218** (Adopt, S) — Threads in motion, with uncertainty stated where a delayed effect is absent
- **N-222** (Adopt, S) — Attribution counts, with the disclaimer that stops them becoming a blame ledger
- **N-223** (Adopt, S) — The content-version drift notice
- **N-224** (Adopt, S) — Branch comparison that refuses to be called a controlled experiment
- **N-225** (Adopt, S) — Declared unknowns in a Lab situation, beside the facts and constraints
- **N-226** (Adopt, M, shortlist) — Seven named save statuses, readback-verified writes, and quarantine of malformed originals
- **N-227** (Adopt, S) — Two-step armed deletion, with the sibling-branch consequence stated
- **N-228** (Adopt, M, shortlist) — Make the character's progression visible during play: skills, capabilities, roles, accommodations and maintenance load, not only at the end.
- **N-233** (Adopt, S) — Two standing presentation prohibitions: no combat skin, and colour may not smuggle a score back in.
- **N-234** (Adopt, S) — The seeded-randomness contract, stated to the player: reproducible, forkable, inspectable, and always told when an outcome was partly the draw.
- **N-235** (Adopt, S) — A restrained "try this in Play" entry from reading routes — the read → play direction, which the trunk only has in reverse.
- **N-341** (Adopt, S) — The arc closes where it opened — the book shuts and returns to the ethereal library
- **N-355** (Adopt, S) — Final statistics with a visible line between recorded, interpreted, and unknowable
- **N-366** (Adopt, S) — Agency is not constant — happens to / decided for / decided with / decided by

### I. Play layer (scenes, story & new modes)

- **N-253** (Adopt, S) — Safety presentation rules for a graphical layer: a safety transition replaces the scene with calm plain help and never animates damage or failure.
- **N-256** (Adopt, S) — Rejection tests — a list of conditions under which the work is *not* done, stated before the work starts.

### J. Safety & threshold

- **N-260** (Adopt, M, shortlist) — The England-only correction: 0808 2000 247 does not cover the UK, and Ireland is not the UK
- **N-262** (Adopt, S) — Monitored-device honesty: private browsing is not enough, and say what it does not hide
- **N-263** (Adopt, S) — Double-Escape as a keyboard quick exit on sensitive routes
- **N-265** (Adopt, S) — The sensitive-route banner that reassures the preference was not changed
- **N-266** (Adopt, S) — A per-page footer that names exactly what is stored — and what the application cannot see
- **N-267** (Adopt, S) — A standing safety-sources record with a maintenance rule, separate from the fixture
- **N-268** (Adopt, S) — "A favorable score must never override abuse or safety warnings"
- **N-272** (Adopt, S) — Evidence apparatus survives register zero; game vocabulary does not
- **N-273** (Adopt, S) — Promote "keep the referent unnamed" from a limitations footnote to authoring law
- **N-430** (Adopt, S) — The privacy and psychological-risk list for any difficulty or profile surface

### K. Methodology, evidence & records

- **N-280** (Adopt, M, shortlist) — A "where the model breaks" callout on the page where the model breaks, not only in the register
- **N-281** (Adopt, M, shortlist) — The Disanalogy Register: seven canonical entries on where life is not a game, each with its "inherited by" back-links
- **N-282** (Adopt, S) — Two model limits the trunk's register does not name: the emotional gap and the coherence illusion
- **N-283** (Adopt, S) — A page that undermines the site, and says so on purpose
- **N-290** (Adopt, S) — A retractions and downgrades register, published empty with its format specified before it is needed
- **N-291** (Adopt, S) — The no-silent-fix rule, with visible revision blocks on changed pages
- **N-296** (Adopt, S) — The player-relevance admission test, published as the site's scope boundary
- **N-299** (Adopt, S) — `[DESIGN HYPOTHESIS]` — a research label for a product *behaviour*, not a claim
- **N-301** (Adopt, S) — Planned obsolescence as a template property of a whole content area, not a one-off line
- **N-302** (Adapt, M) — Inline "not built yet" badges sitting inside the structure, next to what is built
- **N-304** (Adopt, S) — "…show its confidence without making you pay an evidence tax to read it."
- **N-306** (Adopt, S) — The browser suites should record and restore a reader's saved runs rather than delete them
- **N-307** (Adopt, S) — A definition of implementation readiness — ten things a feature must have before an agent may build it
- **N-308** (Adopt, S) — An "owner decisions still required" register, numbered and standing
- **N-309** (Adopt, S) — Recording where an owner instruction supersedes the blueprint, in the decision record
- **N-310** (Adopt, S) — A "structural findings — noted, not acted on" section in the record: near-misses logged where a rebuild would have been wrong
- **N-311** (Adopt, S) — The seven-defect correction table — a review artifact worth keeping as a form
- **N-344** (Adopt, S) — Continents are containers, not cultures — and cross-expansion paths connect the maps
- **N-392** (Adopt, S) — The nine ways "best" can mean different things
- **N-410** (Adopt, S) — Self-worth criteria may be examined; a worth score may never be produced
- **N-435** (Adopt, S) — The four acceptance labels, actually applied to the inferred half
- **N-436** (Adapt, S) — The brainstorming capture template — seven fields per proposal
- **N-437** (Adopt, S) — The research priority order — eight priorities, adolescence first
- **N-438** (Adopt, S) — The multiplayer coverage audit — a self-audit naming thirteen unbuilt systems

### L. Presentation & voice

- **N-320** (Adopt, M, shortlist) — Typed link chips: every cross-page link is labelled with the *kind* of relationship before the reader clicks
- **N-321** (Adopt, S) — The single-home rule stated *to the reader* as a reportable bug, not only enforced in the build
- **N-322** (Adopt, S) — System tags at the head of a page, showing which parts of the model it touches
- **N-326** (Adopt, S) — A typographic marker for game vocabulary, so the frame is visible as a frame
- **N-327** (Adopt, S) — Restore `branch` as an edition term so Standard readers get "decision branch", not "Branch".
- **N-329** (Adopt, S) — A register policy stated on the page: comedy permitted in exactly one page class, banned two doors down
- **N-358** (Adopt, S) — Passion, project, quest, questline and purpose are five different things
- **N-434** (Adopt, S) — "The mentor you never had" — stated as a promise with its own limits

### Deferred to the 6.1 evidence pass (accepted, not in 6.0)

- **N-284** (Adopt, M) — "The limits of models" — the permanent essay that the instrument is smaller than its subject
- **N-285** (Adopt, M) — A reading page that argues the case against scoring a life
- **N-286** (Adopt, M) — An open-questions register with citable IDs, each naming what would settle it
- **N-287** (Adopt, M) — Separate what was found from what the project inferred from it, visibly, in the drawer.
- **N-288** (Adapt, M) — Grade every substantive claim on a six-point strength scale, replacing the trunk's three status labels
- **N-292** (Adapt, M) — A public correction queue with five kinds, four outcomes, and classification before resolution
- **N-293** (Adopt, M) — Field reports as primary sources, with published handling rules
- **N-294** (Adapt, M) — Cultural scope: three portability verdicts, and known-bound vs untested kept apart
- **N-295** (Adopt, M) — Published editorial standards: publication requirements, ordering rules, prohibitions, and four ordered review gates
- **N-297** (Adopt, M) — The completion test as a hard admission rule — the anti-quest-ification door policy
- **N-298** (Adapt, L) — A ResearchReview record and drawer: review class, evidence searched, included and excluded sources, reviewer, next-review date, publication decision
- **N-300** (Adopt, M) — A fixture-validation suite as a content gate: stable-ID regex, uniqueness, required-field presence, an "authoritative-looking" refusal regex, and edition parity for every term
- **N-303** (Adopt, M) — A gate for the define-at-first-use discipline, which is currently held by authorship alone.
- **N-305** (Adopt, L) — Close the twenty-five open unfalsifiable gate assertions, each against the prover's recorded probe
- **N-429** (Adopt, M) — The fifteen-item research-pass output, and the rule that a data field is not permission
- **N-252** (Adopt, S) — Every graphic on a play surface must be a rendering of canonical simulation state, and it is a gate, not an intention.
- **N-255** (Adopt, S) — Visual bible first: settle the style, model sheets and one complete scene before authoring at scale — and record the asset provenance.
