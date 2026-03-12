import { useState, useEffect } from 'react'
import { analyzeSymptoms } from '../utils/api'
import ResultCard from '../components/ResultCard'
import '../styles/Results.css'

function Results({ data, onNavigateHome }) {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('causes')

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        
        // Call backend to get AI analysis
        const analysisResults = await analyzeSymptoms(data)
        setResults(analysisResults)
        setError(null)
      } catch (err) {
        console.error('Error fetching results:', err)
        setError('Failed to fetch analysis. Please ensure the backend is running on http://localhost:8000')
      } finally {
        setLoading(false)
      }
    }

    if (data) {
      fetchResults()
    }
  }, [data])

  return (
    <div className="results-page">
      {/* Background Elements */}
      <div className="results-decoration results-deco-1"></div>
      <div className="results-decoration results-deco-2"></div>

      <div className="content">
        {/* Header */}
        <div className="results-header fade-in">
          <button className="btn btn-secondary back-btn" onClick={onNavigateHome}>
            ← Back to Analysis
          </button>
          <h1 className="gradient-text">Your Analysis Results</h1>
          <p>Based on your symptoms and pain location</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state fade-in">
            <div className="loading-spinner"></div>
            <p>Analyzing your symptoms with AI...</p>
            <div className="loading-bar">
              <div className="loading-bar-progress"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error-card fade-in">
            <div className="error-icon">⚠️</div>
            <h3>Unable to Fetch Results</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={onNavigateHome}>
              Try Again
            </button>
          </div>
        )}

        {/* Results Display */}
        {results && !loading && (
          <div className="results-container slide-up">
            {/* Summary Card */}
            <div className="summary-card card">
              <div className="card-content">
                <h2>Health Overview</h2>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Pain Location</span>
                    <span className="summary-value">{data.painArea.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Severity</span>
                    <span className="summary-value">{data.severity}/10</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Duration</span>
                    <span className="summary-value">{data.duration}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Status</span>
                    <span className="summary-value">
                      {results.is_serious ? '⚠️ Serious' : '✅ Non-Critical'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Red Flag Warning */}
            {results.red_flags && results.red_flags.length > 0 && (
              <div className="warning-card card slide-up">
                <div className="warning-icon">🚨</div>
                <div className="card-content">
                  <h3>Important Warnings</h3>
                  <ul className="warning-list">
                    {results.red_flags.map((flag, index) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </ul>
                  <p className="warning-note">
                    ⚠️ If you experience these symptoms, please seek professional medical attention immediately.
                  </p>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="results-tabs slide-up">
              <button
                className={`tab-btn ${activeTab === 'causes' ? 'active' : ''}`}
                onClick={() => setActiveTab('causes')}
              >
                <span className="tab-icon">🔍</span> Possible Causes
              </button>
              <button
                className={`tab-btn ${activeTab === 'remedies' ? 'active' : ''}`}
                onClick={() => setActiveTab('remedies')}
              >
                <span className="tab-icon">🏥</span> Home Remedies
              </button>
              <button
                className={`tab-btn ${activeTab === 'otc' ? 'active' : ''}`}
                onClick={() => setActiveTab('otc')}
              >
                <span className="tab-icon">💊</span> OTC Guidance
              </button>
              <button
                className={`tab-btn ${activeTab === 'professional' ? 'active' : ''}`}
                onClick={() => setActiveTab('professional')}
              >
                <span className="tab-icon">👨‍⚕️</span> Professional Help
              </button>
            </div>

            {/* Content */}
            <div className="results-content slide-up">
              {activeTab === 'causes' && (
                <div className="results-section">
                  <h3>Possible Causes</h3>
                  <div className="results-grid">
                    {results.possible_causes?.map((cause, index) => (
                      <ResultCard
                        key={index}
                        title={cause.condition}
                        description={cause.description}
                        icon="🏥"
                        likelihood={cause.likelihood}
                        type="cause"
                      />
                    )) || (
                      <p className="no-data">
                        No specific causes identified. Consult a healthcare professional for diagnosis.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'remedies' && (
                <div className="results-section">
                  <h3>Home Remedies</h3>
                  <div className="results-grid">
                    {results.home_remedies?.map((remedy, index) => (
                      <ResultCard
                        key={index}
                        title={remedy}
                        description="Safe home treatment option"
                        icon="🌿"
                        type="remedy"
                      />
                    )) || (
                      <p className="no-data">
                        Rest and monitor your symptoms. Seek professional help if symptoms persist.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'otc' && (
                <div className="results-section">
                  <h3>Over-The-Counter Medication Guidance</h3>
                  <p className="otc-disclaimer">
                    💡 Always consult a pharmacist or doctor before taking any medication.
                  </p>
                  <div className="results-grid">
                    {results.otc_guidance?.map((otc, index) => (
                      <ResultCard
                        key={index}
                        title={otc.medication}
                        description={otc.usage}
                        icon="💊"
                        type="otc"
                      />
                    )) || (
                      <p className="no-data">
                        No specific OTC medications recommended. Consult a pharmacist for guidance.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'professional' && (
                <div className="results-section">
                  <h3>When to Seek Professional Help</h3>
                  <div className="professional-grid">
                    <div className="professional-card card">
                      <h4>🩺 Doctor Visit</h4>
                      <p>
                        {results.when_to_see_doctor ||
                          'If symptoms persist beyond 2 weeks or worsen, consult a healthcare provider.'}
                      </p>
                    </div>
                    <div className="professional-card card">
                      <h4>🚑 Emergency</h4>
                      <p>
                        Seek immediate emergency care if experiencing severe pain, difficulty breathing,
                        chest pain, or loss of consciousness.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="results-actions slide-up">
              <button className="btn btn-primary" onClick={onNavigateHome}>
                ← New Analysis
              </button>
              <button className="btn btn-secondary">
                📥 Download Report
              </button>
            </div>

            {/* Final Disclaimer */}
            <div className="final-disclaimer card">
              <h4>⚠️ Important Disclaimer</h4>
              <p>
                This AI-powered guidance is for informational purposes only. It is NOT a substitute
                for professional medical advice, diagnosis, or treatment. Always consult with a qualified
                healthcare provider for accurate medical guidance. In case of emergency, call 911 or your
                local emergency services immediately.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Results

  return (
    <div className="results-page">
      {/* Background Elements */}
      <div className="results-decoration results-deco-1"></div>
      <div className="results-decoration results-deco-2"></div>

      <div className="content">
        {/* Header */}
        <div className="results-header fade-in">
          <button className="btn btn-secondary back-btn" onClick={onNavigateHome}>
            ← Back to Analysis
          </button>
          <h1 className="gradient-text">Your Analysis Results</h1>
          <p>Based on your symptoms and pain location</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state fade-in">
            <div className="loading-spinner"></div>
            <p>Analyzing your symptoms with AI...</p>
            <div className="loading-bar">
              <div className="loading-bar-progress"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error-card fade-in">
            <div className="error-icon">⚠️</div>
            <h3>Unable to Fetch Results</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={onNavigateHome}>
              Try Again
            </button>
          </div>
        )}

        {/* Results Display */}
        {results && !loading && (
          <div className="results-container slide-up">
            {/* Summary Card */}
            <div className="summary-card card">
              <div className="card-content">
                <h2>Health Overview</h2>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Pain Location</span>
                    <span className="summary-value">{data.painArea.replace('_', ' ')}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Severity</span>
                    <span className="summary-value">{data.severity}/10</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Duration</span>
                    <span className="summary-value">{data.duration}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Status</span>
                    <span className="summary-value">
                      {results.is_serious ? '⚠️ Serious' : '✅ Non-Critical'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Red Flag Warning */}
            {results.red_flags && results.red_flags.length > 0 && (
              <div className="warning-card card slide-up">
                <div className="warning-icon">🚨</div>
                <div className="card-content">
                  <h3>Important Warnings</h3>
                  <ul className="warning-list">
                    {results.red_flags.map((flag, index) => (
                      <li key={index}>{flag}</li>
                    ))}
                  </ul>
                  <p className="warning-note">
                    ⚠️ If you experience these symptoms, please seek professional medical attention immediately.
                  </p>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="results-tabs slide-up">
              <button
                className={`tab-btn ${activeTab === 'causes' ? 'active' : ''}`}
                onClick={() => setActiveTab('causes')}
              >
                <span className="tab-icon">🔍</span> Possible Causes
              </button>
              <button
                className={`tab-btn ${activeTab === 'remedies' ? 'active' : ''}`}
                onClick={() => setActiveTab('remedies')}
              >
                <span className="tab-icon">🏥</span> Home Remedies
              </button>
              <button
                className={`tab-btn ${activeTab === 'otc' ? 'active' : ''}`}
                onClick={() => setActiveTab('otc')}
              >
                <span className="tab-icon">💊</span> OTC Guidance
              </button>
              <button
                className={`tab-btn ${activeTab === 'professional' ? 'active' : ''}`}
                onClick={() => setActiveTab('professional')}
              >
                <span className="tab-icon">👨‍⚕️</span> Professional Help
              </button>
            </div>

            {/* Content */}
            <div className="results-content slide-up">
              {activeTab === 'causes' && (
                <div className="results-section">
                  <h3>Possible Causes</h3>
                  <div className="results-grid">
                    {results.possible_causes?.map((cause, index) => (
                      <ResultCard
                        key={index}
                        title={cause.condition}
                        description={cause.description}
                        icon="🏥"
                        likelihood={cause.likelihood}
                        type="cause"
                      />
                    )) || (
                      <p className="no-data">
                        No specific causes identified. Consult a healthcare professional for diagnosis.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'remedies' && (
                <div className="results-section">
                  <h3>Home Remedies</h3>
                  <div className="results-grid">
                    {results.home_remedies?.map((remedy, index) => (
                      <ResultCard
                        key={index}
                        title={remedy}
                        description="Safe home treatment option"
                        icon="🌿"
                        type="remedy"
                      />
                    )) || (
                      <p className="no-data">
                        Rest and monitor your symptoms. Seek professional help if symptoms persist.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'otc' && (
                <div className="results-section">
                  <h3>Over-The-Counter Medication Guidance</h3>
                  <p className="otc-disclaimer">
                    💡 Always consult a pharmacist or doctor before taking any medication.
                  </p>
                  <div className="results-grid">
                    {results.otc_guidance?.map((otc, index) => (
                      <ResultCard
                        key={index}
                        title={otc.medication}
                        description={otc.usage}
                        icon="💊"
                        type="otc"
                      />
                    )) || (
                      <p className="no-data">
                        No specific OTC medications recommended. Consult a pharmacist for guidance.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'professional' && (
                <div className="results-section">
                  <h3>When to Seek Professional Help</h3>
                  <div className="professional-grid">
                    <div className="professional-card card">
                      <h4>🩺 Doctor Visit</h4>
                      <p>
                        {results.when_to_see_doctor ||
                          'If symptoms persist beyond 2 weeks or worsen, consult a healthcare provider.'}
                      </p>
                    </div>
                    <div className="professional-card card">
                      <h4>🚑 Emergency</h4>
                      <p>
                        Seek immediate emergency care if experiencing severe pain, difficulty breathing,
                        chest pain, or loss of consciousness.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="results-actions slide-up">
              <button className="btn btn-primary" onClick={onNavigateHome}>
                ← New Analysis
              </button>
              <button className="btn btn-secondary">
                📥 Download Report
              </button>
            </div>

            {/* Final Disclaimer */}
            <div className="final-disclaimer card">
              <h4>⚠️ Important Disclaimer</h4>
              <p>
                This AI-powered guidance is for informational purposes only. It is NOT a substitute
                for professional medical advice, diagnosis, or treatment. Always consult with a qualified
                healthcare provider for accurate medical guidance. In case of emergency, call 911 or your
                local emergency services immediately.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Results
