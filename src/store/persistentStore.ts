import { useEffect } from 'react';
import { AppState } from './AppStateContext';

const STORAGE_KEY = 'aione-app-state';

// 需要持久化的状态键
const PERSISTENT_KEYS: (keyof AppState)[] = ['theme', 'settings'];

// 保存状态到 localStorage
export const saveStateToStorage = (state: AppState) => {
    try {
        const persistentState: any = {};

        PERSISTENT_KEYS.forEach(key => {
            persistentState[key] = state[key];
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(persistentState));
    } catch (error) {
        console.warn('保存状态到本地存储失败:', error);
    }
};

// 从 localStorage 恢复状态
export const loadStateFromStorage = (): Partial<AppState> | null => {
    try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
            return JSON.parse(savedState);
        }
    } catch (error) {
        console.warn('从本地存储恢复状态失败:', error);
    }
    return null;
};

// 清除存储的状态
export const clearStoredState = () => {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.warn('清除本地存储失败:', error);
    }
};

// 自定义 Hook 用于状态持久化
export const usePersistentState = (state: AppState) => {
    // 保存状态变化
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            saveStateToStorage(state);
        }, 500); // 防抖，500ms 后保存

        return () => clearTimeout(timeoutId);
    }, [state.theme, state.settings]); // 只监听需要持久化的状态

    return {
        saveState: () => saveStateToStorage(state),
        clearState: clearStoredState,
    };
};
