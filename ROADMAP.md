# Salt & Diesel — BUILD ROADMAP (the single source of truth)

> Sequences the overhaul into phases shipped one at a time, each with a verification gate.
> Repo: `andjaccep-letscreate/Salt-and-Diesel-The-ballad-of-ocean-breeze`, game = `index.html` at root.
> Workflow: hand a phase to Claude Code → it verifies → preview the `?v=` link → then merge.

## Standing rules (every phase)
One self-contained `index.html`, inline CSS + vanilla JS, no libraries/build/external assets.
Emoji icons single-codepoint or VS16 only — **no ZWJ/compound** (pre-verified; table at bottom).
Mobile-first, deterministic, input locked when it isn't the player's turn or while any animation
plays. Respect `prefers-reduced-motion`. Comment combat math, movement/camera/collision, and new
engine code. **Don't change balance unless the phase says so.** Verify headlessly, then
**branch → preview `?v=` link → only then merge**.

## Verification doctrine (every phase)
1. **Headless full-loop sim** (Node + DOM/Web-Audio/localStorage stub), ~200 runs → no exceptions.
2. **Two-direction reachability** for map changes: each district reachable when its gate opens, none before.
3. **Monte-Carlo balance** for combat changes: report win-rate on smart play (~95–99%); careless play can lose.
4. **Codepoint check** every emoji (single or VS16, no ZWJ).
5. **Save migration**: old saves load without crashing after any save-shape change.

---

## STATUS (live)
- **Phase 1 — World Map** ✅ done & verified (`claude/master-overhaul`)
- **Phase 2 — Enemy Redesign + Bolt Sword** ✅
- **Phase 3 — Battle Environment (face-off stage)** ✅
- **Phase 4 — Performance + Graphics** ✅
- District arrival banners (master §6) ✅
- **Phase 5 — Party System** ⏳ NEXT (needs companion file `claude-code-party-system-prompt.md`)
- Phases 6–9 ⏳ pending

Preview of Phases 1–4:
`https://raw.githack.com/andjaccep-letscreate/Salt-and-Diesel-The-ballad-of-ocean-breeze/claude/master-overhaul/index.html`

---

## PHASE 1 — World Map  *(low risk, data swap)* ✅
Replace `ORIGINAL_MAP` with the WPB-geography 24×30 grid (mainland west · lagoon · island east via
drawbridge). Balance: none. Verify: two-direction reachability + full loop.

## PHASE 2 — Enemy Redesign + Bolt Sword  *(visual identity)* ✅
Florida-animal dieselpunk enemies with their own SVG sprites; reforge Larry's weapon into the bolt
sword + attack animation. Balance: none. Verify: full loop + emoji check.

## PHASE 3 — Battle Environment (face-off stage)  *(depends on Phase 2)* ✅
Side-view stage, hero left / enemy right, both lunge & animate on attack; per-district CSS
backdrops. Balance: none. Verify: full loop + input locked during BOTH animations + reduced-motion.

## PHASE 4 — Performance + Graphics  *(foundation refactor)* ✅
rAF/where-needed loop, object-pool damage numbers & particles, viewport tile-node pooling, pause on
`visibilitychange`, debounce resize; parallax backdrops, drifting dirigible, water shimmer, optional
film-grain/scanline toggle. Balance: none. Verify: full loop + gated when tab hidden.

## PHASE 5 — Party System (Final Fantasy–style)  *(the big one — sub-phase it)*
Full design in `claude-code-party-system-prompt.md`. **Changes balance — rescale & re-verify.**
- **5a — Turn engine + HUD:** party rounds, target selection, front/back rows, party HUD, one recruitable friend.
- **5b — Skill trees:** per-character branching tree, 1 SP/level (~3 SP by boss → specialize). Unit-test prereqs / no overspend / no double-unlock.
- **5c — Limits, combos, status:** Limit-Break gauge ⚡, chain combos (Flare Mark → big hit), Shock/Rust/Overheat/Mark/Overclock.
- **5d — Full roster + rebalance:** recruit three friends via 📰/👷/🔮 tiles; rescale (boss ≈420 HP + AoE "Tail Sweep" + phase 2 < 50%; 1–2 adds to district fights). Report win rates per fight.

