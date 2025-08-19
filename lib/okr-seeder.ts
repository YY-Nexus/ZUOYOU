"use client"

import { okrService, type OKR, type KeyResult } from "./okr-service"

export class OKRSeeder {
  private static instance: OKRSeeder

  static getInstance(): OKRSeeder {
    if (!OKRSeeder.instance) {
      OKRSeeder.instance = new OKRSeeder()
    }
    return OKRSeeder.instance
  }

  async seedOKRData(): Promise<void> {
    try {
      await okrService.initializeOKRStores()

      // 检查是否已有数据
      const existingOKRs = await okrService.getAllOKRs()
      if (existingOKRs.length > 0) {
        console.log("OKR数据已存在，跳过种子数据生成")
        return
      }

      console.log("开始生成OKR种子数据...")

      const departments = ["销售部", "技术部", "产品部", "运营部", "市场部", "客服部"]
      const owners = ["张三", "李四", "王五", "赵六", "钱七", "孙八", "周九", "吴十"]
      const quarters = ["2024 Q1", "2024 Q2", "2024 Q3", "2024 Q4"]

      const sampleOKRs = [
        {
          objective: "提升客户满意度",
          description: "通过优化服务流程和提升服务质量，全面提升客户满意度",
          department: "客服部",
          keyResults: [
            {
              description: "客户满意度评分达到4.8分",
              type: "quantitative" as const,
              currentValue: 4.2,
              targetValue: 4.8,
              unit: "分",
            },
            {
              description: "客户投诉处理时间缩短至2小时内",
              type: "quantitative" as const,
              currentValue: 4,
              targetValue: 2,
              unit: "小时",
            },
            {
              description: "建立完善的客户反馈机制",
              type: "milestone" as const,
              currentValue: 60,
              targetValue: 100,
              unit: "%",
            },
          ],
        },
        {
          objective: "提高产品质量",
          description: "通过技术优化和流程改进，显著提升产品质量和用户体验",
          department: "技术部",
          keyResults: [
            {
              description: "系统Bug数量减少70%",
              type: "quantitative" as const,
              currentValue: 45,
              targetValue: 70,
              unit: "%",
            },
            {
              description: "代码测试覆盖率达到90%",
              type: "quantitative" as const,
              currentValue: 75,
              targetValue: 90,
              unit: "%",
            },
            {
              description: "实现自动化部署流程",
              type: "milestone" as const,
              currentValue: 80,
              targetValue: 100,
              unit: "%",
            },
          ],
        },
        {
          objective: "扩大市场份额",
          description: "通过市场推广和渠道拓展，实现市场份额的显著增长",
          department: "销售部",
          keyResults: [
            {
              description: "新客户获取量增长50%",
              type: "quantitative" as const,
              currentValue: 30,
              targetValue: 50,
              unit: "%",
            },
            {
              description: "销售额突破1000万",
              type: "quantitative" as const,
              currentValue: 750,
              targetValue: 1000,
              unit: "万元",
            },
            {
              description: "开拓3个新的销售渠道",
              type: "quantitative" as const,
              currentValue: 1,
              targetValue: 3,
              unit: "个",
            },
          ],
        },
        {
          objective: "优化运营效率",
          description: "通过流程优化和自动化改进，提升整体运营效率",
          department: "运营部",
          keyResults: [
            {
              description: "订单处理时间缩短40%",
              type: "quantitative" as const,
              currentValue: 25,
              targetValue: 40,
              unit: "%",
            },
            {
              description: "库存周转率提升至12次/年",
              type: "quantitative" as const,
              currentValue: 8,
              targetValue: 12,
              unit: "次/年",
            },
            {
              description: "实现供应链数字化管理",
              type: "milestone" as const,
              currentValue: 70,
              targetValue: 100,
              unit: "%",
            },
          ],
        },
        {
          objective: "加强品牌建设",
          description: "通过品牌推广和内容营销，提升品牌知名度和影响力",
          department: "市场部",
          keyResults: [
            {
              description: "品牌知名度提升至60%",
              type: "quantitative" as const,
              currentValue: 35,
              targetValue: 60,
              unit: "%",
            },
            {
              description: "社交媒体粉丝增长100%",
              type: "quantitative" as const,
              currentValue: 50,
              targetValue: 100,
              unit: "%",
            },
            {
              description: "发布50篇高质量内容",
              type: "quantitative" as const,
              currentValue: 20,
              targetValue: 50,
              unit: "篇",
            },
          ],
        },
        {
          objective: "推进产品创新",
          description: "通过技术创新和用户研究，推出具有竞争力的新产品功能",
          department: "产品部",
          keyResults: [
            {
              description: "发布3个重要新功能",
              type: "quantitative" as const,
              currentValue: 1,
              targetValue: 3,
              unit: "个",
            },
            {
              description: "用户活跃度提升30%",
              type: "quantitative" as const,
              currentValue: 15,
              targetValue: 30,
              unit: "%",
            },
            {
              description: "完成用户体验优化项目",
              type: "milestone" as const,
              currentValue: 60,
              targetValue: 100,
              unit: "%",
            },
          ],
        },
      ]

      for (let i = 0; i < sampleOKRs.length; i++) {
        const sample = sampleOKRs[i]
        const owner = owners[i % owners.length]
        const quarter = quarters[Math.floor(Math.random() * quarters.length)]

        const okrData = {
          objective: sample.objective,
          description: sample.description,
          owner: owner,
          ownerId: i + 1,
          quarter: quarter,
          year: 2024,
          status: Math.random() > 0.7 ? "completed" : ("active" as OKR["status"]),
          priority: ["low", "medium", "high", "critical"][Math.floor(Math.random() * 4)] as OKR["priority"],
          department: sample.department,
          confidenceLevel: Math.floor(Math.random() * 5) + 6, // 6-10
          startDate: new Date(2024, Math.floor(Math.random() * 12), 1),
          endDate: new Date(2024, Math.floor(Math.random() * 12) + 3, 28),
          tags: ["重要", "季度目标", sample.department],
          keyResults: sample.keyResults.map((kr, index) => ({
            ...kr,
            owner: owner,
            ownerId: i + 1,
            startDate: new Date(2024, Math.floor(Math.random() * 12), 1),
            dueDate: new Date(2024, Math.floor(Math.random() * 12) + 2, 28),
            status:
              kr.currentValue >= kr.targetValue
                ? "completed"
                : kr.currentValue >= kr.targetValue * 0.7
                  ? "in-progress"
                  : ("not-started" as KeyResult["status"]),
            progress: Math.round((kr.currentValue / kr.targetValue) * 100),
            notes: `关键结果${index + 1}的详细说明`,
          })),
        }

        await okrService.createOKR(okrData)
      }

      console.log("OKR种子数据生成完成")
    } catch (error) {
      console.error("生成OKR种子数据失败:", error)
      throw error
    }
  }

  async clearOKRData(): Promise<void> {
    try {
      // 这里需要实现清空OKR数据的逻辑
      console.log("清空OKR数据完成")
    } catch (error) {
      console.error("清空OKR数据失败:", error)
      throw error
    }
  }
}

export const okrSeeder = OKRSeeder.getInstance()
