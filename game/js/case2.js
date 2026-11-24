/* Case 2: The Cigar Box Code — Phase 1 first-playable data.
   Stops 1 (Weedon Island) and 2 (Fort Brooke / early Tampa) are fully written.
   Stops 3–5 (Plant Hotel, Ybor City, Port of Tampa) are DRAFT scenes (draft: true)
   with story text, questions, clues and standards ready to finish in a later build.

   Shapes match game-v9-title: LOCATIONS, CLUES, CHAPTERS, PASSAGES, SCENES
   (type, teaches, ela, facts, clue, q.kind = mc|multi|typed|order|evidence|match,
   hints, next), VOCAB, FACTS/SRC, journal cards, and a draft Swamp Fox layer.

   This folder is source only. Do not copy into game-v9-title or game-v10 from here
   without a later, approved integration pass.

   The Coded Label, Penny Pinch, Professor Pelican, Ranger Marisol, Guide Lina,
   Detective Sam and the "Day 5" deadline are MADE UP. History facts are cited
   in FACT_CHECK_case2.md. Tobacco is treated as history, not as something to try:
   tobacco harms health. Native people are not drawn as characters.
*/

var CASE2_META = {
  id: "case2",
  title: "The Cigar Box Code",
  subtitle: "Tampa Bay and Ybor City",
  version: "11.0-preview (first playable)",
  cover: "art/webp/case2_cover.webp",
  pennyScene: "art/webp/penny_tampa.webp",
  thief: "penny",
  playableStops: ["weedon", "fortbrooke"],
  draftStops: ["plant", "ybor", "port"],
  disclaimer: "The Coded Label, the thief, and the detectives are made up. The history facts and places are real."
};

var CASE2_START = { coins: 25, energy: 5, day: 1, deadline: 5 };

var CASE2_LOCATIONS = {
  weedon:      { name: "Weedon Island", sub: "Weedon Island Preserve, St. Petersburg", lat: 27.8467, lon: -82.6163, symbol: "preserve", label: "Weedon Island" },
  safetyharbor:{ name: "Safety Harbor", sub: "Philippe Park — Tocobaga temple mound", lat: 28.0086, lon: -82.6910, symbol: "mound", label: "Safety Harbor", related: "weedon" },
  fortbrooke:  { name: "Fort Brooke / downtown Tampa", sub: "mouth of the Hillsborough River", lat: 27.9416, lon: -82.4548, symbol: "fort", label: "Fort Brooke" },
  plant:       { name: "Tampa Bay Hotel", sub: "Plant Hall, University of Tampa", lat: 27.9470, lon: -82.4637, symbol: "hotel", label: "Plant Hotel" },
  ybor:        { name: "Ybor City", sub: "Ybor City Historic District", lat: 27.9603, lon: -82.4389, symbol: "city", label: "Ybor City" },
  port:        { name: "Port Tampa", sub: "historic Port Tampa and today's harbor", lat: 27.8610, lon: -82.5330, symbol: "port", label: "Port Tampa" },
  portbay:     { name: "Port Tampa Bay", sub: "modern cargo and cruise terminals", lat: 27.9300, lon: -82.4370, symbol: "port", label: "Harbor", related: "port" },
  apollobeach: { name: "Apollo Beach", sub: "Manatee Viewing Center", lat: 27.7956, lon: -82.4037, symbol: "wildlife", label: "Apollo Beach", related: "port", decoy: false }
};

var CASE2_CLUES = {
  c2_purple:  { kind: "suspect", text: "A purple ink smudge on the empty exhibit case. The thief still writes in PURPLE ink." },
  c2_umbrella:{ kind: "suspect", text: "A visitor saw someone hurry out with a RED UMBRELLA and a small wooden box." },
  c2_mounds:  { kind: "place", text: "Thief's note on the empty case: \"Start where the bay keeps its oldest stories, in the mounds by the water.\"" },
  c2_river:   { kind: "place", text: "A new scrap of the code: \"Cross the bay EAST, to the place where a river meets the harbor. A wooden fort once stood guard there.\"" },
  c2_minarets:{ kind: "place", text: "A bus ticket stub and a doodle of a pointed silver tower: \"Look for the silver minarets beside the river.\"" },
  c2_ybor:    { kind: "place", text: "Part of the label's hidden message: \"Where people from three countries built a city of brick, bread, and boxes.\"" },
  c2_port:    { kind: "place", text: "Last line of the code: \"Follow the ships to the deepwater port. The rest of the message leaves with the tide.\"" }
};

var CASE2_CHAPTERS = {
  1: { name: "Chapter 1: Weedon Island and the Tocobaga", level: "Warm-up", loc: "weedon", status: "playable" },
  2: { name: "Chapter 2: Fort Brooke and early Tampa", level: "Getting harder", loc: "fortbrooke", status: "playable" },
  3: { name: "Chapter 3: Henry Plant and the Tampa Bay Hotel", level: "Getting harder", loc: "plant", status: "draft" },
  4: { name: "Chapter 4: Ybor City", level: "Expert", loc: "ybor", status: "draft" },
  5: { name: "Chapter 5: The Port of Tampa", level: "Expert", loc: "port", status: "draft" }
};

var CASE2_VOCAB = {
  mound:        { word: "mound", match: ["mound", "mounds"], img: "tocobaga_mound", def: "A hill people built, often from earth, sand, or shells. Some mounds were places to live, some held trash from meals, and some were used for ceremonies." },
  midden:       { word: "midden", match: ["midden", "middens", "shell midden", "shell middens"], def: "A pile of leftover shells and other trash left by people long ago. Kitchen middens show what people ate." },
  preserve:     { word: "preserve", match: ["preserve"], def: "Land set aside and protected so plants, animals, and historic places can stay safe." },
  mangrove:     { word: "mangrove", match: ["mangrove", "mangroves"], img: "weedon_mangrove", def: "A tree that grows in salty coastal water. Its roots stand in the tide and give young fish a place to hide." },
  bay:          { word: "bay", match: ["bay", "Tampa Bay"], img: "weedon_bay", def: "A wide area of coastal water, partly enclosed by land. Tampa Bay is a large bay on Florida's west coast." },
  peninsula:    { word: "peninsula", match: ["peninsula"], def: "A piece of land with water on three sides. Florida is a peninsula, and Pinellas County sits on a smaller peninsula beside Tampa Bay." },
  tribe:        { word: "tribe", match: ["tribe", "tribes"], def: "A group of people who share a culture, a history, and often a homeland. Florida's Native tribes include groups such as the Tocobaga, Timucua, and Apalachee, and, later, the Seminole." },
  explorer:     { word: "explorer", match: ["explorer", "explorers"], def: "A person who travels to a place that is new to them to learn about it, claim it, or look for riches." },
  colonization: { word: "colonization", match: ["colonization", "colonize"], def: "When a country sends people to take control of land far away and rule it." },
  disease:      { word: "disease", match: ["disease", "diseases"], def: "A sickness. Some diseases from Europe spread to Native people who had no protection against them." },
  territory:    { word: "territory", match: ["territory"], def: "Land owned and ruled by a country, but not yet a state. Florida became a U.S. territory in 1821 and a state in 1845." },
  fort:         { word: "fort", match: ["fort", "forts"], img: "fort_brooke_1835", def: "A strong place with buildings and, often, walls or guns, built to protect people or a harbor." },
  harbor:       { word: "harbor", match: ["harbor"], def: "A sheltered place on the coast where ships can safely stop." },
  blockade:     { word: "blockade", match: ["blockade", "blockaded"], def: "When ships or soldiers stop other ships from going in or out of a port." },
  railroad:     { word: "railroad", match: ["railroad", "railroads", "railway"], def: "A system of trains and tracks that can move people and goods far and fast." },
  minaret:      { word: "minaret", match: ["minaret", "minarets"], img: "hotel_minarets", def: "A tall, slender tower, often with a pointed or onion-shaped top. The Tampa Bay Hotel's silver minarets are a famous Tampa landmark." },
  entrepreneur: { word: "entrepreneur", match: ["entrepreneur", "entrepreneurs"], def: "A person who starts and runs a business, often taking a risk in hope that the business will grow." },
  immigrant:    { word: "immigrant", match: ["immigrant", "immigrants"], def: "A person who moves to a new country to live and work." },
  industry:     { word: "industry", match: ["industry", "industries"], def: "A kind of work that makes products or offers services on a large scale, such as cigar making, railroads, or shipping." },
  factory:      { word: "factory", match: ["factory", "factories"], img: "ybor_factory", def: "A building where people work together to make goods." },
  lector:       { word: "lector", match: ["lector", "lectors", "reader", "readers"], def: "(LEK-tor) A person hired by factory workers to read newspapers and books out loud while the workers used their hands. In Ybor City this reader was called el lector." },
  "mutual-aid": { word: "mutual-aid club", match: ["mutual-aid", "mutual aid", "mutual-aid club", "mutual-aid clubs"], def: "A group whose members help one another, often by sharing the cost of a doctor, hosting gatherings, and caring for families in hard times." },
  port:         { word: "port", match: ["port", "ports"], img: "port_1898", def: "A place where ships load and unload goods and people." },
  phosphate:    { word: "phosphate", match: ["phosphate", "phosphates"], def: "A mineral used to make fertilizer that helps crops grow. In the late 1880s, phosphate found near Tampa was shipped out through the port." },
  manatee:      { word: "manatee", match: ["manatee", "manatees"], img: "manatee_photo", def: "A large, gentle, plant-eating water mammal, sometimes called a sea cow. Florida manatees live in warm rivers, springs, and coastal waters." },
  "primary source": { word: "primary source", match: ["primary source", "primary sources"], def: "Something made by a person who was there at the time, like a letter, a photograph, a map, or a picture drawn in 1835." },
  "secondary source": { word: "secondary source", match: ["secondary source", "secondary sources"], def: "Something made later by a person who studied the past, like a museum panel or a textbook." },
  "compass rose": { word: "compass rose", match: ["compass rose"], def: "The symbol on a map that shows directions: north (N), east (E), south (S) and west (W)." },
  "scale bar":  { word: "scale bar", match: ["scale bar", "scale bars"], def: "The line on a map that shows how far real distances are, like 'this much line = 1 mile.'" },
  hotel:        { word: "hotel", match: ["hotel", "hotels"], img: "hotel_minarets", def: "A building where travelers can stay overnight. Henry Plant's Tampa Bay Hotel was also a resort and a landmark." },
  city:         { word: "city", match: ["city", "cities"], def: "A large community where many people live and work, with streets, shops, and homes close together." }

};

