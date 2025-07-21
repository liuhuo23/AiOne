#!/bin/bash

# 应用图标生成脚本
# 使用方法: ./generate-icon.sh [图标文件路径]

echo "🎨 AiOne 应用图标生成器"
echo "========================="

# 检查是否提供了图标文件参数
if [ $# -eq 0 ]; then
    # 没有参数，使用默认文件名
    ICON_FILE="app-icon.png"
    echo "使用默认图标文件: $ICON_FILE"
else
    # 使用提供的文件路径
    ICON_FILE="$1"
    echo "使用指定图标文件: $ICON_FILE"
fi

# 检查文件是否存在
if [ ! -f "$ICON_FILE" ]; then
    echo "❌ 错误: 图标文件 '$ICON_FILE' 不存在"
    echo ""
    echo "请确保图标文件存在，或者使用以下格式："
    echo "  ./generate-icon.sh your-icon.png"
    echo ""
    echo "图标要求："
    echo "  - PNG 格式"
    echo "  - 正方形比例 (1:1)"
    echo "  - 建议尺寸: 1024x1024 像素"
    echo "  - 透明背景"
    exit 1
fi

echo "📁 图标文件: $ICON_FILE"
echo "📂 输出目录: src-tauri/icons/"

# 备份现有图标
if [ -d "src-tauri/icons" ]; then
    echo "💾 备份现有图标..."
    cp -r src-tauri/icons src-tauri/icons-backup-$(date +%Y%m%d-%H%M%S)
fi

# 生成新图标
echo "🔨 生成应用图标..."
pnpm tauri icon "$ICON_FILE"

# 检查是否成功
if [ $? -eq 0 ]; then
    echo "✅ 图标生成成功！"
    echo ""
    echo "生成的文件:"
    ls -la src-tauri/icons/
    echo ""
    echo "下一步:"
    echo "  1. 运行 'pnpm tauri build' 重新构建应用"
    echo "  2. 新图标将出现在构建的应用中"
else
    echo "❌ 图标生成失败，请检查图标文件格式和大小"
    exit 1
fi
