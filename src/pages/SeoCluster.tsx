import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check, ClipboardList, HeartHandshake, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const articles = [
  {
    slug: "first-time-dad-checklist",
    title: "First-Time Dad Checklist: What to Prepare Before Baby Arrives",
    description: "A practical first-time dad checklist covering appointments, home routines, partner support, birth prep, and the first days with a newborn.",
    eyebrow: "Fatherhood checklist",
    intro: "Becoming a dad can feel huge. This checklist keeps it simple: focus on the next useful thing, then repeat.",
    sections: [
      ["Start with the basics", "Know the due date, key appointments, emergency contacts, insurance details, and the practical things your partner should not have to remember alone."],
      ["Build one home routine early", "Pick one system you fully own: meals, laundry, grocery restock, appointment notes, or the baby supply station."],
      ["Prepare for birth week", "Pack your own hospital items, know the route, discuss visitor boundaries, and agree on how you can support your partner during labor and recovery."],
      ["Plan the first 72 hours", "Think about food, sleep shifts, visitors, recovery, feeding support, and who handles household resets when everyone is tired."],
    ],
    cta: "Turn this checklist into a weekly PRO plan",
  },
  {
    slug: "pregnancy-guide-for-dads",
    title: "Pregnancy Guide for Dads: What to Do Each Stage",
    description: "A stage-by-stage pregnancy guide for dads with practical weekly routines, partner support prompts, and preparation tips.",
    eyebrow: "Pregnancy guide for dads",
    intro: "Pregnancy advice often speaks around dads. This guide gives you clear ways to be useful from the first news through birth week.",
    sections: [
      ["Just got the news", "Listen first, ask what support feels helpful, and create a shared place for appointments, questions, and next steps."],
      ["Months 1–3", "Energy may be low and symptoms may be invisible. Take on one recurring task and keep the household rhythm steady."],
      ["Months 4–6", "Use this window to plan calmly: budget, home systems, birth questions, and weekly partner check-ins."],
      ["Months 7–9", "Reduce decisions before the baby arrives. Prepare the hospital list, first 72-hour plan, and visitor boundaries."],
    ],
    cta: "Get a stage-based pregnancy plan in PRO",
  },
  {
    slug: "how-to-support-pregnant-partner",
    title: "How to Support Your Pregnant Partner Without Guessing",
    description: "Simple ways dads can support a pregnant partner with better questions, practical routines, emotional steadiness, and shared preparation.",
    eyebrow: "Partner support",
    intro: "You do not need perfect words. You need attention, follow-through, and a few small routines that make life lighter.",
    sections: [
      ["Ask better questions", "Try: What would make this week easier? What should I take off your plate? What do you want me to understand right now?"],
      ["Own something completely", "Do not just help. Own a routine end-to-end so your partner does not have to manage the task or remind you."],
      ["Stay emotionally available", "Pregnancy can bring uncertainty. Your calm presence matters, especially when you do not have a solution."],
      ["Review the week together", "A short weekly check-in helps prevent resentment and keeps both of you aligned before stress builds."],
    ],
    cta: "Use PRO partner-support prompts each week",
  },
  {
    slug: "newborn-tips-for-dads",
    title: "Newborn Tips for Dads: Simple Routines for the First 3 Months",
    description: "Newborn tips for dads focused on sleep support, feeding help, partner recovery, bonding, and calm weekly routines.",
    eyebrow: "Newborn tips for dads",
    intro: "The newborn stage is not about doing everything perfectly. It is about creating a few repeatable supports when everyone is tired.",
    sections: [
      ["Create a night support plan", "Know what you can own during nights: diapers, burping, bottle prep, water, snacks, logging, or settling after feeds."],
      ["Protect recovery time", "Your partner may need rest, food, hydration, emotional reassurance, and fewer decisions. Make one recovery block easier each day."],
      ["Bond through repetition", "Bonding does not need to be dramatic. A repeated walk, song, bath routine, or morning hold builds familiarity."],
      ["Reset the home daily", "One small daily reset can change the mood: bottles, laundry, dishes, trash, meals, or restocking the changing station."],
    ],
    cta: "Get newborn routines in your PRO plan",
  },
];

