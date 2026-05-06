import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import colors from '~/common/colors';

import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = (props): React.JSX.Element => {
  const { title, onPress, disabled = false, style } = props;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={disabled}
      style={[styles.buttonContainer, disabled && styles.disabledButton, style]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
  );
};

// 完整样式配置
const styles = StyleSheet.create({
  // 按钮容器样式
  buttonContainer: {
    backgroundColor: colors.brandPrimary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 }, // 阴影偏移
    shadowOpacity: 0.1, // 阴影透明度
    shadowRadius: 4, // 阴影圆角
    elevation: 3, // 安卓阴影层级
  },
  // 禁用状态容器样式
  disabledButton: {
    backgroundColor: colors.borderLight,
    elevation: 0,
  },
  // 按钮文字样式
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  // 禁用状态文字样式
  disabledText: {
    color: colors.textSecondary,
  },
});

export default CustomButton;
