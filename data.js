// The wardrobe starts empty so each person can add their own clothing.
const CATEGORIES = [
  "Tops",
  "Bottoms",
  "Dresses",
  "Jackets and outerwear",
  "Shoes",
  "Bags",
  "Hats",
  "Sunglasses and glasses",
  "Jewelry",
  "Other accessories"
];

// Colour names people can type when adding clothing, and the tint shown for each.
// Anything not listed here can still work if the browser knows it (e.g. "navy", "olive").
const COLOR_NAMES = {
  "blush pink": "#f6c9d5",
  "pink": "#f4b6c8",
  "hot pink": "#e9579a",
  "dusty rose": "#d8a1a8",
  "rose": "#e58fa3",
  "red": "#d9534f",
  "burgundy": "#7d2638",
  "wine": "#722f37",
  "coral": "#f08a72",
  "peach": "#f9c9a7",
  "orange": "#f0954b",
  "rust": "#b5532c",
  "butter yellow": "#f7e3a1",
  "yellow": "#f4d35e",
  "mustard": "#d4a72c",
  "sage green": "#b7c9a8",
  "sage": "#b7c9a8",
  "mint": "#bfe6d2",
  "green": "#6aa36f",
  "olive": "#7b7c3a",
  "forest green": "#2f5d3a",
  "khaki": "#c3b091",
  "soft blue": "#b9d2ea",
  "baby blue": "#bcdcf3",
  "light blue": "#add8e6",
  "blue": "#4a7cc4",
  "denim": "#5b7fa6",
  "navy": "#22325a",
  "teal": "#2f8f8a",
  "lilac": "#d9c6e8",
  "lavender": "#cdbfe6",
  "purple": "#8a5aa8",
  "plum": "#7a3e65",
  "warm tan": "#d2a679",
  "tan": "#d2b48c",
  "camel": "#c19a6b",
  "beige": "#e8d9c0",
  "cream": "#f5ecd9",
  "ivory": "#f8f3e6",
  "white": "#ffffff",
  "taupe": "#a89a8c",
  "brown": "#7b5137",
  "chocolate": "#5a3825",
  "grey": "#a3a3a3",
  "gray": "#a3a3a3",
  "light grey": "#d3d3d3",
  "light gray": "#d3d3d3",
  "charcoal": "#45474d",
  "black": "#2b2b2b",
  "silver": "#c7c9cc",
  "gold": "#d4af37"
};

// Fictional community members. Emails use example.com so no real address is ever stored.
// Public members' shared looks appear for everyone; private members' looks only appear for friends.
// "dailyOutfits" are what each member actually wore — only their friends can see these.
const COMMUNITY_MEMBERS = [
  {
    id: "member-maya",
    name: "Maya",
    email: "maya@example.com",
    visibility: "public",
    dailyOutfits: [
      { id: "daily-maya-1", daysAgo: 0, caption: "Rainy errands day. Boots did all the work.", pieces: ["Olive rain jacket", "Black leggings", "Rain boots"], icons: ["🧥", "👖", "🥾"], color: "#e6eee2", likes: 6 },
      { id: "daily-maya-2", daysAgo: 3, caption: "Third wear of this cardigan this week, no regrets.", pieces: ["Cream cardigan", "Grey tee", "White sneakers"], icons: ["🧥", "👚", "👟"], color: "#f6e8df", likes: 4 }
    ]
  },
  {
    id: "member-riley",
    name: "Riley",
    email: "riley@example.com",
    visibility: "public",
    dailyOutfits: [
      { id: "daily-riley-1", daysAgo: 1, caption: "Presentation day, so I went full polished.", pieces: ["Navy blazer", "Striped shirt", "Loafers"], icons: ["🧥", "👚", "👞"], color: "#e5edf5", likes: 9 }
    ]
  },
  {
    id: "member-jules",
    name: "Jules",
    email: "jules@example.com",
    visibility: "public",
    dailyOutfits: [
      { id: "daily-jules-1", daysAgo: 0, caption: "Sweatshirt and the lilac skirt again. It just works.", pieces: ["Grey sweatshirt", "Lilac skirt", "Ballet flats"], icons: ["👚", "🩱", "🥿"], color: "#eee4f1", likes: 7 }
    ]
  },
  {
    id: "member-sam",
    name: "Sam",
    email: "sam@example.com",
    visibility: "public",
    dailyOutfits: [
      { id: "daily-sam-1", daysAgo: 2, caption: "Library all day. Comfort first.", pieces: ["Oversized hoodie", "Joggers", "Canvas bag"], icons: ["👚", "👖", "👜"], color: "#f6e8df", likes: 3 }
    ]
  },
  {
    id: "member-noor",
    name: "Noor",
    email: "noor@example.com",
    visibility: "private",
    dailyOutfits: [
      { id: "daily-noor-1", daysAgo: 0, caption: "Tried the red scarf with the camel coat. Thoughts?", pieces: ["Camel coat", "Red scarf", "Dark jeans"], icons: ["🧥", "🧣", "👖"], color: "#f7e1da", likes: 11 },
      { id: "daily-noor-2", daysAgo: 4, caption: "Lazy Sunday uniform.", pieces: ["Knit sweater", "Wide-leg trousers", "Slippers"], icons: ["👚", "👖", "🥿"], color: "#f7edc9", likes: 5 }
    ]
  },
  {
    id: "member-theo",
    name: "Theo",
    email: "theo@example.com",
    visibility: "private",
    dailyOutfits: [
      { id: "daily-theo-1", daysAgo: 1, caption: "Thrifted this jacket on Saturday, first wear today.", pieces: ["Corduroy jacket", "White tee", "Chinos"], icons: ["🧥", "👕", "👖"], color: "#efe3d3", likes: 8 }
    ]
  }
];

