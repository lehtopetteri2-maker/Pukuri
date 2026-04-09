import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/lib/i18n";
import { isOnboarded } from "@/lib/countryStore";
import Onboarding from "@/components/Onboarding";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const AppContent = () => {
  const [onboarded, setOnboarded] = useState(isOnboarded);

  if (!onboarded) {
    return <Onboarding onComplete={() => setOnboarded(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
