#!/usr/bin/env bash
# FALSIFIABILITY PROBE FOR THE DOCTRINE-WALL LINTS.
#
# Run:  bash tests/falsify-walls.sh
#
# This build shipped four assertions that reported green while being incapable of
# failing — one of them a regex with a literal 0x08 byte in it, invisible on the
# page. Observing that a gate is green establishes nothing about whether it works.
# This proves the three lints guarding the doctrine walls actually go red: it
# plants a real violation in real content, requires the named gate to fail AND to
# name the record the plant went into, then restores the file and verifies
# byte-identity by sha256.
#
# Each case plants a real violation into real content, runs the sandbox suite,
# requires the named gate to go RED, then restores the file and verifies
# byte-identity with sha256. Anything that does not go red is reported loudly.
set -u
# 5.0 FIX (recorded in DECISIONS as a shared-file delta): the 4.0 version of this
# script hardcoded (a) another session's scratchpad node and (b) an absolute cd into
# tgtl-claude-4.0, so it operated on the 4.0 folder no matter which tree it shipped in
# and died when that scratchpad node went stale. It now locates its own repo root and
# uses whatever node is already on PATH.
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)" || exit 2
if ! command -v node >/dev/null 2>&1; then
  echo "node not on PATH — put a node >= 18.18 on PATH first (see README Environment)" >&2
  exit 2
fi

FILE="content/sim/campaign/actions/batch-people.ts"
BAK="$(mktemp)"
cp "$FILE" "$BAK"
BEFORE="$(sha256sum "$FILE" | cut -d' ' -f1)"
FAILED=0

# The gate must go red BECAUSE OF THE PLANT. An earlier version of this script
# only checked "did the gate fail", and passed while the gate was failing on two
# unrelated false positives it had just acquired. The evidence line must name the
# record the plant went into.
probe () {
  local name="$1" gate="$2" find="$3" repl="$4" witness="$5"
  cp "$BAK" "$FILE"
  if ! grep -qF "$find" "$FILE"; then
    echo "SKIP      $name — anchor not present"
    FAILED=1
    return
  fi
  python3 - "$FILE" "$find" "$repl" <<'PY'
import io,sys
p,f,r=sys.argv[1],sys.argv[2],sys.argv[3]
s=io.open(p,encoding='utf-8').read()
io.open(p,'w',encoding='utf-8').write(s.replace(f,r))
PY
  local out
  out="$(npx tsx tests/sim-gates-4.ts 2>&1)"
  local evidence
  evidence="$(echo "$out" | grep -F "$witness" | head -1)"
  if echo "$out" | grep -q "\[FAIL\] $gate" && [ -n "$evidence" ]; then
    echo "ok        $name"
    echo "$evidence" | sed 's/^/            /'
  elif echo "$out" | grep -q "\[FAIL\] $gate"; then
    echo "RED FLAG  $name — $gate failed, but NOT on the plant ($witness). It is failing for another reason:"
    echo "$out" | grep -A 2 "\[FAIL\] $gate" | tail -2 | sed 's/^/            /'
    FAILED=1
  else
    echo "RED FLAG  $name — planted violation did NOT make $gate fail"
    FAILED=1
  fi
  cp "$BAK" "$FILE"
}

probe "S-1 · loss tier in a playable record" "Gate 201" \
  '"label": "Keep the friendship going"' \
  '"label": "Keep the friendship going after the funeral"'   'act-people-keep-the-friendship-alive'

probe "S-2 · a percentage in a rendered string" "Gate 202" \
  '"label": "Put a standing night in"' \
  '"label": "Put a standing night in (70% of the time)"'   'opt-people-standing-night'

probe "S-5 · a score on a play surface" "Gate 205" \
  '"label": "Answer properly, plan nothing"' \
  '"label": "Answer properly and raise your life score"'   'opt-people-stay-reachable'

cp "$BAK" "$FILE"
AFTER="$(sha256sum "$FILE" | cut -d' ' -f1)"
echo
if [ "$BEFORE" = "$AFTER" ]; then
  echo "restore verified: $FILE is byte-identical (sha256 $BEFORE)"
else
  echo "!!!! RESTORE FAILED — $BEFORE != $AFTER"
  exit 2
fi
rm -f "$BAK"

# ============================================================================
# TIMELINE WALLS (5.0 blueprint §8) — T-1, T-3, T-4, T-6, T-7, T-8.
#
# Same discipline: plant a REAL violation in the artifact the gate actually
# reads, require the named gate to go red AND to name the record the plant went
# into, restore, and verify byte-identity by sha256. A T-gate without a proven
# red is not a gate.
#
# Content-half probes plant into content/timeline/generated/milestones.ts (what
# the gate reads). Rendered-half probes plant into out/timeline/index.html (what
# the gate reads). Both are build artifacts, so a botched restore is recoverable
# by re-running the compiler / the build — but we verify byte-identity anyway,
# because "recoverable" is not "unchanged".
# ============================================================================

