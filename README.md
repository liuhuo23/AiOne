# AiOne Desktop Application

一个现代化的桌面应用程序，基于 Tauri + React + TypeScript 构建，提供跨平台的原生体验。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)
![GitHub release](https://img.shields.io/github/v/release/liuhuo23/AiOne)
![Build Status](https://img.shields.io/github/actions/workflow/status/liuhuo23/AiOne/release.yml)

## ✨ 特性

- 🎨 **现代化 UI**: 基于 Ant Design 的精美界面设计
- 🌓 **主题切换**: 支持亮色/暗色主题切换
- 🌍 **多语言**: 支持中英文切换
- 📱 **响应式**: 适配不同屏幕尺寸
- ⚡ **高性能**: Tauri 提供的原生性能
- 🔒 **安全**: Rust 后端保证安全性
- 🎯 **跨平台**: 支持 Windows、macOS、Linux

## 📦 安装

### 从 Release 下载

访问 [Releases 页面](https://github.com/liuhuo23/AiOne/releases) 下载适合您操作系统的安装包：

#### Windows
- `AiOne_1.0.0_x64-setup.msi` - Windows 安装程序（推荐）
- `AiOne_1.0.0_x64_en-US.msi` - Windows 安装程序（英文版）

#### macOS
- `AiOne_1.0.0_aarch64.dmg` - Apple Silicon (M1/M2/M3) 版本
- `AiOne_1.0.0_x64.dmg` - Intel 版本

#### Linux
- `aione_1.0.0_amd64.deb` - Debian/Ubuntu 包
- `aione_1.0.0_amd64.AppImage` - 便携版本

### 系统要求

- **Windows**: Windows 10 版本 1903 或更高
- **macOS**: macOS 10.15 或更高
- **Linux**: 支持 GTK 3.24 或更高的发行版

## 🚀 开发

### 推荐 IDE 设置

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

### 环境要求

- Node.js 18+ 
- Rust 1.70+
- 操作系统相关依赖：
  - **Windows**: 无额外要求
  - **macOS**: Xcode Command Line Tools
  - **Linux**: 见下方 Linux 依赖

#### Linux 依赖

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev

# Fedora
sudo dnf install webkit2gtk3-devel.x86_64 \
    openssl-devel \
    curl \
    wget \
    file \
    libappindicator-gtk3-devel \
    librsvg2-devel
    
# Arch Linux
sudo pacman -S webkit2gtk \
    base-devel \
    curl \
    wget \
    file \
    openssl \
    appmenu-gtk-module \
    gtk3 \
    libappindicator-gtk3 \
    librsvg \
    libvips
```

### 快速开始

1. **克隆仓库**
```bash
git clone https://github.com/liuhuo23/AiOne.git
cd AiOne
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run tauri dev
```

### 构建

```bash
# 构建前端
npm run build

# 构建应用
npm run tauri build
```

## 📋 脚本命令

项目提供了便捷的脚本来管理版本和发布：

### 版本管理
```bash
# 检查版本号一致性
./version.sh check

# 同步版本号
./version.sh sync 1.0.0
```

### 发布
```bash
# 发布普通版本
./release.sh 1.0.0

# 发布签名版本（需要配置证书）
./release.sh 1.0.0 --signed

# 发布测试版本
./release.sh 1.0.0-beta.1
```

## 🔧 配置

### 应用配置

主要配置文件位于 `src-tauri/tauri.conf.json5`，您可以自定义：

- 应用信息（名称、版本、描述）
- 窗口设置（大小、最小尺寸、透明度）
- 安全设置
- 构建选项

### 主题定制

主题配置在 `src/styles/theme.css` 中，支持：

- 颜色变量定制
- 组件样式覆盖
- 响应式断点调整

## 🤝 贡献

欢迎贡献！请查看我们的[贡献指南](.github/README.md)了解详细信息。

### 开发工作流

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 🏗️ 架构

```
src/
├── components/          # React 组件
├── pages/              # 页面组件
├── hooks/              # 自定义 Hooks
├── store/              # 状态管理
├── styles/             # 样式文件
├── i18n/               # 国际化
└── utils/              # 工具函数

src-tauri/
├── src/                # Rust 源码
├── icons/              # 应用图标
└── tauri.conf.json5    # Tauri 配置
```

## 📝 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详细信息。

## 📞 支持

如果您遇到问题或有建议，请：

1. 查看 [Issues](https://github.com/liuhuo23/AiOne/issues) 寻找已知问题
2. 创建新的 [Issue](https://github.com/liuhuo23/AiOne/issues/new/choose)
3. 参与 [Discussions](https://github.com/liuhuo23/AiOne/discussions)

## 🙏 致谢

- [Tauri](https://tauri.app/) - 跨平台应用框架
- [React](https://reactjs.org/) - UI 库
- [Ant Design](https://ant.design/) - UI 组件库
- [Vite](https://vitejs.dev/) - 前端构建工具
