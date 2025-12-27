Guide pour appliquer les migrations Supabase et régénérer les types

But
- Appliquer les nouvelles migrations ajoutées sous `supabase/migrations/` afin d'ajouter les colonnes nécessaires et les seeds pour `activities` et `gallery_items`.
- Régénérer les types TypeScript utilisés par le client Supabase pour éviter les erreurs TypeScript lors de `supabase.from('...')`.

Pré-requis
- `supabase` CLI installé et connecté à votre projet (auth via `supabase login`).
- Accès à la base (VARIABLES D'ENV : `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `DATABASE_URL` si vous utilisez `psql`).

Étapes recommandées (option A : supabase CLI)

1. Installer supabase CLI si nécessaire :

```bash
npm install -g supabase
```

2. Depuis la racine du repo, pousser les migrations :

```bash
supabase db push
```

3. Régénérer les types TypeScript pour le client :

```bash
supabase gen types typescript --project-id <PROJECT_ID> > src/types/supabase.ts
```

Remplacez `<PROJECT_ID>` par l'identifiant de votre projet Supabase. Vous pouvez aussi rediriger vers un autre chemin si vous préférez.

Étapes alternatives (option B : psql)

1. Exporter `DATABASE_URL` pointant vers votre base Postgres Supabase :

```bash
export DATABASE_URL="postgres://<user>:<pass>@<host>:<port>/<db>"
```

2. Appliquer les fichiers SQL spécifiques (ordre recommandé) :

```bash
psql "$DATABASE_URL" -f supabase/migrations/20251227_extend_content_tables.sql
psql "$DATABASE_URL" -f supabase/migrations/20251227_seed_activities_gallery.sql
```

3. Régénérer les types (commande supabase ci-dessus) ou utiliser la génération psql -> types manuelle.

Après réussite
- Committez `src/types/supabase.ts` si vous l'avez généré.
- Relancez le build / dev server : `npm run dev` ou `npm run build`.

Notes de sécurité
- Ne jamais committer des clés de production ou `SERVICE_ROLE` dans le dépôt.
- Si vous avez besoin d'opérations admin (listUsers), exécutez-les depuis un script serveur avec `SERVICE_ROLE`.

Si vous voulez, je peux :
- exécuter ces étapes ici si vous me fournissez `PROJECT_ID` (et accès si nécessaire), ou
- vous guider pas à pas pendant que vous exécutez les commandes.

---
Fait par l'assistant pour aider à finaliser l'intégration Supabase.
