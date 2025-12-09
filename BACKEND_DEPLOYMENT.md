# 🚀 Guide de Déploiement Backend

## Fonctions Supabase Edge Functions Créées

### 1. `register-activity` - Inscription aux Activités
**Fichier:** `supabase/functions/register-activity/index.ts`

**Endpoint:** `POST /functions/v1/register-activity`

**Payload:**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@example.com",
  "phone": "0612345678",
  "activityId": 1,
  "activityTitle": "La spiritualité au quotidien"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Inscription confirmée",
  "data": {
    "id": "uuid",
    "first_name": "Jean",
    "last_name": "Dupont",
    "email": "jean@example.com",
    "activity_id": 1,
    "registered_at": "2024-12-09T..."
  }
}
```

### 2. `whatsapp-invite` - Invitation Groupe WhatsApp
**Fichier:** `supabase/functions/whatsapp-invite/index.ts`

**Endpoint:** `POST /functions/v1/whatsapp-invite`

**Payload:**
```json
{
  "email": "user@example.com",
  "name": "Marie"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Vous allez être redirigé vers WhatsApp...",
  "whatsappLink": "https://chat.whatsapp.com/...",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Marie",
    "status": "pending",
    "invited_at": "2024-12-09T..."
  }
}
```

---

## 📊 Tables Créées

### `activity_registrations`
```sql
- id (UUID, Primary Key)
- activity_id (INT)
- activity_title (VARCHAR)
- first_name (VARCHAR)
- last_name (VARCHAR)
- email (VARCHAR)
- phone (VARCHAR, nullable)
- registered_at (TIMESTAMP)
- created_at (TIMESTAMP)
```

### `whatsapp_invitations`
```sql
- id (UUID, Primary Key)
- email (VARCHAR)
- name (VARCHAR)
- invited_at (TIMESTAMP)
- status (VARCHAR) - 'pending', 'joined', 'failed'
- created_at (TIMESTAMP)
```

---

## 🔧 Étapes de Déploiement

### 1. Déployer les Tables (SQL)

**Option A: Via Supabase Dashboard**
1. Allez à **SQL Editor**
2. Collez le contenu de: `supabase/migrations/20241209_activity_and_whatsapp_tables.sql`
3. Exécutez

**Option B: Via CLI (Recommandé)**
```bash
cd /workspaces/voie-verite-vie

# Login Supabase
supabase login

# Créer une migration
supabase migration up

# Ou manuellement
supabase db push
```

### 2. Déployer les Functions

**Option A: Via CLI**
```bash
# Deploy register-activity
supabase functions deploy register-activity

# Deploy whatsapp-invite  
supabase functions deploy whatsapp-invite
```

**Option B: Via Dashboard**
1. Allez à **Functions**
2. Créez deux fonctions avec les codes dans:
   - `supabase/functions/register-activity/index.ts`
   - `supabase/functions/whatsapp-invite/index.ts`

### 3. Configurer les Variables d'Environnement

**Dans Supabase Dashboard:**
1. Allez à **Settings** → **Edge Functions**
2. Ajoutez la variable d'environnement:
   ```
   WHATSAPP_GROUP_LINK = https://chat.whatsapp.com/YOUR_LINK
   ```

**Dans `.env.local` (développement):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🧪 Test Local

### 1. Démarrer le dev server
```bash
npm run dev
```

### 2. Tester l'inscription activité
```bash
curl -X POST http://localhost:54321/functions/v1/register-activity \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "0612345678",
    "activityId": 1,
    "activityTitle": "Test Activity"
  }'
```

### 3. Tester l'invitation WhatsApp
```bash
curl -X POST http://localhost:54321/functions/v1/whatsapp-invite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{
    "email": "test@example.com",
    "name": "Test User"
  }'
```

---

## 📦 Améliorations Futures

### À Implémenter
- [ ] Email de confirmation (Resend/SendGrid)
- [ ] SMS WhatsApp automatique (Twilio)
- [ ] Webhook pour synchroniser avec CRM
- [ ] Export CSV des inscriptions
- [ ] Dashboard d'analytics

### Optional Features
- [ ] Double-optin pour inscriptions
- [ ] Statistiques par activité
- [ ] Rappel email avant activité
- [ ] Post-event feedback form
- [ ] API publique pour partenaires

---

## 🔐 Sécurité

### RLS Policies
- ✅ Insertion publique (n'importe qui peut s'inscrire)
- ✅ Lecture publique (afficher les inscriptions)
- ⚠️ À améliorer: Ajouter authentification pour modifications

### Validations
- ✅ Email valide requis
- ✅ Prénom/Nom requis
- ⚠️ À ajouter: Rate limiting (max 5 inscriptions/email/jour)

---

## 📝 Logs et Monitoring

### Supabase Dashboard
1. Allez à **Functions**
2. Cliquez sur la fonction
3. Voir les **Logs** et erreurs

### En local
```bash
supabase functions serve
```

---

## ❌ Dépannage

### Erreur: "Function not found"
- Solution: Assurez-vous que les functions sont déployées avec `supabase functions deploy`

### Erreur: "Table does not exist"
- Solution: Exécutez les migrations SQL

### CORS Error
- Solution: Les headers CORS sont déjà configurés dans les functions

### 401 Unauthorized
- Solution: Vérifiez que `VITE_SUPABASE_ANON_KEY` est correct

---

## 📞 Support

Pour plus d'info sur Supabase Edge Functions:
- [Documentation Officielle](https://supabase.com/docs/guides/functions)
- [API Reference](https://supabase.com/docs/reference/functions)

Besoin d'aide? Contactez l'équipe dev 🚀
