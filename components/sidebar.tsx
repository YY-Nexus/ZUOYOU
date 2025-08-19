"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart3,
  Users,
  CheckSquare,
  DollarSign,
  MessageSquare,
  Brain,
  FileText,
  Settings,
  Search,
  ChevronRight,
  Home,
  TrendingUp,
  Calendar,
  Bell,
  Shield,
  Database,
  Zap,
  Target,
  PieChart,
  Activity,
  Briefcase,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useSidebar } from "@/hooks/use-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"

interface NavigationItem {
  id: string
  title: string
  href: string
  icon: any
  badge?: string
  children?: NavigationItem[]
}

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    title: "仪表板",
    href: "/",
    icon: Home,
  },
  {
    id: "customers",
    title: "客户管理",
    href: "/customers",
    icon: Users,
    badge: "12",
  },
  {
    id: "tasks",
    title: "任务管理",
    href: "/tasks",
    icon: CheckSquare,
    badge: "5",
  },
  {
    id: "finance",
    title: "财务管理",
    href: "/finance",
    icon: DollarSign,
    children: [
      { id: "budget", title: "预算管理", href: "/finance/budget", icon: PieChart },
      { id: "invoices", title: "发票管理", href: "/finance/invoices", icon: FileText },
      { id: "payments", title: "支付管理", href: "/finance/payments", icon: DollarSign },
      { id: "reports", title: "财务报表", href: "/finance/reports", icon: BarChart3 },
    ],
  },
  {
    id: "communication",
    title: "沟通协作",
    href: "/communication",
    icon: MessageSquare,
    children: [
      { id: "chat", title: "即时聊天", href: "/communication/chat", icon: MessageSquare },
      { id: "meetings", title: "会议管理", href: "/communication/meetings", icon: Calendar },
      { id: "documents", title: "文档协作", href: "/communication/documents", icon: FileText },
      { id: "notifications", title: "通知中心", href: "/communication/notifications", icon: Bell },
    ],
  },
  {
    id: "ai",
    title: "AI 分析",
    href: "/ai",
    icon: Brain,
    badge: "新",
    children: [
      { id: "customer-data", title: "客户数据分析", href: "/ai/customer-data", icon: Users },
      { id: "smart-forms", title: "智能表单", href: "/ai/smart-forms", icon: FileText },
      { id: "content-creation", title: "内容创作", href: "/ai/content-creation", icon: Zap },
    ],
  },
  {
    id: "analytics",
    title: "数据分析",
    href: "/analytics",
    icon: BarChart3,
    children: [
      { id: "sales", title: "销售分析", href: "/analytics/sales", icon: TrendingUp },
      { id: "customers-analytics", title: "客户分析", href: "/analytics/customers", icon: Users },
      { id: "performance", title: "绩效分析", href: "/analytics/performance", icon: Activity },
    ],
  },
  {
    id: "kpi",
    title: "KPI 管理",
    href: "/kpi",
    icon: Target,
  },
  {
    id: "reports",
    title: "报表中心",
    href: "/reports",
    icon: FileText,
  },
  {
    id: "settings",
    title: "系统设置",
    href: "/settings",
    icon: Settings,
    children: [
      { id: "profile", title: "个人资料", href: "/profile", icon: Users },
      { id: "security", title: "安全设置", href: "/security", icon: Shield },
      { id: "database", title: "数据库管理", href: "/database", icon: Database },
      { id: "system", title: "系统管理", href: "/system", icon: Settings },
    ],
  },
]

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const {
    isCollapsed,
    isFullscreen,
    activeModule,
    searchQuery,
    focusedIndex,
    setCollapsed,
    setActiveModule,
    setSearchQuery,
    setFocusedIndex,
    enterFullscreen,
    exitFullscreen,
    toggleSidebar,
  } = useSidebar()

  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [filteredItems, setFilteredItems] = useState<NavigationItem[]>(navigationItems)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // 搜索功能
  useEffect(() => {
    if (searchQuery) {
      const filtered = navigationItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.children?.some((child) => child.title.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredItems(filtered)
    } else {
      setFilteredItems(navigationItems)
    }
  }, [searchQuery])

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!sidebarRef.current?.contains(document.activeElement)) return

      const flatItems = filteredItems.reduce<NavigationItem[]>((acc, item) => {
        acc.push(item)
        if (expandedItems.includes(item.id) && item.children) {
          acc.push(...item.children)
        }
        return acc
      }, [])

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
            toggleExpanded(flatItems[focusedIndex].id)
          }
          break
        case "ArrowLeft":
          event.preventDefault()
          if (focusedIndex >= 0 && expandedItems.includes(flatItems[focusedIndex].id)) {
            toggleExpanded(flatItems[focusedIndex].id)
          }
          break
        case "Enter":
          event.preventDefault()
          if (focusedIndex >= 0) {
            handleItemClick(flatItems[focusedIndex])
          }
          break
        case "Escape":
          event.preventDefault()
          setCollapsed(true)
          break
        case "/":
          event.preventDefault()
          searchInputRef.current?.focus()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [focusedIndex, filteredItems, expandedItems])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => (prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]))
  }

  const handleItemClick = (item: NavigationItem) => {
    setActiveModule(item.id)

    // 如果不是仪表板，进入全屏模式
    if (item.id !== "dashboard") {
      enterFullscreen()
    } else {
      exitFullscreen()
    }

    router.push(item.href)
  }

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isActive = pathname === item.href || activeModule === item.id
    const isExpanded = expandedItems.includes(item.id)
    const hasChildren = item.children && item.children.length > 0

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: level * 0.05 }}
      >
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start gap-3 h-10 px-3",
            level > 0 && "ml-6 w-[calc(100%-1.5rem)]",
            isActive && "bg-primary/10 text-primary font-medium",
            isCollapsed && "px-2 justify-center",
          )}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id)
            } else {
              handleItemClick(item)
            }
          }}
        >
          <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-auto">
                  {item.badge}
                </Badge>
              )}
              {hasChildren && (
                <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              )}
            </>
          )}
        </Button>

        <AnimatePresence>
          {hasChildren && isExpanded && !isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="py-1">{item.children?.map((child) => renderNavigationItem(child, level + 1))}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      {(!isFullscreen || !isCollapsed) && (
        <motion.div
          ref={sidebarRef}
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "fixed left-0 top-0 z-50 h-full bg-background border-r border-border",
            "flex flex-col shadow-lg",
            isCollapsed ? "w-16" : "w-72",
          )}
        >
          {/* 头部 */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-sm">企业管理系统</h2>
                    <p className="text-xs text-muted-foreground">YYC³ 客服中心</p>
                  </div>
                </motion.div>
              )}
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
                {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>

            {/* 搜索框 */}
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 relative"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="搜索功能... (按 / 快速搜索)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9"
                />
              </motion.div>
            )}
          </div>

          {/* 快捷操作 */}
          {!isCollapsed && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Bell className="h-4 w-4 mr-2" />
                  通知
                  <Badge variant="destructive" className="ml-auto">
                    3
                  </Badge>
                </Button>
              </div>
            </div>
          )}

          {/* 导航菜单 */}
          <ScrollArea className="flex-1 px-3">
            <div className="py-4 space-y-1">{filteredItems.map((item) => renderNavigationItem(item))}</div>
          </ScrollArea>

          {/* 底部用户信息 */}
          <div className="p-4 border-t border-border">
            {!isCollapsed ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>YC</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">管理员</p>
                  <p className="text-xs text-muted-foreground truncate">admin@yyc.com</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </motion.div>
            ) : (
              <div className="flex justify-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>YC</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
