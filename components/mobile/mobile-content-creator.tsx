"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { EnhancedTouchGestures } from "./enhanced-touch-gestures"
import { MobileButton, MobileInput, MobileSelect } from "./mobile-optimized-components"
import {
  Wand2,
  Sparkles,
  Save,
  Send,
  Copy,
  Eye,
  EyeOff,
  Settings,
  Zap,
  RefreshCw,
  ChevronUp,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
} from "lucide-react"

interface MobileContentCreatorProps {
  onContentGenerated?: (content: string) => void
  onContentSaved?: (content: string) => void
  onContentPublished?: (content: string, platforms: string[]) => void
}

export function MobileContentCreator({
  onContentGenerated,
  onContentSaved,
  onContentPublished,
}: MobileContentCreatorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generatedContent, setGeneratedContent] = useState("")
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["wechat"])

  const [contentConfig, setContentConfig] = useState({
    topic: "",
    type: "article",
    style: "professional",
    length: "medium",
    tone: "informative",
    keywords: "",
  })

  const [panelStates, setPanelStates] = useState({
    config: true,
    preview: false,
    platforms: false,
  })

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const speechSynthesis = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      speechSynthesis.current = window.speechSynthesis
    }
  }, [])

  // 触摸手势处理
  const handleRefresh = async () => {
    if (generatedContent) {
      await handleGenerate()
    }
  }

  const handleSwipeLeft = () => {
    // 切换到下一个面板
    if (panelStates.config) {
      setPanelStates({ config: false, preview: true, platforms: false })
    } else if (panelStates.preview) {
      setPanelStates({ config: false, preview: false, platforms: true })
    }
  }

  const handleSwipeRight = () => {
    // 切换到上一个面板
    if (panelStates.platforms) {
      setPanelStates({ config: false, preview: true, platforms: false })
    } else if (panelStates.preview) {
      setPanelStates({ config: true, preview: false, platforms: false })
    }
  }

  const handleLongPress = () => {
    // 长按复制内容
    if (generatedContent) {
      handleCopy()
    }
  }

  const handleDoubleTap = () => {
    // 双击切换全屏
    setIsFullscreen(!isFullscreen)
  }

  // 生成内容
  const handleGenerate = async () => {
    if (!contentConfig.topic.trim()) {
      alert("请输入创作主题")
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)

    // 模拟生成过程
    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)

          // 生成模拟内容
          const mockContent = `# ${contentConfig.topic}

## 概述

这是一篇关于"${contentConfig.topic}"的${contentConfig.style}风格文章。本文将从多个角度深入探讨这个话题，为读者提供全面而深入的见解。

## 主要内容

### 1. 背景介绍

${contentConfig.topic}作为当前热门话题，受到了广泛关注。随着技术的不断发展和社会需求的变化，这个领域正在经历着深刻的变革。

### 2. 核心要点

- **要点一**：深入分析当前现状和发展趋势
- **要点二**：探讨面临的主要挑战和机遇
- **要点三**：提出切实可行的解决方案

### 3. 实践应用

在实际应用中，我们需要考虑以下几个方面：

1. **技术层面**：确保技术方案的可行性和稳定性
2. **管理层面**：建立完善的管理制度和流程
3. **人员层面**：加强团队建设和人才培养

## 未来展望

展望未来，${contentConfig.topic}将继续发挥重要作用。我们需要保持开放的心态，积极拥抱变化，不断学习和创新。

## 结论

通过本文的分析，我们可以看出${contentConfig.topic}的重要性和发展潜力。希望本文能为读者提供有价值的参考和启发。

---

*关键词：${contentConfig.keywords || contentConfig.topic}*
*字数：约${contentConfig.length === "short" ? "500" : contentConfig.length === "medium" ? "800" : "1200"}字*`

          setGeneratedContent(mockContent)
          onContentGenerated?.(mockContent)

          // 自动切换到预览模式
          setPanelStates({ config: false, preview: true, platforms: false })

          return 100
        }
        return prev + 8
      })
    }, 150)
  }

  // 保存内容
  const handleSave = () => {
    if (!generatedContent) {
      alert("没有内容可保存")
      return
    }

    onContentSaved?.(generatedContent)

    // 触觉反馈
    if (navigator.vibrate) {
      navigator.vibrate(100)
    }

    alert("内容已保存到草稿箱")
  }

  // 复制内容
  const handleCopy = async () => {
    if (!generatedContent) return

    try {
      await navigator.clipboard.writeText(generatedContent)

      // 触觉反馈
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 50])
      }

      alert("内容已复制到剪贴板")
    } catch (error) {
      console.error("复制失败:", error)
    }
  }

  // 语音播放
  const handleSpeak = () => {
    if (!speechSynthesis.current || !generatedContent) return

    if (isSpeaking) {
      speechSynthesis.current.cancel()
      setIsSpeaking(false)
    } else {
      const utterance = new SpeechSynthesisUtterance(generatedContent)
      utterance.lang = "zh-CN"
      utterance.rate = 0.8
      utterance.pitch = 1

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      speechSynthesis.current.speak(utterance)
    }
  }

  // 发布内容
  const handlePublish = () => {
    if (!generatedContent) {
      alert("没有内容可发布")
      return
    }

    if (selectedPlatforms.length === 0) {
      alert("请选择发布平台")
      return
    }

    onContentPublished?.(generatedContent, selectedPlatforms)
    alert(`内容将发布到 ${selectedPlatforms.length} 个平台`)
  }

  // 切换面板
  const togglePanel = (panel: keyof typeof panelStates) => {
    setPanelStates((prev) => ({
      config: false,
      preview: false,
      platforms: false,
      [panel]: !prev[panel],
    }))
  }

  const platforms = [
    { id: "wechat", name: "微信公众号", color: "bg-green-500" },
    { id: "workwechat", name: "企业微信", color: "bg-blue-500" },
    { id: "feishu", name: "飞书", color: "bg-blue-400" },
    { id: "dingtalk", name: "钉钉", color: "bg-blue-600" },
    { id: "douyin", name: "抖音", color: "bg-red-500" },
  ]

  return (
    <EnhancedTouchGestures
      onRefresh={handleRefresh}
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      onLongPress={handleLongPress}
      onDoubleTap={handleDoubleTap}
      enablePullToRefresh={true}
      enableSwipeNavigation={true}
      enableLongPress={true}
      enableDoubleTap={true}
      className={`min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 ${isFullscreen ? "fixed inset-0 z-50" : ""}`}
    >
      <div className="p-4 space-y-4">
        {/* 顶部工具栏 */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-lg">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <span className="font-bold text-lg">AI创作</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)} className="p-2">
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            {generatedContent && (
              <Button variant="ghost" size="sm" onClick={handleSpeak} className="p-2">
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>

        {/* 面板导航 */}
        <div className="flex bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg">
          <button
            onClick={() => togglePanel("config")}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              panelStates.config ? "bg-blue-500 text-white shadow-md" : "text-gray-600 hover:bg-blue-50"
            }`}
          >
            <Settings className="w-4 h-4 mx-auto mb-1" />
            配置
          </button>
          <button
            onClick={() => togglePanel("preview")}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              panelStates.preview ? "bg-green-500 text-white shadow-md" : "text-gray-600 hover:bg-green-50"
            }`}
          >
            {isPreviewMode ? <EyeOff className="w-4 h-4 mx-auto mb-1" /> : <Eye className="w-4 h-4 mx-auto mb-1" />}
            预览
          </button>
          <button
            onClick={() => togglePanel("platforms")}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              panelStates.platforms ? "bg-purple-500 text-white shadow-md" : "text-gray-600 hover:bg-purple-50"
            }`}
          >
            <Send className="w-4 h-4 mx-auto mb-1" />
            发布
          </button>
        </div>

        {/* 配置面板 */}
        {panelStates.config && (
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wand2 className="w-5 h-5 mr-2" />
                  创作配置
                </div>
                <button onClick={() => togglePanel("config")}>
                  <ChevronUp className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <MobileInput
                label="创作主题"
                placeholder="请输入您想要创作的主题..."
                value={contentConfig.topic}
                onChange={(value) => setContentConfig({ ...contentConfig, topic: value })}
              />

              <div className="grid grid-cols-2 gap-3">
                <MobileSelect
                  label="内容类型"
                  value={contentConfig.type}
                  options={[
                    { value: "article", label: "技术文章" },
                    { value: "social", label: "社交文案" },
                    { value: "marketing", label: "营销内容" },
                    { value: "report", label: "分析报告" },
                  ]}
                  onChange={(value) => setContentConfig({ ...contentConfig, type: value })}
                />

                <MobileSelect
                  label="写作风格"
                  value={contentConfig.style}
                  options={[
                    { value: "professional", label: "专业" },
                    { value: "casual", label: "轻松" },
                    { value: "creative", label: "创意" },
                    { value: "academic", label: "学术" },
                  ]}
                  onChange={(value) => setContentConfig({ ...contentConfig, style: value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MobileSelect
                  label="内容长度"
                  value={contentConfig.length}
                  options={[
                    { value: "short", label: "简短" },
                    { value: "medium", label: "中等" },
                    { value: "long", label: "详细" },
                  ]}
                  onChange={(value) => setContentConfig({ ...contentConfig, length: value })}
                />

                <MobileSelect
                  label="语调"
                  value={contentConfig.tone}
                  options={[
                    { value: "informative", label: "信息性" },
                    { value: "persuasive", label: "说服性" },
                    { value: "entertaining", label: "娱乐性" },
                    { value: "educational", label: "教育性" },
                  ]}
                  onChange={(value) => setContentConfig({ ...contentConfig, tone: value })}
                />
              </div>

              <MobileInput
                label="关键词"
                placeholder="用逗号分隔多个关键词"
                value={contentConfig.keywords}
                onChange={(value) => setContentConfig({ ...contentConfig, keywords: value })}
              />

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>AI创作进度</span>
                    <span>{Math.round(generationProgress)}%</span>
                  </div>
                  <Progress value={generationProgress} className="w-full" />
                </div>
              )}

              <MobileButton
                onClick={handleGenerate}
                disabled={isGenerating || !contentConfig.topic.trim()}
                fullWidth
                className="bg-gradient-to-r from-blue-600 to-purple-600"
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
              </MobileButton>
            </CardContent>
          </Card>
        )}

        {/* 预览面板 */}
        {panelStates.preview && generatedContent && (
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  内容预览
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => setIsPreviewMode(!isPreviewMode)} className="p-1 hover:bg-white/20 rounded">
                    {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => togglePanel("preview")}>
                    <ChevronUp className="w-5 h-5" />
                  </button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {isPreviewMode ? (
                <div className="prose prose-sm max-w-none">
                  {generatedContent.split("\n").map((line, index) => {
                    if (line.startsWith("# ")) {
                      return (
                        <h1 key={index} className="text-xl font-bold mb-3">
                          {line.substring(2)}
                        </h1>
                      )
                    } else if (line.startsWith("## ")) {
                      return (
                        <h2 key={index} className="text-lg font-semibold mb-2 mt-4">
                          {line.substring(3)}
                        </h2>
                      )
                    } else if (line.startsWith("### ")) {
                      return (
                        <h3 key={index} className="text-base font-medium mb-2 mt-3">
                          {line.substring(4)}
                        </h3>
                      )
                    } else if (line.trim() === "") {
                      return <br key={index} />
                    } else {
                      return (
                        <p key={index} className="mb-2 text-sm leading-relaxed">
                          {line}
                        </p>
                      )
                    }
                  })}
                </div>
              ) : (
                <Textarea
                  ref={textareaRef}
                  value={generatedContent}
                  onChange={(e) => setGeneratedContent(e.target.value)}
                  rows={15}
                  className="font-mono text-xs resize-none"
                />
              )}

              <div className="mt-4 grid grid-cols-3 gap-2">
                <MobileButton variant="outline" onClick={handleCopy}>
                  <Copy className="w-4 h-4 mr-1" />
                  复制
                </MobileButton>
                <MobileButton variant="outline" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-1" />
                  保存
                </MobileButton>
                <MobileButton onClick={() => togglePanel("platforms")}>
                  <Send className="w-4 h-4 mr-1" />
                  发布
                </MobileButton>
              </div>

              {/* 内容统计 */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-lg font-bold text-blue-600">{generatedContent.length}</div>
                  <div className="text-xs text-gray-600">字符数</div>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-lg font-bold text-green-600">{Math.ceil(generatedContent.length / 300)}</div>
                  <div className="text-xs text-gray-600">阅读分钟</div>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <div className="text-lg font-bold text-purple-600">8.5</div>
                  <div className="text-xs text-gray-600">质量评分</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 发布平台面板 */}
        {panelStates.platforms && (
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  发布平台
                </div>
                <button onClick={() => togglePanel("platforms")}>
                  <ChevronUp className="w-5 h-5" />
                </button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                    selectedPlatforms.includes(platform.id)
                      ? "border-purple-300 bg-purple-50"
                      : "border-gray-200 bg-white"
                  }`}
                  onClick={() => {
                    setSelectedPlatforms((prev) =>
                      prev.includes(platform.id) ? prev.filter((p) => p !== platform.id) : [...prev, platform.id],
                    )
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedPlatforms.includes(platform.id) ? "border-purple-500 bg-purple-500" : "border-gray-300"
                    }`}
                  >
                    {selectedPlatforms.includes(platform.id) && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </div>
              ))}

              <div className="pt-3 border-t">
                <MobileButton
                  onClick={handlePublish}
                  disabled={!generatedContent || selectedPlatforms.length === 0}
                  fullWidth
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <Send className="w-4 h-4 mr-2" />
                  发布到 {selectedPlatforms.length} 个平台
                </MobileButton>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 空状态提示 */}
        {!generatedContent && !panelStates.config && (
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Wand2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">开始AI创作</h3>
              <p className="text-gray-500 mb-4">配置创作参数，让AI为您生成高质量内容</p>
              <MobileButton onClick={() => togglePanel("config")}>
                <Settings className="w-4 h-4 mr-2" />
                打开配置面板
              </MobileButton>
            </CardContent>
          </Card>
        )}

        {/* 手势提示 */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>💡 下拉刷新重新生成 • 左右滑动切换面板</p>
          <p>长按复制内容 • 双击切换全屏</p>
        </div>
      </div>
    </EnhancedTouchGestures>
  )
}
