# Blue Heron Café — SEO Implementation Guide
> **For Claude Code:** Read this file at the start of every SEO session. It contains project context, session progress, file map, and the full SEO knowledge base. Update the progress checkboxes after completing each task.

---

## How to Use This Document

At the start of each session, paste this into Claude Code:
```
Read docs/SEO_IMPLEMENTATION.md fully before doing anything else. Use it as your source of truth for the project context, what has already been done, what needs doing, and all SEO rules. After completing your session tasks, update the checkboxes in the Session Progress section to reflect what was completed.
```

---

## Project Context

| Property | Value |
|---|---|
| Site name | Blue Heron Café |
| Domain | https://blueheronsamuels.com |
| Framework | Next.js 14, Pages Router |
| CMS | Sanity (projectId: k63h5ik3) |
| Styling | Tailwind CSS |
| Deployment | Vercel (assumed) |
| Sitemap | next-sitemap (postbuild script) |
| Primary SEO gap | Not ranking for "lunch in Sandpoint" and similar local queries |

### Business Info (canonical — use these exact values everywhere)
```
Name:     Blue Heron Café
Address:  486260 US-95, Samuels, ID 83864
Phone:    (208) 263-1146
Email:    info@blueheronsamuels.com
Website:  https://blueheronsamuels.com
Facebook: https://www.facebook.com/blueheronsandpoint
Instagram: https://www.instagram.com/blue.heroncafe
Coords:   48.3686, -116.5535
```

### Correct Opening Hours (use these — the codebase had wrong hours)
```
Sunday:    6:00am – 2:00pm
Monday:    6:00am – 2:00pm
Tuesday:   6:00am – 7:30pm
Wednesday: 6:00am – 7:30pm
Thursday:  6:00am – 7:30pm
Friday:    6:00am – 8:30pm
Saturday:  6:00am – 8:30pm
```

### Target Keywords (primary)
- lunch in Sandpoint Idaho
- breakfast near Sandpoint
- lunch near Sandpoint Idaho
- cafe near Sandpoint Idaho
- restaurant Samuels Idaho
- outdoor dining Sandpoint area
- live music Sandpoint Idaho
- hidden gem restaurant North Idaho
- country cafe Bonner County Idaho
- Samuels Store cafe

---

## File Map

```
/pages
  _app.js              — Global shell. Should only have: viewport, favicon, manifest, LocalBusinessSchema.
  index.js             — Homepage. Uses SEO component + restaurantSchema + faqSchema.
  about.js             — Has SEO component. ✓
  menu.js              — Has SEO component + menuSchema + breadcrumb. ✓
  contact.js           — MISSING SEO component (Session 3 target)
  gallery.js           — MISSING SEO component (Session 3 target)
  samuels.js           — MISSING SEO component (Session 3 target)
  events/
    index.js           — Uses bare <Head>, not SEO component (Session 4 target)
    [slug].js          — Uses bare <Head> (acceptable for dynamic, monitor)

/components
  SEO.js               — Custom Head wrapper. Must handle jsonLd as array OR object.
  LocalBusinessSchema.js — Global JSON-LD injected in _app.js. Restaurant + LocalBusiness type.
  Navbar.js            — Logo img alt needs keyword update (Session 5)
  Footer.js            — NAP data. Address needs street number (Session 3)
  HeroSection.js       — Hero img alt needs keyword update (Session 5)
  AboutSection.js      — Owner img alt needs keyword update (Session 5)
  GallerySection.js    — Default alt text needs update (Session 5)
  MenuSection.js       — OK
  ReviewSection.js     — OK
  StableEventsShowcase.js — OK
  MenuShowcase.js      — OK

/lib
  sanity.js            — Sanity client + query functions
  structuredData.js    — Schema generators. Needs: hour fix, generateFAQSchema() added.

/next-sitemap.config.js — Sitemap/robots config. Needs: verify dynamic pages included.
```

---

## Session Progress

### Session 1 — `_app.js` Foundation
**Files:** `pages/_app.js`

