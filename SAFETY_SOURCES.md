# SAFETY_SOURCES.md — the standing record behind every number on the help-now page

**What this is.** One entry per region the hotline fixture claims to serve, with the
numbers as `content/hotlines.ts` prints them, the official page each was checked
against, the date of that check, what the page does and does not say, and what a
reader sees if the entry goes away. It is a document that gets re-read before a
release, not a sign-off that scrolls away inside an audit.

**Why it is separate from the fixture.** The fixture carries `sourceUrl` and
`lastVerified` per record, which answers "when" but not "against what, and with what
caveats". A number's most load-bearing field is who it actually serves, and the
scope caveats are where that gets decided — `0808 2000 247` was labelled *United
Kingdom* in this repository for three versions because the service's own front page
does not say which nation it serves.

**Provenance of the dates below.** Every date and every source address here is
transcribed from `content/hotlines.ts` and from the retrieval records that produced
it: the publish pass of 2026-09-04 (`DECISIONS.md` §7, "HOTLINE GATE CLOSED"), and
consolidation batch 1's twelve retrievals plus the reviewer's thirteenth
(`records/research-pipeline.md`, "Consolidation batch 1"). **Nothing on this page was
fetched while writing this page**, and a transcription is not a verification. The
next verification pass replaces these dates with its own.

**Coverage is the stored fact; the printed label is derived from it** (`regionsLabel`
in the fixture, N-260). So this record is organised by coverage value, not by the
sentence a reader sees. C-7 ties the two: every coverage value any record claims must
have an entry below, dated no older than that record's `lastVerified`.

---

## The maintenance rule

- **A routing or a label change is not a re-verification.** If a service renames
  itself, moves its page, redirects an old address, or restructures the site, the
  entry's `Checked` date does not move. Only reading the number, the availability and
  the served region off the official page moves it. This is the rule the record exists
  for: the cheap change is the one that looks like diligence.
- **A region that cannot be verified is removed from the fixture**, not left with a
  stale number and a hopeful date. The reader is then shown the explicit directory
  fallback for that region instead — a number nobody currently stands behind is worse
  than an honest referral, because the reader spends the one call they could safely
  make.
- **This record is re-read before every release**, alongside the fixture, and any
  entry whose date has aged past the release's tolerance is either re-checked or
  removed under the rule above.
- **A disagreement between two official sources is recorded, never resolved
  silently.** The Welsh helpline is the standing example (see *Wales*).
- **A number is never typed from memory, from another site, or from a prototype.** A
  figure in an archived prototype is a claim to re-source, never a source
  (blueprint 6.0 §4).

---

## England

- Numbers as the fixture prints them: **999** (emergency services) · **116 123**
  (Samaritans) · **0808 2000 247** (National Domestic Abuse Helpline).
- Checked: 2026-09-04
- Pages checked: `https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/`
  · `https://www.samaritans.org/how-we-can-help/contact-samaritan/`
  · `https://www.gov.uk/guidance/domestic-abuse-how-to-get-help`
- Scope caveats: the abuse line's own front page states the number and its
  availability but **does not say which nation it serves**; the GOV.UK guidance page
  is what places it under England, and lists separate lines for the other three
  nations. That is the whole basis of the England label, and it is the reason the
  label is derived from `coverage` rather than typed.
- Fallback if this entry is withdrawn: the directory row (findahelpline.com) in both
  the crisis and the abuse groups; the emergency number is not withdrawn.

## Scotland

