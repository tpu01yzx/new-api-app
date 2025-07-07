#!/bin/bash

# New API Manager - 使用curl的手动发布脚本
# 不依赖GitHub CLI，直接使用GitHub API

set -e

echo "🚀 New API Manager - curl版本发布脚本"
echo "====================================="

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

# 检查GitHub Token
if [ -z "$GITHUB_TOKEN" ]; then
    echo ""
    echo "⚠️  需要GitHub Personal Access Token"
    echo ""
    echo "请按以下步骤获取Token："
    echo "1. 访问: https://github.com/settings/tokens"
    echo "2. 点击 'Generate new token (classic)'"
    echo "3. 选择权限: repo (完整权限)"
    echo "4. 复制生成的token"
    echo ""
    read -p "请输入GitHub Token: " GITHUB_TOKEN
    
    if [ -z "$GITHUB_TOKEN" ]; then
        echo "❌ 未提供Token，无法继续"
        exit 1
    fi
fi

# GitHub仓库信息
REPO_OWNER="tpu01yzx"
REPO_NAME="new-api-app"
API_BASE="https://api.github.com"

echo ""
echo "🚀 开始创建GitHub Release..."

# 发布说明
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

# 创建Release
echo "📝 创建Release..."
RELEASE_RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "$API_BASE/repos/$REPO_OWNER/$REPO_NAME/releases" \
  -d "{
    \"tag_name\": \"$TAG_NAME\",
    \"target_commitish\": \"main\",
    \"name\": \"$RELEASE_NAME\",
    \"body\": $(echo "$RELEASE_NOTES" | jq -R -s .),
    \"draft\": false,
    \"prerelease\": false
  }")

# 提取Release ID
RELEASE_ID=$(echo "$RELEASE_RESPONSE" | jq -r '.id')

if [ "$RELEASE_ID" = "null" ] || [ -z "$RELEASE_ID" ]; then
    echo "❌ 创建Release失败"
    echo "错误信息: $(echo "$RELEASE_RESPONSE" | jq -r '.message // .errors[0].message // "未知错误"')"
    exit 1
fi

echo "✅ Release创建成功，ID: $RELEASE_ID"

# 上传APK文件（只上传匹配版本号的文件）
echo ""
echo "📤 上传版本 $VERSION_NUMBER 的APK文件..."

for apk_file in $(find "$RELEASE_DIR" -name "$APK_PATTERN"); do
    if [ -f "$apk_file" ]; then
        filename=$(basename "$apk_file")
        echo "⬆️  上传: $filename"
        
        curl -s -X POST \
          -H "Authorization: token $GITHUB_TOKEN" \
          -H "Content-Type: application/vnd.android.package-archive" \
          --data-binary "@$apk_file" \
          "$API_BASE/repos/$REPO_OWNER/$REPO_NAME/releases/$RELEASE_ID/assets?name=$filename"
        
        echo "✅ $filename 上传完成"
    fi
done

echo ""
echo "🎉 发布完成！"
echo "🔗 查看发布: https://github.com/$REPO_OWNER/$REPO_NAME/releases/tag/$TAG_NAME"
echo ""
echo "💡 提示: 如果上传失败，可以手动访问GitHub页面上传APK文件" 