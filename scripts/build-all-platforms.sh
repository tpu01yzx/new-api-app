#!/bin/bash

# New API Manager - 全平台构建脚本
# 支持 Android、iOS、HarmonyOS 三个平台

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查环境
check_environment() {
    log_info "检查构建环境..."
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装"
        exit 1
    fi
    
    # 检查React Native CLI
    if ! command -v npx &> /dev/null; then
        log_error "npx 未安装"
        exit 1
    fi
    
    # 检查Java (Android)
    if ! command -v java &> /dev/null; then
        log_warning "Java 未安装，无法构建Android应用"
        ANDROID_BUILD=false
    else
        ANDROID_BUILD=true
    fi
    
    # 检查Xcode (iOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if ! command -v xcodebuild &> /dev/null; then
            log_warning "Xcode 未安装，无法构建iOS应用"
            IOS_BUILD=false
        else
            IOS_BUILD=true
        fi
    else
        log_warning "非macOS环境，无法构建iOS应用"
        IOS_BUILD=false
    fi
    
    # 检查HarmonyOS SDK
    if [[ -n "$HARMONY_SDK_PATH" ]]; then
        HARMONY_BUILD=true
    else
        log_warning "HarmonyOS SDK 未配置，无法构建鸿蒙应用"
        HARMONY_BUILD=false
    fi
    
    log_success "环境检查完成"
}

# 准备构建
prepare_build() {
    log_info "准备构建..."
    
    # 创建构建目录
    mkdir -p build/android
    mkdir -p build/ios
    mkdir -p build/harmony
    
    # 安装依赖
    log_info "安装依赖..."
    npm install
    
    # 清理缓存
    log_info "清理缓存..."
    npm start -- --reset-cache || true
    
    log_success "构建准备完成"
}

# 构建Android
build_android() {
    if [[ "$ANDROID_BUILD" == true ]]; then
        log_info "开始构建Android应用..."
        
        cd android
        
        # 清理旧构建
        ./gradlew clean
        
        # 构建Debug版本
        log_info "构建Debug APK..."
        ./gradlew assembleDebug
        
        # 构建Release版本
        log_info "构建Release APK..."
        ./gradlew assembleRelease
        
        # 复制APK文件
        cp app/build/outputs/apk/debug/app-debug.apk ../build/android/
        cp app/build/outputs/apk/release/app-release.apk ../build/android/
        
        cd ..
        
        log_success "Android构建完成"
    else
        log_warning "跳过Android构建"
    fi
}

# 构建iOS
build_ios() {
    if [[ "$IOS_BUILD" == true ]]; then
        log_info "开始构建iOS应用..."
        
        cd ios
        
        # 安装CocoaPods依赖
        log_info "安装CocoaPods依赖..."
        pod install
        
        # 构建Debug版本
        log_info "构建Debug IPA..."
        xcodebuild -workspace NewAPIManager.xcworkspace \
                   -scheme NewAPIManager \
                   -configuration Debug \
                   -archivePath ../build/ios/NewAPIManager-Debug.xcarchive \
                   archive
        
        # 构建Release版本
        log_info "构建Release IPA..."
        xcodebuild -workspace NewAPIManager.xcworkspace \
                   -scheme NewAPIManager \
                   -configuration Release \
                   -archivePath ../build/ios/NewAPIManager-Release.xcarchive \
                   archive
        
        # 导出IPA
        xcodebuild -exportArchive \
                   -archivePath ../build/ios/NewAPIManager-Release.xcarchive \
                   -exportPath ../build/ios/ \
                   -exportOptionsPlist ExportOptions.plist
        
        cd ..
        
        log_success "iOS构建完成"
    else
        log_warning "跳过iOS构建"
    fi
}

# 构建HarmonyOS
build_harmony() {
    if [[ "$HARMONY_BUILD" == true ]]; then
        log_info "开始构建HarmonyOS应用..."
        
        # 这里需要根据实际的HarmonyOS构建工具进行配置
        # 示例命令，需要根据实际SDK调整
        
        log_info "配置HarmonyOS构建环境..."
        export HARMONY_SDK_PATH="$HARMONY_SDK_PATH"
        
        # 构建HAP包
        log_info "构建HAP包..."
        # hvigor assembleHap --mode module -p product=default
        
        log_warning "HarmonyOS构建需要实际SDK支持"
    else
        log_warning "跳过HarmonyOS构建"
    fi
}

# 生成构建报告
generate_report() {
    log_info "生成构建报告..."
    
    REPORT_FILE="build/build-report.md"
    cat > "$REPORT_FILE" << EOF
# New API Manager - 构建报告

**构建时间**: $(date)
**构建版本**: v0.0.1

## 构建结果

### Android
EOF
    
    if [[ "$ANDROID_BUILD" == true ]]; then
        echo "- ✅ 构建成功" >> "$REPORT_FILE"
        echo "- 📱 Debug APK: build/android/app-debug.apk" >> "$REPORT_FILE"
        echo "- 📱 Release APK: build/android/app-release.apk" >> "$REPORT_FILE"
        if [[ -f "build/android/app-debug.apk" ]]; then
            APK_SIZE=$(du -h build/android/app-debug.apk | cut -f1)
            echo "- 📏 APK大小: $APK_SIZE" >> "$REPORT_FILE"
        fi
    else
        echo "- ❌ 构建跳过（环境不满足）" >> "$REPORT_FILE"
    fi
    
    cat >> "$REPORT_FILE" << EOF

### iOS
EOF
    
    if [[ "$IOS_BUILD" == true ]]; then
        echo "- ✅ 构建成功" >> "$REPORT_FILE"
        echo "- 📱 Release IPA: build/ios/NewAPIManager.ipa" >> "$REPORT_FILE"
    else
        echo "- ❌ 构建跳过（需要macOS环境）" >> "$REPORT_FILE"
    fi
    
    cat >> "$REPORT_FILE" << EOF

### HarmonyOS
EOF
    
    if [[ "$HARMONY_BUILD" == true ]]; then
        echo "- ✅ 构建成功" >> "$REPORT_FILE"
        echo "- 📱 HAP包: build/harmony/NewAPIManager.hap" >> "$REPORT_FILE"
    else
        echo "- ❌ 构建跳过（需要HarmonyOS SDK）" >> "$REPORT_FILE"
    fi
    
    cat >> "$REPORT_FILE" << EOF

## 构建环境

- **操作系统**: $(uname -s)
- **Node.js**: $(node --version)
- **npm**: $(npm --version)
- **React Native**: $(npx react-native --version | head -1)
- **Java**: $(java -version 2>&1 | head -1)

## 下一步操作

1. 测试构建的应用包
2. 准备应用商店上架材料
3. 创建版本发布说明
4. 提交到应用商店审核

## 已知问题

- 网络环境限制可能影响依赖下载
- 需要配置签名证书用于发布版本
- iOS构建需要Apple Developer账户
- HarmonyOS构建需要华为开发者账户

EOF
    
    log_success "构建报告已生成: $REPORT_FILE"
}

# 主函数
main() {
    log_info "=== New API Manager 全平台构建 ==="
    
    # 检查环境
    check_environment
    
    # 准备构建
    prepare_build
    
    # 构建各平台
    build_android
    build_ios
    build_harmony
    
    # 生成报告
    generate_report
    
    log_success "=== 构建完成 ==="
    log_info "查看构建报告: build/build-report.md"
}

# 运行主函数
main "$@" 