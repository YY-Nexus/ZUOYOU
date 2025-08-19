"use client"

import { localDB } from "./local-database"

// OKR数据类型定义
export interface OKR {
  id?: number
  objective: string
  description?: string
  owner: string
  ownerId: number
  quarter: string
  year: number
  status: "draft" | "active" | "completed" | "cancelled" | "on-hold"
  priority: "low" | "medium" | "high" | "critical"
  progress: number
  startDate: Date
  endDate: Date
  createDate: Date
  updateDate: Date
  keyResults: KeyResult[]
  tags: string[]
  parentOKRId?: number
  teamId?: number
  department: string
  confidenceLevel: number // 1-10
  lastReviewDate?: Date
  nextReviewDate?: Date
  notes?: string
}

export interface KeyResult {
  id?: number
  okrId: number
  description: string
  type: "quantitative" | "qualitative" | "milestone"
  currentValue: number
  targetValue: number
  unit: string
  progress: number
  status: "not-started" | "in-progress" | "completed" | "at-risk" | "blocked"
  startDate: Date
  dueDate: Date
  createDate: Date
  updateDate: Date
  milestones: Milestone[]
  owner: string
  ownerId: number
  notes?: string
  evidenceLinks: string[]
}

export interface Milestone {
  id?: number
  keyResultId: number
  title: string
  description?: string
  dueDate: Date
  completedDate?: Date
  status: "pending" | "completed" | "overdue"
  progress: number
  createDate: Date
}

export interface OKRUpdate {
  id?: number
  okrId: number
  keyResultId?: number
  updateType: "progress" | "status" | "milestone" | "note" | "review"
  oldValue?: any
  newValue: any
  description: string
  createdBy: string
  createdById: number
  createDate: Date
  metadata?: any
}

export interface OKRReview {
  id?: number
  okrId: number
  reviewType: "weekly" | "monthly" | "quarterly" | "annual"
  reviewDate: Date
  reviewer: string
  reviewerId: number
  overallScore: number // 1-10
  achievements: string[]
  challenges: string[]
  nextSteps: string[]
  recommendations: string[]
  confidenceLevel: number
  createDate: Date
}

// OKR服务类
export class OKRService {
  private static instance: OKRService

  static getInstance(): OKRService {
    if (!OKRService.instance) {
      OKRService.instance = new OKRService()
    }
    return OKRService.instance
  }

  // 初始化OKR存储
  async initializeOKRStores(): Promise<void> {
    try {
      await localDB.init()

      // 创建OKR相关的对象存储
      const db = (localDB as any).db
      if (db && !db.objectStoreNames.contains("okrs")) {
        // 这里需要重新打开数据库来添加新的存储
        await this.createOKRStores()
      }
    } catch (error) {
      console.error("初始化OKR存储失败:", error)
      throw error
    }
  }

  private async createOKRStores(): Promise<void> {
    // 由于IndexedDB的限制，我们需要增加版本号来添加新的存储
    const newDB = new (localDB.constructor as any)("EnterpriseDB", 2)
    await newDB.init()
  }

  // OKR CRUD操作
  async createOKR(okr: Omit<OKR, "id" | "createDate" | "updateDate">): Promise<number> {
    const newOKR: OKR = {
      ...okr,
      createDate: new Date(),
      updateDate: new Date(),
      progress: 0,
      confidenceLevel: 5,
    }

    try {
      const okrId = await localDB.add("okrs", newOKR)

      // 创建关键结果
      for (const kr of okr.keyResults) {
        await this.createKeyResult({ ...kr, okrId })
      }

      // 记录创建日志
      await this.logOKRUpdate({
        okrId,
        updateType: "status",
        newValue: "created",
        description: `创建新OKR: ${okr.objective}`,
        createdBy: okr.owner,
        createdById: okr.ownerId,
        createDate: new Date(),
      })

      return okrId
    } catch (error) {
      console.error("创建OKR失败:", error)
      throw error
    }
  }

