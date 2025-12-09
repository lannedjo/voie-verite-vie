import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface PaymentRequest {
  activityId: number;
  activityTitle: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

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
    const body = (await req.json()) as PaymentRequest;

    // Valider les données requises
    if (
      !body.transactionId ||
      !body.activityId ||
      !body.amount ||
      !body.paymentMethod
    ) {
      return new Response(
        JSON.stringify({
          error: "Données de paiement manquantes",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Créer l'enregistrement de paiement
    const payment = {
      id: `${body.activityId}-${Date.now()}`,
      activity_id: body.activityId,
      activity_title: body.activityTitle,
      amount: body.amount,
      currency: body.currency,
      payment_method: body.paymentMethod,
      transaction_id: body.transactionId,
      first_name: body.firstName,
      last_name: body.lastName,
      email: body.email,
      phone: body.phone,
      status: "confirmed",
      paid_at: new Date().toISOString(),
    };

    // Note: En production, vous voudrez:
    // 1. Vérifier la transaction auprès du fournisseur (MTN, Orange)
    // 2. Sauvegarder dans la base de données Supabase
    // 3. Envoyer un email de confirmation
    // 4. Mettre à jour le statut d'inscription

    return new Response(JSON.stringify({ success: true, payment }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erreur de paiement:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Erreur lors du traitement du paiement",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
