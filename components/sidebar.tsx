"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSidebar } from "@/hooks/use-sidebar"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  DollarSign,
  Target,
  FileCheck,
  MessageSquare,
  TrendingUp,
  BarChart3,
  Search,
  Settings,
  ChevronRight,
  Bell,
  Zap,
  Brain,
  Database,
  Shield,
  LogOut,
  RefreshCw,
  Keyboard,
  X,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface NavigationItem {
  id: string
  label: string
  icon: any
  badge?: string | number
  children?: NavigationItem[]
  href?: string
  description?: string
}

const navigationItems: NavigationItem[] = [
  {
    id: "dashboard",
    label: "仪表盘",
    icon: LayoutDashboard,
    href: "/",
    description: "系统概览和关键指标",
  },
  {
    id: "customers",
    label: "客户管理",
    icon: Users,
    badge: 12,
    href: "/customers",
    description: "客户信息和关系管理",
    children: [
      { id: "customer-list", label: "客户列表", icon: Users, href: "/customers" },
      { id: "customer-analytics", label: "客户分析", icon: BarChart3, href: "/analytics/customers" },
    ],
  },
  {
    id: "tasks",
    label: "任务管理",
    icon: CheckSquare,
    badge: 5,
    href: "/tasks",
    description: "工作任务和项目跟踪",
  },
  {
    id: "finance",
    label: "财务管理",
    icon: DollarSign,
    href: "/finance",
    description: "财务数据和报表管理",
    children: [
      { id: "finance-overview", label: "财务概览", icon: DollarSign, href: "/finance" },
      { id: "finance-budget", label: "预算管理", icon: Target, href: "/finance/budget" },
      { id: "finance-invoices", label: "发票管理", icon: FileCheck, href: "/finance/invoices" },
      { id: "finance-payments", label: "支付管理", icon: CheckSquare, href: "/finance/payments" },
    ],
  },
  {
    id: "okr",
    label: "OKR管理",
    icon: Target,
    badge: 3,
    href: "/okr",
    description: "目标和关键结果管理",
  },
  {
    id: "approval",
    label: "审批中心",
    icon: FileCheck,
    badge: 8,
    href: "/approval",
    description: "工作流程和审批管理",
  },
  {
    id: "communication",
    label: "沟通协作",
    icon: MessageSquare,
    badge: "新",
    href: "/communication",
    description: "团队沟通和协作工具",
    children: [
      { id: "chat", label: "即时聊天", icon: MessageSquare, href: "/communication/chat" },
      { id: "meetings", label: "会议管理", icon: Users, href: "/communication/meetings" },
      { id: "documents", label: "文档协作", icon: FileCheck, href: "/communication/documents" },
      { id: "notifications", label: "通知中心", icon: Bell, href: "/communication/notifications" },
    ],
  },
  {
    id: "ai",
    label: "AI分析",
    icon: Brain,
    href: "/ai",
    description: "人工智能分析和洞察",
    children: [
      { id: "ai-overview", label: "AI概览", icon: Brain, href: "/ai" },
      { id: "ai-customer-data", label: "客户数据分析", icon: Users, href: "/ai/customer-data" },
      { id: "ai-smart-forms", label: "智能表单", icon: FileCheck, href: "/ai/smart-forms" },
      { id: "ai-content-creation", label: "内容创作", icon: Zap, href: "/ai/content-creation" },
    ],
  },
  {
    id: "analytics",
    label: "数据分析",
    icon: BarChart3,
    href: "/analytics",
    description: "数据可视化和分析报告",
    children: [
      { id: "analytics-overview", label: "分析概览", icon: BarChart3, href: "/analytics" },
      { id: "analytics-sales", label: "销售分析", icon: TrendingUp, href: "/analytics/sales" },
      { id: "analytics-performance", label: "绩效分析", icon: Target, href: "/analytics/performance" },
    ],
  },
  {
    id: "system",
    label: "系统管理",
    icon: Settings,
    href: "/system",
    description: "系统设置和管理工具",
    children: [
      { id: "system-settings", label: "系统设置", icon: Settings, href: "/settings" },
      { id: "system-database", label: "数据库管理", icon: Database, href: "/system/database" },
      { id: "system-security", label: "安全管理", icon: Shield, href: "/security/mfa" },
      { id: "system-health", label: "系统健康", icon: RefreshCw, href: "/system/health" },
    ],
  },
]

