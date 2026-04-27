import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type WebSocketCallbacks,
  type WebSocketConfig,
  WebSocketService,
} from 'react-native-websocket-service';

type ResolvedUrl = string | null;

const resolveUrl = (url: string | (() => string | null | undefined)): ResolvedUrl => {
  if (typeof url === 'function') {
    return url() ?? null;
  }

  return url;
};

const defaultMessageParser = <TData>(rawMessage: string): TData => {
  try {
    return JSON.parse(rawMessage) as TData;
  } catch {
    return rawMessage as TData;
  }
};

export type WebSocketConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export interface UseWebSocketServiceOptions<TIncomingMessage = unknown> {
  url: string | (() => string | null | undefined);
  config?: Omit<WebSocketConfig, 'url'>;
  enabled?: boolean;
  autoConnect?: boolean;
  parser?: (rawMessage: string) => TIncomingMessage;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Error) => void;
  onMessage?: (message: TIncomingMessage, rawMessage: string) => void;
}

export interface UseWebSocketServiceResult<TIncomingMessage = unknown> {
  connect: () => void;
  disconnect: () => void;
  forceReconnect: () => void;
  send: (payload: Record<string, unknown>) => boolean;
  service: WebSocketService | null;
  status: WebSocketConnectionStatus;
  isConnected: boolean;
  lastMessage: TIncomingMessage | null;
  lastRawMessage: string | null;
  error: Error | null;
  readyState?: number;
}

const useWebSocketService = <TIncomingMessage = unknown>(
  options: UseWebSocketServiceOptions<TIncomingMessage>,
): UseWebSocketServiceResult<TIncomingMessage> => {
  const {
    url,
    config,
    enabled = true,
    autoConnect = true,
    parser = defaultMessageParser,
    onConnected,
    onDisconnected,
    onError,
    onMessage,
  } = options;

  const [status, setStatus] = useState<WebSocketConnectionStatus>('idle');
  const [lastMessage, setLastMessage] = useState<TIncomingMessage | null>(null);
  const [lastRawMessage, setLastRawMessage] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [service, setService] = useState<WebSocketService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [readyState, setReadyState] = useState<number | undefined>(undefined);

  const serviceRef = useRef<WebSocketService | null>(null);
  const callbacksRef = useRef({
    onConnected,
    onDisconnected,
    onError,
    onMessage,
    parser,
  });

  useEffect(() => {
    callbacksRef.current = {
      onConnected,
      onDisconnected,
      onError,
      onMessage,
      parser,
    };
  }, [onConnected, onDisconnected, onError, onMessage, parser]);

  const resolvedUrl = useMemo(() => resolveUrl(url), [url]);

  const callbacks = useMemo<WebSocketCallbacks>(
    () => ({
      onConnected: () => {
        setStatus('connected');
        setError(null);
        setIsConnected(true);
        setReadyState(serviceRef.current?.readyState);
        callbacksRef.current.onConnected?.();
      },
      onDisconnected: () => {
        setStatus('disconnected');
        setIsConnected(false);
        setReadyState(serviceRef.current?.readyState);
        callbacksRef.current.onDisconnected?.();
      },
      onError: (incomingError) => {
        setStatus('error');
        setError(incomingError);
        setIsConnected(false);
        setReadyState(serviceRef.current?.readyState);
        callbacksRef.current.onError?.(incomingError);
      },
      onMessage: (rawMessage) => {
        setLastRawMessage(rawMessage);
        const parsedMessage = callbacksRef.current.parser(rawMessage);
        setLastMessage(parsedMessage);
        callbacksRef.current.onMessage?.(parsedMessage, rawMessage);
      },
    }),
    [],
  );

  const teardownService = useCallback(() => {
    serviceRef.current?.destroy();
    serviceRef.current = null;
  }, []);

  const destroyService = useCallback(() => {
    teardownService();
    setService(null);
    setIsConnected(false);
    setReadyState(undefined);
    setStatus('idle');
    setError(null);
  }, [teardownService]);

  const connect = useCallback(() => {
    if (!enabled || !resolvedUrl) {
      return;
    }

    serviceRef.current ??= new WebSocketService(
      {
        url: resolvedUrl,
        ...config,
      },
      callbacks,
    );

    if (!serviceRef.current) {
      return;
    }

    if (!service) {
      setService(serviceRef.current);
    }

    setStatus('connecting');
    setError(null);
    setReadyState(serviceRef.current.readyState);
    serviceRef.current.connect();
  }, [callbacks, config, enabled, resolvedUrl, service]);

  const disconnect = useCallback(() => {
    if (!serviceRef.current) {
      return;
    }

    serviceRef.current.disconnect();
    setStatus('disconnected');
    setIsConnected(false);
    setReadyState(serviceRef.current.readyState);
  }, []);

  const forceReconnect = useCallback(() => {
    if (!serviceRef.current) {
      connect();
      return;
    }

    setStatus('connecting');
    serviceRef.current.forceReconnect();
  }, [connect]);

  const send = useCallback((payload: Record<string, unknown>): boolean => {
    if (!serviceRef.current?.isConnected) {
      return false;
    }

    serviceRef.current.send(payload);
    return true;
  }, []);

  useEffect(() => {
    teardownService();

    if (!enabled || !resolvedUrl || !autoConnect) {
      return undefined;
    }

    connect();

    return () => {
      teardownService();
    };
  }, [autoConnect, connect, enabled, resolvedUrl, teardownService]);

  useEffect(() => {
    if (enabled || !serviceRef.current) {
      return;
    }

    disconnect();
    destroyService();
  }, [destroyService, disconnect, enabled]);

  return {
    connect,
    disconnect,
    forceReconnect,
    send,
    service,
    status,
    isConnected,
    lastMessage,
    lastRawMessage,
    error,
    readyState,
  };
};

export default useWebSocketService;
