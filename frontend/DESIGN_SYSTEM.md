# 🎨 MediAI Design System & Style Guide

## Color Palette

### Primary Colors
```css
--primary-deep-blue: #0d1f36;    /* Background base */
--primary-blue: #1a3a52;          /* Secondary background */
--primary-teal: #0ea5a8;          /* Accent & highlights */
```

### AI & Technology Colors
```css
--ai-purple: #7c3aed;             /* Primary accent */
--ai-lavender: #c4b5fd;           /* Light accent */
--ai-violet: #a78bfa;             /* Medium accent */
```

### Action & Alert Colors
```css
--accent-coral: #ff6b6b;          /* Danger/Alert */
--accent-orange: #ff9a56;         /* Warning */
--accent-warm: #f5a623;           /* Action/Positive */
```

### Neutral Colors
```css
--bg-dark: #0f1419;               /* Main background */
--bg-darker: #0a0e12;             /* Darkest background */
--surface: #1a1f2e;               /* Card background */
--surface-light: #2a3142;         /* Light surface */
--text-primary: #ffffff;          /* Main text */
--text-secondary: #b0bcc4;        /* Secondary text */
```

---

## Gradients

### Primary Gradient
```css
linear-gradient(135deg, #0d1f36 0%, #7c3aed 100%)
```
**Usage**: Hero titles, main CTAs

### Secondary Gradient
```css
linear-gradient(135deg, #0ea5a8 0%, #7c3aed 100%)
```
**Usage**: Buttons, accents, progress bars

### Warm Gradient
```css
linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)
```
**Usage**: Action buttons, success states

---

## Typography

### Fonts
- **Display/Headings**: Playfair Display (serif)
  - Weights: 600, 700, 800
  - Usage: H1, H2, H3 titles

- **Body/UI**: Poppins (sans-serif)
  - Weights: 300, 400, 600, 700, 800
  - Usage: Body text, buttons, labels

- **Quotes/Secondary**: Lora (serif)
  - Weights: 400, 600
  - Usage: Blockquotes, descriptions

### Font Sizes
```css
h1 { font-size: 3.5rem; }    /* 56px */
h2 { font-size: 2.5rem; }    /* 40px */
h3 { font-size: 1.8rem; }    /* 28.8px */
h4 { font-size: 1.4rem; }    /* 22.4px */
p { font-size: 1rem; }        /* 16px */
small { font-size: 0.875rem; } /* 14px */
```

### Line Heights
```css
/* Headings */
h1, h2, h3 { line-height: 1.2; }
/* Body */
p { line-height: 1.6; }
/* List */
ul { line-height: 1.8; }
```

---

## Spacing System

### Base Unit: 0.5rem (8px)

```css
8px   = 0.5rem
16px  = 1rem
24px  = 1.5rem
32px  = 2rem
48px  = 3rem
64px  = 4rem
96px  = 6rem
128px = 8rem
```

### Usage
- **Padding**: 1rem, 1.5rem, 2rem
- **Margin**: 1.5rem, 2rem, 3rem
- **Gap**: 1rem, 1.5rem, 2rem

---

## Shadows

### Shadow Definitions
```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
--shadow-md: 0 8px 24px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 0 30px rgba(124, 58, 237, 0.3);
```

### Shadow Applications
- **Buttons**: shadow-md on hover
- **Cards**: shadow-md normally, shadow-lg on hover
- **Floating Elements**: shadow-glow
- **Dropdown/Modals**: shadow-lg

---

## Border Radius

### Border Radius Scale
```css
4px  = subtle
8px  = sm
12px = md
15px = lg
20px = xl
50px = full (pills/circles)
```

### Usage
- **Cards**: 20px
- **Buttons**: 50px
- **Inputs**: 12px
- **Avatars**: 50px
- **Icons**: 50px

---

## Components

### Buttons

#### Primary Button
```css
background: var(--gradient-secondary);
padding: 0.875rem 2rem;
border-radius: 50px;
box-shadow: 0 8px 20px rgba(14, 165, 168, 0.3);
```

#### Secondary Button
```css
background: rgba(124, 58, 237, 0.2);
border: 2px solid var(--ai-purple);
padding: 0.875rem 2rem;
border-radius: 50px;
```

#### Warm Button
```css
background: var(--gradient-warm);
padding: 0.875rem 2rem;
border-radius: 50px;
box-shadow: 0 8px 20px rgba(255, 154, 86, 0.3);
```

