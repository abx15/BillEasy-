# Pydantic Schemas - Request/Response models for ML API
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime

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

class ErrorResponse(BaseModel):
    """Error response model"""
    error: str = Field(..., description="Error message")
    status: str = Field(default="error", description="Error status")