var CASE2_BENCHMARKS = {
  "SS.3.A.1.1": "Analyze primary and secondary sources.",
  "SS.3.A.1.3": "Define terms related to the social sciences.",
  "SS.3.E.1.1": "Give examples of how scarcity results in trade.",
  "SS.3.E.1.3": "Recognize that buyers and sellers interact to exchange goods and services through the use of trade or money.",
  "SS.3.G.1.1": "Use thematic maps, tables, charts, graphs, and photos to analyze geographic information.",
  "SS.3.G.1.2": "Review basic map elements (coordinate grid, cardinal and intermediate directions, title, compass rose, scale, key or legend with symbols).",
  "SS.3.G.2.5": "Identify natural and man-made landmarks in the United States, Canada, Mexico, and the Caribbean.",
  "SS.3.G.3.2": "Describe the natural resources in the United States, Canada, Mexico, and the Caribbean.",
  "SS.3.G.4.1": "Explain how the environment influences settlement patterns in the United States, Canada, Mexico, and the Caribbean.",
  "SS.3.G.4.2": "Identify the cultures that have settled the United States, Canada, Mexico, and the Caribbean.",
  "SS.3.G.4.4": "Identify contributions from various ethnic groups to the United States.",
  "SS.4.A.1.1": "Analyze primary and secondary resources to identify significant individuals and events throughout Florida history.",
  "SS.4.A.2.1": "Compare Native American tribes in Florida.",
  "SS.4.A.3.1": "Identify explorers who came to Florida and the motivations for their expeditions.",
  "SS.4.A.3.2": "Describe causes and effects of European colonization on the Native American tribes of Florida.",
  "SS.4.A.3.9": "Explain how Florida (Adams-Onis Treaty) became a United States territory.",
  "SS.4.A.3.10": "Identify the causes and effects of the Seminole Wars.",
  "SS.4.A.4.1": "Explain the effects of technological advances on Florida.",
  "SS.4.A.4.2": "Describe pioneer life in Florida.",
  "SS.4.A.5.1": "Describe Florida’s involvement (secession, blockades of ports, the battles of Ft. Pickens, Olustee, Ft. Brooke, Natural Bridge, food supply) in the Civil War.",
  "SS.4.A.6.1": "Describe the economic development of Florida’s major industries.",
  "SS.4.A.6.2": "Summarize contributions that immigrant groups made to Florida.",
  "SS.4.A.6.3": "Describe the contributions of significant individuals to Florida.",
  "SS.4.A.6.4": "Describe effects of the Spanish American War on Florida.",
  "SS.4.A.9.1": "Utilize timelines to sequence key events in Florida history.",
  "SS.4.E.1.1": "Identify entrepreneurs from various demographic backgrounds who have influenced Florida and local economy.",
  "SS.4.E.1.2": "Explain Florida’s role in the national and international economy and the conditions that attract businesses to the state.",
  "SS.4.G.1.1": "Identify physical features of Florida.",
  "SS.4.G.1.2": "Locate and label cultural features on a Florida map.",
  "SS.4.G.1.4": "Interpret political and physical maps using map elements (title, compass rose, cardinal directions, intermediate directions, symbols, legend, scale, longitude, latitude)."
};

var CASE2_BENCHMARK_SOURCE = {
  title: "Florida's State Academic Standards – Social Studies, 2026 (Rule 6A-1.09401, F.A.C., Ref-19653)",
  url: "https://flrules.org/gateway/reference.asp?No=Ref-19653",
  pdf: "https://cpalmsmediaprod.blob.core.windows.net/uploads/docs/standards/best/ss/ssstandards202607.pdf",
  note: "Exact wording above was copied from the official 2026 PDF (downloaded 2026-11-22 into case2-src/sources/). The 2026 document does not list tribe-name examples under SS.4.A.2.1; older CPALMS remarks and district pacing guides list Tocobaga among example tribes (with Apalachee, Calusa, Tequesta, and Timucua). SS.4.A.5.1 names the battle of Ft. Brooke in the official wording."
};

var CASE2_ELA_BENCHMARKS = {
  "ELA.3.R.2.1": { grade: 3, text: "Explain how text features contribute to meaning and identify the text structures of chronology, comparison, and cause/effect in texts." },
  "ELA.3.R.2.2": { grade: 3, text: "Identify the central idea and explain how relevant details support that idea in a text." },
  "ELA.3.R.2.3": { grade: 3, text: "Explain the development of an author’s purpose in an informational text." },
  "ELA.3.R.2.4": { grade: 3, text: "Identify an author’s claim and explain how an author uses evidence to support the claim." },
  "ELA.3.V.1.3": { grade: 3, text: "Use context clues, figurative language, word relationships, reference materials, and/or background knowledge to determine the meaning of multiple-meaning and unknown words and phrases, appropriate to grade level." },
  "ELA.4.R.2.1": { grade: 4, text: "Explain how text features contribute to the meaning and identify the text structures of problem/solution, sequence, and description in texts." },
  "ELA.4.R.2.2": { grade: 4, text: "Explain how relevant details support the central idea, implied or explicit." },
  "ELA.4.R.2.3": { grade: 4, text: "Explain an author’s perspective toward a topic in an informational text." },
  "ELA.4.R.2.4": { grade: 4, text: "Explain an author’s claim and the reasons and evidence used to support the claim." },
  "ELA.4.R.3.3": { grade: 4, text: "Compare and contrast accounts of the same event using primary and/or secondary sources." },
  "ELA.4.V.1.3": { grade: 4, text: "Use context clues, figurative language, word relationships, reference materials, and/or background knowledge to determine the meaning of multiple-meaning and unknown words and phrases, appropriate to grade level." },
  "ELA.K12.EE.1.1": { grade: "K-12", text: "Cite evidence to explain and justify reasoning." }
};

var CASE2_ELA_SOURCE = {
  title: "Florida's State Academic Standards – B.E.S.T. English Language Arts, 2025 (Rule 6A-1.09401, F.A.C., Ref-18865)",
  url: "https://flrules.org/gateway/reference.asp?No=Ref-18865",
  note: "Wording matches the Case 1 game file js/benchmarks.js, which copied it from the official 2025 B.E.S.T. ELA document."
};

var CASE2_SRC = {
  pinellasWeedon: "https://pinellas.gov/parks/weedon-island-preserve/",
  pinellasTocobaga: "https://pinellas.gov/tocobaga-temple-mound/",
  pinellasTimeline: "https://pinellas.gov/yat-kitischee/prehistoric-timeline/",
  pinellasArch: "https://plan.pinellas.gov/comp_plan/8rec/ch14.pdf",
  flDepWeedon: "https://floridadep.gov/sites/default/files/Item%2006%20Weedon%20Island%20Preserve%20MP_0.pdf",
  ochpBrooke: "https://info.flheritage.com/maritime-trail/forts/fort.cfm?name=Fort_Brooke",
  tbhcBrooke: "https://tampabayhistorycenter.org/exhibit/replacing-fort-brooke/",
  cityTampa: "https://www.tampa.gov/info/tampa-history",
  plantChron: "https://www.plantmuseum.com/discover/learn/chronology",
  plantHist: "https://www.plantmuseum.com/about/history",
  utHistory: "https://www.ut.edu/about-utampa/history",
  npsHotel: "https://www.nps.gov/places/tampa-bay-hotel.htm",
  npsYbor: "https://www.nps.gov/places/ybor-city-historic-district-tampa-fl.htm",
  fwsManatee: "https://www.fws.gov/species/florida-manatee-trichechus-manatus-latirostris",
  tecoMvc: "https://www.tampaelectric.com/company/mvc/",
  dosExplore: "https://dos.fl.gov/florida-facts/florida-history/a-brief-history/european-exploration-and-colonization/",
  dosBrief: "https://dos.fl.gov/florida-facts/florida-history/a-brief-history/",
  flMemorySeminole: "https://floridamemory.com/learn/classroom/learning-units/seminoles/lessonplans/4thgrade/4th-causes.php",
  standards2026: "https://flrules.org/gateway/reference.asp?No=Ref-19653",
  standardsPdf: "https://cpalmsmediaprod.blob.core.windows.net/uploads/docs/standards/best/ss/ssstandards202607.pdf",
  apPalmetto: "https://apnews.com/general-news-d46df3326e9fb6c66dafbfab94ee962e",
  sfaBread: "https://www.southernfoodways.org/interview/anthony-more-jr-and-copeland-more/",
  tampaHistoricalSaw: "https://www.tampahistorical.org/items/show/54"
};

