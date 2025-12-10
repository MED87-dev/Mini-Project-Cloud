import { useState, useEffect } from 'react'
import { getInstances, stopInstance, startInstance, deleteInstance, CloudInstance } from '../services/api'
import { Server, CheckCircle, XCircle, Clock, AlertCircle, RefreshCw, Cpu, HardDrive, DollarSign, MapPin, Globe, Power, PowerOff, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

const Instances = () => {
  const [instances, setInstances] = useState<CloudInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    fetchInstances()
  }, [])

  const fetchInstances = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getInstances()
      // Filtrer uniquement les instances actives et trier par date de création (plus récentes en premier)
      const activeInstances = data.filter(instance => instance.is_active === true)
      // Trier par date de création décroissante
      activeInstances.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime()
        const dateB = new Date(b.created_at).getTime()
        return dateB - dateA
      })
      setInstances(activeInstances)
    } catch (err: any) {
      console.error('Erreur lors de la récupération des instances:', err)
      setError('Impossible de charger les instances. Vérifiez que le backend est démarré.')
    } finally {
      setLoading(false)
    }
  }

  const handleStopInstance = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir arrêter cette instance ?')) {
      return
    }
    
    try {
      setActionLoading(id)
      await stopInstance(id)
      // Rafraîchir la liste
      await fetchInstances()
    } catch (err: any) {
      console.error('Erreur lors de l\'arrêt de l\'instance:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors de l\'arrêt de l\'instance'
      alert(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }

  const handleStartInstance = async (id: number) => {
    try {
      setActionLoading(id)
      await startInstance(id)
      // Rafraîchir la liste
      await fetchInstances()
    } catch (err: any) {
      console.error('Erreur lors du démarrage de l\'instance:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors du démarrage de l\'instance'
      alert(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteInstance = async (id: number, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'instance "${name}" ?\n\nCette action est irréversible et l'instance sera définitivement supprimée.`)) {
      return
    }
    
    try {
      setActionLoading(id)
      await deleteInstance(id)
      // Rafraîchir la liste
      await fetchInstances()
    } catch (err: any) {
      console.error('Erreur lors de la suppression de l\'instance:', err)
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors de la suppression de l\'instance'
      alert(errorMessage)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'stopped':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'terminated':
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'stopped':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'terminated':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vm':
        return 'VM'
      case 'container':
        return 'Container'
      case 'serverless':
        return 'Serverless'
      default:
        return type.toUpperCase()
    }
  }

  const getProviderLabel = (provider: string) => {
    return provider.toUpperCase()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
          <button
            onClick={fetchInstances}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Server className="h-8 w-8" />
            Mes Instances Cloud
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Liste de toutes vos instances créées ({instances.length} instance{instances.length > 1 ? 's' : ''})
          </p>
        </div>
        <button
          onClick={fetchInstances}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
          title="Rafraîchir la liste"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </button>
      </div>

      {instances.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <Server className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Aucune instance trouvée
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Vous n'avez pas encore créé d'instance. Créez-en une pour commencer !
          </p>
          <a
            href="/create-vm"
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Créer une instance
          </a>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
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
                    CPU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    RAM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Stockage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Coût/h
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Créée le
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {instances.map((instance) => (
                  <tr key={instance.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {instance.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        {getTypeLabel(instance.instance_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {getProviderLabel(instance.provider)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                        <MapPin className="h-4 w-4 mr-1" />
                        {instance.region}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          instance.status
                        )}`}
                      >
                        {getStatusIcon(instance.status)}
                        <span className="capitalize">{instance.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                        <Cpu className="h-4 w-4 mr-1" />
                        {instance.cpu_cores}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {instance.memory_gb} GB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                        <HardDrive className="h-4 w-4 mr-1" />
                        {instance.storage_gb} GB
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {instance.ip_address ? (
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                          <Globe className="h-4 w-4 mr-1" />
                          {instance.ip_address}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ${instance.cost_per_hour.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {format(new Date(instance.created_at), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {instance.status === 'running' ? (
                          <>
                            <button
                              onClick={() => handleStopInstance(instance.id)}
                              disabled={actionLoading === instance.id}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                              title="Arrêter l'instance"
                            >
                              {actionLoading === instance.id ? (
                                <Clock className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <PowerOff className="h-3 w-3 mr-1" />
                              )}
                              Arrêter
                            </button>
                            <button
                              onClick={() => handleDeleteInstance(instance.id, instance.name)}
                              disabled={actionLoading === instance.id}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                              title="Supprimer l'instance"
                            >
                              {actionLoading === instance.id ? (
                                <Clock className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3 mr-1" />
                              )}
                              Supprimer
                            </button>
                          </>
                        ) : instance.status === 'stopped' ? (
                          <>
                            <button
                              onClick={() => handleStartInstance(instance.id)}
                              disabled={actionLoading === instance.id}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                              title="Démarrer l'instance"
                            >
                              {actionLoading === instance.id ? (
                                <Clock className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <Power className="h-3 w-3 mr-1" />
                              )}
                              Démarrer
                            </button>
                            <button
                              onClick={() => handleDeleteInstance(instance.id, instance.name)}
                              disabled={actionLoading === instance.id}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                              title="Supprimer l'instance"
                            >
                              {actionLoading === instance.id ? (
                                <Clock className="h-3 w-3 mr-1 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3 mr-1" />
                              )}
                              Supprimer
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleDeleteInstance(instance.id, instance.name)}
                            disabled={actionLoading === instance.id}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            title="Supprimer l'instance"
                          >
                            {actionLoading === instance.id ? (
                              <Clock className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3 mr-1" />
                            )}
                            Supprimer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Résumé des instances */}
      {instances.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{instances.length}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">En cours</div>
            <div className="text-2xl font-bold text-green-600">
              {instances.filter((i) => i.status === 'running').length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Arrêtées</div>
            <div className="text-2xl font-bold text-red-600">
              {instances.filter((i) => i.status === 'stopped').length}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">Coût total/h</div>
            <div className="text-2xl font-bold text-blue-600">
              ${instances.reduce((sum, i) => sum + i.cost_per_hour, 0).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Instances

