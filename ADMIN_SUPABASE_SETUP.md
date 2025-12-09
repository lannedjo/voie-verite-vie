# Guide de configuration Supabase pour le système Admin

## Étape 1: Exécuter les migrations SQL

Dans la console Supabase (SQL Editor):

1. Créer un nouveau query
2. Copier et exécuter le contenu de `supabase/migrations/20241209_admin_system.sql`
3. Vérifier que les tables sont bien créées:
   ```sql
   SELECT * FROM admins;
   SELECT * FROM admin_sessions;
   SELECT * FROM admin_activity_logs;
   ```

## Étape 2: Initialiser l'administrateur principal

Dans la console Supabase (SQL Editor):

```sql
-- Générer un hash bcrypt du mot de passe
-- En local, vous pouvez utiliser: npm install -g bcrypt-cli
-- Commande: echo "ADBleke@14092001" | bcrypt

-- Puis insérer l'admin avec le hash
UPDATE admins 
SET password_hash = '$2b$10$...' -- Remplacer par le vrai hash bcrypt
WHERE email = 'ahdybau@gmail.com';
```

**Alternative (moins sécurisé en production)**:
```sql
-- Générer un mot de passe temporaire
-- Dans l'app, faire changer le mot de passe à la première connexion

INSERT INTO admins (email, password_hash, full_name, role, is_active)
VALUES (
  'ahdybau@gmail.com',
  '$2b$10$WIJ5uJXEDpvRPQGm5CW0R.CqYcDKCmCQJp/zcCqQPqNKLJ5eJXUdW', -- hash de "ADBleke@14092001"
  'Admin Principal',
  'super_admin',
  true
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;
```

## Étape 3: Déployer les Edge Functions

### Prérequis
```bash
npm install -g @supabase/cli
supabase login
```

### Déployer
```bash
cd /workspaces/voie-verite-vie

# Déployer chaque fonction
supabase functions deploy admin-login
supabase functions deploy admin-logout
supabase functions deploy admin-change-password
supabase functions deploy admin-add-admin
supabase functions deploy process-payment
```

### Vérifier le déploiement
```bash
supabase functions list
```

## Étape 4: Configurer les variables d'environnement

### .env.local (développement)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anonymous-key
VITE_SUPABASE_SERVICE_KEY=your-service-role-key
```

### .env.production (production)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anonymous-key
```

## Étape 5: Configuration des secrets Supabase

### Secret pour hachage des mots de passe
```bash
supabase secrets set JWT_SECRET=your-secret-key
supabase secrets set BCRYPT_COST=10
```

## Étape 6: Mettre à jour les Edge Functions pour la production

### admin-login/index.ts
Remplacer la démonstration par une requête réelle à la base de données:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = { ... };

serve(async (req) => {
  try {
    const { email, password } = await req.json();
    
    // Créer le client Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    // Requête à la base de données
    // SELECT * FROM admins WHERE email = email
    
    // Vérifier le mot de passe avec bcrypt
    // const isValid = await bcrypt.compare(password, admin.password_hash);
    
    // Créer une session
    // INSERT INTO admin_sessions (...)
    
    return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
  }
});
```

## Étape 7: Tester la configuration

### Test en ligne de commande
```bash
# Test du login
curl -X POST https://your-project.supabase.co/functions/v1/admin-login \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahdybau@gmail.com",
    "password": "ADBleke@14092001"
  }'
```

### Test dans l'application
1. Accéder à `/admin`
2. Essayer de se connecter avec les identifiants
3. Vérifier que le tableau de bord se charge
4. Vérifier que les données s'affichent

## Étape 8: Configuration des emails (optionnel)

Pour envoyer les emails de bienvenue aux nouveaux admins:

### Supabase + Resend
```env
RESEND_API_KEY=your-resend-key
```

### Dans admin-add-admin/index.ts
```typescript
// Envoyer un email avec le mot de passe temporaire
const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'admin@voie-verite-vie.com',
    to: email,
    subject: 'Vous avez été ajouté comme administrateur',
    html: `
      <h2>Bienvenue dans le système admin!</h2>
      <p>Votre mot de passe temporaire est: ${temporaryPassword}</p>
      <p>Veuillez le changer à votre première connexion.</p>
    `,
  }),
});
```

## Étape 9: Activez RLS (Row Level Security)

Les policies sont déjà configurées dans la migration, mais vérifier:

```sql
-- Vérifier que RLS est activé
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('admins', 'admin_sessions', 'admin_activity_logs');

-- Vérifier les policies
SELECT * FROM pg_policies 
WHERE tablename IN ('admins', 'admin_sessions', 'admin_activity_logs');
```

## Étape 10: Monitoring et logs

### Vérifier les sessions actives
```sql
SELECT 
  s.id,
  a.email,
  s.created_at,
  s.expires_at,
  s.ip_address
FROM admin_sessions s
JOIN admins a ON s.admin_id = a.id
WHERE s.expires_at > NOW()
ORDER BY s.created_at DESC;
```

### Vérifier les logs d'activité
```sql
SELECT 
  a.email,
  l.action,
  l.resource_type,
  l.created_at
FROM admin_activity_logs l
JOIN admins a ON l.admin_id = a.id
ORDER BY l.created_at DESC
LIMIT 100;
```

## Checklist de déploiement

- [ ] Migration SQL exécutée
- [ ] Admin initial créé avec mot de passe hashé
- [ ] Edge Functions déployées
- [ ] Variables d'environnement configurées
- [ ] RLS activé sur les tables
- [ ] Tests en ligne de commande réussis
- [ ] Login testé dans l'app
- [ ] Tableau de bord fonctionnel
- [ ] Export CSV fonctionne
- [ ] Logs d'activité enregistrés
- [ ] Changement de mot de passe testé
- [ ] Ajout d'admin testé (super admin)

## Dépannage

### "Aucune connexion à Supabase"
- Vérifier les variables d'environnement
- Vérifier la clé anon
- Vérifier l'URL Supabase

### "Permission denied"
- Vérifier les RLS policies
- Vérifier le rôle de l'utilisateur
- Vérifier les permissions de base de données

### "Session expirée"
- Vérifier la colonne `expires_at` dans `admin_sessions`
- Vérifier la logique d'expiration dans les Edge Functions

## Ressources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/sql-createrole.html)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
