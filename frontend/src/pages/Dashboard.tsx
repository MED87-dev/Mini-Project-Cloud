import { useState, useEffect } from 'react'
import { Cpu, HardDrive, Wifi, Activity } from 'lucide-react'
import MetricCard from '../components/MetricCard'
import { getSystemMetrics, SystemMetrics } from '../services/api'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const Dashboard = () => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getSystemMetrics()
        setMetrics(data)
        setHistory((prev) => {
          const newHistory = [...prev, data]
          return newHistory.slice(-20) // Garder les 20 dernières valeurs
        })
      } catch (error) {
        console.error('Erreur lors de la récupération des métriques:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000) // Rafraîchir toutes les 5 secondes

    return () => clearInterval(interval)
  }, [])

  const chartData = history.map((item, index) => ({
    time: index,
    cpu: item.cpu.usage_percent,
    memory: item.memory.usage_percent,
    storage: item.storage.usage_percent,
  }))

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Impossible de charger les métriques</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Tableau de bord - Monitoring Cloud
      </h1>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="CPU"
          value={`${metrics.cpu.usage_percent.toFixed(1)}%`}
          icon={Cpu}
          color="text-blue-500"
          darkMode={document.documentElement.classList.contains('dark')}
        />
        <MetricCard
          title="Mémoire"
          value={`${metrics.memory.usage_percent.toFixed(1)}%`}
          icon={Activity}
          color="text-green-500"
          darkMode={document.documentElement.classList.contains('dark')}
        />
        <MetricCard
          title="Stockage"
          value={`${metrics.storage.usage_percent.toFixed(1)}%`}
          icon={HardDrive}
          color="text-purple-500"
          darkMode={document.documentElement.classList.contains('dark')}
        />
        <MetricCard
          title="Réseau (Inbound)"
          value={`${metrics.network.inbound_mbps.toFixed(1)} Mbps`}
          icon={Wifi}
          color="text-orange-500"
          darkMode={document.documentElement.classList.contains('dark')}
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Utilisation CPU et Mémoire
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="cpu"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                name="CPU (%)"
              />
              <Area
                type="monotone"
                dataKey="memory"
                stackId="2"
                stroke="#10b981"
                fill="#10b981"
                name="Mémoire (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Utilisation Stockage
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="storage"
                stroke="#a855f7"
                strokeWidth={2}
                name="Stockage (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Détails des métriques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Détails CPU
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Cœurs:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {metrics.cpu.cores}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Utilisation:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {metrics.cpu.usage_percent.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Charge moyenne:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {metrics.cpu.load_average.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Détails Mémoire
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {metrics.memory.total_gb.toFixed(2)} GB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Utilisé:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {metrics.memory.used_gb.toFixed(2)} GB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Disponible:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {metrics.memory.available_gb.toFixed(2)} GB
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Réseau */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Statistiques Réseau
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Inbound:</span>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {metrics.network.inbound_mbps.toFixed(2)} Mbps
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Outbound:</span>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {metrics.network.outbound_mbps.toFixed(2)} Mbps
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Packets envoyés:</span>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {metrics.network.packets_sent.toLocaleString()}
            </p>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Packets reçus:</span>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {metrics.network.packets_received.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