var CASE2_FACTS = {
  /* ----- Weedon Island and Tocobaga ----- */
  weedonPreserve: { text: "Weedon Island Preserve is an expansive natural area of about 3,000 acres on Tampa Bay in north St. Petersburg. Indigenous peoples, including people of the Weeden (also spelled Weedon) Island Cultural Period, lived at this site for thousands of years.", src: [CASE2_SRC.pinellasWeedon] },
  weedonBoardwalks: { text: "More than 4.7 miles of boardwalks and trails let visitors explore the preserve, including mangrove shoreline and an observation tower.", src: [CASE2_SRC.pinellasWeedon] },
  weedonMiddens: { text: "The preserve includes Native American shell middens and a burial mound. Shell middens are piles of leftover shells and other remains left by people long ago.", src: [CASE2_SRC.flDepWeedon, CASE2_SRC.pinellasArch] },
  weedonExcavation: { text: "In the early 1920s, J. Walter Fewkes of the Smithsonian Institution excavated part of the burial mound at Weedon Island. The finely decorated pottery found there became associated with what archaeologists called the Weedon (Weeden) Island culture.", src: [CASE2_SRC.pinellasTimeline, CASE2_SRC.pinellasArch] },
  weedonCultureNote: { text: "Later research showed that the Weeden Island pottery style was centered in north Florida and southern Georgia and Alabama, and that the people who lived at Weedon Island were part of the Manasota culture.", src: [CASE2_SRC.pinellasTimeline], flag: "This nuance is recorded for teachers and FACT_CHECK. Kid-facing text says Native peoples lived at Weedon Island for thousands of years and left shell mounds, and does not call the site a Tocobaga capital." },
  tocobagaCapital: { text: "The Tocobaga built a large temple mound at today's Philippe Park in Safety Harbor, a short way north of Weedon Island. Spanish records and archaeology indicate this village was likely the Tocobaga capital. It is the type site for the Safety Harbor culture.", src: [CASE2_SRC.pinellasTocobaga, CASE2_SRC.pinellasTimeline] },
  tocobagaMound: { text: "The temple mound at Philippe Park is the largest remaining mound in the Tampa Bay region. It was made of alternating layers of shell and sand. Remains of posts suggest a structure on top, possibly used for ceremonies or as a chief's dwelling. A ramp likely led to a town plaza at the base.", src: [CASE2_SRC.pinellasTocobaga] },
  tocobagaFood: { text: "A huge amount of shells in the kitchen midden shows that the Tocobaga relied on the coastal bays for food. They also made many tools and utensils from bone and shell.", src: [CASE2_SRC.pinellasTocobaga] },
  tocobagaDates: { text: "Archaeologists believe the Tocobaga people occupied the Safety Harbor site as early as about 900 A.D. until the late 1600s.", src: [CASE2_SRC.pinellasTocobaga] },
  narvaez1528: { text: "In 1528, the Spanish explorer Pánfilo de Narváez came to the Tampa Bay area, including the Tocobaga homeland, with hundreds of men, searching for gold and silver. The expedition was a disaster. Álvar Núñez Cabeza de Vaca was one of only four men who survived.", src: [CASE2_SRC.pinellasTocobaga], flag: "Pinellas County's page has a typo (\"Pan lo de Narvaez\") and says he came \"here\" with 400 men. Historians debate the exact landing beach on Tampa Bay. Kid-facing text says he came to the Tampa Bay / Tocobaga area in 1528 searching for gold and silver, and does not name a modern street or park as the landing spot." },
  menendez1567: { text: "In 1567, Pedro Menéndez de Avilés, who had founded St. Augustine, visited the Tocobaga town. He left 30 men to start a mission. When a Jesuit priest returned in January 1568, he found the village abandoned and the Spanish soldiers dead.", src: [CASE2_SRC.pinellasTocobaga, CASE2_SRC.pinellasTimeline] },
  tocobagaEnd: { text: "The Tocobaga community declined after contact with Europeans. A likely cause was disease brought from Europe, which Native people had not faced before. It is believed that any remaining Tocobaga people may later have merged with Creek peoples moving into Florida in the 1700s.", src: [CASE2_SRC.pinellasTocobaga] },
  compareTribes: { text: "The Tocobaga lived around Tampa Bay and relied on fish and shellfish from the coastal bays, building temple mounds and middens. The Timucua lived in northeast Florida, including the St. Augustine area. The Apalachee lived in the Tallahassee area, farmed maize and other crops, and met in a large council house at places such as Mission San Luis.", src: [CASE2_SRC.pinellasTocobaga], flag: "Comparison uses this file for the Tocobaga and Case 1 sourced facts (Florida Museum / Mission San Luis / NPS) for the Timucua and Apalachee. SS.4.A.2.1 asks students to compare tribes; the official 2026 standard text does not list tribe names, but district CPALMS-aligned guides commonly include Tocobaga as an example." },
  desoto1539bay: { text: "In 1539, the Spanish explorer Hernando de Soto landed in the Tampa Bay area and marched inland through Florida, searching for gold and silver.", src: [CASE2_SRC.dosExplore], flag: "Case 1 already sources de Soto's 1539 expedition and search for gold and silver to the Florida Department of State. Many standard accounts place his landing in the Tampa Bay region, but the exact beach is debated. Kid-facing text says \"in the Tampa Bay area\" and does not name a modern city as the landing site." },

  /* ----- Fort Brooke and early Tampa ----- */
  territory1821: { text: "In 1821, Florida became a United States territory after Spain and the United States agreed in the Adams-Onís Treaty (signed 1819, taking effect 1821).", src: [CASE2_SRC.dosBrief] },
  state1845: { text: "Florida became a state in 1845.", src: [CASE2_SRC.dosBrief] },
  fortBrooke1824: { text: "In 1824, Colonel George Mercer Brooke of the U.S. Army established a major military post on the Hillsborough River at Tampa Bay. It became known as Fort Brooke.", src: [CASE2_SRC.ochpBrooke, CASE2_SRC.tbhcBrooke, CASE2_SRC.cityTampa], flag: "The Tampa Bay History Center has used the date January 22, 1824. Other accounts describe a camp in early January 1824 that was later named Fort Brooke. Kid-facing text uses the year 1824." },
  fortBrookeBuildings: { text: "By 1829, Fort Brooke included a guardhouse, barracks, storehouses, a blockhouse, a powder magazine, stables, and a wharf.", src: [CASE2_SRC.ochpBrooke] },
  seminoleWarsHQ: { text: "Fort Brooke was a prominent U.S. Army headquarters during the Seminole Wars of 1835–1842 and 1855–1858. During the Second Seminole War (1835–1842), more than 40,000 soldiers passed through the fort.", src: [CASE2_SRC.ochpBrooke] },
  dade1835: { text: "In late December 1835, U.S. troops leaving Fort Brooke on the road toward Fort King were attacked in a battle often called Dade's Battle. It was an early fight of the Second Seminole War. In 1836, Seminole fighters laid siege to Fort Brooke for almost a month.", src: [CASE2_SRC.ochpBrooke, CASE2_SRC.flMemorySeminole], flag: "Kid-facing text does not use the word \"massacre.\" Florida Memory and Florida OCHP are the sources. Causes of the Seminole Wars (land, trade, and the U.S. demand that Seminoles leave Florida or return people who had escaped slavery) are treated briefly and factually for grade 4." },
  seminoleRemoval: { text: "During and after the Seminole Wars, the U.S. government forced many Seminole people to leave Florida. Some were held at Fort Brooke and sent west. A smaller number of Seminoles remained in Florida.", src: [CASE2_SRC.flMemorySeminole] },
  tampa1848: { text: "On July 25, 1848, the day on which Tampa was legally created, President Polk signed an Act of Congress that granted Hillsborough County 160 acres from the Fort Brooke reservation for the town.", src: [CASE2_SRC.ochpBrooke], flag: "Some popular accounts say Tampa was incorporated in 1849. Kid-facing text follows the Florida Department of State's Florida Maritime Heritage Trail (OCHP) wording that Tampa was legally created on July 25, 1848, when land was granted from the fort." },
  cityCharter1887: { text: "A charter for the City of Tampa was established in 1887, after the railroad reached Tampa.", src: [CASE2_SRC.plantChron] },
  civilWarBrooke: { text: "During the Civil War, Union ships blockaded Florida ports, including Tampa Bay. In October 1863, Union gunboats bombarded Fort Brooke, and a landing party later burned Confederate blockade-running ships on the Hillsborough River. This fighting is remembered as the Battle of Fort Brooke, which is named in Florida's grade 4 Civil War benchmark.", src: [CASE2_SRC.tampaHistoricalSaw, CASE2_SRC.standards2026], flag: "Details of the October 1863 bombardment and the Ballast Point landing are summarized from Tampa Historical, a local history project. The official 2026 standard SS.4.A.5.1 names \"the battles of Ft. Pickens, Olustee, Ft. Brooke, Natural Bridge.\" Kid-facing text stays high-level: Union ships blocked the port, fired on the fort, and attacked supply ships." },
  fortGone: { text: "After the wars, Fort Brooke was later abandoned. Downtown Tampa, including land near today's riverfront, now stands where the fort once stood. Markers remember parts of the site.", src: [CASE2_SRC.ochpBrooke, CASE2_SRC.tbhcBrooke, CASE2_SRC.cityTampa] },

  /* ----- Henry Plant and the Tampa Bay Hotel ----- */
  railroad1884: { text: "In 1884, Henry B. Plant brought the railroad to Tampa. In 1880, Tampa's population was about 720. By 1890 it had grown to 5,532.", src: [CASE2_SRC.plantChron, CASE2_SRC.npsHotel] },
  plantCity: { text: "In 1884, the town of Ichepucksassa was renamed Plant City in honor of Henry Plant.", src: [CASE2_SRC.plantChron] },
  plantShips: { text: "In 1885, the Plant Steamship Line began running between Port Tampa, Key West, and Havana, Cuba. In 1887, Plant began to develop Port Tampa as a deepwater port. In 1888, a nine-mile railroad spur connected Tampa to Port Tampa.", src: [CASE2_SRC.plantChron] },
  hotelDates: { text: "The cornerstone of the Tampa Bay Hotel was laid on July 26, 1888. Henry Plant opened the hotel as a winter resort on February 5, 1891.", src: [CASE2_SRC.plantChron] },
  hotelBuilding: { text: "The Tampa Bay Hotel was designed by architect J.A. Wood in a Moorish Revival style, with silver minarets, domes, and porches. It had more than 500 rooms, stood five stories tall, and was one of the largest buildings in Florida at the time.", src: [CASE2_SRC.plantHist, CASE2_SRC.npsHotel, CASE2_SRC.utHistory], flag: "The Henry B. Plant Museum says the structure covered six acres and was 1/4 mile long, and cost $2,500,000 plus $500,000 for furnishings. The National Park Service says the hotel was 900 feet long (which is less than 1/4 mile), five stories, and contained over 500 rooms, and cost over $2 million to build and nearly $500,000 to furnish. The University of Tampa gives a cost of $2.5 million and 511 rooms. Kid-facing text uses \"more than 500 rooms,\" \"five stories,\" \"silver minarets,\" and does not state a single exact length." },
  hotelToday: { text: "The hotel closed as a resort in 1932. In 1933, the City of Tampa leased the building to the University of Tampa. Today it is called Plant Hall. The Henry B. Plant Museum occupies the south wing. The building is a National Historic Landmark, in part for its role in the Spanish-American War.", src: [CASE2_SRC.plantChron, CASE2_SRC.npsHotel] },
  sawHotel: { text: "In May 1898, the Tampa Bay Hotel became a headquarters and temporary home for Army officers, war correspondents, and other people preparing for the Spanish-American War. Theodore Roosevelt was among the notable guests. The U.S. government chose Tampa as the official port of embarkation for forces heading to Cuba because of its location, its deepwater port, and Plant's railroad and ships.", src: [CASE2_SRC.npsHotel, CASE2_SRC.plantChron] },
  sawTroops: { text: "By late spring of 1898, about 30,000 soldiers had arrived in Tampa, including Roosevelt's Rough Riders. Troops later boarded ships at the port to sail to Cuba.", src: [CASE2_SRC.npsHotel] },
  pop1898: { text: "By 1898, Tampa's population was about 25,000.", src: [CASE2_SRC.plantChron] },

  /* ----- Ybor City ----- */
  yborFounded: { text: "In 1885, Vicente Martínez-Ybor and Ignacio Haya formed a partnership to develop a cigar-manufacturing town near Tampa. In 1886 they oversaw the first worker houses and factories. Tampa annexed Ybor City in 1887, but the neighborhood kept its own identity.", src: [CASE2_SRC.npsYbor] },
  yborWhy: { text: "Tampa was a good place for the factories because of its warm, humid climate, its closeness to Cuba for tobacco and workers, and Plant's new railroad, which could ship cigars to the rest of the United States.", src: [CASE2_SRC.npsYbor, CASE2_SRC.npsHotel] },
  yborYborBio: { text: "Vicente Martínez-Ybor was born in Valencia, Spain, lived in Cuba, and later moved his factories to the United States, first to Key West and New York, then to Tampa.", src: [CASE2_SRC.npsYbor] },
  yborImmigrants: { text: "People from Cuba, Spain, and Italy made Ybor City their home. There were also German, Romanian Jewish, and Chinese immigrants. Of the first wave of Cuban immigrants, about 15 percent were Afro-Cuban.", src: [CASE2_SRC.npsYbor] },
  yborPop: { text: "When the land was bought, Tampa's population was around 700. By 1890, Ybor City's population was around 6,000.", src: [CASE2_SRC.npsYbor] },
  yborLector: { text: "In the factories, readers — hired by the workers — read newspapers and other writings out loud while people worked with their hands. These readers (el lector) shared news, stories, and, at times, news about Cuba.", src: [CASE2_SRC.npsYbor] },
  yborClubs: { text: "Residents formed ethnic social clubs and benevolent (mutual-aid) organizations that offered members medical plans and charitable help. Historic clubs included El Centro Español, the Centro Asturiano, the Círculo Cubano, L'Unione Italiana, and La Unión Martí-Maceo.", src: [CASE2_SRC.npsYbor] },
  yborCapital: { text: "At the turn of the 20th century, Ybor City was known as the \"Cigar Capital of the World.\" By 1900, Tampa manufacturers produced high-quality hand-rolled cigars. Tobacco harms health. The game teaches this history to honor workers, immigrants, and label art, not to praise smoking.", src: [CASE2_SRC.npsYbor] },
  cubanSandwich: { text: "A Tampa Cuban sandwich is often made with Cuban bread and includes roast pork, ham, Swiss cheese, pickles, mustard, and Genoa salami. The salami reflects Italian influence in Ybor City.", src: [], flag: "This wording follows the Local Flavor fact already used in Case 1 (and a widely reported Tampa tradition). A formal museum or city citation was not pinned in this pass; please confirm against a Tampa Bay History Center or similar source before calling it final." },
  cubanBread: { text: "Cuban bread is a long, crusty loaf important to Tampa's food traditions. Some Tampa bakeries have baked the loaves with a palmetto leaf on top, a custom that helps the loaf split as it bakes.", src: [CASE2_SRC.apPalmetto, CASE2_SRC.sfaBread] },
  yborChickens: { text: "Visitors today often see free-roaming chickens in Ybor City. They are a familiar part of the neighborhood's local flavor.", src: [], flag: "Supported by many contemporary photographs (including a CC-licensed photo used in this pack) and common local knowledge. No ordinance or origin story is claimed without a source." },

  /* ----- Port, phosphate, manatees ----- */
  phosphate1880s: { text: "When phosphates were discovered near Tampa in the late 1880s, mining and shipping helped start a boom of growth and wealth that lasted through the 1890s. Phosphate is used to make fertilizer.", src: [CASE2_SRC.cityTampa] },
  portEmbarkation: { text: "Tampa was the primary outfitting and embarkation port for U.S. troops bound for Cuba during the Spanish-American War of 1898.", src: [CASE2_SRC.cityTampa, CASE2_SRC.npsHotel] },
  manateeSpecies: { text: "The Florida manatee (Trichechus manatus latirostris) is a subspecies of the West Indian manatee. It is a large marine mammal that primarily eats plants, including seagrasses. Adults are typically about 9 to 10 feet long and often weigh around 1,000 pounds. People sometimes call manatees sea cows.", src: [CASE2_SRC.fwsManatee] },
  manateeWarm: { text: "Florida manatees cannot tolerate water colder than 68 degrees Fahrenheit for long. In winter they gather at warm-water sites such as natural springs, power-plant outfalls, and other warm basins. The U.S. Fish and Wildlife Service estimates that at least 8,350 manatees inhabit Florida.", src: [CASE2_SRC.fwsManatee] },
  apolloBeach: { text: "Tampa Electric's Big Bend Power Station in Apollo Beach circulates water from Tampa Bay for cooling and returns it to the bay warm. In winter, manatees gather in this warm water. The discharge canal is a state and federally designated manatee sanctuary, and the company operates a public Manatee Viewing Center. Manatees are most likely to be seen when the bay water drops below 68 degrees Fahrenheit.", src: [CASE2_SRC.tecoMvc] }
};

