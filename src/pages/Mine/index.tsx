import { type NavigationProp, type ParamListBase, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import colors from '~/common/colors';
import STORAGE_KEYS from '~/common/storage-keys';
import { getUserInfo, type UserInfo } from '~/services/userServices.ts';
import storage from '~/utils/storage.ts';

const MENU_ITEMS_1 = [
  { icon: '💬', label: '对话历史' },
  { icon: '⭐', label: '我的收藏' },
  { icon: '📥', label: '下载记录' },
  { icon: '🌐', label: '语言设置' },
];

const MENU_ITEMS_2 = [
  { icon: '❓', label: '帮助与反馈' },
  { icon: 'ℹ️', label: '关于我们' },
  { icon: '📜', label: '用户协议' },
  { icon: '🔒', label: '隐私政策' },
];

const MinePages: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async (): Promise<void> => {
      try {
        const response = await getUserInfo();
        if (response.data) {
          setUserInfo(response.data);
        }
      } catch {
        // 失败时静默处理
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = (): void => {
    Alert.alert('确认退出', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        style: 'destructive',
        onPress: () => {
          storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          navigation.reset({
            index: 0,
            routes: [{ name: 'login' }],
          });
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.pageBackground,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  // 用户信息卡片
  userInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surfaceBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarIcon: {
    fontSize: 30,
  },
  userInfo: {
    flex: 1,
  },
  nickname: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textMain,
    marginBottom: 4,
  },
  userId: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  proBadge: {
    backgroundColor: colors.vipGold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
  },
  proBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.vipTextDark,
  },
  arrow: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  // 统计卡片
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.borderLight,
  },
  // VIP 卡片
  vipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.vipDarkBg,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
  },
  vipInfo: {
    flex: 1,
  },
  vipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.vipGold,
    marginBottom: 4,
  },
  vipSubtitle: {
    fontSize: 12,
    color: colors.white60,
  },
  vipButton: {
    backgroundColor: colors.vipGold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  vipButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.vipTextDark,
  },
  // 菜单分组
  menuSection: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.textMain,
  },
  menuArrow: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  // 退出登录
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    color: colors.danger,
    fontWeight: '500',
  },
});

export default MinePages;
