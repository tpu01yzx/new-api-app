# 📱 手动构建和发布指南

由于GitHub Actions费用限制，我们暂时采用手动构建和发布的方式。本文档详细说明了如何在本地环境中构建和发布New API Manager。

## 🚀 快速开始

### 一键构建
```bash
chmod +x scripts/manual-build.sh
./scripts/manual-build.sh
```

### 一键发布
```bash
chmod +x scripts/manual-release.sh
./scripts/manual-release.sh
```

## 📋 详细步骤

### 1. 环境准备

#### 必需环境
- **Node.js** v18+ 
- **Java** OpenJDK 17+
- **Android SDK** (通过Android Studio或命令行工具)
- **Git** (用于版本管理)

#### 可选环境
- **GitHub CLI** (用于自动创建Release)

#### 环境变量设置
```bash
# Android SDK
export ANDROID_HOME=/path/to/android-sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
```

### 2. 项目准备

#### 克隆项目
```bash
git clone git@github.com:tpu01yzx/new-api-app.git
cd new-api-app
```

#### 安装依赖
```bash
npm ci
```

### 3. Android构建

#### 方法一：使用自动化脚本（推荐）
```bash
./scripts/manual-build.sh
```

#### 方法二：手动构建
```bash
cd android
chmod +x gradlew

# 清理之前的构建
./gradlew clean

# 构建Debug版本
./gradlew assembleDebug

# 构建Release版本
./gradlew assembleRelease
```

#### 构建输出
构建完成后，APK文件位于：
- Debug: `android/app/build/outputs/apk/debug/NewApi-debug-v1.0.apk`
- Release: `android/app/build/outputs/apk/release/NewApi-release-v1.0.apk`

### 4. 发布到GitHub

#### 方法一：使用自动化脚本（推荐）
```bash
# 前提：已安装GitHub CLI并完成认证
gh auth login

# 执行发布脚本
./scripts/manual-release.sh
```

#### 方法二：手动发布
1. 访问 [GitHub Releases页面](https://github.com/tpu01yzx/new-api-app/releases/new)
2. 填写以下信息：
   - **Tag**: `v0.0.1`
   - **Title**: `New API Manager v0.0.1 - Android首发版`
   - **Body**: 参考 `scripts/manual-release.sh` 中的发布说明
3. 上传APK文件：
   - `NewApi-release-v1.0.apk` (推荐)
   - `NewApi-debug-v1.0.apk` (可选)
4. 点击 "Publish release"

## 🔧 构建配置

### Gradle配置优化
项目已配置了以下优化：

#### 网络加速
```gradle
// 使用阿里云镜像
maven { url 'https://maven.aliyun.com/repository/google' }
maven { url 'https://maven.aliyun.com/repository/central' }
```

#### 构建优化
```gradle
android {
    compileSdk 35
    
    defaultConfig {
        minSdk 24
        targetSdk 35
    }
    
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### APK文件命名
项目配置了自定义APK命名：
- Debug: `NewApi-debug-v1.0.apk`
- Release: `NewApi-release-v1.0.apk`

## 🐛 故障排除

### 常见问题

#### 1. Gradle构建失败
```bash
# 清理重新构建
cd android
./gradlew clean
./gradlew assembleRelease --stacktrace
```

#### 2. 网络问题
确保gradle.properties中配置了镜像源：
```properties
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
```

#### 3. Java版本问题
```bash
# 检查Java版本
java -version

# 确保使用Java 17
export JAVA_HOME=/path/to/java17
```

#### 4. Android SDK路径问题
```bash
# 设置ANDROID_HOME
export ANDROID_HOME=/path/to/android-sdk

# 检查SDK路径
echo $ANDROID_HOME
```

### 构建日志
如果遇到问题，查看详细构建日志：
```bash
cd android
./gradlew assembleRelease --stacktrace --info
```

#### 5. React Native代码生成问题
```bash
# 如果遇到AsyncStorage等代码生成错误
./scripts/fix-build-issues.sh

# 或手动修复：
rm -rf node_modules android/app/.cxx android/app/build
npm ci
cd android && ./gradlew generateCodegenArtifactsFromSchema && cd ..
```

## 📊 构建产物

### 文件大小对比
- **Debug APK**: ~117MB (包含调试信息)
- **Release APK**: ~52MB (已压缩优化)

### 版本信息
- **Version Code**: 1
- **Version Name**: 1.0
- **Min SDK**: API 24 (Android 7.0)
- **Target SDK**: API 35

## 🔄 未来计划

### CI/CD恢复
当GitHub Actions额度恢复时，可以重新启用自动化构建：
```bash
# 恢复工作流
mv .github/workflows-disabled/*.yml .github/workflows/
```

### 多平台支持
- **iOS**: 需要macOS环境和Xcode
- **HarmonyOS**: 需要DevEco Studio环境

## 📚 相关文档

- [项目README](../README.md)
- [发布说明](../RELEASE_NOTES.md)
- [快速发布指南](../scripts/quick-release.sh)
- [GitHub Actions配置](../.github/workflows-disabled/)

---

💡 **提示**: 手动构建虽然步骤较多，但确保了构建过程的透明度和可控性。 