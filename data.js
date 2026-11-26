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
