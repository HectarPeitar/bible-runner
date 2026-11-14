# Subway Surfers: what the game actually is, and what Book Order is missing

Research for the Book Order mode. The brief called it "Subway-Surfers-style", but the build shipped
a timed multiple-choice quiz: three static buttons, pick the right Book, three Lives. This note
inventories the real mechanics, then says which ones carry learning and which are pay-to-win
furniture.

## Sources

- Wikipedia, *Subway Surfers* — https://en.wikipedia.org/wiki/Subway_Surfers (genre, controls,
  power-ups, items, missions, revive)
- Subway Surfers Wiki (Fandom), *Subway Surfers* — https://subwaysurf.fandom.com/wiki/Subway_Surfers
  (gameplay detail: speed cap at three minutes, hoverboard as an extra hit, difficulty by route)
- Subway Surfers Wiki (Fandom), *Power-Ups* and *Key* — https://subwaysurf.fandom.com/wiki/Power-Ups
- SYBO Help Center, *Gameplay* and *Score Multiplier* —
  https://sybo.helpshift.com/hc/en/5-subway-surfers/section/53-gameplay/
- Marcelo Raimbault, *Studying gameplay progression on runners*, Game Developer, 2016 —
  https://www.gamedeveloper.com/design/studying-gameplay-progression-on-runners
- Ben Chong, *Endless Runner Games: How to think and design*, Game Developer, 2015 —
  https://www.gamedeveloper.com/design/endless-runner-games-how-to-think-and-design-plus-some-history-

## The mechanics, in the order a player meets them

**1. The character runs whether you touch anything or not.** Motion is the default state. The
player's job is not to start a run; it is to keep one alive. Everything below is a modification of
that constant forward motion.

**2. Three lanes, and steering is a real verb.** The track is three parallel lanes; left/right swipe
moves the character between them. Lanes are *space you occupy*, not buttons you press — you dodge
into a lane and stay there.

**3. Two vertical verbs that answer two different obstacles.** Swipe up jumps low barriers and lands
on train roofs; swipe down rolls under high barriers and signs. The obstacle tells you which verb it
wants, and misreading it is a failure.

**4. Two kinds of collision, not one.** A head-on hit ends the run. A side clip makes the character
**stumble** — the guard closes in, and a second stumble soon after gets you caught. So the game
distinguishes *fatal* from *recoverable*, and the recoverable one costs you ground rather than a
life. Hoverboards absorb one hit (two if you hit a sideline).

**5. Coins are a trail, not a total.** Coins are placed along paths the designer wants you to take,
so collecting them is a steering hint as much as a currency.

**6. Power-ups temporarily change the rules.** Jetpack (fly over everything), Super Sneakers (higher
jump), Coin Magnet (coins come to you), Pogo Stick, and the 2× multiplier, which makes the score
count twice as fast for a while. Each is a timed exception to the normal rules, and none of them
removes the need to steer.

**7. Speed rises and then stops rising.** The run gets faster until it caps, around three minutes
in, so the difficulty curve is a ramp into a plateau rather than an endless acceleration.

**8. Score is speed-of-progress times a multiplier.** The score accumulates as you run; the
multiplier decides how fast. A permanent multiplier is raised by completing **missions**, which are
the free progression path, and a temporary 2× arrives as a pickup. Distance alone is not the score.

**9. Failure offers one negotiated second chance.** After a crash you can spend keys to revive and
keep the run, and the revive price escalates within a run, so the decision is "is this run worth
saving" rather than "do I want to continue".

**10. Goals exist outside the score.** Missions, Daily Challenges and Season Hunts ask for specific
actions — collect a word's letters, stumble into N barriers — so there is always a short-term
objective that is not "score more".

**11. Meta-progression is cosmetic plus small mechanical edges.** Characters, outfits and boards are
bought with coins and keys; some boards change movement slightly. This is the monetisation layer,
not the game.

## What endless-runner design says about pacing

Runners are not one difficulty curve; they are **blocks** (Raimbault):

1. **Warm-up** (~7–12 s): a safe zone. No way to fail. Introduce the core verb and the collectible.
2. **Calibrate**: the first obstacle, placed off the player's line so it teaches rather than kills.
3. **Reward**: a safe stretch of pickups after a hard patch, so a recent failure is repaid.
4. **Challenge**: real obstacle patterns, escalating.
5. **Rest**: a longer safe block between challenge blocks. Random selection is usually replaced by a
   pseudo-random distribution so a rest is guaranteed before a maximum number of challenges.

The useful claim for us: **difficulty in a runner comes from the pattern and the speed, not from the
number of lives.** Lives are a failure counter; blocks are the actual design.

## Gap analysis: what we built vs what a runner does

