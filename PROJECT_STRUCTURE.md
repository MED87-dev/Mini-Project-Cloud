# Structure du Projet Mini-Project-Cloud

## 📁 Structure complète

```
Mini-Project-Cloud/
├── backend/                    # Backend FastAPI
│   ├── app/
│   │   ├── api/               # Routes API
│   │   │   └── v1/
│   │   │       ├── health.py
│   │   │       ├── metrics.py
│   │   │       ├── deployments.py
│   │   │       └── instances.py
│   │   ├── core/              # Configuration
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── init_db.py
│   │   ├── models/            # Modèles SQLAlchemy
│   │   │   ├── cloud_instance.py
│   │   │   ├── monitoring_metric.py
│   │   │   └── deployment_history.py
│   │   ├── schemas/           # Schémas Pydantic
│   │   │   ├── cloud_instance.py
│   │   │   ├── monitoring_metric.py
│   │   │   └── deployment_history.py
│   │   └── main.py            # Point d'entrée FastAPI
│   ├── Dockerfile
│   ├── requirements.txt
│   └── alembic.ini
│
├── frontend/                   # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/        # Composants réutilisables
│   │   │   ├── Navbar.tsx
│   │   │   └── MetricCard.tsx
│   │   ├── pages/             # Pages de l'application
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CreateVM.tsx
│   │   │   ├── DeploymentHistory.tsx
│   │   │   └── Documentation.tsx
│   │   ├── services/          # Services API
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── database/                   # Scripts PostgreSQL
│   ├── init.sql
│   ├── schema.sql
│   └── docker-compose.yml
│
├── deployment/                 # Scripts de déploiement cloud
│   ├── aws/
│   │   ├── README.md
│   │   ├── terraform/
│   │   │   ├── main.tf
│   │   │   └── variables.tf
│   │   └── scripts/
│   │       └── deploy.sh
│   ├── azure/
│   │   └── README.md
│   └── gcp/
│       └── README.md
│
├── nginx/                      # Configuration Nginx
│   └── nginx.conf
│
├── docker-compose.yml          # Configuration Docker Compose
├── .gitignore
├── .env.example
├── README.md
├── requirements.txt
├── start.sh                    # Script de démarrage (Linux/Mac)
└── start.bat                   # Script de démarrage (Windows)
```

## 🚀 Démarrage rapide

### Option 1: Avec Docker Compose (Recommandé)

```bash
# Linux/Mac
chmod +x start.sh
./start.sh

# Windows
start.bat
```

### Option 2: Manuellement

```bash
# 1. Démarrer PostgreSQL
cd database
docker-compose up -d

# 2. Démarrer le backend
cd ../backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# 3. Démarrer le frontend (dans un autre terminal)
cd ../frontend
npm install
npm run dev
```

## 📋 Fonctionnalités

### Frontend
- ✅ Page d'accueil avec présentation
- ✅ Tableau de bord avec métriques en temps réel
- ✅ Création de VM avec formulaire
- ✅ Historique des déploiements
- ✅ Documentation complète
- ✅ Mode clair/sombre
- ✅ Design responsive

### Backend
- ✅ API REST complète
- ✅ Connexion PostgreSQL
- ✅ Modèles SQLAlchemy
- ✅ Validation Pydantic
- ✅ Documentation Swagger/OpenAPI
- ✅ CORS configuré
- ✅ Gestion d'erreurs

### Base de données
- ✅ Tables: cloud_instances, monitoring_metrics, deployment_history
- ✅ Données de démonstration incluses
- ✅ Scripts d'initialisation

## 🔗 URLs importantes

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/api/docs
- API Docs (ReDoc): http://localhost:8000/api/redoc
- PostgreSQL: localhost:5432

## 📚 Endpoints API

- `GET /api/health` - Vérification de santé
- `GET /api/metrics/system` - Métriques système
- `GET /api/instances` - Liste des instances
- `POST /api/instances` - Créer une instance
- `GET /api/deployments` - Liste des déploiements
- `POST /api/deployments` - Créer un déploiement

## 🌐 Déploiement Cloud

Voir les README dans `deployment/aws/`, `deployment/azure/`, et `deployment/gcp/` pour les instructions de déploiement sur chaque plateforme.

## 📝 Notes

- Les métriques sont simulées pour la démonstration
- Les déploiements sont simulés (dans un vrai projet, utiliser Celery/RQ)
- Les données de démonstration sont incluses dans schema.sql
- Le mode sombre est sauvegardé dans localStorage

