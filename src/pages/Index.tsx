import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ClipboardList, Mail, Sparkles, Target, Trophy } from "lucide-react";
import { toast } from "sonner";
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

const offerCards = [
  {
    title: "Weekly dad guidance",
    copy: "A short free email with one useful step for your pregnancy, newborn, or first-year stage.",
    icon: Mail,
  },
  {
    title: "Readiness quiz",
    copy: "A quick father readiness score with a recommended next step when you want more clarity.",
    icon: ClipboardList,
  },
  {
    title: "PRO personal plan",
    copy: "A deeper fatherhood plan with checklists, trackers, and stage-specific routines.",
    icon: Trophy,
  },
];

const freeFeatures = [
  "Weekly Dad Brief by stage",
  "One practical action each week",
  "Pregnancy and newborn guidance",
  "Free father readiness quiz",
];

const proFeatures = [
  "Personalized weekly fatherhood plan",
  "Premium checklists and preparation guides",
  "Readiness score, trackers, and progress prompts",
  "Stage-specific routines for pregnancy, birth, newborn life, and the first year",
];

const Index = () => {
  const [email, setEmail] = useState("");
  const [signupStage, setSignupStage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) || trimmedEmail.length > 255) {
      toast.error("Enter a valid email to join free.");
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
      pro_interest: false,
      onboarding_sequence: stageSequences[signupStage],
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
    toast.success("You are in. Your free weekly dad brief is saved.");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <section className="relative bg-gradient-hero px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between border-b border-border/80 pb-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Target className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-normal">NextRoutine</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm font-semibold text-muted-foreground">
            <a href="#free" className="transition hover:text-foreground">FREE</a>
            <Link to="/father-readiness-quiz" className="transition hover:text-foreground">Quiz</Link>
            <Link to="/pro" className="text-primary transition hover:text-accent">PRO</Link>
          </nav>
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border/80 bg-card/80 px-4 py-2 shadow-sm shadow-foreground/5 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              Free weekly guidance for first-time dads
            </div>
            <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              First-time dad? Start with one calm next step.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              NextRoutine is a free weekly dad newsletter for pregnancy, birth, newborn life, and the first year. Join free for practical guidance, then upgrade to PRO when you want a personal fatherhood plan.
            </p>

            <form id="newsletter-signup" onSubmit={handleSubmit} className="mt-8 grid max-w-3xl gap-3 rounded-2xl border border-border/80 bg-card/85 p-3 shadow-xl shadow-foreground/5 backdrop-blur sm:grid-cols-[1fr_1fr_auto]">
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="dad@email.com"
                className="h-12 rounded-xl border-border/80 bg-background text-foreground placeholder:text-muted-foreground"
                aria-label="Email address"
                required
              />
              <select
                value={signupStage}
                onChange={(event) => setSignupStage(event.target.value)}
                className="h-12 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Fatherhood stage"
                required
              >
                <option value="">Choose your stage</option>
                {signupStages.map((stage) => (
                  <option key={stage.value} value={stage.value}>{stage.label}</option>
                ))}
              </select>
              <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-xl font-bold sm:w-auto">
                {isSubmitting ? "Joining" : "Join free"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-3 text-sm text-muted-foreground">Free weekly guidance. No overwhelm. Unsubscribe anytime.</p>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-border/80 bg-gradient-card p-5 shadow-lg shadow-foreground/5">
              <div className="border-b border-border/80 pb-4">
                <p className="text-sm font-semibold text-primary">What lands in your inbox</p>
                <h2 className="mt-1 text-2xl font-bold">One short dad brief for your current stage</h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">A useful lesson, a practical action, a partner-support prompt, and one mistake to avoid.</p>
              </div>
              <div className="mt-5 space-y-3">
                {["Know what matters this week", "Support your partner with less guessing", "Build small routines before stress builds"].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-border/80 bg-background p-4">
                    <Check className="mt-0.5 h-5 w-5 text-primary" />
                    <span className="text-sm leading-6 text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl bg-gradient-warm p-4 text-foreground">
                <p className="text-sm font-bold uppercase">Start free</p>
                <p className="mt-1 text-lg font-bold">Get the weekly dad newsletter</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12" id="free">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="font-bold text-primary">What you get</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">A simple way to feel more ready without reading everything.</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {offerCards.map((card) => {
              const Icon = card.icon;
              return (
                <article key={card.title} className="rounded-2xl border border-border/80 bg-gradient-card p-6 shadow-lg shadow-foreground/5">
                  <Icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-4 text-2xl font-bold">{card.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{card.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border/80 bg-card/90 px-5 py-20 sm:px-8 lg:px-12" id="pro">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="font-bold text-primary">FREE vs PRO</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Start free. Go PRO when you want the full plan.</h2>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-background p-6">
              <p className="text-sm font-extrabold text-muted-foreground">FREE</p>
              <h3 className="mt-2 text-3xl font-bold">Weekly Dad Brief</h3>
              <p className="mt-4 leading-7 text-muted-foreground">Best for quick weekly support and small next steps.</p>
              <ul className="mt-5 space-y-3">
                {freeFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"><Check className="mt-0.5 h-4 w-4 text-primary" />{feature}</li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-6 w-full border-border/80 bg-card/90 text-foreground hover:bg-muted">
                <a href="#newsletter-signup">Join free</a>
              </Button>
            </div>

            <div className="rounded-2xl border border-primary/80 bg-primary p-6 text-primary-foreground">
              <p className="text-sm font-extrabold">PRO</p>
              <h3 className="mt-2 text-3xl font-bold">Personal Fatherhood Plan</h3>
              <p className="mt-4 leading-7">Best for deeper preparation by pregnancy month, birth stage, newborn phase, or baby age.</p>
              <ul className="mt-5 space-y-3">
                {proFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm leading-6"><Check className="mt-0.5 h-4 w-4" />{feature}</li>
                ))}
              </ul>
              <Button asChild variant="secondary" className="mt-6 w-full rounded-xl bg-background text-foreground hover:bg-muted">
                <Link to="/pro">See PRO</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          <Link to="/pre-fatherhood" className="rounded-2xl border border-primary/30 bg-sky p-5 font-bold text-sky-foreground hover:border-primary/80">
            Pre-fatherhood preparation checklist
          </Link>
          <Link to="/father-readiness-quiz" className="rounded-2xl border border-border/80 bg-gradient-card p-5 font-bold hover:border-primary/80">
            Take the free dad readiness quiz
          </Link>
          <Link to="/first-time-dad" className="rounded-2xl border border-border/80 bg-gradient-card p-5 font-bold hover:border-primary/80">
            Explore the first-time dad guide
          </Link>
        </div>
      </section>

      <section className="px-5 pb-24 pt-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl rounded-2xl border border-border/80 bg-gradient-warm p-8 text-center shadow-lg shadow-foreground/5 sm:p-12">
          <p className="font-bold text-primary">NextRoutine</p>
          <h2 className="mx-auto mt-3 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">You do not need every answer today.</h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-muted-foreground">Start with one helpful weekly email for your stage.</p>
          <Button asChild className="mt-7 h-12 px-8 font-bold">
            <a href="#newsletter-signup">Join free</a>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Index;
