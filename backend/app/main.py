"""
FastAPI Main Application - Symptom Guidance System Backend

This is the main entry point for the AI-powered symptom guidance system.
It provides the REST API endpoints for the frontend to communicate with.
"""
import os
import sys

# When running this file directly (python main.py) ensure the parent
# directory of the `app` package (the `backend` folder) is on sys.path
# so absolute imports like `from app.models import ...` succeed.
if __name__ == "__main__" and __package__ is None:
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)


from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
import mimetypes

from app.models import SymptomRequest, MedicalGuidance, ErrorResponse
from app.pain_map import get_pain_region, get_region_red_flags, get_conditions_for_region
from app import ai_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Project root (used by multiple endpoints)
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))

# Initialize FastAPI app
app = FastAPI(
    title="AI Symptom Guidance API",
    description="An AI-powered symptom guidance system using structured engineering and Gemini API",
    version="1.0.0"
)

# Configure CORS to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/", tags=["Health Check"])
async def root():
    """
    Root endpoint - Health check
    """
    # If a production frontend build exists, serve the SPA index.html
    try:
        project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
        index_path = os.path.join(project_root, "frontend", "dist", "index.html")
        if os.path.isfile(index_path):
            return FileResponse(index_path, media_type="text/html")
    except Exception:
        pass

    return {
        "status": "online",
        "message": "AI Symptom Guidance API is running",
        "version": "1.0.0"
    }


@app.get("/health", tags=["Health Check"])
async def health_check():
    """
    Health check endpoint for monitoring
    """
    return {
        "status": "healthy",
        "service": "AI Symptom Guidance System"
    }


@app.get("/regions", tags=["Information"])
async def get_supported_regions():
    """
    Get list of all supported body regions
    
    Returns:
        List of supported region IDs
    """
    from app.pain_map import get_all_regions, PAIN_MAP
    
    regions = get_all_regions()
    region_info = []
    
    for region_id in regions:
        region_data = PAIN_MAP[region_id]
        region_info.append({
            "id": region_id,
            "name": region_data.get("region_name", region_id)
        })
    
    return {
        "total_regions": len(regions),
        "regions": region_info
    }


@app.post(
    "/analyze",
    response_model=MedicalGuidance,
    tags=["Analysis"],
    summary="Analyze symptoms and get guidance",
    responses={
        200: {"description": "Successful symptom analysis"},
        400: {"description": "Invalid request", "model": ErrorResponse},
        422: {"description": "Validation error"},
        500: {"description": "Internal server error", "model": ErrorResponse}
    }
)
async def analyze_symptoms(request: SymptomRequest) -> MedicalGuidance:
    """
    Analyze patient symptoms and provide AI-guided information
    
    This endpoint:
    1. Validates the requested body region
    2. Retrieves rule-based information for that region
    3. Sends structured prompt to Gemini API
    4. Returns ranked conditions, urgency level, remedies, and warnings
    
    Args:
        request: SymptomRequest object containing:
            - location: Body region ID (e.g., 'lower_back_left')
            - pain_type: Type of pain (e.g., 'sharp', 'dull')
            - duration_days: Days of symptoms
            - symptoms: Additional symptoms as key-value pairs
    
    Returns:
        MedicalGuidance object with:
        - possible_causes: Ranked list of potential conditions
        - urgency: Low/Medium/High
        - home_remedies: Safe home treatments
        - otc_guidance: Over-the-counter suggestions
        - red_flags: Warning signs requiring medical attention
    
    Raises:
        HTTPException: If validation fails or API error occurs
    """
    
    logger.info(f"Analyzing symptoms for location: {request.location}")
    try:
        logger.debug(f"Request payload: {request.json()}" )
    except Exception:
        logger.debug("Could not serialize request payload for logging")
    
    try:
        # Validate location
        try:
            region_data = get_pain_region(request.location)
        except ValueError as e:
            logger.warning(f"Invalid location: {request.location}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        
        # Get data for prompt engineering
        conditions = get_conditions_for_region(request.location)
        red_flags = get_region_red_flags(request.location)
        
        logger.info(f"Found {len(conditions)} conditions for {request.location}")
        
        # Call AI service for analysis
        ai_analysis = ai_service.analyze_symptoms(
            location=request.location,
            pain_type=request.pain_type,
            duration_days=request.duration_days,
            symptoms=request.symptoms,
            conditions=conditions,
            red_flags=red_flags
        )
        
        logger.info(f"Urgency level determined: {ai_analysis.get('urgency')}")
        
        # Construct response
        response = MedicalGuidance(
            possible_causes=ai_analysis.get("possible_causes", []),
            urgency=ai_analysis.get("urgency", "Medium"),
            home_remedies=ai_analysis.get("home_remedies", []),
            otc_guidance=ai_analysis.get("otc_guidance", []),
            red_flags=ai_analysis.get("red_flags", red_flags)
        )
        
        logger.info("Symptom analysis completed successfully")
        return response
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    
    except Exception as e:
        # Log full traceback for debugging
        logger.exception("Unexpected error during analysis")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during symptom analysis. Please try again."
        )


