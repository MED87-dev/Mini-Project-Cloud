"""
Schémas Pydantic pour MonitoringMetric
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class MonitoringMetricResponse(BaseModel):
    """Schéma de réponse pour MonitoringMetric"""
    id: int
    instance_id: Optional[int] = None
    metric_type: str
    value: float
    unit: str
    timestamp: datetime
    
    class Config:
        from_attributes = True

