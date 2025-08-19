"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Target,
  TrendingUp,
  Calendar,
  Users,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Search,
  Download,
  Upload,
} from "lucide-react"

interface KeyResult {
  id: string
  title: string
  description: string
  targetValue: number
  currentValue: number
  unit: string
  progress: number
  status: "not_started" | "in_progress" | "completed" | "at_risk"
  lastUpdated: string
}

interface OKR {
  id: string
  title: string
  description: string
  department: string
  owner: string
  quarter: string
  year: number
  status: "draft" | "active" | "completed" | "cancelled"
  progress: number
  confidenceLevel: number
  keyResults: KeyResult[]
  createdAt: string
  updatedAt: string
  dueDate: string
}

interface OKRStats {
  totalOKRs: number
  completedOKRs: number
  averageProgress: number
  atRiskOKRs: number
}

export function OKRManagement() {
  const [okrs, setOKRs] = useState<OKR[]>([])
  const [stats, setStats] = useState<OKRStats>({
    totalOKRs: 0,
    completedOKRs: 0,
    averageProgress: 0,
    atRiskOKRs: 0,
  })
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedOKR, setSelectedOKR] = useState<OKR | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterDepartment, setFilterDepartment] = useState<string>("all")

  // 新建/编辑OKR表单状态
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    owner: "",
    quarter: "",
    year: new Date().getFullYear(),
    dueDate: "",
    confidenceLevel: 5,
  })

  // 关键结果表单状态
  const [keyResultForm, setKeyResultForm] = useState({
    title: "",
    description: "",
    targetValue: 0,
    unit: "",
  })

  const [tempKeyResults, setTempKeyResults] = useState<
    Omit<KeyResult, "id" | "currentValue" | "progress" | "status" | "lastUpdated">[]
  >([])

  const departments = ["技术部", "销售部", "市场部", "人事部", "财务部", "运营部"]
  const quarters = ["Q1", "Q2", "Q3", "Q4"]
  const years = [2024, 2025, 2026]

  // 模拟数据加载
  useEffect(() => {
    loadOKRs()
  }, [])

  const loadOKRs = () => {
    // 模拟从API加载数据
    const mockOKRs: OKR[] = [
      {
        id: "1",
        title: "提升客户满意度",
        description: "通过优化服务流程和产品质量，将客户满意度提升到95%以上",
        department: "技术部",
        owner: "张三",
        quarter: "Q1",
        year: 2024,
        status: "active",
        progress: 75,
        confidenceLevel: 8,
        keyResults: [
          {
            id: "kr1",
            title: "客户满意度评分",
            description: "通过客户调研获得满意度评分",
            targetValue: 95,
            currentValue: 87,
            unit: "%",
            progress: 87,
            status: "in_progress",
            lastUpdated: "2024-01-15",
          },
          {
            id: "kr2",
            title: "客户投诉处理时间",
            description: "平均客户投诉处理时间",
            targetValue: 24,
            currentValue: 18,
            unit: "小时",
            progress: 75,
            status: "in_progress",
            lastUpdated: "2024-01-14",
          },
        ],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-15",
        dueDate: "2024-03-31",
      },
      {
        id: "2",
        title: "增加销售收入",
        description: "通过拓展新客户和提升客单价，实现销售收入增长30%",
        department: "销售部",
        owner: "李四",
        quarter: "Q1",
        year: 2024,
        status: "active",
        progress: 45,
        confidenceLevel: 6,
        keyResults: [
          {
            id: "kr3",
            title: "新客户获取数量",
            description: "获取新客户数量",
            targetValue: 100,
            currentValue: 45,
            unit: "个",
            progress: 45,
            status: "in_progress",
            lastUpdated: "2024-01-15",
          },
          {
            id: "kr4",
            title: "平均客单价",
            description: "提升平均客单价",
            targetValue: 5000,
            currentValue: 4200,
            unit: "元",
            progress: 84,
            status: "in_progress",
            lastUpdated: "2024-01-14",
          },
        ],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-15",
        dueDate: "2024-03-31",
      },
    ]

    setOKRs(mockOKRs)
    calculateStats(mockOKRs)
  }

  const calculateStats = (okrList: OKR[]) => {
    const totalOKRs = okrList.length
    const completedOKRs = okrList.filter((okr) => okr.status === "completed").length
    const averageProgress = okrList.reduce((sum, okr) => sum + okr.progress, 0) / totalOKRs || 0
    const atRiskOKRs = okrList.filter((okr) => okr.progress < 50 && okr.status === "active").length

    setStats({
      totalOKRs,
      completedOKRs,
      averageProgress: Math.round(averageProgress),
      atRiskOKRs,
    })
  }

  const handleCreateOKR = () => {
    const newOKR: OKR = {
      id: Date.now().toString(),
      ...formData,
      status: "draft",
      progress: 0,
      keyResults: tempKeyResults.map((kr) => ({
        ...kr,
        id: Date.now().toString() + Math.random(),
        currentValue: 0,
        progress: 0,
        status: "not_started" as const,
        lastUpdated: new Date().toISOString().split("T")[0],
      })),
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }

    setOKRs((prev) => [...prev, newOKR])
    calculateStats([...okrs, newOKR])
    resetForm()
    setIsCreateDialogOpen(false)
  }

  const handleEditOKR = () => {
    if (!selectedOKR) return

    const updatedOKR: OKR = {
      ...selectedOKR,
      ...formData,
      keyResults: tempKeyResults.map((kr) => ({
        ...kr,
        id: kr.id || Date.now().toString() + Math.random(),
        currentValue: kr.currentValue || 0,
        progress: kr.progress || 0,
        status: kr.status || ("not_started" as const),
        lastUpdated: new Date().toISOString().split("T")[0],
      })),
      updatedAt: new Date().toISOString().split("T")[0],
    }

    setOKRs((prev) => prev.map((okr) => (okr.id === selectedOKR.id ? updatedOKR : okr)))
    calculateStats(okrs.map((okr) => (okr.id === selectedOKR.id ? updatedOKR : okr)))
    resetForm()
    setIsEditDialogOpen(false)
    setSelectedOKR(null)
  }

  const handleDeleteOKR = (id: string) => {
    const updatedOKRs = okrs.filter((okr) => okr.id !== id)
    setOKRs(updatedOKRs)
    calculateStats(updatedOKRs)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      department: "",
      owner: "",
      quarter: "",
      year: new Date().getFullYear(),
      dueDate: "",
      confidenceLevel: 5,
    })
    setTempKeyResults([])
    setKeyResultForm({
      title: "",
      description: "",
      targetValue: 0,
      unit: "",
    })
  }

  const openEditDialog = (okr: OKR) => {
    setSelectedOKR(okr)
    setFormData({
      title: okr.title,
      description: okr.description,
      department: okr.department,
      owner: okr.owner,
      quarter: okr.quarter,
      year: okr.year,
      dueDate: okr.dueDate,
      confidenceLevel: okr.confidenceLevel,
    })
    setTempKeyResults(
      okr.keyResults.map((kr) => ({
        title: kr.title,
        description: kr.description,
        targetValue: kr.targetValue,
        unit: kr.unit,
      })),
    )
    setIsEditDialogOpen(true)
  }

  const addKeyResult = () => {
    if (!keyResultForm.title || !keyResultForm.targetValue) return

    setTempKeyResults((prev) => [...prev, { ...keyResultForm }])
    setKeyResultForm({
      title: "",
      description: "",
      targetValue: 0,
      unit: "",
    })
  }

  const removeKeyResult = (index: number) => {
    setTempKeyResults((prev) => prev.filter((_, i) => i !== index))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "草稿", variant: "secondary" as const, icon: Edit },
      active: { label: "进行中", variant: "default" as const, icon: Clock },
      completed: { label: "已完成", variant: "success" as const, icon: CheckCircle },
      cancelled: { label: "已取消", variant: "destructive" as const, icon: AlertCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    if (!config) return null

    const Icon = config.icon
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 60) return "bg-blue-500"
    if (progress >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  const filteredOKRs = okrs.filter((okr) => {
    const matchesSearch =
      okr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      okr.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || okr.status === filterStatus
    const matchesDepartment = filterDepartment === "all" || okr.department === filterDepartment

    return matchesSearch && matchesStatus && matchesDepartment
  })

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">总目标数</p>
                <p className="text-2xl font-bold text-blue-900">{stats.totalOKRs}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">已完成</p>
                <p className="text-2xl font-bold text-green-900">{stats.completedOKRs}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">平均进度</p>
                <p className="text-2xl font-bold text-purple-900">{stats.averageProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">风险目标</p>
                <p className="text-2xl font-bold text-red-900">{stats.atRiskOKRs}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 操作栏 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              {/* 搜索 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索OKR..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* 筛选 */}
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="active">进行中</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                    <SelectItem value="cancelled">已取消</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部部门</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                导出
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                导入
              </Button>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-sky-600 hover:bg-sky-700">
                    <Plus className="h-4 w-4 mr-2" />
                    新建OKR
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>创建新的OKR</DialogTitle>
                    <DialogDescription>设定明确的目标和可衡量的关键结果</DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="basic">基本信息</TabsTrigger>
                      <TabsTrigger value="keyresults">关键结果</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">目标标题</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                            placeholder="输入目标标题"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="owner">负责人</Label>
                          <Input
                            id="owner"
                            value={formData.owner}
                            onChange={(e) => setFormData((prev) => ({ ...prev, owner: e.target.value }))}
                            placeholder="输入负责人姓名"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">目标描述</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="详细描述这个目标"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="department">所属部门</Label>
                          <Select
                            value={formData.department}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择部门" />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quarter">季度</Label>
                          <Select
                            value={formData.quarter}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, quarter: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择季度" />
                            </SelectTrigger>
                            <SelectContent>
                              {quarters.map((quarter) => (
                                <SelectItem key={quarter} value={quarter}>
                                  {quarter}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="year">年份</Label>
                          <Select
                            value={formData.year.toString()}
                            onValueChange={(value) =>
                              setFormData((prev) => ({ ...prev, year: Number.parseInt(value) }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择年份" />
                            </SelectTrigger>
                            <SelectContent>
                              {years.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dueDate">截止日期</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confidence">信心指数 ({formData.confidenceLevel}/10)</Label>
                          <Input
                            id="confidence"
                            type="range"
                            min="1"
                            max="10"
                            value={formData.confidenceLevel}
                            onChange={(e) =>
                              setFormData((prev) => ({ ...prev, confidenceLevel: Number.parseInt(e.target.value) }))
                            }
                            className="w-full"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="keyresults" className="space-y-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="kr-title">关键结果标题</Label>
                            <Input
                              id="kr-title"
                              value={keyResultForm.title}
                              onChange={(e) => setKeyResultForm((prev) => ({ ...prev, title: e.target.value }))}
                              placeholder="输入关键结果标题"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="kr-unit">单位</Label>
                            <Input
                              id="kr-unit"
                              value={keyResultForm.unit}
                              onChange={(e) => setKeyResultForm((prev) => ({ ...prev, unit: e.target.value }))}
                              placeholder="如：%、个、元等"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="kr-description">关键结果描述</Label>
                          <Input
                            id="kr-description"
                            value={keyResultForm.description}
                            onChange={(e) => setKeyResultForm((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="描述如何衡量这个关键结果"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="kr-target">目标值</Label>
                          <Input
                            id="kr-target"
                            type="number"
                            value={keyResultForm.targetValue}
                            onChange={(e) =>
                              setKeyResultForm((prev) => ({
                                ...prev,
                                targetValue: Number.parseFloat(e.target.value) || 0,
                              }))
                            }
                            placeholder="输入目标数值"
                          />
                        </div>

                        <Button onClick={addKeyResult} className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          添加关键结果
                        </Button>
                      </div>

                      {/* 已添加的关键结果列表 */}
                      {tempKeyResults.length > 0 && (
                        <div className="space-y-2">
                          <Label>已添加的关键结果</Label>
                          <div className="space-y-2">
                            {tempKeyResults.map((kr, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                  <p className="font-medium">{kr.title}</p>
                                  <p className="text-sm text-gray-600">{kr.description}</p>
                                  <p className="text-sm text-gray-500">
                                    目标: {kr.targetValue} {kr.unit}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeKeyResult(index)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={handleCreateOKR} disabled={!formData.title || tempKeyResults.length === 0}>
                      创建OKR
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OKR列表 */}
      <div className="grid gap-6">
        {filteredOKRs.map((okr) => (
          <Card key={okr.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{okr.title}</CardTitle>
                    {getStatusBadge(okr.status)}
                  </div>
                  <CardDescription className="text-sm">{okr.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(okr)}
                    className="hover:bg-sky-50 hover:text-sky-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认删除</AlertDialogTitle>
                        <AlertDialogDescription>确定要删除这个OKR吗？此操作无法撤销。</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteOKR(okr.id)}>删除</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {/* OKR基本信息 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">负责人:</span>
                    <span className="font-medium">{okr.owner}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">时间:</span>
                    <span className="font-medium">
                      {okr.year} {okr.quarter}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">部门:</span>
                    <span className="font-medium">{okr.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">信心:</span>
                    <span className="font-medium">{okr.confidenceLevel}/10</span>
                  </div>
                </div>

                {/* 整体进度 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">整体进度</span>
                    <span className="text-sm font-bold">{okr.progress}%</span>
                  </div>
                  <Progress value={okr.progress} className="h-2" />
                </div>

                {/* 关键结果列表 */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">关键结果</h4>
                  {okr.keyResults.map((kr) => (
                    <div key={kr.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{kr.title}</h5>
                          <p className="text-xs text-gray-600 mt-1">{kr.description}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {kr.currentValue}/{kr.targetValue} {kr.unit}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">进度</span>
                          <span className="text-xs font-medium">{kr.progress}%</span>
                        </div>
                        <Progress value={kr.progress} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredOKRs.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无OKR数据</h3>
              <p className="text-gray-500 mb-4">开始创建您的第一个OKR目标</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                创建OKR
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 编辑对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑OKR</DialogTitle>
            <DialogDescription>修改目标信息和关键结果</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">基本信息</TabsTrigger>
              <TabsTrigger value="keyresults">关键结果</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">目标标题</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="输入目标标题"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-owner">负责人</Label>
                  <Input
                    id="edit-owner"
                    value={formData.owner}
                    onChange={(e) => setFormData((prev) => ({ ...prev, owner: e.target.value }))}
                    placeholder="输入负责人姓名"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">目标描述</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="详细描述这个目标"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-department">所属部门</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择部门" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-quarter">季度</Label>
                  <Select
                    value={formData.quarter}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, quarter: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择季度" />
                    </SelectTrigger>
                    <SelectContent>
                      {quarters.map((quarter) => (
                        <SelectItem key={quarter} value={quarter}>
                          {quarter}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-year">年份</Label>
                  <Select
                    value={formData.year.toString()}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, year: Number.parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择年份" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-dueDate">截止日期</Label>
                  <Input
                    id="edit-dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-confidence">信心指数 ({formData.confidenceLevel}/10)</Label>
                  <Input
                    id="edit-confidence"
                    type="range"
                    min="1"
                    max="10"
                    value={formData.confidenceLevel}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, confidenceLevel: Number.parseInt(e.target.value) }))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="keyresults" className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-kr-title">关键结果标题</Label>
                    <Input
                      id="edit-kr-title"
                      value={keyResultForm.title}
                      onChange={(e) => setKeyResultForm((prev) => ({ ...prev, title: e.target.value }))}
                      placeholder="输入关键结果标题"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-kr-unit">单位</Label>
                    <Input
                      id="edit-kr-unit"
                      value={keyResultForm.unit}
                      onChange={(e) => setKeyResultForm((prev) => ({ ...prev, unit: e.target.value }))}
                      placeholder="如：%、个、元等"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-kr-description">关键结果描述</Label>
                  <Input
                    id="edit-kr-description"
                    value={keyResultForm.description}
                    onChange={(e) => setKeyResultForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="描述如何衡量这个关键结果"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-kr-target">目标值</Label>
                  <Input
                    id="edit-kr-target"
                    type="number"
                    value={keyResultForm.targetValue}
                    onChange={(e) =>
                      setKeyResultForm((prev) => ({ ...prev, targetValue: Number.parseFloat(e.target.value) || 0 }))
                    }
                    placeholder="输入目标数值"
                  />
                </div>

                <Button onClick={addKeyResult} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  添加关键结果
                </Button>
              </div>

              {/* 已添加的关键结果列表 */}
              {tempKeyResults.length > 0 && (
                <div className="space-y-2">
                  <Label>已添加的关键结果</Label>
                  <div className="space-y-2">
                    {tempKeyResults.map((kr, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{kr.title}</p>
                          <p className="text-sm text-gray-600">{kr.description}</p>
                          <p className="text-sm text-gray-500">
                            目标: {kr.targetValue} {kr.unit}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeKeyResult(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleEditOKR} disabled={!formData.title || tempKeyResults.length === 0}>
              保存修改
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