@app.get("/region/{region_id}", tags=["Information"])
async def get_region_info(region_id: str):
    """
    Get detailed information about a specific body region
    
    Args:
        region_id: Body region identifier
        
    Returns:
        Region details including conditions, questions, and red flags
    """
    try:
        region = get_pain_region(region_id)
        return {
            "region_id": region_id,
            "region_name": region.get("region_name", region_id),
            "possible_conditions": region.get("conditions", []),
            "diagnostic_questions": region.get("questions", []),
            "red_flags": region.get("red_flags", [])
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@app.get("/debug/model-check/{filename}", tags=["Debug"])
async def debug_model_check(filename: str):
    """
    Debug endpoint to report which paths the running server is checking
    and whether the requested model file exists on disk. Useful to di
    agnose mismatches between the running server and workspace files.
    """
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    dist_path = os.path.join(project_root, "frontend", "dist", "models", filename)
    public_path = os.path.join(project_root, "frontend", "public", "models", filename)

    info = {
        "module_file": __file__,
        "cwd": os.getcwd(),
        "dist_path": dist_path,
        "dist_exists": os.path.isfile(dist_path),
        "dist_size": os.path.getsize(dist_path) if os.path.isfile(dist_path) else None,
        "public_path": public_path,
        "public_exists": os.path.isfile(public_path),
        "public_size": os.path.getsize(public_path) if os.path.isfile(public_path) else None,
    }

    logger.info(f"debug_model_check: {info}")
    return info


@app.get("/open-frontend", include_in_schema=False, tags=["Debug"])
async def open_frontend():
    """
    Redirect helper: returns the production frontend index if available,
    otherwise redirects to the common dev server at http://localhost:5173.
    This provides a direct access link to the web app from the backend.
    """
    try:
        frontend_dist = os.path.join(PROJECT_ROOT, "frontend", "dist")
        index_path = os.path.join(frontend_dist, "index.html")
        if os.path.isfile(index_path):
            return FileResponse(index_path, media_type="text/html")

        raw_index = os.path.join(PROJECT_ROOT, "frontend", "index.html")
        if os.path.isfile(raw_index):
            return FileResponse(raw_index, media_type="text/html")
    except Exception:
        pass

    # Fallback to configured dev server URL
    dev_url = os.getenv("FRONTEND_DEV_URL", "http://localhost:5173")
    return RedirectResponse(url=dev_url)


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """
    Global exception handler
    """
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "status": "error"
        }
    )


@app.on_event("startup")
async def startup_event():
    """
    Log useful direct links when the application starts. This helps during
    local development to quickly open the frontend or API docs.
    """
    try:
        api_port = int(os.getenv("PORT", "8000"))
    except Exception:
        api_port = 8000

    dev_frontend = os.getenv("FRONTEND_DEV_URL", "http://localhost:5173")
    prod_frontend = f"http://localhost:{api_port}/"
    docs_url = f"http://localhost:{api_port}/docs"

    logger.info(f"Frontend (dev): {dev_frontend}")
    logger.info(f"Direct frontend via backend: http://localhost:{api_port}/open-frontend")
    logger.info(f"API docs: {docs_url}")

    # Also print to stdout so it's visible when running `python main.py`
    print("Frontend (dev):", dev_frontend)
    print("Direct frontend via backend:", f"http://localhost:{api_port}/open-frontend")
    print("API docs:", docs_url)


# Serve frontend static files (single-page app) if a production build exists.
# This mount is added after API routes so API endpoints take precedence.
try:
    # Ensure .glb files are served with the correct MIME type
    mimetypes.add_type("model/gltf-binary", ".glb", strict=False)
    # project root is two levels up from this file (backend/app -> backend -> project root)
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    frontend_dist = os.path.join(project_root, "frontend", "dist")
    if os.path.isdir(frontend_dist):
        # Serve only built static assets under /assets (and hydration by /open-frontend)
        app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")
    else:
        # When no dist build, still serve source assets for development paths.
        frontend_dir = os.path.join(project_root, "frontend")
        if os.path.isdir(frontend_dir):
            app.mount("/src", StaticFiles(directory=os.path.join(frontend_dir, "src")), name="frontend_dev_src")
            app.mount("/public", StaticFiles(directory=os.path.join(frontend_dir, "public")), name="frontend_dev_public")
            app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend_dev")
except Exception:
    logger.warning("Could not mount frontend static files; frontend may not be built yet.")


if __name__ == "__main__":
    import uvicorn
    
    # Run the server
    # Command: uvicorn app.main:app --reload
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
