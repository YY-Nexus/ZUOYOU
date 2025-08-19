"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import {
  Bell,
  Search,
  Menu,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  MessageSquare,
  Save,
  Shield,
  Key,
  Eye,
  EyeOff,
  Smartphone,
  Lock,
  AlertTriangle,
  CheckCircle,
  Palette,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { QuickActionHandler } from "@/components/quick-action-handler"
import { AvatarUpload } from "@/components/avatar-upload"
import { useRouter } from "next/navigation"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  timestamp: Date
  read: boolean
  category: string
  actionUrl?: string
}

interface UserProfile {
  name: string
  email: string
  phone: string
  department: string
  position: string
  avatar: string
  bio: string
  location: string
  website: string
  joinDate: string
  lastLogin: string
  status: "online" | "offline" | "away"
}

interface HeaderProps {
  className?: string
  activeModule?: string
  onMenuClick?: () => void
  isMobile?: boolean
}

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function Header({ className, activeModule, onMenuClick, isMobile = false }: HeaderProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [language, setLanguage] = useState("zh")
  const [isOnline, setIsOnline] = useState(true)
  const [unreadNotifications, setUnreadNotifications] = useState(5)
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [menuButtonPressed, setMenuButtonPressed] = useState(false)
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string; timestamp: Date }>
  >([
    {
      role: "assistant",
      content:
        "您好！我是智能客服助手，可以帮助您解答系统使用问题、提供功能操作指导、处理技术支持请求。有什么可以帮助您的吗？",
      timestamp: new Date(),
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loginNotifications, setLoginNotifications] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "您好！我是您的智能聊天机器人，有什么可以帮助您的吗？",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "管理员",
    email: "admin@yanyu.cloud",
    phone: "138-0000-0000",
    department: "客户服务部",
    position: "客服主管",
    avatar: "/images/yanyu-cloud-3d-logo.png",
    bio: "负责客户关怀中心的日常运营和客户服务管理工作",
    location: "北京市朝阳区",
    website: "https://yanyu.cloud",
    joinDate: "2023-01-15",
    lastLogin: new Date().toISOString(),
    status: "online",
  })

  const notificationsData = [
    { id: 1, title: "新客户注册", message: "张三刚刚注册了账户", time: "2分钟前", unread: true },
    { id: 2, title: "任务提醒", message: "项目A的截止日期临近", time: "10分钟前", unread: true },
    { id: 3, title: "系统更新", message: "系统将在今晚进行维护", time: "1小时前", unread: false },
  ]

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "客户满意度提升",
      message: "本月客户满意度达到98.5%，较上月提升2.3%",
      type: "success",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      category: "客户服务",
      actionUrl: "/analytics/satisfaction",
    },
    {
      id: "2",
      title: "新客户咨询",
      message: '客户"北京科技有限公司"提交了服务咨询，等待处理',
      type: "info",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: false,
      category: "客户",
      actionUrl: "/customers",
    },
    {
      id: "3",
      title: "服务工单提醒",
      message: "您有5个服务工单将在24小时内到期，请及时处理",
      type: "warning",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
      category: "工单",
      actionUrl: "/tasks",
    },
    {
      id: "4",
      title: "客户数据同步完成",
      message: "今日客户数据同步已成功完成，共处理2,345条记录",
      type: "success",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      read: true,
      category: "系统",
    },
    {
      id: "5",
      title: "服务质量警告",
      message: "检测到客户投诉增加，请关注服务质量",
      type: "error",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      read: false,
      category: "质量",
      actionUrl: "/quality/complaints",
    },
  ])

  const unreadCount = notificationsData.filter((n) => n.unread).length

  // 时间更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // 网络状态监听
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // 全屏状态监听
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // 加载保存的设置
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile)
        setUserProfile((prev) => ({
          ...prev,
          ...profile,
          avatar: profile.avatar || "/images/yanyu-cloud-3d-logo.png",
        }))
      } catch (error) {
        console.error("加载用户资料失败:", error)
      }
    }

    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }

    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // 处理菜单按钮点击
  const handleMenuClick = () => {
    setMenuButtonPressed(true)

    // 触觉反馈（如果支持）
    if (navigator.vibrate && isMobile) {
      navigator.vibrate(50)
    }

    onMenuClick?.()

    // 重置按钮状态
    setTimeout(() => {
      setMenuButtonPressed(false)
    }, 150)
  }

  // 刷新页面
  const handleRefresh = () => {
    window.location.reload()
  }

  // 切换主题
  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    document.documentElement.classList.toggle("dark", newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("主题已切换", {
        body: `已切换到${newTheme ? "暗色" : "亮色"}模式`,
        icon: "/images/yanyu-cloud-3d-logo.png",
      })
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // 这里可以添加实际的主题切换逻辑
  }

  // 切换语言
  const toggleLanguage = () => {
    const newLang = language === "zh" ? "en" : "zh"
    setLanguage(newLang)
    localStorage.setItem("language", newLang)

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("语言已切换", {
        body: `Language switched to ${newLang === "zh" ? "中文" : "English"}`,
        icon: "/images/yanyu-cloud-3d-logo.png",
      })
    }
  }

  // 切换静音
  const toggleMute = () => {
    setIsMuted(!isMuted)
    localStorage.setItem("soundMuted", (!isMuted).toString())

    if (!isMuted) {
      const audio = new Audio("/sounds/mute.mp3")
      audio.play().catch(() => {
        // 忽略播放失败
      })
    }
  }

  // 切换全屏
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("无法进入全屏模式:", err)
      })
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("无法退出全屏模式:", err)
      })
    }
  }

  // 搜索功能
  const handleSearch = (query: string) => {
    if (!query.trim()) return

    console.log("搜索:", query)

    const searchRoutes: Record<string, string> = {
      客户: "/customers",
      工单: "/tasks",
      服务: "/services",
      报表: "/reports",
      分析: "/analytics",
      设置: "/settings",
      用户: "/users",
      权限: "/permissions",
    }

    const route =
      searchRoutes[query] || searchRoutes[Object.keys(searchRoutes).find((key) => query.includes(key)) || ""]

    if (route) {
      router.push(route)
      setSearchQuery("")
    }
  }

  // 处理通知点击
  const handleNotificationClick = (notification: Notification) => {
    setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)))
    setUnreadNotifications((prev) => Math.max(0, prev - 1))

    if (notification.actionUrl) {
      router.push(notification.actionUrl)
      setIsNotificationOpen(false)
    }
  }

  // 清除所有通知
  const clearAllNotifications = () => {
    setNotifications([])
    setUnreadNotifications(0)
  }

  // 标记所有通知为已读
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadNotifications(0)
  }

  // 发送聊天消息
  const sendChatMessage = () => {
    if (!newMessage.trim()) return

    const userMessage = {
      role: "user" as const,
      content: newMessage,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    setTimeout(() => {
      const responses = [
        "我理解您的问题，让我为您查找相关信息...",
        "根据您的描述，建议您检查以下几个方面：",
        "这个问题通常是由以下原因造成的：",
        "我已经为您找到了解决方案，请按以下步骤操作：",
        "如果问题仍然存在，建议您联系技术支持团队。",
      ]

      const assistantMessage = {
        role: "assistant" as const,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  // 个人资料更新
  const handleProfileUpdate = (field: keyof UserProfile, value: string) => {
    setUserProfile((prev) => {
      const updated = { ...prev, [field]: value }
      localStorage.setItem("userProfile", JSON.stringify(updated))
      return updated
    })
  }

  // 头像更新
  const handleAvatarUpdate = (newAvatar: string) => {
    handleProfileUpdate("avatar", newAvatar)
  }

  // 密码更新
  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("请填写所有密码字段")
      return
    }

    if (newPassword !== confirmPassword) {
      alert("新密码和确认密码不匹配")
      return
    }

    if (newPassword.length < 8) {
      alert("新密码长度至少为8位")
      return
    }

    console.log("更新密码")
    alert("密码更新成功")

    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem("userProfile")
    localStorage.removeItem("userSettings")
    localStorage.removeItem("authToken")

    console.log("用户退出登录")
    window.location.href = "/login"
  }

  // 获取通知类型图标
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Bell className="w-4 h-4 text-blue-500" />
    }
  }

  // 格式化时间 - 修改为指定格式
  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "刚刚"
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString("zh-CN")
  }

  // 格式化当前时间为指定格式：2025/07/03 四 16:28
  const formatCurrentTime = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"]
    const weekday = weekdays[date.getDay()]
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")

    return `${year}/${month}/${day} ${weekday} ${hours}:${minutes}`
  }

  const sendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // 模拟AI回复
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "感谢您的咨询！我正在为您查找相关信息，请稍等片刻...",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const getModuleTitle = (module?: string) => {
    const moduleMap: Record<string, string> = {
      dashboard: "仪表盘",
      customers: "客户管理",
      tasks: "任务管理",
      finance: "财务管理",
      okr: "OKR管理",
      kpi: "KPI跟踪",
      reports: "报表分析",
      communication: "沟通协作",
      ai: "AI分析",
      analytics: "数据分析",
      approval: "审批管理",
      system: "系统管理",
      test: "测试中心",
      enterprise: "企业功能",
      training: "培训推广",
      feedback: "反馈监控",
      profile: "用户中心",
    }
    return moduleMap[module || "dashboard"] || "企业管理系统"
  }

  return (
    <>
      <Card className={cn("border-0 shadow-sm bg-white/95 backdrop-blur-sm dark:bg-gray-800", className)}>
        <CardContent className="p-0">
          <header
            className={cn(
              "flex items-center justify-between border-b border-slate-200 dark:border-gray-700",
              isMobile ? "h-14 px-4" : "h-16 px-6",
            )}
          >
            {/* 左侧区域 */}
            <div className="flex items-center space-x-3">
              {/* 增强的移动端菜单按钮 */}
              <Button
                variant="ghost"
                size={isMobile ? "default" : "sm"}
                onClick={handleMenuClick}
                className={cn(
                  "transition-all duration-200 relative overflow-hidden",
                  "hover:bg-sky-50 hover:text-sky-600 active:scale-95",
                  isMobile && "h-10 w-10 p-0",
                  menuButtonPressed && "scale-95 bg-sky-100",
                )}
              >
                {/* 按钮背景动画 */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-r from-sky-400/20 to-blue-500/20 rounded-lg opacity-0 transition-opacity duration-200",
                    menuButtonPressed && "opacity-100",
                  )}
                />

                <Menu
                  className={cn(
                    "relative z-10 transition-transform duration-200",
                    isMobile ? "h-5 w-5" : "h-4 w-4",
                    menuButtonPressed && "rotate-90",
                  )}
                />

                {/* 移动端触摸反馈圆圈 */}
                {isMobile && menuButtonPressed && (
                  <div className="absolute inset-0 rounded-full bg-sky-200/50 animate-ping" />
                )}
              </Button>

              {/* 当前模块标题 */}
              <div className={cn(isMobile ? "hidden" : "block")}>
                <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                  {getModuleTitle(activeModule)}
                </h1>
              </div>

              {/* 移动端显示简化标题 */}
              {isMobile && (
                <div>
                  <h1 className="text-base font-semibold text-slate-800 dark:text-slate-200">言语云</h1>
                </div>
              )}
            </div>

            {/* 中间搜索区域 */}
            <div className={cn("flex-1 mx-4", isMobile ? "max-w-none" : "max-w-md")}>
              <div className="relative">
                <Search
                  className={cn(
                    "absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400",
                    isMobile ? "h-4 w-4" : "h-4 w-4",
                  )}
                />
                <Input
                  type="text"
                  placeholder={isMobile ? "搜索..." : "搜索功能、客户、任务..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "pl-10 pr-4 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 transition-colors",
                    isMobile ? "h-9 text-sm" : "h-9",
                  )}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />

                {/* 移动端搜索焦点指示器 */}
                {isMobile && isSearchFocused && (
                  <div className="absolute inset-0 rounded-md border-2 border-sky-300 pointer-events-none animate-pulse" />
                )}
              </div>
            </div>

            {/* 右侧操作区域 */}
            <div className={cn("flex items-center", isMobile ? "space-x-1" : "space-x-2")}>
              {/* 桌面端显示更多按钮 */}
              {!isMobile && (
                <>
                  {/* 帮助按钮 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-sky-50 hover:text-sky-600 transition-colors"
                    onClick={() => setIsHelpOpen(true)}
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>

                  {/* 消息按钮 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-sky-50 hover:text-sky-600 transition-colors"
                    onClick={() => setIsCustomerServiceOpen(true)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>

                  {/* 主题切换按钮 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleDarkMode}
                    className="hover:bg-sky-50 hover:text-sky-600 transition-colors"
                  >
                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>

                  {/* 语言切换按钮 */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLanguage}
                    className="hover:bg-sky-50 hover:text-sky-600 transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* 通知按钮 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size={isMobile ? "default" : "sm"}
                    className={cn(
                      "relative hover:bg-sky-50 hover:text-sky-600 transition-colors",
                      isMobile && "h-10 w-10 p-0",
                    )}
                  >
                    <Bell className={cn(isMobile ? "h-5 w-5" : "h-4 w-4")} />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className={cn(
                          "absolute -top-1 -right-1 text-xs p-0 flex items-center justify-center animate-pulse",
                          isMobile ? "h-5 w-5" : "h-4 w-4",
                        )}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={cn(isMobile ? "w-72" : "w-80")}>
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>通知中心</span>
                    <Badge variant="secondary">{unreadCount} 未读</Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className={cn(isMobile ? "max-h-60" : "max-h-64", "overflow-y-auto")}>
                    {notificationsData.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
                        <div className="flex items-center justify-between w-full">
                          <span className={cn("font-medium", isMobile ? "text-sm" : "text-sm")}>
                            {notification.title}
                          </span>
                          <span className={cn("text-slate-500", isMobile ? "text-xs" : "text-xs")}>
                            {notification.time}
                          </span>
                        </div>
                        <p className={cn("text-slate-600 mt-1", isMobile ? "text-sm" : "text-sm")}>
                          {notification.message}
                        </p>
                        {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>}
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 用户菜单 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "rounded-full transition-all duration-200 hover:scale-105",
                      isMobile ? "h-10 w-10" : "h-8 w-8",
                    )}
                  >
                    <Avatar className={cn(isMobile ? "h-9 w-9" : "h-8 w-8")}>
                      <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt="用户头像" />
                      <AvatarFallback className="bg-sky-100 text-sky-700 text-sm font-semibold">
                        {userProfile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={cn(isMobile ? "w-64" : "w-56")} align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className={cn("font-medium leading-none", isMobile ? "text-base" : "text-sm")}>
                        {userProfile.name}
                      </p>
                      <p className={cn("leading-none text-slate-500", isMobile ? "text-sm" : "text-xs")}>
                        {userProfile.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                    <User className={cn("mr-2", isMobile ? "h-5 w-5" : "h-4 w-4")} />
                    <span>个人资料</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <Settings className={cn("mr-2", isMobile ? "h-5 w-5" : "h-4 w-4")} />
                    <span>系统设置</span>
                  </DropdownMenuItem>

                  {/* 移动端额外选项 */}
                  {isMobile && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setIsHelpOpen(true)}>
                        <HelpCircle className="mr-2 h-5 w-5" />
                        <span>帮助中心</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsCustomerServiceOpen(true)}>
                        <MessageSquare className="mr-2 h-5 w-5" />
                        <span>智能客服</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={toggleDarkMode}>
                        {isDarkMode ? <Sun className="mr-2 h-5 w-5" /> : <Moon className="mr-2 h-5 w-5" />}
                        <span>{isDarkMode ? "亮色模式" : "暗色模式"}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={toggleLanguage}>
                        <Globe className="mr-2 h-5 w-5" />
                        <span>{language === "zh" ? "English" : "中文"}</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={() => setIsLogoutDialogOpen(true)}>
                    <LogOut className={cn("mr-2", isMobile ? "h-5 w-5" : "h-4 w-4")} />
                    <span>退出登录</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
        </CardContent>
      </Card>

      {/* 个人资料对话框 */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle>个人资料管理</DialogTitle>
            <DialogDescription>查看和编辑您的个人信息</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="profile">基本信息</TabsTrigger>
              <TabsTrigger value="avatar">头像设置</TabsTrigger>
              <TabsTrigger value="security">安全设置</TabsTrigger>
              <TabsTrigger value="preferences">偏好设置</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">姓名 *</Label>
                    <Input
                      id="name"
                      value={userProfile.name}
                      onChange={(e) => handleProfileUpdate("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">邮箱 *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => handleProfileUpdate("email", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">电话</Label>
                    <Input
                      id="phone"
                      value={userProfile.phone}
                      onChange={(e) => handleProfileUpdate("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">所在地区</Label>
                    <Input
                      id="location"
                      value={userProfile.location}
                      onChange={(e) => handleProfileUpdate("location", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">部门</Label>
                    <Input
                      id="department"
                      value={userProfile.department}
                      onChange={(e) => handleProfileUpdate("department", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">职位</Label>
                    <Input
                      id="position"
                      value={userProfile.position}
                      onChange={(e) => handleProfileUpdate("position", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">个人网站</Label>
                    <Input
                      id="website"
                      type="url"
                      value={userProfile.website}
                      onChange={(e) => handleProfileUpdate("website", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">入职日期</Label>
                    <Input
                      id="joinDate"
                      type="date"
                      value={userProfile.joinDate}
                      onChange={(e) => handleProfileUpdate("joinDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">个人简介</Label>
                <Textarea
                  id="bio"
                  placeholder="请输入个人简介..."
                  value={userProfile.bio}
                  onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => setIsProfileOpen(false)}>
                  <Save className="w-4 h-4 mr-2" />
                  保存更改
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="avatar" className="space-y-4">
              <AvatarUpload
                currentAvatar={userProfile.avatar}
                onAvatarUpdate={handleAvatarUpdate}
                userName={userProfile.name}
              />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Key className="w-4 h-4 mr-2" />
                    密码设置
                  </CardTitle>
                  <CardDescription>修改您的登录密码</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">当前密码</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="请输入当前密码"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">新密码</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="请输入新密码"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">确认新密码</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="请再次输入新密码"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handlePasswordUpdate} className="w-full">
                    <Lock className="w-4 h-4 mr-2" />
                    更新密码
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    安全选项
                  </CardTitle>
                  <CardDescription>管理您的账户安全设置</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-base">双因素认证</div>
                      <div className="text-sm text-muted-foreground">为您的账户添加额外的安全保护</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                      <Smartphone className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-base">登录通知</div>
                      <div className="text-sm text-muted-foreground">当有新设备登录时通知您</div>
                    </div>
                    <Switch checked={loginNotifications} onCheckedChange={setLoginNotifications} />
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-base">最后登录</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(userProfile.lastLogin).toLocaleString("zh-CN")}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        查看登录历史
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Palette className="w-4 h-4 mr-2" />
                    界面设置
                  </CardTitle>
                  <CardDescription>自定义您的界面外观</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-base">深色模式</div>
                      <div className="text-sm text-muted-foreground">切换到深色主题</div>
                    </div>
                    <Switch checked={isDarkMode} onCheckedChange={toggleTheme} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-base">语言设置</div>
                      <div className="text-sm text-muted-foreground">选择界面语言</div>
                    </div>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zh">中文</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Bell className="w-4 h-4 mr-2" />
                    通知偏好
                  </CardTitle>
                  <CardDescription>管理您的通知设置</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-base">桌面通知</div>
                      <div className="text-sm text-muted-foreground">在浏览器中显示通知</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-base">邮件通知</div>
                      <div className="text-sm text-muted-foreground">发送邮件提醒</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-base">声音提醒</div>
                      <div className="text-sm text-muted-foreground">播放提示音</div>
                    </div>
                    <Switch checked={!isMuted} onCheckedChange={() => toggleMute()} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* 退出登录确认对话框 */}
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <LogOut className="w-5 h-5 mr-2 text-red-500" />
              确认退出登录
            </AlertDialogTitle>
            <AlertDialogDescription>
              您确定要退出登录吗？退出后需要重新输入用户名和密码才能访问系统。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
              确认退出
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <QuickActionHandler />
    </>
  )
}
