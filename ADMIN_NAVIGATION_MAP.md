 # 🗺️ Carte de Navigation - Espace Administrateur

## 🌐 Structure de l'Application

```
┌─────────────────────────────────────────────────────────────┐
│                        APPLICATION WEB                       │
│                   "Voie, Vérité, Vie (3V)"                  │
└─────────────────────────────────────────────────────────────┘
         │
         ├── Page d'Accueil (/)
         │
         ├── Pages Publiques
         │   ├── /about (À propos)
         │   ├── /activities (Activités)
         │   ├── /biblical-reading (Lecture Biblique)
         │   ├── /bible-book/:bookId (Livre biblique)
         │   ├── /contact (Contact)
         │   ├── /gallery (Galerie)
         │   ├── /faq (FAQ)
         │   ├── /prayer-forum (Forum Prière)
         │   └── /ai-chat (Assistant IA)
         │
         ├── Pages d'Authentification
         │   └── /auth (Connexion utilisateur)
         │
         └── 🔐 ZONE ADMINISTRATION (Sécurisée)
             │
             ├── /admin
             │   └── 🔑 Page Login Admin
             │       │
             │       └── Authentification requise
             │           │
             │           └── ✅ Tableau de Bord Admin
             │               │
             │               ├── 📊 Dashboard
             │               │   ├── Total inscriptions
             │               │   ├── Total paiements
             │               │   ├── Inscriptions confirmées
             │               │   ├── Paiements en attente
             │               │   └── Revenus XAF
             │               │
             │               ├── 📋 Onglet: Inscriptions
             │               │   ├── Liste complète
             │               │   ├── 👁️ Voir détails
             │               │   ├── 🗑️ Supprimer
             │               │   ├── ✅ Actualiser
             │               │   └── 📥 Exporter CSV
             │               │
             │               ├── 💳 Onglet: Paiements
             │               │   ├── Liste complète
             │               │   ├── 👁️ Voir détails
             │               │   ├── ✏️ Modifier
             │               │   ├── ✅ Actualiser
             │               │   └── 📥 Exporter CSV
             │               │
             │               └── ⚙️ Onglet: Paramètres
             │                   ├── 🔐 Changer mot de passe
             │                   ├── 👥 Ajouter admin
             │                   │   └── (Super Admin uniquement)
             │                   ├── ℹ️ Infos compte
             │                   │   ├── Email
             │                   │   ├── Nom complet
             │                   │   └── Rôle
             │                   └── 🚪 Déconnexion
             │
             └── /admin-help
                 └── 📖 Page d'Aide Admin
                     ├── ℹ️ Informations d'accès
                     ├── 📊 Guide du tableau de bord
                     ├── ❓ Questions fréquentes
                     ├── 🚀 Guide rapide
                     └── 📞 Support
```

---

## 🎯 Points d'Accès

### Depuis le Header/Navigation
```
Navigation Bar
├── Logo (vers accueil)
├── Liens pages principales
└── Actions utilisateur
```

### Depuis le Footer
```
Footer
└── Lien: "Administration" → /admin-help
```

### Accès Direct
```
URL directes:
├── https://votre-domaine.com/admin
└── https://votre-domaine.com/admin-help
```

---

## 🔐 Flux d'Authentification Admin

```
                    User navigates to /admin
                            │
                            ▼
                    ┌──────────────────┐
                    │  AdminLogin      │
                    │  Component       │
                    └──────────────────┘
                            │
                    ┌───────┴────────┐
                    │                │
            Email + Password   Pas d'authentification
                    │                │
                    ▼                ▼
            useAdminAuth()     Montrer formulaire
            hook login()            │
                    │               │
            ┌───────┴───────┐       │
            │               │       │
        API Check       Demo Mode   │
        (Supabase)      Check       │
            │               │       │
            ├───────┬───────┤       │
            │       │       │       │
        Succès  Succès  Erreur      │
            │       │       │       │
            └───┬───┘       │       │
                │           │       │
            ✅  Stocker    ❌      │
            localStorage  Afficher ├─► Réessayer
                │          erreur  │
                │           │      │
                ▼           ▼      │
        ┌──────────────────────────┼────┐
        │  Tableau de Bord Admin   │    │
        │  (Admin.tsx)             │    │
        └──────────────────────────┼────┘
                                   │
                          ┌────────┘
                          ▼
                   (Utilisateur peut se
                    reconnecter)
```

---

## 📱 Navigation au sein du Dashboard Admin

