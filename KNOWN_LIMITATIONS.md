# KNOWN_LIMITATIONS.md — TGTL 5.0 (The Timeline)

The honest list. Everything the build does not do, does not know, or defers — plus
every gate the owner still has to close before this is shown to the public.

The 4.0 list is preserved below in full and remains in force; 5.0 entries come first.

---

## 0. NEW IN 5.0 — the timeline

### 0.1 Release gates the owner must close (5.0)

These are not defects. They are decisions and verifications only the owner can make.

**0.1.1 Pediatric / developmental review — NEW, and the most important new gate.**
Every record flagged `child-development` and every record flagged `puberty` needs a
reading by someone qualified in child development before launch. The build renders
them quiet, pairs each with the line "A population range is not a screening threshold.
If you are worried about a child, the route is a pediatrician, not a website.", and
routes each to `/topics/health` — that is containment, not a substitute for a
professional reading of the prose.

**0.1.2 Clinical review — NEW.** Every record flagged `fertility`, `health-decline`
and `dying`, plus the later-life stage intro and anything it says about life
expectancy, needs clinical review. The fertility records in particular: a window that
narrows is a sourced fact, and the line between stating it and implying a deadline is
a judgement a clinician should check.

**0.1.3 The owner's editorial read of every cultural-expectation record.** The "what
gets said" quotes are the site's judgement about what people actually hear said to
them. They render as quoted speech under the line "an expectation is a thing said to
you, not a fact about you". No gate can tell us whether they ring true. The owner's
ear is the check.

