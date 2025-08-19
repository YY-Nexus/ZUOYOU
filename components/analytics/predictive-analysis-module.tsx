"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Settings,
} from "lucide-react"

interface PredictionData {
  metric: string
  current: number
  predicted: number
  change: number
  confidence: number
  trend: "up" | "down" | "stable"
  timeframe: string
}

interface ModelPerformance {
  name: string
  accuracy: number
  precision: number
  recall: number
  status: "active" | "training" | "inactive"
}

export function PredictiveAnalysisModule() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d")
  const [selectedModel, setSelectedModel] = useState("ensemble")
  const [loading, setLoading] = useState(false)
  const [predictions, setPredictions] = useState<PredictionData[]>([])
  const [models, setModels] = useState<ModelPerformance[]>([])

  // 模拟预测数据
  const mockPredictions: PredictionData[] = [
    {
      metric: "客户增长率",
      current: 15.2,
      predicted: 18.7,
      change: 23.0,
      confidence: 87,
      trend: "up",
      timeframe: "下月",
    },
    {
      metric: "收入预测",
      current: 125000,
      predicted: 142000,
      change: 13.6,
      confidence: 92,
      trend: "up",
      timeframe: "下月",
    },
    {
      metric: "客户流失率",
      current: 8.5,
      predicted: 6.2,
      change: -27.1,
      confidence: 78,
      trend: "down",
      timeframe: "下月",
    },
    {
      metric: "任务完成率",
      current: 82.3,
      predicted: 85.1,
      change: 3.4,
      confidence: 85,
      trend: "up",
      timeframe: "下月",
    },
    {
      metric: "用户活跃度",
      current: 67.8,
      predicted: 71.2,
      change: 5.0,
      confidence: 81,
      trend: "up",
      timeframe: "下月",
    },
    {
      metric: "运营成本",
      current: 45000,
      predicted: 42500,
      change: -5.6,
      confidence: 89,
      trend: "down",
      timeframe: "下月",
    },
  ]

  const mockModels: ModelPerformance[] = [
    {
      name: "集成学习模型",
      accuracy: 92.5,
      precision: 89.3,
      recall: 91.7,
      status: "active",
    },
    {
      name: "时间序列模型",
      accuracy: 87.2,
      precision: 85.1,
      recall: 88.9,
      status: "active",
    },
    {
      name: "深度学习模型",
      accuracy: 94.1,
      precision: 92.8,
      recall: 93.5,
      status: "training",
    },
    {
      name: "线性回归模型",
      accuracy: 78.9,
      precision: 76.4,
      recall: 80.2,
      status: "inactive",
    },
  ]

  useEffect(() => {
    loadPredictions()
    loadModels()
  }, [selectedTimeframe, selectedModel])

  const loadPredictions = async () => {
    setLoading(true)
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setPredictions(mockPredictions)
    setLoading(false)
  }

  const loadModels = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setModels(mockModels)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <BarChart3 className="h-4 w-4 text-gray-500" />
    }
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600"
    if (change < 0) return "text-red-600"
    return "text-gray-600"
  }

  const getModelStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      training: "secondary",
      inactive: "outline",
    } as const

    const labels = {
      active: "运行中",
      training: "训练中",
      inactive: "未激活",
    }

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const formatValue = (value: number, metric: string) => {
    if (metric.includes("率") || metric.includes("度")) {
      return `${value.toFixed(1)}%`
    }
    if (metric.includes("收入") || metric.includes("成本")) {
      return `¥${value.toLocaleString()}`
    }
    return value.toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* 头部控制栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-500" />
            预测分析中心
          </h2>
          <p className="text-muted-foreground mt-1">基于AI的业务预测和趋势分析</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7天</SelectItem>
              <SelectItem value="30d">30天</SelectItem>
              <SelectItem value="90d">90天</SelectItem>
              <SelectItem value="1y">1年</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ensemble">集成模型</SelectItem>
              <SelectItem value="timeseries">时间序列</SelectItem>
              <SelectItem value="deeplearning">深度学习</SelectItem>
              <SelectItem value="linear">线性回归</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={loadPredictions} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            刷新
          </Button>

          <Button>
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
        </div>
      </div>

      {/* 预测概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </CardContent>
              </Card>
            ))
          : predictions.map((prediction, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{prediction.metric}</CardTitle>
                    {getTrendIcon(prediction.trend)}
                  </div>
                  <CardDescription className="text-xs">{prediction.timeframe}预测</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl font-bold">{formatValue(prediction.predicted, prediction.metric)}</div>
                      <div className="text-xs text-muted-foreground">
                        当前: {formatValue(prediction.current, prediction.metric)}
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${getChangeColor(prediction.change)}`}>
                      {prediction.change > 0 ? "+" : ""}
                      {prediction.change.toFixed(1)}%
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>置信度</span>
                      <span>{prediction.confidence}%</span>
                    </div>
                    <Progress value={prediction.confidence} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* 详细分析 */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">趋势分析</TabsTrigger>
          <TabsTrigger value="models">模型性能</TabsTrigger>
          <TabsTrigger value="insights">智能洞察</TabsTrigger>
          <TabsTrigger value="settings">设置</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                趋势预测图表
              </CardTitle>
              <CardDescription>基于历史数据的未来趋势预测</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>趋势图表将在此显示</p>
                  <p className="text-sm">集成 Chart.js 或 Recharts 组件</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4">
            {models.map((model, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    {getModelStatusBadge(model.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{model.accuracy.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">准确率</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{model.precision.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">精确率</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{model.recall.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">召回率</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  关键洞察
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium">客户增长趋势良好</div>
                      <div className="text-sm text-muted-foreground">预计下月客户增长率将提升23%，建议加大市场投入</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <div className="font-medium">收入预测乐观</div>
                      <div className="text-sm text-muted-foreground">收入预计增长13.6%，主要来源于新客户获取</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div>
                      <div className="font-medium">需关注运营效率</div>
                      <div className="text-sm text-muted-foreground">虽然成本预计下降，但需要持续优化运营流程</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                预测设置
              </CardTitle>
              <CardDescription>配置预测模型和参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">默认预测周期</label>
                  <Select defaultValue="30d">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">7天</SelectItem>
                      <SelectItem value="30d">30天</SelectItem>
                      <SelectItem value="90d">90天</SelectItem>
                      <SelectItem value="1y">1年</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">置信度阈值</label>
                  <Select defaultValue="80">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="70">70%</SelectItem>
                      <SelectItem value="80">80%</SelectItem>
                      <SelectItem value="90">90%</SelectItem>
                      <SelectItem value="95">95%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button>保存设置</Button>
                <Button variant="outline">重置默认</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
