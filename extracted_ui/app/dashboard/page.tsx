"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { ChartsGrid } from "@/components/dashboard/charts-grid"
import { AiSummaryPanel } from "@/components/dashboard/ai-summary-panel"
import { ChatAgent } from "@/components/chat-agent"

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useState(() => {
    setMounted(true)
  })

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Analytics Dashboard
            </h1>
            <p className="text-xs text-muted-foreground">
              Dataset: sales_data_2024.csv
            </p>
          </div>
          <div className="flex items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="size-3.5" />
              Export PDF
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <KpiCards />
            <ChartsGrid />
            <AiSummaryPanel />
          </div>
        </main>
      </div>

      <ChatAgent />
    </div>
  )
}
