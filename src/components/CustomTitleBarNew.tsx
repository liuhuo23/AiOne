import React from 'react';
import { Typography, Tooltip } from 'antd';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useOptimizedWindowState } from '@/hooks/useOptimizedWindowState';

const { Title } = Typography;

interface CustomTitleBarProps {
    title: string;
}

const CustomTitleBar: React.FC<CustomTitleBarProps> = ({ title }) => {
    const { isMaximized, isDragging, setDragging, toggleMaximize } = useOptimizedWindowState();

    // 开始拖拽窗口
    const handleMouseDown = async (e: React.MouseEvent) => {
        // 只在左键点击时触发拖拽
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

    // 双击切换最大化/恢复
    const handleDoubleClick = async () => {
        await toggleMaximize();
    };

    const titleBarClass = `custom-titlebar ${isMaximized ? 'titlebar-maximized' : ''}`;
    const dragRegionClass = `titlebar-drag-region ${isDragging ? 'titlebar-dragging' : ''}`;

    return (
        <div className={titleBarClass}>
            <Tooltip
                title="拖拽移动窗口，双击切换全屏"
                placement="bottom"
                mouseEnterDelay={1}
            >
                <div
                    className={dragRegionClass}
                    onMouseDown={handleMouseDown}
                    onDoubleClick={handleDoubleClick}
                >
                    <div className="titlebar-content">
                        <Title level={5} className="titlebar-title">
                            {title} {isMaximized && '(最大化)'}
                        </Title>
                    </div>
                </div>
            </Tooltip>
        </div>
    );
};

export default CustomTitleBar;
