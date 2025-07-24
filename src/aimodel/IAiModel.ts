export interface AiRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  [key: string]: any;
}

export interface AiResponse {
  id: string;
  content: string;
  model: string;
  createdAt: Date;
  finishReason?: string;
  [key: string]: any;
}

export interface IAiModel {
  /**
   * 初始化AI模型
   * @param config 模型配置参数
   */
  initialize(config?: Record<string, any>): Promise<boolean>;

  /**
   * 生成文本响应
   * @param request 请求参数
   * @returns 响应结果
   */
  generateText(request: AiRequest): Promise<AiResponse>;

  /**
   * 取消当前请求
   */
  cancel(): void;

  /**
   * 获取模型状态
   * @returns 当前状态
   */
  getStatus(): 'idle' | 'loading' | 'error' | 'ready';

  /**
   * 设置模型配置
   * @param config 配置参数
   */
  setConfig(config: Record<string, any>): void;

  /**
   * 获取当前模型配置
   * @returns 当前配置
   */
  getConfig(): Record<string, any>;
}

// 基础实现类，供具体模型继承
export abstract class BaseAiModel implements IAiModel {
  protected status: 'idle' | 'loading' | 'error' | 'ready' = 'idle';
  protected config: Record<string, any> = {};

  async initialize(config?: Record<string, any>): Promise<boolean> {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    this.status = 'ready';
    return true;
  }

  abstract generateText(request: AiRequest): Promise<AiResponse>;

  cancel(): void {
    this.status = 'idle';
  }

  getStatus(): 'idle' | 'loading' | 'error' | 'ready' {
    return this.status;
  }

  setConfig(config: Record<string, any>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): Record<string, any> {
    return { ...this.config };
  }
}