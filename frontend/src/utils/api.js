import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Analyze symptoms and get guidance
export const analyzeSymptoms = async (analysisData) => {
  try {
    // Transform frontend data to match backend expectations
    const transformedData = {
      location: analysisData.painArea,
      pain_type: getPainTypeFromSeverity(analysisData.severity),
      duration_days: convertDurationToDays(analysisData.duration),
      symptoms: convertSymptomsToDict(analysisData.symptoms, analysisData.onset, analysisData.activities),
    }

    // Allow demo mode to be triggered from frontend during local showcase.
    // Demo is hidden/controlled server-side by `DEMO_MODE` env var; frontend
    // still sends the normal request. Server will return demo response when
    // enabled.
    const response = await api.post('/analyze', transformedData)
    return response.data
  } catch (error) {
    console.error('Error analyzing symptoms:', error)
    throw error
  }
}

// Helper functions to transform data
const getPainTypeFromSeverity = (severity) => {
  if (severity <= 3) return 'mild'
  if (severity <= 7) return 'moderate'
  return 'severe'
}

const convertDurationToDays = (duration) => {
  const durationMap = {
    'Less than 1 hour': 1,
    '1-3 days': 2,
    '1-2 weeks': 10,
    '2-4 weeks': 21,
    'More than 1 month': 45,
  }
  return durationMap[duration] || 1
}

const convertSymptomsToDict = (symptoms, onset, activities) => {
  const symptomDict = {}

  // Convert symptoms array to boolean dict
  if (symptoms && Array.isArray(symptoms)) {
    symptoms.forEach(symptom => {
      symptomDict[symptom.toLowerCase()] = true
    })
  }

  // Add onset information
  if (onset) {
    symptomDict['onset_' + onset.toLowerCase()] = true
  }

  // Add activity information
  if (activities && Array.isArray(activities)) {
    activities.forEach(activity => {
      const key = activity.toLowerCase().replace(/\s+/g, '_')
      symptomDict[key] = true
    })
  }

  return symptomDict
}

// Get pain map data
export const getPainMap = async () => {
  try {
    const response = await api.get('/pain-map')
    return response.data
  } catch (error) {
    console.error('Error fetching pain map:', error)
    throw error
  }
}

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health')
    return response.data
  } catch (error) {
    console.error('Error checking health:', error)
    throw error
  }
}

export default api
