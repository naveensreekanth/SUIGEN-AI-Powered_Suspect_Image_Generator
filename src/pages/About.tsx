import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

const About = () => {
  const handleDownloadManual = () => {
    toast.info("Feature manual will be available soon");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold neon-text">About SUIGEN</h1>
            <p className="text-xl text-muted-foreground">
              Suspect Image Generator - Advanced Forensic Intelligence Tool
            </p>
          </div>

          <Card className="neon-border">
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                SUIGEN is a cutting-edge AI-powered platform designed to revolutionize suspect identification
                and forensic investigation processes. Our mission is to provide law enforcement and investigative
                agencies with advanced tools for generating accurate suspect facial composites based on detailed
                witness descriptions and physical attributes.
              </p>
              <p>
                By leveraging state-of-the-art artificial intelligence and machine learning technologies,
                SUIGEN bridges the gap between witness testimony and visual representation, enabling faster
                and more accurate suspect identification.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-primary/30">
              <CardHeader>
                <CardTitle>🎯 Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Comprehensive suspect detail collection</li>
                  <li>• Detailed physical attribute mapping</li>
                  <li>• AI-powered facial composite generation</li>
                  <li>• Secure case record management</li>
                  <li>• Location tracking integration</li>
                  <li>• Multi-user collaboration support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-accent/30">
              <CardHeader>
                <CardTitle>⚙️ Technology Stack</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• React & TypeScript</li>
                  <li>• TailwindCSS for styling</li>
                  <li>• Supabase backend</li>
                  <li>• AI image generation models</li>
                  <li>• Secure authentication</li>
                  <li>• Real-time data sync</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="neon-border">
            <CardHeader>
              <CardTitle className="text-2xl">How It Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">1. Create Case Record</h3>
                <p>Enter comprehensive suspect details including crime information, location, and witness details.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">2. Define Physical Attributes</h3>
                <p>Specify detailed physical characteristics including facial features, body type, and distinctive marks.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">3. Generate & Review</h3>
                <p>AI generates realistic suspect facial composite based on provided attributes for investigative use.</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              size="lg"
              onClick={handleDownloadManual}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Download className="mr-2 h-5 w-5" />
              Download Feature Manual
            </Button>
            <p className="text-sm text-muted-foreground mt-2">PDF documentation coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;