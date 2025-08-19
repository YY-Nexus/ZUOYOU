"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Star,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  RefreshCw,
  Eye,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BackButton } from "@/components/back-button"
import { useSidebar } from "@/hooks/use-sidebar"

interface CustomerInsight {
  id: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  category: "behavior" | "demographic" | "financial" | "engagement"
  value: string
  trend: "up" | "down" | "stable"
  details: string[]
}

interface CustomerSegment {
  id: string
  name: string
  count: number
  percentage: number
  avgValue: number
  characteristics: string[]
  color: string
}

const mockInsights: CustomerInsight[] = [
  {
    id: "1",
    title: "高价值客户流失风险",
    description: "检测到15%的高价值客户显示流失倾向",
    impact: "high",
    category: "behavior",
    value: "15%",
    trend: "up",
    details: ["过去30天内购买频率下降40%", "客服咨询次数增加3倍", "产品评分平均下降1.2分", "建议立即启动挽留计划"],
  },
  {
    id: "2",
    title: "新客户转化率提升",
    description: "本月新客户转化率较上月提升23%",
    impact: "high",
    category: "engagement",
    value: "23%",
    trend: "up",
    details: ["优化后的引导流程效果显著", "个性化推荐准确率达到78%", "首次购买时间缩短至3.2天", "建议扩大推广投入"],
  },
  {
    id: "3",
    title: "季节性购买模式",
    description: "识别出明显的季节性购买趋势",
    impact: "medium",
    category: "behavior",
    value: "季节性",
    trend: "stable",
    details: ["春季销量增长45%", "夏季产品A需求激增", "秋冬季节服务类产品受欢迎", "建议调整库存和营销策略"],
  },
  {
    id: "4",
    title: "客户满意度分析",
    description: "整体客户满意度保持在4.2/5.0",
    impact: "medium",
    category: "engagement",
    value: "4.2/5.0",
    trend: "stable",
    details: [
      "产品质量评分最高(4.5/5.0)",
      "物流服务有待改善(3.8/5.0)",
      "客服响应时间优秀(4.4/5.0)",
      "建议重点优化物流体验",
    ],
  },
]

const mockSegments: CustomerSegment[] = [
  {
    id: "1",
    name: "高价值忠诚客户",
    count: 1250,
    percentage: 25,
    avgValue: 5800,
    characteristics: ["购买频率高", "客单价高", "品牌忠诚度高", "推荐意愿强"],
    color: "bg-green-500",
  },
  {
    id: "2",
    name: "潜力增长客户",
    count: 1875,
    percentage: 37.5,
    avgValue: 2400,
    characteristics: ["购买频率中等", "价格敏感", "品类偏好明确", "活跃度高"],
    color: "bg-blue-500",
  },
  {
    id: "3",
    name: "新注册客户",
    count: 1000,
    percentage: 20,
    avgValue: 800,
    characteristics: ["首次购买", "观望态度", "需要引导", "转化潜力大"],
    color: "bg-yellow-500",
  },
  {
    id: "4",
    name: "流失风险客户",
    count: 875,
    percentage: 17.5,
    avgValue: 1200,
    characteristics: ["购买频率下降", "投诉增加", "满意度低", "需要挽留"],
    color: "bg-red-500",
  },
]

export default function CustomerDataAnalysisPage() {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { isFullscreen } = useSidebar()

  const handleRefresh = async () => {
    setIsLoading(true)
    // 模拟数据刷新
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-green-600 bg-green-50 border-green-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className={`min-h-screen bg-background ${isFullscreen ? "pl-0" : "pl-72"} transition-all duration-300`}>
      <div className="p-6 space-y-6">
        {/* 页面头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="space-y-1">
            <BackButton className="mb-4" />
            <h1 className="text-3xl font-bold tracking-tight">AI 客户数据分析</h1>
            <p className="text-muted-foreground">基于机器学习的客户行为分析和预测洞察</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              刷新数据
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出报告
            </Button>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              筛选
            </Button>
          </div>
        </motion.div>

        {/* 关键指标卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总客户数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5,000</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> 较上月
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">平均客户价值</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">¥2,850</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> 较上月
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">客户满意度</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2/5.0</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-yellow-600">持平</span> 较上月
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">流失率</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">-0.5%</span> 较上月
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 主要内容区域 */}
        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights">智能洞察</TabsTrigger>
            <TabsTrigger value="segments">客户分群</TabsTrigger>
            <TabsTrigger value="predictions">预测分析</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6"
            >
              {mockInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all cursor-pointer">
                    <CardHeader
                      onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
                      className="pb-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-lg">{insight.title}</CardTitle>
                            <Badge className={getImpactColor(insight.impact)}>
                              {insight.impact === "high" ? "高" : insight.impact === "medium" ? "中" : "低"}影响
                            </Badge>
                            {getTrendIcon(insight.trend)}
                          </div>
                          <CardDescription className="text-base">{insight.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{insight.value}</div>
                          </div>
                          {selectedInsight === insight.id ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    {selectedInsight === insight.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                              详细分析
                            </h4>
                            <ul className="space-y-2">
                              {insight.details.map((detail, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-sm">{detail}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="flex gap-2 pt-3">
                              <Button size="sm" variant="default">
                                <Eye className="h-4 w-4 mr-2" />
                                查看详情
                              </Button>
                              <Button size="sm" variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                导出数据
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="segments" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6"
            >
              {mockSegments.map((segment, index) => (
                <motion.div
                  key={segment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${segment.color}`} />
                          <CardTitle>{segment.name}</CardTitle>
                        </div>
                        <Badge variant="secondary">{segment.count.toLocaleString()} 人</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">占比</p>
                          <div className="flex items-center gap-2">
                            <Progress value={segment.percentage} className="flex-1" />
                            <span className="text-sm font-medium">{segment.percentage}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">平均价值</p>
                          <p className="text-lg font-semibold">¥{segment.avgValue.toLocaleString()}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">特征标签</p>
                        <div className="flex flex-wrap gap-2">
                          {segment.characteristics.map((char, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {char}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    预测分析模型
                  </CardTitle>
                  <CardDescription>基于历史数据和机器学习算法的客户行为预测</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <PieChart className="h-12 w-12 mx-auto mb-4" />
                    <p>预测分析功能正在开发中...</p>
                    <p className="text-sm mt-2">敬请期待更强大的AI预测能力</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
