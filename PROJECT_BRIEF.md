# SALT & DIESEL — Project Brief (paste this into a chat to start collaborating)

> Copy everything below the line into a new chat. It gives the assistant the full
> context it needs to help you write good prompts and make changes to the game.

---

## 1. WHAT THIS PROJECT IS
A complete, single-file, browser-playable **turn-based RPG with an explorable top-down
2D overworld**, themed as **dieselpunk West Palm Beach, 1947**. The whole game is ONE
self-contained file: `index.html` (inline CSS + vanilla JavaScript). No build step, no
frameworks, no external files or images. You play **"Sparkplug" (real name Larry)**, a
freelance troubleshooter with a hydraulic wrench taking down Baron Castellane's syndicate.

## 2. HARD RULES (never break these — always restate them in prompts)
- **One self-contained `index.html`.** Inline CSS + vanilla JS only. No libraries, no
  build, no external assets/images/fonts/audio files.
- **Icons are emoji only** — single-codepoint (VS16 like 🕶️ is fine; NO ZWJ/compound).
- **Mobile-first:** tiles scale to screen width, no horizontal scroll, large tap targets.
- **Grid-based movement, no physics/gravity/jumping** — one tile per input.
- **Deterministic, bug-free logic.** Disable inputs when it isn't the player's turn.
- **Comment the combat math and the movement/camera/collision code.**
- **Don't change gameplay balance** unless that's the explicit goal.
- **Always verify before shipping** (see §8) and keep the game winnable but not trivial.

## 3. THEME / CHARACTERS
Art-deco towers, dirigibles over the Intracoastal, brass and rust. Dark slate/black UI
with brass/amber accents, uppercase wide-letter-spacing headers, a monospace "telemetry"
battle log, riveted "pressure gauge" HP/Fuel bars. Hero avatar is 🕶️ (now drawn as an
inline SVG sprite). Villain: **Baron Castellane** and his "Leviathan" walking mech.

## 4. WORLD MAP (how the overworld is built)
- A **24-wide × 30-tall** grid stored as an array of strings, `ORIGINAL_MAP`, one
  character per tile. The working copy `map` is a 2D array of chars that gets mutated
  (cleared landmarks, opened gates, taken pickups).
- **Camera** shows an **11×13** viewport, centered on the player, clamped to map edges.
- Player starts at **{y:14, x:11}**.
- **Tile codes:**
  - Walkable: `.` road · `,` grass/park · `=` dock plank · `P` plaza
  - Solid: `B` building 🏢 · `W` water 🌊 · `T` palm 🌴 · `F` fence
  - Story landmarks (walk onto = fight): `1` alley 🥊 · `2` rail yard 🛤️ · `3` docks ⚓ · `4` Comeau Tower 🗼
  - Gates (🚧, solid until opened): `a`→rail yard · `b`→docks · `c`→tower
  - NPCs (talk): `N` newsboy 📰 · `D` dock worker 👷 · `R` fortune-teller 🔮
  - Pickups (one-time): `k` repair kit 🧰 · `u` fuel cache 🛢️ · `o` lucky cog 🔩
  - Patrols (optional, no respawn): `L` lookout 🔦 · `H` scrap hound ⚙️
- **Districts:** Downtown/Clematis (start) · Rail Yards (west) · Docks (east waterfront) ·
  Comeau Tower (climax, north). Map reachability is **BFS-validated**.

## 5. PROGRESSION / GATING
Story fights unlock IN ORDER: **alley → rail yard → docks → tower(boss)**. Clearing one
removes its marker and opens the next gate. The Tower stays locked until all three are
cleared. NPCs, pickups, and patrols are free to do anytime while exploring.

## 6. COMBAT (exact numbers — keep these consistent in prompts)
**Hero start:** HP 60/60, Fuel 6/12, ATK 13, DEF 4, Level 1, XP 0, XP-to-next 30, Repair kits 3.
**Player actions:**
- **Strike** (free): dmg = max(1, ATK − enemyDEF), then ±18% variance, 15% crit ×1.6.
- **Overdrive** (−4 fuel; disabled if fuel<4): max(1, floor(ATK×1.7) − floor(enemyDEF/2)), ±18%, 25% crit ×1.7.
- **Brace**: halves the next incoming hit, +3 fuel.
- **Repair** (−1 kit; disabled at 0): heal 40% of max HP.
- **+1 fuel** regenerates at the end of each enemy turn.
**Enemy turn:** base = max(1, enemyATK − heroDEF), ±18%, 22% "heavy" ×1.4, 10% crit ×1.5;
if hero braced, halve afterward; min 1. ~0.8s delay before the enemy acts.
**Damage order everywhere:** base → ±18% variance → ×crit factor → floor, min 1.
**Level up (on XP threshold):** Level +1, maxHP +10, maxFuel +2, ATK +3, DEF +1,
XP-to-next ×1.55 (rounded), HP & Fuel fully restored.
**Enemies (HP / ATK / DEF / XP):**
- Knuckles Moreau 🥊 38/9/2/28 (alley) · Rust-Bucket Loader 🤖 58/12/5/44 (rail yard)
- Capt. Dredge Voss ⚓ 74/15/6/60 (docks) · **Baron Castellane 🦾 130/19/8/100 (boss)**
- Syndicate Lookout 🔦 30/8/2/18 · Scrap Hound ⚙️ 26/7/1/16 (patrols)
**State persistence:** HP & Fuel carry across overworld and battles. Restored ONLY by
level-up (full), the Fuel Cache pickup (fuel), or the Repair action (HP). No auto-heal.

