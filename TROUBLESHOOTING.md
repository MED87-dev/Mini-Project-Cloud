# Guide de Dépannage

## ❌ Problème : "Impossible de charger les métriques"

### Causes possibles

1. **Backend non démarré**
2. **URL API incorrecte**
3. **Erreur CORS**
4. **Port déjà utilisé**
5. **Base de données non accessible**

## 🔍 Vérifications étape par étape

### 1. Vérifier que le backend est démarré

```powershell
# Vérifier si le serveur répond
curl http://localhost:8000/api/health

# Ou ouvrir dans le navigateur
# http://localhost:8000/api/health
```

**Solution :** Si ça ne fonctionne pas, démarrer le backend :

```powershell
cd C:\Users\hp\Desktop\Mini-Project-Cloud\backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### 2. Vérifier l'endpoint des métriques

Ouvrir dans le navigateur : http://localhost:8000/api/metrics/system

**Résultat attendu :** JSON avec les métriques système

**Si erreur 404 :** Vérifier que le fichier `backend/app/api/v1/metrics.py` existe et contient la route `/system`

**Si erreur 500 :** Vérifier les logs du backend pour voir l'erreur exacte

### 3. Vérifier l'URL de l'API dans le frontend

Le frontend utilise la variable d'environnement `VITE_API_URL` ou par défaut `http://localhost:8000`

**Vérifier :**
- Ouvrir la console du navigateur (F12)
- Voir les requêtes réseau dans l'onglet "Network"
- Vérifier l'URL utilisée pour les requêtes

**Si l'URL est incorrecte :**
- Créer un fichier `.env` dans `frontend/` avec :
  ```
  VITE_API_URL=http://localhost:8000
  ```
- Redémarrer le serveur de développement

### 4. Vérifier les erreurs CORS

**Symptôme :** Erreur dans la console du navigateur : "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solution :** Vérifier que le backend a CORS configuré dans `backend/app/main.py` :

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # Doit inclure http://localhost:5173
    ...
)
```

### 5. Vérifier que PostgreSQL est démarré

```powershell
# Vérifier avec Docker
docker ps | findstr postgres

# Ou tester la connexion
psql -h localhost -U postgres -d cloud_db
```

**Solution :** Si PostgreSQL n'est pas démarré :

```powershell
# Avec Docker Compose (depuis la racine)
docker-compose up -d postgres

# Ou manuellement
docker run -d --name postgres-cloud -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cloud_db -p 5432:5432 postgres:14
```

## 🛠️ Solutions rapides

### Solution 1 : Redémarrer tout avec Docker Compose

```powershell
cd C:\Users\hp\Desktop\Mini-Project-Cloud
docker-compose down
docker-compose up -d
```

### Solution 2 : Démarrer manuellement

**Terminal 1 - Backend :**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend :**
```powershell
cd frontend
npm install
npm run dev
```

**Terminal 3 - PostgreSQL (si pas avec Docker) :**
```powershell
# Voir section PostgreSQL ci-dessus
```

### Solution 3 : Vérifier les logs

```powershell
# Logs backend
docker-compose logs backend

# Logs frontend
docker-compose logs frontend

# Logs PostgreSQL
docker-compose logs postgres
```

## 📋 Checklist de vérification

- [ ] Backend démarré sur http://localhost:8000
- [ ] Endpoint `/api/metrics/system` accessible
- [ ] PostgreSQL démarré sur localhost:5432
- [ ] Variable `VITE_API_URL` correcte (ou valeur par défaut)
- [ ] CORS configuré dans le backend
- [ ] Pas d'erreurs dans la console du navigateur (F12)
- [ ] Pas d'erreurs dans les logs du backend

## 🔗 URLs à tester

- Backend Health : http://localhost:8000/api/health
- Backend Metrics : http://localhost:8000/api/metrics/system
- Backend Docs : http://localhost:8000/api/docs
- Frontend : http://localhost:5173

## 💡 Astuce

Ouvrir la console du navigateur (F12) et l'onglet "Network" pour voir exactement quelle requête échoue et pourquoi.

