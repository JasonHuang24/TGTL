"""Plant one real violation into a real timeline artifact, for tests/falsify-walls.sh.

Usage: python3 tests/fixtures/timeline/plant.py <probe> <file>
Exits 0 if the plant was made, 1 if the anchor was not found (the probe then SKIPs
and the falsify run fails loudly rather than quietly reporting a green it did not earn).

These live in a FILE rather than inline in the shell script deliberately. The first
version embedded this Python inside single-quoted shell strings; the escaping mangled
every regex, all six probes reported "anchor missing", and the run looked like six
skips instead of six proofs. That is the same family of failure as the literal-0x08
regex 4.0 shipped: a check that cannot fire, wearing the costume of a check.
"""

import io
import re
import sys


def load(path):
    return io.open(path, encoding="utf-8").read()


def save(path, s):
    io.open(path, "w", encoding="utf-8", newline="\n").write(s)


def plant_t1(path):
    """T-1 — strip the sources off a record that has numeric timing (§4.1)."""
    s = load(path)
    # Records are emitted as pretty JSON. Find one with both "timing" and "sources".
    for m in re.finditer(r'"id": "(ms-[a-z0-9-]+)"', s):
        start = m.start()
        seg = s[start : start + 8000]
        if '"timing"' not in seg or '"sources"' not in seg:
            continue
        new_seg, n = re.subn(r'"sources": \[[^\]]*\]', '"sources": []', seg, count=1)
        if n == 0:
            continue
        save(path, s[:start] + new_seg + s[start + 8000 :])
        sys.stderr.write("planted into %s\n" % m.group(1))
        return True
    return False


def plant_t3(path):
    """T-3 — put a forbidden normative construction into the site's own voice (§5.1)."""
    s = load(path)
    m = re.search(r'"whatChanges": \[\s*\n\s*"', s)
    if not m:
        return False
    i = m.end()
    save(path, s[:i] + "By now most people should have done this. " + s[i:])
    return True


def plant_t4(path):
    """T-4 — a named cost with no recovery route beside it (§5.7)."""
    s = load(path)
    m = re.search(r'(\n(\s+)"id": "ms-[a-z0-9-]+",)', s)
    if not m:
        return False
    ind = m.group(2)
    block = (
        "\n" + ind + '"analysis": {\n'
        + ind + '  "late": {\n'
        + ind + '    "tends": "A planted branch for the falsifiability probe.",\n'
        + ind + '    "costs": ["a planted cost with no route beside it"],\n'
        + ind + '    "evidence": "speculative"\n'
        + ind + "  }\n"
        + ind + "},"
    )
    i = m.end(1)
    save(path, s[:i] + block + s[i:])
    return True


def plant_t4b(path):
    """T-4, N-379's half — a graded route with no sentence in it.

    The extension's own failure mode: `{ "grade": "closed" }` reads like an
    answer and is not one. T-4 is EXTENDED, never relaxed — the gate reads
    through the grade to the sentence, and a grade on its own has to fail
    exactly as a missing route always did.
    """
    s = load(path)
    m = re.search(r'"routes": \[\s*\n(\s*)"', s)
    if not m:
        return False
    ind = m.group(1)
    i = m.start()
    j = s.index("]", i)
    save(path, s[:i] + '"routes": [\n' + ind + '{ "grade": "closed" }\n' + ind[:-2] + s[j:])
    return True


def plant_t9(path):
    """T-9, N-386's half — a source cited about an expectation with no timing.

    Planted into the compiled SOURCES rather than the milestones, because that
    is the artifact the gate reads for this half. A source that does not say
    whether it was speaking at the time or looking back is exactly the shape
    nostalgia arrives in.
    """
    s = load(path)
    new, n = re.subn(r'\n\s*"timing": "(?:contemporaneous|retrospective)",', "", s, count=1)
    if n == 0:
        return False
    save(path, new)
    return True


def plant_t6(path):
    """T-6 — strip the care note off a sensitive record (§5.3)."""
    s = load(path)
    if '"sensitivity"' not in s:
        return False
    new, n = re.subn(r'\n\s*"careNote": "[^"]*",', "", s, count=1)
    if n == 0:
        return False
    save(path, new)
    return True


def plant_t7(path):
    """T-7 — make a year card claim a milestone its records do not put there."""
    s = load(path)
    m = re.search(r'data-tl-milestones="([^"]*)"', s)
    if not m:
        return False
    planted = (m.group(1) + " ms-planted-invention").strip()
    save(path, s[: m.start(1)] + planted + s[m.end(1) :])
    return True


def plant_t8(path):
    """T-8 — a rate on the surface, outside any evidence drawer (§4.5)."""
    s = load(path)
    m = re.search(r'<p class="tl-empty"[^>]*>', s)
    if not m:
        return False
    i = m.end()
    save(path, s[:i] + "About 62% of people. " + s[i:])
    return True


PROBES = {
    "t1": plant_t1,
    "t3": plant_t3,
    "t4": plant_t4,
    "t4b": plant_t4b,
    "t9": plant_t9,
    "t6": plant_t6,
    "t7": plant_t7,
    "t8": plant_t8,
}

if __name__ == "__main__":
    if len(sys.argv) != 3 or sys.argv[1] not in PROBES:
        sys.stderr.write("usage: plant.py <%s> <file>\n" % "|".join(sorted(PROBES)))
        sys.exit(2)
    ok = PROBES[sys.argv[1]](sys.argv[2])
    sys.exit(0 if ok else 1)
