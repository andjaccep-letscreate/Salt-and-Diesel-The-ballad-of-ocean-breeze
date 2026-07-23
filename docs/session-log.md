# Session log

A running, append-only log of our work. Newest entries go at the bottom.
Beginner-friendly on purpose — see `CLAUDE.md` for the format and rules.

## [2026-06-20] — Set up CLAUDE.md and the session log
- Goal:    Make budget/token discipline and working-style rules apply to every
           future Claude Code session automatically.
- Did:     Rewrote `CLAUDE.md` from the new template (plan-before-doing, evidence
           before claims, keep-context-lean, teach-as-you-go, guardrails). Created
           this `docs/session-log.md`.
- Learned: CLAUDE.md is auto-loaded at the start of every session, so its rules
           apply without pasting them in. It's re-sent each turn, so keeping it
           short directly saves usage budget.
- Gotchas: The file only takes effect everywhere once it's on the `main` branch;
           on a feature branch it applies only to sessions started from that branch.
- Next:    Decide whether to open a PR to merge this onto `main`.

## [2026-06-22] — Phase 5: 4-member party system + rescaled boss
- Goal:    Turn the single-hero game into a 4-member party RPG (engine + four
           kits + recruitment + boss rescale + save v2), verify headlessly, and
           ship a preview. Defer 5b/5c/Phase 6.
- Did:     Big rewrite of index.html (+534/-279): party engine (MEMBER_DEFS /
           makeMember / round loop / ABIL table / status effects), mobile party
           HUD + ability menu + target-select, NPC recruitment of the three
           crew, boss rescaled to 560 HP with Phase-2 + AoE Tail Sweep, district
           adds, save v2 with v1 migration, and Larry's bolt-sword restyled to an
           anchor-blade (cyan electric arc kept). Committed + pushed to
           claude/phase-5-party. Ran a 300-run headless full-loop sim.
- Learned: "Headless sim" = run the game's JS in Node with a fake browser so we
           can play 300 fights automatically and measure win rates with no clicking.
           A "policy" is the auto-player's decision rule (smart vs careless).
- Gotchas: 1) buildEnemies forgot alive:true, so the target-finder picked index
           -1 and every attack crashed on an undefined target — fixed by marking
           enemies alive. 2) The sim's synchronous-timer stub made the music
           ticker recurse forever; capped timer nesting depth to fix. 3) "Smart"
           play only hits the win band when the crew uses STUNS (Anchor Cast /
           Net) to skip the boss's devastating turns.
- Numbers: Districts 100%/100%/100% (smart). Boss @L4 smart 73% win (inside the
           locked 70-90% band), careless 0%. Full loop 74% smart / 0% careless.
           Zero exceptions. Note: prototype said ~87%; in-game lands at 73% —
           ~14-point drift, still in band, so the locked 560 HP stands.
- Next:    Andres previews ?v=5; on his OK, open a PR / merge to main. Only then
           start the queued claude/repo-setup docs task. Do NOT start 5b/5c/Phase 6.

## [2026-06-23] — JRPG combat UI (data model + FF-style HUD)
- Goal:    Layer a Final-Fantasy-style combat UI on the verified Phase 5 engine:
           crew data metadata, left crew formation, right enemy zone, lower
           command menu + 4-crew status window, smooth meters. No balance change.
- Did:     New branch claude/jrpg-combat-ui off claude/phase-5-party. In index.html:
           (1) enriched MEMBER_DEFS with weapon{name,type}+combatRole and added
           special/maxSpecial to makeMember (cosmetic gauge, reset each fight);
           (2) added #stage-crew (4 neon silhouette chips) + pre-allocated enemy
           slots; (3) wrapped the lower HUD into #combat-hud = Action Menu
           (Fight/Skill/Fuel/Item, derived from each ability's shape) + Status
           Window; (4) rebuilt the status window to BUILD ONCE then mutate
           style.width/classes so HP(green/amber/red)/Fuel(amber)/Special(cyan)
           bars slide via CSS transitions instead of innerHTML rebuilds;
           (5) neon status badges by each name. Removed the old payload menu +
           pcard CSS. Re-ran the 300-run sim.
- Learned: "Build-once-then-mutate" — rebuilding innerHTML every frame restarts
           CSS transitions, so meters wouldn't animate; instead build the DOM one
           time and only change widths/classes, which lets the browser tween them.
           "Bucket from shape" — the Fight/Skill/Fuel/Item menu is derived from
           each ability's existing fields (cost=Fuel, charge=Item, free basic=
           Fight, else Skill), so the verified engine/abilities are untouched.
- Gotchas: Special gauge must stay cosmetic — it's never read by combat, so
           win-rates are identical (confirmed). Moved the crew roster to top-left
           so it doesn't overlap the floor-standing active sprite.
- Numbers: Same harness, 300 runs: Districts 100/100/100, Boss 73% smart / 0%
           careless, full loop 73% / 0%, ZERO exceptions — unchanged from the
           pre-UI Phase 5 baseline (cosmetic-only, as required).
- Next:    Andres previews ?v=6. No PR/merge. Phase 5c (real ultimate moves on
           the gauge) still deferred; repo-setup docs still gated on Phase 5 merge.

## [2026-06-23] — Restore Silver's Payload Selector (nested under Skill)
- Goal:    Andres flagged: the FF reorg must keep Silver's Payload Selector with
           all 5 ammo types reachable as a nested selector, not scattered.
- Did:     index.html — abilBucket now routes every ammo:true ability into a
           'payload' bucket; renderActions shows a "🎯 Payload Selector" entry
           inside Silver's Skill menu that opens a sub-list of all 5 ammo
           (Kinetic/Net/Magnetic/Flak/Incendiary), then target. Added backTo()
           so Payload's Back returns to Skill. Dagger (Dual Blades basic) sits
           under Fight. Verified all 5 ammo resolve; re-ran 300-run sim.
- Gotchas: My first FF pass had scattered the ammo (Kinetic->Fight, rest->Skill)
           with no unified selector — did NOT match the intended flow. Fixed.
- Numbers: 300 runs: Districts 100/100/100, Boss 76% smart / 0% careless, loop
           70% / 0%, zero exceptions — within RNG noise of baseline; engine and
           abilities untouched (menu-only change).
- Next:    Andres previews ?v=7 and plays before any merge. No PR/merge/5b/5c.

