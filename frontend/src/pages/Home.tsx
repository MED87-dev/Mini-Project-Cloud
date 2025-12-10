import { Link } from 'react-router-dom'
import { Cloud, Server, BarChart3, Book, ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { healthCheck } from '../services/api'

const Home = () => {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  useEffect(() => {
    const checkApi = async () => {
      try {
        await healthCheck()
        setApiStatus('online')
      } catch (error) {
        setApiStatus('offline')
      }
    }
    checkApi()
  }, [])

  const features = [
    {
      icon: Cloud,
      title: 'Gestion Cloud Multi-Provider',
      description: 'Gérez vos déploiements sur AWS, Azure et GCP depuis une seule interface.',
    },
    {
      icon: Server,
      title: 'Création de VM',
      description: 'Créez et configurez facilement vos instances cloud avec un formulaire intuitif.',
    },
    {
      icon: BarChart3,
      title: 'Monitoring en Temps Réel',
      description: 'Surveillez les métriques de vos instances (CPU, RAM, Stockage, Réseau).',
    },
    {
      icon: Book,
      title: 'Documentation Complète',
      description: 'Guide complet pour déployer votre application sur les principaux clouds.',
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold mb-4 text-gray-900 dark:text-white">
          Mini Project Cloud
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Plateforme de démonstration pour la gestion et le déploiement d'applications cloud
          sur AWS, Azure et GCP
        </p>
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Statut API:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              apiStatus === 'online'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : apiStatus === 'offline'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}
          >
            {apiStatus === 'online'
              ? 'En ligne'
              : apiStatus === 'offline'
              ? 'Hors ligne'
              : 'Vérification...'}
          </span>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow"
          >
            <feature.icon className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard"
            className="flex items-center justify-between p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Tableau de bord</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Voir les métriques cloud
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-blue-500" />
          </Link>
          <Link
            to="/create-vm"
            className="flex items-center justify-between p-4 border-2 border-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Créer une VM</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Déployer une nouvelle instance
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-green-500" />
          </Link>
          <Link
            to="/deployments"
            className="flex items-center justify-between p-4 border-2 border-purple-500 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Historique</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Voir les déploiements
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-purple-500" />
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">À propos</h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Ce projet est une démonstration complète d'une application de gestion cloud avec
          React, FastAPI et PostgreSQL. Il inclut toutes les fonctionnalités essentielles pour
          gérer des déploiements cloud, surveiller les métriques et créer des instances virtuelles.
        </p>
      </section>
    </div>
  )
}

export default Home

