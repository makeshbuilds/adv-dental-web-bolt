import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import LiquidChromeOGL from "./components/LiquidChromeOGL";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Gallery from "./pages/Gallery";
import FAQ from "./pages/FAQ";
import WhyChooseUs from "./pages/WhyChooseUs";
import Booking from "./pages/Booking";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1">
        <Switch>
          {/* Public Pages */}
          <Route path={"/"} component={Home} />
          <Route path={"/about"} component={About} />
          <Route path={"/services"} component={Services} />
          <Route path={"/services/:slug"} component={ServiceDetail} />
          <Route path={"/gallery"} component={Gallery} />
          <Route path={"/faq"} component={FAQ} />
          <Route path={"/why-choose-us"} component={WhyChooseUs} />
          <Route path={"/booking"} component={Booking} />
          
          {/* Admin Pages */}
          <Route path={"/admin/login"} component={AdminLogin} />
          <Route path={"/admin/*"} component={AdminDashboard} />
          
          {/* 404 */}
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <LiquidChromeOGL baseColor={[0.1, 0.1, 0.1]} speed={0.2} amplitude={0.3} interactive={true} />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
