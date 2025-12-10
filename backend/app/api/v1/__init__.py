"""
Router principal pour toutes les routes API v1

Routes disponibles :
- GET    /api/health                    - Vérification de santé de l'API
- GET    /api/health/db                  - Vérification de santé de la base de données
- GET    /api/metrics                   - Liste des métriques de monitoring
- GET    /api/metrics/system            - Métriques système simulées (CPU, RAM, Stockage, Réseau)
- GET    /api/metrics/simulate          - Générer des métriques simulées
- GET    /api/instances                 - Liste de toutes les instances cloud
- POST   /api/instances                 - Créer une nouvelle instance cloud
- GET    /api/instances/{id}            - Détails d'une instance spécifique
- PATCH  /api/instances/{id}            - Mettre à jour une instance
- POST   /api/instances/{id}/stop       - Arrêter une instance
- POST   /api/instances/{id}/start      - Démarrer une instance
- DELETE /api/instances/{id}            - Supprimer une instance
- GET    /api/deployments               - Liste de tous les déploiements
- POST   /api/deployments               - Créer un nouveau déploiement
- GET    /api/deployments/{id}          - Détails d'un déploiement spécifique
- DELETE /api/deployments/{id}          - Supprimer un déploiement

Documentation :
- Swagger UI : http://localhost:8000/api/docs
- ReDoc : http://localhost:8000/api/redoc
"""
from fastapi import APIRouter
from app.api.v1 import health, metrics, deployments, instances

api_router = APIRouter()

# Inclure tous les routers
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(metrics.router, prefix="/metrics", tags=["Metrics"])
api_router.include_router(deployments.router, prefix="/deployments", tags=["Deployments"])
api_router.include_router(instances.router, prefix="/instances", tags=["Instances"])
