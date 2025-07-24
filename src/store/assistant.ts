/**
 * 获取一个默认助手对象
 */
export function getDefaultAssistant(): AssistantType {
    return {
        id: 'default',
        name: '默认助手',
        model: 'gpt-3.5-turbo',
        modelParams: {
            model: 'gpt-3.5-turbo',
            temperature: 1,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

// OpenAI 官方参数
export interface OpenAIParams {
    /** 使用的模型名称，如 'gpt-3.5-turbo' */
    model: string;
    /** 采样温度，控制输出多样性，0-2之间，默认1 */
    temperature?: number;
    /** nucleus采样，0-1之间，默认1 */
    top_p?: number;
    /** 返回多少个结果 */
    n?: number;
    /** 是否流式输出 */
    stream?: boolean;
    /** 停止词数组 */
    stop?: string[];
    /** 最大生成 token 数 */
    max_tokens?: number;
    /** 存在惩罚，-2.0~2.0，越大越鼓励新话题 */
    presence_penalty?: number;
    /** 频率惩罚，-2.0~2.0，越大越减少重复 */
    frequency_penalty?: number;
    /** 对特定 token 的概率进行偏置 */
    logit_bias?: Record<string, number>;
    /** 用户标识 */
    user?: string;
}

// 另一个常见AI类型（如本地/开源模型）参数
interface LocalAIParams {
    /** 使用的模型名称，如 'llama-2' */
    model: string;
    /** 采样温度，控制输出多样性 */
    temperature?: number;
    /** 最大上下文长度 */
    maxContext?: number;
    /** 是否流式输出 */
    stream?: boolean;
    /** 是否启用思考模式 */
    enableThought?: boolean;
    /** top_k 采样，控制候选数量 */
    top_k?: number;
    /** nucleus采样，0-1之间 */
    top_p?: number;
    /** 重复惩罚系数 */
    repetition_penalty?: number;
    /** 最大生成新 token 数 */
    max_new_tokens?: number;
    /** 停止词数组 */
    stop?: string[];
    /** 其他自定义参数 */
    [key: string]: any;
}

type ModelParams = OpenAIParams | LocalAIParams;

export interface AssistantType {
    // 助手id
    id: string;
    // 助手名称
    name: string;
    // 选择的模型
    model: string;
    // 当前模型的参数
    modelParams: ModelParams;
    createdAt: Date;
    updatedAt: Date;
}