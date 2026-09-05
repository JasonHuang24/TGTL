# content/timeline/AUTHORING.md — the binding rules every timeline batch was written to

5.0 blueprint §7.4. These are not style preferences. Most of them are enforced by
`tools/timeline-build-content.mjs`, which **refuses to emit** a batch containing a
record that breaks them and names the record when it refuses. The rest are enforced
by the T-gates, or by the adversarial verifier that re-fetches every source.

If you are an authoring agent: read all of it before you write a record.

---

## 0. The cardinal rule

**A number you did not read on a page you fetched during this build is an invented
number.**

No age, window, threshold, rate or figure from memory, from training data, from a
prior TGTL document, or from any of the candidate sites. Not one. Even a fact you are
certain of must be fetched and quoted.

Every figure traces to a `Source` with:

- the URL you actually fetched,
- `retrievedOn` inside the build window,
- an `excerpt` that is **verbatim**, **at most twenty-five words**, and **contains the
  figure**.

Verbatim means character-for-character as the page has it. Not a paraphrase, not a
summary, not two sentences stitched together, not the page's grammar tidied up. When
the fetch tool hands you a paraphrase, fetch again and demand the literal sentence.

**If you cannot get a verbatim sentence containing the figure, you do not get to use
the figure.** Mark the record `researchRequired` instead. That is a respected outcome
and it is listed publicly on `/methodology` and in `KNOWN_LIMITATIONS.md`. A plausible
invention is the worst thing this build can ship; an honest gap is not.

---

## 1. The five kinds, and the two that do not exist

Every record carries exactly one `kind`:

| kind | is |
|---|---|
| `biological-window` | a range bodies commonly move through |
| `legal-threshold` | a rule with an age written into it |
| `institutional-sequence` | a schedule an institution keeps |
| `statistical-norm` | a pattern measured in a stated population |
| `cultural-expectation` | something people say (quoted, never asserted) |

The brief names seven kinds of "should". The other two —
`strategic-recommendation` and `personal-target` — are **excluded by type**: the
union in `schema.ts` has no arm for them, so they cannot be written. Strategy lives on
`/guidance`. Personal targets are the reader's own. A timing analysis may describe the
*mechanisms and associations* of early, late or never; it may never recommend a time.

---

## 2. Voice

- The timeline describes **people in a population**, third person plural — "most
  people", "many households". It does not address the reader and never characterises
  them. The only second person permitted anywhere is inside `heard`, where it is
  quotation of what other people say.
- **American English.**
- Present tense for rules, past tense only where the source is historical.
- Hedge the way `/methodology` promises: "commonly", "often", "in the stated
  population". Never "must", "should", or "by".
- A record's `label` is edition-neutral and authored once. The Game Guide edition maps
  vocabulary through the terminology map; it never gets its own authored string.

### 2.1 The normative-language wall

Forbidden in **every** field except `heard`:

> should have · you should · by now · behind · on track · off track · falling behind ·
> catch up with your peers · supposed to · expected to have · normal people ·
> late bloomer · ahead of schedule · behind schedule · milestone score · life score ·
> keeping up · keep up · your age group · at your age · people your age

`content/timeline/normative-lint.ts` holds the list with its variants. **The list is
safety-relevant. It may not be edited to make a record pass.** If your record trips it,
the record is wrong. Rewrite the record.

`heard` is exempt, and it is the only exemption in the entire content model, because
`heard` is quotation set apart in a quotation treatment under the standing line *"an
expectation is a thing said to you, not a fact about you"*.

---

## 3. Digits

**No prose field may contain a digit.** Not `label`, `population`, `whatChanges`,
`careNote`, `windowInWords`, `measures`, `researchNote`, a branch's `tends`, `costs`
or `routes`, and not `heard`.

Numbers live in exactly two places: the typed `timing` fields, and `Source.excerpt`.

Spell small counts out — "eighteen", "two thirds of states" — or rewrite to avoid the
number. Years are fine in an excerpt; they are not fine in prose.

Why: it is the only mechanical rule that makes "every number on the page is sourced"
checkable. A digit that reaches prose has escaped the source system.

---

## 4. Rates never render on a surface

If a source gives a percentage, that percentage belongs in the `Source.excerpt` and
nowhere else. It renders inside the evidence drawer, never on the spine and never in a
year card. What the surface carries is the **age or the window**, plus — where a
proportion matters — a qualitative band from the published band table
(*most · about half · many · some · few*).

