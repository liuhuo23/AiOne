import React from "react";
import { List, Avatar, Typography } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import { AssistantType } from "@/store/assistant";

const { Text } = Typography;

export interface AssistantListItemProps {
    assistant: AssistantType;
    selected: boolean;
    onClick: () => void;
}

export const AssistantListItem: React.FC<AssistantListItemProps> = ({ assistant, selected, onClick }) => {
    const itemStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 20px',
        margin: '8px 0',
        borderRadius: 24,
        width: '100%',
        background: selected ? 'var(--ant-color-primary-bg, #e6f7ff)' : 'var(--ant-color-bg-container, #fff)',
        boxShadow: selected ? '0 2px 8px rgba(24,144,255,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
        border: `2px solid ${selected ? 'var(--ant-color-primary,#1890ff)' : 'var(--ant-color-border-secondary, #f0f0f0)'}`,
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: selected ? 'translateY(-1px)' : 'none',
    };

    const hoverStyle: React.CSSProperties = {
        background: 'var(--ant-color-primary-bg, #e6f7ff)',
        border: '2px solid var(--ant-color-primary,#1890ff)',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(24,144,255,0.15)',
    };

    return (
        <List.Item
            style={{
                borderBottom: 'none',
                padding: 0,
                background: 'transparent',
                width: '100%'
            }}
        >
            <div
                style={itemStyle}
                onClick={onClick}
                onMouseEnter={(e) => {
                    if (!selected) {
                        Object.assign(e.currentTarget.style, hoverStyle);
                    }
                }}
                onMouseLeave={(e) => {
                    if (!selected) {
                        Object.assign(e.currentTarget.style, itemStyle);
                    }
                }}
            >
                <Avatar
                    size={40}
                    style={{
                        background: selected ? 'var(--ant-color-primary,#1890ff)' : 'var(--ant-color-primary-active,#096dd9)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: 16,
                        flexShrink: 0,
                    }}
                    icon={!assistant.name ? <RobotOutlined /> : undefined}
                >
                    {assistant.name ? assistant.name[0].toUpperCase() : undefined}
                </Avatar>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <Text
                        style={{
                            color: selected ? 'var(--ant-color-primary,#1890ff)' : 'var(--ant-color-text,#262626)',
                            fontSize: 16,
                            fontWeight: 500,
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                        title={assistant.name} // 添加 tooltip 显示完整名称
                    >
                        {assistant.name}
                    </Text>

                    <Text
                        type="secondary"
                        style={{
                            fontSize: 12,
                            display: 'block',
                            marginTop: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                        title={assistant.model} // 添加 tooltip 显示完整模型名
                    >
                        {assistant.model}
                    </Text>
                </div>
            </div>
        </List.Item>
    );
};
