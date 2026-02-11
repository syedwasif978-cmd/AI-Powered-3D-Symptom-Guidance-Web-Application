🧠 AI-Powered 3D Symptom Guidance Web Application

An AI-powered web-based symptom guidance system that allows users to interact with a 3D human anatomy model, pinpoint pain locations, answer structured medical questions, and receive AI-generated symptom analysis including possible causes, home care guidance, OTC suggestions, and red-flag warnings.

⚠️ This application provides informational guidance only and does not replace professional medical advice.

🚀 Project Overview

This project combines:

3D Human Anatomy Visualization

Interactive Body Region Mapping

Rule-Based Symptom Filtering

Gemini AI Integration

Structured Medical Prompt Engineering

Clean, Professional Web UI

The goal is to simulate a smart symptom checker while maintaining medical safety standards.

🎯 Objectives

Provide users with structured symptom guidance.

Allow intuitive pain selection via 3D human model.

Use AI responsibly with guardrails.

Demonstrate full-stack AI integration.

Showcase modern web technologies for portfolio use.

🏗️ Tech Stack
Frontend

React (Vite)

Three.js

@react-three/fiber

@react-three/drei

Tailwind CSS

ShadCN UI

Backend

Python 3.10+

FastAPI

Pydantic

Uvicorn

Gemini API

Data Handling

JSON-based pain mapping

Rule-based filtering layer

Structured AI prompts

🧩 System Architecture
User
  ↓
React Frontend (3D Model + Form)
  ↓
FastAPI Backend
  ↓
Rule-Based Filtering
  ↓
Gemini API
  ↓
Structured Response
  ↓
Frontend Result Rendering

📂 Project Structure
Frontend Structure
frontend/
│
├── src/
│   ├── components/
│   │   ├── AnatomyModel.jsx
│   │   ├── QuestionForm.jsx
│   │   ├── ResultCard.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Results.jsx
│   │
│   ├── utils/
│   │   ├── api.js
│   │
│   ├── App.jsx
│   └── main.jsx

Backend Structure
backend/
│
├── app/
│   ├── main.py
│   ├── pain_map.py
│   ├── ai_service.py
│   ├── models.py
│
├── requirements.txt
└── .env

🧠 Core Features
1️⃣ 3D Human Anatomy Model

Interactive GLB model

Clickable body regions

Front/Back view toggle

Orbit controls

Model Source:

Sketchfab (Free downloadable, CC license)

Format: .glb

2️⃣ Body Region Mapping

Each clickable mesh is mapped to an internal region ID:

Example:

"lower_back_left"
"neck"
"right_knee"


This triggers dynamic question generation.

3️⃣ Pain Mapping Logic

pain_map.py contains structured region definitions:

pain_map = {
    "lower_back_left": {
        "conditions": [
            "Muscle strain",
            "Sciatica",
            "Kidney infection"
        ],
        "questions": [
            "Does pain radiate to leg?",
            "Do you have fever?",
            "Did you lift heavy objects recently?"
        ],
        "red_flags": [
            "Loss of bladder control",
            "Severe leg weakness"
        ]
    }
}

4️⃣ AI Integration (Gemini)

AI receives structured prompt:

Location

Pain type

Duration

Additional symptoms

Rule-based hints

AI returns:

Ranked causes

Urgency level

OTC suggestions (non-prescription only)

Home remedies

Red flag instructions

🔒 Safety Guardrails

No prescription medications allowed

No diagnosis claims

Emergency escalation logic

Mandatory disclaimer

Structured prompt restrictions

🔄 Application Flow

User opens homepage

3D anatomy loads

User clicks body region

Dynamic symptom form appears

User submits responses

Backend processes data

Rule-based filtering applied

Gemini API called

Structured response returned

Results displayed

📊 Functional Requirements

Interactive 3D body

Region detection

Dynamic question rendering

Backend API communication

AI-generated results

Emergency flagging

Responsive UI

⚙️ Non-Functional Requirements

API response < 3 seconds

Secure environment variables

Mobile responsive

Modular architecture

Clean UI/UX

Scalable backend design

📌 API Endpoint Design
POST /analyze

Request:

{
  "location": "lower_back_left",
  "pain_type": "sharp",
  "duration_days": 14,
  "symptoms": {
    "radiating": true,
    "fever": false,
    "injury_history": true
  }
}


Response:

{
  "possible_causes": [],
  "urgency": "Medium",
  "home_remedies": [],
  "otc_guidance": [],
  "red_flags": []
}

🧪 MVP Scope

Initial Supported Regions:

Lower Back

Neck

Knee

Shoulder

Abdomen

Limit to:

3–4 conditions per region

Basic rule engine

Structured AI response

🛠️ Installation Guide
Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

Frontend
cd frontend
npm install
npm run dev

📈 Future Enhancements

Urdu language support

Medical database integration

User history tracking

Authentication system

Telemedicine integration

Severity probability scoring

⚠️ Disclaimer

This application provides AI-generated informational guidance and is not a medical diagnosis tool. Always consult a licensed healthcare professional for medical concerns.

🏊 Swimlane Diagram

Below is the swimlane diagram representation.

🏊 Swimlane (Text Representation)

Actors:

User

Frontend

Backend

Gemini API

User        Frontend        Backend        Gemini API
 |              |               |               |
 | Open App     |               |               |
 |------------->|               |               |
 |              | Load 3D Model |               |
 |              |               |               |
 | Select Area  |               |               |
 |------------->| Capture Region|               |
 |              | Generate Form |               |
 | Fill Form    |               |               |
 |------------->| Send JSON ---->|               |
 |              |               | Rule Filter   |
 |              |               | Call Gemini ---------------->|
 |              |               |               | Analyze Data |
 |              |               |<------------------------------|
 |              |<--------------| Structured Response          |
 | View Result  |               |               |
