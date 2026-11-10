# Local Flavor — v4 preview (not deployed)

## How to review
Open index.html directly, or serve this folder locally. Start a case and arrive at St. Augustine. The Local Flavor postcards appear above the story. On a phone, swipe the postcards sideways. Tap a dotted vocabulary word to use the existing glossary popup; tap a photo credit to expand source and license information.

Arrival galleries appear at St. Augustine, Fort Mose, Tallahassee and Mission San Luis, plus each detour-city visit. The HUD’s camera button opens all seven place albums without spending coins/days or changing the route. Four cities (Jacksonville, Pensacola, Tampa, Miami) remain detours in this case, not new story chapters. No Keys/Everglades/Space Coast scenes were invented, because those places are not on the existing case map.

Spot it is optional: compare two postcards after arrival. Wrong guesses have no penalty. A correct answer earns +2 exploration points once per real stop, maximum 14 per case. Points survive save/continue and count toward the leaderboard bonus, not the educational case percentage or detective rank. Album previews do not award points. Completed cases cannot farm points.

Three seeded Local Flavor witness clues rotate across cases on each existing travel-map scene. The first route uses the marsh/free-community details of Fort Mose. The later route combines the Apalachee council house and state capital, preserving the existing difficulty ramp and correct destination. The selected clue stays stable on revisit and is saved to the notebook. Detour-city foods and traditions do not falsely redirect the current chase.

## Photography and licensing
22 real photographs, with local 800px-or-smaller WebP copies and 320px thumbnails. No generated real-place photos. Photo-specific author/source/license/change records: photo-credits.json. In-game access: main Credits or Photo credits in any postcard panel. CC BY-SA copies remain under the listed original license. Nothing is hosted remotely at runtime. Citation links open external source pages only if explicitly clicked.

The tobacco-factory photograph is historical context, not promotion; its caption explicitly notes that tobacco harms health. Mission San Luis and Fort Caroline images are labeled as rebuilt/model structures. The Miami Beach photograph is labeled as a nearby separate city, not downtown Miami.

## Fact-check sources
Retain the existing FACT_CHECK.md for the historical case. Additional postcard claims were checked against:
- Datil peppers and St. Augustine food traditions: https://www.visitstaugustine.com/article/what-heck-datil-pepper
- Cuban sandwich ingredients / Tampa's immigrant heritage: https://www.visittampabay.com/food-and-drink/cuban-sandwich/ and https://www.visittampabay.com/blog/archive/post/11-things-to-know-about-tampa-bay/
- Fort Mose settlement, marsh, boardwalk and visitor center: https://www.floridastateparks.org/parks-and-trails/fort-mose-historic-state-park
- French Fort Caroline and its memorial: https://www.nps.gov/timu/learn/historyculture/foca.htm
- St. Johns River's northward flow: https://www.sjrwmd.com/waterways/st-johns-river/
- Miami Beach Art Deco architecture and Little Havana's Domino Park: https://www.miamiandbeaches.com/things-to-do/art-and-culture/miami-architecture and https://www.miamiandbeaches.com/plan-your-trip/insider-guides/little-havana-guide
- Biscayne mangroves and young fish habitat: https://www.nps.gov/bisc/learn/nature/mangroves.htm
- Fort Pickens and the barrier island protecting Pensacola Bay: https://www.nps.gov/guis/learn/historyculture/fort-pickens.htm

## Existing debug report tool
PR #4 was merged. Its debugreport.js, html2canvas.min.js and MIT license were read from main using GitHub's read-only contents API. The debug script inclusion is preserved. Append ?debug to enable the Report button; normal student links do not show it. This is still temporary test functionality.

## Scope / privacy
Standalone local prototype only. No git checkout, clone, push, posting, cloud run, PR, merge, deployment, service configuration, or purchase occurred. Names and scores stay local. v3 was not edited. Existing v3 save/report keys remain compatible; Local Flavor state is lazily initialized for older saves.
