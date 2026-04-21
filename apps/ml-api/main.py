# FastAPI Main - Application entry point
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import pdf, gst, analytics, health
from app.models.schemas import HealthResponse
from datetime import datetime
import os

app = FastAPI(
    title="BillEasy ML API",
    description="""
    ## Machine Learning Service for BillEasy Billing Software
    
    This API provides:
    - **PDF Generation**: Professional invoice PDFs with GST calculations
    - **GST Calculator**: Automatic GST calculations with CGST/SGST/IGST logic
    - **Business Analytics**: Comprehensive business insights and reports
    - **Health Monitoring**: Service health checks
    
    **Features:**
    - Professional invoice PDF generation
    - GST compliance for Indian businesses
    - Business analytics and insights
    - Real-time processing
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    contact={
        "name": "BillEasy Support",
        "email": "support@billeasy.in",
    },
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    }
)

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3001,http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers with proper prefixes
app.include_router(pdf.router, prefix="/pdf", tags=["PDF Generation"])
app.include_router(gst.router, prefix="/gst", tags=["GST Calculator"])
app.include_router(analytics.router, prefix="/analytics", tags=["Business Analytics"])
app.include_router(health.router, prefix="/health", tags=["Health Check"])

@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint with service information"""
    return HealthResponse(
        status="ok",
        service="ml-api",
        version="1.0.0",
        timestamp=datetime.now()
    )

@app.get("/info")
async def api_info():
    """API information and available endpoints"""
    return {
        "name": "BillEasy ML API",
        "version": "1.0.0",
        "description": "Machine learning service for BillEasy billing software",
        "endpoints": {
            "pdf": "/pdf - Invoice PDF generation",
            "gst": "/gst - GST calculation services", 
            "analytics": "/analytics - Business analytics",
            "health": "/health - Health checks",
            "docs": "/docs - Swagger documentation",
            "redoc": "/redoc - ReDoc documentation"
        },
        "features": [
            "Professional invoice PDF generation",
            "GST compliance (CGST/SGST/IGST)",
            "Business analytics and insights",
            "Real-time processing",
            "RESTful API design"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    uvicorn.run(
        app, 
        host=host, 
        port=port,
        reload=True if os.getenv("ENVIRONMENT") == "development" else False,
        log_level="info"
    )
