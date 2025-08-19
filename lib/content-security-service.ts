"use client"

// 内容安全检查服务
export interface SecurityRule {
  id: string
  name: string
  type: "keyword" | "regex" | "ai" | "custom"
  pattern?: string
  keywords?: string[]
  severity: "low" | "medium" | "high" | "critical"
  action: "warn" | "block" | "modify"
  enabled: boolean
}

export interface SecurityCheckResult {
  passed: boolean
  issues: SecurityIssue[]
  modifiedContent?: string
  confidence: number
}

export interface SecurityIssue {
  ruleId: string
  ruleName: string
  severity: string
  message: string
  position?: { start: number; end: number }
  suggestion?: string
}

export class ContentSecurityService {
  private rules: Map<string, SecurityRule> = new Map()
  private sensitiveWords: Set<string> = new Set()

  constructor() {
    this.initializeRules()
    this.loadSensitiveWords()
  }

  private initializeRules() {
    // 政治敏感内容
    this.addRule({
      id: "political-content",
      name: "政治敏感内容检测",
      type: "keyword",
      keywords: ["政治敏感词1", "政治敏感词2"], // 实际使用时需要完整词库
      severity: "critical",
      action: "block",
      enabled: true,
    })

    // 暴力内容
    this.addRule({
      id: "violence-content",
      name: "暴力内容检测",
      type: "keyword",
      keywords: ["暴力", "血腥", "杀害"],
      severity: "high",
      action: "block",
      enabled: true,
    })

    // 色情内容
    this.addRule({
      id: "adult-content",
      name: "成人内容检测",
      type: "keyword",
      keywords: ["色情词汇1", "色情词汇2"],
      severity: "high",
      action: "block",
      enabled: true,
    })

    // 个人信息
    this.addRule({
      id: "personal-info",
      name: "个人信息检测",
      type: "regex",
      pattern: "(\\d{15}|\\d{18})|((\\d{3,4}-)?\\d{7,8})",
      severity: "medium",
      action: "warn",
      enabled: true,
    })

    // 虚假信息
    this.addRule({
      id: "fake-news",
      name: "虚假信息检测",
      type: "ai",
      severity: "medium",
      action: "warn",
      enabled: true,
    })

    // 版权内容
    this.addRule({
      id: "copyright",
      name: "版权内容检测",
      type: "ai",
      severity: "medium",
      action: "warn",
      enabled: true,
    })

    // 垃圾信息
    this.addRule({
      id: "spam-content",
      name: "垃圾信息检测",
      type: "keyword",
      keywords: ["广告", "推广", "加微信", "点击链接"],
      severity: "low",
      action: "modify",
      enabled: true,
    })
  }

  private loadSensitiveWords() {
    // 加载敏感词库
    const words = [
      // 政治敏感词
      "敏感词1",
      "敏感词2",
      // 暴力词汇
      "暴力词1",
      "暴力词2",
      // 其他敏感词
      "其他敏感词1",
      "其他敏感词2",
    ]

    words.forEach((word) => this.sensitiveWords.add(word))
  }

  addRule(rule: SecurityRule) {
    this.rules.set(rule.id, rule)
  }

  removeRule(ruleId: string) {
    this.rules.delete(ruleId)
  }

  updateRule(ruleId: string, updates: Partial<SecurityRule>) {
    const rule = this.rules.get(ruleId)
    if (rule) {
      this.rules.set(ruleId, { ...rule, ...updates })
    }
  }

  async checkContent(content: string): Promise<SecurityCheckResult> {
    const issues: SecurityIssue[] = []
    let modifiedContent = content
    let overallConfidence = 100

    // 遍历所有启用的规则
    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue

      const ruleResult = await this.checkRule(content, rule)
      if (ruleResult.issues.length > 0) {
        issues.push(...ruleResult.issues)

        if (rule.action === "modify" && ruleResult.modifiedContent) {
          modifiedContent = ruleResult.modifiedContent
        }

        overallConfidence = Math.min(overallConfidence, ruleResult.confidence)
      }
    }

    // 判断是否通过检查
    const criticalIssues = issues.filter((issue) => issue.severity === "critical")
    const highIssues = issues.filter((issue) => issue.severity === "high")

    const passed = criticalIssues.length === 0 && highIssues.length === 0

