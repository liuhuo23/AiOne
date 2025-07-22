use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct AppConfig {
    pub theme: ThemeConfig,
    pub settings: UserSettings,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ThemeConfig {
    pub primary_color: String,
    pub sider_width: u32,
    pub title_bar_height: u32,
    pub mode: String,         // 'light' | 'dark' | 'system'
    pub current_mode: String, // 'light' | 'dark'
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct UserSettings {
    pub language: String, // 'zh-CN' | 'en-US'
    pub auto_save: bool,
    pub notifications: bool,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            theme: ThemeConfig {
                primary_color: "#11998e".to_string(),
                sider_width: 60,
                title_bar_height: 32,
                mode: "system".to_string(),
                current_mode: "light".to_string(),
            },
            settings: UserSettings {
                language: "zh-CN".to_string(),
                auto_save: true,
                notifications: true,
            },
        }
    }
}

pub fn get_config_path(app_handle: &AppHandle) -> Result<PathBuf, String> {
    let mut config_dir = app_handle
        .path()
        .app_config_dir()
        .map_err(|e| e.to_string())?;

    // 确保配置目录存在
    if !config_dir.exists() {
        fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;
    }

    config_dir.push("settings.json");
    Ok(config_dir)
}

#[tauri::command]
pub fn save_app_config(app_handle: AppHandle, config: AppConfig) -> Result<(), String> {
    let config_path = get_config_path(&app_handle)?;
    let config_json = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;
    fs::write(config_path, config_json).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn load_app_config(app_handle: AppHandle) -> Result<AppConfig, String> {
    let config_path = get_config_path(&app_handle)?;

    if !config_path.exists() {
        // 如果配置文件不存在，返回默认配置
        return Ok(AppConfig::default());
    }

    let config_content = fs::read_to_string(config_path).map_err(|e| e.to_string())?;
    let config: AppConfig = serde_json::from_str(&config_content).map_err(|e| e.to_string())?;
    Ok(config)
}

#[tauri::command]
pub fn reset_app_config(app_handle: AppHandle) -> Result<AppConfig, String> {
    let config = AppConfig::default();
    save_app_config(app_handle, config.clone())?;
    Ok(config)
}
