"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useResponsiveLayout, type LayoutConfig } from "@/lib/responsive-layout"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { cn } from "@/lib/utils"

// 布局上下文
interface LayoutContextType {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  layoutConfig: LayoutConfig
  updateLayoutConfig: (config: Partial<LayoutConfig>) => void
  sidebarWidth: number
  contentMarginLeft: number
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function useLayoutContext() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error("useLayoutContext must be used within a LayoutProvider")
  }
  return context
}

// 响应式布局提供者
interface ResponsiveLayoutProviderProps {
  children: React.ReactNode
  initialConfig?: Partial<LayoutConfig>
}

export function ResponsiveLayoutProvider({ children, initialConfig }: ResponsiveLayoutProviderProps) {
  const { layoutConfig: defaultConfig, isMobile } = useResponsiveLayout(initialConfig)
  const [layoutConfig, setLayoutConfig] = useState(defaultConfig)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // 计算侧边栏宽度
  const sidebarWidth = isMobile
    ? 0
    : sidebarCollapsed
      ? layoutConfig.sidebar.width.collapsed
      : layoutConfig.sidebar.width.expanded

  // 计算主内容区左边距
  const contentMarginLeft = isMobile ? 0 : sidebarWidth

  // 移动端自动关闭侧边栏
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
      setSidebarCollapsed(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  const updateLayoutConfig = (config: Partial<LayoutConfig>) => {
    setLayoutConfig((prev) => ({ ...prev, ...config }))
  }

  const value: LayoutContextType = {
    sidebarCollapsed,
    setSidebarCollapsed,
    sidebarOpen,
    setSidebarOpen,
    layoutConfig,
    updateLayoutConfig,
    sidebarWidth,
    contentMarginLeft,
  }

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}

// 主布局组件
interface ResponsiveLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  showHeader?: boolean
  className?: string
}

export function ResponsiveLayout({
  children,
  showSidebar = true,
  showHeader = true,
  className,
}: ResponsiveLayoutProps) {
  const { sidebarCollapsed, sidebarOpen, setSidebarOpen, layoutConfig, sidebarWidth, contentMarginLeft } =
    useLayoutContext()
  const { isMobile, getContentStyles } = useResponsiveLayout()

  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      {/* 侧边栏 - 使用固定定位 */}
      {showSidebar && (
        <>
          <div
            className={cn(
              "fixed top-0 left-0 h-full z-40 transition-all duration-300 ease-in-out",
              isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
            )}
            style={{
              width: isMobile ? layoutConfig.sidebar.width.expanded : sidebarWidth,
            }}
          >
            <Sidebar />
          </div>

          {/* 移动端遮罩 */}
          {isMobile && sidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}
        </>
      )}

      {/* 主内容区域 */}
      <div
        className="min-h-screen transition-all duration-300 ease-in-out"
        style={{
          marginLeft: showSidebar ? contentMarginLeft : 0,
          width: showSidebar ? `calc(100% - ${contentMarginLeft}px)` : "100%",
        }}
      >
        {/* 头部 */}
        {showHeader && (
          <div
            className="sticky top-0 z-30 transition-all duration-300 ease-in-out"
            style={{
              height: layoutConfig.header.height,
            }}
          >
            <Header />
          </div>
        )}

        {/* 页面内容 */}
        <main
          className="bg-gray-50 transition-all duration-300 ease-in-out"
          style={{
            minHeight: showHeader ? `calc(100vh - ${layoutConfig.header.height}px)` : "100vh",
            ...getContentStyles(),
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
