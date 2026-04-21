# Pydantic Schemas - All request/response models
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

# Invoice Schemas
class BillItemSchema(BaseModel):
    product_name: str
    product_sku: Optional[str] = None
    quantity: int
    price: float
    gst_percent: float
    gst_amount: float
    total: float

class BusinessSchema(BaseModel):
    id: str
    name: str
    owner_name: str
    phone: str
    email: str
    gst_number: Optional[str] = None
    address: Optional[str] = None
    logo_url: Optional[str] = None

class CustomerSchema(BaseModel):
    id: str
    name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None

class BillSchema(BaseModel):
    id: str
    invoice_number: str
    subtotal: float
    discount_amount: float = 0
    gst_amount: float
    total_amount: float
    payment_status: str
    payment_method: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    items: List[BillItemSchema]

class InvoiceRequest(BaseModel):
    bill: BillSchema
    business: BusinessSchema
    customer: CustomerSchema

class InvoiceResponse(BaseModel):
    pdf_url: Optional[str] = None
    pdf_base64: Optional[str] = None
    invoice_number: str
    success: bool

# GST Schemas
class GSTCalculateRequest(BaseModel):
    amount: float = Field(gt=0, description="Amount before GST")
    gst_percent: float = Field(ge=0, description="GST percentage (0, 5, 12, 18, 28)")
    is_interstate: bool = Field(default=False, description="True for IGST, False for CGST+SGST")

class GSTCalculateResponse(BaseModel):
    amount: float
    gst_percent: float
    cgst: float = 0
    sgst: float = 0
    igst: float = 0
    total_gst: float
    final_amount: float
    is_interstate: bool

class GSTRateInfo(BaseModel):
    rate: float
    description: str
    examples: List[str]

class GSTRatesResponse(BaseModel):
    rates: List[GSTRateInfo]

# Analytics Schemas
class AnalyticsRequest(BaseModel):
    bills_data: List[BillSchema]
    report_type: str = Field(default="business_insights")

class DailySalesData(BaseModel):
    date: str
    total_sales: float
    bill_count: int
    paid_amount: float
    pending_amount: float

class TopProductData(BaseModel):
    product_name: str
    quantity_sold: int
    revenue: float

class TopCustomerData(BaseModel):
    customer_name: str
    total_spent: float
    bill_count: int

class HourlySalesData(BaseModel):
    hour: int
    sales_amount: float
    bill_count: int

class BusinessInsights(BaseModel):
    total_revenue: float
    total_bills: int
    average_bill_value: float
    paid_vs_pending: Dict[str, float]
    daily_sales: List[DailySalesData]
    top_products: List[TopProductData]
    top_customers: List[TopCustomerData]
    hourly_breakdown: List[HourlySalesData]
    payment_methods: Dict[str, float]
    growth_percentage: Optional[float] = None

class AnalyticsResponse(BaseModel):
    insights: BusinessInsights
    report_type: str
    generated_at: datetime
    success: bool

# Health Check Schema
class HealthResponse(BaseModel):
    status: str
    service: str
    version: str = "1.0.0"
    timestamp: datetime
