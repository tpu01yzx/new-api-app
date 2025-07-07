#!/bin/bash

# New API Manager - 构建问题修复脚本
# 解决React Native常见的构建问题

set -e

echo "🔧 New API Manager - 构建问题修复脚本"
echo "======================================"

echo "💡 正在修复常见的构建问题..."

# 1. 清理React Native缓存
echo ""
echo "1️⃣ 清理React Native缓存..."
echo "🧹 清理Metro缓存..."
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-* 2>/dev/null || true

# 2. 清理项目依赖
echo ""
echo "2️⃣ 清理项目依赖..."
echo "🗑️ 删除node_modules..."
rm -rf node_modules

echo "📦 重新安装依赖..."
npm ci

# 3. 清理Android构建缓存
echo ""
echo "3️⃣ 清理Android构建缓存..."
cd android

echo "🧹 清理Gradle缓存..."
./gradlew clean 2>/dev/null || true
rm -rf app/.cxx 2>/dev/null || true
rm -rf app/build 2>/dev/null || true
rm -rf .gradle 2>/dev/null || true

echo "🔄 重新生成代码..."
./gradlew generateCodegenArtifactsFromSchema 2>/dev/null || echo "⚠️ 代码生成跳过"

cd ..

echo ""
echo "✅ 修复完成！"
echo ""
echo "📋 下一步操作："
echo "1. 运行: ./scripts/manual-build.sh 重新构建"
echo "2. 或手动构建: cd android && ./gradlew assembleRelease"
echo ""
echo "💡 如果仍有问题，尝试："
echo "   - 重启电脑"
echo "   - 检查Android SDK环境变量"
echo "   - 更新React Native依赖" 