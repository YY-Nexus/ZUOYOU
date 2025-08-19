"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
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
  ChevronDown,
  Building2,
  TrendingUp,
  Bell,
  Plus,
  Upload,
  RefreshCw,
  Zap,
  ImageIcon,
  Video,
  PieChart,
  Calculator,
  Receipt,
  CreditCard,
  UserCheck,
  Monitor,
  MessageCircle,
  GraduationCap,
  BookOpen,
  Megaphone,
  User,
  LogIn,
  Briefcase,
  Activity,
} from "lucide-react"

interface MenuItem {
  title: string
  icon: any
  href?: string
  badge?: string
  children?: MenuItem[]
  isExpanded?: boolean
}

interface SidebarProps {
  className?: string
  collapsed?: boolean
  activeModule?: string
  setActiveModule?: (module: string) => void
  isMobile?: boolean
  onItemClick?: () => void
}

export function Sidebar({
  className,
  collapsed = false,
  activeModule,
  setActiveModule,
  isMobile = false,
  onItemClick,
}: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const menuItems: MenuItem[] = [
    {
      title: "仪表盘",
      icon: Home,
      href: "/",
    },
    {
      title: "客户管理",
      icon: Users,
      href: "/customers",
      badge: "12",
    },
    {
      title: "任务管理",
      icon: CheckSquare,
      href: "/tasks",
      badge: "5",
    },
    {
      title: "财务管理",
      icon: DollarSign,
      children: [
        { title: "财务概览", icon: PieChart, href: "/finance" },
        { title: "预算管理", icon: Calculator, href: "/finance/budget" },
        { title: "发票管理", icon: Receipt, href: "/finance/invoices" },
        { title: "支付管理", icon: CreditCard, href: "/finance/payments" },
        { title: "财务报表", icon: BarChart3, href: "/finance/reports" },
      ],
    },
    {
      title: "OKR管理",
      icon: Target,
      href: "/okr",
    },
    {
      title: "KPI跟踪",
      icon: TrendingUp,
      href: "/kpi",
    },
    {
      title: "报表分析",
      icon: FileText,
      href: "/reports",
    },
    {
      title: "沟通协作",
      icon: MessageSquare,
      badge: "3",
      children: [
        { title: "沟通概览", icon: MessageSquare, href: "/communication" },
        { title: "实时聊天", icon: MessageSquare, href: "/communication/chat" },
        { title: "会议管理", icon: Video, href: "/communication/meetings" },
        { title: "文档协作", icon: FileText, href: "/communication/documents" },
        { title: "通知中心", icon: Bell, href: "/communication/notifications" },
        { title: "视频通话", icon: Video, href: "/communication/video" },
        { title: "文件传输", icon: Upload, href: "/communication/files" },
      ],
    },
    {
      title: "AI分析",
      icon: Brain,
      badge: "NEW",
      children: [
        { title: "AI概览", icon: Brain, href: "/ai" },
        { title: "客户数据分析", icon: Users, href: "/ai/customer-data" },
        { title: "智能表单", icon: ImageIcon, href: "/ai/smart-forms" },
        { title: "内容创作", icon: BookOpen, href: "/ai/content-creation" },
        { title: "移动AI助手", icon: Smartphone, href: "/ai/mobile" },
        { title: "预测分析", icon: TrendingUp, href: "/analytics/predictive" },
      ],
    },
    {
      title: "数据分析",
      icon: BarChart3,
      children: [
        { title: "分析概览", icon: BarChart3, href: "/analytics" },
        { title: "销售分析", icon: TrendingUp, href: "/analytics/sales" },
        { title: "客户分析", icon: Users, href: "/analytics/customers" },
        { title: "性能分析", icon: Activity, href: "/analytics/performance" },
        { title: "完整性分析", icon: CheckSquare, href: "/analytics/completeness" },
      ],
    },
    {
      title: "审批管理",
      icon: UserCheck,
      href: "/approval",
      badge: "2",
    },
    {
      title: "系统管理",
      icon: Settings,
      children: [
        { title: "系统概览", icon: Monitor, href: "/overview" },
        { title: "系统初始化", icon: RefreshCw, href: "/system/initialization" },
        { title: "数据库管理", icon: Database, href: "/system/database" },
        { title: "系统健康监控", icon: Activity, href: "/system/health" },
        { title: "性能优化", icon: Zap, href: "/performance" },
        { title: "安全审计", icon: Shield, href: "/audit" },
        { title: "多因素认证", icon: Shield, href: "/security/mfa" },
        { title: "侧边栏配置", icon: Settings, href: "/settings/sidebar" },
        { title: "布局设置", icon: ImageIcon, href: "/settings/layout" },
      ],
    },
    {
      title: "测试中心",
      icon: Monitor,
      href: "/test",
    },
    {
      title: "企业功能",
      icon: Briefcase,
      href: "/enterprise-features",
    },
    {
      title: "培训推广",
      icon: GraduationCap,
      children: [
        { title: "用户培训", icon: BookOpen, href: "/training" },
        { title: "推广系统", icon: Megaphone, href: "/promotion" },
      ],
    },
    {
      title: "反馈监控",
      icon: MessageCircle,
      children: [
        { title: "用户反馈", icon: MessageCircle, href: "/feedback" },
        { title: "生产监控", icon: Monitor, href: "/monitoring" },
      ],
    },
    {
      title: "用户中心",
      icon: User,
      children: [
        { title: "个人资料", icon: User, href: "/profile" },
        { title: "登录页面", icon: LogIn, href: "/login" },
      ],
    },
  ]

  const quickActions = [
    { title: "新建客户", icon: Plus, action: "create-customer" },
    { title: "创建任务", icon: CheckSquare, action: "create-task" },
    { title: "发送消息", icon: MessageSquare, action: "send-message" },
    { title: "生成报告", icon: FileText, action: "generate-report" },
  ]

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

  const toggleExpanded = (title: string) => {
    if (collapsed && !isMobile) return
    setExpandedItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  // 处理菜单项点击
  const handleItemClick = (item: MenuItem) => {
    if (item.href && setActiveModule) {
      const module = item.href.split("/")[1] || "dashboard"
      setActiveModule(module)
    }
    onItemClick?.()
  }

  // 处理快捷操作
  const handleQuickAction = (action: string) => {
    console.log("Quick action:", action)
    // 这里可以添加具体的快捷操作逻辑
    if (isMobile) {
      onItemClick?.()
    }
  }

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isExpanded = expandedItems.includes(item.title)
    const hasChildren = item.children && item.children.length > 0
    const isActive = item.href === pathname

    // 收缩状态下的桌面端显示
    if (collapsed && !isMobile && level === 0) {
      return (
        <div key={item.title} className="mb-1">
          {item.href ? (
            <Link href={item.href} title={item.title}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "w-full h-12 p-0 justify-center group relative",
                  "hover:bg-sky-50 hover:text-sky-600 transition-all duration-200",
                  "active:scale-95",
                  isActive && "bg-sky-100 text-sky-700 shadow-sm",
                )}
                onClick={() => handleItemClick(item)}
              >
                <item.icon className="h-5 w-5" />
                {/* 悬停提示 */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.title}
                </div>
              </Button>
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-12 p-0 justify-center hover:bg-sky-50 hover:text-sky-600 transition-colors group relative"
              title={item.title}
            >
              <item.icon className="h-5 w-5" />
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.title}
              </div>
            </Button>
          )}
        </div>
      )
    }

    return (
      <div key={item.title} className="mb-1">
        {item.href ? (
          <Link href={item.href}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "w-full justify-start text-left font-normal transition-all duration-200",
                "hover:bg-sky-50 hover:text-sky-600 hover:scale-[1.02]",
                "active:scale-95",
                "text-slate-700 dark:text-slate-300",
                // 移动端优化
                isMobile ? "h-12 px-4 text-base" : "h-10 px-3 text-sm",
                level > 0 && !isMobile && "ml-4 w-[calc(100%-1rem)]",
                level > 0 && isMobile && "ml-6 w-[calc(100%-1.5rem)]",
                isActive && "bg-sky-100 text-sky-700 shadow-sm dark:bg-sky-900 dark:text-sky-300",
              )}
              onClick={() => handleItemClick(item)}
            >
              <item.icon className={cn("flex-shrink-0", isMobile ? "mr-3 h-5 w-5" : "mr-2 h-4 w-4")} />
              <span className="flex-1 truncate">{item.title}</span>
              {item.badge && (
                <Badge variant="secondary" className={cn("ml-auto", isMobile ? "text-sm" : "text-xs")}>
                  {item.badge}
                </Badge>
              )}
            </Button>
          </Link>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full justify-start text-left font-normal transition-all duration-200",
              "hover:bg-sky-50 hover:text-sky-600 hover:scale-[1.02]",
              "active:scale-95",
              "text-slate-700 dark:text-slate-300",
              isMobile ? "h-12 px-4 text-base" : "h-10 px-3 text-sm",
              level > 0 && !isMobile && "ml-4 w-[calc(100%-1rem)]",
              level > 0 && isMobile && "ml-6 w-[calc(100%-1.5rem)]",
            )}
            onClick={() => hasChildren && toggleExpanded(item.title)}
          >
            <item.icon className={cn("flex-shrink-0", isMobile ? "mr-3 h-5 w-5" : "mr-2 h-4 w-4")} />
            <span className="flex-1 truncate">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className={cn("ml-auto mr-2", isMobile ? "text-sm" : "text-xs")}>
                {item.badge}
              </Badge>
            )}
            {hasChildren && !collapsed && (
              <div className="ml-auto">
                {isExpanded ? (
                  <ChevronDown className={cn(isMobile ? "h-4 w-4" : "h-3 w-3")} />
                ) : (
                  <ChevronRight className={cn(isMobile ? "h-4 w-4" : "h-3 w-3")} />
                )}
              </div>
            )}
          </Button>
        )}

        {hasChildren && isExpanded && !collapsed && (
          <div className="mt-1 space-y-1 animate-in slide-in-from-top-2 duration-200">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card
      className={cn(
        "h-full border-0 bg-white dark:bg-gray-800",
        isMobile ? "shadow-2xl rounded-none" : "shadow-lg",
        className,
      )}
    >
      <CardContent className="p-0 h-full">
        <div className="h-full flex flex-col">
          {/* 侧边栏头部 */}
          <div
            className={cn(
              "border-b border-gray-200 dark:border-gray-700 transition-all duration-200",
              isMobile ? "p-6" : "p-4",
              isScrolled && "shadow-sm",
            )}
          >
            {!collapsed || isMobile ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={cn(
                      "bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center",
                      isMobile ? "w-10 h-10" : "w-8 h-8",
                    )}
                  >
                    <Building2 className={cn("text-white", isMobile ? "h-6 w-6" : "h-5 w-5")} />
                  </div>
                  <div>
                    <h2
                      className={cn(
                        "font-semibold text-slate-800 dark:text-slate-200",
                        isMobile ? "text-base" : "text-sm",
                      )}
                    >
                      YYC³
                    </h2>
                    <p className={cn("text-slate-500 dark:text-slate-400", isMobile ? "text-sm" : "text-xs")}>
                      客户关怀中心
                    </p>
                  </div>
                </div>

                {/* 移动端关闭按钮 */}
                {isMobile && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={onItemClick}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* 快捷操作区域 */}
          {(!collapsed || isMobile) && (
            <div className={cn("border-b border-gray-200 dark:border-gray-700", isMobile ? "p-4" : "p-3")}>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.action}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action.action)}
                    className={cn(
                      "justify-start hover:bg-blue-50 hover:border-blue-200 transition-colors",
                      isMobile ? "h-10 text-sm" : "h-8 text-xs",
                    )}
                  >
                    <action.icon className={cn("mr-1", isMobile ? "w-4 h-4" : "w-3 h-3")} />
                    {action.title}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* 导航菜单 */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
              <div className={cn("space-y-1", isMobile ? "p-4" : "p-3")}>
                {!collapsed && (
                  <div className={cn("mb-4", isMobile ? "px-2 py-2" : "px-2 py-1")}>
                    <h3
                      className={cn(
                        "font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider",
                        isMobile ? "text-sm" : "text-xs",
                      )}
                    >
                      功能导航
                    </h3>
                  </div>
                )}
                {menuItems.map((item) => renderMenuItem(item))}
              </div>
            </ScrollArea>
          </div>

          {/* 侧边栏底部 */}
          {(!collapsed || isMobile) && (
            <div className={cn("border-t border-gray-200 dark:border-gray-700", isMobile ? "p-6" : "p-4")}>
              {/* 用户信息 */}
              <div className="flex items-center space-x-3 mb-3">
                <Avatar className={cn(isMobile ? "h-10 w-10" : "h-8 w-8")}>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="用户头像" />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">管理</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "font-medium text-gray-900 dark:text-gray-100 truncate",
                      isMobile ? "text-sm" : "text-xs",
                    )}
                  >
                    系统管理员
                  </p>
                  <p className={cn("text-gray-500 dark:text-gray-400 truncate", isMobile ? "text-sm" : "text-xs")}>
                    admin@yyc.com
                  </p>
                </div>
              </div>

              {/* 系统信息 */}
              <div className={cn("text-slate-500 dark:text-slate-400 text-center", isMobile ? "text-sm" : "text-xs")}>
                © 2024 言语云科技
              </div>

              {/* 移动端额外信息 */}
              {isMobile && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center space-x-4 text-xs text-slate-400">
                    <span>版本 v2.1.0</span>
                    <Separator orientation="vertical" className="h-3" />
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>在线 1,234</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
