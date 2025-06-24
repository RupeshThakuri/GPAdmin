"use client"

import type React from "react"
interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: Readonly<DashboardShellProps>) {
  return <div className="flex flex-col gap-6">{children}</div>
}

