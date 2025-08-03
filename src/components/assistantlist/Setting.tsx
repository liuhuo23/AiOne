import React, { useState, useEffect } from "react";
import "./Setting.css";
import {
    Card,
    Form,
    Input,
    InputNumber,
    Switch,
    Select,
    Slider,
    Button,
    Space,
    Typography,
    Divider,
    message,
    Tabs,
    ColorPicker,
    Radio,
    Tooltip
} from "antd";
import {
    SettingOutlined,
    MessageOutlined,
    EyeOutlined,
    RobotOutlined,
    SaveOutlined,
    ReloadOutlined,
    InfoCircleOutlined
} from "@ant-design/icons";
import { AssistantType } from "@/store/assistant";
import { ChatSettings, UISettings } from "@/types/chat";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface SettingsProps {
    assistant?: AssistantType;
}

const Settings: React.FC<SettingsProps> = ({ assistant }) => {
    const [form] = Form.useForm();
    const [chatSettings, setChatSettings] = useState<ChatSettings>({
        maxTokens: 4096,
        temperature: 0.7,
        topP: 1.0,
        frequencyPenalty: 0.0,
        presencePenalty: 0.0,
        systemPrompt: "你是一个有用的AI助手，请提供准确、有帮助的回答。",
        enableStreaming: true,
        autoSave: true,
        showWordCount: true
    });

    const [uiSettings, setUISettings] = useState<UISettings>({
        theme: 'auto',
        fontSize: 14,
        fontFamily: 'Microsoft YaHei',
        primaryColor: '#1890ff',
        messageSpacing: 16,
        showTimestamp: true,
        showAvatar: true,
        messageAnimation: true,
        compactMode: false
    });

    useEffect(() => {
        // 根据当前助手加载设置
        if (assistant) {
            loadSettingsForAssistant(assistant.id);
        }
    }, [assistant]);

    const loadSettingsForAssistant = (assistantId: string) => {
        // 模拟从存储中加载设置
        // 这里可以从 localStorage 或数据库加载设置
        console.log(`加载助手 ${assistantId} 的设置`);
    };

    const handleSaveChatSettings = async () => {
        try {
            const values = await form.validateFields();
            setChatSettings(values);
            message.success('对话设置已保存');
            // TODO: 保存到存储
        } catch (error) {
            message.error('请检查设置参数');
        }
    };

    const handleSaveUISettings = () => {
        message.success('界面设置已保存');
        // TODO: 保存到存储
    };

    const handleResetSettings = () => {
        form.resetFields();
        setChatSettings({
            maxTokens: 4096,
            temperature: 0.7,
            topP: 1.0,
            frequencyPenalty: 0.0,
            presencePenalty: 0.0,
            systemPrompt: "你是一个有用的AI助手，请提供准确、有帮助的回答。",
            enableStreaming: true,
            autoSave: true,
            showWordCount: true
        });
        message.success('设置已重置');
    };

    const chatSettingsTab = (
        <div style={{
            height: '100%',
            boxSizing: 'border-box',
            padding: '0 12px' // 增加左右padding从4px到12px
        }}>
            <Form
                form={form}
                layout="vertical"
                initialValues={chatSettings}
                onValuesChange={(_, allValues) => setChatSettings(allValues)}
                className="setting-form"
            >
                <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <RobotOutlined />
                    模型参数设置
                </Title>

                <Form.Item
                    label={
                        <span>
                            最大Token数
                            <Tooltip title="控制模型生成回复的最大长度">
                                <InfoCircleOutlined style={{ marginLeft: 4 }} />
                            </Tooltip>
                        </span>
                    }
                    name="maxTokens"
                >
                    <InputNumber
                        min={1}
                        max={32000}
                        style={{ width: '100%', maxWidth: '100%' }}
                        formatter={(value) => `${value} tokens`}
                        parser={(value) => value!.replace(' tokens', '') as any}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <span>
                            温度值 (Temperature)
                            <Tooltip title="控制回复的创造性，0-2之间，值越高越创新">
                                <InfoCircleOutlined style={{ marginLeft: 4 }} />
                            </Tooltip>
                        </span>
                    }
                    name="temperature"
                >
                    <Slider
                        min={0}
                        max={2}
                        step={0.1}
                        marks={{
                            0: '保守',
                            0.7: '平衡',
                            1.4: '创新',
                            2: '随机'
                        }}
                        tooltip={{ formatter: (value) => `${value}` }}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <span>
                            Top P
                            <Tooltip title="核采样参数，控制词汇选择的多样性">
                                <InfoCircleOutlined style={{ marginLeft: 4 }} />
                            </Tooltip>
                        </span>
                    }
                    name="topP"
                >
                    <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        marks={{
                            0: '0',
                            0.5: '0.5',
                            1: '1'
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <span>
                            频率惩罚
                            <Tooltip title="降低重复内容的概率">
                                <InfoCircleOutlined style={{ marginLeft: 4 }} />
                            </Tooltip>
                        </span>
                    }
                    name="frequencyPenalty"
                >
                    <Slider
                        min={-2}
                        max={2}
                        step={0.1}
                        marks={{
                            '-2': '-2',
                            0: '0',
                            2: '2'
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <span>
                            存在惩罚
                            <Tooltip title="鼓励讨论新话题">
                                <InfoCircleOutlined style={{ marginLeft: 4 }} />
                            </Tooltip>
                        </span>
                    }
                    name="presencePenalty"
                >
                    <Slider
                        min={-2}
                        max={2}
                        step={0.1}
                        marks={{
                            '-2': '-2',
                            0: '0',
                            2: '2'
                        }}
                    />
                </Form.Item>

                <Divider />

                <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <MessageOutlined />
                    对话设置
                </Title>

                <Form.Item
                    label="系统提示词"
                    name="systemPrompt"
                    tooltip="定义AI助手的角色和行为"
                >
                    <TextArea
                        rows={4}
                        placeholder="输入系统提示词，定义AI助手的角色和行为..."
                        showCount
                        maxLength={500}
                    />
                </Form.Item>

                <Form.Item name="enableStreaming" valuePropName="checked">
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                    <span style={{ marginLeft: 8 }}>启用流式输出</span>
                </Form.Item>

                <Form.Item name="autoSave" valuePropName="checked">
                    <Switch checkedChildren="开启" unCheckedChildren="关闭" />
                    <span style={{ marginLeft: 8 }}>自动保存对话</span>
                </Form.Item>

                <Form.Item name="showWordCount" valuePropName="checked">
                    <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
                    <span style={{ marginLeft: 8 }}>显示字数统计</span>
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                    <Space>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSaveChatSettings}
                        >
                            保存设置
                        </Button>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleResetSettings}
                        >
                            重置
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );

    const uiSettingsTab = (
        <div style={{
            height: '100%',
            width: '100%',
            overflow: 'hidden auto',
            boxSizing: 'border-box',
            padding: '0 12px' // 增加左右padding从4px到12px
        }} className="setting-form">
            <Title level={5} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <EyeOutlined />
                界面设置
            </Title>

            <Space direction="vertical" style={{ width: '100%', maxWidth: '100%' }} size="large">
                <Card size="small" title="主题设置" style={{ width: '100%', maxWidth: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%', maxWidth: '100%' }}>
                        <div>
                            <Text strong>主题模式</Text>
                            <Radio.Group
                                value={uiSettings.theme}
                                onChange={(e) => setUISettings(prev => ({ ...prev, theme: e.target.value }))}
                                style={{
                                    marginTop: 8,
                                    width: '100%',
                                    maxWidth: '100%',
                                    display: 'flex',
                                    flexWrap: 'wrap'
                                }}
                            >
                                <Radio.Button value="light" style={{ flex: '1 0 auto', minWidth: 0 }}>浅色</Radio.Button>
                                <Radio.Button value="dark" style={{ flex: '1 0 auto', minWidth: 0 }}>深色</Radio.Button>
                                <Radio.Button value="auto" style={{ flex: '1 0 auto', minWidth: 0 }}>跟随系统</Radio.Button>
                            </Radio.Group>
                        </div>

                        <div>
                            <Text strong>主题色</Text>
                            <div style={{ marginTop: 8 }}>
                                <ColorPicker
                                    value={uiSettings.primaryColor}
                                    onChange={(color) => setUISettings(prev => ({ ...prev, primaryColor: color.toHexString() }))}
                                />
                            </div>
                        </div>
                    </Space>
                </Card>

                <Card size="small" title="字体设置" style={{ width: '100%', maxWidth: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%', maxWidth: '100%' }}>
                        <div>
                            <Text strong>字体大小</Text>
                            <Slider
                                value={uiSettings.fontSize}
                                onChange={(value) => setUISettings(prev => ({ ...prev, fontSize: value }))}
                                min={12}
                                max={20}
                                step={1}
                                marks={{
                                    12: '小',
                                    14: '默认',
                                    16: '中',
                                    20: '大'
                                }}
                            />
                        </div>

                        <div>
                            <Text strong>字体</Text>
                            <Select
                                value={uiSettings.fontFamily}
                                onChange={(value) => setUISettings(prev => ({ ...prev, fontFamily: value }))}
                                style={{ width: '100%', marginTop: 8 }}
                            >
                                <Option value="Microsoft YaHei">微软雅黑</Option>
                                <Option value="PingFang SC">苹方</Option>
                                <Option value="Helvetica">Helvetica</Option>
                                <Option value="Arial">Arial</Option>
                            </Select>
                        </div>
                    </Space>
                </Card>

                <Card size="small" title="消息显示" style={{ width: '100%', maxWidth: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%', maxWidth: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text>显示时间戳</Text>
                            <Switch
                                checked={uiSettings.showTimestamp}
                                onChange={(checked) => setUISettings(prev => ({ ...prev, showTimestamp: checked }))}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text>显示头像</Text>
                            <Switch
                                checked={uiSettings.showAvatar}
                                onChange={(checked) => setUISettings(prev => ({ ...prev, showAvatar: checked }))}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text>消息动画</Text>
                            <Switch
                                checked={uiSettings.messageAnimation}
                                onChange={(checked) => setUISettings(prev => ({ ...prev, messageAnimation: checked }))}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text>紧凑模式</Text>
                            <Switch
                                checked={uiSettings.compactMode}
                                onChange={(checked) => setUISettings(prev => ({ ...prev, compactMode: checked }))}
                            />
                        </div>

                        <div>
                            <Text strong>消息间距</Text>
                            <Slider
                                value={uiSettings.messageSpacing}
                                onChange={(value) => setUISettings(prev => ({ ...prev, messageSpacing: value }))}
                                min={8}
                                max={24}
                                step={2}
                                marks={{
                                    8: '紧密',
                                    16: '默认',
                                    24: '宽松'
                                }}
                            />
                        </div>
                    </Space>
                </Card>

                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSaveUISettings}
                    block
                >
                    保存界面设置
                </Button>
            </Space>
        </div>
    );

    return (
        <div style={{
            height: '100%',
            width: '100%',
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxSizing: 'border-box'
        }}>
            <div style={{ marginBottom: 16, flexShrink: 0 }}>
                <Title level={5} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <SettingOutlined />
                    {assistant ? `${assistant.name} 设置` : '设置'}
                </Title>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    配置对话参数和界面显示选项
                </Text>
            </div>

            <div style={{ flex: 1, overflow: 'hidden', width: '100%', maxWidth: '100%', display: 'flex', flexDirection: 'column' }}>
                <Tabs
                    defaultActiveKey="chat"
                    className="setting-tabs"
                    style={{
                        height: '100%',
                        width: '100%',
                        maxWidth: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                    items={[
                        {
                            key: 'chat',
                            label: (
                                <Space>
                                    <MessageOutlined />
                                    对话设置
                                </Space>
                            ),
                            children: chatSettingsTab
                        },
                        {
                            key: 'ui',
                            label: (
                                <Space>
                                    <EyeOutlined />
                                    界面设置
                                </Space>
                            ),
                            children: uiSettingsTab
                        }
                    ]}
                />
            </div>
        </div>
    );
};

export default Settings;