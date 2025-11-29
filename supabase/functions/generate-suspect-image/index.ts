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

    const prompt = `Generate a photorealistic forensic portrait: ${attributes.gender || ''} ${attributes.age || ''} years old, ${attributes.ethnicity || ''} ethnicity, ${attributes.skin_tone || ''} skin, ${attributes.body_type || ''} build. Face: ${attributes.head_shape || ''} shape. Hair: ${attributes.hair_length || ''}. Eyes: ${attributes.eye_color || ''}. Professional forensic sketch style, front-facing, neutral background.`;

    const freepikApiKey = Deno.env.get("FREEPIK_API_KEY");
    if (!freepikApiKey) throw new Error("FREEPIK_API_KEY not configured");

    const aiResponse = await fetch("https://api.freepik.com/v1/ai/text-to-image", {
      method: "POST",
      headers: { 
        "x-freepik-api-key": freepikApiKey,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        prompt: prompt,
        num_images: 1,
        image: {
          size: "square_1_1"
        }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error(`Freepik API Error (${aiResponse.status}):`, errorText);
      
      if (aiResponse.status === 402 || aiResponse.status === 403) {
        const message = "Freepik API authentication failed. Please check your API key.";
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
      
      throw new Error(`Freepik API error: ${aiResponse.status} - ${errorText}`);
    }

    const aiResult = await aiResponse.json();
    console.log("Freepik API Response:", JSON.stringify(aiResult, null, 2));
    
    const imageData = aiResult.data?.[0]?.base64;
    if (!imageData) {
      console.error("No image data found. Full response:", JSON.stringify(aiResult, null, 2));
      throw new Error(`No image data in Freepik response. Response structure: ${JSON.stringify(aiResult)}`);
    }

    const imageDataUrl = `data:image/png;base64,${imageData}`;

    return new Response(JSON.stringify({ imageData: imageDataUrl }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Error" }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
});
