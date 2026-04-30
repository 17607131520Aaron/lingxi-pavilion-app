import Icon from '@react-native-vector-icons/material-design-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '~/common/colors';

interface WelcomeProps {
  onSuggestionPress?: (suggestion: string) => void;
}

const suggestions = [
  { icon: 'lightbulb-outline', text: '帮我写一篇关于人工智能的文章' },
  { icon: 'code-braces', text: '用Python写一个快速排序算法' },
  { icon: 'translate', text: '把这句话翻译成英文' },
  { icon: 'book-open-variant', text: '解释一下量子计算的原理' },
];

const Welcome: React.FC<WelcomeProps> = ({ onSuggestionPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon color={colors.brandPrimary} name='robot' size={48} />
        </View>
        <Text style={styles.title}>Hi~ 我是灵犀</Text>
        <Text style={styles.subtitle}>你身边的智能助手，可以为你答疑解惑、尽情创作</Text>
      </View>
      <View style={styles.suggestions}>
        {suggestions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionItem}
            onPress={() => onSuggestionPress?.(item.text)}
          >
            <Icon color={colors.brandPrimary} name={item.icon as never} size={20} />
            <Text style={styles.suggestionText}>{item.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.brandPrimary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textMain,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  suggestions: {
    width: '100%',
    gap: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  suggestionText: {
    flex: 1,
    fontSize: 15,
    color: colors.textBody,
  },
});

export default Welcome;
