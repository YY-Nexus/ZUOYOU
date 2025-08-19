"use client"

import { useEffect, useCallback } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SidebarStore {
  isOpen: boolean
  isMobile: boolean
  collapsed: boolean
  expandedItems: string[]
  activeItem: string | null
  focusedIndex: number
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void
  setMobile: (mobile: boolean) => void
  setCollapsed: (collapsed: boolean) => void
  toggleExpanded: (item: string) => void
  setActiveItem: (item: string | null) => void
  setFocusedIndex: (index: number) => void
  resetFocus: () => void
}

export const useSidebar = create<SidebarStore>()(
  persist(
    (set, get) => ({
      isOpen: false,
      isMobile: false,
      collapsed: false,
      expandedItems: [],
      activeItem: null,
      focusedIndex: -1,
      openSidebar: () => set({ isOpen: true }),
      closeSidebar: () => set({ isOpen: false }),
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      setMobile: (mobile) => set({ isMobile: mobile }),
      setCollapsed: (collapsed) => set({ collapsed }),
      toggleExpanded: (item) =>
        set((state) => ({
          expandedItems: state.expandedItems.includes(item)
            ? state.expandedItems.filter((i) => i !== item)
            : [...state.expandedItems, item],
        })),
      setActiveItem: (item) => set({ activeItem: item }),
      setFocusedIndex: (index) => set({ focusedIndex: index }),
      resetFocus: () => set({ focusedIndex: -1 }),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({
        collapsed: state.collapsed,
        expandedItems: state.expandedItems,
      }),
    },
  ),
)

// 检测移动设备的 hook
export function useIsMobile() {
  const { isMobile, setMobile } = useSidebar()

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setMobile(mobile)

      // 移动端自动关闭侧边栏
      if (mobile) {
        useSidebar.getState().closeSidebar()
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [setMobile])

  return isMobile
}

// 键盘导航 hook
export function useSidebarKeyboard(menuItems: any[]) {
  const { focusedIndex, setFocusedIndex, resetFocus, toggleExpanded, closeSidebar } = useSidebar()

  const flattenMenuItems = useCallback((items: any[], level = 0): any[] => {
    const result: any[] = []
    items.forEach((item) => {
      result.push({ ...item, level })
      if (item.children && item.expanded) {
        result.push(...flattenMenuItems(item.children, level + 1))
      }
    })
    return result
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const flatItems = flattenMenuItems(menuItems)

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          setFocusedIndex(Math.min(focusedIndex + 1, flatItems.length - 1))
          break
        case "ArrowUp":
          event.preventDefault()
          setFocusedIndex(Math.max(focusedIndex - 1, 0))
          break
        case "ArrowRight":
          event.preventDefault()
          if (focusedIndex >= 0 && flatItems[focusedIndex]?.children) {
            toggleExpanded(flatItems[focusedIndex].title)
          }
          break
        case "ArrowLeft":
          event.preventDefault()
          if (focusedIndex >= 0 && flatItems[focusedIndex]?.children) {
            toggleExpanded(flatItems[focusedIndex].title)
          }
          break
        case "Enter":
        case " ":
          event.preventDefault()
          if (focusedIndex >= 0) {
            const item = flatItems[focusedIndex]
            if (item.href) {
              window.location.href = item.href
            } else if (item.children) {
              toggleExpanded(item.title)
            }
          }
          break
        case "Escape":
          event.preventDefault()
          closeSidebar()
          resetFocus()
          break
        case "Home":
          event.preventDefault()
          setFocusedIndex(0)
          break
        case "End":
          event.preventDefault()
          setFocusedIndex(flatItems.length - 1)
          break
      }
    },
    [focusedIndex, setFocusedIndex, resetFocus, toggleExpanded, closeSidebar, flattenMenuItems, menuItems],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  return { focusedIndex, flattenMenuItems }
}
