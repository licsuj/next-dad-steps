import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Lock, Mail, Target } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const authSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(255),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const safeRedirect = (value: string | null) => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/account";
  return value;
};

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = useMemo(() => safeRedirect(searchParams.get("redirect")), [searchParams]);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    const { lovable } = await import("@/integrations/lovable");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}${redirectTo}` });
    if (result.error) toast.error("Could not start Google sign in. Try again in a moment.");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = authSchema.safeParse({ email, password });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your email and password.");
      return;
    }

    setIsSubmitting(true);
    const result = mode === "signin"
      ? await supabase.auth.signInWithPassword(parsed.data)
      : await supabase.auth.signUp({ ...parsed.data, options: { emailRedirectTo: `${window.location.origin}${redirectTo}` } });
    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      toast.success("Check your email to confirm your account.");
      return;
    }

    toast.success(mode === "signin" ? "Signed in." : "Account created.");
    navigate(redirectTo);
  };

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-5 py-6 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Target className="h-5 w-5" /></div>
            <span className="text-lg font-black">NextRoutine</span>
          </Link>
          <Link to="/pricing" className="rounded-full bg-card px-3 py-1.5 text-sm font-bold text-foreground transition hover:bg-primary hover:text-primary-foreground">Pricing</Link>
        </div>
      </header>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="font-black text-amber">NEXTROUTINE ACCOUNT</p>
            <h1 className="mt-3 text-5xl font-black leading-tight tracking-normal sm:text-6xl">Sign in before your next dad step.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Save your stage, manage PRO billing, and unlock routines from the same account.</p>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-gradient-card p-6 shadow-2xl shadow-background/40 sm:p-8">
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-background/70 p-1">
              <button type="button" onClick={() => setMode("signin")} className={`rounded-xl px-4 py-3 text-sm font-black transition ${mode === "signin" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>Log in</button>
              <button type="button" onClick={() => setMode("signup")} className={`rounded-xl px-4 py-3 text-sm font-black transition ${mode === "signup" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>Sign up</button>
            </div>

            <label className="mt-6 block text-sm font-black text-muted-foreground" htmlFor="auth-email">Email</label>
            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="auth-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 rounded-2xl border-border bg-background/80 pl-11 text-foreground" placeholder="dad@email.com" required />
            </div>

            <label className="mt-4 block text-sm font-black text-muted-foreground" htmlFor="auth-password">Password</label>
            <div className="relative mt-2">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="auth-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 rounded-2xl border-border bg-background/80 pl-11 text-foreground" placeholder="At least 8 characters" required />
            </div>

            <Button type="submit" disabled={isSubmitting} className="mt-6 h-12 w-full rounded-full font-black">
              {isSubmitting ? "Checking" : mode === "signin" ? "Log in" : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button type="button" onClick={handleGoogleSignIn} variant="outline" className="mt-3 h-12 w-full rounded-full border-border bg-background/70 font-black text-foreground hover:bg-sky hover:text-sky-foreground">
              Continue with Google
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Auth;