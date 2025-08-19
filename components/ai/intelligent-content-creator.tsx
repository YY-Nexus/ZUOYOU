"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Wand2,
  Sparkles,
  FileText,
  ImageIcon,
  Save,
  Send,
  RefreshCw,
  Eye,
  Copy,
  Settings,
  Zap,
  Target,
} from "lucide-react"

export function IntelligentContentCreator() {
  const [contentType, setContentType] = useState("article")
  const [aiModel, setAiModel] = useState("gpt-4")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedContent, setGeneratedContent] = useState("")
  const [contentConfig, setContentConfig] = useState({
    topic: "企业数字化转型的挑战与机遇",
    style: "professional",
    length: "medium",
    tone: "informative",
    keywords: "数字化转型,企业管理,技术创新",
  })

  const contentTypes = [
    { id: "article", name: "技术文章", icon: FileText, desc: "深度技术分析文章" },
    { id: "social", name: "社交文案", icon: ImageIcon, desc: "社交媒体营销文案" },
    { id: "marketing", name: "营销内容", icon: Target, desc: "产品营销推广内容" },
    { id: "report", name: "分析报告", icon: FileText, desc: "数据分析报告" },
  ]

  const aiModels = [
    { id: "gpt-4", name: "GPT-4", desc: "最强大的文本生成模型", cost: "高" },
    { id: "gpt-3.5", name: "GPT-3.5", desc: "平衡性能与成本", cost: "中" },
    { id: "claude-3", name: "Claude-3", desc: "安全可靠的对话AI", cost: "中" },
    { id: "gemini-pro", name: "Gemini Pro", desc: "Google最新AI模型", cost: "中" },
  ]

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    // 模拟生成过程
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setGeneratedContent(`# ${contentConfig.topic}

## 引言

在当今快速发展的数字化时代，企业面临着前所未有的转型压力和机遇。数字化转型不仅仅是技术的升级，更是企业运营模式、管理理念和商业策略的全面革新。

## 主要挑战

### 1. 技术基础设施升级
传统企业在数字化转型过程中，首先面临的是技术基础设施的升级挑战。老旧的IT系统、数据孤岛问题以及安全性考虑都是需要解决的关键问题。

### 2. 组织文化变革
数字化转型不仅是技术问题，更是组织文化的变革。员工的思维模式、工作习惯以及对新技术的接受度都会影响转型的成功。

### 3. 数据治理与安全
随着数字化程度的提高，企业需要处理的数据量急剧增加，如何确保数据的质量、安全性和合规性成为重要挑战。

## 发展机遇

### 1. 提升运营效率
通过自动化和智能化技术，企业可以显著提升运营效率，降低人工成本，提高服务质量。

### 2. 创新商业模式
数字化技术为企业提供了创新商业模式的可能，如平台经济、订阅模式、数据变现等。

### 3. 增强客户体验
通过数字化手段，企业可以更好地了解客户需求，提供个性化服务，提升客户满意度和忠诚度。

## 成功策略

1. **制定清晰的数字化战略**：明确转型目标和路径
2. **投资人才培养**：建设数字化人才队伍
3. **选择合适的技术合作伙伴**：借助外部专业力量
4. **分步实施**：采用渐进式转型策略
5. **持续优化**：建立持续改进机制

## 结论

企业数字化转型是一个长期的系统工程，需要企业在战略、技术、人才、文化等多个维度进行全面布局。只有正确认识挑战，把握机遇，制定合适的策略，才能在数字化浪潮中立于不败之地。`)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleSave = () => {
    alert("内容已保存到草稿箱！")
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    alert("内容已复制到剪贴板！")
  }

  return (
    <div className="space-y-6">
      {/* 创作配置面板 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 内容类型选择 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Wand2 className="w-6 h-6 mr-2" />
              内容类型
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {contentTypes.map((type) => {
                const Icon = type.icon
                return (
                  <div
                    key={type.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      contentType === type.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                    onClick={() => setContentType(type.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${contentType === type.id ? "text-blue-600" : "text-gray-500"}`} />
                      <div>
                        <p className={`font-medium ${contentType === type.id ? "text-blue-900" : "text-gray-700"}`}>
                          {type.name}
                        </p>
                        <p className="text-xs text-gray-500">{type.desc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* AI模型选择 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Sparkles className="w-6 h-6 mr-2" />
              AI模型
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {aiModels.map((model) => (
                <div
                  key={model.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    aiModel === model.id
                      ? "border-purple-500 bg-purple-50 shadow-md"
                      : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                  }`}
                  onClick={() => setAiModel(model.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-medium ${aiModel === model.id ? "text-purple-900" : "text-gray-700"}`}>
                        {model.name}
                      </p>
                      <p className="text-xs text-gray-500">{model.desc}</p>
                    </div>
                    <Badge variant={model.cost === "高" ? "destructive" : "secondary"} className="text-xs">
                      {model.cost}成本
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 创作参数 */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              创作参数
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label className="text-sm font-medium">内容风格</Label>
              <Select
                value={contentConfig.style}
                onValueChange={(value) => setContentConfig({ ...contentConfig, style: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">专业正式</SelectItem>
                  <SelectItem value="casual">轻松随意</SelectItem>
                  <SelectItem value="creative">创意活泼</SelectItem>
                  <SelectItem value="academic">学术严谨</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">内容长度</Label>
              <Select
                value={contentConfig.length}
                onValueChange={(value) => setContentConfig({ ...contentConfig, length: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">简短 (500字以内)</SelectItem>
                  <SelectItem value="medium">中等 (500-1500字)</SelectItem>
                  <SelectItem value="long">详细 (1500字以上)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">语调风格</Label>
              <Select
                value={contentConfig.tone}
                onValueChange={(value) => setContentConfig({ ...contentConfig, tone: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="informative">信息性</SelectItem>
                  <SelectItem value="persuasive">说服性</SelectItem>
                  <SelectItem value="entertaining">娱乐性</SelectItem>
                  <SelectItem value="educational">教育性</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 内容配置 */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center text-xl">
            <FileText className="w-7 h-7 mr-3" />
            内容配置
          </CardTitle>
          <CardDescription className="text-indigo-100">配置创作主题、关键词和具体要求</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="topic" className="text-sm font-medium">
                创作主题
              </Label>
              <Input
                id="topic"
                value={contentConfig.topic}
                onChange={(e) => setContentConfig({ ...contentConfig, topic: e.target.value })}
                placeholder="请输入创作主题..."
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="keywords" className="text-sm font-medium">
                关键词 (用逗号分隔)
              </Label>
              <Input
                id="keywords"
                value={contentConfig.keywords}
                onChange={(e) => setContentConfig({ ...contentConfig, keywords: e.target.value })}
                placeholder="关键词1,关键词2,关键词3"
                className="mt-2"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="requirements" className="text-sm font-medium">
              具体要求
            </Label>
            <Textarea
              id="requirements"
              placeholder="请描述具体的创作要求、目标受众、重点内容等..."
              rows={4}
              className="mt-2"
            />
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  AI创作中...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  开始AI创作
                </>
              )}
            </Button>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>创作进度</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* 内容预览和编辑 */}
      {generatedContent && (
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-xl">
              <div className="flex items-center">
                <Eye className="w-7 h-7 mr-3" />
                内容预览与编辑
              </div>
              <div className="flex space-x-2">
                <Button variant="secondary" size="sm" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-1" />
                  复制
                </Button>
                <Button variant="secondary" size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-1" />
                  保存
                </Button>
                <Button variant="secondary" size="sm">
                  <Send className="w-4 h-4 mr-1" />
                  发布
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 编辑区域 */}
              <div>
                <Label className="text-sm font-medium mb-2 block">内容编辑</Label>
                <Textarea
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>

              {/* 预览区域 */}
              <div>
                <Label className="text-sm font-medium mb-2 block">实时预览</Label>
                <div className="border rounded-lg p-4 bg-gray-50 h-[500px] overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    {generatedContent.split("\n").map((line, index) => {
                      if (line.startsWith("# ")) {
                        return (
                          <h1 key={index} className="text-2xl font-bold mb-4 text-gray-900">
                            {line.substring(2)}
                          </h1>
                        )
                      } else if (line.startsWith("## ")) {
                        return (
                          <h2 key={index} className="text-xl font-semibold mb-3 mt-6 text-gray-800">
                            {line.substring(3)}
                          </h2>
                        )
                      } else if (line.startsWith("### ")) {
                        return (
                          <h3 key={index} className="text-lg font-medium mb-2 mt-4 text-gray-700">
                            {line.substring(4)}
                          </h3>
                        )
                      } else if (line.trim() === "") {
                        return <br key={index} />
                      } else {
                        return (
                          <p key={index} className="mb-3 text-gray-600 leading-relaxed">
                            {line}
                          </p>
                        )
                      }
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 内容分析 */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">1,247</div>
                <div className="text-sm text-gray-600">字符数</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">8.5</div>
                <div className="text-sm text-gray-600">可读性评分</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-sm text-gray-600">关键词密度</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">3.2</div>
                <div className="text-sm text-gray-600">预计阅读时间(分钟)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
