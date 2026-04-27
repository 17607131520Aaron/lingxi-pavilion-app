import { setupRequestMessageSubscriber } from './requestMessageSubscriber';
import { setupRequestNavigateSubscriber } from './requestNavigateSubscriber';

let teardownRequestSubscribers: (() => void) | null = null;

// 应用启动时统一挂默认订阅者，避免每个入口重复初始化。
export const setupRequestSubscribers = (): (() => void) => {
  if (teardownRequestSubscribers) {
    return teardownRequestSubscribers;
  }

  const teardownMessageSubscriber = setupRequestMessageSubscriber();
  const teardownNavigateSubscriber = setupRequestNavigateSubscriber();

  teardownRequestSubscribers = () => {
    teardownMessageSubscriber();
    teardownNavigateSubscriber();
    teardownRequestSubscribers = null;
  };

  return teardownRequestSubscribers;
};
