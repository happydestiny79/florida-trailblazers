/* Florida Trailblazers v3 — data for interviews, dossiers, the warrant, hands-on clue scenes, Penny's riddles,
   the avatar builder and costume rewards. All people are MADE UP. History in answers re-uses sourced FACTS. */

/* ---- witness clues you can earn in interviews (what you ask decides which you get) ---- */
var V3_CLUES = {
  w_drip:  { kind: "suspect", text: "Ranger Rosa: \"Someone left UMBRELLA drips by the case, and it wasn't raining inside!\"" },
  w_pen:   { kind: "suspect", text: "Penny Pinch signed her name for you with a PURPLE-ink pen." },
  w_capital: { kind: "place", text: "Ranger Dee: \"A woman in a green straw hat asked which bus goes to the STATE CAPITAL.\"" },
  w_plaza: { kind: "place", text: "Guide Tomás: \"A lady with a red umbrella kept asking about the BIGGEST building on the plaza, where leaders met.\"" },
  c_tornmap: { kind: "place", text: "Torn map, put back together: a purple-ink arrow points WEST, along the Panhandle, toward the capital." }
};

/* Evidence groups for the warrant: one from each group is needed. */
var WARRANT_NEEDS = [
  { id: "ink", label: "who writes in purple ink", clues: ["c_purple", "w_pen"] },
  { id: "carry", label: "who carries a red umbrella", clues: ["c_umbrella", "w_drip"] },
  { id: "place", label: "where the Stone is hidden", clues: ["c_hideout", "w_plaza"] }
];

/* ---- dossiers: the fields on each wanted poster ---- */
var DOSSIER_FIELDS = [
  { id: "hat", label: "Hat", icon: "🎩" }, { id: "carry", label: "Carries", icon: "🎒" }, { id: "ink", label: "Ink", icon: "✒️" }, { id: "alibi", label: "Alibi (10 a.m.)", icon: "🕙" }
];
var ALIBIS = {
  rusty: "Selling fridge magnets at his cart outside the fort. (A shaky alibi: nobody remembers seeing him.)",
  penny: "\"Admiring the cannons. Alone.\" Nobody saw her.",
  fog: "Steering his tour boat on Matanzas Bay. Thirty passengers saw him.",
  lulu: "Practicing card tricks on the plaza for a crowd of kids."
};

/* ---- interviews ----
   Each question: q (what you ask), a (answer), mood (expression), clue (witness clue), reveal ([suspect, field]),
   fact (a sourced FACTS id added to your notebook), needs (ids asked first), rude (true = they end the interview and
   the questions you did not ask yet are LOCKED for this case). Polite, specific questions earn more clues. */
