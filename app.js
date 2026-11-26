(function () {
  "use strict";

  const ITEMS_KEY = "petalThreadWardrobeV1";
  const OUTFITS_KEY = "petalThreadOutfitsV1";
  const PROFILES_KEY = "petalThreadProfilesV1";
  const ACTIVE_PROFILE_KEY = "petalThreadActiveProfileV1";
  const HISTORY_KEY = "petalThreadWearHistoryV1";
  const PREFERENCES_KEY = "petalThreadStylePreferencesV1";
  const LIKES_KEY = "petalThreadCommunityLikesV1";
  const SHARED_OUTFITS_KEY = "petalThreadSharedOutfitsV1";
  const FRIENDSHIPS_KEY = "petalThreadFriendshipsV1";
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const WASHABLE = ["Tops", "Bottoms", "Dresses", "Jackets and outerwear"];
  const SLOT_INFO = {
    dress: { label: "Dress", categories: ["Dresses"] },
    top: { label: "Top", categories: ["Tops"] },
    bottom: { label: "Bottom", categories: ["Bottoms"] },
    outerwear: { label: "Layer", categories: ["Jackets and outerwear"] },
    shoes: { label: "Shoes", categories: ["Shoes"] },
    bag: { label: "Bag", categories: ["Bags"] },
    hat: { label: "Hat", categories: ["Hats"] },
    glasses: { label: "Sunnies", categories: ["Sunglasses and glasses"] },
    jewelry: { label: "Jewelry", categories: ["Jewelry"] },
    accessory: { label: "Extra", categories: ["Other accessories"] }
  };
  const SLOT_ORDER = Object.keys(SLOT_INFO);
  const VIBES = ["casual", "romantic", "polished", "cozy", "weekend"];
  const notice = document.getElementById("app-notice");
  let noticeTimer;

  function showNotice(message, isError) {
    notice.textContent = message;
    notice.classList.toggle("notice-error", Boolean(isError));
    notice.hidden = false;
    window.clearTimeout(noticeTimer);
    if (!isError) {
      noticeTimer = window.setTimeout(function () { notice.hidden = true; }, 4200);
    }
  }

  function readStorage(key, fallback) {
    try {
      const saved = localStorage.getItem(key);
      return saved === null ? fallback : JSON.parse(saved);
    } catch (error) {
      showNotice("This browser couldn't read saved closet data. You can still add pieces to start a new closet.", true);
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      showNotice("Your change is visible for now, but this browser couldn't save it. Try a smaller photo or free up browser storage.", true);
      return false;
    }
  }

  function emptyWardrobe() {
    return [];
  }

  function isWashableCategory(category) {
    return WASHABLE.includes(category);
  }

  function normalizeWardrobe(wardrobe) {
    return wardrobe.map(function (item) {
      const washable = isWashableCategory(item.category);
      const needsCleaning = !washable && item.status === "dirty" && item.statusSource !== "manual";
      return Object.assign({}, item, {
        washable: washable,
        status: needsCleaning ? "clean" : item.status,
        statusSource: needsCleaning ? "clean" : item.statusSource
      });
    });
  }

  function profileStorageKey(key, profileId) {
    return key + ":" + encodeURIComponent(profileId);
  }

  function loadWardrobe(profileId) {
    const key = profileStorageKey(ITEMS_KEY, profileId);
    const stored = readStorage(key, emptyWardrobe());
    if (!Array.isArray(stored)) return [];
    const normalized = normalizeWardrobe(stored);
    if (JSON.stringify(normalized) !== JSON.stringify(stored)) writeStorage(key, normalized);
    return normalized;
  }

  let profiles = readStorage(PROFILES_KEY, null);
  if (!Array.isArray(profiles) || !profiles.length) {
    profiles = [];
    const oldItems = readStorage(ITEMS_KEY, null);
    const oldOutfits = readStorage(OUTFITS_KEY, null);
    if ((Array.isArray(oldItems) && oldItems.length) || (Array.isArray(oldOutfits) && oldOutfits.length)) {
      // Keep a closet saved before profiles existed, so it can be attached to an account at sign-in.
      const defaultProfile = { id: "my-closet", name: "My closet" };
      profiles = [defaultProfile];
      writeStorage(profileStorageKey(ITEMS_KEY, defaultProfile.id), Array.isArray(oldItems) ? oldItems : emptyWardrobe());
      writeStorage(profileStorageKey(OUTFITS_KEY, defaultProfile.id), Array.isArray(oldOutfits) ? oldOutfits : []);
      writeStorage(PROFILES_KEY, profiles);
    }
  }
  function normalizeAccount(profile) {
    return Object.assign({}, profile, {
      email: typeof profile.email === "string" ? profile.email.trim().toLowerCase() : "",
      visibility: profile.visibility === "public" ? "public" : "private",
      shareDaily: profile.shareDaily !== false
    });
  }

  profiles = profiles.filter(function (profile) {
    return profile && typeof profile.id === "string" && typeof profile.name === "string";
  }).map(normalizeAccount);

  let friendships = readStorage(FRIENDSHIPS_KEY, []);
  if (!Array.isArray(friendships)) friendships = [];
  friendships = friendships.filter(function (link) {
    return link && typeof link.from === "string" && typeof link.to === "string" &&
      (link.status === "pending" || link.status === "accepted");
  });

  // Signed in means this browser remembers an account that has an email.
  let activeProfileId = readStorage(ACTIVE_PROFILE_KEY, null);
  if (!profiles.some(function (profile) { return profile.id === activeProfileId && profile.email; })) activeProfileId = null;
  const signedInAtStart = Boolean(activeProfileId);

  let items = signedInAtStart ? loadWardrobe(activeProfileId) : [];
  let savedOutfits = signedInAtStart ? readStorage(profileStorageKey(OUTFITS_KEY, activeProfileId), []) : [];
  let wearHistory = signedInAtStart ? readStorage(profileStorageKey(HISTORY_KEY, activeProfileId), []) : [];
  let stylePreferences = signedInAtStart ? readStorage(profileStorageKey(PREFERENCES_KEY, activeProfileId), {}) : {};
  let likedPostIds = signedInAtStart ? readStorage(profileStorageKey(LIKES_KEY, activeProfileId), []) : [];
  let sharedOutfits = signedInAtStart ? readStorage(profileStorageKey(SHARED_OUTFITS_KEY, activeProfileId), []) : [];
  if (!Array.isArray(items)) {
    items = [];
    showNotice("Your saved wardrobe couldn't be read. Add a new item to start a fresh closet.", true);
  }
  if (!Array.isArray(savedOutfits)) {
    savedOutfits = [];
    showNotice("Your saved outfits couldn't be read. You can save new outfits again.", true);
  }
  if (!Array.isArray(wearHistory)) wearHistory = [];
  if (!stylePreferences || typeof stylePreferences !== "object" || Array.isArray(stylePreferences)) stylePreferences = {};
  if (!Array.isArray(likedPostIds)) likedPostIds = [];
  if (!Array.isArray(sharedOutfits)) sharedOutfits = [];
  stylePreferences = Object.assign({ vibe: "", color: "", category: "" }, stylePreferences);

  const dialog = document.getElementById("item-dialog");
  const form = document.getElementById("item-form");
  const fileInput = document.getElementById("item-file");
  const preview = document.getElementById("upload-preview");
  const formError = document.getElementById("form-error");
  let editingId = null;
  let currentImage = "";
  let currentOutfit = null;
  let lockedSlots = {};

  function randomId() {
    return "item-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
  }

  function randomFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function make(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  // Turns what someone typed ("Sage green", "navy", "dark olive", "#f6c9d5") into a colour the page can show.
  function colorToCss(value) {
    const typed = String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
    if (!typed) return "";
    if (COLOR_NAMES[typed]) return COLOR_NAMES[typed];
    if (CSS.supports("color", typed)) return typed;
    if (CSS.supports("color", typed.replace(/ /g, ""))) return typed.replace(/ /g, "");
    // Fall back to the last word we recognise, so "dark olive" or "pale pink" still get a tint.
    const words = typed.split(" ");
    for (let i = words.length - 1; i >= 0; i -= 1) {
      if (COLOR_NAMES[words[i]]) return COLOR_NAMES[words[i]];
      if (/^[a-z]+$/.test(words[i]) && CSS.supports("color", words[i])) return words[i];
    }
    return "";
  }

  // Shows a saved colour code by its name when it's one of ours, so people see words, not codes.
  function colorLabel(value) {
    const saved = String(value || "").trim();
    if (!saved.startsWith("#")) return saved;
    const name = Object.keys(COLOR_NAMES).find(function (key) { return COLOR_NAMES[key].toLowerCase() === saved.toLowerCase(); });
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : saved;
  }

  function updateColorSwatch() {
    const swatch = document.getElementById("item-color-swatch");
    const css = colorToCss(document.getElementById("item-color").value);
    swatch.style.background = css || "";
    swatch.classList.toggle("swatch-unknown", !css);
    swatch.title = css ? "Colour preview" : "We don't recognise that colour yet; the item will use a soft default tint.";
  }

  function setImage(visual, item) {
    const color = colorToCss(item.color) || "#f6c9d5";
    visual.style.setProperty("--item-tint", color);
    if (item.image) {
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.name;
      image.addEventListener("error", function () {
        image.remove();
        visual.classList.add("visual-fallback");
      });
      visual.appendChild(image);
    } else {
      visual.classList.add("visual-fallback");
      visual.appendChild(make("span", "item-emoji", item.icon || "✿"));
    }
  }

  function makeVisual(item, extraClass) {
    const visual = make("div", "item-visual" + (extraClass ? " " + extraClass : ""));
    setImage(visual, item);
    return visual;
  }

  function createActionButton(label, action, itemId, className, pressed) {
    const button = make("button", className || "mini-button", label);
    button.type = "button";
    button.dataset.action = action;
    if (itemId) button.dataset.itemId = itemId;
    if (pressed !== undefined) button.setAttribute("aria-pressed", String(pressed));
    return button;
  }

  function renderItemCard(item, context) {
    const card = make("article", "wardrobe-card");
    card.appendChild(makeVisual(item));
    const details = make("div", "item-details");
    const topLine = make("div", "item-topline");
    topLine.append(make("span", "tag", item.category), make("span", "status-pill " + item.status, item.status === "dirty" ? "Needs cleaning" : "Clean"));
    details.append(topLine, make("h3", "", item.name));
    const location = make("p", "item-location");
    location.append(make("span", "", "⌖ "), document.createTextNode(item.location || "Location not set"));
    details.appendChild(location);
    if (item.productUrl) {
      const productLink = make("a", "product-link", "View product page ↗");
      productLink.href = item.productUrl;
      productLink.target = "_blank";
      productLink.rel = "noopener noreferrer";
      details.appendChild(productLink);
    }
    const actions = make("div", "card-actions");
    actions.appendChild(createActionButton(item.status === "dirty" ? "Mark clean" : "Mark needs cleaning", "toggle-clean", item.id, "mini-button"));
    if (context !== "laundry") {
      actions.append(
        createActionButton("Edit item", "edit-item", item.id, "mini-button edit-button"),
        createActionButton("Delete", "delete-item", item.id, "mini-button mini-danger")
      );
    }
    details.appendChild(actions);
    card.appendChild(details);
    return card;
  }

  function renderWardrobe() {
    const categoryFilter = document.getElementById("category-filter");
    const locationFilter = document.getElementById("location-filter");
    const chosenCategory = categoryFilter.value;
    const chosenLocation = locationFilter.value;
    const categories = CATEGORIES.map(function (category) {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      return option;
    });
    categoryFilter.replaceChildren(categoryFilter.options[0].cloneNode(true), ...categories);
    categoryFilter.value = chosenCategory;

    const locations = Array.from(new Set(items.map(function (item) { return item.location.trim(); }).filter(Boolean))).sort();
    locationFilter.replaceChildren(locationFilter.options[0].cloneNode(true));
    locations.forEach(function (location) {
      const option = document.createElement("option");
      option.value = location;
      option.textContent = location;
      locationFilter.appendChild(option);
    });
    locationFilter.value = locations.indexOf(chosenLocation) !== -1 ? chosenLocation : "";

    const query = document.getElementById("wardrobe-search").value.trim().toLowerCase();
    const matches = items.filter(function (item) {
      const text = (item.name + " " + item.category + " " + item.location).toLowerCase();
      return (!query || text.includes(query)) &&
        (!categoryFilter.value || item.category === categoryFilter.value) &&
        (!locationFilter.value || item.location === locationFilter.value);
    });
    document.getElementById("wardrobe-grid").replaceChildren.apply(
      document.getElementById("wardrobe-grid"),
      matches.map(function (item) { return renderItemCard(item, "wardrobe"); })
    );
    document.getElementById("wardrobe-count").textContent =
      matches.length + (matches.length === 1 ? " lovely piece" : " lovely pieces") +
      (matches.length === items.length ? " in your closet" : " matching your filters");
    document.getElementById("wardrobe-empty").hidden = matches.length > 0;
  }

  function drawOutfit() {
    const board = document.getElementById("outfit-board");
    board.replaceChildren();
    if (!currentOutfit) {
      const empty = make("div", "generator-empty");
      empty.append(make("span", "", "✧"), make("h2", "", "Your next favorite outfit is waiting"), make("p", "", "Add a few clean pieces to your wardrobe, then tap Surprise me."));
      board.appendChild(empty);
      return;
    }
    const collage = make("div", "outfit-collage");
    SLOT_ORDER.forEach(function (slot) {
      const item = currentOutfit.slots[slot];
      if (!item) return;
      const card = make("article", "outfit-piece outfit-piece-" + slot);
      card.appendChild(makeVisual(item, "outfit-visual"));
      const info = make("div", "outfit-piece-info");
      info.append(make("span", "tag", SLOT_INFO[slot].label), make("h3", "", item.name));
      info.appendChild(make("p", "item-location", "⌖ " + (item.location || "Location not set")));
      const actions = make("div", "outfit-piece-actions");
      const isLocked = Boolean(lockedSlots[slot]);
      actions.append(
        createActionButton(isLocked ? "🔒 Locked" : "♡ Lock", "lock-slot", slot, "mini-button lock-button", isLocked),
        createActionButton("Swap ↻", "swap-slot", slot, "mini-button")
      );
      info.appendChild(actions);
      card.appendChild(info);
      collage.appendChild(card);
    });
    board.appendChild(collage);
    const actions = make("div", "outfit-actions");
    actions.append(
      createActionButton("Wear this outfit", "wear-current", "", "button button-soft"),
      createActionButton("Save this look ♡", "save-outfit", "", "button"),
      createActionButton("New outfit", "generate", "", "text-button")
    );
    board.appendChild(actions);
  }

  function renderSaved() {
    const grid = document.getElementById("saved-grid");
    grid.replaceChildren();
    savedOutfits.forEach(function (outfit, index) {
      const card = make("article", "saved-card");
      const head = make("div", "saved-card-heading");
      head.append(make("div", "", "✧"), make("button", "icon-button", "×"));
      head.lastChild.type = "button";
      head.lastChild.setAttribute("aria-label", "Delete saved outfit");
      head.lastChild.dataset.action = "delete-saved";
      head.lastChild.dataset.index = String(index);
      const title = make("h2", "", outfit.name || "A little outfit magic");
      const date = make("p", "muted saved-date", outfit.date ? "Saved " + outfit.date : "Saved for a lovely day");
      const minis = make("div", "saved-mini-grid");
      SLOT_ORDER.forEach(function (slot) {
        const item = outfit.slots && outfit.slots[slot];
        if (!item) return;
        const mini = make("div", "saved-mini-item");
        mini.appendChild(makeVisual(item, "saved-mini-visual"));
        mini.appendChild(make("span", "", item.name));
        mini.appendChild(make("small", "", "⌖ " + (item.location || "Location not set")));
        minis.appendChild(mini);
      });
      const wear = createActionButton("Mark outfit worn", "wear-saved", "", "button button-soft");
      wear.dataset.index = String(index);
      const alreadyShared = sharedOutfits.some(function (post) { return post.sourceOutfitId === outfit.id; });
      const share = createActionButton(
        alreadyShared ? "Shared ✓" : activeAccount().visibility === "public" ? "Share publicly" : "Share with friends",
        "share-saved",
        "",
        "mini-button share-button"
      );
      share.dataset.index = String(index);
      share.disabled = alreadyShared;
      const cardActions = make("div", "saved-card-actions");
      cardActions.append(wear, share);
      card.append(head, title, date, minis, cardActions);
      grid.appendChild(card);
    });
    document.getElementById("saved-empty").hidden = savedOutfits.length > 0;
  }

  function renderInsights() {
    const dirty = items.filter(function (item) { return item.status === "dirty"; }).length;
    document.getElementById("insight-total").textContent = String(items.length);
    document.getElementById("insight-clean").textContent = String(items.length - dirty);
    document.getElementById("insight-dirty").textContent = String(dirty);
    document.getElementById("insight-saved").textContent = String(savedOutfits.length);

    function renderRanking(elementId, rankedItems, formatCount) {
      const list = document.getElementById(elementId);
      list.replaceChildren();
      rankedItems.slice(0, 3).forEach(function (item) {
        const row = make("li", "ranked-item");
        row.append(make("span", "", item.name), make("strong", "", formatCount(item)));
        list.appendChild(row);
      });
    }

    const mostWorn = items.filter(function (item) { return Number(item.wearCount) > 0; })
      .sort(function (a, b) { return Number(b.wearCount) - Number(a.wearCount); });
    const leastWorn = items.slice().sort(function (a, b) {
      return (Number(a.wearCount) || 0) - (Number(b.wearCount) || 0);
    });
    renderRanking("most-worn-list", mostWorn, function (item) {
      return item.wearCount + (Number(item.wearCount) === 1 ? " wear" : " wears");
    });
    renderRanking("least-worn-list", leastWorn, function (item) {
      return (Number(item.wearCount) || 0) + " wears";
    });
    document.getElementById("most-worn-empty").hidden = mostWorn.length > 0;
    document.getElementById("least-worn-empty").hidden = leastWorn.length > 0;
  }

  function renderStyleProfile() {
    const vibeSelect = document.getElementById("preference-vibe");
    const categorySelect = document.getElementById("preference-category");
    vibeSelect.value = stylePreferences.vibe || "";
    categorySelect.value = stylePreferences.category || "";
    document.getElementById("preference-color").value = stylePreferences.color || "";

    const preferenceCount = ["vibe", "color", "category"].filter(function (key) {
      return Boolean(stylePreferences[key]);
    }).length;
    const detailCount = items.length + wearHistory.length * 2 + savedOutfits.length + preferenceCount;
    const progress = Math.min(100, detailCount * 8);
    const stage = detailCount >= 12 ? "Your style is taking shape" :
      detailCount >= 5 ? "Spotting your favorites" :
      detailCount > 0 ? "Getting to know your closet" : "A fresh start";
    document.getElementById("style-stage").textContent = stage;
    document.getElementById("style-signal-count").textContent = detailCount + (detailCount === 1 ? " style detail" : " style details");
    document.getElementById("style-summary").textContent = detailCount >= 12
      ? "Your closet, choices, and outfit history are building a useful picture of what feels like you."
      : detailCount >= 5
        ? "Your saved looks and preferences are starting to reveal patterns you can use when planning."
        : "Add pieces, set a preference, and log outfits to build a helpful personal style profile.";
    document.getElementById("style-progress").style.width = progress + "%";
    document.getElementById("memory-track").setAttribute("aria-valuenow", String(progress));
    document.getElementById("style-next-step").textContent = detailCount >= 12
      ? "Your style memory is growing with every outfit you wear."
      : "Add " + Math.max(1, Math.ceil((12 - detailCount) / 2)) + " more style details to deepen your profile.";
    const wornByCategory = {};
    items.forEach(function (item) {
      wornByCategory[item.category] = (wornByCategory[item.category] || 0) + (Number(item.wearCount) || 0);
    });
    const favoriteCategory = Object.keys(wornByCategory).sort(function (a, b) {
      return wornByCategory[b] - wornByCategory[a];
    })[0];
    document.getElementById("style-favorite-category").textContent =
      stylePreferences.category || (favoriteCategory && wornByCategory[favoriteCategory] > 0 ? favoriteCategory : "Noticed over time");
    document.getElementById("style-favorite-color").textContent =
      stylePreferences.color || (favoriteCategory ? "Choose a color you love" : "Noticed over time");
    document.getElementById("style-worn-count").textContent = String(wearHistory.length);

    const historyList = document.getElementById("wear-history-list");
    historyList.replaceChildren();
    wearHistory.slice(0, 5).forEach(function (entry) {
      const row = make("li", "history-entry");
      const description = (entry.itemNames || []).slice(0, 4).join(" · ") || "A saved closet look";
      row.append(make("strong", "", entry.date || "Recently worn"), make("span", "", description));
      if (entry.vibe) row.appendChild(make("small", "", "Mood: " + entry.vibe));
      historyList.appendChild(row);
    });
    document.getElementById("wear-history-empty").hidden = wearHistory.length > 0;
  }

  function activeAccount() {
    return profiles.find(function (profile) { return profile.id === activeProfileId; }) || null;
  }

  function memberById(id) {
    return COMMUNITY_MEMBERS.find(function (member) { return member.id === id; }) || null;
  }

  // A "person" is either a fictional member from data.js or an account made on this browser.
  function personById(id) {
    const member = memberById(id);
    if (member) return { id: member.id, name: member.name, email: member.email, visibility: member.visibility, fictional: true };
    const account = profiles.find(function (profile) { return profile.id === id; });
    return account ? { id: account.id, name: account.name, email: account.email, visibility: account.visibility, fictional: false } : null;
  }

  function personByEmail(email) {
    const wanted = email.trim().toLowerCase();
    const member = COMMUNITY_MEMBERS.find(function (entry) { return entry.email === wanted; });
    if (member) return personById(member.id);
    const account = profiles.find(function (profile) { return profile.email && profile.email === wanted; });
    return account ? personById(account.id) : null;
  }

  function friendshipBetween(a, b) {
    return friendships.find(function (link) {
      return (link.from === a && link.to === b) || (link.from === b && link.to === a);
    }) || null;
  }

  function areFriends(a, b) {
    const link = friendshipBetween(a, b);
    return Boolean(link && link.status === "accepted");
  }

  function friendIdsOf(id) {
    return friendships.filter(function (link) {
      return link.status === "accepted" && (link.from === id || link.to === id);
    }).map(function (link) { return link.from === id ? link.to : link.from; })
      .filter(function (otherId) { return Boolean(personById(otherId)); });
  }

  function saveFriendships() {
    return writeStorage(FRIENDSHIPS_KEY, friendships);
  }

  function relativeDay(time) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const days = Math.max(0, Math.ceil((startOfToday.getTime() - time) / 86400000));
    if (time >= startOfToday.getTime()) return "Today";
    if (days <= 1) return "Yesterday";
    if (days < 7) return days + " days ago";
    return new Date(time).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function inspirationPosts() {
    const posts = [];
    profiles.forEach(function (account) {
      const isMe = account.id === activeProfileId;
      if (!isMe && account.visibility !== "public" && !areFriends(activeProfileId, account.id)) return;
      const shares = isMe ? sharedOutfits : readStorage(profileStorageKey(SHARED_OUTFITS_KEY, account.id), []);
      if (!Array.isArray(shares)) return;
      shares.forEach(function (post) {
        posts.push(Object.assign({}, post, { name: account.name, audience: account.visibility, own: isMe }));
      });
    });
    COMMUNITY_POSTS.forEach(function (post) {
      const member = memberById(post.memberId);
      if (!member) return;
      if (member.visibility !== "public" && !areFriends(activeProfileId, member.id)) return;
      posts.push(Object.assign({}, post, { name: member.name, audience: member.visibility, own: false }));
    });
    return posts;
  }

  function friendDailyPosts() {
    const posts = [];
    friendIdsOf(activeProfileId).forEach(function (friendId) {
      const member = memberById(friendId);
      if (member) {
        (member.dailyOutfits || []).forEach(function (outfit) {
          posts.push(Object.assign({}, outfit, {
            name: member.name,
            time: Date.now() - (Number(outfit.daysAgo) || 0) * 86400000,
            audience: "friends"
          }));
        });
        return;
      }
      const account = profiles.find(function (profile) { return profile.id === friendId; });
      if (!account || !account.shareDaily) return;
      const history = readStorage(profileStorageKey(HISTORY_KEY, account.id), []);
      if (!Array.isArray(history)) return;
      history.filter(function (entry) { return entry && entry.id && entry.sharedWithFriends; }).forEach(function (entry) {
        posts.push({
          id: entry.id,
          name: account.name,
          caption: entry.vibe ? "Feeling " + entry.vibe + " today." : "Today's closet pick.",
          pieces: entry.itemNames || [],
          icons: entry.icons || [],
          color: entry.color,
          likes: 0,
          time: Number(entry.time) || Date.now(),
          audience: "friends"
        });
      });
    });
    return posts.sort(function (a, b) { return b.time - a.time; });
  }

  function renderPostCard(post, kind) {
    const card = make("article", "community-post");
    const heading = make("div", "community-author");
    const avatar = make("span", "community-avatar", post.name.slice(0, 1));
    avatar.setAttribute("aria-hidden", "true");
    heading.append(avatar, make("div", "", post.name + (post.own ? " (you)" : "")));
    const badgeText = kind === "daily" ? "Friends only" : post.audience === "public" ? "Public" : "Friends only";
    heading.appendChild(make("span", "audience-tag" + (badgeText === "Public" ? " audience-public" : ""), badgeText));
    const art = make("div", "community-art");
    art.style.backgroundColor = post.color && CSS.supports("color", post.color) ? post.color : "#f6e8df";
    (post.icons || []).slice(0, 4).forEach(function (icon) {
      art.appendChild(make("span", "community-piece-icon", icon));
    });
    const text = make("div", "community-post-copy");
    text.append(make("h2", "", kind === "daily" ? "Wore this · " + relativeDay(post.time) : post.title), make("p", "", post.caption));
    const labels = make("div", "community-piece-labels");
    (post.pieces || []).forEach(function (piece) {
      labels.appendChild(make("span", "tag", piece));
    });
    const liked = likedPostIds.includes(post.id);
    const like = createActionButton(
      (liked ? "♥ Liked · " : "♡ Like · ") + ((Number(post.likes) || 0) + (liked ? 1 : 0)),
      "toggle-like",
      "",
      "mini-button like-button",
      liked
    );
    like.dataset.postId = post.id;
    card.append(heading, art, text, labels, like);
    return card;
  }

  function renderCommunity() {
    const grid = document.getElementById("community-grid");
    grid.replaceChildren.apply(grid, inspirationPosts().map(function (post) { return renderPostCard(post, "inspo"); }));

    const daily = friendDailyPosts();
    const dailyGrid = document.getElementById("friends-feed-grid");
    dailyGrid.replaceChildren.apply(dailyGrid, daily.map(function (post) { return renderPostCard(post, "daily"); }));
    document.getElementById("friends-feed-empty").hidden = daily.length > 0;
    document.getElementById("friends-feed-empty-text").textContent = friendIdsOf(activeProfileId).length
      ? "Your friends haven't shared any outfits yet. Check back after they get dressed!"
      : "Add friends to see what they're wearing each day.";
  }

  function personRow(person, buttons, note) {
    const row = make("li", "person-row");
    const avatar = make("span", "community-avatar", person.name.slice(0, 1));
    avatar.setAttribute("aria-hidden", "true");
    const info = make("div", "person-info");
    info.append(make("strong", "", person.name), make("small", "", note || person.email || "No email yet"));
    const tag = make("span", "audience-tag" + (person.visibility === "public" ? " audience-public" : ""), person.visibility === "public" ? "Public" : "Private");
    const actions = make("div", "person-actions");
    buttons.forEach(function (button) { actions.appendChild(button); });
    row.append(avatar, info, tag, actions);
    return row;
  }

  function personButton(label, action, personId, className) {
    const button = createActionButton(label, action, "", className || "mini-button");
    button.dataset.personId = personId;
    return button;
  }

  function renderFriends() {
    const account = activeAccount();
    if (!account) return;
    document.getElementById("account-heading").textContent = account.name;
    document.getElementById("account-name").value = account.name;
    document.getElementById("account-email").value = account.email;
    document.getElementById("account-email-help").textContent = account.email
      ? "Friends find you by this email."
      : "Add an email so friends can find you.";
    document.querySelectorAll('input[name="account-visibility"]').forEach(function (radio) {
      radio.checked = radio.value === account.visibility;
    });
    document.getElementById("account-share-daily").checked = account.shareDaily;

    const me = account.id;
    const incoming = friendships.filter(function (link) { return link.status === "pending" && link.to === me && personById(link.from); });
    const outgoing = friendships.filter(function (link) { return link.status === "pending" && link.from === me && personById(link.to); });
    const friendIds = friendIdsOf(me);

    function fill(listId, emptyId, rows) {
      const list = document.getElementById(listId);
      list.replaceChildren.apply(list, rows);
      document.getElementById(emptyId).hidden = rows.length > 0;
    }

    fill("incoming-list", "incoming-empty", incoming.map(function (link) {
      const person = personById(link.from);
      return personRow(person, [
        personButton("Accept", "accept-friend", person.id, "mini-button accept-button"),
        personButton("Decline", "decline-friend", person.id, "mini-button mini-danger")
      ], "Wants to be friends");
    }));
    fill("outgoing-list", "outgoing-empty", outgoing.map(function (link) {
      const person = personById(link.to);
      return personRow(person, [personButton("Cancel", "cancel-request", person.id)], "Waiting for them to accept");
    }));
    fill("friends-list", "friends-empty", friendIds.map(function (id) {
      return personRow(personById(id), [personButton("Remove", "remove-friend", id, "mini-button mini-danger")]);
    }));
    document.getElementById("friend-total").textContent = String(friendIds.length);

    const suggestions = COMMUNITY_MEMBERS.map(function (member) { return personById(member.id); })
      .concat(profiles.filter(function (profile) { return profile.id !== me && profile.email; }).map(function (profile) { return personById(profile.id); }))
      .filter(function (person) { return !friendshipBetween(me, person.id); });
    fill("suggested-list", "suggested-empty", suggestions.map(function (person) {
      return personRow(person, [personButton("Add friend", "add-friend", person.id, "mini-button accept-button")],
        person.fictional ? "Fictional member" : "Account on this browser");
    }));

    const requestCount = incoming.length;
    ["request-count", "request-count-badge"].forEach(function (id) {
      const badge = document.getElementById(id);
      badge.textContent = requestCount > 9 ? "9+" : String(requestCount);
      badge.hidden = requestCount === 0;
    });
  }

  function sendFriendRequest(personId) {
    const person = personById(personId);
    const me = activeProfileId;
    if (!person || person.id === me) return;
    const existing = friendshipBetween(me, person.id);
    if (existing && existing.status === "accepted") {
      showNotice("You and " + person.name + " are already friends.", false);
      return;
    }
    if (existing && existing.to === me) {
      respondToRequest(person.id, true);
      return;
    }
    if (existing) {
      showNotice("Your request to " + person.name + " is still waiting.", false);
      return;
    }
    friendships.push({
      id: randomId(),
      from: me,
      to: person.id,
      status: person.fictional ? "accepted" : "pending",
      time: Date.now()
    });
    const persisted = saveFriendships();
    renderFriends();
    renderCommunity();
    if (!persisted) return;
    showNotice(person.fictional
      ? person.name + " accepted your request (fictional members accept right away). Their everyday outfits are now in your feed."
      : "Request sent to " + person.name + ". Switch to their account to accept it.", false);
  }

  function respondToRequest(personId, accept) {
    const link = friendships.find(function (entry) {
      return entry.status === "pending" && entry.from === personId && entry.to === activeProfileId;
    });
    if (!link) return;
    if (accept) link.status = "accepted";
    else friendships = friendships.filter(function (entry) { return entry !== link; });
    const persisted = saveFriendships();
    renderFriends();
    renderCommunity();
    const person = personById(personId);
    if (persisted && person) {
      showNotice(accept ? "You and " + person.name + " are now friends." : "Request from " + person.name + " declined.", false);
    }
  }

  function removeConnection(personId, message) {
    const link = friendshipBetween(activeProfileId, personId);
    if (!link) return;
    friendships = friendships.filter(function (entry) { return entry !== link; });
    const persisted = saveFriendships();
    renderFriends();
    renderCommunity();
    if (persisted) showNotice(message, false);
  }

  function renderLaundry() {
    const dirty = items.filter(function (item) { return item.status === "dirty"; });
    const grid = document.getElementById("laundry-grid");
    grid.replaceChildren.apply(grid, dirty.map(function (item) { return renderItemCard(item, "laundry"); }));
    document.getElementById("laundry-empty").hidden = dirty.length > 0;
    document.getElementById("clean-all").disabled = dirty.length === 0;
    document.getElementById("laundry-summary").textContent = dirty.length
      ? dirty.length + (dirty.length === 1 ? " piece is ready" : " pieces are ready") + " for a refresh."
      : "Your laundry basket is empty — enjoy the fresh start!";
  }

  function updateCount() {
    const dirtyCount = items.filter(function (item) { return item.status === "dirty"; }).length;
    document.getElementById("laundry-count").textContent = dirtyCount > 9 ? "9+" : String(dirtyCount);
  }

  function renderProfiles() {
    const select = document.getElementById("profile-select");
    select.replaceChildren.apply(select, profiles.filter(function (profile) { return profile.email; }).map(function (profile) {
      const option = document.createElement("option");
      option.value = profile.id;
      option.textContent = profile.name;
      return option;
    }));
    select.value = activeProfileId;
  }

  function isSignedIn() {
    return Boolean(activeAccount());
  }

  function updateSignedInState() {
    document.body.classList.toggle("signed-out", !isSignedIn());
  }

  // Opens the sign-in box. When nobody is signed in it can't be dismissed.
  function openSignIn() {
    const dialogBox = document.getElementById("profile-dialog");
    const required = !isSignedIn();
    document.getElementById("profile-form").reset();
    document.getElementById("profile-error").hidden = true;
    document.getElementById("close-profile-dialog").hidden = required;
    document.getElementById("cancel-profile-dialog").hidden = required;
    document.getElementById("profile-dialog-eyebrow").textContent = required ? "Welcome to Personal Fashion Show" : "Switch or add an account";
    const unclaimed = profiles.filter(function (profile) { return !profile.email; });
    const claimSelect = document.getElementById("claim-profile");
    claimSelect.replaceChildren(new Option("Start a new, empty closet", ""));
    unclaimed.forEach(function (profile) { claimSelect.appendChild(new Option("Keep my saved closet: " + profile.name, profile.id)); });
    document.getElementById("claim-wrap").hidden = unclaimed.length === 0;
    if (!dialogBox.open) dialogBox.showModal();
    document.getElementById("signin-email").focus();
  }

  function signOut() {
    const account = activeAccount();
    if (!account) return;
    writeStorage(ACTIVE_PROFILE_KEY, null);
    // Reload so nothing from the signed-out account stays on the page.
    window.location.hash = "#home";
    window.location.reload();
  }

  function switchProfile(profileId, silent) {
    const profile = profiles.find(function (entry) { return entry.id === profileId; });
    if (!profile || profile.id === activeProfileId) return false;
    activeProfileId = profile.id;
    const persisted = writeStorage(ACTIVE_PROFILE_KEY, activeProfileId);
    items = loadWardrobe(activeProfileId);
    savedOutfits = readStorage(profileStorageKey(OUTFITS_KEY, activeProfileId), []);
    wearHistory = readStorage(profileStorageKey(HISTORY_KEY, activeProfileId), []);
    stylePreferences = readStorage(profileStorageKey(PREFERENCES_KEY, activeProfileId), {});
    likedPostIds = readStorage(profileStorageKey(LIKES_KEY, activeProfileId), []);
    sharedOutfits = readStorage(profileStorageKey(SHARED_OUTFITS_KEY, activeProfileId), []);
    if (!Array.isArray(items)) items = [];
    if (!Array.isArray(savedOutfits)) savedOutfits = [];
    if (!Array.isArray(wearHistory)) wearHistory = [];
    if (!Array.isArray(likedPostIds)) likedPostIds = [];
    if (!Array.isArray(sharedOutfits)) sharedOutfits = [];
    if (!stylePreferences || typeof stylePreferences !== "object" || Array.isArray(stylePreferences)) stylePreferences = {};
    stylePreferences = Object.assign({ vibe: "", color: "", category: "" }, stylePreferences);
    currentOutfit = null;
    lockedSlots = {};
    updateSignedInState();
    renderAll();
    generateOutfit(true);
    if (!silent) {
      showNotice(persisted ? "Switched to " + profile.name + "'s closet." : "Switched profiles, but this browser couldn't remember the selection.", !persisted);
    }
    return persisted;
  }

  function showFieldError(id, message) {
    const error = document.getElementById(id);
    error.textContent = message;
    error.hidden = false;
  }

  function signInOrCreate(event) {
    event.preventDefault();
    const email = document.getElementById("signin-email").value.trim().toLowerCase();
    const name = document.getElementById("profile-name").value.trim();
    const chosen = document.querySelector('input[name="signin-visibility"]:checked');
    document.getElementById("profile-error").hidden = true;
    if (!EMAIL_PATTERN.test(email)) {
      showFieldError("profile-error", "Enter an email like yourname@example.com.");
      return;
    }
    if (COMMUNITY_MEMBERS.some(function (member) { return member.email === email; })) {
      showFieldError("profile-error", "That email belongs to a fictional demo member. Try a different made-up email.");
      return;
    }
    const existing = profiles.find(function (profile) { return profile.email === email; });
    if (existing) {
      if (existing.id === activeProfileId) showNotice("You're already signed in as " + existing.name + ".", false);
      else switchProfile(existing.id, true) && showNotice("Welcome back, " + existing.name + "!", false);
      document.getElementById("profile-dialog").close();
      return;
    }
    const claimId = document.getElementById("claim-wrap").hidden ? "" : document.getElementById("claim-profile").value;
    const claimed = claimId && profiles.find(function (profile) { return profile.id === claimId && !profile.email; });
    if (claimed) {
      const newName = name || claimed.name;
      if (profiles.some(function (profile) { return profile.id !== claimed.id && profile.name.toLowerCase() === newName.toLowerCase(); })) {
        showFieldError("profile-error", "That display name is already used on this browser. Try a different one.");
        return;
      }
      profiles = profiles.map(function (profile) {
        return profile.id !== claimed.id ? profile : normalizeAccount(Object.assign({}, profile, {
          name: newName,
          email: email,
          visibility: chosen ? chosen.value : "private"
        }));
      });
      const claimSaved = writeStorage(PROFILES_KEY, profiles);
      const claimSwitched = switchProfile(claimed.id, true);
      document.getElementById("profile-dialog").close();
      showNotice(claimSaved && claimSwitched
        ? "Welcome, " + newName + "! Your saved closet is now linked to " + email + "."
        : "You're signed in, but this browser couldn't save everything. Check browser storage and try again.", !(claimSaved && claimSwitched));
      return;
    }
    if (!name) {
      showFieldError("profile-error", "No account uses that email yet. Add a display name to create one.");
      document.getElementById("profile-name").focus();
      return;
    }
    if (profiles.some(function (profile) { return profile.name.toLowerCase() === name.toLowerCase(); })) {
      showFieldError("profile-error", "That display name is already used on this browser. Try a different one.");
      return;
    }
    const profile = normalizeAccount({
      id: randomId(),
      name: name,
      email: email,
      visibility: chosen ? chosen.value : "private",
      shareDaily: true
    });
    profiles.push(profile);
    const profilesSaved = writeStorage(PROFILES_KEY, profiles);
    const itemsSaved = writeStorage(profileStorageKey(ITEMS_KEY, profile.id), emptyWardrobe());
    const outfitsSaved = writeStorage(profileStorageKey(OUTFITS_KEY, profile.id), []);
    const historySaved = writeStorage(profileStorageKey(HISTORY_KEY, profile.id), []);
    const preferencesSaved = writeStorage(profileStorageKey(PREFERENCES_KEY, profile.id), {});
    const likesSaved = writeStorage(profileStorageKey(LIKES_KEY, profile.id), []);
    const sharesSaved = writeStorage(profileStorageKey(SHARED_OUTFITS_KEY, profile.id), []);
    const activeProfileSaved = switchProfile(profile.id, true);
    document.getElementById("profile-dialog").close();
    const saved = profilesSaved && itemsSaved && outfitsSaved && historySaved &&
      preferencesSaved && likesSaved && sharesSaved && activeProfileSaved;
    showNotice(saved
      ? "Welcome, " + profile.name + "! Your " + profile.visibility + " account is ready. Add pieces or find friends whenever you like."
      : "This account is available now, but the browser couldn't save all of it. Check browser storage and try again.", !saved);
  }

  function saveAccountSettings(event) {
    event.preventDefault();
    document.getElementById("account-error").hidden = true;
    const account = activeAccount();
    const name = document.getElementById("account-name").value.trim();
    const email = document.getElementById("account-email").value.trim().toLowerCase();
    const chosen = document.querySelector('input[name="account-visibility"]:checked');
    if (!name) {
      showFieldError("account-error", "Add a display name.");
      return;
    }
    if (profiles.some(function (profile) { return profile.id !== account.id && profile.name.toLowerCase() === name.toLowerCase(); })) {
      showFieldError("account-error", "Another account on this browser already uses that name.");
      return;
    }
    if (email && !EMAIL_PATTERN.test(email)) {
      showFieldError("account-error", "Enter an email like yourname@example.com, or leave it blank.");
      return;
    }
    if (email && personByEmail(email) && personByEmail(email).id !== account.id) {
      showFieldError("account-error", "That email is already used by another account.");
      return;
    }
    const visibilityChanged = chosen && chosen.value !== account.visibility;
    profiles = profiles.map(function (profile) {
      if (profile.id !== account.id) return profile;
      return normalizeAccount(Object.assign({}, profile, {
        name: name,
        email: email,
        visibility: chosen ? chosen.value : profile.visibility,
        shareDaily: document.getElementById("account-share-daily").checked
      }));
    });
    const persisted = writeStorage(PROFILES_KEY, profiles);
    renderProfiles();
    renderFriends();
    renderCommunity();
    renderSaved();
    if (!persisted) return;
    const updated = activeAccount();
    showNotice(visibilityChanged
      ? (updated.visibility === "public"
        ? "Your account is now public. Looks you share can inspire everyone."
        : "Your account is now private. Only friends can see the looks you share.")
      : "Account saved.", false);
  }

  function renderAll() {
    renderProfiles();
    renderFriends();
    renderWardrobe();
    renderSaved();
    renderLaundry();
    renderInsights();
    renderStyleProfile();
    renderCommunity();
    drawOutfit();
    updateCount();
  }

  function reconcileCurrentOutfit() {
    if (!currentOutfit) return;
    let needsNewOutfit = false;
    SLOT_ORDER.forEach(function (slot) {
      const currentItem = currentOutfit.slots[slot];
      if (!currentItem) return;
      const latestItem = items.find(function (item) { return item.id === currentItem.id; });
      if (!latestItem || latestItem.status !== "clean" ||
          !SLOT_INFO[slot].categories.includes(latestItem.category)) {
        delete currentOutfit.slots[slot];
        lockedSlots[slot] = false;
        needsNewOutfit = true;
      } else {
        currentOutfit.slots[slot] = latestItem;
      }
    });
    if (needsNewOutfit) generateOutfit(true);
  }

  function showView() {
    const requested = (window.location.hash || "#home").slice(1);
    const views = Array.from(document.querySelectorAll("[data-view]"));
    const current = views.some(function (view) { return view.id === requested; }) ? requested : "home";
    views.forEach(function (view) { view.hidden = view.id !== current; });
    document.querySelectorAll("nav a").forEach(function (link) {
      if (link.getAttribute("href") === "#" + current) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    window.scrollTo(0, 0);
  }

  function categoryItem(category, vibe, excludedId) {
    const candidates = items.filter(function (item) {
      return item.category === category && item.status === "clean" && item.id !== excludedId;
    });
    const preferredColor = (stylePreferences.color || "").trim().toLowerCase();
    const matchingColor = preferredColor ? candidates.filter(function (item) {
      return colorLabel(item.color).toLowerCase().includes(preferredColor) ||
        (colorToCss(preferredColor) && colorToCss(item.color) === colorToCss(preferredColor));
    }) : [];
    const colorCandidates = matchingColor.length ? matchingColor : candidates;
    const styled = colorCandidates.filter(function (item) { return (item.vibes || []).indexOf(vibe) !== -1; });
    return randomFrom(styled.length ? styled : colorCandidates);
  }

  function generateOutfit(silent) {
    const clean = items.filter(function (item) { return item.status === "clean"; });
    const canSeparate = clean.some(function (item) { return item.category === "Tops"; }) &&
      clean.some(function (item) { return item.category === "Bottoms"; });
    const canDress = clean.some(function (item) { return item.category === "Dresses"; });
    const lockedDress = lockedSlots.dress && currentOutfit && currentOutfit.slots.dress &&
      clean.some(function (item) { return item.id === currentOutfit.slots.dress.id; });
    const lockedSeparates = (lockedSlots.top || lockedSlots.bottom) && currentOutfit &&
      ((lockedSlots.top && currentOutfit.slots.top && clean.some(function (item) { return item.id === currentOutfit.slots.top.id; })) ||
       (lockedSlots.bottom && currentOutfit.slots.bottom && clean.some(function (item) { return item.id === currentOutfit.slots.bottom.id; })));
    let mode = lockedDress ? "dress" : lockedSeparates ? "separates" :
      canDress && (!canSeparate || Math.random() < 0.3) ? "dress" : "separates";
    if (!lockedDress && !lockedSeparates) {
      if (stylePreferences.category === "Dresses" && canDress) mode = "dress";
      if (["Tops", "Bottoms"].includes(stylePreferences.category) && canSeparate) mode = "separates";
    }
    if (mode === "dress" && !canDress && !lockedDress) mode = "separates";
    if (mode === "separates" && !canSeparate && !lockedSeparates) mode = "dress";

    const required = mode === "dress" ? ["dress", "shoes"] : ["top", "bottom", "shoes"];
    if (required.some(function (slot) {
      return !clean.some(function (item) { return SLOT_INFO[slot].categories.includes(item.category); });
    })) {
      currentOutfit = null;
      drawOutfit();
      if (!silent) showNotice("Add clean pieces from a top-and-bottom outfit or a dress, plus shoes, to make a complete look.", false);
      return;
    }

    const vibe = stylePreferences.vibe || randomFrom(VIBES);
    const slots = {};
    required.forEach(function (slot) {
      const old = currentOutfit && currentOutfit.slots[slot];
      const locked = lockedSlots[slot] && old && old.status === "clean" &&
        SLOT_INFO[slot].categories.includes(old.category);
      slots[slot] = locked ? old : categoryItem(SLOT_INFO[slot].categories[0], vibe);
    });
    ["outerwear", "bag", "hat", "glasses", "jewelry", "accessory"].forEach(function (slot) {
      const old = currentOutfit && currentOutfit.slots[slot];
      const locked = lockedSlots[slot] && old && old.status === "clean" &&
        SLOT_INFO[slot].categories.includes(old.category);
      if (locked) slots[slot] = old;
      else if (Math.random() < (slot === "outerwear" ? 0.52 : 0.38)) {
        const item = categoryItem(SLOT_INFO[slot].categories[0], vibe);
        if (item) slots[slot] = item;
      }
    });
    currentOutfit = { mode: mode, vibe: vibe, slots: slots };
    drawOutfit();
    if (!silent) showNotice("A fresh little look, coming right up!", false);
  }

  function swapSlot(slot) {
    if (!currentOutfit || !currentOutfit.slots[slot]) return;
    const previous = currentOutfit.slots[slot];
    const categories = SLOT_INFO[slot].categories;
    const candidates = items.filter(function (item) {
      return categories.includes(item.category) && item.status === "clean" && item.id !== previous.id;
    });
    if (!candidates.length) {
      showNotice("Add another clean " + SLOT_INFO[slot].label.toLowerCase() + " to swap this piece.", false);
      return;
    }
    const styled = candidates.filter(function (item) { return (item.vibes || []).includes(currentOutfit.vibe); });
    currentOutfit.slots[slot] = randomFrom(styled.length ? styled : candidates);
    lockedSlots[slot] = false;
    drawOutfit();
  }

  function snapshotOutfit(outfit) {
    const slots = {};
    SLOT_ORDER.forEach(function (slot) {
      if (outfit.slots[slot]) slots[slot] = Object.assign({}, outfit.slots[slot]);
    });
    return { mode: outfit.mode, vibe: outfit.vibe, slots: slots };
  }

  function iconForItem(item) {
    if (item.icon && item.icon !== "✿") return item.icon;
    const icons = {
      "Tops": "👚",
      "Bottoms": "👖",
      "Dresses": "👗",
      "Jackets and outerwear": "🧥",
      "Shoes": "👟",
      "Bags": "👜",
      "Hats": "🧢",
      "Sunglasses and glasses": "🕶️",
      "Jewelry": "✨",
      "Other accessories": "🧣"
    };
    return icons[item.category] || "✦";
  }

  function markWorn(outfit) {
    const wornIds = new Set(SLOT_ORDER.map(function (slot) {
      const item = outfit.slots && outfit.slots[slot];
      return item && item.id;
    }).filter(Boolean));
    const wornItems = items.filter(function (item) { return wornIds.has(item.id); });
    items = items.map(function (item) {
      if (!wornIds.has(item.id)) return item;
      return Object.assign({}, item, {
        wearCount: (Number(item.wearCount) || 0) + 1,
        status: isWashableCategory(item.category) ? "dirty" : item.status,
        statusSource: isWashableCategory(item.category) ? "worn" : item.statusSource
      });
    });
    const account = activeAccount();
    const firstTint = wornItems.find(function (item) { return colorToCss(item.color); });
    wearHistory.unshift({
      id: randomId(),
      time: Date.now(),
      date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      itemNames: wornItems.map(function (item) { return item.name; }),
      icons: wornItems.map(iconForItem),
      color: firstTint ? colorToCss(firstTint.color) : "",
      vibe: outfit.vibe || "",
      sharedWithFriends: account.shareDaily
    });
    wearHistory = wearHistory.slice(0, 50);
    const itemsPersisted = writeStorage(profileStorageKey(ITEMS_KEY, activeProfileId), items);
    const historyPersisted = writeStorage(profileStorageKey(HISTORY_KEY, activeProfileId), wearHistory);
    reconcileCurrentOutfit();
    renderAll();
    if (itemsPersisted && historyPersisted) {
      const sharedNote = account.shareDaily && friendIdsOf(account.id).length ? " Your friends can see it in their feed." : "";
      showNotice("Outfit worn! Your style history is updated and washable pieces are in the laundry." + sharedNote, false);
    }
  }

  function openDialog(item) {
    form.reset();
    formError.hidden = true;
    preview.hidden = true;
    preview.replaceChildren();
    editingId = item ? item.id : null;
    currentImage = item ? item.image || "" : "";
    document.getElementById("dialog-title").textContent = item ? "Edit your piece" : "Add clothing";
    document.getElementById("save-item").textContent = item ? "Save changes" : "Add to my closet";
    document.getElementById("item-name").value = item ? item.name : "";
    document.getElementById("item-category").value = item ? item.category : CATEGORIES[0];
    document.getElementById("item-location").value = item ? item.location : "";
    document.getElementById("item-color").value = item ? colorLabel(item.color) : "";
    updateColorSwatch();
    document.getElementById("product-link").value = item ? item.productUrl || "" : "";
    document.getElementById("image-url").value = item && item.image && !item.image.startsWith("data:") ? item.image : "";
    if (currentImage) showPreview(currentImage);
    dialog.showModal();
    document.getElementById("item-name").focus();
  }

  function showPreview(source) {
    preview.replaceChildren();
    const image = document.createElement("img");
    image.src = source;
    image.alt = "Clothing photo preview";
    preview.append(image, make("span", "", "Photo preview — use a clean product photo for the best result."));
    preview.hidden = false;
  }

  function validWebUrl(value, label) {
    if (!value) return "";
    let parsed;
    try { parsed = new URL(value); } catch (error) { throw new Error("Please enter a valid " + label + " URL."); }
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Please use a web address starting with http:// or https:// for the " + label + ".");
    }
    return parsed.href;
  }

  function readPhoto(file) {
    return new Promise(function (resolve, reject) {
      if (!file.type.startsWith("image/")) {
        reject(new Error("Please choose an image file."));
        return;
      }
      if (file.size > 12 * 1024 * 1024) {
        reject(new Error("That photo is over 12 MB. Please choose a smaller image."));
        return;
      }
      const reader = new FileReader();
      reader.onerror = function () { reject(new Error("The photo couldn't be read. Please try another image.")); };
      reader.onload = function () {
        const image = new Image();
        image.onerror = function () { reject(new Error("That image couldn't be opened. Please try another photo.")); };
        image.onload = function () {
          const scale = Math.min(1, 1000 / Math.max(image.naturalWidth, image.naturalHeight));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          const context = canvas.getContext("2d");
          if (!context) {
            reject(new Error("This browser couldn't prepare the photo. Try a clean product image URL instead."));
            return;
          }
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        image.src = String(reader.result);
      };
      reader.readAsDataURL(file);
    });
  }

  function handleItemSubmit(event) {
    event.preventDefault();
    formError.hidden = true;
    const name = document.getElementById("item-name").value.trim();
    if (!name) {
      formError.textContent = "Please give your clothing item a name.";
      formError.hidden = false;
      return;
    }
    try {
      const productUrl = validWebUrl(document.getElementById("product-link").value.trim(), "product page");
      const imageUrl = validWebUrl(document.getElementById("image-url").value.trim(), "image");
      const category = document.getElementById("item-category").value;
      const location = document.getElementById("item-location").value.trim() || "Location not set";
      const color = document.getElementById("item-color").value.trim();
      const file = fileInput.files && fileInput.files[0];
      const finish = function (image) {
        const previous = items.find(function (item) { return item.id === editingId; });
        const item = {
          id: editingId || randomId(),
          name: name,
          category: category,
          location: location,
          color: color,
          icon: previous ? previous.icon : "✿",
          vibes: previous ? previous.vibes || [] : [],
          status: previous ? previous.status : "clean",
          statusSource: previous ? previous.statusSource : "clean",
          washable: isWashableCategory(category),
          image: image,
          productUrl: productUrl
        };
        if (editingId) items = items.map(function (existing) { return existing.id === editingId ? item : existing; });
        else items.unshift(item);
        const persisted = writeStorage(profileStorageKey(ITEMS_KEY, activeProfileId), items);
        reconcileCurrentOutfit();
        dialog.close();
        renderAll();
        if (persisted) showNotice(editingId ? "Your closet piece has been updated." : "Added to your closet — so cute!", false);
      };
      if (file) {
        readPhoto(file).then(finish).catch(function (error) {
          formError.textContent = error.message;
          formError.hidden = false;
        });
      } else {
        finish(imageUrl || currentImage);
      }
    } catch (error) {
      formError.textContent = error.message;
      formError.hidden = false;
    }
  }

  function onAction(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    const itemId = button.dataset.itemId;
    if (action === "toggle-clean") {
      items = items.map(function (item) {
        if (item.id !== itemId) return item;
        const status = item.status === "dirty" ? "clean" : "dirty";
        return Object.assign({}, item, {
          status: status,
          statusSource: status === "dirty" ? "manual" : "clean"
        });
      });
      const persisted = writeStorage(profileStorageKey(ITEMS_KEY, activeProfileId), items);
      reconcileCurrentOutfit();
      renderAll();
      if (persisted) showNotice("Laundry status updated.", false);
    } else if (action === "edit-item") {
      const item = items.find(function (entry) { return entry.id === itemId; });
      if (item) openDialog(item);
    } else if (action === "delete-item") {
      const item = items.find(function (entry) { return entry.id === itemId; });
      if (!item || !window.confirm("Remove “" + item.name + "” from your wardrobe?")) return;
      items = items.filter(function (entry) { return entry.id !== itemId; });
      const persisted = writeStorage(profileStorageKey(ITEMS_KEY, activeProfileId), items);
      reconcileCurrentOutfit();
      renderAll();
      if (persisted) showNotice("Piece removed from your wardrobe.", false);
    } else if (action === "lock-slot") {
      const slot = button.dataset.itemId;
      lockedSlots[slot] = !lockedSlots[slot];
      drawOutfit();
    } else if (action === "swap-slot") {
      swapSlot(button.dataset.itemId);
    } else if (action === "generate") {
      generateOutfit();
    } else if (action === "save-outfit") {
      if (!currentOutfit) return;
      const date = new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
      savedOutfits.unshift({
        id: randomId(),
        name: "A little outfit magic",
        date: date,
        vibe: currentOutfit.vibe,
        mode: currentOutfit.mode,
        slots: snapshotOutfit(currentOutfit).slots
      });
      const persisted = writeStorage(profileStorageKey(OUTFITS_KEY, activeProfileId), savedOutfits);
      renderSaved();
      renderInsights();
      renderStyleProfile();
      if (persisted) showNotice("Saved to your favorites. Keep that look close!", false);
    } else if (action === "share-saved") {
      const outfit = savedOutfits[Number(button.dataset.index)];
      if (!outfit || sharedOutfits.some(function (post) { return post.sourceOutfitId === outfit.id; })) return;
      const outfitItems = SLOT_ORDER.map(function (slot) { return outfit.slots && outfit.slots[slot]; }).filter(Boolean);
      if (!outfitItems.length) {
        showNotice("This saved outfit doesn't have any pieces to share yet.", true);
        return;
      }
      const firstTint = outfitItems.find(function (item) { return colorToCss(item.color); });
      const post = {
        id: randomId(),
        sourceOutfitId: outfit.id,
        title: "A look from my wardrobe",
        caption: "A saved outfit from my closet, ready for another rewear.",
        pieces: outfitItems.map(function (item) { return item.name; }),
        icons: outfitItems.map(iconForItem),
        color: firstTint ? colorToCss(firstTint.color) : "#f6e8df",
        likes: 0,
        shared: true
      };
      sharedOutfits.unshift(post);
      const persisted = writeStorage(profileStorageKey(SHARED_OUTFITS_KEY, activeProfileId), sharedOutfits);
      renderSaved();
      renderCommunity();
      if (persisted) {
        window.location.hash = "#community";
        showNotice(activeAccount().visibility === "public"
          ? "Shared to public inspiration (on this browser only)."
          : "Shared with your friends. Your account is private, so only friends can see it.", false);
      }
    } else if (action === "toggle-like") {
      const postId = button.dataset.postId;
      if (likedPostIds.includes(postId)) {
        likedPostIds = likedPostIds.filter(function (id) { return id !== postId; });
      } else {
        likedPostIds.push(postId);
      }
      const persisted = writeStorage(profileStorageKey(LIKES_KEY, activeProfileId), likedPostIds);
      renderCommunity();
      if (persisted) showNotice("Your inspiration reaction is saved on this browser.", false);
    } else if (action === "add-friend") {
      sendFriendRequest(button.dataset.personId);
    } else if (action === "accept-friend") {
      respondToRequest(button.dataset.personId, true);
    } else if (action === "decline-friend") {
      respondToRequest(button.dataset.personId, false);
    } else if (action === "cancel-request") {
      const person = personById(button.dataset.personId);
      removeConnection(button.dataset.personId, "Request to " + (person ? person.name : "them") + " cancelled.");
    } else if (action === "remove-friend") {
      const person = personById(button.dataset.personId);
      if (!person || !window.confirm("Remove " + person.name + " from your friends?")) return;
      removeConnection(person.id, person.name + " was removed from your friends.");
    } else if (action === "wear-current") {
      if (currentOutfit) markWorn(currentOutfit);
    } else if (action === "wear-saved") {
      const outfit = savedOutfits[Number(button.dataset.index)];
      if (outfit) markWorn(outfit);
    } else if (action === "delete-saved") {
      savedOutfits.splice(Number(button.dataset.index), 1);
      const persisted = writeStorage(profileStorageKey(OUTFITS_KEY, activeProfileId), savedOutfits);
      renderSaved();
      renderInsights();
      renderStyleProfile();
      if (persisted) showNotice("Saved outfit removed.", false);
    }
  }

  CATEGORIES.forEach(function (category) {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    document.getElementById("item-category").appendChild(option);
  });

  document.getElementById("category-filter").addEventListener("change", renderWardrobe);
  document.getElementById("location-filter").addEventListener("change", renderWardrobe);
  document.getElementById("wardrobe-search").addEventListener("input", renderWardrobe);
  document.getElementById("wardrobe-grid").addEventListener("click", onAction);
  document.getElementById("laundry-grid").addEventListener("click", onAction);
  document.getElementById("outfit-board").addEventListener("click", onAction);
  document.getElementById("saved-grid").addEventListener("click", onAction);
  document.getElementById("community-grid").addEventListener("click", onAction);
  document.getElementById("friends-feed-grid").addEventListener("click", onAction);
  document.getElementById("friends").addEventListener("click", onAction);
  document.getElementById("account-form").addEventListener("submit", saveAccountSettings);
  document.getElementById("find-friend-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const input = document.getElementById("friend-email");
    const email = input.value.trim().toLowerCase();
    document.getElementById("friend-error").hidden = true;
    if (!EMAIL_PATTERN.test(email)) {
      showFieldError("friend-error", "Enter your friend's email, like friend@example.com.");
      return;
    }
    const person = personByEmail(email);
    if (!person) {
      showFieldError("friend-error", "No one with that email has joined yet. A real version would email them an invite.");
      return;
    }
    if (person.id === activeProfileId) {
      showFieldError("friend-error", "That's your own email!");
      return;
    }
    input.value = "";
    sendFriendRequest(person.id);
  });
  document.getElementById("generate-outfit").addEventListener("click", function () { generateOutfit(); });
  document.getElementById("home-add").addEventListener("click", function () { openDialog(null); });
  function saveStylePreferences() {
    stylePreferences = {
      vibe: document.getElementById("preference-vibe").value,
      color: document.getElementById("preference-color").value.trim(),
      category: document.getElementById("preference-category").value
    };
    const persisted = writeStorage(profileStorageKey(PREFERENCES_KEY, activeProfileId), stylePreferences);
    renderStyleProfile();
    if (persisted) showNotice("Your style notes are saved. The next outfit idea will take them into account.", false);
  }
  document.getElementById("preference-vibe").addEventListener("change", saveStylePreferences);
  document.getElementById("preference-color").addEventListener("change", saveStylePreferences);
  document.getElementById("preference-category").addEventListener("change", saveStylePreferences);
  document.getElementById("premium-preview-toggle").addEventListener("click", function (event) {
    const preview = document.getElementById("premium-preview");
    preview.hidden = !preview.hidden;
    event.currentTarget.setAttribute("aria-expanded", String(!preview.hidden));
    event.currentTarget.textContent = preview.hidden ? "Preview the premium idea" : "Hide premium preview";
  });
  document.getElementById("profile-select").addEventListener("change", function (event) {
    switchProfile(event.target.value);
  });
  document.getElementById("add-profile").addEventListener("click", openSignIn);
  document.getElementById("sign-out").addEventListener("click", signOut);
  document.getElementById("account-sign-out").addEventListener("click", signOut);
  document.getElementById("profile-dialog").addEventListener("cancel", function (event) {
    if (!isSignedIn()) event.preventDefault();
  });
  document.getElementById("profile-dialog").addEventListener("close", function () {
    // Browsers can force-close a dialog (e.g. pressing Escape twice); reopen it if still signed out.
    if (!isSignedIn()) openSignIn();
  });
  document.getElementById("close-profile-dialog").addEventListener("click", function () {
    if (isSignedIn()) document.getElementById("profile-dialog").close();
  });
  document.getElementById("cancel-profile-dialog").addEventListener("click", function () {
    if (isSignedIn()) document.getElementById("profile-dialog").close();
  });
  document.getElementById("profile-form").addEventListener("submit", signInOrCreate);
  document.getElementById("clean-all").addEventListener("click", function () {
    items = items.map(function (item) {
      return Object.assign({}, item, { status: "clean", statusSource: "clean" });
    });
    const persisted = writeStorage(profileStorageKey(ITEMS_KEY, activeProfileId), items);
    reconcileCurrentOutfit();
    renderAll();
    if (persisted) showNotice("All fresh! Every piece is marked clean.", false);
  });
  document.getElementById("open-add").addEventListener("click", function () { openDialog(null); });
  document.getElementById("wardrobe-add").addEventListener("click", function () { openDialog(null); });
  document.querySelectorAll("[data-open-add]").forEach(function (button) {
    button.addEventListener("click", function () { openDialog(null); });
  });
  document.getElementById("close-dialog").addEventListener("click", function () { dialog.close(); });
  document.getElementById("cancel-dialog").addEventListener("click", function () { dialog.close(); });
  form.addEventListener("submit", handleItemSubmit);
  document.getElementById("item-color").addEventListener("input", updateColorSwatch);
  fileInput.addEventListener("change", function () {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      formError.textContent = "Please choose an image file.";
      formError.hidden = false;
      fileInput.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = function () { showPreview(String(reader.result)); };
    reader.onerror = function () {
      formError.textContent = "The photo preview couldn't be loaded.";
      formError.hidden = false;
    };
    reader.readAsDataURL(file);
  });
  document.getElementById("image-url").addEventListener("change", function (event) {
    const value = event.target.value.trim();
    if (!value) return;
    try {
      showPreview(validWebUrl(value, "image"));
      currentImage = "";
      fileInput.value = "";
    } catch (error) {
      formError.textContent = error.message;
      formError.hidden = false;
    }
  });
  document.querySelectorAll("[data-action]").forEach(function (button) {
    button.addEventListener("click", onAction);
  });
  window.addEventListener("hashchange", showView);

  updateSignedInState();
  renderAll();
  showView();
  if (!isSignedIn()) openSignIn();
  else if (items.length) generateOutfit();
})();
