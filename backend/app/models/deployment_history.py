"""
Modèle pour l'historique des déploiements
"""
from sqlalchemy import Column, Integer, String, DateTime, Text, Enum
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class DeploymentStatus(str, enum.Enum):
    """Statuts des déploiements"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    SUCCESS = "success"
    FAILED = "failed"
    ROLLED_BACK = "rolled_back"


class DeploymentHistory(Base):
    """Modèle SQLAlchemy pour l'historique des déploiements"""
    __tablename__ = "deployment_history"
    
    id = Column(Integer, primary_key=True, index=True)
    deployment_name = Column(String(100), nullable=False, index=True)
    provider = Column(String(50), nullable=False)  # aws, azure, gcp
    region = Column(String(50), nullable=False)
    # Utiliser String directement pour éviter les problèmes de contrainte CHECK
    # La validation est gérée par Pydantic
    status = Column(String(20), default=DeploymentStatus.PENDING.value)
    instance_count = Column(Integer, default=1)
    configuration = Column(Text, nullable=True)  # JSON string
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    
    def __repr__(self):
        return f"<DeploymentHistory(id={self.id}, name='{self.deployment_name}', status='{self.status}')>"

