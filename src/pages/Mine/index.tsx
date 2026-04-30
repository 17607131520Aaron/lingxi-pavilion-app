import {
  type NavigationProp,
  type ParamListBase,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useAuthStore from '~/stores/useAuthStore';
import useUserStore from '~/stores/useUserStore';

import styles from './index.style';
import { MENU_ITEMS_1, MENU_ITEMS_2 } from './mockData';

const MinePages: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { userInfo, fetchUserInfo, clearUserInfo } = useUserStore();
  const { clearAuth } = useAuthStore();

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const handleLogout = (): void => {
    Alert.alert('确认退出', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        style: 'destructive',
        onPress: () => {
          clearUserInfo();
          clearAuth();
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 用户信息卡片 */}
        <Pressable style={styles.userInfoCard} onPress={() => navigation.navigate('profile')}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.nickname}>{userInfo?.nickname ?? 'AI 智能用户'}</Text>
            <Text style={styles.userId}>ID: {userInfo?.userId ?? '--'}</Text>
          </View>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>Pro 会员</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        {/* 统计卡片 */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1,280</Text>
            <Text style={styles.statLabel}>对话次数</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>56,800</Text>
            <Text style={styles.statLabel}>消息总数</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>98.5%</Text>
            <Text style={styles.statLabel}>满意度</Text>
          </View>
        </View>

        {/* VIP 卡片 */}
        <View style={styles.vipCard}>
          <View style={styles.vipInfo}>
            <Text style={styles.vipTitle}>升级 Pro 会员</Text>
            <Text style={styles.vipSubtitle}>解锁全部 AI 功能，无限对话额度</Text>
          </View>
          <Pressable style={styles.vipButton}>
            <Text style={styles.vipButtonText}>立即升级</Text>
          </Pressable>
        </View>

        {/* 菜单分组 1 */}
        <View style={styles.menuSection}>
          {MENU_ITEMS_1.map((item, index) => (
            <Pressable key={index} style={styles.menuItem}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </Pressable>
          ))}
        </View>

        {/* 菜单分组 2 */}
        <View style={styles.menuSection}>
          {MENU_ITEMS_2.map((item, index) => (
            <Pressable key={index} style={styles.menuItem}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </Pressable>
          ))}
        </View>

        {/* 退出登录 */}
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>退出登录</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MinePages;
