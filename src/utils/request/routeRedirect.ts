import {
  DEFAULT_ROUTE_REDIRECT_CONFIG_MAP,
  type RouteRedirectConfig,
  type RouteRedirectConfigMap,
  type RouteRedirectKey,
} from '~/common/route-redirect';

type RouteRedirectListener = (config: RouteRedirectConfig) => void;

const listeners = new Set<RouteRedirectListener>();

let routeRedirectConfigMap: RouteRedirectConfigMap = {
  ...DEFAULT_ROUTE_REDIRECT_CONFIG_MAP,
};

export const getRouteRedirectConfigMap = (): RouteRedirectConfigMap => {
  return routeRedirectConfigMap;
};

export const setRouteRedirectConfigMap = (configMap: Partial<RouteRedirectConfigMap>): void => {
  routeRedirectConfigMap = {
    ...routeRedirectConfigMap,
    ...configMap,
  } as RouteRedirectConfigMap;
};

export const subscribeRouteRedirect = (listener: RouteRedirectListener): (() => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

export const publishRouteRedirect = (config: RouteRedirectConfig): void => {
  listeners.forEach((listener) => {
    listener(config);
  });
};

export const publishRouteRedirectByKey = (
  key: RouteRedirectKey,
  overrideConfig?: Partial<RouteRedirectConfig>,
): void => {
  const matchedConfig = routeRedirectConfigMap[key];

  if (!matchedConfig && !overrideConfig?.routeName) {
    return;
  }

  publishRouteRedirect({
    ...matchedConfig,
    ...overrideConfig,
  } as RouteRedirectConfig);
};
