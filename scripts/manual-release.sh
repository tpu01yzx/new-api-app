#!/bin/bash

# New API Manager - 手动发布脚本
# 创建GitHub Release并上传APK文件

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

# 检查APK文件
APK_FILES=$(find "$RELEASE_DIR" -name "*.apk" | wc -l)
if [ "$APK_FILES" -eq 0 ]; then
    echo "❌ 发布目录中未找到APK文件"
    echo "请先运行: ./scripts/manual-build.sh"
    exit 1
fi

echo "✅ 找到 $APK_FILES 个APK文件"

# 版本信息
VERSION="v0.0.1"
TAG_NAME="$VERSION"
RELEASE_NAME="New API Manager $VERSION - Android首发版"

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
    echo "4. 上传以下文件："
    
    for apk in "$RELEASE_DIR"/*.apk; do
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
- `NewApi-release-v1.0.apk` - **推荐下载** (生产版本，52MB)
- `NewApi-debug-v1.0.apk` - 调试版本 (117MB)

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

# 使用GitHub CLI发布
echo ""
echo "🚀 使用GitHub CLI创建发布..."

# 创建发布说明
RELEASE_NOTES=$(cat << 'EOF'
## 🎉 New API Manager v0.0.1 - Android首发版

### 📱 Android版本
这是New API Manager的首个正式发布版本，专注于Android平台。

#### 下载文件
- `NewApi-release-v1.0.apk` - **推荐下载** (生产版本，52MB)
- `NewApi-debug-v1.0.apk` - 调试版本 (117MB)

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

# 创建Release
gh release create "$TAG_NAME" \
    --title "$RELEASE_NAME" \
    --notes "$RELEASE_NOTES" \
    "$RELEASE_DIR"/*.apk

echo ""
echo "🎉 发布完成！"
echo "🔗 查看发布: https://github.com/tpu01yzx/new-api-app/releases/tag/$TAG_NAME" 