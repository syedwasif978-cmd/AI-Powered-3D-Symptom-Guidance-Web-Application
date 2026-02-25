"""
Pydantic models for request/response validation
"""

from pydantic import BaseModel, Field
from typing import Dict, List, Optional


class SymptomRequest(BaseModel):
    """
    Request model for symptom analysis
    
    Attributes:
        location: Body region where pain is felt (e.g., 'lower_back_left')
        pain_type: Type of pain (e.g., 'sharp', 'dull', 'throbbing')
        duration_days: How many days the pain has persisted
        symptoms: Additional symptoms as key-value pairs
    """
    location: str = Field(..., description="Body region ID")
    pain_type: str = Field(..., description="Type of pain experienced")
    duration_days: int = Field(..., ge=1, description="Number of days pain has lasted")
    symptoms: Dict[str, bool] = Field(
        default={}, 
        description="Additional symptoms (e.g., radiating: true, fever: false)"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "location": "lower_back_left",
                "pain_type": "sharp",
                "duration_days": 14,
                "symptoms": {
                    "radiating": True,
                    "fever": False,
                    "injury_history": True
                }
            }
        }


class MedicalGuidance(BaseModel):
    """
    Response model for medical guidance
    
    Attributes:
        possible_causes: List of potential conditions ranked by likelihood
        urgency: Severity level (Low, Medium, High)
        home_remedies: Non-prescription home treatments
        otc_guidance: Over-the-counter medication suggestions
        red_flags: Warning signs requiring immediate medical attention
    """
    possible_causes: List[str] = Field(
        ..., 
        description="Ranked list of possible conditions"
    )
    urgency: str = Field(
        ..., 
        description="Urgency level: Low, Medium, or High"
    )
    home_remedies: List[str] = Field(
        ..., 
        description="Home remedies that might help"
    )
    otc_guidance: List[str] = Field(
        ..., 
        description="Over-the-counter medication guidance"
    )
    red_flags: List[str] = Field(
        ..., 
        description="Warning signs that require immediate medical attention"
    )
    disclaimer: str = Field(
        default="⚠️ This guidance is informational only and does NOT replace professional medical advice. "
                "Please consult a healthcare professional for proper diagnosis and treatment.",
        description="Medical disclaimer"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "possible_causes": ["Muscle strain", "Sciatica"],
                "urgency": "Medium",
                "home_remedies": ["Rest", "Ice therapy", "Stretching"],
                "otc_guidance": ["Ibuprofen (follow package instructions)"],
                "red_flags": ["Loss of bladder control", "Severe weakness"],
                "disclaimer": "⚠️ This guidance is informational only..."
            }
        }


class ErrorResponse(BaseModel):
    """
    Error response model
    """
    detail: str = Field(..., description="Error message")
    status: str = Field(default="error", description="Status indicator")
