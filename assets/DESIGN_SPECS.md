# New API Manager - 设计规范

## 应用图标设计

### 设计理念
- **核心概念**: API连接管理和监控
- **视觉元素**: 中心节点连接多个外围节点，象征API管理中心
- **色彩主题**: iOS风格蓝色渐变背景，多彩连接节点
- **状态指示**: 绿色勾选标记表示健康状态

### 图标规格

#### iOS 图标尺寸
- **App Store**: 1024x1024px
- **iPhone**: 180x180px (60pt @3x), 120x120px (60pt @2x)
- **iPad**: 167x167px (83.5pt @2x), 152x152px (76pt @2x)
- **Settings**: 87x87px (29pt @3x), 58x58px (29pt @2x)
- **Spotlight**: 120x120px (40pt @3x), 80x80px (40pt @2x)

#### Android 图标尺寸
- **Play Store**: 512x512px
- **Launcher Icons**:
  - xxxhdpi: 192x192px
  - xxhdpi: 144x144px
  - xhdpi: 96x96px
  - hdpi: 72x72px
  - mdpi: 48x48px

#### 鸿蒙图标尺寸
- **应用市场**: 512x512px
- **桌面图标**: 216x216px, 162x162px, 108x108px

### 色彩规范

#### 主色调
- **主要蓝色**: #007AFF (iOS 蓝)
- **次要紫色**: #5856D6 (iOS 紫)
- **背景渐变**: #007AFF → #5856D6

#### 连接节点色彩
- **成功绿色**: #34C759
- **警告橙色**: #FF9500  
- **错误红色**: #FF3B30
- **信息蓝色**: #5AC8FA
- **紫色**: #AF52DE
- **绿色**: #32D74B
- **黄色**: #FFD60A
- **粉色**: #FF2D92

#### 文字色彩
- **主要文字**: #000000
- **次要文字**: #8E8E93
- **禁用文字**: #C7C7CC
- **背景文字**: #FFFFFF

## 启动屏幕设计

### 设计要素
- **背景**: 与应用图标相同的蓝色渐变
- **中心元素**: 简化版API连接图形
- **品牌标识**: "New API Manager" 白色文字
- **版本信息**: "v0.0.1" 小字显示

### 动画效果
- **入场动画**: 节点从中心向外扩散
- **连接动画**: 连接线依次显示
- **状态动画**: 状态指示器闪烁效果
- **过渡时间**: 2-3秒

## 界面设计规范

### 字体规范
- **系统字体**: iOS使用San Francisco，Android使用Roboto
- **标题字重**: Bold (700)
- **正文字重**: Regular (400)  
- **辅助字重**: Medium (500)

### 间距规范
- **极小间距**: 4px
- **小间距**: 8px
- **标准间距**: 16px
- **大间距**: 24px
- **超大间距**: 32px

### 圆角规范
- **小圆角**: 4px (按钮)
- **标准圆角**: 8px (卡片)
- **大圆角**: 12px (面板)
- **超大圆角**: 16px (模态框)

### 阴影规范
- **轻微阴影**: 0px 1px 2px rgba(0,0,0,0.05)
- **标准阴影**: 0px 2px 4px rgba(0,0,0,0.1)
- **强调阴影**: 0px 4px 8px rgba(0,0,0,0.15)

## 应用商店素材

### 截图规范
- **iPhone 6.7"**: 1284x2778px (5张)
- **iPhone 6.5"**: 1242x2688px (5张)
- **iPad Pro 12.9"**: 2048x2732px (5张)
- **Android手机**: 1080x1920px (8张)
- **Android平板**: 1600x2560px (8张)

### 截图内容
1. **主屏幕** - 实例列表展示
2. **添加实例** - 配置界面
3. **监控仪表板** - 数据展示
4. **实例详情** - 完整信息
5. **设置页面** - 应用设置

### 商店描述
- **标题**: "New API Manager - 统一监控管理"
- **副标题**: "多实例API监控，一站式管理平台"
- **关键词**: API, 监控, 管理, 统计, 跨平台
- **分类**: 开发工具, 生产力工具

## 品牌元素

### Logo设计
- **完整Logo**: 图标 + 文字标识
- **图标Logo**: 仅图标部分
- **文字Logo**: 仅文字部分
- **最小尺寸**: 24x24px

### 品牌口号
- **主要**: "统一监控，智能管理"
- **英文**: "Unified Monitoring, Smart Management"
- **简短**: "API监控专家"

### 设计原则
1. **简洁明了** - 避免复杂设计
2. **功能导向** - 突出核心功能
3. **现代时尚** - 符合当前设计趋势
4. **跨平台一致** - 保持各平台视觉统一
5. **易于识别** - 在小尺寸下仍清晰可辨

## 文件输出规范

### 文件格式
- **矢量源文件**: SVG, AI
- **位图输出**: PNG (透明背景)
- **压缩格式**: WebP (应用内使用)

### 命名规范
- `icon_[size]@[scale]x.[format]`
- `splash_[orientation]_[size].[format]`
- `screenshot_[platform]_[index].[format]`

### 导出设置
- **色彩模式**: RGB
- **分辨率**: 72 DPI (屏幕显示)
- **压缩**: 无损压缩
- **透明度**: 保留Alpha通道 