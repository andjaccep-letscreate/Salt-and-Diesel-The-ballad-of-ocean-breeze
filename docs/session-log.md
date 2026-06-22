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
