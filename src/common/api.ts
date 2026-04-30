// 定义配置项的类型
interface EnvConfigItem {
  BASE_URL: string;
  AI_CHAT: string;
  AI_CHAT_SSE: string;
}

// 环境key
export const ENV_KEY = {
  TEST: 'test', // 测试环境
  PRE: 'pre', // 预发环境
  PROD: 'prod', // 生产环境
} as const;

// 根据环境获取配置
export const ENV_CONFING = Object.freeze({
  [ENV_KEY.TEST]: {
    BASE_URL: 'http://172.23.101.190:9000',
    AI_CHAT: '/ai/chat',
    AI_CHAT_SSE: '/ai/chat/sse',
  },
  [ENV_KEY.PRE]: {
    BASE_URL: 'http://172.23.101.190:9000',
    AI_CHAT: '/ai/chat',
    AI_CHAT_SSE: '/ai/chat/sse',
  },
  [ENV_KEY.PROD]: {
    BASE_URL: 'http://172.23.101.190:9000',
    AI_CHAT: '/ai/chat',
    AI_CHAT_SSE: '/ai/chat/sse',
  },
});

/**
 * 获取当前环境配置
 */

export const getEnvConfig = (key: string): EnvConfigItem | undefined => {
  return ENV_CONFING[key as keyof typeof ENV_CONFING];
};
