import Icon from '@react-native-vector-icons/material-design-icons';
import React, { useCallback, useEffect, useRef } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import colors from '~/common/colors';

import { ChatInput, MessageBubble, Welcome } from './components';
import useAiChat from './useAiChat';

import type { ChatMessage } from './types';
import type { ListRenderItemInfo } from 'react-native';

const AiChatPage = (): React.JSX.Element => {
  const { messages, isLoading, sendMessage, clearMessages, stopGenerating } = useAiChat();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = useCallback(
    (content: string) => {
      sendMessage(content);
    },
    [sendMessage],
  );

  const handleSuggestionPress = useCallback(
    (suggestion: string) => {
      sendMessage(suggestion);
    },
    [sendMessage],
  );

  const renderItem = useCallback(({ item }: ListRenderItemInfo<ChatMessage>) => {
    return <MessageBubble message={item} />;
  }, []);

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  const ListEmptyComponent = useCallback(() => {
    return <Welcome onSuggestionPress={handleSuggestionPress} />;
  }, [handleSuggestionPress]);

  const ListHeaderComponent = useCallback(() => {
    if (messages.length === 0) {
      return null;
    }

    return (
      <View style={styles.header}>
        <TouchableOpacity style={styles.clearButton} onPress={clearMessages}>
          <Icon color={colors.textSecondary} name='delete-outline' size={20} />
        </TouchableOpacity>
      </View>
    );
  }, [messages.length, clearMessages]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        contentContainerStyle={styles.listContent}
        data={messages}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        renderItem={renderItem}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <ChatInput isLoading={isLoading} onSend={handleSend} onStop={stopGenerating} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceBackground,
  },
  listContent: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  clearButton: {
    padding: 8,
  },
});

export default AiChatPage;
