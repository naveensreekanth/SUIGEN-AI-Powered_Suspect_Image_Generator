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
    const { case_id, feature_constraints } = await req.json();
    if (!case_id) throw new Error("case_id is required");
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // Get user ID from auth
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Check if there's already a pending/processing request for this case
    const { data: existingQueue } = await supabaseClient
      .from("image_generation_queue")
      .select("*")
      .eq("case_id", case_id)
      .in("status", ["pending", "processing"])
      .maybeSingle();

    if (existingQueue) {
      return new Response(
        JSON.stringify({ 
          error: "Image generation already in progress for this case. Please wait.",
          queueId: existingQueue.id 
        }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get next available processing slot
    const { data: nextSlot } = await supabaseClient.rpc("get_next_processing_slot");
    const now = new Date();
    const slotTime = new Date(nextSlot);
    
    if (slotTime > now) {
      const waitSeconds = Math.ceil((slotTime.getTime() - now.getTime()) / 1000);
      return new Response(
        JSON.stringify({ 
          error: `Rate limit protection: Please wait ${waitSeconds} seconds before trying again.`,
          retryAfter: waitSeconds 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "Retry-After": waitSeconds.toString()
          } 
        }
      );
    }

    // Create queue entry
    const { data: queueEntry, error: queueError } = await supabaseClient
      .from("image_generation_queue")
      .insert({
        case_id,
        user_id: user.id,
        status: "processing",
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (queueError) throw queueError;

    const { data: attributes, error: attrError } = await supabaseClient
      .from("suspect_physical_attributes")
      .select("*")
      .eq("case_id", case_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (attrError) throw attrError;

    // Build constraint instructions based on lock/confidence levels
    const getConstraintText = (key: string, value: string) => {
      if (!feature_constraints || !feature_constraints[key]) return value;
      const { locked, confidence } = feature_constraints[key];
      if (locked || confidence === 3) return `${value} [FIXED - DO NOT CHANGE]`;
      if (confidence === 2) return `${value} [preserve closely]`;
      return `${value} [can vary slightly]`;
    };

    const basePrompt = `Realistic digital forensic composite portrait of a single human suspect.

ROLE:
You are a digital forensic sketch generator. Based on structured physical descriptions, you must produce a realistic police-style digital sketch of a suspect.

FEATURE CONSTRAINT RULES:
- Features marked [FIXED - DO NOT CHANGE] MUST be rendered EXACTLY as specified with NO variation
- Features marked [preserve closely] should be mostly accurate with minimal variation
- Features marked [can vary slightly] may have natural variation
- Locked/fixed features take HIGHEST PRIORITY during generation

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

SUSPECT DESCRIPTION:
Gender: ${attributes.gender || "Not specified"}
Age: ${attributes.age || "Not specified"} years old
Ethnicity: ${attributes.ethnicity || "Not specified"}
Skin Tone: ${getConstraintText("skin_tone", attributes.skin_tone || "Not specified")}
Body Type: ${attributes.body_type || "Not specified"}
Height: ${attributes.height_feet || "Not specified"} feet

FACIAL FEATURES:
Head Shape: ${getConstraintText("head_shape", attributes.head_shape || "Not specified")}
Hair Length: ${getConstraintText("hair_length", attributes.hair_length || "Not specified")}
Hair Style: ${getConstraintText("hair_style", attributes.hair_style || "Not specified")}
Hair Texture: ${getConstraintText("hair_texture", attributes.hair_texture || "Not specified")}
Hairline Shape: ${getConstraintText("hairline_shape", attributes.hairline_shape || "Not specified")}

EYES:
Eye Color: ${getConstraintText("eye_color", attributes.eye_color || "Not specified")}
Eye Shape: ${getConstraintText("eye_shape", attributes.eye_shape || "Not specified")}
Eye Size/Spacing: ${getConstraintText("eye_size_spacing", attributes.eye_size_spacing || "Not specified")}
Eyebrow Type: ${getConstraintText("eyebrow_type", attributes.eyebrow_type || "Not specified")}
Eyelid Type: ${getConstraintText("eyelid_type", attributes.eyelid_type || "Not specified")}
Eyelashes: ${getConstraintText("eyelashes", attributes.eyelashes || "Not specified")}
Eye Bags/Wrinkles: ${getConstraintText("eye_bags_wrinkles", attributes.eye_bags_wrinkles || "Not specified")}

NOSE:
Nose Shape: ${getConstraintText("nose_shape", attributes.nose_shape || "Not specified")}
Bridge Height: ${getConstraintText("bridge_height", attributes.bridge_height || "Not specified")}
Nose Tip Shape: ${getConstraintText("nose_tip_shape", attributes.nose_tip_shape || "Not specified")}
Nostril Width: ${getConstraintText("nostril_width", attributes.nostril_width || "Not specified")}

MOUTH:
Lip Shape: ${getConstraintText("lip_shape", attributes.lip_shape || "Not specified")}
Lip Thickness: ${getConstraintText("lip_thickness", attributes.lip_thickness || "Not specified")}
Mouth Width: ${getConstraintText("mouth_width", attributes.mouth_width || "Not specified")}
Smile Type: ${getConstraintText("smile_type", attributes.smile_type || "Not specified")}

FACIAL STRUCTURE:
Chin Shape: ${getConstraintText("chin_shape", attributes.chin_shape || "Not specified")}

FACIAL HAIR:
Facial Hair Type: ${getConstraintText("facial_hair_type", attributes.facial_hair_type || "Not specified")}
Beard Color: ${getConstraintText("beard_color", attributes.beard_color || "Not specified")}

EARS:
Ear Shape: ${getConstraintText("ear_shape", attributes.ear_shape || "Not specified")}
Ear Size: ${getConstraintText("ear_size", attributes.ear_size || "Not specified")}
Ear Lobes: ${getConstraintText("ear_lobes", attributes.ear_lobes || "Not specified")}
Helix/Antihelix: ${getConstraintText("helix_antihelix", attributes.helix_antihelix || "Not specified")}

SKIN:
Other Skin Features: ${getConstraintText("other_skin_features", attributes.other_skin_features || "Not specified")}

ACCESSORIES:
Accessories: ${attributes.accessories || "Not specified"}

FINAL VISUAL SUMMARY:
Create a front-facing, chest-and-head portrait. Neutral expression, plain light background, realistic forensic composite style, no text or decorative elements. STRICTLY PRESERVE all features marked as [FIXED].`;

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    // Generate 4 different variations
    const variations = [
      "Generate this portrait with slightly different lighting angles.",
      "Generate this portrait with a subtle variation in expression.",
      "Generate this portrait from a very slightly different angle.",
      "Generate this portrait with alternative interpretation of facial features."
    ];

    const imagePromises = variations.map(async (variation, index) => {
      const prompt = `${basePrompt}\n\nVariation ${index + 1}: ${variation}`;
      
      console.log(`Generating image ${index + 1}/4...`);
      
      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
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
        console.error(`Lovable AI Error for image ${index + 1} (${aiResponse.status}):`, errorText);
        
        if (aiResponse.status === 429) {
          throw new Error("Rate limits exceeded, please try again later.");
        }
        if (aiResponse.status === 402) {
          throw new Error("Payment required, please add funds to your Lovable AI workspace.");
        }
        
        throw new Error(`AI gateway error: ${aiResponse.status}`);
      }

      const aiResult = await aiResponse.json();
      console.log(`Image ${index + 1} response received`);
      
      const imageUrl = aiResult.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      if (!imageUrl) {
        console.error(`No image data found for image ${index + 1}. Full response:`, JSON.stringify(aiResult, null, 2));
        throw new Error(`No image data in response for variation ${index + 1}`);
      }

      return imageUrl;
    });

    // Wait for all 4 images to generate
    const images = await Promise.all(imagePromises);
    console.log(`Successfully generated ${images.length} images`);

    // Update queue entry as completed
    await supabaseClient
      .from("image_generation_queue")
      .update({
        status: "completed",
        completed_at: new Date().toISOString()
      })
      .eq("id", queueEntry.id);

    return new Response(
      JSON.stringify({ images }), 
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in generate-suspect-image:", error);
    
    // Try to update queue status to failed if we have a queue entry
    try {
      const { case_id } = await req.json().catch(() => ({}));
      if (case_id) {
        const supabaseClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_ANON_KEY") ?? "",
          { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
        );
        
        await supabaseClient
          .from("image_generation_queue")
          .update({
            status: "failed",
            completed_at: new Date().toISOString(),
            error_message: error?.message || "Unknown error"
          })
          .eq("case_id", case_id)
          .eq("status", "processing");
      }
    } catch (updateError) {
      console.error("Failed to update queue status:", updateError);
    }
    
    return new Response(JSON.stringify({ error: error?.message || "Error" }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
});
