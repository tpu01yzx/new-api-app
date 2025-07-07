#!/bin/bash

# New API Manager - 纯SSH发布脚本
# 仅使用SSH和Git，不依赖GitHub API或HTTPS访问

set -e

echo "🚀 New API Manager - 纯SSH发布脚本"
echo "=================================="
echo "📝 此脚本仅使用SSH，适用于网络限制环境"

# 检查发布目录
RELEASE_DIR="release-v0.0.1"
if [ ! -d "$RELEASE_DIR" ]; then
    echo "❌ 未找到发布目录: $RELEASE_DIR"
    echo "请先运行: ./scripts/manual-build.sh"
    exit 1
fi

# 版本信息（从package.json或手动设置）
VERSION="v0.0.1"
VERSION_NUMBER="0.0.1"  # 去掉v前缀的版本号
TAG_NAME="$VERSION"
RELEASE_NAME="New API Manager $VERSION - Android首发版"

# 检查APK文件（只检查包含当前版本号的文件）
echo "🔍 查找版本 $VERSION_NUMBER 的APK文件..."
APK_PATTERN="*${VERSION_NUMBER}*.apk"
APK_FILES=$(find "$RELEASE_DIR" -name "$APK_PATTERN" | wc -l)

if [ "$APK_FILES" -eq 0 ]; then
    echo "❌ 发布目录中未找到版本 $VERSION_NUMBER 的APK文件"
    echo "查找模式: $APK_PATTERN"
    echo "目录内容:"
    ls -la "$RELEASE_DIR"/ 2>/dev/null || echo "发布目录不存在"
    echo ""
    echo "请确认："
    echo "1. 已运行构建: ./scripts/manual-build.sh"
    echo "2. APK文件名包含版本号: *${VERSION_NUMBER}*.apk"
    exit 1
fi

echo "✅ 找到 $APK_FILES 个版本 $VERSION_NUMBER 的APK文件"

# 显示匹配的文件
echo "📁 匹配的APK文件："
find "$RELEASE_DIR" -name "$APK_PATTERN" -exec basename {} \;

echo ""
echo "📋 发布信息："
echo "版本号: $VERSION"
echo "标签: $TAG_NAME"
echo "名称: $RELEASE_NAME"

# 检查SSH连接
echo ""
echo "🔐 检查SSH连接..."
if ! ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "❌ SSH连接失败"
    echo ""
    echo "🔧 请配置SSH密钥："
    echo "1. 生成密钥: ssh-keygen -t ed25519 -C 'your_email@example.com'"
    echo "2. 查看公钥: cat ~/.ssh/id_ed25519.pub"
    echo "3. 添加到GitHub: 需要通过其他方式访问GitHub Settings"
    echo "4. 测试连接: ssh -T git@github.com"
    exit 1
fi
echo "✅ SSH连接正常"

# 检查Git配置
echo ""
echo "🔍 检查Git配置..."
if ! git config --global user.name >/dev/null 2>&1; then
    echo "⚠️  Git用户名未配置"
    read -p "请输入Git用户名: " git_username
    git config --global user.name "$git_username"
fi

if ! git config --global user.email >/dev/null 2>&1; then
    echo "⚠️  Git邮箱未配置"
    read -p "请输入Git邮箱: " git_email
    git config --global user.email "$git_email"
fi

echo "✅ Git配置:"
echo "   用户: $(git config --global user.name)"
echo "   邮箱: $(git config --global user.email)"

# 检查Git状态
echo ""
echo "📝 检查Git仓库状态..."

# 确保在正确的目录
if [ ! -d ".git" ]; then
    echo "❌ 当前目录不是Git仓库"
    exit 1
fi

# 检查是否有未提交的更改
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "⚠️  检测到未提交的更改"
    echo ""
    git status --short
    echo ""
    read -p "是否先提交这些更改? (y/N): " commit_changes
    
    if [[ $commit_changes =~ ^[Yy]$ ]]; then
        echo "📝 提交更改..."
        git add .
        git commit -m "feat: 更新发布脚本，添加SSH认证支持

- 新增纯SSH发布脚本
- 更新构建和发布文档
- 优化网络受限环境下的发布流程"
        
        echo "✅ 更改已提交"
    else
        echo "⚠️  继续发布，但建议先提交更改"
    fi
