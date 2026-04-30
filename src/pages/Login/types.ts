import { type Dispatch, type SetStateAction } from 'react';

export interface LoginFormValues {
  phone: string;
  code: string;
}

export interface LoginFieldErrors {
  phone?: string;
  code?: string;
}

export interface UseLoginReturn {
  phone: string;
  code: string;
  handleLogin: () => Promise<void>;
  errors: LoginFieldErrors;
  submitting: boolean;
  canSubmit: boolean;
  getToRegister: () => void;
  onChangeText: (field: keyof LoginFormValues, value: string) => void;
  handlePhoneChange: (text: string) => void;
  handleSendCode: () => Promise<void>;
  handleLoginPress: () => void;
  passwordInput: string;
  setPasswordInput: Dispatch<SetStateAction<string>>;
  isCodeLogin: boolean;
  setIsCodeLogin: Dispatch<SetStateAction<boolean>>;
  countdown: number;
  setCountdown: Dispatch<SetStateAction<number>>;
  obscurePassword: boolean;
  setObscurePassword: Dispatch<SetStateAction<boolean>>;
  isPhoneValid: boolean;
}
