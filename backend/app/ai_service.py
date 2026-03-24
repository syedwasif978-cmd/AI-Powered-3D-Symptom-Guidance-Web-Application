"""
AI Service Module - Integrates with Google Gemini API for symptom analysis

This module handles:
1. Structured prompt engineering for safety
2. Gemini API communication
3. Response parsing and validation
4. Safety guardrails (no prescriptions, proper disclaimers)
"""

import os
import json
import logging
from typing import List, Dict

# Use the new Google GenAI client namespace. If it's not available,
# raise a helpful error asking the developer to install the new package.
try:
    import google.genai as genai
except Exception as e:
    raise ImportError(
        "google.genai not found. Please install the new GenAI client:\n"
        "pip install google-genai\n"
        "Also update backend/requirements.txt accordingly."
    ) from e
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    logger.warning(
        "GEMINI_API_KEY not found in environment; using demo/fallback behavior only. "
        "Set GEMINI_API_KEY when you want real AI responses."
    )

# Configure client. Support a couple of common client surface shapes so this
# module works across minor client versions. If the installed package provides
# a configure function, use it; otherwise try client-style construction.
model = None
try:
    if API_KEY and hasattr(genai, "configure"):
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel("gemini-pro") if hasattr(genai, "GenerativeModel") else None
    elif API_KEY:
        client = genai.Client(api_key=API_KEY)
        try:
            model = client.get_model("gemini-pro")
        except Exception:
            model = None
except Exception as e:
    logger.warning(f"GenAI client configuration issue: {e}")
    model = None


def create_symptom_prompt(
    location: str,
    pain_type: str,
    duration_days: int,
    symptoms: Dict[str, bool],
    conditions: List[str],
    red_flags: List[str]
) -> str:
    """
    Create a structured prompt for Gemini with safety guardrails
    
    Args:
        location: Body region
        pain_type: Type of pain
        duration_days: Duration of symptoms
        symptoms: Additional symptoms dict
        conditions: Possible conditions from pain_map
        red_flags: Critical warning signs
        
    Returns:
        Structured prompt string
    """
    
    # Format additional symptoms
    symptoms_text = ", ".join([
        f"{key}: {value}" for key, value in symptoms.items()
    ])
    
    prompt = f"""
You are a medical information assistant providing educational guidance only.
You DO NOT provide medical diagnosis. Always remind users to see a healthcare professional.

PATIENT INFORMATION:
- Location of Pain: {location}
- Pain Type: {pain_type}
- Duration: {duration_days} days
- Additional Symptoms: {symptoms_text if symptoms_text else "None reported"}

POSSIBLE CONDITIONS TO CONSIDER (not diagnosis):
{', '.join(conditions)}

CRITICAL RED FLAGS (User should seek immediate care if experiencing):
{', '.join(red_flags)}

SAFETY GUARDRAILS:
- Do NOT prescribe any medications
- Do NOT claim to diagnose the condition
- Only suggest over-the-counter options (clearly labeled as OTC)
- Emphasize seeing a healthcare professional

TASK:
Provide helpful educational information in JSON format with these fields:
1. possible_causes: List of 2-3 most likely causes (NOT a diagnosis)
2. urgency: "Low", "Medium", or "High" - based on symptom severity
3. home_remedies: Safe non-medical remedies (rest, ice, stretching, etc.)
4. otc_guidance: Only mention common OTC options with "consult pharmacist" warnings
5. red_flags_explained: Why the critical warnings matter

Return ONLY valid JSON, no markdown code blocks.
    """
    
    return prompt


