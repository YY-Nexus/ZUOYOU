"use client"

import type React from "react"

import { useEffect, useRef, useCallback } from "react"

interface TouchGestureProps {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinch?: (scale: number) => void
  onTap?: () => void
  onDoubleTap?: () => void
  onLongPress?: () => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
  swipeThreshold?: number
  longPressDelay?: number
}

export function MobileTouchGestures({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onTap,
  onDoubleTap,
  onLongPress,
  children,
  className,
  disabled = false,
  swipeThreshold = 50,
  longPressDelay = 500,
}: TouchGestureProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const touchEndRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastTapRef = useRef<number>(0)
  const pinchStartRef = useRef<{ distance: number; scale: number } | null>(null)

  // 计算两点间距离
  const getDistance = useCallback((touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX
    const dy = touch1.clientY - touch2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }, [])

  // 处理触摸开始
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (disabled) return

      const touch = e.touches[0]
      const now = Date.now()

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: now,
      }

      touchEndRef.current = null

      // 多点触控处理（捏合手势）
      if (e.touches.length === 2 && onPinch) {
        const distance = getDistance(e.touches[0], e.touches[1])
        pinchStartRef.current = { distance, scale: 1 }
      }

      // 长按处理
      if (onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          onLongPress()
          // 触觉反馈
          if (navigator.vibrate) {
            navigator.vibrate(100)
          }
        }, longPressDelay)
      }
    },
    [disabled, onPinch, onLongPress, longPressDelay, getDistance],
  )

  // 处理触摸移动
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (disabled) return

      // 清除长按定时器
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }

      // 捏合手势处理
      if (e.touches.length === 2 && onPinch && pinchStartRef.current) {
        const currentDistance = getDistance(e.touches[0], e.touches[1])
        const scale = currentDistance / pinchStartRef.current.distance
        onPinch(scale)
      }

      const touch = e.touches[0]
      touchEndRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      }
    },
    [disabled, onPinch, getDistance],
  )

  // 处理触摸结束
  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (disabled) return

      // 清除长按定时器
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
        longPressTimerRef.current = null
      }

      // 重置捏合状态
      pinchStartRef.current = null

      if (!touchStartRef.current || !touchEndRef.current) {
        // 处理点击事件
        if (touchStartRef.current && onTap) {
          const now = Date.now()
          const timeSinceLastTap = now - lastTapRef.current

          if (timeSinceLastTap < 300 && onDoubleTap) {
            // 双击
            onDoubleTap()
            lastTapRef.current = 0
          } else {
            // 单击
            setTimeout(() => {
              if (Date.now() - lastTapRef.current > 300) {
                onTap()
              }
            }, 300)
            lastTapRef.current = now
          }
        }
        return
      }

      const deltaX = touchEndRef.current.x - touchStartRef.current.x
      const deltaY = touchEndRef.current.y - touchStartRef.current.y
      const deltaTime = touchEndRef.current.time - touchStartRef.current.time

      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      // 检查是否为滑动手势
      if (Math.max(absX, absY) > swipeThreshold && deltaTime < 1000) {
        if (absX > absY) {
          // 水平滑动
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight()
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft()
          }
        } else {
          // 垂直滑动
          if (deltaY > 0 && onSwipeDown) {
            onSwipeDown()
          } else if (deltaY < 0 && onSwipeUp) {
            onSwipeUp()
          }
        }
      }

      touchStartRef.current = null
      touchEndRef.current = null
    },
    [disabled, onTap, onDoubleTap, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, swipeThreshold],
  )

  // 绑定事件监听器
  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    element.addEventListener("touchstart", handleTouchStart, { passive: false })
    element.addEventListener("touchmove", handleTouchMove, { passive: false })
    element.addEventListener("touchend", handleTouchEnd, { passive: false })

    return () => {
      element.removeEventListener("touchstart", handleTouchStart)
      element.removeEventListener("touchmove", handleTouchMove)
      element.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}