echo
echo "---- timeline walls ----"

TL_CONTENT="content/timeline/generated/milestones.ts"
TL_HTML="out/timeline/index.html"

if [ ! -f "$TL_CONTENT" ]; then
  echo "SKIP      timeline probes — $TL_CONTENT not built (run the content compiler)"
  FAILED=1
elif [ ! -f "$TL_HTML" ]; then
  echo "SKIP      timeline probes — $TL_HTML not built (run npm run build)"
  FAILED=1
else

# 6.0 batch 5 (N-386): T-9's extension reads the compiled SOURCES, so that file
# joins the backed-up set. Same discipline: plant, require red, restore, verify
# byte-identity AND the modification time (T-16 fails on a source newer than the
# export, and a probe that promises an unchanged tree should not leave one
# looking rebuilt).
TL_SOURCES="content/timeline/generated/sources.ts"

CBAK="$(mktemp)"; cp "$TL_CONTENT" "$CBAK"; CBEFORE="$(sha256sum "$TL_CONTENT" | cut -d' ' -f1)"
SBAK="$(mktemp)"; cp "$TL_SOURCES" "$SBAK"; SBEFORE="$(sha256sum "$TL_SOURCES" | cut -d' ' -f1)"
SREF="$(mktemp)"; touch -r "$TL_SOURCES" "$SREF"
HBAK="$(mktemp)"; cp "$TL_HTML" "$HBAK"; HBEFORE="$(sha256sum "$TL_HTML" | cut -d' ' -f1)"
# Restore the MODIFICATION TIMES too, not just the bytes. T-16 fails when a timeline
# source is newer than the export, and a probe that promises byte-identical
# restoration should not leave the tree looking rebuilt when nothing changed.
CREF="$(mktemp)"; touch -r "$TL_CONTENT" "$CREF"
HREF="$(mktemp)"; touch -r "$TL_HTML" "$HREF"

# $1 name  $2 gate number  $3 target file  $4 backup  $5 probe key  $6 witness
# The mutation itself lives in tests/fixtures/timeline/plant.py — NOT inline here.
# Inline Python inside shell quoting mangled all six regexes on the first attempt and
# turned six proofs into six silent skips; a file cannot be mangled by the shell.
tl_probe () {
  local name="$1" gate="$2" target="$3" bak="$4" probe="$5" witness="$6"
  cp "$bak" "$target"
  if ! python3 tests/fixtures/timeline/plant.py "$probe" "$target" 2>/dev/null; then
    echo "RED FLAG  $name — could not plant (anchor missing); the probe proved nothing"
    FAILED=1
    cp "$bak" "$target"
    return
  fi
  local out
  out="$(node --experimental-strip-types tests/timeline-gates.ts 2>&1)"
  local evidence
  evidence="$(echo "$out" | grep -F "$witness" | head -1)"
  if echo "$out" | grep -q "\[FAIL\] Gate $gate:" && [ -n "$evidence" ]; then
    echo "ok        $name"
    echo "$evidence" | sed 's/^/            /'
  elif echo "$out" | grep -q "\[FAIL\] Gate $gate:"; then
    echo "RED FLAG  $name — T-$gate failed, but NOT on the plant ($witness):"
    echo "$out" | grep -A 2 "\[FAIL\] Gate $gate:" | tail -2 | sed 's/^/            /'
    FAILED=1
  else
    echo "RED FLAG  $name — planted violation did NOT make T-$gate fail"
    FAILED=1
  fi
  cp "$bak" "$target"
}

tl_probe "T-1 · numeric timing with no source"                   1 "$TL_CONTENT" "$CBAK" t1 "numeric timing with NO source"
tl_probe "T-3 · normative language in a content field"           3 "$TL_CONTENT" "$CBAK" t3 "entry \"should have\""
tl_probe "T-4 · a cost with no recovery route"                   4 "$TL_CONTENT" "$CBAK" t4 "and no route"
# 6.0 batch 5 — the two schema extensions, each proven red on its own half.
# N-379 EXTENDS T-4's accessor and never its predicate: a grade describes a
# route and does not replace one, so a grade with no sentence has to fail
# exactly as a missing route always did.
tl_probe "T-4 · a graded route with no route in it (N-379)"        4 "$TL_CONTENT" "$CBAK" t4b "neither a sentence nor"
# N-386 EXTENDS T-9's `measures` discipline to `timing`: a source cited about
# what people used to expect has to say whether it was speaking at the time.
tl_probe "T-9 · an expectation source with no timing (N-386)"      9 "$TL_SOURCES" "$SBAK" t9 "does not state its timing"
tl_probe "T-6 · sensitive record with no care note"              6 "$TL_CONTENT" "$CBAK" t6 "with no careNote"
tl_probe "T-7 · a year claiming an event its records deny"       7 "$TL_HTML"    "$HBAK" t7 "ms-planted-invention"
tl_probe "T-8 · a percentage on a timeline surface"              8 "$TL_HTML"    "$HBAK" t8 "percent sign"

