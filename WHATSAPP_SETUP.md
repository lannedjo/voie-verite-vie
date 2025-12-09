# Configuration du Groupe WhatsApp

## Comment ajouter le lien du groupe WhatsApp

### 1. Obtenir le lien du groupe WhatsApp

1. Ouvrez WhatsApp sur votre téléphone ou WhatsApp Web
2. Allez dans le groupe **VOIE, VÉRITÉ, VIE (Jean 14:6)**
3. Appuyez sur le nom du groupe en haut
4. Scroll jusqu'à "Inviter via lien"
5. Copiez le lien (format: `https://chat.whatsapp.com/XXXXXXXXXXXXXXXXXX`)

### 2. Mettre à jour le code

Ouvrez `/src/components/HeroSection.tsx` et remplacez cette ligne:

```tsx
const whatsappGroupLink = "https://chat.whatsapp.com/YOUR_GROUP_LINK_HERE";
```

Par votre lien réel:

```tsx
const whatsappGroupLink = "https://chat.whatsapp.com/VOTRE_VRAI_LIEN";
```

### 3. Tester

Allez sur la page d'accueil et survolez le bouton "Rejoignez notre communauté". Vous verrez apparaître:
- Créer un compte
- Rejoindre WhatsApp 💬

Cliquez sur "Rejoindre WhatsApp" pour tester le lien.

## Résumé des modifications

✅ **Bouton "Rejoignez"** - Dropdown avec 2 options:
1. Créer un compte (vers `/auth`)
2. Rejoindre WhatsApp 💬 (vers le groupe WhatsApp)

Les utilisateurs peuvent ainsi choisir de rejoindre directement via WhatsApp ou de créer un compte d'abord.