const topicPages = [
  {
    slug: "first-time-dad",
    path: "/first-time-dad",
    title: "First-Time Dad Guide: Your Next Step Before Baby Arrives",
    seoTitle: "First-Time Dad Guide for Expecting Fathers | NextRoutine",
    description: "A reassuring first-time dad guide with practical weekly steps for pregnancy, partner support, newborn prep, and building confidence without overwhelm.",
    eyebrow: "First-time dad guide",
    intro: "You do not have to become a different person overnight. Start by knowing what matters this week, what your partner should not have to carry alone, and one small move you can repeat.",
    focus: [
      ["Know your current stage", "Pregnancy, birth week, and newborn life ask for different kinds of support. Start by naming the stage you are in so the next step feels clear."],
      ["Own one useful routine", "Choose a repeatable task you can handle without reminders: appointments, groceries, laundry, meals, baby supplies, or the weekly home reset."],
      ["Ask better questions", "A simple check-in can help more than a perfect speech: what would make this week lighter, what feels uncertain, and what can I take off your plate?"],
    ],
    stepsTitle: "Small weekly moves for first-time dads",
    steps: [
      ["This week", "Take the father readiness quiz, write down the next practical task, and choose one routine to own."],
      ["Before birth", "Review appointments, money, hospital logistics, visitor boundaries, and the first 72 hours at home."],
      ["After baby arrives", "Support recovery, protect sleep where possible, reset the home daily, and build one simple bonding ritual."],
    ],
    guides: ["first-time-dad-checklist", "pregnancy-guide-for-dads", "newborn-tips-for-dads"],
    cta: "Build your first-time dad plan in PRO",
  },
  {
    slug: "pregnancy-month-by-month",
    path: "/pregnancy-month-by-month",
    title: "Pregnancy Month by Month for Dads: What to Do Next",
    seoTitle: "Pregnancy Month by Month for Dads | NextRoutine",
    description: "A calm pregnancy month-by-month guide for dads with practical support steps from the first trimester through birth week.",
    eyebrow: "Pregnancy month by month",
    intro: "Pregnancy can move slowly and suddenly at the same time. A month-by-month view helps you show up without trying to solve everything at once.",
    focus: [
      ["Months 1–3", "Keep things steady while symptoms may be invisible. Listen first, track appointments, and take one household routine fully off your partner’s plate."],
      ["Months 4–6", "Use the calmer window to plan: budget, home systems, baby basics, questions for appointments, and a weekly partner check-in."],
      ["Months 7–9", "Reduce decisions before everyone is tired. Prepare birth logistics, visitor boundaries, hospital items, and the first days at home."],
    ],
    stepsTitle: "How dads can prepare by pregnancy stage",
    steps: [
      ["Early pregnancy", "Create a shared note for dates, questions, symptoms, tasks, and anything your partner wants you to remember."],
      ["Mid pregnancy", "Pick one system to simplify before baby arrives: meals, money, laundry, appointments, or home restocking."],
      ["Late pregnancy", "Build the birth-week plan and first 72-hour plan so your family has fewer choices to make under stress."],
    ],
    guides: ["pregnancy-guide-for-dads", "how-to-support-pregnant-partner", "first-time-dad-checklist"],
    cta: "Get a month-by-month PRO plan",
  },
  {
    slug: "newborn-readiness",
    path: "/newborn-readiness",
    title: "Newborn Readiness for Dads: Simple First-Weeks Prep",
    seoTitle: "Newborn Readiness for Dads | NextRoutine",
    description: "A newborn readiness guide for dads covering sleep support, feeding help, partner recovery, bonding, home resets, and the first weeks with baby.",
    eyebrow: "Newborn readiness",
    intro: "Newborn readiness is not about having every product or every answer. It is about a few calm systems that help when everyone is tired and learning.",
    focus: [
      ["Night support", "Know what you can own during nights: diapers, burping, bottle prep, water, snacks, logging, settling, or the next-morning reset."],
      ["Partner recovery", "Make rest, food, hydration, reassurance, and fewer decisions part of the plan rather than something your partner has to ask for."],
      ["Home rhythm", "A daily reset for bottles, laundry, dishes, trash, meals, or the changing station can make the whole house feel less overwhelmed."],
    ],
    stepsTitle: "What to prepare before the newborn stage",
    steps: [
      ["Before baby arrives", "Set up supply stations, visitor boundaries, food support, emergency contacts, and a simple night-shift handoff."],
      ["First 72 hours", "Focus on recovery, feeding support, sleep protection, household basics, and helping your partner avoid unnecessary decisions."],
      ["First month", "Repeat one bonding ritual, one home reset, and one partner recovery block until the routine starts to feel familiar."],
    ],
    guides: ["newborn-tips-for-dads", "first-time-dad-checklist", "how-to-support-pregnant-partner"],
    cta: "Get newborn readiness steps in PRO",
  },
];


