import { useCallback } from 'react';
import { logger } from '@/lib/logger';

export function useWhatsAppInvite() {
  const inviteToWhatsApp = useCallback(async (email: string, name?: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/whatsapp-invite`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            email: email,
            name: name || 'Visiteur'
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'invitation WhatsApp');
      }

      logger.info('Invitation WhatsApp enregistrée', { email, name });
      return data;
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
