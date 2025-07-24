import React, { useState, useRef } from 'react';
import { Input, Button } from 'antd';
import { SendOutlined, LoadingOutlined } from '@ant-design/icons';
import type { TextAreaProps as AntdTextAreaProps } from 'antd/es/input';
import styled from 'styled-components';

interface TextAreaProps extends AntdTextAreaProps {
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 占位文本 */
  placeholder?: string;
  /** 行数 */
  rows?: number;
  /** 最大允许行数 */
  maxRows?: number;
  /** 是否显示发送按钮 */
  showActionButton?: boolean;
  /** 发送按钮图标 */
  actionButtonIcon?: React.ReactNode;
  /** 发送中按钮图标 */
  sendingButtonIcon?: React.ReactNode;
  /** 发送按钮文本 */
  actionButtonText?: string;
  /** 发送中按钮文本 */
  sendingButtonText?: string;
  /** 发送按钮点击事件 */
  onSend?: (value: string) => void;
  /** 取消发送事件 */
  onCancel?: () => void;
  /** 输入值变化事件 */
  onValueChange?: (value: string) => void;
  /** 是否禁用发送按钮 */
  disableSend?: boolean;
  /** 是否正在发送 */
  isLoading?: boolean;
  /** 最大token数量 */
  maxTokens?: number;
}

const TextAreaWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 0;
`;

const TextAreaContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 90%;
  max-width: 90%;
  background: var(--ant-color-bg-container);
  border: 1px solid var(--ant-color-border);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-2);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  backdrop-filter: blur(10px);
  
  &:hover {
    box-shadow: var(--shadow-3);
    border-color: var(--ant-primary-color);
    transform: translateY(-2px);
  }
  
  &:focus-within {
    box-shadow: var(--shadow-3), 0 0 0 2px var(--primary-shadow);
    border-color: var(--ant-primary-color);
    transform: translateY(-2px);
  }
`;

// TokenCounter 已移除

const StyledTextArea = styled(Input.TextArea) <{ maxRows?: number }>`
  && {
    border: none !important;
    outline: none !important;
    width: 100%;
    resize: none !important;
    padding: 5px 5px 5px 5px;
    font-size: 15px;
    min-height: 60px;
    background: transparent;
    color: var(--ant-color-text);
    box-shadow: none !important;
  }
  &::placeholder {
    color: var(--ant-color-text-tertiary);
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: var(--ant-color-fill-quaternary);
  }s
  &::-webkit-scrollbar-thumb {
    background: var(--ant-color-fill);
    transition: background 0.3s ease;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: var(--ant-color-fill-secondary);
  }
`;

const BottomBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 5px 5px 5px 5px;
  background: transparent;
`;

const SendButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;



const TextArea: React.FC<TextAreaProps> = ({
  style,
  placeholder = '请输入内容...',
  rows = 4,
  maxRows = 8,
  showActionButton = false,
  actionButtonIcon = <SendOutlined />,
  sendingButtonIcon = <LoadingOutlined />,
  actionButtonText = '',
  sendingButtonText = '',
  onSend,
  onCancel,
  onValueChange,
  disableSend = false,
  isLoading = false,
  maxTokens = 4000,
  value,
  onChange,
  ...props
}) => {
  const [internalValue, setInternalValue] = useState('');
  const textAreaRef = useRef<any>(null);

  const currentValue = value !== undefined ? String(value) : internalValue;
  const tokenCount = Math.ceil(currentValue.length / 4); // 简化的token计算


  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onValueChange?.(newValue);
    onChange?.(e);
  };

  const handleSend = () => {
    if (currentValue.trim() && onSend && !isLoading) {
      onSend(currentValue.trim());
    }
  };



  const calculateTextAreaRows = () => {
    const lines = currentValue.split('\n').length;
    return Math.min(Math.max(lines, rows), maxRows);
  };

  return (
    <TextAreaWrapper>
      <TextAreaContainer style={style}>
        <StyledTextArea
          {...props}
          ref={textAreaRef}
          value={currentValue}
          onChange={handleChange}
          rows={calculateTextAreaRows()}
          placeholder={placeholder}
          style={{
            minHeight: `${rows * 24}px`,
            maxHeight: `${maxRows * 24}px`,
            overflowY: 'auto',
          }}
        />
        {showActionButton && (
          <BottomBar>
            <SendButtonContainer>
              <Button
                type="primary"
                size="small"
                icon={isLoading ? sendingButtonIcon : actionButtonIcon}
                onClick={isLoading ? onCancel : handleSend}
                loading={isLoading}
                disabled={disableSend || !currentValue.trim() || tokenCount > maxTokens}
                style={{
                  borderRadius: 'var(--border-radius-lg)',
                  boxShadow: 'var(--shadow-1)',
                  background: isLoading ? 'var(--ant-primary-color-hover)' : 'var(--ant-primary-color)',
                  borderColor: 'var(--ant-primary-color)',
                  transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
                }}
              >
                {isLoading ? sendingButtonText : actionButtonText}
              </Button>
            </SendButtonContainer>
          </BottomBar>
        )}
      </TextAreaContainer>
    </TextAreaWrapper>
  );
};

export default TextArea;