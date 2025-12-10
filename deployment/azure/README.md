# Déploiement sur Azure

## Prérequis

- Compte Azure avec abonnement actif
- Azure CLI installé et configuré
- Terraform installé (optionnel)

## Méthode 1: Déploiement avec Azure VM

### 1. Se connecter à Azure

```bash
az login
az account set --subscription "your-subscription-id"
```

### 2. Créer un groupe de ressources

```bash
az group create --name cloud-project-rg --location eastus
```

### 3. Créer une VM Linux

```bash
az vm create \
  --resource-group cloud-project-rg \
  --name cloud-project-vm \
  --image Ubuntu2204 \
  --admin-username azureuser \
  --generate-ssh-keys \
  --public-ip-sku Standard
```

### 4. Ouvrir les ports nécessaires

```bash
az vm open-port --port 80 --resource-group cloud-project-rg --name cloud-project-vm
az vm open-port --port 443 --resource-group cloud-project-rg --name cloud-project-vm
```

### 5. Se connecter et déployer

```bash
# Obtenir l'IP publique
PUBLIC_IP=$(az vm show -d -g cloud-project-rg -n cloud-project-vm --query publicIps -o tsv)

# Se connecter
ssh azureuser@$PUBLIC_IP

# Installer Docker
sudo apt update
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER

# Déployer l'application
git clone <your-repo-url>
cd Mini-Project-Cloud
docker-compose up -d
```

## Méthode 2: Déploiement avec Azure Container Instances

Voir les scripts dans le dossier pour plus de détails.

## Méthode 3: Déploiement avec Azure App Service

1. Créer un App Service Plan
2. Créer une Web App
3. Configurer le déploiement continu

