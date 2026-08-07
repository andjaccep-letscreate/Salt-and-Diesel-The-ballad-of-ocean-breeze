# SALT & DIESEL — Project Brief (paste this into a chat to start collaborating)

> Copy everything below the line into a new chat. It gives the assistant the full
> context it needs to help you write good prompts and make changes to the game.
> Rewritten 2026-08 after the 1F-COPACETIC launch audit; the build is the truth.

---

## 1. WHAT THIS PROJECT IS
**Salt & Diesel: The Ballad of Ocean Breeze** — a complete, browser-playable,
turn-based RPG with an explorable top-down 2D overworld, set in **dieselpunk
West Palm Beach, 1947**. This build is **Volume 1: Florida, Episode 1** of an
episodic anthology; future volumes reuse this engine. You play **Larry
"Sparkplug"**, a freelance troubleshooter who recruits a four-man crew to take
down Baron Castellane's syndicate across four flooded zones of Palm Beach
County. About 90 minutes of core story.

**Live site (serves `main`, auto-deploys on merge):**
`https://andjaccep-letscreate.github.io/Salt-and-Diesel-The-ballad-of-ocean-breeze/`
Repo (public): `andjaccep-letscreate/Salt-and-Diesel-The-ballad-of-ocean-breeze`

## 2. HARD RULES (never break these — restate them in prompts)
- **One self-contained `index.html`** (inline CSS + vanilla JS, no libraries,
  no build step). The ONLY approved external assets are: `audio/` (three MP3
  music tracks), `icons/` + `manifest.webmanifest` + `sw.js` (PWA install +
  offline), and repo docs. All in-game art is hand-coded CSS/SVG.
- **Emoji are single-codepoint or base+VS16 only. Never ZWJ/compound.**
- **Mobile-first** (390px is the reference width; desktop verified too), large
  tap targets, no horizontal scroll, grid movement (one tile per input).
- **Deterministic**: render-time variety must hash from coordinates, never
  `Math.random()`; lock input when it isn't the player's turn.
- **Don't change combat balance** unless that is the explicit phase goal —
  combat hot zones: `ENEMIES`, `ABIL`, `dealTo`, `critRoll`, `winBattle`,
  `endOfRound`.
- **Respect `prefers-reduced-motion`** — every animation gates off.
- **Verify before shipping** (see §7) — no "done/fixed" without real output.

## 3. WORLD (as built)
Four zones, each a **24×18 tile map** (array of strings, one char per tile)
with an **11×13 camera** clamped to map edges, zone palettes, decorative
SVG "dressing" props, and ambient NPCs:
- **Lake Worth Beach** (coastal) — docks, palms, the Angry Fisherman boss.
  Titanium's weapon-upgrade glow tile is HERE (not Palm Island).
- **Wellington** (cane country) — refinery, hay wagons; Silver's glow here.
- **Downtown WPB** (urban, 30% flooded) — the **Baron droid-puzzle is on the
  Downtown bridge**; Platinum's glow here.
- **Palm Island** (luxury, 5% flooded) — the Corrupted Retiree Golfer finale;
  Gold's glow here. Post-Golfer, a Shadow World variant unlocks (Mako Tooth
  artifact at 20,14).
Fight keys, in story order: `G` (Fisherman) → `1` → `X` (Cursed Boxer) → `2` →
`3` → `A` (Baron) → `Q` (Golfer).

## 4. CREW & COMBAT (build truths — docs elsewhere may be stale)
Crew of four, ALL MEN: **Gold** (leader; origin deliberately unknown — never
give him a backstory), **Silver**, **Titanium**, **Platinum**. Recruited in
story order; stats/equipment visible on the Crew Manifest screen.
- **Silver's Payload Selector ammo (5):** Kinetic / Net / Magnetic / Flak /
  Incendiary.
- **Titanium's legendary "Fear Aura":** on his hits, each surviving foe has an
  independent **30% chance of a 1-turn stun**. (NOT an accuracy debuff, NOT a
  50% stun-all — the code is the canon.)
- **Post-boss salvage:** player picks a stat (ATK/DEF/maxHP) and a crew member;
  +5 (+8 for the Golfer's Prime Artifact). Verified 51/51 to honor the choice.
- The only correct artifact name is **"Prime Artifact Ball"** (never "Core").
- Measured contribution shape (200-run sim): Gold heaviest damage, Titanium
  heavy where present, Silver respectable, Platinum lowest damage + ~80% of
  healing. Legendaries unlock after the Golfer falls.

## 5. AUDIO
Three MP3s in `/audio/`: title theme "Salt and Diesel", overworld "Sodium
Tide", battle "Saltwater Rail Yard". Web-Audio graph with scheduled equal-power
crossfades; synthesized SFX; audio unlocks on first tap (browser autoplay
policy). Settings has master mute + SFX/Music toggles + volume.

## 6. SAVES & PWA
- Autosave to `localStorage` key `salt_diesel_save_v3` (v1/v2 saves are
  deliberately discarded with a clean fresh start). Portable crew-save
  (crewSchema 2) carries artifacts forward for future volumes.
- `sw.js`: **network-first for the game shell** (players always get the newest
  deploy; offline falls back to cache), cache-first for music/icons. Installable
  to phone home screens via `manifest.webmanifest`.

## 7. HOW IT'S TESTED & DEPLOYED
- **Headless sim**: the game's `<script>` runs in Node `vm` with a stub DOM;
  a seeded ~200-run battery drives every boss and the full loop (target:
  100% smart-policy wins, 0 exceptions). Text-only changes must produce
  byte-identical seeded traces. Always ask for this before shipping.
- **Browser**: Playwright at 390×844 (and 430px / desktop sizes) — zero console
  errors, no horizontal scroll, reduced-motion audit.
- **Deploy**: merge to `main` → GitHub Action mirrors `main` to `gh-pages` →
  Pages publishes automatically. Branch previews:
  `https://raw.githack.com/<repo>/<branch>/index.html?v=N` (bump N to bust
  cache; music may be throttled on githack — that's normal, Pages serves it).
- **Change flow**: develop on a branch → preview link → merge only after
  Andres confirms. One phase at a time.

## 8. HOW TO WRITE A GOOD PROMPT FOR THIS PROJECT
1. **Goal** in plain terms. 2. **Where** (system/function if known).
3. **Constraints reminder** — "one self-contained index.html, single-codepoint/
   VS16 emoji only, mobile-first, deterministic, don't touch combat balance."
4. **Verify** — "run the seeded 200-run sim + a Playwright pass before shipping."
5. **Ship preference** — "preview on a branch" (default) or "merge and deploy."

## 9. BANKED IDEAS (the Vault — do NOT build without explicit go-ahead)
Elemental weakness system · MP/TP resource split · CTB turn order · isometric
view · county-wide overworld · episodic level-band/sync-down plumbing.
Pending small decisions: "Tail Sweep" rename (dead code today), Inez Vega
arm-count line (defensible as-is).

---
*Tip: paste this once at the start of a chat, then just give the goal. If a
chat seems to have lost context, paste it again.*
