# Guide de test du système Admin

## Environnement de test

### Prérequis
- L'application tournant en local sur `http://localhost:8082` ou un autre port
- Mode démo activé (pas de configuration Supabase requise)

## Test 1: Accès à la page admin

### Étapes
1. Ouvrir l'application
2. Aller à `http://localhost:[PORT]/admin`
3. Vous devez voir le formulaire de connexion

### Résultat attendu
- ✅ Page de login affichée
- ✅ Champs email et mot de passe visibles
- ✅ Bouton "Se connecter" fonctionnel

## Test 2: Authentification échouée

### Étapes
1. Sur la page de login
2. Entrer un email incorrect: `test@exemple.com`
3. Entrer un mot de passe: `password123`
4. Cliquer sur "Se connecter"

### Résultat attendu
- ✅ Message d'erreur affiché: "Identifiants invalides" ou "Authentification échouée"
- ✅ Pas de redirection vers le tableau de bord
- ✅ Champs vidés (optionnel)

## Test 3: Connexion réussie

### Étapes
1. Sur la page de login
2. Entrer l'email: `ahdybau@gmail.com`
3. Entrer le mot de passe: `ADBleke@14092001`
4. Cliquer sur "Se connecter"

### Résultat attendu
- ✅ Pas d'erreur affichée
- ✅ Redirection vers le tableau de bord
- ✅ Message "Bienvenue, Admin Principal" affiché
- ✅ Bouton "Déconnexion" visible en haut à droite

## Test 4: Tableau de bord - Statistiques

### Étapes
1. Après connexion réussie
2. Vérifier les 5 cartes de statistiques

### Résultat attendu
- ✅ Carte "Inscriptions" affiche un nombre
- ✅ Carte "Paiements" affiche un nombre
- ✅ Carte "Confirmées" affiche un nombre
- ✅ Carte "En attente" affiche un nombre
- ✅ Carte "Revenus (XAF)" affiche un montant

## Test 5: Tab "Inscriptions"

### Étapes
1. Cliquer sur le tab "Inscriptions"
2. Vérifier le tableau

### Résultat attendu
- ✅ Tableau s'affiche
- ✅ En-têtes de colonnes visibles: Nom, Email, Activité, Téléphone, Date, Statut, Actions
- ✅ S'il y a des inscriptions, elles s'affichent
- ✅ Bouton "Actualiser" fonctionne
- ✅ Bouton "Exporter" télécharge un fichier CSV
- ✅ Si aucune inscription, message "Aucune inscription pour le moment."

## Test 6: Tab "Paiements"

### Étapes
1. Cliquer sur le tab "Paiements"
2. Vérifier le tableau

### Résultat attendu
- ✅ Tableau s'affiche
- ✅ En-têtes visibles: Activité, Email, Montant, Méthode, Référence, Statut, Date, Actions
- ✅ S'il y a des paiements, ils s'affichent
- ✅ Bouton "Actualiser" fonctionne
- ✅ Bouton "Exporter" télécharge un fichier CSV
- ✅ Si aucun paiement, message approprié

## Test 7: Tab "Paramètres" - Modifier mot de passe

### Étapes
1. Cliquer sur le tab "Paramètres"
2. Cliquer sur "Changer le mot de passe"
3. Entrer le mot de passe actuel: `ADBleke@14092001`
4. Entrer un nouveau mot de passe: `NewPassword@2024`
5. Confirmer le mot de passe: `NewPassword@2024`
6. Cliquer sur "Confirmer"

### Résultat attendu
- ✅ Formulaire de changement de mot de passe s'affiche
- ✅ Message de succès: "Mot de passe modifié avec succès"
- ✅ Après 2-3 secondes, le formulaire se referme
- ✅ Les champs sont vidés

### Test de régression
1. Cliquer sur "Déconnexion"
2. Essayer de se reconnecter avec le nouveau mot de passe
3. **Note**: En mode démo, le mot de passe ne change pas vraiment

## Test 8: Tab "Paramètres" - Ajouter un admin (Super Admin)

### Étapes
1. Cliquer sur le tab "Paramètres"
2. Chercher la section "Ajouter un administrateur"
3. Cliquer sur "Ajouter un admin"
4. Entrer l'email: `newadmin@exemple.com`
5. Entrer le nom: `Nouvel Admin`
6. Cliquer sur "Ajouter"

