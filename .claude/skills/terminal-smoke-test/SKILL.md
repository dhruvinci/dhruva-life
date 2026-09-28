---
name: terminal-smoke-test
description: Smoke-test checklist for changes to terminal behavior (commands, routing, prompt, slash menu, fun commands, themes, music player). Use after editing lib/commands/ or components/terminal/.
---

After `pnpm check` passes, smoke test in `pnpm dev` (desktop and ~390px mobile):

- home boot intro ("Loading identity..." types in), section links and availability tags
- `/` opens the menu with the six main commands; typing filters; Tab completes; `/blog ` lists posts
- Enter on a menu row runs it; typo suggestion (`/wrok`); plain text nudges to `/`
- clicking content links changes the URL without a reload; back/forward; deep-link reload (e.g. `/work/kakashi`)
- `/research` and `/work` show the contact strip; other pages don't
- `/fun` unlocks the emoji row; fun commands appear in the menu afterwards (and persist on reload)
- 🎵 `/music` opens the player; shuffle and close work
- 🎨 `/theme matrix` (and back to `/theme dark`) applies and persists
- 📷 `/camera` gallery opens a lightbox; photos don't link out
- the `/` button on mobile opens the menu, rows are tappable
