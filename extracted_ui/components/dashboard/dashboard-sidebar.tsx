"use client"

import Link from "next/link"
import {
  BarChart3,
  LayoutDashboard,
  Upload,
  FileText,
  Settings,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true },
    { icon: Upload, label: "Upload", href: "/upload", active: false },
    { icon: FileText, label: "Reports", href: "#", active: false },
    { icon: Settings, label: "Settings", href: "#", active: false },
  ]

  return (
    <aside
      className={`hidden shrink-0 border-r border-border bg-card transition-all duration-300 lg:flex lg:flex-col ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary">
              <BarChart3 className="size-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              InsightPilot
            </span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={collapsed ? "mx-auto" : ""}
        >
          {collapsed ? (
            <PanelLeft className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </Button>
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              item.active
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            } ${collapsed ? "justify-center px-0" : ""}`}
          >
            <item.icon className="size-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