| Mechanic | Subway Surfers | Book Order today |
| --- | --- | --- |
| Forward motion | constant, camera follows | none — the row is static between frames |
| Lane steering | player occupies a lane, moves sideways | three buttons; no body, no movement |
| Vertical verbs | jump / roll, each answers an obstacle | none |
| Reading task | recognise the safe path fast | read three Book names and click |
| Failure | stumble (recoverable) vs crash (fatal) | Bounce: forced correction, −1 Life |
| Lives | 3, plus one key revive | 3, no revive |
| Pickups | coins laid along the intended path | none |
| Power-ups | jetpack, magnet, sneakers, 2× | Start boost only (a flat speed gift) |
| Score | progress × multiplier, multiplier from missions | `100 × Speed` per Gate, no multiplier |
| Difficulty curve | speed ramp to a cap, then pattern difficulty | speed changes score, not the task |
| Pacing | warm-up → calibrate → reward → challenge → rest | every row is equally hard |
| Goals | missions, daily challenges | six boards; nothing short-term |
| Juice | sound, particles, shake, animation | a 60 ms CSS transform |

The diagnosis is blunt: we implemented the **question**, not the **game**. Speed is a scoring
coefficient with no effect on what the player has to do, so mastery and patience feel identical.

## What to steal, ranked by fun per unit of work

Given: DOM/CSS only (no canvas, no engine), beginner-friendly, static hosting, four Locales.

1. **Gates must travel.** Keep the pure core; add a `travel` value per Gate that the renderer turns
   into `translate3d`. Selection then happens when a Gate reaches the hit line. Same rules, real
   motion. This is the single change that makes it a runner rather than a quiz.
2. **Give the player a body and a lane.** A marker sits in one of three lanes; left/right (keys and
   on-screen buttons) move it. The Gate in your lane when the row arrives is your answer. Now the
   player *steers into* the right Book instead of reading three buttons and clicking — and the wrong
   Gates become obstacles to avoid, which is the runner's core verb.
3. **Stumble instead of instant Life loss.** A wrong gate = stumble: speed drops hard, the screen
   shakes, the same row is pushed back and the correct gate is highlighted; a second stumble within
   a few seconds = caught, run over. More forgiving, more legible, and it makes speed itself the
   thing you protect — exactly what Subway does.
4. **Coins as a trail.** Place small pickups in the correct lane between rows, so following them is
   both reward and hint. Coins fund one in-run revive.
5. **One revive per run, bought with coins.** The negotiated second chance: "spend 20 coins to keep
   this run". Escalate the price each time. Cheap to build, huge for run length.
6. **Power-ups as timed exceptions.** Three are enough and all are rule changes we already have
   vocabulary for: *Multiplier* (score ×2 for the next rows), *Magnet* (the next row's distractors
   dim, leaving the answer readable — a reading aid that matters in Georgian and Russian), *Shield*
   (survive one stumble). Each is a temporary flag in state; no new architecture.
7. **Pacing blocks in the generator.** Warm-up of ~8 s where rows are trivially easy, then a
   calibrate row, then rewards and rests on a pseudo-random schedule. This is generator policy in
   the pure core, and it is what makes a two-minute run feel composed rather than random.
8. **Missions as short-term goals.** Three at a time, e.g. "reach Isaiah without stumbling",
   "collect 10 Sections", "finish a canon run from Acts". Stored beside the boards; they give a
   reason to start a run that is not "beat my score".
9. **Juice, last.** Shake on stumble, lane snap, speed lines that lengthen with speed, a thud via
   WebAudio (no dependency), gate highlight. Cheap, and it is most of what "feels like a game"
   means.

Explicitly **not** to steal: characters, outfits, boards, currencies as economy, world-tour content
cadence, ads, keys-as-monetisation. None of it makes the learning better and all of it needs art we
don't have.

## Risks to decide on, not discover later

- **Reading speed is not uniform across Locales.** `1 თესალონიკელები` takes longer to read than
  `1 Thessalonians`. A runner penalises slow reading, so the same gate cadence is harder in Georgian
  and Russian. Mitigations: cadence keyed to time not distance, a slightly longer approach for
  longer names, the Magnet power-up, and a per-Locale speed offset in the Rules if playtesting says
  so.
- **DOM/CSS animation at 60 fps is fine for three lanes and a handful of nodes; it is not fine for
  particles.** Keep the moving set small: one row, three gates, a handful of coins. Anything more
  belongs in a canvas, which the ADR rules out.
- **The core task changes from "recall" to "recognise under time pressure".** That is a different
  skill from the one the spec described. It is probably the better one for building fluency — but
  it must be a decision, not a drift.
- **Tuning is now the whole game.** Speed, approach time, row spacing, pickups and stumble windows
  are interdependent, which is what ticket 16 was for. Under the current build there was almost
  nothing to tune.

## Recommendation

Do not extend the quiz. Replace the renderer and the row model in three slices, each playable:

1. **Motion + steering**: travelling gates, a player lane, selection on arrival, keys and touch.
2. **Stumble + revive + coins**: the failure model Subway actually uses, plus a second chance.
3. **Power-ups + pacing + missions**: timed exceptions, warm-up/rest blocks, three standing goals.

That is a rewrite of the Mode's renderer and row generator, not of the platform: the shell, storage,
boards, Locales, content table and the six Routes all survive. The pure `advance` seam is what makes
that affordable, and it should keep every rule testable without a browser.

Open question for the operator: is Book Order a **reading game with movement** (gates travel, but the
thinking is still "which Book comes next") or a **reflex game about Bible order** (movement is half
the skill)? The mechanics above assume the first, because reading three names in the time it takes a
row to arrive is the whole learning loop.
