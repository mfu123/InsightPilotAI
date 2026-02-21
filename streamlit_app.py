"""Streamlit App for InsightPilot AI - Data Insights Analyst."""
import os
import time
import sys
from pathlib import Path
import streamlit as st
import pandas as pd

# Get project root directory
PROJECT_ROOT = Path(__file__).parent

# Add src to path
sys.path.insert(0, str(PROJECT_ROOT))

# Import agents
try:
    from src.agents import DataUnderstandingAgent, AnalysisPlannerAgent, InsightGeneratorAgent
    from src.engine import StatisticalEngine
    from src.visualization import VisualizationAgent
    from src.report import DashboardGenerator
    AGENTS_AVAILABLE = True
except ImportError as e:
    st.error(f"Failed to import required modules: {e}")
    st.stop()

# Page configuration
st.set_page_config(
    page_title="InsightPilot AI",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
    <style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        color: #1e3a8a;
        text-align: center;
        margin-bottom: 1rem;
    }
    .sub-header {
        font-size: 1.2rem;
        color: #6b7280;
        text-align: center;
        margin-bottom: 2rem;
    }
    </style>
""", unsafe_allow_html=True)

# Initialize session state
if 'processing' not in st.session_state:
    st.session_state.processing = False
if 'results' not in st.session_state:
    st.session_state.results = None
if 'uploaded_file' not in st.session_state:
    st.session_state.uploaded_file = None

# Header
st.markdown('<h1 class="main-header">📊 InsightPilot AI</h1>', unsafe_allow_html=True)
st.markdown('<p class="sub-header">AI-Powered Data Insights Analyst</p>', unsafe_allow_html=True)

# Sidebar
with st.sidebar:
    st.header("⚙️ Configuration")
    
    # API Key input
    api_key_source = st.radio(
        "OpenAI API Key Source",
        ["Environment Variable", "Manual Input"],
        help="Choose how to provide your OpenAI API key"
    )
    
    if api_key_source == "Manual Input":
        api_key = st.text_input("OpenAI API Key", type="password", help="Enter your OpenAI API key")
        if api_key:
            os.environ['OPENAI_API_KEY'] = api_key
    else:
        if not os.environ.get('OPENAI_API_KEY'):
            st.warning("⚠️ OPENAI_API_KEY not found in environment variables")
        else:
            st.success("✓ API Key loaded from environment")

# Main content
tab1, tab2, tab3 = st.tabs(["📤 Upload & Analyze", "📊 Results", "💬 Chat with Data"])

with tab1:
    st.header("Upload Your Dataset")
    st.markdown("Drop your CSV file below and let InsightPilot AI handle the rest.")
    
    uploaded_file = st.file_uploader(
        "Choose a CSV file",
        type=['csv'],
        help="Upload a CSV file to analyze"
    )
    
    if uploaded_file is not None:
        st.session_state.uploaded_file = uploaded_file
        
        # Show file info
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("File Name", uploaded_file.name)
        with col2:
            file_size = len(uploaded_file.getvalue()) / 1024
            st.metric("File Size", f"{file_size:.2f} KB")
        
        # Preview data
        if st.checkbox("Preview Data", value=True):
            try:
                df_preview = pd.read_csv(uploaded_file)
                st.dataframe(df_preview.head(10), use_container_width=True)
                st.info(f"Dataset has {len(df_preview)} rows and {len(df_preview.columns)} columns")
            except Exception as e:
                st.error(f"Error reading file: {e}")
        
        # Analyze button
        if st.button("🚀 Analyze Dataset", type="primary", use_container_width=True):
            if not AGENTS_AVAILABLE:
                st.error("Agents not available. Please check your installation.")
                st.stop()
            
            st.session_state.processing = True
            st.session_state.results = None
            
            # Create temporary file
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False, suffix='.csv') as tmp_file:
                tmp_file.write(uploaded_file.getvalue())
                tmp_file_path = tmp_file.name
            
            try:
                start_time = time.time()
                
                # Progress tracking
                progress_bar = st.progress(0)
                status_text = st.empty()
                
                # Initialize agents
                status_text.text("Initializing agents...")
                progress_bar.progress(5)
                
                data_agent = DataUnderstandingAgent()
                stats_engine = StatisticalEngine()
                planner = AnalysisPlannerAgent()
                viz_agent = VisualizationAgent()
                insight_agent = InsightGeneratorAgent()
                
                # Create output directory
                output_dir = PROJECT_ROOT / 'output'
                os.makedirs(output_dir, exist_ok=True)
                dashboard_generator = DashboardGenerator(output_dir=str(output_dir))
                
                # Stage 1: Cleaning Data
                status_text.text("🧹 Cleaning Data...")
                progress_bar.progress(15)
                df, clean_info = data_agent.load_data(tmp_file_path)
                progress_bar.progress(20)
                
                # Stage 2: Detecting Patterns
                status_text.text("🔍 Detecting Patterns...")
                progress_bar.progress(30)
                metadata = data_agent.analyze_structure(df)
                progress_bar.progress(40)
                stats = stats_engine.summary_stats(df)
                progress_bar.progress(50)
                outliers = stats_engine.detect_outliers(df)
                progress_bar.progress(60)
                trends = stats_engine.trend_analysis(df, metadata)
                plan = planner.plan(metadata)
                progress_bar.progress(65)
                
                # Stage 3: Generating Visualizations
                status_text.text("📈 Generating Visualizations...")
                progress_bar.progress(70)
                charts_data = viz_agent.generate(df, plan)
                progress_bar.progress(80)
                
                # Stage 4: Writing Insights
                status_text.text("✍️ Writing Insights...")
                progress_bar.progress(85)
                insights = insight_agent.generate_insights(metadata, stats, outliers, trends)
                progress_bar.progress(90)
                
                # Stage 5: Preparing Report
                status_text.text("📄 Preparing Report...")
                progress_bar.progress(92)
                elapsed = time.time() - start_time
                sample_data = df.head(100).to_dict('records')
                
                dashboard_path = dashboard_generator.create_dashboard(
                    metadata, clean_info, insights, charts_data,
                    stats, outliers, trends, elapsed, sample_data
                )
                
                progress_bar.progress(100)
                status_text.text("✅ Analysis Complete!")
                
                # Store results
                st.session_state.results = {
                    'metadata': metadata,
                    'stats': stats,
                    'outliers': outliers,
                    'trends': trends,
                    'insights': insights,
                    'charts_data': charts_data,
                    'dashboard_path': dashboard_path,
                    'clean_info': clean_info,
                    'dataframe': df
                }
                
                st.success("🎉 Analysis completed successfully!")
                st.balloons()
                
                # Clean up temp file
                try:
                    os.unlink(tmp_file_path)
                except:
                    pass
                    
            except Exception as e:
                st.error(f"❌ Error during analysis: {str(e)}")
                import traceback
                st.code(traceback.format_exc())
                st.session_state.processing = False
                
                # Clean up temp file
                try:
                    os.unlink(tmp_file_path)
                except:
                    pass

with tab2:
    st.header("Analysis Results")
    
    if st.session_state.results is None:
        st.info("👆 Please upload and analyze a dataset first in the 'Upload & Analyze' tab.")
    else:
        results = st.session_state.results
        
        # Metadata
        st.subheader("📋 Dataset Overview")
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("Rows", f"{results['metadata']['rows']:,}")
        with col2:
            st.metric("Columns", results['metadata']['columns'])
        with col3:
            st.metric("Numeric Columns", len(results['metadata'].get('numeric_cols', [])))
        with col4:
            st.metric("Categorical Columns", len(results['metadata'].get('categorical_cols', [])))
        
        # Insights
        st.subheader("💡 AI-Generated Insights")
        if results['insights']:
            for i, insight in enumerate(results['insights'], 1):
                st.markdown(f"**Insight {i}:** {insight}")
        else:
            st.info("No insights generated.")
        
        # Statistics
        st.subheader("📊 Summary Statistics")
        if results['stats']:
            stats_df = pd.DataFrame(results['stats']).T
            st.dataframe(stats_df, use_container_width=True)
        
        # Outliers
        st.subheader("⚠️ Outlier Detection")
        outliers_detected = results['outliers'].get('outliers_detected', 0)
        st.metric("Outliers Detected", outliers_detected)
        
        # Dashboard link
        if results.get('dashboard_path') and os.path.exists(results['dashboard_path']):
            st.subheader("📄 Interactive Dashboard")
            with open(results['dashboard_path'], 'r', encoding='utf-8') as f:
                dashboard_html = f.read()
            st.components.v1.html(dashboard_html, height=800, scrolling=True)
        
        # Download results
        st.subheader("💾 Download Results")
        if st.button("Download Dashboard HTML"):
            if results.get('dashboard_path') and os.path.exists(results['dashboard_path']):
                with open(results['dashboard_path'], 'rb') as f:
                    st.download_button(
                        label="📥 Download Dashboard",
                        data=f.read(),
                        file_name=os.path.basename(results['dashboard_path']),
                        mime="text/html"
                    )

with tab3:
    st.header("💬 Chat with Your Data")
    
    if st.session_state.results is None:
        st.info("👆 Please upload and analyze a dataset first in the 'Upload & Analyze' tab.")
    else:
        results = st.session_state.results
        df = results['dataframe']
        
        st.markdown("Ask questions about your dataset and get AI-powered answers!")
        
        # Chat interface
        if 'chat_history' not in st.session_state:
            st.session_state.chat_history = []
        
        # Display chat history
        for message in st.session_state.chat_history:
            with st.chat_message(message["role"]):
                st.write(message["content"])
        
        # Chat input
        question = st.chat_input("Ask a question about your data...")
        
        if question:
            # Add user message
            st.session_state.chat_history.append({"role": "user", "content": question})
            with st.chat_message("user"):
                st.write(question)
            
            # Generate answer
            with st.chat_message("assistant"):
                with st.spinner("Thinking..."):
                    try:
                        insight_agent = InsightGeneratorAgent()
                        
                        # Prepare data for chatbot
                        max_rows = min(5000, len(df))
                        df_json = df.head(max_rows).to_json(orient='records')
                        
                        # Prepare prompt
                        prompt = f"""You are a data analyst. Answer the question using ONLY the actual data provided below.

