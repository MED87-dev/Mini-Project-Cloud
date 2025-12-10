"""
Routes pour la vérification de santé de l'API
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from sqlalchemy import text

router = APIRouter()


@router.get("")
async def health_check():
    """Vérification de santé basique"""
    return {
        "status": "healthy",
        "service": "cloud-api",
        "version": "1.0.0"
    }


@router.get("/db")
async def database_health(db: Session = Depends(get_db)):
    """Vérification de santé de la base de données"""
    try:
        # Test de connexion à la base de données
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }

