import type { ApiResponse, RequestOptions } from './request';
import type { AxiosResponse } from 'axios';

export type RequestEventType =
  | 'response-success'
  | 'business-error'
  | 'http-error'
  | 'network-online'
  | 'network-offline';

export interface RequestEvent<T = unknown> {
  type: RequestEventType;
  code?: number | string;
  message?: string;
  method?: string;
  payload?: T;
  response?: AxiosResponse<ApiResponse<unknown>>;
  status?: number;
  url?: string;
  options?: RequestOptions;
  skipErrorMessage?: boolean;
}

export type RequestSubscriber<T = unknown> = (event: RequestEvent<T>) => void | Promise<void>;

// 请求事件中心独立维护，避免和请求实现细节耦在一起。
const requestSubscribers = new Set<RequestSubscriber>();

export const notifyRequestSubscribers = async <T = unknown>(
  event: RequestEvent<T>,
): Promise<void> => {
  if (!requestSubscribers.size) {
    return;
  }

  await Promise.allSettled(
    Array.from(requestSubscribers).map(async (subscriber) => {
      await subscriber(event);
    }),
  );
};

export const subscribeRequest = <T = unknown>(subscriber: RequestSubscriber<T>): (() => void) => {
  requestSubscribers.add(subscriber as RequestSubscriber);

  return () => {
    requestSubscribers.delete(subscriber as RequestSubscriber);
  };
};

export const clearRequestSubscribers = (): void => {
  requestSubscribers.clear();
};
