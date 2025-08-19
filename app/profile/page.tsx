"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Edit3,
  Camera,
  Save,
  X,
  Clock,
  Award,
  Target,
  TrendingUp,
  Users,
  FileText,
  Settings,
  Shield,
  CreditCard,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { commonStyles } from "@/lib/design-system"
import { EnhancedCard } from "@/components/ui/enhanced-card"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: "张三",
    email: "zhangsan@company.com",
    phone: "138-0000-0000",
    avatar: "/placeholder.svg?height=120&width=120&text=张三",
    role: "系统管理员",
    department: "技术部",
    location: "北京市朝阳区",
    joinDate: "2023-01-15",
    lastLogin: "2025-01-02 14:30",
    bio: "负责企业管理系统的开发和维护，拥有5年以上的全栈开发经验。",
    skills: ["React", "Node.js", "TypeScript", "Python", "数据库设计"],
    achievements: [
      { title: "优秀员工", date: "2024-12", description: "年度优秀员工奖" },
      { title: "技术创新", date: "2024-09", description: "系统架构优化项目" },
      { title: "团队协作", date: "2024-06", description: "跨部门协作项目" },
    ],
  })

  const [editForm, setEditForm] = useState(userProfile)

  const handleSave = () => {
    setUserProfile(editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm(userProfile)
    setIsEditing(false)
  }

  const stats = [
    { label: "完成任务", value: "156", icon: Target, color: "text-green-600" },
    { label: "项目参与", value: "23", icon: FileText, color: "text-blue-600" },
    { label: "团队协作", value: "89", icon: Users, color: "text-purple-600" },
    { label: "工作效率", value: "95%", icon: TrendingUp, color: "text-orange-600" },
  ]

  return (
    <div className={cn(commonStyles.layout.container, "max-w-6xl mx-auto")}>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">个人资料</h1>
            <p className="text-gray-600 mt-1">管理您的个人信息和账户设置</p>
          </div>
          <div className="flex items-center space-x-3">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} className="flex items-center space-x-2 bg-transparent">
                  <X className="w-4 h-4" />
                  <span>取消</span>
                </Button>
                <Button onClick={handleSave} className={cn(commonStyles.button.primary, "flex items-center space-x-2")}>
                  <Save className="w-4 h-4" />
                  <span>保存</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className={cn(commonStyles.button.primary, "flex items-center space-x-2")}
              >
                <Edit3 className="w-4 h-4" />
                <span>编辑资料</span>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：个人信息卡片 */}
          <div className="lg:col-span-1">
            <EnhancedCard title="个人信息" className="h-fit">
              <div className="text-center space-y-4">
                {/* 头像 */}
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                    <AvatarFallback className="bg-gradient-to-r from-sky-400 to-blue-500 text-white text-2xl">
                      {userProfile.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-sky-500 hover:bg-sky-600"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* 基本信息 */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">{userProfile.name}</h3>
                  <div className="flex items-center justify-center space-x-2">
                    <Badge variant="secondary">{userProfile.role}</Badge>
                    <Badge variant="outline">{userProfile.department}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{userProfile.bio}</p>
                </div>

                <Separator />

                {/* 联系信息 */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{userProfile.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{userProfile.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{userProfile.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>入职时间: {userProfile.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>最后登录: {userProfile.lastLogin}</span>
                  </div>
                </div>
              </div>
            </EnhancedCard>

            {/* 工作统计 */}
            <EnhancedCard title="工作统计" className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center space-y-2">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center mx-auto",
                        stat.color === "text-green-600"
                          ? "bg-green-100"
                          : stat.color === "text-blue-600"
                            ? "bg-blue-100"
                            : stat.color === "text-purple-600"
                              ? "bg-purple-100"
                              : "bg-orange-100",
                      )}
                    >
                      <stat.icon className={cn("w-6 h-6", stat.color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </EnhancedCard>
          </div>

          {/* 右侧：详细信息 */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">详细信息</TabsTrigger>
                <TabsTrigger value="achievements">成就记录</TabsTrigger>
                <TabsTrigger value="settings">账户设置</TabsTrigger>
                <TabsTrigger value="security">安全设置</TabsTrigger>
              </TabsList>

              {/* 详细信息 */}
              <TabsContent value="details">
                <EnhancedCard title="个人详细信息">
                  <div className="space-y-6">
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">姓名</Label>
                          <Input
                            id="name"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className={commonStyles.input}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">邮箱</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className={commonStyles.input}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">电话</Label>
                          <Input
                            id="phone"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className={commonStyles.input}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">地址</Label>
                          <Input
                            id="location"
                            value={editForm.location}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            className={commonStyles.input}
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="bio">个人简介</Label>
                          <Textarea
                            id="bio"
                            value={editForm.bio}
                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                            className={commonStyles.input}
                            rows={3}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">姓名</Label>
                            <p className="text-base text-gray-900 mt-1">{userProfile.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">邮箱</Label>
                            <p className="text-base text-gray-900 mt-1">{userProfile.email}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">电话</Label>
                            <p className="text-base text-gray-900 mt-1">{userProfile.phone}</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">部门</Label>
                            <p className="text-base text-gray-900 mt-1">{userProfile.department}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">职位</Label>
                            <p className="text-base text-gray-900 mt-1">{userProfile.role}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">地址</Label>
                            <p className="text-base text-gray-900 mt-1">{userProfile.location}</p>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium text-gray-500">个人简介</Label>
                          <p className="text-base text-gray-900 mt-1">{userProfile.bio}</p>
                        </div>
                        <div className="md:col-span-2">
                          <Label className="text-sm font-medium text-gray-500">技能标签</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {userProfile.skills.map((skill, index) => (
                              <Badge key={index} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </EnhancedCard>
              </TabsContent>

              {/* 成就记录 */}
              <TabsContent value="achievements">
                <EnhancedCard title="成就记录">
                  <div className="space-y-4">
                    {userProfile.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{achievement.description}</p>
                          <p className="text-xs text-gray-500 mt-2">{achievement.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </EnhancedCard>
              </TabsContent>

              {/* 账户设置 */}
              <TabsContent value="settings">
                <EnhancedCard title="账户设置">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Settings className="w-5 h-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">通知设置</h4>
                          <p className="text-sm text-gray-600">管理您的通知偏好</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        配置
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">隐私设置</h4>
                          <p className="text-sm text-gray-600">控制您的信息可见性</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        配置
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Building2 className="w-5 h-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">企业设置</h4>
                          <p className="text-sm text-gray-600">管理企业相关配置</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        配置
                      </Button>
                    </div>
                  </div>
                </EnhancedCard>
              </TabsContent>

              {/* 安全设置 */}
              <TabsContent value="security">
                <EnhancedCard title="安全设置">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">密码管理</h4>
                          <p className="text-sm text-gray-600">修改登录密码</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        修改
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">双因素认证</h4>
                          <p className="text-sm text-gray-600">增强账户安全性</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        启用
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">登录历史</h4>
                          <p className="text-sm text-gray-600">查看最近的登录记录</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        查看
                      </Button>
                    </div>
                  </div>
                </EnhancedCard>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
