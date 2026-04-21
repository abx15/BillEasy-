# GST Router - GST calculation endpoints
from fastapi import APIRouter, HTTPException
from app.services.gst_service import GSTService
from app.models.schemas import (
    GSTCalculateRequest, GSTCalculateResponse, 
    GSTRatesResponse
)

router = APIRouter()
gst_service = GSTService()

@router.post("/calculate", response_model=GSTCalculateResponse)
async def calculate_gst(request: GSTCalculateRequest):
    """
    Calculate GST for given amount and rate
    
    - **amount**: Amount before GST (must be positive)
    - **gst_percent**: GST percentage (0, 5, 12, 18, 28)
    - **is_interstate**: True for IGST, False for CGST+SGST
    """
    try:
        result = await gst_service.calculate_gst(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate GST: {str(e)}")

@router.get("/rates", response_model=GSTRatesResponse)
async def get_gst_rates():
    """
    Get available GST rates with examples
    
    Returns all GST slabs (0%, 5%, 12%, 18%, 28%) with descriptions and examples.
    """
    try:
        rates_response = await gst_service.get_gst_rates()
        return rates_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get GST rates: {str(e)}")
