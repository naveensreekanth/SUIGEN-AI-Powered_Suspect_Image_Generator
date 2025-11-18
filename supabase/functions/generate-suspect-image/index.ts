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

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not configured");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${lovableApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!aiResponse.ok) throw new Error(`AI error: ${aiResponse.status}`);

    const aiResult = await aiResponse.json();
    const imageData = aiResult.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!imageData) throw new Error("No image data in response");

    return new Response(JSON.stringify({ imageData }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Error" }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
});