const blogRolloutPosts = [
  {
    week: "Week 1",
    stage: "Pregnancy",
    slug: "pregnancy-dad-next-steps",
    path: "/blog/pregnancy-dad-next-steps",
    title: "Pregnancy for Dads: The First Calm Steps After the News",
    seoTitle: "Pregnancy for Dads: First Steps After the News | NextRoutine",
    description: "A reassuring pregnancy guide for dads with practical first steps after finding out, including partner support, appointments, routines, and weekly preparation.",
    eyebrow: "Pregnancy stage",
    intro: "The first pregnancy weeks can feel exciting, strange, and unreal. You do not need a perfect plan on day one. You need a calm way to listen, notice what changed, and take one useful thing off your partner’s plate.",
    sections: [
      ["Start by slowing down", "Before buying everything or researching every possible outcome, make room for the conversation at home. Ask what your partner is feeling, what kind of support feels helpful, and what would make the next few days lighter."],
      ["Create one shared source of truth", "Use a shared note for appointment dates, questions for the doctor, symptoms, insurance details, family decisions, and tasks. This helps you become part of the rhythm instead of waiting to be updated."],
      ["Own one routine early", "Early pregnancy can be physically intense even when nothing looks different from the outside. Choose one recurring task to own completely: meals, groceries, laundry, calendar reminders, or evening resets."],
      ["Make the week feel smaller", "A good first week is not about becoming an expert. It is about knowing the next appointment, asking one better question, and doing one repeatable thing that lowers stress."],
    ],
    takeaways: ["Ask what support feels helpful before assuming.", "Track dates, questions, and tasks in one shared place.", "Own one recurring routine without reminders."],
    related: ["pregnancy-month-by-month", "pregnancy-guide-for-dads", "how-to-support-pregnant-partner"],
  },
  {
    week: "Week 2",
    stage: "Birth",
    slug: "birth-week-dad-plan",
    path: "/blog/birth-week-dad-plan",
    title: "Birth Week for Dads: A Simple Plan for Staying Calm and Useful",
    seoTitle: "Birth Week Plan for Dads | NextRoutine",
    description: "A practical birth week plan for dads covering hospital logistics, partner support, visitor boundaries, and the first ride home.",
    eyebrow: "Birth stage",
    intro: "Birth week is not the time to prove how much you know. It is the time to be steady, prepared, and present while your partner does something enormous.",
    sections: [
      ["Know the logistics before they matter", "Confirm the route, parking, hospital entrance, documents, phone chargers, snacks, and who to contact. Small details feel much bigger when labor starts."],
      ["Talk about support before labor", "Ask what kind of presence your partner wants: quiet reassurance, practical reminders, advocacy, touch, space, or help communicating preferences."],
      ["Set visitor expectations early", "Birth and recovery are not public events unless your family wants them to be. Decide who gets updates, who visits, and what boundaries protect recovery."],
      ["Prepare for the ride home", "The transition home can feel surprisingly emotional. Have food, supplies, sleep expectations, and a simple first-night plan ready before you leave."],
    ],
    takeaways: ["Handle logistics so your partner does not have to.", "Agree on visitor boundaries before anyone asks.", "Prepare the first night at home, not just the hospital bag."],
    related: ["first-time-dad-checklist", "newborn-readiness", "father-readiness-quiz"],
  },
  {
    week: "Week 3",
    stage: "Week 1",
    slug: "newborn-week-1-dad-guide",
    path: "/blog/newborn-week-1-dad-guide",
    title: "Newborn Week 1 for Dads: What Actually Helps at Home",
    seoTitle: "Newborn Week 1 Guide for Dads | NextRoutine",
    description: "A newborn week 1 guide for dads focused on recovery support, sleep protection, feeding help, household resets, and calm first steps at home.",
    eyebrow: "Newborn week 1",
    intro: "The first week home can feel like time is moving strangely. Your job is not to make everything smooth. Your job is to reduce friction, protect recovery, and keep the basics moving.",
    sections: [
      ["Protect recovery blocks", "Your partner may need food, water, medication reminders, rest, reassurance, and fewer decisions. Look for the next recovery block you can make easier."],
      ["Learn the feeding rhythm", "Whether feeding involves nursing, pumping, formula, or a mix, there are ways to help: supplies, burping, logging, cleanup, snacks, water, and emotional steadiness."],
      ["Reset the home once a day", "Choose one daily reset that changes the mood: dishes, bottles, laundry, trash, meals, or restocking the changing station."],
      ["Keep visitors from creating work", "Visitors should not become another thing to manage. Protect quiet, recovery, feeding privacy, and the option to say no."],
    ],
    takeaways: ["Make one recovery block easier every day.", "Support the feeding rhythm practically and emotionally.", "Own one daily home reset."],
    related: ["newborn-readiness", "newborn-tips-for-dads", "how-to-support-pregnant-partner"],
  },
  {
    week: "Week 4",
    stage: "Weeks 2–3",
    slug: "newborn-weeks-2-3-routine",
    path: "/blog/newborn-weeks-2-3-routine",
    title: "Newborn Weeks 2–3: Build a Simple Dad Routine Without Overthinking",
    seoTitle: "Newborn Weeks 2–3 Dad Routine | NextRoutine",
    description: "A guide for dads in newborn weeks 2 and 3 with simple routines for nights, recovery, bonding, household resets, and partner check-ins.",
    eyebrow: "Newborn weeks 2–3",
    intro: "By weeks two and three, the first shock may fade and the tiredness may settle in. This is where tiny routines start to matter more than motivation.",
    sections: [
      ["Choose a night role you can repeat", "You may not be able to solve sleep, but you can own a part of the night: diaper changes, settling, bottle prep, burping, logging, or the morning reset."],
      ["Create a daily handoff", "A five-minute check-in can prevent resentment: what was hardest, what needs restocking, what does your partner need, and what can wait?"],
      ["Make bonding ordinary", "Bonding does not need to be dramatic. Repeat a walk, song, morning hold, bath routine, or burp-and-reset moment until it feels like yours."],
      ["Lower the decision load", "When everyone is tired, fewer choices help. Keep meals simple, supplies visible, and the next household reset obvious."],
    ],
    takeaways: ["Pick one repeatable night role.", "Use a short daily handoff with your partner.", "Build one ordinary bonding ritual."],
    related: ["newborn-readiness", "newborn-tips-for-dads", "father-readiness-quiz"],
  },
  {
    week: "Week 5",
    stage: "Week 4",
    slug: "newborn-week-4-reset",
    path: "/blog/newborn-week-4-reset",
    title: "Newborn Week 4: The Dad Reset for a Calmer First Month",
    seoTitle: "Newborn Week 4 Dad Reset | NextRoutine",
    description: "A newborn week 4 reset for dads with practical prompts for sleep support, partner recovery, home systems, bonding, and the next month.",
    eyebrow: "Newborn week 4",
    intro: "Week four is a good moment to look up gently. Not to judge how you did, but to notice what is repeating and make the next month a little easier.",
    sections: [
      ["Audit what keeps repeating", "Look for the stress point that shows up every day: meals, laundry, feeding supplies, night handoffs, visitors, errands, or unclear expectations."],
      ["Keep the routine that works", "If one small thing is helping, keep it boring and consistent. New parents do not need novelty as much as they need dependable support."],
      ["Ask your partner what feels unseen", "Try: what has been hardest that I might not notice? What do you need more of this week? What decision can I take over?"],
      ["Plan the next two weeks", "Choose one home system, one recovery support, and one bonding ritual to carry into the next stage."],
    ],
    takeaways: ["Notice the repeated stress point.", "Keep the boring routine that works.", "Ask what feels unseen before improving the plan."],
    related: ["newborn-readiness", "first-time-dad", "newborn-tips-for-dads"],
  },
  {
    week: "Week 6",
    stage: "Months 2–3",
    slug: "baby-months-2-3-dad-rhythm",
    path: "/blog/baby-months-2-3-dad-rhythm",
    title: "Baby Months 2–3 for Dads: Finding a Steadier Family Rhythm",
    seoTitle: "Baby Months 2–3 Guide for Dads | NextRoutine",
    description: "A guide for dads in baby months 2 and 3 focused on family rhythm, bonding, partner support, routines, and the next stage of fatherhood.",
    eyebrow: "Months 2–3",
    intro: "Months two and three can bring more alert moments, new patterns, and a little more room to notice how your family rhythm is forming. This is a good time to adjust gently.",
    sections: [
      ["Review the weekly rhythm", "Look at sleep, feeds, chores, work, errands, recovery, and relationship time. Pick one part of the week that needs a clearer handoff."],
      ["Make bonding more intentional", "Your baby may be more alert now. Repeat simple dad-baby moments: walks, floor time, songs, bath help, morning light, or a predictable settle routine."],
      ["Protect your partner from carrying the whole system", "The mental load can grow quietly. Own planning, restocking, booking, cleaning, or communication without needing to be assigned every step."],
      ["Prepare for the next change", "Baby life will keep shifting. A weekly check-in helps you adapt without waiting for stress to force the conversation."],
    ],
    takeaways: ["Audit the family rhythm once a week.", "Repeat one intentional dad-baby ritual.", "Own part of the mental load, not just tasks."],
    related: ["newborn-tips-for-dads", "father-readiness-quiz", "first-time-dad"],
  },
];

