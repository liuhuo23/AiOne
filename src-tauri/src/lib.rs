// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod config_manager;
mod schemas;
mod settings;
mod utils;
use config_manager::{load_app_config, reset_app_config, save_app_config};
use settings::get_storage_locations;
use utils::open_folder;
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_storage_locations,
            open_folder,
            save_app_config,
            load_app_config,
            reset_app_config
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
