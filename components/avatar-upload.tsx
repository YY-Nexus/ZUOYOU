"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Camera, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AvatarUploadProps {
  currentAvatar?: string
  onAvatarChange?: (avatar: string) => void
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function AvatarUpload({ currentAvatar, onAvatarChange, size = "lg", className }: AvatarUploadProps) {
  const [avatar, setAvatar] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setIsMounted(true)
    // 设置默认头像为系统Logo
    const defaultAvatar = "/images/yanyu-cloud-3d-logo.png"
    const savedAvatar =
      currentAvatar || (typeof window !== "undefined" ? localStorage.getItem("user_avatar") : null) || defaultAvatar
    setAvatar(savedAvatar)
  }, [currentAvatar])

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-40 h-40",
  }

  const handleFileSelect = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("请选择图片文件")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("图片大小不能超过5MB")
        return
      }

      setIsUploading(true)

      try {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          if (result) {
            setAvatar(result)
            onAvatarChange?.(result)
            if (typeof window !== "undefined") {
              localStorage.setItem("user_avatar", result)
            }
          }
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error("头像上传失败:", error)
        alert("头像上传失败，请重试")
      } finally {
        setIsUploading(false)
      }
    },
    [onAvatarChange],
  )

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemove = () => {
    const defaultAvatar = "/images/yanyu-cloud-3d-logo.png"
    setAvatar(defaultAvatar)
    onAvatarChange?.(defaultAvatar)
    if (typeof window !== "undefined") {
      localStorage.setItem("user_avatar", defaultAvatar)
    }
  }

  if (!isMounted) {
    return (
      <div className={cn("flex flex-col items-center space-y-4", className)}>
        <div className={cn("rounded-full bg-gray-200 animate-pulse", sizeClasses[size])} />
        <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center space-y-4", className)}>
      <div
        className={cn("relative group cursor-pointer transition-all duration-200", isDragging && "scale-105")}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Avatar className={cn(sizeClasses[size], "border-4 border-white shadow-lg")}>
          <AvatarImage src={avatar || "/placeholder.svg"} alt="用户头像" />
          <AvatarFallback className="bg-gradient-to-r from-sky-400 to-blue-500 text-white text-xl font-bold">
            用
          </AvatarFallback>
        </Avatar>

        <div
          className={cn(
            "absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
            isUploading && "opacity-100",
          )}
        >
          {isUploading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="w-6 h-6 text-white" />
          )}
        </div>

        {avatar !== "/images/yanyu-cloud-3d-logo.png" && (
          <Button
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              handleRemove()
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      <div className="text-center space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClick}
          disabled={isUploading}
          className="flex items-center space-x-2 bg-transparent"
        >
          <Upload className="w-4 h-4" />
          <span>{isUploading ? "上传中..." : "更换头像"}</span>
        </Button>

        <p className="text-xs text-gray-500">支持 JPG、PNG 格式，最大 5MB</p>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  )
}
