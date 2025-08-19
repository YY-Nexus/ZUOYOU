"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { commonStyles } from "@/lib/design-system"
import { cn } from "@/lib/utils"

export default function LoginLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-sky-400/20 to-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo 和标题加载状态 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl mb-4 shadow-lg animate-pulse">
            <div className="w-8 h-8 bg-white/20 rounded" />
          </div>
          <div className="h-8 bg-gray-200 rounded-lg mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded-lg w-3/4 mx-auto animate-pulse" />
        </div>

        {/* 登录卡片加载状态 */}
        <Card className={cn(commonStyles.card, "shadow-xl border-0")}>
          <CardHeader className="space-y-1 pb-4">
            <div className="h-8 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-4 bg-gray-200 rounded-lg w-2/3 mx-auto animate-pulse" />
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 标签页加载状态 */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>

            {/* 表单字段加载状态 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              </div>

              {/* 记住我和忘记密码 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                </div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              </div>

              {/* 登录按钮 */}
              <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
            </div>

            {/* 分割线 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或</span>
              </div>
            </div>

            {/* 第三方登录加载状态 */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-12 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* 注册链接 */}
            <div className="text-center">
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse" />
            </div>
          </CardContent>
        </Card>

        {/* 底部信息加载状态 */}
        <div className="text-center mt-8 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  )
}
