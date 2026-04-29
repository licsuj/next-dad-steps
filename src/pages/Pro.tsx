import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Lock, Shield, Sparkles, Target, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProAccess } from "@/hooks/use-pro-access";
import { supabase } from "@/integrations/supabase/client";

const signupStages = [
  { value: "thinking_about_it", label: "Thinking about becoming a dad" },
  { value: "just_found_out", label: "Just got the news" },
  { value: "pregnancy_months", label: "Pregnancy months" },
  { value: "newborn", label: "Newborn" },
  { value: "baby_months", label: "Baby months" },
];

const proFeatures = [
  "Personalized weekly plan by pregnancy month or baby age",
  "Step-by-step Dad Readiness Plan with progress prompts",
  "Premium guides for partner support, birth prep, and newborn routines",
  "Trackers for readiness score, checklists, sleep support, and habits",
];

const proOnboardingSequences: Record<string, string[]> = {
  thinking_about_it: ["Pre-fatherhood money check", "Career and time-off prep", "Support network map", "Home routine baseline"],
  just_found_out: ["Your first 24-hour reset", "Partner support script", "Early appointment plan", "Dad readiness baseline"],
  pregnancy_months: ["Pregnancy stage audit", "Weekly support routine", "Home and money prep", "Birth-readiness roadmap"],
  newborn: ["Night shift support plan", "Partner recovery checklist", "Newborn supply station", "First 30-day routine score"],
  baby_months: ["Family rhythm reset", "Bonding step plan", "Work-life boundary check", "First-year routine upgrade"],
};

const proRoutineDetails: Record<string, Array<{ title: string; why: string; actions: string[]; partnerPrompt: string; checklist: string[] }>> = {
  thinking_about_it: [
    { title: "Money and leave snapshot", why: "A calm baseline makes future decisions feel less abstract.", actions: ["List fixed monthly costs", "Check leave policy basics", "Pick one savings question to answer"], partnerPrompt: "Ask: what money topic would help us feel more steady this month?", checklist: ["Costs listed", "Leave policy found", "One question assigned"] },
    { title: "Support network map", why: "Knowing who can help before you need help lowers pressure later.", actions: ["Name three trusted helpers", "Mark practical vs emotional support", "Draft one low-pressure check-in text"], partnerPrompt: "Ask: who would you actually want around when things feel hard?", checklist: ["Helpers named", "Support types mapped", "Text drafted"] },
  ],
  just_found_out: [
    { title: "First 24-hour reset", why: "Early news can feel huge; your job is to steady the room first.", actions: ["Pause big decisions", "Write down top questions", "Schedule one quiet check-in"], partnerPrompt: "Ask: do you want excitement, planning, or quiet support from me today?", checklist: ["No rushed decisions", "Questions captured", "Check-in planned"] },
    { title: "Early appointment plan", why: "Appointments are easier when you know your role before walking in.", actions: ["Confirm date and location", "Add questions to notes", "Plan travel buffer"], partnerPrompt: "Ask: what do you want me to remember or ask at the appointment?", checklist: ["Appointment saved", "Questions ready", "Buffer planned"] },
  ],
  pregnancy_months: [
    { title: "Weekly support routine", why: "Consistent small support beats occasional grand gestures.", actions: ["Pick one home task to own", "Add one appointment reminder", "Plan a 15-minute check-in"], partnerPrompt: "Ask: what would make this week feel lighter for you?", checklist: ["Task owned", "Reminder set", "Check-in complete"] },
    { title: "Birth-readiness roadmap", why: "Preparing early keeps late pregnancy from becoming a scramble.", actions: ["Review birth preferences", "Start hospital bag list", "Confirm ride and contact plan"], partnerPrompt: "Ask: what part of birth prep feels most uncertain right now?", checklist: ["Preferences reviewed", "Bag list started", "Contact plan confirmed"] },
  ],
  newborn: [
    { title: "Night shift support plan", why: "Clear roles protect sleep and reduce 3 a.m. confusion.", actions: ["Choose your night responsibilities", "Prep bottles/diapers station", "Set a morning recovery block"], partnerPrompt: "Ask: which night stretch do you most need protected?", checklist: ["Roles chosen", "Station stocked", "Recovery block set"] },
    { title: "Partner recovery checklist", why: "Recovery support is practical, emotional, and easy to miss when tired.", actions: ["Track meals and water", "Handle one household reset", "Watch for mood or pain changes"], partnerPrompt: "Ask: what is one thing I can take off your plate today?", checklist: ["Meals covered", "Home reset done", "Recovery check noted"] },
  ],
  baby_months: [
    { title: "Family rhythm reset", why: "Baby months change fast; routines need small resets, not total overhauls.", actions: ["Review sleep and feeding rhythm", "Protect one family anchor", "Cut one unnecessary commitment"], partnerPrompt: "Ask: what part of our week feels most chaotic right now?", checklist: ["Rhythm reviewed", "Anchor protected", "One commitment cut"] },
    { title: "Bonding step plan", why: "Bonding grows through repeated small moments you can own.", actions: ["Pick one daily baby task", "Add a short play ritual", "Take one solo-care window"], partnerPrompt: "Ask: when would solo baby time help you most this week?", checklist: ["Task picked", "Ritual started", "Solo-care window planned"] },
  ],
};

