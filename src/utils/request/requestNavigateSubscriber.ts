import { ROUTE_REDIRECT_KEYS } from '~/common/route-redirect';

import { subscribeRequest } from './requestSubscriber';
import { publishRouteRedirectByKey } from './routeRedirect';

import type { RequestEvent } from './requestSubscriber';

export interface RequestNavigateContext {
  event: RequestEvent;
  navigateByKey: typeof publishRouteRedirectByKey;
}

export interface RequestNavigateRule {
  id: string;
  handle: (context: RequestNavigateContext) => boolean | Promise<boolean>;
}

let teardownRequestNavigateSubscriber: (() => void) | null = null;

const requestNavigateRules: RequestNavigateRule[] = [];

// 默认规则：鉴权失效时跳到登录页。
const defaultUnauthorizedRule: RequestNavigateRule = {
  id: 'http-401-to-login',
  handle: async ({ event, navigateByKey }) => {
    const isHttpUnauthorized = event.type === 'http-error' && event.status === 401;
    const isBusinessUnauthorized =
      event.type === 'business-error' && (event.code === 401 || event.code === '401');

    if (!isHttpUnauthorized && !isBusinessUnauthorized) {
      return false;
    }

    navigateByKey(ROUTE_REDIRECT_KEYS.UNAUTHORIZED);
    return true;
  },
};

requestNavigateRules.push(defaultUnauthorizedRule);

const handleRequestNavigateEvent = async (event: RequestEvent): Promise<void> => {
  const context: RequestNavigateContext = {
    event,
    navigateByKey: publishRouteRedirectByKey,
  };

  for (const rule of requestNavigateRules) {
    const handled = await rule.handle(context);
    if (handled) {
      return;
    }
  }
};

export const addRequestNavigateRule = (rule: RequestNavigateRule): (() => void) => {
  requestNavigateRules.push(rule);

  return () => {
    const index = requestNavigateRules.findIndex((item) => item.id === rule.id);
    if (index >= 0) {
      requestNavigateRules.splice(index, 1);
    }
  };
};

export const clearRequestNavigateRules = (): void => {
  requestNavigateRules.splice(0, requestNavigateRules.length, defaultUnauthorizedRule);
};

// 跳转订阅者单独初始化，避免导入模块时直接产生副作用。
export const setupRequestNavigateSubscriber = (): (() => void) => {
  if (teardownRequestNavigateSubscriber) {
    return teardownRequestNavigateSubscriber;
  }

  const unsubscribe = subscribeRequest((event) => {
    // eslint-disable-next-line no-void
    void handleRequestNavigateEvent(event);
  });

  teardownRequestNavigateSubscriber = () => {
    unsubscribe();
    teardownRequestNavigateSubscriber = null;
  };

  return teardownRequestNavigateSubscriber;
};
