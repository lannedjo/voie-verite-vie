# Documentation du Système Admin

## Vue d'ensemble

L'application dispose d'un système d'administration complet permettant aux administrateurs de gérer les inscriptions aux activités, les paiements, et d'ajouter d'autres administrateurs.

## Accès à la page Admin

- **URL**: `/admin`
- **Authentification requise**: Oui
- **Administrateur initial**:
  - Email: `ahdybau@gmail.com`
  - Mot de passe: `ADBleke@14092001`

## Flux d'authentification

### 1. Page de connexion
- Accessible à `/admin`
- Formulaire avec email et mot de passe
- Validation des identifiants
- Mode démo intégré (si Supabase n'est pas configuré)

### 2. Session admin
- Stockage local du token de session
- Stockage du profil utilisateur
- Vérification automatique de l'authentification
- Redirection vers login si session expirée

### 3. Déconnexion
- Suppression de la session locale
- Suppression du profil de l'utilisateur
- Redirection vers la page d'accueil

## Fonctionnalités du tableau de bord

### A. Statistiques globales

Affichage de 5 cartes principales:

1. **Inscriptions**
   - Nombre total d'inscriptions
   - Mise à jour en temps réel

2. **Paiements**
   - Nombre total de paiements reçus
   - Calcul des montants

3. **Inscriptions confirmées**
   - Nombre d'inscriptions confirmées
   - Statut de chaque inscription

4. **Paiements en attente**
   - Nombre de paiements non encore validés
   - Suivi du statut

5. **Revenus (XAF)**
   - Total des revenus en FCFA
   - Somme de tous les paiements complétés

### B. Tab "Inscriptions"

**Fonctionnalités**:
- Tableau avec toutes les inscriptions
- Colonnes: Nom, Email, Activité, Téléphone, Date, Statut
- Boutons d'action: Voir détails, Supprimer
- Actualiser les données
- Exporter en CSV

**Statuts possibles**:
- Confirmer (vert)
- En attente (jaune)
- Annulée (rouge)

### C. Tab "Paiements"

**Fonctionnalités**:
- Tableau avec tous les paiements
- Colonnes: Activité, Email, Montant, Méthode, Référence, Statut, Date
- Boutons d'action: Voir détails, Modifier
- Actualiser les données
- Exporter en CSV

**Statuts possibles**:
- Complété (vert)
- En attente (jaune)
- Échoué (rouge)

**Méthodes de paiement**:
- MTN Mobile Money
- Orange Money

### D. Tab "Paramètres"

#### 1. Modifier le mot de passe

**Étapes**:
1. Cliquer sur "Changer le mot de passe"
2. Entrer le mot de passe actuel
3. Entrer le nouveau mot de passe (min. 8 caractères)
4. Confirmer le nouveau mot de passe
5. Cliquer sur "Confirmer"

**Validation**:
- Tous les champs requis
- Confirmation du mot de passe
- Longueur minimum de 8 caractères
- Vérification du mot de passe actuel

#### 2. Ajouter un administrateur (Super Admin uniquement)

**Étapes**:
1. Cliquer sur "Ajouter un admin"
2. Entrer l'email de la personne
3. Entrer le nom complet
4. Cliquer sur "Ajouter"

**Points importants**:
- Seul un super admin peut ajouter des admins
- Un email de bienvenue sera envoyé avec un mot de passe temporaire
- L'admin doit changer son mot de passe à la première connexion

#### 3. Informations du compte

Affiche:
- Email de l'administrateur
- Nom complet
- Rôle (Super Admin ou Admin)

## Structure des données

### Tables utilisateurs

#### `admins`
```sql
- id: UUID (primary key)
- email: VARCHAR (unique)
- password_hash: VARCHAR
- full_name: VARCHAR
- role: VARCHAR ('super_admin', 'admin', 'moderator')
- is_active: BOOLEAN
- last_login: TIMESTAMP
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### `admin_sessions`
```sql
- id: UUID (primary key)
- admin_id: UUID (foreign key)
- session_token: VARCHAR (unique)
- ip_address: VARCHAR
- user_agent: TEXT
- last_activity: TIMESTAMP
- expires_at: TIMESTAMP
- created_at: TIMESTAMP
```

#### `admin_activity_logs`
```sql
- id: UUID (primary key)
- admin_id: UUID (foreign key)
- action: VARCHAR
- resource_type: VARCHAR
- resource_id: UUID
- details: JSONB
- ip_address: VARCHAR
- created_at: TIMESTAMP
```

### Rôles

| Rôle | Permissions |
|------|------------|
| **super_admin** | ✅ Ajouter admins, ✅ Supprimer admins, ✅ Voir tous les logs, ✅ Modifier tous les enregistrements |
| **admin** | ✅ Voir les inscriptions/paiements, ✅ Exporter les données, ✅ Modifier le mot de passe |
| **moderator** | ✅ Voir les inscriptions (lecture seule), ✅ Voir les paiements (lecture seule) |

## Edge Functions

### 1. `admin-login`
- **Endpoint**: `/functions/v1/admin-login`
- **Méthode**: POST
- **Données**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Réponse**:
  ```json
  {
    "success": true,
    "sessionToken": "string",
    "user": {
      "id": "string",
      "email": "string",
      "full_name": "string",
      "role": "string",
      "is_active": boolean
    }
  }
  ```

### 2. `admin-logout`
- **Endpoint**: `/functions/v1/admin-logout`
- **Méthode**: POST
- **Données**:
  ```json
  {
    "sessionToken": "string"
  }
  ```

### 3. `admin-change-password`
- **Endpoint**: `/functions/v1/admin-change-password`
- **Méthode**: POST
- **Données**:
  ```json
  {
    "sessionToken": "string",
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```

### 4. `admin-add-admin`
- **Endpoint**: `/functions/v1/admin-add-admin`
- **Méthode**: POST
- **Données**:
  ```json
  {
    "sessionToken": "string",
    "email": "string",
    "fullName": "string",
    "role": "admin" | "moderator"
  }
  ```

## Sécurité

### Mise en place

1. **Stockage sécurisé des mots de passe**
   - Les mots de passe sont hachés avec bcrypt
   - Jamais stockés en clair
   - Validation côté serveur

2. **Sessions**
   - Tokens de session sécurisés
   - Expiration automatique
   - Stockage dans localStorage sur le client

3. **Contrôle d'accès**
   - Vérification du rôle pour chaque action
   - RLS (Row Level Security) en base de données
   - Redirection automatique si non authentifié

4. **Journalisation**
   - Tous les logs d'admin stockés dans `admin_activity_logs`
   - Traçabilité complète des actions
   - IP et user agent enregistrés

### Bonnes pratiques

- ✅ Changez le mot de passe initial dès la première connexion
- ✅ Utilisez un mot de passe fort (min. 12 caractères)
- ✅ N'oubliez pas vos administrateurs avec des permissions appropriées
- ✅ Vérifiez régulièrement les logs d'activité
- ✅ Déconnectez-vous si vous utilisez un ordinateur partagé

## Mode démo

Si Supabase n'est pas configuré, l'application fonctionne en mode démo avec:
- Stockage local des données (localStorage)
- Authentification basée sur les identifiants par défaut
- Données sauvegardées localement dans le navigateur

## Déploiement en production

### Configuration requise

1. **Supabase**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Déploiement des Edge Functions**
   ```bash
   supabase functions deploy admin-login
   supabase functions deploy admin-logout
   supabase functions deploy admin-change-password
   supabase functions deploy admin-add-admin
   ```

3. **Exécution des migrations**
   - Exécuter `20241209_admin_system.sql` dans Supabase
   - Créer la première admin manuelle avec mot de passe hachéé

4. **Variables d'environnement**
   - Configurer les secrets Supabase
   - Ajouter les clés SMTP pour emails
   - Configurer les URLs de redirection

## Dépannage

### Problème: "Identifiants invalides"
- Vérifier l'email (sensible à la casse)
- Vérifier le mot de passe
- En mode démo, utiliser les identifiants par défaut

### Problème: Session expirée
- Se reconnecter à la page de login
- Les données sont conservées localement

### Problème: Pas d'accès à l'onglet "Ajouter un admin"
- Vérifier que vous êtes super admin
- Seul un super admin peut ajouter d'autres admins

## Support

Pour toute question ou problème:
- Vérifiez la console navigateur (F12)
- Consultez les logs Supabase
- Vérifiez les permissions en base de données
