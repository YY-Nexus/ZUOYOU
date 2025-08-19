"use client"

// AI模型服务管理器
export interface AIModelConfig {
  name: string
  provider: string
  apiKey?: string
  endpoint?: string
  model: string
  maxTokens?: number
  temperature?: number
  enabled: boolean
}

export interface AIResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
  finishReason?: string
}

export class AIModelService {
  private models: Map<string, AIModelConfig> = new Map()
  private defaultModel = "gpt-4"

  constructor() {
    this.initializeModels()
  }

  private initializeModels() {
    // 国外模型
    this.addModel({
      name: "GPT-4",
      provider: "openai",
      model: "gpt-4",
      maxTokens: 4096,
      temperature: 0.7,
      enabled: true,
    })

    this.addModel({
      name: "GPT-3.5 Turbo",
      provider: "openai",
      model: "gpt-3.5-turbo",
      maxTokens: 4096,
      temperature: 0.7,
      enabled: true,
    })

    // 国内模型
    this.addModel({
      name: "通义千问",
      provider: "alibaba",
      model: "qwen-turbo",
      endpoint: "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
      maxTokens: 2048,
      temperature: 0.7,
      enabled: true,
    })

    this.addModel({
      name: "百川大模型",
      provider: "baichuan",
      model: "Baichuan2-Turbo",
      endpoint: "https://api.baichuan-ai.com/v1/chat/completions",
      maxTokens: 2048,
      temperature: 0.7,
      enabled: true,
    })

    this.addModel({
      name: "ChatGLM",
      provider: "zhipu",
      model: "chatglm_turbo",
      endpoint: "https://open.bigmodel.cn/api/paas/v3/model-api/chatglm_turbo/invoke",
      maxTokens: 2048,
      temperature: 0.7,
      enabled: true,
    })

    this.addModel({
      name: "讯飞星火",
      provider: "xunfei",
      model: "spark-3.0",
      endpoint: "wss://spark-api.xf-yun.com/v3.1/chat",
      maxTokens: 2048,
      temperature: 0.7,
      enabled: true,
    })

    // 本地模型
    this.addModel({
      name: "Ollama Local",
      provider: "ollama",
      model: "llama2",
      endpoint: "http://localhost:11434/api/generate",
      maxTokens: 2048,
      temperature: 0.7,
      enabled: false,
    })
  }

  addModel(config: AIModelConfig) {
    this.models.set(config.name, config)
  }

  getModel(name: string): AIModelConfig | undefined {
    return this.models.get(name)
  }

  getAvailableModels(): AIModelConfig[] {
    return Array.from(this.models.values()).filter((model) => model.enabled)
  }

  async generateContent(
    prompt: string,
    modelName?: string,
    options?: {
      maxTokens?: number
      temperature?: number
      systemPrompt?: string
    },
  ): Promise<AIResponse> {
    const model = this.getModel(modelName || this.defaultModel)
    if (!model) {
      throw new Error(`Model ${modelName} not found`)
    }

    try {
      switch (model.provider) {
        case "openai":
          return await this.callOpenAI(model, prompt, options)
        case "alibaba":
          return await this.callQianwen(model, prompt, options)
        case "baichuan":
          return await this.callBaichuan(model, prompt, options)
        case "zhipu":
          return await this.callChatGLM(model, prompt, options)
        case "xunfei":
          return await this.callXunfei(model, prompt, options)
        case "ollama":
          return await this.callOllama(model, prompt, options)
        default:
          throw new Error(`Provider ${model.provider} not supported`)
      }
    } catch (error) {
      console.error("AI model call failed:", error)
      throw error
    }
  }

