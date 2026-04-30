import { type FC, useCallback, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import RNRestart from 'react-native-restart';
import { SafeAreaView } from 'react-native-safe-area-context';

import colors from '~/common/colors.ts';
import CustomButton from '~/components/CustomButton';
import storage from '~/utils/storage.ts';

import { modalStyles, styles } from './index.style.ts';
import useLogin from './useLogin.ts';

const API_URL_STORAGE_KEY = 'custom_api_base_url';

const LoginPage: FC = () => {
  const [showApiConfig, setShowApiConfig] = useState(false);
  const [protocol, setProtocol] = useState<'http' | 'https'>('http');
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoPress = useCallback(() => {
    tapCountRef.current += 1;

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      const savedUrl = storage.getItemSync<string>(API_URL_STORAGE_KEY) ?? '';
      if (savedUrl) {
        try {
          const url = new URL(savedUrl);
          setProtocol(url.protocol === 'https:' ? 'https' : 'http');
          setHost(url.hostname);
          setPort(url.port || '');
        } catch {
          setProtocol('http');
          setHost('');
          setPort('');
        }
      } else {
        setProtocol('http');
        setHost('');
        setPort('');
      }
      setShowApiConfig(true);
      return;
    }

    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 500);
  }, []);

  const handleSaveApiUrl = useCallback(() => {
    const trimmedHost = host.trim();
    if (!trimmedHost) {
      Alert.alert('错误', '请输入 IP 地址');
      return;
    }
    const portStr = port.trim() ? `:${port.trim()}` : '';
    const fullUrl = `${protocol}://${trimmedHost}${portStr}`;
    storage.setItemSync(API_URL_STORAGE_KEY, fullUrl);
    setShowApiConfig(false);
    Alert.alert('提示', '配置已保存，正在重启应用...', [
      { text: '确定', onPress: () => RNRestart.restart() },
    ]);
  }, [protocol, host, port]);
  const {
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
  } = useLogin();

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
          <Pressable style={styles.logoContainer} onPress={handleLogoPress}>
            <View style={styles.logoIconContainer}>
              <View style={styles.logoIcon}>
                <Text style={styles.logoIconText}>✦</Text>
              </View>
            </View>
            <Text style={styles.logoTitle}>领狗通 AI</Text>
            <Text style={styles.logoSubtitle}>智能助手，随时为您服务</Text>
          </Pressable>

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
                    handlePhoneChange('');
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
                  onChangeText={(text) => onChangeText('code', text)}
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
                  onChangeText={handlePasswordChange}
                />
                <Pressable
                  style={styles.togglePasswordButton}
                  onPress={handleTogglePasswordVisibility}
                >
                  <Text style={styles.togglePasswordIcon}>{obscurePassword ? '👁️' : '👁️‍🗨️'}</Text>
                </Pressable>
                {passwordInput.length > 0 && (
                  <Pressable style={styles.clearButton} onPress={handleClearPassword}>
                    <Text style={styles.clearIcon}>✕</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>

          {/* 登录模式切换 */}
          <View style={styles.switchContainer}>
            <Pressable onPress={handleToggleLoginMode}>
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

      <Modal
        transparent
        animationType='fade'
        visible={showApiConfig}
        onRequestClose={() => setShowApiConfig(false)}
      >
        <Pressable style={modalStyles.backdrop} onPress={() => setShowApiConfig(false)}>
          <Pressable style={modalStyles.container} onPress={(e) => e.stopPropagation()}>
            <Text style={modalStyles.title}>接口配置</Text>

            <Text style={modalStyles.label}>协议</Text>
            <View style={modalStyles.protocolRow}>
              <Pressable
                style={[modalStyles.protocolItem, modalStyles.protocolItemSpacing]}
                onPress={() => setProtocol('http')}
              >
                <View
                  style={[
                    modalStyles.protocolRadio,
                    protocol === 'http'
                      ? modalStyles.protocolRadioActive
                      : modalStyles.protocolRadioInactive,
                  ]}
                >
                  {protocol === 'http' && <View style={modalStyles.protocolRadioDot} />}
                </View>
                <Text style={modalStyles.protocolText}>HTTP</Text>
              </Pressable>

              <Pressable style={modalStyles.protocolItem} onPress={() => setProtocol('https')}>
                <View
                  style={[
                    modalStyles.protocolRadio,
                    protocol === 'https'
                      ? modalStyles.protocolRadioActive
                      : modalStyles.protocolRadioInactive,
                  ]}
                >
                  {protocol === 'https' && <View style={modalStyles.protocolRadioDot} />}
                </View>
                <Text style={modalStyles.protocolText}>HTTPS</Text>
              </Pressable>
            </View>

            <Text style={modalStyles.label}>IP 地址</Text>
            <TextInput
              autoCapitalize='none'
              autoCorrect={false}
              keyboardType='url'
              placeholder='如: 192.168.1.6'
              placeholderTextColor={colors.antTextTertiary}
              style={modalStyles.input}
              value={host}
              onChangeText={setHost}
            />

            <Text style={modalStyles.label}>端口</Text>
            <TextInput
              keyboardType='number-pad'
              maxLength={5}
              placeholder='如: 9000'
              placeholderTextColor={colors.antTextTertiary}
              style={modalStyles.input}
              value={port}
              onChangeText={setPort}
            />

            <View style={modalStyles.actionRow}>
              <Pressable
                style={[modalStyles.actionButton, modalStyles.resetButton]}
                onPress={() => {
                  storage.removeItem(API_URL_STORAGE_KEY);
                  setProtocol('http');
                  setHost('');
                  setPort('');
                  setShowApiConfig(false);
                  Alert.alert('提示', '已恢复默认配置，正在重启应用...', [
                    { text: '确定', onPress: () => RNRestart.restart() },
                  ]);
                }}
              >
                <Text style={modalStyles.resetButtonText}>恢复默认</Text>
              </Pressable>

              <Pressable
                style={[modalStyles.actionButton, modalStyles.saveButton]}
                onPress={handleSaveApiUrl}
              >
                <Text style={modalStyles.saveButtonText}>保存</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default LoginPage;
