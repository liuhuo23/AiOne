import { invoke } from '@tauri-apps/api/core';
import { AppState } from './AppStateContext';
// 保存配置到文件
export const saveConfigToFile = async (state: AppState): Promise<void> => {
    try {
        await invoke('save_app_config', { state });
    } catch (error) {
        throw error;
    }
};

// 从文件加载配置
export const loadConfigFromFile = async (): Promise<Partial<AppState> | null> => {
    try {
        const config = await invoke<AppState>('load_app_config');
        return config;
    } catch (error) {
        console.error('加载配置失败:', error);
        return null;
    }
};

// 重置配置为默认值
export const resetConfigToDefault = async (): Promise<Partial<AppState> | null> => {
    try {
        const config = await invoke<AppState>('reset_app_config');
        return config;
    } catch (error) {
        throw error;
    }
};

// 获取配置文件位置（用于显示）
export const getConfigLocation = async (): Promise<string> => {
    try {
        const storageInfo = await invoke<any>('get_storage_locations');
        return storageInfo.app_config_dir || '未知';
    } catch (error) {
        return '未知';
    }
};
