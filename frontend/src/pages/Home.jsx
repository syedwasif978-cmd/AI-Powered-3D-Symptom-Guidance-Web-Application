import { useState, useRef, useEffect } from 'react'
import QuestionForm from '../components/QuestionForm'
import AnatomyModel from '../components/AnatomyModel'
import '../styles/Home.css'

function Home({ onNavigateToResults }) {
  const [selectedPainArea, setSelectedPainArea] = useState(null)
  const [step, setStep] = useState('hero') // hero, selection, analysis
  const heroRef = useRef(null)
  const selectionRef = useRef(null)

  const handleStartAnalysis = () => {
    setStep('selection')
    setTimeout(() => {
      selectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handlePainAreaSelected = (area) => {
    setSelectedPainArea(area)
  }

  const handleFormSubmit = (formData) => {
    const completeData = {
      painArea: selectedPainArea,
      ...formData
    }
    onNavigateToResults(completeData)
  }

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      {step === 'hero' && (
        <section className="hero-section" ref={heroRef}>
          <div className="hero-content fade-in">
            {/* Animated Background Elements */}
            <div className="hero-shape hero-shape-1"></div>
            <div className="hero-shape hero-shape-2"></div>
            <div className="hero-shape hero-shape-3"></div>

            {/* Main Hero Content */}
            <div className="hero-text">
              <h1 className="hero-title">
                <span className="gradient-text">Intelligent</span> Symptom <br /> Guidance
              </h1>
              <p className="hero-subtitle">
                Discover AI-powered insights about your health. Interact with a 3D human anatomy model to pinpoint pain locations and receive comprehensive guidance.
              </p>

              {/* Feature Highlights */}
              <div className="feature-highlights">
                <div className="highlight-item">
                  <div className="highlight-icon">🧠</div>
                  <div className="highlight-text">
                    <h4>AI-Powered</h4>
                    <p>Advanced analysis</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">🎯</div>
                  <div className="highlight-text">
                    <h4>Precise Mapping</h4>
                    <p>3D body model</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">⚡</div>
                  <div className="highlight-text">
                    <h4>Fast Results</h4>
                    <p>Instant guidance</p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button className="btn btn-primary hero-cta" onClick={handleStartAnalysis}>
                Start Health Analysis
                <span className="btn-arrow">→</span>
              </button>

              {/* Disclaimer */}
              <p className="disclaimer">
                ⚠️ This tool provides informational guidance only and does NOT replace professional medical advice.
              </p>
            </div>

            {/* Hero Illustration Area */}
            <div className="hero-illustration">
              <div className="floating-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
              </div>

              {/* Animated SVG Icons */}
              <div className="animated-icons">
                <div className="icon-heart animated-icon">💚</div>
                <div className="icon-dna animated-icon">🧬</div>
                <div className="icon-medical animated-icon">⚕️</div>
                <div className="icon-brain animated-icon">🧠</div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="scroll-indicator" onClick={handleStartAnalysis}>
            <div className="scroll-arrow"></div>
            <span>Explore</span>
          </div>
        </section>
      )}

      {/* SELECTION SECTION */}
      {step === 'selection' && (
        <section className="selection-section" ref={selectionRef}>
          <div className="content">
            <div className="section-header slide-up">
              <h2>Select Your Pain Location</h2>
              <p>Interact with the 3D anatomy model or choose from common areas</p>
            </div>

            <div className="selection-grid">
              {/* 3D Anatomy Model */}
              <div className="anatomy-container slide-up">
                <div className="anatomy-header">
                  <h3>3D Body Model</h3>
                  <p className="anatomy-subtitle">Click on the model to select pain location</p>
                </div>
                <AnatomyModel onAreaSelected={handlePainAreaSelected} />
              </div>

              {/* Quick Select Areas */}
              <div className="quick-select slide-up">
                <h3>Quick Select</h3>
                <div className="body-areas">
                  {[
                    { name: 'Head', emoji: '🗣️', area: 'head' },
                    { name: 'Chest', emoji: '🫀', area: 'chest' },
                    { name: 'Stomach', emoji: '🫔', area: 'stomach' },
                    { name: 'Left Arm', emoji: '💪', area: 'left_arm' },
                    { name: 'Right Arm', emoji: '💪', area: 'right_arm' },
                    { name: 'Left Leg', emoji: '🦵', area: 'left_leg' },
                    { name: 'Right Leg', emoji: '🦵', area: 'right_leg' },
                    { name: 'Back', emoji: '🔙', area: 'back' },
                  ].map((area) => (
                    <button
                      key={area.area}
                      className={`area-btn ${selectedPainArea === area.area ? 'active' : ''}`}
                      onClick={() => handlePainAreaSelected(area.area)}
                    >
                      <span className="area-emoji">{area.emoji}</span>
                      <span className="area-name">{area.name}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Area Display */}
                {selectedPainArea && (
                  <div className="selected-display scale-in">
                    <div className="selected-icon">✓</div>
                    <p>
                      Pain location selected: <strong>{selectedPainArea.replace('_', ' ').toUpperCase()}</strong>
                    </p>
                  </div>
                )}

                {/* Next Button */}
                {selectedPainArea && (
                  <button
                    className="btn btn-warm next-btn"
                    onClick={() => setStep('analysis')}
                  >
                    Continue to Symptoms
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ANALYSIS SECTION */}
      {step === 'analysis' && (
        <section className="analysis-section">
          <div className="content">
            <div className="section-header slide-up">
              <h2>Tell Us More</h2>
              <p>Answer questions to help us provide better guidance</p>
              {selectedPainArea && (
                <p className="selected-info">
                  Pain Location: <strong>{selectedPainArea.replace('_', ' ').toUpperCase()}</strong>
                </p>
              )}
            </div>

            <QuestionForm
              painArea={selectedPainArea}
              onSubmit={handleFormSubmit}
            />
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
