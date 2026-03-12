// Mock data for development and testing without backend
export const mockAnalysisResults = {
  is_serious: false,
  red_flags: [
    'Severe chest pain combined with shortness of breath',
    'Severe headache with stiff neck and fever'
  ],
  possible_causes: [
    {
      condition: 'Muscle Strain',
      description: 'Overstretching or microtears in muscle fibers from activity or posture.',
      likelihood: 65
    },
    {
      condition: 'Anxiety',
      description: 'Tension and stress can cause chest tightness and discomfort.',
      likelihood: 45
    },
    {
      condition: 'Minor Ligament Sprain',
      description: 'Partial tear in ligaments connecting joints.',
      likelihood: 35
    }
  ],
  home_remedies: [
    'Apply ice for 15 minutes, 3-4 times daily',
    'Rest and avoid strenuous activity',
    'Use heat therapy after 48 hours',
    'Gentle stretching exercises',
    'Stay hydrated and eat anti-inflammatory foods'
  ],
  otc_guidance: [
    {
      medication: 'Ibuprofen (Advil/Motrin)',
      usage: '200-400mg every 4-6 hours, max 1200mg/day without doctor'
    },
    {
      medication: 'Acetaminophen (Tylenol)',
      usage: '500-1000mg every 4-6 hours, max 3000mg/day'
    },
    {
      medication: 'Aspirin',
      usage: '325-500mg every 4-6 hours if no contraindications'
    }
  ],
  when_to_see_doctor: 'If pain persists beyond 2 weeks, worsens significantly, or is accompanied by other symptoms.'
}

export const mockPainAreas = [
  { id: 'head', name: 'Head', emoji: '🗣️' },
  { id: 'chest', name: 'Chest', emoji: '🫀' },
  { id: 'stomach', name: 'Stomach', emoji: '🫔' },
  { id: 'left_arm', name: 'Left Arm', emoji: '💪' },
  { id: 'right_arm', name: 'Right Arm', emoji: '💪' },
  { id: 'left_leg', name: 'Left Leg', emoji: '🦵' },
  { id: 'right_leg', name: 'Right Leg', emoji: '🦵' },
  { id: 'back', name: 'Back', emoji: '🔙' }
]

export const mockFormData = {
  duration: '1-3 days',
  severity: 5,
  symptoms: ['Swelling', 'Redness'],
  onset: 'sudden',
  activities: ['Movement makes it worse']
}
