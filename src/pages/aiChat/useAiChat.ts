import { useCallback, useRef, useState } from 'react';

import type { AiChatHook, ChatMessage, ChatState } from './types';

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

const mockResponses: Record<string, string> = {
  default: '你好！我是灵犀AI助手，很高兴为你服务。请问有什么我可以帮助你的吗？',
  你好: '你好！很高兴见到你！有什么我可以帮助你的吗？',
  hello: 'Hello! How can I help you today?',
  帮我写一篇关于人工智能的文章:
    '## 人工智能：改变世界的力量\n\n人工智能（Artificial Intelligence，简称AI）是计算机科学的一个重要分支，旨在创建能够模拟人类智能的系统。\n\n### 发展历程\n\n人工智能的概念最早在1956年的达特茅斯会议上提出。经过几十年的发展，AI已经从简单的规则系统发展到如今的深度学习和大语言模型。\n\n### 主要应用\n\n1. **自然语言处理**：如ChatGPT等对话系统\n2. **计算机视觉**：图像识别、人脸识别\n3. **自动驾驶**：特斯拉、Waymo等\n4. **医疗诊断**：辅助医生进行疾病诊断\n\n### 未来展望\n\n随着技术的不断进步，人工智能将在更多领域发挥重要作用，为人类生活带来更多便利。',
  用Python写一个快速排序算法:
    '```python\ndef quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    \n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    \n    return quick_sort(left) + middle + quick_sort(right)\n\n# 使用示例\narr = [3, 6, 8, 10, 1, 2, 1]\nsorted_arr = quick_sort(arr)\nprint(sorted_arr)  # 输出: [1, 1, 2, 3, 6, 8, 10]\n```\n\n快速排序的平均时间复杂度为 O(n log n)，是一种非常高效的排序算法。',
  把这句话翻译成英文: '请告诉我你需要翻译的具体内容，我会帮你翻译成英文。',
  解释一下量子计算的原理:
    '## 量子计算原理简介\n\n### 基本概念\n\n量子计算利用量子力学的特性来处理信息，主要基于以下原理：\n\n### 1. 量子比特（Qubit）\n\n与传统计算机使用的比特（0或1）不同，量子比特可以同时处于0和1的叠加态。\n\n### 2. 量子叠加\n\n一个量子比特可以同时表示0和1，这意味着量子计算机可以并行处理多个计算。\n\n### 3. 量子纠缠\n\n两个或多个量子比特可以产生纠缠，改变其中一个会立即影响另一个，无论它们相距多远。\n\n### 4. 量子干涉\n\n利用量子波的干涉特性，增强正确答案的概率，抑制错误答案。\n\n### 应用前景\n\n- 密码学\n- 药物研发\n- 优化问题\n- 人工智能\n\n量子计算有望在未来解决传统计算机无法处理的复杂问题。',
};

const getMockResponse = (input: string): string => {
  const normalizedInput = input.trim().toLowerCase();

  for (const [key, value] of Object.entries(mockResponses)) {
    if (
      normalizedInput.includes(key.toLowerCase()) ||
      key.toLowerCase().includes(normalizedInput)
    ) {
      return value;
    }
  }

  return `你说了："${input}"\n\n这是一个模拟回复。在实际应用中，这里会调用AI接口获取真实的回复内容。\n\n你可以尝试以下问题：\n- 你好\n- 帮我写一篇关于人工智能的文章\n- 用Python写一个快速排序算法\n- 解释一下量子计算的原理`;
};

const useAiChat = (): AiChatHook => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        // 模拟网络延迟
        await new Promise<void>((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        const assistantContent = getMockResponse(content.trim());
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
