#!/bin/bash
# Script de déploiement AWS

set -e

echo "🚀 Déploiement sur AWS..."

# Vérifier les prérequis
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI n'est pas installé"
    exit 1
fi

# Configuration
REGION="us-east-1"
INSTANCE_TYPE="t3.medium"
KEY_NAME="your-key-name"

echo "📦 Création de l'instance EC2..."
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id ami-0c55b159cbfafe1f0 \
    --instance-type $INSTANCE_TYPE \
    --key-name $KEY_NAME \
    --region $REGION \
    --query 'Instances[0].InstanceId' \
    --output text)

echo "✅ Instance créée: $INSTANCE_ID"

echo "⏳ Attente de l'initialisation..."
aws ec2 wait instance-running --instance-ids $INSTANCE_ID

PUBLIC_IP=$(aws ec2 describe-instances \
    --instance-ids $INSTANCE_ID \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)

echo "✅ Instance prête: $PUBLIC_IP"
echo "🔗 Connectez-vous avec: ssh -i your-key.pem ubuntu@$PUBLIC_IP"

