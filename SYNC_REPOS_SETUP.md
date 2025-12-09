# Configuration du Workflow de Synchronisation - SIMPLE!

Ce workflow synchronise automatiquement entre:
- **lannedjo/voie-verite-vie** (principal)
- **ahbdb/voie-verite-vie** (collaboratif)

## 3 ÉTAPES SIMPLES

### Étape 1: Générer une clé SSH

```bash
ssh-keygen -t ed25519 -C "ahbdb@github.com" -f ~/.ssh/ahbdb_deploy_key -N ""
```

### Étape 2: Sur GitHub ahbdb - Ajouter Deploy Key

1. Allez à **Settings** → **Deploy keys**
2. Cliquez **Add deploy key**
3. Titre: `Sync from lannedjo`
4. Key: Collez ceci:
   ```bash
   cat ~/.ssh/ahbdb_deploy_key.pub
   ```
5. ✅ Cochez **Allow write access**
6. Cliquez **Add key**

### Étape 3: Sur GitHub lannedjo - Ajouter Secret

1. Allez à **Settings** → **Secrets and variables** → **Actions**
2. Cliquez **New repository secret**
3. Nom: `AHBDB_DEPLOY_KEY`
4. Valeur: Collez ceci:
   ```bash
   cat ~/.ssh/ahbdb_deploy_key
   ```
5. Cliquez **Add secret**

**C'EST TOUT! 🎉**

Le workflow se déclenche maintenant automatiquement à chaque push sur `main`.

## Comment vérifier que ça fonctionne

1. Allez à **Actions** → **Sync to ahbdb Repository**
2. Vous devez voir une exécution avec un ✅ en vert

## Pour synchroniser manuellement

1. **Actions** → **Sync to ahbdb Repository**
2. **Run workflow** → **Run workflow**

## Si ça ne marche pas

Vérifiez:
- ✅ La deploy key est bien sur ahbdb/settings/keys
- ✅ Le secret `AHBDB_DEPLOY_KEY` est bien dans lannedjo/settings/secrets
- ✅ La clé privée commence par `-----BEGIN` et finit par `-----END`
