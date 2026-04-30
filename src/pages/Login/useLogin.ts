import { type NavigationProp, type ParamListBase, useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { Alert } from 'react-native';

import STORAGE_KEYS from '~/common/storage-keys.ts';
import { login, type LoginData } from '~/services/userServices.ts';
import storage from '~/utils/storage.ts';

interface LoginFormValues {
  phone: string;
  code: string;
}

interface LoginFieldErrors {
  phone?: string;
  code?: string;
}

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

const useLogin = (): {
  phone: string;
  code: string;
  handleLogin: () => Promise<void>;
  errors: LoginFieldErrors;
  submitting: boolean;
  canSubmit: boolean;
  getToRegister: () => void;
  onChangeText: (field: keyof LoginFormValues, value: string) => void;
} => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [formValues, setFormValues] = useState<LoginFormValues>({
    phone: '',
    code: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<LoginFieldErrors>({});

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

      storage.setItemSync(STORAGE_KEYS.AUTH_TOKEN, response.data.accessToken);
      storage.setItemSync(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);

      Alert.alert('登录成功', '欢迎回来。');
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : '登录失败，请稍后重试。';
      Alert.alert('登录失败', message);
    } finally {
      setSubmitting(false);
    }
  };

  // 去注册
  const getToRegister = (): void => {
    navigation.navigate('register');
  };

  const onChangeText = (field: keyof LoginFormValues, value: string): void => {
    setFormValues((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
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
  };
};

export default useLogin;