- [x] Remove duplicate `<title>` and `<meta name="description">` from global `<Head>`
- [x] Add `<link rel="preconnect" href="https://cdn.sanity.io" />`
- [x] Add `<link rel="dns-prefetch" href="https://cdn.sanity.io" />`
- [x] Add `<meta name="theme-color" content="#0891b2" />`
- [x] Add `<meta name="application-name" content="Blue Heron Café" />`
- [x] Add `<link rel="manifest" href="/site.webmanifest" />`
- [x] Confirm `<LocalBusinessSchema />` remains untouched

---

### Session 2 — Schema Accuracy
**Files:** `components/LocalBusinessSchema.js`, `lib/structuredData.js`

- [x] Fix opening hours in `LocalBusinessSchema.js` using `openingHoursSpecification` format
- [x] Fix opening hours in `structuredData.js` `generateRestaurantSchema()`
- [x] Add `sameAs` array to `LocalBusinessSchema.js` with Facebook + Instagram URLs
- [x] Add `generateFAQSchema()` export to `lib/structuredData.js` with 5 Q&A pairs:
  - [x] Location (mentions "15 minutes south of Sandpoint")
  - [x] Lunch service confirmation
  - [x] Hours summary
  - [x] Outdoor seating confirmation
  - [x] Live music confirmation

---

### Session 3 — Missing Page SEO
**Files:** `pages/contact.js`, `pages/gallery.js`, `pages/samuels.js`, `components/Footer.js`

- [x] Add `<SEO>` component to `contact.js` with local keywords
- [x] Update `contact.js` h1 to include location signal
- [x] Add breadcrumb schema to `contact.js`
- [x] Add `<SEO>` component to `gallery.js`
- [x] Add h1 tag to `gallery.js`
- [x] Add breadcrumb schema to `gallery.js`
- [x] Add `<SEO>` component to `samuels.js`
- [x] Add breadcrumb schema to `samuels.js`
- [x] Fix Footer.js address: "Samuels Store, ID 83864" → "486260 US-95, Samuels, ID 83864"

---

### Session 4 — Events Page + Homepage
**Files:** `pages/events/index.js`, `pages/index.js`, `components/SEO.js`

- [x] Replace bare `<Head>` in `events/index.js` (both return paths) with `<SEO>` component
- [x] Add breadcrumb schema to `events/index.js`
- [x] Add local keywords to `events/index.js` SEO (live music near Sandpoint, etc.)
- [x] Update `index.js` SEO keywords to include all primary target keywords
- [x] Import `generateFAQSchema` in `index.js`
- [x] Pass `jsonLd={[restaurantSchema, generateFAQSchema()]}` to homepage SEO component
- [x] Verify `SEO.js` handles `jsonLd` as both array and object — update if needed

---

### Session 5 — Images, Keywords, Sitemap
**Files:** `components/HeroSection.js`, `components/AboutSection.js`, `components/Navbar.js`, `components/GallerySection.js`, `next-sitemap.config.js`

- [x] Update hero img alt in `HeroSection.js` to describe café + location
- [x] Update owner img alt in `AboutSection.js` to include location
- [x] Update logo img alt in `Navbar.js` to include location signal
- [x] Update default gallery alt in `GallerySection.js`
- [x] Verify `/gallery`, `/contact`, `/samuels` are not in sitemap exclude list
- [x] Add transform entries for those pages with priority 0.7, changefreq "monthly"
- [x] Remove duplicate sitemap URL from `additionalSitemaps` if present

---

## SEO Knowledge Base

> This section exists so Claude Code has accurate SEO context without relying on training data. Treat this as the authoritative reference for all decisions made on this project.

---

### How Google Ranks Local Businesses

Google uses three main signals for local search ("lunch in Sandpoint"):

1. **Relevance** — Does the page content match the search query? This is where keyword targeting, schema markup, and page copy matter.
2. **Distance** — How close is the business to the searcher? This is largely controlled by Google Business Profile, not the website.
3. **Prominence** — How well-known is the business? Driven by reviews, citations, backlinks, and engagement.

The website controls Relevance almost entirely. Distance and Prominence require off-site work (Google Business Profile, review volume, local citations). This implementation focuses on Relevance.

