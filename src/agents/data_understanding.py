"""Data Understanding Agent - Loads and cleans CSV data."""
import os
import numpy as np
import pandas as pd


class DataUnderstandingAgent:
    """Load CSV and return cleaned DataFrame with metadata."""

    def load_data(self, file_path: str):
        """Load CSV file and return cleaned DataFrame with cleaning info."""
        size_mb = os.path.getsize(file_path) / (1024 * 1024)
        print(f"Dataset Size: {size_mb:.2f} MB")
        df = pd.read_csv(file_path)
        df, clean_info = self.clean_data(df)
        return df, clean_info

    def clean_data(self, df: pd.DataFrame):
        """Data cleaning: drop empty rows/cols, fill missing, infer types, dedupe."""
        info = {"rows_before": len(df), "cols_before": len(df.columns)}
        # Drop fully empty rows/columns
        df = df.dropna(how="all").dropna(axis=1, how="all")
        # Fill numeric missing with median, categorical with mode
        for c in df.columns:
            if df[c].dtype in [np.number, "float64", "int64"]:
                df[c] = df[c].fillna(df[c].median())
            else:
                df[c] = df[c].fillna(df[c].mode().iloc[0] if len(df[c].mode()) else "")
        df = df.drop_duplicates()
        info["rows_after"], info["cols_after"] = len(df), len(df.columns)
        return df, info

    def analyze_structure(self, df: pd.DataFrame) -> dict:
        """Analyze dataset structure and return metadata."""
        numeric = df.select_dtypes(include=np.number).columns.tolist()
        categorical = df.select_dtypes(exclude=np.number).columns.tolist()
        return {
            "rows": df.shape[0],
            "columns": df.shape[1],
            "numeric_cols": numeric,
            "categorical_cols": categorical,
            "missing_values": df.isnull().sum().to_dict(),
        }
