import '../styles/ResultCard.css'

function ResultCard({ title, description, icon, likelihood, type }) {
  return (
    <div className={`result-card card result-${type}`}>
      <div className="result-icon">{icon}</div>
      <div className="result-content">
        <h4 className="result-title">{title}</h4>
        <p className="result-description">{description}</p>
        {likelihood && (
          <div className="likelihood-indicator">
            <div className="likelihood-bar">
              <div className="likelihood-fill" style={{ width: `${likelihood}%` }}></div>
            </div>
            <span className="likelihood-text">{likelihood}% likelihood</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultCard
