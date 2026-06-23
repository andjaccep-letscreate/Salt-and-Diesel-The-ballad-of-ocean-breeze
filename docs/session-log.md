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
