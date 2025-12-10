import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createInstance, CloudInstance } from '../services/api'
import { CheckCircle, XCircle, Loader, ArrowRight } from 'lucide-react'

const CreateVM = () => {
  const [formData, setFormData] = useState({
    name: '',
    instance_type: 'vm' as 'vm' | 'container' | 'serverless',
    provider: 'aws',
    region: 'us-east-1',
    cpu_cores: 2,
    memory_gb: 4,
    storage_gb: 50,
    cost_per_hour: 0.1,
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdInstance, setCreatedInstance] = useState<CloudInstance | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)

  const regions = {
    aws: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'],
    azure: ['eastus', 'westus', 'westeurope', 'southeastasia'],
    gcp: ['us-central1', 'us-east1', 'europe-west1', 'asia-southeast1'],
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const instance = await createInstance(formData)
      setCreatedInstance(instance)
      setSuccess(true)
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        instance_type: 'vm',
        provider: 'aws',
        region: 'us-east-1',
        cpu_cores: 2,
        memory_gb: 4,
        storage_gb: 50,
        cost_per_hour: 0.1,
      })
    } catch (err: any) {
      console.error('Erreur complète:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors de la création de l\'instance'
      
      // Vérifier si c'est une erreur de nom dupliqué
      if (err.response?.status === 400 && errorMessage.includes('existe déjà')) {
        setNameError('Ce nom est déjà utilisé. Veuillez choisir un nom unique.')
        setError(null)
      } else {
        setError(errorMessage)
        setNameError(null)
      }
      
      // Afficher un message plus détaillé dans la console
      if (err.response?.status === 503) {
        console.error('❌ PostgreSQL n\'est pas démarré. Démarrer avec: docker-compose up -d postgres')
      } else if (err.response?.status === 500 && errorMessage.includes('tables')) {
        console.error('❌ Les tables n\'existent pas. Initialiser avec: psql -U postgres -d cloud_db -f database/schema.sql')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'cpu_cores' || name === 'cost_per_hour' || name === 'memory_gb' || name === 'storage_gb'
        ? parseFloat(value) || 0
        : value,
      // Réinitialiser la région quand le provider change
      ...(name === 'provider' ? { region: regions[value as keyof typeof regions][0] } : {}),
    }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Créer une Instance Cloud
      </h1>

      {success && createdInstance && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-green-800 dark:text-green-200 font-semibold">
                Instance créée avec succès!
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Nom: {createdInstance.name} | IP: {createdInstance.ip_address || 'N/A'} | Statut:{' '}
                {createdInstance.status}
              </p>
            </div>
          </div>
          <Link
            to="/instances"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm font-medium"
          >
            <span>Voir toutes mes instances</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-red-800 dark:text-red-200 font-semibold">Erreur lors de la création de l'instance</p>
          </div>
          <p className="text-red-700 dark:text-red-300 text-sm mb-3">{error}</p>
          {error.includes('PostgreSQL') || error.includes('connecter') ? (
            <div className="bg-red-50 dark:bg-red-950 p-3 rounded text-sm">
              <p className="font-semibold mb-1">Solution :</p>
              <p className="mb-2">Démarrer PostgreSQL avec :</p>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs overflow-x-auto">
                docker-compose up -d postgres
              </pre>
            </div>
          ) : error.includes('tables') || error.includes('schema') ? (
            <div className="bg-red-50 dark:bg-red-950 p-3 rounded text-sm">
              <p className="font-semibold mb-1">Solution :</p>
              <p className="mb-2">Initialiser la base de données avec :</p>
              <pre className="bg-gray-900 text-gray-100 p-2 rounded text-xs overflow-x-auto">
                psql -U postgres -d cloud_db -f database\schema.sql
              </pre>
            </div>
          ) : null}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Nom de l'instance * (doit être unique)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={(e) => {
              handleChange(e)
              // Réinitialiser l'erreur de nom quand l'utilisateur tape
              if (nameError) {
                setNameError(null)
              }
            }}
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
              nameError 
                ? 'border-red-500 dark:border-red-600' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="web-server-01"
          />
          {nameError && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{nameError}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="instance_type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Type d'instance *
            </label>
            <select
              id="instance_type"
              name="instance_type"
              required
              value={formData.instance_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="vm">VM (Machine Virtuelle)</option>
              <option value="container">Conteneur</option>
              <option value="serverless">Serverless</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="provider"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Provider Cloud *
            </label>
            <select
              id="provider"
              name="provider"
              required
              value={formData.provider}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="aws">AWS</option>
              <option value="azure">Azure</option>
              <option value="gcp">GCP</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="region"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Région *
          </label>
          <select
            id="region"
            name="region"
            required
            value={formData.region}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {regions[formData.provider as keyof typeof regions].map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="cpu_cores"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              CPU (cœurs) *
            </label>
            <input
              type="number"
              id="cpu_cores"
              name="cpu_cores"
              required
              min="1"
              value={formData.cpu_cores}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="memory_gb"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Mémoire (GB) *
            </label>
            <input
              type="number"
              id="memory_gb"
              name="memory_gb"
              required
              min="0.1"
              step="0.1"
              value={formData.memory_gb}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="storage_gb"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Stockage (GB) *
            </label>
            <input
              type="number"
              id="storage_gb"
              name="storage_gb"
              required
              min="1"
              value={formData.storage_gb}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="cost_per_hour"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Coût par heure ($) *
          </label>
          <input
            type="number"
            id="cost_per_hour"
            name="cost_per_hour"
            required
            min="0"
            step="0.01"
            value={formData.cost_per_hour}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              <span>Création en cours...</span>
            </>
          ) : (
            <span>Créer l'instance</span>
          )}
        </button>
      </form>
    </div>
  )
}

export default CreateVM

