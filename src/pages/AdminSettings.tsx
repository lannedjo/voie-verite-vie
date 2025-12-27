import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, UserPlus, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  is_active: boolean;
}

interface Props {
  user: AdminUser | null;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  onAddAdmin: (email: string, fullName: string, role: 'admin' | 'moderator') => Promise<{ success: boolean; error?: string }>;
}

export const AdminSettings: React.FC<Props> = ({
  user,
  onChangePassword,
  onAddAdmin,
}) => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

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

    const result = await onChangePassword(currentPassword, newPassword);
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

    const result = await onAddAdmin(newAdminEmail, newAdminName, 'admin');
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
  };

  return (
    <div className="space-y-4">
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
    </div>
  );
};