const readinessPlan = ["Know your role", "Build the support routine", "Money and home prep", "Partner check-in system", "Birth plan basics", "Newborn survival routine"];

const proNewsletters = ["Money + leave reset", "Partner support script", "Stage-matched weekly checklist"];

const Pro = () => {
  const [proEmail, setProEmail] = useState("");
  const [proStage, setProStage] = useState("");
  const [proPreviewStage, setProPreviewStage] = useState("just_found_out");
  const [isProSubmitting, setIsProSubmitting] = useState(false);
  const { isLoading, user, isPro, profile } = useProAccess();
  const savedStage = profile?.current_fatherhood_stage ?? "thinking_about_it";
  const displayStage = isPro ? savedStage : proPreviewStage;
  const activeProSequence = useMemo(() => proOnboardingSequences[displayStage], [displayStage]);
  const activeRoutineDetails = useMemo(() => proRoutineDetails[displayStage] ?? [], [displayStage]);

  const handleGoogleSignIn = async () => {
    const { lovable } = await import("@/integrations/lovable");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.href });
    if (result.error) toast.error("Could not start Google sign in. Try again in a moment.");
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
      source: "pro_page",
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
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/80 px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Target className="h-5 w-5" /></div>
            <span className="text-lg font-bold">NextRoutine</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm font-semibold text-muted-foreground">
            <Link to="/father-readiness-quiz" className="hover:text-foreground">Quiz</Link>
            <Link to="/blog" className="hover:text-foreground">Guides</Link>
            <Link to="/#newsletter-signup" className="text-primary hover:text-foreground">FREE</Link>
          </nav>
        </div>
      </header>

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-bold text-primary">NextRoutine PRO</p>
            <h1 className="mt-3 text-5xl font-bold leading-tight tracking-tight sm:text-6xl">Turn weekly advice into a personal fatherhood support plan.</h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">PRO adds a stage-specific plan, progress prompts, premium checklists, and trackers for expecting dads, newborn dads, and the first year.</p>
            <Button asChild className="mt-7 h-12 rounded-xl px-8 font-bold">
              <a href="#pro-waitlist">Join PRO waitlist<ArrowRight className="h-4 w-4" /></a>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {proFeatures.map((feature, index) => (
              <div key={feature} className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-lg shadow-foreground/5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
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

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="font-bold text-primary">Dad Readiness Plan</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Six weeks of calmer, more useful preparation.</h2>
              <p className="mt-5 leading-7 text-muted-foreground">The plan turns fatherhood prep into guided weekly steps: understand what matters now, support your partner, and build routines that make home steadier.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {readinessPlan.map((step, index) => (
                <div key={step} className="rounded-2xl border border-border/80 bg-card/90 p-5">
                  <p className="text-sm font-extrabold text-primary">Week {index + 1}</p>
                  <h3 className="mt-2 text-xl font-bold">{step}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">One checklist, one conversation, and one routine to put into action.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/80 bg-card/90 px-5 py-20 sm:px-8 lg:px-12" id="pro-waitlist">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div>
            <p className="font-bold text-primary">Join the PRO waitlist</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Get notified when personal plans open.</h2>
            <p className="mt-5 leading-7 text-muted-foreground">Choose your stage so your PRO preview matches where you are right now.</p>
          </div>
          <form onSubmit={handleProSubmit} className="grid gap-3 rounded-2xl border border-primary/30 bg-primary p-6 text-primary-foreground">
            <Input type="email" value={proEmail} onChange={(event) => setProEmail(event.target.value)} placeholder="dad@email.com" className="h-12 border-background/30 bg-background text-foreground placeholder:text-muted-foreground" aria-label="PRO waitlist email address" required />
            <select value={proStage} onChange={(event) => setProStage(event.target.value)} className="h-12 w-full rounded-2xl border border-background/30 bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label="PRO waitlist fatherhood stage" required>
              <option value="">Choose your stage</option>
              {signupStages.map((stage) => <option key={stage.value} value={stage.value}>{stage.label}</option>)}
            </select>
            <Button type="submit" variant="secondary" disabled={isProSubmitting} className="h-12 w-full rounded-xl bg-background text-foreground hover:bg-muted">
              {isProSubmitting ? "Saving" : "Join PRO waitlist"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12" id="pro-onboarding-preview">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="font-bold text-primary">PRO preview</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">See how PRO adapts to your stage.</h2>
            <p className="mt-5 leading-7 text-muted-foreground">Choose a stage to preview the first steps, checklists, and routines a PRO plan can organize for you.</p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {signupStages.map((stage) => (
                <button key={stage.value} type="button" onClick={() => setProPreviewStage(stage.value)} className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${proPreviewStage === stage.value ? "border-primary/80 bg-primary text-primary-foreground" : "border-border/80 bg-card/90 text-foreground hover:border-primary/80"}`}>
                  {stage.label}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-border/80 bg-card/90 p-6">
            <div className="flex items-center justify-between gap-4 border-b border-border/80 pb-4">
              <div>
                <p className="text-sm font-bold text-primary">{isPro ? "Your saved stage" : "Sequence preview"}</p>
                <h3 className="text-3xl font-bold">{signupStages.find((stage) => stage.value === displayStage)?.label}</h3>
              </div>
              <div className="rounded-2xl bg-secondary px-3 py-2 text-sm font-bold text-secondary-foreground">PRO</div>
            </div>
            {isLoading ? (
              <div className="mt-6 rounded-2xl border border-border/80 bg-background p-5 font-bold text-muted-foreground">Checking PRO access...</div>
            ) : isPro ? (
              <div className="mt-6 space-y-4">
                {activeProSequence.map((step, index) => (
                  <div key={step} className="grid grid-cols-[3rem_1fr] gap-4 rounded-2xl border border-border/80 bg-background p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">{index + 1}</div>
                    <div>
                      <p className="font-bold">PRO routine {index + 1}</p>
                      <p className="mt-1 leading-6 text-muted-foreground">{step}</p>
                    </div>
                  </div>
                ))}
                <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4">
                  <p className="font-bold text-primary">Your PRO newsletters</p>
                  <ul className="mt-3 space-y-2">
                    {proNewsletters.map((item) => <li key={item} className="flex gap-2 text-sm font-bold text-muted-foreground"><Check className="h-4 w-4 text-primary" />{item}</li>)}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-primary/30 bg-background p-5">
                <Lock className="h-8 w-8 text-primary" />
                <h4 className="mt-4 text-2xl font-bold">PRO routines are locked.</h4>
                <p className="mt-3 leading-7 text-muted-foreground">{user ? "Upgrade to unlock stage-matched routines and PRO newsletters." : "Sign in, then upgrade to unlock stage-matched routines and PRO newsletters."}</p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  {!user && <Button asChild variant="outline" className="rounded-xl font-bold"><Link to="/auth?redirect=/pro">Sign in</Link></Button>}
                  {!user && <Button type="button" onClick={handleGoogleSignIn} variant="outline" className="rounded-xl font-bold">Google</Button>}
                  <Button asChild className="rounded-xl font-bold"><Link to="/pricing">View pricing<ArrowRight className="h-4 w-4" /></Link></Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {isPro && (
          <div className="mx-auto mt-8 max-w-7xl">
            <div className="grid gap-4 lg:grid-cols-2">
              {activeRoutineDetails.map((routine) => (
                <article key={routine.title} className="rounded-2xl border border-border/80 bg-card/90 p-6 shadow-lg shadow-foreground/5">
                  <p className="text-sm font-bold text-primary">This week</p>
                  <h3 className="mt-2 text-2xl font-bold">{routine.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{routine.why}</p>
                  <div className="mt-5 rounded-2xl bg-background p-4">
                    <p className="font-bold">Action steps</p>
                    <ol className="mt-3 space-y-2">
                      {routine.actions.map((action, index) => <li key={action} className="text-sm font-bold leading-6 text-muted-foreground">{index + 1}. {action}</li>)}
                    </ol>
                  </div>
                  <p className="mt-4 rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm font-bold leading-6 text-primary">{routine.partnerPrompt}</p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                    {routine.checklist.map((item) => <li key={item} className="flex items-center gap-2 rounded-xl bg-background p-3 text-xs font-bold text-muted-foreground"><Check className="h-4 w-4 text-primary" />{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Pro;
