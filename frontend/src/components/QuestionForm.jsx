import { useState } from 'react'
import '../styles/QuestionForm.css'

function QuestionForm({ painArea, onSubmit }) {
  const [formData, setFormData] = useState({
    duration: '1-3 days',
    severity: 5,
    symptoms: [],
    onset: 'sudden',
    activities: [],
  })

  const [currentQuestion, setCurrentQuestion] = useState(0)

  const symptomOptions = [
    'Swelling',
    'Redness',
    'Numbness',
    'Tingling',
    'Weakness',
    'Stiffness',
    'Bruising',
    'Other',
  ]

  const activityOptions = [
    'Rest makes it better',
    'Movement makes it worse',
    'Occurred during activity',
    'Came without doing anything',
    'Weather-related',
  ]

  const questions = [
    {
      id: 'duration',
      question: 'How long have you had this pain?',
      type: 'select',
      options: ['Less than 1 hour', '1-3 days', '1-2 weeks', '2-4 weeks', 'More than 1 month'],
    },
    {
      id: 'severity',
      question: 'How severe is the pain on a scale of 1-10?',
      type: 'slider',
      min: 1,
      max: 10,
    },
    {
      id: 'onset',
      question: 'Did the pain come on suddenly or gradually?',
      type: 'select',
      options: ['Sudden', 'Gradual', 'Not sure'],
    },
    {
      id: 'symptoms',
      question: 'Which additional symptoms do you have?',
      type: 'checkbox',
      options: symptomOptions,
    },
    {
      id: 'activities',
      question: 'Select what applies to your situation:',
      type: 'checkbox',
      options: activityOptions,
    },
  ]

  const currentQuestionData = questions[currentQuestion]

  const handleAnswerChange = (value) => {
    if (currentQuestionData.type === 'checkbox') {
      const key = currentQuestionData.id
      setFormData((prev) => {
        const updatedArray = prev[key].includes(value)
          ? prev[key].filter((item) => item !== value)
          : [...prev[key], value]
        return { ...prev, [key]: updatedArray }
      })
    } else if (currentQuestionData.type === 'slider') {
      setFormData((prev) => ({
        ...prev,
        [currentQuestionData.id]: value,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [currentQuestionData.id]: value.toLowerCase(),
      }))
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="question-form">
      <div className="form-container card">
        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <p className="progress-text">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        {/* Question */}
        <form onSubmit={handleSubmit} className="form-content">
          <div className="question-container">
            <h3 className="question-title">{currentQuestionData.question}</h3>

            {/* Select Type */}
            {currentQuestionData.type === 'select' && (
              <div className="form-group">
                <div className="select-options">
                  {currentQuestionData.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`option-btn ${
                        formData[currentQuestionData.id]?.toLowerCase() === option.toLowerCase()
                          ? 'active'
                          : ''
                      }`}
                      onClick={() => handleAnswerChange(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Slider Type */}
            {currentQuestionData.type === 'slider' && (
              <div className="form-group slider-group">
                <div className="slider-container">
                  <input
                    type="range"
                    min={currentQuestionData.min}
                    max={currentQuestionData.max}
                    value={formData[currentQuestionData.id]}
                    onChange={(e) => handleAnswerChange(parseInt(e.target.value))}
                    className="slider-input"
                  />
                  <div className="slider-value-display">
                    <span className="severity-label">
                      {formData[currentQuestionData.id] <= 3
                        ? '🟢 Mild'
                        : formData[currentQuestionData.id] <= 6
                        ? '🟡 Moderate'
                        : '🔴 Severe'}
                    </span>
                    <span className="severity-number">{formData[currentQuestionData.id]}/10</span>
                  </div>
                </div>
                <div className="slider-labels">
                  <span>No Pain</span>
                  <span>Severe Pain</span>
                </div>
              </div>
            )}

            {/* Checkbox Type */}
            {currentQuestionData.type === 'checkbox' && (
              <div className="form-group checkbox-group">
                {currentQuestionData.options.map((option) => (
                  <label key={option} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData[currentQuestionData.id].includes(option)}
                      onChange={(e) => handleAnswerChange(option)}
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    <span className="checkbox-text">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="form-navigation">
            <button
              type="button"
              onClick={handlePrev}
              className="btn btn-secondary"
              disabled={currentQuestion === 0}
            >
              ← Previous
            </button>

            {currentQuestion < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-warm"
              >
                Analyze Symptoms →
              </button>
            )}
          </div>
        </form>

        {/* Question Indicators */}
        <div className="question-indicators">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`indicator ${index === currentQuestion ? 'active' : ''} ${
                index < currentQuestion ? 'completed' : ''
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuestionForm
