import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Activities from "./pages/Activities";
import BiblicalReading from "./pages/BiblicalReading";
import BibleBookDetail from "./pages/BibleBookDetail";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import FAQ from "./pages/FAQ";
import Install from "./pages/Install";
import Auth from "./pages/Auth";
import AIChat from "./pages/AIChat";
import PrayerForum from "./pages/PrayerForum";
import { Admin } from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isLoading && <LoadingScreen />}
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/biblical-reading" element={<BiblicalReading />} />
            <Route path="/bible-book/:bookId" element={<BibleBookDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/install" element={<Install />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/ai-chat" element={<AIChat />} />
            <Route path="/prayer-forum" element={<PrayerForum />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
