# 🚀 Quick Start Guide - MediAI Frontend

## Installation & Setup

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env.local
```

The default configuration assumes the backend runs on `http://localhost:8000`

### Step 3: Start Development Server
```bash
npm run dev
```

The application will automatically open at: **http://localhost:5173**

---

## 📋 What's Included

### ✨ Beautiful UI Components
- **Hero Landing Page** with animated background
- **3D Body Model** (Canvas-based) for pain selection
- **Multi-Step Form** with progress tracking
- **Results Dashboard** with tabbed information
- **Floating Widgets** with smooth animations

### 🎨 Design Features
- Glassmorphic UI elements
- Calligraphy-inspired abstract background
- Responsive grid layouts
- Smooth animations and transitions
- Medical AI fusion color scheme

### 🔧 Technology Stack
- React 18 (UI framework)
- Vite (Fast build tool)
- Axios (API communication)
- CSS3 (Custom styling & animations)
- Canvas API (2D body rendering)

---

## 📱 User Flow

1. **Hero Page** - User clicks "Start Health Analysis"
2. **Pain Selection** - User selects pain location from 3D model or quick buttons
3. **Symptom Form** - User answers 5 structured questions
4. **Results** - AI-powered analysis with guidance and warnings

---

## 🔗 API Integration

The frontend communicates with the backend API:

### Endpoints Used
- `POST /analyze` - Analyze symptoms and get guidance
- `GET /pain-map` - Get pain mapping data
- `GET /health` - Health check endpoint

### Backend Requirements
The backend must be running on `http://localhost:8000`

**Ensure the backend is started before running the frontend!**

```bash
# In a separate terminal, start the backend
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

---

## 💻 Development Commands

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 🎯 Component Structure

```
src/
├── components/
│   ├── AnatomyModel.jsx        # Interactive body canvas
│   ├── QuestionForm.jsx        # Multi-step form
│   └── ResultCard.jsx          # Result display
├── pages/
│   ├── Home.jsx                # Landing & selection
│   └── Results.jsx             # Results dashboard
├── styles/
│   ├── index.css               # Global & theme
│   ├── Home.css                # Page styles
│   ├── AnatomyModel.css        # Component styles
│   └── ...other styles...
├── utils/
│   └── api.js                  # API calls
├── App.jsx                     # Main app
└── main.jsx                    # Entry point
```

---

## 🎨 Customization

### Change Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --primary-teal: #0ea5a8;
  --ai-purple: #7c3aed;
  /* ... more colors ... */
}
```

### Add New Pages
1. Create file in `src/pages/`
2. Import in `App.jsx`
3. Create CSS in `src/styles/`
4. Add routing logic in `App.jsx`

### Modify API Endpoints
Edit `src/utils/api.js`:
```javascript
export const myNewEndpoint = async (data) => {
  return api.post('/my-endpoint', data)
}
```

---

## ⚙️ Browser DevTools

### React Developer Tools
```
Chrome Extension: "React Developer Tools"
Helps inspect component structure and props
```

### CSS Debugging
- Open DevTools (F12)
- Go to Elements tab
- Inspect any element
- Modify CSS in real-time

---

## 🔍 Debugging Tips

### Check Backend Connection
Open browser console and run:
```javascript
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

### View Component Props
Use React DevTools to inspect components and their props

### API Requests
Check Network tab in DevTools to see all API calls and responses

---

## 📱 Responsive Design Testing

### Desktop (1400px+)
- Full layout with all floating widgets
- Side-by-side anatomy model and quick select

### Tablet (768px - 1024px)
- Stacked layouts
- Adjusted font sizes
- Single column forms

### Mobile (< 768px)
- Full-width components
- Hidden floating widgets (except heart)
- Touch-friendly buttons
- Vertical scrolling

**Test using DevTools device emulation or actual devices**

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repo to Vercel
3. Auto-deploys on git push

### Netlify
1. Build: `npm run build`
2. Publish directory: `dist/`
3. Drag & drop dist folder

### Docker
```bash
docker build -t mediAi-frontend .
docker run -p 5173:5173 mediAi-frontend
```

---

## ⚠️ Common Issues & Solutions

### Issue: "Cannot Connect to Backend"
**Solution:** Ensure backend is running on `http://localhost:8000`

### Issue: "Styles Not Loading"
**Solution:** Hard refresh (Ctrl+Shift+R) and clear cache

### Issue: "Form Not Submitting"
**Solution:** Check browser console for errors, verify backend is running

### Issue: "Animations Stuttering"
**Solution:** Close other apps, check GPU acceleration in DevTools

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---

## 🎓 Learning Points

This project demonstrates:
- Modern React patterns (hooks, state management)
- CSS animations and design systems
- API integration with Axios
- Responsive design principles
- Component composition
- Form handling and validation

---

**Happy Coding! 🚀**

For more details, see [README.md](./README.md)
