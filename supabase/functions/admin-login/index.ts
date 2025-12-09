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
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return new Response(
        JSON.stringify({
          error: 'Email et mot de passe requis',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Demo authentication (in production, check against database)
    // This is a placeholder - in production, you would:
    // 1. Query the admins table
    // 2. Compare password hash with bcrypt
    // 3. Create a session in admin_sessions table

    const demoAdmin = {
      email: 'ahdybau@gmail.com',
      password: 'ADBleke@14092001',
    };

    if (email === demoAdmin.email && password === demoAdmin.password) {
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return new Response(
        JSON.stringify({
          success: true,
          sessionToken,
          user: {
            id: 'admin-1',
            email: 'ahdybau@gmail.com',
            full_name: 'Admin Principal',
            role: 'super_admin',
            is_active: true,
          },
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        error: 'Identifiants invalides',
      }),
      {
        status: 401,
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