const quizStages = [
  { value: "expecting", label: "Expecting dad" },
  { value: "newborn", label: "Newborn dad" },
  { value: "first_year", label: "Baby's first year" },
];

const questions = [
  "I know what my partner or family needs from me this week.",
  "I have one routine that makes home feel calmer.",
  "I know the next practical thing to prepare.",
  "I feel clear on how I can show up as a dad right now.",
];

const setSeo = (title: string, description: string, path: string) => {
  document.title = title;
  const updateMeta = (selector: string, attr: "content" | "href", value: string) => {
    const tag = document.querySelector(selector);
    if (tag) tag.setAttribute(attr, value);
  };
  updateMeta('meta[name="description"]', "content", description);
  updateMeta('meta[property="og:title"]', "content", title);
  updateMeta('meta[property="og:description"]', "content", description);
  updateMeta('meta[name="twitter:title"]', "content", title);
  updateMeta('meta[name="twitter:description"]', "content", description);
  updateMeta('link[rel="canonical"]', "href", `https://nextroutine.com${path}`);
};

const ClusterHeader = () => (
  <header className="border-b border-border/80 px-5 py-6 sm:px-8 lg:px-12">
    <div className="mx-auto flex max-w-7xl items-center justify-between">
      <Link to="/" className="text-lg font-bold text-foreground">NextRoutine</Link>
      <nav className="flex items-center gap-5 text-sm font-semibold text-muted-foreground">
        <Link to="/father-readiness-quiz" className="hover:text-foreground">Quiz hub</Link>
        <Link to="/first-time-dad" className="hidden hover:text-foreground sm:inline">Dad guide</Link>
        <Link to="/#pro" className="text-primary hover:text-foreground">PRO</Link>
      </nav>
    </div>
  </header>
);