var INTERVIEWS = {
  pelican: { start: "Ah, my newest detective! Ask me anything before you go.", qs: [
    { id: "p1", q: "What is the Founding Stone?", a: "A carved coquina stone made for the city's museum. It's made up for our story, but the stone it's made from, coquina, is very real!", mood: "happy" },
    { id: "p2", q: "How do I get people to share clues?", a: "Ask polite, specific questions. Witnesses clam up if you accuse them. And watch their faces: a nervous face can be a clue!", mood: "smug" },
    { id: "p3", q: "Is this case dangerous?", a: "Dangerous? Ha! The only danger is running out of snacks.", mood: "surprised", needs: ["p1"] }
  ] },
  rosa: { start: "Hi, detective. I'm still shaken up. How can I help?", qs: [
    { id: "r1", q: "When did you notice the Stone was gone?", a: "Right after the 10 o'clock tour. I turned around and the case was empty!", mood: "nervous" },
    { id: "r2", q: "Did you notice anything strange near the case?", a: "Now that you ask… there were water drips by the case, like from a wet UMBRELLA. But it wasn't raining in here!", mood: "surprised", clue: "w_drip", needs: ["r1"] },
    { id: "r3", q: "Why is the fort made of seashell stone?", a: "Coquina! It's soft and spongy, so cannonballs sank in instead of cracking the walls.", mood: "happy", fact: "coquina1702" },
    { id: "r4", q: "Are YOU the thief?!", a: "Me?! I protect this fort's history. I have a tour to lead. Goodbye, detective.", mood: "surprised", rude: true }
  ] },
  dee: { start: "Welcome to Fort Mose! Ask away.", qs: [
    { id: "d1", q: "Did any visitors ask you unusual questions today?", a: "Yes! A woman in a green straw hat asked which bus goes to the STATE CAPITAL. She seemed in a hurry.", mood: "surprised", clue: "w_capital" },
    { id: "d2", q: "Why is Fort Mose important?", a: "It was the first legally sanctioned free Black settlement in what is now the United States.", mood: "happy", fact: "moseFirst" },
    { id: "d4", q: "What did you tell her about the bus?", a: "That the westbound bus goes toward Tallahassee. She smiled a little TOO much.", mood: "nervous", needs: ["d1"] },
    { id: "d3", q: "Did you hide the Stone in the marsh?", a: "Excuse me? I take care of this park. I need to get back to work.", mood: "nervous", rude: true }
  ] },
  volunteer: { start: "Oh! You're the detective? I saw something this morning.", qs: [
    { id: "v1", q: "What did the person look like?", a: "A green straw hat and a RED umbrella, even though it was sunny.", mood: "nervous" },
    { id: "v2", q: "What were they holding?", a: "A bus schedule! Westbound, I think.", mood: "surprised", needs: ["v1"] },
    { id: "v3", q: "Why didn't you stop them?!", a: "I… I'm just a volunteer! Please don't shout.", mood: "nervous", rude: true }
  ] },
  tomas: { start: "Bienvenidos to Mission San Luis! What would you like to know?", qs: [
    { id: "t1", q: "Has a lady with a red umbrella been here?", a: "Yes. She kept asking about the BIGGEST building on the plaza, the one where Apalachee leaders met. Strange questions for a tourist!", mood: "surprised", clue: "w_plaza" },
    { id: "t2", q: "Who lived at Mission San Luis?", a: "Apalachee people and Spanish people lived here together, from 1656 to 1704.", mood: "happy", fact: "sanluisPeople" },
    { id: "t4", q: "How big is that council house?", a: "Huge! About 120 feet across. Council houses like it could hold up to 3,000 people!", mood: "surprised", needs: ["t1"] },
    { id: "t3", q: "You're hiding something, aren't you?!", a: "The only thing I'm hiding is my lunch. I have a tour now. Adiós.", mood: "smug", rude: true }
  ] },
  /* suspects */
  rusty: { start: "Magnets! Postcards! Oh… you're not buying, are you?", qs: [
    { id: "ru1", q: "What do you carry for your shop?", a: "My trusty BACKPACK, full of magnets. Want one? Only 2 coins!", mood: "happy", reveal: ["rusty", "carry"] },
    { id: "ru2", q: "Could you write down your shop's phone number?", a: "Sure! (He writes in BLACK ink.)", mood: "neutral", reveal: ["rusty", "ink"] },
    { id: "ru3", q: "Where were you at 10 o'clock?", a: "At my cart outside. Uh… nobody bought anything, so nobody saw me.", mood: "nervous", reveal: ["rusty", "alibi"] },
    { id: "ru4", q: "Did you steal the Founding Stone?!", a: "Me? I can't even steal a customer! I'm done talking.", mood: "surprised", rude: true }
  ] },
  penny: { start: "Well, well. A little detective. How… adorable.", qs: [
    { id: "pe1", q: "That's a nice umbrella. Is it new?", a: "This RED umbrella? I take it everywhere. A lady must be prepared.", mood: "smug", reveal: ["penny", "carry"] },
    { id: "pe2", q: "May I have your autograph for my notebook?", a: "Hmm. Fine. (She signs with a PURPLE-ink pen… then quickly hides it.)", mood: "nervous", reveal: ["penny", "ink"], clue: "w_pen" },
    { id: "pe3", q: "Where were you at 10 o'clock?", a: "Admiring the cannons. Alone. Is that a crime?", mood: "smug", reveal: ["penny", "alibi"] },
    { id: "pe5", q: "Where are you taking that umbrella next?", a: "Somewhere WEST… I mean, that's none of your business, detective!", mood: "nervous", needs: ["pe1"] },
    { id: "pe4", q: "You took the Stone, didn't you?!", a: "How rude! I have a bus to… I mean, a lunch to catch. Toodles!", mood: "smug", rude: true }
  ] },
  fog: { start: "Ahoy! Captain Fogbottom, at your service.", qs: [
    { id: "fo1", q: "Why do you carry an umbrella, Captain?", a: "This RED umbrella keeps sea spray off my head. A captain must stay dry!", mood: "happy", reveal: ["fog", "carry"] },
    { id: "fo2", q: "Can you sign my boat ticket?", a: "Aye! (He signs in BLACK ink, with a big swirl.)", mood: "happy", reveal: ["fog", "ink"] },
    { id: "fo3", q: "Where were you at 10 o'clock?", a: "Steering my tour boat on Matanzas Bay. Thirty passengers can tell you!", mood: "smug", reveal: ["fog", "alibi"] },
    { id: "fo4", q: "Admit it, you're the thief!", a: "Shiver me timbers, how rude! This interview is over.", mood: "surprised", rude: true }
  ] },
  lulu: { start: "Pick a card, any card! …No? A detective, then.", qs: [
    { id: "lu1", q: "What's in your bag?", a: "My BACKPACK holds my magic tricks. A magician never reveals more than that!", mood: "smug", reveal: ["lulu", "carry"] },
    { id: "lu2", q: "Can you write your show time for me?", a: "Of course! (She writes in PURPLE ink. Hmm!)", mood: "happy", reveal: ["lulu", "ink"] },
    { id: "lu3", q: "Where were you at 10 o'clock?", a: "On the plaza, doing card tricks for a crowd of kids.", mood: "neutral", reveal: ["lulu", "alibi"] },
    { id: "lu4", q: "Did you make the Stone disappear?!", a: "Ooh, how rude! Poof, I'm gone!", mood: "surprised", rude: true }
  ] }
};

