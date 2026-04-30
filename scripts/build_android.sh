#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_DIR="$PROJECT_DIR/android"
APK_DIR="$ANDROID_DIR/app/build/outputs/apk"
MANIFEST="$ANDROID_DIR/app/src/main/AndroidManifest.xml"
PACKAGE_NAME="com.lingxipavilionapp"

APP_NAME="灵灵购AI"

ENV_CN_MAP=(
    "test:测试"
    "pre:预发"
    "prod:生产"
)

get_env_cn() {
    local env=$1
    for item in "${ENV_CN_MAP[@]}"; do
        if [[ "$item" == "$env:"* ]]; then
            echo "${item#*:}"
            return
        fi
    done
    echo ""
}

show_usage() {
    echo -e "${YELLOW}用法: ./scripts/build_android.sh <环境>${NC}"
    echo ""
    echo "可用环境:"
    echo "  test  - 测试环境"
    echo "  pre   - 预发环境"
    echo "  prod  - 生产环境"
    echo ""
    echo "示例:"
    echo "  ./scripts/build_android.sh test"
    echo "  ./scripts/build_android.sh pre"
    echo "  ./scripts/build_android.sh prod"
}

change_app_name() {
    local new_name=$1

    if [ ! -f "$MANIFEST" ]; then
        echo -e "${RED}错误: 找不到 AndroidManifest.xml${NC}"
        exit 1
    fi

    sed -i '' "s/android:label=\"[^\"]*\"/android:label=\"$new_name\"/g" "$MANIFEST"
    echo -e "${GREEN}✓ 应用名称已修改为: $new_name${NC}"
}

restore_app_name() {
    change_app_name "$APP_NAME"
    echo -e "${GREEN}✓ 应用名称已恢复为: $APP_NAME${NC}"
}

check_device() {
    if ! command -v adb &> /dev/null; then
        echo -e "${RED}错误: 找不到 adb 命令，请确保 Android SDK 已安装${NC}"
        exit 1
    fi

    local devices=$(adb devices | grep -v "List" | grep -v "^$" | wc -l)
    if [ "$devices" -eq 0 ]; then
        echo -e "${RED}错误: 没有检测到 Android 设备${NC}"
        echo -e "${YELLOW}请确保:${NC}"
        echo -e "${YELLOW}  1. 手机已通过 USB 连接${NC}"
        echo -e "${YELLOW}  2. 已开启 USB 调试${NC}"
        echo -e "${YELLOW}  3. 已授权此电脑调试${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ 已检测到 Android 设备${NC}"
}

build_apk() {
    echo -e "${YELLOW}正在构建 Release APK...${NC}"
    cd "$ANDROID_DIR" && ./gradlew assembleRelease

    local apk_path="$APK_DIR/release/app-release.apk"
    if [ ! -f "$apk_path" ]; then
        echo -e "${RED}错误: APK 构建失败${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ APK 构建成功${NC}"
    echo -e "${GREEN}  路径: $apk_path${NC}"
}

install_apk() {
    local apk_path="$APK_DIR/release/app-release.apk"

    echo -e "${YELLOW}正在安装 APK 到手机...${NC}"
    adb install -r "$apk_path"

    echo -e "${GREEN}✓ APK 已安装到手机${NC}"
}

launch_app() {
    echo -e "${YELLOW}正在启动应用...${NC}"
    adb shell monkey -p "$PACKAGE_NAME" -c android.intent.category.LAUNCHER 1 > /dev/null 2>&1
    echo -e "${GREEN}✓ 应用已启动${NC}"
}

main() {
    local env=$1

    if [ -z "$env" ]; then
        show_usage
        exit 1
    fi

    local valid_env=false
    for item in "test" "pre" "prod"; do
        if [ "$item" == "$env" ]; then
            valid_env=true
            break
        fi
    done

    if [ "$valid_env" == "false" ]; then
        echo -e "${RED}错误: 无效的环境 '$env'${NC}"
        echo ""
        show_usage
        exit 1
    fi

    local env_cn=$(get_env_cn "$env")

    echo -e "${GREEN}==============================${NC}"
    echo -e "${GREEN}  Android APK 打包安装脚本${NC}"
    echo -e "${GREEN}==============================${NC}"
    echo ""
    echo -e "${YELLOW}当前环境: $env ($env_cn)${NC}"
    echo ""

    check_device

    if [ "$env" != "prod" ]; then
        local display_name="${APP_NAME}-${env_cn}"
        change_app_name "$display_name"
    fi

    trap 'restore_app_name' EXIT

    build_apk
    install_apk
    launch_app

    echo ""
    echo -e "${GREEN}==============================${NC}"
    echo -e "${GREEN}  打包安装完成！${NC}"
    echo -e "${GREEN}==============================${NC}"
}

main "$@"
