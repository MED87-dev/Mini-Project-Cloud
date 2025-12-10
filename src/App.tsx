import { Cloud, Cpu, Database, Server } from 'lucide-react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Cloud className="text-blue-500" size={36} />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mini-Projet Cloud Computing</h1>
              <p className="text-gray-600">Dashboard de monitoring</p>
            </div>
          </div>
        </header>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Cpu className="text-blue-500" size={24} />
              <span className="text-sm font-medium text-blue-600">CPU</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">42%</h3>
            <p className="text-gray-500 text-sm mt-2">Utilisation</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Database className="text-green-500" size={24} />
              <span className="text-sm font-medium text-green-600">RAM</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">76%</h3>
            <p className="text-gray-500 text-sm mt-2">Mémoire</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Server className="text-purple-500" size={24} />
              <span className="text-sm font-medium text-purple-600">Stockage</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">58%</h3>
            <p className="text-gray-500 text-sm mt-2">Disque</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <Cloud className="text-orange-500" size={24} />
              <span className="text-sm font-medium text-orange-600">Instances</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">3/4</h3>
            <p className="text-gray-500 text-sm mt-2">Actives</p>
          </div>
        </div>

        {/* Project Steps */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Étapes du Projet Cloud</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: 1, title: 'Préparation Cloud', color: 'blue', tasks: ['Compte AWS', 'Sécurité', 'Clés API'] },
              { step: 2, title: 'Machine Virtuelle', color: 'green', tasks: ['EC2 Instance', 'SSH', 'IP Publique'] },
              { step: 3, title: 'Services', color: 'purple', tasks: ['Nginx', 'Database', 'Firewall'] },
              { step: 4, title: 'Déploiement', color: 'orange', tasks: ['Transfert', 'Configuration', 'Test'] }
            ].map((item) => (
              <div key={item.step} className={`border-l-4 border-${item.color}-500 pl-4 py-2`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 bg-${item.color}-100 text-${item.color}-600 rounded-full flex items-center justify-center font-bold`}>
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {item.tasks.map((task, idx) => (
                    <li key={idx}>• {task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center text-gray-500">
          <p>✅ Frontend React + Tailwind + Lucide Icons prêt pour le déploiement cloud</p>
        </div>
      </div>
    </div>
  );
}

export default App;