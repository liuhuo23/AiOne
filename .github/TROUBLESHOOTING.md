# GitHub Actions 故障排除指南

## 常见问题及解决方案

### 1. Release 创建一直卡住

**问题描述**: `github.rest.repos.createRelease` 调用无响应

**可能原因**:
- GitHub API 权限不足
- 网络连接问题
- 标签已存在冲突
- GITHUB_TOKEN 权限配置错误

**解决方案**:

#### 检查权限设置
1. 进入仓库 Settings > Actions > General
2. 确保 "Workflow permissions" 设置为:
   - ✅ "Read and write permissions"
   - ✅ "Allow GitHub Actions to create and approve pull requests"

#### 检查分支保护规则
1. 进入 Settings > Branches
2. 如果有分支保护规则，确保 GitHub Actions 有权限推送

#### 手动测试权限
运行 debug-release.yml 工作流来测试 API 访问权限:
```bash
# 在 GitHub Actions 页面手动运行 Debug Release 工作流
```

#### 清理冲突的标签/Release
```bash
# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete tag v1.0.0

# 在 GitHub 页面删除对应的 Release
```

### 2. 构建失败

**macOS 构建失败**:
```bash
# 常见错误: 缺少 Xcode Command Line Tools
# 解决方案: 在工作流中添加
- name: Install Xcode tools
  if: matrix.platform == 'macos-latest'
  run: xcode-select --install || true
```

**Linux 构建失败**:
```bash
# 常见错误: 缺少系统依赖
# 解决方案: 确保安装了所有必要的依赖
sudo apt-get install -y libwebkit2gtk-4.0-dev libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

**Windows 构建失败**:
```bash
# 常见错误: Rust 目标架构问题
# 解决方案: 确保正确安装了目标架构
rustup target add x86_64-pc-windows-msvc
rustup target add i686-pc-windows-msvc
```

### 3. 版本号问题

**版本号不一致**:
```bash
# 使用版本同步脚本
./version.sh check
./version.sh sync 1.0.0
```

**标签格式错误**:
```bash
# 正确的标签格式
git tag v1.0.0          # ✅ 正确
git tag 1.0.0           # ❌ 错误，缺少 v 前缀
git tag v1.0.0-beta.1   # ✅ 正确，预发布版本
```

### 4. 缓存问题

**Rust 缓存问题**:
```yaml
# 清理缓存的方法
- name: Clear Rust cache
  run: |
    cargo clean
    rm -rf ~/.cargo/registry
    rm -rf ~/.cargo/git
```

**Node.js 缓存问题**:
```bash
# 清理 npm 缓存
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install
```

### 5. 权限问题详细检查

#### GITHUB_TOKEN 权限检查清单:
- [ ] Actions: read
- [ ] Contents: write
- [ ] Issues: write
- [ ] Pull requests: write
- [ ] Repository projects: read

#### 手动权限测试脚本:
```javascript
// 在 GitHub Actions 中运行此脚本测试权限
const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function testPermissions() {
  try {
    // 测试读取权限
    const repo = await octokit.rest.repos.get({
      owner: 'your-username',
      repo: 'your-repo'
    });
    console.log('✅ Read permission: OK');

    // 测试写入权限
    const release = await octokit.rest.repos.createRelease({
      owner: 'your-username',
      repo: 'your-repo',
      tag_name: 'test-permission',
      name: 'Permission Test',
      draft: true
    });
    console.log('✅ Write permission: OK');

    // 清理测试 release
    await octokit.rest.repos.deleteRelease({
      owner: 'your-username',
      repo: 'your-repo',
      release_id: release.data.id
    });
    console.log('✅ Delete permission: OK');

  } catch (error) {
    console.error('❌ Permission test failed:', error);
  }
}
```

### 6. 网络和连接问题

**GitHub API 限制**:
- 每小时 1000 次 API 调用限制
- 大文件上传可能超时

**解决方案**:
```yaml
# 添加重试机制
- name: Create release with retry
  uses: nick-invision/retry@v2
  with:
    timeout_minutes: 10
    max_attempts: 3
    command: |
      # 你的发布命令
```

### 7. 调试技巧

#### 启用详细日志:
```yaml
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
```

#### 添加调试输出:
```yaml
- name: Debug information
  run: |
    echo "Repository: ${{ github.repository }}"
    echo "Event: ${{ github.event_name }}"
    echo "Ref: ${{ github.ref }}"
    echo "Actor: ${{ github.actor }}"
    echo "Workflow: ${{ github.workflow }}"
    echo "Job: ${{ github.job }}"
    echo "Run ID: ${{ github.run_id }}"
    echo "Run Number: ${{ github.run_number }}"
```

#### 使用 tmate 调试:
```yaml
- name: Setup tmate session
  if: failure()
  uses: mxschmitt/action-tmate@v3
```

### 8. 紧急修复方案

如果 GitHub Actions 完全无法工作，可以使用本地构建:

```bash
# 本地构建所有平台（需要对应的系统）
npm install
npm run build

# macOS
npm run tauri build -- --target aarch64-apple-darwin
npm run tauri build -- --target x86_64-apple-darwin

# Windows（在 Windows 系统上）
npm run tauri build -- --target x86_64-pc-windows-msvc

# Linux（在 Linux 系统上）
npm run tauri build
```

然后手动上传到 GitHub Releases。

### 9. 联系支持

如果以上方案都无法解决问题:

1. 查看 [GitHub Status](https://www.githubstatus.com/) 确认服务状态
2. 查看 [Tauri GitHub Issues](https://github.com/tauri-apps/tauri/issues)
3. 在项目中创建 Issue 并附上完整的错误日志
