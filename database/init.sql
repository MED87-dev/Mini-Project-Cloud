-- Script d'initialisation de la base de données
-- Ce script est exécuté automatiquement lors de la création du conteneur PostgreSQL

-- Créer la base de données si elle n'existe pas
SELECT 'CREATE DATABASE cloud_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'cloud_db')\gexec

-- Se connecter à la base de données
\c cloud_db

-- Créer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Message de confirmation
SELECT 'Base de données cloud_db initialisée avec succès' AS message;

