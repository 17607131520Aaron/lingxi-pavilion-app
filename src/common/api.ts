import storage from '~/utils/storage.ts';

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

// 默认的环境配置
const DEFAULT_ENV_CONFIG = Object.freeze({
  [ENV_KEY.TEST]: {
    BASE_URL: 'http://192.168.1.6:9000',
    AI_CHAT: '/api/app/ai/chat',
    AI_CHAT_SSE: '/api/app/ai/chat/stream',
  },
  [ENV_KEY.PRE]: {
    BASE_URL: 'http://192.168.1.6:9000',
    AI_CHAT: '/api/app/ai/chat',
    AI_CHAT_SSE: '/api/app/ai/chat/stream',
  },
  [ENV_KEY.PROD]: {
    BASE_URL: 'http://192.168.1.6:9000',
    AI_CHAT: '/api/app/ai/chat',
    AI_CHAT_SSE: '/api/app/ai/chat/stream',
  },
});

const API_URL_STORAGE_KEY = 'custom_api_base_url';

/**
 * 获取环境配置，支持自定义 API 地址
 */
export const getEnvConfig = (key: string): EnvConfigItem | undefined => {
  const config = DEFAULT_ENV_CONFIG[key as keyof typeof DEFAULT_ENV_CONFIG];
  if (!config) {
    return undefined;
  }

  // 尝试从存储中读取自定义 API 地址
  try {
    const customUrl = storage.getItemSync<string>(API_URL_STORAGE_KEY);
    if (customUrl) {
      return { ...config, BASE_URL: customUrl };
    }
  } catch {
    // 忽略错误，使用默认配置
  }

  return config;
};

// 当前环境配置（默认使用 test 环境）
export const API_CONFIG = getEnvConfig(ENV_KEY.TEST) ?? DEFAULT_ENV_CONFIG[ENV_KEY.TEST];
