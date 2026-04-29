import { Link } from "react-router-dom";
import { ArrowRight, Check, Mail, Sparkles, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProAccess } from "@/hooks/use-pro-access";

const freeDetails = [
  "Weekly Dad Brief tuned to your stage",
  "One practical next move each week",
  "Partner-support prompts",
  "Father readiness quiz access",
];

const proDetails = [
  "Personalized weekly fatherhood plan",
  "Adapts to money, career, leave, health, and relationship priorities",
  "Stage-based checklists for pregnancy, newborn, and baby months",
  "Progress nudges when your timeline or priorities change",
  "Deeper routines for partner support, home prep, and sleep support",
];

const Pricing = () => {
  const { isLoading, user, isPro } = useProAccess();
  const proCta = isLoading ? "Checking account" : isPro ? "Open PRO" : user ? "Start PRO" : "Sign in to start PRO";
  const proPath = isPro ? "/pro" : user ? "/pro#pro-waitlist" : "/auth?redirect=/pricing";

  return (
    <main className="dark min-h-screen bg-background text-foreground">
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
            <Link to="/#newsletter-signup" className="rounded-full bg-sage px-3 py-1.5 text-sage-foreground transition hover:bg-primary hover:text-primary-foreground">FREE</Link>
            <Link to="/account" className="rounded-full bg-card px-3 py-1.5 text-foreground transition hover:bg-primary hover:text-primary-foreground">Account</Link>
          </nav>
        </div>

        <div className="relative mx-auto max-w-6xl pb-12 pt-16 text-center sm:pt-20">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-bold text-muted-foreground shadow-lg shadow-background/30 backdrop-blur">
            <Sparkles className="h-4 w-4 text-amber" />
            Simple plans for becoming more dad-ready
          </div>
          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-black leading-tight tracking-normal sm:text-6xl">Choose the level of support you want each week.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Start free for quick weekly nudges, or go PRO when you want a personal plan that adapts to your stage and priorities.</p>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
          <article className="relative overflow-hidden rounded-3xl border border-sage/50 bg-card p-6 shadow-xl shadow-background/30">
            <div className="absolute right-5 top-5 rounded-full bg-sage px-3 py-1 text-xs font-black text-sage-foreground">FREE</div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage text-sage-foreground">
              <Mail className="h-5 w-5" />
            </div>
            <p className="mt-5 text-sm font-black uppercase text-muted-foreground">Start light</p>
            <h2 className="mt-2 text-3xl font-black">Weekly Dad Brief</h2>
            <p className="mt-3 text-4xl font-black text-foreground">Free</p>
            <p className="mt-4 leading-7 text-muted-foreground">Best for quick confidence, stage-based reminders, and small actions you can actually do.</p>
            <ul className="mt-6 space-y-3">
              {freeDetails.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-2xl bg-background/55 p-3 text-sm font-bold leading-6 text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-6 w-full rounded-full border-border bg-background/70 font-black text-foreground hover:bg-sage hover:text-sage-foreground">
              <Link to="/#newsletter-signup">Join free</Link>
            </Button>
          </article>

          <article className="relative overflow-hidden rounded-3xl border border-primary/60 bg-gradient-warm p-6 text-card-foreground shadow-xl shadow-primary/15">
            <div className="absolute right-5 top-5 rounded-full bg-background px-3 py-1 text-xs font-black text-foreground">PRO</div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background text-foreground">
              <Trophy className="h-5 w-5" />
            </div>
            <p className="mt-5 text-sm font-black uppercase text-card-foreground/75">Go personal</p>
            <h2 className="mt-2 text-3xl font-black">Personal Fatherhood Plan</h2>
            <p className="mt-3 inline-flex rounded-full bg-background px-4 py-2 text-base font-black text-foreground">PRO access unlocks after checkout</p>
            <p className="mt-4 leading-7 text-card-foreground/85">Best when you want the money, leave, health, relationship, and home prep mapped into a weekly routine.</p>
            <ul className="mt-6 space-y-3">
              {proDetails.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-2xl bg-background/75 p-3 text-sm font-bold leading-6 text-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button asChild disabled={isLoading} className="mt-6 w-full rounded-full bg-primary font-black text-primary-foreground hover:bg-coral hover:text-coral-foreground">
              <Link to={proPath}>{proCta} <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Pricing;