- Numbers as the fixture prints them: **999** · **116 123** · **0800 027 1234**
  (Scotland's Domestic Abuse and Forced Marriage Helpline).
- Checked: 2026-09-04
- Pages checked: the NHS 999 page · the Samaritans contact page ·
  `https://sdafmh.org.uk/`
- Scope caveats: the service's own page states the number and round-the-clock
  availability. Scotland runs its own line; the England number is not a fallback for
  it and must never be labelled as covering it.
- Fallback if this entry is withdrawn: the directory row, filtered for abuse.

## Wales

- Numbers as the fixture prints them: **999** · **116 123** · **0808 80 10 800**
  (Live Fear Free).
- Checked: 2026-09-04
- Pages checked: the NHS 999 page · the Samaritans contact page ·
  `https://www.gov.wales/live-fear-free/contact-live-fear-free` (and, on the same
  check, the Welsh Government's second Live Fear Free page and Welsh Women's Aid,
  which operates the line).
- Scope caveats: **two official sources disagree on the digits.** GOV.UK prints one
  number for this service; the Welsh Government prints another. Three official pages
  (two Welsh Government, one from the organisation that runs the line) agree on the
  number the fixture carries; GOV.UK's is treated as that page's error. The
  disagreement is on the pages, not in the reading, and it is recorded rather than
  smoothed away. **This is the one entry a reviewer should check before the label
  ships to readers.**
- Fallback if this entry is withdrawn: the directory row, filtered for abuse.

## Northern Ireland

- Numbers as the fixture prints them: **999** · **116 123** · **0808 802 1414**
  (Domestic and Sexual Abuse Helpline).
- Checked: 2026-09-04
- Pages checked: the NHS 999 page · the Samaritans contact page ·
  `https://dsahelpline.org/`
- Scope caveats: the service's own page states the number, its availability and that
  it serves Northern Ireland. It covers sexual abuse as well as domestic abuse, which
  the fixture's label does not spell out; the page does.
- Fallback if this entry is withdrawn: the directory row, filtered for abuse.

## Ireland

- Numbers as the fixture prints them: **999** · **116 123** · **1800 341 900**
  (Women's Aid National Freephone Helpline).
- Checked: 2026-09-04
- Pages checked: `https://www2.hse.ie/emergencies/when-to-call-112-or-999/` and
  `https://112.ie/what-is-112/` for the emergency number · the Samaritans contact
  page · `https://www.womensaid.ie/`
- Scope caveats: Ireland is **not** in the United Kingdom, and the fixture's derived
  label must never fold it in. The Irish emergency number was checked on Irish
  sources because gov.ie, garda.ie and citizensinformation.ie returned errors to the
  batch that checked it. The abuse helpline named here is a women's service; the
  fixture does not claim it serves everyone, and a reader who is not served by it is
  carried by the directory row.
- Fallback if this entry is withdrawn: the directory row, filtered for abuse.

## United States

- Numbers as the fixture prints them: **911** (emergency services) · **988**
  (988 Suicide & Crisis Lifeline, call or text) · **1-800-799-7233** (National
  Domestic Violence Hotline).
- Checked: 2026-09-04
- Pages checked: `https://www.911.gov/` · `https://988lifeline.org/` ·
  `https://www.thehotline.org/`
- Scope caveats: `988lifeline.org` is the **US** service's page. It is the source for
  the US claim and not for any other country's; see *Canada*.
- Fallback if this entry is withdrawn: the directory row.

## Canada

- Numbers as the fixture prints them: **911** · **988**.
- Checked: 2026-09-04
- Pages checked: `https://www.canada.ca/en/public-health/services/health-promotion/stop-family-violence/services.html`
  for the emergency number · `https://988.ca/` for the crisis line.
- Scope caveats: the same three digits reach a **different service** here — Canada's
  9-8-8 Suicide Crisis Helpline, not the US Lifeline whose name the fixture's label
  carries. The fixture carries a note saying so, because a label that names one
  country's service while covering two is the same defect as a label broader than its
  coverage. The Canadian regulator's own page returned an error to the batch that
  checked it; the Government of Canada page and the service's own page were used.
  There is no separate Canadian abuse line in the fixture; that gap is carried by the
  directory row and should be closed by a future pass.
- Fallback if this entry is withdrawn: the directory row.

## Australia

- Numbers as the fixture prints them: **000** (emergency services) · **13 11 14**
  (Lifeline) · **1800 737 732** (1800RESPECT).
- Checked: 2026-09-04
- Pages checked: `https://www.infrastructure.gov.au/triple-zero` ·
  `https://www.lifeline.org.au/` · `https://www.1800respect.org.au/`
- Scope caveats: the previously recorded emergency source (`triplezero.gov.au`) had
  become a redirect and was replaced by the department page that states the number —
  a replacement, which is a re-verification, not a routing change.
- Fallback if this entry is withdrawn: the directory row.

## European Union

- Number as the fixture prints it: **112** (emergency services).
- Checked: 2026-09-04
- Page checked: `https://europa.eu/youreurope/citizens/travel/security-and-emergencies/emergency/index_en.htm`
- Scope caveats: this is the single emergency number across the Union. It is not a
  crisis line, an abuse line, or a bereavement line, and the fixture does not present
  it as one.
- Fallback if this entry is withdrawn: the directory row; the reader's own national
  emergency number is not something this site can supply for every country.

## Many other countries

- Number as the fixture prints it: **112**.
- Checked: 2026-09-04
- Page checked: the same Your Europe emergency page.
- Scope caveats: this is deliberately the vaguest claim in the fixture, and it is
  vague because the honest version is vague — 112 reaches emergency services well
  beyond the Union, and no single official page enumerates where. The label claims
  reach without claiming completeness. **A vagueness is allowed; a false precision is
  not.**
- Fallback if this entry is withdrawn: the directory row.

## Many European countries

- Number as the fixture prints it: **116 123** (emotional support line).
- Checked: 2026-09-04
- Page checked: `https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32009D0884`
- Scope caveats: the source is the Commission decision **reserving** this number for
  emotional-support helplines across the harmonised range. A reserved number is not
  the same as an operating service: whether a given country has activated it, and who
  answers, is not established by this source. The label says "many", not "all", for
  that reason — and this is the entry most likely to be wrong for an individual
  reader, which is why the directory row sits below it.
- Fallback if this entry is withdrawn: the directory row.

## Anywhere else

- As the fixture prints it: **findahelpline.com** — verified lines by country, and a
  version of the same directory filtered for abuse.
- Checked: 2026-09-04
- Page checked: `https://findahelpline.com/`
- Scope caveats: this is the fixture's own fallback, and it is a third party. The
  help-now page says plainly that the directory is maintained and verified
  continuously while this page is not. It is the row every other row falls back to,
  so it is the row whose removal would leave a reader with nothing — it is not itself
  removable under the maintenance rule without replacing it.
- Fallback if this entry is withdrawn: none. Fix the entry instead.

## Everywhere

- As the fixture prints it: **the lines above** — most of them will talk to a
  bereaved caller; they are not only for emergencies.
- Checked: 2026-09-04
- Page checked: `https://findahelpline.com/` (the row makes no claim of its own beyond
  pointing back at numbers already recorded above).
- Scope caveats: this row carries **no new number**. Its claim is about what the lines
  already listed will do, and it is the site's own judgement rather than a quotation
  from any service's page. It is the weakest-sourced row in the fixture and is written
  as an invitation, not as a guarantee.
- Fallback if this entry is withdrawn: the bereavement directory filter below.

## Anywhere

- As the fixture prints it: **findahelpline.com** — bereavement filter.
- Checked: 2026-09-04
- Page checked: `https://findahelpline.com/topics/grief-loss`
- Scope caveats: the previously recorded address for this filter had gone dead and was
  replaced by the topic page that exists — again a replacement, not a routing change.
- Fallback if this entry is withdrawn: the general directory row.

## Most countries

- As the fixture prints it: **a local hospice or palliative service** — most offer
  bereavement support to anyone, not only to families of their own patients.
- Checked: 2026-09-04
- Page checked: `https://findahelpline.com/topics/grief-loss`
- Scope caveats: this row is a **pattern, not a number**, and its label says so. The
  page checked does not establish the pattern country by country; it is the site's own
  judgement, offered because a reader who does not know that hospices take outside
  callers will not think to try one. If that judgement is challenged, the row goes
  rather than acquiring a citation it does not have.
- Fallback if this entry is withdrawn: the bereavement directory filter.

---

## Known gaps in this record

- Canada has no domestic-abuse line of its own in the fixture; the directory row
  carries it.
- The bereavement group's three rows are the site's own judgement rather than
  service-page claims, and are marked as such above.
- `HOTLINE_LAST_VERIFIED` in the fixture is a single date for the whole file. It
  cannot distinguish a record re-checked in the last pass from one carried forward,
  and the per-record `lastVerified` is what carries the truth. This record is where
  the distinction is legible.
