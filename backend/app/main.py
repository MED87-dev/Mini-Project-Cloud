"""
Point d'entrée principal de l'application FastAPI
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import api_router

# Créer l'application FastAPI
app = FastAPI(
    title="Mini Project Cloud API",
    description="API pour la gestion et le monitoring de déploiements cloud",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Configuration CORS
# Autoriser toutes les origines en développement pour éviter les problèmes CORS
# En production, utiliser la liste spécifique
cors_origins = ["*"] if settings.DEBUG else settings.CORS_ORIGINS

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Inclure les routes API
app.include_router(api_router, prefix="/api")


# Endpoint racine
@app.get("/")
async def root():
    return {
        "message": "Bienvenue sur l'API Mini Project Cloud",
        "version": "1.0.0",
        "docs": "/api/docs"
    }


# Endpoint health check
@app.get("/health")
async def health_check():
    """Vérification de santé de l'API"""
    return {"status": "healthy", "service": "cloud-api"}
