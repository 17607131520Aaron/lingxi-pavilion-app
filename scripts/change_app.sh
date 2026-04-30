#!/bin/bash

# React Native App 图标和名称修改脚本
# 使用方法: ./scripts/change_app.sh

set -e

# ==================== 配置区域 ====================
# App 名称
APP_NAME="灵灵购AI"

# App 图标路径 (相对于项目根目录)
APP_ICON="/src/assets/app_icon.png"
# ==================== 配置区域结束 ====================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 项目根目录
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# 检查依赖
check_dependencies() {
    if command -v ffmpeg &> /dev/null; then
        RESIZE_CMD="ffmpeg"
    elif command -v convert &> /dev/null; then
        RESIZE_CMD="convert"
    elif command -v sips &> /dev/null; then
        RESIZE_CMD="sips"
    else
        echo -e "${RED}错误: 需要 ffmpeg 或 imagemagick 或 sips${NC}"
        exit 1
    fi
    echo -e "${GREEN}使用 $RESIZE_CMD 处理图像${NC}"
}

# 调整图片大小
resize_image() {
    local input="$1"
    local output="$2"
    local size="$3"

    case $RESIZE_CMD in
        ffmpeg)
            ffmpeg -y -i "$input" -vf "scale=$size:$size:force_original_aspect_ratio=decrease,pad=$size:$size:(ow-iw)/2:(oh-ih)/2:color=white" "$output" 2>/dev/null
            ;;
        convert)
            convert "$input" -resize "${size}x${size}" -gravity center -extent "${size}x${size}" "$output"
            ;;
        sips)
            sips -z "$size" "$size" "$input" --out "$output" &> /dev/null
            ;;
    esac
}

# 修改 Android 应用名称
change_android_name() {
    local manifest="$PROJECT_DIR/android/app/src/main/AndroidManifest.xml"

    if [ ! -f "$manifest" ]; then
        echo -e "${RED}错误: 找不到 AndroidManifest.xml${NC}"
        return 1
    fi

    sed -i '' "s/android:label=\"[^\"]*\"/android:label=\"$APP_NAME\"/g" "$manifest"
    echo -e "${GREEN}✓ Android 应用名称已修改为: $APP_NAME${NC}"
}

# 修改 iOS 应用名称
change_ios_name() {
    local plist="$PROJECT_DIR/ios/LingxiPavilionApp/Info.plist"

    if [ ! -f "$plist" ]; then
        echo -e "${RED}错误: 找不到 Info.plist${NC}"
        return 1
    fi

    sed -i '' "/<key>CFBundleDisplayName<\/key>/{n;s/<string>[^<]*<\/string>/<string>$APP_NAME<\/string>/;}" "$plist"
    sed -i '' "/<key>CFBundleName<\/key>/{n;s/<string>[^<]*<\/string>/<string>$APP_NAME<\/string>/;}" "$plist"

    echo -e "${GREEN}✓ iOS 应用名称已修改为: $APP_NAME${NC}"
}

# 修改 app.json 中的显示名称
change_app_json() {
    local app_json="$PROJECT_DIR/app.json"

    if [ ! -f "$app_json" ]; then
        echo -e "${RED}错误: 找不到 app.json${NC}"
        return 1
    fi

    # 使用 sed 修改 displayName 字段
    sed -i '' "s/\"displayName\": \"[^\"]*\"/\"displayName\": \"$APP_NAME\"/g" "$app_json"
    echo -e "${GREEN}✓ app.json 中的显示名称已修改为: $APP_NAME${NC}"
}

# 生成 Android 图标
generate_android_icon() {
    local icon_path="$1"
    local mipmap_dir="$PROJECT_DIR/android/app/src/main/res"

    local sizes=(
        "mipmap-mdpi 48"
        "mipmap-hdpi 72"
        "mipmap-xhdpi 96"
        "mipmap-xxhdpi 144"
        "mipmap-xxxhdpi 192"
    )

    for item in "${sizes[@]}"; do
        local dir=$(echo "$item" | awk '{print $1}')
        local size=$(echo "$item" | awk '{print $2}')
        local target_dir="$mipmap_dir/$dir"

        if [ ! -d "$target_dir" ]; then
            mkdir -p "$target_dir"
        fi

        resize_image "$icon_path" "$target_dir/ic_launcher.png" "$size"
        resize_image "$icon_path" "$target_dir/ic_launcher_round.png" "$size"
        echo -e "${GREEN}✓ 已生成 $dir/ic_launcher.png (${size}x${size})${NC}"
        echo -e "${GREEN}✓ 已生成 $dir/ic_launcher_round.png (${size}x${size})${NC}"
    done
}

# 生成 iOS 图标
generate_ios_icon() {
    local icon_path="$1"
    local appicon_dir="$PROJECT_DIR/ios/LingxiPavilionApp/Images.xcassets/AppIcon.appiconset"

    if [ ! -d "$appicon_dir" ]; then
        mkdir -p "$appicon_dir"
    fi

    local ios_icons=(
        "Icon-App-20x20@1x.png 20"
        "Icon-App-20x20@2x.png 40"
        "Icon-App-20x20@3x.png 60"
        "Icon-App-29x29@1x.png 29"
        "Icon-App-29x29@2x.png 58"
        "Icon-App-29x29@3x.png 87"
        "Icon-App-40x40@1x.png 40"
        "Icon-App-40x40@2x.png 80"
        "Icon-App-40x40@3x.png 120"
        "Icon-App-60x60@2x.png 120"
        "Icon-App-60x60@3x.png 180"
        "Icon-App-76x76@1x.png 76"
        "Icon-App-76x76@2x.png 152"
        "Icon-App-83.5x83.5@2x.png 167"
        "Icon-App-1024x1024@1x.png 1024"
    )

    for item in "${ios_icons[@]}"; do
        local filename=$(echo "$item" | awk '{print $1}')
        local size=$(echo "$item" | awk '{print $2}')
        resize_image "$icon_path" "$appicon_dir/$filename" "$size"
        echo -e "${GREEN}✓ 已生成 $filename (${size}x${size})${NC}"
    done
}

# 主函数
main() {
    local icon_path="$PROJECT_DIR/$APP_ICON"

    check_dependencies

    echo -e "${GREEN}==============================${NC}"
    echo -e "${GREEN}  React Native App 配置修改工具${NC}"
    echo -e "${GREEN}==============================${NC}"
    echo ""
    echo -e "${YELLOW}应用名称: $APP_NAME${NC}"
    echo -e "${YELLOW}图标路径: $APP_ICON${NC}"
    echo ""

    # 修改应用名称
    echo -e "${YELLOW}修改应用名称...${NC}"
    change_android_name
    change_ios_name
    change_app_json
    echo ""

    # 检查图标文件
    if [ ! -f "$icon_path" ]; then
        echo -e "${RED}错误: 找不到图标文件: $icon_path${NC}"
        exit 1
    fi

    # 修改应用图标
    echo -e "${YELLOW}生成 Android 图标...${NC}"
    generate_android_icon "$icon_path"
    echo ""

    echo -e "${YELLOW}生成 iOS 图标...${NC}"
    generate_ios_icon "$icon_path"
    echo ""

    echo -e "${GREEN}==============================${NC}"
    echo -e "${GREEN}  配置修改完成！${NC}"
    echo -e "${GREEN}==============================${NC}"
    echo ""
    echo -e "${YELLOW}提示: 请重新运行 react-native run-android 或 react-native run-ios 以应用更改${NC}"
}

main