## 7. WHAT'S ALREADY BUILT (current feature set)
- Explorable overworld: camera, collision, gating, NPCs, pickups, patrols.
- Turn-based battles with the full action set + 3 district fights + boss.
- Screens: **title, cutscene, overworld, battle, reward, victory, gameover**; overlays:
  **dialogue, settings, flash**.
- **Animated hero**: inline SVG "Larry" sprite — 3 views via `data-dir`, leg-bob while
  walking, idle breathing, smooth 0.2s tile-to-tile tween.
- **Textured terrain** (pure-CSS asphalt/grass/planks/plaza/water/buildings) + vignette + haze.
- **Sound**: synthesized Web Audio SFX (no files) via `tone()`/`noise()`; **procedural
  ambient music** via a lookahead scheduler; **settings** = master volume slider, SFX
  toggle, Music toggle, plus a 🔊 master-mute button.
- **Combat juice**: floating damage/heal numbers, particle sparks, screen shake, crit
  white-flash, enemy hit-shake + lunge, enemy entrance pop, low-HP danger vignette.
- **Presentation**: flickering neon title, typewriter text (cutscene + dialogue), screen
  fade transitions, footstep dust, occasional cosmetic enemy taunts, district arrival banners.
- **Save / Continue**: autosaves to `localStorage` (key `salt_diesel_save_v1`); a Continue
  button appears on the title; cleared on victory/defeat. Wrapped in try/catch.
- All animation respects `prefers-reduced-motion`.

## 8. HOW IT'S TESTED & DEPLOYED (important for prompts)
- **Verification**: before shipping, the game's `<script>` is run **headlessly in Node
  with a DOM/Web-Audio/localStorage stub** — it simulates the full loop (movement,
  gating order, all four fights, win/lose, settings, save/continue) over ~200 runs to
  confirm no exceptions and that balance holds. Always ask for this kind of check.
- **Repo** (public): `andjaccep-letscreate/Salt-and-Diesel-The-ballad-of-ocean-breeze`.
  The game is `index.html` at the repo root.
- **Play link** (serves `main` live): 
  `https://raw.githack.com/andjaccep-letscreate/Salt-and-Diesel-The-ballad-of-ocean-breeze/main/index.html`
  Add `?v=N` (bump the number) to bypass the cache after an update.
- **Change flow**: develop on a branch → open a PR → squash-merge into `main` → the play
  link updates. (A GitHub Pages workflow exists but isn't the active host; githack is.)

## 9. HOW TO WRITE A GOOD PROMPT FOR THIS PROJECT
Include these pieces and you'll get clean results:
1. **Goal** — what you want, in plain terms ("add a second enemy attack pattern").
2. **Where** — name the system/function if known (e.g., "in `enemyTurn`", "the battle log").
3. **Constraints reminder** — "keep it one self-contained index.html, emoji-only, mobile,
   no new assets, don't break existing logic or balance."
4. **Verify** — "headlessly simulate the full loop to confirm no errors before shipping."
5. **Ship preference** — "give me a preview link first" OR "merge it live and send the link."

### Copy-paste prompt template
> In the Salt & Diesel game (single self-contained `index.html`), I want to: **<your idea>**.
> Keep all the hard rules (one file, emoji-only/no-ZWJ, mobile-first, grid movement, no
> external assets, deterministic). Don't change combat balance unless I say so. Touch
> **<area/function if known>**. Verify headlessly (full loop + win/lose, no exceptions)
> before shipping, then **<preview on a branch / merge to main and give me the ?v= link>**.

### Example prompts
- "Add a 4th player action 'Vent Steam' that trades 2 HP for +5 fuel; disabled below 3 HP.
  Keep balance roughly the same; verify; preview on a branch."
- "Make the docks district have rain (pure-CSS, respects reduced-motion). No new assets.
  Merge live."
- "Give Rust-Bucket an 'overheat' turn: every 4th enemy turn it skips attacking and logs a
  flavor line. Verify the loop still wins ~99% on smart play. Preview first."

## 10. IDEAS BACKLOG (optional future directions)
New enemy attack patterns / telegraphs · a second area or chapter · animated map details
(streetlights, drifting dirigible over the board) · a minimap · boss phases · a shop that
spends XP · difficulty settings · a proper victory melody.

---
*Tip: you don't need to restate the whole brief every time — paste it once at the start of
a chat, then just give the goal. If a chat seems to have lost context, paste it again.*
