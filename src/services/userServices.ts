import { type ApiResponse, get, post } from '~/utils/request';

export interface LoginData {
  accessToken: string;
  refreshToken: string;
}

export interface UserInfo {
  userId: number;
  phone: string;
  nickname: string;
  avatar?: string;
  email?: string;
  createTime?: string;
}

export const sendSmsCode = (payload: { phone: string }): Promise<ApiResponse<void>> => {
  return post<void>('/app/auth/sms-code', payload);
};

export const login = (payload: {
  phone: string;
  code: string;
}): Promise<ApiResponse<LoginData>> => {
  return post<LoginData>('/app/auth/login', payload);
};

export const register = (payload: {
  phone: string;
  code: string;
  password: string;
}): Promise<ApiResponse<void>> => {
  return post<void>('/app/auth/register', payload);
};

export const getUserInfo = (): Promise<ApiResponse<UserInfo>> => {
  return get<UserInfo>('/app/auth/info');
};
