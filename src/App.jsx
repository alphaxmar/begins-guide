import { useState, useEffect } from 'react'
import Home from './pages/Home'
import About from './pages/About'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import IdeaValidator from './pages/IdeaValidator'
import BookPage from './pages/BookPage'
import FirebaseTest from './components/FirebaseTest'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  // Simple hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home'
      setCurrentPage(hash)
    }

    // Set initial page based on hash
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <About />
      case 'auth':
        return <AuthPage />
      case 'dashboard':
        return <DashboardPage />
      case 'firebase-test':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <FirebaseTest />
          </div>
        )
      case 'idea-validator':
        return <IdeaValidator />
      case 'book':
        return <BookPage />
      default:
        return <Home />
    }
  }

  return (
    <div className="App">
      {renderPage()}
    </div>
  )
}

export default App
