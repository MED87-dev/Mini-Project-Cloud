# Mini-Project-Cloud

Projet de déploiement cloud avec React, FastAPI et PostgreSQL.

## 🚀 Structure du projet

```
Mini-Project-Cloud/
├── frontend/          # Application React + TypeScript + Tailwind
├── backend/           # API FastAPI
├── database/          # Scripts et configurations PostgreSQL
├── deployment/        # Scripts de déploiement cloud
├── nginx/             # Configuration reverse proxy
└── docker-compose.yml # Développement local
```

## 📋 Prérequis

- Node.js 18+
- Python 3.10+
- Docker et Docker Compose
- PostgreSQL 14+ (ou via Docker)

## 📤 Uploader le Projet sur GitHub

Pour uploader ce projet sur GitHub, suivez le guide complet dans [`GUIDE_UPLOAD.md`](GUIDE_UPLOAD.md)

**Commandes rapides :**
```bash
git init
git add .
git commit -m "Initial commit: Mini Project Cloud"
git remote add origin https://github.com/USERNAME/Mini-Project-Cloud.git
git branch -M main
git push -u origin main
```

## 🛠️ Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd Mini-Project-Cloud
```

### 2. Configuration de l'environnement

```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

### 3. Lancer avec Docker Compose (recommandé)

```bash
docker-compose up -d
```

Cela lancera :
- PostgreSQL sur le port 5432
- Backend FastAPI sur http://localhost:8000
- Frontend React sur http://localhost:5173

### 4. Démarrage manuel (si pas Docker)

#### Backend (Terminal 1) :

**Windows :**
```powershell
cd backend
start_backend.bat
```

**Linux/Mac :**
```bash
cd backend
chmod +x start_backend.sh
./start_backend.sh
```

**OU manuellement :**
```powershell
cd backend
.\venv\Scripts\Activate.ps1  # Windows
# source venv/bin/activate   # Linux/Mac
uvicorn app.main:app --reload
```

#### Frontend (Terminal 2) :

```powershell
cd frontend
npm install
npm run dev
```

### 4. Installation manuelle

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Base de données

```bash
# Avec Docker
docker run -d \
  --name postgres-cloud \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=cloud_db \
  -p 5432:5432 \
  postgres:14

# Initialiser la base de données
cd database
psql -U postgres -d cloud_db -f init.sql
psql -U postgres -d cloud_db -f schema.sql
```

## 📚 Documentation API

Une fois le backend lancé, accédez à :
- Swagger UI : http://localhost:8000/docs
- ReDoc : http://localhost:8000/redoc

## 🎯 Fonctionnalités

### Frontend
- ✅ Page d'accueil avec présentation
- ✅ Tableau de bord de monitoring cloud
- ✅ Création de VM avec formulaire
- ✅ Historique des déploiements
- ✅ Mode clair/sombre
- ✅ Internationalisation (FR/EN)
- ✅ Design responsive

### Backend
- ✅ API REST complète
- ✅ Connexion PostgreSQL
- ✅ Authentification JWT
- ✅ Métriques système simulées
- ✅ Gestion des déploiements
- ✅ Documentation OpenAPI

## 🌐 Déploiement Cloud

### AWS
Voir `deployment/aws/` pour les scripts Terraform et CloudFormation.

### Azure
Voir `deployment/azure/` pour les scripts ARM.

### GCP
Voir `deployment/gcp/` pour les scripts Terraform.

## 📝 Endpoints API

- `GET /api/health` - Santé de l'API
- `GET /api/metrics` - Métriques système
- `GET /api/deployments` - Liste des déploiements
- `POST /api/deployments` - Créer un déploiement
- `GET /api/deployments/{id}` - Détails d'un déploiement
- `DELETE /api/deployments/{id}` - Supprimer un déploiement
- `GET /api/instances` - Liste des instances cloud
- `POST /api/instances` - Créer une instance

## 🧪 Tests

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

## 📄 Licence

MIT

## 👥 Auteurs

Mini-Project-Cloud Team
