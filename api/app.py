"""Flask API for AI Data Insights Analyst."""
import os
import time
import json
import threading
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename
import sys
from pathlib import Path
import streamlit as st
from api.app import run_api

# Get project root directory
PROJECT_ROOT = Path(__file__).parent.parent

# Add src to path
sys.path.insert(0, str(PROJECT_ROOT))

# Import agents with error handling for Vercel
AGENTS_AVAILABLE = False
try:
    from src.agents import DataUnderstandingAgent, AnalysisPlannerAgent, InsightGeneratorAgent
    from src.engine import StatisticalEngine
    from src.visualization import VisualizationAgent
    from src.report import DashboardGenerator
    AGENTS_AVAILABLE = True
    print("✓ Successfully imported all agents")
except ImportError as e:
    import traceback
    print(f"✗ Failed to import agents: {e}")
    print(f"Traceback: {traceback.format_exc()}")
    # Create dummy classes to prevent crashes
    class DataUnderstandingAgent:
        def __init__(self, *args, **kwargs):
            raise Exception("DataUnderstandingAgent not available - import failed")
    class AnalysisPlannerAgent:
        def __init__(self, *args, **kwargs):
            raise Exception("AnalysisPlannerAgent not available - import failed")
    class InsightGeneratorAgent:
        def __init__(self, *args, **kwargs):
            raise Exception("InsightGeneratorAgent not available - import failed")
    class StatisticalEngine:
        def __init__(self, *args, **kwargs):
            raise Exception("StatisticalEngine not available - import failed")
    class VisualizationAgent:
        def __init__(self, *args, **kwargs):
            raise Exception("VisualizationAgent not available - import failed")
    class DashboardGenerator:
        def __init__(self, *args, **kwargs):
            raise Exception("DashboardGenerator not available - import failed")
except Exception as e:
    import traceback
    print(f"✗ Unexpected error importing agents: {e}")
    print(f"Traceback: {traceback.format_exc()}")
    # Create dummy classes
    class DataUnderstandingAgent:
        pass
    class AnalysisPlannerAgent:
        pass
    class InsightGeneratorAgent:
        pass
    class StatisticalEngine:
        pass
    class VisualizationAgent:
        pass
    class DashboardGenerator:
        pass

# Import PDF generator (optional - may fail if libraries not installed)
try:
    from src.report.pdf_generator import PDFGenerator
    PDF_AVAILABLE = True
except ImportError as e:
    PDF_AVAILABLE = False
    print(f"Warning: PDF generation not available: {e}")
    print("Install with: pip install playwright xhtml2pdf && playwright install chromium")

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Add error handler for unhandled exceptions
@app.errorhandler(Exception)
def handle_exception(e):
    """Handle all unhandled exceptions."""
    import traceback
    error_trace = traceback.format_exc()
    print(f"Unhandled exception: {error_trace}")
    return jsonify({
        'error': str(e),
        'type': type(e).__name__
    }), 500

# Configuration - use absolute paths from project root
# For Vercel serverless, use /tmp for temporary files
if os.environ.get('VERCEL'):
    UPLOAD_FOLDER = Path('/tmp/uploads')
    OUTPUT_FOLDER = Path('/tmp/output')
else:
    UPLOAD_FOLDER = PROJECT_ROOT / 'uploads'
    OUTPUT_FOLDER = PROJECT_ROOT / 'output'

ALLOWED_EXTENSIONS = {'csv'}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB

# Create directories if they don't exist
try:
    os.makedirs(str(UPLOAD_FOLDER), exist_ok=True)
    os.makedirs(str(OUTPUT_FOLDER), exist_ok=True)
except Exception as e:
    print(f"Warning: Could not create directories: {e}")

app.config['UPLOAD_FOLDER'] = str(UPLOAD_FOLDER)
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Progress tracking storage
progress_tracker = {}


