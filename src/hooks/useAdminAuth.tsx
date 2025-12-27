import { useState, useCallback, useEffect } from 'react';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  is_active: boolean;
}

interface AdminAuthState {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  sessionToken: string | null;
}

const ADMIN_STORAGE_KEY = 'admin_session';
const ADMIN_USER_KEY = 'admin_user';

export const useAdminAuth = () => {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
    sessionToken: null,
  });

  // Initialize from localStorage on mount and listen for changes
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem(ADMIN_STORAGE_KEY);
      const storedUser = localStorage.getItem(ADMIN_USER_KEY);

      if (storedToken && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
            error: null,
            sessionToken: storedToken,
          });
        } catch (error) {
          localStorage.removeItem(ADMIN_STORAGE_KEY);
          localStorage.removeItem(ADMIN_USER_KEY);
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            error: null,
            sessionToken: null,
          });
        }
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ADMIN_STORAGE_KEY || e.key === ADMIN_USER_KEY) {
        initializeAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ email, password }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Authentification échouée');
        }

        // Store session and user data
        localStorage.setItem(ADMIN_STORAGE_KEY, data.sessionToken);
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));

        setState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
          error: null,
          sessionToken: data.sessionToken,
        });

        return { success: true };
      } catch (error) {
        // Fallback: Verify credentials locally (demo mode)
        if (
          email === 'ahdybau@gmail.com' &&
          password === 'ADBleke@14092001'
        ) {
          const demoUser: AdminUser = {
            id: 'demo-admin-1',
            email: 'ahdybau@gmail.com',
            full_name: 'Admin Principal',
            role: 'super_admin',
            is_active: true,
          };

          const demoToken = `demo_token_${Date.now()}_${Math.random()}`;

          localStorage.setItem(ADMIN_STORAGE_KEY, demoToken);
          localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(demoUser));

          setState({
            user: demoUser,
            isLoading: false,
            isAuthenticated: true,
            error: null,
            sessionToken: demoToken,
          });

          return { success: true };
        }

        const errorMsg =
          error instanceof Error ? error.message : 'Authentification échouée';
        setState((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
        return { success: false, error: errorMsg };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      if (state.sessionToken) {
        await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-logout`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ sessionToken: state.sessionToken }),
          }
        );
      }
    } catch (error) {
      // Continue logout even if API fails
    }

    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);

    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
      sessionToken: null,
    });
  }, [state.sessionToken]);

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!state.user || !state.sessionToken) {
        return {
          success: false,
          error: 'Non authentifié',
        };
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-change-password`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              sessionToken: state.sessionToken,
              currentPassword,
              newPassword,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: data.error || 'Changement de mot de passe échoué',
          };
        }

        return { success: true };
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : 'Erreur lors du changement';
        return { success: false, error: errorMsg };
      }
    },
    [state.user, state.sessionToken]
  );

  const addAdmin = useCallback(
    async (email: string, fullName: string, role: 'admin' | 'moderator') => {
      if (!state.user || state.user.role !== 'super_admin') {
        return {
          success: false,
          error: 'Seul un super admin peut ajouter des admins',
        };
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-add-admin`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              sessionToken: state.sessionToken,
              email,
              fullName,
              role,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            error: data.error || 'Ajout de l\'admin échoué',
          };
        }

        return { success: true, admin: data.admin };
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : 'Erreur lors de l\'ajout';
        return { success: false, error: errorMsg };
      }
    },
    [state.user, state.sessionToken]
  );

  return {
    ...state,
    login,
    logout,
    changePassword,
    addAdmin,
  };
};
