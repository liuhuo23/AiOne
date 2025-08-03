import { OpenAIService, ChatMessage } from './openaiService';
import { aiConfigManager, AIConfig } from './aiConfigManager';

export interface ChatResponse {
    content: string;
    isError?: boolean;
    errorMessage?: string;
}

export class AIChatService {
    private openaiService: OpenAIService | null = null;
    private isInitialized = false;

    constructor() {
        this.initialize();
    }

    private initialize(): void {
        const config = aiConfigManager.getConfig();

        if (config.provider === 'openai' && config.apiKey) {
            try {
                this.openaiService = new OpenAIService({
                    apiKey: config.apiKey,
                    baseURL: config.baseURL,
                    model: config.model,
                    temperature: config.temperature,
                    maxTokens: config.maxTokens
                });
                this.isInitialized = true;
            } catch (error) {
                console.error('Failed to initialize OpenAI service:', error);
                this.isInitialized = false;
            }
        }
    }

    async sendMessage(messages: ChatMessage[]): Promise<ChatResponse> {
        const config = aiConfigManager.getConfig();

        if (!config.apiKey) {
            return {
                content: '',
                isError: true,
                errorMessage: '请先配置 API 密钥'
            };
        }

        if (!this.isInitialized) {
            this.initialize();
        }

        try {
            switch (config.provider) {
                case 'openai':
                    if (!this.openaiService) {
                        throw new Error('OpenAI service not initialized');
                    }
                    const content = await this.openaiService.sendMessage(messages);
                    return { content };

                case 'kimi':
                case 'deepseek':
                    return await this.sendMessageToCompatibleAPI(messages, config);

                default:
                    throw new Error(`Unsupported provider: ${config.provider}`);
            }
        } catch (error: any) {
            console.error('AI chat error:', error);
            return {
                content: '',
                isError: true,
                errorMessage: error.message || '发送消息时发生错误'
            };
        }
    }

    async sendMessageStream(
        messages: ChatMessage[],
        onChunk: (chunk: string) => void,
        onError?: (error: string) => void
    ): Promise<void> {
        const config = aiConfigManager.getConfig();

        if (!config.apiKey) {
            onError?.('请先配置 API 密钥');
            return;
        }

        if (!this.isInitialized) {
            this.initialize();
        }

        try {
            switch (config.provider) {
                case 'openai':
                    if (!this.openaiService) {
                        throw new Error('OpenAI service not initialized');
                    }
                    await this.openaiService.sendMessageStream(messages, onChunk);
                    break;

                case 'kimi':
                case 'deepseek':
                    await this.sendMessageStreamToCompatibleAPI(messages, onChunk, config);
                    break;

                default:
                    throw new Error(`Unsupported provider: ${config.provider}`);
            }
        } catch (error: any) {
            console.error('AI chat stream error:', error);
            onError?.(error.message || '流式响应时发生错误');
        }
    }

    // 通用的 OpenAI 兼容 API 调用（用于 Kimi、DeepSeek 等）
    private async sendMessageToCompatibleAPI(
        messages: ChatMessage[],
        config: AIConfig
    ): Promise<ChatResponse> {
        const response = await fetch(`${config.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                temperature: config.temperature,
                max_tokens: config.maxTokens,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API 请求失败: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            throw new Error('API 返回数据格式错误');
        }

        return { content };
    }

    // 通用的流式 API 调用
    private async sendMessageStreamToCompatibleAPI(
        messages: ChatMessage[],
        onChunk: (chunk: string) => void,
        config: AIConfig
    ): Promise<void> {
        const response = await fetch(`${config.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
                model: config.model,
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                temperature: config.temperature,
                max_tokens: config.maxTokens,
                stream: true
            })
        });

        if (!response.ok) {
            throw new Error(`API 请求失败: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('无法获取响应流');
        }

        const decoder = new TextDecoder();
        let buffer = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6).trim();
                        if (data === '[DONE]') return;

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices?.[0]?.delta?.content;
                            if (content) {
                                onChunk(content);
                            }
                        } catch (e) {
                            // 忽略解析错误
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }

    cancelRequest(): void {
        if (this.openaiService) {
            this.openaiService.cancelRequest();
        }
    }

    updateConfig(): void {
        this.isInitialized = false;
        this.openaiService = null;
        this.initialize();
    }

    isReady(): boolean {
        return this.isInitialized && aiConfigManager.isConfigured();
    }
}

// 全局聊天服务实例
export const aiChatService = new AIChatService();
