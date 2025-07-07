# 🌐 网络限制环境使用指南

本文档专门针对无法访问HTTPS GitHub的网络受限环境，提供完整的解决方案。

## 🚨 网络限制说明

### 当前环境限制
- ❌ 无法访问 `https://*.github.com`
- ❌ 无法使用GitHub API
- ❌ 无法访问GitHub网页界面
- ✅ 可以通过SSH访问 `git@github.com`
- ✅ 可以进行Git操作（push/pull/clone）

### 影响的功能
- ❌ GitHub CLI无法正常工作
- ❌ 无法直接上传Release文件
- ❌ 无法使用GitHub网页创建Release
- ✅ 可以创建和推送Git标签
- ✅ 可以提交和推送代码

## 🛠️ 解决方案

### 1. 构建APK（无网络依赖）
```bash
# 本地构建，完全无网络依赖
./scripts/manual-build.sh
```

### 2. 创建Git标签和Release（仅SSH）
```bash
# 使用纯SSH方案
./scripts/manual-release-ssh-only.sh
```

**此脚本会完成：**
- ✅ 创建Git标签 `v0.0.1`
- ✅ 推送代码到GitHub（SSH）
- ✅ 推送标签到GitHub（SSH）
- ✅ GitHub自动创建Release（但无文件）

### 3. 上传APK文件（需要其他环境）
由于无法直接上传文件，需要以下步骤：

#### 方案A：使用其他网络环境
1. 将APK文件传输到能访问GitHub的环境
2. 手动上传到GitHub Release页面

#### 方案B：使用第三方存储
1. 上传APK到云存储或其他平台
2. 在Release说明中提供下载链接

## 📋 完整发布流程

### 步骤1：在受限环境中构建和发布
```bash
# 1. 构建APK
./scripts/manual-build.sh

# 2. 创建Git标签并推送
./scripts/manual-release-ssh-only.sh

# 3. 复制APK文件到外部存储
cp release-v0.0.1/*.apk /path/to/external/storage/
```

### 步骤2：在正常网络环境中上传文件
```bash
# 1. 访问GitHub Release页面
# https://github.com/tpu01yzx/new-api-app/releases/tag/v0.0.1

# 2. 点击 "Edit release"

# 3. 上传APK文件：
#    - NewApi-release-v1.0.apk (52MB)
#    - NewApi-debug-v1.0.apk (117MB)

# 4. 点击 "Update release"
```

## 🔧 工具配置

### Git配置（必需）
```bash
# 配置Git SSH远程地址
git remote set-url origin git@github.com:tpu01yzx/new-api-app.git

# 验证配置
git remote -v
# 应该显示：origin  git@github.com:tpu01yzx/new-api-app.git (fetch)
#           origin  git@github.com:tpu01yzx/new-api-app.git (push)
```

### SSH密钥配置（一次性）
```bash
# 生成SSH密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 启动SSH代理
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 查看公钥（需要添加到GitHub）
cat ~/.ssh/id_ed25519.pub

# 测试连接
ssh -T git@github.com
```

## 📁 文件传输方案

### 方案1：云存储中转
```bash
# 在受限环境中
scp release-v0.0.1/*.apk user@cloud-server:/tmp/

# 在正常网络环境中
scp user@cloud-server:/tmp/*.apk ./
# 然后手动上传到GitHub
```

### 方案2：本地存储设备
```bash
# 复制到U盘或移动硬盘
cp release-v0.0.1/*.apk /media/usb-drive/

# 在其他环境中读取并上传
```

### 方案3：内网文件服务器
```bash
# 上传到内网服务器
rsync -av release-v0.0.1/*.apk internal-server:/shared/releases/

# 从内网服务器下载（在有外网的机器上）
```

## 🔍 故障排除

### SSH连接问题
```bash
# 详细测试SSH连接
ssh -vT git@github.com

# 检查SSH配置
cat ~/.ssh/config

# 重新生成SSH密钥
rm ~/.ssh/id_ed25519*
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### Git推送问题
```bash
# 检查远程仓库
git remote -v

# 强制推送（谨慎使用）
git push --force-with-lease origin main

# 推送标签
git push origin --tags
```

### 文件大小限制
```bash
# 检查APK文件大小
du -h release-v0.0.1/*.apk

# 如果文件太大，考虑压缩
zip -9 release-v0.0.1.zip release-v0.0.1/*.apk
```

## 💡 最佳实践

### 1. 自动化工作流
```bash
# 创建一键构建+发布脚本
cat > build-and-release.sh << 'EOF'
#!/bin/bash
set -e
echo "🔨 构建APK..."
./scripts/manual-build.sh

echo "🚀 创建Release..."
./scripts/manual-release-ssh-only.sh

echo "✅ 完成！请手动上传APK文件到GitHub"
echo "APK文件位置: release-v0.0.1/"
ls -lh release-v0.0.1/*.apk
EOF

chmod +x build-and-release.sh
```

### 2. 验证脚本
```bash
# 验证发布是否成功
git ls-remote --tags origin | grep v0.0.1
```

### 3. 文档更新
每次发布后更新项目文档，说明下载地址和安装方法。

## 📚 相关文档

- [SSH发布指南](SSH_RELEASE_GUIDE.md) - 详细的SSH配置和使用
- [手动构建指南](MANUAL_BUILD.md) - 完整的构建流程
- [发布模板](RELEASE_TEMPLATE.md) - GitHub Release内容模板

---

💡 **总结**: 虽然网络受限环境下无法直接完成完整的Release发布，但通过SSH + 手动文件上传的组合方案，仍然可以实现有效的版本发布管理。 