# 📤 Guide pour Uploader le Projet sur GitHub

## 📋 Prérequis

1. **Compte GitHub** : Créez un compte sur [github.com](https://github.com) si vous n'en avez pas
2. **Git installé** : Vérifiez avec `git --version`

## 🚀 Étapes pour Uploader le Projet

### Étape 1 : Vérifier que Git est installé

```powershell
git --version
```

Si Git n'est pas installé, téléchargez-le depuis [git-scm.com](https://git-scm.com/)

### Étape 2 : Initialiser Git dans le projet

```powershell
# Aller dans le dossier du projet
cd C:\Users\hp\Desktop\Mini-Project-Cloud

# Initialiser Git
git init
```

### Étape 3 : Vérifier le fichier .gitignore

Le fichier `.gitignore` doit exclure :
- `node_modules/`
- `venv/` ou `backend/venv/`
- `__pycache__/`
- `.env`
- Fichiers de build

### Étape 4 : Ajouter tous les fichiers

```powershell
# Ajouter tous les fichiers (sauf ceux dans .gitignore)
git add .

# Vérifier les fichiers ajoutés
git status
```

### Étape 5 : Créer le premier commit

```powershell
git commit -m "Initial commit: Mini Project Cloud - React + FastAPI + PostgreSQL"
```

### Étape 6 : Créer un dépôt sur GitHub

1. Allez sur [github.com](https://github.com)
2. Cliquez sur le bouton **"+"** en haut à droite
3. Sélectionnez **"New repository"**
4. Remplissez les informations :
   - **Repository name** : `Mini-Project-Cloud` (ou le nom de votre choix)
   - **Description** : "Projet de gestion cloud avec React, FastAPI et PostgreSQL"
   - **Visibility** : 
     - ✅ **Public** (visible par tous)
     - 🔒 **Private** (seulement vous)
   - ❌ **Ne cochez PAS** "Add a README file" (vous en avez déjà un)
   - ❌ **Ne cochez PAS** "Add .gitignore" (vous en avez déjà un)
5. Cliquez sur **"Create repository"**

### Étape 7 : Lier le dépôt local à GitHub

GitHub vous donnera des commandes. Utilisez celles-ci :

```powershell
# Ajouter le dépôt distant (remplacez USERNAME par votre nom d'utilisateur GitHub)
git remote add origin https://github.com/USERNAME/Mini-Project-Cloud.git

# Vérifier que le remote est bien ajouté
git remote -v
```

### Étape 8 : Uploader le projet

```powershell
# Renommer la branche principale en "main" (si nécessaire)
git branch -M main

# Uploader le projet sur GitHub
git push -u origin main
```

**Note** : Si c'est la première fois, GitHub vous demandera de vous authentifier :
- **Username** : Votre nom d'utilisateur GitHub
- **Password** : Utilisez un **Personal Access Token** (pas votre mot de passe)

### 🔑 Créer un Personal Access Token (si nécessaire)

1. Allez sur GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Cliquez sur **"Generate new token (classic)"**
3. Donnez-lui un nom (ex: "Mini-Project-Cloud")
4. Sélectionnez les permissions : **repo** (toutes)
5. Cliquez sur **"Generate token"**
6. **Copiez le token** (vous ne le verrez qu'une fois !)
7. Utilisez ce token comme mot de passe lors du `git push`

## ✅ Vérification

Après l'upload, allez sur votre dépôt GitHub :
```
https://github.com/USERNAME/Mini-Project-Cloud
```

Vous devriez voir tous vos fichiers !

## 📝 Commandes Git Utiles

```powershell
# Voir l'état des fichiers
git status

# Voir l'historique des commits
git log

# Ajouter des modifications
git add .
git commit -m "Description des modifications"
git push

# Télécharger les dernières modifications
git pull
```

## 🔒 Fichiers à NE PAS Uploader

Assurez-vous que votre `.gitignore` contient :
- `backend/venv/` (environnement virtuel Python)
- `frontend/node_modules/` (dépendances Node.js)
- `__pycache__/` (fichiers Python compilés)
- `.env` (variables d'environnement sensibles)
- `*.pyc` (fichiers Python compilés)

## 🎯 Résumé des Commandes

```powershell
# 1. Initialiser Git
git init

# 2. Ajouter les fichiers
git add .

# 3. Créer le premier commit
git commit -m "Initial commit: Mini Project Cloud"

# 4. Lier à GitHub (remplacez USERNAME)
git remote add origin https://github.com/USERNAME/Mini-Project-Cloud.git

# 5. Uploader
git branch -M main
git push -u origin main
```

## 🆘 En cas de problème

### Erreur : "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/USERNAME/Mini-Project-Cloud.git
```

### Erreur : "failed to push some refs"
```powershell
git pull origin main --allow-unrelated-histories
git push -u origin main
```

