import { type FC, useEffect, useMemo } from 'react';
import {
  Alert,
  Animated,
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

import useLogin from './useLogin.ts';

const LoginPage: FC = () => {
  const {
    account,
    handleLogin,
    errors,
    submitting,
    canSubmit,
    getToRegister,
    onChangeText,
    password,
  } = useLogin();

  const glowAnim = useMemo(() => new Animated.Value(0), []);
  const gridAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    const glowLoop = Animated.loop(
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 6800,
        useNativeDriver: true,
      }),
    );
    const gridLoop = Animated.loop(
      Animated.timing(gridAnim, {
        toValue: 1,
        duration: 12000,
        useNativeDriver: true,
      }),
    );
    glowLoop.start();
    gridLoop.start();
    return () => {
      glowLoop.stop();
      gridLoop.stop();
    };
  }, [glowAnim, gridAnim]);

  const glow1TranslateX = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [-40, 30] });
  const glow1TranslateY = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [10, -20] });
  const glow2TranslateX = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [20, -30] });
  const glow2TranslateY = glowAnim.interpolate({ inputRange: [0, 1], outputRange: [-10, 25] });
  const gridTranslateY = gridAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -28] });

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.root}>
        <View style={styles.bgBase} />
        <View pointerEvents='none' style={styles.bgNoise} />

        <Animated.View
          pointerEvents='none'
          style={[
            styles.grid,
            {
              transform: [{ translateY: gridTranslateY }],
            },
          ]}
        />

        <Animated.View
          pointerEvents='none'
          style={[
            styles.glowBallCyan,
            {
              transform: [{ translateX: glow1TranslateX }, { translateY: glow1TranslateY }],
            },
          ]}
        />
        <Animated.View
          pointerEvents='none'
          style={[
            styles.glowBallPurple,
            {
              transform: [{ translateX: glow2TranslateX }, { translateY: glow2TranslateY }],
            },
          ]}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <Text style={styles.brandLine}>BURLINGTON</Text>
              <Text style={styles.title}>AI 智能登录</Text>
              <Text style={styles.subtitle}>安全 · 快速 · 低打扰</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>欢迎回来</Text>

              <View style={styles.field}>
                <Text style={styles.label}>账号</Text>
                <TextInput
                  autoCapitalize='none'
                  autoCorrect={false}
                  keyboardType='email-address'
                  placeholder='手机号 / 邮箱 / 工号'
                  placeholderTextColor={colors.white35}
                  returnKeyType='next'
                  style={[styles.input, errors.account && styles.inputError]}
                  value={account}
                  onChangeText={(v) => onChangeText(v)}
                />
                {!!errors.account && <Text style={styles.errorText}>{errors.account}</Text>}
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>密码</Text>
                <TextInput
                  secureTextEntry
                  autoCapitalize='none'
                  placeholder='输入密码'
                  placeholderTextColor={colors.white35}
                  returnKeyType='done'
                  style={[styles.input, errors.password && styles.inputError]}
                  value={password}
                  onChangeText={(v) => onChangeText(v, 'password')}
                  onSubmitEditing={handleLogin}
                />
                {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              <View style={styles.actions}>
                <CustomButton
                  disabled={!canSubmit}
                  style={[styles.loginButton, !canSubmit && styles.loginButtonDisabled]}
                  title={submitting ? '登录中...' : '登录'}
                  onPress={handleLogin}
                />

                <View style={styles.linkRow}>
                  <Pressable
                    hitSlop={8}
                    onPress={() => {
                      Alert.alert('忘记密码', '请联系管理员或使用短信找回流程（待接入）。');
                    }}
                  >
                    <Text style={styles.linkText}>忘记密码</Text>
                  </Pressable>

                  <View style={styles.linkDivider} />

                  <Pressable hitSlop={8} onPress={getToRegister}>
                    <Text style={styles.linkText}>去注册</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                登录即代表你同意 <Text style={styles.footerLink}>用户协议</Text> 与{' '}
                <Text style={styles.footerLink}>隐私政策</Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.bg1 },
  root: {
    flex: 1,
    backgroundColor: colors.bg1,
  },
  bgBase: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.bg1,
  },
  bgNoise: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.18,
    backgroundColor: colors.transparent,
  },
  grid: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    opacity: 0.18,
    backgroundColor: colors.transparent,
    transform: [{ translateY: 0 }],
  },
  glowBallCyan: {
    position: 'absolute',
    top: -90,
    left: -70,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: colors.neonCyan,
    opacity: 0.14,
  },
  glowBallPurple: {
    position: 'absolute',
    bottom: -120,
    right: -90,
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: colors.neonPurple,
    opacity: 0.16,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 22,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 18,
  },
  brandLine: {
    color: colors.white60,
    letterSpacing: 3.2,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: '800',
    color: colors.white85,
  },
  subtitle: {
    marginTop: 8,
    color: colors.white66,
    fontSize: 14,
  },
  card: {
    marginTop: 10,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.white14,
    backgroundColor: colors.cardBg,
    shadowColor: colors.glowPurple,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 22,
    overflow: 'hidden',
  },

  cardTitle: {
    color: colors.white85,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  field: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    color: colors.white66,
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: colors.white85,
    backgroundColor: colors.fieldBg,
    borderWidth: 1,
    borderColor: colors.white10,
  },
  inputError: {
    borderColor: colors.errorRed,
  },
  errorText: {
    marginTop: 8,
    color: colors.errorRed,
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    marginTop: 8,
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: colors.primary,
    shadowColor: colors.glowPrimary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 6,
  },
  loginButtonDisabled: {
    backgroundColor: colors.buttonDisabled1,
  },
  linkRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    color: colors.linkBlue,
    fontSize: 13,
    fontWeight: '700',
  },
  linkDivider: {
    width: 1,
    height: 12,
    backgroundColor: colors.white22,
    marginHorizontal: 12,
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    color: colors.white55,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: colors.white75,
    fontWeight: '700',
  },
});

export default LoginPage;
