I’ll add three standalone SEO pages that fit the current warm, reassuring NextRoutine tone and connect into the existing quiz hub, guide cluster, and PRO waitlist.

## Pages to create

1. `/first-time-dad`
   - Target intent: first-time dads who feel unsure what to do next.
   - Copy angle: reassurance, small weekly moves, partner support, practical confidence.
   - Internal links:
     - Father readiness quiz hub
     - First-time dad checklist guide
     - Pregnancy guide
     - Newborn tips guide
     - PRO section on the homepage

2. `/pregnancy-month-by-month`
   - Target intent: expecting dads looking for what to do during each month/stage of pregnancy.
   - Copy angle: month-by-month preparation without overwhelm, split into early/mid/late pregnancy.
   - Internal links:
     - Pregnancy guide for dads
     - Partner support guide
     - Father readiness quiz hub
     - PRO section

3. `/newborn-readiness`
   - Target intent: dads preparing for the first days/weeks with a newborn.
   - Copy angle: calm routines for sleep support, feeding help, partner recovery, bonding, and home resets.
   - Internal links:
     - Newborn tips for dads
     - First-time dad checklist
     - Father readiness quiz hub
     - PRO section

## Page structure

Each page will use a consistent, premium SEO landing page layout:

- Header with NextRoutine, quiz hub, and PRO links
- Hero section with keyword-focused H1 and reassuring subtext
- “What to focus on next” card grid
- Stage/action section tailored to that topic
- Related guides/internal links block
- PRO CTA that makes the upgrade feel like a natural next step, not a hard sell

## SEO updates

I’ll add dynamic metadata for each page:

- Page title
- Meta description
- Open Graph title/description
- Twitter title/description
- Canonical URL

I’ll also add structured data where appropriate, likely `WebPage` or `Article` style schema, using the existing NextRoutine domain pattern.

## Navigation and internal linking

I’ll update the existing SEO cluster links section on the homepage so these new dedicated pages are discoverable from the landing page, not orphaned.

I’ll also update the quiz hub / related-resource area to include these new pages alongside the existing guide articles, creating a stronger topic cluster:

```text
Homepage
  -> Father readiness quiz hub
  -> First-time dad SEO page
  -> Pregnancy month-by-month SEO page
  -> Newborn readiness SEO page

SEO pages
  -> Quiz hub
  -> Related guides
  -> Related SEO pages
  -> PRO plan

Guide articles
  -> Quiz hub
  -> Related guides
  -> PRO plan
```

## Sitemap

I’ll add the three new URLs to `public/sitemap.xml` so search engines can discover them:

- `https://nextroutine.com/first-time-dad`
- `https://nextroutine.com/pregnancy-month-by-month`
- `https://nextroutine.com/newborn-readiness`

## Technical implementation

- Extend `src/pages/SeoCluster.tsx` with a reusable SEO landing page component and topic data for the three new pages.
- Add routes in `src/App.tsx` for the three new paths.
- Update the existing `SeoClusterLinks` component to include these pages.
- Update `public/sitemap.xml`.
- Keep existing styling consistent with the current warm cream/off-white background, deep navy/forest text, rounded cards, soft borders, sage/amber accents, and spacious layout.