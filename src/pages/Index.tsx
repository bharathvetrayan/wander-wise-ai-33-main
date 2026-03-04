import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection, FeaturesSection, HowItWorksSection, TrustSection } from "@/components/home/HeroSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <TrustSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
