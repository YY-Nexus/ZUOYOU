"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileContentCreator } from "../mobile/mobile-content-creator"
import { aiModelService, generateContent } from "@/lib/ai-model-service"
import { checkContentSafety } from "@/lib/content-security-service"
import { publishContent } from "@/lib/enhanced-platform-api"
import {
  Wand2,
  Sparkles,
  Shield,
  AlertTriangle,
  CheckCircle,
  Save,
  Send,
  Copy,
  Eye,
  Settings,
  Zap,
  RefreshCw,
  Smartphone,
  Monitor,
  Brain,
  Target,
} from "lucide-react"

export function EnhancedIntelligentContentCreator() {
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState("create")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedContent, setGeneratedContent] = useState("")
  const [securityCheck, setSecurityCheck] = useState<any>(null)
  const [isSecurityChecking, setIsSecurityChecking] = useState(false)
  const [availableModels, setAvailableModels] = useState<any[]>([])
  const [selectedModel, setSelectedModel] = useState("gpt-4")
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({})

  const [contentConfig, setContentConfig] = useState({
    topic: "",
    type: "article",
    style: "professional",
    length: "medium",
    tone: "informative",
    keywords: "",
    targetAudience: "general",
    language: "zh-CN",
    temperature: 0.7,
    maxTokens: 2000,
  })

  const [publishConfig, setPublishConfig] = useState({
    platforms: ["wechat"],
    autoPublish: false,
    scheduleTime: "",
    enableSecurity: true,
    addWatermark: false,
  })

  // 检测移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // 加载可用模型
  useEffect(() => {
    const loadModels = async () => {
      const models = aiModelService.getAvailableModels()
      setAvailableModels(models)

      // 检查模型可用性
      for (const model of models) {
        const isAvailable = await aiModelService.checkModelAvailability(model.id)
        if (!isAvailable) {
          console.warn(`模型 ${model.name} 不可用`)
        }
      }
    }

    loadModels()
  }, [])

  // 移动端渲染
  if (isMobile) {
    return (
      <MobileContentCreator
        onContentGenerated={handleContentGenerated}
        onContentSaved={handleContentSaved}
        onContentPublished={handleContentPublished}
      />
    )
  }

  // 内容生成处理
  async function handleContentGenerated(content: string) {
    setGeneratedContent(content)

    // 自动进行安全检查
    if (publishConfig.enableSecurity) {
      await performSecurityCheck(content)
    }
  }

  // 内容保存处理
  function handleContentSaved(content: string) {
    console.log("内容已保存:", content)
    // 这里可以调用实际的保存API
  }

  // 内容发布处理
  async function handleContentPublished(content: string, platforms: string[]) {
    try {
      const publishRequest = {
        platforms,
        content: {
          title: contentConfig.topic,
          body: content,
          summary: content.substring(0, 200) + "...",
          tags: contentConfig.keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
        },
        options: {
          autoPublish: publishConfig.autoPublish,
          addWatermark: publishConfig.addWatermark,
          enableComments: true,
        },
      }

      const results = await publishContent(publishRequest)
      console.log("发布结果:", results)

      // 显示发布结果
      const successCount = results.filter((r) => r.success).length
      alert(`成功发布到 ${successCount}/${results.length} 个平台`)
    } catch (error) {
      console.error("发布失败:", error)
      alert("发布失败，请检查平台配置")
    }
  }

  // AI内容生成
  const handleGenerate = async () => {
    if (!contentConfig.topic.trim()) {
      alert("请输入创作主题")
      return
    }

    // 检查API密钥
    const model = availableModels.find((m) => m.id === selectedModel)
    if (model && !model.isLocal && !apiKeys[model.provider]) {
      alert(`请先配置 ${model.provider} 的API密钥`)
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)

    try {
      // 设置API密钥
      Object.entries(apiKeys).forEach(([provider, key]) => {
        if (key) {
          aiModelService.setApiKey(provider, key)
        }
      })

      // 构建提示词
      const prompt = buildPrompt(contentConfig)

      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setGenerationProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      // 调用AI生成
      const response = await generateContent(selectedModel, prompt, {
        temperature: contentConfig.temperature,
        maxTokens: contentConfig.maxTokens,
      })

      clearInterval(progressInterval)
      setGenerationProgress(100)

      setGeneratedContent(response.content)

      // 自动进行安全检查
      if (publishConfig.enableSecurity) {
        await performSecurityCheck(response.content)
      }

      console.log("生成成功，使用Token:", response.usage.totalTokens, "成本:", response.cost)
    } catch (error) {
      console.error("生成失败:", error)
      alert(`内容生成失败: ${error}`)
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
    }
  }

  // 构建提示词
  const buildPrompt = (config: typeof contentConfig) => {
    return `请根据以下要求创作内容：

主题：${config.topic}
内容类型：${config.type}
写作风格：${config.style}
内容长度：${config.length}
语调：${config.tone}
目标受众：${config.targetAudience}
关键词：${config.keywords}

要求：
1. 内容要原创且有价值
2. 结构清晰，逻辑性强
3. 语言${config.language === "zh-CN" ? "中文" : "英文"}
4. 符合${config.style}风格
5. 包含相关关键词但不要堆砌

请生成高质量的内容。`
  }

  // 安全检查
  const performSecurityCheck = async (content: string) => {
    setIsSecurityChecking(true)

    try {
      const result = await checkContentSafety(content)
      setSecurityCheck(result)

      if (!result.passed) {
        console.warn("内容安全检查未通过:", result.violations)
      }
    } catch (error) {
      console.error("安全检查失败:", error)
    } finally {
      setIsSecurityChecking(false)
    }
  }

  // 复制内容
  const handleCopy = async () => {
    if (!generatedContent) return

    try {
      await navigator.clipboard.writeText(generatedContent)
      alert("内容已复制到剪贴板")
    } catch (error) {
      console.error("复制失败:", error)
    }
  }

  // 保存内容
  const handleSave = () => {
    if (!generatedContent) {
      alert("没有内容可保存")
      return
    }

    handleContentSaved(generatedContent)
    alert("内容已保存到草稿箱")
  }

  // 发布内容
  const handlePublish = async () => {
    if (!generatedContent) {
      alert("没有内容可发布")
      return
    }

    if (publishConfig.platforms.length === 0) {
      alert("请选择发布平台")
      return
    }

    // 检查安全性
    if (publishConfig.enableSecurity && securityCheck && !securityCheck.passed) {
      const confirm = window.confirm("内容安全检查未通过，是否仍要发布？")
      if (!confirm) return
    }

    await handleContentPublished(generatedContent, publishConfig.platforms)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center justify-center mb-4">
          <Brain className="w-10 h-10 mr-3 text-purple-600" />
          增强AI智能创作中心
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          集成多种AI模型、内容安全检查、多平台发布的一站式智能创作解决方案
        </p>

        {/* 设备切换提示 */}
        <div className="flex items-center justify-center mt-4 space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Monitor className="w-4 h-4" />
            <span>桌面版</span>
          </div>
          <div className="w-px h-4 bg-gray-300"></div>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Smartphone className="w-4 h-4" />
            <span>移动版 (自动切换)</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            智能创作
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            安全检查
          </TabsTrigger>
          <TabsTrigger value="publish" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            发布管理
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            模型设置
          </TabsTrigger>
        </TabsList>

        {/* 智能创作面板 */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 创作配置 */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    创作配置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>AI模型</Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{model.name}</span>
                              <div className="flex items-center space-x-2">
                                {model.isLocal && <Badge variant="secondary">本地</Badge>}
                                <Badge variant={model.costPerToken === 0 ? "default" : "outline"}>
                                  {model.costPerToken === 0 ? "免费" : "付费"}
                                </Badge>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>创作主题</Label>
                    <Input
                      placeholder="请输入您想要创作的主题..."
                      value={contentConfig.topic}
                      onChange={(e) => setContentConfig({ ...contentConfig, topic: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>内容类型</Label>
                      <Select
                        value={contentConfig.type}
                        onValueChange={(value) => setContentConfig({ ...contentConfig, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="article">技术文章</SelectItem>
                          <SelectItem value="social">社交文案</SelectItem>
                          <SelectItem value="marketing">营销内容</SelectItem>
                          <SelectItem value="report">分析报告</SelectItem>
                          <SelectItem value="tutorial">教程指南</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>写作风格</Label>
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
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>内容长度</Label>
                      <Select
                        value={contentConfig.length}
                        onValueChange={(value) => setContentConfig({ ...contentConfig, length: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">简短 (500字)</SelectItem>
                          <SelectItem value="medium">中等 (1000字)</SelectItem>
                          <SelectItem value="long">详细 (2000字)</SelectItem>
                          <SelectItem value="extended">深度 (3000字+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>语调风格</Label>
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
                  </div>

                  <div>
                    <Label>关键词</Label>
                    <Input
                      placeholder="用逗号分隔多个关键词"
                      value={contentConfig.keywords}
                      onChange={(e) => setContentConfig({ ...contentConfig, keywords: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>目标受众</Label>
                    <Select
                      value={contentConfig.targetAudience}
                      onValueChange={(value) => setContentConfig({ ...contentConfig, targetAudience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">一般用户</SelectItem>
                        <SelectItem value="technical">技术人员</SelectItem>
                        <SelectItem value="business">商务人士</SelectItem>
                        <SelectItem value="students">学生群体</SelectItem>
                        <SelectItem value="professionals">专业人士</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 高级参数 */}
                  <div className="space-y-3 pt-3 border-t">
                    <div>
                      <Label>创作温度: {contentConfig.temperature}</Label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={contentConfig.temperature}
                        onChange={(e) =>
                          setContentConfig({ ...contentConfig, temperature: Number.parseFloat(e.target.value) })
                        }
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>保守</span>
                        <span>创新</span>
                      </div>
                    </div>

                    <div>
                      <Label>最大Token数</Label>
                      <Input
                        type="number"
                        min="100"
                        max="4000"
                        value={contentConfig.maxTokens}
                        onChange={(e) =>
                          setContentConfig({ ...contentConfig, maxTokens: Number.parseInt(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  {isGenerating && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>AI创作进度</span>
                        <span>{generationProgress}%</span>
                      </div>
                      <Progress value={generationProgress} className="w-full" />
                    </div>
                  )}

                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !contentConfig.topic.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        AI创作中...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        开始AI创作
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* 内容预览和编辑 */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Eye className="w-5 h-5 mr-2 text-green-600" />
                      内容预览与编辑
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="w-4 h-4 mr-1" />
                        复制
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleSave}>
                        <Save className="w-4 h-4 mr-1" />
                        保存
                      </Button>
                      <Button size="sm" onClick={handlePublish}>
                        <Send className="w-4 h-4 mr-1" />
                        发布
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedContent ? (
                    <div className="space-y-4">
                      <Textarea
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                        rows={20}
                        className="font-mono text-sm"
                      />

                      {/* 内容统计 */}
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{generatedContent.length}</div>
                          <div className="text-sm text-gray-600">字符数</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {Math.ceil(generatedContent.length / 300)}
                          </div>
                          <div className="text-sm text-gray-600">阅读分钟</div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {securityCheck ? securityCheck.score : "--"}
                          </div>
                          <div className="text-sm text-gray-600">安全评分</div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">8.5</div>
                          <div className="text-sm text-gray-600">质量评分</div>
                        </div>
                      </div>

                      {/* 安全检查结果 */}
                      {securityCheck && (
                        <Alert
                          className={securityCheck.passed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
                        >
                          <div className="flex items-center">
                            {securityCheck.passed ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                            )}
                            <AlertDescription className="ml-2">
                              {securityCheck.passed
                                ? "内容安全检查通过"
                                : `发现 ${securityCheck.violations.length} 个安全问题`}
                            </AlertDescription>
                          </div>
                          {!securityCheck.passed && (
                            <div className="mt-2 space-y-1">
                              {securityCheck.violations.slice(0, 3).map((violation: any, index: number) => (
                                <div key={index} className="text-sm text-red-700">
                                  • {violation.message}
                                </div>
                              ))}
                            </div>
                          )}
                        </Alert>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                      <Sparkles className="w-16 h-16 mb-4 text-gray-300" />
                      <p className="text-lg font-medium">等待AI创作</p>
                      <p className="text-sm">请配置创作参数并点击"开始AI创作"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 安全检查面板 */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-6 h-6 mr-2 text-blue-600" />
                内容安全检查
              </CardTitle>
              <CardDescription>使用AI和规则引擎对内容进行全面的安全性检查</CardDescription>
            </CardHeader>
            <CardContent>
              {securityCheck ? (
                <div className="space-y-6">
                  {/* 总体评分 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`p-4 rounded-lg ${securityCheck.passed ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">安全状态</span>
                        {securityCheck.passed ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div className={`text-2xl font-bold ${securityCheck.passed ? "text-green-600" : "text-red-600"}`}>
                        {securityCheck.passed ? "通过" : "未通过"}
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="font-medium">安全评分</div>
                      <div className="text-2xl font-bold text-blue-600">{securityCheck.score}/100</div>
                    </div>

                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="font-medium">检测耗时</div>
                      <div className="text-2xl font-bold text-orange-600">{securityCheck.duration}ms</div>
                    </div>
                  </div>

                  {/* 安全检查结果详情 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Card className="bg-white border border-gray-200">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                            合规项 ({securityCheck.compliances?.length || 0})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {securityCheck.compliances?.length > 0 ? (
                            <ul className="space-y-2">
                              {securityCheck.compliances.map((compliance: any, index: number) => (
                                <li key={index} className="flex items-start">
                                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 mr-2" />
                                  <span className="text-sm">{compliance.message}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-gray-500">暂无合规项信息</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <Card className="bg-white border border-gray-200">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                            违规项 ({securityCheck.violations?.length || 0})
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {securityCheck.violations?.length > 0 ? (
                            <ul className="space-y-3">
                              {securityCheck.violations.map((violation: any, index: number) => (
                                <li key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                                  <div className="flex items-center mb-2">
                                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                                    <span className="font-medium text-red-800">{violation.type}</span>
                                  </div>
                                  <p className="text-sm text-red-700 mb-2">{violation.message}</p>
                                  {violation.context && (
                                    <div className="bg-white p-2 rounded text-xs text-red-800 border border-red-100">
                                      相关内容: "{violation.context}"
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-green-600">未发现违规内容</p>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* 详细分类检测结果 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">敏感内容</span>
                        <Badge variant={securityCheck.categories.sensitive ? "destructive" : "success"}>
                          {securityCheck.categories.sensitive ? "存在" : "未发现"}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-gray-800">{securityCheck.scores.sensitive || 0}</div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">版权风险</span>
                        <Badge variant={securityCheck.categories.copyright ? "destructive" : "success"}>
                          {securityCheck.categories.copyright ? "存在" : "未发现"}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-gray-800">{securityCheck.scores.copyright || 0}</div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">政治敏感</span>
                        <Badge variant={securityCheck.categories.political ? "destructive" : "success"}>
                          {securityCheck.categories.political ? "存在" : "未发现"}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-gray-800">{securityCheck.scores.political || 0}</div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">广告营销</span>
                        <Badge variant={securityCheck.categories.advertisement ? "warning" : "success"}>
                          {securityCheck.categories.advertisement ? "存在" : "未发现"}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-gray-800">{securityCheck.scores.advertisement || 0}</div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={() => setSecurityCheck(null)}>
                      清除结果
                    </Button>
                    <Button onClick={() => performSecurityCheck(generatedContent)}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      重新检查
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Shield className="w-20 h-20 mb-4 text-gray-300" />
                  <p className="text-lg font-medium">暂无安全检查结果</p>
                  <p className="text-sm mt-2">请先生成内容或上传需要检查的文本</p>
                  {generatedContent && (
                    <Button className="mt-6" onClick={() => performSecurityCheck(generatedContent)}>
                      <Shield className="w-4 h-4 mr-2" />
                      执行安全检查
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 发布管理面板 */}
        <TabsContent value="publish" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Send className="w-5 h-5 mr-2 text-blue-600" />
                多平台发布管理
              </CardTitle>
              <CardDescription>将内容一键发布到多个平台，支持定时发布和内容安全控制</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 发布配置 */}
                <div className="lg:col-span-1 space-y-4">
                  <Card className="bg-white border border-gray-200">
                    <CardHeader>
                      <CardTitle>平台选择</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="wechat"
                            checked={publishConfig.platforms.includes("wechat")}
                            onChange={(e) => {
                              setPublishConfig({
                                ...publishConfig,
                                platforms: e.target.checked
                                  ? [...publishConfig.platforms, "wechat"]
                                  : publishConfig.platforms.filter((p) => p !== "wechat"),
                              })
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          <label for="wechat" className="ml-2 text-sm">
                            微信公众号
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="weibo"
                            checked={publishConfig.platforms.includes("weibo")}
                            onChange={(e) => {
                              setPublishConfig({
                                ...publishConfig,
                                platforms: e.target.checked
                                  ? [...publishConfig.platforms, "weibo"]
                                  : publishConfig.platforms.filter((p) => p !== "weibo"),
                              })
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          <label for="weibo" className="ml-2 text-sm">
                            微博
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="zhihu"
                            checked={publishConfig.platforms.includes("zhihu")}
                            onChange={(e) => {
                              setPublishConfig({
                                ...publishConfig,
                                platforms: e.target.checked
                                  ? [...publishConfig.platforms, "zhihu"]
                                  : publishConfig.platforms.filter((p) => p !== "zhihu"),
                              })
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          <label for="zhihu" className="ml-2 text-sm">
                            知乎
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="douyin"
                            checked={publishConfig.platforms.includes("douyin")}
                            onChange={(e) => {
                              setPublishConfig({
                                ...publishConfig,
                                platforms: e.target.checked
                                  ? [...publishConfig.platforms, "douyin"]
                                  : publishConfig.platforms.filter((p) => p !== "douyin"),
                              })
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          <label for="douyin" className="ml-2 text-sm">
                            抖音
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="bilibili"
                            checked={publishConfig.platforms.includes("bilibili")}
                            onChange={(e) => {
                              setPublishConfig({
                                ...publishConfig,
                                platforms: e.target.checked
                                  ? [...publishConfig.platforms, "bilibili"]
                                  : publishConfig.platforms.filter((p) => p !== "bilibili"),
                              })
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          <label for="bilibili" className="ml-2 text-sm">
                            B站专栏
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="custom"
                            checked={publishConfig.platforms.includes("custom")}
                            onChange={(e) => {
                              setPublishConfig({
                                ...publishConfig,
                                platforms: e.target.checked
                                  ? [...publishConfig.platforms, "custom"]
                                  : publishConfig.platforms.filter((p) => p !== "custom"),
                              })
                            }}
                            className="w-4 h-4 text-blue-600"
                          />
                          <label for="custom" className="ml-2 text-sm">
                            自定义平台
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-gray-200">
                    <CardHeader>
                      <CardTitle>发布设置</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="autoPublish"
                            checked={publishConfig.autoPublish}
                            onChange={(e) => setPublishConfig({ ...publishConfig, autoPublish: e.target.checked })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <label for="autoPublish" className="ml-2 text-sm">
                            自动发布
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="enableSecurity"
                            checked={publishConfig.enableSecurity}
                            onChange={(e) => setPublishConfig({ ...publishConfig, enableSecurity: e.target.checked })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <label for="enableSecurity" className="ml-2 text-sm">
                            发布前安全检查
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="addWatermark"
                            checked={publishConfig.addWatermark}
                            onChange={(e) => setPublishConfig({ ...publishConfig, addWatermark: e.target.checked })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <label for="addWatermark" className="ml-2 text-sm">
                            添加水印
                          </label>
                        </div>

                        <div>
                          <Label>发布时间</Label>
                          <Input
                            type="datetime-local"
                            value={publishConfig.scheduleTime}
                            onChange={(e) => setPublishConfig({ ...publishConfig, scheduleTime: e.target.value })}
                          />
                          <p className="text-xs text-gray-500 mt-1">留空表示立即发布</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 发布预览 */}
                <div className="lg:col-span-2">
                  <Card className="bg-white border border-gray-200">
                    <CardHeader>
                      <CardTitle>发布预览</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {generatedContent ? (
                        <div className="space-y-6">
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="font-medium mb-2">微信公众号预览</h3>
                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                              <h4 className="text-lg font-bold mb-2">{contentConfig.topic || "文章标题"}</h4>
                              <p className="text-sm text-gray-500 mb-3">
                                发布于 {new Date().toLocaleDateString()} · {Math.ceil(generatedContent.length / 300)}
                                分钟阅读
                              </p>
                              <div className="prose prose-sm max-w-none">
                                <p>{generatedContent.substring(0, 300)}...</p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="font-medium mb-2">微博预览</h3>
                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                  AI
                                </div>
                                <div>
                                  <div className="font-medium">AI创作助手</div>
                                  <div className="text-xs text-gray-500">刚刚</div>
                                </div>
                              </div>
                              <p className="text-sm">
                                {generatedContent.length > 140
                                  ? generatedContent.substring(0, 137) + "..."
                                  : generatedContent}
                              </p>
                              {contentConfig.keywords && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {contentConfig.keywords
                                    .split(",")
                                    .slice(0, 3)
                                    .map((tag, index) => (
                                      <span key={index} className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                        #{tag.trim()}
                                      </span>
                                    ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="font-medium mb-2">知乎预览</h3>
                            <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                              <h4 className="text-lg font-bold mb-2">{contentConfig.topic || "问题标题"}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                <span>AI创作助手</span>
                                <span>·</span>
                                <span>{Math.ceil(generatedContent.length / 300)}分钟阅读</span>
                                <span>·</span>
                                <span>刚刚发布</span>
                              </div>
                              <div className="prose prose-sm max-w-none">
                                <p>{generatedContent.substring(0, 200)}...</p>
                              </div>
                            </div>
                          </div>

                          {/* 发布按钮 */}
                          <div className="flex justify-between items-center pt-4 border-t">
                            <div className="text-sm text-gray-600">
                              将发布到 {publishConfig.platforms.length} 个平台
                            </div>
                            <Button
                              onClick={handlePublish}
                              disabled={!generatedContent || publishConfig.platforms.length === 0}
                              className="bg-gradient-to-r from-green-600 to-blue-600"
                            >
                              <Send className="w-4 h-4 mr-2" />
                              立即发布
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                          <Send className="w-16 h-16 mb-4 text-gray-300" />
                          <p className="text-lg font-medium">等待发布内容</p>
                          <p className="text-sm">请先生成内容再进行发布预览</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 模型设置面板 */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API密钥配置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  API密钥配置
                </CardTitle>
                <CardDescription>配置各个AI模型提供商的API密钥</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>OpenAI API Key</Label>
                  <Input
                    type="password"
                    placeholder="sk-..."
                    value={apiKeys.OpenAI || ""}
                    onChange={(e) => setApiKeys({ ...apiKeys, OpenAI: e.target.value })}
                  />
                </div>

                <div>
                  <Label>阿里云 API Key</Label>
                  <Input
                    type="password"
                    placeholder="通义千问API密钥"
                    value={apiKeys["阿里云"] || ""}
                    onChange={(e) => setApiKeys({ ...apiKeys, 阿里云: e.target.value })}
                  />
                </div>

                <div>
                  <Label>百川智能 API Key</Label>
                  <Input
                    type="password"
                    placeholder="百川API密钥"
                    value={apiKeys["百川智能"] || ""}
                    onChange={(e) => setApiKeys({ ...apiKeys, 百川智能: e.target.value })}
                  />
                </div>

                <div>
                  <Label>智谱AI API Key</Label>
                  <Input
                    type="password"
                    placeholder="ChatGLM API密钥"
                    value={apiKeys["智谱AI"] || ""}
                    onChange={(e) => setApiKeys({ ...apiKeys, 智谱AI: e.target.value })}
                  />
                </div>

                <div>
                  <Label>科大讯飞 API Key</Label>
                  <Input
                    type="password"
                    placeholder="讯飞星火API密钥"
                    value={apiKeys["科大讯飞"] || ""}
                    onChange={(e) => setApiKeys({ ...apiKeys, 科大讯飞: e.target.value })}
                  />
                </div>

                <Button
                  onClick={() => {
                    // 保存API密钥到本地存储
                    localStorage.setItem("ai-api-keys", JSON.stringify(apiKeys))
                    alert("API密钥已保存")
                  }}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  保存配置
                </Button>
              </CardContent>
            </Card>

            {/* 模型状态监控 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-green-600" />
                  模型状态监控
                </CardTitle>
                <CardDescription>查看各个AI模型的可用性和性能状态</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableModels.map((model) => (
                    <div key={model.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            model.status === "active"
                              ? "bg-green-500"
                              : model.status === "error"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        ></div>
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-sm text-gray-500">{model.provider}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {model.isLocal && <Badge variant="secondary">本地</Badge>}
                        <Badge variant={model.costPerToken === 0 ? "default" : "outline"}>
                          {model.costPerToken === 0 ? "免费" : `¥${model.costPerToken}/token`}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const isAvailable = await aiModelService.checkModelAvailability(model.id)
                            alert(`模型 ${model.name} ${isAvailable ? "可用" : "不可用"}`)
                          }}
                        >
                          测试
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 使用统计 */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">使用统计</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">0</div>
                      <div className="text-sm text-gray-600">今日请求</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">¥0.00</div>
                      <div className="text-sm text-gray-600">今日费用</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 高级设置 */}
          <Card>
            <CardHeader>
              <CardTitle>高级设置</CardTitle>
              <CardDescription>配置系统的高级功能和安全选项</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">内容安全</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">启用内容审核</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">敏感词过滤</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">版权检测</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">性能优化</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">启用缓存</span>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">并发请求限制</span>
                      <Select defaultValue="5">
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">请求超时(秒)</span>
                      <Input type="number" defaultValue="30" className="w-20" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 底部状态栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>系统正常</span>
            </div>
            <div>模型: {selectedModel}</div>
            <div>字符: {generatedContent.length}</div>
          </div>

          <div className="flex items-center space-x-2">
            {isSecurityChecking && (
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>安全检查中...</span>
              </div>
            )}
            {securityCheck && (
              <Badge variant={securityCheck.passed ? "success" : "destructive"}>安全评分: {securityCheck.score}</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
