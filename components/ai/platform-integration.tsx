"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  Globe,
  Smartphone,
  Users,
  BarChart3,
  Calendar,
  Settings,
} from "lucide-react"

export function PlatformIntegration() {
  const [publishConfig, setPublishConfig] = useState({
    platforms: ["wechat", "workwechat"],
    scheduleTime: "",
    autoPublish: false,
    content: {
      title: "关于企业数字化转型的思考",
      summary: "探讨企业在数字化转型过程中的挑战与机遇",
      content: "���着数字化浪潮的推进，企业面临着前所未有的转型压力...",
    },
  })

  const [publishHistory, setPublishHistory] = useState([
    {
      id: 1,
      title: "企业管理系统升级指南",
      platforms: ["wechat", "feishu"],
      status: "published",
      time: "2024-01-15 14:30",
      views: 1234,
    },
    {
      id: 2,
      title: "AI技术在客服中的应用",
      platforms: ["workwechat", "dingtalk"],
      status: "scheduled",
      time: "2024-01-16 09:00",
      views: 0,
    },
    {
      id: 3,
      title: "数字化转型最佳实践",
      platforms: ["wechat", "feishu", "dingtalk"],
      status: "failed",
      time: "2024-01-14 16:45",
      views: 567,
    },
  ])

  const platforms = [
    { id: "wechat", name: "微信公众号", icon: MessageSquare, color: "text-green-600", status: "connected" },
    { id: "workwechat", name: "企业微信", icon: Users, color: "text-blue-600", status: "connected" },
    { id: "feishu", name: "飞书", icon: MessageSquare, color: "text-blue-500", status: "connected" },
    { id: "dingtalk", name: "钉钉", icon: Smartphone, color: "text-blue-400", status: "connected" },
    { id: "douyin", name: "抖音", icon: Globe, color: "text-red-500", status: "disconnected" },
  ]

  const handlePlatformToggle = (platformId: string) => {
    const platforms = [...publishConfig.platforms]
    const index = platforms.indexOf(platformId)
    if (index > -1) {
      platforms.splice(index, 1)
    } else {
      platforms.push(platformId)
    }
    setPublishConfig({ ...publishConfig, platforms })
  }

  const handlePublish = () => {
    alert("内容发布成功！")
  }

  const handleSchedule = () => {
    alert("内容已安排定时发布！")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            已发布
          </Badge>
        )
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            定时发布
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            发布失败
          </Badge>
        )
      default:
        return <Badge variant="outline">未知状态</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* 发布配置 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="w-6 h-6 mr-2 text-blue-600" />
              内容发布
            </CardTitle>
            <CardDescription>选择发布平台和配置发布参数</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>发布标题</Label>
              <Input
                value={publishConfig.content.title}
                onChange={(e) =>
                  setPublishConfig({
                    ...publishConfig,
                    content: { ...publishConfig.content, title: e.target.value },
                  })
                }
              />
            </div>

            <div>
              <Label>内容摘要</Label>
              <Textarea
                value={publishConfig.content.summary}
                onChange={(e) =>
                  setPublishConfig({
                    ...publishConfig,
                    content: { ...publishConfig.content, summary: e.target.value },
                  })
                }
                rows={2}
              />
            </div>

            <div>
              <Label>正文内容</Label>
              <Textarea
                value={publishConfig.content.content}
                onChange={(e) =>
                  setPublishConfig({
                    ...publishConfig,
                    content: { ...publishConfig.content, content: e.target.value },
                  })
                }
                rows={6}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>自动发布</Label>
              <Switch
                checked={publishConfig.autoPublish}
                onCheckedChange={(checked) => setPublishConfig({ ...publishConfig, autoPublish: checked })}
              />
            </div>

            {!publishConfig.autoPublish && (
              <div>
                <Label>定时发布</Label>
                <Input
                  type="datetime-local"
                  value={publishConfig.scheduleTime}
                  onChange={(e) => setPublishConfig({ ...publishConfig, scheduleTime: e.target.value })}
                />
              </div>
            )}

            <div className="flex space-x-2">
              <Button onClick={handlePublish} className="flex-1 bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4 mr-2" />
                立即发布
              </Button>
              <Button onClick={handleSchedule} variant="outline" className="flex-1 bg-transparent">
                <Clock className="w-4 h-4 mr-2" />
                定时发布
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-6 h-6 mr-2 text-purple-600" />
              平台选择
            </CardTitle>
            <CardDescription>选择要发布内容的目标平台</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platforms.map((platform) => {
                const Icon = platform.icon
                const isSelected = publishConfig.platforms.includes(platform.id)
                const isConnected = platform.status === "connected"

                return (
                  <div key={platform.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${platform.color}`} />
                      <div>
                        <p className="font-medium">{platform.name}</p>
                        <p className="text-sm text-gray-500">{isConnected ? "已连接" : "未连接"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isConnected ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          已连接
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          未连接
                        </Badge>
                      )}
                      <Switch
                        checked={isSelected && isConnected}
                        disabled={!isConnected}
                        onCheckedChange={() => handlePlatformToggle(platform.id)}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>已选择 {publishConfig.platforms.length} 个平台</strong>
              </p>
              <p className="text-sm text-blue-600 mt-1">内容将同时发布到所选平台，请确保内容符合各平台规范</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 发布历史 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-green-600" />
            发布历史
          </CardTitle>
          <CardDescription>查看最近的内容发布记录和数据统计</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {publishHistory.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {item.time}
                    </span>
                    <span className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      {item.views} 阅读
                    </span>
                    <div className="flex space-x-1">
                      {item.platforms.map((platformId) => {
                        const platform = platforms.find((p) => p.id === platformId)
                        return platform ? (
                          <Badge key={platformId} variant="outline" className="text-xs">
                            {platform.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(item.status)}
                  <Button variant="ghost" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
