# Florida Trailblazers

**Florida Trailblazers: The Stolen Founding Stone** is a finished, self-contained HTML5 game for Florida 4th-grade Social Studies. Players travel early Florida, read maps, collect clues, and catch a fictional thief. The history is real; the case is made up.

**Play it:** https://happydestiny79.github.io/florida-trailblazers/

The site is the [`game/`](game/) folder (`index.html`, `style.css`, and `js/`). There is no build step and no external assets. Paths inside the game are relative, so it works at that GitHub Pages subpath. GitHub Actions publishes the `game/` folder on every push to `main`.

## If the site does not appear after the first merge

In this repository, open **Settings → Pages** and set **Source** to **GitHub Actions**. The deploy workflow cannot publish until Pages uses that source. After saving, re-run **Deploy static content to Pages** from the Actions tab, or push another commit to `main`.
