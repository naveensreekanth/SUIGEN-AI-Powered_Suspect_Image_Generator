import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { case_id } = await req.json();
    if (!case_id) throw new Error("case_id is required");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const { data: attributes, error: attrError } = await supabaseClient
      .from("suspect_physical_attributes")
      .select("*")
      .eq("case_id", case_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (attrError) throw attrError;

    const prompt = `Realistic digital forensic composite portrait of a single human suspect.

ROLE:
You are a digital forensic sketch generator. Based on structured physical descriptions, you must produce a realistic police-style digital sketch of a suspect.

OUTPUT STYLE GUIDELINES:
- Crime investigation style sketch / digital composite rendering
- Realistic human face based on real-world facial proportions
- Neutral facial expression unless otherwise specified
- High clarity, well-defined facial structure, accurate skin tone and texture
- Bust portrait, chest and head only, subject centered in frame
- Camera: front-facing, straight-on view, eye level
- Lighting: soft, even studio lighting, no dramatic shadows
- Background: plain, clean (white, light grey, or police-ID backdrop)
- No text, no logos, no watermarks, no frames, no labels
- No extra limbs, no multiple faces, no cropped head, no artistic borders
- Avoid stylization: NO anime, cartoon, abstract, or fantasy elements

INSTRUCTIONS:
- Interpret the description as precisely as possible.
- If details are missing, choose the most neutral/default appearance.
- DO NOT invent unrealistic features or distort identity-like elements.
- Produce EXACTLY ONE suspect image per request.

SUSPECT DESCRIPTION (use every field that is specified):
Gender: ${attributes.gender || "Not specified"}
Age: ${attributes.age || "Not specified"} years old
Ethnicity: ${attributes.ethnicity || "Not specified"}
Skin Tone: ${attributes.skin_tone || "Not specified"}
Body Type: ${attributes.body_type || "Not specified"}
Height: ${attributes.height_feet || "Not specified"} feet

FACIAL FEATURES:
Head Shape: ${attributes.head_shape || "Not specified"}
Hair Length: ${attributes.hair_length || "Not specified"}
Hair Style: ${attributes.hair_style || "Not specified"}
Hair Texture: ${attributes.hair_texture || "Not specified"}
Hairline Shape: ${attributes.hairline_shape || "Not specified"}

EYES:
Eye Color: ${attributes.eye_color || "Not specified"}
Eye Shape: ${attributes.eye_shape || "Not specified"}
Eye Size/Spacing: ${attributes.eye_size_spacing || "Not specified"}
Eyebrow Type: ${attributes.eyebrow_type || "Not specified"}
Eyelid Type: ${attributes.eyelid_type || "Not specified"}
Eyelashes: ${attributes.eyelashes || "Not specified"}
Eye Bags/Wrinkles: ${attributes.eye_bags_wrinkles || "Not specified"}

NOSE:
Nose Shape: ${attributes.nose_shape || "Not specified"}
Bridge Height: ${attributes.bridge_height || "Not specified"}
Nose Tip Shape: ${attributes.nose_tip_shape || "Not specified"}
Nostril Width: ${attributes.nostril_width || "Not specified"}

MOUTH:
Lip Shape: ${attributes.lip_shape || "Not specified"}
Lip Thickness: ${attributes.lip_thickness || "Not specified"}
Mouth Width: ${attributes.mouth_width || "Not specified"}
Smile Type: ${attributes.smile_type || "Not specified"}

FACIAL STRUCTURE:
Chin Shape: ${attributes.chin_shape || "Not specified"}

FACIAL HAIR:
Facial Hair Type: ${attributes.facial_hair_type || "Not specified"}
Beard Color: ${attributes.beard_color || "Not specified"}

EARS:
Ear Shape: ${attributes.ear_shape || "Not specified"}
Ear Size: ${attributes.ear_size || "Not specified"}
Ear Lobes: ${attributes.ear_lobes || "Not specified"}
Helix/Antihelix: ${attributes.helix_antihelix || "Not specified"}

SKIN:
Other Skin Features: ${attributes.other_skin_features || "Not specified"}

ACCESSORIES:
Accessories: ${attributes.accessories || "Not specified"}

FINAL VISUAL SUMMARY (most important):
Create a front-facing, chest-and-head portrait of a ${attributes.gender || "adult"} approximately ${attributes.age || "adult"} years old, of ${attributes.ethnicity || "unspecified"} ethnicity, about ${attributes.height_feet || "average"} feet tall, with ${attributes.body_type || "average"} build, ${attributes.skin_tone || "natural"} skin tone, ${attributes.hair_length || "medium"} ${attributes.hair_style || "simple"} ${attributes.hair_texture || "straight"} hair, and ${attributes.eye_color || "natural-colored"} eyes. Neutral expression, no smile unless specified, plain light background, realistic forensic composite style, no text or decorative elements.`;

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"]
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error(`Lovable AI Gateway Error (${aiResponse.status}):`, errorText);
      
      if (aiResponse.status === 402) {
        const message = "Payment required. Please add credits to your Lovable AI workspace.";
        return new Response(
          JSON.stringify({ error: message }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      if (aiResponse.status === 429) {
        const message = "Rate limit exceeded. Please wait a moment and try again.";
        return new Response(
          JSON.stringify({ error: message }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      
      throw new Error(`Lovable AI Gateway error: ${aiResponse.status} - ${errorText}`);
    }

    const aiResult = await aiResponse.json();
    console.log("Lovable AI Gateway Response:", JSON.stringify(aiResult, null, 2));
    
    const imageUrl = aiResult.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!imageUrl) {
      console.error("No image data found. Full response:", JSON.stringify(aiResult, null, 2));
      throw new Error(`No image data in AI response. Response structure: ${JSON.stringify(aiResult)}`);
    }

    const imageDataUrl = imageUrl;

    return new Response(JSON.stringify({ imageData: imageDataUrl }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Error" }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
});
