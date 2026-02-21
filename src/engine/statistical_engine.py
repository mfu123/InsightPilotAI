"""Statistical Engine - Summary statistics, trend analysis, outlier detection."""
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from scipy import stats


class StatisticalEngine:
    """Summary statistics, trend analysis, outlier detection."""

    def summary_stats(self, df: pd.DataFrame) -> dict:
        """Calculate summary statistics for numeric columns."""
        return df.describe().to_dict()

    def correlation(self, df: pd.DataFrame) -> pd.DataFrame:
        """Calculate correlation matrix for numeric columns."""
        num = df.select_dtypes(include=np.number)
        return num.corr() if num.shape[1] > 0 else pd.DataFrame()

    def trend_analysis(self, df: pd.DataFrame, metadata: dict) -> dict:
        """Detect time-like column and linear trend on first numeric series."""
        trends = {}
        num_cols = metadata.get("numeric_cols", [])
        if not num_cols:
            return trends
        # Try to find a time/date column
        for c in df.columns:
            if any(k in c.lower() for k in ["date", "time", "year", "month"]):
                try:
                    s = pd.to_numeric(df[c].dropna(), errors="coerce")
                    if s.notna().sum() > 2:
                        slope, intercept, r, p, se = stats.linregress(np.arange(len(s)), s)
                        trends["time_column"] = c
                        trends["slope"] = round(float(slope), 4)
                        trends["r_squared"] = round(r ** 2, 4)
                        break
                except Exception:
                    pass
        # Trend on first numeric column if no time col
        if not trends and len(num_cols) >= 1:
            s = df[num_cols[0]].dropna().reset_index(drop=True)
            if len(s) > 2:
                slope, _, r, _, _ = stats.linregress(np.arange(len(s)), s)
                trends["series"] = num_cols[0]
                trends["slope"] = round(float(slope), 4)
                trends["r_squared"] = round(r ** 2, 4)
        return trends

    def detect_outliers(self, df: pd.DataFrame) -> dict:
        """Detect outliers using Isolation Forest."""
        num = df.select_dtypes(include=np.number)
        if num.shape[1] == 0:
            return {"outliers_detected": 0}
        model = IsolationForest(contamination=0.05, random_state=42)
        preds = model.fit_predict(num.fillna(num.median()))
        return {"outliers_detected": int((preds == -1).sum())}