## [2026-06-26] — Act-3 Content: Baron droid-puzzle, Golfer finale, Shadow World gate

- Goal:    Build the final content phase of Episode 1: Act-3 patrol enemies
           (Steam-Vent Turret E, Chrono-Diver Brute J), The Baron mini-boss
           (droid-puzzle mechanic), The Corrupted Retiree Golfer final boss
           (two-phase + burn DoT), the Briefing Room ending screen with
           Seal/Chase choice, and the Shadow World (1.5× scaling + Mako Shark
           bonus boss). Retire Castellane as final boss; Baron→Golfer is the
           only route.
- Did:     All edits to `index.html` on branch `claude/act3-content`:
           Map rows updated (E/J/A/Q placed in east corridor col 20, Castellane
           tile removed). ENEMIES table: E, J, A, Q, M added; '3' adds changed
           to ['E','J']; '4' kept as dead code. SALVAGES: baronWatch,
           primeArtifact added. ADD_DEFS: E, J, I (Interceptor Droid). SVG
           sprites for all new enemies. buildEnemies(): evade, droidPuzzle,
           droid fields + Shadow World 1.5× scaling. startBattle(): riseLog
           field for boss announcements (also fires on minib now).
           enemyAIact(): baron/golfer/mako kit handlers; !e.kit guard on
           generic p2 + tail-sweep. commitAbility(): droid shield check (blocks
           targeting Baron while droids live) + droid-death notifications.
           endOfRound(): party burn DoT tick (Golfer phase 2). winBattle():
           boss routes to 'briefing' not 'victory'. applySalvage(): 'briefing'
           routing branch. resetState()/saveGame()/continueGame(): worldState
           persisted. SCREENS: 'briefing' added. HTML: #briefing screen with
           Seal/Chase buttons. New functions: sealEpisode(), chaseShadow(),
           respawnShadowWorld(). Also fixed a pre-existing bug: ENEMIES table
           entries '3','4','E','J','A','Q','M' used Unicode curly quotes
           (U+201C/U+201D) as JS string delimiters — valid in browsers but
           rejected by Node.js. Fixed via Python byte-level replacement to use
           ASCII double quotes throughout.
- Learned: "Curly quotes as JS string delimiters" — browsers may accept Unicode
           curly quotes (U+201C/U+201D) in script tags even though the
           ECMAScript spec requires ASCII quote chars. Node.js rejects them,
           which only surfaces when running headless tests. Always use ASCII
           double-quotes in JS string literals.
           "Binary search for JS syntax errors" — when node --check gives no
           line number, write the script to a .js file and use
           `node --check file.js` for precise error location.
           "Droid-puzzle shield" — implemented at two levels: commitAbility()
           blocks player targeting the Baron while droids live; endOfRound()
           checks partyWiped() after party burn tick so a DoT kill ends combat
           immediately.
- Gotchas: Curly-quote bug was widespread in ENEMIES entries added this
           session. Fixing it required Python byte-level surgery because Edit
           tool XML encoding re-introduced escaped backtick/quote issues.
           The closing curly-quote in intro strings that followed \\\"...\\\",
           was NOT converted by the heuristic (prev byte was ASCII \"), causing
           unclosed strings — needed a second pass to fix the trailing U+201D
           before \\},.
           Golfer at atk:22 gave 100% smart win (target 70-90%). Tuned to
           atk:28; confirmed 82% smart / 0% careless across 300 runs.
- Numbers: 300 runs: Districts 100%/100%/100%, Baron 100%/100%, Golfer 82%
           smart / 0% careless, Full loop (5 fights) 84%/0%, Shadow patrols
           100%/100%, zero exceptions. All verdict checks PASS.
- Next:    Andres previews via raw.githack ?v=N link and plays through Act 3.
           If sign-off given, merge to main. Do NOT start Phase 5 party system
           until explicitly asked and the party-system-prompt file is handed
           over.

## [2026-07-01] — Phase 1D: enemy patrols, weapon glows, crew pacing (+2 bug fixes)
- Goal:    Ship Phase 1D-1a (11 patrol enemies walk paths, red 2-tile warning
           pulse, permanent defeats), 1D-1b (4 randomized glowing weapon-upgrade
           tiles, one per zone, one-time pickup), and 1D-2 (recruited crew
           members pace a small loop in their home zone). Merge 1A–1D-1b to main.
- Did:     All in index.html on claude/dieselpunk-rpg-game-21nkt7. PATROL_DEFS +
           patrolTick on a 2s timer; GLOWING_TILES + randomized spawn zones +
           Yes/No collect dialogue; CREW_PACE_DEFS + crewPaceTick reusing the
           same timer. Merged f0f6405..669d226 to main (fast-forward). Fixed two
           bugs found by verification: Platinum's pacer anchor was sx:3 but her
           map tile is x=4 (duplicate 'R' appeared), and glow tiles could spawn
           on a pacing path and wall the pacer in (5% of Downtown runs froze
           Titanium) — glow spawner now skips path tiles.
- Learned: "Node vm harness" = we load the game's real JS into Node with a fake
           document/localStorage so we can run thousands of battles and map
           checks without a browser. "Off-by-one" = counting from 0 vs 1 —
           Platinum's tile column was miscounted by one, a classic. A solid tile
           dropped on a walker's path doesn't crash anything; the walker just
           reverses forever, which *looks* frozen — why we quantify oddities
           instead of shrugging ("96% of ticks moved" led straight to the bug).
- Gotchas: Playwright clicks on the dialogue sometimes ate the next arrow-key
           press — worked around by calling the game's own button handler.
           raw.githubusercontent.com serves plain text; use raw.githack.com for
           playable previews. Screenshot byte-diffs are unreliable (PNG encoding
           jitter); compare game state / DOM positions instead.
- Numbers: 200-run sim after all fixes: Districts 100/100/100 smart, Baron 100,
           Golfer 92 smart / 0 careless, full loop 100 smart, Shadow 100/100,
           zero exceptions. Glow spawns 2000/2000 valid; pacers 100% mobile;
           save/load round-trip clean. Combat code untouched (git diff proof).
- Next:    Andres previews ?v=N and approves 1D-2 merge; then Phase 1D-3
           (polish) only when asked. Fable-model improvement plan proposed —
           awaiting pick.

## [2026-07-02] — Phase 1D-3 polish + full-code audit (8 bug fixes)
- Goal:    Ship 1D-3 (smooth-glide movers, render efficiency, per-zone
           ambiance), then a whole-file diagnostic/audit with permission to
           fix anything except combat balance.
- Did:     1D-3: movers became overlay sprites that glide 0.55s between tiles
           (grid cells under them draw ground only); patrol ticks no longer
           repaint the 143-cell grid; four zones got distinct CSS color grades
           + re-tinted fog + water pace. Audit fixed 8 bugs: ghost duplicate
           enemies on every save/Continue (map snapshot now strips live
           movers); defeated patrols resurrecting after zone travel; patrols
           vanishing when bouncing off NPCs; road-tile trails painted over
           grass; winBattle terrain restore; glow Yes/No buttons leaking into
           later dialogues (stale-collect risk + double-tap guard); stale
           speaker face/text in the discovery prompt; Shadow World patrols
           frozen (timer never restarted after the boss fight).
- Learned: "Overlay sprite" = a div positioned above the tile grid moved with
           CSS transform, so the browser animates it smoothly — the grid
           itself can't animate because it's redrawn in place. "Snapshot
           stripping" = removing moving things from a save so they don't get
           restored twice. An audit finds the most bugs at SEAMS — where two
           systems meet (save+patrols, dialogue+glow prompts, timer+screens).
- Gotchas: The "audit agent" hit a session usage limit and returned nothing —
           the whole audit ended up being direct code reading, which found
           real bugs the sims never caught because sims start fresh (never
           save/reload mid-wander like a real player).
- Numbers: 13-check audit regression suite ALL PASS; all prior suites green;
           200-run sim after every change: zero exceptions, Districts
           100/100/100, Baron 100, Golfer ~92 smart / 0 careless, full loop
           100, Shadow 100/100. Browser-verified glide (real interpolated
           positions), zone filters, reduced-motion, zero console errors.
- Next:    Andres playtests ?v=N (glide + zone moods + audit fixes) and
           approves merge of 1D-3 + audit to main. 1D-4/1E only when asked.

## [2026-07-02] — Phase 1V-1 shipped: overworld visual identity
- Goal:    Merge the approved world-visual overhaul (connected streets, zone
           ground materials, CSS building facades, animated water, dusk
           vignette, props, cyan marker glow) to main.
- Did:     Merged commits a311cae + 39ca9a0 (and the earlier 1D-3 + audit
           commits) to main after hub playtest sign-off. Rendering-only diff;
           combat/save/pathing untouched; 200-run sim + browser pass green.
- Known:   At 390px the HUD's speaker + gear buttons wrap onto a second row —
           pre-existing (not caused by 1V-1). Logged for Phase 1V-3; do not
           fix before then.
- Next:    Phase 1V-2 only when the hub hands over its spec.

