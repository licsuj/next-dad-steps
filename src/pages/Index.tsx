import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Mail, Sparkles, Target, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const signupStages = [
  { value: "thinking_about_it", label: "Thinking about becoming a dad" },
  { value: "just_found_out", label: "Just got the news" },
  { value: "pregnancy_months", label: "Pregnancy months" },
  { value: "newborn", label: "Newborn" },
  { value: "baby_months", label: "Baby months" },
];

const stageSequences: Record<string, string[]> = {
  thinking_about_it: ["Money and leave checklist", "Career and support planning", "Home routine prep"],
  just_found_out: ["Your first 24-hour reset", "Partner support script", "Early appointment plan"],
  pregnancy_months: ["Pregnancy stage check-in", "Weekly support routine", "Birth-readiness basics"],
  newborn: ["Night support plan", "Partner recovery checklist", "Newborn home reset"],
  baby_months: ["Family rhythm reset", "Bonding routine", "First-year support check"],
};

const newsletterSignupSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email to join free.").max(255, "Email must be less than 255 characters."),
  fatherhoodStage: z.enum(["thinking_about_it", "just_found_out", "pregnancy_months", "newborn", "baby_months"], {
    errorMap: () => ({ message: "Choose your fatherhood stage first." }),
  }),
});

const offerBullets = [
  "One quick dad move each week",
  "Less doom-scrolling, more useful prep",
  "Built for pregnancy, newborn life, and year one",
];

const freeFeatures = [
  "Weekly Dad Brief for your stage",
  "One practical action to try",
  "Partner-support prompts",
  "Free readiness quiz access",
];

const quickQuizStages = [
  { value: "thinking_about_it", label: "Thinking about becoming a dad", path: "/pre-fatherhood", preview: "Pre-fatherhood planning preview" },
  { value: "just_found_out", label: "Just got the news", path: "/father-readiness-quiz", preview: "First readiness score preview" },
  { value: "pregnancy_months", label: "Pregnancy months", path: "/pregnancy-month-by-month", preview: "Pregnancy routine preview" },
  { value: "newborn", label: "Newborn", path: "/newborn-readiness", preview: "Newborn routine preview" },
  { value: "baby_months", label: "Baby months", path: "/blog/baby-months-2-3-dad-rhythm", preview: "First-year rhythm preview" },
];

const routinePreviews = [
  { stage: "Thinking about it", routine: "Money, leave, and career prep without spiraling", accent: "bg-sage text-sage-foreground" },
  { stage: "Pregnancy months", routine: "Weekly partner support, appointments, and home setup", accent: "bg-sky text-sky-foreground" },
  { stage: "Newborn", routine: "Night support, recovery help, and tiny home resets", accent: "bg-coral text-coral-foreground" },
  { stage: "Baby months", routine: "Family rhythm, bonding, and work-life boundaries", accent: "bg-primary text-primary-foreground" },
];

const proFeatures = [
  "Personalized prep plan",
  "Money, leave, health, and home checklists",
  "Progress prompts and routines",
  "Deeper support for big transitions",
];

const proSubscriptionBenefits = [
  "Weekly plan updates matched to your stage",
  "Adapts around money, career, leave, health, and relationship priorities",
  "Clear next steps, checklists, and partner-support prompts",
  "Progress nudges when your timeline or priorities shift",
];

