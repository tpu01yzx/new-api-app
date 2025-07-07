#!/bin/bash

# New API Manager - 纯SSH认证发布脚本
# 使用SSH认证，需要预先配置GitHub Token环境变量

set -e

echo "🚀 New API Manager - SSH认证发布脚本"
echo "==================================="

# 检查发布目录
RELEASE_DIR="release-v0.0.1"
if [ ! -d "$RELEASE_DIR" ]; then
    echo "❌ 未找到发布目录: $RELEASE_DIR"
    echo "请先运行: ./scripts/manual-build.sh"
    exit 1
fi

# 版本信息
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
    echo "请确认APK文件名包含版本号: *${VERSION_NUMBER}*.apk"
    exit 1
fi

echo "✅ 找到 $APK_FILES 个版本 $VERSION_NUMBER 的APK文件"

echo ""
echo "📋 发布信息："
echo "版本号: $VERSION"
echo "标签: $TAG_NAME"
echo "名称: $RELEASE_NAME"

# 检查GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "❌ 未安装GitHub CLI"
    echo "请安装: sudo apt install gh"
    exit 1
fi

# 检查SSH连接
echo ""
echo "🔐 检查SSH认证..."
if ! ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "❌ SSH连接失败"
    echo "请配置SSH密钥: ssh-keygen -t ed25519 -C 'your_email@example.com'"
    echo "并添加到GitHub: https://github.com/settings/keys"
    exit 1
fi
echo "✅ SSH连接正常"

# 配置GitHub CLI
echo "🔧 配置GitHub CLI使用SSH..."
gh config set git_protocol ssh 2>/dev/null || true

# 检查环境变量中的Token
if [ -z "$GITHUB_TOKEN" ]; then
    echo ""
    echo "⚠️  未找到GITHUB_TOKEN环境变量"
    echo ""
    echo "请设置Token环境变量："
    echo "export GITHUB_TOKEN='your_token_here'"
    echo ""
    echo "获取Token: https://github.com/settings/tokens/new"
    echo "权限需要: repo, workflow"
    exit 1
fi

# 使用Token认证（如果需要）
echo "🔑 配置GitHub CLI认证..."
if ! gh auth status &> /dev/null; then
    echo "$GITHUB_TOKEN" | gh auth login --with-token
    gh config set git_protocol ssh
    echo "✅ 认证完成"
else
    echo "✅ 已认证"
fi

# 创建发布说明
RELEASE_NOTES=$(cat << 'EOF'
## 🎉 New API Manager v0.0.1 - Android首发版

### 📱 Android版本
这是New API Manager的首个正式发布版本，专注于Android平台。

#### 📥 下载文件
- `NewApi-release-v0.0.1.apk` - **推荐下载** (生产版本，约52MB)
- `NewApi-debug-v0.0.1.apk` - 调试版本 (约117MB)

#### 📋 安装要求
- Android 7.0 (API 24) 或更高版本
- 允许安装未知来源应用

### 🚀 功能特性
- ✅ 支持多个new-api实例统一管理
- ✅ 实时监控系统状态和性能指标
- ✅ 美观的Material Design界面
- ✅ 完整的TypeScript类型安全
- ✅ 智能降级和离线支持

### 📖 使用方法
1. 下载并安装APK文件
2. 启动应用
3. 添加new-api实例（输入URL和Access Token）
4. 开始监控和管理

### 🔮 未来版本计划
- **v0.2.0**: iOS支持
- **v0.3.0**: 鸿蒙系统支持
- 持续功能优化和性能提升

---
💡 **提示**: 由于GitHub Actions费用限制，此版本为手动构建发布。
EOF
)

# 创建Release（只上传匹配版本号的APK文件）
echo ""
echo "🚀 创建GitHub Release..."
echo "📤 准备上传版本 $VERSION_NUMBER 的APK文件..."

# 构建文件列表
APK_FILES_LIST=""
for apk_file in $(find "$RELEASE_DIR" -name "$APK_PATTERN"); do
    if [ -f "$apk_file" ]; then
        APK_FILES_LIST="$APK_FILES_LIST $apk_file"
        echo "   将上传: $(basename "$apk_file")"
    fi
done

if [ -z "$APK_FILES_LIST" ]; then
    echo "❌ 没有找到要上传的APK文件"
    exit 1
fi

gh release create "$TAG_NAME" \
    --title "$RELEASE_NAME" \
    --notes "$RELEASE_NOTES" \
    $APK_FILES_LIST

echo ""
echo "🎉 发布完成！"
echo "🔗 查看发布: https://github.com/tpu01yzx/new-api-app/releases/tag/$TAG_NAME"
echo ""
echo "📋 使用的认证方式:"
echo "   SSH连接: ✅"
echo "   GitHub CLI: ✅" 
echo "   协议: SSH"
echo "   上传文件: $APK_FILES 个APK文件" 