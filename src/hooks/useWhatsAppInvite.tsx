import { useCallback } from 'react';
import { logger } from '@/lib/logger';

export function useWhatsAppInvite() {
  const inviteToWhatsApp = useCallback(async (email: string, name?: string) => {
    try {
      let invitedViaBackend = false;

      // Essayer l'API backend (si disponible)
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
          const response = await fetch(
            `${supabaseUrl}/functions/v1/whatsapp-invite`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseKey}`
              },
              body: JSON.stringify({
                email: email,
                name: name || 'Visiteur'
              })
            }
          );

          if (response.ok) {
            invitedViaBackend = true;
            logger.info('Invitation WhatsApp via Supabase', { email });
          }
        }
      } catch (backendError) {
        logger.warn('Backend indisponible, utilisation localStorage');
      }

      // Fallback: Sauvegarder localement
      const invitations = JSON.parse(localStorage.getItem('whatsapp_invitations') || '[]');
      invitations.push({
        id: `${Date.now()}`,
        email: email,
        name: name || 'Visiteur',
        invited_at: new Date().toISOString(),
        backend: invitedViaBackend ? 'Supabase' : 'localStorage'
      });
      localStorage.setItem('whatsapp_invitations', JSON.stringify(invitations));

      logger.info('Invitation WhatsApp enregistrée', { email, name, backend: invitedViaBackend ? 'Supabase' : 'localStorage' });
      return { success: true, backend: invitedViaBackend ? 'Supabase' : 'localStorage' };
    } catch (error) {
      logger.error(
        'Erreur invitation WhatsApp',
        { email },
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }, []);

  return { inviteToWhatsApp };
}
