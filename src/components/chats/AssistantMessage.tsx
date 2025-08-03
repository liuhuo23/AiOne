
import { Card, Avatar } from "antd";
import React from "react";
import ReactMarkdown from "react-markdown";
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import "./AssistantMessage.css";

export interface AssistantMessageProps {
    content: string;
    isUserMessage?: boolean;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({ content, isUserMessage }) => {
    return (
        <div className={`message-container ${isUserMessage ? 'user-message-container' : 'ai-message-container'}`}>
            <Avatar
                className="message-avatar"
                size={32}
                icon={isUserMessage ? <UserOutlined /> : <RobotOutlined />}
                style={{
                    backgroundColor: isUserMessage ? 'var(--ant-color-primary)' : 'var(--ant-color-success)',
                    color: 'var(--ant-color-white)',
                    flexShrink: 0
                }}
            />
            <Card
                className={`assistant-message-card${isUserMessage ? ' user-message' : ''}`}
            >
                <ReactMarkdown>{content}</ReactMarkdown>
            </Card>
        </div>
    );
}

export default AssistantMessage;