import { type NavigationProp, type ParamListBase, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import colors from '~/common/colors';
import STORAGE_KEYS from '~/common/storage-keys';
import { getUserInfo, type UserInfo } from '~/services/userServices.ts';
import storage from '~/utils/storage.ts';

const ROLES = ['普通用户', '管理员', 'VIP会员', '企业用户'];

const ProfilePage: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [currentRole, setCurrentRole] = useState('普通用户');
  const [showRoleSheet, setShowRoleSheet] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async (): Promise<void> => {
      try {
        const response = await getUserInfo();
        if (response.data) {
          setUserInfo(response.data);
        }
      } catch {
        // 静默处理
      }
    };

    fetchUserInfo();
  }, []);

  const maskPhone = (phone: string): string => {
    if (!phone || phone.length < 7) return phone || '--';
    return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
  };

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return '--';
    try {
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
        date.getDate(),
      ).padStart(2, '0')}`;
    } catch {
      return '--';
    }
  };

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

  const handleSwitchAccount = (): void => {
    Alert.alert('切换账号', '确定要切换到其他账号吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
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
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>个人信息</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 用户头像区域 */}
        <View style={styles.userHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <Text style={styles.nickname}>{userInfo?.nickname ?? 'AI 智能用户'}</Text>
          <Text style={styles.userId}>ID: {userInfo?.userId ?? '--'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{currentRole}</Text>
          </View>
        </View>

        {/* 信息区域 */}
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📱</Text>
            <Text style={styles.infoLabel}>手机号</Text>
            <Text style={styles.infoValue}>{maskPhone(userInfo?.phone ?? '')}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📧</Text>
            <Text style={styles.infoLabel}>邮箱</Text>
            <Text style={styles.infoValue}>{userInfo?.email ?? '未绑定'}</Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoLabel}>注册时间</Text>
            <Text style={styles.infoValue}>{formatDate(userInfo?.createTime)}</Text>
          </View>
        </View>

        {/* 操作区域 */}
        <View style={styles.actionSection}>
          <Pressable style={styles.actionItem} onPress={() => setShowRoleSheet(true)}>
            <Text style={styles.actionIcon}>🔄</Text>
            <Text style={styles.actionLabel}>切换角色</Text>
            <Text style={styles.actionArrow}>›</Text>
          </Pressable>
          <View style={styles.actionDivider} />
          <Pressable style={styles.actionItem} onPress={handleSwitchAccount}>
            <Text style={styles.actionIcon}>👤</Text>
            <Text style={styles.actionLabel}>切换账号</Text>
            <Text style={styles.actionArrow}>›</Text>
          </Pressable>
          <View style={styles.actionDivider} />
          <Pressable style={styles.actionItem} onPress={handleLogout}>
            <Text style={styles.actionIcon}>🚪</Text>
            <Text style={[styles.actionLabel, styles.logoutText]}>退出登录</Text>
            <Text style={styles.actionArrow}>›</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* 角色选择弹窗 */}
      {showRoleSheet && (
        <View style={styles.overlay}>
          <Pressable style={styles.overlayBackground} onPress={() => setShowRoleSheet(false)} />
          <View style={styles.bottomSheet}>
            <Text style={styles.sheetTitle}>选择角色</Text>
            {ROLES.map((role) => (
              <Pressable
                key={role}
                style={[styles.roleOption, currentRole === role && styles.roleOptionActive]}
                onPress={() => setCurrentRole(role)}
              >
                <Text
                  style={[
                    styles.roleOptionText,
                    currentRole === role && styles.roleOptionTextActive,
                  ]}
                >
                  {role}
                </Text>
                {currentRole === role && <Text style={styles.checkIcon}>✓</Text>}
              </Pressable>
            ))}
            <View style={styles.sheetButtons}>
              <Pressable style={styles.sheetCancelButton} onPress={() => setShowRoleSheet(false)}>
                <Text style={styles.sheetCancelText}>取消</Text>
              </Pressable>
              <Pressable
                style={styles.sheetConfirmButton}
                onPress={() => {
                  setShowRoleSheet(false);
                  Alert.alert('提示', `已切换为${currentRole}`);
                }}
              >
                <Text style={styles.sheetConfirmText}>确定</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.pageBackground,
  },
  // 顶部导航栏
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: colors.textMain,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textMain,
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  // 用户头像区域
  userHeader: {
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 32,
    marginBottom: 12,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarIcon: {
    fontSize: 40,
  },
  nickname: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textMain,
    marginBottom: 8,
  },
  userId: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '500',
  },
  // 信息区域
  infoSection: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: colors.textMain,
    width: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'right',
  },
  infoDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 48,
  },
  // 操作区域
  actionSection: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.textMain,
  },
  logoutText: {
    color: colors.danger,
  },
  actionArrow: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  actionDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 48,
  },
  // 弹窗遮罩
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: colors.overlayBg,
  },
  bottomSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textMain,
    textAlign: 'center',
    marginBottom: 20,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
  },
  roleOptionActive: {
    backgroundColor: colors.tagBlueBg,
  },
  roleOptionText: {
    flex: 1,
    fontSize: 16,
    color: colors.textMain,
  },
  roleOptionTextActive: {
    color: colors.brandPrimary,
    fontWeight: '500',
  },
  checkIcon: {
    fontSize: 18,
    color: colors.brandPrimary,
    fontWeight: '600',
  },
  sheetButtons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  sheetCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: colors.surfaceBackground,
    alignItems: 'center',
  },
  sheetCancelText: {
    fontSize: 16,
    color: colors.textMain,
  },
  sheetConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: colors.brandPrimary,
    alignItems: 'center',
  },
  sheetConfirmText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '500',
  },
});

export default ProfilePage;
