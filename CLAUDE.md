# CLAUDE.md

Guidance for Claude Code working in this repository.

## Project

**Salt & Diesel — The Ballad of Ocean Breeze** is a single-file, browser-playable
turn-based RPG. Everything ships in `index.html` (HTML + CSS + JS, no build step, no
dependencies, no external assets). Open it in a browser to play.

- `index.html` — the entire game (markup, styles, game logic).
- `README.md` — player-facing overview and controls.
- `PROJECT_BRIEF.md` — collaboration/context doc.
- `.github/workflows/` — GitHub Pages auto-deploy.

When editing the game, keep it self-contained: no new build tooling, package
managers, or runtime dependencies unless explicitly requested.

## Budget / token discipline

These rules keep each session inside the rolling usage window. The window is
token-based, and every turn re-sends the whole accumulated context — so the goal
is to keep context lean and avoid expensive operations unless they're needed.

### Reading
- Read only the files needed for the current task. Don't scan whole directories.
- Don't re-read a file that's already in context.
- For large files (e.g. `index.html`), read the relevant section, not the whole thing.

### Working
- Batch related edits into a single turn instead of many small round-trips.
- After finishing one logical chunk of work, tell the user to run `/clear` before
  starting an unrelated task, so context doesn't pile up across jobs.
- When context is getting large, write a short "resume note" (current state +
  next steps) that the user can paste into a fresh session to continue cheaply.

### Testing
- Run targeted tests to confirm a fix. Only run the full suite at milestones,
  not after every change.
- Don't loop a test many times to "be sure" unless explicitly asked.

### Expensive operations — warn first
Before any of these, tell the user it's token-heavy and confirm before running:
- Full-repo scans or "read everything" passes
- Large refactors touching many files
- Long or repeated test loops
- Re-summarizing large diffs repeatedly

### Quick commands (for the human)
- `/clear`  — wipe context between unrelated tasks (biggest single saver)
- `/cost`   — check what the current session has spent
- `/model`  — drop to a lighter model for routine work
- Compact / summarize at milestones to shrink carried context
- For heavy agentic loops, run them under an API key (no rolling cap, pay per token)
