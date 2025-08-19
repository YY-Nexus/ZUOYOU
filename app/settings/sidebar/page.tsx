"use client"

import { PageContainer } from "@/components/layout/page-container"
import { SidebarConfig } from "@/components/sidebar-config"

export default function SidebarSettingsPage() {
  return (
    <PageContainer title="侧边栏设置" description="自定义侧边栏的外观和行为">
      <SidebarConfig />
    </PageContainer>
  )
}
