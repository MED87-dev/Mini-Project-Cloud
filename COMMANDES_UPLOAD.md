# 📤 Commandes pour Uploader le Projet sur GitHub

## Utilisateur GitHub : MED87-dev

## ⚠️ IMPORTANT : Avant de commencer

1. **Créer le dépôt sur GitHub** :
   - Allez sur https://github.com/new
   - Repository name : `Mini-Project-Cloud`
   - Description : "Projet de gestion cloud avec React, FastAPI et PostgreSQL"
   - Choisissez Public ou Private
   - **NE COCHEZ PAS** "Add a README file"
   - **NE COCHEZ PAS** "Add .gitignore"
   - Cliquez sur **"Create repository"**

2. **Créer un Personal Access Token** (si nécessaire) :
   - Allez sur https://github.com/settings/tokens
   - Cliquez sur "Generate new token (classic)"
   - Nom : "Mini-Project-Cloud"
   - Permissions : Cochez **repo** (toutes)
   - Cliquez sur "Generate token"
   - **COPIEZ LE TOKEN** (vous ne le verrez qu'une fois !)

## 🚀 Commandes à Exécuter (dans l'ordre)

### Étape 1 : Aller dans le dossier du projet
```powershell
cd C:\Users\hp\Desktop\Mini-Project-Cloud
```

### Étape 2 : Initialiser Git (si pas déjà fait)
```powershell
git init
```

### Étape 3 : Vérifier le statut
```powershell
git status
```

### Étape 4 : Ajouter tous les fichiers
```powershell
git add .
```

### Étape 5 : Créer le premier commit
```powershell
git commit -m "Initial commit: Mini Project Cloud - React + FastAPI + PostgreSQL"
```

### Étape 6 : Lier au dépôt GitHub
```powershell
git remote add origin https://github.com/MED87-dev/Mini-Project-Cloud.git
```

### Étape 7 : Vérifier que le remote est bien ajouté
```powershell
git remote -v
```

Vous devriez voir :
```
origin  https://github.com/MED87-dev/Mini-Project-Cloud.git (fetch)
origin  https://github.com/MED87-dev/Mini-Project-Cloud.git (push)
```

### Étape 8 : Renommer la branche en "main"
```powershell
git branch -M main
```

### Étape 9 : Uploader le projet
```powershell
git push -u origin main
```

**Lors de cette étape, GitHub vous demandera :**
- **Username** : `MED87-dev`
- **Password** : Utilisez votre **Personal Access Token** (pas votre mot de passe GitHub)

## ✅ Vérification

Après l'upload, allez sur :
```
https://github.com/MED87-dev/Mini-Project-Cloud
```

Vous devriez voir tous vos fichiers !

## 🔄 Commandes pour les Mises à Jour Futures

Quand vous modifiez des fichiers et voulez les uploader :

```powershell
# 1. Voir les modifications
git status

# 2. Ajouter les fichiers modifiés
git add .

# 3. Créer un commit
git commit -m "Description des modifications"

# 4. Uploader
git push
```

## 🆘 En cas d'erreur

### Erreur : "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/MED87-dev/Mini-Project-Cloud.git
```

### Erreur : "failed to push some refs"
```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Erreur : "authentication failed"
- Vérifiez que vous utilisez un **Personal Access Token** et non votre mot de passe
- Créez un nouveau token si nécessaire

