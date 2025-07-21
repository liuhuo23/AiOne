import { useEffect } from 'react';
import { useTheme } from '../store/AppStateContext';
import type { ThemeMode } from '../store/AppStateContext';

// 检测系统主题偏好
const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
};

// 解析当前应该显示的主题
const resolveTheme = (mode: ThemeMode): 'light' | 'dark' => {
    switch (mode) {
        case 'light':
            return 'light';
        case 'dark':
            return 'dark';
        case 'system':
            return getSystemTheme();
        default:
            return 'light';
    }
};

// 主题管理 Hook
export const useThemeManager = () => {
    const { theme, setCurrentMode, setThemeMode } = useTheme();

    // 监听系统主题变化
    useEffect(() => {
        const updateTheme = () => {
            const resolvedTheme = resolveTheme(theme.mode);
            if (theme.currentMode !== resolvedTheme) {
                setCurrentMode(resolvedTheme);
            }
        };

        // 初始设置
        updateTheme();

        // 监听系统主题变化
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme.mode === 'system') {
                updateTheme();
            }
        };

        // 添加监听器
        mediaQuery.addEventListener('change', handleChange);

        // 清理监听器
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [theme.mode, theme.currentMode, setCurrentMode]);

    // 切换主题模式的方法
    const toggleTheme = () => {
        switch (theme.mode) {
            case 'light':
                setThemeMode('dark');
                break;
            case 'dark':
                setThemeMode('system');
                break;
            case 'system':
                setThemeMode('light');
                break;
        }
    };

    // 设置特定主题模式的方法
    const setMode = (mode: ThemeMode) => {
        setThemeMode(mode);
    };

    // 获取主题模式的显示文本
    const getThemeModeText = () => {
        switch (theme.mode) {
            case 'light':
                return '亮色模式';
            case 'dark':
                return '暗黑模式';
            case 'system':
                return `跟随系统 (${theme.currentMode === 'dark' ? '暗黑' : '亮色'})`;
            default:
                return '亮色模式';
        }
    };

    // 获取主题模式的图标
    const getThemeModeIcon = () => {
        switch (theme.mode) {
            case 'light':
                return 'sun';
            case 'dark':
                return 'moon';
            case 'system':
                return 'desktop';
            default:
                return 'sun';
        }
    };

    return {
        currentTheme: theme.currentMode,
        themeMode: theme.mode,
        toggleTheme,
        setMode,
        getThemeModeText,
        getThemeModeIcon,
    };
};
