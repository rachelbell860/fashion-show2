# Project log

Keep this up to date as you go — a few lines per work session is enough. It's much harder to reconstruct at the end.

**Team name:**
**Startup name:**
**Live site link:**

---

## Work sessions

Copy this block for each session.

### Session — 2026-11-25 — driver: project team

- **Goal for this session:** Turn the starter template into a responsive digital wardrobe and outfit planner.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Read the README and professor's project instructions, then build the requested fashion wardrobe website using the existing template and files.
  2. Create a playful wardrobe with outfit generation, saved looks, storage locations, laundry tracking, sample pieces, and browser-local persistence.
- **What worked:** Built the site in the existing HTML, CSS, and JavaScript files, with no libraries or installs. The sample closet is ready to try, and wardrobe changes are stored in the browser.
- **Limitations:** A static site can't reliably import product photos from store pages or remove backgrounds automatically. The prototype accepts a direct image URL or a clean photo upload instead.
- **Committed?** no

### Session — 2026-11-25 — driver: project team

- **Goal for this session:** Let multiple people keep separate closets when using the prototype on one browser.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Add individual profiles with separate personal clothing and saved outfits.
- **What worked:** Added local closet profiles with a profile switcher. Wardrobes, laundry status, and saved outfits are stored separately per profile; existing browser data is migrated into the first profile.
- **Limitations:** These are browser-local profiles, not real accounts. There are no passwords, server, private access, or cross-device syncing, in keeping with the assignment rules.
- **Committed?** no

### Session — 2026-11-25 — driver: project team

- **Goal for this session:** Start every new closet empty so people add their own clothing.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Start the website with nothing in the closet so people can add their own stuff.
- **What worked:** Removed the sample wardrobe. First-time visitors and newly created profiles now start with an empty closet, and the outfit generator invites them to add their own pieces. Existing saved wardrobe data is preserved.
- **Committed?** no

### Session — 2026-11-25 — driver: project team

- **Goal for this session:** Demonstrate the course business concepts in the working website while preserving the closet features and aesthetic.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Add live closet insights, a personal style profile that demonstrates growing value and switching costs, a fictional community inspiration simulation, a clear homepage pitch, and free/premium plan concepts.
  2. Keep the prototype static and safe: no third-party libraries, real accounts, payments, or personal community data.
- **What worked:** Added live clean/dirty/saved counts and wear rankings; a profile-scoped wear history and preference-guided style profile; fictional community posts with local-only likes and simulated sharing; a clearer customer/problem/solution pitch; and an illustrative free/premium plan page with a no-payment preview. Existing profiles keep separate data, and new profiles remain empty.
- **Tests performed:** JavaScript syntax checks (`node --check app.js`, `node --check data.js`); `git diff --check`; browserless DOM smoke tests for empty first visit, dashboard counts and rankings, outfit preferences, wear history and laundry updates, saved outfit counts, community likes/sharing, plan preview, profile isolation, and internal navigation targets; static checks for duplicate HTML IDs, app lookups, and external asset/library references. All passed.
- **Limitations:** Community activity and pricing are simulations stored in the browser; this static prototype does not publish posts, process payments, or provide real accounts.
- **Committed?** no

### Session — 2026-11-25 — driver: project team

- **Goal for this session:** Make laundry status apply automatically only to washable clothing without changing the existing design.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Keep shoes and accessories clean and available after wearing outfits, allow manual cleaning flags, and update laundry and closet statistics.
- **What worked:** Automatic wear tracking now dirties only tops, bottoms, dresses, and outerwear. Shoes, bags, hats, glasses, jewelry, and other accessories remain clean and generator-eligible after wear. Users can still manually mark any item as needing cleaning; laundry counts, closet statistics, and labels reflect that choice. Older saved accessory/footwear dirty states from automatic wear are corrected on load while explicitly manual flags are preserved.
- **Tests performed:** `node --check app.js`, `node --check data.js`, and `git diff --check`; browserless functional smoke checks for legacy status migration, washable clothing auto-dirty behavior, accessory clean status, laundry/dashboard count updates, manual dirty/clean actions, and persisted washable flags. All passed.
- **Committed?** no

### Session — [date] — driver: [first name]

- **Goal for this session:**
- **Key prompts we gave Copilot** (paste the important ones):
  1.
  2.
- **What worked:**
- **What broke, and how we fixed it:**
- **Committed?** yes / no — commit message:

---

## Things that broke (running list)

| Date | What went wrong | What we tried | What finally fixed it |
|---|---|---|---|
| | | | |

## What a real version would need

Everything we wanted but faked or left out — real logins, a real database, payments, security, moderation, an app, staff, etc. For each one, say **why** it's needed and roughly **how hard or expensive** you think it would be.

| Feature we faked or skipped | Why a real company would need it | How hard / expensive? |
|---|---|---|
| | | |

## Reflection (fill in at the end)

1. What surprised you most about building software with AI?
2. Which parts were easy, and which were hard? Why do you think that is?
3. If a competitor had the same AI tool, how long would it take them to copy your site?
