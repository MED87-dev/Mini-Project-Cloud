import { useState, useEffect } from 'react'
import { getDeployments, createDeployment, deleteDeployment, Deployment } from '../services/api'
import { CheckCircle, XCircle, Clock, Trash2, Plus, AlertCircle, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'

const DeploymentHistory = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    deployment_name: '',
    provider: 'aws',
    region: 'us-east-1',
    instance_count: 1,
  })

  const regions = {
    aws: ['us-east-1', 'us-west-2', 'eu-west-1'],
    azure: ['eastus', 'westus', 'westeurope'],
    gcp: ['us-central1', 'us-east1', 'europe-west1'],
  }

  useEffect(() => {
    fetchDeployments()
    
    // Rafraîchir automatiquement la liste toutes les 3 secondes pour voir les changements de statut
    // Utiliser un rafraîchissement silencieux pour ne pas afficher le loader
    const interval = setInterval(() => {
      fetchDeployments(true) // true = rafraîchissement silencieux
    }, 3000) // Rafraîchir toutes les 3 secondes
    
    // Nettoyer l'intervalle quand le composant est démonté
    return () => clearInterval(interval)
  }, [])

  const fetchDeployments = async (silent = false) => {
    try {
      // Ne pas afficher le loader si c'est un rafraîchissement silencieux
      if (!silent) {
        setLoading(true)
      }
      setError(null)
      const data = await getDeployments()
      // Trier par date de création décroissante (plus récents en premier)
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.started_at).getTime()
        const dateB = new Date(b.started_at).getTime()
        return dateB - dateA
      })
      setDeployments(sortedData)
    } catch (err: any) {
      console.error('Erreur lors de la récupération des déploiements:', err)
      // Ne pas afficher l'erreur si c'est un rafraîchissement silencieux
      if (!silent) {
        const errorMessage = err.response?.data?.detail || err.message || 'Impossible de charger les déploiements'
        setError(errorMessage)
      }
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  const handleCreateDeployment = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setError(null)
    setSuccess(false)
    setNameError(null)
    
    try {
      await createDeployment(formData)
      setSuccess(true)
      setShowForm(false)
      setFormData({ deployment_name: '', provider: 'aws', region: 'us-east-1', instance_count: 1 })
      // Rafraîchir la liste après un court délai pour laisser le backend traiter
      setTimeout(() => {
        fetchDeployments()
      }, 500)
    } catch (err: any) {
      console.error('Erreur lors de la création du déploiement:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors de la création du déploiement'
      
      // Vérifier si c'est une erreur de nom dupliqué
      if (err.response?.status === 400 && errorMessage.includes('existe déjà')) {
        setNameError('Ce nom est déjà utilisé. Veuillez choisir un nom unique.')
        setError(null)
      } else {
        setError(errorMessage)
        setNameError(null)
      }
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce déploiement?')) {
      try {
        await deleteDeployment(id)
        fetchDeployments()
      } catch (err: any) {
        console.error('Erreur lors de la suppression:', err)
        const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors de la suppression'
        alert(errorMessage)
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Historique des Déploiements
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Liste de tous vos déploiements ({deployments.length} déploiement{deployments.length > 1 ? 's' : ''})
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fetchDeployments(false)}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition flex items-center gap-2"
            title="Rafraîchir la liste"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </button>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setError(null)
              setSuccess(false)
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Nouveau déploiement</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 dark:text-red-200 font-semibold">Erreur</p>
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-800 dark:text-green-200 font-semibold">Succès</p>
            <p className="text-green-700 dark:text-green-300 text-sm">Le déploiement a été créé avec succès !</p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Créer un nouveau déploiement
          </h2>
          <form onSubmit={handleCreateDeployment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nom du déploiement * (doit être unique)
              </label>
              <input
                type="text"
                required
                value={formData.deployment_name}
                onChange={(e) => {
                  setFormData({ ...formData, deployment_name: e.target.value })
                  // Réinitialiser l'erreur de nom quand l'utilisateur tape
                  if (nameError) {
                    setNameError(null)
                  }
                }}
                className={`w-full px-4 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                  nameError 
                    ? 'border-red-500 dark:border-red-600' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {nameError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{nameError}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Provider
                </label>
                <select
                  value={formData.provider}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      provider: e.target.value,
                      region: regions[e.target.value as keyof typeof regions][0],
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="aws">AWS</option>
                  <option value="azure">Azure</option>
                  <option value="gcp">GCP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Région
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {regions[formData.provider as keyof typeof regions].map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre d'instances
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.instance_count}
                  onChange={(e) =>
                    setFormData({ ...formData, instance_count: parseInt(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={creating}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {creating ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    <span>Création...</span>
                  </>
                ) : (
                  <span>Créer</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setError(null)
                  setSuccess(false)
                }}
                disabled={creating}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {deployments.length === 0 && !loading ? (
        <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-gray-600 dark:text-gray-400">Aucun déploiement trouvé</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Créez votre premier déploiement pour commencer</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Région
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Instances
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {deployments.map((deployment) => (
                  <tr key={deployment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {deployment.deployment_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {deployment.provider.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {deployment.region}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          deployment.status
                        )}`}
                      >
                        {getStatusIcon(deployment.status)}
                        <span>{deployment.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {deployment.instance_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {format(new Date(deployment.started_at), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDelete(deployment.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeploymentHistory

