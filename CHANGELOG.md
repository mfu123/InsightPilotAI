# Changelog - InsightPilot AI Updates

## New Features Added

### 1. Chatbot Integration ✅
- Added interactive chatbot component that answers questions about uploaded CSV data
- Chatbot uses Azure OpenAI to provide intelligent responses
- Appears in left panel after CSV upload
- Stores session data for context-aware responses

### 2. PDF Export Functionality ✅
- Fixed download button to generate and download PDF reports
- Added `/api/export-pdf/<filename>` endpoint
- Uses WeasyPrint for HTML to PDF conversion
- Export button in dashboard header now downloads PDF

### 3. Header Updates ✅
- Removed "Dashboard", "History", "Account" navigation items
- Removed profile picture
- Added InsightPilot AI logo
- Changed project name to "InsightPilot AI"
- Clean, minimal header design

### 4. Dashboard Report Updates ✅
- Removed "Explore More" button
- "Export Report" button now downloads PDF
- Updated dashboard title to "InsightPilot AI Dashboard"

## Installation

1. **Install new dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **For WeasyPrint (PDF generation), you may need system dependencies:**
   - Windows: Usually works out of the box
   - Linux: `sudo apt-get install python3-cffi python3-brotli libpango-1.0-0 libpangoft2-1.0-0`
   - Mac: `brew install pango`

## Usage

1. Upload CSV file through React frontend
2. Wait for analysis to complete
3. Chatbot appears - ask questions about your data
4. Click "Download Report" to get PDF
5. Click "Export Report" in dashboard to download PDF

## API Endpoints

- `POST /api/upload` - Upload and process CSV
- `GET /api/download/<filename>` - View HTML dashboard
- `GET /api/export-pdf/<filename>` - Download PDF report
- `POST /api/chat` - Chatbot endpoint
