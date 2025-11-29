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

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) throw new Error("GEMINI_API_KEY not configured");

    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: "image/jpeg"
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
    console.log("Gemini Response structure:", JSON.stringify(aiResult, null, 2));
    
    // Extract image data from Gemini response
    const inlineData = aiResult.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    if (!inlineData?.data) {
      console.error("No image data found. Full response:", JSON.stringify(aiResult, null, 2));
      throw new Error(`No image data in Gemini response. Response structure: ${JSON.stringify(aiResult.candidates?.[0]?.content || {})}`);
    }
    
    // Convert to base64 data URL
    const imageData = `data:${inlineData.mimeType};base64,${inlineData.data}`;

    return new Response(JSON.stringify({ imageData }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Error" }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
});
