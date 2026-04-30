import { type NavigationProp, type ParamListBase, useNavigation } from '@react-navigation/native';
import { useMemo, useState } from 'react';
import { Alert } from 'react-native';

import STORAGE_KEYS from '~/common/storage-keys.ts';
import { login } from '~/services/userServices.ts';
import storage from '~/utils/storage.ts';

interface LoginFormValues {
  account: string;
  password: string;
}

interface LoginFieldErrors {
  account?: string;
  password?: string;
}

const isAuthData = (value: unknown): value is { token: string; username: string } => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const maybeAuthData = value as { token?: unknown; username?: unknown };
  return typeof maybeAuthData.token === 'string' && typeof maybeAuthData.username === 'string';
};

const useLogin = (): {
  account: string;
  password: string;
  handleLogin: () => Promise<void>;
  errors: LoginFieldErrors;
  submitting: boolean;
  canSubmit: boolean;
  getToRegister: () => void;
  onChangeText: (field: keyof LoginFormValues, value: string) => void;
} => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [formValues, setFormValues] = useState<LoginFormValues>({
    account: '',
    password: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<LoginFieldErrors>({});

  const { account, password } = formValues;

  const canSubmit = useMemo(() => {
    return account.trim().length > 0 && password.length >= 6 && !submitting;
  }, [account, password, submitting]);

  const validate = (values: LoginFormValues): LoginFieldErrors => {
    const next: LoginFieldErrors = {};
    if (!values.account.trim()) next.account = '请输入手机号 / 邮箱 / 工号';
    if (!values.password) next.password = '请输入密码';
    if (values.password && values.password.length < 6) next.password = '密码至少 6 位';
    return next;
  };

  const handleLogin = async (): Promise<void> => {
    const nextErrors = validate(formValues);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    const username = account.trim();

    try {
      const response = await login({
        username,
        password,
      });
      if (!isAuthData(response)) {
        throw new Error('登录响应格式异常，请稍后重试。');
      }

      storage.setItemSync(STORAGE_KEYS.AUTH_TOKEN, response.token);
      storage.setItemSync(STORAGE_KEYS.USER_INFO, {
        username: response.username,
      });

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
    account,
    password,
    handleLogin,
    errors,
    submitting,
    canSubmit,
    getToRegister,
    onChangeText,
  };
};

export default useLogin;