## PHASE 6 — Progression Economy
"Sparky's Garage" shop spending **salvage-scrip** (fight drops) on accessories (lucky cog = +crit),
weapon-tier upgrades, extra repair kits, skill respec. One accessory slot per member. Balance: yes
→ keep ~95–99% winnable; report. Verify: full loop + economy can't go negative + respec conserves SP.

## PHASE 7 — Quality of Life  *(cosmetic, low risk)*
Minimap toggle, objective tracker, case-file bestiary, district weather (rain at docks/haze in
yards), short procedural victory melody. Balance: none.

## PHASE 8 — Creative Expansion  *(optional)*
- 🌀 "The 1947 Storm" act-3 setpiece *(cosmetic + framing)*
- 🌊 Tide hazard at the docks *(balance — verify)*
- 🎴 Fortune-teller boons, deterministic choice *(balance — verify)*
- 🏅 "Front-Page Headlines" achievements *(cosmetic)*
- 📻 "Ballad of Ocean Breeze" radio-drama chapter cards *(cosmetic)*
- ☀️🌙 Day/night tint *(cosmetic)*
- New Game+ / Boss Rush *(balance — verify)*

## PHASE 9 — Production Polish & "Next Level"
**9A Foundational robustness:** seeded deterministic RNG (reproducible bugs + free Daily Challenge);
crash-safe error boundary; save resilience (backup slot + validation + migration); in-game self-test
panel; device performance scaling.
**9B Game feel/juice 💥:** hit-stop, camera zoom on Limits/phase change, speed-lines, snappier
pacing, mobile haptics (`navigator.vibrate`, optional).
**9C Adaptive audio 🎵:** layered state-aware music (explore/battle/boss/low-HP stinger), per-character
leitmotifs, victory theme; crossfade; honor existing toggles.
**9D Accessibility ✨:** colorblind-safe palette, text-size slider, high-contrast, large-tap mode,
animation/flash/shake/haptic toggles, on-screen labels, Assist/"Story" difficulty.
**9E Visual cohesion:** design-token system, animated neon title logo, polished transitions.
**9F Marquee content & replay:** 🦑 hidden superboss "The Lagoon Leviathan" *(balance — verify)*;
🔗 Limit Links / duo Limit Breaks *(balance — verify)*; 🏆 Daily Seed Challenge; run-summary case-file.
**Order:** 9A first, then 9B/9C/9D/9E in any order, then 9F.

---

## Master emoji reference (pre-verified: single-codepoint or VS16, no ZWJ)
**Enemies:** 🕷️ spider · 🐢 turtle · 🦈 shark · 🐊 croc · 🦩 spoonbill · 🦀 crab.
**Party:** 🕶️ Larry · 🔱 Vanguard · 🎯 Deadeye · 🔧 Tinker · ⚙️ turret · ⚡ limit gauge.
**Creative/system:** 🌀 storm · 🌊 tide · 🎴 fortune · 🏅 headline · 📻 radio · ☀️/🌙 day-night ·
📰 newsboy · 👷 dock worker · 🔮 fortune-teller · ⚓ anchor.
**Phase 9:** 💥 hit-stop · 🎵 audio · ✨ accessibility/polish · 🦑 superboss · 🔗 Limit Link ·
🏆 daily challenge · 📸 photo/snapshot.

## Companion files
- `salt-and-diesel-MASTER-prompt.md` — detailed prompts for Phases 1–4 (+ banners).
- `claude-code-party-system-prompt.md` — full Phase 5 design (NEEDED to build Phase 5 to spec).
- `PROJECT_BRIEF.md` — paste-ready context for collaborating on prompts.
