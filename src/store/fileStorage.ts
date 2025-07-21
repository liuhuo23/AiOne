import { invoke } from '@tauri-apps/api/core';
import { AppState } from './AppStateContext';

// 与 Rust 端对应的配置接口
export interface TauriAppConfig {
    theme: {
        primary_color: string;
        sider_width: number;
        title_bar_height: number;
        mode: string;
        current_mode: string;
    };
    settings: {
        language: string;
        auto_save: boolean;
        notifications: boolean;
    };
}

// 将 AppState 转换为 TauriAppConfig
export const appStateToTauriConfig = (state: AppState): TauriAppConfig => ({
    theme: {
        primary_color: state.theme.primaryColor,
        sider_width: state.theme.siderWidth,
        title_bar_height: state.theme.titleBarHeight,
        mode: state.theme.mode,
        current_mode: state.theme.currentMode,
    },
    settings: {
        language: state.settings.language,
        auto_save: state.settings.autoSave,
        notifications: state.settings.notifications,
    },
});

// 将 TauriAppConfig 转换为 AppState 的部分数据
export const tauriConfigToAppState = (config: TauriAppConfig): Partial<AppState> => ({
    theme: {
        primaryColor: config.theme.primary_color,
        siderWidth: config.theme.sider_width,
        titleBarHeight: config.theme.title_bar_height,
        mode: config.theme.mode as any,
        currentMode: config.theme.current_mode as any,
    },
    settings: {
        language: config.settings.language as any,
        autoSave: config.settings.auto_save,
        notifications: config.settings.notifications,
    },
});

// 保存配置到文件
export const saveConfigToFile = async (state: AppState): Promise<void> => {
    try {
        const config = appStateToTauriConfig(state);
        await invoke('save_app_config', { config });
        console.log('配置已保存到文件');
    } catch (error) {
        console.error('保存配置失败:', error);
        throw error;
    }
};

// 从文件加载配置
export const loadConfigFromFile = async (): Promise<Partial<AppState> | null> => {
    try {
        const config = await invoke<TauriAppConfig>('load_app_config');
        return tauriConfigToAppState(config);
    } catch (error) {
        console.error('加载配置失败:', error);
        return null;
    }
};

// 重置配置为默认值
export const resetConfigToDefault = async (): Promise<Partial<AppState> | null> => {
    try {
        const config = await invoke<TauriAppConfig>('reset_app_config');
        return tauriConfigToAppState(config);
    } catch (error) {
        console.error('重置配置失败:', error);
        throw error;
    }
};

// 获取配置文件位置（用于显示）
export const getConfigLocation = async (): Promise<string> => {
    try {
        const storageInfo = await invoke<any>('get_storage_locations');
        return storageInfo.app_config_dir || '未知';
    } catch (error) {
        console.error('获取配置位置失败:', error);
        return '未知';
    }
};
