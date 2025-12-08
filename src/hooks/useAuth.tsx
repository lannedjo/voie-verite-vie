import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async (userId: string, email?: string) => {
      try {
        console.log('Checking admin role for user:', userId, email);
        
        // Si c'est le superadmin et qu'il n'a pas le rôle, l'ajouter automatiquement
        if (email === 'ahdybau@gmail.com') {
          console.log('Superadmin detected - ensuring admin role is set...');
          
          // Vérifier d'abord s'il a le rôle
          const { data: existingRoles, error: checkError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .eq('role', 'admin');
          
          if (!checkError && (!existingRoles || existingRoles.length === 0)) {
            // Si pas de rôle admin, l'ajouter
            console.log('Adding admin role to superadmin...');
            const { error: insertError } = await supabase
              .from('user_roles')
              .insert([
                {
                  user_id: userId,
                  role: 'admin'
                }
              ]);
            
            if (insertError) {
              console.error('Error adding admin role:', insertError);
            } else {
              console.log('Admin role successfully added');
            }
          }
        }
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId);
        
        if (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
          return;
        }
        
        // Vérifier si l'utilisateur a le rôle 'admin' dans le tableau des rôles
        const hasAdminRole = data && data.some((role: any) => role.role === 'admin');
        console.log('Admin role check result:', { data, hasAdminRole });
        setIsAdmin(hasAdminRole);
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          checkAdminRole(session.user.id, session.user.email);
        } else {
          setIsAdmin(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminRole(session.user.id, session.user.email);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName
        }
      }
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
  };
};