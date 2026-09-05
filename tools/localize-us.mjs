/**
 * US-English pass over the campaign and Lab content.
 *
 * The campaign declares its setting in its own title — *Launch Window, United
 * States, 2025* — and a good deal of its prose was authored in British English.
 * That is a correctness problem against the product's own frame, not a style
 * preference, so it is fixed rather than deferred to the editorial gate.
 *
 * Scope is deliberately narrow: content/sim/campaign and content/sim/lab, which
 * are 4.0's own authored content. The reading layer and the Life Arc are NOT
 * touched — they are inherited 2.0/3.0 text, they are not set in the United
 * States, and §3.2 sanctions exactly five Life Arc deltas, none of them this.
 *
 * Two classes of substitution:
 *   SAFE      — the British word has no other meaning in this corpus.
 *   GUARDED   — the word is also ordinary English ("flat", "let", "agent"), so it
 *               is only replaced inside a listed phrase. Anything not listed is
 *               left alone and reported, so a judgement call is never made silently.
 *
 * Run: node tools/localize-us.mjs [--apply]
 * Without --apply it only reports.
 */
import fs from "node:fs";
import path from "node:path";

const ROOTS = ["content/sim/campaign", "content/sim/lab"];
const APPLY = process.argv.includes("--apply");

/** word -> replacement. Applied case-insensitively, preserving leading capital. */
const SAFE = {
  fortnight: "two weeks",
  fortnights: "two-week stretches",
  rota: "schedule",
  rotas: "schedules",
  enrol: "enroll",
  petrol: "gas",
  pavement: "sidewalk",
  takeaway: "takeout",
  neighbour: "neighbor",
  neighbours: "neighbors",
  neighbourhood: "neighborhood",
  neighbourhoods: "neighborhoods",
  timetable: "schedule",
  honours: "honors",
  honoured: "honored",
  apologise: "apologize",
  apologises: "apologizes",
  apologised: "apologized",
  recognise: "recognize",
  recognises: "recognizes",
  recognised: "recognized",
  realise: "realize",
  realises: "realizes",
  realised: "realized",
  organise: "organize",
  organises: "organizes",
  organised: "organized",
  whilst: "while",
  amongst: "among",
  learnt: "learned",
  spelt: "spelled",
  favourite: "favorite",
  behaviour: "behavior",
  behaviours: "behaviors",
  flavour: "flavor",
  colour: "color",
  colours: "colors",
  coloured: "colored",
  licence: "license",
  programme: "program",
  programmes: "programs",
  practise: "practice",
  practised: "practiced",
  cheque: "check",
  cheques: "checks",
  maths: "math",
  tyre: "tire",
  tyres: "tires",
  kerb: "curb",
  jumper: "sweater",
  trainers: "sneakers",
  lorry: "truck",
  chemist: "pharmacy",
  // "autumn" is deliberately NOT here. Americans say "fall" more often, but
  // "autumn" is ordinary American English, not a Britishism, and rewriting it
  // would also collide with "fall" the verb. Leaving correct prose alone.
  postcode: "zip code",
  "car park": "parking lot",
  "estate agent": "realtor",
  "bin bag": "trash bag",
  "bin bags": "trash bags",
  "washing-up": "dishes",
  "mobile number": "cell number",
  "ring back": "call back",
  "rang back": "called back",
};

/** exact phrase -> replacement, for words that are also ordinary English. */
const GUARDED = {
  // "flat" as a dwelling. Every other "flat" (flat stretch, pay is flat, the flat
  // hour, flat-fee, the flat feeling, lies out flat) is correct English and stays.
  "the whole flat": "the whole apartment",
  "The flat ": "The apartment ",
  "the flat ": "the apartment ",
  "the flat.": "the apartment.",
  "the flat,": "the apartment,",
  "a flat ": "an apartment ",
  "a flat.": "an apartment.",
  "a flat,": "an apartment,",
  "shared flat": "shared apartment",
  "empty flat": "empty apartment",
  "bad flat": "bad apartment",
  "new flat": "new apartment",
  "Better flat": "Better apartment",
  "same flat": "same apartment",
  "smaller flat": "smaller apartment",
  "second flat": "second apartment",
  "your flat": "your apartment",
  "Mo's flat": "Mo's apartment",
  "each other's flats": "each other's apartments",
  "two flats": "two apartments",
  "the flats": "the apartments",
  "The flats": "The apartments",
  "one of the flats": "one of the apartments",
  "machine in the flat": "machine in the unit",
  // British property vocabulary.
  "would let quickly": "would rent quickly",
  "The agent gives you": "The property manager gives you",
  // "rings" as telephoning.
  "rings on a Sunday": "calls on a Sunday",
  "she rings": "she calls",
  "he rings": "he calls",
  "they ring": "they call",
};

