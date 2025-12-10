"""
Routes pour la gestion des instances cloud
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.cloud_instance import CloudInstance, InstanceStatus, InstanceType
from app.schemas.cloud_instance import (
    CloudInstanceCreate,
    CloudInstanceUpdate,
    CloudInstanceResponse
)

router = APIRouter()


@router.get("", response_model=List[CloudInstanceResponse])
async def get_instances(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    provider: str = None,
    status: InstanceStatus = None
):
    """
    Récupérer la liste de toutes les instances cloud actives
    """
    from sqlalchemy import desc
    
    query = db.query(CloudInstance).filter(CloudInstance.is_active == True)
    
    if provider:
        query = query.filter(CloudInstance.provider == provider)
    
    if status:
        # Convertir l'enum en valeur string pour la requête
        query = query.filter(CloudInstance.status == status.value)
    
    # Trier par date de création décroissante (plus récentes en premier)
    instances = query.order_by(desc(CloudInstance.created_at)).offset(skip).limit(limit).all()
    
    # Convertir les strings en enums pour Pydantic
    for instance in instances:
        if isinstance(instance.instance_type, str):
            instance.instance_type = InstanceType(instance.instance_type)
        if isinstance(instance.status, str):
            instance.status = InstanceStatus(instance.status)
    
    return instances


@router.post("", response_model=CloudInstanceResponse, status_code=status.HTTP_201_CREATED)
async def create_instance(
    instance: CloudInstanceCreate,
    db: Session = Depends(get_db)
):
    """
    Créer une nouvelle instance cloud
    """
    try:
        # Vérifier si une instance avec le même nom existe déjà (actives uniquement)
        existing_instance = db.query(CloudInstance).filter(
            CloudInstance.name == instance.name,
            CloudInstance.is_active == True
        ).first()
        
        if existing_instance:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Une instance avec le nom '{instance.name}' existe déjà. Veuillez choisir un nom unique."
            )
        
        # Convertir les enums en leurs valeurs string pour la base de données
        instance_type_value = instance.instance_type.value if isinstance(instance.instance_type, InstanceType) else str(instance.instance_type)
        
        db_instance = CloudInstance(
            name=instance.name,
            instance_type=instance_type_value,
            provider=instance.provider,
            region=instance.region,
            cpu_cores=instance.cpu_cores,
            memory_gb=instance.memory_gb,
            storage_gb=instance.storage_gb,
            cost_per_hour=instance.cost_per_hour,
            status=InstanceStatus.PENDING.value
        )
        
        db.add(db_instance)
        db.commit()
        db.refresh(db_instance)
        
        # Simuler l'attribution d'une IP (dans un vrai projet, ce serait via l'API du provider)
        import random
        db_instance.ip_address = f"10.0.{random.randint(1, 255)}.{random.randint(1, 255)}"
        db_instance.status = InstanceStatus.RUNNING.value
        db.commit()
        db.refresh(db_instance)
        
        # Convertir les strings en enums pour la réponse Pydantic
        if isinstance(db_instance.instance_type, str):
            db_instance.instance_type = InstanceType(db_instance.instance_type)
        if isinstance(db_instance.status, str):
            db_instance.status = InstanceStatus(db_instance.status)
        
        return db_instance
    except HTTPException:
        # Re-raise les HTTPException (comme le nom dupliqué)
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        error_msg = str(e)
        # Message d'erreur plus clair
        if "relation" in error_msg.lower() and "does not exist" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Les tables de la base de données n'existent pas. Veuillez initialiser la base de données avec schema.sql"
            )
        elif "could not connect" in error_msg.lower() or "connection refused" in error_msg.lower():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Impossible de se connecter à PostgreSQL. Vérifiez que le serveur est démarré."
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Erreur lors de la création de l'instance: {error_msg}"
            )


@router.get("/{instance_id}", response_model=CloudInstanceResponse)
async def get_instance(
    instance_id: int,
    db: Session = Depends(get_db)
):
    """
    Récupérer les détails d'une instance spécifique
    """
    instance = db.query(CloudInstance).filter(CloudInstance.id == instance_id).first()
    
    if not instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Instance avec l'ID {instance_id} non trouvée"
        )
    
    # Convertir les strings en enums pour la réponse Pydantic
    if isinstance(instance.instance_type, str):
        instance.instance_type = InstanceType(instance.instance_type)
    if isinstance(instance.status, str):
        instance.status = InstanceStatus(instance.status)
    
    return instance


@router.patch("/{instance_id}", response_model=CloudInstanceResponse)
async def update_instance(
    instance_id: int,
    instance_update: CloudInstanceUpdate,
    db: Session = Depends(get_db)
):
    """
    Mettre à jour une instance
    """
    instance = db.query(CloudInstance).filter(CloudInstance.id == instance_id).first()
    
    if not instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Instance avec l'ID {instance_id} non trouvée"
        )
    
    # Mettre à jour les champs fournis
    update_data = instance_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        # Convertir les enums en valeurs string pour la base de données
        if field == 'status' and isinstance(value, InstanceStatus):
            value = value.value
        setattr(instance, field, value)
    
    db.commit()
    db.refresh(instance)
    
    # Convertir les strings en enums pour la réponse Pydantic
    if isinstance(instance.instance_type, str):
        instance.instance_type = InstanceType(instance.instance_type)
    if isinstance(instance.status, str):
        instance.status = InstanceStatus(instance.status)
    
    return instance


@router.post("/{instance_id}/stop", response_model=CloudInstanceResponse)
async def stop_instance(
    instance_id: int,
    db: Session = Depends(get_db)
):
    """
    Arrêter une instance
    """
    instance = db.query(CloudInstance).filter(CloudInstance.id == instance_id).first()
    
    if not instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Instance avec l'ID {instance_id} non trouvée"
        )
    
    if not instance.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cette instance a été supprimée"
        )
    
    if instance.status == InstanceStatus.STOPPED.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cette instance est déjà arrêtée"
        )
    
    instance.status = InstanceStatus.STOPPED.value
    db.commit()
    db.refresh(instance)
    
    # Convertir les strings en enums pour la réponse Pydantic
    if isinstance(instance.instance_type, str):
        instance.instance_type = InstanceType(instance.instance_type)
    if isinstance(instance.status, str):
        instance.status = InstanceStatus(instance.status)
    
    return instance


@router.post("/{instance_id}/start", response_model=CloudInstanceResponse)
async def start_instance(
    instance_id: int,
    db: Session = Depends(get_db)
):
    """
    Démarrer une instance
    """
    instance = db.query(CloudInstance).filter(CloudInstance.id == instance_id).first()
    
    if not instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Instance avec l'ID {instance_id} non trouvée"
        )
    
    if not instance.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cette instance a été supprimée"
        )
    
    if instance.status == InstanceStatus.RUNNING.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cette instance est déjà en cours d'exécution"
        )
    
    instance.status = InstanceStatus.RUNNING.value
    db.commit()
    db.refresh(instance)
    
    # Convertir les strings en enums pour la réponse Pydantic
    if isinstance(instance.instance_type, str):
        instance.instance_type = InstanceType(instance.instance_type)
    if isinstance(instance.status, str):
        instance.status = InstanceStatus(instance.status)
    
    return instance


@router.delete("/{instance_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_instance(
    instance_id: int,
    db: Session = Depends(get_db)
):
    """
    Supprimer (désactiver) une instance
    """
    instance = db.query(CloudInstance).filter(CloudInstance.id == instance_id).first()
    
    if not instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Instance avec l'ID {instance_id} non trouvée"
        )
    
    # Soft delete
    instance.is_active = False
    instance.status = InstanceStatus.TERMINATED.value
    db.commit()
    
    return None