  async getOKR(id: number): Promise<OKR | undefined> {
    try {
      const okr = await localDB.get<OKR>("okrs", id)
      if (okr) {
        // 获取关键结果
        okr.keyResults = await this.getKeyResultsByOKRId(id)
      }
      return okr
    } catch (error) {
      console.error("获取OKR失败:", error)
      throw error
    }
  }

  async getAllOKRs(filters?: {
    quarter?: string
    year?: number
    status?: string
    owner?: string
    department?: string
  }): Promise<OKR[]> {
    try {
      let okrs = await localDB.getAll<OKR>("okrs")

      // 应用过滤器
      if (filters) {
        okrs = okrs.filter((okr) => {
          if (filters.quarter && okr.quarter !== filters.quarter) return false
          if (filters.year && okr.year !== filters.year) return false
          if (filters.status && okr.status !== filters.status) return false
          if (filters.owner && okr.owner !== filters.owner) return false
          if (filters.department && okr.department !== filters.department) return false
          return true
        })
      }

      // 为每个OKR获取关键结果
      for (const okr of okrs) {
        okr.keyResults = await this.getKeyResultsByOKRId(okr.id!)
      }

      return okrs.sort((a, b) => b.createDate.getTime() - a.createDate.getTime())
    } catch (error) {
      console.error("获取所有OKR失败:", error)
      throw error
    }
  }

  async updateOKR(id: number, updates: Partial<OKR>): Promise<void> {
    try {
      const existingOKR = await this.getOKR(id)
      if (!existingOKR) {
        throw new Error("OKR不存在")
      }

      const updatedOKR: OKR = {
        ...existingOKR,
        ...updates,
        updateDate: new Date(),
      }

      await localDB.update("okrs", updatedOKR)

      // 记录更新日志
      await this.logOKRUpdate({
        okrId: id,
        updateType: "progress",
        oldValue: existingOKR.progress,
        newValue: updatedOKR.progress,
        description: "更新OKR进度",
        createdBy: updatedOKR.owner,
        createdById: updatedOKR.ownerId,
        createDate: new Date(),
      })
    } catch (error) {
      console.error("更新OKR失败:", error)
      throw error
    }
  }

  async deleteOKR(id: number): Promise<void> {
    try {
      // 删除相关的关键结果
      const keyResults = await this.getKeyResultsByOKRId(id)
      for (const kr of keyResults) {
        await this.deleteKeyResult(kr.id!)
      }

      // 删除OKR
      await localDB.delete("okrs", id)

      // 记录删除日志
      await this.logOKRUpdate({
        okrId: id,
        updateType: "status",
        newValue: "deleted",
        description: "删除OKR",
        createdBy: "system",
        createdById: 0,
        createDate: new Date(),
      })
    } catch (error) {
      console.error("删除OKR失败:", error)
      throw error
    }
  }

  // 关键结果操作
  async createKeyResult(keyResult: Omit<KeyResult, "id" | "createDate" | "updateDate">): Promise<number> {
    const newKeyResult: KeyResult = {
      ...keyResult,
      createDate: new Date(),
      updateDate: new Date(),
      progress: 0,
      milestones: [],
      evidenceLinks: [],
    }

    try {
      const krId = await localDB.add("keyResults", newKeyResult)

      // 更新OKR进度
      await this.updateOKRProgress(keyResult.okrId)

      return krId
    } catch (error) {
      console.error("创建关键结果失败:", error)
      throw error
    }
  }

  async getKeyResultsByOKRId(okrId: number): Promise<KeyResult[]> {
    try {
      return await localDB.getByIndex<KeyResult>("keyResults", "okrId", okrId)
    } catch (error) {
      console.error("获取关键结果失败:", error)
      return []
    }
  }

