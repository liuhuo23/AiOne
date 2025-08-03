import React, { useState, useEffect } from 'react';
import {
    Card,
    Form,
    Input,
    Select,
    Switch,
    Button,
    Space,
    Typography,
    message,
    Alert,
    Tabs,
    InputNumber,
    Tooltip,
    Badge,
    List,
    Avatar,
    Splitter
} from 'antd';
import {
    ApiOutlined,
    KeyOutlined,
    SettingOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface ModelProvider {
    id: string;
    name: string;
    type: 'openai' | 'claude' | 'local' | 'custom';
    apiKey?: string;
    baseUrl?: string;
    enabled: boolean;
    models: string[];
    defaultModel?: string;
    maxTokens?: number;
    temperature?: number;
    description?: string;
}

const ModelProviderPage: React.FC = () => {
    const [form] = Form.useForm();
    const [providers, setProviders] = useState<ModelProvider[]>([]);
    const [selectedProvider, setSelectedProvider] = useState<string>('openai');
    const [testingConnection, setTestingConnection] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'success' | 'error' | 'none'>('none');

    // 预设的模型提供商配置
    const providerConfigs = {
        openai: {
            name: 'OpenAI',
            baseUrl: 'https://api.openai.com/v1',
            models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4', 'gpt-3.5-turbo'],
            defaultModel: 'gpt-4o-mini',
            description: 'OpenAI官方API服务'
        },
        claude: {
            name: 'Anthropic Claude',
            baseUrl: 'https://api.anthropic.com/v1',
            models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
            defaultModel: 'claude-3-5-sonnet-20241022',
            description: 'Anthropic Claude AI助手'
        },
        local: {
            name: '本地模型',
            baseUrl: 'http://localhost:11434/v1',
            models: ['llama3.2', 'qwen2.5', 'gemma2'],
            defaultModel: 'llama3.2',
            description: '本地部署的开源模型（如Ollama）'
        },
        custom: {
            name: '自定义API',
            baseUrl: '',
            models: [],
            defaultModel: '',
            description: '自定义的API端点'
        }
    };

    useEffect(() => {
        // 初始化默认提供商配置
        const defaultProviders: ModelProvider[] = Object.entries(providerConfigs).map(([type, config]) => ({
            id: type,
            name: config.name,
            type: type as any,
            baseUrl: config.baseUrl,
            enabled: type === 'openai',
            models: config.models,
            defaultModel: config.defaultModel,
            maxTokens: 4096,
            temperature: 0.7,
            description: config.description
        }));
        setProviders(defaultProviders);

        // 设置表单初始值
        const currentProvider = defaultProviders.find(p => p.id === selectedProvider);
        if (currentProvider) {
            form.setFieldsValue(currentProvider);
        }
    }, []);

    const handleProviderChange = (providerId: string) => {
        setSelectedProvider(providerId);
        const provider = providers.find(p => p.id === providerId);
        if (provider) {
            form.setFieldsValue(provider);
        }
        setConnectionStatus('none');
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            setProviders(prev => prev.map(p =>
                p.id === selectedProvider ? { ...p, ...values } : p
            ));
            message.success('配置已保存');
        } catch (error) {
            message.error('请完善必填信息');
        }
    };

    const handleTestConnection = async () => {
        try {
            setTestingConnection(true);
            await form.validateFields(['apiKey', 'baseUrl']);

            // 这里应该调用实际的API测试连接
            // 模拟测试过程
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 模拟成功结果
            setConnectionStatus('success');
            message.success('连接测试成功');
        } catch (error) {
            setConnectionStatus('error');
            message.error('连接测试失败，请检查配置');
        } finally {
            setTestingConnection(false);
        }
    };

    const currentProvider = providers.find(p => p.id === selectedProvider);

    const renderConnectionStatus = () => {
        if (connectionStatus === 'none') return null;

        return (
            <Alert
                style={{ marginTop: 16 }}
                type={connectionStatus === 'success' ? 'success' : 'error'}
                icon={connectionStatus === 'success' ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
                message={connectionStatus === 'success' ? '连接测试成功' : '连接测试失败'}
                description={
                    connectionStatus === 'success'
                        ? 'API配置正确，可以正常使用'
                        : '请检查API密钥和基础URL是否正确'
                }
                showIcon
            />
        );
    };

    return (
        <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '24px', flexShrink: 0 }}>
                <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <ApiOutlined />
                    模型提供商设置
                </Title>
                <Paragraph type="secondary" style={{ margin: '8px 0 0 0' }}>
                    配置和管理AI模型提供商，包括API密钥、模型参数等设置
                </Paragraph>
            </div>

            <Splitter style={{ height: 'calc(100% - 100px)', flex: 1 }}>
                <Splitter.Panel defaultSize="25%" min="25%" max="30%">
                    {/* 左侧提供商列表 */}
                    <Card
                        title="提供商列表"
                        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        bodyStyle={{ flex: 1, overflow: 'auto', padding: 0 }}
                    >
                        <List
                            dataSource={providers}
                            renderItem={(provider) => (
                                <List.Item
                                    style={{
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        border: `2px solid ${selectedProvider === provider.id ? 'var(--ant-color-primary)' : 'var(--ant-color-border-secondary, #f0f0f0)'}`,
                                        background: selectedProvider === provider.id
                                            ? 'linear-gradient(90deg, var(--ant-color-primary-bg, #e6f7ff) 0%, var(--ant-color-primary-bg-hover, #bae7ff) 100%)'
                                            : 'var(--ant-color-bg-container, #fff)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        margin: '4px 8px',
                                        borderRadius: 8,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: selectedProvider === provider.id
                                            ? '0 4px 12px rgba(24, 144, 255, 0.15)'
                                            : '0 1px 3px rgba(0, 0, 0, 0.05)',
                                        transform: selectedProvider === provider.id ? 'translateX(4px)' : 'translateX(0)',
                                    }}
                                    onClick={() => handleProviderChange(provider.id)}
                                    onMouseEnter={(e) => {
                                        if (selectedProvider !== provider.id) {
                                            e.currentTarget.style.background = 'var(--ant-color-fill-tertiary, #f5f5f5)';
                                            e.currentTarget.style.transform = 'translateX(2px)';
                                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedProvider !== provider.id) {
                                            e.currentTarget.style.background = 'var(--ant-color-bg-container, #fff)';
                                            e.currentTarget.style.transform = 'translateX(0)';
                                            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                                        }
                                    }}
                                >
                                    {/* 左侧高亮条 */}
                                    {selectedProvider === provider.id && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                left: 0,
                                                top: 0,
                                                bottom: 0,
                                                width: 4,
                                                background: 'linear-gradient(180deg, var(--ant-color-primary, #1890ff) 0%, var(--ant-color-primary-active, #096dd9) 100%)',
                                                borderRadius: '0 2px 2px 0',
                                            }}
                                        />
                                    )}

                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                style={{
                                                    backgroundColor: selectedProvider === provider.id
                                                        ? 'var(--ant-color-primary)'
                                                        : 'var(--ant-color-fill-quaternary, #f5f5f5)',
                                                    color: selectedProvider === provider.id
                                                        ? '#fff'
                                                        : 'var(--ant-color-text-secondary)',
                                                    transition: 'all 0.3s ease',
                                                    border: selectedProvider === provider.id
                                                        ? '2px solid rgba(255, 255, 255, 0.3)'
                                                        : '1px solid var(--ant-color-border-secondary)',
                                                }}
                                                icon={<ApiOutlined />}
                                            />
                                        }
                                        title={
                                            <Text
                                                strong
                                                style={{
                                                    color: selectedProvider === provider.id
                                                        ? 'var(--ant-color-primary)'
                                                        : 'var(--ant-color-text)',
                                                    fontSize: selectedProvider === provider.id ? 16 : 14,
                                                    transition: 'all 0.3s ease',
                                                }}
                                            >
                                                {provider.name}
                                            </Text>
                                        }
                                        description={
                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 12,
                                                    color: selectedProvider === provider.id
                                                        ? 'var(--ant-color-primary-text-hover)'
                                                        : 'var(--ant-color-text-tertiary)'
                                                }}
                                            >
                                                {provider.description}
                                            </Text>
                                        }
                                    />
                                    <Badge
                                        status={provider.enabled ? 'success' : 'default'}
                                        text={
                                            <span style={{
                                                fontSize: 12,
                                                fontWeight: selectedProvider === provider.id ? 500 : 400,
                                                color: selectedProvider === provider.id
                                                    ? 'var(--ant-color-primary)'
                                                    : 'var(--ant-color-text-secondary)'
                                            }}>
                                                {provider.enabled ? '已启用' : '未启用'}
                                            </span>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Splitter.Panel>

                <Splitter.Panel>
                    {/* 右侧配置面板 */}
                    <Card
                        title={
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <SettingOutlined />
                                {currentProvider?.name} 配置
                            </div>
                        }
                        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                        bodyStyle={{ flex: 1, overflow: 'auto' }}
                        extra={
                            <Space>
                                <Button onClick={handleSave} type="primary">
                                    保存配置
                                </Button>
                            </Space>
                        }
                    >
                        {currentProvider && (
                            <Form
                                form={form}
                                layout="vertical"
                                initialValues={currentProvider}
                            >
                                <Tabs
                                    defaultActiveKey="basic"
                                    items={[
                                        {
                                            key: 'basic',
                                            label: '基础配置',
                                            children: (
                                                <>
                                                    <Form.Item
                                                        label="启用状态"
                                                        name="enabled"
                                                        valuePropName="checked"
                                                    >
                                                        <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                                                    </Form.Item>

                                                    <Form.Item
                                                        label={
                                                            <span>
                                                                API密钥
                                                                <Tooltip title="从提供商获取的API密钥">
                                                                    <InfoCircleOutlined style={{ marginLeft: 4 }} />
                                                                </Tooltip>
                                                            </span>
                                                        }
                                                        name="apiKey"
                                                        rules={[{ required: true, message: '请输入API密钥' }]}
                                                    >
                                                        <Input.Password
                                                            placeholder="请输入API密钥"
                                                            prefix={<KeyOutlined />}
                                                        />
                                                    </Form.Item>

                                                    <Form.Item
                                                        label="API基础URL"
                                                        name="baseUrl"
                                                        rules={[{ required: true, message: '请输入API基础URL' }]}
                                                    >
                                                        <Input placeholder="例如: https://api.openai.com/v1" />
                                                    </Form.Item>

                                                    <Form.Item>
                                                        <Button
                                                            onClick={handleTestConnection}
                                                            loading={testingConnection}
                                                            icon={<ApiOutlined />}
                                                        >
                                                            测试连接
                                                        </Button>
                                                    </Form.Item>

                                                    {renderConnectionStatus()}
                                                </>
                                            )
                                        },
                                        {
                                            key: 'models',
                                            label: '模型设置',
                                            children: (
                                                <>
                                                    <Form.Item
                                                        label="可用模型"
                                                        name="models"
                                                    >
                                                        <Select
                                                            mode="tags"
                                                            placeholder="输入模型名称并回车添加"
                                                            style={{ width: '100%' }}
                                                        >
                                                            {currentProvider.models.map(model => (
                                                                <Option key={model} value={model}>{model}</Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>

                                                    <Form.Item
                                                        label="默认模型"
                                                        name="defaultModel"
                                                    >
                                                        <Select placeholder="选择默认使用的模型">
                                                            {currentProvider.models.map(model => (
                                                                <Option key={model} value={model}>{model}</Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                </>
                                            )
                                        },
                                        {
                                            key: 'parameters',
                                            label: '参数设置',
                                            children: (
                                                <>
                                                    <Form.Item
                                                        label={
                                                            <span>
                                                                最大Token数
                                                                <Tooltip title="模型生成的最大token数量">
                                                                    <InfoCircleOutlined style={{ marginLeft: 4 }} />
                                                                </Tooltip>
                                                            </span>
                                                        }
                                                        name="maxTokens"
                                                    >
                                                        <InputNumber
                                                            min={1}
                                                            max={32000}
                                                            style={{ width: '100%' }}
                                                            placeholder="4096"
                                                        />
                                                    </Form.Item>

                                                    <Form.Item
                                                        label={
                                                            <span>
                                                                温度值
                                                                <Tooltip title="控制输出的随机性，0-2之间，值越高越随机">
                                                                    <InfoCircleOutlined style={{ marginLeft: 4 }} />
                                                                </Tooltip>
                                                            </span>
                                                        }
                                                        name="temperature"
                                                    >
                                                        <InputNumber
                                                            min={0}
                                                            max={2}
                                                            step={0.1}
                                                            style={{ width: '100%' }}
                                                            placeholder="0.7"
                                                        />
                                                    </Form.Item>

                                                    <Form.Item
                                                        label="描述"
                                                        name="description"
                                                    >
                                                        <TextArea
                                                            rows={3}
                                                            placeholder="可选：输入该提供商的描述信息"
                                                        />
                                                    </Form.Item>
                                                </>
                                            )
                                        }
                                    ]}
                                />
                            </Form>
                        )}
                    </Card>
                </Splitter.Panel>
            </Splitter>
        </div>
    );
};

export default ModelProviderPage;
