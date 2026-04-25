# API Routes Tests
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestPDFRouter:
    def test_post_pdf_invoice_success(self):
        """Test successful PDF invoice generation"""
        payload = {
            "business": {
                "name": "Test Medical Store",
                "owner_name": "Dr. Smith",
                "phone": "+1234567890",
                "email": "test@medical.com",
                "gst_number": "27AAAPL1234C1ZV",
                "address": "123 Medical Street"
            },
            "customer": {
                "name": "John Doe",
                "phone": "+9876543210",
                "email": "john@example.com",
                "address": "456 Customer Lane"
            },
            "bill": {
                "invoice_number": "INV-2026-001",
                "created_at": "2026-01-15T10:30:00",
                "payment_status": "PAID",
                "subtotal": 106.00,
                "gst_amount": 13.98,
                "discount_amount": 0.00,
                "total_amount": 119.98,
                "items": [
                    {
                        "product_name": "Paracetamol 500mg",
                        "sku": "PARA-500",
                        "quantity": 2,
                        "price": 10.50,
                        "gst_percent": 18,
                        "gst_amount": 3.78,
                        "total": 24.78
                    }
                ]
            }
        }
        
        response = client.post("/pdf/invoice", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert "pdf_url" in data
        assert "invoice_number" in data

    def test_post_pdf_invoice_missing_fields(self):
        """Test PDF invoice generation with missing required fields"""
        # Missing business name
        payload = {
            "business": {
                "owner_name": "Dr. Smith",
                "phone": "+1234567890",
                "email": "test@medical.com"
            },
            "customer": {
                "name": "John Doe"
            },
            "bill": {
                "invoice_number": "INV-2026-001",
                "subtotal": 106.00,
                "total_amount": 119.98,
                "items": []
            }
        }
        
        response = client.post("/pdf/invoice", json=payload)
        
        assert response.status_code == 422  # Unprocessable Entity

    def test_post_pdf_invoice_empty_items(self):
        """Test PDF invoice generation with empty items array"""
        payload = {
            "business": {
                "name": "Test Medical Store",
                "owner_name": "Dr. Smith",
                "phone": "+1234567890",
                "email": "test@medical.com"
            },
            "customer": {
                "name": "John Doe"
            },
            "bill": {
                "invoice_number": "INV-2026-001",
                "created_at": "2026-01-15T10:30:00",
                "payment_status": "PAID",
                "subtotal": 0.00,
                "gst_amount": 0.00,
                "discount_amount": 0.00,
                "total_amount": 0.00,
                "items": []
            }
        }
        
        response = client.post("/pdf/invoice", json=payload)
        
        # Should still work (empty invoice)
        assert response.status_code == 200
        data = response.json()
        assert "pdf_url" in data

class TestGSTRouter:
    def test_calculate_gst_endpoint(self):
        """Test GST calculation endpoint"""
        payload = {
            "amount": 1000,
            "gst_percent": 18,
            "is_interstate": False
        }
        
        response = client.post("/gst/calculate", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["amount"] == 1000
        assert data["gst_percent"] == 18
        assert data["cgst"] == 90.0
        assert data["sgst"] == 90.0
        assert data["igst"] == 0.0
        assert data["total_gst"] == 180.0
        assert data["final_amount"] == 1180.0
        assert data["is_interstate"] is False

    def test_calculate_gst_interstate(self):
        """Test GST calculation for interstate"""
        payload = {
            "amount": 1000,
            "gst_percent": 18,
            "is_interstate": True
        }
        
        response = client.post("/gst/calculate", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["cgst"] == 0.0
        assert data["sgst"] == 0.0
        assert data["igst"] == 180.0
        assert data["total_gst"] == 180.0
        assert data["final_amount"] == 1180.0
        assert data["is_interstate"] is True

    def test_calculate_gst_invalid_rate(self):
        """Test GST calculation with invalid rate"""
        payload = {
            "amount": 1000,
            "gst_percent": 15,  # Invalid rate
            "is_interstate": False
        }
        
        response = client.post("/gst/calculate", json=payload)
        
        assert response.status_code == 400  # Bad Request
        assert "Invalid GST rate" in response.text

    def test_get_gst_rates_returns_all_slabs(self):
        """Test getting GST rates returns all available slabs"""
        response = client.get("/gst/rates")
        
        assert response.status_code == 200
        data = response.json()
        assert "rates" in data
        rates = data["rates"]
        assert len(rates) == 5
        
        # Check that all expected rates are present
        rate_values = [rate["rate"] for rate in rates]
        assert 0 in rate_values
        assert 5 in rate_values
        assert 12 in rate_values
        assert 18 in rate_values
        assert 28 in rate_values

    def test_get_gst_rates_structure(self):
        """Test GST rates response structure"""
        response = client.get("/gst/rates")
        
        assert response.status_code == 200
        data = response.json()
        rates = data["rates"]
        
        for rate in rates:
            assert "rate" in rate
            assert "description" in rate
            assert "examples" in rate
            assert isinstance(rate["examples"], list)
            assert len(rate["examples"]) > 0

class TestHealthRouter:
    def test_health_check_returns_ok(self):
        """Test health check endpoint"""
        response = client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert "version" in data

    def test_root_endpoint(self):
        """Test root endpoint"""
        response = client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert "BillEasy ML API" in data["message"]

class TestAnalyticsRouter:
    def test_analytics_endpoint_success(self):
        """Test analytics endpoint with valid data"""
        payload = {
            "business_id": "test-business-123",
            "date_range": {
                "start_date": "2026-01-01",
                "end_date": "2026-01-31"
            }
        }
        
        response = client.post("/analytics/summary", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert "total_revenue" in data
        assert "total_bills" in data
        assert "average_bill_value" in data
        assert "top_products" in data

    def test_analytics_endpoint_invalid_date_range(self):
        """Test analytics endpoint with invalid date range"""
        payload = {
            "business_id": "test-business-123",
            "date_range": {
                "start_date": "2026-01-31",
                "end_date": "2026-01-01"  # End before start
            }
        }
        
        response = client.post("/analytics/summary", json=payload)
        
        assert response.status_code == 400

    def test_analytics_endpoint_missing_business_id(self):
        """Test analytics endpoint without business_id"""
        payload = {
            "date_range": {
                "start_date": "2026-01-01",
                "end_date": "2026-01-31"
            }
        }
        
        response = client.post("/analytics/summary", json=payload)
        
        assert response.status_code == 422

class TestErrorHandling:
    def test_404_not_found(self):
        """Test 404 error handling"""
        response = client.get("/nonexistent-endpoint")
        
        assert response.status_code == 404
        data = response.json()
        assert "detail" in data

    def test_method_not_allowed(self):
        """Test method not allowed error"""
        response = client.delete("/gst/rates")
        
        assert response.status_code == 405

    def test_invalid_json(self):
        """Test invalid JSON payload"""
        response = client.post(
            "/gst/calculate",
            data="invalid json",
            headers={"Content-Type": "application/json"}
        )
        
        assert response.status_code == 422