Where a rate is shown in a drawer it is the **absolute** figure. A relative-risk figure
never renders without its absolute base beside it.

---

## 5. Timing: encode what the source actually measured

- A **federal rule that is one age everywhere** → `exact`.
- A rule that **differs by state** → `variesByState` with the lowest and highest state
  values you actually sourced, plus a note. **Never collapse a state-varying rule to a
  single age.**
- A rule that **varies by condition** (still working, disabled, plan type) is not an
  `exact` age either. Either encode the honest window or say in `population` exactly
  which route the age belongs to — and make the `label` say it too.
- A **window** → `window` for the outer extent, `typical` for the denser zone inside
  it. `typical` must sit inside `window`.
- A **median** → `typical: {from: m, to: m}` with `measure: "median"`, and say so in
  `population`.

### 5.1 Four traps that caught real batches in this build

1. **A survey's age universe is not a measured age.** "Among eighteen- to
   twenty-four-year-olds, thirty-nine percent were enrolled" defines a denominator. It
   does not say people enrol between those ages.
2. **A stock is not a flow.** "This share are enrolled" is a snapshot. "People enrol at
   this age" is an event. They are different claims and usually different sources.
3. **A hedge in `population` does not rescue an absolute `label`.** The label is what
   renders. If the label asserts an earliest, a first, or an only, the source must
   support exactly that.
4. **Do not do arithmetic the source does not print.** "Remaining life expectancy at
   sixty-five is x years" is not a licence to write the age sixty-five plus x. If the
   source does not print the number, mark it `researchRequired`.

---

## 6. Sensitive records

A record about child development, puberty, fertility, health decline, or dying carries
`sensitivity`, a `careNote`, and the required route — and the compiler refuses it
otherwise:

| sensitivity | required route |
|---|---|
| `child-development` | `/topics/health` |
| `puberty` | `/topics/health` |
| `fertility` | `/topics/health` |
| `health-decline` | `/topics/health` |
| `dying` | `/situations/a-death` **and** `/situations/grief`, both, named first |

The `careNote` is **one calm sentence** saying what this material is not, and where the
real route is. Not a disclaimer, not a hedge — a hand on the door.

Rules of tone that no lint can check and a human read must:

