# 🧩 Component Documentation

## Overview
This document outlines all React components in the MediAI frontend, their props, state, and usage.

---

## Core Components

### 1. App.jsx
**Purpose**: Main application wrapper with routing logic

**State**:
- `currentPage`: 'home' | 'results'
- `resultsData`: Analysis data object

**Props**: None

**Key Functions**:
- `handleNavigateToResults()`: Switch to results page with data
- `handleNavigateHome()`: Return to home page

**Rendered Content**:
- Calligraphy background
- Floating widgets
- Decorative shapes
- Navigation bar
- Current page component

---

## Page Components

### 2. Home.jsx
**Purpose**: Landing page with pain selection and form

**Location**: `src/pages/Home.jsx`

**State**:
- `selectedPainArea`: string (selected pain location)
- `step`: 'hero' | 'selection' | 'analysis'

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| `onNavigateToResults` | function | Callback when form submitted |

**Child Components**:
- `AnatomyModel`
- `QuestionForm`

**Sections**:
1. **Hero Section**: Landing with CTAs
2. **Selection Section**: Pain area picker
3. **Analysis Section**: Symptom questionnaire

---

### 3. Results.jsx
**Purpose**: Display AI analysis results with guidance

**Location**: `src/pages/Results.jsx`

**State**:
- `results`: API response object
- `loading`: boolean
- `error`: error message
- `activeTab`: 'causes' | 'remedies' | 'otc' | 'professional'

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| `data` | object | Submitted form data |
| `onNavigateHome` | function | Navigate home callback |

**Child Components**:
- `ResultCard`

**Sections**:
1. **Header**: Navigation and title
2. **Loading State**: Spinner while fetching
3. **Error State**: Error message display
4. **Summary Card**: Overview of analysis
5. **Warning Card**: Red flag alerts
6. **Tabs**: Different result categories
7. **Final Disclaimer**: Important medical notice

---

## Feature Components

### 4. AnatomyModel.jsx
**Purpose**: Interactive 2D canvas body model for pain selection

**Location**: `src/components/AnatomyModel.jsx`

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| `onAreaSelected` | function | Called when area clicked |

**State**:
- `hoveredArea`: string | null

**Features**:
- Canvas-based 2D body representation
- 8 interactive body areas
- Hover effects with highlighting
- Click detection with radius calculation
- Animated labels

**Body Areas**:
```javascript
['head', 'chest', 'stomach', 'left_arm', 'right_arm', 'left_leg', 'right_leg', 'back']
```

**Canvas Drawing**:
- Head (circle at top)
- Body outline (rectangle)
- Arms (lines)
- Legs (lines)
- Interactive circles around each area

---

### 5. QuestionForm.jsx
**Purpose**: Multi-step symptom questionnaire

**Location**: `src/components/QuestionForm.jsx`

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| `painArea` | string | Selected pain location |
| `onSubmit` | function | Form submission callback |

**State**:
- `formData`: Form values object
- `currentQuestion`: Current question index

**Form Questions**:
1. **Duration**: Select (< 1 hour, 1-3 days, 1-2 weeks, 2-4 weeks, > 1 month)
2. **Severity**: Slider (1-10)
3. **Onset**: Select (sudden, gradual, not sure)
4. **Symptoms**: Checkbox (swelling, redness, numbness, etc.)
5. **Activities**: Checkbox (rest helps, movement hurts, etc.)

**Features**:
- Multi-step form with progress bar
- Previous/Next navigation
- Visual progress indicators
- Input validation (optional)
- Animated transitions

---

### 6. ResultCard.jsx
**Purpose**: Display individual result in grid format

**Location**: `src/components/ResultCard.jsx`

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| `title` | string | Card title |
| `description` | string | Card description |
| `icon` | string | Emoji/icon |
| `likelihood` | number | 0-100 (optional) |
| `type` | string | 'cause' \| 'remedy' \| 'otc' |

**Features**:
- Gradient background
- Icon display
- Title and description
- Likelihood bar (for causes)
- Hover animation
- Different styling by type

---

## Utility Files

### 7. api.js
**Purpose**: API communication with backend

**Location**: `src/utils/api.js`

**Functions**:
```javascript
analyzeSymptoms(analysisData)  // POST /analyze
getPainMap()                    // GET /pain-map
healthCheck()                   // GET /health
```

**Base URL**:
- Default: `http://localhost:8000`
- Configurable: `VITE_API_URL` environment variable

---

### 8. mockData.js
**Purpose**: Mock data for development and testing

**Location**: `src/utils/mockData.js`

**Exports**:
- `mockAnalysisResults`: Sample API response
- `mockPainAreas`: Available pain locations
- `mockFormData`: Sample form submission

