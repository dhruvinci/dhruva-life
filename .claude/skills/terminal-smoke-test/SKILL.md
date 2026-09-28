---
name: terminal-smoke-test
description: Smoke-test checklist for changes to terminal behavior (commands, routing, prompt, palette, header). Use after editing lib/commands/ or components/terminal/.
---

After `pnpm check` passes, smoke test in `pnpm dev`:

- home intro
- `help`
- clicking nav links (URL changes without reload)
- back/forward
- deep-link reload (e.g. `/work/graicie`)
- tab completion
- typo suggestion
- `search`
- `alias`
- an easter egg
- `clear`
- theme toggle
- the mobile menu at phone width
