# Simple FastAPI ML Service - Minimal working version
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
import time
import random
import os

# Initialize FastAPI app
app = FastAPI(
    title="BillEasy ML API",
    description="Simple ML prediction service for BillEasy",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Pydantic models
class PredictionRequest(BaseModel):
    """Request model for prediction endpoint"""
    input: str = Field(..., description="Input text for prediction", min_length=1, max_length=1000)
    context: Optional[Dict[str, Any]] = Field(None, description="Additional context for prediction")

class PredictionResponse(BaseModel):
    """Response model for prediction endpoint"""
    prediction: str = Field(..., description="Predicted category or result")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score (0-1)")
    input: str = Field(..., description="Original input text")
    model_type: str = Field(..., description="Type of model used")
    timestamp: str = Field(..., description="Prediction timestamp")
    processing_time_ms: Optional[float] = Field(None, description="Processing time in milliseconds")

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    service: str
    version: str
    timestamp: str

# Simple ML prediction logic
def make_simple_prediction(text_input: str) -> Dict[str, Any]:
    """
    Simple rule-based prediction for demonstration
    """
    text_lower = text_input.lower()
    
    # Simple rule-based classification
    if any(word in text_lower for word in ["invoice", "bill", "payment", "receipt"]):
        prediction = "billing_related"
        confidence = random.uniform(0.80, 0.95)
    elif any(word in text_lower for word in ["product", "item", "inventory", "stock"]):
        prediction = "product_related"
        confidence = random.uniform(0.75, 0.90)
    elif any(word in text_lower for word in ["customer", "client", "user"]):
        prediction = "customer_related"
        confidence = random.uniform(0.70, 0.85)
    elif any(word in text_lower for word in ["report", "analytics", "sales", "revenue"]):
        prediction = "analytics_related"
        confidence = random.uniform(0.85, 0.95)
    else:
        prediction = "general"
        confidence = random.uniform(0.50, 0.70)
    
    return {
        "prediction": prediction,
        "confidence": round(confidence, 2),
        "input": text_input,
        "model_type": "demo_classification",
        "timestamp": str(time.time())
    }

# API Endpoints
@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint with service information"""
    return HealthResponse(
        status="ok",
        service="ml-api",
        version="1.0.0",
        timestamp=str(time.time())
    )

@app.post("/predict", response_model=PredictionResponse)
async def make_prediction(request: PredictionRequest) -> PredictionResponse:
    """
    Make a prediction using the ML model
    
    - **input**: Text input for prediction
    - **context**: Optional additional context
    
    Returns prediction with confidence score
    """
    try:
        start_time = time.time()
        
        # Make prediction
        result = make_simple_prediction(request.input)
        
        # Calculate processing time
        processing_time = (time.time() - start_time) * 1000
        
        return PredictionResponse(
            prediction=result["prediction"],
            confidence=result["confidence"],
            input=result["input"],
            model_type=result["model_type"],
            timestamp=result["timestamp"],
            processing_time_ms=round(processing_time, 2)
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )

@app.get("/predict/models")
async def get_available_models() -> Dict[str, Any]:
    """
    Get information about available ML models
    """
    return {
        "available_models": [
            {
                "name": "demo_classification",
                "type": "text_classification",
                "description": "Demo text classification model",
                "status": "active",
                "version": "1.0.0"
            }
        ],
        "default_model": "demo_classification",
        "supported_inputs": ["text"],
        "max_input_length": 1000,
        "features": [
            "single_prediction",
            "confidence_scoring"
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ml-api"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    print(f"Starting ML API server on {host}:{port}")
    print(f"Documentation available at: http://{host}:{port}/docs")
    
    uvicorn.run(
        app, 
        host=host, 
        port=port,
        reload=True
    )
