"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SidebarState {
  isOpen: boolean
  isCollapsed: boolean
  isFullscreen: boolean
  activeModule: string
  searchQuery: string
  expandedItems: string[]
  focusedIndex: number
  keyboardNavigation: boolean

  // Actions
  setIsOpen: (open: boolean) => void
  setIsCollapsed: (collapsed: boolean) => void
  setIsFullscreen: (fullscreen: boolean) => void
  setActiveModule: (module: string) => void
  setSearchQuery: (query: string) => void
  toggleExpanded: (item: string) => void
  setFocusedIndex: (index: number) => void
  setKeyboardNavigation: (enabled: boolean) => void

  // Combined actions
  enterFullscreen: () => void
  exitFullscreen: () => void
  toggleSidebar: () => void
  reset: () => void
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set, get) => ({
      isOpen: true,
      isCollapsed: false,
      isFullscreen: false,
      activeModule: "dashboard",
      searchQuery: "",
      expandedItems: [],
      focusedIndex: -1,
      keyboardNavigation: false,

      setIsOpen: (open) => set({ isOpen: open }),
      setIsCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
      setIsFullscreen: (fullscreen) => set({ isFullscreen: fullscreen }),
      setActiveModule: (module) => {
        set({ activeModule: module })
        // 进入页面时自动收缩侧边栏实现全屏
        if (module !== "dashboard") {
          set({ isCollapsed: true, isFullscreen: true })
        }
      },
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleExpanded: (item) => {
        const { expandedItems } = get()
        const isExpanded = expandedItems.includes(item)
        set({
          expandedItems: isExpanded ? expandedItems.filter((i) => i !== item) : [...expandedItems, item],
        })
      },
      setFocusedIndex: (index) => set({ focusedIndex: index }),
      setKeyboardNavigation: (enabled) => set({ keyboardNavigation: enabled }),

      enterFullscreen: () => set({ isCollapsed: true, isFullscreen: true }),
      exitFullscreen: () => set({ isCollapsed: false, isFullscreen: false }),
      toggleSidebar: () => {
        const { isOpen, isCollapsed } = get()
        if (window.innerWidth < 768) {
          set({ isOpen: !isOpen })
        } else {
          set({ isCollapsed: !isCollapsed })
        }
      },
      reset: () =>
        set({
          isOpen: true,
          isCollapsed: false,
          isFullscreen: false,
          activeModule: "dashboard",
          searchQuery: "",
          expandedItems: [],
          focusedIndex: -1,
          keyboardNavigation: false,
        }),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({
        isCollapsed: state.isCollapsed,
        activeModule: state.activeModule,
        expandedItems: state.expandedItems,
      }),
    },
  ),
)
