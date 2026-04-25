# PDF Service Tests
import pytest
import io
from app.services.pdf_service import PDFService
from app.models.schemas import InvoiceRequest, Bill, Business, Customer, BillItem

class TestPDFService:
    def setup_method(self):
        self.pdf_service = PDFService()

    def create_mock_invoice_data(self, business_name="Test Medical Store", customer_name="John Doe"):
        """Helper method to create mock invoice data"""
        business = Business(
            name=business_name,
            owner_name="Dr. Smith",
            phone="+1234567890",
            email="test@medical.com",
            gst_number="27AAAPL1234C1ZV",
            address="123 Medical Street, Test City"
        )
        
        customer = Customer(
            name=customer_name,
            phone="+9876543210",
            email="john@example.com",
            address="456 Customer Lane"
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
            )
        ]
        
        bill = Bill(
            invoice_number="INV-2026-001",
            created_at="2026-01-15T10:30:00",
            payment_status="PAID",
            subtotal=106.00,
            gst_amount=13.98,
            discount_amount=0.00,
            total_amount=119.98,
            items=items
        )
        
        return InvoiceRequest(business=business, customer=customer, bill=bill)

    @pytest.mark.asyncio
    async def test_pdf_generation_returns_bytes(self):
        """Test that PDF generation returns bytes"""
        invoice_data = self.create_mock_invoice_data()
        
        result = await self.pdf_service.generate_invoice_pdf(invoice_data)
        
        assert isinstance(result, bytes)
        assert len(result) > 0
        # Check PDF header
        assert result.startswith(b'%PDF')

    @pytest.mark.asyncio
    async def test_pdf_contains_business_name(self):
        """Test that PDF contains business name"""
        business_name = "Test Medical Store"
        invoice_data = self.create_mock_invoice_data(business_name=business_name)
        
        pdf_bytes = await self.pdf_service.generate_invoice_pdf(invoice_data)
        
        # Convert to text for verification (simple approach)
        pdf_text = pdf_bytes.decode('utf-8', errors='ignore')
        assert business_name in pdf_text

    @pytest.mark.asyncio
    async def test_pdf_with_multiple_items(self):
        """Test PDF generation with multiple items"""
        # Create invoice with 5 items
        business = Business(
            name="Multi Item Store",
            owner_name="Test Owner",
            phone="1234567890",
            email="test@example.com"
        )
        
        customer = Customer(name="Test Customer")
        
        items = []
        for i in range(5):
            items.append(BillItem(
                product_name=f"Product {i+1}",
                sku=f"SKU-{i+1}",
                quantity=i+1,
                price=float(10 * (i+1)),
                gst_percent=18,
                gst_amount=float(10 * (i+1) * 0.18),
                total=float((10 * (i+1)) * 1.18)
            ))
        
        bill = Bill(
            invoice_number="INV-MULTI-001",
            created_at="2026-01-15T10:30:00",
            payment_status="PAID",
            subtotal=sum(item.price * item.quantity for item in items),
            gst_amount=sum(item.gst_amount for item in items),
            discount_amount=0.00,
            total_amount=sum(item.total for item in items),
            items=items
        )
        
        invoice_data = InvoiceRequest(business=business, customer=customer, bill=bill)
        
        # Should not throw and should generate PDF successfully
        pdf_bytes = await self.pdf_service.generate_invoice_pdf(invoice_data)
        assert isinstance(pdf_bytes, bytes)
        assert len(pdf_bytes) > 0

    @pytest.mark.asyncio
    async def test_pdf_with_no_customer(self):
        """Test PDF generation with walk-in customer (customer=None)"""
        business = Business(
            name="Walk-in Store",
            owner_name="Test Owner",
            phone="1234567890",
            email="test@example.com"
        )
        
        # Create walk-in customer
        customer = Customer(name="Walk-in Customer", phone=None, email=None)
        
        items = [
            BillItem(
                product_name="Quick Medicine",
                sku="QUICK-001",
                quantity=1,
                price=25.00,
                gst_percent=5,
                gst_amount=1.25,
                total=26.25
            )
        ]
        
        bill = Bill(
            invoice_number="INV-WALK-001",
            created_at="2026-01-15T10:30:00",
            payment_status="PENDING",
            subtotal=25.00,
            gst_amount=1.25,
            discount_amount=0.00,
            total_amount=26.25,
            items=items
        )
        
        invoice_data = InvoiceRequest(business=business, customer=customer, bill=bill)
        
        # Should not throw
        pdf_bytes = await self.pdf_service.generate_invoice_pdf(invoice_data)
        assert isinstance(pdf_bytes, bytes)
        assert len(pdf_bytes) > 0

    @pytest.mark.asyncio
    async def test_pdf_with_discount(self):
        """Test PDF generation with discount"""
        invoice_data = self.create_mock_invoice_data()
        # Add discount to the bill
        invoice_data.bill.discount_amount = 10.00
        invoice_data.bill.total_amount = 109.98  # 119.98 - 10.00
        
        pdf_bytes = await self.pdf_service.generate_invoice_pdf(invoice_data)
        
        assert isinstance(pdf_bytes, bytes)
        assert len(pdf_bytes) > 0

    @pytest.mark.asyncio
    async def test_pdf_with_unpaid_status(self):
        """Test PDF generation with unpaid status"""
        invoice_data = self.create_mock_invoice_data()
        invoice_data.bill.payment_status = "PENDING"
        
        pdf_bytes = await self.pdf_service.generate_invoice_pdf(invoice_data)
        
        assert isinstance(pdf_bytes, bytes)
        assert len(pdf_bytes) > 0

    @pytest.mark.asyncio
    async def test_pdf_with_partial_payment(self):
        """Test PDF generation with partial payment status"""
        invoice_data = self.create_mock_invoice_data()
        invoice_data.bill.payment_status = "PARTIAL"
        
        pdf_bytes = await self.pdf_service.generate_invoice_pdf(invoice_data)
        
        assert isinstance(pdf_bytes, bytes)
        assert len(pdf_bytes) > 0

    @pytest.mark.asyncio
    async def test_pdf_with_zero_gst_items(self):
        """Test PDF generation with zero GST items"""
        business = Business(name="Zero GST Store")
        customer = Customer(name="Test Customer")
        
        items = [
            BillItem(
                product_name="Exempt Medicine",
                sku="EXEMPT-001",
                quantity=1,
                price=50.00,
                gst_percent=0,
                gst_amount=0.00,
                total=50.00
            )
        ]
        
        bill = Bill(
            invoice_number="INV-ZERO-001",
            created_at="2026-01-15T10:30:00",
            payment_status="PAID",
            subtotal=50.00,
            gst_amount=0.00,
            discount_amount=0.00,
            total_amount=50.00,
            items=items
        )
        
        invoice_data = InvoiceRequest(business=business, customer=customer, bill=bill)
        
        pdf_bytes = await self.pdf_service.generate_invoice_pdf(invoice_data)
        
        assert isinstance(pdf_bytes, bytes)
        assert len(pdf_bytes) > 0

    @pytest.mark.asyncio
    async def test_pdf_with_large_quantities(self):
        """Test PDF generation with large quantities"""
        business = Business(name="Bulk Store")
        customer = Customer(name="Bulk Customer")
        
        items = [
            BillItem(
                product_name="Bulk Medicine",
                sku="BULK-001",
                quantity=1000,
                price=0.50,
                gst_percent=5,
                gst_amount=25.00,
                total=525.00
            )
        ]
        
        bill = Bill(
            invoice_number="INV-BULK-001",
            created_at="2026-01-15T10:30:00",
            payment_status="PAID",
            subtotal=500.00,
            gst_amount=25.00,
            discount_amount=0.00,
            total_amount=525.00,
            items=items
        )
        
        invoice_data = InvoiceRequest(business=business, customer=customer, bill=bill)
        
        pdf_bytes = await self.pdf_service.generate_invoice_pdf(invoice_data)
        
        assert isinstance(pdf_bytes, bytes)
        assert len(pdf_bytes) > 0
