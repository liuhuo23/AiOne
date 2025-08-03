import React, { useEffect, useState } from "react";
import {
    List,
    Button,
    Space,
    Typography,
    Avatar,
    Popconfirm,
    message,
    Empty,
    Badge,
    Tooltip
} from "antd";
import {
    MessageOutlined,
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";
import { AssistantType } from "@/store/assistant";
import { ChatTopic } from "@/types/chat";

const { Text, Title } = Typography;

interface TopicListProps {
    assistant: AssistantType;
}

const TopicList: React.FC<TopicListProps> = ({ assistant }) => {
    const [topics, setTopics] = useState<ChatTopic[]>([]);
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

    useEffect(() => {
        // 根据当前助手获取话题列表
        loadTopicsForAssistant(assistant.id);
    }, [assistant]);

    const loadTopicsForAssistant = (assistantId: string) => {
        // 模拟从存储中获取话题列表
        const mockTopics: ChatTopic[] = [
            {
                id: `${assistantId}-topic-1`,
                title: "如何使用React Hooks",
                lastMessage: "useEffect的使用场景有哪些？",
                messageCount: 15,
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
                assistantId
            },
            {
                id: `${assistantId}-topic-2`,
                title: "TypeScript 最佳实践",
                lastMessage: "接口和类型别名的区别？",
                messageCount: 8,
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 30 * 60 * 1000),
                assistantId
            },
            {
                id: `${assistantId}-topic-3`,
                title: "AI模型对比分析",
                lastMessage: "GPT-4和Claude-3的优劣势？",
                messageCount: 23,
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                assistantId
            }
        ];

        setTopics(mockTopics);
        if (mockTopics.length > 0) {
            setSelectedTopicId(mockTopics[0].id);
        }
    };

    const handleCreateNewTopic = () => {
        const newTopic: ChatTopic = {
            id: `${assistant.id}-topic-${Date.now()}`,
            title: "新对话",
            messageCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            assistantId: assistant.id
        };

        setTopics(prev => [newTopic, ...prev]);
        setSelectedTopicId(newTopic.id);
        message.success('新对话已创建');
    };

    const handleDeleteTopic = (topicId: string) => {
        setTopics(prev => prev.filter(topic => topic.id !== topicId));
        if (selectedTopicId === topicId) {
            const remainingTopics = topics.filter(topic => topic.id !== topicId);
            setSelectedTopicId(remainingTopics.length > 0 ? remainingTopics[0].id : null);
        }
        message.success('对话已删除');
    };

    const handleSelectTopic = (topicId: string) => {
        setSelectedTopicId(topicId);
    };

    const formatRelativeTime = (date: Date) => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) {
            return `${diffMins}分钟前`;
        } else if (diffHours < 24) {
            return `${diffHours}小时前`;
        } else {
            return `${diffDays}天前`;
        }
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 16, flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Title level={5} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <MessageOutlined />
                        {assistant.name} 的对话
                    </Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="small"
                        onClick={handleCreateNewTopic}
                    >
                        新对话
                    </Button>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                    共 {topics.length} 个对话，{topics.reduce((sum, topic) => sum + topic.messageCount, 0)} 条消息
                </Text>
            </div>

            <div style={{ flex: 1, overflow: 'auto' }}>
                {topics.length === 0 ? (
                    <Empty
                        image={<MessageOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
                        description="暂无对话"
                        style={{ padding: '40px 0' }}
                    >
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateNewTopic}>
                            创建第一个对话
                        </Button>
                    </Empty>
                ) : (
                    <List
                        dataSource={topics}
                        renderItem={(topic) => (
                            <List.Item
                                style={{
                                    padding: '12px 16px',
                                    cursor: 'pointer',
                                    border: `2px solid ${selectedTopicId === topic.id ? 'var(--ant-color-primary)' : 'var(--ant-color-border-secondary)'}`,
                                    background: selectedTopicId === topic.id
                                        ? 'var(--ant-color-primary-bg)'
                                        : 'var(--ant-color-bg-container)',
                                    borderRadius: 8,
                                    margin: '4px 0',
                                    transition: 'all 0.2s',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onClick={() => handleSelectTopic(topic.id)}
                                actions={[
                                    <Tooltip title="编辑" key="edit">
                                        <Button
                                            type="text"
                                            size="small"
                                            icon={<EditOutlined />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // TODO: 实现编辑功能
                                            }}
                                        />
                                    </Tooltip>,
                                    <Popconfirm
                                        key="delete"
                                        title="确定删除这个对话吗？"
                                        description="删除后无法恢复"
                                        onConfirm={(e) => {
                                            e?.stopPropagation();
                                            handleDeleteTopic(topic.id);
                                        }}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        <Tooltip title="删除">
                                            <Button
                                                type="text"
                                                size="small"
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </Tooltip>
                                    </Popconfirm>
                                ]}
                            >
                                {selectedTopicId === topic.id && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            bottom: 0,
                                            width: 4,
                                            background: 'var(--ant-color-primary)',
                                            borderRadius: '0 2px 2px 0',
                                        }}
                                    />
                                )}

                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            icon={<MessageOutlined />}
                                            style={{
                                                backgroundColor: selectedTopicId === topic.id
                                                    ? 'var(--ant-color-primary)'
                                                    : 'var(--ant-color-fill-quaternary)'
                                            }}
                                        />
                                    }
                                    title={
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text
                                                strong
                                                style={{
                                                    color: selectedTopicId === topic.id
                                                        ? 'var(--ant-color-primary)'
                                                        : 'var(--ant-color-text)'
                                                }}
                                                ellipsis={{ tooltip: topic.title }}
                                            >
                                                {topic.title}
                                            </Text>
                                            <Badge count={topic.messageCount} size="small" />
                                        </div>
                                    }
                                    description={
                                        <div>
                                            {topic.lastMessage && (
                                                <Text
                                                    type="secondary"
                                                    style={{ fontSize: 12, display: 'block', marginBottom: 4 }}
                                                    ellipsis={{ tooltip: topic.lastMessage }}
                                                >
                                                    {topic.lastMessage}
                                                </Text>
                                            )}
                                            <Space size={4}>
                                                <ClockCircleOutlined style={{ fontSize: 10 }} />
                                                <Text type="secondary" style={{ fontSize: 10 }}>
                                                    {formatRelativeTime(topic.updatedAt)}
                                                </Text>
                                            </Space>
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                )}
            </div>
        </div>
    );
}

export default TopicList;