### Résultat attendu
- ✅ Section visible (car c'est un super admin)
- ✅ Formulaire s'affiche
- ✅ Message de succès affiché
- ✅ Après 3 secondes, le formulaire se referme
- ✅ Champs vidés

## Test 9: Informations du compte

### Étapes
1. Dans le tab "Paramètres"
2. Vérifier la section "Informations du compte"

### Résultat attendu
- ✅ Email: `ahdybau@gmail.com`
- ✅ Nom complet: `Admin Principal`
- ✅ Rôle: `Super Administrateur`

## Test 10: Déconnexion

### Étapes
1. Cliquer sur le bouton "Déconnexion" en haut à droite
2. Vous devez être redirigé

### Résultat attendu
- ✅ Session supprimée
- ✅ Redirection vers la page d'accueil
- ✅ Pas d'accès au tableau de bord sans se reconnecter
- ✅ localStorage vidé

## Test 11: Protection de la page admin

### Étapes
1. Déconnectez-vous d'abord
2. Allez à `/admin`
3. Vous devriez être redirigé vers le login

### Résultat attendu
- ✅ Pas d'accès au tableau de bord
- ✅ Redirection automatique vers le formulaire de login
- ✅ Message explicite

## Test 12: Export CSV

### Étapes
1. Connectez-vous
2. Allez au tab "Inscriptions"
3. Cliquez sur "Exporter"
4. Un fichier `inscriptions.csv` doit être téléchargé

### Résultat attendu
- ✅ Fichier téléchargé
- ✅ Format CSV valide
- ✅ En-têtes et données correctement formatées
- ✅ Peut être ouvert dans Excel/Google Sheets

## Test 13: Session persistante

### Étapes
1. Connectez-vous
2. Actualisez la page (F5)
3. Vous devez rester connecté

### Résultat attendu
- ✅ Session persistée dans localStorage
- ✅ Pas besoin de se reconnecter
- ✅ Données de l'utilisateur chargées
- ✅ Tableau de bord accessible

## Test 14: Validation des formulaires

### Test 14a: Email invalide
1. Sur la page de login
2. Entrer: `invalidemail`
3. Essayer de soumettre
4. **Résultat**: ❌ Le formulaire affiche une erreur ou le navigateur empêche l'envoi

### Test 14b: Champs vides
1. Sur la page de login
2. Cliquer sur "Se connecter" sans remplir les champs
3. **Résultat**: ❌ Erreur "Veuillez remplir tous les champs"

### Test 14c: Mot de passe trop court
1. Dans "Modifier le mot de passe"
2. Entrer un mot de passe avec moins de 8 caractères
3. Cliquer sur "Confirmer"
4. **Résultat**: ❌ Erreur "Le mot de passe doit contenir au moins 8 caractères"

## Checklist de validation

**Authentification**
- [ ] Formulaire de login accessible
- [ ] Erreur pour identifiants invalides
- [ ] Connexion réussie avec les bons identifiants
- [ ] Session persistée après rechargement

**Tableau de bord**
- [ ] Statistiques affichées correctement
- [ ] Nombre correct d'inscriptions
- [ ] Nombre correct de paiements
- [ ] Revenus calculés correctement

**Onglets**
- [ ] Tab Inscriptions charge le tableau
- [ ] Tab Paiements charge le tableau
- [ ] Tab Paramètres affiche les options
- [ ] Basculer entre les tabs fonctionne

**Fonctionnalités**
- [ ] Actualiser les données fonctionne
- [ ] Export CSV télécharge le fichier
- [ ] Modifier le mot de passe fonctionne
- [ ] Ajouter un admin est visible (super admin)
- [ ] Ajouter un admin fonctionne (super admin)

**Sécurité**
- [ ] Page protégée (pas d'accès sans login)
- [ ] Déconnexion efface la session
- [ ] localStorage contient le token
- [ ] localStorage contient les données utilisateur

**Affichage**
- [ ] Design responsive
- [ ] Couleurs correctes
- [ ] Icônes affichées
- [ ] Texte lisible

## Logs de débogage

Pour voir les informations de débogage:

1. Ouvrir la console navigateur (F12)
2. Aller à l'onglet "Console"
3. Chercher les messages "Admin", "Login", "Session", etc.

### Messages attendus
```javascript
// Connexion réussie
"Admin login successful"

// Chargement des données
"Loading activity registrations"
"Loading activity payments"

// Changement de mot de passe
"Password changed successfully"

// Déconnexion
"Admin logout successful"
```

## Problèmes connus et solutions

### Problème: Le formulaire ne se soumet pas
- **Cause**: Validation côté client
- **Solution**: Vérifier la console pour les erreurs

### Problème: Les données ne se chargent pas
- **Cause**: localStorage vide ou corrompu
- **Solution**: Ouvrir localStorage dans le devtools et vérifier

### Problème: Impossible d'accéder au tab Ajouter un admin
- **Cause**: Pas un super admin
- **Solution**: Vérifier le rôle dans les informations du compte

## Accès aux données de test

### localStorage
```javascript
// Voir la session
JSON.parse(localStorage.getItem('admin_session'))

// Voir l'utilisateur
JSON.parse(localStorage.getItem('admin_user'))

// Voir les inscriptions
JSON.parse(localStorage.getItem('activity_registrations'))

// Voir les paiements
JSON.parse(localStorage.getItem('activity_payments'))
```

### Nettoyer localStorage
```javascript
localStorage.removeItem('admin_session');
localStorage.removeItem('admin_user');
```

## Test en production

Une fois déployé en production:

1. Vérifier l'URL: `https://voie-verite-vie.com/admin`
2. Tester avec les identifiants réels
3. Vérifier que les Edge Functions répondent
4. Vérifier que la base de données Supabase est accessible
5. Tester les principaux cas d'usage
6. Vérifier les logs d'erreur dans Supabase

---

**Dernière mise à jour**: 09 Dec 2024
