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

    const prompt = `A photorealistic forensic portrait photograph of a ${attributes.gender || 'person'} aged ${attributes.age || '25'} years old with ${attributes.ethnicity || ''} ethnicity, ${attributes.skin_tone || 'medium'} skin tone, and ${attributes.body_type || 'average'} build. The face has a ${attributes.head_shape || 'oval'} head shape. Hair: ${attributes.hair_length || 'medium length'}. Eyes: ${attributes.eye_color || 'brown'} colored. Professional forensic identification photograph style, direct front-facing view, neutral gray background, well-lit studio lighting, high detail, sharp focus.`;

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) throw new Error("GEMINI_API_KEY not configured");

    // Use Imagen 3 for image generation
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-goog-api-key": geminiApiKey
        },
        body: JSON.stringify({
          instances: [{
            prompt: prompt
          }],
          parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            safetyFilterLevel: "block_some",
            personGeneration: "allow_adult"
          }
        }),
      }
    );

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error(`AI Gateway Error (${aiResponse.status}):`, errorText);
      
      if (aiResponse.status === 402) {
        const message = "Insufficient Lovable AI credits. Please add credits in Settings → Workspace → Usage to continue generating images.";
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
      
      throw new Error(`AI Gateway error: ${aiResponse.status} - ${errorText}`);
    }

    const aiResult = await aiResponse.json();
    console.log("Imagen Response structure:", JSON.stringify(aiResult, null, 2));
    
    // Extract image data from Imagen response
    const predictions = aiResult.predictions;
    if (!predictions || predictions.length === 0) {
      console.error("No image data found. Full response:", JSON.stringify(aiResult, null, 2));
      throw new Error(`No image data in Imagen response. Response: ${JSON.stringify(aiResult)}`);
    }
    
    // Imagen returns base64 encoded image in bytesBase64Encoded field
    const imageBytes = predictions[0].bytesBase64Encoded;
    if (!imageBytes) {
      throw new Error("No image bytes in response");
    }
    
    // Convert to base64 data URL
    const imageData = `data:image/png;base64,${imageBytes}`;

    return new Response(JSON.stringify({ imageData }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Error" }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
});
