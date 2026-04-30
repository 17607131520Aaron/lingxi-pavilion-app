import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import colors from '~/common/colors';
import useUserStore from '~/stores/useUserStore';

import styles from './index.style';
import { AI_TOOLS, CHAT_HISTORY } from './mockData';

const HomePages: React.FC = () => {
  const { userInfo, fetchUserInfo } = useUserStore();

  useFocusEffect(
    useCallback(() => {
      fetchUserInfo();
    }, [fetchUserInfo]),
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 搜索栏 */}
        <View style={styles.searchBar}>
          <View style={styles.searchInputContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              editable={false}
              placeholder='搜索对话历史...'
              placeholderTextColor={colors.textSecondary}
              style={styles.searchInput}
            />
          </View>
          <Pressable style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </Pressable>
        </View>

        {/* 用户/会员卡片 */}
        <View style={styles.profileCard}>
          <View style={styles.profileCardHeader}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarIcon}>👤</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.greeting}>你好，{userInfo?.nickname ?? '智能用户'}</Text>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>Pro 会员</Text>
              </View>
            </View>
            <Pressable style={styles.renewButton}>
              <Text style={styles.renewButtonText}>续费</Text>
            </Pressable>
          </View>
          <View style={styles.statsRow}>
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
        </View>

        {/* 每日任务/福利 */}
        <View style={styles.taskCard}>
          <Text style={styles.taskCardTitle}>每日福利</Text>
          <View style={styles.taskRow}>
            <Pressable style={styles.taskItem}>
              <View style={styles.taskIconContainer}>
                <Text style={styles.taskIcon}>📅</Text>
              </View>
              <Text style={styles.taskLabel}>签到</Text>
            </Pressable>
            <Pressable style={styles.taskItem}>
              <View style={styles.taskIconContainer}>
                <Text style={styles.taskIcon}>💬</Text>
              </View>
              <Text style={styles.taskLabel}>对话3次</Text>
            </Pressable>
            <Pressable style={styles.taskItem}>
              <View style={styles.taskIconContainer}>
                <Text style={styles.taskIcon}>🔗</Text>
              </View>
              <Text style={styles.taskLabel}>分享</Text>
            </Pressable>
          </View>
        </View>

        {/* AI 工具网格 */}
        <View style={styles.gridMenuCard}>
          <Text style={styles.sectionTitle}>AI 工具箱</Text>
          <View style={styles.gridContainer}>
            {AI_TOOLS.map((tool, index) => (
              <Pressable key={index} style={styles.gridItem}>
                <View style={styles.gridIconContainer}>
                  <Text style={styles.gridIcon}>{tool.icon}</Text>
                </View>
                <Text style={styles.gridLabel}>{tool.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 核心能力 */}
        <View style={styles.capabilitiesCard}>
          <Text style={styles.sectionTitle}>核心能力</Text>
          <View style={styles.capabilityItem}>
            <Text style={styles.capabilityIcon}>⚡</Text>
            <View style={styles.capabilityInfo}>
              <Text style={styles.capabilityTitle}>GPT-4o 全新升级</Text>
              <Text style={styles.capabilityDesc}>更强大的理解与生成能力</Text>
            </View>
          </View>
          <View style={styles.capabilityItem}>
            <Text style={styles.capabilityIcon}>🚀</Text>
            <View style={styles.capabilityInfo}>
              <Text style={styles.capabilityTitle}>响应时间 {'<'} 0.5s</Text>
              <Text style={styles.capabilityDesc}>极速响应，无需等待</Text>
            </View>
          </View>
          <View style={styles.capabilityItem}>
            <Text style={styles.capabilityIcon}>🔒</Text>
            <View style={styles.capabilityInfo}>
              <Text style={styles.capabilityTitle}>隐私安全保护</Text>
              <Text style={styles.capabilityDesc}>端到端加密，数据不泄露</Text>
            </View>
          </View>
        </View>

        {/* 最近对话 */}
        <View style={styles.chatHistoryCard}>
          <View style={styles.chatHistoryHeader}>
            <Text style={styles.sectionTitle}>最近对话</Text>
            <Pressable>
              <Text style={styles.viewAllText}>查看全部</Text>
            </Pressable>
          </View>
          {CHAT_HISTORY.map((chat, index) => (
            <Pressable key={index} style={styles.chatItem}>
              <View style={styles.chatIconContainer}>
                <Text style={styles.chatIcon}>💬</Text>
              </View>
              <View style={styles.chatInfo}>
                <Text numberOfLines={1} style={styles.chatTitle}>
                  {chat.title}
                </Text>
                <Text style={styles.chatTime}>{chat.time}</Text>
              </View>
              <Text style={styles.chatArrow}>›</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePages;
