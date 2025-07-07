#!/bin/bash

# New API Manager - 版本号检查脚本
# 测试和验证版本号过滤功能

set -e

echo "🔍 New API Manager - 版本号检查脚本"
echo "=================================="

# 版本信息
VERSION="v0.0.1"
VERSION_NUMBER="0.0.1"
RELEASE_DIR="release-v0.0.1"

echo "📋 当前版本配置："
echo "   Git标签版本: $VERSION"
echo "   APK版本号: $VERSION_NUMBER"
echo "   发布目录: $RELEASE_DIR"

# 检查发布目录
echo ""
echo "📁 发布目录检查..."
if [ ! -d "$RELEASE_DIR" ]; then
    echo "❌ 发布目录不存在: $RELEASE_DIR"
    echo "请先运行: ./scripts/manual-build.sh"
    exit 1
fi

echo "✅ 发布目录存在"

# 显示所有APK文件
echo ""
echo "📋 所有APK文件："
if ls "$RELEASE_DIR"/*.apk >/dev/null 2>&1; then
    for apk in "$RELEASE_DIR"/*.apk; do
        if [ -f "$apk" ]; then
            echo "   $(basename "$apk") ($(du -h "$apk" | cut -f1))"
        fi
    done
else
    echo "   无APK文件"
fi

# 检查对应版本的APK文件
echo "🔍 查找版本 $VERSION_NUMBER 的APK文件..."
APK_PATTERN="*${VERSION_NUMBER}*.apk"
if [ -d "$RELEASE_DIR" ]; then
    MATCHING_FILES=$(find "$RELEASE_DIR" -name "$APK_PATTERN" 2>/dev/null)
    if [ -z "$MATCHING_FILES" ]; then
        echo "   ❌ 未找到匹配的文件"
    else
        echo "   ✅ 匹配的文件："
        echo "$MATCHING_FILES" | while read file; do
            if [ -f "$file" ]; then
                echo "      $(basename "$file") ($(du -h "$file" | cut -f1))"
            fi
        done
    fi
else
    echo "   ❌ 发布目录不存在"
fi

# 检查Android构建配置中的版本号
echo ""
echo "📱 Android构建配置检查..."
ANDROID_VERSION=$(grep -o 'versionName "[^"]*"' android/app/build.gradle | cut -d'"' -f2)
echo "   Android versionName: $ANDROID_VERSION"

if [ "$ANDROID_VERSION" = "$VERSION_NUMBER" ]; then
    echo "   ✅ 版本号一致"
else
    echo "   ❌ 版本号不一致！"
    echo "      Git标签: $VERSION_NUMBER"
    echo "      Android: $ANDROID_VERSION"
fi

# 检查package.json中的版本号
echo ""
echo "📦 package.json版本检查..."
if [ -f "package.json" ]; then
    NPM_VERSION=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
    echo "   npm版本: $NPM_VERSION"
    
    if [ "$NPM_VERSION" = "$VERSION_NUMBER" ]; then
        echo "   ✅ 与目标版本一致"
    else
        echo "   ⚠️  与目标版本不一致"
        echo "      目标: $VERSION_NUMBER"
        echo "      npm: $NPM_VERSION"
    fi
else
    echo "   ❌ package.json不存在"
fi

# 版本号一致性总结
echo ""
echo "📊 版本号一致性总结："
echo "================="

CONSISTENCY_OK=true

# 检查各个版本号是否一致
if [ "$ANDROID_VERSION" != "$VERSION_NUMBER" ]; then
    echo "❌ Android版本号不一致: $ANDROID_VERSION vs $VERSION_NUMBER"
    CONSISTENCY_OK=false
fi

if [ -f "package.json" ]; then
    NPM_VERSION=$(grep -o '"version": "[^"]*"' package.json | cut -d'"' -f4)
    if [ "$NPM_VERSION" != "$VERSION_NUMBER" ]; then
        echo "⚠️  npm版本号不一致: $NPM_VERSION vs $VERSION_NUMBER"
    fi
fi

if [ -z "$MATCHING_FILES" ]; then
    echo "❌ 没有找到匹配版本号的APK文件"
    CONSISTENCY_OK=false
fi

if [ "$CONSISTENCY_OK" = true ]; then
    echo "✅ 版本号配置正确，可以进行发布"
    echo ""
    echo "🚀 发布命令："
    echo "   ./scripts/manual-release-ssh-only.sh  # 纯SSH发布"
    echo "   ./scripts/manual-release-ssh.sh       # SSH + GitHub API"
    echo "   ./scripts/manual-release-curl.sh      # 纯API发布"
else
    echo "❌ 发现版本号不一致问题，建议修复后再发布"
    echo ""
    echo "🔧 修复建议："
    echo "1. 确保 android/app/build.gradle 中的 versionName 为 \"$VERSION_NUMBER\""
    echo "2. 确保已重新构建APK: ./scripts/manual-build.sh"
    echo "3. 检查APK文件名是否包含正确的版本号"
fi 