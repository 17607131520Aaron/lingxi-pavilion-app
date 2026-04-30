import Icon from '@react-native-vector-icons/material-design-icons';
import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '~/common/colors';

interface InputProps {
  placeholder?: string;
  handleSubmit?: (values: string) => void;
  value?: string;
  isSend?: boolean;
}

const Input: React.FC<InputProps> = (props) => {
  const { placeholder = '请输入', handleSubmit, value, isSend = false } = props;
  const [inputValue, setInputValue] = useState(value ?? '');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();

  const paddingBottom = keyboardHeight > 0 ? Math.max(keyboardHeight - insets.bottom, 0) : 0;

  useEffect(() => {
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

  const onChangeText = (val: string): void => {
    setInputValue(val);
  };

  // 提交数据
  const handelSubmit = (): void => {
    const res = handleSubmit?.(inputValue);

    if (res) {
      setInputValue('');
    }
  };

  return (
    <View style={[styles.input, { paddingBottom }]}>
      <TextInput
        placeholder={placeholder || ''}
        style={styles.inputText}
        value={inputValue}
        onChangeText={onChangeText}
        onSubmitEditing={handelSubmit}
      />
      {isSend && <Icon name='send' size={24} onPress={handelSubmit} />}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.buttonDisabled1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputText: {
    flex: 1,
  },
});

export default Input;
