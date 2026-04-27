import {
  DEFAULT_ROUTE_REDIRECT_CONFIG_MAP,
  type RouteRedirectConfig,
  type RouteRedirectConfigMap,
  type RouteRedirectKey,
} from '~/common/route-redirect';

interface RedirectRoutePayload {
  routeName: string;
  params?: Record<string, unknown>;
}

type RedirectRouteListener = (payload: RedirectRoutePayload) => void;

const redirectListeners = new Set<RedirectRouteListener>();

const routeRedirectConfigMap: Record<string, RouteRedirectConfig> = {
  ...DEFAULT_ROUTE_REDIRECT_CONFIG_MAP,
};

const subscribeRouteRedirect = (listener: RedirectRouteListener): (() => void) => {
  redirectListeners.add(listener);
  return () => {
    redirectListeners.delete(listener);
  };
};

const setRouteRedirectConfig = (
  businessKey: RouteRedirectKey,
  config: RouteRedirectConfig,
): void => {
  routeRedirectConfigMap[businessKey] = config;
};

const setRouteRedirectConfigMap = (configMap: RouteRedirectConfigMap): void => {
  Object.keys(configMap).forEach((businessKey) => {
    const config = configMap[businessKey];
    if (!config) {
      return;
    }
    routeRedirectConfigMap[businessKey] = config;
  });
};

const emitRouteRedirectByBusinessKey = (
  businessKey: RouteRedirectKey,
  runtimeParams?: Record<string, unknown>,
): void => {
  const routeConfig = routeRedirectConfigMap[businessKey];
  if (!routeConfig) {
    return;
  }

  const payload: RedirectRoutePayload = {
    routeName: routeConfig.routeName,
    params: {
      ...(routeConfig.params ?? {}),
      ...(runtimeParams ?? {}),
    },
  };

  redirectListeners.forEach((listener) => {
    listener(payload);
  });
};

export {
  emitRouteRedirectByBusinessKey,
  setRouteRedirectConfig,
  setRouteRedirectConfigMap,
  subscribeRouteRedirect,
};
export type { RedirectRoutePayload };
