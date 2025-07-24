import { useEffect } from 'react';
import { AppState } from './AppStateContext';

// 将 hex 颜色转换为 RGB 值
const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        return `${r}, ${g}, ${b}`;
    }
    return '17, 153, 142'; // 默认绿色的 RGB 值
};

// 生成主题相关的颜色变体
const generateColorVariants = (primaryColor: string) => {
    const rgb = hexToRgb(primaryColor);

    return {
        '--primary-color': primaryColor,
        '--primary-color-rgb': rgb,
        '--primary-color-hover': `rgba(${rgb}, 0.8)`,
        '--primary-color-active': `rgba(${rgb}, 0.9)`,
        '--primary-color-light': `rgba(${rgb}, 0.1)`,
        '--primary-color-lighter': `rgba(${rgb}, 0.05)`,
        '--primary-gradient': `linear-gradient(135deg, ${primaryColor} 0%, rgba(${rgb}, 0.8) 100%)`,
        '--primary-shadow': `rgba(${rgb}, 0.3)`,
    };
};

// 应用主题到 DOM
export const applyThemeVariables = (theme: AppState['theme']) => {
    const root = document.documentElement;

    // 应用颜色相关变量
    const colorVariants = generateColorVariants(theme.primaryColor);
    Object.entries(colorVariants).forEach(([property, value]) => {
        root.style.setProperty(property, value);
    });

    // 应用全局背景变量
    if (theme.globalBackground) {
        root.style.setProperty('--global-background', theme.globalBackground);
    } else {
        root.style.setProperty('--global-background', 'var(--global-background-gradient-1)');
    }

    // 应用主题模式
    root.style.setProperty('--current-theme', theme.currentMode);
    root.setAttribute('data-theme', theme.currentMode);

    // 应用尺寸相关变量
    root.style.setProperty('--sider-width', `${theme.siderWidth}px`);
    root.style.setProperty('--titlebar-height', `${theme.titleBarHeight}px`);

    // 计算依赖变量
    root.style.setProperty('--content-margin-left', `${theme.siderWidth}px`);
    root.style.setProperty('--content-height', `calc(100vh - ${theme.titleBarHeight + 32}px)`); // titlebar + margin
    root.style.setProperty('--menu-container-height', `calc(100vh - ${theme.titleBarHeight + 60}px)`); // titlebar + logo
};

// 重置主题变量为默认值
export const resetThemeVariables = () => {
    const defaultTheme = {
        primaryColor: '#11998e',
        siderWidth: 60,
        titleBarHeight: 32,
        mode: 'system' as const,
        currentMode: 'light' as const,
        globalBackground: 'var(--global-background-gradient-1)',
    };
    applyThemeVariables(defaultTheme);
};

// 自定义 Hook 用于主题应用
export const useThemeApplication = (theme: AppState['theme']) => {
    useEffect(() => {
        applyThemeVariables(theme);
    }, [theme]);

    return {
        applyTheme: () => applyThemeVariables(theme),
        resetTheme: resetThemeVariables,
    };
};
