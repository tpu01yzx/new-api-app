# New API Manager

[![Android Build](https://github.com/tpu01yzx/new-api-app/workflows/Build%20Android/badge.svg)](https://github.com/tpu01yzx/new-api-app/actions)
[![iOS Build](https://github.com/tpu01yzx/new-api-app/workflows/Build%20iOS/badge.svg)](https://github.com/tpu01yzx/new-api-app/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/tpu01yzx/new-api-app/releases)

一个跨平台移动应用，用于统一监控和管理多个 [new-api](https://github.com/Calcium-Ion/new-api) 实例。

## 📱 支持平台

- **🤖 Android** 7.0+ (API 24) - ✅ **现已发布**
- **🍎 iOS** 11.0+ - 🔵 开发中
- **🦋 鸿蒙** NEXT - 🔵 规划中

## 🎯 项目特性

### 📊 监控管理
- ✅ **多实例管理** - 添加/删除多个new-api实例
- ✅ **实时监控** - 系统状态、健康检查、版本信息
- ✅ **资源统计** - KEY数量、用户数量、模型支持
- ✅ **活动追踪** - 最近访问记录、在线用户监控

### 🎨 用户体验
- ✅ **现代化UI** - Material Design设计规范
- ✅ **响应式布局** - 适配各种屏幕尺寸
- ✅ **智能降级** - API失败时自动切换模拟数据
- ✅ **离线支持** - 本地数据缓存机制

### 🛡️ 技术保障
- ✅ **类型安全** - 100% TypeScript覆盖
- ✅ **测试完整** - 单元测试全覆盖
- ✅ **代码规范** - ESLint + Prettier
- ✅ **手动构建** - 本地构建脚本完整

## 🚀 快速开始

### 📥 下载安装包

#### 🤖 Android (现已发布)
1. 访问 [Releases](https://github.com/tpu01yzx/new-api-app/releases/latest) 页面
2. 下载 `NewApi-v0.0.1-release.apk` (52MB) - **推荐**
3. 下载 `NewApi-v0.0.1-debug.apk` (116MB) - 调试版
4. 在Android设备上启用"未知来源安装"并安装APK

#### 🍎 iOS (开发中)
- 计划在v0.2.0版本发布
- 将提供TestFlight测试版本
- 敬请期待...

### 🔧 本地开发

#### 环境要求
- **Node.js** 18+
- **React Native CLI** 19+
- **Android**: Java JDK 17 + Android SDK
- **iOS**: macOS + Xcode 14+ + CocoaPods

#### 安装步骤

```bash
# 1. 克隆项目
git clone --recursive git@github.com:tpu01yzx/new-api-app.git
cd new-api-app

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm start

# 4. 运行应用
# Android:
npm run android

# iOS (仅macOS):
cd ios && pod install && cd ..
npm run ios
```

## 🔧 构建部署

### 📱 当前发布状态

- **✅ v0.0.1 Android版本** - 已发布，可直接下载
- **🔵 iOS版本** - 开发中，预计v0.2.0发布
- **🔵 鸿蒙版本** - 规划中，预计v0.3.0发布

### 构建和发布

由于GitHub Actions费用限制，目前采用手动构建方式：

#### 🔧 一键构建
```bash
# 1. 自动化构建脚本
chmod +x scripts/manual-build.sh
./scripts/manual-build.sh

# 2. 版本号检查（可选）
./scripts/version-check.sh

# 3. 发布（根据网络环境选择）
# 网络受限环境（推荐）- 仅使用SSH
chmod +x scripts/manual-release-ssh-only.sh
./scripts/manual-release-ssh-only.sh

# 网络正常环境 - 需要GitHub API访问
export GITHUB_TOKEN="your_token_here"
./scripts/manual-release-ssh.sh
```

#### 📋 版本号管理
- **统一版本号**: Git标签 `v0.0.1` ↔ Android `versionName "0.0.1"`
- **文件命名**: `NewApi-release-v0.0.1.apk`, `NewApi-debug-v0.0.1.apk`
- **自动过滤**: 发布时只处理包含指定版本号的文件

#### 📋 手动构建
```bash
# Android
cd android
./gradlew assembleRelease

# iOS (需要macOS)
cd ios
xcodebuild -workspace NewApiApp.xcworkspace -scheme NewApiApp archive
```

#### 🔄 CI/CD状态
- **GitHub Actions**: 已暂时禁用 (费用限制)
- **工作流备份**: `.github/workflows-disabled/`
- **详细指南**: [手动构建文档](docs/MANUAL_BUILD.md)

## 📖 使用说明

### 添加API实例

1. 打开应用，点击右上角 **"+"** 按钮
2. 填写实例信息：
   - **名称**: 自定义实例名称
   - **URL**: new-api实例地址 (如: `https://api.example.com`)
   - **Token**: 访问令牌
3. 点击 **"测试连接"** 验证配置
4. 保存实例配置

### 查看监控数据

- **系统状态**: 健康检查、版本、运行时间
- **资源统计**: KEY/用户/模型数量
- **活动监控**: 最近访问、在线用户
- **访问记录**: IP地址、调用模型、使用频率

## 🏗️ 项目架构

### 技术栈
- **框架**: React Native 0.80.1
- **语言**: TypeScript 5.0.4
- **导航**: React Navigation 7
- **状态管理**: React Hooks + Context
- **存储**: AsyncStorage
- **构建**: Gradle (Android) + Xcode (iOS)

### 目录结构
```
new-api-app/
├── src/                    # 源代码
│   ├── components/         # 可复用组件
│   ├── screens/           # 页面组件
│   ├── services/          # API服务层
│   ├── types/             # TypeScript类型
│   ├── utils/             # 工具函数
│   └── constants/         # 常量配置
├── android/               # Android原生代码
├── ios/                   # iOS原生代码
├── .github/workflows/     # GitHub Actions
└── docs/                  # 项目文档
```

## 🧪 测试

```bash
# 运行所有测试
npm test

# 测试覆盖率
npm run test:coverage

# TypeScript类型检查
npx tsc --noEmit

# 代码规范检查
npm run lint
```

## 📚 文档

- [🌐 网络限制指南](docs/NETWORK_RESTRICTIONS.md) - 网络受限环境完整解决方案 ⭐
- [🔐 SSH发布指南](docs/SSH_RELEASE_GUIDE.md) - SSH认证发布详细指南
- [📱 手动构建](docs/MANUAL_BUILD.md) - 手动构建和发布指南
- [📖 构建说明](BUILD.md) - 详细构建步骤
- [📋 发布说明](RELEASE_NOTES.md) - 版本发布信息
- [📊 项目总结](PROJECT_SUMMARY.md) - 开发历程
- [🔧 GitHub Actions](/.github/workflows-disabled/) - CI/CD备份配置

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 创建 Pull Request

## 📝 许可证

本项目使用 [MIT 许可证](LICENSE)。

## 🔗 相关链接

- [new-api 项目](https://github.com/Calcium-Ion/new-api) - 后端API服务
- [React Native 官网](https://reactnative.dev/) - 技术框架
- [Material Design](https://material.io/design) - 设计规范

---

**项目状态**: 🟢 Active Development  
**维护者**: [@tpu01yzx](https://github.com/tpu01yzx)  
**最后更新**: 2024年7月6日