/* ---- Penny's riddle notes between chapters (tied to standards; a correct first try earns race points) ---- */
var RIDDLES = {
  r1: { at: "fm1", teaches: ["SS.4.A.3.3"], fact: "oldest", note: "Ha! You'll never catch me, little detective. Try this riddle: Spain founded me in 1565, and I'm the oldest permanent European settlement in the continental United States. Which city did I just slip out of?",
    choices: [{ label: "St. Augustine", correct: true }, { label: "Tallahassee" }, { label: "Pensacola" }, { label: "Miami" }],
    hint: "Which city did you just visit, where Spain built the stone Castillo?", win: "Grr! Correct. St. Augustine, founded in 1565." },
  r2: { at: "tl1", teaches: ["SS.4.G.1.2"], fact: "capital1824", note: "Still following me? Riddle number two: in what year was Tallahassee chosen as Florida's capital?",
    choices: [{ label: "1565" }, { label: "1704" }, { label: "1824", correct: true }, { label: "1513" }],
    hint: "Florida became a United States territory in 1821. The capital was chosen a few years AFTER that. Which choice is only a few years later than 1821?", win: "Hmph! 1824 is right." },
  r3: { at: "deduce", teaches: ["SS.4.A.3.7"], fact: "flags", note: "Last riddle, and then I'm gone forever! Spain, France and which other nation all wanted to control Florida before it became part of the United States?",
    choices: [{ label: "England (Britain)", correct: true }, { label: "Mexico" }, { label: "Portugal" }, { label: "Japan" }],
    hint: "Which country took control of Florida in 1763?", win: "No fair! England (Britain) is right." }
};
/* Where Penny is (she stays one stop ahead). Shown on the Case Map only after you have the clue that points there. */
var PENNY_PATH = [ { loc: "mose", after: "c_note1" }, { loc: "sanluis", after: "c_ticket" } ];

