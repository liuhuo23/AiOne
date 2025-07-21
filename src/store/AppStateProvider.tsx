import React, { useEffect } from 'react';
import { AppStateProvider as BaseAppStateProvider, useAppState } from './AppStateContext';
import { loadState, usePersistentState } from './persistentStore';
import { useThemeApplication } from './themeApplication';
import { i18n } from '../i18n';
import type { ThemeMode } from './AppStateContext';

// 增强的 Provider，包含状态恢复和持久化
const EnhancedAppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <BaseAppStateProvider>
            <StateManager>
                {children}
            </StateManager>
        </BaseAppStateProvider>
    );
};

// 状态管理器组件
const StateManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { state, dispatch } = useAppState();

    // 使用持久化 Hook（可以选择存储类型：'localStorage' 或 'file'）
    usePersistentState(state, 'file'); // 默认使用文件存储

    // 应用主题到 DOM
    useThemeApplication(state.theme);

    // 恢复保存的状态
    useEffect(() => {
        const loadSavedState = async () => {
            // 首先从 i18n 系统获取当前语言
            const currentI18nLanguage = i18n.getCurrentLanguage();

            // 尝试从文件加载，失败则从 localStorage 加载
            const savedState = await loadState('file');

            if (savedState) {
                // 恢复主题设置
                if (savedState.theme) {
                    if (savedState.theme.primaryColor) {
                        dispatch({ type: 'SET_THEME_COLOR', payload: savedState.theme.primaryColor });
                    }
                    if (savedState.theme.siderWidth) {
                        dispatch({ type: 'SET_SIDER_WIDTH', payload: savedState.theme.siderWidth });
                    }
                    if (savedState.theme.mode) {
                        dispatch({ type: 'SET_THEME_MODE', payload: savedState.theme.mode as ThemeMode });
                    }
                }

                // 恢复用户设置
                if (savedState.settings) {
                    // 优先使用 i18n 中保存的语言设置
                    const languageToUse = savedState.settings.language || currentI18nLanguage;
                    dispatch({ type: 'SET_LANGUAGE', payload: languageToUse });
                    // 确保 i18n 系统也同步
                    if (languageToUse !== currentI18nLanguage) {
                        i18n.changeLanguage(languageToUse);
                    }

                    if (typeof savedState.settings.autoSave === 'boolean') {
                        dispatch({ type: 'SET_AUTO_SAVE', payload: savedState.settings.autoSave });
                    }
                    if (typeof savedState.settings.notifications === 'boolean') {
                        dispatch({ type: 'SET_NOTIFICATIONS', payload: savedState.settings.notifications });
                    }
                }
            } else {
                // 如果没有保存的状态，使用 i18n 的语言设置
                dispatch({ type: 'SET_LANGUAGE', payload: currentI18nLanguage });
            }
        };

        loadSavedState();
    }, [dispatch]);

    return <>{children}</>;
};

export default EnhancedAppStateProvider;
