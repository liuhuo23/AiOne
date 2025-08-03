import React, { useEffect, useState } from "react";
import { List, Button, Space, Card, Empty, message } from "antd";
import { PlusOutlined, RobotOutlined } from "@ant-design/icons";
import { AssistantListItem } from "../AssistantListItem";
import { AssistantType } from "@/store/assistant";

interface AssistantItemsProps {
    onAssistantChange?: (assistant: AssistantType) => void;
    assistants?: AssistantType[];
}

const AssistantItems: React.FC<AssistantItemsProps> = ({ onAssistantChange, assistants }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [currentAssistants, setCurrentAssistants] = useState<AssistantType>();

    const handleAddAssistant = () => {
        message.info('添加助手功能待实现');
    };

    useEffect(() => {
        if (onAssistantChange && currentAssistants) {
            // 如果有助手变化回调，传递当前选中的助手
            onAssistantChange(currentAssistants);
        }
    }, [currentAssistants, onAssistantChange]);

    // 如果没有助手数据，显示空状态
    if (!assistants || assistants.length === 0) {
        return (
            <Space
                direction="vertical"
                style={{ width: '100%' }}
                size="large"
            >
                <Empty
                    image={<RobotOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />}
                    description="暂无助手"
                    style={{ padding: '20px 0' }}
                />
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleAddAssistant}
                    block
                    size="large"
                    style={{
                        borderRadius: 8,
                        height: 48,
                        fontSize: 16,
                        fontWeight: 500,
                    }}
                >
                    添加助手
                </Button>
            </Space>
        );
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Card
                bodyStyle={{
                    padding: '16px 20px',
                    borderRadius: 12,
                }}
                style={{
                    borderRadius: 12,
                    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.06)',
                    border: '1px solid var(--ant-color-border-secondary)',
                }}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={assistants}
                    style={{ width: '100%' }}
                    renderItem={(item, _index) => {
                        const assistant = item as AssistantType;
                        const selected = assistant.id === selectedId;
                        return (
                            <AssistantListItem
                                assistant={assistant}
                                selected={selected}
                                onClick={() => {
                                    setCurrentAssistants(item);
                                    setSelectedId(assistant.id);
                                }}
                            />
                        );
                    }}
                />
            </Card>

            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddAssistant}
                block
                size="large"
                style={{
                    borderRadius: 8,
                    height: 48,
                    fontSize: 16,
                    fontWeight: 500,
                    boxShadow: '0 2px 8px rgba(24,144,255,0.15)',
                }}
            >
                添加助手
            </Button>
        </Space>
    );
};

export default AssistantItems;