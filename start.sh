#!/bin/bash
# Script de démarrage rapide pour le projet

echo "🚀 Démarrage du projet Mini-Project-Cloud..."

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord."
    exit 1
fi

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env
    echo "✅ Fichier .env créé. Veuillez le modifier avec vos configurations."
fi

# Démarrer les services
echo "🐳 Démarrage des services Docker..."
docker-compose up -d

echo "⏳ Attente du démarrage des services..."
sleep 10

# Vérifier l'état des services
echo "📊 État des services:"
docker-compose ps

echo ""
echo "✅ Projet démarré avec succès!"
echo ""
echo "📍 URLs:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/api/docs"
echo "   - PostgreSQL: localhost:5432"
echo ""
echo "Pour arrêter les services: docker-compose down"

