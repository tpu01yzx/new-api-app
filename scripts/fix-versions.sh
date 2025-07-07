#!/bin/bash

# New API Manager - 版本兼容性修复
# 修复React Native, React, AsyncStorage版本冲突

set -e

echo "📦 New API Manager - 版本兼容性修复"
echo "=================================="
echo "⚠️  这将修改package.json中的依赖版本"

read -p "是否继续？(y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 操作已取消"
    exit 0
fi

echo ""
echo "📋 当前版本问题："
echo "   React: 19.1.0 (太新，与RN 0.80.1不兼容)"
echo "   React Native: 0.80.1 (较老版本)"
echo "   AsyncStorage: 2.2.0 (可能不兼容)"

echo ""
echo "🔧 修复方案选择："
echo "1. 降级React到兼容版本 (推荐)"
echo "2. 升级React Native到最新版本"

read -p "选择方案 (1/2): " -n 1 -r
echo

if [[ $REPLY == "1" ]]; then
    echo ""
    echo "📉 方案1: 降级React到兼容版本..."
    
    # 备份package.json
    cp package.json package.json.backup
    
    # 修改React版本到兼容版本
    sed -i 's/"react": "19.1.0"/"react": "18.3.1"/' package.json
    sed -i 's/"@types\/react": "\^19.1.0"/"@types\/react": "^18.3.12"/' package.json
    sed -i 's/"react-test-renderer": "19.1.0"/"react-test-renderer": "18.3.1"/' package.json
    sed -i 's/"@types\/react-test-renderer": "\^19.1.0"/"@types\/react-test-renderer": "^18.3.0"/' package.json
    
    # 降级AsyncStorage到更兼容的版本
    sed -i 's/"@react-native-async-storage\/async-storage": "\^2.2.0"/"@react-native-async-storage\/async-storage": "^1.24.0"/' package.json
    
    echo "✅ 已修改package.json到兼容版本"
    
elif [[ $REPLY == "2" ]]; then
    echo ""
    echo "📈 方案2: 升级React Native..."
    echo "⚠️  这需要更多手动工作，建议参考RN升级指南"
    
    # 备份package.json
    cp package.json package.json.backup
    
    # 升级到RN 0.81+
    sed -i 's/"react-native": "0.80.1"/"react-native": "0.81.2"/' package.json
    sed -i 's/"@react-native\/new-app-screen": "0.80.1"/"@react-native\/new-app-screen": "0.81.2"/' package.json
    
    echo "✅ 已升级React Native版本"
    echo "⚠️  注意：可能需要额外的配置修改"
    
else
    echo "❌ 无效选择，操作已取消"
    exit 1
fi

echo ""
echo "🗑️ 清理并重新安装依赖..."
rm -rf node_modules package-lock.json
npm install

echo ""
echo "✅ 版本修复完成！"
echo ""
echo "📋 下一步操作："
echo "1. 运行: ./scripts/manual-build.sh"
echo "2. 如果还有问题，运行: ./scripts/fix-build-issues.sh"
echo ""
echo "💾 备份文件: package.json.backup" 