# 🔐 SSH认证发布指南

本指南介绍如何使用SSH认证进行GitHub Release发布，避免网络限制和认证问题。

## 🚀 快速开始

### 1. 配置SSH密钥（一次性配置）

```bash
# 生成SSH密钥（如果还没有）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 添加到SSH代理
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 复制公钥到剪贴板
cat ~/.ssh/id_ed25519.pub
```

### 2. 添加SSH密钥到GitHub

1. 访问：https://github.com/settings/keys
2. 点击 "New SSH key"
3. 粘贴公钥内容
4. 点击 "Add SSH key"

### 3. 验证SSH连接

```bash
# 测试GitHub SSH连接
ssh -T git@github.com

# 应该看到类似输出：
# Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

### 4. 获取GitHub Token

1. 访问：https://github.com/settings/tokens/new
2. Token名称：`new-api-app-release`
3. 过期时间：90 days
4. 权限选择：
   - ✅ `repo` (完整仓库权限)
   - ✅ `workflow` 
   - ✅ `write:packages`
5. 点击 "Generate token"
6. 复制生成的token

### 5. 执行发布

#### 5.1 网络受限环境（推荐）

```bash
# 仅使用SSH，不需要Token或GitHub API
./scripts/manual-release-ssh-only.sh
```

**说明**：此方案仅使用Git和SSH，会创建Git标签并推送到GitHub。GitHub会自动创建Release，但APK文件需要在其他网络环境中手动上传。

#### 5.2 网络正常环境

```bash
# 设置Token环境变量
export GITHUB_TOKEN="your_token_here"

# 执行SSH认证发布
./scripts/manual-release-ssh.sh
```

## 📋 发布脚本对比

### 🥇 纯SSH脚本（强烈推荐 - 网络受限环境）
- **文件**: `scripts/manual-release-ssh-only.sh`
- **认证**: 仅SSH密钥
- **交互**: 最少交互（仅Git配置）
- **适用**: 网络受限、无法访问HTTPS GitHub
- **网络**: 仅需SSH访问 git@github.com
- **依赖**: Git + SSH（无需GitHub CLI/API）

```bash
./scripts/manual-release-ssh-only.sh
```

### 🥈 SSH + API脚本
- **文件**: `scripts/manual-release-ssh.sh`
- **认证**: SSH + Token环境变量
- **交互**: 无交互式操作
- **适用**: 网络正常、自动化部署
- **网络**: 需要GitHub API访问

```bash
export GITHUB_TOKEN="token"
./scripts/manual-release-ssh.sh
```

### 🥉 curl版本脚本
- **文件**: `scripts/manual-release-curl.sh`
- **认证**: Token环境变量
- **交互**: 无交互式操作
- **适用**: 不想用GitHub CLI但能访问API
- **网络**: 需要访问GitHub API

```bash
export GITHUB_TOKEN="token"
./scripts/manual-release-curl.sh
```

### 🆘 交互式脚本（备选）
- **文件**: `scripts/manual-release.sh`
- **认证**: SSH + 交互式Token输入
- **交互**: 可能需要输入Token
- **适用**: 手动发布、网络环境不确定
- **网络**: 中等网络要求

```bash
./scripts/manual-release.sh
```

## 🔧 故障排除

### SSH连接失败

```bash
# 检查SSH密钥
ls -la ~/.ssh/

# 测试SSH连接（详细输出）
ssh -vT git@github.com

# 重新生成SSH密钥
ssh-keygen -t ed25519 -C "your_email@example.com"
```

### GitHub CLI认证问题

```bash
# 清理认证配置
rm -rf ~/.config/gh

# 重新配置
gh config set git_protocol ssh
echo "$GITHUB_TOKEN" | gh auth login --with-token
```

### Token权限不足

确保Token具有以下权限：
- ✅ `repo` - 仓库访问
- ✅ `workflow` - Actions权限  
- ✅ `write:packages` - 包发布权限

### 网络连接问题

```bash
# 测试GitHub API连接
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user

# 测试SSH连接
ssh -T git@github.com
```

## 💡 使用技巧

### 1. 环境变量持久化

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
echo 'export GITHUB_TOKEN="your_token_here"' >> ~/.bashrc
source ~/.bashrc
```

### 2. 一键构建+发布

