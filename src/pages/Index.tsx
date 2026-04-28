import { useMemo, useState } from "react";
import { ArrowRight, Check, Crosshair, Lock, Mail, Shield, Sparkles, Target, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const stages = [
  {
    id: "just_found_out",
    label: "Just got the news",
    promise: "Get grounded, know your role, and make the first 7 days count.",
    sequence: ["The first 24-hour dad reset", "How to support without taking over", "Money, calendar, and doctor visit basics"],
    preview: {
      lesson: "Your job is not to have every answer today; it is to become steady, curious, and useful.",
      action: "Write down the first three practical things you can own this week.",
      partnerMove: "Ask: What would make this week feel 10% lighter for you?",
      mistake: "Jumping straight into fixing instead of listening first.",
    },
  },
  {
    id: "pregnancy_1_3",
    label: "Pregnancy months 1–3",
    promise: "Build the early support routine while everything still feels unreal.",
    sequence: ["Your first trimester step", "What she may need but not ask for", "The calm prep checklist"],
    preview: {
      lesson: "Early pregnancy can be invisible but intense; consistency matters more than grand gestures.",
      action: "Create a shared note for appointments, symptoms, questions, and tasks.",
      partnerMove: "Take one recurring household task fully off her list.",
      mistake: "Treating the first trimester like nothing has changed because the baby is not showing yet.",
    },
  },
  {
    id: "pregnancy_4_6",
    label: "Pregnancy months 4–6",
    promise: "Move from reaction mode into planning mode with weekly action steps.",
    sequence: ["Home systems before baby arrives", "Partner check-in scripts", "Dad readiness score: mid-pregnancy"],
    preview: {
      lesson: "This is the window to turn vague intention into systems before the pressure rises.",
      action: "Pick one home system to simplify: meals, laundry, money, or appointments.",
      partnerMove: "Schedule a 20-minute weekly check-in with no phone in hand.",
      mistake: "Waiting until the third trimester to start preparing your routines.",
    },
  },
  {
    id: "pregnancy_7_9",
    label: "Pregnancy months 7–9",
    promise: "Prepare for birth, hospital week, and the first nights at home.",
    sequence: ["Birth week simple plan", "Hospital bag: dad edition", "The first 72 hours plan"],
    preview: {
      lesson: "Late pregnancy is about reducing decisions before everyone is tired and emotional.",
      action: "Build the first 72-hour plan for food, sleep shifts, visitors, and supplies.",
      partnerMove: "Ask what kind of support she wants during labor, recovery, and visitors.",
      mistake: "Only packing a bag and calling that being prepared.",
    },
  },
  {
    id: "birth_week",
    label: "Birth and hospital week",
    promise: "Stay calm, useful, and present during one of the biggest weeks of your life.",
    sequence: ["Your hospital role", "Visitors, boundaries, and recovery", "The ride-home routine"],
    preview: {
      lesson: "Your calm becomes part of the environment; your role is logistics, protection, and presence.",
      action: "Create a simple hospital list: documents, contacts, parking, snacks, and boundaries.",
      partnerMove: "Agree on visitor rules before anyone asks to come over.",
      mistake: "Becoming another person who needs direction during the most intense week.",
    },
  },
  {
    id: "newborn_0_3",
    label: "Newborn months 0–3",
    promise: "Survive the fog with simple routines for sleep, feeding support, and teamwork.",
    sequence: ["Night shift system", "Partner recovery support", "Newborn bonding without overthinking"],
    preview: {
      lesson: "The newborn stage rewards small repeatable systems, not perfect parenting theories.",
      action: "Own one daily reset: bottles, laundry, meals, or the sleep station.",
      partnerMove: "Protect one recovery block where she does not need to manage anything.",
      mistake: "Waiting to be asked instead of noticing what keeps repeating.",
    },
  },
  {
    id: "baby_3_6",
    label: "Baby months 3–6",
    promise: "Turn chaos into rhythm as your baby becomes more alert and interactive.",
    sequence: ["Weekend reset ritual", "Play and bonding steps", "Work-life protection plan"],
    preview: {
      lesson: "Your baby is starting to respond; routine and bonding now become easier to practice.",
      action: "Choose one recurring dad-baby ritual you can repeat three times this week.",
      partnerMove: "Ask where she feels most alone in the current routine.",
      mistake: "Assuming bonding only happens naturally instead of building repeated moments.",
    },
  },
  {
    id: "baby_6_12",
    label: "Baby months 6–12",
    promise: "Keep growing as a dad while routines, mobility, and identity shift again.",
    sequence: ["First-year routine planner", "Confidence through repetition", "Relationship maintenance mode"],
    preview: {
      lesson: "The first year keeps changing; your routines need review, not autopilot.",
      action: "Run a 15-minute routine audit: sleep, meals, play, work, relationship, and recovery.",
      partnerMove: "Plan one protected couple check-in that is not about logistics only.",
      mistake: "Letting survival mode become the permanent family support plan.",
    },
  },
];

const proFeatures = [
  "Personalized weekly plan by pregnancy month or baby age",
  "Dad Readiness Plan with steps and progress prompts",
  "Premium guides for partner support, birth prep, and first-year routines",
  "Trackers for readiness score, sleep support, checklists, and habits",
];

const signupStages = [
  { value: "just_found_out", label: "Just got the news" },
  { value: "pregnancy_months", label: "Pregnancy months" },
  { value: "newborn", label: "Newborn" },
  { value: "baby_months", label: "Baby months" },
];

const quizQuestions = [
  "I know what my partner needs from me this week.",
  "I have one routine that lowers stress at home.",
  "I know the next practical thing I should prepare.",
  "I feel clear on my role as a dad right now.",
];

const stageSteps: Record<string, { low: string; mid: string; high: string }> = {
  just_found_out: {
    low: "Do the 24-hour dad reset: write down what changed, what matters, and the one conversation to have tonight.",
    mid: "Create your first support routine: one daily check-in and one task you own without being asked.",
    high: "Build one shared place for appointments, budget notes, questions, and next-week prep.",
  },
  pregnancy_months: {
    low: "Run the pregnancy stage audit: what month are you in, what appointments are coming, and what does your partner need most?",
    mid: "Set the weekly partner check-in: energy, worries, practical help, and one decision to remove from her plate.",
    high: "Start birth-readiness prep: hospital logistics, home systems, and the first 72-hour plan.",
  },
  newborn: {
    low: "Protect the next sleep block: choose one shift, one reset task, and one way to reduce decision fatigue today.",
    mid: "Build the newborn night system: supplies, handoffs, feeding support, and recovery time for your partner.",
    high: "Create the weekly newborn rhythm: sleep support, chores, bonding, and visitor boundaries.",
  },
  baby_months: {
    low: "Reset the family rhythm: identify the messiest part of the week and build one repeatable routine around it.",
    mid: "Plan one bonding step: a simple recurring activity that belongs to you and your baby.",
    high: "Upgrade your first-year system: routines, relationship check-ins, and work-life boundaries for the next month.",
  },
};

const proOnboardingSequences: Record<string, string[]> = {
  just_found_out: ["Your first 24-hour reset", "Partner support script", "Early appointment plan", "Dad readiness baseline"],
  pregnancy_months: ["Pregnancy stage audit", "Weekly support routine", "Home and money prep", "Birth-readiness roadmap"],
  newborn: ["Night shift support plan", "Partner recovery checklist", "Newborn supply station", "First 30-day routine score"],
  baby_months: ["Family rhythm reset", "Bonding step plan", "Work-life boundary check", "First-year routine upgrade"],
};

const Index = () => {
  const [email, setEmail] = useState("");
  const [signupStage, setSignupStage] = useState("");
  const [proEmail, setProEmail] = useState("");
  const [proStage, setProStage] = useState("");
  const [proPreviewStage, setProPreviewStage] = useState("just_found_out");
  const [selectedStage, setSelectedStage] = useState(stages[0].id);
  const [quizStage, setQuizStage] = useState("just_found_out");
  const [quizAnswers, setQuizAnswers] = useState([1, 1, 1, 1]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProSubmitting, setIsProSubmitting] = useState(false);

  const activeStage = useMemo(() => stages.find((stage) => stage.id === selectedStage) ?? stages[0], [selectedStage]);
  const readinessScore = useMemo(() => Math.round((quizAnswers.reduce((total, answer) => total + answer, 0) / (quizAnswers.length * 2)) * 100), [quizAnswers]);
  const recommendedStep = useMemo(() => {
    const steps = stageSteps[quizStage];
    if (readinessScore < 45) return steps.low;
    if (readinessScore < 75) return steps.mid;
    return steps.high;
  }, [quizStage, readinessScore]);

  const activeProSequence = proOnboardingSequences[proPreviewStage];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) || trimmedEmail.length > 255) {
      toast.error("Enter a valid email to join the step.");
      return;
    }

    if (!signupStages.some((stage) => stage.value === signupStage)) {
      toast.error("Choose your fatherhood stage first.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("newsletter_signups").insert({
      email: trimmedEmail,
      fatherhood_stage: signupStage,
      source: "landing_page",
      pro_interest: true,
      onboarding_sequence: activeStage.sequence,
    });

    setIsSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast.success("You are already on the NextRoutine list.");
        return;
      }
      toast.error("Could not save your signup. Try again in a moment.");
      return;
    }

    setEmail("");
    setSignupStage("");
    toast.success("You are in. Your stage-based routine preview is saved.");
  };

  const handleProSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = proEmail.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) || trimmedEmail.length > 255) {
      toast.error("Enter a valid email to join the PRO waitlist.");
      return;
    }

    if (!signupStages.some((stage) => stage.value === proStage)) {
      toast.error("Choose your fatherhood stage first.");
      return;
    }

    setIsProSubmitting(true);
    const { error } = await supabase.from("newsletter_signups").insert({
      email: trimmedEmail,
      fatherhood_stage: proStage,
      source: "pro_preview",
      pro_interest: true,
      onboarding_sequence: proOnboardingSequences[proStage],
    });

    setIsProSubmitting(false);

    if (error && error.code !== "23505") {
      toast.error("Could not save your PRO waitlist spot. Try again in a moment.");
      return;
    }

    setProPreviewStage(proStage);
    setProEmail("");
    setProStage("");
    toast.success(error?.code === "23505" ? "You are already on the list. Preview is ready." : "PRO waitlist saved. Preview is ready.");
    window.setTimeout(() => document.getElementById("pro-onboarding-preview")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between border-b border-border pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Target className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-normal">NextRoutine</span>
          </div>
          <a href="#pro" className="text-sm font-semibold text-primary transition hover:text-accent">
            PRO preview
          </a>
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
              <Crosshair className="h-4 w-4 text-primary" />
              Pregnancy guidance, newborn routines, and first-year support for dads
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-none tracking-normal sm:text-6xl lg:text-7xl">
              Practical new dad advice, one calm step at a time.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              NextRoutine helps expecting fathers and new dads feel less lost with stage-based guidance, simple checklists, readiness scores, and weekly routines from pregnancy news through the baby’s first year.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 grid max-w-3xl gap-3 rounded-md border border-border bg-card p-3 shadow-2xl shadow-secondary/20 sm:grid-cols-[1fr_1fr_auto]">
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="dad@email.com"
                className="h-12 border-border bg-background text-foreground placeholder:text-muted-foreground"
                aria-label="Email address"
                required
              />
              <select
                value={signupStage}
                onChange={(event) => setSignupStage(event.target.value)}
                className="h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Fatherhood stage"
                required
              >
                <option value="">Choose your stage</option>
                {signupStages.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label}
                  </option>
                ))}
              </select>
              <Button type="submit" disabled={isSubmitting} className="h-12 w-full font-bold sm:w-auto">
                {isSubmitting ? "Joining" : "Join weekly"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-3 text-sm text-muted-foreground">Free weekly newsletter now. PRO plan and tools coming next.</p>
          </div>

          <div className="relative">
            <div className="rounded-md border border-border bg-card p-5 shadow-2xl shadow-primary/10">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-sm font-semibold text-primary">This week’s next step</p>
                  <h2 className="mt-1 text-2xl font-black">Make this week feel more manageable</h2>
                </div>
                <div className="rounded-md bg-secondary px-3 py-2 text-sm font-bold">Score 72%</div>
              </div>
              <div className="mt-5 space-y-3">
                {["Understand where you are right now", "Take one small pressure off your partner", "Prepare one routine before it becomes stressful"].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-md border border-border bg-background p-4">
                    <Check className="mt-0.5 h-5 w-5 text-primary" />
                    <span className="text-sm leading-6 text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-md bg-primary p-4 text-primary-foreground">
                <p className="text-sm font-black uppercase">Coming next</p>
                <p className="mt-1 text-lg font-bold">Your personalized fatherhood plan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-md border border-border bg-card p-6 sm:p-8">
          <p className="font-bold text-primary">Fatherhood preparation for every stage</p>
          <h2 className="mt-3 max-w-4xl text-4xl font-black tracking-normal sm:text-5xl">A practical, reassuring guide for first-time dads, expecting fathers, and new parents.</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              ["Pregnancy guide for dads", "Know how to support your pregnant partner, prepare for appointments, and build routines before birth."],
              ["Newborn tips for dads", "Get clear weekly actions for sleep support, feeding help, recovery, bonding, and home resets."],
              ["Fatherhood checklist", "Use readiness scores, stage-based checklists, and weekly steps to know what matters now."],
            ].map(([title, copy]) => (
              <article key={title} className="rounded-md border border-border bg-background p-5">
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          {[
            ["Lost", "Most content speaks around dads, not directly to them."],
            ["Useful", "Every email gives one practical move, not a flood of advice."],
            ["Ready", "PRO turns the journey into a guided plan with checklists, routines, and helpful tools."],
          ].map(([title, copy]) => (
            <div key={title} className="border-l-4 border-primary pl-5">
              <h2 className="text-3xl font-black">{title}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12" id="stage-preview">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="font-bold text-primary">Stage-based onboarding preview</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">Stage-based guidance for expecting dads, newborn dads, and the first year.</h2>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {stages.map((stage) => (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setSelectedStage(stage.id)}
                  className={`rounded-md border p-4 text-left transition ${
                    selectedStage === stage.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary"
                  }`}
                >
                  <span className="font-bold">{stage.label}</span>
                  <span className={`mt-1 block text-sm leading-6 ${selectedStage === stage.id ? "text-primary-foreground" : "text-muted-foreground"}`}>{stage.promise}</span>
                </button>
              ))}
            </div>

            <div className="rounded-md border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm font-bold text-primary">Your first weekly preview</p>
                  <h3 className="text-3xl font-black">{activeStage.label}</h3>
                </div>
              </div>
              <p className="mt-4 leading-7 text-muted-foreground">{activeStage.promise}</p>
              <div className="mt-6 rounded-md border border-primary/40 bg-background p-5">
                <p className="text-sm font-black text-primary">What you get this week</p>
                <h4 className="mt-2 text-2xl font-black">{activeStage.sequence[0]}</h4>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Lesson", activeStage.preview.lesson],
                    ["Action", activeStage.preview.action],
                    ["Partner move", activeStage.preview.partnerMove],
                    ["Avoid", activeStage.preview.mistake],
                  ].map(([label, copy]) => (
                    <div key={label} className="rounded-md border border-border bg-card p-4">
                      <p className="text-xs font-black uppercase text-primary">{label}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {activeStage.sequence.map((step, index) => (
                  <div key={step} className="grid grid-cols-[3rem_1fr] gap-4 rounded-md border border-border bg-background p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary font-black text-secondary-foreground">{index + 1}</div>
                    <div>
                      <p className="font-bold">Email {index + 1}</p>
                      <p className="mt-1 text-muted-foreground">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-card px-5 py-16 sm:px-8 lg:px-12" id="pro">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-bold text-primary">NextRoutine PRO</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">Turn weekly advice into a personal fatherhood support plan.</h2>
            <p className="mt-5 leading-7 text-muted-foreground">The newsletter gives dads a helpful weekly rhythm. PRO adds a more personal plan with checklists, readiness scores, and tools based on each dad’s stage.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {proFeatures.map((feature, index) => (
              <div key={feature} className="rounded-md border border-border bg-background p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                  {index === 0 && <Sparkles className="h-5 w-5" />}
                  {index === 1 && <Trophy className="h-5 w-5" />}
                  {index === 2 && <Shield className="h-5 w-5" />}
                  {index === 3 && <Lock className="h-5 w-5" />}
                </div>
                <p className="font-bold leading-7">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12" id="readiness-quiz">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="font-bold text-primary">Readiness quiz</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">Take the dad readiness quiz and get a reassuring next step.</h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              Answer four quick questions to calculate a stage-specific dad readiness score and get a practical next step based on pregnancy stage, newborn life, or baby age.
            </p>
            <select
              value={quizStage}
              onChange={(event) => setQuizStage(event.target.value)}
              className="mt-6 h-12 w-full max-w-md rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Quiz fatherhood stage"
            >
              {signupStages.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-md border border-border bg-card p-5">
            <div className="grid gap-4">
              {quizQuestions.map((question, index) => (
                <div key={question} className="rounded-md border border-border bg-background p-4">
                  <p className="font-bold leading-6">{question}</p>
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setQuizAnswers((answers) => answers.map((answer, answerIndex) => (answerIndex === index ? value : answer)))}
                        className={`rounded-md border px-3 py-2 text-sm font-bold transition ${
                          quizAnswers[index] === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary"
                        }`}
                      >
                        {value === 0 ? "Not yet" : value === 1 ? "Somewhat" : "Ready"}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-md border border-primary bg-primary p-5 text-primary-foreground">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase">Readiness score</p>
                  <p className="text-5xl font-black">{readinessScore}%</p>
                </div>
                <div className="h-3 w-full rounded-md bg-background/30 sm:max-w-56">
                  <div className="h-3 rounded-md bg-background transition-all" style={{ width: `${readinessScore}%` }} />
                </div>
              </div>
              <div className="mt-5 rounded-md bg-background p-4 text-foreground">
                <p className="text-sm font-black text-primary">Recommended next step</p>
                <p className="mt-2 leading-7 text-muted-foreground">{recommendedStep}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="font-bold text-primary">Dad Readiness Plan</p>
              <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">Six weeks to feel calmer, more useful, and more prepared.</h2>
              <p className="mt-5 leading-7 text-muted-foreground">
                The plan turns fatherhood prep into small weekly steps: understand what matters now, support your partner, and build routines that make home feel steadier.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {["Know your role", "Build the support routine", "Money and home prep", "Partner check-in system", "Birth plan basics", "Newborn survival routine"].map((step, index) => (
                <div key={step} className="rounded-md border border-border bg-card p-5">
                  <p className="text-sm font-black text-primary">Week {index + 1}</p>
                  <h3 className="mt-2 text-xl font-black">{step}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">One step, one checklist, one conversation, one routine to put into action.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="font-bold text-primary">Monetization path</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">Start with a free new dad newsletter. Upgrade when you want more personal guidance.</h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-md border border-border bg-background p-6">
              <p className="text-sm font-black text-muted-foreground">FREE</p>
              <h3 className="mt-2 text-3xl font-black">Weekly Dad Brief</h3>
              <p className="mt-4 leading-7 text-muted-foreground">One stage-based fatherhood lesson, one practical action, one partner-support move, and one mistake to avoid each week.</p>
              <Button asChild variant="outline" className="mt-6 w-full border-border bg-card text-foreground hover:bg-muted">
                <a href="#stage-preview">Preview newsletter</a>
              </Button>
            </div>
            <div className="rounded-md border border-primary bg-primary p-6 text-primary-foreground">
              <p className="text-sm font-black">PRO</p>
              <h3 className="mt-2 text-3xl font-black">Personal Fatherhood Plan</h3>
              <p className="mt-4 leading-7">Personalized weekly guidance, readiness score, premium guides, trackers, and gentle step-by-step support by fatherhood stage.</p>
              <form onSubmit={handleProSubmit} className="mt-6 grid gap-3">
                <Input
                  type="email"
                  value={proEmail}
                  onChange={(event) => setProEmail(event.target.value)}
                  placeholder="dad@email.com"
                  className="h-12 border-background/30 bg-background text-foreground placeholder:text-muted-foreground"
                  aria-label="PRO waitlist email address"
                  required
                />
                <select
                  value={proStage}
                  onChange={(event) => setProStage(event.target.value)}
                  className="h-12 w-full rounded-md border border-background/30 bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="PRO waitlist fatherhood stage"
                  required
                >
                  <option value="">Choose your stage</option>
                  {signupStages.map((stage) => (
                    <option key={stage.value} value={stage.value}>
                      {stage.label}
                    </option>
                  ))}
                </select>
                <Button type="submit" variant="secondary" disabled={isProSubmitting} className="h-12 w-full bg-background text-foreground hover:bg-card">
                  {isProSubmitting ? "Saving" : "Join PRO waitlist"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12" id="pro-onboarding-preview">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-bold text-primary">PRO plan preview</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">Your PRO plan starts with the right first steps.</h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              When a dad joins PRO, the first steps match his stage, so the guidance feels relevant from day one.
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {signupStages.map((stage) => (
                <button
                  key={stage.value}
                  type="button"
                  onClick={() => setProPreviewStage(stage.value)}
                  className={`rounded-md border px-4 py-3 text-left text-sm font-bold transition ${
                    proPreviewStage === stage.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary"
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-border bg-card p-6">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <p className="text-sm font-bold text-primary">Sequence preview</p>
                <h3 className="text-3xl font-black">{signupStages.find((stage) => stage.value === proPreviewStage)?.label}</h3>
              </div>
              <div className="rounded-md bg-secondary px-3 py-2 text-sm font-black text-secondary-foreground">PRO</div>
            </div>
            <div className="mt-6 space-y-4">
              {activeProSequence.map((step, index) => (
                <div key={step} className="grid grid-cols-[3rem_1fr] gap-4 rounded-md border border-border bg-background p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary font-black text-primary-foreground">{index + 1}</div>
                  <div>
                    <p className="font-bold">PRO step {index + 1}</p>
                    <p className="mt-1 leading-6 text-muted-foreground">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="font-bold text-primary">FAQ</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal">Built for dads who want to feel a little more ready.</h2>
          </div>
          <div className="grid gap-4">
            {[
              ["Is this only for expecting dads?", "No. NextRoutine supports the full path from getting the news through the baby’s first year."],
              ["How is this different from a parenting blog?", "It is organized as stage-based action: what to learn, prepare, say, and do this week."],
              ["What will PRO include?", "A personalized weekly plan, Dad Readiness Plan, premium guides, readiness score, and practical trackers."],
              ["Is this medical advice?", "No. NextRoutine is educational guidance and practical planning support, not medical advice."],
            ].map(([question, answer]) => (
              <div key={question} className="rounded-md border border-border bg-card p-5">
                <h3 className="text-lg font-black">{question}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-md border border-border bg-card p-8 text-center sm:p-12">
          <p className="font-bold text-primary">NextRoutine</p>
          <h2 className="mx-auto mt-3 max-w-4xl text-4xl font-black tracking-normal sm:text-6xl">You do not need to know everything. Just start with the next step.</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted-foreground">Join the weekly dad routine and get calm, practical guidance for the stage you are in now.</p>
          <Button asChild className="mt-7 h-12 px-8 font-bold">
            <a href="#stage-preview">Choose your stage</a>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Index;