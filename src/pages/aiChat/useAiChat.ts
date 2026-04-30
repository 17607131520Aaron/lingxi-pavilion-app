import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { GiftedChat, type IMessage } from 'react-native-gifted-chat';

import STORAGE_KEYS from '~/common/storage-keys';
import { useWebSocketService } from '~/hooks';
import { get, httpClient } from '~/utils/request';
import storage from '~/utils/storage';

const CURRENT_USER_ID = 1;
const AI_USER_ID = 2;
const AI_RESPONSE_TIMEOUT_MS = 30_000;

const aiUser = {
  _id: AI_USER_ID,
  name: 'Lingxi AI',
};

const user = {
  _id: CURRENT_USER_ID,
  name: '我',
};

const createSessionId = (): string => {
  return `mobile-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

type WsEventType = 'connected' | 'delta' | 'done' | 'error';

interface WsChatEvent {
  event: WsEventType;
  data: string;
}

interface WsChatRequestPayload extends Record<string, unknown> {
  sessionId: string;
  message: string;
  token: string;
  enableWebSearch: boolean;
}

interface ChatSessionMessageDto {
  role: 'user' | 'assistant';
  content: string;
  enableWebSearch: boolean;
  createdAt: number;
}

interface UseAiChatResult {
  isTyping: boolean;
  messages: IMessage[];
  onSend: (newMessages?: IMessage[]) => Promise<void>;
  user: {
    _id: number;
    name: string;
  };
}

const buildAiMessage = (text: string, id?: string): IMessage => ({
  _id: id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  text,
  createdAt: new Date(),
  user: aiUser,
});

const buildWelcomeMessage = (): IMessage =>
  buildAiMessage('你好，我是 Lingxi AI。你可以直接问我业务、代码或产品问题。');

const buildHistoryMessage = (item: ChatSessionMessageDto, index: number): IMessage => ({
  _id: `history-${item.role}-${item.createdAt}-${index}`,
  text: item.content,
  createdAt: new Date(item.createdAt),
  user: item.role === 'assistant' ? aiUser : user,
});

const getAuthToken = (): string | null => {
  const token = storage.getItemSync<string>(STORAGE_KEYS.AUTH_TOKEN);
  if (!token || typeof token !== 'string') {
    return null;
  }

  return token;
};

const parseWsEvent = (rawMessage: string): WsChatEvent => {
  const parsed = JSON.parse(rawMessage) as Partial<WsChatEvent>;
  return {
    event: (parsed.event ?? 'error') as WsEventType,
    data: typeof parsed.data === 'string' ? parsed.data : '',
  };
};

const resolveWsUrl = (): string | null => {
  const baseUrl = httpClient.defaults.baseURL;
  if (!baseUrl || typeof baseUrl !== 'string') {
    return null;
  }

  return `${baseUrl.replace(/^http/, 'ws')}/ws/chat`;
};

const useAiChat = (): UseAiChatResult => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sessionIdRef = useRef(createSessionId());
  const streamingMessageIdRef = useRef<string | null>(null);
  const pendingPayloadRef = useRef<WsChatRequestPayload | null>(null);
  const responseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pushSystemAiMessage = useCallback((text: string): void => {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, [buildAiMessage(text)]));
  }, []);

  const clearResponseTimeout = useCallback((): void => {
    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }
  }, []);

  const startResponseTimeout = useCallback((): void => {
    clearResponseTimeout();
    responseTimeoutRef.current = setTimeout(() => {
      pendingPayloadRef.current = null;
      streamingMessageIdRef.current = null;
      setIsTyping(false);
      pushSystemAiMessage('AI 服务响应超时，请检查后端服务或稍后重试。');
    }, AI_RESPONSE_TIMEOUT_MS);
  }, [clearResponseTimeout, pushSystemAiMessage]);

  const clearStreamingState = useCallback((): void => {
    clearResponseTimeout();
    streamingMessageIdRef.current = null;
    setIsTyping(false);
  }, [clearResponseTimeout]);

  const upsertStreamingAiMessage = useCallback((chunk: string): void => {
    const currentId = streamingMessageIdRef.current;
    if (!currentId) {
      const firstChunkMessage = buildAiMessage(chunk, `ai-stream-${Date.now()}`);
      streamingMessageIdRef.current = String(firstChunkMessage._id);
      setMessages((prevMessages) => GiftedChat.append(prevMessages, [firstChunkMessage]));
      return;
    }

    setMessages((prevMessages) =>
      prevMessages.map((item) =>
        item._id === currentId
          ? {
              ...item,
              text: `${item.text}${chunk}`,
            }
          : item,
      ),
    );
  }, []);

  const loadHistory = useCallback(async (): Promise<void> => {
    try {
      const response = (await get<ChatSessionMessageDto[]>(
        `/ai/sessions/${sessionIdRef.current}/messages`,
        {
          skipErrorMessage: true,
        },
      )) as ChatSessionMessageDto[];

      if (response.length > 0) {
        const historyMessages = response
          .map((item, index) => buildHistoryMessage(item, index))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setMessages(historyMessages);
        return;
      }

      setMessages([buildWelcomeMessage()]);
    } catch {
      setMessages([buildWelcomeMessage()]);
    }
  }, []);

  const { connect, send } = useWebSocketService<WsChatEvent>({
    url: resolveWsUrl,
    autoConnect: false,
    config: {
      maxRetries: 5,
      initialBackoffMs: 1000,
      heartbeatIntervalMs: 20_000,
      connectionTimeoutMs: 10_000,
    },
    parser: parseWsEvent,
    onConnected: () => {
      const pendingPayload = pendingPayloadRef.current;
      if (!pendingPayload) {
        return;
      }

      const delivered = send(pendingPayload);
      if (delivered) {
        pendingPayloadRef.current = null;
      }
    },
    onMessage: (payload) => {
      switch (payload.event) {
        case 'connected':
          return;
        case 'delta':
          startResponseTimeout();
          setIsTyping(true);
          upsertStreamingAiMessage(payload.data);
          return;
        case 'done':
          clearStreamingState();
          return;
        case 'error':
          clearStreamingState();
          pushSystemAiMessage(payload.data || 'AI 服务出现异常，请稍后重试。');
          return;
        default:
          return;
      }
    },
    onError: (socketError) => {
      clearStreamingState();
      pushSystemAiMessage(`连接异常：${socketError.message}`);
    },
    onDisconnected: () => {
      clearStreamingState();
    },
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadHistory().catch(() => undefined);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [loadHistory]);

  useEffect(() => {
    return () => {
      clearResponseTimeout();
    };
  }, [clearResponseTimeout]);

  const onSend = useCallback(
    async (newMessages: IMessage[] = []): Promise<void> => {
      if (newMessages.length === 0) {
        return;
      }

      const latestUserMessage = newMessages[0];
      if (!latestUserMessage.text.trim()) {
        return;
      }

      setMessages((prevMessages) => GiftedChat.append(prevMessages, [latestUserMessage]));
      setIsTyping(true);
      streamingMessageIdRef.current = null;
      startResponseTimeout();

      const token = getAuthToken();
      if (!token) {
        clearStreamingState();
        Alert.alert('提示', '未找到登录凭证，请先登录后再使用 AI 对话。');
        return;
      }

      const payload: WsChatRequestPayload = {
        sessionId: sessionIdRef.current,
        message: latestUserMessage.text.trim(),
        token,
        enableWebSearch: false,
      };

      const delivered = send(payload);
      if (delivered) {
        return;
      }

      pendingPayloadRef.current = payload;
      connect();
    },
    [clearStreamingState, connect, send, startResponseTimeout],
  );

  const chatUser = useMemo(() => user, []);

  return {
    messages,
    onSend,
    isTyping,
    user: chatUser,
  };
};

export default useAiChat;
