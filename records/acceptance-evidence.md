# §10 acceptance evidence

Produced by `npx tsx tools/acceptance-evidence.ts`, from the shipped engine and
the shipped content. Everything below is output, not summary.

---

## The sandbox test

> *Two reviewers, same preset, different intents → visibly different seasons;
> neither path “the right one”.*

Same starting position (**Supported Explorer**), same seeds — so the hand and the
draws are identical. The only difference is what the two players are aiming at.

| season | player A — *mastery* | player B — *close relationships* |
| --- | --- | --- |
| 1 (age 18) | Read one thing properly · Wait, and keep your options · Sort out one room | Ask someone for help · Ask one question · Show up for someone |
| 2 (age 18) | Read one thing properly · Send one message · Actually look at the numbers | Keep the friendship going · Show up for someone · Ask someone for help |
| 3 (age 19) | Read one thing properly · Build the side thing · Deal with one piece of paperwork | Decide what long distance is · Ask someone for help · Keep the friendship going |
| 4 (age 19) | Read one thing properly · Ask one question · Commit to a year of practice | Show up for someone · Ask someone for help · Move back into your old room |
| 5 (age 20) | Read one thing properly · Wait, and keep your options · Send one message | Send one message · Keep the friendship going · Show up for someone |
| 6 (age 20) | Read one thing properly · Send one message · Ask one question | Set a limit with a friend · Ask someone for help · Try to repair the falling-out |
| 7 (age 21) | Read one thing properly · Move back into your old room · Answer the ask from family | Show up for someone · Send one message · Go to the family thing |
| 8 (age 21) | Read one thing properly · Rest and maintain · Send one message | Send one message · End the thing that is fine · Go to the family thing |

At thirty, the two ending signatures differ in **5 of 9** components
(the bar for "meaningfully different" is three): **PASS**.

What differs:

- `money:comfortable`  vs  `money:thin`
- `healthEnergy:comfortable`  vs  `healthEnergy:depleted`
- `timeStructure:thin`  vs  `timeStructure:comfortable`
- `held:act-rest-maintain+act-seek-help+act-small-ask-one-question+act-small-one-message`  vs  `held:act-people-keep-the-friendship-alive+act-people-show-up-for-someone+act-seek-help+act-small-ask-one-question`
- `flags:asked-first+coverage-gap+covered+diane-offer-open+has-credential+has-options`  vs  `flags:caring-duty+diane-offer-open+family-bank+has-credential+knows-the-route+network-downstream`

And neither is the right one. Each parse reads the run against *that player's own*
scorecard, so the same facts are read differently:

**Player A (mastery)**
- *autonomy & flexibility* — A great deal of this run went here. Whatever else it cost, this got the seasons.
- *mastery & achievement* — A great deal of this run went here. Whatever else it cost, this got the seasons.

**Player B (closeness)**
- *safety & stability* — A great deal of this run went here. Whatever else it cost, this got the seasons.
- *close relationships & family* — A great deal of this run went here. Whatever else it cost, this got the seasons.

---

## The queue test

> *A delayed consequence lands seasons later and is traceable through the explain
> drawer to its source season.*

Found in a **Supported Explorer** run, seed `q1`.

In **season 5** (age 20) this arrived, not as a choice but as something already in motion:

> The habit is still in the week, and keeping it costs nothing now.

The explain drawer renders its attribution, which names where it came from:

- **accumulatedState** — set in motion in season 3 by Build one habit into the week

That is the trace: `action:act-body-habit-that-holds:s2:de-body-habit-compounds` → set in motion in season 3 by Build one habit into the week. The queue entry carried its own
`sourceRef` and placement season from the moment it was created, and the briefing
had been rendering it, with its timing named, every season in between.

---

## The monotony test

> *A full 24-season campaign without the ceremony wearing thin; repeated actions
> never repeat outcome text verbatim in one run.*

**This clause is met in spirit and not to its letter, and the numbers below say so.** The engine rotates each band's pool by occurrence, so a line cannot return until every other line in that pool has been used — that is the strongest anti-repetition guarantee available, and it is what ships. But a run makes on the order of a hundred and ten resolutions against pools six to eight deep, so an action taken thirteen times shows eight distinct lines and then begins the cycle again. Reaching the literal wording needs pools roughly four times deeper. What was fixed rather than argued away: the season-end rest-conversion line used to sit outside the rotation entirely and rendered in all twenty-four seasons of every run. See KNOWN_LIMITATIONS.md §4.9.

