import { StyleSheet } from 'react-native';

import colors from '~/common/colors';
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

export default styles;