const ProCta = ({ children }: { children: string }) => (
  <div className="rounded-2xl border border-primary/30 bg-card/90 p-6 shadow-lg shadow-foreground/5">
    <p className="font-bold text-primary">NextRoutine PRO</p>
    <h2 className="mt-2 text-3xl font-bold tracking-tight">Make this personal to your stage.</h2>
    <p className="mt-3 leading-7 text-muted-foreground">The free guides help you start. PRO turns your stage, score, and weekly needs into a clearer fatherhood plan.</p>
    <Button asChild className="mt-5 rounded-xl font-bold">
      <Link to="/#pro">{children}<ArrowRight className="h-4 w-4" /></Link>
    </Button>
  </div>
);

export const FatherReadinessQuizHub = () => {
  const [stage, setStage] = useState("expecting");
  const [answers, setAnswers] = useState([1, 1, 1, 1]);
  const score = useMemo(() => Math.round((answers.reduce((sum, answer) => sum + answer, 0) / 8) * 100), [answers]);
  const nextStep = score < 45 ? "Start with one calming routine you can own this week." : score < 75 ? "Add one partner check-in and one preparation task to your week." : "Keep the rhythm going with a more personalized weekly plan.";

  useEffect(() => {
    setSeo("Father Readiness Quiz for Expecting and New Dads | NextRoutine", "Take the father readiness quiz and get a stage-specific score, next step, and supporting guides for pregnancy, newborn life, and baby’s first year.", "/father-readiness-quiz");
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ClusterHeader />
      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="font-bold text-primary">Father readiness quiz hub</p>
            <h1 className="mt-3 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">How ready do you feel for your next step as a dad?</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">Take a short readiness quiz, get a stage-specific score, then explore practical guides for first-time dads, expecting fathers, and newborn routines.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {topicPages.map((page) => (
                <Link key={page.slug} to={page.path} className="rounded-2xl border border-border/80 bg-card/90 p-4 font-bold hover:border-primary/80">
                  {page.eyebrow}
                </Link>
              ))}
              {articles.map((article) => (
                <Link key={article.slug} to={`/guides/${article.slug}`} className="rounded-2xl border border-border/80 bg-card/90 p-4 font-bold hover:border-primary/80">
                  {article.eyebrow}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg shadow-foreground/5">
            <label className="text-sm font-bold text-primary" htmlFor="stage">Choose your stage</label>
            <select id="stage" value={stage} onChange={(event) => setStage(event.target.value)} className="mt-2 h-12 w-full rounded-xl border border-input bg-background px-3 text-foreground">
              {quizStages.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
            <div className="mt-6 space-y-4">
              {questions.map((question, index) => (
                <div key={question} className="rounded-2xl border border-border/80 bg-background p-4">
                  <p className="font-bold">{question}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((value) => (
                      <button key={value} type="button" onClick={() => setAnswers((current) => current.map((answer, answerIndex) => answerIndex === index ? value : answer))} className={`rounded-xl border px-3 py-2 text-sm font-bold ${answers[index] === value ? "border-primary/80 bg-primary text-primary-foreground" : "border-border/80 bg-card/90 text-muted-foreground"}`}>
                        {value === 0 ? "Not yet" : value === 1 ? "Somewhat" : "Ready"}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-2xl bg-primary p-5 text-primary-foreground">
              <p className="text-sm font-bold uppercase">Your readiness score</p>
              <p className="text-5xl font-bold">{score}%</p>
              <p className="mt-3 leading-7">{nextStep}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="px-5 pb-20 sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><ProCta>See the PRO plan</ProCta></div></section>
    </main>
  );
};

export const GuideArticle = () => {
  const { slug } = useParams();
  const article = articles.find((item) => item.slug === slug) ?? articles[0];

  useEffect(() => {
    setSeo(`${article.title} | NextRoutine`, article.description, `/guides/${article.slug}`);
  }, [article]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ClusterHeader />
      <article className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_22rem]">
          <div>
            <Link to="/father-readiness-quiz" className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-4 py-2 text-sm font-bold text-primary"><ClipboardList className="h-4 w-4" /> Father readiness quiz hub</Link>
            <p className="mt-8 font-bold text-primary">{article.eyebrow}</p>
            <h1 className="mt-3 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">{article.title}</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{article.intro}</p>
            <div className="mt-10 space-y-6">
              {article.sections.map(([heading, body]) => (
                <section key={heading} className="rounded-2xl border border-border/80 bg-card/90 p-6">
                  <div className="flex items-start gap-3"><Check className="mt-1 h-5 w-5 text-primary" /><div><h2 className="text-2xl font-bold">{heading}</h2><p className="mt-3 leading-8 text-muted-foreground">{body}</p></div></div>
                </section>
              ))}
            </div>
          </div>
          <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-2xl border border-border/80 bg-card/90 p-5">
              <HeartHandshake className="h-6 w-6 text-primary" />
              <h2 className="mt-3 text-xl font-bold">Related guides</h2>
              <div className="mt-4 space-y-3">
                {articles.filter((item) => item.slug !== article.slug).map((item) => (
                  <Link key={item.slug} to={`/guides/${item.slug}`} className="block rounded-xl border border-border/80 bg-background p-3 text-sm font-bold hover:border-primary/80">{item.eyebrow}</Link>
                ))}
              </div>
            </div>
            <ProCta>{article.cta}</ProCta>
          </aside>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.description, author: { "@type": "Organization", name: "NextRoutine" }, publisher: { "@type": "Organization", name: "NextRoutine" }, mainEntityOfPage: `https://nextroutine.com/guides/${article.slug}` }) }} />
    </main>
  );
};

export const TopicPage = ({ slug }: { slug: string }) => {
  const page = topicPages.find((item) => item.slug === slug) ?? topicPages[0];
  const relatedGuides = page.guides.map((guideSlug) => articles.find((article) => article.slug === guideSlug)).filter(Boolean) as typeof articles;
  const relatedTopics = topicPages.filter((item) => item.slug !== page.slug);

  useEffect(() => {
    setSeo(page.seoTitle, page.description, page.path);
  }, [page]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ClusterHeader />
      <article className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <Link to="/father-readiness-quiz" className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-4 py-2 text-sm font-bold text-primary"><ClipboardList className="h-4 w-4" /> Father readiness quiz hub</Link>
            <p className="mt-8 font-bold text-primary">{page.eyebrow}</p>
            <h1 className="mt-3 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">{page.title}</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{page.intro}</p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {page.focus.map(([heading, body]) => (
              <section key={heading} className="rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg shadow-foreground/5">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="mt-4 text-2xl font-bold">{heading}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">{body}</p>
              </section>
            ))}
          </div>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_22rem]">
            <section className="rounded-2xl border border-border/80 bg-card/90 p-6 sm:p-8">
              <p className="font-bold text-primary">What to focus on next</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight">{page.stepsTitle}</h2>
              <div className="mt-8 space-y-4">
                {page.steps.map(([heading, body], index) => (
                  <div key={heading} className="grid gap-4 rounded-2xl border border-border/80 bg-background p-5 sm:grid-cols-[3rem_1fr]">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary font-bold text-secondary-foreground">{index + 1}</div>
                    <div>
                      <h3 className="text-xl font-bold">{heading}</h3>
                      <p className="mt-2 leading-7 text-muted-foreground">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
              <div className="rounded-2xl border border-border/80 bg-card/90 p-5">
                <HeartHandshake className="h-6 w-6 text-primary" />
                <h2 className="mt-3 text-xl font-bold">Related guides</h2>
                <div className="mt-4 space-y-3">
                  {relatedGuides.map((guide) => (
                    <Link key={guide.slug} to={`/guides/${guide.slug}`} className="block rounded-xl border border-border/80 bg-background p-3 text-sm font-bold hover:border-primary/80">{guide.eyebrow}</Link>
                  ))}
                  {relatedTopics.map((topic) => (
                    <Link key={topic.slug} to={topic.path} className="block rounded-xl border border-border/80 bg-background p-3 text-sm font-bold hover:border-primary/80">{topic.eyebrow}</Link>
                  ))}
                </div>
              </div>
              <ProCta>{page.cta}</ProCta>
            </aside>
          </div>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: page.title, description: page.description, publisher: { "@type": "Organization", name: "NextRoutine" }, mainEntityOfPage: `https://nextroutine.com${page.path}` }) }} />
    </main>
  );
};