  async updateKeyResult(id: number, updates: Partial<KeyResult>): Promise<void> {
    try {
      const existingKR = await localDB.get<KeyResult>("keyResults", id)
      if (!existingKR) {
        throw new Error("关键结果不存在")
      }

      const updatedKR: KeyResult = {
        ...existingKR,
        ...updates,
        updateDate: new Date(),
      }

      await localDB.update("keyResults", updatedKR)

      // 更新OKR进度
      await this.updateOKRProgress(existingKR.okrId)

      // 记录更新日志
      await this.logOKRUpdate({
        okrId: existingKR.okrId,
        keyResultId: id,
        updateType: "progress",
        oldValue: existingKR.progress,
        newValue: updatedKR.progress,
        description: `更新关键结果: ${updatedKR.description}`,
        createdBy: updatedKR.owner,
        createdById: updatedKR.ownerId,
        createDate: new Date(),
      })
    } catch (error) {
      console.error("更新关键结果失败:", error)
      throw error
    }
  }

  async deleteKeyResult(id: number): Promise<void> {
    try {
      const keyResult = await localDB.get<KeyResult>("keyResults", id)
      if (keyResult) {
        await localDB.delete("keyResults", id)
        await this.updateOKRProgress(keyResult.okrId)
      }
    } catch (error) {
      console.error("删除关键结果失败:", error)
      throw error
    }
  }

  // 进度计算和更新
  async updateOKRProgress(okrId: number): Promise<void> {
    try {
      const keyResults = await this.getKeyResultsByOKRId(okrId)

      if (keyResults.length === 0) {
        return
      }

      // 计算平均进度
      const totalProgress = keyResults.reduce((sum, kr) => sum + kr.progress, 0)
      const averageProgress = Math.round(totalProgress / keyResults.length)

      // 更新OKR进度
      const okr = await this.getOKR(okrId)
      if (okr) {
        await this.updateOKR(okrId, { progress: averageProgress })
      }
    } catch (error) {
      console.error("更新OKR进度失败:", error)
      throw error
    }
  }

  async updateKeyResultProgress(keyResultId: number, currentValue: number): Promise<void> {
    try {
      const keyResult = await localDB.get<KeyResult>("keyResults", keyResultId)
      if (!keyResult) {
        throw new Error("关键结果不存在")
      }

      // 计算进度百分比
      let progress = 0
      if (keyResult.type === "quantitative") {
        progress = Math.min(100, Math.max(0, (currentValue / keyResult.targetValue) * 100))
      } else if (keyResult.type === "milestone") {
        // 里程碑类型基于完成的里程碑数量
        const completedMilestones = keyResult.milestones.filter((m) => m.status === "completed").length
        progress = keyResult.milestones.length > 0 ? (completedMilestones / keyResult.milestones.length) * 100 : 0
      }

      // 确定状态
      let status: KeyResult["status"] = "in-progress"
      if (progress === 0) status = "not-started"
      else if (progress >= 100) status = "completed"
      else if (progress < 50 && new Date() > keyResult.dueDate) status = "at-risk"

      await this.updateKeyResult(keyResultId, {
        currentValue,
        progress: Math.round(progress),
        status,
      })
    } catch (error) {
      console.error("更新关键结果进度失败:", error)
      throw error
    }
  }

  // 里程碑管理
  async createMilestone(milestone: Omit<Milestone, "id" | "createDate">): Promise<number> {
    const newMilestone: Milestone = {
      ...milestone,
      createDate: new Date(),
    }

    try {
      const milestoneId = await localDB.add("milestones", newMilestone)

      // 更新关键结果的里程碑数组
      const keyResult = await localDB.get<KeyResult>("keyResults", milestone.keyResultId)
      if (keyResult) {
        keyResult.milestones.push(newMilestone)
        await localDB.update("keyResults", keyResult)

        // 重新计算进度
        await this.updateKeyResultProgress(milestone.keyResultId, keyResult.currentValue)
      }

      return milestoneId
    } catch (error) {
      console.error("创建里程碑失败:", error)
      throw error
    }
  }

