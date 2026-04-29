import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type ProAccessState = {
  isLoading: boolean;
  user: User | null;
  isPro: boolean;
  profile: {
    current_fatherhood_stage: string;
  } | null;
  subscription: {
    plan: string;
    status: string;
    current_period_end: string | null;
  } | null;
};

export const useProAccess = (): ProAccessState => {
  const [state, setState] = useState<ProAccessState>({ isLoading: true, user: null, isPro: false, profile: null, subscription: null });

  useEffect(() => {
    let isMounted = true;

    const loadAccess = async (user: User | null) => {
      if (!user) {
        if (isMounted) setState({ isLoading: false, user: null, isPro: false, profile: null, subscription: null });
        return;
      }

      const [{ data }, { data: profileData }] = await Promise.all([
        (supabase as any)
        .from("user_subscriptions")
        .select("plan,status,current_period_end")
        .eq("user_id", user.id)
          .maybeSingle(),
        (supabase as any)
          .from("profiles")
          .select("current_fatherhood_stage")
          .eq("user_id", user.id)
          .maybeSingle(),
      ]);

      const profile = profileData ?? { current_fatherhood_stage: "thinking_about_it" };

      const periodEnd = data?.current_period_end ? new Date(data.current_period_end).getTime() : null;
      const isCurrent = periodEnd === null || periodEnd > Date.now();
      const isPro = data?.plan === "pro" && ["active", "trialing"].includes(data?.status) && isCurrent;

      if (isMounted) setState({ isLoading: false, user, isPro, profile, subscription: data ?? null });
    };

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      window.setTimeout(() => loadAccess(session?.user ?? null), 0);
    });

    supabase.auth.getSession().then(({ data }) => loadAccess(data.session?.user ?? null));

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return state;
};