const resolveResourceLink = (slug: string) => {
  if (slug === "father-readiness-quiz") return { to: "/father-readiness-quiz", label: "Father readiness quiz" };
  const article = articles.find((item) => item.slug === slug);
  if (article) return { to: `/guides/${article.slug}`, label: article.eyebrow };
  const topic = topicPages.find((item) => item.slug === slug);
  if (topic) return { to: topic.path, label: topic.eyebrow };
  return null;
};

const NewsletterCta = () => (
  <div className="rounded-2xl border border-primary/30 bg-primary p-6 text-primary-foreground shadow-lg shadow-foreground/5">
    <p className="font-bold">Free weekly newsletter</p>
    <h2 className="mt-2 text-3xl font-bold tracking-tight">Get one calm next step each week.</h2>
    <p className="mt-3 leading-7">Join the newsletter for stage-based dad prompts from pregnancy through the first year.</p>
    <Button asChild variant="secondary" className="mt-5 rounded-xl font-bold">
      <Link to="/#newsletter-signup">Join weekly<ArrowRight className="h-4 w-4" /></Link>
    </Button>
  </div>
);

export const BlogRolloutHub = () => {
  useEffect(() => {
    setSeo("6-Week SEO Blog Rollout for First-Time Dads | NextRoutine", "Follow a six-week stage-based blog series for first-time dads covering pregnancy, birth, newborn weeks 1-4, and baby months 2-3.", "/blog");
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ClusterHeader />
      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="font-bold text-primary">6-week dad readiness series</p>
            <h1 className="mt-3 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">One stage-based article each week, from pregnancy to months 2–3.</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">This rollout gives first-time dads a calm path through the moments that usually feel most uncertain: pregnancy, birth, the first month, and the early family rhythm after that.</p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {blogRolloutPosts.map((post) => (
              <Link key={post.slug} to={post.path} className="rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg shadow-foreground/5 hover:border-primary/80">
                <p className="font-bold text-primary">{post.week} · {post.stage}</p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight">{post.title}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">{post.description}</p>
              </Link>
            ))}
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <NewsletterCta />
            <ProCta>See the PRO plan</ProCta>
          </div>
        </div>
      </section>
    </main>
  );
};

