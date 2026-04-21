# PDF Router - PDF generation endpoints
from fastapi import APIRouter, HTTPException, Response
from app.services.pdf_service import PDFService
from app.models.schemas import InvoiceRequest, InvoiceResponse
import base64
import io

router = APIRouter()
pdf_service = PDFService()

@router.post("/invoice", response_model=InvoiceResponse)
async def generate_invoice_pdf(request: InvoiceRequest):
    """Generate PDF invoice from bill data"""
    try:
        # Generate PDF bytes
        pdf_bytes = await pdf_service.generate_invoice_pdf(request)
        
        # Convert to base64 for response
        pdf_base64 = base64.b64encode(pdf_bytes).decode('utf-8')
        
        # Generate a mock URL (in production, would upload to cloud storage)
        invoice_number = request.bill.invoice_number
        pdf_url = f"https://billeasy.invoices/{invoice_number}.pdf"
        
        return InvoiceResponse(
            pdf_url=pdf_url,
            pdf_base64=pdf_base64,
            invoice_number=invoice_number,
            success=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

@router.post("/invoice/download")
async def download_invoice_pdf(request: InvoiceRequest):
    """Download PDF invoice as file"""
    try:
        # Generate PDF bytes
        pdf_bytes = await pdf_service.generate_invoice_pdf(request)
        
        # Return as downloadable file
        invoice_number = request.bill.invoice_number
        filename = f"invoice_{invoice_number}.pdf"
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")