DATASET INFO:
- Rows: {len(df):,} | Columns: {', '.join(df.columns.tolist()[:20])}

DATA VALUES:
{df_json}

QUESTION: {question}

INSTRUCTIONS:
1. Search the data above to find the answer
2. Give ONLY the direct answer - no explanations, no "I found", no extra text
3. If asking for a specific value/record, provide ONLY that value/record
4. If multiple records match, list them concisely
5. If not found in data, say "Not found in the dataset"
6. Be brief and precise

Answer:"""
                        
                        answer = insight_agent.client.chat.completions.create(
                            model=insight_agent.model,
                            messages=[{"role": "user", "content": prompt}],
                            temperature=0.7,
                        ).choices[0].message.content
                        
                        st.write(answer)
                        st.session_state.chat_history.append({"role": "assistant", "content": answer})
                        
                    except Exception as e:
                        error_msg = f"I apologize, but I'm having trouble processing your question. Error: {str(e)}"
                        st.error(error_msg)
                        st.session_state.chat_history.append({"role": "assistant", "content": error_msg})
            
            # Clear chat button
            if st.button("🗑️ Clear Chat History"):
                st.session_state.chat_history = []
                st.rerun()

# Footer
st.markdown("---")
st.markdown(
    "<div style='text-align: center; color: #6b7280;'>Built with ❤️ for AI Hackathon Lucknow Feb 21' 2026</div>",
    unsafe_allow_html=True
)
