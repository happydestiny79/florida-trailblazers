/* Every historical / geographic claim the game states, with sources.
   FACT_CHECK.md is generated from this file (see tools/make_factcheck.js). */
var SRC = {
  dosExplore: "https://dos.fl.gov/florida-facts/florida-history/a-brief-history/european-exploration-and-colonization/",
  npsBrochure: "https://www.nps.gov/npgallery/GetAsset/e518cd67-f4cb-432a-b38c-f263be0d7e7e",
  npsArchive: "https://npshistory.com/publications/casa/index.htm",
  npsCoquina: "https://nps.gov/casa/learn/historyculture/coquina-the-rock-that-saved-st-augustine.htm",
  npsWhoBuilt: "https://www.nps.gov/casa/learn/historyculture/who-built-the-castillo.htm",
  flmnhTimucua: "https://www.floridamuseum.ufl.edu/staugustine/timeline/the-timucua-in-st-augustine/",
  mofhDecline: "https://www.museumoffloridahistory.com/explore/exhibits/permanent-exhibits/la-florida/forever-changed-phase-2/the-first-spanish-period/demise-of-the-indigenous-population-and-the-mission-period/",
  npsTimuEnd: "https://www.nps.gov/timu/learn/historyculture/timucua_end_culture.htm",
  npsTimuMissions: "https://www.nps.gov/timu/learn/historyculture/missions_fgi.htm",
  fspMose: "https://www.floridastateparks.org/learn/history-fort-mose",
  npsMoseAA: "https://www.nps.gov/casa/learn/historyculture/african-americans-in-st-augustine-1565-1821.htm",
  npsMoseArch: "https://www.nps.gov/articles/000/archeological-research-at-fort-mose.htm",
  flmnhMose: "https://www.floridamuseum.ufl.edu/histarch/research/st-augustine/fort-mose/",
  mslHistory: "https://missionsanluis.org/learn/history/",
  mslGuide: "https://missionsanluis.org/media/fhdfsjhn/visitorguide.pdf",
  mslArch: "https://missionsanluis.org/learn/archaeology",
  npsSanLuisNHL: "https://npgallery.nps.gov/GetAsset/67d92cf2-58d6-4530-b79d-4b182a00beae",
  paiva: "https://digitalcommons.usf.edu/cgi/viewcontent.cgi?article=1028&context=early_visions_bucket",
  dosBrief: "https://dos.fl.gov/florida-facts/florida-history/a-brief-history/",
  standards: "https://flrules.org/gateway/reference.asp?No=Ref-19653"
};

