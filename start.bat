@echo off
REM Script de démarrage rapide pour Windows

echo 🚀 Démarrage du projet Mini-Project-Cloud...

REM Vérifier si Docker est installé
where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker n'est pas installé. Veuillez installer Docker d'abord.
    exit /b 1
)

where docker-compose >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord.
    exit /b 1
)

REM Créer le fichier .env s'il n'existe pas
if not exist .env (
    echo 📝 Création du fichier .env...
    copy .env.example .env
    echo ✅ Fichier .env créé. Veuillez le modifier avec vos configurations.
)

REM Démarrer les services
echo 🐳 Démarrage des services Docker...
docker-compose up -d

echo ⏳ Attente du démarrage des services...
timeout /t 10 /nobreak >nul

REM Vérifier l'état des services
echo 📊 État des services:
docker-compose ps

echo.
echo ✅ Projet démarré avec succès!
echo.
echo 📍 URLs:
echo    - Frontend: http://localhost:5173
echo    - Backend API: http://localhost:8000
echo    - API Docs: http://localhost:8000/api/docs
echo    - PostgreSQL: localhost:5432
echo.
echo Pour arrêter les services: docker-compose down

