#!/bin/bash

# 🚀 New API Manager v0.0.1 快速发布脚本
# 此脚本将帮助您快速创建GitHub Release

set -e  # 遇到错误立即退出

echo "🎉 New API Manager v0.0.1 发布脚本"
echo "================================="

# 检查当前目录
if [ ! -f "package.json" ] || [ ! -d "android" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 检查APK文件是否存在
RELEASE_APK="android/app/build/outputs/apk/release/NewApi-release-v1.0.apk"
DEBUG_APK="android/app/build/outputs/apk/debug/NewApi-debug-v1.0.apk"

echo "📱 检查APK文件..."
if [ ! -f "$RELEASE_APK" ]; then
    echo "❌ 未找到Release APK: $RELEASE_APK"
    echo "请先运行: cd android && ./gradlew assembleRelease"
    exit 1
fi

if [ ! -f "$DEBUG_APK" ]; then
    echo "❌ 未找到Debug APK: $DEBUG_APK"
    echo "请先运行: cd android && ./gradlew assembleDebug"
    exit 1
fi

echo "✅ 找到Release APK: $(du -h "$RELEASE_APK" | cut -f1)"
echo "✅ 找到Debug APK: $(du -h "$DEBUG_APK" | cut -f1)"

# 创建发布目录
RELEASE_DIR="release-v0.0.1"
echo "📦 创建发布目录: $RELEASE_DIR"
mkdir -p "$RELEASE_DIR"

# 复制APK文件并重命名
echo "📋 准备发布文件..."
cp "$RELEASE_APK" "$RELEASE_DIR/NewApi-v0.0.1-release.apk"
cp "$DEBUG_APK" "$RELEASE_DIR/NewApi-v0.0.1-debug.apk"

echo "✅ 已复制: NewApi-v0.0.1-release.apk"
echo "✅ 已复制: NewApi-v0.0.1-debug.apk"

# 复制发布说明
cp "RELEASE_NOTES.md" "$RELEASE_DIR/"
echo "✅ 已复制: RELEASE_NOTES.md"

# 检查Git状态
echo "🔍 检查Git状态..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  警告: 工作目录有未提交的更改"
    echo "建议先提交所有更改后再发布"
    read -p "是否继续? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 发布已取消"
        exit 1
    fi
fi

# 创建Git标签
TAG_NAME="v0.0.1"
echo "🏷️  创建Git标签: $TAG_NAME"

if git tag -l | grep -q "$TAG_NAME"; then
    echo "⚠️  标签 $TAG_NAME 已存在"
    read -p "是否删除现有标签并重新创建? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git tag -d "$TAG_NAME"
        git push origin ":refs/tags/$TAG_NAME" 2>/dev/null || true
        echo "✅ 已删除现有标签"
    else
        echo "❌ 发布已取消"
        exit 1
    fi
fi

# 创建带注释的标签
git tag -a "$TAG_NAME" -m "🎉 New API Manager v0.0.1 首次发布

📱 Features:
- 多实例管理 - 支持添加/删除多个new-api实例
- 实时监控 - 系统状态、健康检查、版本信息  
- 资源统计 - KEY数量、用户数量、模型支持情况
- 活动追踪 - 最近访问记录、在线用户监控
- 智能降级 - API失败时自动切换模拟数据

🎨 UI/UX:
- Material Design 现代化界面
- 响应式布局适配各种设备
- 离线支持和数据缓存
- 友好的错误提示和恢复

🛡️ 技术:
- TypeScript 100%类型安全
- React Native 0.80 跨平台框架
- 单元测试全覆盖
- ESLint + Prettier 代码规范

📱 支持平台:
- ✅ Android 7.0+ (API 24) - 现已发布
- 🔵 iOS 11.0+ - 开发中 (v0.2.0)
- 🔵 鸿蒙 NEXT - 规划中 (v0.3.0)

🎯 系统要求:
- Android 7.0+ (API 24)
- 网络访问权限
- 建议2GB+内存"

echo "✅ 已创建标签: $TAG_NAME"

# 推送标签到远程仓库
echo "📤 推送标签到远程仓库..."
git push origin "$TAG_NAME"
echo "✅ 标签已推送到远程仓库"

# 显示发布信息
echo ""
echo "🎉 准备工作完成！"
echo "=================="
echo ""
echo "📁 发布文件位置: $RELEASE_DIR/"
echo "   ├── NewApi-v0.0.1-release.apk ($(du -h "$RELEASE_DIR/NewApi-v0.0.1-release.apk" | cut -f1))"
echo "   ├── NewApi-v0.0.1-debug.apk ($(du -h "$RELEASE_DIR/NewApi-v0.0.1-debug.apk" | cut -f1))"
echo "   └── RELEASE_NOTES.md"
echo ""
echo "🔗 下一步操作:"
echo "1. 访问: https://github.com/tpu01yzx/new-api-app/releases"
echo "2. 点击 'Create a new release'"
echo "3. 选择标签: $TAG_NAME"
echo "4. 填写标题: 🎉 New API Manager v0.0.1 - Android版本首发"
echo "5. 上传 $RELEASE_DIR/ 目录中的APK文件"
echo "6. 复制 RELEASE_NOTES.md 的内容作为描述"
echo "7. 勾选 'Set as the latest release'"
echo "8. 点击 'Publish release'"
echo ""
echo "📊 发布后记得:"
echo "- 测试APK下载和安装"
echo "- 监控下载统计和用户反馈"
echo "- 更新相关文档链接"
echo ""
echo "🎊 感谢您的使用！" 