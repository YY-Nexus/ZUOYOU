"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Activity,
  PieChart,
  LineChart,
  Download,
  RefreshCw,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react"

// 模拟数据
const mockData = {
  kpiMetrics: [
    {
      title: "总收入",
      value: "¥2,847,392",
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      color: "emerald",
    },
    {
      title: "活跃用户",
      value: "1,247",
      change: "+8.2%",
      trend: "up" as const,
      icon: Users,
      color: "emerald",
    },
    {
      title: "转化率",
      value: "12.4%",
      change: "+2.1%",
      trend: "up" as const,
      icon: Target,
      color: "emerald",
    },
    {
      title: "活跃度",
      value: "85.6%",
      change: "-1.2%",
      trend: "down" as const,
      icon: Activity,
      color: "emerald",
    },
  ],
  userBehavior: [
    { name: "页面浏览", value: 45 },
    { name: "功能使用", value: 30 },
    { name: "数据导出", value: 15 },
    { name: "其他操作", value: 10 },
  ],
  salesTrend: [
    { month: "1月", revenue: 2400000, target: 2500000 },
    { month: "2月", revenue: 2600000, target: 2700000 },
    { month: "3月", revenue: 2800000, target: 2800000 },
    { month: "4月", revenue: 3100000, target: 3000000 },
    { month: "5月", revenue: 3300000, target: 3200000 },
    { month: "6月", revenue: 3500000, target: 3400000 },
  ],
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = async () => {
    setIsLoading(true)
    // 模拟数据刷新
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handleExport = () => {
    // 模拟导出功能
    console.log("导出报告...")
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 min-h-screen">
      {/* 页面头部 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-emerald-600" />
            数据分析
          </h1>
          <p className="text-gray-600 mt-2">企业数据深度分析和洞察</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32 border-l-4 border-l-emerald-500">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">今日</SelectItem>
              <SelectItem value="week">本周</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季度</SelectItem>
              <SelectItem value="year">本年</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="border-l-4 border-l-emerald-500 transition-all duration-300 hover:scale-105 hover:shadow-xl bg-transparent group"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 transition-all duration-300 ${isLoading ? "animate-spin" : "group-hover:rotate-180"}`}
            />
            刷新数据
          </Button>
          <Button
            onClick={handleExport}
            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white transition-all duration-300 hover:shadow-xl hover:scale-105 group"
          >
            <Download className="w-4 h-4 mr-2 group-hover:translate-y-1 transition-all duration-300" />
            导出报告
          </Button>
        </div>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockData.kpiMetrics.map((metric, index) => (
          <Card
            key={index}
            className="border-l-4 border-l-emerald-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">{metric.value}</div>
              <div className="flex items-center mt-1">
                {metric.trend === "up" ? (
                  <ArrowUp className="w-3 h-3 text-emerald-600 mr-1" />
                ) : (
                  <ArrowDown className="w-3 h-3 text-red-600 mr-1" />
                )}
                <p className={`text-xs ${metric.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
                  {metric.change} 较上期
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 图表分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-emerald-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-emerald-700">
              <LineChart className="w-5 h-5 mr-2" />
              收入趋势分析
            </CardTitle>
            <CardDescription>过去6个月收入变化趋势</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-emerald-50 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 to-green-100/50"></div>
              <div className="relative z-10 text-center">
                <TrendingUp className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <p className="text-emerald-600 font-medium">收入趋势图表</p>
                <p className="text-sm text-emerald-500 mt-2">数据可视化区域</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-emerald-700">
              <PieChart className="w-5 h-5 mr-2" />
              用户行为分析
            </CardTitle>
            <CardDescription>用户活动和行为模式分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.userBehavior.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="font-medium text-emerald-600">{item.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 详细分析模块 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-emerald-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-emerald-700">销售分析</CardTitle>
            <CardDescription>销售数据深度分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">¥2,847,392</div>
                <div className="text-sm text-gray-600">本月销售额</div>
              </div>
              <div className="flex items-center justify-center">
                <Badge className="bg-emerald-100 text-emerald-700">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  增长 12.5%
                </Badge>
              </div>
              <Button
                variant="outline"
                className="w-full border-l-4 border-l-emerald-500 transition-all duration-300 hover:scale-105 group bg-transparent"
              >
                <TrendingUp className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-all duration-300" />
                查看详情
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-emerald-700">客户分析</CardTitle>
            <CardDescription>客户行为和偏好分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">1,247</div>
                <div className="text-sm text-gray-600">活跃客户数</div>
              </div>
              <div className="flex items-center justify-center">
                <Badge className="bg-emerald-100 text-emerald-700">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  增长 8.2%
                </Badge>
              </div>
              <Button
                variant="outline"
                className="w-full border-l-4 border-l-emerald-500 transition-all duration-300 hover:scale-105 group bg-transparent"
              >
                <Users className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-all duration-300" />
                查看详情
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-emerald-700">性能分析</CardTitle>
            <CardDescription>系统性能和效率分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">85.6%</div>
                <div className="text-sm text-gray-600">系统效率</div>
              </div>
              <div className="flex items-center justify-center">
                <Badge className="bg-red-100 text-red-700">
                  <ArrowDown className="w-3 h-3 mr-1" />
                  下降 1.2%
                </Badge>
              </div>
              <Button
                variant="outline"
                className="w-full border-l-4 border-l-emerald-500 transition-all duration-300 hover:scale-105 group bg-transparent"
              >
                <Activity className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-all duration-300" />
                查看详情
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 快速操作 */}
      <Card className="border-l-4 border-l-emerald-500 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-emerald-700">快速操作</CardTitle>
          <CardDescription>常用分析功能快速入口</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-emerald-50 bg-transparent"
            >
              <BarChart3 className="w-6 h-6 text-emerald-600" />
              <span className="text-sm">销售报表</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-emerald-50 bg-transparent"
            >
              <Users className="w-6 h-6 text-emerald-600" />
              <span className="text-sm">客户分析</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-emerald-50 bg-transparent"
            >
              <Target className="w-6 h-6 text-emerald-600" />
              <span className="text-sm">目标跟踪</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 hover:bg-emerald-50 bg-transparent"
            >
              <Activity className="w-6 h-6 text-emerald-600" />
              <span className="text-sm">性能监控</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
