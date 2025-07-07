#!/bin/bash

# New API Manager - 绕过AsyncStorage构建问题
# 临时解决方案：创建缺失的目录和文件

set -e

echo "🔧 New API Manager - 绕过AsyncStorage构建问题"
echo "=============================================="

echo "📝 这是一个临时解决方案，创建缺失的AsyncStorage文件..."

# 创建缺失的AsyncStorage JNI目录
ASYNC_STORAGE_JNI_DIR="node_modules/@react-native-async-storage/async-storage/android/build/generated/source/codegen/jni"

echo "📁 创建AsyncStorage JNI目录..."
mkdir -p "$ASYNC_STORAGE_JNI_DIR"

# 创建基本的CMakeLists.txt
cat > "$ASYNC_STORAGE_JNI_DIR/CMakeLists.txt" << 'EOF'
# Placeholder CMakeLists.txt for AsyncStorage
cmake_minimum_required(VERSION 3.13)

# Create placeholder library to avoid linker errors
add_library(react_codegen_rnasyncstorage STATIC
  placeholder.cpp
)

target_include_directories(react_codegen_rnasyncstorage PUBLIC .)
EOF

# 创建占位符C++文件
cat > "$ASYNC_STORAGE_JNI_DIR/placeholder.cpp" << 'EOF'
// Placeholder implementation for AsyncStorage Codegen
// This is a temporary workaround for build issues

namespace facebook {
namespace react {

// Placeholder implementation
void asyncStoragePlaceholder() {
    // Empty placeholder function
}

} // namespace react
} // namespace facebook
EOF

echo "✅ 已创建AsyncStorage占位符文件"

# 清理Android构建缓存
echo "🧹 清理Android构建缓存..."
cd android
./gradlew clean
rm -rf app/.cxx 2>/dev/null || true
rm -rf app/build 2>/dev/null || true

echo ""
echo "✅ 绕过方案已应用！"
echo ""
echo "📋 现在尝试构建："
echo "./scripts/manual-build.sh"
echo ""
echo "⚠️  注意：这是临时解决方案，建议后续升级React Native版本" 