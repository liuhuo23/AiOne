use crate::schemas::StorageInfo;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn get_storage_locations(app_handle: AppHandle) -> Result<StorageInfo, String> {
    let storage_info = StorageInfo {
        app_data_dir: app_handle
            .path()
            .app_data_dir()
            .map_err(|e| e.to_string())?
            .to_str()
            .map(|s| s.to_string()),
        app_config_dir: app_handle
            .path()
            .app_config_dir()
            .map_err(|e| e.to_string())?
            .to_str()
            .map(|s| s.to_string()),
        app_cache_dir: app_handle
            .path()
            .app_cache_dir()
            .map_err(|e| e.to_string())?
            .to_str()
            .map(|s| s.to_string()),
        app_local_data_dir: app_handle
            .path()
            .app_local_data_dir()
            .map_err(|e| e.to_string())?
            .to_str()
            .map(|s| s.to_string()),
        app_log_dir: app_handle
            .path()
            .app_log_dir()
            .map_err(|e| e.to_string())?
            .to_str()
            .map(|s| s.to_string()),
    };

    Ok(storage_info)
}
