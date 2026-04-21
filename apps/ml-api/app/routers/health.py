# Health Router - Health check endpoints
from fastapi import APIRouter
from app.models.schemas import HealthResponse
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    
    Returns service status and basic information.
    """
    return HealthResponse(
        status="ok",
        service="ml-api",
        version="1.0.0",
        timestamp=datetime.now()
    )
