import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { books, chapters, dayNumber } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating quiz for: ${books}, chapters ${chapters}, day ${dayNumber}`);

    const systemPrompt = `Tu es un expert en théologie catholique et en études bibliques. Tu génères des quiz éducatifs sur la Bible.
Tu dois créer exactement 10 questions au total: 5 questions à choix multiples et 5 questions à réponse ouverte.
Les questions doivent porter sur le contenu spécifique des livres et chapitres mentionnés.
Varie la difficulté: 2 faciles, 3 moyennes, 2 difficiles pour chaque type.
Réponds UNIQUEMENT en JSON valide, sans commentaires ni texte supplémentaire.`;

    const userPrompt = `Génère un quiz sur ${books}, chapitres ${chapters}.

Format JSON requis:
{
  "multipleChoice": [
    {
      "question": "La question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "difficulty": "easy|medium|hard",
      "explanation": "Explication courte"
    }
  ],
  "openEnded": [
    {
      "question": "La question ouverte",
      "difficulty": "easy|medium|hard",
      "sampleAnswer": "Une réponse attendue"
    }
  ]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content from AI");
    }

    console.log("AI response received, parsing...");

    // Parse JSON from response (handle possible markdown code blocks)
    let quizData;
    try {
      let jsonStr = content.trim();
      if (jsonStr.startsWith("```json")) {
        jsonStr = jsonStr.slice(7);
      }
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.slice(3);
      }
      if (jsonStr.endsWith("```")) {
        jsonStr = jsonStr.slice(0, -3);
      }
      quizData = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse quiz JSON:", parseError);
      console.error("Content was:", content);
      throw new Error("Failed to parse quiz data");
    }

    return new Response(JSON.stringify(quizData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error generating quiz:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