cp "$CBAK" "$TL_CONTENT"; touch -r "$CREF" "$TL_CONTENT"; CAFTER="$(sha256sum "$TL_CONTENT" | cut -d' ' -f1)"
cp "$HBAK" "$TL_HTML";    touch -r "$HREF" "$TL_HTML";    HAFTER="$(sha256sum "$TL_HTML" | cut -d' ' -f1)"
echo
if [ "$CBEFORE" = "$CAFTER" ]; then
  echo "restore verified: $TL_CONTENT is byte-identical (sha256 $CBEFORE)"
else
  echo "!!!! RESTORE FAILED — $TL_CONTENT $CBEFORE != $CAFTER"; exit 2
fi
if [ "$HBEFORE" = "$HAFTER" ]; then
  echo "restore verified: $TL_HTML is byte-identical (sha256 $HBEFORE)"
else
  echo "!!!! RESTORE FAILED — $TL_HTML $HBEFORE != $HAFTER"; exit 2
fi
cp "$SBAK" "$TL_SOURCES"; touch -r "$SREF" "$TL_SOURCES"; SAFTER="$(sha256sum "$TL_SOURCES" | cut -d' ' -f1)"
if [ "$SBEFORE" = "$SAFTER" ]; then
  echo "restore verified: $TL_SOURCES is byte-identical (sha256 $SBEFORE)"
else
  echo "!!!! RESTORE FAILED — $TL_SOURCES $SBEFORE != $SAFTER"; exit 2
fi
rm -f "$CBAK" "$HBAK" "$SBAK" "$CREF" "$HREF" "$SREF"
fi

# ============================================================================
# CONSOLIDATION WALLS (6.0 blueprint §8) — the C suite's "probe" gates.
#
# Same discipline again: plant a REAL violation in the file the gate actually
# reads, require the named C-gate to go red AND to name the record, route or line
# the plant went into, restore, and verify byte-identity by sha256. A C-gate
# without a proven red is not a gate (§0.3).
#
# Batch 1 lands C-2 (N-190), C-4 (N-260) and C-5 (N-160). C-1 (N-226) and C-3
# (N-191) are "record" gates: C-1's proven red is tests/save-status-harness.ts run
# against the pre-N-226 code, C-3's is the browser assertion with its data
# attribute renamed. Both are pasted into DECISIONS.md §8 under this batch.
#
# The C suite reads out/, so these probes are skipped (loudly) without a build.
# ============================================================================

echo
echo "---- consolidation walls ----"

if [ ! -d "out" ]; then
  echo "SKIP      consolidation probes — out/ not built (run npm run build first)"
  FAILED=1
else

# $1 name  $2 gate id (e.g. C-4)  $3 target file  $4 find  $5 replace  $6 witness
c_probe () {
  local name="$1" gate="$2" target="$3" find="$4" repl="$5" witness="$6"
  local bak before after out evidence
  bak="$(mktemp)"
  cp "$target" "$bak"
  before="$(sha256sum "$target" | cut -d' ' -f1)"
  if ! grep -qF "$find" "$target"; then
    echo "RED FLAG  $name — anchor not present in $target; the probe proved nothing"
    FAILED=1
    cp "$bak" "$target"
    rm -f "$bak"
    return
  fi
  python3 - "$target" "$find" "$repl" <<'PY'
import io,sys
p,f,r=sys.argv[1],sys.argv[2],sys.argv[3]
s=io.open(p,encoding='utf-8').read()
io.open(p,'w',encoding='utf-8').write(s.replace(f,r,1))
PY
  out="$(node --experimental-strip-types tests/consolidation-gates.ts 2>&1)"
  evidence="$(echo "$out" | grep -F "$witness" | head -1)"
  if echo "$out" | grep -q "\[FAIL\] Gate $gate:" && [ -n "$evidence" ]; then
    echo "ok        $name"
    echo "$evidence" | sed 's/^/            /'
  elif echo "$out" | grep -q "\[FAIL\] Gate $gate:"; then
    echo "RED FLAG  $name — $gate failed, but NOT on the plant ($witness):"
    echo "$out" | grep -A 2 "\[FAIL\] Gate $gate:" | tail -2 | sed 's/^/            /'
    FAILED=1
  else
    echo "RED FLAG  $name — planted violation did NOT make $gate fail"
    FAILED=1
  fi
  cp "$bak" "$target"
  after="$(sha256sum "$target" | cut -d' ' -f1)"
  rm -f "$bak"
  if [ "$before" != "$after" ]; then
    echo "!!!! RESTORE FAILED — $target $before != $after"
    exit 2
  fi
}

