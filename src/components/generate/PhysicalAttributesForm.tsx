import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Download, AlertCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import FeatureControl from "./FeatureControl";

interface PhysicalAttributesFormProps {
  caseId: string;
}

// Facial feature keys that should have lock & confidence controls
const FACIAL_FEATURE_KEYS = [
  "head_shape", "chin_shape", "hair_length", "hair_texture", "hairline_shape", "hair_style",
  "facial_hair_type", "beard_color", "eyebrow_type", "eye_shape", "eye_size_spacing",
  "eyelid_type", "eyelashes", "eye_color", "eye_bags_wrinkles", "nose_shape", "bridge_height",
  "nostril_width", "nose_tip_shape", "lip_thickness", "mouth_width", "lip_shape", "smile_type",
  "ear_size", "ear_lobes", "ear_shape", "helix_antihelix", "skin_tone", "other_skin_features"
];

const ETHICAL_DISCLAIMER = "This generated face is an AI-generated image and an approximation based on user-provided descriptions and does not represent a real individual.";

const PhysicalAttributesForm = ({ caseId }: PhysicalAttributesFormProps) => {
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Feature locks state - locked features can't vary
  const [lockedFeatures, setLockedFeatures] = useState<Record<string, boolean>>({});
  // Confidence levels state - 1=Low, 2=Medium, 3=High
  const [confidenceLevels, setConfidenceLevels] = useState<Record<string, number>>({});
  
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

  const handleLockToggle = (key: string) => {
    setLockedFeatures(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfidenceChange = (key: string, value: number) => {
    setConfidenceLevels(prev => ({ ...prev, [key]: value }));
  };

  const getConfidence = (key: string) => confidenceLevels[key] || 2; // Default to Medium
  const isLocked = (key: string) => lockedFeatures[key] || false;

  const handleDownloadPDF = async () => {
    try {
      const { data: caseData, error: caseError } = await supabase
        .from("suspect_case_records")
        .select("*")
        .eq("id", caseId)
        .single();

      if (caseError) throw caseError;

      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;

      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("SUSPECT REPORT", pageWidth / 2, yPosition, { align: "center" });
      yPosition += 15;

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Case Details", 15, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const caseDetails = [
        `Incident Time: ${caseData.incident_timestamp ? new Date(caseData.incident_timestamp).toLocaleString() : "N/A"}`,
        `Location: ${caseData.incident_location_address || "N/A"}`,
        `Crime: ${caseData.crime_committed || "N/A"}`,
        `Arms: ${caseData.arms_involved || "N/A"}`,
        `Vehicles: ${caseData.vehicles_involved || "N/A"}`,
        `Suspect Name: ${caseData.suspect_name || "N/A"}`,
        `Suspect Address: ${caseData.suspect_address || "N/A"}`,
        `Contact: ${caseData.contact_number || "N/A"}`,
        `Reported By: ${caseData.reported_by || "N/A"}`,
      ];

      caseDetails.forEach((detail) => {
        pdf.text(detail, 15, yPosition);
        yPosition += 7;
      });

      yPosition += 5;

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Physical Attributes", 15, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      const attributes = [
        `Gender: ${formData.gender || "N/A"}`,
        `Age: ${formData.age || "N/A"}`,
        `Ethnicity: ${formData.ethnicity || "N/A"}`,
        `Height: ${formData.height_feet || "N/A"} ft`,
        `Body Type: ${formData.body_type || "N/A"}`,
        `Head Shape: ${formData.head_shape || "N/A"}`,
        `Chin Shape: ${formData.chin_shape || "N/A"}`,
        `Hair Length: ${formData.hair_length || "N/A"}`,
        `Hair Texture: ${formData.hair_texture || "N/A"}`,
        `Hairline: ${formData.hairline_shape || "N/A"}`,
        `Hair Style: ${formData.hair_style || "N/A"}`,
        `Facial Hair: ${formData.facial_hair_type || "N/A"}`,
        `Beard Color: ${formData.beard_color || "N/A"}`,
        `Eyebrow Type: ${formData.eyebrow_type || "N/A"}`,
        `Eye Shape: ${formData.eye_shape || "N/A"}`,
        `Eye Size: ${formData.eye_size_spacing || "N/A"}`,
        `Eyelid Type: ${formData.eyelid_type || "N/A"}`,
        `Eyelashes: ${formData.eyelashes || "N/A"}`,
        `Eye Color: ${formData.eye_color || "N/A"}`,
        `Eye Bags/Wrinkles: ${formData.eye_bags_wrinkles || "N/A"}`,
        `Nose Shape: ${formData.nose_shape || "N/A"}`,
        `Bridge Height: ${formData.bridge_height || "N/A"}`,
        `Nostril Width: ${formData.nostril_width || "N/A"}`,
        `Nose Tip: ${formData.nose_tip_shape || "N/A"}`,
        `Lip Thickness: ${formData.lip_thickness || "N/A"}`,
        `Mouth Width: ${formData.mouth_width || "N/A"}`,
        `Lip Shape: ${formData.lip_shape || "N/A"}`,
        `Smile Type: ${formData.smile_type || "N/A"}`,
        `Ear Size: ${formData.ear_size || "N/A"}`,
        `Ear Lobes: ${formData.ear_lobes || "N/A"}`,
        `Ear Shape: ${formData.ear_shape || "N/A"}`,
        `Helix/Antihelix: ${formData.helix_antihelix || "N/A"}`,
        `Skin Tone: ${formData.skin_tone || "N/A"}`,
        `Other Skin Features: ${formData.other_skin_features || "N/A"}`,
        `Accessories: ${formData.accessories || "N/A"}`,
      ];

      attributes.forEach((attr) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(attr, 15, yPosition);
        yPosition += 6;
      });

      // Add Generated Image
      if (generatedImages.length > 0) {
        pdf.addPage();
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text("Generated Suspect Portrait", pageWidth / 2, 20, { align: "center" });
        
        const imgWidth = 150;
        const imgHeight = 150;
        pdf.addImage(generatedImages[selectedImageIndex], "PNG", (pageWidth - imgWidth) / 2, 35, imgWidth, imgHeight);
        
        // Add ethical disclaimer at the bottom of the image page
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "italic");
        const disclaimerLines = pdf.splitTextToSize(ETHICAL_DISCLAIMER, pageWidth - 30);
        pdf.text(disclaimerLines, pageWidth / 2, 195, { align: "center" });
      }

      pdf.save(`Suspect_Report_${caseId}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error: any) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setErrorMessage(null);
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

      // Build feature constraints for the edge function
      const featureConstraints: Record<string, { locked: boolean; confidence: number }> = {};
      FACIAL_FEATURE_KEYS.forEach(key => {
        const locked = isLocked(key);
        featureConstraints[key] = {
          locked,
          confidence: locked ? 3 : getConfidence(key) // Locked = always high confidence
        };
      });

      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-suspect-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ 
            case_id: caseId,
            feature_constraints: featureConstraints
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.error("Image generation error:", error);
        const errorMsg = error.error || "Failed to generate image";
        setErrorMessage(errorMsg);
        
        if (response.status === 429 && error.retryAfter) {
          throw new Error(`${errorMsg} (wait ${error.retryAfter}s)`);
        }
        
        throw new Error(errorMsg);
      }

      const result = await response.json();
      
      if (result.images && result.images.length > 0) {
        setGeneratedImages(result.images);
        setSelectedImageIndex(0);
        
        await supabase.from("generated_images").insert({
          case_id: caseId,
          attributes_id: attributesRecord.id,
          image_data: result.images[0],
          generation_status: "completed",
          generation_metadata: { model: "gemini-2.5-flash-image-preview", totalImages: result.images.length },
        });

        toast.success(`${result.images.length} suspect images generated successfully!`);
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      const errorMsg = error.message || "Failed to generate image";
      setErrorMessage(errorMsg);
      
      if (errorMsg.includes("wait")) {
        toast.error(errorMsg, { duration: 5000 });
      } else if (errorMsg.includes("Rate limit") || errorMsg.includes("already in progress")) {
        toast.error(errorMsg, { duration: 5000 });
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setGenerating(false);
    }
  };

  // Helper to render a feature field with optional lock/confidence controls
  const renderFeatureField = (
    key: keyof typeof formData,
    label: string,
    children: React.ReactNode,
    colSpan: boolean = false
  ) => {
    const isFacialFeature = FACIAL_FEATURE_KEYS.includes(key);
    
    return (
      <div className={`space-y-2 ${colSpan ? 'col-span-2' : ''}`}>
        <Label>{label}</Label>
        {children}
        {isFacialFeature && (
          <FeatureControl
            featureKey={key}
            isLocked={isLocked(key)}
            confidence={getConfidence(key)}
            onLockToggle={handleLockToggle}
            onConfidenceChange={handleConfidenceChange}
          />
        )}
      </div>
    );
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
                <SelectContent className="max-h-60"><SelectItem value="Slim/lean">Slim/lean</SelectItem><SelectItem value="Athletic/medium">Athletic/medium</SelectItem><SelectItem value="Muscular">Muscular</SelectItem><SelectItem value="Stocky">Stocky</SelectItem><SelectItem value="Pear/Triangle">Pear/Triangle</SelectItem><SelectItem value="Inverted Triangle">Inverted Triangle</SelectItem><SelectItem value="Rectangle/Straight">Rectangle/Straight</SelectItem><SelectItem value="Hourglass">Hourglass</SelectItem><SelectItem value="Apple/Round">Apple/Round</SelectItem></SelectContent>
              </Select>
            </div>
            {renderFeatureField("head_shape", "Head Shape",
              <Select value={formData.head_shape} onValueChange={(v) => setFormData({ ...formData, head_shape: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Oval">Oval</SelectItem><SelectItem value="Round">Round</SelectItem><SelectItem value="Square">Square</SelectItem><SelectItem value="Rectangular">Rectangular</SelectItem><SelectItem value="Diamond">Diamond</SelectItem><SelectItem value="Heart">Heart</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("chin_shape", "Chin Shape",
              <Select value={formData.chin_shape} onValueChange={(v) => setFormData({ ...formData, chin_shape: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select chin" /></SelectTrigger>
                <SelectContent className="max-h-60"><SelectItem value="Cleft chin">Cleft</SelectItem><SelectItem value="Double chin">Double</SelectItem><SelectItem value="Protruding chin">Protruding</SelectItem><SelectItem value="Square chin">Square</SelectItem><SelectItem value="Round chin">Round</SelectItem><SelectItem value="Pointed chin">Pointed</SelectItem></SelectContent>
              </Select>
            , true)}
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader><CardTitle>Hair</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {renderFeatureField("hair_length", "Length",
              <Select value={formData.hair_length} onValueChange={(v) => setFormData({ ...formData, hair_length: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Bald">Bald</SelectItem><SelectItem value="Short">Short</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Long">Long</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("hair_texture", "Texture",
              <Select value={formData.hair_texture} onValueChange={(v) => setFormData({ ...formData, hair_texture: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Coarse">Coarse</SelectItem><SelectItem value="Wavy">Wavy</SelectItem><SelectItem value="Straight">Straight</SelectItem><SelectItem value="Rough">Rough</SelectItem><SelectItem value="Curly">Curly</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("hairline_shape", "Hairline",
              <Select value={formData.hairline_shape} onValueChange={(v) => setFormData({ ...formData, hairline_shape: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Receding">Receding</SelectItem><SelectItem value="Straight">Straight</SelectItem><SelectItem value="Widow's peak">Widow's peak</SelectItem><SelectItem value="M-shaped">M-shaped</SelectItem></SelectContent>
              </Select>
            , true)}
            {renderFeatureField("hair_style", "Style",
              <Input placeholder="Describe" value={formData.hair_style} onChange={(e) => setFormData({ ...formData, hair_style: e.target.value })} className="bg-secondary/50" />
            , true)}
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader><CardTitle>Facial Hair</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {renderFeatureField("facial_hair_type", "Type",
              <Select value={formData.facial_hair_type} onValueChange={(v) => setFormData({ ...formData, facial_hair_type: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent className="max-h-60"><SelectItem value="None">None</SelectItem><SelectItem value="Full beard">Full beard</SelectItem><SelectItem value="Goatee">Goatee</SelectItem><SelectItem value="Mustache">Mustache</SelectItem><SelectItem value="Sideburns">Sideburns</SelectItem></SelectContent>
              </Select>
            , true)}
            {renderFeatureField("beard_color", "Color",
              <Select value={formData.beard_color} onValueChange={(v) => setFormData({ ...formData, beard_color: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Black">Black</SelectItem><SelectItem value="Dark brown">Dark brown</SelectItem><SelectItem value="Light brown">Light brown</SelectItem><SelectItem value="Gray">Gray</SelectItem><SelectItem value="White">White</SelectItem></SelectContent>
              </Select>
            , true)}
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader><CardTitle>Eyes</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {renderFeatureField("eyebrow_type", "Eyebrow Type",
              <Select value={formData.eyebrow_type} onValueChange={(v) => setFormData({ ...formData, eyebrow_type: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Straight">Straight</SelectItem><SelectItem value="Arched">Arched</SelectItem><SelectItem value="Thick">Thick</SelectItem><SelectItem value="Thin">Thin</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("eye_shape", "Eye Shape",
              <Select value={formData.eye_shape} onValueChange={(v) => setFormData({ ...formData, eye_shape: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Almond">Almond</SelectItem><SelectItem value="Round">Round</SelectItem><SelectItem value="Hooded">Hooded</SelectItem><SelectItem value="Deep-set">Deep-set</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("eye_color", "Eye Color",
              <Select value={formData.eye_color} onValueChange={(v) => setFormData({ ...formData, eye_color: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Brown">Brown</SelectItem><SelectItem value="Blue">Blue</SelectItem><SelectItem value="Green">Green</SelectItem><SelectItem value="Hazel">Hazel</SelectItem><SelectItem value="Gray">Gray</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("eye_size_spacing", "Eye Size & Spacing",
              <Select value={formData.eye_size_spacing} onValueChange={(v) => setFormData({ ...formData, eye_size_spacing: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Large">Large</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Small">Small</SelectItem><SelectItem value="Wide-set">Wide-set</SelectItem><SelectItem value="Close-set">Close-set</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("eyelid_type", "Eyelid Type",
              <Select value={formData.eyelid_type} onValueChange={(v) => setFormData({ ...formData, eyelid_type: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Double eyelid">Double eyelid</SelectItem><SelectItem value="Single/monolid">Single/monolid</SelectItem><SelectItem value="Hooded">Hooded</SelectItem><SelectItem value="Crinkled crease">Crinkled crease</SelectItem><SelectItem value="Deep-set crease">Deep-set crease</SelectItem><SelectItem value="Visible crease">Visible crease</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("eyelashes", "Eyelashes",
              <Select value={formData.eyelashes} onValueChange={(v) => setFormData({ ...formData, eyelashes: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Short">Short</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Long">Long</SelectItem><SelectItem value="Sparse">Sparse</SelectItem><SelectItem value="Dense">Dense</SelectItem><SelectItem value="Straight">Straight</SelectItem><SelectItem value="Curled">Curled</SelectItem><SelectItem value="Full line">Full line</SelectItem><SelectItem value="Lower prominent">Lower prominent</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("eye_bags_wrinkles", "Eye Bags & Wrinkles",
              <Select value={formData.eye_bags_wrinkles} onValueChange={(v) => setFormData({ ...formData, eye_bags_wrinkles: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="None">None</SelectItem><SelectItem value="Slightly puffy">Slightly puffy</SelectItem><SelectItem value="Heavy wrinkles">Heavy wrinkles</SelectItem></SelectContent>
              </Select>
            , true)}
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader><CardTitle>Nose</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {renderFeatureField("nose_shape", "Nose Shape",
              <Select value={formData.nose_shape} onValueChange={(v) => setFormData({ ...formData, nose_shape: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Greek">Greek</SelectItem><SelectItem value="Roman">Roman</SelectItem><SelectItem value="Nubian">Nubian</SelectItem><SelectItem value="Hawk">Hawk</SelectItem><SelectItem value="Upturned">Upturned</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("bridge_height", "Bridge Height",
              <Select value={formData.bridge_height} onValueChange={(v) => setFormData({ ...formData, bridge_height: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("nostril_width", "Nostril Width",
              <Select value={formData.nostril_width} onValueChange={(v) => setFormData({ ...formData, nostril_width: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Narrow">Narrow</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Wide">Wide</SelectItem><SelectItem value="Flared">Flared</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("nose_tip_shape", "Nose Tip Shape",
              <Select value={formData.nose_tip_shape} onValueChange={(v) => setFormData({ ...formData, nose_tip_shape: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Rounded">Rounded</SelectItem><SelectItem value="Aquiline">Aquiline</SelectItem><SelectItem value="Pointed">Pointed</SelectItem><SelectItem value="Bulbous">Bulbous</SelectItem><SelectItem value="Drooping">Drooping</SelectItem><SelectItem value="Upturned">Upturned</SelectItem><SelectItem value="Wide">Wide</SelectItem><SelectItem value="Narrow">Narrow</SelectItem></SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader><CardTitle>Mouth</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {renderFeatureField("lip_thickness", "Lip Thickness",
              <Select value={formData.lip_thickness} onValueChange={(v) => setFormData({ ...formData, lip_thickness: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Thin">Thin</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Full">Full</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("mouth_width", "Mouth Width",
              <Select value={formData.mouth_width} onValueChange={(v) => setFormData({ ...formData, mouth_width: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Narrow">Narrow</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Wide">Wide</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("lip_shape", "Lip Shape",
              <Select value={formData.lip_shape} onValueChange={(v) => setFormData({ ...formData, lip_shape: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent className="max-h-60"><SelectItem value="Straight">Straight</SelectItem><SelectItem value="Curved">Curved</SelectItem><SelectItem value="High Cupid's bow">High Cupid's bow</SelectItem><SelectItem value="Low Cupid's bow">Low Cupid's bow</SelectItem><SelectItem value="Angular corners">Angular corners</SelectItem><SelectItem value="Rounded corners">Rounded corners</SelectItem><SelectItem value="Chiseled">Chiseled</SelectItem><SelectItem value="Bowless">Bowless</SelectItem><SelectItem value="Even thickness">Even thickness</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("smile_type", "Smile Type",
              <Select value={formData.smile_type} onValueChange={(v) => setFormData({ ...formData, smile_type: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Neutral">Neutral</SelectItem><SelectItem value="Frown">Frown</SelectItem><SelectItem value="Upward curve">Upward curve</SelectItem></SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader><CardTitle>Ears</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {renderFeatureField("ear_size", "Ear Size",
              <Select value={formData.ear_size} onValueChange={(v) => setFormData({ ...formData, ear_size: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Small">Small</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Large">Large</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("ear_lobes", "Ear Lobes",
              <Select value={formData.ear_lobes} onValueChange={(v) => setFormData({ ...formData, ear_lobes: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Attached">Attached</SelectItem><SelectItem value="Free">Free</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("ear_shape", "Ear Shape",
              <Select value={formData.ear_shape} onValueChange={(v) => setFormData({ ...formData, ear_shape: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Round">Round</SelectItem><SelectItem value="Oval">Oval</SelectItem><SelectItem value="Heart-shaped">Heart-shaped</SelectItem><SelectItem value="Pointed">Pointed</SelectItem><SelectItem value="Flared">Flared</SelectItem><SelectItem value="Regular">Regular</SelectItem></SelectContent>
              </Select>
            )}
            {renderFeatureField("helix_antihelix", "Helix/Antihelix Features",
              <Select value={formData.helix_antihelix} onValueChange={(v) => setFormData({ ...formData, helix_antihelix: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Defined helix">Defined helix</SelectItem><SelectItem value="Soft helix">Soft helix</SelectItem><SelectItem value="Prominent antihelix">Prominent antihelix</SelectItem><SelectItem value="Flat concha">Flat concha</SelectItem></SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        <Card className="neon-border">
          <CardHeader><CardTitle>Skin & Accessories</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            {renderFeatureField("skin_tone", "Skin Tone",
              <Select value={formData.skin_tone} onValueChange={(v) => setFormData({ ...formData, skin_tone: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Fair">Fair</SelectItem><SelectItem value="Light">Light</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Olive">Olive</SelectItem><SelectItem value="Tan">Tan</SelectItem><SelectItem value="Deep">Deep</SelectItem></SelectContent>
              </Select>
            , true)}
            {renderFeatureField("other_skin_features", "Other Skin Features",
              <Select value={formData.other_skin_features} onValueChange={(v) => setFormData({ ...formData, other_skin_features: v })}>
                <SelectTrigger className="bg-secondary/50"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent><SelectItem value="Scars">Scars</SelectItem><SelectItem value="Blemishes">Blemishes</SelectItem><SelectItem value="Wrinkles">Wrinkles</SelectItem><SelectItem value="Freckles">Freckles</SelectItem><SelectItem value="Birthmarks">Birthmarks</SelectItem><SelectItem value="Moles">Moles</SelectItem></SelectContent>
              </Select>
            , true)}
            <div className="col-span-2 space-y-2">
              <Label>Accessories</Label>
              <Input placeholder="Glasses, Hats, etc." value={formData.accessories} onChange={(e) => setFormData({ ...formData, accessories: e.target.value })} className="bg-secondary/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Generation Failed</AlertTitle>
            <AlertDescription className="text-sm">
              {errorMessage}
              {errorMessage.includes("credits") && (
                <div className="mt-2 text-xs">
                  Go to <strong>Settings → Workspace → Usage</strong> to add more credits.
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="neon-border sticky top-4">
          <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" />Generated Portrait</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {generatedImages.length > 0 ? (
              <div className="space-y-4">
                {/* Main selected image */}
                <div className="aspect-square bg-secondary/20 rounded-lg overflow-hidden">
                  <img src={generatedImages[selectedImageIndex]} alt={`Generated portrait ${selectedImageIndex + 1}`} className="w-full h-full object-cover" />
                </div>
                
                {/* Thumbnail grid for 4 images */}
                <div className="grid grid-cols-4 gap-2">
                  {generatedImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index 
                          ? 'border-primary ring-2 ring-primary/50' 
                          : 'border-transparent hover:border-primary/50'
                      }`}
                    >
                      <img src={img} alt={`Variation ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Ethical Disclaimer */}
                <Alert className="bg-amber-500/10 border-amber-500/30">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-xs text-muted-foreground">
                    {ETHICAL_DISCLAIMER}
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button onClick={handleGenerate} disabled={generating} variant="outline" className="w-full">
                    {generating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Regenerating...</>) : (<><Sparkles className="mr-2 h-4 w-4" />Regenerate</>)}
                  </Button>
                  <Button onClick={handleDownloadPDF} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="aspect-square bg-secondary/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-center px-4">Fill attributes & click Generate</p>
                </div>
                <Button onClick={handleGenerate} disabled={generating} className="w-full">
                  {generating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating 4 images...</>) : (<><Sparkles className="mr-2 h-4 w-4" />Generate Images</>)}
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
