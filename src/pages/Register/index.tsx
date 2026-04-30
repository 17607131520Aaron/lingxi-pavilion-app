import { type FC, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import colors from '~/common/colors.ts';
import CustomButton from '~/components/CustomButton';

const RegisterPage: FC = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [obscurePassword, setObscurePassword] = useState(true);
  const [obscureConfirm, setObscureConfirm] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const getPasswordStrength = (): string => {
    if (password.length === 0) return '';
    if (password.length < 6) return '弱';
    if (password.length < 10) return '中';
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (hasLetter && hasDigit && hasSpecial) return '强';
    if (hasLetter && hasDigit) return '中';
    return '弱';
  };

  const getStrengthColor = () => {
    const strength = getPasswordStrength();
    switch (strength) {
      case '弱':
        return colors.antError;
      case '中':
        return colors.antWarning;
      case '强':
        return colors.antSuccess;
      default:
        return colors.antBorderSecondary;
    }
  };

  const getStrengthPercent = (): number => {
    const strength = getPasswordStrength();
    switch (strength) {
      case '弱':
        return 0.33;
      case '中':
        return 0.66;
      case '强':
        return 1.0;
      default:
        return 0;
    }
  };

  const canRegister =
    isPhoneValid && code.length >= 4 && password.length >= 6 && password === confirmPassword;

  const handleRegister = (): void => {
    if (!canRegister || submitting) return;

    setSubmitting(true);
    // 模拟注册请求
    setTimeout(() => {
      setSubmitting(false);
      // 这里可以添加注册成功后的逻辑
    }, 1500);
  };

  const passwordStrength = getPasswordStrength();
  const strengthColor = getStrengthColor();
  const strengthPercent = getStrengthPercent();

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
          {/* 头部 */}
          <View style={styles.headerContainer}>
            <View style={styles.headerRow}>
              <View style={styles.logoIconContainer}>
                <View style={styles.logoIcon}>
                  <Text style={styles.logoIconText}>✦</Text>
                </View>
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>创建账号</Text>
                <Text style={styles.headerSubtitle}>开启智能AI之旅</Text>
              </View>
            </View>
          </View>

          {/* 新用户福利卡片 */}
          <View style={styles.benefitsCard}>
            <View style={styles.benefitsHeader}>
              <Text style={styles.benefitsIcon}>🎁</Text>
              <Text style={styles.benefitsTitle}>新用户福利</Text>
            </View>
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>⭐</Text>
                <Text style={styles.benefitText}>赠送 100 次免费对话额度</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>🏆</Text>
                <Text style={styles.benefitText}>解锁 Pro 会员体验 3 天</Text>
              </View>
              <View style={styles.benefitItem}>
                <Text style={styles.benefitIcon}>⚡</Text>
                <Text style={styles.benefitText}>优先体验最新 AI 模型</Text>
              </View>
            </View>
          </View>

          {/* 表单部分 */}
          <View style={styles.formContainer}>
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

            {/* 验证码输入框 */}
            <View style={styles.inputContainer}>
              <View style={styles.codeInputRow}>
                <Text style={styles.codeIcon}>🛡️</Text>
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
                  style={[
                    styles.sendCodeButton,
                    !isPhoneValid && styles.sendCodeButtonDisabled,
                    isPhoneValid && styles.sendCodeButtonActive,
                  ]}
                  onPress={handleSendCode}
                >
                  <Text
                    style={[
                      styles.sendCodeText,
                      !isPhoneValid && styles.sendCodeTextDisabled,
                      isPhoneValid && styles.sendCodeTextActive,
                    ]}
                  >
                    {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* 密码输入框 */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordInputRow}>
                <Text style={styles.passwordIcon}>🔒</Text>
                <TextInput
                  placeholder='请设置密码（不少于6位）'
                  placeholderTextColor={colors.antTextQuaternary}
                  secureTextEntry={obscurePassword}
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable
                  style={styles.togglePasswordButton}
                  onPress={() => setObscurePassword(!obscurePassword)}
                >
                  <Text style={styles.togglePasswordIcon}>{obscurePassword ? '👁️' : '👁️‍🗨️'}</Text>
                </Pressable>
              </View>
            </View>

            {/* 密码强度指示器 */}
            {password.length > 0 && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBarContainer}>
                  <View
                    style={[
                      styles.strengthBar,
                      {
                        width: `${strengthPercent * 100}%`,
                        backgroundColor: strengthColor,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.strengthText, { color: strengthColor }]}>
                  密码强度：{passwordStrength}
                </Text>
              </View>
            )}

            {/* 确认密码输入框 */}
            <View style={styles.inputContainer}>
              <View style={styles.passwordInputRow}>
                <Text style={styles.passwordIcon}>🔒</Text>
                <TextInput
                  placeholder='请确认密码'
                  placeholderTextColor={colors.antTextQuaternary}
                  secureTextEntry={obscureConfirm}
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <Pressable
                  style={styles.togglePasswordButton}
                  onPress={() => setObscureConfirm(!obscureConfirm)}
                >
                  <Text style={styles.togglePasswordIcon}>{obscureConfirm ? '👁️' : '👁️‍🗨️'}</Text>
                </Pressable>
              </View>
            </View>

            {/* 密码不一致提示 */}
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>两次密码输入不一致</Text>
              </View>
            )}

            {/* 注册按钮 */}
            <View style={styles.buttonContainer}>
              <CustomButton
                disabled={!canRegister || submitting}
                style={[
                  styles.registerButton,
                  (!canRegister || submitting) && styles.registerButtonDisabled,
                ]}
                title={submitting ? '注册中...' : '注册'}
                onPress={handleRegister}
              />
            </View>
          </View>

          {/* 登录入口 */}
          <View style={styles.loginContainer}>
            <Pressable onPress={() => {}}>
              <Text style={styles.loginText}>
                已有账号？ <Text style={styles.loginLink}>去登录</Text>
              </Text>
            </Pressable>
          </View>

          {/* 用户协议 */}
          <View style={styles.agreementContainer}>
            <Text style={styles.agreementText}>
              注册即代表同意 <Text style={styles.agreementLink}>《用户协议》</Text> 和{' '}
              <Text style={styles.agreementLink}>《隐私政策》</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: colors.antBgPrimary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  headerContainer: {
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    marginRight: 12,
  },
  logoIcon: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.antPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIconText: {
    fontSize: 24,
    color: colors.white,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.antTextPrimary,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.antTextTertiary,
  },
  benefitsCard: {
    padding: 16,
    backgroundColor: `${colors.antPrimary}0F`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.antPrimary}26`,
    marginBottom: 28,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitsIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.antPrimary,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitIcon: {
    fontSize: 16,
    marginRight: 8,
    opacity: 0.7,
  },
  benefitText: {
    fontSize: 13,
    color: colors.antTextSecondary,
  },
  formContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 14,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.antBgSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  phonePrefix: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.antTextPrimary,
    marginRight: 4,
  },
  phoneArrow: {
    fontSize: 12,
    color: colors.antTextTertiary,
    marginRight: 12,
  },
  phoneDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.antBorderSecondary,
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: colors.antTextPrimary,
    padding: 0,
  },
  clearButton: {
    padding: 12,
  },
  clearIcon: {
    fontSize: 16,
    color: colors.antTextQuaternary,
  },
  codeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.antBgSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  codeIcon: {
    fontSize: 20,
    color: colors.antTextTertiary,
    marginRight: 8,
  },
  codeInput: {
    flex: 1,
    fontSize: 16,
    color: colors.antTextPrimary,
    padding: 0,
    letterSpacing: 8,
  },
  sendCodeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  sendCodeButtonDisabled: {
    backgroundColor: 'transparent',
  },
  sendCodeButtonActive: {
    backgroundColor: `${colors.antPrimary}1A`,
  },
  sendCodeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sendCodeTextDisabled: {
    color: colors.antTextQuaternary,
  },
  sendCodeTextActive: {
    color: colors.antPrimary,
  },
  passwordInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.antBgSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  passwordIcon: {
    fontSize: 20,
    color: colors.antTextTertiary,
    marginRight: 8,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: colors.antTextPrimary,
    padding: 0,
  },
  togglePasswordButton: {
    padding: 12,
  },
  togglePasswordIcon: {
    fontSize: 20,
    color: colors.antTextTertiary,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 8,
  },
  strengthBarContainer: {
    flex: 1,
    height: 3,
    backgroundColor: colors.antBorderSecondary,
    borderRadius: 2,
    marginRight: 8,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
  },
  errorContainer: {
    marginBottom: 14,
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.antError,
  },
  buttonContainer: {
    marginTop: 28,
  },
  registerButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.antPrimary,
  },
  registerButtonDisabled: {
    backgroundColor: `${colors.antPrimary}66`,
  },
  loginContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 14,
    color: colors.antTextTertiary,
  },
  loginLink: {
    color: colors.antPrimary,
    fontWeight: '500',
  },
  agreementContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  agreementText: {
    fontSize: 12,
    color: colors.antTextTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
  agreementLink: {
    color: colors.antPrimary,
  },
});

export default RegisterPage;
