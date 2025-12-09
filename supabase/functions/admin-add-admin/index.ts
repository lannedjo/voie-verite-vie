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
    const { sessionToken, email, fullName, role } = await req.json();

    // Validate input
    if (!sessionToken || !email || !fullName || !role) {
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

    if (!email.includes('@')) {
      return new Response(
        JSON.stringify({
          error: 'Email invalide',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!['admin', 'moderator'].includes(role)) {
      return new Response(
        JSON.stringify({
          error: 'Rôle invalide',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // In production:
    // 1. Verify session token belongs to super_admin
    // 2. Check if email already exists
    // 3. Generate temporary password
    // 4. Hash password with bcrypt
    // 5. Insert into admins table
    // 6. Send email with temporary password
    // 7. Log the action

    const newAdmin = {
      id: `admin_${Date.now()}`,
      email,
      full_name: fullName,
      role,
      is_active: true,
      created_at: new Date().toISOString(),
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Admin ajouté avec succès',
        admin: newAdmin,
      }),
      {
        status: 201,
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
