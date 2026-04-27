import { Alert } from 'react-native';

import { subscribeRequest } from './requestSubscriber';

import type { RequestEvent } from './requestSubscriber';

let teardownRequestMessageSubscriber: (() => void) | null = null;

const showErrorMessage = (content: string): void => {
  Alert.alert('请求失败', content);
};

const showNetworkStatus = (content: string): void => {
  Alert.alert('网络状态', content);
};

const handleRequestMessageEvent = (event: RequestEvent): void => {
  if (event.type === 'network-online' && event.message) {
    showNetworkStatus(event.message);
    return;
  }

  if (event.type === 'network-offline' && event.message) {
    showNetworkStatus(event.message);
    return;
  }

  if (event.skipErrorMessage || !event.message) {
    return;
  }

  if (event.type === 'http-error' || event.type === 'business-error') {
    showErrorMessage(event.message);
  }
};

// 消息提示能力和请求本体解耦，后续替换成 Toast 也只改这里。
export const setupRequestMessageSubscriber = (): (() => void) => {
  if (teardownRequestMessageSubscriber) {
    return teardownRequestMessageSubscriber;
  }

  const unsubscribe = subscribeRequest(handleRequestMessageEvent);
  teardownRequestMessageSubscriber = () => {
    unsubscribe();
    teardownRequestMessageSubscriber = null;
  };

  return teardownRequestMessageSubscriber;
};
