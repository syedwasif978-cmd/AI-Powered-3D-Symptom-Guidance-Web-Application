import { useState } from 'react'
import Home from './pages/Home'
import Results from './pages/Results'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [resultsData, setResultsData] = useState(null)

  const handleNavigateToResults = (data) => {
    setResultsData(data)
    setCurrentPage('results')
  }

  const handleNavigateHome = () => {
    setCurrentPage('home')
  }

  return (
    <div className="App">
      {/* Abstract Calligraphy Background */}
      <div className="calligraphy-bg">
        <div className="calligraphy-element calligraphy-1"></div>
        <div className="calligraphy-element calligraphy-2"></div>
        <div className="calligraphy-element calligraphy-3"></div>
        <div className="calligraphy-element calligraphy-4"></div>
      </div>

      {/* Floating Widgets */}
      <div className="floating-widget widget-heart" title="Healthcare">💚</div>
      <div className="floating-widget widget-brain" title="AI Powered">🧠</div>
      <div className="floating-widget widget-dna" title="Human Body">🧬</div>
      <div className="floating-widget widget-health" title="Wellness">⚕️</div>

      {/* Decorative Shapes */}
      <div className="shape shape-square" style={{ top: '10%', left: '5%' }}></div>
      <div className="shape shape-circle" style={{ top: '60%', right: '5%' }}></div>
      <div className="shape shape-square" style={{ bottom: '15%', left: '15%' }}></div>

      {/* Navigation */}
      <nav>
        <div className="nav-container">
          <div className="nav-logo">
            Medi<span>AI</span>
          </div>
          <ul>
            <li>
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handleNavigateHome()
                }}
              >
                Home
              </a>
            </li>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-container">
        {currentPage === 'home' ? (
          <Home onNavigateToResults={handleNavigateToResults} />
        ) : (
          <Results data={resultsData} onNavigateHome={handleNavigateHome} />
        )}
      </div>
    </div>
  )
}

export default App
