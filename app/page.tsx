"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  Users,
  CheckSquare,
  DollarSign,
  TrendingUp,
  Bell,
  Activity,
  Target,
  Zap,
  ArrowRight,
} from "lucide-react"
import { useSidebar } from "@/hooks/use-sidebar"

export default function HomePage() {
  const { isFullscreen } = useSidebar()

  const quickStats = [
    { title: "总客户数", value: "5,000", change: "+12%", icon: Users, color: "text-blue-600" },
    { title: "待处理任务", value: "23", change: "-5%", icon: CheckSquare, color: "text-orange-600" },
    { title: "本月收入", value: "¥125,000", change: "+18%", icon: DollarSign, color: "text-green-600" },
    { title: "系统活跃度", value: "98.5%", change: "+2%", icon: Activity, color: "text-purple-600" },
  ]

  const recentActivities = [
    { title: "新客户注册", description: "张三完成了账户注册", time: "2分钟前", type: "user" },
    { title: "订单完成", description: "订单 #12345 已完成支付", time: "5分钟前", type: "order" },
    { title: "系统更新", description: "AI分析模块已更新", time: "10分钟前", type: "system" },
    { title: "客服咨询", description: "李四发起了在线咨询", time: "15分钟前", type: "support" },
  ]

  return (
    <div className={`min-h-screen bg-background ${isFullscreen ? "pl-0" : "pl-72"} transition-all duration-300`}>
      <div className="p-6 space-y-6">
        {/* 欢迎区域 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold tracking-tight">欢迎回来！</h1>
          <p className="text-muted-foreground">
            今天是{" "}
            {new Date().toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            })}
          </p>
        </motion.div>

        {/* 快速统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> 较上月
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 快速操作 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  快速操作
                </CardTitle>
                <CardDescription>常用功能快速入口</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Users className="h-6 w-6" />
                    <span>客户管理</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <CheckSquare className="h-6 w-6" />
                    <span>任务管理</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <DollarSign className="h-6 w-6" />
                    <span>财务管理</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <BarChart3 className="h-6 w-6" />
                    <span>数据分析</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Target className="h-6 w-6" />
                    <span>KPI管理</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
                    <Bell className="h-6 w-6" />
                    <span>通知中心</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 最近活动 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  最近活动
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4">
                  查看全部
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 系统状态 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                系统状态
              </CardTitle>
              <CardDescription>实时系统运行状态监控</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CPU 使用率</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>内存使用率</span>
                    <span>62%</span>
                  </div>
                  <Progress value={62} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>存储使用率</span>
                    <span>38%</span>
                  </div>
                  <Progress value={38} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
