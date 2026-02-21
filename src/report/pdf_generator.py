"""PDF Generator - Converts HTML dashboard to PDF."""
import os
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright
    PLAYWRIGHT_AVAILABLE = True
except ImportError:
    PLAYWRIGHT_AVAILABLE = False
    try:
        from xhtml2pdf import pisa
        XHTML2PDF_AVAILABLE = True
    except ImportError:
        XHTML2PDF_AVAILABLE = False


class PDFGenerator:
    """Generate PDF from HTML dashboard."""
    
    def __init__(self, output_dir: str = "output"):
        """Initialize with output directory."""
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
    
    def generate_pdf(self, html_path: str, output_filename: str = None) -> str:
        """Generate PDF from HTML file."""
        if output_filename is None:
            output_filename = os.path.basename(html_path).replace('.html', '.pdf')
        
        pdf_path = os.path.join(self.output_dir, output_filename)
        
        try:
            # Read HTML content
            with open(html_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            # Try Playwright first (best quality, requires browser installation)
            if PLAYWRIGHT_AVAILABLE:
                return self._generate_with_playwright(html_path, pdf_path, html_content)
            # Fallback to xhtml2pdf (pure Python, works on Windows)
            elif XHTML2PDF_AVAILABLE:
                return self._generate_with_xhtml2pdf(html_content, pdf_path)
            else:
                raise Exception(
                    "No PDF library available. Please install one:\n"
                    "  pip install playwright && playwright install chromium\n"
                    "  OR\n"
                    "  pip install xhtml2pdf"
                )
        except Exception as e:
            raise Exception(f"PDF generation failed: {str(e)}")
    
    def _generate_with_playwright(self, html_path: str, pdf_path: str, html_content: str) -> str:
        """Generate PDF using Playwright (best quality)."""
        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            
            # Load HTML content
            page.set_content(html_content, wait_until='networkidle')
            
            # Generate PDF
            page.pdf(
                path=pdf_path,
                format='A4',
                landscape=True,
                margin={'top': '1cm', 'right': '1cm', 'bottom': '1cm', 'left': '1cm'},
                print_background=True
            )
            
            browser.close()
        
        return pdf_path
    
    def _generate_with_xhtml2pdf(self, html_content: str, pdf_path: str) -> str:
        """Generate PDF using xhtml2pdf (pure Python, works on Windows)."""
        from xhtml2pdf import pisa
        
        # Create PDF
        with open(pdf_path, 'wb') as pdf_file:
            pisa_status = pisa.CreatePDF(
                html_content,
                dest=pdf_file,
                encoding='utf-8'
            )
        
        if pisa_status.err:
            raise Exception(f"PDF generation error: {pisa_status.err}")
        
        return pdf_path
