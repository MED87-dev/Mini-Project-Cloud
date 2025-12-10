/**
 * Service API pour communiquer avec le backend FastAPI
 */
import axios from 'axios'

// URL de l'API backend
// En développement, utilise le proxy Vite (URL vide = relatif)
// En production, utilise VITE_API_URL ou l'URL directe
const API_URL = import.meta.env.VITE_API_URL || ''

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout de 10 secondes
})

// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      console.error('❌ Impossible de se connecter au backend. Vérifiez que le serveur est démarré sur', API_URL)
    }
    return Promise.reject(error)
  }
)

// Types pour les réponses API
export interface CloudInstance {
  id: number
  name: string
  instance_type: 'vm' | 'container' | 'serverless'
  status: 'pending' | 'running' | 'stopped' | 'terminated'
  provider: string
  region: string
  cpu_cores: number
  memory_gb: number
  storage_gb: number
  cost_per_hour: number
  ip_address?: string
  created_at: string
  updated_at?: string
  is_active: boolean
}

export interface Deployment {
  id: number
  deployment_name: string
  provider: string
  region: string
  status: 'pending' | 'in_progress' | 'success' | 'failed' | 'rolled_back'
  instance_count: number
  configuration?: string
  error_message?: string
  started_at: string
  completed_at?: string
  duration_seconds?: number
}

export interface SystemMetrics {
  cpu: {
    usage_percent: number
    cores: number
    load_average: number
  }
  memory: {
    usage_percent: number
    total_gb: number
    used_gb: number
    available_gb: number
  }
  storage: {
    usage_percent: number
    total_gb: number
    used_gb: number
    available_gb: number
  }
  network: {
    inbound_mbps: number
    outbound_mbps: number
    packets_sent: number
    packets_received: number
  }
  timestamp: string
}

// API Health
export const healthCheck = async () => {
  const response = await api.get('/api/health')
  return response.data
}

// API Metrics
export const getSystemMetrics = async (): Promise<SystemMetrics> => {
  const response = await api.get('/api/metrics/system')
  return response.data
}

// API Instances
export const getInstances = async (): Promise<CloudInstance[]> => {
  const response = await api.get('/api/instances')
  return response.data
}

export const createInstance = async (data: Partial<CloudInstance>): Promise<CloudInstance> => {
  const response = await api.post('/api/instances', data)
  return response.data
}

export const stopInstance = async (id: number): Promise<CloudInstance> => {
  const response = await api.post(`/api/instances/${id}/stop`)
  return response.data
}

export const startInstance = async (id: number): Promise<CloudInstance> => {
  const response = await api.post(`/api/instances/${id}/start`)
  return response.data
}

export const deleteInstance = async (id: number): Promise<void> => {
  await api.delete(`/api/instances/${id}`)
}

// API Deployments
export const getDeployments = async (): Promise<Deployment[]> => {
  const response = await api.get('/api/deployments')
  return response.data
}

export const createDeployment = async (data: Partial<Deployment>): Promise<Deployment> => {
  const response = await api.post('/api/deployments', data)
  return response.data
}

export const deleteDeployment = async (id: number): Promise<void> => {
  await api.delete(`/api/deployments/${id}`)
}

export default api

