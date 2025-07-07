#!/bin/bash

# New API Manager - GitHub CLI 认证修复脚本

set -e

echo "🔧 GitHub CLI 认证修复脚本"
echo "========================="

# 清理现有配置
echo "🧹 清理现有GitHub CLI配置..."
rm -rf ~/.config/gh

echo ""
echo "🔑 选择认证方式："
echo "1. Personal Access Token (推荐)"
echo "2. 重新尝试SSH认证"
echo "3. 跳过GitHub CLI，使用curl版本"

read -p "请选择 (1/2/3): " choice

case $choice in
    1)
        echo ""
        echo "🔑 Personal Access Token认证"
        echo "=============================="
        echo ""
        echo "📱 获取Token步骤："
        echo "1. 访问: https://github.com/settings/tokens/new"
        echo "2. Token名称: new-api-app-release"
        echo "3. 过期时间: 90 days"
        echo "4. 权限选择:"
        echo "   ✅ repo (完整仓库权限)"
        echo "   ✅ write:packages"
        echo "   ✅ workflow"
        echo "5. 点击 'Generate token'"
        echo "6. 复制生成的token"
        echo ""
        
        read -p "请粘贴您的GitHub Token: " github_token
        
        if [ -z "$github_token" ]; then
            echo "❌ 未提供Token"
            exit 1
        fi
        
        echo ""
        echo "🔗 配置GitHub CLI..."
        echo "$github_token" | gh auth login --with-token
        
        if gh auth status &> /dev/null; then
            echo "✅ Token认证成功！"
            echo ""
            echo "🚀 现在可以运行发布："
            echo "   ./scripts/manual-release.sh"
        else
            echo "❌ Token认证失败"
            exit 1
        fi
        ;;
        
    2)
        echo ""
        echo "🔐 重新尝试SSH认证"
        echo "=================="
        
        # 检查SSH连接
        echo "🔍 测试GitHub SSH连接..."
        if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
            echo "✅ SSH连接正常"
        else
            echo "❌ SSH连接有问题，请检查SSH密钥配置"
            echo "提示: ssh-keygen -t ed25519 -C 'your_email@example.com'"
            exit 1
        fi
        
        # 尝试SSH认证（兼容老版本）
        echo "🔗 配置SSH认证..."
        echo "⚠️  您的GitHub CLI版本较老，SSH认证可能不完全支持"
        echo "建议使用Token认证（选项1）"
        
        # 对于老版本，尝试基本认证
        gh auth login --hostname github.com
        
        if gh auth status &> /dev/null; then
            echo "✅ 认证成功！"
        else
            echo "❌ 认证失败，建议使用Token认证"
            exit 1
        fi
        ;;
        
    3)
        echo ""
        echo "🌐 使用curl版本发布脚本"
        echo "====================="
        echo ""
        echo "此方法绕过GitHub CLI，直接使用GitHub API"
        echo ""
        
        read -p "请输入GitHub Token: " github_token
        
        if [ -z "$github_token" ]; then
            echo "❌ 未提供Token"
            exit 1
        fi
        
        echo ""
        echo "🚀 准备使用curl版本发布..."
        export GITHUB_TOKEN="$github_token"
        
        echo "✅ 环境变量已设置"
        echo ""
        echo "📋 执行发布命令："
        echo "   export GITHUB_TOKEN=\"$github_token\""
        echo "   ./scripts/manual-release-curl.sh"
        echo ""
        
        read -p "是否立即执行发布？(y/N): " run_now
        if [[ $run_now =~ ^[Yy]$ ]]; then
            ./scripts/manual-release-curl.sh
        fi
        ;;
        
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac 