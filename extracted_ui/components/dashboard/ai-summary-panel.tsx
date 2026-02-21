import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ClipboardList,
} from "lucide-react"

const sections = [
  {
    title: "Key Trends",
    icon: TrendingUp,
    items: [
      "Revenue shows consistent upward trend (+18% quarter-over-quarter), particularly strong in Q4.",
      "Monthly performance metrics indicate accelerating growth since April, correlating with Category A expansion.",
      "Cost-to-revenue ratio improving steadily from 0.67 to 0.53 over the analysis period.",
    ],
  },
  {
    title: "Risk Indicators",
    icon: AlertTriangle,
    items: [
      "342 missing values detected across 3 columns, concentrated in the 'region' and 'segment' fields.",
      "89 statistical outliers identified, primarily in transaction amounts exceeding 3 standard deviations.",
      "Negative correlation (-0.35) between cost and profit margins warrants further investigation.",
    ],
  },
  {
    title: "Opportunities",
    icon: Lightbulb,
    items: [
      "Category A dominates at 35% share with highest margins. Consider resource reallocation to maximize returns.",
      "Q4 performance spike suggests seasonal demand. Recommend pre-positioning inventory for next cycle.",
      "Volume-revenue correlation (0.45) indicates potential for scaling strategies in high-volume segments.",
    ],
  },
  {
    title: "Recommendations",
    icon: ClipboardList,
    items: [
      "Address missing data in region/segment fields to enable geographic performance analysis.",
      "Investigate outlier transactions to determine if they represent fraud, errors, or high-value opportunities.",
      "Implement monthly trend monitoring dashboard for real-time KPI tracking.",
    ],
  },
]

export function AiSummaryPanel() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          AI Summary & Business Insights
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Automatically generated analysis based on your dataset
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="mb-3 flex items-center gap-2">
              <section.icon className="size-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                {section.title}
              </h3>
            </div>
            <ul className="flex flex-col gap-2.5">
              {section.items.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground"
                >
                  <span className="mt-1.5 block size-1.5 shrink-0 rounded-full bg-primary/40" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
