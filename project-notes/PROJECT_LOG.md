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

### Session — 2026-11-27 — driver: Rachel

- **Goal for this session:** Finish the project log, put all the new work on the live site, check everything against the rubric, and make the site easy for graders to try.
- **Key prompts we gave the AI:**
  1. "Fill out the project log, ask me questions if you have them."
  2. "Read CLAUDE.md and the files in course-docs. Add course-docs to .gitignore so it never gets committed. Then commit and merge and push the site and project-notes changes. After that, check my site and project-notes against the rubric and tell me what's missing, most points first."
  3. "Add the try the demo button to the sign in box."
  4. "Let's take out the automatic pop up and just make the sign in button more obvious."
- **What worked:** Filled in the log header, drivers, commit messages and the "things that broke" table. Merged the new work into `main` and pushed it, so the live site finally shows accounts, friends and colour names. Added a "Try the demo" button that opens a demo account with a 13-piece sample closet and two friends, so the outfit generator and friends feed work with one click. Replaced the automatic sign-in pop-up with a pink "Sign in / Join" button in the header and a welcome banner; the sign-in box now only opens when someone tries to save something.
- **What broke, and how we fixed it:** The rubric check showed that the required sign-in pop-up we added on Nov 26 hid the whole site, including the home page pitch, until a visitor made an account. Graders have to understand the product within 30 seconds, and the rubric also takes points off for a login form that looks real. We added the demo button first, then removed the automatic pop-up so visitors can look around before signing in.
- **Tests performed:** `node --check`, `git diff --check`, and a 33-step browserless test of browsing without an account, the Sign in button and banner, actions that ask for sign-in, closing the box, the demo account (closet, outfits, insights, laundry, friends feed), signing out, and creating a normal account. All passed. Checked that the live site rebuilt with the new version.
- **Committed?** yes — commit messages: Fill in project log header, drivers, commits and colour session; Add things-that-broke rows and ignore course-docs; Log that the live site is now updated; Add Try the demo and replace sign-in pop-up with a Sign in button

### Session — 2026-11-27 (evening) — driver: Rachel

- **Goal for this session:** Finish the business case (sections 5 and 6), add the AI-use line, write the reflection, and get everything on GitHub before the deadline.
- **Key prompts we gave the AI:**
  1. "Save what I just added to the business case."
  2. "Can you fix those things for me" (the layout problems in sections 5 and 6).
  3. "Is the log entry the only thing I still need to do?"
  4. "Add this for the AI-use …" (my AI-use line) and "add this to the log" (my reflection).
  5. "Fill in today's session entry in the log."
- **What worked:** I wrote sections 5 (Cloud and operations) and 6 (Risks and ethics) myself, and the AI committed them. It then fixed the Markdown layout: the section 5 prompt question had ended up after my answer, there was a missing blank line in section 6, and it made the labels bold to match section 2. It checked my work against the rubric and found that the reflection and the required AI-use line were still missing. I wrote both, and the AI added them to the files. It also confirmed that the business case is about 1,500 words (not counting the template questions) and that the live site loads.
- **What broke, and how we fixed it:** The AI first told me the deadline had passed, because its clock was set to UTC, where it was already Saturday. I pointed out that it was still Friday. It checked Atlantic time (8:42 pm) and we kept going.
- **Committed?** yes — commit messages: Draft business case sections 5 and 6; Fix Markdown formatting in business case sections 5 and 6; Add AI-use line to business case and reflection to project log; Add Nov 27 evening session to project log

---

## Things that broke (running list)

