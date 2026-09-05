# Content authoring brief — TGTL 4.0 *Launch Window*

The binding rules for every action, event, and companion arc in the campaign.
Every batch is authored against this, adversarially verified against it, and read
in the rolling human review before it is listed in `content/sim/registry.ts`.

## The world

*Launch Window — United States · 2025.* Ages 18–30 in **24 six-month seasons**.
The player directs a life under a real budget while life also happens to them.
Fictional and replayable — not a census-average American life, not a prediction,
not advice.

## THE WALLS — a violation here is a release blocker, not a note

### Crisis tier — never anywhere, in any field, in any form
Abuse and coercive control · self-harm and suicide · sexual violence · acute
psychiatric crisis. Never an action, an event, a consequence, a companion
behaviour, or flavour. Not obliquely, not as backstory, not as something a
character "got out of". These route to the real safety pages; they are never
played. **Do not write around the lint — if a line needs a euphemism to pass, the
line is the problem.**

### Loss tier — never in your batch at all
Death · serious illness · the character's end · depression. These live ONLY on the
separate beat-schedule channel (`content/sim/campaign/beats.ts`), which you are
not authoring. Your records must not reference them, imply them, or set them up.

### The capacity-event boundary — where health-adjacent content may go
A playable capacity event is limited to a **non-life-threatening,
non-diagnosed, recoverable-or-manageable reduction expressed in function, access,
energy, or support terms**, with bounded severity and duration.

- NO named diseases, NO diagnosis, NO mortality or terminal framing.
- NEVER another person's serious illness (that is loss tier, beats only).
- Write it as: what is harder this season, what it costs, what helps.
- Good: "Your back goes. Six weeks of not lifting anything, and a physio
  appointment you have to leave work early for."
- Forbidden: naming a condition, implying a prognosis, a miracle cure, a health
  bar, an appearance penalty presented as worth, or blame for the state you are in.

### Companion behaviour — the never-command five
The player may influence **communication, reliability, repair, boundaries, and
exposure**. The player may NEVER command **attraction, consent, forgiveness,
loyalty, or commitment**. No option may be phrased as making someone feel
something, and no band may deliver "they forgive you" as a reward for a correct
input. People can refuse and leave, and that is a legitimate outcome, not a
failure state. No compatibility scores. MBTI is never a mechanic.

### The reader is never the subject
Content addresses the CHARACTER in second person. It never characterises the
player, their tendencies, their patterns, or their real life. No score, no grade,
no streak, no comparison, no "players who..." — nothing.

### No numbers
**No numeric probabilities, percentages, statistics, or invented figures anywhere
in a rendered string.** Spell out any small count as a word ("three seasons").
Years (2025) are fine. Money is qualitative: "rent-and-a-bit", never a figure.

## Voice

Second person, present tense, concrete, warm-realist, unsentimental. Plain,
unshowy register; no exclamation marks, no jokes at the character's expense, no
moralising, no "lesson learned" summary lines. A consequence line is **≤ 40
words** and says what happened, not what it means. A scene is **≤ 60 words**.
Failure is diagnostic, never a verdict on the person.

**American English, because the campaign is set in the United States.** This rule
used to read "British-ish plain register", which is how a US-set campaign ended up
with rotas, fortnights, flats, petrol and pavements in its prose — corrected by
`tools/localize-us.mjs`, which is still there and still runs clean. Write
apartment, schedule, two weeks, gas, sidewalk, drugstore, mailbox, takeout, cell
phone; write color, honor, realize, license, program, practice, learned. A word
that is ordinary in both varieties ("autumn", "shop") is fine and is left alone.

Edition-neutral: write once, in language that reads naturally in both the Standard
and Game Guide editions. Never write "quest", "XP", "level", "stat", "buff",
"debuff", "boss" — the edition layer supplies game vocabulary, not you.

## Design rules

- **No dominant option.** Every option must be the right call for some priority
  set and the wrong one for another. If one option is better on every axis, the
  card is broken.
