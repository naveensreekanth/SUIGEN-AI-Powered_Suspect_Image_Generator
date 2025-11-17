import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface PhysicalAttributesFormProps {
  caseId: string;
}

const PhysicalAttributesForm = ({ caseId }: PhysicalAttributesFormProps) => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    ethnicity: "",
    height_feet: "",
    body_type: "",
    head_shape: "",
    chin_shape: "",
    hair_length: "",
    hair_texture: "",
    hairline_shape: "",
    hair_style: "",
    facial_hair_type: "",
    beard_color: "",
    eyebrow_type: "",
    eye_shape: "",
    eye_size_spacing: "",
    eyelid_type: "",
    eyelashes: "",
    eye_color: "",
    eye_bags_wrinkles: "",
    nose_shape: "",
    bridge_height: "",
    nostril_width: "",
    nose_tip_shape: "",
    lip_thickness: "",
    mouth_width: "",
    lip_shape: "",
    smile_type: "",
    ear_size: "",
    ear_lobes: "",
    ear_shape: "",
    helix_antihelix: "",
    skin_tone: "",
    other_skin_features: "",
    accessories: "",
  });

  const handleGenerate = async () => {
    setGenerating(true);
    
    try {
      // First, save the attributes
      const { error: attrError } = await supabase
        .from("suspect_physical_attributes")
        .insert({
          case_id: caseId,
          ...formData,
          age: formData.age ? parseInt(formData.age) : null,
          height_feet: formData.height_feet ? parseFloat(formData.height_feet) : null,
        });

      if (attrError) throw attrError;

      // Placeholder for AI image generation
      // In production, this would call your AI backend service
      toast.info("AI image generation service is ready to be integrated");
      
      // Simulated generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock generated image URL
      const mockImageUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop";
      setGeneratedImage(mockImageUrl);
      
      // Save image record
      await supabase
        .from("generated_images")
        .insert({
          case_id: caseId,
          image_url: mockImageUrl,
          generation_status: "completed",
        });

      toast.success("Suspect image generated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate image");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      toast.success("Image download would start here");
      // In production: create download link
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left Panel - Attributes Form */}
      <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-4">
        <Card className="neon-border">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Age</Label>
              <Input type="number" placeholder="Enter age" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="bg-secondary/50" />
            </div>
            
            <div className="space-y-2">
              <Label>Ethnicity</Label>
              <Select value={formData.ethnicity} onValueChange={(v) => setFormData({...formData, ethnicity: v})}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select ethnicity" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asian">Asian</SelectItem>
                  <SelectItem value="Black">Black</SelectItem>
                  <SelectItem value="Caucasian">Caucasian</SelectItem>
                  <SelectItem value="Hispanic">Hispanic</SelectItem>
                  <SelectItem value="Middle Eastern">Middle Eastern</SelectItem>
                  <SelectItem value="Mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Height (feet)</Label>
              <Input type="number" step="0.1" placeholder="e.g., 5.8" value={formData.height_feet} onChange={(e) => setFormData({...formData, height_feet: e.target.value})} className="bg-secondary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader>
            <CardTitle>Body & Face</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Body Type</Label>
              <Select value={formData.body_type} onValueChange={(v) => setFormData({...formData, body_type: v})}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select body type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Slim">Slim</SelectItem>
                  <SelectItem value="Athletic">Athletic</SelectItem>
                  <SelectItem value="Average">Average</SelectItem>
                  <SelectItem value="Muscular">Muscular</SelectItem>
                  <SelectItem value="Heavy">Heavy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Head Shape</Label>
              <Select value={formData.head_shape} onValueChange={(v) => setFormData({...formData, head_shape: v})}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select head shape" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Round">Round</SelectItem>
                  <SelectItem value="Oval">Oval</SelectItem>
                  <SelectItem value="Square">Square</SelectItem>
                  <SelectItem value="Rectangle">Rectangle</SelectItem>
                  <SelectItem value="Heart">Heart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Chin Shape</Label>
              <Select value={formData.chin_shape} onValueChange={(v) => setFormData({...formData, chin_shape: v})}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select chin shape" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pointed">Pointed</SelectItem>
                  <SelectItem value="Round">Round</SelectItem>
                  <SelectItem value="Square">Square</SelectItem>
                  <SelectItem value="Cleft">Cleft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader>
            <CardTitle>Hair</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Hair Length</Label>
              <Select value={formData.hair_length} onValueChange={(v) => setFormData({...formData, hair_length: v})}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select hair length" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bald">Bald</SelectItem>
                  <SelectItem value="Short">Short</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Hair Texture</Label>
              <Select value={formData.hair_texture} onValueChange={(v) => setFormData({...formData, hair_texture: v})}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select texture" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Straight">Straight</SelectItem>
                  <SelectItem value="Wavy">Wavy</SelectItem>
                  <SelectItem value="Curly">Curly</SelectItem>
                  <SelectItem value="Coily">Coily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Hair Style</Label>
              <Input placeholder="Describe hair style" value={formData.hair_style} onChange={(e) => setFormData({...formData, hair_style: e.target.value})} className="bg-secondary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader>
            <CardTitle>Eyes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Eye Shape</Label>
              <Select value={formData.eye_shape} onValueChange={(v) => setFormData({...formData, eye_shape: v})}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select eye shape" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Almond">Almond</SelectItem>
                  <SelectItem value="Round">Round</SelectItem>
                  <SelectItem value="Hooded">Hooded</SelectItem>
                  <SelectItem value="Monolid">Monolid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Eye Color</Label>
              <Select value={formData.eye_color} onValueChange={(v) => setFormData({...formData, eye_color: v})}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select eye color" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Brown">Brown</SelectItem>
                  <SelectItem value="Blue">Blue</SelectItem>
                  <SelectItem value="Green">Green</SelectItem>
                  <SelectItem value="Hazel">Hazel</SelectItem>
                  <SelectItem value="Gray">Gray</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader>
            <CardTitle>Nose & Mouth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nose Shape</Label>
              <Select value={formData.nose_shape} onValueChange={(v) => setFormData({...formData, nose_shape: v})}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select nose shape" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Straight">Straight</SelectItem>
                  <SelectItem value="Roman">Roman</SelectItem>
                  <SelectItem value="Button">Button</SelectItem>
                  <SelectItem value="Hawk">Hawk</SelectItem>
                  <SelectItem value="Snub">Snub</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Lip Thickness</Label>
              <Select value={formData.lip_thickness} onValueChange={(v) => setFormData({...formData, lip_thickness: v})}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select lip thickness" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Thin">Thin</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Full">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader>
            <CardTitle>Skin & Accessories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Skin Tone</Label>
              <Select value={formData.skin_tone} onValueChange={(v) => setFormData({...formData, skin_tone: v})}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select skin tone" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Very Fair">Very Fair</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Olive">Olive</SelectItem>
                  <SelectItem value="Brown">Brown</SelectItem>
                  <SelectItem value="Dark Brown">Dark Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Other Skin Features</Label>
              <Textarea placeholder="Scars, marks, tattoos, etc." value={formData.other_skin_features} onChange={(e) => setFormData({...formData, other_skin_features: e.target.value})} className="bg-secondary/50" rows={2} />
            </div>
            
            <div className="space-y-2">
              <Label>Accessories</Label>
              <Input placeholder="Glasses, jewelry, etc." value={formData.accessories} onChange={(e) => setFormData({...formData, accessories: e.target.value})} className="bg-secondary/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel - Image Generation */}
      <div className="space-y-6 sticky top-24 self-start">
        <Card className="neon-border">
          <CardHeader>
            <CardTitle className="text-2xl">Generated Suspect Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square bg-secondary/30 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
              {generatedImage ? (
                <img src={generatedImage} alt="Generated suspect" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-8">
                  <div className="text-6xl mb-4 opacity-20">👤</div>
                  <p className="text-muted-foreground">No image generated yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Fill in attributes and click Generate</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground neon-glow"
                size="lg"
              >
                {generating ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Image
                  </>
                )}
              </Button>

              {generatedImage && (
                <>
                  <Button
                    onClick={handleGenerate}
                    variant="outline"
                    className="w-full border-accent/50 hover:bg-accent/10"
                    size="lg"
                  >
                    <RefreshCw className="mr-2 h-5 w-5" />
                    Regenerate
                  </Button>
                  
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="w-full border-primary/50 hover:bg-primary/10"
                    size="lg"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Image
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhysicalAttributesForm;