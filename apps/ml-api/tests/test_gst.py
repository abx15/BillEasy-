# GST Service Tests
import pytest
from app.services.gst_service import GSTService
from app.models.schemas import GSTCalculateRequest

class TestGSTService:
    def setup_method(self):
        self.gst_service = GSTService()

    @pytest.mark.asyncio
    async def test_cgst_sgst_for_intrastate(self):
        """Test CGST and SGST calculation for intrastate transactions"""
        request = GSTCalculateRequest(
            amount=1000,
            gst_percent=18,
            is_interstate=False
        )
        
        result = await self.gst_service.calculate_gst(request)
        
        assert result.cgst == 90  # 180 / 2
        assert result.sgst == 90  # 180 / 2
        assert result.igst == 0
        assert result.total_gst == 180
        assert result.final_amount == 1180
        assert result.is_interstate is False

    @pytest.mark.asyncio
    async def test_igst_for_interstate(self):
        """Test IGST calculation for interstate transactions"""
        request = GSTCalculateRequest(
            amount=1000,
            gst_percent=18,
            is_interstate=True
        )
        
        result = await self.gst_service.calculate_gst(request)
        
        assert result.igst == 180  # Full GST amount
        assert result.cgst == 0
        assert result.sgst == 0
        assert result.total_gst == 180
        assert result.final_amount == 1180
        assert result.is_interstate is True

    @pytest.mark.asyncio
    async def test_zero_gst(self):
        """Test zero GST calculation"""
        request = GSTCalculateRequest(
            amount=1000,
            gst_percent=0,
            is_interstate=False
        )
        
        result = await self.gst_service.calculate_gst(request)
        
        assert result.total_gst == 0
        assert result.cgst == 0
        assert result.sgst == 0
        assert result.igst == 0
        assert result.final_amount == 1000

    @pytest.mark.asyncio
    async def test_five_percent_slab(self):
        """Test 5% GST slab calculation"""
        request = GSTCalculateRequest(
            amount=500,
            gst_percent=5,
            is_interstate=False
        )
        
        result = await self.gst_service.calculate_gst(request)
        
        assert result.total_gst == 25  # 500 * 5%
        assert result.cgst == 12.5
        assert result.sgst == 12.5
        assert result.igst == 0
        assert result.final_amount == 525

    @pytest.mark.asyncio
    async def test_twenty_eight_percent_slab(self):
        """Test 28% GST slab calculation (luxury items)"""
        request = GSTCalculateRequest(
            amount=10000,
            gst_percent=28,
            is_interstate=True
        )
        
        result = await self.gst_service.calculate_gst(request)
        
        assert result.total_gst == 2800  # 10000 * 28%
        assert result.igst == 2800
        assert result.cgst == 0
        assert result.sgst == 0
        assert result.final_amount == 12800

    @pytest.mark.asyncio
    async def test_invalid_gst_rate(self):
        """Test that invalid GST rate raises ValueError"""
        request = GSTCalculateRequest(
            amount=1000,
            gst_percent=15,  # Invalid rate
            is_interstate=False
        )
        
        with pytest.raises(ValueError, match="Invalid GST rate"):
            await self.gst_service.calculate_gst(request)

    @pytest.mark.asyncio
    async def test_twelve_percent_slab(self):
        """Test 12% GST slab calculation"""
        request = GSTCalculateRequest(
            amount=2000,
            gst_percent=12,
            is_interstate=False
        )
        
        result = await self.gst_service.calculate_gst(request)
        
        assert result.total_gst == 240  # 2000 * 12%
        assert result.cgst == 120
        assert result.sgst == 120
        assert result.igst == 0
        assert result.final_amount == 2240

    @pytest.mark.asyncio
    async def test_decimal_amounts(self):
        """Test GST calculation with decimal amounts"""
        request = GSTCalculateRequest(
            amount=999.99,
            gst_percent=18,
            is_interstate=False
        )
        
        result = await self.gst_service.calculate_gst(request)
        
        assert abs(result.total_gst - 179.9982) < 0.0001
        assert abs(result.cgst - 89.9991) < 0.0001
        assert abs(result.sgst - 89.9991) < 0.0001
        assert abs(result.final_amount - 1179.9882) < 0.0001

    @pytest.mark.asyncio
    async def test_get_gst_rates(self):
        """Test getting GST rates information"""
        result = await self.gst_service.get_gst_rates()
        
        assert len(result.rates) == 5
        
        # Check specific rates exist
        rates_dict = {rate.rate: rate for rate in result.rates}
        
        assert 0 in rates_dict
        assert 5 in rates_dict
        assert 12 in rates_dict
        assert 18 in rates_dict
        assert 28 in rates_dict
        
        # Check 0% rate details
        zero_rate = rates_dict[0]
        assert zero_rate.description == "Exempted Goods"
        assert "Fresh fruits & vegetables" in zero_rate.examples
        assert "Books" in zero_rate.examples
        
        # Check 28% rate details
        luxury_rate = rates_dict[28]
        assert luxury_rate.description == "Luxury Items"
        assert "Automobiles" in luxury_rate.examples
        assert "5-star hotels" in luxury_rate.examples