---

## Styling Components

### Global Styles: index.css
**Contains**:
- CSS variables for colors, shadows, gradients
- Base element styles
- Animation keyframes
- Responsive utilities
- Scrollbar styling

### Page Styles:
- `Home.css`: Hero, selection, analysis sections
- `Results.css`: Results page layout
- `QuestionForm.css`: Form styling
- `AnatomyModel.css`: Canvas styling

### Component Styles:
- `ResultCard.css`: Result card styling
- `App.css`: Main container

---

## Component Flow Diagram

```
App
├── Navigation Bar
├── Background Elements
├── Floating Widgets
├── Home Page
│   ├── Hero Section
│   ├── Pain Selection
│   │   ├── AnatomyModel
│   │   └── Quick Select Buttons
│   └── Question Form
│       └── QuestionForm
└── Results Page
    ├── Summary Card
    ├── Warning Cards
    ├── Tabs
    └── Result Cards
        └── ResultCard (multiple)
```

---

## Data Flow

### Form Submission Flow
```
Home (filled form data)
  ↓
App (state: resultsData)
  ↓
Results (useEffect triggers API call)
  ↓
api.js (analyzeSymptoms())
  ↓
Backend API
  ↓
Results (sets results state)
  ↓
ResultCard (displays data)
```

---

## Props Validation

### Home.jsx Props
```javascript
Home.propTypes = {
  onNavigateToResults: PropTypes.func.isRequired
}
```

### Results.jsx Props
```javascript
Results.propTypes = {
  data: PropTypes.shape({
    painArea: PropTypes.string,
    duration: PropTypes.string,
    severity: PropTypes.number,
    symptoms: PropTypes.array,
    onset: PropTypes.string,
    activities: PropTypes.array
  }),
  onNavigateHome: PropTypes.func.isRequired
}
```

---

## Common Patterns

### API Call Pattern
```javascript
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
const [data, setData] = useState(null)

useEffect(() => {
  const fetchData = async () => {
    try {
      const result = await apiFunction(params)
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  fetchData()
}, [dependencies])
```

### Form State Pattern
```javascript
const [formData, setFormData] = useState({
  duration: '',
  severity: 5,
  symptoms: [],
  // ...
})

const handleChange = (value) => {
  setFormData(prev => ({
    ...prev,
    field: value
  }))
}
```

### Navigation Pattern
```javascript
const [currentPage, setCurrentPage] = useState('home')

const navigate = (page, data) => {
  setStateData(data)
  setCurrentPage(page)
}
```

---

## Advanced Features

### Canvas Animation
AnatomyModel uses HTML5 Canvas API:
- `ctx.arc()`: Draw circles for body parts
- `ctx.beginPath()`: Start drawing path
- `ctx.stroke()`: Draw outline
- Event listeners for interactivity

### Form Validation
QuestionForm implements:
- Required field checking
- Type validation
- Severity range (1-10)
- Symptom selection limits (optional)

### Animation Classes
```css
.fade-in { animation: fadeIn 0.8s ease-in forwards; }
.slide-up { animation: slideUp 0.8s ease-out forwards; }
.scale-in { animation: scaleIn 0.6s cubic-bezier(...); }
```

---

## Performance Optimization

### Code Splitting
- Pages loaded on demand
- Components separated by feature
- Styles co-located with components

### Memoization
- Use `React.memo()` for static components
- Use `useCallback()` for expensive functions
- Use `useMemo()` for derived state

### Asset Optimization
- Emoji icons (no image files)
- CSS-based animations (no JavaScript)
- Canvas rendering (no SVG assets)

---

## Testing Strategies

### Unit Tests
```javascript
// Test component renders
test('Home renders hero section', () => {
  render(<Home onNavigateToResults={jest.fn()} />)
  expect(screen.getByText(/Start Health Analysis/)).toBeInTheDocument()
})
```

### Integration Tests
```javascript
// Test form submission flow
test('Form submission navigates to results', async () => {
  const navigate = jest.fn()
  render(<Home onNavigateToResults={navigate} />)
  // Fill form and submit
  // Verify navigate was called
})
```

### E2E Tests
- Use Cypress or Playwright
- Test complete user flows
- Verify API integration

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Troubleshooting

### Component Not Rendering
1. Check props match expected types
2. Verify parent component passes props correctly
3. Check browser console for errors

### Styling Not Applied
1. Verify CSS file is imported
2. Check CSS selector specificity
3. Clear browser cache

### Data Not Loading
1. Verify backend is running
2. Check Network tab for API calls
3. Review error messages in console

---

**Last Updated**: March 2026
**Version**: 1.0.0
