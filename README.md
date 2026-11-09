# Florida Trailblazers

**Florida Trailblazers: The Stolen Founding Stone** (version 4) is a finished, self-contained HTML5 game for Florida 4th-grade Social Studies. Players travel early Florida, read maps, collect clues, and catch a fictional thief. The history is real; the case is made up.

Version 3 added painted character portraits with expressions, interviews, dossiers, warrants, a torn map, a magnifier, a villain map, a local leaderboard with share codes, team mode, ranks, and an avatar builder.

**Version 4 — Local Flavor:** At all seven stops, students explore **Local Flavor** scenes with 22 real, properly licensed photos (food, landmarks, wildlife, culture). They can tap vocabulary words, hear flavor clues from witnesses, browse a **photo album**, try an optional **Spot it** bonus, and open a **Photo Credits** screen. For photo attribution, use the in-game Photo Credits screen (also summarized in `game/CREDITS.md` and `game/photo-credits.json`).

**Play it:** https://happydestiny79.github.io/florida-trailblazers/

The site is the [`game/`](game/) folder (`index.html`, `style.css`, `v3.css`, `localflavor.css`, `js/`, and `assets/img/`). There is no build step. Paths inside the game are relative, so it works at that GitHub Pages subpath. `CREDITS.md` and `FACT_CHECK.md` ship with the published folder. GitHub Actions publishes the `game/` folder on every push to `main`.

## Temporary debug: report a problem (teachers)

Append **`?debug`** to the game URL (for example `…/florida-trailblazers/?debug`) to show a small **🐞 Report** button. Use it on phones that block OS screenshots to capture the screen, add a short note, and save or share a PNG. This mode is temporary for field testing; students should use the normal URL without `debug`.

## If the site does not appear after the first merge

In this repository, open **Settings → Pages** and set **Source** to **GitHub Actions**. The deploy workflow cannot publish until Pages uses that source. After saving, re-run **Deploy static content to Pages** from the Actions tab, or push another commit to `main`.
