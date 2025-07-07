# 📦 创建GitHub Release v0.0.1 操作指南

## 🎯 目标
将本地构建的Android APK文件发布为v0.0.1版本，供用户下载。

## 📱 构建产物
- ✅ `android/app/build/outputs/apk/release/NewApi-release-v1.0.apk` (52MB) - 主要发布版本
- ✅ `android/app/build/outputs/apk/debug/NewApi-debug-v1.0.apk` (116MB) - 调试版本

## 🚀 GitHub Release 创建步骤

### 1. 创建Git标签
```bash
# 创建v0.0.1标签
git tag -a v0.0.1 -m "🎉 New API Manager v0.0.1 首次发布

📱 Features:
- 多实例管理
- 实时监控
- Material Design UI
- TypeScript类型安全

🤖 Android版本就绪，iOS/鸿蒙版本开发中"

# 推送标签到远程仓库
git push origin v0.0.1
```

### 2. 前往GitHub创建Release

1. **访问Release页面**
   ```
   https://github.com/tpu01yzx/new-api-app/releases
   ```

2. **点击 "Create a new release"**

3. **填写Release信息**
   - **Tag**: `v0.0.1` (选择刚创建的标签)
   - **Title**: `🎉 New API Manager v0.0.1 - Android版本首发`
   - **Description**: 复制 `RELEASE_NOTES.md` 的内容

4. **上传APK文件**
   - 拖拽或点击上传以下文件：
     - `NewApi-release-v1.0.apk` (重命名为 `NewApi-v0.0.1-release.apk`)
     - `NewApi-debug-v1.0.apk` (重命名为 `NewApi-v0.0.1-debug.apk`)

5. **发布设置**
   - ☑️ 勾选 "Set as the latest release"
   - ☐ 不勾选 "Set as a pre-release"

6. **点击 "Publish release"**

## 📝 Release描述模板

```markdown
# 🎉 New API Manager v0.0.1 发布

## 📱 下载链接

### Android APK
- **推荐**: NewApi-v0.0.1-release.apk (52MB) - 生产环境版本
- **调试**: NewApi-v0.0.1-debug.apk (116MB) - 开发测试版本

## 🎯 版本特性

### 📊 核心功能
- ✅ **多实例管理** - 支持添加/删除多个new-api实例
- ✅ **实时监控** - 系统状态、健康检查、版本信息
- ✅ **资源统计** - KEY数量、用户数量、模型支持情况
- ✅ **活动追踪** - 最近访问记录、在线用户监控
- ✅ **智能降级** - API失败时自动切换模拟数据

### 🎨 用户体验
- ✅ **现代化UI** - Material Design设计规范
- ✅ **响应式布局** - 适配各种Android设备
- ✅ **离线支持** - 本地数据缓存
- ✅ **错误恢复** - 友好的错误提示

### 🛡️ 技术亮点
- ✅ **TypeScript** - 100%类型安全
- ✅ **React Native 0.80** - 跨平台框架
- ✅ **测试覆盖** - 单元测试全通过
- ✅ **代码规范** - ESLint + Prettier

## 📱 系统要求
- **最低版本**: Android 7.0 (API 24)
- **推荐版本**: Android 10+
- **权限需求**: 网络访问权限

## 🚀 安装说明
1. 下载APK文件
2. 在Android设备上启用"未知来源安装"
3. 点击APK文件进行安装
4. 首次启动时允许网络权限

## 📖 使用指南
1. 打开应用，点击右上角"+"按钮
2. 填写new-api实例信息
3. 点击"测试连接"验证配置
4. 保存后即可开始监控

## 🔄 路线图
- **v0.1.0**: 图表可视化、推送通知
- **v0.2.0**: iOS版本支持
- **v0.3.0**: 鸿蒙系统支持

## 📞 支持
- [GitHub Issues](https://github.com/tpu01yzx/new-api-app/issues)
- [讨论区](https://github.com/tpu01yzx/new-api-app/discussions)

感谢使用 New API Manager！🎊
```

## 🔍 验证发布

### 发布后检查
1. **确认下载链接有效**
   - Release页面APK文件可正常下载
   - 文件大小正确（52MB和116MB）

2. **测试安装**
   - 在测试设备上安装APK
   - 验证应用正常启动
   - 测试基本功能

3. **更新文档**
   - README.md中的下载链接
   - 项目状态徽章

## 📊 发布统计

### 预期指标
- **下载量**: 关注前7天下载数据
- **用户反馈**: 监控GitHub Issues
- **评分**: 收集用户体验反馈

### 推广计划
- 社交媒体分享
- 技术社区发布
- 文档网站更新

---

**注意**: 暂时跳过iOS和鸿蒙版本，专注Android版本的稳定发布。 