| Date | What went wrong | What we tried | What finally fixed it |
|---|---|---|---|
| 2026-11-25 | Clothing images would not automatically import from retailer links. | Tried extracting images directly from product links. | Added manual photo uploads and direct image URLs as alternatives. |
| 2026-11-25 | The website could not isolate clothing items from photographs containing models. | Explored automatic image and background removal. | Used individual product photographs instead. |
| 2026-11-25 | Shoes were being marked as dirty after an outfit was worn. | Requested changes to the laundry system's category rules. | Removed shoes and accessories from automatic laundry tracking, so only tops, bottoms, dresses and outerwear are marked dirty when an outfit is worn. Fixed and committed on 2026-11-26. |
| 2026-11-26 | Colour names from the suggestion list (like "Blush pink") didn't change the item's colour. Those items all got the default pink, so people had to type a colour code instead. | Checked how the colour was used and found the browser only understands a few built-in colour names and codes, not names like "Blush pink" or "Sage green". | Added our own list of about 50 colour names so typed names give the right tint, plus a swatch that previews the colour while typing. |
| 2026-11-27 | The live site didn't show our new features (accounts, friends, colour names). | Checked GitHub and found our commits were saved only in the workspace and never uploaded, and the newest work was on a separate branch instead of `main`, which the live site is built from. | On 2026-11-27 we merged the branch into `main` and pushed it to GitHub. The live site rebuilt within a few minutes and now shows the new features. |

## What a real version would need

Everything we wanted but faked or left out — real logins, a real database, payments, security, moderation, an app, staff, etc. For each one, say **why** it's needed and roughly **how hard or expensive** you think it would be.

| Feature we faked or skipped | Why a real company would need it | How hard / expensive? |
|---|---|---|
| Real user accounts | Allow users to securely log in and access their personal wardrobes. | Moderate. Authentication services can initially be free or low-cost. |
| Cloud database | Permanently store clothing, images, preferences and saved outfits. | Moderate. Approximately $0–$50/month initially. |
| Cross-device synchronization | Allow users to access their wardrobe from their phone, tablet or computer. | Moderate. Requires user accounts and a cloud database. |
| Automatic retailer image importing | Make adding clothing faster and more convenient. | High. Retailer restrictions and API access could make this expensive. |
| AI background and model removal | Create clean images of individual clothing items without distracting backgrounds or models. | High. Would require specialized AI technology or image-processing services. |
| Real community features | Allow users to share outfits, like posts and interact with other users. | Moderate to high. Requires a database and backend infrastructure. |
| Payment processing | Allow users to purchase premium subscriptions. | Moderate. Payment providers typically charge a fee per transaction. |
| Security and privacy | Protect users' personal information, passwords and uploaded photographs. | High. Requires ongoing maintenance and security monitoring. |
| Community moderation | Prevent inappropriate content, spam and harmful interactions. | Moderate to high. May require automated moderation and paid staff as the platform grows. |
| Mobile app | Make it easier for users to photograph clothing and plan outfits on the go. | High. Could cost thousands of dollars to develop professionally. |
| Ongoing maintenance and staff | Fix bugs, support customers and introduce new features. | High. Ongoing costs would increase as the business grows. |

## Reflection (fill in at the end)

**1. What surprised you most about building software with AI?**

What surprised me most was how quickly I could turn an idea into a functioning website without having much coding experience. I could describe what I wanted in everyday language, and AI would generate the code for me. However, I was also surprised by how often adding a new feature could cause problems elsewhere. I learned that building software with AI still requires patience, problem-solving, testing and clear communication.

**2. Which parts were easy, and which were hard? Why do you think that is?**

The easiest parts were designing the website, changing its appearance and adding basic features such as buttons, clothing categories and navigation. It was easy to describe how I wanted something to look and have AI make those changes.

The hardest parts were getting more complex features to work, such as automatically importing clothing images from retailer websites, removing models from photos and making sure the laundry system worked correctly. I also struggled with publishing the website and troubleshooting errors because I was unfamiliar with GitHub. I think these tasks were harder because they involved technical limitations and required multiple parts of the website to work together. I learned that being specific with my prompts made a big difference.

**3. If a competitor had the same AI tool, how long would it take them to copy your site?**

I think a competitor with the same AI tools could recreate most of my website within a weekend, especially if they could see my existing design and features. This made me realize that the website itself is not a strong competitive advantage. The real value would come from the community, customer loyalty, wardrobe data and personalization that develop over time. A competitor could copy my website quickly, but building an active community and gaining the same understanding of customers could take months or even years.