  private async callOpenAI(model: AIModelConfig, prompt: string, options?: any): Promise<AIResponse> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${model.apiKey}`,
      },
      body: JSON.stringify({
        model: model.model,
        messages: [
          ...(options?.systemPrompt ? [{ role: "system", content: options.systemPrompt }] : []),
          { role: "user", content: prompt },
        ],
        max_tokens: options?.maxTokens || model.maxTokens,
        temperature: options?.temperature || model.temperature,
      }),
    })

    const data = await response.json()
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: model.model,
      finishReason: data.choices[0].finish_reason,
    }
  }

  private async callQianwen(model: AIModelConfig, prompt: string, options?: any): Promise<AIResponse> {
    const response = await fetch(model.endpoint!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${model.apiKey}`,
      },
      body: JSON.stringify({
        model: model.model,
        input: {
          messages: [
            ...(options?.systemPrompt ? [{ role: "system", content: options.systemPrompt }] : []),
            { role: "user", content: prompt },
          ],
        },
        parameters: {
          max_tokens: options?.maxTokens || model.maxTokens,
          temperature: options?.temperature || model.temperature,
        },
      }),
    })

    const data = await response.json()
    return {
      content: data.output.text,
      usage: data.usage,
      model: model.model,
    }
  }

  private async callBaichuan(model: AIModelConfig, prompt: string, options?: any): Promise<AIResponse> {
    const response = await fetch(model.endpoint!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${model.apiKey}`,
      },
      body: JSON.stringify({
        model: model.model,
        messages: [
          ...(options?.systemPrompt ? [{ role: "system", content: options.systemPrompt }] : []),
          { role: "user", content: prompt },
        ],
        max_tokens: options?.maxTokens || model.maxTokens,
        temperature: options?.temperature || model.temperature,
      }),
    })

    const data = await response.json()
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: model.model,
    }
  }

  private async callChatGLM(model: AIModelConfig, prompt: string, options?: any): Promise<AIResponse> {
    const response = await fetch(model.endpoint!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${model.apiKey}`,
      },
      body: JSON.stringify({
        model: model.model,
        prompt: [
          ...(options?.systemPrompt ? [{ role: "system", content: options.systemPrompt }] : []),
          { role: "user", content: prompt },
        ],
        temperature: options?.temperature || model.temperature,
        max_tokens: options?.maxTokens || model.maxTokens,
      }),
    })

    const data = await response.json()
    return {
      content: data.choices[0].content,
      model: model.model,
    }
  }

  private async callXunfei(model: AIModelConfig, prompt: string, options?: any): Promise<AIResponse> {
    // 讯飞星火使用WebSocket连接，这里简化处理
    return new Promise((resolve, reject) => {
      // 实际实现需要WebSocket连接
      setTimeout(() => {
        resolve({
          content: `[讯飞星火模拟回复] ${prompt}`,
          model: model.model,
        })
      }, 1000)
    })
  }

  private async callOllama(model: AIModelConfig, prompt: string, options?: any): Promise<AIResponse> {
    const response = await fetch(model.endpoint!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model.model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: options?.temperature || model.temperature,
          num_predict: options?.maxTokens || model.maxTokens,
        },
      }),
    })

    const data = await response.json()
    return {
      content: data.response,
      model: model.model,
    }
  }

  // 成本计算
  calculateCost(usage: any, modelName: string): number {
    const model = this.getModel(modelName)
    if (!model) return 0

    // 简化的成本计算，实际需要根据各厂商定价
    const costs = {
      "gpt-4": { input: 0.03, output: 0.06 },
      "gpt-3.5-turbo": { input: 0.001, output: 0.002 },
      "qwen-turbo": { input: 0.008, output: 0.008 },
      "Baichuan2-Turbo": { input: 0.005, output: 0.005 },
      chatglm_turbo: { input: 0.005, output: 0.005 },
      "spark-3.0": { input: 0.006, output: 0.006 },
    }

    const modelCost = costs[model.model as keyof typeof costs]
    if (!modelCost || !usage) return 0

    return (usage.promptTokens * modelCost.input + usage.completionTokens * modelCost.output) / 1000
  }

  // 使用统计
  async getUsageStats(): Promise<any> {
    // 实际实现需要从数据库获取
    return {
      totalRequests: 1250,
      totalTokens: 125000,
      totalCost: 15.75,
      modelUsage: {
        "GPT-4": 45,
        通义千问: 30,
        ChatGLM: 25,
      },
    }
  }
}

export const aiModelService = new AIModelService()
