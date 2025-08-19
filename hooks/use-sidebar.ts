"use client"

import { useState, useEffect, useCallback } from "react"

interface UseSidebarOptions {
  defaultCollapsed?: boolean
  autoCollapse?: boolean
  autoCollapseDelay?: number
  mobileBreakpoint?: number
}

export function useSidebar(options: UseSidebarOptions = {}) {
  const { defaultCollapsed = false, autoCollapse = true, autoCollapseDelay = 3000, mobileBreakpoint = 1024 } = options

  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < mobileBreakpoint
      setIsMobile(mobile)
      if (mobile) {
        setIsCollapsed(true)
        setIsPinned(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [mobileBreakpoint])

  // 自动收缩逻辑
  useEffect(() => {
    if (!autoCollapse || isPinned || isMobile || isHovered || isCollapsed) {
      return
    }

    const timer = setTimeout(() => {
      setIsCollapsed(true)
    }, autoCollapseDelay)

    return () => clearTimeout(timer)
  }, [autoCollapse, isPinned, isMobile, isHovered, isCollapsed, autoCollapseDelay])

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev)
  }, [])

  const togglePinned = useCallback(() => {
    setIsPinned((prev) => {
      const newPinned = !prev
      if (newPinned) {
        setIsCollapsed(false)
      }
      return newPinned
    })
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsHovered(true)
      setIsCollapsed(false)
    }
  }, [isMobile])

  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setIsHovered(false)
    }
  }, [isMobile])

  return {
    isCollapsed,
    isHovered,
    isPinned,
    isMobile,
    setIsCollapsed,
    toggleCollapsed,
    togglePinned,
    handleMouseEnter,
    handleMouseLeave,
  }
}
