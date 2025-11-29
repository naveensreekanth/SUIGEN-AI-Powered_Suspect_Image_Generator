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

    const bananaApiKey = Deno.env.get("BANANA_API_KEY");
    if (!bananaApiKey) throw new Error("BANANA_API_KEY not configured");

    // Use AI/ML API for image generation with flux-schnell model
    const aiResponse = await fetch(
      "https://api.aimlapi.com/v1/images/generations",
      {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${bananaApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "flux/schnell",
          prompt: prompt,
          image_size: {
            width: 768,
            height: 768
          },
          num_inference_steps: 4
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
    console.log("AI/ML API Response:", JSON.stringify(aiResult, null, 2));
    
    // Extract image data from AI/ML API response
    const imageData = aiResult.output?.choices?.[0]?.image_base64;
    if (!imageData) {
      console.error("No image data found. Full response:", JSON.stringify(aiResult, null, 2));
      throw new Error(`No image data in AI/ML API response. Response: ${JSON.stringify(aiResult)}`);
    }
    
    // Convert to base64 data URL
    const imageDataUrl = `data:image/png;base64,${imageData}`;

    return new Response(JSON.stringify({ imageData: imageDataUrl }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Error" }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
});