- **2–4 options per record. 2–3 bands per option. At most one band marked
  `failure`.** Band weights are relative positive numbers.
- **Costs are 1–3 pips** across `timeStructure` / `energy` / `money`. Most actions
  cost 2–4 pips total. Cheap actions should be genuinely weaker, not free wins.
- **Any option flagged `endurance` MUST carry a `supportLink`** to a real route.
- **Recovery ties:** every action that can land a `failure` band MUST have a tie —
  either a `recovery`- or `endurance`-flagged option of its own, or `recoveryRefs`
  naming actions that are honest recoveries from *that specific* failure. Not
  "rest" for everything; the recovery must fit the failure. The always-available
  floor route does NOT count as the tie, and neither gate counts it.

- **`noRecoveryTie` is NOT a way out of that.** It is for a card where another
  person refuses, withdraws, or leaves. Their decision is not a setback the
  character recovers from, and rendering a way on from it would put someone's "no"
  on the board as a problem to be solved. So such a card marks **no `failure` band
  at all** — and `noRecoveryTie: { reason }` records why, in your words, on the
  record. Declaring it while marking a failure band is a hard build failure: the
  field asserts there is nothing to recover from, and a failure band says there is.
  If a card genuinely has a failure the character can recover from, author the tie.
- **Repeatable actions need `outcomeVariants`, and the pool is OPTION-NEUTRAL.**
  `outcomeVariants` is keyed by BAND NAME and is shared by *every option* of the
  action. `lib/sim/resolve.ts` builds the rendered pool as
  `[the chosen option's own band line, ...the action's variants for that band]`
  and walks it by occurrence ordinal. So a line written for `solid` will be
  rendered after **any** option that can land `solid`.

  **Every variant line must read true whichever option the player took.** Write
  the shape of the outcome, not the method. A line that only makes sense after one
  option narrates an action the player did not take — that is a correctness defect,
  not a style note. Test each line against every option before you keep it.

  **Never put an option's own band line into the variant pool.** The engine already
  puts it at the front, so a copy renders twice as often as anything else *and*
  leaks that option's specific narration to every other option.

  **Depth:** the rotation guarantees a line cannot come back until the pool is
  exhausted, so the pool depth *is* the anti-repetition guarantee, and it has to
  scale with how often the action can be taken. An action that is repeatable,
  unconditional, and available across a twelve-season-or-wider window can be taken
  every season, so it needs **five variants per band** (six lines with the option's
  own). Everything else repeatable needs **one per band** (two lines). S-3 fails the
  build on a short pool, a duplicated pool, and a pool containing a base line.

  **No padding.** Because the engine rotates rather than hashes, a repeat player is
  *guaranteed* to read every line in the pool. Two lines expressing the same event
  are a visible repeat. Each line is a distinct concrete way the season went.
- **`seasonBands`** are the inclusive season ranges (1–24) where a record may
  appear. Honour your batch's window. Late-window content (13–24) must be about
  the questions of ages 24–30 — consolidation, redirection, what you are now
  carrying — not warmed-over ages 18–24.
- **`evidenceLabel`** is one of `evidence-informed` (direction supported, value is
  abstraction), `illustrative` (teaches a tradeoff), `speculative`, `contested`,
  `insufficient-evidence`. **`calibrated` is reserved and must never be used.**
- **`readRef`** must be one of the real routes listed below.

## The available vocabulary — use ONLY these ids

**families**: `home` `school` `threshold` `work` `money` `people` `health` `civic` `inner`

**domains** — the tags that decide which PRIORITY a card serves. Use only these.
A card may carry several. This is not decoration: `actionServes` in the parse and
the internal balance measure both read it, so a card tagged with nothing from this
list serves no priority at all, and a player who says that priority matters can
never spend a season on it. That is exactly what happened before this list
existed — the match was a substring guess against a short hardcoded word list, and
thirty-six of the pool's seventy-seven tags hit nothing, including `institutions`,
`education`, `people`, and (by accident of spelling) `mastery` and `creativity`
themselves. **S-3 fails the build on a tag that is not in the map, and on a map
entry no record uses**, so adding a tag means adding its meaning in the same
change. The full map is published on `/methodology`.

