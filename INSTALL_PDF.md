# PDF Generation Setup

## Windows Installation

WeasyPrint doesn't work well on Windows, so we use Playwright or xhtml2pdf instead.

### Option 1: Playwright (Recommended - Best Quality)

1. Install Playwright:
   ```bash
   pip install playwright
   ```

2. Install Chromium browser:
   ```bash
   playwright install chromium
   ```

### Option 2: xhtml2pdf (Fallback - Pure Python)

If Playwright doesn't work, install xhtml2pdf:
```bash
pip install xhtml2pdf
```

Note: xhtml2pdf has limited CSS support but works on all platforms without additional dependencies.

## After Installation

The PDF generator will automatically use whichever library is available:
- Playwright (if installed) - Best quality, handles complex CSS
- xhtml2pdf (if Playwright not available) - Works everywhere, simpler CSS

## Testing

After installation, try exporting a PDF from the dashboard. If you get an error, check which library is installed and ensure Playwright browsers are installed if using Playwright.
