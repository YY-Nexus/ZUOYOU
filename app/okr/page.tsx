"use client"

import { useEffect } from "react"
import { AdaptiveSidebar } from "@/components/layout/adaptive-sidebar"
import { OKRManagement } from "@/components/okr-management"
import { okrSeeder } from "@/lib/okr-seeder"

export default function OKRPage() {
  useEffect(() => {
    // 初始化OKR数据
    const initializeOKRData = async () => {
      try {
        await okrSeeder.seedOKRData()
      } catch (error) {
        console.error("初始化OKR数据失败:", error)
      }
    }

    initializeOKRData()
  }, [])

  return (
    <AdaptiveSidebar defaultModule="okr">
      <OKRManagement />
    </AdaptiveSidebar>
  )
}
