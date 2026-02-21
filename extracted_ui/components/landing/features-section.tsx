import {
  Sparkles,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  Brain,
  MessageSquare,
} from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Automated Data Cleaning",
    description:
      "Instantly detect and handle missing values, duplicates, and inconsistencies in your data.",
  },
  {
    icon: BarChart3,
    title: "Smart Visualizations",
    description:
      "Automatically generate the most appropriate charts and graphs based on your data types.",
  },
  {
    icon: AlertTriangle,
    title: "Outlier Detection",
    description:
      "Identify anomalies and outliers using statistical methods to uncover hidden data issues.",
  },
  {
    icon: TrendingUp,
    title: "Trend Analysis",
    description:
      "Discover patterns, seasonality, and trends across time-series and categorical data.",
  },
  {
    icon: Brain,
    title: "AI Business Insights",
    description:
      "Generate executive-ready summaries with key findings, risks, and actionable recommendations.",
  },
  {
    icon: MessageSquare,
    title: "Interactive AI Data Agent",
    description:
      "Ask natural language questions about your dataset and get precise, analytical responses.",
  },
]

export function FeaturesSection() {
  return (
    <section className="border-t border-border bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need for Data Analysis
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            From raw data to actionable insights, InsightPilot AI handles every
            step of the exploratory data analysis pipeline.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="size-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