var FACTS = {
  /* ---------- St. Augustine ---------- */
  ponce1513: { text: "In 1513, Spanish explorer Juan Ponce de León came ashore on Florida's northeast coast. He named the land \"la Florida\" after Spain's Easter celebration, Pascua Florida (\"feast of the flowers\").", src: [SRC.dosExplore] },
  soto1539: { text: "In 1539, explorer Hernando de Soto began an expedition through Florida searching for gold and silver.", src: [SRC.dosExplore] },
  noTreasure: { text: "The Spanish explorers did not find great treasure in Florida.", src: [SRC.dosExplore] },
  fortCaroline: { text: "France also wanted Florida. In 1564, French settlers built Fort Caroline near present-day Jacksonville.", src: [SRC.dosExplore] },
  menendez1565: { text: "In 1565, Pedro Menéndez de Avilés founded St. Augustine. Spain wanted to drive out the French, protect its treasure-ship route along the Gulf Stream, and hold on to its claim to La Florida.", src: [SRC.dosExplore, SRC.npsBrochure] },
  oldest: { text: "St. Augustine is the oldest permanent European settlement in the continental United States.", src: [SRC.npsArchive, SRC.dosExplore] },
  castilloBuilt: { text: "The Castillo de San Marcos was built from 1672 to 1695 to protect St. Augustine. The Spanish had built nine wooden forts before it.", src: [SRC.npsBrochure, SRC.npsWhoBuilt] },
  coquina: { text: "The Castillo is made of coquina, a stone formed from tiny seashells. Its walls average about 12 feet thick.", src: [SRC.npsCoquina] },
  coquina1702: { text: "When English forces fired cannons at the Castillo in 1702, the coquina walls absorbed the hits instead of shattering. The Castillo never fell in battle.", src: [SRC.npsCoquina, SRC.npsBrochure] },
  timucuaLife: { text: "For hundreds of years before 1565, the Timucua people lived in the St. Augustine area. They fished, hunted, and grew corn, beans, and squash. In 1565 the main chief of the area was Seloy.", src: [SRC.flmnhTimucua] },
  timucuaDecline: { text: "Europeans brought diseases such as smallpox and measles, which killed many Native people. The Spanish also made Native people work and give part of their crops. By 1698 only about 550 Timucua were left, and today there are no known Timucua people.", src: [SRC.mofhDecline, SRC.npsTimuEnd, SRC.npsTimuMissions] },
  flags: { text: "Spain ruled Florida first. Britain took control in 1763. Spain got Florida back after the American Revolution, and in 1821 Spain handed Florida to the United States.", src: [SRC.dosExplore] },
  spanishEffects: { text: "Spanish rule left many marks on Florida: the name \"Florida\" itself, Spanish place names like St. Augustine, Catholic missions across north Florida, and forts like the Castillo.", src: [SRC.dosExplore, SRC.npsBrochure] },
  /* ---------- Fort Mose ---------- */
  mose1738: { text: "In 1738, the Spanish governor of Florida, Manuel de Montiano, set aside land about 2 miles north of St. Augustine for a new town: Gracia Real de Santa Teresa de Mose, called Fort Mose (say \"moh-SAY\").", src: [SRC.npsMoseAA, SRC.fspMose] },
  moseFreedom: { text: "Fort Mose was for people escaping slavery in the English colonies of the Carolinas. Spain offered them freedom if they promised loyalty to the king of Spain and joined the Catholic Church.", src: [SRC.fspMose, SRC.npsMoseAA] },
  moseFirst: { text: "Fort Mose was the first legally sanctioned free African (free Black) settlement in what is now the United States.", src: [SRC.fspMose, SRC.flmnhMose] },
  mosePeople: { text: "About 100 people lived at Fort Mose. The men served in a militia that helped defend St. Augustine. Their captain, Francisco Menéndez, had freed himself from slavery and was the town's real leader.", src: [SRC.npsMoseAA, SRC.npsMoseArch] },
  mose1740: { text: "When British forces from Georgia attacked in 1740, the people of Mose moved to St. Augustine for safety. Later, Spanish soldiers and the Mose militia won back the fort in a surprise attack.", src: [SRC.npsMoseAA, SRC.npsMoseArch] },
  mose1763: { text: "When Florida was handed over to Britain in 1763, the people of Fort Mose left for Cuba along with the Spanish settlers.", src: [SRC.npsMoseAA, SRC.npsMoseArch] },
  moseToday: { text: "No buildings from Fort Mose remain today. Visitors can see the marsh land where it stood at Fort Mose Historic State Park.", src: [SRC.npsMoseAA] },
  /* ---------- Mission San Luis ---------- */
  sanluisCapital: { text: "From 1656 to 1704, Mission San Luis stood on one of the tallest hills in what is now Tallahassee. It was the capital of Spain's western missions in Florida.", src: [SRC.mslHistory, SRC.npsSanLuisNHL] },
  sanluisPeople: { text: "About 1,500 Apalachee people and 150 Spanish people lived at San Luis. It was home to a powerful Apalachee chief and to the Spanish deputy governor.", src: [SRC.mslHistory, SRC.npsSanLuisNHL] },
  apalacheeFarm: { text: "The Apalachee were strong farmers. Their most important foods were corn, beans, and squash, along with fish, wild game, nuts, and berries. Rich soil was one reason the Spanish came to this area.", src: [SRC.mslGuide] },
  missionPurpose: { text: "Spanish friars came to teach the Catholic faith and baptize the Apalachee. San Luis was also Spain's western center for soldiers and government, and the friars' food came from the Apalachee villagers as tribute.", src: [SRC.mslGuide, SRC.mslArch] },
  apalacheeAsked: { text: "Apalachee leaders asked for Spanish friars as early as 1607, at a time of sickness and the threat of attack. From 1633 to 1635, at least 5,000 Apalachee were baptized.", src: [SRC.mslGuide] },
  churchBells: { text: "Church bells rang through the day at San Luis to mark activities, and both Spaniards and Apalachee went to services in the church.", src: [SRC.mslGuide] },
  councilHouse: { text: "The Apalachee council house at San Luis was a huge round building about 120 feet across. Apalachee leaders met there every day to discuss community business. It was also used for dances and ceremonies.", src: [SRC.mslGuide] },
  plaza: { text: "The round plaza at San Luis was about 410 feet across, about the size of a football field. It was the center of town life.", src: [SRC.mslGuide] },
  ballGame: { text: "The Apalachee ball game was a rough team game with 50 or more players. It was played to bring rain for the crops.", src: [SRC.mslGuide] },
  friars: { text: "The friars lived in a building called a friary (convento). With help from Apalachee interpreters, they learned the Apalachee language.", src: [SRC.mslGuide] },
  trade: { text: "Goods like hides, beef, and corn were shipped from the San Luis area to Havana, Cuba, in trade.", src: [SRC.mslGuide] },
  paiva1676: { text: "In 1676, Father Juan de Paiva, the priest at San Luis, wrote a description of the Apalachee ball game. Because he wrote it at the time, it is a primary source. Much of what we know about the Apalachee comes from writings by friars and their Apalachee translators.", src: [SRC.paiva, SRC.mslArch] },
  sanluis1704: { text: "In 1704, English soldiers from Carolina and their Creek allies attacked Spanish missions. On July 31, 1704, the people of San Luis burned their mission and left so enemies could not use it. The Apalachee scattered and never moved back to their homeland.", src: [SRC.mslGuide, SRC.dosExplore] },
  bellsBuried: { text: "The people leaving San Luis buried heavy things like church bells, hoping to come back for them someday.", src: [SRC.mslGuide] },
  sanluisToday: { text: "Today Mission San Luis is a history museum with rebuilt buildings, including the council house, church, friary, and fort.", src: [SRC.npsSanLuisNHL] },
  /* ---------- Geography ---------- */
  geoMoseNorth: { text: "Fort Mose is about 2 miles north of St. Augustine.", src: [SRC.npsMoseAA, SRC.flmnhMose] },
  geoWest: { text: "Tallahassee (Mission San Luis) is west and a little north of St. Augustine, about 180 miles away in a straight line. Tallahassee is Florida's state capital.", src: [SRC.dosBrief], flag: "The 180-mile figure is my own straight-line (great-circle) calculation from coordinates (St. Augustine 29.898 N, 81.312 W; Mission San Luis 30.446 N, 84.319 W) and came out to about 184 miles. Driving distance is longer. Tallahassee as state capital is common knowledge; the DOS source covers Florida's state history, not the capital directly." },
  geoAnastasia: { text: "The coquina stone for the Castillo was cut on Anastasia Island, across the bay to the east of St. Augustine.", src: [SRC.npsCoquina], flag: "NPS says coquina was quarried \"in the area of present-day Anastasia State Park on Anastasia Island.\" Calling it \"east across the bay\" is my own map reading." }
};