def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/', methods=['GET'])
def root():
    """Root endpoint."""
    return jsonify({
        'message': 'InsightPilot AI API',
        'status': 'running',
        'endpoints': ['/api/health', '/api/upload', '/api/progress/<task_id>', '/api/chat']
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    try:
        return jsonify({
            'status': 'healthy', 
            'message': 'AI Analyst API is running',
            'agents_available': AGENTS_AVAILABLE,
            'pdf_available': PDF_AVAILABLE,
            'vercel': bool(os.environ.get('VERCEL'))
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


def update_progress(task_id, stage, progress_percent, message=''):
    """Update progress for a task."""
    progress_tracker[task_id] = {
        'stage': stage,
        'progress': progress_percent,
        'message': message,
        'status': 'processing'
    }


def process_file_async(filepath, task_id, timestamp):
    """Process file asynchronously with progress tracking."""
    try:
        if not AGENTS_AVAILABLE:
            raise Exception("Agents not available - import failed")
        
        start_time = time.time()
        
        # Initialize progress
        update_progress(task_id, -1, 5, 'Initializing...')
        
        # Initialize agents - pass absolute path for output
        data_agent = DataUnderstandingAgent()
        stats_engine = StatisticalEngine()
        planner = AnalysisPlannerAgent()
        viz_agent = VisualizationAgent()
        insight_agent = InsightGeneratorAgent()
        dashboard_generator = DashboardGenerator(output_dir=str(OUTPUT_FOLDER))
        
        # Stage 1: Cleaning Data (Loading and cleaning)
        update_progress(task_id, 0, 15, 'Cleaning Data')
        df, clean_info = data_agent.load_data(filepath)
        update_progress(task_id, 0, 20, 'Data cleaned')
        
        # Stage 2: Detecting Patterns (Structure analysis, stats, outliers, trends)
        update_progress(task_id, 1, 30, 'Detecting Patterns')
        metadata = data_agent.analyze_structure(df)
        update_progress(task_id, 1, 40, 'Analyzing structure')
        stats = stats_engine.summary_stats(df)
        update_progress(task_id, 1, 50, 'Calculating statistics')
        outliers = stats_engine.detect_outliers(df)
        update_progress(task_id, 1, 60, 'Detecting outliers')
        trends = stats_engine.trend_analysis(df, metadata)
        plan = planner.plan(metadata)
        update_progress(task_id, 1, 65, 'Patterns detected')
        
        # Stage 3: Generating Visualizations
        update_progress(task_id, 2, 70, 'Generating Visualizations')
        charts_data = viz_agent.generate(df, plan)
        update_progress(task_id, 2, 80, 'Visualizations created')
        
        # Stage 4: Writing Insights
        update_progress(task_id, 3, 85, 'Writing Insights')
        insights = insight_agent.generate_insights(metadata, stats, outliers, trends)
        update_progress(task_id, 3, 90, 'Insights generated')
        
        elapsed = time.time() - start_time
        
        # Prepare sample data for preview (first 100 rows)
        sample_data = df.head(100).to_dict('records')
        
        # Stage 5: Preparing Report
        update_progress(task_id, 4, 92, 'Preparing Report')
        dashboard_path = dashboard_generator.create_dashboard(
            metadata, clean_info, insights, charts_data,
            stats, outliers, trends, elapsed, sample_data
        )
        
        # Get dashboard filename
        dashboard_filename = os.path.basename(dashboard_path)
        
        # Extract timestamp from dashboard filename (format: AI_EDA_Dashboard_YYYYMMDD_HHMMSS.html)
        # Use the same timestamp format for Excel file
        import re
        match = re.search(r'(\d{8}_\d{6})', dashboard_filename)
        if match:
            excel_timestamp = match.group(1)
        else:
            # Fallback to current timestamp
            from datetime import datetime
            excel_timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Save Excel file for download
        excel_filename = f"{excel_timestamp}_data.xlsx"
        excel_path = os.path.join(str(OUTPUT_FOLDER), excel_filename)
        df.to_excel(excel_path, index=False, engine='openpyxl')
        
        # Store dataframe and metadata for chatbot
        # Store more data for chatbot - up to 5000 rows or all if less
        max_rows_for_chat = min(5000, len(df))
        df_json = df.head(max_rows_for_chat).to_json(orient='records')
        
        # Store full column list and data types
        column_info = {}
        for col in df.columns:
            column_info[col] = {
                'dtype': str(df[col].dtype),
                'sample_values': df[col].dropna().head(10).tolist() if len(df[col].dropna()) > 0 else []
            }
        
        metadata_for_chat = {
            'rows': metadata.get('rows'),
            'columns': metadata.get('columns'),
            'column_names': list(df.columns),
            'column_info': column_info,
            'numeric_cols': metadata.get('numeric_cols', []),
            'categorical_cols': metadata.get('categorical_cols', []),
            'data': json.loads(df_json),  # Full data (up to 5000 rows)
            'stats': stats,  # Full stats, not limited
            'outliers': outliers,
            'trends': trends
        }
        
        # Store data for chatbot (in-memory for now, could use Redis/DB in production)
        session_id = f"session_{timestamp}"
        if 'chatbot_sessions' not in app.config:
            app.config['chatbot_sessions'] = {}
        app.config['chatbot_sessions'][session_id] = {
            'metadata': metadata_for_chat,
            'dashboard_path': dashboard_path,
            'excel_path': excel_path
        }
        
        # Clean up uploaded file
        try:
            os.remove(filepath)
        except:
            pass
        
        # Mark as complete
        progress_tracker[task_id] = {
            'stage': 4,
            'progress': 100,
            'message': 'Complete',
            'status': 'complete',
            'result': {
                'success': True,
                'message': 'Analysis completed successfully',
                'dashboard': f'http://localhost:5000/api/download/{dashboard_filename}',
                'dashboard_filename': dashboard_filename,
                'excel_file': f'http://localhost:5000/api/download-excel/{excel_filename}',
                'excel_filename': excel_filename,
                'session_id': session_id,
                'metadata': {
                    'rows': metadata.get('rows'),
                    'columns': metadata.get('columns'),
                    'numeric_cols': len(metadata.get('numeric_cols', [])),
                    'categorical_cols': len(metadata.get('categorical_cols', [])),
                    'outliers': outliers.get('outliers_detected', 0),
                    'processing_time': round(elapsed, 2)
                }
            }
        }
    
    except Exception as e:
        # Mark as error
        progress_tracker[task_id] = {
            'stage': -1,
            'progress': 0,
            'message': f'Error: {str(e)}',
            'status': 'error',
            'error': str(e)
        }
        # Clean up on error
        try:
            if os.path.exists(filepath):
                os.remove(filepath)
        except:
            pass


@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle file upload and start processing in background."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Only CSV files are allowed.'}), 400
    
    try:
        # Save uploaded file
        filename = secure_filename(file.filename)
        timestamp = int(time.time())
        filename = f"{timestamp}_{filename}"
        filepath = os.path.join(str(UPLOAD_FOLDER), filename)
        file.save(filepath)
        
        # Create task ID
        task_id = f"task_{timestamp}"
        
        # Initialize progress
        update_progress(task_id, -1, 0, 'Starting...')
        
        # Start processing in background thread
        thread = threading.Thread(target=process_file_async, args=(filepath, task_id, timestamp))
        thread.daemon = True
        thread.start()
        
        return jsonify({
            'success': True,
            'task_id': task_id,
            'message': 'File uploaded, processing started'
        })
    
    except Exception as e:
        # Clean up on error
        try:
            if 'filepath' in locals():
                os.remove(filepath)
        except:
            pass
        
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500


@app.route('/api/progress/<task_id>', methods=['GET'])
def get_progress(task_id):
    """Get progress for a task."""
    if task_id not in progress_tracker:
        return jsonify({'error': 'Task not found'}), 404
    
    progress_data = progress_tracker[task_id]
    return jsonify(progress_data)


@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    """Download generated dashboard as HTML."""
    try:
        filepath = os.path.join(str(OUTPUT_FOLDER), secure_filename(filename))
        if os.path.exists(filepath):
            return send_file(filepath, as_attachment=False, mimetype='text/html')
        else:
            return jsonify({'error': f'File not found: {filepath}'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/export-pdf/<filename>', methods=['GET'])
def export_pdf(filename):
    """Export dashboard as PDF."""
    if not PDF_AVAILABLE:
        return jsonify({
            'error': 'PDF generation not available. Please install: pip install playwright xhtml2pdf && playwright install chromium'
        }), 503
    
    try:
        html_filename = secure_filename(filename)
        html_path = os.path.join(str(OUTPUT_FOLDER), html_filename)
        
        if not os.path.exists(html_path):
            return jsonify({'error': 'File not found'}), 404
        
        pdf_generator = PDFGenerator(output_dir=str(OUTPUT_FOLDER))
        pdf_filename = html_filename.replace('.html', '.pdf')
        pdf_path = pdf_generator.generate_pdf(html_path, pdf_filename)
        
        return send_file(pdf_path, as_attachment=True, mimetype='application/pdf')
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/download-excel/<filename>', methods=['GET'])
def download_excel(filename):
    """Download Excel file."""
    try:
        excel_filename = secure_filename(filename)
        excel_path = os.path.join(str(OUTPUT_FOLDER), excel_filename)
        
        if not os.path.exists(excel_path):
            return jsonify({'error': 'File not found'}), 404
        
        return send_file(excel_path, as_attachment=True, mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/chat', methods=['POST'])
def chat():
    """Chatbot endpoint for answering questions about the CSV data."""
    try:
        data = request.json
        question = data.get('question', '')
        session_id = data.get('session_id', '')
        
        if not question:
            return jsonify({'error': 'Question is required'}), 400
        
        if not session_id:
            return jsonify({'error': 'Session ID is required'}), 400
        
        # Get session data
        sessions = app.config.get('chatbot_sessions', {})
        session_data = sessions.get(session_id)
        
        if not session_data:
            return jsonify({'error': 'Session not found. Please upload a CSV file first.'}), 404
        
        metadata = session_data['metadata']
        
        # Generate answer using AI
        insight_agent = InsightGeneratorAgent()
        
        # Prepare actual data for the chatbot - include as many rows as possible
        all_data = metadata.get('data', [])
        total_rows = len(all_data)
        
        # Include all available data in the prompt (up to reasonable token limit)
        # For large datasets, include all rows we have stored
        data_json = json.dumps(all_data, indent=1, default=str)
        
        # Prepare column information
        column_details = ""
        if metadata.get('column_info'):
            for col, info in list(metadata.get('column_info', {}).items())[:30]:
                sample_vals = info.get('sample_values', [])[:5]
                column_details += f"\n- {col} ({info.get('dtype', 'unknown')}): Examples: {sample_vals}"
        
        # Truncate data if too large, but try to keep as much as possible
        max_data_length = 15000  # Characters
        if len(data_json) > max_data_length:
            # Try to include at least 200 rows
            truncated_data = all_data[:200]
            data_json = json.dumps(truncated_data, indent=1, default=str)
            data_note = f"\n\nNote: Showing first 200 rows out of {total_rows} total rows in dataset."
        else:
            data_note = f"\n\nNote: This dataset contains {total_rows} rows."
        
        prompt = f"""You are a data analyst. Answer the question using ONLY the actual data provided below. Give a DIRECT, CONCISE answer with NO extra explanations unless necessary.

DATASET INFO:
- Rows: {metadata.get('rows', 0):,} | Columns: {', '.join(metadata.get('column_names', [])[:20])}

DATA VALUES:
{data_json}{data_note}

QUESTION: {question}

INSTRUCTIONS:
1. Search the data above to find the answer
2. Give ONLY the direct answer - no explanations, no "I found", no extra text
3. If asking for a specific value/record, provide ONLY that value/record
4. If multiple records match, list them concisely
5. If not found in data, say "Not found in the dataset"
6. Be brief and precise

Answer:"""

        try:
            answer = insight_agent.client.chat.completions.create(
                model=insight_agent.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
            ).choices[0].message.content
        except Exception as e:
            answer = f"I apologize, but I'm having trouble processing your question right now. Error: {str(e)}"
        
        return jsonify({
            'answer': answer,
            'question': question
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("=" * 60)
    print("🚀 Starting AI Data Insights Analyst API")
    print("=" * 60)
    print(f"📁 Upload folder: {UPLOAD_FOLDER}")
    print(f"📊 Output folder: {OUTPUT_FOLDER}")
    print("=" * 60)
    import streamlit as st

    st.title("InsightPilotAI API")

    if st.button("Run API"):
        result = run_api()
        st.write(result)


