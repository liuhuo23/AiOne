// AI 配置管理
export interface AIConfig {
    provider: 'openai' | 'kimi' | 'deepseek';
    apiKey: string;
    baseURL?: string;
    model: string;
    temperature: number;
    maxTokens: number;
}

export interface AIProvider {
    name: string;
    displayName: string;
    baseURL: string;
    models: string[];
    defaultModel: string;
}

export const AI_PROVIDERS: Record<string, AIProvider> = {
    openai: {
        name: 'openai',
        displayName: 'OpenAI',
        baseURL: 'https://api.openai.com/v1',
        models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview'],
        defaultModel: 'gpt-3.5-turbo'
    },
    kimi: {
        name: 'kimi',
        displayName: '月之暗面 Kimi',
        baseURL: 'https://api.moonshot.cn/v1',
        models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
        defaultModel: 'moonshot-v1-8k'
    },
    deepseek: {
        name: 'deepseek',
        displayName: 'DeepSeek',
        baseURL: 'https://api.deepseek.com/v1',
        models: ['deepseek-chat', 'deepseek-coder'],
        defaultModel: 'deepseek-chat'
    }
};

export const DEFAULT_AI_CONFIG: AIConfig = {
    provider: 'openai',
    apiKey: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2048
};

class AIConfigManager {
    private config: AIConfig;
    private readonly storageKey = 'ai_config';

    constructor() {
        this.config = this.loadConfig();
    }

    private loadConfig(): AIConfig {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                return { ...DEFAULT_AI_CONFIG, ...parsed };
            }
        } catch (error) {
            console.warn('Failed to load AI config from localStorage:', error);
        }
        return { ...DEFAULT_AI_CONFIG };
    }

    private saveConfig(): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.config));
        } catch (error) {
            console.warn('Failed to save AI config to localStorage:', error);
        }
    }

    getConfig(): AIConfig {
        return { ...this.config };
    }

    updateConfig(updates: Partial<AIConfig>): void {
        this.config = { ...this.config, ...updates };

        // 当切换提供商时，更新模型为该提供商的默认模型
        if (updates.provider) {
            const provider = AI_PROVIDERS[updates.provider];
            if (provider && !updates.model) {
                this.config.model = provider.defaultModel;
                this.config.baseURL = provider.baseURL;
            }
        }

        this.saveConfig();
    }

    setAPIKey(apiKey: string): void {
        this.updateConfig({ apiKey });
    }

    setProvider(provider: 'openai' | 'kimi' | 'deepseek'): void {
        this.updateConfig({ provider });
    }

    setModel(model: string): void {
        this.updateConfig({ model });
    }

    isConfigured(): boolean {
        return !!this.config.apiKey && !!this.config.provider;
    }

    getCurrentProvider(): AIProvider | null {
        return AI_PROVIDERS[this.config.provider] || null;
    }

    getAvailableModels(): string[] {
        const provider = this.getCurrentProvider();
        return provider ? provider.models : [];
    }

    reset(): void {
        this.config = { ...DEFAULT_AI_CONFIG };
        this.saveConfig();
    }
}

// 全局配置管理器实例
export const aiConfigManager = new AIConfigManager();
