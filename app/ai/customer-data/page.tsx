"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BackButton } from "@/components/back-button"
import { motion } from "framer-motion"
import {
  Brain,
  TrendingUp,
  Target,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  PieChartIcon as RechartsPieChart,
  Activity,
  Star,
  TrendingDown,
  Filter,
  Download,
} from "lucide-react"
import {
  AreaChart,
  Area,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
} from "recharts"

export default function AICustomerDataPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedSegment, setSelectedSegment] = useState("all")
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)

  // AI分析数据
  const aiInsights = [
    {
      id: "1",
      title: "高价值客户识别",
      description: "AI识别出23个高潜力客户，预计转化价值180万",
      confidence: 92,
      status: "active",
      impact: "high",
      customers: 23,
      value: 1800000,
      trend: "up",
      change: "+15%",
    },
    {
      id: "2",
      title: "流失风险预警",
      description: "检测到15个客户存在流失风险，建议立即跟进",
      confidence: 87,
      status: "warning",
      impact: "critical",
      customers: 15,
      value: 450000,
      trend: "down",
      change: "-8%",
    },
    {
      id: "3",
      title: "交叉销售机会",
      description: "发现38个交叉销售机会，平均客单价可提升35%",
      confidence: 78,
      status: "opportunity",
      impact: "medium",
      customers: 38,
      value: 680000,
      trend: "up",
      change: "+22%",
    },
    {
      id: "4",
      title: "客户行为模式",
      description: "识别出5种主要客户行为模式，优化营销策略",
      confidence: 95,
      status: "completed",
      impact: "high",
      customers: 156,
      value: 0,
      trend: "stable",
      change: "0%",
    },
  ]

  // 客户分段数据
  const customerSegments = [
    { name: "VIP客户", value: 28, color: "#8b5cf6", growth: 12, revenue: 2800000 },
    { name: "活跃客户", value: 45, color: "#3b82f6", growth: 8, revenue: 1800000 },
    { name: "潜在客户", value: 67, color: "#10b981", growth: 15, revenue: 890000 },
    { name: "流失风险", value: 16, color: "#f59e0b", growth: -5, revenue: 320000 },
  ]

  // 客户价值趋势
  const valueData = [
    { month: "1月", value: 2400000, prediction: 2450000, actual: 2380000 },
    { month: "2月", value: 2600000, prediction: 2680000, actual: 2620000 },
    { month: "3月", value: 2800000, prediction: 2850000, actual: 2790000 },
    { month: "4月", value: 3100000, prediction: 3150000, actual: 3080000 },
    { month: "5月", value: 3300000, prediction: 3400000, actual: 3320000 },
    { month: "6月", value: 3500000, prediction: 3600000, actual: 3480000 },
  ]

  // 客户行为分析
  const behaviorData = [
    { behavior: "浏览产品", frequency: 85, conversion: 12, satisfaction: 78 },
    { behavior: "询价咨询", frequency: 45, conversion: 35, satisfaction: 85 },
    { behavior: "下载资料", frequency: 32, conversion: 28, satisfaction: 72 },
    { behavior: "参与活动", frequency: 28, conversion: 42, satisfaction: 88 },
    { behavior: "推荐朋友", frequency: 15, conversion: 68, satisfaction: 95 },
  ]

  // 实时数据
  const realtimeMetrics = [
    { label: "在线客户", value: 1247, change: "+5.2%", trend: "up" },
    { label: "活跃会话", value: 89, change: "+12.1%", trend: "up" },
    { label: "转化率", value: "3.8%", change: "+0.3%", trend: "up" },
    { label: "平均响应时间", value: "2.3s", change: "-0.5s", trend: "up" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950"
      case "warning":
        return "border-l-orange-500 bg-orange-50 dark:bg-orange-950"
      case "opportunity":
        return "border-l-blue-500 bg-blue-50 dark:bg-blue-950"
      case "completed":
        return "border-l-purple-500 bg-purple-50 dark:bg-purple-950"
      default:
        return "border-l-gray-500 bg-gray-50 dark:bg-gray-950"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />
      case "opportunity":
        return <Target className="w-5 h-5 text-blue-600" />
      case "completed":
        return <Star className="w-5 h-5 text-purple-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">高影响</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">中影响</Badge>
      case "critical":
        return <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">关键</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300">低影响</Badge>
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 min-h-screen">
      {/* 返回按钮 */}
      <BackButton title="AI客户数据分析" />

      {/* 页面头部 */}
      <motion.div
        className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <Brain className="w-8 h-8 mr-3 text-purple-600" />
            智能客户洞察与预测分析
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">基于机器学习的客户行为分析与商业智能预测系统</p>
        </div>
        <div className="flex flex-wrap items-center space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32 border-l-4 border-l-purple-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">本周</SelectItem>
              <SelectItem value="month">本月</SelectItem>
              <SelectItem value="quarter">本季度</SelectItem>
              <SelectItem value="year">本年度</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white transition-all duration-300 hover:shadow-xl hover:scale-105">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新分析
          </Button>
        </div>
      </motion.div>

      {/* 实时指标概览 */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {realtimeMetrics.map((metric, index) => (
          <Card
            key={index}
            className="border-l-4 border-l-purple-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              {getTrendIcon(metric.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{metric.value}</div>
              <p className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {metric.change} 较昨日
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* AI洞察概览 */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-l-4 border-l-purple-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI洞察数量</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">127</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">本月新增 +23</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">预测准确率</CardTitle>
            <Target className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">94.2%</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">较上月 +2.1%</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">客户价值</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">¥350万</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">预测增长 +15%</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">风险客户</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">15</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">需要立即关注</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI洞察列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-l-4 border-l-purple-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-700 dark:text-purple-300">
              <Zap className="w-5 h-5 mr-2" />
              AI智能洞察
            </CardTitle>
            <CardDescription>基于机器学习的客户行为分析与预测</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  className={`border-l-4 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer ${getStatusColor(insight.status)}`}
                  onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(insight.status)}
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{insight.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{insight.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getImpactBadge(insight.impact)}
                      <Badge variant="outline">置信度 {insight.confidence}%</Badge>
                      {getTrendIcon(insight.trend)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{insight.customers}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">涉及客户</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {insight.value > 0 ? `¥${(insight.value / 10000).toFixed(0)}万` : "-"}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">预估价值</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-lg font-bold ${insight.trend === "up" ? "text-green-600" : insight.trend === "down" ? "text-red-600" : "text-gray-600"}`}
                      >
                        {insight.change}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">变化趋势</div>
                    </div>
                    <div className="text-center">
                      <Progress value={insight.confidence} className="h-2 mt-2" />
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">置信度</div>
                    </div>
                  </div>

                  {selectedInsight === insight.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">详细分析</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            基于过去6个月的客户行为数据，AI模型识别出关键模式和趋势。
                            建议采取针对性的营销策略以最大化转化效果。
                          </p>
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">建议行动</h5>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <li>• 制定个性化营销方案</li>
                            <li>• 优化客户接触点体验</li>
                            <li>• 建立预警监控机制</li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex justify-end space-x-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="transition-all duration-300 hover:scale-105 bg-transparent"
                    >
                      查看详情
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white transition-all duration-300 hover:scale-105"
                    >
                      执行建议
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 数据可视化 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 客户价值趋势 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-l-4 border-l-blue-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                <TrendingUp className="w-5 h-5 mr-2" />
                客户价值趋势预测
              </CardTitle>
              <CardDescription>实际价值 vs AI预测价值 vs 历史数据</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={valueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`¥${((value as number) / 10000).toFixed(0)}万`, ""]} />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    stackId="1"
                    stroke="#10b981"
                    fill="url(#greenGradient)"
                    name="实际价值"
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stackId="2"
                    stroke="#3b82f6"
                    fill="url(#blueGradient)"
                    name="当前价值"
                  />
                  <Area
                    type="monotone"
                    dataKey="prediction"
                    stackId="3"
                    stroke="#8b5cf6"
                    fill="url(#purpleGradient)"
                    name="预测价值"
                  />
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* 客户分段分布 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border-l-4 border-l-emerald-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-emerald-700 dark:text-emerald-300">
                <RechartsPieChart className="w-5 h-5 mr-2" />
                客户分段分布
              </CardTitle>
              <CardDescription>基于AI算法的客户智能分类</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={customerSegments}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {customerSegments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {customerSegments.map((segment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                      <span className="text-sm font-medium">{segment.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{segment.value}</div>
                      <div className={`text-xs ${segment.growth > 0 ? "text-green-600" : "text-red-600"}`}>
                        {segment.growth > 0 ? "+" : ""}
                        {segment.growth}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* 客户行为分析 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="border-l-4 border-l-orange-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700 dark:text-orange-300">
              <Activity className="w-5 h-5 mr-2" />
              客户行为转化分析
            </CardTitle>
            <CardDescription>不同行为的频次、转化率与满意度对比</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={behaviorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="behavior" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="frequency" fill="#f59e0b" name="行为频次" />
                <Bar dataKey="conversion" fill="#10b981" name="转化率%" />
                <Bar dataKey="satisfaction" fill="#3b82f6" name="满意度%" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* 预测模型性能 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="border-l-4 border-l-indigo-500 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center text-indigo-700 dark:text-indigo-300">
              <Brain className="w-5 h-5 mr-2" />
              AI模型性能监控
            </CardTitle>
            <CardDescription>机器学习模型的准确性和性能指标</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">94.2%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">预测准确率</div>
                <Progress value={94.2} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">87.5%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">模型召回率</div>
                <Progress value={87.5} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">91.8%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">F1分数</div>
                <Progress value={91.8} className="mt-2" />
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg">
              <h4 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">模型优化建议</h4>
              <ul className="text-sm text-indigo-600 dark:text-indigo-400 space-y-1">
                <li>• 增加更多历史数据样本以提升预测精度</li>
                <li>• 优化特征工程，引入更多客户行为维度</li>
                <li>• 定期重训练模型以适应市场变化</li>
                <li>• 考虑集成多个模型以提升整体性能</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
