use serde_json::{json, Value};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

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
pub fn save_app_config(app_handle: AppHandle, config: Value) -> Result<(), String> {
    let config_path = get_config_path(&app_handle)?;
    let config_json = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;
    fs::write(config_path, config_json).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn load_app_config(app_handle: AppHandle) -> Result<Value, String> {
    let config_path = get_config_path(&app_handle)?;

    if !config_path.exists() {
        // 如果配置文件不存在，返回默认配置
        return Ok(json!({})); // 返回一个空的 JSON 对象
    }

    let config_content = fs::read_to_string(config_path).map_err(|e| e.to_string())?;
    let config: Value = serde_json::from_str(&config_content).map_err(|e| e.to_string())?;
    Ok(config)
}

#[tauri::command]
pub fn reset_app_config(app_handle: AppHandle) -> Result<Value, String> {
    let config = json!({});
    save_app_config(app_handle, config.clone())?;
    Ok(config)
}
