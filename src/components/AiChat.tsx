import { Card, Layout, List, Input, Button, Space, Divider, Typography, message, Spin } from "antd";
import React, { useState, useRef, useEffect } from "react";
import AssistantMessage from "./chats/AssistantMessage";
import AISettingsModal from "./AISettingsModal";
import { SendOutlined, ClearOutlined, SettingOutlined, StopOutlined } from '@ant-design/icons';
import { aiChatService, ChatResponse } from "../services/aiChatService";
import { aiConfigManager } from "../services/aiConfigManager";
import type { ChatMessage } from "../services/openaiService";

import "./AiChat.css";

const { Title } = Typography;

const AiChat: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content: "You are a helpful assistant. You can answer questions about the world, provide information, and assist with various tasks."
    }
  ]);

  // 自动滚动到底部
  const scrollToBottom = () => {
    // 使用 setTimeout 确保 DOM 更新完成后再滚动
    setTimeout(() => {
      if (messagesContainerRef.current) {
        // 直接滚动容器到底部
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      } else if (messagesEndRef.current) {
        // 备用方案
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest"
        });
      }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 检查是否已配置 AI
  const isConfigured = aiConfigManager.isConfigured();

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    if (!isConfigured) {
      message.warning('请先配置 AI 设置');
      setShowSettings(true);
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content: inputValue.trim()
    };

    // 添加用户消息
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 准备发送给 AI 的消息（包括历史对话）
      const allMessages = [...messages, userMessage];

      // 调用 AI 服务
      const response: ChatResponse = await aiChatService.sendMessage(allMessages);

      if (response.isError) {
        message.error(response.errorMessage || 'AI 响应错误');
        return;
      }

      // 添加 AI 响应
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.content
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      message.error('发送消息失败: ' + (error.message || '未知错误'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearMessages = () => {
    setMessages(messages.filter(m => m.role === 'system'));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStopGeneration = () => {
    aiChatService.cancelRequest();
    setIsLoading(false);
  };

  const handleConfigUpdated = () => {
    message.success('AI 配置已更新');
  };

  const visibleMessages = messages.filter(m => m.role !== 'system');
  return (
    <>
      <Layout className="ai-chat-full-layout">
        <div className="ai-chat-flex-container" >
          {/* 消息头部 */}
          <div style={{ padding: '16px 16px 0 16px' }}>
            <Space split={<Divider type="vertical" />} style={{ width: '100%', justifyContent: 'space-between' }}>
              <Title level={4} style={{ margin: 0 }}>
                AI 助手对话
                {!isConfigured && (
                  <Button
                    type="link"
                    size="small"
                    onClick={() => setShowSettings(true)}
                    style={{ padding: '0 4px', color: '#ff4d4f' }}
                  >
                    (未配置)
                  </Button>
                )}
              </Title>
              <Space>
                <Button
                  type="text"
                  icon={<SettingOutlined />}
                  onClick={() => setShowSettings(true)}
                  size="small"
                >
                  设置
                </Button>
                <Button
                  type="text"
                  icon={<ClearOutlined />}
                  onClick={handleClearMessages}
                  size="small"
                  disabled={visibleMessages.length === 0}
                >
                  清空对话
                </Button>
              </Space>
            </Space>
          </div>

          {/* 消息列表 */}
          <div className="ai-chat-messages-flex" ref={messagesContainerRef}>
            <List
              dataSource={visibleMessages}
              renderItem={(msg, idx) => (
                <List.Item style={{ border: 'none', padding: '8px 0' }}>
                  <AssistantMessage
                    key={idx}
                    content={msg.content}
                    isUserMessage={msg.role === 'user'}
                  />
                </List.Item>
              )}
              locale={{
                emptyText: isConfigured
                  ? '开始新的对话...'
                  : '请先点击"设置"配置 AI 服务'
              }}
            />
            {/* 加载提示 */}
            {isLoading && (
              <div style={{ textAlign: 'center', padding: '16px' }}>
                <Space>
                  <Spin size="small" />
                  <span>AI 正在思考中...</span>
                </Space>
              </div>
            )}
            {/* 自动滚动锚点 - 放在消息列表底部 */}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="ai-chat-input-flex">
            <Card style={{ width: '100%' }}>
              <Space.Compact style={{ width: '100%' }}>
                <Input.TextArea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    isConfigured
                      ? "在这里输入您的消息... (按 Enter 发送，Shift+Enter 换行)"
                      : "请先配置 AI 设置"
                  }
                  autoSize={{ minRows: 2, maxRows: 6 }}
                  style={{ resize: 'none' }}
                  disabled={!isConfigured || isLoading}
                />
                {isLoading ? (
                  <Button
                    danger
                    icon={<StopOutlined />}
                    onClick={handleStopGeneration}
                    style={{ alignSelf: 'flex-end' }}
                  >
                    停止
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || !isConfigured}
                    style={{ alignSelf: 'flex-end' }}
                  >
                    发送
                  </Button>
                )}
              </Space.Compact>
            </Card>
          </div>
        </div>
      </Layout>

      {/* AI 设置弹窗 */}
      <AISettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        onConfigUpdated={handleConfigUpdated}
      />
    </>
  );
}

export default AiChat;