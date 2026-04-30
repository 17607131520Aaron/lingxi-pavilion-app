import { type NavigationProp, type ParamListBase, useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useImmer } from 'use-immer';

import { login, type LoginData } from '~/services/userServices.ts';
import { sendSmsCode } from '~/services/userServices.ts';
import useAuthStore from '~/stores/useAuthStore.ts';

import type { LoginFieldErrors, LoginFormValues, LoginUiState, UseLoginReturn } from './types.ts';

const isLoginData = (value: unknown): value is LoginData => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const maybeLoginData = value as { accessToken?: unknown; refreshToken?: unknown };
  return (
    typeof maybeLoginData.accessToken === 'string' &&
    typeof maybeLoginData.refreshToken === 'string'
  );
};

const useLogin = (): UseLoginReturn => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { setTokens } = useAuthStore();
  const [formValues, updateFormValues] = useImmer<LoginFormValues>({
    phone: '',
    code: '',
  });
  const [uiState, updateUiState] = useImmer<LoginUiState>({
    submitting: false,
    passwordInput: '',
    isCodeLogin: true,
    countdown: 0,
    obscurePassword: true,
    isPhoneValid: false,
  });

  const { phone, code } = formValues;
  const { submitting, passwordInput, isCodeLogin, countdown, obscurePassword, isPhoneValid } =
    uiState;

  const validate = (values: LoginFormValues): LoginFieldErrors => {
    const next: LoginFieldErrors = {};
    if (!values.phone.trim()) next.phone = '请输入手机号';
    if (values.phone.trim().length !== 11) next.phone = '请输入正确的手机号';
    if (!values.code) next.code = '请输入验证码';
    if (values.code.length < 4) next.code = '验证码至少 4 位';
    return next;
  };

  const handleLogin = async (): Promise<void> => {
    const nextErrors = validate(formValues);
    if (Object.keys(nextErrors).length) return;

    updateUiState((draft) => {
      draft.submitting = true;
    });

    try {
      const response = await login({
        phone: phone.trim(),
        code,
      });

      if (!response.data || !isLoginData(response.data)) {
        throw new Error('登录响应格式异常，请稍后重试。');
      }

      setTokens(response.data.accessToken, response.data.refreshToken);
      Alert.alert('登录成功', '欢迎回来。');
    } catch (error) {
      const message = error instanceof Error ? error.message : '登录失败，请稍后重试。';
      Alert.alert('登录失败', message);
    } finally {
      updateUiState((draft) => {
        draft.submitting = false;
      });
    }
  };

  const getToRegister = (): void => {
    navigation.navigate('register');
  };

  const onChangeText = (field: keyof LoginFormValues, value: string): void => {
    updateFormValues((draft) => {
      draft[field] = value;
    });
  };

  const handlePhoneChange = (text: string): void => {
    onChangeText('phone', text);
    updateUiState((draft) => {
      draft.isPhoneValid = text.length === 11;
    });
  };

  const handlePasswordChange = (text: string): void => {
    updateUiState((draft) => {
      draft.passwordInput = text;
    });
  };

  const handleClearPassword = (): void => {
    updateUiState((draft) => {
      draft.passwordInput = '';
    });
  };

  const handleToggleLoginMode = (): void => {
    updateUiState((draft) => {
      draft.isCodeLogin = !draft.isCodeLogin;
    });
  };

  const handleTogglePasswordVisibility = (): void => {
    updateUiState((draft) => {
      draft.obscurePassword = !draft.obscurePassword;
    });
  };

  const handleSendCode = async (): Promise<void> => {
    if (!isPhoneValid || countdown > 0) return;

    try {
      await sendSmsCode({ phone: phone.trim() });
      updateUiState((draft) => {
        draft.countdown = 60;
      });
      const timer = setInterval(() => {
        updateUiState((draft) => {
          if (draft.countdown <= 1) {
            clearInterval(timer);
            draft.countdown = 0;
            return;
          }
          draft.countdown -= 1;
        });
      }, 1000);
    } catch (error) {
      const message = error instanceof Error ? error.message : '发送验证码失败';
      Alert.alert('发送失败', message);
    }
  };

  const handleLoginPress = (): void => {
    handleLogin();
  };

  return {
    phone,
    code,
    submitting,
    getToRegister,
    onChangeText,
    handlePhoneChange,
    handlePasswordChange,
    handleClearPassword,
    handleToggleLoginMode,
    handleTogglePasswordVisibility,
    handleSendCode,
    handleLoginPress,
    passwordInput,
    isCodeLogin,
    countdown,
    obscurePassword,
    isPhoneValid,
  };
};

export default useLogin;
