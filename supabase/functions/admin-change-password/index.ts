import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { sessionToken, currentPassword, newPassword } = await req.json();

    // Validate input
    if (!sessionToken || !currentPassword || !newPassword) {
      return new Response(
        JSON.stringify({
          error: 'Tous les champs sont requis',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (newPassword.length < 8) {
      return new Response(
        JSON.stringify({
          error: 'Le mot de passe doit contenir au moins 8 caractères',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify current password (demo)
    if (currentPassword !== 'ADBleke@14092001') {
      return new Response(
        JSON.stringify({
          error: 'Le mot de passe actuel est incorrect',
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // In production:
    // 1. Verify session token is valid
    // 2. Get admin from session
    // 3. Hash new password with bcrypt
    // 4. Update password in database
    // 5. Log the action

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Mot de passe modifié avec succès',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Erreur serveur',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
