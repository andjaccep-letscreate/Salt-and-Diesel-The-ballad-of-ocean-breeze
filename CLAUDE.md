# CLAUDE.md — Salt & Diesel: The Ballad of Ocean Breeze

> Claude reads this file at the start of every session. Keep it tight and
> high-signal: everything in here is re-sent on every turn, so a bloated
> CLAUDE.md quietly burns the usage budget.

---

## About this project
Single-file, browser-playable turn-based RPG. All code — HTML + CSS + vanilla
JS — lives in `index.html`. No build step, no dependencies, no external assets.
Run it by opening `index.html` in a browser. There is no automated test suite;
verify changes by playing the game in the browser.

---

## How I want you to work

### Plan before doing
- For anything beyond a trivial one-file change, propose a short numbered plan
  and wait for my OK before editing. (Plan mode: Shift+Tab.)
- I'm new — in the plan, flag which steps are risky or hard to undo.

### Evidence before claims
- Never say "done," "fixed," or "tests pass" without running the real command
  and showing the output. If you didn't run it, say so plainly.
- Use the smallest test that proves the change works.

### Keep context lean (this protects my usage limit)
- Read only the files needed for the task. Don't re-read files already in context.
- `index.html` is large — read the relevant section, not the whole file.
- For "find all the X" / exploration / research, use a subagent so only the
  distilled findings come back — don't dump every file into our main thread.
- Batch related edits into one turn instead of many small round-trips.
- When a chunk of work is done, tell me to run `/clear` before we switch tasks.
- Before token-heavy operations (full-repo scans, big refactors, long or
  repeated test loops), warn me it's expensive and confirm before running.
- Don't load large MCP/tool sets unless needed — heavy tool definitions eat the
  context budget before any real work starts.

### Model use
- Reserve the strongest model for planning and tricky reasoning; use a lighter
  model for routine/mechanical work. Tell me when switching saves budget (`/model`).

### Teach me as you go (I'm a beginner)
- The first time you use a new command, tool, or concept, add a one-line
  plain-English note on what it does and why. One sentence — no lectures.
- Define jargon the first time it appears.
- Warn me before anything risky, not after.

---

## Learning log (important to me)
Keep a running log of our work at `docs/session-log.md` — a separate file, NOT
inside CLAUDE.md (so it never bloats the per-session context).

At the end of each work session, or right before I `/clear`, APPEND one entry:

```
## [YYYY-MM-DD] — <short title>
- Goal:    what we set out to do
- Did:     what actually changed (files touched, commands run)
- Learned: new concepts/commands, one plain-English line each
- Gotchas: anything that surprised us or broke, and the fix
- Next:    where to pick up next time
```

Rules for the log:
- Append only. Never rewrite or delete old entries.
- Beginner-friendly language; briefly explain the "why."
- Write it to the file, not into chat, to save tokens.
- If I say "log this," do it right away.

---

## Guardrails (don't do these without explicit say-so)
- Don't deploy, push to a main/master branch, or run destructive commands.
- Don't refactor beyond what I asked.
- Don't commit secrets/API keys. Flag them if you spot any.

## Project hard rules (Salt & Diesel — always apply)
- One self-contained `index.html` (inline CSS + vanilla JS; no libraries, no external assets; backdrops are pure CSS/SVG).
- Emoji icons: single-codepoint or VS16 only — never ZWJ or compound emoji.
- Mobile-first; deterministic; lock input when it isn't the player's turn; respect `prefers-reduced-motion`.
- Do NOT change combat balance / stats / formulas unless that is the explicit goal of the phase (e.g. the Phase 5 party rebalance). When a phase DOES change balance, re-run the full balance sim and report before/after numbers.
- Verify headlessly with a ~200-run full-loop simulation before every merge; report stat-drift explicitly. No "done/fixed/verified" without real command output.
- Workflow: build on a branch → give a `raw.githack` `?v=N` preview link → merge only after Andres confirms. One phase at a time; never start the next phase without being asked.
- Teach-as-you-go: when introducing a new command or term, add a one-line plain-English note (Andres is a learner / non-coder).

## What this game is (series framing)
- Salt & Diesel is an episodic anthology. This build = **Volume 1: Florida, Episode 1** — 1947 West Palm Beach, dieselpunk, top-down overworld + turn-based combat; hero Larry "Sparkplug."
- Setting = grounded real WPB with light cyan "Aethel-Diesel" flavor (cosmetic). Real Palm Beach County landmarks may appear as fantasy-named zones; do not invent a generic fantasy world.
- Future episodes reuse this engine; the crew keeps tools/artifacts, not inflated stats (level-band + sync-down). Do NOT build episodic save / level-sync plumbing until explicitly asked.

## Roadmap pointer
- Phases 1–4 are LIVE (WPB map; Florida-animal enemies + bolt sword; side-view battle stage; graphics + cyan blend).
- Phase 5 = the 4-member party + Arsenal — build only when handed the party design file (`claude-code-party-system-prompt.md`). It WILL change balance, so rescale the boss and re-verify.
- Deeper systems (elemental weakness, MP/TP, CTB turn order, isometric, county overworld) are banked in the Vault — do not build without explicit instruction.
