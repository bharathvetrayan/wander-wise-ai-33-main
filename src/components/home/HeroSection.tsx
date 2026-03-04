import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Bot, 
  Landmark, 
  Sparkles, 
  Mountain, 
  Shield, 
  Clock,
  Compass,
  Route,
  IndianRupee
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-travel.jpg";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Itineraries",
    description: "Get personalized day-by-day travel plans across India based on your interests and budget.",
  },
  {
    icon: MapPin,
    title: "Interactive Maps",
    description: "Visualize temples, palaces, beaches, mountains, and attractions across all 28 states.",
  },
  {
    icon: Landmark,
    title: "Temple & Heritage Guide",
    description: "Discover UNESCO sites, ancient temples, forts, and India's 5000-year-old cultural heritage.",
  },
  {
    icon: IndianRupee,
    title: "Budget Planner",
    description: "Smart INR budgeting from backpacker to luxury with real cost estimates.",
  },
  {
    icon: Calendar,
    title: "Festival Calendar",
    description: "Plan around Diwali, Holi, Durga Puja, Onam, and regional festivals.",
  },
  {
    icon: Mountain,
    title: "Region Explorer",
    description: "From Kashmir to Kanyakumari - explore North, South, East, West & Northeast India.",
  },
];

// Decorative pattern component
const DecorativePattern = ({ className = "" }: { className?: string }) => (
  <div className={`absolute pointer-events-none opacity-[0.03] dark:opacity-[0.05] ${className}`}>
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <pattern id="indian-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="1.5" fill="currentColor" className="text-primary" />
        <path d="M0 10 L5 5 L10 10 L5 15 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent" opacity="0.5" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#indian-pattern)" />
    </svg>
  </div>
);

// Ornate divider component
const OrnateDivider = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`}>
    <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent/50" />
    <div className="w-2 h-2 rotate-45 bg-accent/60" />
    <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent/50" />
  </div>
);

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBackground}
          alt="India's rich cultural heritage - ancient temples and mountains"
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background dark:from-background/90 dark:via-background/70 dark:to-background" />
      </div>
      
      {/* Subtle Pattern Overlay */}
      <DecorativePattern className="inset-0 z-[1]" />
      
      {/* Decorative glowing accents */}
      <motion.div 
        className="absolute top-20 right-[10%] w-64 h-64 rounded-full bg-accent/10 blur-3xl z-[1]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-20 left-[10%] w-80 h-80 rounded-full bg-primary/10 blur-3xl z-[1]"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.2, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Driven Smart Travel Planning
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight"
          >
            Discover{" "}
            <span className="gradient-text">Incredible India</span>
            <br />
            <span className="text-foreground/90">Guided by Intelligence</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed"
          >
            Journey through ancient temples, majestic palaces, and diverse cultures — 
            let our AI craft your perfect adventure across the land of heritage and traditions.
          </motion.p>

          {/* Decorative divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <OrnateDivider className="my-8" />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              asChild 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link to="/plan">
                Plan My Trip
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="px-8 py-6 text-lg rounded-xl border-2 hover:bg-primary/5"
            >
              <Link to="/chatbot">
                <Bot className="mr-2 w-5 h-5" />
                Talk to AI Assistant
              </Link>
            </Button>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {[
              { icon: Compass, value: "28+", label: "States Covered" },
              { icon: Landmark, value: "500+", label: "Heritage Sites" },
              { icon: Route, value: "1000+", label: "Curated Routes" },
              { icon: Bot, value: "AI", label: "Smart Planning" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to Explore India
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform combines cutting-edge technology with deep knowledge of India's
            heritage to make planning your incredible adventure effortless.
          </p>
          <OrnateDivider className="mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full card-elevated group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const steps = [
    { icon: MapPin, title: "Choose Destination", description: "Select from Rajasthan, Kerala, Himalayas, or any Indian state." },
    { icon: Calendar, title: "Set Preferences", description: "Share your travel dates, budget in INR, and interests." },
    { icon: Bot, title: "AI Creates Plan", description: "Get a personalized day-by-day Indian travel experience." },
    { icon: Sparkles, title: "Enjoy Journey", description: "Download, print, or access your itinerary on the go." },
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Plan Your Journey in 4 Simple Steps
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From idea to itinerary in minutes — our intelligent system handles the complexity
          </p>
          <OrnateDivider className="mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/40 to-primary/10" />
              )}
              
              <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 mb-4">
                <step.icon className="w-8 h-8 text-primary" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center shadow-md">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button 
            asChild 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 rounded-xl shadow-lg"
          >
            <Link to="/plan">
              Start Planning Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export function TrustSection() {
  const trustItems = [
    { icon: Shield, title: "Secure & Private", description: "Your data is encrypted and never shared" },
    { icon: Clock, title: "Save Hours", description: "What takes days, done in minutes" },
    { icon: Landmark, title: "28 States & 8 UTs", description: "Complete pan-India coverage" },
  ];

  return (
    <section className="py-16 relative">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
      
      {/* Top border ornament */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0 border border-primary/10">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom border ornament */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
