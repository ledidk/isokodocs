import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './i18n'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import DocumentList from './pages/DocumentList'
import DocumentDetail from './pages/DocumentDetail'
import Upload from './pages/Upload'
import Login from './pages/Login'
import Register from './pages/Register'
import ModeratorDashboard from './pages/ModeratorDashboard'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Takedown from './pages/Takedown'
import { AuthProvider } from './context/AuthContext'

function App() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load categories on app start
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories/')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.results || data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading IsokoDocs...</p>
      </div>
    )
  }

  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <div style={{ display: 'flex' }}>
            <Sidebar categories={categories} />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home categories={categories} />} />
                <Route path="/category/:categoryId" element={<DocumentList />} />
                <Route path="/documents" element={<DocumentList />} />
                <Route path="/document/:documentId" element={<DocumentDetail />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/moderator" element={<ModeratorDashboard />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/takedown" element={<Takedown />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