def analyze_symptoms(
    location: str,
    pain_type: str,
    duration_days: int,
    symptoms: Dict[str, bool],
    conditions: List[str],
    red_flags: List[str]
) -> Dict:
    """
    Use Gemini API to analyze symptoms and provide guidance
    
    Args:
        location: Body region
        pain_type: Type of pain
        duration_days: Duration in days
        symptoms: Additional symptoms
        conditions: Possible conditions
        red_flags: Warning signs
        
    Returns:
        Dictionary with analysis results
    """
    
    try:
        # Demo mode (or missing configured AI model): return hardcoded response.
        # This makes local showcase stable during development.
        demo_mode = os.getenv("DEMO_MODE", "true").lower() == "true"
        if demo_mode or model is None:
            import time
            time.sleep(2.5)
            return {
                "possible_causes": [
                    "Benign muscle strain/overuse (common)",
                    "Mild acidity/indigestion\/GERD",
                    "Stress-related chest tightness"
                ],
                "urgency": "Low",
                "home_remedies": [
                    "Rest and avoid heavy exertion",
                    "Try antacids if symptoms are reflux-related",
                    "Practice gentle breathing exercises"
                ],
                "otc_guidance": [
                    "Ibuprofen or paracetamol for pain (follow package instructions)",
                    "Consult pharmacist if on other medications"
                ],
                "red_flags": [
                    "Severe chest pain spreading to jaw/left arm",
                    "Loss of consciousness or severe shortness of breath"
                ],
                "disclaimer": "⚠️ This guidance is informational only and does NOT replace professional medical advice. Please consult a healthcare professional for proper diagnosis and treatment."
            }
        # Create structured prompt
        prompt = create_symptom_prompt(
            location=location,
            pain_type=pain_type,
            duration_days=duration_days,
            symptoms=symptoms,
            conditions=conditions,
            red_flags=red_flags
        )
        
        # Call Gemini / GenAI API. Support a few common call styles to be
        # compatible with variations of the client API.
        if model is not None and hasattr(model, "generate_content"):
            response = model.generate_content(prompt)
        elif hasattr(genai, "text") and hasattr(genai.text, "generate"):
            # Newer clients may expose a text.generate helper
            response = genai.text.generate(model="gemini-pro", prompt=prompt)
        else:
            raise RuntimeError(
                "Unable to call GenAI model: installed google-genai client API is not supported by this shim.\n"
                "Please ensure you have a compatible version of google-genai installed."
            )
        
        # Parse response
        # Normalize response text across client versions
        response_text = getattr(response, "text", None)
        if response_text is None:
            # try common alternatives
            if hasattr(response, "output"):
                out = response.output
                if isinstance(out, list) and len(out) > 0 and isinstance(out[0], dict):
                    response_text = out[0].get("content") or out[0].get("text") or str(out[0])
                else:
                    response_text = str(out)
            else:
                response_text = str(response)

        response_text = response_text.strip()
        
        # Try to extract JSON from response
        if "```json" in response_text:
            json_start = response_text.find("```json") + 7
            json_end = response_text.find("```", json_start)
            response_text = response_text[json_start:json_end].strip()
        elif response_text.startswith("{"):
            # Already JSON
            pass
        else:
            # Try to find JSON object in response
            json_start = response_text.find("{")
            json_end = response_text.rfind("}") + 1
            if json_start != -1:
                response_text = response_text[json_start:json_end]
        
        # Parse JSON
        ai_response = json.loads(response_text)
        
        # Validate and structure response
        result = {
            "possible_causes": validate_list(
                ai_response.get("possible_causes", [])
            ),
            "urgency": validate_urgency(
                ai_response.get("urgency", "Medium")
            ),
            "home_remedies": validate_list(
                ai_response.get("home_remedies", [])
            ),
            "otc_guidance": validate_list(
                ai_response.get("otc_guidance", [])
            ),
            "red_flags": red_flags  # Use confirmed red flags from pain_map
        }
        
        return result
        
    except json.JSONDecodeError as e:
        logger.warning(f"Error parsing AI response: {e}")
        # Return safe fallback response
        return get_fallback_response(location, duration_days)
    
    except Exception as e:
        logger.exception(f"Error calling GenAI API: {e}")
        # Return safe fallback response
        return get_fallback_response(location, duration_days)


def validate_list(items) -> List[str]:
    """Ensure items is a valid list of strings"""
    if not isinstance(items, list):
        return []
    return [str(item) for item in items if item]


def validate_urgency(urgency_level: str) -> str:
    """Ensure urgency is one of the valid levels"""
    valid_levels = ["Low", "Medium", "High"]
    urgency_level = str(urgency_level).capitalize()
    
    if urgency_level not in valid_levels:
        return "Medium"  # Safe default
    
    return urgency_level


def get_fallback_response(location: str, duration_days: int) -> Dict:
    """
    Provide a safe fallback response if AI API fails
    
    This ensures the application continues to function with basic guidance
    """
    
    urgency = "High" if duration_days > 7 else "Medium"
    
    return {
        "possible_causes": [
            "Please consult with a healthcare professional for proper evaluation"
        ],
        "urgency": urgency,
        "home_remedies": [
            "Rest and avoid strenuous activity",
            "Apply ice/heat as tolerated",
            "Maintain good posture"
        ],
        "otc_guidance": [
            "Consult pharmacist about over-the-counter pain relief options",
            "Always follow package instructions"
        ],
        "red_flags": [
            "Severe pain or sudden onset",
            "Fever with pain",
            "Loss of function or numbness"
        ]
    }
