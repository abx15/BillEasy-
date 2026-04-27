# Prediction Router - ML prediction endpoints
from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
import time
import numpy as np

from app.models.schemas import PredictionRequest, PredictionResponse, ErrorResponse
from app.models.ml_model import ml_model

router = APIRouter(prefix="/predict", tags=["ML Prediction"])

@router.post("/", response_model=PredictionResponse, summary="Make ML prediction")
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
        result = ml_model.predict({"input": request.input})
        
        # Calculate processing time
        processing_time = (time.time() - start_time) * 1000
        
        if "error" in result:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result["error"]
            )
        
        return PredictionResponse(
            prediction=result["prediction"],
            confidence=result["confidence"],
            input=result["input"],
            model_type=result["model_type"],
            timestamp=result["timestamp"],
            processing_time_ms=processing_time
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )

@router.post("/batch", response_model=list[PredictionResponse], summary="Batch predictions")
async def make_batch_predictions(requests: list[PredictionRequest]) -> list[PredictionResponse]:
    """
    Make batch predictions for multiple inputs
    
    - **requests**: List of prediction requests
    
    Returns list of predictions
    """
    try:
        results = []
        
        for request in requests:
            start_time = time.time()
            
            # Make prediction
            result = ml_model.predict({"input": request.input})
            
            # Calculate processing time
            processing_time = (time.time() - start_time) * 1000
            
            if "error" not in result:
                results.append(PredictionResponse(
                    prediction=result["prediction"],
                    confidence=result["confidence"],
                    input=result["input"],
                    model_type=result["model_type"],
                    timestamp=result["timestamp"],
                    processing_time_ms=processing_time
                ))
            else:
                # For batch, we include error responses as well
                results.append(PredictionResponse(
                    prediction="error",
                    confidence=0.0,
                    input=request.input,
                    model_type="error",
                    timestamp=str(np.datetime64('now')),
                    processing_time_ms=processing_time
                ))
        
        return results
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch prediction failed: {str(e)}"
        )

@router.get("/models", summary="Get available ML models")
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
            "batch_prediction",
            "confidence_scoring"
        ]
    }