- **safety & stability** — `money` `tax` `paperwork` `liability` `housing` `home` `place` `stability` `safety` `access` `logistics` `planning` `maintenance` `long-horizon` `institutions`
- **health & energy** — `maintenance` `health` `capacity` `sleep` `habits`
- **close relationships & family** — `relationships` `people` `family` `friendship` `neighbors` `support` `care` `caregiving` `repair` `conflict` `boundaries` `commitment` `obligation` `responsibility`
- **autonomy & flexibility** — `opportunity` `place` `distance` `boundaries` `autonomy` `optionality` `adaptability` `scheduling` `time` `exit` `fit`
- **mastery & achievement** — `mentorship` `learning` `education` `school` `skill` `skills` `craft` `trades` `mastery` `credential` `credentials` `portfolio`
- **wealth & material comfort** — `work` `income` `money` `tax` `markets` `market` `search` `negotiation` `leverage` `advancement` `material` `opportunity` `credential` `credentials`
- **service & contribution** — `care` `caregiving` `responsibility` `mentorship`
- **creativity & expression** — `craft` `portfolio` `creative` `creativity` `making`
- **recognition** — `negotiation` `leverage` `advancement` `recognition` `reputation` `presentation` `authority` `management` `reliability`
- **meaning & peace** — `long-horizon` `meaning` `identity` `inner` `endings` `thresholds` `fit`

**gauges** (effects, band steps −2..+2): `money` `healthEnergy` `connection` `timeStructure`

**capabilities** (effects, fine steps −3..+3): `vitality` `learning` `execution` `regulation` `socialNavigation` `adaptability`

**budget currencies** (costs): `timeStructure` `energy` `money`

**variance**: `narrow` `moderate` `wide` `very wide`
**reversibility**: `reversible` `costly to undo` `locks in`
**band names**: `strong` `solid` `mixed` `poor` `failure`
**option flags**: `recovery` `endurance`

**readRef routes**: `/topics/work` `/topics/money` `/topics/health` `/topics/relationships`
`/map/launch` `/map/credential-decision` `/situations/job-loss` `/guidance`
`/walkthrough` `/threshold` `/history` `/methodology` `/character`

**existing skills** (add new ones freely, kebab-case): `study-habits` `academic-writing`
`shift-work` `budgeting` `caregiving` `logistics` `pacing`

**existing start flags** (do not invent new `start:` flags): `start:family-backstop`
`start:stable-housing` `start:no-backstop` `start:income-obligation` `start:enrolled`
`start:carrying-debt` `start:caring-duty` `start:place-bound` `start:interrupted-path`
`start:reduced-capacity`

**run flags** you may set/clear (kebab-case, invent freely): e.g. `has-credential`,
`employed`, `waitlist`, `coverage-gap`, `knows-the-route`, `relocated`

**conditions** (high-load set is fixed): `caring-duty` `second-job` `commute-heavy`
`unstable-housing` `reduced-capacity` — you may set/clear these, and may invent
other non-high-load conditions.

**companion arc ids**: `arc-parent-diane` `arc-friend-mo` `arc-coworker-ray`
`arc-sibling-tasha` `arc-mentor-okonkwo` `arc-neighbor-lu`

## Attribution — declare your inputs

`sensitivity` is what makes the explain drawer honest. Declare what actually moves
this option's odds, and the engine classifies it for you:

- `gauge` / `capability` / `skill` → **your accumulated state**
- `constraintFlags` (`start:` flags) → **your starting conditions**
- `companionFlags` → **other people's decisions**
- `systemicFlags` → **systems and institutions**

An option with no `sensitivity` still feels the character's global footing. Use
`strength` 0.3 (light) to 0.7 (heavy); default 0.5.
