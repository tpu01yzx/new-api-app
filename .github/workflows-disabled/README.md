# 禁用的GitHub Actions工作流

由于GitHub Actions的免费额度限制，暂时禁用了所有自动化构建工作流。

## 原工作流文件：
- `android.yml` - Android自动构建
- `ios.yml` - iOS云端构建  
- `harmonyos.yml` - 鸿蒙构建
- `build-all.yml` - 多平台并行构建

## 重新启用方法：
当需要重新启用GitHub Actions时，将这个目录下的.yml文件移回到`.github/workflows/`目录即可。

```bash
mv .github/workflows-disabled/*.yml .github/workflows/
```

## 手动构建方法：
参考项目根目录的`scripts/`目录和相关文档进行手动构建。 