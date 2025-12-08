import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { logger } from '@/lib/logger'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        logger.info('Service Worker enregistré avec succès', { scope: registration.scope });
      })
      .catch((error) => {
        logger.error('Erreur lors de l\'enregistrement du Service Worker', {}, error instanceof Error ? error : new Error(String(error)));
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
