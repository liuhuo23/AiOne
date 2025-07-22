# AiOne 自动更新功能说明

## 功能概述

AiOne 应用已集成 Tauri 官方自动更新功能，支持：
- 自动检查更新
- 后台下载更新包
- 增量更新安装
- 签名验证确保安全性

## 使用方法

### 用户端使用

1. **自动检查更新**
   - 应用启动 5 秒后自动静默检查更新
   - 如有新版本，会在右上角显示通知

2. **手动检查更新**
   - 进入 `设置` → `系统` 页面
   - 点击 `检查更新` 按钮

3. **安装更新**
   - 点击 `立即更新` 按钮开始下载
   - 下载完成后应用会自动重启

### 开发者发布流程

#### 方法一：使用自动化脚本（推荐）

1. **设置环境变量**
   ```bash
   source ./setup-updater-env.sh
   ```

2. **执行发布脚本**
   ```bash
   ./release-with-updater.sh 0.0.3
   ```

3. **推送到 GitHub**
   ```bash
   git add .
   git commit -m "Release v0.0.3"
   git tag v0.0.3
   git push origin main --tags
   ```

4. **GitHub Actions 自动构建**
   - 推送标签后，GitHub Actions 会自动构建所有平台
   - 自动创建 Release 并上传文件
   - 自动生成 `latest.json` 更新清单

#### 方法二：手动发布

1. **设置环境变量**
   ```bash
   export TAURI_SIGNING_PRIVATE_KEY='[私钥内容]'
   export TAURI_SIGNING_PRIVATE_KEY_PASSWORD='aione2025'
   ```

2. **更新版本号**
   - 更新 `package.json` 中的 version
   - 更新 `src-tauri/Cargo.toml` 中的 version
   - 更新 `src-tauri/tauri.conf.json5` 中的 version

3. **构建应用**
   ```bash
   pnpm tauri build
   ```

4. **生成更新清单**
   ```bash
   # 手动创建 latest.json 文件
   ```

5. **上传到 GitHub Release**
   - 创建新的 Release
   - 上传构建产物和 latest.json

## 配置说明

### Tauri 配置 (tauri.conf.json5)

```json5
"plugins": {
  "updater": {
    "active": true,
    "endpoints": [
      "https://github.com/liuhuo23/AiOne/releases/latest/download/latest.json"
    ],
    "dialog": true,
    "pubkey": "[公钥内容]"
  }
}
```

### 签名密钥

- **公钥**: 配置在 `tauri.conf.json5` 中，用于验证更新包
- **私钥**: 设置为环境变量，用于签名更新包
- **密码**: 保护私钥的密码

### 更新清单 (latest.json)

```json
{
  "version": "v0.0.3",
  "notes": "更新说明",
  "pub_date": "2025-01-22T10:00:00.000Z",
  "platforms": {
    "darwin-x86_64": {
      "signature": "[签名]",
      "url": "[下载链接]"
    }
  }
}
```

## 环境变量

### 开发环境

```bash
# 签名私钥（base64 编码）
export TAURI_SIGNING_PRIVATE_KEY='[私钥内容]'

# 私钥密码
export TAURI_SIGNING_PRIVATE_KEY_PASSWORD='aione2025'
```

### GitHub Actions

在 GitHub 仓库设置中添加以下 Secrets：
- `TAURI_SIGNING_PRIVATE_KEY`: 私钥内容
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`: 私钥密码

## 文件结构

```
├── setup-updater-env.sh          # 环境变量设置脚本
├── release-with-updater.sh        # 自动化发布脚本
├── .github/workflows/
│   └── release-updater.yml        # GitHub Actions 工作流
├── src/components/
│   └── UpdateManager.tsx          # 更新管理组件
└── src-tauri/
    ├── tauri.conf.json5           # Tauri 配置（包含更新配置）
    └── Cargo.toml                 # Rust 依赖（包含 updater 插件）
```

## 安全注意事项

1. **私钥安全**
   - 私钥必须妥善保管，泄露后需要重新生成
   - 不要将私钥提交到代码仓库
   - 使用环境变量或 GitHub Secrets 存储

2. **签名验证**
   - 每个更新包都会进行签名验证
   - 只有使用对应私钥签名的更新包才能安装
   - 确保更新服务器的安全性

3. **HTTPS 传输**
   - 更新检查和下载必须使用 HTTPS
   - GitHub Releases 默认使用 HTTPS

## 故障排除

### 常见问题

1. **签名验证失败**
   - 检查公钥配置是否正确
   - 确认私钥和公钥是否匹配

2. **无法检查更新**
   - 检查网络连接
   - 确认更新服务器地址是否正确

3. **构建失败**
   - 确认环境变量是否正确设置
   - 检查 Tauri 和依赖版本

### 调试方法

1. **查看控制台输出**
   ```bash
   # 开发模式查看详细日志
   pnpm tauri dev
   ```

2. **验证更新配置**
   ```bash
   # 检查配置文件语法
   cat src-tauri/tauri.conf.json5
   ```

3. **测试签名**
   ```bash
   # 手动验证签名
   pnpm tauri signer sign --private-key "[私钥]" "[文件路径]"
   ```

## 更新日志

- v0.0.2: 集成自动更新功能
- v0.0.1: 初始版本

---

更多信息请参考 [Tauri 官方文档](https://tauri.app/v1/guides/distribution/updater)
