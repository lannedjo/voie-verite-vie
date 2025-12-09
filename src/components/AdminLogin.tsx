import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AdminLoginProps {
  onLoginSuccess?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError('Veuillez remplir tous les champs');
        setIsLoading(false);
        return;
      }

      if (!email.includes('@')) {
        setError('Veuillez entrer une adresse email valide');
        setIsLoading(false);
        return;
      }

      const result = await login(email, password);

      if (result.success) {
        onLoginSuccess?.();
      } else {
        setError(result.error || 'Authentification échouée');
      }
    } catch (err) {
      setError('Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-center text-purple-600">
            Espace Administrateur
          </CardTitle>
          <CardDescription className="text-center">
            Connectez-vous pour accéder au tableau de bord
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <Input
                type="email"
                placeholder="admin@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="border-gray-300"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Interface réservée aux administrateurs.
              <br />
              Accès non autorisé sera journalisé.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
