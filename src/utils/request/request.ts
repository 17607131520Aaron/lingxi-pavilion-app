import axios, { type AxiosRequestConfig, type Method } from 'axios';
import { Alert } from 'react-native';

import { ROUTE_REDIRECT_KEYS } from '~/common/route-redirect';
import STORAGE_KEYS from '~/common/storage-keys';
import { emitRouteRedirectByBusinessKey } from '~/utils/request/routeRedirect';
import storage from '~/utils/storage';

export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  messages: string;
}

const requestInstance = axios.create({
  timeout: 15_000,
  baseURL: 'http://localhost:9000',
});

const getToken = (): string | null => {
  const token = storage.getItemSync<string>(STORAGE_KEYS.AUTH_TOKEN);
  if (!token || typeof token !== 'string') {
    return null;
  }
  return token;
};

const showErrorMessage = (message: string): void => {
  Alert.alert('请求失败', message);
};

requestInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

requestInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        emitRouteRedirectByBusinessKey(ROUTE_REDIRECT_KEYS.UNAUTHORIZED);
      }
      const message =
        (error.response?.data as Partial<ApiResponse> | undefined)?.messages ??
        error.message ??
        '网络异常，请稍后重试';
      showErrorMessage(message);
    } else {
      showErrorMessage('请求失败，请稍后重试');
    }

    return Promise.reject(error);
  },
);

export type RequestConfig = AxiosRequestConfig & {
  withRawResponse?: boolean;
  showErrorTip?: boolean;
};

const request = async <T = unknown>(config: RequestConfig): Promise<T | ApiResponse<T>> => {
  const { withRawResponse = false, showErrorTip = true, ...axiosConfig } = config;
  try {
    const response = await requestInstance.request<ApiResponse<T>>(axiosConfig);
    const payload = response.data;

    if (payload.code !== 0) {
      if (showErrorTip) {
        showErrorMessage(payload.messages ?? '请求失败，请稍后重试');
      }
      if (payload.code === 401) {
        emitRouteRedirectByBusinessKey(ROUTE_REDIRECT_KEYS.UNAUTHORIZED);
      }
      throw new Error(payload.messages ?? '请求失败，请稍后重试');
    }

    return withRawResponse ? payload : payload.data;
  } catch (error) {
    if (showErrorTip && !axios.isAxiosError(error)) {
      showErrorMessage(error instanceof Error ? error.message : '请求失败，请稍后重试');
    }
    throw error;
  }
};

const createMethod =
  (method: Method) =>
  <T = unknown>(
    url: string,
    dataOrParams?: Record<string, unknown>,
    config: RequestConfig = {},
  ): Promise<T | ApiResponse<T>> => {
    const nextConfig: RequestConfig = { ...config, url, method };

    if (method.toLowerCase() === 'get' || method.toLowerCase() === 'delete') {
      nextConfig.params = dataOrParams;
    } else {
      nextConfig.data = dataOrParams;
    }

    return request<T>(nextConfig);
  };

const get = createMethod('GET');
const post = createMethod('POST');
const put = createMethod('PUT');
const patch = createMethod('PATCH');
const del = createMethod('DELETE');

export { del, get, post, put, patch, request, requestInstance };
