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
