"use client"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { MobileButton, MobileInput } from "./mobile-optimized-components"
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
} from "lucide-react"
import type SpeechRecognition from "speech-recognition"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
  reactions?: string[]
}

interface MobileAIAssistantProps {
  onMessageSent?: (message: string) => void
  onContentGenerated?: (content: string) => void
  className?: string
}

export function MobileAIAssistant({ onMessageSent, onContentGenerated, className = "" }: MobileAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "您好！我是AI智能助手，可以帮您创作内容、回答问题、提供建议。请告诉我您需要什么帮助？",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

  // 初始化语音识别
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "zh-CN"

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        setIsListening(false)
      }

      recognitionRef.current.onerror = () => {
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }

    // 初始化语音合成
    if (typeof window !== "undefined" && window.speechSynthesis) {
      speechRef.current = new SpeechSynthesisUtterance()
      speechRef.current.lang = "zh-CN"
      speechRef.current.rate = 0.9
      speechRef.current.pitch = 1
      speechRef.current.volume = 0.8
    }
  }, [])

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 发送消息
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    // 触觉反馈
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    onMessageSent?.(userMessage.content)

    try {
      // 添加打字指示器
      const typingMessage: Message = {
        id: "typing",
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isTyping: true,
      }
      setMessages((prev) => [...prev, typingMessage])

      // 模拟AI响应
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // 生成AI回复
      const aiResponse = await generateAIResponse(userMessage.content)

      // 移除打字指示器并添加真实回复
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== "typing")
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: aiResponse,
            timestamp: new Date(),
          },
        ]
      })

      onContentGenerated?.(aiResponse)
    } catch (error) {
      console.error("AI响应失败:", error)
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.id !== "typing")
        return [
          ...filtered,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: "抱歉，我现在无法回复。请稍后再试。",
            timestamp: new Date(),
          },
        ]
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 生成AI回复
  const generateAIResponse = async (userInput: string): Promise<string> => {
    // 这里应该调用实际的AI API
    // 现在使用模拟响应
    const responses = [
      `关于"${userInput}"，我来为您详细分析一下：

这是一个很有趣的话题。从多个角度来看：

1. **技术层面**：需要考虑可行性和实现难度
2. **用户体验**：要确保操作简单直观
3. **性能优化**：保证系统稳定高效

建议您可以从以下几个方面入手：
- 先做市场调研，了解用户需求
- 制定详细的技术方案
- 分阶段实施，逐步优化

您还有什么具体问题需要我帮助解答吗？`,

      `您提到的"${userInput}"确实值得深入探讨。

基于我的分析，这个问题的核心在于如何平衡效率与质量。我建议采用以下策略：

**短期目标：**
- 快速验证核心功能
- 收集用户反馈
- 迭代优化体验

**长期规划：**
- 建立完善的技术架构
- 扩展功能模块
- 提升系统稳定性

如果您需要更具体的实施方案，我可以为您制定详细的行动计划。`,

      `针对"${userInput}"这个话题，我为您整理了以下要点：

🎯 **核心观点**
这个领域正在快速发展，机遇与挑战并存。

📊 **数据分析**
- 市场需求持续增长
- 技术门槛逐渐降低
- 竞争日趋激烈

💡 **实用建议**
1. 关注行业趋势，把握发展机遇
2. 投资技术研发，提升核心竞争力
3. 重视用户体验，建立品牌优势

您希望我针对哪个方面进行更深入的分析？`,
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  // 语音输入
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("您的浏览器不支持语音识别")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)

      // 触觉反馈
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100])
      }
    }
  }

  // 语音播放
  const speakMessage = (content: string) => {
    if (!speechRef.current) return

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    } else {
      speechRef.current.text = content
      speechRef.current.onstart = () => setIsSpeaking(true)
      speechRef.current.onend = () => setIsSpeaking(false)
      speechRef.current.onerror = () => setIsSpeaking(false)

      window.speechSynthesis.speak(speechRef.current)
    }
  }

  // 复制消息
  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)

      // 触觉反馈
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 50])
      }
    } catch (error) {
      console.error("复制失败:", error)
    }
  }

  // 消息反馈
  const reactToMessage = (messageId: string, reaction: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reactions: msg.reactions ? [...msg.reactions, reaction] : [reaction],
            }
          : msg,
      ),
    )

    // 触觉反馈
    if (navigator.vibrate) {
      navigator.vibrate(30)
    }
  }

  return (
    <div className={`flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50 ${className}`}>
      {/* 头部 */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">AI智能助手</h1>
              <p className="text-sm text-gray-500">随时为您提供帮助</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
              在线
            </Badge>
          </div>
        </div>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] ${
                message.role === "user"
                  ? "bg-blue-500 text-white rounded-l-2xl rounded-tr-2xl"
                  : "bg-white text-gray-800 rounded-r-2xl rounded-tl-2xl shadow-md"
              } p-4`}
            >
              {/* 消息头部 */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {message.role === "assistant" ? (
                    <Bot className="w-4 h-4 text-blue-500" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString()}</span>
                </div>

                {message.role === "assistant" && !message.isTyping && (
                  <div className="flex items-center space-x-1">
                    <button onClick={() => speakMessage(message.content)} className="p-1 hover:bg-gray-100 rounded">
                      {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                    <button onClick={() => copyMessage(message.content)} className="p-1 hover:bg-gray-100 rounded">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* 消息内容 */}
              {message.isTyping ? (
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">AI正在思考...</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
              )}

              {/* 消息反馈 */}
              {message.role === "assistant" && !message.isTyping && (
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => reactToMessage(message.id, "👍")}
                      className="flex items-center space-x-1 text-xs text-gray-500 hover:text-green-600"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{message.reactions?.filter((r) => r === "👍").length || 0}</span>
                    </button>
                    <button
                      onClick={() => reactToMessage(message.id, "👎")}
                      className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-600"
                    >
                      <ThumbsDown className="w-3 h-3" />
                      <span>{message.reactions?.filter((r) => r === "👎").length || 0}</span>
                    </button>
                  </div>
                  <button className="text-xs text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <MobileInput
              value={inputMessage}
              onChange={setInputMessage}
              placeholder="输入消息或语音输入..."
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              multiline
              rows={1}
            />
          </div>

          <div className="flex items-center space-x-2">
            <MobileButton
              variant="outline"
              onClick={toggleVoiceInput}
              className={`p-3 ${isListening ? "bg-red-50 border-red-200" : ""}`}
            >
              {isListening ? <MicOff className="w-5 h-5 text-red-500" /> : <Mic className="w-5 h-5" />}
            </MobileButton>

            <MobileButton
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-gradient-to-r from-blue-500 to-purple-500"
            >
              {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </MobileButton>
          </div>
        </div>

        {/* 语音识别状态 */}
        {isListening && (
          <div className="mt-2 flex items-center justify-center space-x-2 text-sm text-red-600">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>正在听取语音输入...</span>
          </div>
        )}

        {/* 快捷操作 */}
        <div className="mt-3 flex items-center justify-center space-x-4">
          <button
            onClick={() => setInputMessage("帮我写一篇关于AI技术的文章")}
            className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full"
          >
            📝 写文章
          </button>
          <button
            onClick={() => setInputMessage("分析一下当前的市场趋势")}
            className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full"
          >
            📊 市场分析
          </button>
          <button
            onClick={() => setInputMessage("给我一些创业建议")}
            className="text-xs text-purple-600 bg-purple-50 px-3 py-1 rounded-full"
          >
            💡 创业建议
          </button>
        </div>
      </div>
    </div>
  )
}
