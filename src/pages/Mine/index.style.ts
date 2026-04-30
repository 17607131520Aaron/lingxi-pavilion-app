import { StyleSheet } from 'react-native';

import colors from '~/common/colors';

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

export default styles;
