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
        self.model_type = "BillEasy Analytics Engine v1.0"
        self.is_trained = True
        
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
        if any(word in text_input for word in ["revenue", "sales", "profit"]):
            prediction = "Based on current growth trends, your revenue is projected to increase by 12% next month. High-margin product categories are driving this surge."
            confidence = 94.5
        elif any(word in text_input for word in ["inventory", "stock", "depletion"]):
            prediction = "Warning: 3 critical items (Organic Turmeric, Refined Sugar, Sunflower Oil) are depleting 2.4x faster than usual. Reorder recommended within 48 hours."
            confidence = 88.2
        elif any(word in text_input for word in ["customer", "retention", "loyalty"]):
            prediction = "Customer retention is currently at 82%. Your 'Repeat Business' segment grew by 15% this week, primarily due to recent promotional offers."
            confidence = 91.0
        elif any(word in text_input for word in ["tax", "gst", "liability"]):
            prediction = "Your estimated tax liability for this quarter is ₹1,12,450. Optimal input tax credit usage can reduce this by approximately 8%."
            confidence = 96.8
        else:
            prediction = "I've analyzed your query. While I need more specific data for a deep dive, your overall business health remains 'Robust' with a positive cash flow trend."
            confidence = 75.0
        
        return {
            "prediction": prediction,
            "confidence": confidence,
            "input": text_input,
            "model_type": self.model_type,
            "timestamp": str(np.datetime64('now'))
        }

# Global model instance
ml_model = SimpleMLModel()
