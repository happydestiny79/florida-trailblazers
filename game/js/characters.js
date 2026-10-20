/* Florida Trailblazers v3 — the cast. Every person here is an ORIGINAL, made-up character drawn by js/portrait.js.
   None is based on a real person. No historical figure is drawn. */
var CHARS = {
  pelican: { name: "Professor Pelican", role: "Head of the Florida History Detective Agency", bg: "#d9c7a3",
    spec: { skin: "#6b4128", hair: "bald", hairColor: "#bdb7ae", beard: true, beardColor: "#cfcac2", age: 2, glasses: "#3a2a1a", glassesShape: "round", eyes: "#3b2414", faceW: 1.04,
      outfit: { type: "tweed", color: "#7a5a3c", tie: "#b23a48" } } },
  rosa: { name: "Ranger Rosa", role: "Park ranger at the Castillo de San Marcos", bg: "#e3cf9f",
    spec: { skin: "#b97a50", hair: "ponytail", hairColor: "#1f1510", eyes: "#4a2c17", earrings: "#d9b13b", blush: .05,
      outfit: { type: "ranger", color: "#b8a27a", patch: "#4f7a3a" }, hat: { type: "ranger", color: "#7d6b45", band: "#4b3b22" } } },
  dee: { name: "Ranger Dee", role: "Park ranger at Fort Mose Historic State Park", bg: "#c9d8b6",
    spec: { skin: "#5a3522", hair: "curly", hairColor: "#16100c", eyes: "#2e1b10", earrings: "#e8e2d6", age: 1,
      outfit: { type: "parkshirt", color: "#4f6b44", patch: "#c9b27c" } } },
  volunteer: { name: "Mr. Okafor", role: "Park volunteer (the eyewitness)", bg: "#d6d0c2",
    spec: { skin: "#8a5534", hair: "buzz", hairColor: "#9a958d", mustache: true, beardColor: "#bdb7ae", age: 2, eyes: "#3a2414", hearingAid: "#c9c2b8",
      outfit: { type: "vest", color: "#5d86b8", color2: "#ef7d2d" } } },
  tomas: { name: "Guide Tomás", role: "Tour guide at Mission San Luis", bg: "#e0c8a8",
    spec: { skin: "#c08a5e", hair: "short", hairColor: "#20160f", eyes: "#3d2616", faceW: .98,
      outfit: { type: "polo", color: "#28536b", lanyard: "#e9b949" } } },
  sam: { name: "Detective Sam", role: "Your detective partner", bg: "#c7d9e6", kid: true,
    spec: { kid: true, skin: "#9a6440", hijab: "#2a9d8f", eyes: "#3b2414", glasses: "#7a3e9d", glassesShape: "round",
      outfit: { type: "trench", color: "#c9a77a", inner: "#f4efe4" }, props: ["notebook"] } },
  penny: { name: "Penny Pinch", role: "Coin collector", suspect: true, bg: "#e7d3c3",
    spec: { skin: "#f0c8a8", freckles: true, hair: "wavy", hairColor: "#b8481f", eyes: "#3f7a4a", earrings: "#e8c14f",
      outfit: { type: "cardigan", color: "#6a3d8a" }, hat: { type: "straw", color: "#6f9a4a", band: "#7b3fa0" }, props: ["umbrella", "pen"] } },
  rusty: { name: "Rusty Hinges", role: "Souvenir seller", suspect: true, bg: "#d8d0bd",
    spec: { skin: "#e3a988", hair: "short", hairColor: "#a5532a", beard: true, beardColor: "#b4602f", age: 1, eyes: "#4d6a8a", faceW: 1.08,
      outfit: { type: "floral", color: "#2f8f8a", dots: "#ffd166" }, hat: { type: "straw", color: "#6f9a4a", band: "#3d5c2a" }, props: ["backpack"] } },
  fog: { name: "Captain Fogbottom", role: "Tour boat captain", suspect: true, bg: "#c9d3dd",
    spec: { skin: "#dcb38c", hair: "short", hairColor: "#2a2a2a", age: 2, eyes: "#2b1d14", mustache: true, beardColor: "#8f8a84",
      outfit: { type: "captain", color: "#24365e" }, hat: { type: "cap", color: "#2d5fa8", emblem: "#e3b448" }, props: ["umbrella"] } },
  lulu: { name: "Lulu Larceny", role: "Stage magician", suspect: true, bg: "#d9cde3",
    spec: { skin: "#8d5a3b", hair: "long", hairColor: "#140e0b", eyes: "#2a1a10", earrings: "#c0c0c8",
      outfit: { type: "sequin", color: "#2a2a35", color2: "#6b3fa0", inner: "#1d1d24" }, hat: { type: "cap", color: "#2d5fa8" }, props: ["backpack"] } }
};
/* the speaker names used in scenes → character ids */
var SPEAKER_CHAR = { "Professor Pelican": "pelican", "Ranger Rosa": "rosa", "Ranger Dee": "dee", "Park Volunteer": "volunteer", "Guide Tomás": "tomas" };
