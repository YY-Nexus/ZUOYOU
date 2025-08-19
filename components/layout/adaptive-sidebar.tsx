"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext, useCallback, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { cn } from "@/lib/utils"

interface SidebarContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  activeModule: string
  setActiveModule: (module: string) => void
  isMobile: boolean
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function useSidebarContext() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider")
  }
  return context
}

interface AdaptiveSidebarProps {
  children: React.ReactNode
  defaultModule?: string
  className?: string
}

export function AdaptiveSidebar({ children, defaultModule = "dashboard", className }: AdaptiveSidebarProps) {
  const [activeModule, setActiveModule] = useState(defaultModule)
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // 确保客户端渲染
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 检测移动设备和屏幕尺寸变化
  const checkMobile = useCallback(() => {
    const mobile = window.innerWidth < 768
    const wasMobile = isMobile

    setIsMobile(mobile)

    // 如果从桌面切换到移动端
    if (mobile && !wasMobile) {
      setIsOpen(false)
      setIsCollapsed(true)
    }
    // 如果从移动端切换到桌面
    else if (!mobile && !wasMobile) {
      setIsOpen(true)
      setIsCollapsed(false)
    }
  }, [isMobile])

  useEffect(() => {
    if (isMounted) {
      checkMobile()
      window.addEventListener("resize", checkMobile)
      return () => {
        window.removeEventListener("resize", checkMobile)
      }
    }
  }, [isMounted, checkMobile])

  // 侧边栏切换函数
  const toggleSidebar = useCallback(() => {
    if (isAnimating) return

    setIsAnimating(true)

    if (isMobile) {
      setIsOpen(!isOpen)
    } else {
      setIsCollapsed(!isCollapsed)
    }

    // 动画完成后重置状态
    setTimeout(() => {
      setIsAnimating(false)
    }, 300)
  }, [isMobile, isOpen, isCollapsed, isAnimating])

  // 处理触摸开始
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isMobile) return

      const touch = e.touches[0]
      setTouchStart({ x: touch.clientX, y: touch.clientY })
      setTouchEnd(null)
    },
    [isMobile],
  )

  // 处理触摸移动
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isMobile || !touchStart) return

      const touch = e.touches[0]
      setTouchEnd({ x: touch.clientX, y: touch.clientY })
    },
    [isMobile, touchStart],
  )

  // 处理触摸结束
  const handleTouchEnd = useCallback(() => {
    if (!isMobile || !touchStart || !touchEnd) return

    const deltaX = touchEnd.x - touchStart.x
    const deltaY = Math.abs(touchEnd.y - touchStart.y)
    const minSwipeDistance = 50

    // 确保是水平滑动而不是垂直滑动
    if (Math.abs(deltaX) > minSwipeDistance && deltaY < 100) {
      if (deltaX > 0 && touchStart.x < 50 && !isOpen) {
        // 从左边缘向右滑动，打开侧边栏
        setIsOpen(true)
      } else if (deltaX < 0 && isOpen) {
        // 向左滑动，关闭侧边栏
        setIsOpen(false)
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
  }, [isMobile, touchStart, touchEnd, isOpen])

  // 处理点击遮罩层关闭侧边栏
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      setIsOpen(false)
    }
  }, [])

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC键关闭移动端侧边栏
      if (e.key === "Escape" && isMobile && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isMobile, isOpen])

  // 防止背景滚动
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobile, isOpen])

  const contextValue: SidebarContextType = {
    isOpen,
    setIsOpen,
    activeModule,
    setActiveModule,
    isMobile,
    isCollapsed,
    setIsCollapsed,
    toggleSidebar,
  }

  if (!isMounted) {
    return null
  }

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        className={cn("flex h-screen bg-gray-50 dark:bg-gray-900", className)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 侧边栏容器 */}
        <div
          ref={sidebarRef}
          className={cn(
            "transition-all duration-300 ease-in-out flex-shrink-0 relative",
            // 桌面端样式
            !isMobile && (isCollapsed ? "w-16" : "w-[180px]"),
            // 移动端样式
            isMobile && "fixed inset-y-0 left-0 z-50",
            isMobile && (isOpen ? "translate-x-0" : "-translate-x-full"),
          )}
          style={{
            width: isMobile ? "280px" : undefined,
          }}
        >
          {/* 移动端遮罩层 */}
          {isMobile && isOpen && (
            <div
              ref={overlayRef}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
              onClick={handleOverlayClick}
              style={{
                left: "280px",
                width: "calc(100vw - 280px)",
              }}
            />
          )}

          {/* 侧边栏内容 */}
          <div className={cn("h-full relative z-50", isMobile && "w-[280px] shadow-2xl", !isMobile && "shadow-lg")}>
            <Sidebar
              activeModule={activeModule}
              setActiveModule={setActiveModule}
              className="h-full"
              collapsed={isMobile ? false : isCollapsed}
              isMobile={isMobile}
              onItemClick={() => {
                // 移动端点击菜单项后自动关闭侧边栏
                if (isMobile) {
                  setIsOpen(false)
                }
              }}
            />
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* 顶部导航栏 */}
          <Header
            activeModule={activeModule}
            className="flex-shrink-0"
            onMenuClick={toggleSidebar}
            isMobile={isMobile}
          />

          {/* 页面内容 */}
          <main
            className={cn(
              "flex-1 overflow-auto bg-gray-50 dark:bg-gray-900",
              // 移动端减少内边距
              isMobile ? "p-4" : "p-6",
            )}
          >
            <div className="max-w-full mx-auto">{children}</div>
          </main>
        </div>

        {/* 移动端底部安全区域 */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 h-safe-area-inset-bottom bg-transparent pointer-events-none" />
        )}
      </div>
    </SidebarContext.Provider>
  )
}

// 导出 SidebarProvider 作为别名
export const SidebarProvider = SidebarContext.Provider