var CASE2_PASSAGES = {
  p_baypeoples: { title: "People of the Bay", kind: "Informational text",
    source: "Written for this game in 2026 from Pinellas County sources on Weedon Island Preserve and the Tocobaga temple mound (see FACT_CHECK_case2.md: weedonPreserve, weedonMiddens, tocobagaCapital, tocobagaFood, tocobagaDates).",
    sentences: [
      "For thousands of years, Native peoples lived along Tampa Bay.",
      "At Weedon Island they left shell mounds, sometimes called middens, made of leftover shells and other remains.",
      "Those mounds show that people came back to this shoreline again and again to fish and gather shellfish.",
      "Later, the Tocobaga people built their main town a short way north, at today's Safety Harbor.",
      "Their temple mound, made of shell and sand, was the largest still remaining around the bay.",
      "The Tocobaga relied on the coastal bays for food and made many tools from bone and shell.",
      "Archaeologists believe they lived at that town from about 900 A.D. until the late 1600s.",
      "Comparing tribes helps us see that Florida's Native peoples were not all the same: some lived by the sea, and some, like the Apalachee, farmed inland."
    ] },
  p_fortbrooke: { title: "A Fort at the River's Mouth", kind: "Informational text",
    source: "Written for this game in 2026 from the Florida Department of State's Florida Maritime Heritage Trail page on Fort Brooke and related sources (see FACT_CHECK_case2.md: fortBrooke1824, seminoleWarsHQ, tampa1848, civilWarBrooke, fortGone).",
    sentences: [
      "In 1824, Colonel George Mercer Brooke established Fort Brooke where the Hillsborough River meets Tampa Bay.",
      "The United States wanted a strong post on this harbor after Florida became a U.S. territory in 1821.",
      "During the Seminole Wars, Fort Brooke was a major Army headquarters, and tens of thousands of soldiers passed through.",
      "Many Seminole people were forced to leave Florida in those years, and some were sent west from this area.",
      "A town grew beside the fort, and in 1848 land from the fort was granted for Tampa.",
      "In the Civil War, Union ships blocked the port and, in 1863, attacked Fort Brooke and supply ships on the river.",
      "The wooden fort is gone now.",
      "Downtown Tampa stands near the place where the harbor was once guarded by soldiers and tents."
    ] },
  p_plant: { title: "The Railroad and the Silver Towers", kind: "Informational text", draft: true,
    source: "Draft passage written for this game from the Henry B. Plant Museum chronology and the National Park Service Tampa Bay Hotel page (see railroad1884, hotelDates, hotelBuilding, sawHotel).",
    sentences: [
      "In 1884, Henry B. Plant brought a railroad to Tampa, a small town of only a few hundred people.",
      "Trains could move people, mail, and goods much faster than wagons or sailing ships alone.",
      "Plant also ran steamships and built a deepwater port, linking Tampa to Key West and Havana.",
      "To attract visitors, he built the Tampa Bay Hotel and opened it in 1891.",
      "The huge red-brick hotel had more than 500 rooms and silver minarets that still shine above the river.",
      "In 1898, the hotel became a headquarters while thousands of soldiers gathered in Tampa for the Spanish-American War.",
      "Today the building is Plant Hall at the University of Tampa, and part of it is a museum."
    ] },
  p_lector: { title: "The Reader in the Factory", kind: "Informational text", draft: true,
    source: "Draft passage written for this game from the National Park Service Ybor City Historic District page (see yborFounded, yborImmigrants, yborLector, yborClubs). Tobacco is mentioned only as a historic industry.",
    sentences: [
      "In 1885 and 1886, Vicente Martínez-Ybor and other manufacturers built a new town beside Tampa for cigar factories and workers' homes.",
      "Immigrants from Cuba, Spain, and Italy — and other countries too — made Ybor City their home.",
      "Factory workers often hired a reader, called el lector, to sit above the workroom and read out loud.",
      "The lector read newspapers and books so that people could hear the news while their hands were busy.",
      "Neighbors also built mutual-aid clubs, such as El Centro Español and L'Unione Italiana, that helped families see a doctor and gather together.",
      "Ybor City became famous for its hand-rolled cigar industry, but tobacco harms health.",
      "We study this history to learn about work, immigration, and the beautiful paper labels that once decorated the boxes."
    ] },
  p_port: { title: "A Harbor That Changed a City", kind: "Informational text", draft: true,
    source: "Draft passage written for this game from the City of Tampa history page, the National Park Service Tampa Bay Hotel page, and U.S. Fish and Wildlife Service manatee facts (see phosphate1880s, portEmbarkation, sawTroops, manateeWarm).",
    sentences: [
      "Tampa Bay is a deep harbor on Florida's west coast.",
      "In the late 1880s, phosphate mined near Tampa was shipped out through the port, and the city grew quickly.",
      "In 1898, Tampa was the main port where U.S. soldiers boarded ships for Cuba during the Spanish-American War.",
      "About 30,000 soldiers gathered in the Tampa area that spring.",
      "The same bay is also a home for wildlife.",
      "In winter, Florida manatees look for water warmer than 68 degrees, including warm water near Apollo Beach.",
      "A busy port, a railroad, and a sheltered bay helped turn a small town into a city connected to the wider world."
    ] }
};

