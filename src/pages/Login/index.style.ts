import { StyleSheet } from 'react-native';

import colors from '~/common/colors';

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: {
    flex: 1,
    backgroundColor: colors.antBgPrimary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: colors.antTextPrimary,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: colors.antPrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoIcon: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.antPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIconText: {
    fontSize: 36,
    color: colors.white,
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.antTextPrimary,
    marginBottom: 8,
  },
  logoSubtitle: {
    fontSize: 14,
    color: colors.antTextTertiary,
  },
  inputContainer: {
    marginBottom: 16,
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
  },
  sendCodeButtonDisabled: {
    opacity: 0.5,
  },
  sendCodeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.antPrimary,
  },
  sendCodeTextDisabled: {
    color: colors.antTextQuaternary,
  },
  passwordInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.antBgSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
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
  switchContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
    marginTop: 8,
  },
  switchText: {
    fontSize: 13,
    color: colors.antPrimary,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  loginButton: {
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.antPrimary,
  },
  loginButtonDisabled: {
    backgroundColor: `${colors.antPrimary}66`,
  },
  registerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  registerText: {
    fontSize: 14,
    color: colors.antTextTertiary,
  },
  registerLink: {
    color: colors.antPrimary,
    fontWeight: '500',
  },
  agreementContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
  thirdPartyContainer: {
    marginBottom: 40,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: colors.antBorderSecondary,
  },
  dividerText: {
    fontSize: 12,
    color: colors.antTextQuaternary,
    paddingHorizontal: 16,
  },
  thirdPartyButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  thirdPartyButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.antBgSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thirdPartyIcon: {
    fontSize: 26,
  },
});

export default styles;
