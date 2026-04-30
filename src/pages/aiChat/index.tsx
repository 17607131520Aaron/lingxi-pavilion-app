import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import colors from '~/common/colors';
import Input from '~/components/Input';

const AiChatPage = (): React.JSX.Element => {
  const handleSubmit = (values: string): boolean => {
    Alert.alert('发送消息', values);
    return true;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text>聊天内容部分</Text>
      </View>

      <View style={styles.footer}>
        <Input isSend handleSubmit={handleSubmit} placeholder='请输入' />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceBackground,
  },
  content: {
    flex: 1,
  },
  footer: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
});

export default AiChatPage;
