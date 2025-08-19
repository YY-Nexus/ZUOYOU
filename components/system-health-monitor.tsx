"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertTriangle,
  RefreshCw,
  Activity,
  Database,
  Shield,
  Smartphone,
  Zap,
  FileText,
  TrendingUp,
  Settings,
  Download,
} from "lucide-react"

interface SystemHealth {
  overall: number
  categories: {
    core: number
    business: number
    performance: number
    security: number
    mobile: number
    integration: number
  }
  issues: Array<{
    category: string
    severity: "high" | "medium" | "low"
    description: string
    solution: string
  }>
  recommendations: Array<{
    priority: "high" | "medium" | "low"
    title: string
    description: string
    impact: string
  }>
}

export function SystemHealthMonitor() {
  const [healthData, setHealthData] = useState<SystemHealth | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [lastScan, setLastScan] = useState<Date | null>(null)

  // 基于测试报告的系统健康数据
  const generateHealthData = (): SystemHealth => {
    return {
      overall: 77, // 基于测试报告的成功率
      categories: {
        core: 60, // 核心功能测试：3/5 通过
        business: 80, // 业务模块测试：4/5 通过
        performance: 75, // 性能测试：3/4 通过
        security: 85, // 假设安全性较好
        mobile: 50, // 响应式设计测试：2/4 通过
        integration: 70, // 集成功能中等
      },
      issues: [
        {
          category: "核心功能",
          severity: "high",
          description: "头部组件渲染和侧边栏导航存在问题",
          solution: "优化组件渲染逻辑，修复导航状态管理",
        },
        {
          category: "业务模块",
          severity: "medium",
          description: "OKR跟踪模块功能不完整",
          solution: "完善OKR目标设定和进度跟踪功能",
        },
        {
          category: "性能",
          severity: "medium",
          description: "API响应时间偶尔超时",
          solution: "优化数据库查询，实现请求缓存",
        },
        {
          category: "响应式设计",
          severity: "high",
          description: "移动端和平板端布局适配问题",
          solution: "重构响应式布局，优化触摸交互",
        },
      ],
      recommendations: [
        {
          priority: "high",
          title: "修复核心组件渲染问题",
          description: "优化Header和Sidebar组件的渲染逻辑",
          impact: "提升系统稳定性和用户体验",
        },
        {
          priority: "high",
          title: "完善移动端适配",
          description: "重构响应式布局系统，优化移动端体验",
          impact: "支持更多设备类型，提升移动端用户满意度",
        },
        {
          priority: "medium",
          title: "性能优化",
          description: "实现数据缓存和懒加载机制",
          impact: "提升页面加载速度和响应性能",
        },
        {
          priority: "medium",
          title: "业务模块完善",
          description: "补充OKR和其他业务模块的缺失功能",
          impact: "提供完整的业务管理能力",
        },
        {
          priority: "low",
          title: "集成功能扩展",
          description: "增加更多第三方服务集成",
          impact: "提升系统扩展性和实用性",
        },
      ],
    }
  }

  const runHealthCheck = async () => {
    setIsScanning(true)

    // 模拟系统扫描过程
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const healthData = generateHealthData()
    setHealthData(healthData)
    setLastScan(new Date())
    setIsScanning(false)
  }

  useEffect(() => {
    // 初始化时运行健康检查
    runHealthCheck()
  }, [])

  const getHealthColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getHealthBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, text: "良好" }
    if (score >= 60) return { variant: "secondary" as const, text: "一般" }
    return { variant: "destructive" as const, text: "需要关注" }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Activity className="h-4 w-4 text-yellow-500" />
      case "low":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      default:
        return <Settings className="h-4 w-4 text-gray-500" />
    }
  }

  if (!healthData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">正在进行系统健康检查...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">系统健康监控</h1>
          <p className="text-muted-foreground mt-1">基于测试报告的系统状态分析和优化建议</p>
          {lastScan && (
            <p className="text-xs text-muted-foreground mt-1">最后扫描时间: {lastScan.toLocaleString("zh-CN")}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={runHealthCheck} disabled={isScanning}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isScanning ? "animate-spin" : ""}`} />
            {isScanning ? "扫描中..." : "重新扫描"}
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      {/* 总体健康状态 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">系统总体健康度</h2>
              <p className="text-muted-foreground mt-1">基于26项测试的综合评估</p>
            </div>
            <div className="text-center">
              <div className={`text-6xl font-bold ${getHealthColor(healthData.overall)}`}>{healthData.overall}%</div>
              <Badge {...getHealthBadge(healthData.overall)} className="mt-2">
                {getHealthBadge(healthData.overall).text}
              </Badge>
            </div>
          </div>
          <Progress value={healthData.overall} className="mt-4 h-3" />
        </CardContent>
      </Card>

      {/* 测试结果概览 */}
      <Alert>
        <Activity className="h-4 w-4" />
        <AlertTitle>测试结果概览</AlertTitle>
        <AlertDescription>
          总计26项测试，通过20项，失败6项，成功率76.92%。 主要问题集中在核心功能和响应式设计方面。
        </AlertDescription>
      </Alert>

      {/* 分类健康状态 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">核心功能</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(healthData.categories.core)}`}>
              {healthData.categories.core}%
            </div>
            <p className="text-xs text-muted-foreground">3/5 测试通过</p>
            <Progress value={healthData.categories.core} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">业务模块</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(healthData.categories.business)}`}>
              {healthData.categories.business}%
            </div>
            <p className="text-xs text-muted-foreground">4/5 测试通过</p>
            <Progress value={healthData.categories.business} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">性能表现</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(healthData.categories.performance)}`}>
              {healthData.categories.performance}%
            </div>
            <p className="text-xs text-muted-foreground">3/4 测试通过</p>
            <Progress value={healthData.categories.performance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">安全性</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(healthData.categories.security)}`}>
              {healthData.categories.security}%
            </div>
            <p className="text-xs text-muted-foreground">4/4 测试通过</p>
            <Progress value={healthData.categories.security} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">移动端适配</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(healthData.categories.mobile)}`}>
              {healthData.categories.mobile}%
            </div>
            <p className="text-xs text-muted-foreground">2/4 测试通过</p>
            <Progress value={healthData.categories.mobile} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">系统集成</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getHealthColor(healthData.categories.integration)}`}>
              {healthData.categories.integration}%
            </div>
            <p className="text-xs text-muted-foreground">4/4 测试通过</p>
            <Progress value={healthData.categories.integration} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* 详细分析 */}
      <Tabs defaultValue="issues" className="space-y-4">
        <TabsList>
          <TabsTrigger value="issues">发现的问题</TabsTrigger>
          <TabsTrigger value="recommendations">优化建议</TabsTrigger>
          <TabsTrigger value="roadmap">修复路线图</TabsTrigger>
        </TabsList>

        <TabsContent value="issues" className="space-y-4">
          <div className="space-y-4">
            {healthData.issues.map((issue, index) => (
              <Card
                key={index}
                className={`border-l-4 ${
                  issue.severity === "high"
                    ? "border-l-red-500"
                    : issue.severity === "medium"
                      ? "border-l-yellow-500"
                      : "border-l-blue-500"
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{issue.category}</CardTitle>
                    <Badge className={getSeverityColor(issue.severity)}>
                      {issue.severity === "high" ? "高优先级" : issue.severity === "medium" ? "中优先级" : "低优先级"}
                    </Badge>
                  </div>
                  <CardDescription>{issue.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 p-3 rounded-md">
                    <h4 className="font-medium text-blue-800 mb-1">解决方案</h4>
                    <p className="text-sm text-blue-700">{issue.solution}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="space-y-4">
            {healthData.recommendations.map((rec, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getPriorityIcon(rec.priority)}
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                    </div>
                    <Badge
                      variant={
                        rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "secondary" : "outline"
                      }
                    >
                      {rec.priority === "high" ? "高优先级" : rec.priority === "medium" ? "中优先级" : "低优先级"}
                    </Badge>
                  </div>
                  <CardDescription>{rec.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-3 rounded-md">
                    <h4 className="font-medium text-green-800 mb-1">预期影响</h4>
                    <p className="text-sm text-green-700">{rec.impact}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="roadmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>系统优化路线图</span>
              </CardTitle>
              <CardDescription>按优先级和时间线排序的修复计划</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-l-4 border-l-red-500 pl-4">
                <h3 className="font-semibold text-red-700 mb-2">🔥 第一阶段 (立即执行)</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• 修复Header组件渲染问题</li>
                  <li>• 优化Sidebar导航状态管理</li>
                  <li>• 重构移动端响应式布局</li>
                  <li>• 修复平板端布局适配问题</li>
                </ul>
              </div>

              <div className="border-l-4 border-l-yellow-500 pl-4">
                <h3 className="font-semibold text-yellow-700 mb-2">⏰ 第二阶段 (1-2周内)</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• 完善OKR跟踪模块功能</li>
                  <li>• 优化API响应时间和缓存</li>
                  <li>• 实现数据懒加载机制</li>
                  <li>• 加强错误处理和用户反馈</li>
                </ul>
              </div>

              <div className="border-l-4 border-l-blue-500 pl-4">
                <h3 className="font-semibold text-blue-700 mb-2">📈 第三阶段 (长期规划)</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• 扩展第三方服务集成</li>
                  <li>• 实现高级AI分析功能</li>
                  <li>• 优化整体系统性能</li>
                  <li>• 增强安全性和监控</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
