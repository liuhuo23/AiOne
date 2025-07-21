import React, { useEffect } from 'react';

interface ThemeIntegrationProps {
    children: React.ReactNode;
}

/**
 * 主题集成组件
 * 负责初始化主题系统和监听系统主题变化
 */
const ThemeIntegration: React.FC<ThemeIntegrationProps> = ({ children }) => {

    // 在组件挂载时初始化主题
    useEffect(() => {
        // 主题管理器会自动处理初始化和系统主题监听
        // 这里可以添加其他主题相关的初始化逻辑
    }, []);

    return <>{children}</>;
};

export default ThemeIntegration;
