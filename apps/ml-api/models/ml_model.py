# ML Model - Simple prediction model for demonstration
import numpy as np
from typing import Dict, Any
import joblib
import os

class SimpleMLModel:
    """
    Simple ML model for demonstration purposes.
    In production, this would be replaced with actual trained models.
    """
    
    def __init__(self):
        self.model_type = "demo_classification"
        self.is_trained = False
        
    def train(self, X: np.ndarray, y: np.ndarray):
        """Simple training logic - in production this would be real ML training"""
        # For demo purposes, we'll simulate training
        self.is_trained = True
        return {"status": "trained", "samples": len(X)}
    
    def predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Make prediction based on input features
        For demo: simple rule-based prediction
        """
        if not self.is_trained:
            return {
                "error": "Model not trained",
                "status": "error"
            }
        
        # Demo prediction logic
        text_input = features.get("input", "").lower()
        
        # Simple rule-based classification for demo
        if any(word in text_input for word in ["invoice", "bill", "payment"]):
            prediction = "billing_related"
            confidence = 0.85
        elif any(word in text_input for word in ["product", "item", "inventory"]):
            prediction = "product_related"
            confidence = 0.80
        elif any(word in text_input for word in ["customer", "client", "user"]):
            prediction = "customer_related"
            confidence = 0.75
        elif any(word in text_input for word in ["report", "analytics", "sales"]):
            prediction = "analytics_related"
            confidence = 0.90
        else:
            prediction = "general"
            confidence = 0.60
        
        return {
            "prediction": prediction,
            "confidence": confidence,
            "input": text_input,
            "model_type": self.model_type,
            "timestamp": str(np.datetime64('now'))
        }

# Global model instance
ml_model = SimpleMLModel()
