# Project log

Keep this up to date as you go — a few lines per work session is enough. It's much harder to reconstruct at the end.

**Team name:** Personal Fashion Show
**Startup name:** Personal Fashion Show
**Live site link:** https://rachelbell860.github.io/fashion-show2/

---

## Work sessions

Copy this block for each session.

### Session — 2026-11-25 — driver: Rachel

- **Goal for this session:** Turn the starter template into a responsive digital wardrobe and outfit planner.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Read the README and professor's project instructions, then build the requested fashion wardrobe website using the existing template and files.
  2. Create a playful wardrobe with outfit generation, saved looks, storage locations, laundry tracking, sample pieces, and browser-local persistence.
- **What worked:** Built the site in the existing HTML, CSS, and JavaScript files, with no libraries or installs. The sample closet is ready to try, and wardrobe changes are stored in the browser.
- **Limitations:** A static site can't reliably import product photos from store pages or remove backgrounds automatically. The prototype accepts a direct image URL or a clean photo upload instead.
- **Committed?** yes — commit message: Add wardrobe features and business concept simulations

### Session — 2026-11-25 — driver: Rachel

- **Goal for this session:** Let multiple people keep separate closets when using the prototype on one browser.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Add individual profiles with separate personal clothing and saved outfits.
- **What worked:** Added local closet profiles with a profile switcher. Wardrobes, laundry status, and saved outfits are stored separately per profile; existing browser data is migrated into the first profile.
- **Limitations:** These are browser-local profiles, not real accounts. There are no passwords, server, private access, or cross-device syncing, in keeping with the assignment rules.
- **Committed?** yes — commit message: Add wardrobe features and business concept simulations

### Session — 2026-11-25 — driver: Rachel

- **Goal for this session:** Start every new closet empty so people add their own clothing.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Start the website with nothing in the closet so people can add their own stuff.
- **What worked:** Removed the sample wardrobe. First-time visitors and newly created profiles now start with an empty closet, and the outfit generator invites them to add their own pieces. Existing saved wardrobe data is preserved.
- **Committed?** yes — commit message: Add wardrobe features and business concept simulations

### Session — 2026-11-25 — driver: Rachel

- **Goal for this session:** Demonstrate the course business concepts in the working website while preserving the closet features and aesthetic.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Add live closet insights, a personal style profile that demonstrates growing value and switching costs, a fictional community inspiration simulation, a clear homepage pitch, and free/premium plan concepts.
  2. Keep the prototype static and safe: no third-party libraries, real accounts, payments, or personal community data.
- **What worked:** Added live clean/dirty/saved counts and wear rankings; a profile-scoped wear history and preference-guided style profile; fictional community posts with local-only likes and simulated sharing; a clearer customer/problem/solution pitch; and an illustrative free/premium plan page with a no-payment preview. Existing profiles keep separate data, and new profiles remain empty.
- **Tests performed:** JavaScript syntax checks (`node --check app.js`, `node --check data.js`); `git diff --check`; browserless DOM smoke tests for empty first visit, dashboard counts and rankings, outfit preferences, wear history and laundry updates, saved outfit counts, community likes/sharing, plan preview, profile isolation, and internal navigation targets; static checks for duplicate HTML IDs, app lookups, and external asset/library references. All passed.
- **Limitations:** Community activity and pricing are simulations stored in the browser; this static prototype does not publish posts, process payments, or provide real accounts.
- **Committed?** yes — commit message: Add wardrobe features and business concept simulations

### Session — 2026-11-25 — driver: Rachel

- **Goal for this session:** Make laundry status apply automatically only to washable clothing without changing the existing design.
- **Key prompts we gave Copilot** (paste the important ones):
  1. Keep shoes and accessories clean and available after wearing outfits, allow manual cleaning flags, and update laundry and closet statistics.
- **What worked:** Automatic wear tracking now dirties only tops, bottoms, dresses, and outerwear. Shoes, bags, hats, glasses, jewelry, and other accessories remain clean and generator-eligible after wear. Users can still manually mark any item as needing cleaning; laundry counts, closet statistics, and labels reflect that choice. Older saved accessory/footwear dirty states from automatic wear are corrected on load while explicitly manual flags are preserved.
- **Tests performed:** `node --check app.js`, `node --check data.js`, and `git diff --check`; browserless functional smoke checks for legacy status migration, washable clothing auto-dirty behavior, accessory clean status, laundry/dashboard count updates, manual dirty/clean actions, and persisted washable flags. All passed.
- **Committed?** yes — commit message: updated petal and thread wedsite

### Session — 2026-11-26 — driver: Rachel

- **Goal for this session:** Add personal accounts with emails, friends, and public/private accounts, so people see public outfit inspo plus their friends' private day-to-day outfits.
- **Key prompts we gave the AI:**
  1. I want to make this website have personal accounts using people's emails. I want users to connect with friends. I want them to have an option of private or public accounts, where users can see public outfit inspo and their friends' private day-to-day outfits.
