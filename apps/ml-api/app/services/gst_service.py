# GST Service - GST calculation (CGST, SGST, IGST logic)
from typing import Dict, List
from ..models.schemas import GSTCalculateRequest, GSTCalculateResponse, GSTRateInfo, GSTRatesResponse

class GSTService:
    def __init__(self):
        self.gst_rates_info = [
            {
                "rate": 0,
                "description": "Exempted Goods",
                "examples": ["Fresh fruits & vegetables", "Unprocessed food grains", "Books", "Educational services"]
            },
            {
                "rate": 5,
                "description": "Essential Items",
                "examples": ["Transport services (railway, airway)", "Small restaurants (non-AC)", "Life-saving drugs", "Coffee, tea, spices"]
            },
            {
                "rate": 12,
                "description": "Standard Rate",
                "examples": ["Computers, laptops", "Processed food", "Mobile phones", "Hotel accommodation (under Rs 1000)"]
            },
            {
                "rate": 18,
                "description": "Standard Rate",
                "examples": ["Restaurant services (AC)", "Telecom services", "Construction services", "Most manufactured goods"]
            },
            {
                "rate": 28,
                "description": "Luxury Items",
                "examples": ["Automobiles", "Aerated drinks", "Tobacco products", "5-star hotels", "Cinema tickets"]
            }
        ]

    async def calculate_gst(self, request: GSTCalculateRequest) -> GSTCalculateResponse:
        """Calculate GST with CGST, SGST, IGST logic"""
        amount = request.amount
        gst_percent = request.gst_percent
        is_interstate = request.is_interstate
        
        # Validate GST rate
        valid_rates = [0, 5, 12, 18, 28]
        if gst_percent not in valid_rates:
            raise ValueError(f"Invalid GST rate. Must be one of: {valid_rates}")
        
        gst_amount = amount * (gst_percent / 100)
        
        # For same state, use CGST + SGST (half each)
        # For inter-state, use IGST (full amount)
        cgst = sgst = igst = 0
        
        if is_interstate:
            igst = gst_amount
        else:
            cgst = gst_amount / 2
            sgst = gst_amount / 2
        
        return GSTCalculateResponse(
            amount=amount,
            gst_percent=gst_percent,
            cgst=cgst,
            sgst=sgst,
            igst=igst,
            total_gst=gst_amount,
            final_amount=amount + gst_amount,
            is_interstate=is_interstate
        )

    async def get_gst_rates(self) -> GSTRatesResponse:
        """Get available GST rates with examples"""
        rates = []
        for rate_info in self.gst_rates_info:
            rates.append(GSTRateInfo(
                rate=rate_info["rate"],
                description=rate_info["description"],
                examples=rate_info["examples"]
            ))
        
        return GSTRatesResponse(rates=rates)