interface SidebarProps {
  className?: string
  collapsed?: boolean
  isMobile?: boolean
  onItemClick?: () => void
}

export function Sidebar({ className, collapsed = false, isMobile = false, onItemClick }: SidebarProps) {
  const router = useRouter()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)

  const {
    activeModule,
    searchQuery,
    expandedItems,
    focusedIndex,
    keyboardNavigation,
    setActiveModule,
    setSearchQuery,
    toggleExpanded,
    setFocusedIndex,
    setKeyboardNavigation,
    enterFullscreen,
  } = useSidebar()

  // 过滤导航项
  const filteredItems = navigationItems.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.children?.some((child) => child.label.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // 扁平化所有可导航项目
  const flattenedItems = navigationItems.reduce<NavigationItem[]>((acc, item) => {
    acc.push(item)
    if (item.children && expandedItems.includes(item.id)) {
      acc.push(...item.children)
    }
    return acc
  }, [])

  // 键盘导航处理
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!keyboardNavigation) return

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          setFocusedIndex(Math.min(focusedIndex + 1, flattenedItems.length - 1))
          break
        case "ArrowUp":
          event.preventDefault()
          setFocusedIndex(Math.max(focusedIndex - 1, 0))
          break
        case "ArrowRight":
          event.preventDefault()
          const currentItem = flattenedItems[focusedIndex]
          if (currentItem?.children && !expandedItems.includes(currentItem.id)) {
            toggleExpanded(currentItem.id)
          }
          break
        case "ArrowLeft":
          event.preventDefault()
          const currentItemLeft = flattenedItems[focusedIndex]
          if (currentItemLeft?.children && expandedItems.includes(currentItemLeft.id)) {
            toggleExpanded(currentItemLeft.id)
          }
          break
        case "Enter":
        case " ":
          event.preventDefault()
          const selectedItem = flattenedItems[focusedIndex]
          if (selectedItem) {
            handleItemClick(selectedItem)
          }
          break
        case "Escape":
          event.preventDefault()
          setKeyboardNavigation(false)
          setFocusedIndex(-1)
          break
        case "Home":
          event.preventDefault()
          setFocusedIndex(0)
          break
        case "End":
          event.preventDefault()
          setFocusedIndex(flattenedItems.length - 1)
          break
        case "/":
          event.preventDefault()
          searchInputRef.current?.focus()
          break
      }
    },
    [keyboardNavigation, focusedIndex, flattenedItems, expandedItems, toggleExpanded],
  )

  // 添加键盘事件监听
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // 处理项目点击
  const handleItemClick = (item: NavigationItem) => {
    if (item.children) {
      toggleExpanded(item.id)
    } else {
      setActiveModule(item.id)
      // 进入页面时自动全屏
      if (item.id !== "dashboard") {
        enterFullscreen()
      }
      if (item.href) {
        router.push(item.href)
      }
      onItemClick?.()
    }
  }

  // 渲染导航项
  const renderNavigationItem = (item: NavigationItem, level = 0, index = 0) => {
    const Icon = item.icon
    const isActive = activeModule === item.id
    const isExpanded = expandedItems.includes(item.id)
    const isFocused = keyboardNavigation && focusedIndex === index
    const hasChildren = item.children && item.children.length > 0

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
      >
        <Button
          variant={isActive ? "default" : "ghost"}
          className={cn(
            "w-full justify-start h-auto py-3 px-3 transition-all duration-200",
            level > 0 && "ml-4 py-2",
            isActive && "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md",
            !isActive && "hover:bg-sky-50 hover:text-sky-700",
            isFocused && "ring-2 ring-sky-300 ring-offset-2",
            collapsed && !isMobile && "px-2",
          )}
          onClick={() => handleItemClick(item)}
          onFocus={() => {
            setKeyboardNavigation(true)
            setFocusedIndex(index)
          }}
          tabIndex={keyboardNavigation ? 0 : -1}
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Icon
              className={cn(
                "flex-shrink-0 transition-colors",
                collapsed && !isMobile ? "h-5 w-5" : "h-4 w-4",
                isActive ? "text-white" : "text-slate-600",
              )}
            />

            <AnimatePresence>
              {(!collapsed || isMobile) && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex items-center justify-between flex-1 min-w-0"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium truncate">{item.label}</span>
                    {item.description && level === 0 && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{item.description}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {item.badge && (
                      <Badge
                        variant={isActive ? "secondary" : "default"}
                        className={cn(
                          "text-xs px-2 py-0.5",
                          isActive
                            ? "bg-white/20 text-white border-white/30"
                            : "bg-gradient-to-r from-orange-400 to-red-500 text-white",
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}

                    {hasChildren && (
                      <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronRight className="h-4 w-4 opacity-50" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Button>

        {/* 子菜单 */}
        <AnimatePresence>
          {hasChildren && isExpanded && (!collapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-sky-100 pl-4">
                {item.children?.map((child, childIndex) =>
                  renderNavigationItem(child, level + 1, index + childIndex + 1),
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={sidebarRef}
      className={cn(
        "flex flex-col h-full bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-700 shadow-lg",
        className,
      )}
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* 顶部区域 */}
      <div className="p-4 border-b border-slate-200 dark:border-gray-700">
        <AnimatePresence>
          {(!collapsed || isMobile) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              {/* Logo 和标题 */}
              <div className="flex items-center space-x-3">
                <img src="/images/yanyu-cloud-3d-logo.png" alt="言语云" className="w-8 h-8 object-contain" />
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">YYC³</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">客户关怀中心</p>
                </div>
              </div>

              {/* 搜索框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="搜索功能..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-50 dark:bg-gray-800 border-slate-200 dark:border-gray-600"
                  onFocus={() => setKeyboardNavigation(false)}
                />
              </div>

              {/* 快捷操作 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <ThemeToggle />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
                    className="h-8 w-8 p-0"
                  >
                    <Keyboard className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-500">在线</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 收缩状态的简化显示 */}
        {collapsed && !isMobile && (
          <div className="flex flex-col items-center space-y-3">
            <img src="/images/yanyu-cloud-3d-logo.png" alt="言语云" className="w-8 h-8 object-contain" />
            <ThemeToggle />
          </div>
        )}
      </div>

      {/* 键盘帮助提示 */}
      <AnimatePresence>
        {showKeyboardHelp && (!collapsed || isMobile) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 py-2 bg-sky-50 dark:bg-gray-800 border-b border-sky-200 dark:border-gray-600"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-sky-700 dark:text-sky-300">键盘导航</span>
              <Button variant="ghost" size="sm" onClick={() => setShowKeyboardHelp(false)} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-xs text-sky-600 dark:text-sky-400 space-y-1">
              <div>↑↓ 导航 | ←→ 展开/收缩</div>
              <div>Enter 选择 | / 搜索 | Esc 退出</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 导航菜单 */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredItems.map((item, index) => renderNavigationItem(item, 0, index))}
      </nav>

      {/* 底部用户信息 */}
      <div className="p-4 border-t border-slate-200 dark:border-gray-700">
        <AnimatePresence>
          {(!collapsed || isMobile) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              {/* 用户信息 */}
              <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-gray-800 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/images/yanyu-cloud-3d-logo.png" />
                  <AvatarFallback>管</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">管理员</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">admin@yanyu.cloud</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>

              {/* 底部操作按钮 */}
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="flex-1 mr-1">
                  <Settings className="h-4 w-4 mr-2" />
                  设置
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 ml-1">
                  <LogOut className="h-4 w-4 mr-2" />
                  退出
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 收缩状态的用户头像 */}
        {collapsed && !isMobile && (
          <div className="flex justify-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/images/yanyu-cloud-3d-logo.png" />
              <AvatarFallback>管</AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </motion.div>
  )
}