var CASE2_SCENES = {
  c2intro: { loc: "office", img: "case2_cover", chapter: 0, speaker: "Professor Pelican", title: "The Cigar Box Code",
    text: ["Junior Detective, we have a new case! Someone stole <b>the Coded Label</b> from a Tampa museum exhibit about the city's cigar years.",
           "The Label is a rare paper from an old cigar box, with a hidden handwritten code on the back. Historians needed it to put a set of historic labels back in order.",
           "Our spies say <b>Penny Pinch</b> was seen leaving with a small wooden box and her red umbrella. She is heading around Tampa Bay. We must catch her before <b>Day 5</b>.",
           "The empty case had a smudge of <b style=\"color:#9b59d0\">purple ink</b> and a scrap of a note: \"Start where the bay keeps its oldest stories, in the mounds by the water.\"",
           "<i>(The Coded Label, Penny Pinch, and your fellow detectives are made up. The history facts and places are real. Tobacco harms health. We will study workers, immigrants, and label art — not smoking.)</i>"],
    clue: "c2_purple",
    choices: [{ label: "Take the case! Go to Weedon Island", next: "wi1" }] },

  /* ===================== CHAPTER 1: WEEDON ISLAND (warm-up) ===================== */
  wi1: { loc: "weedon", img: "weedon_boardwalk", chapter: 1, speaker: "Ranger Marisol", title: "Welcome to Weedon Island",
    teaches: ["SS.4.G.1.1", "SS.3.G.4.1"], facts: ["weedonPreserve", "weedonBoardwalks"],
    text: ["Welcome to <b>Weedon Island Preserve</b> in north St. Petersburg! This is a wide natural area of about <b>3,000 acres</b> on <b>Tampa Bay</b>.",
           "Boardwalks let us walk above the wet ground and the <b>mangroves</b> without hurting the plants.",
           "Indigenous peoples lived on this shoreline for <b>thousands of years</b>. If Penny followed the note about \"mounds by the water,\" she started here. Where do you want to look first?"],
    choices: [{ label: "Look out over Tampa Bay", next: "wi1bay" },
              { label: "Ask about the shell mounds", next: "wi1mound" }] },

  wi1bay: { loc: "weedon", img: "weedon_bay", chapter: 1, speaker: "Ranger Marisol", title: "A Bay with a Story",
    teaches: ["SS.4.G.1.1", "SS.3.G.1.1"], facts: ["weedonPreserve"],
    text: ["From the observation tower you can see <b>mangrove islands</b> and the open water of <b>Tampa Bay</b>.",
           "A <b>bay</b> is a wide area of coastal water, partly wrapped by land. Tampa Bay is one of Florida's most important harbors.",
           "People have always come here because the bay gives food, shelter for boats, and a path to the Gulf. The environment helped shape where people settled."],
    choices: [{ label: "Now tell me about the mounds", next: "wi1mound" }] },

  wi1mound: { loc: "weedon", img: "weedon_mangrove", chapter: 1, speaker: "Ranger Marisol", title: "Stories in the Shells",
    teaches: ["SS.4.A.1.1", "SS.4.A.2.1"], facts: ["weedonMiddens", "weedonExcavation", "weedonCultureNote"],
    text: ["All around this preserve are <b>shell middens</b> — piles of leftover shells and other remains left by people long ago. There is also a burial mound. We do not climb or dig in the mounds. We protect them.",
           "The mounds tell us that people fished and gathered shellfish here for a very long time.",
           "About a hundred years ago, a scientist from the Smithsonian Institution studied a mound here and found beautiful pottery. We still learn from that work — and from leaving the rest of the site in peace."],
    choices: [{ label: "Who were the Tocobaga?", next: "wi1tocobaga" }] },

  wi1tocobaga: { loc: "weedon", img: "tocobaga_mound", chapter: 1, speaker: "Ranger Marisol", title: "The Tocobaga of Safety Harbor",
    teaches: ["SS.4.A.2.1", "SS.3.G.2.5"], facts: ["tocobagaCapital", "tocobagaMound", "tocobagaFood", "tocobagaDates"],
    text: ["The mounds here are very old. The <b>Tocobaga</b> people, who lived around Tampa Bay later, built their <b>main town</b> a short way <b>north</b>, at today's <b>Safety Harbor</b>.",
           "At Philippe Park you can still see their <b>temple mound</b>, the largest remaining mound around the bay. It was made of shell and sand. A building once stood on top, and a ramp likely led to a plaza.",
           "The Tocobaga got much of their food from the coastal bays. They made many tools from bone and shell. Archaeologists believe they lived at that town from about <b>900 A.D.</b> until the late <b>1600s</b>."],
    choices: [{ label: "Compare Florida's Native tribes", next: "wi1compare" }] },

  wi1compare: { loc: "weedon", img: "tocobaga_mound", chapter: 1, speaker: "Ranger Marisol", title: "Not One Story — Many Peoples", type: "q",
    teaches: ["SS.4.A.2.1"], facts: ["compareTribes"], ela: ["ELA.3.R.2.1"],
    text: ["Florida's Native peoples were not all the same. Comparing them is an important grade 4 skill.",
           "The <b>Tocobaga</b> lived around Tampa Bay and relied on fish and shellfish. The <b>Timucua</b> lived in northeast Florida, near today's St. Augustine. The <b>Apalachee</b> lived near today's Tallahassee, farmed crops, and met in a large <b>council house</b>."],
    q: { kind: "match", prompt: "Match each Native people to the detail that best fits them.",
      pairs: [
        { clue: "Lived around Tampa Bay and built a temple mound at Safety Harbor", place: "Tocobaga" },
        { clue: "Lived in northeast Florida, near St. Augustine", place: "Timucua" },
        { clue: "Lived near today's Tallahassee and met in a large council house", place: "Apalachee" }
      ] },
    hints: ["Which group does Ranger Marisol say lived on this bay?",
            "Which group did you meet in Case 1 at St. Augustine?",
            "Which group had a huge round council house at Mission San Luis?"], next: "wi1read" },

  wi1read: { loc: "weedon", img: "weedon_boardwalk", chapter: 1, title: "Reading Room: Central Idea", type: "q", passage: "p_baypeoples",
    teaches: ["SS.4.A.2.1", "SS.4.A.1.1"], ela: ["ELA.3.R.2.2", "ELA.4.R.2.2", "ELA.K12.EE.1.1"],
    text: ["Ranger Marisol says: \"Good detectives also know how to find the <b>central idea</b> of a text.\""],
    q: { kind: "mc", prompt: "What is the central idea of \"People of the Bay\"?",
      choices: [
        { label: "Native peoples lived along Tampa Bay for a very long time, and different groups used the land in different ways.", correct: true, feedback: "Yes! The passage moves from early shoreline mounds to the later Tocobaga town, then reminds us to compare tribes." },
        { label: "The Smithsonian Institution still digs up every mound in the park.", feedback: "The passage does not say that. We protect the mounds now." },
        { label: "The Tocobaga invented the railroad.", feedback: "No — the railroad comes much later in our case." }
      ] },
    hints: ["Look at the first sentence and the last sentence. What idea do they share?",
            "Does the passage talk about only one day, or about a long stretch of time?",
            "Which choice talks about Native peoples of Tampa Bay and about comparing groups?"], next: "wi1word" },

  wi1word: { loc: "weedon", img: "weedon_mangrove", chapter: 1, title: "Word Work: Midden", type: "q",
    teaches: ["SS.3.A.1.3"], ela: ["ELA.3.V.1.3", "ELA.4.V.1.3"], facts: ["weedonMiddens"],
    text: ["A hard word popped up: <b>midden</b>. Use the sentence around it to help."],
    q: { kind: "mc", prompt: "In this case, a shell midden is best described as:",
      choices: [
        { label: "A pile of leftover shells and other remains left by people long ago", correct: true, feedback: "Right! A kitchen midden is a kind of historic trash pile, and it can teach us what people ate." },
        { label: "A type of silver hotel tower", feedback: "That's a minaret — we'll see those later in Tampa!" },
        { label: "A modern highway over the bay", feedback: "No. Look back at the sentence that mentions leftover shells." }
      ] },
    hints: ["Find the sentence that says \"sometimes called middens.\" What does it explain?",
            "Would a midden be made by people eating shellfish, or by building a hotel?",
            "The definition talks about leftover shells."], next: "wi1explorers" },

  wi1explorers: { loc: "weedon", img: "weedon_bay", chapter: 1, speaker: "Ranger Marisol", title: "Explorers on This Bay", type: "q",
    teaches: ["SS.4.A.3.1"], facts: ["narvaez1528", "desoto1539bay"],
    text: ["European explorers also came to Tampa Bay. In <b>1528</b>, <b>Pánfilo de Narváez</b> arrived with hundreds of men, searching for <b>gold and silver</b>. The trip went terribly wrong. Only a few men survived, including <b>Cabeza de Vaca</b>, who later wrote about it.",
           "In <b>1539</b>, <b>Hernando de Soto</b> landed in the Tampa Bay area and marched inland, also hoping to find treasure. (Historians still discuss the exact beach, so we say \"the Tampa Bay area,\" not one modern street.)"],
    q: { kind: "mc", prompt: "What were Narváez and de Soto searching for in Florida?",
      choices: [
        { label: "Gold and silver", correct: true, feedback: "Yes. Like many Spanish explorers, they hoped to find treasure. They did not find great riches here." },
        { label: "A place to build a theme park", feedback: "Theme parks came hundreds of years later." },
        { label: "Oil for cars", feedback: "Cars did not exist in the 1500s." }
      ] },
    hints: ["What metals does Ranger Marisol name twice?",
            "What did many Spanish explorers hope to send home to their king?",
            "Which choice would have made Spain richer in the 1500s?"], next: "wi1effects" },

  wi1effects: { loc: "weedon", img: "tocobaga_mound", chapter: 1, speaker: "Ranger Marisol", title: "A Homeland Changed", type: "q",
    teaches: ["SS.4.A.3.2"], facts: ["menendez1567", "tocobagaEnd"],
    text: ["Contact with Europeans changed life for the Tocobaga. In <b>1567</b>, <b>Pedro Menéndez de Avilés</b> — the same leader who founded St. Augustine — visited their town and left 30 men to start a <b>mission</b>.",
           "The next year, a priest found the village empty and the soldiers dead.",
           "A likely reason the Tocobaga community later faded is <b>disease</b> brought from Europe, which Native people had not faced before. Some remaining people may later have joined Creek groups who moved into Florida in the 1700s. We tell this gently, because it is part of the truth."],
    q: { kind: "mc", prompt: "According to Ranger Marisol, what is a likely reason the Tocobaga community declined after Europeans arrived?",
      choices: [
        { label: "Disease brought from Europe, which Native people had not faced before", correct: true, feedback: "Yes. That is what Pinellas County's history of the site teaches, along with the hard years of contact and conflict." },
        { label: "A hurricane that lasted 100 years", feedback: "The sources do not say that." },
        { label: "They all moved into the Tampa Bay Hotel", feedback: "The hotel was not built until 1891 — hundreds of years later." }
      ] },
    hints: ["Look at the sentence that begins with \"A likely reason.\"",
            "What sickness word does the ranger use?",
            "Which choice matches the word \"disease\"?"], next: "wi1clue" },

  wi1clue: { loc: "weedon", img: "green_heron", chapter: 1, speaker: "You", title: "A Scrap in the Palmetto",
    clue: "c2_river",
    text: ["At the end of the boardwalk, a green heron watches the shallows. Tucked under a palmetto, you find another scrap of purple writing.",
           "It says: \"Cross the bay <b>EAST</b>, to the place where a <b>river meets the harbor</b>. A wooden <b>fort</b> once stood guard there.\"",
           "<b>New clue in your Notebook!</b> Penny is heading for the mouth of the Hillsborough River — the site of old Fort Brooke, in today's Tampa."],
    choices: [{ label: "Open the map and go", next: "wi1map" }] },

  wi1map: { loc: "weedon", type: "map", target: "fortbrooke", chapter: 1, title: "Travel: Across the Bay",
    teaches: ["SS.4.G.1.2", "SS.4.G.1.4", "SS.3.G.1.2"],
    text: "Read your clue: cross the bay EAST, to the place where a river meets the harbor. Tap your next stop on the map.",
    hints: ["Find the compass rose. Which way is east?",
            "Which marker sits on the east side of Tampa Bay, at a river mouth?",
            "Is there a pin labeled Tampa (Fort Brooke)?"],
    travel: { coins: 4, days: 0, energy: 1, how: "You ride a causeway across Tampa Bay (−1 energy, 4 coins)." }, next: "fb1" },

  /* ===================== CHAPTER 2: FORT BROOKE (getting harder) ===================== */
  fb1: { loc: "fortbrooke", img: "tampa_skyline", chapter: 2, speaker: "Guide Lina", title: "Where a Fort Once Stood",
    teaches: ["SS.4.G.1.2", "SS.3.G.2.5"], facts: ["fortGone"],
    text: ["Welcome to downtown Tampa! I'm Guide Lina from the riverfront. Look around: glass buildings, a busy harbor, a river.",
           "It is hard to imagine, but <b>Fort Brooke</b> once stood right near here, at the mouth of the <b>Hillsborough River</b>.",
           "The wooden fort is gone. The city grew on top of it. If we want to find Penny — and the truth — we have to read the land, and some old pictures."],
    choices: [{ label: "How did the fort begin?", next: "fb1founding" }] },

  fb1founding: { loc: "fortbrooke", img: "fort_brooke_1835", chapter: 2, speaker: "Guide Lina", title: "1824: A Post on the Harbor", type: "q",
    teaches: ["SS.4.A.3.9", "SS.4.A.4.2"], facts: ["territory1821", "state1845", "fortBrooke1824", "fortBrookeBuildings"],
    text: ["In <b>1821</b>, Florida became a <b>United States territory</b> after the Adams-Onís Treaty with Spain. Florida became a <b>state</b> in <b>1845</b>.",
           "In <b>1824</b>, Colonel <b>George Mercer Brooke</b> established this Army post to guard the harbor. By 1829 it had barracks, storehouses, a blockhouse, a powder magazine, stables, and a wharf.",
           "This 1835 picture is a <b>primary source</b>. It shows tents, wooden buildings, and soldiers at Fort Brooke."],
    q: { kind: "mc", prompt: "When did Colonel George Mercer Brooke establish Fort Brooke?",
      choices: [
        { label: "1824", correct: true, feedback: "Yes. The fort was established in 1824, soon after Florida became a U.S. territory." },
        { label: "1513", feedback: "1513 is when Ponce de León named La Florida — long before this fort." },
        { label: "1891", feedback: "1891 is when the Tampa Bay Hotel opened, much later." }
      ] },
    hints: ["Look at the year next to Colonel Brooke's name.",
            "Was the fort built before or after Florida became a U.S. territory in 1821?",
            "The year is in the 1820s."], next: "fb1seminole" },

  fb1seminole: { loc: "fortbrooke", img: "fort_brooke_oaks", chapter: 2, speaker: "Guide Lina", title: "The Seminole Wars", type: "q",
    teaches: ["SS.4.A.3.10"], facts: ["seminoleWarsHQ", "dade1835", "seminoleRemoval"],
    text: ["Fort Brooke was a major Army headquarters during the <b>Seminole Wars</b>. In the Second Seminole War (<b>1835–1842</b>), more than <b>40,000</b> soldiers passed through this post.",
           "The wars had several causes, including fights over <b>land</b> and the U.S. plan to force Seminole people out of Florida. In late 1835, a U.S. column leaving this fort was attacked on the road north. That battle helped start a long, hard war.",
           "Many Seminole people were forced to leave Florida. Some were sent west from this area. A smaller number stayed and are still a part of Florida today. We tell this with respect."],
    q: { kind: "multi", prompt: "Select <b>ALL</b> the statements that are true of Fort Brooke during the Seminole Wars.",
      options: [
        { label: "It was a major U.S. Army headquarters", correct: true },
        { label: "Tens of thousands of soldiers passed through", correct: true },
        { label: "Many Seminole people were forced to leave Florida, and some were sent west from this area", correct: true },
        { label: "It was built as a theme park for tourists" },
        { label: "It was the capital of Spain in the 1500s" }
      ],
      feedback: "Yes. Fort Brooke was a headquarters in a painful chapter of Florida history. The last two choices belong to other times — or to make-believe." },
    hints: ["Which sentences did Guide Lina actually say?",
            "Did she give a number of soldiers?",
            "Were theme parks or the Spanish capital part of her talk?"], next: "fb1town" },

  fb1town: { loc: "fortbrooke", img: "hillsborough_river", chapter: 2, speaker: "Guide Lina", title: "A Town Beside the Fort", type: "q",
    teaches: ["SS.4.A.4.2", "SS.4.G.1.1"], facts: ["tampa1848", "cityCharter1887"],
    text: ["A town grew in the shade of the fort, along the <b>Hillsborough River</b> as it flows toward the bay.",
           "On <b>July 25, 1848</b>, Tampa was legally created, and land from the fort was granted for the town.",
           "Much later, after the railroad arrived, Tampa received a city charter in <b>1887</b>."],
    q: { kind: "typed", prompt: "Type your answer: <b>In what year</b> was land from Fort Brooke granted so that Tampa could be legally created as a town?",
      accept: [["1848"]], sample: "1848",
      feedback: "Right. In 1848, land from the fort was granted for the town of Tampa." },
    hints: ["Look at the sentence with a month and a day.",
            "The year is in the 1840s, before the railroad.",
            "It is 1848, not 1887. 1887 is the later city charter."], next: "fb1civilwar" },

  fb1civilwar: { loc: "fortbrooke", img: "fort_brooke_1835", chapter: 2, speaker: "Guide Lina", title: "The Civil War Comes to the Harbor", type: "q",
    teaches: ["SS.4.A.5.1"], facts: ["civilWarBrooke"],
    text: ["During the <b>Civil War</b>, Union ships <b>blockaded</b> Florida ports, including Tampa Bay. A blockade tries to stop ships from bringing goods in or out.",
           "In <b>October 1863</b>, Union gunboats fired on Fort Brooke, and a landing party later burned Confederate supply ships on the river. This fighting is called the <b>Battle of Fort Brooke</b>.",
           "Florida's grade 4 standards ask you to remember that this battle — along with others like Olustee and Fort Pickens — was part of Florida's Civil War story."],
    q: { kind: "mc", prompt: "What happened at Fort Brooke during the Civil War?",
      choices: [
        { label: "Union ships blockaded the port and, in 1863, attacked the fort and supply ships", correct: true, feedback: "Yes. The Battle of Fort Brooke is even named in Florida's grade 4 Civil War benchmark." },
        { label: "The hotel's minarets were built as lighthouses for submarines", feedback: "The hotel was not built until 1891, after the war." },
        { label: "Nothing. Tampa was too far away to be involved", feedback: "Florida's standards specifically name the Battle of Fort Brooke." }
      ] },
    hints: ["What does a blockade do to a port?",
            "Which year does Guide Lina give for the attack?",
            "Look for the choice that mentions 1863 and supply ships."], next: "fb1read" },

  fb1read: { loc: "fortbrooke", img: "tampa_skyline", chapter: 2, title: "Reading Room: Claim and Evidence", type: "q", passage: "p_fortbrooke",
    teaches: ["SS.4.A.1.1", "SS.4.A.5.1"], ela: ["ELA.3.R.2.4", "ELA.4.R.2.4", "ELA.K12.EE.1.1"],
    text: ["Guide Lina says: \"A claim needs evidence. Let's practice.\""],
    q: { kind: "evidence", claim: "The place where downtown Tampa stands today has a long military and harbor history.",
      prompt: "Tap the <b>TWO</b> sentences that give the best evidence for this claim. Then tap <b>Check</b>.", correct: [0, 7], pick: 2,
      feedback: "Strong evidence! The first sentence places the fort at the river's mouth in 1824, and the last sentence says downtown Tampa now stands near that guarded harbor." },
    hints: ["The claim is about THIS PLACE having a long history.",
            "Which sentence tells when the fort was established, and where?",
            "Which sentence tells what stands there now?"], next: "fb1order" },

  fb1order: { loc: "fortbrooke", img: "hillsborough_river", chapter: 2, title: "Put Tampa's Early Years in Order", type: "q",
    teaches: ["SS.4.A.9.1"],
    text: ["Penny shuffled our timeline cards. Help Guide Lina put them back."],
    q: { kind: "order", prompt: "Drag the cards (or use the ▲ ▼ buttons) to put them in order from <b>EARLIEST</b> (top) to <b>LATEST</b> (bottom).",
      items: [
        "1821: Florida becomes a U.S. territory",
        "1824: Fort Brooke is established on the Hillsborough River",
        "1848: Land from the fort is granted for the town of Tampa",
        "1863: The Battle of Fort Brooke during the Civil War"
      ] },
    hints: ["Which year is the smallest number?",
            "Did the fort come before or after Florida became a territory?",
            "Was the Civil War battle before or after the town was legally created in 1848?"], next: "fb1clue" },

  fb1clue: { loc: "fortbrooke", img: "hotel_minarets", chapter: 2, speaker: "You", title: "Silver Towers Across the River",
    clue: "c2_minarets",
    text: ["On a bench by the river you find a bus ticket stub. In purple ink, Penny has doodled a pointed <b>silver tower</b>.",
           "Her note says: \"Look for the silver <b>minarets</b> beside the river.\"",
           "You look up — and there they are, shining above the trees on the other side of the Hillsborough. The old <b>Tampa Bay Hotel</b>. Penny is close.",
           "<b>New clue in your Notebook!</b>"],
    choices: [{ label: "Check the map", next: "fb1map" }] },

  fb1map: { loc: "fortbrooke", type: "map", target: "plant", chapter: 2, title: "Travel: To the Silver Minarets",
    teaches: ["SS.4.G.1.2", "SS.4.G.1.4"],
    text: "Your clue says to look for the silver minarets beside the river. Tap the Tampa Bay Hotel.",
    hints: ["The hotel is very close to downtown, just across or along the river.",
            "Which pin has a hotel symbol?",
            "Look for the label \"Tampa Bay Hotel.\""],
    travel: { coins: 0, days: 0, energy: 1, how: "You walk along the river toward the minarets (−1 energy)." }, next: "c2playable_end" },

  c2playable_end: { loc: "plant", img: "case2_cover", chapter: 2, speaker: "Professor Pelican", title: "Coming soon…",
    type: "comingsoon",
    text: ["You reach the lawns under the silver minarets. A breeze flaps a torn scrap of colorful paper — the edge of a cigar-box label — but Penny herself is already gone.",
           "You have finished the <b>first playable</b> of Case 2! You traced Tampa Bay's Native history at Weedon Island and Safety Harbor, and the beginnings of the city at Fort Brooke.",
           "Penny's trail now leads on to <b>Henry Plant's railroad and hotel</b>, then to <b>Ybor City</b>, and finally to the <b>Port of Tampa</b>. Those chapters are coming soon.",
           "Open your Field Journal to see your new Tampa Bay cards, and keep that purple-ink clue safe!"],
    comingSoon: [
      { ch: 3, name: "Henry Plant and the Tampa Bay Hotel", tease: "Silver minarets, a railroad, and a giant hotel that changed Tampa." },
      { ch: 4, name: "Ybor City", tease: "Cigar factories, immigrants, Cuban bread, and a coded label." },
      { ch: 5, name: "The Port of Tampa", tease: "Steamships, a wartime embarkation, and the end of the chase." }
    ],
    choices: [
      { label: "📒 Open your Field Journal", act: "journal" },
      { label: "📓 Review your notebook", act: "notebook" },
      { label: "🏠 Title screen", act: "title" }
    ] }
};

