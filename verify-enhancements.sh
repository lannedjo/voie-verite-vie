#!/bin/bash

# 🧪 Script de Vérification des Modifications
# Vérifie que tous les changements sont corrects

echo "🔍 Vérification des Modifications..."
echo "=================================="
echo ""

# Vérifier HeroSection
echo "1️⃣  Vérification HeroSection..."
if grep -q "whatsappGroupLink" src/components/HeroSection.tsx; then
  echo "   ✅ WhatsApp link intégré"
else
  echo "   ❌ WhatsApp link manquant"
fi

if grep -q "1000+" src/components/HeroSection.tsx; then
  echo "   ✅ Statistique 1000+ versets trouvée"
else
  echo "   ❌ Statistique 1000+ manquante"
fi

if grep -q "Verset" src/components/HeroSection.tsx; then
  echo "   ✅ Compteur versets intégré"
else
  echo "   ❌ Compteur versets manquant"
fi

echo ""

# Vérifier DayReadingViewer
echo "2️⃣  Vérification DayReadingViewer..."
if grep -q "flex flex-wrap" src/components/DayReadingViewer.tsx; then
  echo "   ✅ Boutons compacts (flex wrap)"
else
  echo "   ❌ Boutons non optimisés"
fi

echo ""

# Vérifier BiblicalReading
echo "3️⃣  Vérification BiblicalReading..."
if grep -q "gap-3 md:gap-4" src/pages/BiblicalReading.tsx; then
  echo "   ✅ Spacing mois amélioré"
else
  echo "   ❌ Spacing non modifié"
fi

echo ""

# Vérifier ActivityRegistrationModal
echo "4️⃣  Vérification ActivityRegistrationModal..."
if [ -f "src/components/ActivityRegistrationModal.tsx" ]; then
  echo "   ✅ Composant modal créé"
  
  if grep -q "activity_registrations" src/components/ActivityRegistrationModal.tsx; then
    echo "   ✅ localStorage utilisé pour persistance"
  else
    echo "   ⚠️  Stockage localStorage non trouvé"
  fi
else
  echo "   ❌ Composant modal manquant"
fi

echo ""

# Vérifier Activities
echo "5️⃣  Vérification Activities..."
if grep -q "ActivityRegistrationModal" src/pages/Activities.tsx; then
  echo "   ✅ Modal d'inscription intégrée"
else
  echo "   ❌ Modal non intégrée"
fi

echo ""

# Vérifier documentation
echo "6️⃣  Vérification Documentation..."
if [ -f "WHATSAPP_SETUP.md" ]; then
  echo "   ✅ Guide WhatsApp créé"
else
  echo "   ❌ Guide WhatsApp manquant"
fi

if [ -f "ENHANCEMENTS_SESSION.md" ]; then
  echo "   ✅ Résumé enhancements créé"
else
  echo "   ❌ Résumé manquant"
fi

echo ""
echo "=================================="
echo "✅ Vérification Complète!"
echo ""
echo "📋 Prochaines Étapes:"
echo "1. Configurer le lien WhatsApp dans WHATSAPP_SETUP.md"
echo "2. Tester sur localhost: npm run dev"
echo "3. Vérifier sur smartphone (responsive)"
echo "4. Tester le formulaire d'inscription"
echo ""
