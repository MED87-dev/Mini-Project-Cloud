@echo off
REM Script de démarrage du backend FastAPI pour Windows

echo ========================================
echo   Demarrage du Backend FastAPI
echo ========================================
echo.

REM Vérifier si on est dans le bon dossier
if not exist "app\main.py" (
    echo Erreur: Ce script doit etre execute depuis le dossier backend
    echo Aller dans: cd backend
    pause
    exit /b 1
)

REM Activer l'environnement virtuel
echo [1/3] Activation de l'environnement virtuel...
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
) else (
    echo Erreur: Environnement virtuel non trouve
    echo Creer avec: python -m venv venv
    pause
    exit /b 1
)

REM Vérifier les dépendances
echo [2/3] Verification des dependances...
pip show fastapi >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Installation des dependances...
    pip install -r requirements.txt
)

REM Démarrer le serveur
echo [3/3] Demarrage du serveur FastAPI...
echo.
echo ========================================
echo   Backend accessible sur:
echo   http://localhost:8000
echo   http://localhost:8000/api/docs
echo ========================================
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause

