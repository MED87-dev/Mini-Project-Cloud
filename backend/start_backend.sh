#!/bin/bash
# Script de démarrage du backend FastAPI pour Linux/Mac

echo "========================================"
echo "  Démarrage du Backend FastAPI"
echo "========================================"
echo ""

# Vérifier si on est dans le bon dossier
if [ ! -f "app/main.py" ]; then
    echo "❌ Erreur: Ce script doit être exécuté depuis le dossier backend"
    echo "Aller dans: cd backend"
    exit 1
fi

# Activer l'environnement virtuel
echo "[1/3] Activation de l'environnement virtuel..."
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
elif [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
else
    echo "❌ Erreur: Environnement virtuel non trouvé"
    echo "Créer avec: python -m venv venv"
    exit 1
fi

# Vérifier les dépendances
echo "[2/3] Vérification des dépendances..."
if ! pip show fastapi > /dev/null 2>&1; then
    echo "📦 Installation des dépendances..."
    pip install -r requirements.txt
fi

# Démarrer le serveur
echo "[3/3] Démarrage du serveur FastAPI..."
echo ""
echo "========================================"
echo "  Backend accessible sur:"
echo "  http://localhost:8000"
echo "  http://localhost:8000/api/docs"
echo "========================================"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

