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

CBAK="$(mktemp)"; cp "$TL_CONTENT" "$CBAK"; CBEFORE="$(sha256sum "$TL_CONTENT" | cut -d' ' -f1)"
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
rm -f "$CBAK" "$HBAK" "$CREF" "$HREF"
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

fi

echo
[ "$FAILED" -eq 0 ] && echo "all wall lints went red on a planted violation" || echo "at least one wall lint did not catch its plant"
exit "$FAILED"
