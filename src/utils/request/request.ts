import NetInfo from '@react-native-community/netinfo';
import axios, { AxiosHeaders } from 'axios';

import { getEnvConfig } from '~/common/api';
import { getAuthToken } from '~/utils/getUserStorage';

import { notifyRequestSubscribers } from './requestSubscriber';

import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type {
  ApiResponse,
  RequestConfig,
  RequestInterceptorFulfilled,
  RequestInterceptorRejected,
  RequestOptions,
  ResponseInterceptorFulfilled,
  ResponseInterceptorRejected,
} from '~/types/request';

const envConfig = getEnvConfig('test');

// 请求层职责：
// 1. 统一创建 axios 实例
// 2. 自动注入鉴权 token
// 3. 统一解包业务响应结构
// 4. 统一广播成功、业务失败、HTTP 失败和网络状态事件
const DEFAULT_TIMEOUT = 10000;
const SUCCESS_CODES = [0, 200, '0', '200'];
const EMPTY_SUCCESS_PAYLOADS: readonly unknown[] = [null, undefined];
const BASE_URL = envConfig?.BASE_URL;

// 某些接口成功时不会返回 data，这里兼容成布尔成功态。
const shouldTransformEmptyToTrue = (config?: RequestOptions): boolean =>
  config?.transformEmptyToTrue ?? true;

// 统一提取后端可展示文案，避免页面层重复兜底。
const resolveResponseMessage = (payload?: Partial<ApiResponse<unknown>>): string => {
  if (!payload) {
    return '请求失败，请稍后重试';
  }

  if (typeof payload.messages === 'string' && payload.messages.trim()) {
    return payload.messages;
  }

  if ('code' in payload && payload.code !== undefined) {
    return `请求失败，状态码：${String(payload.code)}`;
  }

  return '请求失败，请稍后重试';
};

// 兼容“标准业务响应”和“直接返回数据”两类后端风格。
const isBusinessResponse = <T>(value: unknown): value is ApiResponse<T> => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const payload = value as Partial<ApiResponse<T>>;
  return 'code' in payload && 'messages' in payload && 'data' in payload;
};

const normalizeSuccessPayload = <T>(payload: T): T => {
  if (EMPTY_SUCCESS_PAYLOADS.includes(payload)) {
    return true as T;
  }
  return payload;
};

// 把取消、超时、HTTP 状态和普通异常统一映射成可读错误文案。
const extractErrorMessage = (error: AxiosError<ApiResponse<unknown>>): string => {
  if (axios.isCancel(error)) {
    return '请求已取消';
  }

  if (error.code === 'ECONNABORTED') {
    return '请求超时，请稍后重试';
  }

  const responseMessage = resolveResponseMessage(error.response?.data);
  if (error.response?.status === 401) {
    return responseMessage || '登录状态已失效，请重新登录';
  }

  if (error.response?.status === 403) {
    return responseMessage || '暂无权限访问该接口';
  }

  if (error.response?.status === 404) {
    return responseMessage || '请求的接口不存在';
  }

  if (error.response?.status && error.response.status >= 500) {
    return responseMessage || '服务异常，请稍后重试';
  }

  if (error.message?.trim()) {
    return error.message;
  }

  return responseMessage;
};

const createHttpClient = (): AxiosInstance => {
  const instance = axios.create({
    timeout: DEFAULT_TIMEOUT,
    baseURL: BASE_URL,
  });

  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const nextConfig = config as RequestConfig;

      if (!nextConfig.headers) {
        nextConfig.headers = new AxiosHeaders();
      }

      // 默认自动带 token，特殊请求可通过 skipAuthToken 跳过。
      const token = nextConfig.skipAuthToken ? null : getAuthToken();
      if (token) {
        nextConfig.headers.set('Authorization', `Bearer ${token}`);
      }

      // 非 GET 请求默认按 JSON 提交。
      if (!nextConfig.headers.get('Content-Type') && nextConfig.method !== 'get') {
        nextConfig.headers.set('Content-Type', 'application/json');
      }

      return nextConfig;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiResponse<unknown>>) => {
      const message = extractErrorMessage(error);
      const options = (error.config ?? {}) as RequestOptions;

      // HTTP 失败统一走事件中心，交给消息订阅者或跳转订阅者处理。
      if (!options.skipStatusBroadcast) {
        await notifyRequestSubscribers({
          type: 'http-error',
          code: error.response?.data?.code,
          message,
          method: error.config?.method,
          payload: error.response?.data,
          response: error.response as AxiosResponse<ApiResponse<unknown>> | undefined,
          status: error.response?.status,
          url: error.config?.url,
          options,
          skipErrorMessage: options.skipErrorMessage,
        });
      }

      throw new Error(message);
    },
  );

  return instance;
};

export const httpClient = createHttpClient();

const resolveSuccessCodes = (config?: RequestOptions): Array<number | string> =>
  config?.successCodes ?? SUCCESS_CODES;

