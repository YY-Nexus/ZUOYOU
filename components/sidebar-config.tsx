"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, Layout, Palette, Monitor, Smartphone, Tablet, Save, RotateCcw } from "lucide-react"

interface SidebarConfig {
  autoCollapse: boolean
  showLabels: boolean
  position: "left" | "right"
  width: number
  theme: "light" | "dark" | "auto"
  animation: boolean
  mobileBreakpoint: number
  tabletBreakpoint: number
}

const defaultConfig: SidebarConfig = {
  autoCollapse: true,
  showLabels: true,
  position: "left",
  width: 280,
  theme: "light",
  animation: true,
  mobileBreakpoint: 768,
  tabletBreakpoint: 1024,
}

export function SidebarConfig() {
  const [config, setConfig] = useState<SidebarConfig>(defaultConfig)
  const [isMounted, setIsMounted] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== "undefined") {
      const savedConfig = localStorage.getItem("sidebar_config")
      if (savedConfig) {
        try {
          setConfig(JSON.parse(savedConfig))
        } catch (error) {
          console.error("加载侧边栏配置失败:", error)
        }
      }
    }
  }, [])

  const updateConfig = (key: keyof SidebarConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const saveConfig = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar_config", JSON.stringify(config))
      setHasChanges(false)

      // 触发全局配置更新事件
      window.dispatchEvent(
        new CustomEvent("sidebarConfigUpdate", {
          detail: config,
        }),
      )
    }
  }

  const resetConfig = () => {
    setConfig(defaultConfig)
    setHasChanges(true)
  }

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-sky-600" />
          <h2 className="text-xl font-semibold text-gray-900">侧边栏配置</h2>
        </div>
        {hasChanges && (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            有未保存的更改
          </Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 基本设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Layout className="w-4 h-4" />
              <span>基本设置</span>
            </CardTitle>
            <CardDescription>配置侧边栏的基本行为和外观</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-collapse">自动收缩</Label>
              <Switch
                id="auto-collapse"
                checked={config.autoCollapse}
                onCheckedChange={(checked) => updateConfig("autoCollapse", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show-labels">显示标签</Label>
              <Switch
                id="show-labels"
                checked={config.showLabels}
                onCheckedChange={(checked) => updateConfig("showLabels", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="animation">启用动画</Label>
              <Switch
                id="animation"
                checked={config.animation}
                onCheckedChange={(checked) => updateConfig("animation", checked)}
              />
            </div>

            <div className="space-y-2">
              <Label>位置</Label>
              <Select
                value={config.position}
                onValueChange={(value: "left" | "right") => updateConfig("position", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">左侧</SelectItem>
                  <SelectItem value="right">右侧</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 外观设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>外观设置</span>
            </CardTitle>
            <CardDescription>自定义侧边栏的视觉样式</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>主题</Label>
              <Select
                value={config.theme}
                onValueChange={(value: "light" | "dark" | "auto") => updateConfig("theme", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">浅色</SelectItem>
                  <SelectItem value="dark">深色</SelectItem>
                  <SelectItem value="auto">自动</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>宽度: {config.width}px</Label>
              <Slider
                value={[config.width]}
                onValueChange={([value]) => updateConfig("width", value)}
                min={200}
                max={400}
                step={20}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* 响应式设置 */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Monitor className="w-4 h-4" />
              <span>响应式断点</span>
            </CardTitle>
            <CardDescription>配置不同设备尺寸下的侧边栏行为</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>移动端断点: {config.mobileBreakpoint}px</span>
                </Label>
                <Slider
                  value={[config.mobileBreakpoint]}
                  onValueChange={([value]) => updateConfig("mobileBreakpoint", value)}
                  min={320}
                  max={1024}
                  step={16}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-2">
                  <Tablet className="w-4 h-4" />
                  <span>平板端断点: {config.tabletBreakpoint}px</span>
                </Label>
                <Slider
                  value={[config.tabletBreakpoint]}
                  onValueChange={([value]) => updateConfig("tabletBreakpoint", value)}
                  min={768}
                  max={1440}
                  step={16}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid gap-2 text-sm text-gray-600">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>移动端 (&lt; {config.mobileBreakpoint}px)</span>
                <Badge variant="outline">抽屉模式</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>
                  平板端 ({config.mobileBreakpoint}px - {config.tabletBreakpoint}px)
                </span>
                <Badge variant="outline">可收缩</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>桌面端 (&gt; {config.tabletBreakpoint}px)</span>
                <Badge variant="outline">完整显示</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={resetConfig} className="flex items-center space-x-2 bg-transparent">
          <RotateCcw className="w-4 h-4" />
          <span>重置为默认</span>
        </Button>

        <Button
          onClick={saveConfig}
          disabled={!hasChanges}
          className="flex items-center space-x-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
        >
          <Save className="w-4 h-4" />
          <span>保存配置</span>
        </Button>
      </div>
    </div>
  )
}
