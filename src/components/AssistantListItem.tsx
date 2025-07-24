import React from "react";
import { List, Avatar } from "antd";
import styled from "styled-components";
import { AssistantType } from "@/store/assistant"

const CapsuleItem = styled.div<{ selected?: boolean }>`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 24px;
    margin: 10px 0;
    border-radius: 999px;
    width: 100%;
    background: ${({ selected }) => selected ? 'var(--ant-color-primary-bg, #e6f7ff)' : 'var(--ant-color-bg-container, #fff)'};
    box-shadow: ${({ selected }) => selected ? '0 2px 8px rgba(24,144,255,0.08)' : 'none'};
    border: 2px solid ${({ selected }) => selected ? 'var(--ant-color-primary,#1890ff)' : 'transparent'};
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, border 0.2s;
    &:hover {
        background: var(--ant-color-primary-bg, #e6f7ff);
        border: 2px solid var(--ant-color-primary,#1890ff);
    }
    .assistant-name {
        color: ${({ selected }) => selected ? 'var(--ant-color-primary,#1890ff)' : 'var(--ant-color-text,#222)'};
        font-size: 16px;
        font-weight: 500;
        transition: color 0.2s;
    }
`;

export interface AssistantListItemProps {
    assistant: AssistantType;
    selected: boolean;
    onClick: () => void;
}

export const AssistantListItem: React.FC<AssistantListItemProps> = ({ assistant, selected, onClick }) => (
    <List.Item style={{ borderBottom: 'none', padding: 0, background: 'transparent', width: '100%' }}>
        <CapsuleItem selected={selected} onClick={onClick}>
            <Avatar style={{ background: 'var(--ant-color-primary,#1890ff)', color: '#fff', fontWeight: 600 }}>{assistant.name[0]}</Avatar>
            <div style={{ flex: 1 }}>
                <div className="assistant-name">{assistant.name}</div>
            </div>
        </CapsuleItem>
    </List.Item>
);
