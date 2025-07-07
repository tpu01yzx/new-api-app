#!/bin/bash

# New API Manager - GitHub CLI 快速设置脚本
# 非交互式SSH认证配置

set -e

echo "🔑 GitHub CLI 快速设置脚本"
echo "========================="

# 检查是否已安装gh
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI 未安装"
    echo "请先安装: sudo apt install gh"
    exit 1
fi

echo "✅ GitHub CLI 已安装: $(gh --version | head -1)"

# 检查是否已经认证
if gh auth status &> /dev/null; then
    echo "✅ GitHub CLI 已经认证"
    gh auth status
    exit 0
fi

echo ""
echo "🔧 配置认证方式..."

# 方法1: 使用SSH密钥认证（推荐）
echo "1. SSH密钥认证 (推荐，无需token)"
echo "2. Personal Access Token认证"
echo ""

read -p "选择认证方式 (1/2): " auth_method

if [ "$auth_method" = "1" ]; then
    echo ""
    echo "🔐 使用SSH密钥认证..."
    
    # 检查SSH密钥
    if [ ! -f ~/.ssh/id_rsa ] && [ ! -f ~/.ssh/id_ed25519 ]; then
        echo "❌ 未找到SSH密钥"
        echo "请先生成SSH密钥: ssh-keygen -t ed25519 -C 'your_email@example.com'"
        exit 1
    fi
    
    echo "✅ 找到SSH密钥"
    
    # 非交互式SSH认证
    echo "🔗 配置GitHub CLI使用SSH..."
    
    # 创建临时认证配置
    mkdir -p ~/.config/gh
    cat > ~/.config/gh/config.yml << EOF
version: 1
git_protocol: ssh
hosts:
    github.com:
        git_protocol: ssh
        user: $(git config user.name || echo "user")
        oauth_token: ""
EOF
    
    echo "✅ SSH认证配置完成"
    
elif [ "$auth_method" = "2" ]; then
    echo ""
    echo "🔑 使用Personal Access Token认证..."
    echo ""
    echo "请按以下步骤获取Token:"
    echo "1. 访问: https://github.com/settings/tokens"
    echo "2. 点击 'Generate new token (classic)'"
    echo "3. 选择权限: repo, workflow, write:packages"
    echo "4. 复制生成的token"
    echo ""
    
    read -p "请输入GitHub Token: " github_token
    
    if [ -z "$github_token" ]; then
        echo "❌ 未提供Token"
        exit 1
    fi
    
    # 使用token认证
    echo "$github_token" | gh auth login --with-token
    
    echo "✅ Token认证配置完成"
    
else
    echo "❌ 无效选择"
    exit 1
fi

# 验证认证状态
echo ""
echo "🔍 验证认证状态..."
if gh auth status; then
    echo ""
    echo "🎉 GitHub CLI 认证成功！"
    echo ""
    echo "📋 现在可以使用以下命令："
    echo "   ./scripts/manual-release.sh  # 使用GitHub CLI发布"
    echo "   gh repo view                 # 查看仓库信息"
    echo "   gh release list              # 查看所有发布"
else
    echo "❌ 认证失败，请检查配置"
    exit 1
fi 