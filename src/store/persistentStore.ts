import { useEffect } from 'react';
import { AppState } from './AppStateContext';
import { saveConfigToFile, loadConfigFromFile } from './fileStorage';

const STORAGE_KEY = 'aione-app-state';

// 需要持久化的状态键
const PERSISTENT_KEYS: (keyof AppState)[] = ['theme', 'settings'];

// 存储类型
export type StorageType = 'localStorage' | 'file';

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

// 保存状态（支持多种存储方式）
export const saveState = async (state: AppState, storageType: StorageType = 'localStorage') => {
    switch (storageType) {
        case 'localStorage':
            saveStateToStorage(state);
            break;
        case 'file':
            try {
                await saveConfigToFile(state);
            } catch (error) {
                console.warn('文件存储失败，回退到 localStorage:', error);
                saveStateToStorage(state);
            }
            break;
    }
};

// 加载状态（支持多种存储方式）
export const loadState = async (storageType: StorageType = 'localStorage'): Promise<Partial<AppState> | null> => {
    switch (storageType) {
        case 'localStorage':
            return loadStateFromStorage();
        case 'file':
            try {
                const fileState = await loadConfigFromFile();
                if (fileState) {
                    return fileState;
                }
                // 如果文件加载失败，尝试从 localStorage 加载
                return loadStateFromStorage();
            } catch (error) {
                console.warn('文件加载失败，回退到 localStorage:', error);
                return loadStateFromStorage();
            }
    }
};

// 自定义 Hook 用于状态持久化
export const usePersistentState = (state: AppState, storageType: StorageType = 'localStorage') => {
    // 保存状态变化
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            saveState(state, storageType);
        }, 500); // 防抖，500ms 后保存

        return () => clearTimeout(timeoutId);
    }, [state.theme, state.settings, storageType]); // 只监听需要持久化的状态

    return {
        saveState: () => saveState(state, storageType),
        clearState: clearStoredState,
    };
};
