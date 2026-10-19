/* Exact benchmark wording copied programmatically from Florida's State Academic Standards – Social Studies, 2026 (Rule 6A-1.09401, Ref-19653). */
var BENCHMARKS = {
 "SS.4.A.1.1": "Analyze primary and secondary resources to identify significant individuals and events throughout Florida history.",
 "SS.4.A.2.1": "Compare Native American tribes in Florida.",
 "SS.4.A.3.1": "Identify explorers who came to Florida and the motivations for their expeditions.",
 "SS.4.A.3.2": "Describe causes and effects of European colonization on the Native American tribes of Florida.",
 "SS.4.A.3.3": "Identify the significance of St. Augustine as the oldest permanent European settlement in the United States.",
 "SS.4.A.3.4": "Explain the purpose of and daily life on missions (San Luis de Talimali in present-day Tallahassee).",
 "SS.4.A.3.5": "Identify the significance of Fort Mose as the first free African community in the United States.",
 "SS.4.A.3.6": "Identify the effects of Spanish rule in Florida.",
 "SS.4.A.3.7": "Identify nations (Spain, France, England) that controlled Florida before it became a United States territory.",
 "SS.4.A.9.1": "Utilize timelines to sequence key events in Florida history.",
 "SS.4.G.1.2": "Locate and label cultural features on a Florida map.",
 "SS.4.G.1.4": "Interpret political and physical maps using map elements (title, compass rose, cardinal directions, intermediate directions, symbols, legend, scale, longitude, latitude).",
 "SS.4.FL.2.2": "Explain that people make choices about what goods and services they buy because they can’t have everything they want. This requires individuals to prioritize their wants.",
 "SS.4.FL.2.4": "Discuss that whenever people buy something, they incur an opportunity cost. Opportunity cost is the value of the next best alternative that is given up when a person makes a choice.",
 "SS.4.FL.2.5": "Explain that costs are things that a decision maker gives up; benefits are things that a decision maker gains. Make an informed decision by comparing the costs and benefits of spending alternatives."
};

/* Grade 3 and grade 4 ELA benchmarks used in this game. Exact wording copied from
   Florida's State Academic Standards – Benchmarks for Excellent Student Thinking (B.E.S.T.) English Language Arts, 2025
   (Rule 6A-1.09401, F.A.C., effective December 2025; incorporated document Ref-18865):
   https://flrules.org/gateway/reference.asp?No=Ref-18865  (page = PDF page of "B.E.S.T. ELA Standards 2025_Clean 6A-1.09401.pdf") */
var ELA_SOURCE = { title: "Florida's State Academic Standards – B.E.S.T. English Language Arts, 2025 (Rule 6A-1.09401, F.A.C., Ref-18865)", url: "https://flrules.org/gateway/reference.asp?No=Ref-18865" };
var ELA_BENCHMARKS = {
 "ELA.3.R.2.1": { grade: 3, page: 54, strand: "Reading Informational Text: Structure", text: "Explain how text features contribute to meaning and identify the text structures of chronology, comparison, and cause/effect in texts." },
 "ELA.3.R.2.2": { grade: 3, page: 54, strand: "Reading Informational Text: Central Idea", text: "Identify the central idea and explain how relevant details support that idea in a text." },
 "ELA.3.R.2.3": { grade: 3, page: 54, strand: "Reading Informational Text: Purpose and Perspective", text: "Explain the development of an author’s purpose in an informational text." },
 "ELA.3.R.2.4": { grade: 3, page: 54, strand: "Reading Informational Text: Argument", text: "Identify an author’s claim and explain how an author uses evidence to support the claim." },
 "ELA.3.R.3.3": { grade: 3, page: 55, strand: "Reading Across Genres: Comparative Reading", text: "Compare and contrast how two authors present information on the same topic or theme." },
 "ELA.3.V.1.3": { grade: 3, page: 58, strand: "Vocabulary: Context and Connotation", text: "Use context clues, figurative language, word relationships, reference materials, and/or background knowledge to determine the meaning of multiple-meaning and unknown words and phrases, appropriate to grade level." },
 "ELA.4.R.2.1": { grade: 4, page: 63, strand: "Reading Informational Text: Structure", text: "Explain how text features contribute to the meaning and identify the text structures of problem/solution, sequence, and description in texts." },
 "ELA.4.R.2.2": { grade: 4, page: 63, strand: "Reading Informational Text: Central Idea", text: "Explain how relevant details support the central idea, implied or explicit." },
 "ELA.4.R.2.3": { grade: 4, page: 63, strand: "Reading Informational Text: Purpose and Perspective", text: "Explain an author’s perspective toward a topic in an informational text." },
 "ELA.4.R.2.4": { grade: 4, page: 63, strand: "Reading Informational Text: Argument", text: "Explain an author’s claim and the reasons and evidence used to support the claim." },
 "ELA.4.R.3.3": { grade: 4, page: 64, strand: "Reading Across Genres: Comparative Reading", text: "Compare and contrast accounts of the same event using primary and/or secondary sources." },
 "ELA.4.V.1.3": { grade: 4, page: 67, strand: "Vocabulary: Context and Connotation", text: "Use context clues, figurative language, word relationships, reference materials, and/or background knowledge to determine the meaning of multiple-meaning and unknown words and phrases, appropriate to grade level." },
 "ELA.K12.EE.1.1": { grade: "K-12", page: 10, strand: "K-12 ELA Expectations", text: "Cite evidence to explain and justify reasoning." }
};
