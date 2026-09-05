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

echo
[ "$FAILED" -eq 0 ] && echo "all wall lints went red on a planted violation" || echo "at least one wall lint did not catch its plant"
exit "$FAILED"
