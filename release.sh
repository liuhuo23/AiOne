#!/bin/bash

# AiOne 发布助手脚本
# 用法: ./release.sh [版本号] [选项]
# 选项: --signed (创建签名版本)

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 显示使用帮助
show_help() {
    echo "AiOne 发布助手"
    echo ""
    echo "用法:"
    echo "  $0 <版本号> [选项]"
    echo ""
    echo "版本号格式:"
    echo "  1.0.0          - 正式版本"
    echo "  1.0.0-beta.1   - 测试版本"
    echo "  1.0.0-alpha.1  - 预览版本"
    echo ""
    echo "选项:"
    echo "  --signed       - 创建签名版本（需要配置证书）"
    echo "  --help, -h     - 显示此帮助信息"
    echo ""
    echo "例子:"
    echo "  $0 1.0.0                 # 创建 v1.0.0 普通版本"
    echo "  $0 1.0.0 --signed        # 创建 v1.0.0-signed 签名版本"
    echo "  $0 1.0.0-beta.1          # 创建 v1.0.0-beta.1 测试版本"
}

# 检查版本号格式
validate_version() {
    if [[ ! $1 =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.-]+)?$ ]]; then
        echo -e "${RED}错误: 版本号格式不正确${NC}"
        echo "正确格式: 1.0.0 或 1.0.0-beta.1"
        exit 1
    fi
}

# 检查工作目录状态
check_git_status() {
    if ! git diff-index --quiet HEAD --; then
        echo -e "${YELLOW}警告: 工作目录有未提交的更改${NC}"
        echo "请先提交所有更改再进行发布"
        echo ""
        git status --short
        echo ""
        read -p "是否继续? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "发布已取消"
            exit 1
        fi
    fi
}



# 创建并推送标签
create_and_push_tag() {
    local tag=$1
    echo -e "${BLUE}创建标签 $tag...${NC}"
    
    # 提交版本更改
    git add package.json src-tauri/Cargo.toml
    git commit -m "chore: bump version to $tag" || true
    
    # 检查本地标签是否存在，如果存在则删除
    if git tag -l | grep -q "^$tag$"; then
        echo -e "${YELLOW}本地标签 $tag 已存在，正在删除...${NC}"
        git tag -d "$tag"
    fi
    
    # 创建标签
    git tag -a "$tag" -m "Release $tag"
    
    # 推送到远程
    echo -e "${BLUE}推送到远程仓库...${NC}"
    git push origin main
    
    # 检查远程标签是否存在，如果存在则强制推送覆盖
    if git ls-remote --tags origin | grep -q "refs/tags/$tag"; then
        echo -e "${YELLOW}远程标签 $tag 已存在，正在强制更新...${NC}"
        git push origin --delete tag "$tag" 2>/dev/null || true
        git push origin "$tag"
    else
        echo -e "${BLUE}推送新标签 $tag...${NC}"
        git push origin "$tag"
    fi
    
    echo -e "${GREEN}标签 $tag 已创建并推送${NC}"
}

# 检查 GitHub Actions 状态
check_actions_status() {
    local tag=$1
    echo -e "${BLUE}检查 GitHub Actions 状态...${NC}"
    echo "你可以在以下链接查看构建进度:"
    echo "https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\).*/\1/' | sed 's/\.git$//')/actions"
    echo ""
    echo "构建完成后，发布将在以下位置可用:"
    echo "https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\).*/\1/' | sed 's/\.git$//')/releases/tag/$tag"
}

# 主函数
main() {
    local version=""
    local signed=false
    
    # 解析参数
    while [[ $# -gt 0 ]]; do
        case $1 in
            --signed)
                signed=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            -*)
                echo -e "${RED}错误: 未知选项 $1${NC}"
                show_help
                exit 1
                ;;
            *)
                if [[ -z $version ]]; then
                    version=$1
                else
                    echo -e "${RED}错误: 多余的参数 $1${NC}"
                    show_help
                    exit 1
                fi
                shift
                ;;
        esac
    done
    
    # 检查版本号参数
    if [[ -z $version ]]; then
        echo -e "${RED}错误: 请提供版本号${NC}"
        show_help
        exit 1
    fi
    
    # 验证版本号格式
    validate_version "$version"
    
    # 确定标签名
    local tag="v$version"
    if [[ $signed == true ]]; then
        tag="v$version-signed"
    fi
    
    echo -e "${GREEN}=== AiOne 发布助手 ===${NC}"
    echo "版本号: $version"
    echo "标签: $tag"
    echo "签名版本: $(if [[ $signed == true ]]; then echo '是'; else echo '否'; fi)"
    echo ""
    
    # 确认发布
    read -p "确认发布? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "发布已取消"
        exit 0
    fi
    
    # 执行发布流程
    check_git_status
    # update_version "$version"
    create_and_push_tag "$tag"
    check_actions_status "$tag"
    
    echo ""
    echo -e "${GREEN}🎉 发布流程已启动!${NC}"
    echo -e "${YELLOW}请等待 GitHub Actions 完成构建...${NC}"
}

# 运行主函数
main "$@"
