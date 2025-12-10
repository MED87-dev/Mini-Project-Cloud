import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import CreateVM from './pages/CreateVM'
import Instances from './pages/Instances'
import DeploymentHistory from './pages/DeploymentHistory'
import Documentation from './pages/Documentation'
import TestConnection from './components/TestConnection'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
      document.body.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-vm" element={<CreateVM />} />
            <Route path="/instances" element={<Instances />} />
            <Route path="/deployments" element={<DeploymentHistory />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/test-connection" element={<TestConnection />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

