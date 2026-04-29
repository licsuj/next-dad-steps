import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { ArrowRight, Check, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type CheckoutState = "loading" | "signed_out" | "confirmed" | "pending";

const isSubscriptionActive = (subscription: { plan?: string; status?: string; current_period_end?: string | null } | null) => {
  if (!subscription) return false;
  const periodEnd = subscription.current_period_end ? new Date(subscription.current_period_end).getTime() : null;
  const isCurrent = periodEnd === null || periodEnd > Date.now();
  return subscription.plan === "pro" && ["active", "trialing"].includes(subscription.status ?? "") && isCurrent;
};

const CheckoutSuccess = () => {
  const [state, setState] = useState<CheckoutState>("loading");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let isMounted = true;
    let attempts = 0;
    let interval: ReturnType<typeof window.setInterval> | undefined;

    const checkSubscription = async (currentUser: User | null) => {
      if (!currentUser) {
        if (isMounted) setState("signed_out");
        return;
      }

      setUser(currentUser);
      const { data } = await (supabase as any)
        .from("user_subscriptions")
        .select("plan,status,current_period_end")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (isSubscriptionActive(data)) {
        if (interval) window.clearInterval(interval);
        if (isMounted) setState("confirmed");
        return;
      }

      if (attempts >= 6 && isMounted) setState("pending");
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      window.setTimeout(() => checkSubscription(session?.user ?? null), 0);
    });

    supabase.auth.getSession().then(({ data }) => {
      const currentUser = data.session?.user ?? null;
      checkSubscription(currentUser);
      if (currentUser) {
        interval = window.setInterval(() => {
          attempts += 1;
          checkSubscription(currentUser);
        }, 2000);
      }
    });

    return () => {
      isMounted = false;
      if (interval) window.clearInterval(interval);
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Target className="h-5 w-5" /></div>
            <span className="text-lg font-black">NextRoutine</span>
          </Link>
          <Link to="/account" className="rounded-full bg-card px-3 py-1.5 text-sm font-bold text-foreground transition hover:bg-primary hover:text-primary-foreground">Account</Link>
        </div>
      </header>

      <section className="px-5 py-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-gradient-card p-6 text-center shadow-2xl shadow-background/40 sm:p-10">
          {state === "confirmed" ? (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-sage-foreground"><Check className="h-7 w-7" /></div>
              <p className="mt-6 font-black text-sage">PAYMENT CONFIRMED</p>
              <h1 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">PRO is unlocked.</h1>
              <p className="mt-4 leading-7 text-muted-foreground">Your stage-matched routines and PRO newsletters are now available for {user?.email ?? "your account"}.</p>
              <Button asChild className="mt-7 rounded-full font-black"><Link to="/pro">Open PRO experience<ArrowRight className="h-4 w-4" /></Link></Button>
            </>
          ) : state === "signed_out" ? (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-coral text-coral-foreground"><Clock className="h-7 w-7" /></div>
              <h1 className="mt-6 text-4xl font-black tracking-normal sm:text-5xl">Sign in to confirm PRO.</h1>
              <p className="mt-4 leading-7 text-muted-foreground">Use the same account you checked out with so we can unlock your subscription.</p>
              <Button asChild className="mt-7 rounded-full font-black"><Link to="/account">Go to account<ArrowRight className="h-4 w-4" /></Link></Button>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Clock className="h-7 w-7" /></div>
              <p className="mt-6 font-black text-amber">{state === "loading" ? "CONFIRMING PAYMENT" : "PAYMENT RECEIVED"}</p>
              <h1 className="mt-3 text-4xl font-black tracking-normal sm:text-5xl">We are checking your PRO access.</h1>
              <p className="mt-4 leading-7 text-muted-foreground">This usually updates right after payment confirmation. If it is still pending, your account page will show the latest billing status.</p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild className="rounded-full font-black"><Link to="/account">View account</Link></Button>
                <Button asChild variant="outline" className="rounded-full border-border bg-background/70 font-black text-foreground hover:bg-sky hover:text-sky-foreground"><Link to="/pro">Check PRO</Link></Button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default CheckoutSuccess;