#!/bin/bash

# New API Manager - 手动构建脚本
# 由于GitHub Actions费用限制，使用本地手动构建

set -e

echo "🚀 New API Manager - 手动构建脚本"
echo "=================================="

# 检查环境
echo "📋 检查构建环境..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到Node.js，请先安装Node.js"
    exit 1
fi

echo "✅ Node.js: $(node --version)"

# 检查npm依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装npm依赖..."
    npm ci
fi

# Android构建
echo ""
echo "🤖 构建Android版本..."
echo "====================="

if [ ! -d "android" ]; then
    echo "❌ 未找到android目录"
    exit 1
fi

cd android

# 检查Gradle
if [ ! -f "gradlew" ]; then
    echo "❌ 未找到Gradle Wrapper"
    exit 1
fi

# 赋予执行权限
chmod +x gradlew

echo "🔨 开始构建Android APK..."

# 深度清理（解决代码生成问题）
echo "🧹 深度清理构建缓存..."
./gradlew clean
rm -rf app/.cxx
rm -rf app/build
rm -rf .gradle

echo "🔄 重新生成代码..."
./gradlew generateCodegenArtifactsFromSchema || echo "⚠️ 代码生成失败，继续尝试构建..."

echo "🔨 构建Debug版本..."
./gradlew assembleDebug --no-daemon --stacktrace

echo "🔨 构建Release版本..."
./gradlew assembleRelease --no-daemon --stacktrace

echo ""
echo "✅ Android构建完成！"
echo "输出文件："
echo "  Debug:   $(find app/build/outputs/apk/debug -name "*.apk" | head -1)"
echo "  Release: $(find app/build/outputs/apk/release -name "*.apk" | head -1)"

cd ..

# 创建发布目录
RELEASE_DIR="release-v0.0.1"
mkdir -p "$RELEASE_DIR"

# 复制APK文件
echo ""
echo "📦 复制APK文件到发布目录..."
cp android/app/build/outputs/apk/debug/*.apk "$RELEASE_DIR/" 2>/dev/null || true
cp android/app/build/outputs/apk/release/*.apk "$RELEASE_DIR/" 2>/dev/null || true

echo ""
echo "🎉 手动构建完成！"
echo "================="
echo "发布文件位于: $RELEASE_DIR/"
echo ""
echo "下一步操作："
echo "1. 测试APK文件"
echo "2. 运行: ./scripts/manual-release.sh 创建GitHub Release"
echo "3. 或手动上传到GitHub Releases页面" 