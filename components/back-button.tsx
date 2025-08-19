"use client"

import { ArrowLeft, Home, Maximize2, Minimize2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/hooks/use-sidebar"
import { motion } from "framer-motion"

interface BackButtonProps {
  showHome?: boolean
  showFullscreen?: boolean
  className?: string
}

export function BackButton({ showHome = true, showFullscreen = true, className = "" }: BackButtonProps) {
  const router = useRouter()
  const { isFullscreen, exitFullscreen, enterFullscreen } = useSidebar()

  const handleBack = () => {
    router.back()
  }

  const handleHome = () => {
    exitFullscreen()
    router.push("/")
  }

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen()
    } else {
      enterFullscreen()
    }
  }

  return (
    <motion.div
      className={`flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button variant="outline" size="sm" onClick={handleBack} className="flex items-center gap-2 bg-transparent">
        <ArrowLeft className="h-4 w-4" />
        返回
      </Button>

      {showHome && (
        <Button variant="outline" size="sm" onClick={handleHome} className="flex items-center gap-2 bg-transparent">
          <Home className="h-4 w-4" />
          首页
        </Button>
      )}

      {showFullscreen && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFullscreen}
          className="flex items-center gap-2 bg-transparent"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="h-4 w-4" />
              退出全屏
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4" />
              全屏
            </>
          )}
        </Button>
      )}
    </motion.div>
  )
}
