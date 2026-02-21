"use client"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const barData = [
  { name: "Q1", revenue: 4200, cost: 2800 },
  { name: "Q2", revenue: 5800, cost: 3200 },
  { name: "Q3", revenue: 4900, cost: 2600 },
  { name: "Q4", revenue: 7200, cost: 3800 },
]

const lineData = [
  { month: "Jan", value: 30, trend: 28 },
  { month: "Feb", value: 42, trend: 35 },
  { month: "Mar", value: 38, trend: 40 },
  { month: "Apr", value: 55, trend: 48 },
  { month: "May", value: 49, trend: 52 },
  { month: "Jun", value: 62, trend: 58 },
  { month: "Jul", value: 71, trend: 65 },
  { month: "Aug", value: 65, trend: 68 },
]

const pieData = [
  { name: "Category A", value: 35 },
  { name: "Category B", value: 25 },
  { name: "Category C", value: 20 },
  { name: "Category D", value: 12 },
  { name: "Other", value: 8 },
]

const heatmapData = [
  { name: "Revenue", revenue: 1.0, cost: 0.82, profit: 0.75, volume: 0.45 },
  { name: "Cost", revenue: 0.82, cost: 1.0, profit: -0.35, volume: 0.62 },
  { name: "Profit", revenue: 0.75, cost: -0.35, profit: 1.0, volume: 0.28 },
  { name: "Volume", revenue: 0.45, cost: 0.62, profit: 0.28, volume: 1.0 },
]

const PIE_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

function ChartCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      <div className="h-56">{children}</div>
    </div>
  )
}

function CorrelationHeatmap() {
  const variables = ["Revenue", "Cost", "Profit", "Volume"]
  const getColor = (val: number) => {
    if (val >= 0.7) return "bg-primary"
    if (val >= 0.4) return "bg-primary/70"
    if (val >= 0) return "bg-primary/30"
    if (val >= -0.4) return "bg-destructive/30"
    return "bg-destructive/60"
  }
  const getTextColor = (val: number) => {
    if (Math.abs(val) >= 0.7) return "text-primary-foreground"
    return "text-foreground"
  }

  return (
    <div className="flex h-full flex-col justify-center">
      <div className="grid grid-cols-5 gap-1">
        <div />
        {variables.map((v) => (
          <div
            key={v}
            className="text-center text-xs text-muted-foreground"
          >
            {v.slice(0, 4)}
          </div>
        ))}
        {heatmapData.map((row) => (
          <>
            <div
              key={`label-${row.name}`}
              className="flex items-center text-xs text-muted-foreground"
            >
              {row.name.slice(0, 4)}
            </div>
            {[row.revenue, row.cost, row.profit, row.volume].map((val, i) => (
              <div
                key={`${row.name}-${i}`}
                className={`flex items-center justify-center rounded p-2 text-xs font-medium ${getColor(val)} ${getTextColor(val)}`}
              >
                {val.toFixed(2)}
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  )
}

export function ChartsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ChartCard title="Revenue vs Cost by Quarter">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--color-foreground)",
              }}
            />
            <Bar
              dataKey="revenue"
              fill="var(--color-chart-1)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="cost"
              fill="var(--color-chart-3)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Monthly Performance Trend">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              className="fill-muted-foreground"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--color-foreground)",
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="trend"
              stroke="var(--color-chart-3)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Category Distribution">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                borderColor: "var(--color-border)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--color-foreground)",
              }}
            />
            <Legend
              iconSize={8}
              wrapperStyle={{ fontSize: "11px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Correlation Heatmap">
        <CorrelationHeatmap />
      </ChartCard>
    </div>
  )
}
