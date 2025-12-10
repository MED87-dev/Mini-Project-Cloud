# Déploiement sur GCP

## Prérequis

- Compte GCP avec projet actif
- Google Cloud SDK installé et configuré
- Terraform installé (optionnel)

## Méthode 1: Déploiement avec Compute Engine

### 1. Se connecter à GCP

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### 2. Créer une instance VM

```bash
gcloud compute instances create cloud-project-vm \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud \
  --boot-disk-size=20GB
```

### 3. Ouvrir les ports

```bash
gcloud compute firewall-rules create allow-http \
  --allow tcp:80 \
  --source-ranges 0.0.0.0/0 \
  --description "Allow HTTP"

gcloud compute firewall-rules create allow-https \
  --allow tcp:443 \
  --source-ranges 0.0.0.0/0 \
  --description "Allow HTTPS"
```

### 4. Se connecter et déployer

```bash
# Obtenir l'IP externe
EXTERNAL_IP=$(gcloud compute instances describe cloud-project-vm \
  --zone=us-central1-a \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)')

# Se connecter
gcloud compute ssh cloud-project-vm --zone=us-central1-a

# Installer Docker
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER

# Déployer l'application
git clone <your-repo-url>
cd Mini-Project-Cloud
docker-compose up -d
```

## Méthode 2: Déploiement avec Cloud Run

1. Créer des images Docker
2. Pousser vers Google Container Registry
3. Déployer avec Cloud Run

## Méthode 3: Déploiement avec GKE (Google Kubernetes Engine)

Voir les configurations Kubernetes dans le dossier pour plus de détails.

