# 🔧 Résolution de l'erreur SQLAlchemy e3q8

## ❌ Erreur : SQLAlchemy e3q8

Cette erreur indique un problème de connexion à la base de données PostgreSQL.

## 🔍 Causes possibles

1. **PostgreSQL n'est pas démarré**
2. **La base de données n'existe pas**
3. **Les credentials sont incorrects**
4. **Le port PostgreSQL est incorrect**

## ✅ Solutions

### Solution 1 : Démarrer PostgreSQL

#### Avec Docker :
```powershell
docker run -d --name postgres-cloud -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=cloud_db -p 5432:5432 postgres:14
```

#### Avec Docker Compose :
```powershell
cd C:\Users\hp\Desktop\Mini-Project-Cloud
docker-compose up -d postgres
```

### Solution 2 : Créer la base de données

Si PostgreSQL est démarré mais la base n'existe pas :

```powershell
# Se connecter à PostgreSQL
psql -U postgres -h localhost

# Créer la base de données
CREATE DATABASE cloud_db;

# Quitter
\q
```

### Solution 3 : Initialiser les tables

```powershell
cd C:\Users\hp\Desktop\Mini-Project-Cloud\backend
.\venv\Scripts\Activate.ps1
python -c "from app.core.init_db import init_db; init_db()"
```

OU utiliser les scripts SQL :

```powershell
psql -U postgres -d cloud_db -f ..\database\init.sql
psql -U postgres -d cloud_db -f ..\database\schema.sql
```

### Solution 4 : Vérifier la configuration

Vérifier que `DATABASE_URL` dans `backend/app/core/config.py` est correct :

```python
DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/cloud_db"
```

Format : `postgresql://user:password@host:port/database`

## 🧪 Test de connexion

### Test rapide :

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python test_connection.py
```

### Test manuel :

```python
from app.core.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    result = conn.execute(text("SELECT 1"))
    print("✅ Connexion réussie!")
```

## 📋 Checklist

- [ ] PostgreSQL est démarré
- [ ] La base de données `cloud_db` existe
- [ ] Les credentials sont corrects (postgres/postgres)
- [ ] Le port 5432 est accessible
- [ ] Les tables sont créées (utiliser schema.sql)

## 🚀 Démarrage complet

```powershell
# 1. Démarrer PostgreSQL
docker-compose up -d postgres

# 2. Attendre quelques secondes

# 3. Initialiser la base de données
psql -U postgres -d cloud_db -f database\schema.sql

# 4. Démarrer le backend
cd backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload
```

## 💡 Note importante

L'endpoint `/api/metrics/system` **ne nécessite pas** la base de données (il retourne des données simulées). 

Les endpoints qui nécessitent la base de données :
- `/api/instances` - Requiert la table `cloud_instances`
- `/api/deployments` - Requiert la table `deployment_history`
- `/api/metrics` (sans /system) - Requiert la table `monitoring_metrics`

