import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import { X, CheckCircle, Copy, Phone } from 'lucide-react';
import { logger } from '@/lib/logger';

interface PaymentMethod {
  provider: string;
  number: string;
}

interface PaymentModalProps {
  activity: {
    id: number;
    title: string;
    price: number;
    currency: string;
    paymentMethods: PaymentMethod[];
  };
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onPaymentConfirmed: (paymentData: any) => void;
}

export default function PaymentModal({
  activity,
  userData,
  isOpen,
  onClose,
  onPaymentConfirmed
}: PaymentModalProps) {
  const [step, setStep] = useState<'select' | 'confirm' | 'success'>('select');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setStep('confirm');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié!",
      description: "Le numéro a été copié dans le presse-papiers"
    });
  };

  const handlePaymentConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transactionId.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer l'ID de transaction",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      let paymentRecorded = false;

      // Essayer l'API backend (si disponible)
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
          const response = await fetch(
            `${supabaseUrl}/functions/v1/process-payment`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseKey}`
              },
              body: JSON.stringify({
                activityId: activity.id,
                activityTitle: activity.title,
                amount: activity.price,
                currency: activity.currency,
                paymentMethod: selectedPaymentMethod?.provider,
                transactionId,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: userData.phone
              })
            }
          );

          if (response.ok) {
            paymentRecorded = true;
            logger.info('Paiement enregistré via Supabase', { email: userData.email });
          }
        }
      } catch (backendError) {
        logger.warn('Backend indisponible, utilisation localStorage');
      }

      // Fallback: Sauvegarder localement
      const payments = JSON.parse(localStorage.getItem('activity_payments') || '[]');
      const newPayment = {
        id: `${activity.id}-${Date.now()}`,
        activity_id: activity.id,
        activity_title: activity.title,
        amount: activity.price,
        currency: activity.currency,
        payment_method: selectedPaymentMethod?.provider,
        transaction_id: transactionId,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        status: 'confirmed',
        paid_at: new Date().toISOString(),
        backend: paymentRecorded ? 'Supabase' : 'localStorage'
      };
      payments.push(newPayment);
      localStorage.setItem('activity_payments', JSON.stringify(payments));

      // Mise à jour du nombre de participants
      const registrations = JSON.parse(localStorage.getItem('activity_registrations') || '[]');
      const updatedRegistrations = registrations.map((reg: any) => {
        if (reg.activity_id === activity.id && reg.email === userData.email) {
          return {
            ...reg,
            payment_status: 'paid',
            payment_method: selectedPaymentMethod?.provider,
            transaction_id: transactionId
          };
        }
        return reg;
      });
      localStorage.setItem('activity_registrations', JSON.stringify(updatedRegistrations));

      setStep('success');
      onPaymentConfirmed(newPayment);

      // Fermer après 3 secondes
      setTimeout(() => {
        setStep('select');
        setTransactionId('');
        setSelectedPaymentMethod(null);
        onClose();
      }, 3000);

    } catch (error) {
      logger.error('Erreur lors du paiement', {}, error instanceof Error ? error : new Error(String(error)));
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur s'est produite",
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle>Paiement</CardTitle>
            <CardDescription>{activity.title}</CardDescription>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent>
          {step === 'select' && (
            <div className="space-y-4">
              <div className="bg-primary/10 rounded-lg p-4 mb-6">
                <div className="text-sm text-muted-foreground mb-1">Montant à payer</div>
                <div className="text-3xl font-bold text-primary">
                  {activity.price.toLocaleString()} {activity.currency}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-semibold text-foreground mb-3">
                  Sélectionnez un mode de paiement
                </div>
                {activity.paymentMethods.map((method, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePaymentMethodSelect(method)}
                    className="w-full p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-semibold text-foreground">
                          {method.provider}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {method.number}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-4">
                <p className="text-xs text-blue-900 dark:text-blue-200">
                  💡 Envoyer le montant en FCFA au numéro sélectionné, puis entrez l'ID de transaction ci-après.
                </p>
              </div>
            </div>
          )}

          {step === 'confirm' && selectedPaymentMethod && (
            <div className="space-y-4">
              <div className="bg-primary/10 rounded-lg p-4 mb-4">
                <div className="text-sm text-muted-foreground mb-1">Mode de paiement sélectionné</div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">
                      {selectedPaymentMethod.provider}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {selectedPaymentMethod.number}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(selectedPaymentMethod.number)}
                    className="text-primary hover:bg-primary/10"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copier
                  </Button>
                </div>
              </div>

              <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 my-4">
                <p className="text-xs text-warning-600 dark:text-warning-300">
                  📱 Envoyez {activity.price.toLocaleString()} FCFA à ce numéro, puis vous recevrez un ID de transaction.
                </p>
              </div>

              <form onSubmit={handlePaymentConfirm} className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">
                    ID de Transaction
                  </label>
                  <Input
                    placeholder="Ex: TXN123456789"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Vous trouverez cet identifiant dans votre SMS de confirmation ou l'application mobile.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setStep('select');
                      setTransactionId('');
                    }}
                  >
                    Retour
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 divine-glow"
                    disabled={loading || !transactionId.trim()}
                  >
                    {loading ? 'Traitement...' : 'Confirmer le paiement'}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h4 className="font-semibold text-foreground mb-2">
                Paiement confirmé!
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                {activity.price.toLocaleString()} {activity.currency} ont été reçus avec succès.
              </p>
              <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                Votre inscription à "{activity.title}" est complétée. Un email de confirmation vous sera envoyé.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
