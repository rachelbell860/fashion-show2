# Business case

Your prototype shows *what* the product looks like. This document explains *why* it could become a business. Answer in your own words and refer to course concepts by name. See the term project brief on Moodle for length and grading.

## 1. The idea

- **Customer:** Personal Fashion Show is designed for female university students aged 18–24 who enjoy fashion but have limited budgets, small closets and busy schedules. They need outfits for many occasions, including classes, work, social events and nights out.
- **Problem:** A student might spend 20 minutes getting ready, trying on several outfits before settling on something she has already worn many times. Other platforms like Pinterest offer inspiration but promotes clothing she does not own, and asking friends for advice is not always convenient. The result is wasted time, unnecessary purchases and underused clothing.
- **Solution:** Personal Fashion Show is a digital wardrobe that generates outfits from clothing users already own, based on their style preferences and which items are clean. Closet insights help users spot underused pieces and discover new combinations. Instead of encouraging customers to buy more, Personal Fashion Show helps them get more value from the wardrobes they already have.
- **Revenue:** Personal Fashion Show uses a freemium model. Core wardrobe and social features are free to encourage adoption and community growth. An optional $5 monthly subscription adds convenience features for busy students: outfit calendars, weather-based recommendations and capsule wardrobe planning. The company avoids retailer advertising, because promoting new purchases would conflict with its core purpose.

## 2. Where IT creates value

Which parts of the value chain does your product change, and how? Which course concepts apply (e.g. scale, distribution channels, differentiation, data, switching costs)?

**Operations and service delivery:** Personal Fashion Show automates a service that traditionally required a personal stylist, advice from friends or time spent searching through a closet. The website generates outfits within seconds based on clothing availability and personal preferences, saving customers time and making personalized styling affordable for university students. It also creates economies of scale: the same software can serve thousands of customers without hiring more stylists. Although hosting and storage costs would rise as the business grows, the marginal cost of serving each additional customer would remain low.

**Marketing and sales:** Personal Fashion Show reaches customers directly online, without a physical location or intermediaries. TikTok and Instagram let it reach university students through outfit videos, styling challenges and demonstrations of the website. While an individual stylist reaches a limited number of clients, a single video could reach thousands of potential customers. Viewers can visit the website immediately and try the free version before deciding whether to subscribe. This lowers barriers to adoption and can reduce customer acquisition costs.

## 3. Network effects

Does your product get more valuable as more people use it?

- Is it a **one-sided** or **two-sided** market? Who are the sides?
- Where does the extra value come from as the network grows?
- How would you solve the "empty network" problem at launch?
- Point to the part of your prototype that shows this.

Personal Fashion Show is a one-sided platform: its users are both creators and consumers of outfit inspiration, and it does not depend on a separate group of sellers or retailers to create value.

As more people join, users gain a wider variety of outfit ideas and more opportunities to connect with friends. Students can share everyday outfits and see how others style similar clothing. This is a direct network effect, because each additional active user can increase the platform's value for existing users. However, the effect is mainly local. A student gains far more when her friends, roommates and classmates join than when a stranger at another university does, because she cares more about what people in her own circle wear to the same classes, parties and events.

This shapes the cold-start plan. Personal Fashion Show offers standalone value through its digital wardrobe, outfit generator and laundry tracking, so users benefit even before any friends join. Because the network effect is local, the company would launch campus by campus rather than targeting all students at once, using student ambassadors and friend invitations to build dense groups of connected users. Keeping social features free would further encourage participation.

Growth also has a downside. As the community expands, users may compare themselves to others and feel pressure to wear new or perfect outfits, which contradicts the platform's purpose of helping people appreciate and reuse what they own. A friends-only feed and an emphasis on everyday outfits rather than picture-perfect content would help reduce this pressure.

The prototype demonstrates these effects through its Community Feed, friend requests, profiles and outfit sharing. Although these interactions are simulated, they show how an active community could increase engagement, retention and the platform's overall value.

## 4. Can it be copied? (the moat question)

Anyone in this class could rebuild your website in a weekend with the same AI tool. So the code is **not** your competitive advantage.

- What about your business is **valuable, rare, hard to imitate and well-organized** (VRIN)?
- What would a competitor with a bigger budget need to copy you, and how long would it take?
- Which of your advantages get *stronger* over time (data, network, brand, switching costs)?

A competitor could easily recreate the Personal Fashion Show website using AI, so the website itself is not a competitive advantage. Instead, any lasting advantage would come from two resources: accumulated wardrobe data and established campus communities.