```
Tableau de Bord Admin
├─ Header
│  ├── Logo + Titre
│  └── Bouton Déconnexion
│
├─ Statistiques (5 cards)
│  ├── 📊 Inscriptions
│  ├── 💳 Paiements
│  ├── ✅ Confirmées
│  ├── ⏳ En attente
│  └── 💰 Revenus
│
└─ Tabs (3 onglets)
   │
   ├─ INSCRIPTIONS
   │  ├── Bouton Actualiser
   │  ├── Bouton Exporter
   │  ├── Tableau de données
   │  │  ├── Colonnes
   │  │  │  ├── Nom
   │  │  │  ├── Email
   │  │  │  ├── Activité
   │  │  │  ├── Téléphone
   │  │  │  ├── Date
   │  │  │  └── Statut
   │  │  └── Actions
   │  │     ├── 👁️ Voir
   │  │     └── 🗑️ Supprimer
   │  └── Message si vide
   │
   ├─ PAIEMENTS
   │  ├── Bouton Actualiser
   │  ├── Bouton Exporter
   │  ├── Tableau de données
   │  │  ├── Colonnes
   │  │  │  ├── Activité
   │  │  │  ├── Email
   │  │  │  ├── Montant
   │  │  │  ├── Méthode
   │  │  │  ├── Référence
   │  │  │  ├── Statut
   │  │  │  └── Date
   │  │  └── Actions
   │  │     ├── 👁️ Voir
   │  │     └── ✏️ Modifier
   │  └── Message si vide
   │
   └─ PARAMÈTRES
      ├── Card: Changer mot de passe
      │  ├── Formulaire
      │  │  ├── Mot de passe actuel
      │  │  ├── Nouveau mot de passe
      │  │  └── Confirmation
      │  └── Actions (Confirmer/Annuler)
      │
      ├── Card: Ajouter admin (Super Admin)
      │  ├── Formulaire
      │  │  ├── Email
      │  │  └── Nom complet
      │  └── Actions (Ajouter/Annuler)
      │
      └── Card: Infos compte
         ├── Email
         ├── Nom complet
         └── Rôle
```

---

## 🎓 Page d'Aide (/admin-help)

```
Page d'Aide Admin
│
├─ Header
│  ├── Icône Shield
│  ├── Titre
│  └── Sous-titre
│
├─ Alert de Sécurité
│
├─ Card: Accès au Tableau de Bord
│  ├── Bouton "Accéder au Tableau de Bord"
│  └── Fonctionnalités principales (5 points)
│
├─ Section: Questions Fréquentes
│  ├── Où accéder?
│  ├── Qui peut accéder?
│  ├── Comment exporter?
│  ├── Comment ajouter un admin?
│  ├── Session expirée?
│  ├── Comment changer mot de passe?
│  └── Données sécurisées?
│
└─ Card: Besoin d'aide?
   └── Bouton Contact
```

---

## 📊 Flux de Données

```
┌─────────────────────────┐
│   localStorage Browser  │
│  (Client-side storage)  │
│                         │
│  ├─ admin_session       │
│  ├─ admin_user          │
│  ├─ activity_registr... │
│  └─ activity_payments   │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│    Admin Dashboard      │
│    (Admin.tsx)          │
│                         │
│  ├─ useAdminAuth hook   │
│  ├─ useState hooks      │
│  ├─ Tabs + Cards        │
│  └─ Tables affichage    │
└────────────┬────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
CSV Export    UI Display
  (via       (statistiques,
   blob)      tableaux)
```

---

## 🔑 Résumé des Chemins

| Chemin | Composant | Authentification | Description |
|--------|-----------|------------------|-------------|
| `/` | Index | Non | Accueil |
| `/admin` | Admin | Oui | Tableau de bord |
| `/admin-help` | AdminHelp | Non | Page d'aide |
| `/contact` | Contact | Non | Contact |
| `/faq` | FAQ | Non | FAQ |

---

## 👥 Rôles et Permissions

```
Admin: ahdybau@gmail.com
│
├─ Rôle: Super Admin
│
├─ Permissions:
│  ├─ ✅ Voir inscriptions
│  ├─ ✅ Modifier inscriptions
│  ├─ ✅ Voir paiements
│  ├─ ✅ Modifier paiements
│  ├─ ✅ Ajouter admins
│  ├─ ✅ Exporter CSV
│  └─ ✅ Changer mot de passe
│
└─ Session Storage:
   ├─ Token
   └─ User data
```

---

**Carte mise à jour:** 23 décembre 2025  
**Version:** 1.0
