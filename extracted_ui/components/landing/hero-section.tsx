"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Upload, Play, BarChart3, TrendingUp, PieChart } from "lucide-react"

function DashboardMockup() {
  return (
    <div className="relative w-full max-w-lg">
      <div className="rounded-xl border border-border bg-card p-4 shadow-lg">
        <div className="mb-4 flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-destructive/60" />
          <div className="size-2.5 rounded-full bg-chart-4" />
          <div className="size-2.5 rounded-full bg-green-400" />
          <span className="ml-2 text-xs text-muted-foreground">
            InsightPilot Dashboard
          </span>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-3">
          {[
            { label: "Rows", value: "12,847", icon: BarChart3 },
            { label: "Trends", value: "24", icon: TrendingUp },
            { label: "Insights", value: "8", icon: PieChart },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-lg border border-border bg-muted/50 p-3"
            >
              <kpi.icon className="mb-1 size-3.5 text-primary" />
              <div className="text-sm font-semibold text-foreground">
                {kpi.value}
              </div>
              <div className="text-xs text-muted-foreground">{kpi.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <div className="mb-2 text-xs text-muted-foreground">
              Revenue Trend
            </div>
            <div className="flex items-end gap-1">
              {[40, 55, 35, 65, 50, 72, 60, 80].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-primary/70"
                  style={{ height: `${h * 0.5}px` }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-muted/50 p-3">
            <div className="mb-2 text-xs text-muted-foreground">
              Distribution
            </div>
            <div className="flex items-center justify-center py-2">
              <svg
                viewBox="0 0 36 36"
                className="size-14"
                aria-hidden="true"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  className="stroke-primary/30"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  className="stroke-primary"
                  strokeWidth="3"
                  strokeDasharray="60 40"
                  strokeDashoffset="25"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  className="stroke-accent"
                  strokeWidth="3"
                  strokeDasharray="25 75"
                  strokeDashoffset="85"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 -z-10 size-full rounded-xl bg-primary/5" />
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 sm:px-6 lg:flex-row lg:gap-16 lg:px-8">
        <div className="flex-1 text-center lg:text-left">
          <div className="mb-6 inline-flex items-center rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
            <span className="mr-2 inline-block size-1.5 rounded-full bg-green-500" />
            AI-Powered Auto-EDA Platform
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Turn Raw CSV Files into Clear Business Insights{" "}
            <span className="text-primary">in Seconds</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground lg:text-xl">
            Upload any CSV and let InsightPilot AI automatically clean, analyze,
            visualize, and generate executive-ready reports — with an
            interactive AI assistant to explain everything.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Button asChild size="lg" className="gap-2 px-8">
              <Link href="/upload">
                <Upload className="size-4" />
                Upload CSV
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 px-8">
              <Link href="/dashboard">
                <Play className="size-4" />
                Try Demo
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}
