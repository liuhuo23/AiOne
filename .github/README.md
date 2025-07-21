# GitHub Actions 自动构建和发布指南

本项目包含了三个 GitHub Actions 工作流，用于自动构建和发布 AiOne 应用的各个平台版本。

## 工作流说明

### 1. 开发构建 (test.yml)
- **触发条件**: 推送到 `main` 或 `develop` 分支，或者创建针对 `main` 分支的 Pull Request
- **功能**: 测试构建，确保代码在各个平台上都能正常编译
- **平台**: macOS (Apple Silicon), Ubuntu, Windows
- **用途**: 持续集成测试

### 2. 发布构建 (release.yml)
- **触发条件**: 推送以 `v` 开头的标签（如 `v1.0.0`）
- **功能**: 自动创建 GitHub Release 并构建所有平台的安装包
- **平台**: 
  - macOS (Apple Silicon: aarch64)
  - macOS (Intel: x86_64)
  - Linux (x86_64)
  - Windows (x86_64)
  - Windows (i686)
- **特点**: 无代码签名，适合快速发布

### 3. 签名发布构建 (release-signed.yml)
- **触发条件**: 推送以 `v*-signed` 格式的标签（如 `v1.0.0-signed`）
- **功能**: 构建带有代码签名的发布版本
- **平台**: macOS, Windows
- **特点**: 需要配置代码签名证书

## 使用方法

### 发布新版本（无签名）

1. 确保你的代码已经准备好发布
2. 创建并推送标签：
```bash
git tag v1.0.0
git push origin v1.0.0
```
3. 工作流会自动运行，创建 Draft Release
4. 构建完成后，Release 会自动发布

### 发布签名版本

1. 首先配置必要的 Secrets（见下方配置章节）
2. 创建并推送签名标签：
```bash
git tag v1.0.0-signed
git push origin v1.0.0-signed
```
3. 工作流会自动运行并构建签名版本

### 手动触发发布

你也可以在 GitHub Actions 页面手动触发工作流：
1. 进入 Actions 页面
2. 选择相应的工作流
3. 点击 "Run workflow"
4. 输入版本号

## 配置代码签名

### macOS 签名配置

在 GitHub 仓库的 Settings > Secrets 中添加以下 secrets：

- `APPLE_CERTIFICATE`: Base64 编码的 .p12 证书文件
- `APPLE_CERTIFICATE_PASSWORD`: 证书密码
- `APPLE_SIGNING_IDENTITY`: 签名身份（通常是 "Developer ID Application: Your Name (TEAM_ID)"）
- `APPLE_ID`: Apple ID 邮箱
- `APPLE_PASSWORD`: App-specific password
- `APPLE_TEAM_ID`: 开发者团队 ID

### Windows 签名配置

- `WINDOWS_CERTIFICATE`: Base64 编码的 .p12 或 .pfx 证书文件
- `WINDOWS_CERTIFICATE_PASSWORD`: 证书密码

### 获取 Base64 编码的证书

```bash
# macOS/Linux
base64 -i your-certificate.p12 -o certificate-base64.txt

# Windows
certutil -encode your-certificate.p12 certificate-base64.txt
```

## 工作流特性

### 缓存优化
- 使用 npm 缓存加速依赖安装
- 使用 Rust 缓存加速编译

### 多平台支持
- 自动为不同平台和架构构建
- 智能处理平台特定的依赖

### 错误处理
- 失败时自动停止相关任务
- 详细的构建日志和错误信息

### 发布自动化
- 自动创建 GitHub Release
- 自动上传构建产物
- 支持预发布版本（包含 `-` 的版本号）

## 构建产物

构建完成后，以下文件会自动上传到 GitHub Release：

### macOS
- `.dmg` 文件（磁盘镜像）
- `.app.tar.gz` 文件（应用程序包）

### Windows
- `.msi` 文件（Windows 安装程序）
- `.exe` 文件（便携版，如果配置）

### Linux
- `.deb` 文件（Debian/Ubuntu 包）
- `.AppImage` 文件（便携版）
- `.tar.gz` 文件（通用 Linux 包）

## 故障排除

### 常见问题

1. **构建失败**: 检查依赖版本和平台兼容性
2. **签名失败**: 验证证书和 secrets 配置
3. **发布失败**: 确保有足够的权限和 GITHUB_TOKEN

### 调试技巧

1. 查看 Actions 页面的详细日志
2. 在本地使用相同的命令测试构建
3. 检查 `tauri.conf.json5` 配置

## 自定义配置

你可以根据需要修改工作流：

1. **添加新平台**: 在 matrix.include 中添加新的平台配置
2. **修改触发条件**: 更改 `on` 部分的条件
3. **添加测试步骤**: 在构建前添加测试任务
4. **自定义发布说明**: 修改 release body 模板

## 注意事项

1. 确保 `package.json` 和 `src-tauri/Cargo.toml` 中的版本号保持同步
2. 代码签名需要有效的开发者证书
3. 首次设置时建议先测试无签名版本
4. 注意 GitHub Actions 的使用限制和配额
