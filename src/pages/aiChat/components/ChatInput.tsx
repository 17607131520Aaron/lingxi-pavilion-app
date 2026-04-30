import Icon from '@react-native-vector-icons/material-design-icons';
import React, { useState } from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '~/common/colors';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isLoading?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  onStop,
  isLoading = false,
  placeholder = '输入你的问题...',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();

  const paddingBottom = keyboardHeight > 0 ? Math.max(keyboardHeight - insets.bottom, 0) : 0;

  React.useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates?.height ?? 0);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleSend = (): void => {
    if (!inputValue.trim() || isLoading) {
      return;
    }

    onSend(inputValue.trim());
    setInputValue('');
    Keyboard.dismiss();
  };

  const handleStop = (): void => {
    onStop?.();
  };

  return (
    <View style={[styles.container, { paddingBottom: paddingBottom + 8 }]}>
      <View style={styles.inputWrapper}>
        <TextInput
          multiline
          editable={!isLoading}
          maxLength={2000}
          placeholder={placeholder}
          placeholderTextColor={colors.textGray}
          returnKeyType='send'
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleSend}
        />
        <View style={styles.actions}>
          {isLoading ? (
            <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
              <Icon color={colors.danger} name='stop-circle' size={32} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              disabled={!inputValue.trim()}
              style={[styles.sendButton, !inputValue.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
            >
              <Icon
                color={inputValue.trim() ? colors.white : colors.textGray}
                name='send'
                size={24}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.disclaimer}>
        <Icon color={colors.textGray} name='information-outline' size={12} />
        <Text style={styles.disclaimerText}>内容由AI生成，仅供参考</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderLight,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surfaceBackground,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMain,
    maxHeight: 120,
    paddingTop: 8,
    paddingBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    paddingBottom: 4,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brandPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.surfacePlaceholder,
  },
  stopButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 4,
  },
  disclaimerText: {
    fontSize: 12,
    color: colors.textGray,
  },
});

export default ChatInput;