/** Phrases that must NEVER be rewritten, checked after the fact. */
const PROTECTED = [
  "flat stretch",
  "flat stretches",
  "pay is flat",
  "flat-fee",
  "flat feeling",
  "flat hour",
  "lies out flat",
  "flat and small",
  "flat register",
  "flat out",
  "flat refusal",
  "flatly",
];

const files = [];
for (const root of ROOTS) {
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(".ts") || e.name.endsWith(".md")) files.push(p);
    }
  };
  walk(root);
}

const counts = {};
let totalChanges = 0;
const leftAlone = [];
const vetoed = [];

for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  let s = before;

  // Guarded substitutions are applied one occurrence at a time so PROTECTED can
  // veto them. Joining on split() ignored PROTECTED entirely, and "the flat " ate
  // three correct sentences: "one of the flat stretches", "the flat hour on Sunday
  // morning", "the flat feeling in every afternoon".
  for (const [phrase, repl] of Object.entries(GUARDED)) {
    let from = 0;
    for (;;) {
      const at = s.indexOf(phrase, from);
      if (at < 0) break;
      const window = s.slice(Math.max(0, at - 30), at + phrase.length + 30);
      if (PROTECTED.some((p) => window.includes(p))) {
        vetoed.push(`${path.basename(file)}: "${phrase}" left alone in …${window.replace(/\s+/g, " ").trim()}…`);
        from = at + phrase.length;
        continue;
      }
      s = s.slice(0, at) + repl + s.slice(at + phrase.length);
      counts[phrase] = (counts[phrase] ?? 0) + 1;
      from = at + repl.length;
    }
  }

  for (const [word, repl] of Object.entries(SAFE)) {
    const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    s = s.replace(re, (m) => {
      counts[word] = (counts[word] ?? 0) + 1;
      return m[0] === m[0].toUpperCase() ? repl[0].toUpperCase() + repl.slice(1) : repl;
    });
  }

  // Article agreement. "a fortnight" -> "a two weeks" is the substitution eating
  // its own grammar; the count word is plural and the article has to go.
  for (const [bad, good] of [
    [/\bA two weeks\b/g, "Two weeks"],
    [/\ba two weeks\b/g, "two weeks"],
    [/\bA two-week stretches\b/g, "Two-week stretches"],
    [/\ba two-week stretches\b/g, "two-week stretches"],
  ]) {
    const before = s;
    s = s.replace(bad, good);
    if (s !== before) counts["article agreement after a substitution"] = (counts["article agreement after a substitution"] ?? 0) + 1;
  }

  // Anything still British that the tables did not cover.
  for (const m of s.matchAll(/\bflats?\b/gi)) {
    const ctx = s.slice(Math.max(0, m.index - 45), m.index + 45).replace(/\s+/g, " ");
    if (!PROTECTED.some((p) => ctx.includes(p))) leftAlone.push(`${path.basename(file)}: …${ctx}…`);
  }

  if (s !== before) {
    totalChanges++;
    if (APPLY) fs.writeFileSync(file, s, "utf8");
  }
}

console.log(APPLY ? "APPLIED" : "DRY RUN — pass --apply to write");
for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(3)}  ${k}`);
console.log(`\n${totalChanges} file(s) ${APPLY ? "rewritten" : "would change"}`);
if (vetoed.length) {
  console.log(`
${vetoed.length} guarded substitution(s) vetoed by the protected list:`);
  for (const v of vetoed) console.log(`   ${v}`);
}
if (leftAlone.length) {
  console.log(`\n${leftAlone.length} "flat" left for a human call (not in the guarded phrase list, not protected):`);
  for (const l of leftAlone) console.log(`   ${l}`);
}