export const BlogPost = ({ slug }: { slug: string }) => {
  const post = blogRolloutPosts.find((item) => item.slug === slug) ?? blogRolloutPosts[0];
  const relatedLinks = post.related.map(resolveResourceLink).filter(Boolean) as { to: string; label: string }[];
  const otherPosts = blogRolloutPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  useEffect(() => {
    setSeo(post.seoTitle, post.description, post.path);
  }, [post]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <ClusterHeader />
      <article className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_22rem]">
          <div>
            <div className="flex flex-wrap gap-3">
              <Link to="/blog" className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-4 py-2 text-sm font-bold text-primary">{post.week} rollout</Link>
              <Link to="/father-readiness-quiz" className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/90 px-4 py-2 text-sm font-bold text-primary"><ClipboardList className="h-4 w-4" /> Father readiness quiz</Link>
            </div>
            <p className="mt-8 font-bold text-primary">{post.eyebrow}</p>
            <h1 className="mt-3 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">{post.title}</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{post.intro}</p>

            <div className="mt-10 space-y-6">
              {post.sections.map(([heading, body]) => (
                <section key={heading} className="rounded-2xl border border-border/80 bg-card/90 p-6">
                  <div className="flex items-start gap-3"><Check className="mt-1 h-5 w-5 text-primary" /><div><h2 className="text-2xl font-bold">{heading}</h2><p className="mt-3 leading-8 text-muted-foreground">{body}</p></div></div>
                </section>
              ))}
            </div>

            <section className="mt-8 rounded-2xl border border-border/80 bg-card/90 p-6">
              <p className="font-bold text-primary">This week’s takeaway</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {post.takeaways.map((takeaway) => (
                  <div key={takeaway} className="rounded-xl border border-border/80 bg-background p-4 text-sm font-bold leading-6">{takeaway}</div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
            <NewsletterCta />
            <div className="rounded-2xl border border-border/80 bg-card/90 p-5">
              <HeartHandshake className="h-6 w-6 text-primary" />
              <h2 className="mt-3 text-xl font-bold">Next steps</h2>
              <div className="mt-4 space-y-3">
                <Link to="/father-readiness-quiz" className="block rounded-xl border border-primary/30 bg-background p-3 text-sm font-bold text-primary hover:border-primary/80">Take the readiness quiz</Link>
                <Link to="/#newsletter-signup" className="block rounded-xl border border-primary/30 bg-background p-3 text-sm font-bold text-primary hover:border-primary/80">Join the weekly newsletter</Link>
                {relatedLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="block rounded-xl border border-border/80 bg-background p-3 text-sm font-bold hover:border-primary/80">{link.label}</Link>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border/80 bg-card/90 p-5">
              <h2 className="text-xl font-bold">More in the rollout</h2>
              <div className="mt-4 space-y-3">
                {otherPosts.map((item) => (
                  <Link key={item.slug} to={item.path} className="block rounded-xl border border-border/80 bg-background p-3 text-sm font-bold hover:border-primary/80">{item.week}: {item.stage}</Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.description, author: { "@type": "Organization", name: "NextRoutine" }, publisher: { "@type": "Organization", name: "NextRoutine" }, mainEntityOfPage: `https://nextroutine.com${post.path}` }) }} />
    </main>
  );
};

export const SeoClusterLinks = () => (
  <section className="px-5 py-20 sm:px-8 lg:px-12">
    <div className="mx-auto max-w-7xl rounded-2xl border border-border/80 bg-card/90 p-8">
      <p className="font-bold text-primary">Father readiness resources</p>
      <h2 className="mt-3 text-4xl font-bold tracking-tight">Start with the quiz, then read the guide for your stage.</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/father-readiness-quiz" className="rounded-2xl border border-primary/30 bg-primary p-5 font-bold text-primary-foreground"><Sparkles className="mb-3 h-5 w-5" />Father readiness quiz</Link>
        {topicPages.map((page) => <Link key={page.slug} to={page.path} className="rounded-2xl border border-border/80 bg-background p-5 font-bold hover:border-primary/80">{page.eyebrow}</Link>)}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => <Link key={article.slug} to={`/guides/${article.slug}`} className="rounded-2xl border border-border/80 bg-background p-5 font-bold hover:border-primary/80">{article.eyebrow}</Link>)}
      </div>
    </div>
  </section>
);
