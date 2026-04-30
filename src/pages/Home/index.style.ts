import { StyleSheet } from 'react-native';

import colors from '~/common/colors';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.pageBackground,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  // 搜索栏
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceBackground,
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    marginRight: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textMain,
    padding: 0,
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 22,
  },
  // 用户卡片
  profileCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    backgroundColor: colors.purpleGradient,
  },
  profileCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarIcon: {
    fontSize: 24,
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 4,
  },
  proBadge: {
    backgroundColor: colors.goldAlpha,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  proBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.vipTextDark,
  },
  renewButton: {
    backgroundColor: colors.white20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  renewButtonText: {
    fontSize: 13,
    color: colors.white,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.white70,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.white20,
  },
  // 每日任务
  taskCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  taskCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMain,
    marginBottom: 16,
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  taskItem: {
    alignItems: 'center',
  },
  taskIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.surfaceBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskIcon: {
    fontSize: 28,
  },
  taskLabel: {
    fontSize: 13,
    color: colors.textBody,
  },
  // AI 工具网格
  gridMenuCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMain,
    marginBottom: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 16,
  },
  gridIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.tagBlueBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  gridIcon: {
    fontSize: 24,
  },
  gridLabel: {
    fontSize: 12,
    color: colors.textBody,
    textAlign: 'center',
  },
  // 核心能力
  capabilitiesCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  capabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  capabilityIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  capabilityInfo: {
    flex: 1,
  },
  capabilityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMain,
    marginBottom: 4,
  },
  capabilityDesc: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  // 聊天历史
  chatHistoryCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  chatHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.brandPrimary,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  chatIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatIcon: {
    fontSize: 20,
  },
  chatInfo: {
    flex: 1,
  },
  chatTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMain,
    marginBottom: 4,
  },
  chatTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  chatArrow: {
    fontSize: 20,
    color: colors.textSecondary,
    marginLeft: 8,
  },
});

export default styles;
