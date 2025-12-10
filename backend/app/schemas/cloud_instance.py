"""
Schémas Pydantic pour CloudInstance
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.cloud_instance import InstanceType, InstanceStatus


class CloudInstanceBase(BaseModel):
    """Schéma de base pour CloudInstance"""
    name: str = Field(..., min_length=1, max_length=100)
    instance_type: InstanceType
    provider: str = Field(..., min_length=1, max_length=50)
    region: str = Field(..., min_length=1, max_length=50)
    cpu_cores: int = Field(default=1, ge=1)
    memory_gb: float = Field(default=1.0, ge=0.1)
    storage_gb: float = Field(default=10.0, ge=1.0)
    cost_per_hour: float = Field(default=0.0, ge=0.0)


class CloudInstanceCreate(CloudInstanceBase):
    """Schéma pour créer une instance"""
    pass


class CloudInstanceUpdate(BaseModel):
    """Schéma pour mettre à jour une instance"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    status: Optional[InstanceStatus] = None
    cpu_cores: Optional[int] = Field(None, ge=1)
    memory_gb: Optional[float] = Field(None, ge=0.1)
    storage_gb: Optional[float] = Field(None, ge=1.0)
    cost_per_hour: Optional[float] = Field(None, ge=0.0)
    ip_address: Optional[str] = None
    is_active: Optional[bool] = None


class CloudInstanceResponse(CloudInstanceBase):
    """Schéma de réponse pour CloudInstance"""
    id: int
    status: InstanceStatus
    ip_address: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_active: bool
    
    class Config:
        from_attributes = True

