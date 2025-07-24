import React, { useEffect, useState } from "react";
import { List } from "antd";
import { AssistantListItem } from "../AssistantListItem";
import { AssistantType } from "@/store/assistant";


interface AssistantItemsProps {
    onAssistantChange?: (assistant: AssistantType) => void;
    assistants?: AssistantType[];
}

const AddButton = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            minHeight: 44,
            margin: '10px 0 0 0',
            background: 'var(--ant-color-primary,#1890ff)',
            color: '#fff',
            fontSize: 16,
            fontWeight: 500,
            border: 'none',
            outline: 'none',
            borderRadius: 999,
            boxShadow: '0 2px 8px rgba(24,144,255,0.08)',
            cursor: 'pointer',
            transition: 'background 0.2s',
        }}
        {...props}
    >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="9" y="4" width="2" height="12" rx="1" fill="white" />
            <rect x="4" y="9" width="12" height="2" rx="1" fill="white" />
        </svg>
        <span style={{ fontSize: 16, fontWeight: 500 }}>添加助手</span>
    </button>
);

const AssistantItems: React.FC<AssistantItemsProps> = ({ onAssistantChange, assistants }) => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [currentAssistants, setCurrentAssistants] = useState<AssistantType>();

    const handleAddAssistant = () => {
        alert('添加助手功能待实现');
    };
    useEffect(() => {
        if (onAssistantChange && currentAssistants) {
            // 如果有助手变化回调，传递当前选中的助手
            onAssistantChange(currentAssistants);
        }
    }, [currentAssistants, onAssistantChange]);

    return (
        <div style={{ width: '100%' }}>
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
            <AddButton onClick={handleAddAssistant} type="button" />
        </div>
    );
};

export default AssistantItems;