"use client"

import { useEffect, useState } from "react"
import { Rows3, AlertCircle, BarChart3, GitBranch, CircleDot } from "lucide-react"

const kpis = [
  {
    label: "Total Rows",
    value: 12847,
    icon: Rows3,
    format: (v: number) => v.toLocaleString(),
  },
  {
    label: "Missing Values",
    value: 342,
    icon: AlertCircle,
    format: (v: number) => v.toLocaleString(),
  },
  {
    label: "Mean",
    value: 48.72,
    icon: BarChart3,
    format: (v: number) => v.toFixed(2),
  },
  {
    label: "Median",
    value: 45.0,
    icon: GitBranch,
    format: (v: number) => v.toFixed(1),
  },
  {
    label: "Outliers",
    value: 89,
    icon: CircleDot,
    format: (v: number) => v.toLocaleString(),
  },
]

export function KpiCards() {
  const [animatedValues, setAnimatedValues] = useState<number[]>(
    kpis.map(() => 0)
  )

  useEffect(() => {
    const duration = 1200
    const steps = 40
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = Math.min(step / steps, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setAnimatedValues(kpis.map((kpi) => kpi.value * eased))

      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi, index) => (
        <div
          key={kpi.label}
          className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{kpi.label}</span>
            <kpi.icon className="size-4 text-muted-foreground" />
          </div>
          <div className="mt-3 text-2xl font-bold tabular-nums text-foreground">
            {kpi.format(animatedValues[index])}
          </div>
        </div>
      ))}
    </div>
  )
}
