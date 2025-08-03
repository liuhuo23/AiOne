import React, { useState, useCallback } from 'react';
import { Input } from 'antd';

interface CustomTextAreaProps {
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onEnterPress?: (value: string) => void;
    placeholder?: string;
    rows?: number;
    maxRows?: number;
    style?: React.CSSProperties;
}

const CustomTextArea: React.FC<CustomTextAreaProps> = ({
    value,
    onChange,
    onEnterPress,
    placeholder,
    rows = 2,
    maxRows = 6,
    style,
}) => {
    const [currentValue, setCurrentValue] = useState(value || '');

    // 自动调整高度的处理函数
    const autoResize = useCallback((textarea: HTMLTextAreaElement) => {
        textarea.style.height = 'auto';
        const lineHeight = 24; // antd 默认行高约 24px
        const minHeight = lineHeight * rows;
        const maxHeight = lineHeight * maxRows;
        const scrollHeight = textarea.scrollHeight;

        if (scrollHeight <= maxHeight) {
            textarea.style.height = Math.max(scrollHeight, minHeight) + 'px';
            textarea.style.overflowY = 'hidden';
        } else {
            textarea.style.height = maxHeight + 'px';
            textarea.style.overflowY = 'auto';
        }
    }, [rows, maxRows]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setCurrentValue(newValue);

        // 自动调整高度
        autoResize(e.target);

        // 调用外部 onChange
        onChange?.(e);
    }, [onChange, autoResize]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const currentValue = e.currentTarget.value;
            onEnterPress?.(currentValue);
        }
    }, [onEnterPress]);

    const handleTextAreaRef = useCallback((textarea: HTMLTextAreaElement | null) => {
        if (textarea) {
            // 初始化时调整高度
            setTimeout(() => autoResize(textarea), 0);
        }
    }, [autoResize]);

    return (
        <Input.TextArea
            ref={handleTextAreaRef}
            value={value !== undefined ? value : currentValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={rows}
            style={{
                resize: 'none',
                transition: 'height 0.1s ease',
                ...style,
            }}
        />
    );
};

export default CustomTextArea;
