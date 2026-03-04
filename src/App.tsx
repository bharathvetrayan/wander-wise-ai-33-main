import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import PlanTrip from "./pages/PlanTrip";
import Auth from "./pages/Auth";
import MyTrips from "./pages/MyTrips";
import Chatbot from "./pages/Chatbot";
import CurrencyConverter from "./pages/CurrencyConverter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider defaultTheme="light" storageKey="travel-ai-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/plan" element={<PlanTrip />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/my-trips" element={<MyTrips />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/currency" element={<CurrencyConverter />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
