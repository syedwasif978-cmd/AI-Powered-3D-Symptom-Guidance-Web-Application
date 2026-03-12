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
    const response = await api.post('/analyze', {
      pain_area: analysisData.painArea,
      duration: analysisData.duration,
      severity: analysisData.severity,
      symptoms: analysisData.symptoms,
      onset: analysisData.onset,
      activities: analysisData.activities,
    })
    return response.data
  } catch (error) {
    console.error('Error analyzing symptoms:', error)
    throw error
  }
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