### Resource 1: Wardrobe data and personalization

- **Valuable:** As users record their clothing, favourite outfits and wearing habits, the platform provides increasingly personalized recommendations, saving time and helping students get more value from what they own.
- **Rare:** Digital wardrobe technology already exists, so the technology itself is not rare. However, detailed information about what each student owns, how often she wears certain items and which combinations she prefers would be unique to Personal Fashion Show.
- **Hard to imitate:** This data takes months of regular use to build. However, a large competitor could shorten that time by offering easy wardrobe imports.
- **Non-substitutable:** Only partly. Students could use Pinterest, photos of their clothes or a notes app, but Pinterest shows clothing they do not own and manual organization takes more time and effort. Personal Fashion Show combines wardrobe organization, outfit generation, laundry tracking and social features in one place. Still, a competing wardrobe app with similar features could be a good substitute, making this the weakest part of the advantage.

### Resource 2: Campus communities

- **Valuable:** Because the network effect is local, students gain the most when their friends and classmates join and share outfits for the same classes and events.
- **Rare:** An active community of connected friendship groups on a specific campus is difficult to find elsewhere.
- **Hard to imitate:** A rival would need to convince entire friendship groups to adopt its wardrobe feature, not just individual users.
- **Non-substitutable:** Established relationships and shared outfit histories cannot easily be replaced by another app. This is the strongest advantage.

### A well-funded competitor

If a large fashion or social media platform added a digital wardrobe feature, it would already have a large customer base, more money, stronger brand recognition and better technology. However, having millions of users does not mean those users actively use the same feature. It could recreate the technical features within weeks, but building months of wardrobe history and active campus communities could take six months to a year or longer. This is an estimate: the rival could shorten it by offering easy imports or using its existing social networks.

### How the advantage grows

These advantages strengthen over time. A student who has uploaded 100 clothing items, saved months of outfits and connected with her friends would have little reason to switch, because she would need to rebuild her digital wardrobe and social connections. However, all of this depends on building an active, loyal customer base. The current prototype demonstrates the potential for a competitive moat rather than an established one.

## 5. Cloud and operations

What would it take to run this for real? Which parts would you buy as cloud services (SaaS, PaaS, IaaS), and what are the risks of relying on them?

Personal Fashion Show is currently hosted on GitHub Pages, with user information stored in the browser. A real version would need cloud services for secure accounts, data storage, payments and social interactions.

**SaaS (Software as a Service):** Personal Fashion Show would use existing services for secure logins, subscription payments and customer support, saving development time and money. However, payment providers charge transaction fees, which the company would need to factor into subscription pricing.

**PaaS (Platform as a Service):** A managed cloud platform would run the backend, database and image storage without the company maintaining its own servers. Storage costs could rise as users upload clothing photos, so image compression and spending alerts would help control expenses. Regular backups, standard technologies and data exports would reduce the risk of vendor lock-in.

**IaaS (Infrastructure as a Service):** Personal Fashion Show would not use IaaS initially, because managing virtual servers would require more technical knowledge, time and staff.

**Operational risks:** During an outage, the company would notify users and work with its cloud provider to restore service. Encryption, secure access controls and regular security updates would help protect customer information.

As the business grows, it would also need staff for technical maintenance, customer support and community moderation, as outlined in the project log's "What a real version would need" table.

## 6. Risks and ethics

What could go wrong — for your customers, their data, or society? What would you do about it?

**Privacy and data security:** Personal Fashion Show would collect personal information, clothing photos and wearing habits. If this information were leaked, users could face unwanted attention or harassment, or have details of their daily routines exposed. Accounts would be private by default, and users would control what they share. The company would collect only necessary information and let users permanently delete their accounts and data.

**Social comparison and body image:** Sharing outfits could lead users to compare themselves to others or feel pressure to look perfect, which goes against the purpose of Personal Fashion Show. The platform would encourage everyday outfits, outfit repeating and creativity, and a friends-only feed would reduce the pressure of sharing with strangers.

**Inappropriate content and harassment:** Community features could lead to negative comments, bullying or inappropriate photo sharing. Users could report content, block accounts and control who sees their posts. Clear community guidelines and moderation would help users feel comfortable expressing their personal style.

---

**AI use:** I used Claude to brainstorm, point out weak spots in my drafts against the rubric, line-edit my sections for clarity and length, and help organize my ideas into sections 3 and 4 (including restructuring section 4 into a VRIN test for each resource). I used Claude Code to fix Markdown formatting and commit my work. The business idea, examples and reasoning are my own.
