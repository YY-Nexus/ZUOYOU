"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { IntelligentContentCreator } from "@/components/ai/intelligent-content-creator"
import { PlatformIntegration } from "@/components/ai/platform-integration"
import { Wand2, Settings, BarChart3, BookOpen, Cog, Sparkles, Send, TrendingUp } from "lucide-react"

export default function ContentCreationPage() {
  const [activeTab, setActiveTab] = useState("creator")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center justify-center mb-4">
            <Sparkles className="w-10 h-10 mr-3 text-purple-600" />
            AI智能创作中心
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            集成多种AI模型，提供智能内容生成、多平台发布、数据分析等一站式内容创作解决方案
          </p>
        </div>

        {/* 功能选项卡 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 mb-8 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-2">
            <TabsTrigger
              value="creator"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              <Wand2 className="w-4 h-4" />
              智能创作
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white"
            >
              <BookOpen className="w-4 h-4" />
              模板库
            </TabsTrigger>
            <TabsTrigger
              value="platform"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
            >
              <Send className="w-4 h-4" />
              发布管理
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4" />
              数据分析
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-500 data-[state=active]:to-slate-500 data-[state=active]:text-white"
            >
              <Cog className="w-4 h-4" />
              设置
            </TabsTrigger>
          </TabsList>

          {/* 智能创作面板 */}
          <TabsContent value="creator" className="space-y-6">
            <IntelligentContentCreator />
          </TabsContent>

          {/* 模板库 */}
          <TabsContent value="templates" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-2xl">
                  <BookOpen className="w-8 h-8 mr-3" />
                  内容模板库
                </CardTitle>
                <CardDescription className="text-green-100">预设模板和自定义模板管理，提高创作效率</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: "产品介绍", desc: "专业的产品功能介绍模板", uses: 156, category: "营销" },
                    { name: "技术博客", desc: "技术文章写作标准模板", uses: 89, category: "技术" },
                    { name: "市场分析", desc: "行业市场分析报告模板", uses: 67, category: "分析" },
                    { name: "用户指南", desc: "产品使用说明文档模板", uses: 134, category: "文档" },
                    { name: "新闻稿", desc: "企业新闻发布标准模板", uses: 45, category: "新闻" },
                    { name: "社交文案", desc: "社交媒体内容创作模板", uses: 203, category: "社交" },
                  ].map((template, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-300"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg">{template.name}</h3>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {template.category}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{template.desc}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">使用 {template.uses} 次</span>
                          <button className="text-green-600 hover:text-green-800 text-sm font-medium">使用模板</button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 发布管理 */}
          <TabsContent value="platform" className="space-y-6">
            <PlatformIntegration />
          </TabsContent>

          {/* 数据分析 */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2" />
                    创作统计
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                      <span className="text-gray-700">本月创作数量</span>
                      <span className="text-2xl font-bold text-purple-600">127</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <span className="text-gray-700">平均创作时长</span>
                      <span className="text-2xl font-bold text-blue-600">3.2分钟</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <span className="text-gray-700">内容质量评分</span>
                      <span className="text-2xl font-bold text-green-600">8.7/10</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-6 h-6 mr-2" />
                    平台表现
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { platform: "微信公众号", reads: "12.3K", engagement: "8.5%" },
                      { platform: "企业微信", reads: "5.7K", engagement: "12.1%" },
                      { platform: "飞书", reads: "3.2K", engagement: "15.3%" },
                      { platform: "钉钉", reads: "2.8K", engagement: "9.7%" },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="font-medium">{item.platform}</span>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">{item.reads} 阅读</div>
                          <div className="text-xs text-green-600">{item.engagement} 互动率</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 系统设置 */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-gray-500 to-slate-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center text-2xl">
                  <Settings className="w-8 h-8 mr-3" />
                  系统设置
                </CardTitle>
                <CardDescription className="text-gray-100">配置AI模型参数、自动化设置和预算控制</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">AI模型配置</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span>默认模型</span>
                        <select className="border rounded px-3 py-1">
                          <option>GPT-4</option>
                          <option>GPT-3.5</option>
                          <option>Claude-3</option>
                        </select>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span>创作温度</span>
                        <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" className="w-24" />
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span>最大长度</span>
                        <input type="number" defaultValue="2000" className="border rounded px-2 py-1 w-20" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">自动化设置</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span>自动保存草稿</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span>质量检查</span>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span>自动优化建议</span>
                        <input type="checkbox" className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">预算控制</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600">月度预算</div>
                      <div className="text-2xl font-bold text-blue-600">¥500</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600">已使用</div>
                      <div className="text-2xl font-bold text-green-600">¥127</div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="text-sm text-gray-600">剩余预算</div>
                      <div className="text-2xl font-bold text-orange-600">¥373</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
