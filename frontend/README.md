# 🎨 MediAI Frontend - Beautiful & Interactive Health Guidance UI

A stunning, modern React frontend for an AI-powered symptom guidance application with interactive 3D anatomy visualization.

## ✨ Features

### Design & Aesthetics
- **Unique Theme**: Medical AI fusion with calligraphy-inspired abstract backgrounds
- **Color Palette**: Deep blues, ethereal purples, teals, and warm accents
- **Floating Widgets**: Animated health-related emojis (brain, heart, DNA, medical symbols)
- **Glassmorphism Effects**: Modern frosted glass UI elements
- **Smooth Animations**: Floating, pulsing, and rotating elements
- **Responsive Design**: Beautiful on desktop, tablet, and mobile

### Interactive Components
- **3D Body Model Canvas**: Click-to-select pain locations with visual feedback
- **Quick Select Buttons**: Easy access to common pain areas
- **Multi-Step Form**: Progressive symptom questionnaire with smooth transitions
- **Animated Progress Bar**: Visual feedback as users advance through questions
- **Interactive Sliders**: Pain severity indicator with color coding
- **Tabbed Results**: Organized display of analysis results

### User Experience
- **Hero Section**: Engaging landing page with CTAs and feature highlights
- **Pain Selection**: Intuitive anatomy model with hover effects
- **Symptom Analysis**: Structured questionnaire with instant feedback
- **Results Dashboard**: Comprehensive health guidance with warnings
- **Smooth Navigation**: Page transitions and scroll animations

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

### Development Server

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AnatomyModel.jsx       # 3D body canvas component
│   │   ├── QuestionForm.jsx       # Multi-step symptom questionnaire
│   │   └── ResultCard.jsx         # Result display card component
│   ├── pages/
│   │   ├── Home.jsx               # Landing & selection page
│   │   └── Results.jsx            # Results & analysis page
│   ├── styles/
│   │   ├── Home.css               # Home page styles
│   │   ├── AnatomyModel.css       # Anatomy model styles
│   │   ├── QuestionForm.css       # Form styles
│   │   ├── Results.css            # Results page styles
│   │   └── ResultCard.css         # Card component styles
│   ├── utils/
│   │   └── api.js                 # API communication utilities
│   ├── App.jsx                    # Main app component
│   ├── App.css                    # Global app styles
│   ├── index.css                  # Global styles with theme variables
│   └── main.jsx                   # React entry point
├── index.html                     # HTML entry point
├── vite.config.js                 # Vite configuration
├── package.json                   # Dependencies
└── .env.example                   # Environment template
```

## 🎨 Design System

### Color Palette
- **Primary Deep Blue**: `#0d1f36`
- **Primary Blue**: `#1a3a52`
- **Primary Teal**: `#0ea5a8`
- **AI Purple**: `#7c3aed`
- **AI Lavender**: `#c4b5fd`
- **Accent Coral**: `#ff6b6b`
- **Accent Orange**: `#ff9a56`

### Gradients
- **Primary Gradient**: Blue → Purple
- **Secondary Gradient**: Teal → Purple
- **Warm Gradient**: Orange → Coral

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Poppins (sans-serif)
- **Quote**: Lora (serif)

## 🔧 Configuration

### Backend Integration

Update the API endpoint in `.env.local`:
```env
VITE_API_URL=http://localhost:8000
```

The app will communicate with the FastAPI backend for:
- Symptom analysis
- AI-powered guidance generation
- Pain mapping data

### Proxy Configuration

Vite proxy is configured in `vite.config.js` to forward API requests to the backend.

## 📱 Responsive Design

The application is fully responsive with breakpoints at:
- Desktop: 1400px+
- Tablet: 768px - 1024px
- Mobile: < 768px

All floating widgets, shapes, and animations adapt gracefully to smaller screens.

## 🎯 Key Pages

### Home (`/`)
- **Hero Section**: Landing with feature highlights
- **Pain Locator**: Interactive 3D body selection
- **Quick Select**: Button-based pain area selection

### Results
- **Health Summary**: Overview of analysis
- **Red Flag Warnings**: Critical health alerts
- **Tabbed Information**:
  - Possible Causes with likelihood percentages
  - Home Remedies
  - OTC Medication Guidance
  - When to seek professional help

## 🔐 Safety & Disclaimers

The application includes prominent disclaimers stating:
- This tool provides **informational guidance only**
- It does **NOT replace professional medical advice**
- Users should always consult qualified healthcare providers
- Emergency services should be contacted for serious symptoms

## 🎭 Animation Effects

- **Floating Elements**: Smooth Y-axis movement
- **Pulse Glow**: Heart widget pulsating effect
- **Gentle Float**: Rotating floating animations
- **Scale & Fade**: Smooth entrance animations
- **Progress Bar**: Animated fill on form progression
- **Scroll Indicator**: Bouncing arrow animation

## 🛠️ Technologies

- **React 18**: Modern UI library
- **Vite**: Fast build tool and dev server
- **Axios**: HTTP client for API requests
- **CSS3**: Custom styling with animations
- **Canvas API**: 2D body model rendering

## 📄 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Deployment

### Vercel
```bash
npm run build
# Deploy the dist/ folder to Vercel
```

### Netlify
```bash
npm run build
# Connect GitHub repo and auto-deploy
```

### Docker
```bash
docker build -t mediAi-frontend .
docker run -p 5173:5173 mediAi-frontend
```

## 📝 Development Notes

### Adding New Pages
1. Create new file in `src/pages/`
2. Import in `App.jsx`
3. Add route handling
4. Create corresponding CSS in `src/styles/`

### Customizing Theme
1. Update CSS variables in `src/index.css`
2. Modify gradients and colors in `:root`
3. Adjust animation timings as needed

### API Integration
- Use `src/utils/api.js` for all backend calls
- Add new methods to `api.js` for additional endpoints
- Handle errors gracefully with user feedback

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure backend is running on `http://localhost:8000`
- Check `.env.local` for correct API URL
- Verify CORS configuration on backend

### Styling Issues
- Clear browser cache
- Rebuild with `npm run build`
- Check CSS specificity in DevTools

### Performance Issues
- Check for unnecessary re-renders
- Optimize image sizes
- Use React DevTools profiler

## 📧 Support

For issues or questions:
1. Check the [backend documentation](../backend/docs/)
2. Review error logs in browser console
3. Ensure all dependencies are installed

---

**Built with ❤️ for intelligent health guidance**
