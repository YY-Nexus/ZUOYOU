"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Maximize2, Minimize2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSidebar } from "@/hooks/use-sidebar"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BackButtonProps {
  showHome?: boolean
  showFullscreen?: boolean
  className?: string
  title?: string
}

export function BackButton({ showHome = true, showFullscreen = true, className, title }: BackButtonProps) {
  const router = useRouter()
  const { isFullscreen, isCollapsed, setIsFullscreen, setIsCollapsed, setActiveModule, exitFullscreen } = useSidebar()

  const handleBack = () => {
    router.back()
  }

  const handleHome = () => {
    setActiveModule("dashboard")
    exitFullscreen()
    router.push("/")
  }

  const toggleFullscreen = () => {
    if (isFullscreen) {
      setIsFullscreen(false)
      setIsCollapsed(false)
    } else {
      setIsFullscreen(true)
      setIsCollapsed(true)
    }
  }

  return (
    <motion.div
      className={cn("flex items-center space-x-2 mb-6", className)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 返回按钮 */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleBack}
        className="flex items-center space-x-2 hover:bg-sky-50 hover:border-sky-300 transition-all duration-200 bg-transparent"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>返回</span>
      </Button>

      {/* 首页按钮 */}
      {showHome && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleHome}
          className="flex items-center space-x-2 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 bg-transparent"
        >
          <Home className="h-4 w-4" />
          <span>首页</span>
        </Button>
      )}

      {/* 全屏切换按钮 */}
      {showFullscreen && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className={cn(
            "flex items-center space-x-2 transition-all duration-200",
            isFullscreen
              ? "bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100"
              : "hover:bg-blue-50 hover:border-blue-300",
          )}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="h-4 w-4" />
              <span>退出全屏</span>
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4" />
              <span>全屏模式</span>
            </>
          )}
        </Button>
      )}

      {/* 页面标题 */}
      {title && (
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 ml-4">{title}</h1>
        </div>
      )}
    </motion.div>
  )
}