```bash
# 创建组合脚本
cat > build-and-release.sh << 'EOF'
#!/bin/bash
set -e
./scripts/manual-build.sh
./scripts/manual-release-ssh.sh
EOF

chmod +x build-and-release.sh
./build-and-release.sh
```

### 3. 验证发布结果

```bash
# 检查发布状态
gh release view v0.0.1

# 列出所有发布
gh release list

# 下载发布文件
gh release download v0.0.1
```

## 🛡️ 安全注意事项

1. **Token安全**：
   - 不要在代码中硬编码Token
   - 定期轮换Token
   - 使用最小权限原则

2. **SSH密钥安全**：
   - 使用密码保护私钥
   - 定期轮换SSH密钥
   - 不要分享私钥文件

3. **环境变量**：
   - 不要在公共环境中设置Token
   - 使用 `unset GITHUB_TOKEN` 清理

## 📚 相关文档

- [SSH密钥配置](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [GitHub Token创建](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub CLI文档](https://cli.github.com/manual/)
- [项目构建指南](MANUAL_BUILD.md)

## 🌐 网络受限环境专用指南

### 适用场景
- 无法访问 `https://*.github.com`
- 只能通过SSH访问 `git@github.com`
- 企业内网、防火墙限制环境

### 完整流程

#### 1. 一次性SSH配置
```bash
# 生成SSH密钥（如果没有）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 查看公钥（需要添加到GitHub）
cat ~/.ssh/id_ed25519.pub

# 测试SSH连接
ssh -T git@github.com
```

#### 2. 添加SSH密钥到GitHub
> **注意**：此步骤需要在能访问GitHub网页的环境中完成

1. 通过其他网络环境访问：https://github.com/settings/keys
2. 点击 "New SSH key"
3. 粘贴公钥内容
4. 保存

#### 3. 执行纯SSH发布
```bash
# 在受限网络环境中执行
chmod +x scripts/manual-release-ssh-only.sh
./scripts/manual-release-ssh-only.sh
```

#### 4. 手动上传APK文件
> **注意**：此步骤需要在能访问GitHub网页的环境中完成

1. 访问：https://github.com/tpu01yzx/new-api-app/releases/tag/v0.0.1
2. 点击 "Edit release"
3. 拖拽上传APK文件：
   - `NewApi-release-v1.0.apk`
   - `NewApi-debug-v1.0.apk`
4. 点击 "Update release"

### 文件传输方案

#### 方案A：使用云存储中转
```bash
# 上传到云存储（在受限环境）
rsync -av release-v0.0.1/*.apk your-cloud-storage:/

# 下载并上传到GitHub（在正常网络环境）
wget your-cloud-storage/NewApi-*.apk
# 然后手动上传到GitHub Release
```

#### 方案B：使用U盘或其他存储
1. 在受限环境中复制APK到U盘
2. 在正常网络环境中从U盘读取APK
3. 手动上传到GitHub Release

### 验证发布结果

#### 在受限环境中验证Git标签
```bash
# 检查本地标签
git tag -l

# 检查远程标签
git ls-remote --tags origin

# 查看标签详情
git show v0.0.1
```

#### 在正常网络环境中验证Release
```bash
# 使用curl检查Release
curl -s https://api.github.com/repos/tpu01yzx/new-api-app/releases/tags/v0.0.1

# 或访问网页
# https://github.com/tpu01yzx/new-api-app/releases/tag/v0.0.1
```

### 常见问题

#### Q: SSH连接失败怎么办？
```bash
# 详细测试SSH连接
ssh -vT git@github.com

# 检查SSH配置
cat ~/.ssh/config

# 确保SSH代理运行
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

#### Q: Git推送失败怎么办？
```bash
# 检查远程仓库配置
git remote -v

# 确保使用SSH URL
git remote set-url origin git@github.com:tpu01yzx/new-api-app.git

# 强制推送（如果需要）
git push --force-with-lease origin main
```

#### Q: 如何在不同环境间同步？
```bash
# 导出Git仓库状态
git bundle create new-api-app.bundle --all

# 在另一个环境中恢复
git clone new-api-app.bundle new-api-app-copy
```

---

💡 **提示**: 网络受限环境下，纯SSH方案是最可靠的发布方式，结合手动文件上传可以完成完整的Release发布。 