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

export const SeoClusterLinks = () => (
  <section className="px-5 py-20 sm:px-8 lg:px-12">
    <div className="mx-auto max-w-7xl rounded-2xl border border-border/80 bg-card/90 p-8">
      <p className="font-bold text-primary">Father readiness resources</p>
      <h2 className="mt-3 text-4xl font-bold tracking-tight">Start with the quiz, then read the guide for your stage.</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Link to="/father-readiness-quiz" className="rounded-2xl border border-primary/30 bg-primary p-5 font-bold text-primary-foreground"><Sparkles className="mb-3 h-5 w-5" />Father readiness quiz</Link>
        {articles.map((article) => <Link key={article.slug} to={`/guides/${article.slug}`} className="rounded-2xl border border-border/80 bg-background p-5 font-bold hover:border-primary/80">{article.eyebrow}</Link>)}
      </div>
    </div>
  </section>
);