  async completeMilestone(milestoneId: number): Promise<void> {
    try {
      const milestone = await localDB.get<Milestone>("milestones", milestoneId)
      if (!milestone) {
        throw new Error("里程碑不存在")
      }

      const updatedMilestone: Milestone = {
        ...milestone,
        status: "completed",
        completedDate: new Date(),
        progress: 100,
      }

      await localDB.update("milestones", updatedMilestone)

      // 更新关键结果中的里程碑
      const keyResult = await localDB.get<KeyResult>("keyResults", milestone.keyResultId)
      if (keyResult) {
        const milestoneIndex = keyResult.milestones.findIndex((m) => m.id === milestoneId)
        if (milestoneIndex !== -1) {
          keyResult.milestones[milestoneIndex] = updatedMilestone
          await localDB.update("keyResults", keyResult)

          // 重新计算进度
          await this.updateKeyResultProgress(milestone.keyResultId, keyResult.currentValue)
        }
      }
    } catch (error) {
      console.error("完成里程碑失败:", error)
      throw error
    }
  }

  // 日志记录
  private async logOKRUpdate(update: Omit<OKRUpdate, "id">): Promise<void> {
    try {
      await localDB.add("okrUpdates", update)
    } catch (error) {
      console.error("记录OKR更新日志失败:", error)
    }
  }

  async getOKRUpdates(okrId: number, limit = 50): Promise<OKRUpdate[]> {
    try {
      const updates = await localDB.getByIndex<OKRUpdate>("okrUpdates", "okrId", okrId)
      return updates.sort((a, b) => b.createDate.getTime() - a.createDate.getTime()).slice(0, limit)
    } catch (error) {
      console.error("获取OKR更新日志失败:", error)
      return []
    }
  }

  // 评审管理
  async createReview(review: Omit<OKRReview, "id" | "createDate">): Promise<number> {
    const newReview: OKRReview = {
      ...review,
      createDate: new Date(),
    }

    try {
      const reviewId = await localDB.add("okrReviews", newReview)

      // 更新OKR的最后评审日期
      await this.updateOKR(review.okrId, {
        lastReviewDate: review.reviewDate,
        nextReviewDate: this.calculateNextReviewDate(review.reviewType, review.reviewDate),
      })

      return reviewId
    } catch (error) {
      console.error("创建OKR评审失败:", error)
      throw error
    }
  }

  private calculateNextReviewDate(reviewType: OKRReview["reviewType"], currentDate: Date): Date {
    const nextDate = new Date(currentDate)

    switch (reviewType) {
      case "weekly":
        nextDate.setDate(nextDate.getDate() + 7)
        break
      case "monthly":
        nextDate.setMonth(nextDate.getMonth() + 1)
        break
      case "quarterly":
        nextDate.setMonth(nextDate.getMonth() + 3)
        break
      case "annual":
        nextDate.setFullYear(nextDate.getFullYear() + 1)
        break
    }

    return nextDate
  }

