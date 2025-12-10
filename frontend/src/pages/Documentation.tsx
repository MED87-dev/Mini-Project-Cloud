const Documentation = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Documentation - Guide de Déploiement Cloud
      </h1>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Vue d'ensemble
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Ce projet est une application complète de gestion cloud avec React, FastAPI et
          PostgreSQL. Il permet de gérer des déploiements sur AWS, Azure et GCP.
        </p>
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Installation Locale
        </h2>
        <div className="space-y-4 text-gray-600 dark:text-gray-300">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              1. Prérequis
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Node.js 18+</li>
              <li>Python 3.10+</li>
              <li>Docker et Docker Compose</li>
              <li>PostgreSQL 14+ (ou via Docker)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              2. Installation avec Docker Compose
            </h3>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
              <code>docker-compose up -d</code>
            </pre>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              3. Installation manuelle
            </h3>
            <p className="mb-2">Backend:</p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
              <code>{`cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn app.main:app --reload`}</code>
            </pre>
            <p className="mb-2 mt-4">Frontend:</p>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
              <code>{`cd frontend
npm install
npm run dev`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Déploiement sur AWS
        </h2>
        <div className="space-y-4 text-gray-600 dark:text-gray-300">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Étapes de déploiement
            </h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Créer un compte AWS et configurer AWS CLI</li>
              <li>Créer une instance EC2 (Ubuntu 22.04 LTS recommandé)</li>
              <li>Configurer les groupes de sécurité (ports 80, 443, 8000, 5432)</li>
              <li>Installer Docker et Docker Compose sur l'instance</li>
              <li>Cloner le repository et configurer les variables d'environnement</li>
              <li>Lancer avec docker-compose</li>
              <li>Configurer un reverse proxy Nginx</li>
              <li>Configurer un certificat SSL avec Let's Encrypt</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Commandes utiles
            </h3>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto">
              <code>{`# Se connecter à l'instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Installer Docker
sudo apt update
sudo apt install docker.io docker-compose -y
sudo usermod -aG docker $USER

# Lancer l'application
docker-compose up -d`}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Déploiement sur Azure
        </h2>
        <div className="space-y-4 text-gray-600 dark:text-gray-300">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Étapes de déploiement
            </h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Créer un compte Azure et installer Azure CLI</li>
              <li>Créer un App Service ou une VM Linux</li>
              <li>Configurer Azure Database for PostgreSQL</li>
              <li>Déployer avec Azure Container Instances ou App Service</li>
              <li>Configurer les variables d'environnement dans Azure Portal</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          Déploiement sur GCP
        </h2>
        <div className="space-y-4 text-gray-600 dark:text-gray-300">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Étapes de déploiement
            </h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Créer un projet GCP et activer les APIs nécessaires</li>
              <li>Créer une instance Compute Engine</li>
              <li>Configurer Cloud SQL (PostgreSQL)</li>
              <li>Déployer avec Cloud Run ou Compute Engine</li>
              <li>Configurer Cloud Load Balancer</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
          API Endpoints
        </h2>
        <div className="space-y-2 text-gray-600 dark:text-gray-300">
          <div>
            <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
              GET /api/health
            </code>
            <span className="ml-2">- Vérification de santé</span>
          </div>
          <div>
            <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
              GET /api/metrics/system
            </code>
            <span className="ml-2">- Métriques système</span>
          </div>
          <div>
            <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
              GET /api/instances
            </code>
            <span className="ml-2">- Liste des instances</span>
          </div>
          <div>
            <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
              POST /api/instances
            </code>
            <span className="ml-2">- Créer une instance</span>
          </div>
          <div>
            <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
              GET /api/deployments
            </code>
            <span className="ml-2">- Liste des déploiements</span>
          </div>
          <div>
            <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
              POST /api/deployments
            </code>
            <span className="ml-2">- Créer un déploiement</span>
          </div>
        </div>
        <p className="mt-4 text-sm">
          Documentation complète disponible sur{' '}
          <a
            href="http://localhost:8000/api/docs"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            http://localhost:8000/api/docs
          </a>
        </p>
      </section>
    </div>
  )
}

export default Documentation

