"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSidebar } from "@/hooks/use-sidebar"
import {
  Home,
  Users,
  CheckSquare,
  DollarSign,
  BarChart3,
  MessageSquare,
  Settings,
  FileText,
  Target,
  Brain,
  Database,
  Shield,
  Smartphone,
  X,
  ChevronRight,
  Building2,
  TrendingUp,
  Calendar,
  Bell,
  Plus,
  Upload,
  RefreshCw,
  Zap,
  Edit,
  Image,
} from "lucide-react"

const navigationItems = [
  {
    title: "仪表板",
    href: "/",
    icon: Home,
    badge: null,
  },
  {
    title: "客户管理",
    href: "/customers",
    icon: Users,
    badge: "12",
  },
  {
    title: "任务管理",
    href: "/tasks",
    icon: CheckSquare,
    badge: "5",
  },
  {
    title: "财务管理",
    href: "/finance",
    icon: DollarSign,
    badge: null,
    children: [
      { title: "预算管理", href: "/finance/budget", icon: Target },
      { title: "发票管理", href: "/finance/invoices", icon: FileText },
      { title: "支付管理", href: "/finance/payments", icon: DollarSign },
      { title: "财务报告", href: "/finance/reports", icon: BarChart3 },
    ],
  },
  {
    title: "KPI 跟踪",
    href: "/kpi",
    icon: BarChart3,
    badge: null,
  },
  {
    title: "沟通协作",
    href: "/communication",
    icon: MessageSquare,
    badge: "3",
    children: [
      { title: "实时聊天", href: "/communication/chat", icon: MessageSquare },
      { title: "会议管理", href: "/communication/meetings", icon: Calendar },
      { title: "文档管理", href: "/communication/documents", icon: FileText },
      { title: "通知中心", href: "/communication/notifications", icon: Bell },
      { title: "视频通话", href: "/communication/video", icon: Image },
      { title: "文件传输", href: "/communication/files", icon: Upload },
    ],
  },
  {
    title: "AI 分析",
    href: "/ai",
    icon: Brain,
    badge: "NEW",
    children: [
      { title: "智能分析", href: "/ai/analysis", icon: TrendingUp },
      { title: "客户数据", href: "/ai/customer-data", icon: Users },
      { title: "智能表单", href: "/ai/smart-forms", icon: FileText },
      { title: "内容创作", href: "/ai/content-creation", icon: Edit },
      { title: "移动AI助手", href: "/ai/mobile", icon: Smartphone },
    ],
  },
  {
    title: "数据分析",
    href: "/analytics",
    icon: BarChart3,
    badge: null,
    children: [
      { title: "销售分析", href: "/analytics/sales", icon: TrendingUp },
      { title: "客户分析", href: "/analytics/customers", icon: Users },
      { title: "性能分析", href: "/analytics/performance", icon: Zap },
      { title: "预测分析", href: "/analytics/predictive", icon: Brain },
    ],
  },
  {
    title: "审批流程",
    href: "/approval",
    icon: CheckSquare,
    badge: "2",
  },
  {
    title: "报告中心",
    href: "/reports",
    icon: FileText,
    badge: null,
  },
  {
    title: "OKR 管理",
    href: "/okr",
    icon: Target,
    badge: null,
  },
  {
    title: "系统管理",
    href: "/system",
    icon: Settings,
    badge: null,
    children: [
      { title: "系统初始化", href: "/system/initialization", icon: RefreshCw },
      { title: "数据库管理", href: "/system/database", icon: Database },
      { title: "系统健康", href: "/system/health", icon: Shield },
    ],
  },
]

const quickActions = [
  { title: "新建客户", icon: Plus, action: "create-customer" },
  { title: "创建任务", icon: CheckSquare, action: "create-task" },
  { title: "发送消息", icon: MessageSquare, action: "send-message" },
  { title: "生成报告", icon: FileText, action: "generate-report" },
]

export function SidebarComponent() {
  const pathname = usePathname()
  const { isOpen, isMobile, closeSidebar } = useSidebar()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // 设置滚动事件监听器
  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]")

    if (!scrollElement) return

    const handleScroll = () => {
      const scrollTop = scrollElement.scrollTop
      setIsScrolled(scrollTop > 10)
    }

    scrollElement.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) => (prev.includes(href) ? prev.filter((item) => item !== href) : [...prev, href]))
  }

  const handleItemClick = () => {
    if (isMobile) {
      closeSidebar()
    }
  }

  const handleQuickAction = (action: string) => {
    console.log("Quick action:", action)
    // 这里可以添加具体的快捷操作逻辑
    if (isMobile) {
      closeSidebar()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* 移动端遮罩层 */}
      {isMobile && <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={closeSidebar} />}

      {/* 侧边栏主体 */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
          isMobile ? "w-80 shadow-2xl" : "w-64",
          "flex flex-col",
        )}
      >
        {/* 头部区域 */}
        <div
          className={cn(
            "flex items-center justify-between p-4 border-b transition-shadow duration-200",
            isScrolled ? "shadow-sm" : "border-gray-200",
          )}
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">YYC³</h2>
              <p className="text-xs text-gray-500">客户关怀中心</p>
            </div>
          </div>

          {/* 移动端关闭按钮 */}
          {isMobile && (
            <Button variant="ghost" size="sm" onClick={closeSidebar} className="h-8 w-8 p-0 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* 快捷操作区域 */}
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <Button
                key={action.action}
                variant="outline"
                size="sm"
                onClick={() => handleQuickAction(action.action)}
                className="h-8 text-xs justify-start hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <action.icon className="w-3 h-3 mr-1" />
                {action.title}
              </Button>
            ))}
          </div>
        </div>

        {/* 导航菜单 */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-3">
          <div className="space-y-1 py-4">
            {navigationItems.map((item) => (
              <div key={item.href}>
                {item.children ? (
                  <div>
                    <Button
                      variant="ghost"
                      onClick={() => toggleExpanded(item.href)}
                      className={cn(
                        "w-full justify-between h-10 px-3 text-left font-normal hover:bg-gray-100 transition-colors",
                        pathname.startsWith(item.href) && item.href !== "/"
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                          : "text-gray-700",
                      )}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-4 h-4 mr-3" />
                        <span className="text-sm">{item.title}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "ml-2 px-2 py-0.5 text-xs rounded-full",
                              item.badge === "NEW" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600",
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          expandedItems.includes(item.href) ? "rotate-90" : "",
                        )}
                      />
                    </Button>

                    {expandedItems.includes(item.href) && (
                      <div className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-4">
                        {item.children.map((child) => (
                          <Link key={child.href} href={child.href} onClick={handleItemClick}>
                            <Button
                              variant="ghost"
                              className={cn(
                                "w-full justify-start h-9 px-3 text-left font-normal hover:bg-gray-100 transition-colors",
                                pathname === child.href
                                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                                  : "text-gray-600",
                              )}
                            >
                              <child.icon className="w-3 h-3 mr-3" />
                              <span className="text-sm">{child.title}</span>
                            </Button>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href={item.href} onClick={handleItemClick}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-10 px-3 text-left font-normal hover:bg-gray-100 transition-colors",
                        pathname === item.href
                          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500"
                          : "text-gray-700",
                      )}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      <span className="text-sm">{item.title}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "ml-auto px-2 py-0.5 text-xs rounded-full",
                            item.badge === "NEW" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator />

        {/* 底部用户信息 */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="用户头像" />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">管理</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">系统管理员</p>
              <p className="text-xs text-gray-500 truncate">admin@yyc.com</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>版本 v1.0.0</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>在线 24</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
