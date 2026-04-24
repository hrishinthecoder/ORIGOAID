import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Index is the most-visited page — start its chunk loading immediately
// so returning to "/" feels instant.
const indexLoader = () => import("./pages/Index");
const Index = lazy(indexLoader);

const NotFound         = lazy(() => import("./pages/NotFound"));
const CampaignDetail   = lazy(() => import("./pages/CampaignDetail"));
const StartCampaign    = lazy(() => import("./pages/StartCampaign"));
const Login            = lazy(() => import("./pages/Login"));
const Signup           = lazy(() => import("./pages/Signup"));
const Browse           = lazy(() => import("./pages/Browse"));
const Donate           = lazy(() => import("./pages/Donate"));
const Dashboard        = lazy(() => import("./pages/Dashboard"));
const About            = lazy(() => import("./pages/About"));
const Categories       = lazy(() => import("./pages/Categories"));
const AIStudio         = lazy(() => import("./pages/AIStudio"));
const AIChatPage       = lazy(() => import("./pages/AIChat"));
const Profile          = lazy(() => import("./pages/Profile"));
const OrganizerProfile = lazy(() => import("./pages/OrganizerProfile"));
const Messages         = lazy(() => import("./pages/Messages"));
const HelpCenter       = lazy(() => import("./pages/support/HelpCenter"));
const PaymentMethods   = lazy(() => import("./pages/support/PaymentMethods"));
const Contact          = lazy(() => import("./pages/support/Contact"));
const ReportCampaign   = lazy(() => import("./pages/support/ReportCampaign"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Sensible defaults so react-query doesn't thrash on nav
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen grid place-items-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Loading…</span>
      </div>
    </div>
  );
}

function RouteTree() {
  // Preload Index after the first paint so returning to home is instant.
  useEffect(() => {
    const t = setTimeout(() => {
      void indexLoader();
    }, 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/campaign/:id" element={<CampaignDetail />} />
      <Route path="/donate/:id" element={<Donate />} />
      <Route path="/start-campaign" element={<StartCampaign />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/organizer/:slug" element={<OrganizerProfile />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/messages/:slug" element={<Messages />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/payments" element={<PaymentMethods />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/report" element={<ReportCampaign />} />
      <Route path="/about" element={<About />} />
      <Route path="/ai" element={<AIStudio />} />
      <Route path="/chat" element={<AIChatPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}>
        <Suspense fallback={<PageLoader />}>
          <RouteTree />
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
