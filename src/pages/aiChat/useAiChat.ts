// import { useCallback, useMemo, useRef, useState } from 'react';
// import { NativeModules } from 'react-native';
// import { GiftedChat, type IMessage } from 'react-native-gifted-chat';
// import { v4 as uuidv4 } from 'uuid';

// import STORAGE_KEYS from '~/common/storage-keys';
// import { useWebSocketService } from '~/hooks';
// import storage from '~/utils/storage';

// const CURRENT_USER_ID = 1;
// const AI_USER_ID = 2;
// const AI_BACKEND_PORT = 9000;

// const aiUser = {
//   _id: AI_USER_ID,
//   name: 'Lingxi AI',
//   avatar: 'https://i.pravatar.cc/150?img=32',
// };

// const user = {
//   _id: CURRENT_USER_ID,
//   name: 'Me',
// };

// type WsEventType = 'connected' | 'delta' | 'done' | 'error';

// interface WsChatEvent {
//   event: WsEventType;
//   data: string;
// }

// interface WsChatRequestPayload extends Record<string, unknown> {
//   sessionId: string;
//   message: string;
//   token: string;
//   enableWebSearch: boolean;
// }

// interface UseAiChatResult {
//   isTyping: boolean;
//   messages: IMessage[];
//   onSend: (newMessages?: IMessage[]) => Promise<void>;
//   user: {
//     _id: number;
//     name: string;
//   };
// }

// const buildAiMessage = (text: string, id?: string): IMessage => ({
//   _id: id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
//   text,
//   createdAt: new Date(),
//   user: aiUser,
// });

// const buildWelcomeMessage = (): IMessage =>
//   buildAiMessage('你好，我是 Lingxi AI。你可以问我产品、代码或业务相关问题。');

// const extractDevMachineHost = (): string | null => {
//   const scriptUrl = NativeModules.SourceCode?.scriptURL;
//   if (!scriptUrl) {
//     return null;
//   }
//   const matched = scriptUrl.match(/https?:\/\/([^/:]+)(?::\d+)?/);
//   return matched?.[1] ?? null;
// };

// const resolveWsUrl = (): string => {
//   const host = extractDevMachineHost() ?? 'localhost';
//   return `ws://${host}:${AI_BACKEND_PORT}/ws/chat`;
// };

// const getAuthToken = (): string | null => {
//   const token = storage.getItemSync<string>(STORAGE_KEYS.AUTH_TOKEN);
//   if (!token || typeof token !== 'string') {
//     return null;
//   }
//   return token;
// };

// const parseWsEvent = (rawMessage: string): WsChatEvent => {
//   const parsed = JSON.parse(rawMessage) as Partial<WsChatEvent>;
//   return {
//     event: (parsed.event ?? 'error') as WsEventType,
//     data: typeof parsed.data === 'string' ? parsed.data : '',
//   };
// };

// const useAiChat = (): UseAiChatResult => {
//   const [messages, setMessages] = useState<IMessage[]>(() => [buildWelcomeMessage()]);
//   const [isTyping, setIsTyping] = useState(false);

//   const sessionIdRef = useRef(`mobile-${uuidv4()}`);
//   const streamingMessageIdRef = useRef<string | null>(null);
//   const pendingPayloadRef = useRef<WsChatRequestPayload | null>(null);

//   const pushSystemAiMessage = useCallback((text: string) => {
//     setMessages((prevMessages) => GiftedChat.append(prevMessages, [buildAiMessage(text)]));
//   }, []);

//   const clearStreamingState = useCallback(() => {
//     streamingMessageIdRef.current = null;
//     setIsTyping(false);
//   }, []);

//   const upsertStreamingAiMessage = useCallback((chunk: string) => {
//     const currentId = streamingMessageIdRef.current;
//     if (!currentId) {
//       const firstChunkMessage = buildAiMessage(chunk, `ai-stream-${Date.now()}`);
//       streamingMessageIdRef.current = String(firstChunkMessage._id);
//       setMessages((prevMessages) => GiftedChat.append(prevMessages, [firstChunkMessage]));
//       return;
//     }

//     setMessages((prevMessages) =>
//       prevMessages.map((item) =>
//         item._id === currentId
//           ? {
//               ...item,
//               text: `${item.text}${chunk}`,
//             }
//           : item,
//       ),
//     );
//   }, []);

//   const { connect, send } = useWebSocketService<WsChatEvent>({
//     url: resolveWsUrl,
//     config: {
//       maxRetries: 5,
//       initialBackoffMs: 1000,
//       heartbeatIntervalMs: 20_000,
//       connectionTimeoutMs: 10_000,
//     },
//     parser: parseWsEvent,
//     onConnected: () => {
//       const pendingPayload = pendingPayloadRef.current;
//       if (!pendingPayload) {
//         return;
//       }
//       const delivered = send(pendingPayload);
//       if (delivered) {
//         pendingPayloadRef.current = null;
//       }
//     },
//     onMessage: (payload) => {
//       switch (payload.event) {
//         case 'connected':
//           return;
//         case 'delta':
//           setIsTyping(true);
//           upsertStreamingAiMessage(payload.data);
//           return;
//         case 'done':
//           clearStreamingState();
//           return;
//         case 'error':
//           clearStreamingState();
//           pushSystemAiMessage(payload.data || 'AI 服务出现异常，请稍后重试。');
//           return;
//         default:
//           return;
//       }
//     },
//     onError: (socketError) => {
//       clearStreamingState();
//       pushSystemAiMessage(`连接异常：${socketError.message}`);
//     },
//     onDisconnected: () => {
//       clearStreamingState();
//     },
//   });

//   const onSend = useCallback(
//     async (newMessages: IMessage[] = []) => {
//       if (newMessages.length === 0) {
//         return;
//       }

//       const latestUserMessage = newMessages[0];
//       setMessages((prevMessages) => GiftedChat.append(prevMessages, [latestUserMessage]));
//       setIsTyping(true);
//       streamingMessageIdRef.current = null;

//       const token = getAuthToken();
//       if (!token) {
//         clearStreamingState();
//         pushSystemAiMessage('未找到登录凭证，请先登录后再使用 AI 对话。');
//         return;
//       }

//       const payload: WsChatRequestPayload = {
//         sessionId: sessionIdRef.current,
//         message: latestUserMessage.text,
//         token,
//         enableWebSearch: false,
//       };

//       const delivered = send(payload);
//       if (delivered) {
//         return;
//       }

//       pendingPayloadRef.current = payload;
//       connect();
//     },
//     [clearStreamingState, connect, pushSystemAiMessage, send],
//   );

//   const chatUser = useMemo(() => user, []);

//   return {
//     messages,
//     onSend,
//     isTyping,
//     user: chatUser,
//   };
// };

// export default useAiChat;
