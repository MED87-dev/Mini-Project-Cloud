import { useState } from 'react'

const API_URL = 'http://localhost:8000'

interface TestResult {
  success: boolean
  data?: any
  error?: string
  solution?: React.ReactNode
  count?: number
}

const TestConnection = () => {
  const [healthResult, setHealthResult] = useState<string | TestResult | null>(null)
  const [metricsResult, setMetricsResult] = useState<string | TestResult | null>(null)
  const [instancesResult, setInstancesResult] = useState<string | TestResult | null>(null)
  const [deploymentsResult, setDeploymentsResult] = useState<string | TestResult | null>(null)
  const [allResults, setAllResults] = useState<string | any[] | null>(null)

  const testHealth = async () => {
    setHealthResult('⏳ Test en cours...')

    try {
      const response = await fetch(`${API_URL}/api/health`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setHealthResult({
        success: true,
        data: data,
      })
    } catch (error: any) {
      let errorMessage = error.message
      let solution: React.ReactNode = null

      if (
        error.message.includes('ERR_EMPTY_RESPONSE') ||
        error.message.includes('Failed to fetch')
      ) {
        errorMessage = "Le backend FastAPI n'est pas démarré ou n'est pas accessible"
        solution = (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md mt-2">
            <strong>🔧 Solution :</strong>
            <ol className="mt-2 ml-5 list-decimal">
              <li>Ouvrir un terminal PowerShell</li>
              <li>
                Aller dans le dossier backend : <code>cd backend</code>
              </li>
              <li>
                Activer l'environnement virtuel :{' '}
                <code>.\venv\Scripts\Activate.ps1</code>
              </li>
              <li>
                Démarrer le serveur : <code>uvicorn app.main:app --reload</code>
              </li>
              <li>Attendre le message "Uvicorn running on http://127.0.0.1:8000"</li>
              <li>Revenir ici et cliquer à nouveau sur le bouton</li>
            </ol>
          </div>
        )
      } else if (
        error.message.includes('ECONNREFUSED') ||
        error.message.includes('network')
      ) {
        errorMessage = 'Impossible de se connecter au serveur'
        solution = (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md mt-2">
            <strong>🔧 Vérifications :</strong>
            <ul className="mt-2 ml-5 list-disc">
              <li>Le backend est-il démarré sur {API_URL} ?</li>
              <li>Y a-t-il un firewall qui bloque la connexion ?</li>
              <li>Le port 8000 est-il disponible ?</li>
            </ul>
          </div>
        )
      }

      setHealthResult({
        success: false,
        error: errorMessage,
        solution: solution,
      })
    }
  }

  const testMetrics = async () => {
    setMetricsResult('⏳ Test en cours...')

    try {
      const response = await fetch(`${API_URL}/api/metrics/system`)
      const data = await response.json()
      setMetricsResult({
        success: true,
        data: data,
      })
    } catch (error: any) {
      setMetricsResult({
        success: false,
        error: error.message,
      })
    }
  }

  const testInstances = async () => {
    setInstancesResult('⏳ Test en cours...')

    try {
      const response = await fetch(`${API_URL}/api/instances`)
      const data = await response.json()
      setInstancesResult({
        success: true,
        data: data,
        count: data.length,
      })
    } catch (error: any) {
      setInstancesResult({
        success: false,
        error: error.message,
      })
    }
  }

  const testDeployments = async () => {
    setDeploymentsResult('⏳ Test en cours...')

    try {
      const response = await fetch(`${API_URL}/api/deployments`)
      const data = await response.json()
      setDeploymentsResult({
        success: true,
        data: data,
        count: data.length,
      })
    } catch (error: any) {
      setDeploymentsResult({
        success: false,
        error: error.message,
      })
    }
  }

  const testAll = async () => {
    setAllResults('⏳ Test de tous les endpoints en cours...')

    const results: any[] = []

    // Test Health
    try {
      const response = await fetch(`${API_URL}/api/health`)
      const data = await response.json()
      results.push({ endpoint: '/api/health', status: '✅ OK', data })
    } catch (error: any) {
      results.push({
        endpoint: '/api/health',
        status: '❌ ERREUR',
        error: error.message,
      })
    }

    // Test Metrics
    try {
      const response = await fetch(`${API_URL}/api/metrics/system`)
      const data = await response.json()
      results.push({ endpoint: '/api/metrics/system', status: '✅ OK', data })
    } catch (error: any) {
      results.push({
        endpoint: '/api/metrics/system',
        status: '❌ ERREUR',
        error: error.message,
      })
    }

    // Test Instances
    try {
      const response = await fetch(`${API_URL}/api/instances`)
      const data = await response.json()
      results.push({
        endpoint: '/api/instances',
        status: '✅ OK',
        count: data.length,
      })
    } catch (error: any) {
      results.push({
        endpoint: '/api/instances',
        status: '❌ ERREUR',
        error: error.message,
      })
    }

    // Test Deployments
    try {
      const response = await fetch(`${API_URL}/api/deployments`)
      const data = await response.json()
      results.push({
        endpoint: '/api/deployments',
        status: '✅ OK',
        count: data.length,
      })
    } catch (error: any) {
      results.push({
        endpoint: '/api/deployments',
        status: '❌ ERREUR',
        error: error.message,
      })
    }

    setAllResults(results)
  }

  const renderResult = (result: string | TestResult | null) => {
    if (!result) return null

    if (typeof result === 'string') {
      return <p>{result}</p>
    }

    if (result.success) {
      return (
        <div>
          <p className="text-green-600 dark:text-green-400 font-bold">
            ✅ {result.count ? `Récupéré! (${result.count} élément(s))` : 'Connexion réussie!'}
          </p>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto mt-2 text-sm">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )
    } else {
      return (
        <div>
          <p className="text-red-600 dark:text-red-400 font-bold">❌ Erreur: {result.error}</p>
          {result.solution && result.solution}
          {!result.solution && (
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              <strong>URL testée:</strong> {API_URL}
              {result.endpoint || '/api/health'}
            </p>
          )}
        </div>
      )
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        🔌 Test de Connexion FastAPI ↔ Frontend
      </h1>

      {/* Avertissement */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          ⚠️ Important : Démarrer le Backend d'abord !
        </h2>
        <p className="mb-2 text-gray-700 dark:text-gray-300">
          <strong>Si vous voyez "ERR_EMPTY_RESPONSE", le backend n'est pas démarré.</strong>
        </p>
        <p className="mb-2 text-gray-700 dark:text-gray-300">Ouvrir un terminal PowerShell et exécuter :</p>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
          {`cd backend
.\\venv\\Scripts\\Activate.ps1
uvicorn app.main:app --reload`}
        </pre>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          Attendre le message "Uvicorn running on http://127.0.0.1:8000"
        </p>
      </div>

      {/* Test Health */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          1. Test Health Endpoint
        </h2>
        <button
          onClick={testHealth}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Tester /api/health
        </button>
        <div className="mt-4">{renderResult(healthResult)}</div>
      </div>

      {/* Test Metrics */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          2. Test Metrics Endpoint
        </h2>
        <button
          onClick={testMetrics}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Tester /api/metrics/system
        </button>
        <div className="mt-4">{renderResult(metricsResult)}</div>
      </div>

      {/* Test Instances */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          3. Test Instances Endpoint
        </h2>
        <button
          onClick={testInstances}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Tester /api/instances
        </button>
        <div className="mt-4">{renderResult(instancesResult)}</div>
      </div>

      {/* Test Deployments */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          4. Test Deployments Endpoint
        </h2>
        <button
          onClick={testDeployments}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Tester /api/deployments
        </button>
        <div className="mt-4">{renderResult(deploymentsResult)}</div>
      </div>

      {/* Test All */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          5. Test Tous les Endpoints
        </h2>
        <button
          onClick={testAll}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          Tester Tout
        </button>
        <div className="mt-4">
          {typeof allResults === 'string' ? (
            <p>{allResults}</p>
          ) : allResults ? (
            <div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Résultats:</h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-x-auto text-sm">
                {JSON.stringify(allResults, null, 2)}
              </pre>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default TestConnection

