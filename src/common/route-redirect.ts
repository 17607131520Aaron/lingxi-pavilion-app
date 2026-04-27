export const ROUTE_REDIRECT_KEYS = {
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const;

export type RouteRedirectBusinessKey =
  (typeof ROUTE_REDIRECT_KEYS)[keyof typeof ROUTE_REDIRECT_KEYS];
export type RouteRedirectKey = RouteRedirectBusinessKey | string;

export interface RouteRedirectConfig {
  routeName: string;
  params?: Record<string, unknown>;
}

export type RouteRedirectConfigMap = Record<RouteRedirectKey, RouteRedirectConfig>;

export const DEFAULT_ROUTE_REDIRECT_CONFIG_MAP: Record<
  RouteRedirectBusinessKey,
  RouteRedirectConfig
> = {
  [ROUTE_REDIRECT_KEYS.UNAUTHORIZED]: {
    routeName: 'login',
  },
};
