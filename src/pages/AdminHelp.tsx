import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Shield, ArrowRight, AlertCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const AdminHelp = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      
      <main className="flex-1 mt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Espace Administrateur
            </h1>
            <p className="text-lg text-gray-600">
              Accédez au tableau de bord de gestion de l'application
            </p>
          </div>

          {/* Security Warning */}
          <Alert className="mb-8 bg-blue-50 border-blue-200">
            <Lock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Sécurité:</strong> Cette zone est réservée à l'administrateur autorisé uniquement. 
              Tous les accès sont journalisés et surveillés.
            </AlertDescription>
          </Alert>

          {/* Access Card */}
          <Card className="mb-12 border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-600" />
                Accès au Tableau de Bord
              </CardTitle>
              <CardDescription>
                Connectez-vous avec vos identifiants d'administrateur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Pour accéder à l'admin:</h3>
                <Button
                  onClick={() => navigate('/admin')}
                  size="lg"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-between"
                >
                  <span>Accéder au Tableau de Bord</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Fonctionnalités principales:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 mt-1">✓</span>
                    <span><strong>Gestion des inscriptions</strong> - Voir et gérer toutes les inscriptions aux activités</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 mt-1">✓</span>
                    <span><strong>Suivi des paiements</strong> - Consulter tous les paiements et revenus</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 mt-1">✓</span>
                    <span><strong>Export de données</strong> - Exporter les inscriptions et paiements en CSV</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 mt-1">✓</span>
                    <span><strong>Gestion des admins</strong> - Ajouter et gérer d'autres administrateurs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-600 mt-1">✓</span>
                    <span><strong>Sécurité du compte</strong> - Modifier votre mot de passe</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions Fréquentes</h2>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Où accéder à l'espace admin?</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p>
                  Vous pouvez accéder à l'espace admin en visitant directement la page <code className="bg-gray-100 px-2 py-1 rounded text-sm">/admin</code> 
                  ou en utilisant le bouton ci-dessus. Vous devrez vous authentifier avec vos identifiants.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Qui peut accéder à l'admin?</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p>
                  Seuls les utilisateurs avec un compte administrateur autorisé peuvent accéder à cette zone. 
                  Par défaut, l'administrateur principal est <code className="bg-gray-100 px-2 py-1 rounded text-sm">ahdybau@gmail.com</code>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comment exporter les données?</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p>
                  Dans le tableau de bord, accédez à l'onglet "Inscriptions" ou "Paiements" et cliquez sur le bouton 
                  <strong> "Exporter"</strong>. Les données seront téléchargées au format CSV que vous pouvez ouvrir dans Excel.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comment ajouter un nouvel administrateur?</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p>
                  Seul le Super Administrateur peut ajouter d'autres administrateurs. Allez dans l'onglet "Paramètres" 
                  et cliquez sur "Ajouter un admin". Un email sera envoyé au nouvel administrateur avec ses identifiants.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ma session a expiré, que faire?</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p>
                  Cliquez sur le bouton "Déconnexion" en haut à droite, puis reconnectez-vous avec vos identifiants. 
                  Si vous continuez à avoir des problèmes, videz le cache de votre navigateur et réessayez.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Comment changer mon mot de passe?</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p>
                  Une fois connecté au tableau de bord, allez dans l'onglet "Paramètres" et cliquez sur 
                  "Changer le mot de passe". Saisissez votre mot de passe actuel et votre nouveau mot de passe, 
                  puis confirmez.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Les données de l'admin sont-elles sécurisées?</CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p>
                  Oui, tous les accès à l'espace admin sont sécurisés par authentification. Les sessions sont 
                  stockées localement dans votre navigateur et toutes les tentatives d'accès non autorisé sont 
                  journalisées pour des raisons de sécurité.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Help Card */}
          <Card className="mt-8 bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-purple-600" />
                Besoin d'aide?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              <p className="mb-4">
                Si vous rencontrez des problèmes ou des questions concernant l'accès à l'espace administrateur, 
                vous pouvez nous contacter via le formulaire de contact.
              </p>
              <Button
                onClick={() => navigate('/contact')}
                variant="outline"
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                Contacter le Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminHelp;
