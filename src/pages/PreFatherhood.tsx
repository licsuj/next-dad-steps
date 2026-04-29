import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, CalendarDays, Check, ClipboardList, HeartHandshake, Home, PiggyBank, ShieldCheck, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";


const challengePriorities = [
  {
    id: "money",
    label: "Money",
    weekOne: "Build a 30-minute money snapshot: income, bills, debt, savings, insurance costs, and one baby expense you need to understand.",
    weekTwo: "Create a simple baby buffer target and choose one budget adjustment you can make without making life miserable.",
  },
  {
    id: "career",
    label: "Career",
    weekOne: "Map your next 3–6 months at work: busy seasons, deadlines, travel, commute stress, and where flexibility may matter.",
    weekTwo: "Write a low-pressure work plan: what you may need, who covers what, and which conversations should happen before pregnancy or birth pressure rises.",
  },
  {
    id: "leave",
    label: "Leave",
    weekOne: "Find your actual time-off options: PTO, sick days, unpaid leave, parental leave, notice rules, and whether leave can be split.",
    weekTwo: "Draft a paternity leave plan with dates, income impact, handoff needs, and questions for HR or your manager.",
  },
  {
    id: "health",
    label: "Health",
    weekOne: "Review health insurance basics: coverage, deductibles, co-pays, provider access, and how a baby gets added after birth.",
    weekTwo: "Create a shared health admin note with provider contacts, documents, appointment questions, and paperwork deadlines.",
  },
  {
    id: "relationship",
    label: "Relationship",
    weekOne: "Have one calm check-in: what feels exciting, what feels scary, what support means, and what each of you may need more of.",
    weekTwo: "Choose one recurring relationship rhythm: a weekly check-in, chore handoff, money talk, or protected time without logistics.",
  },
];

const baseChallenge = [
  ["Day 1", "Choose your top preparation priorities and write down why they matter right now."],
  ["Day 2", "Create one shared note for questions, decisions, dates, and next steps."],
  ["Day 3", "Handle the first task from your top priority."],
  ["Day 4", "Have a 15-minute conversation about what would lower future stress."],
  ["Day 5", "Handle the first task from your second priority, or deepen the first one."],
  ["Day 6", "Pick one home routine you can own without reminders."],
  ["Day 7", "Review the week and choose what needs a follow-up."],
  ["Day 8", "Turn one loose question into a real answer: policy, cost, contact, or deadline."],
  ["Day 9", "Handle the second task from your top priority."],
  ["Day 10", "Map who can help later and what kind of help would actually be useful."],
  ["Day 11", "Handle the second task from your second priority, or refine your plan."],
  ["Day 12", "Simplify one future stress point before it becomes urgent."],
  ["Day 13", "Share the plan, ask what feels missing, and adjust together."],
  ["Day 14", "Choose the next two-week focus and one recurring routine to keep."],
];

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

const PreFatherhood = () => {
  const [selectedPriorities, setSelectedPriorities] = useState(["money", "leave"]);
  const selectedPriorityPlans = useMemo(() => challengePriorities.filter((priority) => selectedPriorities.includes(priority.id)), [selectedPriorities]);
  const adaptedChallenge = useMemo(() => baseChallenge.map(([day, task], index) => {
    const priority = selectedPriorityPlans[index % Math.max(selectedPriorityPlans.length, 1)];
    const priorityTask = priority ? (index < 7 ? priority.weekOne : priority.weekTwo) : task;
    if ([2, 4, 8, 10].includes(index)) return [day, priorityTask];
    return [day, task];
  }), [selectedPriorityPlans]);

  const togglePriority = (priorityId: string) => {
    setSelectedPriorities((current) => {
      if (current.includes(priorityId)) return current.length === 1 ? current : current.filter((id) => id !== priorityId);
      return [...current, priorityId];
    });
  };

  return (
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

    <section className="px-5 pb-20 sm:px-8 lg:px-12" id="challenge">
      <div className="mx-auto max-w-7xl rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg shadow-foreground/5 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-bold text-primary">2-week challenge</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Pick your priorities. Get a calmer preparation plan.</h2>
            <p className="mt-5 leading-7 text-muted-foreground">Choose what matters most right now. The 14-day plan adapts around your selected priorities so you can make progress without trying to solve everything at once.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {challengePriorities.map((priority) => (
                <button key={priority.id} type="button" onClick={() => togglePriority(priority.id)} className={`rounded-full border px-4 py-2 text-sm font-bold transition ${selectedPriorities.includes(priority.id) ? "border-primary/80 bg-primary text-primary-foreground" : "border-border/80 bg-background text-muted-foreground hover:border-primary/80"}`}>
                  {priority.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {adaptedChallenge.map(([day, task]) => (
              <div key={day} className="rounded-2xl border border-border/80 bg-background p-4">
                <p className="text-sm font-bold text-primary">{day}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{task}</p>
              </div>
            ))}
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
};

export default PreFatherhood;
