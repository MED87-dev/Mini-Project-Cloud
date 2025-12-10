# 🚀 Guide de Démarrage du Backend

## ⚠️ Erreur : "Impossible de se connecter au backend"

Cette erreur signifie que le backend FastAPI n'est **pas démarré** ou n'est **pas accessible**.

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

**Si erreur d'exécution de script :**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Puis réessayez l'activation.

### Étape 4 : Installer les dépendances (si nécessaire)

```powershell
pip install -r requirements.txt
```

### Étape 5 : Démarrer le serveur FastAPI

```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**OU simplement :**
```powershell
uvicorn app.main:app --reload
```

### Étape 6 : Vérifier que ça fonctionne

Vous devriez voir :
```
INFO:     Will watch for changes in these directories: ['C:\\Users\\hp\\Desktop\\Mini-Project-Cloud\\backend']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx] using StatReload
INFO:     Started server process [xxxxx]
INFO:     Application startup complete.
```

### Étape 7 : Tester dans le navigateur

Ouvrir : http://localhost:8000/api/health

Vous devriez voir : `{"status": "healthy", "service": "cloud-api"}`

## 🔍 Vérifications

### Vérifier que le port 8000 est libre

```powershell
netstat -ano | findstr :8000
```

Si des processus utilisent le port, les arrêter :
```powershell
taskkill /PID <PID> /F
```

### Vérifier que Python est installé

```powershell
python --version
```

Doit afficher Python 3.10 ou supérieur.

## 📋 Commandes complètes (copier-coller)

```powershell
# 1. Aller dans le dossier backend
cd C:\Users\hp\Desktop\Mini-Project-Cloud\backend

# 2. Activer l'environnement virtuel
.\venv\Scripts\Activate.ps1

# 3. Installer les dépendances (si pas déjà fait)
pip install -r requirements.txt

# 4. Démarrer le serveur
uvicorn app.main:app --reload
```

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
# Trouver le processus
netstat -ano | findstr :8000
# Tuer le processus (remplacer PID)
taskkill /PID <PID> /F
```

### Problème : "Cannot connect to database"

**Solution :**
1. Vérifier que PostgreSQL est démarré
2. Vérifier les credentials dans `.env`
3. Tester : `psql -h localhost -U postgres -d cloud_db`

## ✅ Une fois le backend démarré

- **API Health** : http://localhost:8000/api/health
- **API Docs** : http://localhost:8000/api/docs
- **API Metrics** : http://localhost:8000/api/metrics/system

Le Dashboard devrait maintenant fonctionner ! 🎉

