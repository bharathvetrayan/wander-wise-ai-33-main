import { Link } from "react-router-dom";
import { MapPin, Github, Twitter, Linkedin } from "lucide-react";
export function Footer() {
  return <footer className="border-t border-border bg-card w-full">
      <div className="w-full px-6 md:px-12 lg:px-16 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">Explore India</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered smart travel planning to explore India's incredible heritage, temples, and diverse cultural experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/plan" className="hover:text-primary transition-colors">Plan Trip</Link></li>
              <li><Link to="/chatbot" className="hover:text-primary transition-colors">AI Assistant</Link></li>
              <li><Link to="/currency" className="hover:text-primary transition-colors">Currency Converter</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Golden Triangle Circuit</li>
              <li>South India Temple </li>
              <li>Himalayan Adventures</li>
              <li>Tamil Nadu Heritage</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Explore India. AI-Driven Smart Travel Planning Platform for Incredible India.</p>
        </div>
      </div>
    </footer>;
}