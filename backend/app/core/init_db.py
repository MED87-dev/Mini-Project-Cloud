"""
Script pour initialiser la base de données avec les tables
"""
from app.core.database import engine, Base
from app.models import CloudInstance, MonitoringMetric, DeploymentHistory


def init_db():
    """Créer toutes les tables dans la base de données"""
    Base.metadata.create_all(bind=engine)
    print("✅ Base de données initialisée avec succès")


if __name__ == "__main__":
    init_db()

