"""
Configuration de la connexion à la base de données PostgreSQL
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Créer le moteur SQLAlchemy avec gestion d'erreurs améliorée
try:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,  # Vérifie la connexion avant utilisation
        pool_size=10,
        max_overflow=20,
        echo=False,  # Mettre à True pour voir les requêtes SQL
        connect_args={
            "connect_timeout": 10,  # Timeout de connexion de 10 secondes
        }
    )
    logger.info(f"✅ Moteur SQLAlchemy créé avec succès")
except Exception as e:
    logger.error(f"❌ Erreur lors de la création du moteur SQLAlchemy: {e}")
    raise

# Session locale
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base pour les modèles
Base = declarative_base()


def get_db():
    """
    Dépendance pour obtenir une session de base de données
    """
    from sqlalchemy import text
    
    db = SessionLocal()
    try:
        # Tester la connexion avant de retourner la session
        db.execute(text("SELECT 1"))
        yield db
    except SQLAlchemyError as e:
        logger.error(f"❌ Erreur de connexion à la base de données: {e}")
        db.rollback()
        raise
    except Exception as e:
        logger.error(f"❌ Erreur inattendue: {e}")
        db.rollback()
        raise
    finally:
        db.close()

