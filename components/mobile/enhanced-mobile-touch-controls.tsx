"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Share2,
  MessageCircle,
  Settings,
  RefreshCw,
} from "lucide-react"

interface TouchControlsProps {
  content: string
  onAction?: (action: string, data?: any) => void
  className?: string
}

interface GestureState {
  startX: number
  startY: number
  startTime: number
  currentX: number
  currentY: number
  isPressed: boolean
  gestureType: string | null
}

export function EnhancedMobileTouchControls({ content, onAction, className = "" }: TouchControlsProps) {
  const [isReading, setIsReading] = useState(false)
  const [readingSpeed, setReadingSpeed] = useState(1.0)
  const [fontSize, setFontSize] = useState(16)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [gestureState, setGestureState] = useState<GestureState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    currentX: 0,
    currentY: 0,
    isPressed: false,
    gestureType: null,
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 语音合成初始化
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      speechRef.current = new SpeechSynthesisUtterance()
      speechRef.current.lang = "zh-CN"
      speechRef.current.rate = readingSpeed
      speechRef.current.pitch = 1
      speechRef.current.volume = 0.8
    }
  }, [readingSpeed])

  // 自动隐藏控制栏
  useEffect(() => {
    if (showControls) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [showControls])

  // 触摸开始
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    setGestureState({
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      currentX: touch.clientX,
      currentY: touch.clientY,
      isPressed: true,
      gestureType: null,
    })

    // 显示控制栏
    setShowControls(true)

    // 触觉反馈
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
  }, [])

  // 触摸移动
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!gestureState.isPressed) return

      const touch = e.touches[0]
      const deltaX = touch.clientX - gestureState.startX
      const deltaY = touch.clientY - gestureState.startY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      setGestureState((prev) => ({
        ...prev,
        currentX: touch.clientX,
        currentY: touch.clientY,
      }))

      // 判断手势类型
      if (distance > 30) {
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
        let gestureType = ""

        if (Math.abs(angle) < 30) {
          gestureType = "swipe-right"
        } else if (Math.abs(angle) > 150) {
          gestureType = "swipe-left"
        } else if (angle > 60 && angle < 120) {
          gestureType = "swipe-down"
        } else if (angle < -60 && angle > -120) {
          gestureType = "swipe-up"
        }

        if (gestureType !== gestureState.gestureType) {
          setGestureState((prev) => ({ ...prev, gestureType }))

          // 触觉反馈
          if (navigator.vibrate) {
            navigator.vibrate(20)
          }
        }
      }
    },
    [gestureState],
  )

  // 触摸结束
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const duration = Date.now() - gestureState.startTime
      const deltaX = gestureState.currentX - gestureState.startX
      const deltaY = gestureState.currentY - gestureState.startY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // 处理不同手势
      if (duration < 200 && distance < 10) {
        // 单击
        handleTap()
      } else if (duration > 500 && distance < 20) {
        // 长按
        handleLongPress()
      } else if (distance > 50) {
        // 滑动手势
        handleSwipeGesture(gestureState.gestureType, distance)
      }

      setGestureState((prev) => ({
        ...prev,
        isPressed: false,
        gestureType: null,
      }))
    },
    [gestureState],
  )

  // 双击检测
  const [lastTapTime, setLastTapTime] = useState(0)
  const handleTap = useCallback(() => {
    const now = Date.now()
    if (now - lastTapTime < 300) {
      // 双击
      handleDoubleTap()
    }
    setLastTapTime(now)
  }, [lastTapTime])

  // 处理双击
  const handleDoubleTap = useCallback(() => {
    setIsFullscreen(!isFullscreen)
    onAction?.("double-tap", { fullscreen: !isFullscreen })

    // 触觉反馈
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50])
    }
  }, [isFullscreen, onAction])

  // 处理长按
  const handleLongPress = useCallback(() => {
    // 复制内容
    if (content) {
      navigator.clipboard.writeText(content).then(() => {
        onAction?.("long-press", { action: "copy" })

        // 触觉反馈
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100])
        }
      })
    }
  }, [content, onAction])

  // 处理滑动手势
  const handleSwipeGesture = useCallback(
    (gestureType: string | null, distance: number) => {
      switch (gestureType) {
        case "swipe-left":
          // 左滑：下一页/下一章节
          onAction?.("swipe-left", { distance })
          break
        case "swipe-right":
          // 右滑：上一页/上一章节
          onAction?.("swipe-right", { distance })
          break
        case "swipe-up":
          // 上滑：增大字体
          if (distance > 100) {
            setFontSize((prev) => Math.min(prev + 2, 24))
            onAction?.("swipe-up", { fontSize: fontSize + 2 })
          }
          break
        case "swipe-down":
          // 下滑：减小字体
          if (distance > 100) {
            setFontSize((prev) => Math.max(prev - 2, 12))
            onAction?.("swipe-down", { fontSize: fontSize - 2 })
          }
          break
      }

      // 触觉反馈
      if (navigator.vibrate) {
        navigator.vibrate(30)
      }
    },
    [fontSize, onAction],
  )

  // 语音播放控制
  const toggleReading = useCallback(() => {
    if (!speechRef.current || !content) return

    if (isReading) {
      window.speechSynthesis.cancel()
      setIsReading(false)
    } else {
      speechRef.current.text = content
      speechRef.current.onstart = () => setIsReading(true)
      speechRef.current.onend = () => setIsReading(false)
      speechRef.current.onerror = () => setIsReading(false)

      window.speechSynthesis.speak(speechRef.current)
    }

    onAction?.("toggle-reading", { isReading: !isReading })
  }, [isReading, content, onAction])

  // 调整语速
  const adjustReadingSpeed = useCallback(
    (delta: number) => {
      const newSpeed = Math.max(0.5, Math.min(2.0, readingSpeed + delta))
      setReadingSpeed(newSpeed)

      if (speechRef.current) {
        speechRef.current.rate = newSpeed
      }

      onAction?.("adjust-speed", { speed: newSpeed })
    },
    [readingSpeed, onAction],
  )

  // 字体大小调整
  const adjustFontSize = useCallback(
    (delta: number) => {
      const newSize = Math.max(12, Math.min(24, fontSize + delta))
      setFontSize(newSize)
      onAction?.("adjust-font", { fontSize: newSize })
    },
    [fontSize, onAction],
  )

  // 分享内容
  const shareContent = useCallback(async () => {
    if (navigator.share && content) {
      try {
        await navigator.share({
          title: "AI生成内容",
          text: content.substring(0, 200) + "...",
          url: window.location.href,
        })
        onAction?.("share", { method: "native" })
      } catch (error) {
        // 降级到复制链接
        navigator.clipboard.writeText(window.location.href)
        onAction?.("share", { method: "copy" })
      }
    } else {
      // 复制内容
      navigator.clipboard.writeText(content)
      onAction?.("share", { method: "copy" })
    }

    // 触觉反馈
    if (navigator.vibrate) {
      navigator.vibrate([50, 50, 50])
    }
  }, [content, onAction])

  return (
    <div
      ref={containerRef}
      className={`relative ${isFullscreen ? "fixed inset-0 z-50 bg-white" : ""} ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 内容区域 */}
      <div className="p-4 select-none" style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}>
        {content ? (
          <div className="prose prose-sm max-w-none">
            {content.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>暂无内容</p>
            </div>
          </div>
        )}
      </div>

      {/* 手势指示器 */}
      {gestureState.isPressed && gestureState.gestureType && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-4 py-2 rounded-lg z-50">
          <div className="flex items-center space-x-2">
            {gestureState.gestureType === "swipe-left" && (
              <>
                <span>←</span>
                <span>下一页</span>
              </>
            )}
            {gestureState.gestureType === "swipe-right" && (
              <>
                <span>→</span>
                <span>上一页</span>
              </>
            )}
            {gestureState.gestureType === "swipe-up" && (
              <>
                <span>↑</span>
                <span>增大字体</span>
              </>
            )}
            {gestureState.gestureType === "swipe-down" && (
              <>
                <span>↓</span>
                <span>减小字体</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* 控制栏 */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 transition-transform duration-300 ${
          showControls ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="p-4">
          {/* 主要控制按钮 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleReading}
                className="flex items-center space-x-1 bg-transparent"
              >
                {isReading ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isReading ? "暂停" : "朗读"}</span>
              </Button>

              <Button variant="outline" size="sm" onClick={() => adjustFontSize(-2)} disabled={fontSize <= 12}>
                <ZoomOut className="w-4 h-4" />
              </Button>

              <span className="text-sm text-gray-600">{fontSize}px</span>

              <Button variant="outline" size="sm" onClick={() => adjustFontSize(2)} disabled={fontSize >= 24}>
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={shareContent}>
                <Share2 className="w-4 h-4" />
              </Button>

              <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* 语速控制 */}
          {isReading && (
            <div className="flex items-center justify-center space-x-4 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustReadingSpeed(-0.1)}
                disabled={readingSpeed <= 0.5}
              >
                慢
              </Button>
              <span className="text-sm text-gray-600 min-w-16 text-center">{readingSpeed.toFixed(1)}x</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => adjustReadingSpeed(0.1)}
                disabled={readingSpeed >= 2.0}
              >
                快
              </Button>
            </div>
          )}

          {/* 手势提示 */}
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>💡 双击切换全屏 • 长按复制内容</p>
            <p>上下滑动调整字体 • 左右滑动翻页</p>
          </div>
        </div>
      </div>

      {/* 浮动操作按钮 */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg"
          onClick={() => setShowControls(!showControls)}
        >
          <Settings className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg"
          onClick={() => onAction?.("refresh")}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
