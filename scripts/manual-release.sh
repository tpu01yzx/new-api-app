#!/bin/bash

# New API Manager - 手动发布脚本 (SSH认证版本)
# 创建GitHub Release并上传APK文件
# 优先使用SSH认证，如需要会提示输入Token

set -e

echo "🚀 New API Manager - 手动发布脚本"
echo "================================"

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

# 检查是否安装了gh CLI
if ! command -v gh &> /dev/null; then
    echo ""
    echo "⚠️  未安装GitHub CLI (gh)"
    echo "请按以下步骤手动发布："
    echo ""
    echo "1. 访问: https://github.com/tpu01yzx/new-api-app/releases/new"
    echo "2. 标签: $TAG_NAME"
    echo "3. 标题: $RELEASE_NAME"
    echo "4. 上传以下版本 $VERSION_NUMBER 的文件："
    
    find "$RELEASE_DIR" -name "$APK_PATTERN" | while read apk; do
        if [ -f "$apk" ]; then
            echo "   - $(basename "$apk")"
        fi
    done
    
    echo ""
    echo "5. 发布说明："
    cat << 'EOF'

## 🎉 New API Manager v0.0.1 - Android首发版

### 📱 Android版本
这是New API Manager的首个正式发布版本，专注于Android平台。

#### 下载文件
- `NewApi-release-v0.0.1.apk` - **推荐下载** (生产版本，52MB)
- `NewApi-debug-v0.0.1.apk` - 调试版本 (117MB)

#### 安装要求
- Android 7.0 (API 24) 或更高版本
- 允许安装未知来源应用

### 🚀 功能特性
- ✅ 支持多个new-api实例统一管理
- ✅ 实时监控系统状态和性能指标
- ✅ 美观的Material Design界面
- ✅ 完整的TypeScript类型安全
- ✅ 智能降级和离线支持

### 📋 使用方法
1. 下载并安装APK文件
2. 启动应用
3. 添加new-api实例（输入URL和Access Token）
4. 开始监控和管理

### 🔄 未来版本计划
- v0.2.0: iOS支持
- v0.3.0: 鸿蒙系统支持
- 持续功能优化和性能提升

---
💡 **提示**: 由于GitHub Actions费用限制，此版本为手动构建发布。
EOF
    
    exit 0
fi

# 配置SSH认证
echo ""
echo "🔐 配置SSH认证..."

# 检查SSH连接到GitHub
echo "🔍 检查GitHub SSH连接..."
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ SSH连接正常"
else
    echo "❌ SSH连接失败，请检查SSH密钥配置"
    echo ""
    echo "🔧 SSH故障排除："
    echo "1. 检查SSH密钥: ls -la ~/.ssh/"
    echo "2. 生成新密钥: ssh-keygen -t ed25519 -C 'your_email@example.com'"
    echo "3. 添加到GitHub: https://github.com/settings/keys"
    echo "4. 测试连接: ssh -T git@github.com"
    exit 1
fi

# 配置GitHub CLI使用SSH
echo "🔧 配置GitHub CLI使用SSH协议..."

# 清理可能的错误认证
gh auth logout --hostname github.com 2>/dev/null || true

# 创建GitHub CLI配置目录
mkdir -p ~/.config/gh

# 配置SSH协议
cat > ~/.config/gh/config.yml << EOF
version: 1
git_protocol: ssh
hosts:
    github.com:
        git_protocol: ssh
        user: git
EOF

# 检查GitHub CLI认证状态
echo "🔍 检查GitHub CLI认证状态..."
if ! gh auth status &> /dev/null; then
    echo "⚠️  GitHub CLI需要认证，正在使用SSH配置..."
    
    # 对于老版本的GitHub CLI，尝试基本认证
    echo "🔗 初始化GitHub CLI认证..."
    
    # 设置git协议为SSH
    gh config set git_protocol ssh 2>/dev/null || true
    
    # 尝试非交互式认证
    if ! gh auth status &> /dev/null; then
        echo ""
        echo "⚠️  需要GitHub Personal Access Token进行首次认证"
        echo "📱 获取Token: https://github.com/settings/tokens/new"
        echo "权限需要: repo, workflow"
        echo ""
        read -p "请输入GitHub Token (或按Enter跳过): " github_token
        
        if [ ! -z "$github_token" ]; then
            echo "$github_token" | gh auth login --with-token
            echo "✅ Token认证完成，后续将使用SSH"
        else
            echo "❌ 未提供Token，无法继续自动发布"
            echo ""
            echo "🔄 替代方案："
            echo "1. 使用Token: ./scripts/fix-github-auth.sh"
            echo "2. 使用curl: ./scripts/manual-release-curl.sh" 
            echo "3. 手动发布: 参考 docs/RELEASE_TEMPLATE.md"
            exit 1
        fi
    fi
fi

# 确保使用SSH协议
gh config set git_protocol ssh 2>/dev/null || true

echo "✅ SSH认证配置完成"

# 使用GitHub CLI发布
echo ""
echo "🚀 使用GitHub CLI创建发布..."

# 创建发布说明
RELEASE_NOTES=$(cat << 'EOF'
## 🎉 New API Manager v0.0.1 - Android首发版

### 📱 Android版本
这是New API Manager的首个正式发布版本，专注于Android平台。

#### 下载文件
- `NewApi-release-v0.0.1.apk` - **推荐下载** (生产版本，52MB)
- `NewApi-debug-v0.0.1.apk` - 调试版本 (117MB)

#### 安装要求
- Android 7.0 (API 24) 或更高版本
- 允许安装未知来源应用

### 🚀 功能特性
- ✅ 支持多个new-api实例统一管理
- ✅ 实时监控系统状态和性能指标
- ✅ 美观的Material Design界面
- ✅ 完整的TypeScript类型安全
- ✅ 智能降级和离线支持

### 📋 使用方法
1. 下载并安装APK文件
2. 启动应用
3. 添加new-api实例（输入URL和Access Token）
4. 开始监控和管理

### 🔄 未来版本计划
- v0.2.0: iOS支持
- v0.3.0: 鸿蒙系统支持
- 持续功能优化和性能提升

---
💡 **提示**: 由于GitHub Actions费用限制，此版本为手动构建发布。
EOF
)

# 创建Release（只上传匹配版本号的APK文件）
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
echo "📋 发布信息："
echo "   认证方式: SSH + Token (首次)"
echo "   协议: SSH"
echo "   上传文件: $APK_FILES 个APK文件"
echo ""
echo "💡 后续发布将自动使用SSH认证，无需再次输入Token" 