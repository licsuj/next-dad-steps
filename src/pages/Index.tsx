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
  },
  {
    id: "pregnancy_1_3",
    label: "Pregnancy months 1–3",
    promise: "Build the early support routine while everything still feels unreal.",
    sequence: ["Your first trimester mission", "What she may need but not ask for", "The no-panic prep checklist"],
  },
  {
    id: "pregnancy_4_6",
    label: "Pregnancy months 4–6",
    promise: "Move from reaction mode into planning mode with weekly action steps.",
    sequence: ["Home systems before baby arrives", "Partner check-in scripts", "Dad readiness score: mid-pregnancy"],
  },
  {
    id: "pregnancy_7_9",
    label: "Pregnancy months 7–9",
    promise: "Prepare for birth, hospital week, and the first nights at home.",
    sequence: ["Birth week command center", "Hospital bag: dad edition", "The first 72 hours plan"],
  },
  {
    id: "birth_week",
    label: "Birth and hospital week",
    promise: "Stay useful, calm, and ready when the pressure gets real.",
    sequence: ["Your hospital role", "Visitors, boundaries, and recovery", "The ride-home routine"],
  },
  {
    id: "newborn_0_3",
    label: "Newborn months 0–3",
    promise: "Survive the fog with simple routines for sleep, feeding support, and teamwork.",
    sequence: ["Night shift system", "Partner recovery support", "Newborn bonding without overthinking"],
  },
  {
    id: "baby_3_6",
    label: "Baby months 3–6",
    promise: "Turn chaos into rhythm as your baby becomes more alert and interactive.",
    sequence: ["Weekend reset ritual", "Play and bonding missions", "Work-life protection plan"],
  },
  {
    id: "baby_6_12",
    label: "Baby months 6–12",
    promise: "Keep growing as a dad while routines, mobility, and identity shift again.",
    sequence: ["First-year routine planner", "Confidence through repetition", "Relationship maintenance mode"],
  },
];

const proFeatures = [
  "Personalized weekly plan by pregnancy month or baby age",
  "Dad Readiness Challenge with missions and progress prompts",
  "Premium guides for partner support, birth prep, and first-year routines",
  "Trackers for readiness score, sleep support, checklists, and habits",
];

const Index = () => {
  const [email, setEmail] = useState("");
  const [selectedStage, setSelectedStage] = useState(stages[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeStage = useMemo(() => stages.find((stage) => stage.id === selectedStage) ?? stages[0], [selectedStage]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) || trimmedEmail.length > 255) {
      toast.error("Enter a valid email to join the mission.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase.from("newsletter_signups").insert({
      email: trimmedEmail,
      fatherhood_stage: selectedStage,
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
    toast.success("You are in. Your stage-based routine preview is saved.");
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
              Weekly dad guidance from pregnancy news to year one
            </div>
            <h1 className="max-w-4xl text-5xl font-black leading-none tracking-normal sm:text-6xl lg:text-7xl">
              Fatherhood does not come with a manual. Get the next move.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              NextRoutine gives new and expecting fathers a stage-based weekly plan, practical missions, and a clear routine when everything feels uncertain.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 max-w-2xl rounded-md border border-border bg-card p-3 shadow-2xl shadow-secondary/20 sm:flex sm:gap-3">
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="dad@email.com"
                className="h-12 border-border bg-background text-foreground placeholder:text-muted-foreground"
                aria-label="Email address"
              />
              <Button type="submit" disabled={isSubmitting} className="mt-3 h-12 w-full font-bold sm:mt-0 sm:w-auto">
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
                  <p className="text-sm font-semibold text-primary">This week’s dad mission</p>
                  <h2 className="mt-1 text-2xl font-black">Build your command center</h2>
                </div>
                <div className="rounded-md bg-secondary px-3 py-2 text-sm font-bold">Score 72%</div>
              </div>
              <div className="mt-5 space-y-3">
                {["Know what stage you are in", "Take one pressure off your partner", "Prepare one system before it becomes urgent"].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-md border border-border bg-background p-4">
                    <Check className="mt-0.5 h-5 w-5 text-primary" />
                    <span className="text-sm leading-6 text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-md bg-primary p-4 text-primary-foreground">
                <p className="text-sm font-black uppercase">Next unlock</p>
                <p className="mt-1 text-lg font-bold">Your personalized Dad Readiness Plan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card px-5 py-14 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
          {[
            ["Lost", "Most content speaks around dads, not directly to them."],
            ["Useful", "Every email gives one practical move, not a flood of advice."],
            ["Ready", "PRO turns the journey into a guided plan with tools and trackers."],
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
            <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">A dad in month three needs a different routine than a dad in week one.</h2>
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
                  <p className="text-sm font-bold text-primary">Your first onboarding sequence</p>
                  <h3 className="text-3xl font-black">{activeStage.label}</h3>
                </div>
              </div>
              <p className="mt-4 leading-7 text-muted-foreground">{activeStage.promise}</p>
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
            <h2 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">Turn weekly advice into a personal fatherhood operating system.</h2>
            <p className="mt-5 leading-7 text-muted-foreground">The newsletter builds trust. PRO becomes the paid guided coach: plans, missions, scorecards, and tools based on each dad’s exact stage.</p>
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
    </main>
  );
};

export default Index;