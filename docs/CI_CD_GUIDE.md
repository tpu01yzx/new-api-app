# 🚀 CI/CD 构建指南

## 📋 概述

New API Manager 使用 GitHub Actions 实现跨平台自动化构建，支持 Android、iOS 和 鸿蒙平台。

## 🔧 构建工作流

### 1. 🤖 Android 构建 (`android.yml`)

**触发条件:**
- Push 到 main 分支
- Pull Request 到 main 分支
- 手动触发

**构建环境:** Ubuntu Latest
**输出:** `NewApi-debug-v1.0.apk` + `NewApi-release-v1.0.apk`

```bash
# 本地测试构建命令
cd android
./gradlew assembleDebug assembleRelease
```

### 2. 🍎 iOS 构建 (`ios.yml`)

**触发条件:**
- Push 到 main 分支
- Pull Request 到 main 分支  
- 手动触发

**构建环境:** macOS Latest
**输出:** `NewApiApp.xcarchive`

```bash
# 本地构建命令（需要 macOS + Xcode）
cd ios
pod install
xcodebuild -workspace NewApiApp.xcworkspace -scheme NewApiApp archive
```

### 3. 🦋 鸿蒙构建 (`harmonyos.yml`)

**触发条件:** 手动触发
**构建环境:** 准备中
**输出:** 构建说明文档

### 4. 🚀 多平台构建 (`build-all.yml`)

**触发条件:**
- Push 到 main 分支
- 创建版本标签 (`v*`)
- 手动触发

**功能:**
- 并行构建 Android 和 iOS
- 自动创建 GitHub Release
- 上传所有构建产物

## 📱 使用方法

### 手动触发构建

1. **进入仓库的 Actions 页面**
   ```
   https://github.com/tpu01yzx/new-api-app/actions
   ```

2. **选择要运行的工作流:**
   - `🤖 Build Android` - 仅构建 Android
   - `🍎 Build iOS` - 仅构建 iOS  
   - `🚀 Build All Platforms` - 构建所有平台

3. **点击 "Run workflow" 按钮**

### 创建发布版本

1. **创建版本标签:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **自动构建和发布:**
   - GitHub Actions 自动触发 `build-all.yml`
   - 构建所有平台的安装包
   - 创建 GitHub Release
   - 上传构建产物

## 📦 构建产物

### Android
- **位置:** `android/app/build/outputs/apk/`
- **文件:**
  - `NewApi-debug-v1.0.apk` (117MB) - 开发测试版
  - `NewApi-release-v1.0.apk` (52MB) - 生产发布版

### iOS
- **位置:** `ios/`
- **文件:**
  - `NewApiApp.xcarchive` - iOS Archive
  - 需要 Xcode 进行签名和导出 IPA

### 鸿蒙
- **状态:** 待环境配置
- **要求:** DevEco Studio 4.0+ + HarmonyOS SDK

## 🔐 环境配置

### GitHub Secrets

目前使用默认配置，如需签名发布版本，请配置：

```
ANDROID_KEYSTORE_FILE     # Android 签名密钥文件
ANDROID_KEYSTORE_PASSWORD # 密钥库密码
ANDROID_KEY_ALIAS         # 密钥别名
ANDROID_KEY_PASSWORD      # 密钥密码

IOS_CERTIFICATE          # iOS 开发者证书
IOS_PROVISIONING_PROFILE  # iOS 描述文件
```

### 本地环境

**Android:**
- Java JDK 17+
- Android SDK
- Gradle 8.14+

**iOS:**
- macOS 12+
- Xcode 14+
- CocoaPods 1.16+

**鸿蒙:**
- DevEco Studio 4.0+
- HarmonyOS SDK

## 📊 构建状态监控

### 构建徽章

```markdown
![Android Build](https://github.com/tpu01yzx/new-api-app/workflows/Build%20Android/badge.svg)
![iOS Build](https://github.com/tpu01yzx/new-api-app/workflows/Build%20iOS/badge.svg)
```

### 构建日志

1. **查看构建进度:**
   - 进入 Actions 页面
   - 点击相应的工作流运行

2. **下载构建产物:**
   - 构建完成后在 Artifacts 部分下载
   - 产物保留 30 天

## 🛠️ 故障排除

### 常见问题

1. **Android 构建失败**
   ```
   解决方案：检查 Gradle 配置和依赖版本
   ```

2. **iOS 构建失败**
   ```
   解决方案：确认 Xcode 版本和 CocoaPods 依赖
   ```

3. **依赖安装失败**
   ```
   解决方案：清理缓存重新安装
   npm ci --cache /tmp/.npm
   ```

### 调试命令

```bash
# 本地调试 Android 构建
cd android && ./gradlew clean assembleDebug --stacktrace --info

# 本地调试 iOS 构建  
cd ios && pod install --verbose && xcodebuild -list

# 检查项目依赖
npm audit && npm test
```

## 📋 最佳实践

1. **分支策略**
   - main 分支触发完整构建
   - feature 分支触发测试构建

2. **版本管理**
   - 使用语义化版本号 (v1.0.0)
   - 标签触发正式发布

3. **构建优化**
   - 并行构建减少等待时间
   - 缓存依赖提高构建速度
   - 分离 Debug/Release 构建

---

**构建系统状态:** 🟢 Android Ready, 🟡 iOS Ready, 🔵 HarmonyOS Preparing  
**最后更新:** 2024年7月6日  
**维护者:** New API Manager Team 