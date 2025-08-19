import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SidebarState {
  isCollapsed: boolean
  isFullscreen: boolean
  activeModule: string
  searchQuery: string
  focusedIndex: number
  setCollapsed: (collapsed: boolean) => void
  setActiveModule: (module: string) => void
  setSearchQuery: (query: string) => void
  setFocusedIndex: (index: number) => void
  enterFullscreen: () => void
  exitFullscreen: () => void
  toggleSidebar: () => void
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set, get) => ({
      isCollapsed: false,
      isFullscreen: false,
      activeModule: "dashboard",
      searchQuery: "",
      focusedIndex: -1,
      setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
      setActiveModule: (module) => set({ activeModule: module }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setFocusedIndex: (index) => set({ focusedIndex: index }),
      enterFullscreen: () => set({ isCollapsed: true, isFullscreen: true }),
      exitFullscreen: () => set({ isCollapsed: false, isFullscreen: false }),
      toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
    }),
    {
      name: "sidebar-storage",
    },
  ),
)