**0.1.4 The owner's read of the research-required list** (§0.2 below) — whether to
ship with visible "not yet sourced" markers at all (blueprint §12 decision 2; the
build's reversible default is yes).

**0.1.5 The Phase 1 art checkpoint** (blueprint §12 decision 11) — the drawn spine at
first art, reviewed before content scales. It was missed: content scaled first, and
the acceptance review's F3 said so. The fix pass built the thing the checkpoint was
for — a **stage rail** of eight bubbles above the lane spine, each with an authored
in-repo SVG figure, the stage name and its band, clickable to move the cursor — so the
owner can hold the checkpoint now, late, on something real. It is deliberately plain
and built to be redirected. The captures are `screenshots/timeline-*`: ten scenes,
both themes, desktop and 320px. **This gate is open until the owner has looked at
them.** What the owner is deciding: whether the figures are the right register for
this site, whether eight bubbles across is the right shape, and whether the lane spine
underneath should stay as the detail instrument.

**0.1.6 The owner's read of four findings this build could not settle.** Each is
recorded in full in `DECISIONS.md` §4A. (A fifth, whether the timeline should render
the Game Guide vocabulary, WAS settled in the fix pass: the owner took the blueprint's
§12 default and the timeline is edition-neutral by design. The six dead Game Guide
labels and the nine unused stage game labels were removed rather than left in place —
`DECISIONS.md` section 6, F4.)
- **The sex lens is inert.** One record carries a sourced divergence and it is not on
  the spine, so the control cannot change anything visible. The note now says so
  plainly. Hide the control until a spine record diverges, or source a divergence.
- **The qualitative band table is published and never used**, because no surface
  currently needs to express a proportion. The rule is satisfied vacuously.
- **The branch questions are first person** — "What if I am early?" is the brief's own
  §14A wording, and it is also the site speaking as the reader, which §7.4 forbids.
  Suppressed on dying records and on records with no window; kept elsewhere.
- **Five records are `major` and `researchRequired` at once**, so they carry a full
  page that shows no age. The capacity cut would have removed them first.

**0.1.7 Carried, unchanged:** the clinical/specialist reviews of the five sensitive
pages; the 3.0/4.0 scripted beats; the parse bridge; the 4.0 art-direction sign-off.
All are listed in §1 below and none was touched by 5.0. **Hotline verification, also
carried, was CLOSED on 2026-09-04** (§1.1).

**0.1.8 How this ships while the gates are open (publish pass, 2026-09-04).** As a
labelled preview: the footer of every page says "TGTL 5.0 preview", links to
`/methodology#preview-status` where the open gates are listed, and every page carries
`noindex`. It is a GitHub Pages project site at https://jasonhchronicles.com/TGTL/.
The label comes off only when the owner closes the gates above; nothing in the publish
pass weakened any of them. The one thing the pass did not do is make the gate scripts
mount-aware: they assume a root-mounted export, so the roster runs on a root build and
the `/TGTL` build is checked separately (`DECISIONS.md` §7).

### 0.2 What the timeline does not know

<!-- TIMELINE-RESEARCH-REQUIRED:START (generated by tools/timeline-known-limitations.mjs) -->

**research-required records: 33**

Each of these is a claim whose SHAPE we are confident about and whose NUMBER we do not have. They render on the timeline with the calm label “not yet sourced”, they show no digit, and they are the honest alternative to guessing. Each line gives the query that would resolve it.

- **`ms-advance-directives-later-life`** — Written care instructions naming a decision maker
  - lane: Civic & legal · kind: An institution's schedule
  - what we can say without a number: “Paperwork naming a decision maker and setting out care instructions, available across adult life with no starting age of its own, on file more often in the older bands than in the younger ones measured beside them”
  - **query that would resolve it:** Need a general-population study reporting the share of people who have completed an advance directive at a stated age or age band — a Health and Retirement Study analysis or a national survey of adults would do it. The NCHS long-term-care data brief cannot carry this: its comparison is an odds contrast between open bands inside a universe of people already receiving home health, nursing home or hospice care, which is a stock inside a narrow universe rather than an age at which anything happens.
- **`ms-belonging-to-groups-and-organizations-by-age`** — Belonging to a community, civic or religious organization across adult life
  - lane: Inner life & meaning · kind: A common pattern
  - what we can say without a number: “Belonging to a congregation, a club, a union, a neighborhood group or another organization is often described as more common in the later adult years than in the earliest, but no source fetched in this pass gave a verbatim sentence naming an age band beside a figure, so no window is asserted.”
  - **query that would resolve it:** Needed: a verbatim sentence naming an age band together with the share of people who belong to a group or organization. Candidates to fetch: the AmeriCorps Volunteering and Civic Life in America pages on americorps.gov, whose organizational membership measure is published by demographic group but which refused an automated fetch in this pass; the Civic Engagement and Volunteering Supplement detailed tables on census.gov; the AmeriCorps open data dashboard on data.americorps.gov, if it publishes a sentence rather than a table alone. The Pew religious attendance report was fetched and its narrative names older and younger adults without giving an age band beside a figure, so it cannot resolve this.
- **`ms-caregiving-onset-age`** — When caring unpaid for an adult relative first begins
  - lane: People & family · kind: A common pattern
  - what we can say without a number: “The age at which people first take on unpaid care for an adult relative, as distinct from the age of everyone who is caregiving at a given moment; the survey evidence in hand measures only the second.”
  - **query that would resolve it:** Need a source measuring age at ONSET of unpaid care for an adult, not the age distribution of people who are caregiving at the moment of the survey. Try the American Time Use Survey eldercare module (bls.gov/tus/eldercare.htm) for age-specific eldercare provider rates, or the Health and Retirement Study for transitions into caregiving. The National Alliance for Caregiving and AARP survey reports only the average and median age of current caregivers, which is a stock and not an onset; its own age bands run from young adulthood into the oldest group it counts.
- **`ms-civic-participation-before-voting-age`** — Organized community and civic participation begins well before voting age
  - lane: Civic & legal · kind: A common pattern
  - what we can say without a number: “Group and community participation starts in childhood, long before the age at which the right to vote attaches, but the age band could not be sourced with a verbatim figure in this pass.”
  - **query that would resolve it:** Needed: a verbatim sentence naming the ages at which children and adolescents take part in organized school, community or neighborhood groups. Candidates to fetch: the National Household Education Survey parent and family involvement tables on nces.ed.gov; Census Current Population Survey Civic Engagement and Volunteering Supplement detailed tables on census.gov, whose published age bands start at the teenage years and may not reach younger children at all.
- **`ms-completing-twelfth-grade`** — Finishing the twelfth grade
  - lane: Learning · kind: An institution's schedule
  - what we can say without a number: “the end of the standard secondary school sequence, with some leaving it earlier and some finishing it later”
  - **query that would resolve it:** A measured distribution of ages at completion of the twelfth grade is needed. NCES Digest of Education Statistics chapter two, and the Census Bureau October Current Population Survey School Enrollment Supplement detailed tables, cross grade attended against single year of age; resolving query: 'Digest of Education Statistics, enrollment by grade attended and single year of age'. The Mini-Digest structural overview describes only how the program is organized, and states in the same paragraph that the high school level may run a variable number of years depending on district structure, so it cannot supply either an age or a measured share.
- **`ms-continued-learning-after-formal-schooling`** — Learning that continues after formal schooling ends
  - lane: Learning · kind: A common pattern
  - what we can say without a number: “Formal and informal learning continues after schooling ends and across adult life, but no sourced age window for it was found.”
  - **query that would resolve it:** No age-resolved United States figure was obtainable. The adult skills assessment pages fetched report fixed survey universes only (working-age adults, plus an older extension band) and no measured age at which adult learning begins, peaks, or ends, so any window would be the survey universe dressed up as an age. Resolving query: NCES Program for the International Assessment of Adult Competencies United States results tables giving literacy proficiency by ten-year age group, or the NCES Adult Training and Education Survey reporting participation in work-related courses and certificate programs by age group.
- **`ms-death-of-a-spouse-later-life`** — Outliving a husband or wife
  - lane: People & family · kind: A common pattern
  - what we can say without a number: “The age at which people outlive a husband or wife. The sources read here report only how large a share of each older age band is widowed, which is a different claim, and their oldest band is open-ended.”
  - **query that would resolve it:** Need a source that prints an age at which people are widowed, rather than the share of a fixed age band that is currently widowed. Try the Health and Retirement Study for transitions into widowhood by age, or a Census Survey of Income and Program Participation report giving a median age at widowhood, and look for one that reports women and men separately, since every marital-status tabulation found in this build shows a large divergence between them. The American Community Survey indicator and the Census story read in this build both tabulate marital status inside age groups only.
- **`ms-enrolling-in-college`** — Enrolling in college
  - lane: Learning · kind: An institution's schedule
  - what we can say without a number: “for many, the months after finishing high school, with first enrollment also happening throughout the adult years”
  - **query that would resolve it:** A measured distribution of age at first postsecondary enrollment is needed: NCES Beginning Postsecondary Students Longitudinal Study or National Postsecondary Student Aid Study tables on age at first enrollment, or the Digest of Education Statistics table on total fall enrollment in degree-granting postsecondary institutions by age of student. Both are published as spreadsheets rather than quotable prose. The federal immediate college enrollment indicator and the federal college enrollment rate indicator each fix an age band to define who is counted, and the second measures a share enrolled at a point in time rather than the act of enrolling, so neither can supply a timing window.
- **`ms-first-full-time-job`** — A first sustained full-time job
  - lane: Work & income · kind: A common pattern
  - what we can say without a number: “The years over which people take a first job that is full time and lasts, a window that stretches from the late teens through the twenties and moves later where schooling runs longer.”
  - **query that would resolve it:** Need a fetchable page from the BLS National Longitudinal Survey of Youth (the later cohort) reporting a median or modal age at a first job held full time for a sustained period. Query: bls.gov national longitudinal survey of youth news release age at first job lasting thirteen weeks or more. Labor force participation rates by age band cannot answer this, because a rate inside a fixed band is not an age at entry.
- **`ms-heard-acting-your-age`** — What gets said about acting one's age
  - lane: Inner life & meaning · kind: Something people say
  - what we can say without a number: “the whole of adult life, and most sharply at its two edges”
  - **query that would resolve it:** A survey measuring the ages at which people report being told their clothing, hobbies or ambitions do not suit their years is needed; an AARP or Pew Research Center age-stereotyping survey reporting by age band would resolve it, and none quotable was found.
- **`ms-heard-caring-for-parents`** — What gets said about caring for ageing parents
  - lane: People & family · kind: Something people say
  - what we can say without a number: “the middle and later adult years, wherever an older relative needs help”
  - **query that would resolve it:** The National Alliance for Caregiving and AARP Caregiving in the US report gives the average age of family caregivers, which is the band this saying is aimed at; a fetchable page carrying that age in a quotable sentence was not obtained.
- **`ms-heard-college-as-default`** — What gets said about college as the default route
  - lane: Learning · kind: Something people say
  - what we can say without a number: “the last years of secondary school and the first years after it”
  - **query that would resolve it:** A survey measuring the ages at which young people report being asked about college plans is needed. A Pew Research Center or Gallup education survey reporting the age band of respondents asked about postsecondary expectations would resolve it; the Pew pages refused this fetcher.
- **`ms-heard-downsizing`** — What gets said about downsizing a home
  - lane: Home & independence · kind: Something people say
  - what we can say without a number: “the later adult decades, around and after leaving paid work”
  - **query that would resolve it:** The National Association of Realtors, or the Harvard Joint Center for Housing Studies Housing America's Older Adults report, gives the ages at which households move to smaller homes; a fetchable page carrying that band in quotable prose was not obtained.
- **`ms-heard-figured-out-by-thirty`** — What gets said about certainty in the early thirties
  - lane: Inner life & meaning · kind: Something people say
  - what we can say without a number: “the years on either side of the birthday the saying names”
  - **query that would resolve it:** A survey measuring the ages at which people report a felt deadline for settling work, housing and relationships is needed. A General Social Survey or Pew Research Center age-norms module reporting that band would resolve it; none quotable was found.
- **`ms-heard-first-job-sets-the-tone`** — What gets said about a first full-time job
  - lane: Work & income · kind: Something people say
  - what we can say without a number: “the years around a first full-time job and the working decade that follows it”
  - **query that would resolve it:** The Bureau of Labor Statistics National Longitudinal Survey of Youth news release on the number of jobs held reports job changes by age band, which would give this saying its window; a fetchable page stating the band in quotable prose was not obtained.
- **`ms-heard-learning-new-tools`** — What gets said about learning new tools in later life
  - lane: Learning · kind: Something people say
  - what we can say without a number: “the later adult decades, wherever an unfamiliar tool arrives”
  - **query that would resolve it:** A measured distribution of the ages at which adults take up new software or new qualifications is needed: Pew Research Center technology adoption by age, or NCES adult education participation by age, quoted verbatim with the band it reports.
- **`ms-heard-living-at-home`** — What gets said about living with parents after school
  - lane: Home & independence · kind: Something people say
  - what we can say without a number: “the years after finishing school, while a separate household is or is not being formed”
  - **query that would resolve it:** Pew Research Center reports the share of Americans naming an age by which young adults reach financial independence, which is the age this saying carries. Every Pew page refused this fetcher with a forbidden response, so no verbatim sentence containing the age could be quoted.
- **`ms-heard-made-it-by-forty`** — What gets said about peak earning years
  - lane: Money & wealth · kind: Something people say
  - what we can say without a number: “the middle working years, on both sides of the birthday the saying names”
  - **query that would resolve it:** Census Bureau or Bureau of Labor Statistics tables of median earnings by age band would give the ages at which earnings actually move, against which this saying can be placed; the published tables are spreadsheets this fetcher could not read.
- **`ms-heard-major-decides-everything`** — What gets said about choosing a field of study
  - lane: Learning · kind: Something people say
  - what we can say without a number: “the years around entering and moving through a first course of study”
  - **query that would resolve it:** A measured distribution of the ages at which students declare and change a field of study is needed. The NCES Beginning Postsecondary Students Longitudinal Study reports major changes, but its published tables are spreadsheets rather than quotable prose.
- **`ms-heard-order-of-family-steps`** — What gets said about the order of family steps
  - lane: People & family · kind: Something people say
  - what we can say without a number: “the years across which partnership and childbearing are commonly arranged”
  - **query that would resolve it:** The National Center for Health Statistics reports the timing and order of marriage and of a first birth by age; a quotable sentence naming the age band across which the sequence question is put was not obtained from a fetchable page.
- **`ms-heard-permanent-record`** — What gets said about school records in the teenage years
  - lane: Learning · kind: Something people say
  - what we can say without a number: “the secondary school years, while a transcript is being written”
  - **query that would resolve it:** A measured distribution of the ages at which this is said to adolescents is needed. A nationally representative adolescent survey module on academic pressure and its sources — the National Center for Education Statistics longitudinal study items on perceived consequences of grades — would supply the age band; no fetchable page stated one in quotable prose.
- **`ms-heard-quiet-house`** — What gets said when grown children leave home
  - lane: People & family · kind: Something people say
  - what we can say without a number: “the years in which grown children commonly leave a parental household”
  - **query that would resolve it:** The Census Bureau America's Families and Living Arrangements tables report the ages of parents whose youngest child has left the household, which is the band this saying is aimed at; a quotable prose sentence naming it was not obtained.
- **`ms-heard-renting-versus-buying`** — What gets said about renting and buying
  - lane: Money & wealth · kind: Something people say
  - what we can say without a number: “the years across which a first home purchase is commonly considered”
  - **query that would resolve it:** The National Association of Realtors Profile of Home Buyers and Sellers reports the median age of first-time buyers, which is the band this saying is aimed at; a fetchable page carrying that age in a quotable sentence was not obtained.
- **`ms-heard-savings-rules-of-thumb`** — What gets said about savings rules of thumb
  - lane: Money & wealth · kind: Something people say
  - what we can say without a number: “the working years, wherever the saying is repeated — the ages it names belong to the guideline it borrows from rather than to anyone hearing it”
  - **query that would resolve it:** A survey measuring the ages at which people report hearing a savings target stated as a multiple of income would resolve this. The published brokerage guideline the saying borrows from does name ages, but those are the firm's own modelling assumption about a plan, not a measurement of when the expectation is said to anyone, so it cannot supply a window; a Pew Research Center or Federal Reserve survey of household financial expectations reporting by age band would.
- **`ms-heard-settle-down`** — What gets said about settling down
  - lane: People & family · kind: Something people say
  - what we can say without a number: “the years across which partnership and childbearing questions are commonly put to a person”
  - **query that would resolve it:** A survey measuring the ages people name as the right time to marry or to have a first child is needed — a Pew Research Center or General Social Survey age-norms item — quoted verbatim with the age band it reports.
- **`ms-heard-taking-time-off`** — What gets said about taking time away from study or work
  - lane: Inner life & meaning · kind: Something people say
  - what we can say without a number: “the years of study and early working life, and again wherever a pause interrupts them”
  - **query that would resolve it:** A measured distribution of the ages at which people interrupt and then resume study or paid work is needed: NCES stopout and re-enrollment tables, or Bureau of Labor Statistics labor force flows by age, published as quotable prose rather than as spreadsheets.
- **`ms-heard-young-voters`** — What gets said about young voters
  - lane: Civic & legal · kind: Something people say
  - what we can say without a number: “from the first election a person is old enough to vote in, through the decade that follows”
  - **query that would resolve it:** The Census Bureau Current Population Survey Voting and Registration Supplement reports turnout by single year of age, which would give the age band this saying is aimed at; the published detailed tables are spreadsheets this fetcher could not read.
- **`ms-hospice-and-palliative-availability`** — Hospice and palliative care, as services rather than events
  - lane: Body & health · kind: An institution's schedule
  - what we can say without a number: “A service that is available across later life with no starting age of its own, taken up by a share of people in the oldest bands rather than in a particular year”
  - **query that would resolve it:** Need a verbatim eligibility sentence from medicare.gov or the CMS hospice benefit page, plus a use-by-age-band sentence from the CMS Hospice Monitoring Report published at cms.gov/files/document. Note that any age band in that report is measured among beneficiaries who died, which is a share inside a decedent universe and not an age at which anything happens.
- **`ms-minimum-age-to-marry`** — Minimum age to marry under state law
  - lane: People & family · kind: A rule with an age in it
  - what we can say without a number: “around the age at which state law treats a person as an adult, with some states allowing marriage earlier under conditions their statutes set”
  - **query that would resolve it:** Needs one compilation covering all fifty states, not individual state statutes, since two statutes cannot establish national endpoints. Query: a National Conference of State Legislatures or Congressional Research Service table of state statutory minimum marriage ages, which must state the highest state floor and say how states without a statutory minimum are handled.
- **`ms-modal-age-of-twelfth-graders`** — Age of students in the final year of high school
  - lane: Learning · kind: An institution's schedule
  - what we can say without a number: “the last year of the standard high school sequence”
  - **query that would resolve it:** Census Bureau October Current Population Survey School Enrollment Supplement detailed tables, which cross grade attended against single year of age. The published files are spreadsheets that this fetcher could not read; the resolving query is 'CPS October School Enrollment Supplement detailed tables, enrollment status of the population three years old and over, by age and grade'. NCES Digest of Education Statistics chapter two carries the same crosstab. Until that crosstab is captured, nothing may be said about how old most students in this grade are.
- **`ms-religious-identity-and-attendance-by-age`** — Reported attendance at religious services
  - lane: Inner life & meaning · kind: A common pattern
  - what we can say without a number: “Attending religious services at least monthly is reported at a higher rate in the oldest adult band of a national survey than in the youngest, but that is a comparison between bands at one moment, the bands in between are not described, and no source fetched in this pass supports reading it as a change that happens across a life.”
  - **query that would resolve it:** Needed: a source that follows the same birth cohorts across survey dates and gives a verbatim sentence naming the ages at which religious practice changes within a cohort. The Religious Landscape Study compares two age bands at a single moment, and the same report's cohort analysis states that cohorts have not become more religious as they aged, so it cannot support a life-course window in either direction. Candidates to fetch: General Social Survey cohort trend tables on gss.norc.org; Pew cohort analyses on pewresearch.org that report the same cohort at two survey dates.
- **`ms-remaining-years-at-sixty-five`** — Years of life still ahead for people who reach sixty-five
  - lane: Body & health · kind: A common pattern
  - what we can say without a number: “Nationally, people who reach sixty-five have a further average span of remaining years, but the source states that span as remaining years and does not state the age it reaches.”
  - **query that would resolve it:** The national mortality data brief from the National Center for Health Statistics prints remaining life expectancy at age sixty-five in years, but it does not print the age that span reaches. Needed: a source that itself states the reached age, such as a life table narrative or a Health, United States table caption giving the age rather than the remaining years, so no arithmetic is performed by the timeline.
- **`ms-sense-of-purpose-across-adulthood`** — Reported life satisfaction and sense of purpose shift across adulthood
  - lane: Inner life & meaning · kind: A common pattern
  - what we can say without a number: “Self-reported life satisfaction is often described as dipping somewhere in midlife and rising again in later life, but no source fetched in this pass gave a verbatim sentence naming the ages at which it turns, so no window is asserted.”
  - **query that would resolve it:** Needed: a nationally representative United States source reporting a life-satisfaction or sense-of-purpose measure by single year of age or by narrow age band, with a verbatim sentence naming the ages at which the measure is lowest and highest. Candidates to fetch: CDC BRFSS life satisfaction module tabulations on cdc.gov; the Health and Retirement Study data book on hrs.isr.umich.edu; NORC General Social Survey trend reports on gss.norc.org. Pew and Gallup summaries are acceptable only with the primary survey named.

<!-- TIMELINE-RESEARCH-REQUIRED:END -->

### 0.3 Where the timeline is thin, and I would rather say so

**0.3.1 Coverage is not uniform across the eight lanes.** Civic and legal is dense
(rules with ages in them are the easiest thing on the internet to source verbatim);
inner life and meaning is the thinnest, because almost nothing in it is measured as an
age. That imbalance is a fact about what is measured, not about what matters, and the
timeline should not be read as saying the well-sourced parts of a life are the
important parts.

**0.3.2 The exported FILE is over the size budget; the DOCUMENT is not.** §3.2 sets a
1 MB budget on the exported `/timeline/index.html`. That file is **2,331 KB**, and it
splits in two:

- **the document — 921 KB** — the HTML a reader, a screen reader and a crawler
  actually consume. This is **under** the budget.
- **the hydration payload — 1,410 KB** — the serialized copy of the same tree that
  Next's App Router embeds so the drawn instrument can hydrate.

Gzipped, which is what crosses a wire, the whole thing is about 190 KB.

Getting here took three passes, and the middle one is worth recording because it was
wrong in an instructive way. The first build rendered a full evidence drawer in every
year a window covered — 833 drawers, 7.59 MB — because §3.5 item 4 specifies that
section as *compact* and the build had ignored the word. Collapsing to one full entry
per record fixed the size and **broke a wall**: a reader-persona pass found sensitive
records losing their care note and their route to the real page in most of the years
they cover, which §5.3 forbids outright. Restoring the full entry everywhere fixed the
wall and pushed the document itself to 1,559 KB.

What holds now splits the material by what it is FOR. The **protective** part of a
sensitive record — the care note, the action line, the route to the real page —
repeats in every year it covers, because that is what a frightened reader needs
wherever they land. The **bibliographic** part — the excerpts, the stamps, the source
list — renders once, at the record's anchor, and the repeats link to it.

What remains over budget is the hydration payload, and it cannot be cut without
cutting something LITERAL: §3.5 item 4 requires *every* window covering a year to be
listed in that year, and §3.6's graphical floor makes the client instrument
non-cuttable. The tension between those two and §3.2 is recorded as a finding against
the blueprint (`DECISIONS.md` §4A, F-8).

**0.3.2b The sex lens covers only what sources state they measured.** Where a source
does not say whether it measured sex at birth or self-reported gender, the record
carries no divergence at all, even where one plausibly exists. The lens note reports
the true count. This is deliberate under-claiming.

**0.3.2d From most years, leaving the timeline takes two clicks rather than one.**
A record's full entry — with its link to the real page — renders once, at its anchor
year; in the other years it covers, the compact line links to that anchor. So from a
year in the middle of several long windows, the reader's first click moves them to a
different age rather than off the timeline. A reader-persona pass counted sixty-five
of a hundred and one years with no link to anything outside the timeline.

Sensitive records are the exception and were made so deliberately: they carry their
care note and their route to the real page in **every** year they cover, because that
is the case where one click has to be enough. That fix is the reason the document is
921 KB rather than 767 KB, and it is the right place to have spent the bytes.

Extending the same treatment to every record would restore the page-weight problem
described above. The honest options are to accept two clicks for non-sensitive
material, or to carry a bare `readRef` link (without the drawer) on every compact
line — a smaller addition than the sensitive treatment, and not attempted here.

**0.3.2c A few records encoded a COMPARISON as a window — FIXED in the fix pass, and
the class closed rather than the instances.** The acceptance review named four records
whose window was the span BETWEEN two age bands being compared, so that a true figure
about one band rendered beside every year in between ("commonly around 75" at age
thirty-four). They were re-authored through the pipeline, with every source
re-fetched; a scan of the whole pool for the same signature — a window of ten years or
more whose typical zone is a single point sitting on one END of it — found three more,
and they were re-authored with them. The scan now returns nothing.

Each band a source names is now its own record, and each window is that band and
nothing wider. `DECISIONS.md` section 6 has the before-and-after table;
`records/research-pipeline.md` has the re-fetch verdicts.

What is still true, and is the honest residue: **records still vary a lot in how many
years they cover**, and the widest are the ones whose source band is open-ended at the
top. A band published as "seventy-five and older" becomes a window that runs to this
timeline's own ceiling, because that is what the band covers; those records say so in
their notes. That is a wide window the source really does state, which is a different
thing from a window drawn across a gap.

One consequence worth stating plainly: the saying about savings rules of thumb had
borrowed a brokerage's published ages and stretched them across most of adult life,
and that borrowed window had been the only thing keeping the early forties from
running four years with nothing discrete in them. Removing it turned T-7 red, which is
the gate working. One record was authored to meet it honestly rather than the gate
being adjusted — `ms-founding-a-business-mean-age` — and the early forties are now
carried by a measured age that actually falls there.

**0.3.3 Every figure is a snapshot of a moving thing.** Median ages at first marriage
and first birth have moved for decades and are still moving. Each record shows its own
data year, and the page says so, but a reader who returns in five years will be reading
history unless the sources are refreshed. The corrections register gains a
`source-change` kind for exactly this.

**0.3.4 A timeline of windows can still be read as a schedule.** This is published on
`/methodology` as a known break in the frame, because it is true and no amount of
labelling fully prevents it.

---

# The 4.0 list, carried in full


## 1. Release gates the owner must close (carried from 4.0)

These are not defects. They are decisions and verifications only the owner can
make, and the build ships behind them.

**1.1 Hotline verification (carried from 2.0/3.0) — CLOSED 2026-09-04.** Every number
in `content/hotlines.ts` was checked against the official page for its service during
the publish pass and every number held; the owner signed the check off. Five recorded
source addresses had gone stale or never stated the number and were replaced by the
page that does. The fixture is stamped `verified`, dated, and the help-now page reads
its date from the fixture. The check itself is recorded in `DECISIONS.md` §7.

**1.2 Professional review — carried.** `/situations/depression`,
`/situations/a-death`, `/situations/grief` need clinical review;
`/situations/being-hurt` and `/threshold/supporting-someone` need specialist
domestic-abuse/crisis review. These pages ship byte-identical to 2.0.

**1.3 Professional review — carried from 3.0.** The 3.0 scripted beats
(`content/play/beats.ts`) and the board's crisis short-circuit
(`components/Board.tsx`) are on the review list.

**1.4 Professional review — NEW IN 4.0, and the most important new gate.**
`content/sim/campaign/beats.ts` adds **two new scripted beats** to the loss-tier
channel, and both need the same clinical/specialist review as the pages above
before launch:

- `beat-low-season` — a flat stretch, naming `/situations/depression`.
- `beat-someone-ill` — someone close becoming seriously ill, naming
  `/situations/a-death`.

They are placed deterministically, are always skippable, render reduced-frame, and
are never previewed on any surface. That is the containment. It is not a substitute
for a professional reading of the prose itself.

**1.5 The parse's real-world bridge (§3.9, §5.6).** The bridge's SELECTION RULE —
not only its wording — goes to the owner read. The rule, in full: `selectBridge`
takes a campaign id and nothing else, so the closing line is the same for every run
of a campaign and nothing about a particular run can reach it. The six templates
are in `lib/sim/parse.ts`. Both the rule and the templates want the owner's eye,
because this is the one place the fiction speaks to the person rather than the
character.

**1.6 The art-direction checkpoint (§12.2).** The Phase 2 vertical slice shipped at
final art precisely so this review is real, and Phase 3 then scaled it. Screenshots
of every play surface, both themes, both viewports, are in `screenshots/`. If the
art direction is wrong, it is wrong across the whole campaign now, and that is the
consequence of the blueprint's own sequencing — worth saying plainly.

---

## 2. What the model does not know

**2.1 Nothing here is calibrated.** The `calibrated` evidence label is defined and
**deliberately unused** — S-3 fails the build if any record claims it. Every rule in
the sandbox is `evidence-informed`, `illustrative`, `speculative`, `contested` or
`insufficient-evidence`. The research-calibration pass (spec §17 Phase 4) is not
done and is not pretended to be done.

**2.2 The economy's values are authored, not measured.** The pip table, the debt
thresholds, the rest conversion, the pile-up caps — every number is a design
choice. They are published in full on `/methodology` so they can be argued with,
which is the most that can honestly be claimed for them.

**2.3 One campaign, one place, one decade.** *Launch Window — United States 2025*
is a model of a set of early-adult tradeoffs. It is not a census-average life, not
a claim about how common anything is, and not transferable to another country or
era without the research pass that would make it honest.

**2.4 The satisfaction measure is a balance instrument.** `lib/sim/satisfaction.ts`
exists so S-10 can ask whether any way of playing dominates. It is documented on
`/methodology`, it is never rendered in play, no component imports it, and there is
deliberately no function anywhere that sums its ten readings. It is not a claim
about what a good life is.

---

## 3. Deferred by decision (§12 — the owner's open list)

**3.1 Scenario Runs as a fourth mode.** Deferred; the campaign's event arcs and the
Lab cover the ground.

**3.2 Personal character creation / self-insertion.** Deferred *indefinitely* and
FORBIDDEN until the owner explicitly revisits it. Hands come only from Birth RNG or
the five labelled-fictional presets; S-6 asserts there is no third route.

**3.3 "Attention" as a literal fourth budget currency.** Folded into energy and
time-structure per §2.3.8. Reversible if the owner wants it literal.

**3.4 Archetype resemblance.** Carried deferral from 3.0; the research gate
applies. Roles are covered by companion arcs, obligations and constraint flags.

---

## 4. Where the build is thin, and I would rather say so

**4.1 The Decision Lab ships four situations, not the eight-to-twelve §7.3
contemplates.** Four is inside the blueprint's Phase-1 range (three to five) and
short of the Phase-3 recuration target. The three axes each have at least one
situation that teaches them, and the recuration to eight-to-twelve is real work
that did not happen.

**4.2 The draw-vary axis teaches only half of G-09.** The adversarial review of the
Lab seed curation was right about this and it is not fully fixed. Every shipped
draw-vary pair separates, because the alternate seeds were searched for pairs that
do. So the lesson "the move set the range, the draw landed inside it" is reachable
and its honest twin — "identical choices, different luck, and the same result
anyway, because this move's range is narrow" — is not, in any shipped situation.
The reading exists in the code and never renders. The fix is to ship one draw-vary
pair curated to land the same; `lab-the-repair` is the natural candidate.

**4.3 The Lab curation is not disclosed to the reader.** `/methodology` publishes
the economy, the resolution order, the pile-up physics, the attribution rule, the
balance method and the satisfaction measure. It does not yet say that the Lab's
alternate draw-seeds were searched for pairs that separate. It should.

**4.4 Below a certain budget the nine one-pip "small moves" carry the bottom of the
economy.** S-10's telemetry reports this rather than hiding it: across 12,600 fleet
seasons the worst authored-pool count beyond the small-move tier is five, so the
sandbox is genuinely open everywhere — but the *shape* of the bottom is small
moves, because the rest of the pool's cheapest tier costs two pips. That is
defensible design (when a season has one pip, small moves are what a season has)
and it is also a thing to keep an eye on if the pool grows.

**4.5 Companion arcs are two per run.** Every campaign is dealt exactly two of the
six arcs. The pool is six; a run meets a third of it. That is deliberate — a life
does not have six trajectories running at once — but it means replay value in the
companion layer depends on starting again, and a single run will not show most of
what was written.

**4.6 The compressed season flow is a briefing signal, not a separate screen.** The
briefing computes a `quiet` flag and says so, and standing commitments reduce what
a season asks of you. §3.4b's "repeat-last-allocation with a delta-only briefing"
as a distinct control is not built. Twenty-four seasons is still twenty-four
briefings.

**4.7 No accessibility audit by a person.** Every canonical instrument carries a
text/DOM equivalent (§4.1) and S-9 checks contrast, tap targets and clipping across
every play surface in both themes at three viewports, and S-4 completes a season, a
fork and a Lab comparison keyboard-only. None of that is the same as a screen-reader
user trying it. The blueprint asks for the rule to be designed in rather than
discovered at the end; it was. It has not been confirmed by anyone who needs it.

**4.8 The Life Arc kept its slot structure.** §3.2 sanctioned exactly five deltas
and all five are done — the §2.2 fix, the visual overhaul, the constraint profile,
the priority instrument, and named saves. *The named-save delta was claimed here
before it existed;* the pre-handback review caught the false sentence, and the
feature was then built rather than the claim quietly softened: `lib/engine/persist.ts`
carries a named list capped at eight, resumable and deletable, with the same
migration honesty the campaign uses, and the resume gate offers "keep this one and
start another" instead of overwriting a life in progress. Its acts, beats and
47-card pool are otherwise as 3.0 shipped them, including their own limitations.

**4.9 A long run still rereads a line, four or five times at the outside.** The
rotation guarantees a line cannot return until its pool is exhausted, and every
pool on an unconditional whole-window repeatable is six deep or more. But a
twenty-four-season run makes about a hundred and ten resolutions, and a player who
takes one action every season will see its band's pool cycle three times. Measured
across six full runs after the variant work: 104–108 lines, 59–60 distinct, worst
line ×4–5. Before the pass it was ×24 — the season-end rest-conversion line, which
was a single string outside the rotation entirely and rendered in every season of
every run. §10's literal wording is "repeated actions never repeat outcome text
verbatim in one run", and that is not achievable at this run length without pools
roughly four times deeper. What ships is the strongest honest version: maximum
spacing, and no line back until every other line has had its turn.

**4.10 Three of the four Lab situations still teach only two axes.** The choice-vary
axis now varies exactly one decision (it used to swap the whole window while the
screen said one decision differed), and a gate asserts that each axis isolates what
it names. But `decisionStep` defaults to the first step everywhere, because no
situation has yet been authored with a later decision as its pivot, and the
recuration to eight-to-twelve situations in §4.1 is still the real work that did not
happen.

---

**4.11 Twenty-five gate assertions are still not falsifiable.** A falsifiability
audit — ten hunters, one prover per candidate, 57 agents — confirmed thirty-one
assertions across the suites that cannot come back red if the thing they guard
breaks. Six are fixed, chosen by what they guard: runtime beat-channel isolation,
the text-spill check that was blind to the owner's own §2.2 defect class, the
scroll-region and tap-target exemptions beside it, the adversarial floor gate, and
two in the browser suite including one that passed the literal `true`. **The other
twenty-five are open**, each with the prover's probe and a corrected assertion, in
`records/gate-falsifiability-audit.md`. None of them is a defect in the product:
they are places where a green result means less than it reads. Weight them that
way when reading any gate summary, including this build's own.

---

## 5. An authoring constraint for whoever comes next

The adversarial verifier of the family-companion batch left a warning worth
carrying forward rather than losing in a transcript. The caring-duty thread stays
inside the loss-tier boundary **only because its referent is never named** — the
records say "the family admin", "the appointment and the paperwork behind it",
"an office that never picks up", and never a person or a condition. If a later
batch identifies that appointment with Diane, who is a live companion in the same
file, those records retroactively become loss-tier setup.

**Keep the referent unnamed.**

---

## 6. The 3.0 limitations, carried

Everything in the 3.0 list still applies except where a 4.0 entry above supersedes
it. In particular: the sim is a model and not a prediction; the content pool is
authored rather than researched; local-only state means a cleared browser is a lost
run and the erase control says so; and the site has no accounts, no analytics and
no server, which is a feature and also means there is no way to recover anything.