- **Child development:** windows only, phrased the way the source phrases it ("most
  children by"). Never "should". No per-child comparison surface. The renderer adds the
  screening line and the variation line automatically; write nothing that fights them.
- **Fertility:** a window narrowing is a sourced fact and may be stated plainly. Nothing
  about a body is ever a penalty, a cost of delay, or a failure. Alternatives —
  treatment, adoption, fostering, a life without children — are rendered as **routes**,
  never as consolation. These records are `optional: true`.
- **Health decline and dying:** matter-of-fact, practical, short. No dread, no
  euphemism, no bravery framing.
- Nothing anywhere may read as a verdict on a body.

### 6.1 The tier walls

- **Crisis tier — nowhere on the timeline, with no exceptions.** Abuse, coercive
  control, self-harm, suicide, sexual violence, acute psychiatric crisis. The
  adolescence stage intro names the real pages once through the standing crisis-note
  component; that is the only place any of it is referenced, and it is a component, not
  a content field.
- **Loss tier** — death, dying, funeral, widowed, bereaved, terminal, hospice,
  diagnosis, depression and the rest of `content/exclusions.ts` — passes **only** inside
  a record flagged `dying` or `health-decline`. Everywhere else it fails the build. If
  you need one of those words, the record is sensitive; flag it.

---

## 7. Recovery beside every cost

In a `TimingAnalysis`, any branch that names `costs` **must** carry at least one
`route` in the same object. There is no exception and the compiler enforces it.

For every record marked `optional: true` that has an analysis, a `never` branch must
exist, and it says plainly that never is a path rather than a failure.

State honestly whether catching up is easy, partial, expensive, or closed. "Closed" is
an allowed answer; pretending otherwise is not.

### 7.1 Grading a route (6.0, N-379)

A route entry may be written two ways, and the compiler accepts both:

```json
"routes": [
  "a part-time return through a community college",
  { "route": "a second residency application", "grade": "costly" }
]
```

The four grades, and what each one promises:

| grade | renders as | means |
|---|---|---|
| `easy` | *open* | available, and the cost is not what stands in the way |
| `costly` | *expensive* | genuinely open, and the price is real — money, years, or both |
| `partial` | *partial* | some of what was lost comes back through this; some does not |
| `closed` | *closed* | this particular door does not reopen |

Why the field exists: **rule 7 applies a pressure worth naming.** The cheapest way to
satisfy "every cost carries a route" is a route that is technically true and
practically useless — *you can retrain*, *you can appeal*. A reader told that a door is
expensive can plan around it; a reader told it is open, who then finds the price, has
learned that this guide flatters.

**The grade never replaces a route.** `{ "grade": "closed" }` with no `route` is a hard
error, and so is an empty one. T-4 reads through the grade to the sentence: the
requirement is unchanged, and only the accessor moved. A branch whose only route is
graded `closed` still owes the reader somewhere to go, which is what the rest of the
list is for.

Grades are **opt-in**. An ungraded route makes no claim about its price, which is the
honest default when you do not know. Do not grade a route you have not thought about;
an unsupported *open* is worse than no word at all.

---

## 7A. Expectation evidence must say when it was speaking (6.0, N-386)

Every `Source` cited by a **`cultural-expectation`** record carries `timing`:

| timing | means |
|---|---|
| `contemporaneous` | recorded at the time, by a party in a position to record it: a rule as the body that administers it currently states it, a survey run in the period it describes, a document written then |
| `retrospective` | looking back — a memoir, an oral history, a survey asking people what they remember expecting, an essay about how things used to be |

The compiler **refuses the batch** naming the record and the source when a
cultural-expectation record cites a source with no `timing`, and T-9's `measures`
discipline extends to it. The requirement follows the **citation**, not the source: the
same page can be an ordinary statistical source for one record and a claim of a
completely different kind when cited about what people used to expect. A source cited
by both carries the field.

Why: nostalgia is the primary source most likely to be cited about an earlier
expectation and the least likely to be true. Memory reconstructs an expectation to fit
what followed, so a later reflection is evidence about **how the past is perceived now**,
and is not direct evidence of the expectation itself.

Retrospective sources stay usable, and are **labelled rather than excluded** — the word
renders beside the source's own stamp, so a reader can discount it themselves. That is
the move this build makes everywhere else, and there is no reason for this channel to
be the exception.

**If you cannot tell from the excerpt you actually read, write `retrospective`.** It is
the honest under-claim: it weakens the record rather than the reader's guard.

---

## 8. Length and shape

- `whatChanges`: at most **three** lines, at most **forty words** each. What actually
  changes when this happens — not why it matters, not what to do about it.
- `excerpt`: at most **twenty-five words**.
- `heard`: short. It is something a person says out loud.
- One record means one thing. If a record is trying to say two things, it is two
  records. **A comparison between two age bands is two things.** A source sentence
  of the shape "it is lowest in band A and highest in band B" describes two bands;
  encoding it as one window running from A to B puts a true figure about B beside
  every year in between. The acceptance review found four records doing exactly
  that and a scan for the signature found three more. Each band the source names
  becomes a record whose window is that band and nothing wider.
- **A label NAMES the thing; the claim goes in `whatChanges`.** "Reported formal
  volunteering is highest among the youngest teenagers surveyed and next highest
  among adults in their late forties and early fifties" is a sentence, and it
  renders as the record's name in a list of names. "Formal volunteering through an
  organization" is a name. The window says when, the standing line says what kind
  of thing it is, and `whatChanges` carries the sentence. Say *median* when the
  measure is a median: "the middle age of a first-time home buyer" reads as
  middle-aged.

---

## 9. What the compiler will refuse

Each of these fails the build, naming the record:

- numeric timing with no resolving source
- a `bySex` block with no `measures` or no source
- a `cultural-expectation` record citing a source with no `timing` (N-386)
- a route graded with anything but `easy`, `costly`, `partial` or `closed`, or a graded
  route carrying no sentence (N-379)
- a sensitive record with no `careNote`, or missing a required route
- a branch with `costs` and no `routes`
- an `optional` record with an analysis and no `never` branch
- a `readRef` that is not a real route
- an excerpt over twenty-five words, or empty
- a digit in a prose field
- normative language in any field but `heard`
- a crisis-tier term anywhere
- a loss-tier term outside a `dying`/`health-decline` record
- `evidence: "calibrated"` — the label is reserved and nothing here claims it
- `heard` on a record that is not a `cultural-expectation`, or a
  `cultural-expectation` with no `heard`
- a `major` record with no analysis
- `typical` not contained by `window`
- a `retrievedOn` outside the build window
