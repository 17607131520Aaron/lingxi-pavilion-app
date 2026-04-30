import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import useAuthStore from '~/stores/useAuthStore';
import useUserStore from '~/stores/useUserStore';
const useProfile = () => {
  const { userInfo, clearUserInfo, fetchUserInfo } = useUserStore();
  const { clearAuth } = useAuthStore();
  const [currentRole, setCurrentRole] = useState('普通用户');
  const [showRoleSheet, setShowRoleSheet] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  // 处理角色切换
  const handleRoleChange = (role: string): void => {
    setCurrentRole(role);
  };

  // 处理setShowRoleSheet
  const handelsetShowRoleSheet = (show: boolean): void => {
    setShowRoleSheet(show);
  };

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
          clearUserInfo();
          clearAuth();
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
          clearUserInfo();
          clearAuth();
        },
      },
    ]);
  };

  return {
    userInfo,
    currentRole,
    showRoleSheet,
    maskPhone,
    formatDate,
    handleLogout,
    handleSwitchAccount,
    handleRoleChange,
    handelsetShowRoleSheet,
  };
};

export default useProfile;
