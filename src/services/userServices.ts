import { type ApiResponse, post } from '~/utils/request';

export interface AuthData {
  token: string;
  username: string;
}

export const login = async (payload: {
  username: string;
  password: string;
}): Promise<AuthData | ApiResponse<AuthData>> => {
  return post<AuthData>('/auth/login', payload);
};

export const register = (payload: {
  username: string;
  password: string;
}): Promise<AuthData | ApiResponse<AuthData>> => {
  return post<AuthData>('/auth/register', payload);
};
