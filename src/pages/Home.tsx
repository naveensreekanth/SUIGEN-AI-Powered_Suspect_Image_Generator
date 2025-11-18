import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
const Home = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({
      data: {
        session
      }
    }) => {
      setIsAuthenticated(!!session);
    });
    const {
      data: {
        subscription
      }
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
  return <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <Navbar />
      
      <div className="relative overflow-hidden pt-24 pb-16">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMEJGRkYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6bS0yNCAwYzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6TTM2IDM4YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6bS0yNCAwYzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
                <span className="neon-text mx-px px-0 text-center">Describe. Generate. Detect      </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto my-[8px] px-0">
                AI-powered Suspect Image Generation for Investigative Intelligence
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button size="lg" onClick={handleGetStarted} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg neon-glow group">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-primary/50 hover:bg-primary/10 px-8 py-6 text-lg">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Feature cards */}
            <div className="grid md:grid-cols-3 gap-6 pt-16">
              <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Precise Details</h3>
                <p className="text-muted-foreground">
                  Capture comprehensive suspect information with detailed attribute tracking
                </p>
              </div>
              
              <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Advanced AI technology generates realistic suspect facial composites
                </p>
              </div>
              
              <div className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-xl font-semibold mb-2">Fast & Secure</h3>
                <p className="text-muted-foreground">
                  Quick generation with secure database storage for all cases
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Home;