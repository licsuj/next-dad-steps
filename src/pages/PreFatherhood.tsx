import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, CalendarDays, Check, ClipboardList, HeartHandshake, Home, PiggyBank, ShieldCheck, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const preparationAreas = [
  {
    title: "Money",
    icon: PiggyBank,
    copy: "Get a realistic view of baby costs before pressure rises.",
    items: [
      "Review monthly income, fixed bills, debt, and savings",
      "Estimate first-year baby costs: diapers, feeding, clothing, childcare, and medical bills",
      "Start a baby buffer for unexpected expenses",
      "Check insurance deductibles, co-pays, and out-of-pocket maximums",
    ],
  },
  {
    title: "Career",
    icon: Briefcase,
    copy: "Think through workload, flexibility, and what may need to change at work.",
    items: [
      "Map busy seasons, travel, deadlines, and high-stress periods",
      "Identify what flexibility may be possible before and after birth",
      "Review childcare timing against work expectations",
      "Plan how to protect family time without waiting until burnout",
    ],
  },
  {
    title: "Time off",
    icon: CalendarDays,
    copy: "Know what time you can take, when, and how it affects income.",
    items: [
      "Check paid time off, sick days, unpaid leave, and company policy",
      "Ask how leave can be split before birth, birth week, and the newborn stage",
      "Build a rough coverage plan for work responsibilities",
      "Save key dates and paperwork deadlines in one shared place",
    ],
  },
  {
    title: "Paternity leave",
    icon: ShieldCheck,
    copy: "Turn vague leave benefits into a clear plan before you need it.",
    items: [
      "Confirm eligibility, pay percentage, duration, and notice requirements",
      "Ask HR what forms or proof may be needed",
      "Understand whether leave must be continuous or can be taken in blocks",
      "Discuss the leave plan with your partner so expectations are aligned",
    ],
  },
  {
    title: "Health paperwork",
    icon: ClipboardList,
    copy: "Reduce admin stress by knowing what paperwork matters early.",
    items: [
      "Review health insurance coverage for pregnancy, birth, and baby care",
      "Know how and when to add a baby to insurance after birth",
      "Collect emergency contacts, provider numbers, and key documents",
      "Create a shared note for appointments, questions, and follow-ups",
    ],
  },
  {
    title: "Home routines",
    icon: Home,
    copy: "Build a calmer home system before sleep and schedules get harder.",
    items: [
      "Choose one routine to own now: meals, laundry, groceries, cleaning, or bills",
      "Create simple restock lists for household and baby basics",
      "Practice a weekly reset before baby arrives",
      "Decide what can be simplified, outsourced, paused, or ignored for a while",
    ],
  },
  {
    title: "Support network",
    icon: Users,
    copy: "Know who can help and what kind of help is actually useful.",
    items: [
      "List trusted family, friends, neighbors, and professional support options",
      "Decide who can help with meals, errands, childcare, pets, or rides",
      "Set early boundaries around visitors and advice",
      "Talk with your partner about what support feels helpful, not intrusive",
    ],
  },
];

const PreFatherhood = () => (
  <main className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border/80 px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Target className="h-5 w-5" /></div>
          <span className="text-lg font-bold">NextRoutine</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-semibold text-muted-foreground">
          <Link to="/father-readiness-quiz" className="hover:text-foreground">Quiz</Link>
          <Link to="/pro" className="hover:text-foreground">PRO</Link>
          <Link to="/#newsletter-signup" className="text-primary hover:text-foreground">FREE</Link>
        </nav>
      </div>
    </header>

    <section className="px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="font-bold text-primary">Pre-fatherhood preparation</p>
          <h1 className="mt-3 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">Thinking about becoming a dad? Start before life gets loud.</h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">Use this checklist to prepare calmly for money, career, time off, paternity leave, health paperwork, home routines, and the support network you may need later.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-12 rounded-xl px-6 font-bold">
              <Link to="/#newsletter-signup">Join the free dad newsletter<ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-xl border-border/80 bg-card/90 px-6 font-bold text-foreground hover:bg-muted">
              <Link to="/father-readiness-quiz">Take the readiness quiz</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg shadow-foreground/5">
          <HeartHandshake className="h-7 w-7 text-primary" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight">This is not about pressure.</h2>
          <p className="mt-4 leading-7 text-muted-foreground">It is about lowering future stress. A little planning now can make pregnancy, birth, and newborn life feel less like a surprise and more like something you can step into together.</p>
          <div className="mt-6 rounded-2xl bg-primary p-5 text-primary-foreground">
            <p className="text-sm font-bold uppercase">Best first move</p>
            <p className="mt-1 text-lg font-bold">Pick one category below and handle one checklist item this week.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="px-5 pb-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {preparationAreas.map((area) => {
            const Icon = area.icon;
            return (
              <article key={area.title} className="rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg shadow-foreground/5">
                <Icon className="h-6 w-6 text-primary" />
                <h2 className="mt-4 text-2xl font-bold">{area.title}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">{area.copy}</p>
                <ul className="mt-5 space-y-3">
                  {area.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"><Check className="mt-0.5 h-4 w-4 text-primary" />{item}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  </main>
);

export default PreFatherhood;