# C-2 (N-190) — take the tied recovery route out of the drawer, keep the diagnosis.
c_probe "C-2 · a failure mode rendered without its tied recovery route" "C-2" \
  "components/sim/CampaignApp.tsx" \
  '<li key={i} data-sim-recovery-route>' \
  '<li key={i}>' \
  "a failure mode renders with NO tied recovery route"

# C-2 again — both still render, but the block no longer requires the tie to exist,
# so a failure mode would render alone the moment the tie came back empty.
c_probe "C-2 · the failure block no longer guarded on the tie" "C-2" \
  "components/sim/CampaignApp.tsx" \
  '{failureModes.length > 0 && tiedRoutes.length > 0 ? (' \
  '{failureModes.length > 0 ? (' \
  'to have anything in it'

# C-4 (N-260) — the England line widened to a nation that runs its own service.
c_probe "C-4 · an abuse line covering a nation another service covers" "C-4" \
  "content/hotlines.ts" \
  'coverage: ["England"],' \
  'coverage: ["England", "Scotland"],' \
  "hotline-england-dv"

# C-4 again — the derivation itself re-widened, so an England-only line prints
# "United Kingdom": the exact defect the row exists to fix.
c_probe "C-4 · the derived label re-widened to United Kingdom" "C-4" \
  "content/hotlines.ts" \
  'const allUk = UK_NATIONS.every((n) => coverage.includes(n));' \
  'const allUk = UK_NATIONS.some((n) => coverage.includes(n));' \
  'says United Kingdom while covering only [England]'

# C-5 (N-160) — an unsourced difference in the stage content under one lens.
c_probe "C-5 · unsourced stage content under the female lens" "C-5" \
  "components/Roadmap.tsx" \
  'stage.gameLabel : stage.label}</h2>' \
  'stage.gameLabel : stage.label}</h2>{sexLens === "female" ? <p>This window opens earlier.</p> : null}' \
  "branches on the sex lens with no data-source"

# ---- batch 2 (safety, group J + group I's two rules): C-7, C-8, C-9, C-10 ----
#
# C-6 (N-263) is the batch's one "record" gate: its subject is a key gesture in a
# real browser, so its proven red is the browser assertion in tests/browser-gates.mjs
# run with the handler's guard narrowed to skip a route, pasted into DECISIONS.md §8.

# C-7 (N-267) — a region the fixture serves with no dated entry in the standing record.
# Demoting the heading is exactly how this fails in life: an edit that looks cosmetic.
c_probe "C-7 · a fixture region missing from SAFETY_SOURCES.md" "C-7" \
  "SAFETY_SOURCES.md" \
  '## Northern Ireland' \
  '### Northern Ireland' \
  'claims to cover Northern Ireland'

# C-8 (N-268) — the ordering runs before the safety route is offered.
c_probe "C-8 · guidance ranks before the crisis gate is reached" "C-8" \
  "components/Guidance.tsx" \
  '  const crisisGate = (' \
  '  const preRank = rankPlans(inputs); const crisisGate = (' \
  'has already run at line'

# C-8 again — the gate stops being a link out and becomes an input to the reading.
c_probe "C-8 · the board's crisis gate records the choice" "C-8" \
  "components/Board.tsx" \
  '<Link className="board-crisis-link" href={c.route}>' \
  '<Link className="board-crisis-link" href={c.route} onClick={() => setLevel("condition", c.id)}>' \
  'records or handles the choice'

# C-9 (N-272) — an evidence label enters the generated set-down game-term list, so
# gate 2 would begin stripping the evidence apparatus off set-down pages.
c_probe "C-9 · an evidence label given as a game term" "C-9" \
  "content/terminology.ts" \
  'standard: "affects later",' \
  'standard: "affects later", game: "researched",' \
  'collides with the evidence label'

# C-10 (N-273) — the caring-duty referent named. This is the plant the verifier's
# warning describes: the appointment identified with a live companion.
c_probe "C-10 · the caring-duty referent named" "C-10" \
  "content/sim/campaign/events/batch-comp-family.ts" \
  'You take the appointment and the paperwork behind it.' \
  'You take the appointment and the paperwork behind it for Diane.' \
  'as the person the care is for'

# C-10 again — a condition named in the same thread.
c_probe "C-10 · a condition named in a caring-duty record" "C-10" \
  "content/sim/campaign/events/batch-comp-family.ts" \
  '"label": "Stay on the admin"' \
  '"label": "Stay on the caring-duty admin"' \
  'names the condition'


# ---- batch 3 (the play layer, group H): C-11, C-13, C-15..C-19, C-21..C-25 ----
#
# C-12 (N-194), C-14 (N-204) and C-20 (N-216) are this batch's three "record"
# gates. C-12's and C-20's proven reds are the engine harness run with a shuffle
# before the commit and with the season list recomputing instead of reading;
# C-14's is the browser assertion with the motif rendered only on turn one. All
# three are pasted into DECISIONS.md §8 under this batch.
#
# Several of these plant into out/ rather than into source, because the gate they
# arm reads the EXPORTED page (the campaign and the Lab are client-only, so what
# a source plant would prove about them is different from what the gate asserts).
# Same discipline either way: the file is restored and byte-compared.

