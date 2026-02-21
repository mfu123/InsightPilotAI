"""Visualization Agent - Generate chart data for interactive dashboard."""
import os
import numpy as np
import pandas as pd
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots


class VisualizationAgent:
    """Generate interactive chart data using Plotly."""

    def __init__(self, charts_dir: str = "charts"):
        """Initialize with charts directory."""
        self.charts_dir = charts_dir
        os.makedirs(charts_dir, exist_ok=True)

    def generate(self, df: pd.DataFrame, plan: list[str]) -> dict:
        """Generate chart data based on analysis plan."""
        charts_data = {
            "distributions": [],
            "correlation": None,
            "category_analysis": []
        }

        if "distribution" in plan:
            num_cols = df.select_dtypes(include=np.number).columns[:5]  # Limit to 5 for performance
            for col in num_cols:
                data = df[col].dropna()
                if len(data) > 0:
                    chart_data = self._create_distribution_chart(data, col)
                    charts_data["distributions"].append(chart_data)

        if "correlation" in plan:
            corr = df.corr(numeric_only=True)
            if corr.shape[0] > 0:
                charts_data["correlation"] = self._create_correlation_chart(corr)

        if "category_analysis" in plan:
            cat_cols = df.select_dtypes(exclude=np.number).columns
            for cat in cat_cols[:3]:  # Limit to 3 categorical columns
                chart_data = self._create_category_chart(df, cat)
                charts_data["category_analysis"].append(chart_data)

        return charts_data

    def _create_distribution_chart(self, data: pd.Series, col_name: str) -> dict:
        """Create histogram distribution chart."""
        # Convert data to list to ensure it's JSON serializable
        data_list = data.tolist() if hasattr(data, 'tolist') else list(data)
        
        fig = go.Figure()
        fig.add_trace(go.Histogram(
            x=data_list,
            nbinsx=min(50, max(20, int(len(data) ** 0.5))),
            name=col_name,
            marker_color='#3b82f6',
            marker_line_color='#2563eb',
            marker_line_width=1,
            opacity=0.85
        ))
        fig.update_layout(
            title=dict(
                text=f"Distribution of {col_name}",
                font=dict(size=16, color='#1e293b', family='Segoe UI')
            ),
            xaxis=dict(
                title=dict(text=col_name, font=dict(size=13, color='#475569')),
                showgrid=True,
                gridcolor='#e2e8f0',
                gridwidth=1,
                zeroline=False
            ),
            yaxis=dict(
                title=dict(text="Frequency", font=dict(size=13, color='#475569')),
                showgrid=True,
                gridcolor='#e2e8f0',
                gridwidth=1,
                zeroline=False
            ),
            template="plotly_white",
            height=450,
            showlegend=False,
            plot_bgcolor='#ffffff',
            paper_bgcolor='#ffffff',
            font=dict(family='Segoe UI', size=12, color='#1e293b'),
            margin=dict(l=60, r=20, t=50, b=60)
        )
        
        # Get unique div ID
        div_id = f"chart_dist_{col_name}".replace(" ", "_").replace("-", "_")
        
        return {
            "title": f"Distribution of {col_name}",
            "div_id": div_id,
            "json": fig.to_json()
        }

    def _create_correlation_chart(self, corr: pd.DataFrame) -> dict:
        """Create correlation heatmap."""
        # Convert to lists for JSON serialization
        z_values = corr.values.tolist()
        x_labels = corr.columns.tolist()
        y_labels = corr.columns.tolist()
        text_values = corr.values.round(2).tolist()
        
        fig = go.Figure(data=go.Heatmap(
            z=z_values,
            x=x_labels,
            y=y_labels,
            colorscale=[[0, '#ef4444'], [0.5, '#ffffff'], [1, '#3b82f6']],
            zmid=0,
            text=text_values,
            texttemplate='%{text}',
            textfont=dict(size=11, color='#1e293b', family='Segoe UI'),
            colorbar=dict(
                title=dict(text="Correlation", font=dict(size=12, color='#475569')),
                tickfont=dict(size=11, color='#475569')
            ),
            hoverongaps=False
        ))
        fig.update_layout(
            title=dict(
                text="Correlation Matrix",
                font=dict(size=16, color='#1e293b', family='Segoe UI')
            ),
            template="plotly_white",
            height=650,
            width=900,
            plot_bgcolor='#ffffff',
            paper_bgcolor='#ffffff',
            font=dict(family='Segoe UI', size=12, color='#1e293b'),
            xaxis=dict(
                showgrid=False,
                tickfont=dict(size=11, color='#475569')
            ),
            yaxis=dict(
                showgrid=False,
                tickfont=dict(size=11, color='#475569')
            ),
            margin=dict(l=100, r=20, t=50, b=100)
        )
        
        return {
            "title": "Correlation Matrix",
            "div_id": "chart_correlation",
            "json": fig.to_json()
        }

    def _create_category_chart(self, df: pd.DataFrame, cat_col: str) -> dict:
        """Create bar chart for categorical data."""
        counts = df[cat_col].value_counts().head(20)
        
        # Convert to lists for JSON serialization
        x_values = counts.index.tolist()
        y_values = counts.values.tolist()
        
        fig = go.Figure()
        fig.add_trace(go.Bar(
            x=x_values,
            y=y_values,
            marker_color='#10b981',
            marker_line_color='#059669',
            marker_line_width=1,
            opacity=0.85
        ))
        fig.update_layout(
            title=dict(
                text=f"Count of {cat_col}",
                font=dict(size=16, color='#1e293b', family='Segoe UI')
            ),
            xaxis=dict(
                title=dict(text=cat_col, font=dict(size=13, color='#475569')),
                tickangle=-45,
                showgrid=False,
                gridcolor='#e2e8f0',
                tickfont=dict(size=11, color='#475569')
            ),
            yaxis=dict(
                title=dict(text="Count", font=dict(size=13, color='#475569')),
                showgrid=True,
                gridcolor='#e2e8f0',
                gridwidth=1,
                zeroline=False,
                tickfont=dict(size=11, color='#475569')
            ),
            template="plotly_white",
            height=450,
            showlegend=False,
            plot_bgcolor='#ffffff',
            paper_bgcolor='#ffffff',
            font=dict(family='Segoe UI', size=12, color='#1e293b'),
            margin=dict(l=60, r=20, t=50, b=100)
        )
        
        div_id = f"chart_cat_{cat_col}".replace(" ", "_").replace("-", "_")
        
        return {
            "title": f"Count of {cat_col}",
            "div_id": div_id,
            "json": fig.to_json()
        }
