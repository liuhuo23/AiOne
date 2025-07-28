import React from 'react';
import { theme } from 'antd';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useOptimizedWindowState } from '@/hooks/useOptimizedWindowState';
import { Layout } from 'antd';
const { Header } = Layout;
interface CustomTitleBarProps {
    title: string;
    style?: React.CSSProperties; // 可选的样式属性
}

const CustomTitleBar: React.FC<CustomTitleBarProps> = ({ title, style }) => {
    const { setDragging, toggleMaximize } = useOptimizedWindowState()

    // 拖拽窗口
    const handleMouseDown = async (e: React.MouseEvent) => {
        if (e.button === 0) {
            setDragging(true);
            try {
                const appWindow = getCurrentWindow();
                await appWindow.startDragging();
            } catch (error) {
                console.error('拖拽窗口失败:', error);
            } finally {
                setDragging(false);
            }
        }
    };

    // 双击最大化/恢复
    const handleDoubleClick = async (e: React.MouseEvent) => {
        await toggleMaximize();
    };

    // 获取 antd token
    const {
        token: { colorText },
    } = theme.useToken();

    return (
        <Header
            style={{
                ...style,
                color: colorText,
                lineHeight: 'calc(var(--header-height) - 2px)',
                height: 'var(--header-height)',
                textAlign: 'left',
                padding: 0,
                paddingLeft: '80px', // 添加左侧内边距
            }}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
        >
            {title}
        </Header >
    );
};

export default CustomTitleBar;