# C-11 (N-192) — the curated same-landing seed put back to a separating one, which
# is the state every shipped pair was in before this row: the Lab teaching "luck
# moved it" and never "the range was narrow".
c_probe "C-11 · the draw-vary pair reseeded to separate" "C-11" \
  "content/sim/lab/situations.ts" \
  'altDrawSeed: "lab-the-repair-same-1"' \
  'altDrawSeed: "lab-the-repair-alt-0"' \
  "no shipped draw-vary pair lands the same"

# C-13 (N-195) — the curation disclosure taken off the rendered page: the exact
# omission the row exists to fix, since /methodology publishes everything else.
c_probe "C-13 · the seed-curation disclosure removed from /methodology" "C-13" \
  "out/methodology/index.html" \
  'tools/curate-lab-seeds.ts' \
  'a tool in the repository' \
  "does not name tools/curate-lab-seeds.ts"

# C-15 (N-211) — one of the five contract fields dropped from the shared builder,
# so every option in the pool renders four. Red by id, on the first option it hits.
c_probe "C-15 · a contract field dropped from every response" "C-15" \
  "lib/sim/season.ts" \
  '{ name: "what waits", value: waits.length ? waits.join(" · ") : NOTHING_WAITS_PHRASE },' \
  '' \
  "where the contract is [capacity, what waits"

# C-16 (N-212) — a mutation planted inside the preview. This is the whole claim:
# the pane says previewing changes nothing, and this is what makes that a fact.
c_probe "C-16 · previewAction mutates the state it is given" "C-16" \
  "lib/sim/season.ts" \
  '  const serves = domainsServe(action.domains);' \
  '  state.flags.push("previewed");
  const serves = domainsServe(action.domains);' \
  "mutated the state it was handed"

# C-17 (N-213) — upkeep repriced into money, which is the one currency the debt
# drag does not reserve, so it becomes unaffordable exactly where it matters.
c_probe "C-17 · upkeep priced above the worst envelope" "C-17" \
  "content/sim/campaign/actions-small.ts" \
  'costs: { timeStructure: 1 },' \
  'costs: { money: 2 },' \
  "NOT AFFORDABLE in the worst envelope"

# C-18 (N-214) — the fourth door state painted in the open state's colour: the
# three-state panel's own defect (job loss rendered green) one state further on.
c_probe "C-18 · the narrowing door state painted as an opening" "C-18" \
  "app/sim-surfaces.css" \
  '.sim-door-group-head[data-state="narrowing"] { color: var(--sim-muted); }' \
  '.sim-door-group-head[data-state="narrowing"] { color: var(--sim-good); }' \
  "which is the OPEN state's token"

# C-19 (N-233), the register half — the combat skin in a Game Guide label.
c_probe "C-19 · a health bar in the Game Guide vocabulary" "C-19" \
  "content/terminology.ts" \
  '    game: "life stat",' \
  '    game: "health bar",' \
  "combat-skin term"

# C-19 again, the colour half — a signal red on the failure band against the
# green on the strong one: the worth score returning through the one channel the
# no-score wall does not read.
c_probe "C-19 · a traffic-light pair across a resolution" "C-19" \
  "app/sim.css" \
  '  --sim-poor: #d98a7a;' \
  '  --sim-poor: #e01b1b;' \
  "at signal strength on the two ends of one resolution"

# C-21 (N-218) — the second sentence deleted, leaving the reassuring half of a
# true thing on the screen where a reader is most tempted to read clearance.
c_probe "C-21 · the empty queue's uncertainty line deleted" "C-21" \
  "components/sim/instruments/Instruments.tsx" \
  'No known delayed consequence is pending. Uncertainty has not disappeared.' \
  'No known delayed consequence is pending.' \
  "Uncertainty has not disappeared"

# C-22 (N-225) — a declared unknown emptied: a bullet with nothing in it, under a
# heading that says something was named.
c_probe "C-22 · a Lab situation's unknown emptied" "C-22" \
  "content/sim/lab/situations.ts" \
  '"What the other person has already decided, which is theirs and is not something this model holds.",' \
  '"",' \
  "declares an empty unknown"

# C-23 (N-228) — one state field's surface removed. The gate derives its list from
# the engine's own reads, so it names the field that lost its surface.
c_probe "C-23 · a SimState field loses its mid-run surface" "C-23" \
  "components/sim/StateRail.tsx" \
  'data-sim-state-field="skills"' \
  'data-sim-state-fieldless="skills"' \
  "SimState.skills is read by the engine and has no mid-run surface"

