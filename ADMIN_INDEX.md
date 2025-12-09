# Index - Documentation système Admin

## 📚 Guides disponibles

### 1. 🚀 **ADMIN_QUICK_START.md** - À lire en premier!
**Pour**: Accès immédiat au panel
- Identifiants de connexion
- URLs d'accès
- Tâches principales
- Dépannage rapide

→ [Lire le guide](./ADMIN_QUICK_START.md)

---

### 2. 📖 **ADMIN_SYSTEM_GUIDE.md** - Guide complet
**Pour**: Comprendre le système en détail
- Vue d'ensemble complète
- Flux d'authentification
- Fonctionnalités du tableau de bord
- Structure des données
- Sécurité implémentée

→ [Lire le guide](./ADMIN_SYSTEM_GUIDE.md)

---

### 3. 🔧 **ADMIN_SUPABASE_SETUP.md** - Déploiement production
**Pour**: Mettre en place en production
- Configuration Supabase
- Déploiement des migrations
- Déploiement des Edge Functions
- Variables d'environnement
- Monitoring et logs

→ [Lire le guide](./ADMIN_SUPABASE_SETUP.md)

---

### 4. ✅ **ADMIN_TEST_GUIDE.md** - Tests et validation
**Pour**: Vérifier que tout fonctionne
- 14 cas de test détaillés
- Résultats attendus
- Checklist de validation
- Debugging avec localStorage
- Logs de débogage

→ [Lire le guide](./ADMIN_TEST_GUIDE.md)

---

### 5. 📊 **ADMIN_PAYMENT_SUMMARY.md** - Résumé complet
**Pour**: Vue d'ensemble technique
- Tout ce qui a été implémenté
- Fichiers créés/modifiés
- Tables de base de données
- Edge Functions
- Commits Git

→ [Lire le guide](./ADMIN_PAYMENT_SUMMARY.md)

---

## 🎯 Par cas d'usage

### Je veux me connecter rapidement
→ Lire [ADMIN_QUICK_START.md](./ADMIN_QUICK_START.md)

### Je comprends le système pour la première fois
→ Lire [ADMIN_SYSTEM_GUIDE.md](./ADMIN_SYSTEM_GUIDE.md)

### Je dois mettre en place en production
→ Lire [ADMIN_SUPABASE_SETUP.md](./ADMIN_SUPABASE_SETUP.md)

### Je dois tester et valider
→ Lire [ADMIN_TEST_GUIDE.md](./ADMIN_TEST_GUIDE.md)

### Je besoin d'une vue technique complète
→ Lire [ADMIN_PAYMENT_SUMMARY.md](./ADMIN_PAYMENT_SUMMARY.md)

---

## 📁 Fichiers du système

### Composants React
```
src/
├── components/
│   ├── AdminLogin.tsx          # Formulaire de connexion
│   └── PaymentModal.tsx         # Modal de paiement
├── pages/
│   └── Admin.tsx                # Page admin complète
└── hooks/
    ├── useAdminAuth.tsx         # Gestion authentification
    └── useActivityPlaces.ts     # Gestion des places
```

### Supabase (Backend)
```
supabase/
├── functions/
│   ├── admin-login/             # Connexion admin
│   ├── admin-logout/            # Déconnexion admin
│   ├── admin-change-password/   # Changement mot de passe
│   ├── admin-add-admin/         # Ajouter un admin
│   └── process-payment/         # Traitement paiement
└── migrations/
    ├── 20241209_admin_system.sql        # Tables admin
    └── 20241209_activity_payments_table.sql  # Tables paiements
```

---

## 🔑 Identifiants

### Admin initial
```
Email:    ahdybau@gmail.com
Password: ADBleke@14092001
Rôle:     Super Admin
```

### Accès
```
Dev:  http://localhost:PORT/admin
Prod: https://voie-verite-vie.com/admin
```

---

## 📊 Fonctionnalités principales

| Fonctionnalité | Location | Status |
|---|---|---|
| 🔐 Authentification sécurisée | AdminLogin.tsx | ✅ |
| 📊 Tableau de bord stats | Admin.tsx | ✅ |
| 📋 Gestion inscriptions | Admin.tsx Tab1 | ✅ |
| 💳 Gestion paiements | Admin.tsx Tab2 | ✅ |
| 🔑 Gestion mot de passe | Admin.tsx Tab3 | ✅ |
| 👤 Ajouter admins | Admin.tsx Tab3 | ✅ |
| 💵 Paiement par MTN/Orange | PaymentModal.tsx | ✅ |
| 📥 Export CSV | Admin.tsx | ✅ |
| 🔄 Actualiser données | Admin.tsx | ✅ |
| 📱 Responsive design | Tous | ✅ |

---

## 🚀 Démarrage rapide

1. **Accéder à l'interface**
   - Aller à `/admin`

2. **Se connecter**
   - Email: `ahdybau@gmail.com`
   - Mot de passe: `ADBleke@14092001`

3. **Voir les statistiques**
   - 5 cartes avec les principales métriques

4. **Gérer les inscriptions**
   - Tab "Inscriptions"
   - Voir toutes les inscriptions
   - Exporter en CSV

5. **Gérer les paiements**
   - Tab "Paiements"
   - Voir tous les paiements
   - Exporter en CSV

6. **Gérer le compte**
   - Tab "Paramètres"
   - Changer mot de passe
   - Ajouter admins (super admin)

---

## ⚙️ Configuration

### Mode développement
- ✅ Fonctionne sans Supabase
- ✅ Données en localStorage
- ✅ Authentification locale

### Mode production
- 📋 Nécessite Supabase
- 📋 Nécessite migrations exécutées
- 📋 Nécessite Edge Functions déployées

Voir [ADMIN_SUPABASE_SETUP.md](./ADMIN_SUPABASE_SETUP.md)

---

## 🔒 Sécurité

✅ Accès protégé par authentification
✅ Seul l'admin principal par défaut
✅ Mots de passe hachés
✅ Sessions sécurisées
✅ Journalisation complète
✅ RLS en base de données

---

## 📞 Support

### Problèmes courants

**Je ne peux pas me connecter**
→ Vérifiez email et mot de passe dans [ADMIN_QUICK_START.md](./ADMIN_QUICK_START.md)

**Les données ne s'affichent pas**
→ Cliquez "Actualiser" et consultez [ADMIN_TEST_GUIDE.md](./ADMIN_TEST_GUIDE.md)

**Je dois déployer en production**
→ Suivez [ADMIN_SUPABASE_SETUP.md](./ADMIN_SUPABASE_SETUP.md)

**Je veux comprendre le système complet**
→ Lisez [ADMIN_SYSTEM_GUIDE.md](./ADMIN_SYSTEM_GUIDE.md)

---

## ✨ Points clés à retenir

1. **Accès limité** - Seul ahdybau@gmail.com par défaut
2. **Super admin** - Peut ajouter d'autres admins
3. **Deux onglets de gestion** - Inscriptions et Paiements
4. **Export CSV** - Pour chaque type de données
5. **Sécurité** - Paiements en FCFA, numéros MTN/Orange

---

## 📅 Dernière mise à jour

**Date**: 09 Décembre 2024
**Statut**: ✅ Complet et opérationnel
**Version**: 1.0

---

## 🎓 Ressources

- [GitHub Repository](https://github.com/lannedjo/voie-verite-vie)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)

---

**Bienvenue dans le système d'administration! 🎉**
