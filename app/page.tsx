"use client"

import { AdaptiveSidebar } from "@/components/layout/adaptive-sidebar"
import { DashboardContent } from "@/components/dashboard-content"

export default function HomePage() {
  return (
    <AdaptiveSidebar defaultModule="dashboard">
      <DashboardContent />
    </AdaptiveSidebar>
  )
}
