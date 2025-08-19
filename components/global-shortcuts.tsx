"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Users,
  CheckSquare,
  BarChart3,
  DollarSign,
  MessageSquare,
  Settings,
  FileText,
  Target,
  Brain,
  Keyboard,
  Command,
} from "lucide-react"

interface Shortcut {
  key: string
  description: string
  action: () => void
  category: "导航" | "功能" | "系统"
  icon: React.ReactNode
}

export function GlobalShortcuts() {
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const shortcuts: Shortcut[] = [
    // 导航快捷键
    {
      key: "Ctrl+1",
      description: "打开仪表盘",
      action: () => router.push("/"),
      category: "导航",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      key: "Ctrl+2",
      description: "打开客户管理",
      action: () => router.push("/customers"),
      category: "导航",
      icon: <Users className="w-4 h-4" />,
    },
    {
      key: "Ctrl+3",
      description: "打开任务管理",
      action: () => router.push("/tasks"),
      category: "导航",
      icon: <CheckSquare className="w-4 h-4" />,
    },
    {
      key: "Ctrl+4",
      description: "打开财务管理",
      action: () => router.push("/finance"),
      category: "导航",
      icon: <DollarSign className="w-4 h-4" />,
    },
    // 功能快捷键
    {
      key: "Ctrl+Shift+N",
      description: "新建客户",
      action: () => console.log("新建客户"),
      category: "功能",
      icon: <Users className="w-4 h-4" />,
    },
    {
      key: "Ctrl+Shift+T",
      description: "新建任务",
      action: () => console.log("新建任务"),
      category: "功能",
      icon: <CheckSquare className="w-4 h-4" />,
    },
    {
      key: "Ctrl+Shift+R",
      description: "生成报表",
      action: () => router.push("/reports"),
      category: "功能",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      key: "Ctrl+Shift+A",
      description: "AI分析",
      action: () => router.push("/ai"),
      category: "功能",
      icon: <Brain className="w-4 h-4" />,
    },
    // 系统快捷键
    {
      key: "Ctrl+K",
      description: "打开搜索",
      action: () => setSearchOpen(true),
      category: "系统",
      icon: <Search className="w-4 h-4" />,
    },
    {
      key: "Ctrl+/",
      description: "显示快捷键帮助",
      action: () => setHelpOpen(true),
      category: "系统",
      icon: <Keyboard className="w-4 h-4" />,
    },
    {
      key: "Ctrl+,",
      description: "打开设置",
      action: () => router.push("/system/settings"),
      category: "系统",
      icon: <Settings className="w-4 h-4" />,
    },
  ]

  // 搜索功能的快速导航选项
  const quickActions = [
    { label: "客户管理", path: "/customers", icon: <Users className="w-4 h-4" /> },
    { label: "任务管理", path: "/tasks", icon: <CheckSquare className="w-4 h-4" /> },
    { label: "数据分析", path: "/analytics", icon: <BarChart3 className="w-4 h-4" /> },
    { label: "财务管理", path: "/finance", icon: <DollarSign className="w-4 h-4" /> },
    { label: "沟通协作", path: "/communication", icon: <MessageSquare className="w-4 h-4" /> },
    { label: "报表中心", path: "/reports", icon: <FileText className="w-4 h-4" /> },
    { label: "指标监控", path: "/kpi", icon: <Target className="w-4 h-4" /> },
    { label: "AI分析", path: "/ai", icon: <Brain className="w-4 h-4" /> },
  ]

  const filteredActions = quickActions.filter((action) =>
    action.label.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const groupedShortcuts = shortcuts.reduce(
    (acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = []
      }
      acc[shortcut.category].push(shortcut)
      return acc
    },
    {} as Record<string, Shortcut[]>,
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 检查是否在输入框中
      const target = event.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.contentEditable === "true") {
        return
      }

      const shortcut = shortcuts.find((s) => {
        const keys = s.key.split("+")
        const ctrlKey = keys.includes("Ctrl")
        const shiftKey = keys.includes("Shift")
        const mainKey = keys[keys.length - 1]

        return (
          event.ctrlKey === ctrlKey &&
          event.shiftKey === shiftKey &&
          (event.key === mainKey || event.key === mainKey.toLowerCase())
        )
      })

      if (shortcut) {
        event.preventDefault()
        shortcut.action()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, []) // Removed shortcuts from the dependency array

  const handleQuickAction = (path: string) => {
    router.push(path)
    setSearchOpen(false)
    setSearchQuery("")
  }

  return (
    <>
      {/* 搜索对话框 */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Command className="w-5 h-5" />
              快速导航
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="搜索功能模块..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              autoFocus
            />
            <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {filteredActions.map((action) => (
                <Button
                  key={action.path}
                  variant="ghost"
                  className="justify-start h-12 p-3"
                  onClick={() => handleQuickAction(action.path)}
                >
                  {action.icon}
                  <span className="ml-2">{action.label}</span>
                </Button>
              ))}
            </div>
            {filteredActions.length === 0 && searchQuery && (
              <div className="text-center py-8 text-gray-500">未找到匹配的功能模块</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 快捷键帮助对话框 */}
      <Dialog open={helpOpen} onOpenChange={setHelpOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              快捷键帮助
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">{category}</h3>
                <div className="space-y-2">
                  {categoryShortcuts.map((shortcut) => (
                    <div
                      key={shortcut.key}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {shortcut.icon}
                        <span className="text-sm text-gray-700 dark:text-gray-300">{shortcut.description}</span>
                      </div>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {shortcut.key}
                      </Badge>
                    </div>
                  ))}
                </div>
                {category !== "系统" && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
