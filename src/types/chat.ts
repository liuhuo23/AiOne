export interface ChatTopic {
    id: string;
    title: string;
    lastMessage?: string;
    messageCount: number;
    createdAt: Date;
    updatedAt: Date;
    assistantId: string;
}

export interface ChatMessage {
    id: string;
    topicId: string;
    content: string;
    role: 'user' | 'assistant' | 'system';
    createdAt: Date;
    tokens?: number;
}

export interface ChatSettings {
    maxTokens: number;
    temperature: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    systemPrompt: string;
    enableStreaming: boolean;
    autoSave: boolean;
    showWordCount: boolean;
}

export interface UISettings {
    theme: 'light' | 'dark' | 'auto';
    fontSize: number;
    fontFamily: string;
    primaryColor: string;
    messageSpacing: number;
    showTimestamp: boolean;
    showAvatar: boolean;
    messageAnimation: boolean;
    compactMode: boolean;
}

export interface AssistantSettings {
    chatSettings: ChatSettings;
    uiSettings: UISettings;
}
