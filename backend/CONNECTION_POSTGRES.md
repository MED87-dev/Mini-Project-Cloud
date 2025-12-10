# Connexion PostgreSQL avec Python

## 📚 Connecteurs disponibles

Le projet utilise **deux approches** pour se connecter à PostgreSQL :

### 1. **psycopg2-binary** (Connecteur direct)
- **Installation** : Déjà dans `requirements.txt`
- **Usage** : Connexion directe à PostgreSQL
- **Avantage** : Rapide, natif

### 2. **SQLAlchemy** (ORM - Object-Relational Mapping)
- **Installation** : Déjà dans `requirements.txt`
- **Usage** : Utilisé dans le projet (recommandé)
- **Avantage** : Abstraction, migrations, modèles Python

## 🔌 Configuration actuelle

### Fichier : `backend/app/core/database.py`

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Créer le moteur SQLAlchemy
engine = create_engine(
    settings.DATABASE_URL,  # postgresql://user:password@host:port/database
    pool_pre_ping=True,     # Vérifie la connexion avant utilisation
    pool_size=10,          # Nombre de connexions dans le pool
    max_overflow=20,        # Connexions supplémentaires possibles
)
```

### URL de connexion

Format : `postgresql://user:password@host:port/database`

Exemple : `postgresql://postgres:postgres@localhost:5432/cloud_db`

## 💻 Exemples d'utilisation

### Exemple 1 : Connexion directe avec psycopg2

```python
import psycopg2
from psycopg2 import sql

# Connexion
conn = psycopg2.connect(
    host="localhost",
    database="cloud_db",
    user="postgres",
    password="postgres",
    port=5432
)

# Créer un curseur
cur = conn.cursor()

# Exécuter une requête
cur.execute("SELECT * FROM cloud_instances LIMIT 5")
rows = cur.fetchall()

# Afficher les résultats
for row in rows:
    print(row)

# Fermer
cur.close()
conn.close()
```

### Exemple 2 : Avec SQLAlchemy (utilisé dans le projet)

```python
from app.core.database import SessionLocal
from app.models.cloud_instance import CloudInstance

# Obtenir une session
db = SessionLocal()

# Requête
instances = db.query(CloudInstance).all()

# Afficher
for instance in instances:
    print(f"{instance.name} - {instance.provider}")

# Fermer
db.close()
```

### Exemple 3 : Dans une route FastAPI

```python
from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.cloud_instance import CloudInstance

@app.get("/instances")
def get_instances(db: Session = Depends(get_db)):
    instances = db.query(CloudInstance).all()
    return instances
```

## 🔧 Installation

Les dépendances sont déjà dans `requirements.txt` :

```txt
psycopg2-binary==2.9.9  # Connecteur PostgreSQL
sqlalchemy==2.0.23       # ORM
```

Pour installer :

```powershell
# Activer le venv
.\venv\Scripts\Activate.ps1

# Installer
pip install -r requirements.txt
```

## ✅ Vérifier la connexion

### Test rapide avec Python

```python
# test_connection.py
from app.core.database import engine
from sqlalchemy import text

# Tester la connexion
with engine.connect() as conn:
    result = conn.execute(text("SELECT 1"))
    print("✅ Connexion réussie!")
    print(result.fetchone())
```

### Test avec psql (ligne de commande)

```bash
psql -h localhost -U postgres -d cloud_db
```

## 🐛 Dépannage

### Erreur : "ModuleNotFoundError: No module named 'psycopg2'"

```powershell
pip install psycopg2-binary
```

### Erreur : "connection refused"

1. Vérifier que PostgreSQL est démarré
2. Vérifier le port (5432 par défaut)
3. Vérifier les credentials dans `.env`

### Erreur : "database does not exist"

```sql
CREATE DATABASE cloud_db;
```

## 📝 Variables d'environnement

Créer un fichier `.env` à la racine du projet :

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cloud_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=cloud_db
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

## 🔗 Ressources

- [Documentation psycopg2](https://www.psycopg.org/docs/)
- [Documentation SQLAlchemy](https://docs.sqlalchemy.org/)
- [FastAPI + SQLAlchemy](https://fastapi.tiangolo.com/tutorial/sql-databases/)

