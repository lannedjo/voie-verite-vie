# Guide d'Accès à l'Espace Administrateur

## 🔐 Informations d'Accès

**Page Admin:** `/admin`

**Identifiants de connexion:**
- **Email:** `ahdybau@gmail.com`
- **Mot de passe:** `ADBleke@14092001`

**Rôle:** Super Administrateur (Super Admin)

---

## 🚀 Comment Accéder à l'Espace Admin

### 1. Via l'URL directe
Accédez directement à: `https://votre-domaine.com/admin`

### 2. Interface de Connexion
- Page: `/admin`
- Vous verrez un formulaire de connexion avec le titre **"Espace Administrateur"**
- Entrez votre email et votre mot de passe
- Cliquez sur **"Se connecter"**

---

## 📊 Tableau de Bord Administrateur

Une fois connecté, vous accédez au **Tableau de bord Admin** avec 3 onglets principaux:

### Onglet 1: Inscriptions aux Activités
- **Voir toutes les inscriptions** aux activités
- **Colonnes affichées:**
  - Nom de la personne
  - Email
  - Activité inscrite
  - Téléphone
  - Date d'inscription
  - Statut (En attente / Confirmée / Annulée)
  
- **Actions:**
  - ✅ Actualiser les données
  - 📥 Exporter en CSV
  - 👁️ Voir les détails
  - 🗑️ Supprimer une inscription

### Onglet 2: Gestion des Paiements
- **Voir tous les paiements reçus**
- **Colonnes affichées:**
  - Activité
  - Email du payeur
  - Montant (XAF, USD, etc.)
  - Méthode de paiement (MTN, Orange)
  - Numéro de référence
  - Statut (En attente / Complété / Échoué)
  - Date du paiement

- **Actions:**
  - ✅ Actualiser les données
  - 📥 Exporter en CSV
  - 👁️ Voir les détails
  - ✏️ Modifier un paiement

### Onglet 3: Paramètres
- **Modifier votre mot de passe**
  - Saisissez le mot de passe actuel
  - Entrez un nouveau mot de passe
  - Confirmez le nouveau mot de passe
  - Cliquez sur "Confirmer"

- **Ajouter un administrateur** (Super Admin uniquement)
  - Email du nouvel administrateur
  - Nom complet
  - Le nouvel admin recevra un email avec un mot de passe temporaire

- **Informations du compte**
  - Affiche votre email, nom complet et rôle

---

## 📈 Statistiques Affichées

Le tableau de bord principal affiche 5 statistiques clés:

1. **Inscriptions** - Nombre total d'inscriptions
2. **Paiements** - Nombre total de paiements
3. **Confirmées** - Nombre d'inscriptions confirmées
4. **En attente** - Nombre de paiements en attente de confirmation
5. **Revenus (XAF)** - Total des revenus en XAF

---

## 🔒 Sécurité et Permissions

### Restrictions d'Accès
- ✅ Seuls les utilisateurs avec un compte admin autorisé peuvent accéder
- ✅ L'email admin principal est `ahdybau@gmail.com`
- ✅ Tous les accès non autorisés sont journalisés
- ✅ Les sessions sont stockées localement et sécurisées

### Actions Autorisées
- **Super Admin:** Toutes les actions (modification des paiements, ajout d'admins, etc.)
- **Admin:** Consultation des données, gestion des inscriptions
- **Modérateur:** Consultation en lecture seule

---

## 💾 Export et Sauvegarde

### Export en CSV
- Cliquez sur le bouton **"Exporter"** dans n'importe quel onglet
- Fichiers générés:
  - `inscriptions.csv` - Liste des inscriptions
  - `paiements.csv` - Liste des paiements
- Utilisez ces fichiers pour vos analyses Excel ou rapports

---

## 🔄 Déconnexion

- Cliquez sur le bouton **"Déconnexion"** (en haut à droite)
- Votre session sera fermée
- Vous devrez vous reconnecter pour accéder de nouveau

---

## ⚠️ Troubleshooting

### "Authentification échouée"
- Vérifiez que l'email est exact: `ahdybau@gmail.com`
- Vérifiez que le mot de passe est correct
- Les données sont sensibles à la casse pour le mot de passe

### Données non affichées
- Cliquez sur le bouton **"Actualiser"** pour recharger les données
- Les données sont stockées dans le navigateur (localStorage)
- Assurez-vous que le JavaScript est activé

### Session expirée
- Si vous n'accédez pas au tableau de bord, vous devrez vous reconnecter
- Cliquez sur "Déconnexion" puis reconnectez-vous

---

## 🛠️ Gestion Supplémentaire

### Changer votre mot de passe
1. Allez à l'onglet **"Paramètres"**
2. Cliquez sur **"Changer le mot de passe"**
3. Remplissez les champs (ancien mot de passe, nouveau mot de passe)
4. Cliquez sur **"Confirmer"**

### Ajouter un nouvel administrateur (Super Admin uniquement)
1. Allez à l'onglet **"Paramètres"**
2. Cliquez sur **"Ajouter un admin"**
3. Entrez l'email et le nom complet du nouvel admin
4. Cliquez sur **"Ajouter"**
5. Un email sera envoyé au nouvel administrateur

---

## 📱 Support

En cas de problème avec l'accès admin:
- Vérifiez votre connexion Internet
- Essayez de vider le cache du navigateur
- Essayez avec un autre navigateur
- Contactez le support technique

---

**Dernière mise à jour:** 23 décembre 2025
**Version:** 1.0
