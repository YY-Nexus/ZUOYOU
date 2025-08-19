"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Database, Shield, Download, RefreshCw } from "lucide-react"

interface SystemModule {
  name: string
  status: "completed" | "in-progress" | "pending" | "error"
  progress: number
  description: string
  features: string[]
  issues?: string[]
}

interface AnalysisData {
  overview: {
    totalModules: number
    completedModules: number
    inProgressModules: number
    pendingModules: number
    overallProgress: number
  }
  modules: SystemModule[]
  performance: {
    loadTime: number
    memoryUsage: number
    apiResponseTime: number
    errorRate: number
  }
  security: {
    vulnerabilities: number
    securityScore: number
    lastAudit: string
  }
}

export function SystemAnalysisReport() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const mockAnalysisData: AnalysisData = {
    overview: {
      totalModules: 15,
      completedModules: 12,
      inProgressModules: 2,
      pendingModules: 1,
      overallProgress: 85,
    },
    modules: [
      {
        name: "客户管理模块",
        status: "completed",
        progress: 100,
        description: "完整的客户生命周期管理系统",
        features: ["客户信息管理", "客户分析", "满意度调查", "客户标签"],
      },
      {
        name: "任务管理模块",
        status: "completed",
        progress: 100,
        description: "高级任务管理和依赖关系处理",
        features: ["任务创建", "依赖管理", "进度跟踪", "团队协作"],
      },
      {
        name: "AI分析模块",
        status: "in-progress",
        progress: 75,
        description: "智能数据分析和预测功能",
        features: ["数据分析", "预测模型", "智能推荐"],
        issues: ["模型训练优化中", "API集成待完善"],
      },
      {
        name: "移动端优化",
        status: "in-progress",
        progress: 60,
        description: "移动设备适配和触摸控制",
        features: ["响应式设计", "触摸手势", "离线支持"],
        issues: ["部分组件需要优化", "性能调优进行中"],
      },
      {
        name: "安全审计模块",
        status: "pending",
        progress: 20,
        description: "系统安全监控和审计功能",
        features: ["权限管理", "操作日志", "安全扫描"],
      },
    ],
    performance: {
      loadTime: 1.2,
      memoryUsage: 45,
      apiResponseTime: 150,
      errorRate: 0.02,
    },
    security: {
      vulnerabilities: 2,
      securityScore: 92,
      lastAudit: "2024-01-15",
    },
  }

  useEffect(() => {
    // 模拟数据加载
    const loadData = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setAnalysisData(mockAnalysisData)
      setLoading(false)
    }
    loadData()
  }, [])

  const refreshData = async () => {
    setRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setAnalysisData(mockAnalysisData)
    setRefreshing(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "pending":
        return <XCircle className="h-5 w-5 text-gray-400" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      "in-progress": "secondary",
      pending: "outline",
      error: "destructive",
    } as const

    const labels = {
      completed: "已完成",
      "in-progress": "进行中",
      pending: "待开始",
      error: "错误",
    }

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">正在生成系统分析报告...</p>
        </div>
      </div>
    )
  }

  if (!analysisData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">无法加载分析数据</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 头部操作栏 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">系统分析报告</h1>
          <p className="text-muted-foreground mt-1">系统完整性和性能分析报告</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            刷新数据
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      {/* 概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总体进度</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.overview.overallProgress}%</div>
            <Progress value={analysisData.overview.overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">已完成模块</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analysisData.overview.completedModules}/{analysisData.overview.totalModules}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((analysisData.overview.completedModules / analysisData.overview.totalModules) * 100)}% 完成率
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">安全评分</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.security.securityScore}/100</div>
            <p className="text-xs text-muted-foreground">{analysisData.security.vulnerabilities} 个安全问题</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">响应时间</CardTitle>
            <Database className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysisData.performance.apiResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              错误率: {(analysisData.performance.errorRate * 100).toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 详细分析 */}
      <Tabs defaultValue="modules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="modules">模块状态</TabsTrigger>
          <TabsTrigger value="performance">性能分析</TabsTrigger>
          <TabsTrigger value="security">安全审计</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-4">
          <div className="grid gap-4">
            {analysisData.modules.map((module, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(module.status)}
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                    </div>
                    {getStatusBadge(module.status)}
                  </div>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>完成进度</span>
                        <span>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} />
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">功能特性</h4>
                      <div className="flex flex-wrap gap-2">
                        {module.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {module.issues && module.issues.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 text-yellow-600">待解决问题</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {module.issues.map((issue, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-yellow-500" />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>性能指标</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>页面加载时间</span>
                  <span className="font-medium">{analysisData.performance.loadTime}s</span>
                </div>
                <div className="flex justify-between">
                  <span>内存使用率</span>
                  <span className="font-medium">{analysisData.performance.memoryUsage}%</span>
                </div>
                <div className="flex justify-between">
                  <span>API响应时间</span>
                  <span className="font-medium">{analysisData.performance.apiResponseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>错误率</span>
                  <span className="font-medium">{(analysisData.performance.errorRate * 100).toFixed(2)}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>优化建议</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    代码分割已优化
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    建议启用图片懒加载
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    可优化数据库查询
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    缓存策略已配置
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>安全状态</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>安全评分</span>
                  <span className="font-medium text-green-600">{analysisData.security.securityScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span>发现漏洞</span>
                  <span className="font-medium text-yellow-600">{analysisData.security.vulnerabilities} 个</span>
                </div>
                <div className="flex justify-between">
                  <span>最后审计</span>
                  <span className="font-medium">{analysisData.security.lastAudit}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>安全措施</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    HTTPS 加密已启用
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    身份验证已配置
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    需要更新依赖包
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    访问控制已实施
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
