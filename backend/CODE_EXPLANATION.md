"""
BACKEND CODE OVERVIEW & ARCHITECTURE

This document explains the structure and functionality of the AI Symptom Guidance backend.

╔════════════════════════════════════════════════════════════════════════════╗
║                           PROJECT ARCHITECTURE                             ║
╚════════════════════════════════════════════════════════════════════════════╝

USER REQUEST
    ↓
[Frontend sends JSON]
    ↓
FastAPI (main.py)
    ↓ Validates request & extracts location
    ↓
Validation Check
    ├→ Valid? Continue
    └→ Invalid? Return 400 error
    ↓
Pain Map (pain_map.py)
    ├→ Get conditions for body region
    ├→ Get red flag warnings
    └→ Get diagnostic questions
    ↓
AI Service (ai_service.py)
    ├→ Create structured prompt
    ├→ Call Gemini API
    └→ Parse AI response
    ↓
Response Assembly
    └→ Return MedicalGuidance JSON
    ↓
Frontend displays results


╔════════════════════════════════════════════════════════════════════════════╗
║                         FILE-BY-FILE BREAKDOWN                             ║
╚════════════════════════════════════════════════════════════════════════════╝


1️⃣ models.py - DATA VALIDATION
────────────────────────────────────────────────────────────────────────────

Purpose: Define what data comes in and goes out

Key Classes:
  • SymptomRequest
    └─ Incoming data from frontend
    └─ Fields: location, pain_type, duration_days, symptoms dict
    └─ Validation: Automatic type checking and field validation

  • MedicalGuidance
    └─ Outgoing response data
    └─ Fields: possible_causes, urgency, home_remedies, otc_guidance, red_flags
    └─ Includes mandatory medical disclaimer

  • ErrorResponse
    └─ Error message format
    └─ Fields: detail, status

Benefits:
  ✓ Type safety
  ✓ Automatic validation
  ✓ Clear API documentation
  ✓ Error messages if data is wrong


2️⃣ pain_map.py - RULE-BASED SYSTEM
────────────────────────────────────────────────────────────────────────────

Purpose: Store structured medical data (conditions, questions, warnings)

Key Features:
  • PAIN_MAP dictionary
    └─ 5 body regions (MVP scope)
    └─ Each region has:
       - conditions: Possible diseases for that location
       - questions: Diagnostic questions
       - red_flags: Warning signs requiring emergency care
       - urgency_factors: Rules for determining urgency level

  • Helper Functions:
    ├─ get_pain_region(location) → Get data for region
    ├─ get_all_regions() → List all supported regions
    ├─ get_conditions_for_region(location) → Get conditions
    ├─ get_region_red_flags(location) → Get red flags
    └─ get_region_questions(location) → Get questions

Why This Design:
  ✓ Separates medical data from code logic
  ✓ Easy to add new regions/conditions
  ✓ Provides context for AI prompt
  ✓ Ensures consistency across system


3️⃣ ai_service.py - GEMINI API INTEGRATION
────────────────────────────────────────────────────────────────────────────

Purpose: Communicate with Google Gemini API safely

Key Functions:
  • create_symptom_prompt(...)
    └─ Builds structured prompt with safety guardrails
    └─ Reminds AI it's informational, not diagnostic
    └─ Includes patient data, possible conditions, red flags
    └─ Specifies JSON output format

  • analyze_symptoms(...)
    └─ Main function to get AI analysis
    └─ Calls Gemini API with structured prompt
    └─ Parses JSON response
    └─ Validates urgency level
    └─ Returns structured result

  • get_fallback_response(...)
    └─ Safe response if API fails
    └─ Ensures app continues to work
    └─ Recommends seeing healthcare professional

Safety Guardrails:
  ✓ Prompt explicitly says "DO NOT diagnose"
  ✓ Requires JSON format for parsing
  ✓ Validates urgency level (Low/Medium/High)
  ✓ Fallback if API unavailable
  ✓ No prescription medications


4️⃣ main.py - FASTAPI APPLICATION
────────────────────────────────────────────────────────────────────────────

Purpose: REST API endpoints and request handling

Key Endpoints:

  ✓ GET /
    └─ Health check
    └─ Returns: status, message, version

  ✓ GET /health
    └─ Monitoring endpoint
    └─ Returns: healthy status

  ✓ GET /regions
    └─ List all supported body regions
    └─ Returns: region IDs and names

  ✓ GET /region/{region_id}
    └─ Get details for specific region
    └─ Returns: conditions, questions, red flags

  ✓ POST /analyze [MAIN ENDPOINT]
    └─ Accept symptom data and return guidance
    ├─ Validates request against SymptomRequest model
    ├─ Checks if location is valid
    ├─ Calls pain_map to get conditions/red flags
    ├─ Calls ai_service for AI analysis
    ├─ Returns MedicalGuidance response
    └─ Handles all errors gracefully

Special Features:
  • CORS enabled (allows frontend communication)
  • Comprehensive logging
  • Type hints throughout
  • Detailed error messages
  • API documentation at /docs


╔════════════════════════════════════════════════════════════════════════════╗
║                         HOW EVERYTHING WORKS TOGETHER                      ║
╚════════════════════════════════════════════════════════════════════════════╝


EXAMPLE REQUEST FLOW:

1. Frontend sends:
   {
     "location": "lower_back_left",
     "pain_type": "sharp",
     "duration_days": 14,
     "symptoms": {"radiating": true, "fever": false}
   }

2. main.py receives and validates data
   └─ models.py checks types and format

3. pain_map.py provides context:
   └─ conditions: ["Muscle strain", "Sciatica", "Kidney infection"]
   └─ red_flags: ["Loss of bladder control", "Severe leg weakness"]

4. ai_service.py creates prompt:
   └─ "Patient has sharp lower back pain for 14 days..."
   └─ "Consider these conditions: ..."
   └─ "Do NOT diagnose. Return JSON with..."

5. Gemini API responds with analysis

6. Response parsed and validated

7. Frontend receives:
   {
     "possible_causes": ["Muscle strain", "Sciatica"],
     "urgency": "Medium",
     "home_remedies": ["Rest", "Ice therapy"],
     "otc_guidance": ["Ibuprofen - consult pharmacist"],
     "red_flags": ["Loss of bladder control", "Severe weakness"],
     "disclaimer": "⚠️ This is informational only..."
   }


╔════════════════════════════════════════════════════════════════════════════╗
║                         KEY DESIGN DECISIONS                               ║
╚════════════════════════════════════════════════════════════════════════════╝

❶ SEPARATION OF CONCERNS
  • Models: Data validation only
  • Pain Map: Medical knowledge only
  • AI Service: API integration only
  • Main: Orchestration and endpoints
  └─ Each file has ONE responsibility

❷ SAFETY GUARDRAILS
  • Structured prompts prevent harmful suggestions
  • Mandatory disclaimers in every response
  • Red flags configured per region
  • Fallback response if API fails
  • Type validation prevents bad data

❸ USER-FRIENDLY CODE
  • Clear variable names
  • Comprehensive docstrings
  • Type hints for clarity
  • Logical organization
  • Helpful error messages

❹ MAINTAINABILITY
  • Easy to add new regions: just add to PAIN_MAP
  • Easy to modify conditions: change one location
  • Easy to update AI prompt: modify create_symptom_prompt()
  • Easy to test: each function is isolated

❺ EXTENSIBILITY
  • Can add database later
  • Can add authentication
  • Can add logging/monitoring
  • Can add caching
  • Can add rate limiting


╔════════════════════════════════════════════════════════════════════════════╗
║                         DEPENDENCIES EXPLAINED                             ║
╚════════════════════════════════════════════════════════════════════════════╝

fastapi==0.104.1
  └─ Web framework (creates REST API)

uvicorn==0.24.0
  └─ Server that runs FastAPI app

pydantic==2.4.2
  └─ Data validation (SymptomRequest, MedicalGuidance)

python-dotenv==1.0.0
  └─ Loads .env file for API keys

google-generativeai==0.3.0
  └─ Official Gemini API client

httpx==0.25.0
  └─ HTTP client (used by FastAPI/Gemini)


╔════════════════════════════════════════════════════════════════════════════╗
║                         SECURITY CONSIDERATIONS                            ║
╚════════════════════════════════════════════════════════════════════════════╝

✓ API Key Protection
  └─ Stored in .env (not in code)
  └─ .gitignore prevents accidental commits

✓ Input Validation
  └─ All inputs checked with Pydantic
  └─ Invalid data rejected before processing

✓ Medical Safety
  └─ No automatic diagnoses
  └─ Red flags warn of serious conditions
  └─ Disclaimers on every response

✓ Error Handling
  └─ No sensitive info in error messages
  └─ Graceful degradation if services fail
  └─ Comprehensive logging for debugging


╔════════════════════════════════════════════════════════════════════════════╗
║                         TESTING THE BACKEND                                ║
╚════════════════════════════════════════════════════════════════════════════╝

After starting the server, visit: http://localhost:8000/docs

This opens Swagger UI where you can:
  1. See all endpoints
  2. Read documentation
  3. Try endpoints interactively
  4. See request/response examples

Test POST /analyze:
  1. Click "Try it out"
  2. Replace body with:
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
  3. Click "Execute"
  4. See response below


Now you're ready to build the frontend! 🚀
"""