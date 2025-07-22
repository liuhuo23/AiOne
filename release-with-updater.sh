#!/bin/bash

# AiOne 应用发布脚本，包含自动更新支持
# 使用方法: ./release-with-updater.sh [版本号]

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查参数
if [ $# -eq 0 ]; then
    echo -e "${RED}错误: 请提供版本号${NC}"
    echo "使用方法: $0 <版本号>"
    echo "示例: $0 0.0.3"
    exit 1
fi

VERSION=$1
echo -e "${BLUE}开始发布 AiOne v${VERSION}${NC}"

# 检查是否在正确的目录
if [ ! -f "package.json" ] || [ ! -f "src-tauri/Cargo.toml" ]; then
    echo -e "${RED}错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 检查环境变量
if [ -z "$TAURI_SIGNING_PRIVATE_KEY" ]; then
    echo -e "${YELLOW}警告: 未设置 TAURI_SIGNING_PRIVATE_KEY 环境变量${NC}"
    echo "设置方法:"
    echo "export TAURI_SIGNING_PRIVATE_KEY='dW50cnVzdGVkIGNvbW1lbnQ6IHJzaWduIGVuY3J5cHRlZCBzZWNyZXQga2V5ClJXUlRZMEl5VTdsTTl6b0VJMHY3Qmp6cEFQVnRrNUpKU0srcjM5WGpIMGxKSE9PQllnMEFBQkFBQUFBQUFBQUFBQUlBQUFBQVBLWUxNYVFMVFd1S204NWlmR0R6TUNWRmJMdzkwOERndFV4dm5QTnJndkpCTTFVV3gxYXdoTGdHRGQwNjc4Q254Zmd4blZVVk90bmgrbTJPL1haL1Y1M0FpTEh4SnUvT0pZYSs1RnNzaGJwMWc2UWlKRU92V0YvTVVSa1Qzd3ZHb3NtRUpsZ1lFWVE9Cg=='"
    echo "export TAURI_SIGNING_PRIVATE_KEY_PASSWORD='aione2025'"
    read -p "是否继续？ (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 更新版本号
echo -e "${BLUE}更新版本号到 ${VERSION}${NC}"

# 更新 package.json
sed -i.bak "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/" package.json
rm package.json.bak

# 更新 Cargo.toml
sed -i.bak "s/version = \".*\"/version = \"${VERSION}\"/" src-tauri/Cargo.toml
rm src-tauri/Cargo.toml.bak

# 更新 tauri.conf.json5
sed -i.bak "s/\"version\": \".*\"/\"version\": \"${VERSION}\"/" src-tauri/tauri.conf.json5
rm src-tauri/tauri.conf.json5.bak

echo -e "${GREEN}版本号更新完成${NC}"

# 构建应用
echo -e "${BLUE}开始构建应用...${NC}"
pnpm install
pnpm tauri build

echo -e "${GREEN}构建完成${NC}"

# 生成更新清单
echo -e "${BLUE}生成更新清单文件...${NC}"

# 获取构建输出目录
TARGET_DIR="src-tauri/target/release/bundle"

# 查找生成的文件
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    APP_FILE=$(find "$TARGET_DIR" -name "*.app" -type d | head -1)
    DMG_FILE=$(find "$TARGET_DIR" -name "*.dmg" | head -1)
    UPDATER_FILE=$(find "$TARGET_DIR" -name "*.app.tar.gz" | head -1)
    
    if [ ! -f "$DMG_FILE" ]; then
        echo -e "${RED}错误: 未找到 DMG 文件${NC}"
        exit 1
    fi
    
    if [ ! -f "$UPDATER_FILE" ]; then
        echo -e "${RED}错误: 未找到更新包文件${NC}"
        exit 1
    fi
    
    DOWNLOAD_URL="https://github.com/liuhuo23/AiOne/releases/download/v${VERSION}/$(basename "$DMG_FILE")"
    UPDATER_URL="https://github.com/liuhuo23/AiOne/releases/download/v${VERSION}/$(basename "$UPDATER_FILE")"
    
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    EXE_FILE=$(find "$TARGET_DIR" -name "*.exe" | head -1)
    MSI_FILE=$(find "$TARGET_DIR" -name "*.msi" | head -1)
    UPDATER_FILE=$(find "$TARGET_DIR" -name "*.msi.zip" | head -1)
    
    DOWNLOAD_URL="https://github.com/liuhuo23/AiOne/releases/download/v${VERSION}/$(basename "$MSI_FILE")"
    UPDATER_URL="https://github.com/liuhuo23/AiOne/releases/download/v${VERSION}/$(basename "$UPDATER_FILE")"
    
else
    # Linux
    DEB_FILE=$(find "$TARGET_DIR" -name "*.deb" | head -1)
    APPIMAGE_FILE=$(find "$TARGET_DIR" -name "*.AppImage" | head -1)
    UPDATER_FILE=$(find "$TARGET_DIR" -name "*.AppImage.tar.gz" | head -1)
    
    DOWNLOAD_URL="https://github.com/liuhuo23/AiOne/releases/download/v${VERSION}/$(basename "$DEB_FILE")"
    UPDATER_URL="https://github.com/liuhuo23/AiOne/releases/download/v${VERSION}/$(basename "$UPDATER_FILE")"
fi

# 获取当前日期
CURRENT_DATE=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

# 读取签名
if [ -f "$UPDATER_FILE.sig" ]; then
    SIGNATURE=$(cat "$UPDATER_FILE.sig")
else
    echo -e "${RED}错误: 未找到签名文件 $UPDATER_FILE.sig${NC}"
    exit 1
fi

# 生成 latest.json
cat > latest.json << EOF
{
  "version": "v${VERSION}",
  "notes": "发布 AiOne v${VERSION}\\n\\n查看完整更新内容请访问: https://github.com/liuhuo23/AiOne/releases/tag/v${VERSION}",
  "pub_date": "${CURRENT_DATE}",
  "platforms": {
    "darwin-x86_64": {
      "signature": "${SIGNATURE}",
      "url": "${UPDATER_URL}"
    },
    "darwin-aarch64": {
      "signature": "${SIGNATURE}",
      "url": "${UPDATER_URL}"
    },
    "linux-x86_64": {
      "signature": "${SIGNATURE}",
      "url": "${UPDATER_URL}"
    },
    "windows-x86_64": {
      "signature": "${SIGNATURE}",
      "url": "${UPDATER_URL}"
    }
  }
}
EOF

echo -e "${GREEN}更新清单文件已生成: latest.json${NC}"

# 更新 CHANGELOG.md
echo -e "${BLUE}更新 CHANGELOG.md...${NC}"

# 获取当前日期
RELEASE_DATE=$(date +"%Y-%m-%d")

# 在 CHANGELOG.md 中添加新版本
if [ -f "CHANGELOG.md" ]; then
    # 创建临时文件
    temp_file=$(mktemp)
    
    # 查找 [未发布] 部分并替换
    awk -v version="$VERSION" -v date="$RELEASE_DATE" '
    /^## \[未发布\]/ {
        print $0
        print ""
        print "### 新增"
        print "- "
        print ""
        print "### 变更"
        print "- "
        print ""
        print "### 修复"
        print "- "
        print ""
        print "## [" version "] - " date
        next
    }
    { print }
    ' CHANGELOG.md > "$temp_file"
    
    mv "$temp_file" CHANGELOG.md
    echo -e "${GREEN}CHANGELOG.md 已更新${NC}"
fi

echo -e "${GREEN}发布准备完成！${NC}"
echo
echo -e "${YELLOW}接下来的步骤:${NC}"
echo "1. 提交更改: git add . && git commit -m 'Release v${VERSION}'"
echo "2. 创建标签: git tag v${VERSION}"
echo "3. 推送到远程: git push origin main --tags"
echo "4. 在 GitHub 上创建 Release，上传以下文件:"
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "   - $(basename "$DMG_FILE")"
    echo "   - $(basename "$UPDATER_FILE")"
    echo "   - $(basename "$UPDATER_FILE").sig"
fi
echo "   - latest.json"
echo
echo -e "${BLUE}文件位置:${NC}"
echo "构建产物: $TARGET_DIR"
echo "更新清单: $(pwd)/latest.json"
