"""Main entry point for AI Data Insights Analyst."""
import os
import sys
import time
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent))

from src.agents import DataUnderstandingAgent, AnalysisPlannerAgent, InsightGeneratorAgent
from src.engine import StatisticalEngine
from src.visualization import VisualizationAgent
from src.report import DashboardGenerator


def run_pipeline(file_path: str, openai_client=None) -> dict:
    """Run full pipeline: clean → stats → trends → outliers → plan → charts → insights → dashboard."""
    start = time.time()
    
    print("🚀 Starting AI Data Insights Analysis...")
    print("=" * 60)
    
    # Initialize agents
    print("\n📊 Initializing agents...")
    data_agent = DataUnderstandingAgent()
    stats_engine = StatisticalEngine()
    planner = AnalysisPlannerAgent()
    viz_agent = VisualizationAgent()
    insight_agent = InsightGeneratorAgent(client=openai_client)
    dashboard_generator = DashboardGenerator()
    
    # Step 1: Load and clean data
    print("\n📁 Step 1: Loading and cleaning data...")
    df, clean_info = data_agent.load_data(file_path)
    metadata = data_agent.analyze_structure(df)
    print(f"✓ Data loaded: {metadata['rows']} rows, {metadata['columns']} columns")
    
    # Step 2: Statistical analysis
    print("\n📈 Step 2: Performing statistical analysis...")
    stats = stats_engine.summary_stats(df)
    outliers = stats_engine.detect_outliers(df)
    trends = stats_engine.trend_analysis(df, metadata)
    print(f"✓ Statistics calculated")
    print(f"  - Outliers detected: {outliers.get('outliers_detected', 0)}")
    
    # Step 3: Plan visualizations
    print("\n🎨 Step 3: Planning visualizations...")
    plan = planner.plan(metadata)
    print(f"✓ Analysis plan: {', '.join(plan)}")
    
    # Step 4: Generate charts
    print("\n📊 Step 4: Generating interactive charts...")
    charts_data = viz_agent.generate(df, plan)
    print(f"✓ Charts generated")
    
    # Step 5: Generate insights
    print("\n💡 Step 5: Generating business insights...")
    insights = insight_agent.generate_insights(metadata, stats, outliers, trends)
    print("✓ Insights generated")
    
    # Step 6: Create dashboard
    print("\n📄 Step 6: Creating interactive dashboard...")
    elapsed = time.time() - start
    dashboard_path = dashboard_generator.create_dashboard(
        metadata, clean_info, insights, charts_data,
        stats, outliers, trends, elapsed
    )
    
    print("\n" + "=" * 60)
    print("✅ Analysis Complete!")
    print(f"📊 Dashboard: {dashboard_path}")
    print(f"⏱️  Time: {elapsed:.2f} seconds")
    print("=" * 60)
    
    return {
        "dashboard": dashboard_path,
        "charts": charts_data,
        "insights": insights,
        "time_seconds": round(elapsed, 2),
        "metadata": metadata
    }


def main():
    """Main entry point."""
    print("=" * 60)
    print("🤖 AI Data Insights Analyst — Analyst in a Box")
    print("   Use Case 5 — AI Hackathon Lucknow Feb 21' 2026")
    print("=" * 60)
    
    # Get file path
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
    else:
        file_path = input("\n📁 Enter path to CSV file: ").strip().strip('"')
    
    if not os.path.exists(file_path):
        print(f"❌ Error: File not found: {file_path}")
        sys.exit(1)
    
    if not file_path.lower().endswith('.csv'):
        print("⚠️  Warning: File doesn't have .csv extension")
        response = input("Continue anyway? (y/n): ").strip().lower()
        if response != 'y':
            sys.exit(1)
    
    try:
        result = run_pipeline(file_path)
        print(f"\n✨ Open the dashboard in your browser: {os.path.abspath(result['dashboard'])}")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
