import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Account from "./pages/Account.tsx";
import CheckoutSuccess from "./pages/CheckoutSuccess.tsx";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Pricing from "./pages/Pricing.tsx";
import Pro from "./pages/Pro.tsx";
import PreFatherhood from "./pages/PreFatherhood.tsx";
import { BlogPost, BlogRolloutHub, FatherReadinessQuizHub, GuideArticle, TopicPage } from "./pages/SeoCluster.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/account" element={<Account />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/pro" element={<Pro />} />
          <Route path="/pre-fatherhood" element={<PreFatherhood />} />
          <Route path="/father-readiness-quiz" element={<FatherReadinessQuizHub />} />
          <Route path="/first-time-dad" element={<TopicPage slug="first-time-dad" />} />
          <Route path="/pregnancy-month-by-month" element={<TopicPage slug="pregnancy-month-by-month" />} />
          <Route path="/newborn-readiness" element={<TopicPage slug="newborn-readiness" />} />
          <Route path="/blog" element={<BlogRolloutHub />} />
          <Route path="/blog/pregnancy-dad-next-steps" element={<BlogPost slug="pregnancy-dad-next-steps" />} />
          <Route path="/blog/birth-week-dad-plan" element={<BlogPost slug="birth-week-dad-plan" />} />
          <Route path="/blog/newborn-week-1-dad-guide" element={<BlogPost slug="newborn-week-1-dad-guide" />} />
          <Route path="/blog/newborn-weeks-2-3-routine" element={<BlogPost slug="newborn-weeks-2-3-routine" />} />
          <Route path="/blog/newborn-week-4-reset" element={<BlogPost slug="newborn-week-4-reset" />} />
          <Route path="/blog/baby-months-2-3-dad-rhythm" element={<BlogPost slug="baby-months-2-3-dad-rhythm" />} />
          <Route path="/guides/:slug" element={<GuideArticle />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