- **What worked:** Closet profiles became email-based accounts (sign in or join from the ＋ button; existing closets carry over and can add an email). New Friends & Account page: display name, email, public/private setting, a "share worn outfits with friends" switch, add-by-email, friend requests (accept/decline/cancel), friends list, and suggestions. The Community page became a two-part feed: friends' day-to-day outfits (what they marked as worn, visible only to friends) and public inspiration (looks shared by public accounts, plus private friends' looks). Six fictional members (two private) accept requests instantly; requests between two accounts on the same browser need the other account to accept.
- **Tests performed:** `node --check` on both scripts, `git diff --check`, duplicate-ID check, and a 36-step browserless DOM test covering sign-up/sign-in, email validation, friend requests, privacy rules, daily-outfit sharing, and data surviving a reload. All passed.
- **Limitations:** No passwords, email verification, or server. Accounts and friendships live only in this browser, so anyone using the device can open any account. Use made-up emails only.
- **Committed?** yes — commit message: Add email accounts, friends, privacy settings and sign-in gate

### Session — 2026-11-26 — driver: Rachel

- **Goal for this session:** Require sign-in before using the site, and add sign out.
- **Key prompts we gave the AI:**
  1. When someone opens the website and isn't signed in, show the "Sign in or join" box right away, before they can see or use anything else. They shouldn't be able to close it with the × or Cancel until they've made an account or signed in. Once they're signed in, don't show it again unless they sign out. Also add a "Sign out" button somewhere easy to find.
- **What worked:** Visitors who aren't signed in see only the sign-in box. The page behind it is hidden, the × and Cancel are removed, and Escape doesn't close it. The browser remembers who is signed in, so the box doesn't come back until they press Sign out (in the header, or on the Friends & Account page). Closets saved before accounts existed can be linked to an email at sign-in so no clothes are lost.
- **Tests performed:** `node --check`, `git diff --check`, and a 26-step browserless test of the gate, closing attempts, staying signed in after reload, both sign-out buttons, signing back in, and linking an old closet. All passed.
- **Limitations:** Still no passwords. "Signed in" is only remembered by this browser, and anyone on the device can sign in to any account by typing its email.
- **Committed?** yes — commit message: Add email accounts, friends, privacy settings and sign-in gate

### Session — 2026-11-26 — driver: Rachel

- **Goal for this session:** Let people type a colour's name when adding clothing, instead of a colour code.
- **Key prompts we gave the AI:**
  1. When adding a new item of clothing there is an option to put a colour. Can you make it so people can type the name of the colour instead of the code?
- **What worked:** The colour box now starts empty and asks for a name (e.g. "sage green"). A list of about 50 everyday colour names gives each item the right tint, and close matches like "dark olive" also work. A small swatch next to the box shows the colour while typing. Older items saved with a code show their colour name when edited.
- **What broke, and how we fixed it:** Before this change, names from the colour suggestions (like "Blush pink") weren't colours the browser understood, so those items quietly got the default pink tint. Adding our own list of colour names fixed it.
- **Tests performed:** `node --check`, `git diff --check`, and a 16-step browserless test of typed names, capitals and extra spaces, two-word names, colour codes, unknown names, and editing older items. All passed.
- **Committed?** yes — commit message: Let people type colour names when adding clothing

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
| Real email accounts and login | Accounts are stored in one browser with no password, so anyone on the device can open them and nothing syncs between phone and laptop. A real version needs sign-up with email verification, passwords or login links, and password reset. | Medium. A hosted login service (for example Firebase Auth or Auth0) is free to low-cost at small scale, plus a few weeks of developer time. |
| Shared database for friends and feeds | Friends must see each other's outfits from their own devices. That needs a server database that stores friendships and posts and enforces who can see what (public vs. private, friends only). | Medium to high. Hosting is cheap early on (tens of dollars a month), but privacy rules need careful building and testing. |
| Privacy, safety and moderation | Private daily outfits are personal. A real app needs privacy-law compliance (e.g. PIPEDA in Canada), blocking and reporting, account deletion, and moderation of public posts. | High. Ongoing legal advice and staff or paid moderation tools. |
| Friend invites by email | When a friend hasn't joined, the prototype just says so. A real version would send them an invite email. | Low to medium. An email service costs a few dollars a month, plus spam and consent rules. |
| Photo storage for outfit posts | Posts currently show emoji icons. Real users would want photos, which need cloud storage and image processing. | Medium. Storage costs grow with users. |

## Reflection (fill in at the end)

1. What surprised you most about building software with AI?
2. Which parts were easy, and which were hard? Why do you think that is?
3. If a competitor had the same AI tool, how long would it take them to copy your site?
