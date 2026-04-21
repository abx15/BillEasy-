# Analytics Service - Business analytics calculations
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from collections import defaultdict, Counter
from ..models.schemas import (
    AnalyticsRequest, AnalyticsResponse, BusinessInsights,
    DailySalesData, TopProductData, TopCustomerData, HourlySalesData
)

class AnalyticsService:
    def __init__(self):
        pass

    async def generate_business_report(self, request: AnalyticsRequest) -> AnalyticsResponse:
        """Generate comprehensive business analytics report"""
        bills_data = request.bills_data
        
        if not bills_data:
            return AnalyticsResponse(
                insights=self._empty_insights(),
                report_type=request.report_type,
                generated_at=datetime.now(),
                success=True
            )
        
        # Calculate various metrics
        total_revenue = sum(bill.total_amount for bill in bills_data)
        total_bills = len(bills_data)
        average_bill_value = total_revenue / total_bills if total_bills > 0 else 0
        
        # Payment status breakdown
        paid_vs_pending = self._calculate_payment_breakdown(bills_data)
        
        # Daily sales data
        daily_sales = self._calculate_daily_sales(bills_data)
        
        # Top products
        top_products = self._calculate_top_products(bills_data)
        
        # Top customers
        top_customers = self._calculate_top_customers(bills_data)
        
        # Hourly breakdown
        hourly_breakdown = self._calculate_hourly_sales(bills_data)
        
        # Payment methods breakdown
        payment_methods = self._calculate_payment_methods(bills_data)
        
        # Growth percentage (if we have previous period data)
        growth_percentage = await self._calculate_growth(bills_data)
        
        insights = BusinessInsights(
            total_revenue=total_revenue,
            total_bills=total_bills,
            average_bill_value=average_bill_value,
            paid_vs_pending=paid_vs_pending,
            daily_sales=daily_sales,
            top_products=top_products,
            top_customers=top_customers,
            hourly_breakdown=hourly_breakdown,
            payment_methods=payment_methods,
            growth_percentage=growth_percentage
        )
        
        return AnalyticsResponse(
            insights=insights,
            report_type=request.report_type,
            generated_at=datetime.now(),
            success=True
        )
    
    def _calculate_payment_breakdown(self, bills_data: List) -> Dict[str, float]:
        """Calculate paid vs pending amounts"""
        paid = sum(bill.total_amount for bill in bills_data if bill.payment_status == 'PAID')
        pending = sum(bill.total_amount for bill in bills_data if bill.payment_status == 'PENDING')
        partial = sum(bill.total_amount for bill in bills_data if bill.payment_status == 'PARTIAL')
        
        return {
            'PAID': paid,
            'PENDING': pending,
            'PARTIAL': partial
        }
    
    def _calculate_daily_sales(self, bills_data: List) -> List[DailySalesData]:
        """Calculate daily sales data"""
        daily_data = defaultdict(lambda: {'total_sales': 0, 'bill_count': 0, 'paid': 0, 'pending': 0})
        
        for bill in bills_data:
            date_str = bill.created_at.strftime('%Y-%m-%d')
            daily_data[date_str]['total_sales'] += bill.total_amount
            daily_data[date_str]['bill_count'] += 1
            
            if bill.payment_status == 'PAID':
                daily_data[date_str]['paid'] += bill.total_amount
            else:
                daily_data[date_str]['pending'] += bill.total_amount
        
        # Convert to list and sort by date
        result = []
        for date_str, data in sorted(daily_data.items()):
            result.append(DailySalesData(
                date=date_str,
                total_sales=data['total_sales'],
                bill_count=data['bill_count'],
                paid_amount=data['paid'],
                pending_amount=data['pending']
            ))
        
        return result
    
    def _calculate_top_products(self, bills_data: List) -> List[TopProductData]:
        """Calculate top selling products"""
        product_sales = defaultdict(lambda: {'quantity': 0, 'revenue': 0})
        
        for bill in bills_data:
            for item in bill.items:
                product_sales[item.product_name]['quantity'] += item.quantity
                product_sales[item.product_name]['revenue'] += item.total
        
        # Sort by quantity and take top 10
        sorted_products = sorted(
            product_sales.items(),
            key=lambda x: x[1]['quantity'],
            reverse=True
        )[:10]
        
        result = []
        for product_name, data in sorted_products:
            result.append(TopProductData(
                product_name=product_name,
                quantity_sold=data['quantity'],
                revenue=data['revenue']
            ))
        
        return result
    
    def _calculate_top_customers(self, bills_data: List) -> List[TopCustomerData]:
        """Calculate top customers by spending"""
        customer_spending = defaultdict(lambda: {'total_spent': 0, 'bill_count': 0})
        
        for bill in bills_data:
            # Use customer name as identifier (in real app, would use customer_id)
            customer_key = f"customer_{bill.id}"  # Placeholder
            customer_spending[customer_key]['total_spent'] += bill.total_amount
            customer_spending[customer_key]['bill_count'] += 1
        
        # Sort by total spent and take top 10
        sorted_customers = sorted(
            customer_spending.items(),
            key=lambda x: x[1]['total_spent'],
            reverse=True
        )[:10]
        
        result = []
        for customer_key, data in sorted_customers:
            result.append(TopCustomerData(
                customer_name=f"Customer {customer_key}",
                total_spent=data['total_spent'],
                bill_count=data['bill_count']
            ))
        
        return result
    
    def _calculate_hourly_sales(self, bills_data: List) -> List[HourlySalesData]:
        """Calculate hourly sales breakdown"""
        hourly_data = defaultdict(lambda: {'sales_amount': 0, 'bill_count': 0})
        
        for bill in bills_data:
            hour = bill.created_at.hour
            hourly_data[hour]['sales_amount'] += bill.total_amount
            hourly_data[hour]['bill_count'] += 1
        
        # Convert to list and sort by hour
        result = []
        for hour in range(24):
            data = hourly_data.get(hour, {'sales_amount': 0, 'bill_count': 0})
            result.append(HourlySalesData(
                hour=hour,
                sales_amount=data['sales_amount'],
                bill_count=data['bill_count']
            ))
        
        return result
    
    def _calculate_payment_methods(self, bills_data: List) -> Dict[str, float]:
        """Calculate payment methods breakdown"""
        payment_methods = defaultdict(float)
        
        for bill in bills_data:
            if bill.payment_method:
                payment_methods[bill.payment_method] += bill.total_amount
        
        return dict(payment_methods)
    
    async def _calculate_growth(self, bills_data: List) -> Optional[float]:
        """Calculate growth percentage compared to previous period"""
        # This would require historical data comparison
        # For now, return None as placeholder
        return None
    
    def _empty_insights(self) -> BusinessInsights:
        """Return empty insights structure"""
        return BusinessInsights(
            total_revenue=0.0,
            total_bills=0,
            average_bill_value=0.0,
            paid_vs_pending={'PAID': 0.0, 'PENDING': 0.0, 'PARTIAL': 0.0},
            daily_sales=[],
            top_products=[],
            top_customers=[],
            hourly_breakdown=[HourlySalesData(hour=h, sales_amount=0.0, bill_count=0) for h in range(24)],
            payment_methods={},
            growth_percentage=None
        )
