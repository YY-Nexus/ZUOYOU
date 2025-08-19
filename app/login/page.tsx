"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, Phone, User, Building2, Shield, Smartphone, QrCode } from "lucide-react"
import { cn } from "@/lib/utils"
import { commonStyles } from "@/lib/design-system"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loginType, setLoginType] = useState<"account" | "phone" | "qr">("account")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    phone: "",
    verifyCode: "",
    rememberMe: false,
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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-sky-400/20 to-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo 和标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">企业管理系统</h1>
          <p className="text-gray-600">欢迎回来，请登录您的账户</p>
        </div>

        {/* 登录卡片 */}
        <Card className={cn(commonStyles.card, "shadow-xl border-0")}>
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold text-center text-gray-900">登录</CardTitle>
            <CardDescription className="text-center text-gray-600">选择您的登录方式</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Tabs value={loginType} onValueChange={(value) => setLoginType(value as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="account" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">账号</span>
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span className="hidden sm:inline">手机</span>
                </TabsTrigger>
                <TabsTrigger value="qr" className="flex items-center space-x-2">
                  <QrCode className="w-4 h-4" />
                  <span className="hidden sm:inline">扫码</span>
                </TabsTrigger>
              </TabsList>

              {/* 账号密码登录 */}
              <TabsContent value="account" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                      用户名/邮箱
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="请输入用户名或邮箱"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="pl-10 h-12 border-gray-200 focus:border-sky-500 focus:ring-sky-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      密码
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="请输入密码"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 pr-10 h-12 border-gray-200 focus:border-sky-500 focus:ring-sky-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={formData.rememberMe}
                        onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                      />
                      <Label htmlFor="remember" className="text-sm text-gray-600">
                        记住我
                      </Label>
                    </div>
                    <button type="button" className="text-sm text-sky-600 hover:text-sky-700 font-medium">
                      忘记密码？
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className={cn(commonStyles.button.primary, "w-full h-12 text-base font-medium")}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      手机号
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="请输入手机号"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10 h-12 border-gray-200 focus:border-sky-500 focus:ring-sky-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="verifyCode" className="text-sm font-medium text-gray-700">
                      验证码
                    </Label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="verifyCode"
                          type="text"
                          placeholder="请输入验证码"
                          value={formData.verifyCode}
                          onChange={(e) => setFormData({ ...formData, verifyCode: e.target.value })}
                          className="pl-10 h-12 border-gray-200 focus:border-sky-500 focus:ring-sky-500"
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendCode}
                        className="h-12 px-4 whitespace-nowrap border-gray-200 hover:border-sky-300 hover:text-sky-600 bg-transparent"
                      >
                        发送验证码
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className={cn(commonStyles.button.primary, "w-full h-12 text-base font-medium")}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                  <div className="mx-auto w-48 h-48 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <QrCode className="w-16 h-16 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-500">二维码加载中...</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">使用企业微信扫码登录</p>
                    <p className="text-xs text-gray-500">打开企业微信，扫描上方二维码即可快速登录</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full h-12 border-gray-200 hover:border-sky-300 hover:text-sky-600 bg-transparent"
                  >
                    刷新二维码
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {/* 分割线 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">或</span>
              </div>
            </div>

            {/* 第三方登录 */}
            <div className="space-y-3">
              <p className="text-sm text-center text-gray-600">使用第三方账号登录</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-12 border-gray-200 hover:border-green-300 hover:text-green-600 bg-transparent"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                  微信
                </Button>
                <Button
                  variant="outline"
                  className="h-12 border-gray-200 hover:border-blue-300 hover:text-blue-600 bg-transparent"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                  </svg>
                  钉钉
                </Button>
              </div>
            </div>

            {/* 注册链接 */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                还没有账号？
                <button className="text-sky-600 hover:text-sky-700 font-medium ml-1">立即注册</button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 底部信息 */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-gray-500">
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
