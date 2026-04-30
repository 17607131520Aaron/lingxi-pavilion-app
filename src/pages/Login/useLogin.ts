import { type NavigationProp, type ParamListBase, useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { Alert } from 'react-native';

import { login, type LoginData } from '~/services/userServices.ts';
import { sendSmsCode } from '~/services/userServices.ts';
import useAuthStore from '~/stores/useAuthStore.ts';

import { type LoginFieldErrors, type LoginFormValues, type UseLoginReturn } from './types.ts';

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
  const [formValues, setFormValues] = useState<LoginFormValues>({
    phone: '',
    code: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<LoginFieldErrors>({});

  const [passwordInput, setPasswordInput] = useState('');
  const [isCodeLogin, setIsCodeLogin] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [obscurePassword, setObscurePassword] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const { phone, code } = formValues;

  const canSubmit = useMemo(() => {
    return phone.trim().length === 11 && code.length >= 4 && !submitting;
  }, [phone, code, submitting]);

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
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);

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
      setSubmitting(false);
    }
  };

  const getToRegister = (): void => {
    navigation.navigate('register');
  };

  const onChangeText = (field: keyof LoginFormValues, value: string): void => {
    setFormValues((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhoneChange = (text: string): void => {
    onChangeText('phone', text);
    setIsPhoneValid(text.length === 11);
  };

  const handleSendCode = async (): Promise<void> => {
    if (!isPhoneValid || countdown > 0) return;

    try {
      await sendSmsCode({ phone: phone.trim() });
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
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
    handleLogin,
    errors,
    submitting,
    canSubmit,
    getToRegister,
    onChangeText,
    handlePhoneChange,
    handleSendCode,
    handleLoginPress,
    passwordInput,
    setPasswordInput,
    isCodeLogin,
    setIsCodeLogin,
    countdown,
    setCountdown,
    obscurePassword,
    setObscurePassword,
    isPhoneValid,
  };
};

export default useLogin;
