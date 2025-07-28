import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Avatar, Space, Typography, Card, Spin, Empty } from 'antd';
import { RobotOutlined, UserOutlined } from '@ant-design/icons';
import TextArea from './TextArea';
import styled from 'styled-components';

const { Text } = Typography;

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%; 
  margin: 0 auto;
  padding: 2px;
  transition: background 0.3s;
`;

const ChatMain = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const MessagesContainer = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 20px;
  margin-bottom: 0;
`;

const MessageItem = styled.div<{ isUser: boolean }>`
  display: flex;
  margin-bottom: 20px;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  align-items: flex-end;
  gap: 8px;
`;

const MessageBubble = styled.div<{ isUser: boolean }>`
  display: inline-block;
  max-width: 80%;
  min-width: 48px;
  width: auto;
  color: var('--ant-color-text');
  border: none;
  margin-left: ${props => props.isUser ? 'auto' : '20px'};
  margin-right: ${props => props.isUser ? '20px' : 'auto'};
  word-break: break-word;
  padding: 10px 16px;
  border-radius: 6px;
`;

const MessageContent = styled.div<{ isUser?: boolean }>`
  font-size: 15px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  padding: 0;
  background: none;
  text-align: ${props => props.isUser ? 'right' : 'left'};
`;

const MessageTime = styled(Text)`
  display: block;
  font-size: 12px;
  margin-top: 4px;
  opacity: 0.7;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  width: 100%;
  justify-content: center;
  background: transparent;
  flex-shrink: 0;
  padding-bottom: 8px;
`;



// 用于包裹消息气泡的自定义容器
const BubbleWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

interface MessageViewProps {
  message: Message;
  formatTime: (date: Date) => string;
}

const MessageView: React.FC<MessageViewProps> = ({ message, formatTime }) => {
  return (
    <MessageItem isUser={message.role === 'user'}>
      {/* AI 头像 */}
      {message.role === 'ai' && (
        <Avatar icon={<RobotOutlined />} />
      )}
      {/* 消息气泡 */}
      <BubbleWrapper>
        <MessageBubble isUser={message.role === 'user'}>
          <MessageContent isUser={message.role === 'user'}>
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </MessageContent>
          <MessageTime type="secondary">
            {formatTime(message.timestamp)}
          </MessageTime>
        </MessageBubble>
      </BubbleWrapper>
      {/* 用户头像 */}
      {message.role === 'user' && (
        <Avatar
          icon={<UserOutlined />}
          style={{ backgroundColor: '#1890ff', boxShadow: '0 2px 8px rgba(24,144,255,0.15)' }}
        />
      )}
    </MessageItem>
  );
};

const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateMessageId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendMessage = async () => {
    const trimmedText = inputText.trim();
    if (!trimmedText) return;

    // 添加用户消息
    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: trimmedText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // 模拟AI响应（这里可以替换为实际的API调用）
      await new Promise(resolve => setTimeout(resolve, 1000));

      const aiMessage: Message = {
        id: generateMessageId(),
        role: 'ai',
        content: `这是AI对您的问题"${trimmedText}"的回复。我能够理解您的需求，并提供相应的帮助。如果您还有其他问题，请随时提问！`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
      const errorMessage: Message = {
        id: generateMessageId(),
        role: 'ai',
        content: '抱歉，我遇到了一些问题。请稍后重试。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContainer>
      <ChatMain>
        <MessagesContainer>
          {messages.length === 0 ? (
            <Empty
              description="还没有消息，开始聊天吧！"
              style={{ marginTop: '100px' }}
            />
          ) : (
            messages.map((message) => (
              <MessageView key={message.id} message={message} formatTime={formatTime} />
            ))
          )}
          {isLoading && (
            <MessageItem isUser={false}>
              <Space>
                <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#722ed1' }} />
                <Spin />
              </Space>
            </MessageItem>
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        <InputContainer>
          <TextArea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onValueChange={setInputText}
            onSend={handleSendMessage}
            onCancel={() => {
              setIsLoading(false);
              setInputText('');
            }}
            placeholder="输入消息..."
            rows={2}
            maxLength={1000}
            showActionButton
            disableSend={!inputText.trim()}
            isLoading={isLoading}
          />
        </InputContainer>
      </ChatMain>
    </ChatContainer>
  );
};

export default AiChat;