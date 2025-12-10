"""
Routes pour la gestion des déploiements
"""
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from datetime import datetime, timezone
from app.core.database import get_db
from app.models.deployment_history import DeploymentHistory, DeploymentStatus
from app.schemas.deployment_history import DeploymentCreate, DeploymentResponse

router = APIRouter()


@router.get("", response_model=List[DeploymentResponse])
async def get_deployments(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """
    Récupérer la liste de tous les déploiements
    """
    try:
        deployments = db.query(DeploymentHistory)\
            .order_by(desc(DeploymentHistory.started_at))\
            .offset(skip)\
            .limit(limit)\
            .all()
        
        # Convertir les strings en enums pour Pydantic
        for deployment in deployments:
            if isinstance(deployment.status, str):
                deployment.status = DeploymentStatus(deployment.status)
        
        return deployments
    except Exception as e:
        db.rollback()
        error_msg = str(e)
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
                detail=f"Erreur lors de la récupération des déploiements: {error_msg}"
            )


@router.post("", response_model=DeploymentResponse, status_code=status.HTTP_201_CREATED)
async def create_deployment(
    deployment: DeploymentCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Créer un nouveau déploiement
    """
    try:
        # Vérifier si un déploiement avec le même nom existe déjà
        existing_deployment = db.query(DeploymentHistory).filter(
            DeploymentHistory.deployment_name == deployment.deployment_name
        ).first()
        
        if existing_deployment:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Un déploiement avec le nom '{deployment.deployment_name}' existe déjà. Veuillez choisir un nom unique."
            )
        
        db_deployment = DeploymentHistory(
            deployment_name=deployment.deployment_name,
            provider=deployment.provider,
            region=deployment.region,
            instance_count=deployment.instance_count,
            configuration=deployment.configuration,
            status=DeploymentStatus.PENDING.value
        )
        
        db.add(db_deployment)
        db.commit()
        db.refresh(db_deployment)
        
        # Note: Dans un vrai projet, le processus de déploiement serait géré
        # par une tâche en arrière-plan (Celery, RQ, etc.)
        # Pour la démonstration, on simule un déploiement en arrière-plan
        # Ne pas bloquer la réponse HTTP
        print(f"🚀 Démarrage de la simulation du déploiement {db_deployment.id} en arrière-plan...")
        
        # Utiliser threading sans daemon pour garantir l'exécution
        import threading
        thread = threading.Thread(target=simulate_deployment_sync, args=(db_deployment.id,), daemon=False)
        thread.start()
        print(f"✅ Thread démarré pour le déploiement {db_deployment.id} (non-daemon)")
        
        # Aussi utiliser BackgroundTasks comme backup
        background_tasks.add_task(simulate_deployment_sync, db_deployment.id)
        
        # Convertir les strings en enums pour la réponse Pydantic
        if isinstance(db_deployment.status, str):
            db_deployment.status = DeploymentStatus(db_deployment.status)
        
        return db_deployment
    except HTTPException:
        # Re-raise les HTTPException (comme les erreurs de validation)
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        error_msg = str(e)
        import traceback
        print(f"Erreur complète lors de la création du déploiement: {traceback.format_exc()}")
        
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
                detail=f"Erreur lors de la création du déploiement: {error_msg}"
            )


def simulate_deployment_sync(deployment_id: int):
    """
    Simuler un processus de déploiement (fonction helper)
    Note: Dans un vrai projet, utiliser une tâche en arrière-plan (Celery, RQ, etc.)
    Cette fonction est exécutée en arrière-plan après la création du déploiement
    """
    import time
    from app.core.database import SessionLocal
    
    print(f"⏳ [THREAD] Simulation du déploiement {deployment_id} démarrée...")
    
    # Créer une nouvelle session pour la tâche en arrière-plan
    task_db = SessionLocal()
    try:
        # Simuler le temps de déploiement (2 secondes)
        print(f"⏳ [THREAD] Attente de 2 secondes pour le déploiement {deployment_id}...")
        time.sleep(2)
        
        deployment = task_db.query(DeploymentHistory).filter(DeploymentHistory.id == deployment_id).first()
        if not deployment:
            print(f"⚠️ [THREAD] Déploiement {deployment_id} non trouvé dans la base de données")
            return
        
        print(f"📝 [THREAD] Mise à jour du statut du déploiement {deployment_id}...")
        
        # Toujours simuler un succès pour la démonstration
        # (Dans un vrai projet, cela dépendrait du résultat réel du déploiement)
        new_status = DeploymentStatus.SUCCESS.value
        old_status = deployment.status
        deployment.status = new_status
        # Utiliser datetime.now(timezone.utc) pour être compatible avec les datetimes timezone-aware de la DB
        deployment.completed_at = datetime.now(timezone.utc)
        deployment.error_message = None  # Pas d'erreur en cas de succès
        
        # Calculer la durée (les deux datetimes sont maintenant timezone-aware)
        duration = (deployment.completed_at - deployment.started_at).total_seconds()
        deployment.duration_seconds = int(duration)
        
        task_db.commit()
        print(f"✅ [THREAD] Déploiement {deployment_id} mis à jour: {old_status} → {new_status}")
        
    except Exception as e:
        # Logger l'erreur mais ne pas faire échouer la requête principale
        import traceback
        print(f"❌ [THREAD] Erreur lors de la simulation du déploiement {deployment_id}: {e}")
        print(traceback.format_exc())
        try:
            task_db.rollback()
        except:
            pass
    finally:
        task_db.close()
        print(f"🔒 [THREAD] Session fermée pour le déploiement {deployment_id}")


@router.get("/{deployment_id}", response_model=DeploymentResponse)
async def get_deployment(
    deployment_id: int,
    db: Session = Depends(get_db)
):
    """
    Récupérer les détails d'un déploiement spécifique
    """
    deployment = db.query(DeploymentHistory).filter(DeploymentHistory.id == deployment_id).first()
    
    if not deployment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Déploiement avec l'ID {deployment_id} non trouvé"
        )
    
    # Convertir les strings en enums pour la réponse Pydantic
    if isinstance(deployment.status, str):
        deployment.status = DeploymentStatus(deployment.status)
    
    return deployment


@router.post("/{deployment_id}/simulate", response_model=DeploymentResponse)
async def simulate_existing_deployment(
    deployment_id: int,
    db: Session = Depends(get_db)
):
    """
    Forcer la simulation d'un déploiement existant (utile pour les déploiements restés en pending)
    """
    deployment = db.query(DeploymentHistory).filter(DeploymentHistory.id == deployment_id).first()
    
    if not deployment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Déploiement avec l'ID {deployment_id} non trouvé"
        )
    
    if deployment.status not in [DeploymentStatus.PENDING.value, DeploymentStatus.IN_PROGRESS.value]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Le déploiement {deployment_id} n'est pas en attente (statut actuel: {deployment.status})"
        )
    
    # Lancer la simulation en arrière-plan
    import threading
    thread = threading.Thread(target=simulate_deployment_sync, args=(deployment_id,), daemon=True)
    thread.start()
    
    # Convertir les strings en enums pour la réponse Pydantic
    if isinstance(deployment.status, str):
        deployment.status = DeploymentStatus(deployment.status)
    
    return deployment


@router.delete("/{deployment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_deployment(
    deployment_id: int,
    db: Session = Depends(get_db)
):
    """
    Supprimer un déploiement
    """
    deployment = db.query(DeploymentHistory).filter(DeploymentHistory.id == deployment_id).first()
    
    if not deployment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Déploiement avec l'ID {deployment_id} non trouvé"
        )
    
    db.delete(deployment)
    db.commit()
    
    return None

