# 🚀 Guide de Démarrage Rapide

## ⚠️ Erreur : ERR_EMPTY_RESPONSE

Cette erreur signifie que **le backend FastAPI n'est pas démarré**.

## ✅ Solution : Démarrer le Backend

### Étape 1 : Ouvrir un terminal PowerShell

### Étape 2 : Aller dans le dossier backend

```powershell
cd C:\Users\hp\Desktop\Mini-Project-Cloud\backend
```

### Étape 3 : Activer l'environnement virtuel

```powershell
.\venv\Scripts\Activate.ps1
```

**Note :** Si vous obtenez une erreur d'exécution de script, exécutez d'abord :
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Étape 4 : Installer les dépendances (si pas déjà fait)

```powershell
pip install -r requirements.txt
```

### Étape 5 : Démarrer le serveur FastAPI

```powershell
uvicorn app.main:app --reload
```

Vous devriez voir :
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx] using StatReload
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Étape 6 : Vérifier que ça fonctionne

Ouvrir dans le navigateur : http://localhost:8000/api/health

Vous devriez voir : `{"status": "healthy", "service": "cloud-api"}`

## 🎯 Démarrage Complet (Backend + Frontend)

### Terminal 1 - Backend

```powershell
cd C:\Users\hp\Desktop\Mini-Project-Cloud\backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### Terminal 2 - Frontend

```powershell
cd C:\Users\hp\Desktop\Mini-Project-Cloud\frontend
npm install
npm run dev
```

### Terminal 3 - PostgreSQL (si pas avec Docker)

```powershell
# Avec Docker
docker run -d --name postgres-cloud -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cloud_db -p 5432:5432 postgres:14
```

## 🐳 Alternative : Docker Compose (Tout en un)

```powershell
cd C:\Users\hp\Desktop\Mini-Project-Cloud
docker-compose up -d
```

Cela démarre automatiquement :
- PostgreSQL
- Backend FastAPI
- Frontend React

## ✅ Vérifications

### 1. Backend fonctionne ?

Ouvrir : http://localhost:8000/api/health

**Résultat attendu :** `{"status": "healthy", "service": "cloud-api"}`

### 2. API Docs accessible ?

Ouvrir : http://localhost:8000/api/docs

**Résultat attendu :** Interface Swagger UI

### 3. Frontend fonctionne ?

Ouvrir : http://localhost:5173

**Résultat attendu :** Page d'accueil du projet

### 4. Test de connexion

Ouvrir : `test-connection.html` dans le navigateur et cliquer sur "Tester /api/health"

**Résultat attendu :** ✅ Connexion réussie!

## 🐛 Problèmes courants

### Problème : "ModuleNotFoundError: No module named 'pydantic_settings'"

**Solution :**
```powershell
pip install pydantic-settings
# Ou réinstaller toutes les dépendances
pip install -r requirements.txt
```

### Problème : "Port 8000 already in use"

**Solution :**
```powershell
# Trouver le processus qui utilise le port
netstat -ano | findstr :8000
# Tuer le processus (remplacer PID par le numéro trouvé)
taskkill /PID <PID> /F
```

### Problème : "Cannot connect to database"

**Solution :**
1. Vérifier que PostgreSQL est démarré
2. Vérifier les credentials dans `.env`
3. Tester la connexion : `psql -h localhost -U postgres -d cloud_db`

## 📝 Commandes utiles

```powershell
# Vérifier que le backend écoute
netstat -ano | findstr :8000

# Voir les logs du backend (si avec Docker)
docker-compose logs backend

# Arrêter le backend (Ctrl+C dans le terminal)
# Ou avec Docker
docker-compose down
```

## 🎉 Une fois tout démarré

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:8000
- **API Docs** : http://localhost:8000/api/docs
- **Test Connection** : Ouvrir `test-connection.html`