## [2026-07-04] — Phase 5b: Legendary Weapons & Salvage Choice
- Goal:    Add the four post-finale legendary powers (unlocked by beating the Golfer); confirm the salvage-choice system (Item 1) was already built.
- Did:     index.html only. Item 1 (per-boss +5 salvage choice, persisted in claimedSalvages, no re-trigger) verified already-complete — no code change. Item 2 (legendaries): added LEGENDARY_DEFS + `legendaries` state, `unlockLegendaries()` on Golfer('Q') win, and four combat riders — Gold "Fairway Cleaver" (single-target strike lands twice), Silver "Foresight" (first incoming hit each battle fully evaded), Titanium "Fear Aura" (~30% stun-on-hit), Platinum "Initiative Core" (acts first via new `beginAllyPhase()` turn-order, baseline-identical when locked). Persisted `legendaries` in save/continue/reset. Added a Briefing-Room reveal panel (renderLegendaryReveal) + CSS. Added `battle.dmgBy` per-member damage tracking for the report.
- Learned: In a Node `vm` sandbox, top-level `let` bindings are NOT settable from outside via `sandbox.x=…` (only readable via the copy-out bridge) — to flip `legendaries` in the sim you must CALL the real `unlockLegendaries()`, which reassigns the lexical binding. (`vm` = Node's sandboxed-script module.)
- Gotchas: First damage-share run showed no legendary effect because I set `sandbox.legendaries` directly (dead write). Fixed by toggling via `unlockLegendaries()`. Legendaries only unlock AFTER the Golfer falls, so every locked baseline scenario (which ends at the Golfer) is untouched by construction — confirmed: baseline sim numbers unchanged.
- Next:    Awaiting Andres' sign-off on the ?v= preview before any merge. Do NOT auto-start Phase 5c.

## [2026-07-08] — Full audit pass: bug fixes, polish, perf, dead-code cleanup
- Goal:    Weekly-budget audit — review/correct/optimize the whole game (Andres gave full range; balance stays locked).
- Did:     3 parallel review agents audited index.html (logic bugs / UI-UX-mobile / perf-deadcode-lore); I verified every finding against the source and fixed 25 of them in one batch. Combat: Baron droid-shield can no longer be bypassed by Flak or drones (new exposedFoes()); blocked attacks no longer burn their cooldown; ally stun badge now decays; sim fallback picks a genuinely free attack. Saves: salvage reward survives a reload (pendingSalvage persisted + restored); corrupt saves reset cleanly instead of half-restoring; ancient v1 saves discarded like v2. World: glow pickups can't overwrite fuel/kit caches; Palm Island respawn patrols actually repost in-session (~48s bench). UI: banners now visible under reduced-motion (static toast + auto-hide); glow tiles stop pulsing under RM; pinch-zoom re-enabled; battle HUD text bumped above the 8px legibility floor; 44px tap targets for mute/gear/toggles; keyboard targeting (Tab+Enter) for foes and ally cards; enemy phase pauses while settings is open; crit-flash no longer covers overlays. Perf: autosave throttled from ~8 writes/sec while walking to ~1/sec (+ pagehide flush); enemy panel updates in place instead of rebuilding SVGs every render. Text: victory screen now describes the Golfer finale (was the retired Leviathan); per-boss battle-opening banners; fixed 1947 anachronisms ("bricking", "mainframe", "Stage 2"). Removed ~120 lines of dead code (unreachable intro cutscene, pre-stage battle CSS, empty DISTRICTS system, duplicate map-key collisions).
- Learned: A CSS animation that ends at opacity:0 ("forwards") makes the element permanently invisible when reduced-motion sets animation:none — anything that must APPEAR needs a non-animation fallback. Also: divs with onclick are invisible to keyboards until you add role="button" + tabindex + a keydown handler.
- Gotchas: The Baron is a 1-HP puzzle boss, so ANY stray damage (AoE splash, drone auto-attack) instantly skipped the whole droid puzzle — worth re-checking every new damage source against him. The enemy-panel innerHTML rebuild needed a per-battle signature reset or a new fight could reuse stale sprites.
- Next:    Awaiting Andres' review of the audit build. Open design questions flagged: glowing pickups still grant no stat effect (balance decision), coastal palette makes the cyan turn-indicator blend with brass accents (visual call).

## [2026-07-08] — Phase 1T: opening experience (music + title + briefing cards)
- Goal:    Give the game its soundtrack and upgrade the flat title screen + opening cards.
- Did:     Saved the 3 MP3s to /audio/ (the one approved external-asset exception, ~15.3 MB) and replaced the procedural chiptune with a track manager inside index.html: title theme on title+briefing, exploration on the overworld, battle in combat, ~500ms crossfades, loop=true, title preloaded / others lazy. Music starts on the first tap (browser autoplay policy). Audio prefs (mute/music/SFX/volume) persist in their own localStorage key — the run-save format is untouched. Title screen: layered SVG art-deco skyline with dirigibles, Aethel-lit windows and flood-water reflections; brass riveted "Start the Job" vs quiet-steel "Resume"; speaker icon on the title. Briefing: Planck Agency case-file tab ties the 5 cards into one frame; paper can scroll instead of silently clipping; clearer done/current/upcoming dots; page 1 now states you deploy alone as GOLD.
- Learned: `createMediaElementSource` outputs pure silence when the media comes from an opaque origin (like file://) — recording the soundtrack demo required serving the game over localhost. Also: browsers block autoplay until a user gesture, so the title theme is gated on the first tap by design.
- Gotchas: The turn-indicator check came back already-safe (▶ prefix + left border are shape tells, not color). Golfer smart win% sampled 95.5% once then 92.5% — the diff has zero combat lines, so it's binomial noise, not drift.
- Next:    Awaiting hub sign-off on the 1T preview. Do not start the next phase.

## [2026-07-09] — Phase 1B-2: full party + all enemies on the battle stage
- Goal:    Kill the "1v1 prototype" look — draw the whole present party AND every enemy in the encounter at once, side-view.
- Did:     index.html only, pure presentation. Party: the cosmetic crew chips became a real staggered lineup (existing MEMBER_SVG / Larry SVG art); the active member IS #stage-hero parked in their lineup slot with a cyan glow + step-forward, so every existing swing/flinch/damage-number anchor kept working. Enemies: depth slots keyed by encounter size (front = lower/larger/in-front, staggered baselines, slight overlap, existing shadow ellipses), Dragon-Quest A/B/C labels on duplicate names, bouncing ▼ cursor on targetable foes, and a count-aware scale-up so a lone enemy doesn't strand in dead space. Stage grew to min(56vw,215px). Emoji-fallback foes (no SVG) now stand ON the ground line instead of floating.
- Learned: CSS animations REPLACE the whole transform, so a depth scale on the same element gets wiped mid-animation — the fix is composing the scale into the keyframes via a CSS var (scale(var(--fs,1)) translateX(...)). Also: an unseeded sim varies run-to-run even on identical code, so "zero drift" is only provable with a seeded RNG A/B — ours came back byte-identical across 16 scenarios × 200 runs.
- Gotchas: The sim's fake DOM lacks style.setProperty — any new CSS-var write from JS needs a guard or the headless suites crash. The seeded A/B first "failed" because the driver's policy functions used Node's Math.random while the game used the sandbox's — two streams; unifying them fixed it.
- Next:    Awaiting hub sign-off on the 1B-2 preview. Note: 1T and 1B-2 are both on the branch, unmerged.

## [2026-07-09] — 1B-2b follow-up: the fight owns half the screen
- Goal:    Andres' adjustment after merging 1B-2 — in battle, at least half the screen goes to the stage and the fighting characters.
- Did:     CSS only. Stage height: 215px → max(38svh, min(50svh, 100svh−420px)) — exactly 50% of a 390×844 phone, gracefully smaller on short phones so the HUD never clips. Sprites scaled with it (crew ~184px tall, foes 96px/126px boss). Compacted the log (48px) and crew status cards so the whole battle column fits 844px with zero scroll and the commands stay in the thumb zone. Tightened enemy-slot spread so the two bigger formations don't touch mid-stage.
- Learned: svh units ("small viewport height") measure the viewport with mobile browser bars visible — safer than vh for "fits on one phone screen" math.
- Gotchas: The first pass overflowed by 66px — the status window was the hog (85px/card after the legibility bumps); compacting paddings/meter heights won it back without shrinking any text.
- Next:    Awaiting sign-off on the 1B-2b preview. 1T + 1B-2 are already merged to main; only this adjustment is pending.

## [2026-07-09] — Phase 1T-3: battle transition, equal-power crossfades, minimal title
- Goal:    Smooth the abrupt jump into battle, fix the sharp music cut, strip the title to logo + start.
- Did:     index.html only. (1) One reusable startBattleWithVeil(): white flash 150ms → mosaic dissolve 410ms → black hold 120ms → battle pops in (~700-900ms, measured 710ms); reduced-motion gets a plain ~520ms fade instead; all four overworld battle entries route through it, the sim's direct startBattle path untouched. (2) Music: each track now runs element → MediaElementSource → GainNode → destination; crossfades are SCHEDULED 33-point cosine curves (setValueCurveAtTime, equal-power so no mid-fade dip, never a bare gain.value write); into-battle 400ms under a synthesized ~0.75s sting, out-of-battle 800ms, ambient 1400ms; file:// local play falls back to element-volume fades with the same cosine weights (MediaElementSource is silent on opaque origins). (3) Title: lore paragraph + SPARKPLUG bio moved into the briefing as a proper case-file slide (now 6 slides, all clip-free); title is logo + skyline key art + pulsing bottom-anchored "▶ Start the Job" (+Resume); pulse off under RM. Bonus: data: favicon stops the 404 every hosted player's console showed.
- Learned: setValueCurveAtTime wants cancelScheduledValues first or overlapping curves throw; equal-power = fade-out cos(k·π/2) against fade-in sin(k·π/2), crossing at −3dB instead of linear's −6dB dip.
- Gotchas: Two "regressions" in verification were the test's own fault — wall-clock jitter in headless Chromium and a 40ms poller missing the 120ms black-hold phase (MutationObserver fixed it). Battle-theme reset races the 400ms music watcher + fade timer, so asserting it needs ~1.7s of patience.
- Next:    Awaiting hub sign-off. Branch holds 1B-2b (half-screen stage) + 1T-3, both unmerged; opening/battle-feel polish pass complete after merge.

## [2026-07-10] — Phase 1B-3: bigger battle stage — the fight is the star
- Goal:    Grow the battle stage from ~50% to ~75-80% of the 844px screen, kill the dead space, and compact the whole HUD into the bottom thumb zone — visuals/layout only, zero combat changes.
- Did:     index.html only. Stage: height became max(50svh, 100svh−170px) = exactly 79.9% at 390×844 (short phones cede toward the 50svh floor; ≥600px wide keeps a compact desktop column). Combat log: no longer its own band — it's a slim translucent JRPG message strip overlaid on the stage's bottom edge via a negative top margin (its flow height collapses to zero). Mute/gear: tucked into the stage's top-right corner (absolute, 44px targets held). Party status: the four tall cards became ONE slim chip row — waiting members show portrait + HP bar; the ACTIVE member's chip widens (flex-grow) into full name + HP/FUE/SPC with numbers. Command menu: FIGHT/SKILL/FUEL/ITEM as a lean 4-across bottom bar; submenus (Skill lists, Payload Selector) pop UP over the stage in a .menu-pop window so the bar never changes height; targeting shows hint + Cancel in the same bar. Combatants drawn bigger (crew 33% of the taller stage ≈ 222px, foes 120px/156px boss), floor deepened to 33% + horizon raised, and the FOE/ALLY slot ladders kept but bottoms raised so front-row nameplates clear the new message strip. Verified: seeded 204-run A/B sim (17 chapters × 12 seeds) baseline-vs-new came back byte-identical (same sha256) — zero stat drift; real-tap combat rounds at 390×844, 320×568, 900×900 with zero console errors; reduced-motion pass clean; no overflow and no control under 44px.
- Learned: A negative CSS margin-top can pull an element up OVER its previous sibling while erasing its own slot in the layout — that's how the log "floats" on the stage without any HTML moving. flex-grow is animatable, which is what makes the active chip slide wider each turn (snapped off under reduced-motion).
- Gotchas: The status meters collapsed to 2px slivers at first — an old grid-era rule (.svc{align-items:center}) was still winning inside the new flex chips and shrink-wrapping every meter row; explicit align-items:stretch fixed it. Platinum's permanent patch-kit badge ate his narrow chip and truncated the name to "P." — waiting chips now drop the text name entirely (the portrait is the identity), which the spec's "small portrait + HP chip" wording wanted anyway.
- Next:    Awaiting hub sign-off on the 1B-3 preview (?v=1b3-stage). Do not start the next phase without the nod.

## [2026-07-10] — Phase 5c complete: Team Ultimate Attacks (continued from WIP)
- Goal:    Finish + verify the parallel session's WIP (91d85cd) against the full 5c spec.
- Did:     The WIP survived inspection almost intact — trigger predicate (all alive + all ≥50% HP + 3 rounds since last), all four ultimates numerically on-spec (Gold 3×1.5 all foes, Silver 5×1.2 random + stun chance, Titanium 4×1.0 all + 30% heal, Platinum 2.0 all + 25% heal), re-entry guard, per-member flourishes, synthesized cue. One real fix: the always-visible ULTIMATE row overflowed 1B-3's 170px HUD reserve — stage now cedes 50px (100svh−220px ≈ 74% of an 844px screen, no overflow). Verified end-to-end and committed.
- Learned: When a phase intentionally changes combat numbers, the drift proof splits in two — a seeded never-fire A/B (byte-identical = base combat untouched) plus an unseeded fired-run comparison (win rates within noise = ultimates are bonus, not crutch).
- Gotchas: The trigger audit's pooled "75% of Golfer fights had an opportunity" looked like a miss until split by policy: smart play = 400/400, careless play is exactly what the ≥50%-HP gate should lock out. Also: back-to-back fireUltimate tests must respect the 340ms beat lock or the second call silently no-ops.
- Next:    Awaiting hub sign-off on the 5c preview. main stays at 8370f21 until then. After sign-off: feature-complete.

## [2026-07-10] — 🎉 FEATURE-COMPLETE: Phase 5c merged — Volume 1 ships
- Goal:    Merge the signed-off Phase 5c (Team Ultimate Attacks) to main and close out Episode 1.
- Did:     main fast-forwarded 8370f21 → d5b62a7, zero conflicts; merged build verified zero console errors firing an Ultimate at 390×844. The full game is now on main: minimal title → case-file briefing → four WPB zones with the 3-track soundtrack → flash/mosaic battle transition → ~74% battle stage (full crew + all enemies) → team Ultimates (all alive + all ≥50% HP + 3-round charge) → salvage choices → Baron droid-wall → Golfer finale → legendary weapons → Shadow World.
- Learned: "Fast-forward" merge = main's pointer just slides up the branch's commits because main had nothing new — no merge commit, no conflicts possible. It's why we always build on a branch cut FROM the latest main.
- Gotchas: None — a straight merge of already-verified work is the boring kind of merge, which is the goal.
- Next:    Nothing queued — Volume 1: Florida, Episode 1 is feature-complete. Future ideas stay banked in the Vault (elemental weakness, MP/TP, CTB order, isometric, county overworld, glow-pickup effects, episodic save plumbing) until explicitly called for. Good stopping point for /clear.

## [2026-07-11] — Phase 1V-CREW: the four crew redrawn to canon
- Goal:    Replace the generic round-headed figures with characterful SVGs matching the reference art — silhouette + signature features + locked skin tones.
- Did:     Art only, all hand-coded inline SVG (references NOT embedded). Gold/Larry restyled across all 3 directional views keeping his walk/attack rig: brown trench over tan shirt, blue jeans + brown boots, brass-rimmed aviators, curlier hair (skin stays #c98a5e). Silver redrawn: lightest skin #e7c39a (canon-accurate), dark curls, brass forehead goggles, steel vest, 3-barrel harpoon-gatling with brass drum. Titanium: brown skin #a06b42, FULL dark beard, round green goggles, green plaid + leather vest, shoulder battle-axe, tiny drone accent. Platinum: dark-brown skin #6d4a33, shoulder locs, round glasses, blue artificer coat over light shirt, white boots, oversized chrome pneumatic fist + hip crossbow. NEW: matching head-and-shoulders PORTRAIT_SVGs now replace the emoji faces in battle status chips, the overworld party strip, dialogue speaker faces, briefing contact slides, and salvage pick buttons — one face per character, everywhere.
- Learned: A shared crewFace(key) helper with emoji fallback means every small render site upgrades (or degrades) together — no site can drift to a stale face.
- Gotchas: Two members previously shared the same skin fill (#c9966b) — exactly the canon violation this phase exists to fix. Also caught a self-inflicted broken hex mid-edit; node --check catches nothing inside template strings, only the browser render does.
- Next:    Awaiting Andres' look-review on the ?v=crew1 preview — iterate until it's right. No merge yet.

## [2026-07-11] — Phase 1V-GOLD-WEAPON: Larry gets his sword (anchor stays)
- Goal:    Gold's primary weapon reads as a traditional long sword; the anchor stays as his signature off-hand (his legendary + ultimate reference it).
- Did:     Art only. The anchor-staff in all three directional views became a proper long sword (straight blade with fuller, crossguard, wrapped grip, pommel) inside the same .bolt-arm/.bolt-arc animation groups, so swings and the cyan bolt arc still work untouched. The anchor moved to the off-hand per view: dangling on its chain from the left hand (front), slung across the back on a strap (back), at the back hip with the chain over the shoulder (side — the battle-stage view). Face/skin/hair/aviators untouched.
- Learned: All three views shared a byte-identical weapon group, so one replace-all swapped the sword into every view at once — drawing shared parts identically pays off later.
- Gotchas: None; seeded A/B vs main byte-identical, zero console errors, battle column still fits.
- Next:    Awaiting hub sign-off on ?v=gw1. No merge yet.

## [2026-07-11] — Merge Gold's sword + Phase 1V-SILVER-EYES
- Goal:    Fast-forward main with the approved Gold sword+anchor build, then give Silver visible eyes so he stops reading as blank under his pushed-up goggles.
- Did:     main fast-forwarded 3a551e7 → 96da594 (Gold weapon), pushed. Then added simple round eyes (dark iris + small light catchlight) to Silver's face in both MEMBER_SVG (battle-stage size) and PORTRAIT_SVG (chip size), positioned between the forehead goggles and his smile. Goggles, light skin (#e7c39a), curls, weapon all untouched.
- Learned: When a portrait is a smaller re-drawing of the same face (not a CSS scale of the same SVG), new features need their own hand-placed coordinates scaled to that portrait's face-circle radius, not copy-pasted.
- Gotchas: None — seeded A/B vs the newly-merged main byte-identical, zero console errors.
- Next:    Awaiting hub sign-off on ?v=se1. Not starting the enemy redesign or any other phase.

## [2026-07-11] — Phase 1V-ENEMIES: full enemy roster redrawn to reference
- Goal:    Redraw every enemy SVG (regulars + bosses) to match the attached dieselpunk reference art — one visual family, possessed-human bosses with a shared teal-glow tell.
- Did:     Fast-forwarded main to 3e0a90e (Silver eyes) per phase framing, then redrew the full reachable roster in one pass (checkpoint allowed stopping after regulars, but the set stayed manageable so both landed together). REGULARS: Barnacle Cur (H) — barnacle-crusted shell, oversized jagged claw + smaller claw, thin jointed legs, smokestack+wisp, glowing teal eyes on stalks; Interceptor Droid (I) — re-paletted to teal eye-lenses/visor + added rivets + exhaust stack; Beacon Spoonbill-Rig (L) — restyled from a soft pink bird into a riveted wader-mech with a teal lamp-beak; Barnacle Scrapper (S) and Time-Rust Scavenger (K) — brand new SVGs (previously emoji-only); Steam-Vent Turret (E) and Chrono-Diver Brute (J) — palette/rivet touch-ups for family consistency (kept their existing strong silhouettes). BOSSES: The Angry Fisherman (G) — CRITICAL fix, brand new SVG turning him into an actual possessed sea captain (hat, ragged coat, beard, glowing eyes, oversized rod+reel) instead of having no SVG at all (fell back to a fishing-pole emoji); The Baron (A) — refined with glowing teal eyes + pocket-watch glow; The Corrupted Retiree Golfer (Q) — full redraw: flat cap, abstract-diamond knit vest, rolled sleeves with glowing crack lines, glowing orb, ornate club; The Cursed Boxer (X) — brand new SVG, wiry possessed boxer with crack lines and oversized gloves (previously emoji-only). Mako Shark (M) and the four unreachable enemies (C, V, story bosses 1/2/3/4) left untouched — Mako isn't human so the possession tell doesn't apply, and the others never spawn in any live map.
- Learned: `buildEnemies()` already reads `ENEMY_SVG[ch]` (and `ENEMY_SVG[a.svg||ak]` for adds) with no other wiring — adding/replacing entries in that one object is enough to reskin an enemy everywhere it fights, no other code touched.
- Gotchas: None major — seeded A/B sim vs the merged main came back byte-identical on the first try, confirming the "art only" boundary held even across 11 rewritten SVGs.
- Next:    Awaiting hub sign-off on ?v=enemies1 — iterate on individual enemies (Baron's coat silhouette is a candidate for a follow-up polish pass) once reviewed.

## [2026-07-11] — Phase 1V-SYNC: audit, Golfer frown fix, merge all art to main
- Goal:    Player reported the live game (main) still looked old — audit found the full enemy redraw was still stuck on the branch, never merged. Fix the Golfer's smile (should be grim/possessed), then sync everything to main.
- Did:     Audit confirmed main already had the crew redraw + Gold's sword + Silver's eyes (merged in earlier sessions); only the enemy redesign commit was missing. Fixed the Golfer's mouth path — the old curve bulged toward its control point below the endpoints (a smile/"cup" shape); inverted it to bulge above the endpoints (a frown/"dome" shape) and darkened the stroke for a grimmer read. Fast-forward merged the branch to main.
- Learned: for an SVG quadratic bezier mouth `M x1 y1 Q cx cy x2 y2`, whether it reads as a smile or frown depends only on whether the control point's y is larger (smile — curve dips below the corners) or smaller (frown — curve arches above the corners) than the endpoints' y.
- Gotchas: This phase is a good reminder to always fast-forward main at the START of a new art phase once work is approved, rather than letting merges pile up unmerged across sessions — the player-visible drift is what triggered this whole sync phase.
- Next:    Awaiting next direction. main and the feature branch are now in sync.

## [2026-07-11] — Phase 1V-BRIEFING-SCENES: situation art on the opening slides
- Goal:    Fill the big empty black area above each Planck Agency dossier card with a CSS/SVG "situation scene" for that character, reusing existing crew/enemy art — no new characters, no new assets.
- Did:     `.room` is a bottom-anchored flex column (case-tab/paper/dots/btns hug the bottom); added `.br-scene` as the ONE flex-grow child so it fills whatever space is left above them — exactly the space that used to just be empty. Built a small composition toolkit (bsGold/bsMember/bsFoe helpers) that drops the EXACT existing `#player` SVG / MEMBER_SVG / ENEMY_SVG markup into scene-scoped `.bs-*` positioned divs (new classnames, zero shared CSS with `.foe`/`.ally`, so the battle stage can't be touched by this). Six scenes: GOLD alone on a flooded pier with a skyline silhouette; SILVER facing the Angry Fisherman; PLATINUM facing the Cursed Boxer; TITANIUM swarmed by 3 Interceptor Droids; a new BARON TEASER slide (dim top-hat silhouette + cane, flanked by two full-color glowing droid escorts — "you can see his machines, not him"); and DELTA as a near-total blackout silhouette of the Golfer with only his glowing possessed eyes + orb-hand glow visible (CSS `filter:brightness(0)` + opacity on the reused Golfer SVG, with small teal radial-gradient dots layered on top at the eye/hand coordinates). Added the Baron slide as a full 7th BRIEFING_PAGES entry (not folded into Delta) since the dot/progression code is already fully array-length-driven — zero risk.
- Learned: for an absolutely-positioned child to size itself as a percentage of ITS OWN wrapper (not the whole scene) — needed for placing tiny glow dots exactly on a silhouette's eyes — the wrapper just needs `position:absolute` already set (which `.bs-fig` has), so nested `position:absolute` children automatically use that as their containing block.
- Gotchas: My own verification script's slide-progression assertion was miscounted (it compares brIndex sequence but the loop's timing let a couple of extra polls past `openBriefingDoor()`'s 1200ms transition sneak in) — re-ran with exact single-tap timing and confirmed the real behavior (7 pages in order, 7th tap on the last page opens the door to the overworld) was correct all along; not a game bug, a test-harness miscount.
- Next:    Awaiting hub sign-off on ?v=scenes1.

## [2026-07-12] — Phase 1W-OVERWORLD-ALIVE: SVG map tokens + pre-recruit crew pacing
- Goal:    Make the overworld match the redrawn battle art (roster chips + crew/enemy
           map tokens as CSS/SVG) and let recruitable crew pace their little loops
           BEFORE recruitment. Visual + ambient only — combat/balance/saves locked.
- Did:     index.html only, on branch claude/dieselpunk-rpg-game-21nkt7. Added
           TOKEN_SVG: every character/enemy map token (crew N/D/R, patrols S/K/L/H/E/J,
           bosses G/X/A/Q/M) now mounts the SAME battle SVG art at tile size — crew via
           MEMBER_SVG, enemies via ENEMY_SVG — in both the static grid (renderOverworld)
           and the glide overlay (renderMovers), cached via dataset.tok so innerHTML is
           only written on change. Scenery, salvage and glow emoji untouched; player
           sprite untouched. Roster chips already used PORTRAIT_SVG (shipped in 1V) —
           enlarged them (~2x) so the faces read at chip size; active/dashed-gray states
           kept. Pre-recruit pacing: removed the recruited[] gate in buildCrewPacers
           (recruitment still triggers on contact because the map char moves WITH the
           pacer) and made rebuilds restore the old tile first so recruiting mid-pace
           can't strand a ghost char. Unrecruited crew movers get a cyan "come talk to
           me" glow pulse (filter-based; a scale pulse would fight the glide transform),
           static under reduced motion.
- Learned: "dataset" = per-element data-* storage; we use it as a tiny cache key so we
           don't re-parse SVG strings every frame. A CSS transform animation REPLACES
           the element's transform, so pulsing a glide-positioned sprite must use
           filter/drop-shadow, not scale.
- Gotchas: The 200-run seeded A/B first looked like the pacer "didn't move" — it was a
           sampling alias (a 2-tile ping-pong is back home every even tick). Playwright's
           npm package wanted a newer browser than the container ships; fixed by
           launching with executablePath /opt/pw-browsers/chromium.
- Verify:  Seeded 200-run full-loop sim (rebuilt Node vm harness, exposed-foe policy):
           trace sha256 4f010618… IDENTICAL main vs branch (3388 lines, 0 stalls/errors)
           — zero combat drift. Per-encounter: districts/mini-bosses/Baron 200/200,
           Golfer 12/200 with the basic no-stun policy (drift check, not a balance run).
           Playwright at 390px + 430px: no console errors; tokens + chips render; pacers
           move pre-recruit, hold still under prefers-reduced-motion, and walking into a
           pacing NPC still opens the recruit dialogue (PASS).
- Next:    Awaiting Andres' sign-off on the ?v=alive1 preview. Do not merge; no new
           phase until asked.

## [2026-07-16] — Bookends redo, crew screen, living world, artifacts, and the 10/10 pass
- Goal:    A long run of phases: redo the two briefing bookend slides (map + golfer
           silhouette), audit Gold's canon text, add a crew stats screen, make the
           overworld feel alive (NPCs/props/zone labels), build the artifact system
           with a portable save, then do a full audit + polish phase (banter,
           reactive epilogue, QoL, boss intro cards). Everything merged to main.
- Did:     All in index.html, one branch per phase, each merged after sign-off:
           * 1V-BOOKENDS-2 — dispatch slide got a real 1947 Palm Beach County map
             (rail yard → downtown grid → drawbridges → fractured barrier island →
             Atlantic); Delta slide got a purpose-built angry-golfer silhouette
             (flat cap, scowl eyes, raised driver). Merged (f6c1e9d).
           * 1V-GOLD-CANON — merged the approved overworld-alive branch (4952d52),
             then searched every string for veteran/inventor framing of Gold:
             none found, zero text changes needed.
           * Phase 7 — "👥 CREW" button (flood-bar row; the top HUD had no room at
             390px without squeezing the gauges) opens a read-only Crew Manifest:
             live HP/FUE/SPC meters, ATK/DEF/CRIT, weapon, upgrade slots,
             legendary state, ultimate. Merged (8b3e174).
           * 1X-WORLD-ALIVE — 17 talkable townsfolk (4 per zone + Scoop the
             recurring courier), all with pre/post-boss dialogue sets and SVG
             portraits; zone-name chip; one batched SVG prop layer per zone.
             Merged (2df66f6).
           * 1Y-ARTIFACTS — 9 hidden accessories with tool-like effects (act
             first, survive lethal once, faster team ult, treasure glint, etc.),
             one Artifact slot per member in the Crew Manifest, and the
             documented CREW-SAVE SCHEMA v2 so artifacts survive into future
             volumes. Merged (0625ac9).
           * 1Z-TENOUTOFTEN — Part A audit found (and Part B fixed) a real bug:
             the Mako Tooth was hidden in a zone you can never revisit. Also:
             12 crew banter beats, a Fallout-style epilogue that reacts to your
             run, battle speed 1×/2×, autosave chip, LEADS objective line, and
             boss intro cards. Merged (e9ae7b0). File now ~378 KB.
- Learned: "Fast-forward merge" = main just slides forward to the branch tip; no
           merge commit, so history stays a straight line. "Additive save field" =
           new keys old saves simply don't have — loaders default them, nothing
           breaks. A seeded RNG makes two sim runs produce byte-identical output,
           which is how we PROVE a change didn't touch combat. vm "lexical scope"
           gotcha: top-level let/const in the loaded game script aren't visible as
           sandbox properties — you reach them by evaluating code inside the
           context instead.
- Gotchas: The HUD wrapped at 390px when the crew button lived there (gauges
           shrank 97px→72px) — moved it to the flood row instead. Glow divs
           placed AFTER an SVG in the DOM painted over the clubhead (hollow-ring
           bug) — order matters. "Head Out" looked broken in a test but was just
           the 1200 ms door-glow delay. And the audit's best catch: content can
           be unreachable without ever throwing an error (dead NPC_LINES,
           unreachable Mako Tooth) — only tracing the actual player path finds it.
- Verify:  Every phase: seeded 200-run sim byte-identical to main (1Z also proved
           it at 2× speed), 6-7 regression suites green, Playwright at 390×844
           (once also 430px) with zero console errors, reduced-motion audits, and
           save round-trips incl. old-format and unknown-artifact-id saves.
- Next:    Volume 1 is feature-complete and polished on main (e9ae7b0). Nothing
           pending, no phase in flight. Good point for /clear. Ideas parked in
           the Vault (elemental weakness, MP/TP, CTB order, county overworld)
           still need explicit go-ahead before building.

## [2026-07-23] — Music rescue, GitHub Pages, and the lived-in world pass
- Goal:    Get the shipped game playable WITH music from a real link; then an
           ultracode visual pass — a more lived-in world (cars by houses, varied
           trees, ambient life) without touching balance. Plus distribution
           extras: README, share previews, home-screen install.
- Did:     (1) Diagnosed "no music": the MP3s live in /audio beside index.html,
           so the bare file and raw.githack (which throttles ~5 MB files) played
           silent. Shipped a zip, then set up GitHub Pages: the old pages.yml
           failed on every run (the workflow token can't flip the Pages admin
           switch), so we pushed main to a branch named gh-pages — GitHub
           auto-enables Pages for that name — and rewrote pages.yml to mirror
           main→gh-pages on every merge. Site: andjaccep-letscreate.github.io/
           Salt-and-Diesel-The-ballad-of-ocean-breeze. (2) 17-agent workflow
           (recon → 5 design lenses → synthesis → 3 implementers → 4 verifiers →
           fix round) added: 26 new SVG dressing props (1940s sedans/pickup,
           wagons, mailboxes, laundry lines, refinery stacks, rowboats, benches),
           ~90 placements across the 4 zones, per-zone tree variants (palms/
           pines/oaks by coordinate hash), facade window-lighting variance,
           water surf-lips, ground mottle, oil stains, RM-gated micro-motion
           (gulls, smoke, fireflies, neon flicker, fountain spray), and emoji
           fixes (⚔/🛡 gained VS16; tofu-risk 🛞 → ⚙️). (3) README refresh,
           OG/Twitter share tags, PWA (manifest + sw.js + icons) for
           "Add to Home Screen" + offline play.
- Learned: "GitHub Pages" = free static hosting from a repo branch. A branch
           literally named gh-pages auto-enables it — no admin click needed.
           "Service worker" = a small script the browser installs that caches
           files, so the game loads offline after the first visit. "Open Graph
           tags" = metadata chat apps read to show a link preview card. An
           adversarial-review agent caught the pass's one real bug: the surf-lip
           CSS painted on the opposite edge from the tiles the JS tagged.
- Gotchas: The big workflow died twice mid-run (session usage limit, then an
           interrupt) — resumeFromRunId revived it from cache both times, zero
           work lost. The permission system blocks remote branch deletion, so
           the 12 stale merged branches are listed for manual cleanup (SHAs in
           the log here: 89b3568 act1-content-swap, 883fbd4 act2-content-swap,
           84e4b5b act3-plus-ui-fixes, 0625ac9 artifacts, f6c1e9d
           briefing-bookends-2, 84e4b5b dpad-salvage-fix, 89b3568
           phase-5b-salvage, 865c714 phase1-world-redesign, 8b3e174
           phase7-crew-screen, b01bfd6 session-log-act2, e9ae7b0 tenoutoften,
           2df66f6 world-alive).
- Verify:  Seeded 200-run battery byte-identical vs HEAD (sha256 match on 1,400
           battle traces) = zero combat drift; 200/200 on every boss + full
           loop, 0 exceptions; emoji audit 0 ZWJ / 0 compounds; Playwright
           before/after shots of all 4 zones at 390×844 with zero console
           errors, before AND after the fix round.
- Next:    Branch claude/dieselpunk-rpg-game-21nkt7 pushed, preview link sent.
           Awaiting Andres: play the preview → "merge it" (auto-deploy then
           updates the live site) or request changes. Optional manual chore:
           delete the 12 stale branches on GitHub.
