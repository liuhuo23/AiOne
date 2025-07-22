#!/bin/bash

# AiOne 自动更新环境变量配置脚本
# 使用方法: source ./setup-updater-env.sh

echo "设置 AiOne 自动更新环境变量..."

# 设置私钥
export TAURI_SIGNING_PRIVATE_KEY='dW50cnVzdGVkIGNvbW1lbnQ6IHJzaWduIGVuY3J5cHRlZCBzZWNyZXQga2V5ClJXUlRZMEl5VTdsTTl6b0VJMHY3Qmp6cEFQVnRrNUpKU0srcjM5WGpIMGxKSE9PQllnMEFBQkFBQUFBQUFBQUFBQUlBQUFBQVBLWUxNYVFMVFd1S204NWlmR0R6TUNWRmJMdzkwOERndFV4dm5QTnJndkpCTTFVV3gxYXdoTGdHRGQwNjc4Q254Zmd4blZVVk90bmgrbTJPL1haL1Y1M0FpTEh4SnUvT0pZYSs1RnNzaGJwMWc2UWlKRU92V0YvTVVSa1Qzd3ZHb3NtRUpsZ1lFWVE9Cg=='

# 设置密码
export TAURI_SIGNING_PRIVATE_KEY_PASSWORD='aione2025'

echo "✅ 环境变量设置完成！"
echo
echo "现在可以使用以下命令进行发布:"
echo "./release-with-updater.sh 0.0.3"
echo
echo "或者手动构建:"
echo "pnpm tauri build"

# 验证环境变量
if [ -n "$TAURI_SIGNING_PRIVATE_KEY" ]; then
    echo "✅ TAURI_SIGNING_PRIVATE_KEY 已设置"
else
    echo "❌ TAURI_SIGNING_PRIVATE_KEY 未设置"
fi

if [ -n "$TAURI_SIGNING_PRIVATE_KEY_PASSWORD" ]; then
    echo "✅ TAURI_SIGNING_PRIVATE_KEY_PASSWORD 已设置"
else
    echo "❌ TAURI_SIGNING_PRIVATE_KEY_PASSWORD 未设置"
fi

echo
echo "注意: 这些环境变量只在当前终端会话中有效"
echo "如需永久设置，请将以下内容添加到 ~/.zshrc 或 ~/.bashrc:"
echo
echo "export TAURI_SIGNING_PRIVATE_KEY='dW50cnVzdGVkIGNvbW1lbnQ6IHJzaWduIGVuY3J5cHRlZCBzZWNyZXQga2V5ClJXUlRZMEl5VTdsTTl6b0VJMHY3Qmp6cEFQVnRrNUpKU0srcjM5WGpIMGxKSE9PQllnMEFBQkFBQUFBQUFBQUFBQUlBQUFBQVBLWUxNYVFMVFd1S204NWlmR0R6TUNWRmJMdzkwOERndFV4dm5QTnJndkpCTTFVV3gxYXdoTGdHRGQwNjc4Q254Zmd4blZVVk90bmgrbTJPL1haL1Y1M0FpTEh4SnUvT0pZYSs1RnNzaGJwMWc2UWlKRU92V0YvTVVSa1Qzd3ZHb3NtRUpsZ1lFWVE9Cg=='"
echo "export TAURI_SIGNING_PRIVATE_KEY_PASSWORD='aione2025'"