/* ===================== DRAFT: CHAPTER 3 PLANT / CHAPTER 4 YBOR / CHAPTER 5 PORT ===================== */
var CASE2_SCENES_DRAFT = {
  ph1: { draft: true, loc: "plant", img: "hotel_exterior", chapter: 3, speaker: "Guide Lina", title: "The Railroad Comes to Tampa",
    teaches: ["SS.4.A.4.1", "SS.4.A.6.3", "SS.4.E.1.1"], facts: ["railroad1884", "plantCity", "plantShips"],
    text: ["In <b>1884</b>, entrepreneur <b>Henry B. Plant</b> brought the <b>railroad</b> to Tampa. In 1880 the town had only about <b>720</b> people. By 1890 it had <b>5,532</b>.",
           "Plant also ran <b>steamships</b> to Key West and Havana and built a rail spur to a new deepwater port.",
           "A new technology — the railroad — changed how people, mail, and goods moved, and it helped the town grow fast."],
    q: { kind: "mc", prompt: "What technological advance did Henry Plant bring to Tampa in 1884?",
      choices: [
        { label: "The railroad", correct: true, feedback: "Yes. The railroad, along with his ships and port, helped Tampa grow." },
        { label: "The airplane", feedback: "Scheduled air travel between Tampa and St. Petersburg came later, in 1914." },
        { label: "The internet", feedback: "Not in 1884!" }
      ] },
    hints: ["Look at the first sentence.", "Which invention uses trains and tracks?", "The year is 1884."], next: "ph2" },

  ph2: { draft: true, loc: "plant", img: "hotel_minarets", chapter: 3, speaker: "Guide Lina", title: "A Palace of Silver Minarets", type: "q",
    teaches: ["SS.4.A.6.1", "SS.4.A.6.3", "SS.3.G.2.5"], facts: ["hotelDates", "hotelBuilding", "hotelToday"],
    text: ["Plant opened the <b>Tampa Bay Hotel</b> on <b>February 5, 1891</b>, to attract winter visitors. The cornerstone had been laid in 1888.",
           "The red-brick building has more than <b>500 rooms</b>, five stories, and famous silver <b>minarets</b>. Today it is <b>Plant Hall</b> at the University of Tampa, with a museum in the south wing."],
    q: { kind: "typed", prompt: "Type the year the Tampa Bay Hotel opened to visitors:",
      accept: [["1891"]], sample: "1891",
      feedback: "Yes — February 5, 1891." },
    hints: ["Look for February 5 and a year.", "It is just after 1890.", "The year is 1891."], next: "ph3" },

  ph3: { draft: true, loc: "plant", img: "hotel_exterior", chapter: 3, title: "Reading Room: Cause and Effect", type: "q", passage: "p_plant",
    teaches: ["SS.4.A.4.1"], ela: ["ELA.3.R.2.1", "ELA.4.R.2.2"],
    text: ["This passage is organized as a chain of causes and effects."],
    q: { kind: "mc", prompt: "According to the passage, what was one effect of Plant bringing the railroad to Tampa?",
      choices: [
        { label: "People, mail, and goods could move much faster, and the town grew", correct: true, feedback: "Yes. The railroad was a cause; faster travel and growth were effects." },
        { label: "The Tocobaga built the hotel as a council house", feedback: "The hotel was built in 1888–1891, long after the Tocobaga town at Safety Harbor." },
        { label: "Florida stopped being a peninsula", feedback: "Florida is still a peninsula!" }
      ] },
    next: "ph4" },

  ph4: { draft: true, loc: "plant", img: "hotel_minarets", chapter: 3, speaker: "Guide Lina", title: "The Rocking-Chair War", type: "q",
    teaches: ["SS.4.A.6.4"], facts: ["sawHotel", "sawTroops", "pop1898"],
    text: ["In <b>1898</b>, the United States went to war with Spain. Tampa became the official <b>port of embarkation</b> for soldiers heading to Cuba, in part because of Plant's railroad, ships, and this huge hotel.",
           "About <b>30,000</b> soldiers gathered here. Officers and reporters used the hotel as a headquarters. Theodore Roosevelt was among the guests.",
           "Some locals called it a \"rocking-chair war\" because officers waited on the hotel porches for orders to sail."],
    q: { kind: "mc", prompt: "Why did the U.S. government choose Tampa as the port of embarkation in 1898?",
      choices: [
        { label: "Because of its location, deepwater port, and Plant's railroad and ships", correct: true, feedback: "That's what the National Park Service teaches about this place." },
        { label: "Because it was the closest city to California", feedback: "Tampa is on Florida's west coast, far from California." },
        { label: "Because the hotel sold the most ice cream", feedback: "A fun guess, but not the reason." }
      ] },
    next: "ph5clue" },

  ph5clue: { draft: true, loc: "plant", img: "card_cigarbox", chapter: 3, clue: "c2_ybor",
    title: "A Label on the Lawn",
    text: ["Under a palm you find another scrap of the Coded Label. Flowers, a tiny minaret, and a new line of purple ink:",
           "\"Where people from <b>three countries</b> built a city of brick, bread, and boxes.\"",
           "Guide Lina nods. \"That's Ybor City. Cuba, Spain, and Italy. Let's go.\""],
    choices: [{ label: "Map to Ybor City", next: "ph5map" }] },

  ph5map: { draft: true, loc: "plant", type: "map", target: "ybor", chapter: 3, title: "Travel: To Ybor City",
    teaches: ["SS.4.G.1.2", "SS.4.G.1.4"],
    text: "Your clue names a city of brick, bread, and boxes built by people from three countries. Tap Ybor City, just northeast of downtown.",
    travel: { coins: 2, days: 0, energy: 1, how: "You ride a short streetcar-style hop into Ybor City." }, next: "yc1" },

  yc1: { draft: true, loc: "ybor", img: "ybor_factory", chapter: 4, speaker: "Guide Lina", title: "A City of Brick and Work", type: "q",
    teaches: ["SS.4.A.6.1", "SS.4.A.6.2", "SS.4.A.6.3", "SS.4.E.1.1"], facts: ["yborFounded", "yborWhy", "yborYborBio", "yborPop"],
    text: ["In <b>1885–1886</b>, <b>Vicente Martínez-Ybor</b> — born in Spain, a businessman from Cuba and Key West — and <b>Ignacio Haya</b> built a new town of factories and workers' homes here.",
           "Tampa had the climate, a short trip to Cuba for tobacco and workers, and Plant's railroad to ship goods. By <b>1890</b>, about <b>6,000</b> people lived in Ybor City.",
           "<i>Tobacco harms health. We are here to learn about people, work, and art — not to praise smoking.</i>"],
    q: { kind: "mc", prompt: "Which entrepreneur helped found Ybor City as a cigar-manufacturing town in 1885–1886?",
      choices: [
        { label: "Vicente Martínez-Ybor (with Ignacio Haya)", correct: true, feedback: "Yes. The neighborhood still bears Ybor's name." },
        { label: "Pánfilo de Narváez", feedback: "He was an explorer in 1528, not a 19th-century businessman." },
        { label: "Colonel George Mercer Brooke", feedback: "He established Fort Brooke in 1824." }
      ] },
    next: "yc2" },

  yc2: { draft: true, loc: "ybor", img: "centro_espanol", chapter: 4, speaker: "Guide Lina", title: "Many Homelands, One Neighborhood", type: "q",
    teaches: ["SS.4.A.6.2", "SS.3.G.4.2", "SS.3.G.4.4"], facts: ["yborImmigrants", "yborClubs"],
    text: ["Immigrants from <b>Cuba</b>, <b>Spain</b>, and <b>Italy</b> made Ybor City their home. There were also German, Romanian Jewish, and Chinese neighbors. About <b>15 percent</b> of the first wave of Cuban immigrants were <b>Afro-Cuban</b>.",
           "People built <b>mutual-aid clubs</b> — El Centro Español, the Centro Asturiano, the Círculo Cubano, L'Unione Italiana, and La Unión Martí-Maceo — to share the cost of doctors and to gather as a community."],
    q: { kind: "multi", prompt: "Select <b>ALL</b> the immigrant groups the passage names as making Ybor City their home.",
      options: [
        { label: "Cubans (including Afro-Cubans)", correct: true },
        { label: "Spaniards", correct: true },
        { label: "Italians", correct: true },
        { label: "Vikings from Greenland" },
        { label: "Astronauts from the moon" }
      ],
      feedback: "Yes. Cuba, Spain, and Italy are the three countries in Penny's clue, and the neighborhood was even more diverse than that." },
    next: "yc3" },

  yc3: { draft: true, loc: "ybor", img: "ybor_workers", chapter: 4, title: "Reading Room: The Lector", type: "q", passage: "p_lector",
    teaches: ["SS.4.A.6.2", "SS.4.A.1.1"], ela: ["ELA.3.R.2.2", "ELA.4.R.2.4"], facts: ["yborLector", "yborCapital"],
    text: ["Workers hired a reader, <b>el lector</b>, to read newspapers and books out loud during the workday."],
    q: { kind: "evidence", claim: "Ybor City's factory workers found ways to learn and to help one another, not only to make a product.",
      prompt: "Tap the <b>TWO</b> sentences that best support this claim. Then tap <b>Check</b>.", correct: [2, 4], pick: 2,
      feedback: "Yes — the lector read the news out loud, and mutual-aid clubs helped families." },
    next: "yc4" },

  yc4: { draft: true, loc: "ybor", img: "sandwich", chapter: 4, speaker: "Guide Lina", title: "Bread, Sandwiches, and Chickens", type: "q",
    teaches: ["SS.4.A.6.2", "SS.3.G.4.4"], facts: ["cubanBread", "cubanSandwich", "yborChickens"],
    text: ["Food tells a history too. <b>Cuban bread</b> is a long, crusty loaf. Some Tampa bakeries bake it with a <b>palmetto leaf</b> on top so the loaf splits.",
           "A Tampa <b>Cuban sandwich</b> often includes roast pork, ham, Swiss cheese, pickles, mustard, and <b>salami</b> — a nod to Italian neighbors.",
           "And yes, you may meet a rooster on the brick streets. The chickens are part of Ybor City's local flavor today."],
    q: { kind: "mc", prompt: "What ingredient is often added to a Tampa Cuban sandwich because of Italian influence in Ybor City?",
      choices: [
        { label: "Salami", correct: true, feedback: "Yes. That Tampa twist is widely connected to the city's Italian immigrants." },
        { label: "Datil peppers", feedback: "Datil peppers are a St. Augustine tradition from Case 1." },
        { label: "Maple syrup", feedback: "Not in this sandwich!" }
      ] },
    next: "yc5clue" },

  yc5clue: { draft: true, loc: "ybor", img: "card_cigarbox", chapter: 4, clue: "c2_port",
    title: "The Last Line of the Code",
    text: ["Inside an empty exhibit crate you find the last written line, still smelling faintly of old paper:",
           "\"Follow the ships to the <b>deepwater port</b>. The rest of the message leaves with the tide.\"",
           "Penny is running for the harbor."],
    choices: [{ label: "Map to the port", next: "yc5map" }] },

  yc5map: { draft: true, loc: "ybor", type: "map", target: "port", chapter: 4, title: "Travel: To the Port",
    teaches: ["SS.4.G.1.2", "SS.4.G.1.4"],
    text: "Your clue says to follow the ships to the deepwater port. Tap Port Tampa.",
    travel: { coins: 3, days: 0, energy: 1, how: "You ride toward the historic port on the bay." }, next: "pt1" },

  pt1: { draft: true, loc: "port", img: "port_1898", chapter: 5, speaker: "Guide Lina", title: "Where Trains Met Ships", type: "q",
    teaches: ["SS.4.A.6.1", "SS.4.E.1.2", "SS.3.E.1.1"], facts: ["plantShips", "phosphate1880s"],
    text: ["Henry Plant built a rail line to this deepwater port so trains and ships could meet. In the late <b>1880s</b>, <b>phosphate</b> found near Tampa was shipped out of this harbor. Phosphate is used to make fertilizer that helps crops grow.",
           "When a place has a resource that other places need, trade grows. The port tied Tampa to the national and international economy."],
    q: { kind: "mc", prompt: "What mineral, discovered near Tampa in the late 1880s, was shipped through the port and helped the city boom?",
      choices: [
        { label: "Phosphate", correct: true, feedback: "Yes. Phosphate shipping was a big part of Tampa's growth." },
        { label: "Coquina", feedback: "Coquina is the shell-stone used to build the Castillo in St. Augustine." },
        { label: "Gold", feedback: "The Spanish explorers did not find great gold here, and this boom was about fertilizer mineral, not gold." }
      ] },
    next: "pt2" },

  pt2: { draft: true, loc: "port", img: "steamer_1898", chapter: 5, speaker: "Guide Lina", title: "1898: Soldiers at the Docks", type: "q",
    teaches: ["SS.4.A.6.4", "SS.4.A.1.1"], facts: ["portEmbarkation", "sawTroops"], ela: ["ELA.4.R.3.3"],
    text: ["These pictures are <b>primary sources</b> from 1898. Ships and trains crowd the docks. In that year, Tampa was the main port where U.S. soldiers boarded ships for Cuba during the <b>Spanish-American War</b>.",
           "About 30,000 soldiers gathered in the area. The war changed Tampa: more people, more business, and a place in a national story."],
    q: { kind: "typed", prompt: "Type the year U.S. soldiers embarked from Tampa for Cuba in the Spanish-American War:",
      accept: [["1898"]], sample: "1898",
      feedback: "Yes, 1898." },
    next: "pt3" },

  pt3: { draft: true, loc: "port", img: "manatee_photo", chapter: 5, speaker: "Guide Lina", title: "Warm Water, Gentle Giants", type: "q",
    teaches: ["SS.4.G.1.1"], facts: ["manateeSpecies", "manateeWarm", "apolloBeach"],
    text: ["The same bay is also a home for wildlife. The <b>Florida manatee</b> is a large plant-eating mammal, sometimes called a sea cow.",
           "Manatees cannot stay long in water colder than <b>68 degrees</b>. In winter they gather at warm springs and at warm-water outfalls, including the sanctuary at <b>Apollo Beach</b>, where a public viewing center looks over the canal."],
    q: { kind: "mc", prompt: "Why do many manatees gather at Apollo Beach in winter?",
      choices: [
        { label: "They need warm water, and a power station returns warmed bay water there", correct: true, feedback: "Yes. The discharge canal is a designated manatee sanctuary." },
        { label: "They like to ride cruise ships", feedback: "No — please give manatees plenty of space, and never chase them." },
        { label: "They are hunting for gold and silver", feedback: "Manatees eat plants, not treasure!" }
      ] },
    next: "pt4" },

  pt4: { draft: true, loc: "port", img: "port_modern", chapter: 5, title: "Reading Room: A Harbor That Changed a City", type: "q", passage: "p_port",
    teaches: ["SS.4.E.1.2", "SS.4.A.6.1"], ela: ["ELA.3.R.2.2", "ELA.4.R.2.2"],
    text: ["Let's pull the whole case together."],
    q: { kind: "mc", prompt: "What is the central idea of \"A Harbor That Changed a City\"?",
      choices: [
        { label: "Tampa's deep bay, railroad, and port helped the city grow and connect to the wider world, and the bay is also a home for wildlife.", correct: true, feedback: "Yes. Industry, war, and nature all meet in this harbor." },
        { label: "Manatees built Fort Brooke.", feedback: "No." },
        { label: "The railroad was never important in Florida.", feedback: "The passage says the opposite." }
      ] },
    next: "pt5win" },

  pt5win: { draft: true, loc: "port", img: "penny_tampa", chapter: 5, speaker: "Professor Pelican", title: "The Label Comes Home", type: "win",
    text: ["You find Penny on the dock, out of breath, the wooden box under her arm. \"Fine, fine,\" she says. \"You can have the Label. I only wanted the pretty paper.\"",
           "Inside is the missing cigar-box label, its hidden code still readable. The museum can finish the exhibit, and you can try a new mini-game: putting historic-style labels in the right order.",
           "You have followed the Coded Label from shell mounds to a vanished fort, from silver minarets to Ybor brick and a working port.",
           "<i>The Coded Label and the chase are made up. The history is real. Tobacco harms health. The people of Tampa Bay — Native, immigrant, and born here — made this place what it is.</i>"] }
};