const Index = () => {
  const [email, setEmail] = useState("");
  const [signupStage, setSignupStage] = useState("");
  const [quickQuizStage, setQuickQuizStage] = useState(quickQuizStages[0].value);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupConfirmation, setSignupConfirmation] = useState("");
  const selectedQuickQuizStage = quickQuizStages.find((stage) => stage.value === quickQuizStage) ?? quickQuizStages[0];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignupConfirmation("");
    const parsedSignup = newsletterSignupSchema.safeParse({ email, fatherhoodStage: signupStage });

    if (!parsedSignup.success) {
      toast.error(parsedSignup.error.issues[0]?.message ?? "Check your signup details and try again.");
      return;
    }

    const { email: validatedEmail, fatherhoodStage } = parsedSignup.data;

    setIsSubmitting(true);
    const { error } = await supabase.from("newsletter_signups").insert({
      email: validatedEmail,
      fatherhood_stage: fatherhoodStage,
      source: "landing_page",
      pro_interest: false,
      onboarding_sequence: stageSequences[fatherhoodStage],
    });

    setIsSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        setSignupConfirmation("You are already on the weekly brief list. We will keep sending stage-based dad prompts.");
        toast.success("You are already on the NextRoutine list.");
        return;
      }
      toast.error("Could not save your signup. Try again in a moment.");
      return;
    }

    setEmail("");
    setSignupStage("");
    setSignupConfirmation("You are in. Your free weekly dad brief is saved and tuned to your stage.");
    toast.success("You are in. Your free weekly dad brief is saved.");
  };

  return (
    <main className="dark min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative px-5 py-6 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
        <div className="relative mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
              <Target className="h-5 w-5" />
            </div>
            <span className="text-lg font-black tracking-normal">NextRoutine</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm font-bold">
            <Link to="/father-readiness-quiz" className="rounded-full bg-sky px-3 py-1.5 text-sky-foreground transition hover:bg-accent hover:text-accent-foreground">Quiz</Link>
            <Link to="/pro" className="rounded-full bg-primary px-3 py-1.5 text-primary-foreground transition hover:bg-coral hover:text-coral-foreground">PRO</Link>
          </nav>
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-8 pb-14 pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20 lg:pt-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-bold text-muted-foreground shadow-lg shadow-background/30 backdrop-blur">
              <Sparkles className="h-4 w-4 text-amber" />
              Tiny prep wins for modern dads
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-normal sm:text-6xl lg:text-7xl">
              Get dad-ready without making it your whole personality.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              A short, useful front door for first-time dads: start free, take the quiz, or go PRO when you want a plan that tells you exactly what to handle next.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="h-12 rounded-full bg-primary px-7 text-base font-black text-primary-foreground hover:bg-amber hover:text-amber-foreground">
                <a href="#newsletter-signup">Join free <ArrowRight className="h-4 w-4" /></a>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-full border-border bg-card/70 px-7 text-base font-black text-foreground hover:bg-sky hover:text-sky-foreground">
                <Link to="/father-readiness-quiz">Take the quiz</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-gradient-card p-5 shadow-2xl shadow-background/40 backdrop-blur">
            <div className="rounded-2xl bg-background/70 p-5">
              <p className="text-sm font-black uppercase text-amber">Brief offer</p>
              <h2 className="mt-2 text-3xl font-black">One weekly nudge. Zero dad-bro energy.</h2>
              <p className="mt-3 leading-7 text-muted-foreground">Get a bite-size step for your stage, from pre-baby planning to newborn routines.</p>
            </div>
            <div className="mt-4 space-y-3">
              {offerBullets.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-border bg-card/70 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sage text-sage-foreground">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl rounded-3xl border border-sky/40 bg-card p-5 shadow-xl shadow-background/30 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="font-black text-sky">QUICK QUIZ</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">Find your next dad routine.</h2>
              <p className="mt-3 leading-7 text-muted-foreground">Pick your stage and jump straight into the preview that fits where you are now.</p>
            </div>
            <div className="grid gap-3 rounded-2xl bg-background/70 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <label className="text-sm font-black text-muted-foreground" htmlFor="quick-quiz-stage">Your stage</label>
                <select
                  id="quick-quiz-stage"
                  value={quickQuizStage}
                  onChange={(event) => setQuickQuizStage(event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm font-bold text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {quickQuizStages.map((stage) => (
                    <option key={stage.value} value={stage.value}>{stage.label}</option>
                  ))}
                </select>
                <p className="mt-2 text-sm font-bold text-muted-foreground">{selectedQuickQuizStage.preview}</p>
              </div>
              <Button asChild className="h-12 rounded-2xl bg-sky px-6 font-black text-sky-foreground hover:bg-primary hover:text-primary-foreground">
                <Link to={selectedQuickQuizStage.path}>Start preview <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-black text-amber">NEXT ROUTINE PREVIEW</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">See your next routine for...</h2>
            </div>
            <p className="max-w-md leading-7 text-muted-foreground">The plan changes based on the stage you choose, so the next step feels useful right away.</p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {routinePreviews.map((item) => (
              <article key={item.stage} className="rounded-3xl border border-border bg-gradient-card p-4 shadow-lg shadow-background/25">
                <div className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${item.accent}`}>{item.stage}</div>
                <p className="mt-5 min-h-20 text-lg font-black leading-7 text-foreground">{item.routine}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 lg:px-12" id="pro">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="font-black text-coral">FREE vs PRO</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">Pick your level of ready.</h2>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <article className="relative overflow-hidden rounded-3xl border border-sage/50 bg-card p-6 shadow-xl shadow-background/30">
              <div className="absolute right-5 top-5 rounded-full bg-sage px-3 py-1 text-xs font-black text-sage-foreground">FREE</div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage text-sage-foreground">
                <Mail className="h-5 w-5" />
              </div>
              <p className="mt-5 text-sm font-black uppercase text-muted-foreground">Start light</p>
              <h3 className="mt-2 text-3xl font-black">Weekly Dad Brief</h3>
              <p className="mt-4 leading-7 text-muted-foreground">Best if you want quick confidence without another app to manage.</p>
              <ul className="mt-5 space-y-3">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 rounded-2xl bg-background/55 p-3 text-sm font-bold leading-6 text-muted-foreground"><Check className="mt-0.5 h-4 w-4 text-sage" />{feature}</li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-6 w-full rounded-full border-border bg-background/70 font-black text-foreground hover:bg-sage hover:text-sage-foreground">
                <a href="#newsletter-signup">Join free</a>
              </Button>
            </article>

            <article className="relative overflow-hidden rounded-3xl border border-primary/60 bg-gradient-warm p-6 text-card-foreground shadow-xl shadow-primary/15">
              <div className="absolute right-5 top-5 rounded-full bg-background px-3 py-1 text-xs font-black text-foreground">PRO</div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-foreground">
                <Trophy className="h-5 w-5" />
              </div>
              <p className="mt-5 text-sm font-black uppercase text-card-foreground/75">Go deeper</p>
              <h3 className="mt-2 text-3xl font-black">Personal Fatherhood Plan</h3>
              <p className="mt-4 leading-7 text-card-foreground/85">Best if you want the money, leave, health, relationship, and home stuff mapped out.</p>
              <ul className="mt-5 space-y-3">
                {proFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 rounded-2xl bg-background/70 p-3 text-sm font-bold leading-6 text-foreground"><Check className="mt-0.5 h-4 w-4 text-primary" />{feature}</li>
                ))}
              </ul>
              <div className="mt-5 rounded-2xl border border-background/40 bg-background/80 p-4 text-foreground">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-black uppercase text-muted-foreground">Subscription includes</p>
                  <p className="rounded-full bg-primary px-3 py-1 text-sm font-black text-primary-foreground">Pricing coming soon</p>
                </div>
                <ul className="mt-4 space-y-2">
                  {proSubscriptionBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm font-bold leading-6 text-muted-foreground">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-amber" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button asChild className="mt-6 w-full rounded-full bg-primary font-black text-primary-foreground hover:bg-coral hover:text-coral-foreground">
                <Link to="/pro">See PRO</Link>
              </Button>
            </article>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 pt-6 sm:px-8 lg:px-12">
        <div id="newsletter-signup" className="mx-auto max-w-6xl rounded-3xl border border-border bg-gradient-card p-5 shadow-2xl shadow-background/40 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="font-black text-amber">NEWSLETTER</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal sm:text-4xl">Get the free weekly brief.</h2>
              <p className="mt-3 leading-7 text-muted-foreground">Useful, short, and tuned to your stage.</p>
            </div>
            <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="dad@email.com"
                className="h-12 rounded-2xl border-border bg-background/80 text-foreground placeholder:text-muted-foreground"
                aria-label="Email address"
                required
              />
              <select
                value={signupStage}
                onChange={(event) => setSignupStage(event.target.value)}
                className="h-12 w-full rounded-2xl border border-input bg-background/80 px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Fatherhood stage"
                required
              >
                <option value="">Choose your stage</option>
                {signupStages.map((stage) => (
                  <option key={stage.value} value={stage.value}>{stage.label}</option>
                ))}
              </select>
              <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-2xl bg-primary font-black text-primary-foreground hover:bg-amber hover:text-amber-foreground sm:w-auto">
                {isSubmitting ? "Joining" : "Join free"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
