import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export type RequestInterceptorFulfilled = (
  config: InternalAxiosRequestConfig,
) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;

export type RequestInterceptorRejected = (error: AxiosError) => unknown;

export type ResponseInterceptorFulfilled<T = unknown> = (
  response: AxiosResponse<T>,
) => AxiosResponse<T> | Promise<AxiosResponse<T>>;

export type ResponseInterceptorRejected = (error: AxiosError) => unknown;

export type RequestConfig = InternalAxiosRequestConfig & RequestOptions;

export interface ApiResponse<T = unknown> {
  code: number | string;
  data: T;
  message?: string;
  messages?: string;
}

export interface RequestOptions<TData = unknown> {
  url?: string;
  method?: string;
  data?: TData;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  timeout?: number;
  baseURL?: string;
  successCodes?: Array<number | string>;
  withFullResponse?: boolean;
  skipErrorMessage?: boolean;
  skipStatusBroadcast?: boolean;
  skipAuthToken?: boolean;
  transformEmptyToTrue?: boolean;
}
