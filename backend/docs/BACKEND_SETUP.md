"""
Backend Setup and Usage Guide

QUICK START:

1. Navigate to backend directory:
   cd backend

2. Create virtual environment:
   python -m venv venv
   
   On Windows:
   venv\Scripts\activate
   
   On Mac/Linux:
   source venv/bin/activate

3. Install dependencies:
   pip install -r requirements.txt

4. Set up environment variables:
   - Open .env file
   - Add your Gemini API key from: https://makersuite.google.com/app/apikey
   - Save the file

5. Start the server:
   uvicorn app.main:app --reload

   The API will be available at: http://localhost:8000

6. Test the API:
   - API documentation: http://localhost:8000/docs
   - Alternative docs: http://localhost:8000/redoc

---

AVAILABLE ENDPOINTS:

1. GET /
   - Health check
   - Returns: {"status": "online", "message": "...", "version": "1.0.0"}

2. GET /health
   - Monitoring endpoint
   - Returns: {"status": "healthy", "service": "..."}

3. GET /regions
   - Get list of supported body regions
   - Returns: List of region IDs and names

4. GET /region/{region_id}
   - Get details for specific region
   - Returns: Region info with conditions, questions, red flags

5. POST /analyze
   - Main symptom analysis endpoint
   - Request body: {
       "location": "lower_back_left",
       "pain_type": "sharp",
       "duration_days": 14,
       "symptoms": {"radiating": true, "fever": false}
     }
   - Returns: {
       "possible_causes": [...],
       "urgency": "Medium",
       "home_remedies": [...],
       "otc_guidance": [...],
       "red_flags": [...]
     }

---

SUPPORTED BODY REGIONS:
- lower_back_left: Lower Back (Left Side)
- neck: Neck
- right_knee: Right Knee
- shoulder: Shoulder
- abdomen: Abdomen

---

PROJECT STRUCTURE:

backend/
├── app/
│   ├── __init__.py          # Package initialization
│   ├── main.py              # FastAPI application & endpoints
│   ├── models.py            # Pydantic request/response models
│   ├── pain_map.py          # Rule-based symptom mapping
│   └── ai_service.py        # Gemini API integration
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables (API keys)
└── README.md               # This file

---

KEY FEATURES:

✅ Structured Prompt Engineering
   - Prevents AI from making diagnoses
   - Safely guides toward appropriate care

✅ Rule-Based Filtering
   - Defines possible conditions per region
   - Provides diagnostic questions
   - Includes red flag warnings

✅ Safety Guardrails
   - No prescription recommendations
   - Mandatory medical disclaimers
   - Fallback responses if API fails
   - Urgency level assessment

✅ Clean Code Design
   - Well-documented functions
   - Type hints for clarity
   - Proper error handling
   - Logging for debugging

✅ Easy to Understand
   - Simple request/response format
   - Clear variable names
   - Comprehensive docstrings
   - Logical code organization

---

TROUBLESHOOTING:

Issue: "GEMINI_API_KEY not found"
Solution: Add your API key to the .env file

Issue: "Connection refused" on localhost:8000
Solution: Make sure the server is running with: uvicorn app.main:app --reload

Issue: CORS errors from frontend
Solution: Update CORS origins in main.py if frontend URL is different

Issue: Gemini API errors
Solution: Check API key validity and request quotas

---

DEVELOPMENT TIPS:

- API docs available at /docs (Swagger UI)
- Test endpoints directly in /docs UI
- Check logs in terminal for debugging
- Each request is logged for monitoring
- Fallback responses ensure graceful degradation

---

For questions or issues, refer to the main README.md in the project root.
"""