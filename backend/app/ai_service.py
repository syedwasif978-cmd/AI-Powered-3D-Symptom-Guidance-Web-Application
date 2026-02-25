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
from typing import List, Dict
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found in environment variables. "
        "Please add it to your .env file."
    )

genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-pro")


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
        # Create structured prompt
        prompt = create_symptom_prompt(
            location=location,
            pain_type=pain_type,
            duration_days=duration_days,
            symptoms=symptoms,
            conditions=conditions,
            red_flags=red_flags
        )
        
        # Call Gemini API
        response = model.generate_content(prompt)
        
        # Parse response
        response_text = response.text.strip()
        
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
        print(f"Error parsing AI response: {e}")
        # Return safe fallback response
        return get_fallback_response(location, duration_days)
    
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
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