# C-24 (N-235) — a Try-in-Play entry planted on a set-down route, in the exported
# page, which is where the gate looks.
c_probe "C-24 · a Try-in-Play entry on a set-down route" "C-24" \
  "out/triage/index.html" \
  'class="crisis-note"' \
  'class="crisis-note" data-try-in-play' \
  "/triage renders a Try-in-Play entry"

# C-25 (N-355) — one parse panel's declaration stripped. Red naming the section by
# its heading, so the failure says which panel stopped saying what kind it is.
c_probe "C-25 · a parse panel stops declaring its kind" "C-25" \
  "components/play/Parse.tsx" \
  '<section className="sim-parse-section sim-parse-hand" data-parse-kind="recorded">' \
  '<section className="sim-parse-section sim-parse-hand">' \
  "The hand you were dealt"


# ---- batch 4 (the reading layer, groups A, B, D, L): C-26 .. C-35 ----
#
# Every gate in this batch is a "probe" gate, so every one of them is planted
# here; there are no record gates to paste. Several plant into out/ rather than
# into source, because the gate they arm reads the EXPORTED page — which is the
# artefact a reader actually receives, and the one a source plant would not
# prove anything about. Same discipline either way: restored and sha256-compared.

# C-26 (N-001), the JS-off half — the page's argument moved behind hydration.
# This is the failure the row exists to prevent: /orientation is where the
# entrance sends a first-time visitor, and a client-rendered version of it would
# look identical in a browser and be an empty box to everyone else.
c_probe "C-26 · /orientation becomes a client component" "C-26" \
  "app/orientation/page.tsx" \
  'import type { Metadata } from "next";' \
  '"use client";
import type { Metadata } from "next";' \
  "the reading floor is the exported HTML"

# C-26 again, the vocabulary half — a game term put on the page through the one
# channel game vocabulary uses. The page offers the frame; it does not assume it.
c_probe "C-26 · a game term on the orientation page" "C-26" \
  "app/orientation/page.tsx" \
  '<h2 id="nobody-here-is-scenery">Nobody here is scenery</h2>' \
  '<h2 id="nobody-here-is-scenery">Nobody here is scenery</h2>
      <p><Term k="party" /></p>' \
  "calls <Term>"

# C-27 (N-012) — a milestone route dropped from the generated index, which is
# the exact state the trunk shipped in: twenty-four sourced pages that the site's
# own search box could not find.
c_probe "C-27 · a milestone route dropped from the search index" "C-27" \
  "content/generated/search-index.json" \
  '"/timeline/ms-age-of-majority"' \
  '"/timeline/ms-age-of-majority-DROPPED"' \
  "milestone route /timeline/ms-age-of-majority is missing"

# C-27 again — an indexed anchor that no longer resolves. The silent one: a
# heading id gets renamed and the index goes on pointing at the old one, which
# fails by doing nothing at all in a browser.
c_probe "C-27 · an indexed anchor that resolves to nothing" "C-27" \
  "content/generated/search-index.json" \
  '"/orientation#the-hand-was-dealt"' \
  '"/orientation#the-hand-was-dealt-RENAMED"' \
  "does not resolve"

# C-28 (N-023) — an instrument link above the first heading. A page whose whole
# content is "stop reading" that opens with somewhere else to go has not said it.
c_probe "C-28 · an instrument link above the set-down page's first heading" "C-28" \
  "out/situations/getting-through-today/index.html" \
  '<h2 id="what-is-worth-doing"' \
  '<a href="/guidance">lay the whole thing out</a><h2 id="what-is-worth-doing"' \
  "above its first heading"

# C-28 again — the register. Analytical vocabulary on the one page written for a
# reader with nothing left to spend on thinking about their situation.
c_probe "C-28 · analytical framing in register zero" "C-28" \
  "out/situations/getting-through-today/index.html" \
  'Unglamorous, and it changes the next few' \
  'Your position is the binding constraint. Unglamorous, and it changes the next few' \
  'uses the word "position"'

# C-29 (N-025) — a construct attributed on a page with no source record. The
# archive is full of these, and lifting one imports the authority and leaves the
# source behind.
c_probe "C-29 · a research construct named without an evidence record" "C-29" \
  "app/situations/breakup/page.tsx" \
  '<h2 id="common-mistakes">The three common mistakes</h2>' \
  '<h2 id="common-mistakes">The three common mistakes (Maslach)</h2>' \
  'names "Maslach"'

# C-30 (N-041) — a recommendation on the one section whose only claim is that no
# arrangement satisfies both. The predictable edit: a later hand, wanting to be
# helpful, ends the paragraph with an answer.
c_probe "C-30 · a recommendation in the not-solvable section" "C-30" \
  "out/situations/index.html" \
  'Naming the category is the substantive content.' \
  'Naming the category is the substantive content. In the end you should pick the first one.' \
  'contains "you should"'

