"""Analysis Planner Agent - Decides which visualizations to generate."""


class AnalysisPlannerAgent:
    """Decides which visualizations to generate from metadata."""

    def plan(self, metadata: dict) -> list[str]:
        """Generate analysis plan based on dataset structure."""
        plan = []
        if metadata.get("numeric_cols"):
            plan.append("distribution")
        if len(metadata.get("numeric_cols", [])) > 1:
            plan.append("correlation")
        if metadata.get("categorical_cols"):
            plan.append("category_analysis")
        return plan