// Looks members shared as inspiration. Visible to everyone if the member is public, or to friends if private.
const COMMUNITY_POSTS = [
  {
    id: "community-maya",
    memberId: "member-maya",
    title: "Soft layers for a cool morning",
    caption: "Cream cardigan, relaxed denim, and my everyday sneakers. Comfy enough for class, cute enough for coffee.",
    pieces: ["Cream cardigan", "Relaxed blue jeans", "White sneakers"],
    icons: ["🧥", "👖", "👟"],
    color: "#f6e8df",
    likes: 24
  },
  {
    id: "community-riley",
    memberId: "member-riley",
    title: "A little color for a long day",
    caption: "I paired a butter-yellow top with my favorite wide-leg trousers. Tiny hoops make it feel finished.",
    pieces: ["Butter-yellow top", "Wide-leg trousers", "Tiny hoops"],
    icons: ["👚", "👖", "✨"],
    color: "#f7edc9",
    likes: 18
  },
  {
    id: "community-jules",
    memberId: "member-jules",
    title: "Weekend skirt, but make it easy",
    caption: "Lilac skirt, soft tee, and ballet flats. One of those outfits that feels like me every time.",
    pieces: ["Lilac skirt", "Soft white tee", "Ballet flats"],
    icons: ["🩱", "👚", "🥿"],
    color: "#eee4f1",
    likes: 31
  },
  {
    id: "community-sam",
    memberId: "member-sam",
    title: "The trusty denim-jacket repeat",
    caption: "A simple day dress gets another life with a denim jacket and a canvas bag.",
    pieces: ["Day dress", "Denim jacket", "Canvas bag"],
    icons: ["👗", "🧥", "👜"],
    color: "#e5edf5",
    likes: 15
  },
  {
    id: "community-noor",
    memberId: "member-noor",
    title: "Camel coat, five ways",
    caption: "My most-worn piece this fall. Sharing my favorite combos with friends.",
    pieces: ["Camel coat", "Black turtleneck", "Ankle boots"],
    icons: ["🧥", "👚", "👢"],
    color: "#f7e1da",
    likes: 12
  },
  {
    id: "community-theo",
    memberId: "member-theo",
    title: "Thrift haul, styled",
    caption: "Everything here was secondhand. Friends asked, so here it is.",
    pieces: ["Corduroy jacket", "Vintage tee", "Chinos"],
    icons: ["🧥", "👕", "👖"],
    color: "#efe3d3",
    likes: 9
  }
];