# C-31 (N-111) — a concept cell pointed at a route that does not own the
# mechanism. The single-home rule's failure mode: a promise that the explanation
# is over there, made to a page that has never heard of it.
c_probe "C-31 · a concept cell pointing where the mechanism is not" "C-31" \
  "content/concepts.ts" \
  '        system: "/topics/relationships",
        gloss: "Built slowly from kept promises' \
  '        system: "/threshold",
        gloss: "Built slowly from kept promises' \
  'claims /threshold owns the mechanism'

# C-32 (N-320) — a typed link with its why-line blanked: the relation survives
# and the explanation does not, which is the decoration this row replaced.
c_probe "C-32 · a Where-this-connects card with an empty why" "C-32" \
  "out/topics/work/index.html" \
  '>If the change of direction was not yours to make, the clocks come first.<' \
  '><' \
  "carries no why-line"

# C-33 (N-321) — the invariant removed from one guide. It is only checkable by
# readers where it is actually stated, so one page without it is one page where
# the promise is not made.
c_probe "C-33 · the single-home invariant missing from one topic route" "C-33" \
  "out/topics/health/index.html" \
  'data-single-home' \
  'data-single-home-REMOVED' \
  "/topics/health does not render the single-home invariant"

# C-34 (N-326), the source half — the marker ungated from showGame, which is the
# single expression that excludes the Standard edition, a set-down frame, and a
# term with no game label at once.
c_probe "C-34 · the term marker ungated from the edition check" "C-34" \
  "components/Term.tsx" \
  '  const showMarker = showGame && (marked ?? !define);' \
  '  const showMarker = (marked ?? !define);' \
  "the marker is not gated on showGame"

# C-34 again, the rendered half — the marker escaping into Standard-edition
# output, where the frame would be showing on a page nobody asked to see it on.
c_probe "C-34 · the marker rendered in Standard-edition output" "C-34" \
  "out/situations/job-loss/index.html" \
  'class="term">Money and slack<' \
  'class="term term--marked">Money and slack<' \
  "renders term--marked in the Standard-edition export"

# C-35 (N-329) — the comic register flagged on the loss-adjacent route the rule
# names by name. Light intensity, steps and a tag row, and read by somebody who
# has just lost something: exactly the room the boundary exists for.
c_probe "C-35 · the comic register flagged on a loss-adjacent route" "C-35" \
  "content/routes.ts" \
  '    systems: ["party", "money", "time"],' \
  '    systems: ["party", "money", "time"],
    register: "comic",' \
  "is flagged comic and is loss-adjacent"


# ---- batch 5 (board, logs, guidance, position, timeline, history): C-36, C-38 … C-44 ----
#
# C-37 (N-074) is this batch's one "record" gate: its subject is a clipboard
# write in a real browser and the silence of the wire while it happens, which no
# file plant can reproduce. Its proven red is browser gate 137 run with a fetch
# planted in the copy handler, pasted into DECISIONS.md section 8.

# C-36 (N-072) — the rejection control taken off ONE of the three classifying
# surfaces. The row's whole point is that every surface that tells a reader what
# kind of thing their situation is has to let them say it is wrong; one surface
# without it is one place where the site's authority is a verdict.
c_probe "C-36 · a classifying surface with no rejection control" "C-36" \
  "components/CharacterSheet.tsx" \
  'data-reject={l.id}' \
  'data-reject-REMOVED={l.id}' \
  "renders NO [data-reject] control"

# C-36 again — the control kept and the RENDERING no longer honouring it. This
# is the worse failure and the one a reviewer would not see: the button is
# there, the reader presses it, and the reading carries on standing.
c_probe "C-36 · a rejection collected and not honoured" "C-36" \
  "components/Board.tsx" \
  'className={`board-reading-result${rejected ? " is-rejected" : ""}`}' \
  'className="board-reading-result"' \
  "the disagreement is collected and not honoured"

# C-38 (N-077) — one lane's stop condition emptied. A task with no declared end
# has no state in which it is finished, which makes every state a state of not
# having done enough; the cell staying present and empty is exactly how that
# would ship.
c_probe "C-38 · a planned lane with an empty stop condition" "C-38" \
  "out/guidance/daily-plan/index.html" \
  'When it is submitted, or when the office you need is shut.' \
  '' \
  "renders a stop cell with nothing in it"

# C-39 (N-080) — a ranked card rendered ABOVE the disclosure that states the
# rule producing it. The reader then meets an order before the reason for it,
# which is the arrangement that makes a ranking read as the site's opinion of
# their life.
c_probe "C-39 · a ranked plan rendered above its disclosure" "C-39" \
  "components/Guidance.tsx" \
  '<section className="guidance-result">' \
  '<section className="guidance-result"><PlanCard plan={experiment} rank="Ranked first" avail={AVAIL_LABEL} rejected={false} onReject={() => {}} />' \
  "the ranking renders ABOVE the rule that produced it"