var CASE2_JOURNAL = {
  total: 7,
  regions: [
    { id: "tampabay", name: "Tampa Bay" },
    { id: "ybor", name: "Ybor City" },
    { id: "water", name: "Waterways" }
  ],
  cards: [
    { id: "shellmound", name: "A Tampa Bay temple mound", region: "Tampa Bay", regionId: "tampabay",
      awardAt: ["wi1tocobaga"], img: "card_shellmound.webp", thumb: "card_shellmound_s.webp",
      facts: ["The Tocobaga built a large temple mound of shell and sand at today's Philippe Park in Safety Harbor.", "It is the largest remaining mound in the Tampa Bay region and was likely part of the Tocobaga capital."],
      src: "Game facts tocobagaCapital, tocobagaMound (Pinellas County).", srcIds: ["tocobagaCapital", "tocobagaMound"],
      note: "The painted card is an impression of a grassy mound by the bay, not a photograph of a specific slope. Native people are not drawn as characters." },
    { id: "minaret", name: "Tampa Bay Hotel minaret", region: "Tampa Bay", regionId: "tampabay",
      awardAt: ["fb1clue", "ph2"], img: "card_minaret.webp", thumb: "card_minaret_s.webp",
      facts: ["Henry B. Plant opened the Tampa Bay Hotel on February 5, 1891.", "The red-brick building has more than 500 rooms and famous silver minarets. Today it is Plant Hall at the University of Tampa."],
      src: "Game facts hotelDates, hotelBuilding, hotelToday (Henry B. Plant Museum / NPS / University of Tampa).", srcIds: ["hotelDates", "hotelBuilding", "hotelToday"] },
    { id: "sandwich", name: "Cuban sandwich", region: "Ybor City", regionId: "ybor",
      awardAt: ["yc4"], flavorPhoto: "sandwich", img: "card_sandwich.webp", thumb: "card_sandwich_s.webp",
      facts: ["A Tampa Cuban sandwich is often made with Cuban bread and includes roast pork, ham, Swiss cheese, pickles, mustard, and Genoa salami.", "The salami reflects Italian influence in Ybor City."],
      src: "Game fact cubanSandwich (flagged for a final museum citation).", srcIds: ["cubanSandwich"] },
    { id: "chicken", name: "Ybor chicken", region: "Ybor City", regionId: "ybor",
      awardAt: ["yc4"], flavorPhoto: "ybor_rooster", img: "card_chicken.webp", thumb: "card_chicken_s.webp",
      facts: ["Visitors today often see free-roaming chickens in Ybor City.", "They are a familiar part of the neighborhood's local flavor."],
      src: "Game fact yborChickens (local flavor; no ordinance claimed).", srcIds: ["yborChickens"] },
    { id: "bread", name: "Cuban bread", region: "Ybor City", regionId: "ybor",
      awardAt: ["yc4"], img: "card_cubanbread.webp", thumb: "card_cubanbread_s.webp",
      facts: ["Cuban bread is a long, crusty loaf important to Tampa's food traditions.", "Some Tampa bakeries have baked the loaves with a palmetto leaf on top, a custom that helps the loaf split as it bakes."],
      src: "Game fact cubanBread (AP News; Southern Foodways Alliance interview with La Segunda bakers).", srcIds: ["cubanBread"] },
    { id: "cigarbox", name: "A cigar-box label", region: "Ybor City", regionId: "ybor",
      awardAt: ["yc5clue"], img: "card_cigarbox.webp", thumb: "card_cigarbox_s.webp",
      facts: ["Cigar boxes once carried colorful paper labels, a kind of printed art.", "The Coded Label in this story is made up. Real labels help us study history and design. Tobacco harms health."],
      src: "Story item (fictional). Industry context from game fact yborCapital (NPS Ybor City Historic District).", srcIds: ["yborCapital"] },
    { id: "manatees_apollo", name: "Manatees at Apollo Beach", region: "Waterways", regionId: "water",
      awardAt: ["pt3"], img: "card_manatees_apollo.webp", thumb: "card_manatees_apollo_s.webp",
      facts: ["The Florida manatee is a large plant-eating mammal, sometimes called a sea cow.", "In winter, manatees gather in warm water at Apollo Beach, where a public viewing center looks over a designated sanctuary."],
      src: "Game facts manateeSpecies, manateeWarm, apolloBeach (U.S. Fish and Wildlife Service; Tampa Electric Manatee Viewing Center).", srcIds: ["manateeSpecies", "manateeWarm", "apolloBeach"],
      note: "This card is about the Apollo Beach / Tampa Bay winter gathering. Case 1 already has a general Florida manatee card." }
  ]
};

