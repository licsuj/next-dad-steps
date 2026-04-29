import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CreditCard, Lock, Target } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useProAccess } from "@/hooks/use-pro-access";
import { supabase } from "@/integrations/supabase/client";

const fatherhoodStages = [
  { value: "thinking_about_it", label: "Thinking about becoming a dad" },
  { value: "just_found_out", label: "Just got the news" },
  { value: "pregnancy_months", label: "Pregnancy months" },
  { value: "newborn", label: "Newborn" },
  { value: "baby_months", label: "Baby months" },
];

const cancellationSchema = z.object({
  reason: z.string().trim().max(500, "Keep your cancellation note under 500 characters.").optional(),
});

const formatDate = (value: string | null | undefined) => {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
};

const Account = () => {
  const { isLoading, user, isPro, profile, subscription } = useProAccess();
  const [reason, setReason] = useState("");
  const [stage, setStage] = useState("");
  const activeStage = stage || profile?.current_fatherhood_stage || "thinking_about_it";
  const [isCancelling, setIsCancelling] = useState(false);

  const handleStageSave = async () => {
    if (!user) return;
    if (!fatherhoodStages.some((item) => item.value === activeStage)) {
      toast.error("Choose a valid fatherhood stage.");
      return;
    }

    const { error } = await (supabase as any).from("profiles").upsert({
      user_id: user.id,
      current_fatherhood_stage: activeStage,
    }, { onConflict: "user_id" });

    if (error) {
      toast.error("Could not save your fatherhood stage. Try again in a moment.");
      return;
    }

    toast.success("Fatherhood stage saved for your PRO routines.");
  };

  const handleGoogleSignIn = async () => {
    const { lovable } = await import("@/integrations/lovable");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.href });
    if (result.error) toast.error("Could not start Google sign in. Try again in a moment.");
  };

  const handleCancellationRequest = async () => {
    if (!user) {
      toast.error("Sign in to manage your subscription.");
      return;
    }

    const parsed = cancellationSchema.safeParse({ reason });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your cancellation note.");
      return;
    }

    setIsCancelling(true);
    const { error } = await (supabase as any).from("subscription_cancellation_requests").insert({
      user_id: user.id,
      reason: parsed.data.reason || null,
      status: "requested",
    });
    setIsCancelling(false);

    if (error) {
      toast.error("Could not submit the cancellation request. Try again in a moment.");
      return;
    }

    setReason("");
    toast.success("Cancellation request received. Billing status will update after processing.");
  };

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Target className="h-5 w-5" /></div>
            <span className="text-lg font-black">NextRoutine</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm font-bold">
            <Link to="/pricing" className="rounded-full bg-primary px-3 py-1.5 text-primary-foreground">Pricing</Link>
            <Link to="/pro" className="rounded-full bg-sky px-3 py-1.5 text-sky-foreground">PRO</Link>
          </nav>
        </div>
      </header>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <p className="font-black text-amber">PRO ACCOUNT</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black leading-tight tracking-normal sm:text-6xl">Manage your subscription and billing status.</h1>

          {isLoading ? (
            <div className="mt-8 rounded-3xl border border-border bg-card p-6 font-bold text-muted-foreground">Loading account...</div>
          ) : !user ? (
            <div className="mt-8 rounded-3xl border border-primary/40 bg-gradient-card p-6">
              <Lock className="h-8 w-8 text-primary" />
              <h2 className="mt-4 text-3xl font-black">Sign in to view billing.</h2>
              <p className="mt-3 leading-7 text-muted-foreground">Your subscription status, cancellation options, and PRO access live inside your account.</p>
              <Button type="button" onClick={handleGoogleSignIn} className="mt-5 rounded-full font-black">Sign in with Google</Button>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
              <article className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-background/30">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><CreditCard className="h-5 w-5" /></div>
                <h2 className="mt-5 text-3xl font-black">Billing status</h2>
                <div className="mt-5 space-y-3 text-sm font-bold">
                  <div className="flex justify-between gap-4 rounded-2xl bg-background/70 p-3"><span className="text-muted-foreground">Plan</span><span>{subscription?.plan?.toUpperCase() ?? "FREE"}</span></div>
                  <div className="flex justify-between gap-4 rounded-2xl bg-background/70 p-3"><span className="text-muted-foreground">Status</span><span>{subscription?.status ?? "inactive"}</span></div>
                  <div className="flex justify-between gap-4 rounded-2xl bg-background/70 p-3"><span className="text-muted-foreground">Renews / access ends</span><span>{formatDate(subscription?.current_period_end)}</span></div>
                </div>
                <p className="mt-5 rounded-2xl bg-sage/15 p-4 text-sm font-bold leading-6 text-sage">{isPro ? "Your PRO routines and newsletters are unlocked." : "PRO is not active on this account yet."}</p>
                {!isPro && <Button asChild className="mt-5 w-full rounded-full font-black"><Link to="/pricing">Upgrade to PRO<ArrowRight className="h-4 w-4" /></Link></Button>}
              </article>

              <article className="rounded-3xl border border-border bg-gradient-card p-6 shadow-xl shadow-background/30">
                <h2 className="text-3xl font-black">Personalization</h2>
                <p className="mt-3 leading-7 text-muted-foreground">Save your current fatherhood stage. PRO uses this to serve your stage-matched routines after subscription is active.</p>
                <select value={activeStage} onChange={(event) => setStage(event.target.value)} className="mt-5 h-12 w-full rounded-2xl border border-input bg-background/80 px-3 py-2 text-sm font-bold text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  {fatherhoodStages.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                <Button type="button" onClick={handleStageSave} className="mt-4 w-full rounded-full font-black">Save stage</Button>
              </article>

              <article className="rounded-3xl border border-border bg-gradient-card p-6 shadow-xl shadow-background/30 lg:col-start-2">
                <h2 className="text-3xl font-black">Manage subscription</h2>
                <p className="mt-3 leading-7 text-muted-foreground">Request cancellation here. When live checkout is connected, this section can link directly to the billing portal.</p>
                <Textarea value={reason} onChange={(event) => setReason(event.target.value)} maxLength={500} placeholder="Optional: tell us why you are cancelling" className="mt-5 min-h-28 rounded-2xl border-border bg-background/80 text-foreground placeholder:text-muted-foreground" />
                <Button type="button" onClick={handleCancellationRequest} disabled={isCancelling} variant="outline" className="mt-4 w-full rounded-full border-border bg-background/70 font-black text-foreground hover:bg-coral hover:text-coral-foreground">
                  {isCancelling ? "Submitting" : "Request cancellation"}
                </Button>
              </article>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Account;