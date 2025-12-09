import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {
  LogOut,
  Users,
  DollarSign,
  UserPlus,
  Lock,
  AlertCircle,
  Download,
  RefreshCw,
  Eye,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminLogin } from '@/components/AdminLogin';

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

interface AdminStats {
  totalRegistrations: number;
  totalPayments: number;
  totalRevenueXAF: number;
  pendingPayments: number;
  confirmedRegistrations: number;
}

export const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, logout, changePassword, addAdmin } =
    useAdminAuth();

  const [registrations, setRegistrations] = useState<ActivityRegistration[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalRegistrations: 0,
    totalPayments: 0,
    totalRevenueXAF: 0,
    pendingPayments: 0,
    confirmedRegistrations: 0,
  });
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Add admin state
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Load data from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setIsLoadingData(true);
    try {
      // Load registrations from localStorage
      const registrationsData = localStorage.getItem('activity_registrations');
      const paymentsData = localStorage.getItem('activity_payments');

      const regs: ActivityRegistration[] = registrationsData
        ? JSON.parse(registrationsData)
        : [];
      const pays: PaymentRecord[] = paymentsData ? JSON.parse(paymentsData) : [];

      setRegistrations(regs);
      setPayments(pays);

      // Calculate stats
      const totalRevenueXAF = pays.reduce((sum, p) => {
        if (p.status === 'completed' && p.currency === 'XAF') {
          return sum + p.amount;
        }
        return sum;
      }, 0);

      const pendingPayments = pays.filter(
        (p) => p.status === 'pending'
      ).length;

      const confirmedRegistrations = regs.filter(
        (r) => r.status === 'confirmed'
      ).length;

      setStats({
        totalRegistrations: regs.length,
        totalPayments: pays.length,
        totalRevenueXAF,
        pendingPayments,
        confirmedRegistrations,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Veuillez remplir tous les champs');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      const result = await changePassword(currentPassword, newPassword);
      if (result.success) {
        setPasswordSuccess('Mot de passe modifié avec succès');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setShowChangePassword(false);
          setPasswordSuccess('');
        }, 2000);
      } else {
        setPasswordError(result.error || 'Erreur lors du changement');
      }
    } catch (error) {
      setPasswordError('Erreur lors du changement de mot de passe');
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    if (!newAdminEmail || !newAdminName) {
      setAdminError('Veuillez remplir tous les champs');
      return;
    }

    if (!newAdminEmail.includes('@')) {
      setAdminError('Adresse email invalide');
      return;
    }

    try {
      const result = await addAdmin(newAdminEmail, newAdminName, 'admin');
      if (result.success) {
        setAdminSuccess(
          `Admin ${newAdminName} ajouté avec succès. Un email sera envoyé avec le mot de passe temporaire.`
        );
        setNewAdminEmail('');
        setNewAdminName('');
        setTimeout(() => {
          setShowAddAdmin(false);
          setAdminSuccess('');
        }, 3000);
      } else {
        setAdminError(result.error || 'Erreur lors de l\'ajout de l\'admin');
      }
    } catch (error) {
      setAdminError('Erreur lors de l\'ajout de l\'admin');
    }
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      alert('Aucune donnée à télécharger');
      return;
    }

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(','),
      ...data.map((row) =>
        headers.map((header) => {
          const value = row[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => navigate('/admin')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tableau de bord Admin
            </h1>
            <p className="text-gray-600 mt-1">
              Bienvenue, {user?.full_name || user?.email}
            </p>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-gray-600 text-sm mb-1">Inscriptions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalRegistrations}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-gray-600 text-sm mb-1">Paiements</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalPayments}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-gray-600 text-sm mb-1">Confirmées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.confirmedRegistrations}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-gray-600 text-sm mb-1">En attente</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingPayments}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-gray-600 text-sm mb-1">Revenus (XAF)</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats.totalRevenueXAF.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="registrations" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="registrations">Inscriptions</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Registrations Tab */}
          <TabsContent value="registrations" className="space-y-4">
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
                      onClick={loadData}
                      disabled={isLoadingData}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Actualiser
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        downloadCSV(registrations, 'inscriptions.csv')
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
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
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
                      onClick={loadData}
                      disabled={isLoadingData}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Actualiser
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => downloadCSV(payments, 'paiements.csv')}
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
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Modifier le mot de passe
                  </CardTitle>
                  <CardDescription>
                    Sécurisez votre compte avec un nouveau mot de passe
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!showChangePassword ? (
                    <Button
                      onClick={() => setShowChangePassword(true)}
                      variant="outline"
                      className="w-full"
                    >
                      Changer le mot de passe
                    </Button>
                  ) : (
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      {passwordError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            {passwordError}
                          </AlertDescription>
                        </Alert>
                      )}

                      {passwordSuccess && (
                        <Alert className="bg-green-50 border-green-200">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            {passwordSuccess}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div>
                        <label className="text-sm font-medium">
                          Mot de passe actuel
                        </label>
                        <Input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Nouveau mot de passe
                        </label>
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">
                          Confirmer le mot de passe
                        </label>
                        <Input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="mt-1"
                        />
                      </div>

                      <div className="space-x-2">
                        <Button type="submit" className="bg-green-600">
                          Confirmer
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowChangePassword(false);
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmPassword('');
                            setPasswordError('');
                          }}
                        >
                          Annuler
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>

              {/* Add Admin */}
              {user?.role === 'super_admin' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Ajouter un administrateur
                    </CardTitle>
                    <CardDescription>
                      Inviter un nouvel administrateur (super admin uniquement)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!showAddAdmin ? (
                      <Button
                        onClick={() => setShowAddAdmin(true)}
                        variant="outline"
                        className="w-full"
                      >
                        Ajouter un admin
                      </Button>
                    ) : (
                      <form onSubmit={handleAddAdmin} className="space-y-4">
                        {adminError && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{adminError}</AlertDescription>
                          </Alert>
                        )}

                        {adminSuccess && (
                          <Alert className="bg-green-50 border-green-200">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800">
                              {adminSuccess}
                            </AlertDescription>
                          </Alert>
                        )}

                        <div>
                          <label className="text-sm font-medium">
                            Email
                          </label>
                          <Input
                            type="email"
                            value={newAdminEmail}
                            onChange={(e) => setNewAdminEmail(e.target.value)}
                            placeholder="admin@exemple.com"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium">
                            Nom complet
                          </label>
                          <Input
                            type="text"
                            value={newAdminName}
                            onChange={(e) => setNewAdminName(e.target.value)}
                            placeholder="Nom de l'administrateur"
                            className="mt-1"
                          />
                        </div>

                        <div className="space-x-2">
                          <Button type="submit" className="bg-blue-600">
                            Ajouter
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowAddAdmin(false);
                              setNewAdminEmail('');
                              setNewAdminName('');
                              setAdminError('');
                            }}
                          >
                            Annuler
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Admin Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informations du compte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nom complet</p>
                  <p className="font-medium">{user?.full_name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rôle</p>
                  <p className="font-medium">
                    {user?.role === 'super_admin'
                      ? 'Super Administrateur'
                      : 'Administrateur'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