In one full 24-season run, **6** actions were taken more than once.
Actions that repeated an outcome line verbatim: **2**.

- `act-small-one-walk` — taken 13 times, 8 distinct lines
- `act-rest-maintain` — taken 13 times, 8 distinct lines

The most-repeated action in the run was `act-small-one-walk`, taken 13 times. Its lines:

- You take the long way, past the reservoir. Cold air off the water, the light going orange, and by the turn you have stopped walking like you are late for something.
- Dusk, and a street you have never been down — front gardens, a cat on a wall, scales being practiced badly through an open window. You go the long way home.
- Early, before the shops open. Delivery vans, someone hosing the sidewalk, one bakery already warm. You are back before the apartment has properly woken up.
- Dusk, and a street you have never been down — front gardens, a cat on a wall, scales being practiced badly through an open window. You go the long way home.
- Dusk, and a street you have never been down — front gardens, a cat on a wall, scales being practiced badly through an open window. You go the long way home.
- Rain that never quite commits. You go out under it anyway and come back with damp shoulders and an appetite you have not had since morning.
- It turns into an errand halfway through — the shop, the parcel place, home. Air and daylight, technically, taken at the speed of a list.
- Two things at once, and neither of them worse for it.
- Early, before the shops open. Delivery vans, someone hosing the sidewalk, one bakery already warm. You are back before the apartment has properly woken up.
- The hill you always drive past. Your legs complain halfway up and then stop, and the whole town lies out flat and small behind you.
- Early, before the shops open. Delivery vans, someone hosing the sidewalk, one bakery already warm. You are back before the apartment has properly woken up.
- It is a walk. It is fine. You are slightly better for it than not.
- You take the long way, past the reservoir. Cold air off the water, the light going orange, and by the turn you have stopped walking like you are late for something.

---

## Three genuinely different recorded runs

### Credential Route, aiming at mastery

Seeds `run-a` / `run-a-d`. Aiming at: mastery & achievement (3), recognition (1).

A few seasons, as they went:

- **Season 1, age 18** — Read one thing properly · Wait, and keep your options · Sort out one room
  - It makes sense of something you read months ago and could not follow at the time. The two lock together and both stay.
- **Season 6, age 20** — Read one thing properly · Pick up one extra shift · Answer the ask from family
  - You finish it and something in it turns out to be useful within the month.
- **Season 12, age 23** — Read one thing properly · Ask someone for help · Rest and maintain
  - It turns out to be the wrong article; the right one is cited inside it. You read it through anyway and note where the other lives.
- **Season 18, age 26** — Read one thing properly · Choose the repayment order · Pick up one extra shift
  - It argues, carefully, against a thing you had half decided to do. By the end you have dropped the idea and cannot see the case for it any more.
- **Season 24, age 29** — Read one thing properly · Take on the new starter · Pick up one extra shift
  - Read once, properly. It stays.

**At thirty.** You came out of it knowing how to do things you could not do at eighteen: study habits, academic writing, logistics, budgeting, side trade, pacing, technical depth, evaluation, legacy systems.
What it cost: You arrive at thirty tired. Some of that is the decade and some of it is the way you spent it.

Where it came from: choice — most of it; accumulatedState — some of it; draw — some of it; systems — a little of it; startingConditions — a little of it; otherPeople — a little of it.
Doors — opened: 7, closed: 3, still recoverable: 1. Held commitments: 8.
What closed, for instance: a skill with only one buyer; outgoings that do not fall when income does; costs your cover does not reach.

### Care-Constrained Builder, aiming at close relationships

Seeds `run-b` / `run-b-d`. Aiming at: close relationships & family (3), service & contribution (2).

A few seasons, as they went:

- **Season 1, age 18** — Ask someone for help · Ask one question · Show up for someone
  - The help comes with a condition attached, and the condition is fair enough. It is also one more thing you now have to keep on top of.
- **Season 6, age 20** — End the thing that is fine · Ask someone for help · Go to the family thing
  - It comes out in pieces over a long night and lands anyway. The logistics take the rest of the season.
- **Season 12, age 23** — Send one message · Show up for someone · Keep the friendship going
  - No reply. You check on Tuesday, and again on Friday, and then stop checking.
- **Season 18, age 26** — Mentor someone coming up · Ask someone for help · Make one thing badly
  - Nothing dramatic. They ask, you answer, and a year later they are doing work you would have found hard at their stage.
