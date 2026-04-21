# PDF Service - ReportLab PDF generation logic
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.units import inch, cm
from reportlab.lib.colors import black, white, grey, lightgrey, darkblue
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
import io
import base64
import qrcode
from datetime import datetime
from typing import Dict, Any
from ..models.schemas import InvoiceRequest, InvoiceResponse

class PDFService:
    def __init__(self):
        self.page_size = A4
        self.margin = 2 * cm
        
    async def generate_invoice_pdf(self, invoice_data: InvoiceRequest) -> bytes:
        """Generate professional invoice PDF from bill data"""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=self.page_size, 
                               leftMargin=self.margin, rightMargin=self.margin,
                               topMargin=self.margin, bottomMargin=self.margin)
        
        # Build PDF content
        story = []
        styles = getSampleStyleSheet()
        
        # Add content sections
        story.extend(self._build_header(invoice_data, styles))
        story.extend(self._build_customer_info(invoice_data, styles))
        story.extend(self._build_items_table(invoice_data, styles))
        story.extend(self._build_summary(invoice_data, styles))
        story.extend(self._build_footer(invoice_data, styles))
        
        doc.build(story)
        buffer.seek(0)
        
        return buffer.getvalue()
    
    def _build_header(self, invoice_data: InvoiceRequest, styles: Dict) -> list:
        """Build invoice header section"""
        elements = []
        
        # Business info on left
        business = invoice_data.business
        business_text = f"""
        <b>{business.name}</b><br/>
        {business.owner_name}<br/>
        Phone: {business.phone}<br/>
        Email: {business.email}<br/>
        {business.gst_number or ''}<br/>
        {business.address or ''}
        """
        elements.append(Paragraph(business_text, styles['Normal']))
        
        # Invoice info on right
        bill = invoice_data.bill
        invoice_text = f"""
        <b>INVOICE</b><br/>
        Invoice #: {bill.invoice_number}<br/>
        Date: {bill.created_at.strftime('%d-%m-%Y')}<br/>
        Status: {bill.payment_status.upper()}
        """
        elements.append(Paragraph(invoice_text, styles['Normal']))
        
        elements.append(Spacer(1, 0.5 * cm))
        return elements
    
    def _build_customer_info(self, invoice_data: InvoiceRequest, styles: Dict) -> list:
        """Build customer information section"""
        elements = []
        
        customer = invoice_data.customer
        customer_text = f"""
        <b>Bill To:</b><br/>
        {customer.name}<br/>
        {customer.phone or ''}<br/>
        {customer.email or ''}<br/>
        {customer.address or ''}
        """
        elements.append(Paragraph(customer_text, styles['Normal']))
        
        elements.append(Spacer(1, 0.5 * cm))
        return elements
    
    def _build_items_table(self, invoice_data: InvoiceRequest, styles: Dict) -> list:
        """Build items table"""
        elements = []
        
        bill = invoice_data.bill
        
        # Table headers
        headers = ['#', 'Item Name', 'Qty', 'Unit Price', 'GST%', 'GST Amt', 'Total']
        table_data = [headers]
        
        # Table rows
        for i, item in enumerate(bill.items, 1):
            row = [
                str(i),
                item.product_name,
                str(item.quantity),
                f"Rs.{item.price:.2f}",
                f"{item.gst_percent}%",
                f"Rs.{item.gst_amount:.2f}",
                f"Rs.{item.total:.2f}"
            ]
            table_data.append(row)
        
        # Create table
        table = Table(table_data, colWidths=[0.5*cm, 6*cm, 1*cm, 2*cm, 1*cm, 1.5*cm, 2*cm])
        
        # Style the table
        table.setStyle(TableStyle([
            # Header styling
            ('BACKGROUND', (0, 0), (-1, 0), darkblue),
            ('TEXTCOLOR', (0, 0), (-1, 0), white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            
            # Data rows styling
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('ALIGN', (0, 1), (0, -1), 'CENTER'),  # S.No.
            ('ALIGN', (1, 1), (1, -1), 'LEFT'),    # Item name
            ('ALIGN', (2, 1), (-1, -1), 'RIGHT'),  # Numbers
            
            # Alternating row colors
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, lightgrey]),
            
            # Borders
            ('GRID', (0, 0), (-1, -1), 1, black),
            ('LINEBELOW', (0, 0), (-1, 0), 2, black),
        ]))
        
        elements.append(table)
        elements.append(Spacer(1, 0.5 * cm))
        
        return elements
    
    def _build_summary(self, invoice_data: InvoiceRequest, styles: Dict) -> list:
        """Build summary section"""
        elements = []
        
        bill = invoice_data.bill
        
        # Create summary table
        summary_data = [
            ['Subtotal:', f"Rs.{bill.subtotal:.2f}"],
            ['GST Amount:', f"Rs.{bill.gst_amount:.2f}"],
            ['Discount:', f"Rs.{bill.discount_amount:.2f}"],
            ['<b>Total Amount:</b>', f"<b>Rs.{bill.total_amount:.2f}</b>"],
        ]
        
        summary_table = Table(summary_data, colWidths=[8*cm, 3*cm])
        summary_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, -1), 'RIGHT'),
            ('FONTNAME', (0, 3), (1, 3), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 3), (1, 3), 12),
            ('LINEBELOW', (0, 2), (1, 2), 1, black),
        ]))
        
        elements.append(summary_table)
        
        # Payment status badge
        status_color = darkblue if bill.payment_status == 'PAID' else grey
        status_text = f"""
        <font color="{status_color}" size="12">
        <b>Payment Status: {bill.payment_status.upper()}</b>
        </font>
        """
        elements.append(Paragraph(status_text, styles['Normal']))
        
        elements.append(Spacer(1, 1 * cm))
        return elements
    
    def _build_footer(self, invoice_data: InvoiceRequest, styles: Dict) -> list:
        """Build footer section"""
        elements = []
        
        # Generate QR code for UPI
        qr_code = self._generate_qr_code(invoice_data)
        if qr_code:
            elements.append(qr_code)
        
        # Footer text
        footer_text = """
        <center>
        <i>Thank you for your business!</i><br/>
        <i>Powered by BillEasy</i>
        </center>
        """
        elements.append(Paragraph(footer_text, styles['Normal']))
        
        return elements
    
    def _generate_qr_code(self, invoice_data: InvoiceRequest):
        """Generate QR code for UPI payment"""
        try:
            # Create a simple QR code with invoice info
            qr = qrcode.QRCode(version=1, box_size=10, border=2)
            qr_data = f"bill:{invoice_data.bill.invoice_number}|amount:{invoice_data.bill.total_amount}"
            qr.add_data(qr_data)
            qr.make(fit=True)
            
            # Convert to image (this would need PIL/Pillow integration)
            # For now, return a placeholder
            from reportlab.platypus import Paragraph
            return Paragraph("<center><i>UPI QR Code</i></center>", getSampleStyleSheet()['Normal'])
        except Exception:
            return None
