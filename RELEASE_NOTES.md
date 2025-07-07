# 🎉 New API Manager v0.0.1 发布

## 📱 下载链接

### Android APK
- **推荐**: [NewApi-release-v1.0.apk](https://github.com/tpu01yzx/new-api-app/releases/download/v0.0.1/NewApi-release-v1.0.apk) (52MB)
  - 生产环境版本，已优化性能
  - 适合正式使用
  
- **调试版**: [NewApi-debug-v1.0.apk](https://github.com/tpu01yzx/new-api-app/releases/download/v0.0.1/NewApi-debug-v1.0.apk) (116MB)
  - 开发测试版本，包含调试信息
  - 适合问题排查

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

### Android
- **最低版本**: Android 7.0 (API 24)
- **推荐版本**: Android 10+ 
- **架构支持**: arm64-v8a, armeabi-v7a
- **权限需求**: 网络访问权限

### 硬件要求
- **内存**: 建议2GB+
- **存储**: 需要100MB可用空间
- **网络**: 需要互联网连接访问new-api实例

## 🚀 安装说明

### 下载安装
1. 从GitHub Release页面下载APK文件
2. 在Android设备上启用"未知来源安装"
3. 点击APK文件进行安装
4. 首次启动时允许网络权限

### 首次配置
1. 打开应用，点击右上角"+"按钮
2. 填写new-api实例信息：
   - **名称**: 自定义实例名称
   - **URL**: new-api实例地址
   - **Token**: 访问令牌
3. 点击"测试连接"验证配置
4. 保存后即可开始监控

## 📖 使用指南

### 添加API实例
```
实例名称: 我的API服务
服务地址: https://api.example.com
访问令牌: sk-xxxxxxxxxxxx
```

### 监控数据说明
- **系统状态**: 绿色表示正常，红色表示异常
- **资源统计**: 实时显示KEY、用户、模型数量
- **活动记录**: 显示最近的API调用情况
- **错误日志**: 记录系统异常和故障信息

## 🐛 已知问题

1. **网络连接**
   - 首次启动可能需要等待网络初始化
   - 建议在WiFi环境下使用以获得最佳体验

2. **数据刷新**
   - 数据每30秒自动刷新
   - 可手动下拉刷新获取最新数据

3. **兼容性**
   - 已测试Android 7-14版本
   - 部分老旧设备可能存在性能问题

## 🔄 更新计划

### v0.1.0 (计划中)
- 📊 图表数据可视化
- 📱 推送通知支持
- 🌙 深色主题模式
- 🍎 iOS版本支持

### v0.2.0 (规划中)
- 🦋 鸿蒙系统支持
- 👥 用户权限管理
- 📈 历史数据分析
- 🔧 高级配置选项

## 📞 技术支持

### 问题反馈
- **GitHub Issues**: [提交问题](https://github.com/tpu01yzx/new-api-app/issues)
- **邮件联系**: [技术支持邮箱]

### 开发文档
- [构建说明](BUILD.md)
- [API文档](docs/API.md)
- [贡献指南](CONTRIBUTING.md)

## 🙏 致谢

感谢以下项目和贡献者：
- [new-api](https://github.com/Calcium-Ion/new-api) - 后端API服务
- [React Native](https://reactnative.dev/) - 跨平台框架
- 所有测试用户和反馈贡献者

## 📝 许可证

本项目使用 [MIT 许可证](LICENSE)。

---

**🎊 感谢您使用 New API Manager！**

如有问题或建议，欢迎通过GitHub Issues反馈。

**下载统计**: 本版本发布时间: 2024年7月6日  
**开发团队**: New API Manager Team  
**项目地址**: https://github.com/tpu01yzx/new-api-app 