import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from './ui/use-toast';
import { X, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { logger } from '@/lib/logger';

interface Activity {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
}

interface ActivityRegistrationModalProps {
  activity: Activity;
  isOpen: boolean;
  onClose: () => void;
}

export default function ActivityRegistrationModal({ activity, isOpen, onClose }: ActivityRegistrationModalProps) {
  const [step, setStep] = useState<'form' | 'confirmation'>('form');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Sauvegarder l'inscription localement
      const registrations = JSON.parse(localStorage.getItem('activity_registrations') || '[]');
      const newRegistration = {
        id: `${activity.id}-${Date.now()}`,
        activity_id: activity.id,
        activity_title: activity.title,
        activity_date: activity.date,
        activity_time: activity.time,
        activity_location: activity.location,
        user_id: user?.id || null,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        registered_at: new Date().toISOString()
      };
      
      registrations.push(newRegistration);
      localStorage.setItem('activity_registrations', JSON.stringify(registrations));

      // Log pour debug
      logger.info('Inscription activité sauvegardée', { activityId: activity.id, email: formData.email });

      // Succès
      setStep('confirmation');
      toast({
        title: "Succès!",
        description: "Vous êtes inscrit à cette activité"
      });

      // Réinitialiser après 3 secondes
      setTimeout(() => {
        setStep('form');
        setFormData({ firstName: '', lastName: '', email: '', phone: '' });
        onClose();
      }, 3000);

    } catch (error) {
      logger.error('Erreur lors de linscription', {}, error instanceof Error ? error : new Error(String(error)));
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>
            {step === 'form' ? 'S\'inscrire à l\'activité' : 'Inscription confirmée'}
          </CardTitle>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent>
          {step === 'form' ? (
            <div>
              <div className="mb-4">
                <h3 className="font-semibold text-foreground mb-2">{activity.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {activity.date} à {activity.time} • {activity.location}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Prénom"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    placeholder="Nom"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <Input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="tel"
                  placeholder="Téléphone (optionnel)"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />

                <Button 
                  type="submit" 
                  className="w-full divine-glow"
                  disabled={loading}
                >
                  {loading ? 'Inscription en cours...' : 'Confirmer l\'inscription'}
                </Button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                Merci {formData.firstName}!
              </h4>
              <p className="text-sm text-muted-foreground">
                Votre inscription a été confirmée. Un email de confirmation vous sera envoyé.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

