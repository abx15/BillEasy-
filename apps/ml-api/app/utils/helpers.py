# Helpers - Common utility functions
import uuid
from datetime import datetime
from typing import Any, Dict

def generate_invoice_number() -> str:
    """Generate unique invoice number"""
    timestamp = datetime.now().strftime("%Y%m%d")
    unique_id = str(uuid.uuid4())[:8].upper()
    return f"INV-{timestamp}-{unique_id}"

def format_currency(amount: float) -> str:
    """Format amount as Indian currency"""
    return f"Rs. {amount:,.2f}"

def validate_gst_number(gst_number: str) -> bool:
    """Validate GST number format"""
    # Basic GST validation (15 characters, alphanumeric)
    if len(gst_number) != 15:
        return False
    return gst_number[:2].isdigit() and gst_number[2:12].isalnum()

def calculate_financial_year(date: datetime) -> str:
    """Calculate financial year for given date"""
    if date.month >= 4:
        return f"{date.year}-{date.year + 1}"
    else:
        return f"{date.year - 1}-{date.year}"

def safe_json_serialize(obj: Any) -> Any:
    """Safely serialize object to JSON"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    elif hasattr(obj, '__dict__'):
        return obj.__dict__
    return str(obj)
