import { useState, useCallback, useEffect } from 'react';
import { logger } from '@/lib/logger';

interface ActivityPlaces {
  [activityId: number]: {
    maxPlaces: number;
    registeredPlaces: number;
    paidRegistrations: number;
  };
}

export const useActivityPlaces = () => {
  const [places, setPlaces] = useState<ActivityPlaces>({});

  // Charger les places au montage
  useEffect(() => {
    loadActivityPlaces();
  }, []);

  const loadActivityPlaces = useCallback(() => {
    try {
      const registrations = JSON.parse(localStorage.getItem('activity_registrations') || '[]');
      const payments = JSON.parse(localStorage.getItem('activity_payments') || '[]');

      const activityPlaces: ActivityPlaces = {};

      // Compter les inscriptions par activité
      registrations.forEach((reg: any) => {
        const actId = reg.activity_id;
        if (!activityPlaces[actId]) {
          activityPlaces[actId] = {
            maxPlaces: 0,
            registeredPlaces: 0,
            paidRegistrations: 0
          };
        }
        activityPlaces[actId].registeredPlaces++;

        // Compter les inscriptions payées
        const isPaid = payments.some((p: any) => p.email === reg.email && p.activity_id === actId);
        if (isPaid || reg.payment_status === 'paid') {
          activityPlaces[actId].paidRegistrations++;
        }
      });

      setPlaces(activityPlaces);
    } catch (error) {
      logger.error('Erreur lors du chargement des places', {}, error instanceof Error ? error : new Error(String(error)));
    }
  }, []);

  const incrementRegistration = useCallback((activityId: number) => {
    setPlaces(prev => ({
      ...prev,
      [activityId]: {
        ...prev[activityId],
        registeredPlaces: (prev[activityId]?.registeredPlaces || 0) + 1
      }
    }));
  }, []);

  const incrementPaidRegistration = useCallback((activityId: number) => {
    setPlaces(prev => ({
      ...prev,
      [activityId]: {
        ...prev[activityId],
        paidRegistrations: (prev[activityId]?.paidRegistrations || 0) + 1
      }
    }));
  }, []);

  const getAvailablePlaces = useCallback((activityId: number, maxPlaces: number) => {
    const activity = places[activityId];
    const registered = activity?.registeredPlaces || 0;
    return Math.max(0, maxPlaces - registered);
  }, [places]);

  const getPaidRegistrations = useCallback((activityId: number) => {
    return places[activityId]?.paidRegistrations || 0;
  }, [places]);

  const getTotalRegistrations = useCallback((activityId: number) => {
    return places[activityId]?.registeredPlaces || 0;
  }, [places]);

  return {
    loadActivityPlaces,
    incrementRegistration,
    incrementPaidRegistration,
    getAvailablePlaces,
    getPaidRegistrations,
    getTotalRegistrations
  };
};
