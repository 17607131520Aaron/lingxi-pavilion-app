import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';

import colors from '~/common/colors';

import useAiChat from './useAiChat';

const AiChatPage = (): React.JSX.Element => {
  const { messages, onSend, isTyping, user } = useAiChat();

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <GiftedChat
        isTyping={isTyping}
        messages={messages}
        renderAvatar={null}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              left: styles.leftBubble,
              right: styles.rightBubble,
            }}
          />
        )}
        renderFooter={() =>
          isTyping ? <Text style={styles.typingText}>Lingxi AI 正在思考...</Text> : null
        }
        user={user}
        onSend={onSend}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceBackground,
  },
  leftBubble: {
    backgroundColor: colors.surfaceBackgroundSecondary,
  },
  rightBubble: {
    backgroundColor: colors.brandPrimary,
  },
  typingText: {
    marginLeft: 12,
    marginBottom: 8,
    color: colors.textMuted,
    fontSize: 12,
  },
});

export default AiChatPage;
