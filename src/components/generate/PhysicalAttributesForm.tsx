import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface PhysicalAttributesFormProps {
  caseId: string;
}

const PhysicalAttributesForm = ({ caseId }: PhysicalAttributesFormProps) => {
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    gender: "", age: "", ethnicity: "", height_feet: "", body_type: "",
    head_shape: "", chin_shape: "", hair_length: "", hair_texture: "",
    hairline_shape: "", hair_style: "", facial_hair_type: "", beard_color: "",
    eyebrow_type: "", eye_shape: "", eye_size_spacing: "", eyelid_type: "",
    eyelashes: "", eye_color: "", eye_bags_wrinkles: "", nose_shape: "",
    bridge_height: "", nostril_width: "", nose_tip_shape: "", lip_thickness: "",
    mouth_width: "", lip_shape: "", smile_type: "", ear_size: "", ear_lobes: "",
    ear_shape: "", helix_antihelix: "", skin_tone: "", other_skin_features: "",
    accessories: "",
  });

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const attributesData = {
        case_id: caseId,
        gender: formData.gender || null,
        age: formData.age ? parseInt(formData.age) : null,
        ethnicity: formData.ethnicity || null,
        height_feet: formData.height_feet ? parseFloat(formData.height_feet) : null,
        body_type: formData.body_type || null,
        head_shape: formData.head_shape || null,
        chin_shape: formData.chin_shape || null,
        hair_length: formData.hair_length || null,
        hair_texture: formData.hair_texture || null,
        hairline_shape: formData.hairline_shape || null,
        hair_style: formData.hair_style || null,
        facial_hair_type: formData.facial_hair_type || null,
        beard_color: formData.beard_color || null,
        eyebrow_type: formData.eyebrow_type || null,
        eye_shape: formData.eye_shape || null,
        eye_size_spacing: formData.eye_size_spacing || null,
        eyelid_type: formData.eyelid_type || null,
        eyelashes: formData.eyelashes || null,
        eye_color: formData.eye_color || null,
        eye_bags_wrinkles: formData.eye_bags_wrinkles || null,
        nose_shape: formData.nose_shape || null,
        bridge_height: formData.bridge_height || null,
        nostril_width: formData.nostril_width || null,
        nose_tip_shape: formData.nose_tip_shape || null,
        lip_thickness: formData.lip_thickness || null,
        mouth_width: formData.mouth_width || null,
        lip_shape: formData.lip_shape || null,
        smile_type: formData.smile_type || null,
        ear_size: formData.ear_size || null,
        ear_lobes: formData.ear_lobes || null,
        ear_shape: formData.ear_shape || null,
        helix_antihelix: formData.helix_antihelix || null,
        skin_tone: formData.skin_tone || null,
        other_skin_features: formData.other_skin_features || null,
        accessories: formData.accessories || null,
      };

      const { data: attributesRecord, error: attrError } = await supabase
        .from("suspect_physical_attributes")
        .insert(attributesData)
        .select()
        .single();

      if (attrError) throw attrError;

      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-suspect-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ case_id: caseId }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate image");
      }

      const result = await response.json();
      
      if (result.imageData) {
        setGeneratedImage(result.imageData);
        
        await supabase.from("generated_images").insert({
          case_id: caseId,
          attributes_id: attributesRecord.id,
          image_data: result.imageData,
          generation_status: "completed",
          generation_metadata: { model: "gemini-2.5-flash-image-preview" },
        });

        toast.success("Suspect image generated successfully!");
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to generate image");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] pr-4">
        <Card className="neon-border">
          <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Age</Label>
              <Input type="number" placeholder="Age" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="bg-secondary/50" />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Ethnicity</Label>
              <Select value={formData.ethnicity} onValueChange={(v) => setFormData({ ...formData, ethnicity: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select ethnicity" /></SelectTrigger>
                <SelectContent className="max-h-60"><SelectItem value="Indian">Indian</SelectItem><SelectItem value="North Indian">North Indian</SelectItem><SelectItem value="South Indian">South Indian</SelectItem><SelectItem value="East Indian">East Indian</SelectItem><SelectItem value="Nepali">Nepali</SelectItem><SelectItem value="African">African</SelectItem><SelectItem value="Asian">Asian</SelectItem><SelectItem value="European">European</SelectItem><SelectItem value="Latin American">Latin American</SelectItem><SelectItem value="Middle Eastern">Middle Eastern</SelectItem><SelectItem value="Oceanian">Oceanian</SelectItem><SelectItem value="South Asian">South Asian</SelectItem><SelectItem value="Southeast Asian">Southeast Asian</SelectItem><SelectItem value="Central Asian">Central Asian</SelectItem><SelectItem value="Nordic">Nordic</SelectItem><SelectItem value="Mediterranean">Mediterranean</SelectItem><SelectItem value="Afro-Caribbean">Afro-Caribbean</SelectItem><SelectItem value="Afro-Latinx">Afro-Latinx</SelectItem><SelectItem value="Biracial/Multiracial">Biracial/Multiracial</SelectItem><SelectItem value="Afro-Asian">Afro-Asian</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Height (feet)</Label>
              <Input type="number" step="0.1" placeholder="5.8" value={formData.height_feet} onChange={(e) => setFormData({ ...formData, height_feet: e.target.value })} className="bg-secondary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader><CardTitle>Body & Face</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Body Type</Label>
              <Select value={formData.body_type} onValueChange={(v) => setFormData({ ...formData, body_type: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Slim/lean">Slim/lean</SelectItem><SelectItem value="Athletic/medium">Athletic/medium</SelectItem><SelectItem value="Muscular">Muscular</SelectItem><SelectItem value="Stocky">Stocky</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Head Shape</Label>
              <Select value={formData.head_shape} onValueChange={(v) => setFormData({ ...formData, head_shape: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Oval">Oval</SelectItem><SelectItem value="Round">Round</SelectItem><SelectItem value="Square">Square</SelectItem><SelectItem value="Rectangular">Rectangular</SelectItem><SelectItem value="Diamond">Diamond</SelectItem><SelectItem value="Heart">Heart</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Chin Shape</Label>
              <Select value={formData.chin_shape} onValueChange={(v) => setFormData({ ...formData, chin_shape: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select chin" /></SelectTrigger>
                <SelectContent className="max-h-60"><SelectItem value="Cleft chin">Cleft</SelectItem><SelectItem value="Double chin">Double</SelectItem><SelectItem value="Protruding chin">Protruding</SelectItem><SelectItem value="Square chin">Square</SelectItem><SelectItem value="Round chin">Round</SelectItem><SelectItem value="Pointed chin">Pointed</SelectItem></SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader><CardTitle>Hair</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Length</Label>
              <Select value={formData.hair_length} onValueChange={(v) => setFormData({ ...formData, hair_length: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Bald">Bald</SelectItem><SelectItem value="Short">Short</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Long">Long</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Texture</Label>
              <Select value={formData.hair_texture} onValueChange={(v) => setFormData({ ...formData, hair_texture: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Coarse">Coarse</SelectItem><SelectItem value="Wavy">Wavy</SelectItem><SelectItem value="Straight">Straight</SelectItem><SelectItem value="Rough">Rough</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Hairline</Label>
              <Select value={formData.hairline_shape} onValueChange={(v) => setFormData({ ...formData, hairline_shape: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Receding">Receding</SelectItem><SelectItem value="Straight">Straight</SelectItem><SelectItem value="Widow's peak">Widow's peak</SelectItem><SelectItem value="M-shaped">M-shaped</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Style</Label>
              <Input placeholder="Describe" value={formData.hair_style} onChange={(e) => setFormData({ ...formData, hair_style: e.target.value })} className="bg-secondary/50" />
            </div>
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader><CardTitle>Facial Hair</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Type</Label>
              <Select value={formData.facial_hair_type} onValueChange={(v) => setFormData({ ...formData, facial_hair_type: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent className="max-h-60"><SelectItem value="None">None</SelectItem><SelectItem value="Full beard">Full beard</SelectItem><SelectItem value="Goatee">Goatee</SelectItem><SelectItem value="Mustache">Mustache</SelectItem><SelectItem value="Sideburns">Sideburns</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Color</Label>
              <Select value={formData.beard_color} onValueChange={(v) => setFormData({ ...formData, beard_color: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Black">Black</SelectItem><SelectItem value="Dark brown">Dark brown</SelectItem><SelectItem value="Light brown">Light brown</SelectItem><SelectItem value="Gray">Gray</SelectItem><SelectItem value="White">White</SelectItem></SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader><CardTitle>Eyes</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Eyebrow Type</Label>
              <Select value={formData.eyebrow_type} onValueChange={(v) => setFormData({ ...formData, eyebrow_type: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Straight">Straight</SelectItem><SelectItem value="Arched">Arched</SelectItem><SelectItem value="Thick">Thick</SelectItem><SelectItem value="Thin">Thin</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Eye Shape</Label>
              <Select value={formData.eye_shape} onValueChange={(v) => setFormData({ ...formData, eye_shape: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Almond">Almond</SelectItem><SelectItem value="Round">Round</SelectItem><SelectItem value="Hooded">Hooded</SelectItem><SelectItem value="Deep-set">Deep-set</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Eye Color</Label>
              <Select value={formData.eye_color} onValueChange={(v) => setFormData({ ...formData, eye_color: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Brown">Brown</SelectItem><SelectItem value="Blue">Blue</SelectItem><SelectItem value="Green">Green</SelectItem><SelectItem value="Hazel">Hazel</SelectItem><SelectItem value="Gray">Gray</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Eye Size</Label>
              <Select value={formData.eye_size_spacing} onValueChange={(v) => setFormData({ ...formData, eye_size_spacing: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Large">Large</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Small">Small</SelectItem></SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader><CardTitle>Nose & Mouth</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nose Shape</Label>
              <Select value={formData.nose_shape} onValueChange={(v) => setFormData({ ...formData, nose_shape: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Greek">Greek</SelectItem><SelectItem value="Roman">Roman</SelectItem><SelectItem value="Nubian">Nubian</SelectItem><SelectItem value="Hawk">Hawk</SelectItem><SelectItem value="Upturned">Upturned</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bridge</Label>
              <Select value={formData.bridge_height} onValueChange={(v) => setFormData({ ...formData, bridge_height: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lip Thickness</Label>
              <Select value={formData.lip_thickness} onValueChange={(v) => setFormData({ ...formData, lip_thickness: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Thin">Thin</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Full">Full</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Mouth Width</Label>
              <Select value={formData.mouth_width} onValueChange={(v) => setFormData({ ...formData, mouth_width: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Narrow">Narrow</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Wide">Wide</SelectItem></SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader><CardTitle>Skin & Accessories</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label>Skin Tone</Label>
              <Select value={formData.skin_tone} onValueChange={(v) => setFormData({ ...formData, skin_tone: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Fair">Fair</SelectItem><SelectItem value="Light">Light</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Olive">Olive</SelectItem><SelectItem value="Tan">Tan</SelectItem><SelectItem value="Deep">Deep</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Accessories</Label>
              <Input placeholder="Glasses, Hats, etc." value={formData.accessories} onChange={(e) => setFormData({ ...formData, accessories: e.target.value })} className="bg-secondary/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="neon-border sticky top-4">
          <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" />Generated Portrait</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {generatedImage ? (
              <div className="space-y-4">
                <div className="aspect-square bg-secondary/20 rounded-lg overflow-hidden">
                  <img src={generatedImage} alt="Generated portrait" className="w-full h-full object-cover" />
                </div>
                <Button onClick={handleGenerate} disabled={generating} className="w-full" variant="outline">
                  {generating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Regenerating...</>) : (<><Sparkles className="mr-2 h-4 w-4" />Regenerate</>)}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-square bg-secondary/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-center px-4">Fill attributes & click Generate</p>
                </div>
                <Button onClick={handleGenerate} disabled={generating} className="w-full">
                  {generating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</>) : (<><Sparkles className="mr-2 h-4 w-4" />Generate Image</>)}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhysicalAttributesForm;
