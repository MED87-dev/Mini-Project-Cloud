# Base de données PostgreSQL

Ce dossier contient les scripts SQL pour initialiser la base de données.

## Fichiers

- `init.sql` - Script d'initialisation de la base de données
- `schema.sql` - Schéma complet avec tables et données de démonstration

## Utilisation

La base de données est automatiquement initialisée lors du démarrage avec Docker Compose depuis la racine du projet :

```bash
# Depuis la racine du projet
docker-compose up -d
```

Les scripts SQL sont automatiquement exécutés lors de la première création du conteneur PostgreSQL.

## Utilisation standalone (sans Docker Compose principal)

Si vous voulez lancer uniquement PostgreSQL sans le reste de l'application :

### Option 1 : Avec docker-compose.yml dans ce dossier

```bash
# Depuis le dossier database
cd database
docker-compose up -d
```

### Option 2 : Avec docker run

```bash
# Depuis la racine du projet
docker run -d \
  --name cloud_postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=cloud_db \
  -p 5432:5432 \
  -v $(pwd)/database/init.sql:/docker-entrypoint-initdb.d/init.sql \
  -v $(pwd)/database/schema.sql:/docker-entrypoint-initdb.d/schema.sql \
  postgres:14
```

**Note :** Si vous utilisez le `docker-compose.yml` à la racine, il gère déjà PostgreSQL. Le fichier dans `database/` est utile si vous voulez lancer PostgreSQL indépendamment.

## Connexion

- **Host:** localhost
- **Port:** 5432
- **Database:** cloud_db
- **User:** postgres
- **Password:** postgres

## Connexion avec psql

```bash
psql -h localhost -U postgres -d cloud_db
```