  // 统计和分析
  async getOKRStatistics(filters?: {
    quarter?: string
    year?: number
    department?: string
  }): Promise<{
    totalOKRs: number
    completedOKRs: number
    inProgressOKRs: number
    averageProgress: number
    averageConfidence: number
    departmentStats: { [department: string]: { total: number; completed: number; avgProgress: number } }
    statusDistribution: { [status: string]: number }
    progressDistribution: { range: string; count: number }[]
  }> {
    try {
      const okrs = await this.getAllOKRs(filters)

      const totalOKRs = okrs.length
      const completedOKRs = okrs.filter((okr) => okr.status === "completed").length
      const inProgressOKRs = okrs.filter((okr) => okr.status === "active").length

      const averageProgress =
        totalOKRs > 0 ? Math.round(okrs.reduce((sum, okr) => sum + okr.progress, 0) / totalOKRs) : 0

      const averageConfidence =
        totalOKRs > 0 ? Math.round((okrs.reduce((sum, okr) => sum + okr.confidenceLevel, 0) / totalOKRs) * 10) / 10 : 0

      // 部门统计
      const departmentStats: { [department: string]: { total: number; completed: number; avgProgress: number } } = {}
      okrs.forEach((okr) => {
        if (!departmentStats[okr.department]) {
          departmentStats[okr.department] = { total: 0, completed: 0, avgProgress: 0 }
        }
        departmentStats[okr.department].total++
        if (okr.status === "completed") {
          departmentStats[okr.department].completed++
        }
      })

      // 计算部门平均进度
      Object.keys(departmentStats).forEach((dept) => {
        const deptOKRs = okrs.filter((okr) => okr.department === dept)
        departmentStats[dept].avgProgress =
          deptOKRs.length > 0 ? Math.round(deptOKRs.reduce((sum, okr) => sum + okr.progress, 0) / deptOKRs.length) : 0
      })

      // 状态分布
      const statusDistribution: { [status: string]: number } = {}
      okrs.forEach((okr) => {
        statusDistribution[okr.status] = (statusDistribution[okr.status] || 0) + 1
      })

      // 进度分布
      const progressRanges = [
        { range: "0-25%", min: 0, max: 25 },
        { range: "26-50%", min: 26, max: 50 },
        { range: "51-75%", min: 51, max: 75 },
        { range: "76-100%", min: 76, max: 100 },
      ]

      const progressDistribution = progressRanges.map((range) => ({
        range: range.range,
        count: okrs.filter((okr) => okr.progress >= range.min && okr.progress <= range.max).length,
      }))

      return {
        totalOKRs,
        completedOKRs,
        inProgressOKRs,
        averageProgress,
        averageConfidence,
        departmentStats,
        statusDistribution,
        progressDistribution,
      }
    } catch (error) {
      console.error("获取OKR统计失败:", error)
      throw error
    }
  }

  // 数据导入导出
  async exportOKRData(): Promise<{
    okrs: OKR[]
    keyResults: KeyResult[]
    milestones: Milestone[]
    updates: OKRUpdate[]
    reviews: OKRReview[]
  }> {
    try {
      const okrs = await this.getAllOKRs()
      const keyResults = await localDB.getAll<KeyResult>("keyResults")
      const milestones = await localDB.getAll<Milestone>("milestones")
      const updates = await localDB.getAll<OKRUpdate>("okrUpdates")
      const reviews = await localDB.getAll<OKRReview>("okrReviews")

      return {
        okrs,
        keyResults,
        milestones,
        updates,
        reviews,
      }
    } catch (error) {
      console.error("导出OKR数据失败:", error)
      throw error
    }
  }

  async importOKRData(data: {
    okrs: OKR[]
    keyResults: KeyResult[]
    milestones: Milestone[]
    updates: OKRUpdate[]
    reviews: OKRReview[]
  }): Promise<void> {
    try {
      // 清空现有数据
      await localDB.clear("okrs")
      await localDB.clear("keyResults")
      await localDB.clear("milestones")
      await localDB.clear("okrUpdates")
      await localDB.clear("okrReviews")

      // 导入新数据
      for (const okr of data.okrs) {
        await localDB.add("okrs", okr)
      }
      for (const kr of data.keyResults) {
        await localDB.add("keyResults", kr)
      }
      for (const milestone of data.milestones) {
        await localDB.add("milestones", milestone)
      }
      for (const update of data.updates) {
        await localDB.add("okrUpdates", update)
      }
      for (const review of data.reviews) {
        await localDB.add("okrReviews", review)
      }
    } catch (error) {
      console.error("导入OKR数据失败:", error)
      throw error
    }
  }
}

// 导出服务实例
export const okrService = OKRService.getInstance()
