import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import colors from '~/common/colors';

import type { ParamListBase } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeNavigation = NativeStackNavigationProp<ParamListBase>;

const NAV_LINKS = [
  { screen: 'login', label: '去登录' },
  { screen: 'register', label: '去注册' },
  { screen: 'mine', label: '我的' },
  { screen: 'debug', label: '调试' },
  {
    screen: 'aiChat',
    label: 'AI对话',
  },
  {
    // 备件管理
    screen: 'spareparts',
    label: '备件管理',
  },
];

const HomePages: React.FC = () => {
  const navigation = useNavigation<HomeNavigation>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>首页</Text>
      <Text style={styles.subtitle}>快捷入口</Text>
      {NAV_LINKS.map(({ screen, label }) => (
        <Pressable
          key={screen}
          accessibilityRole='button'
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => navigation.navigate(screen)}
        >
          <Text style={styles.buttonText}>{label}</Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: colors.pageBackground,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textMain,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.brandPrimary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomePages;
