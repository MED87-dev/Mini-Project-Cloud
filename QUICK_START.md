# 🚀 Démarrage Rapide

## ⚠️ Erreur : "Impossible de se connecter au backend"

**Cette erreur signifie que le backend FastAPI n'est pas démarré.**

## ✅ Solution en 3 étapes

### Étape 1 : Démarrer le Backend

**Option A - Script automatique (Windows) :**
```powershell
cd C:\Users\hp\Desktop\Mini-Project-Cloud\backend
start_backend.bat
```

**Option B - Manuellement :**
```powershell
cd C:\Users\hp\Desktop\Mini-Project-Cloud\backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### Étape 2 : Vérifier que le backend fonctionne

Ouvrir dans le navigateur : http://localhost:8000/api/health

Vous devriez voir : `{"status": "healthy", "service": "cloud-api"}`

### Étape 3 : Démarrer le Frontend (dans un autre terminal)

```powershell
cd C:\Users\hp\Desktop\Mini-Project-Cloud\frontend
npm install
npm run dev
```

## 📋 Checklist

- [ ] Backend démarré sur http://localhost:8000
- [ ] Message "Uvicorn running on http://0.0.0.0:8000" visible
- [ ] http://localhost:8000/api/health retourne du JSON
- [ ] Frontend démarré sur http://localhost:5173 ou 5174
- [ ] Dashboard accessible et fonctionnel

## 🐛 Problèmes courants

### Le backend ne démarre pas

1. Vérifier que Python est installé : `python --version`
2. Vérifier que le venv existe : `dir venv` (Windows) ou `ls venv` (Linux)
3. Installer les dépendances : `pip install -r requirements.txt`

### Le port 8000 est déjà utilisé

```powershell
# Trouver le processus
netstat -ano | findstr :8000
# Tuer le processus
taskkill /PID <PID> /F
```

### Erreur "ModuleNotFoundError"

```powershell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## 🎯 Commandes complètes

### Terminal 1 - Backend :
```powershell
cd C:\Users\hp\Desktop\Mini-Project-Cloud\backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### Terminal 2 - Frontend :
```powershell
cd C:\Users\hp\Desktop\Mini-Project-Cloud\frontend
npm run dev
```

## ✅ Une fois démarré

- **Backend** : http://localhost:8000/api/docs
- **Frontend** : http://localhost:5173 (ou 5174)
- **Dashboard** : http://localhost:5173/dashboard

Le Dashboard devrait maintenant afficher les métriques ! 🎉

