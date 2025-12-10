"""
Schémas Pydantic pour DeploymentHistory
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.deployment_history import DeploymentStatus


class DeploymentCreate(BaseModel):
    """Schéma pour créer un déploiement"""
    deployment_name: str = Field(..., min_length=1, max_length=100)
    provider: str = Field(..., min_length=1, max_length=50)
    region: str = Field(..., min_length=1, max_length=50)
    instance_count: int = Field(default=1, ge=1)
    configuration: Optional[str] = None


class DeploymentResponse(BaseModel):
    """Schéma de réponse pour DeploymentHistory"""
    id: int
    deployment_name: str
    provider: str
    region: str
    status: DeploymentStatus
    instance_count: int
    configuration: Optional[str] = None
    error_message: Optional[str] = None
    started_at: datetime
    completed_at: Optional[datetime] = None
    duration_seconds: Optional[int] = None
    
    class Config:
        from_attributes = True