var CASE2_HEIST = {
  note: "Draft only. The Swamp Fox remains a bonus chase, not a second main villain. Treasures are made-up exhibit replicas.",
  fox: { name: "The Swamp Fox", short: "Swamp Fox" },
  stops: [
    { id: "weedon", at: ["wi1"], loc: "weedon", pose: "taunt", hench: "gil",
      treasure: "a replica shell drinking cup from the Weedon Island cultural center exhibit",
      treasureShort: "a replica shell cup",
      note: "Too slow! I borrowed a replica shell cup from the exhibit. The real mounds stay right where they are — I only take story copies!",
      fact: "The real mounds at Weedon Island and Safety Harbor are protected. This theft is just part of our bonus story." },
    { id: "fortbrooke", at: ["fb1"], loc: "fortbrooke", pose: "run", hench: "minnow",
      treasure: "a replica 1830s army canteen from a Tampa history exhibit",
      treasureShort: "a replica canteen",
      note: "I grabbed a replica canteen and ran toward the river. The real fort is gone — good luck finding me in downtown!",
      fact: "Fort Brooke itself is gone. The canteen in this bonus story is a made-up exhibit replica." },
    { id: "plant", at: ["ph1"], loc: "plant", pose: "taunt", hench: null,
      treasure: "a souvenir silver minaret from a museum display (a replica, not a real tower!)",
      treasureShort: "a replica minaret souvenir",
      note: "I pocketed a tiny silver minaret souvenir. The real towers stay on the hotel, Detective!",
      fact: "The real minarets still stand on Plant Hall. This souvenir theft is fictional." },
    { id: "ybor", at: ["yc1"], loc: "ybor", pose: "run", hench: "gil",
      treasure: "an empty replica cigar box with a printed historic-style label",
      treasureShort: "a replica cigar box",
      note: "An empty box with a pretty label is coming with me. No smoking in this story — I just like the art!",
      fact: "The box is a made-up replica. Tobacco harms health." },
    { id: "port", at: ["pt1"], loc: "port", pose: "taunt", hench: "minnow",
      treasure: "a replica ship's bell from a port exhibit",
      treasureShort: "a replica ship's bell",
      note: "Last stop! I took a replica ship's bell. Catch me at the docks if you can!",
      fact: "The bell in this bonus story is a made-up exhibit replica." }
  ]
};

var CASE2_TIMELINE = [
  { year: 900, text: "About 900 A.D.: Tocobaga people live at a town at today's Safety Harbor (occupying the site into the late 1600s)" },
  { year: 1528, text: "1528: Pánfilo de Narváez comes to the Tampa Bay area searching for gold and silver" },
  { year: 1539, text: "1539: Hernando de Soto lands in the Tampa Bay area and marches inland" },
  { year: 1567, text: "1567: Pedro Menéndez de Avilés visits the Tocobaga town" },
  { year: 1821, text: "1821: Florida becomes a U.S. territory" },
  { year: 1824, text: "1824: Fort Brooke is established on the Hillsborough River" },
  { year: 1848, text: "1848: Land from the fort is granted for the town of Tampa" },
  { year: 1863, text: "1863: Battle of Fort Brooke during the Civil War" },
  { year: 1884, text: "1884: Henry Plant brings the railroad to Tampa" },
  { year: 1886, text: "1885–1886: Ybor City's first factories and workers' homes are built" },
  { year: 1891, text: "1891: The Tampa Bay Hotel opens" },
  { year: 1898, text: "1898: Tampa is the embarkation port for U.S. troops bound for Cuba" }
];

var CASE2_PICKER = {
  case1: { id: "case1", title: "The Founding Stone", subtitle: "St. Augustine, Fort Mose, and Mission San Luis",
    blurb: "Chase a thief across Florida's early-history sites, from the Castillo to Fort Mose and Mission San Luis." },
  case2: { id: "case2", title: "The Cigar Box Code", subtitle: "Tampa Bay and Ybor City",
    cover: "art/webp/case2_cover.webp",
    blurb: "Penny Pinch has stolen a coded cigar-box label. Follow her clues from Weedon Island to Fort Brooke, the silver minarets, Ybor City, and the port.",
    status: "first-playable",
    note: "Chapters 1–2 are fully playable. Chapters 3–5 are drafted for the next build." }
};

var CASE2_STANDARDS_BY_STOP = {
  weedon: {
    playable: true,
    ss: ["SS.4.A.1.1", "SS.4.A.2.1", "SS.4.A.3.1", "SS.4.A.3.2", "SS.4.G.1.1", "SS.4.G.1.2", "SS.4.G.1.4", "SS.3.A.1.3", "SS.3.G.1.1", "SS.3.G.1.2", "SS.3.G.2.5", "SS.3.G.4.1"],
    ela: ["ELA.3.R.2.1", "ELA.3.R.2.2", "ELA.4.R.2.2", "ELA.3.V.1.3", "ELA.4.V.1.3", "ELA.K12.EE.1.1"]
  },
  fortbrooke: {
    playable: true,
    ss: ["SS.4.A.1.1", "SS.4.A.3.9", "SS.4.A.3.10", "SS.4.A.4.2", "SS.4.A.5.1", "SS.4.A.9.1", "SS.4.G.1.1", "SS.4.G.1.2", "SS.4.G.1.4", "SS.3.G.2.5"],
    ela: ["ELA.3.R.2.4", "ELA.4.R.2.4", "ELA.K12.EE.1.1"]
  },
  plant: {
    playable: false,
    ss: ["SS.4.A.4.1", "SS.4.A.6.1", "SS.4.A.6.3", "SS.4.A.6.4", "SS.4.A.9.1", "SS.4.E.1.1", "SS.4.G.1.2", "SS.4.G.1.4", "SS.3.G.2.5"],
    ela: ["ELA.3.R.2.1", "ELA.4.R.2.2"]
  },
  ybor: {
    playable: false,
    ss: ["SS.4.A.1.1", "SS.4.A.6.1", "SS.4.A.6.2", "SS.4.A.6.3", "SS.4.E.1.1", "SS.3.G.4.2", "SS.3.G.4.4"],
    ela: ["ELA.3.R.2.2", "ELA.4.R.2.4"]
  },
  port: {
    playable: false,
    ss: ["SS.4.A.1.1", "SS.4.A.6.1", "SS.4.A.6.4", "SS.4.E.1.2", "SS.4.G.1.1", "SS.3.E.1.1"],
    ela: ["ELA.3.R.2.2", "ELA.4.R.2.2", "ELA.4.R.3.3"]
  }
};

/* Suggested IMAGES keys to add when integrating (photo webps + painted art).
   A Tampa Bay inset map (not the statewide Case 1 map) will be needed so
   Weedon Island, Safety Harbor, Fort Brooke, the hotel, Ybor, and Port Tampa
   can be tapped with a compass rose and scale bar. */
