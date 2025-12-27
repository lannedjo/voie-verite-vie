import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, RefreshCw, Eye, Edit2, AlertCircle } from 'lucide-react';

interface PaymentRecord {
  id: string;
  activity_id: string;
  activity_title: string;
  email: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed';
  reference_number: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  payments: PaymentRecord[];
  isLoading: boolean;
  onLoadData: () => void;
  onDownloadCSV: (data: any[], filename: string) => void;
}

export const AdminPayments: React.FC<Props> = ({
  payments,
  isLoading,
  onLoadData,
  onDownloadCSV,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gestion des paiements</CardTitle>
            <CardDescription>
              Suivi de tous les paiements reçus
            </CardDescription>
          </div>
          <div className="space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onLoadData}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Actualiser
            </Button>
            <Button
              size="sm"
              onClick={() => onDownloadCSV(payments, 'paiements.csv')}
            >
              <Download className="w-4 h-4 mr-1" />
              Exporter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Aucun paiement enregistré.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">
                    Activité
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Email
                  </th>
                  <th className="text-right py-3 px-4 font-semibold">
                    Montant
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Méthode
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Référence
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">
                    Statut
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Date
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">
                      {payment.activity_title}
                    </td>
                    <td className="py-3 px-4 text-purple-600">
                      {payment.email}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {payment.amount.toLocaleString()} {payment.currency}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {payment.payment_method === 'mtn'
                          ? 'MTN'
                          : 'Orange'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-mono text-gray-600">
                      {payment.reference_number}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : payment.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {payment.status === 'completed'
                          ? 'Complété'
                          : payment.status === 'failed'
                            ? 'Échoué'
                            : 'En attente'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(payment.created_at).toLocaleDateString(
                        'fr-FR'
                      )}
                    </td>
                    <td className="py-3 px-4 text-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
