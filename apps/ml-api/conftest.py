# Pytest Configuration and Fixtures
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.schemas import InvoiceRequest, Bill, Business, Customer, BillItem

@pytest.fixture
def client():
    """TestClient fixture for API testing"""
    return TestClient(app)

@pytest.fixture
def mock_invoice_data():
    """Mock invoice data fixture for testing"""
    business = Business(
        name="Test Medical Store",
        owner_name="Dr. John Smith",
        phone="+1234567890",
        email="test@medicalstore.com",
        gst_number="27AAAPL1234C1ZV",
        address="123 Medical Street, Test City, State 123456"
    )
    
    customer = Customer(
        name="Jane Doe",
        phone="+9876543210",
        email="jane.doe@example.com",
        address="456 Customer Lane, Test City, State 123456"
    )
    
    items = [
        BillItem(
            product_name="Paracetamol 500mg",
            sku="PARA-500",
            quantity=2,
            price=10.50,
            gst_percent=18,
            gst_amount=3.78,
            total=24.78
        ),
        BillItem(
            product_name="Azithromycin 250mg",
            sku="AZI-250",
            quantity=1,
            price=85.00,
            gst_percent=12,
            gst_amount=10.20,
            total=95.20
        ),
        BillItem(
            product_name="Vitamin C Tablets",
            sku="VIT-C-500",
            quantity=3,
            price=15.75,
            gst_percent=5,
            gst_amount=2.36,
            total=50.61
        )
    ]
    
    bill = Bill(
        invoice_number="INV-2026-001",
        created_at="2026-01-15T10:30:00",
        payment_status="PAID",
        subtotal=147.75,
        gst_amount=16.34,
        discount_amount=5.00,
        total_amount=159.09,
        items=items
    )
    
    return InvoiceRequest(business=business, customer=customer, bill=bill)

@pytest.fixture
def mock_walkin_invoice_data():
    """Mock walk-in customer invoice data fixture"""
    business = Business(
        name="Quick Pharmacy",
        owner_name="Dr. Quick",
        phone="+1111111111",
        email="quick@pharmacy.com",
        gst_number="27AAAPL5678C1ZV",
        address="789 Quick Street"
    )
    
    customer = Customer(
        name="Walk-in Customer",
        phone=None,
        email=None,
        address=None
    )
    
    items = [
        BillItem(
            product_name="Emergency Medicine",
            sku="EMERG-001",
            quantity=1,
            price=25.00,
            gst_percent=0,
            gst_amount=0.00,
            total=25.00
        )
    ]
    
    bill = Bill(
        invoice_number="INV-WALK-001",
        created_at="2026-01-15T14:45:00",
        payment_status="PENDING",
        subtotal=25.00,
        gst_amount=0.00,
        discount_amount=0.00,
        total_amount=25.00,
        items=items
    )
    
    return InvoiceRequest(business=business, customer=customer, bill=bill)

@pytest.fixture
def mock_business_data():
    """Mock business data fixture"""
    return {
        "name": "Test Business",
        "owner_name": "Test Owner",
        "phone": "+1234567890",
        "email": "test@business.com",
        "gst_number": "27AAAPL1234C1ZV",
        "address": "123 Business Street"
    }

@pytest.fixture
def mock_gst_data():
    """Mock GST calculation data fixture"""
    return {
        "amount": 1000,
        "gst_percent": 18,
        "is_interstate": False
    }

@pytest.fixture
def mock_analytics_data():
    """Mock analytics request data fixture"""
    return {
        "business_id": "test-business-123",
        "date_range": {
            "start_date": "2026-01-01",
            "end_date": "2026-01-31"
        }
    }
