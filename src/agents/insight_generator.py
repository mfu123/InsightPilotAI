"""Insight Generator Agent - Generates business insights using LLM."""
import os
import json
from openai import AzureOpenAI, OpenAI
from dotenv import load_dotenv

load_dotenv()


def get_openai_client():
    """Get OpenAI or Azure OpenAI client from environment variables."""
    # Check for Azure OpenAI first
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    azure_api_key = os.getenv("AZURE_OPENAI_API_KEY")
    azure_deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
    azure_api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-12-01-preview")
    
    if azure_endpoint and azure_api_key and azure_deployment:
        # Use Azure OpenAI
        return AzureOpenAI(
            azure_endpoint=azure_endpoint.strip(),
            api_key=azure_api_key.strip(),
            api_version=azure_api_version.strip()
        ), azure_deployment.strip()
    
    # Fall back to standard OpenAI
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or not api_key.strip():
        raise ValueError(
            "Neither Azure OpenAI nor OpenAI API key found in environment. "
            "Please set AZURE_OPENAI_* variables or OPENAI_API_KEY in .env file."
        )
    return OpenAI(api_key=api_key.strip()), None


class InsightGeneratorAgent:
    """Generate business insights using LLM."""

    def __init__(self, client=None, model=None):
        """Initialize with optional OpenAI/Azure OpenAI client."""
        try:
            if client is None:
                client, deployment = get_openai_client()
                self.client = client
                # Use deployment name for Azure, or model name for OpenAI
                self.model = deployment or model or os.getenv("OPENAI_MODEL") or os.getenv("AZURE_OPENAI_DEPLOYMENT") or "gpt-4o-mini"
            else:
                self.client = client
                self.model = model or os.getenv("OPENAI_MODEL") or os.getenv("AZURE_OPENAI_DEPLOYMENT") or "gpt-4o-mini"
        except Exception as e:
            print(f"Warning: Could not initialize OpenAI/Azure OpenAI client: {e}")
            self.client = None
            self.model = None

    def generate_insights(self, metadata: dict, stats: dict, outliers: dict, trends: dict) -> str:
        """Generate business insights from analysis results."""
        prompt = f"""You are a senior business data analyst. Summarize in clear, actionable bullets.

Dataset: {metadata.get('rows')} rows, {metadata.get('columns')} columns.
Numeric: {metadata.get('numeric_cols', [])}.
Categorical: {metadata.get('categorical_cols', [])}.

Summary statistics (sample): {json.dumps({k: list(v.keys())[:3] for k, v in list(stats.items())[:2]}, default=str)}
Outliers: {outliers}
Trends: {trends}

Provide:
1. Key insights (2–3 bullets)
2. Trends (1–2 bullets)
3. Risks (1–2 bullets)
4. Business recommendations (2–3 bullets)
Keep total under 300 words."""

        if not self.client:
            return (
                f"[LLM unavailable: OpenAI/Azure OpenAI API key not configured]\n\n"
                f"Key stats: {metadata}. Outliers: {outliers}. Trends: {trends}."
            )

        try:
            r = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
            )
            return r.choices[0].message.content
        except Exception as e:
            return f"[LLM unavailable: {e}]\n\nKey stats: {metadata}. Outliers: {outliers}. Trends: {trends}."
