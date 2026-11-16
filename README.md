# Florida Trailblazers

**Florida Trailblazers: The Stolen Founding Stone** (version 8) is a finished, self-contained HTML5 game for Florida 4th-grade Social Studies. Players travel early Florida, read maps, collect clues, and catch a fictional thief. The history is real; the case is made up.

Version 3 added painted character portraits with expressions, interviews, dossiers, warrants, a torn map, a magnifier, a villain map, a local leaderboard with share codes, team mode, ranks, and an avatar builder.

**Version 4 — Local Flavor:** At all seven stops, students explore **Local Flavor** scenes with 22 real, properly licensed photos (food, landmarks, wildlife, culture). They can tap vocabulary words, hear flavor clues from witnesses, browse a **photo album**, try an optional **Spot it** bonus, and open a **Photo Credits** screen. For photo attribution, use the in-game Photo Credits screen (also summarized in `game/CREDITS.md` and `game/photo-credits.json`).

**Version 5 — Painted detectives:** Students pick from **24 painted kid detectives** (about ages 8–10), each with **three expressions**. The **painted avatar picker** uses Florida-themed backdrops; progress shows on a **Detective ID card** with earned badges and a **case-complete stamp**. Saves that still use the old SVG avatars **auto-migrate** to the closest painted match (with SVG fallback if a portrait file is missing).

**Version 6 — Read-aloud:** Read-aloud uses the browser’s built-in speech synthesis (Web Speech API)—no audio files and no dependencies. **🔊** buttons appear on story text, questions, each answer choice, clues, and Local Flavor; words highlight as they are read (or the whole block if the device cannot track words). **Read to me** auto-reads each new screen, with **Slow** or **Normal** speed on the title screen, in-game **Menu**, and **Teacher** view (class default plus per-student). Tapping a vocabulary word still opens the meaning and also reads the word and definition aloud. Controls stay hidden when speech is not supported. On **iOS**, the first auto-read may need one extra tap before speech starts (a platform quirk).

**Version 7 — The Swamp Fox Heist:** A kid-safe comic storyline adds the **Swamp Fox**, a raccoon-masked thief, as an optional bonus chase. He leaves calling cards; a **Closing in** meter tracks the pursuit. When students corner him, a capture scene adds his **mugshot** to the **Detective ID card**. Henchmen **Gator Gil** and **Minnow** join the fun. Original **Web Audio** music and SFX are **off by default**, with **Music** and **Effects** sliders plus a teacher **Classroom quiet** switch.

**Version 8 — Florida Field Journal + mini-games:** Collect **9 painted journal cards** with kid-level read-aloud facts about Florida history and nature. Teachers get a **progress** view of journal collection. Two optional mini-games—**Marsh Canoe Dash** and **Place the Landmarks**—add movement and map skills practice.

Attribution and fact-review notes live in [`game/CREDITS.md`](game/CREDITS.md) and [`game/FACT_CHECK.md`](game/FACT_CHECK.md).

**Play it:** https://happydestiny79.github.io/florida-trailblazers/

The site is the [`game/`](game/) folder (`index.html`, stylesheets, `js/`, and `assets/img/`). There is no build step. Paths inside the game are relative, so it works at that GitHub Pages subpath. GitHub Actions publishes the `game/` folder on every push to `main`.

## Temporary debug: report a problem (teachers)

Append **`?debug`** to the game URL (for example `…/florida-trailblazers/?debug`) to show a small **🐞 Report** button. Use it on phones that block OS screenshots to capture the screen, add a short note, and save or share a PNG. This mode is temporary for field testing; students should use the normal URL without `debug`.

## If the site does not appear after the first merge

In this repository, open **Settings → Pages** and set **Source** to **GitHub Actions**. The deploy workflow cannot publish until Pages uses that source. After saving, re-run **Deploy static content to Pages** from the Actions tab, or push another commit to `main`.
