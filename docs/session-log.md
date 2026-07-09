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