### Cards

```css
background: linear-gradient(135deg, rgba(26, 31, 46, 0.8), rgba(42, 49, 66, 0.6));
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 20px;
padding: 2rem;
transition: all 0.4s ease;
```

#### Card Hover State
```css
border-color: rgba(124, 58, 237, 0.3);
box-shadow: 0 12px 40px rgba(124, 58, 237, 0.2);
transform: translateY(-8px);
```

### Form Elements

#### Input
```css
background: rgba(255, 255, 255, 0.05);
border: 2px solid rgba(255, 255, 255, 0.1);
border-radius: 12px;
padding: 1rem;
color: var(--text-primary);
```

#### Checkbox
```css
width: 24px;
height: 24px;
border-radius: 6px;
border: 2px solid rgba(255, 255, 255, 0.3);
```

#### Slider
```css
height: 8px;
border-radius: 5px;
background: linear-gradient(to right, #0ea5a8, #7c3aed, #ff6b6b);
```

---

## Animations

### Keyframe Animations

#### Float Animation
```css
@keyframes float1 {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(30px, -30px) rotate(5deg); }
}
```

#### Pulse Glow
```css
@keyframes pulse-glow {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 40px rgba(255, 107, 107, 0.5);
    transform: scale(1.05);
  }
}
```

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

#### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Animation Classes

```css
.fade-in { animation: fadeIn 0.8s ease-in forwards; }
.slide-up { animation: slideUp 0.8s ease-out forwards; }
.scale-in { animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
```

---

## Responsive Breakpoints

```css
/* Desktop */
@media (min-width: 1400px) { }

/* Tablet */
@media (max-width: 1024px) { }

/* Mobile */
@media (max-width: 768px) { }

/* Small Mobile */
@media (max-width: 480px) { }
```

### Layout Changes by Breakpoint
- **Desktop**: 2-column layouts, all floating widgets
- **Tablet**: Flexible grid, adjusted spacing
- **Mobile**: Single column, hidden widgets, full-width

---

## Glass Morphism

### Effect
```css
.glassmorphism {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}
```

### Use Cases
- Navigation bar
- Floating widgets
- Modal backgrounds
- Card overlays

---

## Hover & Interaction States

### Button Hover
```css
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(..., 0.5);
}
```

### Card Hover
```css
.card:hover {
  border-color: rgba(124, 58, 237, 0.3);
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(124, 58, 237, 0.2);
}
```

### Link Hover
```css
a::after {
  width: 0;
  transition: width 0.3s ease;
}
a:hover::after {
  width: 100%;
}
```

---

## Dark Mode

The design system is built for dark mode by default. All colors are optimized for dark backgrounds.

### Background Hierarchy
1. **Primary BG**: #0f1419
2. **Secondary BG**: #1a1f2e
3. **Tertiary BG**: #2a3142

---

## Accessibility

### Color Contrast
- Text on background: min 4.5:1 ratio
- All interactive elements: clearly differentiated
- Focus states: visible outlines

### Typography
- Minimum font size: 14px
- Line height: min 1.5 for body text
- Letter spacing: 0.5px for long text

### Interactive Elements
- Minimum click area: 44x44px
- Focus indicators: visible on all buttons
- Hover states: clearly visible

---

## Theme Customization

### CSS Variables in `:root`
```css
:root {
  --primary-deep-blue: #0d1f36;
  --primary-teal: #0ea5a8;
  --ai-purple: #7c3aed;
  /* ... more variables ... */
}
```

### To Customize:
1. Update color values in `:root`
2. All components will automatically update
3. No need to modify individual component files

---

## Usage Examples

### Hero Section
- Primary gradient on title
- Glass morphism cards
- Floating animation on elements
- Warm CTA button

### Form Section
- Light surface background
- Teal accent for inputs
- Purple for focus states
- Smooth transitions

### Results Section
- Card layout with hover effects
- Tabbed interface
- Gradient progress bars
- Warning cards with coral accent

---

## Performance Tips

1. **Use CSS animations** (faster than JS)
2. **Minimize shadow layers** on mobile
3. **Lazy load images** where possible
4. **Optimize backdrop-filter** usage (performance cost)
5. **Use will-change** for animated elements

```css
.animated-element {
  will-change: transform, opacity;
}
```

---

**Last Updated**: March 2026
**Version**: 1.0.0
