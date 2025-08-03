import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import AssistantItems from './assistantlist/AssistantItems';
import TopicList from './assistantlist/TopicList';
import Settings from './assistantlist/Setting';
import { AssistantType, getDefaultAssistant } from '@/store/assistant';
import {
    Card,
    Tabs,
    Typography,
    Space,
    Badge
} from 'antd';
import {
    RobotOutlined,
    MessageOutlined,
    SettingOutlined,
    TeamOutlined
} from '@ant-design/icons';

const assistantsMock: AssistantType[] = [
    {
        id: '1',
        name: '助手A',
        model: 'gpt-3.5-turbo',
        modelParams: {
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            max_tokens: 150,
            top_p: 1.0,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

interface AssistantsListProps {
    onChange?: (key: string) => void;
}

const AssistantsList: React.FC<AssistantsListProps> = ({ onChange }) => {
    const { t } = useTranslation();
    const defaultAssistant = getDefaultAssistant();
    const [assistant, setAssistant] = useState<AssistantType>(defaultAssistant);
    const [assistants, setAssistants] = useState<AssistantType[]>(assistantsMock);

    useEffect(() => {
        // 获取默认助手列表
        setAssistants(assistantsMock);
        if (assistantsMock.length > 0) {
            setAssistant(assistantsMock[0]);
        } else {
            const defaultAssistant = getDefaultAssistant();
            setAssistants([defaultAssistant])
            setAssistant(defaultAssistant);
        }
    }, []);

    const handleTabChange = (key: string) => {
        onChange?.(key);
    };

    const getAssistantStats = () => {
        const activeAssistants = assistants.filter(a => a.id !== 'default').length;
        const totalAssistants = assistants.length;

        return {
            total: totalAssistants,
            active: activeAssistants,
            default: totalAssistants - activeAssistants
        };
    };

    const stats = getAssistantStats();
    const tabList = [
        {
            key: 'assistants',
            label: (
                <Space>
                    <RobotOutlined />
                    {t('assistants.assistants')}
                    <Badge count={assistants.length} size="small" />
                </Space>
            ),
            children: (
                <Card
                    size="small"
                    style={{ height: '100%' }}
                >
                    <AssistantItems
                        assistants={assistants}
                        onAssistantChange={(item: AssistantType) => setAssistant(item)}
                    />
                </Card>
            ),
        },
        {
            key: 'chats',
            label: (
                <Space>
                    <MessageOutlined />
                    {t('assistants.topic')}
                </Space>
            ),
            children: (
                <Card size="small" style={{ height: '100%' }}>
                    <TopicList assistant={assistant} />
                </Card>
            ),
        },
        {
            key: 'settings',
            label: (
                <Space>
                    <SettingOutlined />
                    {t('assistants.settings')}
                </Space>
            ),
            children: (
                <Card size="small" style={{ height: '100%' }}>
                    <Settings assistant={assistant} />
                </Card>
            ),
        },
    ];

    return (
        <div style={{ height: '100%', padding: '16px' }}>
            <Card
                title={
                    <Space>
                        <TeamOutlined />
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            助手管理中心
                        </Typography.Title>
                    </Space>
                }
                extra={
                    <Space>
                        <Typography.Text type="secondary">
                            活跃: {stats.active} | 总数: {stats.total}
                        </Typography.Text>
                    </Space>
                }
                style={{ height: '100%' }}
                bodyStyle={{ height: 'calc(100% - 66px)' }}
            >
                <Tabs
                    defaultActiveKey="assistants"
                    items={tabList}
                    onChange={handleTabChange}
                    type="card"
                    style={{ height: '100%' }}
                    tabBarStyle={{ marginBottom: '16px' }}
                />
            </Card>
        </div>
    );
};

export default AssistantsList;