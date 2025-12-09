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
    const { firstName, lastName, email, phone, activityId, activityTitle } =
      await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY"
    )!;

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Sauvegarder l'inscription en base de données
    const { data, error } = await supabase
      .from("activity_registrations")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: phone || null,
        activity_id: activityId,
        activity_title: activityTitle,
        registered_at: new Date().toISOString(),
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

    // TODO: Envoyer email de confirmation
    // TODO: Optionnel: Envoyer message WhatsApp d'invitation

    return new Response(
      JSON.stringify({
        success: true,
        message: "Inscription confirmée",
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