---

### The NAP Rule

**NAP = Name, Address, Phone.** Google cross-references your business's NAP across your website, Google Business Profile, Yelp, Facebook, and dozens of other directories. Inconsistencies confuse the algorithm and suppress local rankings.

**Rule:** Every place NAP appears in this codebase must be byte-for-byte identical:
```
Blue Heron Café
486260 US-95, Samuels, ID 83864
(208) 263-1146
```
This includes: Footer, Contact page, all JSON-LD schemas, and any hardcoded text. The café name uses the **é** character — do not substitute a plain `e`.

---

### Schema Markup (Structured Data)

Schema.org markup in JSON-LD format tells Google exactly what a page is about. For a local restaurant, the highest-value schema types are:

**`Restaurant` + `LocalBusiness`** (already implemented globally)
- Most important fields: `name`, `address`, `telephone`, `openingHoursSpecification`, `servesCuisine`, `geo`, `url`, `image`
- `aggregateRating` — only include if the values are real and kept current
- `sameAs` — list all social profiles; Google uses this to connect the entity

**`FAQPage`** (to be added to homepage)
- Directly powers the FAQ rich result in Google search (expandable Q&A under the listing)
- Each `Question` needs a `name` (the question) and an `acceptedAnswer` with `text`
- Questions should mirror real search queries people type ("does Blue Heron have outdoor seating")

**`BreadcrumbList`** (added to inner pages)
- Tells Google the site hierarchy
- Appears as "Blue Heron Café > Menu" in the search result URL line
- Small trust signal, easy win

**`Event`** (already in `structuredData.js`)
- Each event page should inject its own Event schema via `getStaticProps`
- Required fields: `name`, `startDate`, `location`, `eventStatus`, `eventAttendanceMode`

**`Menu` / `MenuItem`** (already partially implemented)
- Helps Google understand what food is served
- Powers "serves burgers" type filters in local search

**Opening Hours Format:**
```json
"openingHoursSpecification": [
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Sunday", "Monday"],
    "opens": "06:00",
    "closes": "14:00"
  },
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Tuesday", "Wednesday", "Thursday"],
    "opens": "06:00",
    "closes": "19:30"
  },
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Friday", "Saturday"],
    "opens": "06:00",
    "closes": "20:30"
  }
]
```

---

### Title Tag Rules

- Format: `{Page Topic} | Blue Heron Café — {Location Signal}`
- Length: 50–60 characters (Google truncates at ~60)
- Must include the primary keyword for that page near the front
- Every page must have a unique title tag
- Homepage title is the most important — lead with the brand name and top keyword

Good examples:
```
Blue Heron Café | Fresh Country Dining in Samuels, Idaho
Menu | Blue Heron Café — Breakfast & Lunch in Samuels, ID
Events | Blue Heron Café — Live Music Near Sandpoint, Idaho
Contact Blue Heron Café | Samuels, Idaho — Hours & Directions
```

---

### Meta Description Rules

- Length: 140–160 characters
- Not a direct ranking factor but controls click-through rate from search results
- Should include 1–2 target keywords naturally
- Must read like a human wrote it — not a keyword list
- Every page must have a unique description

Good example:
```
Hidden gem café in Samuels, Idaho serving fresh homestyle food. 
Live music events, outdoor patio, and cozy atmosphere near Sandpoint. 
Open daily.
```
(158 characters)

---

### Canonical URLs

A canonical tag (`<link rel="canonical">`) tells Google which URL is the "real" version of a page. This prevents duplicate content penalties when the same page is accessible at multiple URLs (e.g. with/without trailing slash, http vs https).

Rule: Every page should have a canonical pointing to its own absolute URL:
```html
<link rel="canonical" href="https://blueheronsamuels.com/menu" />
```
The `SEO.js` component already handles this via the `canonical` prop. Ensure it's passed on every page.

---

### Image Alt Text Rules

Alt text serves two purposes: accessibility (screen readers) and SEO (Google Images + keyword signals).

