"""
Rule-based pain mapping system that defines conditions, questions, and red flags
for different body regions.

This module provides structured data for the symptom checking system,
ensuring consistency and safety across different pain locations.
"""

# Pain mapping structure for MVP scope (5 regions)
PAIN_MAP = {
    "lower_back_left": {
        "region_name": "Lower Back (Left Side)",
        "conditions": [
            "Muscle strain",
            "Sciatica", 
            "Kidney infection"
        ],
        "questions": [
            "Does pain radiate to your leg?",
            "Do you have fever or chills?",
            "Did you lift heavy objects recently?",
            "Do you have numbness or tingling?"
        ],
        "red_flags": [
            "Loss of bladder or bowel control",
            "Severe leg weakness",
            "High fever (> 101°F / 38.3°C)",
            "Pain after a recent fall or accident"
        ],
        "urgency_factors": {
            "high": ["loss of bladder control", "severe weakness", "fever"],
            "medium": ["radiating pain", "injury history", "duration > 7 days"],
            "low": ["recent activity", "no fever", "localized pain"]
        }
    },
    
    "neck": {
        "region_name": "Neck",
        "conditions": [
            "Muscle tension",
            "Cervical strain",
            "Pinched nerve"
        ],
        "questions": [
            "Did you have a recent injury or whiplash?",
            "Do you have numbness or tingling in arms?",
            "Is your neck stiff or hard to move?",
            "Do you work at a desk for long hours?"
        ],
        "red_flags": [
            "Severe headache with neck stiffness",
            "Numbness/tingling in both arms",
            "Loss of balance or coordination",
            "Difficulty swallowing"
        ],
        "urgency_factors": {
            "high": ["severe headache", "numbness in both arms", "difficulty swallowing"],
            "medium": ["limited mobility", "radiating pain", "trauma history"],
            "low": ["muscle tension", "activity-related", "no fever"]
        }
    },
    
    "right_knee": {
        "region_name": "Right Knee",
        "conditions": [
            "Ligament sprain",
            "Meniscus tear",
            "Arthritis"
        ],
        "questions": [
            "Did you twist or injure your knee recently?",
            "Is your knee swollen or warm to touch?",
            "Does your knee feel unstable or give way?",
            "Is there a clicking or popping sensation?"
        ],
        "red_flags": [
            "Knee unable to bear weight",
            "Severe swelling within hours",
            "Knee locked in one position",
            "Signs of infection (warmth, redness, fever)"
        ],
        "urgency_factors": {
            "high": ["unable to bear weight", "severe swelling", "fever", "warmth/redness"],
            "medium": ["limited mobility", "recent injury", "instability"],
            "low": ["mild pain", "activity-related", "no swelling"]
        }
    },
    
    "shoulder": {
        "region_name": "Shoulder",
        "conditions": [
            "Muscle strain",
            "Rotator cuff injury",
            "Frozen shoulder"
        ],
        "questions": [
            "Can you raise your arm without pain?",
            "Did you have a recent injury or fall?",
            "Do you have numbness down your arm?",
            "Is there weakness when lifting?"
        ],
        "red_flags": [
            "Sudden severe pain with chest tightness",
            "Pain radiating to jaw or left arm",
            "Difficulty breathing",
            "Complete loss of arm function"
        ],
        "urgency_factors": {
            "high": ["chest pain", "radiating to jaw", "breathing difficulty"],
            "medium": ["recent injury", "limited mobility", "numbness"],
            "low": ["muscle strain", "activity-related", "gradual onset"]
        }
    },
    
    "abdomen": {
        "region_name": "Abdomen",
        "conditions": [
            "Indigestion",
            "Muscle strain",
            "Gastroenteritis"
        ],
        "questions": [
            "Do you have nausea or vomiting?",
            "Have you had diarrhea or constipation?",
            "Did you eat something unusual recently?",
            "Do you have fever?"
        ],
        "red_flags": [
            "Severe pain that's persistent",
            "Vomiting blood",
            "Bloody or black stools",
            "High fever (> 101°F / 38.3°C) with severe abdominal pain"
        ],
        "urgency_factors": {
            "high": ["severe persistent pain", "vomiting blood", "bloody stools", "fever"],
            "medium": ["fever", "vomiting", "limited movement", "duration > 3 days"],
            "low": ["mild discomfort", "after meals", "no systemic symptoms"]
        }
    }
}

# Simple alias map to accept common area IDs from the frontend
# and map them to the canonical region keys in PAIN_MAP. This allows the
# frontend to remain simple (e.g., 'right_arm') while the backend uses
# a smaller set of supported, well-defined regions.
ALIASES = {
    "right_arm": "shoulder",
    "left_arm": "shoulder",
    "chest": "abdomen",
    "stomach": "abdomen",
    "back": "lower_back_left",
    "lower_back": "lower_back_left",
    "right_knee": "right_knee",
    "left_knee": "right_knee",
    "neck": "neck",
    "shoulder": "shoulder",
    "abdomen": "abdomen",
    "heart": "abdomen"
}


def get_pain_region(location: str) -> dict:
    """
    Retrieve pain mapping data for a specific location
    
    Args:
        location: Body region identifier
        
    Returns:
        Dictionary containing conditions, questions, and red flags
        
    Raises:
        ValueError: If location is not supported
    """
    # Normalize aliases to canonical region keys
    loc = location
    if loc in ALIASES:
        loc = ALIASES[loc]

    if loc not in PAIN_MAP:
        raise ValueError(
            f"Location '{location}' not supported. "
            f"Available regions: {', '.join(PAIN_MAP.keys())}"
        )

    return PAIN_MAP[loc]


def get_all_regions() -> list:
    """Get list of all supported body regions"""
    return list(PAIN_MAP.keys())


def get_region_questions(location: str) -> list:
    """Get diagnostic questions for a specific region"""
    region = get_pain_region(location)
    return region.get("questions", [])


def get_region_red_flags(location: str) -> list:
    """Get red flag warnings for a specific region"""
    region = get_pain_region(location)
    return region.get("red_flags", [])


def get_conditions_for_region(location: str) -> list:
    """Get possible conditions for a specific region"""
    region = get_pain_region(location)
    return region.get("conditions", [])
