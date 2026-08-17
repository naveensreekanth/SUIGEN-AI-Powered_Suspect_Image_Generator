import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Award, Shield, Sliders, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

const Home = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/generate");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <Navbar />

      <div className="relative overflow-hidden pt-24 pb-16">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMEJGRkYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6bS0yNCAwYzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6TTM2IDM4YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6bS0yNCAwYzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            
            {/* Award Badge */}
            <div className="flex justify-center">
              <Badge variant="outline" className="px-3.5 py-1 text-xs sm:text-sm border-primary/40 bg-primary/10 text-primary gap-1.5 flex items-center">
                <Award className="h-4 w-4 text-amber-400" />
                3rd Prize Winner • AROHAN 2.0 Student Project Exhibition
              </Badge>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
                <span className="neon-text">Describe. Generate. Detect.</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                AI-powered Suspect Image Generation & Forensic Composite Intelligence for Law Enforcement
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg neon-glow group"
              >
                Launch Generator
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <a
                href="https://youtu.be/Uz1TAGH7DaI"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary/50 hover:bg-primary/10 px-6 py-6 text-lg gap-2"
                >
                  <Play className="h-4 w-4 text-red-500 fill-red-500" />
                  Watch Video Demo
                </Button>
              </a>

              <Link to="/about">
                <Button
                  size="lg"
                  variant="ghost"
                  className="hover:bg-primary/10 px-6 py-6 text-lg"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Feature cards */}
            <div className="grid md:grid-cols-3 gap-6 pt-12">
              <div className="p-6 rounded-2xl bg-card/60 backdrop-blur border border-border/50 hover:border-primary/50 transition-all text-left">
                <div className="p-3 bg-primary/10 w-fit rounded-lg mb-3">
                  <Sliders className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Granular Attribute Tuning</h3>
                <p className="text-sm text-muted-foreground">
                  Eyewitness confidence scoring, trait locking, and fine-grained facial adjustments.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card/60 backdrop-blur border border-border/50 hover:border-primary/50 transition-all text-left">
                <div className="p-3 bg-primary/10 w-fit rounded-lg mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Forensic Police Sketches</h3>
                <p className="text-sm text-muted-foreground">
                  AI diffusion models tuned specifically for law-enforcement composite sketch standards.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-card/60 backdrop-blur border border-border/50 hover:border-primary/50 transition-all text-left">
                <div className="p-3 bg-primary/10 w-fit rounded-lg mb-3">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Geotagging & PDF Export</h3>
                <p className="text-sm text-muted-foreground">
                  Map incident coordinates and export stamped case dossiers in 1-click.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;