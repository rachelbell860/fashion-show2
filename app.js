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
  const WASHABLE = ["Tops", "Bottoms", "Dresses", "Jackets and outerwear", "Shoes", "Hats"];
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

  function profileStorageKey(key, profileId) {
    return key + ":" + encodeURIComponent(profileId);
  }

  let profiles = readStorage(PROFILES_KEY, null);
  if (!Array.isArray(profiles) || !profiles.length) {
    const defaultProfile = { id: "my-closet", name: "My closet" };
    profiles = [defaultProfile];
    const oldItems = readStorage(ITEMS_KEY, null);
    const oldOutfits = readStorage(OUTFITS_KEY, null);
    writeStorage(profileStorageKey(ITEMS_KEY, defaultProfile.id), Array.isArray(oldItems) ? oldItems : emptyWardrobe());
    writeStorage(profileStorageKey(OUTFITS_KEY, defaultProfile.id), Array.isArray(oldOutfits) ? oldOutfits : []);
    writeStorage(PROFILES_KEY, profiles);
    writeStorage(ACTIVE_PROFILE_KEY, defaultProfile.id);
  }
  profiles = profiles.filter(function (profile) {
    return profile && typeof profile.id === "string" && typeof profile.name === "string";
  });
  if (!profiles.length) profiles = [{ id: "my-closet", name: "My closet" }];

  let activeProfileId = readStorage(ACTIVE_PROFILE_KEY, profiles[0].id);
  if (!profiles.some(function (profile) { return profile.id === activeProfileId; })) activeProfileId = profiles[0].id;

  let items = readStorage(profileStorageKey(ITEMS_KEY, activeProfileId), emptyWardrobe());
  let savedOutfits = readStorage(profileStorageKey(OUTFITS_KEY, activeProfileId), []);
  let wearHistory = readStorage(profileStorageKey(HISTORY_KEY, activeProfileId), []);
  let stylePreferences = readStorage(profileStorageKey(PREFERENCES_KEY, activeProfileId), {});
  let likedPostIds = readStorage(profileStorageKey(LIKES_KEY, activeProfileId), []);
  let sharedOutfits = readStorage(profileStorageKey(SHARED_OUTFITS_KEY, activeProfileId), []);
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

  function setImage(visual, item) {
    const color = item.color && CSS.supports("color", item.color) ? item.color : "#f6c9d5";
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
    topLine.append(make("span", "tag", item.category), make("span", "status-pill " + item.status, item.status === "dirty" ? "Laundry" : "Clean"));
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
    actions.appendChild(createActionButton(item.status === "dirty" ? "Mark clean" : "Mark dirty", "toggle-clean", item.id, "mini-button"));
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
        alreadyShared ? "Shared to inspiration ✓" : "Share to inspiration",
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

  function renderCommunity() {
    const grid = document.getElementById("community-grid");
    grid.replaceChildren();
    const posts = COMMUNITY_POSTS.concat(sharedOutfits);
    posts.forEach(function (post) {
      const card = make("article", "community-post");
      const heading = make("div", "community-author");
      const avatar = make("span", "community-avatar", post.name.slice(0, 1));
      avatar.setAttribute("aria-hidden", "true");
      heading.append(avatar, make("div", "", post.name));
      if (post.shared) heading.appendChild(make("span", "prototype-tag", "Your preview"));
      const art = make("div", "community-art");
      art.style.backgroundColor = post.color || "#f6e8df";
      (post.icons || []).slice(0, 4).forEach(function (icon) {
        art.appendChild(make("span", "community-piece-icon", icon));
      });
      const text = make("div", "community-post-copy");
      text.append(make("h2", "", post.title), make("p", "", post.caption));
      const labels = make("div", "community-piece-labels");
      (post.pieces || []).forEach(function (piece) {
        labels.appendChild(make("span", "tag", piece));
      });
      const liked = likedPostIds.includes(post.id);
      const like = createActionButton(
        (liked ? "♥ Liked · " : "♡ Like · ") + (Number(post.likes) + (liked ? 1 : 0)),
        "toggle-like",
        "",
        "mini-button like-button",
        liked
      );
      like.dataset.postId = post.id;
      card.append(heading, art, text, labels, like);
      grid.appendChild(card);
    });
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
    select.replaceChildren.apply(select, profiles.map(function (profile) {
      const option = document.createElement("option");
      option.value = profile.id;
      option.textContent = profile.name;
      return option;
    }));
    select.value = activeProfileId;
  }

  function switchProfile(profileId, silent) {
    const profile = profiles.find(function (entry) { return entry.id === profileId; });
    if (!profile || profile.id === activeProfileId) return false;
    activeProfileId = profile.id;
    const persisted = writeStorage(ACTIVE_PROFILE_KEY, activeProfileId);
    items = readStorage(profileStorageKey(ITEMS_KEY, activeProfileId), emptyWardrobe());
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
    renderAll();
    generateOutfit(true);
    if (!silent) {
      showNotice(persisted ? "Switched to " + profile.name + "'s closet." : "Switched profiles, but this browser couldn't remember the selection.", !persisted);
    }
    return persisted;
  }

  function createProfile(event) {
    event.preventDefault();
    const nameInput = document.getElementById("profile-name");
    const error = document.getElementById("profile-error");
    const name = nameInput.value.trim();
    error.hidden = true;
    if (!name) {
      error.textContent = "Add a nickname for this closet.";
      error.hidden = false;
      return;
    }
    if (profiles.some(function (profile) { return profile.name.toLowerCase() === name.toLowerCase(); })) {
      error.textContent = "That profile name is already in use. Try a different nickname.";
      error.hidden = false;
      return;
    }
    const profile = { id: randomId(), name: name };
    profiles.push(profile);
    const profilesSaved = writeStorage(PROFILES_KEY, profiles);
    const itemsSaved = writeStorage(profileStorageKey(ITEMS_KEY, profile.id), emptyWardrobe());
    const outfitsSaved = writeStorage(profileStorageKey(OUTFITS_KEY, profile.id), []);
    const historySaved = writeStorage(profileStorageKey(HISTORY_KEY, profile.id), []);
    const preferencesSaved = writeStorage(profileStorageKey(PREFERENCES_KEY, profile.id), {});
    const likesSaved = writeStorage(profileStorageKey(LIKES_KEY, profile.id), []);
    const sharesSaved = writeStorage(profileStorageKey(SHARED_OUTFITS_KEY, profile.id), []);
    nameInput.value = "";
    document.getElementById("profile-dialog").close();
    const activeProfileSaved = switchProfile(profile.id, true);
    const saved = profilesSaved && itemsSaved && outfitsSaved && historySaved &&
      preferencesSaved && likesSaved && sharesSaved && activeProfileSaved;
    showNotice(saved
      ? "Your new closet profile is ready. Add personal pieces whenever you like."
      : "This profile is available now, but the browser couldn't save all of it. Check browser storage and try again.", !saved);
  }

  function renderAll() {
    renderProfiles();
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
      return String(item.color || "").toLowerCase().includes(preferredColor);
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
        status: item.washable ? "dirty" : item.status
      });
    });
    wearHistory.unshift({
      date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      itemNames: wornItems.map(function (item) { return item.name; }),
      vibe: outfit.vibe || ""
    });
    wearHistory = wearHistory.slice(0, 50);
    const itemsPersisted = writeStorage(profileStorageKey(ITEMS_KEY, activeProfileId), items);
    const historyPersisted = writeStorage(profileStorageKey(HISTORY_KEY, activeProfileId), wearHistory);
    reconcileCurrentOutfit();
    renderAll();
    if (itemsPersisted && historyPersisted) {
      showNotice("Outfit worn! Your style history is updated and washable pieces are in the laundry.", false);
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
    document.getElementById("item-color").value = item ? item.color : "#f6c9d5";
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
      const color = document.getElementById("item-color").value;
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
          washable: WASHABLE.indexOf(category) !== -1,
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
        return item.id === itemId ? Object.assign({}, item, { status: item.status === "dirty" ? "clean" : "dirty" }) : item;
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
      const firstTint = outfitItems.find(function (item) { return CSS.supports("color", item.color || ""); });
      const post = {
        id: randomId(),
        sourceOutfitId: outfit.id,
        name: "Your closet",
        title: "A look from your wardrobe",
        caption: "A saved outfit from this closet. In a real community, little ideas like this could inspire another rewear.",
        pieces: outfitItems.map(function (item) { return item.name; }),
        icons: outfitItems.map(iconForItem),
        color: firstTint ? firstTint.color : "#f6e8df",
        likes: 0,
        shared: true
      };
      sharedOutfits.unshift(post);
      const persisted = writeStorage(profileStorageKey(SHARED_OUTFITS_KEY, activeProfileId), sharedOutfits);
      renderSaved();
      renderCommunity();
      if (persisted) {
        window.location.hash = "#community";
        showNotice("Shared to this browser's inspiration preview only.", false);
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
  document.getElementById("add-profile").addEventListener("click", function () {
    document.getElementById("profile-error").hidden = true;
    document.getElementById("profile-name").value = "";
    document.getElementById("profile-dialog").showModal();
    document.getElementById("profile-name").focus();
  });
  document.getElementById("close-profile-dialog").addEventListener("click", function () {
    document.getElementById("profile-dialog").close();
  });
  document.getElementById("cancel-profile-dialog").addEventListener("click", function () {
    document.getElementById("profile-dialog").close();
  });
  document.getElementById("profile-form").addEventListener("submit", createProfile);
  document.getElementById("clean-all").addEventListener("click", function () {
    items = items.map(function (item) { return Object.assign({}, item, { status: "clean" }); });
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

  renderAll();
  showView();
  if (items.length) generateOutfit();
})();
