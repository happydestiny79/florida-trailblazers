# FACT_CHECK (v3): Florida Trailblazers, Case 1: The Stolen Founding Stone

Generated on 2026-10-19 from `game-v2/js/facts.js`, `data.js`, `images.js` and `benchmarks.js` by `tools/make_docs_v2.js`. Claims are shown in the exact wording players see in the Notebook. Scene dialogue paraphrases them.

**44 claims** (the 38 from v1 plus 6 new ones: `coquinaFormed`, `cityGate`, `capital1824`, `historicCapitol`, `treaty1819`, `fortCarolineToday`). **0 open flags.** Both v1 flags were checked and resolved (see "Resolved v1 flags"). Every source is free and needs no login.

## New in v3 (read this first)
v3 adds **no new historical claims to the Notebook**: every fact a player can earn in an interview, riddle or clue scene points to one of the sourced claims in the table below. Dialogue that restates history was checked against those claims:

| Where | Exact player-facing words | Backed by |
|---|---|---|
| Ranger Rosa interview | "Coquina! It's soft and spongy, so cannonballs sank in instead of cracking the walls." | `coquina1702` |
| Ranger Dee interview | "It was the first legally sanctioned free Black settlement in what is now the United States." | `moseFirst` |
| Guide Tomás interview | "Apalachee people and Spanish people lived here together, from 1656 to 1704." | `sanluisPeople`, `sanluisCapital` (1656), `sanluis1704` |
| Guide Tomás follow-up | "Huge! About 120 feet across. Council houses like it could hold up to 3,000 people!" | `councilHouse` (120 feet); <https://missionsanluis.org/learn/thatch> ("Similar buildings around the Southeast were said to hold up to 3,000 people"); NPS NHL nomination (<https://npgallery.nps.gov/GetAsset/67d92cf2-58d6-4530-b79d-4b182a00beae>: "some held between 2000 and 3000 people") |
| Penny's riddle 1 (SS.4.A.3.3) | Spain founded St. Augustine in 1565; oldest permanent European settlement in the continental U.S. | `menendez1565`, `oldest` |
| Penny's riddle 2 (SS.4.G.1.2) | Tallahassee was chosen as Florida's capital in 1824. Hint: Florida became a U.S. territory in 1821. | `capital1824`, `flags` |
| Penny's riddle 3 (SS.4.A.3.7) | Spain, France and England (Britain) all wanted to control Florida; Britain took control in 1763. | `flags`, `fortCaroline` |
| Founding Stone dust scene | "Pedro Menéndez de Avilés founded St. Augustine in 1565, which makes it the oldest permanent European settlement in the continental United States." | `menendez1565`, `oldest` |
| Torn-map puzzle | Uses the 1763 Gibson map of St. Augustine (`gibson1763`, LOC, public domain); only the caption already checked below is shown. | image caption |

**Judgment calls in v3:** the riddle-2 hint ("only a few years later than 1821") is a reasoning hint, not a claim. "Sank in" is a kid-friendly paraphrase of "absorbed".


- **geoWest**: VERIFIED in v2 by calculation: the great-circle (haversine) distance from the Castillo (29.8979 N, 81.3115 W) to Mission San Luis (30.4457 N, 84.3190 W) is 183.6 miles, which rounds to about 180 (tools/playtest_v2.py recomputes it). Wording changed from "about 180 miles" to "about 180 miles in a straight line" so it is not confused with driving distance. Tallahassee is the capital per the Florida Department of State.
  - Current wording: "Tallahassee (Mission San Luis) is west and a little north of St. Augustine, about 180 miles away in a straight line ("as the crow flies"). The drive is longer. Tallahassee is Florida's state capital."
