"""
Modèle pour les instances cloud (VM, conteneurs)
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Enum
from sqlalchemy.sql import func
import enum
from app.core.database import Base


class InstanceType(str, enum.Enum):
    """Types d'instances cloud"""
    VM = "vm"
    CONTAINER = "container"
    SERVERLESS = "serverless"


class InstanceStatus(str, enum.Enum):
    """Statuts des instances"""
    PENDING = "pending"
    RUNNING = "running"
    STOPPED = "stopped"
    TERMINATED = "terminated"


class CloudInstance(Base):
    """Modèle SQLAlchemy pour les instances cloud"""
    __tablename__ = "cloud_instances"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    # Utiliser String directement pour éviter les problèmes de contrainte CHECK
    # La validation est gérée par Pydantic
    instance_type = Column(String(20), nullable=False)
    status = Column(String(20), default=InstanceStatus.PENDING.value)
    provider = Column(String(50), nullable=False)  # aws, azure, gcp
    region = Column(String(50), nullable=False)
    cpu_cores = Column(Integer, default=1)
    memory_gb = Column(Float, default=1.0)
    storage_gb = Column(Float, default=10.0)
    cost_per_hour = Column(Float, default=0.0)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    is_active = Column(Boolean, default=True)
    
    def __repr__(self):
        return f"<CloudInstance(id={self.id}, name='{self.name}', type='{self.instance_type}')>"

