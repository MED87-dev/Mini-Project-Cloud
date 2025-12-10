"""
Configuration de l'application avec variables d'environnement
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Paramètres de l'application"""
    
    # Application
    APP_NAME: str = "Mini Project Cloud API"
    DEBUG: bool = True
    
    # Base de données
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/cloud_db"
    
    # Sécurité
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS - Autoriser toutes les origines en développement
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:5174",  # Port alternatif pour Vite
        "http://localhost:8080",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://localhost:*",  # Autoriser tous les ports localhost
        "http://127.0.0.1:*",   # Autoriser tous les ports 127.0.0.1
    ]
    
    # Cloud Providers
    AWS_REGION: str = "us-east-1"
    AZURE_SUBSCRIPTION_ID: str = ""
    GCP_PROJECT_ID: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