# C-39 again — the panel kept and the horizon dropped out of it. Objectives and
# constraints are the easy two to remember; the horizon is the one that goes
# quietly, and a ranking without a stated horizon is a ranking for no particular
# stretch of time.
c_probe "C-39 · a disclosure that no longer states its horizon" "C-39" \
  "components/Guidance.tsx" \
  '<dt data-disclosure-horizon>Horizon and ruleset</dt>' \
  '<dt>Horizon and ruleset</dt>' \
  "does not name the horizon and the ruleset"

# C-40 (N-091) — a sim class on the real-world planner. Free to forbid now and
# expensive later: the closer the daily plan and the simulation get, the more
# the fiction's presentation on a real Tuesday reads as a claim about the reader.
c_probe "C-40 · a sim class on the daily plan" "C-40" \
  "out/guidance/daily-plan/index.html" \
  'class="lanes-table"' \
  'class="lanes-table sim-panel"' \
  "renders the sim class"

# C-41 (N-093) — the no-winner panel removed from one comparison surface. The
# plant renames the attribute on its boundary rather than deleting the block,
# because that is how this actually disappears: a rename in a refactor, with the
# markup still on the page.
c_probe "C-41 · a comparison closing without the refusal" "C-41" \
  "out/history/index.html" \
  'data-no-winner="true"' \
  'data-no-winner-RENAMED="true"' \
  "does not close with the no-winner panel"

# C-42 (N-150) — a THIRD component reading the reader's position. It is a
# well-behaved read, which is the point: a well-behaved third reader is how a
# filter over authored paragraphs becomes an input to a score, one honest commit
# at a time.
c_probe "C-42 · a third component reading the reader's position" "C-42" \
  "components/CharacterSheet.tsx" \
  '  const { edition } = useGuide();' \
  '  const { edition, position } = useGuide();' \
  "reads the reader's position"

# C-42 again — the position written into the URL. Gate 9's runtime walk covers
# the live half; this covers the source, where it would be added.
c_probe "C-42 · the position written into the URL" "C-42" \
  "components/PositionNote.tsx" \
  '  const { position } = useGuide();' \
  '  const { position } = useGuide();
  if (typeof window !== "undefined") window.location.hash = position.floor;' \
  "Position never enters a URL"

# C-43 (N-170) — a placement that belongs to no objective. Renaming one key
# under one objective produces both halves of the failure at once: an archetype
# on the board with no ruling under that objective, and a ruling attached to
# nothing.
c_probe "C-43 · a placement belonging to no objective" "C-43" \
  "content/history.ts" \
  '      landowning: {
        before: "S",' \
  '      landowner: {
        before: "S",' \
  "has no placement for archetype"

# C-43 again — the switch made decorative. Two objectives producing the same
# board is the failure that would teach the opposite of the lesson: that the
# ranking is the ranking and the stated objective is scenery.
c_probe "C-43 · an objective switch that changes nothing" "C-43" \
  "content/history.ts" \
  'export const TIER_OBJECTIVES: TierObjective[] = [' \
  'export const TIER_OBJECTIVES: TierObjective[] = [
  { id: "planted-copy", label: "Planted copy", unit: TIER_UNIT, question: "A planted objective whose placements were copied from another and never adjusted.", factors: [{ name: "Material resources", weight: "high" }], notMeasured: TIER_NOT_MEASURED, evidence: "illustrative", placements: { landowning: { before: "A", after: "S", ruling: "A planted ruling for the falsifiability probe." }, industrialist: { before: "B", after: "S", ruling: "A planted ruling for the falsifiability probe." }, artisan: { before: "B", after: "D", ruling: "A planted ruling for the falsifiability probe." }, laborer: { before: "D", after: "C", ruling: "A planted ruling for the falsifiability probe." }, extracted: { before: "F", after: "F", ruling: "A planted ruling for the falsifiability probe." } } },' \
  "distinct board"

# C-44 (N-171) — a tier letter rendered above the ruleset header. By the time a
# reader reaches a caveat under the board they have read five letters and
# decided what they mean; this is the arrangement the row exists to reverse.
c_probe "C-44 · a tier letter above the ruleset header" "C-44" \
  "out/history/index.html" \
  '<p class="tier-disclaimer"' \
  '<span class="tier-badge tier-S">S</span><p class="tier-disclaimer"' \
  "above the ruleset header"

# C-44 again — an item quietly dropped from the not-measured list. The list is
# LITERAL, and "happiness" is the one a well-meaning edit would trim as obvious.
c_probe "C-44 · the not-measured list missing an item" "C-44" \
  "out/history/index.html" \
  'Human worth · Happiness · Moral value' \
  'Human worth · Moral value' \
  'omits "Happiness"'

fi

echo
[ "$FAILED" -eq 0 ] && echo "all wall lints went red on a planted violation" || echo "at least one wall lint did not catch its plant"
exit "$FAILED"
