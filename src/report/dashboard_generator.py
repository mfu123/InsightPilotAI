"""Dashboard Generator - Creates interactive HTML dashboard report."""
import os
import json
from datetime import datetime


class DashboardGenerator:
    """Build interactive HTML dashboard with insights and charts."""

    def __init__(self, output_dir: str = "output"):
        """Initialize with output directory."""
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def create_dashboard(
        self,
        metadata: dict,
        clean_info: dict,
        insights: str,
        charts_data: dict,
        stats: dict,
        outliers: dict,
        trends: dict,
        timing: float,
        sample_data: list = None
    ) -> str:
        """Create interactive HTML dashboard."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        path = os.path.join(self.output_dir, f"AI_EDA_Dashboard_{timestamp}.html")

        html_content = self._generate_html(
            metadata, clean_info, insights, charts_data,
            stats, outliers, trends, timing, path, sample_data
        )

        with open(path, 'w', encoding='utf-8') as f:
            f.write(html_content)

        print(f"Dashboard created: {path}")
        return path

    def _generate_html(
        self,
        metadata: dict,
        clean_info: dict,
        insights: str,
        charts_data: dict,
        stats: dict,
        outliers: dict,
        trends: dict,
        timing: float,
        dashboard_path: str = None,
        sample_data: list = None
    ) -> str:
        """Generate HTML content for dashboard."""
        
        # Format insights
        insights_html = self._format_insights(insights)
        
        # Generate statistics table
        stats_table = self._generate_stats_table(stats, metadata)
        
        # Generate data preview table
        data_preview_html = self._generate_data_preview(sample_data, metadata)
        
        # Generate charts HTML and JSON data
        charts_html, charts_json = self._generate_charts_html(charts_data)

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Data Insights Dashboard - Analyst in a Box</title>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
    <script>
        // Chart data
        var chartData = {charts_json};
        var dashboardFilename = '{os.path.basename(dashboard_path) if dashboard_path else "dashboard.html"}';
        
        // Export to PDF function
        function exportToPDF() {{
            window.location.href = '/api/export-pdf/' + dashboardFilename;
        }}
        
        // Download Excel function
        function downloadExcel() {{
            var timestamp = dashboardFilename.replace('AI_EDA_Dashboard_', '').replace('.html', '');
            var excelFilename = timestamp + '_data.xlsx';
            window.location.href = '/api/download-excel/' + excelFilename;
        }}
        
        // Render all charts when page loads
        window.addEventListener('DOMContentLoaded', function() {{
            for (var chartId in chartData) {{
                if (chartData.hasOwnProperty(chartId)) {{
                    var div = document.getElementById(chartId);
                    if (div) {{
                        try {{
                            // chartData[chartId] is already a JSON object
                            var chartJson = chartData[chartId];
                            var config = {{
                                responsive: true,
                                displayModeBar: true,
                                displaylogo: false,
                                modeBarButtonsToRemove: ['pan2d', 'lasso2d'],
                                toImageButtonOptions: {{
                                    format: 'png',
                                    filename: chartJson.layout.title.text || 'chart',
                                    height: chartJson.layout.height || 450,
                                    width: chartJson.layout.width || 800,
                                    scale: 2
                                }}
                            }};
                            Plotly.newPlot(chartId, chartJson.data, chartJson.layout, config);
                        }} catch (e) {{
                            console.error('Error rendering chart ' + chartId + ':', e);
                        }}
                    }}
                }}
            }}
        }});
    </script>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
            background: #f5f7fa;
            color: #2d3748;
            line-height: 1.6;
            padding: 0;
            margin: 0;
        }}
        
        .container {{
            max-width: 1800px;
            margin: 0 auto;
            background: #ffffff;
            min-height: 100vh;
        }}
        
        .header {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 24px 40px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }}
        
        .header-top {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }}
        
        .header h1 {{
            font-size: 24px;
            margin: 0;
            font-weight: 700;
            letter-spacing: -0.5px;
        }}
        
        .header p {{
            font-size: 14px;
            opacity: 0.95;
            font-weight: 400;
            margin: 0;
        }}
        
        .header-actions {{
            display: flex;
            gap: 12px;
        }}
        
        .header-btn {{
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }}
        
        .header-btn:hover {{
            background: rgba(255,255,255,0.3);
        }}
        
        .content {{
            padding: 32px 40px;
            background: #f5f7fa;
        }}
        
        .section {{
            margin-bottom: 32px;
            background: #ffffff;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }}
        
        .section-title {{
            font-size: 18px;
            color: #2d3748;
            margin-bottom: 20px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 8px;
        }}
        
        .section-title-icon {{
            font-size: 20px;
        }}
        
        .kpi-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }}
        
        .kpi-card {{
            background: linear-gradient(135deg, var(--card-bg-start), var(--card-bg-end));
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }}
        
        .kpi-card::before {{
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            height: 100px;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            transform: translate(30px, -30px);
        }}
        
        .kpi-card:hover {{
            transform: translateY(-4px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }}
        
        .kpi-card.purple {{
            --card-bg-start: #9333ea;
            --card-bg-end: #7c3aed;
        }}
        
        .kpi-card.blue {{
            --card-bg-start: #3b82f6;
            --card-bg-end: #2563eb;
        }}
        
        .kpi-card.light-blue {{
            --card-bg-start: #0ea5e9;
            --card-bg-end: #0284c7;
        }}
        
        .kpi-card.green {{
            --card-bg-start: #10b981;
            --card-bg-end: #059669;
        }}
        
        .kpi-card.pink {{
            --card-bg-start: #ec4899;
            --card-bg-end: #db2777;
        }}
        
        .kpi-card.orange {{
            --card-bg-start: #f97316;
            --card-bg-end: #ea580c;
        }}
        
        .kpi-card h3 {{
            color: rgba(255,255,255,0.9);
            margin-bottom: 8px;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        
        .kpi-card .kpi-value {{
            font-size: 32px;
            font-weight: 700;
            color: #ffffff;
            margin: 0;
            line-height: 1.2;
        }}
        
        .info-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }}
        
        .info-card {{
            background: #f8fafc;
            padding: 20px 24px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            transition: all 0.2s ease;
        }}
        
        .info-card:hover {{
            border-color: #cbd5e0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }}
        
        .info-card h3 {{
            color: #64748b;
            margin-bottom: 8px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        
        .info-card p {{
            font-size: 24px;
            font-weight: 700;
            color: #1e293b;
            margin: 0;
            line-height: 1.2;
        }}
        
        .insights-box {{
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border-left: 4px solid #f59e0b;
            color: #78350f;
            padding: 24px;
            border-radius: 8px;
            margin-top: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }}
        
        .insights-box h3 {{
            margin-bottom: 16px;
            font-size: 16px;
            font-weight: 700;
            color: #78350f;
        }}
        
        .insights-box ul {{
            list-style: none;
            padding-left: 0;
            margin: 0;
        }}
        
        .insights-box li {{
            margin: 12px 0;
            padding-left: 28px;
            position: relative;
            line-height: 1.6;
            font-size: 14px;
            color: #92400e;
        }}
        
        .insights-box li:before {{
            content: "●";
            position: absolute;
            left: 8px;
            color: #f59e0b;
            font-weight: bold;
            font-size: 14px;
        }}
        
        .charts-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }}
        
        .chart-container {{
            background: #ffffff;
            padding: 24px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }}
        
        .chart-container:hover {{
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border-color: #cbd5e0;
            transform: translateY(-2px);
        }}
        
        .chart-container h3 {{
            color: #1e293b;
            margin-bottom: 20px;
            font-size: 16px;
            font-weight: 700;
            padding-bottom: 12px;
            border-bottom: 2px solid #e2e8f0;
        }}
        
        .chart-container.full-width {{
            grid-column: 1 / -1;
        }}
        
        .stats-table {{
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: #ffffff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }}
        
        .stats-table th {{
            background: #f8fafc;
            color: #475569;
            padding: 12px 16px;
            text-align: left;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #e2e8f0;
        }}
        
        .stats-table td {{
            padding: 12px 16px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
            color: #1e293b;
        }}
        
        .stats-table tr:hover {{
            background: #f8fafc;
        }}
        
        .stats-table tr:last-child td {{
            border-bottom: none;
        }}
        
        .data-preview-table {{
            width: 100%;
            border-collapse: collapse;
            background: #ffffff;
        }}
        
        .data-preview-table th {{
            background: #f8fafc;
            color: #475569;
            padding: 12px 16px;
            text-align: left;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 2px solid #e2e8f0;
            position: sticky;
            top: 0;
            z-index: 10;
        }}
        
        .data-preview-table td {{
            padding: 10px 16px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 13px;
            color: #1e293b;
        }}
        
        .data-preview-table tr:hover {{
            background: #f8fafc;
        }}
        
        .footer {{
            background: #ffffff;
            color: #64748b;
            padding: 20px 40px;
            text-align: center;
            font-size: 12px;
            border-top: 1px solid #e2e8f0;
        }}
        
        .badge {{
            display: inline-block;
            padding: 4px 12px;
            background: #2d5016;
            color: #a8d5a8;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin: 5px;
        }}
        
        .badge-warning {{
            background: #5c3d1a;
            color: #ffb366;
        }}
        
        .badge-danger {{
            background: #5c1a1a;
            color: #ff6666;
        }}
        
        @media (max-width: 768px) {{
            .charts-grid {{
                grid-template-columns: 1fr;
            }}
            
            .content {{
                padding: 20px;
            }}
            
            .header {{
                padding: 20px;
            }}
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="header-top">
                <div>
                    <h1>📊 InsightPilot AI Dashboard</h1>
                    <p>Automated EDA + Insights Report Generator</p>
                </div>
                <div class="header-actions">
                    <button class="header-btn" onclick="exportToPDF()">Export Report</button>
                </div>
            </div>
        </div>
        
        <div class="content">
            <!-- KPI Overview Section -->
            <div class="section">
                <h2 class="section-title">
                    <span class="section-title-icon">📈</span>
                    Dataset Overview for Analysis
                </h2>
                <div class="kpi-grid">
                    <div class="kpi-card purple">
                        <h3>Total Rows</h3>
                        <p class="kpi-value">{metadata.get('rows', 0):,}</p>
                    </div>
                    <div class="kpi-card blue">
                        <h3>Total Columns</h3>
                        <p class="kpi-value">{metadata.get('columns', 0)}</p>
                    </div>
                    <div class="kpi-card light-blue">
                        <h3>Numeric Columns</h3>
                        <p class="kpi-value">{len(metadata.get('numeric_cols', []))}</p>
                    </div>
                    <div class="kpi-card green">
                        <h3>Categorical Columns</h3>
                        <p class="kpi-value">{len(metadata.get('categorical_cols', []))}</p>
                    </div>
                    <div class="kpi-card pink">
                        <h3>Outliers Detected</h3>
                        <p class="kpi-value">{outliers.get('outliers_detected', 0):,}</p>
                    </div>
                    <div class="kpi-card orange">
                        <h3>Processing Time</h3>
                        <p class="kpi-value">{timing:.1f}s</p>
                    </div>
                </div>
            </div>
            
            <!-- Data Quality Section -->
            <div class="section">
                <h2 class="section-title">
                    <span class="section-title-icon">🧹</span>
                    Data Cleaning Summary
                </h2>
                <div class="info-grid">
                    <div class="info-card">
                        <h3>Before Cleaning</h3>
                        <p>{clean_info.get('rows_before', 0):,} rows, {clean_info.get('cols_before', 0)} cols</p>
                    </div>
                    <div class="info-card">
                        <h3>After Cleaning</h3>
                        <p>{clean_info.get('rows_after', 0):,} rows, {clean_info.get('cols_after', 0)} cols</p>
                    </div>
                    <div class="info-card">
                        <h3>Rows Removed</h3>
                        <p>{clean_info.get('rows_before', 0) - clean_info.get('rows_after', 0):,}</p>
                    </div>
                </div>
            </div>
            
            <!-- Business Insights Section -->
            <div class="section">
                <h2 class="section-title">
                    <span class="section-title-icon">💡</span>
                    Business Insights & Recommendations
                </h2>
                <div class="insights-box">
                    {insights_html}
                </div>
            </div>
            
            <!-- Data Preview Section -->
            <div class="section">
                <h2 class="section-title">
                    <span class="section-title-icon">📋</span>
                    Data Preview
                </h2>
                <div style="margin-bottom: 16px;">
                    <p style="color: #64748b; font-size: 14px; margin-bottom: 12px;">
                        Showing first 100 rows of the dataset. Download full data as Excel file.
                    </p>
                    <button class="header-btn" onclick="downloadExcel()" style="background: #10b981; border: none; color: white; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">
                        📥 Download Full Data (Excel)
                    </button>
                </div>
                {data_preview_html}
            </div>
            
            <!-- Key Statistics Section -->
            <div class="section">
                <h2 class="section-title">
                    <span class="section-title-icon">📊</span>
                    Statistical Summary
                </h2>
                {stats_table}
            </div>
            
            <!-- Charts Section -->
            <div class="section">
                <h2 class="section-title">
                    <span class="section-title-icon">📈</span>
                    Data Visualizations
                </h2>
                <div class="charts-grid">
                    {charts_html}
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p>Report generated in <strong>{timing:.1f} seconds</strong> • {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</p>
            <p style="margin-top: 10px; opacity: 0.8;">AI Data Insights Analyst — Analyst in a Box</p>
        </div>
    </div>
</body>
</html>"""
        return html

    def _format_insights(self, insights: str) -> str:
        """Format insights text into HTML."""
        if not insights:
            return "<p>No insights available.</p>"
        
        # Split by lines and format as list items
        lines = insights.strip().split('\n')
        html_lines = []
        current_list = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Check if it's a bullet point or numbered item
            if line.startswith('-') or line.startswith('•') or line.startswith('*'):
                current_list.append(f"<li>{line.lstrip('-•*').strip()}</li>")
            elif line and line[0].isdigit() and '.' in line[:3]:
                current_list.append(f"<li>{line.split('.', 1)[1].strip() if '.' in line else line}</li>")
            else:
                if current_list:
                    html_lines.append(f"<ul>{''.join(current_list)}</ul>")
                    current_list = []
                if line:
                    html_lines.append(f"<p>{line}</p>")
        
        if current_list:
            html_lines.append(f"<ul>{''.join(current_list)}</ul>")
        
        return '\n'.join(html_lines) if html_lines else f"<p>{insights}</p>"

    def _format_trends_card(self, trends: dict) -> str:
        """Format trends information card."""
        if not trends:
            return ""
        
        trend_text = ""
        if "time_column" in trends:
            trend_text = f"Time Series: {trends['time_column']}<br>Slope: {trends.get('slope', 0):.4f}<br>R²: {trends.get('r_squared', 0):.4f}"
        elif "series" in trends:
            trend_text = f"Series: {trends['series']}<br>Slope: {trends.get('slope', 0):.4f}<br>R²: {trends.get('r_squared', 0):.4f}"
        
        if trend_text:
            return f"""<div class="info-card">
                        <h3>Trend Analysis</h3>
                        <p style="font-size: 1em; font-weight: normal;">{trend_text}</p>
                    </div>"""
        return ""

    def _generate_stats_table(self, stats: dict, metadata: dict) -> str:
        """Generate statistics table HTML."""
        if not stats:
            return ""
        
        numeric_cols = metadata.get('numeric_cols', [])[:10]  # Limit to 10 columns
        
        if not numeric_cols:
            return ""
        
        # Get common statistics
        stat_types = ['count', 'mean', 'std', 'min', '25%', '50%', '75%', 'max']
        available_stats = [s for s in stat_types if s in stats]
        
        if not available_stats:
            return ""
        
        rows = []
        for col in numeric_cols:
            row_data = [col]
            for stat in available_stats:
                value = stats.get(stat, {}).get(col, 'N/A')
                if isinstance(value, (int, float)):
                    row_data.append(f"{value:.2f}")
                else:
                    row_data.append(str(value))
            rows.append(row_data)
        
        header_row = "<tr><th>Column</th>" + "".join(f"<th>{stat}</th>" for stat in available_stats) + "</tr>"
        data_rows = "".join(f"<tr>{''.join(f'<td>{cell}</td>' for cell in row)}</tr>" for row in rows)
        
        return f"""
        <table class="stats-table">
            <thead>
                {header_row}
            </thead>
            <tbody>
                {data_rows}
            </tbody>
        </table>
        """

    def _generate_data_preview(self, sample_data: list, metadata: dict) -> str:
        """Generate data preview table HTML."""
        if not sample_data:
            return "<p style='color: #64748b;'>No data available for preview.</p>"
        
        # Get column names from first row or metadata
        if sample_data:
            columns = list(sample_data[0].keys())
        else:
            columns = metadata.get('numeric_cols', []) + metadata.get('categorical_cols', [])
        
        # Limit columns for display (max 10)
        display_columns = columns[:10]
        
        # Generate header
        header_row = "<tr>" + "".join(f"<th>{col}</th>" for col in display_columns) + "</tr>"
        
        # Generate data rows (limit to 100 rows)
        data_rows = []
        for row in sample_data[:100]:
            row_html = "<tr>"
            for col in display_columns:
                value = row.get(col, '')
                # Format the value
                if isinstance(value, (int, float)):
                    if isinstance(value, float):
                        cell_value = f"{value:.2f}" if abs(value) < 1000000 else f"{value:.2e}"
                    else:
                        cell_value = str(value)
                else:
                    cell_value = str(value)[:50]  # Truncate long strings
                row_html += f"<td>{cell_value}</td>"
            row_html += "</tr>"
            data_rows.append(row_html)
        
        return f"""
        <div style="overflow-x: auto; max-height: 600px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
            <table class="data-preview-table" style="width: 100%; border-collapse: collapse;">
                <thead style="position: sticky; top: 0; background: #f8fafc; z-index: 10;">
                    {header_row}
                </thead>
                <tbody>
                    {''.join(data_rows)}
                </tbody>
            </table>
        </div>
        """

    def _generate_charts_html(self, charts_data: dict) -> tuple:
        """Generate HTML for all charts and JSON data for rendering."""
        charts_html = []
        charts_json = {}
        
        # Distribution charts
        if charts_data.get("distributions"):
            for chart in charts_data["distributions"]:
                div_id = chart.get('div_id', f"chart_{len(charts_json)}")
                charts_json[div_id] = chart['json']
                charts_html.append(f"""
                <div class="chart-container">
                    <h3>{chart['title']}</h3>
                    <div id="{div_id}" style="width: 100%; height: 450px;"></div>
                </div>
                """)
        
        # Correlation chart (full width)
        if charts_data.get("correlation"):
            chart = charts_data["correlation"]
            div_id = chart.get('div_id', 'chart_correlation')
            charts_json[div_id] = chart['json']
            charts_html.append(f"""
            <div class="chart-container full-width">
                <h3>{chart['title']}</h3>
                <div id="{div_id}" style="width: 100%; height: 650px;"></div>
            </div>
            """)
        
        # Category analysis charts
        if charts_data.get("category_analysis"):
            for chart in charts_data["category_analysis"]:
                div_id = chart.get('div_id', f"chart_{len(charts_json)}")
                charts_json[div_id] = chart['json']
                charts_html.append(f"""
                <div class="chart-container">
                    <h3>{chart['title']}</h3>
                    <div id="{div_id}" style="width: 100%; height: 450px;"></div>
                </div>
                """)
        
        charts_html_str = "\n".join(charts_html) if charts_html else "<p>No charts available.</p>"
        
        # Build JavaScript object string directly (chart['json'] is already a JSON string)
        # Format: {"div_id1": <json_string>, "div_id2": <json_string>}
        js_entries = []
        for div_id, json_str in charts_json.items():
            # Escape the JSON string for JavaScript and parse it
            js_entries.append(f'"{div_id}": {json_str}')
        
        charts_json_str = "{" + ", ".join(js_entries) + "}"
        
        return charts_html_str, charts_json_str
