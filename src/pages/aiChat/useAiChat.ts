import { useCallback, useRef, useState } from 'react';

import { API_CONFIG } from '~/common/api';
import { post } from '~/utils/request';

import type { AiChatHook, ChatMessage, ChatState } from './types';

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

interface ChatResponse {
  answer: string;
}

const useAiChat = (): AiChatHook => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionIdRef = useRef<string>('');

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      timestamp: Date.now(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));

    return newMessage.id;
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<ChatMessage>) => {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.map((msg) => (msg.id === id ? { ...msg, ...updates } : msg)),
    }));
  }, []);

  const simulateTyping = useCallback(
    (messageId: string, fullText: string): void => {
      let index = 0;
      const typingSpeed = 20;

      const typeNextChar = (): void => {
        if (abortControllerRef.current?.signal.aborted) {
          updateMessage(messageId, { isTyping: false });
          setState((prev) => ({ ...prev, isLoading: false }));
          return;
        }

        if (index < fullText.length) {
          index++;
          updateMessage(messageId, {
            content: fullText.slice(0, index),
            isTyping: index < fullText.length,
          });
          typingTimerRef.current = setTimeout(typeNextChar, typingSpeed);
        } else {
          updateMessage(messageId, { isTyping: false });
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      };

      typeNextChar();
    },
    [updateMessage],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || state.isLoading) {
        return;
      }

      abortControllerRef.current = new AbortController();

      addMessage({ role: 'user', content: content.trim() });
      const assistantMessageId = addMessage({ role: 'assistant', content: '', isTyping: true });

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await post<ChatResponse>(
          API_CONFIG.AI_CHAT,
          {
            sessionId: sessionIdRef.current || undefined,
            message: content.trim(),
            enableWebSearch: false,
          },
          {
            skipErrorMessage: true,
            skipStatusBroadcast: true,
          },
        );

        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        const assistantContent = (response as ChatResponse).answer || '抱歉，我无法回答这个问题。';
        simulateTyping(assistantMessageId, assistantContent);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '请求失败，请稍后重试';

        updateMessage(assistantMessageId, {
          content: `抱歉，发生了错误：${errorMessage}`,
          isTyping: false,
        });

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      }
    },
    [state.isLoading, addMessage, updateMessage, simulateTyping],
  );

  const clearMessages = useCallback(() => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    abortControllerRef.current?.abort();
    sessionIdRef.current = '';
    setState({
      messages: [],
      isLoading: false,
      error: null,
    });
  }, []);

  const stopGenerating = useCallback(() => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    abortControllerRef.current?.abort();
    setState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  return {
    ...state,
    sendMessage,
    clearMessages,
    stopGenerating,
  };
};

export default useAiChat;
