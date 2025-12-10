# Guide de Connexion FastAPI ↔ Frontend

## ✅ Configuration actuelle

### Backend (FastAPI)
- **Port** : 8000
- **URL** : http://localhost:8000
- **CORS** : Configuré pour accepter les requêtes depuis http://localhost:5173
- **Endpoints** : Préfixe `/api`

### Frontend (React + Vite)
- **Port** : 5173
- **URL** : http://localhost:5173
- **Proxy** : Configuré dans `vite.config.ts` pour rediriger `/api` vers `http://localhost:8000`
- **Service API** : `frontend/src/services/api.ts`

## 🔌 Comment ça fonctionne

### 1. Configuration CORS (Backend)

Le backend autorise les requêtes depuis le frontend grâce à CORS :

```python
# backend/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Proxy Vite (Frontend)

Vite redirige automatiquement les requêtes `/api` vers le backend :

```typescript
// frontend/vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  },
}
```

### 3. Service API (Frontend)

Le service API utilise Axios pour communiquer avec le backend :

```typescript
// frontend/src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const api = axios.create({ baseURL: API_URL })
```

## 🚀 Démarrage

### Option 1 : Démarrage manuel

**Terminal 1 - Backend :**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend :**
```powershell
cd frontend
npm install
npm run dev
```

### Option 2 : Docker Compose (recommandé)

```powershell
cd C:\Users\hp\Desktop\Mini-Project-Cloud
docker-compose up -d
```

## 🧪 Test de connexion

### 1. Tester le backend directement

Ouvrir dans le navigateur :
- http://localhost:8000/api/health
- http://localhost:8000/api/metrics/system
- http://localhost:8000/api/docs (Swagger UI)

### 2. Tester depuis le frontend

1. Ouvrir http://localhost:5173
2. Ouvrir la console du navigateur (F12)
3. Aller dans l'onglet "Network"
4. Naviguer vers le Dashboard
5. Vérifier que les requêtes vers `/api/metrics/system` sont réussies (status 200)

### 3. Test avec curl

```powershell
# Test health endpoint
curl http://localhost:8000/api/health

# Test metrics endpoint
curl http://localhost:8000/api/metrics/system
```

## 🔍 Vérifications

### Checklist de connexion

- [ ] Backend démarré sur http://localhost:8000
- [ ] Frontend démarré sur http://localhost:5173
- [ ] CORS configuré dans `backend/app/main.py`
- [ ] Proxy configuré dans `frontend/vite.config.ts`
- [ ] Variable `VITE_API_URL` définie (ou valeur par défaut)
- [ ] Pas d'erreurs CORS dans la console du navigateur
- [ ] Les requêtes API retournent du JSON valide

## 🐛 Dépannage

### Erreur : "Network Error" ou "ECONNREFUSED"

**Cause** : Le backend n'est pas démarré

**Solution** :
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

### Erreur : "CORS policy: No 'Access-Control-Allow-Origin'"

**Cause** : CORS mal configuré ou origine non autorisée

**Solution** : Vérifier que `http://localhost:5173` est dans `CORS_ORIGINS` dans `backend/app/core/config.py`

### Erreur : "404 Not Found" sur les endpoints

**Cause** : Le préfixe `/api` n'est pas correct

**Solution** : Vérifier que les routes sont bien préfixées avec `/api` dans `backend/app/main.py`

### Les requêtes ne passent pas par le proxy

**Cause** : Le proxy Vite ne fonctionne pas

**Solution** : 
1. Vérifier `vite.config.ts`
2. Redémarrer le serveur de développement
3. Utiliser directement `http://localhost:8000` dans `VITE_API_URL`

## 📝 Exemple de requête

### Depuis le frontend

```typescript
import { getSystemMetrics } from './services/api'

// Dans un composant React
const metrics = await getSystemMetrics()
console.log(metrics)
```

### Requête directe

```typescript
// Requête directe avec fetch
const response = await fetch('http://localhost:8000/api/metrics/system')
const data = await response.json()
```

## 🔗 URLs importantes

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:8000
- **API Health** : http://localhost:8000/api/health
- **API Docs** : http://localhost:8000/api/docs
- **API Metrics** : http://localhost:8000/api/metrics/system

## 💡 Astuce

Pour voir toutes les requêtes API en temps réel :
1. Ouvrir la console du navigateur (F12)
2. Aller dans l'onglet "Network"
3. Filtrer par "Fetch/XHR"
4. Toutes les requêtes vers `/api/*` devraient apparaître