- **geoAnastasia**: VERIFIED/REWORDED in v2. NPS: coquina was quarried "in the area of present-day Anastasia State Park on Anastasia Island." On the USGS aerial map used in the game, Anastasia Island is directly east of the Castillo across Matanzas Bay. The Spanish Coquina Quarries (NRHP #72001462, 29.8706 N, 81.2753 W) are about 1.9 miles south and 2.2 miles east of the Castillo, so v1's "east" is now "southeast, about 3 miles" for the quarries and "east" only for the island.
  - Current wording: "The coquina stone for the Castillo was cut from quarries on Anastasia Island, in the area of today's Anastasia State Park. The island lies just east of St. Augustine, across Matanzas Bay. The old quarries are southeast of the Castillo, about 3 miles away."

## Made-up parts (not historical claims)
- The Founding Stone, the thief (Penny Pinch), the other suspects (Rusty Hinges, Captain Fogbottom, Lulu Larceny), Detective Sam, Professor Pelican, Ranger Rosa, Ranger Dee, Guide Tomás and the park volunteer (Mr. Okafor) are fictional. v3 portraits are original AI-generated paintings of these fictional people and are not based on any real person.
- v3 game parts are made up too: the witness clues (wet-umbrella drips, the purple pen, the bus question, the plaza question), suspect alibis and dossiers, the arrest warrant, Penny's riddle notes and escape route, the torn map and the "Founding Stone" inscription, and the speed bonus. The game is set **today** at real historic sites, so no historical person is given invented dialogue.
- Coins, shop prices, the shuttle/bus/supply-truck options and the "Day 4" deadline are game mechanics.
- The thief "buried the Stone like the bells". Only the bell burial is historical (see `bellsBuried`).
- Suspects appear as gray case-file silhouettes. No real person is depicted as a character. Native people are not depicted. Photos show places, landscapes, rebuilt buildings, maps and objects.

## Map notes
- **Florida map**: the background is NASA Blue Marble shaded relief (NASA GIBS WMS, EPSG:4326, lat 24.75–31.95, lon −88.24 to −77.96). Markers use the same equirectangular projection from real coordinates, so they sit at their true spots on the image. The outline is the U.S. Census Bureau 2023 cartographic boundary (1:5,000,000), simplified. The 0–200 mile scale bar is computed for this projection at about 30° N (east–west distances). Fort Mose's marker is drawn offset (it is only about 2 miles from St. Augustine) and joined to its real spot by a dotted line.
- **St. Augustine close-up**: a real USGS National Map orthophoto (lon −81.365 to −81.265, lat 29.865 to 29.945). Pins are placed at true coordinates. "Old fort site" is Fort Mose (29.9272 N, 81.3247 W), about 2.2 miles north-northwest of the Castillo (sources say "2 miles north"). "Anastasia Island" (29.8979 N, 81.2840 W) is due east across Matanzas Bay. "South of town" and "Inland woods" are generic distractors, not historical claims. The 2-mile scale bar is computed from the image extent at this latitude.
- The Gulf is intentionally **unlabeled**, to avoid the current naming question. The Atlantic Ocean and Matanzas Bay are labeled.

## Claims

| # | ID | Claim (as shown to players) | Used in | Source(s) | Check notes |
|---|---|---|---|---|---|
| 1 | `ponce1513` | In 1513, Spanish explorer Juan Ponce de León came ashore on Florida's northeast coast. He named the land "la Florida" after Spain's Easter celebration, Pascua Florida ("feast of the flowers"). | St. Augustine: "Why Did Explorers Come?" | <https://dos.fl.gov/florida-facts/florida-history/a-brief-history/european-exploration-and-colonization/> | Matches source. |
| 2 | `soto1539` | In 1539, explorer Hernando de Soto began an expedition through Florida searching for gold and silver. | St. Augustine: "Why Did Explorers Come?" | <https://dos.fl.gov/florida-facts/florida-history/a-brief-history/european-exploration-and-colonization/> | Matches source. |
| 3 | `noTreasure` | The Spanish explorers did not find great treasure in Florida. | St. Augustine: "Why Did Explorers Come?" | <https://dos.fl.gov/florida-facts/florida-history/a-brief-history/european-exploration-and-colonization/> | Matches source. |
| 4 | `fortCaroline` | France also wanted Florida. In 1564, French settlers built Fort Caroline near present-day Jacksonville. | St. Augustine: "The Oldest City" | <https://dos.fl.gov/florida-facts/florida-history/a-brief-history/european-exploration-and-colonization/> | Matches source. |
| 5 | `menendez1565` | In 1565, Pedro Menéndez de Avilés founded St. Augustine. Spain wanted to drive out the French, protect its treasure-ship route along the Gulf Stream, and hold on to its claim to La Florida. | St. Augustine: "The Oldest City" | <https://dos.fl.gov/florida-facts/florida-history/a-brief-history/european-exploration-and-colonization/><br><https://www.nps.gov/npgallery/GetAsset/e518cd67-f4cb-432a-b38c-f263be0d7e7e> | Matches source. |
| 6 | `oldest` | St. Augustine is the oldest permanent European settlement in the continental United States. | St. Augustine: "The Oldest City" | <https://npshistory.com/publications/casa/index.htm><br><https://dos.fl.gov/florida-facts/florida-history/a-brief-history/european-exploration-and-colonization/> | Matches source. |
| 7 | `castilloBuilt` | The Castillo de San Marcos was built from 1672 to 1695 to protect St. Augustine. The Spanish had built nine wooden forts before it. | St. Augustine: "The Castillo de San Marcos" | <https://www.nps.gov/npgallery/GetAsset/e518cd67-f4cb-432a-b38c-f263be0d7e7e><br><https://www.nps.gov/casa/learn/historyculture/who-built-the-castillo.htm> | Matches source. |
| 8 | `coquina` | The Castillo is made of coquina, a stone formed from tiny seashells. Its walls average about 12 feet thick. | St. Augustine: "The Castillo de San Marcos" | <https://nps.gov/casa/learn/historyculture/coquina-the-rock-that-saved-st-augustine.htm> | Matches source. |
| 9 | `coquina1702` | When English forces fired cannons at the Castillo in 1702, the coquina walls absorbed the hits instead of shattering. The Castillo never fell in battle. | St. Augustine: "The Wall That Wouldn't Break" | <https://nps.gov/casa/learn/historyculture/coquina-the-rock-that-saved-st-augustine.htm><br><https://www.nps.gov/npgallery/GetAsset/e518cd67-f4cb-432a-b38c-f263be0d7e7e> | Matches source. |
| 10 | `timucuaLife` | For hundreds of years before 1565, the Timucua people lived in the St. Augustine area. They fished, hunted, and grew corn, beans, and squash. In 1565 the main chief of the area was Seloy. | St. Augustine: "The Timucua People" | <https://www.floridamuseum.ufl.edu/staugustine/timeline/the-timucua-in-st-augustine/> | Matches source. |
| 11 | `timucuaDecline` | Europeans brought diseases such as smallpox and measles, which killed many Native people. The Spanish also made Native people work and give part of their crops. By 1698 only about 550 Timucua were left, and today there are no known Timucua people. | St. Augustine: "The Timucua People" | <https://www.museumoffloridahistory.com/explore/exhibits/permanent-exhibits/la-florida/forever-changed-phase-2/the-first-spanish-period/demise-of-the-indigenous-population-and-the-mission-period/><br><https://www.nps.gov/timu/learn/historyculture/timucua_end_culture.htm><br><https://www.nps.gov/timu/learn/historyculture/missions_fgi.htm> | Matches source. |
| 12 | `flags` | Spain ruled Florida first. Britain took control in 1763. Spain got Florida back after the American Revolution, and in 1821 Spain handed Florida to the United States. | St. Augustine: "Flags Over Florida" | <https://dos.fl.gov/florida-facts/florida-history/a-brief-history/european-exploration-and-colonization/> | Matches source. |
| 13 | `spanishEffects` | Spanish rule left many marks on Florida: the name "Florida" itself, Spanish place names like St. Augustine, Catholic missions across north Florida, and forts like the Castillo. | St. Augustine: "Flags Over Florida" | <https://dos.fl.gov/florida-facts/florida-history/a-brief-history/european-exploration-and-colonization/><br><https://www.nps.gov/npgallery/GetAsset/e518cd67-f4cb-432a-b38c-f263be0d7e7e> | Matches source. |
| 14 | `mose1738` | In 1738, the Spanish governor of Florida, Manuel de Montiano, set aside land about 2 miles north of St. Augustine for a new town: Gracia Real de Santa Teresa de Mose, called Fort Mose (say "moh-SAY"). | Fort Mose: "Fort Mose" | <https://www.nps.gov/casa/learn/historyculture/african-americans-in-st-augustine-1565-1821.htm><br><https://www.floridastateparks.org/learn/history-fort-mose> | Matches source. |
| 15 | `moseFreedom` | Fort Mose was for people escaping slavery in the English colonies of the Carolinas. Spain offered them freedom if they promised loyalty to the king of Spain and joined the Catholic Church. | Fort Mose: "Fort Mose" | <https://www.floridastateparks.org/learn/history-fort-mose><br><https://www.nps.gov/casa/learn/historyculture/african-americans-in-st-augustine-1565-1821.htm> | Matches source. |
| 16 | `moseFirst` | Fort Mose was the first legally sanctioned free African (free Black) settlement in what is now the United States. | Fort Mose: "Why Fort Mose Matters" | <https://www.floridastateparks.org/learn/history-fort-mose><br><https://www.floridamuseum.ufl.edu/histarch/research/st-augustine/fort-mose/> | Matches source. |
| 17 | `mosePeople` | About 100 people lived at Fort Mose. The men served in a militia that helped defend St. Augustine. Their captain, Francisco Menéndez, had freed himself from slavery and was the town's real leader. | Fort Mose: "The People of Mose" | <https://www.nps.gov/casa/learn/historyculture/african-americans-in-st-augustine-1565-1821.htm><br><https://www.nps.gov/articles/000/archeological-research-at-fort-mose.htm> | Matches source. |
| 18 | `mose1740` | When British forces from Georgia attacked in 1740, the people of Mose moved to St. Augustine for safety. Later, Spanish soldiers and the Mose militia won back the fort in a surprise attack. | Fort Mose: "Hard Times at Mose" | <https://www.nps.gov/casa/learn/historyculture/african-americans-in-st-augustine-1565-1821.htm><br><https://www.nps.gov/articles/000/archeological-research-at-fort-mose.htm> | Matches source. |
| 19 | `mose1763` | When Florida was handed over to Britain in 1763, the people of Fort Mose left for Cuba along with the Spanish settlers. | Fort Mose: "Hard Times at Mose" | <https://www.nps.gov/casa/learn/historyculture/african-americans-in-st-augustine-1565-1821.htm><br><https://www.nps.gov/articles/000/archeological-research-at-fort-mose.htm> | Matches source. |
| 20 | `moseToday` | No buildings from Fort Mose remain today. Visitors can see the marsh land where it stood at Fort Mose Historic State Park. | Fort Mose: "The Marsh" | <https://www.nps.gov/casa/learn/historyculture/african-americans-in-st-augustine-1565-1821.htm> | Matches source. |
| 21 | `sanluisCapital` | From 1656 to 1704, Mission San Luis stood on one of the tallest hills in what is now Tallahassee. It was the capital of Spain's western missions in Florida. | Mission San Luis: "Mission San Luis" | <https://missionsanluis.org/learn/history/><br><https://npgallery.nps.gov/GetAsset/67d92cf2-58d6-4530-b79d-4b182a00beae> | Matches source. |
| 22 | `sanluisPeople` | About 1,500 Apalachee people and 150 Spanish people lived at San Luis. It was home to a powerful Apalachee chief and to the Spanish deputy governor. | Mission San Luis: "Mission San Luis" | <https://missionsanluis.org/learn/history/><br><https://npgallery.nps.gov/GetAsset/67d92cf2-58d6-4530-b79d-4b182a00beae> | Matches source. |
| 23 | `apalacheeFarm` | The Apalachee were strong farmers. Their most important foods were corn, beans, and squash, along with fish, wild game, nuts, and berries. Rich soil was one reason the Spanish came to this area. | Mission San Luis: "Explore the Mission" → The Plaza & Fields | <https://missionsanluis.org/media/fhdfsjhn/visitorguide.pdf> | Matches source. |
| 24 | `missionPurpose` | Spanish friars came to teach the Catholic faith and baptize the Apalachee. San Luis was also Spain's western center for soldiers and government, and the friars' food came from the Apalachee villagers as tribute. | Mission San Luis: "Why Build a Mission?" | <https://missionsanluis.org/media/fhdfsjhn/visitorguide.pdf><br><https://missionsanluis.org/learn/archaeology> | Matches source. |
| 25 | `apalacheeAsked` | Apalachee leaders asked for Spanish friars as early as 1607, at a time of sickness and the threat of attack. From 1633 to 1635, at least 5,000 Apalachee were baptized. | Mission San Luis: "Why Build a Mission?" | <https://missionsanluis.org/media/fhdfsjhn/visitorguide.pdf> | Matches source. |
| 26 | `churchBells` | Church bells rang through the day at San Luis to mark activities, and both Spaniards and Apalachee went to services in the church. | Mission San Luis: "Why Build a Mission?" | <https://missionsanluis.org/media/fhdfsjhn/visitorguide.pdf> | Matches source. |
| 27 | `councilHouse` | The Apalachee council house at San Luis was a huge round building about 120 feet across. Apalachee leaders met there every day to discuss community business. It was also used for dances and ceremonies. | Mission San Luis: "Explore the Mission" → Apalachee Council House | <https://missionsanluis.org/media/fhdfsjhn/visitorguide.pdf> | Matches source. |
| 28 | `plaza` | The round plaza at San Luis was about 410 feet across, about the size of a football field. It was the center of town life. | Mission San Luis: "Explore the Mission" → The Plaza & Fields | <https://missionsanluis.org/media/fhdfsjhn/visitorguide.pdf> | Matches source. |
| 29 | `ballGame` | The Apalachee ball game was a rough team game with 50 or more players. It was played to bring rain for the crops. | Mission San Luis: "Explore the Mission" → The Plaza & Fields | <https://missionsanluis.org/media/fhdfsjhn/visitorguide.pdf> | Matches source. |
| 30 | `friars` | The friars lived in a building called a friary (convento). With help from Apalachee interpreters, they learned the Apalachee language. | Mission San Luis: "Explore the Mission" → The Friary | <https://missionsanluis.org/media/fhdfsjhn/visitorguide.pdf> | Matches source. |
| 31 | `trade` | Goods like hides, beef, and corn were shipped from the San Luis area to Havana, Cuba, in trade. | Mission San Luis: "Explore the Mission" → The Friary | <https://missionsanluis.org/media/fhdfsjhn/visitorguide.pdf> | Matches source. |
| 32 | `paiva1676` | In 1676, Father Juan de Paiva, the priest at San Luis, wrote a description of the Apalachee ball game. Because he wrote it at the time, it is a primary source. Much of what we know about the Apalachee comes from writings by friars and their Apalachee translators. | Mission San Luis: "Old Writings" | <https://digitalcommons.usf.edu/cgi/viewcontent.cgi?article=1028&context=early_visions_bucket><br><https://missionsanluis.org/learn/archaeology> | Matches source. |
| 33 | `sanluis1704` | In 1704, English soldiers from Carolina and their Creek allies attacked Spanish missions. On July 31, 1704, the people of San Luis burned their mission and left so enemies could not use it. The Apalachee scattered and never moved back to their homeland. | Mission San Luis: "1704: The End of the Mission" | <https://missionsanluis.org/media/fhdfsjhn/visitorguide.pdf><br><https://dos.fl.gov/florida-facts/florida-history/a-brief-history/european-exploration-and-colonization/> | Matches source. |
| 34 | `bellsBuried` | The people leaving San Luis buried heavy things like church bells, hoping to come back for them someday. | Mission San Luis: "1704: The End of the Mission" | <https://missionsanluis.org/media/fhdfsjhn/visitorguide.pdf> | Matches source. |
| 35 | `sanluisToday` | Today Mission San Luis is a history museum with rebuilt buildings, including the council house, church, friary, and fort. | Mission San Luis: "Mission San Luis" | <https://npgallery.nps.gov/GetAsset/67d92cf2-58d6-4530-b79d-4b182a00beae> | Matches source. |
| 36 | `geoMoseNorth` | Fort Mose is about 2 miles north of St. Augustine. | St. Augustine: "Where Did the Thief Go?" | <https://www.nps.gov/casa/learn/historyculture/african-americans-in-st-augustine-1565-1821.htm><br><https://www.floridamuseum.ufl.edu/histarch/research/st-augustine/fort-mose/> | Matches source. |
| 37 | `geoWest` | Tallahassee (Mission San Luis) is west and a little north of St. Augustine, about 180 miles away in a straight line ("as the crow flies"). The drive is longer. Tallahassee is Florida's state capital. | Fort Mose: "Find the State Capital" | <https://dos.fl.gov/florida-facts/florida-history/a-brief-history/><br><https://dos.fl.gov/florida-facts/florida-history/the-capitol/> | VERIFIED in v2 by calculation: the great-circle (haversine) distance from the Castillo (29.8979 N, 81.3115 W) to Mission San Luis (30.4457 N, 84.3190 W) is 183.6 miles, which rounds to about 180 (tools/playtest_v2.py recomputes it). Wording changed from "about 180 miles" to "about 180 miles in a straight line" so it is not confused with driving distance. Tallahassee is the capital per the Florida Department of State. |
| 38 | `geoAnastasia` | The coquina stone for the Castillo was cut from quarries on Anastasia Island, in the area of today's Anastasia State Park. The island lies just east of St. Augustine, across Matanzas Bay. The old quarries are southeast of the Castillo, about 3 miles away. | St. Augustine: "Where Did the Thief Go?" | <https://nps.gov/casa/learn/historyculture/coquina-the-rock-that-saved-st-augustine.htm><br><https://en.wikipedia.org/wiki/Spanish_Coquina_Quarries><br><https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer> | VERIFIED/REWORDED in v2. NPS: coquina was quarried "in the area of present-day Anastasia State Park on Anastasia Island." On the USGS aerial map used in the game, Anastasia Island is directly east of the Castillo across Matanzas Bay. The Spanish Coquina Quarries (NRHP #72001462, 29.8706 N, 81.2753 W) are about 1.9 miles south and 2.2 miles east of the Castillo, so v1's "east" is now "southeast, about 3 miles" for the quarries and "east" only for the island. |
| 39 | `coquinaFormed` (new) | Coquina formed over thousands of years as the shells of tiny coquina clams piled up and were naturally glued together into a kind of limestone. "Coquina" is Spanish for "tiny shell." | St. Augustine: "The Wall That Wouldn't Break" | <https://nps.gov/casa/learn/historyculture/coquina-the-rock-that-saved-st-augustine.htm> | Matches source. |
| 40 | `cityGate` (new) | A gate in St. Augustine's north wall opened in 1739. The coquina pillars of the City Gate that stand today were built in 1808. | St. Augustine: "A Red Umbrella!" | <https://www.nps.gov/places/000/city-gate.htm><br><https://www.nps.gov/npgallery/GetAsset/e518cd67-f4cb-432a-b38c-f263be0d7e7e> | Matches source. |
| 41 | `capital1824` (new) | In 1824, Tallahassee was chosen as Florida's capital, mostly because it was about halfway between St. Augustine and Pensacola, the two main cities. | Mission San Luis: "Tallahassee: Florida's Capital" | <https://dos.fl.gov/florida-facts/florida-history/the-capitol/><br><https://dos.fl.gov/florida-facts/florida-history/a-brief-history/territorial-period> | Matches source. |
| 42 | `historicCapitol` (new) | Florida's brick Capitol was finished in 1845 and is now the Historic Capitol museum. The 22-story Capitol tower behind it was finished in 1977. | Mission San Luis: "Tallahassee: Florida's Capital" | <https://dos.fl.gov/florida-facts/florida-history/the-capitol/> | Matches source. |
| 43 | `treaty1819` (new) | In 1819, Spain and the United States signed a treaty (the Adams-Onís Treaty). In Article II, the King of Spain "cedes" (gives) East and West Florida to the United States. The treaty took effect in 1821. | Mission San Luis: "Reading Room: Compare Two Texts" | <https://avalon.law.yale.edu/19th_century/sp1819.asp> | Matches source. |
| 44 | `fortCarolineToday` (new) | No one knows exactly where the French Fort Caroline stood. The fort at Fort Caroline National Memorial in Jacksonville is a smaller model built in 1964 from old drawings. | Wrong-way trip to Jacksonville (pop-up) | <https://www.nps.gov/timu/planyourvisit/index.htm> | Matches source. |

## Timeline Lock (7 events)
- 1513: Ponce de León names the land "la Florida"
- 1565: Pedro Menéndez de Avilés founds St. Augustine
- 1656: Mission San Luis moves to its hilltop (today's Tallahassee)
- 1704: The people of San Luis burn and leave the mission
- 1738: Fort Mose is founded north of St. Augustine
- 1763: Britain takes control of Florida
- 1821: Spain hands Florida to the United States

Each year is backed by a claim above: 1513 `ponce1513`, 1565 `menendez1565`, 1656 `sanluisCapital`, 1704 `sanluis1704`, 1738 `mose1738`, 1763 `flags`/`mose1763`, 1821 `flags`/`treaty1819`.

## Reading passages (ELA)
- **Coquina: The Rock That Saved St. Augustine** (`p_coquina`, Informational text). Adapted (shortened, a few words simplified) from the National Park Service page "Coquina - The Rock that Saved St Augustine" (public domain, U.S. government work): https://nps.gov/casa/learn/historyculture/coquina-the-rock-that-saved-st-augustine.htm
- **Freedom at Fort Mose** (`p_mose`, Informational text). Written for this game from facts in National Park Service and Florida State Parks sources (see FACT_CHECK.md: mose1738, moseFreedom, mosePeople, mose1740, moseFirst).
- **How Did Florida Become Part of the United States?** (`p_treaty`, Two texts). Text A: Primary source: From Article II of the treaty between Spain and the United States, signed February 22, 1819 (the Adams-Onís Treaty). Public domain. Source: The Avalon Project, Yale Law School, https://avalon.law.yale.edu/19th_century/sp1819.asp Text B: Secondary source: Written for this game in 2026 (facts from the Florida Department of State and the treaty).
- **Life at Mission San Luis** (`p_sanluis`, Informational text). Written for this game from facts in the Mission San Luis visitor guide (see FACT_CHECK.md: churchBells, apalacheeFarm, councilHouse, friars, ballGame, trade).
- The NPS coquina passage is shortened and lightly simplified. All its statements match the NPS page. The two passages "Freedom at Fort Mose" and "Life at Mission San Luis" were **written for the game** and use only the claims cited in their source lines. The Treaty quote is copied word for word from Article II (Avalon Project transcription).
- "Today there are no known Timucua people" (scene sa4 feedback) paraphrases `timucuaDecline` (NPS Timucuan Preserve: the Timucua as a distinct people are gone).

## ELA benchmark citations
Wording is copied from Florida's State Academic Standards – B.E.S.T. English Language Arts, 2025 (Rule 6A-1.09401, F.A.C., Ref-18865): <https://flrules.org/gateway/reference.asp?No=Ref-18865>. Each code was checked against the text of that document (`src/ela/best2025.txt`, from the official PDF).

| Code | Grade | PDF page | Used in scene(s) |
|---|---|---|---|
| ELA.3.R.2.1 | 3 | 54 | tl2b |
| ELA.3.R.2.2 | 3 | 54 | sa2read, sl4main |
| ELA.3.R.2.3 | 3 | 54 | fm2purpose |
| ELA.3.R.2.4 | 3 | 54 | fm2read |
| ELA.3.R.3.3 | 3 | 55 | tl2 |
| ELA.3.V.1.3 | 3 | 58 | sa2word, tl3 |
| ELA.4.R.2.1 | 4 | 63 | sl4read |
| ELA.4.R.2.2 | 4 | 63 | sa2read, sl4main |
| ELA.4.R.2.3 | 4 | 63 | fm2author |
| ELA.4.R.2.4 | 4 | 63 | fm2read |
| ELA.4.R.3.3 | 4 | 64 | tl2 |
| ELA.4.V.1.3 | 4 | 67 | sa2word, tl3 |
| ELA.K12.EE.1.1 | K-12 | 10 | fm2read |

## Photo and map captions (also claims)
Each caption was written from the source file's own description (Wikimedia Commons, Library of Congress, NPS, Florida Memory). Full credits are in CREDITS.md.

| Image | Caption shown | Source |
|---|---|---|
| `castillo_aerial` | The Castillo de San Marcos from the air, on the bay in St. Augustine. | <https://commons.wikimedia.org/wiki/File:Aerial_view_of_the_Castillo_de_San_Marcos,_St._Augustine,_FL_2025-05-20.jpg> |
| `castillo_wall` | Inside the courtyard of the Castillo de San Marcos. | <https://commons.wikimedia.org/wiki/File:Castillo_de_San_Marcos_Fort_Wall.JPG> |
| `castillo_nps` | The Castillo de San Marcos seen from above (National Park Service). | <https://commons.wikimedia.org/wiki/File:Castillo_de_San_Marcos.jpg> |
| `castillo_room` | A stone room inside the Castillo de San Marcos. | <https://commons.wikimedia.org/wiki/File:Cellar_at_Castillo_de_San_Marcos_National_Monument_(2023).jpg> |
| `coquina` | Close-up of the coquina wall of the Castillo. Look for the tiny shell bits! | <https://commons.wikimedia.org/wiki/File:Coquina_wall_closeup_at_Castillo_de_San_Marcos_National_Monument_(2023)_01.jpg> |
| `map1591` | A map of Florida and Cuba printed in 1591 (Le Moyne and de Bry). | <https://commons.wikimedia.org/wiki/File:1591_De_Bry_and_Le_Moyne_Map_of_Florida_and_Cuba_-_Geographicus_-_Florida-debry-1591.jpg> |
| `boazio` | Baptista Boazio's map of St. Augustine, published in 1589. | <https://commons.wikimedia.org/wiki/File:Baptista_Boazio%27s_Map_of_Sir_Francis_Drake%27s_Raid_on_St._Augustine_(published_in_1589)_(8879100326).jpg> |
| `timucuan_marsh` | Salt marsh at Timucuan Ecological and Historic Preserve, in the homeland of the Timucua (NPS). | <https://commons.wikimedia.org/wiki/File:Dawn_at_Cedar_Point_Horeshoe_Creek._(f7c6dfcc-5c12-4269-8b80-d008227dcac1).jpg> |
| `city_gate` | The old City Gate of St. Augustine (built 1808) at the end of St. George Street. | <https://commons.wikimedia.org/wiki/File:City_Gate,_St._Augustine,_Florida,_USA.jpg> |
| `bay_aerial` | Matanzas Bay and the St. Augustine bayfront beside the Castillo. | <https://commons.wikimedia.org/wiki/File:Aerial_view_over_the_Matanzas_Bay_of_Castillo_de_San_Marcos_St._Augustine,_Florida.jpg> |
| `gibson1763` | "A map of the new governments of East & West Florida" by John Gibson, made after Britain took Florida in 1763 (Library of Congress). | <https://commons.wikimedia.org/wiki/File:A_map_of_the_new_governments_of_East_%26_West_Florida_LOC_2014589387.jpg> |
| `benet_store` | A rebuilt old store on St. George Street in St. Augustine. | <https://commons.wikimedia.org/wiki/File:Benet_Store,_St._George_Street,_Colonial_Quarter,_St._Augustine,_FL.jpg> |
| `quarry` | The old Spanish coquina quarry on Anastasia Island (U.S. DOT photo, National Archives). | <https://commons.wikimedia.org/wiki/File:A1A_Scenic_and_Historic_Coastal_Byway_-_Old_Spanish_Quarry_at_St._Augustine,_FL_-_NARA_-_7716678.jpg> |
| `mose_pano` | The salt marsh at Fort Mose Historic State Park, where the fort once stood. | <https://commons.wikimedia.org/wiki/File:Fort_Mose_Panorama.JPG> |
| `mose_trees` | At Fort Mose today: the clump of trees in the marsh marks the area of the fort site. | <https://commons.wikimedia.org/wiki/File:St_Aug_Fort_Mose01.jpg> |
| `mose_vc` | The visitor center and museum at Fort Mose Historic State Park. | <https://commons.wikimedia.org/wiki/File:St_Aug_Fort_Mose_VC01.jpg> |
| `mose_boardwalk` | The boardwalk out to the marsh at Fort Mose Historic State Park. | <https://commons.wikimedia.org/wiki/File:St_Aug_Fort_Mose_bdwlk_east02.jpg> |
| `mose_trail` | A boardwalk trail through the marsh at Fort Mose Historic State Park. | <https://commons.wikimedia.org/wiki/File:St_Aug_Fort_Mose_bdwlk_west01.jpg> |
| `i10` | Interstate 10, the highway that crosses north Florida between Jacksonville and Tallahassee. | <https://commons.wikimedia.org/wiki/File:Florida_I10eb_Exit_327.JPG> |
| `capitol` | Florida's Historic Capitol (front) and the Florida State Capitol tower (behind) in Tallahassee. | <https://commons.wikimedia.org/wiki/File:Florida%E2%80%99s_Historic_Capitol_and_Florida_State_Capitol_1.JPG> |
| `sl_church_ext` | The rebuilt Franciscan church at Mission San Luis. | <https://commons.wikimedia.org/wiki/File:Mission_San_Luis_-_Reconstructed_Franciscan_Church.jpg> |
| `sl_fort` | The rebuilt Spanish fort at Mission San Luis. | <https://commons.wikimedia.org/wiki/File:Mission_San_Luis_-_Reconstructed_Spanish_Fort.jpg> |
| `sl_watercolor` | An artist's drawing of how Mission San Luis may have looked (Florida Photographic Collection). | <https://commons.wikimedia.org/wiki/File:Mission_San_Luis.jpg> |
| `fort_caroline` | The fort exhibit at Fort Caroline National Memorial: a smaller model, built in 1964 from old drawings of the 1564 French fort. The real fort's exact spot is unknown (NPS). | <https://commons.wikimedia.org/wiki/File:Fort_Caroline_National_Memorial,_Florida_(5e1f38b0-0963-4874-bdba-7185c8a0853c).jpg> |
| `pelican` | A brown pelican at Port Canaveral, Florida. (Professor Pelican is pretend!) | <https://commons.wikimedia.org/wiki/File:Brown_Pelican_JG.jpg> |
| `compass` | A compass rose shows directions: N, E, S and W. | <https://commons.wikimedia.org/wiki/File:CC0_Compass_Rose.svg> |
| `sl_council` | The rebuilt Apalachee council house at Mission San Luis, Tallahassee. | <https://www.loc.gov/item/2020720431/> |
| `sl_grounds` | Open grounds and the rebuilt church at Mission San Luis. | <https://www.loc.gov/item/2020720417/> |
| `sl_church` | The rebuilt church at Mission San Luis, with a wooden bell frame in front. | <https://www.loc.gov/item/2020720434/> |
| `sl_interior` | Inside the rebuilt church at Mission San Luis. | <https://www.loc.gov/item/2020720415/> |
| `sl_friary` | The kitchen of the rebuilt friary at Mission San Luis. | <https://www.loc.gov/item/2020720416/> |
| `map_fl` | Satellite-style map of Florida (NASA Blue Marble). | <https://www.earthdata.nasa.gov/engage/open-data-services-software/earthdata-developer-portal/gibs-api> |
| `map_sa` | Aerial photo map of St. Augustine, Fort Mose and Anastasia Island (USGS). | <https://www.usgs.gov/faqs/are-usgs-reportspublications-copyrighted> |

## Vocabulary definitions
37 kid-friendly definitions in `js/vocab.js` are paraphrased from common dictionary meanings and the game's own sourced facts (for example, "council house" uses `councilHouse`). "Claim" is taught as a multiple-meaning word (ELA.3.V.1.3 / ELA.4.V.1.3).

## Could not verify / judgment calls
- **Mission San Luis watercolor (`sl_watercolor`)**: an artist's reconstruction (Florida Photographic Collection). It shows how the mission *may* have looked, and the game says so.
- **"Fort Caroline" photo**: the fort at Fort Caroline National Memorial is a smaller 1964 model, and the real site is unknown. The caption and `fortCarolineToday` say this.
- **Highsmith photos of Mission San Luis** show the rebuilt buildings. Library of Congress titles were used to identify each building (council house, church, friary kitchen). Photos with costumed interpreters were not used.
- **Scale bars** are accurate for east–west distance in the map's projection near 30° N. North–south scale on an equirectangular map differs slightly. This is fine for grade 4 estimation.
- **"about 2 miles north"** (Fort Mose): the computed straight-line distance from the Castillo to the Fort Mose site is about 2.2 miles, heading north-northwest (about 20° west of north). Sources (Florida State Parks, NPS) say "2 miles north", so the game keeps that wording.

## Other notes for reviewers
- Social Studies benchmark wording in the Teacher view is copied from *Florida's State Academic Standards – Social Studies, 2026* (Ref-19653): <https://flrules.org/gateway/reference.asp?No=Ref-19653>.
- Sensitive content (slavery and freedom seekers at Fort Mose; disease, forced labor and population loss among the Timucua; the 1704 attacks and the end of Mission San Luis) is told briefly and factually. A teacher should preview it.
