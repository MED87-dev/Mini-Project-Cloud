# Déploiement sur AWS

## Prérequis

- Compte AWS avec accès IAM
- AWS CLI installé et configuré
- Terraform installé (optionnel)

## Méthode 1: Déploiement avec EC2

### 1. Créer une instance EC2

```bash
# Créer une instance Ubuntu 22.04 LTS
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.medium \
  --key-name your-key-name \
  --security-group-ids sg-xxxxxxxxx \
  --subnet-id subnet-xxxxxxxxx
```

### 2. Configurer les groupes de sécurité

Ouvrir les ports suivants:
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)
- 8000 (Backend API - optionnel)

### 3. Se connecter et installer Docker

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Installer Docker
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER
newgrp docker
```

### 4. Déployer l'application

```bash
# Cloner le repository
git clone <your-repo-url>
cd Mini-Project-Cloud

# Configurer les variables d'environnement
cp .env.example .env
nano .env

# Lancer avec Docker Compose
docker-compose up -d
```

## Méthode 2: Déploiement avec ECS (Elastic Container Service)

Voir les fichiers Terraform dans `terraform/` pour un déploiement automatisé.

## Méthode 3: Déploiement avec Elastic Beanstalk

1. Installer EB CLI
2. Créer un fichier `.ebextensions/`
3. Déployer avec `eb init` et `eb create`

