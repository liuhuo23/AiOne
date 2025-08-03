import React, { useState, useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    Slider,
    InputNumber,
    Button,
    Space,
    Typography,
    Alert,
    Card
} from 'antd';
import { SettingOutlined, KeyOutlined, RobotOutlined } from '@ant-design/icons';
import { aiConfigManager, AI_PROVIDERS, AIConfig } from '../services/aiConfigManager';
import { aiChatService } from '../services/aiChatService';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface AISettingsModalProps {
    visible: boolean;
    onClose: () => void;
    onConfigUpdated?: () => void;
}

const AISettingsModal: React.FC<AISettingsModalProps> = ({
    visible,
    onClose,
    onConfigUpdated
}) => {
    const [form] = Form.useForm();
    const [config, setConfig] = useState<AIConfig>(aiConfigManager.getConfig());
    const [currentProvider, setCurrentProvider] = useState(config.provider);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    useEffect(() => {
        if (visible) {
            const currentConfig = aiConfigManager.getConfig();
            setConfig(currentConfig);
            setCurrentProvider(currentConfig.provider);
            form.setFieldsValue(currentConfig);
        }
    }, [visible, form]);

    const handleProviderChange = (provider: 'openai' | 'kimi' | 'deepseek') => {
        setCurrentProvider(provider);
        const providerInfo = AI_PROVIDERS[provider];
        form.setFieldsValue({
            provider,
            model: providerInfo.defaultModel,
            baseURL: providerInfo.baseURL
        });
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            aiConfigManager.updateConfig(values);
            aiChatService.updateConfig();
            setConfig(values);
            setTestResult(null);
            onConfigUpdated?.();
            onClose();
        } catch (error) {
            console.error('Failed to save config:', error);
        }
    };

    const handleTest = async () => {
        try {
            setTesting(true);
            setTestResult(null);

            const values = await form.validateFields();

            // 临时更新配置进行测试
            const originalConfig = aiConfigManager.getConfig();
            aiConfigManager.updateConfig(values);
            aiChatService.updateConfig();

            const testMessages = [
                { role: 'user' as const, content: '你好，这是一个测试消息。' }
            ];

            const response = await aiChatService.sendMessage(testMessages);

            if (response.isError) {
                setTestResult({
                    success: false,
                    message: response.errorMessage || '测试失败'
                });
                // 恢复原配置
                aiConfigManager.updateConfig(originalConfig);
                aiChatService.updateConfig();
            } else {
                setTestResult({
                    success: true,
                    message: '连接成功！AI 响应正常。'
                });
            }
        } catch (error: any) {
            setTestResult({
                success: false,
                message: error.message || '连接测试失败'
            });
        } finally {
            setTesting(false);
        }
    };

    const getModelOptions = () => {
        const provider = AI_PROVIDERS[currentProvider];
        return provider ? provider.models : [];
    };

    const getAPIKeyPlaceholder = () => {
        switch (currentProvider) {
            case 'openai':
                return 'sk-xxx...';
            case 'kimi':
                return 'sk-xxx...';
            case 'deepseek':
                return 'sk-xxx...';
            default:
                return '请输入 API 密钥';
        }
    };

    const getProviderDocURL = () => {
        switch (currentProvider) {
            case 'openai':
                return 'https://platform.openai.com/api-keys';
            case 'kimi':
                return 'https://platform.moonshot.cn/console/api-keys';
            case 'deepseek':
                return 'https://platform.deepseek.com/api_keys';
            default:
                return '';
        }
    };

    return (
        <Modal
            title={
                <Space>
                    <SettingOutlined />
                    <span>AI 设置</span>
                </Space>
            }
            open={visible}
            onCancel={onClose}
            width={600}
            footer={
                <Space>
                    <Button onClick={onClose}>
                        取消
                    </Button>
                    <Button
                        onClick={handleTest}
                        loading={testing}
                        disabled={!form.getFieldValue('apiKey')}
                    >
                        测试连接
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleSave}
                        disabled={!form.getFieldValue('apiKey')}
                    >
                        保存配置
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={config}
            >
                {/* 提供商选择 */}
                <Card size="small" style={{ marginBottom: 16 }}>
                    <Title level={5}>
                        <RobotOutlined /> AI 提供商
                    </Title>
                    <Form.Item
                        name="provider"
                        label="选择 AI 提供商"
                        rules={[{ required: true, message: '请选择 AI 提供商' }]}
                    >
                        <Select onChange={handleProviderChange}>
                            {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                                <Option key={key} value={key}>
                                    {provider.displayName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Card>

                {/* API 配置 */}
                <Card size="small" style={{ marginBottom: 16 }}>
                    <Title level={5}>
                        <KeyOutlined /> API 配置
                    </Title>

                    <Form.Item
                        name="apiKey"
                        label="API 密钥"
                        rules={[{ required: true, message: '请输入 API 密钥' }]}
                        extra={
                            <Text type="secondary">
                                在 <a href={getProviderDocURL()} target="_blank" rel="noopener noreferrer">
                                    {AI_PROVIDERS[currentProvider]?.displayName} 控制台
                                </a> 获取您的 API 密钥
                            </Text>
                        }
                    >
                        <Input.Password
                            placeholder={getAPIKeyPlaceholder()}
                            autoComplete="off"
                        />
                    </Form.Item>

                    <Form.Item
                        name="baseURL"
                        label="API 基础URL"
                        rules={[{ required: true, message: '请输入 API 基础URL' }]}
                    >
                        <Input placeholder="https://api.openai.com/v1" />
                    </Form.Item>

                    <Form.Item
                        name="model"
                        label="模型"
                        rules={[{ required: true, message: '请选择模型' }]}
                    >
                        <Select>
                            {getModelOptions().map(model => (
                                <Option key={model} value={model}>
                                    {model}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Card>

                {/* 高级参数 */}
                <Card size="small">
                    <Title level={5}>高级参数</Title>

                    <Form.Item
                        name="temperature"
                        label={`创造性 (Temperature): ${form.getFieldValue('temperature') || 0.7}`}
                    >
                        <Slider
                            min={0}
                            max={2}
                            step={0.1}
                            marks={{
                                0: '精确',
                                0.7: '平衡',
                                1.4: '创意',
                                2: '随机'
                            }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="maxTokens"
                        label="最大输出长度"
                    >
                        <InputNumber
                            min={100}
                            max={8192}
                            step={100}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Card>

                {/* 测试结果 */}
                {testResult && (
                    <Alert
                        style={{ marginTop: 16 }}
                        message={testResult.success ? '连接成功' : '连接失败'}
                        description={testResult.message}
                        type={testResult.success ? 'success' : 'error'}
                        showIcon
                    />
                )}

                {/* 使用说明 */}
                <Alert
                    style={{ marginTop: 16 }}
                    message="使用说明"
                    description={
                        <div>
                            <Paragraph style={{ marginBottom: 8 }}>
                                • API 密钥将保存在本地，不会上传到服务器
                            </Paragraph>
                            <Paragraph style={{ marginBottom: 8 }}>
                                • 建议先点击"测试连接"确认配置正确
                            </Paragraph>
                            <Paragraph style={{ marginBottom: 0 }}>
                                • 不同提供商的 API 费用和限制可能不同，请查看相应文档
                            </Paragraph>
                        </div>
                    }
                    type="info"
                    showIcon
                />
            </Form>
        </Modal>
    );
};

export default AISettingsModal;
