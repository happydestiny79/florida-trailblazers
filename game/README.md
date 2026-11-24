# Florida Trailblazers 11.0-preview

A Florida Social Studies + ELA HTML5 game for grades 3–4. This folder is a standalone copy of the game (no build step, works offline).

## What's new in 11.0-preview

- **Two cases**, chosen from **New case**:
  - Case 1: *The Stolen Founding Stone* (fully playable)
  - Case 2: *The Cigar Box Code* (first playable: Chapters 1–2 at Weedon Island / Safety Harbor and Fort Brooke). Chapters 3–5 (Plant Hotel, Ybor City, Port of Tampa) show as **Coming soon** after Chapter 2.
- Saves, Continue, the teacher view / leaderboard, and the Field Journal track each case separately. Older Case 1 saves (`ftb_case1_save_v3`) still load.
- A painted **Tampa Bay explorer map** is used for Case 2 travel. The coastline was traced from a public-domain USGS National Map so markers sit at real latitude/longitude; labels are crisp SVG text (not painted into the image).
- Read-aloud from v10 is unchanged: one floating **Read to me** button, plus tap-to-read on non-interactive text.
- A simple Swamp Fox bonus layer appears at the two playable Case 2 stops.

## How to play

Open `index.html` in a browser. Chrome is the supported test browser.

## Version and keys

- `GAME_VERSION` is `11.0-preview`.
- Case 1 save/report keys are unchanged: `ftb_case1_save_v3`, `ftb_case1_reports_v3`.
- Case 2 uses `ftb_case2_save_v11` and `ftb_case2_reports_v11`.
- Last-played case: `ftb_last_case_v11`.

Credits and sourced facts: `CREDITS.md`, `FACT_CHECK.md`.
