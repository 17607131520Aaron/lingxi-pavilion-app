import { StyleSheet } from 'react-native';

import colors from '~/common/colors';

export const styles = StyleSheet.create({
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

export const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlayBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: colors.antTextSecondary,
    marginBottom: 8,
  },
  protocolRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  protocolItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  protocolItemSpacing: {
    marginRight: 24,
  },
  protocolRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  protocolRadioActive: {
    borderColor: colors.antPrimary,
  },
  protocolRadioInactive: {
    borderColor: colors.antBorderPrimary,
  },
  protocolRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.antPrimary,
  },
  protocolText: {
    fontSize: 14,
    color: colors.antTextPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.antBorderPrimary,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: colors.antBgSecondary,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: colors.antPrimary,
    marginLeft: 8,
  },
  resetButtonText: {
    color: colors.antTextSecondary,
  },
  saveButtonText: {
    color: colors.white,
  },
});
