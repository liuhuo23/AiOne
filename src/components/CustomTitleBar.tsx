import React, { useEffect } from 'react';
import { Typography, Tooltip } from 'antd';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { useWindowState } from '../store/AppStateContext';

const { Title } = Typography;

interface CustomTitleBarProps {
    title: string;
}

const CustomTitleBar: React.FC<CustomTitleBarProps> = ({ title }) => {
    const { window, setMaximized, setDragging } = useWindowState();

    useEffect(() => {
        // 检查窗口初始状态
        const checkMaximized = async () => {
            try {
                const appWindow = getCurrentWindow();
                const maximized = await appWindow.isMaximized();
                setMaximized(maximized);
            } catch (error) {
                console.error('检查窗口状态失败:', error);
            }
        };

        checkMaximized();
    }, [setMaximized]);

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
        try {
            const appWindow = getCurrentWindow();
            await appWindow.toggleMaximize();

            // 更新状态
            const maximized = await appWindow.isMaximized();
            setMaximized(maximized);
        } catch (error) {
            console.error('切换窗口状态失败:', error);
        }
    };

    const titleBarClass = `custom-titlebar ${window.isMaximized ? 'titlebar-maximized' : ''}`;
    const dragRegionClass = `titlebar-drag-region ${window.isDragging ? 'titlebar-dragging' : ''}`;

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
                            {title} {window.isMaximized && '(最大化)'}
                        </Title>
                    </div>
                </div>
            </Tooltip>
        </div>
    );
};

export default CustomTitleBar;
