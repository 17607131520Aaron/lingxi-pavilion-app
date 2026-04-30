export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  images?: string[];
  timestamp: number;
  isTyping?: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export interface AiChatHook extends ChatState {
  sendMessage: (content: string, images?: string[]) => Promise<void>;
  clearMessages: () => void;
  stopGenerating: () => void;
}
