import { useEffect, useState } from 'react';
import WindowStateManager from '@/utils/WindowStateManager';

export const useOptimizedWindowState = () => {
    const [isMaximized, setIsMaximized] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const manager = WindowStateManager.getInstance();

        // 初始化管理器
        manager.initialize();

        // 订阅状态变化
        const unsubscribe = manager.subscribe(setIsMaximized);

        return () => {
            unsubscribe();
        };
    }, []);

    const toggleMaximize = async () => {
        const manager = WindowStateManager.getInstance();
        await manager.toggleMaximize();
    };

    return {
        isMaximized,
        isDragging,
        setDragging: setIsDragging,
        toggleMaximize
    };
};

export default useOptimizedWindowState;
