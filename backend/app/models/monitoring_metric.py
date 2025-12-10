"""
Modèle pour les métriques de monitoring
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class MonitoringMetric(Base):
    """Modèle SQLAlchemy pour les métriques de monitoring"""
    __tablename__ = "monitoring_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    instance_id = Column(Integer, ForeignKey("cloud_instances.id"), nullable=True)
    metric_type = Column(String(50), nullable=False)  # cpu, memory, network, storage
    value = Column(Float, nullable=False)
    unit = Column(String(20), default="percent")  # percent, bytes, mbps
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Relation optionnelle avec CloudInstance
    instance = relationship("CloudInstance", backref="metrics")
    
    def __repr__(self):
        return f"<MonitoringMetric(id={self.id}, type='{self.metric_type}', value={self.value})>"