- **Season 24, age 29** — Show up for someone · Ask someone for help · Make one thing badly
  - You bring two people who did not know her. They stay the whole day, and by the evening they are on first-name terms with her mother and arguing about where to order from.

**At thirty.** You came out of it knowing how to do things you could not do at eighteen: caregiving, logistics, budgeting, pacing, mentoring.
What it cost: Money finished thin. Whatever else these years bought, they did not buy room.

Where it came from: choice — most of it; accumulatedState — a large part; draw — some of it; systems — a little of it; startingConditions — a little of it.
Doors — opened: 6, closed: 1, still recoverable: 1. Held commitments: 8.
What closed, for instance: Lu would not be your emergency contact.

### Recovery and Relaunch, aiming at a floor that holds

Seeds `run-c` / `run-c-d`. Aiming at: safety & stability (3), health & energy (2).

A few seasons, as they went:

- **Season 1, age 18** — Rest and maintain · Actually look at the numbers · Deal with one piece of paperwork
  - A quiet season. You come out of it with more to spend than you went in with.
- **Season 6, age 20** — Leave the program cleanly · Open a first line of credit · Go to the family thing
  - Forms, signatures, a date stamped before the deadline. The transcript shows withdrawals rather than failures, and part of the term's money comes back in the spring.
- **Season 12, age 23** — Move across the country · Sort out one room · Chase the share that is short
  - The job is what it said it was. Within two seasons you have a route to work, a place that is yours, and one person you would call.
- **Season 18, age 26** — Decide whether to stay put · Share a place with a partner · Get out of the building
  - You stay, and the staying frees up the whole season for something that is not housing.
- **Season 24, age 29** — Deal with one piece of paperwork · Commit the savings, or hold them · Sort out one room
  - Half the afternoon goes on the wrong form. The right one is shorter, and by then you have no appetite left for it.

**At thirty.** You came out of it knowing how to do things you could not do at eighteen: pacing, logistics, paperwork, tax filing, budgeting.
What it cost: Money finished thin. Whatever else these years bought, they did not buy room.

Where it came from: choice — most of it; draw — a large part; accumulatedState — some of it; systems — a little of it; startingConditions — a little of it.
Doors — opened: 8, closed: 1, still recoverable: 5. Held commitments: 11.
What closed, for instance: costs your cover does not reach.

**Are they different?**

- Run 1 vs run 2: **4** signature components differ (bar is three) — meaningfully different.
- Run 1 vs run 3: **6** signature components differ (bar is three) — meaningfully different.
- Run 2 vs run 3: **6** signature components differ (bar is three) — meaningfully different.

---

## The Lab test

> *All three axes teach their lessons in one sitting.*

### The offer and the course

**choice-vary** — 4 difference(s): The offer, and the course, money, what you came away knowing, doors

> The branches separated, and since the position and the draw were identical, the decision is the only thing that could have separated them.

**draw-vary** — 3 difference(s): Where it got you, connection, doors

> Identical choices, different luck, different endings. Nothing about the play was better in one branch. The move set the range; the draw landed inside it.

### Whether to move for it

**position-vary** — 5 difference(s): Whether to move for it, money, energy, time, what you came away knowing

> The same play, the same luck, two different starting positions, two different endings. That difference is not something either character did.

**choice-vary** — 4 difference(s): Whether to move for it, money, connection, doors

> The branches separated, and since the position and the draw were identical, the decision is the only thing that could have separated them.

**draw-vary** — 4 difference(s): Whether to move for it, The first season anywhere new, money, connection

> Identical choices, different luck, different endings. Nothing about the play was better in one branch. The move set the range; the draw landed inside it.

### A run at getting hired

**draw-vary** — 3 difference(s): Putting the applications out, energy, doors

> Identical choices, different luck, different endings. Nothing about the play was better in one branch. The move set the range; the draw landed inside it.

**choice-vary** — 1 difference(s): Putting the applications out

> The branches separated, and since the position and the draw were identical, the decision is the only thing that could have separated them.

**position-vary** — 2 difference(s): energy, what you came away knowing

> The same play, the same luck, two different starting positions, two different endings. That difference is not something either character did.

### After the falling-out

**choice-vary** — 1 difference(s): After the falling-out

> The branches separated, and since the position and the draw were identical, the decision is the only thing that could have separated them.

**draw-vary** — 1 difference(s): After the falling-out

> Identical choices, different luck. The seasons went differently and the two branches still arrive in the same place — which is its own lesson about how much of a difference a difference makes.

