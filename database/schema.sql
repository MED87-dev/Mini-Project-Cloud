-- Schéma de la base de données pour le projet cloud
-- Ce script crée toutes les tables nécessaires

-- Table des instances cloud
CREATE TABLE IF NOT EXISTS cloud_instances (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    instance_type VARCHAR(20) NOT NULL CHECK (instance_type IN ('vm', 'container', 'serverless')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'stopped', 'terminated')),
    provider VARCHAR(50) NOT NULL,
    region VARCHAR(50) NOT NULL,
    cpu_cores INTEGER NOT NULL DEFAULT 1,
    memory_gb FLOAT NOT NULL DEFAULT 1.0,
    storage_gb FLOAT NOT NULL DEFAULT 10.0,
    cost_per_hour FLOAT NOT NULL DEFAULT 0.0,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_cloud_instances_name ON cloud_instances(name);
CREATE INDEX IF NOT EXISTS idx_cloud_instances_provider ON cloud_instances(provider);
CREATE INDEX IF NOT EXISTS idx_cloud_instances_status ON cloud_instances(status);

-- Table des métriques de monitoring
CREATE TABLE IF NOT EXISTS monitoring_metrics (
    id SERIAL PRIMARY KEY,
    instance_id INTEGER REFERENCES cloud_instances(id) ON DELETE SET NULL,
    metric_type VARCHAR(50) NOT NULL,
    value FLOAT NOT NULL,
    unit VARCHAR(20) NOT NULL DEFAULT 'percent',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les métriques
CREATE INDEX IF NOT EXISTS idx_monitoring_metrics_type ON monitoring_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_monitoring_metrics_instance ON monitoring_metrics(instance_id);
CREATE INDEX IF NOT EXISTS idx_monitoring_metrics_timestamp ON monitoring_metrics(timestamp);

-- Table de l'historique des déploiements
CREATE TABLE IF NOT EXISTS deployment_history (
    id SERIAL PRIMARY KEY,
    deployment_name VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    region VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'success', 'failed', 'rolled_back')),
    instance_count INTEGER NOT NULL DEFAULT 1,
    configuration TEXT,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER
);

-- Index pour les déploiements
CREATE INDEX IF NOT EXISTS idx_deployment_history_name ON deployment_history(deployment_name);
CREATE INDEX IF NOT EXISTS idx_deployment_history_status ON deployment_history(status);
CREATE INDEX IF NOT EXISTS idx_deployment_history_started ON deployment_history(started_at);

-- Insérer des données de démonstration
INSERT INTO cloud_instances (name, instance_type, status, provider, region, cpu_cores, memory_gb, storage_gb, cost_per_hour, ip_address)
VALUES
    ('web-server-01', 'vm', 'running', 'aws', 'us-east-1', 2, 4.0, 50.0, 0.10, '10.0.1.10'),
    ('api-server-01', 'vm', 'running', 'aws', 'us-east-1', 4, 8.0, 100.0, 0.20, '10.0.1.11'),
    ('db-server-01', 'vm', 'running', 'azure', 'eastus', 8, 16.0, 500.0, 0.50, '10.0.2.10'),
    ('cache-server-01', 'container', 'running', 'gcp', 'us-central1', 2, 4.0, 20.0, 0.08, '10.0.3.10')
ON CONFLICT DO NOTHING;

-- Insérer des métriques de démonstration
INSERT INTO monitoring_metrics (instance_id, metric_type, value, unit)
VALUES
    (1, 'cpu', 45.5, 'percent'),
    (1, 'memory', 62.3, 'percent'),
    (1, 'network', 25.8, 'mbps'),
    (2, 'cpu', 78.2, 'percent'),
    (2, 'memory', 55.1, 'percent'),
    (2, 'network', 45.3, 'mbps'),
    (3, 'cpu', 35.0, 'percent'),
    (3, 'memory', 48.7, 'percent'),
    (3, 'storage', 67.5, 'percent')
ON CONFLICT DO NOTHING;

-- Insérer des déploiements de démonstration
INSERT INTO deployment_history (deployment_name, provider, region, status, instance_count, duration_seconds)
VALUES
    ('Production Deployment v1.0', 'aws', 'us-east-1', 'success', 3, 120),
    ('Staging Deployment v0.9', 'azure', 'eastus', 'success', 2, 95),
    ('Development Setup', 'gcp', 'us-central1', 'success', 1, 60),
    ('Failed Deployment Test', 'aws', 'us-west-2', 'failed', 2, 45)
ON CONFLICT DO NOTHING;

-- Message de confirmation
SELECT 'Schéma de base de données créé avec succès' AS message;