    return {
      passed,
      issues,
      modifiedContent: modifiedContent !== content ? modifiedContent : undefined,
      confidence: overallConfidence,
    }
  }

  private async checkRule(
    content: string,
    rule: SecurityRule,
  ): Promise<{
    issues: SecurityIssue[]
    modifiedContent?: string
    confidence: number
  }> {
    const issues: SecurityIssue[] = []
    const modifiedContent = content
    const confidence = 100

    switch (rule.type) {
      case "keyword":
        return this.checkKeywords(content, rule)

      case "regex":
        return this.checkRegex(content, rule)

      case "ai":
        return await this.checkWithAI(content, rule)

      case "custom":
        return this.checkCustom(content, rule)

      default:
        return { issues, confidence }
    }
  }

  private checkKeywords(
    content: string,
    rule: SecurityRule,
  ): {
    issues: SecurityIssue[]
    modifiedContent?: string
    confidence: number
  } {
    const issues: SecurityIssue[] = []
    let modifiedContent = content
    const confidence = 95

    if (rule.keywords) {
      for (const keyword of rule.keywords) {
        const regex = new RegExp(keyword, "gi")
        const matches = Array.from(content.matchAll(regex))

        for (const match of matches) {
          issues.push({
            ruleId: rule.id,
            ruleName: rule.name,
            severity: rule.severity,
            message: `检测到敏感词汇: ${keyword}`,
            position: { start: match.index!, end: match.index! + keyword.length },
            suggestion: "建议删除或替换该词汇",
          })

          // 如果是修改模式，替换敏感词
          if (rule.action === "modify") {
            modifiedContent = modifiedContent.replace(regex, "*".repeat(keyword.length))
          }
        }
      }
    }

    return { issues, modifiedContent: modifiedContent !== content ? modifiedContent : undefined, confidence }
  }

  private checkRegex(
    content: string,
    rule: SecurityRule,
  ): {
    issues: SecurityIssue[]
    modifiedContent?: string
    confidence: number
  } {
    const issues: SecurityIssue[] = []
    let modifiedContent = content
    const confidence = 90

    if (rule.pattern) {
      const regex = new RegExp(rule.pattern, "g")
      const matches = Array.from(content.matchAll(regex))

      for (const match of matches) {
        issues.push({
          ruleId: rule.id,
          ruleName: rule.name,
          severity: rule.severity,
          message: `检测到匹配模式: ${match[0]}`,
          position: { start: match.index!, end: match.index! + match[0].length },
          suggestion: "建议检查是否包含敏感信息",
        })

        // 如果是修改模式，用星号替换
        if (rule.action === "modify") {
          modifiedContent = modifiedContent.replace(match[0], "*".repeat(match[0].length))
        }
      }
    }

    return { issues, modifiedContent: modifiedContent !== content ? modifiedContent : undefined, confidence }
  }

  private async checkWithAI(
    content: string,
    rule: SecurityRule,
  ): Promise<{
    issues: SecurityIssue[]
    modifiedContent?: string
    confidence: number
  }> {
    const issues: SecurityIssue[] = []
    let confidence = 85

    try {
      // 这里应该调用AI服务进行内容分析
      // 模拟AI检查结果
      const aiResult = await this.simulateAICheck(content, rule)

      if (aiResult.hasIssue) {
        issues.push({
          ruleId: rule.id,
          ruleName: rule.name,
          severity: rule.severity,
          message: aiResult.message,
          suggestion: aiResult.suggestion,
        })
        confidence = aiResult.confidence
      }
    } catch (error) {
      console.error("AI检查失败:", error)
      confidence = 50
    }

    return { issues, confidence }
  }

  private async simulateAICheck(
    content: string,
    rule: SecurityRule,
  ): Promise<{
    hasIssue: boolean
    message: string
    suggestion: string
    confidence: number
  }> {
    // 模拟AI检查延迟
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 简单的模拟逻辑
    if (rule.id === "fake-news") {
      const suspiciousPatterns = ["据说", "听说", "传言", "爆料"]
      const hasSuspicious = suspiciousPatterns.some((pattern) => content.includes(pattern))

      return {
        hasIssue: hasSuspicious,
        message: "内容可能包含未经证实的信息",
        suggestion: "建议核实信息来源或添加免责声明",
        confidence: 75,
      }
    }

    if (rule.id === "copyright") {
      const copyrightPatterns = ["版权所有", "©", "转载请注明", "原创"]
      const hasCopyright = copyrightPatterns.some((pattern) => content.includes(pattern))

      return {
        hasIssue: hasCopyright && content.length > 500,
        message: "内容可能涉及版权问题",
        suggestion: "请确认内容使用权限或添加版权声明",
        confidence: 70,
      }
    }

    return {
      hasIssue: false,
      message: "",
      suggestion: "",
      confidence: 90,
    }
  }

  private checkCustom(
    content: string,
    rule: SecurityRule,
  ): {
    issues: SecurityIssue[]
    modifiedContent?: string
    confidence: number
  } {
    // 自定义规则检查逻辑
    const issues: SecurityIssue[] = []
    const confidence = 80

    // 这里可以实现自定义的检查逻辑
    return { issues, confidence }
  }

  // 批量检查
  async batchCheck(contents: string[]): Promise<SecurityCheckResult[]> {
    const results = await Promise.all(contents.map((content) => this.checkContent(content)))
    return results
  }

  // 获取安全统计
  getSecurityStats(): {
    totalRules: number
    enabledRules: number
    rulesByType: Record<string, number>
    rulesBySeverity: Record<string, number>
  } {
    const rules = Array.from(this.rules.values())
    const enabledRules = rules.filter((rule) => rule.enabled)

    const rulesByType = rules.reduce(
      (acc, rule) => {
        acc[rule.type] = (acc[rule.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const rulesBySeverity = rules.reduce(
      (acc, rule) => {
        acc[rule.severity] = (acc[rule.severity] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      totalRules: rules.length,
      enabledRules: enabledRules.length,
      rulesByType,
      rulesBySeverity,
    }
  }

  // 导出规则配置
  exportRules(): SecurityRule[] {
    return Array.from(this.rules.values())
  }

  // 导入规则配置
  importRules(rules: SecurityRule[]) {
    rules.forEach((rule) => this.addRule(rule))
  }

  // 重置为默认规则
  resetToDefault() {
    this.rules.clear()
    this.initializeRules()
  }
}

export const contentSecurityService = new ContentSecurityService()
