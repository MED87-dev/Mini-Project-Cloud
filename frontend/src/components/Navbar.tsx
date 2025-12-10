import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun, Cloud } from 'lucide-react'

interface NavbarProps {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
}

const Navbar = ({ darkMode, setDarkMode }: NavbarProps) => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Cloud className="h-8 w-8 text-blue-500" />
            <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Mini Project Cloud
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/')
                  ? 'bg-blue-500 text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/dashboard')
                  ? 'bg-blue-500 text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tableau de bord
            </Link>
            <Link
              to="/create-vm"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/create-vm')
                  ? 'bg-blue-500 text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Créer une VM
            </Link>
            <Link
              to="/instances"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/instances')
                  ? 'bg-blue-500 text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Mes Instances
            </Link>
            <Link
              to="/deployments"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/deployments')
                  ? 'bg-blue-500 text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Déploiements
            </Link>
            <Link
              to="/docs"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/docs')
                  ? 'bg-blue-500 text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Documentation
            </Link>
            <Link
              to="/test-connection"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/test-connection')
                  ? 'bg-green-500 text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              title="Tester la connexion API"
            >
              🔌 Test API
            </Link>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-md ${
                darkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

