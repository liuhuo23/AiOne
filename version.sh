#!/bin/bash

# 版本检查和同步脚本

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 获取各文件中的版本号
get_package_version() {
    if command -v jq > /dev/null; then
        jq -r '.version' package.json
    else
        grep '"version"' package.json | cut -d'"' -f4
    fi
}

get_cargo_version() {
    grep '^version = ' src-tauri/Cargo.toml | cut -d'"' -f2
}

get_tauri_version() {
    if command -v jq > /dev/null; then
        jq -r '.version' src-tauri/tauri.conf.json5 2>/dev/null || echo "未找到"
    else
        echo "需要 jq 工具"
    fi
}

# 检查版本一致性
check_versions() {
    local package_version=$(get_package_version)
    local cargo_version=$(get_cargo_version)
    
    echo "当前版本号:"
    echo "  package.json: $package_version"
    echo "  Cargo.toml:   $cargo_version"
    
    if [[ "$package_version" != "$cargo_version" ]]; then
        echo -e "${RED}警告: 版本号不一致!${NC}"
        return 1
    else
        echo -e "${GREEN}✓ 版本号一致${NC}"
        return 0
    fi
}

# 同步版本号
sync_versions() {
    local version=$1
    if [[ -z $version ]]; then
        version=$(get_package_version)
        echo "使用 package.json 中的版本号: $version"
    fi
    
    echo "同步版本号到 $version..."
    
    # 更新 package.json
    if command -v jq > /dev/null; then
        jq ".version = \"$version\"" package.json > package.json.tmp && mv package.json.tmp package.json
    else
        sed -i.bak "s/\"version\": \".*\"/\"version\": \"$version\"/" package.json && rm package.json.bak
    fi
    
    # 更新 Cargo.toml
    sed -i.bak "s/version = \".*\"/version = \"$version\"/" src-tauri/Cargo.toml && rm src-tauri/Cargo.toml.bak
    
    echo -e "${GREEN}版本号已同步到 $version${NC}"
}

# 主函数
main() {
    case "${1:-check}" in
        check)
            check_versions
            ;;
        sync)
            sync_versions "$2"
            ;;
        --help|-h)
            echo "版本管理工具"
            echo ""
            echo "用法:"
            echo "  $0 check          - 检查版本号一致性"
            echo "  $0 sync [版本号]   - 同步版本号"
            echo ""
            ;;
        *)
            echo "未知命令: $1"
            echo "使用 $0 --help 查看帮助"
            exit 1
            ;;
    esac
}

main "$@"
