"use client"

import { useState, useEffect } from "react"
import { MobileContentCreator } from "@/components/mobile/mobile-content-creator"
import { MobileAIAssistant } from "@/components/mobile/mobile-ai-assistant"
import { EnhancedMobileTouchControls } from "@/components/mobile/enhanced-mobile-touch-controls"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Bot, Wand2, MessageCircle, Settings, Eye, Zap, Shield, Globe } from "lucide-react"

export default function MobileAIPage() {
  const [activeMode, setActiveMode] = useState<"creator" | "assistant" | "reader">("creator")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isOnline, setIsOnline] = useState(true)

  // 检测网络状态
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleContentGenerated = (content: string) => {
    setGeneratedContent(content)
  }

  const handleContentSaved = (content: string) => {
    console.log("内容已保存:", content)
    // 这里可以调用实际的保存API
  }

  const handleContentPublished = (content: string, platforms: string[]) => {
    console.log("内容已发布:", { content, platforms })
    // 这里可以调用实际的发布API
  }

  const handleMessageSent = (message: string) => {
    console.log("消息已发送:", message)
  }

  const handleTouchAction = (action: string, data?: any) => {
    console.log("触摸操作:", action, data)

    switch (action) {
      case "refresh":
        window.location.reload()
        break
      case "share":
        // 处理分享
        break
      case "double-tap":
        // 处理双击
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 状态栏 */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="font-bold text-lg">移动AI创作中心</h1>
              <p className="text-xs text-gray-500">智能创作 • 语音交互 • 触摸控制</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant={isOnline ? "default" : "destructive"} className="text-xs">
              {isOnline ? (
                <>
                  <Globe className="w-3 h-3 mr-1" />
                  在线
                </>
              ) : (
                "离线"
              )}
            </Badge>
          </div>
        </div>
      </div>

      {/* 模式切换 */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 p-3">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveMode("creator")}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeMode === "creator" ? "bg-blue-500 text-white shadow-md" : "text-gray-600 hover:bg-blue-50"
            }`}
          >
            <Wand2 className="w-4 h-4 mx-auto mb-1" />
            智能创作
          </button>

          <button
            onClick={() => setActiveMode("assistant")}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeMode === "assistant" ? "bg-green-500 text-white shadow-md" : "text-gray-600 hover:bg-green-50"
            }`}
          >
            <Bot className="w-4 h-4 mx-auto mb-1" />
            AI助手
          </button>

          <button
            onClick={() => setActiveMode("reader")}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeMode === "reader" ? "bg-purple-500 text-white shadow-md" : "text-gray-600 hover:bg-purple-50"
            }`}
          >
            <Eye className="w-4 h-4 mx-auto mb-1" />
            智能阅读
          </button>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1">
        {activeMode === "creator" && (
          <MobileContentCreator
            onContentGenerated={handleContentGenerated}
            onContentSaved={handleContentSaved}
            onContentPublished={handleContentPublished}
          />
        )}

        {activeMode === "assistant" && (
          <MobileAIAssistant onMessageSent={handleMessageSent} onContentGenerated={handleContentGenerated} />
        )}

        {activeMode === "reader" && (
          <EnhancedMobileTouchControls
            content={generatedContent || "暂无内容，请先使用智能创作或AI助手生成内容。"}
            onAction={handleTouchAction}
            className="h-full"
          />
        )}
      </div>

      {/* 功能特性展示 */}
      {!generatedContent && activeMode === "reader" && (
        <div className="p-6">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <Eye className="w-16 h-16 mx-auto mb-4 text-purple-500" />
                <h3 className="text-xl font-bold mb-2">智能阅读模式</h3>
                <p className="text-gray-600">体验强大的移动端触摸控制和语音功能</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <h4 className="font-medium mb-1">手势控制</h4>
                  <p className="text-xs text-gray-600">滑动、双击、长按等丰富手势</p>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <h4 className="font-medium mb-1">语音交互</h4>
                  <p className="text-xs text-gray-600">语音输入和智能朗读</p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-medium mb-1">安全检查</h4>
                  <p className="text-xs text-gray-600">内容安全和隐私保护</p>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Settings className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                  <h4 className="font-medium mb-1">个性化</h4>
                  <p className="text-xs text-gray-600">自定义设置和偏好</p>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={() => setActiveMode("creator")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  开始创作内容
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
