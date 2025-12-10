"""
Routes pour les métriques de monitoring
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from datetime import datetime, timedelta
import random
from app.core.database import get_db
from app.models.monitoring_metric import MonitoringMetric
from app.schemas.monitoring_metric import MonitoringMetricResponse

router = APIRouter()


@router.get("", response_model=List[MonitoringMetricResponse])
async def get_metrics(
    db: Session = Depends(get_db),
    metric_type: Optional[str] = Query(None, description="Type de métrique (cpu, memory, network, storage)"),
    instance_id: Optional[int] = Query(None, description="ID de l'instance"),
    limit: int = Query(100, ge=1, le=1000)
):
    """
    Récupérer les métriques de monitoring
    """
    query = db.query(MonitoringMetric)
    
    if metric_type:
        query = query.filter(MonitoringMetric.metric_type == metric_type)
    
    if instance_id:
        query = query.filter(MonitoringMetric.instance_id == instance_id)
    
    metrics = query.order_by(desc(MonitoringMetric.timestamp)).limit(limit).all()
    return metrics


@router.get("/simulate")
async def simulate_metrics(db: Session = Depends(get_db)):
    """
    Générer des métriques simulées pour la démonstration
    """
    metric_types = ["cpu", "memory", "network", "storage"]
    
    # Générer des métriques pour chaque type
    for metric_type in metric_types:
        if metric_type == "cpu":
            value = random.uniform(20, 80)
            unit = "percent"
        elif metric_type == "memory":
            value = random.uniform(30, 70)
            unit = "percent"
        elif metric_type == "network":
            value = random.uniform(10, 100)
            unit = "mbps"
        else:  # storage
            value = random.uniform(40, 90)
            unit = "percent"
        
        metric = MonitoringMetric(
            metric_type=metric_type,
            value=round(value, 2),
            unit=unit
        )
        db.add(metric)
    
    db.commit()
    return {"message": "Métriques simulées créées avec succès"}


@router.get("/system")
async def get_system_metrics():
    """
    Récupérer des métriques système simulées (pour démonstration)
    """
    return {
        "cpu": {
            "usage_percent": round(random.uniform(20, 80), 2),
            "cores": 4,
            "load_average": round(random.uniform(0.5, 2.5), 2)
        },
        "memory": {
            "usage_percent": round(random.uniform(30, 70), 2),
            "total_gb": 16,
            "used_gb": round(random.uniform(5, 11), 2),
            "available_gb": round(random.uniform(5, 11), 2)
        },
        "storage": {
            "usage_percent": round(random.uniform(40, 90), 2),
            "total_gb": 500,
            "used_gb": round(random.uniform(200, 450), 2),
            "available_gb": round(random.uniform(50, 300), 2)
        },
        "network": {
            "inbound_mbps": round(random.uniform(10, 100), 2),
            "outbound_mbps": round(random.uniform(5, 50), 2),
            "packets_sent": random.randint(1000, 10000),
            "packets_received": random.randint(1000, 10000)
        },
        "timestamp": datetime.now().isoformat()
    }

