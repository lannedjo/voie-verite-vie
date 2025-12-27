import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, RefreshCw, Eye, Trash2, AlertCircle } from 'lucide-react';

interface ActivityRegistration {
  id: string;
  activity_id: string;
  activity_title: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  registered_at: string;
  created_at: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

interface Props {
  registrations: ActivityRegistration[];
  isLoading: boolean;
  onLoadData: () => void;
  onDownloadCSV: (data: any[], filename: string) => void;
}

export const AdminRegistrations: React.FC<Props> = ({
  registrations,
  isLoading,
  onLoadData,
  onDownloadCSV,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Inscriptions aux activités</CardTitle>
            <CardDescription>
              Liste complète des inscriptions
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
              onClick={() =>
                onDownloadCSV(registrations, 'inscriptions.csv')
              }
            >
              <Download className="w-4 h-4 mr-1" />
              Exporter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {registrations.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Aucune inscription pour le moment.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">
                    Nom
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Activité
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Téléphone
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Date
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">
                    Statut
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {reg.first_name} {reg.last_name}
                    </td>
                    <td className="py-3 px-4 text-purple-600">
                      {reg.email}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {reg.activity_title}
                    </td>
                    <td className="py-3 px-4">{reg.phone || '-'}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(reg.created_at).toLocaleDateString(
                        'fr-FR'
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          reg.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : reg.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {reg.status === 'confirmed'
                          ? 'Confirmée'
                          : reg.status === 'cancelled'
                            ? 'Annulée'
                            : 'En attente'}
                      </span>
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
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
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
