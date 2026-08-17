import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, Play, ShieldAlert, Cpu, Sparkles, MapPin, Sliders, Lock, Award, FileText } from "lucide-react";
import { toast } from "sonner";

const About = () => {
  const handleDownloadManual = () => {
    toast.info("Feature manual & attribute dictionary is being generated.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Header Banner */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant="outline" className="px-3 py-1 text-sm border-primary/40 bg-primary/10 text-primary gap-1.5 flex items-center">
                <Award className="h-4 w-4 text-amber-400" />
                3rd Prize Winner • AROHAN 2.0 Project Exhibition
              </Badge>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold neon-text tracking-tight">About SUIGEN</h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-Powered Suspect Image Generator — Transforming witness recall into forensic-grade digital composites.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="https://youtu.be/Uz1TAGH7DaI"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="default" className="bg-red-600 hover:bg-red-700 text-white gap-2">
                  <Play className="h-4 w-4 fill-white" /> Watch YouTube Demo
                </Button>
              </a>
              <a
                href="https://github.com/naveensreekanth/SUIGEN-AI-Powered_Suspect_Image_Generator"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-primary/40 hover:bg-primary/10 gap-2">
                  <ExternalLink className="h-4 w-4" /> GitHub Repository
                </Button>
              </a>
            </div>
          </div>

          {/* Mission Card */}
          <Card className="neon-border bg-card/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <ShieldAlert className="h-6 w-6 text-primary" />
                Project Mission & Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">SUIGEN (Suspect Image Generator)</strong> is an advanced forensic
                technology platform engineered to eliminate critical bottlenecks in criminal investigation workflows.
                Traditional manual composite sketching requires scarce forensic sketch artists, lengthy interviews, and
                often results in witness memory degradation over time.
              </p>
              <p>
                By combining <strong className="text-foreground">generative diffusion models</strong> with granular facial
                parameterization, selective feature-locking, and witness confidence rating scales, SUIGEN allows
                investigators to generate photorealistic and pencil-sketch composites in seconds — drastically accelerating
                suspect identification.
              </p>
            </CardContent>
          </Card>

          {/* Core Highlights Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            <Card className="border-primary/30 bg-card/40 hover:border-primary/60 transition-colors">
              <CardHeader className="pb-2">
                <Sliders className="h-7 w-7 text-primary mb-2" />
                <CardTitle className="text-lg">Confidence Sliders</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Witnesses assign Low, Medium, or High confidence to individual recalled attributes, balancing AI variation against strict adherence.
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-card/40 hover:border-primary/60 transition-colors">
              <CardHeader className="pb-2">
                <Lock className="h-7 w-7 text-primary mb-2" />
                <CardTitle className="text-lg">Trait Locking</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Pin verified facial characteristics (e.g. eye color, jawline) while iterating and refining ambiguous features in subsequent prompts.
              </CardContent>
            </Card>

            <Card className="border-primary/30 bg-card/40 hover:border-primary/60 transition-colors">
              <CardHeader className="pb-2">
                <MapPin className="h-7 w-7 text-primary mb-2" />
                <CardTitle className="text-lg">Geospatial Tagging</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Interactive OpenStreetMap & Leaflet mapping to pinpoint incident coordinates, timestamp, and jurisdiction metadata.
              </CardContent>
            </Card>
          </div>

          {/* Technology & Architecture Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-primary/30 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Key Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Multi-Stage Attribute Wizard:</strong> Structured data collection covering demographics, facial shape, eyes, hair, and scars.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Forensic Police Sketch Style:</strong> Generates standardized law-enforcement composite portraits with Case IDs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Multi-Angle Variations:</strong> Generates multiple alternative perspectives and expressions concurrently.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Dossier PDF Export:</strong> Instant generation of official suspect case sheets for distribution.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-accent/30 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" /> Architecture & Tech Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Frontend:</strong> React 18, TypeScript, TailwindCSS, Vite</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Mapping & GIS:</strong> Leaflet.js, React-Leaflet, OpenStreetMap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Backend & Auth:</strong> Supabase Authentication & PostgreSQL</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Generative AI:</strong> Diffusion Models with Dynamic Prompt Weighting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong>Reporting:</strong> jsPDF for automated forensic case export</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Card */}
          <Card className="neon-border bg-card/60">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Investigative Workflow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 text-muted-foreground">
              <div className="space-y-1.5 border-l-2 border-primary/50 pl-4">
                <h3 className="text-base font-semibold text-foreground">1. Record Incident & Geospatial Context</h3>
                <p className="text-sm">Log incident timestamp, crime category, witness profile, and select the precise scene location on the interactive map.</p>
              </div>
              <div className="space-y-1.5 border-l-2 border-primary/50 pl-4">
                <h3 className="text-base font-semibold text-foreground">2. Configure Anatomical Attributes & Set Confidence</h3>
                <p className="text-sm">Specify ethnicity, age, height, head structure, facial hair, eye color, and set the witness confidence calibration.</p>
              </div>
              <div className="space-y-1.5 border-l-2 border-primary/50 pl-4">
                <h3 className="text-base font-semibold text-foreground">3. Synthesize, Lock Traits & Iterate</h3>
                <p className="text-sm">Generate AI composite portraits, lock accurate facial features, and regenerate until the likeness matches witness memory.</p>
              </div>
              <div className="space-y-1.5 border-l-2 border-primary/50 pl-4">
                <h3 className="text-base font-semibold text-foreground">4. Export Formal Law Enforcement PDF</h3>
                <p className="text-sm">Download the complete suspect sheet formatted with Case ID, timestamp, incident coordinates, and full trait breakdown.</p>
              </div>
            </CardContent>
          </Card>

          {/* Footer CTA */}
          <div className="text-center pt-4 space-y-3">
            <Button
              size="lg"
              onClick={handleDownloadManual}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-medium px-6 py-5"
            >
              <Download className="h-5 w-5" /> Download Attribute & Feature Manual
            </Button>
            <p className="text-xs text-muted-foreground">
              * Note: SUIGEN is an AI-assisted investigative tool engineered for law enforcement support and forensic research.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;