fi

# 检查远程仓库
echo ""
echo "🔍 检查远程仓库..."
if ! git remote get-url origin | grep -q "git@github.com"; then
    echo "⚠️  远程仓库不是SSH格式"
    echo "当前远程: $(git remote get-url origin)"
    echo ""
    echo "正在切换到SSH格式..."
    git remote set-url origin git@github.com:tpu01yzx/new-api-app.git
    echo "✅ 已切换到SSH: git@github.com:tpu01yzx/new-api-app.git"
else
    echo "✅ 远程仓库: $(git remote get-url origin)"
fi

# 创建Git标签
echo ""
echo "🏷️  创建Git标签..."

# 检查标签是否已存在
if git tag -l | grep -q "^$TAG_NAME$"; then
    echo "⚠️  标签 $TAG_NAME 已存在"
    read -p "是否删除并重新创建? (y/N): " recreate_tag
    
    if [[ $recreate_tag =~ ^[Yy]$ ]]; then
        echo "🗑️  删除现有标签..."
        git tag -d "$TAG_NAME"
        git push origin ":refs/tags/$TAG_NAME" 2>/dev/null || echo "远程标签删除失败（可能不存在）"
    else
        echo "❌ 取消发布"
        exit 1
    fi
fi

# 创建带注释的标签
echo "📝 创建标签 $TAG_NAME..."
git tag -a "$TAG_NAME" -m "$RELEASE_NAME

## 🎉 New API Manager v0.0.1 - Android首发版

### 📱 Android版本
这是New API Manager的首个正式发布版本，专注于Android平台。

### 🚀 功能特性
- ✅ 支持多个new-api实例统一管理
- ✅ 实时监控系统状态和性能指标  
- ✅ 美观的Material Design界面
- ✅ 完整的TypeScript类型安全
- ✅ 智能降级和离线支持

### 📥 下载文件
- NewApi-release-v1.0.apk - 推荐下载 (生产版本，约52MB)
- NewApi-debug-v1.0.apk - 调试版本 (约117MB)

### 📋 安装要求
- Android 7.0 (API 24) 或更高版本
- 允许安装未知来源应用

---
💡 提示: 由于GitHub Actions费用限制，此版本为手动构建发布。"

echo "✅ 标签创建完成"

# 推送到远程仓库
echo ""
echo "🚀 推送到GitHub..."

# 推送当前分支
echo "📤 推送代码..."
if git push origin main; then
    echo "✅ 代码推送成功"
else
    echo "❌ 代码推送失败"
    exit 1
fi

# 推送标签
echo "📤 推送标签..."
if git push origin "$TAG_NAME"; then
    echo "✅ 标签推送成功"
else
    echo "❌ 标签推送失败"
    exit 1
fi

echo ""
echo "🎉 SSH发布完成！"
echo "================="
echo ""
echo "✅ 已完成的操作："
echo "   ✓ 创建Git标签: $TAG_NAME"
echo "   ✓ 推送代码到GitHub"
echo "   ✓ 推送标签到GitHub"
echo ""
echo "📋 GitHub会自动创建Release，但需要手动上传APK文件"
echo ""
echo "🔗 访问链接（需要其他网络环境）："
echo "   仓库: https://github.com/tpu01yzx/new-api-app"
echo "   发布: https://github.com/tpu01yzx/new-api-app/releases/tag/$TAG_NAME"
echo ""
echo "📁 版本 $VERSION_NUMBER 的APK文件："
find "$RELEASE_DIR" -name "$APK_PATTERN" | while read apk_file; do
    if [ -f "$apk_file" ]; then
        echo "   $(basename "$apk_file") ($(du -h "$apk_file" | cut -f1))"
    fi
done
echo ""
echo "📝 手动上传步骤（需要其他网络环境）："
echo "1. 访问: https://github.com/tpu01yzx/new-api-app/releases/tag/$TAG_NAME"
echo "2. 点击 'Edit release'"
echo "3. 拖拽上传 $RELEASE_DIR/ 目录中的APK文件"
echo "4. 点击 'Update release'"
echo ""
echo "💡 或者使用有网络访问权限的环境执行:"
echo "   ./scripts/manual-release-curl.sh  # 如果能访问GitHub API" 