import { type FC, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import colors from '~/common/colors.ts';
import CustomButton from '~/components/CustomButton';

import styles from './index.style.ts';
import useLogin from './useLogin.ts';

const LoginPage: FC = () => {
  const { handleLogin, submitting, getToRegister } = useLogin();

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isCodeLogin, setIsCodeLogin] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [obscurePassword, setObscurePassword] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const handlePhoneChange = (text: string): void => {
    setPhone(text);
    setIsPhoneValid(text.length === 11);
  };

  const handleSendCode = (): void => {
    if (!isPhoneValid || countdown > 0) return;

    // 模拟发送验证码
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
  };

  const handleLoginPress = (): void => {
    // 这里可以调用实际的登录逻辑
    handleLogin();
  };

  const canLogin = isPhoneValid && (isCodeLogin ? code.length >= 4 : passwordInput.length >= 6);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps='handled'
          showsVerticalScrollIndicator={false}
        >
          {/* Logo 部分 */}
          <View style={styles.logoContainer}>
            <View style={styles.logoIconContainer}>
              <View style={styles.logoIcon}>
                <Text style={styles.logoIconText}>✦</Text>
              </View>
            </View>
            <Text style={styles.logoTitle}>领狗通 AI</Text>
            <Text style={styles.logoSubtitle}>智能助手，随时为您服务</Text>
          </View>

          {/* 手机号输入框 */}
          <View style={styles.inputContainer}>
            <View style={styles.phoneInputRow}>
              <Text style={styles.phonePrefix}>+86</Text>
              <Text style={styles.phoneArrow}>▼</Text>
              <View style={styles.phoneDivider} />
              <TextInput
                keyboardType='phone-pad'
                maxLength={11}
                placeholder='请输入手机号'
                placeholderTextColor={colors.antTextQuaternary}
                style={styles.phoneInput}
                value={phone}
                onChangeText={handlePhoneChange}
              />
              {phone.length > 0 && (
                <Pressable
                  style={styles.clearButton}
                  onPress={() => {
                    setPhone('');
                    setIsPhoneValid(false);
                  }}
                >
                  <Text style={styles.clearIcon}>✕</Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* 验证码/密码输入框 */}
          <View style={styles.inputContainer}>
            {isCodeLogin ? (
              <View style={styles.codeInputRow}>
                <TextInput
                  keyboardType='number-pad'
                  maxLength={6}
                  placeholder='请输入验证码'
                  placeholderTextColor={colors.antTextQuaternary}
                  style={styles.codeInput}
                  value={code}
                  onChangeText={setCode}
                />
                <Pressable
                  disabled={!isPhoneValid || countdown > 0}
                  style={[styles.sendCodeButton, !isPhoneValid && styles.sendCodeButtonDisabled]}
                  onPress={handleSendCode}
                >
                  <Text style={[styles.sendCodeText, !isPhoneValid && styles.sendCodeTextDisabled]}>
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.passwordInputRow}>
                <TextInput
                  placeholder='请输入密码'
                  placeholderTextColor={colors.antTextQuaternary}
                  secureTextEntry={obscurePassword}
                  style={styles.passwordInput}
                  value={passwordInput}
                  onChangeText={setPasswordInput}
                />
                <Pressable
                  style={styles.togglePasswordButton}
                  onPress={() => setObscurePassword(!obscurePassword)}
                >
                  <Text style={styles.togglePasswordIcon}>{obscurePassword ? '👁️' : '👁️‍🗨️'}</Text>
                </Pressable>
                {passwordInput.length > 0 && (
                  <Pressable style={styles.clearButton} onPress={() => setPasswordInput('')}>
                    <Text style={styles.clearIcon}>✕</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>

          {/* 登录模式切换 */}
          <View style={styles.switchContainer}>
            <Pressable onPress={() => setIsCodeLogin(!isCodeLogin)}>
              <Text style={styles.switchText}>{isCodeLogin ? '密码登录' : '验证码登录'}</Text>
            </Pressable>
          </View>

          {/* 登录按钮 */}
          <View style={styles.buttonContainer}>
            <CustomButton
              disabled={!canLogin || submitting}
              style={[styles.loginButton, (!canLogin || submitting) && styles.loginButtonDisabled]}
              title={submitting ? '登录中...' : '登录'}
              onPress={handleLoginPress}
            />
          </View>

          {/* 注册入口 */}
          <View style={styles.registerContainer}>
            <Pressable onPress={getToRegister}>
              <Text style={styles.registerText}>
                还没有账号？ <Text style={styles.registerLink}>去注册</Text>
              </Text>
            </Pressable>
          </View>

          {/* 用户协议 */}
          <View style={styles.agreementContainer}>
            <Text style={styles.agreementText}>
              登录即代表同意 <Text style={styles.agreementLink}>《用户协议》</Text> 和{' '}
              <Text style={styles.agreementLink}>《隐私政策》</Text>
            </Text>
          </View>

          {/* 第三方登录 */}
          <View style={styles.thirdPartyContainer}>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>其他登录方式</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.thirdPartyButtons}>
              <Pressable style={styles.thirdPartyButton} onPress={() => {}}>
                <Text style={styles.thirdPartyIcon}>💬</Text>
              </Pressable>
              <Pressable style={styles.thirdPartyButton} onPress={() => {}}>
                <Text style={styles.thirdPartyIcon}>🍎</Text>
              </Pressable>
              <Pressable style={styles.thirdPartyButton} onPress={() => {}}>
                <Text style={styles.thirdPartyIcon}>🌐</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginPage;
