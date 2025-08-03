import OpenAI from 'openai';

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface OpenAIConfig {
    apiKey: string;
    baseURL?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
}

export class OpenAIService {
    private client: OpenAI | null = null;
    private config: OpenAIConfig;
    private abortController: AbortController | null = null;

    constructor(config: OpenAIConfig) {
        this.config = {
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            maxTokens: 2048,
            ...config
        };
        this.initialize();
    }

    private initialize() {
        if (!this.config.apiKey) {
            throw new Error('OpenAI API key is required');
        }

        this.client = new OpenAI({
            apiKey: this.config.apiKey,
            baseURL: this.config.baseURL,
            dangerouslyAllowBrowser: true // 注意：在生产环境中应该通过后端代理
        });
    }

    async sendMessage(messages: ChatMessage[]): Promise<string> {
        if (!this.client) {
            throw new Error('OpenAI client not initialized');
        }

        // 取消之前的请求
        if (this.abortController) {
            this.abortController.abort();
        }

        this.abortController = new AbortController();

        try {
            const completion = await this.client.chat.completions.create({
                model: this.config.model!,
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                temperature: this.config.temperature,
                max_tokens: this.config.maxTokens,
                stream: false
            }, {
                signal: this.abortController.signal
            });

            const response = completion.choices[0]?.message?.content;
            if (!response) {
                throw new Error('No response received from OpenAI');
            }

            return response;
        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw new Error('Request was cancelled');
            }
            throw new Error(`OpenAI API error: ${error.message}`);
        }
    }

    async sendMessageStream(
        messages: ChatMessage[],
        onChunk: (chunk: string) => void
    ): Promise<void> {
        if (!this.client) {
            throw new Error('OpenAI client not initialized');
        }

        // 取消之前的请求
        if (this.abortController) {
            this.abortController.abort();
        }

        this.abortController = new AbortController();

        try {
            const stream = await this.client.chat.completions.create({
                model: this.config.model!,
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                temperature: this.config.temperature,
                max_tokens: this.config.maxTokens,
                stream: true
            }, {
                signal: this.abortController.signal
            });

            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                    onChunk(content);
                }
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw new Error('Request was cancelled');
            }
            throw new Error(`OpenAI API error: ${error.message}`);
        }
    }

    cancelRequest() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }

    updateConfig(newConfig: Partial<OpenAIConfig>) {
        this.config = { ...this.config, ...newConfig };
        if (newConfig.apiKey || newConfig.baseURL) {
            this.initialize();
        }
    }

    getConfig(): OpenAIConfig {
        return { ...this.config };
    }
}

// 默认配置
export const defaultOpenAIConfig: OpenAIConfig = {
    apiKey: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2048
};

// 创建全局实例（需要先设置 API key）
let openAIService: OpenAIService | null = null;

export const getOpenAIService = (config?: OpenAIConfig): OpenAIService => {
    if (!openAIService) {
        if (!config?.apiKey) {
            throw new Error('OpenAI API key is required to initialize service');
        }
        openAIService = new OpenAIService(config);
    }
    return openAIService;
};

export const setOpenAIService = (config: OpenAIConfig): void => {
    openAIService = new OpenAIService(config);
};
