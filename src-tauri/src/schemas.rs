#[derive(serde::Serialize)]
pub struct StorageInfo {
    pub app_data_dir: Option<String>,
    pub app_config_dir: Option<String>,
    pub app_cache_dir: Option<String>,
    pub app_local_data_dir: Option<String>,
    pub app_log_dir: Option<String>,
}