/* ---- hands-on clue scenes ---- */
var SEARCH = {
  sa1case: { img: "castillo_room", intro: "The empty display case is in this stone room. Tap the glowing spots to search. Use the magnifying glass on anything that looks smudged.",
    spots: [
      { id: "case", x: 47, y: 62, label: "Empty display case", text: "The glass is smudged. Something tiny is on it… Use the magnifying glass!", lens: true },
      { id: "floor", x: 22, y: 86, label: "Stone floor", text: "Just coquina dust and a lost tour ticket. Not a clue." },
      { id: "door", x: 80, y: 45, label: "Doorway", text: "The doorway leads out to the courtyard. The thief could have slipped out this way." },
      { id: "wall", x: 12, y: 32, label: "Coquina wall", text: "You can see tiny shells in the stone wall. Cool, but not a clue." }
    ],
    lensTarget: { x: 52, y: 58, r: 7, label: "a purple ink smudge", clue: "c_purple" } }
};
var TORNMAP = { fm4map: { img: "gibson1763", cols: 3, rows: 2, clue: "c_tornmap",
  intro: "The thief dropped a torn-up map on the trail! Put the 6 pieces back together. Drag a piece onto its spot, or tap a piece and then tap a spot.",
  arrow: { x1: 78, y1: 30, x2: 22, y2: 22 } } };
var DUST = { stone: { intro: "You recovered the Founding Stone, but it's covered in dust! Rub (drag) your finger or mouse across it to clean it, or press the brush button.",
  words: ["ST. AUGUSTINE", "FOUNDED 1565"], fact: "menendez1565" } };

/* ---- avatar builder ---- */
var AVATAR_OPTS = {
  skin: ["#f6d7c3", "#eac0a0", "#d9a47c", "#c08a5e", "#a06a45", "#7d4e32", "#5e3a25", "#3f2618"],
  hair: ["short", "curly", "afro", "puffs", "long", "wavy", "ponytail", "braids", "locs", "bun", "buzz", "hijab", "none"],
  hairColor: ["#16100c", "#3b2416", "#6b4226", "#a5532a", "#d8b26e", "#9a958d", "#3d5fd1", "#d0508f"],
  hijab: ["#2a9d8f", "#1d3557", "#b5446e", "#8e7cc3", "#222222", "#f1ede4"],
  eyes: ["#3b2414", "#5a3a22", "#6f6a3a", "#3f7a4a", "#4d6a8a", "#7b8188"],
  outfit: ["trench", "hoodie", "sweater", "vest", "polo"],
  outfitColor: ["#c9a77a", "#2a6fdb", "#d62828", "#2a9d8f", "#6b3fa0", "#333a44", "#e9b949"],
  glasses: ["none", "round", "square"],
  hat: ["none", "cap", "beret", "deerstalker", "ranger", "explorer"]
};
var AVATAR_DEFAULT = { skin: "#c08a5e", hair: "curly", hairColor: "#16100c", hijab: "#2a9d8f", eyes: "#3b2414", outfit: "trench", outfitColor: "#c9a77a", glasses: "none", hat: "none", freckles: false, hearingAid: false, gear: [] };
/* costume pieces unlocked by badges (they stay unlocked across cases) */
var UNLOCKS = [
  { id: "deerstalker", kind: "hat", badge: "firstclue", name: "Detective hat" },
  { id: "ranger", kind: "hat", badge: "timeline", name: "Ranger hat" },
  { id: "explorer", kind: "hat", badge: "sharpeye", name: "Explorer hat" },
  { id: "medal", kind: "gear", badge: "persist", name: "Never-Give-Up medal" },
  { id: "watch", kind: "gear", badge: "ontime", name: "Pocket watch" },
  { id: "coinpin", kind: "gear", badge: "budget", name: "Gold coin pin" },
  { id: "compasspin", kind: "gear", badge: "mapper", name: "Compass pin" },
  { id: "bookbadge", kind: "gear", badge: "reader", name: "Book badge" },
  { id: "scroll", kind: "gear", badge: "sources", name: "Source scroll" },
  { id: "scarf", kind: "gear", badge: "independent", name: "Thinker's scarf" },
  { id: "magnifier", kind: "gear", badge: "words", name: "Golden magnifier" }
];
