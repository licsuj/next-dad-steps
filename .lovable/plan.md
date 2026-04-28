## Goal
Create the first version of **NextRoutine**: a monetizable website for new and expecting fathers who feel lost and need a clear next step based on their current stage of fatherhood.

The site will position NextRoutine as a **guided coach for dads**, not just another parenting blog.

## Core positioning

**Brand promise:**
“Your next step as a dad, every week.”

**Audience:**
- Men who just found out they are going to be fathers
- Expecting dads throughout pregnancy
- New dads in the newborn phase
- Fathers navigating the first year

**Tone:**
Bold, mission-driven, direct, and reassuring. The site should make fathers feel: “I may not know everything yet, but I can become ready one routine at a time.”

## Landing page structure

### 1. Hero section
Create a strong above-the-fold section that keeps dads curious and attached.

Content direction:
- Headline focused on transformation, not information overload
- Subheadline explaining that NextRoutine gives dads stage-based guidance from pregnancy news through the first year
- Primary CTA: join the weekly newsletter / start the dad readiness journey
- Secondary CTA: preview the PRO plan
- A visual “weekly dad routine” card showing examples of what a dad receives

Example angle:
“Fatherhood does not come with a manual. NextRoutine gives you the next move.”

### 2. Problem section
Show that the brand understands the emotional gap:
- Most advice is aimed at mothers
- Dads often feel useful but unsure
- The timeline is confusing: pregnancy, birth, newborn, first year
- Men need practical actions, not endless content

### 3. Stage-based guidance section
Present the core concept: different dads need different guidance.

Stages to show:
- Just got the news
- Pregnancy months 1–3
- Pregnancy months 4–6
- Pregnancy months 7–9
- Birth and hospital week
- Newborn months 0–3
- Baby months 3–6
- Baby months 6–12

Each stage should include example outcomes like:
- What to learn
- What to prepare
- How to support your partner
- What routines to start
- What mistakes to avoid

### 4. Dad Readiness Challenge / Plan
Introduce a signature product concept:

**The Dad Readiness Plan**
A guided weekly plan that helps fathers build confidence through small missions.

Examples:
- Week 1: Know your role
- Week 2: Build the support routine
- Week 3: Money and home prep
- Week 4: Partner check-in system
- Week 5: Birth plan basics
- Week 6: Newborn survival routine

This can be shown as a preview on the landing page and later become the main PRO experience.

### 5. Newsletter offer
Create a strong free newsletter signup section.

Free weekly newsletter should include:
- One stage-based dad lesson
- One practical action
- One partner-support move
- One mistake to avoid
- One recommended resource or checklist

Position it as:
“Every week, get one clear fatherhood move based on where you are.”

For the first implementation, the form can collect an email visually. If backend/email capture is needed later, we can connect it to Lovable Cloud.

### 6. PRO subscription offer
Define what paid subscribers get.

**NextRoutine PRO unlocks:**
- Personalized weekly plan based on pregnancy month or baby age
- Premium guides and deep-dive content
- Tools and trackers
- Dad readiness score
- Weekly missions/challenges
- Partner support checklist
- Hospital bag and birth prep checklists
- First-year routine planner
- Sleep/support routine tracker
- Monthly “what matters now” brief

Landing page should make the paid offer feel concrete even before payments are implemented.

### 7. Pricing preview
Add a pricing/PRO preview section without enabling payments yet.

Suggested structure:
- Free: Weekly dad newsletter
- PRO: Personalized plan, premium guides, tools, trackers, challenges

CTA can say:
- “Join the waitlist”
- “Get early access”
- “Preview PRO”

This avoids implementing payments before the offer is validated.

### 8. FAQ section
Answer common objections:
- “Is this only for expecting dads?”
- “What if my baby is already born?”
- “Is this medical advice?”
- “How is this different from a parenting blog?”
- “What will PRO include?”

Include a clear disclaimer that NextRoutine is guidance and education, not medical advice.

### 9. Final CTA
End with a bold mission-driven CTA:
“Stop guessing. Start becoming ready.”

## Visual direction

Design should feel modern, masculine, premium, and calm without being cold.

Style direction:
- Dark navy or charcoal background
- Strong white typography
- Electric blue or warm amber accent
- Clean cards with subtle borders
- Mission-style sections
- Minimal but confident visuals
- Mobile-first layout

Suggested visual elements:
- Timeline cards
- Readiness score card
- Weekly mission cards
- Stage selector preview
- PRO plan comparison cards

## Technical implementation scope for first build

Implement as a polished single-page React landing page at `/`.

Likely files to update:
- `src/pages/Index.tsx` — replace placeholder with the full NextRoutine landing page
- `src/index.css` — adjust design tokens for the brand theme if needed
- Possibly Tailwind classes only; no backend required for the first version

No payment integration in this first step. Payments should come after the offer, pricing, and PRO features are validated. When ready, we can enable Lovable’s built-in payments and build subscription checkout.

No full newsletter backend in this first step unless requested next. The landing page can include a strong signup/waitlist UI first; later we can connect real email capture and app emails through Lovable Cloud.

## Future phases after this landing page

### Phase 2: Real newsletter capture
Connect the signup form to Lovable Cloud so emails are stored and confirmations can be sent.

### Phase 3: PRO subscription
Enable payments and add subscription checkout.

### Phase 4: Personalized dad dashboard
Build a logged-in PRO area where dads enter due date or baby birth date and receive their weekly plan, challenge, trackers, and premium content.

### Phase 5: Content engine
Add the stage-based content system for all fatherhood stages from “just got the news” to baby’s first year.