import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY"
    )!;

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Sauvegarder l'invitation WhatsApp
    const { data, error } = await supabase
      .from("whatsapp_invitations")
      .insert({
        email: email,
        name: name || "Visiteur",
        invited_at: new Date().toISOString(),
        status: "pending",
      })
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // TODO: Envoyer message WhatsApp automatique
    // TODO: Optionnel: Envoyer email de bienvenue avec lien WhatsApp

    return new Response(
      JSON.stringify({
        success: true,
        message:
          "Vous allez être redirigé vers WhatsApp. Bienvenue dans notre communauté!",
        whatsappLink: Deno.env.get("WHATSAPP_GROUP_LINK"),
        data: data,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
