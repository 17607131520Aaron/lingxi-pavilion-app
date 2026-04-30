export interface LoginFormValues {
  phone: string;
  code: string;
}

export interface LoginFieldErrors {
  phone?: string;
  code?: string;
  password?: string;
}

export interface UseLoginReturn {
  phone: string;
  code: string;
  submitting: boolean;
  getToRegister: () => void;
  onChangeText: (field: keyof LoginFormValues, value: string) => void;
  handlePhoneChange: (text: string) => void;
  handlePasswordChange: (text: string) => void;
  handleClearPassword: () => void;
  handleToggleLoginMode: () => void;
  handleTogglePasswordVisibility: () => void;
  handleSendCode: () => Promise<void>;
  handleLoginPress: () => void;
  passwordInput: string;
  isCodeLogin: boolean;
  countdown: number;
  obscurePassword: boolean;
  isPhoneValid: boolean;
}

export interface LoginUiState {
  submitting: boolean;
  passwordInput: string;
  isCodeLogin: boolean;
  countdown: number;
  obscurePassword: boolean;
  isPhoneValid: boolean;
}
