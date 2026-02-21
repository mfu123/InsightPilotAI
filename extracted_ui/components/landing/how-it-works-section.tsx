import { Upload, Cpu, Search, Download } from "lucide-react"

const steps = [
  {
    step: 1,
    icon: Upload,
    title: "Upload Your CSV",
    description:
      "Drag and drop any CSV file or browse from your computer. No size limits, no formatting requirements.",
  },
  {
    step: 2,
    icon: Cpu,
    title: "AI Performs Auto-EDA",
    description:
      "Our AI engine cleans your data, detects patterns, identifies outliers, and generates visualizations automatically.",
  },
  {
    step: 3,
    icon: Search,
    title: "Explore Insights & Ask Questions",
    description:
      "Review the dashboard, read AI-generated summaries, and use the built-in chat agent to ask anything about your data.",
  },
  {
    step: 4,
    icon: Download,
    title: "Download Report",
    description:
      "Export a professional PDF report with charts, statistics, and business insights ready for stakeholders.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Four simple steps from raw data to executive-ready insights.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item) => (
            <div key={item.step} className="relative text-center">
              <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
                <item.icon className="size-6 text-primary" />
              </div>
              <div className="mb-3 inline-flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {item.step}
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
