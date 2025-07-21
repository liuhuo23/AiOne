# 应用图标使用指南

## 快速开始

### 1. 准备你的图标
- 创建一个高质量的 PNG 图片（建议 1024x1024 像素）
- 确保背景透明
- 设计简洁明了，适合在小尺寸下显示

### 2. 生成应用图标
将你的图标文件放在项目根目录，然后运行：

```bash
# 如果图标文件名为 app-icon.png（默认）
pnpm tauri icon

# 如果图标文件名不同，指定文件路径
pnpm tauri icon ./my-custom-icon.png

# 指定输出目录（可选）
pnpm tauri icon ./my-icon.png -o ./src-tauri/icons
```

### 3. 生成的图标文件
命令执行后会在 `src-tauri/icons/` 目录下生成以下文件：
- `32x32.png` - 小尺寸图标
- `128x128.png` - 中等尺寸图标  
- `128x128@2x.png` - 高分辨率图标
- `icon.png` - 通用 PNG 图标
- `icon.ico` - Windows 图标
- `icon.icns` - macOS 图标
- `Square*.png` - Windows 应用商店图标系列

### 4. 自动配置
生成的图标会自动在 `tauri.conf.json` 中配置，无需手动修改。

### 5. 应用图标
重新构建应用：
```bash
pnpm tauri build
```

## 注意事项
- 源图标建议使用正方形比例（1:1）
- PNG 格式，透明背景
- 最小尺寸 512x512 像素，推荐 1024x1024 像素
- 避免过于复杂的细节，确保缩小后仍然清晰

## 验证图标
构建完成后，你可以在以下位置看到新图标：
- 应用程序文件的图标
- 任务栏/Dock 中的图标
- 窗口标题栏图标
