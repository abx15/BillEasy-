# Analytics Router - Business analytics endpoints
from fastapi import APIRouter, HTTPException
from app.services.analytics_service import AnalyticsService
from app.models.schemas import AnalyticsRequest, AnalyticsResponse

router = APIRouter()
analytics_service = AnalyticsService()

@router.post("/report", response_model=AnalyticsResponse)
async def generate_analytics_report(request: AnalyticsRequest):
    """
    Generate comprehensive business analytics report
    
    - **bills_data**: Array of bill data for analysis
    - **report_type**: Type of report to generate (default: "business_insights")
    
    Returns detailed insights including:
    - Total revenue and bill count
    - Daily sales breakdown
    - Top products and customers
    - Hourly sales patterns
    - Payment method distribution
    """
    try:
        report = await analytics_service.generate_business_report(request)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate analytics report: {str(e)}")
