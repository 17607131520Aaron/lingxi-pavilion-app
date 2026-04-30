import { type NavigationProp, type ParamListBase, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './index.style';
import useProfile from './useProfile';

const ROLES = ['普通用户', '管理员', 'VIP会员', '企业用户'];

const ProfilePage: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const {
    userInfo,
    currentRole,
    showRoleSheet,
    maskPhone,
    formatDate,
    handleLogout,
    handleSwitchAccount,
    handelsetShowRoleSheet,
    handleRoleChange,
  } = useProfile();

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
          <Pressable style={styles.actionItem} onPress={() => handelsetShowRoleSheet(true)}>
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
          <Pressable
            style={styles.overlayBackground}
            onPress={() => handelsetShowRoleSheet(false)}
          />
          <View style={styles.bottomSheet}>
            <Text style={styles.sheetTitle}>选择角色</Text>
            {ROLES.map((role) => (
              <Pressable
                key={role}
                style={[styles.roleOption, currentRole === role && styles.roleOptionActive]}
                onPress={() => handleRoleChange(role)}
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
              <Pressable
                style={styles.sheetCancelButton}
                onPress={() => handelsetShowRoleSheet(false)}
              >
                <Text style={styles.sheetCancelText}>取消</Text>
              </Pressable>
              <Pressable
                style={styles.sheetConfirmButton}
                onPress={() => {
                  handelsetShowRoleSheet(false);
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

export default ProfilePage;