Rules:
- Describe what is literally in the image
- Include a location or business name signal where natural
- Never keyword-stuff ("lunch sandpoint idaho cafe food restaurant")
- Never leave alt text empty on meaningful images
- Decorative images (pure UI) can have `alt=""`

Good examples:
```
alt="Blue Heron Café outdoor patio with string lights in Samuels, Idaho"
alt="Fresh eggs benedict breakfast plate at Blue Heron Café"
alt="Live music performance on the outdoor stage near Sandpoint, Idaho"
```

---

### Core Web Vitals (Performance as SEO Signal)

Google uses page speed as a ranking factor via Core Web Vitals. The three metrics:

- **LCP (Largest Contentful Paint)** — how fast the biggest visible element loads. Target: under 2.5s. Main fix: preconnect to Sanity CDN, use Next.js `<Image>` with `priority` on hero images.
- **CLS (Cumulative Layout Shift)** — how much the page jumps around while loading. Target: under 0.1. Main fix: always set explicit width/height on images.
- **INP (Interaction to Next Paint)** — responsiveness. Target: under 200ms. Main fix: avoid heavy JS on initial load.

The `preconnect` tags added in Session 1 directly address LCP for Sanity-hosted images.

---

### Sitemap Best Practices

The `next-sitemap` package auto-generates `sitemap.xml` and `robots.txt` on build.

Priority guidelines (already in `next-sitemap.config.js`):
```
/           → priority 1.0, changefreq weekly
/menu       → priority 0.9, changefreq weekly
/events     → priority 0.8, changefreq daily
/events/*   → priority 0.6, changefreq weekly
/about      → priority 0.7, changefreq monthly
/contact    → priority 0.7, changefreq monthly
/gallery    → priority 0.7, changefreq monthly
/samuels    → priority 0.7, changefreq monthly
```

The `robots.txt` should allow all crawlers on `/` and disallow `/admin` and `/api`.

Dynamic event pages (`/events/[slug]`) are generated via `getStaticPaths` — verify they appear in the built sitemap.

---

### What This Codebase Cannot Control (Off-Site SEO)

After all on-site work is done, the following off-site actions will have the largest remaining impact on local rankings:

1. **Google Business Profile** — Claim and fully complete the profile at business.google.com. This is the single highest-leverage action for "lunch in Sandpoint" type searches. Add photos, hours, menu link, and respond to all reviews.

2. **Review Volume** — The site's ReviewSection shows real reviews but they're hardcoded. Actual Google/Yelp review count directly influences local ranking. Every visit should prompt a review ask.

3. **Local Citations** — Ensure NAP is consistent on: Yelp, TripAdvisor, Facebook, Apple Maps, Bing Places, and Idaho-specific directories. Use the exact NAP format defined above.

4. **Backlinks** — Links from local news sites (Sandpoint Reader, Bonner County Daily Bee), Visit North Idaho, local tourism blogs, and food bloggers all boost prominence. One local news mention outweighs dozens of generic directory listings.

5. **Google Search Console** — Verify the site at search.google.com/search-console. Submit the sitemap URL. Monitor for crawl errors, coverage issues, and which queries are already driving impressions.

---

## Validation Checklist (Run After All Sessions Complete)

Use these tools to verify implementation:

- [ ] **Google Rich Results Test** — https://search.google.com/test/rich-results — paste homepage URL, verify Restaurant + FAQ schemas render without errors
- [ ] **Schema Markup Validator** — https://validator.schema.org — paste JSON-LD from each schema file
- [ ] **Google PageSpeed Insights** — https://pagespeed.web.dev — run on homepage, target LCP < 2.5s
- [ ] **Sitemap check** — visit https://blueheronsamuels.com/sitemap.xml after deploy, verify all pages present
- [ ] **Robots check** — visit https://blueheronsamuels.com/robots.txt, verify no important pages are blocked
- [ ] **Mobile Friendly Test** — https://search.google.com/test/mobile-friendly
- [ ] **Open Graph preview** — https://www.opengraph.xyz — paste homepage URL, verify image, title, description render correctly

---

*Last updated: Session 5 complete (2026-05-11). All 5 sessions fully implemented.*
