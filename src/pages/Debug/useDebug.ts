/* eslint-disable no-console */
interface UseDebugActions {
  handelEnv: () => void;
  handelStorage: () => void;
  handelDB: () => void;
}

const useDebug = (): UseDebugActions => {
  const handelEnv = (): void => {
    console.log('切换环境');
  };

  // 点击存储工具测试
  const handelStorage = (): void => {
    console.log('存储工具测试');
  };

  // DB 示例页（增删改查)
  const handelDB = (): void => {
    console.log('DB 示例页（增删改查)');
  };

  return { handelEnv, handelStorage, handelDB };
};

export default useDebug;
