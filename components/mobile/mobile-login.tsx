"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Lock, Phone, User, Building2, Shield, Smartphone, QrCode, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { commonStyles } from "@/lib/design-system"

interface MobileLoginProps {
  onBack?: () => void
}

export function MobileLogin({ onBack }: MobileLoginProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loginType, setLoginType] = useState<"account" | "phone" | "qr">("account")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phone: "",
    verifyCode: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 模拟登录请求
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 登录成功后跳转到主页
    router.push("/")
    setLoading(false)
  }

  const handleSendCode = async () => {
    if (!formData.phone) return
    // 模拟发送验证码
    console.log("发送验证码到:", formData.phone)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 safe-area">
      {/* 移动端头部 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">企业管理系统</h1>
          </div>
        </div>
      </div>

      <div className="p-4 pb-8">
        {/* 欢迎信息 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">欢迎回来</h2>
          <p className="text-gray-600">请登录您的账户继续使用</p>
        </div>

        {/* 登录表单 */}
        <Card className={cn(commonStyles.card, "border-0 shadow-lg")}>
          <CardContent className="p-6 space-y-6">
            <Tabs value={loginType} onValueChange={(value) => setLoginType(value as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 h-12">
                <TabsTrigger value="account" className="flex flex-col items-center space-y-1 h-full">
                  <User className="w-4 h-4" />
                  <span className="text-xs">账号</span>
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex flex-col items-center space-y-1 h-full">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-xs">手机</span>
                </TabsTrigger>
                <TabsTrigger value="qr" className="flex flex-col items-center space-y-1 h-full">
                  <QrCode className="w-4 h-4" />
                  <span className="text-xs">扫码</span>
                </TabsTrigger>
              </TabsList>

              {/* 账号密码登录 */}
              <TabsContent value="account" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-base font-medium text-gray-700">
                      用户名/邮箱
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="请输入用户名或邮箱"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="pl-12 h-14 text-base border-gray-200 focus:border-sky-500 focus:ring-sky-500 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base font-medium text-gray-700">
                      密码
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="请输入密码"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-12 pr-12 h-14 text-base border-gray-200 focus:border-sky-500 focus:ring-sky-500 rounded-xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <button type="button" className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                      忘记密码？
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className={cn(commonStyles.button.primary, "w-full h-14 text-base font-medium rounded-xl")}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>登录中...</span>
                      </div>
                    ) : (
                      "登录"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* 手机号登录 */}
              <TabsContent value="phone" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-medium text-gray-700">
                      手机号
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="请输入手机号"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-12 h-14 text-base border-gray-200 focus:border-sky-500 focus:ring-sky-500 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verifyCode" className="text-base font-medium text-gray-700">
                      验证码
                    </Label>
                    <div className="flex space-x-3">
                      <div className="relative flex-1">
                        <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="verifyCode"
                          type="text"
                          placeholder="请输入验证码"
                          value={formData.verifyCode}
                          onChange={(e) => setFormData({ ...formData, verifyCode: e.target.value })}
                          className="pl-12 h-14 text-base border-gray-200 focus:border-sky-500 focus:ring-sky-500 rounded-xl"
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendCode}
                        className="h-14 px-4 whitespace-nowrap border-gray-200 hover:border-sky-300 hover:text-sky-600 rounded-xl bg-transparent"
                      >
                        发送验证码
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className={cn(commonStyles.button.primary, "w-full h-14 text-base font-medium rounded-xl")}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>登录中...</span>
                      </div>
                    ) : (
                      "登录"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* 二维码登录 */}
              <TabsContent value="qr" className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="mx-auto w-56 h-56 bg-white border-2 border-gray-200 rounded-2xl flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <QrCode className="w-20 h-20 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-500">二维码加载中...</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-base font-medium text-gray-700">使用企业微信扫码登录</p>
                    <p className="text-sm text-gray-500">打开企业微信，扫描上方二维码即可快速登录</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full h-14 border-gray-200 hover:border-sky-300 hover:text-sky-600 rounded-xl bg-transparent"
                  >
                    刷新二维码
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* 第三方登录 */}
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">或使用第三方登录</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-14 border-gray-200 hover:border-green-300 hover:text-green-600 rounded-xl bg-transparent"
                >
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                  微信
                </Button>
                <Button
                  variant="outline"
                  className="h-14 border-gray-200 hover:border-blue-300 hover:text-blue-600 rounded-xl bg-transparent"
                >
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                  </svg>
                  钉钉
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 注册链接 */}
        <div className="text-center mt-6">
          <p className="text-base text-gray-600">
            还没有账号？
            <button className="text-sky-600 hover:text-sky-700 font-medium ml-1">立即注册</button>
          </p>
        </div>

        {/* 底部信息 */}
        <div className="text-center mt-8 space-y-2 pb-4">
          <p className="text-sm text-gray-500">
            登录即表示您同意我们的
            <button className="text-sky-600 hover:text-sky-700 mx-1">服务条款</button>和
            <button className="text-sky-600 hover:text-sky-700 mx-1">隐私政策</button>
          </p>
          <p className="text-xs text-gray-400">© 2025 企业管理系统. 保留所有权利.</p>
        </div>
      </div>
    </div>
  )
}