// 给单次请求补齐默认行为，避免业务层每次手动兜底。
const normalizeRequestConfig = <TData = unknown>(
  config: RequestOptions<TData>,
): RequestOptions<TData> => ({
  ...config,
  transformEmptyToTrue: shouldTransformEmptyToTrue(config),
});

export const request = async <TResponse = unknown, TData = unknown>(
  config: RequestOptions<TData>,
): Promise<TResponse | ApiResponse<TResponse>> => {
  const normalizedConfig = normalizeRequestConfig(config);
  const response = await httpClient.request<
    ApiResponse<TResponse>,
    AxiosResponse<ApiResponse<TResponse>>,
    TData
  >(normalizedConfig);
  const payload = response.data;

  if (!isBusinessResponse<TResponse>(payload)) {
    return payload as TResponse;
  }

  // 标准业务响应默认根据 code 判断成功，并把 data 直接透出。
  const successCodes = resolveSuccessCodes(normalizedConfig);
  if (successCodes.includes(payload.code)) {
    const normalizedPayload = normalizedConfig.transformEmptyToTrue
      ? normalizeSuccessPayload(payload.data)
      : payload.data;

    if (!normalizedConfig.skipStatusBroadcast) {
      await notifyRequestSubscribers({
        type: 'response-success',
        code: payload.code,
        message: payload.messages,
        method: response.config.method,
        payload: normalizedPayload,
        response,
        status: response.status,
        url: response.config.url,
        options: normalizedConfig,
      });
    }

    return normalizedConfig.withFullResponse ? payload : (normalizedPayload as TResponse);
  }

  const errorMessage = resolveResponseMessage(payload);

  // 业务失败同样广播出去，外部可以统一处理提示或跳转。
  if (!normalizedConfig.skipStatusBroadcast) {
    await notifyRequestSubscribers({
      type: 'business-error',
      code: payload.code,
      message: errorMessage,
      method: response.config.method,
      payload,
      response,
      status: response.status,
      url: response.config.url,
      options: normalizedConfig,
      skipErrorMessage: normalizedConfig.skipErrorMessage,
    });
  }

  throw new Error(errorMessage);
};

export const get = async <TResponse = unknown>(
  url: string,
  config?: Omit<RequestOptions, 'url' | 'method' | 'data'>,
): Promise<TResponse | ApiResponse<TResponse>> => {
  return request<TResponse>({
    ...config,
    method: 'GET',
    url,
  });
};

export const post = async <TResponse = unknown, TData = unknown>(
  url: string,
  data?: TData,
  config?: Omit<RequestOptions<TData>, 'url' | 'method' | 'data'>,
): Promise<TResponse | ApiResponse<TResponse>> => {
  return request<TResponse, TData>({
    ...config,
    method: 'POST',
    url,
    data,
  });
};

export const put = async <TResponse = unknown, TData = unknown>(
  url: string,
  data?: TData,
  config?: Omit<RequestOptions<TData>, 'url' | 'method' | 'data'>,
): Promise<TResponse | ApiResponse<TResponse>> => {
  return request<TResponse, TData>({
    ...config,
    method: 'PUT',
    url,
    data,
  });
};

export const patch = async <TResponse = unknown, TData = unknown>(
  url: string,
  data?: TData,
  config?: Omit<RequestOptions<TData>, 'url' | 'method' | 'data'>,
): Promise<TResponse | ApiResponse<TResponse>> => {
  return request<TResponse, TData>({
    ...config,
    method: 'PATCH',
    url,
    data,
  });
};

export const del = async <TResponse = unknown>(
  url: string,
  config?: Omit<RequestOptions, 'url' | 'method' | 'data'>,
): Promise<TResponse | ApiResponse<TResponse>> => {
  return request<TResponse>({
    ...config,
    method: 'DELETE',
    url,
  });
};

export const addRequestInterceptor = (
  onFulfilled: RequestInterceptorFulfilled,
  onRejected?: RequestInterceptorRejected,
): number => {
  return httpClient.interceptors.request.use(onFulfilled, onRejected);
};

export const removeRequestInterceptor = (interceptorId: number): void => {
  httpClient.interceptors.request.eject(interceptorId);
};

export const addResponseInterceptor = <T = unknown>(
  onFulfilled: ResponseInterceptorFulfilled<T>,
  onRejected?: ResponseInterceptorRejected,
): number => {
  return httpClient.interceptors.response.use(onFulfilled, onRejected);
};

export const removeResponseInterceptor = (interceptorId: number): void => {
  httpClient.interceptors.response.eject(interceptorId);
};

export const setupNetworkListeners = (): (() => void) => {
  let previousOnlineState: boolean | null = null;

  // 只在网络状态真正发生变化时广播，避免重复提示。
  const unsubscribe = NetInfo.addEventListener(async (state) => {
    const isOnline = Boolean(state.isConnected && state.isInternetReachable !== false);

    if (previousOnlineState === isOnline) {
      return;
    }

    previousOnlineState = isOnline;

    await notifyRequestSubscribers({
      type: isOnline ? 'network-online' : 'network-offline',
      message: isOnline ? '网络已恢复' : '当前网络不可用，请检查网络连接',
    });
  });

  return unsubscribe;
};
