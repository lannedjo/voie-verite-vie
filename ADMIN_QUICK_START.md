# 🔐 Accès Admin - Instructions rapides

## Identifiants de connexion

```
Email:    ahdybau@gmail.com
Password: ADBleke@14092001
```

## Accès à l'interface

### Développement
```
http://localhost:8082/admin
ou
http://localhost:8081/admin
ou
http://localhost:8080/admin
```

### Production
```
https://voie-verite-vie.com/admin
```

## Ce que vous pouvez faire

### 📊 Voir les statistiques
- Nombre total d'inscriptions
- Nombre total de paiements
- Revenus en FCFA
- Paiements en attente

### 📋 Gérer les inscriptions
- Voir toutes les inscriptions
- Voir le statut (confirmé/en attente/annulé)
- Exporter les inscriptions en CSV
- Supprimer une inscription

### 💳 Gérer les paiements
- Voir tous les paiements
- Voir la méthode de paiement (MTN/Orange)
- Voir l'ID de transaction
- Exporter les paiements en CSV
- Modifier un paiement

### ⚙️ Paramètres du compte
- Changer votre mot de passe
- Ajouter d'autres administrateurs (super admin)
- Voir les infos de votre compte

## Numéros de paiement acceptés

Pour les activités payantes, les participants peuvent payer à:

- **MTN**: 677536642
- **Orange**: 698952526

Montant: En FCFA

## Flux d'une inscription payante

1. Participant clique "S'inscrire"
2. Remplit le formulaire (prénom, nom, email, téléphone)
3. Clique "Continuer"
4. Choisit sa méthode de paiement (MTN ou Orange)
5. Voit le numéro du bénéficiaire
6. Envoie le montant via MTN ou Orange
7. Reçoit un ID de transaction
8. Entre l'ID dans le formulaire
9. Clique "Confirmer le paiement"
10. Voilà! Inscription confirmée ✅

Vous pouvez voir tous les paiements dans le tab "Paiements" du panel admin.

## Activités payantes actuellement

| Activité | Prix | Méthode |
|----------|------|---------|
| Atelier de calligraphie sacrée | 5 000 FCFA | MTN/Orange |

Les autres activités sont gratuites.

## Ajouter un nouvel administrateur

1. Allez à l'onglet "Paramètres"
2. Cliquez sur "Ajouter un admin"
3. Entrez l'email de la personne
4. Entrez son nom complet
5. Cliquez "Ajouter"
6. Un email sera envoyé à la personne avec le mot de passe temporaire

**Note**: Seul le super admin peut ajouter d'autres admins.

## Exporter les données

### Exporter les inscriptions
1. Allez à l'onglet "Inscriptions"
2. Cliquez sur "Exporter"
3. Un fichier `inscriptions.csv` se télécharge

### Exporter les paiements
1. Allez à l'onglet "Paiements"
2. Cliquez sur "Exporter"
3. Un fichier `paiements.csv` se télécharge

Ces fichiers peuvent être ouverts dans Excel ou Google Sheets.

## Changer votre mot de passe

1. Allez à l'onglet "Paramètres"
2. Cliquez sur "Changer le mot de passe"
3. Entrez votre mot de passe actuel
4. Entrez un nouveau mot de passe (min. 8 caractères)
5. Confirmez le nouveau mot de passe
6. Cliquez "Confirmer"

Minimum 8 caractères requis!

## Déconnexion

Cliquez sur le bouton "Déconnexion" en haut à droite.

## En cas de problème

### Je ne peux pas me connecter
- Vérifiez l'email: `ahdybau@gmail.com` (exact)
- Vérifiez le mot de passe: `ADBleke@14092001` (exact)
- Videz le cache du navigateur et réessayez

### La page admin est vierge
- Actualisez la page (F5)
- Videz localStorage: Ouvrez le devtools, onglet Console:
  ```javascript
  localStorage.clear()
  ```
- Reconnectez-vous

### Les données ne se mettent pas à jour
- Cliquez sur le bouton "Actualiser" en haut de chaque tableau
- Attendez quelques secondes

### Impossible d'exporter en CSV
- Vérifiez qu'il y a des données à exporter
- Essayez un autre navigateur
- Vérifiez que les popups ne sont pas bloquées

## Raccourcis clavier

- `F12` - Ouvrir les outils de développement
- `Ctrl+Shift+Delete` - Vider le cache
- `Ctrl+Maj+I` - Inspecteur (alternatif)

## Support technique

Pour toute question:
1. Consultez les guides détaillés
2. Vérifiez la console navigateur (F12)
3. Vérifiez localStorage avec devtools

---

**Important**: Votre accès est limité et protégé. Seules les personnes autorisées peuvent voir cette page.

**Sécurité**: Assurez-vous de vous déconnecter si vous utilisez un ordinateur partagé.

---

*Dernière mise à jour: 09 Décembre 2024*
