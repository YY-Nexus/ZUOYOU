"use client"

import React from "react"

import { create } from "zustand"

interface SidebarStore {
  isOpen: boolean
  isMobile: boolean
  collapsed: boolean
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
  setMobile: (mobile: boolean) => void
  setCollapsed: (collapsed: boolean) => void
}

export const useSidebar = create<SidebarStore>((set) => ({
  isOpen: false,
  isMobile: false,
  collapsed: false,
  openSidebar: () => set({ isOpen: true }),
  closeSidebar: () => set({ isOpen: false }),
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  setMobile: (mobile) => set({ isMobile: mobile }),
  setCollapsed: (collapsed) => set({ collapsed }),
}))

// 检测移动设备的 hook
export function useIsMobile() {
  const { isMobile, setMobile } = useSidebar()

  React.useEffect(() => {
    const checkMobile = () => {
      setMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [setMobile])

  return isMobile
}
